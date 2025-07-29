import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Target, 
  Satellite,
  Navigation,
  Crosshair,
  CheckCircle,
  AlertTriangle,
  Calculator,
  Clock,
  Play,
  Pause
} from 'lucide-react';

interface BoundaryMappingDemoProps {
  plotName?: string;
  farmerName?: string;
  onMappingUpdate?: (data: any) => void;
  continuousMode?: boolean;
}

export default function BoundaryMappingDemo({ 
  plotName = "Cocoa Plot 1", 
  farmerName = "Moses Tuah",
  onMappingUpdate,
  continuousMode = false
}: BoundaryMappingDemoProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [mappingPoints, setMappingPoints] = useState<any[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<any>(null);
  const [simulationStats, setSimulationStats] = useState({
    satellites: 107,
    accuracy: 3.2,
    area: 0,
    perimeter: 0
  });

  // Simulated cocoa plot boundary points (realistic Liberia coordinates)
  const cocoaBoundaryPoints = [
    { lat: 7.225282, lng: -9.003844, accuracy: 2.8 },
    { lat: 7.225390, lng: -9.003720, accuracy: 3.1 },
    { lat: 7.225450, lng: -9.003580, accuracy: 2.9 },
    { lat: 7.225520, lng: -9.003450, accuracy: 3.4 },
    { lat: 7.225610, lng: -9.003380, accuracy: 2.7 },
    { lat: 7.225680, lng: -9.003510, accuracy: 3.2 },
    { lat: 7.225620, lng: -9.003650, accuracy: 2.8 },
    { lat: 7.225540, lng: -9.003780, accuracy: 3.0 },
    { lat: 7.225420, lng: -9.003820, accuracy: 3.1 },
    { lat: 7.225320, lng: -9.003900, accuracy: 2.9 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSimulating) {
      interval = setInterval(() => {
        const pointIndex = Math.floor((currentProgress / 100) * cocoaBoundaryPoints.length);
        
        if (pointIndex < cocoaBoundaryPoints.length) {
          const point = cocoaBoundaryPoints[pointIndex];
          const newMappingPoint = {
            id: `point-${pointIndex + 1}`,
            latitude: point.lat,
            longitude: point.lng,
            accuracy: point.accuracy,
            timestamp: new Date(),
            order: pointIndex + 1
          };

          setMappingPoints(prev => {
            const existing = prev.find(p => p.id === newMappingPoint.id);
            if (!existing) {
              const updated = [...prev, newMappingPoint];
              
              // Calculate area and perimeter
              if (updated.length >= 3) {
                const area = calculatePolygonArea(updated);
                const perimeter = calculatePerimeter(updated);
                
                setSimulationStats(prev => ({
                  ...prev,
                  area,
                  perimeter
                }));
              }
              
              return updated;
            }
            return prev;
          });

          setCurrentPosition({
            latitude: point.lat,
            longitude: point.lng,
            accuracy: point.accuracy,
            timestamp: Date.now()
          });

          onMappingUpdate?.({
            plotName,
            farmerName,
            points: mappingPoints.length + 1,
            currentPoint: newMappingPoint,
            progress: currentProgress
          });
        }

        setCurrentProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            setIsSimulating(false);
            // console.log('✅ Cocoa plot boundary mapping simulation completed');
            // Auto-restart after 3 seconds for continuous demo
            if (continuousMode) {
              setTimeout(() => {
                startSimulation();
              }, 3000);
            }
            return 100;
          }
          return newProgress;
        });
      }, 2000); // Add point every 2 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, currentProgress, mappingPoints.length, onMappingUpdate, plotName, farmerName]);

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentProgress(0);
    setMappingPoints([]);
    setSimulationStats(prev => ({
      ...prev,
      area: 0,
      perimeter: 0
    }));
    // console.log(`🎯 Starting ${plotName} boundary mapping simulation for ${farmerName}`);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    // console.log('🛑 Boundary mapping simulation stopped');
  };

  const calculatePolygonArea = (points: any[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    const n = points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    
    area = Math.abs(area) / 2;
    return area * 12393 * 100 * Math.cos(7 * Math.PI / 180);
  };

  const calculatePerimeter = (points: any[]): number => {
    if (points.length < 2) return 0;
    
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const next = (i + 1) % points.length;
      const R = 6371000;
      const dLat = (points[next].latitude - points[i].latitude) * Math.PI / 180;
      const dLon = (points[next].longitude - points[i].longitude) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(points[i].latitude * Math.PI / 180) * Math.cos(points[next].latitude * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      perimeter += R * c;
    }
    return perimeter;
  };

  return (
    <div className="space-y-6">
      {/* Demo Header */}
      <Card className="border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="h-6 w-6 text-green-600" />
            Live Boundary Mapping Demo: {plotName}
            <Badge className="bg-green-600">
              <Satellite className="h-3 w-3 mr-1" />
              {simulationStats.satellites} Satellites
            </Badge>
            {continuousMode && (
              <Badge className="bg-blue-600 animate-pulse">
                🔄 Always On Demo
              </Badge>
            )}
          </CardTitle>
          <p className="text-gray-700">
            Farmer: <strong>{farmerName}</strong> • Location: Lofa County, Liberia
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mappingPoints.length}
              </div>
              <p className="text-sm text-gray-600">Points Mapped</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ±{simulationStats.accuracy}m
              </div>
              <p className="text-sm text-gray-600">GPS Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {simulationStats.area.toFixed(3)}
              </div>
              <p className="text-sm text-gray-600">Hectares</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {simulationStats.perimeter.toFixed(1)}m
              </div>
              <p className="text-sm text-gray-600">Perimeter</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mapping Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Mapping Progress
            {isSimulating && (
              <Badge className="bg-blue-600 animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Boundary Completion</span>
              <span>{currentProgress}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>
          
          <div className="flex gap-2">
            {!isSimulating ? (
              <Button onClick={startSimulation} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                Start Demo Mapping
              </Button>
            ) : (
              <Button onClick={stopSimulation} variant="destructive">
                <Pause className="mr-2 h-4 w-4" />
                Stop Mapping
              </Button>
            )}
            <Button 
              onClick={() => {
                setCurrentProgress(0);
                setMappingPoints([]);
                setSimulationStats(prev => ({ ...prev, area: 0, perimeter: 0 }));
              }} 
              variant="outline"
            >
              Reset Demo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Position */}
      {currentPosition && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-5 w-5" />
              Current GPS Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Latitude</p>
                <p className="font-mono text-lg">{currentPosition.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Longitude</p>
                <p className="font-mono text-lg">{currentPosition.longitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="font-mono text-lg text-green-600">±{currentPosition.accuracy.toFixed(1)}m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapped Points List */}
      {mappingPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapped Boundary Points ({mappingPoints.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {mappingPoints.map((point, index) => (
                <div key={point.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-mono text-sm">
                        {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {point.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    ±{point.accuracy.toFixed(1)}m
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      {currentProgress === 100 && (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold text-green-800">
                {plotName} Boundary Mapping Complete!
              </h3>
              <p className="text-green-700">
                Successfully mapped {mappingPoints.length} boundary points
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {simulationStats.area.toFixed(3)}
                  </div>
                  <p className="text-sm text-gray-600">Total Area (ha)</p>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {simulationStats.perimeter.toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Perimeter (m)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}