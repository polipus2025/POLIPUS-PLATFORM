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
  MapPin, 
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
  Layers,
  Navigation,
  Compass,
  Map,
  Scale,
  Ruler
} from 'lucide-react';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

export default function LandMap360Portal() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPermitApplicationOpen, setIsPermitApplicationOpen] = useState(false);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather simulation
  const [weather] = useState({
    temperature: "28°C",
    condition: "Partly Cloudy",
    location: "Monrovia, Liberia"
  });

  // Core Features Data
  const { data: stats } = useQuery({
    queryKey: ["/api/land-map360/stats"],
  });

  // Core modules as per framework
  const coreFeatures = [
    {
      id: 1,
      title: "User Dashboard",
      description: "Land management summary and notifications",
      icon: BarChart3,
      color: "bg-purple-500",
      route: "/land-map360-dashboard"
    },
    {
      id: 2,
      title: "Interactive GIS Map",
      description: "Real-time land boundary visualization",
      icon: Map,
      color: "bg-green-500",
      features: ["Satellite Imagery", "Boundary Mapping", "Conflict Detection"]
    },
    {
      id: 3,
      title: "Land Registration",
      description: "Property owners and parcel registration",
      icon: Globe,
      color: "bg-blue-500",
      features: ["Owner Profiles", "Parcel Records", "Title Documentation"]
    },
    {
      id: 4,
      title: "Survey & Permits",
      description: "Land survey applications and approvals",
      icon: FileText,
      color: "bg-orange-500",
      features: ["Survey Requests", "Permit Tracking", "Legal Documentation"]
    },
    {
      id: 5,
      title: "QR Land Certificates",
      description: "Digital land certificates with QR codes",
      icon: QrCode,
      color: "bg-red-500",
      features: ["Digital Certificates", "Ownership Verification", "Transfer Records"]
    },
    {
      id: 6,
      title: "Dispute Resolution",
      description: "Land conflict monitoring and resolution",
      icon: Shield,
      color: "bg-teal-500",
      features: ["Conflict Detection", "Mediation Process", "Resolution Tracking"]
    },
    {
      id: 7,
      title: "Document Management",
      description: "Land documents and evidence storage",
      icon: Upload,
      color: "bg-indigo-500",
      features: ["Document Upload", "Evidence Management", "Photo Documentation"]
    },
    {
      id: 8,
      title: "Boundary Surveying",
      description: "Professional land surveying tools",
      icon: Compass,
      color: "bg-cyan-500",
      features: ["GPS Surveying", "Boundary Marking", "Area Calculation"]
    },
    {
      id: 9,
      title: "Mobile Field Tools",
      description: "Offline surveying and data collection",
      icon: Smartphone,
      color: "bg-pink-500",
      features: ["Offline Mapping", "Field Data Collection", "GPS Integration"]
    },
    {
      id: 10,
      title: "Land Analytics",
      description: "Property analytics and reporting",
      icon: TrendingUp,
      color: "bg-yellow-500",
      features: ["Usage Analytics", "Conflict Reports", "Ownership Statistics"]
    }
  ];

  // User roles as per framework
  const userRoles = [
    { role: "Administrator", access: "Full system access", users: "National ICT, LLA Officials" },
    { role: "LLA Director", access: "All land data", users: "Liberia Land Authority Directors" },
    { role: "Survey Officer", access: "Survey and mapping", users: "Licensed Surveyors, Field Officers" },
    { role: "Data Entry Officer", access: "Record creation", users: "County staff, Registration clerks" },
    { role: "Legal Partners", access: "View legal documents", users: "Law firms, Legal advisors" },
    { role: "Property Owner", access: "Own property data", users: "Landowners, Community leaders" }
  ];

  // Integration points
  const integrationPoints = [
    { module: "MineWatch", purpose: "Mining concession boundary verification" },
    { module: "ForestGuard", purpose: "Forest reserve boundary management" },
    { module: "AquaTrace", purpose: "Coastal and water boundary mapping" },
    { module: "LLA System", purpose: "Official land registry integration" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Land Map360 - Land Mapping & Dispute Prevention | Polipus Platform</title>
        <meta name="description" content="Comprehensive land mapping and boundary management system for Liberian land administration" />
      </Helmet>

      {/* Header - AgriTrace Style */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src={agriTraceLogo} alt="LACRA Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Land Map360</h1>
                <p className="text-sm text-slate-600">Land Mapping & Dispute Prevention</p>
              </div>
            </div>
            
            {/* Time and Weather */}
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-purple-50 to-blue-50 px-4 py-2 rounded-lg border border-purple-100">
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
              
              <div className="flex items-center space-x-2 border-l border-purple-200 pl-4">
                <Globe className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Liberia Land Authority</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-purple-500 flex items-center justify-center mx-auto mb-6">
            <MapPin className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Land Map360
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              {" "}Digital Land Management
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced land mapping, boundary management, and dispute prevention system 
            for secure property rights and transparent land administration in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/land-map360-dashboard">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2">
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
              Register Land Parcel
            </Button>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Land Parcels</p>
                  <p className="text-3xl font-bold text-purple-600">{stats?.totalParcels || 0}</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Registered Owners</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.registeredOwners || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Resolved Disputes</p>
                  <p className="text-3xl font-bold text-teal-600">{stats?.resolvedDisputes || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Surveys</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.activeSurveys || 0}</p>
                </div>
                <Compass className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Features Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Core Platform Features</h2>
              <p className="text-slate-600">Comprehensive land management capabilities</p>
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

        {/* User Roles Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">User Access Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRoles.map((role, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
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

        {/* Integration Points */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">Cross-Module Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrationPoints.map((integration, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
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

        {/* Quick Actions */}
        <div className="isms-card">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => setIsRegistrationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Register</span>
            </Button>
            <Button 
              onClick={() => setIsPermitApplicationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Survey Request</span>
            </Button>
            <Link href="/land-map360-dashboard">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
              <QrCode className="h-6 w-6" />
              <span className="text-sm">Verify Title</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Registration Dialog */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Land Parcel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Land Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Parcel ID</label>
                <Input placeholder="Auto-generated" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Property Owner</label>
              <Input placeholder="Enter owner name" />
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
                    <SelectItem value="nimba">Nimba</SelectItem>
                    <SelectItem value="bong">Bong</SelectItem>
                    <SelectItem value="lofa">Lofa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Area (hectares)</label>
                <Input placeholder="Enter land area" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Register Parcel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Back to Platform */}
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