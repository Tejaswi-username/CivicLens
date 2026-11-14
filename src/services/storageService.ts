import { Report } from '../types/report';
import { User, DemoAccount } from '../types/user';
import { SEED_REPORTS } from '../data/seedReports';
import { getAppropriateWebImage } from '../utils/imageUtils';

const STORAGE_KEYS = {
  REPORTS: 'civiclens_reports_v2_bachupally',
  CURRENT_USER: 'civiclens_current_user_v1',
  LANGUAGE: 'civiclens_language_v1'
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'user_priya',
    name: 'Priya Sharma',
    email: 'priya.sharma@civiclens.demo',
    role: 'Citizen',
    description: 'Active Community Reporter (Bachupally / VNR VJIET area)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'user_rahul',
    name: 'Rahul Verma',
    email: 'rahul.verma@civiclens.demo',
    role: 'Citizen',
    description: 'Citizen Advocate & Resident (Silver Oaks Corridor, Bachupally)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'user_ananya',
    name: 'Ananya Reddy',
    email: 'ananya.reddy@civiclens.demo',
    role: 'Citizen',
    description: 'Student & Pedestrian Safety Campaigner (Bachupally Community)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'admin_kiran_01',
    name: 'Officer Kiran Rao',
    email: 'admin.kiran@ghmc.gov.in.demo',
    role: 'Admin',
    description: 'Bachupally Ward Operations Officer (GHMC Circle)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  }
];

export const GUEST_USER: User = {
  userId: 'user_guest',
  name: 'Guest Citizen',
  email: 'guest@civiclens.demo',
  role: 'Guest',
  reportsCount: 0,
  createdAt: new Date().toISOString()
};

export const storageService = {
  // Initialize seed reports if empty, and heal any empty image paths
  getReports(): Report[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
        return SEED_REPORTS;
      }
      const parsed: Report[] = JSON.parse(stored);
      let healed = false;
      const seedMap = new Map(SEED_REPORTS.map((s) => [s.reportId, s]));
      const reports = parsed.map((r) => {
        const seed = seedMap.get(r.reportId);
        // Sync demo reports with the latest authentic photos
        if (seed && (r.isDemoData || r.photoUrl.includes('unsplash.com') || r.photoUrl.includes('telegraphindia') || r.photoUrl.includes('gstatic.com') || r.photoUrl.includes('sphdigital') || r.photoUrl.startsWith('http://') || r.photoUrl.startsWith('https://'))) {
          healed = true;
          return {
            ...r,
            photoUrl: seed.photoUrl,
            resolutionPhotoUrl: seed.resolutionPhotoUrl || r.resolutionPhotoUrl
          };
        }
        if (!r.photoUrl || r.photoUrl.trim() === '' || r.photoUrl === 'undefined') {
          healed = true;
          return {
            ...r,
            photoUrl: getAppropriateWebImage(r.category, r.description)
          };
        }
        return r;
      });
      if (healed) {
        localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
      }
      return reports;
    } catch (e) {
      console.error('Failed to read reports from storage, fallback to seed', e);
      return SEED_REPORTS;
    }
  },

  saveReports(reports: Report[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    } catch (e) {
      console.error('Failed to save reports to localStorage', e);
    }
  },

  resetToDefaultSeed(): Report[] {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(SEED_REPORTS));
      return SEED_REPORTS;
    } catch (e) {
      console.error('Failed to reset seed reports', e);
      return SEED_REPORTS;
    }
  },

  getCurrentUser(): User {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse current user', e);
    }
    // Default to citizen Priya for smooth experience
    const defaultUser: User = {
      userId: DEMO_ACCOUNTS[0].id,
      name: DEMO_ACCOUNTS[0].name,
      email: DEMO_ACCOUNTS[0].email,
      role: 'Citizen',
      reportsCount: 4,
      createdAt: '2026-01-15T10:00:00.000Z',
      avatarUrl: DEMO_ACCOUNTS[0].avatar
    };
    this.saveCurrentUser(defaultUser);
    return defaultUser;
  },

  saveCurrentUser(user: User): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save current user', e);
    }
  },

  clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};
