import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [currentUser, setCurrentUser] = useState('farmer');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [gpsCoords, setGpsCoords] = useState('6.4281°N, 9.4295°W');
  const [lastQRScan, setLastQRScan] = useState('COC-LOF-2025-001');

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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AgriTrace360 LACRA</Text>
        <Text style={styles.subtitle}>Agricultural Compliance Platform</Text>
        <Text style={styles.userInfo}>Logged in as: {currentUser.toUpperCase()}</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {['Dashboard', 'GPS Map', 'QR Scan', 'Profile'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab.toLowerCase().replace(' ', '') && styles.activeTab]}
            onPress={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
          >
            <Text style={[styles.tabText, activeTab === tab.toLowerCase().replace(' ', '') && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        
        {activeTab === 'dashboard' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Dashboard</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>127</Text>
                <Text style={styles.statLabel}>Farms Mapped</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>94%</Text>
                <Text style={styles.statLabel}>Compliance Rate</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>23</Text>
                <Text style={styles.statLabel}>QR Scans Today</Text>
              </View>
            </View>

            <View style={styles.quickActions}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity style={styles.actionButton} onPress={simulateGPS}>
                <Text style={styles.actionButtonText}>📍 Update GPS Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={simulateQRScan}>
                <Text style={styles.actionButtonText}>📱 Scan QR Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'gpsmap' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GPS Mapping</Text>
            <View style={styles.gpsContainer}>
              <Text style={styles.gpsLabel}>Current Location:</Text>
              <Text style={styles.gpsCoords}>{gpsCoords}</Text>
              <TouchableOpacity style={styles.actionButton} onPress={simulateGPS}>
                <Text style={styles.actionButtonText}>🔄 Update Location</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapText}>🗺️ Interactive Map</Text>
              <Text style={styles.mapSubtext}>Liberian Farm Boundaries</Text>
              <Text style={styles.mapSubtext}>GPS Accuracy: ±3.2m</Text>
            </View>
          </View>
        )}

        {activeTab === 'qrscan' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QR Code Scanner</Text>
            <View style={styles.qrContainer}>
              <Text style={styles.qrLabel}>Last Scanned:</Text>
              <Text style={styles.qrCode}>{lastQRScan}</Text>
              <TouchableOpacity style={styles.actionButton} onPress={simulateQRScan}>
                <Text style={styles.actionButtonText}>📷 Scan New QR Code</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.scanResults}>
              <Text style={styles.resultTitle}>Scan Results:</Text>
              <Text style={styles.resultText}>✅ Commodity Verified</Text>
              <Text style={styles.resultText}>✅ LACRA Compliant</Text>
              <Text style={styles.resultText}>✅ Export Ready</Text>
            </View>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Profile</Text>
            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>Name: Moses Tuah</Text>
              <Text style={styles.profileText}>Role: Farmer</Text>
              <Text style={styles.profileText}>County: Lofa</Text>
              <Text style={styles.profileText}>Farm ID: FRM-2024-001</Text>
              <Text style={styles.profileText}>Status: Active</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.switchButton} 
              onPress={() => setCurrentUser(currentUser === 'farmer' ? 'agent' : 'farmer')}
            >
              <Text style={styles.switchButtonText}>Switch to {currentUser === 'farmer' ? 'Field Agent' : 'Farmer'}</Text>
            </TouchableOpacity>
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
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    backgroundColor: '#16a34a',
    borderRadius: 20,
    marginHorizontal: 2,
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
    backgroundColor: '#0f172a',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  quickActions: {
    marginTop: 20,
  },
  actionButton: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gpsContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  gpsLabel: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 10,
  },
  gpsCoords: {
    color: '#16a34a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  mapPlaceholder: {
    backgroundColor: '#1e293b',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
  },
  mapText: {
    color: '#16a34a',
    fontSize: 24,
    marginBottom: 10,
  },
  mapSubtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 5,
  },
  qrContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  qrLabel: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 10,
  },
  qrCode: {
    color: '#16a34a',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  scanResults: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
  },
  resultTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  resultText: {
    color: '#16a34a',
    fontSize: 16,
    marginBottom: 8,
  },
  profileContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  profileText: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 10,
  },
  switchButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  switchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});