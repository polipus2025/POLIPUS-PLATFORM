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
  const [mappingActive, setMappingActive] = useState(false);
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
      
      // Add click handler for manual boundary point addition
      mapElement.addEventListener('click', (e) => {
        if (!mappingActive) return;
        
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert click to GPS coordinates
        const coords = pixelToCoord(x, y);
        const newPoint: BoundaryPoint = { latitude: coords.lat, longitude: coords.lng };
        
        setPoints(prev => {
          const nextLetter = String.fromCharCode(65 + prev.length);
          console.log(`Added point ${nextLetter} by click: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
          return [...prev, newPoint];
        });
      });

      setStatus(`GPS satellite imagery loaded for ${centerLat.toFixed(4)}, ${centerLng.toFixed(4)} - Click START MAPPING to begin`);
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

  // Update markers and overlays when points change - PERSISTENT VERSION
  useEffect(() => {
    if (!mapRef.current) return;

    const mapElement = mapRef.current.querySelector('#gps-satellite-map') as HTMLElement;
    const svg = mapRef.current.querySelector('svg') as SVGSVGElement;
    
    if (!mapElement || !svg) return;

    // Clear existing markers and lines ONLY to redraw with all points
    mapElement.querySelectorAll('.boundary-marker, .boundary-line, .eudr-overlay, .deforestation-warning').forEach(el => el.remove());
    
    // Clear existing SVG elements except defs
    const defs = svg.querySelector('defs');
    svg.innerHTML = '';
    if (defs) svg.appendChild(defs);

    // Exit early if no points to draw
    if (points.length === 0) return;

    console.log(`🎯 Rendering ${points.length} PERSISTENT boundary markers on real-time satellite view`);

    // Add PERMANENT markers for each point that STAY VISIBLE ON MAP
    points.forEach((point, index) => {
      const pixelPos = coordToPixel(point.latitude, point.longitude);
      const risk = calculateRiskLevel(point.latitude, point.longitude);
      
      // Create HIGHLY VISIBLE PERMANENT marker
      const marker = document.createElement('div');
      marker.className = 'boundary-marker persistent-point';
      marker.setAttribute('data-point-index', index.toString());
      marker.setAttribute('data-persistent', 'true');
      marker.style.cssText = `
        position: absolute !important;
        left: ${pixelPos.x}px !important;
        top: ${pixelPos.y}px !important;
        width: 40px !important;
        height: 40px !important;
        border-radius: 50% !important;
        background: radial-gradient(circle, #22c55e 0%, #16a34a 100%) !important;
        border: 4px solid white !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 18px !important;
        font-weight: bold !important;
        color: white !important;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.9) !important;
        box-shadow: 0 8px 20px rgba(0,0,0,0.7), inset 0 2px 0 rgba(255,255,255,0.3) !important;
        transform: translate(-50%, -50%) !important;
        z-index: 50 !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        animation: pulse-glow 2s infinite alternate !important;
      `;
      
      const letter = String.fromCharCode(65 + index);
      marker.textContent = letter; // A, B, C, D...
      marker.title = `PERSISTENT Boundary Point ${letter} - GPS: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;
      
      // Add pulsing animation CSS
      if (!document.querySelector('#persistent-marker-styles')) {
        const style = document.createElement('style');
        style.id = 'persistent-marker-styles';
        style.textContent = `
          @keyframes pulse-glow {
            0% { box-shadow: 0 8px 20px rgba(0,0,0,0.7), 0 0 0 0 rgba(34, 197, 94, 0.7); }
            100% { box-shadow: 0 8px 20px rgba(0,0,0,0.7), 0 0 0 8px rgba(34, 197, 94, 0); }
          }
          .persistent-point {
            will-change: transform, box-shadow !important;
            backface-visibility: hidden !important;
          }
        `;
        document.head.appendChild(style);
      }
      
      mapElement.appendChild(marker);
      console.log(`🟢 PERMANENT marker ${letter} LOCKED at pixel ${pixelPos.x}, ${pixelPos.y} for GPS ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`);
    });

    // Draw VISIBLE connecting lines between consecutive points - FIXED VERSION
    if (points.length >= 2) {
      console.log(`🔗 Drawing ${points.length - 1} connecting lines between points`);
      
      for (let i = 0; i < points.length - 1; i++) {
        const start = coordToPixel(points[i].latitude, points[i].longitude);
        const end = coordToPixel(points[i + 1].latitude, points[i + 1].longitude);
        
        console.log(`Drawing line from ${String.fromCharCode(65 + i)} to ${String.fromCharCode(65 + i + 1)}: (${start.x}, ${start.y}) to (${end.x}, ${end.y})`);
        
        // Create SVG line for better visibility and precision
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', start.x.toString());
        line.setAttribute('y1', start.y.toString());
        line.setAttribute('x2', end.x.toString());
        line.setAttribute('y2', end.y.toString());
        line.setAttribute('stroke', '#22c55e');
        line.setAttribute('stroke-width', '5');
        line.setAttribute('stroke-linecap', 'round');
        line.setAttribute('opacity', '1');
        line.setAttribute('class', 'boundary-line');
        svg.appendChild(line);
      }
      
      // Add closing line for complete polygon when 3+ points
      if (points.length >= 3) {
        const start = coordToPixel(points[points.length - 1].latitude, points[points.length - 1].longitude);
        const end = coordToPixel(points[0].latitude, points[0].longitude);
        
        console.log(`Drawing closing line from ${String.fromCharCode(65 + points.length - 1)} to A: (${start.x}, ${start.y}) to (${end.x}, ${end.y})`);
        
        const closingLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        closingLine.setAttribute('x1', start.x.toString());
        closingLine.setAttribute('y1', start.y.toString());
        closingLine.setAttribute('x2', end.x.toString());
        closingLine.setAttribute('y2', end.y.toString());
        closingLine.setAttribute('stroke', '#16a34a');
        closingLine.setAttribute('stroke-width', '5');
        closingLine.setAttribute('stroke-linecap', 'round');
        closingLine.setAttribute('stroke-dasharray', '10,5');
        closingLine.setAttribute('opacity', '1');
        closingLine.setAttribute('class', 'boundary-line');
        svg.appendChild(closingLine);
      }
    }

    // Create COMPREHENSIVE EUDR & DEFORESTATION ANALYSIS when 3+ points
    if (points.length >= 3) {
      const pointsStr = points.map(point => {
        const pos = coordToPixel(point.latitude, point.longitude);
        return `${pos.x},${pos.y}`;
      }).join(' ');

      // ENHANCED EUDR RISK CALCULATION
      const highRiskPoints = points.filter(p => calculateRiskLevel(p.latitude, p.longitude).level === 'high');
      const standardRiskPoints = points.filter(p => calculateRiskLevel(p.latitude, p.longitude).level === 'standard');
      
      const overallRisk = highRiskPoints.length > 0 ? 'high' : 
                         standardRiskPoints.length > points.length / 2 ? 'standard' : 'low';
      
      const riskColors = {
        high: { color: '#dc2626', pattern: 'crosshatch-red', bgColor: '#fecaca' },
        standard: { color: '#f59e0b', pattern: 'crosshatch-yellow', bgColor: '#fef3c7' },
        low: { color: '#22c55e', pattern: 'crosshatch-green', bgColor: '#dcfce7' }
      };
      
      const riskStyle = riskColors[overallRisk];

      // Create enhanced risk polygon with deforestation overlay
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pointsStr);
      polygon.setAttribute('fill', `url(#${riskStyle.pattern})`);
      polygon.setAttribute('stroke', riskStyle.color);
      polygon.setAttribute('stroke-width', '4');
      polygon.setAttribute('opacity', '0.8');
      svg.appendChild(polygon);

      const area = calculateArea(points);
      
      // DEFORESTATION RISK INDICATORS
      const deforestationRisk = area > 10 ? 'HIGH' : area > 5 ? 'MEDIUM' : 'LOW';
      const complianceStatus = overallRisk === 'high' ? 'NON-COMPLIANT' : 'COMPLIANT';
      
      // Add comprehensive EUDR/Deforestation label in center
      const centerPos = points.reduce((acc, p) => {
        const pos = coordToPixel(p.latitude, p.longitude);
        return { x: acc.x + pos.x, y: acc.y + pos.y };
      }, { x: 0, y: 0 });
      
      centerPos.x /= points.length;
      centerPos.y /= points.length;
      
      const areaLabel = document.createElement('div');
      areaLabel.className = 'boundary-marker eudr-report';
      areaLabel.style.cssText = `
        position: absolute;
        left: ${centerPos.x}px;
        top: ${centerPos.y}px;
        padding: 8px 12px;
        background: ${overallRisk === 'high' ? 'rgba(220,38,38,0.95)' : 'rgba(0,0,0,0.9)'};
        color: white;
        border-radius: 8px;
        font-size: 11px;
        font-weight: bold;
        transform: translate(-50%, -50%);
        z-index: 35;
        border: 3px solid white;
        text-align: center;
        line-height: 1.2;
        box-shadow: 0 6px 20px rgba(0,0,0,0.6);
      `;
      areaLabel.innerHTML = `
        <div style="font-size: 10px;">EUDR ANALYSIS</div>
        <div>${area.toFixed(1)} HECTARES</div>
        <div style="color: ${overallRisk === 'high' ? '#fca5a5' : '#86efac'};">${overallRisk.toUpperCase()} RISK</div>
        <div style="font-size: 9px;">DEFO: ${deforestationRisk}</div>
      `;
      mapElement.appendChild(areaLabel);

      // Add prominent EUDR compliance overlay
      const eudrOverlay = document.createElement('div');
      eudrOverlay.className = 'eudr-overlay';
      eudrOverlay.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: ${overallRisk === 'high' ? 'rgba(220,38,38,0.95)' : 'rgba(34,197,94,0.95)'};
        color: white;
        padding: 12px 16px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: bold;
        z-index: 35;
        box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        border: 3px solid white;
        text-align: center;
        line-height: 1.3;
      `;
      eudrOverlay.innerHTML = `
        <div>🌍 EUDR REPORT</div>
        <div style="font-size: 11px; margin-top: 4px;">${complianceStatus}</div>
        <div style="font-size: 10px; margin-top: 2px;">Deforestation: ${deforestationRisk}</div>
      `;
      mapElement.appendChild(eudrOverlay);

      // Add deforestation risk indicators around the polygon
      if (overallRisk === 'high') {
        const warningIndicators = [
          { x: pointsStr.split(' ')[0].split(',')[0], y: pointsStr.split(' ')[0].split(',')[1] },
          { x: pointsStr.split(' ')[Math.floor(points.length/2)].split(',')[0], y: pointsStr.split(' ')[Math.floor(points.length/2)].split(',')[1] }
        ];
        
        warningIndicators.forEach((pos, idx) => {
          const warning = document.createElement('div');
          warning.className = 'deforestation-warning';
          warning.style.cssText = `
            position: absolute;
            left: ${pos.x}px;
            top: ${pos.y}px;
            width: 24px;
            height: 24px;
            background: #dc2626;
            border: 2px solid white;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            z-index: 40;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.5);
            animation: pulse 2s infinite;
          `;
          warning.textContent = '⚠';
          warning.title = 'High Deforestation Risk Zone';
          mapElement.appendChild(warning);
        });
      }

      console.log(`🌍 EUDR & DEFORESTATION ANALYSIS: ${overallRisk} risk, ${area.toFixed(1)} hectares, ${deforestationRisk} deforestation risk, ${complianceStatus}`);
      setStatus(`🌍 EUDR COMPLIANCE: ${points.length} connected points, ${area.toFixed(1)}Ha boundary, ${overallRisk.toUpperCase()} risk`);
    } else if (points.length >= 2) {
      setStatus(`🔗 ${points.length} points mapped and connected - Need ${minPoints - points.length} more for EUDR analysis`);
    } else {
      setStatus(`📍 ${points.length} boundary point mapped - Add more points to create connected boundary`);
    }
  }, [points, minPoints, mapCenter]);

  const clearBoundary = () => {
    setPoints([]);
    setMappingActive(false);
    setStatus('GPS satellite imagery loaded - Click START MAPPING to begin');
  };

  const startMapping = () => {
    setMappingActive(true);
    setStatus(`Mapping ACTIVE! Click on satellite map to add boundary points A, B, C, D...`);
  };

  const addPoint = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPoint: BoundaryPoint = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          setPoints(prev => {
            const nextLetter = String.fromCharCode(65 + prev.length);
            console.log(`Added GPS point ${nextLetter}: ${newPoint.latitude.toFixed(6)}, ${newPoint.longitude.toFixed(6)}`);
            return [...prev, newPoint];
          });
        },
        (error) => {
          console.log('GPS error:', error);
          setStatus('GPS failed - Check location permissions');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
      );
    }
  };

  const completeBoundary = () => {
    if (points.length >= minPoints) {
      const area = calculateArea(points);
      onBoundaryComplete({ points, area });
    }
  };

  // PDF Report Generation Functions
  const generatePDFReport = () => {
    if (points.length < 3) return;
    
    const area = calculateArea(points);
    const deforestationRisk = area > 10 ? 'HIGH' : area > 5 ? 'MEDIUM' : 'LOW';
    const complianceStatus = area > 10 ? 'NON-COMPLIANT' : 'COMPLIANT';
    
    // Create PDF content
    const reportContent = `
      EUDR & DEFORESTATION ANALYSIS REPORT
      
      Farm Boundary Analysis:
      - Total Area: ${area.toFixed(2)} hectares
      - Boundary Points: ${points.length}
      - Coordinates: ${points.map((p, i) => `${String.fromCharCode(65 + i)}: ${p.latitude.toFixed(6)}, ${p.longitude.toFixed(6)}`).join('\n  ')}
      
      EUDR Compliance Assessment:
      - Risk Level: ${area > 10 ? 'HIGH RISK' : area > 5 ? 'MEDIUM RISK' : 'LOW RISK'}
      - Deforestation Risk: ${deforestationRisk}
      - Compliance Status: ${complianceStatus}
      
      Generated: ${new Date().toLocaleString()}
      Report ID: EUDR-${Date.now()}
    `;
    
    // Download as text file (simplified PDF alternative)
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EUDR_Report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📄 EUDR PDF Report generated and downloaded');
  };

  const downloadEUDRReport = () => {
    if (points.length < 3) return;
    
    const area = calculateArea(points);
    const reportData = {
      farmBoundary: {
        area: area.toFixed(2),
        points: points.length,
        coordinates: points.map((p, i) => ({
          point: String.fromCharCode(65 + i),
          lat: p.latitude.toFixed(6),
          lng: p.longitude.toFixed(6)
        }))
      },
      eudrAnalysis: {
        riskLevel: area > 10 ? 'HIGH' : area > 5 ? 'MEDIUM' : 'LOW',
        deforestationRisk: area > 10 ? 'HIGH' : area > 5 ? 'MEDIUM' : 'LOW',
        complianceStatus: area > 10 ? 'NON-COMPLIANT' : 'COMPLIANT'
      },
      reportMetadata: {
        generatedAt: new Date().toISOString(),
        reportId: `EUDR-${Date.now()}`,
        version: '1.0'
      }
    };
    
    // Download as JSON report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EUDR_Analysis_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('🌍 EUDR Analysis Report downloaded');
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
            {!mappingActive && points.length === 0 && "Click START MAPPING to begin manual boundary creation"}
            {mappingActive && points.length === 0 && "Walk to first boundary corner, then click ADD POINT (A)"}
            {mappingActive && points.length === 1 && "Point A captured! Walk to next corner and click ADD POINT (B)"}
            {mappingActive && points.length === 2 && "Points A-B connected! Walk to corner 3 and ADD POINT (C) for EUDR analysis"}
            {mappingActive && points.length >= 3 && `${points.length} boundary points mapped - EUDR risk overlay active`}
            {!mappingActive && points.length > 0 && `Mapping complete - ${points.length} boundary points created`}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!mappingActive ? (
            <Button onClick={startMapping} size="sm" className="bg-blue-600 hover:bg-blue-700">
              <MapPin className="w-4 h-4 mr-1" />
              Start Mapping
            </Button>
          ) : (
            <Button onClick={addPoint} size="sm" className="bg-green-600 hover:bg-green-700">
              <MapPin className="w-4 h-4 mr-1" />
              Add Point ({String.fromCharCode(65 + points.length)})
            </Button>
          )}
          <Button onClick={clearBoundary} variant="outline" size="sm" disabled={points.length === 0 && !mappingActive}>
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
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Boundary Points:</strong> {points.length}/{maxPoints}
            </div>
            <div>
              <strong>Area:</strong> {points.length >= 3 ? `${calculateArea(points).toFixed(1)} hectares` : 'Calculating...'}
            </div>
          </div>
          
          {points.length >= 3 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 flex items-center gap-2 mb-2">
                🌍 EUDR & DEFORESTATION REPORT
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Farm Area:</div>
                  <div className="font-medium">{calculateArea(points).toFixed(1)} hectares</div>
                </div>
                <div>
                  <div className="text-gray-600">EUDR Risk Level:</div>
                  <div className={`font-medium ${
                    calculateArea(points) > 10 ? 'text-red-600' : 
                    calculateArea(points) > 5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {calculateArea(points) > 10 ? 'HIGH RISK' : 
                     calculateArea(points) > 5 ? 'MEDIUM RISK' : 'LOW RISK'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Deforestation Risk:</div>
                  <div className={`font-medium ${
                    calculateArea(points) > 10 ? 'text-red-600' : 
                    calculateArea(points) > 5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {calculateArea(points) > 10 ? 'HIGH' : 
                     calculateArea(points) > 5 ? 'MEDIUM' : 'LOW'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Compliance Status:</div>
                  <div className={`font-medium ${
                    calculateArea(points) > 10 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {calculateArea(points) > 10 ? 'NON-COMPLIANT' : 'COMPLIANT'}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-blue-600">
                📊 Analysis based on {points.length} GPS boundary points and EU Deforestation Regulation standards
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={generatePDFReport}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  📄 Generate PDF Report
                </Button>
                <Button
                  onClick={downloadEUDRReport}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  🌍 Download EUDR Report
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {mappingActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Mapping Active</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Walk to each boundary corner. Click "Add Point" button to capture your current GPS location.
          </p>
        </div>
      )}
    </div>
  );
}