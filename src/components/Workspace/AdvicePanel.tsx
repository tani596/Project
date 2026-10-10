import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdviceResult, FieldInputs, SavedField } from '../../types/advisor';
import { AudioSpeechButton } from '../Tools/AudioSpeechButton';
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Share2,
  Copy,
  Printer,
  Sparkles,
  CheckSquare,
  Square,
  AlertTriangle,
  Bookmark,
  Check,
  Scale,
  SplitSquareVertical,
  Activity,
  FileCheck2,
  Send,
} from 'lucide-react';

interface AdvicePanelProps {
  advice: AdviceResult | null;
  inputs: FieldInputs;
  isLoading: boolean;
  checklist: Record<number, boolean>;
  onChecklistToggle: (idx: number) => void;
  onOpenCompare: () => void;
}

export const AdvicePanel: React.FC<AdvicePanelProps> = ({
  advice,
  inputs,
  isLoading,
  checklist,
  onChecklistToggle,
  onOpenCompare,
}) => {
  const { t, language, user, addSavedField, setIsAuthOpen } = useApp();
  const [whyOpen, setWhyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [simpleExplanation, setSimpleExplanation] = useState<string[] | null>(null);
  const [explainingSimply, setExplainingSimply] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted-bg rounded-md w-1/3"></div>
          <div className="h-6 bg-muted-bg rounded-full w-20"></div>
        </div>
        <div className="h-24 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-border"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 bg-muted-bg rounded-xl"></div>
          <div className="h-20 bg-muted-bg rounded-xl"></div>
        </div>
        <div className="space-y-3">
          <div className="h-14 bg-muted-bg rounded-xl"></div>
          <div className="h-14 bg-muted-bg rounded-xl"></div>
          <div className="h-14 bg-muted-bg rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!advice) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="max-w-sm space-y-1">
          <h3 className="font-display font-bold text-lg text-foreground">
            Awaiting Advisor Execution
          </h3>
          <p className="text-xs text-foreground/70">
            Click &quot;Get AI recommendations&quot; to compute stage-calibrated methane vs yield risk balance.
          </p>
        </div>
      </div>
    );
  }

  // Risk gauge color mapping
  const getRiskColors = (risk: 'low' | 'medium' | 'high', type: 'methane' | 'yield') => {
    if (risk === 'low') {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/50',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        bar: 'bg-emerald-500',
        label: t.lowRisk,
      };
    }
    if (risk === 'medium') {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/50',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        bar: 'bg-amber-500',
        label: t.medRisk,
      };
    }
    return {
      bg: 'bg-red-50 dark:bg-red-950/50',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-200 dark:border-red-800',
      bar: 'bg-red-500',
      label: t.highRisk,
    };
  };

  const methaneColors = getRiskColors(advice.methane_risk, 'methane');
  const yieldColors = getRiskColors(advice.yield_risk, 'yield');

  // Handle "Explain simply"
  const handleExplainSimply = async () => {
    if (simpleExplanation) return;
    setExplainingSimply(true);
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advice, language }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimpleExplanation(data.simple_lines);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setExplainingSimply(false);
    }
  };

  // Copy advice to clipboard
  const handleCopyAdvice = () => {
    const text = `RICE METHANE & YIELD ADVISOR
Field: ${inputs.fieldName} (Stage: ${inputs.growthStage}, Water: ${inputs.waterCondition})
Top Priority: ${advice.top_priority}

Risks:
- Methane Risk: ${advice.methane_risk.toUpperCase()}
- Yield Risk: ${advice.yield_risk.toUpperCase()}
- Confidence: ${advice.confidence.toUpperCase()}

Action Steps:
${advice.steps.map((s, idx) => `${idx + 1}. [${s.priority}] ${s.timing}: ${s.action} - ${s.why}`).join('\n')}

Trade-off: ${advice.trade_off_notes}

AI-generated guidance. Please confirm with a local agronomist before acting.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const shortText = `Rice Field Advice for ${inputs.fieldName}:\n*Top Priority*: ${advice.top_priority}\n*Methane Risk*: ${advice.methane_risk} | *Yield Risk*: ${advice.yield_risk}\nAI-generated guidance, confirm with a local agronomist.`;
    const url = `https://wa.me/?text=${encodeURIComponent(shortText)}`;
    window.open(url, '_blank');
  };

  // Save field and advice
  const handleSaveField = () => {
    const newField: SavedField = {
      id: 'field_' + Date.now(),
      user_id: user.id,
      field_name: inputs.fieldName || 'My Paddy',
      inputs,
      advice,
      checklist,
      created_at: new Date().toISOString(),
    };
    addSavedField(newField);
    setSaveStatus(t.saveFieldSuccess);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div
      aria-live="polite"
      className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs space-y-6"
    >
      {/* Header and badging */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center space-x-2">
          <h3 className="font-display font-bold text-lg text-foreground">
            Advisor Assessment
          </h3>
          {advice.source === 'rule_fallback' && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
              Basic rule-based guidance (AI unavailable)
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Audio speech readout */}
          <AudioSpeechButton advice={advice} />

          {/* Confidence Badge */}
          <div className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-muted-bg text-foreground border border-border">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.confidence}:</span>
            <span className="capitalize font-bold text-emerald-700 dark:text-emerald-400">
              {advice.confidence}
            </span>
          </div>
        </div>
      </div>

      {/* 7. Highlighted "Top priority this week" card */}
      <div className="p-4 sm:p-5 rounded-xl bg-linear-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{t.topPriorityTitle}</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
          {advice.top_priority}
        </p>
        <p className="text-xs text-foreground/75 italic">
          Direction: {advice.direction_of_change}
        </p>
      </div>

      {/* Risk Gauges: Methane & Yield */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Methane Risk Gauge */}
        <div className={`p-3.5 sm:p-4 rounded-xl border ${methaneColors.bg} ${methaneColors.border}`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-foreground/80">{t.methaneRisk}</span>
            <span className={`font-bold ${methaneColors.text}`}>
              {methaneColors.label}
            </span>
          </div>
          {/* Animated Gauge Bar */}
          <div className="w-full bg-black/10 dark:bg-white/10 h-2.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-700 rounded-full ${methaneColors.bar} ${
                advice.methane_risk === 'low'
                  ? 'w-1/3'
                  : advice.methane_risk === 'medium'
                  ? 'w-2/3'
                  : 'w-full'
              }`}
            ></div>
          </div>
          <span className="text-[10px] text-foreground/60 mt-1.5 block">
            {advice.methane_risk === 'high' ? 'Continuous standing water' : 'AWD or aerobic active'}
          </span>
        </div>

        {/* Yield Risk Gauge */}
        <div className={`p-3.5 sm:p-4 rounded-xl border ${yieldColors.bg} ${yieldColors.border}`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-foreground/80">{t.yieldRisk}</span>
            <span className={`font-bold ${yieldColors.text}`}>
              {yieldColors.label}
            </span>
          </div>
          {/* Animated Gauge Bar */}
          <div className="w-full bg-black/10 dark:bg-white/10 h-2.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-700 rounded-full ${yieldColors.bar} ${
                advice.yield_risk === 'low'
                  ? 'w-1/4'
                  : advice.yield_risk === 'medium'
                  ? 'w-2/3'
                  : 'w-full'
              }`}
            ></div>
          </div>
          <span className="text-[10px] text-foreground/60 mt-1.5 block">
            {advice.yield_risk === 'low' ? 'Stage moisture safe' : 'Check flowering / nitrogen deficit'}
          </span>
        </div>
      </div>

      {/* Methane vs Yield Balance Bar */}
      <div className="p-3 rounded-xl bg-muted-bg/60 border border-border space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
          <span className="flex items-center space-x-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.balanceBarTitle}</span>
          </span>
          <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-bold">
            Calibrated
          </span>
        </div>
        <p className="text-xs text-foreground/75 leading-tight">
          {advice.trade_off_notes}
        </p>
      </div>

      {/* 6. 4-step Agent Trace */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted block">
          Agent Reasoning Trace
        </span>
        <div className="space-y-2 text-xs">
          {advice.agent_trace.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-2.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                {idx + 1}
              </div>
              <div className="space-y-0.5">
                <span className="font-semibold text-foreground">{step.step}: </span>
                <span className="text-foreground/75">{step.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Steps & Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-sm sm:text-base text-foreground">
            {t.actionStepsTitle}
          </span>
          <span className="text-xs text-muted">
            Tick off as executed in field
          </span>
        </div>

        <div className="space-y-2.5">
          {advice.steps.map((step, idx) => {
            const isChecked = Boolean(checklist[idx]);
            const priorityBadge =
              step.priority === 'Do now'
                ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-200'
                : step.priority === 'Soon'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200';

            return (
              <div
                key={idx}
                onClick={() => onChecklistToggle(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  isChecked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 opacity-80'
                    : 'bg-card border-border hover:border-emerald-500/50'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-700 dark:text-emerald-400">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-100" />
                  ) : (
                    <Square className="w-5 h-5 text-muted" />
                  )}
                </div>

                <div className="space-y-1 w-full">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityBadge}`}>
                        {step.priority}
                      </span>
                      <span className="text-xs font-semibold text-muted">
                        {step.timing}
                      </span>
                    </div>
                  </div>

                  <p className={`text-sm font-semibold text-foreground ${isChecked ? 'line-through text-muted' : ''}`}>
                    {step.action}
                  </p>

                  <p className="text-xs text-foreground/70 leading-relaxed">
                    {step.why}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. Explain Simply (Farmer Summary) */}
      <div className="border-t border-border pt-4">
        {!simpleExplanation ? (
          <button
            onClick={handleExplainSimply}
            disabled={explainingSimply}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-emerald-600/30 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{explainingSimply ? t.explainSimplyLoading : t.explainSimplyBtn}</span>
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
              <span>{language === 'hi' ? 'किसान सरल सारांश:' : 'Simplified Farmer Summary:'}</span>
              <button
                onClick={() => setSimpleExplanation(null)}
                className="text-[11px] underline text-muted hover:text-foreground cursor-pointer"
              >
                Close
              </button>
            </div>
            <ul className="space-y-1.5 text-xs text-foreground">
              {simpleExplanation.map((line, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Compare Scenarios Button */}
      <button
        onClick={onOpenCompare}
        className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-sky-600/30 bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-300 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <SplitSquareVertical className="w-4 h-4 text-sky-600" />
        <span>{t.compareScenariosBtn}</span>
      </button>

      {/* Collapsible: Why this advice (Rules applied) */}
      <div className="border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => setWhyOpen(!whyOpen)}
          className="w-full px-4 py-3 bg-muted-bg/50 hover:bg-muted-bg text-left flex items-center justify-between text-xs font-bold text-foreground transition-all cursor-pointer"
        >
          <span>{t.whyThisAdvice}</span>
          {whyOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
        </button>

        {whyOpen && (
          <div className="p-4 space-y-3 bg-card text-xs border-t border-border">
            <p className="text-foreground/80 leading-relaxed font-mono text-[11px]">
              {advice.reasoning}
            </p>
          </div>
        )}
      </div>

      {/* Verify Locally warning list */}
      {advice.verify_locally && advice.verify_locally.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 text-amber-800 dark:text-amber-300 font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.verifyLocallyTitle}</span>
          </div>
          <ul className="list-disc list-inside text-foreground/80 space-y-0.5">
            {advice.verify_locally.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons: Copy, Print, WhatsApp, Save */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-semibold">
        <button
          onClick={handleCopyAdvice}
          className="min-h-[44px] p-2.5 rounded-xl border border-border bg-muted-bg hover:bg-card text-foreground flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-muted" />}
          <span>{copied ? t.copiedBtn : t.copyAdviceBtn}</span>
        </button>

        <button
          onClick={() => window.print()}
          className="min-h-[44px] p-2.5 rounded-xl border border-border bg-muted-bg hover:bg-card text-foreground flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Printer className="w-3.5 h-3.5 text-muted" />
          <span>{t.printPdfBtn}</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="min-h-[44px] p-2.5 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Send className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleSaveField}
          className="min-h-[44px] p-2.5 rounded-xl border border-border bg-muted-bg hover:bg-card text-foreground flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
          <span>{saveStatus || t.saveFieldBtn}</span>
        </button>
      </div>

      {user.isGuest && (
        <p className="text-[11px] text-muted text-center">
          {t.saveFieldGuestPrompt}{' '}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="text-emerald-700 dark:text-emerald-400 font-semibold underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      )}

      {/* Prominent required disclaimer */}
      <div className="p-3 rounded-lg bg-muted-bg text-center text-xs text-foreground/80 font-medium border border-border">
        {t.footerDisclaimer}
      </div>
    </div>
  );
};
