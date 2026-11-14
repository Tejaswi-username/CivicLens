import React, { useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { analyticsService } from '../services/analyticsService';
import {
  CategoryChart,
  StatusChart,
  PriorityChart,
  TimelineChart
} from '../components/charts/DashboardCharts';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { formatRelativeTime } from '../utils/date';
import { Link } from 'react-router-dom';
import {
  Layers,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Flame,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Award
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { reports } = useReports();

  const analytics = useMemo(() => {
    return analyticsService.calculateAnalytics(reports);
  }, [reports]);

  // High priority queue (unresolved)
  const highPriorityQueue = useMemo(() => {
    return reports
      .filter(r => r.priorityLevel === 'High' && r.status !== 'Fixed')
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5);
  }, [reports]);

  // Recent 5 reports
  const recentReports = useMemo(() => {
    return [...reports]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [reports]);

  return (
    <AdminLayout title="Community Safety Overview — Bachupally">
      {/* 5 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reports</span>
            <Layers className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{analytics.totalReports}</div>
          <div className="text-[11px] text-slate-500 mt-1">Bachupally Community Area</div>
        </div>

        {/* Open Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Open Reports</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700">{analytics.openReports}</div>
          <div className="text-[11px] text-slate-500 mt-1">Require action</div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">In Progress</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-blue-700">{analytics.inProgressReports}</div>
          <div className="text-[11px] text-slate-500 mt-1">Crews deployed</div>
        </div>

        {/* Fixed Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fixed & Certified</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{analytics.fixedReports}</div>
          <div className="text-[11px] text-slate-500 mt-1">{analytics.resolutionRate}% clearance rate</div>
        </div>

        {/* High-Priority Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-red-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">High Priority</span>
            <Flame className="w-4 h-4 fill-current animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-red-600">{analytics.highPriorityReports}</div>
          <div className="text-[11px] text-slate-500 mt-1">Urgent safety hazards</div>
        </div>
      </div>

      {/* Ward Scorecards Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-purple-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Bachupally Ward Officer & Department Performance Scorecards</h4>
            <p className="text-xs text-purple-200">Track department SLA adherence, resolution speed, and quality rankings.</p>
          </div>
        </div>
        <Link
          to="/admin/scorecards"
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <span>Open Scorecards</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Charts Row 1: Category Breakdown & Status Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reports by Category</h3>
              <p className="text-xs text-slate-500">Distribution across infrastructure failure types</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-semibold text-purple-600 hover:underline">
              View Data Table
            </Link>
          </div>
          <CategoryChart data={analytics.categoryDistribution} />
        </div>

        {/* Status Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Status Distribution</h3>
            <p className="text-xs text-slate-500">Resolution lifecycle pipeline breakdown</p>
          </div>
          <StatusChart data={analytics.statusDistribution} />
        </div>
      </div>

      {/* Main Charts Row 2: Timeline Trends & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timeline (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reporting & Resolution Velocity</h3>
              <p className="text-xs text-slate-500">New citizen reports vs certified resolutions (last 14 days)</p>
            </div>
          </div>
          <TimelineChart data={analytics.timelineData} />
        </div>

        {/* Priority Matrix (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Priority Engine Distribution</h3>
            <p className="text-xs text-slate-500">Formula score clustering</p>
          </div>
          <PriorityChart data={analytics.priorityDistribution} />
        </div>
      </div>

      {/* Bottom Grid: High-Priority Action Queue & Recent Reports Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* High-Priority Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-600 fill-current" />
              <span>Urgent High-Priority Queue</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{highPriorityQueue.length} issues</span>
          </div>

          <div className="space-y-3">
            {highPriorityQueue.length > 0 ? (
              highPriorityQueue.map(report => (
                <Link
                  key={report.reportId}
                  to={`/admin/reports/${report.reportId}`}
                  className="block p-3 rounded-xl border border-red-100 bg-red-50/40 hover:bg-red-50 transition"
                >
                  <div className="flex items-center justify-between gap-1 text-xs">
                    <span className="font-bold text-slate-900">{report.category}</span>
                    <PriorityBadge level={report.priorityLevel} score={report.priorityScore} showScore size="sm" />
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-1 mt-1 font-medium">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{report.landmark}</span>
                    </span>
                    <span className="font-semibold text-purple-700">Assign Dept &rarr;</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                No high-priority hazards currently queueing.
              </div>
            )}
          </div>
        </div>

        {/* Recent Reports Table (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Citizen Submissions</h3>
            <Link
              to="/admin/reports"
              className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
            >
              <span>View All ({reports.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Report ID</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentReports.length > 0 ? (
                  recentReports.map(report => (
                    <tr key={report.reportId} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {report.reportId}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{report.category}</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={report.status} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 truncate max-w-[120px]">
                        {report.assignedDepartment || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {formatRelativeTime(report.createdAt)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Link
                          to={`/admin/reports/${report.reportId}`}
                          className="font-semibold text-purple-700 hover:underline"
                        >
                          Inspect
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No citizen reports submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
