import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useApp();

  return (
    <footer className="border-t border-border bg-card py-12 text-xs text-foreground/75">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-foreground font-display font-bold text-base">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span>{t.appName}</span>
            </div>
            <p className="max-w-md text-foreground/70">
              Supporting sustainable rice cultivation through scientifically vetted methane abatement and yield security protocols.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 max-w-md space-y-1">
            <div className="flex items-center space-x-1.5 text-amber-900 dark:text-amber-300 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Agronomic Responsibility Notice</span>
            </div>
            <p className="text-[11px] text-foreground/80 leading-normal">
              {t.footerDisclaimer} Soil hydrology varies by soil texture, hardpan depth, and water table.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted text-[11px]">
          <div>
            Built with strict agronomic safety guardrails. Prototype demonstrates user-entered observations and deterministic risk boundaries.
          </div>
          <div className="flex items-center space-x-1">
            <span>Rice Methane & Yield Advisor</span>
            <span>•</span>
            <span>Karnal, Haryana & Global Rice Basins</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
