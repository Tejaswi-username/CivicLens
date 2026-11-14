import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { useLanguage } from '../context/LanguageContext';
import { ReportCard } from '../components/reports/ReportCard';
import { SAMPLE_PHOTOS } from '../data/seedReports';
import {
  Compass,
  CheckCircle2,
  Users,
  MapPin,
  ArrowRight,
  Sparkles,
  Route as RouteIcon,
  ChevronLeft,
  ChevronRight,
  Flame,
  ShieldCheck,
  Droplets,
  Lightbulb,
  Trash2,
  Calendar as CalendarIcon
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { reports, isDemoMode, setDemoMode } = useReports();
  const { t } = useLanguage();

  // Selected category filter for active reports section
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [calendarMonth, setCalendarMonth] = useState<'Oct' | 'Nov'>('Oct');

  // Filtered reports
  const displayReports = reports
    .filter(r => selectedCategory === 'All' || r.category === selectedCategory)
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

      {/* 1. HERO SECTION - Exact layout matching Image 3 (Nestwell Hero) */}
      <section className="bg-white rounded-[32px] border border-gray-200/90 shadow-xs p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        {/* Decorative corner accent lines */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-gray-300 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gray-300 rounded-tr-sm pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Kicker with bullet */}
              <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-nest-charcoal" />
                <span>YOUR CIVIC VILLAGE STARTS HERE</span>
              </div>

              {/* Massive Bold Headline with Lilac Highlighter Underline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-nest-charcoal leading-[1.08]">
                Civic health is a journey.{' '}
                <br className="hidden sm:inline" />
                Let's fix it{' '}
                <span className="nest-highlight">together.</span>
              </h1>

              {/* Relaxed Supportive Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Trusted guidance for the big hazards. Real connection for everyday commutes. Community support at every step of Bachupally's neighborhood life.
              </p>

              {/* Pill Button Group - Exact Nestwell buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/reports"
                  className="px-7 py-3.5 rounded-full bg-nest-lavender hover:bg-[#D0C2EE] text-nest-lavender-dark font-bold text-sm flex items-center gap-2 shadow-xs transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Explore active issues</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/report/new"
                  className="px-6 py-3.5 rounded-full border border-gray-300 hover:border-nest-charcoal text-nest-charcoal font-semibold text-sm flex items-center gap-2 transition"
                >
                  <span>Report an issue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {currentUser.role === 'Guest' && (
                  <Link
                    to="/signin"
                    className="px-5 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-black font-semibold text-sm flex items-center gap-2 transition"
                  >
                    <span>Sign in</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Bottom Trust Row */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-100 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-nest-mint-dark" />
                <span>OpenStreetMap verified GPS</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-nest-lavender-dark" />
                <span>48h SLA Emergency escalation</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-700" />
                <span>Every citizen welcome</span>
              </div>
            </div>
          </div>

          {/* Right Column: Soft Mint Card with Supportive Message & Real Visual */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-nest-mint p-7 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-nest-charcoal leading-snug">
                You don't need to report alone. You just need a little community support.
              </h2>
              <div className="flex items-center gap-2 text-xs font-semibold text-nest-mint-dark">
                <span>✓</span>
                <span>Less waiting in the dark. More "we've got this fixed."</span>
              </div>
            </div>

            {/* Visual Card Snapshot */}
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm border border-emerald-100 group">
              <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                {isDemoMode ? (
                  <>
                    <img
                      src={SAMPLE_PHOTOS.pothole1}
                      alt="Bachupally community road"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Live Pill Badge */}
                    <div className="absolute top-3 left-3 bg-[#F6EBEA] text-[#8B2626] border border-[#F0D5D3] text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>High Priority Community Issue</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-1">
                      <div className="font-bold text-sm">
                        Deep crater pothole at Bachupally X Roads
                      </div>
                      <div className="flex items-center justify-between text-slate-200 text-[11px]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>Bachupally, Hyderabad</span>
                        </span>
                        <span className="font-bold text-nest-mint">26 Citizens Confirmed</span>
                      </div>
                    </div>
                  </>
                ) : reports.length > 0 ? (
                  <>
                    <img
                      src={reports[0].photoUrl}
                      alt={reports[0].landmark}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{reports[0].category} • Priority {reports[0].priorityScore}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-1">
                      <div className="font-bold text-sm line-clamp-1">
                        {reports[0].description}
                      </div>
                      <div className="flex items-center justify-between text-slate-200 text-[11px]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{reports[0].landmark}</span>
                        </span>
                        <span className="font-bold text-nest-mint">{reports[0].confirmations} Confirmed</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live System Ready
                      </span>
                      <span className="text-[11px] text-slate-400">Zero Backlog</span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-base text-white">
                        Civic Issue Reporting Live Portal
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        Clean deployment active with no demo data. Submit your neighborhood's first report with photo and GPS location.
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                      <span>Hyderabad Municipal Zone</span>
                      <span className="text-nest-mint font-semibold">0 Active Hazards</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 2. CATEGORY / STAGE GRID - Exact layout from Image 2 (Nestwell 4 Pastel Columns) */}
      <section className="space-y-6">
        {/* Top Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-nest-charcoal">
              Where does your neighborhood need support?
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to="/reports?category=Road%20Hazards"
                className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:border-nest-charcoal text-xs font-semibold text-nest-charcoal flex items-center gap-1 transition"
              >
                <span>Potholes & Roads</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                to="/reports?category=Water%20Supply"
                className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:border-nest-charcoal text-xs font-semibold text-nest-charcoal flex items-center gap-1 transition"
              >
                <span>Water & Drainage</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                to="/reports?category=Street%20Lighting"
                className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:border-nest-charcoal text-xs font-semibold text-nest-charcoal flex items-center gap-1 transition"
              >
                <span>Streetlights</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                to="/reports?category=Sanitation"
                className="px-4 py-1.5 rounded-full border border-gray-200 bg-white hover:border-nest-charcoal text-xs font-semibold text-nest-charcoal flex items-center gap-1 transition"
              >
                <span>Sanitation</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            There is a place for your report here.
          </span>
        </div>

        {/* 4-Column Pastel Grid with Border Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded-3xl overflow-hidden border border-gray-200 shadow-xs">
          
          {/* Column 1: Soft Pale Peach (#F6EBEA) - Roads */}
          <div className="bg-nest-peach p-7 flex flex-col justify-between space-y-6 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="space-y-4">
              <div className="w-8 h-8 flex items-center justify-center text-nest-peach-dark">
                <RouteIcon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                THE STREETS
              </div>
              <h3 className="text-xl font-extrabold text-nest-charcoal leading-snug">
                Every road, safer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Potholes, broken medians, and damaged speedbreakers tracked with GPS & after-repair photos.
              </p>
            </div>
            <Link
              to="/reports?category=Road%20Hazards"
              className="text-xs font-bold text-nest-charcoal hover:text-black flex items-center gap-1 group"
            >
              <span>Road resources</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Column 2: Soft Pale Mint (#D7EFE2) - Water & Drainage */}
          <div className="bg-nest-mint p-7 flex flex-col justify-between space-y-6 border-b md:border-b-0 lg:border-r border-gray-200">
            <div className="space-y-4">
              <div className="w-8 h-8 flex items-center justify-center text-nest-mint-dark">
                <Droplets className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                THE ESSENTIALS
              </div>
              <h3 className="text-xl font-extrabold text-nest-charcoal leading-snug">
                Clean, flowing water
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pipeline leaks, overflow manholes, and open drain hazards escalated directly to water crews.
              </p>
            </div>
            <Link
              to="/reports?category=Water%20Supply"
              className="text-xs font-bold text-nest-charcoal hover:text-black flex items-center gap-1 group"
            >
              <span>Water resources</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Column 3: Soft Pale Lavender (#D9CEF3) - Streetlights */}
          <div className="bg-nest-lavender p-7 flex flex-col justify-between space-y-6 border-b md:border-b-0 md:border-r border-gray-200">
            <div className="space-y-4">
              <div className="w-8 h-8 flex items-center justify-center text-nest-lavender-dark">
                <Lightbulb className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                THE NIGHTS
              </div>
              <h3 className="text-xl font-extrabold text-nest-charcoal leading-snug">
                Well-lit walkways
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dark blindspots, fallen sodium lamps, and SafeRoute+ night navigation for night commuters.
              </p>
            </div>
            <Link
              to="/safe-route"
              className="text-xs font-bold text-nest-charcoal hover:text-black flex items-center gap-1 group"
            >
              <span>SafeRoute+ paths</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Column 4: Soft Pale Celadon (#E8F3EC) - Sanitation */}
          <div className="bg-nest-celadon p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-8 h-8 flex items-center justify-center text-slate-700">
                <Trash2 className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                THE COMMONS
              </div>
              <h3 className="text-xl font-extrabold text-nest-charcoal leading-snug">
                A cleaner ward
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unattended garbage piles, open dumping, and public hygiene spots verified by community consensus.
              </p>
            </div>
            <Link
              to="/reports?category=Sanitation"
              className="text-xs font-bold text-nest-charcoal hover:text-black flex items-center gap-1 group"
            >
              <span>Sanitation resources</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

        </div>
      </section>


      {/* 3. CALENDAR & WARD ACTION SECTION - Exact layout from Image 1 (Nestwell Meetups) */}
      <section className="bg-nest-mint-bg rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#DBEADB] space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              OFFLINE CONNECTIONS. REAL-LIFE SUPPORT.
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-nest-charcoal tracking-tight">
              Good governance, close to home.
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              A ward walk, a citizen verification, a conversation with someone who gets it.
            </p>
          </div>

          {/* Top Right Pilot Community Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-nest-lavender-light text-nest-lavender-dark text-xs font-bold self-start">
            <MapPin className="w-3.5 h-3.5" />
            <span>Bachupally, Hyderabad · Pilot community</span>
          </div>
        </div>

        {/* Grid: Calendar on Left, Event List on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Minimalist Calendar Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200/90 p-6 shadow-xs space-y-5">
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCalendarMonth('Oct')}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-slate-600"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm text-nest-charcoal">
                {calendarMonth === 'Oct' ? 'October 2026' : 'November 2026'}
              </span>
              <button
                onClick={() => setCalendarMonth('Nov')}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-slate-600"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Calendar Days Grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-7 text-center text-xs font-medium text-slate-400">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              
              <div className="grid grid-cols-7 text-center text-xs gap-y-2">
                <span className="text-slate-300">28</span>
                <span className="text-slate-300">29</span>
                <span className="text-slate-300">30</span>
                <span>1</span><span>2</span><span>3</span><span>4</span>
                <span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span>
                <span>12</span><span>13</span><span>14</span><span>15</span><span>16</span>
                {/* Active Date 17 with Mint Badge */}
                <span className="relative flex flex-col items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-nest-mint font-bold text-nest-mint-dark flex items-center justify-center">
                    17
                  </span>
                  <span className="w-1 h-1 rounded-full bg-nest-mint-dark mt-0.5" />
                </span>
                <span>18</span>
                <span>19</span><span>20</span>
                {/* Active Date 21 with Mint Badge */}
                <span className="relative flex flex-col items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-nest-mint font-bold text-nest-mint-dark flex items-center justify-center">
                    21
                  </span>
                  <span className="w-1 h-1 rounded-full bg-nest-mint-dark mt-0.5" />
                </span>
                <span>22</span><span>23</span>
                {/* Active Date 24 with Mint Badge */}
                <span className="relative flex flex-col items-center justify-center">
                  <span className="w-7 h-7 rounded-full bg-nest-mint font-bold text-nest-mint-dark flex items-center justify-center">
                    24
                  </span>
                  <span className="w-1 h-1 rounded-full bg-nest-mint-dark mt-0.5" />
                </span>
                <span>25</span>
                <span>26</span><span>27</span><span>28</span><span>29</span><span>30</span><span>31</span>
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-nest-mint" />
              <span>Ward action day · Indian Standard Time</span>
            </div>
          </div>

          {/* Right: Event List with Lavender Date Blocks */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Event 1 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/70">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-nest-lavender-light text-nest-lavender-dark flex flex-col items-center justify-center flex-shrink-0 font-bold">
                  <span className="text-[10px] uppercase tracking-wider">OCT</span>
                  <span className="text-xl leading-none">17</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    MEET & AUDIT
                  </div>
                  <h4 className="text-lg font-bold text-nest-charcoal">
                    Pothole patchwork audit & joint verification
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Bachupally X Roads · 10:00 AM IST</span>
                  </div>
                </div>
              </div>
              <Link
                to="/community-chat"
                className="px-6 py-2 rounded-full border border-gray-400 hover:border-nest-charcoal hover:bg-white text-nest-charcoal text-xs font-semibold self-start sm:self-center transition whitespace-nowrap flex items-center gap-1"
              >
                <span>View meetup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Event 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200/70">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-nest-lavender-light text-nest-lavender-dark flex flex-col items-center justify-center flex-shrink-0 font-bold">
                  <span className="text-[10px] uppercase tracking-wider">OCT</span>
                  <span className="text-xl leading-none">21</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    SAFETY WALK
                  </div>
                  <h4 className="text-lg font-bold text-nest-charcoal">
                    SafeRoute+ night lighting & path audit
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Silver Oaks Road · 07:30 PM IST</span>
                  </div>
                </div>
              </div>
              <Link
                to="/safe-route"
                className="px-6 py-2 rounded-full border border-gray-400 hover:border-nest-charcoal hover:bg-white text-nest-charcoal text-xs font-semibold self-start sm:self-center transition whitespace-nowrap flex items-center gap-1"
              >
                <span>View meetup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Event 3 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-nest-lavender-light text-nest-lavender-dark flex flex-col items-center justify-center flex-shrink-0 font-bold">
                  <span className="text-[10px] uppercase tracking-wider">OCT</span>
                  <span className="text-xl leading-none">24</span>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    OFFICER CIRCLE
                  </div>
                  <h4 className="text-lg font-bold text-nest-charcoal">
                    Ward officer monthly performance scorecard Q&A
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>GHMC Ward Office, Bachupally · 03:00 PM IST</span>
                  </div>
                </div>
              </div>
              <Link
                to="/scorecards"
                className="px-6 py-2 rounded-full border border-gray-400 hover:border-nest-charcoal hover:bg-white text-nest-charcoal text-xs font-semibold self-start sm:self-center transition whitespace-nowrap flex items-center gap-1"
              >
                <span>View meetup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Footer note matching Image 1 */}
            <p className="text-xs text-slate-500 pt-2">
              Our Bachupally civic village is active. These are community inspection meetups — join in person or participate via the discussion hub. No registration required.
            </p>
          </div>

        </div>
      </section>


      {/* 4. GUIDANCE & ACTIVE REPORTS - Matching Image 2 bottom */}
      <section className="space-y-6 pt-4">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              A LITTLE ACTION GOES A LONG WAY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-nest-charcoal tracking-tight">
              Guidance for your right now.
            </h2>
            <p className="text-sm text-slate-600">
              Thoughtful inspections. Verified evidence. No bureaucratic delay.
            </p>
          </div>

          <Link
            to="/reports"
            className="text-xs font-bold text-nest-charcoal hover:text-black flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Browse all {reports.length} reports</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Filter Pills with Lavender Active State */}
        <div className="flex items-center gap-2 flex-wrap">
          {['All', 'Road Hazards', 'Street Lighting', 'Water Supply', 'Sanitation'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-nest-lavender text-nest-lavender-dark font-bold shadow-xs'
                  : 'bg-white border border-gray-200 text-slate-600 hover:border-gray-400'
              }`}
            >
              {cat === 'All' ? 'All issues' : cat}
            </button>
          ))}
        </div>

        {/* Grid of Report Cards */}
        {displayReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {displayReports.map(report => (
              <ReportCard key={report.reportId} report={report} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-nest-charcoal">
                {selectedCategory === 'All'
                  ? 'No Community Reports Submitted Yet'
                  : `No ${selectedCategory} Issues Reported`}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isDemoMode
                  ? 'No demo issues match the selected category.'
                  : 'You are currently viewing the live website with zero demo data. You can submit the first issue or toggle Demo Data to explore.'}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/report/new"
                className="px-6 py-2.5 rounded-full bg-nest-charcoal hover:bg-black text-white font-semibold text-xs shadow-xs transition"
              >
                Report an Issue
              </Link>
              {!isDemoMode && (
                <button
                  type="button"
                  onClick={() => setDemoMode(true)}
                  className="px-5 py-2.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold text-xs transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Explore With Demo Data</span>
                </button>
              )}
            </div>
          </div>
        )}
      </section>


      {/* 5. INTERACTIVE MAP BANNER - Soft framed style */}
      <section className="bg-nest-charcoal text-white rounded-[32px] p-8 sm:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 text-nest-mint text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Interactive OpenStreetMap Lens</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore the Bachupally Community Hazard Map
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Inspect open potholes, broken sodium streetlights, and drainage risks plotted with live GPS coordinates across the Bachupally community.
          </p>
        </div>

        <Link
          to="/map"
          className="px-7 py-3.5 rounded-full bg-nest-mint hover:bg-[#C2E8D2] text-nest-mint-dark font-bold text-sm shadow-xs transition whitespace-nowrap flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-nest-mint-dark" />
          <span>Open community map</span>
        </Link>
      </section>

    </div>
  );
};