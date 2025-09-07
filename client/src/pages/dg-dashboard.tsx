import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Building2, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  XCircle, 
  AlertTriangle, 
  BarChart3,
  Settings,
  LogOut,
  Crown,
  Activity,
  Globe,
  Target,
  Award,
  Eye,
  DollarSign,
  Truck,
  Sprout,
  Trees,
  MapPin,
  Link,
  RefreshCw,
  Smartphone,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Zap,
  Headphones,
  Monitor,
  Radio,
  Wifi,
  FileDown,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function DGDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMonitoring, setShowMonitoring] = useState(false);

  // Fetch executive dashboard data
  const { data: executiveMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/dashboard/executive-metrics'],
    queryFn: () => apiRequest('/api/dashboard/executive-metrics'),
  });

  const { data: strategicData, isLoading: strategicLoading } = useQuery({
    queryKey: ['/api/dashboard/strategic-overview'],
    queryFn: () => apiRequest('/api/dashboard/strategic-overview'),
  });

  const { data: departmentalReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/dashboard/departmental-reports'],
    queryFn: () => apiRequest('/api/dashboard/departmental-reports'),
  });

  const handleLogout = () => {
    localStorage.removeItem('dgToken');
    localStorage.removeItem('dgUser');
    navigate('/regulatory-login');
  };

  // Mock executive data for demonstration
  const mockExecutiveMetrics = {
    totalRevenue: 2450000,
    complianceRate: 96.8,
    activeProjects: 24,
    departmentEfficiency: 89.2,
    stakeholderSatisfaction: 94.1,
    regulatoryCompliance: 98.5
  };

  const mockStrategicInitiatives = [
    {
      title: "EUDR Implementation Strategy",
      status: "In Progress",
      completion: 78,
      priority: "High",
      deadline: "2025-12-31"
    },
    {
      title: "Digital Transformation Program",
      status: "Planning",
      completion: 23,
      priority: "Medium",
      deadline: "2026-06-30"
    },
    {
      title: "Inter-Agency Cooperation Framework",
      status: "Active",
      completion: 91,
      priority: "High",
      deadline: "2025-03-31"
    }
  ];

  const mockDepartmentalPerformance = [
    {
      department: "DDGOTS",
      performance: 92.1,
      projects: 12,
      status: "Excellent",
      budget: "85% utilized"
    },
    {
      department: "DDGAF",
      performance: 88.7,
      projects: 8,
      status: "Good",
      budget: "73% utilized"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 👑 Mobile-First Header - Executive Design */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 gap-3">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-lg sm:text-3xl font-bold text-slate-900 leading-tight">Director General Dashboard 👑</h1>
                <p className="text-xs sm:text-lg text-slate-700 leading-tight">Executive Leadership Portal</p>
                <p className="text-xs text-slate-600 hidden sm:block">Liberia Agriculture Commodity Regulatory Authority</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50 shadow-sm text-xs">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Executive Access
              </Badge>
              <Button 
                onClick={handleLogout} 
                size="sm"
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 👑 Mobile-Optimized Dashboard Controls */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all mb-4 sm:mb-8 rounded-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">Dashboard Controls</h2>
                  <p className="text-xs sm:text-base text-slate-600">Comprehensive system monitoring and oversight</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowMonitoring(true)} 
                size="sm"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto text-xs sm:text-sm"
              >
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Launch Monitoring
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-8">
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-slate-200 rounded-xl">
            <CardContent className="p-2">
              {/* Mobile: Stacked tabs, Desktop: Grid layout */}
              <div className="block sm:hidden">
                <TabsList className="grid w-full grid-cols-2 gap-1 bg-slate-50 h-auto p-1">
                  <TabsTrigger value="overview" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <BarChart3 className="w-3 h-3" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="departments" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <Building2 className="w-3 h-3" />
                    Departments
                  </TabsTrigger>
                  <TabsTrigger value="portal-oversight" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <Eye className="w-3 h-3" />
                    Portals
                  </TabsTrigger>
                  <TabsTrigger value="strategic" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <Target className="w-3 h-3" />
                    Strategic
                  </TabsTrigger>
                  <TabsTrigger value="governance" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md col-span-2">
                    <Award className="w-3 h-3" />
                    Governance
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Desktop: Original grid layout */}
              <div className="hidden sm:block">
                <TabsList className="grid w-full grid-cols-5 bg-slate-50">
                  <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <BarChart3 className="w-4 h-4" />
                    Executive Overview
                  </TabsTrigger>
                  <TabsTrigger value="departments" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <Building2 className="w-4 h-4" />
                    Departmental Reports
                  </TabsTrigger>
                  <TabsTrigger value="portal-oversight" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <Eye className="w-4 h-4" />
                    Portal Oversight
                  </TabsTrigger>
                  <TabsTrigger value="strategic" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <Target className="w-4 h-4" />
                    Strategic Initiatives
                  </TabsTrigger>
                  <TabsTrigger value="governance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                    <Award className="w-4 h-4" />
                    Governance
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardContent>
          </Card>

          {/* 👑 Mobile-Optimized Executive Overview */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {/* Revenue Metrics */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-slate-200 rounded-xl group">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm sm:text-lg font-bold text-slate-900">Total Revenue</CardTitle>
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                    ${mockExecutiveMetrics.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">+12.3% from last quarter</p>
                </CardContent>
              </Card>

              {/* Compliance Rate */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-slate-200 rounded-xl group">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm sm:text-lg font-bold text-slate-900">Compliance Rate</CardTitle>
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                    {mockExecutiveMetrics.complianceRate}%
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Regulatory compliance</p>
                </CardContent>
              </Card>

              {/* Active Projects */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-slate-200 rounded-xl group">
                <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm sm:text-lg font-bold text-slate-900">Active Projects</CardTitle>
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                    {mockExecutiveMetrics.activeProjects}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Cross-departmental initiatives</p>
                </CardContent>
              </Card>
            </div>

            {/* DG Final Approvals Section */}
            <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900 font-bold">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  Final Approvals Required
                </CardTitle>
                <CardDescription>
                  Items requiring Director General final approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-blue-200 bg-blue-50">
                  <Crown className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    DG Level: Final approval of licenses & export permits. Full system oversight with read-only visibility across all portals.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-3">
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <div className="font-medium">Export License - Global Exports Ltd</div>
                      <div className="text-sm text-slate-600">Technical review completed by DDGOTS</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div>
                      <div className="font-medium">Trading License - ABC Trading Company</div>
                      <div className="text-sm text-slate-600">Payment validated by DDGAF</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <div className="font-medium">Compliance Certificate - Farm Cooperative Union</div>
                      <div className="text-sm text-red-600">Flagged for DG review - Critical compliance issue</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Review Details
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Organizational Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Department Efficiency</span>
                    <span className="font-semibold">{mockExecutiveMetrics.departmentEfficiency}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Stakeholder Satisfaction</span>
                    <span className="font-semibold">{mockExecutiveMetrics.stakeholderSatisfaction}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Regulatory Compliance</span>
                    <span className="font-semibold">{mockExecutiveMetrics.regulatoryCompliance}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    Executive Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Budget review meeting scheduled for next week
                    </AlertDescription>
                  </Alert>
                  <Alert className="border-blue-200 bg-blue-50">
                    <Settings className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      EUDR compliance update requires executive approval
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strategic Initiatives */}
          <TabsContent value="strategic" className="space-y-6">
            <div className="grid gap-4">
              {mockStrategicInitiatives.map((initiative, index) => (
                <Card key={index} className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{initiative.title}</CardTitle>
                        <CardDescription>Deadline: {initiative.deadline}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={initiative.priority === 'High' ? 'destructive' : 'secondary'}>
                          {initiative.priority}
                        </Badge>
                        <Badge variant="outline">{initiative.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{initiative.completion}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${initiative.completion}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Departmental Reports */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid gap-6">
              {mockDepartmentalPerformance.map((dept, index) => (
                <Card key={index} className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{dept.department}</CardTitle>
                      <Badge variant={dept.status === 'Excellent' ? 'default' : 'secondary'}>
                        {dept.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{dept.performance}%</div>
                        <div className="text-sm text-slate-600">Performance Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{dept.projects}</div>
                        <div className="text-sm text-slate-600">Active Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">{dept.budget}</div>
                        <div className="text-sm text-slate-600">Budget Utilization</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Portal Oversight */}
          <TabsContent value="portal-oversight" className="space-y-6">
            <Alert>
              <Shield className="w-4 h-4" />
              <AlertDescription>
                <strong>Director General Portal Oversight:</strong> Read-only visibility across all regulatory portals and departmental activities. All actions require departmental permissions.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DDGOTS Department Overview */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    DDGOTS Operations Overview
                  </CardTitle>
                  <CardDescription>
                    Technical Services & Operations Management (Read-Only View)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Inspector Management System</div>
                      <div className="text-sm text-slate-600">Active inspectors and assignments</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Buyer Management Portal</div>
                      <div className="text-sm text-slate-600">Registered buyers and compliance status</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Exporter Management System</div>
                      <div className="text-sm text-slate-600">Export licenses and certifications</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Technical Compliance</div>
                      <div className="text-sm text-slate-600">EUDR and international standards</div>
                    </div>
                    <Badge variant="secondary">Monitoring</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* DDGAF Department Overview */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    DDGAF Financial Overview
                  </CardTitle>
                  <CardDescription>
                    Administration & Finance Management (Read-Only View)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Payment Validation System</div>
                      <div className="text-sm text-slate-600">Transaction verification and approval</div>
                    </div>
                    <Badge variant="default" className="bg-blue-500">Processing</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Financial Records Management</div>
                      <div className="text-sm text-slate-600">Revenue tracking and reporting</div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Unpaid Account Management</div>
                      <div className="text-sm text-slate-600">Outstanding payment tracking</div>
                    </div>
                    <Badge variant="destructive">Attention Required</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold">Budget Oversight</div>
                      <div className="text-sm text-slate-600">Departmental budget allocation</div>
                    </div>
                    <Badge variant="secondary">Monitoring</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cross-Portal Activities */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  Cross-Portal Activity Monitor
                </CardTitle>
                <CardDescription>
                  Real-time visibility of inter-departmental activities and workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-slate-600">Active Inspections</div>
                    <div className="text-xs text-slate-500 mt-1">DDGOTS Operations</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$2.4M</div>
                    <div className="text-sm text-slate-600">Revenue This Month</div>
                    <div className="text-xs text-slate-500 mt-1">DDGAF Finance</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">98.2%</div>
                    <div className="text-sm text-slate-600">System Uptime</div>
                    <div className="text-xs text-slate-500 mt-1">All Portals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Governance */}
          <TabsContent value="governance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    Regulatory Framework
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>EUDR Compliance Status</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>International Standards</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quality Certifications</span>
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Stakeholder Relations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Government Relations</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>International Partners</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Private Sector</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Government Integration Section */}
            <Card className="bg-white shadow-lg border-0 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5 text-purple-600" />
                  Government Integration
                </CardTitle>
                <CardDescription>
                  External government agency API integration (Future connectivity)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* LRA - Liberia Revenue Authority */}
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <DollarSign className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">LRA</CardTitle>
                            <p className="text-xs text-slate-600">Revenue Authority</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">Ready</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Connect API
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Customs */}
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Truck className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">Customs</CardTitle>
                            <p className="text-xs text-slate-600">Import/Export</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">Ready</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Connect API
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Minister of Agriculture */}
                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-amber-500 rounded-lg">
                            <Sprout className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">MOA</CardTitle>
                            <p className="text-xs text-slate-600">Minister of Agriculture</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">Ready</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Connect API
                      </Button>
                    </CardContent>
                  </Card>

                  {/* FDA - Forest Development Authority */}
                  <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-emerald-500 rounded-lg">
                            <Trees className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">FDA</CardTitle>
                            <p className="text-xs text-slate-600">Forest Development Authority</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">Ready</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Connect API
                      </Button>
                    </CardContent>
                  </Card>

                  {/* LLA - Liberia Land Authority */}
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <MapPin className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">LLA</CardTitle>
                            <p className="text-xs text-slate-600">Liberia Land Authority</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">Ready</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Connect API
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="mt-4 border-blue-200 bg-blue-50">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    Government API integrations will be activated when external agencies provide connection endpoints. All systems are ready for future connectivity.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Comprehensive Monitoring Modal */}
      <Dialog open={showMonitoring} onOpenChange={setShowMonitoring}>
        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-2xl">
          <DialogHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold text-slate-900 mb-2">
              AgriTrace360™ Comprehensive Monitoring System
            </DialogTitle>
            <DialogDescription className="text-slate-700 text-lg">
              Real-time monitoring across all 15 Liberian counties with mobile inspector tracking and comprehensive analytics
            </DialogDescription>
            <p className="text-slate-600 text-sm mt-2">Director General Executive Monitoring Dashboard</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Active Inspectors</p>
                      <p className="text-3xl font-bold text-slate-900">47</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <Smartphone className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Counties Online</p>
                      <p className="text-3xl font-bold text-slate-900">15/15</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Pending Inspections</p>
                      <p className="text-3xl font-bold text-slate-900">12</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 font-medium">Critical Alerts</p>
                      <p className="text-3xl font-bold text-slate-900">3</p>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monitoring Tabs */}
            <Card className="bg-white shadow-xl border-slate-200">
              <CardContent className="p-2">
                <Tabs defaultValue="mobile-inspectors" className="w-full">
                  <TabsList className="grid w-full grid-cols-7 bg-slate-50">
                    <TabsTrigger value="mobile-inspectors" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md">Mobile Inspectors</TabsTrigger>
                    <TabsTrigger value="county-reports" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">County Reports</TabsTrigger>
                    <TabsTrigger value="supply-chain" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">Supply Chain</TabsTrigger>
                    <TabsTrigger value="portal-activity" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md">Portal Activity</TabsTrigger>
                    <TabsTrigger value="compliance" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md">Compliance</TabsTrigger>
                    <TabsTrigger value="emergency" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-md">Emergency</TabsTrigger>
                    <TabsTrigger value="analytics" className="text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md">Analytics</TabsTrigger>
                  </TabsList>

                  {/* Mobile Inspector Monitoring */}
                  <TabsContent value="mobile-inspectors" className="space-y-6">
                    <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-slate-900 font-bold">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-full">
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          Mobile Inspector Real-Time Tracking
                        </CardTitle>
                      </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Inspector Status Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { county: "Montserrado", inspectors: 8, active: 7, status: "active" },
                        { county: "Bong", inspectors: 4, active: 3, status: "active" },
                        { county: "Nimba", inspectors: 5, active: 4, status: "inspection" },
                        { county: "Grand Bassa", inspectors: 3, active: 3, status: "active" },
                        { county: "Lofa", inspectors: 3, active: 2, status: "offline" },
                        { county: "Margibi", inspectors: 2, active: 2, status: "active" }
                      ].map((county, i) => (
                        <Card key={i} className={`${
                          county.status === 'active' ? 'bg-green-50 border-green-200' :
                          county.status === 'inspection' ? 'bg-blue-50 border-blue-200' :
                          'bg-red-50 border-red-200'
                        }`}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-semibold text-sm">{county.county}</h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  county.status === 'active' ? 'border-green-500 text-green-700' :
                                  county.status === 'inspection' ? 'border-blue-500 text-blue-700' :
                                  'border-red-500 text-red-700'
                                }`}
                              >
                                {county.status === 'active' ? '🟢 Active' :
                                 county.status === 'inspection' ? '🔵 On-site' :
                                 '🔴 Offline'}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-600">
                              <p>{county.active}/{county.inspectors} Inspectors Online</p>
                              <Progress 
                                value={(county.active / county.inspectors) * 100} 
                                className="mt-2 h-1"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Inspector Activity Feed */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Recent Inspector Activities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {[
                            { time: "10:45 AM", inspector: "J. Smith", action: "Completed land inspection", county: "Montserrado" },
                            { time: "10:30 AM", inspector: "M. Johnson", action: "Started warehouse inspection", county: "Bong" },
                            { time: "10:15 AM", inspector: "K. Williams", action: "Filed compliance report", county: "Nimba" },
                            { time: "09:55 AM", inspector: "D. Brown", action: "Generated QR batch code", county: "Grand Bassa" },
                            { time: "09:40 AM", inspector: "S. Davis", action: "Approved harvest registration", county: "Lofa" }
                          ].map((activity, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-b-0">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                  <p className="text-sm font-medium">{activity.inspector}</p>
                                  <p className="text-xs text-slate-600">{activity.action}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-500">{activity.time}</p>
                                <Badge variant="outline" className="text-xs">{activity.county}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* County-Wide Reports */}
              <TabsContent value="county-reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      15-County Comprehensive Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {[
                        "Montserrado", "Bong", "Nimba", "Grand Bassa", "Lofa",
                        "Margibi", "Grand Cape Mount", "Rivercess", "Sinoe", "Maryland",
                        "Grand Gedeh", "River Gee", "Grand Kru", "Gbarpolu", "Bomi"
                      ].map((county, i) => (
                        <Card key={i} className="hover:shadow-md transition-all cursor-pointer">
                          <CardContent className="p-3">
                            <div className="text-center">
                              <h4 className="font-semibold text-sm mb-2">{county}</h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Farmers:</span>
                                  <span className="font-medium">{Math.floor(Math.random() * 500) + 50}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Harvests:</span>
                                  <span className="font-medium">{Math.floor(Math.random() * 100) + 10}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Exports:</span>
                                  <span className="font-medium">{Math.floor(Math.random() * 50) + 5}</span>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className="text-xs w-full mt-2"
                                  style={{ background: `hsl(${120 + Math.random() * 60}, 50%, 95%)` }}
                                >
                                  {(85 + Math.random() * 15).toFixed(1)}% Compliance
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Supply Chain Monitoring */}
              <TabsContent value="supply-chain" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      18-Point Integration Workflow Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-green-50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Sprout className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <h4 className="font-semibold mb-2">Farm to Harvest</h4>
                            <div className="space-y-1 text-sm">
                              <p>Active Batches: <span className="font-medium">247</span></p>
                              <p>Auto-Generated Codes: <span className="font-medium">89</span></p>
                              <Progress value={87} className="mt-2" />
                              <p className="text-xs text-green-600">87% Complete</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <h4 className="font-semibold mb-2">Warehouse Processing</h4>
                            <div className="space-y-1 text-sm">
                              <p>In Storage: <span className="font-medium">156</span></p>
                              <p>QR Verifications: <span className="font-medium">23</span></p>
                              <Progress value={73} className="mt-2" />
                              <p className="text-xs text-blue-600">73% Processed</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-orange-50">
                        <CardContent className="p-4">
                          <div className="text-center">
                            <Truck className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <h4 className="font-semibold mb-2">Export Ready</h4>
                            <div className="space-y-1 text-sm">
                              <p>Pending Export: <span className="font-medium">45</span></p>
                              <p>Documents Ready: <span className="font-medium">32</span></p>
                              <Progress value={94} className="mt-2" />
                              <p className="text-xs text-orange-600">94% Ready</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Recent Supply Chain Events */}
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-sm">Live Supply Chain Events</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {[
                            { time: "11:15 AM", event: "Batch #AGT-2025-0847 approved for warehouse delivery", status: "success" },
                            { time: "11:00 AM", event: "Payment confirmed for Lot #LOT-0234 - $2,450", status: "success" },
                            { time: "10:45 AM", event: "Export document generated for Batch #AGT-2025-0845", status: "success" },
                            { time: "10:30 AM", event: "Quality inspection completed for Warehouse #WH-MB-001", status: "warning" },
                            { time: "10:15 AM", event: "Port inspection scheduled for tomorrow", status: "info" }
                          ].map((event, i) => (
                            <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-b-0">
                              <div className={`w-2 h-2 rounded-full ${
                                event.status === 'success' ? 'bg-green-500' :
                                event.status === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="text-sm">{event.event}</p>
                                <p className="text-xs text-slate-500">{event.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Portal Activity Monitoring */}
              <TabsContent value="portal-activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Multi-Portal Activity Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { portal: "Farmers", active: 1247, sessions: 892, color: "green" },
                        { portal: "Buyers", active: 89, sessions: 134, color: "blue" },
                        { portal: "Exporters", active: 23, sessions: 45, color: "orange" },
                        { portal: "Inspectors", active: 47, sessions: 67, color: "purple" }
                      ].map((portal, i) => (
                        <Card key={i} className={`bg-${portal.color}-50 border-${portal.color}-200`}>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <h4 className="font-semibold mb-2">{portal.portal}</h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-lg font-bold">{portal.active}</p>
                                  <p className="text-xs text-slate-600">Active Users</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{portal.sessions}</p>
                                  <p className="text-xs text-slate-600">Active Sessions</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance & Audit */}
              <TabsContent value="compliance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Compliance & Audit Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">EUDR Compliance Status</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">LACRA Standards</span>
                            <div className="flex items-center gap-2">
                              <Progress value={96.8} className="w-20 h-2" />
                              <span className="text-sm font-medium">96.8%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Land Mapping Compliance</span>
                            <div className="flex items-center gap-2">
                              <Progress value={89.2} className="w-20 h-2" />
                              <span className="text-sm font-medium">89.2%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quality Inspections</span>
                            <div className="flex items-center gap-2">
                              <Progress value={94.1} className="w-20 h-2" />
                              <span className="text-sm font-medium">94.1%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Audit Trail Summary</h4>
                        <div className="space-y-2">
                          {[
                            { action: "Payment confirmations verified", count: 23 },
                            { action: "Land mapping approvals", count: 15 },
                            { action: "Export documents generated", count: 8 },
                            { action: "Quality inspections completed", count: 31 }
                          ].map((audit, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
                              <span className="text-sm">{audit.action}</span>
                              <Badge variant="outline">{audit.count}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Emergency Response */}
              <TabsContent value="emergency" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      Emergency Response & Alert System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 text-red-700">Critical Alerts (3)</h4>
                        <div className="space-y-2">
                          {[
                            { 
                              alert: "Warehouse storage limit exceeded in Bong County", 
                              time: "5 min ago", 
                              severity: "high",
                              inspector: "Contact: M. Johnson (+231-555-0123)"
                            },
                            { 
                              alert: "Network connectivity issues in Lofa County", 
                              time: "12 min ago", 
                              severity: "medium",
                              inspector: "Contact: K. Williams (+231-555-0145)"
                            },
                            { 
                              alert: "Delayed inspection in Grand Bassa", 
                              time: "18 min ago", 
                              severity: "low",
                              inspector: "Contact: D. Brown (+231-555-0167)"
                            }
                          ].map((alert, i) => (
                            <Card key={i} className={`${
                              alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                              alert.severity === 'medium' ? 'bg-orange-50 border-orange-200' :
                              'bg-yellow-50 border-yellow-200'
                            }`}>
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{alert.alert}</p>
                                    <p className="text-xs text-slate-600 mt-1">{alert.inspector}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline" className={`text-xs ${
                                      alert.severity === 'high' ? 'border-red-500 text-red-700' :
                                      alert.severity === 'medium' ? 'border-orange-500 text-orange-700' :
                                      'border-yellow-500 text-yellow-700'
                                    }`}>
                                      {alert.severity.toUpperCase()}
                                    </Badge>
                                    <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Emergency Contacts</h4>
                        <div className="space-y-2">
                          {[
                            { role: "Chief Land Inspector", name: "James Smith", phone: "+231-555-0100" },
                            { role: "Lead Warehouse Inspector", name: "Maria Johnson", phone: "+231-555-0101" },
                            { role: "Port Authority Chief", name: "Kevin Williams", phone: "+231-555-0102" },
                            { role: "Emergency Coordinator", name: "Sarah Davis", phone: "+231-555-0103" }
                          ].map((contact, i) => (
                            <Card key={i} className="hover:shadow-md cursor-pointer">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium">{contact.name}</p>
                                    <p className="text-xs text-slate-600">{contact.role}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline">
                                      <Headphones className="w-3 h-3 mr-1" />
                                      Call
                                    </Button>
                                    <Badge variant="outline" className="text-xs">Online</Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Dashboard */}
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Advanced Analytics & Performance Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Performance Metrics</h4>
                        <div className="space-y-3">
                          {[
                            { metric: "System Uptime", value: "99.8%", trend: "up" },
                            { metric: "Average Response Time", value: "1.2s", trend: "down" },
                            { metric: "Inspector Efficiency", value: "89.2%", trend: "up" },
                            { metric: "Error Rate", value: "0.3%", trend: "down" }
                          ].map((metric, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm">{metric.metric}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{metric.value}</span>
                                {metric.trend === 'up' ? (
                                  <TrendingUp className="w-4 h-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Export Statistics</h4>
                        <div className="space-y-3">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <p className="text-2xl font-bold text-green-800">$2.4M</p>
                            <p className="text-sm text-green-600">Total Export Value</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-2xl font-bold text-blue-800">156</p>
                            <p className="text-sm text-blue-600">Completed Exports</p>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <p className="text-2xl font-bold text-orange-800">847</p>
                            <p className="text-sm text-orange-600">Active Farmers</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">System Health</h4>
                        <div className="space-y-3">
                          {[
                            { service: "Database", status: "healthy", uptime: "99.9%" },
                            { service: "Mobile APIs", status: "healthy", uptime: "99.7%" },
                            { service: "Payment Gateway", status: "warning", uptime: "98.2%" },
                            { service: "Notification Service", status: "healthy", uptime: "99.5%" }
                          ].map((service, i) => (
                            <div key={i} className="flex items-center justify-between p-2 border border-slate-200 rounded">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  service.status === 'healthy' ? 'bg-green-500' :
                                  service.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                                }`}></div>
                                <span className="text-sm">{service.service}</span>
                              </div>
                              <span className="text-xs text-slate-600">{service.uptime}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-600">Live Monitoring Active</span>
              </div>
              <Badge variant="outline" className="text-xs">
                <RefreshCw className="w-3 h-3 mr-1" />
                Auto-refresh: 30s
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure Alerts
              </Button>
              <Button onClick={() => setShowMonitoring(false)} className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all" size="sm">
                <X className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}