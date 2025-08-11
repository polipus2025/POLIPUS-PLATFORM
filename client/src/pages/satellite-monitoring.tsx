import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Satellite, 
  Globe, 
  Activity, 
  Zap, 
  MapPin, 
  Clock, 
  Signal, 
  Eye,
  Camera,
  Radar,
  Wifi,
  Battery,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Settings,
  Download,
  Share2
} from 'lucide-react';
import { Link } from 'wouter';

export default function SatelliteMonitoring() {
  const [selectedSatellite, setSelectedSatellite] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [realTimeData, setRealTimeData] = useState<any>({});

  // Comprehensive satellite data for the Polipus platform
  const satellites = [
    {
      id: 'SAT-001',
      name: 'Sentinel-2A',
      type: 'Earth Observation',
      status: 'active',
      provider: 'ESA Copernicus',
      purpose: 'Agricultural Monitoring',
      altitude: '786 km',
      coverage: 'Global',
      resolution: '10m - 60m',
      frequency: 'Every 5 days',
      lastUpdate: '2025-01-11 18:45:32',
      dataTypes: ['Optical Imagery', 'Vegetation Index', 'Land Cover'],
      modules: ['AgriTrace LACRA', 'Forest Guard', 'Land Map360'],
      coordinates: { lat: 14.0000, lng: -9.0000 },
      signal: 95,
      battery: 87,
      dataTransmitted: '2.4 TB',
      orbitalVelocity: '7.4 km/s'
    },
    {
      id: 'SAT-002', 
      name: 'Landsat-9',
      type: 'Earth Observation',
      status: 'active',
      provider: 'NASA/USGS',
      purpose: 'Land Use Monitoring',
      altitude: '705 km',
      coverage: 'Global',
      resolution: '15m - 100m',
      frequency: 'Every 16 days',
      lastUpdate: '2025-01-11 17:22:15',
      dataTypes: ['Thermal Infrared', 'Multispectral', 'Panchromatic'],
      modules: ['Mine Watch', 'Forest Guard', 'Carbon Trace'],
      coordinates: { lat: 6.5000, lng: -9.5000 },
      signal: 92,
      battery: 91,
      dataTransmitted: '1.8 TB',
      orbitalVelocity: '7.5 km/s'
    },
    {
      id: 'SAT-003',
      name: 'MODIS-Aqua',
      type: 'Ocean/Atmosphere',
      status: 'active',
      provider: 'NASA',
      purpose: 'Ocean & Climate Monitoring',
      altitude: '705 km',
      coverage: 'Global',
      resolution: '250m - 1km',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 19:12:08',
      dataTypes: ['Ocean Color', 'Sea Surface Temperature', 'Atmospheric Data'],
      modules: ['Blue Carbon 360', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 4.0000, lng: -7.5000 },
      signal: 89,
      battery: 85,
      dataTransmitted: '3.1 TB',
      orbitalVelocity: '7.5 km/s'
    },
    {
      id: 'SAT-004',
      name: 'Planet Labs-1',
      type: 'High-Resolution Imaging',
      status: 'active',
      provider: 'Planet Labs',
      purpose: 'Daily Monitoring',
      altitude: '475 km',
      coverage: 'Targeted Regions',
      resolution: '3m - 5m',
      frequency: 'Daily',
      lastUpdate: '2025-01-11 18:58:41',
      dataTypes: ['RGB Imagery', 'Near-Infrared', 'Analytics Ready Data'],
      modules: ['Live Trace', 'AgriTrace LACRA', 'Mine Watch'],
      coordinates: { lat: 8.5000, lng: -11.0000 },
      signal: 94,
      battery: 93,
      dataTransmitted: '1.2 TB',
      orbitalVelocity: '7.6 km/s'
    },
    {
      id: 'SAT-005',
      name: 'GOES-16',
      type: 'Geostationary Weather',
      status: 'active',
      provider: 'NOAA',
      purpose: 'Weather & Climate',
      altitude: '35,786 km',
      coverage: 'Western Atlantic',
      resolution: '0.5km - 2km',
      frequency: 'Every 15 minutes',
      lastUpdate: '2025-01-11 19:00:00',
      dataTypes: ['Weather Imagery', 'Lightning Detection', 'Solar Monitoring'],
      modules: ['Forest Guard', 'Aqua Trace', 'Carbon Trace'],
      coordinates: { lat: 0.0000, lng: -75.0000 },
      signal: 98,
      battery: 96,
      dataTransmitted: '4.7 TB',
      orbitalVelocity: 'Geostationary'
    },
    {
      id: 'SAT-006',
      name: 'TerraSAR-X',
      type: 'Radar Imaging',
      status: 'maintenance',
      provider: 'DLR (Germany)',
      purpose: 'All-Weather Monitoring',
      altitude: '514 km',
      coverage: 'Global',
      resolution: '1m - 16m',
      frequency: 'Every 11 days',
      lastUpdate: '2025-01-11 14:30:22',
      dataTypes: ['SAR Imagery', 'Interferometry', 'Polarimetry'],
      modules: ['Mine Watch', 'Forest Guard', 'Land Map360'],
      coordinates: { lat: 12.0000, lng: -8.0000 },
      signal: 78,
      battery: 82,
      dataTransmitted: '0.9 TB',
      orbitalVelocity: '7.6 km/s'
    }
  ];

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        totalDataToday: (Math.random() * 10 + 15).toFixed(1) + ' TB',
        activePasses: Math.floor(Math.random() * 8 + 12),
        coverageLiberia: (Math.random() * 5 + 92).toFixed(1) + '%',
        lastDataSync: new Date().toLocaleTimeString()
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getSignalStrength = (signal: number) => {
    if (signal >= 90) return { color: 'text-green-600', bars: 4 };
    if (signal >= 75) return { color: 'text-yellow-600', bars: 3 };
    if (signal >= 60) return { color: 'text-orange-600', bars: 2 };
    return { color: 'text-red-600', bars: 1 };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <Helmet>
        <title>Satellite Monitoring System - Polipus Platform</title>
        <meta name="description" content="Real-time satellite monitoring and data management for all Polipus platform modules" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back to Blue Carbon 360 Button */}
        <div className="mb-6">
          <Link href="/blue-carbon360-portal" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blue Carbon 360
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Satellite className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Satellite Monitoring System</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Real-time monitoring and management of all satellites connected to the Polipus platform across 8 specialized modules
          </p>
        </div>

        {/* Real-time Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Satellites</p>
                  <p className="text-2xl font-bold text-blue-900">{satellites.filter(s => s.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">Data Today</p>
                  <p className="text-2xl font-bold text-green-900">{realTimeData.totalDataToday || '17.2 TB'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-600">Active Passes</p>
                  <p className="text-2xl font-bold text-purple-900">{realTimeData.activePasses || 18}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-600">Liberia Coverage</p>
                  <p className="text-2xl font-bold text-orange-900">{realTimeData.coverageLiberia || '94.8%'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Satellite Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {satellites.map((satellite) => {
            const signalInfo = getSignalStrength(satellite.signal);
            return (
              <Card key={satellite.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" 
                    onClick={() => {setSelectedSatellite(satellite); setIsDetailModalOpen(true);}}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Satellite className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-lg">{satellite.name}</CardTitle>
                        <p className="text-sm text-gray-600">{satellite.provider}</p>
                      </div>
                    </div>
                    {getStatusBadge(satellite.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Type:</span>
                      <span className="text-sm font-medium">{satellite.type}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Purpose:</span>
                      <span className="text-sm font-medium">{satellite.purpose}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Altitude:</span>
                      <span className="text-sm font-medium">{satellite.altitude}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Resolution:</span>
                      <span className="text-sm font-medium">{satellite.resolution}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Signal Strength:</span>
                      <div className="flex items-center gap-2">
                        <Signal className={`h-4 w-4 ${signalInfo.color}`} />
                        <span className="text-sm font-medium">{satellite.signal}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Battery:</span>
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">{satellite.battery}%</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 mb-2">Connected Modules:</p>
                      <div className="flex flex-wrap gap-1">
                        {satellite.modules.map((module, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {module}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Last Update:</span>
                      <span>{new Date(satellite.lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Satellite Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Satellite className="h-6 w-6 text-blue-600" />
                {selectedSatellite?.name} - Detailed Information
              </DialogTitle>
            </DialogHeader>
            
            {selectedSatellite && (
              <ScrollArea className="max-h-[60vh]">
                <div className="space-y-6 pr-4">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Satellite Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>ID:</span>
                          <span className="font-mono">{selectedSatellite.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Provider:</span>
                          <span>{selectedSatellite.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span>{selectedSatellite.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Altitude:</span>
                          <span>{selectedSatellite.altitude}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Coverage:</span>
                          <span>{selectedSatellite.coverage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Orbital Velocity:</span>
                          <span>{selectedSatellite.orbitalVelocity}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Signal Strength:</span>
                          <span className="font-medium">{selectedSatellite.signal}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Battery Level:</span>
                          <span className="font-medium">{selectedSatellite.battery}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Transmitted:</span>
                          <span className="font-medium">{selectedSatellite.dataTransmitted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Update Frequency:</span>
                          <span>{selectedSatellite.frequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resolution:</span>
                          <span>{selectedSatellite.resolution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          {getStatusBadge(selectedSatellite.status)}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Data Types */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Data Types & Capabilities</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedSatellite.dataTypes.map((type: string, idx: number) => (
                          <Badge key={idx} className="justify-center p-2">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connected Modules */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Connected Platform Modules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedSatellite.modules.map((module: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">{module}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location & Coverage */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Position & Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Coordinates:</p>
                          <p className="font-mono text-lg">
                            {selectedSatellite.coordinates.lat}°, {selectedSatellite.coordinates.lng}°
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Last Update:</p>
                          <p className="text-sm">
                            {new Date(selectedSatellite.lastUpdate).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* System Status Footer */}
        <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">System Status: Operational</p>
                  <p className="text-sm text-gray-600">
                    Last sync: {realTimeData.lastDataSync || new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}