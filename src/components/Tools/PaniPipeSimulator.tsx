import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Droplets, AlertTriangle, CheckCircle2, Info, ArrowDown, ArrowUp } from 'lucide-react';
import { GrowthStage } from '../../types/advisor';

interface PaniPipeSimulatorProps {
  currentStage: GrowthStage;
}

export const PaniPipeSimulator: React.FC<PaniPipeSimulatorProps> = ({ currentStage }) => {
  const { language } = useApp();
  const isHi = language === 'hi';

  // Water depth in cm relative to soil surface (positive = standing water, negative = below surface)
  const [waterDepth, setWaterDepth] = useState<number>(-8);

  const isFlowering = currentStage === 'flowering';

  // Status computation based on IRRI AWD Guidelines
  let status = 'safe_awd';
  let statusTitle = '';
  let statusDesc = '';
  let badgeColor = '';

  if (waterDepth > 0) {
    status = 'flooded';
    statusTitle = isHi ? 'खेत में खड़ा पानी (+ ' + waterDepth + ' सेमी)' : 'Standing Water (+' + waterDepth + ' cm)';
    statusDesc = isHi
      ? 'मिट्टी में हवा नहीं जा रही है। अगर कल्ले फूट रहे हैं तो पानी सूखने दें, नया पानी न लगाएं।'
      : 'Soil is submerged; anaerobic methanogens are active. Safe to withhold irrigation and let water drop.';
    badgeColor = 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300';
  } else if (waterDepth >= -14) {
    status = 'safe_awd';
    statusTitle = isHi
      ? 'सुरक्षित AWD एरोबिक क्षेत्र (' + waterDepth + ' सेमी)'
      : 'Optimal AWD Aeration Zone (' + waterDepth + ' cm)';
    statusDesc = isHi
      ? 'जड़ों में भरपूर ऑक्सीजन पहुंच रही है! मीथेन गैस बनना 40-50% तक रुक गया है और फसल सुरक्षित है।'
      : 'Oxygen is diffusing into soil pores. Methanogenesis is suppressed by ~45% while roots maintain healthy turgor.';
    badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
  } else if (waterDepth === -15) {
    status = 'trigger_irrigate';
    statusTitle = isHi
      ? 'सिंचाई का सही समय! (-15 सेमी सीमा)'
      : 'AWD Irrigation Threshold Reached (-15 cm)';
    statusDesc = isHi
      ? 'पानी 15 सेमी नीचे पहुंच गया है। अब 5 सेमी तक पुनः पानी भरें। इससे पानी और मीथेन दोनों बचेंगे!'
      : 'Threshold reached! Re-flood to 5 cm depth. This periodic cycle maintains full grain yield.';
    badgeColor = 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
  } else {
    status = 'danger';
    statusTitle = isHi
      ? 'अत्यधिक सूखा जोखिम (' + waterDepth + ' सेमी)'
      : 'Excessive Soil Moisture Deficit (' + waterDepth + ' cm)';
    statusDesc = isHi
      ? 'पानी 15 सेमी से ज्यादा नीचे चला गया है। तुरंत पानी दें अन्यथा कल्ले और बालियों पर असर पड़ेगा!'
      : 'Water level is below the safe AWD threshold. Irrigate immediately to prevent root drought stress.';
    badgeColor = 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 border-red-300';
  }

  // Override for flowering stage
  if (isFlowering && waterDepth <= 0) {
    statusTitle = isHi ? 'चेतावनी: फूल आने पर खेत न सुखाएं!' : 'CRITICAL: No AWD During Flowering!';
    statusDesc = isHi
      ? 'फूल आने (Anthesis) की अवस्था में खेत में 3-5 सेमी पानी होना अनिवार्य है। पानी न सूखने दें!'
      : 'Drying during anthesis causes pollen sterility. Maintain 3-5 cm standing water immediately!';
    badgeColor = 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 border-red-300';
  }

  // Visual tube height calculations (0cm is at 45% height, +10cm is at 15%, -25cm is at 90%)
  // Range from +10 to -25 = 35cm total
  const waterPercent = Math.max(0, Math.min(100, ((10 - waterDepth) / 35) * 100));

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
              <Droplets className="w-4 h-4" />
            </span>
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
              {isHi ? 'आईआरआरआई पानी पाइप (Pani Pipe) इंटरएक्टिव सिम्युलेटर' : 'IRRI AWD "Pani Pipe" Depth Simulator'}
            </h3>
          </div>
          <p className="text-xs text-foreground/70 mt-0.5">
            {isHi
              ? 'खेत में छिद्रित पाइप के अंदर पानी का स्तर जांचें और समझें कि कब पानी देना है'
              : 'Interactive cross-section of field perforated tube tracking safe soil aeration limits'}
          </p>
        </div>

        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor} self-start sm:self-auto`}>
          {statusTitle}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Visual Cross-Section Diagram */}
        <div className="md:col-span-6 bg-muted-bg/50 rounded-2xl border border-border p-4 relative overflow-hidden flex flex-col items-center">
          <div className="w-full text-center text-xs font-bold text-muted mb-2">
            {isHi ? 'खेत की मिट्टी का क्रॉस-सेक्शन व पानी का स्तर' : 'Paddy Soil Cross-Section & Water Table'}
          </div>

          <div className="relative w-48 h-64 border-2 border-slate-400 dark:border-slate-600 rounded-xl bg-amber-950/20 dark:bg-amber-950/40 overflow-hidden shadow-inner flex flex-col justify-between">
            {/* Standing Water Zone (+10cm to 0cm) */}
            <div className="h-[28%] w-full border-b-2 border-dashed border-emerald-600 relative bg-sky-500/10">
              <span className="absolute left-2 top-1 text-[10px] font-bold text-sky-700 dark:text-sky-400">
                +10 cm
              </span>
              <span className="absolute right-2 bottom-1 text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">
                0 cm (Soil Surface)
              </span>
            </div>

            {/* Root & Soil Zone (0cm to -25cm) */}
            <div className="h-[72%] w-full relative bg-amber-950/30 flex flex-col justify-between p-2">
              {/* -15cm Safe AWD Line */}
              <div className="absolute top-[60%] left-0 right-0 border-b-2 border-dashed border-amber-500 flex items-center justify-between px-2">
                <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 bg-card/80 px-1 rounded-xs">
                  -15 cm (Safe AWD Threshold)
                </span>
              </div>

              {/* Water Fill Level in the Tube */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-24 bg-sky-500/40 dark:bg-sky-400/30 border-x-2 border-sky-400 transition-all duration-300"
                style={{
                  top: `${waterPercent}%`,
                  bottom: 0,
                }}
              >
                <div className="w-full h-1 bg-sky-400 animate-pulse"></div>
                <div className="w-full text-center text-[10px] font-extrabold text-sky-900 dark:text-sky-100 mt-1">
                  {waterDepth > 0 ? `+${waterDepth} cm` : `${waterDepth} cm`}
                </div>
              </div>

              {/* Perforated PVC Pipe Representation */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-24 border-2 border-slate-500 rounded-t-sm pointer-events-none flex flex-col justify-around items-center opacity-60">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 dark:bg-slate-300"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 dark:bg-slate-300"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full text-center text-[11px] text-muted mt-2">
            {isHi ? 'छिद्रित प्लास्टिक पाइप (Pani Pipe) खेत में 15 सेमी तक गड़ा रहता है' : 'Perforated field tube installed 15-20 cm into root zone'}
          </div>
        </div>

        {/* Right: Controls & Scientific Explanation */}
        <div className="md:col-span-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-foreground">
              <span>{isHi ? 'पानी की गहराई नियंत्रित करें:' : 'Simulate Water Depth:'}</span>
              <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                {waterDepth > 0 ? `+${waterDepth} cm (Standing)` : `${waterDepth} cm (Below Surface)`}
              </span>
            </div>

            <input
              type="range"
              min="-25"
              max="10"
              step="1"
              value={waterDepth}
              onChange={(e) => setWaterDepth(Number(e.target.value))}
              className="w-full h-2 bg-muted-bg rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex justify-between text-[10px] text-muted font-medium">
              <span>-25 cm (Drought Risk)</span>
              <span className="text-amber-600 font-bold">-15 cm (Irrigate)</span>
              <span>0 cm</span>
              <span>+10 cm (Flooded)</span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => setWaterDepth(5)}
              className="px-2.5 py-1 rounded-lg border border-border bg-card hover:bg-muted-bg text-foreground cursor-pointer"
            >
              +5 cm ({isHi ? 'ताजा सिंचाई' : 'Re-flooded'})
            </button>
            <button
              onClick={() => setWaterDepth(-8)}
              className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 cursor-pointer"
            >
              -8 cm ({isHi ? 'आदर्श AWD' : 'Ideal AWD Aeration'})
            </button>
            <button
              onClick={() => setWaterDepth(-15)}
              className="px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-200 cursor-pointer font-bold"
            >
              -15 cm ({isHi ? 'पुनः सिंचाई सीमा' : 'Re-irrigate Threshold'})
            </button>
          </div>

          {/* Scientific Status Box */}
          <div className={`p-4 rounded-xl border ${badgeColor} text-xs space-y-1.5`}>
            <div className="font-bold text-sm flex items-center space-x-1.5">
              {waterDepth <= -15 ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
              <span>{statusTitle}</span>
            </div>
            <p className="leading-relaxed opacity-90">
              {statusDesc}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-muted-bg/60 text-[11px] text-foreground/80 flex items-start space-x-2">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-tight">
              {isHi
                ? 'आईआरआरआई व भारतीय कृषि अनुसंधान परिषद (ICAR) के अनुसार, जब तक पानी 15 सेमी नीचे न जाए, नई सिंचाई न करें (फूल आने की अवस्था को छोड़कर)।'
                : 'According to IRRI & ICAR, irrigating only when water drops 15 cm below surface saves 15-30% pumping water without yield loss.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
