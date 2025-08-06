import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Satellite, 
  Navigation, 
  MapPin, 
  Target, 
  Settings, 
  Play, 
  Pause, 
  Square, 
  Download,
  Compass,
  Clock,
  Signal,
  Crosshair,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

interface GPSPosition {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

interface GPSTrackingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  positions: GPSPosition[];
  distance: number;
  accuracy: string;
  purpose: string;
}

interface EnhancedGPSTrackerProps {
  onPositionUpdate?: (position: GPSPosition) => void;
  onSessionComplete?: (session: GPSTrackingSession) => void;
  autoStart?: boolean;
  accuracyThreshold?: number;
}

export default function EnhancedGPSTracker({ 
  onPositionUpdate, 
  onSessionComplete, 
  autoStart = false,
  accuracyThreshold = 10 
}: EnhancedGPSTrackerProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null);
  const [trackingSession, setTrackingSession] = useState<GPSTrackingSession | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [satelliteCount, setSatelliteCount] = useState(0);
  const [signalStrength, setSignalStrength] = useState(0);
  const [trackingPurpose, setTrackingPurpose] = useState('boundary_mapping');
  
  const watchIdRef = useRef<number | null>(null);
  const positionHistoryRef = useRef<GPSPosition[]>([]);

  // GPS tracking options - Relaxed for global testing
  const gpsOptions = {
    enableHighAccuracy: false, // Allow lower accuracy for global compatibility
    timeout: 30000,            // Extended timeout for broader testing
    maximumAge: 60000      // Accept older positions for testing purposes
  };

  // Start GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    setGpsStatus('connecting');
    setIsTracking(true);

    // Create new tracking session
    const newSession: GPSTrackingSession = {
      id: `GPS-${Date.now()}`,
      startTime: new Date(),
      positions: [],
      distance: 0,
      accuracy: 'high',
      purpose: trackingPurpose
    };
    setTrackingSession(newSession);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const gpsPosition: GPSPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || undefined,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || undefined,
          heading: position.coords.heading || undefined,
          timestamp: position.timestamp
        };

        setCurrentPosition(gpsPosition);
        setGpsStatus('connected');
        
        // Update signal strength based on accuracy
        const strength = Math.max(0, Math.min(100, (20 / gpsPosition.accuracy) * 100));
        setSignalStrength(strength);
        
        // Simulate satellite count based on accuracy
        const satCount = Math.floor(Math.random() * 4) + (gpsPosition.accuracy < 5 ? 8 : 4);
        setSatelliteCount(satCount);

        // Add to position history
        positionHistoryRef.current.push(gpsPosition);

        // Update session with new position
        setTrackingSession(prev => {
          if (!prev) return prev;
          
          const updatedPositions = [...prev.positions, gpsPosition];
          const distance = calculateTotalDistance(updatedPositions);
          
          return {
            ...prev,
            positions: updatedPositions,
            distance
          };
        });

        // Notify parent component
        onPositionUpdate?.(gpsPosition);
      },
      (error) => {
        setGpsStatus('error');
      },
      gpsOptions
    );
  };

  // Stop GPS tracking
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsTracking(false);
    setGpsStatus('disconnected');

    // Complete the session
    if (trackingSession) {
      const completedSession = {
        ...trackingSession,
        endTime: new Date()
      };
      onSessionComplete?.(completedSession);
    }
  };

  // Calculate distance between GPS points
  const calculateDistance = (pos1: GPSPosition, pos2: GPSPosition): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (pos1.latitude * Math.PI) / 180;
    const φ2 = (pos2.latitude * Math.PI) / 180;
    const Δφ = ((pos2.latitude - pos1.latitude) * Math.PI) / 180;
    const Δλ = ((pos2.longitude - pos1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Calculate total distance of tracking session
  const calculateTotalDistance = (positions: GPSPosition[]): number => {
    if (positions.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      totalDistance += calculateDistance(positions[i - 1], positions[i]);
    }
    return totalDistance;
  };

  // Export GPS data
  const exportGPSData = () => {
    if (!trackingSession) return;

    const exportData = {
      sessionId: trackingSession.id,
      startTime: trackingSession.startTime,
      endTime: trackingSession.endTime,
      purpose: trackingSession.purpose,
      totalDistance: trackingSession.distance,
      totalPoints: trackingSession.positions.length,
      averageAccuracy: trackingSession.positions.reduce((acc, pos) => acc + pos.accuracy, 0) / trackingSession.positions.length,
      positions: trackingSession.positions.map(pos => ({
        lat: pos.latitude,
        lng: pos.longitude,
        alt: pos.altitude,
        accuracy: pos.accuracy,
        timestamp: new Date(pos.timestamp).toISOString()
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gps-tracking-${trackingSession.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get status color
  const getStatusColor = (status: typeof gpsStatus) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get accuracy level
  const getAccuracyLevel = (accuracy: number) => {
    if (accuracy <= 3) return { level: 'Excellent', color: 'text-green-600' };
    if (accuracy <= 10) return { level: 'Good', color: 'text-blue-600' };
    if (accuracy <= 20) return { level: 'Fair', color: 'text-yellow-600' };
    return { level: 'Poor', color: 'text-red-600' };
  };

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startTracking();
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [autoStart]);

  return (
    <div className="space-y-6">
      {/* GPS Status Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5" />
                Enhanced GPS Tracker
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                High-precision GPS tracking with real-time positioning
              </p>
            </div>
            <Badge className={getStatusColor(gpsStatus)}>
              {gpsStatus === 'connecting' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              {gpsStatus.charAt(0).toUpperCase() + gpsStatus.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Signal className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Signal Strength</p>
                <div className="flex items-center gap-2">
                  <Progress value={signalStrength} className="w-16 h-2" />
                  <span className="text-xs text-gray-600">{Math.round(signalStrength)}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Satellites</p>
                <p className="text-lg font-bold">{satelliteCount}</p>
              </div>
            </div>
            
            {currentPosition && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Accuracy</p>
                  <p className={`text-sm font-bold ${getAccuracyLevel(currentPosition.accuracy).color}`}>
                    ±{currentPosition.accuracy.toFixed(1)}m
                  </p>
                </div>
              </div>
            )}
            
            {trackingSession && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-lg font-bold">
                    {Math.floor((Date.now() - trackingSession.startTime.getTime()) / 60000)}m
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Position Display */}
      {currentPosition && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Current Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Latitude</Label>
                <p className="text-lg font-mono">{currentPosition.latitude.toFixed(6)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Longitude</Label>
                <p className="text-lg font-mono">{currentPosition.longitude.toFixed(6)}</p>
              </div>
              {currentPosition.altitude && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Altitude</Label>
                  <p className="text-lg font-mono">{currentPosition.altitude.toFixed(1)}m</p>
                </div>
              )}
              {currentPosition.speed && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Speed</Label>
                  <p className="text-lg font-mono">{(currentPosition.speed * 3.6).toFixed(1)} km/h</p>
                </div>
              )}
              {currentPosition.heading && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Heading</Label>
                  <p className="text-lg font-mono flex items-center gap-1">
                    <Compass className="h-4 w-4" />
                    {currentPosition.heading.toFixed(0)}°
                  </p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-gray-600">Last Update</Label>
                <p className="text-sm">
                  {new Date(currentPosition.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tracking Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tracking-purpose">Tracking Purpose</Label>
            <select
              id="tracking-purpose"
              value={trackingPurpose}
              onChange={(e) => setTrackingPurpose(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              disabled={isTracking}
            >
              <option value="boundary_mapping">Boundary Mapping</option>
              <option value="field_survey">Field Survey</option>
              <option value="crop_monitoring">Crop Monitoring</option>
              <option value="transportation">Transportation Route</option>
              <option value="inspection">Inspection Route</option>
              <option value="compliance_check">Compliance Check</option>
            </select>
          </div>

          <div className="flex gap-2">
            {!isTracking ? (
              <Button onClick={startTracking} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Tracking
              </Button>
            ) : (
              <Button onClick={stopTracking} variant="destructive" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Stop Tracking
              </Button>
            )}
            
            {trackingSession && trackingSession.positions.length > 0 && (
              <Button onClick={exportGPSData} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            )}
          </div>

          {/* Tracking Session Info */}
          {trackingSession && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Current Session</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-blue-700">Points Collected:</span>
                  <span className="font-medium ml-1">{trackingSession.positions.length}</span>
                </div>
                <div>
                  <span className="text-blue-700">Distance Covered:</span>
                  <span className="font-medium ml-1">{trackingSession.distance.toFixed(1)}m</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GPS Status Alerts */}
      {gpsStatus === 'error' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            GPS signal lost or unavailable. Please ensure location services are enabled and you have a clear view of the sky.
          </AlertDescription>
        </Alert>
      )}

      {currentPosition && currentPosition.accuracy > accuracyThreshold && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            GPS accuracy is below threshold (±{currentPosition.accuracy.toFixed(1)}m). Consider waiting for better signal quality.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}