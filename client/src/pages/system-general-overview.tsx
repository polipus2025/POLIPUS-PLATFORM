import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, Database, Users, Activity, Settings, AlertTriangle,
  Server, Monitor, BarChart3, TrendingUp, Globe, Lock,
  FileText, Calendar, Clock, CheckCircle, XCircle,
  RefreshCw, Download, Upload, Eye, UserCheck,
  Building, MapPin, Leaf, Package, DollarSign
} from "lucide-react";
import { Helmet } from "react-helmet";
import lacraLogo from "@assets/LACRA LOGO_1753406166355.jpg";

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  systemUptime: string;
  databaseStatus: string;
  lastBackup: string;
  errorRate: number;
  responseTime: number;
}

interface SystemModule {
  name: string;
  status: "online" | "offline" | "maintenance";
  users: number;
  lastUpdate: string;
  version: string;
}

export default function SystemGeneralOverview() {
  const [systemTime, setSystemTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  // Update system time every second
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch system metrics
  const { data: metrics } = useQuery<SystemMetrics>({
    queryKey: ["/api/admin/system-metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch system modules status
  const { data: modules } = useQuery<SystemModule[]>({
    queryKey: ["/api/admin/system-modules"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch user statistics
  const { data: userStats } = useQuery({
    queryKey: ["/api/admin/user-statistics"],
  });

  // Fetch database health
  const { data: dbHealth } = useQuery({
    queryKey: ["/api/admin/database-health"],
    refetchInterval: 30000,
  });

  // Fetch recent activities
  const { data: recentActivities } = useQuery({
    queryKey: ["/api/admin/recent-activities"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-100 text-green-800";
      case "offline": return "bg-red-100 text-red-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="w-4 h-4" />;
      case "offline": return <XCircle className="w-4 h-4" />;
      case "maintenance": return <RefreshCw className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>System General Overview - LACRA Administration</title>
        <meta name="description" content="LACRA comprehensive system administration dashboard" />
      </Helmet>

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={lacraLogo} alt="LACRA Logo" className="h-12 w-12 rounded-lg object-cover" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">System General Overview</h1>
                <p className="text-sm text-gray-600">LACRA System Administration Control Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {systemTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-lg font-mono text-green-600">
                  {systemTime.toLocaleTimeString('en-US', { hour12: false })}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                System Active
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-full px-6 py-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.totalUsers || 0}</p>
                  <p className="text-xs text-green-600">↑ {metrics?.activeUsers || 0} active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">System Uptime</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.systemUptime || "99.9%"}</p>
                  <p className="text-xs text-green-600">Last 30 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Database Status</p>
                  <p className="text-2xl font-bold text-gray-900">Healthy</p>
                  <p className="text-xs text-gray-500">{metrics?.responseTime || 45}ms avg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.totalTransactions || 0}</p>
                  <p className="text-xs text-blue-600">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="overview" className="transition-all duration-200">
              <Monitor className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="modules" className="transition-all duration-200">
              <Server className="w-4 h-4 mr-2" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="users" className="transition-all duration-200">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="database" className="transition-all duration-200">
              <Database className="w-4 h-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="security" className="transition-all duration-200">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="settings" className="transition-all duration-200">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">API Server</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Database</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">File Storage</span>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Accessible
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">External APIs</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Checking
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities?.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-gray-900">{activity.description || "System activity logged"}</p>
                          <p className="text-gray-500 text-xs">{activity.timestamp || "Just now"}</p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-4 text-gray-500">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No recent activities</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AgriTrace360 Modules Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  AgriTrace360™ Modules Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: "Farm Inspector Portal", users: 45, status: "online" },
                    { name: "Farmer Dashboard", users: 234, status: "online" },
                    { name: "Buyer Platform", users: 67, status: "online" },
                    { name: "Exporter Portal", users: 23, status: "online" },
                    { name: "Regulatory Oversight", users: 12, status: "online" },
                    { name: "GPS Mapping System", users: 89, status: "maintenance" },
                    { name: "EUDR Compliance", users: 156, status: "online" },
                    { name: "Payment Services", users: 78, status: "online" }
                  ].map((module, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{module.name}</h4>
                        <Badge className={getStatusColor(module.status)}>
                          {getStatusIcon(module.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{module.users} active users</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  System Modules Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modules?.map((module, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          module.status === 'online' ? 'bg-green-500' : 
                          module.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-gray-600">Version {module.version} • {module.users} users</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(module.status)}>
                          {module.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Server className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Loading system modules...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold text-gray-900">{userStats?.farmers || 0}</p>
                    <p className="text-sm text-gray-600">Registered Farmers</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Building className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-gray-900">{userStats?.buyers || 0}</p>
                    <p className="text-sm text-gray-600">Active Buyers</p>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="text-2xl font-bold text-gray-900">{userStats?.inspectors || 0}</p>
                    <p className="text-sm text-gray-600">Field Inspectors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Database Administration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Database Health</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Connection Status</span>
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="text-sm font-medium">{dbHealth?.responseTime || 45}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Connections</span>
                        <span className="text-sm font-medium">{dbHealth?.activeConnections || 12}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Storage Used</span>
                        <span className="text-sm font-medium">{dbHealth?.storageUsed || "2.3 GB"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export Database Backup
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Optimize Tables
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Eye className="w-4 h-4 mr-2" />
                        View Query Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Security Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">SSL Certificate</span>
                        <Badge className="bg-green-100 text-green-800">Valid</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Firewall Status</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Failed Login Attempts</span>
                        <span className="text-sm font-medium text-red-600">3 (last 24h)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Two-Factor Auth</span>
                        <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Recent Security Events</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Successful admin login - 2 minutes ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Password reset request - 1 hour ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Failed login attempt - 3 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">System Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Globe className="w-4 h-4 mr-2" />
                        Global Settings
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Lock className="w-4 h-4 mr-2" />
                        Security Settings
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        System Logs
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Backup Schedule
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
  );
}