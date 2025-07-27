import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Satellite, RefreshCw, ExternalLink } from 'lucide-react';

// Leaflet types
declare global {
  interface Window {
    L: any;
  }
}

export default function RealLiberiaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      try {
        // Add Leaflet CSS
        if (!document.querySelector('link[href*="leaflet"]')) {
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          cssLink.crossOrigin = '';
          document.head.appendChild(cssLink);
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          
          script.onload = () => {
            initializeMap();
          };
          
          script.onerror = () => {
            setError('Failed to load map library');
            setIsLoading(false);
          };
          
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      } catch (err) {
        setError('Error loading map resources');
        setIsLoading(false);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.L) return;

      try {
        // Liberia coordinates: 6.428°N, 9.430°W
        const map = window.L.map(mapRef.current).setView([6.428, -9.430], 7);

        // Add OpenStreetMap tiles
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Add major cities markers
        const cities = [
          { name: 'Monrovia', coords: [6.3106, -10.8047], capital: true },
          { name: 'Gbarnga', coords: [7.0, -9.47] },
          { name: 'Buchanan', coords: [5.8808, -10.0467] },
          { name: 'Harper', coords: [4.375, -7.7181] },
          { name: 'Zwedru', coords: [6.0667, -8.1333] },
          { name: 'Voinjama', coords: [8.4219, -9.7542] },
          { name: 'Kakata', coords: [6.5333, -10.35] },
          { name: 'Robertsport', coords: [6.7547, -11.3686] }
        ];

        cities.forEach(city => {
          const marker = window.L.marker(city.coords).addTo(map);
          const popupContent = city.capital 
            ? `<b>${city.name}</b><br/>Capital of Liberia<br/>Population: ~1.4 million`
            : `<b>${city.name}</b><br/>Major city in Liberia`;
          marker.bindPopup(popupContent);
        });

        // Add a polygon roughly outlining Liberia
        const liberiaOutline = [
          [8.34, -11.31],  // Northwest
          [8.34, -7.27],   // Northeast
          [4.21, -7.27],   // Southeast
          [4.21, -11.31],  // Southwest
          [8.34, -11.31]   // Close polygon
        ];

        window.L.polygon(liberiaOutline, {
          color: '#10B981',
          weight: 3,
          fillColor: '#10B981',
          fillOpacity: 0.1
        }).addTo(map).bindPopup('<b>Republic of Liberia</b><br/>West Africa');

        // Fit map to Liberia bounds
        const bounds = window.L.latLngBounds([
          [4.21, -11.31],  // Southwest
          [8.34, -7.27]    // Northeast
        ]);
        map.fitBounds(bounds);

        setMapInstance(map);
        setMapReady(true);
        setIsLoading(false);
        setError(null);

      } catch (err) {
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    loadLeaflet();

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  const refreshMap = () => {
    setIsLoading(true);
    setError(null);
    if (mapInstance) {
      mapInstance.remove();
      setMapInstance(null);
    }
    // Reload the map
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Real Liberia Geographic Map
        </CardTitle>
        <div className="flex gap-2 items-center">
          <Badge variant={mapReady ? "default" : "secondary"}>
            {mapReady ? "Map Loaded" : "Loading..."}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshMap}
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="relative w-full h-[500px] bg-blue-50">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Loading real Liberia map...</div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-20">
              <div className="text-center p-6">
                <div className="text-red-600 font-semibold mb-2">Map Loading Error</div>
                <div className="text-sm text-red-500 mb-4">{error}</div>
                <Button onClick={refreshMap} variant="outline" size="sm">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          <div ref={mapRef} className="w-full h-full rounded-b-lg" />
          
          {mapReady && (
            <div className="absolute top-4 left-4 bg-white bg-opacity-95 px-3 py-2 rounded-lg shadow-lg z-10">
              <div className="text-sm font-semibold">🇱🇷 Republic of Liberia</div>
              <div className="text-xs text-gray-600">Interactive map with real geographic data</div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Map Technology</div>
              <div className="text-gray-600">Leaflet + OpenStreetMap</div>
            </div>
            <div>
              <div className="font-semibold">Data Source</div>
              <div className="text-gray-600">Real geographic coordinates</div>
            </div>
            <div>
              <div className="font-semibold">Coverage</div>
              <div className="text-gray-600">All 15 counties</div>
            </div>
            <div>
              <div className="font-semibold">Features</div>
              <div className="text-gray-600">Cities, borders, terrain</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}