import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from './Modal';
import { DemoModeToggle } from './DemoModeToggle';
import { Users, Shield, RefreshCw, Languages, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoRoleBanner: React.FC = () => {
  const { currentUser, demoAccounts, loginAsDemo, loginAsGuest } = useAuth();
  const { resetDemoData } = useReports();
  const { language, setLanguage } = useLanguage();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const navigate = useNavigate();

  const handleReset = () => {
    resetDemoData();
    setShowResetConfirm(false);
  };

  const selectAccount = (acc: typeof demoAccounts[0]) => {
    loginAsDemo(acc);
    setShowSwitchModal(false);
    if (acc.role === 'Admin') {
      navigate('/admin');
    } else {
      navigate('/citizen');
    }
  };

  const selectGuest = () => {
    loginAsGuest();
    setShowSwitchModal(false);
    navigate('/');
  };

  return (
    <>
      <div className="bg-nest-charcoal text-slate-200 text-xs border-b border-gray-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 font-medium">
        {/* Left: Mode Toggle & Environment Info */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Primary Toggle: Live Website (No demo data) vs Demo Data (All sample data) */}
          <DemoModeToggle theme="dark" />

          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-300">
            Identity:{' '}
            <strong className="text-white font-bold">
              {currentUser.name}
            </strong>{' '}
            <span className="text-slate-400">({currentUser.role})</span>
          </span>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Switch Demo Identity */}
          <button
            onClick={() => setShowSwitchModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs font-semibold"
            title="Switch between citizen, municipal officer, or guest demo personas"
          >
            <Users className="w-3.5 h-3.5 text-nest-lavender" />
            <span>Switch Identity</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition text-xs font-semibold"
            title="Reset to default Bachupally community demonstration reports"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Reset Data</span>
            <span className="md:hidden">Reset</span>
          </button>

          {/* Language Toggle */}
          <div className="inline-flex items-center bg-slate-800 rounded-md border border-slate-700 p-0.5">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                language === 'en'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                language === 'te'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="తెలుగు భాషలోకి మార్చండి"
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Switch Persona Modal */}
      <Modal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        title="Switch Demonstration Identity"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            CivicLens provides multiple simulated personas to test report submission, community
            validations by different citizens, and municipal department assignment without requiring
            external registration.
          </p>

          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Citizens (Validate & Confirm Issues)
            </div>
            {demoAccounts
              .filter(a => a.role === 'Citizen')
              .map(acc => {
                const isActive = currentUser.userId === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => selectAccount(acc)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition ${
                      isActive
                        ? 'border-blue-500 bg-blue-50/70'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          {acc.name}
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{acc.description}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-blue-600">Select</span>
                  </button>
                );
              })}
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Municipal Administration
            </div>
            {demoAccounts
              .filter(a => a.role === 'Admin')
              .map(acc => {
                const isActive = currentUser.userId === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => selectAccount(acc)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition ${
                      isActive
                        ? 'border-purple-500 bg-purple-50/70'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-purple-300"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                          {acc.name}
                          <Shield className="w-3.5 h-3.5 text-purple-600" />
                          {isActive && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-600 text-white font-medium">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{acc.description}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-purple-600">Select</span>
                  </button>
                );
              })}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={selectGuest}
              className="w-full text-center py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition"
            >
              Continue as Guest (Explore public issues & map only)
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset Demonstration Data"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to restore the default dataset? This will reset all issues to the
            20 seeded Bachupally community reports, including sample fixed reports and status
            histories. Any new reports you created will be re-initialized.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 shadow-sm"
            >
              Reset Data Now
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
