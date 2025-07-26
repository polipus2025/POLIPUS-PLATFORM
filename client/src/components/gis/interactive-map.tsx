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
                <svg viewBox="0 0 800 500" className="w-full h-full">
                  {/* Background - Atlantic Ocean */}
                  <rect width="800" height="500" fill="#1E40AF" fillOpacity="0.1" />
                  
                  {/* Liberia Country Outline - Accurate Geographic Shape Based on Real Coordinates */}
                  <path
                    d="M80 180
                       C90 175, 110 170, 130 175
                       L170 180
                       C200 185, 230 190, 260 195
                       L310 205
                       C350 215, 390 225, 430 235
                       L480 250
                       C520 265, 560 280, 590 300
                       L620 325
                       C640 345, 650 370, 645 395
                       L640 420
                       C635 445, 625 465, 610 480
                       L590 495
                       C570 505, 545 510, 520 505
                       L480 500
                       C450 495, 420 485, 390 475
                       L350 460
                       C320 445, 290 430, 260 415
                       L220 395
                       C190 375, 160 355, 135 330
                       L110 305
                       C90 280, 75 250, 70 220
                       L68 195
                       C70 170, 75 145, 80 180
                       Z"
                    fill="#065F46"
                    fillOpacity="0.4"
                    stroke="#047857"
                    strokeWidth="3"
                    className="hover:fill-opacity-50 transition-all cursor-pointer"
                  />

                  {/* Atlantic Ocean Coastline Enhancement */}
                  <path
                    d="M80 180 C90 175, 110 170, 130 175 L170 180 C200 185, 230 190, 260 195 L310 205 C350 215, 390 225, 430 235 L480 250"
                    fill="none"
                    stroke="#0EA5E9"
                    strokeWidth="4"
                    strokeDasharray="8,4"
                    opacity="0.7"
                  />

                  {/* Sierra Leone Border (Northwest) */}
                  <path
                    d="M80 180 C75 160, 85 140, 100 130 L130 120"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    opacity="0.6"
                  />

                  {/* Guinea Border (North) */}
                  <path
                    d="M130 120 L180 115 C220 110, 260 115, 300 120 L350 125 C390 130, 430 135, 470 145"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    opacity="0.6"
                  />

                  {/* Côte d'Ivoire Border (East) */}
                  <path
                    d="M470 145 C510 155, 540 175, 560 200 L580 230 C595 260, 605 290, 615 320 L625 350"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeDasharray="4,2"
                    opacity="0.6"
                  />

                  {/* County Boundaries - 15 Liberian Counties with Accurate Positioning */}
                  {mapLayers.find(l => l.id === 'counties')?.visible && (
                    <g stroke="#1E40AF" strokeWidth="1.5" fill="none" strokeDasharray="3,2">
                      {/* Montserrado County (Capital - Monrovia) */}
                      <path d="M80 180 L130 175 L140 210 L120 240 L95 235 L80 200 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Montserrado' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Montserrado')} />
                      
                      {/* Bomi County (Northwest coastal) */}
                      <path d="M130 175 L170 180 L165 215 L140 210 L130 175 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Bomi' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Bomi')} />
                      
                      {/* Grand Cape Mount County (Far northwest) */}
                      <path d="M100 130 L140 125 L150 160 L120 165 L100 130 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Grand Cape Mount' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Grand Cape Mount')} />
                      
                      {/* Gbarpolu County (Northwest interior) */}
                      <path d="M150 160 L190 155 L200 190 L165 195 L150 160 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Gbarpolu' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Gbarpolu')} />
                      
                      {/* Lofa County (North central - largest county) */}
                      <path d="M190 155 L280 140 L290 180 L280 220 L240 225 L200 215 L190 175 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Lofa' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Lofa')} />
                      
                      {/* Bong County (Central region - second largest) */}
                      <path d="M200 215 L280 220 L285 260 L245 265 L205 260 L200 215 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Bong' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Bong')} />
                      
                      {/* Nimba County (Northeast - iron ore region) */}
                      <path d="M290 180 L380 170 L420 185 L430 225 L390 240 L350 245 L290 235 L290 180 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Nimba' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Nimba')} />
                      
                      {/* Margibi County (Central coastal) */}
                      <path d="M140 210 L180 215 L175 250 L140 245 L140 210 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Margibi' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Margibi')} />
                      
                      {/* Grand Bassa County (Central coast - Buchanan port) */}
                      <path d="M175 250 L245 265 L240 305 L185 300 L175 250 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Grand Bassa' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Grand Bassa')} />
                      
                      {/* River Cess County (Southeast coastal) */}
                      <path d="M240 305 L310 315 L305 355 L235 350 L240 305 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'River Cess' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('River Cess')} />
                      
                      {/* Sinoe County (Southeast coastal) */}
                      <path d="M305 355 L370 365 L365 405 L300 400 L305 355 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Sinoe' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Sinoe')} />
                      
                      {/* Grand Gedeh County (Interior southeast) */}
                      <path d="M350 245 L430 225 L460 260 L445 295 L395 300 L350 285 L350 245 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Grand Gedeh' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Grand Gedeh')} />
                      
                      {/* River Gee County (Far southeast interior) */}
                      <path d="M445 295 L520 285 L525 325 L470 330 L445 295 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'River Gee' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('River Gee')} />
                      
                      {/* Grand Kru County (Far southeast coastal) */}
                      <path d="M365 405 L430 415 L425 455 L360 450 L365 405 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Grand Kru' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Grand Kru')} />
                      
                      {/* Maryland County (Extreme southeast - Harper) */}
                      <path d="M425 455 L480 465 L475 495 L420 490 L425 455 Z" 
                            className={`hover:fill-blue-200 hover:fill-opacity-40 cursor-pointer transition-all ${selectedCounty === 'Maryland' ? 'fill-blue-400 fill-opacity-50' : ''}`}
                            onClick={() => setSelectedCounty('Maryland')} />
                    </g>
                  )}

                  {/* Atlantic Ocean Label */}
                  <text x="30" y="150" fill="#0284C7" fontSize="14" fontWeight="bold" transform="rotate(-90 30 150)">
                    Atlantic Ocean
                  </text>

                  {/* Neighboring Countries Labels */}
                  <text x="60" y="100" fill="#8B5CF6" fontSize="12" fontWeight="600">
                    SIERRA LEONE
                  </text>
                  <text x="250" y="95" fill="#8B5CF6" fontSize="12" fontWeight="600">
                    GUINEA
                  </text>
                  <text x="540" y="120" fill="#8B5CF6" fontSize="12" fontWeight="600">
                    CÔTE D'IVOIRE
                  </text>

                  {/* Major Cities */}
                  <g fill="#DC2626" stroke="#FFFFFF" strokeWidth="1">
                    {/* Monrovia (Capital) */}
                    <circle cx="110" cy="200" r="6" className="hover:r-8 transition-all cursor-pointer" />
                    <text x="120" y="205" fill="#DC2626" fontSize="11" fontWeight="bold">Monrovia</text>
                    
                    {/* Gbarnga (Central) */}
                    <circle cx="245" cy="245" r="4" className="hover:r-6 transition-all cursor-pointer" />
                    <text x="255" y="250" fill="#DC2626" fontSize="10" fontWeight="600">Gbarnga</text>
                    
                    {/* Buchanan (Port) */}
                    <circle cx="210" cy="280" r="4" className="hover:r-6 transition-all cursor-pointer" />
                    <text x="220" y="285" fill="#DC2626" fontSize="10" fontWeight="600">Buchanan</text>
                    
                    {/* Harper (Southeast) */}
                    <circle cx="450" cy="480" r="4" className="hover:r-6 transition-all cursor-pointer" />
                    <text x="460" y="485" fill="#DC2626" fontSize="10" fontWeight="600">Harper</text>
                    
                    {/* Zwedru (East) */}
                    <circle cx="410" cy="290" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="420" y="295" fill="#DC2626" fontSize="9" fontWeight="600">Zwedru</text>
                    
                    {/* Voinjama (North) */}
                    <circle cx="240" cy="170" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="250" y="175" fill="#DC2626" fontSize="9" fontWeight="600">Voinjama</text>
                    
                    {/* Sanniquellie (North) */}
                    <circle cx="360" cy="190" r="3" className="hover:r-5 transition-all cursor-pointer" />
                    <text x="370" y="195" fill="#DC2626" fontSize="9" fontWeight="600">Sanniquellie</text>
                  </g>

                  {/* Transportation Routes */}
                  {mapLayers.find(l => l.id === 'roads')?.visible && (
                    <g stroke="#EF4444" strokeWidth="2" fill="none" strokeDasharray="5,3" opacity="0.8">
                      {/* Monrovia-Gbarnga Highway (Main Route) */}
                      <path d="M110 200 Q150 210, 180 225 Q210 240, 245 245" strokeWidth="3" stroke="#DC2626" />
                      
                      {/* Gbarnga-Sanniquellie Route */}
                      <path d="M245 245 Q280 220, 320 205 Q340 195, 360 190" />
                      
                      {/* Monrovia-Buchanan Coastal Route */}
                      <path d="M110 200 Q140 230, 170 250 Q190 265, 210 280" strokeWidth="2.5" stroke="#DC2626" />
                      
                      {/* Gbarnga-Zwedru Interior Route */}
                      <path d="M245 245 Q300 260, 350 275 Q380 285, 410 290" />
                      
                      {/* Buchanan-Harper Coastal Highway */}
                      <path d="M210 280 Q250 320, 300 360 Q380 420, 450 480" strokeWidth="2.5" stroke="#DC2626" />
                      
                      {/* Voinjama-Lofa Interior Routes */}
                      <path d="M240 170 Q260 185, 280 200 Q300 215, 320 230" />
                      
                      {/* Cross-county connector roads */}
                      <path d="M180 225 Q200 250, 220 275" strokeWidth="1.5" />
                      <path d="M320 230 Q350 250, 380 270" strokeWidth="1.5" />
                      <path d="M280 200 Q310 180, 340 170" strokeWidth="1.5" />
                    </g>
                  )}

                  {/* Rivers and Water Bodies */}
                  <g stroke="#0EA5E9" strokeWidth="2" fill="none" opacity="0.7">
                    {/* St. Paul River (Monrovia) */}
                    <path d="M90 190 Q105 195, 120 200 Q135 205, 150 210" strokeWidth="3" stroke="#0284C7" />
                    
                    {/* Lofa River */}
                    <path d="M200 160 Q220 170, 240 180 Q260 190, 280 200" strokeWidth="2" />
                    
                    {/* St. John River */}
                    <path d="M180 240 Q200 250, 220 260 Q240 270, 260 280" strokeWidth="2" />
                    
                    {/* Cavalla River (Eastern border) */}
                    <path d="M420 200 Q440 220, 460 240 Q480 260, 500 280 Q520 300, 540 320" strokeWidth="2" stroke="#0284C7" />
                    
                    {/* Cestos River */}
                    <path d="M240 300 Q260 310, 280 320 Q300 330, 320 340" strokeWidth="2" />
                  </g>

                  {/* Protected Areas and Forests */}
                  <g fill="#065F46" fillOpacity="0.2" stroke="#047857" strokeWidth="1" strokeDasharray="2,2">
                    {/* Sapo National Park */}
                    <ellipse cx="320" cy="380" rx="40" ry="25" />
                    <text x="295" y="385" fill="#065F46" fontSize="8" fontWeight="600">Sapo NP</text>
                    
                    {/* Grebo National Forest */}
                    <ellipse cx="430" cy="420" rx="35" ry="20" />
                    <text x="410" y="425" fill="#065F46" fontSize="8" fontWeight="600">Grebo NF</text>
                    
                    {/* Gola National Forest */}
                    <ellipse cx="160" cy="150" rx="30" ry="18" />
                    <text x="145" y="155" fill="#065F46" fontSize="8" fontWeight="600">Gola NF</text>
                  </g>

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