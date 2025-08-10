import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Target,
  BarChart3,
  TrendingUp,
  Award,
  MapPin,
  Leaf,
  Waves,
  TreePine,
  Fish,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  FileText,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ConservationMetricsPage() {
  // Fetch conservation metrics data
  const { data: metricsData = [], isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/conservation-metrics"],
  });

  // Core conservation metrics
  const coreMetrics = [
    {
      title: 'Ecosystem Health Index',
      value: 87,
      unit: '/100',
      icon: Activity,
      color: 'bg-green-500',
      change: '+5 pts',
      status: 'excellent',
      target: 85
    },
    {
      title: 'Biodiversity Score',
      value: 92,
      unit: '/100',
      icon: Fish,
      color: 'bg-emerald-500',
      change: '+8 pts',
      status: 'outstanding',
      target: 80
    },
    {
      title: 'Carbon Sequestration Rate',
      value: 4.2,
      unit: 'tCO2/ha/year',
      icon: Leaf,
      color: 'bg-cyan-500',
      change: '+0.6',
      status: 'above_target',
      target: 3.5
    },
    {
      title: 'Community Engagement',
      value: 78,
      unit: '%',
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      status: 'good',
      target: 75
    }
  ];

  // Ecosystem-specific metrics
  const ecosystemMetrics = [
    {
      ecosystem: 'Mangrove Forests',
      icon: TreePine,
      color: 'bg-green-500',
      metrics: {
        coverage: { value: 2450, unit: 'hectares', change: '+8%', target: 2200 },
        health: { value: 89, unit: '/100', change: '+6 pts', target: 80 },
        carbonStock: { value: 185, unit: 'tC/ha', change: '+12', target: 150 },
        species: { value: 48, unit: 'species', change: '+5', target: 40 }
      }
    },
    {
      ecosystem: 'Seagrass Beds',
      icon: Waves,
      color: 'bg-cyan-500',
      metrics: {
        coverage: { value: 1820, unit: 'hectares', change: '+5%', target: 1700 },
        health: { value: 85, unit: '/100', change: '+4 pts', target: 75 },
        carbonStock: { value: 142, unit: 'tC/ha', change: '+8', target: 120 },
        species: { value: 36, unit: 'species', change: '+3', target: 30 }
      }
    },
    {
      ecosystem: 'Salt Marshes',
      icon: MapPin,
      color: 'bg-blue-500',
      metrics: {
        coverage: { value: 890, unit: 'hectares', change: '+3%', target: 850 },
        health: { value: 82, unit: '/100', change: '+2 pts', target: 75 },
        carbonStock: { value: 158, unit: 'tC/ha', change: '+7', target: 140 },
        species: { value: 28, unit: 'species', change: '+2', target: 25 }
      }
    }
  ];

  // Performance indicators
  const performanceIndicators = [
    {
      category: 'Restoration Success',
      metrics: [
        { name: 'Survival Rate', value: 94, unit: '%', target: 85, status: 'excellent' },
        { name: 'Growth Rate', value: 3.2, unit: 'cm/month', target: 2.5, status: 'excellent' },
        { name: 'Natural Regeneration', value: 76, unit: '%', target: 60, status: 'excellent' }
      ]
    },
    {
      category: 'Water Quality',
      metrics: [
        { name: 'Dissolved Oxygen', value: 8.2, unit: 'mg/L', target: 6.0, status: 'excellent' },
        { name: 'pH Level', value: 7.8, unit: 'pH', target: 7.5, status: 'good' },
        { name: 'Turbidity', value: 2.1, unit: 'NTU', target: 3.0, status: 'excellent' }
      ]
    },
    {
      category: 'Socioeconomic Impact',
      metrics: [
        { name: 'Local Employment', value: 1450, unit: 'jobs', target: 1200, status: 'excellent' },
        { name: 'Income Increase', value: 42, unit: '%', target: 30, status: 'excellent' },
        { name: 'Training Programs', value: 89, unit: 'completed', target: 75, status: 'excellent' }
      ]
    }
  ];

  // Monitoring stations data
  const monitoringStations = [
    {
      id: 'MS-001',
      name: 'Montserrado Coastal Station',
      location: 'Montserrado County',
      status: 'active',
      lastReading: '2 hours ago',
      sensors: ['Water Quality', 'Biodiversity', 'Carbon Flux'],
      alerts: 0
    },
    {
      id: 'MS-002', 
      name: 'Grand Bassa Marine Station',
      location: 'Grand Bassa County',
      status: 'active',
      lastReading: '1 hour ago',
      sensors: ['Seagrass Health', 'Fish Population', 'Water Chemistry'],
      alerts: 1
    },
    {
      id: 'MS-003',
      name: 'Sinoe Wetland Station',
      location: 'Sinoe County', 
      status: 'active',
      lastReading: '3 hours ago',
      sensors: ['Salt Marsh Health', 'Bird Population', 'Salinity'],
      alerts: 0
    },
    {
      id: 'MS-004',
      name: 'River Cess Multi-Station',
      location: 'River Cess County',
      status: 'maintenance',
      lastReading: '1 day ago',
      sensors: ['Mixed Ecosystem', 'Carbon Storage', 'Community Impact'],
      alerts: 2
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'outstanding': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'above_target': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Conservation Metrics - Blue Carbon 360</title>
        <meta name="description" content="Conservation performance metrics and ecosystem health monitoring" />
      </Helmet>

      <BlueCarbon360Header />
      <div className="flex">
        <BlueCarbon360Sidebar />
        
        <main className="flex-1 lg:ml-64">
          <ScrollArea className="h-screen">
            <div className="p-6 pb-20">
              
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Conservation Metrics</h1>
                      <p className="text-slate-600">Comprehensive ecosystem health and conservation performance tracking</p>
                    </div>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Metrics Report
                  </Button>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  Real-time Monitoring • 4 Active Stations
                </Badge>
              </div>

              {/* Core Conservation Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {coreMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  const isPositive = metric.change.startsWith('+');
                  const isOnTarget = metric.value >= metric.target;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                          <p className="text-3xl font-bold text-slate-900">
                            {metric.value}{metric.unit}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                              <span className="ml-1">{metric.change}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Target: {metric.target}{metric.unit}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Ecosystem-Specific Metrics */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Ecosystem-Specific Metrics</h2>
                <div className="space-y-6">
                  {ecosystemMetrics.map((ecosystem, index) => {
                    const IconComponent = ecosystem.icon;
                    return (
                      <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl ${ecosystem.color} flex items-center justify-center`}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <CardTitle className="text-lg">{ecosystem.ecosystem}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                              <p className="text-2xl font-bold text-slate-900">{ecosystem.metrics.coverage.value.toLocaleString()}</p>
                              <p className="text-xs text-slate-600 mb-1">{ecosystem.metrics.coverage.unit}</p>
                              <p className="text-xs text-green-600">{ecosystem.metrics.coverage.change}</p>
                              <p className="text-xs text-slate-500">Coverage</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                              <p className="text-2xl font-bold text-slate-900">{ecosystem.metrics.health.value}</p>
                              <p className="text-xs text-slate-600 mb-1">{ecosystem.metrics.health.unit}</p>
                              <p className="text-xs text-green-600">{ecosystem.metrics.health.change}</p>
                              <p className="text-xs text-slate-500">Health Score</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                              <p className="text-2xl font-bold text-slate-900">{ecosystem.metrics.carbonStock.value}</p>
                              <p className="text-xs text-slate-600 mb-1">{ecosystem.metrics.carbonStock.unit}</p>
                              <p className="text-xs text-green-600">+{ecosystem.metrics.carbonStock.change}</p>
                              <p className="text-xs text-slate-500">Carbon Stock</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-lg">
                              <p className="text-2xl font-bold text-slate-900">{ecosystem.metrics.species.value}</p>
                              <p className="text-xs text-slate-600 mb-1">{ecosystem.metrics.species.unit}</p>
                              <p className="text-xs text-green-600">+{ecosystem.metrics.species.change}</p>
                              <p className="text-xs text-slate-500">Species Count</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Performance Indicators</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {performanceIndicators.map((category, catIndex) => (
                    <Card key={catIndex} className="bg-white shadow-sm border-0">
                      <CardHeader>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {category.metrics.map((metric, metIndex) => (
                            <div key={metIndex} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="font-medium text-slate-900">{metric.name}</p>
                                <p className="text-sm text-slate-600">Target: {metric.target} {metric.unit}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-slate-900">{metric.value} {metric.unit}</p>
                                <Badge className={getStatusColor(metric.status)} size="sm">
                                  {metric.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Monitoring Stations Status */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Monitoring Stations</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {monitoringStations.map((station, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{station.name}</CardTitle>
                            <p className="text-sm text-slate-600">{station.id} • {station.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStationStatusColor(station.status)}>
                              {station.status}
                            </Badge>
                            {station.alerts > 0 && (
                              <Badge variant="destructive">
                                {station.alerts} alert{station.alerts > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <p className="text-sm text-slate-600 mb-2">Active Sensors:</p>
                          <div className="flex flex-wrap gap-1">
                            {station.sensors.map((sensor, sensorIndex) => (
                              <Badge key={sensorIndex} variant="secondary" className="text-xs">
                                {sensor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-slate-600">
                            <Clock className="h-4 w-4 inline mr-1" />
                            Last reading: {station.lastReading}
                          </p>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Data
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <span>Metrics Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button className="h-16 bg-green-600 hover:bg-green-700 text-white">
                      <Target className="h-5 w-5 mr-2" />
                      Set New Targets
                    </Button>
                    <Button variant="outline" className="h-16">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Trend Analysis
                    </Button>
                    <Button variant="outline" className="h-16">
                      <FileText className="h-5 w-5 mr-2" />
                      Export Metrics
                    </Button>
                    <Button variant="outline" className="h-16">
                      <Award className="h-5 w-5 mr-2" />
                      Benchmarking
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}