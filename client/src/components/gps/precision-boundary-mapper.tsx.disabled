import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Target, 
  CornerDownRight, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Plus,
  Trash2,
  Calculator,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

interface BoundaryPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  order: number;
  locked: boolean;
}

interface BoundaryMapping {
  id: string;
  name: string;
  points: BoundaryPoint[];
  area: number;
  perimeter: number;
  status: 'draft' | 'recording' | 'completed' | 'verified';
  accuracyLevel: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: Date;
  completedAt?: Date;
}

interface PrecisionBoundaryMapperProps {
  onBoundaryComplete?: (boundary: BoundaryMapping) => void;
  onBoundaryUpdate?: (boundary: BoundaryMapping) => void;
  existingBoundary?: BoundaryMapping;
  requiredAccuracy?: number;
  minPoints?: number;
}

export default function PrecisionBoundaryMapper({
  onBoundaryComplete,
  onBoundaryUpdate,
  existingBoundary,
  requiredAccuracy = 5.0,
  minPoints = 4
}: PrecisionBoundaryMapperProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentBoundary, setCurrentBoundary] = useState<BoundaryMapping | null>(
    existingBoundary || null
  );
  const [gpsStatus, setGpsStatus] = useState<'ready' | 'recording' | 'paused' | 'error'>('ready');
  const [autoRecord, setAutoRecord] = useState(false);
  const [recordingInterval, setRecordingInterval] = useState(5); // seconds
  const [boundaryName, setBoundaryName] = useState('');
  
  const watchIdRef = React.useRef<number | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Create new boundary
  const createNewBoundary = () => {
    const newBoundary: BoundaryMapping = {
      id: `boundary-${Date.now()}`,
      name: boundaryName || `Boundary ${new Date().toLocaleDateString()}`,
      points: [],
      area: 0,
      perimeter: 0,
      status: 'draft',
      accuracyLevel: 'good',
      createdAt: new Date()
    };
    setCurrentBoundary(newBoundary);
    return newBoundary;
  };

  // Add GPS point to boundary
  const addBoundaryPoint = (position: GeolocationPosition) => {
    if (!currentBoundary) return;

    const newPoint: BoundaryPoint = {
      id: `point-${Date.now()}`,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: new Date(position.timestamp),
      order: currentBoundary.points.length + 1,
      locked: false
    };

    const updatedBoundary = {
      ...currentBoundary,
      points: [...currentBoundary.points, newPoint],
      status: 'recording' as const
    };

    // Recalculate area and perimeter
    const { area, perimeter, accuracyLevel } = calculateBoundaryMetrics(updatedBoundary.points);
    updatedBoundary.area = area;
    updatedBoundary.perimeter = perimeter;
    updatedBoundary.accuracyLevel = accuracyLevel;

    setCurrentBoundary(updatedBoundary);
    onBoundaryUpdate?.(updatedBoundary);
  };

  // Start GPS recording
  const startRecording = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    if (!currentBoundary) {
      createNewBoundary();
    }

    setIsRecording(true);
    setGpsStatus('recording');

    const gpsOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    if (autoRecord) {
      // Auto-record points at interval
      intervalRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          addBoundaryPoint,
          (error) => {
            setGpsStatus('error');
          },
          gpsOptions
        );
      }, recordingInterval * 1000);
    } else {
      // Manual recording mode - watch position but don't auto-add
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          // Position available for manual capture
        },
        (error) => {
          setGpsStatus('error');
        },
        gpsOptions
      );
    }
  };

  // Stop GPS recording
  const stopRecording = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRecording(false);
    setGpsStatus('ready');
  };

  // Manually capture current GPS position
  const captureCurrentPosition = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      addBoundaryPoint,
      (error) => {
        setGpsStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // Remove boundary point
  const removePoint = (pointId: string) => {
    if (!currentBoundary) return;

    const updatedPoints = currentBoundary.points
      .filter(point => point.id !== pointId)
      .map((point, index) => ({ ...point, order: index + 1 }));

    const { area, perimeter, accuracyLevel } = calculateBoundaryMetrics(updatedPoints);

    const updatedBoundary = {
      ...currentBoundary,
      points: updatedPoints,
      area,
      perimeter,
      accuracyLevel
    };

    setCurrentBoundary(updatedBoundary);
    onBoundaryUpdate?.(updatedBoundary);
  };

  // Complete boundary mapping
  const completeBoundary = () => {
    if (!currentBoundary || currentBoundary.points.length < minPoints) return;

    const completedBoundary = {
      ...currentBoundary,
      status: 'completed' as const,
      completedAt: new Date()
    };

    setCurrentBoundary(completedBoundary);
    onBoundaryComplete?.(completedBoundary);
    stopRecording();
  };

  // Reset boundary
  const resetBoundary = () => {
    stopRecording();
    setCurrentBoundary(null);
    setBoundaryName('');
  };

  // Calculate boundary metrics
  const calculateBoundaryMetrics = (points: BoundaryPoint[]) => {
    if (points.length < 3) {
      return { area: 0, perimeter: 0, accuracyLevel: 'poor' as const };
    }

    // Calculate area using shoelace formula
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].longitude * points[j].latitude;
      area -= points[j].longitude * points[i].latitude;
    }
    area = Math.abs(area) / 2;
    
    // Convert to hectares (approximate)
    area = area * 111319.9 * 111319.9 / 10000;

    // Calculate perimeter
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      perimeter += calculateDistance(points[i], points[j]);
    }

    // Determine accuracy level
    const avgAccuracy = points.reduce((sum, point) => sum + point.accuracy, 0) / points.length;
    let accuracyLevel: 'excellent' | 'good' | 'fair' | 'poor';
    
    if (avgAccuracy <= 2) accuracyLevel = 'excellent';
    else if (avgAccuracy <= 5) accuracyLevel = 'good';
    else if (avgAccuracy <= 10) accuracyLevel = 'fair';
    else accuracyLevel = 'poor';

    return { area, perimeter, accuracyLevel };
  };

  // Calculate distance between two points
  const calculateDistance = (point1: BoundaryPoint, point2: BoundaryPoint): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Export boundary data
  const exportBoundary = () => {
    if (!currentBoundary) return;

    const exportData = {
      ...currentBoundary,
      exportDate: new Date().toISOString(),
      coordinates: currentBoundary.points.map(point => ({
        lat: point.latitude,
        lng: point.longitude,
        accuracy: point.accuracy,
        order: point.order
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boundary-${currentBoundary.name.replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get accuracy level color
  const getAccuracyColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Progress calculation
  const getProgress = () => {
    if (!currentBoundary) return 0;
    const pointsProgress = Math.min(100, (currentBoundary.points.length / minPoints) * 60);
    const accuracyProgress = currentBoundary.accuracyLevel === 'excellent' ? 40 : 
                           currentBoundary.accuracyLevel === 'good' ? 30 : 
                           currentBoundary.accuracyLevel === 'fair' ? 20 : 10;
    return pointsProgress + accuracyProgress;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Boundary Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Precision Boundary Mapper
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="boundary-name">Boundary Name</Label>
            <Input
              id="boundary-name"
              value={boundaryName}
              onChange={(e) => setBoundaryName(e.target.value)}
              placeholder="Enter boundary name..."
              disabled={isRecording}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Recording Mode</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="radio"
                  id="manual"
                  name="recording-mode"
                  checked={!autoRecord}
                  onChange={() => setAutoRecord(false)}
                  disabled={isRecording}
                />
                <label htmlFor="manual" className="text-sm">Manual</label>
                
                <input
                  type="radio"
                  id="auto"
                  name="recording-mode"
                  checked={autoRecord}
                  onChange={() => setAutoRecord(true)}
                  disabled={isRecording}
                  className="ml-4"
                />
                <label htmlFor="auto" className="text-sm">Auto ({recordingInterval}s)</label>
              </div>
            </div>

            {autoRecord && (
              <div>
                <Label htmlFor="interval">Auto Interval (seconds)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="1"
                  max="60"
                  value={recordingInterval}
                  onChange={(e) => setRecordingInterval(parseInt(e.target.value) || 5)}
                  disabled={isRecording}
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {!currentBoundary && (
              <Button onClick={createNewBoundary} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Boundary
              </Button>
            )}

            {currentBoundary && !isRecording && (
              <Button onClick={startRecording} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <Button onClick={stopRecording} variant="secondary" className="flex items-center gap-2">
                <Pause className="h-4 w-4" />
                Stop Recording
              </Button>
            )}

            {!autoRecord && isRecording && (
              <Button onClick={captureCurrentPosition} variant="outline" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Capture Point
              </Button>
            )}

            {currentBoundary && (
              <>
                <Button onClick={resetBoundary} variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                
                {currentBoundary.points.length > 0 && (
                  <Button onClick={exportBoundary} variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Boundary Progress */}
      {currentBoundary && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>{currentBoundary.name}</CardTitle>
              <Badge className={getAccuracyColor(currentBoundary.accuracyLevel)}>
                {currentBoundary.accuracyLevel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Mapping Progress</span>
                <span>{getProgress().toFixed(0)}%</span>
              </div>
              <Progress value={getProgress()} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Points Collected</p>
                <p className="text-xl font-bold">{currentBoundary.points.length}</p>
                <p className="text-xs text-gray-500">Min: {minPoints}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="text-xl font-bold">{currentBoundary.area.toFixed(2)} ha</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Perimeter</p>
                <p className="text-xl font-bold">{currentBoundary.perimeter.toFixed(0)} m</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Avg. Accuracy</p>
                <p className="text-xl font-bold">
                  ±{currentBoundary.points.length > 0 ? 
                    (currentBoundary.points.reduce((sum, point) => sum + point.accuracy, 0) / currentBoundary.points.length).toFixed(1) : 
                    0}m
                </p>
              </div>
            </div>

            {currentBoundary.points.length >= minPoints && (
              <div className="flex gap-2">
                <Button onClick={completeBoundary} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Complete Boundary
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* GPS Points List */}
      {currentBoundary && currentBoundary.points.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CornerDownRight className="h-5 w-5" />
              Boundary Points ({currentBoundary.points.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentBoundary.points.map((point, index) => (
                <div key={point.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{point.order}</Badge>
                      <span className="font-mono text-sm">
                        {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Accuracy: ±{point.accuracy.toFixed(1)}m | {point.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePoint(point.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accuracy Alerts */}
      {currentBoundary && currentBoundary.points.length > 0 && (
        <>
          {currentBoundary.accuracyLevel === 'poor' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                GPS accuracy is poor. Consider waiting for better signal quality or moving to an open area.
              </AlertDescription>
            </Alert>
          )}

          {currentBoundary.points.length < minPoints && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Collect at least {minPoints} GPS points to complete the boundary mapping.
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}