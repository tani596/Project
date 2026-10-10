import React from 'react';
import { useApp } from '../../context/AppContext';
import { GrowthStage } from '../../types/advisor';
import { CalendarRange, Droplets, Sprout, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

interface SeasonPlanCardProps {
  currentStage: GrowthStage;
}

const STAGES_ORDER: GrowthStage[] = [
  'nursery',
  'transplanting',
  'tillering',
  'panicle_initiation',
  'flowering',
  'grain_filling',
  'maturity',
];

interface StageGuidance {
  stage: GrowthStage;
  nameEn: string;
  nameHi: string;
  waterActionEn: string;
  waterActionHi: string;
  nitrogenActionEn: string;
  nitrogenActionHi: string;
}

const STAGE_PLANS: Record<GrowthStage, StageGuidance> = {
  nursery: {
    stage: 'nursery',
    nameEn: 'Nursery (Seedling emergence)',
    nameHi: 'नर्सरी / पौध अवस्था',
    waterActionEn: 'Keep soil saturated; avoid deep standing water.',
    waterActionHi: 'मिट्टी को नम रखें; गहरा पानी भरने से बचें।',
    nitrogenActionEn: 'Light basal seedbed application.',
    nitrogenActionHi: 'नर्सरी में हल्की बेसल खाद दें।',
  },
  transplanting: {
    stage: 'transplanting',
    nameEn: 'Transplanting (Establishment)',
    nameHi: 'रोपाई (प्रतिरोपण अवस्था)',
    waterActionEn: 'Maintain 2-3 cm shallow water layer for seedling anchoring.',
    waterActionHi: 'पौध जमने के लिए 2-3 सेमी उथला पानी रखें।',
    nitrogenActionEn: 'Apply basal phosphorus, potassium, and early nitrogen split.',
    nitrogenActionHi: 'रोपाई के समय संतुलित बेसल खाद व शुरुआती यूरिया दें।',
  },
  tillering: {
    stage: 'tillering',
    nameEn: 'Tillering (Active vegetative)',
    nameHi: 'कल्ले फूटना (सक्रिय वानस्पतिक वृद्धि)',
    waterActionEn: 'Implement Alternate Wetting & Drying (AWD); allow water to drop below soil surface before re-flooding.',
    waterActionHi: 'AWD अपनाएं; पानी को मिट्टी की सतह तक सूखने दें फिर दोबारा पानी भरें।',
    nitrogenActionEn: 'Split urea applications based on canopy greenness rather than heavy single doses.',
    nitrogenActionHi: 'एकमुश्त भारी खुराक के बजाय पत्तियों के रंग के अनुसार यूरिया को 2-3 किस्तों में बांटें।',
  },
  panicle_initiation: {
    stage: 'panicle_initiation',
    nameEn: 'Panicle Initiation (Reproductive start)',
    nameHi: 'बाली की शुरुआत (Panicle Initiation)',
    waterActionEn: 'Maintain 2-3 cm shallow standing water during early panicle formation.',
    waterActionHi: 'बाली बनते समय 2-3 सेमी उथला पानी निरंतर बनाए रखें।',
    nitrogenActionEn: 'Apply calibrated top-dress nitrogen split strictly following leaf color chart.',
    nitrogenActionHi: 'लीफ कलर चार्ट (LCC) देखकर यूरिया की अंतिम शीर्ष खुराक (टॉप-ड्रेस) दें।',
  },
  flowering: {
    stage: 'flowering',
    nameEn: 'Flowering / Anthesis (Critical moisture window)',
    nameHi: 'फूल आना (अत्यंत संवेदनशील अवस्था)',
    waterActionEn: 'Strictly maintain 3-5 cm standing water; never allow field drying or drainage at anthesis.',
    waterActionHi: 'खेत में 3-5 सेमी पानी अनिवार्य रूप से बनाए रखें; फूल आने पर खेत कतई न सुखाएं।',
    nitrogenActionEn: 'Avoid broadcasting urea during flowering to prevent spikelet burn and volatilization.',
    nitrogenActionHi: 'फूल आने के दौरान यूरिया न डालें ताकि परागकण सुरक्षित रहें।',
  },
  grain_filling: {
    stage: 'grain_filling',
    nameEn: 'Grain Filling (Milky / Dough stage)',
    nameHi: 'दाना भराव / दुग्ध अवस्था',
    waterActionEn: 'Alternate shallow wetting and drying until dough stage; keep soil moist.',
    waterActionHi: 'दाना सख्त होने तक हल्का गीला-सूखा चक्र जारी रखें; मिट्टी में नमी रखें।',
    nitrogenActionEn: 'Nitrogen applications complete; avoid late nitrogen to prevent disease.',
    nitrogenActionHi: 'उर्वरक का काम पूरा हो चुका है; देर से यूरिया कतई न डालें।',
  },
  maturity: {
    stage: 'maturity',
    nameEn: 'Maturity (Pre-harvest ripening)',
    nameHi: 'पकाव अवस्था (कटाई से पूर्व)',
    waterActionEn: 'Complete terminal drainage 10-14 days before harvest to speed ripening and halt methane.',
    waterActionHi: 'कटाई से 10-14 दिन पूर्व खेत का पानी पूरी तरह निकाल दें।',
    nitrogenActionEn: 'No fertilizer applied during harvest preparation.',
    nitrogenActionHi: 'कटाई से पूर्व किसी खाद की आवश्यकता नहीं है।',
  },
};

export const SeasonPlanCard: React.FC<SeasonPlanCardProps> = ({ currentStage }) => {
  const { language } = useApp();
  const isHi = language === 'hi';

  const currentIndex = STAGES_ORDER.indexOf(currentStage);
  const remainingStages = STAGES_ORDER.slice(currentIndex + 1);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <CalendarRange className="w-4 h-4" />
          </span>
          <div>
            <h4 className="font-display font-bold text-base text-foreground">
              {isHi ? 'आगामी मौसमी कार्ययोजना (Season Plan)' : 'Upcoming Season Plan'}
            </h4>
            <p className="text-xs text-foreground/70">
              {isHi
                ? 'वर्तमान अवस्था के बाद शेष बची फसल अवस्थाओं के लिए जल व नाइट्रोजन दिशानिर्देश'
                : 'Stage-by-stage water and nitrogen actions for the remainder of the crop cycle'}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-muted-bg text-muted border border-border w-fit">
          {isHi ? 'सामान्य मार्गदर्शन, स्थानीय स्तर पर पुष्टि करें' : 'General guidance, confirm locally'}
        </span>
      </div>

      {/* Remaining stages list */}
      {remainingStages.length === 0 ? (
        <div className="p-4 rounded-xl bg-muted-bg/50 text-xs text-foreground/80 space-y-1">
          <p className="font-bold text-foreground">
            {isHi ? 'फसल अंतिम पकाव अवस्था में है' : 'Crop is in final maturity stage'}
          </p>
          <p>
            {isHi
              ? 'कटाई के लिए खेत तैयार करें। कटाई उपरांत पराली को जलाने के बजाय एरोबिक रूप से सड़ाने का प्रबंधन करें ताकि आगामी मौसम में मीथेन न बने।'
              : 'Prepare for harvest. Post-harvest, manage straw aerobically rather than burning or immediate flooding to suppress future season methane spikes.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {remainingStages.map((stageKey, idx) => {
            const plan = STAGE_PLANS[stageKey];
            const isStageFlowering = stageKey === 'flowering';

            return (
              <div
                key={stageKey}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isStageFlowering
                    ? 'border-amber-300/80 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-800'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                      +{idx + 1}
                    </span>
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      {isHi ? plan.nameHi : plan.nameEn}
                    </span>
                  </div>

                  {isStageFlowering && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                      {isHi ? 'जल सुरक्षा अनिवार्य' : 'Moisture Critical'}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1 border-t border-border/50">
                  {/* Water Action */}
                  <div className="flex items-start space-x-2 p-2 rounded-lg bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40">
                    <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-[11px] text-sky-900 dark:text-sky-300 block">
                        {isHi ? 'जल प्रबंधन' : 'Water Practice'}
                      </span>
                      <p className="text-foreground/80 leading-snug">
                        {isHi ? plan.waterActionHi : plan.waterActionEn}
                      </p>
                    </div>
                  </div>

                  {/* Nitrogen Action */}
                  <div className="flex items-start space-x-2 p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-[11px] text-emerald-900 dark:text-emerald-300 block">
                        {isHi ? 'नाइट्रोजन / यूरिया' : 'Nitrogen Practice'}
                      </span>
                      <p className="text-foreground/80 leading-snug">
                        {isHi ? plan.nitrogenActionHi : plan.nitrogenActionEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
