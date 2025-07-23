import { useState, useEffect, useCallback } from 'react';
import { offlineSyncManager, type SyncResult, type ConflictResolution } from '@/lib/offline-sync';
import { useToast } from '@/hooks/use-toast';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [queuedOperations, setQueuedOperations] = useState(0);
  const [pendingConflicts, setPendingConflicts] = useState<any[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    const updateQueueCount = () => setQueuedOperations(offlineSyncManager.getQueuedOperationsCount());
    const updateConflicts = () => setPendingConflicts(offlineSyncManager.getPendingConflicts());
    const updateLastSync = () => setLastSyncTime(offlineSyncManager.getLastSyncTime());

    // Initial updates
    updateQueueCount();
    updateConflicts();
    updateLastSync();

    // Event listeners
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Sync completion listener
    const unsubscribe = offlineSyncManager.onSyncComplete((result: SyncResult) => {
      setIsSyncing(false);
      updateQueueCount();
      updateConflicts();
      updateLastSync();

      if (result.success && result.conflicts.length === 0 && result.errors.length === 0) {
        toast({
          title: "Sync Complete",
          description: "All offline data has been synchronized successfully.",
        });
      } else if (result.conflicts.length > 0) {
        toast({
          title: "Sync Conflicts Detected",
          description: `${result.conflicts.length} conflicts require resolution.`,
          variant: "default",
        });
      } else if (result.errors.length > 0) {
        toast({
          title: "Sync Errors",
          description: `${result.errors.length} operations failed to sync.`,
          variant: "destructive",
        });
      }
    });

    // Periodic updates
    const interval = setInterval(() => {
      updateQueueCount();
      updateConflicts();
    }, 5000);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      unsubscribe();
      clearInterval(interval);
    };
  }, [toast]);

  const queueOperation = useCallback(async (
    type: 'CREATE' | 'UPDATE' | 'DELETE',
    endpoint: string,
    data: any
  ) => {
    const userId = localStorage.getItem('userId') || 'unknown';
    await offlineSyncManager.queueOperation(type, endpoint, data, userId);
    setQueuedOperations(offlineSyncManager.getQueuedOperationsCount());

    if (!isOnline) {
      toast({
        title: "Offline Mode",
        description: "Operation queued for sync when connection is restored.",
      });
    }
  }, [isOnline, toast]);

  const syncNow = useCallback(async (conflictResolution?: ConflictResolution) => {
    if (isSyncing || !isOnline) return;
    
    setIsSyncing(true);
    try {
      await offlineSyncManager.syncAll(conflictResolution);
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync offline data. Will retry automatically.",
        variant: "destructive",
      });
    }
  }, [isSyncing, isOnline, toast]);

  const resolveConflict = useCallback((conflictId: string, resolution: any) => {
    offlineSyncManager.resolveManualConflict(conflictId, resolution);
    setPendingConflicts(offlineSyncManager.getPendingConflicts());
  }, []);

  const clearQueue = useCallback(() => {
    offlineSyncManager.clearQueue();
    setQueuedOperations(0);
  }, []);

  return {
    isOnline,
    isSyncing,
    queuedOperations,
    pendingConflicts,
    lastSyncTime,
    queueOperation,
    syncNow,
    resolveConflict,
    clearQueue
  };
}