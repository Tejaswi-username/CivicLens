import React, { useState, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import { ReportCard } from '../components/reports/ReportCard';
import { ReportCategory } from '../types/report';
import { COMMUNITY_CONFIG, filterReportsByCommunity } from '../utils/communityConfig';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  PlusCircle,
  X,
  FileQuestion,
  ArrowRight,
  MapPin
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { reports } = useReports();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'confirmations'>('priority');

  // Filter to community reports by default
  const communityReports = useMemo(() => {
    return filterReportsByCommunity(reports);
  }, [reports]);

  const filteredReports = useMemo(() => {
    let result = communityReports.filter(r => {
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && r.priorityLevel !== selectedPriority) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          r.reportId.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.landmark.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'priority') {
        return b.priorityScore - a.priorityScore;
      }
      if (sortBy === 'confirmations') {
        return b.confirmations - a.confirmations;
      }
      return 0;
    });

    return result;
  }, [communityReports, selectedCategory, selectedStatus, selectedPriority, searchQuery, sortBy]);

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

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Quick Submit */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-nest-mint text-nest-mint-dark flex items-center gap-1.5 border border-[#BDE5D0]">
              <span className="w-1.5 h-1.5 rounded-full bg-nest-mint-dark animate-pulse" />
              {COMMUNITY_CONFIG.badgeLabel}
            </span>
            <span className="text-xs text-slate-500 font-medium">Bachupally, Hyderabad</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-nest-charcoal tracking-tight">
            Track Local Issues
          </h1>
          <p className="text-sm text-slate-600 max-w-xl">
            Browse, filter, and validate community-submitted issues across the Bachupally neighbourhood.
          </p>
        </div>

        <Link
          to="/report/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-nest-charcoal hover:bg-black text-white font-semibold text-xs shadow-xs transition self-start sm:self-auto transform hover:-translate-y-0.5"
        >
          <span>Report an issue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter and Search Panel - Rounded-3xl with clean borders */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search description, landmark, or ID..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-full border border-gray-200 focus:ring-2 focus:ring-nest-lavender focus:border-nest-charcoal focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-4 text-xs rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-nest-lavender focus:outline-none text-nest-charcoal font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full py-2.5 px-4 text-xs rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-nest-lavender focus:outline-none text-nest-charcoal font-medium"
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

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full py-2.5 px-4 text-xs rounded-full border border-gray-200 bg-white focus:ring-2 focus:ring-nest-lavender focus:outline-none text-nest-charcoal font-medium"
            >
              <option value="priority">Sort by Priority (Highest)</option>
              <option value="confirmations">Sort by Confirmations</option>
              <option value="newest">Sort by Newest</option>
              <option value="oldest">Sort by Oldest</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-slate-500">
          <span>
            Showing <strong className="text-nest-charcoal">{filteredReports.length}</strong> reports in Bachupally
          </span>
          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all') && (
            <button
              onClick={clearFilters}
              className="text-[#8B2626] hover:text-black font-semibold flex items-center gap-1 text-[11px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <ReportCard key={report.reportId} report={report} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-nest-mint-bg text-nest-mint-dark mx-auto flex items-center justify-center">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-nest-charcoal">No Reports Match Your Filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, category, or status criteria to see all community submissions.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-full bg-nest-mint text-nest-mint-dark font-bold text-xs hover:bg-[#C5E8D4] transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};