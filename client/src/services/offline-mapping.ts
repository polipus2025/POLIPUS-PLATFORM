// Offline Mapping Service for AgriTrace360
// Handles map data storage and GPS functionality offline

import { offlineStorage, type MapPlot, type GPSCoordinate } from './offline-storage';

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface OfflineMapTile {
  id: string;
  x: number;
  y: number;
  z: number;
  url: string;
  data: string; // Base64 encoded tile data
  timestamp: number;
}

interface GPSOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

class OfflineMappingService {
  private cachedTiles: Map<string, OfflineMapTile> = new Map();
  private watchId: number | null = null;
  private gpsListeners: Array<(coordinate: GPSCoordinate) => void> = [];

  constructor() {
    this.loadCachedTiles();
  }

  private async loadCachedTiles(): Promise<void> {
    // In a real implementation, you would load cached map tiles from IndexedDB
    // For now, we'll use a simple in-memory cache
  }

  // GPS and Location Services
  async getCurrentPosition(options: GPSOptions = {}): Promise<GPSCoordinate> {
    const defaultOptions: GPSOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
      ...options
    };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinate: GPSCoordinate = {
            id: `gps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            timestamp: Date.now(),
            source: 'auto',
            isOffline: true
          };

          // Save to offline storage
          await offlineStorage.saveGPSCoordinateOffline(coordinate);
          
          // Notify listeners
          this.notifyGPSListeners(coordinate);

          resolve(coordinate);
        },
        (error) => {
          console.error('GPS error:', error);
          reject(new Error(`GPS error: ${error.message}`));
        },
        defaultOptions
      );
    });
  }

  startWatchingPosition(options: GPSOptions = {}): void {
    if (this.watchId !== null) {
      this.stopWatchingPosition();
    }

    const defaultOptions: GPSOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 1000,
      ...options
    };

    if (navigator.geolocation) {
      this.watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const coordinate: GPSCoordinate = {
            id: `gps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            timestamp: Date.now(),
            source: 'auto',
            isOffline: true
          };

          // Save to offline storage
          await offlineStorage.saveGPSCoordinateOffline(coordinate);
          
          // Notify listeners
          this.notifyGPSListeners(coordinate);
        },
        (error) => {
          console.error('GPS watch error:', error);
        },
        defaultOptions
      );
    }
  }

  stopWatchingPosition(): void {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  onGPSUpdate(callback: (coordinate: GPSCoordinate) => void): void {
    this.gpsListeners.push(callback);
  }

  private notifyGPSListeners(coordinate: GPSCoordinate): void {
    this.gpsListeners.forEach(callback => callback(coordinate));
  }

  // Farm Plot Management
  async saveFarmPlot(farmerId: string, coordinates: Array<{lat: number; lng: number}>, cropType: string): Promise<string> {
    // Calculate area (simplified polygon area calculation)
    const area = this.calculatePolygonArea(coordinates);

    const plotId = await offlineStorage.saveMapPlotOffline({
      farmerId,
      coordinates,
      area,
      cropType
    });

    return plotId;
  }

  async getFarmPlots(farmerId?: string): Promise<MapPlot[]> {
    if (farmerId) {
      return offlineStorage.getMapPlotsByFarmer(farmerId);
    } else {
      return offlineStorage.getMapPlotsOffline();
    }
  }

  async updateFarmPlot(plotId: string, updates: Partial<MapPlot>): Promise<void> {
    // In a full implementation, you would update the plot in IndexedDB
    // For now, we'll just log the update
    console.log('Updating farm plot:', plotId, updates);
  }

  async deleteFarmPlot(plotId: string): Promise<void> {
    // In a full implementation, you would remove the plot from IndexedDB
    console.log('Deleting farm plot:', plotId);
  }

  // Map Click Coordinates
  async saveClickCoordinate(lat: number, lng: number): Promise<string> {
    const coordinate: Omit<GPSCoordinate, 'id' | 'timestamp' | 'isOffline'> = {
      latitude: lat,
      longitude: lng,
      accuracy: 0, // Map clicks have perfect accuracy
      source: 'map-click'
    };

    return offlineStorage.saveGPSCoordinateOffline(coordinate);
  }

  async getRecentCoordinates(hours: number = 24): Promise<GPSCoordinate[]> {
    return offlineStorage.getRecentGPSCoordinates(hours);
  }

  // Area Calculations
  private calculatePolygonArea(coordinates: Array<{lat: number; lng: number}>): number {
    if (coordinates.length < 3) return 0;

    // Use the shoelace formula for polygon area
    let area = 0;
    const n = coordinates.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i].lat * coordinates[j].lng;
      area -= coordinates[j].lat * coordinates[i].lng;
    }

    area = Math.abs(area) / 2;

    // Convert from decimal degrees to square meters (approximate)
    // This is a simplified calculation for small areas
    const metersPerDegree = 111000; // Approximate meters per degree at equator
    return area * metersPerDegree * metersPerDegree;
  }

  // Offline Map Tiles (for future implementation)
  async cacheMapTiles(bounds: MapBounds, minZoom: number, maxZoom: number): Promise<void> {
    console.log('Caching map tiles for offline use:', bounds, minZoom, maxZoom);
    // In a full implementation, you would:
    // 1. Calculate tile coordinates for the given bounds and zoom levels
    // 2. Download tiles from the map provider
    // 3. Store them in IndexedDB
    // 4. Update the tile cache
  }

  async getCachedTile(x: number, y: number, z: number): Promise<OfflineMapTile | null> {
    const tileId = `${z}_${x}_${y}`;
    return this.cachedTiles.get(tileId) || null;
  }

  async clearTileCache(): Promise<void> {
    this.cachedTiles.clear();
    // In a full implementation, you would also clear tiles from IndexedDB
  }

  // Utility Functions
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  formatCoordinate(coordinate: number, type: 'lat' | 'lng'): string {
    const direction = type === 'lat' 
      ? (coordinate >= 0 ? 'N' : 'S')
      : (coordinate >= 0 ? 'E' : 'W');
    
    const abs = Math.abs(coordinate);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = Math.round(((abs - degrees) * 60 - minutes) * 60 * 100) / 100;

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  }

  isValidCoordinate(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }

  // Liberia-specific utilities
  isInLiberia(lat: number, lng: number): boolean {
    // Approximate bounds of Liberia
    const liberiaBouns = {
      north: 8.55,
      south: 4.35,
      east: -7.37,
      west: -11.49
    };

    return lat >= liberiaBouns.south && 
           lat <= liberiaBouns.north && 
           lng >= liberiaBouns.west && 
           lng <= liberiaBouns.east;
  }

  getLiberianCounty(lat: number, lng: number): string | null {
    // Simplified county detection based on coordinates
    // In a real implementation, you would use proper geospatial data
    
    if (!this.isInLiberia(lat, lng)) return null;

    // Basic county approximation (simplified)
    if (lat > 7.5) return 'Lofa';
    if (lat > 7.0 && lng > -9.5) return 'Gbarpolu';
    if (lat > 6.5 && lng > -9.0) return 'Bong';
    if (lat > 6.0 && lng > -8.5) return 'Nimba';
    if (lat > 5.5) return 'Grand Gedeh';
    if (lng < -10.0) return 'Grand Cape Mount';
    if (lng < -9.5) return 'Montserrado';
    
    return 'Unknown County';
  }
}

// Singleton instance
export const offlineMapping = new OfflineMappingService();

export type { MapBounds, OfflineMapTile, GPSOptions };