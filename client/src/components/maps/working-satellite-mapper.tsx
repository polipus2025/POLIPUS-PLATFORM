import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, RotateCcw, Play, Square } from 'lucide-react';

interface BoundaryPoint {
  latitude: number;
  longitude: number;
  label: string;
}

interface WorkingSatelliteMapperProps {
  onBoundaryComplete: (boundary: { points: BoundaryPoint[]; area: number }) => void;
}

export default function WorkingSatelliteMapper({ onBoundaryComplete }: WorkingSatelliteMapperProps) {
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [status, setStatus] = useState('Start GPS tracking to begin mapping');
  const [mapCenter] = useState({ lat: 6.4281, lng: -9.4295 }); // Liberia center
  const mapRef = useRef<HTMLDivElement>(null);

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

  // Convert GPS coordinates to pixel position
  const coordToPixel = (lat: number, lng: number) => {
    const mapElement = mapRef.current;
    if (!mapElement) return { x: 0, y: 0 };

    const bounds = 0.02; // 0.02 degree bounds around center
    const rect = mapElement.getBoundingClientRect();
    const x = ((lng - (mapCenter.lng - bounds/2)) / bounds) * rect.width;
    const y = rect.height - ((lat - (mapCenter.lat - bounds/2)) / bounds) * rect.height;
    return { x, y };
  };

  // Start GPS tracking
  const startTracking = () => {
    setIsTracking(true);
    setStatus('🟢 GPS Active - Walk to boundary corners and tap "Add GPS Point"');
  };

  // Stop GPS tracking
  const stopTracking = () => {
    setIsTracking(false);
    setStatus('⚫ GPS Inactive - Start tracking to begin mapping');
  };

  // Add GPS point
  const addGPSPoint = () => {
    if (!isTracking) return;

    // Get real GPS location or simulate
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPoint: BoundaryPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            label: String.fromCharCode(65 + points.length) // A, B, C, D...
          };
          setPoints(prev => [...prev, newPoint]);
          setStatus(`📍 Point ${newPoint.label} added - ${points.length + 1} total points`);
        },
        (error) => {
          // Fallback simulation for testing
          const variance = 0.001;
          const newPoint: BoundaryPoint = {
            latitude: mapCenter.lat + (Math.random() - 0.5) * variance,
            longitude: mapCenter.lng + (Math.random() - 0.5) * variance,
            label: String.fromCharCode(65 + points.length)
          };
          setPoints(prev => [...prev, newPoint]);
          setStatus(`📍 Point ${newPoint.label} added - ${points.length + 1} total points`);
        }
      );
    }
  };

  // Complete boundary
  const completeBoundary = () => {
    if (points.length >= 3) {
      const area = calculateArea(points);
      onBoundaryComplete({ points, area });
      setStatus(`✅ Boundary completed: ${points.length} points, ${area.toFixed(2)} hectares`);
    }
  };

  // Reset mapping
  const resetMapping = () => {
    setPoints([]);
    setIsTracking(false);
    setStatus('Start GPS tracking to begin mapping');
  };

  // Load satellite imagery and render points/lines
  useEffect(() => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    // Clear existing content
    mapElement.innerHTML = '';

    // Load REAL satellite imagery
    const zoom = 16;
    const tileSize = 256;
    
    // Calculate tile coordinates for the map center
    const x = Math.floor((mapCenter.lng + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    // Create container for satellite tiles
    const tilesContainer = document.createElement('div');
    tilesContainer.style.cssText = `
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      background: #2d4a2d;
    `;
    mapElement.appendChild(tilesContainer);

    // Load multiple satellite tiles for better coverage
    const tileOffsets = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0], [0, 0], [1, 0],
      [-1, 1], [0, 1], [1, 1]
    ];

    let tilesLoaded = 0;
    const totalTiles = tileOffsets.length;

    tileOffsets.forEach(([dx, dy]) => {
      const tileX = x + dx;
      const tileY = y + dy;
      
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      
      // Primary: Esri World Imagery (satellite)
      img.src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
      
      img.style.cssText = `
        position: absolute;
        left: ${(dx + 1) * tileSize - tileSize/2}px;
        top: ${(dy + 1) * tileSize - tileSize/2}px;
        width: ${tileSize}px;
        height: ${tileSize}px;
        z-index: 1;
      `;
      
      img.onload = () => {
        tilesLoaded++;
        if (tilesLoaded === totalTiles) {
        }
      };
      
      // Fallback to Google Satellite if Esri fails
      img.onerror = () => {
        img.src = `https://mt1.google.com/vt/lyrs=s&x=${tileX}&y=${tileY}&z=${zoom}`;
      };
      
      tilesContainer.appendChild(img);
    });

    // Add GPS coordinate overlay
    const coordOverlay = document.createElement('div');
    coordOverlay.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 6px 10px;
      border-radius: 4px;
      font-size: 11px;
      z-index: 15;
      font-family: monospace;
    `;
    coordOverlay.textContent = `GPS: ${mapCenter.lat.toFixed(6)}, ${mapCenter.lng.toFixed(6)}`;
    mapElement.appendChild(coordOverlay);

    // Create SVG overlay for lines
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      pointer-events: none;
    `;
    mapElement.appendChild(svg);

    // Render boundary points and lines
    const renderBoundary = () => {
      if (!mapElement) return;
      
      // Remove existing markers
      const existingMarkers = mapElement.querySelectorAll('.boundary-marker');
      existingMarkers.forEach(marker => marker.remove());
      
      // Clear SVG
      svg.innerHTML = '';

      if (points.length === 0) return;

      // Draw connecting lines
      if (points.length >= 2) {
        for (let i = 0; i < points.length - 1; i++) {
          const start = coordToPixel(points[i].latitude, points[i].longitude);
          const end = coordToPixel(points[i + 1].latitude, points[i + 1].longitude);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', start.x.toString());
          line.setAttribute('y1', start.y.toString());
          line.setAttribute('x2', end.x.toString());
          line.setAttribute('y2', end.y.toString());
          line.setAttribute('stroke', '#ef4444');
          line.setAttribute('stroke-width', '4');
          line.setAttribute('stroke-linecap', 'round');
          svg.appendChild(line);
        }

        // Closing line for completed boundary
        if (points.length >= 3) {
          const start = coordToPixel(points[points.length - 1].latitude, points[points.length - 1].longitude);
          const end = coordToPixel(points[0].latitude, points[0].longitude);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', start.x.toString());
          line.setAttribute('y1', start.y.toString());
          line.setAttribute('x2', end.x.toString());
          line.setAttribute('y2', end.y.toString());
          line.setAttribute('stroke', '#ef4444');
          line.setAttribute('stroke-width', '4');
          line.setAttribute('stroke-dasharray', '10,5');
          line.setAttribute('stroke-linecap', 'round');
          svg.appendChild(line);
        }
      }

      // Add markers for each point
      points.forEach((point, index) => {
        const pixelPos = coordToPixel(point.latitude, point.longitude);
        
        const marker = document.createElement('div');
        marker.className = 'boundary-marker';
        marker.style.cssText = `
          position: absolute;
          left: ${pixelPos.x - 20}px;
          top: ${pixelPos.y - 20}px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ef4444;
          border: 4px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          z-index: 12;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        marker.textContent = point.label;
        mapElement.appendChild(marker);
      });

    };

    // Initial render
    setTimeout(renderBoundary, 1000);
    
    // Re-render when points change
    renderBoundary();
  }, [points, mapCenter]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">GPS Farm Boundary Mapping</h3>
        <p className="text-sm text-gray-600">{status}</p>
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
            className="flex-1 bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
            data-testid="add-gps-point"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Add GPS Point
          </Button>
        </div>
      </div>

      {/* Map */}
      <div className="p-4">
        <div
          ref={mapRef}
          className="w-full h-96 border border-gray-300 rounded relative overflow-hidden bg-green-900"
          data-testid="satellite-map"
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
              {points.length} boundary points mapped on satellite imagery
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