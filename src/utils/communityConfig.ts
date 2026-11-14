/**
 * Community Configuration for Civic Lens
 * Restricts the platform's geographical focus to a clearly defined local community.
 * Demonstration Area: Bachupally, Hyderabad, Telangana.
 */

export interface CommunityBoundaryPoint {
  lat: number;
  lng: number;
}

export const COMMUNITY_CONFIG = {
  id: 'bachupally',
  name: 'Bachupally Community',
  shortName: 'Bachupally',
  cityRegion: 'Hyderabad, Telangana',
  fullTitle: 'Bachupally, Hyderabad, Telangana',
  tagline: 'Report It. Track It. Build Safer Communities.',
  badgeLabel: 'Community View: Bachupally',
  center: [17.5375, 78.3830] as [number, number],
  defaultZoom: 14.5,
  minZoom: 12,
  maxZoom: 18,
  
  // Approximate demonstration boundary bounds for Bachupally
  bounds: {
    minLat: 17.5180,
    maxLat: 17.5560,
    minLng: 78.3580,
    maxLng: 78.4080,
  },

  boundaryDescription: 'Approximate demonstration boundary covering Bachupally, VNR VJIET corridor, Silver Oaks lane, Mallampet border, and Pragathi Nagar junction.'
};

/**
 * Polygonal coordinates defining the Bachupally Demonstration Area boundary.
 * These coordinates follow local roads and colony borders around Bachupally.
 */
export const BACHUPALLY_BOUNDARY_COORDS: [number, number][] = [
  [17.5550, 78.3650], // NW: Mallampet Road / ORR vicinity
  [17.5535, 78.3850], // N: Bowrampet - Bachupally border
  [17.5510, 78.4020], // NE: Miyapur - Medchal Highway link
  [17.5380, 78.4060], // E: Pragathi Nagar border
  [17.5240, 78.3980], // SE: Nizampet - Bachupally corridor
  [17.5200, 78.3820], // S: Hydernagar / Bachupally boundary
  [17.5220, 78.3680], // SW: Bowrampet link
  [17.5380, 78.3600], // W: Mallampet Lake side
  [17.5550, 78.3650]  // Closing vertex
];

/**
 * Determines whether a given latitude/longitude coordinate falls within
 * the Bachupally community demonstration area using ray-casting point-in-polygon.
 */
export function isWithinCommunity(lat: number, lng: number): boolean {
  if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
    return false;
  }

  // Fast bounding-box exclusion check
  const b = COMMUNITY_CONFIG.bounds;
  if (lat < b.minLat || lat > b.maxLat || lng < b.minLng || lng > b.maxLng) {
    return false;
  }

  // Ray-casting point-in-polygon algorithm
  const poly = BACHUPALLY_BOUNDARY_COORDS;
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Human-readable validation error message when a selected point falls outside Bachupally.
 */
export const OUTSIDE_COMMUNITY_MESSAGE =
  'The selected location is outside the Bachupally Community boundary. Civic Lens is focused on Bachupally local community reports. Please choose a location within Bachupally.';

/**
 * Filter reports to ensure only issues located within the Bachupally community
 * area appear by default.
 */
export function filterReportsByCommunity<T extends { latitude: number; longitude: number; landmark?: string }>(
  reports: T[]
): T[] {
  return reports.filter(r => {
    // Check GPS boundary
    if (isWithinCommunity(r.latitude, r.longitude)) {
      return true;
    }
    // Check landmark text fallback if within community
    if (r.landmark && r.landmark.toLowerCase().includes('bachupally')) {
      return true;
    }
    return false;
  });
}
