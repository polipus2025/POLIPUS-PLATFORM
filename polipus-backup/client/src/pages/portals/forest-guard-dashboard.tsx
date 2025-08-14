import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  TreePine,
  Satellite,
  DollarSign,
  Shield,
  Leaf,
  BarChart3,
  Plus,
  Eye,
  AlertTriangle,
  Camera,
  TrendingUp,
  Award
} from "lucide-react";

export default function ForestGuardDashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/forest-guard/stats"],
  });

  // Fetch recent forest areas
  const { data: forests, isLoading: forestsLoading } = useQuery({
    queryKey: ["/api/forest-areas"],
  });

  // Fetch deforestation alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/deforestation-alerts"],
  });

  const dashboardStats = [
    {
      title: 'Total Forests',
      value: stats?.totalForests || 0,
      icon: TreePine,
      color: 'bg-green-500',
      change: '+3%'
    },
    {
      title: 'Protected Forests',
      value: stats?.protectedForests || 0,
      icon: Shield,
      color: 'bg-teal-500',
      change: '+15%'
    },
    {
      title: 'Active Alerts',
      value: stats?.activeAlerts || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-22%'
    },
    {
      title: 'Carbon Credits',
      value: stats?.carbonCreditsIssued || 0,
      icon: Award,
      color: 'bg-blue-500',
      change: '+28%'
    }
  ];

  const protectionFeatures = [
    {
      title: 'Forest Monitoring',
      description: 'Real-time satellite forest surveillance',
      icon: Satellite,
      color: 'bg-teal-500',
      action: 'Monitor Forests'
    },
    {
      title: 'Carbon Credits',
      description: 'Carbon credit generation and management',
      icon: DollarSign,
      color: 'bg-green-500',
      action: 'Manage Credits'
    },
    {
      title: 'Deforestation Alerts',
      description: 'Automated deforestation detection system',
      icon: Shield,
      color: 'bg-red-500',
      action: 'View Alerts'
    },
    {
      title: 'Biodiversity Tracking',
      description: 'Ecosystem and biodiversity monitoring',
      icon: Leaf,
      color: 'bg-emerald-500',
      action: 'Track Species'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Forest Guard Dashboard - Forest Protection & Carbon Credits</title>
        <meta name="description" content="Forest protection and carbon credit management dashboard" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-teal-500 flex items-center justify-center">
              <TreePine className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Forest Guard Dashboard</h1>
          <p className="text-xl text-slate-600 mb-6">
            Forest Protection and Carbon Credit Management
          </p>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            Satellite Monitoring Active - Forest Protection Online
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
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Register Forest</span>
          </Button>
          <Button className="h-16 bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center space-x-2">
            <Satellite className="h-5 w-5" />
            <span>Satellite Monitor</span>
          </Button>
          <Button className="h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Report Alert</span>
          </Button>
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Issue Credits</span>
          </Button>
        </div>

        {/* Protection Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {protectionFeatures.map((feature, index) => {
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
          {/* Recent Forest Registrations */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TreePine className="h-5 w-5 text-green-600" />
                <span>Recent Forest Registrations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {forestsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading forest data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {forests?.slice(0, 5).map((forest: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{forest.forestId}</p>
                        <p className="text-sm text-slate-600">{forest.forestType} - {forest.county} ({forest.totalArea} ha)</p>
                      </div>
                      <Badge variant={forest.conservationStatus === 'protected' ? 'default' : 'secondary'}>
                        {forest.conservationStatus}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <TreePine className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No forest areas registered</p>
                      <Button className="mt-4" size="sm">
                        Register First Forest
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deforestation Alerts */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Deforestation Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alertsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading alert data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts?.slice(0, 5).map((alert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-slate-900">{alert.alertId}</p>
                        <p className="text-sm text-slate-600">{alert.cause} - {alert.areaAffected} ha affected</p>
                      </div>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No deforestation alerts</p>
                      <p className="text-sm text-slate-500">All forests are protected and monitored</p>
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