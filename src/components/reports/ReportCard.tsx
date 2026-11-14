import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Report } from '../../types/report';
import { PriorityBadge, StatusBadge, CategoryBadge } from '../ui/Badge';
import { HazardImage } from '../ui/HazardImage';
import { formatRelativeTime } from '../../utils/date';
import { MapPin, Users, ArrowUpRight, ThumbsUp, Calendar, Share2, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { ShareReportModal } from './ShareReportModal';

interface ReportCardProps {
  report: Report;
  showConfirmButton?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  showConfirmButton = true
}) => {
  const { currentUser } = useAuth();
  const { confirmReport } = useReports();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const hasConfirmed = currentUser.role !== 'Guest' && report.confirmedBy.includes(currentUser.userId);

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentUser.role === 'Guest') {
      alert('Please log in with a citizen identity to confirm reports.');
      return;
    }
    confirmReport(report.reportId, currentUser.userId, currentUser.name);
  };

  return (
    <div className="group bg-white rounded-3xl border border-gray-200/90 hover:border-gray-400 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Image Header */}
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <HazardImage
            src={report.photoUrl}
            alt={report.category}
            category={report.category}
            description={report.description}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-nest-charcoal shadow-xs backdrop-blur-md">
                {report.category}
              </span>
              {report.isEscalated && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F6EBEA] text-[#8B2626] border border-[#F0D5D3] shadow-xs flex items-center gap-1">
                  <Flame className="w-2.5 h-2.5 fill-current" />
                  <span>Escalated</span>
                </span>
              )}
            </div>
            <PriorityBadge level={report.priorityLevel} score={report.priorityScore} showScore />
          </div>

          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="font-mono text-[11px] opacity-90">{report.reportId}</span>
            <StatusBadge status={report.status} size="sm" />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-2.5">
          <p className="text-sm font-bold text-nest-charcoal line-clamp-2 leading-snug group-hover:text-black transition">
            {report.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{report.landmark || 'Bachupally Community Area'}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatRelativeTime(report.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-nest-charcoal">
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>{report.confirmations} confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Footer with Template Pill Buttons */}
      <div className="px-5 pb-5 pt-1 flex items-center gap-2">
        <Link
          to={`/reports/${report.reportId}`}
          className="flex-1 py-2 px-4 rounded-full border border-gray-300 hover:border-nest-charcoal text-nest-charcoal text-xs font-semibold text-center flex items-center justify-center gap-1 transition"
        >
          <span>View details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShareModalOpen(true);
          }}
          className="p-2 rounded-full border border-gray-200 hover:border-gray-400 text-slate-600 transition"
          title="Share Report Card"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {showConfirmButton && report.status !== 'Fixed' && (
          <button
            onClick={handleConfirm}
            disabled={hasConfirmed}
            className={`py-2 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              hasConfirmed
                ? 'bg-nest-mint text-nest-mint-dark border border-[#BDE5D0] cursor-default'
                : 'bg-nest-charcoal hover:bg-black text-white shadow-xs'
            }`}
            title={hasConfirmed ? 'You have confirmed this issue' : 'Confirm this issue exists'}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${hasConfirmed ? 'fill-current' : ''}`} />
            <span>{hasConfirmed ? 'Confirmed' : 'I Face This'}</span>
          </button>
        )}
      </div>

      <ShareReportModal
        report={report}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};
