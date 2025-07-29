import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calculator, 
  Ruler,
  Download,
  Eye,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Crosshair,
  Navigation
} from 'lucide-react';

interface BoundaryPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  order: number;
}

interface RealTimeBoundaryDisplayProps {
  points: BoundaryPoint[];
  isActive: boolean;
  onComplete?: (data: any) => void;
  onReset?: () => void;
}

export default function RealTimeBoundaryDisplay({ 
  points, 
  isActive, 
  onComplete, 
  onReset 
}: RealTimeBoundaryDisplayProps) {
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [perimeter, setPerimeter] = useState(0);
  const [centerPoint, setCenterPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (points.length >= 3) {
      const area = calculatePolygonArea(points);
      const perim = calculatePerimeter(points);
      const center = calculateCenterPoint(points);
      
      setCalculatedArea(area);
      setPerimeter(perim);
      setCenterPoint(center);
      setIsComplete(points.length >= 4);
      
      // console.log('📐 Real-time boundary calculations:', {
        points: points.length,
        area: `${area.toFixed(3)} hectares`,
        perimeter: `${perim.toFixed(1)} meters`,
        center: center ? `${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}` : 'N/A'
      });
    }
  }, [points]);

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
    // Convert to hectares (adjusted for Liberia's latitude ~7°N)
    return area * 12393 * 100 * Math.cos(7 * Math.PI / 180);
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

  const calculateCenterPoint = (points: BoundaryPoint[]): { lat: number; lng: number } | null => {
    if (points.length === 0) return null;
    
    const sumLat = points.reduce((sum, p) => sum + p.latitude, 0);
    const sumLng = points.reduce((sum, p) => sum + p.longitude, 0);
    
    return {
      lat: sumLat / points.length,
      lng: sumLng / points.length
    };
  };

  const getAverageAccuracy = (): number => {
    if (points.length === 0) return 0;
    return points.reduce((sum, p) => sum + p.accuracy, 0) / points.length;
  };

  const exportBoundaryData = () => {
    const boundaryData = {
      points: points,
      calculations: {
        area: calculatedArea,
        perimeter: perimeter,
        centerPoint: centerPoint,
        averageAccuracy: getAverageAccuracy()
      },
      metadata: {
        timestamp: new Date().toISOString(),
        totalPoints: points.length,
        mappingDuration: points.length > 0 
          ? Date.now() - points[0].timestamp.getTime()
          : 0
      }
    };

    const blob = new Blob([JSON.stringify(boundaryData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boundary-mapping-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // console.log('💾 Exported boundary data:', boundaryData);
  };

  const completeBoundary = () => {
    if (points.length < 3) return;
    
    const boundaryData = {
      points: points,
      area: calculatedArea,
      perimeter: perimeter,
      centerPoint: centerPoint,
      averageAccuracy: getAverageAccuracy(),
      isComplete: true
    };

    onComplete?.(boundaryData);
    // console.log('✅ Boundary mapping completed:', boundaryData);
  };

  if (points.length === 0 && !isActive) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-center">
            Start boundary mapping to see real-time calculations
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real-time Calculations Card */}
      <Card className="border-2 border-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Real-Time Boundary Calculations
            <Badge variant="secondary" className={isActive ? "bg-green-100 text-green-800" : "bg-gray-100"}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {points.length}
              </div>
              <p className="text-sm text-gray-600">Points Collected</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {calculatedArea.toFixed(3)}
              </div>
              <p className="text-sm text-gray-600">Hectares</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {perimeter.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Perimeter (m)</p>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">
                ±{getAverageAccuracy().toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Avg Accuracy (m)</p>
            </div>
          </div>

          {centerPoint && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Crosshair className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Center Point</span>
              </div>
              <p className="font-mono text-sm">
                {centerPoint.lat.toFixed(6)}, {centerPoint.lng.toFixed(6)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Points List */}
      {points.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Boundary Points ({points.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {points.map((point, index) => (
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
                  <div className="text-center">
                    <Badge className={point.accuracy <= 5 ? 'bg-green-600' : point.accuracy <= 10 ? 'bg-yellow-600' : 'bg-red-600'}>
                      ±{point.accuracy.toFixed(1)}m
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {points.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-wrap">
              {points.length >= 3 && (
                <Button 
                  onClick={completeBoundary}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Boundary
                </Button>
              )}
              
              <Button onClick={exportBoundaryData} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              
              <Button onClick={onReset} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
            
            {points.length < 3 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800">
                    Need at least 3 points to calculate area and complete boundary
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}