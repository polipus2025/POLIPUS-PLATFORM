import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Satellite, RotateCcw, Check, MapPin } from 'lucide-react';

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface WorkingSatelliteMapperProps {
  onBoundaryComplete: (boundary: { points: BoundaryPoint[]; area: number; }) => void;
  minPoints?: number;
  maxPoints?: number;
  enableRealTimeGPS?: boolean;
}

export default function WorkingSatelliteMapper({ 
  onBoundaryComplete, 
  minPoints = 3, 
  maxPoints = 20,
  enableRealTimeGPS = false 
}: WorkingSatelliteMapperProps) {
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Loading satellite imagery...');
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

  // Calculate EUDR risk based on coordinates
  const calculateRiskLevel = (lat: number, lng: number) => {
    // Simulate forest risk areas
    if ((lat > 6.5 && lat < 7.0) || (lng > -10.0 && lng < -9.5)) {
      return { level: 'high', color: '#dc2626', pattern: 'crosshatch-red' };
    } else if ((lat > 6.3 && lat < 6.5) || (lng > -9.5 && lng < -9.2)) {
      return { level: 'standard', color: '#f59e0b', pattern: 'crosshatch-yellow' };
    } else {
      return { level: 'low', color: '#22c55e', pattern: 'crosshatch-green' };
    }
  };

  // Initialize map with satellite imagery
  useEffect(() => {
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    
    // Create map with satellite background
    mapContainer.innerHTML = `
      <div style="
        position: relative;
        width: 100%;
        height: 400px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
        cursor: crosshair;
        background: url('https://mt1.google.com/vt/lyrs=s&x=1024&y=1024&z=10') center/cover,
                    url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/10/1024/1024') center/cover,
                    linear-gradient(45deg, #10b981 0%, #059669 50%, #047857 100%);
      " id="satellite-map">
        <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;">
          <defs>
            <pattern id="crosshatch-red" patternUnits="userSpaceOnUse" width="8" height="8">
              <path d="M0,0 L8,8 M0,8 L8,0" stroke="#dc2626" stroke-width="1.5" opacity="0.7"/>
            </pattern>
            <pattern id="crosshatch-yellow" patternUnits="userSpaceOnUse" width="8" height="8">
              <path d="M0,0 L8,8 M0,8 L8,0" stroke="#f59e0b" stroke-width="1.5" opacity="0.7"/>
            </pattern>
            <pattern id="crosshatch-green" patternUnits="userSpaceOnUse" width="8" height="8">
              <path d="M0,0 L8,8 M0,8 L8,0" stroke="#22c55e" stroke-width="1.5" opacity="0.7"/>
            </pattern>
          </defs>
        </svg>
      </div>
    `;

    const mapElement = mapContainer.querySelector('#satellite-map') as HTMLElement;
    const svg = mapContainer.querySelector('svg') as SVGSVGElement;

    // Add click handler for adding points
    mapElement.addEventListener('click', (e) => {
      const rect = mapElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Convert pixel coordinates to lat/lng (Liberia region)
      const lat = 6.4281 + (200 - y) / 800; // Scaled for Liberia
      const lng = -9.4295 + (x - 200) / 800;
      
      console.log(`Adding point at ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      
      const newPoint: BoundaryPoint = { latitude: lat, longitude: lng };
      setPoints(prev => [...prev, newPoint]);
    });

    setStatus('Satellite imagery loaded - Click to mark boundary points');
  }, []);

  // Update markers and boundaries when points change
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const mapElement = mapRef.current.querySelector('#satellite-map') as HTMLElement;
    const svg = mapRef.current.querySelector('svg') as SVGSVGElement;
    
    if (!mapElement || !svg) return;

    // Clear existing markers
    mapElement.querySelectorAll('.boundary-marker').forEach(el => el.remove());
    
    // Clear existing SVG elements except defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if (defs) svg.appendChild(defs);

    console.log(`Rendering ${points.length} markers`);

    // Add persistent markers for each point
    points.forEach((point, index) => {
      // Convert lat/lng back to pixels
      const x = (point.longitude + 9.4295) * 800 + 200;
      const y = 200 - (point.latitude - 6.4281) * 800;
      
      // Ensure marker stays within bounds
      const clampedX = Math.max(20, Math.min(380, x));
      const clampedY = Math.max(20, Math.min(380, y));

      const risk = calculateRiskLevel(point.latitude, point.longitude);
      
      // Create persistent marker
      const marker = document.createElement('div');
      marker.className = 'boundary-marker';
      marker.style.cssText = `
        position: absolute;
        left: ${clampedX}px;
        top: ${clampedY}px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: ${risk.color};
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        transform: translate(-50%, -50%);
        z-index: 20;
        cursor: pointer;
      `;
      
      marker.textContent = String.fromCharCode(65 + index); // A, B, C, D...
      marker.title = `Point ${String.fromCharCode(65 + index)} - Risk: ${risk.level.toUpperCase()}`;
      
      mapElement.appendChild(marker);
      console.log(`✓ Added marker ${String.fromCharCode(65 + index)} at ${clampedX}, ${clampedY}`);
    });

    // Draw connecting lines when 2+ points
    if (points.length >= 2) {
      const pointsStr = points.map(point => {
        const x = Math.max(20, Math.min(380, (point.longitude + 9.4295) * 800 + 200));
        const y = Math.max(20, Math.min(380, 200 - (point.latitude - 6.4281) * 800));
        return `${x},${y}`;
      }).join(' ');

      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', pointsStr);
      polyline.setAttribute('fill', 'none');
      polyline.setAttribute('stroke', '#fbbf24');
      polyline.setAttribute('stroke-width', '3');
      polyline.setAttribute('stroke-dasharray', '8,4');
      svg.appendChild(polyline);
    }

    // Create risk polygon when 3+ points
    if (points.length >= 3) {
      const pointsStr = points.map(point => {
        const x = Math.max(20, Math.min(380, (point.longitude + 9.4295) * 800 + 200));
        const y = Math.max(20, Math.min(380, 200 - (point.latitude - 6.4281) * 800));
        return `${x},${y}`;
      }).join(' ');

      // Calculate overall risk
      const highRiskPoints = points.filter(p => calculateRiskLevel(p.latitude, p.longitude).level === 'high');
      const overallRisk = highRiskPoints.length > 0 ? 'high' : 
                         points.filter(p => calculateRiskLevel(p.latitude, p.longitude).level === 'standard').length > points.length / 2 ? 'standard' : 'low';
      
      const riskStyle = calculateRiskLevel(points[0].latitude, points[0].longitude);
      const actualRisk = overallRisk === 'high' ? calculateRiskLevel(7.0, -9.8) : 
                        overallRisk === 'standard' ? calculateRiskLevel(6.4, -9.3) : 
                        calculateRiskLevel(6.2, -9.1);

      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pointsStr);
      polygon.setAttribute('fill', `url(#${actualRisk.pattern})`);
      polygon.setAttribute('stroke', actualRisk.color);
      polygon.setAttribute('stroke-width', '3');
      polygon.setAttribute('opacity', '0.8');
      svg.appendChild(polygon);

      const area = calculateArea(points);
      
      // Add area label
      const centerX = points.reduce((sum, p) => sum + (p.longitude + 9.4295) * 800 + 200, 0) / points.length;
      const centerY = points.reduce((sum, p) => sum + (200 - (p.latitude - 6.4281) * 800), 0) / points.length;
      
      const areaLabel = document.createElement('div');
      areaLabel.className = 'boundary-marker';
      areaLabel.style.cssText = `
        position: absolute;
        left: ${centerX}px;
        top: ${centerY}px;
        padding: 4px 8px;
        background: rgba(0,0,0,0.8);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        transform: translate(-50%, -50%);
        z-index: 25;
        border: 2px solid white;
      `;
      areaLabel.textContent = `${area.toFixed(1)} Ha - ${overallRisk.toUpperCase()} RISK`;
      mapElement.appendChild(areaLabel);

      console.log(`✓ Risk polygon created: ${overallRisk} risk, ${area.toFixed(1)} hectares`);
      setStatus(`Boundary mapped: ${points.length} points, ${area.toFixed(1)} hectares, ${overallRisk.toUpperCase()} EUDR risk`);
    } else {
      setStatus(`${points.length} points mapped - Need ${minPoints - points.length} more to complete boundary`);
    }
  }, [points, minPoints]);

  const clearBoundary = () => {
    setPoints([]);
    setStatus('Satellite imagery loaded - Click to mark boundary points');
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
            Working Satellite Mapper
          </h3>
          <p className="text-sm text-gray-600">{status}</p>
          <div className="text-xs text-blue-600 font-medium mt-1">
            {points.length === 0 && "Click anywhere on satellite map to start"}
            {points.length === 1 && "Point A added! Click to add point B"}
            {points.length === 2 && "Points A-B connected! Click for point C"}
            {points.length >= 3 && `${points.length} points - Risk overlay active`}
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
            <strong>Points Mapped:</strong> {points.length}/{maxPoints}
          </div>
          <div>
            <strong>Area:</strong> {points.length >= 3 ? `${calculateArea(points).toFixed(1)} hectares` : 'Calculating...'}
          </div>
        </div>
      )}
    </div>
  );
}