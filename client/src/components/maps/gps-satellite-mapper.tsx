import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Satellite, RotateCcw, Check, MapPin } from 'lucide-react';

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface GPSSatelliteMapperProps {
  onBoundaryComplete: (boundary: { points: BoundaryPoint[]; area: number; }) => void;
  minPoints?: number;
  maxPoints?: number;
  enableRealTimeGPS?: boolean;
}

export default function GPSSatelliteMapper({ 
  onBoundaryComplete, 
  minPoints = 3, 
  maxPoints = 20,
  enableRealTimeGPS = false 
}: GPSSatelliteMapperProps) {
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Initializing GPS satellite imagery...');
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

  // Calculate EUDR risk based on coordinates
  const calculateRiskLevel = (lat: number, lng: number) => {
    // Simulate forest risk areas based on Liberian coordinates
    if ((lat > 6.5 && lat < 7.0) || (lng > -10.0 && lng < -9.5)) {
      return { level: 'high', color: '#dc2626', pattern: 'crosshatch-red' };
    } else if ((lat > 6.3 && lat < 6.5) || (lng > -9.5 && lng < -9.2)) {
      return { level: 'standard', color: '#f59e0b', pattern: 'crosshatch-yellow' };
    } else {
      return { level: 'low', color: '#22c55e', pattern: 'crosshatch-green' };
    }
  };

  // Convert lat/lng to pixel coordinates
  const coordToPixel = (lat: number, lng: number) => {
    const pixelScale = 800; // Scale factor for coordinate conversion
    const x = (lng - mapCenter.lng) * pixelScale + 200;
    const y = 200 - (lat - mapCenter.lat) * pixelScale;
    return { x: Math.max(20, Math.min(380, x)), y: Math.max(20, Math.min(380, y)) };
  };

  // Convert pixel coordinates to lat/lng
  const pixelToCoord = (x: number, y: number) => {
    const coordScale = 0.00125; // Inverse scale factor
    const lat = mapCenter.lat + (200 - y) * coordScale;
    const lng = mapCenter.lng + (x - 200) * coordScale;
    return { lat, lng };
  };

  // Initialize GPS satellite map
  useEffect(() => {
    if (!mapRef.current) return;

    const mapContainer = mapRef.current;
    
    // Get current GPS coordinates or use Liberia default
    const initializeMap = (centerLat: number, centerLng: number) => {
      setMapCenter({ lat: centerLat, lng: centerLng });
      
      // Calculate tile coordinates for optimized satellite imagery
      const zoom = 14; // Reduced zoom for faster loading while maintaining quality
      const tileX = Math.floor((centerLng + 180) / 360 * Math.pow(2, zoom));
      const tileY = Math.floor((1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
      
      console.log(`📍 GPS Location: ${centerLat.toFixed(6)}, ${centerLng.toFixed(6)}`);
      console.log(`🛰️ Loading satellite tile: x=${tileX}, y=${tileY}, zoom=${zoom}`);
      
      // Create map with location-specific satellite imagery
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
            url('https://mt1.google.com/vt/lyrs=s&hl=en&x=${tileX}&y=${tileY}&z=${zoom}'),
            url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}'),
            url('https://tiles.stadiamaps.com/tiles/alidade_satellite/${zoom}/${tileX}/${tileY}@2x.png');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          background-color: #10b981;
        " id="gps-satellite-map">
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
          <style>
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
              50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
          </style>
        </div>
      `;

      const mapElement = mapContainer.querySelector('#gps-satellite-map') as HTMLElement;
      
      // Add click handler for boundary marking with immediate visual feedback
      mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Show immediate click feedback
        const clickIndicator = document.createElement('div');
        clickIndicator.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.8);
          border: 2px solid white;
          transform: translate(-50%, -50%);
          z-index: 30;
          animation: pulse 0.6s ease-out;
        `;
        mapElement.appendChild(clickIndicator);
        
        // Remove click indicator after animation
        setTimeout(() => {
          if (clickIndicator.parentNode) {
            clickIndicator.parentNode.removeChild(clickIndicator);
          }
        }, 600);
        
        const coords = pixelToCoord(x, y);
        console.log(`Adding boundary point: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
        
        const newPoint: BoundaryPoint = { latitude: coords.lat, longitude: coords.lng };
        setPoints(prev => [...prev, newPoint]);
      });

      setStatus(`GPS satellite imagery loaded for ${centerLat.toFixed(4)}, ${centerLng.toFixed(4)} - Click to mark boundary`);
    };

    // Try to get current GPS location
    if (navigator.geolocation && enableRealTimeGPS) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          initializeMap(position.coords.latitude, position.coords.longitude);
        },
        () => {
          console.log('📍 GPS unavailable, using Liberia default coordinates');
          initializeMap(6.4281, -9.4295);
        }
      );
    } else {
      initializeMap(6.4281, -9.4295);
    }
  }, [enableRealTimeGPS]);

  // Update markers and overlays when points change
  useEffect(() => {
    if (!mapRef.current || points.length === 0) return;

    const mapElement = mapRef.current.querySelector('#gps-satellite-map') as HTMLElement;
    const svg = mapRef.current.querySelector('svg') as SVGSVGElement;
    
    if (!mapElement || !svg) return;

    // Clear existing markers
    mapElement.querySelectorAll('.boundary-marker').forEach(el => el.remove());
    
    // Clear existing SVG elements except defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if (defs) svg.appendChild(defs);

    console.log(`Rendering ${points.length} boundary markers`);

    // Add persistent markers for each point
    points.forEach((point, index) => {
      const pixelPos = coordToPixel(point.latitude, point.longitude);
      const risk = calculateRiskLevel(point.latitude, point.longitude);
      
      // Create persistent marker
      const marker = document.createElement('div');
      marker.className = 'boundary-marker';
      marker.style.cssText = `
        position: absolute;
        left: ${pixelPos.x}px;
        top: ${pixelPos.y}px;
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
      console.log(`✅ Added marker ${String.fromCharCode(65 + index)} at pixel ${pixelPos.x}, ${pixelPos.y}`);
    });

    // Draw connecting lines when 2+ points
    if (points.length >= 2) {
      const pointsStr = points.map(point => {
        const pos = coordToPixel(point.latitude, point.longitude);
        return `${pos.x},${pos.y}`;
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
        const pos = coordToPixel(point.latitude, point.longitude);
        return `${pos.x},${pos.y}`;
      }).join(' ');

      // Calculate overall risk level
      const highRiskPoints = points.filter(p => calculateRiskLevel(p.latitude, p.longitude).level === 'high');
      const standardRiskPoints = points.filter(p => calculateRiskLevel(p.latitude, p.longitude).level === 'standard');
      
      const overallRisk = highRiskPoints.length > 0 ? 'high' : 
                         standardRiskPoints.length > points.length / 2 ? 'standard' : 'low';
      
      const riskColors = {
        high: { color: '#dc2626', pattern: 'crosshatch-red' },
        standard: { color: '#f59e0b', pattern: 'crosshatch-yellow' },
        low: { color: '#22c55e', pattern: 'crosshatch-green' }
      };
      
      const riskStyle = riskColors[overallRisk];

      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pointsStr);
      polygon.setAttribute('fill', `url(#${riskStyle.pattern})`);
      polygon.setAttribute('stroke', riskStyle.color);
      polygon.setAttribute('stroke-width', '3');
      polygon.setAttribute('opacity', '0.8');
      svg.appendChild(polygon);

      const area = calculateArea(points);
      
      // Add area/risk label in center
      const centerPos = points.reduce((acc, p) => {
        const pos = coordToPixel(p.latitude, p.longitude);
        return { x: acc.x + pos.x, y: acc.y + pos.y };
      }, { x: 0, y: 0 });
      
      centerPos.x /= points.length;
      centerPos.y /= points.length;
      
      const areaLabel = document.createElement('div');
      areaLabel.className = 'boundary-marker';
      areaLabel.style.cssText = `
        position: absolute;
        left: ${centerPos.x}px;
        top: ${centerPos.y}px;
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

      console.log(`🎨 Risk polygon created: ${overallRisk} risk, ${area.toFixed(1)} hectares`);
      setStatus(`🎯 Boundary mapped: ${points.length} points, ${area.toFixed(1)} hectares, ${overallRisk.toUpperCase()} EUDR risk`);
    } else {
      setStatus(`📍 ${points.length} points mapped - Need ${minPoints - points.length} more to complete boundary`);
    }
  }, [points, minPoints, mapCenter]);

  const clearBoundary = () => {
    setPoints([]);
    setStatus('🛰️ GPS satellite imagery loaded - Click to mark boundary points');
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
            GPS Satellite Mapper
          </h3>
          <p className="text-sm text-gray-600">{status}</p>
          <div className="text-xs text-blue-600 font-medium mt-1">
            {points.length === 0 && "TAP anywhere on satellite map to start boundary mapping"}
            {points.length === 1 && "Point A added! TAP to add point B"}
            {points.length === 2 && "Points A-B connected! TAP for point C to show risk overlay"}
            {points.length >= 3 && `${points.length} boundary points mapped - EUDR risk overlay active`}
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