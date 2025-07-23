import { queryClient } from './queryClient';

export interface OfflineOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: number;
  retries: number;
  userId: string;
}

export interface ConflictResolution {
  strategy: 'client-wins' | 'server-wins' | 'merge' | 'manual';
  resolver?: (clientData: any, serverData: any) => any;
}

export interface SyncResult {
  success: boolean;
  conflicts: Array<{
    operation: OfflineOperation;
    conflict: any;
    resolution?: any;
  }>;
  errors: Array<{
    operation: OfflineOperation;
    error: string;
  }>;
}

class OfflineSyncManager {
  private isOnline: boolean = navigator.onLine;
  private operationsQueue: OfflineOperation[] = [];
  private syncInProgress: boolean = false;
  private maxRetries: number = 3;
  private syncListeners: Array<(result: SyncResult) => void> = [];

  constructor() {
    this.initializeEventListeners();
    this.loadQueueFromStorage();
    
    // Auto-sync when coming back online
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncAll();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private initializeEventListeners() {
    // Listen for visibility changes to sync when tab becomes active
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline && this.operationsQueue.length > 0) {
        this.syncAll();
      }
    });
  }

  private loadQueueFromStorage() {
    try {
      const stored = localStorage.getItem('offline-operations-queue');
      if (stored) {
        this.operationsQueue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline operations queue:', error);
      this.operationsQueue = [];
    }
  }

  private saveQueueToStorage() {
    try {
      localStorage.setItem('offline-operations-queue', JSON.stringify(this.operationsQueue));
    } catch (error) {
      console.error('Failed to save offline operations queue:', error);
    }
  }

  async queueOperation(
    type: OfflineOperation['type'],
    endpoint: string,
    data: any,
    userId: string
  ): Promise<void> {
    const operation: OfflineOperation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retries: 0,
      userId
    };

    this.operationsQueue.push(operation);
    this.saveQueueToStorage();

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncAll();
    }
  }

  async syncAll(conflictResolution: ConflictResolution = { strategy: 'client-wins' }): Promise<SyncResult> {
    if (this.syncInProgress || !this.isOnline || this.operationsQueue.length === 0) {
      return { success: true, conflicts: [], errors: [] };
    }

    this.syncInProgress = true;
    const result: SyncResult = { success: true, conflicts: [], errors: [] };

    try {
      // Sort operations by timestamp to maintain order
      const sortedOperations = [...this.operationsQueue].sort((a, b) => a.timestamp - b.timestamp);
      
      for (const operation of sortedOperations) {
        try {
          await this.syncOperation(operation, conflictResolution, result);
          this.removeOperationFromQueue(operation.id);
        } catch (error) {
          operation.retries++;
          if (operation.retries >= this.maxRetries) {
            result.errors.push({
              operation,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
            this.removeOperationFromQueue(operation.id);
          }
          result.success = false;
        }
      }

      this.saveQueueToStorage();
      this.notifyListeners(result);
      
    } finally {
      this.syncInProgress = false;
    }

    return result;
  }

  private async syncOperation(
    operation: OfflineOperation,
    conflictResolution: ConflictResolution,
    result: SyncResult
  ): Promise<void> {
    const { type, endpoint, data } = operation;

    try {
      let response: Response;
      
      switch (type) {
        case 'CREATE':
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(data)
          });
          break;
          
        case 'UPDATE':
          response = await fetch(endpoint, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(data)
          });
          break;
          
        case 'DELETE':
          response = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          break;
      }

      if (response.status === 409) {
        // Conflict detected
        const serverData = await response.json();
        const conflict = await this.resolveConflict(operation, serverData, conflictResolution);
        result.conflicts.push(conflict);
        
        if (conflict.resolution) {
          // Retry with resolved data
          await this.syncOperation({
            ...operation,
            data: conflict.resolution
          }, conflictResolution, result);
        }
      } else if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Invalidate related queries in React Query cache
      this.invalidateRelatedQueries(endpoint);
      
    } catch (error) {
      throw error;
    }
  }

  private async resolveConflict(
    operation: OfflineOperation,
    serverData: any,
    conflictResolution: ConflictResolution
  ) {
    const conflict = {
      operation,
      conflict: serverData,
      resolution: undefined as any
    };

    switch (conflictResolution.strategy) {
      case 'client-wins':
        conflict.resolution = operation.data;
        break;
        
      case 'server-wins':
        conflict.resolution = serverData;
        break;
        
      case 'merge':
        conflict.resolution = this.mergeData(operation.data, serverData);
        break;
        
      case 'manual':
        if (conflictResolution.resolver) {
          conflict.resolution = conflictResolution.resolver(operation.data, serverData);
        } else {
          // Store conflict for manual resolution
          this.storeConflictForManualResolution(conflict);
        }
        break;
    }

    return conflict;
  }

  private mergeData(clientData: any, serverData: any): any {
    // Simple merge strategy - prefer client data but keep server metadata
    return {
      ...serverData,
      ...clientData,
      // Preserve server timestamps and IDs
      id: serverData.id,
      createdAt: serverData.createdAt,
      updatedAt: new Date().toISOString()
    };
  }

  private storeConflictForManualResolution(conflict: any) {
    try {
      const stored = localStorage.getItem('pending-conflicts') || '[]';
      const conflicts = JSON.parse(stored);
      conflicts.push({
        ...conflict,
        timestamp: Date.now()
      });
      localStorage.setItem('pending-conflicts', JSON.stringify(conflicts));
    } catch (error) {
      console.error('Failed to store conflict for manual resolution:', error);
    }
  }

  private invalidateRelatedQueries(endpoint: string) {
    // Extract base endpoint for cache invalidation
    const baseEndpoint = endpoint.split('/').slice(0, 3).join('/');
    queryClient.invalidateQueries({ queryKey: [baseEndpoint] });
  }

  private removeOperationFromQueue(operationId: string) {
    this.operationsQueue = this.operationsQueue.filter(op => op.id !== operationId);
  }

  private notifyListeners(result: SyncResult) {
    this.syncListeners.forEach(listener => {
      try {
        listener(result);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  // Public API methods
  
  onSyncComplete(listener: (result: SyncResult) => void) {
    this.syncListeners.push(listener);
    return () => {
      this.syncListeners = this.syncListeners.filter(l => l !== listener);
    };
  }

  getQueuedOperationsCount(): number {
    return this.operationsQueue.length;
  }

  getPendingConflicts(): any[] {
    try {
      const stored = localStorage.getItem('pending-conflicts') || '[]';
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  resolveManualConflict(conflictId: string, resolution: any) {
    try {
      const stored = localStorage.getItem('pending-conflicts') || '[]';
      const conflicts = JSON.parse(stored);
      const conflictIndex = conflicts.findIndex((c: any) => c.operation.id === conflictId);
      
      if (conflictIndex >= 0) {
        const conflict = conflicts[conflictIndex];
        conflicts.splice(conflictIndex, 1);
        localStorage.setItem('pending-conflicts', JSON.stringify(conflicts));
        
        // Queue the resolved operation
        this.queueOperation(
          conflict.operation.type,
          conflict.operation.endpoint,
          resolution,
          conflict.operation.userId
        );
      }
    } catch (error) {
      console.error('Failed to resolve manual conflict:', error);
    }
  }

  clearQueue() {
    this.operationsQueue = [];
    this.saveQueueToStorage();
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  getLastSyncTime(): number {
    const stored = localStorage.getItem('last-sync-time');
    return stored ? parseInt(stored) : 0;
  }

  private updateLastSyncTime() {
    localStorage.setItem('last-sync-time', Date.now().toString());
  }
}

export const offlineSyncManager = new OfflineSyncManager();