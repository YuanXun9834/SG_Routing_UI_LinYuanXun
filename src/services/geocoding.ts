import axios from 'axios';

export interface GeocodingResult {
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  type: string;
  importance: number;
}

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const api = axios.create({
  baseURL: NOMINATIM_BASE_URL,
  timeout: 10000,
  headers: {
    'User-Agent': 'SG_Routing_UI_LinYuanXun/1.0', // Required by Nominatim
  },
  params: {
    format: 'json',
    addressdetails: 1,
    limit: 5, // Limit to 5 results
    countrycodes: 'sg', // Restrict to Singapore
  },
});

// Debounce helper to respect rate limits (1 request per second recommended)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

/**
 * Search for locations by name using Nominatim (OpenStreetMap)
 * @param query - Location name to search for
 * @returns Array of geocoding results
 */
export async function searchLocation(query: string): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  // Rate limiting: ensure at least 1 second between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();

  try {
    const response = await api.get<GeocodingResult[]>('/search', {
      params: {
        q: query.trim(),
      },
    });
    return response.data || [];
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

/**
 * Convert a geocoding result to a Point object
 */
export function geocodingResultToPoint(result: GeocodingResult): { long: number; lat: number; description?: string } {
  return {
    long: parseFloat(result.lon),
    lat: parseFloat(result.lat),
    description: result.display_name,
  };
}

