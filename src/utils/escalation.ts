import { PriorityLevel, ReportStatus } from '../types/report';

export interface SLAConfig {
  targetHours: number;
  label: string;
}

export const PRIORITY_SLA: Record<PriorityLevel, SLAConfig> = {
  High: { targetHours: 48, label: '48 Hours (Urgent Hazard SLA)' },
  Medium: { targetHours: 96, label: '96 Hours (Standard 4-Day SLA)' },
  Low: { targetHours: 168, label: '7 Days (Standard SLA)' }
};

export interface EscalationStatus {
  targetHours: number;
  elapsedHours: number;
  remainingHours: number;
  remainingSeconds: number;
  isBreached: boolean;
  isApproaching: boolean; // under 12 hours remaining
  isEscalated: boolean;
  urgencyLevel: 'normal' | 'warning' | 'critical';
  countdownText: string;
  breachDurationText: string;
  deadlineDate: Date;
}

/**
 * Calculates real-time SLA countdown and emergency escalation status for a report.
 */
export function calculateEscalationStatus(
  createdAt: string,
  priorityLevel: PriorityLevel,
  status: ReportStatus,
  hasManualEscalation = false
): EscalationStatus {
  const config = PRIORITY_SLA[priorityLevel] || PRIORITY_SLA.Medium;
  const createdTime = new Date(createdAt).getTime();
  const now = Date.now();
  
  const elapsedMs = Math.max(0, now - createdTime);
  const elapsedHours = elapsedMs / (1000 * 60 * 60);
  
  const targetMs = config.targetHours * 60 * 60 * 1000;
  const deadlineDate = new Date(createdTime + targetMs);
  const remainingMs = targetMs - elapsedMs;
  const remainingHours = remainingMs / (1000 * 60 * 60);
  const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  
  const isFixed = status === 'Fixed';
  const isBreached = !isFixed && remainingMs <= 0;
  const isApproaching = !isFixed && !isBreached && remainingHours <= 12;
  const isEscalated = hasManualEscalation || isBreached || status === 'Reopened';
  
  // Format remaining countdown (e.g. "1d 4h 12m" or "4h 22m 10s")
  const sec = remainingSeconds % 60;
  const totalMin = Math.floor(remainingSeconds / 60);
  const min = totalMin % 60;
  const totalHours = Math.floor(totalMin / 60);
  const hrs = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  let countdownText = '';
  if (days > 0) {
    countdownText = `${days}d ${hrs}h ${min}m`;
  } else if (hrs > 0) {
    countdownText = `${hrs}h ${min}m ${sec}s`;
  } else {
    countdownText = `${min}m ${sec}s`;
  }

  // Format breach overdue duration (e.g. "Overdue by 2d 5h")
  const overdueMs = Math.abs(remainingMs);
  const overdueTotalSec = Math.floor(overdueMs / 1000);
  const overdueMin = Math.floor(overdueTotalSec / 60) % 60;
  const overdueHrs = Math.floor(overdueTotalSec / 3600) % 24;
  const overdueDays = Math.floor(overdueTotalSec / 86400);

  let breachDurationText = '';
  if (overdueDays > 0) {
    breachDurationText = `${overdueDays}d ${overdueHrs}h overdue`;
  } else if (overdueHrs > 0) {
    breachDurationText = `${overdueHrs}h ${overdueMin}m overdue`;
  } else {
    breachDurationText = `${overdueMin}m overdue`;
  }

  let urgencyLevel: 'normal' | 'warning' | 'critical' = 'normal';
  if (isBreached || isEscalated) {
    urgencyLevel = 'critical';
  } else if (isApproaching) {
    urgencyLevel = 'warning';
  }

  return {
    targetHours: config.targetHours,
    elapsedHours,
    remainingHours,
    remainingSeconds,
    isBreached,
    isApproaching,
    isEscalated,
    urgencyLevel,
    countdownText,
    breachDurationText,
    deadlineDate
  };
}
