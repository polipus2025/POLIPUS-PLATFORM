import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Satellite, RotateCcw, Check, MapPin } from 'lucide-react';

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface TrulyPersistentMapperProps {
  onBoundaryComplete: (boundary: any) => void;
  minPoints?: number;
  maxPoints?: number;
  enableRealTimeGPS?: boolean;
}

export default function TrulyPersistentMapper({ 
  onBoundaryComplete, 
  minPoints = 3, 
  maxPoints = 20,
  enableRealTimeGPS = false 
}: TrulyPersistentMapperProps) {
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Loading satellite imagery...');
  const [mapCenter] = useState({ lat: 6.4281, lng: -9.4295 });
  const [mappingActive, setMappingActive] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<HTMLDivElement[]>([]);
  const linesRef = useRef<SVGLineElement[]>([]);

  // Calculate area using precise GPS coordinates
  const calculateArea = (mapPoints: BoundaryPoint[]) => {
    if (mapPoints.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < mapPoints.length; i++) {
      const j = (i + 1) % mapPoints.length;
      area += mapPoints[i].longitude * mapPoints[j].latitude;
      area -= mapPoints[j].longitude * mapPoints[i].latitude;
    }
    const areaInSquareMeters = Math.abs(area) * 111320 * 111320 / 2;
    return areaInSquareMeters / 10000; // Convert to hectares
  };

  // Convert GPS coordinates to pixel position
  const coordToPixel = (lat: number, lng: number) => {
    const pixelScale = 800;
    const x = (lng - mapCenter.lng) * pixelScale + 200;
    const y = 200 - (lat - mapCenter.lat) * pixelScale;
    return { x: Math.max(20, Math.min(380, x)), y: Math.max(20, Math.min(380, y)) };
  };

  // Convert pixel to GPS coordinates
  const pixelToCoord = (x: number, y: number) => {
    const coordScale = 0.00125;
    const lat = mapCenter.lat + (200 - y) * coordScale;
    const lng = mapCenter.lng + (x - 200) * coordScale;
    return { lat, lng };
  };

  // Initialize satellite map
  useEffect(() => {
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    const zoom = 14;
    const tileX = Math.floor((mapCenter.lng + 180) / 360 * Math.pow(2, zoom));
    const tileY = Math.floor((1 - Math.log(Math.tan(mapCenter.lat * Math.PI / 180) + 1 / Math.cos(mapCenter.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

    mapContainer.innerHTML = `
      <div style="
        position: relative;
        width: 100%;
        height: 400px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
        cursor: crosshair;
        background-image: 
          url('https://mt0.google.com/vt/lyrs=s&hl=en&x=${tileX}&y=${tileY}&z=${zoom}'),
          url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}'),
          url('https://tiles.stadiamaps.com/tiles/alidade_satellite/${zoom}/${tileX}/${tileY}@2x.png');
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-color: #10b981;
      " id="persistent-satellite-map">
        <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;" id="lines-svg">
        </svg>
      </div>
    `;

    const mapElement = mapContainer.querySelector('#persistent-satellite-map') as HTMLElement;
    
    // Add click handler
    mapElement.addEventListener('click', (e) => {
      if (!mappingActive) return;
      
      const rect = mapElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const coords = pixelToCoord(x, y);
      const newPoint: BoundaryPoint = { latitude: coords.lat, longitude: coords.lng };
      
      setPoints(prev => [...prev, newPoint]);
    });

    setStatus('Satellite imagery loaded - Click START MAPPING to begin');
  }, [mapCenter.lat, mapCenter.lng, enableRealTimeGPS]);

  // Add new point marker and update lines
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const mapElement = mapRef.current.querySelector('#persistent-satellite-map') as HTMLElement;
    const svg = mapRef.current.querySelector('#lines-svg') as SVGSVGElement;
    
    if (!mapElement || !svg) return;

    const currentMarkerCount = markersRef.current.length;
    const newPointsCount = points.length - currentMarkerCount;

    // Add ONLY new markers
    for (let i = currentMarkerCount; i < points.length; i++) {
      const point = points[i];
      const pixelPos = coordToPixel(point.latitude, point.longitude);
      
      const marker = document.createElement('div');
      marker.style.cssText = `
        position: absolute;
        left: ${pixelPos.x}px;
        top: ${pixelPos.y}px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        border: 4px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
        box-shadow: 0 8px 20px rgba(0,0,0,0.6);
        transform: translate(-50%, -50%);
        z-index: 20;
        pointer-events: none;
      `;
      
      const letter = String.fromCharCode(65 + i);
      marker.textContent = letter;
      marker.title = `Point ${letter}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;
      
      mapElement.appendChild(marker);
      markersRef.current.push(marker);
      
      console.log(`✅ PERSISTENT marker ${letter} added at ${pixelPos.x}, ${pixelPos.y}`);
    }

    // Clear existing lines and redraw all
    linesRef.current.forEach(line => line.remove());
    linesRef.current = [];

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
        line.setAttribute('stroke', '#22c55e');
        line.setAttribute('stroke-width', '6');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '1');
        
        svg.appendChild(line);
        linesRef.current.push(line);
        
        console.log(`🔗 Line ${String.fromCharCode(65 + i)} → ${String.fromCharCode(65 + i + 1)} drawn`);
      }
      
      // Closing line for polygon
      if (points.length >= 3) {
        const start = coordToPixel(points[points.length - 1].latitude, points[points.length - 1].longitude);
        const end = coordToPixel(points[0].latitude, points[0].longitude);
        
        const closingLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        closingLine.setAttribute('x1', start.x.toString());
        closingLine.setAttribute('y1', start.y.toString());
        closingLine.setAttribute('x2', end.x.toString());
        closingLine.setAttribute('y2', end.y.toString());
        closingLine.setAttribute('stroke', '#16a34a');
        closingLine.setAttribute('stroke-width', '6');
        closingLine.setAttribute('stroke-dasharray', '10,5');
        closingLine.setAttribute('opacity', '1');
        
        svg.appendChild(closingLine);
        linesRef.current.push(closingLine);
        
        console.log(`🔗 Closing line drawn`);
      }
    }

    // Update status
    if (points.length >= 3) {
      const area = calculateArea(points);
      setStatus(`🌍 ${points.length} points connected, ${area.toFixed(3)} hectares mapped`);
    } else if (points.length >= 2) {
      setStatus(`🔗 ${points.length} points connected - Add ${minPoints - points.length} more to complete`);
    } else {
      setStatus(`📍 ${points.length} point added - Click map to add more points`);
    }
  }, [points]);

  const startMapping = () => {
    setMappingActive(true);
    setStatus('Mapping ACTIVE! Click on satellite map to add boundary points');
  };

  const clearBoundary = () => {
    // Remove all markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Remove all lines
    linesRef.current.forEach(line => line.remove());
    linesRef.current = [];
    
    setPoints([]);
    setMappingActive(false);
    setStatus('Satellite imagery loaded - Click START MAPPING to begin');
  };

  const addGPSPoint = () => {
    if (!mappingActive) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPoint: BoundaryPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setPoints(prev => [...prev, newPoint]);
        },
        () => {
          setStatus('GPS failed - Check location permissions');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
      );
    }
  };

  const completeBoundary = () => {
    if (points.length >= minPoints) {
      const area = calculateArea(points);
      onBoundaryComplete({
        points,
        area,
        coordinates: points.map((p, i) => ({
          point: String.fromCharCode(65 + i),
          latitude: p.latitude,
          longitude: p.longitude
        }))
      });
      setStatus(`✅ BOUNDARY COMPLETED! ${points.length} points, ${area.toFixed(3)} hectares`);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={startMapping}
          disabled={mappingActive}
          className="bg-green-600 hover:bg-green-700"
          data-testid="button-start-mapping"
        >
          <Satellite className="w-4 h-4 mr-2" />
          {mappingActive ? 'MAPPING ACTIVE' : 'START MAPPING'}
        </Button>
        
        <Button
          onClick={addGPSPoint}
          disabled={!mappingActive}
          variant="outline"
          data-testid="button-add-gps-point"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add GPS Point
        </Button>
        
        <Button
          onClick={clearBoundary}
          variant="outline"
          data-testid="button-reset"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        
        <Button
          onClick={completeBoundary}
          disabled={points.length < minPoints}
          className="bg-blue-600 hover:bg-blue-700"
          data-testid="button-complete-boundary"
        >
          <Check className="w-4 h-4 mr-2" />
          Complete ({points.length}/{minPoints})
        </Button>
      </div>

      <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
        {status}
      </div>

      <div ref={mapRef} className="w-full" />

      {points.length > 0 && (
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          Points: {points.map((_, i) => String.fromCharCode(65 + i)).join(' → ')}
          {points.length >= 3 && ` → ${String.fromCharCode(65)}`}
        </div>
      )}
    </div>
  );
}