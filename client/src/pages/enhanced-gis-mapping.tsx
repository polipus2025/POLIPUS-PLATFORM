import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Map, 
  Layers, 
  Navigation, 
  Satellite, 
  MapPin, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Filter,
  Info,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Eye,
  EyeOff,
  Settings,
  Truck,
  Radio,
  Activity,
  Shield,
  TreePine,
  Flame,
  Users,
  Clock,
  Bell,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Globe,
  Wifi
} from 'lucide-react';

// Liberian Counties
const LIBERIAN_COUNTIES = [
  'All Counties',
  'Bomi County', 'Bong County', 'Gbarpolu County', 'Grand Bassa County',
  'Grand Cape Mount County', 'Grand Gedeh County', 'Grand Kru County',
  'Lofa County', 'Margibi County', 'Maryland County', 'Montserrado County',
  'Nimba County', 'River Cess County', 'River Gee County', 'Sinoe County'
];

// Data layers configuration
const MAP_LAYERS = [
  { id: 'satellite', name: 'Satellite Imagery', icon: Satellite, color: 'bg-blue-500', active: true },
  { id: 'farms', name: 'Farm Boundaries', icon: MapPin, color: 'bg-green-500', active: true },
  { id: 'compliance', name: 'Compliance Zones', icon: CheckCircle, color: 'bg-emerald-500', active: false },
  { id: 'deforestation', name: 'Deforestation Alerts', icon: AlertTriangle, color: 'bg-red-500', active: false },
  { id: 'transportation', name: 'Transport Routes', icon: Navigation, color: 'bg-purple-500', active: false },
  { id: 'vehicle_tracking', name: 'Vehicle Tracking', icon: Truck, color: 'bg-orange-500', active: false },
  { id: 'fire_alerts', name: 'Fire Detection', icon: Flame, color: 'bg-red-600', active: false },
  { id: 'forest_monitoring', name: 'Forest Monitoring', icon: TreePine, color: 'bg-green-600', active: false },
  { id: 'field_agents', name: 'Field Agents', icon: Users, color: 'bg-indigo-500', active: false },
  { id: 'counties', name: 'County Boundaries', icon: Map, color: 'bg-gray-500', active: true }
];

// Mock farm data with realistic Liberian coordinates
const FARM_DATA = [
  { id: 'farm-001', name: 'Kollie Family Farm', county: 'Lofa County', lat: 7.2253, lng: -9.0039, crop: 'Cocoa', area: 15.2, compliance: 'compliant' },
  { id: 'farm-002', name: 'Bassa Agricultural Cooperative', county: 'Grand Bassa County', lat: 6.2317, lng: -9.4737, crop: 'Coffee', area: 28.7, compliance: 'pending' },
  { id: 'farm-003', name: 'Nimba Coffee Estate', county: 'Nimba County', lat: 7.5925, lng: -8.6582, crop: 'Coffee', area: 45.3, compliance: 'compliant' },
  { id: 'farm-004', name: 'Montserrado Rice Fields', county: 'Montserrado County', lat: 6.3133, lng: -10.8074, crop: 'Rice', area: 12.8, compliance: 'non-compliant' },
  { id: 'farm-005', name: 'Bong County Palm Plantation', county: 'Bong County', lat: 6.8296, lng: -9.3678, crop: 'Oil Palm', area: 67.9, compliance: 'compliant' }
];

// Vehicle tracking data
const VEHICLE_DATA = [
  { id: 'truck-001', type: 'Transport Truck', lat: 6.3000, lng: -10.7900, status: 'moving', cargo: 'Cocoa beans', destination: 'Port of Monrovia' },
  { id: 'truck-002', type: 'Field Vehicle', lat: 7.2100, lng: -9.0200, status: 'stopped', cargo: 'Equipment', destination: 'Lofa Inspection Site' },
  { id: 'truck-003', type: 'Export Container', lat: 6.3133, lng: -10.8074, status: 'loading', cargo: 'Coffee', destination: 'Hamburg, Germany' }
];

// Deforestation alerts data
const DEFORESTATION_ALERTS = [
  { id: 'alert-001', lat: 7.1800, lng: -8.9500, severity: 'high', area: 2.5, date: '2025-01-20', status: 'active' },
  { id: 'alert-002', lat: 6.9200, lng: -9.2100, severity: 'medium', area: 1.2, date: '2025-01-18', status: 'investigating' },
  { id: 'alert-003', lat: 7.4500, lng: -8.7800, severity: 'low', area: 0.8, date: '2025-01-15', status: 'resolved' }
];

// Field agents data
const FIELD_AGENTS = [
  { id: 'agent-001', name: 'Sarah Konneh', lat: 7.2200, lng: -9.0100, county: 'Lofa County', status: 'active', lastUpdate: '10 min ago' },
  { id: 'agent-002', name: 'James Tubman', lat: 6.2400, lng: -9.4500, county: 'Grand Bassa County', status: 'offline', lastUpdate: '2 hours ago' },
  { id: 'agent-003', name: 'Mary Kollie', lat: 7.5800, lng: -8.6700, county: 'Nimba County', status: 'active', lastUpdate: '5 min ago' }
];

export default function EnhancedGISMapping() {
  const [selectedCounty, setSelectedCounty] = useState('All Counties');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('map');
  const [zoomLevel, setZoomLevel] = useState(7);
  const [mapCenter, setMapCenter] = useState({ lat: 6.4281, lng: -9.4295 }); // Liberia center
  const [selectedFarm, setSelectedFarm] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [layers, setLayers] = useState(MAP_LAYERS);
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [alertsCount, setAlertsCount] = useState(12);
  const mapRef = useRef<HTMLDivElement>(null);

  // Filter farms based on county selection
  const filteredFarms = FARM_DATA.filter(farm => 
    selectedCounty === 'All Counties' || farm.county === selectedCounty
  ).filter(farm => 
    searchQuery === '' || farm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle layer visibility
  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, active: !layer.active } : layer
    ));
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 1));
  const resetView = () => {
    setZoomLevel(7);
    setMapCenter({ lat: 6.4281, lng: -9.4295 });
    setSelectedFarm(null);
  };

  // Focus on farm
  const focusOnFarm = (farm: any) => {
    setMapCenter({ lat: farm.lat, lng: farm.lng });
    setZoomLevel(12);
    setSelectedFarm(farm);
  };

  // Export map data
  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      county_filter: selectedCounty,
      total_farms: filteredFarms.length,
      farms: filteredFarms,
      active_layers: layers.filter(layer => layer.active).map(layer => layer.name)
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gis-mapping-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Enhanced GIS Mapping - AgriTrace360™</title>
        <meta name="description" content="Advanced GIS mapping system for agricultural monitoring and compliance tracking" />
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Map className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enhanced GIS Mapping</h1>
              <p className="text-sm text-gray-600">Advanced agricultural monitoring and compliance tracking</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              {filteredFarms.length} Farms
            </Badge>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              {VEHICLE_DATA.length} Vehicles
            </Badge>
            <Badge variant="outline" className="text-red-600 border-red-600">
              {alertsCount} Alerts
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setRealTimeUpdates(!realTimeUpdates)}>
              {realTimeUpdates ? <Wifi className="h-4 w-4 mr-2" /> : <Radio className="h-4 w-4 mr-2" />}
              {realTimeUpdates ? 'Live' : 'Offline'}
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Truck className="h-3 w-3 mr-1" />
                Track Vehicle
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                View Alerts
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <TreePine className="h-3 w-3 mr-1" />
                Forest Monitor
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Users className="h-3 w-3 mr-1" />
                Field Agents
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 border-b border-gray-200">
            {/* County Filter */}
            <div className="mb-4">
              <Label htmlFor="county-select" className="text-sm font-medium mb-2 block">
                Filter by County
              </Label>
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {LIBERIAN_COUNTIES.map(county => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="mb-4">
              <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                Search Farms
              </Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by farm name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
                Zoom: {zoomLevel}
              </span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Layer Controls */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Map Layers
            </h3>
            <div className="space-y-2">
              {layers.map(layer => {
                const IconComponent = layer.icon;
                return (
                  <div key={layer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${layer.color} ${layer.active ? 'opacity-100' : 'opacity-50'}`}>
                        <IconComponent className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm">{layer.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLayer(layer.id)}
                      className="h-6 w-6 p-0"
                    >
                      {layer.active ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Farm List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3">Farm Locations</h3>
              <div className="space-y-2">
                {filteredFarms.map(farm => (
                  <Card 
                    key={farm.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedFarm?.id === farm.id ? 'ring-2 ring-green-500 bg-green-50' : ''
                    }`}
                    onClick={() => focusOnFarm(farm)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{farm.name}</h4>
                        <Badge 
                          variant={farm.compliance === 'compliant' ? 'default' : 
                                 farm.compliance === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {farm.compliance}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>{farm.county}</div>
                        <div>{farm.crop} • {farm.area} ha</div>
                        <div className="font-mono">
                          {farm.lat.toFixed(4)}, {farm.lng.toFixed(4)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="mx-6 mt-4 w-fit">
              <TabsTrigger value="map">Interactive Map</TabsTrigger>
              <TabsTrigger value="satellite">Satellite View</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="flex-1 m-6 mt-2">
              <Card className="h-full">
                <CardContent className="p-0 h-full relative">
                  {/* Map Container */}
                  <div 
                    ref={mapRef}
                    className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
                      `
                    }}
                  >
                    {/* Liberia Outline */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                      {/* Simplified Liberia country outline */}
                      <path
                        d="M50 150 Q70 120 100 130 L150 125 Q180 115 200 140 L240 145 Q260 160 250 180 L245 200 Q240 220 220 225 L180 230 Q150 235 120 225 L80 215 Q60 200 50 180 Z"
                        fill="rgba(34, 197, 94, 0.1)"
                        stroke="rgba(34, 197, 94, 0.3)"
                        strokeWidth="2"
                      />
                      
                      {/* County boundaries */}
                      {layers.find(l => l.id === 'counties')?.active && (
                        <g stroke="rgba(107, 114, 128, 0.4)" strokeWidth="1" fill="none">
                          <line x1="80" y1="150" x2="200" y2="155" />
                          <line x1="120" y1="140" x2="180" y2="200" />
                          <line x1="160" y1="130" x2="220" y2="180" />
                        </g>
                      )}
                      
                      {/* Farm markers */}
                      {layers.find(l => l.id === 'farms')?.active && filteredFarms.map(farm => {
                        // Convert lat/lng to SVG coordinates (simplified projection)
                        const x = ((farm.lng + 11.5) / 4.5) * 400;
                        const y = ((8.5 - farm.lat) / 3) * 300;
                        
                        return (
                          <g key={farm.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r={selectedFarm?.id === farm.id ? "8" : "5"}
                              fill={farm.compliance === 'compliant' ? '#10b981' : 
                                   farm.compliance === 'pending' ? '#f59e0b' : '#ef4444'}
                              stroke="#fff"
                              strokeWidth="2"
                              className="cursor-pointer hover:r-6"
                              onClick={() => focusOnFarm(farm)}
                            />
                            {selectedFarm?.id === farm.id && (
                              <text
                                x={x}
                                y={y - 15}
                                textAnchor="middle"
                                className="text-xs font-medium fill-gray-800"
                              >
                                {farm.name}
                              </text>
                            )}
                          </g>
                        );
                      })}
         
                      {/* Transportation routes */}
                      {layers.find(l => l.id === 'transportation')?.active && (
                        <g stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="5,5">
                          <path d="M60 160 Q120 140 180 150 Q220 155 250 170" />
                          <path d="M100 180 Q150 170 200 180 Q230 185 240 200" />
                        </g>
                      )}

                      {/* Vehicle tracking markers */}
                      {layers.find(l => l.id === 'vehicle_tracking')?.active && VEHICLE_DATA.map(vehicle => {
                        const x = ((vehicle.lng + 11.5) / 4.5) * 400;
                        const y = ((8.5 - vehicle.lat) / 3) * 300;
                        
                        return (
                          <g key={vehicle.id}>
                            <rect
                              x={x - 6}
                              y={y - 6}
                              width="12"
                              height="12"
                              fill={vehicle.status === 'moving' ? '#f97316' : vehicle.status === 'stopped' ? '#dc2626' : '#eab308'}
                              stroke="#fff"
                              strokeWidth="2"
                              className="cursor-pointer"
                              onClick={() => setSelectedVehicle(vehicle)}
                            />
                            {vehicle.status === 'moving' && (
                              <circle cx={x} cy={y} r="15" fill="none" stroke="#f97316" strokeWidth="1" opacity="0.5">
                                <animate attributeName="r" from="5" to="15" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
                              </circle>
                            )}
                          </g>
                        );
                      })}

                      {/* Deforestation alerts */}
                      {layers.find(l => l.id === 'deforestation')?.active && DEFORESTATION_ALERTS.map(alert => {
                        const x = ((alert.lng + 11.5) / 4.5) * 400;
                        const y = ((8.5 - alert.lat) / 3) * 300;
                        
                        return (
                          <g key={alert.id}>
                            <polygon
                              points={`${x},${y-8} ${x+8},${y+8} ${x-8},${y+8}`}
                              fill={alert.severity === 'high' ? '#dc2626' : alert.severity === 'medium' ? '#f97316' : '#eab308'}
                              stroke="#fff"
                              strokeWidth="2"
                              className="cursor-pointer"
                              onClick={() => setSelectedAlert(alert)}
                            />
                            {alert.severity === 'high' && (
                              <circle cx={x} cy={y} r="20" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.3">
                                <animate attributeName="r" from="8" to="20" dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.6" to="0" dur="3s" repeatCount="indefinite" />
                              </circle>
                            )}
                          </g>
                        );
                      })}

                      {/* Field agents */}
                      {layers.find(l => l.id === 'field_agents')?.active && FIELD_AGENTS.map(agent => {
                        const x = ((agent.lng + 11.5) / 4.5) * 400;
                        const y = ((8.5 - agent.lat) / 3) * 300;
                        
                        return (
                          <g key={agent.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r="6"
                              fill={agent.status === 'active' ? '#6366f1' : '#94a3b8'}
                              stroke="#fff"
                              strokeWidth="2"
                              className="cursor-pointer"
                            />
                            {agent.status === 'active' && (
                              <circle cx={x} cy={y} r="12" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0.4">
                                <animate attributeName="r" from="6" to="12" dur="2s" repeatCount="indefinite" />
                                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                              </circle>
                            )}
                          </g>
                        );
                      })}

                      {/* Fire/Forest monitoring alerts */}
                      {layers.find(l => l.id === 'fire_alerts')?.active && (
                        <g>
                          <circle cx="120" cy="180" r="8" fill="#dc2626" stroke="#fff" strokeWidth="2" className="cursor-pointer" />
                          <circle cx="200" cy="160" r="6" fill="#f97316" stroke="#fff" strokeWidth="2" className="cursor-pointer" />
                        </g>
                      )}

                      {/* Compliance zones */}
                      {layers.find(l => l.id === 'compliance')?.active && (
                        <g fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2">
                          <circle cx="150" cy="160" r="30" />
                          <circle cx="200" cy="190" r="25" />
                        </g>
                      )}
                    </svg>

                    {/* Map Overlay Info */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>Center:</strong> {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</div>
                        <div><strong>Zoom:</strong> {zoomLevel}</div>
                        <div><strong>Visible Farms:</strong> {filteredFarms.length}</div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-48">
                      <h4 className="text-xs font-semibold mb-2">Legend</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Compliant Farms</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span>Pending Review</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span>Non-Compliant</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500"></div>
                          <span>Moving Vehicle</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-600"></div>
                          <span>Stopped Vehicle</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-red-600"></div>
                          <span>Deforestation Alert</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                          <span>Active Field Agent</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-600"></div>
                          <span>Fire Detection</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="satellite" className="flex-1 m-6 mt-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5" />
                    Satellite Imagery Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <div>
                      <h3 className="font-semibold mb-4">Recent Satellite Data</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Landsat 9 Coverage</span>
                            <Badge>Latest</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Date: {new Date().toLocaleDateString()}</div>
                            <div>Resolution: 30m</div>
                            <div>Cloud Cover: 8%</div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Sentinel-2 Analysis</span>
                            <Badge variant="secondary">Processing</Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Date: {new Date(Date.now() - 86400000).toLocaleDateString()}</div>
                            <div>Resolution: 10m</div>
                            <div>NDVI Coverage: Available</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Analysis Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Vegetation Health (NDVI)</span>
                            <span>82%</span>
                          </div>
                          <Progress value={82} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Forest Cover</span>
                            <span>67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Agricultural Area</span>
                            <span>45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 m-6 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Farm Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {LIBERIAN_COUNTIES.slice(1).map(county => {
                        const farmCount = FARM_DATA.filter(farm => farm.county === county).length;
                        const percentage = (farmCount / FARM_DATA.length) * 100;
                        
                        return (
                          <div key={county}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{county}</span>
                              <span>{farmCount} farms</span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {Math.round((FARM_DATA.filter(f => f.compliance === 'compliant').length / FARM_DATA.length) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Overall Compliance Rate</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Compliant</span>
                          </div>
                          <span className="font-medium">
                            {FARM_DATA.filter(f => f.compliance === 'compliant').length}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm">Pending Review</span>
                          </div>
                          <span className="font-medium">
                            {FARM_DATA.filter(f => f.compliance === 'pending').length}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">Non-Compliant</span>
                          </div>
                          <span className="font-medium">
                            {FARM_DATA.filter(f => f.compliance === 'non-compliant').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Selected Farm Details Modal */}
      {selectedFarm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">{selectedFarm.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFarm(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-500">County</div>
                    <div>{selectedFarm.county}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Crop Type</div>
                    <div>{selectedFarm.crop}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Area</div>
                    <div>{selectedFarm.area} hectares</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Status</div>
                    <Badge 
                      variant={selectedFarm.compliance === 'compliant' ? 'default' : 
                               selectedFarm.compliance === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {selectedFarm.compliance}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-500 mb-1">Coordinates</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {selectedFarm.lat.toFixed(6)}, {selectedFarm.lng.toFixed(6)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Info className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Vehicle Details Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {selectedVehicle.type}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedVehicle(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-500">Status</div>
                    <Badge 
                      variant={selectedVehicle.status === 'moving' ? 'default' : 
                               selectedVehicle.status === 'stopped' ? 'destructive' : 'secondary'}
                    >
                      {selectedVehicle.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Vehicle ID</div>
                    <div>{selectedVehicle.id}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Cargo</div>
                    <div>{selectedVehicle.cargo}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Destination</div>
                    <div>{selectedVehicle.destination}</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-500 mb-1">Current Location</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {selectedVehicle.lat.toFixed(6)}, {selectedVehicle.lng.toFixed(6)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="h-4 w-4 mr-2" />
                    Track Route
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Radio className="h-4 w-4 mr-2" />
                    Contact Driver
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Deforestation Alert
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-500">Severity</div>
                    <Badge 
                      variant={selectedAlert.severity === 'high' ? 'destructive' : 
                               selectedAlert.severity === 'medium' ? 'secondary' : 'default'}
                    >
                      {selectedAlert.severity}
                    </Badge>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Alert ID</div>
                    <div>{selectedAlert.id}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Area Affected</div>
                    <div>{selectedAlert.area} hectares</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-500">Status</div>
                    <div className="capitalize">{selectedAlert.status}</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-500 mb-1">Detection Date</div>
                  <div className="text-sm">{selectedAlert.date}</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-500 mb-1">Location</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {selectedAlert.lat.toFixed(6)}, {selectedAlert.lng.toFixed(6)}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Info className="h-4 w-4 mr-2" />
                    Investigate
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Assign Agent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}