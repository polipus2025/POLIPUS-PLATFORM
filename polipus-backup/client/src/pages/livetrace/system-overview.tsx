import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Activity, 
  Users, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Heart,
  Truck,
  Shield,
  BarChart3,
  Eye,
  Server,
  Database,
  Wifi,
  RefreshCw
} from "lucide-react";
import LiveTraceSidebar from "../../components/livetrace/live-trace-sidebar";
import LiveTraceHeader from "../../components/livetrace/live-trace-header";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function SystemOverview() {
  const [systemStatus, setSystemStatus] = useState({
    overallHealth: 98.5,
    apiStatus: "operational",
    databaseStatus: "operational", 
    networkLatency: 45,
    uptime: "99.8%"
  });

  // Fetch system metrics
  const { data: systemMetrics = {} } = useQuery({
    queryKey: ['/api/livetrace/system-metrics'],
    queryFn: () => apiRequest('/api/livetrace/system-metrics'),
  });

  // Mock real-time system data
  const mockSystemData = {
    totalRegisteredFarms: 1284,
    activeFarms: 1156,
    totalLivestock: 15420,
    healthyAnimals: 14890,
    animalsUnderTreatment: 342,
    quarantinedAnimals: 188,
    activeTransports: 23,
    completedInspections: 892,
    pendingInspections: 47,
    systemAlerts: 3,
    criticalAlerts: 1,
    ...systemMetrics
  };

  const performanceMetrics = [
    {
      title: "Database Performance",
      value: 97.2,
      status: "excellent",
      icon: Database,
      color: "text-green-600"
    },
    {
      title: "API Response Time", 
      value: 89.1,
      status: "good",
      icon: Server,
      color: "text-blue-600"
    },
    {
      title: "Network Connectivity",
      value: 99.8,
      status: "excellent", 
      icon: Wifi,
      color: "text-green-600"
    },
    {
      title: "System Load",
      value: 67.4,
      status: "normal",
      icon: Activity,
      color: "text-yellow-600"
    }
  ];

  const recentSystemEvents = [
    {
      id: 1,
      type: "system",
      message: "Automatic backup completed successfully",
      timestamp: "2025-01-06 15:30:00",
      severity: "info",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "alert",
      message: "High memory usage detected on server node 3",
      timestamp: "2025-01-06 14:45:00", 
      severity: "warning",
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      id: 3,
      type: "maintenance",
      message: "Database optimization scheduled for tonight",
      timestamp: "2025-01-06 13:20:00",
      severity: "info",
      icon: RefreshCw,
      color: "text-blue-600"
    },
    {
      id: 4,
      type: "security",
      message: "Security scan completed - no threats detected",
      timestamp: "2025-01-06 12:00:00",
      severity: "info", 
      icon: Shield,
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Helmet>
        <title>System Overview - LiveTrace Livestock Monitoring System</title>
        <meta name="description" content="Comprehensive system overview and performance monitoring for LiveTrace platform" />
      </Helmet>

      <LiveTraceHeader />
      
      <div className="flex">
        <LiveTraceSidebar />
        
        <main className="flex-1 ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 text-center lg:text-left">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 justify-center lg:justify-start">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  System Overview
                </h1>
                <p className="text-gray-600 mt-1">Real-time system health and performance monitoring</p>
              </div>
              
              <div className="flex items-center justify-center lg:justify-end gap-4">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  System Operational
                </Badge>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* System Health Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">System Health</CardTitle>
                  <Heart className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{systemStatus.overallHealth}%</div>
                  <p className="text-xs opacity-80 mt-1">All systems operational</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Farms</CardTitle>
                  <MapPin className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockSystemData.totalRegisteredFarms.toLocaleString()}</div>
                  <p className="text-xs opacity-80 mt-1">{mockSystemData.activeFarms} active farms</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Total Livestock</CardTitle>
                  <Users className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockSystemData.totalLivestock.toLocaleString()}</div>
                  <p className="text-xs opacity-80 mt-1">{((mockSystemData.healthyAnimals / mockSystemData.totalLivestock) * 100).toFixed(1)}% healthy</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Active Transports</CardTitle>
                  <Truck className="h-5 w-5 opacity-80" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mockSystemData.activeTransports}</div>
                  <p className="text-xs opacity-80 mt-1">Real-time tracking</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  System Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <metric.icon className={`h-4 w-4 ${metric.color}`} />
                          <span className="text-sm font-medium text-gray-700">{metric.title}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 capitalize">{metric.status}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status and Events */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-7xl mx-auto">
              
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">API Services</p>
                          <p className="text-sm text-green-700">All endpoints operational</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Database className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Database</p>
                          <p className="text-sm text-green-700">Connection stable</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wifi className="h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium text-yellow-900">Network Latency</p>
                          <p className="text-sm text-yellow-700">{systemStatus.networkLatency}ms average</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Normal</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">System Uptime</p>
                          <p className="text-sm text-blue-700">Last 30 days</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">{systemStatus.uptime}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent System Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Recent System Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSystemEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <event.icon className={`h-5 w-5 ${event.color}`} />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.message}</p>
                          <p className="text-sm text-gray-500">{event.timestamp}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            event.severity === 'warning' ? 'border-orange-200 text-orange-700' :
                            event.severity === 'info' ? 'border-blue-200 text-blue-700' :
                            'border-gray-200 text-gray-700'
                          }
                        >
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Statistics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  System Statistics Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{mockSystemData.completedInspections}</div>
                    <p className="text-sm text-gray-600">Completed Inspections</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{mockSystemData.pendingInspections}</div>
                    <p className="text-sm text-gray-600">Pending Inspections</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{mockSystemData.animalsUnderTreatment}</div>
                    <p className="text-sm text-gray-600">Under Treatment</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{mockSystemData.quarantinedAnimals}</div>
                    <p className="text-sm text-gray-600">Quarantined</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{mockSystemData.systemAlerts}</div>
                    <p className="text-sm text-gray-600">System Alerts</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{mockSystemData.criticalAlerts}</div>
                    <p className="text-sm text-gray-600">Critical Alerts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}