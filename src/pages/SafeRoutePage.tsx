import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import { SafeRouteMap } from '../components/routes/SafeRouteMap';
import { RouteSearchPanel } from '../components/routes/RouteSearchPanel';
import { RouteComparisonCard } from '../components/routes/RouteComparisonCard';
import {
  COMMUNITY_LANDMARKS,
  COMMUNITY_NAME,
  getLandmarkById
} from '../data/communityLandmarks';
import { SafeRoute, SafetyMode } from '../types/route';
import { getCommunityRoutes } from '../services/routingService';
import { evaluateRouteRisk, compareAndClassifyRoutes } from '../utils/routeRisk';
import {
  ShieldCheck,
  Compass,
  AlertTriangle,
  Route as RouteIcon,
  Sparkles,
  Info
} from 'lucide-react';

export const SafeRoutePage: React.FC = () => {
  const { reports, showToast } = useReports();

  // Search Origin and Destination state
  const [originId, setOriginId] = useState<string>('bachupally-x-roads');
  const [destinationId, setDestinationId] = useState<string>('vnr-college-gate');
  const [customOriginCoords, setCustomOriginCoords] = useState<[number, number] | undefined>(undefined);

  // Safety Mode: general | night | rain | accessibility
  const [safetyMode, setSafetyMode] = useState<SafetyMode>('general');

  // Computed routes and loading state
  const [routes, setRoutes] = useState<SafeRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [chosenRouteId, setChosenRouteId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [routingSource, setRoutingSource] = useState<'live-osrm' | 'demo-fallback'>('live-osrm');
  const [providerNote, setProviderNote] = useState<string>('');

  // Resolve current Coordinates
  const startCoords: [number, number] = useMemo(() => {
    if (originId === 'current-location' && customOriginCoords) {
      return customOriginCoords;
    }
    const landmark = getLandmarkById(originId) || COMMUNITY_LANDMARKS[0];
    return landmark.coordinates;
  }, [originId, customOriginCoords]);

  const destCoords: [number, number] = useMemo(() => {
    const landmark = getLandmarkById(destinationId) || COMMUNITY_LANDMARKS[5];
    return landmark.coordinates;
  }, [destinationId]);

  const startLabel = useMemo(() => {
    if (originId === 'current-location') return 'Current Location (Device GPS)';
    const landmark = getLandmarkById(originId);
    return landmark ? landmark.name : 'Origin';
  }, [originId]);

  const destLabel = useMemo(() => {
    const landmark = getLandmarkById(destinationId);
    return landmark ? landmark.name : 'Destination';
  }, [destinationId]);

  // Main calculation routine
  const calculateRoutes = useCallback(
    async (mode: SafetyMode = safetyMode) => {
      setLoading(true);
      try {
        const result = await getCommunityRoutes(startCoords, destCoords);
        setRoutingSource(result.source);
        setProviderNote(result.providerNote);

        // Evaluate risk against all open community reports in ReportContext
        const evaluated = result.routes.map(raw => {
          const evalResult = evaluateRouteRisk(raw, reports, mode);
          return {
            ...raw,
            ...evalResult
          };
        });

        // Classify and recommend
        const classified = compareAndClassifyRoutes(evaluated, mode);
        setRoutes(classified);

        if (classified.length > 0) {
          // Select recommended or fastest by default
          const recommended = classified.find(r => r.isRecommended) || classified[0];
          setSelectedRouteId(recommended.id);
        }
      } catch (err) {
        showToast('Unable to fetch route geometry. Using offline community streets.', 'info');
      } finally {
        setLoading(false);
      }
    },
    [startCoords, destCoords, reports, safetyMode, showToast]
  );

  // Automatically calculate routes on initial mount so map is populated immediately!
  useEffect(() => {
    calculateRoutes();
  }, [originId, destinationId, customOriginCoords]);

  // When safety mode changes, recalculate route risks immediately
  const handleSafetyModeChange = (newMode: SafetyMode) => {
    setSafetyMode(newMode);
    calculateRoutes(newMode);
    showToast(`Recalculated route risks for ${newMode.toUpperCase()} mode.`, 'info');
  };

  const handleOriginChange = (id: string, coords?: [number, number]) => {
    setOriginId(id);
    if (coords) {
      setCustomOriginCoords(coords);
    } else {
      setCustomOriginCoords(undefined);
    }
  };

  const handleDestinationChange = (id: string) => {
    setDestinationId(id);
  };

  const handleSwapEndpoints = () => {
    // Cannot swap if origin is custom location without reverse landmark
    if (originId === 'current-location') {
      showToast('Cannot reverse when origin is dynamic GPS location.', 'info');
      return;
    }
    const oldOrigin = originId;
    setOriginId(destinationId);
    setDestinationId(oldOrigin);
  };

  const handleChooseRoute = (route: SafeRoute) => {
    setChosenRouteId(route.id);
    showToast(`Selected "${route.name}" (${route.riskLevel}). Safe travel!`, 'success');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
      {/* Feature Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-teal-950 rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              SafeRoute+ Engine
            </span>
            <span className="text-xs text-slate-300">
              Community Ward: <strong className="text-white">{COMMUNITY_NAME}</strong>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Safer Alternative Route
          </h1>

          <p className="text-teal-200 text-sm font-semibold italic mt-0.5">
            “Avoid the risk. Choose the safer way.”
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-300 font-medium">Active Hazard Monitoring</div>
            <div className="text-sm font-bold text-teal-300">
              {reports.filter(r => r.status !== 'Fixed').length} Unresolved Hazards
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Map-First Workspace */}
      {/* Desktop: 65% Interactive Map, 35% Search & Comparison Panel */}
      {/* Mobile: Map prominently on top, comparison cards below */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Search & Comparison Panel (Desktop 4-5 cols, Mobile full width) */}
        <div className="lg:col-span-4 xl:col-span-4 space-y-4 order-2 lg:order-1">
          {/* Waypoint Search Controls */}
          <RouteSearchPanel
            originId={originId}
            destinationId={destinationId}
            safetyMode={safetyMode}
            loading={loading}
            routingProviderNote={providerNote}
            routingSource={routingSource}
            onOriginChange={handleOriginChange}
            onDestinationChange={handleDestinationChange}
            onSafetyModeChange={handleSafetyModeChange}
            onSwapEndpoints={handleSwapEndpoints}
            onFindRoutes={() => calculateRoutes(safetyMode)}
          />

          {/* Route Comparison Cards */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <RouteIcon className="w-4 h-4 text-blue-600" />
                <span>Available Routes ({routes.length})</span>
              </h2>
              <span className="text-xs text-slate-500">
                Synchronized with Map
              </span>
            </div>

            {routes.map(route => (
              <RouteComparisonCard
                key={route.id}
                route={route}
                isSelected={route.id === selectedRouteId}
                isChosen={route.id === chosenRouteId}
                onSelect={() => setSelectedRouteId(route.id)}
                onChoose={() => handleChooseRoute(route)}
              />
            ))}

            {routes.length === 0 && !loading && (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                No route found for selected points. Try switching starting landmark.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Map-First Interactive Display (Desktop 8 cols, Mobile order-1 on top) */}
        <div className="lg:col-span-8 xl:col-span-8 order-1 lg:order-2 h-[520px] sm:h-[620px] lg:h-[760px] sticky top-20">
          <SafeRouteMap
            routes={routes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={id => setSelectedRouteId(id)}
            startCoords={startCoords}
            destCoords={destCoords}
            startLabel={startLabel}
            destLabel={destLabel}
            reports={reports}
            safetyMode={safetyMode}
            communityName={COMMUNITY_NAME}
          />
        </div>
      </div>
    </div>
  );
};

export default SafeRoutePage;
