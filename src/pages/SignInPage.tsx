import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import {
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Phone,
  Building2,
  KeyRound,
  Sparkles,
  MapPin,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

type SignInTab = 'citizen' | 'official' | 'demo';

export const SignInPage: React.FC = () => {
  const { demoAccounts, loginAsDemo, loginWithCredentials, loginAsGuest } = useAuth();
  const { showToast } = useReports();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<SignInTab>('citizen');
  
  // Citizen Form state
  const [citizenMethod, setCitizenMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Official Form state
  const [officialEmail, setOfficialEmail] = useState('');
  const [officialPassword, setOfficialPassword] = useState('');
  const [department, setDepartment] = useState('GHMC Ward 124 - Road & Infrastructure');
  const [showOfficialPassword, setShowOfficialPassword] = useState(false);

  // Quick feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Instant Demo Account Selection
  const handleDemoSelect = (account: typeof demoAccounts[0]) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      loginAsDemo(account);
      showToast(`Welcome back, ${account.name}! Signed in as ${account.role}.`, 'success');
      if (account.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/citizen');
      }
      setIsLoading(false);
    }, 250);
  };

  // Continue as Guest
  const handleGuestSelect = () => {
    loginAsGuest();
    showToast('Browsing as Community Guest. Feel free to explore the hazard map and safe routes!', 'info');
    navigate('/map');
  };

  // Citizen Submit
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const credentialIdentifier = citizenMethod === 'email' ? email.trim() : phone.trim();
    if (!credentialIdentifier) {
      setErrorMessage(`Please provide your ${citizenMethod === 'email' ? 'email address' : 'phone number'}.`);
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const userEmail = citizenMethod === 'email' 
        ? email 
        : `${phone.replace(/\D/g, '')}@citizen.civiclens.local`;

      const user = loginWithCredentials(userEmail, password, 'Citizen');
      showToast(`Signed in successfully as ${user.name}!`, 'success');
      
      // Navigate to intended page or citizen dashboard
      const state = location.state as { from?: string } | undefined;
      const target = state?.from || '/citizen';
      navigate(target);
      setIsLoading(false);
    }, 300);
  };

  // Official Submit
  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!officialEmail.trim()) {
      setErrorMessage('Please enter your official municipal email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user = loginWithCredentials(officialEmail, officialPassword, 'Admin');
      showToast(`Welcome, ${user.name}! Control room session initiated for ${department}.`, 'success');
      navigate('/admin');
      setIsLoading(false);
    }, 350);
  };

  const handleForgotPassword = () => {
    showToast('Password recovery will be available after authentication is connected.', 'info');
  };

  const citizenDemo = demoAccounts.find(a => a.id === 'user_priya');
  const adminDemo = demoAccounts.find(a => a.role === 'Admin');

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50/60">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Civic Lens Brand & Neighborhood Intelligence Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1E252B] to-[#2C204B] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-nest-mint/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-nest-lavender/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top branding */}
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-nest-mint">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ward 124 Bachupally Network</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-nest-mint flex items-center justify-center text-nest-mint-dark">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-white">civiclens</span>
                <span className="w-2 h-2 rounded-full bg-nest-lavender animate-pulse" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed pt-1">
                Your neighborhood civic intelligence platform. Spot local hazards, prioritize fixes, and track verified resolutions together.
              </p>
            </div>

            {/* Live Ward Metrics Pill Cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
                <div className="text-2xl font-black text-nest-mint">284+</div>
                <div className="text-[11px] text-slate-300 font-medium">Verified Repairs</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-xs">
                <div className="text-2xl font-black text-nest-lavender">&lt;48h</div>
                <div className="text-[11px] text-slate-300 font-medium">SLA Fix Response</div>
              </div>
            </div>

            {/* Key feature checklist */}
            <div className="space-y-2.5 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Geotagged hazard reports with duplicate AI protection</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Smart safe routes avoiding potholes and dark stretches</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Direct escalation to municipal ward officers</span>
              </div>
            </div>
          </div>

          {/* Bottom Community Quote Card */}
          <div className="relative z-10 pt-8 mt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Priya Sharma"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
              />
              <div className="text-xs">
                <div className="font-bold text-white">Priya Sharma</div>
                <div className="text-slate-300 text-[11px]">Bachupally Resident & Top Contributor</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300 italic mt-2.5 leading-relaxed">
              "The open drain on Nizampet Road was resolved in 36 hours once our neighborhood validated the report together."
            </p>
          </div>
        </div>

        {/* Right Side: Sign In Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Header & Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-nest-charcoal tracking-tight">
                    Sign in to your account
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Select your portal role to access your neighborhood dashboard
                  </p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-nest-mint text-nest-mint-dark flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live System
                </span>
              </div>

              {/* Role Segmented Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setActiveTab('citizen'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'citizen'
                      ? 'bg-white text-nest-charcoal shadow-xs'
                      : 'text-slate-600 hover:text-nest-charcoal'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>Citizen</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('official'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'official'
                      ? 'bg-white text-purple-900 shadow-xs'
                      : 'text-slate-600 hover:text-purple-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                  <span>Ward Official</span>
                </button>

                {demoAccounts.length > 0 && <button
                  type="button"
                  onClick={() => { setActiveTab('demo'); setErrorMessage(null); }}
                  className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
                    activeTab === 'demo'
                      ? 'bg-white text-amber-900 shadow-xs'
                      : 'text-slate-600 hover:text-amber-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>1-Click Demo</span>
                </button>}
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: CITIZEN SIGN IN */}
            {activeTab === 'citizen' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Method selector: Email vs Phone */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs">
                  <span className="font-semibold text-slate-700">Sign In Method:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCitizenMethod('email')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        citizenMethod === 'email'
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Email Address
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setCitizenMethod('phone')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition ${
                        citizenMethod === 'phone'
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Mobile Phone
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCitizenSubmit} className="space-y-4">
                  {citizenMethod === 'email' ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mobile Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] font-semibold text-blue-600 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your account password"
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span>Remember this browser for 30 days</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-nest-charcoal hover:bg-black text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Signing In...' : 'Sign In as Citizen'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                </form>

                {/* Quick 1-click citizen prefill badge */}
                {citizenDemo && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={citizenDemo.avatar}
                        alt={citizenDemo.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-slate-800">{citizenDemo.name}</div>
                        <div className="text-[10px] text-slate-500">Citizen Demo Profile</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDemoSelect(citizenDemo)}
                      className="px-3 py-1.5 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold transition"
                    >
                      Instant Login
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: WARD OFFICIAL / ADMIN SIGN IN */}
            {activeTab === 'official' && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs text-purple-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-purple-700" />
                    <span>Official Ward Operations & Department Desk</span>
                  </div>
                  <p className="text-[11px] text-purple-700 leading-relaxed">
                    Restricted to GHMC, TSSPDCL, and HMWSSB department engineers, ward corporators, and field contractors.
                  </p>
                </div>

                <form onSubmit={handleOfficialSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Assigned Municipal Department
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <select
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                      >
                        <option value="GHMC Ward 124 - Road & Infrastructure">
                          GHMC Ward 124 - Road & Infrastructure Wing
                        </option>
                        <option value="TSSPDCL Electrical & Streetlight Wing">
                          TSSPDCL Electrical & Streetlight Wing
                        </option>
                        <option value="HMWSSB Water Supply & Drainage">
                          HMWSSB Water Supply & Drainage
                        </option>
                        <option value="GHMC Sanitation & Solid Waste Management">
                          GHMC Sanitation & Solid Waste Management
                        </option>
                        <option value="Traffic Safety & Pedestrian Ops">
                          Traffic Safety & Pedestrian Ops
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Official Gov Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={officialEmail}
                        onChange={e => setOfficialEmail(e.target.value)}
                        placeholder="official.name@ghmc.gov.in"
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Official Security Key / Password
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showOfficialPassword ? 'text' : 'password'}
                        required
                        value={officialPassword}
                        onChange={e => setOfficialPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOfficialPassword(!showOfficialPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showOfficialPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-full bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    <span>{isLoading ? 'Authenticating...' : 'Sign In to Operations Console'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </button>
                </form>

                {/* Quick 1-click official prefill badge */}
                {adminDemo && (
                  <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={adminDemo.avatar}
                        alt={adminDemo.name}
                        className="w-8 h-8 rounded-full object-cover border border-purple-300"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-purple-900">{adminDemo.name}</div>
                        <div className="text-[10px] text-purple-600">Bachupally Ward Operations Officer</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDemoSelect(adminDemo)}
                      className="px-3 py-1.5 rounded-full bg-purple-200 hover:bg-purple-300 text-purple-900 text-xs font-bold transition"
                    >
                      Instant Official Sign In
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: 1-CLICK INSTANT DEMO PERSONAS */}
            {demoAccounts.length > 0 && activeTab === 'demo' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="text-xs text-slate-600 bg-amber-50/80 border border-amber-200 p-3 rounded-2xl flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Select any pre-configured community persona to explore CivicLens with active reports, karma points, and role permissions.
                  </span>
                </div>

                <div className="space-y-2.5">
                  {demoAccounts.map(account => {
                    const isAdmin = account.role === 'Admin';
                    return (
                      <button
                        key={account.id}
                        type="button"
                        onClick={() => handleDemoSelect(account)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition hover:shadow-md ${
                          isAdmin
                            ? 'border-purple-200 bg-purple-50/50 hover:border-purple-400'
                            : 'border-slate-200 bg-slate-50/60 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={account.avatar}
                            alt={account.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-300 shadow-xs"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span>{account.name}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  isAdmin
                                    ? 'bg-purple-200 text-purple-800'
                                    : 'bg-nest-mint text-nest-mint-dark'
                                }`}
                              >
                                {account.role}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{account.description}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <span className="hidden sm:inline">Select</span>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Guest Browsing Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGuestSelect}
                className="w-full py-2.5 rounded-full border border-dashed border-slate-300 text-xs font-bold text-slate-600 hover:text-nest-charcoal hover:border-slate-400 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
              >
                <span>Continue as Guest (Explore live map without logging in)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer links: Sign Up & Help */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-500">
            <div>
              <span>New to CivicLens? </span>
              <Link to="/signup" className="font-bold text-blue-600 hover:underline">
                Create Citizen Account
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/map" className="hover:text-slate-800 transition">
                Community Map
              </Link>
              <span>•</span>
              <Link to="/scorecards" className="hover:text-slate-800 transition">
                Ward Scorecards
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
