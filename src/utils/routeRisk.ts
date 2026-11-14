import { Report, ReportCategory } from '../types/report';
import { SafetyMode, SafeRoute, HazardOnRoute, RiskClassification, RouteType } from '../types/route';

/**
 * Calculates the perpendicular geodesic distance in meters from a coordinate point
 * to a polyline segment using equirectangular projection (accurate to <1 meter for local routes).
 */
export function distanceToSegmentInMeters(
  pLat: number,
  pLng: number,
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  // Center latitude in radians for longitude scaling
  const midLatRad = ((aLat + bLat) / 2) * (Math.PI / 180);
  const cosMidLat = Math.cos(midLatRad);

  // Convert lat/lng differences to meters
  const mPerLat = 110574;
  const mPerLng = 111320 * cosMidLat;

  const dx = (bLng - aLng) * mPerLng;
  const dy = (bLat - aLat) * mPerLat;

  const px = (pLng - aLng) * mPerLng;
  const py = (pLat - aLat) * mPerLat;

  const segLengthSq = dx * dx + dy * dy;

  if (segLengthSq === 0) {
    return Math.hypot(px, py);
  }

  // Projection scalar t on line segment [0, 1]
  const t = Math.max(0, Math.min(1, (px * dx + py * dy) / segLengthSq));

  const projX = t * dx;
  const projY = t * dy;

  return Math.hypot(px - projX, py - projY);
}

/**
 * Calculates the shortest distance in meters from a point to an entire polyline
 */
export function distanceToPolylineInMeters(
  lat: number,
  lng: number,
  polyline: [number, number][]
): number {
  if (polyline.length === 0) return Infinity;
  if (polyline.length === 1) {
    const dLat = (lat - polyline[0][0]) * 110574;
    const dLng = (lng - polyline[0][1]) * 111320 * Math.cos((lat * Math.PI) / 180);
    return Math.hypot(dLat, dLng);
  }

  let minDistance = Infinity;
  for (let i = 0; i < polyline.length - 1; i++) {
    const d = distanceToSegmentInMeters(
      lat,
      lng,
      polyline[i][0],
      polyline[i][1],
      polyline[i + 1][0],
      polyline[i + 1][1]
    );
    if (d < minDistance) {
      minDistance = d;
    }
  }

  return Math.round(minDistance);
}

/**
 * Returns mode-specific weighting factor and descriptive warning for a hazard
 */
export function getModeFactorAndWarning(
  category: ReportCategory,
  mode: SafetyMode,
  landmark: string
): { multiplier: number; warningText: string } {
  switch (mode) {
    case 'night':
      if (category === 'Broken Streetlight') {
        return {
          multiplier: 2.2,
          warningText: `Dark stretch reported near ${landmark} (non-functioning lighting)`
        };
      }
      if (category === 'Unsafe Crossing') {
        return {
          multiplier: 1.8,
          warningText: `Low-visibility hazardous crossing near ${landmark}`
        };
      }
      if (category === 'Open Drain' || category === 'Pothole') {
        return {
          multiplier: 1.4,
          warningText: `Unlit fall/trip hazard near ${landmark}`
        };
      }
      return {
        multiplier: 0.9,
        warningText: `Reported ${category} near ${landmark}`
      };

    case 'rain':
      if (category === 'Waterlogging') {
        return {
          multiplier: 2.4,
          warningText: `Stagnant waterlogging & flooding reported near ${landmark}`
        };
      }
      if (category === 'Open Drain') {
        return {
          multiplier: 2.1,
          warningText: `Overflowing/submerged open drain risk near ${landmark}`
        };
      }
      if (category === 'Pothole') {
        return {
          multiplier: 1.6,
          warningText: `Hidden submerged pothole cluster near ${landmark}`
        };
      }
      return {
        multiplier: 0.8,
        warningText: `Reported ${category} near ${landmark}`
      };

    case 'accessibility':
      if (category === 'Damaged Footpath') {
        return {
          multiplier: 2.3,
          warningText: `Broken paving / inaccessible curb ramp near ${landmark}`
        };
      }
      if (category === 'Unsafe Crossing') {
        return {
          multiplier: 2.0,
          warningText: `Unsafe pedestrian crossing without accessible curb near ${landmark}`
        };
      }
      if (category === 'Garbage Dumping' || category === 'Open Drain') {
        return {
          multiplier: 1.6,
          warningText: `Pathway blocked by ${category.toLowerCase()} near ${landmark}`
        };
      }
      return {
        multiplier: 0.8,
        warningText: `Reported ${category} near ${landmark}`
      };

    case 'general':
    default:
      return {
        multiplier: 1.0,
        warningText: `Reported ${category} near ${landmark}`
      };
  }
}

/**
 * Evaluates route risk based on nearby unresolved community reports (within 150m)
 * using distance-weighted scoring and safety mode multipliers.
 */
export function evaluateRouteRisk(
  rawRoute: {
    id: string;
    name: string;
    coordinates: [number, number][];
    distanceMeters: number;
    durationSeconds: number;
    source: 'live-osrm' | 'demo-fallback';
  },
  allReports: Report[],
  safetyMode: SafetyMode
): {
  riskScore: number;
  riskLevel: RiskClassification;
  hazardCount: number;
  hazards: HazardOnRoute[];
  warnings: string[];
  color: string;
} {
  const nearbyHazards: HazardOnRoute[] = [];
  const processedReportIds = new Set<string>();

  // Exclude fixed reports; only evaluate unresolved community reports
  const activeReports = allReports.filter(r => r.status !== 'Fixed');

  for (const report of activeReports) {
    if (processedReportIds.has(report.reportId)) continue;

    const dist = distanceToPolylineInMeters(report.latitude, report.longitude, rawRoute.coordinates);

    // Rule: Hazards within 150 meters
    if (dist <= 150) {
      processedReportIds.add(report.reportId);

      // Distance decay weight: 1.0 on path to 0.4 at 150m
      const distWeight = Math.max(0.4, 1.0 - 0.6 * (dist / 150));

      // Base severity from report's safetyRisk (1-3) & priority level
      const baseSeverity =
        report.safetyRisk * 12 +
        (report.priorityLevel === 'High' ? 12 : report.priorityLevel === 'Medium' ? 6 : 2);

      const { multiplier, warningText } = getModeFactorAndWarning(
        report.category,
        safetyMode,
        report.landmark || 'Community Road'
      );

      const weightedScore = baseSeverity * distWeight * multiplier;

      nearbyHazards.push({
        report,
        distanceToRouteMeters: dist,
        weightedScore,
        modeWarning: warningText
      });
    }
  }

  // Sort hazards by severity descending
  nearbyHazards.sort((a, b) => b.weightedScore - a.weightedScore);

  // Normalize route risk score to 0 - 100
  // Normalized for route length to prevent penalizing longer routes simply for covering more map area
  const routeLengthKm = Math.max(0.6, rawRoute.distanceMeters / 1000);
  const totalRawRisk = nearbyHazards.reduce((acc, h) => acc + h.weightedScore, 0);
  const peakHazard = nearbyHazards.length > 0 ? nearbyHazards[0].weightedScore : 0;

  // Normalized score combining hazard density per km with peak hazard impact
  let rawScore = (totalRawRisk / (routeLengthKm * 0.95)) + (peakHazard * 0.22);
  if (nearbyHazards.length === 0) rawScore = 0;

  const riskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Prototype classifications:
  // 0–29: Lower reported risk
  // 30–59: Moderate reported risk
  // 60–100: Higher reported risk
  let riskLevel: RiskClassification = 'Lower reported risk';
  let color = '#10b981'; // Green

  if (riskScore >= 60) {
    riskLevel = 'Higher reported risk';
    color = '#ef4444'; // Red
  } else if (riskScore >= 30) {
    riskLevel = 'Moderate reported risk';
    color = '#f59e0b'; // Amber
  }

  const warnings = nearbyHazards.slice(0, 3).map(h => h.modeWarning);

  return {
    riskScore,
    riskLevel,
    hazardCount: nearbyHazards.length,
    hazards: nearbyHazards,
    warnings,
    color
  };
}

/**
 * Assigns route classifications ('Safer Alternative', 'Fastest Route', 'Alternative Route')
 * and generates intelligent comparison explanations.
 */
export function compareAndClassifyRoutes(
  evaluatedRoutes: (ReturnType<typeof evaluateRouteRisk> & {
    id: string;
    name: string;
    coordinates: [number, number][];
    distanceMeters: number;
    durationSeconds: number;
    source: 'live-osrm' | 'demo-fallback';
  })[],
  safetyMode: SafetyMode
): SafeRoute[] {
  if (evaluatedRoutes.length === 0) return [];

  // Find lowest risk and fastest
  let minRiskIdx = 0;
  let minTimeIdx = 0;

  evaluatedRoutes.forEach((r, idx) => {
    if (r.riskScore < evaluatedRoutes[minRiskIdx].riskScore) minRiskIdx = idx;
    if (r.durationSeconds < evaluatedRoutes[minTimeIdx].durationSeconds) minTimeIdx = idx;
  });

  const modeDescriptions: Record<SafetyMode, string> = {
    general: 'general infrastructure hazards',
    night: 'unlit streets and dark crossings',
    rain: 'flooded waterlogged points and open drains',
    accessibility: 'damaged walkways and broken curbs'
  };

  return evaluatedRoutes.map((r, idx) => {
    const isLowestRisk = idx === minRiskIdx;
    const isFastest = idx === minTimeIdx;
    const riskDiff = Math.abs(r.riskScore - evaluatedRoutes[minRiskIdx].riskScore);

    let routeType: RouteType = 'alternative';
    let displayName = r.name;
    let isRecommended = false;
    let recommendationReason = '';

    if (isLowestRisk && evaluatedRoutes.length > 1 && riskDiff >= 8) {
      routeType = 'safer';
      displayName = 'Safer Alternative';
      isRecommended = true;
      recommendationReason = `Bypasses ${r.hazardCount === 0 ? 'all reported hazards' : `${r.hazardCount} reported ${modeDescriptions[safetyMode]}`}. Recommended for ${safetyMode} safety.`;
    } else if (isFastest) {
      routeType = 'fastest';
      displayName = evaluatedRoutes.length > 1 && isLowestRisk ? 'Fastest & Safest Route' : 'Fastest Route';
      if (isLowestRisk) isRecommended = true;
      recommendationReason = `Quickest travel duration (${Math.round(r.durationSeconds / 60)} mins) with direct connectivity.`;
    } else {
      routeType = 'alternative';
      displayName = `Alternative Route ${idx + 1}`;
      recommendationReason = `Alternative neighborhood bypass route via local community streets.`;
    }

    // Ensure color aligns with requirement:
    // Green: Recommended lower-reported-risk route
    // Red: Higher-reported-risk route
    // Amber: Moderate-reported-risk route
    // Grey/blue: Unselected alternative
    let finalColor = r.color;
    if (isRecommended && r.riskScore < 50) {
      finalColor = '#10b981'; // Vibrant green
    }

    return {
      ...r,
      name: displayName,
      routeType,
      isRecommended,
      recommendationReason,
      color: finalColor
    };
  });
}
