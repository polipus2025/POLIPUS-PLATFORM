import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  TreePine,
  MapPin,
  Activity,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Eye,
  Plus,
  Calendar,
  Users,
  Camera,
  Satellite,
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Leaf,
  Fish,
  Shield,
  Target
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MangroveManagementPage() {
  // Fetch mangrove data
  const { data: mangroveData = [], isLoading: mangroveLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/mangrove-management"],
  });

  // Mangrove site overview metrics
  const mangroveMetrics = [
    {
      title: 'Total Mangrove Coverage',
      value: 2450,
      unit: 'hectares',
      icon: TreePine,
      color: 'bg-green-500',
      change: '+8%',
      status: 'expanding'
    },
    {
      title: 'Restoration Sites',
      value: 12,
      unit: 'active sites',
      icon: Shield,
      color: 'bg-emerald-500',
      change: '+3',
      status: 'growing'
    },
    {
      title: 'Carbon Sequestration',
      value: 5.2,
      unit: 'tCO2/ha/year',
      icon: Leaf,
      color: 'bg-cyan-500',
      change: '+0.4',
      status: 'improving'
    },
    {
      title: 'Biodiversity Index',
      value: 89,
      unit: '/100',
      icon: Fish,
      color: 'bg-blue-500',
      change: '+6 pts',
      status: 'excellent'
    }
  ];

  // Mangrove sites data
  const mangroveSites = [
    {
      id: 'MG-001',
      name: 'Montserrado Coastal Reserve',
      location: 'Montserrado County',
      area: 480,
      status: 'healthy',
      established: '2019',
      species: ['Rhizophora mangle', 'Avicennia germinans', 'Laguncularia racemosa'],
      carbonStock: 185,
      communityBenefit: 2400,
      threats: 'low',
      lastSurvey: '2 weeks ago',
      restorationProgress: 85,
      waterQuality: 'excellent'
    },
    {
      id: 'MG-002',
      name: 'Grand Bassa Mangrove Sanctuary',
      location: 'Grand Bassa County',
      area: 620,
      status: 'healthy',
      established: '2018',
      species: ['Rhizophora mangle', 'Nypa fruticans', 'Bruguiera gymnorrhiza'],
      carbonStock: 198,
      communityBenefit: 3200,
      threats: 'low',
      lastSurvey: '1 week ago',
      restorationProgress: 92,
      waterQuality: 'good'
    },
    {
      id: 'MG-003',
      name: 'Sinoe Delta Conservation Area',
      location: 'Sinoe County',
      area: 380,
      status: 'recovering',
      established: '2020',
      species: ['Rhizophora mangle', 'Avicennia germinans'],
      carbonStock: 156,
      communityBenefit: 1800,
      threats: 'medium',
      lastSurvey: '3 weeks ago',
      restorationProgress: 68,
      waterQuality: 'good'
    },
    {
      id: 'MG-004',
      name: 'River Cess Mangrove Complex',
      location: 'River Cess County',
      area: 720,
      status: 'healthy',
      established: '2017',
      species: ['Rhizophora mangle', 'Avicennia germinans', 'Laguncularia racemosa', 'Conocarpus erectus'],
      carbonStock: 210,
      communityBenefit: 4100,
      threats: 'low',
      lastSurvey: '1 week ago',
      restorationProgress: 94,
      waterQuality: 'excellent'
    },
    {
      id: 'MG-005',
      name: 'Grand Gedeh Restoration Site',
      location: 'Grand Gedeh County',
      area: 250,
      status: 'growing',
      established: '2022',
      species: ['Rhizophora mangle', 'Avicennia germinans'],
      carbonStock: 89,
      communityBenefit: 950,
      threats: 'low',
      lastSurvey: '5 days ago',
      restorationProgress: 45,
      waterQuality: 'good'
    }
  ];

  // Environmental monitoring data
  const environmentalData = {
    waterQuality: {
      salinity: { value: 18.5, unit: 'ppt', status: 'optimal', target: '15-25 ppt' },
      pH: { value: 7.8, unit: 'pH', status: 'good', target: '7.5-8.2' },
      dissolved_oxygen: { value: 6.2, unit: 'mg/L', status: 'good', target: '>5 mg/L' },
      temperature: { value: 27.5, unit: '°C', status: 'optimal', target: '25-30°C' }
    },
    weather: {
      temperature: { value: 28, unit: '°C', icon: Thermometer },
      humidity: { value: 82, unit: '%', icon: Droplets },
      wind_speed: { value: 12, unit: 'km/h', icon: Wind },
      precipitation: { value: 45, unit: 'mm/week', icon: Sun }
    }
  };

  // Management activities
  const managementActivities = [
    {
      activity: 'Seedling Plantation',
      schedule: 'Weekly',
      nextDate: '2024-08-15',
      responsible: 'Field Team Alpha',
      sites: ['MG-001', 'MG-005'],
      priority: 'high'
    },
    {
      activity: 'Water Quality Testing',
      schedule: 'Bi-weekly',
      nextDate: '2024-08-12',
      responsible: 'Environmental Monitoring Unit',
      sites: ['MG-001', 'MG-002', 'MG-003', 'MG-004'],
      priority: 'medium'
    },
    {
      activity: 'Biodiversity Survey',
      schedule: 'Monthly',
      nextDate: '2024-08-20',
      responsible: 'Marine Biology Team',
      sites: ['MG-002', 'MG-004'],
      priority: 'medium'
    },
    {
      activity: 'Community Training',
      schedule: 'Quarterly',
      nextDate: '2024-09-01',
      responsible: 'Community Outreach Team',
      sites: ['MG-003', 'MG-005'],
      priority: 'high'
    },
    {
      activity: 'Invasive Species Control',
      schedule: 'As needed',
      nextDate: '2024-08-18',
      responsible: 'Conservation Rangers',
      sites: ['MG-003'],
      priority: 'urgent'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'recovering': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'growing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at_risk': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'optimal': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Mangrove Management - Blue Carbon 360</title>
        <meta name="description" content="Comprehensive mangrove ecosystem management and conservation tracking" />
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
                      <TreePine className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Mangrove Management</h1>
                      <p className="text-slate-600">Comprehensive mangrove ecosystem conservation and restoration management</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Satellite className="h-4 w-4 mr-2" />
                      Satellite View
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Site
                    </Button>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                  5 Active Sites • Real-time Monitoring
                </Badge>
              </div>

              {/* Mangrove Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {mangroveMetrics.map((metric, index) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl ${metric.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                          <p className="text-3xl font-bold text-slate-900">
                            {metric.value.toLocaleString()}{metric.unit ? ` ${metric.unit}` : ''}
                          </p>
                          <p className="text-sm text-green-600 font-medium mt-1">{metric.change} vs last period</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Environmental Monitoring Dashboard */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Environmental Monitoring</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Water Quality Parameters */}
                  <Card className="bg-white shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Droplets className="h-5 w-5 text-cyan-600" />
                        <span>Water Quality Parameters</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(environmentalData.waterQuality).map(([param, data], index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900 capitalize">{param.replace('_', ' ')}</p>
                              <p className="text-sm text-slate-600">Target: {data.target}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-slate-900">{data.value} {data.unit}</p>
                              <p className={`text-sm font-medium ${getQualityColor(data.status)}`}>{data.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Weather Conditions */}
                  <Card className="bg-white shadow-sm border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Sun className="h-5 w-5 text-yellow-600" />
                        <span>Current Weather Conditions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(environmentalData.weather).map(([param, data], index) => {
                          const IconComponent = data.icon;
                          return (
                            <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-5 w-5 text-slate-600" />
                                <p className="font-medium text-slate-900 capitalize">{param.replace('_', ' ')}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-slate-900">{data.value} {data.unit}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Mangrove Sites Management */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Mangrove Sites</h2>
                <div className="space-y-6">
                  {mangroveSites.map((site, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg mb-2">{site.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{site.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TreePine className="h-4 w-4" />
                                <span>{site.area} hectares</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Est. {site.established}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(site.status)}>
                              {site.status}
                            </Badge>
                            <Badge className={getThreatColor(site.threats)}>
                              {site.threats} threat
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        
                        {/* Site Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-600">{site.carbonStock}</p>
                            <p className="text-xs text-slate-600">tC/ha</p>
                            <p className="text-xs text-slate-500">Carbon Stock</p>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-600">{site.communityBenefit.toLocaleString()}</p>
                            <p className="text-xs text-slate-600">people</p>
                            <p className="text-xs text-slate-500">Beneficiaries</p>
                          </div>
                          <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <p className="text-xl font-bold text-emerald-600">{site.restorationProgress}%</p>
                            <p className="text-xs text-slate-600">complete</p>
                            <p className="text-xs text-slate-500">Restoration</p>
                          </div>
                          <div className="text-center p-3 bg-cyan-50 rounded-lg">
                            <p className="text-xl font-bold text-cyan-600">{site.species.length}</p>
                            <p className="text-xs text-slate-600">species</p>
                            <p className="text-xs text-slate-500">Diversity</p>
                          </div>
                        </div>

                        {/* Restoration Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Restoration Progress</span>
                            <span>{site.restorationProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${site.restorationProgress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Species Information */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Mangrove Species:</p>
                          <div className="flex flex-wrap gap-1">
                            {site.species.map((species, speciesIndex) => (
                              <Badge key={speciesIndex} variant="secondary" className="text-xs italic">
                                {species}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Site Status and Actions */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-slate-600">
                            <span>Water Quality: </span>
                            <span className={`font-medium ${getQualityColor(site.waterQuality)}`}>
                              {site.waterQuality}
                            </span>
                            <span className="ml-4">Last Survey: {site.lastSurvey}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Camera className="h-4 w-4 mr-1" />
                              Photos
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Management Activities Schedule */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Management Activities Schedule</h2>
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-slate-200">
                          <tr>
                            <th className="text-left p-4 font-semibold text-slate-900">Activity</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Schedule</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Next Date</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Responsible Team</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Sites</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Priority</th>
                          </tr>
                        </thead>
                        <tbody>
                          {managementActivities.map((activity, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-4 font-medium text-slate-900">{activity.activity}</td>
                              <td className="p-4 text-slate-600">{activity.schedule}</td>
                              <td className="p-4 text-slate-900">{activity.nextDate}</td>
                              <td className="p-4 text-slate-600">{activity.responsible}</td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                  {activity.sites.map((site, siteIndex) => (
                                    <Badge key={siteIndex} variant="outline" className="text-xs">
                                      {site}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={getPriorityColor(activity.priority)}>
                                  {activity.priority}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Management Tools */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Management Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button className="h-16 bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Site
                    </Button>
                    <Button variant="outline" className="h-16">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Analytics Report
                    </Button>
                    <Button variant="outline" className="h-16">
                      <FileText className="h-5 w-5 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="h-16">
                      <Satellite className="h-5 w-5 mr-2" />
                      Satellite Imagery
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