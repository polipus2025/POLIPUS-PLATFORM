import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Users, 
  MapPin, 
  QrCode, 
  FileText, 
  Shield, 
  Truck, 
  Camera, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Globe,
  Smartphone,
  Activity,
  Database,
  Eye,
  Plus,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Bell,
  Settings,
  Zap
} from 'lucide-react';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

export default function LiveTracePortal() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isPermitApplicationOpen, setIsPermitApplicationOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
  const { data: livestockData = [] } = useQuery({
    queryKey: ["/api/livestock"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/live-trace/stats"],
  });

  // Core modules as per framework
  const coreFeatures = [
    {
      id: 1,
      title: "User Dashboard",
      description: "Summary cards, notifications, and task management",
      icon: BarChart3,
      color: "bg-blue-500",
      route: "/live-trace-dashboard"
    },
    {
      id: 2,
      title: "GIS Map View",
      description: "Real-time data layers and livestock tracking",
      icon: MapPin,
      color: "bg-green-500",
      features: ["GPS Tracking", "Geofencing", "Route Optimization"]
    },
    {
      id: 3,
      title: "Registration & Profiling",
      description: "Farmers, cooperatives, and livestock registration",
      icon: Users,
      color: "bg-purple-500",
      features: ["Farmer Profiles", "Livestock Records", "Cooperative Management"]
    },
    {
      id: 4,
      title: "Permit Application",
      description: "Livestock movement and breeding permits",
      icon: FileText,
      color: "bg-orange-500",
      features: ["Application Tracking", "Approval Workflow", "Document Management"]
    },
    {
      id: 5,
      title: "QR Code System",
      description: "Generation and verification for livestock",
      icon: QrCode,
      color: "bg-red-500",
      features: ["Unique ID Generation", "Batch Processing", "Mobile Scanning"]
    },
    {
      id: 6,
      title: "Compliance Monitoring",
      description: "Health checks, vaccinations, and site visits",
      icon: Shield,
      color: "bg-teal-500",
      features: ["Health Records", "Vaccination Tracking", "Compliance Alerts"]
    },
    {
      id: 7,
      title: "Document Management",
      description: "Upload and verify IDs, licenses, and photos",
      icon: Upload,
      color: "bg-indigo-500",
      features: ["Document Upload", "Verification Process", "Photo Documentation"]
    },
    {
      id: 8,
      title: "Export Tracking",
      description: "Livestock export certification and tracking",
      icon: Truck,
      color: "bg-cyan-500",
      features: ["Export Permits", "Movement Tracking", "Certification"]
    },
    {
      id: 9,
      title: "Mobile Field Sync",
      description: "Offline data collection and synchronization",
      icon: Smartphone,
      color: "bg-pink-500",
      features: ["Offline Mode", "Field Data Collection", "Auto Sync"]
    },
    {
      id: 10,
      title: "Analytics & Reporting",
      description: "Comprehensive reporting and data analysis",
      icon: TrendingUp,
      color: "bg-yellow-500",
      features: ["Performance Analytics", "Compliance Reports", "Export Analytics"]
    }
  ];

  // User roles as per framework
  const userRoles = [
    { role: "Administrator", access: "Full system access", users: "National ICT, Super Admin" },
    { role: "Ministry Director", access: "All ministry data", users: "MoA, NaFAA Directors" },
    { role: "Compliance Officer", access: "View/edit records", users: "Field Inspectors, Agents" },
    { role: "Data Entry Officer", access: "Create records only", users: "County staff, Agri agents" },
    { role: "External Partners", access: "View-only limited", users: "NGOs, donors, certification bodies" },
    { role: "Farmer/Operator", access: "Submit own data", users: "Livestock farmers, cooperatives" }
  ];

  // Integration points
  const integrationPoints = [
    { module: "AgriTrace360", purpose: "Export validation, carbon credit eligibility" },
    { module: "LandMap360", purpose: "Grazing land verification, boundary management" },
    { module: "ForestGuard", purpose: "Deforestation monitoring, environmental compliance" },
    { module: "CarbonTrace", purpose: "Livestock carbon footprint tracking" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Live Trace - Livestock Monitoring | Polipus Platform</title>
        <meta name="description" content="Comprehensive livestock monitoring and traceability system for Liberian agricultural sector" />
      </Helmet>

      {/* Header - AgriTrace Style */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src={agriTraceLogo} alt="LACRA Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Live Trace</h1>
                <p className="text-sm text-slate-600">Livestock Monitoring & Traceability</p>
              </div>
            </div>
            
            {/* Time and Weather */}
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-blue-50 to-green-50 px-4 py-2 rounded-lg border border-blue-100">
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
              
              <div className="flex items-center space-x-2 border-l border-blue-200 pl-4">
                <Globe className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Ministry of Agriculture</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Hero Section */}
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center mx-auto mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Live Trace
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {" "}Livestock Monitoring
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Comprehensive livestock tracking, health monitoring, and compliance management system 
            for Liberian farmers and agricultural cooperatives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/live-trace-dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" data-testid="button-access-dashboard">
                <Activity className="h-5 w-5" />
                Access Dashboard
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setIsRegistrationOpen(true)}
              data-testid="button-register-livestock"
            >
              <Plus className="h-4 w-4" />
              Register Livestock
            </Button>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Livestock</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.totalAnimals || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Farmers</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.activeFarmers || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Health Compliant</p>
                  <p className="text-3xl font-bold text-teal-600">{stats?.healthCompliant || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Recent Movements</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.recentMovements || 0}</p>
                </div>
                <Truck className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Features Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Core Platform Features</h2>
              <p className="text-slate-600">Comprehensive livestock management capabilities</p>
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
                    <Shield className="h-5 w-5 text-blue-500" />
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
              <span className="text-sm">Apply Permit</span>
            </Button>
            <Link href="/live-trace-dashboard">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
              <QrCode className="h-6 w-6" />
              <span className="text-sm">Scan QR</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Registration Dialog */}
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Livestock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Animal Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cattle">Cattle</SelectItem>
                    <SelectItem value="goat">Goat</SelectItem>
                    <SelectItem value="sheep">Sheep</SelectItem>
                    <SelectItem value="pig">Pig</SelectItem>
                    <SelectItem value="chicken">Chicken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Animal ID</label>
                <Input placeholder="Enter unique ID" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Owner/Farmer</label>
              <Input placeholder="Enter farmer name" />
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
                <label className="text-sm font-medium">GPS Coordinates</label>
                <Input placeholder="Auto-detect or enter manually" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Register Livestock
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