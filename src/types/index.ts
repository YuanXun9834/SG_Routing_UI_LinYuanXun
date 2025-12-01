export interface Point {
  long: number;
  lat: number;
  description?: string;
}

export interface RouteRequest {
  startPt: Point;
  endPt: Point;
}

export interface Blockage {
  point: {
    long: number;
    lat: number;
  };
  radius: number;
  name: string;
  description: string;
}

export interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][];
  };
  properties: Record<string, any>;
}

export type TravelType = 'car' | 'bicycle' | 'walk';

export interface RoadTypeConfig {
  car: string[];
  bicycle: string[];
  walk: string[];
}

