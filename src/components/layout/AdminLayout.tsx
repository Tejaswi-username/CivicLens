import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../ui/NotificationBell';
import { DemoModeToggle } from '../ui/DemoModeToggle';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Clock,
  RotateCcw,
  Compass,
  BarChart3,
  LogOut,
  Shield,
  Search,
  Bell,
  Calendar,
  Award
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'All Reports', path: '/admin/reports', icon: FileText },
    { label: 'High Priority', path: '/admin/reports?priority=High', icon: AlertTriangle },
    { label: 'In Progress', path: '/admin/reports?status=In Progress', icon: Clock },
    { label: 'Reopened', path: '/admin/reports?status=Reopened', icon: RotateCcw },
    { label: 'Map View', path: '/map', icon: Compass },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Ward Scorecards', path: '/admin/scorecards', icon: Award },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-nest-charcoal text-slate-300 flex-shrink-0 border-r border-gray-800 flex flex-col justify-between">
        <div>
          {/* Admin Brand */}
          <div className="p-6 border-b border-gray-800">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-nest-lavender flex items-center justify-center text-nest-lavender-dark">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-extrabold text-base block tracking-tight">
                  civiclens
                </span>
                <span className="text-[10px] text-nest-lavender font-semibold tracking-wider uppercase">
                  Admin Ops • Bachupally
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 text-xs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin' && !location.search
                  : location.pathname + location.search === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-full font-semibold transition ${
                    isActive
                      ? 'bg-nest-lavender text-nest-lavender-dark font-bold shadow-xs'
                      : 'hover:bg-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Profile & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-purple-400"
            />
            <div className="text-xs min-w-0">
              <div className="text-white font-bold truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">Chief Officer (GHMC)</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-extrabold text-slate-900">{title}</h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
              Live Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <DemoModeToggle theme="light" />

            <NotificationBell colorTheme="light" />

            <div className="hidden sm:flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentDate}</span>
            </div>

            <Link
              to="/citizen"
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition"
            >
              Switch to Citizen View
            </Link>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="p-6 space-y-6 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};
