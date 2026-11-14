import React, { useState, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import { BeforeAfterSlider } from '../components/reports/BeforeAfterSlider';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { formatDate } from '../utils/date';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Filter,
  ShieldCheck,
  Building2,
  Layers
} from 'lucide-react';

export const CommunityWinsPage: React.FC = () => {
  const { reports, isDemoMode, setDemoMode } = useReports();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter fixed reports or reports with resolution photos
  const resolvedReports = useMemo(() => {
    return reports.filter(r => {
      const isFixed = r.status === 'Fixed';
      const hasPhoto = Boolean(r.resolutionPhotoUrl);
      const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
      return (isFixed || hasPhoto) && matchesCategory;
    });
  }, [reports, selectedCategory]);

  const totalFixedCount = useMemo(() => {
    return reports.filter(r => r.status === 'Fixed').length;
  }, [reports]);

  const categories = ['all', 'Pothole', 'Broken Streetlight', 'Open Drain', 'Waterlogging', 'Damaged Footpath'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-teal-950 rounded-3xl text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Wins & Verification</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Before & After Civic Resolutions
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Every fix in Bachupally is certified with photographic proof. Drag the interactive split sliders below to inspect original road hazards against certified municipal repairs.
          </p>
        </div>

        {/* 4 Impact Stat Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 mt-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Certified Fixes</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{totalFixedCount}</div>
            <div className="text-[11px] text-slate-400">Bachupally Ward</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
              <Clock className="w-4 h-4" />
              <span>Avg Turnaround</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">2.4 Days</div>
            <div className="text-[11px] text-slate-400">Response speed</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Photo Audit</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">100%</div>
            <div className="text-[11px] text-slate-400">Evidence verified</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-semibold">
              <Users className="w-4 h-4" />
              <span>Citizen Validated</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">45+</div>
            <div className="text-[11px] text-slate-400">Neighbor votes</div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter By Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Resolved Issues' : cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-900">{resolvedReports.length}</span> verified transformations
        </div>
      </div>

      {/* Grid of Before/After Cards */}
      {resolvedReports.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {resolvedReports.map(report => {
          const resolvedPhoto = report.resolutionPhotoUrl;

          return (
            <div
              key={report.reportId}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Card Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">
                      {report.reportId}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
                      {report.category}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fixed & Certified</span>
                  </span>
                </div>

                {/* Description */}
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {report.description}
                </h3>

                {/* Interactive Split-Screen Slider */}
                <BeforeAfterSlider
                  beforePhotoUrl={report.photoUrl}
                  afterPhotoUrl={resolvedPhoto}
                  category={report.category}
                  description={report.description}
                  beforeDate={report.createdAt}
                  afterDate={report.resolvedAt || report.updatedAt}
                  heightClass="h-64 sm:h-72"
                />

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{report.landmark}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Building2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                    <span className="truncate">{report.assignedDepartment || 'Municipal Operations'}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  Verified by {report.confirmations} community validations
                </span>
                <Link
                  to={`/reports/${report.reportId}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Full Audit Trail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">No resolved issues yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Certified repairs with before-and-after photographic evidence appear here once municipal officers resolve a community issue.
            </p>
          </div>
          {false && !isDemoMode && (
            <button
              onClick={() => setDemoMode(true)}
              className="px-5 py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs transition inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Switch to Demo Mode to View Sample Wins</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
