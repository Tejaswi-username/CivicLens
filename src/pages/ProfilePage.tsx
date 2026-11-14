import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { formatDate } from '../utils/date';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  FileText,
  ThumbsUp,
  Award,
  Shield,
  ArrowRight,
  LogOut
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout, demoAccounts, loginAsDemo } = useAuth();
  const { reports } = useReports();

  const myReports = reports.filter(r => r.userId === currentUser.userId);
  const myConfirmationsCount = reports.filter(r => r.confirmedBy.includes(currentUser.userId)).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <img
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
          alt={currentUser.name}
          referrerPolicy="no-referrer"
          className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 shadow-md"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {currentUser.role}
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Member since {formatDate(currentUser.createdAt)}</span>
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Citizen Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{myReports.length}</div>
            <div className="text-xs font-semibold text-slate-500">Reports Submitted</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">{myConfirmationsCount}</div>
            <div className="text-xs font-semibold text-slate-500">Issues Validated</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900">
              {myReports.length * 15 + myConfirmationsCount * 5}
            </div>
            <div className="text-xs font-semibold text-slate-500">SDG 11 Civic Points</div>
          </div>
        </div>
      </div>

      {demoAccounts.length > 0 && <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">Demonstration Personas</h3>
          <p className="text-xs text-slate-500">
            Quickly switch between citizen identities to test multiple confirmations on the same issue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demoAccounts
            .filter(a => a.role === 'Citizen')
            .map(acc => (
              <button
                key={acc.id}
                onClick={() => loginAsDemo(acc)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                  currentUser.userId === acc.id
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <img
                  src={acc.avatar}
                  alt={acc.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{acc.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{acc.description}</div>
                </div>
              </button>
            ))}
        </div>
      </div>}
    </div>
  );
};
