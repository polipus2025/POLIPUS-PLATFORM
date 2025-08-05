import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Leaf, 
  Globe, 
  QrCode, 
  FileText, 
  Shield, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Smartphone,
  Activity,
  Eye,
  Plus,
  BarChart3,
  TrendingUp,
  Settings,
  Zap,
  Cloud,
  Factory,
  TreePine,
  Recycle,
  Target,
  Thermometer
} from 'lucide-react';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

export default function CarbonTracePortal() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPermitApplicationOpen, setIsPermitApplicationOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [weather] = useState({
    temperature: "28°C",
    condition: "Partly Cloudy",
    location: "Monrovia, Liberia"
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/carbon-trace/stats"],
  });

  const coreFeatures = [
    {
      id: 1,
      title: "Carbon Dashboard",
      description: "Environmental monitoring and emission tracking",
      icon: BarChart3,
      color: "bg-green-500",
      route: "/carbon-trace-dashboard"
    },
    {
      id: 2,
      title: "Emission Monitoring Map",
      description: "Real-time carbon emission tracking",
      icon: Cloud,
      color: "bg-blue-500",
      features: ["Emission Tracking", "Source Monitoring", "Real-time Alerts"]
    },
    {
      id: 3,
      title: "Source Registration",
      description: "Emission sources and carbon projects",
      icon: Factory,
      color: "bg-red-500",
      features: ["Industrial Sources", "Carbon Projects", "Offset Programs"]
    },
    {
      id: 4,
      title: "Carbon Permits",
      description: "Carbon credit and offset permits",
      icon: FileText,
      color: "bg-purple-500",
      features: ["Offset Applications", "Credit Permits", "Compliance Tracking"]
    },
    {
      id: 5,
      title: "QR Carbon Certificates",
      description: "Digital carbon certificates and verification",
      icon: QrCode,
      color: "bg-orange-500",
      features: ["Digital Certificates", "Offset Verification", "Trading Records"]
    },
    {
      id: 6,
      title: "Environmental Compliance",
      description: "Carbon compliance monitoring and alerts",
      icon: Shield,
      color: "bg-teal-500",
      features: ["Compliance Monitoring", "Environmental Alerts", "Regulation Tracking"]
    },
    {
      id: 7,
      title: "Document Management",
      description: "Carbon and environmental documents",
      icon: Upload,
      color: "bg-indigo-500",
      features: ["Carbon Reports", "Environmental Studies", "Compliance Documents"]
    },
    {
      id: 8,
      title: "Carbon Offset Tracking",
      description: "Carbon offset project monitoring",
      icon: Recycle,
      color: "bg-cyan-500",
      features: ["Offset Projects", "Impact Tracking", "Verification System"]
    },
    {
      id: 9,
      title: "Mobile Carbon Tools",
      description: "Field carbon measurement and reporting",
      icon: Smartphone,
      color: "bg-pink-500",
      features: ["Field Measurements", "Emission Reports", "Mobile Monitoring"]
    },
    {
      id: 10,
      title: "Carbon Analytics",
      description: "Environmental impact and carbon analytics",
      icon: TrendingUp,
      color: "bg-yellow-500",
      features: ["Emission Analytics", "Impact Reports", "Carbon Footprint Analysis"]
    }
  ];

  const userRoles = [
    { role: "Administrator", access: "Full system access", users: "National ICT, EPA Officials" },
    { role: "EPA Director", access: "All environmental data", users: "Environmental Protection Agency Directors" },
    { role: "Environmental Officer", access: "Monitoring and compliance", users: "Environmental Officers, Carbon Auditors" },
    { role: "Data Entry Officer", access: "Record creation", users: "Environmental clerks, Carbon assistants" },
    { role: "Industry Partners", access: "Company emission data", users: "Industrial companies, Carbon traders" },
    { role: "Research Institutions", access: "Research data", users: "Universities, Environmental researchers" }
  ];

  const integrationPoints = [
    { module: "LiveTrace", purpose: "Livestock carbon footprint and methane emission tracking" },
    { module: "MineWatch", purpose: "Mining carbon emissions and environmental impact" },
    { module: "ForestGuard", purpose: "Forest carbon sequestration and REDD+ programs" },
    { module: "BlueCarbon360", purpose: "Carbon credit trading and offset verification" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Carbon Trace - Environmental Monitoring & Carbon Credits | Polipus Platform</title>
        <meta name="description" content="Comprehensive carbon emission monitoring and environmental compliance system for Liberia" />
      </Helmet>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src={agriTraceLogo} alt="LACRA Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Carbon Trace</h1>
                <p className="text-sm text-slate-600">Environmental Monitoring & Carbon Credits</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-lg border border-green-100">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border-l border-green-200 pl-4">
                <Globe className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Environmental Protection Agency</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center mx-auto mb-6">
            <Leaf className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Carbon Trace
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              {" "}Environmental Monitoring
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced carbon emission monitoring, environmental compliance tracking, and carbon credit 
            certification system for sustainable environmental management in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/carbon-trace-dashboard">
              <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Access Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsRegistrationOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Register Emission Source
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Emission Sources</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.totalSources || 0}</p>
                </div>
                <Factory className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Sources</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.activeSources || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Carbon Offsets</p>
                  <p className="text-3xl font-bold text-teal-600">{stats?.carbonOffsets || 0}</p>
                </div>
                <Recycle className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Environmental Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{stats?.environmentalAlerts || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Core Platform Features</h2>
              <p className="text-slate-600">Comprehensive environmental monitoring capabilities</p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 mr-1" />
              All Systems Operational
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">{feature.description}</p>
                    {feature.features && (
                      <div className="space-y-2">
                        {feature.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {feature.route && (
                      <Link href={feature.route}>
                        <Button className="w-full mt-4" variant="outline">
                          Access Module
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">User Access Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRoles.map((role, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    {role.role}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-2"><strong>Access:</strong> {role.access}</p>
                  <p className="text-slate-600"><strong>Users:</strong> {role.users}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Cross-Module Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationPoints.map((integration, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    {integration.module}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{integration.purpose}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="isms-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => setIsRegistrationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Register Source</span>
            </Button>
            <Button 
              onClick={() => setIsPermitApplicationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Carbon Permit</span>
            </Button>
            <Link href="/carbon-trace-dashboard">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
              <Cloud className="h-6 w-6" />
              <span className="text-sm">Monitor Emissions</span>
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Emission Source</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Source Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="industrial">Industrial Facility</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="energy">Energy Production</SelectItem>
                    <SelectItem value="agriculture">Agricultural</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Source ID</label>
                <Input placeholder="Auto-generated" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Source Name/Company</label>
              <Input placeholder="Enter source name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">County</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="montserrado">Montserrado</SelectItem>
                    <SelectItem value="margibi">Margibi</SelectItem>
                    <SelectItem value="bong">Bong</SelectItem>
                    <SelectItem value="nimba">Nimba</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Estimated Annual Emissions (tCO2e)</label>
                <Input placeholder="Enter emission estimate" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Register Emission Source
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-6 left-6">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 bg-white shadow-lg">
            <ArrowLeft className="h-4 w-4" />
            Back to Platform
          </Button>
        </Link>
      </div>
    </div>
  );
}