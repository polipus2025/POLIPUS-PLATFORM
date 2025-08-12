import { useState, useEffect } from 'react';
import { offlineMapping, type GPSCoordinate } from '@/services/offline-mapping';
import { offlineStorage } from '@/services/offline-storage';

export function useOfflineMapping() {
  const [currentLocation, setCurrentLocation] = useState<GPSCoordinate | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    setLocationError(null);

    try {
      const coordinate = await offlineMapping.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });

      setCurrentLocation(coordinate);
      return coordinate;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get current location';
      setLocationError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const saveFarmPlot = async (farmerId: string, coordinates: Array<{lat: number; lng: number}>, cropType: string) => {
    try {
      // Save to offline storage first
      const plotId = await offlineMapping.saveFarmPlot(farmerId, coordinates, cropType);

      // Try to sync online if connected
      if (navigator.onLine) {
        try {
          const response = await fetch('/api/farm-plots', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
              farmerId,
              coordinates,
              cropType,
              area: calculatePolygonArea(coordinates)
            })
          });

          if (response.ok) {
            // Mark as synced
            await offlineStorage.markAsSynced('mapData', plotId);
          }
        } catch (error) {
          console.log('Online sync failed, keeping offline version');
        }
      }

      return { success: true, id: plotId };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save farm plot'
      };
    }
  };

  const saveMapClick = async (lat: number, lng: number) => {
    try {
      const coordinateId = await offlineMapping.saveClickCoordinate(lat, lng);
      return { success: true, id: coordinateId };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to save coordinate'
      };
    }
  };

  const getFarmPlots = async (farmerId?: string) => {
    try {
      return await offlineMapping.getFarmPlots(farmerId);
    } catch (error) {
      console.error('Failed to get farm plots:', error);
      return [];
    }
  };

  const getRecentCoordinates = async (hours: number = 24) => {
    try {
      return await offlineMapping.getRecentCoordinates(hours);
    } catch (error) {
      console.error('Failed to get recent coordinates:', error);
      return [];
    }
  };

  const startLocationTracking = () => {
    offlineMapping.startWatchingPosition({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 1000
    });

    // Listen for GPS updates
    offlineMapping.onGPSUpdate((coordinate) => {
      setCurrentLocation(coordinate);
    });
  };

  const stopLocationTracking = () => {
    offlineMapping.stopWatchingPosition();
  };

  const calculatePolygonArea = (coordinates: Array<{lat: number; lng: number}>) => {
    if (coordinates.length < 3) return 0;

    let area = 0;
    const n = coordinates.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += coordinates[i].lat * coordinates[j].lng;
      area -= coordinates[j].lat * coordinates[i].lng;
    }

    area = Math.abs(area) / 2;

    // Convert to square meters (approximate)
    const metersPerDegree = 111000;
    return area * metersPerDegree * metersPerDegree;
  };

  const formatCoordinate = (coordinate: number, type: 'lat' | 'lng') => {
    return offlineMapping.formatCoordinate(coordinate, type);
  };

  const isValidCoordinate = (lat: number, lng: number) => {
    return offlineMapping.isValidCoordinate(lat, lng);
  };

  const isInLiberia = (lat: number, lng: number) => {
    return offlineMapping.isInLiberia(lat, lng);
  };

  const getLiberianCounty = (lat: number, lng: number) => {
    return offlineMapping.getLiberianCounty(lat, lng);
  };

  return {
    currentLocation,
    isGettingLocation,
    locationError,
    getCurrentLocation,
    saveFarmPlot,
    saveMapClick,
    getFarmPlots,
    getRecentCoordinates,
    startLocationTracking,
    stopLocationTracking,
    formatCoordinate,
    isValidCoordinate,
    isInLiberia,
    getLiberianCounty
  };
}