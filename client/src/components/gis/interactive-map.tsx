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
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
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

            {/* Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Search Location</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search farms, plots..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Map View */}
            <div>
              <label className="text-sm font-medium mb-2 block">Map View</label>
              <div className="grid grid-cols-3 gap-1">
                <Button
                  size="sm"
                  variant={mapView === 'satellite' ? 'default' : 'outline'}
                  onClick={() => setMapView('satellite')}
                  className="text-xs"
                >
                  <Satellite className="h-3 w-3 mr-1" />
                  Satellite
                </Button>
                <Button
                  size="sm"
                  variant={mapView === 'roadmap' ? 'default' : 'outline'}
                  onClick={() => setMapView('roadmap')}
                  className="text-xs"
                >
                  <MapIcon className="h-3 w-3 mr-1" />
                  Roadmap
                </Button>
                <Button
                  size="sm"
                  variant={mapView === 'terrain' ? 'default' : 'outline'}
                  onClick={() => setMapView('terrain')}
                  className="text-xs"
                >
                  <Layers className="h-3 w-3 mr-1" />
                  Terrain
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layer Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Map Layers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mapLayers.map(layer => (
                <div key={layer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: layer.visible ? layer.color : 'transparent' }}
                    />
                    <span className="text-sm">{layer.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleLayer(layer.id)}
                    className="h-6 px-2"
                  >
                    {layer.visible ? 'Hide' : 'Show'}
                  </Button>
                </div>
              ))}
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
              
              {/* SVG Map Container */}
              <div className="absolute inset-0">
                <svg viewBox="0 0 600 400" className="w-full h-full">
                  {/* Background */}
                  <rect width="600" height="400" fill="#E0F2FE" />
                  
                  {/* Liberia Country Outline */}
                  <path
                    d="M50 200 Q120 180 200 190 L280 200 Q350 210 420 220 L480 240 Q520 250 550 260 L550 320 Q500 330 450 325 L380 320 Q320 315 260 310 L200 305 Q150 300 100 290 L70 270 Q50 250 50 200 Z"
                    fill="#10B981"
                    fillOpacity="0.3"
                    stroke="#059669"
                    strokeWidth="2"
                    className="hover:fill-opacity-40 transition-all cursor-pointer"
                  />

                  {/* County Boundaries */}
                  {mapLayers.find(l => l.id === 'counties')?.visible && (
                    <g stroke="#3B82F6" strokeWidth="1" fill="none" strokeDasharray="2,2">
                      <path d="M50 200 L120 210 L180 220 L200 250 L150 270 L80 260 Z" />
                      <path d="M180 220 L250 225 L280 200 L320 210 L300 240 L200 250 Z" />
                      <path d="M320 210 L380 215 L420 220 L450 240 L400 250 L300 240 Z" />
                      <path d="M450 240 L520 250 L550 260 L520 290 L450 280 Z" />
                      <path d="M200 250 L300 240 L350 260 L320 290 L250 285 Z" />
                    </g>
                  )}

                  {/* Atlantic Ocean Label */}
                  <text x="30" y="150" fill="#0284C7" fontSize="14" fontWeight="bold" transform="rotate(-90 30 150)">
                    Atlantic Ocean
                  </text>

                  {/* Farm Plots */}
                  {mapLayers.find(l => l.id === 'farms')?.visible && (gisData as any[]).map((location: any, index: number) => {
                    const x = 100 + (index % 20) * 20;
                    const y = 220 + Math.floor(index / 20) * 15;
                    
                    return (
                      <g key={location.id || index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#10B981"
                          stroke="#065F46"
                          strokeWidth="1"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                        <text
                          x={x}
                          y={y - 8}
                          fill="#065F46"
                          fontSize="8"
                          textAnchor="middle"
                          className="opacity-0 hover:opacity-100 transition-opacity"
                        >
                          {location.name?.slice(0, 10)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Transportation Routes */}
                  {mapLayers.find(l => l.id === 'roads')?.visible && (
                    <g>
                      <path d="M50 200 Q150 195 250 200 Q350 205 450 210 Q500 215 550 220" 
                            stroke="#EF4444" strokeWidth="3" fill="none" />
                      <path d="M100 250 Q200 245 300 250 Q400 255 500 260" 
                            stroke="#EF4444" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                    </g>
                  )}

                  {/* Compliance Zones */}
                  {mapLayers.find(l => l.id === 'compliance')?.visible && (
                    <g>
                      <circle cx="200" cy="230" r="40" fill="#8B5CF6" opacity="0.2" 
                              stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                      <circle cx="350" cy="250" r="35" fill="#8B5CF6" opacity="0.2" 
                              stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                    </g>
                  )}

                  {/* Major Cities */}
                  <g>
                    <circle cx="120" cy="210" r="3" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="125" y="215" fill="#DC2626" fontSize="10" fontWeight="bold">Monrovia</text>
                    
                    <circle cx="280" cy="200" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="285" y="205" fill="#DC2626" fontSize="9">Gbarnga</text>
                    
                    <circle cx="450" cy="240" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="455" y="245" fill="#DC2626" fontSize="9">Zwedru</text>
                  </g>

                  {/* Scale */}
                  <g transform="translate(470, 350)">
                    <line x1="0" y1="0" x2="50" y2="0" stroke="#374151" strokeWidth="2" />
                    <line x1="0" y1="-3" x2="0" y2="3" stroke="#374151" strokeWidth="2" />
                    <line x1="50" y1="-3" x2="50" y2="3" stroke="#374151" strokeWidth="2" />
                    <text x="25" y="-8" textAnchor="middle" fill="#374151" fontSize="10">50km</text>
                  </g>

                  {/* Compass */}
                  <g transform="translate(520, 50)">
                    <circle cx="0" cy="0" r="20" fill="white" stroke="#374151" strokeWidth="2" opacity="0.9" />
                    <polygon points="0,-15 5,5 0,0 -5,5" fill="#DC2626" />
                    <text x="0" y="-25" textAnchor="middle" fill="#374151" fontSize="10" fontWeight="bold">N</text>
                  </g>
                </svg>
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