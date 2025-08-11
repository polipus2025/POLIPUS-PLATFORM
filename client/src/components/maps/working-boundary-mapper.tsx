import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area: number; // in hectares
}

interface WorkingBoundaryMapperProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  minPoints?: number;
}

export default function WorkingBoundaryMapper({ 
  onBoundaryComplete, 
  minPoints = 3 
}: WorkingBoundaryMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const markersRef = useRef<any[]>([]);
  const polygonRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      try {
        // Import Leaflet
        const L = (await import('leaflet')).default;
        
        // Load CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          
          // Wait for CSS to load
          await new Promise(resolve => {
            link.onload = resolve;
            setTimeout(resolve, 500);
          });
        }

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map - Monrovia, Liberia coordinates
        const liberiaCenter: [number, number] = [6.4281, -9.4295];
        mapInstanceRef.current = L.map(mapRef.current).setView(liberiaCenter, 15);

        // Add tile layer
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 20
        });
        
        tileLayer.addTo(mapInstanceRef.current);
        
        // Handle tile loading
        tileLayer.on('load', () => {
          setIsMapReady(true);
        });
        
        tileLayer.on('tileerror', (e) => {
        });

        // Handle map clicks to add boundary points
        mapInstanceRef.current.on('click', (e: any) => {
          const newPoint: BoundaryPoint = {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          };
          
          setPoints(prev => [...prev, newPoint]);
        });

        // Force resize
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);


      } catch (error) {
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers and polygon when points change
  useEffect(() => {
    const updateMapDisplay = async () => {
      if (!mapInstanceRef.current || !isMapReady) return;

      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => {
        mapInstanceRef.current.removeLayer(marker);
      });
      markersRef.current = [];

      // Clear existing polygon
      if (polygonRef.current) {
        mapInstanceRef.current.removeLayer(polygonRef.current);
        polygonRef.current = null;
      }

      // Add markers for each point
      points.forEach((point, index) => {
        const isFirst = index === 0;
        const isLast = index === points.length - 1;
        
        const markerColor = isFirst ? 'green' : isLast ? 'red' : 'blue';
        
        const marker = L.circleMarker([point.latitude, point.longitude], {
          color: markerColor,
          fillColor: markerColor,
          fillOpacity: 0.7,
          radius: 8
        }).addTo(mapInstanceRef.current);
        
        marker.bindPopup(`Point ${index + 1}${isFirst ? ' (Start)' : isLast ? ' (End)' : ''}`);
        markersRef.current.push(marker);
      });

      // Draw polygon if we have at least 3 points
      if (points.length >= 3) {
        const latLngs: [number, number][] = points.map(p => [p.latitude, p.longitude]);
        
        polygonRef.current = L.polygon(latLngs, {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          weight: 2
        }).addTo(mapInstanceRef.current);
        
        // Fit map to show all points
        mapInstanceRef.current.fitBounds(polygonRef.current.getBounds(), { padding: [20, 20] });
      }
    };

    updateMapDisplay();
  }, [points, isMapReady]);

  // Calculate area (simple approximation)
  const calculateArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    // Use proper spherical area calculation for GPS coordinates
    let area = 0;
    const earthRadius = 6371000; // Earth's radius in meters
    
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const lat1 = points[i].latitude * Math.PI / 180;
      const lat2 = points[j].latitude * Math.PI / 180;
      const lon1 = points[i].longitude * Math.PI / 180;
      const lon2 = points[j].longitude * Math.PI / 180;
      
      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    
    area = Math.abs(area * earthRadius * earthRadius / 2);
    // Convert from square meters to hectares (1 hectare = 10,000 m²)
    return parseFloat((area / 10000).toFixed(4));
  };

  const handleReset = () => {
    setPoints([]);
  };

  const handleComplete = () => {
    if (points.length >= minPoints) {
      const area = calculateArea(points);
      onBoundaryComplete({
        points,
        area
      });
    }
  };

  const canComplete = points.length >= minPoints;
  const area = calculateArea(points);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Farm Boundary Mapping Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on the map to add boundary points</li>
          <li>• Green marker = start point, Blue = middle points, Red = end point</li>
          <li>• Need at least {minPoints} points to complete boundary</li>
          <li>• Points will automatically connect to form farm boundary</li>
        </ul>
      </div>

      {/* Status */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Points added: {points.length}</span>
          {area > 0 && <span className="ml-4 text-green-600">Area: ~{area.toFixed(2)} hectares</span>}
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
            Complete Boundary
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-96 border border-gray-300 rounded-lg bg-gray-100"
        style={{ minHeight: '400px' }}
      />

      {/* Map Status */}
      <div className="text-xs text-gray-500">
        {isMapReady ? (
          <span className="text-green-600">✓ Map loaded - Click to add boundary points</span>
        ) : (
          <span>Loading map tiles...</span>
        )}
      </div>
    </div>
  );
}