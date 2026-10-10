import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FieldInputs, AdviceResult } from '../../types/advisor';
import { FieldForm } from './FieldForm';
import { MapView } from './MapView';
import { AdvicePanel } from './AdvicePanel';
import { CompareModal } from './CompareModal';
import { SeasonPlanCard } from './SeasonPlanCard';
import { ModelDecisionCard } from './ModelDecisionCard';
import { PaniPipeSimulator } from '../Tools/PaniPipeSimulator';
import { CarbonCalculator } from '../Tools/CarbonCalculator';
import { Sprout, Droplets, Calculator } from 'lucide-react';

const exampleField: FieldInputs = {
  fieldName: 'Example paddy, Karnal',
  latitude: 29.69,
  longitude: 76.99,
  growthStage: 'tillering',
  waterCondition: 'continuously_flooded',
  leafColor: 'mild_yellowing',
  lastUreaDose: 60,
  notes: 'Transplanted 23 days ago, clay-loam soil, tubewell irrigation scheduled in 4 days.',
};

export const Workspace: React.FC = () => {
  const { language, t } = useApp();
  const [inputs, setInputs] = useState<FieldInputs>(exampleField);
  const [advice, setAdvice] = useState<AdviceResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'advisor' | 'pani_pipe' | 'impact_calc'>('advisor');

  // Fetch advice from server API
  const fetchAdvice = async (fieldData = inputs) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fieldData,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAdvice(data);
        setChecklist({});
      }
    } catch (err) {
      console.error('Failed to get advice:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load with example field
  useEffect(() => {
    fetchAdvice(exampleField);
  }, [language]);

  const handleReset = () => {
    setInputs(exampleField);
    fetchAdvice(exampleField);
  };

  const handleApplyPreset = (presetData: FieldInputs) => {
    setInputs(presetData);
    fetchAdvice(presetData);
  };

  const handleChecklistToggle = (idx: number) => {
    setChecklist(prev => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <section id="workspace" className="py-12 bg-muted-bg/30 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Workspace Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              {t.workspaceHeading}
            </h2>
            <p className="text-xs sm:text-sm text-foreground/75 mt-0.5">
              {t.workspaceSub}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Live Field Advisor Engine
            </span>
          </div>
        </div>

        {/* Workspace Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'advisor'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-card text-foreground/80 hover:bg-muted-bg border border-border'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{language === 'hi' ? 'खेत सलाहकार (3-ज़ोन)' : 'Field Advisor (3-Zone)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pani_pipe')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'pani_pipe'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-card text-foreground/80 hover:bg-muted-bg border border-border'
            }`}
          >
            <Droplets className="w-4 h-4 text-sky-500" />
            <span>{language === 'hi' ? 'AWD पानी पाइप सिम्युलेटर' : 'AWD Pani Pipe Simulator'}</span>
          </button>

          <button
            onClick={() => setActiveTab('impact_calc')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'impact_calc'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-card text-foreground/80 hover:bg-muted-bg border border-border'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-500" />
            <span>{language === 'hi' ? 'मीथेन व कार्बन क्रेडिट इंजन' : 'Methane & Carbon Impact Engine'}</span>
          </button>
        </div>

        {activeTab === 'advisor' && (
          /* 3-Zone Desktop Grid (Left: Form, Center: Map/Coordinates, Right: AI Advice) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Zone 1: Form (Left) */}
            <div className="lg:col-span-4 order-1">
              <FieldForm
                inputs={inputs}
                onChange={setInputs}
                onSubmit={() => fetchAdvice(inputs)}
                onReset={handleReset}
                onApplyPreset={handleApplyPreset}
                isLoading={isLoading}
              />
            </div>

            {/* Zone 2: Map & Coordinates View (Center) */}
            <div className="lg:col-span-4 order-2">
              <MapView inputs={inputs} />
            </div>

            {/* Zone 3: AI Advice Panel & Cards (Right) */}
            <div className="lg:col-span-4 order-3 space-y-6">
              <AdvicePanel
                advice={advice}
                inputs={inputs}
                isLoading={isLoading}
                checklist={checklist}
                onChecklistToggle={handleChecklistToggle}
                onOpenCompare={() => setIsCompareOpen(true)}
              />
              <SeasonPlanCard currentStage={inputs.growthStage} />
              <ModelDecisionCard />
            </div>
          </div>
        )}

        {activeTab === 'pani_pipe' && (
          <div className="space-y-4">
            <PaniPipeSimulator currentStage={inputs.growthStage} />
          </div>
        )}

        {activeTab === 'impact_calc' && (
          <div className="space-y-4">
            <CarbonCalculator />
          </div>
        )}
      </div>

      {/* Scenario Compare Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        inputs={inputs}
      />
    </section>
  );
};
