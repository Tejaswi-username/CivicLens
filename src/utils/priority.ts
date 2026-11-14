import { PriorityLevel, ReportCategory, ReportStatus } from '../types/report';

export interface PriorityBreakdown {
  score: number;
  level: PriorityLevel;
  // Specific component contributions in points
  injuryContribution: number;
  nightContribution: number;
  accessibilityContribution: number;
  waterloggingContribution: number;
  confirmationsContribution: number;
  locationContribution: number;
  daysOpenContribution: number;
  // Raw factor scores (1, 2, or 3)
  injuryRisk: 1 | 2 | 3;
  nightRisk: 1 | 2 | 3;
  accessibilityRisk: 1 | 2 | 3;
  waterloggingRisk: 1 | 2 | 3;
  confirmations: number;
  locationSensitivity: 1 | 2 | 3;
  daysOpen: number;
  isResolved: boolean;
  // Backwards compatibility alias
  safetyContribution: number;
}

export interface RiskCalculationParams {
  injuryRisk?: 1 | 2 | 3;
  safetyRisk?: 1 | 2 | 3;
  nightRisk?: 1 | 2 | 3;
  accessibilityRisk?: 1 | 2 | 3;
  waterloggingRisk?: 1 | 2 | 3;
  confirmations?: number;
  createdAt?: string | Date;
  locationSensitivity?: 1 | 2 | 3;
  category?: ReportCategory;
  description?: string;
  status?: ReportStatus;
  resolvedAt?: string | Date;
}

/**
 * Derives missing risk factors using transparent, deterministic rules
 * based on standard civic hazard categorization and hazard descriptions.
 */
export function inferRiskFactors(params: RiskCalculationParams): {
  injuryRisk: 1 | 2 | 3;
  nightRisk: 1 | 2 | 3;
  accessibilityRisk: 1 | 2 | 3;
  waterloggingRisk: 1 | 2 | 3;
  locationSensitivity: 1 | 2 | 3;
} {
  // 1. Injury Risk: Use explicit injuryRisk or safetyRisk; fallback to 1 (baseline)
  let injuryRisk: 1 | 2 | 3 = params.injuryRisk ?? params.safetyRisk ?? 1;
  if (![1, 2, 3].includes(injuryRisk)) injuryRisk = 1;

  const desc = (params.description || '').toLowerCase();
  const cat = params.category;

  // 2. Night Risk
  let nightRisk: 1 | 2 | 3 = params.nightRisk ?? 1;
  if (params.nightRisk === undefined) {
    if (cat === 'Broken Streetlight') {
      nightRisk = 3; // Darkness / unlit hazard
    } else if (cat === 'Unsafe Crossing' || cat === 'Open Drain') {
      nightRisk = 2; // Dangerous tripping/falling hazard at night
    } else if (cat === 'Pothole') {
      nightRisk = 2; // Hidden in the dark
    }
    if (
      desc.includes('night') ||
      desc.includes('dark') ||
      desc.includes('unlit') ||
      desc.includes('evening') ||
      desc.includes('visibility') ||
      desc.includes('blackout')
    ) {
      nightRisk = 3;
    }
  }

  // 3. Accessibility Risk
  let accessibilityRisk: 1 | 2 | 3 = params.accessibilityRisk ?? 1;
  if (params.accessibilityRisk === undefined) {
    if (cat === 'Damaged Footpath' || cat === 'Unsafe Crossing') {
      accessibilityRisk = 3; // Severe pedestrian / wheelchair impedance
    } else if (cat === 'Open Drain') {
      accessibilityRisk = 2; // Sidewalk / pedestrian obstacle
    }
    if (
      desc.includes('wheelchair') ||
      desc.includes('footpath') ||
      desc.includes('sidewalk') ||
      desc.includes('pedestrian') ||
      desc.includes('curb') ||
      desc.includes('elderly') ||
      desc.includes('pram') ||
      desc.includes('stroller') ||
      desc.includes('blind')
    ) {
      accessibilityRisk = 3;
    }
  }

  // 4. Waterlogging Risk
  let waterloggingRisk: 1 | 2 | 3 = params.waterloggingRisk ?? 1;
  if (params.waterloggingRisk === undefined) {
    if (cat === 'Waterlogging') {
      waterloggingRisk = 3; // Stagnant flood / water accumulation
    } else if (cat === 'Open Drain') {
      waterloggingRisk = 2; // Overflow and drainage blockage risk
    }
    if (
      desc.includes('water') ||
      desc.includes('rain') ||
      desc.includes('flood') ||
      desc.includes('monsoon') ||
      desc.includes('stagnant') ||
      desc.includes('drain') ||
      desc.includes('overflow')
    ) {
      waterloggingRisk = 3;
    }
  }

  // 5. Location Sensitivity
  let locationSensitivity: 1 | 2 | 3 = params.locationSensitivity ?? 1;
  if (![1, 2, 3].includes(locationSensitivity)) locationSensitivity = 1;

  return {
    injuryRisk,
    nightRisk,
    accessibilityRisk,
    waterloggingRisk,
    locationSensitivity
  };
}

/**
 * Proposed Risk Score Formula:
 *
 * Risk Score =
 *   (Injury Risk × 3) +
 *   (Night Risk × 2) +
 *   (Accessibility Risk × 3) +
 *   (Waterlogging Risk × 2) +
 *   (Community Confirmations × 2) +
 *   (Location Sensitivity × 2) +
 *   (Days Open)
 *
 * Risk Categories:
 * - High Risk: Score >= 70
 * - Medium Risk: Score 40 - 69
 * - Low Risk: Score < 40
 */
export function calculatePriorityScore(
  param1: 1 | 2 | 3 | RiskCalculationParams,
  confirmationsParam?: number,
  createdAtParam?: string | Date,
  locationSensitivityParam?: 1 | 2 | 3,
  categoryParam?: ReportCategory,
  descriptionParam?: string,
  statusParam?: ReportStatus,
  resolvedAtParam?: string | Date
): PriorityBreakdown {
  let params: RiskCalculationParams;

  if (typeof param1 === 'object' && param1 !== null) {
    params = param1;
  } else {
    params = {
      safetyRisk: param1 as 1 | 2 | 3,
      confirmations: confirmationsParam ?? 0,
      createdAt: createdAtParam ?? new Date(),
      locationSensitivity: locationSensitivityParam ?? 1,
      category: categoryParam,
      description: descriptionParam,
      status: statusParam,
      resolvedAt: resolvedAtParam
    };
  }

  const {
    injuryRisk,
    nightRisk,
    accessibilityRisk,
    waterloggingRisk,
    locationSensitivity
  } = inferRiskFactors(params);

  const confirmations = Math.max(0, params.confirmations || 0);

  // Compute Days Open
  const createdDate = params.createdAt ? new Date(params.createdAt) : new Date();
  const isResolved = params.status === 'Fixed';

  // For resolved issues, days open is frozen at resolvedAt date
  const endDate = isResolved && params.resolvedAt ? new Date(params.resolvedAt) : new Date();
  const diffTime = Math.max(0, endDate.getTime() - createdDate.getTime());
  const daysOpen = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Weights according to Proposed Formula:
  const injuryContribution = injuryRisk * 3;
  const nightContribution = nightRisk * 2;
  const accessibilityContribution = accessibilityRisk * 3;
  const waterloggingContribution = waterloggingRisk * 2;
  const confirmationsContribution = confirmations * 2;
  const locationContribution = locationSensitivity * 2;
  const daysOpenContribution = daysOpen;

  const score =
    injuryContribution +
    nightContribution +
    accessibilityContribution +
    waterloggingContribution +
    confirmationsContribution +
    locationContribution +
    daysOpenContribution;

  let level: PriorityLevel = 'Low';
  if (score >= 70) {
    level = 'High';
  } else if (score >= 40) {
    level = 'Medium';
  }

  return {
    score,
    level,
    injuryContribution,
    nightContribution,
    accessibilityContribution,
    waterloggingContribution,
    confirmationsContribution,
    locationContribution,
    daysOpenContribution,
    injuryRisk,
    nightRisk,
    accessibilityRisk,
    waterloggingRisk,
    confirmations,
    locationSensitivity,
    daysOpen,
    isResolved,
    safetyContribution: injuryContribution
  };
}
