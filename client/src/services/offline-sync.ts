// Offline Synchronization Service for Polipus Platform
// Handles data caching, offline operations, and background sync

interface OfflineOperation {
  id: string;
  type: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'synced' | 'failed';
}

interface CacheEntry {
  data: any;
  timestamp: string;
  ttl: number; // Time to live in milliseconds
}

class OfflineSyncService {
  private static instance: OfflineSyncService;
  private syncQueue: OfflineOperation[] = [];
  private cache: Map<string, CacheEntry> = new Map();
  private syncInProgress = false;
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds

  static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  constructor() {
    this.loadFromStorage();
    this.setupEventListeners();
    
    // Auto-sync every 30 seconds when online
    setInterval(() => {
      if (navigator.onLine && !this.syncInProgress) {
        this.syncPendingOperations();
      }
    }, 30000);
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('Back online - starting sync...');
      this.syncPendingOperations();
    });

    window.addEventListener('offline', () => {
      console.log('Gone offline - operations will be queued');
    });

    // Sync before page unload
    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  }

  private loadFromStorage() {
    try {
      const storedQueue = localStorage.getItem('offline-sync-queue');
      if (storedQueue) {
        this.syncQueue = JSON.parse(storedQueue);
      }

      const storedCache = localStorage.getItem('offline-data-cache');
      if (storedCache) {
        const cacheData = JSON.parse(storedCache);
        this.cache = new Map(cacheData);
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('offline-sync-queue', JSON.stringify(this.syncQueue));
      localStorage.setItem('offline-data-cache', JSON.stringify([...this.cache]));
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  // Cache data for offline access
  cacheData(key: string, data: any, ttlMinutes: number = 60) {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    const entry: CacheEntry = {
      data,
      timestamp: new Date().toISOString(),
      ttl
    };
    
    this.cache.set(key, entry);
    this.saveToStorage();
  }

  // Retrieve cached data
  getCachedData(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const entryTime = new Date(entry.timestamp).getTime();
    
    if (now - entryTime > entry.ttl) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return entry.data;
  }

  // Add operation to sync queue
  queueOperation(type: string, endpoint: string, method: OfflineOperation['method'], data?: any): string {
    const operation: OfflineOperation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      method,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'pending'
    };

    this.syncQueue.push(operation);
    this.saveToStorage();

    // If online, try to sync immediately
    if (navigator.onLine) {
      this.syncPendingOperations();
    }

    return operation.id;
  }

  // Sync all pending operations
  async syncPendingOperations(): Promise<boolean> {
    if (this.syncInProgress || !navigator.onLine) {
      return false;
    }

    this.syncInProgress = true;
    const pendingOps = this.syncQueue.filter(op => op.status === 'pending');

    console.log(`Syncing ${pendingOps.length} pending operations...`);

    for (const operation of pendingOps) {
      try {
        await this.syncOperation(operation);
      } catch (error) {
        console.error(`Failed to sync operation ${operation.id}:`, error);
        operation.retryCount++;
        
        if (operation.retryCount >= this.maxRetries) {
          operation.status = 'failed';
          console.error(`Operation ${operation.id} failed permanently after ${this.maxRetries} retries`);
        }
      }
    }

    // Remove synced operations
    this.syncQueue = this.syncQueue.filter(op => op.status !== 'synced');
    this.saveToStorage();
    this.syncInProgress = false;

    return true;
  }

  // Sync individual operation
  private async syncOperation(operation: OfflineOperation): Promise<void> {
    const { endpoint, method, data } = operation;

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    operation.status = 'synced';

    // Cache successful GET responses
    if (method === 'GET') {
      this.cacheData(endpoint, result, 30);
    }

    console.log(`Successfully synced operation ${operation.id}`);
  }

  // Get pending operations count
  getPendingCount(): number {
    return this.syncQueue.filter(op => op.status === 'pending').length;
  }

  // Get failed operations count
  getFailedCount(): number {
    return this.syncQueue.filter(op => op.status === 'failed').length;
  }

  // Clear all offline data
  clearOfflineData() {
    this.syncQueue = [];
    this.cache.clear();
    localStorage.removeItem('offline-sync-queue');
    localStorage.removeItem('offline-data-cache');
    localStorage.removeItem('offline-farmer-registrations');
    localStorage.removeItem('farmer-credentials');
  }

  // Enhanced farmer data operations
  async saveFarmerData(farmerData: any): Promise<string> {
    if (navigator.onLine) {
      try {
        const response = await fetch('/api/farmers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(farmerData)
        });

        if (response.ok) {
          const result = await response.json();
          return result.farmerId;
        }
      } catch (error) {
        console.log('Online save failed, queuing for offline sync...');
      }
    }

    // Queue for offline sync
    return this.queueOperation('farmer-registration', '/api/farmers', 'POST', farmerData);
  }

  async getFarmPlots(farmerId: string): Promise<any[]> {
    const cacheKey = `/api/farm-plots?farmerId=${farmerId}`;
    
    // Try cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    // If online, fetch fresh data
    if (navigator.onLine) {
      try {
        const response = await fetch(cacheKey);
        if (response.ok) {
          const data = await response.json();
          this.cacheData(cacheKey, data, 15); // Cache for 15 minutes
          return data;
        }
      } catch (error) {
        console.log('Failed to fetch farm plots, using cached data...');
      }
    }

    // Return empty array if no cached data
    return [];
  }

  async syncFarmerRegistrations(): Promise<void> {
    const offlineRegistrations = JSON.parse(
      localStorage.getItem('offline-farmer-registrations') || '[]'
    );

    for (const registration of offlineRegistrations) {
      if (registration.status === 'pending_sync') {
        this.queueOperation(
          'farmer-registration',
          '/api/farmers',
          'POST',
          registration
        );
      }
    }

    // Clear offline registrations after queuing
    localStorage.removeItem('offline-farmer-registrations');
  }
}

// Export singleton instance
export const offlineSync = OfflineSyncService.getInstance();

// Helper functions for common operations
export const cacheApiResponse = (endpoint: string, data: any, ttlMinutes?: number) => {
  offlineSync.cacheData(endpoint, data, ttlMinutes);
};

export const getCachedApiResponse = (endpoint: string) => {
  return offlineSync.getCachedData(endpoint);
};

export const queueOfflineOperation = (type: string, endpoint: string, method: any, data?: any) => {
  return offlineSync.queueOperation(type, endpoint, method, data);
};

export const getPendingOperationsCount = () => {
  return offlineSync.getPendingCount();
};

export default OfflineSyncService;