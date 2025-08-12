import React, { useState, useEffect } from 'react';
import { Sync, CheckCircle, AlertCircle, Clock, Wifi } from 'lucide-react';
import { offlineSync, type SyncProgress } from '@/services/offline-sync';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function OfflineSyncStatus() {
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  useEffect(() => {
    // Listen for sync progress
    offlineSync.onSyncProgress((progress) => {
      setSyncProgress(progress);
      
      if (progress.percentage === 100) {
        setTimeout(() => {
          setSyncProgress(null);
        }, 2000);
      }
    });

    // Load initial sync status
    loadSyncStatus();
  }, []);

  const loadSyncStatus = async () => {
    try {
      const status = await offlineSync.getSyncStatus();
      // You could store and display this status
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const handleManualSync = async () => {
    if (!navigator.onLine) {
      alert('Cannot sync while offline. Please check your internet connection.');
      return;
    }

    setIsManualSyncing(true);
    
    try {
      const result = await offlineSync.forceSyncNow();
      setLastSyncResult(result);
      
      if (result.success) {
        alert(`Sync completed successfully! ${result.synced} items synced.`);
      } else {
        alert(`Sync completed with ${result.failed} failures. Check the details for more information.`);
      }
    } catch (error) {
      alert('Sync failed. Please try again.');
    } finally {
      setIsManualSyncing(false);
    }
  };

  const getSyncStatusIcon = () => {
    if (syncProgress) {
      return <Sync className="w-5 h-5 animate-spin text-blue-500" />;
    }
    
    if (!navigator.onLine) {
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
    
    if (lastSyncResult?.success) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    return <Clock className="w-5 h-5 text-gray-500" />;
  };

  const getSyncStatusText = () => {
    if (syncProgress) {
      return `Syncing: ${syncProgress.current}`;
    }
    
    if (!navigator.onLine) {
      return 'Offline - sync paused';
    }
    
    if (lastSyncResult?.success) {
      return 'All data synced';
    }
    
    return 'Ready to sync';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getSyncStatusIcon()}
          <div>
            <div className="font-medium text-sm">{getSyncStatusText()}</div>
            {syncProgress && (
              <div className="text-xs text-gray-500">
                {syncProgress.completed} of {syncProgress.total} items
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleManualSync}
          disabled={!navigator.onLine || isManualSyncing || !!syncProgress}
          size="sm"
          variant="outline"
        >
          <Wifi className="w-4 h-4 mr-2" />
          Sync Now
        </Button>
      </div>

      {syncProgress && (
        <div className="mt-3">
          <Progress value={syncProgress.percentage} className="w-full" />
          <div className="text-xs text-gray-500 mt-1">
            {syncProgress.percentage}% complete
          </div>
        </div>
      )}

      {lastSyncResult && lastSyncResult.errors.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 rounded text-xs">
          <div className="font-medium text-red-800">Sync Errors:</div>
          {lastSyncResult.errors.slice(0, 3).map((error: string, index: number) => (
            <div key={index} className="text-red-600">{error}</div>
          ))}
          {lastSyncResult.errors.length > 3 && (
            <div className="text-red-600">
              ... and {lastSyncResult.errors.length - 3} more errors
            </div>
          )}
        </div>
      )}
    </div>
  );
}