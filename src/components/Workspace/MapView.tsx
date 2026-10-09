import React from 'react';
import { useApp } from '../../context/AppContext';
import { FieldInputs } from '../../types/advisor';
import { MapPin, Navigation, Droplets, Layers, Info } from 'lucide-react';
import aerialPaddyImg from '../../assets/paddyImage';

interface MapViewProps {
  inputs: FieldInputs;
}

export const MapView: React.FC<MapViewProps> = ({ inputs }) => {
  const { t } = useApp();

  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
      {/* Header with coordinates and disclaimer */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              <Navigation className="w-4 h-4" />
            </div>
            <h3 className="font-display font-bold text-base text-foreground">
              Coordinate & Field View
            </h3>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted-bg text-muted border border-border">
            {t.mapLabel}
          </span>
        </div>

        {/* Coords bar */}
        <div className="mt-2 flex items-center justify-between text-xs text-foreground/80 px-3 py-1.5 rounded-lg bg-muted-bg border border-border">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">LAT:</span>
            <span>{Number(inputs.latitude).toFixed(4)}° N</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">LON:</span>
            <span>{Number(inputs.longitude).toFixed(4)}° E</span>
          </div>
        </div>
      </div>

      {/* Visual Canvas with generated image and animated coordinate pin */}
      <div className="relative rounded-xl overflow-hidden border border-border h-64 sm:h-80 md:h-96 w-full group bg-black/10">
        <img
          src={aerialPaddyImg}
          alt="Illustrative top-down aerial view of rice paddies with shallow irrigation channels"
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-102"
        />

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        ></div>

        {/* Center Animated Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
          {/* Animated radar rings */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-emerald-500/30 animate-ping"></span>
            <span className="absolute w-7 h-7 rounded-full bg-emerald-500/50 animate-pulse"></span>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white shadow-lg border-2 border-white flex items-center justify-center z-10">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
          </div>

          {/* Coordinate callout pill */}
          <div className="mt-2 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold whitespace-nowrap shadow-md">
            {inputs.fieldName || 'Field Plot'}
          </div>
        </div>

        {/* Bottom Status Overlay */}
        <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1 text-emerald-300">
              <Layers className="w-3.5 h-3.5 shrink-0" />
              <span className="capitalize">{inputs.growthStage.replace('_', ' ')}</span>
            </span>
            <span className="flex items-center space-x-1 text-sky-300">
              <Droplets className="w-3.5 h-3.5 shrink-0" />
              <span className="capitalize">{inputs.waterCondition.replace('_', ' ')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Honest explicit disclaimer badge */}
      <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 flex items-start space-x-2 text-[11px] text-sky-900 dark:text-sky-300">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <p className="leading-tight">
          {t.sampleDataDisclaimer}
        </p>
      </div>
    </div>
  );
};
