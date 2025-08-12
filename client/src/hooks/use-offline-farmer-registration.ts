import { useState } from 'react';
import { offlineStorage } from '@/services/offline-storage';
import { offlineSync } from '@/services/offline-sync';

interface FarmerData {
  farmerId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  county: string;
  district?: string;
  gpsCoordinates?: string;
  farmSize?: number;
  primaryCrop?: string;
}

export function useOfflineFarmerRegistration() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerFarmer = async (farmerData: FarmerData): Promise<{ success: boolean; id?: string; message?: string; isOffline?: boolean }> => {
    setIsRegistering(true);
    setError(null);

    try {
      // Try online registration first
      if (navigator.onLine) {
        try {
          const response = await fetch('/api/farmers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(farmerData)
          });

          if (response.ok) {
            const result = await response.json();
            return {
              success: true,
              id: result.data?.id,
              message: 'Farmer registered successfully'
            };
          }
        } catch (networkError) {
          console.log('Network registration failed, falling back to offline');
        }
      }

      // Fallback to offline registration
      const offlineId = await offlineStorage.saveFarmerOffline(farmerData);
      
      // Trigger background sync if online
      if (navigator.onLine) {
        offlineSync.triggerAutoSync();
      }

      return {
        success: true,
        id: offlineId,
        message: 'Farmer registered offline - will sync when online',
        isOffline: true
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to register farmer';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsRegistering(false);
    }
  };

  const getPendingFarmers = async () => {
    try {
      return await offlineStorage.getPendingFarmers();
    } catch (error) {
      console.error('Failed to get pending farmers:', error);
      return [];
    }
  };

  const getOfflineFarmers = async () => {
    try {
      return await offlineStorage.getFarmersOffline();
    } catch (error) {
      console.error('Failed to get offline farmers:', error);
      return [];
    }
  };

  return {
    registerFarmer,
    getPendingFarmers,
    getOfflineFarmers,
    isRegistering,
    error
  };
}