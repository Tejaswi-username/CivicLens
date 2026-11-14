import React, { useState, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import { LeafletMap } from '../components/map/LeafletMap';
import { ReportCard } from '../components/reports/ReportCard';
import { Report, ReportCategory, PriorityLevel, ReportStatus } from '../types/report';
import { COMMUNITY_CONFIG, filterReportsByCommunity } from '../utils/communityConfig';
import {
  Compass,
  Search,
  Filter,
  List,
  Map as MapIcon,
  X,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';

export const PublicMapPage: React.FC = () => {
  const { reports } = useReports();

  // View toggle: map vs list on mobile
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filter to community reports by default
  const communityReports = useMemo(() => {
    return filterReportsByCommunity(reports);
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return communityReports.filter(r => {
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
  }, [communityReports, selectedCategory, selectedStatus, selectedPriority, searchQuery]);

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

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPriority !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {COMMUNITY_CONFIG.badgeLabel}
            </span>
            <span className="text-xs text-slate-500 font-medium">Bachupally, Hyderabad</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Community Hazard Map
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time community-validated infrastructure hazards across the Bachupally local area.
          </p>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="md:hidden bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setActiveView('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeView === 'map' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeView === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List ({filteredReports.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Field */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by landmark, description, or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority (Score 70+)</option>
              <option value="Medium">Medium Priority (40-69)</option>
              <option value="Low">Low Priority (&lt;40)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing <strong>{filteredReports.length}</strong> of {reports.length} plotted reports
            </span>
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 text-[11px]"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Map or List Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leaflet Map Area (Hidden on mobile if user toggled to list) */}
        <div
          className={`lg:col-span-8 ${
            activeView === 'list' ? 'hidden md:block' : 'block'
          }`}
        >
          <LeafletMap
            reports={filteredReports}
            selectedReportId={selectedReport?.reportId}
            onSelectReport={report => setSelectedReport(report)}
            height="620px"
          />
        </div>

        {/* Side Panel: Selected Marker Details or Filtered List */}
        <div className="lg:col-span-4 space-y-4">
          {selectedReport ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Selected Map Marker
                </span>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-xs text-blue-600 hover:underline font-semibold"
                >
                  Deselect
                </button>
              </div>
              <ReportCard report={selectedReport} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Matching Issues ({filteredReports.length})</span>
                <span className="hidden lg:inline text-[11px] text-slate-400">
                  Click pin on map to inspect
                </span>
              </div>

              <div className="max-h-[620px] overflow-y-auto space-y-3 pr-1">
                {filteredReports.slice(0, 6).map(report => (
                  <div
                    key={report.reportId}
                    onClick={() => setSelectedReport(report)}
                    className="cursor-pointer"
                  >
                    <ReportCard report={report} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
