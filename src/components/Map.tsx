import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { GeoJSON as GeoJSONType } from '../types';
import { SINGAPORE_CENTER, DEFAULT_ZOOM } from '../config/roadTypes';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapUpdaterProps {
  routeGeoJSON?: GeoJSONType | null;
  blockagesGeoJSON?: GeoJSONType | null;
  roadTypeGeoJSON?: GeoJSONType | null;
  startPoint?: [number, number] | null;
  endPoint?: [number, number] | null;
}

function MapResizer({ panelCollapsed }: { panelCollapsed?: boolean }) {
  const map = useMap();
  
  useEffect(() => {
    if (map) {
      const timer = setTimeout(() => {
        map.invalidateSize();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [map, panelCollapsed]);
  
  return null;
}

function MapUpdater({
  routeGeoJSON,
  blockagesGeoJSON,
  roadTypeGeoJSON,
  startPoint,
  endPoint,
}: MapUpdaterProps) {
  const map = useMap();
  const routeLayerRef = useRef<L.GeoJSON | null>(null);
  const blockagesLayerRef = useRef<L.GeoJSON | null>(null);
  const roadTypeLayerRef = useRef<L.GeoJSON | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Update route layer
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (routeGeoJSON) {
      const routeLayer = L.geoJSON(routeGeoJSON as any, {
        style: {
          color: '#3388ff',
          weight: 5,
          opacity: 0.8,
        },
      });
      routeLayer.addTo(map);
      routeLayerRef.current = routeLayer;
      map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
    }

    return () => {
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
      }
    };
  }, [routeGeoJSON, map]);

  useEffect(() => {
    // Update blockages layer
    if (blockagesLayerRef.current) {
      map.removeLayer(blockagesLayerRef.current);
      blockagesLayerRef.current = null;
    }

    if (blockagesGeoJSON) {
      // Validate GeoJSON structure before rendering
      if (
        blockagesGeoJSON.type !== 'FeatureCollection' ||
        !Array.isArray(blockagesGeoJSON.features)
      ) {
        console.warn('Invalid GeoJSON structure for blockages:', blockagesGeoJSON);
        return;
      }

      // If there are no features, just return (no need to create an empty layer)
      if (blockagesGeoJSON.features.length === 0) {
        return;
      }

      try {
        // Create orange marker icon for blockage points
        const blockageIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const blockagesLayer = L.geoJSON(blockagesGeoJSON as any, {
          style: {
            color: '#ff6600',
            weight: 2,
            opacity: 0.6,
            fillColor: '#ff6600',
            fillOpacity: 0.2,
          },
          pointToLayer: (feature, latlng) => {
            // Use orange marker for point features
            const marker = L.marker(latlng, { icon: blockageIcon });
            // Add popup with blockage name if available
            const name = feature.properties?.name || 'Blockage';
            const description = feature.properties?.description || '';
            marker.bindPopup(`<strong>🚧 ${name}</strong>${description ? `<br/>${description}` : ''}`);
            return marker;
          },
        });
        blockagesLayer.addTo(map);
        blockagesLayerRef.current = blockagesLayer;
      } catch (error) {
        console.error('Error creating blockages layer:', error);
        // Don't throw - just log the error to prevent app crash
      }
    }

    return () => {
      if (blockagesLayerRef.current) {
        map.removeLayer(blockagesLayerRef.current);
      }
    };
  }, [blockagesGeoJSON, map]);

  useEffect(() => {
    // Update road type layer
    if (roadTypeLayerRef.current) {
      map.removeLayer(roadTypeLayerRef.current);
      roadTypeLayerRef.current = null;
    }

    if (roadTypeGeoJSON) {
      try {
        console.log('Creating road type layer with GeoJSON:', roadTypeGeoJSON);
        const roadTypeLayer = L.geoJSON(roadTypeGeoJSON as any, {
          style: {
            color: '#666666',
            weight: 3,
            opacity: 0.7,
          },
        });
        roadTypeLayer.addTo(map);
        roadTypeLayerRef.current = roadTypeLayer;
        
        // Auto-zoom to fit the road type bounds if there are features
        if (roadTypeLayer.getLayers().length > 0) {
          try {
            const bounds = roadTypeLayer.getBounds();
            if (bounds.isValid()) {
              map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
          } catch (boundsError) {
            console.warn('Could not fit bounds for road type:', boundsError);
          }
        } else {
          console.warn('Road type layer has no features');
        }
      } catch (error) {
        console.error('Error creating road type layer:', error);
      }
    }

    return () => {
      if (roadTypeLayerRef.current) {
        map.removeLayer(roadTypeLayerRef.current);
      }
    };
  }, [roadTypeGeoJSON, map]);

  useEffect(() => {
    // Update start marker
    if (startMarkerRef.current) {
      map.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }

    if (startPoint) {
      const startMarker = L.marker([startPoint[0], startPoint[1]], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).addTo(map);
      startMarker.bindPopup('Start Point').openPopup();
      startMarkerRef.current = startMarker;
    }

    return () => {
      if (startMarkerRef.current) {
        map.removeLayer(startMarkerRef.current);
      }
    };
  }, [startPoint, map]);

  useEffect(() => {
    // Update end marker
    if (endMarkerRef.current) {
      map.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }

    if (endPoint) {
      const endMarker = L.marker([endPoint[0], endPoint[1]], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      }).addTo(map);
      endMarker.bindPopup('End Point').openPopup();
      endMarkerRef.current = endMarker;
    }

    return () => {
      if (endMarkerRef.current) {
        map.removeLayer(endMarkerRef.current);
      }
    };
  }, [endPoint, map]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

interface MapProps {
  routeGeoJSON?: GeoJSONType | null;
  blockagesGeoJSON?: GeoJSONType | null;
  roadTypeGeoJSON?: GeoJSONType | null;
  startPoint?: [number, number] | null;
  endPoint?: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
  onClearRoadType?: () => void;
  onClearRoute?: () => void;
  panelCollapsed?: boolean;
}

export default function Map({
  routeGeoJSON,
  blockagesGeoJSON,
  roadTypeGeoJSON,
  startPoint,
  endPoint,
  onMapClick,
  onClearRoadType,
  onClearRoute,
  panelCollapsed,
}: MapProps) {

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 1000,
    padding: '10px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {routeGeoJSON && onClearRoute && (
        <button
          onClick={onClearRoute}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          title="Clear route from map"
        >
          ✕ Clear Route
        </button>
      )}
      {roadTypeGeoJSON && onClearRoadType && (
        <button
          onClick={onClearRoadType}
          style={{
            ...buttonStyle,
            top: routeGeoJSON && onClearRoute ? '50px' : '10px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          }}
          title="Clear highlighted road types"
        >
          ✕ Clear Road Types
        </button>
      )}
      <MapContainer
        center={SINGAPORE_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizer panelCollapsed={panelCollapsed} />
        <MapClickHandler onMapClick={onMapClick} />
        <MapUpdater
          routeGeoJSON={routeGeoJSON}
          blockagesGeoJSON={blockagesGeoJSON}
          roadTypeGeoJSON={roadTypeGeoJSON}
          startPoint={startPoint}
          endPoint={endPoint}
        />
      </MapContainer>
    </div>
  );
}

