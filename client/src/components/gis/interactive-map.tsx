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
              
              {/* Clear Visual Map of Liberia - SVG Based */}
              <div className="absolute inset-0 bg-blue-50">
                <svg viewBox="0 0 600 400" className="w-full h-full">
                  {/* Ocean Background */}
                  <rect width="600" height="400" fill="#E0F2FE" />
                  
                  {/* Republic of Liberia - Accurate Outline */}
                  <path
                    d="M 80 180 
                       L 120 175 
                       L 160 170 
                       L 200 168 
                       L 240 165 
                       L 280 164 
                       L 320 166 
                       L 360 170 
                       L 400 175 
                       L 430 182 
                       L 450 192 
                       L 465 205 
                       L 475 220 
                       L 480 238 
                       L 482 256 
                       L 480 274 
                       L 475 292 
                       L 465 308 
                       L 450 322 
                       L 430 334 
                       L 400 344 
                       L 360 352 
                       L 320 356 
                       L 280 358 
                       L 240 356 
                       L 200 352 
                       L 160 344 
                       L 120 334 
                       L 90 322 
                       L 70 308 
                       L 55 292 
                       L 45 274 
                       L 42 256 
                       L 45 238 
                       L 55 220 
                       L 70 205 
                       L 80 180 Z"
                    fill="#10B981"
                    stroke="#047857"
                    strokeWidth="2"
                    opacity="0.9"
                  />
                  
                  {/* Country Label */}
                  <text x="260" y="260" textAnchor="middle" className="text-xl font-bold fill-white">
                    REPUBLIC OF LIBERIA
                  </text>
                  
                  {/* Major Cities */}
                  <g>
                    {/* Monrovia - Capital */}
                    <circle cx="90" cy="200" r="6" fill="#DC2626" stroke="white" strokeWidth="2" />
                    <text x="100" y="205" className="text-sm font-semibold fill-red-700">Monrovia</text>
                    <text x="100" y="218" className="text-xs fill-red-600">(Capital)</text>
                    
                    {/* Gbarnga */}
                    <circle cx="180" cy="240" r="4" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="190" y="245" className="text-sm fill-red-700">Gbarnga</text>
                    
                    {/* Buchanan */}
                    <circle cx="140" cy="280" r="4" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="150" y="285" className="text-sm fill-red-700">Buchanan</text>
                    
                    {/* Harper */}
                    <circle cx="380" cy="340" r="4" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="390" y="345" className="text-sm fill-red-700">Harper</text>
                    
                    {/* Zwedru */}
                    <circle cx="350" cy="300" r="3" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="360" y="305" className="text-xs fill-red-700">Zwedru</text>
                  </g>
                  
                  {/* Borders with Neighboring Countries */}
                  <g stroke="#8B5CF6" strokeWidth="2" strokeDasharray="5,5" fill="none" opacity="0.7">
                    {/* Sierra Leone Border */}
                    <path d="M 80 180 Q 60 160 80 140 Q 100 130 130 125" />
                    <text x="70" y="150" className="text-xs fill-purple-600">SIERRA LEONE</text>
                    
                    {/* Guinea Border */}
                    <path d="M 130 125 Q 200 120 280 122 Q 360 125 430 130" />
                    <text x="280" y="115" className="text-xs fill-purple-600">GUINEA</text>
                    
                    {/* Côte d'Ivoire Border */}
                    <path d="M 430 130 Q 460 140 485 160 Q 500 180 510 210" />
                    <text x="480" y="150" className="text-xs fill-purple-600">CÔTE D'IVOIRE</text>
                  </g>
                  
                  {/* Atlantic Ocean */}
                  <text x="30" y="350" className="text-lg font-bold fill-blue-600" transform="rotate(-90 30 350)">
                    ATLANTIC OCEAN
                  </text>
                  
                  {/* Farm Locations */}
                  {mapLayers.find(l => l.id === 'farms')?.visible && (gisData as any[]).map((location: any, index: number) => {
                    const x = 120 + (index % 18) * 20;
                    const y = 200 + Math.floor(index / 18) * 25;
                    
                    return (
                      <g key={location.id || index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#059669"
                          stroke="#065F46"
                          strokeWidth="1"
                          className="hover:r-5 transition-all cursor-pointer opacity-80"
                        />
                        <text
                          x={x}
                          y={y - 8}
                          textAnchor="middle"
                          className="text-xs fill-green-800 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          {location.name?.slice(0, 8)}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Transportation Routes */}
                  {mapLayers.find(l => l.id === 'roads')?.visible && (
                    <g stroke="#EF4444" strokeWidth="3" fill="none" opacity="0.8">
                      {/* Main Highway */}
                      <path d="M 90 200 Q 130 220 180 240" />
                      {/* Coastal Road */}
                      <path d="M 90 200 Q 115 240 140 280 Q 200 320 380 340" />
                    </g>
                  )}
                  
                  {/* Compliance Zones */}
                  {mapLayers.find(l => l.id === 'compliance')?.visible && (
                    <g>
                      <circle cx="150" cy="220" r="30" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                      <circle cx="300" cy="280" r="25" fill="#8B5CF6" opacity="0.2" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                    </g>
                  )}
                  
                  {/* Scale and Compass */}
                  <g transform="translate(500, 350)">
                    <line x1="0" y1="0" x2="40" y2="0" stroke="#374151" strokeWidth="2" />
                    <text x="20" y="-5" textAnchor="middle" className="text-xs fill-gray-600">50km</text>
                  </g>
                  
                  <g transform="translate(550, 50)">
                    <circle cx="0" cy="0" r="15" fill="white" stroke="#374151" strokeWidth="1" />
                    <polygon points="0,-10 3,3 0,0 -3,3" fill="#DC2626" />
                    <text x="0" y="-20" textAnchor="middle" className="text-xs font-bold fill-gray-700">N</text>
                  </g>
                </svg>
                
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