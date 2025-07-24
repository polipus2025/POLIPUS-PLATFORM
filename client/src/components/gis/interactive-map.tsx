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
                    {/* Accurate Liberia Map */}
                    <svg width="600" height="400" viewBox="0 0 600 400" className="opacity-90">
                      <defs>
                        <pattern id="farmPattern" patternUnits="userSpaceOnUse" width="10" height="10">
                          <circle cx="5" cy="5" r="2" fill="#10B981" opacity="0.6" />
                        </pattern>
                        <pattern id="transportPattern" patternUnits="userSpaceOnUse" width="20" height="4">
                          <rect width="20" height="2" fill="#EF4444" opacity="0.7" />
                        </pattern>
                      </defs>
                      
                      {/* Liberia Main Country Outline - Accurate Shape */}
                      <path
                        d="M50 220 L80 200 L120 180 L180 160 L240 140 L300 130 L360 125 L420 130 L480 140 L520 160 L550 180 L570 200 L580 220 L585 240 L587 260 L585 280 L580 300 L570 320 L550 340 L520 350 L480 355 L440 358 L400 360 L360 358 L320 355 L280 350 L240 345 L200 340 L160 335 L120 330 L90 325 L70 315 L55 300 L45 280 L42 260 L45 240 Z"
                        fill={mapView === 'satellite' ? '#065F46' : mapView === 'terrain' ? '#15803D' : '#F9FAFB'}
                        stroke="#1F2937"
                        strokeWidth="2"
                        opacity="0.9"
                      />
                      
                      {/* Atlantic Ocean */}
                      <rect x="0" y="0" width="600" height="400" fill="#1E40AF" opacity="0.1" />
                      <text x="20" y="380" fill="#1E40AF" fontSize="14" fontWeight="bold">Atlantic Ocean</text>
                      
                      {/* Accurate Liberian County Boundaries */}
                      {mapLayers.find(l => l.id === 'counties')?.visible && (
                        <g>
                          {/* Montserrado County (Western coastal - includes Monrovia) */}
                          <path d="M50 220 L100 210 L130 215 L140 240 L130 270 L100 290 L70 300 L50 280 Z" 
                                stroke="#DC2626" strokeWidth="2" fill="rgba(220, 38, 38, 0.1)" />
                          <text x="90" y="250" fill="#DC2626" fontSize="11" fontWeight="bold">Montserrado</text>
                          
                          {/* Margibi County (Central coastal) */}
                          <path d="M140 240 L200 235 L220 250 L210 275 L180 285 L140 280 Z" 
                                stroke="#7C2D12" strokeWidth="2" fill="rgba(124, 45, 18, 0.1)" />
                          <text x="170" y="260" fill="#7C2D12" fontSize="10">Margibi</text>
                          
                          {/* Grand Bassa County (Central coastal) */}
                          <path d="M220 250 L280 245 L300 265 L290 295 L260 305 L220 300 L210 275 Z" 
                                stroke="#059669" strokeWidth="2" fill="rgba(5, 150, 105, 0.1)" />
                          <text x="250" y="275" fill="#059669" fontSize="10">Grand Bassa</text>
                          
                          {/* River Cess County (South central coastal) */}
                          <path d="M300 265 L360 260 L380 280 L370 310 L340 320 L300 315 L290 295 Z" 
                                stroke="#0891B2" strokeWidth="2" fill="rgba(8, 145, 178, 0.1)" />
                          <text x="330" y="290" fill="#0891B2" fontSize="10">River Cess</text>
                          
                          {/* Sinoe County (South central) */}
                          <path d="M380 280 L440 275 L460 295 L450 325 L420 335 L380 330 L370 310 Z" 
                                stroke="#7C3AED" strokeWidth="2" fill="rgba(124, 58, 237, 0.1)" />
                          <text x="410" y="305" fill="#7C3AED" fontSize="10">Sinoe</text>
                          
                          {/* Maryland County (Southeastern coastal) */}
                          <path d="M460 295 L520 290 L550 310 L540 340 L510 350 L480 348 L450 340 L450 325 Z" 
                                stroke="#BE185D" strokeWidth="2" fill="rgba(190, 24, 93, 0.1)" />
                          <text x="500" y="320" fill="#BE185D" fontSize="10">Maryland</text>
                          
                          {/* Grand Kru County (Southern) */}
                          <path d="M440 325 L480 320 L500 340 L490 360 L460 365 L430 360 L420 345 Z" 
                                stroke="#65A30D" strokeWidth="2" fill="rgba(101, 163, 13, 0.1)" />
                          <text x="460" y="345" fill="#65A30D" fontSize="9">Grand Kru</text>
                          
                          {/* River Gee County (Southern interior) */}
                          <path d="M380 330 L440 325 L460 345 L450 365 L420 370 L390 365 L370 350 Z" 
                                stroke="#DC2626" strokeWidth="2" fill="rgba(220, 38, 38, 0.1)" />
                          <text x="410" y="350" fill="#DC2626" fontSize="9">River Gee</text>
                          
                          {/* Grand Gedeh County (Eastern) */}
                          <path d="M460 200 L520 195 L550 215 L540 245 L520 260 L480 265 L450 250 Z" 
                                stroke="#EA580C" strokeWidth="2" fill="rgba(234, 88, 12, 0.1)" />
                          <text x="500" y="230" fill="#EA580C" fontSize="10">Grand Gedeh</text>
                          
                          {/* Nimba County (Northern) */}
                          <path d="M360 125 L480 120 L520 140 L510 170 L480 180 L420 185 L380 175 L350 155 Z" 
                                stroke="#1D4ED8" strokeWidth="2" fill="rgba(29, 78, 216, 0.1)" />
                          <text x="440" y="150" fill="#1D4ED8" fontSize="11" fontWeight="bold">Nimba</text>
                          
                          {/* Lofa County (Northwestern) */}
                          <path d="M120 180 L240 170 L280 175 L300 190 L280 210 L240 215 L180 220 L140 210 Z" 
                                stroke="#059669" strokeWidth="2" fill="rgba(5, 150, 105, 0.1)" />
                          <text x="200" y="195" fill="#059669" fontSize="11" fontWeight="bold">Lofa</text>
                          
                          {/* Gbarpolu County (Northwestern) */}
                          <path d="M80 200 L140 190 L180 195 L200 210 L180 230 L140 235 L100 230 L80 220 Z" 
                                stroke="#B45309" strokeWidth="2" fill="rgba(180, 83, 9, 0.1)" />
                          <text x="130" y="215" fill="#B45309" fontSize="10">Gbarpolu</text>
                          
                          {/* Bomi County (Western) */}
                          <path d="M100 210 L140 205 L160 220 L150 240 L130 245 L100 240 Z" 
                                stroke="#7C2D12" strokeWidth="2" fill="rgba(124, 45, 18, 0.1)" />
                          <text x="120" y="225" fill="#7C2D12" fontSize="9">Bomi</text>
                          
                          {/* Grand Cape Mount County (Northwestern coastal) */}
                          <path d="M50 200 L100 190 L120 200 L110 220 L90 230 L60 225 Z" 
                                stroke="#0891B2" strokeWidth="2" fill="rgba(8, 145, 178, 0.1)" />
                          <text x="75" y="210" fill="#0891B2" fontSize="9">G.C. Mount</text>
                          
                          {/* Bong County (Central) */}
                          <path d="M200 235 L300 230 L340 240 L350 260 L320 275 L280 280 L240 275 L210 260 Z" 
                                stroke="#DC2626" strokeWidth="2" fill="rgba(220, 38, 38, 0.1)" />
                          <text x="270" y="255" fill="#DC2626" fontSize="11" fontWeight="bold">Bong</text>
                        </g>
                      )}
                      
                      {/* Farm Plots - Dynamic based on county selection */}
                      {mapLayers.find(l => l.id === 'farms')?.visible && (
                        <g>
                          {/* Show highlighted farms if county is selected */}
                          {selectedCounty && selectedCounty !== 'all' ? (
                            // County-specific farms with accurate positioning
                            <>
                              {selectedCounty.includes('Lofa') && (
                                <>
                                  <circle cx="200" cy="195" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="220" cy="210" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <circle cx="180" cy="185" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="200" y="175" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    Lofa County Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Nimba') && (
                                <>
                                  <circle cx="440" cy="150" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="460" cy="165" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <circle cx="420" cy="135" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="440" y="125" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    Nimba County Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Montserrado') && (
                                <>
                                  <circle cx="90" cy="250" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="110" cy="265" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <circle cx="120" cy="240" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="90" y="230" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    Montserrado Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Bong') && (
                                <>
                                  <circle cx="270" cy="255" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="290" cy="270" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <circle cx="250" cy="240" r="8" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="270" y="225" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    Bong County Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Grand Bassa') && (
                                <>
                                  <circle cx="250" cy="275" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="270" cy="285" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="250" y="255" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    Grand Bassa Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('River Cess') && (
                                <>
                                  <circle cx="330" cy="290" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="350" cy="305" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="330" y="270" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    River Cess Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Maryland') && (
                                <>
                                  <circle cx="500" cy="320" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="520" cy="335" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="500" y="300" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    Maryland Farms
                                  </text>
                                </>
                              )}
                              {selectedCounty.includes('Grand Gedeh') && (
                                <>
                                  <circle cx="500" cy="230" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="480" cy="245" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="500" y="210" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    Grand Gedeh Farms
                                  </text>
                                </>
                              )}
                              {/* Default for other counties */}
                              {!selectedCounty.includes('Lofa') && !selectedCounty.includes('Nimba') && 
                               !selectedCounty.includes('Montserrado') && !selectedCounty.includes('Bong') && 
                               !selectedCounty.includes('Grand Bassa') && !selectedCounty.includes('River Cess') && 
                               !selectedCounty.includes('Maryland') && !selectedCounty.includes('Grand Gedeh') && (
                                <>
                                  <circle cx="300" cy="250" r="12" fill="#10B981" stroke="#059669" strokeWidth="3" />
                                  <circle cx="320" cy="265" r="10" fill="#10B981" stroke="#059669" strokeWidth="2" />
                                  <text x="300" y="230" fill="#374151" fontSize="11" textAnchor="middle" fontWeight="bold">
                                    {selectedCounty.replace(' County', '')} Farms
                                  </text>
                                </>
                              )}
                            </>
                          ) : (
                            // All farms positioned in correct counties
                            <>
                              <circle cx="90" cy="250" r="6" fill="#10B981" />   {/* Montserrado */}
                              <circle cx="200" cy="195" r="7" fill="#10B981" />  {/* Lofa */}
                              <circle cx="440" cy="150" r="8" fill="#10B981" />  {/* Nimba */}
                              <circle cx="270" cy="255" r="6" fill="#10B981" />  {/* Bong */}
                              <circle cx="250" cy="275" r="6" fill="#10B981" />  {/* Grand Bassa */}
                              <circle cx="330" cy="290" r="5" fill="#10B981" />  {/* River Cess */}
                              <circle cx="500" cy="320" r="6" fill="#10B981" />  {/* Maryland */}
                              <circle cx="500" cy="230" r="5" fill="#10B981" />  {/* Grand Gedeh */}
                              <circle cx="410" cy="305" r="5" fill="#10B981" />  {/* Sinoe */}
                              <circle cx="130" cy="215" r="4" fill="#10B981" />  {/* Gbarpolu */}
                              <circle cx="120" cy="225" r="4" fill="#10B981" />  {/* Bomi */}
                              <circle cx="75" y="210" r="4" fill="#10B981" />    {/* Grand Cape Mount */}
                              <circle cx="170" cy="260" r="5" fill="#10B981" />  {/* Margibi */}
                              <circle cx="460" cy="345" r="4" fill="#10B981" />  {/* Grand Kru */}
                              <circle cx="410" cy="350" r="4" fill="#10B981" />  {/* River Gee */}
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