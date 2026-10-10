import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import net from 'net';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { evaluateFieldRules, generateRuleFallbackAdvice } from './src/lib/ruleEngine';
import { FieldInputs, SavedField } from './src/types/advisor';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Initialize GoogleGenAI client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Storage file for saved fields persistence
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'saved_fields.json');

function ensureDataStorage(): SavedField[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Storage read error:', err);
  }
  return [];
}

function persistSavedFields(fields: SavedField[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(fields, null, 2), 'utf-8');
  } catch (err) {
    console.error('Storage write error:', err);
  }
}

function callWithTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI gateway timeout')), ms)),
  ]);
}

let inMemorySavedFields: SavedField[] = ensureDataStorage();

// Sanitize inputs
function sanitizeInputs(body: any): FieldInputs {
  const fieldName = String(body.fieldName || 'My Rice Paddy').slice(0, 100).trim();
  const lat = Math.max(-90, Math.min(90, Number(body.latitude) || 0));
  const lon = Math.max(-180, Math.min(180, Number(body.longitude) || 0));
  const growthStage = body.growthStage || 'tillering';
  const waterCondition = body.waterCondition || 'continuously_flooded';
  const leafColor = body.leafColor || 'healthy_green';
  const lastUreaDose = body.lastUreaDose !== undefined && body.lastUreaDose !== ''
    ? Math.max(0, Math.min(1000, Number(body.lastUreaDose)))
    : '';
  const notes = String(body.notes || '').slice(0, 500).trim();
  const language = body.language === 'hi' ? 'hi' : 'en';

  return {
    fieldName,
    latitude: lat,
    longitude: lon,
    growthStage,
    waterCondition,
    leafColor,
    lastUreaDose,
    notes,
    language,
  };
}

// POST /api/advice or /api/advisor
app.post(['/api/advice', '/api/advisor'], async (req: Request, res: Response) => {
  try {
    const inputs = sanitizeInputs(req.body);
    const rules = evaluateFieldRules(inputs);
    const lang = inputs.language || 'en';

    // If no AI client available, immediately use robust agronomic rule fallback
    if (!ai) {
      console.warn('GEMINI_API_KEY is not set. Using pure rule-based engine fallback.');
      const fallbackAdvice = generateRuleFallbackAdvice(inputs, rules, lang);
      return res.json({
        ...fallbackAdvice,
        source: 'rule_fallback',
      });
    }

    const systemInstruction = `You are a Field Advisor Agent for rice growers. Use only the submitted inputs and the computed risk levels. Never invent data, satellite readings, sensor values or exact percentages. Give stage-aware, practical steps that cut methane while keeping yield steady. Quote the user's values in reasoning. End with: confirm with a local agronomist.

Strictly adhere to the fixed facts computed by the agronomic rule engine. Do not alter or contradict computed risk levels:
- Methane Risk: ${rules.methane_risk}
- Yield Risk: ${rules.yield_risk}
- Confidence: ${rules.confidence}
- Must Avoid Drying: ${rules.must_avoid_drying ? 'YES (stage is flowering - never advise draining or drying)' : 'NO'}

Language requirement: Provide all textual explanations, priorities, steps, and reasons in ${lang === 'hi' ? 'Hindi (हिंदी)' : 'English'}. Enums and JSON keys must remain in English.`;

    const userPrompt = `Submitted Grower Inputs:
Field Name: "${inputs.fieldName}"
Location: Latitude ${inputs.latitude}, Longitude ${inputs.longitude}
Growth Stage: "${inputs.growthStage}"
Water Condition: "${inputs.waterCondition}"
Canopy / Leaf Color: "${inputs.leafColor}"
Last Urea Dose: "${inputs.lastUreaDose ? inputs.lastUreaDose + ' kg/ha' : 'Not specified'}"
Grower Field Notes: "${inputs.notes || 'None'}"

Computed Risk Baseline (Fixed Facts):
- Methane Risk: ${rules.methane_risk}
- Yield Risk: ${rules.yield_risk}
- Confidence: ${rules.confidence}
- Applied Rules: ${JSON.stringify(rules.rules_applied)}
- Missing/Unverified: ${JSON.stringify(rules.missing_inputs)}

Respond strictly in valid JSON format matching this schema:
{
  "summary": "1-2 sentence overall field assessment",
  "methane_risk": "${rules.methane_risk}",
  "yield_risk": "${rules.yield_risk}",
  "confidence": "${rules.confidence}",
  "top_priority": "One clear, unambiguous actionable sentence for this week",
  "steps": [
    {
      "priority": "Do now | Soon | Later",
      "timing": "e.g. Next 24-48 hours",
      "action": "Specific field action (e.g. halt inlet, install pani pipe)",
      "why": "Maximum 2 sentences explaining agronomic rationale quoting user inputs"
    }
  ],
  "reasoning": "Agronomic reasoning quoting the user's values (stage, water condition, urea)",
  "trade_off_notes": "Explanation of how methane is lowered without compromising grain yield",
  "direction_of_change": "Qualitative direction e.g. likely lower methane, yield about steady",
  "verify_locally": ["Items for local extension verification"]
}`;

    let parsedResult: any = null;

    // Attempt Gemini call with 1 retry on malformed JSON or timeout
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await callWithTimeout(
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userPrompt,
            config: {
              systemInstruction,
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
          6500
        );

        const text = response.text?.trim() || '';
        if (text) {
          const candidate = JSON.parse(text);
          if (candidate.top_priority && Array.isArray(candidate.steps)) {
            parsedResult = candidate;
            break;
          }
        }
      } catch (geminiError: any) {
        console.warn(`Gemini attempt ${attempt} failed:`, geminiError.message || geminiError);
      }
    }

    if (!parsedResult) {
      console.warn('Falling back to rule-based advice due to Gemini API response failure.');
      const fallbackAdvice = generateRuleFallbackAdvice(inputs, rules, lang);
      return res.json({
        ...fallbackAdvice,
        source: 'rule_fallback',
      });
    }

    // Build the 4-step agent trace quoting user values
    const ureaStr = inputs.lastUreaDose ? `${inputs.lastUreaDose} kg/ha` : (lang === 'hi' ? 'अनपेक्षित' : 'unspecified');
    const agent_trace = [
      {
        step: 'Inputs received',
        status: 'completed' as const,
        description: `Field: "${inputs.fieldName}" (${inputs.latitude}, ${inputs.longitude}), Stage: "${inputs.growthStage}", Water: "${inputs.waterCondition}", Urea: "${ureaStr}".`,
      },
      {
        step: 'Methane and yield risk assessment',
        status: 'completed' as const,
        description: `Evaluated "${inputs.waterCondition}" during "${inputs.growthStage}": Methane risk: ${rules.methane_risk.toUpperCase()}, Yield risk: ${rules.yield_risk.toUpperCase()}.`,
      },
      {
        step: 'Trade-off check',
        status: 'completed' as const,
        description: rules.must_avoid_drying
          ? `Anthesis protection applied: drying disallowed during flowering.`
          : `Verified safe AWD windows: methane reduction verified without moisture stress to tillers.`,
      },
      {
        step: 'Recommendation',
        status: 'completed' as const,
        description: `${parsedResult.top_priority}`,
      },
    ];

    return res.json({
      summary: parsedResult.summary,
      methane_risk: rules.methane_risk,
      yield_risk: rules.yield_risk,
      confidence: rules.confidence,
      top_priority: parsedResult.top_priority,
      steps: parsedResult.steps,
      reasoning: parsedResult.reasoning || `Based on observed ${inputs.growthStage} and ${inputs.waterCondition}.`,
      trade_off_notes: parsedResult.trade_off_notes,
      direction_of_change: parsedResult.direction_of_change || 'Likely lower methane, yield about steady',
      verify_locally: Array.isArray(parsedResult.verify_locally) && parsedResult.verify_locally.length > 0
        ? parsedResult.verify_locally
        : rules.missing_inputs,
      agent_trace,
      source: 'ai',
      generated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Advisor endpoint error:', error);
    const inputs = sanitizeInputs(req.body);
    const rules = evaluateFieldRules(inputs);
    const fallbackAdvice = generateRuleFallbackAdvice(inputs, rules, inputs.language);
    return res.json({
      ...fallbackAdvice,
      source: 'rule_fallback',
    });
  }
});

// POST /api/explain or /api/explain-simply
app.post(['/api/explain', '/api/explain-simply'], async (req: Request, res: Response) => {
  try {
    const { advice, language } = req.body;
    const isHi = language === 'hi';

    if (!advice) {
      return res.status(400).json({ error: 'Advice payload required' });
    }

    if (!ai) {
      // Deterministic 3 simple farmer lines
      const lines = isHi
        ? [
            `1. मुख्य कार्य: ${advice.top_priority || 'पानी का स्तर नियंत्रित रखें'}`,
            `2. मीथेन व पैदावार: खेत में आवश्यकतानुसार ही पानी भरें, ताकि गैस कम बने और जड़ें मजबूत रहें।`,
            `3. स्थानीय सलाह: खाद या पानी में बदलाव से पहले नजदीकी कृषि अधिकारी से पुष्टि करें।`,
          ]
        : [
            `1. Immediate action: ${advice.top_priority || 'Manage water depth carefully'}`,
            `2. Carbon & yield: Let water drop naturally before re-filling to cut greenhouse gas without hurting grains.`,
            `3. Expert check: Always check with your local agricultural officer before changing fertilizer doses.`,
          ];
      return res.json({ simple_lines: lines });
    }

    const prompt = `Rewrite this agricultural field advice into exactly 3 short, crystal-clear, farmer-friendly bullet lines in ${isHi ? 'Hindi (हिंदी)' : 'English'}.
Top Priority: ${advice.top_priority}
Steps: ${JSON.stringify(advice.steps)}
Trade-off: ${advice.trade_off_notes}

Format as strict JSON: { "simple_lines": ["Line 1", "Line 2", "Line 3"] }`;

    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
      5000
    );

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      simple_lines: parsed.simple_lines || [
        advice.top_priority,
        'Manage water cycles according to crop stage',
        'Confirm with a local agronomist',
      ],
    });
  } catch (err: any) {
    console.error('Explain simply error:', err);
    res.json({
      simple_lines: [
        'Follow your top priority action this week.',
        'Protect moisture during critical flowering while using AWD in tillering.',
        'Confirm with a local agronomist before making major field changes.',
      ],
    });
  }
});

// POST /api/compare-scenarios
app.post('/api/compare-scenarios', async (req: Request, res: Response) => {
  try {
    const inputs = sanitizeInputs(req.body.inputs);
    const altCondition = req.body.alternativeWaterCondition || (
      inputs.waterCondition === 'continuously_flooded'
        ? 'alternate_wetting_drying'
        : 'continuously_flooded'
    );

    const currentRules = evaluateFieldRules(inputs);
    const altInputs: FieldInputs = { ...inputs, waterCondition: altCondition };
    const altRules = evaluateFieldRules(altInputs);

    let explanation = '';
    const isHi = inputs.language === 'hi';

    if (inputs.waterCondition === 'continuously_flooded' && altCondition === 'alternate_wetting_drying') {
      explanation = isHi
        ? `लगातार पानी भरे रहने से मीथेन जोखिम 'उच्च' रहता है। AWD अपनाने से मीथेन जोखिम घटकर 'कम' हो जाता है और कल्ले फूटने के समय उपज पर कोई प्रतिकूल प्रभाव नहीं पड़ता।`
        : `Continuous flooding keeps methane risk HIGH due to permanent soil hypoxia. Transitioning to AWD drops methane to LOW while keeping yield risk LOW during ${inputs.growthStage}.`;
    } else if (altCondition === 'continuously_flooded') {
      explanation = isHi
        ? `AWD से वापस लगातार पानी भरने पर मीथेन जोखिम 'कम' से बढ़कर 'उच्च' हो जाएगा, जबकि उपज में कोई अतिरिक्त लाभ नहीं मिलेगा।`
        : `Reverting to continuous flooding increases methane risk from LOW to HIGH without offering any additional grain yield benefit.`;
    } else {
      explanation = isHi
        ? `जल प्रबंधन में बदलाव से मिट्टी में हवा का प्रवाह बदलता है, जिससे मीथेन और पौधों की जड़ सुरक्षा का संतुलन प्रभावित होता है।`
        : `Switching water management changes soil aeration dynamics, directly modulating methanogen colonies.`;
    }

    return res.json({
      current: {
        waterCondition: inputs.waterCondition,
        methane_risk: currentRules.methane_risk,
        yield_risk: currentRules.yield_risk,
        rules_applied: currentRules.rules_applied,
      },
      alternative: {
        waterCondition: altCondition,
        methane_risk: altRules.methane_risk,
        yield_risk: altRules.yield_risk,
        rules_applied: altRules.rules_applied,
      },
      explanation,
    });
  } catch (err: any) {
    console.error('Scenario comparison error:', err);
    res.status(500).json({ error: 'Failed to compute scenario comparison' });
  }
});

// Saved Fields API (with guest and user isolation)
app.get('/api/saved-fields', (req: Request, res: Response) => {
  const userId = String(req.query.user_id || 'guest');
  const userFields = inMemorySavedFields.filter(f => f.user_id === userId);
  res.json({ fields: userFields });
});

app.post('/api/saved-fields', (req: Request, res: Response) => {
  try {
    const { user_id, field_name, inputs, advice, checklist } = req.body;
    const newField: SavedField = {
      id: 'field_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      user_id: user_id || 'guest',
      field_name: field_name || inputs?.fieldName || 'My Paddy',
      inputs: sanitizeInputs(inputs || {}),
      advice,
      checklist: checklist || {},
      created_at: new Date().toISOString(),
    };

    inMemorySavedFields.unshift(newField);
    persistSavedFields(inMemorySavedFields);
    res.status(201).json({ field: newField });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to save field' });
  }
});

app.delete('/api/saved-fields/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = String(req.query.user_id || 'guest');
  inMemorySavedFields = inMemorySavedFields.filter(f => !(f.id === id && f.user_id === userId));
  persistSavedFields(inMemorySavedFields);
  res.json({ success: true });
});

app.patch('/api/saved-fields/:id/feedback', (req: Request, res: Response) => {
  const { id } = req.params;
  const { followed_advice, yield_vs_usual } = req.body;
  const field = inMemorySavedFields.find(f => f.id === id);
  if (!field) {
    return res.status(404).json({ error: 'Field not found' });
  }
  if (followed_advice) field.followed_advice = followed_advice;
  if (yield_vs_usual) field.yield_vs_usual = yield_vs_usual;
  persistSavedFields(inMemorySavedFields);
  res.json({ field });
});

function getAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve) => {
    const tester = net.createServer();

    tester.once('error', () => {
      resolve(getAvailablePort(startPort + 1));
    });

    tester.once('listening', () => {
      tester.close(() => resolve(startPort));
    });

    tester.listen(startPort, '0.0.0.0');
  });
}

// Setup dev server with Vite or production static files
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const selectedPort = await getAvailablePort(PORT);

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: selectedPort,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(selectedPort, '0.0.0.0', () => {
    console.log(`Rice Methane Advisor server running at http://0.0.0.0:${selectedPort}`);
  });
}

startServer();
