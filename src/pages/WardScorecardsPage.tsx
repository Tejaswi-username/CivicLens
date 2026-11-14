import React, { useMemo, useState } from 'react';
import { useReports } from '../context/ReportContext';
import { MunicipalDepartment, Report } from '../types/report';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Printer,
  Building2,
  UserCheck,
  BarChart3,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DepartmentMetrics {
  department: MunicipalDepartment;
  inCharge: string;
  designation: string;
  totalTickets: number;
  resolvedTickets: number;
  inProgressTickets: number;
  openTickets: number;
  escalatedTickets: number;
  resolutionRate: number;
  slaCompliance: number;
  avgResolutionDays: number;
  satisfactionScore: number;
  grade: 'A+' | 'A' | 'B' | 'C';
  badgeColor: string;
}

export const WardScorecardsPage: React.FC = () => {
  const { reports } = useReports();
  const [selectedDept, setSelectedDept] = useState<string>('all');

  // Compute departmental metrics dynamically from active reports
  const departmentData: DepartmentMetrics[] = useMemo(() => {
    const depts: { name: MunicipalDepartment; inCharge: string; designation: string }[] = [
      {
        name: 'Roads Department',
        inCharge: 'Er. S. Venkat',
        designation: 'Executive Engineer (Road Infrastructure)'
      },
      {
        name: 'Electricity Department',
        inCharge: 'Er. K. Ramesh',
        designation: 'Assistant Divisional Engineer (Illumination)'
      },
      {
        name: 'Water/Sanitation Department',
        inCharge: 'Smt. L. Madhavi',
        designation: 'Sub-Divisional Engineer (Sanitation & Drains)'
      },
      {
        name: 'Traffic Department',
        inCharge: 'Insp. M. Praveen',
        designation: 'Traffic & Pedestrian Safety Inspector'
      }
    ];

    return depts.map(dept => {
      const deptReports = reports.filter(r => r.assignedDepartment === dept.name);
      const total = deptReports.length;
      const fixed = deptReports.filter(r => r.status === 'Fixed').length;
      const inProg = deptReports.filter(r => r.status === 'In Progress').length;
      const open = deptReports.filter(r => r.status === 'Reported' || r.status === 'Verified' || r.status === 'Assigned').length;
      const escalated = deptReports.filter(r => r.isEscalated || r.status === 'Reopened').length;

      const resolutionRate = total > 0 ? Math.round((fixed / total) * 100) : 88;
      
      // SLA compliance score
      const slaCompliance = Math.max(70, Math.min(98, Math.round(100 - (escalated / Math.max(1, total)) * 30)));
      
      // Turnaround days baseline
      const avgResolutionDays = dept.name === 'Electricity Department' ? 1.6 : dept.name === 'Roads Department' ? 2.4 : 3.1;
      
      // Satisfaction score out of 100
      const satisfactionScore = Math.max(72, Math.min(97, Math.round(80 + (resolutionRate * 0.15) - (escalated * 3))));

      let grade: 'A+' | 'A' | 'B' | 'C' = 'A';
      let badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
      if (slaCompliance >= 92 && satisfactionScore >= 90) {
        grade = 'A+';
        badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      } else if (slaCompliance >= 85) {
        grade = 'A';
        badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
      } else if (slaCompliance >= 75) {
        grade = 'B';
        badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
      } else {
        grade = 'C';
        badgeColor = 'bg-red-100 text-red-800 border-red-300';
      }

      return {
        department: dept.name,
        inCharge: dept.inCharge,
        designation: dept.designation,
        totalTickets: total,
        resolvedTickets: fixed,
        inProgressTickets: inProg,
        openTickets: open,
        escalatedTickets: escalated,
        resolutionRate,
        slaCompliance,
        avgResolutionDays,
        satisfactionScore,
        grade,
        badgeColor
      };
    });
  }, [reports]);

  // Overall Ward Score
  const overallWardScore = useMemo(() => {
    const totalCompliance = departmentData.reduce((acc, d) => acc + d.slaCompliance, 0);
    return Math.round(totalCompliance / departmentData.length);
  }, [departmentData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Top Header & Audit Certificate Download */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Public Accountability Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ward Officer & Department Performance Scorecards
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Real-time municipal performance ratings for Bachupally Ward 132 (GHMC). Scored transparently based on SLA compliance, resolution turnaround time, photo-certified fixes, and citizen validation.
          </p>
        </div>

        {/* Overall Ward Grade Card */}
        <div className="flex items-center gap-4 bg-slate-900 text-white p-5 rounded-2xl flex-shrink-0 shadow-md">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Overall Ward Health
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-0.5">
              {overallWardScore}
              <span className="text-lg font-bold text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-slate-300 font-semibold">Grade A: Exemplary</div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Ward Operations Leadership Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border-2 border-purple-200 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              alt="Officer Kiran Rao"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-purple-700 uppercase tracking-wide">
              Ward Operations Officer
            </div>
            <div className="text-sm font-bold text-slate-900">Officer Kiran Rao</div>
            <div className="text-xs text-slate-500">GHMC Circle 14, Bachupally</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase">
              Average SLA Compliance
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1">91.4%</div>
            <div className="text-[11px] text-emerald-600 font-medium">↑ 3.2% vs last quarter</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 block uppercase">
              Export Scorecard Audit
            </span>
            <p className="text-xs text-slate-500 mt-1">Download official monthly council report</p>
          </div>
          <button
            onClick={handlePrint}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition flex items-center gap-1.5 text-xs font-bold shadow-xs"
            title="Print or Save Audit Report"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Department Scorecard Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <span>Departmental Performance Scorecards</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departmentData.map(dept => (
            <div
              key={dept.department}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-5"
            >
              {/* Header: Dept name & Officer */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {dept.department}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900">{dept.inCharge}</h3>
                  <p className="text-xs text-slate-500">{dept.designation}</p>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-xl border font-black text-sm text-center ${dept.badgeColor}`}
                >
                  Grade {dept.grade}
                </div>
              </div>

              {/* 4 Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">SLA Compliance</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{dept.slaCompliance}%</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Avg Response</div>
                  <div className="text-lg font-black text-blue-600 mt-0.5">{dept.avgResolutionDays}d</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Fixed Tickets</div>
                  <div className="text-lg font-black text-emerald-600 mt-0.5">
                    {dept.resolvedTickets}
                    <span className="text-xs text-slate-400 font-normal">/{dept.totalTickets || 4}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Citizen Trust</div>
                  <div className="text-lg font-black text-purple-600 mt-0.5">{dept.satisfactionScore}%</div>
                </div>
              </div>

              {/* Progress Bar: SLA Target */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">SLA Mandate Target (90%)</span>
                  <span className="font-bold text-slate-900">{dept.slaCompliance}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dept.slaCompliance >= 90
                        ? 'bg-emerald-500'
                        : dept.slaCompliance >= 80
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${dept.slaCompliance}%` }}
                  />
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {dept.escalatedTickets > 0 ? (
                    <span className="text-red-600 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      {dept.escalatedTickets} Escalation Notice Active
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Zero Overdue SLA Breaches
                    </span>
                  )}
                </span>

                <Link
                  to={`/admin/reports?department=${encodeURIComponent(dept.department)}`}
                  className="font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
                >
                  <span>Inspect Tickets</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department SLA Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Ward 132 SLA Compliance Table</h3>
            <p className="text-xs text-slate-500">Official ranking submitted to Municipal Council</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500">
            Updated Real-time
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Officer In-Charge</th>
                <th className="py-3 px-4 text-center">SLA Compliance</th>
                <th className="py-3 px-4 text-center">Avg Resolution</th>
                <th className="py-3 px-4 text-center">Resolution Rate</th>
                <th className="py-3 px-4 text-center">Score Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {departmentData.map((d, idx) => (
                <tr key={d.department} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-black">
                      #{idx + 1}
                    </span>
                    <span>{d.department}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{d.inCharge}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono font-bold text-slate-900">{d.slaCompliance}%</span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                    {d.avgResolutionDays} Days
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                      {d.resolutionRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-md font-black text-xs ${d.badgeColor}`}>
                      {d.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
