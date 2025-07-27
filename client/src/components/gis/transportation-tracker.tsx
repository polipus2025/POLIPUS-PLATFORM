import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Clock, 
  Route,
  AlertTriangle,
  CheckCircle,
  Circle,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface VehicleLocation {
  vehicleId: string;
  driverName: string;
  coordinates: [number, number];
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  speed: number;
  heading: number;
  lastUpdate: string;
  route: string;
  cargo: string;
  destination: string;
  eta: string;
}

interface TransportationRoute {
  id: string;
  name: string;
  waypoints: Array<[number, number]>;
  totalDistance: number;
  estimatedTime: number;
  checkpoints: string[];
}

export default function TransportationTracker() {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [trackingActive, setTrackingActive] = useState(true);
  const [routeFilter, setRouteFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: vehicleData, refetch } = useQuery<{liveUpdates: VehicleLocation[]}>({
    queryKey: ['/api/transportation/vehicle-tracking'],
    refetchInterval: trackingActive ? 30000 : false, // 30 second updates
  });

  const { data: routes = [] } = useQuery<TransportationRoute[]>({
    queryKey: ['/api/transportation/routes'],
  });

  const vehicles = vehicleData?.liveUpdates || [];
  const filteredVehicles = vehicles.filter(vehicle => {
    if (routeFilter && vehicle.route !== routeFilter) return false;
    if (statusFilter && vehicle.status !== statusFilter) return false;
    return true;
  });

  const selectedVehicleData = vehicles.find(v => v.vehicleId === selectedVehicle);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'idle': return <Clock className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transportation Tracker</h2>
          <p className="text-gray-600">Real-time GPS tracking of commodity transport vehicles</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={trackingActive ? "default" : "outline"}
            size="sm"
            onClick={() => setTrackingActive(!trackingActive)}
          >
            {trackingActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {trackingActive ? 'Pause' : 'Resume'} Tracking
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Vehicle List and Filters */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="route-filter">Route</Label>
                <Select value={routeFilter} onValueChange={setRouteFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Routes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Routes</SelectItem>
                    <SelectItem value="Monrovia-Lofa">Monrovia-Lofa</SelectItem>
                    <SelectItem value="Port-Processing">Port-Processing</SelectItem>
                    <SelectItem value="Farm-Market">Farm-Market</SelectItem>
                    <SelectItem value="Export-Route">Export-Route</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="idle">Idle</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Vehicles ({filteredVehicles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.vehicleId}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVehicle === vehicle.vehicleId ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedVehicle(vehicle.vehicleId)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-sm">{vehicle.vehicleId}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{vehicle.driverName}</p>
                        <Badge variant="secondary" className={`${getStatusColor(vehicle.status)} text-xs`}>
                          {getStatusIcon(vehicle.status)}
                          <span className="ml-1">{vehicle.status}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Speed: {vehicle.speed} km/h</span>
                        <span>ETA: {vehicle.eta}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Display */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Live Vehicle Tracking
                {trackingActive && (
                  <Badge variant="default" className="ml-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1" />
                    Live
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] bg-gradient-to-br from-green-50 to-blue-50 rounded-lg relative overflow-hidden border">
                {/* Map Container */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" viewBox="0 0 600 500">
                    {/* Liberia Map Outline */}
                    <path
                      d="M50 250 L150 230 L280 210 L350 190 L420 200 L480 220 L520 250 L550 300 L530 350 L480 390 L400 410 L300 400 L200 390 L120 370 L80 330 Z"
                      fill="#E5F3E5"
                      stroke="#374151"
                      strokeWidth="2"
                    />
                    
                    {/* Major Roads */}
                    <g stroke="#9CA3AF" strokeWidth="2" fill="none" strokeDasharray="5,5">
                      <path d="M150 230 Q300 220 420 200" />
                      <path d="M150 230 Q250 350 480 390" />
                      <path d="M420 200 Q480 300 520 250" />
                    </g>
                    
                    {/* Routes */}
                    {routes.map((route, index) => (
                      <g key={route.id}>
                        <polyline
                          points={route.waypoints.map(wp => 
                            `${(wp[1] + 9.5) * 30 + 100},${(6.5 - wp[0]) * 40 + 150}`
                          ).join(' ')}
                          stroke="#3B82F6"
                          strokeWidth="3"
                          fill="none"
                          opacity="0.6"
                        />
                      </g>
                    ))}
                    
                    {/* Vehicle Markers */}
                    {filteredVehicles.map((vehicle) => {
                      const x = (vehicle.coordinates[1] + 9.5) * 30 + 100;
                      const y = (6.5 - vehicle.coordinates[0]) * 40 + 150;
                      const isSelected = selectedVehicle === vehicle.vehicleId;
                      
                      return (
                        <g key={vehicle.vehicleId}>
                          {/* Vehicle trail */}
                          <circle
                            cx={x}
                            cy={y}
                            r="12"
                            fill={vehicle.status === 'active' ? '#10B981' : '#F59E0B'}
                            fillOpacity="0.2"
                            className={isSelected ? 'animate-pulse' : ''}
                          />
                          
                          {/* Vehicle icon */}
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill={vehicle.status === 'active' ? '#10B981' : '#F59E0B'}
                          />
                          
                          {/* Vehicle heading indicator */}
                          <line
                            x1={x}
                            y1={y}
                            x2={x + Math.sin(vehicle.heading * Math.PI / 180) * 15}
                            y2={y - Math.cos(vehicle.heading * Math.PI / 180) * 15}
                            stroke={vehicle.status === 'active' ? '#059669' : '#D97706'}
                            strokeWidth="2"
                          />
                          
                          {/* Vehicle label */}
                          <text
                            x={x + 10}
                            y={y - 10}
                            fontSize="10"
                            fill="#374151"
                            fontWeight="bold"
                          >
                            {vehicle.vehicleId}
                          </text>
                          
                          {/* Speed indicator */}
                          <text
                            x={x + 10}
                            y={y + 5}
                            fontSize="8"
                            fill="#6B7280"
                          >
                            {vehicle.speed} km/h
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Major Cities */}
                    <g>
                      <rect x="117" y="237" width="6" height="6" fill="#DC2626" />
                      <text x="125" y="235" fontSize="10" fill="#374151" fontWeight="bold">Monrovia</text>
                      
                      <rect x="198" y="198" width="4" height="4" fill="#DC2626" />
                      <text x="205" y="195" fontSize="8" fill="#374151">Lofa</text>
                      
                      <rect x="348" y="188" width="4" height="4" fill="#DC2626" />
                      <text x="355" y="185" fontSize="8" fill="#374151">Nimba</text>
                      
                      <rect x="478" y="218" width="4" height="4" fill="#DC2626" />
                      <text x="485" y="215" fontSize="8" fill="#374151">Gedeh</text>
                    </g>
                  </svg>
                </div>
                
                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 p-3 rounded shadow">
                  <h4 className="font-medium text-sm mb-2">Legend</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Active Vehicle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Idle Vehicle</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500"></div>
                      <span>Transport Route</span>
                    </div>
                  </div>
                </div>
                
                {/* Update Indicator */}
                {trackingActive && (
                  <div className="absolute top-4 right-4 bg-green-50 border border-green-200 px-3 py-2 rounded">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live Updates Active
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Details */}
        <div className="lg:col-span-1">
          {selectedVehicleData ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  {selectedVehicleData.vehicleId}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className={`${getStatusColor(selectedVehicleData.status)} mb-3`}>
                    {getStatusIcon(selectedVehicleData.status)}
                    <span className="ml-1 capitalize">{selectedVehicleData.status}</span>
                  </Badge>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-600">Driver</p>
                      <p className="font-medium">{selectedVehicleData.driverName}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Current Speed</p>
                      <p className="font-medium">{selectedVehicleData.speed} km/h</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Route</p>
                      <p className="font-medium">{selectedVehicleData.route}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Cargo</p>
                      <p className="font-medium">{selectedVehicleData.cargo}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Destination</p>
                      <p className="font-medium">{selectedVehicleData.destination}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">ETA</p>
                      <p className="font-medium">{selectedVehicleData.eta}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Coordinates</p>
                      <p className="font-mono text-xs">
                        {selectedVehicleData.coordinates[0].toFixed(4)}°N, {Math.abs(selectedVehicleData.coordinates[1]).toFixed(4)}°W
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-600">Last Update</p>
                      <p className="font-medium">{selectedVehicleData.lastUpdate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a vehicle to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Fleet Summary */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Fleet Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Vehicles</span>
                  <span className="font-medium">{vehicles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active</span>
                  <span className="font-medium text-green-600">
                    {vehicles.filter(v => v.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Idle</span>
                  <span className="font-medium text-yellow-600">
                    {vehicles.filter(v => v.status === 'idle').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maintenance</span>
                  <span className="font-medium text-red-600">
                    {vehicles.filter(v => v.status === 'maintenance').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Offline</span>
                  <span className="font-medium text-gray-600">
                    {vehicles.filter(v => v.status === 'offline').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}