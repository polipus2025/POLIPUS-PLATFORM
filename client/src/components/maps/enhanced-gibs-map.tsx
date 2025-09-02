/**
 * 🛰️ Enhanced GIBS Satellite Map Component
 * 
 * This component provides enhanced satellite imagery using NASA's GIBS API
 * while maintaining full compatibility with the existing system interface.
 * 
 * Features:
 * - High-resolution NASA satellite imagery
 * - Multiple layer support (VIIRS, MODIS, NDVI)
 * - Enhanced quality for Liberia region
 * - Seamless integration with existing mapping functionality
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Satellite, 
  Layers, 
  Zap, 
  RefreshCw, 
  MapPin,
  Eye,
  Settings
} from 'lucide-react';
import { gibsSatelliteService } from '@/services/gibs-satellite-service';

interface EnhancedGIBSMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onBoundaryChange?: (boundaries: any) => void;
  onLocationChange?: (location: any) => void;
  enableDrawing?: boolean;
  enableLayerControl?: boolean;
  height?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

export default function EnhancedGIBSMap({
  center = [6.428, -9.429], // Liberia center
  zoom = 8,
  className = "",
  onBoundaryChange,
  onLocationChange,
  enableDrawing = true,
  enableLayerControl = true,
  height = "500px"
}: EnhancedGIBSMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [currentLayer, setCurrentLayer] = useState('VIIRS_SNPP_CorrectedReflectance_TrueColor');
  const [isLoading, setIsLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Dynamically load Leaflet if not already loaded
    if (!window.L) {
      const leafletScript = document.createElement('script');
      leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletScript.onload = () => {
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(leafletCSS);
        
        // Load drawing plugin if drawing is enabled
        if (enableDrawing) {
          const drawScript = document.createElement('script');
          drawScript.src = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.js';
          drawScript.onload = () => {
            const drawCSS = document.createElement('link');
            drawCSS.rel = 'stylesheet';
            drawCSS.href = 'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css';
            document.head.appendChild(drawCSS);
            initializeMap();
          };
          document.head.appendChild(drawScript);
        } else {
          initializeMap();
        }
      };
      document.head.appendChild(leafletScript);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    try {
      // Initialize map
      const map = window.L.map(mapRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Add enhanced GIBS satellite layer
      const gibsLayer = gibsSatelliteService.createLeafletLayer(currentLayer);
      const satelliteLayer = window.L.tileLayer(gibsLayer.url, {
        ...gibsLayer.options,
        attribution: '© NASA GIBS / Earthdata | Enhanced Satellite Imagery'
      });
      
      satelliteLayer.addTo(map);

      // Add OSM as fallback layer
      const osmLayer = window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      });

      // Layer control if enabled
      if (enableLayerControl) {
        const baseLayers = {
          "🛰️ NASA Enhanced Satellite": satelliteLayer,
          "🗺️ OpenStreetMap": osmLayer
        };
        
        window.L.control.layers(baseLayers).addTo(map);
      }

      // Drawing controls if enabled
      if (enableDrawing && window.L.Control && window.L.Control.Draw) {
        const drawnItems = new window.L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new window.L.Control.Draw({
          edit: {
            featureGroup: drawnItems
          },
          draw: {
            polygon: true,
            rectangle: true,
            circle: true,
            marker: true,
            polyline: false,
            circlemarker: false
          }
        });
        
        map.addControl(drawControl);

        // Handle drawing events
        map.on('draw:created', function (e: any) {
          const layer = e.layer;
          drawnItems.addLayer(layer);
          
          if (onBoundaryChange) {
            const geoJSON = layer.toGeoJSON();
            onBoundaryChange({
              type: e.layerType,
              coordinates: geoJSON.geometry.coordinates,
              area: calculateArea(geoJSON),
              bounds: layer.getBounds()
            });
          }
        });
      }

      // Handle map clicks
      map.on('click', function(e: any) {
        if (onLocationChange) {
          onLocationChange({
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            coordinates: [e.latlng.lat, e.latlng.lng]
          });
        }
      });

      mapInstanceRef.current = map;
      setMapReady(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing GIBS enhanced map:', error);
      setIsLoading(false);
    }
  };

  const calculateArea = (geoJSON: any): number => {
    // Simple area calculation for demonstration
    // In production, use turf.js or similar for accurate area calculation
    if (geoJSON.geometry.type === 'Polygon') {
      return 2.5; // Placeholder hectares
    }
    return 0;
  };

  const switchLayer = (newLayer: string) => {
    if (!mapInstanceRef.current) return;
    
    setIsLoading(true);
    setCurrentLayer(newLayer);
    
    try {
      // Remove existing layers
      mapInstanceRef.current.eachLayer((layer: any) => {
        if (layer._url && layer._url.includes('gibs.earthdata.nasa.gov')) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add new GIBS layer
      const gibsLayer = gibsSatelliteService.createLeafletLayer(newLayer);
      const satelliteLayer = window.L.tileLayer(gibsLayer.url, {
        ...gibsLayer.options,
        attribution: '© NASA GIBS / Earthdata | Enhanced Satellite Imagery'
      });
      
      satelliteLayer.addTo(mapInstanceRef.current);
      setIsLoading(false);
    } catch (error) {
      console.error('Error switching GIBS layer:', error);
      setIsLoading(false);
    }
  };

  const refreshMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      switchLayer(currentLayer);
    }
  };

  const availableLayers = gibsSatelliteService.getAvailableLayers();

  return (
    <div className={`relative ${className}`}>
      {/* Enhanced Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <Card className="p-2 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Satellite className="h-4 w-4 text-blue-600" />
            <Badge variant="outline" className="text-xs">
              NASA GIBS Enhanced
            </Badge>
          </div>
        </Card>

        {enableLayerControl && (
          <Card className="p-3 bg-white/95 backdrop-blur-sm min-w-[200px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="text-sm font-medium">Satellite Layer</span>
              </div>
              <Select value={currentLayer} onValueChange={switchLayer}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableLayers.map((layer) => (
                    <SelectItem key={layer.identifier} value={layer.identifier}>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{layer.title}</span>
                        <span className="text-xs text-muted-foreground">{layer.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        )}

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={refreshMap}
            className="h-8 w-8 p-0 bg-white/95"
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-lg">
            <Satellite className="h-4 w-4 animate-pulse text-blue-600" />
            <span className="text-sm">Loading Enhanced Satellite Imagery...</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div 
        ref={mapRef} 
        style={{ height, width: '100%' }}
        className="rounded-lg overflow-hidden border border-gray-200"
      />

      {/* Quality Indicator */}
      {mapReady && (
        <div className="absolute bottom-4 left-4 z-[1000]">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            Enhanced Quality
          </Badge>
        </div>
      )}
    </div>
  );
}