import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SafeRoute, SafetyMode } from '../../types/route';
import { Report } from '../../types/report';
import { getCategoryFallbackSvg, getAppropriateWebImage } from '../../utils/imageUtils';
import { createGoogleMapsTileLayer } from '../../utils/mapConfig';
import { COMMUNITY_CONFIG, BACHUPALLY_BOUNDARY_COORDS } from '../../utils/communityConfig';
import {
  Layers,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Compass,
  Maximize2
} from 'lucide-react';

interface SafeRouteMapProps {
  routes: SafeRoute[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  startCoords: [number, number];
  destCoords: [number, number];
  startLabel: string;
  destLabel: string;
  reports: Report[];
  safetyMode: SafetyMode;
  height?: string;
  communityName?: string;
}

export const SafeRouteMap: React.FC<SafeRouteMapProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  startCoords,
  destCoords,
  startLabel,
  destLabel,
  reports,
  safetyMode,
  height = '100%',
  communityName = 'Community View: Bachupally'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer references
  const polylinesRef = useRef<{ [id: string]: { line: L.Polyline; casing?: L.Polyline } }>({});
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const endpointsLayerRef = useRef<L.LayerGroup | null>(null);

  const [tileError, setTileError] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: startCoords,
        zoom: 15,
        zoomControl: false // We will add zoom control with custom position
      });

      // Custom zoom control in top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Google Maps Tile Layer
      const googleStreets = createGoogleMapsTileLayer('streets');
      const googleHybrid = createGoogleMapsTileLayer('hybrid');

      googleStreets.addTo(map);

      // Add map layer toggle
      L.control.layers(
        {
          'Google Maps (Roadmap)': googleStreets,
          'Google Maps (Satellite)': googleHybrid
        },
        undefined,
        { position: 'topright' }
      ).addTo(map);

      // Add Bachupally Demonstration Community Boundary Polygon
      L.polygon(BACHUPALLY_BOUNDARY_COORDS, {
        color: '#0284c7',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#0ea5e9',
        fillOpacity: 0.08,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      endpointsLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;

      // Force size invalidation
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    // Resize observer to ensure map responds immediately to responsive layout shifts
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Endpoints (Start & Destination Markers)
  useEffect(() => {
    const map = mapInstanceRef.current;
    const endpointsLayer = endpointsLayerRef.current;
    if (!map || !endpointsLayer) return;

    endpointsLayer.clearLayers();

    // Start Marker (Point A - Vibrant Green)
    const startIcon = L.divIcon({
      className: 'custom-endpoint-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            background: #10b981;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.45);
          ">
            <span style="transform: rotate(45deg);">A</span>
          </div>
          <div style="
            background: rgba(15, 23, 42, 0.9);
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
            margin-top: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            Start
          </div>
        </div>
      `,
      iconSize: [60, 50],
      iconAnchor: [30, 26]
    });

    const startMarker = L.marker(startCoords, { icon: startIcon, zIndexOffset: 1200 });
    startMarker.bindPopup(`<strong>Origin:</strong> ${startLabel}`);
    endpointsLayer.addLayer(startMarker);

    // Destination Marker (Point B - Vibrant Indigo)
    const destIcon = L.divIcon({
      className: 'custom-endpoint-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="
            background: #4f46e5;
            color: #ffffff;
            font-size: 11px;
            font-weight: 800;
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #ffffff;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.45);
          ">
            <span style="transform: rotate(45deg);">B</span>
          </div>
          <div style="
            background: rgba(15, 23, 42, 0.9);
            color: #ffffff;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
            margin-top: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            Destination
          </div>
        </div>
      `,
      iconSize: [60, 50],
      iconAnchor: [30, 26]
    });

    const destMarker = L.marker(destCoords, { icon: destIcon, zIndexOffset: 1200 });
    destMarker.bindPopup(`<strong>Destination:</strong> ${destLabel}`);
    endpointsLayer.addLayer(destMarker);
  }, [startCoords, destCoords, startLabel, destLabel]);

  // Render Polylines for Routes with High-Visibility Casings
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old polylines
    Object.values(polylinesRef.current).forEach(({ line, casing }) => {
      line.remove();
      if (casing) casing.remove();
    });
    polylinesRef.current = {};

    if (routes.length === 0) return;

    const bounds = L.latLngBounds([]);
    bounds.extend(startCoords);
    bounds.extend(destCoords);

    routes.forEach(route => {
      const isSelected = route.id === selectedRouteId;

      route.coordinates.forEach(c => bounds.extend(c));

      // Underlay casing for selected route to make it pop visually
      let casing: L.Polyline | undefined;
      if (isSelected) {
        casing = L.polyline(route.coordinates, {
          color: '#ffffff',
          weight: 12,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);
      }

      // Main polyline
      const line = L.polyline(route.coordinates, {
        color: route.color,
        weight: isSelected ? 7 : 4.5,
        opacity: isSelected ? 1.0 : 0.65,
        dashArray: isSelected ? undefined : '6, 6',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      // Tooltip
      line.bindTooltip(
        `<strong>${route.name}</strong><br/>Risk Score: ${route.riskScore}/100 (${route.riskLevel})<br/>Click to select`,
        { sticky: true }
      );

      // Click handler
      line.on('click', () => {
        onSelectRoute(route.id);
      });

      // Hover emphasis
      line.on('mouseover', () => {
        if (route.id !== selectedRouteId) {
          line.setStyle({ weight: 6, opacity: 0.9 });
        }
      });
      line.on('mouseout', () => {
        if (route.id !== selectedRouteId) {
          line.setStyle({ weight: 4.5, opacity: 0.65 });
        }
      });

      polylinesRef.current[route.id] = { line, casing };
    });

    // Bring selected route polyline to front
    if (polylinesRef.current[selectedRouteId]) {
      const selectedEntry = polylinesRef.current[selectedRouteId];
      if (selectedEntry.casing) selectedEntry.casing.bringToFront();
      selectedEntry.line.bringToFront();
    }

    // Auto-fit bounds
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 16 });
    }
  }, [routes, selectedRouteId, onSelectRoute, startCoords, destCoords]);

  // Render Hazard Markers along / near routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // Collect hazards from active routes or nearby reports
    const hazardsToRender = reports.filter(r => {
      // Check if report is within 250m of any route
      return routes.some(route => {
        const dLat = (r.latitude - route.coordinates[0][0]) * 111000;
        const dLng = (r.longitude - route.coordinates[0][1]) * 111000;
        return Math.hypot(dLat, dLng) < 4000; // nearby area
      });
    });

    hazardsToRender.forEach(report => {
      const isFixed = report.status === 'Fixed';
      const isHigh = report.priorityLevel === 'High';
      const isMedium = report.priorityLevel === 'Medium';

      const pinBg = isFixed ? '#10b981' : isHigh ? '#ef4444' : isMedium ? '#f97316' : '#64748b';

      const hazardIcon = L.divIcon({
        className: 'custom-hazard-marker',
        html: `
          <div style="position: relative; width: 22px; height: 22px;">
            ${
              isHigh && !isFixed
                ? `<div style="position: absolute; width: 32px; height: 32px; top: -5px; left: -5px; border-radius: 50%; border: 2px solid ${pinBg}; opacity: 0.8; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
                : ''
            }
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background-color: ${pinBg};
              border: 2px solid #ffffff;
              box-shadow: 0 3px 8px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
            ">
              ${isFixed ? '✓' : '!'}
            </div>
          </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([report.latitude, report.longitude], {
        icon: hazardIcon,
        zIndexOffset: isHigh ? 800 : 600
      });

      const popupPhoto = report.photoUrl || getAppropriateWebImage(report.category, report.description);
      const popupHtml = `
        <div style="font-family: inherit; width: 240px; padding: 2px;">
          <div style="position: relative; height: 100px; border-radius: 8px; overflow: hidden; margin-bottom: 6px; background: #e2e8f0;">
            <img src="${popupPhoto}" alt="${report.category}" referrerpolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='${getAppropriateWebImage(report.category, report.description)}'" />
            <div style="position: absolute; top: 6px; left: 6px; background: rgba(15, 23, 42, 0.85); color: white; padding: 2px 7px; border-radius: 9999px; font-size: 10px; font-weight: 700;">
              ${report.category}
            </div>
            <div style="position: absolute; bottom: 6px; right: 6px; background: ${pinBg}; color: white; padding: 2px 7px; border-radius: 9999px; font-size: 9px; font-weight: 700;">
              ${report.status}
            </div>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 3px;">
            ${report.landmark || 'Community Street'}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px; line-height: 1.3;">
            ${report.description.substring(0, 80)}${report.description.length > 80 ? '...' : ''}
          </div>
          <div style="font-size: 10px; font-weight: 600; color: #475569; border-top: 1px solid #f1f5f9; padding-top: 4px; display: flex; justify-content: space-between;">
            <span>Priority: <strong>${report.priorityLevel} (${report.priorityScore})</strong></span>
            <span>Risk Factor: <strong>${report.safetyRisk}/3</strong></span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      markersLayer.addLayer(marker);
    });
  }, [reports, routes]);

  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([]);
    bounds.extend(startCoords);
    bounds.extend(destCoords);
    routes.forEach(r => r.coordinates.forEach(c => bounds.extend(c)));
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 16 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-100 flex flex-col">
      {/* Interactive Leaflet Container */}
      <div ref={mapContainerRef} className="w-full flex-1" style={{ minHeight: height }} />

      {/* Floating Top Header Badge */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-slate-800 tracking-tight">
          {communityName}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
          {safetyMode.toUpperCase()} MODE
        </span>
      </div>

      {/* Re-center / Zoom to Fit Floating Action Button */}
      <button
        type="button"
        onClick={handleRecenter}
        title="Center view on all routes"
        className="absolute top-16 right-3 z-[400] bg-white text-slate-700 hover:text-blue-700 hover:bg-slate-50 p-2 rounded-xl shadow-md border border-slate-200 transition"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      {/* Bottom Floating Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-700 max-w-sm">
        <div className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Route & Hazard Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-emerald-500 shadow-sm" />
            <span>Recommended Safer Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-amber-500" />
            <span>Moderate Risk Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 rounded-full bg-red-500" />
            <span>Higher Risk Route</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-200" />
            <span>High Risk Hazard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span>Medium Hazard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Verified Fixed</span>
          </div>
        </div>
      </div>

      {/* Offline / Tile Fallback Banner if tile provider is slow */}
      {tileError && (
        <div className="absolute top-14 left-3 right-3 z-[400] bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Map tiles loading from backup cache. Interactive route lines and hazards remain fully operational.</span>
        </div>
      )}
    </div>
  );
};
