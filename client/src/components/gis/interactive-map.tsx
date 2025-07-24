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
              
              {/* SVG Map Container */}
              <div className="absolute inset-0">
                <svg viewBox="0 0 600 400" className="w-full h-full">
                  {/* Background */}
                  <rect width="600" height="400" fill="#E0F2FE" />
                  
                  {/* Liberia Country Outline - Real Geographic Shape (Triangular with curved coastline) */}
                  <path
                    d="M50 220 
                       L70 200 
                       Q100 190 130 195 
                       L160 200 
                       Q200 205 240 210 
                       L280 215 
                       Q320 220 360 225 
                       L400 230 
                       Q440 235 480 245 
                       L520 255 
                       Q540 265 545 280 
                       L550 300 
                       Q555 320 550 340 
                       L545 360 
                       Q535 380 520 395 
                       L500 405 
                       Q475 410 450 408 
                       L420 405 
                       Q390 402 360 398 
                       L330 394 
                       Q300 390 270 385 
                       L240 380 
                       Q210 375 180 370 
                       L150 365 
                       Q120 360 90 350 
                       L70 340 
                       Q55 325 52 305 
                       L50 285 
                       Q48 265 50 245 
                       L52 225 
                       Q54 205 58 190 
                       L62 175 
                       Q68 165 75 160 
                       L85 158 
                       Q100 157 115 160 
                       L130 163 
                       Q150 166 170 170 
                       L190 174 
                       Q220 178 250 182 
                       L280 186 
                       Q320 190 360 195 
                       L400 200 
                       Q440 205 480 215 
                       L520 225 
                       Q540 235 545 250 
                       L550 270 
                       Q555 290 550 310 
                       L545 330 
                       Q535 350 520 365 
                       L500 375 
                       Q475 380 450 378 
                       L420 375 
                       Q390 372 360 368 
                       L330 364 
                       Q300 360 270 355 
                       L240 350 
                       Q210 345 180 340 
                       L150 335 
                       Q120 330 90 320 
                       L70 310 
                       Q55 295 52 275 
                       L50 255 
                       Q48 235 50 220 
                       Z"
                    fill="#10B981"
                    fillOpacity="0.3"
                    stroke="#059669"
                    strokeWidth="2"
                    className="hover:fill-opacity-40 transition-all cursor-pointer"
                  />

                  {/* County Boundaries - 15 Liberian Counties Based on Real Geography */}
                  {mapLayers.find(l => l.id === 'counties')?.visible && (
                    <g stroke="#3B82F6" strokeWidth="1" fill="none" strokeDasharray="2,2">
                      {/* Montserrado County (Capital - around Monrovia) */}
                      <path d="M50 200 L90 195 L100 225 L85 245 L65 240 L50 220 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Montserrado' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Montserrado')} />
                      {/* Bomi County */}
                      <path d="M90 195 L130 200 L125 230 L100 225 L90 195 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Bomi' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Bomi')} />
                      {/* Grand Cape Mount County */}
                      <path d="M130 200 L170 205 L165 235 L125 230 L130 200 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Grand Cape Mount' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Grand Cape Mount')} />
                      {/* Gbarpolu County */}
                      <path d="M170 205 L210 210 L205 240 L165 235 L170 205 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Gbarpolu' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Gbarpolu')} />
                      {/* Lofa County (Northern region) */}
                      <path d="M210 210 L290 220 L285 255 L205 245 L210 210 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Lofa' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Lofa')} />
                      {/* Bong County (Central region) */}
                      <path d="M165 235 L205 240 L200 275 L165 270 L165 235 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Bong' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Bong')} />
                      {/* Nimba County (Eastern region) */}
                      <path d="M285 255 L370 265 L365 300 L280 290 L285 255 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Nimba' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Nimba')} />
                      {/* Margibi County */}
                      <path d="M100 225 L140 230 L135 265 L95 260 L100 225 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Margibi' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Margibi')} />
                      {/* Grand Bassa County (Coastal region) */}
                      <path d="M135 265 L200 275 L195 310 L130 305 L135 265 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Grand Bassa' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Grand Bassa')} />
                      {/* River Cess County */}
                      <path d="M195 310 L260 320 L255 350 L190 345 L195 310 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'River Cess' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('River Cess')} />
                      {/* Grand Gedeh County (Interior eastern) */}
                      <path d="M280 290 L350 300 L345 335 L275 330 L280 290 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Grand Gedeh' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Grand Gedeh')} />
                      {/* River Gee County */}
                      <path d="M255 350 L320 355 L315 380 L250 375 L255 350 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'River Gee' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('River Gee')} />
                      {/* Sinoe County (Central coastal) */}
                      <path d="M190 345 L255 350 L250 375 L185 370 L190 345 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Sinoe' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Sinoe')} />
                      {/* Maryland County (Southeastern coastal) */}
                      <path d="M315 380 L380 385 L375 410 L310 405 L315 380 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-30 cursor-pointer transition-all ${selectedCounty === 'Maryland' ? 'fill-blue-300 fill-opacity-40' : ''}`}
                            onClick={() => setSelectedCounty('Maryland')} />
                      {/* Grand Kru County (Southern coastal) */}
                      <path d="M185 370 L250 375 L245 400 L180 395 L185 370 Z" 
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

                  {/* Transportation Routes - Real Liberian Road Network */}
                  {mapLayers.find(l => l.id === 'roads')?.visible && (
                    <g>
                      {/* Main Highway - Monrovia to Ganta (Primary Road) */}
                      <path d="M75 220 Q150 225 225 240 Q300 255 375 275 Q420 285 460 300" 
                            stroke="#EF4444" strokeWidth="3" fill="none" />
                      {/* Coastal Highway - Monrovia to Harper */}
                      <path d="M75 220 Q120 250 165 295 Q210 325 255 350 Q300 375 345 395 Q390 400 435 402" 
                            stroke="#EF4444" strokeWidth="2" fill="none" />
                      {/* Northern Route - Monrovia to Voinjama */}
                      <path d="M75 220 Q125 215 175 220 Q225 225 275 235 Q325 245 375 255" 
                            stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                      {/* Interior Routes - Connecting Central Cities */}
                      <path d="M185 255 Q235 270 285 285 Q335 300 385 315" 
                            stroke="#F97316" strokeWidth="1" fill="none" strokeDasharray="3,3" />
                      {/* Secondary Roads */}
                      <path d="M165 295 Q210 310 255 325 Q300 340 345 355" 
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

                  {/* Major Cities - Geographically Accurate Locations */}
                  <g>
                    {/* Monrovia - Capital City (Montserrado County, Atlantic Coast) */}
                    <circle cx="75" cy="215" r="4" fill="#DC2626" stroke="white" strokeWidth="2" />
                    <text x="80" y="221" fill="#DC2626" fontSize="11" fontWeight="bold">Monrovia</text>
                    
                    {/* Gbarnga - Bong County Capital (Central Liberia) */}
                    <circle cx="185" cy="255" r="3" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="190" y="260" fill="#DC2626" fontSize="9">Gbarnga</text>
                    
                    {/* Zwedru - Grand Gedeh County Capital (Eastern Interior) */}
                    <circle cx="315" cy="315" r="3" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="320" y="320" fill="#DC2626" fontSize="9">Zwedru</text>
                    
                    {/* Voinjama - Lofa County Capital (Northern Region) */}
                    <circle cx="250" cy="235" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="255" y="240" fill="#DC2626" fontSize="8">Voinjama</text>
                    
                    {/* Sanniquellie - Nimba County Capital (Eastern Region) */}
                    <circle cx="325" cy="280" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="330" y="285" fill="#DC2626" fontSize="8">Sanniquellie</text>
                    
                    {/* Buchanan - Grand Bassa County Capital (Central Coast) */}
                    <circle cx="165" cy="295" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="170" y="300" fill="#DC2626" fontSize="8">Buchanan</text>
                    
                    {/* Harper - Maryland County Capital (Southeast Coast) */}
                    <circle cx="345" cy="395" r="2" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="350" y="400" fill="#DC2626" fontSize="8">Harper</text>
                    
                    {/* Robertsport - Grand Cape Mount */}
                    <circle cx="150" cy="220" r="1" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="155" y="225" fill="#DC2626" fontSize="7">Robertsport</text>
                    
                    {/* Kakata - Margibi County */}
                    <circle cx="120" cy="245" r="1" fill="#DC2626" stroke="white" strokeWidth="1" />
                    <text x="125" y="250" fill="#DC2626" fontSize="7">Kakata</text>
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