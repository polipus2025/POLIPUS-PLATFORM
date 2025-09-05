import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check, Satellite, Download, Shield, AlertTriangle } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area: number;
}

interface RealMapBoundaryMapperProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  minPoints?: number;
  maxPoints?: number;
  enableRealTimeGPS?: boolean;
  enableGNSSRTK?: boolean;
}

export default function RealMapBoundaryMapperSafe({ 
  onBoundaryComplete, 
  minPoints = 6,
  maxPoints = 20,
  enableRealTimeGPS = true,
  enableGNSSRTK = true
}: RealMapBoundaryMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('GPS Land Mapping - Safe Version');
  const [mapReady, setMapReady] = useState(false);
  const [currentGPSPosition, setCurrentGPSPosition] = useState<{lat: number, lng: number} | null>(null);
  const [isTrackingGPS, setIsTrackingGPS] = useState(false);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);

  // SAFE INITIALIZATION - No direct DOM manipulation
  useEffect(() => {
    if (mapRef.current && !mapReady) {
      setMapReady(true);
      setStatus('✅ Safe GPS mapping ready - no DOM conflicts!');
    }
  }, []);

  // SAFE CLEANUP - Clear timeouts only
  useEffect(() => {
    return () => {
      // Clear all timeouts safely
      timeoutRef.current.forEach(timeoutId => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      });
      timeoutRef.current = [];
      
      // Clear GPS watch safely
      if (gpsWatchId !== null) {
        try {
          navigator.geolocation.clearWatch(gpsWatchId);
        } catch (e) {
          // Ignore errors
        }
      }
    };
  }, [gpsWatchId]);

  // SAFE GPS TRACKING - No DOM manipulation
  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      setStatus('❌ GPS not supported by this browser');
      return;
    }

    setIsTrackingGPS(true);
    setStatus('🔍 Starting GPS tracking...');

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setCurrentGPSPosition({lat, lng});
        setStatus(`📍 GPS Active - Accuracy: ${Math.round(accuracy)}m`);
      },
      (error) => {
        setIsTrackingGPS(false);
        setStatus('❌ GPS Error - Please check device settings');
        
        // SAFE timeout - properly tracked
        const timeoutId = setTimeout(() => {
          try {
            setStatus('💡 Try: 1) Allow location 2) Move to open area 3) Refresh page');
          } catch (e) {
            // Component may be unmounted
          }
        }, 3000);
        timeoutRef.current.push(timeoutId);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 1000
      }
    );

    setGpsWatchId(watchId);
  };

  const stopGPSTracking = () => {
    if (gpsWatchId !== null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      setGpsWatchId(null);
    }
    setIsTrackingGPS(false);
    setCurrentGPSPosition(null);
    setStatus('GPS tracking stopped');
  };

  const addBoundaryPoint = () => {
    if (!currentGPSPosition) {
      setStatus('❌ No GPS position available');
      return;
    }

    if (points.length >= maxPoints) {
      setStatus('❌ Maximum points reached');
      return;
    }

    const newPoint: BoundaryPoint = {
      latitude: currentGPSPosition.lat,
      longitude: currentGPSPosition.lng,
      timestamp: new Date()
    };

    const updatedPoints = [...points, newPoint];
    setPoints(updatedPoints);
    setStatus(`✅ Point ${updatedPoints.length} added - ${points.length + 1}/${maxPoints} points`);
  };

  const calculateArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2;
    
    // Convert to approximate square meters (rough conversion)
    return area * 111319.9 * 111319.9;
  };

  const completeBoundary = () => {
    if (points.length < minPoints) {
      setStatus(`❌ Need at least ${minPoints} points`);
      return;
    }

    const area = calculateArea(points);
    const boundaryData: BoundaryData = { points, area };
    
    setStatus(`✅ Boundary completed - ${points.length} points, ${(area / 10000).toFixed(2)} hectares`);
    onBoundaryComplete(boundaryData);
  };

  const resetMapping = () => {
    setPoints([]);
    setStatus('🗺️ Mapping reset - ready for new boundary');
  };

  return (
    <div className="w-full h-full bg-white rounded-lg border shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">GPS Land Boundary Mapper</h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              SAFE VERSION
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Points: {points.length}/{maxPoints}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isTrackingGPS ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-gray-700">{status}</span>
        </div>
      </div>

      {/* Map Container - SAFE: No DOM manipulation */}
      <div 
        ref={mapRef} 
        className="flex-1 relative bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden"
      >
        {/* Safe React-based visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-8 bg-white/90 rounded-lg shadow-lg border-2 border-dashed border-green-300">
            <Satellite className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Safe GPS Mapping</h4>
            <p className="text-gray-600 mb-4">
              DOM-conflict-free implementation<br/>
              No removeChild errors possible
            </p>
            
            {/* GPS Position Display */}
            {currentGPSPosition && (
              <div className="mb-4 p-3 bg-green-50 rounded border">
                <div className="text-sm text-green-800">
                  <div>Lat: {currentGPSPosition.lat.toFixed(6)}</div>
                  <div>Lng: {currentGPSPosition.lng.toFixed(6)}</div>
                </div>
              </div>
            )}
            
            {/* Points List */}
            {points.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded border max-h-32 overflow-y-auto">
                <div className="text-sm text-blue-800">
                  <div className="font-semibold mb-1">Boundary Points:</div>
                  {points.map((point, index) => (
                    <div key={index} className="text-xs">
                      Point {index + 1}: {point.latitude.toFixed(4)}, {point.longitude.toFixed(4)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t bg-white space-y-3">
        <div className="flex gap-2 flex-wrap">
          {!isTrackingGPS ? (
            <Button
              onClick={startGPSTracking}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Start GPS
            </Button>
          ) : (
            <Button
              onClick={stopGPSTracking}
              variant="outline"
              className="flex-1"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Stop GPS
            </Button>
          )}
          
          <Button
            onClick={addBoundaryPoint}
            disabled={!currentGPSPosition || points.length >= maxPoints}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Add Point ({points.length})
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={resetMapping}
            variant="outline"
            className="flex-1"
            disabled={points.length === 0}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={completeBoundary}
            disabled={points.length < minPoints}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Complete Boundary
          </Button>
        </div>
      </div>
    </div>
  );
}