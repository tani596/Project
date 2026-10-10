import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { runRuleEngineTests } from '../../lib/ruleEngine.test';
import { ShieldCheck, CheckCircle2, Cpu, Scale, AlertOctagon } from 'lucide-react';

export const ModelDecisionCard: React.FC = () => {
  const { language } = useApp();
  const isHi = language === 'hi';

  // Run the actual unit test suite
  const testResults = useMemo(() => {
    try {
      return runRuleEngineTests();
    } catch {
      return { passed: 0, failed: 1, results: [] };
    }
  }, []);

  const testsPassed = testResults.passed >= 8 && testResults.failed === 0;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Cpu className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-display font-bold text-base text-foreground">
              {isHi ? 'मॉडल कैसे निर्णय लेता है (How the Model Decides)' : 'How the Model Decides'}
            </h4>
            <p className="text-xs text-foreground/70">
              {isHi
                ? 'शुद्ध कृषि नियम जोखिम तय करते हैं; एआई केवल उन्हें किसान-अनुकूल भाषा में समझाता है'
                : 'Deterministic agronomic rules compute baseline risks; AI only explains and structures the advice'}
            </p>
          </div>
        </div>

        {/* Rule Tests Passed Badge (Shown only if unit tests actually pass) */}
        {testsPassed && (
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 text-xs font-bold w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {isHi
                ? `नियम परीक्षण सफल (${testResults.passed}/${testResults.passed})`
                : `Rule tests passed (${testResults.passed}/${testResults.passed})`}
            </span>
          </div>
        )}
      </div>

      {/* Plain Words Architecture Statement */}
      <div className="p-3.5 rounded-xl bg-muted-bg/60 border border-border text-xs text-foreground/85 leading-relaxed space-y-1">
        <div className="font-bold text-foreground flex items-center space-x-1.5">
          <Scale className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isHi ? 'नियम-प्रथम सुरक्षा सीमा (Deterministic Boundary)' : 'Rule-First Agronomic Boundary'}
          </span>
        </div>
        <p>
          {isHi
            ? 'वैज्ञानिक नियम इंजन इनपुट्स के आधार पर मीथेन जोखिम और उपज जोखिम की गणना करता है। एआई को इन जोखिम स्तरों को बदलने या मनगढ़ंत आंकड़े बनाने की अनुमति नहीं है। एआई केवल उपयोगकर्ता के मूल्यों का संदर्भ देते हुए व्यावहारिक कदम सुझाता है।'
            : 'The deterministic rule engine executes pure agronomic checks before the AI is invoked. The AI model receives risk levels and safety boundaries as fixed facts and explains them in plain language—it cannot modify computed risks or invent percentages.'}
        </p>
      </div>

      {/* Rules list in plain words */}
      <div className="space-y-2 text-xs">
        <span className="font-bold text-foreground text-xs uppercase tracking-wider block text-muted">
          {isHi ? 'लागू किए जाने वाले 7 बुनियादी नियम' : 'The 7 Core Agronomic Rules'}
        </span>

        <div className="grid grid-cols-1 gap-2">
          <div className="p-2.5 rounded-lg bg-card border border-border flex items-start space-x-2">
            <span className="font-bold text-emerald-600 shrink-0">1.</span>
            <p className="text-foreground/80">
              <strong>{isHi ? 'लगातार भरा पानी (कल्ले से बाली तक):' : 'Continuous Flooding (Tillering to Panicle):'}</strong>{' '}
              {isHi
                ? 'स्थाई जलभराव से मिट्टी में ऑक्सीजन खत्म होती है, जिससे मीथेन जोखिम उच्च (High) हो जाता है।'
                : 'Prolonged submergence maintains anoxic soil, setting methane risk to High.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border flex items-start space-x-2">
            <span className="font-bold text-emerald-600 shrink-0">2.</span>
            <p className="text-foreground/80">
              <strong>{isHi ? 'वैकल्पिक गीला व सूखा (AWD):' : 'Alternate Wetting & Drying (AWD):'}</strong>{' '}
              {isHi
                ? 'मिट्टी में हवा जाने से मीथेन जोखिम कम (Low) हो जाता है और उपज सुरक्षित रहती है।'
                : 'Soil aeration suppresses methanogens, dropping methane risk to Low while keeping yield safe.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border flex items-start space-x-2">
            <span className="font-bold text-red-600 shrink-0">3.</span>
            <p className="text-foreground/80">
              <strong>{isHi ? 'फूल आने पर सूखा/निकासी निषेध:' : 'Flowering Stage Moisture Protection:'}</strong>{' '}
              {isHi
                ? 'फूल आने के समय पानी की कमी से दाने बांझ हो जाते हैं (स्पाइकलेट स्टेरिलिटी)। इस अवस्था में खेत सुखाने की सलाह कभी नहीं दी जाती।'
                : 'Drying during anthesis causes sterile spikelets. Yield risk is High; drying is strictly prohibited.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border flex items-start space-x-2">
            <span className="font-bold text-amber-600 shrink-0">4.</span>
            <p className="text-foreground/80">
              <strong>{isHi ? 'पत्तियों में पीलापन व कम यूरिया:' : 'Canopy Yellowing with Low Urea:'}</strong>{' '}
              {isHi
                ? 'नाइट्रोजन की कमी से कल्ले कमजोर होते हैं; उपज जोखिम मध्यम या उच्च (Medium/High) हो जाता है।'
                : 'Deficiency observations trigger Medium or High Yield Risk depending on severity.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border flex items-start space-x-2">
            <span className="font-bold text-amber-600 shrink-0">5.</span>
            <p className="text-foreground/80">
              <strong>{isHi ? 'खड़े पानी में भारी यूरिया खुराक (>75 किग्रा):' : 'High Single Urea Broadcast (>75 kg/ha):'}</strong>{' '}
              {isHi
                ? 'अमोनिया गैस का हवा में उड़ना और मीथेन में वृद्धि; मॉडल खुराक को 2-3 किस्तों में बांटने का निर्देश देता है।'
                : 'Triggers ammonium volatilization and methanogen growth; requires dose splitting.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border flex items-start space-x-2">
            <span className="font-bold text-muted shrink-0">6.</span>
            <p className="text-foreground/80">
              <strong>{isHi ? 'असामान्य खाद मात्रा (>250 किग्रा):' : 'Implausible Application Rate (>250 kg/ha):'}</strong>{' '}
              {isHi
                ? 'मॉडल अंदाज़ा लगाने के बजाय स्थानीय स्तर पर कृषि विशेषज्ञ से सत्यापन का फ्लैग लगाता है।'
                : 'Flagged for local grower verification rather than guessing.'}
            </p>
          </div>

          <div className="p-2.5 rounded-lg bg-card border border-border flex items-start space-x-2">
            <span className="font-bold text-muted shrink-0">7.</span>
            <p className="text-foreground/80">
              <strong>{isHi ? 'अपूर्ण या अस्पष्ट इनपुट:' : 'Missing or Vague Coordinates/Inputs:'}</strong>{' '}
              {isHi
                ? 'यदि आंकड़े अधूरे हों तो मॉडल का विश्वास स्तर (Confidence) घट जाता है।'
                : 'Confidence drops to Low or Medium and an unverified check list is generated.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
