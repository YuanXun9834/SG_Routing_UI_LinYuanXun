import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
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
      const routeLayer = L.geoJSON(routeGeoJSON, {
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
      const blockagesLayer = L.geoJSON(blockagesGeoJSON, {
        style: {
          color: '#ff0000',
          weight: 2,
          opacity: 0.6,
          fillColor: '#ff0000',
          fillOpacity: 0.2,
        },
      });
      blockagesLayer.addTo(map);
      blockagesLayerRef.current = blockagesLayer;
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
      const roadTypeLayer = L.geoJSON(roadTypeGeoJSON, {
        style: {
          color: '#888888',
          weight: 2,
          opacity: 0.4,
        },
      });
      roadTypeLayer.addTo(map);
      roadTypeLayerRef.current = roadTypeLayer;
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

interface MapProps {
  routeGeoJSON?: GeoJSONType | null;
  blockagesGeoJSON?: GeoJSONType | null;
  roadTypeGeoJSON?: GeoJSONType | null;
  startPoint?: [number, number] | null;
  endPoint?: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
}

export default function Map({
  routeGeoJSON,
  blockagesGeoJSON,
  roadTypeGeoJSON,
  startPoint,
  endPoint,
  onMapClick,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={SINGAPORE_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          mapRef.current = map;
          if (onMapClick) {
            map.on('click', (e) => {
              onMapClick(e.latlng.lat, e.latlng.lng);
            });
          }
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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

