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
  TreePine, 
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
  Leaf,
  Satellite,
  AlertOctagon,
  DollarSign,
  Coins,
  MapPin
} from 'lucide-react';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

export default function ForestGuardPortal() {
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
    queryKey: ["/api/forest-guard/stats"],
  });

  const coreFeatures = [
    {
      id: 1,
      title: "Forest Dashboard",
      description: "Forest monitoring and deforestation alerts",
      icon: BarChart3,
      color: "bg-teal-500",
      route: "/forest-guard-dashboard"
    },
    {
      id: 2,
      title: "Satellite Forest Map",
      description: "Real-time satellite monitoring and alerts",
      icon: Satellite,
      color: "bg-green-500",
      features: ["Satellite Imagery", "Deforestation Alerts", "Forest Coverage Analysis"]
    },
    {
      id: 3,
      title: "Forest Registration",
      description: "Forest areas and conservation sites",
      icon: TreePine,
      color: "bg-blue-500",
      features: ["Forest Areas", "Protected Zones", "Community Forests"]
    },
    {
      id: 4,
      title: "Conservation Permits",
      description: "Logging and conservation permits",
      icon: FileText,
      color: "bg-purple-500",
      features: ["Logging Permits", "Conservation Licenses", "Sustainable Harvesting"]
    },
    {
      id: 5,
      title: "QR Forest Certificates",
      description: "Digital forest certificates and verification",
      icon: QrCode,
      color: "bg-red-500",
      features: ["Digital Certificates", "Origin Verification", "Chain of Custody"]
    },
    {
      id: 6,
      title: "Deforestation Monitoring",
      description: "Real-time deforestation detection and alerts",
      icon: AlertOctagon,
      color: "bg-orange-500",
      features: ["Real-time Alerts", "Change Detection", "Threat Assessment"]
    },
    {
      id: 7,
      title: "Document Management",
      description: "Forest permits and conservation documents",
      icon: Upload,
      color: "bg-indigo-500",
      features: ["Permit Upload", "Environmental Reports", "Photo Evidence"]
    },
    {
      id: 8,
      title: "Carbon Credit System",
      description: "Forest carbon credit management",
      icon: Coins,
      color: "bg-cyan-500",
      features: ["Carbon Credits", "REDD+ Programs", "Forest Carbon Accounting"]
    },
    {
      id: 9,
      title: "Mobile Forest Tools",
      description: "Offline forest monitoring and reporting",
      icon: Smartphone,
      color: "bg-pink-500",
      features: ["Offline Monitoring", "Field Reports", "GPS Forest Mapping"]
    },
    {
      id: 10,
      title: "Forest Analytics",
      description: "Forest health and conservation analytics",
      icon: TrendingUp,
      color: "bg-yellow-500",
      features: ["Forest Health Reports", "Biodiversity Analytics", "Conservation Impact"]
    }
  ];

  const userRoles = [
    { role: "Administrator", access: "Full system access", users: "National ICT, FDA Officials" },
    { role: "FDA Director", access: "All forest data", users: "Forestry Development Authority Directors" },
    { role: "Forest Ranger", access: "Field monitoring", users: "Forest Rangers, Conservation Officers" },
    { role: "Data Entry Officer", access: "Record creation", users: "County staff, Forest clerks" },
    { role: "Conservation Partners", access: "Conservation data", users: "NGOs, Environmental organizations" },
    { role: "Community Groups", access: "Community forest data", users: "Community leaders, Local cooperatives" }
  ];

  const integrationPoints = [
    { module: "BlueCarbon360", purpose: "Forest carbon credit trading and economics" },
    { module: "CarbonTrace", purpose: "Forest carbon footprint and REDD+ monitoring" },
    { module: "LiveTrace", purpose: "Livestock and forest interaction monitoring" },
    { module: "LandMap360", purpose: "Forest boundary and land use management" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Forest Guard - Forest Protection & Carbon Credits | Polipus Platform</title>
        <meta name="description" content="Advanced forest monitoring and conservation system for Liberian forest protection" />
      </Helmet>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src={agriTraceLogo} alt="LACRA Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Forest Guard</h1>
                <p className="text-sm text-slate-600">Forest Protection & Carbon Credits</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-teal-50 to-green-50 px-4 py-2 rounded-lg border border-teal-100">
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
              
              <div className="flex items-center space-x-2 border-l border-teal-200 pl-4">
                <Globe className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Forestry Development Authority</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto mb-6">
            <TreePine className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Forest Guard
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600">
              {" "}Forest Protection
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced forest monitoring, deforestation prevention, and carbon credit management 
            system for sustainable forest conservation in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/forest-guard-dashboard">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
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
              Register Forest Area
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Forest Areas</p>
                  <p className="text-3xl font-bold text-teal-600">{stats?.totalForestAreas || 0}</p>
                </div>
                <TreePine className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Protected Areas</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.protectedAreas || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Carbon Credits</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.carbonCredits || 0}</p>
                </div>
                <Coins className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Deforestation Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{stats?.deforestationAlerts || 0}</p>
                </div>
                <AlertOctagon className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Core Platform Features</h2>
              <p className="text-slate-600">Comprehensive forest protection capabilities</p>
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
                    <Shield className="h-5 w-5 text-teal-500" />
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
                    <Zap className="h-5 w-5 text-teal-500" />
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
              <span className="text-sm">Register Area</span>
            </Button>
            <Button 
              onClick={() => setIsPermitApplicationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Conservation Permit</span>
            </Button>
            <Link href="/forest-guard-dashboard">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
              <Satellite className="h-6 w-6" />
              <span className="text-sm">Satellite View</span>
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Forest Area</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Forest Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary Forest</SelectItem>
                    <SelectItem value="secondary">Secondary Forest</SelectItem>
                    <SelectItem value="community">Community Forest</SelectItem>
                    <SelectItem value="protected">Protected Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Forest ID</label>
                <Input placeholder="Auto-generated" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Forest Manager/Community</label>
              <Input placeholder="Enter manager or community name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">County</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sinoe">Sinoe</SelectItem>
                    <SelectItem value="grand-gedeh">Grand Gedeh</SelectItem>
                    <SelectItem value="maryland">Maryland</SelectItem>
                    <SelectItem value="river-cess">River Cess</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Area (hectares)</label>
                <Input placeholder="Enter forest area" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700">
                Register Forest Area
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