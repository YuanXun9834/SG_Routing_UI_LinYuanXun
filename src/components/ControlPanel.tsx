import { useState, useEffect } from 'react';
import type { TravelType, Point, Blockage } from '../types';
import { ROAD_TYPE_CONFIG } from '../config/roadTypes';
import { routingAPI } from '../services/api';
import './ControlPanel.css';

interface ControlPanelProps {
  onRouteCalculate: (startPt: Point, endPt: Point) => void;
  onTravelTypeChange: (travelType: TravelType) => void;
  onBlockageAdd: (blockage: Blockage) => void;
  onBlockageDelete: (name: string) => void;
  onRoadTypeView: (roadType: string) => void;
  serverReady: boolean;
  loading: boolean;
}

export default function ControlPanel({
  onRouteCalculate,
  onTravelTypeChange,
  onBlockageAdd,
  onBlockageDelete,
  onRoadTypeView,
  serverReady,
  loading,
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
  const [allRoadTypes, setAllRoadTypes] = useState<string[]>([]);
  const [validRoadTypes, setValidRoadTypes] = useState<string[]>([]);
  const [selectedRoadType, setSelectedRoadType] = useState<string>('');
  const [blockageName, setBlockageName] = useState('');
  const [blockageDescription, setBlockageDescription] = useState('');
  const [blockageRadius, setBlockageRadius] = useState(200);
  const [blockagePoint, setBlockagePoint] = useState<Point>({
    long: 103.8198,
    lat: 1.3521,
  });

  useEffect(() => {
    loadRoadTypes();
    loadValidRoadTypes();
  }, []);

  useEffect(() => {
    onTravelTypeChange(travelType);
    applyRoadTypesForTravelType(travelType);
  }, [travelType]);

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
    }
  };

  const handleCalculateRoute = () => {
    onRouteCalculate(startPoint, endPoint);
  };

  const handleAddBlockage = () => {
    if (!blockageName.trim()) {
      alert('Please enter a blockage name');
      return;
    }
    const blockage: Blockage = {
      point: blockagePoint,
      radius: blockageRadius,
      name: blockageName,
      description: blockageDescription,
    };
    onBlockageAdd(blockage);
    setBlockageName('');
    setBlockageDescription('');
  };

  const handleViewRoadType = () => {
    if (selectedRoadType) {
      onRoadTypeView(selectedRoadType);
    }
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h2>Server Status</h2>
        <div className={`status-indicator ${serverReady ? 'ready' : 'waiting'}`}>
          {serverReady ? '✓ Ready' : '⏳ Waiting...'}
        </div>
      </div>

      <div className="panel-section">
        <h2>Travel Type</h2>
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
        <h2>Route Planning</h2>
        <div className="input-group">
          <label>Start Point</label>
          <input
            type="number"
            placeholder="Longitude"
            value={startPoint.long}
            onChange={(e) =>
              setStartPoint({ ...startPoint, long: parseFloat(e.target.value) })
            }
            step="0.000001"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={startPoint.lat}
            onChange={(e) =>
              setStartPoint({ ...startPoint, lat: parseFloat(e.target.value) })
            }
            step="0.000001"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={startPoint.description || ''}
            onChange={(e) =>
              setStartPoint({ ...startPoint, description: e.target.value })
            }
          />
        </div>
        <div className="input-group">
          <label>End Point</label>
          <input
            type="number"
            placeholder="Longitude"
            value={endPoint.long}
            onChange={(e) =>
              setEndPoint({ ...endPoint, long: parseFloat(e.target.value) })
            }
            step="0.000001"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={endPoint.lat}
            onChange={(e) =>
              setEndPoint({ ...endPoint, lat: parseFloat(e.target.value) })
            }
            step="0.000001"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={endPoint.description || ''}
            onChange={(e) =>
              setEndPoint({ ...endPoint, description: e.target.value })
            }
          />
        </div>
        <button
          className="primary-button"
          onClick={handleCalculateRoute}
          disabled={!serverReady || loading}
        >
          Calculate Route
        </button>
      </div>

      <div className="panel-section">
        <h2>View Road Types</h2>
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
        <h2>Blockage Management</h2>
        <div className="input-group">
          <label>Blockage Name</label>
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
            placeholder="Enter description"
            value={blockageDescription}
            onChange={(e) => setBlockageDescription(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Location</label>
          <input
            type="number"
            placeholder="Longitude"
            value={blockagePoint.long}
            onChange={(e) =>
              setBlockagePoint({ ...blockagePoint, long: parseFloat(e.target.value) })
            }
            step="0.000001"
          />
          <input
            type="number"
            placeholder="Latitude"
            value={blockagePoint.lat}
            onChange={(e) =>
              setBlockagePoint({ ...blockagePoint, lat: parseFloat(e.target.value) })
            }
            step="0.000001"
          />
        </div>
        <div className="input-group">
          <label>Radius (meters)</label>
          <input
            type="number"
            value={blockageRadius}
            onChange={(e) => setBlockageRadius(parseInt(e.target.value))}
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
      </div>
    </div>
  );
}

