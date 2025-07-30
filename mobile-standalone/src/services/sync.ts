import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncAPI } from './api';
import { offlineQueueDB } from './database';

export const syncWithMainPlatform = async (): Promise<void> => {
  try {
    // Check connectivity first
    const isConnected = await syncAPI.checkConnectivity();
    if (!isConnected) {
      throw new Error('No connection to main platform');
    }

    // Upload pending offline actions
    await uploadOfflineData();
    
    // Download updates from main platform
    await downloadUpdates();
    
    // Update last sync time
    await AsyncStorage.setItem('lastSyncTime', new Date().toISOString());
  } catch (error) {
    throw error;
  }
};

const uploadOfflineData = async (): Promise<void> => {
  try {
    const pendingActions = await offlineQueueDB.getPendingActions();
    
    if (pendingActions.length === 0) {
      return;
    }

    for (const action of pendingActions) {
      try {
        await syncAPI.uploadOfflineData({
          type: action.action_type,
          data: action.data,
          timestamp: action.created_at
        });
        
        // Remove successfully uploaded action
        await offlineQueueDB.removeAction(action.id);
      } catch (error) {
        // Action remains in queue for retry
      }
    }
  } catch (error) {
    throw error;
  }
};

const downloadUpdates = async (): Promise<void> => {
  try {
    const lastSyncTime = await AsyncStorage.getItem('lastSyncTime');
    const updates = await syncAPI.downloadUpdates(lastSyncTime || '1970-01-01T00:00:00Z');
    
    // Process updates and update local database
    if (updates && updates.length > 0) {
      // Process different types of updates
      for (const update of updates) {
        await processUpdate(update);
      }
    }
  } catch (error) {
    throw error;
  }
};

const processUpdate = async (update: any): Promise<void> => {
  switch (update.type) {
    case 'commodity_update':
      // Update local commodity data
      break;
      
    case 'gps_boundary_update':
      // Update GPS boundary data
      break;
      
    case 'user_profile_update':
      // Update user profile cache
      break;
      
    default:
      // Unknown update type handled silently
  }
};

// Queue offline action for later sync
export const queueOfflineAction = async (actionType: string, data: any): Promise<void> => {
  try {
    await offlineQueueDB.addAction(actionType, data);
  } catch (error) {
    throw error;
  }
};

// Check sync status
export const getSyncStatus = async (): Promise<{
  lastSyncTime: string | null;
  pendingActions: number;
  isConnected: boolean;
}> => {
  try {
    const lastSyncTime = await AsyncStorage.getItem('lastSyncTime');
    const pendingActions = await offlineQueueDB.getPendingActions();
    const isConnected = await syncAPI.checkConnectivity();
    
    return {
      lastSyncTime,
      pendingActions: pendingActions.length,
      isConnected
    };
  } catch (error) {
    console.error('Failed to get sync status:', error);
    return {
      lastSyncTime: null,
      pendingActions: 0,
      isConnected: false
    };
  }
};