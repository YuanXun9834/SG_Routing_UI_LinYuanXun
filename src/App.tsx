import { useState, useEffect, useCallback } from 'react';
import Map from './components/Map';
import ControlPanel from './components/ControlPanel';
import BlockageList from './components/BlockageList';
import { routingAPI } from './services/api';
import type { Point, GeoJSON, TravelType, Blockage } from './types';
import './App.css';

function App() {
  const [serverReady, setServerReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeGeoJSON, setRouteGeoJSON] = useState<GeoJSON | null>(null);
  const [blockagesGeoJSON, setBlockagesGeoJSON] = useState<GeoJSON | null>(null);
  const [roadTypeGeoJSON, setRoadTypeGeoJSON] = useState<GeoJSON | null>(null);
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [endPoint, setEndPoint] = useState<[number, number] | null>(null);
  const [travelType, setTravelType] = useState<TravelType>('car');
  const [blockageRefreshTrigger, setBlockageRefreshTrigger] = useState(0);

  // Check server readiness
  useEffect(() => {
    const checkServer = async () => {
      try {
        const status = await routingAPI.checkReady();
        setServerReady(status === 'ready');
      } catch (error) {
        console.error('Failed to check server status:', error);
        setServerReady(false);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Load blockages on mount and when refresh is triggered
  useEffect(() => {
    loadBlockages();
  }, [blockageRefreshTrigger]);

  const loadBlockages = async () => {
    try {
      const geoJSON = await routingAPI.getBlockages();
      setBlockagesGeoJSON(geoJSON);
    } catch (error) {
      console.error('Failed to load blockages:', error);
    }
  };

  const handleRouteCalculate = useCallback(async (startPt: Point, endPt: Point) => {
    setLoading(true);
    setStartPoint([startPt.lat, startPt.long]);
    setEndPoint([endPt.lat, endPt.long]);
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
    setTravelType(type);
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
      setBlockageRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to delete blockage:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRoadTypeView = useCallback(async (roadType: string) => {
    setLoading(true);
    try {
      const geoJSON = await routingAPI.getRoadTypeGeoJSON(roadType);
      setRoadTypeGeoJSON(geoJSON);
    } catch (error) {
      console.error('Failed to load road type:', error);
      alert('Failed to load road type. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    // Optional: Allow clicking on map to set points
    console.log('Map clicked at:', lat, lng);
  }, []);

  return (
    <div className="app">
      <ControlPanel
        onRouteCalculate={handleRouteCalculate}
        onTravelTypeChange={handleTravelTypeChange}
        onBlockageAdd={handleBlockageAdd}
        onBlockageDelete={handleBlockageDelete}
        onRoadTypeView={handleRoadTypeView}
        serverReady={serverReady}
        loading={loading}
      />
      <div className="map-container">
        <Map
          routeGeoJSON={routeGeoJSON}
          blockagesGeoJSON={blockagesGeoJSON}
          roadTypeGeoJSON={roadTypeGeoJSON}
          startPoint={startPoint}
          endPoint={endPoint}
          onMapClick={handleMapClick}
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

