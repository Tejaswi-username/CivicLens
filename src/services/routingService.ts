import { getPredefinedFallbackRoutes } from '../data/communityLandmarks';

export interface RawRouteResult {
  id: string;
  name: string;
  coordinates: [number, number][]; // [lat, lng]
  distanceMeters: number;
  durationSeconds: number;
  source: 'live-osrm' | 'demo-fallback';
}

export interface RoutingServiceResponse {
  routes: RawRouteResult[];
  source: 'live-osrm' | 'demo-fallback';
  providerNote: string;
}

/**
 * Service to retrieve routing geometries from public OpenStreetMap OSRM
 * with high-fidelity realistic fallback for offline/demo scenarios.
 */
export async function getCommunityRoutes(
  startCoords: [number, number],
  destCoords: [number, number]
): Promise<RoutingServiceResponse> {
  const [sLat, sLng] = startCoords;
  const [dLat, dLng] = destCoords;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    // Request walking route from public OSRM server with alternatives enabled
    const osrmUrl = `https://router.project-osrm.org/route/v1/foot/${sLng},${sLat};${dLng},${dLat}?overview=full&geometries=geojson&alternatives=true&steps=true`;

    const response = await fetch(osrmUrl, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM HTTP status: ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 'Ok' && Array.isArray(data.routes) && data.routes.length > 0) {
      const liveRoutes: RawRouteResult[] = data.routes.map((r: any, index: number) => {
        // GeoJSON provides [longitude, latitude]; Leaflet needs [latitude, longitude]
        const coords: [number, number][] = (r.geometry.coordinates || []).map(
          (pt: [number, number]) => [pt[1], pt[0]] as [number, number]
        );

        return {
          id: `osrm-route-${index + 1}`,
          name: index === 0 ? 'Primary Direct Route' : `Alternative Route via Streets`,
          coordinates: coords,
          distanceMeters: Math.round(r.distance),
          durationSeconds: Math.round(r.duration),
          source: 'live-osrm'
        };
      });

      // If OSRM returned only 1 route, generate a distinct secondary route via an offset waypoint
      if (liveRoutes.length === 1) {
        try {
          const midLat = (sLat + dLat) / 2 + 0.0018;
          const midLng = (sLng + dLng) / 2 - 0.0022;
          const altUrl = `https://router.project-osrm.org/route/v1/foot/${sLng},${sLat};${midLng},${midLat};${dLng},${dLat}?overview=full&geometries=geojson`;
          const altRes = await fetch(altUrl);
          if (altRes.ok) {
            const altData = await altRes.json();
            if (altData.code === 'Ok' && altData.routes?.[0]) {
              const altCoords = (altData.routes[0].geometry.coordinates || []).map(
                (pt: [number, number]) => [pt[1], pt[0]] as [number, number]
              );
              liveRoutes.push({
                id: 'osrm-route-2',
                name: 'Secondary Neighborhood Route',
                coordinates: altCoords,
                distanceMeters: Math.round(altData.routes[0].distance),
                durationSeconds: Math.round(altData.routes[0].duration),
                source: 'live-osrm'
              });
            }
          }
        } catch {
          // If second fetch fails, append a fallback alternative
          const fallback = getPredefinedFallbackRoutes(startCoords, destCoords)[1];
          liveRoutes.push({
            ...fallback,
            source: 'demo-fallback'
          });
        }
      }

      return {
        routes: liveRoutes,
        source: 'live-osrm',
        providerNote: 'Live OpenStreetMap / OSRM foot routing'
      };
    }

    throw new Error('OSRM did not return any valid routes');
  } catch (err) {
    // Network error or timeout: seamlessly use realistic fallback routes
    const fallbacks = getPredefinedFallbackRoutes(startCoords, destCoords);
    return {
      routes: fallbacks.map(f => ({ ...f, source: 'demo-fallback' })),
      source: 'demo-fallback',
      providerNote: 'Offline demo route fallback (Predefined community street grid)'
    };
  }
}
