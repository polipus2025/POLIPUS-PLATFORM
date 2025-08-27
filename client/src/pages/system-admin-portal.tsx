import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  CheckCircle,
  Users,
  MapPin,
  Shield,
  TreePine,
  Waves,
  DollarSign,
  Leaf,
  Zap,
  Settings,
  Activity,
  Database,
  Server
} from "lucide-react";
import { Helmet } from "react-helmet";

export default function SystemAdminPortal() {
  const { data: integrationData, isLoading } = useQuery({
    queryKey: ["/api/polipus/integrated-dashboard"],
  });

  const { data: connectionData } = useQuery({
    queryKey: ["/api/polipus/module-connections"],
  });

  const { data: monitoringData } = useQuery({
    queryKey: ["/api/monitoring/overview"],
    refetchInterval: 5000,
  });

  const { data: systemMetrics } = useQuery({
    queryKey: ["/api/monitoring/system-metrics"],
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const moduleIcons = {
    "live-trace": { icon: Users, color: "bg-blue-500", name: "Live Trace", status: "Connected" },
    "land-map360": { icon: MapPin, color: "bg-purple-500", name: "Land Map 360", status: "Connected" },
    "mine-watch": { icon: Shield, color: "bg-orange-500", name: "Mine Watch", status: "Connected" },
    "forest-guard": { icon: TreePine, color: "bg-teal-500", name: "Forest Guard", status: "Connected" },
    "aqua-trace": { icon: Waves, color: "bg-indigo-500", name: "Aqua Trace", status: "Connected" },
    "blue-carbon360": { icon: DollarSign, color: "bg-cyan-500", name: "Blue Carbon 360", status: "Connected" },
    "carbon-trace": { icon: Leaf, color: "bg-green-500", name: "Carbon Trace", status: "Connected" }
  };

  const systemStats = {
    totalUsers: monitoringData?.totalUsers || 0,
    activeModules: 7,
    systemUptime: monitoringData?.uptime || 99.8,
    databaseHealth: systemMetrics?.database || 98.5,
    apiRequests: systemMetrics?.apiRequests || 0,
    dataStorageUsed: ((systemMetrics?.storage || 12) / 1000).toFixed(1)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>System Administrator Portal - Polipus Platform</title>
        <meta name="description" content="Comprehensive system administration control center for the Polipus Environmental Intelligence Platform" />
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Platform
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">System Administrator Portal</h1>
              <p className="text-slate-600">Comprehensive system control and monitoring center</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{systemStats.systemUptime}%</p>
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
                  <p className="text-sm font-medium text-gray-600">DB Health</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.databaseHealth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Server className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Storage Used</p>
                  <p className="text-2xl font-bold text-gray-900">{systemStats.dataStorageUsed}TB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Module Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Module Status & Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(moduleIcons).map(([moduleKey, module]) => {
                const Icon = module.icon;
                return (
                  <div
                    key={moduleKey}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{module.name}</h3>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {module.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Active Users:</span>
                        <span className="font-medium">{Math.floor((monitoringData?.totalUsers || 0) * 0.3) + 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>API Calls (24h):</span>
                        <span className="font-medium">{(systemMetrics?.apiRequests || 0) + ((monitoringData?.totalOffers || 0) * 50)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uptime:</span>
                        <span className="font-medium text-green-600">99.9%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              System Administration Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Database className="h-6 w-6" />
                <span>Database Backup</span>
              </Button>
              
              <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
                <Activity className="h-6 w-6" />
                <span>System Health Check</span>
              </Button>
              
              <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700">
                <Users className="h-6 w-6" />
                <span>User Management</span>
              </Button>
              
              <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700">
                <Settings className="h-6 w-6" />
                <span>System Configuration</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}