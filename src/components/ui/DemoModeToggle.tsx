import React from 'react';
import { useReports } from '../../context/ReportContext';
import { Sparkles, Globe2, Check } from 'lucide-react';

interface DemoModeToggleProps {
  theme?: 'dark' | 'light';
  compact?: boolean;
  className?: string;
}

export const DemoModeToggle: React.FC<DemoModeToggleProps> = ({
  theme = 'light',
  compact = false,
  className = ''
}) => {
  const { isDemoMode, setDemoMode, demoReportsCount, userReportsCount } = useReports();

  if (theme === 'dark') {
    return (
      <div
        className={`inline-flex items-center rounded-full p-1 border transition-all ${
          isDemoMode
            ? 'bg-amber-950/40 border-amber-500/40'
            : 'bg-emerald-950/40 border-emerald-500/40'
        } ${className}`}
      >
        {/* Option 1: Live Site (No Demo Data) */}
        <button
          type="button"
          onClick={() => setDemoMode(false)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            !isDemoMode
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
          title="Live website with clean real data and zero demo reports"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${!isDemoMode ? 'bg-slate-950' : 'bg-emerald-400'}`} />
          <Globe2 className="w-3.5 h-3.5" />
          <span>Live Site</span>
          {!compact && (
            <span className="text-[10px] opacity-80 font-normal">
              ({userReportsCount} real)
            </span>
          )}
        </button>

        {/* Option 2: Demo Data (Present now) */}
        <button
          type="button"
          onClick={() => setDemoMode(true)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
            isDemoMode
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
          title="Demo dataset with 20 sample Hyderabad reports, photos, and repairs"
        >
          <Sparkles className="w-3.5 h-3.5 text-current" />
          <span>Demo Data</span>
          {!compact && (
            <span className="text-[10px] opacity-80 font-normal">
              ({demoReportsCount} sample)
            </span>
          )}
        </button>
      </div>
    );
  }

  // Light Theme (for Navbar & in-page controls)
  return (
    <div
      className={`inline-flex items-center rounded-full p-0.5 border shadow-2xs transition-all ${
        isDemoMode
          ? 'bg-amber-50/80 border-amber-200'
          : 'bg-emerald-50/80 border-emerald-200'
      } ${className}`}
    >
      {/* Option 1: Live Site (No Demo Data) */}
      <button
        type="button"
        onClick={() => setDemoMode(false)}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all ${
          !isDemoMode
            ? 'bg-emerald-600 text-white shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        }`}
        title="Live website with clean real data and zero demo reports"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${!isDemoMode ? 'bg-white animate-pulse' : 'bg-emerald-600'}`} />
        <Globe2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span>Live Site</span>
        {!compact && (
          <span className="text-[10px] font-medium hidden md:inline">
            (No Demo)
          </span>
        )}
      </button>

      {/* Option 2: Demo Data */}
      <button
        type="button"
        onClick={() => setDemoMode(true)}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold transition-all ${
          isDemoMode
            ? 'bg-amber-500 text-slate-950 shadow-xs'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
        }`}
        title="Demo dataset with 20 sample Hyderabad reports, photos, and repairs"
      >
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span>Demo Data</span>
        {!compact && (
          <span className="text-[10px] font-medium hidden md:inline">
            ({demoReportsCount})
          </span>
        )}
      </button>
    </div>
  );
};
