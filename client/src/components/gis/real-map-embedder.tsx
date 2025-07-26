import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, MapPin, Globe, ExternalLink } from 'lucide-react';

const MAP_SOURCES = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org/export/embed.html?bbox=-11.31,4.21,-7.27,8.34&layer=mapnik',
    description: 'Open source map with detailed geographical features'
  },
  {
    id: 'bing',
    name: 'Bing Maps',
    url: 'https://www.bing.com/maps/embed?h=400&w=100%&cp=6.428~-9.430&lvl=7&typ=d&sty=r&src=SHELL&FORM=MBEDV8',
    description: 'Microsoft satellite and road map integration'
  },
  {
    id: 'esri',
    name: 'ArcGIS',
    url: 'https://www.arcgis.com/apps/Embed/index.html?webmap=10df2279f9684e4a9f6a7f08febac2a9&extent=-11.5,4,-7,8.5&zoom=true&scale=true&legend=true&basemap_gallery=true',
    description: 'Professional GIS mapping with detailed layers'
  }
];

export default function RealMapEmbedder() {
  const [activeMap, setActiveMap] = useState(MAP_SOURCES[0]);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errorStates, setErrorStates] = useState<Record<string, boolean>>({});

  const handleMapLoad = (mapId: string) => {
    setLoadingStates(prev => ({ ...prev, [mapId]: false }));
    console.log(`Map ${mapId} loaded successfully`);
  };

  const handleMapError = (mapId: string) => {
    setErrorStates(prev => ({ ...prev, [mapId]: true }));
    setLoadingStates(prev => ({ ...prev, [mapId]: false }));
    console.log(`Map ${mapId} failed to load`);
  };

  const switchMap = (mapSource: typeof MAP_SOURCES[0]) => {
    setActiveMap(mapSource);
    setLoadingStates(prev => ({ ...prev, [mapSource.id]: true }));
    setErrorStates(prev => ({ ...prev, [mapSource.id]: false }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Real Liberia Map Viewer
        </CardTitle>
        <div className="flex gap-2 flex-wrap">
          {MAP_SOURCES.map((source) => (
            <Button
              key={source.id}
              variant={activeMap.id === source.id ? "default" : "outline"}
              size="sm"
              onClick={() => switchMap(source)}
              className="flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" />
              {source.name}
              {errorStates[source.id] && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  Error
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        <div className="relative w-full h-[400px] bg-gray-100">
          {/* Loading state */}
          {loadingStates[activeMap.id] && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading {activeMap.name}...</span>
              </div>
            </div>
          )}
          
          {/* Error state */}
          {errorStates[activeMap.id] && (
            <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
              <div className="text-center p-6">
                <div className="text-red-600 font-semibold mb-2">
                  Failed to load {activeMap.name}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchMap(activeMap)}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            </div>
          )}
          
          {/* Map iframe */}
          <iframe
            src={activeMap.url}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title={`Liberia Map - ${activeMap.name}`}
            onLoad={() => handleMapLoad(activeMap.id)}
            onError={() => handleMapError(activeMap.id)}
          />
          
          {/* Map info overlay */}
          <div className="absolute top-4 left-4 bg-white bg-opacity-95 px-3 py-2 rounded-lg shadow-lg">
            <div className="text-sm font-semibold">🇱🇷 Republic of Liberia</div>
            <div className="text-xs text-gray-600">{activeMap.description}</div>
          </div>
          
          {/* External link button */}
          <div className="absolute top-4 right-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(activeMap.url, '_blank')}
              className="bg-white bg-opacity-95"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Geographic details */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold">Center Coordinates</div>
              <div className="text-gray-600">6.428°N, 9.430°W</div>
            </div>
            <div>
              <div className="font-semibold">Bounding Box</div>
              <div className="text-gray-600">8.34°N to 4.21°N</div>
            </div>
            <div>
              <div className="font-semibold">Total Area</div>
              <div className="text-gray-600">111,369 km²</div>
            </div>
            <div>
              <div className="font-semibold">Map Source</div>
              <div className="text-gray-600">{activeMap.name}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}