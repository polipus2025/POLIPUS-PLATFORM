import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dashboardAPI } from '../services/api';
import { getSyncStatus } from '../services/sync';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalFarms: number;
  activeCommodities: number;
  complianceRate: number;
  gpsPointsCollected: number;
}

const DashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalFarms: 0,
    activeCommodities: 0,
    complianceRate: 0,
    gpsPointsCollected: 0
  });
  const [user, setUser] = useState<any>(null);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load user data
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load dashboard stats
      await loadStats();
      
      // Load sync status
      await loadSyncStatus();
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Use offline/demo data
      setStats({
        totalFarms: 45,
        activeCommodities: 128,
        complianceRate: 87,
        gpsPointsCollected: 2304
      });
    }
  };

  const loadSyncStatus = async () => {
    try {
      const status = await getSyncStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Failed to load sync status:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadStats();
    await loadSyncStatus();
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['authToken', 'userType', 'user']);
            // The app will automatically navigate to login screen
          }
        }
      ]
    );
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <View style={styles.statHeader}>
          <Ionicons name={icon as any} size={24} color={color} />
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  const renderQuickAction = (title: string, icon: string, onPress: () => void, color: string) => (
    <TouchableOpacity 
      style={[styles.quickAction, { backgroundColor: color }]} 
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={28} color="#ffffff" />
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.firstName || 'User'}</Text>
          <Text style={styles.userRole}>{user?.role || 'Mobile User'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>

      {/* Sync Status */}
      {syncStatus && (
        <View style={[
          styles.syncStatusCard,
          { backgroundColor: syncStatus.isConnected ? '#dcfce7' : '#fef3c7' }
        ]}>
          <View style={styles.syncStatusContent}>
            <Ionicons 
              name={syncStatus.isConnected ? "checkmark-circle" : "warning"} 
              size={20} 
              color={syncStatus.isConnected ? "#16a34a" : "#d97706"} 
            />
            <Text style={styles.syncStatusText}>
              {syncStatus.isConnected ? 'Online - Synced' : 'Offline Mode'}
            </Text>
          </View>
          {syncStatus.pendingActions > 0 && (
            <Text style={styles.pendingText}>
              {syncStatus.pendingActions} pending actions
            </Text>
          )}
        </View>
      )}

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        {renderStatCard('Total Farms', stats.totalFarms, 'home', '#16a34a')}
        {renderStatCard('Active Commodities', stats.activeCommodities, 'cube', '#3b82f6')}
        {renderStatCard('Compliance Rate', `${stats.complianceRate}%`, 'shield-checkmark', '#8b5cf6')}
        {renderStatCard('GPS Points', stats.gpsPointsCollected, 'location', '#f59e0b')}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {renderQuickAction('GPS Mapping', 'map', () => {}, '#16a34a')}
          {renderQuickAction('Scan QR Code', 'qr-code', () => {}, '#3b82f6')}
          {renderQuickAction('View Commodities', 'cube', () => {}, '#8b5cf6')}
          {renderQuickAction('Sync Data', 'sync', () => {}, '#f59e0b')}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Ionicons name="location" size={16} color="#16a34a" />
            <Text style={styles.activityText}>GPS boundary recorded - Farm #45</Text>
            <Text style={styles.activityTime}>2 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="qr-code" size={16} color="#3b82f6" />
            <Text style={styles.activityText}>QR code scanned - Cocoa batch</Text>
            <Text style={styles.activityTime}>4 hours ago</Text>
          </View>
          <View style={styles.activityItem}>
            <Ionicons name="sync" size={16} color="#8b5cf6" />
            <Text style={styles.activityText}>Data synchronized</Text>
            <Text style={styles.activityTime}>6 hours ago</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userRole: {
    fontSize: 14,
    color: '#16a34a',
  },
  logoutButton: {
    padding: 8,
  },
  syncStatusCard: {
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  syncStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncStatusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  pendingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    margin: 5,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  recentActivityContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default DashboardScreen;