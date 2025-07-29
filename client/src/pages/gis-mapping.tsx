import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { 
  Map, 
  Navigation, 
  Truck, 
  Satellite, 
  Activity,
  BarChart3,
  Download,
  TreePine,
  AlertCircle,
  Shield,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  MapPin,
  Globe,
  Zap,
  Eye,
  FileText,
  Target,
  Play,
  Pause,
  Layers,
  Crop,
  Mountain,
  Router,
  Database,
  Loader2
} from 'lucide-react';

interface GPSCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
}

interface FarmPlot {
  id: string;
  name: string;
  county: string;
  coordinates: GPSCoordinate[];
  area: number;
  crop: string;
  status: 'active' | 'inactive' | 'monitoring';
  complianceScore: number;
}

interface SatelliteConnection {
  constellation: string;
  satellites: number;
  signal: number;
  status: 'connected' | 'connecting' | 'disconnected';
}

export default function GISMapping() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGPSActive, setIsGPSActive] = useState(false);
  const [satelliteConnections, setSatelliteConnections] = useState<SatelliteConnection[]>([]);
  const [currentPosition, setCurrentPosition] = useState<GPSCoordinate | null>(null);
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize satellite connections
  useEffect(() => {
    const connections: SatelliteConnection[] = [
      { constellation: 'GPS (USA)', satellites: 31, signal: 95, status: 'connected' },
      { constellation: 'GLONASS (Russia)', satellites: 24, signal: 87, status: 'connected' },
      { constellation: 'Galileo (EU)', satellites: 22, signal: 92, status: 'connected' },
      { constellation: 'BeiDou (China)', satellites: 30, signal: 89, status: 'connected' }
    ];
    setSatelliteConnections(connections);

    // Simulate current position (Monrovia, Liberia)
    setCurrentPosition({
      latitude: 6.4281,
      longitude: -9.4295,
      accuracy: 3.2,
      timestamp: new Date().toISOString()
    });

    // Initialize demo farm plots
    const demoPlots: FarmPlot[] = [
      {
        id: 'plot-001',
        name: 'Cocoa Farm Alpha',
        county: 'Montserrado',
        coordinates: [
          { latitude: 6.4281, longitude: -9.4295 },
          { latitude: 6.4285, longitude: -9.4292 },
          { latitude: 6.4288, longitude: -9.4298 },
          { latitude: 6.4284, longitude: -9.4301 }
        ],
        area: 2.5,
        crop: 'Cocoa',
        status: 'active',
        complianceScore: 94
      },
      {
        id: 'plot-002',
        name: 'Coffee Plantation Beta',
        county: 'Lofa',
        coordinates: [
          { latitude: 8.2281, longitude: -9.7295 },
          { latitude: 8.2285, longitude: -9.7292 },
          { latitude: 8.2288, longitude: -9.7298 },
          { latitude: 8.2284, longitude: -9.7301 }
        ],
        area: 4.1,
        crop: 'Coffee',
        status: 'monitoring',
        complianceScore: 87
      }
    ];
    setFarmPlots(demoPlots);
  }, []);

  const activateGPS = async () => {
    setIsLoading(true);
    try {
      // Simulate GPS activation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsGPSActive(true);
      toast({
        title: "GPS System Activated",
        description: "Real-time positioning and mapping now active",
      });
    } catch (error) {
      toast({
        title: "GPS Activation Failed",
        description: "Could not connect to GPS satellites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateGPS = () => {
    setIsGPSActive(false);
    toast({
      title: "GPS System Deactivated",
      description: "GPS tracking has been disabled",
    });
  };

  const LiberiaCountiesMap = () => {
    const counties = [
      { name: 'Montserrado', x: 220, y: 280, farms: 156, color: '#3b82f6' },
      { name: 'Lofa', x: 180, y: 120, farms: 89, color: '#10b981' },
      { name: 'Bong', x: 240, y: 200, farms: 134, color: '#f59e0b' },
      { name: 'Nimba', x: 320, y: 180, farms: 178, color: '#ef4444' },
      { name: 'Grand Bassa', x: 280, y: 260, farms: 67, color: '#8b5cf6' },
      { name: 'Sinoe', x: 340, y: 300, farms: 45, color: '#06b6d4' },
      { name: 'Maryland', x: 380, y: 340, farms: 23, color: '#84cc16' },
      { name: 'Grand Cape Mount', x: 160, y: 180, farms: 34, color: '#f97316' },
      { name: 'Gbarpolu', x: 140, y: 160, farms: 28, color: '#ec4899' }
    ];

    return (
      <div className="relative w-full h-96 bg-slate-100 rounded-xl overflow-hidden">
        <svg viewBox="0 0 500 400" className="w-full h-full">
          {/* Liberia country outline */}
          <path
            d="M150 180 L180 120 L220 110 L280 120 L320 140 L360 160 L380 180 L400 220 L390 260 L380 300 L360 340 L320 360 L280 350 L240 340 L200 320 L180 300 L160 280 L150 240 Z"
            fill="rgba(148, 163, 184, 0.3)"
            stroke="rgba(148, 163, 184, 0.6)"
            strokeWidth="2"
          />
          
          {/* County markers */}
          {counties.map((county) => (
            <g key={county.name}>
              <circle
                cx={county.x}
                cy={county.y}
                r="8"
                fill={county.color}
                className="cursor-pointer hover:scale-110 transition-transform"
              />
              <text
                x={county.x}
                y={county.y - 15}
                textAnchor="middle"
                className="text-xs font-medium fill-slate-700"
              >
                {county.name}
              </text>
              <text
                x={county.x}
                y={county.y + 25}
                textAnchor="middle"
                className="text-xs fill-slate-500"
              >
                {county.farms} farms
              </text>
            </g>
          ))}
          
          {/* Farm plot indicators */}
          {farmPlots.map((plot, index) => (
            <circle
              key={plot.id}
              cx={counties[index % counties.length]?.x || 200}
              cy={counties[index % counties.length]?.y || 200}
              r="4"
              fill="#22c55e"
              className="animate-pulse"
            />
          ))}
        </svg>
        
        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-sm">
          <h4 className="text-sm font-medium text-slate-900 mb-2">Map Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs text-slate-600">Active Counties</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-slate-600">GPS Tracked Farms</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>GIS Mapping System - AgriTrace360 LACRA</title>
        <meta name="description" content="Advanced GIS mapping and GPS tracking for agricultural compliance monitoring" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section - ISMS Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-green flex items-center justify-center">
              <Map className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">GIS Mapping System</h1>
              <p className="text-slate-600 text-lg">Advanced geospatial analysis and GPS tracking for agricultural compliance</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={isGPSActive ? deactivateGPS : activateGPS}
              disabled={isLoading}
              className={`isms-button flex items-center gap-2 ${isGPSActive ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isGPSActive ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isGPSActive ? 'Deactivate GPS' : 'Activate GPS'}
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Map Data
            </Button>
          </div>
        </div>

        {/* GPS Status Overview - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <Satellite className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">GPS Satellites</p>
                <p className="text-3xl font-bold text-slate-900">
                  {satelliteConnections.reduce((acc, conn) => acc + conn.satellites, 0)}
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Connected across all constellations</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">GPS Accuracy</p>
                <p className="text-3xl font-bold text-slate-900">{currentPosition?.accuracy || 3.2}m</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Real-time positioning precision</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                <Crop className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Mapped Farms</p>
                <p className="text-3xl font-bold text-slate-900">{farmPlots.length || 847}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">GPS boundary mapped plots</p>
          </div>

          <div className="isms-card py-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-indigo flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <p className="text-slate-600 text-sm">System Status</p>
              <p className="text-3xl font-bold text-slate-900">
                {isGPSActive ? 'ACTIVE' : 'STANDBY'}
              </p>
              <p className="text-slate-600 text-sm">Real-time tracking status</p>
            </div>
          </div>
        </div>

        {/* GIS Mapping Tabs - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Interactive Mapping Platform</h2>
              <p className="text-slate-600">Comprehensive geospatial analysis and monitoring tools</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-slate-100 rounded-xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Map Overview
              </TabsTrigger>
              <TabsTrigger value="counties" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Counties View
              </TabsTrigger>
              <TabsTrigger value="satellites" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Satellite Status
              </TabsTrigger>
              <TabsTrigger value="tracking" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                GPS Tracking
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Map Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-green flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Liberia Agricultural Map</h3>
                    <p className="text-slate-600">Real-time view of all agricultural counties and farm locations</p>
                  </div>
                </div>
                <LiberiaCountiesMap />
              </div>
            </TabsContent>

            <TabsContent value="counties" className="space-y-6">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                    <Mountain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">County-Level Analysis</h3>
                    <p className="text-slate-600">Detailed breakdown of agricultural activities by county</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['Montserrado', 'Lofa', 'Bong', 'Nimba', 'Grand Bassa', 'Sinoe'].map((county) => (
                    <div key={county} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-slate-900">{county} County</h4>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Farms Mapped</span>
                          <span className="font-medium">{Math.floor(Math.random() * 200) + 50}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">GPS Coverage</span>
                          <span className="font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Compliance Rate</span>
                          <span className="font-medium text-green-600">{Math.floor(Math.random() * 15) + 85}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="satellites" className="space-y-6">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                    <Satellite className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Satellite Constellation Status</h3>
                    <p className="text-slate-600">Real-time connectivity to global positioning systems</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {satelliteConnections.map((connection) => (
                    <div key={connection.constellation} className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-slate-900">{connection.constellation}</h4>
                        <Badge 
                          variant={connection.status === 'connected' ? 'default' : 'secondary'}
                          className={connection.status === 'connected' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {connection.status}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Satellites</span>
                          <span className="font-medium">{connection.satellites}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Signal Strength</span>
                            <span className="font-medium">{connection.signal}%</span>
                          </div>
                          <Progress value={connection.signal} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-6">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-indigo flex items-center justify-center">
                    <Navigation className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">GPS Farm Boundary Tracking</h3>
                    <p className="text-slate-600">Precision mapping of agricultural plot boundaries</p>
                  </div>
                </div>
                
                {currentPosition && (
                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <h4 className="font-medium text-slate-900 mb-3">Current GPS Position</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-slate-600 text-sm">Latitude</span>
                        <p className="font-mono font-medium">{currentPosition.latitude.toFixed(6)}°N</p>
                      </div>
                      <div>
                        <span className="text-slate-600 text-sm">Longitude</span>
                        <p className="font-mono font-medium">{currentPosition.longitude.toFixed(6)}°W</p>
                      </div>
                      <div>
                        <span className="text-slate-600 text-sm">Accuracy</span>
                        <p className="font-medium">{currentPosition.accuracy}m</p>
                      </div>
                      <div>
                        <span className="text-slate-600 text-sm">Status</span>
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900">Mapped Farm Plots</h4>
                  {farmPlots.map((plot) => (
                    <div key={plot.id} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-slate-900">{plot.name}</h5>
                          <p className="text-sm text-slate-600">{plot.county} County • {plot.crop}</p>
                        </div>
                        <Badge 
                          variant={plot.status === 'active' ? 'default' : 'secondary'}
                          className={plot.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {plot.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-slate-600 text-sm">Area</span>
                          <p className="font-medium">{plot.area} hectares</p>
                        </div>
                        <div>
                          <span className="text-slate-600 text-sm">Boundaries</span>
                          <p className="font-medium">{plot.coordinates.length} points</p>
                        </div>
                        <div>
                          <span className="text-slate-600 text-sm">Compliance</span>
                          <p className="font-medium text-green-600">{plot.complianceScore}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-yellow flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Geospatial Analytics</h3>
                    <p className="text-slate-600">Data-driven insights from GPS and mapping systems</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-900 mb-3">Coverage Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Total Area Mapped</span>
                        <span className="font-medium">1,247 ha</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">GPS Accuracy</span>
                        <span className="font-medium">98.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Active Boundaries</span>
                        <span className="font-medium">847</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-900 mb-3">Compliance Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">EUDR Compliant</span>
                        <span className="font-medium text-green-600">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Verified Boundaries</span>
                        <span className="font-medium">732</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Deforestation Risk</span>
                        <span className="font-medium text-yellow-600">Low</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="font-medium text-slate-900 mb-3">System Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Uptime</span>
                        <span className="font-medium">99.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Data Processing</span>
                        <span className="font-medium">Real-time</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Update</span>
                        <span className="font-medium">2 min ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}