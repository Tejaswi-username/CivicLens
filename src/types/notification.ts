import { ReportCategory, PriorityLevel } from './report';

export type NotificationType = 'NEW_REPORT' | 'ISSUE_FIXED';

export interface AppNotification {
  id: string; // e.g. `notif-new-${reportId}` or `notif-fixed-${reportId}` for strict deduplication
  type: NotificationType;
  recipientRole?: 'Admin';
  recipientUserId?: string;
  reportId: string;
  title: string;
  category: ReportCategory;
  location: string;
  riskLevel?: PriorityLevel;
  riskScore?: number;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  link: string; // Target route for redirection
}
