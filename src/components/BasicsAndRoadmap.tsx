import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Droplets,
  Sprout,
  Flame,
  Satellite,
  Mic,
  CalendarDays,
  BrainCircuit,
  Info,
} from 'lucide-react';

export const BasicsAndRoadmap: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* 7. Methane-saving basics */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            Agronomic Foundation
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-1">
            {t.basicsHeading}
          </h2>
          <p className="text-sm text-foreground/70 mt-1 max-w-3xl">
            {t.basicsSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AWD */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-foreground">
                {t.awdCardTitle}
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 py-0.5 rounded-sm bg-muted-bg border border-border w-fit inline-block">
              General guidance, confirm locally
            </span>
            <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
              {t.awdCardBody}
            </p>
          </div>

          {/* Card 2: Nitrogen Timing */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-foreground">
                {t.nitrogenCardTitle}
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 py-0.5 rounded-sm bg-muted-bg border border-border w-fit inline-block">
              General guidance, confirm locally
            </span>
            <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
              {t.nitrogenCardBody}
            </p>
          </div>

          {/* Card 3: Straw Management */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-foreground">
                {t.strawCardTitle}
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 py-0.5 rounded-sm bg-muted-bg border border-border w-fit inline-block">
              General guidance, confirm locally
            </span>
            <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
              {t.strawCardBody}
            </p>
          </div>
        </div>
      </section>

      {/* 8. Planned integration card & Coming next strip */}
      <section className="space-y-6">
        {/* Planned integration card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-muted-bg/60 border border-border space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <Satellite className="w-5 h-5 text-indigo-600" />
              <h3 className="font-display font-bold text-lg text-foreground">
                {t.plannedCardTitle}
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
              {t.plannedBadge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed max-w-4xl">
            {t.plannedCardBody}
          </p>
        </div>

        {/* Coming next strip */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
          <h4 className="font-display font-bold text-base text-foreground flex items-center space-x-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>{t.comingNextHeading}</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-muted-bg/40 border border-border flex items-start space-x-3">
              <CalendarDays className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  Season-wise Comparison
                </span>
                <p className="text-xs text-foreground/70">
                  {t.comingNext1}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted-bg/40 border border-border flex items-start space-x-3">
              <Mic className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  Local-Language Voice Input
                </span>
                <p className="text-xs text-foreground/70">
                  {t.comingNext2}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted-bg/40 border border-border flex items-start space-x-3">
              <BrainCircuit className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground block">
                  Verified Outcome Learning
                </span>
                <p className="text-xs text-foreground/70">
                  {t.comingNext3}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
