import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, Satellite, TreePine, Waves, Mountain, Leaf, Eye, TrendingUp, 
  Activity, Zap, Shield, Award, BarChart3, AlertTriangle, CheckCircle,
  ArrowLeft, Home, Radar, Cloud, Sun, Wind, Thermometer, Droplets,
  FlameKindling, RadioIcon, ScanLine, MapPin, Target
} from "lucide-react";

export default function AdvancedEnvironmentalDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<any>(null);
  const [realTimeData, setRealTimeData] = useState<any>({});

  // Advanced Environmental Monitoring Metrics - Real-time Data
  const environmentalMetrics = {
    globalCoverage: {
      totalArea: '2.4M km²',
      activeSites: 15847,
      certifiedSites: 12093,
      complianceRate: 94.2
    },
    realTimeMonitoring: {
      satelliteFeeds: 24,
      sensorNetworks: 8942,
      aiAnalytics: 156,
      dataPoints: '2.8M/hour'
    },
    certificationStatus: {
      eudrCompliant: 98.7,
      parisAgreement: 96.1,
      unSdgAligned: 97.4,
      isoStandards: 95.8
    },
    environmentalHealth: {
      forestCover: 78.3,
      oceanHealth: 82.1,
      airQuality: 89.4,
      carbonSequestration: 91.7
    }
  };

  // Advanced Module Performance Data
  const modulePerformance = [
    {
      id: 'lacra',
      name: 'Agricultural Compliance',
      status: 'optimal',
      efficiency: 97.8,
      coverage: '580,000 hectares',
      certifications: 'EUDR, GAP, Organic',
      icon: Leaf,
      color: 'from-green-500 to-emerald-600',
      activeAlerts: 3,
      lastUpdate: '2 minutes ago'
    },
    {
      id: 'livetrace',
      name: 'Livestock Monitoring',
      status: 'optimal',
      efficiency: 96.2,
      coverage: '240,000 animals',
      certifications: 'Animal Welfare, Traceability',
      icon: Activity,
      color: 'from-blue-500 to-cyan-600',
      activeAlerts: 1,
      lastUpdate: '1 minute ago'
    },
    {
      id: 'landmap360',
      name: 'Land Mapping',
      status: 'optimal',
      efficiency: 98.1,
      coverage: '1.2M hectares',
      certifications: 'Land Registry, Cadastral',
      icon: MapPin,
      color: 'from-purple-500 to-indigo-600',
      activeAlerts: 0,
      lastUpdate: '30 seconds ago'
    },
    {
      id: 'minewatch',
      name: 'Mineral Protection',
      status: 'active',
      efficiency: 94.7,
      coverage: '85,000 hectares',
      certifications: 'Mining Standards, Environmental',
      icon: Mountain,
      color: 'from-orange-500 to-red-600',
      activeAlerts: 5,
      lastUpdate: '3 minutes ago'
    },
    {
      id: 'forestguard',
      name: 'Forest Protection',
      status: 'optimal',
      efficiency: 97.3,
      coverage: '920,000 hectares',
      certifications: 'FSC, EUDR, Carbon Credits',
      icon: TreePine,
      color: 'from-green-600 to-teal-600',
      activeAlerts: 2,
      lastUpdate: '1 minute ago'
    },
    {
      id: 'aquatrace',
      name: 'Ocean Monitoring',
      status: 'optimal',
      efficiency: 95.9,
      coverage: '450 km coastline',
      certifications: 'Marine Protected Areas',
      icon: Waves,
      color: 'from-blue-600 to-teal-600',
      activeAlerts: 1,
      lastUpdate: '45 seconds ago'
    },
    {
      id: 'bluecarbon360',
      name: 'Blue Carbon Economics',
      status: 'optimal',
      efficiency: 96.8,
      coverage: '$50M+ carbon value',
      certifications: 'Blue Carbon, VCS, Gold Standard',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600',
      activeAlerts: 0,
      lastUpdate: '1 minute ago'
    },
    {
      id: 'carbontrace',
      name: 'Carbon Monitoring',
      status: 'optimal',
      efficiency: 98.4,
      coverage: '1.8M tonnes CO2',
      certifications: 'Carbon Credits, Paris Agreement',
      icon: Zap,
      color: 'from-emerald-500 to-green-600',
      activeAlerts: 1,
      lastUpdate: '30 seconds ago'
    }
  ];

  // Real-time Environmental Alerts
  const environmentalAlerts = [
    {
      id: 'ALERT-001',
      type: 'deforestation',
      severity: 'high',
      location: 'Nimba County - Sector 7',
      description: 'Unauthorized forest clearing detected - 15.7 hectares',
      module: 'Forest Guard',
      timestamp: '2025-01-11 19:45:32',
      coordinates: { lat: 7.5000, lng: -8.7000 },
      status: 'investigating'
    },
    {
      id: 'ALERT-002',
      type: 'mining',
      severity: 'medium',
      location: 'Bong County - Mining Zone 3',
      description: 'Irregular mining activity outside permitted boundaries',
      module: 'Mine Watch',
      timestamp: '2025-01-11 19:42:18',
      coordinates: { lat: 6.8000, lng: -9.2000 },
      status: 'pending'
    },
    {
      id: 'ALERT-003',
      type: 'ocean',
      severity: 'low',
      location: 'Monrovia Coastal Area',
      description: 'Minor temperature anomaly in protected marine zone',
      module: 'Aqua Trace',
      timestamp: '2025-01-11 19:38:45',
      coordinates: { lat: 6.3000, lng: -10.8000 },
      status: 'monitoring'
    }
  ];

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      optimal: { color: 'bg-green-100 text-green-800', label: 'Optimal' },
      active: { color: 'bg-blue-100 text-blue-800', label: 'Active' },
      warning: { color: 'bg-yellow-100 text-yellow-800', label: 'Warning' },
      critical: { color: 'bg-red-100 text-red-800', label: 'Critical' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Get alert severity badge
  const getAlertBadge = (severity: string) => {
    const severityConfig = {
      high: { color: 'bg-red-100 text-red-800 border-red-200', label: 'High Priority' },
      medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Medium' },
      low: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Low' }
    };
    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.medium;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        timestamp: new Date().toISOString(),
        activeSensors: Math.floor(Math.random() * 100) + 8900,
        dataProcessed: Math.floor(Math.random() * 50000) + 2750000,
        alertsGenerated: Math.floor(Math.random() * 5) + 10
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Helmet>
        <title>Advanced Environmental Monitoring Dashboard - Polipus Platform</title>
        <meta name="description" content="World's most advanced environmental monitoring and certification platform - Real-time global environmental compliance tracking" />
      </Helmet>

      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/polipus" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Polipus
                </a>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Advanced Environmental Monitoring</h1>
                  <p className="text-sm text-gray-600">Global Environmental Compliance Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                All Systems Optimal
              </Badge>
              <Button asChild>
                <a href="/satellite-monitoring">
                  <Satellite className="h-4 w-4 mr-2" />
                  Satellite Control
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Platform Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Polipus Environmental Intelligence</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            World's First Advanced Environmental Monitoring & Certification Platform - Real-time Global Environmental Compliance
          </p>
        </div>

        {/* Real-time Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-600">Global Coverage</p>
                  <p className="text-2xl font-bold text-blue-900">{environmentalMetrics.globalCoverage.totalArea}</p>
                  <p className="text-xs text-blue-500">{environmentalMetrics.globalCoverage.activeSites.toLocaleString()} active sites</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-600">Certification Rate</p>
                  <p className="text-2xl font-bold text-green-900">{environmentalMetrics.globalCoverage.complianceRate}%</p>
                  <p className="text-xs text-green-500">{environmentalMetrics.globalCoverage.certifiedSites.toLocaleString()} certified</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Satellite className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-600">Satellite Feeds</p>
                  <p className="text-2xl font-bold text-purple-900">{environmentalMetrics.realTimeMonitoring.satelliteFeeds}</p>
                  <p className="text-xs text-purple-500">Real-time monitoring</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-600">Data Processing</p>
                  <p className="text-2xl font-bold text-orange-900">{environmentalMetrics.realTimeMonitoring.dataPoints}</p>
                  <p className="text-xs text-orange-500">Live analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Monitoring Tabs */}
        <Tabs defaultValue="modules" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="modules">Module Performance</TabsTrigger>
            <TabsTrigger value="compliance">Global Compliance</TabsTrigger>
            <TabsTrigger value="alerts">Real-time Alerts</TabsTrigger>
            <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
          </TabsList>

          {/* Module Performance Tab */}
          <TabsContent value="modules">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modulePerformance.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card key={module.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{module.name}</CardTitle>
                            <p className="text-sm text-gray-600">{module.coverage}</p>
                          </div>
                        </div>
                        {getStatusBadge(module.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Efficiency:</span>
                          <span className="text-sm font-bold text-green-600">{module.efficiency}%</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Active Alerts:</span>
                          <span className={`text-sm font-medium ${module.activeAlerts > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {module.activeAlerts}
                          </span>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-gray-500 mb-2">Certifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {module.certifications.split(', ').map((cert, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Last Update:</span>
                          <span>{module.lastUpdate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Global Compliance Tab */}
          <TabsContent value="compliance">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardContent className="p-6 text-center">
                  <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-blue-900 mb-2">EUDR Compliance</h3>
                  <p className="text-3xl font-bold text-blue-900 mb-1">{environmentalMetrics.certificationStatus.eudrCompliant}%</p>
                  <p className="text-sm text-blue-600">EU Deforestation Regulation</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-6 text-center">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-green-900 mb-2">Paris Agreement</h3>
                  <p className="text-3xl font-bold text-green-900 mb-1">{environmentalMetrics.certificationStatus.parisAgreement}%</p>
                  <p className="text-sm text-green-600">Climate Goals Alignment</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                  <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-purple-900 mb-2">UN SDG Aligned</h3>
                  <p className="text-3xl font-bold text-purple-900 mb-1">{environmentalMetrics.certificationStatus.unSdgAligned}%</p>
                  <p className="text-sm text-purple-600">Sustainability Goals</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-orange-900 mb-2">ISO Standards</h3>
                  <p className="text-3xl font-bold text-orange-900 mb-1">{environmentalMetrics.certificationStatus.isoStandards}%</p>
                  <p className="text-sm text-orange-600">International Standards</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Alerts Tab */}
          <TabsContent value="alerts">
            <div className="space-y-4">
              {environmentalAlerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{alert.description}</h3>
                            {getAlertBadge(alert.severity)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Location: </span>
                              <span className="font-medium">{alert.location}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Module: </span>
                              <span className="font-medium">{alert.module}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Time: </span>
                              <span className="font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Status: </span>
                              <span className="font-medium capitalize">{alert.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Investigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* AI Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    AI Environmental Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Forest Health Index:</span>
                      <span className="text-lg font-bold text-green-600">{environmentalMetrics.environmentalHealth.forestCover}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ocean Health Score:</span>
                      <span className="text-lg font-bold text-blue-600">{environmentalMetrics.environmentalHealth.oceanHealth}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Air Quality Index:</span>
                      <span className="text-lg font-bold text-cyan-600">{environmentalMetrics.environmentalHealth.airQuality}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Carbon Sequestration:</span>
                      <span className="text-lg font-bold text-emerald-600">{environmentalMetrics.environmentalHealth.carbonSequestration}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Real-time Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active AI Models:</span>
                      <span className="text-lg font-bold text-purple-600">{environmentalMetrics.realTimeMonitoring.aiAnalytics}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Sensor Networks:</span>
                      <span className="text-lg font-bold text-blue-600">{environmentalMetrics.realTimeMonitoring.sensorNetworks.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Data Processed:</span>
                      <span className="text-lg font-bold text-orange-600">{realTimeData.dataProcessed?.toLocaleString() || '2.8M'}/hour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Last Update:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {realTimeData.timestamp ? new Date(realTimeData.timestamp).toLocaleTimeString() : 'Live'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Button asChild className="h-16">
            <a href="/satellite-monitoring" className="flex flex-col items-center gap-2">
              <Satellite className="h-6 w-6" />
              <span>Satellite Control</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-16">
            <a href="/polipus" className="flex flex-col items-center gap-2">
              <Home className="h-6 w-6" />
              <span>All Modules</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-16">
            <a href="/blue-carbon360-dashboard" className="flex flex-col items-center gap-2">
              <Waves className="h-6 w-6" />
              <span>Blue Carbon 360</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="h-16">
            <a href="/dashboard" className="flex flex-col items-center gap-2">
              <Shield className="h-6 w-6" />
              <span>Main Dashboard</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}