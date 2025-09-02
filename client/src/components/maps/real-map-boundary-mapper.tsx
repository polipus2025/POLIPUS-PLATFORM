import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Satellite, Download, RefreshCw, Target, Crosshair } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area: number; // in hectares
  perimeter: number; // in meters
}

interface RealMapBoundaryMapperProps {
  onBoundaryComplete?: (boundaryData: BoundaryData | null) => void;
  onBoundaryChange?: (boundaryData: BoundaryData | null) => void;
  initialBoundary?: BoundaryData | null;
  showControls?: boolean;
  height?: string;
}

export default function RealMapBoundaryMapper({
  onBoundaryComplete,
  onBoundaryChange,
  initialBoundary,
  showControls = true,
  height = "500px"
}: RealMapBoundaryMapperProps) {
  const { toast } = useToast();
  const mapRef = useRef<HTMLDivElement>(null);
  const [boundaryPoints, setBoundaryPoints] = useState<BoundaryPoint[]>(
    initialBoundary?.points || []
  );
  const [isMapping, setIsMapping] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<BoundaryPoint | null>(null);
  const [mapMode, setMapMode] = useState<'satellite' | 'terrain'>('satellite');

  // Calculate area using shoelace formula (approximate)
  const calculateArea = (points: BoundaryPoint[]) => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2;
    // Convert to hectares (rough approximation)
    return area * 111.32 * 111.32 / 10000;
  };

  // Calculate perimeter
  const calculatePerimeter = (points: BoundaryPoint[]) => {
    if (points.length < 2) return 0;
    
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const dx = (points[j].longitude - points[i].longitude) * 111.32 * 1000;
      const dy = (points[j].latitude - points[i].latitude) * 111.32 * 1000;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }
    return perimeter;
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Available",
        description: "GPS is not available on this device",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPoint = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCurrentLocation(newPoint);
        
        if (isMapping) {
          const newPoints = [...boundaryPoints, newPoint];
          setBoundaryPoints(newPoints);
          
          if (newPoints.length >= 3) {
            const boundaryData: BoundaryData = {
              points: newPoints,
              area: calculateArea(newPoints),
              perimeter: calculatePerimeter(newPoints)
            };
            onBoundaryComplete?.(boundaryData);
            onBoundaryChange?.(boundaryData);
          }
          
          toast({
            title: "Point Added",
            description: `Added boundary point ${newPoints.length}`,
          });
        }
      },
      (error) => {
        toast({
          title: "GPS Error",
          description: "Could not get your location. Please enable GPS and try again.",
          variant: "destructive"
        });
      }
    );
  };

  // Start/stop mapping
  const toggleMapping = () => {
    setIsMapping(!isMapping);
    if (!isMapping) {
      setBoundaryPoints([]);
      onBoundaryComplete?.(null);
      onBoundaryChange?.(null);
      toast({
        title: "Mapping Started",
        description: "Click 'Add Point' to mark boundary points",
      });
    } else {
      toast({
        title: "Mapping Stopped",
        description: `Completed mapping with ${boundaryPoints.length} points`,
      });
    }
  };

  // Clear all points
  const clearBoundary = () => {
    setBoundaryPoints([]);
    setCurrentLocation(null);
    onBoundaryComplete?.(null);
    onBoundaryChange?.(null);
    toast({
      title: "Boundary Cleared",
      description: "All boundary points have been removed",
    });
  };

  // Complete the boundary (close the polygon)
  const completeBoundary = () => {
    if (boundaryPoints.length < 3) {
      toast({
        title: "Insufficient Points",
        description: "Need at least 3 points to complete boundary",
        variant: "destructive"
      });
      return;
    }

    const boundaryData: BoundaryData = {
      points: boundaryPoints,
      area: calculateArea(boundaryPoints),
      perimeter: calculatePerimeter(boundaryPoints)
    };
    
    setIsMapping(false);
    onBoundaryComplete?.(boundaryData);
    onBoundaryChange?.(boundaryData);
    
    toast({
      title: "Boundary Completed",
      description: `Area: ${boundaryData.area.toFixed(2)} hectares`,
    });
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Land Boundary Mapper
          <Badge variant="outline" className="ml-auto">
            GPS Enabled
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Container */}
        <div 
          ref={mapRef}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center relative"
          style={{ height }}
        >
          <div className="absolute top-4 right-4 z-10">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMapMode(mapMode === 'satellite' ? 'terrain' : 'satellite')}
            >
              <Satellite className="w-4 h-4 mr-1" />
              {mapMode === 'satellite' ? 'Satellite' : 'Terrain'}
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Interactive Map Area
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                {isMapping 
                  ? "Walk around the land boundary and click 'Add Point' at each corner"
                  : "Start mapping to begin marking boundary points"
                }
              </p>
            </div>

            {currentLocation && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 border max-w-sm mx-auto">
                <div className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  Current GPS: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </div>
              </div>
            )}

            {boundaryPoints.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 max-w-sm mx-auto">
                <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  Boundary Points: {boundaryPoints.length}
                </div>
                {boundaryPoints.length >= 3 && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Area: {calculateArea(boundaryPoints).toFixed(2)} hectares
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={toggleMapping}
              variant={isMapping ? "destructive" : "default"}
              size="sm"
            >
              {isMapping ? "Stop Mapping" : "Start Mapping"}
            </Button>

            {isMapping && (
              <Button
                onClick={getCurrentLocation}
                variant="outline"
                size="sm"
              >
                <Target className="w-4 h-4 mr-1" />
                Add Point
              </Button>
            )}

            {boundaryPoints.length >= 3 && isMapping && (
              <Button
                onClick={completeBoundary}
                variant="outline"
                size="sm"
              >
                <Crosshair className="w-4 h-4 mr-1" />
                Complete Boundary
              </Button>
            )}

            {boundaryPoints.length > 0 && (
              <Button
                onClick={clearBoundary}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}

            <Button
              onClick={() => getCurrentLocation()}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Update GPS
            </Button>
          </div>
        )}

        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="font-semibold text-gray-700 dark:text-gray-300">Status</div>
            <div className="text-gray-600 dark:text-gray-400">
              {isMapping ? "Mapping Active" : "Ready to Map"}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="font-semibold text-gray-700 dark:text-gray-300">Points</div>
            <div className="text-gray-600 dark:text-gray-400">
              {boundaryPoints.length} marked
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="font-semibold text-gray-700 dark:text-gray-300">Area</div>
            <div className="text-gray-600 dark:text-gray-400">
              {boundaryPoints.length >= 3 
                ? `${calculateArea(boundaryPoints).toFixed(2)} ha`
                : "Not calculated"
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}