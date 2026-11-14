import { Report } from '../types/report';
import { User, DemoAccount } from '../types/user';

const STORAGE_KEYS = {
  REPORTS: 'civiclens_reports_v2_bachupally',
  CURRENT_USER: 'civiclens_current_user_v1'
};

// No seeded personas or sample reports are loaded in the live-only build.
export const DEMO_ACCOUNTS: DemoAccount[] = [];
export const GUEST_USER: User = {
  userId: 'user_guest',
  name: 'Guest Citizen',
  email: '',
  role: 'Guest',
  reportsCount: 0,
  createdAt: new Date().toISOString()
};

export const storageService = {
  getReports(): Report[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (!stored) return [];
      const reports: Report[] = JSON.parse(stored);
      const liveReports = reports.filter(report => !report.isDemoData);
      if (liveReports.length !== reports.length) this.saveReports(liveReports);
      return liveReports;
    } catch (error) {
      console.error('Failed to read reports from browser storage', error);
      return [];
    }
  },
  saveReports(reports: Report[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports.filter(report => !report.isDemoData)));
    } catch (error) {
      console.error('Failed to save reports to browser storage', error);
    }
  },
  resetToDefaultSeed(): Report[] {
    this.saveReports([]);
    return [];
  },
  getCurrentUser(): User {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse current user', error);
    }
    return GUEST_USER;
  },
  saveCurrentUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save current user', error);
    }
  },
  clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};
