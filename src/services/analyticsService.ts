import { Report } from '../types/report';

export interface AnalyticsSummary {
  totalReports: number;
  openReports: number;
  inProgressReports: number;
  fixedReports: number;
  reopenedReports: number;
  highPriorityReports: number;
  mediumPriorityReports: number;
  lowPriorityReports: number;
  resolutionRate: number; // percentage
  avgResolutionDays: number | null;
  categoryDistribution: { name: string; count: number }[];
  statusDistribution: { name: string; count: number; color: string }[];
  priorityDistribution: { name: string; count: number; color: string }[];
  departmentWorkload: { department: string; open: number; resolved: number; total: number }[];
  timelineData: { date: string; reports: number; resolved: number }[];
  recentResolved: Report[];
}

export const analyticsService = {
  calculateAnalytics(reports: Report[]): AnalyticsSummary {
    const totalReports = reports.length;
    if (totalReports === 0) {
      return {
        totalReports: 0,
        openReports: 0,
        inProgressReports: 0,
        fixedReports: 0,
        reopenedReports: 0,
        highPriorityReports: 0,
        mediumPriorityReports: 0,
        lowPriorityReports: 0,
        resolutionRate: 0,
        avgResolutionDays: null,
        categoryDistribution: [],
        statusDistribution: [],
        priorityDistribution: [],
        departmentWorkload: [],
        timelineData: [],
        recentResolved: []
      };
    }

    const openReports = reports.filter(r => r.status !== 'Fixed').length;
    const inProgressReports = reports.filter(r => r.status === 'In Progress').length;
    const fixedReports = reports.filter(r => r.status === 'Fixed').length;
    const reopenedReports = reports.filter(r => r.status === 'Reopened').length;

    const highPriorityReports = reports.filter(r => r.priorityLevel === 'High').length;
    const mediumPriorityReports = reports.filter(r => r.priorityLevel === 'Medium').length;
    const lowPriorityReports = reports.filter(r => r.priorityLevel === 'Low').length;

    const resolutionRate = totalReports > 0 ? Math.round((fixedReports / totalReports) * 100) : 0;

    // Average resolution time calculated only for reports with valid resolution timestamps
    const resolvedWithTimes = reports.filter(r => r.status === 'Fixed' && r.resolvedAt && r.createdAt);
    let avgResolutionDays: number | null = null;
    if (resolvedWithTimes.length > 0) {
      const totalResolutionMs = resolvedWithTimes.reduce((acc, r) => {
        const created = new Date(r.createdAt).getTime();
        const resolved = new Date(r.resolvedAt!).getTime();
        return acc + Math.max(0, resolved - created);
      }, 0);
      const avgMs = totalResolutionMs / resolvedWithTimes.length;
      avgResolutionDays = parseFloat((avgMs / (1000 * 60 * 60 * 24)).toFixed(1));
    }

    // Category Distribution
    const catMap: Record<string, number> = {};
    reports.forEach(r => {
      catMap[r.category] = (catMap[r.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(catMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    // Status Distribution
    const statusColors: Record<string, string> = {
      Reported: '#94a3b8',
      Verified: '#3b82f6',
      Assigned: '#8b5cf6',
      'In Progress': '#f59e0b',
      Fixed: '#10b981',
      Reopened: '#ef4444'
    };
    const statusMap: Record<string, number> = {
      Reported: 0,
      Verified: 0,
      Assigned: 0,
      'In Progress': 0,
      Fixed: 0,
      Reopened: 0
    };
    reports.forEach(r => {
      if (statusMap[r.status] !== undefined) {
        statusMap[r.status]++;
      }
    });
    const statusDistribution = Object.entries(statusMap).map(([name, count]) => ({
      name,
      count,
      color: statusColors[name] || '#64748b'
    }));

    // Priority Distribution
    const priorityDistribution = [
      { name: 'High', count: highPriorityReports, color: '#ef4444' },
      { name: 'Medium', count: mediumPriorityReports, color: '#f59e0b' },
      { name: 'Low', count: lowPriorityReports, color: '#94a3b8' }
    ];

    // Department Workload
    const departments = [
      'Roads Department',
      'Electricity Department',
      'Water/Sanitation Department',
      'Traffic Department',
      'Other'
    ];
    const departmentWorkload = departments.map(dept => {
      const deptReports = reports.filter(r => r.assignedDepartment === dept);
      const open = deptReports.filter(r => r.status !== 'Fixed').length;
      const resolved = deptReports.filter(r => r.status === 'Fixed').length;
      return {
        department: dept.replace(' Department', ''),
        open,
        resolved,
        total: deptReports.length
      };
    });

    // Timeline Data (Group by days/weeks)
    const timelineMap: Record<string, { reports: number; resolved: number }> = {};
    // Last 14 days dates
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      timelineMap[key] = { reports: 0, resolved: 0 };
    }
    reports.forEach(r => {
      const d = new Date(r.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (timelineMap[key]) {
        timelineMap[key].reports++;
      }
      if (r.resolvedAt) {
        const resD = new Date(r.resolvedAt);
        const resKey = resD.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (timelineMap[resKey]) {
          timelineMap[resKey].resolved++;
        }
      }
    });
    const timelineData = Object.entries(timelineMap).map(([date, val]) => ({
      date,
      reports: val.reports,
      resolved: val.resolved
    }));

    // Recent Resolved Reports
    const recentResolved = reports
      .filter(r => r.status === 'Fixed')
      .sort((a, b) => {
        const timeA = a.resolvedAt ? new Date(a.resolvedAt).getTime() : 0;
        const timeB = b.resolvedAt ? new Date(b.resolvedAt).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 5);

    return {
      totalReports,
      openReports,
      inProgressReports,
      fixedReports,
      reopenedReports,
      highPriorityReports,
      mediumPriorityReports,
      lowPriorityReports,
      resolutionRate,
      avgResolutionDays,
      categoryDistribution,
      statusDistribution,
      priorityDistribution,
      departmentWorkload,
      timelineData,
      recentResolved
    };
  }
};
