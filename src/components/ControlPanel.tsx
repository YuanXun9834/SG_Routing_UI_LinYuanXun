import { useState, useEffect } from 'react';
import type { TravelType, Point, Blockage } from '../types';
import { ROAD_TYPE_CONFIG } from '../config/roadTypes';
import { routingAPI } from '../services/api';
import LocationSearch from './LocationSearch';
import './ControlPanel.css';

type PlanMode = 'idle' | 'selecting_start' | 'selecting_end';
type BlockageMode = 'idle' | 'selecting_location';

interface ControlPanelProps {
  onRouteCalculate: (startPt: Point, endPt: Point) => void;
  onTravelTypeChange: (travelType: TravelType) => void;
  onBlockageAdd: (blockage: Blockage) => void;
  onRoadTypeView: (roadType: string) => void;
  onPlanModeChange: (mode: PlanMode) => void;
  onStartPointUpdate?: (point: Point) => void;
  onEndPointUpdate?: (point: Point) => void;
  onSetStartPointUpdate?: (fn: (point: Point) => void) => void;
  onSetEndPointUpdate?: (fn: (point: Point) => void) => void;
  onServerCheck?: () => Promise<boolean>;
  onBlockageModeChange?: (mode: BlockageMode) => void;
  blockageMode?: BlockageMode;
  blockageLocation?: Point | null;
  onBlockageLocationSet?: (location: Point | null) => void;
  currentStartPoint?: Point | null;
  currentEndPoint?: Point | null;
  planMode: PlanMode;
  serverReady: boolean;
  loading: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function ControlPanel({
  onRouteCalculate,
  onTravelTypeChange,
  onBlockageAdd,
  onRoadTypeView,
  onPlanModeChange,
  onStartPointUpdate,
  onEndPointUpdate,
  onSetStartPointUpdate,
  onSetEndPointUpdate,
  onServerCheck,
  onBlockageModeChange,
  blockageMode = 'idle',
  blockageLocation,
  onBlockageLocationSet,
  currentStartPoint,
  currentEndPoint,
  planMode,
  serverReady,
  loading,
  isCollapsed = false,
  onToggleCollapse,
}: ControlPanelProps) {
  const [travelType, setTravelType] = useState<TravelType>('car');
  const [startPoint, setStartPoint] = useState<Point>({
    long: 103.93443316267717,
    lat: 1.323996524195518,
    description: 'Bedok 85',
  });
  const [endPoint, setEndPoint] = useState<Point>({
    long: 103.75741069280338,
    lat: 1.3783396904609801,
    description: 'Choa Chu Kang Road',
  });

  // Sync with external state if provided
  useEffect(() => {
    if (currentStartPoint) {
      setStartPoint(currentStartPoint);
    }
  }, [currentStartPoint]);

  useEffect(() => {
    if (currentEndPoint) {
      setEndPoint(currentEndPoint);
    }
  }, [currentEndPoint]);
  const [allRoadTypes, setAllRoadTypes] = useState<string[]>([]);
  const [validRoadTypes, setValidRoadTypes] = useState<string[]>([]);
  const [selectedRoadType, setSelectedRoadType] = useState<string>('');
  const [blockageName, setBlockageName] = useState('');
  const [blockageDescription, setBlockageDescription] = useState('');
  const [blockageRadius, setBlockageRadius] = useState(200);
  const [checkingServer, setCheckingServer] = useState(false);

  useEffect(() => {
    loadRoadTypes();
    loadValidRoadTypes();
  }, []);

  useEffect(() => {
    onTravelTypeChange(travelType);
    // Only apply road types if they've been loaded
    if (allRoadTypes.length > 0) {
      applyRoadTypesForTravelType(travelType);
    }
  }, [travelType, allRoadTypes]);

  // Expose update functions for map clicks
  useEffect(() => {
    if (onSetStartPointUpdate) {
      const updateFn = (point: Point | null) => {
        if (point) {
          setStartPoint(point);
          if (onStartPointUpdate) {
            onStartPointUpdate(point);
          }
        }
      };
      onSetStartPointUpdate(updateFn);
    }
    if (onSetEndPointUpdate) {
      const updateFn = (point: Point | null) => {
        if (point) {
          setEndPoint(point);
          if (onEndPointUpdate) {
            onEndPointUpdate(point);
          }
        }
      };
      onSetEndPointUpdate(updateFn);
    }
    // Only run when the setter functions change, not the callback functions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSetStartPointUpdate, onSetEndPointUpdate]);

  const loadRoadTypes = async () => {
    try {
      const types = await routingAPI.getAllRoadTypes();
      setAllRoadTypes(types);
    } catch (error) {
      console.error('Failed to load road types:', error);
    }
  };

  const loadValidRoadTypes = async () => {
    try {
      const types = await routingAPI.getValidRoadTypes();
      setValidRoadTypes(types);
    } catch (error) {
      console.error('Failed to load valid road types:', error);
    }
  };

  const handleServerCheck = async () => {
    if (!onServerCheck) return;
    setCheckingServer(true);
    try {
      const wasReady = serverReady;
      const isReady = await onServerCheck();
      // If server just became ready, reload road types
      if (!wasReady && isReady) {
        await loadRoadTypes();
        await loadValidRoadTypes();
        // Reapply current travel type road types
        if (allRoadTypes.length > 0) {
          await applyRoadTypesForTravelType(travelType);
        }
      }
    } catch (error) {
      console.error('Failed to check server:', error);
    } finally {
      setCheckingServer(false);
    }
  };

  const applyRoadTypesForTravelType = async (type: TravelType) => {
    try {
      const roadTypes = ROAD_TYPE_CONFIG[type];
      const availableTypes = roadTypes.filter((rt) => allRoadTypes.includes(rt));
      if (availableTypes.length > 0) {
        await routingAPI.changeValidRoadTypes(availableTypes);
        await loadValidRoadTypes();
      }
    } catch (error) {
      console.error('Failed to change road types:', error);
      // Don't throw - just log the error to prevent app crash
    }
  };

  const handleCalculateRoute = () => {
    // Use current points from props if available (from map clicks), otherwise use internal state
    const startPt = currentStartPoint || startPoint;
    const endPt = currentEndPoint || endPoint;
    onRouteCalculate(startPt, endPt);
  };

  const handleChooseBlockageLocation = () => {
    if (onBlockageModeChange) {
      onBlockageModeChange('selecting_location');
    }
  };

  const handleAddBlockage = () => {
    if (!blockageName.trim()) {
      alert('Please enter a blockage name');
      return;
    }
    if (!blockageLocation) {
      alert('Please choose a location by clicking on the map');
      return;
    }
    const blockage: Blockage = {
      point: blockageLocation,
      radius: blockageRadius,
      name: blockageName,
      description: blockageDescription,
    };
    onBlockageAdd(blockage);
    setBlockageName('');
    setBlockageDescription('');
    if (onBlockageLocationSet) {
      onBlockageLocationSet(null);
    }
  };

  const handleViewRoadType = () => {
    if (selectedRoadType) {
      onRoadTypeView(selectedRoadType);
    }
  };

  return (
    <div className={`control-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="control-panel-header">
        <h1>{!isCollapsed && '🗺️ Route Planner'}</h1>
        {onToggleCollapse && (
          <button
            className="collapse-button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {isCollapsed ? '▶' : '◀'}
          </button>
        )}
      </div>
      {!isCollapsed && (
      <div className="control-panel-content">
      <div className="panel-section">
        <h2>⚡ Server Status</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className={`status-indicator ${serverReady ? 'ready' : 'waiting'}`}>
            {serverReady ? '✓ Ready' : '⏳ Waiting...'}
          </div>
          <button
            className="secondary-button"
            onClick={handleServerCheck}
            disabled={checkingServer || loading}
            style={{ padding: '6px 12px', fontSize: '12px', minWidth: 'auto' }}
            title="Manually check server status and reload road types"
          >
            {checkingServer ? '🔄 Checking...' : '🔄 Check'}
          </button>
        </div>
        {!serverReady && (
          <small style={{ display: 'block', marginTop: '5px', color: '#666', fontSize: '11px' }}>
            The server may take a few moments to start. Routes can still be calculated.
          </small>
        )}
      </div>

      <div className="panel-section">
        <h2>🚗 Travel Type</h2>
        <div className="travel-type-buttons">
          <button
            className={travelType === 'car' ? 'active' : ''}
            onClick={() => setTravelType('car')}
            disabled={loading}
          >
            🚗 Car
          </button>
          <button
            className={travelType === 'bicycle' ? 'active' : ''}
            onClick={() => setTravelType('bicycle')}
            disabled={loading}
          >
            🚲 Bicycle
          </button>
          <button
            className={travelType === 'walk' ? 'active' : ''}
            onClick={() => setTravelType('walk')}
            disabled={loading}
          >
            🚶 Walk
          </button>
        </div>
        <div className="road-types-info">
          <small>Active road types: {validRoadTypes.join(', ')}</small>
        </div>
      </div>

      <div className="panel-section">
        <h2>🗺️ Route Planning</h2>
        <div style={{ marginBottom: '10px' }}>
          <button
            className={`plan-mode-button ${planMode !== 'idle' ? 'active' : ''}`}
            onClick={() => {
              if (planMode === 'idle') {
                onPlanModeChange('selecting_start');
              } else {
                onPlanModeChange('idle');
              }
            }}
            disabled={loading}
          >
            {planMode === 'idle' && '📍 Enter Plan Mode'}
            {planMode === 'selecting_start' && '📍 Click on map for START point'}
            {planMode === 'selecting_end' && '📍 Click on map for END point'}
          </button>
          {planMode !== 'idle' && (
            <div className="plan-mode-hint">
              {planMode === 'selecting_start' && '📍 Click anywhere on the map to set the start point'}
              {planMode === 'selecting_end' && '📍 Click anywhere on the map to set the end point'}
            </div>
          )}
        </div>
        <div className="input-group">
          <label>Start Point</label>
          <LocationSearch
            value={startPoint}
            onChange={(point) => {
              setStartPoint(point);
              if (onStartPointUpdate) {
                onStartPointUpdate(point);
              }
            }}
            placeholder="Search for start location..."
            disabled={loading}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="number"
              placeholder="Longitude"
              value={startPoint.long}
              onChange={(e) => {
                const newPoint = { ...startPoint, long: parseFloat(e.target.value) || 0 };
                setStartPoint(newPoint);
                if (onStartPointUpdate) {
                  onStartPointUpdate(newPoint);
                }
              }}
              step="0.000001"
              style={{ flex: 1 }}
            />
            <input
              type="number"
              placeholder="Latitude"
              value={startPoint.lat}
              onChange={(e) => {
                const newPoint = { ...startPoint, lat: parseFloat(e.target.value) || 0 };
                setStartPoint(newPoint);
                if (onStartPointUpdate) {
                  onStartPointUpdate(newPoint);
                }
              }}
              step="0.000001"
              style={{ flex: 1 }}
            />
          </div>
        </div>
        <div className="input-group">
          <label>End Point</label>
          <LocationSearch
            value={endPoint}
            onChange={(point) => {
              setEndPoint(point);
              if (onEndPointUpdate) {
                onEndPointUpdate(point);
              }
            }}
            placeholder="Search for end location..."
            disabled={loading}
          />
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="number"
              placeholder="Longitude"
              value={endPoint.long}
              onChange={(e) => {
                const newPoint = { ...endPoint, long: parseFloat(e.target.value) || 0 };
                setEndPoint(newPoint);
                if (onEndPointUpdate) {
                  onEndPointUpdate(newPoint);
                }
              }}
              step="0.000001"
              style={{ flex: 1 }}
            />
            <input
              type="number"
              placeholder="Latitude"
              value={endPoint.lat}
              onChange={(e) => {
                const newPoint = { ...endPoint, lat: parseFloat(e.target.value) || 0 };
                setEndPoint(newPoint);
                if (onEndPointUpdate) {
                  onEndPointUpdate(newPoint);
                }
              }}
              step="0.000001"
              style={{ flex: 1 }}
            />
          </div>
        </div>
        <button
          className="primary-button"
          onClick={handleCalculateRoute}
          disabled={loading || !startPoint || !endPoint || !startPoint.lat || !startPoint.long || !endPoint.lat || !endPoint.long}
          title={!serverReady ? 'Server is not ready yet. Please wait...' : ''}
        >
          Calculate Route {!serverReady && '(Server not ready)'}
        </button>
      </div>

      <div className="panel-section">
        <h2>🛣️ View Road Types</h2>
        <select
          value={selectedRoadType}
          onChange={(e) => setSelectedRoadType(e.target.value)}
          disabled={loading}
        >
          <option value="">Select a road type</option>
          {allRoadTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className="secondary-button"
          onClick={handleViewRoadType}
          disabled={!selectedRoadType || loading}
        >
          View on Map
        </button>
      </div>

      <div className="panel-section">
        <h2>🚧 Blockage Management</h2>
        {blockageMode === 'selecting_location' && (
          <div style={{ 
            padding: '10px', 
            background: '#fff3cd', 
            borderRadius: '8px', 
            marginBottom: '15px',
            border: '1px solid #ffc107'
          }}>
            <strong>📍 Click on the map to choose blockage location</strong>
          </div>
        )}
        {blockageLocation && (
          <div style={{ 
            padding: '8px', 
            background: '#d4edda', 
            borderRadius: '6px', 
            marginBottom: '10px',
            fontSize: '12px',
            color: '#155724'
          }}>
            ✓ Location selected: {blockageLocation.lat.toFixed(6)}, {blockageLocation.long.toFixed(6)}
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <LocationSearch
            value={blockageLocation || { long: 0, lat: 0 }}
            onChange={(point) => {
              if (onBlockageLocationSet) {
                onBlockageLocationSet(point);
              }
            }}
            placeholder="Search for blockage location..."
            disabled={loading || blockageMode === 'selecting_location'}
          />
        </div>
        <button
          className={`secondary-button ${blockageMode === 'selecting_location' ? 'active' : ''}`}
          onClick={handleChooseBlockageLocation}
          disabled={loading || blockageMode === 'selecting_location'}
          style={{ marginBottom: '15px', width: '100%' }}
        >
          {blockageMode === 'selecting_location' 
            ? '📍 Click on map to choose location...' 
            : '📍 Choose Location on Map'}
        </button>
        {blockageLocation && (
          <>
            <div className="input-group">
              <label>Blockage Name *</label>
              <input
                type="text"
                placeholder="Enter blockage name"
                value={blockageName}
                onChange={(e) => setBlockageName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <input
                type="text"
                placeholder="Enter description (optional)"
                value={blockageDescription}
                onChange={(e) => setBlockageDescription(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Radius (meters)</label>
              <input
                type="number"
                placeholder="Radius"
                value={blockageRadius}
                onChange={(e) => setBlockageRadius(parseFloat(e.target.value))}
                min="1"
              />
            </div>
            <button
              className="primary-button"
              onClick={handleAddBlockage}
              disabled={!serverReady || loading || !blockageName.trim()}
            >
              Add Blockage
            </button>
          </>
        )}
      </div>
      </div>
      )}
    </div>
  );
}

