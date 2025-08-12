// Offline Synchronization Service for AgriTrace360
// Handles automatic sync of offline data when connection is restored

import { offlineStorage, type FarmerRegistration, type MapPlot, type OfflineInspection } from './offline-storage';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

interface SyncProgress {
  total: number;
  completed: number;
  current: string;
  percentage: number;
}

type SyncProgressCallback = (progress: SyncProgress) => void;

class OfflineSyncService {
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private syncCallbacks: SyncProgressCallback[] = [];

  constructor() {
    this.setupNetworkListeners();
    this.startAutoSync();
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.triggerAutoSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private startAutoSync(): void {
    // Auto-sync every 5 minutes when online
    setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncAllData().catch(console.error);
      }
    }, 5 * 60 * 1000);
  }

  async triggerAutoSync(): Promise<void> {
    if (this.isOnline && !this.syncInProgress) {
      await this.syncAllData();
    }
  }

  onSyncProgress(callback: SyncProgressCallback): void {
    this.syncCallbacks.push(callback);
  }

  private notifyProgress(progress: SyncProgress): void {
    this.syncCallbacks.forEach(callback => callback(progress));
  }

  async syncAllData(): Promise<SyncResult> {
    if (!this.isOnline) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        errors: ['Device is offline']
      };
    }

    if (this.syncInProgress) {
      return {
        success: false,
        synced: 0,
        failed: 0,
        errors: ['Sync already in progress']
      };
    }

    this.syncInProgress = true;
    const errors: string[] = [];
    let totalSynced = 0;
    let totalFailed = 0;

    try {
      // Get all pending data
      const pendingFarmers = await offlineStorage.getPendingFarmers();
      const pendingMapData = await offlineStorage.getPendingMapData();
      const pendingInspections = await offlineStorage.getPendingInspections();

      const totalItems = pendingFarmers.length + pendingMapData.length + pendingInspections.length;
      let completedItems = 0;

      // Sync farmers
      for (const farmer of pendingFarmers) {
        this.notifyProgress({
          total: totalItems,
          completed: completedItems,
          current: `Syncing farmer: ${farmer.firstName} ${farmer.lastName}`,
          percentage: Math.round((completedItems / totalItems) * 100)
        });

        try {
          await this.syncFarmer(farmer);
          await offlineStorage.markAsSynced('farmers', farmer.id);
          totalSynced++;
        } catch (error) {
          console.error('Failed to sync farmer:', error);
          errors.push(`Farmer ${farmer.firstName} ${farmer.lastName}: ${error}`);
          totalFailed++;
        }
        completedItems++;
      }

      // Sync map data
      for (const mapPlot of pendingMapData) {
        this.notifyProgress({
          total: totalItems,
          completed: completedItems,
          current: `Syncing map plot for farmer: ${mapPlot.farmerId}`,
          percentage: Math.round((completedItems / totalItems) * 100)
        });

        try {
          await this.syncMapPlot(mapPlot);
          await offlineStorage.markAsSynced('mapData', mapPlot.id);
          totalSynced++;
        } catch (error) {
          console.error('Failed to sync map plot:', error);
          errors.push(`Map plot ${mapPlot.id}: ${error}`);
          totalFailed++;
        }
        completedItems++;
      }

      // Sync inspections
      for (const inspection of pendingInspections) {
        this.notifyProgress({
          total: totalItems,
          completed: completedItems,
          current: `Syncing inspection: ${inspection.id}`,
          percentage: Math.round((completedItems / totalItems) * 100)
        });

        try {
          await this.syncInspection(inspection);
          await offlineStorage.markAsSynced('inspections', inspection.id);
          totalSynced++;
        } catch (error) {
          console.error('Failed to sync inspection:', error);
          errors.push(`Inspection ${inspection.id}: ${error}`);
          totalFailed++;
        }
        completedItems++;
      }

      // Update last sync time
      await offlineStorage.updateLastSyncTime();

      this.notifyProgress({
        total: totalItems,
        completed: totalItems,
        current: 'Sync completed',
        percentage: 100
      });

      return {
        success: errors.length === 0,
        synced: totalSynced,
        failed: totalFailed,
        errors
      };

    } catch (error) {
      console.error('Sync failed:', error);
      return {
        success: false,
        synced: totalSynced,
        failed: totalFailed + 1,
        errors: [...errors, `Sync failed: ${error}`]
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncFarmer(farmer: FarmerRegistration): Promise<void> {
    const farmerData = {
      farmerId: farmer.farmerId,
      firstName: farmer.firstName,
      lastName: farmer.lastName,
      phoneNumber: farmer.phoneNumber,
      county: farmer.county,
      district: farmer.district,
      gpsCoordinates: farmer.gpsCoordinates,
      farmSize: farmer.farmSize,
      primaryCrop: farmer.primaryCrop
    };

    const response = await fetch('/api/farmers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`
      },
      body: JSON.stringify(farmerData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
  }

  private async syncMapPlot(mapPlot: MapPlot): Promise<void> {
    const plotData = {
      farmerId: mapPlot.farmerId,
      coordinates: mapPlot.coordinates,
      area: mapPlot.area,
      cropType: mapPlot.cropType
    };

    const response = await fetch('/api/farm-plots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`
      },
      body: JSON.stringify(plotData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
  }

  private async syncInspection(inspection: OfflineInspection): Promise<void> {
    const inspectionData = {
      commodityId: inspection.commodityId,
      inspectorId: inspection.inspectorId,
      inspectionDate: new Date(inspection.inspectionDate).toISOString(),
      notes: inspection.notes,
      gpsLocation: inspection.gpsLocation
    };

    const response = await fetch('/api/inspections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`
      },
      body: JSON.stringify(inspectionData)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
  }

  private async getAuthToken(): Promise<string> {
    // Try to get token from localStorage first
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      return storedToken;
    }

    // Try to get from offline storage
    const authTokens = await offlineStorage.getAllAuthTokensOffline();
    if (authTokens.length > 0) {
      return authTokens[0].token;
    }

    throw new Error('No authentication token available');
  }

  async forceSyncNow(): Promise<SyncResult> {
    return this.syncAllData();
  }

  isSyncInProgress(): boolean {
    return this.syncInProgress;
  }

  isDeviceOnline(): boolean {
    return this.isOnline;
  }

  async getSyncStatus(): Promise<{
    lastSync: number;
    pendingItems: number;
    isOnline: boolean;
    syncInProgress: boolean;
  }> {
    const lastSync = await offlineStorage.getLastSyncTime();
    const pendingFarmers = await offlineStorage.getPendingFarmers();
    const pendingMapData = await offlineStorage.getPendingMapData();
    const pendingInspections = await offlineStorage.getPendingInspections();

    return {
      lastSync,
      pendingItems: pendingFarmers.length + pendingMapData.length + pendingInspections.length,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    };
  }
}

// Singleton instance
export const offlineSync = new OfflineSyncService();

export type { SyncResult, SyncProgress };