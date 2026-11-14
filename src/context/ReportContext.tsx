import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Report, ReportCategory, ReportStatus, MunicipalDepartment } from '../types/report';
import { reportService } from '../services/reportService';
import { notificationService } from '../services/notificationService';

interface ToastNotification {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}

interface ReportContextType {
  reports: Report[];
  allReports: Report[];
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (enabled: boolean) => void;
  demoReportsCount: number;
  userReportsCount: number;
  loading: boolean;
  toasts: ToastNotification[];
  refreshReports: () => void;
  createReport: (params: {
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
  }) => Report;
  confirmReport: (reportId: string, userId: string, userName: string) => { success: boolean; message: string; report?: Report };
  assignDepartment: (reportId: string, department: MunicipalDepartment, adminName: string) => Report | null;
  updateStatus: (
    reportId: string,
    newStatus: ReportStatus,
    changedBy: string,
    role: 'Admin' | 'Citizen',
    note?: string,
    resolutionPhotoUrl?: string
  ) => Report | null;
  reopenReport: (reportId: string, reason: string, citizenName: string) => Report | null;
  escalateReport: (reportId: string, escalatedBy: string, role?: 'Admin' | 'Citizen', reason?: string) => Report | null;
  resetDemoData: () => void;
  getReportById: (reportId: string) => Report | undefined;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isDemoMode] = useState<boolean>(false); // Live-only build: demo mode is disabled.
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const refreshReports = useCallback(() => {
    const list = reportService.getAllReports();
    setAllReports(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const setDemoMode = useCallback((_enabled: boolean) => undefined, []);

  const toggleDemoMode = useCallback(() => undefined, []);

  // When isDemoMode is false, only show real non-demo user reports
  // When isDemoMode is true, show all reports (including 20 seed reports)
  const reports = allReports.filter(r => !r.isDemoData);
  const demoReportsCount = allReports.filter(r => r.isDemoData).length;
  const userReportsCount = allReports.filter(r => !r.isDemoData).length;

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const createReport = (params: Parameters<typeof reportService.createReport>[0]) => {
    const newReport = reportService.createReport(params);
    refreshReports();
    // Admin Notification — New Issue Reported
    notificationService.notifyAdminNewReport(newReport);
    showToast(`Report ${newReport.reportId} successfully submitted!`, 'success');
    return newReport;
  };

  const confirmReport = (reportId: string, userId: string, userName: string) => {
    const result = reportService.confirmReport(reportId, userId, userName);
    refreshReports();
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'info');
    }
    return result;
  };

  const assignDepartment = (reportId: string, department: MunicipalDepartment, adminName: string) => {
    const res = reportService.assignDepartment(reportId, department, adminName);
    refreshReports();
    if (res) {
      showToast(`Assigned report to ${department}`, 'success');
    }
    return res;
  };

  const updateStatus = (
    reportId: string,
    newStatus: ReportStatus,
    changedBy: string,
    role: 'Admin' | 'Citizen',
    note?: string,
    resolutionPhotoUrl?: string
  ) => {
    try {
      const res = reportService.updateStatus(reportId, newStatus, changedBy, role, note, resolutionPhotoUrl);
      refreshReports();
      // User Notification — Issue Fixed (Notify original reporting citizen)
      if (newStatus === 'Fixed' && res) {
        notificationService.notifyUserIssueFixed(res);
      }
      showToast(`Status updated to "${newStatus}"`, 'success');
      return res;
    } catch (e: any) {
      showToast(e.message || 'Status update failed', 'error');
      throw e;
    }
  };

  const reopenReport = (reportId: string, reason: string, citizenName: string) => {
    const res = reportService.reopenReport(reportId, reason, citizenName);
    refreshReports();
    if (res) {
      showToast(`Report ${reportId} reopened for municipal re-inspection`, 'info');
    }
    return res;
  };

  const escalateReport = (reportId: string, escalatedBy: string, role: 'Admin' | 'Citizen' = 'Citizen', reason?: string) => {
    const res = reportService.escalateReport(reportId, escalatedBy, role, reason);
    refreshReports();
    if (res) {
      showToast(`🚨 Issue ${reportId} officially escalated to Zonal Commissioner!`, 'error');
    }
    return res;
  };

  const resetDemoData = () => {
    reportService.resetDemoData();
    refreshReports();
    showToast('Local reports cleared.', 'info');
  };

  const getReportById = (reportId: string) => {
    return reports.find(r => r.reportId === reportId) || allReports.find(r => r.reportId === reportId);
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        allReports,
        isDemoMode,
        toggleDemoMode,
        setDemoMode,
        demoReportsCount,
        userReportsCount,
        loading,
        toasts,
        refreshReports,
        createReport,
        confirmReport,
        assignDepartment,
        updateStatus,
        reopenReport,
        escalateReport,
        resetDemoData,
        getReportById,
        showToast,
        dismissToast
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = (): ReportContextType => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
