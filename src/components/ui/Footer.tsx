import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, ShieldAlert, Heart, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200/80 text-slate-600 text-sm pt-14 pb-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & SDG 11 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-nest-mint flex items-center justify-center text-nest-mint-dark">
                <MapPin className="w-4 h-4 text-nest-mint-dark" />
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-nest-charcoal text-xl tracking-tight">
                  civiclens
                </span>
                <span className="w-2 h-2 rounded-full bg-nest-lavender ml-1 mb-1" />
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed max-w-md">
              Community-centred civic reporting making local public infrastructure issues visible, accountable, and actionable in Bachupally, Hyderabad.
            </p>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-nest-mint/50 border border-[#BDE5D0] text-xs text-nest-mint-dark font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>Aligned with UN SDG 11: Sustainable Cities & Communities</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-nest-charcoal font-bold text-xs uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-nest-charcoal transition">Home Overview</Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-nest-charcoal transition">Interactive Issue Map</Link>
              </li>
              <li>
                <Link to="/safe-route" className="hover:text-nest-charcoal transition">SafeRoute+ Navigation</Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-nest-charcoal transition">All Community Reports</Link>
              </li>
              <li>
                <Link to="/community-wins" className="hover:text-nest-charcoal transition">Community Wins (Before/After)</Link>
              </li>
              <li>
                <Link to="/scorecards" className="hover:text-nest-charcoal transition">Ward Officer Scorecards</Link>
              </li>
              <li>
                <Link to="/community-chat" className="hover:text-nest-charcoal transition">Neighborhood Chat Hub</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Departments Covered */}
          <div className="space-y-3">
            <h4 className="text-nest-charcoal font-bold text-xs uppercase tracking-wider">
              Departments Covered
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nest-peach-dark" />
                <span>Roads & Pavement Infrastructure</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Electricity & Street Lighting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nest-mint-dark" />
                <span>Water Supply & Open Drains</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nest-lavender-dark" />
                <span>Traffic Signals & Crossings</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Sanitation & Solid Waste</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Footer Bottom */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-center md:text-left">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Deployment setup required:</strong> Reports and accounts are currently stored in this browser. Connect a shared backend before accepting public submissions.
            </span>
          </div>

          <div className="text-slate-400">
            CivicLens © 2026 · Made for Bachupally Community
          </div>
        </div>
      </div>
    </footer>
  );
};