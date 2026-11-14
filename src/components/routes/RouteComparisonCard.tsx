import React from 'react';
import { SafeRoute } from '../../types/route';
import {
  ShieldCheck,
  Zap,
  AlertTriangle,
  Clock,
  Navigation,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';

interface RouteComparisonCardProps {
  route: SafeRoute;
  isSelected: boolean;
  isChosen: boolean;
  onSelect: () => void;
  onChoose: () => void;
}

export const RouteComparisonCard: React.FC<RouteComparisonCardProps> = ({
  route,
  isSelected,
  isChosen,
  onSelect,
  onChoose
}) => {
  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.max(1, Math.round(seconds / 60));
    return `${mins} min${mins === 1 ? '' : 's'}`;
  };

  // Badge styling according to risk level
  const getRiskBadgeStyles = () => {
    if (route.riskScore < 30) {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        bar: 'bg-emerald-500'
      };
    }
    if (route.riskScore < 60) {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
        bar: 'bg-amber-500'
      };
    }
    return {
      bg: 'bg-red-50 text-red-800 border-red-200',
      dot: 'bg-red-500',
      bar: 'bg-red-500'
    };
  };

  const riskStyles = getRiskBadgeStyles();

  return (
    <div
      onClick={onSelect}
      className={`rounded-2xl border p-4 transition cursor-pointer relative ${
        isSelected
          ? 'border-blue-600 bg-white ring-2 ring-blue-500/30 shadow-md'
          : 'border-slate-200 bg-white/95 hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Top Header: Route Title & Recommendation Tag */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: route.color }}
            />
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              {route.name}
            </h3>
            {route.isRecommended && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Recommended
              </span>
            )}
            {route.routeType === 'fastest' && !route.isRecommended && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-600" />
                Fastest
              </span>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            {route.source === 'live-osrm' ? 'OpenStreetMap Footway Geometry' : 'Community Fallback Route'}
          </div>
        </div>

        {/* Risk Score Pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${riskStyles.bg}`}
        >
          <span className={`w-2 h-2 rounded-full ${riskStyles.dot}`} />
          <span>{route.riskScore}/100</span>
        </div>
      </div>

      {/* Metrics Row: Distance & Time */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Distance</div>
            <div className="text-xs font-bold text-slate-800">{formatDistance(route.distanceMeters)}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estimated Time</div>
            <div className="text-xs font-bold text-slate-800">{formatDuration(route.durationSeconds)}</div>
          </div>
        </div>
      </div>

      {/* Risk Gauge Bar */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Assessed Risk Level</span>
          <span className="font-semibold text-slate-800">{route.riskLevel}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${riskStyles.bar}`}
            style={{ width: `${Math.max(5, route.riskScore)}%` }}
          />
        </div>
      </div>

      {/* Hazards & Warnings List */}
      <div className="space-y-1.5 mb-3">
        <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
          <span>Reported Hazards (within 150m):</span>
          <span className="text-[11px] font-bold text-slate-500">
            {route.hazardCount} {route.hazardCount === 1 ? 'hazard' : 'hazards'}
          </span>
        </div>

        {route.warnings.length > 0 ? (
          <ul className="space-y-1">
            {route.warnings.map((w, i) => (
              <li
                key={i}
                className="text-[11px] text-slate-600 bg-amber-50/60 border border-amber-200/60 px-2 py-1 rounded-lg flex items-start gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{w}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[11px] text-emerald-700 bg-emerald-50/80 border border-emerald-200/60 px-2 py-1 rounded-lg flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>No unresolved infrastructure hazards reported along this corridor.</span>
          </div>
        )}
      </div>

      {/* Recommendation Summary */}
      {route.recommendationReason && (
        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl mb-3 border border-slate-100 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
          <span className="leading-tight">{route.recommendationReason}</span>
        </div>
      )}

      {/* Action Footer: Choose This Route Button */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <span className="text-[11px] text-slate-400">
          {isSelected ? '● Highlighted on map' : 'Click to inspect on map'}
        </span>

        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onChoose();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            isChosen
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          {isChosen ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Selected Route</span>
            </>
          ) : (
            <>
              <span>Choose This Route</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
