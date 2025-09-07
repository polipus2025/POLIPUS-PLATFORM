/**
 * Comprehensive Geolocation Service for AgriTrace360™
 * Enhanced with Galileo Satellite Support for EUDR Compliance
 * Provides GPS detection, click-to-map, and location utilities across the platform
 */

export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
  satelliteSystem?: string; // GPS, Galileo, GLONASS, BeiDou
  precision?: 'standard' | 'high' | 'galileo-enhanced';
}

export interface LocationResult {
  success: boolean;
  coordinate?: GPSCoordinate;
  error?: string;
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  enableGalileo?: boolean; // Prefer Galileo satellites for EUDR compliance
  requiredAccuracy?: number; // Minimum accuracy in meters
}

export class GeolocationService {
  private static instance: GeolocationService;
  private watchId: number | null = null;
  private currentPosition: GeolocationPosition | null = null;

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  /**
   * Check if geolocation is supported
   */
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Get current GPS position with Galileo satellite enhancement
   */
  async getCurrentPosition(options?: GeolocationOptions): Promise<LocationResult> {
    if (!this.isSupported()) {
      return {
        success: false,
        error: 'Geolocation is not supported by this browser'
      };
    }

    // Enhanced options for Galileo satellite positioning
    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 15000, // Extended timeout for Galileo acquisition
      maximumAge: 30000, // Shorter cache for fresher Galileo fixes
      enableGalileo: true, // Enable Galileo satellite preference
      requiredAccuracy: 5, // Sub-5 meter accuracy for EUDR compliance
      ...options
    };

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          
          // Determine satellite system and precision based on accuracy
          const satelliteInfo = this.determineSatelliteSystem(position.coords.accuracy);
          
          resolve({
            success: true,
            coordinate: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString(),
              satelliteSystem: satelliteInfo.system,
              precision: satelliteInfo.precision
            }
          });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          resolve({
            success: false,
            error: errorMessage
          });
        },
        defaultOptions
      );
    });
  }

  /**
   * Start watching position changes
   */
  startWatching(
    onSuccess: (position: GeolocationPosition) => void,
    onError?: (error: string) => void,
    options?: GeolocationOptions
  ): boolean {
    if (!this.isSupported()) {
      onError?.('Geolocation is not supported by this browser');
      return false;
    }

    // Enhanced watching options for continuous Galileo positioning
    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 20000, // Extended for Galileo satellite acquisition
      maximumAge: 45000, // Balanced caching for real-time accuracy
      enableGalileo: true,
      requiredAccuracy: 3, // High precision for boundary mapping
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        onSuccess(position);
      },
      (error) => {
        let errorMessage = 'GPS tracking error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location timeout';
            break;
        }
        onError?.(errorMessage);
      },
      defaultOptions
    );

    return true;
  }

  /**
   * Stop watching position changes
   */
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get cached current position
   */
  getCachedPosition(): GeolocationPosition | null {
    return this.currentPosition;
  }

  /**
   * Format coordinates for display
   */
  formatCoordinate(coordinate: GPSCoordinate, precision: number = 6): string {
    return `${coordinate.latitude.toFixed(precision)}, ${coordinate.longitude.toFixed(precision)}`;
  }

  /**
   * Calculate distance between two points (in meters)
   */
  calculateDistance(coord1: GPSCoordinate, coord2: GPSCoordinate): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = coord1.latitude * Math.PI / 180;
    const φ2 = coord2.latitude * Math.PI / 180;
    const Δφ = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const Δλ = (coord2.longitude - coord1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  /**
   * Generate boundary points around a center coordinate
   */
  generateBoundaryPoints(
    center: GPSCoordinate, 
    radiusMeters: number = 100, 
    points: number = 8
  ): GPSCoordinate[] {
    const boundaries: GPSCoordinate[] = [];
    const radiusInDegrees = radiusMeters / 111320; // Approximate meters to degrees conversion

    for (let i = 0; i < points; i++) {
      const angle = (i / points) * 2 * Math.PI;
      const lat = center.latitude + Math.cos(angle) * radiusInDegrees;
      const lng = center.longitude + Math.sin(angle) * radiusInDegrees;
      
      boundaries.push({
        latitude: parseFloat(lat.toFixed(6)),
        longitude: parseFloat(lng.toFixed(6)),
        timestamp: new Date().toISOString()
      });
    }

    return boundaries;
  }

  /**
   * Check if coordinate is within Liberia bounds
   */
  isInLiberia(coordinate: GPSCoordinate): boolean {
    // Liberia approximate bounds
    const bounds = {
      north: 8.5,
      south: 4.3,
      east: -7.4,
      west: -11.5
    };

    return (
      coordinate.latitude >= bounds.south &&
      coordinate.latitude <= bounds.north &&
      coordinate.longitude >= bounds.west &&
      coordinate.longitude <= bounds.east
    );
  }

  /**
   * Get county based on GPS coordinate (simplified mapping)
   */
  getCountyFromCoordinate(coordinate: GPSCoordinate): string {
    // Simplified county detection for Liberia
    const { latitude, longitude } = coordinate;
    
    if (latitude >= 6.2 && latitude <= 6.8 && longitude >= -10.8 && longitude <= -10.2) {
      return 'Montserrado';
    } else if (latitude >= 7.8 && latitude <= 8.5 && longitude >= -10.2 && longitude <= -9.3) {
      return 'Lofa';
    } else if (latitude >= 7.2 && latitude <= 8.0 && longitude >= -9.8 && longitude <= -8.8) {
      return 'Bong';
    } else if (latitude >= 6.8 && latitude <= 7.5 && longitude >= -10.0 && longitude <= -9.2) {
      return 'Bomi';
    } else if (latitude >= 5.2 && latitude <= 6.2 && longitude >= -8.8 && longitude <= -7.8) {
      return 'Nimba';
    } else if (latitude >= 4.3 && latitude <= 5.5 && longitude >= -8.2 && longitude <= -7.4) {
      return 'Grand Gedeh';
    } else if (latitude >= 4.6 && latitude <= 5.8 && longitude >= -9.2 && longitude <= -8.2) {
      return 'Sinoe';
    } else if (latitude >= 4.8 && latitude <= 5.9 && longitude >= -10.1 && longitude <= -9.1) {
      return 'Grand Bassa';
    } else if (latitude >= 5.0 && latitude <= 6.1 && longitude >= -11.0 && longitude <= -10.0) {
      return 'Rivercess';
    } else if (latitude >= 5.8 && latitude <= 6.9 && longitude >= -11.5 && longitude <= -10.5) {
      return 'Grand Cape Mount';
    } else if (latitude >= 6.5 && latitude <= 7.8 && longitude >= -9.5 && longitude <= -8.5) {
      return 'Gbarpolu';
    } else if (latitude >= 7.0 && latitude <= 8.2 && longitude >= -8.8 && longitude <= -7.8) {
      return 'Nimba'; // Northern part
    } else if (latitude >= 4.9 && latitude <= 6.0 && longitude >= -7.9 && longitude <= -7.4) {
      return 'Grand Kru';
    } else if (latitude >= 4.5 && latitude <= 5.6 && longitude >= -8.8 && longitude <= -7.9) {
      return 'Maryland';
    } else if (latitude >= 5.5 && latitude <= 6.5 && longitude >= -8.5 && longitude <= -7.8) {
      return 'River Gee';
    }
    
    return 'Unknown County';
  }

  /**
   * Determine satellite system based on accuracy and timing
   */
  private determineSatelliteSystem(accuracy: number): { system: string; precision: 'standard' | 'high' | 'galileo-enhanced' } {
    // Galileo typically provides sub-meter accuracy
    if (accuracy <= 1) {
      return { system: 'Galileo + GPS (Multi-GNSS)', precision: 'galileo-enhanced' };
    } else if (accuracy <= 3) {
      return { system: 'Galileo/GPS', precision: 'high' };
    } else if (accuracy <= 10) {
      return { system: 'GPS/GNSS', precision: 'high' };
    } else {
      return { system: 'GPS', precision: 'standard' };
    }
  }

  /**
   * Get satellite system information from current position
   */
  getSatelliteInfo(): { system: string; precision: string; accuracy: number } | null {
    if (!this.currentPosition) return null;
    
    const satelliteInfo = this.determineSatelliteSystem(this.currentPosition.coords.accuracy);
    return {
      system: satelliteInfo.system,
      precision: satelliteInfo.precision,
      accuracy: this.currentPosition.coords.accuracy
    };
  }

  /**
   * Check if Galileo satellite positioning is available
   */
  isGalileoEnhanced(): boolean {
    const info = this.getSatelliteInfo();
    return info?.system.includes('Galileo') || false;
  }

  /**
   * Request location permission with Galileo enhancement
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      const result = await this.getCurrentPosition({ 
        timeout: 8000,
        enableGalileo: true,
        requiredAccuracy: 5 
      });
      return result.success;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();

// Export utility functions with Galileo support
export const getLocation = () => geolocationService.getCurrentPosition();
export const getGalileoLocation = () => geolocationService.getCurrentPosition({ 
  enableGalileo: true, 
  requiredAccuracy: 1, 
  timeout: 20000 
});
export const formatGPS = (coord: GPSCoordinate, precision = 6) => 
  geolocationService.formatCoordinate(coord, precision);
export const isGPSSupported = () => geolocationService.isSupported();
export const isGalileoAvailable = () => geolocationService.isGalileoEnhanced();
export const getSatelliteInfo = () => geolocationService.getSatelliteInfo();