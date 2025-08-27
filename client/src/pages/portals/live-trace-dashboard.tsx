import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Activity, 
  Shield, 
  Bell,
  Truck,
  BarChart3,
  Plus,
  Eye,
  AlertTriangle,
  Users,
  Navigation,
  Heart,
  TrendingUp
} from "lucide-react";

export default function LiveTraceDashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/live-trace/stats"],
  });

  // Fetch recent livestock
  const { data: livestock, isLoading: livestockLoading } = useQuery({
    queryKey: ["/api/livestock"],
  });

  // Fetch recent alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/livestock/alerts"],
  });

  const dashboardStats = [
    {
      title: 'Total Animals',
      value: stats?.totalAnimals || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Healthy Animals',
      value: stats?.healthyAnimals || 0,
      icon: Heart,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Quarantined',
      value: stats?.quarantinedAnimals || 0,
      icon: Shield,
      color: 'bg-orange-500',
      change: '-8%'
    },
    {
      title: 'Active Alerts',
      value: stats?.activeAlerts || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '+3%'
    }
  ];

  const managementFeatures = [
    {
      title: 'Real-time GPS Tracking',
      description: 'Monitor livestock movement across territories',
      icon: Navigation,
      color: 'bg-blue-500',
      action: 'View Tracking'
    },
    {
      title: 'Health Monitoring',
      description: 'Track animal health and vaccination records',
      icon: Activity,
      color: 'bg-green-500',
      action: 'Health Dashboard'
    },
    {
      title: 'Movement Controls',
      description: 'Enforce quarantine and movement restrictions',
      icon: Shield,
      color: 'bg-red-500',
      action: 'Manage Controls'
    },
    {
      title: 'Alert System',
      description: 'Automated alerts for unusual activity',
      icon: Bell,
      color: 'bg-orange-500',
      action: 'View Alerts'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Live Trace Dashboard - Livestock Monitoring System</title>
        <meta name="description" content="Comprehensive livestock movement monitoring and control dashboard" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-blue-500 flex items-center justify-center">
              <Truck className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Live Trace Dashboard</h1>
          <p className="text-xl text-slate-600 mb-6">
            Livestock Movement Monitoring and Control System
          </p>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            System Operational - Real-time Monitoring Active
          </Badge>
        </div>

        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="isms-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-slate-900">{statsLoading ? '...' : stat.value.toLocaleString()}</p>
                      <p className="text-sm text-green-600 font-medium">{stat.change} vs last month</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Register Animal</span>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Track Movement</span>
          </Button>
          <Button className="h-16 bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Set Quarantine</span>
          </Button>
          <Button className="h-16 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>View Reports</span>
          </Button>
        </div>

        {/* Management Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {managementFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="isms-card hover-card">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <Button variant="outline" className="w-full">
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Livestock Registrations */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Recent Livestock Registrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {livestockLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading livestock data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {livestock?.slice(0, 5).map((animal: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{animal.animalId}</p>
                        <p className="text-sm text-slate-600">{animal.species} - {animal.county}</p>
                      </div>
                      <Badge variant={animal.healthStatus === 'healthy' ? 'default' : 'secondary'}>
                        {animal.healthStatus}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Truck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No livestock registrations yet</p>
                      <Button className="mt-4" size="sm">
                        Register First Animal
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Alerts */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Active Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading alerts...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts?.slice(0, 5).map((alert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-slate-900">{alert.title}</p>
                        <p className="text-sm text-slate-600">{alert.animalId} - {alert.alertType}</p>
                      </div>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No active alerts</p>
                      <p className="text-sm text-slate-500">All livestock monitoring systems operational</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}