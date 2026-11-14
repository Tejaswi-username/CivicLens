import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReports } from '../context/ReportContext';
import { useAuth } from '../context/AuthContext';
import { PriorityScoreCard } from '../components/reports/PriorityScoreCard';
import { ReportStatusTimeline } from '../components/reports/ReportStatusTimeline';
import { ReopenModal } from '../components/reports/ReopenModal';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { HazardImage } from '../components/ui/HazardImage';
import { EmergencyEscalationBanner } from '../components/reports/EmergencyEscalationBanner';
import { ShareReportModal } from '../components/reports/ShareReportModal';
import { BeforeAfterSlider } from '../components/reports/BeforeAfterSlider';
import { IssueDiscussionThread } from '../components/chat/IssueDiscussionThread';
import { formatDate, formatDateTime } from '../utils/date';
import {
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  AlertTriangle,
  ArrowLeft,
  Building2,
  Share2,
  RotateCcw,
  ShieldAlert,
  Compass
} from 'lucide-react';

export const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getReportById, confirmReport, reopenReport } = useReports();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isReopenOpen, setIsReopenOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const report = getReportById(id || '');

  if (!report) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 px-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Report Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested report ID ({id}) could not be located in our demo registry.
        </p>
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>
      </div>
    );
  }

  const hasConfirmed =
    currentUser.role !== 'Guest' && report.confirmedBy.includes(currentUser.userId);

  const handleConfirm = () => {
    if (currentUser.role === 'Guest') {
      alert('Please log in with a citizen identity to confirm this issue.');
      return;
    }
    confirmReport(report.reportId, currentUser.userId, currentUser.name);
  };

  const handleReopen = (reason: string) => {
    reopenReport(report.reportId, reason, currentUser.name);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Share Issue Card</span>
          </button>

          {currentUser.role === 'Admin' && (
            <Link
              to={`/admin/reports/${report.reportId}`}
              className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-sm"
            >
              Open in Admin Operations
            </Link>
          )}

          {report.status === 'Fixed' && (
            <button
              onClick={() => setIsReopenOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Flag as Unresolved / Reopen</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Escalation SLA Countdown Banner */}
      <EmergencyEscalationBanner
        reportId={report.reportId}
        createdAt={report.createdAt}
        priorityLevel={report.priorityLevel}
        priorityScore={report.priorityScore}
        status={report.status}
        isEscalated={report.isEscalated}
        escalatedAt={report.escalatedAt}
        escalationReason={report.escalationReason}
      />

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
              {report.reportId}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              {report.category}
            </span>
            <StatusBadge status={report.status} size="md" />
          </div>

          <PriorityBadge level={report.priorityLevel} score={report.priorityScore} showScore size="md" />
        </div>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
          {report.description}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-900">Location</div>
              <div className="truncate text-slate-500">{report.landmark}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-900">Reporter</div>
              <div className="text-slate-500">{report.userName}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-slate-900">Assigned Department</div>
              <div className="text-slate-500">{report.assignedDepartment || 'Awaiting Admin Review'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Layout Grid: Left (Evidence & Map) / Right (Priority & Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Evidence Image & Geographic Context */}
        <div className="lg:col-span-7 space-y-6">
          {/* Before & After Interactive Comparison if Fixed */}
          {report.status === 'Fixed' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <BeforeAfterSlider
                beforePhotoUrl={report.photoUrl}
                afterPhotoUrl={report.resolutionPhotoUrl || report.photoUrl}
                category={report.category}
                description={report.description}
                beforeDate={report.createdAt}
                afterDate={report.resolvedAt}
              />
            </div>
          )}

          {/* Issue Photograph Card */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Primary Issue Photograph
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Filed on {formatDate(report.createdAt)}
              </span>
            </div>

            <div className="relative h-80 sm:h-96 w-full bg-slate-900">
              <HazardImage
                src={report.photoUrl}
                alt={report.category}
                category={report.category}
                description={report.description}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Community Confirmation Bar */}
          <div className="bg-gradient-to-r from-teal-500 to-blue-700 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-extrabold uppercase tracking-wider text-teal-200">
                Community Consensus
              </div>
              <div className="text-lg font-extrabold">
                {report.confirmations} Citizens Have Validated This Issue
              </div>
              <p className="text-xs text-teal-100 max-w-md">
                Every validation boosts the priority score and speeds up municipal repair dispatch.
              </p>
            </div>

            {report.status !== 'Fixed' && (
              <button
                onClick={handleConfirm}
                disabled={hasConfirmed}
                className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition whitespace-nowrap ${
                  hasConfirmed
                    ? 'bg-white/20 text-white cursor-default border border-white/30'
                    : 'bg-white text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasConfirmed ? 'fill-current' : ''}`} />
                <span>{hasConfirmed ? 'You Have Confirmed' : 'I Also Face This Issue'}</span>
              </button>
            )}
          </div>

          {/* Geographic Coordinates & Landmark Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Location Coordinates</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Latitude</span>
                <span className="font-mono font-bold text-slate-900">{report.latitude}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Longitude</span>
                <span className="font-mono font-bold text-slate-900">{report.longitude}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Priority Scoring Card & Status Timeline */}
        <div className="lg:col-span-5 space-y-6">
          {/* Priority Score Engine Card */}
          <PriorityScoreCard
            safetyRisk={report.safetyRisk}
            injuryRisk={report.injuryRisk}
            nightRisk={report.nightRisk}
            accessibilityRisk={report.accessibilityRisk}
            waterloggingRisk={report.waterloggingRisk}
            confirmations={report.confirmations}
            createdAt={report.createdAt}
            locationSensitivity={report.locationSensitivity}
            category={report.category}
            description={report.description}
            status={report.status}
            resolvedAt={report.resolvedAt}
          />

          {/* Status History Stepper */}
          <ReportStatusTimeline
            currentStatus={report.status}
            history={report.statusHistory}
            resolutionPhotoUrl={report.resolutionPhotoUrl}
            resolvedAt={report.resolvedAt}
          />
        </div>
      </div>

      {/* Community Updates & Discussion Thread */}
      <IssueDiscussionThread
        reportId={report.reportId}
        reportTitle={report.description}
        category={report.category}
      />

      {/* Share Report Modal */}
      <ShareReportModal
        report={report}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Reopen Modal */}
      <ReopenModal
        isOpen={isReopenOpen}
        onClose={() => setIsReopenOpen(false)}
        reportId={report.reportId}
        onReopen={handleReopen}
      />
    </div>
  );
};
