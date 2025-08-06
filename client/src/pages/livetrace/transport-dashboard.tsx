import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  Calendar, 
  MapPin,
  Activity,
  Plus,
  ChevronRight,
  Package,
  Clock,
  Route,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Fuel,
  Thermometer,
  Shield
} from "lucide-react";

export default function TransportDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Mock data - would come from API
  const transportStats = {
    activeTransports: 12,
    completedToday: 8,
    totalAnimalsTransported: 1247,
    averageDeliveryTime: 4.2,
    fuelEfficiency: 12.5,
    complianceRate: 98.7,
    emergencyAlerts: 0,
    documentsIssued: 23
  };

  const activeTransports = [
    {
      id: "TR-001",
      vehicle: "LR-TRANS-47",
      driver: "James Wilson",
      origin: "Bong Agricultural Center",
      destination: "Monrovia Livestock Market",
      animalType: "Cattle",
      animalCount: 45,
      status: "in_transit",
      departure: "06:30 AM",
      estimatedArrival: "11:45 AM",
      temperature: "18°C",
      distance: "127 km",
      progress: 65
    },
    {
      id: "TR-002",
      vehicle: "LR-TRANS-23",
      driver: "Mary Kpehe",
      origin: "Cooperativa Ganadera",
      destination: "Firestone Processing Plant",
      animalType: "Goats",
      animalCount: 32,
      status: "loading",
      departure: "08:00 AM", 
      estimatedArrival: "10:30 AM",
      temperature: "16°C",
      distance: "67 km",
      progress: 5
    },
    {
      id: "TR-003",
      vehicle: "LR-TRANS-11",
      driver: "Samuel Roberts",
      origin: "Grand Bassa Poultry Farm",
      destination: "Buchanan Port",
      animalType: "Poultry",
      animalCount: 500,
      status: "scheduled",
      departure: "02:00 PM",
      estimatedArrival: "04:15 PM",
      temperature: "20°C",
      distance: "89 km",
      progress: 0
    }
  ];

  const recentDeliveries = [
    {
      id: "TR-098",
      vehicle: "LR-TRANS-34",
      destination: "Monrovia Central Market",
      animalType: "Cattle",
      animalCount: 28,
      completedTime: "07:45 AM",
      status: "delivered",
      compliance: "verified"
    },
    {
      id: "TR-097",
      vehicle: "LR-TRANS-19",
      destination: "Buchanan Processing Center",
      animalType: "Pigs",
      animalCount: 15,
      completedTime: "06:20 AM",
      status: "delivered",
      compliance: "verified"
    },
    {
      id: "TR-096",
      vehicle: "LR-TRANS-08",
      destination: "Harper Livestock Market",
      animalType: "Sheep",
      animalCount: 22,
      completedTime: "05:30 AM",
      status: "delivered",
      compliance: "verified"
    }
  ];

  const todaySchedule = [
    { id: 1, time: "09:00 AM", task: "Vehicle inspection - LR-TRANS-47", type: "maintenance", priority: "high" },
    { id: 2, time: "10:30 AM", task: "Driver briefing - Route safety protocols", type: "training", priority: "medium" },
    { id: 3, time: "01:00 PM", task: "Documentation review - Export permits", type: "compliance", priority: "high" },
    { id: 4, time: "03:30 PM", task: "Fleet fuel management meeting", type: "logistics", priority: "low" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'loading': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Transport Dashboard - LiveTrace Livestock Transport Management</title>
        <meta name="description" content="Comprehensive transport dashboard for livestock logistics and compliance" />
      </Helmet>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">LiveTrace</h1>
                <p className="text-sm text-slate-600">Transport Portal</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            <a 
              href="/livetrace-transport-dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 font-medium"
            >
              <Activity className="h-4 w-4" />
              Dashboard
            </a>
            <a 
              href="/livetrace-transport-fleet" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Truck className="h-4 w-4" />
              Fleet Management
            </a>
            <a 
              href="/livetrace-transport-routes" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Route className="h-4 w-4" />
              Route Planning
            </a>
            <a 
              href="/livetrace-transport-compliance" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Compliance
            </a>
            <a 
              href="/livetrace-transport-tracking" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Navigation className="h-4 w-4" />
              Real-time Tracking
            </a>
          </nav>

          <div className="p-4 border-t border-slate-200 mt-auto">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Transport
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          {/* Header with Time */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Transport Management Dashboard</h2>
                <p className="text-slate-600">Monitor livestock transport operations and compliance</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{formatTime(currentTime)}</div>
                <div className="text-sm text-slate-600">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Active Transports</p>
                      <p className="text-2xl font-bold">{transportStats.activeTransports}</p>
                    </div>
                    <Truck className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Completed Today</p>
                      <p className="text-2xl font-bold">{transportStats.completedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Animals Transported</p>
                      <p className="text-2xl font-bold">{transportStats.totalAnimalsTransported.toLocaleString()}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Compliance Rate</p>
                      <p className="text-2xl font-bold">{transportStats.complianceRate}%</p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Active Transports */}
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-purple-600" />
                    Active Transports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeTransports.map((transport) => (
                      <div key={transport.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-slate-900">{transport.id} - {transport.vehicle}</p>
                            <p className="text-sm text-slate-600">Driver: {transport.driver}</p>
                          </div>
                          <Badge className={getStatusColor(transport.status)}>
                            {transport.status.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <p className="text-slate-500 mb-1">From</p>
                            <p className="font-medium text-slate-900 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {transport.origin}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">To</p>
                            <p className="font-medium text-slate-900 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {transport.destination}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3 text-sm">
                          <div>
                            <p className="text-slate-500 mb-1">Animals</p>
                            <p className="font-medium text-slate-900">{transport.animalCount} {transport.animalType}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">Departure</p>
                            <p className="font-medium text-slate-900 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {transport.departure}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">ETA</p>
                            <p className="font-medium text-slate-900">{transport.estimatedArrival}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">Temperature</p>
                            <p className="font-medium text-slate-900 flex items-center gap-1">
                              <Thermometer className="h-3 w-3" />
                              {transport.temperature}
                            </p>
                          </div>
                        </div>

                        {transport.status === 'in_transit' && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-900">Progress</span>
                              <span className="text-sm text-blue-700">{transport.progress}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${transport.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Transports
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((item) => (
                    <div key={item.id} className="p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-sm font-medium text-slate-900">{item.time}</div>
                        <Badge className={getPriorityColor(item.priority)} variant="outline">
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700">{item.task}</p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">{item.type}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View Full Schedule
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Deliveries */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Recent Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentDeliveries.map((delivery) => (
                  <div key={delivery.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">{delivery.id}</p>
                        <p className="text-sm text-slate-600">{delivery.vehicle}</p>
                      </div>
                      <Badge className={getStatusColor(delivery.status)}>
                        {delivery.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-700 mb-2">{delivery.destination}</p>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p>{delivery.animalCount} {delivery.animalType}</p>
                      <p>Completed: {delivery.completedTime}</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>Compliance {delivery.compliance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Truck className="h-6 w-6" />
                  Schedule Transport
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Route className="h-6 w-6" />
                  Plan Route
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Shield className="h-6 w-6" />
                  Check Compliance
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Navigation className="h-6 w-6" />
                  Track Fleet
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}