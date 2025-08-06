import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Truck, 
  Activity, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Eye,
  Calendar,
  Thermometer,
  Stethoscope,
  Shield,
  Navigation,
  Camera,
  FileText,
  Route,
  Package,
  BarChart3,
  Plus
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function LiveTraceMainDashboard() {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("today");
  
  // Get user info from localStorage
  const userType = localStorage.getItem("userType");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("authToken");

  // Fetch livestock data
  const { data: livestockStats = {} } = useQuery({
    queryKey: ['/api/livetrace/livestock-stats', selectedRegion, selectedTimeRange],
    queryFn: () => apiRequest(`/api/livetrace/livestock-stats?region=${selectedRegion}&timeRange=${selectedTimeRange}`),
  });

  // Fetch health monitoring data
  const { data: healthData = [] } = useQuery({
    queryKey: ['/api/livetrace/health-monitoring'],
    queryFn: () => apiRequest('/api/livetrace/health-monitoring'),
  });

  // Fetch transport tracking data
  const { data: transportData = [] } = useQuery({
    queryKey: ['/api/livetrace/transport-tracking'],
    queryFn: () => apiRequest('/api/livetrace/transport-tracking'),
  });

  // Mock data for demonstration
  const mockStats = {
    totalLivestock: 15420,
    healthyAnimals: 14890,
    underTreatment: 342,
    quarantinedAnimals: 188,
    totalFarms: 1280,
    activeFarms: 1156,
    transportVehicles: 89,
    activeTransports: 23,
    ...livestockStats
  };

  const recentHealthAlerts = [
    {
      id: 1,
      farmId: "LT-001",
      farmName: "Sunrise Cattle Ranch",
      location: "Montserrado County",
      alertType: "Health Concern",
      severity: "medium",
      description: "Elevated temperature detected in Cattle Group C-12",
      timestamp: "2025-01-06 14:30",
      status: "investigating"
    },
    {
      id: 2,
      farmId: "LT-045",
      farmName: "Green Valley Livestock",
      location: "Bong County",
      alertType: "Movement Alert",
      severity: "low",
      description: "Unusual movement pattern detected in Goat Herd G-08",
      timestamp: "2025-01-06 13:15",
      status: "resolved"
    },
    {
      id: 3,
      farmId: "LT-089",
      farmName: "Heritage Farm Co-op",
      location: "Nimba County",
      alertType: "Vaccination Due",
      severity: "high",
      description: "Vaccination schedule due for Cattle Group C-34",
      timestamp: "2025-01-06 12:00",
      status: "pending"
    }
  ];

  const activeTransports = [
    {
      id: "TR-001",
      vehicleId: "LT-TRUCK-015",
      origin: "Sunrise Cattle Ranch",
      destination: "Monrovia Processing Center",
      livestock: "45 Cattle",
      status: "in_transit",
      eta: "16:30",
      gpsLocation: "6.3106°N, 10.8047°W"
    },
    {
      id: "TR-002",
      vehicleId: "LT-TRUCK-023",
      origin: "Green Valley Livestock",
      destination: "Gbarnga Market",
      livestock: "12 Goats, 8 Sheep",
      status: "loading",
      eta: "18:00",
      gpsLocation: "7.0000°N, 9.8000°W"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>LiveTrace Dashboard - Real-time Livestock Monitoring System</title>
        <meta name="description" content="Comprehensive livestock tracking and health monitoring dashboard for agricultural operations" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Dashboard Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-center lg:text-left">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">LiveTrace Dashboard</h1>
                <p className="text-gray-600 mt-1">Real-time livestock monitoring and health management</p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-4">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="montserrado">Montserrado</SelectItem>
                    <SelectItem value="bong">Bong</SelectItem>
                    <SelectItem value="nimba">Nimba</SelectItem>
                    <SelectItem value="lofa">Lofa</SelectItem>
                    <SelectItem value="gbarpolu">Gbarpolu</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Livestock</CardTitle>
                  <Users className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockStats.totalLivestock.toLocaleString()}</div>
                  <p className="text-xs opacity-80 mt-1">
                    +2.3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Healthy Animals</CardTitle>
                  <Heart className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockStats.healthyAnimals.toLocaleString()}</div>
                  <p className="text-xs opacity-80 mt-1">
                    96.6% health rate
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Under Treatment</CardTitle>
                  <Stethoscope className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockStats.underTreatment}</div>
                  <p className="text-xs opacity-80 mt-1">
                    -12% from last week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Transports</CardTitle>
                  <Truck className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockStats.activeTransports}</div>
                  <p className="text-xs opacity-80 mt-1">
                    Real-time tracking
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-2xl grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="health">Health Monitoring</TabsTrigger>
                  <TabsTrigger value="transport">Transport Tracking</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts & Actions</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl mx-auto">
                  
                  {/* Farm Status Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        Farm Status Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Total Registered Farms</span>
                          <span className="font-semibold">{mockStats.totalFarms}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Active Farms</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{mockStats.activeFarms}</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {((mockStats.activeFarms / mockStats.totalFarms) * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Inactive Farms</span>
                          <span className="font-semibold">{mockStats.totalFarms - mockStats.activeFarms}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Status Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Livestock Health Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Healthy</span>
                          </div>
                          <span className="font-semibold">{mockStats.healthyAnimals.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Under Treatment</span>
                          </div>
                          <span className="font-semibold">{mockStats.underTreatment}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-gray-600">Quarantined</span>
                          </div>
                          <span className="font-semibold">{mockStats.quarantinedAnimals}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="health" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      Recent Health Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentHealthAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant={alert.severity === 'high' ? 'destructive' : 
                                        alert.severity === 'medium' ? 'default' : 'secondary'}
                              >
                                {alert.alertType}
                              </Badge>
                              <span className="text-sm text-gray-500">{alert.farmId}</span>
                            </div>
                            <h4 className="font-medium">{alert.farmName}</h4>
                            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                            <p className="text-xs text-gray-500 mt-2">{alert.location} • {alert.timestamp}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {alert.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transport" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-purple-600" />
                      Active Transports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeTransports.map((transport) => (
                        <div key={transport.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{transport.vehicleId}</Badge>
                              <Badge 
                                variant={transport.status === 'in_transit' ? 'default' : 
                                        transport.status === 'loading' ? 'secondary' : 'destructive'}
                              >
                                {transport.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h4 className="font-medium">{transport.origin} → {transport.destination}</h4>
                            <p className="text-sm text-gray-600 mt-1">{transport.livestock}</p>
                            <p className="text-xs text-gray-500 mt-2">ETA: {transport.eta} • GPS: {transport.gpsLocation}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Navigation className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                        Priority Actions Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div>
                            <p className="font-medium text-red-900">Vaccination Overdue</p>
                            <p className="text-sm text-red-700">12 farms require immediate attention</p>
                          </div>
                          <Button size="sm" variant="destructive">
                            Review
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div>
                            <p className="font-medium text-orange-900">Health Monitoring</p>
                            <p className="text-sm text-orange-700">5 animals need follow-up checks</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Schedule
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div>
                            <p className="font-medium text-yellow-900">Transport Delays</p>
                            <p className="text-sm text-yellow-700">2 shipments behind schedule</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Track
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Recent Completions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">Health Inspection</p>
                            <p className="text-sm text-green-700">Completed at Sunrise Ranch</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">Vaccination Round</p>
                            <p className="text-sm text-green-700">45 cattle vaccinated successfully</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium text-green-900">Transport Completed</p>
                            <p className="text-sm text-green-700">Delivery to Monrovia market</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}