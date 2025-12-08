import { useState, useEffect, useCallback } from 'react';
import Map from './components/Map';
import ControlPanel from './components/ControlPanel';
import BlockageList from './components/BlockageList';
import { routingAPI } from './services/api';
import type { Point, GeoJSON, TravelType, Blockage } from './types';
import './App.css';

type PlanMode = 'idle' | 'selecting_start' | 'selecting_end';
type BlockageMode = 'idle' | 'selecting_location';

function App() {
  const [serverReady, setServerReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeGeoJSON, setRouteGeoJSON] = useState<GeoJSON | null>(null);
  const [blockagesGeoJSON, setBlockagesGeoJSON] = useState<GeoJSON | null>(null);
  const [roadTypeGeoJSON, setRoadTypeGeoJSON] = useState<GeoJSON | null>(null);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [startPointForRoute, setStartPointForRoute] = useState<Point | null>(null);
  const [currentStartPoint, setCurrentStartPoint] = useState<Point | null>(null);
  const [currentEndPoint, setCurrentEndPoint] = useState<Point | null>(null);
  const [blockageRefreshTrigger, setBlockageRefreshTrigger] = useState(0);
  const [planMode, setPlanMode] = useState<PlanMode>('idle');
  const [blockageMode, setBlockageMode] = useState<BlockageMode>('idle');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [blockageLocation, setBlockageLocation] = useState<Point | null>(null);

  // Reset stored start point when plan mode is reset
  useEffect(() => {
    if (planMode === 'idle') {
      setStartPointForRoute(null);
    }
  }, [planMode]);

  // Check server readiness function (can be called manually)
  const checkServer = useCallback(async () => {
    try {
      const status = await routingAPI.checkReady();
      const ready = status === 'ready';
      setServerReady(ready);
      if (ready) {
        console.log('Server is ready!');
      } else {
        console.log('Server status: waiting...');
      }
      return ready;
    } catch (error: any) {
      console.error('Failed to check server status:', error);
      // Only set to false if it's a real error, not just "wait"
      if (error?.response?.status >= 400) {
        setServerReady(false);
      }
      return false;
    }
  }, []);

  // Check server readiness on mount and periodically
  useEffect(() => {
    let isMounted = true;
    
    const checkServerPeriodic = async () => {
      if (isMounted) {
        await checkServer();
      }
    };

    checkServerPeriodic();
    const interval = setInterval(checkServerPeriodic, 5000); // Check every 5 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkServer]);

  // Load blockages on mount and when refresh is triggered
  useEffect(() => {
    loadBlockages();
  }, [blockageRefreshTrigger]);

  const loadBlockages = async () => {
    try {
      const geoJSON = await routingAPI.getBlockages();
      // Validate GeoJSON before setting it
      if (geoJSON && geoJSON.type === 'FeatureCollection') {
        // Valid GeoJSON - set it even if features array is empty
        setBlockagesGeoJSON(geoJSON);
      } else {
        // Invalid GeoJSON - set to empty FeatureCollection
        console.warn('Invalid GeoJSON received for blockages, using empty FeatureCollection');
        setBlockagesGeoJSON({
          type: 'FeatureCollection',
          features: [],
        });
      }
    } catch (error) {
      console.error('Failed to load blockages:', error);
      // Set to empty FeatureCollection on error
      setBlockagesGeoJSON({
        type: 'FeatureCollection',
        features: [],
      });
    }
  };

  const handleRouteCalculate = useCallback(async (startPt: Point, endPt: Point) => {
    setLoading(true);
    setStartPoint([startPt.lat, startPt.long]);
    setEndPoint([endPt.lat, endPt.long]);
    // Update current points to keep ControlPanel in sync
    setCurrentStartPoint(startPt);
    setCurrentEndPoint(endPt);
    setRouteGeoJSON(null);

    try {
      const route = await routingAPI.getRoute({
        startPt,
        endPt,
      });
      setRouteGeoJSON(route);
    } catch (error) {
      console.error('Failed to calculate route:', error);
      alert('Failed to calculate route. Please check your points and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTravelTypeChange = useCallback((type: TravelType) => {
    console.log('Travel type changed to', type);
    // Clear current route when travel type changes
    setRouteGeoJSON(null);
  }, []);

  const handleBlockageAdd = useCallback(async (blockage: Blockage) => {
    setLoading(true);
    try {
      await routingAPI.addBlockage(blockage);
      setBlockageRefreshTrigger((prev) => prev + 1);
      alert('Blockage added successfully!');
    } catch (error) {
      console.error('Failed to add blockage:', error);
      alert('Failed to add blockage. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBlockageDelete = useCallback(async (name: string) => {
    setLoading(true);
    try {
      await routingAPI.deleteBlockage(name);
      // Trigger refresh to update the blockage list
      setBlockageRefreshTrigger((prev) => prev + 1);
      // Don't throw error - deletion succeeded, refresh will happen automatically
    } catch (error: any) {
      console.error('Failed to delete blockage:', error);
      // Only show error if it's a real deletion failure (4xx/5xx), not if it's already deleted
      const status = error?.response?.status;
      if (status && status >= 400 && status < 500) {
        // Client error - blockage might not exist or invalid request
        alert(`Failed to delete blockage: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
      } else if (status && status >= 500) {
        // Server error
        alert('Server error while deleting blockage. Please try again.');
      } else {
        // Network error or other - might have succeeded, just refresh
        console.warn('Network error during deletion, but deletion may have succeeded. Refreshing list...');
        setBlockageRefreshTrigger((prev) => prev + 1);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearRoadType = useCallback(() => {
    setRoadTypeGeoJSON(null);
  }, []);

  const handleClearRoute = useCallback(() => {
    setRouteGeoJSON(null);
    setStartPoint(null);
    setEndPoint(null);
    setCurrentStartPoint(null);
    setCurrentEndPoint(null);
  }, []);

  const handleRoadTypeView = useCallback(async (roadType: string) => {
    setLoading(true);
    try {
      console.log('Loading road type:', roadType);
      const geoJSON = await routingAPI.getRoadTypeGeoJSON(roadType);
      console.log('Road type GeoJSON received:', geoJSON);
      console.log('GeoJSON type:', geoJSON?.type);
      console.log('Number of features:', geoJSON?.features?.length);
      
      // Check if GeoJSON is valid
      if (!geoJSON) {
        console.warn('Road type GeoJSON is null or undefined');
        alert('No road data found for the selected road type.');
        setRoadTypeGeoJSON(null);
        return;
      }
      
      // Check if it's a FeatureCollection with features
      if (geoJSON.type === 'FeatureCollection' && geoJSON.features && Array.isArray(geoJSON.features)) {
        if (geoJSON.features.length > 0) {
          console.log('Setting road type GeoJSON with', geoJSON.features.length, 'features');
          setRoadTypeGeoJSON(geoJSON);
        } else {
          console.warn('Road type GeoJSON has no features');
          alert('No road data found for the selected road type.');
          setRoadTypeGeoJSON(null);
        }
      } else {
        // Try to handle if it's a single Feature or Geometry
        console.log('Road type GeoJSON is not a FeatureCollection, attempting to convert');
        const geoJSONAny = geoJSON as any;
        if (geoJSONAny.type === 'Feature' || geoJSONAny.geometry) {
          // Wrap single feature in FeatureCollection
          const wrappedGeoJSON: GeoJSON = {
            type: 'FeatureCollection',
            features: [geoJSONAny.type === 'Feature' ? geoJSONAny : { 
              type: 'Feature', 
              geometry: geoJSONAny.geometry, 
              properties: {} 
            }]
          };
          console.log('Wrapped GeoJSON:', wrappedGeoJSON);
          setRoadTypeGeoJSON(wrappedGeoJSON);
        } else {
          console.warn('Road type GeoJSON format is not recognized:', geoJSON);
          alert('Invalid road data format received from server.');
          setRoadTypeGeoJSON(null);
        }
      }
    } catch (error: any) {
      console.error('Failed to load road type:', error);
      console.error('Error details:', error?.response?.data || error?.message);
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      alert(`Failed to load road type: ${errorMessage}. Please check the browser console for details.`);
      setRoadTypeGeoJSON(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const [updateStartPointFn, setUpdateStartPointFn] = useState<((point: Point) => void) | null>(null);
  const [updateEndPointFn, setUpdateEndPointFn] = useState<((point: Point) => void) | null>(null);

  const handleStartPointUpdate = useCallback((point: Point | null) => {
    if (point && point.lat !== undefined && point.long !== undefined) {
      setStartPoint([point.lat, point.long]);
    }
  }, []);

  const handleEndPointUpdate = useCallback((point: Point | null) => {
    if (point && point.lat !== undefined && point.long !== undefined) {
      setEndPoint([point.lat, point.long]);
    }
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (planMode === 'selecting_start') {
      // Update start point in ControlPanel
      const point: Point = { lat, long: lng, description: '' };
      if (updateStartPointFn) {
        updateStartPointFn(point);
      }
      setStartPoint([lat, lng]);
      setStartPointForRoute(point); // Store for route calculation
      setCurrentStartPoint(point); // Store current point for ControlPanel
      setPlanMode('selecting_end');
    } else if (planMode === 'selecting_end') {
      // Update end point
      const point: Point = { lat, long: lng, description: '' };
      if (updateEndPointFn) {
        updateEndPointFn(point);
      }
      setEndPoint([lat, lng]);
      setCurrentEndPoint(point); // Store current point for ControlPanel
      setPlanMode('idle');
      
      // Automatically calculate route if we have both start and end points
      if (startPointForRoute && serverReady) {
        handleRouteCalculate(startPointForRoute, point);
      }
    } else if (blockageMode === 'selecting_location') {
      // Store blockage location
      const point: Point = { lat, long: lng, description: '' };
      setBlockageLocation(point);
      setBlockageMode('idle');
      // The ControlPanel will handle showing the form
    }
  }, [planMode, blockageMode, updateStartPointFn, updateEndPointFn, startPointForRoute, serverReady, handleRouteCalculate]);

  return (
    <div className="app">
      <ControlPanel
        onRouteCalculate={handleRouteCalculate}
        onTravelTypeChange={handleTravelTypeChange}
        onBlockageAdd={handleBlockageAdd}
        onRoadTypeView={handleRoadTypeView}
        onPlanModeChange={setPlanMode}
        onStartPointUpdate={handleStartPointUpdate}
        onEndPointUpdate={handleEndPointUpdate}
        onSetStartPointUpdate={setUpdateStartPointFn}
        onSetEndPointUpdate={setUpdateEndPointFn}
        onServerCheck={checkServer}
        onBlockageModeChange={setBlockageMode}
        blockageMode={blockageMode}
        blockageLocation={blockageLocation}
        onBlockageLocationSet={setBlockageLocation}
        currentStartPoint={currentStartPoint}
        currentEndPoint={currentEndPoint}
        planMode={planMode}
        serverReady={serverReady}
        loading={loading}
        isCollapsed={isPanelCollapsed}
        onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
      />
      <div className="map-container">
        {isPanelCollapsed && (
          <button
            className="expand-panel-button"
            onClick={() => setIsPanelCollapsed(false)}
            title="Expand panel"
          >
            ▶
          </button>
        )}
        <Map
          routeGeoJSON={routeGeoJSON}
          blockagesGeoJSON={blockagesGeoJSON}
          roadTypeGeoJSON={roadTypeGeoJSON}
          startPoint={startPoint}
          endPoint={endPoint}
          onMapClick={planMode !== 'idle' || blockageMode !== 'idle' ? handleMapClick : undefined}
          onClearRoadType={handleClearRoadType}
          onClearRoute={handleClearRoute}
          panelCollapsed={isPanelCollapsed}
        />
        <BlockageList
          onDelete={handleBlockageDelete}
          refreshTrigger={blockageRefreshTrigger}
        />
      </div>
    </div>
  );
}

export default App;

