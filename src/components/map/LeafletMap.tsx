import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Report } from '../../types/report';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useReports } from '../../context/ReportContext';
import { formatDate } from '../../utils/date';
import { getCategoryFallbackSvg, getAppropriateWebImage } from '../../utils/imageUtils';
import { createGoogleMapsTileLayer } from '../../utils/mapConfig';
import {
  COMMUNITY_CONFIG,
  BACHUPALLY_BOUNDARY_COORDS,
  filterReportsByCommunity
} from '../../utils/communityConfig';
import { AlertCircle, ThumbsUp, ArrowRight, Layers, Eye, MapPin } from 'lucide-react';

interface LeafletMapProps {
  reports: Report[];
  center?: [number, number];
  zoom?: number;
  selectedReportId?: string;
  onSelectReport?: (report: Report) => void;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  reports,
  center = COMMUNITY_CONFIG.center,
  zoom = 15,
  selectedReportId,
  onSelectReport,
  height = '600px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const [tileError, setTileError] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { confirmReport } = useReports();

  // Helper for pin color based on status and priority
  const getPinColor = (report: Report) => {
    if (report.status === 'Fixed') return '#10b981'; // Green
    if (report.status === 'In Progress') return '#f59e0b'; // Amber / Yellow
    if (report.priorityLevel === 'High') return '#ef4444'; // Red
    if (report.priorityLevel === 'Medium') return '#f97316'; // Orange
    return '#64748b'; // Grey for low-priority open
  };

  // Create custom HTML icon
  const createMarkerIcon = (report: Report, isSelected: boolean) => {
    const color = getPinColor(report);
    const pulseHtml = report.priorityLevel === 'High' && report.status !== 'Fixed'
      ? `<div style="position: absolute; width: 36px; height: 36px; top: -6px; left: -6px; border-radius: 50%; border: 2px solid ${color}; opacity: 0.7; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
      : '';

    return L.divIcon({
      className: 'custom-leaflet-marker',
      html: `
        <div style="position: relative; width: 24px; height: 24px;">
          ${pulseHtml}
          <div style="
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: ${color};
            border: 3px solid #ffffff;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 10px;
            font-weight: bold;
            transform: ${isSelected ? 'scale(1.3)' : 'scale(1)'};
            transition: transform 0.2s ease;
          ">
            ${report.confirmations > 0 ? report.confirmations : '•'}
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14]
    });
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
      });

      const googleStreets = createGoogleMapsTileLayer('streets');
      const googleHybrid = createGoogleMapsTileLayer('hybrid');
      const googleTerrain = createGoogleMapsTileLayer('terrain');

      googleStreets.addTo(map);

      // Add Bachupally Demonstration Community Boundary Polygon
      const boundaryPolygon = L.polygon(BACHUPALLY_BOUNDARY_COORDS, {
        color: '#0284c7',
        weight: 2,
        dashArray: '5, 5',
        fillColor: '#0ea5e9',
        fillOpacity: 0.08,
      }).addTo(map);

      boundaryPolygon.bindTooltip('Bachupally Community Area (Demonstration Boundary)', {
        permanent: false,
        direction: 'center',
        className: 'font-semibold text-xs'
      });

      // Google Maps layer switcher
      L.control.layers(
        {
          'Google Maps (Streets)': googleStreets,
          'Google Maps (Satellite)': googleHybrid,
          'Google Maps (Terrain)': googleTerrain
        },
        undefined,
        { position: 'topright' }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync Markers with reports
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    // Filter to community reports only by default
    const communityReports = filterReportsByCommunity(reports);
    if (communityReports.length === 0) return;

    const bounds = L.latLngBounds([]);

    communityReports.forEach(report => {
      if (!report.latitude || !report.longitude) return;

      const isSelected = selectedReportId === report.reportId;
      const marker = L.marker([report.latitude, report.longitude], {
        icon: createMarkerIcon(report, isSelected),
        title: `${report.category}: ${report.description}`
      });

      // Custom Popup HTML
      const popupPhoto = report.photoUrl || getAppropriateWebImage(report.category, report.description);
      const popupHtml = `
        <div style="font-family: inherit; width: 260px; padding: 2px;">
          <div style="position: relative; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #e2e8f0;">
            <img src="${popupPhoto}" alt="${report.category}" referrerpolicy="no-referrer" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='${getAppropriateWebImage(report.category, report.description)}'" />
            <div style="position: absolute; top: 6px; left: 6px; background: rgba(15, 23, 42, 0.85); color: white; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">
              ${report.category}
            </div>
            <div style="position: absolute; bottom: 6px; right: 6px; background: ${getPinColor(report)}; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: bold;">
              ${report.status}
            </div>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
            ${report.description.substring(0, 75)}${report.description.length > 75 ? '...' : ''}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            📍 ${report.landmark || 'Bachupally area'}
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #475569; border-top: 1px solid #f1f5f9; padding-top: 6px; margin-bottom: 8px;">
            <span>Priority: <strong>${report.priorityLevel} (${report.priorityScore})</strong></span>
            <span>👥 <strong>${report.confirmations}</strong> confirmed</span>
          </div>
          <a href="/reports/${report.reportId}" style="display: block; text-align: center; background: #1d4ed8; color: #ffffff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600;">
            View Full Report Details &rarr;
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectReport) onSelectReport(report);
      });

      marker.addTo(map);
      markersRef.current[report.reportId] = marker;
      bounds.extend([report.latitude, report.longitude]);
    });

    // Auto-fit bounds if we have markers
    if (bounds.isValid() && communityReports.length > 1) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
    } else if (communityReports.length === 1) {
      map.setView([communityReports[0].latitude, communityReports[0].longitude], 15);
    }
  }, [reports, selectedReportId]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      {/* Leaflet container */}
      <div ref={mapContainerRef} style={{ width: '100%', height }} />

      {/* Community Focus Header Overlay */}
      <div className="absolute top-3 left-14 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200/90 flex items-center gap-2 pointer-events-auto">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <div>
          <span className="text-xs font-bold text-slate-900 block leading-tight">
            {COMMUNITY_CONFIG.badgeLabel}
          </span>
          <span className="text-[10px] text-slate-500 font-medium">
            Bachupally, Hyderabad • Demonstration Focus
          </span>
        </div>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-700 hidden sm:block">
        <div className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Status & Priority Legend</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-200" />
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-orange-200" />
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            <span>Fixed / Resolved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Low Priority Open</span>
          </div>
        </div>
      </div>

      {/* Fallback notification if tile server issues occur */}
      {tileError && (
        <div className="absolute top-3 left-3 right-3 z-20 bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Using offline cached map coordinates. Report data and markers remain fully interactive.</span>
          </div>
        </div>
      )}
    </div>
  );
};
