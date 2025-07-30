import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface User {
  id: string;
  name: string;
  role: 'farmer' | 'agent' | 'regulatory' | 'exporter';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gpsCoords, setGpsCoords] = useState('6.4281°N, 9.4295°W');
  const [lastQRScan, setLastQRScan] = useState('');
  const [syncStatus, setSyncStatus] = useState('synced');

  const users = [
    { id: 'farmer', name: 'Moses Tuah', role: 'farmer' as const },
    { id: 'agent', name: 'Sarah Konneh', role: 'agent' as const },
    { id: 'regulatory', name: 'LACRA Admin', role: 'regulatory' as const },
    { id: 'exporter', name: 'Marcus Bawah', role: 'exporter' as const }
  ];

  const roleColors = {
    farmer: '#16a34a',
    agent: '#2563eb', 
    regulatory: '#7c3aed',
    exporter: '#ea580c'
  };

  const simulateGPS = () => {
    const lat = (6.4281 + Math.random() * 0.01).toFixed(4);
    const lon = (9.4295 + Math.random() * 0.01).toFixed(4);
    setGpsCoords(`${lat}°N, ${lon}°W`);
    Alert.alert('GPS Updated', `New location: ${lat}°N, ${lon}°W`);
  };

  const simulateQRScan = () => {
    const codes = ['COC-LOF-2025-001', 'RIC-MON-2025-045', 'COF-NIM-2025-123'];
    const code = codes[Math.floor(Math.random() * codes.length)];
    setLastQRScan(code);
    Alert.alert('QR Code Scanned', `Commodity: ${code}\nStatus: Verified ✓`);
  };

  const syncData = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      Alert.alert('Sync Complete', 'All data synchronized with LACRA servers');
    }, 2000);
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.title}>AgriTrace360 LACRA</Text>
          <Text style={styles.subtitle}>Agricultural Compliance Platform</Text>
        </View>
        
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Select Your Role:</Text>
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={[styles.userButton, { backgroundColor: roleColors[user.role] }]}
              onPress={() => setCurrentUser(user)}
            >
              <Text style={styles.userButtonText}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: roleColors[currentUser.role] }]}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>AgriTrace360</Text>
          <Text style={styles.subtitle}>{currentUser.name} - {currentUser.role.toUpperCase()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => setCurrentUser(null)}
        >
          <Text style={styles.logoutText}>Switch User</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['dashboard', 'gps', 'scan', 'sync'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        
        {activeTab === 'dashboard' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dashboard</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>127</Text>
                <Text style={styles.statLabel}>Farms Mapped</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>89%</Text>
                <Text style={styles.statLabel}>Compliance Rate</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Activity</Text>
              <Text style={styles.cardText}>• Farm boundary updated</Text>
              <Text style={styles.cardText}>• QR code scanned: {lastQRScan || 'None'}</Text>
              <Text style={styles.cardText}>• GPS location: {gpsCoords}</Text>
              <Text style={styles.cardText}>• Sync status: {syncStatus}</Text>
            </View>
          </View>
        )}

        {activeTab === 'gps' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GPS Farm Mapping</Text>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Current Location</Text>
              <Text style={styles.locationText}>{gpsCoords}</Text>
              <Text style={styles.cardText}>Liberia, West Africa</Text>
              <Text style={styles.cardText}>Accuracy: 3.2 meters</Text>
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={simulateGPS}>
              <Text style={styles.buttonText}>Update GPS Location</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Farm Boundary Points</Text>
              <Text style={styles.cardText}>Point 1: 6.4281°N, 9.4295°W</Text>
              <Text style={styles.cardText}>Point 2: 6.4285°N, 9.4298°W</Text>
              <Text style={styles.cardText}>Point 3: 6.4289°N, 9.4301°W</Text>
              <Text style={styles.cardText}>Point 4: 6.4287°N, 9.4293°W</Text>
              <Text style={styles.areaText}>Farm Area: 2.4 hectares</Text>
            </View>
          </View>
        )}

        {activeTab === 'scan' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QR Code Scanner</Text>
            
            <View style={styles.scanArea}>
              <Text style={styles.scanText}>Position QR code in frame</Text>
              <View style={styles.scanFrame} />
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={simulateQRScan}>
              <Text style={styles.buttonText}>Simulate QR Scan</Text>
            </TouchableOpacity>

            {lastQRScan && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Last Scanned</Text>
                <Text style={styles.qrCode}>{lastQRScan}</Text>
                <Text style={styles.cardText}>Premium Cocoa Beans</Text>
                <Text style={styles.verifiedText}>✓ LACRA Verified</Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'sync' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Synchronization</Text>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sync Status</Text>
              <Text style={styles.cardText}>Status: {syncStatus}</Text>
              <Text style={styles.cardText}>Pending uploads: 3 items</Text>
              <Text style={styles.cardText}>Last sync: 2 minutes ago</Text>
              <Text style={styles.cardText}>Storage used: 24.3 MB</Text>
            </View>

            <TouchableOpacity 
              style={[styles.actionButton, syncStatus === 'syncing' && styles.disabledButton]} 
              onPress={syncData}
              disabled={syncStatus === 'syncing'}
            >
              <Text style={styles.buttonText}>
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Now'}
              </Text>
            </TouchableOpacity>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Sync Activity</Text>
              <Text style={styles.cardText}>✓ GPS coordinates uploaded</Text>
              <Text style={styles.cardText}>✓ QR scan data synced</Text>
              <Text style={styles.cardText}>⏳ Form submission pending</Text>
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#16a34a',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#16a34a',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  userButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  userButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userRole: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  cardText: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 4,
  },
  locationText: {
    color: '#16a34a',
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  actionButton: {
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#374151',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  areaText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  scanArea: {
    height: 200,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  scanText: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 16,
  },
  scanFrame: {
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: '#16a34a',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  qrCode: {
    color: '#16a34a',
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  verifiedText: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});