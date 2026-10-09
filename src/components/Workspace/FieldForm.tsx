import React from 'react';
import { useApp } from '../../context/AppContext';
import { FieldInputs, GrowthStage, WaterCondition, LeafColor } from '../../types/advisor';
import { RotateCcw, Sparkles, MapPin, AlertCircle } from 'lucide-react';

interface FieldFormProps {
  inputs: FieldInputs;
  onChange: (inputs: FieldInputs) => void;
  onSubmit: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export const FieldForm: React.FC<FieldFormProps> = ({
  inputs,
  onChange,
  onSubmit,
  onReset,
  isLoading,
}) => {
  const { t } = useApp();

  const handleTextChange = (field: keyof FieldInputs, value: string) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  const handleNumberChange = (field: 'latitude' | 'longitude' | 'lastUreaDose', value: string) => {
    onChange({
      ...inputs,
      [field]: value,
    });
  };

  // Coordinate validation
  const latNum = Number(inputs.latitude);
  const lonNum = Number(inputs.longitude);
  const isLatValid = !Number.isNaN(latNum) && latNum >= -90 && latNum <= 90;
  const isLonValid = !Number.isNaN(lonNum) && lonNum >= -180 && lonNum <= 180;
  const isUreaImplausible = inputs.lastUreaDose !== '' && inputs.lastUreaDose !== undefined && (Number(inputs.lastUreaDose) < 0 || Number(inputs.lastUreaDose) > 250);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
            Grower Field Observations
          </h3>
          <p className="text-xs text-foreground/70">
            User-entered observations for stage-calibrated guidance
          </p>
        </div>
        <button
          onClick={onReset}
          disabled={isLoading}
          type="button"
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-muted-bg hover:bg-card text-foreground/80 hover:text-foreground flex items-center space-x-1 transition-all disabled:opacity-50 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetBtn}</span>
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-4 text-xs sm:text-sm"
      >
        {/* Field Name */}
        <div>
          <label className="block font-semibold text-foreground mb-1">
            {t.fieldNameLabel}
          </label>
          <input
            type="text"
            value={inputs.fieldName}
            onChange={(e) => handleTextChange('fieldName', e.target.value)}
            placeholder={t.fieldNamePlaceholder}
            maxLength={100}
            required
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Coordinates Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-foreground mb-1 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t.latLabel}</span>
            </label>
            <input
              type="number"
              step="any"
              value={inputs.latitude}
              onChange={(e) => handleNumberChange('latitude', e.target.value)}
              required
              className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                !isLatValid && inputs.latitude !== '' ? 'border-red-500 ring-1 ring-red-500' : 'border-border'
              }`}
            />
            {!isLatValid && inputs.latitude !== '' && (
              <span className="text-[10px] text-red-500 mt-0.5 block">Range: -90 to 90</span>
            )}
          </div>

          <div>
            <label className="block font-semibold text-foreground mb-1">
              {t.lonLabel}
            </label>
            <input
              type="number"
              step="any"
              value={inputs.longitude}
              onChange={(e) => handleNumberChange('longitude', e.target.value)}
              required
              className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                !isLonValid && inputs.longitude !== '' ? 'border-red-500 ring-1 ring-red-500' : 'border-border'
              }`}
            />
            {!isLonValid && inputs.longitude !== '' && (
              <span className="text-[10px] text-red-500 mt-0.5 block">Range: -180 to 180</span>
            )}
          </div>
        </div>

        {/* Growth Stage */}
        <div>
          <label className="block font-semibold text-foreground mb-1">
            {t.growthStageLabel}
          </label>
          <select
            value={inputs.growthStage}
            onChange={(e) => handleTextChange('growthStage', e.target.value as GrowthStage)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="nursery">{t.stageNursery}</option>
            <option value="transplanting">{t.stageTransplanting}</option>
            <option value="tillering">{t.stageTillering}</option>
            <option value="panicle_initiation">{t.stagePanicleInitiation}</option>
            <option value="flowering">{t.stageFlowering}</option>
            <option value="grain_filling">{t.stageGrainFilling}</option>
            <option value="maturity">{t.stageMaturity}</option>
          </select>
          {inputs.growthStage === 'flowering' && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 flex items-center space-x-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Critical window: Drying soil now is prohibited by safety rules.</span>
            </p>
          )}
        </div>

        {/* Water Condition */}
        <div>
          <label className="block font-semibold text-foreground mb-1">
            {t.waterConditionLabel}
          </label>
          <select
            value={inputs.waterCondition}
            onChange={(e) => handleTextChange('waterCondition', e.target.value as WaterCondition)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="continuously_flooded">{t.waterContinuouslyFlooded}</option>
            <option value="alternate_wetting_drying">{t.waterAWD}</option>
            <option value="saturated">{t.waterSaturated}</option>
            <option value="drained">{t.waterDrained}</option>
            <option value="drought_stressed">{t.waterDroughtStressed}</option>
          </select>
        </div>

        {/* Leaf Canopy & Nitrogen */}
        <div>
          <label className="block font-semibold text-foreground mb-1">
            {t.leafColorLabel}
          </label>
          <select
            value={inputs.leafColor}
            onChange={(e) => handleTextChange('leafColor', e.target.value as LeafColor)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
          >
            <option value="healthy_green">{t.leafHealthyGreen}</option>
            <option value="mild_yellowing">{t.leafMildYellowing}</option>
            <option value="severe_yellowing">{t.leafSevereYellowing}</option>
            <option value="dark_green">{t.leafDarkGreen}</option>
            <option value="brown_spots">{t.leafBrownSpots}</option>
          </select>
        </div>

        {/* Urea Dose */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-semibold text-foreground">
              {t.ureaLabel}
            </label>
            <span className="text-[11px] text-muted">Typical: 30-80 kg/ha</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="500"
              value={inputs.lastUreaDose}
              onChange={(e) => handleNumberChange('lastUreaDose', e.target.value)}
              placeholder={t.ureaPlaceholder}
              className="w-full px-3 py-2 pr-16 rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <span className="absolute right-3 top-2 text-xs font-semibold text-muted pointer-events-none">
              kg/ha
            </span>
          </div>
          {isUreaImplausible && (
            <span className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 block">
              Flagged: Unusually high dose. Model will request local extension verification.
            </span>
          )}
        </div>

        {/* Notes (length-limited) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-semibold text-foreground">
              {t.notesLabel}
            </label>
            <span className="text-[11px] text-muted">
              {(inputs.notes || '').length}/300
            </span>
          </div>
          <textarea
            value={inputs.notes || ''}
            onChange={(e) => handleTextChange('notes', e.target.value)}
            placeholder={t.notesPlaceholder}
            maxLength={300}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !isLatValid || !isLonValid}
          className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-semibold text-sm shadow-xs transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              <span>{t.loadingAdvice}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.getAdviceBtn}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
