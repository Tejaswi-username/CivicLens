import { Landmark } from '../types/route';

/**
 * Community Landmarks for SafeRoute+ Community Ward (Bachupally Community)
 */
export const COMMUNITY_NAME = 'Bachupally Community Ward';

export const COMMUNITY_CENTER: [number, number] = [17.5375, 78.3830];

export const COMMUNITY_LANDMARKS: Landmark[] = [
  {
    id: 'bachupally-x-roads',
    name: 'Bachupally X Roads (Main Junction)',
    type: 'gate',
    coordinates: [17.5382, 78.3828],
    description: 'Central Bachupally crossroads connecting Miyapur, Bowrampet, and Mallampet.'
  },
  {
    id: 'vnr-college-gate',
    name: 'VNR VJIET College Gate',
    type: 'education',
    coordinates: [17.5404, 78.3865],
    description: 'Engineering campus main entrance gate, student crossing, and bus pickup point.'
  },
  {
    id: 'silver-oaks-lane',
    name: 'Silver Oaks School Lane',
    type: 'education',
    coordinates: [17.5342, 78.3758],
    description: 'School transit zone, morning bus pickup lane, and residential approach.'
  },
  {
    id: 'mamata-hospital',
    name: 'Mamata Medical Academy & Hospital',
    type: 'commercial',
    coordinates: [17.5312, 78.3745],
    description: 'Hospital approach corridor and emergency healthcare entrance.'
  },
  {
    id: 'pragathi-road-plaza',
    name: 'Pragathi Nagar - Bachupally Commercial Plaza',
    type: 'commercial',
    coordinates: [17.5265, 78.3890],
    description: 'Local produce stalls, supermarket, pharmacy, and daily commerce.'
  },
  {
    id: 'bachupally-lake-park',
    name: 'Bachupally Lake & Community Park',
    type: 'park',
    coordinates: [17.5360, 78.3880],
    description: 'Recreational walking track, green buffer, and lake viewpoint.'
  },
  {
    id: 'mallampet-transit-hub',
    name: 'Mallampet Road Transit Shelter',
    type: 'transit',
    coordinates: [17.5435, 78.3715],
    description: 'Community bus stop, auto-rickshaw stand, and ZP School crossing.'
  }
];

export function getLandmarkById(id: string): Landmark | undefined {
  return COMMUNITY_LANDMARKS.find(l => l.id === id);
}

/**
 * Realistic Predefined Fallback Geometries following community streets.
 * Used when OSRM routing is unavailable or returns only 1 route.
 */
export interface PredefinedRouteFallback {
  id: string;
  name: string;
  distanceMeters: number;
  durationSeconds: number;
  coordinates: [number, number][];
}

export function getPredefinedFallbackRoutes(
  startCoords: [number, number],
  destCoords: [number, number]
): PredefinedRouteFallback[] {
  const [sLat, sLng] = startCoords;
  const [dLat, dLng] = destCoords;

  // Approximate midpoints with deliberate lateral diversions representing local avenues vs quiet alleys
  const midLat = (sLat + dLat) / 2;
  const midLng = (sLng + dLng) / 2;

  // Route 1 (Direct arterial route along Main Avenue)
  const route1Coords: [number, number][] = [
    [sLat, sLng],
    [sLat + (midLat - sLat) * 0.4, sLng + (midLng - sLng) * 0.1],
    [midLat, midLng],
    [dLat - (dLat - midLat) * 0.4, dLng - (dLng - midLng) * 0.1],
    [dLat, dLng]
  ];

  // Route 2 (Alternative boulevard via Park & Residential loop with street turns)
  const offsetLat = 0.0022;
  const offsetLng = -0.0018;
  const route2Coords: [number, number][] = [
    [sLat, sLng],
    [sLat + offsetLat * 0.5, sLng + (midLng - sLng) * 0.5 + offsetLng * 0.5],
    [midLat + offsetLat, midLng + offsetLng],
    [dLat + offsetLat * 0.3, dLng - (dLng - midLng) * 0.3 + offsetLng * 0.3],
    [dLat, dLng]
  ];

  // Approximate distances
  const straightMeters = Math.hypot((dLat - sLat) * 111000, (dLng - sLng) * 111000);
  const dist1 = Math.round(straightMeters * 1.25);
  const dist2 = Math.round(straightMeters * 1.55);

  return [
    {
      id: 'fallback-fastest',
      name: 'Main Arterial Corridor',
      distanceMeters: dist1,
      durationSeconds: Math.round(dist1 / 1.3), // approx 1.3 m/s walking speed
      coordinates: route1Coords
    },
    {
      id: 'fallback-alternative',
      name: 'Residential Park Bypass',
      distanceMeters: dist2,
      durationSeconds: Math.round(dist2 / 1.3),
      coordinates: route2Coords
    }
  ];
}
