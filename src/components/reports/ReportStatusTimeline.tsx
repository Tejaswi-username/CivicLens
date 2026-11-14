import React from 'react';
import { ReportStatus, StatusHistoryItem } from '../../types/report';
import { StatusBadge } from '../ui/Badge';
import { HazardImage } from '../ui/HazardImage';
import { formatDateTime } from '../../utils/date';
import {
  CheckCircle2,
  Clock,
  User,
  Shield,
  Cpu,
  FileCheck,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';

interface ReportStatusTimelineProps {
  currentStatus: ReportStatus;
  history: StatusHistoryItem[];
  resolutionPhotoUrl?: string;
  resolvedAt?: string;
}

export const ReportStatusTimeline: React.FC<ReportStatusTimelineProps> = ({
  currentStatus,
  history,
  resolutionPhotoUrl,
  resolvedAt
}) => {
  // Canonical linear workflow steps
  const workflowSteps: ReportStatus[] = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Fixed'];
  const isReopened = currentStatus === 'Reopened';

  const getStepIndex = (s: ReportStatus) => workflowSteps.indexOf(s);
  const currentStepIndex = getStepIndex(currentStatus);

  const getRoleIcon = (role: 'Citizen' | 'Admin' | 'System') => {
    if (role === 'Admin') return <Shield className="w-3.5 h-3.5 text-purple-600" />;
    if (role === 'System') return <Cpu className="w-3.5 h-3.5 text-blue-600" />;
    return <User className="w-3.5 h-3.5 text-teal-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-bold text-slate-900">Municipal Progress Lifecycle</h4>
        <StatusBadge status={currentStatus} size="lg" />
      </div>

      {/* Visual Workflow Stepper (Linear) */}
      {!isReopened ? (
        <div className="relative py-2">
          <div className="hidden sm:flex items-center justify-between relative z-10">
            {workflowSteps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center text-center w-1/5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                      isPast
                        ? 'bg-blue-600 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100 scale-110'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 font-semibold ${
                      isCurrent
                        ? 'text-slate-900 font-bold'
                        : isPast
                        ? 'text-blue-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Stepper connecting line */}
          <div className="hidden sm:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStepIndex) / (workflowSteps.length - 1)) * 100}%`
              }}
            />
          </div>
        </div>
      ) : (
        /* Reopened Banner */
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-sm">Issue Reopened by Citizen</div>
            <p>
              This report was previously marked Fixed, but community members flagged that the
              infrastructure failure has reappeared or was not fully resolved. It requires secondary
              municipal review.
            </p>
          </div>
        </div>
      )}

      {/* Resolution Photo Card (if Fixed or resolution evidence available) */}
      {resolutionPhotoUrl && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Municipal After-Fix Resolution Evidence</span>
            </div>
            {resolvedAt && (
              <span className="text-[11px] text-emerald-700 font-mono">
                Fixed on {formatDateTime(resolvedAt)}
              </span>
            )}
          </div>

          <div className="relative rounded-lg overflow-hidden border border-emerald-300 h-56 bg-slate-100">
            <HazardImage
              src={resolutionPhotoUrl}
              alt="Resolution evidence"
              category="Repaired Infrastructure"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspection After-Fix Photograph</span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Status History Timeline */}
      <div className="space-y-4 pt-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Audit Trail & Activity Log
        </h5>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {history.map((item, index) => (
            <div key={item.id || index} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-600 shadow-sm" />

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-xs font-semibold text-slate-800">
                      {item.changedBy}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {getRoleIcon(item.role)}
                      <span>{item.role}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatDateTime(item.timestamp)}
                  </span>
                </div>

                {item.note && (
                  <p className="text-xs text-slate-600 pl-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
