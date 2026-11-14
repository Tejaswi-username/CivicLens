import { Report } from './report';

export type SafetyMode = 'general' | 'night' | 'rain' | 'accessibility';

export type RouteType = 'safer' | 'fastest' | 'alternative';

export type RiskClassification = 'Lower reported risk' | 'Moderate reported risk' | 'Higher reported risk';

export interface Landmark {
  id: string;
  name: string;
  type: 'gate' | 'transit' | 'residential' | 'park' | 'commercial' | 'education' | 'custom';
  coordinates: [number, number]; // [latitude, longitude]
  description: string;
}

export interface HazardOnRoute {
  report: Report;
  distanceToRouteMeters: number;
  weightedScore: number;
  modeWarning: string;
}

export interface SafeRoute {
  id: string;
  name: string;
  routeType: RouteType;
  coordinates: [number, number][]; // [latitude, longitude] sequence
  distanceMeters: number;
  durationSeconds: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskClassification;
  hazardCount: number;
  hazards: HazardOnRoute[];
  warnings: string[];
  recommendationReason: string;
  isRecommended: boolean;
  color: string;
  source: 'live-osrm' | 'demo-fallback';
}

export interface RouteSearchState {
  originId: string;
  destinationId: string;
  originCoords?: [number, number];
  destinationCoords?: [number, number];
  originLabel: string;
  destinationLabel: string;
  safetyMode: SafetyMode;
}
