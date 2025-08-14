import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Target, Trash2, Save } from "lucide-react";

interface ClickToMapProps {
  onCoordinatesChange?: (coordinates: Array<{lat: number, lng: number, point: number}>) => void;
  onLocationDetected?: (lat: number, lng: number) => void;
  initialCoordinates?: Array<{lat: number, lng: number, point: number}>;
  title?: string;
  height?: string;
}

const ClickToMap: React.FC<ClickToMapProps> = ({
  onCoordinatesChange,
  onLocationDetected,
  initialCoordinates = [],
  title = "Click to Add GPS Points",
  height = "400px"
}) => {
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 6.3106, lng: -10.8047 }); // Default to Liberia
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support GPS location detection",
        variant: "destructive"
      });
      return;
    }

    setIsDetectingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setMapCenter({ lat, lng });
        
        if (onLocationDetected) {
          onLocationDetected(lat, lng);
        }
        
        toast({
          title: "Location Detected",
          description: `Centered map at: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        });
        
        setIsDetectingLocation(false);
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
        
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Handle map click to add coordinates
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    
    // Convert click position to approximate lat/lng (simplified projection)
    const clickLat = mapCenter.lat + (0.5 - y) * 0.01; // Adjust zoom factor as needed
    const clickLng = mapCenter.lng + (x - 0.5) * 0.01;
    
    const newPoint = {
      lat: parseFloat(clickLat.toFixed(6)),
      lng: parseFloat(clickLng.toFixed(6)),
      point: coordinates.length + 1
    };
    
    const updatedCoordinates = [...coordinates, newPoint];
    setCoordinates(updatedCoordinates);
    
    if (onCoordinatesChange) {
      onCoordinatesChange(updatedCoordinates);
    }
    
    toast({
      title: "Point Added",
      description: `Added point ${newPoint.point}: ${newPoint.lat}, ${newPoint.lng}`,
    });
  };

  // Clear all coordinates
  const clearCoordinates = () => {
    setCoordinates([]);
    if (onCoordinatesChange) {
      onCoordinatesChange([]);
    }
    toast({
      title: "Points Cleared",
      description: "All GPS points have been removed",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Control buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button 
            onClick={getCurrentLocation} 
            disabled={isDetectingLocation}
            variant="outline"
            size="sm"
            data-testid="button-detect-location"
          >
            <MapPin className="w-4 h-4 mr-1" />
            {isDetectingLocation ? "Detecting..." : "Center on My Location"}
          </Button>
          
          <Button 
            onClick={clearCoordinates} 
            variant="outline" 
            size="sm"
            disabled={coordinates.length === 0}
            data-testid="button-clear-points"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear Points ({coordinates.length})
          </Button>
        </div>

        {/* Interactive map area */}
        <div 
          ref={mapRef}
          onClick={handleMapClick}
          className="relative border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair hover:border-blue-400 transition-colors"
          style={{ height }}
          data-testid="interactive-map"
        >
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#666" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Center indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          
          {/* Map info overlay */}
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono">
            Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
          </div>
          
          {/* Instructions overlay */}
          <div className="absolute bottom-2 left-2 right-2 bg-blue-50/90 backdrop-blur-sm rounded px-3 py-2 text-sm text-center">
            Click anywhere on the map to add GPS points • Points: {coordinates.length}
          </div>
          
          {/* Plotted points */}
          {coordinates.map((coord, index) => {
            // Convert lat/lng back to pixel position (simplified)
            const x = ((coord.lng - mapCenter.lng) / 0.01 + 0.5) * 100;
            const y = ((mapCenter.lat - coord.lat) / 0.01 + 0.5) * 100;
            
            return (
              <div 
                key={index}
                className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${Math.max(0, Math.min(100, x))}%`, 
                  top: `${Math.max(0, Math.min(100, y))}%` 
                }}
                title={`Point ${coord.point}: ${coord.lat}, ${coord.lng}`}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs bg-blue-500 text-white px-1 rounded">
                  {coord.point}
                </span>
              </div>
            );
          })}
        </div>

        {/* Coordinates list */}
        {coordinates.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Recorded GPS Points:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {coordinates.map((coord, index) => (
                <div key={index} className="flex justify-between items-center text-sm bg-gray-50 px-2 py-1 rounded">
                  <span className="font-mono">
                    Point {coord.point}: {coord.lat}, {coord.lng}
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      const updated = coordinates.filter((_, i) => i !== index);
                      const reindexed = updated.map((c, i) => ({ ...c, point: i + 1 }));
                      setCoordinates(reindexed);
                      if (onCoordinatesChange) {
                        onCoordinatesChange(reindexed);
                      }
                    }}
                    data-testid={`button-remove-point-${index}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClickToMap;