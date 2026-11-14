import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { createGoogleMapsTileLayer } from '../../utils/mapConfig';
import {
  COMMUNITY_CONFIG,
  BACHUPALLY_BOUNDARY_COORDS,
  isWithinCommunity,
  OUTSIDE_COMMUNITY_MESSAGE
} from '../../utils/communityConfig';
import { MapPin, Navigation, Info, Check, AlertTriangle } from 'lucide-react';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onChangeLocation: (lat: number, lng: number) => void;
  height?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onChangeLocation,
  height = '320px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [geoStatus, setGeoStatus] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Quick preset demo spots in Bachupally community for easy testing
  const presets = [
    { name: 'Bachupally X Roads', lat: 17.5382, lng: 78.3828 },
    { name: 'VNR VJIET College Rd', lat: 17.5404, lng: 78.3865 },
    { name: 'Silver Oaks School Lane', lat: 17.5342, lng: 78.3758 },
    { name: 'Pragathi Nagar - Bachupally Rd', lat: 17.5265, lng: 78.3890 },
  ];

  const createPickerIcon = () => {
    return L.divIcon({
      className: 'picker-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: #1d4ed8;
          border: 3px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 8px; height: 8px; background: white; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        zoomControl: true
      });

      createGoogleMapsTileLayer('streets').addTo(map);

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

      const marker = L.marker([latitude, longitude], {
        icon: createPickerIcon(),
        draggable: true
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChangeLocation(parseFloat(pos.lat.toFixed(6)), parseFloat(pos.lng.toFixed(6)));
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChangeLocation(parseFloat(e.latlng.lat.toFixed(6)), parseFloat(e.latlng.lng.toFixed(6)));
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync marker position if props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const current = markerRef.current.getLatLng();
      if (Math.abs(current.lat - latitude) > 0.0001 || Math.abs(current.lng - longitude) > 0.0001) {
        markerRef.current.setLatLng([latitude, longitude]);
        mapInstanceRef.current.panTo([latitude, longitude]);
      }
    }
  }, [latitude, longitude]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('Device GPS not supported; sample Bachupally location retained.');
      return;
    }

    setIsLocating(true);
    setGeoStatus('Locating device...');

    navigator.geolocation.getCurrentPosition(
      pos => {
        setIsLocating(false);
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        onChangeLocation(lat, lng);
        setGeoStatus('GPS location acquired.');
        setTimeout(() => setGeoStatus(null), 3500);
      },
      err => {
        setIsLocating(false);
        setGeoStatus('Location permission denied or unavailable. Sample Bachupally coordinates active.');
        setTimeout(() => setGeoStatus(null), 4000);
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Click map or drag pin to position the issue</span>
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Acquiring GPS...' : 'Use My Current GPS'}</span>
        </button>
      </div>

      {geoStatus && (
        <div className="text-xs p-2 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-2 animate-in fade-in">
          <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>{geoStatus}</span>
        </div>
      )}

      {/* Map Element */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        <div ref={mapContainerRef} style={{ width: '100%', height }} />

        <div className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-700 shadow-sm border border-slate-200">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </div>

        {/* Small Community View Badge */}
        <div className="absolute top-2 left-2 z-20 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow-sm border border-slate-200 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{COMMUNITY_CONFIG.badgeLabel}</span>
        </div>
      </div>

      {/* Community Boundary Check Indicator */}
      {isWithinCommunity(latitude, longitude) ? (
        <div className="text-xs p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="font-medium">Inside Bachupally Community demonstration boundary.</span>
        </div>
      ) : (
        <div className="text-xs p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 flex items-start gap-2 shadow-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-amber-900">Outside Bachupally Community Boundary</div>
            <div className="text-[11px] text-amber-800 leading-snug">
              {OUTSIDE_COMMUNITY_MESSAGE}
            </div>
          </div>
        </div>
      )}

      {/* Demo Preset Buttons */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500 font-medium">Sample Locations:</span>
        {presets.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onChangeLocation(preset.lat, preset.lng)}
            className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] transition"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Editable Coordinate Inputs */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Latitude Coordinate
          </label>
          <input
            type="number"
            step="0.0001"
            value={latitude}
            onChange={e => onChangeLocation(parseFloat(e.target.value) || 0, longitude)}
            className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Longitude Coordinate
          </label>
          <input
            type="number"
            step="0.0001"
            value={longitude}
            onChange={e => onChangeLocation(latitude, parseFloat(e.target.value) || 0)}
            className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          />
        </div>
      </div>
    </div>
  );
};
