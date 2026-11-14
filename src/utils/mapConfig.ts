import L from 'leaflet';

/**
 * Google Maps Tile Provider Configuration for Leaflet
 * Provides reliable, high-speed Google Maps base layers (Streets, Satellite Hybrid, and Terrain).
 * Automatically utilizes VITE_GOOGLE_MAPS_API_KEY from the environment if present.
 */

export type GoogleMapsLayerType = 'streets' | 'hybrid' | 'terrain';

export function getGoogleMapsTileUrl(layerType: GoogleMapsLayerType = 'streets'): string {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const lyrs = layerType === 'hybrid' ? 'y' : layerType === 'terrain' ? 'p' : 'm';

  if (apiKey) {
    return `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}&key=${apiKey}`;
  }
  return `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`;
}

export function createGoogleMapsTileLayer(
  layerType: GoogleMapsLayerType = 'streets'
): L.TileLayer {
  const url = getGoogleMapsTileUrl(layerType);

  return L.tileLayer(url, {
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 21,
    attribution:
      '&copy; <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">Google Maps</a>'
  });
}
