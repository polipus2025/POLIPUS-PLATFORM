import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check, Map } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area: number;
}

interface WorkingMapBoundaryProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  minPoints?: number;
}

export default function WorkingMapBoundary({ 
  onBoundaryComplete, 
  minPoints = 3 
}: WorkingMapBoundaryProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Initializing map...');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const createWorkingMap = () => {
      // Create a self-contained map that doesn't depend on external services
      mapRef.current!.innerHTML = `
        <div id="working-map-container" style="
          height: 400px; 
          width: 100%;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          position: relative;
          background: linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%);
          cursor: crosshair;
          overflow: hidden;
          font-family: Arial, sans-serif;
        ">
          <!-- Terrain Features -->
          <div style="
            position: absolute;
            top: 20%;
            left: 10%;
            width: 15%;
            height: 25%;
            background: radial-gradient(ellipse, #22c55e, #16a34a);
            border-radius: 50%;
            opacity: 0.7;
          "></div>
          <div style="
            position: absolute;
            top: 60%;
            left: 70%;
            width: 20%;
            height: 15%;
            background: radial-gradient(ellipse, #3b82f6, #1d4ed8);
            border-radius: 50%;
            opacity: 0.6;
          "></div>
          <div style="
            position: absolute;
            top: 10%;
            right: 15%;
            width: 25%;
            height: 20%;
            background: linear-gradient(45deg, #84cc16, #65a30d);
            border-radius: 30%;
            opacity: 0.5;
          "></div>
          
          <!-- Roads -->
          <div style="
            position: absolute;
            top: 0;
            left: 40%;
            width: 3px;
            height: 100%;
            background: #6b7280;
            opacity: 0.8;
          "></div>
          <div style="
            position: absolute;
            top: 30%;
            left: 0;
            width: 100%;
            height: 2px;
            background: #6b7280;
            opacity: 0.8;
          "></div>
          
          <!-- Reference Grid -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 25px 25px;
            pointer-events: none;
          "></div>
          
          <!-- Coordinate Labels -->
          <div style="
            position: absolute;
            top: 5px;
            left: 5px;
            color: white;
            font-size: 10px;
            background: rgba(0,0,0,0.5);
            padding: 2px 4px;
            border-radius: 3px;
          ">6.45°N, -9.40°W</div>
          <div style="
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: white;
            font-size: 10px;
            background: rgba(0,0,0,0.5);
            padding: 2px 4px;
            border-radius: 3px;
          ">6.40°N, -9.35°W</div>
          
          <!-- SVG for polygons -->
          <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;" id="polygon-svg">
          </svg>
        </div>
        
        <style>
          .map-marker {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            z-index: 20;
            transition: all 0.2s ease;
          }
          .map-marker:hover {
            transform: translate(-50%, -50%) scale(1.2);
          }
          .marker-start { 
            background: #fbbf24;
            box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.3), 0 2px 8px rgba(0,0,0,0.5);
          }
          .marker-middle { 
            background: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.5);
          }
          .marker-end { 
            background: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3), 0 2px 8px rgba(0,0,0,0.5);
          }
        </style>
      `;

      const mapContainer = mapRef.current!.querySelector('#working-map-container') as HTMLElement;
      if (!mapContainer) return;

      // Add click handler
      mapContainer.addEventListener('click', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert pixel coordinates to realistic GPS coordinates for Monrovia area
        const lat = 6.45 - (y / rect.height) * 0.05; // Range: 6.45 to 6.40
        const lng = -9.40 + (x / rect.width) * 0.05; // Range: -9.40 to -9.35
        
        const newPoint: BoundaryPoint = { 
          latitude: parseFloat(lat.toFixed(6)), 
          longitude: parseFloat(lng.toFixed(6)) 
        };
        setPoints(prev => [...prev, newPoint]);
      });

      setStatus('Interactive map ready - Click to mark farm boundaries');
      setMapReady(true);
    };

    createWorkingMap();
  }, []);

  // Update visual markers and polygons when points change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const mapContainer = mapRef.current.querySelector('#working-map-container') as HTMLElement;
    const svg = mapRef.current.querySelector('#polygon-svg') as SVGElement;
    
    if (!mapContainer || !svg) return;

    // Clear existing markers
    mapContainer.querySelectorAll('.map-marker').forEach(marker => marker.remove());
    svg.innerHTML = '';

    // Add markers for each point
    points.forEach((point, index) => {
      const isFirst = index === 0;
      const isLast = index === points.length - 1 && points.length > 1;
      
      // Convert GPS coordinates back to pixels
      const rect = mapContainer.getBoundingClientRect();
      const x = ((point.longitude + 9.40) / 0.05) * (rect.width || 400);
      const y = ((6.45 - point.latitude) / 0.05) * (rect.height || 400);
      
      const marker = document.createElement('div');
      marker.className = `map-marker ${isFirst ? 'marker-start' : isLast ? 'marker-end' : 'marker-middle'}`;
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.title = `Point ${index + 1}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}${isFirst ? ' (Start)' : isLast ? ' (End)' : ''}`;
      
      mapContainer.appendChild(marker);
    });

    // Draw polygon if we have enough points
    if (points.length >= 3) {
      const rect = mapContainer.getBoundingClientRect();
      const pointsStr = points.map(point => {
        const x = ((point.longitude + 9.40) / 0.05) * (rect.width || 400);
        const y = ((6.45 - point.latitude) / 0.05) * (rect.height || 400);
        return `${x},${y}`;
      }).join(' ');
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pointsStr);
      polygon.setAttribute('fill', 'rgba(251, 191, 36, 0.25)');
      polygon.setAttribute('stroke', '#fbbf24');
      polygon.setAttribute('stroke-width', '3');
      polygon.setAttribute('stroke-dasharray', '5,5');
      
      svg.appendChild(polygon);
    }

    // Draw lines between consecutive points
    if (points.length >= 2) {
      points.forEach((point, index) => {
        if (index < points.length - 1) {
          const nextPoint = points[index + 1];
          const rect = mapContainer.getBoundingClientRect();
          
          const x1 = ((point.longitude + 9.40) / 0.05) * (rect.width || 400);
          const y1 = ((6.45 - point.latitude) / 0.05) * (rect.height || 400);
          const x2 = ((nextPoint.longitude + 9.40) / 0.05) * (rect.width || 400);
          const y2 = ((6.45 - nextPoint.latitude) / 0.05) * (rect.height || 400);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', x1.toString());
          line.setAttribute('y1', y1.toString());
          line.setAttribute('x2', x2.toString());
          line.setAttribute('y2', y2.toString());
          line.setAttribute('stroke', '#3b82f6');
          line.setAttribute('stroke-width', '2');
          line.setAttribute('stroke-dasharray', '3,3');
          
          svg.appendChild(line);
        }
      });
    }
  }, [points, mapReady]);

  const calculateArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    // Use proper geographic area calculation
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += (points[j].longitude - points[i].longitude) * (points[j].latitude + points[i].latitude);
    }
    area = Math.abs(area) / 2;
    
    // Convert to hectares (approximate for small areas)
    const hectares = area * 111320 * 111320 / 10000; // m² to hectares
    return hectares;
  };

  const handleReset = () => {
    setPoints([]);
  };

  const handleComplete = () => {
    if (points.length >= minPoints) {
      const area = calculateArea(points);
      onBoundaryComplete({ points, area });
    }
  };

  const canComplete = points.length >= minPoints;
  const area = calculateArea(points);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Map className="h-5 w-5 text-green-600" />
          <h4 className="font-medium text-green-900">Interactive Farm Boundary Mapping</h4>
        </div>
        <p className="text-sm text-green-800 mb-2">
          Click on the map below to mark your farm boundaries. The map shows terrain features, roads, and GPS coordinates for the Monrovia area.
        </p>
        <div className="text-xs text-green-700">
          • Yellow = Start point • Blue = Middle points • Red = End point
          <br />• Green areas = Vegetation • Blue areas = Water bodies • Gray lines = Roads
        </div>
      </div>

      {/* Status and Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Status: {status}</span>
          <div className="text-gray-600">
            Points: {points.length} | {area > 0 && `Area: ~${area.toFixed(3)} hectares`}
            {points.length > 0 && (
              <div className="text-xs mt-1">
                Last point: {points[points.length - 1]?.latitude.toFixed(6)}, {points[points.length - 1]?.longitude.toFixed(6)}
              </div>
            )}
          </div>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={points.length === 0}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Complete ({points.length}/{minPoints})
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} />
      
      {/* GPS Coordinates Display */}
      {points.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="font-medium text-blue-900 mb-2">GPS Coordinates</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {points.map((point, index) => (
              <div key={index} className="text-blue-800">
                Point {index + 1}: {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}