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
  const [status, setStatus] = useState('Loading satellite imagery...');
  const [mapReady, setMapReady] = useState(false);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({lat: 6.4281, lng: -9.4295});
  const [tileBounds, setTileBounds] = useState<{north: number, south: number, east: number, west: number} | null>(null);
  const [zoomLevel, setZoomLevel] = useState(18);

  // Calculate precise tile bounds for coordinate alignment
  const calculateTileBounds = (lat: number, lng: number, zoom: number) => {
    const n = Math.pow(2, zoom);
    const x = Math.floor(n * ((lng + 180) / 360));
    const y = Math.floor(n * (1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2);
    
    // Calculate exact bounds of the tile
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

  useEffect(() => {
    if (!mapRef.current) return;

    // Get user's GPS location or use default
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter({lat, lng});
        setStatus(`Loading satellite imagery for ${lat.toFixed(6)}, ${lng.toFixed(6)}...`);
        initMapWithCoordinates(lat, lng);
      },
      (error) => {
        console.log('GPS not available, using default location');
        setStatus('Loading satellite imagery for default location...');
        initMapWithCoordinates(mapCenter.lat, mapCenter.lng);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );

    const initMapWithCoordinates = (lat: number, lng: number) => {
      // Calculate precise tile bounds for coordinate alignment
      const bounds = calculateTileBounds(lat, lng, zoomLevel);
      setTileBounds(bounds);
      
      console.log('🗺️ Tile bounds calculated:', bounds);
      console.log('📍 Map center:', { lat, lng });
      
      createMapWithTile(lat, lng, bounds);
    };

    const createMapWithTile = (centerLat: number, centerLng: number, bounds: {north: number, south: number, east: number, west: number}) => {
      // Calculate tile coordinates
      const n = Math.pow(2, zoomLevel);
      const x = Math.floor(n * ((centerLng + 180) / 360));
      const y = Math.floor(n * (1 - Math.log(Math.tan((centerLat * Math.PI) / 180) + 1 / Math.cos((centerLat * Math.PI) / 180)) / Math.PI) / 2);
      
      const tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoomLevel}/${y}/${x}`;
      
      mapRef.current!.innerHTML = `
        <style>
          .real-map { 
            height: 500px; 
            width: 100%;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            position: relative;
            background: url('${tileUrl}') center/cover no-repeat;
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
            font-size: 12px;
            z-index: 100;
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
            Bounds: N${bounds.north.toFixed(6)} S${bounds.south.toFixed(6)}<br>
            E${bounds.east.toFixed(6)} W${bounds.west.toFixed(6)}<br>
            Zoom: ${zoomLevel} | Tile: ${x},${y}
          </div>
          <svg class="map-polygon" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          </svg>
        </div>
      `;

      const mapElement = mapRef.current!.querySelector('#real-map') as HTMLElement;
      if (!mapElement) return;

      // Aligned click handler using precise tile bounds
      mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        console.log(`🖱️ Map clicked at pixel: ${x}, ${y}`);
        
        // Convert pixel coordinates to GPS using precise tile bounds
        const { lat, lng } = pixelToGPS(x, y, rect, bounds);
        
        console.log(`🎯 Aligned GPS coordinates: ${lat.toFixed(8)}, ${lng.toFixed(8)}`);
        
        const newPoint: BoundaryPoint = { 
          latitude: lat, 
          longitude: lng,
          id: `point-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          accuracy: 1.0
        };
        
        setPoints(prev => {
          const updated = [...prev, newPoint];
          console.log(`✅ Points total: ${updated.length}`);
          return updated;
        });
      });
      
      setStatus(`Satellite imagery loaded - Coordinates aligned with tile bounds`);
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
      
      mapContainer.appendChild(marker);
    });

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
  }, [points, mapReady, tileBounds]);

  const resetBoundary = () => {
    setPoints([]);
  };

  const completeBoundary = () => {
    if (points.length < minPoints) {
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
    const areaInHectares = area * 111000 * 111000 / 10000; // Convert to hectares

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

    onBoundaryComplete(boundaryData);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">{status}</p>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
            variant="outline"
            size="sm"
          >
            Zoom In
          </Button>
          <Button
            onClick={() => setZoomLevel(prev => Math.max(prev - 1, 10))}
            variant="outline"
            size="sm"
          >
            Zoom Out
          </Button>
        </div>
      </div>
      
      <div ref={mapRef} className="w-full" />
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Points marked: {points.length}/{maxPoints} (Min: {minPoints})
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
            Complete Boundary
          </Button>
        </div>
      </div>
    </div>
  );
}