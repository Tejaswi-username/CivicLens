import React, { useState, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { StatusBadge, PriorityBadge } from '../components/ui/Badge';
import { HazardImage } from '../components/ui/HazardImage';
import { formatDate, formatRelativeTime } from '../utils/date';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReportCategory, MunicipalDepartment } from '../types/report';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  ExternalLink,
  Users,
  Building2,
  Calendar
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { reports } = useReports();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters initialized from query params if present
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'all');
  const [selectedPriority, setSelectedPriority] = useState<string>(searchParams.get('priority') || 'all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'confirmations'>('priority');

  const filteredReports = useMemo(() => {
    let result = reports.filter(r => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && r.priorityLevel !== selectedPriority) return false;
      if (selectedDepartment !== 'all' && r.assignedDepartment !== selectedDepartment) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          r.reportId.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.landmark.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        // Resolved issues are not treated as currently open hazards in prioritisation
        const aIsFixed = a.status === 'Fixed';
        const bIsFixed = b.status === 'Fixed';
        if (aIsFixed !== bIsFixed) return aIsFixed ? 1 : -1;
        return b.priorityScore - a.priorityScore;
      }
      if (sortBy === 'confirmations') return b.confirmations - a.confirmations;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });

    return result;
  }, [reports, selectedCategory, selectedStatus, selectedPriority, selectedDepartment, searchQuery, sortBy]);

  const categories: ReportCategory[] = [
    'Pothole',
    'Broken Streetlight',
    'Open Drain',
    'Waterlogging',
    'Damaged Footpath',
    'Unsafe Crossing',
    'Garbage Dumping',
    'Other'
  ];

  const departments: MunicipalDepartment[] = [
    'Roads Department',
    'Electricity Department',
    'Water/Sanitation Department',
    'Traffic Department',
    'Other'
  ];

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSelectedDepartment('all');
  };

  return (
    <AdminLayout title="Community Issue Management — Bachupally">
      {/* Search and Advanced Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ID, description, landmark..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Fixed">Fixed</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="priority">Priority (Highest)</option>
              <option value="confirmations">Confirmations (Highest)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Displaying <strong>{filteredReports.length}</strong> matching reports
          </span>
          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all' || selectedDepartment !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 text-[11px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Report</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description & Landmark</th>
                <th className="py-3 px-4">Validation</th>
                <th className="py-3 px-4">Priority Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Assigned Dept</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map(report => {
                const isHigh = report.priorityLevel === 'High';
                const isReopened = report.status === 'Reopened';

                return (
                  <tr
                    key={report.reportId}
                    onClick={() => navigate(`/admin/reports/${report.reportId}`)}
                    className={`cursor-pointer transition hover:bg-purple-50/40 ${
                      isReopened
                        ? 'bg-rose-50/30'
                        : isHigh && report.status !== 'Fixed'
                        ? 'bg-amber-50/20'
                        : ''
                    }`}
                  >
                    {/* Thumbnail & ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <HazardImage
                          src={report.photoUrl}
                          alt={report.category}
                          category={report.category}
                          description={report.description}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                        />
                        <span className="font-mono font-bold text-slate-900">
                          {report.reportId}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {report.category}
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-900 font-medium truncate">
                        {report.description}
                      </div>
                      <div className="text-slate-400 text-[11px] truncate">
                        📍 {report.landmark}
                      </div>
                    </td>

                    {/* Confirmations */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span>{report.confirmations}</span>
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge level={report.priorityLevel} score={report.priorityScore} showScore size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={report.status} size="sm" />
                    </td>

                    {/* Assigned Department */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {report.assignedDepartment || (
                        <span className="text-amber-600 font-normal italic">Unassigned</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {formatRelativeTime(report.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/admin/reports/${report.reportId}`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
