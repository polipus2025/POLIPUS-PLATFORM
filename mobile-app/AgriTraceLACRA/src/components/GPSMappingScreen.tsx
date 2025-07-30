// AgriTrace360™ LACRA Mobile GPS Mapping Screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { GPSLocation } from '../types';

const { width } = Dimensions.get('window');

// Mock location service for development
const mockLocationService = {
  requestPermissions: async () => ({ status: 'granted' }),
  getCurrentPosition: async (): Promise<GPSLocation> => ({
    latitude: 6.4281,
    longitude: -9.4295,
    altitude: 45,
    accuracy: 3.2,
    timestamp: Date.now(),
  }),
  watchPosition: (callback: (location: GPSLocation) => void) => {
    const interval = setInterval(() => {
      callback({
        latitude: 6.4281 + (Math.random() - 0.5) * 0.001,
        longitude: -9.4295 + (Math.random() - 0.5) * 0.001,
        altitude: 45 + (Math.random() - 0.5) * 5,
        accuracy: 2.8 + Math.random() * 2,
        timestamp: Date.now(),
      });
    }, 2000);
    return { remove: () => clearInterval(interval) };
  },
};

interface BoundaryPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy: number;
}

const GPSMappingScreen: React.FC = () => {
  const { user } = useAuth();
  const [isMapping, setIsMapping] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<BoundaryPoint[]>([]);
  const [totalArea, setTotalArea] = useState<number>(0);
  const [gpsAccuracy, setGpsAccuracy] = useState<number>(0);
  const [satelliteCount, setSatelliteCount] = useState<number>(12);
  const [plotName, setPlotName] = useState<string>('');

  useEffect(() => {
    initializeGPS();
    return () => {
      // Cleanup location watching
    };
  }, []);

  const initializeGPS = async () => {
    try {
      const permission = await mockLocationService.requestPermissions();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Required', 'GPS permission is required for field mapping');
        return;
      }

      const location = await mockLocationService.getCurrentPosition();
      setCurrentLocation(location);
      setGpsAccuracy(location.accuracy || 0);
    } catch (error) {
      console.error('GPS initialization error:', error);
      Alert.alert('GPS Error', 'Failed to initialize GPS. Please check location services.');
    }
  };

  const startMapping = () => {
    if (!currentLocation) {
      Alert.alert('GPS Not Ready', 'Please wait for GPS to initialize');
      return;
    }

    setIsMapping(true);
    setBoundaryPoints([]);
    setTotalArea(0);
    
    // Start location watching
    const subscription = mockLocationService.watchPosition((location) => {
      setCurrentLocation(location);
      setGpsAccuracy(location.accuracy || 0);
      setSatelliteCount(10 + Math.floor(Math.random() * 8)); // 10-17 satellites
    });

    Alert.alert(
      'GPS Mapping Started',
      'Walk around your field perimeter and tap "Add Point" at each corner.',
      [{ text: 'OK' }]
    );
  };

  const addBoundaryPoint = () => {
    if (!currentLocation || !isMapping) return;

    const newPoint: BoundaryPoint = {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      timestamp: currentLocation.timestamp,
      accuracy: currentLocation.accuracy || 0,
    };

    const updatedPoints = [...boundaryPoints, newPoint];
    setBoundaryPoints(updatedPoints);

    // Calculate approximate area if we have at least 3 points
    if (updatedPoints.length >= 3) {
      const area = calculatePolygonArea(updatedPoints);
      setTotalArea(area);
    }

    Alert.alert(
      'Point Added',
      `Boundary point ${updatedPoints.length} recorded\nAccuracy: ${newPoint.accuracy.toFixed(1)}m`,
      [{ text: 'OK' }]
    );
  };

  const calculatePolygonArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;

    // Simple shoelace formula for polygon area (approximation)
    let area = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }

    area = Math.abs(area) / 2;
    
    // Convert to hectares (very rough approximation)
    // 1 degree ≈ 111km, so 1 degree² ≈ 12321 km² ≈ 1,232,100 hectares
    return area * 1232100;
  };

  const finishMapping = async () => {
    if (boundaryPoints.length < 3) {
      Alert.alert('Insufficient Points', 'Please add at least 3 boundary points');
      return;
    }

    try {
      const plotData = {
        farmerId: user?.farmerId || user?.id,
        plotName: plotName || `Plot ${Date.now()}`,
        cropType: 'Mixed', // Could be selected by user
        area: totalArea,
        unit: 'hectares',
        gpsCoordinates: JSON.stringify(boundaryPoints),
        soilType: 'Lateritic Clay', // Could be detected or selected
        status: 'active',
        boundaryPoints: boundaryPoints,
      };

      const response = await apiService.createFarmPlot(plotData);
      
      if (response.success) {
        Alert.alert(
          'Mapping Complete',
          `Farm plot successfully mapped!\nArea: ${totalArea.toFixed(2)} hectares`,
          [{ text: 'OK', onPress: () => {
            setIsMapping(false);
            setBoundaryPoints([]);
            setTotalArea(0);
          }}]
        );
      } else {
        throw new Error(response.error || 'Failed to save plot data');
      }
    } catch (error) {
      console.error('Error saving plot:', error);
      Alert.alert('Save Error', 'Failed to save plot data. Please try again.');
    }
  };

  const cancelMapping = () => {
    Alert.alert(
      'Cancel Mapping',
      'Are you sure you want to cancel? All recorded points will be lost.',
      [
        { text: 'Continue Mapping', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => {
          setIsMapping(false);
          setBoundaryPoints([]);
          setTotalArea(0);
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>GPS Field Mapping</Text>
        <Text style={styles.subtitle}>
          Map your farm boundaries with precision GPS
        </Text>
      </View>

      {/* GPS Status */}
      <View style={styles.gpsStatus}>
        <View style={styles.statusRow}>
          <View style={[styles.statusIndicator, { backgroundColor: currentLocation ? '#22c55e' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            GPS Status: {currentLocation ? 'Connected' : 'Searching...'}
          </Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Satellites:</Text>
          <Text style={styles.statusValue}>{satelliteCount} connected</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Accuracy:</Text>
          <Text style={styles.statusValue}>{gpsAccuracy.toFixed(1)}m</Text>
        </View>
        {currentLocation && (
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Location:</Text>
            <Text style={styles.statusValue}>
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
          </View>
        )}
      </View>

      {/* Mapping Controls */}
      <View style={styles.controlsContainer}>
        {!isMapping ? (
          <TouchableOpacity
            style={[styles.primaryButton, !currentLocation && styles.buttonDisabled]}
            onPress={startMapping}
            disabled={!currentLocation}
          >
            <Text style={styles.primaryButtonText}>🗺️ Start Field Mapping</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.mappingControls}>
            <TouchableOpacity
              style={styles.addPointButton}
              onPress={addBoundaryPoint}
            >
              <Text style={styles.addPointButtonText}>
                📍 Add Boundary Point ({boundaryPoints.length})
              </Text>
            </TouchableOpacity>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelMapping}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.finishButton, boundaryPoints.length < 3 && styles.buttonDisabled]}
                onPress={finishMapping}
                disabled={boundaryPoints.length < 3}
              >
                <Text style={styles.finishButtonText}>Finish</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Mapping Progress */}
      {isMapping && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Mapping Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{boundaryPoints.length}</Text>
              <Text style={styles.progressStatLabel}>Points</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>{totalArea.toFixed(2)}</Text>
              <Text style={styles.progressStatLabel}>Hectares</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatValue}>
                {boundaryPoints.length > 0 ? 
                  (boundaryPoints.reduce((sum, p) => sum + p.accuracy, 0) / boundaryPoints.length).toFixed(1) 
                  : '0.0'
                }m
              </Text>
              <Text style={styles.progressStatLabel}>Avg Accuracy</Text>
            </View>
          </View>
        </View>
      )}

      {/* Boundary Points List */}
      {boundaryPoints.length > 0 && (
        <View style={styles.pointsList}>
          <Text style={styles.pointsTitle}>Recorded Points</Text>
          {boundaryPoints.map((point, index) => (
            <View key={index} style={styles.pointItem}>
              <Text style={styles.pointNumber}>Point {index + 1}</Text>
              <Text style={styles.pointCoords}>
                {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
              </Text>
              <Text style={styles.pointAccuracy}>±{point.accuracy.toFixed(1)}m</Text>
            </View>
          ))}
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>GPS Mapping Instructions</Text>
        <Text style={styles.instructionText}>
          1. Wait for GPS to connect (green indicator)
        </Text>
        <Text style={styles.instructionText}>
          2. Walk to the first corner of your field
        </Text>
        <Text style={styles.instructionText}>
          3. Tap "Add Boundary Point" at each corner
        </Text>
        <Text style={styles.instructionText}>
          4. Complete the perimeter and tap "Finish"
        </Text>
        <Text style={styles.instructionText}>
          5. Your field will be saved with GPS coordinates
        </Text>
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
    backgroundColor: '#22c55e',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#dcfce7',
    marginTop: 4,
  },
  gpsStatus: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 80,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  controlsContainer: {
    margin: 16,
  },
  primaryButton: {
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  mappingControls: {
    gap: 12,
  },
  addPointButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addPointButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  finishButton: {
    flex: 1,
    backgroundColor: '#059669',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  progressContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  progressStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  pointsList: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pointsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  pointItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  pointNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    width: 60,
  },
  pointCoords: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  pointAccuracy: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '500',
  },
  instructions: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default GPSMappingScreen;