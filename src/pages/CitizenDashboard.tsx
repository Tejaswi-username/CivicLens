import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { ReportCard } from '../components/reports/ReportCard';
import {
  PlusCircle,
  Compass,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Route as RouteIcon
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports } = useReports();

  // Citizen metrics
  const myReports = reports.filter(r => r.userId === currentUser.userId);
  const openIssuesNearby = reports.filter(r => r.status !== 'Fixed');
  const highPriorityIssues = reports.filter(r => r.priorityLevel === 'High');
  const resolvedIssues = reports.filter(r => r.status === 'Fixed');

  // Recently reported (last 6)
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Recent activity events across the community
  const recentActivityEvents = reports
    .flatMap(r => r.statusHistory.map(h => ({ ...h, reportId: r.reportId, category: r.category })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Greeting Banner - Framed Rounded-3xl card with Template Buttons */}
      <div className="bg-white rounded-[32px] border border-gray-200/90 p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-nest-mint text-nest-mint-dark border border-[#BDE5D0]">
              Citizen Desk
            </span>
            <span className="text-xs text-slate-500 font-medium">• Ward 11, Bachupally</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-nest-charcoal tracking-tight">
            Welcome back, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every report you file and validate helps municipal engineers prioritize dangerous
            potholes, open drains, and broken streetlights in your community.
          </p>
        </div>

        {/* Quick CTA Actions - Rounded-full Pill Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/report/new"
            className="px-6 py-3 rounded-full bg-nest-charcoal hover:bg-black text-white font-semibold text-xs shadow-xs flex items-center gap-2 transition transform hover:-translate-y-0.5"
          >
            <span>Report an issue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/map"
            className="px-5 py-3 rounded-full border border-gray-300 hover:border-nest-charcoal text-nest-charcoal font-semibold text-xs flex items-center gap-2 transition"
          >
            <span>Explore map</span>
          </Link>

          <Link
            to="/safe-route"
            className="px-5 py-3 rounded-full bg-nest-lavender hover:bg-[#D0C2EE] text-nest-lavender-dark font-bold text-xs flex items-center gap-1.5 transition"
          >
            <span>SafeRoute+</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards - Exact Pastel Color Blocks from Template */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: My Reports (Lilac) */}
        <Link
          to="/my-reports"
          className="bg-nest-lavender-light p-6 rounded-3xl border border-[#DCD2F2] hover:shadow-sm transition block group"
        >
          <div className="flex items-center justify-between text-nest-lavender-dark mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">My Submissions</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-nest-charcoal">{myReports.length}</div>
          <div className="text-xs text-slate-600 mt-1">Submitted from your account</div>
        </Link>

        {/* Card 2: Open Issues Nearby (Peach) */}
        <Link
          to="/reports"
          className="bg-nest-peach p-6 rounded-3xl border border-[#F0D5D3] hover:shadow-sm transition block group"
        >
          <div className="flex items-center justify-between text-nest-peach-dark mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Open in Ward</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-nest-charcoal">{openIssuesNearby.length}</div>
          <div className="text-xs text-slate-600 mt-1">Awaiting municipal repair</div>
        </Link>

        {/* Card 3: High Priority (Amber / Coral) */}
        <Link
          to="/reports?priority=High"
          className="bg-[#FEF3C7] p-6 rounded-3xl border border-[#FDE68A] hover:shadow-sm transition block group"
        >
          <div className="flex items-center justify-between text-[#92400E] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">High Safety Risk</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-[#92400E]">{highPriorityIssues.length}</div>
          <div className="text-xs text-slate-600 mt-1">Scoring 70+ priority matrix</div>
        </Link>

        {/* Card 4: Resolved Issues (Mint) */}
        <Link
          to="/community-wins"
          className="bg-nest-mint p-6 rounded-3xl border border-[#BDE5D0] hover:shadow-sm transition block group"
        >
          <div className="flex items-center justify-between text-nest-mint-dark mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fixed & Certified</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-nest-mint-dark">{resolvedIssues.length}</div>
          <div className="text-xs text-slate-600 mt-1">With photo proof attached</div>
        </Link>
      </div>

      {/* Main Grid: Nearby Reported Issues Cards & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Nearby Reported Issues Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-nest-charcoal">Issues in Your Community</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click “I Face This” on any issue to validate it and raise its priority score for Bachupally.
              </p>
            </div>
            <Link
              to="/reports"
              className="text-xs font-bold text-nest-charcoal hover:text-black flex items-center gap-1"
            >
              <span>See All ({reports.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentReports.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentReports.map(report => (
                <ReportCard key={report.reportId} report={report} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-nest-charcoal">No Active Hazards in Live Site</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your neighborhood currently has zero pending issues reported. Be the first to report a hazard or toggle Demo Data to explore!
              </p>
              <div className="pt-2">
                <Link
                  to="/report/new"
                  className="px-5 py-2 rounded-full bg-nest-charcoal text-white text-xs font-semibold hover:bg-black transition inline-block"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right: Recent Activity Timeline & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Action Card - Mint Tint */}
          <div className="bg-nest-mint-bg border border-[#DBEADB] text-nest-charcoal rounded-3xl p-6 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-nest-mint-dark">
              CITIZEN REPORTING
            </div>
            <h3 className="font-extrabold text-base text-nest-charcoal">Report a Local Issue</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Snap a photograph, mark the spot on the Bachupally map, and answer 2 safety risk questions. Takes under 60 seconds.
            </p>
            <Link
              to="/report/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-nest-charcoal hover:bg-black text-white rounded-full text-xs font-semibold shadow-xs transition"
            >
              <span>Report an issue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-nest-charcoal" />
                <span>Recent Community Activity</span>
              </h3>
            </div>

            <div className="space-y-4">
              {recentActivityEvents.map((event, idx) => (
                <div key={event.id || idx} className="text-xs space-y-1 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-1">
                    <Link
                      to={`/reports/${event.reportId}`}
                      className="font-bold text-nest-charcoal hover:underline"
                    >
                      {event.reportId}
                    </Link>
                    <span className="text-[10px] text-slate-400">
                      {event.role} update
                    </span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {event.note || `Status shifted to ${event.status}`}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};