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
    const response = await api.get<string>(`${ROUTING_API_BASE}/ready`);
    return response.data as 'wait' | 'ready';
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
    const response = await api.get<GeoJSON>(`${ROUTING_API_BASE}/axisType/${roadType}`);
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
    const response = await api.get<GeoJSON>(`${ROUTING_API_BASE}/blockage`);
    return response.data;
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

