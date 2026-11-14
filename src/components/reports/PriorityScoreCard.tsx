import React, { useState } from 'react';
import { PriorityLevel, ReportCategory, ReportStatus } from '../../types/report';
import { PriorityBadge } from '../ui/Badge';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Users,
  Clock,
  MapPin,
  Moon,
  Footprints,
  Droplets,
  CheckCircle2
} from 'lucide-react';
import { calculatePriorityScore } from '../../utils/priority';

export interface PriorityScoreCardProps {
  safetyRisk?: 1 | 2 | 3;
  injuryRisk?: 1 | 2 | 3;
  nightRisk?: 1 | 2 | 3;
  accessibilityRisk?: 1 | 2 | 3;
  waterloggingRisk?: 1 | 2 | 3;
  confirmations: number;
  createdAt: string;
  locationSensitivity: 1 | 2 | 3;
  category?: ReportCategory;
  description?: string;
  status?: ReportStatus;
  resolvedAt?: string;
}

export const PriorityScoreCard: React.FC<PriorityScoreCardProps> = ({
  safetyRisk = 1,
  injuryRisk,
  nightRisk,
  accessibilityRisk,
  waterloggingRisk,
  confirmations,
  createdAt,
  locationSensitivity,
  category,
  description,
  status,
  resolvedAt
}) => {
  const [expanded, setExpanded] = useState(false);

  const breakdown = calculatePriorityScore({
    safetyRisk,
    injuryRisk,
    nightRisk,
    accessibilityRisk,
    waterloggingRisk,
    confirmations,
    createdAt,
    locationSensitivity,
    category,
    description,
    status,
    resolvedAt
  });

  const isResolved = status === 'Fixed';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-slate-900">Risk Scoring Engine</h4>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-slate-600 transition"
            title="Formula explanation"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {isResolved && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              <span>Resolved</span>
            </span>
          )}
          <PriorityBadge level={breakdown.level} score={breakdown.score} showScore size="lg" />
        </div>
      </div>

      {isResolved && (
        <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
          <strong>Notice:</strong> This issue has been certified as Fixed. In municipal prioritisation, resolved issues are archived and excluded from the active open hazard dispatch queue.
        </div>
      )}

      {/* Score Meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>0 (Low Risk)</span>
          <span className="text-amber-600 font-semibold">40 (Medium Risk)</span>
          <span className="text-red-600 font-bold">70+ (High Risk)</span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              breakdown.level === 'High'
                ? 'bg-gradient-to-r from-orange-500 to-red-600'
                : breakdown.level === 'Medium'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                : 'bg-slate-400'
            }`}
            style={{ width: `${Math.min(100, (breakdown.score / 100) * 100)}%` }}
          />
        </div>
      </div>

      {/* Formula Component Breakdown Grid (7 Components) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Component 1: Injury Risk (x3) */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span className="font-semibold text-[11px]">Injury Risk</span>
          </div>
          <div className="text-slate-900 font-bold text-sm">
            +{breakdown.injuryContribution} pts
          </div>
          <div className="text-[10px] text-slate-400">
            Level {breakdown.injuryRisk} × 3
          </div>
        </div>

        {/* Component 2: Night Risk (x2) */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 mb-1">
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold text-[11px]">Night Risk</span>
          </div>
          <div className="text-slate-900 font-bold text-sm">
            +{breakdown.nightContribution} pts
          </div>
          <div className="text-[10px] text-slate-400">
            Level {breakdown.nightRisk} × 2
          </div>
        </div>

        {/* Component 3: Accessibility Risk (x3) */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 mb-1">
            <Footprints className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-[11px]">Accessibility</span>
          </div>
          <div className="text-slate-900 font-bold text-sm">
            +{breakdown.accessibilityContribution} pts
          </div>
          <div className="text-[10px] text-slate-400">
            Level {breakdown.accessibilityRisk} × 3
          </div>
        </div>

        {/* Component 4: Waterlogging Risk (x2) */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 mb-1">
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span className="font-semibold text-[11px]">Waterlogging</span>
          </div>
          <div className="text-slate-900 font-bold text-sm">
            +{breakdown.waterloggingContribution} pts
          </div>
          <div className="text-[10px] text-slate-400">
            Level {breakdown.waterloggingRisk} × 2
          </div>
        </div>

        {/* Component 5: Community Confirmations (x2) */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 mb-1">
            <Users className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold text-[11px]">Confirmations</span>
          </div>
          <div className="text-slate-900 font-bold text-sm">
            +{breakdown.confirmationsContribution} pts
          </div>
          <div className="text-[10px] text-slate-400">
            {breakdown.confirmations} validated × 2
          </div>
        </div>

        {/* Component 6: Location Sensitivity (x2) */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1 text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-teal-500" />
            <span className="font-semibold text-[11px]">Location</span>
          </div>
          <div className="text-slate-900 font-bold text-sm">
            +{breakdown.locationContribution} pts
          </div>
          <div className="text-[10px] text-slate-400">
            Level {breakdown.locationSensitivity} × 2
          </div>
        </div>

        {/* Component 7: Days Open (x1) */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-2">
          <div className="flex items-center gap-1 text-slate-500 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-[11px]">Days Open</span>
          </div>
          <div className="text-slate-900 font-bold text-sm">
            +{breakdown.daysOpenContribution} pts
          </div>
          <div className="text-[10px] text-slate-400">
            {breakdown.daysOpen} days {isResolved ? 'before resolution' : 'unresolved'} × 1
          </div>
        </div>
      </div>

      {/* Expandable Explanation Details */}
      <div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
        >
          <span>{expanded ? 'Hide Formula Details' : 'View Proposed Prioritisation Model'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expanded && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2.5 animate-in fade-in">
            <div className="font-mono text-[11px] font-semibold bg-white p-2.5 rounded-lg border border-slate-200 overflow-x-auto leading-relaxed">
              Risk Score = ({breakdown.injuryRisk} × 3) + ({breakdown.nightRisk} × 2) + ({breakdown.accessibilityRisk} × 3) + ({breakdown.waterloggingRisk} × 2) + ({breakdown.confirmations} × 2) + ({breakdown.locationSensitivity} × 2) + {breakdown.daysOpen} = <span className="text-blue-700 font-bold">{breakdown.score}</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div><strong>Thresholds:</strong> High Risk ≥ 70 | Medium Risk 40–69 | Low Risk &lt; 40</div>
              <div className="text-slate-500 italic">
                Note: This calculation provides an operational municipal dispatch ranking model, prioritizing acute physical hazards, vulnerable pedestrians, dark corridors, and aging tickets.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
