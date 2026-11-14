import React from 'react';
import { Modal } from '../ui/Modal';
import { Report } from '../../types/report';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { HazardImage } from '../ui/HazardImage';
import { AlertCircle, ThumbsUp, PlusCircle, MapPin, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';

interface DuplicateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingReport: Report | null;
  distanceMeters: number;
  onConfirmExisting: (existingReportId: string) => void;
  onReportAnyway: () => void;
}

export const DuplicateWarningModal: React.FC<DuplicateWarningModalProps> = ({
  isOpen,
  onClose,
  existingReport,
  distanceMeters,
  onConfirmExisting,
  onReportAnyway
}) => {
  const { currentUser } = useAuth();
  const { confirmReport } = useReports();

  if (!existingReport) return null;

  const alreadyConfirmed =
    currentUser.role !== 'Guest' &&
    existingReport.confirmedBy.includes(currentUser.userId);

  const handleConfirmAction = () => {
    if (currentUser.role === 'Guest') {
      alert('Please log in with a citizen identity to confirm reports.');
      return;
    }
    confirmReport(existingReport.reportId, currentUser.userId, currentUser.name);
    onConfirmExisting(existingReport.reportId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Possible Duplicate Report Detected"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Warning banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm">Nearby Issue Found Within 40 Meters</div>
            <p className="leading-relaxed">
              Another citizen has already reported a <strong>{existingReport.category}</strong>{' '}
              just <strong>{distanceMeters} meters away</strong>. Validating the existing report will
              boost its priority score and expedite municipal dispatch faster than creating a duplicate.
            </p>
          </div>
        </div>

        {/* Existing Report Preview Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-start gap-3">
            <HazardImage
              src={existingReport.photoUrl}
              alt={existingReport.category}
              category={existingReport.category}
              className="w-24 h-24 rounded-lg object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="font-mono text-xs text-slate-500 font-semibold">
                  {existingReport.reportId}
                </span>
                <StatusBadge status={existingReport.status} size="sm" />
              </div>

              <div className="text-xs font-semibold text-slate-900 line-clamp-2">
                {existingReport.description}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{existingReport.landmark}</span>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
                <PriorityBadge level={existingReport.priorityLevel} score={existingReport.priorityScore} showScore size="sm" />
                <span className="flex items-center gap-1 font-medium">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  {existingReport.confirmations} confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Choice Buttons */}
        <div className="space-y-2 pt-2">
          {/* Action 1: Confirm Existing (Recommended) */}
          <button
            onClick={handleConfirmAction}
            disabled={alreadyConfirmed}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition ${
              alreadyConfirmed
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>
              {alreadyConfirmed
                ? 'You Already Confirmed This Existing Issue'
                : '1. Confirm Existing Issue (Recommended)'}
            </span>
          </button>

          {/* Action 2: Report Anyway */}
          <button
            onClick={() => {
              onReportAnyway();
              onClose();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-slate-400" />
            <span>2. Report Anyway (This is a different, separate issue)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
