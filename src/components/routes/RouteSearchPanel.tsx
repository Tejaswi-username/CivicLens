import React, { useState } from 'react';
import { Landmark, SafetyMode } from '../../types/route';
import { COMMUNITY_LANDMARKS } from '../../data/communityLandmarks';
import {
  Search,
  ArrowUpDown,
  Navigation,
  Moon,
  CloudRain,
  Accessibility,
  Shield,
  Loader2,
  MapPin,
  Compass,
  AlertCircle
} from 'lucide-react';

interface RouteSearchPanelProps {
  originId: string;
  destinationId: string;
  safetyMode: SafetyMode;
  loading: boolean;
  routingProviderNote?: string;
  routingSource?: 'live-osrm' | 'demo-fallback';
  onOriginChange: (id: string, customCoords?: [number, number]) => void;
  onDestinationChange: (id: string) => void;
  onSafetyModeChange: (mode: SafetyMode) => void;
  onSwapEndpoints: () => void;
  onFindRoutes: () => void;
}

export const RouteSearchPanel: React.FC<RouteSearchPanelProps> = ({
  originId,
  destinationId,
  safetyMode,
  loading,
  routingProviderNote,
  routingSource,
  onOriginChange,
  onDestinationChange,
  onSafetyModeChange,
  onSwapEndpoints,
  onFindRoutes
}) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const handleOriginSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setGpsError(null);

    if (val === 'current-location') {
      if (!navigator.geolocation) {
        setGpsError('Geolocation is not supported by your browser.');
        onOriginChange('community-main-gate');
        return;
      }

      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          setGpsLoading(false);
          const coords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude
          ];
          onOriginChange('current-location', coords);
        },
        error => {
          setGpsLoading(false);
          setGpsError('Location permission denied or unavailable. Switched to Community Main Gate.');
          onOriginChange('community-main-gate');
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      onOriginChange(val);
    }
  };

  const modes: { id: SafetyMode; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    {
      id: 'general',
      label: 'Balanced',
      icon: Shield,
      desc: 'Overall infrastructure health'
    },
    {
      id: 'night',
      label: 'Night Safety',
      icon: Moon,
      desc: 'Prioritizes streetlights & lit crossings'
    },
    {
      id: 'rain',
      label: 'Rain Safety',
      icon: CloudRain,
      desc: 'Avoids waterlogging & open drains'
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      icon: Accessibility,
      desc: 'Prioritizes level footpaths & clear ramps'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
      {/* Search Header */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Safe Waypoint Finder
          </span>
          {routingSource && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                routingSource === 'live-osrm'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              {routingSource === 'live-osrm' ? '● Live OSRM Routes' : 'Illustrative Demo Routes'}
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-1">
          Plan Your Community Journey
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select landmarks within the ward to compare hazard-evaluated route options.
        </p>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="space-y-3 relative">
        {/* Origin Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Starting Point (Point A)
            </span>
            {gpsLoading && (
              <span className="text-[11px] text-blue-600 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Fetching GPS...
              </span>
            )}
          </label>
          <div className="relative">
            <select
              value={originId}
              onChange={handleOriginSelect}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
            >
              <option value="current-location">📍 Current Location (Device GPS)</option>
              <optgroup label="Community Landmarks">
                {COMMUNITY_LANDMARKS.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Swap Origin / Destination Button */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={onSwapEndpoints}
            title="Swap Origin and Destination"
            className="p-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-full text-slate-600 shadow-sm transition transform hover:rotate-180 duration-200"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Destination Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            Destination (Point B)
          </label>
          <div className="relative">
            <select
              value={destinationId}
              onChange={e => onDestinationChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
            >
              {COMMUNITY_LANDMARKS.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* GPS Error Fallback Notice */}
        {gpsError && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>{gpsError}</span>
          </div>
        )}
      </div>

      {/* Safety Mode Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>Safety Priority Mode</span>
          <span className="text-[11px] text-slate-400 font-normal">Recalculates route risk weightings</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {modes.map(m => {
            const Icon = m.icon;
            const isSelected = safetyMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onSafetyModeChange(m.id)}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-sm ring-1 ring-blue-500'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-blue-700' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-xs font-bold leading-tight">{m.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 leading-tight">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onFindRoutes}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 hover:from-blue-800 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calculating Safest Routes...</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            <span>Find Safer Routes</span>
          </>
        )}
      </button>

      {/* Provider attribution note */}
      {routingProviderNote && (
        <div className="text-[11px] text-slate-400 text-center">
          {routingProviderNote}
        </div>
      )}
    </div>
  );
};
