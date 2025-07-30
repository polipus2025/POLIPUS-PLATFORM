import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [farmStats, setFarmStats] = useState({
    farmsRegistered: 127,
    complianceRate: 94,
    qrScansToday: 23
  });

  const handleGPSUpdate = () => {
    const lat = (6.4281 + Math.random() * 0.01).toFixed(4);
    const lon = (9.4295 + Math.random() * 0.01).toFixed(4);
    Alert.alert('GPS Updated', `Location: ${lat}°N, ${lon}°W`);
  };

  const handleQRScan = () => {
    const codes = ['COC-LOF-2025-001', 'RIC-MON-2025-045', 'COF-NIM-2025-123'];
    const code = codes[Math.floor(Math.random() * codes.length)];
    setFarmStats(prev => ({ ...prev, qrScansToday: prev.qrScansToday + 1 }));
    Alert.alert('QR Scanned', `Code: ${code}\nStatus: Verified ✓`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>AgriTrace360 LACRA</Text>
        <Text style={styles.subtitle}>Agricultural Compliance Platform</Text>
      </View>

      <View style={styles.tabBar}>
        {['Dashboard', 'GPS', 'Scanner', 'Profile'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab.toLowerCase() && styles.activeTab]}
            onPress={() => setActiveTab(tab.toLowerCase())}
          >
            <Text style={[styles.tabText, activeTab === tab.toLowerCase() && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'dashboard' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farm Dashboard</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{farmStats.farmsRegistered}</Text>
                <Text style={styles.statLabel}>Farms</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{farmStats.complianceRate}%</Text>
                <Text style={styles.statLabel}>Compliance</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{farmStats.qrScansToday}</Text>
                <Text style={styles.statLabel}>QR Scans</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.actionBtn} onPress={handleGPSUpdate}>
              <Text style={styles.actionBtnText}>📍 Update GPS Location</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionBtn} onPress={handleQRScan}>
              <Text style={styles.actionBtnText}>📱 Scan QR Code</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'gps' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>GPS Mapping</Text>
            <View style={styles.gpsBox}>
              <Text style={styles.gpsLabel}>Current Location:</Text>
              <Text style={styles.gpsCoords}>6.4281°N, 9.4295°W</Text>
              <Text style={styles.gpsAccuracy}>Accuracy: ±3.2m</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={handleGPSUpdate}>
              <Text style={styles.actionBtnText}>🔄 Refresh Location</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'scanner' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QR Scanner</Text>
            <View style={styles.scannerBox}>
              <Text style={styles.scannerText}>📷</Text>
              <Text style={styles.scannerLabel}>Point camera at QR code</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn} onPress={handleQRScan}>
              <Text style={styles.actionBtnText}>📷 Start Scanning</Text>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'profile' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>User Profile</Text>
            <View style={styles.profileBox}>
              <Text style={styles.profileText}>Name: Moses Tuah</Text>
              <Text style={styles.profileText}>Role: Farmer</Text>
              <Text style={styles.profileText}>County: Lofa</Text>
              <Text style={styles.profileText}>ID: FRM-2024-001</Text>
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
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  tabBar: {
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
  statsRow: {
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
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 5,
  },
  actionBtn: {
    backgroundColor: '#16a34a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gpsBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  gpsLabel: {
    color: '#94a3b8',
    fontSize: 16,
  },
  gpsCoords: {
    color: '#16a34a',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  gpsAccuracy: {
    color: '#94a3b8',
    fontSize: 14,
  },
  scannerBox: {
    backgroundColor: '#1e293b',
    padding: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  scannerText: {
    fontSize: 48,
    marginBottom: 10,
  },
  scannerLabel: {
    color: '#94a3b8',
    fontSize: 16,
  },
  profileBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 10,
  },
  profileText: {
    color: '#94a3b8',
    fontSize: 16,
    marginBottom: 10,
  },
});