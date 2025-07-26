import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Layers, Target, Satellite, Map as MapIcon, Search, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function InteractiveMap() {
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapView, setMapView] = useState<'satellite' | 'roadmap' | 'terrain'>('satellite');
  const [measureMode, setMeasureMode] = useState(false);

  // Fetch GIS data
  const { data: gisData = [] } = useQuery({
    queryKey: ['/api/gis/locations/', selectedCounty !== 'all' ? selectedCounty : ''],
  }) as { data: any[] };

  // Map layers configuration
  const [mapLayers, setMapLayers] = useState([
    { id: 'counties', name: 'County Boundaries', visible: true, color: '#3B82F6' },
    { id: 'farms', name: 'Farm Plots', visible: true, color: '#10B981' },
    { id: 'roads', name: 'Transportation Routes', visible: false, color: '#EF4444' },
    { id: 'compliance', name: 'Compliance Zones', visible: false, color: '#8B5CF6' }
  ]);

  const toggleLayer = (layerId: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const liberiaCounties = [
    'Montserrado', 'Lofa', 'Nimba', 'Bong', 'Grand Bassa', 'Maryland', 
    'Grand Gedeh', 'River Cess', 'Sinoe', 'Bomi', 'Gbarpolu', 
    'Grand Cape Mount', 'Margibi', 'Grand Kru', 'River Gee'
  ];

  // Handle county selection from dropdown
  const handleCountySelect = (county: string) => {
    setSelectedCounty(county);
    // Show county info when selected
    if (county !== 'all') {
      console.log(`Selected county: ${county}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Map Controls */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Map Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* County Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">County Filter</label>
              <Select value={selectedCounty} onValueChange={handleCountySelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select County" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  {liberiaCounties.map(county => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Map View Mode */}
            <div>
              <label className="text-sm font-medium mb-2 block">Map View</label>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  variant={mapView === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('satellite')}
                  className="text-xs"
                >
                  <Satellite className="h-3 w-3 mr-1" />
                  Satellite
                </Button>
                <Button
                  variant={mapView === 'roadmap' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('roadmap')}
                  className="text-xs"
                >
                  <MapIcon className="h-3 w-3 mr-1" />
                  Roadmap
                </Button>
                <Button
                  variant={mapView === 'terrain' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('terrain')}
                  className="text-xs"
                >
                  <Layers className="h-3 w-3 mr-1" />
                  Terrain
                </Button>
              </div>
            </div>

            {/* Search Location */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search Location</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Map Layers */}
            <div>
              <label className="text-sm font-medium mb-2 block">Map Layers</label>
              <div className="space-y-2">
                {mapLayers.map(layer => (
                  <div key={layer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="text-sm">{layer.name}</span>
                    </div>
                    <Button
                      variant={layer.visible ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleLayer(layer.id)}
                      className="h-6 px-2 text-xs"
                    >
                      {layer.visible ? 'ON' : 'OFF'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <label className="text-sm font-medium mb-2 block">Map Tools</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={measureMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMeasureMode(!measureMode)}
                  className="text-xs"
                >
                  <Target className="h-3 w-3 mr-1" />
                  Measure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current View Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Current View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Mode:</span>
                <Badge variant="secondary" className="capitalize">
                  {mapView}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">County:</span>
                <Badge variant="outline">
                  {selectedCounty === 'all' ? 'All Counties' : selectedCounty}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Layers:</span>
                <span className="font-medium">
                  {mapLayers.filter(l => l.visible).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Info */}
        {selectedCounty && selectedCounty !== 'all' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">{selectedCounty} County</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Farms:</span>
                  <span className="font-medium">{(gisData as any[]).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Plots:</span>
                  <span className="font-medium">{Math.floor((gisData as any[]).length * 1.3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mapped Area:</span>
                  <span className="font-medium">{((gisData as any[]).length * 45.2).toFixed(1)} ha</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Map */}
      <div className="lg:col-span-3">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapIcon className="h-5 w-5" />
              Interactive GIS Map - Republic of Liberia
              {selectedCounty !== 'all' && (
                <Badge variant="secondary">{selectedCounty}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 relative">
            <div className="relative w-full h-[520px] bg-gradient-to-br from-blue-100 via-green-50 to-blue-100 rounded-b-lg overflow-hidden">
              
              {/* Map Display with Multiple Options */}
              <div className="absolute inset-0 bg-white">
                {/* Map Header */}
                <div className="absolute top-2 left-2 bg-white/95 px-3 py-2 rounded-lg shadow-sm z-10 text-sm font-medium">
                  Republic of Liberia - Agricultural GIS Map
                </div>
                
                {/* Try multiple map sources */}
                <div className="w-full h-full">
                  {/* Option 1: Bing Maps (often more reliable) */}
                  <iframe
                    src="https://www.bing.com/maps/embed?h=520&w=100%&cp=6.428~-9.429&lvl=7&typ=d&sty=r&src=SHELL&FORM=MBEDV8"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    title="Liberia Map"
                    className="rounded-b-lg"
                    onError={(e) => {
                      console.log('Bing Maps failed, trying OpenStreetMap...');
                      (e.target as HTMLIFrameElement).style.display = 'none';
                      const backup = document.getElementById('osm-backup');
                      if (backup) backup.style.display = 'block';
                    }}
                  ></iframe>
                  
                  {/* Backup Option 2: OpenStreetMap */}
                  <iframe
                    id="osm-backup"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-11.5,4.0,-7.5,8.5&layer=mapnik"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', display: 'none' }}
                    title="Liberia Map - OpenStreetMap"
                    className="rounded-b-lg"
                    onError={(e) => {
                      console.log('OpenStreetMap also failed, showing fallback...');
                      (e.target as HTMLIFrameElement).style.display = 'none';
                      const fallback = document.getElementById('map-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  ></iframe>
                  
                  {/* Final Fallback: Static representation */}
                  <div id="map-fallback" className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 hidden">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-8">
                        <div className="text-6xl mb-4">🗺️</div>
                        <div className="text-xl font-bold text-gray-700 mb-2">Republic of Liberia</div>
                        <div className="text-sm text-gray-600 mb-4">West African Geographic Region</div>
                        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                          <div>Capital: Monrovia</div>
                          <div>Coordinates: 6.4°N, 9.4°W</div>
                          <div>Counties: 15</div>
                          <div>Area: 111,369 km²</div>
                        </div>
                        <div className="mt-4 text-xs text-gray-400">
                          Geographic map data temporarily unavailable
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Simple data indicators in corners - not covering map */}
                <div className="absolute bottom-2 left-2 bg-green-100/95 px-3 py-2 rounded-lg shadow-sm text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>{(gisData as any[]).length} Farm Locations</span>
                  </div>
                </div>
                
                <div className="absolute bottom-2 right-2 bg-blue-100/95 px-3 py-2 rounded-lg shadow-sm text-sm">
                  <div className="text-gray-600">
                    Center: Monrovia, Liberia
                  </div>
                </div>
              </div>

              {/* Map Controls Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button size="sm" variant="secondary">
                  <Target className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>

              {/* Coordinates Display */}
              <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded text-sm">
                <div className="flex gap-4">
                  <span>Lat: 6.428°N</span>
                  <span>Lon: 9.429°W</span>
                  <span>Zoom: {mapView === 'satellite' ? '12' : '10'}</span>
                </div>
              </div>

              {/* Active Layers Info */}
              <div className="absolute top-4 left-4 bg-white/90 px-3 py-2 rounded">
                <div className="flex gap-2 flex-wrap">
                  {mapLayers.filter(layer => layer.visible).map(layer => (
                    <Badge key={layer.id} variant="secondary" className="text-xs">
                      {layer.name}
                    </Badge>
                  ))}
                </div>
                {selectedCounty && selectedCounty !== 'all' && (
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="default" className="text-xs bg-blue-600">
                      {selectedCounty}
                    </Badge>
                    <span className="text-xs text-gray-600">
                      {(gisData as any[]).length} locations found
                    </span>
                  </div>
                )}
              </div>

              {/* Measurement Tools */}
              {measureMode && (
                <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-2 rounded">
                  <div className="text-sm">
                    <div>Distance: 12.4 km</div>
                    <div>Area: 148.7 hectares</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}