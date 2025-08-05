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
  Shield, 
  Globe, 
  QrCode, 
  FileText, 
  Users, 
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
  Mountain,
  HardHat,
  Truck,
  TreePine,
  Droplets,
  AlertOctagon
} from 'lucide-react';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

export default function MineWatchPortal() {
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
    queryKey: ["/api/mine-watch/stats"],
  });

  const coreFeatures = [
    {
      id: 1,
      title: "Mining Dashboard",
      description: "Operations summary and compliance alerts",
      icon: BarChart3,
      color: "bg-orange-500",
      route: "/mine-watch-dashboard"
    },
    {
      id: 2,
      title: "GIS Mining Map",
      description: "Real-time mining site monitoring",
      icon: Mountain,
      color: "bg-green-500",
      features: ["Site Mapping", "Extraction Zones", "Environmental Impact"]
    },
    {
      id: 3,
      title: "Mining Registration",
      description: "Mining companies and site registration",
      icon: HardHat,
      color: "bg-blue-500",
      features: ["Company Profiles", "Mining Sites", "Equipment Records"]
    },
    {
      id: 4,
      title: "Mining Permits",
      description: "License applications and approvals",
      icon: FileText,
      color: "bg-purple-500",
      features: ["License Applications", "Permit Tracking", "Renewal Management"]
    },
    {
      id: 5,
      title: "QR Mining Certificates",
      description: "Digital mining certificates and verification",
      icon: QrCode,
      color: "bg-red-500",
      features: ["Digital Certificates", "Site Verification", "Export Documentation"]
    },
    {
      id: 6,
      title: "Compliance Monitoring",
      description: "Environmental and safety compliance",
      icon: Shield,
      color: "bg-teal-500",
      features: ["Safety Inspections", "Environmental Monitoring", "Violation Tracking"]
    },
    {
      id: 7,
      title: "Document Management",
      description: "Mining licenses and safety documents",
      icon: Upload,
      color: "bg-indigo-500",
      features: ["License Upload", "Safety Records", "Environmental Reports"]
    },
    {
      id: 8,
      title: "Export Tracking",
      description: "Mineral export certification and tracking",
      icon: Truck,
      color: "bg-cyan-500",
      features: ["Export Permits", "Shipment Tracking", "Revenue Monitoring"]
    },
    {
      id: 9,
      title: "Mobile Field Tools",
      description: "Offline inspection and data collection",
      icon: Smartphone,
      color: "bg-pink-500",
      features: ["Offline Inspections", "Field Reports", "Photo Documentation"]
    },
    {
      id: 10,
      title: "Mining Analytics",
      description: "Production and compliance analytics",
      icon: TrendingUp,
      color: "bg-yellow-500",
      features: ["Production Reports", "Compliance Analytics", "Revenue Analytics"]
    }
  ];

  const userRoles = [
    { role: "Administrator", access: "Full system access", users: "National ICT, MoME Officials" },
    { role: "MoME Director", access: "All mining data", users: "Ministry of Mines Directors" },
    { role: "Mining Inspector", access: "Inspection and monitoring", users: "Field Inspectors, Safety Officers" },
    { role: "Data Entry Officer", access: "Record creation", users: "County staff, Mining clerks" },
    { role: "Environmental Partners", access: "Environmental data", users: "EPA, Environmental consultants" },
    { role: "Mining Operator", access: "Own operation data", users: "Mining companies, Concession holders" }
  ];

  const integrationPoints = [
    { module: "AquaTrace", purpose: "Water quality monitoring from mining activities" },
    { module: "CarbonTrace", purpose: "Mining carbon footprint and emissions tracking" },
    { module: "BlueCarbon360", purpose: "Environmental impact economic assessment" },
    { module: "LandMap360", purpose: "Mining concession boundary verification" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Mine Watch - Mineral Resource Protection | Polipus Platform</title>
        <meta name="description" content="Comprehensive mining operations monitoring and compliance system for Liberian mineral sector" />
      </Helmet>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src={agriTraceLogo} alt="LACRA Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Mine Watch</h1>
                <p className="text-sm text-slate-600">Mineral Resource Protection & Compliance</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-lg border border-orange-100">
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
              
              <div className="flex items-center space-x-2 border-l border-orange-200 pl-4">
                <Globe className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Ministry of Mines & Energy</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Mine Watch
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              {" "}Mineral Protection
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced mining operations monitoring, environmental compliance, and community protection 
            system for sustainable mineral resource management in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/mine-watch-dashboard">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
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
              Register Mining Site
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Mining Operations</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.totalOperations || 0}</p>
                </div>
                <Mountain className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Companies</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.activeCompanies || 0}</p>
                </div>
                <HardHat className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Compliance Rate</p>
                  <p className="text-3xl font-bold text-teal-600">{stats?.complianceRate || 0}%</p>
                </div>
                <Shield className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Recent Inspections</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.recentInspections || 0}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Core Platform Features</h2>
              <p className="text-slate-600">Comprehensive mining operations management</p>
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
                    <Shield className="h-5 w-5 text-orange-500" />
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
                    <Zap className="h-5 w-5 text-orange-500" />
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
              <span className="text-sm">Register Site</span>
            </Button>
            <Button 
              onClick={() => setIsPermitApplicationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Apply License</span>
            </Button>
            <Link href="/mine-watch-dashboard">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
              <QrCode className="h-6 w-6" />
              <span className="text-sm">Verify Site</span>
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Mining Site</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Mining Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold Mining</SelectItem>
                    <SelectItem value="diamond">Diamond Mining</SelectItem>
                    <SelectItem value="iron">Iron Ore</SelectItem>
                    <SelectItem value="bauxite">Bauxite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Site ID</label>
                <Input placeholder="Auto-generated" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Company/Operator</label>
              <Input placeholder="Enter company name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">County</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bong">Bong</SelectItem>
                    <SelectItem value="nimba">Nimba</SelectItem>
                    <SelectItem value="lofa">Lofa</SelectItem>
                    <SelectItem value="grand-cape-mount">Grand Cape Mount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Concession Area (hectares)</label>
                <Input placeholder="Enter area size" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Register Mining Site
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