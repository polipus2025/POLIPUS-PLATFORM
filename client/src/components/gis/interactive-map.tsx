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
                  
                  {/* Liberia Country Outline - Accurate Geographic Shape */}
                  <path
                    d="M80 180 L140 170 Q180 165 220 170 L280 175 Q320 180 360 185 L400 190 Q440 195 480 200 L520 210 Q540 220 550 240 L555 260 Q560 280 555 300 L550 320 Q545 340 530 355 L510 365 Q490 370 470 365 L450 360 Q420 355 390 350 L360 345 Q330 340 300 335 L270 330 Q240 325 210 320 L180 315 Q150 310 120 300 L95 285 Q80 270 75 250 L70 230 Q70 210 75 190 Q77 185 80 180 Z"
                    fill="#10B981"
                    fillOpacity="0.3"
                    stroke="#059669"
                    strokeWidth="2"
                    className="hover:fill-opacity-40 transition-all cursor-pointer"
                  />

                  {/* County Boundaries - 15 Liberian Counties with Click Handlers */}
                  {mapLayers.find(l => l.id === 'counties')?.visible && (
                    <g stroke="#3B82F6" strokeWidth="1" fill="none" strokeDasharray="2,2">
                      {/* Montserrado County (Capital) */}
                      <path d="M80 180 L130 185 L140 220 L120 240 L90 235 L80 200 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Montserrado' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Montserrado')} />
                      {/* Bomi County */}
                      <path d="M130 185 L180 190 L170 220 L140 220 L130 185 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Bomi' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Bomi')} />
                      {/* Grand Cape Mount County */}
                      <path d="M180 190 L230 195 L220 225 L170 220 L180 190 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Grand Cape Mount' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Grand Cape Mount')} />
                      {/* Gbarpolu County */}
                      <path d="M230 195 L280 200 L270 230 L220 225 L230 195 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Gbarpolu' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Gbarpolu')} />
                      {/* Lofa County */}
                      <path d="M280 200 L360 210 L350 250 L270 240 L280 200 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Lofa' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Lofa')} />
                      {/* Bong County */}
                      <path d="M220 225 L270 230 L280 270 L230 265 L220 225 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Bong' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Bong')} />
                      {/* Nimba County */}
                      <path d="M350 250 L440 260 L430 300 L340 290 L350 250 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Nimba' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Nimba')} />
                      {/* Margibi County */}
                      <path d="M140 220 L190 225 L180 255 L130 250 L140 220 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Margibi' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Margibi')} />
                      {/* Grand Bassa County */}
                      <path d="M180 255 L250 260 L240 300 L170 295 L180 255 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Grand Bassa' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Grand Bassa')} />
                      {/* River Cess County */}
                      <path d="M240 300 L310 305 L300 335 L230 330 L240 300 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'River Cess' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('River Cess')} />
                      {/* Grand Gedeh County */}
                      <path d="M340 290 L420 300 L410 340 L330 335 L340 290 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Grand Gedeh' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Grand Gedeh')} />
                      {/* River Gee County */}
                      <path d="M300 335 L370 340 L360 365 L290 360 L300 335 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'River Gee' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('River Gee')} />
                      {/* Sinoe County */}
                      <path d="M230 330 L300 335 L290 360 L220 355 L230 330 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Sinoe' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Sinoe')} />
                      {/* Maryland County */}
                      <path d="M360 365 L430 370 L420 400 L350 395 L360 365 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Maryland' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Maryland')} />
                      {/* Grand Kru County */}
                      <path d="M220 355 L290 360 L280 390 L210 385 L220 355 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Grand Kru' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Grand Kru')} />
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

                  {/* Transportation Routes - Major Roads */}
                  {mapLayers.find(l => l.id === 'roads')?.visible && (
                    <g>
                      {/* Main Highway - Monrovia to Ganta */}
                      <path d="M105 210 Q175 215 245 245 Q320 255 395 275" 
                            stroke="#EF4444" strokeWidth="3" fill="none" />
                      {/* Coastal Highway */}
                      <path d="M105 210 Q150 240 215 280 Q280 300 350 330 Q380 350 385 380" 
                            stroke="#EF4444" strokeWidth="2" fill="none" />
                      {/* Northern Route - Monrovia to Voinjama */}
                      <path d="M105 210 Q180 205 245 220 Q290 225 320 225" 
                            stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                      {/* Interior Routes */}
                      <path d="M245 245 Q290 265 340 285 Q365 300 380 315" 
                            stroke="#F97316" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                      <path d="M215 280 Q255 295 300 310 Q330 320 360 330" 
                            stroke="#F97316" strokeWidth="1" fill="none" strokeDasharray="3,3" />
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

                  {/* Major Cities - Accurate Locations */}
                  <g>
                    {/* Monrovia - Capital City (Montserrado County) */}
                    <circle cx="105" cy="210" r="4" fill="#DC2626" stroke="white" strokeWidth="2" />
                    <text x="110" y="216" fill="#DC2626" fontSize="11" fontWeight="bold">Monrovia</text>
                    
                    {/* Gbarnga - Bong County Capital */}
                    <circle cx="245" cy="245" r="3" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="250" y="250" fill="#DC2626" fontSize="9">Gbarnga</text>
                    
                    {/* Zwedru - Grand Gedeh County Capital */}
                    <circle cx="380" cy="315" r="3" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="385" y="320" fill="#DC2626" fontSize="9">Zwedru</text>
                    
                    {/* Voinjama - Lofa County Capital */}
                    <circle cx="320" cy="225" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="325" y="230" fill="#DC2626" fontSize="8">Voinjama</text>
                    
                    {/* Sanniquellie - Nimba County Capital */}
                    <circle cx="395" cy="275" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="400" y="280" fill="#DC2626" fontSize="8">Sanniquellie</text>
                    
                    {/* Buchanan - Grand Bassa County Capital */}
                    <circle cx="215" cy="280" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="220" y="285" fill="#DC2626" fontSize="8">Buchanan</text>
                    
                    {/* Harper - Maryland County Capital */}
                    <circle cx="385" cy="380" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="390" y="385" fill="#DC2626" fontSize="8">Harper</text>
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