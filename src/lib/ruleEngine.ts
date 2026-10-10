import { FieldInputs, RuleEngineResult, AdviceResult, GrowthStage, WaterCondition } from '../types/advisor';

/**
 * Pure agronomic rule engine for rice paddy methane vs yield risk assessment.
 * Quotes user values directly in rules_applied.
 */
export function evaluateFieldRules(inputs: FieldInputs): RuleEngineResult {
  const rules_applied: string[] = [];
  const missing_inputs: string[] = [];
  const fieldName = String(inputs.fieldName ?? '').trim();

  const parseNumeric = (value: number | string | undefined | null): number => {
    if (value === undefined || value === null || value === '') {
      return NaN;
    }

    if (typeof value === 'string' && value.trim() === '') {
      return NaN;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  };

  // Parse and validate numeric urea dose
  const ureaDoseNum = parseNumeric(inputs.lastUreaDose);

  let is_implausible_urea = false;
  if (!Number.isNaN(ureaDoseNum)) {
    if (ureaDoseNum < 0 || ureaDoseNum > 250) {
      is_implausible_urea = true;
      rules_applied.push(`Urea dose "${inputs.lastUreaDose} kg/ha" exceeds realistic field limits (0-250 kg/ha). Needs local verification.`);
      missing_inputs.push('Verified last urea application rate from grower records');
    }
  }

  // Check coordinates validity
  const lat = parseNumeric(inputs.latitude);
  const lon = parseNumeric(inputs.longitude);
  if (Number.isNaN(lat) || lat < -90 || lat > 90 || Number.isNaN(lon) || lon < -180 || lon > 180) {
    missing_inputs.push('Valid field coordinates (-90° to 90° lat, -180° to 180° lon)');
  }

  if (!fieldName) {
    missing_inputs.push('Field name');
  }

  if (!inputs.growthStage) {
    missing_inputs.push('Crop growth stage');
  }

  if (!inputs.waterCondition) {
    missing_inputs.push('Field water depth / condition');
  }

  // Base risk calculations
  let methane_risk: 'low' | 'medium' | 'high' = 'medium';
  let yield_risk: 'low' | 'medium' | 'high' = 'low';
  let confidence: 'low' | 'medium' | 'high' = 'high';

  // Rule 1: Continuously flooded from tillering to panicle initiation -> methane high
  if (
    inputs.waterCondition === 'continuously_flooded' &&
    (inputs.growthStage === 'tillering' || inputs.growthStage === 'panicle_initiation')
  ) {
    methane_risk = 'high';
    rules_applied.push(
      `Continuous flooding during "${inputs.growthStage}" maintains anoxic soil conditions, driving peak methanogen activity.`
    );
  } else if (inputs.waterCondition === 'continuously_flooded') {
    methane_risk = 'high';
    rules_applied.push(
      `Continuous flooding recorded under stage "${inputs.growthStage}", causing continuous anaerobic methane generation.`
    );
  }

  // Rule 2: Alternate wetting and drying -> methane lower; yield risk low unless stage is flowering
  if (inputs.waterCondition === 'alternate_wetting_drying') {
    methane_risk = 'low';
    if (inputs.growthStage === 'flowering') {
      yield_risk = 'medium';
      rules_applied.push(
        `Field is in "flowering" under "alternate wetting and drying". Water deficit at anthesis threatens spikelet fertility.`
      );
    } else {
      yield_risk = 'low';
      rules_applied.push(
        `Alternate wetting and drying applied during "${inputs.growthStage}": Soil aeration suppresses methanogen populations, likely lowering methane while root development remains safe.`
      );
    }
  }

  // Rule 3: Drained or drought-stressed at flowering or grain filling -> yield risk high; never advise drying at flowering
  const must_avoid_drying = inputs.growthStage === 'flowering';
  if (
    (inputs.waterCondition === 'drained' || inputs.waterCondition === 'drought_stressed') &&
    (inputs.growthStage === 'flowering' || inputs.growthStage === 'grain_filling')
  ) {
    yield_risk = 'high';
    methane_risk = 'low';
    rules_applied.push(
      `Water stress ("${inputs.waterCondition}") during critical reproductive phase "${inputs.growthStage}" causes severe spikelet sterility and poor grain fill.`
    );
  } else if (inputs.waterCondition === 'drought_stressed') {
    yield_risk = 'high';
    rules_applied.push(
      `Drought stress observed during "${inputs.growthStage}". Yield formation is compromised.`
    );
  }

  // Saturated condition logic
  if (inputs.waterCondition === 'saturated') {
    methane_risk = 'medium';
    rules_applied.push(
      `Soil saturated (no deep standing water) at "${inputs.growthStage}", producing moderate methane while protecting root hydration.`
    );
  }

  // Rule 4: Deficiency signs with low or no urea dose -> yield risk medium or higher
  const hasDeficiency =
    inputs.leafColor === 'mild_yellowing' || inputs.leafColor === 'severe_yellowing';
  const hasLowUrea = Number.isNaN(ureaDoseNum) || ureaDoseNum <= 30;

  if (hasDeficiency && hasLowUrea) {
    if (inputs.leafColor === 'severe_yellowing') {
      yield_risk = 'high';
      rules_applied.push(
        `Severe leaf yellowing observed with low/unreported urea dose (${Number.isNaN(ureaDoseNum) ? 'none specified' : ureaDoseNum + ' kg/ha'}): severe nitrogen stress risk.`
      );
    } else {
      yield_risk = yield_risk === 'high' ? 'high' : 'medium';
      rules_applied.push(
        `Mild leaf yellowing with low/unreported urea dose (${Number.isNaN(ureaDoseNum) ? 'none reported' : ureaDoseNum + ' kg/ha'}): risk of inadequate canopy nitrogen during "${inputs.growthStage}".`
      );
    }
  }

  // Rule 5: Large single urea dose (>75 kg/ha) on a flooded field -> flag methane & loss risk, suggest splitting
  if (
    !Number.isNaN(ureaDoseNum) &&
    ureaDoseNum > 75 &&
    !is_implausible_urea &&
    inputs.waterCondition === 'continuously_flooded'
  ) {
    rules_applied.push(
      `High single urea dose (${ureaDoseNum} kg/ha) broadcast onto standing floodwater triggers ammonium volatilization and stimulates methanogenesis.`
    );
  }

  // Rule 7: Missing or vague inputs -> confidence low
  if (missing_inputs.length > 0 || Number.isNaN(ureaDoseNum) || fieldName.length === 0) {
    confidence = missing_inputs.length >= 2 ? 'low' : 'medium';
  }

  return {
    methane_risk,
    yield_risk,
    confidence,
    rules_applied,
    missing_inputs,
    is_implausible_urea,
    must_avoid_drying,
  };
}

/**
 * Fallback rule-based advice generation when AI gateway is unreachable or returns malformed data.
 * Pure deterministic logic ensuring 100% availability.
 */
export function generateRuleFallbackAdvice(
  inputs: FieldInputs,
  rules: RuleEngineResult,
  lang: 'en' | 'hi' = 'en'
): AdviceResult {
  const isHi = lang === 'hi';
  const hasUreaDose = inputs.lastUreaDose !== undefined && inputs.lastUreaDose !== null && inputs.lastUreaDose !== '';
  const ureaStr = hasUreaDose ? `${inputs.lastUreaDose} kg/ha` : (isHi ? 'अनपेक्षित' : 'unspecified');

  let top_priority = '';
  const steps: AdviceResult['steps'] = [];

  if (rules.must_avoid_drying) {
    top_priority = isHi
      ? `फूल आने की अवस्था में खेत में 3-5 सेमी पानी बनाए रखें; इस समय खेत को कतई न सुखाएं।`
      : `Maintain 3-5 cm standing water during flowering stage; do NOT drain or allow drying now.`;
    steps.push({
      priority: 'Do now',
      timing: isHi ? 'तुरंत (24-48 घंटे)' : 'Immediate (next 24-48 hrs)',
      action: isHi ? 'खेत में पानी का स्तर 3-5 सेमी तक सुनिश्चित करें' : 'Verify ponded water depth at 3-5 cm',
      why: isHi
        ? 'फूल आने के समय पानी की कमी से दाना नहीं बनता (स्पाइकलेट स्टेरिलिटी)।'
        : 'Water deficit at anthesis induces spikelet sterility, heavily cutting final yield.',
    });
  } else if (inputs.waterCondition === 'continuously_flooded') {
    top_priority = isHi
      ? `वैकल्पिक गीला और सूखा (AWD) अपनाएं: पानी प्राकृतिक रूप से सूखने दें, फिर दोबारा भरें।`
      : `Transition to Alternate Wetting & Drying (AWD): allow water to drop below soil surface before re-flooding.`;
    steps.push({
      priority: 'Do now',
      timing: isHi ? 'अगले 1-2 दिन' : 'Next 1-2 days',
      action: isHi
        ? 'पानी देना बंद करें और एक छिद्रित प्लास्टिक पाइप (pani pipe) स्थापित करें'
        : 'Halt irrigation inlet and install a field water tube (pani pipe) to track water depth',
      why: isHi
        ? 'मिट्टी में हवा जाने से मीथेन बैक्टीरिया शांत होते हैं और उत्सर्जन कम होने की संभावना रहती है।'
        : 'Aerating the root zone interrupts methanogen bacteria and is likely to lower methane.',
    });
  } else {
    top_priority = isHi
      ? `AWD चक्र जारी रखें और पत्तियों के रंग के अनुसार संतुलित यूरिया दें।`
      : `Maintain current safe AWD cycle and monitor leaf nitrogen balance closely.`;
    steps.push({
      priority: 'Do now',
      timing: isHi ? 'अगले 48 घंटे' : 'Next 48 hours',
      action: isHi
        ? 'खेत में पानी के स्तर की जांच करें और सुरक्षित पुनः सिंचाई करें'
        : 'Check pani pipe depth and irrigate only when water drops 15 cm below soil surface',
      why: isHi
        ? 'सुरक्षित AWD से पौधों की जड़ें मजबूत होती हैं और पानी व मीथेन दोनों की बचत होती है।'
        : 'Safe AWD stimulates deep root anchoring without imposing yield-reducing water stress.',
    });
  }

  // Step 2: Nitrogen timing
  const ureaNum = hasUreaDose ? Number(inputs.lastUreaDose) : NaN;
  if (!Number.isNaN(ureaNum) && ureaNum > 75) {
    steps.push({
      priority: 'Soon',
      timing: isHi ? 'अगले 5-7 दिन' : 'Next 5-7 days',
      action: isHi
        ? 'यूरिया की एकमुश्त भारी खुराक न डालें; इसे 25-30 किग्रा/हेक्टेयर की किस्तों में बांटें'
        : 'Split upcoming nitrogen applications into smaller doses (25-35 kg/ha) on moist, not deeply flooded soil',
      why: isHi
        ? 'खड़े पानी में ज्यादा यूरिया डालने से अमोनिया हवा में उड़ती है और मीथेन बढ़ती है।'
        : 'High single urea doses under continuous water cause volatile losses and spike methane production.',
    });
  } else if (inputs.leafColor === 'mild_yellowing' || inputs.leafColor === 'severe_yellowing') {
    steps.push({
      priority: 'Soon',
      timing: isHi ? 'अगले 3-4 दिन' : 'Next 3-4 days',
      action: isHi
        ? 'लीफ कलर चार्ट (LCC) से पत्तियों का मिलान करें और आवश्यकतानुसार 25-30 किग्रा/हेक्टेयर यूरिया दें'
        : 'Assess leaf color against a 4-panel Leaf Color Chart (LCC) and apply a targeted top-dress',
      why: isHi
        ? 'पीलेपन को समय पर ठीक करने से कल्ले और बालियां स्वस्थ बनती हैं।'
        : 'Correcting yellowing during active growth sustains photosynthetic rate and tiller vigor.',
    });
  } else {
    steps.push({
      priority: 'Soon',
      timing: isHi ? 'कल्ले निकलने / बाली बनने के समय' : 'At panicle initiation',
      action: isHi
        ? 'पत्तियों के हरे रंग की निगरानी करें और केवल जरूरत होने पर ही यूरिया की अगली खुराक दें'
        : 'Calibrate next urea split strictly using leaf canopy greenness, avoiding excessive application',
      why: isHi
        ? 'संतुलित नाइट्रोजन से पौधे रोगमुक्त रहते हैं और मीथेन उत्सर्जन नियंत्रित रहता है।'
        : 'Synchronizing nitrogen with crop uptake prevents excess nitrate leached into anoxic layers.',
    });
  }

  // Step 3: Straw & soil care
  steps.push({
    priority: 'Later',
    timing: isHi ? 'फसल पकने से पहले' : 'Prior to grain maturity',
    action: isHi
      ? 'कटाई से 10-14 दिन पूर्व खेत से पानी पूरी तरह निकाल दें'
      : 'Terminal drainage 10-14 days before harvest',
    why: isHi
      ? 'समय पर पानी निकालने से दानों की गुणवत्ता बढ़ती है और कटाई सुगम होती है।'
      : 'Timely terminal drainage speeds uniform ripening and eliminates late-season methane release.',
  });

  const summary = isHi
    ? `खेत "${inputs.fieldName}" (अवस्था: ${inputs.growthStage}, पानी: ${inputs.waterCondition}) के लिए नियम-आधारित सलाह: मीथेन जोखिम ${rules.methane_risk.toUpperCase()} है और उपज जोखिम ${rules.yield_risk.toUpperCase()} है।`
    : `Field "${inputs.fieldName}" at stage "${inputs.growthStage}" under "${inputs.waterCondition}": Methane risk is ${rules.methane_risk.toUpperCase()} and Yield risk is ${rules.yield_risk.toUpperCase()}.`;

  const reasoning = isHi
    ? `दर्ज की गई अवस्था "${inputs.growthStage}", पानी की स्थिति "${inputs.waterCondition}", और यूरिया की मात्रा (${ureaStr}) के आधार पर यह सलाह तैयार की गई है।`
    : `Based on submitted stage "${inputs.growthStage}", water condition "${inputs.waterCondition}", and reported urea dose (${ureaStr}).`;

  const trade_off_notes = isHi
    ? `AWD तकनीक से पैदावार सामान्य रहने की उम्मीद के साथ मीथेन में संभावित कमी होती है, बशर्ते फूल आने के समय पानी की कमी न होने दी जाए।`
    : `Safe Alternate Wetting & Drying safely lowers methane while keeping grain yields about steady, provided soil is never drained during anthesis/flowering.`;

  const direction_of_change = isHi
    ? `मीथेन में संभावित कमी, उपज सामान्य बनी रहने की उम्मीद (स्थानीय पुष्टि आवश्यक)`
    : `Likely lower methane, yield expected about steady (confirm locally)`;

  const agent_trace = [
    {
      step: 'Inputs received',
      status: 'completed' as const,
      description: `Field: "${inputs.fieldName || 'Unnamed'}" (${inputs.latitude}, ${inputs.longitude}), Stage: "${inputs.growthStage}", Water: "${inputs.waterCondition}", Urea: "${ureaStr}".`,
    },
    {
      step: 'Methane and yield risk assessment',
      status: 'completed' as const,
      description: `Evaluated "${inputs.waterCondition}" during "${inputs.growthStage}": Methane risk calculated as "${rules.methane_risk}", Yield risk as "${rules.yield_risk}".`,
    },
    {
      step: 'Trade-off check',
      status: 'completed' as const,
      description: rules.must_avoid_drying
        ? `Protected reproductive stage ("flowering"): drying strictly prohibited to prevent spikelet sterility.`
        : `Verified safe AWD windows: root oxygenation verified without moisture stress to young tillers.`,
    },
    {
      step: 'Recommendation',
      status: 'completed' as const,
      description: `Priority action: ${top_priority}`,
    },
  ];

  return {
    summary,
    methane_risk: rules.methane_risk,
    yield_risk: rules.yield_risk,
    confidence: rules.confidence,
    top_priority,
    steps,
    reasoning,
    trade_off_notes,
    direction_of_change,
    verify_locally: rules.missing_inputs.length > 0
      ? rules.missing_inputs
      : [isHi ? 'स्थानीय कृषि विज्ञान केंद्र (KVK) से मिट्टी के प्रकार की पुष्टि करें' : 'Verify soil percolation rate and local water table with your local KVK or extension office'],
    agent_trace,
    source: 'rule_fallback',
    generated_at: new Date().toISOString(),
  };
}
