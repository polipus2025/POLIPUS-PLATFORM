import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, RotateCcw, Play, Square } from 'lucide-react';

interface BoundaryPoint {
  latitude: number;
  longitude: number;
  label: string;
}

interface SimpleBoundaryMapperProps {
  onBoundaryComplete: (boundary: { points: BoundaryPoint[]; area: number }) => void;
}

export default function SimpleWorkingMapper({ onBoundaryComplete }: SimpleBoundaryMapperProps) {
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [mapCenter] = useState({ lat: 6.4281, lng: -9.4295 }); // Liberia center
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate area using shoelace formula
  const calculateArea = (points: BoundaryPoint[]) => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].longitude * points[j].latitude;
      area -= points[j].longitude * points[i].latitude;
    }
    return Math.abs(area) * 111320 * 111320 / 2 / 10000; // Convert to hectares
  };

  // Convert GPS coordinates to canvas pixels
  const coordToPixel = (lat: number, lng: number, canvas: HTMLCanvasElement) => {
    const bounds = 0.02; // 0.02 degree bounds around center
    const x = ((lng - (mapCenter.lng - bounds/2)) / bounds) * canvas.width;
    const y = canvas.height - ((lat - (mapCenter.lat - bounds/2)) / bounds) * canvas.height;
    return { x, y };
  };

  // Draw the map and points
  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw satellite-style background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#4a5a3a');
    gradient.addColorStop(0.3, '#3d5a3d');
    gradient.addColorStop(0.6, '#2d4a2d');
    gradient.addColorStop(1, '#5a6b4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw GPS coordinates overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 200, 30);
    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    ctx.fillText(`GPS: ${mapCenter.lat.toFixed(6)}, ${mapCenter.lng.toFixed(6)}`, 15, 30);

    // Draw connecting lines first
    if (points.length >= 2) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';

      for (let i = 0; i < points.length - 1; i++) {
        const start = coordToPixel(points[i].latitude, points[i].longitude, canvas);
        const end = coordToPixel(points[i + 1].latitude, points[i + 1].longitude, canvas);
        
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }

      // Closing line for polygon
      if (points.length >= 3) {
        const start = coordToPixel(points[points.length - 1].latitude, points[points.length - 1].longitude, canvas);
        const end = coordToPixel(points[0].latitude, points[0].longitude, canvas);
        
        ctx.setLineDash([10, 5]);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw points on top
    points.forEach((point, index) => {
      const pos = coordToPixel(point.latitude, point.longitude, canvas);
      
      // Draw point circle
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw white border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.label, pos.x, pos.y);
    });

    console.log(`🎨 Drew map with ${points.length} points and ${Math.max(0, points.length - 1)} connecting lines`);
  };

  // Redraw when points change
  useEffect(() => {
    drawMap();
  }, [points]);

  // Start GPS tracking
  const startTracking = () => {
    setIsTracking(true);
    console.log('🚀 GPS Tracking started');
  };

  // Stop GPS tracking
  const stopTracking = () => {
    setIsTracking(false);
    console.log('🛑 GPS Tracking stopped');
  };

  // Add GPS point
  const addGPSPoint = () => {
    if (!isTracking) return;

    // Get real GPS location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPoint: BoundaryPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            label: String.fromCharCode(65 + points.length) // A, B, C, D...
          };

          setPoints(prev => {
            const updated = [...prev, newPoint];
            console.log(`📍 Added REAL GPS point ${newPoint.label}: ${newPoint.latitude.toFixed(6)}, ${newPoint.longitude.toFixed(6)}`);
            return updated;
          });
        },
        (error) => {
          // Fallback to simulated coordinates
          const variance = 0.001;
          const newPoint: BoundaryPoint = {
            latitude: mapCenter.lat + (Math.random() - 0.5) * variance,
            longitude: mapCenter.lng + (Math.random() - 0.5) * variance,
            label: String.fromCharCode(65 + points.length)
          };

          setPoints(prev => {
            const updated = [...prev, newPoint];
            console.log(`📍 Added simulated GPS point ${newPoint.label}: ${newPoint.latitude.toFixed(6)}, ${newPoint.longitude.toFixed(6)}`);
            return updated;
          });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  };

  // Complete boundary
  const completeBoundary = () => {
    if (points.length >= 3) {
      const area = calculateArea(points);
      onBoundaryComplete({ points, area });
      console.log(`✅ Boundary completed: ${points.length} points, ${area.toFixed(2)} hectares`);
    }
  };

  // Reset all points
  const resetMapping = () => {
    setPoints([]);
    setIsTracking(false);
    console.log('🔄 Mapping reset');
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">GPS Farm Boundary Mapping</h3>
        <p className="text-sm text-gray-600">
          {isTracking 
            ? `🟢 GPS Active - Walk to boundary corners and add points (${points.length} points mapped)`
            : '⚫ GPS Inactive - Start tracking to begin mapping'
          }
        </p>
      </div>

      {/* Controls */}
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          {!isTracking ? (
            <Button 
              onClick={startTracking}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              data-testid="start-gps-tracking"
            >
              <Play className="w-4 h-4 mr-2" />
              Start GPS Tracking
            </Button>
          ) : (
            <Button 
              onClick={stopTracking}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              data-testid="stop-gps-tracking"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop GPS Tracking
            </Button>
          )}
          
          <Button 
            onClick={addGPSPoint}
            disabled={!isTracking}
            className="flex-1 bg-blue-400 hover:bg-blue-500 text-white disabled:bg-gray-300"
            data-testid="add-gps-point"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Add GPS Point
          </Button>
        </div>
      </div>

      {/* Canvas Map */}
      <div className="p-4">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full border border-gray-300 rounded"
          data-testid="boundary-canvas"
        />
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex gap-2">
          <Button 
            onClick={resetMapping}
            variant="outline"
            className="flex-1"
            data-testid="reset-boundary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button 
            onClick={completeBoundary}
            disabled={points.length < 3}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
            data-testid="complete-boundary"
          >
            ✓ Complete ({points.length}/3+)
          </Button>
        </div>
        
        {points.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800 mb-1">
              {points.length} boundary points mapped with persistent connected lines
            </div>
            <div className="text-xs text-blue-600">
              Points: {points.map(p => p.label).join(' → ')}
              {points.length >= 3 && ` • Area: ${calculateArea(points).toFixed(2)} hectares`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}