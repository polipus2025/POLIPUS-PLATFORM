import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  Users, 
  MapPin, 
  AlertTriangle,
  TrendingUp,
  Clock,
  Activity,
  Navigation,
  ChevronRight,
  Plus,
  Eye,
  Calendar,
  Thermometer,
  Shield,
  Package,
  Utensils,
  Siren,
  BarChart3,
  Truck,
  Camera,
  FileText,
  Route,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function FarmerDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHerd, setSelectedHerd] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("today");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get user info from localStorage
  const userType = localStorage.getItem("userType");
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("authToken");

  // Debug information

  // Fetch livestock data for this farmer
  const { data: farmerStats = {} } = useQuery({
    queryKey: ['/api/livetrace/farmer-livestock-stats', selectedTimeRange],
    queryFn: () => apiRequest(`/api/livetrace/farmer-livestock-stats?timeRange=${selectedTimeRange}`),
  });

  // Fetch GPS tracking data
  const { data: gpsData = [] } = useQuery({
    queryKey: ['/api/livetrace/farmer-gps-tracking'],
    queryFn: () => apiRequest('/api/livetrace/farmer-gps-tracking'),
  });

  // Fetch feed management data
  const { data: feedData = [] } = useQuery({
    queryKey: ['/api/livetrace/farmer-feed-management'],
    queryFn: () => apiRequest('/api/livetrace/farmer-feed-management'),
  });

  // Fetch health alerts
  const { data: healthAlerts = [] } = useQuery({
    queryKey: ['/api/livetrace/farmer-health-alerts'],
    queryFn: () => apiRequest('/api/livetrace/farmer-health-alerts'),
  });

  // Mock data for demonstration - would come from API based on farmer's livestock
  const mockStats = {
    totalAnimals: 187,
    healthyAnimals: 174,
    underTreatment: 8,
    criticalCases: 5,
    dailyFeedConsumption: 2340, // kg
    feedStock: 18650, // kg remaining
    daysOfFeedRemaining: 8,
    activeGPSTags: 182,
    offlineGPSTags: 5,
    avgDailyMovement: 3.2, // km
    ...farmerStats
  };

  const herds = [
    { id: "all", name: "All Herds", count: 187 },
    { id: "cattle-01", name: "Cattle Herd A", count: 85 },
    { id: "cattle-02", name: "Cattle Herd B", count: 62 },
    { id: "goats-01", name: "Goat Herd", count: 28 },
    { id: "sheep-01", name: "Sheep Flock", count: 12 }
  ];

  const recentAlerts = [
    { 
      id: 1, 
      type: "critical", 
      category: "health",
      message: "Cow #A047 showing signs of illness - elevated temperature", 
      time: "1 hour ago", 
      location: "Pasture A",
      action: "Veterinary consultation scheduled"
    },
    { 
      id: 2, 
      type: "warning", 
      category: "feed",
      message: "Feed stock running low - 8 days remaining", 
      time: "3 hours ago", 
      location: "Feed Storage",
      action: "Reorder feed supplies"
    },
    { 
      id: 3, 
      type: "info", 
      category: "gps",
      message: "5 GPS tags offline in Cattle Herd B", 
      time: "5 hours ago", 
      location: "Pasture B",
      action: "Check GPS tag batteries"
    }
  ];

  const feedSchedule = [
    { id: 1, herd: "Cattle Herd A", time: "06:00 AM", amount: "450 kg", type: "Morning feed", status: "completed" },
    { id: 2, herd: "Cattle Herd B", time: "06:30 AM", amount: "320 kg", type: "Morning feed", status: "completed" },
    { id: 3, herd: "Goat Herd", time: "07:00 AM", amount: "85 kg", type: "Morning feed", status: "completed" },
    { id: 4, herd: "Cattle Herd A", time: "06:00 PM", amount: "450 kg", type: "Evening feed", status: "pending" },
    { id: 5, herd: "Cattle Herd B", time: "06:30 PM", amount: "320 kg", type: "Evening feed", status: "pending" }
  ];

  const gpsLocations = [
    { id: 1, tag: "GPS-A047", animal: "Cow #A047", lat: 6.3156, lng: -10.8074, pasture: "Pasture A", lastUpdate: "2 min ago", status: "active" },
    { id: 2, tag: "GPS-A048", animal: "Cow #A048", lat: 6.3162, lng: -10.8081, pasture: "Pasture A", lastUpdate: "3 min ago", status: "active" },
    { id: 3, tag: "GPS-B023", animal: "Cow #B023", lat: 6.3145, lng: -10.8095, pasture: "Pasture B", lastUpdate: "1 min ago", status: "active" },
    { id: 4, tag: "GPS-G012", animal: "Goat #G012", lat: 6.3178, lng: -10.8067, pasture: "Goat Area", lastUpdate: "15 min ago", status: "offline" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Farmer Dashboard - LiveTrace Livestock Management</title>
        <meta name="description" content="Comprehensive farmer dashboard for livestock herd management, GPS tracking, and health monitoring" />
      </Helmet>

      {/* Use LiveTrace Header */}
      <LiveTraceHeader />

      <div className="flex">
        {/* Use LiveTrace Sidebar */}
        <LiveTraceSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">🐄 LiveTrace Farmer Dashboard</h1>
              <p className="text-slate-600">Livestock Management & Monitoring Portal</p>
              <p className="text-xs text-green-600 mt-1">Welcome, {localStorage.getItem("firstName") || localStorage.getItem("username") || "Farmer"}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{formatTime(currentTime)}</div>
              <div className="text-sm text-slate-500">{formatDate(currentTime)}</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Animals</p>
                    <p className="text-3xl font-bold text-slate-900">{mockStats.totalAnimals}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">+12 this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Healthy Animals</p>
                    <p className="text-3xl font-bold text-green-600">{mockStats.healthyAnimals}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">93% health rate</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Feed Stock</p>
                    <p className="text-3xl font-bold text-orange-600">{mockStats.feedStock} kg</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Utensils className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <Clock className="h-4 w-4 text-orange-500 mr-1" />
                  <span className="text-orange-600">{mockStats.daysOfFeedRemaining} days remaining</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 font-medium">GPS Tags Active</p>
                    <p className="text-3xl font-bold text-purple-600">{mockStats.activeGPSTags}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Navigation className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-purple-600">{mockStats.offlineGPSTags} offline tags</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="herd">Herd Management</TabsTrigger>
              <TabsTrigger value="gps">GPS Tracking</TabsTrigger>
              <TabsTrigger value="feed">Feed Management</TabsTrigger>
              <TabsTrigger value="health">Health Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Health Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-red-500" />
                      Recent Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAlerts.map((alert) => (
                        <div key={alert.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={alert.type === 'critical' ? 'destructive' : alert.type === 'warning' ? 'secondary' : 'default'}>
                                  {alert.category}
                                </Badge>
                                <span className="text-sm text-slate-500">{alert.time}</span>
                              </div>
                              <p className="text-sm font-medium text-slate-900 mb-1">{alert.message}</p>
                              <p className="text-xs text-slate-600">Location: {alert.location}</p>
                              <p className="text-xs text-blue-600 mt-1">Action: {alert.action}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Today's Feed Schedule */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Today's Feed Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feedSchedule.map((feed) => (
                        <div key={feed.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{feed.herd}</p>
                            <p className="text-sm text-slate-600">{feed.time} - {feed.amount}</p>
                            <p className="text-xs text-slate-500">{feed.type}</p>
                          </div>
                          <Badge variant={feed.status === 'completed' ? 'default' : 'secondary'}>
                            {feed.status === 'completed' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {feed.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="herd" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Herd Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {herds.filter(h => h.id !== 'all').map((herd) => (
                      <Card key={herd.id} className="border border-slate-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-slate-900">{herd.name}</h3>
                            <Badge>{herd.count} animals</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Health Status:</span>
                              <span className="text-green-600 font-medium">Good</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Location:</span>
                              <span className="text-blue-600 font-medium">Tracked</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Last Check:</span>
                              <span className="text-slate-600">2 hours ago</span>
                            </div>
                          </div>
                          <Button size="sm" className="w-full mt-3" variant="outline">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gps" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    GPS Tracking Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {gpsLocations.map((location) => (
                      <div key={location.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-slate-900">{location.animal}</h4>
                              <Badge variant={location.status === 'active' ? 'default' : 'secondary'}>
                                {location.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600">GPS Tag: </span>
                                <span className="font-medium">{location.tag}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Location: </span>
                                <span className="font-medium">{location.pasture}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Coordinates: </span>
                                <span className="font-medium">{location.lat}, {location.lng}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Last Update: </span>
                                <span className="font-medium">{location.lastUpdate}</span>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <MapPin className="h-4 w-4 mr-2" />
                            View Map
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feed" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-orange-500" />
                      Feed Inventory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border border-slate-200 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-2">Cattle Feed (Premium)</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Current Stock:</span>
                            <span className="font-medium">12,500 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Daily Consumption:</span>
                            <span className="font-medium">1,850 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Days Remaining:</span>
                            <span className="font-medium text-orange-600">7 days</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3" variant="outline">
                          Reorder Feed
                        </Button>
                      </div>

                      <div className="border border-slate-200 rounded-lg p-4">
                        <h4 className="font-medium text-slate-900 mb-2">Goat/Sheep Feed</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Current Stock:</span>
                            <span className="font-medium">6,150 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Daily Consumption:</span>
                            <span className="font-medium">490 kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Days Remaining:</span>
                            <span className="font-medium text-green-600">12 days</span>
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      Feed Consumption Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-6 border border-slate-200 rounded-lg">
                        <div className="text-3xl font-bold text-blue-600 mb-2">2,340 kg</div>
                        <div className="text-sm text-slate-600">Daily Consumption</div>
                        <div className="text-xs text-green-600 mt-1">↓ 5% from yesterday</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 border border-slate-200 rounded-lg">
                          <div className="text-xl font-bold text-slate-900">87%</div>
                          <div className="text-xs text-slate-600">Feed Efficiency</div>
                        </div>
                        <div className="text-center p-4 border border-slate-200 rounded-lg">
                          <div className="text-xl font-bold text-slate-900">$3.2K</div>
                          <div className="text-xs text-slate-600">Monthly Cost</div>
                        </div>
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
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Health Monitoring & Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 border border-slate-200 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">174</div>
                      <div className="text-sm text-slate-600">Healthy Animals</div>
                    </div>
                    <div className="text-center p-4 border border-slate-200 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">8</div>
                      <div className="text-sm text-slate-600">Under Treatment</div>
                    </div>
                    <div className="text-center p-4 border border-slate-200 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">5</div>
                      <div className="text-sm text-slate-600">Critical Cases</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <h4 className="font-medium text-red-900">Critical Alert</h4>
                        <Badge variant="destructive">High Priority</Badge>
                      </div>
                      <p className="text-sm text-red-800 mb-2">
                        Cow #A047 showing symptoms of respiratory distress. Immediate veterinary attention required.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-600">Location: Pasture A | Time: 45 minutes ago</span>
                        <Button size="sm" variant="destructive">
                          Contact Vet
                        </Button>
                      </div>
                    </div>

                    <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <h4 className="font-medium text-yellow-900">Warning</h4>
                        <Badge variant="secondary">Medium Priority</Badge>
                      </div>
                      <p className="text-sm text-yellow-800 mb-2">
                        Goat #G012 has not reported GPS location for 4 hours. Check for tag malfunction.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-yellow-600">Location: Goat Area | Time: 4 hours ago</span>
                        <Button size="sm" variant="outline">
                          Check GPS
                        </Button>
                      </div>
                    </div>

                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium text-blue-900">Vaccination Reminder</h4>
                        <Badge variant="default">Scheduled</Badge>
                      </div>
                      <p className="text-sm text-blue-800 mb-2">
                        Cattle Herd B is due for annual vaccination in 3 days. Schedule appointment with veterinarian.
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600">Due Date: January 9, 2025</span>
                        <Button size="sm" variant="outline">
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}