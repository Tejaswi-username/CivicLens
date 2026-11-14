import React, { useState, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { analyticsService } from '../services/analyticsService';
import {
  CategoryChart,
  StatusChart,
  PriorityChart,
  TimelineChart,
  DepartmentChart
} from '../components/charts/DashboardCharts';
import { StatusBadge } from '../components/ui/Badge';
import { HazardImage } from '../components/ui/HazardImage';
import { formatDate } from '../utils/date';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  Building2,
  Award
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { reports } = useReports();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredReports = useMemo(() => {
    if (categoryFilter === 'all') return reports;
    return reports.filter(r => r.category === categoryFilter);
  }, [reports, categoryFilter]);

  const analytics = useMemo(() => {
    return analyticsService.calculateAnalytics(filteredReports);
  }, [filteredReports]);

  return (
    <AdminLayout title="Community Safety Analytics — Bachupally">
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Filter Data:</span>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Infrastructure Categories</option>
              <option value="Pothole">Pothole</option>
              <option value="Broken Streetlight">Broken Streetlight</option>
              <option value="Open Drain">Open Drain</option>
              <option value="Waterlogging">Waterlogging</option>
              <option value="Damaged Footpath">Damaged Footpath</option>
              <option value="Unsafe Crossing">Unsafe Crossing</option>
              <option value="Garbage Dumping">Garbage Dumping</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/scorecards"
              className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 font-bold text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Ward Officer Scorecards &rarr;</span>
            </Link>

            <div className="text-xs text-slate-400">
              Computed from {filteredReports.length} records in active registry
            </div>
          </div>
        </div>

        {/* 6 Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Total Reports */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Reports
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              {analytics.totalReports}
            </div>
          </div>

          {/* Clearance Rate */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              Clearance Rate
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {analytics.resolutionRate}%
            </div>
          </div>

          {/* Open Issues */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
              Open Issues
            </span>
            <div className="text-2xl font-extrabold text-amber-700 mt-1">
              {analytics.openReports}
            </div>
          </div>

          {/* Avg Resolution Time */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
              Avg Resolution
            </span>
            <div className="text-2xl font-extrabold text-blue-700 mt-1">
              {analytics.avgResolutionDays !== null ? `${analytics.avgResolutionDays}d` : 'N/A'}
            </div>
          </div>

          {/* High Priority */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
              High Priority
            </span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">
              {analytics.highPriorityReports}
            </div>
          </div>

          {/* Reopened Issues */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
              Reopened Issues
            </span>
            <div className="text-2xl font-extrabold text-rose-600 mt-1">
              {analytics.reopenedReports}
            </div>
          </div>
        </div>

        {/* Charts Grid 1: Department Workload & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Department Workload (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Department Workload (Open vs Fixed)</span>
              </h3>
              <p className="text-xs text-slate-500">Distribution across municipal divisions</p>
            </div>
            <DepartmentChart data={analytics.departmentWorkload} />
          </div>

          {/* Timeline Velocity (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Reporting & Resolution Trend (14 Days)</span>
              </h3>
              <p className="text-xs text-slate-500">Intake vs completion throughput</p>
            </div>
            <TimelineChart data={analytics.timelineData} />
          </div>
        </div>

        {/* Charts Grid 2: Categories, Statuses, and Recently Resolved */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Categories (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Breakdown by Issue Category</h3>
            <CategoryChart data={analytics.categoryDistribution} />
          </div>

          {/* Status Donut (6 cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Current Lifecycle Status Mix</h3>
            <StatusChart data={analytics.statusDistribution} />
          </div>
        </div>

        {/* Recently Resolved List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Certified Resolutions Audit</span>
            </h3>
            <span className="text-xs text-slate-400">Fixed with after-repair photographs</span>
          </div>

          {analytics.recentResolved.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.recentResolved.map(report => (
                <Link
                  key={report.reportId}
                  to={`/reports/${report.reportId}`}
                  className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 transition flex items-center gap-3"
                >
                  <HazardImage
                    src={report.resolutionPhotoUrl || report.photoUrl}
                    alt={report.category}
                    category={report.category}
                    className="w-14 h-14 rounded-lg object-cover border border-emerald-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {report.category} ({report.reportId})
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{report.landmark}</div>
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      Fixed: {formatDate(report.resolvedAt)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-500 text-center py-6">
              No reports have been marked Fixed with timestamps yet.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
