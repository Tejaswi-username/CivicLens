import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { ReportCard } from '../components/reports/ReportCard';
import { Link } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export const MyReportsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports } = useReports();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  // Filter my reports
  const myReports = useMemo(() => {
    let list = reports.filter(r => r.userId === currentUser.userId);

    if (selectedStatus !== 'all') {
      list = list.filter(r => r.status === selectedStatus);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r =>
        r.reportId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.landmark.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        return b.priorityScore - a.priorityScore;
      }
      return 0;
    });

    return list;
  }, [reports, currentUser.userId, selectedStatus, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Community View: Bachupally
            </span>
            <span className="text-xs text-slate-500">
              Logged in as <strong>{currentUser.name}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            My Community Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time community verification, department dispatch, and resolution photos.
          </p>
        </div>

        <Link
          to="/report/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report a Local Issue</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search your reports..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Statuses ({myReports.length})</option>
              <option value="Reported">Reported</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Fixed">Fixed</option>
              <option value="Reopened">Reopened</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="newest">Sort by Newest</option>
              <option value="priority">Sort by Priority Score</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      {myReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myReports.map(report => (
            <ReportCard key={report.reportId} report={report} showConfirmButton={false} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Reports Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't filed any infrastructure reports under this account yet, or your filters
            filtered them out.
          </p>
          <div className="pt-2">
            <Link
              to="/report/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Your First Issue</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
