import React from 'react';
import { useApp } from '../../context/AppContext';
import { LeafColor } from '../../types/advisor';
import { X, Sparkles, Check, AlertCircle, ShieldCheck } from 'lucide-react';

interface LeafColorChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: LeafColor;
  onSelectColor: (color: LeafColor) => void;
}

export const LeafColorChartModal: React.FC<LeafColorChartModalProps> = ({
  isOpen,
  onClose,
  selectedColor,
  onSelectColor,
}) => {
  const { language } = useApp();
  const isHi = language === 'hi';

  if (!isOpen) return null;

  const panels = [
    {
      id: 'severe_yellowing' as LeafColor,
      panelNum: 1,
      colorHex: '#c8e08d',
      name: isHi ? 'पैनल 1: हल्का पीला-हरा' : 'Panel 1: Light Yellowish Green',
      status: isHi ? 'नाइट्रोजन की भारी कमी' : 'Severe Nitrogen Deficit',
      action: isHi ? 'तुरंत 30-35 किग्रा/हेक्टेयर यूरिया की टॉप-ड्रेसिंग करें' : 'Apply 30-35 kg urea/ha top-dress immediately',
      methaneNote: isHi ? 'कमजोर कल्ले, उपज को गंभीर खतरा' : 'Stunted tillering; severe yield risk',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
    },
    {
      id: 'mild_yellowing' as LeafColor,
      panelNum: 2,
      colorHex: '#9dc760',
      name: isHi ? 'पैनल 2: पीला-हरा' : 'Panel 2: Yellow-Green',
      status: isHi ? 'नाइट्रोजन की हल्की कमी' : 'Mild Nitrogen Deficit',
      action: isHi ? '25 किग्रा/हेक्टेयर यूरिया की हल्की खुराक दें' : 'Apply 20-25 kg urea/ha top-dress',
      methaneNote: isHi ? 'खड़े पानी में न डालें; नम मिट्टी पर दें' : 'Apply on moist soil, never in deep standing floodwater',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    },
    {
      id: 'healthy_green' as LeafColor,
      panelNum: 3,
      colorHex: '#529631',
      name: isHi ? 'पैनल 3: मध्यम गहरा हरा (आदर्श)' : 'Panel 3: Standard Green (Optimal)',
      status: isHi ? 'संतुलित नाइट्रोजन स्तर (आदर्श)' : 'Optimal Nitrogen Balance',
      action: isHi ? 'अभी यूरिया न डालें; 7 दिन बाद पुनः जांचें' : 'No urea required now; re-check in 7 days',
      methaneNote: isHi ? 'पौधे स्वस्थ हैं और मीथेन उत्सर्जन न्यूनतम है' : 'Canopy photosynthesis optimized with minimal N loss',
      badge: 'bg-emerald-600 text-white border-emerald-600',
    },
    {
      id: 'dark_green' as LeafColor,
      panelNum: 4,
      colorHex: '#1d5518',
      name: isHi ? 'पैनल 4: गहरा हरा (अत्यधिक)' : 'Panel 4: Dark Green (Luxury)',
      status: isHi ? 'अतिरिक्त नाइट्रोजन (हानिकारक)' : 'Excess / Over-fertilization',
      action: isHi ? 'यूरिया पूरी तरह रोकें! खाद न दें' : 'Strictly DO NOT apply urea',
      methaneNote: isHi ? 'अतिरिक्त यूरिया से फफूंद रोग व भारी मीथेन गैस बनती है' : 'Excess N triggers sheath blight, lodging & spikes methane emissions',
      badge: 'bg-red-100 text-red-900 border-red-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                {isHi ? 'आईआरआरआई लीफ कलर चार्ट (LCC) कैलिब्रेशन' : 'IRRI 4-Panel Leaf Color Chart (LCC)'}
              </h3>
              <p className="text-xs text-foreground/70">
                {isHi
                  ? 'धान की सबसे ऊपरी स्वस्थ पत्ती का रंग मिलाएँ और सटीक खुराक चुनें'
                  : 'Calibrate nitrogen application by matching the top-most fully expanded leaf'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted-bg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed">
          {isHi
            ? 'वैज्ञानिक नियम: सुबह 9 से 11 बजे के बीच सूर्य की रोशनी में धान के पौधे की 10 पत्तियों का रंग चार्ट से मिलाया जाता है। सही पैनल चुनने पर फॉर्म में रंग स्वतः अपडेट हो जाएगा।'
            : 'Agronomic guideline: Measure 10 disease-free leaves per field at mid-morning without direct glare. Select the matching panel below to populate your advisor.'}
        </p>

        {/* 4 LCC Color Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {panels.map((panel) => {
            const isSelected = selectedColor === panel.id;

            return (
              <div
                key={panel.id}
                onClick={() => {
                  onSelectColor(panel.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-border bg-card hover:border-emerald-400'
                }`}
              >
                <div>
                  {/* Swatch Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground">
                      {panel.name}
                    </span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Physical LCC Color Bar */}
                  <div
                    className="w-full h-12 rounded-lg border border-black/20 shadow-inner flex items-center justify-center text-xs font-bold text-black/80"
                    style={{ backgroundColor: panel.colorHex }}
                  >
                    <span className="bg-white/80 px-2 py-0.5 rounded-sm shadow-xs">
                      LCC #{panel.panelNum}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="text-xs font-bold text-foreground">
                      {panel.status}
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                      → {panel.action}
                    </p>
                    <p className="text-[11px] text-muted">
                      {panel.methaneNote}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex justify-end">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    {isSelected ? (isHi ? '✓ चयनित' : '✓ Selected') : (isHi ? 'इसे चुनें' : 'Select this panel')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
