import axios from 'axios';
import type { RouteRequest, Blockage, GeoJSON } from '../types';

const ROUTING_API_BASE = 'https://routing-web-service-ityenzhnyq-an.a.run.app';
const BUS_API_BASE = 'https://nyc-bus-routing-k3q4yvzczq-an.a.run.app';

const api = axios.create({
  timeout: 30000,
});

export const routingAPI = {
  /**
   * Check if the server is ready
   * @returns "wait" or "ready"
   */
  async checkReady(): Promise<'wait' | 'ready'> {
    try {
      const response = await api.get<string>(`${ROUTING_API_BASE}/ready`, {
        timeout: 10000, // 10 second timeout for readiness check
      });
      // Handle both string and trimmed string responses, case-insensitive
      const status = typeof response.data === 'string' 
        ? response.data.trim().toLowerCase() 
        : String(response.data).trim().toLowerCase();
      
      // Check for "ready" (case-insensitive) - server returns "Ready" with capital R
      if (status === 'ready') {
        return 'ready';
      }
      return 'wait';
    } catch (error: any) {
      console.error('Server readiness check failed:', error);
      // If it's a network error or timeout, assume server is not ready yet
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
        return 'wait';
      }
      // For other errors, throw to let the caller handle it
      throw error;
    }
  },

  /**
   * Get all available road types
   */
  async getAllRoadTypes(): Promise<string[]> {
    const response = await api.get<string[]>(`${BUS_API_BASE}/allAxisTypes`);
    return response.data;
  },

  /**
   * Get the road types currently used by the routing algorithm
   */
  async getValidRoadTypes(): Promise<string[]> {
    const response = await api.get<string[]>(`${ROUTING_API_BASE}/validAxisTypes`);
    return response.data;
  },

  /**
   * Get GeoJSON data for a specific road type
   */
  async getRoadTypeGeoJSON(roadType: string): Promise<GeoJSON> {
    const encodedRoadType = encodeURIComponent(roadType);
    const response = await api.get<GeoJSON>(`${ROUTING_API_BASE}/axisType/${encodedRoadType}`);
    return response.data;
  },

  /**
   * Change the road types used in the routing algorithm
   */
  async changeValidRoadTypes(roadTypes: string[]): Promise<string[]> {
    const response = await api.post<string[]>(
      `${BUS_API_BASE}/changeValidRoadTypes`,
      roadTypes
    );
    return response.data;
  },

  /**
   * Get the shortest route from start point to end point
   */
  async getRoute(request: RouteRequest): Promise<GeoJSON> {
    const response = await api.post<GeoJSON>(`${ROUTING_API_BASE}/route`, request);
    return response.data;
  },

  /**
   * Get all blockages from the server
   */
  async getBlockages(): Promise<GeoJSON> {
    try {
      const response = await api.get<GeoJSON>(`${ROUTING_API_BASE}/blockage`);
      const data = response.data;
      
      // Validate and normalize the response
      if (data && typeof data === 'object') {
        // If it's already a valid FeatureCollection, return it
        if (data.type === 'FeatureCollection' && Array.isArray(data.features)) {
          return data;
        }
        // If it's an empty object or invalid structure, return empty FeatureCollection
        if (!data.type || !data.features) {
          console.warn('Invalid GeoJSON structure from server, returning empty FeatureCollection');
          return {
            type: 'FeatureCollection',
            features: [],
          };
        }
      }
      
      // Fallback: return empty FeatureCollection
      return {
        type: 'FeatureCollection',
        features: [],
      };
    } catch (error: any) {
      console.error('Error fetching blockages:', error);
      // Return empty FeatureCollection on error instead of throwing
      return {
        type: 'FeatureCollection',
        features: [],
      };
    }
  },

  /**
   * Add a new blockage to the server
   */
  async addBlockage(blockage: Blockage): Promise<void> {
    await api.post(`${ROUTING_API_BASE}/blockage`, blockage);
  },

  /**
   * Delete an existing blockage from the server
   */
  async deleteBlockage(name: string): Promise<void> {
    await api.delete(`${ROUTING_API_BASE}/blockage/${encodeURIComponent(name)}`);
  },
};

