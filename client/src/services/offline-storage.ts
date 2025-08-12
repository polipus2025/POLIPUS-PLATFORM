// Comprehensive Offline Storage Service for AgriTrace360
// Handles offline data storage and synchronization for mapping, farmer registration, and authentication

interface OfflineData {
  farmers: FarmerRegistration[];
  mapData: MapPlot[];
  authTokens: AuthToken[];
  inspections: OfflineInspection[];
  gpsCoordinates: GPSCoordinate[];
  lastSync: number;
}

interface FarmerRegistration {
  id: string;
  farmerId: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  county: string;
  district?: string;
  gpsCoordinates?: string;
  farmSize?: number;
  primaryCrop?: string;
  isOffline: boolean;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
}

interface MapPlot {
  id: string;
  farmerId: string;
  coordinates: Array<{lat: number; lng: number}>;
  area: number;
  cropType: string;
  isOffline: boolean;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
}

interface AuthToken {
  username: string;
  token: string;
  userType: string;
  role: string;
  expiresAt: number;
  isOffline: boolean;
}

interface OfflineInspection {
  id: string;
  commodityId: string;
  inspectorId: string;
  inspectionDate: number;
  notes: string;
  photos?: string[];
  gpsLocation?: string;
  isOffline: boolean;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
}

interface GPSCoordinate {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  timestamp: number;
  source: 'manual' | 'auto' | 'map-click';
  isOffline: boolean;
}

class OfflineStorageService {
  private dbName = 'AgriTrace360-OfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('farmers')) {
          const farmerStore = db.createObjectStore('farmers', { keyPath: 'id' });
          farmerStore.createIndex('farmerId', 'farmerId', { unique: false });
          farmerStore.createIndex('status', 'status', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('mapData')) {
          const mapStore = db.createObjectStore('mapData', { keyPath: 'id' });
          mapStore.createIndex('farmerId', 'farmerId', { unique: false });
          mapStore.createIndex('status', 'status', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('authTokens')) {
          db.createObjectStore('authTokens', { keyPath: 'username' });
        }
        
        if (!db.objectStoreNames.contains('inspections')) {
          const inspectionStore = db.createObjectStore('inspections', { keyPath: 'id' });
          inspectionStore.createIndex('status', 'status', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('gpsCoordinates')) {
          const gpsStore = db.createObjectStore('gpsCoordinates', { keyPath: 'id' });
          gpsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Farmer Registration Methods
  async saveFarmerOffline(farmer: Omit<FarmerRegistration, 'id' | 'isOffline' | 'timestamp' | 'status'>): Promise<string> {
    const id = `farmer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const farmerData: FarmerRegistration = {
      ...farmer,
      id,
      isOffline: true,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    await this.addToStore('farmers', farmerData);
    return id;
  }

  async getFarmersOffline(): Promise<FarmerRegistration[]> {
    return this.getAllFromStore('farmers');
  }

  async updateFarmerSyncStatus(id: string, status: 'synced' | 'failed'): Promise<void> {
    const transaction = this.db!.transaction(['farmers'], 'readwrite');
    const store = transaction.objectStore('farmers');
    const farmer = await this.getFromStore('farmers', id);
    
    if (farmer) {
      farmer.status = status;
      await store.put(farmer);
    }
  }

  // Map Data Methods
  async saveMapPlotOffline(plot: Omit<MapPlot, 'id' | 'isOffline' | 'timestamp' | 'status'>): Promise<string> {
    const id = `plot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const plotData: MapPlot = {
      ...plot,
      id,
      isOffline: true,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    await this.addToStore('mapData', plotData);
    return id;
  }

  async getMapPlotsOffline(): Promise<MapPlot[]> {
    return this.getAllFromStore('mapData');
  }

  async getMapPlotsByFarmer(farmerId: string): Promise<MapPlot[]> {
    return this.getByIndex('mapData', 'farmerId', farmerId);
  }

  // Authentication Methods
  async saveAuthTokenOffline(username: string, token: string, userType: string, role: string, expiresIn: number): Promise<void> {
    const authData: AuthToken = {
      username,
      token,
      userType,
      role,
      expiresAt: Date.now() + (expiresIn * 1000),
      isOffline: true
    };
    
    await this.addToStore('authTokens', authData);
  }

  async getAuthTokenOffline(username: string): Promise<AuthToken | null> {
    const token = await this.getFromStore('authTokens', username);
    
    // Check if token is expired
    if (token && token.expiresAt > Date.now()) {
      return token;
    }
    
    // Remove expired token
    if (token) {
      await this.removeFromStore('authTokens', username);
    }
    
    return null;
  }

  async getAllAuthTokensOffline(): Promise<AuthToken[]> {
    const tokens = await this.getAllFromStore('authTokens');
    return tokens.filter(token => token.expiresAt > Date.now());
  }

  async removeAuthTokenOffline(username: string): Promise<void> {
    await this.removeFromStore('authTokens', username);
  }

  // GPS Coordinates Methods
  async saveGPSCoordinateOffline(coordinate: Omit<GPSCoordinate, 'id' | 'timestamp' | 'isOffline'>): Promise<string> {
    const id = `gps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const gpsData: GPSCoordinate = {
      ...coordinate,
      id,
      timestamp: Date.now(),
      isOffline: true
    };
    
    await this.addToStore('gpsCoordinates', gpsData);
    return id;
  }

  async getGPSCoordinatesOffline(): Promise<GPSCoordinate[]> {
    return this.getAllFromStore('gpsCoordinates');
  }

  async getRecentGPSCoordinates(hours: number = 24): Promise<GPSCoordinate[]> {
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    const allCoords = await this.getAllFromStore('gpsCoordinates');
    return allCoords.filter(coord => coord.timestamp > cutoff);
  }

  // Inspection Methods
  async saveInspectionOffline(inspection: Omit<OfflineInspection, 'id' | 'isOffline' | 'timestamp' | 'status'>): Promise<string> {
    const id = `inspection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const inspectionData: OfflineInspection = {
      ...inspection,
      id,
      isOffline: true,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    await this.addToStore('inspections', inspectionData);
    return id;
  }

  async getInspectionsOffline(): Promise<OfflineInspection[]> {
    return this.getAllFromStore('inspections');
  }

  async getPendingInspections(): Promise<OfflineInspection[]> {
    return this.getByIndex('inspections', 'status', 'pending');
  }

  // Synchronization Methods
  async getPendingFarmers(): Promise<FarmerRegistration[]> {
    return this.getByIndex('farmers', 'status', 'pending');
  }

  async getPendingMapData(): Promise<MapPlot[]> {
    return this.getByIndex('mapData', 'status', 'pending');
  }

  async markAsSynced(storeName: string, id: string): Promise<void> {
    const transaction = this.db!.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const item = await this.getFromStore(storeName, id);
    
    if (item) {
      item.status = 'synced';
      await store.put(item);
    }
  }

  async getLastSyncTime(): Promise<number> {
    const setting = await this.getFromStore('settings', 'lastSync');
    return setting ? setting.value : 0;
  }

  async updateLastSyncTime(): Promise<void> {
    await this.addToStore('settings', { key: 'lastSync', value: Date.now() });
  }

  // Utility Methods
  async clearAllOfflineData(): Promise<void> {
    const stores = ['farmers', 'mapData', 'authTokens', 'inspections', 'gpsCoordinates'];
    
    for (const storeName of stores) {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      await store.clear();
    }
  }

  async getOfflineDataStats(): Promise<{
    farmers: number;
    mapPlots: number;
    inspections: number;
    gpsCoordinates: number;
    authTokens: number;
  }> {
    const farmers = await this.getAllFromStore('farmers');
    const mapPlots = await this.getAllFromStore('mapData');
    const inspections = await this.getAllFromStore('inspections');
    const gpsCoordinates = await this.getAllFromStore('gpsCoordinates');
    const authTokens = await this.getAllFromStore('authTokens');

    return {
      farmers: farmers.length,
      mapPlots: mapPlots.length,
      inspections: inspections.length,
      gpsCoordinates: gpsCoordinates.length,
      authTokens: authTokens.length
    };
  }

  // Generic IndexedDB Operations
  private async addToStore(storeName: string, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async getFromStore(storeName: string, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async getAllFromStore(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async getByIndex(storeName: string, indexName: string, value: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  private async removeFromStore(storeName: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorageService();

// Initialize on import
offlineStorage.init().catch(console.error);

export type { FarmerRegistration, MapPlot, AuthToken, OfflineInspection, GPSCoordinate };