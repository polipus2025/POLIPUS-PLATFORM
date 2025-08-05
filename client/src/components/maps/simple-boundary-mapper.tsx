import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area: number;
}

interface SimpleBoundaryMapperProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  minPoints?: number;
}

export default function SimpleBoundaryMapper({ 
  onBoundaryComplete, 
  minPoints = 3 
}: SimpleBoundaryMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Initializing map...');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      setStatus('Loading map...');
      
      // Create map content using innerHTML with real satellite imagery
      mapRef.current!.innerHTML = `
        <style>
          .simple-map { 
            height: 400px; 
            width: 100%;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            position: relative;
            background: url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3977/4113') center/cover;
            cursor: crosshair;
            overflow: hidden;
          }
          .map-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
            pointer-events: none;
          }
          .map-marker {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            transform: translate(-50%, -50%);
            z-index: 10;
          }
          .marker-start { background-color: #22c55e; }
          .marker-middle { background-color: #3b82f6; }
          .marker-end { background-color: #ef4444; }
          .map-polygon {
            position: absolute;
            pointer-events: none;
            fill: rgba(59, 130, 246, 0.2);
            stroke: #3b82f6;
            stroke-width: 2;
            z-index: 5;
          }
          .map-line {
            position: absolute;
            height: 2px;
            background-color: #3b82f6;
            transform-origin: left center;
            z-index: 5;
          }
        </style>
        <div class="simple-map" id="simple-map">
          <div class="map-overlay"></div>
          <svg class="map-polygon" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          </svg>
        </div>
      `;

      const mapElement = mapRef.current!.querySelector('#simple-map') as HTMLElement;
      if (!mapElement) return;

      // Add click handler
      mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert pixel coordinates to lat/lng (simplified)
        const lat = 6.4281 + (y - 200) / 10000; // Rough conversion around Monrovia
        const lng = -9.4295 + (x - 200) / 10000;
        
        const newPoint: BoundaryPoint = { latitude: lat, longitude: lng };
        setPoints(prev => [...prev, newPoint]);
      });

      setStatus('Map ready - Click to add boundary points');
      setMapReady(true);
    };

    // Initialize immediately
    initMap();
  }, []);

  // Update visual markers when points change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const mapElement = mapRef.current.querySelector('#simple-map') as HTMLElement;
    const svg = mapRef.current.querySelector('svg') as SVGElement;
    
    if (!mapElement || !svg) return;

    // Clear existing markers
    mapElement.querySelectorAll('.map-marker').forEach(marker => marker.remove());
    svg.innerHTML = '';

    // Add markers for each point
    points.forEach((point, index) => {
      const isFirst = index === 0;
      const isLast = index === points.length - 1 && points.length > 1;
      
      // Convert lat/lng back to pixels (simplified)
      const x = (point.longitude + 9.4295) * 10000 + 200;
      const y = (point.latitude - 6.4281) * 10000 + 200;
      
      const marker = document.createElement('div');
      marker.className = `map-marker ${isFirst ? 'marker-start' : isLast ? 'marker-end' : 'marker-middle'}`;
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.title = `Point ${index + 1}${isFirst ? ' (Start)' : isLast ? ' (End)' : ''}`;
      
      mapElement.appendChild(marker);
    });

    // Draw polygon if we have enough points
    if (points.length >= 3) {
      const pathData = points.map((point, index) => {
        const x = (point.longitude + 9.4295) * 10000 + 200;
        const y = (point.latitude - 6.4281) * 10000 + 200;
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ') + ' Z';
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const pointsStr = points.map(point => {
        const x = (point.longitude + 9.4295) * 10000 + 200;
        const y = (point.latitude - 6.4281) * 10000 + 200;
        return `${x},${y}`;
      }).join(' ');
      
      polygon.setAttribute('points', pointsStr);
      polygon.setAttribute('fill', 'rgba(59, 130, 246, 0.2)');
      polygon.setAttribute('stroke', '#3b82f6');
      polygon.setAttribute('stroke-width', '2');
      
      svg.appendChild(polygon);
    }
  }, [points, mapReady]);

  const calculateArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    // Simple area calculation (approximate)
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2;
    return area * 12100; // Convert to hectares (rough approximation)
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Farm Boundary Mapping</h4>
        <p className="text-sm text-blue-800 mb-2">
          Click on the grid below to create farm boundary points. Need at least {minPoints} points to complete.
        </p>
        <div className="text-xs text-blue-700">
          • Green = Start point • Blue = Middle points • Red = End point
        </div>
      </div>

      {/* Status and Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Status: {status}</span>
          <div className="text-gray-600">
            Points: {points.length} | {area > 0 && `Area: ~${area.toFixed(2)} hectares`}
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
    </div>
  );
}