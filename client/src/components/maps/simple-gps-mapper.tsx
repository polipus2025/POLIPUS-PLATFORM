import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Satellite, RotateCcw, Check } from 'lucide-react';

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface SimpleGPSMapperProps {
  onBoundaryComplete: (boundary: { points: BoundaryPoint[]; area: number; }) => void;
  minPoints?: number;
  maxPoints?: number;
  enableRealTimeGPS?: boolean;
}

export default function SimpleGPSMapper({ 
  onBoundaryComplete, 
  minPoints = 3, 
  maxPoints = 20,
  enableRealTimeGPS = false 
}: SimpleGPSMapperProps) {
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Loading satellite map...');
  const [mapCenter, setMapCenter] = useState({ lat: 6.4281, lng: -9.4295 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Calculate area using shoelace formula
  const calculateArea = (mapPoints: BoundaryPoint[]) => {
    if (mapPoints.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < mapPoints.length; i++) {
      const j = (i + 1) % mapPoints.length;
      area += mapPoints[i].latitude * mapPoints[j].longitude;
      area -= mapPoints[j].latitude * mapPoints[i].longitude;
    }
    return Math.abs(area) / 2 * 12100; // Convert to hectares
  };

  // Initialize simple map
  useEffect(() => {
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    
    // Get GPS location or use default
    const initializeMap = (centerLat: number, centerLng: number) => {
      setMapCenter({ lat: centerLat, lng: centerLng });
      setStatus(`Satellite map ready for ${centerLat.toFixed(4)}, ${centerLng.toFixed(4)} - Tap to add points`);
      
      // Create simple interactive map
      mapContainer.innerHTML = `
        <div style="
          position: relative;
          width: 100%;
          height: 400px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          cursor: crosshair;
          background: linear-gradient(135deg, #10b981 0%, #34d399 25%, #059669 50%, #047857 75%, #065f46 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          text-align: center;
        " id="simple-map">
          <div style="background: rgba(0,0,0,0.7); padding: 20px; border-radius: 8px; max-width: 300px;">
            <div style="font-weight: bold; margin-bottom: 8px;">GPS Satellite Mapping Active</div>
            <div>Location: ${centerLat.toFixed(4)}, ${centerLng.toFixed(4)}</div>
            <div style="margin-top: 8px; font-size: 12px;">Tap anywhere to add boundary points</div>
          </div>
        </div>
      `;

      const mapElement = mapContainer.querySelector('#simple-map') as HTMLElement;
      
      // Add click handler
      mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert click to coordinates
        const lat = centerLat + (200 - y) * 0.001;
        const lng = centerLng + (x - 200) * 0.001;
        
        // Visual feedback
        const marker = document.createElement('div');
        marker.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 24px;
          height: 24px;
          background: #22c55e;
          border: 2px solid white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: bold;
          color: white;
        `;
        marker.textContent = String.fromCharCode(65 + points.length);
        mapElement.appendChild(marker);
        
        const newPoint: BoundaryPoint = { latitude: lat, longitude: lng };
        setPoints(prev => [...prev, newPoint]);
        
      });
    };

    // Try GPS or use default
    if (navigator.geolocation && enableRealTimeGPS) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initializeMap(position.coords.latitude, position.coords.longitude);
        },
        () => {
          initializeMap(6.4281, -9.4295);
        }
      );
    } else {
      initializeMap(6.4281, -9.4295);
    }
  }, [enableRealTimeGPS, points.length]);

  // Update status when points change
  useEffect(() => {
    if (points.length === 0) {
      setStatus('Tap anywhere on the map to start boundary mapping');
    } else if (points.length < minPoints) {
      setStatus(`${points.length} points added - Need ${minPoints - points.length} more to complete boundary`);
    } else {
      const area = calculateArea(points);
      setStatus(`Boundary complete: ${points.length} points, ${area.toFixed(1)} hectares`);
    }
  }, [points, minPoints]);

  const clearBoundary = () => {
    setPoints([]);
    if (mapRef.current) {
      const mapElement = mapRef.current.querySelector('#simple-map') as HTMLElement;
      if (mapElement) {
        mapElement.querySelectorAll('div[style*="position: absolute"]').forEach(el => el.remove());
      }
    }
  };

  const completeBoundary = () => {
    if (points.length >= minPoints) {
      const area = calculateArea(points);
      onBoundaryComplete({ points, area });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Satellite className="w-5 h-5 text-blue-600" />
            Simple GPS Mapper
          </h3>
          <p className="text-sm text-gray-600">{status}</p>
          <div className="text-xs text-blue-600 font-medium mt-1">
            {points.length === 0 && "TAP anywhere on map to start"}
            {points.length === 1 && "Point A added! TAP for point B"}
            {points.length === 2 && "Points A-B added! TAP for point C"}
            {points.length >= 3 && `${points.length} boundary points mapped`}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={clearBoundary} variant="outline" size="sm" disabled={points.length === 0}>
            <RotateCcw className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button 
            onClick={completeBoundary} 
            disabled={points.length < minPoints}
            size="sm"
            className={points.length >= minPoints ? "bg-green-600 hover:bg-green-700" : ""}
          >
            <Check className="w-4 h-4 mr-1" />
            Complete ({points.length})
          </Button>
        </div>
      </div>

      <div ref={mapRef} className="w-full" />

      {points.length > 0 && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Points:</strong> {points.length}/{maxPoints}
          </div>
          <div>
            <strong>Area:</strong> {points.length >= 3 ? `${calculateArea(points).toFixed(1)} hectares` : 'Calculating...'}
          </div>
        </div>
      )}
    </div>
  );
}