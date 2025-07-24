import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Search, 
  Layers, 
  Satellite, 
  Map as MapIcon, 
  Navigation,
  Target,
  Ruler,
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface MapLayer {
  id: string;
  name: string;
  type: 'farms' | 'commodities' | 'transportation' | 'counties' | 'compliance';
  visible: boolean;
  color: string;
}

interface GISLocation {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  properties: Record<string, any>;
}

export default function InteractiveMap() {
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'counties', name: 'County Boundaries', type: 'counties', visible: true, color: '#3B82F6' },
    { id: 'farms', name: 'Farm Plots', type: 'farms', visible: true, color: '#10B981' },
    { id: 'commodities', name: 'Commodity Locations', type: 'commodities', visible: true, color: '#F59E0B' },
    { id: 'transportation', name: 'Transportation Routes', type: 'transportation', visible: false, color: '#EF4444' },
    { id: 'compliance', name: 'Compliance Zones', type: 'compliance', visible: false, color: '#8B5CF6' }
  ]);

  const [selectedCounty, setSelectedCounty] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapView, setMapView] = useState<'satellite' | 'terrain' | 'roads'>('satellite');
  const [measureMode, setMeasureMode] = useState<boolean>(false);

  const { data: gisData = [], isLoading } = useQuery<GISLocation[]>({
    queryKey: ['/api/gis/locations', selectedCounty || 'all'],
    queryFn: () => {
      const endpoint = selectedCounty && selectedCounty !== 'all' 
        ? `/api/gis/locations/${encodeURIComponent(selectedCounty)}`
        : '/api/gis/locations/';
      return fetch(endpoint).then(res => res.json());
    },
  });

  const liberianCounties = [
    'Bomi County', 'Bong County', 'Gbarpolu County', 'Grand Bassa County',
    'Grand Cape Mount County', 'Grand Gedeh County', 'Grand Kru County',
    'Lofa County', 'Margibi County', 'Maryland County', 'Montserrado County',
    'Nimba County', 'River Cess County', 'River Gee County', 'Sinoe County'
  ];

  const toggleLayer = (layerId: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const exportMapData = () => {
    const visibleLayers = mapLayers.filter(layer => layer.visible);
    const exportData = {
      layers: visibleLayers,
      view: mapView,
      county: selectedCounty,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gis-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">GIS Mapping System</h2>
          <p className="text-gray-600">Interactive geospatial analysis and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={measureMode ? "default" : "outline"}
            size="sm"
            onClick={() => setMeasureMode(!measureMode)}
          >
            <Ruler className="h-4 w-4 mr-2" />
            Measure
          </Button>
          <Button variant="outline" size="sm" onClick={exportMapData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Map Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Map Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* County Filter */}
              <div>
                <Label htmlFor="county-select">County Filter</Label>
                <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Counties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Counties</SelectItem>
                    {liberianCounties.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedCounty && selectedCounty !== 'all' && (
                  <div className="mt-2 text-sm text-blue-600">
                    Viewing: {selectedCounty} 
                    {isLoading && <span className="ml-2 text-gray-500">Loading...</span>}
                  </div>
                )}
              </div>

              {/* Search */}
              <div>
                <Label htmlFor="search">Search Location</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search farms, facilities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Map View Toggle */}
              <div>
                <Label>Map View</Label>
                <div className="grid grid-cols-3 gap-1 mt-2">
                  <Button
                    variant={mapView === 'satellite' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMapView('satellite')}
                  >
                    <Satellite className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={mapView === 'terrain' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMapView('terrain')}
                  >
                    <MapIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={mapView === 'roads' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMapView('roads')}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layer Controls */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Map Layers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mapLayers.map(layer => (
                  <div key={layer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="text-sm font-medium">{layer.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLayer(layer.id)}
                    >
                      {layer.visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Active Farms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span>Processing Centers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span>Export Points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 border-2 border-blue-700 rounded-full" />
                  <span>Inspection Sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span>Compliance Zones</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* County Data Summary */}
          {selectedCounty && selectedCounty !== 'all' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{selectedCounty} Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Locations:</span>
                    <Badge variant="secondary">{gisData.length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Farms:</span>
                    <Badge variant="secondary">{gisData.filter(d => d.type === 'farm').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Centers:</span>
                    <Badge variant="secondary">{gisData.filter(d => d.type === 'processing').length}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection Sites:</span>
                    <Badge variant="secondary">{gisData.filter(d => d.type === 'inspection').length}</Badge>
                  </div>
                  {isLoading && (
                    <div className="text-center text-gray-500">
                      <div className="animate-pulse">Updating data...</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Map Area */}
        <div className="lg:col-span-3">
          <Card className="h-[700px]">
            <CardContent className="p-0 h-full relative">
              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm">Loading {selectedCounty}...</span>
                  </div>
                </div>
              )}
              {/* Map Container */}
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden">
                
                {/* Map Overlay - Simulated Liberia Map */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Liberia Outline */}
                    <svg width="600" height="400" viewBox="0 0 600 400" className="opacity-80">
                      <defs>
                        <pattern id="farmPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                          <circle cx="5" cy="5" r="2" fill="#10B981" opacity="0.6" />
                        </pattern>
                        <pattern id="transportPattern" patternUnits="userSpaceOnUse" width="20" height="4">
                          <rect width="20" height="2" fill="#EF4444" opacity="0.7" />
                        </pattern>
                      </defs>
                      
                      {/* Accurate Liberia Country Outline */}
                      <path
                        d="M100 150 L120 140 L160 135 L200 130 L240 125 L280 120 L320 115 L360 118 L400 125 L440 135 L480 150 L520 170 L540 190 L550 210 L555 230 L560 250 L558 270 L550 290 L540 310 L525 330 L505 345 L480 355 L450 360 L420 362 L390 360 L360 355 L330 350 L300 345 L270 340 L240 338 L210 340 L180 345 L150 350 L125 355 L105 360 L90 350 L80 335 L75 320 L72 300 L70 280 L72 260 L75 240 L80 220 L85 200 L90 180 L95 165 Z"
                        fill={mapView === 'satellite' ? '#22C55E' : mapView === 'terrain' ? '#84CC16' : '#F3F4F6'}
                        stroke="#374151"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                      
                      {/* Accurate County Boundaries - Major divisions */}
                      {mapLayers.find(l => l.id === 'counties')?.visible && (
                        <g>
                          {/* Montserrado County (around Monrovia) */}
                          <path d="M100 250 Q130 240 160 245 Q190 250 180 280 Q150 290 120 285 Q100 270 100 250" 
                                stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                          
                          {/* Lofa County (Northwestern) */}
                          <path d="M120 140 Q160 135 200 130 Q180 160 150 170 Q120 165 120 140" 
                                stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                          
                          {/* Nimba County (Northern) */}
                          <path d="M240 125 Q280 120 320 115 Q340 140 320 165 Q280 170 250 160 Q240 145 240 125" 
                                stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                          
                          {/* Grand Gedeh County (Eastern) */}
                          <path d="M440 135 Q480 150 520 170 Q520 200 490 220 Q460 210 440 185 Q440 160 440 135" 
                                stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                          
                          {/* Maryland County (Southeastern) */}
                          <path d="M480 330 Q520 340 540 360 Q500 370 460 365 Q450 350 480 330" 
                                stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                          
                          {/* River Cess County (Central coast) */}
                          <path d="M270 340 Q310 335 350 340 Q360 360 330 370 Q290 365 270 350 Q270 340 270 340" 
                                stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                          
                          {/* Bong County (Central) */}
                          <path d="M200 200 Q250 195 300 200 Q320 230 290 250 Q240 255 200 240 Q185 220 200 200" 
                                stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                        </g>
                      )}
                      
                      {/* Farm Plots - Dynamic based on county selection */}
                      {mapLayers.find(l => l.id === 'farms')?.visible && (
                        <g>
                          {/* Show highlighted farms if county is selected */}
                          {selectedCounty && selectedCounty !== 'all' ? (
                            // County-specific farms with highlighting based on accurate geography
                            <>
                              {selectedCounty.includes('Lofa') && (
                                <>
                                  <circle cx="160" cy="150" r="10" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="180" cy="160" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="170" y="140" fill="#374151" fontSize="10" textAnchor="middle" fontWeight="bold">
                                    Lofa Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Nimba') && (
                                <>
                                  <circle cx="280" cy="140" r="10" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="300" cy="155" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="290" y="130" fill="#374151" fontSize="10" textAnchor="middle" fontWeight="bold">
                                    Nimba Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Montserrado') && (
                                <>
                                  <circle cx="140" cy="260" r="10" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="160" cy="270" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="150" y="250" fill="#374151" fontSize="10" textAnchor="middle" fontWeight="bold">
                                    Montserrado Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('River') && (
                                <>
                                  <circle cx="320" cy="350" r="10" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="340" cy="340" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="330" y="330" fill="#374151" fontSize="10" textAnchor="middle" fontWeight="bold">
                                    River County Farms
                                  </text>
                                </>
                              )}
                              {/* Default highlighting for other counties */}
                              {!selectedCounty.includes('Lofa') && !selectedCounty.includes('Nimba') && 
                               !selectedCounty.includes('Montserrado') && !selectedCounty.includes('River') && (
                                <>
                                  <circle cx="250" cy="220" r="10" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="350" cy="250" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="300" y="210" fill="#374151" fontSize="10" textAnchor="middle" fontWeight="bold">
                                    {selectedCounty.replace(' County', '')} Farms
                                  </text>
                                </>
                              )}
                            </>
                          ) : (
                            // All farms across accurate Liberia geography
                            <>
                              <circle cx="160" cy="150" r="6" fill="#10B981" />  {/* Lofa */}
                              <circle cx="280" cy="140" r="7" fill="#10B981" />  {/* Nimba */}
                              <circle cx="140" cy="260" r="8" fill="#10B981" />  {/* Montserrado */}
                              <circle cx="250" cy="220" r="6" fill="#10B981" />  {/* Bong */}
                              <circle cx="470" cy="180" r="5" fill="#10B981" />  {/* Grand Gedeh */}
                              <circle cx="200" cy="300" r="6" fill="#10B981" />  {/* Grand Bassa */}
                              <circle cx="320" cy="350" r="5" fill="#10B981" />  {/* River Cess */}
                              <circle cx="500" cy="350" r="6" fill="#10B981" />  {/* Maryland */}
                              <circle cx="120" cy="320" r="4" fill="#10B981" />  {/* Sinoe */}
                            </>
                          )}
                        </g>
                      )}
                      
                      {/* Commodity Processing Centers */}
                      {mapLayers.find(l => l.id === 'commodities')?.visible && (
                        <g>
                          <rect x="240" y="170" width="12" height="12" fill="#F59E0B" rx="2" />
                          <rect x="340" y="200" width="10" height="10" fill="#F59E0B" rx="2" />
                          <rect x="420" y="230" width="14" height="14" fill="#F59E0B" rx="2" />
                          <rect x="280" y="290" width="10" height="10" fill="#F59E0B" rx="2" />
                        </g>
                      )}
                      
                      {/* Transportation Routes */}
                      {mapLayers.find(l => l.id === 'transportation')?.visible && (
                        <g>
                          <path d="M180 200 Q250 180 320 190 Q380 220 450 240" stroke="#EF4444" strokeWidth="3" fill="none" />
                          <path d="M200 280 Q250 275 300 270 Q350 265 400 260" stroke="#EF4444" strokeWidth="3" fill="none" />
                          <path d="M100 250 Q200 240 300 230 Q400 220 500 210" stroke="#EF4444" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                        </g>
                      )}
                      
                      {/* Compliance Zones */}
                      {mapLayers.find(l => l.id === 'compliance')?.visible && (
                        <g>
                          <circle cx="300" cy="200" r="50" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                          <circle cx="400" cy="250" r="40" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                        </g>
                      )}
                      
                      {/* Accurate Location Labels */}
                      <text x="130" y="270" fill="#374151" fontSize="12" fontWeight="bold">Monrovia</text>
                      <text x="150" y="150" fill="#374151" fontSize="10">Lofa</text>
                      <text x="280" y="145" fill="#374151" fontSize="10">Nimba</text>
                      <text x="470" y="180" fill="#374151" fontSize="10">Grand Gedeh</text>
                      <text x="500" y="350" fill="#374151" fontSize="10">Maryland</text>
                      <text x="320" y="355" fill="#374151" fontSize="10">River Cess</text>
                      <text x="250" y="225" fill="#374151" fontSize="10">Bong</text>
                      <text x="200" y="300" fill="#374151" fontSize="10">Grand Bassa</text>
                      <text x="100" y="320" fill="#374151" fontSize="10">Sinoe</text>
                      
                      {/* Atlantic Ocean label */}
                      <text x="50" y="400" fill="#1E40AF" fontSize="11" fontStyle="italic">Atlantic Ocean</text>
                      
                      {/* Scale */}
                      <g transform="translate(470, 350)">
                        <line x1="0" y1="0" x2="50" y2="0" stroke="#374151" strokeWidth="2" />
                        <line x1="0" y1="-3" x2="0" y2="3" stroke="#374151" strokeWidth="2" />
                        <line x1="50" y1="-3" x2="50" y2="3" stroke="#374151" strokeWidth="2" />
                        <text x="25" y="-8" textAnchor="middle" fill="#374151" fontSize="10">50km</text>
                      </g>
                    </svg>
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
                        {gisData.length} locations found
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
    </div>
  );
}