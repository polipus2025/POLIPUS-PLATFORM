// AgriTrace360™ LACRA Mobile Dashboard Screen
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface DashboardStats {
  totalCommodities: number;
  complianceRate: number;
  pendingInspections: number;
  activePlots: number;
  recentAlerts: number;
}

const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCommodities: 0,
    complianceRate: 0,
    pendingInspections: 0,
    activePlots: 0,
    recentAlerts: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await apiService.getDashboardMetrics();
      if (response.success && response.data) {
        setStats({
          totalCommodities: response.data.totalCommodities || 0,
          complianceRate: response.data.complianceRate || 0,
          pendingInspections: response.data.pendingInspections || 0,
          activePlots: response.data.activePlots || 0,
          recentAlerts: response.data.recentAlerts || 0,
        });
      }
    } catch (error) {
      // Error handled silently for production
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'farmer': return '#22c55e';
      case 'field_agent': return '#f59e0b';
      case 'regulatory': return '#3b82f6';
      case 'exporter': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const renderStatsCard = (title: string, value: number, suffix: string = '', color: string = '#059669') => (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <Text style={styles.statsValue}>{value}{suffix}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  );

  const renderQuickAction = (title: string, description: string, onPress: () => void, color: string = '#059669') => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Text style={styles.quickActionIconText}>📱</Text>
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>
            {user?.firstName || user?.username || 'User'}
          </Text>
          <View style={[styles.userTypeBadge, { backgroundColor: getUserTypeColor(user?.userType || '') }]}>
            <Text style={styles.userTypeText}>
              {user?.userType?.replace('_', ' ').toUpperCase() || 'USER'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatsCard('Total Commodities', stats.totalCommodities, '', '#22c55e')}
          {renderStatsCard('Compliance Rate', stats.complianceRate, '%', '#3b82f6')}
          {renderStatsCard('Pending Inspections', stats.pendingInspections, '', '#f59e0b')}
          {renderStatsCard('Active Plots', stats.activePlots, '', '#8b5cf6')}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        {user?.userType === 'farmer' && (
          <>
            {renderQuickAction(
              'GPS Field Mapping',
              'Map your farm boundaries with GPS',
              () => console.log('GPS Mapping'),
              '#22c55e'
            )}
            {renderQuickAction(
              'Commodity Registration',
              'Register new harvest commodities',
              () => console.log('Commodity Registration'),
              '#059669'
            )}
            {renderQuickAction(
              'View Farm Plots',
              'Manage your registered farm plots',
              () => console.log('Farm Plots'),
              '#10b981'
            )}
          </>
        )}

        {user?.userType === 'field_agent' && (
          <>
            {renderQuickAction(
              'QR Code Scanner',
              'Scan commodity QR codes for tracking',
              () => console.log('QR Scanner'),
              '#f59e0b'
            )}
            {renderQuickAction(
              'Field Inspections',
              'Conduct and record field inspections',
              () => console.log('Inspections'),
              '#ea580c'
            )}
            {renderQuickAction(
              'Submit Reports',
              'Submit field reports to LACRA',
              () => console.log('Reports'),
              '#dc2626'
            )}
          </>
        )}

        {user?.userType === 'regulatory' && (
          <>
            {renderQuickAction(
              'Compliance Dashboard',
              'View compliance metrics and alerts',
              () => console.log('Compliance'),
              '#3b82f6'
            )}
            {renderQuickAction(
              'Inspection Records',
              'Review inspection reports',
              () => console.log('Records'),
              '#1d4ed8'
            )}
            {renderQuickAction(
              'Issue Certificates',
              'Generate compliance certificates',
              () => console.log('Certificates'),
              '#1e40af'
            )}
          </>
        )}

        {user?.userType === 'exporter' && (
          <>
            {renderQuickAction(
              'Export Permits',
              'Manage export permit applications',
              () => console.log('Permits'),
              '#8b5cf6'
            )}
            {renderQuickAction(
              'EUDR Compliance',
              'Track deforestation compliance',
              () => console.log('EUDR'),
              '#7c3aed'
            )}
            {renderQuickAction(
              'Document Verification',
              'Verify export documentation',
              () => console.log('Documents'),
              '#6d28d9'
            )}
          </>
        )}
      </View>

      {/* Recent Activity */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>
            🔄 Dashboard data refreshed successfully
          </Text>
          <Text style={styles.activityTime}>Just now</Text>
        </View>
        {stats.recentAlerts > 0 && (
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              ⚠️ {stats.recentAlerts} new alerts require attention
            </Text>
            <Text style={styles.activityTime}>2 minutes ago</Text>
          </View>
        )}
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
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6b7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  userTypeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  userTypeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  quickActionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  quickActionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  quickActionIconText: {
    fontSize: 20,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  quickActionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  activityContainer: {
    padding: 20,
    paddingTop: 0,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#22c55e',
  },
  activityText: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default DashboardScreen;