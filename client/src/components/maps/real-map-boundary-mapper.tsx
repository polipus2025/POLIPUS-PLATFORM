import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check, Satellite, Download, Shield, AlertTriangle } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
  id?: string;
  timestamp?: Date;
  accuracy?: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

interface RealMapBoundaryMapperProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  minPoints?: number;
  maxPoints?: number;
  enableRealTimeGPS?: boolean;
}

export default function RealMapBoundaryMapper({ 
  onBoundaryComplete, 
  minPoints = 3,
  maxPoints = 20,
  enableRealTimeGPS = true
}: RealMapBoundaryMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('🗺️ Loading satellite imagery...');
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({lat: 6.4281, lng: -9.4295});
  const [tileBounds, setTileBounds] = useState<{north: number, south: number, east: number, west: number} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(18);
  const [currentProvider, setCurrentProvider] = useState('Loading...');
  const [isTrackingGPS, setIsTrackingGPS] = useState(false);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);
  const [currentGPSPosition, setCurrentGPSPosition] = useState<{lat: number, lng: number} | null>(null);
  const [trackingAccuracy, setTrackingAccuracy] = useState<number | null>(null);
  const [showBoundaryDetails, setShowBoundaryDetails] = useState(false);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Calculate precise tile bounds for coordinate alignment
  const calculateTileBounds = (lat: number, lng: number, zoom: number) => {
    const n = Math.pow(2, zoom);
    const x = Math.floor(n * ((lng + 180) / 360));
    const y = Math.floor(n * (1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2);
    
    const west = (x / n) * 360 - 180;
    const east = ((x + 1) / n) * 360 - 180;
    const north = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
    const south = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * 180 / Math.PI;
    
    return { north, south, east, west };
  };

  // Convert pixel coordinates to precise GPS coordinates using tile bounds
  const pixelToGPS = (x: number, y: number, rect: DOMRect, bounds: {north: number, south: number, east: number, west: number}) => {
    const lat = bounds.north - (y / rect.height) * (bounds.north - bounds.south);
    const lng = bounds.west + (x / rect.width) * (bounds.east - bounds.west);
    return { lat, lng };
  };

  // Convert GPS coordinates to pixel coordinates using tile bounds  
  const gpsToPixel = (lat: number, lng: number, rect: DOMRect, bounds: {north: number, south: number, east: number, west: number}) => {
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * rect.width;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * rect.height;
    return { x, y };
  };

  // Robust satellite imagery loading with multiple fallbacks
  const loadSatelliteImagery = async (lat: number, lng: number, zoom: number): Promise<{url: string, provider: string}> => {
    const n = Math.pow(2, zoom);
    const x = Math.floor(n * ((lng + 180) / 360));
    const y = Math.floor(n * (1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2);
    
    // Prioritize FREE HIGH-RESOLUTION IMAGERY for farmers' land mapping
    const providers = [
      {
        url: `https://tiles.openaerialmap.org/tms/${zoom}/${x}/${y}.png`,
        name: 'OpenAerialMap FREE',
        timeout: 5000
      },
      {
        url: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`,
        name: 'Esri Satellite',
        timeout: 4000
      },
      {
        url: `https://mt1.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${zoom}`,
        name: 'Google Satellite',
        timeout: 4000
      },
      {
        url: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/${zoom}/${x}/${y}@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`,
        name: 'Mapbox Satellite',
        timeout: 4000
      },
      {
        url: `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/${zoom}/${y}/${x}.jpg`,
        name: 'Sentinel-2 Satellite',
        timeout: 4000
      },
      {
        url: `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`,
        name: 'OpenStreetMap (fallback)',
        timeout: 2000
      }
    ];

    for (let i = 0; i < providers.length; i++) {
      try {
        const provider = providers[i];
        console.log(`🛰️ Trying provider ${i + 1}: ${provider.name}`);
        
        const imageLoaded = await new Promise<boolean>((resolve) => {
          const img = new Image();
          const timer = setTimeout(() => {
            console.log(`⏰ Provider ${i + 1} timeout`);
            resolve(false);
          }, provider.timeout);
          
          img.onload = () => {
            clearTimeout(timer);
            console.log(`✅ Provider ${i + 1} loaded successfully`);
            resolve(true);
          };
          
          img.onerror = () => {
            clearTimeout(timer);
            console.log(`❌ Provider ${i + 1} failed`);
            resolve(false);
          };
          
          img.src = provider.url;
        });

        if (imageLoaded) {
          return { url: provider.url, provider: provider.name };
        }
      } catch (error) {
        console.log(`❌ Provider ${i + 1} error:`, error);
        continue;
      }
    }

    // Final fallback - use terrain gradient
    console.log('🗺️ Using terrain fallback');
    return { url: '', provider: 'Terrain Map' };
  };

  useEffect(() => {
    if (!mapRef.current) return;

    setStatus('🌍 Getting location...');
    
    // Get user's GPS location or use default
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter({lat, lng});
        setStatus(`📍 Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        initMapWithCoordinates(lat, lng);
      },
      (error) => {
        console.log('📍 GPS not available, using default location');
        setStatus('🗺️ Using default location (Liberia)');
        initMapWithCoordinates(mapCenter.lat, mapCenter.lng);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );

    const initMapWithCoordinates = async (lat: number, lng: number) => {
      setStatus('🛰️ Loading satellite imagery...');
      
      // Calculate precise tile bounds for coordinate alignment
      const bounds = calculateTileBounds(lat, lng, zoomLevel);
      setTileBounds(bounds);
      
      console.log('🗺️ Tile bounds:', bounds);
      console.log('📍 Map center:', { lat, lng });
      
      // Load satellite imagery with fallbacks
      const imagery = await loadSatelliteImagery(lat, lng, zoomLevel);
      setCurrentProvider(imagery.provider);
      
      createMapWithImagery(lat, lng, bounds, imagery);
    };

    const createMapWithImagery = (centerLat: number, centerLng: number, bounds: any, imagery: {url: string, provider: string}) => {
      const n = Math.pow(2, zoomLevel);
      const x = Math.floor(n * ((centerLng + 180) / 360));
      const y = Math.floor(n * (1 - Math.log(Math.tan((centerLat * Math.PI) / 180) + 1 / Math.cos((centerLat * Math.PI) / 180)) / Math.PI) / 2);
      
      const backgroundStyle = imagery.url ? 
        `background-image: url('${imagery.url}'); background-size: cover; background-position: center; background-repeat: no-repeat;` :
        `background: linear-gradient(45deg, #059669 0%, #047857 50%, #065f46 100%);`;
      
      mapRef.current!.innerHTML = `
        <style>
          .real-map { 
            height: 500px; 
            width: 100%;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            position: relative;
            ${backgroundStyle}
            cursor: crosshair;
            overflow: hidden;
          }
          .coordinate-overlay {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 11px;
            z-index: 100;
            max-width: 200px;
          }
          .provider-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(34, 197, 94, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            z-index: 100;
          }
          .gps-indicator {
            position: absolute;
            bottom: 8px;
            left: 8px;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            z-index: 100;
          }
          .gps-marker {
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.8);
            border: 3px solid white;
            transform: translate(-50%, -50%);
            z-index: 15;
            animation: pulse-gps 2s infinite;
          }
          @keyframes pulse-gps {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }
          .map-marker {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
          }
          .marker-start { background-color: #22c55e; }
          .marker-middle { background-color: #3b82f6; }
          .marker-end { background-color: #ef4444; }
          .map-polygon {
            position: absolute;
            pointer-events: none;
            fill: rgba(34, 197, 94, 0.2);
            stroke: #22c55e;
            stroke-width: 3;
            z-index: 5;
          }
        </style>
        <div class="real-map" id="real-map">
          <div class="coordinate-overlay">
            <div>N: ${bounds.north.toFixed(6)}</div>
            <div>S: ${bounds.south.toFixed(6)}</div>
            <div>E: ${bounds.east.toFixed(6)}</div>
            <div>W: ${bounds.west.toFixed(6)}</div>
            <div style="margin-top: 4px;">Zoom: ${zoomLevel}</div>
            <div>Tile: ${x},${y}</div>
          </div>
          <div class="provider-badge">${imagery.provider}</div>
          <div class="gps-indicator" id="gps-indicator" style="display: none;">GPS Active</div>
          <svg class="map-polygon" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          </svg>
        </div>
      `;

      const mapElement = mapRef.current!.querySelector('#real-map') as HTMLElement;
      if (!mapElement) return;

      // Aligned click handler using precise tile bounds
      mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        console.log(`🖱️ Map clicked at pixel: ${clickX}, ${clickY}`);
        
        // Convert pixel coordinates to GPS using precise tile bounds
        const { lat, lng } = pixelToGPS(clickX, clickY, rect, bounds);
        
        console.log(`🎯 GPS coordinates: ${lat.toFixed(8)}, ${lng.toFixed(8)}`);
        
        const newPoint: BoundaryPoint = { 
          latitude: lat, 
          longitude: lng,
          id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          accuracy: 1.0
        };
        
        setPoints(prev => {
          const updated = [...prev, newPoint];
          console.log(`✅ Total points: ${updated.length}`);
          return updated;
        });
      });
      
      setStatus(imagery.url ? 
        `✅ ${imagery.provider} loaded - Click to mark boundaries` : 
        `🗺️ Terrain map ready - Click to mark boundaries`);
      setMapReady(true);
    };
  }, [zoomLevel]);

  // Update boundary display with aligned coordinates
  useEffect(() => {
    if (!mapReady || !tileBounds) return;
    
    const mapContainer = mapRef.current?.querySelector('.real-map') as HTMLElement;
    if (!mapContainer) return;

    // Remove existing markers
    mapContainer.querySelectorAll('.map-marker').forEach(marker => marker.remove());

    // Add markers using aligned coordinates
    points.forEach((point, index) => {
      const marker = document.createElement('div');
      marker.className = `map-marker ${index === 0 ? 'marker-start' : index === points.length - 1 && points.length > 1 ? 'marker-end' : 'marker-middle'}`;
      
      const rect = mapContainer.getBoundingClientRect();
      const { x, y } = gpsToPixel(point.latitude, point.longitude, rect, tileBounds);
      
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.textContent = String.fromCharCode(65 + index); // A, B, C, etc.
      
      // Add click handler for point details
      marker.addEventListener('click', () => {
        setSelectedPointIndex(index);
        setShowBoundaryDetails(true);
      });
      
      mapContainer.appendChild(marker);
    });

    // Show GPS indicator and current position if tracking
    const gpsIndicator = mapContainer.querySelector('#gps-indicator') as HTMLElement;
    if (gpsIndicator) {
      if (isTrackingGPS) {
        gpsIndicator.style.display = 'block';
        gpsIndicator.textContent = `GPS: ±${trackingAccuracy?.toFixed(1)}m`;
      } else {
        gpsIndicator.style.display = 'none';
      }
    }

    // Remove existing GPS marker
    mapContainer.querySelectorAll('.gps-marker').forEach(marker => marker.remove());

    // Add current GPS position marker if tracking
    if (isTrackingGPS && currentGPSPosition && tileBounds) {
      const gpsMarker = document.createElement('div');
      gpsMarker.className = 'gps-marker';
      
      const rect = mapContainer.getBoundingClientRect();
      const { x, y } = gpsToPixel(currentGPSPosition.lat, currentGPSPosition.lng, rect, tileBounds);
      
      gpsMarker.style.left = `${x}px`;
      gpsMarker.style.top = `${y}px`;
      
      mapContainer.appendChild(gpsMarker);
    }

    // Draw polygon if we have 3 or more points
    if (points.length >= 3) {
      const svg = mapContainer.querySelector('svg');
      if (svg) {
        const rect = mapContainer.getBoundingClientRect();
        const pathPoints = points.map(point => {
          const { x, y } = gpsToPixel(point.latitude, point.longitude, rect, tileBounds);
          return `${x},${y}`;
        });
        
        svg.innerHTML = `<polygon points="${pathPoints.join(' ')}" />`;
      }
    }
  }, [points, mapReady, tileBounds, isTrackingGPS, currentGPSPosition, trackingAccuracy]);

  // GPS Tracking Functions
  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      setStatus('❌ GPS not supported on this device');
      return;
    }

    setStatus('🛰️ Starting GPS tracking...');
    setIsTrackingGPS(true);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        setCurrentGPSPosition({ lat, lng });
        setTrackingAccuracy(accuracy);
        setStatus(`📍 GPS Active - Accuracy: ${accuracy.toFixed(1)}m`);
        
        console.log(`🎯 GPS Update: ${lat.toFixed(8)}, ${lng.toFixed(8)} (±${accuracy.toFixed(1)}m)`);
      },
      (error) => {
        console.error('GPS Error:', error);
        setStatus('❌ GPS tracking failed');
        setIsTrackingGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );

    setGpsWatchId(watchId);
  };

  const stopGPSTracking = () => {
    if (gpsWatchId !== null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      setGpsWatchId(null);
    }
    setIsTrackingGPS(false);
    setCurrentGPSPosition(null);
    setTrackingAccuracy(null);
    setStatus('🗺️ GPS tracking stopped');
  };

  const addCurrentGPSPoint = () => {
    if (!currentGPSPosition) {
      setStatus('❌ No GPS position available');
      return;
    }

    const newPoint: BoundaryPoint = {
      latitude: currentGPSPosition.lat,
      longitude: currentGPSPosition.lng,
      id: `gps-point-${Date.now()}`,
      timestamp: new Date(),
      accuracy: trackingAccuracy || 1.0
    };

    setPoints(prev => {
      const updated = [...prev, newPoint];
      setStatus(`📍 GPS point added - Total: ${updated.length} (±${trackingAccuracy?.toFixed(1)}m)`);
      return updated;
    });
  };

  const resetBoundary = () => {
    setPoints([]);
    setStatus('🗺️ Boundary reset - Click to mark new boundaries');
  };

  const completeBoundary = () => {
    if (points.length < minPoints) {
      setStatus(`❌ Need at least ${minPoints} points to complete boundary`);
      return;
    }

    // Calculate area using shoelace formula
    let area = 0;
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2.0;
    const areaInHectares = area * 111000 * 111000 / 10000;

    // Calculate bounds
    const latitudes = points.map(p => p.latitude);
    const longitudes = points.map(p => p.longitude);
    
    const boundaryData: BoundaryData = {
      points,
      area: areaInHectares,
      bounds: {
        north: Math.max(...latitudes),
        south: Math.min(...latitudes),
        east: Math.max(...longitudes),
        west: Math.min(...longitudes)
      }
    };

    setStatus(`✅ Boundary completed - ${areaInHectares.toFixed(2)} hectares`);
    onBoundaryComplete(boundaryData);
  };

  // Calculate distance between two GPS points
  const calculateDistance = (point1: BoundaryPoint, point2: BoundaryPoint): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = point1.latitude * Math.PI / 180;
    const φ2 = point2.latitude * Math.PI / 180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI / 180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  // Calculate total perimeter
  const calculatePerimeter = (): number => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += calculateDistance(points[i], points[i + 1]);
    }
    
    // Add distance from last point back to first point if we have 3+ points
    if (points.length >= 3) {
      totalDistance += calculateDistance(points[points.length - 1], points[0]);
    }
    
    return totalDistance;
  };

  // Get current mapping statistics
  const getMappingStats = () => {
    if (points.length === 0) return null;
    
    // Calculate area if we have 3+ points
    let area = 0;
    if (points.length >= 3) {
      const n = points.length;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        area += points[i].latitude * points[j].longitude;
        area -= points[j].latitude * points[i].longitude;
      }
      area = Math.abs(area) / 2.0;
      area = area * 111000 * 111000 / 10000; // Convert to hectares
    }
    
    const perimeter = calculatePerimeter();
    
    return {
      pointCount: points.length,
      area: area,
      perimeter: perimeter,
      isComplete: points.length >= 3
    };
  };

  const stats = getMappingStats();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">{status}</p>
        <div className="flex gap-2 justify-center mb-2">
          <Button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
            variant="outline"
            size="sm"
          >
            <Satellite className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
          <Button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 10))}
            variant="outline"
            size="sm"
          >
            <Satellite className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
        </div>
        
        <div className="flex gap-2 justify-center mb-2">
          {!isTrackingGPS ? (
            <Button
              onClick={startGPSTracking}
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Start GPS
            </Button>
          ) : (
            <>
              <Button
                onClick={stopGPSTracking}
                variant="destructive"
                size="sm"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Stop GPS
              </Button>
              <Button
                onClick={addCurrentGPSPoint}
                variant="default"
                size="sm"
                disabled={!currentGPSPosition}
                className="bg-green-600 hover:bg-green-700"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Add GPS Point
              </Button>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500">Provider: {currentProvider}</p>
      </div>
      
      <div ref={mapRef} className="w-full" />
      
      {/* Interactive Boundary Details */}
      {points.length > 0 && (
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">🗺️ Boundary Mapping Progress</h3>
            <Button
              onClick={() => setShowBoundaryDetails(!showBoundaryDetails)}
              variant="outline"
              size="sm"
            >
              {showBoundaryDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
          
          {/* Mapping Statistics */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600">Points Mapped</div>
                <div className="text-xl font-bold text-blue-600">{stats.pointCount}</div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600">Perimeter</div>
                <div className="text-xl font-bold text-green-600">
                  {stats.perimeter > 0 ? `${(stats.perimeter).toFixed(0)}m` : '-'}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600">Area</div>
                <div className="text-xl font-bold text-orange-600">
                  {stats.area > 0 ? `${stats.area.toFixed(2)} ha` : '-'}
                </div>
              </div>
              <div className="bg-white p-3 rounded border">
                <div className="text-sm text-gray-600">Status</div>
                <div className="text-sm font-bold">
                  {stats.isComplete ? 
                    <span className="text-green-600">✅ Complete</span> : 
                    <span className="text-yellow-600">🔄 In Progress</span>
                  }
                </div>
              </div>
            </div>
          )}
          
          {/* Point Details */}
          {showBoundaryDetails && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">📍 Boundary Points</h4>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {points.map((point, index) => (
                  <div 
                    key={point.id || index}
                    className={`flex justify-between items-center p-2 rounded text-sm cursor-pointer transition-colors ${
                      selectedPointIndex === index ? 'bg-blue-100 border border-blue-300' : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPointIndex(selectedPointIndex === index ? null : index)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        index === 0 ? 'bg-green-500' : 
                        index === points.length - 1 && points.length > 1 ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-mono text-xs">
                        {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {point.accuracy ? `±${point.accuracy.toFixed(1)}m` : 'GPS'}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Selected Point Details */}
              {selectedPointIndex !== null && points[selectedPointIndex] && (
                <div className="bg-blue-50 p-3 rounded border">
                  <h5 className="font-medium text-blue-800">
                    Point {String.fromCharCode(65 + selectedPointIndex)} Details
                  </h5>
                  <div className="mt-2 space-y-1 text-sm">
                    <div><strong>Coordinates:</strong> {points[selectedPointIndex].latitude.toFixed(8)}, {points[selectedPointIndex].longitude.toFixed(8)}</div>
                    <div><strong>Accuracy:</strong> ±{points[selectedPointIndex].accuracy?.toFixed(1) || '1.0'}m</div>
                    <div><strong>Timestamp:</strong> {points[selectedPointIndex].timestamp?.toLocaleString() || 'N/A'}</div>
                    {selectedPointIndex > 0 && (
                      <div><strong>Distance from previous:</strong> {calculateDistance(points[selectedPointIndex - 1], points[selectedPointIndex]).toFixed(1)}m</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Points: {points.length}/{maxPoints} (Min: {minPoints})
        </div>
        <div className="flex gap-2">
          <Button
            onClick={resetBoundary}
            variant="outline"
            size="sm"
            disabled={points.length === 0}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={completeBoundary}
            disabled={points.length < minPoints}
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Complete ({points.length})
          </Button>
        </div>
      </div>
    </div>
  );
}