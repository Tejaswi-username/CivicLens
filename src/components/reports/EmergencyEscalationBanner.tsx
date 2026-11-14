import React, { useState, useEffect } from 'react';
import { PriorityLevel, ReportStatus } from '../../types/report';
import { calculateEscalationStatus, EscalationStatus } from '../../utils/escalation';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import {
  AlertTriangle,
  Clock,
  Flame,
  ShieldAlert,
  CheckCircle2,
  Send,
  Zap,
  Info
} from 'lucide-react';

interface EmergencyEscalationBannerProps {
  reportId: string;
  createdAt: string;
  priorityLevel: PriorityLevel;
  priorityScore: number;
  status: ReportStatus;
  isEscalated?: boolean;
  escalatedAt?: string;
  escalationReason?: string;
  onEscalated?: () => void;
}

export const EmergencyEscalationBanner: React.FC<EmergencyEscalationBannerProps> = ({
  reportId,
  createdAt,
  priorityLevel,
  priorityScore,
  status,
  isEscalated = false,
  escalatedAt,
  escalationReason,
  onEscalated
}) => {
  const { currentUser } = useAuth();
  const { escalateReport } = useReports();
  const [escalationData, setEscalationData] = useState<EscalationStatus>(() =>
    calculateEscalationStatus(createdAt, priorityLevel, status, isEscalated)
  );
  const [showEscalatePrompt, setShowEscalatePrompt] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live countdown ticker every 1 second
  useEffect(() => {
    const updateTicker = () => {
      setEscalationData(calculateEscalationStatus(createdAt, priorityLevel, status, isEscalated));
    };

    updateTicker();
    const interval = setInterval(updateTicker, 1000);
    return () => clearInterval(interval);
  }, [createdAt, priorityLevel, status, isEscalated]);

  const handleTriggerEscalation = () => {
    if (currentUser.role === 'Guest') {
      alert('Please log in with a citizen or admin account to escalate issues.');
      return;
    }

    setSubmitting(true);
    escalateReport(
      reportId,
      currentUser.name,
      currentUser.role === 'Admin' ? 'Admin' : 'Citizen',
      customReason.trim() || `Urgent safety hazard SLA breached (${escalationData.breachDurationText || 'high risk threshold'})`
    );
    setSubmitting(false);
    setShowEscalatePrompt(false);
    if (onEscalated) onEscalated();
  };

  // If issue is already fixed
  if (status === 'Fixed') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-emerald-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Municipal SLA Completed
            </div>
            <div className="text-sm font-semibold">
              Resolved & Photographic Evidence Verified by Municipal Operations
            </div>
          </div>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-lg hidden sm:inline-block">
          SLA Cleared
        </span>
      </div>
    );
  }

  const isCritical = escalationData.isBreached || isEscalated;
  const isApproaching = escalationData.isApproaching && !isCritical;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
        isCritical
          ? 'bg-gradient-to-r from-red-500/10 via-rose-500/5 to-red-500/10 border-red-300 ring-2 ring-red-400/20'
          : isApproaching
          ? 'bg-amber-500/10 border-amber-300'
          : 'bg-blue-50/80 border-blue-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Status Icon & Details */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
              isCritical
                ? 'bg-red-600 text-white animate-pulse'
                : isApproaching
                ? 'bg-amber-500 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            {isCritical ? (
              <ShieldAlert className="w-5 h-5" />
            ) : isApproaching ? (
              <Clock className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  isCritical
                    ? 'bg-red-600 text-white'
                    : isApproaching
                    ? 'bg-amber-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {isCritical
                  ? '🚨 EMERGENCY ESCALATION ACTIVE'
                  : isApproaching
                  ? '⚠️ SLA WINDOW EXPIRING'
                  : '⏱️ MUNICIPAL SLA TRACKER'}
              </span>

              <span className="text-xs font-mono font-semibold text-slate-500">
                Target SLA: {escalationData.targetHours} Hours
              </span>
            </div>

            <div className="text-sm font-bold text-slate-900">
              {isCritical ? (
                <span className="text-red-700">
                  SLA Target Breached: {escalationData.breachDurationText}
                </span>
              ) : isApproaching ? (
                <span className="text-amber-800">
                  Critical SLA Window: Only {escalationData.countdownText} Remaining
                </span>
              ) : (
                <span className="text-blue-900">
                  Response SLA Target: {escalationData.countdownText} Remaining
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600">
              {isCritical
                ? 'This high-priority hazard has exceeded the mandated turnaround SLA. Formal notification is active for the Zonal Municipal Commissioner & Ward Council.'
                : 'Automatic timer enforcing GHMC municipal repair SLAs. If unaddressed before deadline, ticket is auto-escalated to Zonal leadership.'}
            </p>
          </div>
        </div>

        {/* Right Side: Live Countdown Display & Escalation Action Button */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2.5 sm:flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {isCritical ? 'Time Overdue' : 'Time Remaining'}
            </div>
            <div
              className={`text-lg sm:text-xl font-black font-mono tracking-tight ${
                isCritical ? 'text-red-600' : isApproaching ? 'text-amber-600' : 'text-blue-700'
              }`}
            >
              {isCritical ? `+${escalationData.breachDurationText}` : escalationData.countdownText}
            </div>
          </div>

          {!isEscalated && (
            <button
              onClick={() => setShowEscalatePrompt(true)}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-red-500/20 whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Escalate Ticket</span>
            </button>
          )}

          {isEscalated && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg">
              <ShieldAlert className="w-3 h-3" />
              <span>Escalated to Zonal Officer</span>
            </span>
          )}
        </div>
      </div>

      {/* Escalation Prompt Modal / Drawer */}
      {showEscalatePrompt && (
        <div className="mt-4 pt-4 border-t border-red-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Serve Formal Emergency Escalation Notice</span>
            </span>
            <button
              onClick={() => setShowEscalatePrompt(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Escalating will flag this hazard in the Municipal Commissioner Priority Dispatch Queue and log an emergency audit record under your identity (<span className="font-semibold text-slate-800">{currentUser.name}</span>).
          </p>

          <input
            type="text"
            value={customReason}
            onChange={e => setCustomReason(e.target.value)}
            placeholder="Reason (e.g. Danger to school children, water entering homes, multiple bike accidents)..."
            className="w-full text-xs p-2.5 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowEscalatePrompt(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleTriggerEscalation}
              disabled={submitting}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Dispatching...' : 'Dispatch Emergency Escalation'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
