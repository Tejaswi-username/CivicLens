import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { NotificationBell } from './NotificationBell';
import { DemoModeToggle } from './DemoModeToggle';
import {
  MapPin,
  FileText,
  PlusCircle,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  CheckSquare,
  Route as RouteIcon,
  MessageSquare,
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/95 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Matches Nestwell lowercase wordmark style with colored dot */}
          <Link
            to={currentUser.role === 'Admin' ? '/admin' : currentUser.role === 'Citizen' ? '/citizen' : '/'}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-nest-mint flex items-center justify-center text-nest-mint-dark group-hover:scale-105 transition">
              <MapPin className="w-4 h-4 text-nest-mint-dark" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-nest-charcoal text-xl tracking-tight">
                civiclens
              </span>
              <span className="w-2 h-2 rounded-full bg-nest-lavender ml-1 mb-1 animate-pulse" />
            </div>
          </Link>

          {/* Desktop Nav Links - Centered, clean, friendly */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                isActive('/')
                  ? 'text-nest-charcoal bg-nest-mint/50 font-bold'
                  : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
              }`}
            >
              {t.navHome}
            </Link>

            <Link
              to="/map"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive('/map')
                  ? 'text-nest-charcoal bg-nest-mint/50 font-bold'
                  : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
              }`}
            >
              <span>{t.navMap}</span>
            </Link>

            <Link
              to="/safe-route"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                isActive('/safe-route')
                  ? 'text-nest-charcoal bg-nest-lavender/50 font-bold'
                  : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
              }`}
            >
              <span>{t.navSafeRoute}</span>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-nest-mint text-nest-mint-dark uppercase">
                Plus
              </span>
            </Link>

            <Link
              to="/reports"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition ${
                isActive('/reports')
                  ? 'text-nest-charcoal bg-nest-mint/50 font-bold'
                  : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
              }`}
            >
              <span>{t.navReports}</span>
            </Link>

            <Link
              to="/community-wins"
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
                isActive('/community-wins')
                  ? 'text-nest-charcoal bg-nest-mint font-bold'
                  : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
              }`}
              title="Before & After Verified Resolutions"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.navWins || 'Wins'}</span>
            </Link>

            <Link
              to="/community-chat"
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
                isActive('/community-chat')
                  ? 'text-nest-charcoal bg-nest-lavender font-bold'
                  : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
              }`}
              title="Bachupally Neighborhood Discussion Hub"
            >
              <MessageSquare className="w-3.5 h-3.5 text-nest-lavender-dark" />
              <span>{t.navChat || 'Chat'}</span>
            </Link>

            <Link
              to="/scorecards"
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-1 ${
                isActive('/scorecards')
                  ? 'text-nest-charcoal bg-nest-peach font-bold'
                  : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
              }`}
              title="Ward Officer & Department Performance Scorecards"
            >
              <Award className="w-3.5 h-3.5 text-[#8B2626]" />
              <span>{t.navScorecards || 'Scorecards'}</span>
            </Link>

            {currentUser.role === 'Citizen' && (
              <Link
                to="/citizen"
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                  isActive('/citizen')
                    ? 'text-nest-charcoal bg-nest-mint/50 font-bold'
                    : 'text-slate-600 hover:text-nest-charcoal hover:bg-gray-100'
                }`}
              >
                Citizen Desk
              </Link>
            )}

            {currentUser.role === 'Admin' && (
              <Link
                to="/admin"
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                  isActive('/admin') || location.pathname.startsWith('/admin')
                    ? 'text-purple-900 bg-purple-100 font-bold'
                    : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Ops</span>
              </Link>
            )}
          </div>

          {/* Right Action Buttons - Matches Nestwell rounded pill CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Toggle: Live Website vs Demo Data */}
            <DemoModeToggle theme="light" />

            {/* Primary Action Button: Rounded-full dark charcoal pill with arrow */}
            <Link
              to="/report/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-nest-charcoal hover:bg-black text-white font-semibold text-sm shadow-xs transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{t.navReportIssue}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Notification Bell */}
            {currentUser.role !== 'Guest' && (
              <NotificationBell colorTheme="light" />
            )}

            {/* Profile Dropdown or Sign In */}
            {currentUser.role !== 'Guest' ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <Link
                  to={currentUser.role === 'Admin' ? '/admin' : '/profile'}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
                  title="View Profile"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-nest-mint text-nest-mint-dark flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-nest-charcoal hidden xl:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-slate-400 hover:text-nest-charcoal rounded-full hover:bg-gray-100 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className={`px-4 py-2 text-sm font-semibold rounded-full transition ${
                  isActive('/signin') || isActive('/login')
                    ? 'bg-nest-mint/60 text-nest-charcoal font-bold'
                    : 'text-nest-charcoal hover:text-black hover:bg-gray-100'
                }`}
              >
                {t.navSignIn}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser.role !== 'Guest' && (
              <NotificationBell colorTheme="light" />
            )}
            <Link
              to="/report/new"
              className="p-2 rounded-full bg-nest-charcoal text-white"
              title="Report an Issue"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full text-nest-charcoal hover:bg-gray-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          {/* Mode Switcher */}
          <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mode</span>
            <DemoModeToggle theme="light" />
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
          >
            {t.navHome}
          </Link>
          <Link
            to="/map"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
          >
            {t.navMap}
          </Link>
          <Link
            to="/safe-route"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50 flex items-center justify-between"
          >
            <span>{t.navSafeRoute}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-nest-mint text-nest-mint-dark">
              PLUS
            </span>
          </Link>
          <Link
            to="/reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
          >
            {t.navReports}
          </Link>
          <Link
            to="/community-wins"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
          >
            Community Wins (Before & After)
          </Link>
          <Link
            to="/community-chat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
          >
            Community Discussion Chat
          </Link>
          <Link
            to="/scorecards"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
          >
            Ward Performance Scorecards
          </Link>

          {currentUser.role === 'Citizen' && (
            <>
              <Link
                to="/citizen"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
              >
                Citizen Desk
              </Link>
              <Link
                to="/my-reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
              >
                {t.navMyReports}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-base font-semibold text-nest-charcoal hover:bg-gray-50"
              >
                Citizen Profile
              </Link>
            </>
          )}

          {currentUser.role === 'Admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2 rounded-xl text-base font-bold text-purple-700 bg-purple-50"
            >
              Operations Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Role: <strong className="text-nest-charcoal">{currentUser.name}</strong> ({currentUser.role})
            </span>
            {currentUser.role !== 'Guest' ? (
              <button
                onClick={handleSignOut}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                {t.navSignOut}
              </button>
            ) : (
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                {t.navSignIn}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};