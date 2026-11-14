import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReports } from '../context/ReportContext';
import { useAuth } from '../context/AuthContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { PriorityScoreCard } from '../components/reports/PriorityScoreCard';
import { ReportStatusTimeline } from '../components/reports/ReportStatusTimeline';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { HazardImage } from '../components/ui/HazardImage';
import { compressImage } from '../utils/imageUtils';
import { MunicipalDepartment, ReportStatus } from '../types/report';
import { formatDate } from '../utils/date';
import { EmergencyEscalationBanner } from '../components/reports/EmergencyEscalationBanner';
import { BeforeAfterSlider } from '../components/reports/BeforeAfterSlider';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Camera,
  Image as ImageIcon,
  Check,
  Shield,
  MapPin,
  Users,
  RotateCcw
} from 'lucide-react';

export const AdminReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getReportById, assignDepartment, updateStatus } = useReports();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const report = getReportById(id || '');

  // Form states
  const [selectedDept, setSelectedDept] = useState<MunicipalDepartment | ''>(
    report?.assignedDepartment || ''
  );
  const [statusNote, setStatusNote] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string>(
    report?.resolutionPhotoUrl || ''
  );
  const [statusUpdating, setStatusUpdating] = useState(false);

  if (!report) {
    return (
      <AdminLayout title="Report Not Found">
        <div className="text-center py-20 space-y-4">
          <p className="text-sm text-slate-500">The report ID could not be found.</p>
          <Link
            to="/admin/reports"
            className="px-4 py-2 bg-purple-700 text-white rounded-xl text-xs font-semibold"
          >
            Back to Registry
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const departments: MunicipalDepartment[] = [
    'Roads Department',
    'Electricity Department',
    'Water/Sanitation Department',
    'Traffic Department',
    'Other'
  ];

  const handleAssignDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept) {
      alert('Please select a valid municipal department.');
      return;
    }
    assignDepartment(report.reportId, selectedDept as MunicipalDepartment, currentUser.name);
  };

  const handleStatusChange = (newStatus: ReportStatus) => {
    try {
      setStatusUpdating(true);
      updateStatus(
        report.reportId,
        newStatus,
        currentUser.name,
        'Admin',
        statusNote.trim() || undefined,
        resolutionPhoto || undefined
      );
      setStatusNote('');
      setStatusUpdating(false);
    } catch (err: any) {
      setStatusUpdating(false);
      // Handled via toast in ReportContext
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      if (compressed) {
        setResolutionPhoto(compressed);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setResolutionPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout title={`Manage ${report.reportId}`}>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Reports</span>
          </Link>

          <Link
            to={`/reports/${report.reportId}`}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View Citizen Public Page &rarr;
          </Link>
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

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm font-bold bg-slate-100 text-slate-900 px-3 py-1 rounded-lg">
                {report.reportId}
              </span>
              <span className="font-semibold text-xs px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                {report.category}
              </span>
              <StatusBadge status={report.status} size="md" />
            </div>

            <PriorityBadge level={report.priorityLevel} score={report.priorityScore} showScore size="md" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {report.description}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px]">Location & Landmark</span>
              <span className="font-semibold text-slate-900">{report.landmark}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Reporter</span>
              <span className="font-semibold text-slate-900">{report.userName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Community Validation</span>
              <span className="font-semibold text-blue-700">{report.confirmations} Citizens Confirmed</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Management Operations & Lifecycle Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 cols): Department Assignment & Workflow Controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* Control 1: Department Assignment */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>1. Department Assignment</span>
              </h3>

              <form onSubmit={handleAssignDept} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Select Municipal Department
                  </label>
                  <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value as MunicipalDepartment)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="">-- Choose Department --</option>
                    {departments.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
                >
                  Assign Department & Route Ticket
                </button>
              </form>
            </div>

            {/* Control 2: Lifecycle Transitions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>2. Advance Operational Status</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Optional Inspection / Dispatch Log Note
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="e.g. Field crew dispatched with asphalt compactor..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* Action: Verify */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('Verified')}
                  disabled={report.status === 'Verified' || report.status === 'Fixed'}
                  className="py-2.5 px-3 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold transition disabled:opacity-50"
                >
                  Verify Report (Step 2)
                </button>

                {/* Action: Mark In Progress */}
                <button
                  type="button"
                  onClick={() => handleStatusChange('In Progress')}
                  disabled={report.status === 'In Progress' || report.status === 'Fixed'}
                  className="py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition disabled:opacity-50"
                >
                  Mark In Progress (Step 4)
                </button>
              </div>
            </div>

            {/* Control 3: Upload After-Fix Photo & Mark Fixed */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. After-Fix Certification & Resolution Evidence</span>
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                A report <strong>cannot be marked Fixed</strong> without certified photographic proof
                of the completed repair.
              </p>

              {/* Photo Upload or Sample Selector */}
              {resolutionPhoto ? (
                <div className="relative rounded-xl overflow-hidden border border-emerald-300 h-44 bg-slate-100">
                  <HazardImage
                    src={resolutionPhoto}
                    alt="After-fix proof"
                    category="Repaired Infrastructure"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setResolutionPhoto('')}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-red-600/90 text-white text-[11px] font-semibold rounded-md backdrop-blur-sm"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50">
                    <Camera className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      Upload After-Fix Repair Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>


                </div>
              )}

              {/* Mark Fixed Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleStatusChange('Fixed')}
                  disabled={!resolutionPhoto || report.status === 'Fixed'}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 ${
                    !resolutionPhoto || report.status === 'Fixed'
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {report.status === 'Fixed'
                      ? 'Report Certified as Fixed'
                      : 'Certify & Mark Issue as Fixed (Step 5)'}
                  </span>
                </button>

                {!resolutionPhoto && report.status !== 'Fixed' && (
                  <p className="text-[11px] text-amber-600 mt-1.5 text-center font-medium">
                    ⚠️ Button disabled: Resolution photograph evidence required first.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Issue Evidence, Priority Engine & Audit Trail */}
          <div className="lg:col-span-6 space-y-6">
            {/* Full Issue Photo */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-3.5 border-b border-slate-100 font-bold text-xs text-slate-900">
                Citizen Photo Evidence
              </div>
              <div className="h-64 bg-slate-900">
                <HazardImage
                  src={report.photoUrl}
                  alt={report.category}
                  category={report.category}
                  description={report.description}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Priority Score Breakdown Card */}
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

            {/* Lifecycle Status Timeline */}
            <ReportStatusTimeline
              currentStatus={report.status}
              history={report.statusHistory}
              resolutionPhotoUrl={report.resolutionPhotoUrl}
              resolvedAt={report.resolvedAt}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
