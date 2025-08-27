import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check, Download } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface SimpleRealTimeMapperProps {
  onBoundaryComplete: (data: { points: BoundaryPoint[]; area: number }) => void;
}

export default function SimpleRealTimeMapper({ onBoundaryComplete }: SimpleRealTimeMapperProps) {
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize the map canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Draw terrain background
    drawTerrain(ctx);
    setMapReady(true);
  }, []);

  // Redraw map when points change
  useEffect(() => {
    if (!canvasRef.current || !mapReady) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTerrain(ctx);
    drawPoints(ctx);
    drawBoundary(ctx);
  }, [points, mapReady]);

  const drawTerrain = (ctx: CanvasRenderingContext2D) => {
    // Create terrain background
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#22c55e');
    gradient.addColorStop(0.5, '#16a34a');
    gradient.addColorStop(1, '#15803d');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Add terrain texture
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 600;
      const y = Math.random() * 400;
      const radius = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 600; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }
    for (let y = 0; y <= 400; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }
  };

  const drawPoints = (ctx: CanvasRenderingContext2D) => {
    points.forEach((point, index) => {
      // Convert lat/lng to canvas coordinates
      const x = ((point.longitude + 9.4295) + 0.1) * 3000;
      const y = 400 - ((point.latitude - 6.4281) + 0.1) * 3000;

      // Draw marker circle
      ctx.fillStyle = index === 0 ? '#22c55e' : index === points.length - 1 && points.length > 1 ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw white border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw alphabetical label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String.fromCharCode(65 + index), x, y);

      // Draw point info
      ctx.fillStyle = '#000000';
      ctx.font = '10px Arial';
      ctx.fillText(`${String.fromCharCode(65 + index)}`, x, y + 20);
    });
  };

  const drawBoundary = (ctx: CanvasRenderingContext2D) => {
    if (points.length < 2) return;

    // Draw connecting lines
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();

    points.forEach((point, index) => {
      const x = ((point.longitude + 9.4295) + 0.1) * 3000;
      const y = 400 - ((point.latitude - 6.4281) + 0.1) * 3000;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    // Close the polygon if we have 3+ points
    if (points.length >= 3) {
      ctx.closePath();
      
      // Fill the area
      ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
      ctx.fill();

      // Calculate and display area
      const area = calculateArea(points);
      const centerX = points.reduce((sum, p) => sum + ((p.longitude + 9.4295) + 0.1) * 3000, 0) / points.length;
      const centerY = points.reduce((sum, p) => sum + (400 - ((p.latitude - 6.4281) + 0.1) * 3000), 0) / points.length;
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${area.toFixed(1)} Ha`, centerX, centerY);
    }

    ctx.stroke();
    ctx.setLineDash([]);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert canvas coordinates to lat/lng
    const lng = (x / 3000) - 9.4295 - 0.1;
    const lat = ((400 - y) / 3000) + 6.4281 + 0.1;

    const newPoint: BoundaryPoint = { latitude: lat, longitude: lng };
    setPoints(prev => [...prev, newPoint]);
  };

  const calculateArea = (boundary: BoundaryPoint[]): number => {
    if (boundary.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < boundary.length; i++) {
      const j = (i + 1) % boundary.length;
      area += boundary[i].longitude * boundary[j].latitude;
      area -= boundary[j].longitude * boundary[i].latitude;
    }
    return Math.abs(area) * 6378137 * 6378137 * Math.cos(Math.PI * boundary[0].latitude / 180) / 2 / 10000;
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const completeBoundary = () => {
    if (points.length >= 3) {
      const area = calculateArea(points);
      onBoundaryComplete({ points, area });
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Real-Time GPS Mapping</h3>
        <div className="flex gap-2">
          <Button onClick={clearPoints} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button 
            onClick={completeBoundary} 
            disabled={points.length < 3}
            size="sm"
          >
            <Check className="w-4 h-4 mr-1" />
            Complete ({points.length} points)
          </Button>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="cursor-crosshair w-full h-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Instructions:</strong> Click on the map to mark boundary points while walking your farm perimeter</p>
        <p><strong>Points:</strong> {points.length} marked {points.length >= 3 && `• Area: ${calculateArea(points).toFixed(1)} hectares`}</p>
        <p><strong>Status:</strong> {points.length === 0 ? 'Click to start mapping' : points.length < 3 ? 'Need at least 3 points for boundary' : 'Boundary ready - click Complete'}</p>
      </div>
    </div>
  );
}