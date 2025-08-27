import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Leaf,
  Factory,
  Activity,
  AlertTriangle,
  BarChart3,
  Plus,
  Eye,
  Target,
  TrendingDown,
  Cloud,
  Monitor,
  Zap
} from "lucide-react";

export default function CarbonTraceDashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/carbon-trace/stats"],
  });

  // Fetch recent emission sources
  const { data: sources, isLoading: sourcesLoading } = useQuery({
    queryKey: ["/api/emission-sources"],
  });

  // Fetch environmental alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/environmental-alerts"],
  });

  const dashboardStats = [
    {
      title: 'Total Sources',
      value: stats?.totalSources || 0,
      icon: Factory,
      color: 'bg-slate-500',
      change: '+7%'
    },
    {
      title: 'Active Sources',
      value: stats?.activeSources || 0,
      icon: Activity,
      color: 'bg-green-500',
      change: '+3%'
    },
    {
      title: 'Recent Measurements',
      value: stats?.recentMeasurements || 0,
      icon: Monitor,
      color: 'bg-blue-500',
      change: '+15%'
    },
    {
      title: 'Active Alerts',
      value: stats?.activeAlerts || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: '-12%'
    }
  ];

  const monitoringFeatures = [
    {
      title: 'Emission Monitoring',
      description: 'Real-time greenhouse gas emission tracking',
      icon: Cloud,
      color: 'bg-slate-500',
      action: 'Monitor Emissions'
    },
    {
      title: 'Source Registration',
      description: 'Register and manage emission sources',
      icon: Factory,
      color: 'bg-orange-500',
      action: 'Register Source'
    },
    {
      title: 'Carbon Offsetting',
      description: 'Purchase and manage carbon offsets',
      icon: Leaf,
      color: 'bg-green-500',
      action: 'Buy Offsets'
    },
    {
      title: 'Alert System',
      description: 'Automated environmental threshold alerts',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: 'Set Alerts'
    }
  ];

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Carbon Trace Dashboard - Environmental Monitoring</title>
        <meta name="description" content="Environmental monitoring and carbon footprint tracking dashboard" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="isms-card text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl bg-green-500 flex items-center justify-center">
              <Leaf className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Carbon Trace Dashboard</h1>
          <p className="text-xl text-slate-600 mb-6">
            Environmental Monitoring and Carbon Footprint Tracking
          </p>
          <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
            Monitoring Active - Real-time Environmental Tracking
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
          <Button className="h-16 bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Register Source</span>
          </Button>
          <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Record Measurement</span>
          </Button>
          <Button className="h-16 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center space-x-2">
            <Leaf className="h-5 w-5" />
            <span>Purchase Offset</span>
          </Button>
          <Button className="h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Set Alert</span>
          </Button>
        </div>

        {/* Monitoring Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {monitoringFeatures.map((feature, index) => {
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
          {/* Recent Emission Sources */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Factory className="h-5 w-5 text-slate-600" />
                <span>Recent Emission Sources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sourcesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
                  <p className="text-slate-600 mt-2">Loading emission source data...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sources?.slice(0, 5).map((source: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{source.sourceId}</p>
                        <p className="text-sm text-slate-600">{source.sourceType} - {source.county} ({source.currentEmissions} tCO2e/yr)</p>
                      </div>
                      <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                        {source.status}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Factory className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No emission sources registered</p>
                      <Button className="mt-4" size="sm">
                        Register First Source
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environmental Alerts */}
          <Card className="isms-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span>Environmental Alerts</span>
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
                        <p className="text-sm text-slate-600">{alert.alertType} - {alert.title}</p>
                      </div>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {alert.severity}
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-8">
                      <Zap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600">No environmental alerts</p>
                      <p className="text-sm text-slate-500">All systems within normal parameters</p>
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