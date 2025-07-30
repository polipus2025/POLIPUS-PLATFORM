import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSyncStatus, syncWithMainPlatform } from '../services/sync';
import { offlineQueueDB } from '../services/database';

interface SyncStatus {
  lastSyncTime: string | null;
  pendingActions: number;
  isConnected: boolean;
}

interface PendingAction {
  id: number;
  action_type: string;
  data: any;
  created_at: string;
  retry_count: number;
}

const OfflineSyncScreen: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSyncTime: null,
    pendingActions: 0,
    isConnected: false
  });
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncAttempt, setLastSyncAttempt] = useState<string | null>(null);

  useEffect(() => {
    loadSyncData();
    const interval = setInterval(loadSyncData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSyncData = async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);

      const actions = await offlineQueueDB.getPendingActions();
      setPendingActions(actions);
    } catch (error) {
      console.error('Error loading sync data:', error);
    }
  };

  const handleManualSync = async () => {
    if (isSyncing) return;

    setIsSyncing(true);
    setLastSyncAttempt(new Date().toISOString());

    try {
      await syncWithMainPlatform();
      Alert.alert('Sync Successful', 'All data has been synchronized with the main platform');
      await loadSyncData();
    } catch (error) {
      console.error('Sync failed:', error);
      Alert.alert(
        'Sync Failed', 
        'Unable to connect to the main platform. Data will be synced automatically when connection is restored.'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSyncData();
    setIsRefreshing(false);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'gps_point_created':
      case 'boundary_created':
        return 'location';
      case 'commodity_scanned':
        return 'qr-code';
      case 'user_profile_updated':
        return 'person';
      default:
        return 'documents';
    }
  };

  const getActionDescription = (action: PendingAction) => {
    switch (action.action_type) {
      case 'gps_point_created':
        return `GPS point recorded at ${action.data.latitude?.toFixed(4)}, ${action.data.longitude?.toFixed(4)}`;
      case 'boundary_created':
        return `Farm boundary created with ${action.data.boundaryPoints?.length} points`;
      case 'commodity_scanned':
        return `Commodity scanned: ${action.data.name}`;
      case 'user_profile_updated':
        return 'User profile information updated';
      default:
        return `${action.action_type.replace('_', ' ')} action`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderStatusCard = (title: string, value: string, icon: string, color: string, subtitle?: string) => (
    <View style={[styles.statusCard, { borderLeftColor: color }]}>
      <View style={styles.statusContent}>
        <View style={styles.statusHeader}>
          <Ionicons name={icon as any} size={24} color={color} />
          <Text style={styles.statusValue}>{value}</Text>
        </View>
        <Text style={styles.statusTitle}>{title}</Text>
        {subtitle && <Text style={styles.statusSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  const renderPendingAction = (action: PendingAction, index: number) => (
    <View key={action.id} style={styles.actionCard}>
      <View style={styles.actionHeader}>
        <View style={styles.actionIcon}>
          <Ionicons 
            name={getActionIcon(action.action_type) as any} 
            size={20} 
            color="#3b82f6" 
          />
        </View>
        <View style={styles.actionInfo}>
          <Text style={styles.actionDescription}>
            {getActionDescription(action)}
          </Text>
          <Text style={styles.actionTime}>
            {formatDate(action.created_at)}
          </Text>
          {action.retry_count > 0 && (
            <Text style={styles.retryCount}>
              Retry attempts: {action.retry_count}
            </Text>
          )}
        </View>
        <View style={styles.actionStatus}>
          <Ionicons name="time" size={16} color="#f59e0b" />
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Offline Data Sync</Text>
        <Text style={styles.headerSubtitle}>
          Manage offline data and synchronization with the main platform
        </Text>
      </View>

      {/* Connection Status */}
      <View style={[
        styles.connectionCard,
        { backgroundColor: syncStatus.isConnected ? '#dcfce7' : '#fef3c7' }
      ]}>
        <View style={styles.connectionContent}>
          <Ionicons 
            name={syncStatus.isConnected ? "wifi" : "wifi-off"} 
            size={24} 
            color={syncStatus.isConnected ? "#16a34a" : "#d97706"} 
          />
          <View style={styles.connectionInfo}>
            <Text style={[
              styles.connectionStatus,
              { color: syncStatus.isConnected ? "#16a34a" : "#d97706" }
            ]}>
              {syncStatus.isConnected ? 'Online' : 'Offline'}
            </Text>
            <Text style={styles.connectionDescription}>
              {syncStatus.isConnected 
                ? 'Connected to main platform' 
                : 'Working in offline mode'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Sync Statistics */}
      <View style={styles.statsContainer}>
        {renderStatusCard(
          'Pending Actions',
          syncStatus.pendingActions.toString(),
          'documents',
          '#f59e0b',
          'Actions waiting to sync'
        )}
        {renderStatusCard(
          'Last Sync',
          syncStatus.lastSyncTime 
            ? new Date(syncStatus.lastSyncTime).toLocaleDateString()
            : 'Never',
          'sync',
          '#3b82f6',
          syncStatus.lastSyncTime 
            ? new Date(syncStatus.lastSyncTime).toLocaleTimeString()
            : 'No sync performed'
        )}
      </View>

      {/* Sync Controls */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[
            styles.syncButton,
            (!syncStatus.isConnected || isSyncing) && styles.disabledButton
          ]}
          onPress={handleManualSync}
          disabled={!syncStatus.isConnected || isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Ionicons name="sync" size={20} color="#ffffff" />
          )}
          <Text style={styles.syncButtonText}>
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Text>
        </TouchableOpacity>

        {!syncStatus.isConnected && (
          <View style={styles.offlineNotice}>
            <Ionicons name="information-circle" size={16} color="#6b7280" />
            <Text style={styles.offlineNoticeText}>
              Data will sync automatically when connection is restored
            </Text>
          </View>
        )}
      </View>

      {/* Pending Actions List */}
      {pendingActions.length > 0 && (
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>
            Pending Actions ({pendingActions.length})
          </Text>
          {pendingActions.map((action, index) => renderPendingAction(action, index))}
        </View>
      )}

      {/* No Pending Actions */}
      {pendingActions.length === 0 && syncStatus.isConnected && (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
          <Text style={styles.emptyTitle}>All data synchronized</Text>
          <Text style={styles.emptyDescription}>
            No pending actions. All your data is up to date with the main platform.
          </Text>
        </View>
      )}

      {/* Sync Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Sync Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Auto Sync</Text>
            <Text style={styles.infoValue}>Enabled</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Sync Frequency</Text>
            <Text style={styles.infoValue}>When online</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Attempt</Text>
            <Text style={styles.infoValue}>
              {lastSyncAttempt 
                ? formatDate(lastSyncAttempt)
                : 'No recent attempts'
              }
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Data Storage</Text>
            <Text style={styles.infoValue}>Local SQLite database</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  connectionCard: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  connectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionInfo: {
    marginLeft: 12,
  },
  connectionStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  connectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusContent: {
    alignItems: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  statusTitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statusSubtitle: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 2,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
  },
  offlineNoticeText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#eff6ff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  actionTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  retryCount: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 2,
  },
  actionStatus: {
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#374151',
  },
  infoValue: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'right',
  },
});

export default OfflineSyncScreen;