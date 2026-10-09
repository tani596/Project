import React from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  Cpu,
  UserCheck,
  Eye,
  Sliders,
  ListChecks,
  AlertOctagon,
  Droplets,
  Layers,
  Sparkles,
} from 'lucide-react';

export const StorySections: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 3. Problem and our solution in plain language */}
      <section className="rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Problem */}
          <div className="space-y-4 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-center space-x-2.5 text-amber-700 dark:text-amber-400 font-semibold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t.problemHeading}</span>
            </div>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
              {t.problemBody}
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs font-medium text-amber-800 dark:text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
              <span>Fear of spikelet sterility prevents growers from draining water.</span>
            </div>
          </div>

          {/* Solution */}
          <div className="space-y-4 p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center space-x-2.5 text-emerald-800 dark:text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{t.solutionHeading}</span>
            </div>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
              {t.solutionBody}
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs font-medium text-emerald-800 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Calculated safe AWD aeration with strict anthesis moisture protection.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How it works, What our model considers, How the prototype solves it */}
      <section className="space-y-12">
        {/* How it works */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              Process Workflow
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
              {t.howItWorksHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">
                {t.step1Title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">
                {t.step2Title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border shadow-xs space-y-3 relative">
              <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <UserCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">
                {t.step3Title}
              </h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* What our model considers */}
        <div className="p-6 sm:p-8 rounded-2xl bg-muted-bg/50 border border-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground">
                {t.modelConsidersHeading}
              </h3>
              <p className="text-sm text-foreground/70 mt-1">
                {t.modelConsidersDesc}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 w-fit">
              4 Agronomic Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-1.5">
                <Layers className="w-4 h-4" />
                <span>1. Growth Stage</span>
              </div>
              <p className="text-xs text-foreground/70">
                Vegetative tillering vs critical panicle initiation and flowering anthesis.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center space-x-2 text-sky-700 dark:text-sky-400 font-semibold text-sm mb-1.5">
                <Droplets className="w-4 h-4" />
                <span>2. Water Condition</span>
              </div>
              <p className="text-xs text-foreground/70">
                Continuous 5-10cm ponding, alternate wetting & drying (AWD), or drought stress.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-semibold text-sm mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>3. Nitrogen & Canopy</span>
              </div>
              <p className="text-xs text-foreground/70">
                Leaf color chart readings and single-dose urea quantity (kg/ha) checks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-semibold text-sm mb-1.5">
                <Eye className="w-4 h-4" />
                <span>4. Grower Field Notes</span>
              </div>
              <p className="text-xs text-foreground/70">
                Soil texture, canal rotation schedule, and local weed/algae observations.
              </p>
            </div>
          </div>
        </div>

        {/* How the prototype solves it */}
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-6">
            {t.prototypeSolvesHeading}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center space-x-1.5">
                <FileText className="w-4 h-4" />
                <span>{t.featureInputsTitle}</span>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed">
                {t.featureInputsDesc}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center space-x-1.5">
                <Cpu className="w-4 h-4" />
                <span>{t.featureAgentTitle}</span>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed">
                {t.featureAgentDesc}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center space-x-1.5">
                <Sliders className="w-4 h-4" />
                <span>{t.featureScenarioTitle}</span>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed">
                {t.featureScenarioDesc}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center space-x-1.5">
                <ListChecks className="w-4 h-4" />
                <span>{t.featureChecklistTitle}</span>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed">
                {t.featureChecklistDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. What it does NOT do */}
      <section className="p-6 sm:p-8 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-4">
        <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 font-bold text-base">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <span>{t.whatItDoesNotDoHeading}</span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-foreground/80">
          <li className="flex items-start space-x-2 bg-card/60 p-3.5 rounded-lg border border-amber-500/20">
            <span className="text-amber-700 dark:text-amber-400 font-bold">✕</span>
            <span>{t.whatItDoesNotDo1}</span>
          </li>
          <li className="flex items-start space-x-2 bg-card/60 p-3.5 rounded-lg border border-amber-500/20">
            <span className="text-amber-700 dark:text-amber-400 font-bold">✕</span>
            <span>{t.whatItDoesNotDo2}</span>
          </li>
          <li className="flex items-start space-x-2 bg-card/60 p-3.5 rounded-lg border border-amber-500/20">
            <span className="text-amber-700 dark:text-amber-400 font-bold">✕</span>
            <span>{t.whatItDoesNotDo3}</span>
          </li>
        </ul>

        <p className="text-xs text-foreground/70 italic pt-1 border-t border-amber-500/20">
          {t.disclaimerNote}
        </p>
      </section>
    </div>
  );
};
