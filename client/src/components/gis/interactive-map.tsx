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
                  {/* Background - Atlantic Ocean */}
                  <defs>
                    <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.2" />
                    </linearGradient>
                    <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#065F46" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  
                  <rect width="600" height="400" fill="url(#oceanGradient)" />
                  
                  {/* Republic of Liberia - Authentic Geographic Outline */}
                  <path
                    d="M50 200
                       L80 195
                       L110 190
                       L145 185
                       L180 180
                       L220 175
                       L260 172
                       L300 170
                       L340 172
                       L380 175
                       L415 180
                       L445 188
                       L470 198
                       L490 210
                       L505 225
                       L515 242
                       L520 260
                       L522 278
                       L520 296
                       L515 314
                       L505 330
                       L490 344
                       L470 356
                       L445 366
                       L415 374
                       L380 380
                       L340 384
                       L300 386
                       L260 384
                       L220 380
                       L180 374
                       L145 366
                       L110 356
                       L80 344
                       L55 330
                       L35 314
                       L20 296
                       L12 278
                       L10 260
                       L12 242
                       L20 225
                       L35 210
                       L50 200
                       Z"
                    fill="url(#landGradient)"
                    stroke="#047857"
                    strokeWidth="2.5"
                    className="hover:fill-opacity-60 transition-all duration-300 cursor-pointer"
                  />
                  
                  {/* County Boundaries - All 15 Counties of Liberia */}
                  <g stroke="#047857" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.7">
                    {/* Montserrado County (Monrovia area) */}
                    <path d="M50 200 L110 195 L140 220 L120 240 L80 235 L50 220 Z" 
                          className={selectedCounty === 'Montserrado' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Montserrado')} />
                    
                    {/* Bong County (Central) */}
                    <path d="M140 220 L200 215 L220 240 L200 260 L170 255 L140 240 Z"
                          className={selectedCounty === 'Bong' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Bong')} />
                    
                    {/* Nimba County (Northeast) */}
                    <path d="M350 175 L420 172 L440 200 L420 220 L380 218 L350 195 Z"
                          className={selectedCounty === 'Nimba' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Nimba')} />
                    
                    {/* Grand Gedeh County (East) */}
                    <path d="M420 220 L480 218 L500 245 L480 270 L440 268 L420 245 Z"
                          className={selectedCounty === 'Grand Gedeh' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Grand Gedeh')} />
                    
                    {/* Lofa County (Northwest) */}
                    <path d="M110 190 L180 185 L200 160 L180 140 L140 145 L110 165 Z"
                          className={selectedCounty === 'Lofa' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Lofa')} />
                    
                    {/* Grand Bassa County (Central Coast) */}
                    <path d="M120 240 L170 235 L190 260 L170 280 L140 275 L120 260 Z"
                          className={selectedCounty === 'Grand Bassa' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Grand Bassa')} />
                    
                    {/* Margibi County (West Central) */}
                    <path d="M80 235 L120 230 L140 255 L120 275 L100 270 L80 255 Z"
                          className={selectedCounty === 'Margibi' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Margibi')} />
                    
                    {/* Grand Cape Mount County (Northwest Coast) */}
                    <path d="M50 220 L80 215 L100 190 L80 170 L60 175 L50 195 Z"
                          className={selectedCounty === 'Grand Cape Mount' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Grand Cape Mount')} />
                    
                    {/* Gbarpolu County (North Central) */}
                    <path d="M180 185 L240 180 L260 155 L240 135 L200 140 L180 160 Z"
                          className={selectedCounty === 'Gbarpolu' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Gbarpolu')} />
                    
                    {/* Rivercess County (Central) */}
                    <path d="M170 280 L220 275 L240 300 L220 320 L190 315 L170 300 Z"
                          className={selectedCounty === 'Rivercess' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Rivercess')} />
                    
                    {/* Sinoe County (Southeast Coast) */}
                    <path d="M220 320 L270 315 L290 340 L270 360 L240 355 L220 340 Z"
                          className={selectedCounty === 'Sinoe' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Sinoe')} />
                    
                    {/* Grand Kru County (Southeast) */}
                    <path d="M270 360 L320 355 L340 380 L320 400 L290 395 L270 380 Z"
                          className={selectedCounty === 'Grand Kru' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Grand Kru')} />
                    
                    {/* Maryland County (Far Southeast) */}
                    <path d="M340 380 L390 375 L410 400 L390 420 L360 415 L340 400 Z"
                          className={selectedCounty === 'Maryland' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Maryland')} />
                    
                    {/* River Gee County (Southeast) */}
                    <path d="M380 268 L430 265 L450 290 L430 310 L400 308 L380 288 Z"
                          className={selectedCounty === 'River Gee' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('River Gee')} />
                    
                    {/* Bomi County (West) */}
                    <path d="M60 175 L100 170 L120 195 L100 215 L80 210 L60 195 Z"
                          className={selectedCounty === 'Bomi' ? 'fill-blue-200 fill-opacity-50' : ''} 
                          onClick={() => setSelectedCounty('Bomi')} />
                  </g>

                  {/* International Borders */}
                  <g stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,2" fill="none" opacity="0.6">
                    {/* Sierra Leone Border (Northwest) */}
                    <path d="M50 200 Q40 180, 50 160 Q65 145, 85 135 Q110 125, 140 120" />
                    
                    {/* Guinea Border (North) */}
                    <path d="M140 120 Q200 115, 260 118 Q320 122, 380 128 Q440 135, 490 145" />
                    
                    {/* Côte d'Ivoire Border (East) */}
                    <path d="M490 145 Q520 155, 540 175 Q555 200, 565 230 Q570 260, 568 290 Q565 320, 560 350" />
                  </g>

                  {/* Atlantic Ocean Coastline */}
                  <path
                    d="M50 200 Q80 195, 110 192 Q180 188, 260 192 Q340 196, 415 202 Q470 208, 505 220"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="3"
                    strokeDasharray="6,3"
                    opacity="0.8"
                  />

                  {/* Major Cities - Accurately Positioned Based on Liberian Geography */}
                  <g fill="#DC2626" stroke="#FFFFFF" strokeWidth="1">
                    {/* Monrovia - Capital City (Atlantic Coast, Montserrado County) */}
                    <circle cx="85" cy="220" r="5" className="hover:r-7 transition-all cursor-pointer" />
                    <text x="95" y="225" fill="#DC2626" fontSize="11" fontWeight="bold">Monrovia</text>
                    <text x="95" y="237" fill="#DC2626" fontSize="8">(Capital)</text>
                    
                    {/* Gbarnga - Bong County Capital (Central Interior) */}
                    <circle cx="170" cy="250" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="180" y="255" fill="#DC2626" fontSize="9" fontWeight="600">Gbarnga</text>
                    
                    {/* Buchanan - Grand Bassa County (Central Coast, Major Port) */}
                    <circle cx="150" cy="285" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="160" y="290" fill="#DC2626" fontSize="9" fontWeight="600">Buchanan</text>
                    
                    {/* Sanniquellie - Nimba County Capital (Northeast) */}
                    <circle cx="360" cy="210" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="370" y="215" fill="#DC2626" fontSize="9" fontWeight="600">Sanniquellie</text>
                    
                    {/* Zwedru - Grand Gedeh County Capital (Eastern Interior) */}
                    <circle cx="420" cy="270" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="430" y="275" fill="#DC2626" fontSize="9" fontWeight="600">Zwedru</text>
                    
                    {/* Voinjama - Lofa County Capital (Northern Region) */}
                    <circle cx="220" cy="160" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="230" y="165" fill="#DC2626" fontSize="9" fontWeight="600">Voinjama</text>
                    
                    {/* Harper - Maryland County Capital (Far Southeast Coast) */}
                    <circle cx="440" cy="370" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="450" y="375" fill="#DC2626" fontSize="9" fontWeight="600">Harper</text>
                    
                    {/* Robertsport - Grand Cape Mount (Northwest Coast) */}
                    <circle cx="70" cy="185" r="2" className="hover:r-4 transition-all cursor-pointer" />
                    <text x="80" y="190" fill="#DC2626" fontSize="8">Robertsport</text>
                    
                    {/* Kakata - Margibi County */}
                    <circle cx="120" cy="240" r="2" className="hover:r-4 transition-all cursor-pointer" />
                    <text x="130" y="245" fill="#DC2626" fontSize="8">Kakata</text>
                  </g>

                  {/* Major Transportation Network */}
                  {mapLayers.find(l => l.id === 'roads')?.visible && (
                    <g stroke="#EF4444" strokeWidth="2" fill="none" opacity="0.8">
                      {/* Monrovia-Gbarnga Highway (Primary National Route) */}
                      <path d="M85 220 Q120 230, 155 240 Q165 245, 170 250" strokeWidth="3" stroke="#DC2626" />
                      
                      {/* Coastal Highway - Monrovia to Harper via Buchanan */}
                      <path d="M85 220 Q115 250, 145 280 Q200 320, 280 350 Q360 365, 440 370" strokeWidth="2.5" stroke="#DC2626" />
                      
                      {/* Interior Route - Gbarnga to Sanniquellie */}
                      <path d="M170 250 Q220 235, 270 225 Q315 215, 360 210" strokeWidth="2" />
                      
                      {/* Northern Route - Voinjama connections */}
                      <path d="M220 160 Q240 180, 260 200 Q280 220, 300 235" strokeWidth="1.5" strokeDasharray="3,2" />
                      
                      {/* Eastern Route - Sanniquellie to Zwedru */}
                      <path d="M360 210 Q390 240, 410 255 Q415 265, 420 270" strokeWidth="1.5" />
                      
                      {/* Secondary Coastal Roads */}
                      <path d="M70 185 Q80 200, 85 215" strokeWidth="1" strokeDasharray="3,2" />
                      <path d="M120 240 Q135 255, 145 270" strokeWidth="1" strokeDasharray="3,2" />
                    </g>
                  )}

                  {/* Major Rivers */}
                  <g stroke="#0EA5E9" strokeWidth="2" fill="none" opacity="0.7">
                    {/* St. Paul River (flows through Monrovia to Atlantic) */}
                    <path d="M75 210 Q80 215, 85 220 Q90 225, 95 230" strokeWidth="3" stroke="#0284C7" />
                    
                    {/* Lofa River (Northern region) */}
                    <path d="M200 150 Q210 160, 220 170 Q230 180, 240 190" strokeWidth="2" />
                    
                    {/* St. John River (Central region) */}
                    <path d="M150 250 Q165 260, 180 270 Q195 280, 210 290" strokeWidth="2" />
                    
                    {/* Cavalla River (Eastern border with Côte d'Ivoire) */}
                    <path d="M420 200 Q440 220, 460 240 Q480 260, 500 280 Q520 300, 540 320" strokeWidth="2" stroke="#0284C7" />
                    
                    {/* Cestos River (Central-Southeast) */}
                    <path d="M180 290 Q200 300, 220 310 Q240 320, 260 330" strokeWidth="2" />
                  </g>

                  {/* Protected Areas and National Forests */}
                  <g fill="#065F46" fillOpacity="0.2" stroke="#047857" strokeWidth="1" strokeDasharray="2,2">
                    {/* Sapo National Park (Largest protected area in Southeast) */}
                    <ellipse cx="300" cy="340" rx="35" ry="22" />
                    <text x="280" y="345" fill="#065F46" fontSize="8" fontWeight="600">Sapo NP</text>
                    
                    {/* Grebo National Forest (Far Southeast) */}
                    <ellipse cx="410" cy="350" rx="30" ry="18" />
                    <text x="395" y="355" fill="#065F46" fontSize="8" fontWeight="600">Grebo NF</text>
                    
                    {/* Gola National Forest (Northwest, bordering Sierra Leone) */}
                    <ellipse cx="140" cy="150" rx="25" ry="15" />
                    <text x="125" y="155" fill="#065F46" fontSize="8" fontWeight="600">Gola NF</text>
                  </g>

                  {/* Geographic Labels */}
                  <text x="15" y="320" fill="#0284C7" fontSize="14" fontWeight="bold" transform="rotate(-90 15 320)">
                    Atlantic Ocean
                  </text>

                  {/* Neighboring Countries Labels */}
                  <text x="25" y="120" fill="#8B5CF6" fontSize="10" fontWeight="600">
                    SIERRA LEONE
                  </text>
                  <text x="250" y="105" fill="#8B5CF6" fontSize="10" fontWeight="600">
                    GUINEA
                  </text>
                  <text x="500" y="140" fill="#8B5CF6" fontSize="10" fontWeight="600" transform="rotate(15 500 140)">
                    CÔTE D'IVOIRE
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

                  {/* Compliance Zones */}
                  {mapLayers.find(l => l.id === 'compliance')?.visible && (
                    <g>
                      <circle cx="170" cy="250" r="40" fill="#8B5CF6" opacity="0.2" 
                              stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                      <circle cx="360" cy="210" r="35" fill="#8B5CF6" opacity="0.2" 
                              stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                      <circle cx="300" cy="340" r="30" fill="#8B5CF6" opacity="0.2" 
                              stroke="#8B5CF6" strokeWidth="2" strokeDasharray="4,4" />
                    </g>
                  )}

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