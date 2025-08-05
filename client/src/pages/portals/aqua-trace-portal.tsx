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
  Waves, 
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
  Fish,
  Anchor,
  Ship,
  Droplets,
  AlertOctagon,
  MapPin
} from 'lucide-react';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

export default function AquaTracePortal() {
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
    queryKey: ["/api/aqua-trace/stats"],
  });

  const coreFeatures = [
    {
      id: 1,
      title: "Marine Dashboard",
      description: "Ocean and river monitoring overview",
      icon: BarChart3,
      color: "bg-indigo-500",
      route: "/aqua-trace-dashboard"
    },
    {
      id: 2,
      title: "Water Quality Map",
      description: "Real-time water quality monitoring",
      icon: Droplets,
      color: "bg-blue-500",
      features: ["Water Quality Sensors", "Pollution Detection", "Marine Health Monitoring"]
    },
    {
      id: 3,
      title: "Marine Registration",
      description: "Vessels, fishing communities, and operators",
      icon: Ship,
      color: "bg-cyan-500",
      features: ["Vessel Registration", "Fishing Communities", "Marine Operators"]
    },
    {
      id: 4,
      title: "Fishing Permits",
      description: "Fishing licenses and marine permits",
      icon: FileText,
      color: "bg-purple-500",
      features: ["Fishing Licenses", "Marine Protected Areas", "Sustainable Quotas"]
    },
    {
      id: 5,
      title: "QR Marine Certificates",
      description: "Digital marine certificates and verification",
      icon: QrCode,
      color: "bg-red-500",
      features: ["Digital Certificates", "Catch Verification", "Traceability Codes"]
    },
    {
      id: 6,
      title: "Marine Protection",
      description: "Protected area monitoring and enforcement",
      icon: Shield,
      color: "bg-teal-500",
      features: ["Protected Areas", "Illegal Fishing Detection", "Marine Conservation"]
    },
    {
      id: 7,
      title: "Document Management",
      description: "Marine permits and environmental documents",
      icon: Upload,
      color: "bg-green-500",
      features: ["Permit Upload", "Environmental Impact", "Catch Documentation"]
    },
    {
      id: 8,
      title: "Catch Tracking",
      description: "Fish catch monitoring and export tracking",
      icon: Fish,
      color: "bg-orange-500",
      features: ["Catch Records", "Export Tracking", "Species Monitoring"]
    },
    {
      id: 9,
      title: "Mobile Marine Tools",
      description: "Offshore monitoring and data collection",
      icon: Smartphone,
      color: "bg-pink-500",
      features: ["Offshore Monitoring", "Vessel Tracking", "Mobile Reporting"]
    },
    {
      id: 10,
      title: "Marine Analytics",
      description: "Ocean health and fisheries analytics",
      icon: TrendingUp,
      color: "bg-yellow-500",
      features: ["Fisheries Reports", "Ocean Health Analytics", "Sustainability Metrics"]
    }
  ];

  const userRoles = [
    { role: "Administrator", access: "Full system access", users: "National ICT, NaFAA Officials" },
    { role: "NaFAA Director", access: "All marine data", users: "National Fisheries Authority Directors" },
    { role: "Marine Inspector", access: "Monitoring and enforcement", users: "Marine Inspectors, Coast Guard" },
    { role: "Data Entry Officer", access: "Record creation", users: "Coastal staff, Marine clerks" },
    { role: "Research Partners", access: "Research data", users: "Marine research institutes, Universities" },
    { role: "Fishing Community", access: "Community fishing data", users: "Fishers, Community leaders, Cooperatives" }
  ];

  const integrationPoints = [
    { module: "BlueCarbon360", purpose: "Marine carbon credit and coastal conservation economics" },
    { module: "MineWatch", purpose: "Mining impact on water quality and coastal areas" },
    { module: "LandMap360", purpose: "Coastal boundary management and marine spatial planning" },
    { module: "CarbonTrace", purpose: "Marine carbon footprint and blue carbon monitoring" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Aqua Trace - Ocean & River Monitoring | Polipus Platform</title>
        <meta name="description" content="Comprehensive marine and water monitoring system for Liberian coastal and inland waters" />
      </Helmet>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src={agriTraceLogo} alt="LACRA Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Aqua Trace</h1>
                <p className="text-sm text-slate-600">Ocean & River Monitoring</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2 rounded-lg border border-indigo-100">
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
              
              <div className="flex items-center space-x-2 border-l border-indigo-200 pl-4">
                <Globe className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">National Fisheries Authority</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center mx-auto mb-6">
            <Waves className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Aqua Trace
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              {" "}Marine Monitoring
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced ocean and river monitoring system for sustainable fisheries management, 
            water quality protection, and marine ecosystem conservation in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/aqua-trace-dashboard">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
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
              Register Water Body
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Water Bodies</p>
                  <p className="text-3xl font-bold text-indigo-600">{stats?.totalWaterBodies || 0}</p>
                </div>
                <Waves className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Registered Vessels</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.registeredVessels || 0}</p>
                </div>
                <Ship className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Water Quality Good</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.waterQualityGood || 0}%</p>
                </div>
                <Droplets className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Fishing Permits</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.activeFishingPermits || 0}</p>
                </div>
                <Fish className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Core Platform Features</h2>
              <p className="text-slate-600">Comprehensive marine and water management</p>
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
                    <Shield className="h-5 w-5 text-indigo-500" />
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
                    <Zap className="h-5 w-5 text-indigo-500" />
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
              <span className="text-sm">Register Water</span>
            </Button>
            <Button 
              onClick={() => setIsPermitApplicationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Fishing Permit</span>
            </Button>
            <Link href="/aqua-trace-dashboard">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
              <Droplets className="h-6 w-6" />
              <span className="text-sm">Water Quality</span>
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Water Body</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Water Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ocean">Ocean/Coastal</SelectItem>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="lake">Lake</SelectItem>
                    <SelectItem value="wetland">Wetland</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Water Body ID</label>
                <Input placeholder="Auto-generated" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Water Body Name</label>
              <Input placeholder="Enter water body name" />
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
                    <SelectItem value="grand-bassa">Grand Bassa</SelectItem>
                    <SelectItem value="sinoe">Sinoe</SelectItem>
                    <SelectItem value="maryland">Maryland</SelectItem>
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
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Register Water Body
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