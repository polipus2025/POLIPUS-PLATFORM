import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Waves,
  TreePine,
  Fish,
  Anchor,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Camera,
  Satellite,
  BarChart3,
  Activity
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import EcosystemMonitoring from "@/components/blue-carbon360/ecosystem-monitoring";

export default function EcosystemMonitoringPage() {
  // Fetch ecosystem monitoring data
  const { data: ecosystemData = [], isLoading: ecosystemLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/ecosystem-monitoring"],
  });

  // Fetch monitoring alerts
  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/monitoring-alerts"],
  });

  const ecosystemStats = [
    {
      title: 'Mangrove Areas',
      value: '2,450',
      unit: 'hectares',
      icon: TreePine,
      color: 'bg-green-500',
      change: '+12%',
      status: 'healthy'
    },
    {
      title: 'Seagrass Beds',
      value: '1,820',
      unit: 'hectares', 
      icon: Waves,
      color: 'bg-cyan-500',
      change: '+8%',
      status: 'healthy'
    },
    {
      title: 'Salt Marshes',
      value: '890',
      unit: 'hectares',
      icon: MapPin,
      color: 'bg-blue-500',
      change: '-3%',
      status: 'monitoring'
    },
    {
      title: 'Marine Species',
      value: '156',
      unit: 'species tracked',
      icon: Fish,
      color: 'bg-emerald-500',
      change: '+15%',
      status: 'healthy'
    }
  ];

  const monitoringTools = [
    {
      title: 'Satellite Monitoring',
      description: 'Real-time satellite imagery analysis',
      icon: Satellite,
      color: 'bg-purple-500',
      status: 'Active',
      lastUpdate: '2 hours ago'
    },
    {
      title: 'Water Quality Sensors',
      description: 'IoT sensors measuring ocean parameters',
      icon: Activity,
      color: 'bg-blue-500',
      status: 'Active',
      lastUpdate: '15 minutes ago'
    },
    {
      title: 'Biodiversity Cameras',
      description: 'Wildlife monitoring camera network',
      icon: Camera,
      color: 'bg-green-500',
      status: 'Active',
      lastUpdate: '1 hour ago'
    },
    {
      title: 'Field Surveys',
      description: 'On-ground conservation team reports',
      icon: MapPin,
      color: 'bg-orange-500',
      status: 'Scheduled',
      lastUpdate: 'Daily'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Ecosystem Monitoring - Blue Carbon 360</title>
        <meta name="description" content="Marine ecosystem monitoring and conservation tracking" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64">
          <ScrollArea className="h-screen">
            <div className="p-6 pb-20">
              
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Waves className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">Ecosystem Monitoring</h1>
                    <p className="text-slate-600">Real-time marine ecosystem health and conservation tracking</p>
                  </div>
                </div>
                <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200 px-3 py-1">
                  Live Monitoring Active
                </Badge>
              </div>

              {/* Ecosystem Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {ecosystemStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <Badge className={getStatusColor(stat.status)}>
                            {stat.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-slate-900">
                            {ecosystemLoading ? '...' : stat.value}
                          </p>
                          <p className="text-sm text-slate-500">{stat.unit}</p>
                          <p className="text-sm text-green-600 font-medium mt-2">{stat.change} vs last month</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Monitoring Tools */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Monitoring Tools & Systems</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {monitoringTools.map((tool, index) => {
                    const IconComponent = tool.icon;
                    return (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <Badge className={tool.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {tool.status}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-slate-900 mb-2">{tool.title}</h3>
                          <p className="text-sm text-slate-600 mb-3">{tool.description}</p>
                          <p className="text-xs text-slate-500">Last update: {tool.lastUpdate}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Monitoring Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span>Recent Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {alertsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
                        <p className="text-slate-600 mt-2">Loading alerts...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[
                          { type: 'Water Quality', message: 'pH levels slightly elevated in Sector 7', severity: 'medium', time: '2 hours ago' },
                          { type: 'Wildlife Activity', message: 'Increased marine activity detected near mangroves', severity: 'low', time: '4 hours ago' },
                          { type: 'Vegetation Health', message: 'Seagrass density showing positive growth', severity: 'positive', time: '6 hours ago' }
                        ].map((alert, index) => (
                          <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${
                            alert.severity === 'positive' ? 'bg-green-50 border-green-200' :
                            alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                          }`}>
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                alert.severity === 'positive' ? 'bg-green-500' :
                                alert.severity === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }`}></div>
                              <div>
                                <p className="font-medium text-slate-900">{alert.type}</p>
                                <p className="text-sm text-slate-600">{alert.message}</p>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500">{alert.time}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white shadow-sm border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-cyan-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                        Generate Monitoring Report
                      </Button>
                      <Button variant="outline" className="w-full">
                        Schedule Field Survey
                      </Button>
                      <Button variant="outline" className="w-full">
                        Export Ecosystem Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        Configure Alerts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Ecosystem Component */}
              <div className="mb-8">
                <EcosystemMonitoring />
              </div>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}