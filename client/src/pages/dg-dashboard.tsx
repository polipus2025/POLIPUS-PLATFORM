import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  Globe,
  Target,
  Award,
  Eye
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function DGDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Director General Dashboard</h1>
                <p className="text-slate-600">Executive Leadership Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                <Shield className="w-4 h-4 mr-1" />
                Executive Access
              </Badge>
              <Button onClick={handleLogout} variant="outline" className="text-slate-600 hover:text-slate-900">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Executive Overview
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Departmental Reports
            </TabsTrigger>
            <TabsTrigger value="portal-oversight" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Portal Oversight
            </TabsTrigger>
            <TabsTrigger value="strategic" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Strategic Initiatives
            </TabsTrigger>
            <TabsTrigger value="governance" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Governance
            </TabsTrigger>
          </TabsList>

          {/* Executive Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Revenue Metrics */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">Total Revenue</CardTitle>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    ${mockExecutiveMetrics.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-sm text-slate-600">+12.3% from last quarter</p>
                </CardContent>
              </Card>

              {/* Compliance Rate */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">Compliance Rate</CardTitle>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {mockExecutiveMetrics.complianceRate}%
                  </div>
                  <p className="text-sm text-slate-600">Regulatory compliance</p>
                </CardContent>
              </Card>

              {/* Active Projects */}
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">Active Projects</CardTitle>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {mockExecutiveMetrics.activeProjects}
                  </div>
                  <p className="text-sm text-slate-600">Cross-departmental initiatives</p>
                </CardContent>
              </Card>
            </div>

            {/* DG Final Approvals Section */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
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
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
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
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
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
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}