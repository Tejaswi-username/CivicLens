export type ReportCategory =
  | 'Pothole'
  | 'Broken Streetlight'
  | 'Open Drain'
  | 'Waterlogging'
  | 'Damaged Footpath'
  | 'Unsafe Crossing'
  | 'Garbage Dumping'
  | 'Other';

export type ReportStatus =
  | 'Reported'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Fixed'
  | 'Reopened';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type MunicipalDepartment =
  | 'Roads Department'
  | 'Electricity Department'
  | 'Water/Sanitation Department'
  | 'Traffic Department'
  | 'Other';

export interface StatusHistoryItem {
  id: string;
  status: ReportStatus;
  changedBy: string;
  role: 'Citizen' | 'Admin' | 'System';
  timestamp: string;
  note?: string;
  resolutionPhotoUrl?: string;
}

export interface Report {
  reportId: string;
  userId: string;
  userName: string;
  category: ReportCategory;
  description: string;
  photoUrl: string;
  latitude: number;
  longitude: number;
  landmark: string;
  status: ReportStatus;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  safetyRisk: 1 | 2 | 3;
  injuryRisk?: 1 | 2 | 3;
  nightRisk?: 1 | 2 | 3;
  accessibilityRisk?: 1 | 2 | 3;
  waterloggingRisk?: 1 | 2 | 3;
  locationSensitivity: 1 | 2 | 3;
  confirmations: number;
  confirmedBy: string[]; // List of user IDs
  assignedDepartment: MunicipalDepartment | '';
  assignedAdminId?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  resolvedAt?: string; // ISO string
  resolutionPhotoUrl?: string;
  reopenReason?: string;
  isEscalated?: boolean;
  escalatedAt?: string;
  escalationReason?: string;
  statusHistory: StatusHistoryItem[];
  isDemoData: boolean;
}

export interface ReportFilterOptions {
  category?: string;
  status?: string;
  priority?: string;
  department?: string;
  searchQuery?: string;
  dateRange?: 'all' | 'today' | 'week' | 'month';
  sortBy?: 'newest' | 'oldest' | 'priority' | 'confirmations';
}
