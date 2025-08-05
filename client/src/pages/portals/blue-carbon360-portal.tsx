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
  DollarSign, 
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
  Coins,
  TreePine,
  Waves,
  HandCoins,
  Building2,
  Target
} from 'lucide-react';
import agriTraceLogo from '@assets/IMG-20250724-WA0007_1753362990630.jpg';

export default function BlueCarbon360Portal() {
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
    queryKey: ["/api/blue-carbon360/stats"],
  });

  const coreFeatures = [
    {
      id: 1,
      title: "Conservation Dashboard",
      description: "Economic impact and conservation overview",
      icon: BarChart3,
      color: "bg-cyan-500",
      route: "/blue-carbon360-dashboard"
    },
    {
      id: 2,
      title: "Conservation Economics Map",
      description: "Real-time conservation project tracking",
      icon: Target,
      color: "bg-green-500",
      features: ["Project Mapping", "Economic Impact Zones", "Conservation ROI"]
    },
    {
      id: 3,
      title: "Project Registration",
      description: "Conservation projects and organizations",
      icon: Building2,
      color: "bg-blue-500",
      features: ["Project Profiles", "Organization Records", "Partnership Management"]
    },
    {
      id: 4,
      title: "Carbon Trading Permits",
      description: "Carbon credit applications and trading",
      icon: FileText,
      color: "bg-purple-500",
      features: ["Credit Applications", "Trading Permits", "Verification Process"]
    },
    {
      id: 5,
      title: "QR Conservation Certificates",
      description: "Digital conservation certificates",
      icon: QrCode,
      color: "bg-red-500",
      features: ["Digital Certificates", "Impact Verification", "Trading Records"]
    },
    {
      id: 6,
      title: "Economic Monitoring",
      description: "Conservation economic impact tracking",
      icon: HandCoins,
      color: "bg-teal-500",
      features: ["Economic Impact", "Community Benefits", "Revenue Tracking"]
    },
    {
      id: 7,
      title: "Document Management",
      description: "Conservation and economic documents",
      icon: Upload,
      color: "bg-indigo-500",
      features: ["Project Documents", "Economic Reports", "Impact Evidence"]
    },
    {
      id: 8,
      title: "Carbon Credit Trading",
      description: "Blue and forest carbon credit marketplace",
      icon: Coins,
      color: "bg-orange-500",
      features: ["Credit Marketplace", "Trading Platform", "Price Monitoring"]
    },
    {
      id: 9,
      title: "Mobile Economic Tools",
      description: "Field economic data collection",
      icon: Smartphone,
      color: "bg-pink-500",
      features: ["Economic Surveys", "Impact Assessment", "Community Data"]
    },
    {
      id: 10,
      title: "Conservation Analytics",
      description: "Economic and environmental analytics",
      icon: TrendingUp,
      color: "bg-yellow-500",
      features: ["Impact Analytics", "Economic Reports", "Conservation Metrics"]
    }
  ];

  const userRoles = [
    { role: "Administrator", access: "Full system access", users: "National ICT, Economic Planning" },
    { role: "Economics Director", access: "All economic data", users: "Ministry of Finance, Economic Planning" },
    { role: "Conservation Officer", access: "Project monitoring", users: "Conservation Officers, Project Managers" },
    { role: "Data Entry Officer", access: "Record creation", users: "Economic clerks, Project assistants" },
    { role: "Trading Partners", access: "Carbon trading data", users: "Carbon brokers, International buyers" },
    { role: "Community Groups", access: "Community project data", users: "Conservation groups, Local communities" }
  ];

  const integrationPoints = [
    { module: "ForestGuard", purpose: "Forest conservation and carbon credit generation" },
    { module: "AquaTrace", purpose: "Marine conservation and blue carbon programs" },
    { module: "CarbonTrace", purpose: "Carbon credit verification and trading integration" },
    { module: "LandMap360", purpose: "Conservation area boundary and ownership management" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Blue Carbon 360 - Conservation Economics | Polipus Platform</title>
        <meta name="description" content="Conservation economics and carbon credit trading system for Liberian environmental sector" />
      </Helmet>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <img src={agriTraceLogo} alt="LACRA Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Blue Carbon 360</h1>
                <p className="text-sm text-slate-600">Conservation Economics & Real Benefits</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6 bg-gradient-to-r from-cyan-50 to-green-50 px-4 py-2 rounded-lg border border-cyan-100">
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
              
              <div className="flex items-center space-x-2 border-l border-cyan-200 pl-4">
                <Globe className="h-4 w-4 text-orange-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{weather.temperature}</div>
                  <div className="text-xs text-gray-600">{weather.location}</div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-600">Republic of Liberia</p>
              <p className="text-xs text-gray-500">Economic Planning & Conservation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <div className="isms-card text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-cyan-500 flex items-center justify-center mx-auto mb-6">
            <DollarSign className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Blue Carbon 360
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-green-600">
              {" "}Conservation Economics
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
            Advanced conservation economics platform for carbon credit trading, economic impact assessment, 
            and sustainable environmental finance management in Liberia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/blue-carbon360-dashboard">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2">
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
              Register Conservation Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Conservation Projects</p>
                  <p className="text-3xl font-bold text-cyan-600">{stats?.totalProjects || 0}</p>
                </div>
                <Target className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Projects</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.activeProjects || 0}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
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
                  <p className="text-sm font-medium text-slate-600">Economic Impact ($)</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.economicImpact || 0}K</p>
                </div>
                <HandCoins className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Core Platform Features</h2>
              <p className="text-slate-600">Comprehensive conservation economics management</p>
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
                    <Shield className="h-5 w-5 text-cyan-500" />
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
                    <Zap className="h-5 w-5 text-cyan-500" />
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
              <span className="text-sm">New Project</span>
            </Button>
            <Button 
              onClick={() => setIsPermitApplicationOpen(true)}
              className="h-20 flex flex-col items-center justify-center gap-2"
              variant="outline"
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm">Trading Permit</span>
            </Button>
            <Link href="/blue-carbon360-dashboard">
              <Button className="h-20 w-full flex flex-col items-center justify-center gap-2" variant="outline">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Dashboard</span>
              </Button>
            </Link>
            <Button className="h-20 flex flex-col items-center justify-center gap-2" variant="outline">
              <Coins className="h-6 w-6" />
              <span className="text-sm">Trade Credits</span>
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Conservation Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Project Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forest">Forest Conservation</SelectItem>
                    <SelectItem value="marine">Marine Conservation</SelectItem>
                    <SelectItem value="community">Community Conservation</SelectItem>
                    <SelectItem value="carbon">Carbon Credit Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Project ID</label>
                <Input placeholder="Auto-generated" disabled />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Project Name</label>
              <Input placeholder="Enter project name" />
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
                    <SelectItem value="maryland">Maryland</SelectItem>
                    <SelectItem value="grand-kru">Grand Kru</SelectItem>
                    <SelectItem value="river-cess">River Cess</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Expected Economic Impact ($)</label>
                <Input placeholder="Enter impact estimate" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsRegistrationOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                Register Conservation Project
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