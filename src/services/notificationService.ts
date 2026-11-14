import { AppNotification } from '../types/notification';
import { Report } from '../types/report';
import { User } from '../types/user';

const STORAGE_KEY = 'civiclens_notifications_v1';

// Initial demonstration notifications for seed testability
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-new-REP-HYD-1001',
    type: 'NEW_REPORT',
    recipientRole: 'Admin',
    reportId: 'REP-HYD-1001',
    title: 'New Issue Reported: Pothole',
    category: 'Pothole',
    location: 'Opposite Care Hospital, Banjara Hills Road No. 12',
    riskLevel: 'High',
    riskScore: 89,
    message: 'A new Pothole has been reported at Opposite Care Hospital, Banjara Hills Road No. 12 (High Risk).',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/admin/reports/REP-HYD-1001'
  },
  {
    id: 'notif-fixed-REP-HYD-1014',
    type: 'ISSUE_FIXED',
    recipientUserId: 'user_priya',
    reportId: 'REP-HYD-1014',
    title: 'Issue Fixed: Pothole',
    category: 'Pothole',
    location: 'Banjara Hills Road No. 1, near Taj Krishna',
    riskLevel: 'Low',
    riskScore: 28,
    message: 'Your reported issue "Pothole" at Banjara Hills Road No. 1, near Taj Krishna has been marked as Fixed by municipal operations.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/reports/REP-HYD-1014'
  }
];

export const notificationService = {
  getAllNotifications(): AppNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to read notifications from localStorage', e);
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifications: AppNotification[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  },

  getNotificationsForUser(user?: User | null): AppNotification[] {
    if (!user || user.role === 'Guest') return [];
    const all = this.getAllNotifications();

    if (user.role === 'Admin') {
      return all
        .filter(n => n.recipientRole === 'Admin')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    if (user.role === 'Citizen') {
      return all
        .filter(n => n.recipientUserId === user.userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }

    return [];
  },

  getUnreadCount(user?: User | null): number {
    const userNotifications = this.getNotificationsForUser(user);
    return userNotifications.filter(n => !n.read).length;
  },

  markAsRead(notificationId: string): void {
    const all = this.getAllNotifications();
    const index = all.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      all[index].read = true;
      this.saveNotifications(all);
    }
  },

  markAllAsRead(user?: User | null): void {
    if (!user) return;
    const all = this.getAllNotifications();
    let updated = false;

    for (let i = 0; i < all.length; i++) {
      const n = all[i];
      if (user.role === 'Admin' && n.recipientRole === 'Admin' && !n.read) {
        n.read = true;
        updated = true;
      } else if (user.role === 'Citizen' && n.recipientUserId === user.userId && !n.read) {
        n.read = true;
        updated = true;
      }
    }

    if (updated) {
      this.saveNotifications(all);
    }
  },

  /**
   * Type A: Admin Notification — New Issue Reported
   * Sent to municipal admin whenever a citizen successfully files an issue.
   * Deduplicated by reportId.
   */
  notifyAdminNewReport(report: Report): AppNotification | null {
    const dedupeId = `notif-new-${report.reportId}`;
    const all = this.getAllNotifications();

    if (all.some(n => n.id === dedupeId)) {
      return null; // Prevent duplicates
    }

    const notification: AppNotification = {
      id: dedupeId,
      type: 'NEW_REPORT',
      recipientRole: 'Admin',
      reportId: report.reportId,
      title: `New Issue Reported: ${report.category}`,
      category: report.category,
      location: report.landmark || 'Bachupally, Hyderabad',
      riskLevel: report.priorityLevel,
      riskScore: report.priorityScore,
      message: `A new ${report.category} was reported at ${report.landmark || 'Bachupally, Hyderabad'} (${report.priorityLevel} Risk).`,
      timestamp: report.createdAt || new Date().toISOString(),
      read: false,
      link: `/admin/reports/${report.reportId}`
    };

    const updated = [notification, ...all];
    this.saveNotifications(updated);
    return notification;
  },

  /**
   * Type B: User Notification — Issue Fixed
   * Sent only to the citizen who reported this specific issue when marked Fixed.
   * Deduplicated by reportId.
   */
  notifyUserIssueFixed(report: Report): AppNotification | null {
    const dedupeId = `notif-fixed-${report.reportId}`;
    const all = this.getAllNotifications();

    if (all.some(n => n.id === dedupeId)) {
      return null; // Prevent duplicates
    }

    const notification: AppNotification = {
      id: dedupeId,
      type: 'ISSUE_FIXED',
      recipientUserId: report.userId,
      reportId: report.reportId,
      title: `Issue Fixed: ${report.category}`,
      category: report.category,
      location: report.landmark || 'Bachupally, Hyderabad',
      riskLevel: report.priorityLevel,
      riskScore: report.priorityScore,
      message: `Your reported ${report.category} at ${report.landmark || 'Bachupally, Hyderabad'} has been marked as Fixed.`,
      timestamp: new Date().toISOString(),
      read: false,
      link: `/reports/${report.reportId}`
    };

    const updated = [notification, ...all];
    this.saveNotifications(updated);
    return notification;
  }
};
