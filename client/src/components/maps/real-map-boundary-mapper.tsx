import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trash2, Undo2, Target, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GPSPoint {
  latitude: number;
  longitude: number;
}

interface BoundaryData {
  points: GPSPoint[];
  area: number;
  areaHectares: number;
  areaAcres: number;
  areaSquareMeters: number;
  perimeter: number;
}

interface Props {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  initialCenter?: { lat: number; lng: number };
  minPoints?: number; // EUDR regulation requires minimum 6 points
}

export default function RealMapBoundaryMapper({ onBoundaryComplete, initialCenter, minPoints = 6 }: Props) {
  const { toast } = useToast();
  const [mapPoints, setMapPoints] = useState<GPSPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<GPSPoint | null>(null);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    loadLeaflet();
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || mapInstance) return;

    const center = initialCenter || { lat: 6.3406, lng: -10.7572 }; // Liberia center
    
    const map = window.L.map(mapRef.current).setView([center.lat, center.lng], 13);
    
    // Add satellite imagery tile layer
    window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
      maxZoom: 19
    }).addTo(map);

    // Add click handler for adding boundary points
    map.on('click', (e: any) => {
      const newPoint: GPSPoint = {
        latitude: parseFloat(e.latlng.lat.toFixed(6)),
        longitude: parseFloat(e.latlng.lng.toFixed(6))
      };
      
      addBoundaryPoint(newPoint, map);
    });

    setMapInstance(map);
    setIsMapLoaded(true);
  };

  const addBoundaryPoint = (point: GPSPoint, map: any) => {
    const newPoints = [...mapPoints, point];
    setMapPoints(newPoints);

    // Add marker for the new point
    const marker = window.L.marker([point.latitude, point.longitude])
      .addTo(map)
      .bindPopup(`Point ${newPoints.length}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`);

    // If we have more than minPoints-1 points, draw/update the boundary
    if (newPoints.length >= minPoints) {
      // Remove existing boundary if any
      map.eachLayer((layer: any) => {
        if (layer instanceof window.L.Polygon) {
          map.removeLayer(layer);
        }
      });

      // Draw new boundary polygon
      const polygon = window.L.polygon(newPoints.map(p => [p.latitude, p.longitude]), {
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.2,
        weight: 3
      }).addTo(map);

      // Calculate area and update boundary data
      const boundaryData = calculateArea(newPoints);
      onBoundaryComplete(boundaryData);

      toast({
        title: "Boundary Updated",
        description: `Area: ${boundaryData.areaHectares} hectares (${boundaryData.areaAcres} acres)`,
      });
    }
  };

  const calculateArea = (points: GPSPoint[]): BoundaryData => {
    if (points.length < 3) {
      return {
        points,
        area: 0,
        areaHectares: 0,
        areaAcres: 0,
        areaSquareMeters: 0,
        perimeter: 0
      };
    }

    // Calculate area using the shoelace formula (in square meters)
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

    area = Math.abs(area * earthRadius * earthRadius / 2);

    // Calculate perimeter
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const distance = calculateDistance(points[i], points[j]);
      perimeter += distance;
    }

    return {
      points,
      area: parseFloat((area / 10000).toFixed(2)), // hectares (primary unit)
      areaHectares: parseFloat((area / 10000).toFixed(2)), // hectares
      areaAcres: parseFloat((area / 4047).toFixed(2)), // acres
      areaSquareMeters: parseFloat(area.toFixed(2)), // square meters
      perimeter: parseFloat(perimeter.toFixed(2))
    };
  };

  const calculateDistance = (point1: GPSPoint, point2: GPSPoint): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLng = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const clearBoundary = () => {
    setMapPoints([]);
    if (mapInstance) {
      mapInstance.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker || layer instanceof window.L.Polygon) {
          mapInstance.removeLayer(layer);
        }
      });
    }
    toast({
      title: "Boundary Cleared",
      description: "All boundary points have been removed",
    });
  };

  const undoLastPoint = () => {
    if (mapPoints.length === 0) return;
    
    const newPoints = mapPoints.slice(0, -1);
    setMapPoints(newPoints);
    
    if (mapInstance) {
      // Redraw the map with remaining points
      mapInstance.eachLayer((layer: any) => {
        if (layer instanceof window.L.Marker || layer instanceof window.L.Polygon) {
          mapInstance.removeLayer(layer);
        }
      });

      // Redraw markers
      newPoints.forEach((point, index) => {
        window.L.marker([point.latitude, point.longitude])
          .addTo(mapInstance)
          .bindPopup(`Point ${index + 1}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`);
      });

      // Redraw polygon if enough points
      if (newPoints.length >= minPoints) {
        window.L.polygon(newPoints.map(p => [p.latitude, p.longitude]), {
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.2,
          weight: 3
        }).addTo(mapInstance);

        const boundaryData = calculateArea(newPoints);
        onBoundaryComplete(boundaryData);
      }
    }

    toast({
      title: "Point Removed",
      description: `${mapPoints.length - 1} points remaining`,
    });
  };

  const getCurrentLocation = () => {
    setIsDetectingGPS(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Available",
        description: "Geolocation is not supported by this device/browser",
        variant: "destructive",
      });
      setIsDetectingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        setCurrentLocation(newLocation);
        
        if (mapInstance) {
          mapInstance.setView([latitude, longitude], 16);
          
          // Add current location marker
          window.L.marker([latitude, longitude], {
            icon: window.L.divIcon({
              className: 'current-location-marker',
              html: '<div style="background-color: #EF4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
              iconSize: [16, 16]
            })
          }).addTo(mapInstance).bindPopup('Current Location');
        }

        toast({
          title: "GPS Location Found",
          description: `Located at ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
        setIsDetectingGPS(false);
      },
      (error) => {
        toast({
          title: "GPS Detection Failed",
          description: "Unable to get current location",
          variant: "destructive",
        });
        setIsDetectingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const getAreaDisplay = () => {
    if (mapPoints.length < 3) return null;
    
    const boundaryData = calculateArea(mapPoints);
    
    // Determine best unit based on area size
    let displayUnit = '';
    let displayValue = 0;
    
    if (boundaryData.areaHectares >= 1) {
      displayUnit = 'hectares';
      displayValue = boundaryData.areaHectares;
    } else if (boundaryData.areaSquareMeters >= 1000) {
      displayUnit = 'square meters';
      displayValue = boundaryData.areaSquareMeters;
    } else {
      displayUnit = 'square meters';
      displayValue = boundaryData.areaSquareMeters;
    }

    return (
      <div className="mt-4 p-3 bg-green-50 rounded-lg">
        <div className="flex items-center mb-2">
          <Calculator className="w-4 h-4 text-green-600 mr-2" />
          <h4 className="font-medium text-green-800">Area Calculation</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div className="text-green-700">
            <strong>Hectares:</strong> {boundaryData.areaHectares}
          </div>
          <div className="text-green-700">
            <strong>Acres:</strong> {boundaryData.areaAcres}
          </div>
          <div className="text-green-700">
            <strong>Sq. Meters:</strong> {boundaryData.areaSquareMeters}
          </div>
        </div>
        <div className="mt-2 text-sm text-green-600">
          <strong>Primary:</strong> {displayValue} {displayUnit}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="border rounded-lg overflow-hidden">
        <div 
          ref={mapRef}
          style={{ height: '400px', width: '100%' }}
          className="relative"
        >
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading satellite map...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isDetectingGPS}
        >
          {isDetectingGPS ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          ) : (
            <Target className="w-4 h-4 mr-2" />
          )}
          {isDetectingGPS ? "Locating..." : "Find My Location"}
        </Button>
        
        <Button variant="outline" size="sm" onClick={undoLastPoint} disabled={mapPoints.length === 0}>
          <Undo2 className="w-4 h-4 mr-2" />
          Undo Last Point
        </Button>
        
        <Button variant="outline" size="sm" onClick={clearBoundary} disabled={mapPoints.length === 0}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Boundary
        </Button>

        <Badge variant="secondary">
          <MapPin className="w-3 h-3 mr-1" />
          {mapPoints.length} points mapped
        </Badge>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">How to Map Farm Boundary (Recommended 8+ Points):</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Click "Find My Location" to center map on your GPS location</li>
          <li>2. Walk around the farm perimeter and click on the map at each corner/boundary point</li>
          <li>3. Add at least {minPoints} points to create a boundary polygon (EUDR regulation compliance)</li>
          <li>4. Recommended: Add 8+ points for more accurate area calculation</li>
          <li>5. Area will be calculated automatically in hectares, acres, and square meters</li>
          <li>6. Use "Undo Last Point" to remove the most recent point</li>
          <li>7. Use "Clear Boundary" to start over</li>
        </ol>
      </div>

      {/* Area Display */}
      {getAreaDisplay()}

      {/* Point List */}
      {mapPoints.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Boundary Points ({mapPoints.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
              {mapPoints.map((point, index) => (
                <div key={index} className="flex justify-between items-center py-1 border-b">
                  <span>Point {index + 1}:</span>
                  <span className="font-mono">{point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}