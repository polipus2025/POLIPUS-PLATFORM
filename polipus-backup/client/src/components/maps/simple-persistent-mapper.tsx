import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check, Satellite } from "lucide-react";
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

interface SimplePersistentMapperProps {
  onBoundaryComplete: (points: BoundaryPoint[], area: number) => void;
  minPoints?: number;
  maxPoints?: number;
}

export default function SimplePersistentMapper({
  onBoundaryComplete,
  minPoints = 3,
  maxPoints = 20
}: SimplePersistentMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [mapCenter] = useState({ lat: 6.4281, lng: -9.4295 });
  const { toast } = useToast();

  const calculateArea = (boundaryPoints: BoundaryPoint[]) => {
    if (boundaryPoints.length < 3) return 0;
    
    // Use same geodesic calculation as main mapping component
    let area = 0;
    const earthRadius = 6371000; // Earth radius in meters
    
    // Use spherical excess formula for accurate GPS coordinate area calculation
    for (let i = 0; i < boundaryPoints.length; i++) {
      const j = (i + 1) % boundaryPoints.length;
      
      // Convert degrees to radians
      const lat1 = boundaryPoints[i].latitude * Math.PI / 180;
      const lng1 = boundaryPoints[i].longitude * Math.PI / 180;
      const lat2 = boundaryPoints[j].latitude * Math.PI / 180;
      const lng2 = boundaryPoints[j].longitude * Math.PI / 180;
      
      // Calculate using geodesic area formula (accounts for Earth's curvature)
      const deltaLng = lng2 - lng1;
      area += deltaLng * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    
    // Convert to square meters, then to hectares
    area = Math.abs(area) * earthRadius * earthRadius / 2;
    return parseFloat((area / 10000).toFixed(2)); // Convert square meters to hectares
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (points.length >= maxPoints) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const degreeRange = 0.002;
    const lat = mapCenter.lat + (degreeRange / 2) - (pixelY / rect.height) * degreeRange;
    const lng = mapCenter.lng - (degreeRange / 2) + (pixelX / rect.width) * degreeRange;

    const newPoint: BoundaryPoint = {
      id: `boundary-${Date.now()}`,
      latitude: lat,
      longitude: lng,
      accuracy: 1.5,
      timestamp: new Date(),
      pixelX,
      pixelY
    };

    const updated = [...points, newPoint];
    setPoints(updated);

    toast({
      title: "Boundary Point Added",
      description: `Point ${updated.length} added at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });

    if (updated.length >= maxPoints) {
      const area = calculateArea(updated);
      onBoundaryComplete(updated, area);
    }
  };

  const resetBoundary = () => {
    setPoints([]);
    toast({
      title: "Boundary Reset",
      description: "All boundary points cleared",
    });
  };

  const completeBoundary = () => {
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
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Create Farm Boundary</h3>
          <p className="text-sm text-gray-600">Click on the map to add boundary points</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetBoundary} disabled={points.length === 0}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={completeBoundary} disabled={points.length < minPoints}>
            <Check className="w-4 h-4 mr-2" />
            Complete ({points.length}/{minPoints})
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="p-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Satellite Mapping</span>
            </div>
            <span className="text-xs text-gray-500">
              {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </span>
          </div>
        </div>

        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="relative w-full h-96 bg-gradient-to-br from-green-200 to-green-400 cursor-crosshair"
          style={{
            backgroundImage: 'url(https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/18/131072/131072)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {points.map((point, index) => (
            <div
              key={point.id}
              className="absolute w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${point.pixelX}px`,
                top: `${point.pixelY}px`,
                backgroundColor: index === 0 ? '#22c55e' : index === points.length - 1 && points.length >= minPoints ? '#ef4444' : '#3b82f6'
              }}
            >
              {index + 1}
            </div>
          ))}

          {points.length > 1 && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <polyline
                points={points.map(p => `${p.pixelX},${p.pixelY}`).join(' ')}
                fill={points.length >= minPoints ? 'rgba(34, 197, 94, 0.2)' : 'none'}
                stroke="#22c55e"
                strokeWidth="3"
                className={points.length >= minPoints ? 'opacity-100' : 'opacity-70'}
              />
              {points.length >= minPoints && (
                <line
                  x1={points[points.length - 1].pixelX}
                  y1={points[points.length - 1].pixelY}
                  x2={points[0].pixelX}
                  y2={points[0].pixelY}
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                />
              )}
            </svg>
          )}
        </div>

        {points.length > 0 && (
          <div className="p-3 bg-gray-50 border-t">
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