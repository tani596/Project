import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowDown, CheckCircle, Leaf, ShieldAlert } from 'lucide-react';
import aerialPaddyImg from '../assets/paddyImage';

export const Hero: React.FC = () => {
  const { t } = useApp();

  const handleScrollToWorkspace = () => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-border bg-linear-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Example field loaded badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse"></span>
              <span>{t.exampleLoadedBadge}</span>
            </div>

            {/* Main Tagline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              <span className="text-emerald-700 dark:text-emerald-400 block">{t.tagline.split('.')[0]}.</span>
              <span className="text-foreground block">{t.tagline.split('.')[1] || 'Keep yields steady.'}</span>
            </h1>

            {/* One-line Description */}
            <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl font-normal">
              {t.heroSub}
            </p>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-foreground/80">
              <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-card border border-border">
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Up to 45% lower CH₄</span>
              </div>
              <div className="flex items-center space-x-2 p-2.5 rounded-lg bg-card border border-border">
                <CheckCircle className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Zero yield penalty</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center space-x-2 p-2.5 rounded-lg bg-card border border-border">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Stage-safe rules</span>
              </div>
            </div>

            {/* Action button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleScrollToWorkspace}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{t.tryExampleBtn}</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>

          {/* Right Column: Generated aerial rice-field image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border bg-card group">
              <img
                src={aerialPaddyImg}
                alt="High resolution aerial view of lush green rice paddy fields with reflective irrigation channels"
                className="w-full h-72 sm:h-88 lg:h-96 object-cover transform transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Water & paddy overlay badge */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center space-x-1.5 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Illustrative Paddy Ecosystem</span>
                  </span>
                  <span className="text-white/80">Karnal Basin</span>
                </div>
                <p className="text-[11px] text-white/90 leading-tight">
                  Simulating Alternate Wetting & Drying (AWD) water depth and canopy nitrogen balance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
