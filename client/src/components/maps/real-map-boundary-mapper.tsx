import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Target, Square, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BoundaryPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area?: number;
  perimeter?: number;
}

interface RealMapBoundaryMapperProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
}

export default function RealMapBoundaryMapper({ onBoundaryComplete }: RealMapBoundaryMapperProps) {
  const { toast } = useToast();
  const [boundaryPoints, setBoundaryPoints] = useState<BoundaryPoint[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Calculate area using Shoelace formula (simplified for demonstration)
  const calculateArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2;
    
    // Convert from decimal degrees to hectares (rough approximation)
    // 1 degree ≈ 111 km, so 1 square degree ≈ 12321 km² ≈ 1,232,100 hectares
    return area * 1232100;
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Available",
        description: "Your device doesn't support GPS location services.",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(location);
        setIsGettingLocation(false);
        
        toast({
          title: "Location Acquired",
          description: `GPS coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
        });
      },
      (error) => {
        setIsGettingLocation(false);
        toast({
          title: "GPS Error",
          description: "Unable to get your current location. Please check GPS permissions.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Add boundary point at current location
  const addBoundaryPoint = () => {
    if (!currentLocation) {
      toast({
        title: "No Location",
        description: "Please get your current location first.",
        variant: "destructive",
      });
      return;
    }

    const newPoint: BoundaryPoint = {
      latitude: currentLocation.lat,
      longitude: currentLocation.lng,
      timestamp: Date.now()
    };

    const updatedPoints = [...boundaryPoints, newPoint];
    setBoundaryPoints(updatedPoints);

    toast({
      title: "Boundary Point Added",
      description: `Point ${updatedPoints.length} added at ${newPoint.latitude.toFixed(6)}, ${newPoint.longitude.toFixed(6)}`,
    });
  };

  // Complete boundary mapping
  const completeBoundary = () => {
    if (boundaryPoints.length < 3) {
      toast({
        title: "Insufficient Points",
        description: "Please add at least 3 boundary points to complete the mapping.",
        variant: "destructive",
      });
      return;
    }

    const area = calculateArea(boundaryPoints);
    const boundaryData: BoundaryData = {
      points: boundaryPoints,
      area: area,
      perimeter: 0 // Can be calculated if needed
    };

    onBoundaryComplete(boundaryData);
    setIsCapturing(false);
    
    toast({
      title: "Boundary Mapping Complete",
      description: `Land plot mapped with ${boundaryPoints.length} points (${area.toFixed(2)} hectares)`,
    });
  };

  // Reset boundary
  const resetBoundary = () => {
    setBoundaryPoints([]);
    setIsCapturing(false);
    toast({
      title: "Boundary Reset",
      description: "All boundary points have been cleared.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <span>Land Boundary Mapper</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Current Location Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">1. Get Current Location</span>
            <Button
              variant="outline"
              size="sm"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <>
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  Getting...
                </>
              ) : (
                <>
                  <Target className="h-3 w-3 mr-1" />
                  Get Location
                </>
              )}
            </Button>
          </div>
          
          {currentLocation && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Current GPS Coordinates:</span>
              </div>
              <p className="text-xs font-mono mt-1 text-green-700">
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        {/* Boundary Points Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">2. Mark Boundary Points</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addBoundaryPoint}
                disabled={!currentLocation}
              >
                <MapPin className="h-3 w-3 mr-1" />
                Add Point
              </Button>
            </div>
          </div>

          {boundaryPoints.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Boundary Points ({boundaryPoints.length})</span>
                <Badge variant="secondary">{boundaryPoints.length} points</Badge>
              </div>
              
              <div className="max-h-32 overflow-y-auto space-y-1">
                {boundaryPoints.map((point, index) => (
                  <div key={index} className="bg-gray-50 border rounded px-2 py-1 text-xs">
                    <span className="font-medium">Point {index + 1}:</span> {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4">
          <Button
            onClick={completeBoundary}
            disabled={boundaryPoints.length < 3}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Complete Boundary
          </Button>
          
          {boundaryPoints.length > 0 && (
            <Button
              variant="outline"
              onClick={resetBoundary}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1">Instructions:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Get your current GPS location first</li>
                <li>Walk to each corner of your land plot</li>
                <li>At each corner, click "Add Point" to mark the boundary</li>
                <li>Add at least 3 points to complete the boundary</li>
                <li>Click "Complete Boundary" when finished</li>
              </ol>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}