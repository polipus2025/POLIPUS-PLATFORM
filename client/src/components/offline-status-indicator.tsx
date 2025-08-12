import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Sync, AlertTriangle } from 'lucide-react';
import { offlineStorage } from '@/services/offline-storage';
import { offlineSync } from '@/services/offline-sync';

export default function OfflineStatusIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingItems, setPendingItems] = useState(0);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [lastSync, setLastSync] = useState<number>(0);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load initial offline data stats
    loadOfflineStats();

    // Set up sync progress listener
    offlineSync.onSyncProgress((progress) => {
      setSyncInProgress(progress.percentage < 100);
    });

    // Check sync status periodically
    const interval = setInterval(loadOfflineStats, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const loadOfflineStats = async () => {
    try {
      const syncStatus = await offlineSync.getSyncStatus();
      setPendingItems(syncStatus.pendingItems);
      setLastSync(syncStatus.lastSync);
      setSyncInProgress(syncStatus.syncInProgress);
    } catch (error) {
      console.error('Failed to load offline stats:', error);
    }
  };

  const formatLastSync = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-orange-500';
    if (pendingItems > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline Mode';
    if (syncInProgress) return 'Syncing...';
    if (pendingItems > 0) return `${pendingItems} pending`;
    return 'Online';
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
      {isOnline ? (
        syncInProgress ? (
          <Sync className="w-4 h-4 animate-spin" />
        ) : pendingItems > 0 ? (
          <CloudOff className="w-4 h-4" />
        ) : (
          <Cloud className="w-4 h-4" />
        )
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      
      <span className="font-medium">{getStatusText()}</span>
      
      {lastSync > 0 && (
        <span className="text-xs text-gray-500">
          Last sync: {formatLastSync(lastSync)}
        </span>
      )}
      
      {pendingItems > 0 && (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
          {pendingItems} items to sync
        </span>
      )}
    </div>
  );
}