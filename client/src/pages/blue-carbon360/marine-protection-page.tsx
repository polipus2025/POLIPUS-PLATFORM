import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield,
  Waves,
  Fish,
  Anchor,
  MapPin,
  Activity,
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
  TreePine,
  Target,
  Globe,
  Compass,
  Navigation
} from "lucide-react";
import BlueCarbon360Header from "@/components/layout/blue-carbon360-header";
import BlueCarbon360Sidebar from "@/components/layout/blue-carbon360-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

export default function MarineProtectionPage() {
  // Fetch marine protection data
  const { data: marineData = [], isLoading: marineLoading } = useQuery({
    queryKey: ["/api/blue-carbon360/marine-protection"],
  });

  // Marine protection overview metrics
  const protectionMetrics = [
    {
      title: 'Protected Marine Areas',
      value: 12,
      unit: 'zones',
      icon: Shield,
      color: 'bg-blue-500',
      change: '+2',
      status: 'expanding'
    },
    {
      title: 'Total Protected Area',
      value: 3850,
      unit: 'km²',
      icon: Waves,
      color: 'bg-cyan-500',
      change: '+15%',
      status: 'growing'
    },
    {
      title: 'Species Protected',
      value: 248,
      unit: 'species',
      icon: Fish,
      color: 'bg-emerald-500',
      change: '+18',
      status: 'thriving'
    },
    {
      title: 'Enforcement Patrols',
      value: 156,
      unit: 'monthly',
      icon: Anchor,
      color: 'bg-slate-500',
      change: '+8',
      status: 'active'
    }
  ];

  // Marine protected areas
  const marineAreas = [
    {
      id: 'MPA-001',
      name: 'Montserrado Marine Sanctuary',
      location: 'Montserrado County',
      coordinates: { lat: 6.3156, lng: -10.8074 },
      area: 480,
      status: 'fully_protected',
      established: '2018',
      zoneType: 'No-Take Zone',
      primarySpecies: ['West African Manatee', 'Atlantic Tarpon', 'Green Turtle'],
      threats: 'low',
      lastPatrol: '2 days ago',
      complianceRate: 94,
      ecosystems: ['Mangroves', 'Seagrass Beds', 'Coral Reefs']
    },
    {
      id: 'MPA-002',
      name: 'Grand Bassa Marine Reserve',
      location: 'Grand Bassa County',
      coordinates: { lat: 5.8992, lng: -9.9731 },
      area: 720,
      status: 'multiple_use',
      established: '2019',
      zoneType: 'Restricted Use',
      primarySpecies: ['Bottlenose Dolphin', 'Hawksbill Turtle', 'African Pompano'],
      threats: 'medium',
      lastPatrol: '1 day ago',
      complianceRate: 87,
      ecosystems: ['Open Ocean', 'Coastal Waters', 'Estuaries']
    },
    {
      id: 'MPA-003',
      name: 'Sinoe Bay Conservation Area',
      location: 'Sinoe County',
      coordinates: { lat: 5.4985, lng: -9.6406 },
      area: 620,
      status: 'partial_protection',
      established: '2020',
      zoneType: 'Buffer Zone',
      primarySpecies: ['Leatherback Turtle', 'Red Snapper', 'Barracuda'],
      threats: 'low',
      lastPatrol: '4 days ago',
      complianceRate: 91,
      ecosystems: ['Wetlands', 'Lagoons', 'Tidal Flats']
    },
    {
      id: 'MPA-004',
      name: 'River Cess Marine Complex',
      location: 'River Cess County',
      coordinates: { lat: 5.9024, lng: -9.4562 },
      area: 890,
      status: 'fully_protected',
      established: '2017',
      zoneType: 'Strict Reserve',
      primarySpecies: ['Whale Shark', 'Manta Ray', 'Loggerhead Turtle'],
      threats: 'low',
      lastPatrol: '1 day ago',
      complianceRate: 96,
      ecosystems: ['Deep Water', 'Continental Shelf', 'Pelagic Zone']
    },
    {
      id: 'MPA-005',
      name: 'Grand Gedeh Coastal Preserve',
      location: 'Grand Gedeh County',
      coordinates: { lat: 6.0726, lng: -8.2218 },
      area: 340,
      status: 'restoration',
      established: '2021',
      zoneType: 'Recovery Area',
      primarySpecies: ['West African Seahorse', 'Grouper', 'Angelfish'],
      threats: 'medium',
      lastPatrol: '3 days ago',
      complianceRate: 78,
      ecosystems: ['Rocky Reefs', 'Sandy Bottoms', 'Kelp Forests']
    }
  ];

  // Enforcement and monitoring activities
  const enforcementActivities = [
    {
      activity: 'Regular Patrols',
      frequency: 'Daily',
      nextScheduled: '2024-08-11',
      responsible: 'Marine Patrol Unit',
      areas: ['MPA-001', 'MPA-002', 'MPA-004'],
      priority: 'high',
      resources: '3 patrol boats, 12 officers'
    },
    {
      activity: 'Aerial Surveillance',
      frequency: 'Weekly',
      nextScheduled: '2024-08-14',
      responsible: 'Coast Guard Aviation',
      areas: ['MPA-002', 'MPA-004'],
      priority: 'medium',
      resources: '2 aircraft, 6 crew members'
    },
    {
      activity: 'Underwater Monitoring',
      frequency: 'Monthly',
      nextScheduled: '2024-08-20',
      responsible: 'Marine Biology Team',
      areas: ['MPA-001', 'MPA-003', 'MPA-005'],
      priority: 'medium',
      resources: '4 divers, 2 research vessels'
    },
    {
      activity: 'Community Engagement',
      frequency: 'Quarterly',
      nextScheduled: '2024-09-01',
      responsible: 'Outreach Coordinators',
      areas: ['MPA-003', 'MPA-005'],
      priority: 'high',
      resources: '8 coordinators, 5 communities'
    },
    {
      activity: 'Fishing License Checks',
      frequency: 'Bi-weekly',
      nextScheduled: '2024-08-16',
      responsible: 'Fisheries Inspectors',
      areas: ['MPA-002', 'MPA-003'],
      priority: 'high',
      resources: '6 inspectors, 2 checkpoints'
    }
  ];

  // Threat assessment data
  const threatAssessment = [
    {
      threat: 'Illegal Fishing',
      severity: 'medium',
      areas: ['MPA-002', 'MPA-005'],
      trend: 'decreasing',
      incidents: 12,
      lastIncident: '5 days ago',
      mitigation: 'Increased patrols, community reporting'
    },
    {
      threat: 'Plastic Pollution',
      severity: 'high',
      areas: ['MPA-001', 'MPA-003'],
      trend: 'stable',
      incidents: 24,
      lastIncident: '2 days ago',
      mitigation: 'Beach cleanups, waste management programs'
    },
    {
      threat: 'Coastal Development',
      severity: 'low',
      areas: ['MPA-001'],
      trend: 'increasing',
      incidents: 3,
      lastIncident: '2 weeks ago',
      mitigation: 'Environmental impact assessments'
    },
    {
      threat: 'Climate Change Effects',
      severity: 'high',
      areas: ['MPA-001', 'MPA-002', 'MPA-003', 'MPA-004', 'MPA-005'],
      trend: 'increasing',
      incidents: 8,
      lastIncident: '1 week ago',
      mitigation: 'Habitat restoration, monitoring programs'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fully_protected': return 'bg-green-100 text-green-800 border-green-200';
      case 'multiple_use': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'partial_protection': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'restoration': return 'bg-purple-100 text-purple-800 border-purple-200';
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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'decreasing': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'increasing': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Marine Protection Areas - Blue Carbon 360</title>
        <meta name="description" content="Marine protected areas management and conservation enforcement" />
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
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">Marine Protection Areas</h1>
                      <p className="text-slate-600">Comprehensive marine conservation and enforcement management</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Marine Charts
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Protection Area
                    </Button>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                  12 Protected Areas • Real-time Monitoring
                </Badge>
              </div>

              {/* Protection Overview Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {protectionMetrics.map((metric, index) => {
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

              {/* Marine Protected Areas */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Marine Protected Areas</h2>
                <div className="space-y-6">
                  {marineAreas.map((area, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg mb-2">{area.name}</CardTitle>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{area.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Waves className="h-4 w-4" />
                                <span>{area.area} km²</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Est. {area.established}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(area.status)}>
                              {area.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={getThreatColor(area.threats)}>
                              {area.threats} threat
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        
                        {/* Area Metrics Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-xl font-bold text-blue-600">{area.complianceRate}%</p>
                            <p className="text-xs text-slate-600">Compliance Rate</p>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <p className="text-xl font-bold text-green-600">{area.primarySpecies.length}</p>
                            <p className="text-xs text-slate-600">Key Species</p>
                          </div>
                          <div className="text-center p-3 bg-emerald-50 rounded-lg">
                            <p className="text-xl font-bold text-emerald-600">{area.ecosystems.length}</p>
                            <p className="text-xs text-slate-600">Ecosystems</p>
                          </div>
                          <div className="text-center p-3 bg-cyan-50 rounded-lg">
                            <p className="text-sm font-bold text-cyan-600">{area.zoneType}</p>
                            <p className="text-xs text-slate-600">Protection Level</p>
                          </div>
                        </div>

                        {/* Primary Species */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Key Protected Species:</p>
                          <div className="flex flex-wrap gap-1">
                            {area.primarySpecies.map((species, speciesIndex) => (
                              <Badge key={speciesIndex} variant="secondary" className="text-xs">
                                {species}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Ecosystems */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Protected Ecosystems:</p>
                          <div className="flex flex-wrap gap-1">
                            {area.ecosystems.map((ecosystem, ecoIndex) => (
                              <Badge key={ecoIndex} variant="outline" className="text-xs">
                                {ecosystem}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Area Status and Actions */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-slate-600">
                            <span>Last Patrol: {area.lastPatrol}</span>
                            <span className="ml-4">Coordinates: </span>
                            <span className="font-mono">
                              {area.coordinates.lat.toFixed(4)}, {area.coordinates.lng.toFixed(4)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Navigation className="h-4 w-4 mr-1" />
                              Navigate
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Enforcement Activities */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Enforcement & Monitoring Activities</h2>
                <Card className="bg-white shadow-sm border-0">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-slate-200">
                          <tr>
                            <th className="text-left p-4 font-semibold text-slate-900">Activity</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Frequency</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Next Scheduled</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Responsible Team</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Coverage Areas</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Priority</th>
                            <th className="text-left p-4 font-semibold text-slate-900">Resources</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enforcementActivities.map((activity, index) => (
                            <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="p-4 font-medium text-slate-900">{activity.activity}</td>
                              <td className="p-4 text-slate-600">{activity.frequency}</td>
                              <td className="p-4 text-slate-900">{activity.nextScheduled}</td>
                              <td className="p-4 text-slate-600">{activity.responsible}</td>
                              <td className="p-4">
                                <div className="flex flex-wrap gap-1">
                                  {activity.areas.map((area, areaIndex) => (
                                    <Badge key={areaIndex} variant="outline" className="text-xs">
                                      {area}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge className={getPriorityColor(activity.priority)}>
                                  {activity.priority}
                                </Badge>
                              </td>
                              <td className="p-4 text-sm text-slate-600">{activity.resources}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Threat Assessment */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Threat Assessment</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {threatAssessment.map((threat, index) => (
                    <Card key={index} className="bg-white shadow-sm border-0 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{threat.threat}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getSeverityColor(threat.severity)}>
                              {threat.severity} severity
                            </Badge>
                            <span className={`text-sm font-medium ${getTrendColor(threat.trend)}`}>
                              {threat.trend}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <p className="text-xl font-bold text-red-600">{threat.incidents}</p>
                            <p className="text-xs text-slate-600">Incidents (30 days)</p>
                          </div>
                          <div className="text-center p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm font-bold text-slate-900">{threat.lastIncident}</p>
                            <p className="text-xs text-slate-600">Last Incident</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-slate-700 mb-2">Affected Areas:</p>
                          <div className="flex flex-wrap gap-1">
                            {threat.areas.map((area, areaIndex) => (
                              <Badge key={areaIndex} variant="secondary" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Mitigation Measures:</p>
                          <p className="text-sm text-slate-600">{threat.mitigation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Management Tools */}
              <Card className="bg-white shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span>Marine Protection Tools</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-5 w-5 mr-2" />
                      New Protection Area
                    </Button>
                    <Button variant="outline" className="h-16">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Compliance Report
                    </Button>
                    <Button variant="outline" className="h-16">
                      <Navigation className="h-5 w-5 mr-2" />
                      Marine Charts
                    </Button>
                    <Button variant="outline" className="h-16">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Threat Alerts
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