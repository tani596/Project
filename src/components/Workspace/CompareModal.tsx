import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FieldInputs, ScenarioComparison, WaterCondition } from '../../types/advisor';
import { X, SplitSquareVertical, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: FieldInputs;
}

export const CompareModal: React.FC<CompareModalProps> = ({ isOpen, onClose, inputs }) => {
  const { t, language } = useApp();
  const [altCondition, setAltCondition] = useState<WaterCondition>(
    inputs.waterCondition === 'continuously_flooded'
      ? 'alternate_wetting_drying'
      : 'continuously_flooded'
  );
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchComparison = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/compare-scenarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputs: { ...inputs, language },
            alternativeWaterCondition: altCondition,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setComparison(data);
        }
      } catch (err) {
        console.error('Failed to compare scenarios', err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [isOpen, altCondition, inputs, language]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-400">
              <SplitSquareVertical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-foreground">
                Water Management Scenario Contrast
              </h3>
              <p className="text-xs text-foreground/70">
                Rule-computed risk differential for &quot;{inputs.fieldName}&quot; ({inputs.growthStage})
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

        {/* Alternative Condition Selector */}
        <div className="flex items-center space-x-3 text-xs sm:text-sm">
          <label className="font-semibold text-foreground shrink-0">
            Compare Against:
          </label>
          <select
            value={altCondition}
            onChange={(e) => setAltCondition(e.target.value as WaterCondition)}
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground"
          >
            <option value="alternate_wetting_drying">Alternate Wetting & Drying (AWD)</option>
            <option value="continuously_flooded">Continuous Flooding (5-10cm)</option>
            <option value="saturated">Saturated (Moist, no flood)</option>
            <option value="drained">Drained</option>
          </select>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-muted">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Computing agronomic contrast...
          </div>
        ) : comparison ? (
          <div className="space-y-5">
            {/* Side-by-side cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Practice */}
              <div className="p-4 rounded-xl border border-border bg-muted-bg/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted uppercase">
                    Current Practice
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-card border border-border font-medium capitalize">
                    {comparison.current.waterCondition.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted font-medium">Methane Risk:</span>
                    <span className={`font-bold capitalize ${
                      comparison.current.methane_risk === 'high' ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {comparison.current.methane_risk}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted font-medium">Yield Risk:</span>
                    <span className={`font-bold capitalize ${
                      comparison.current.yield_risk === 'high' ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {comparison.current.yield_risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Alternative Practice */}
              <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase">
                    Alternative Practice
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 font-bold text-emerald-900 dark:text-emerald-200 capitalize">
                    {comparison.alternative.waterCondition.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted font-medium">Methane Risk:</span>
                    <span className={`font-bold capitalize ${
                      comparison.alternative.methane_risk === 'high' ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {comparison.alternative.methane_risk}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-card border border-border">
                    <span className="text-muted font-medium">Yield Risk:</span>
                    <span className={`font-bold capitalize ${
                      comparison.alternative.yield_risk === 'high' ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {comparison.alternative.yield_risk}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code-computed Explanation */}
            <div className="p-4 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground/90 space-y-1.5">
              <span className="font-bold text-xs uppercase tracking-wider text-muted block">
                Agronomic Evaluation
              </span>
              <p className="leading-relaxed">
                {comparison.explanation}
              </p>
            </div>
          </div>
        ) : null}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-muted-bg hover:bg-card border border-border text-foreground font-semibold text-xs cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
