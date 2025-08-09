import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check, Satellite, Download, Shield, AlertTriangle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface BoundaryPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  pixelX: number;
  pixelY: number;
}

interface PersistentBoundaryMapperProps {
  onBoundaryComplete: (points: BoundaryPoint[], area: number) => void;
  minPoints?: number;
  maxPoints?: number;
  initialCenter?: { lat: number; lng: number };
}

export default function PersistentBoundaryMapper({
  onBoundaryComplete,
  minPoints = 3,
  maxPoints = 20,
  initialCenter = { lat: 6.4281, lng: -9.4295 } // Liberia default
}: PersistentBoundaryMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [isMapReady, setIsMapReady] = useState(false);
  const [satelliteLoaded, setSatelliteLoaded] = useState(false);
  const { toast } = useToast();

  // Calculate area using shoelace formula
  const calculateArea = useCallback((boundaryPoints: BoundaryPoint[]) => {
    if (boundaryPoints.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < boundaryPoints.length; i++) {
      const j = (i + 1) % boundaryPoints.length;
      area += boundaryPoints[i].latitude * boundaryPoints[j].longitude;
      area -= boundaryPoints[j].latitude * boundaryPoints[i].longitude;
    }
    
    area = Math.abs(area) / 2;
    // Convert to hectares (approximate)
    return parseFloat((area * 111.32 * 111.32 / 10000).toFixed(2));
  }, []);

  // Draw boundary points and connections on canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections between points
    if (points.length > 1) {
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.pixelX, point.pixelY);
        } else {
          ctx.lineTo(point.pixelX, point.pixelY);
        }
      });
      
      // Close polygon if we have enough points
      if (points.length >= minPoints) {
        ctx.closePath();
        ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
        ctx.fill();
      }
      
      ctx.stroke();
    }

    // Draw individual points
    points.forEach((point, index) => {
      ctx.beginPath();
      ctx.arc(point.pixelX, point.pixelY, 8, 0, 2 * Math.PI);
      
      // Different colors for different point types
      if (index === 0) {
        ctx.fillStyle = '#22c55e'; // Green for start
      } else if (index === points.length - 1 && points.length >= minPoints) {
        ctx.fillStyle = '#ef4444'; // Red for end
      } else {
        ctx.fillStyle = '#3b82f6'; // Blue for middle points
      }
      
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw point number
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((index + 1).toString(), point.pixelX, point.pixelY);
    });
  }, [points, minPoints]);

  // Convert pixel coordinates to GPS coordinates
  const pixelToGPS = useCallback((pixelX: number, pixelY: number, mapWidth: number, mapHeight: number) => {
    // Map scale: approximately 0.002 degrees per full map width/height
    const degreeRange = 0.002;
    
    const lat = mapCenter.lat + (degreeRange / 2) - (pixelY / mapHeight) * degreeRange;
    const lng = mapCenter.lng - (degreeRange / 2) + (pixelX / mapWidth) * degreeRange;
    
    return { lat, lng };
  }, [mapCenter]);

  // Handle map click to add boundary point
  const handleMapClick = useCallback((e: React.MouseEvent) => {
    if (!isMapReady || points.length >= maxPoints) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const { lat, lng } = pixelToGPS(pixelX, pixelY, rect.width, rect.height);

    const newPoint: BoundaryPoint = {
      id: `boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      latitude: lat,
      longitude: lng,
      accuracy: 1.5,
      timestamp: new Date(),
      pixelX,
      pixelY
    };

    setPoints(prev => {
      const updated = [...prev, newPoint];
      
      toast({
        title: "Boundary Point Added",
        description: `Point ${updated.length} added at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });

      // Auto-complete boundary if we reach max points
      if (updated.length >= maxPoints) {
        const area = calculateArea(updated);
        onBoundaryComplete(updated, area);
      }

      return updated;
    });
  }, [isMapReady, points.length, maxPoints, pixelToGPS, toast, onBoundaryComplete, calculateArea]);

  // Reset boundary
  const resetBoundary = useCallback(() => {
    setPoints([]);
    toast({
      title: "Boundary Reset",
      description: "All boundary points cleared",
    });
  }, [toast]);

  // Complete boundary manually
  const completeBoundary = useCallback(() => {
    if (points.length < minPoints) {
      toast({
        title: "Insufficient Points",
        description: `Need at least ${minPoints} points to complete boundary`,
        variant: "destructive"
      });
      return;
    }

    const area = calculateArea(points);
    onBoundaryComplete(points, area);
    
    toast({
      title: "Boundary Completed",
      description: `Farm boundary with ${points.length} points covering ${area} hectares`,
    });
  }, [points, minPoints, calculateArea, onBoundaryComplete, toast]);

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.log('Using default location');
      },
      { timeout: 5000, enableHighAccuracy: true }
    );
  }, []);

  // Initialize satellite map
  useEffect(() => {
    if (!mapRef.current) return;

    const createSatelliteMap = () => {
      const satelliteUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/131072/131072`;
      
      if (mapRef.current) {
        mapRef.current.innerHTML = `
        <div style="
          position: relative;
          width: 100%;
          height: 400px;
          background-image: url('${satelliteUrl}');
          background-size: cover;
          background-position: center;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: crosshair;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(0,100,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,100,0,0.1) 75%),
                        linear-gradient(45deg, rgba(0,100,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,100,0,0.1) 75%);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            pointer-events: none;
            opacity: 0.3;
          "></div>
          <canvas 
            id="boundary-canvas" 
            width="800" 
            height="400" 
            style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 10;
            "
          ></canvas>
        </div>
      `;

      setIsMapReady(true);
      setSatelliteLoaded(true);
    };

    createSatelliteMap();
  }, [mapCenter]);

  // Set up canvas reference when map is ready
  useEffect(() => {
    if (isMapReady && mapRef.current) {
      const canvas = mapRef.current.querySelector('#boundary-canvas') as HTMLCanvasElement;
      if (canvas) {
        // Safely assign canvas reference
        if (canvasRef) {
          (canvasRef as any).current = canvas;
        }
      }
    }
  }, [isMapReady]);

  // Redraw canvas whenever points change
  useEffect(() => {
    redrawCanvas();
  }, [points, redrawCanvas]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Create Farm Boundary</h3>
          <p className="text-sm text-gray-600">
            Click on the satellite map to add boundary points. Points will connect automatically.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetBoundary} disabled={points.length === 0}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={completeBoundary}
            disabled={points.length < minPoints}
          >
            <Check className="w-4 h-4 mr-2" />
            Complete ({points.length}/{minPoints})
          </Button>
        </div>
      </div>

      <div className="bg-white border rounded-lg">
        <div className="p-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">High-Resolution Satellite Imagery</span>
              {satelliteLoaded && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Active
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </div>
          </div>
        </div>

        <div ref={mapRef} onClick={handleMapClick} />

        {points.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <div className="text-sm">
              <span className="font-medium">Points Added: {points.length}</span>
              {points.length >= minPoints && (
                <span className="ml-3 text-green-600">
                  Area: {calculateArea(points)} hectares
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}