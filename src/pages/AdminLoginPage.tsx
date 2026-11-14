import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { demoAccounts, loginAsDemo, loginWithCredentials } = useAuth();
  const [email, setEmail] = useState('admin.kiran@ghmc.gov.in.demo');
  const [password, setPassword] = useState('demoAdmin123');
  const navigate = useNavigate();

  const adminAccount = demoAccounts.find(a => a.role === 'Admin');

  const handle1ClickLogin = () => {
    if (adminAccount) {
      loginAsDemo(adminAccount);
      navigate('/admin');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCredentials(email, password, 'Admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-purple-200 shadow-xl">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center mb-2 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Community View: Bachupally
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">CIVIC LENS Control Room</h2>
          <p className="text-xs text-slate-500">
            For local ward engineers and Bachupally community operations officers.
          </p>
        </div>

        {/* 1-Click Demo Login */}
        {adminAccount && (
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 space-y-3">
            <div className="text-xs font-bold text-purple-900 uppercase tracking-wide">
              Quick Demonstration Credentials
            </div>
            <div className="flex items-center gap-3">
              <img
                src={adminAccount.avatar}
                alt={adminAccount.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-purple-300"
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900">{adminAccount.name}</div>
                <div className="text-slate-500">{adminAccount.description}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handle1ClickLogin}
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>Sign In as {adminAccount.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Official Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
          >
            Access Operations Dashboard
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Citizen user?{' '}
          <Link to="/signin" className="font-semibold text-blue-600 hover:underline">
            Go to Citizen Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
