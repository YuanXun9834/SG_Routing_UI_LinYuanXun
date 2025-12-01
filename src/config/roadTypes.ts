import type { RoadTypeConfig } from '../types';

/**
 * Road type configurations for different travel modes
 * Based on OpenStreetMap road classifications
 */
export const ROAD_TYPE_CONFIG: RoadTypeConfig = {
  car: [
    'primary',
    'secondary',
    'tertiary',
    'trunk',
    'motorway',
    'residential',
    'primary_link',
    'secondary_link',
    'tertiary_link',
    'motorway_link',
    'trunk_link',
  ],
  bicycle: [
    'cycleway',
    'residential',
    'primary',
    'secondary',
    'tertiary',
    'path',
    'footway',
  ],
  walk: [
    'footway',
    'path',
    'residential',
    'pedestrian',
    'steps',
  ],
};

/**
 * Default Singapore map center (approximately central Singapore)
 */
export const SINGAPORE_CENTER: [number, number] = [1.3521, 103.8198];

/**
 * Default map zoom level
 */
export const DEFAULT_ZOOM = 12;

