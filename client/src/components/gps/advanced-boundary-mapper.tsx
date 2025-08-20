import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Target, 
  Crosshair, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  Trash2,
  RotateCcw,
  Play,
  Pause,
  Square,
  Navigation2,
  Zap
} from 'lucide-react';

interface BoundaryPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  order: number;
}

interface BoundaryMapping {
  id: string;
  name: string;
  points: BoundaryPoint[];
  isComplete: boolean;
  totalArea: number;
  perimeter: number;
  centerPoint: { lat: number; lng: number };
}

interface AdvancedBoundaryMapperProps {
  onBoundaryComplete?: (boundary: BoundaryMapping) => void;
  onPointAdded?: (point: BoundaryPoint) => void;
  maxPoints?: number;
  minAccuracy?: number;
}

export default function AdvancedBoundaryMapper({
  onBoundaryComplete,
  onPointAdded,
  maxPoints = 50,
  minAccuracy = 10
}: AdvancedBoundaryMapperProps) {
  const [isMapping, setIsMapping] = useState(false);
  const [currentBoundary, setCurrentBoundary] = useState<BoundaryMapping | null>(null);
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [mappingMode, setMappingMode] = useState<'manual' | 'automatic'>('manual');
  const [boundaryName, setBoundaryName] = useState('');
  const [autoInterval, setAutoInterval] = useState(5); // seconds
  const [minDistance, setMinDistance] = useState(5); // meters
  
  const watchIdRef = React.useRef<number | null>(null);
  const autoIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // GPS tracking options - Relaxed for global testing
  const gpsOptions = {
    enableHighAccuracy: false, // Allow lower accuracy for broader compatibility
    timeout: 30000,            // Longer timeout for testing
    maximumAge: 60000          // Accept older positions for demo purposes
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, []);

  const startBoundaryMapping = () => {
    if (!boundaryName.trim()) {
      alert('Please enter a boundary name first');
      return;
    }

    const newBoundary: BoundaryMapping = {
      id: `boundary-${Date.now()}`,
      name: boundaryName,
      points: [],
      isComplete: false,
      totalArea: 0,
      perimeter: 0,
      centerPoint: { lat: 0, lng: 0 }
    };

    setCurrentBoundary(newBoundary);
    setIsMapping(true);

    // Start GPS tracking
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handlePositionError,
        gpsOptions
      );

      // Start automatic point collection if enabled
      if (mappingMode === 'automatic') {
        autoIntervalRef.current = setInterval(addCurrentPoint, autoInterval * 1000);
      }

    } else {
      alert('GPS not supported on this device');
    }
  };

  const stopBoundaryMapping = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current);
      autoIntervalRef.current = null;
    }

    setIsMapping(false);
  };

  const handlePositionUpdate = (position: GeolocationPosition) => {
    const newPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      speed: position.coords.speed,
      heading: position.coords.heading,
      timestamp: position.timestamp
    };

    setCurrentPosition(newPosition);
  };

  const handlePositionError = (error: GeolocationPositionError) => {
    alert(`GPS Error: ${error.message}`);
  };

  const addCurrentPoint = () => {
    if (!currentPosition || !currentBoundary || !isMapping) return;

    // Check accuracy threshold
    if (currentPosition.accuracy > minAccuracy) {
      return;
    }

    // Check minimum distance from last point
    if (currentBoundary.points.length > 0) {
      const lastPoint = currentBoundary.points[currentBoundary.points.length - 1];
      const distance = calculateDistance(
        lastPoint.latitude, lastPoint.longitude,
        currentPosition.latitude, currentPosition.longitude
      );
      
      if (distance < minDistance) {
        return;
      }
    }

    const newPoint: BoundaryPoint = {
      id: `point-${Date.now()}`,
      latitude: currentPosition.latitude,
      longitude: currentPosition.longitude,
      accuracy: currentPosition.accuracy,
      timestamp: new Date(),
      order: currentBoundary.points.length + 1
    };

    const updatedBoundary = {
      ...currentBoundary,
      points: [...currentBoundary.points, newPoint]
    };

    setCurrentBoundary(updatedBoundary);
    onPointAdded?.(newPoint);

  };

  const removeLastPoint = () => {
    if (!currentBoundary || currentBoundary.points.length === 0) return;

    const updatedBoundary = {
      ...currentBoundary,
      points: currentBoundary.points.slice(0, -1)
    };

    setCurrentBoundary(updatedBoundary);
  };

  const completeBoundary = () => {
    if (!currentBoundary || currentBoundary.points.length < 3) {
      alert('Need at least 3 points to complete a boundary');
      return;
    }

    const completedBoundary = {
      ...currentBoundary,
      isComplete: true,
      totalArea: calculatePolygonArea(currentBoundary.points),
      perimeter: calculatePerimeter(currentBoundary.points),
      centerPoint: calculateCenterPoint(currentBoundary.points)
    };

    setCurrentBoundary(completedBoundary);
    stopBoundaryMapping();
    onBoundaryComplete?.(completedBoundary);

      points: completedBoundary.points.length,
      area: `${completedBoundary.totalArea.toFixed(2)} hectares`,
      perimeter: `${completedBoundary.perimeter.toFixed(1)} meters`
    });
  };

  const resetBoundary = () => {
    stopBoundaryMapping();
    setCurrentBoundary(null);
    setBoundaryName('');
  };

  const exportBoundaryData = () => {
    if (!currentBoundary) return;

    const exportData = {
      boundary: currentBoundary,
      exportTime: new Date().toISOString(),
      metadata: {
        totalPoints: currentBoundary.points.length,
        mappingDuration: currentBoundary.points.length > 0 
          ? Date.now() - currentBoundary.points[0].timestamp.getTime()
          : 0,
        averageAccuracy: currentBoundary.points.reduce((sum, p) => sum + p.accuracy, 0) / currentBoundary.points.length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boundary-${currentBoundary.name}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  };

  // Utility functions
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculatePolygonArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    
    area = Math.abs(area) / 2;
    // Convert to hectares (1 degree² ≈ 12,393 km² at equator, adjusted for Liberia's latitude)
    return area * 12393 * 100 * Math.cos(7 * Math.PI / 180); // Liberia is around 7°N
  };

  const calculatePerimeter = (points: BoundaryPoint[]): number => {
    if (points.length < 2) return 0;
    
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      perimeter += calculateDistance(
        points[i].latitude, points[i].longitude,
        points[next].latitude, points[next].longitude
      );
    }
    return perimeter;
  };

  const calculateCenterPoint = (points: BoundaryPoint[]): { lat: number; lng: number } => {
    if (points.length === 0) return { lat: 0, lng: 0 };
    
    const sumLat = points.reduce((sum, p) => sum + p.latitude, 0);
    const sumLng = points.reduce((sum, p) => sum + p.longitude, 0);
    
    return {
      lat: sumLat / points.length,
      lng: sumLng / points.length
    };
  };

  return (
    <div className="space-y-6">
      {/* Boundary Mapping Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Advanced Boundary Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="boundary-name">Boundary Name</Label>
              <Input
                id="boundary-name"
                value={boundaryName}
                onChange={(e) => setBoundaryName(e.target.value)}
                placeholder="e.g., Coffee Plot A"
                disabled={isMapping}
              />
            </div>
            <div>
              <Label htmlFor="mapping-mode">Mapping Mode</Label>
              <select
                id="mapping-mode"
                value={mappingMode}
                onChange={(e) => setMappingMode(e.target.value as 'manual' | 'automatic')}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={isMapping}
              >
                <option value="manual">Manual Point Addition</option>
                <option value="automatic">Automatic Point Collection</option>
              </select>
            </div>
          </div>

          {mappingMode === 'automatic' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="auto-interval">Auto Interval (seconds)</Label>
                <Input
                  id="auto-interval"
                  type="number"
                  value={autoInterval}
                  onChange={(e) => setAutoInterval(Number(e.target.value))}
                  min="1"
                  max="60"
                  disabled={isMapping}
                />
              </div>
              <div>
                <Label htmlFor="min-distance">Min Distance (meters)</Label>
                <Input
                  id="min-distance"
                  type="number"
                  value={minDistance}
                  onChange={(e) => setMinDistance(Number(e.target.value))}
                  min="1"
                  max="100"
                  disabled={isMapping}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {!isMapping ? (
              <Button onClick={startBoundaryMapping} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Mapping
              </Button>
            ) : (
              <>
                <Button onClick={stopBoundaryMapping} variant="destructive" className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Stop Mapping
                </Button>
                {mappingMode === 'manual' && (
                  <Button onClick={addCurrentPoint} disabled={!currentPosition} className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Add Point
                  </Button>
                )}
              </>
            )}
            
            {currentBoundary && currentBoundary.points.length > 0 && (
              <>
                <Button onClick={removeLastPoint} variant="outline" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Remove Last
                </Button>
                <Button onClick={completeBoundary} variant="outline" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Complete
                </Button>
              </>
            )}
            
            <Button onClick={resetBoundary} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            
            {currentBoundary && (
              <Button onClick={exportBoundaryData} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Position Status */}
      {currentPosition && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation2 className="h-5 w-5" />
              Current GPS Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-600">Latitude</Label>
                <p className="font-mono text-lg">{currentPosition.latitude.toFixed(6)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Longitude</Label>
                <p className="font-mono text-lg">{currentPosition.longitude.toFixed(6)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Accuracy</Label>
                <p className={`font-mono text-lg ${currentPosition.accuracy <= minAccuracy ? 'text-green-600' : 'text-red-600'}`}>
                  ±{currentPosition.accuracy.toFixed(1)}m
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-600">Status</Label>
                <Badge className={currentPosition.accuracy <= minAccuracy ? 'bg-green-600' : 'bg-red-600'}>
                  {currentPosition.accuracy <= minAccuracy ? 'Good' : 'Poor'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boundary Progress */}
      {currentBoundary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5" />
              Boundary Progress: {currentBoundary.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Points Collected</Label>
                  <p className="text-2xl font-bold">{currentBoundary.points.length}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Estimated Area</Label>
                  <p className="text-lg font-bold">
                    {currentBoundary.points.length >= 3 
                      ? `${calculatePolygonArea(currentBoundary.points).toFixed(2)} ha`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Perimeter</Label>
                  <p className="text-lg font-bold">
                    {currentBoundary.points.length >= 2 
                      ? `${calculatePerimeter(currentBoundary.points).toFixed(1)} m`
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Status</Label>
                  <Badge className={currentBoundary.isComplete ? 'bg-green-600' : 'bg-blue-600'}>
                    {currentBoundary.isComplete ? 'Complete' : 'In Progress'}
                  </Badge>
                </div>
              </div>

              {currentBoundary.points.length > 0 && (
                <div>
                  <Label className="text-sm text-gray-600 mb-2 block">Recent Points</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {currentBoundary.points.slice(-5).map((point) => (
                      <div key={point.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                        <span>Point {point.order}</span>
                        <span className="font-mono">{point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}</span>
                        <Badge variant="outline">±{point.accuracy.toFixed(1)}m</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}