import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polygon } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { gpsDB, gpsPointsDB } from '../services/database';
import { queueOfflineAction } from '../services/sync';

const { width, height } = Dimensions.get('window');

interface GPSPoint {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

const GPSMappingScreen: React.FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<GPSPoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [savedBoundaries, setSavedBoundaries] = useState<any[]>([]);

  useEffect(() => {
    requestLocationPermission();
    loadSavedBoundaries();
  }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    if (isRecording) {
      startLocationTracking();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isRecording]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is required for GPS mapping');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation(currentLocation);
      setAccuracy(currentLocation.coords.accuracy || 0);
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'Failed to get location permission');
    }
  };

  const startLocationTracking = async () => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          setAccuracy(newLocation.coords.accuracy || 0);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  };

  const loadSavedBoundaries = async () => {
    try {
      const boundaries = await gpsDB.getBoundaries();
      setSavedBoundaries(boundaries);
    } catch (error) {
      console.error('Error loading saved boundaries:', error);
    }
  };

  const addBoundaryPoint = async () => {
    if (!location) {
      Alert.alert('Error', 'No GPS location available');
      return;
    }

    const newPoint: GPSPoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy || 0,
      timestamp: new Date().toISOString(),
    };

    setBoundaryPoints(prev => [...prev, newPoint]);

    // Save GPS point to local database
    try {
      await gpsPointsDB.savePoint(
        newPoint.latitude,
        newPoint.longitude,
        newPoint.accuracy || 0,
        { type: 'boundary_point' }
      );

      // Queue for sync
      await queueOfflineAction('gps_point_created', newPoint);
    } catch (error) {
      console.error('Error saving GPS point:', error);
    }

    Alert.alert('Point Added', `Boundary point ${boundaryPoints.length + 1} recorded`);
  };

  const startRecording = () => {
    setBoundaryPoints([]);
    setIsRecording(true);
    Alert.alert('Recording Started', 'Walk around the farm boundary and tap "Add Point" at each corner');
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (boundaryPoints.length < 3) {
      Alert.alert('Error', 'At least 3 points are required to create a boundary');
      return;
    }
    Alert.alert('Recording Stopped', `${boundaryPoints.length} boundary points recorded`);
  };

  const saveBoundary = async () => {
    if (boundaryPoints.length < 3) {
      Alert.alert('Error', 'At least 3 points are required to save a boundary');
      return;
    }

    setIsLoading(true);
    try {
      // Calculate area (simple polygon area calculation)
      const area = calculatePolygonArea(boundaryPoints);
      const farmId = `farm_${Date.now()}`;

      // Save to local database
      await gpsDB.saveBoundary(farmId, boundaryPoints, area);

      // Queue for sync
      await queueOfflineAction('boundary_created', {
        farmId,
        boundaryPoints,
        area,
        createdAt: new Date().toISOString()
      });

      // Refresh saved boundaries
      await loadSavedBoundaries();

      Alert.alert('Success', `Farm boundary saved!\nArea: ${area.toFixed(2)} hectares`);
      setBoundaryPoints([]);
    } catch (error) {
      console.error('Error saving boundary:', error);
      Alert.alert('Error', 'Failed to save boundary');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePolygonArea = (points: GPSPoint[]): number => {
    if (points.length < 3) return 0;

    let area = 0;
    const earthRadius = 6371000; // meters

    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const lat1 = points[i].latitude * Math.PI / 180;
      const lat2 = points[j].latitude * Math.PI / 180;
      const lng1 = points[i].longitude * Math.PI / 180;
      const lng2 = points[j].longitude * Math.PI / 180;

      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = Math.abs(area) * earthRadius * earthRadius / 2;
    return area / 10000; // Convert to hectares
  };

  const clearBoundary = () => {
    Alert.alert(
      'Clear Boundary',
      'Are you sure you want to clear all points?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setBoundaryPoints([]) }
      ]
    );
  };

  const renderStatCard = (title: string, value: string, icon: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon as any} size={20} color={color} />
        <View style={styles.statText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* GPS Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusHeader}>
          <Text style={styles.statusTitle}>GPS Status</Text>
          <View style={[
            styles.statusIndicator, 
            { backgroundColor: location ? '#16a34a' : '#ef4444' }
          ]}>
            <Text style={styles.statusText}>
              {location ? 'Connected' : 'No Signal'}
            </Text>
          </View>
        </View>

        {location && (
          <View style={styles.statsGrid}>
            {renderStatCard('Latitude', location.coords.latitude.toFixed(6), 'location', '#16a34a')}
            {renderStatCard('Longitude', location.coords.longitude.toFixed(6), 'location', '#3b82f6')}
            {renderStatCard('Accuracy', `${accuracy.toFixed(1)}m`, 'radio', '#8b5cf6')}
            {renderStatCard('Points', boundaryPoints.length.toString(), 'pin', '#f59e0b')}
          </View>
        )}
      </View>

      {/* Map View */}
      {location && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Current boundary points */}
            {boundaryPoints.map((point, index) => (
              <Marker
                key={index}
                coordinate={point}
                title={`Point ${index + 1}`}
                description={`Accuracy: ${point.accuracy?.toFixed(1)}m`}
                pinColor="#16a34a"
              />
            ))}

            {/* Current boundary polygon */}
            {boundaryPoints.length > 2 && (
              <Polygon
                coordinates={boundaryPoints}
                strokeColor="#16a34a"
                fillColor="rgba(22, 163, 74, 0.2)"
                strokeWidth={2}
              />
            )}

            {/* Saved boundaries */}
            {savedBoundaries.map((boundary, index) => (
              <Polygon
                key={index}
                coordinates={boundary.boundary_points}
                strokeColor="#3b82f6"
                fillColor="rgba(59, 130, 246, 0.1)"
                strokeWidth={1}
              />
            ))}
          </MapView>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsGrid}>
          {!isRecording ? (
            <TouchableOpacity style={styles.startButton} onPress={startRecording}>
              <Ionicons name="play" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
              <Ionicons name="stop" size={20} color="#ffffff" />
              <Text style={styles.buttonText}>Stop Recording</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.addButton, !isRecording && styles.disabledButton]} 
            onPress={addBoundaryPoint}
            disabled={!isRecording}
          >
            <Ionicons name="add-circle" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Add Point</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.saveButton, boundaryPoints.length < 3 && styles.disabledButton]} 
            onPress={saveBoundary}
            disabled={boundaryPoints.length < 3 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Ionicons name="save" size={20} color="#ffffff" />
            )}
            <Text style={styles.buttonText}>Save Boundary</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.clearButton, boundaryPoints.length === 0 && styles.disabledButton]} 
            onPress={clearBoundary}
            disabled={boundaryPoints.length === 0}
          >
            <Ionicons name="trash" size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Saved Boundaries */}
      {savedBoundaries.length > 0 && (
        <View style={styles.savedContainer}>
          <Text style={styles.savedTitle}>Saved Boundaries ({savedBoundaries.length})</Text>
          {savedBoundaries.slice(0, 3).map((boundary, index) => (
            <View key={index} style={styles.savedItem}>
              <View style={styles.savedInfo}>
                <Text style={styles.savedFarmId}>{boundary.farm_id}</Text>
                <Text style={styles.savedDetails}>
                  Area: {boundary.area_hectares.toFixed(2)} ha | 
                  Points: {boundary.boundary_points.length}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  statusContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  statCard: {
    width: (width - 80) / 2,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: 12,
    margin: 4,
    borderLeftWidth: 3,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statTitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  mapContainer: {
    height: 300,
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  controlsContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  controlsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  startButton: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: (width - 80) / 2,
    marginBottom: 8,
  },
  stopButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: (width - 80) / 2,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: (width - 80) / 2,
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: (width - 80) / 2,
  },
  clearButton: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    width: (width - 80) / 2,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  savedContainer: {
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  savedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  savedInfo: {
    flex: 1,
  },
  savedFarmId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  savedDetails: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});

export default GPSMappingScreen;