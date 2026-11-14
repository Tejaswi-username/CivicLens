import { Report, ReportCategory, ReportFilterOptions, ReportStatus, MunicipalDepartment, StatusHistoryItem } from '../types/report';
import { storageService } from './storageService';
import { calculatePriorityScore } from '../utils/priority';
import { calculateDistanceInMeters } from '../utils/distance';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  existingReport: Report | null;
  distanceMeters: number;
}

export const reportService = {
  getAllReports(filters?: ReportFilterOptions): Report[] {
    let reports = storageService.getReports();

    // Dynamically update priority scores based on current elapsed days and proposed formula
    reports = reports.map(r => {
      const priority = calculatePriorityScore({
        safetyRisk: r.safetyRisk,
        injuryRisk: r.injuryRisk,
        nightRisk: r.nightRisk,
        accessibilityRisk: r.accessibilityRisk,
        waterloggingRisk: r.waterloggingRisk,
        confirmations: r.confirmations,
        createdAt: r.createdAt,
        locationSensitivity: r.locationSensitivity,
        category: r.category,
        description: r.description,
        status: r.status,
        resolvedAt: r.resolvedAt
      });
      return {
        ...r,
        priorityScore: priority.score,
        priorityLevel: priority.level,
        injuryRisk: priority.injuryRisk,
        nightRisk: priority.nightRisk,
        accessibilityRisk: priority.accessibilityRisk,
        waterloggingRisk: priority.waterloggingRisk
      };
    });

    if (!filters) return reports;

    if (filters.category && filters.category !== 'all') {
      reports = reports.filter(r => r.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      reports = reports.filter(r => r.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'all') {
      reports = reports.filter(r => r.priorityLevel === filters.priority);
    }

    if (filters.department && filters.department !== 'all') {
      reports = reports.filter(r => r.assignedDepartment === filters.department);
    }

    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      reports = reports.filter(r =>
        r.reportId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.landmark.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    }

    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      reports = reports.filter(r => {
        const reportTime = new Date(r.createdAt).getTime();
        const diff = now - reportTime;
        if (filters.dateRange === 'today') return diff <= oneDay;
        if (filters.dateRange === 'week') return diff <= 7 * oneDay;
        if (filters.dateRange === 'month') return diff <= 30 * oneDay;
        return true;
      });
    }

    if (filters.sortBy) {
      reports.sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filters.sortBy === 'priority') {
          // Resolved issues are not treated as currently open hazards in prioritisation
          const aIsFixed = a.status === 'Fixed';
          const bIsFixed = b.status === 'Fixed';
          if (aIsFixed !== bIsFixed) return aIsFixed ? 1 : -1;
          return b.priorityScore - a.priorityScore;
        }
        if (filters.sortBy === 'confirmations') {
          return b.confirmations - a.confirmations;
        }
        return 0;
      });
    }

    return reports;
  },

  getReportById(reportId: string): Report | undefined {
    const reports = storageService.getReports();
    return reports.find(r => r.reportId === reportId);
  },

  getMyReports(userId: string): Report[] {
    const reports = storageService.getReports();
    return reports.filter(r => r.userId === userId);
  },

  getNearbyReports(latitude: number, longitude: number, maxMeters = 5000): Array<Report & { distanceMeters: number }> {
    const reports = storageService.getReports();
    return reports
      .map(r => ({
        ...r,
        distanceMeters: calculateDistanceInMeters(latitude, longitude, r.latitude, r.longitude)
      }))
      .filter(r => r.distanceMeters <= maxMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  },

  /**
   * Duplicate detection rule:
   * - Only consider the same category.
   * - Calculate geographical distance between coordinates.
   * - If an open existing report is within 40 metres, flag duplicate.
   */
  checkDuplicates(
    latitude: number,
    longitude: number,
    category: ReportCategory,
    thresholdMeters = 40
  ): DuplicateCheckResult {
    const reports = storageService.getReports();
    const activeReports = reports.filter(r => r.status !== 'Fixed' && r.category === category);

    let closest: Report | null = null;
    let minDistance = Infinity;

    for (const report of activeReports) {
      const dist = calculateDistanceInMeters(latitude, longitude, report.latitude, report.longitude);
      if (dist <= thresholdMeters && dist < minDistance) {
        minDistance = dist;
        closest = report;
      }
    }

    if (closest) {
      return {
        isDuplicate: true,
        existingReport: closest,
        distanceMeters: minDistance
      };
    }

    return {
      isDuplicate: false,
      existingReport: null,
      distanceMeters: 0
    };
  },

  createReport(params: {
    userId: string;
    userName: string;
    category: ReportCategory;
    description: string;
    photoUrl: string;
    latitude: number;
    longitude: number;
    landmark: string;
    safetyRisk: 1 | 2 | 3;
    injuryRisk?: 1 | 2 | 3;
    nightRisk?: 1 | 2 | 3;
    accessibilityRisk?: 1 | 2 | 3;
    waterloggingRisk?: 1 | 2 | 3;
    locationSensitivity: 1 | 2 | 3;
  }): Report {
    const reports = storageService.getReports();
    const now = new Date();

    // Generate unique readable Report ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reportId = `REP-HYD-${randomSuffix}`;

    const priority = calculatePriorityScore({
      safetyRisk: params.safetyRisk,
      injuryRisk: params.injuryRisk,
      nightRisk: params.nightRisk,
      accessibilityRisk: params.accessibilityRisk,
      waterloggingRisk: params.waterloggingRisk,
      confirmations: 0, // Initially 0 confirmations
      createdAt: now,
      locationSensitivity: params.locationSensitivity,
      category: params.category,
      description: params.description,
      status: 'Reported'
    });

    const historyItem: StatusHistoryItem = {
      id: `hist-${reportId}-1`,
      status: 'Reported',
      changedBy: params.userName,
      role: 'Citizen',
      timestamp: now.toISOString(),
      note: 'Issue reported by citizen with photo and GPS location coordinates.'
    };

    const newReport: Report = {
      reportId,
      userId: params.userId,
      userName: params.userName,
      category: params.category,
      description: params.description,
      photoUrl: params.photoUrl,
      latitude: params.latitude,
      longitude: params.longitude,
      landmark: params.landmark,
      status: 'Reported',
      priorityScore: priority.score,
      priorityLevel: priority.level,
      safetyRisk: params.safetyRisk,
      injuryRisk: priority.injuryRisk,
      nightRisk: priority.nightRisk,
      accessibilityRisk: priority.accessibilityRisk,
      waterloggingRisk: priority.waterloggingRisk,
      locationSensitivity: params.locationSensitivity,
      confirmations: 0,
      confirmedBy: [],
      assignedDepartment: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      statusHistory: [historyItem],
      isDemoData: false
    };

    const updatedReports = [newReport, ...reports];
    storageService.saveReports(updatedReports);
    return newReport;
  },

  /**
   * Community Confirmation:
   * "I also face this issue"
   * - Prevents duplicate confirmation by the same citizen identity.
   * - Increases confirmation count.
   * - Recalculates priority score.
   * - If confirmations reaches 3, automatically updates status to Verified.
   */
  confirmReport(
    reportId: string,
    userId: string,
    userName: string
  ): { success: boolean; message: string; report?: Report } {
    const reports = storageService.getReports();
    const reportIndex = reports.findIndex(r => r.reportId === reportId);

    if (reportIndex === -1) {
      return { success: false, message: 'Report not found' };
    }

    const report = reports[reportIndex];

    if (report.confirmedBy.includes(userId)) {
      return {
        success: false,
        message: 'You have already confirmed this issue.',
        report
      };
    }

    const updatedConfirmedBy = [...report.confirmedBy, userId];
    const updatedConfirmations = report.confirmations + 1;

    // Recalculate priority
    const priority = calculatePriorityScore({
      safetyRisk: report.safetyRisk,
      injuryRisk: report.injuryRisk,
      nightRisk: report.nightRisk,
      accessibilityRisk: report.accessibilityRisk,
      waterloggingRisk: report.waterloggingRisk,
      confirmations: updatedConfirmations,
      createdAt: report.createdAt,
      locationSensitivity: report.locationSensitivity,
      category: report.category,
      description: report.description,
      status: report.status
    });

    let newStatus = report.status;
    const history = [...report.statusHistory];

    // Check automatic community verification threshold
    if (updatedConfirmations >= 3 && report.status === 'Reported') {
      newStatus = 'Verified';
      history.push({
        id: `hist-${report.reportId}-${Date.now()}`,
        status: 'Verified',
        changedBy: 'Civic Community Consensus',
        role: 'System',
        timestamp: new Date().toISOString(),
        note: `Verified automatically after receiving ${updatedConfirmations} citizen confirmations.`
      });
    }

    const updatedReport: Report = {
      ...report,
      confirmations: updatedConfirmations,
      confirmedBy: updatedConfirmedBy,
      priorityScore: priority.score,
      priorityLevel: priority.level,
      status: newStatus,
      statusHistory: history,
      updatedAt: new Date().toISOString()
    };

    reports[reportIndex] = updatedReport;
    storageService.saveReports(reports);

    return {
      success: true,
      message: 'Thank you for confirming this issue! Priority recalculated.',
      report: updatedReport
    };
  },

  assignDepartment(
    reportId: string,
    department: MunicipalDepartment,
    adminName: string
  ): Report | null {
    const reports = storageService.getReports();
    const index = reports.findIndex(r => r.reportId === reportId);
    if (index === -1) return null;

    const report = reports[index];
    const now = new Date().toISOString();

    const historyItem: StatusHistoryItem = {
      id: `hist-${report.reportId}-${Date.now()}`,
      status: 'Assigned',
      changedBy: adminName,
      role: 'Admin',
      timestamp: now,
      note: `Assigned to ${department} for field inspection and maintenance dispatch.`
    };

    const updated: Report = {
      ...report,
      assignedDepartment: department,
      status: report.status === 'Reported' || report.status === 'Verified' ? 'Assigned' : report.status,
      statusHistory: [...report.statusHistory, historyItem],
      updatedAt: now
    };

    reports[index] = updated;
    storageService.saveReports(reports);
    return updated;
  },

  updateStatus(
    reportId: string,
    newStatus: ReportStatus,
    changedBy: string,
    role: 'Admin' | 'Citizen',
    note?: string,
    resolutionPhotoUrl?: string
  ): Report | null {
    const reports = storageService.getReports();
    const index = reports.findIndex(r => r.reportId === reportId);
    if (index === -1) return null;

    const report = reports[index];
    const now = new Date().toISOString();

    // Validation: cannot mark Fixed without resolution photo
    if (newStatus === 'Fixed' && !resolutionPhotoUrl && !report.resolutionPhotoUrl) {
      throw new Error('Resolution photo evidence is required before marking an issue as Fixed.');
    }

    // Validation: department required before moving to Assigned
    if (newStatus === 'Assigned' && !report.assignedDepartment) {
      throw new Error('Department must be assigned before updating status to Assigned.');
    }

    const historyItem: StatusHistoryItem = {
      id: `hist-${report.reportId}-${Date.now()}`,
      status: newStatus,
      changedBy,
      role,
      timestamp: now,
      note: note || `Status updated to ${newStatus}`,
      resolutionPhotoUrl: resolutionPhotoUrl || (newStatus === 'Fixed' ? report.resolutionPhotoUrl : undefined)
    };

    const resolvedAtDate = newStatus === 'Fixed' ? now : report.resolvedAt;
    const priority = calculatePriorityScore({
      safetyRisk: report.safetyRisk,
      injuryRisk: report.injuryRisk,
      nightRisk: report.nightRisk,
      accessibilityRisk: report.accessibilityRisk,
      waterloggingRisk: report.waterloggingRisk,
      confirmations: report.confirmations,
      createdAt: report.createdAt,
      locationSensitivity: report.locationSensitivity,
      category: report.category,
      description: report.description,
      status: newStatus,
      resolvedAt: resolvedAtDate
    });

    const updated: Report = {
      ...report,
      status: newStatus,
      priorityScore: priority.score,
      priorityLevel: priority.level,
      resolutionPhotoUrl: resolutionPhotoUrl || report.resolutionPhotoUrl,
      resolvedAt: resolvedAtDate,
      statusHistory: [...report.statusHistory, historyItem],
      updatedAt: now
    };

    reports[index] = updated;
    storageService.saveReports(reports);
    return updated;
  },

  reopenReport(
    reportId: string,
    reason: string,
    citizenName: string
  ): Report | null {
    const reports = storageService.getReports();
    const index = reports.findIndex(r => r.reportId === reportId);
    if (index === -1) return null;

    const report = reports[index];
    const now = new Date().toISOString();

    const historyItem: StatusHistoryItem = {
      id: `hist-${report.reportId}-${Date.now()}`,
      status: 'Reopened',
      changedBy: citizenName,
      role: 'Citizen',
      timestamp: now,
      note: `Reopened by citizen. Reason: ${reason}`
    };

    const updated: Report = {
      ...report,
      status: 'Reopened',
      reopenReason: reason,
      statusHistory: [...report.statusHistory, historyItem],
      updatedAt: now
    };

    reports[index] = updated;
    storageService.saveReports(reports);
    return updated;
  },

  escalateReport(
    reportId: string,
    escalatedBy: string,
    role: 'Admin' | 'Citizen' = 'Citizen',
    reason?: string
  ): Report | null {
    const reports = storageService.getReports();
    const index = reports.findIndex(r => r.reportId === reportId);
    if (index === -1) return null;

    const report = reports[index];
    const now = new Date().toISOString();

    const note = reason
      ? `🚨 Emergency Escalation logged by ${escalatedBy}. Reason: ${reason}. Escalation alert dispatched to Zonal Municipal Commissioner.`
      : `🚨 Emergency SLA Escalation logged by ${escalatedBy}. Safety SLA threshold breached. Official alert served to Zonal Commissioner & Ward Council.`;

    const historyItem: StatusHistoryItem = {
      id: `hist-${report.reportId}-${Date.now()}`,
      status: report.status,
      changedBy: escalatedBy,
      role,
      timestamp: now,
      note
    };

    const updated: Report = {
      ...report,
      isEscalated: true,
      escalatedAt: now,
      escalationReason: reason || 'SLA Threshold Exceeded / Critical Risk',
      statusHistory: [...report.statusHistory, historyItem],
      updatedAt: now
    };

    reports[index] = updated;
    storageService.saveReports(reports);
    return updated;
  },

  resetDemoData(): Report[] {
    return storageService.resetToDefaultSeed();
  }
};
