import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calculator, Leaf, DollarSign, Droplets, Car, Award, TrendingUp, Download } from 'lucide-react';

export const CarbonCalculator: React.FC = () => {
  const { language } = useApp();
  const isHi = language === 'hi';

  const [area, setArea] = useState<number>(2.5); // Hectares
  const [unit, setUnit] = useState<'ha' | 'acre'>('ha');
  const [seasonDays, setSeasonDays] = useState<number>(115); // Days

  // Convert to hectares for calculation
  const areaInHa = unit === 'ha' ? area : area * 0.4047;

  // Scientific Constants (IPCC Tier-2 Rice Guidelines & IRRI Field Trials)
  // Baseline flooded paddy emits ~1.3 - 1.5 kg CH4 / ha / day
  // AWD cuts emissions by 40% on average
  const baselineCH4PerHaPerDay = 1.35; // kg CH4 / ha / day
  const awdReductionRate = 0.42; // 42% reduction

  const totalBaselineCH4 = areaInHa * baselineCH4PerHaPerDay * seasonDays; // kg CH4
  const ch4SavedKg = totalBaselineCH4 * awdReductionRate; // kg CH4 avoided
  const co2eAvoidedTonnes = (ch4SavedKg * 28) / 1000; // 1 kg CH4 = 28 kg CO2e (IPCC AR5 GWP100)

  // Irrigation water saved: typical rice requires ~12,000 m3/ha. AWD saves ~20%
  const waterSavedLiters = Math.round(areaInHa * 2400000); // 2.4 million liters / ha
  const waterSavedMillionLiters = (waterSavedLiters / 1000000).toFixed(2);

  // Diesel / Electricity pumping cost saved:
  // ~25-30 pumping hours saved per ha @ ₹160/hr diesel or ₹120 power = ~₹4,200/ha
  const rupeeSaved = Math.round(areaInHa * 4200);

  // Carbon Credit potential: Voluntary Carbon Market (VCM) rice projects typically yield ~2.5 - 3.2 tCO2e/ha/season
  // At $12/tonne = ~$30 - $38 / ha (~₹2,500 - ₹3,100 / ha)
  const carbonRevenueRupees = Math.round(co2eAvoidedTonnes * 12 * 86); // $12 @ ₹86/USD

  // Real world equivalent: average car emits ~0.192 kg CO2 / km
  const carKmEquivalent = Math.round((co2eAvoidedTonnes * 1000) / 0.192);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Calculator className="w-5 h-5" />
          </span>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
              {isHi ? 'मीथेन, जल व कार्बन क्रेडिट इम्पैक्ट कैलकुलेटर' : 'Methane, Water & Carbon Credit Impact Engine'}
            </h3>
            <p className="text-xs text-foreground/70">
              {isHi
                ? 'IPCC टियर-2 और आईआरआरआई वैज्ञानिक मॉडल पर आधारित वास्तविक गणना'
                : 'Scientific impact modeling based on IPCC Tier-2 Rice Guidelines & IRRI AWD trials'}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 w-fit">
          IPCC AR5 GWP28 Vetted
        </span>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-muted-bg/50 p-4 rounded-xl border border-border">
        {/* Field Area */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-foreground">
            {isHi ? 'खेत का रकबा / क्षेत्रफल' : 'Field Area'}
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="0.1"
              max="500"
              step="0.5"
              value={area}
              onChange={(e) => setArea(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm font-bold"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'ha' | 'acre')}
              className="px-2 py-1.5 rounded-lg border border-border bg-card text-foreground text-xs font-semibold"
            >
              <option value="ha">{isHi ? 'हेक्टेयर' : 'Hectares'}</option>
              <option value="acre">{isHi ? 'एकड़' : 'Acres'}</option>
            </select>
          </div>
        </div>

        {/* Season Days */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-foreground">
            {isHi ? 'फसल की अवधि (दिन)' : 'Crop Season Duration (Days)'}
          </label>
          <input
            type="number"
            min="60"
            max="180"
            value={seasonDays}
            onChange={(e) => setSeasonDays(Math.max(60, Number(e.target.value)))}
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground text-sm font-bold"
          />
        </div>

        {/* Standard practice compared */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-foreground">
            {isHi ? 'तुलनात्मक अभ्यास' : 'Practice Shift'}
          </label>
          <div className="p-2 rounded-lg bg-card border border-border text-xs text-foreground font-semibold flex items-center justify-between">
            <span>Continuous Flood</span>
            <span className="text-emerald-600 font-bold">→ AWD</span>
          </div>
        </div>
      </div>

      {/* 4 Impact Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: GHG Avoided */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
            <span className="text-xs font-bold uppercase">{isHi ? 'ग्रीनहाउस गैस कटौती' : 'GHG Avoided'}</span>
            <Leaf className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl font-black text-foreground">
            {co2eAvoidedTonnes.toFixed(1)} <span className="text-sm font-semibold text-muted">tCO₂e</span>
          </div>
          <p className="text-[11px] text-foreground/75">
            {Math.round(ch4SavedKg)} kg शुद्ध मीथेन गैस का वातावरण में उत्सर्जन रोका गया।
          </p>
        </div>

        {/* Card 2: Groundwater Saved */}
        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-2">
          <div className="flex items-center justify-between text-sky-800 dark:text-sky-300">
            <span className="text-xs font-bold uppercase">{isHi ? 'भूजल की बचत' : 'Water Conserved'}</span>
            <Droplets className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl font-black text-foreground">
            {waterSavedMillionLiters} <span className="text-sm font-semibold text-muted">M Liters</span>
          </div>
          <p className="text-[11px] text-foreground/75">
            लगभग {Math.round(areaInHa * 25)}% सिंचाई पानी की सीधी बचत (ट्यूबल पंपिंग कम)।
          </p>
        </div>

        {/* Card 3: Diesel/Power Cost Saved */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300">
            <span className="text-xs font-bold uppercase">{isHi ? 'डीजल / बिजली बचत' : 'Pumping Cost Saved'}</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl font-black text-foreground">
            ₹{rupeeSaved.toLocaleString()}
          </div>
          <p className="text-[11px] text-foreground/75">
            खेत में अनावश्यक पंपिंग न होने से किसान के ईंधन खर्च में शुद्ध बचत।
          </p>
        </div>

        {/* Card 4: Carbon Credit Revenue */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between text-purple-800 dark:text-purple-300">
            <span className="text-xs font-bold uppercase">{isHi ? 'कार्बन क्रेडिट आय' : 'Carbon Credit Potential'}</span>
            <Award className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl font-black text-foreground">
            ₹{carbonRevenueRupees.toLocaleString()}
          </div>
          <p className="text-[11px] text-foreground/75">
            Verra VM0042 पैडी प्रोटोकॉल के तहत संभावित अतिरिक्त आय ($12/tCO₂e).
          </p>
        </div>
      </div>

      {/* Tangible Equivalent Banner */}
      <div className="p-3.5 rounded-xl bg-muted-bg border border-border flex items-center space-x-3 text-xs text-foreground/80">
        <Car className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <strong>{isHi ? 'वास्तविक जीवन में प्रभाव:' : 'Real-World Equivalency:'}</strong>{' '}
          {isHi
            ? `आपके ${area} ${unit === 'ha' ? 'हेक्टेयर' : 'एकड़'} खेत में AWD अपनाने से पेट्रोल कार द्वारा ${carKmEquivalent.toLocaleString()} किमी चलने के बराबर कार्बन कम होगा!`
            : `Implementing AWD on your ${area} ${unit} paddy eliminates greenhouse emissions equivalent to driving a petrol car for ${carKmEquivalent.toLocaleString()} kilometers!`}
        </div>
      </div>
    </div>
  );
};
