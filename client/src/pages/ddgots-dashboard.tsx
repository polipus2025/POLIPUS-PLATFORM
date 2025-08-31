import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Users, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  LogOut,
  Cog,
  MapPin,
  Ship,
  UserCheck,
  ClipboardCheck,
  Pause,
  Sprout,
  Map,
  FileText,
  TreePine,
  Download,
  Eye,
  Calendar,
  Shield,
  TrendingUp
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function DDGOTSDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('operations');
  
  // Check authentication
  const ddgotsToken = localStorage.getItem('ddgotsToken');
  const ddgotsUser = localStorage.getItem('ddgotsUser');
  
  // Redirect if not authenticated
  if (!ddgotsToken || !ddgotsUser) {
    navigate('/auth/ddgots-login');
    return null;
  }

  // Fetch DDGOTS-specific data
  const { data: inspectorAssignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/ddgots/inspector-assignments'],
    queryFn: () => apiRequest('/api/ddgots/inspector-assignments'),
  });

  const { data: inspectionReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['/api/ddgots/inspection-reports'],
    queryFn: () => apiRequest('/api/ddgots/inspection-reports'),
  });

  const { data: technicalCompliance, isLoading: complianceLoading } = useQuery({
    queryKey: ['/api/ddgots/technical-compliance'],
    queryFn: () => apiRequest('/api/ddgots/technical-compliance'),
  });

  // Farmer oversight data
  const { data: farmersData, isLoading: farmersLoading } = useQuery({
    queryKey: ['/api/farmers'],
    queryFn: () => apiRequest('/api/farmers'),
  });

  const { data: landMappingData, isLoading: landMappingLoading } = useQuery({
    queryKey: ['/api/farmer-land-mappings'],
    queryFn: () => apiRequest('/api/farmer-land-mappings'),
  });

  const { data: harvestSchedules, isLoading: harvestLoading } = useQuery({
    queryKey: ['/api/harvest-schedules'],
    queryFn: () => apiRequest('/api/harvest-schedules'),
  });

  const { data: eudrFarmers, isLoading: eudrLoading } = useQuery({
    queryKey: ['/api/eudr/farmers-ready'],
    queryFn: () => apiRequest('/api/eudr/farmers-ready'),
  });

  const { data: deforestationAlerts, isLoading: deforestationLoading } = useQuery({
    queryKey: ['/api/deforestation-alerts'],
    queryFn: () => apiRequest('/api/deforestation-alerts'),
  });

  const { data: eudrPendingPacks, isLoading: eudrPendingLoading } = useQuery({
    queryKey: ['/api/eudr/pending-approval'],
    queryFn: () => apiRequest('/api/eudr/pending-approval'),
  });

  const handleLogout = () => {
    localStorage.removeItem('ddgotsToken');
    localStorage.removeItem('ddgotsUser');
    navigate('/regulatory-login');
  };

  const handleInspectorManagement = () => {
    navigate('/inspector-management');
  };

  const handleBuyerManagement = () => {
    navigate('/buyer-management');
  };

  const handleExporterManagement = () => {
    navigate('/exporter-management');
  };

  // Mock data for DDGOTS operations
  const mockOperationsData = {
    activeInspectors: 24,
    pendingReports: 8,
    technicalIssues: 3,
    complianceRate: 94.2,
    assignedInspections: 156,
    completedInspections: 134
  };

  const mockInspectorAssignments = [
    {
      id: 1,
      inspectorName: "John Doe",
      type: "Land Inspector",
      location: "Montserrado County",
      status: "Active",
      currentAssignments: 5
    },
    {
      id: 2,
      inspectorName: "Jane Smith",
      type: "Port Inspector",
      location: "Port of Monrovia",
      status: "Active",
      currentAssignments: 3
    },
    {
      id: 3,
      inspectorName: "Robert Johnson",
      type: "Land Inspector",
      location: "Nimba County",
      status: "Pending Assignment",
      currentAssignments: 0
    }
  ];

  const mockPendingReports = [
    {
      id: 1,
      title: "Cocoa Farm Inspection - Farm ID: F001",
      inspector: "John Doe",
      type: "Land Inspection",
      priority: "High",
      dueDate: "2025-08-20",
      status: "Pending Review"
    },
    {
      id: 2,
      title: "Export Shipment Verification - Batch B789",
      inspector: "Jane Smith", 
      type: "Port Inspection",
      priority: "Critical",
      dueDate: "2025-08-19",
      status: "Requires Approval"
    }
  ];

  const mockComplianceIssues = [
    {
      id: 1,
      entity: "Farmer: Michael Brown",
      issue: "Missing GPS coordinates for plot verification",
      severity: "Medium",
      action: "Temporary suspension available"
    },
    {
      id: 2,
      entity: "Buyer: ABC Trading Co",
      issue: "Documentation discrepancies in batch records",
      severity: "High",
      action: "Technical review required"
    },
    {
      id: 3,
      entity: "Exporter: Global Exports Ltd",
      issue: "Certificate authenticity verification failed",
      severity: "Critical",
      action: "Immediate suspension recommended"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Cog className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">DDGOTS Dashboard</h1>
                <p className="text-slate-700 text-lg">Operations & Technical Services</p>
                <p className="text-slate-600 text-sm">Liberia Agriculture Commodity Regulatory Authority</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50 shadow-sm">
                <Settings className="w-4 h-4 mr-1" />
                Operations Access
              </Badge>
              <Button 
                onClick={handleLogout} 
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <Card className="bg-white shadow-xl border-slate-200">
            <CardContent className="p-2">
              <TabsList className="grid w-full grid-cols-5 bg-slate-50">
                <TabsTrigger value="operations" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <Settings className="w-4 h-4" />
                  Operations Overview
                </TabsTrigger>
                <TabsTrigger value="inspectors" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <Users className="w-4 h-4" />
                  Inspector Management
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <FileCheck className="w-4 h-4" />
                  Inspection Reports
                </TabsTrigger>
                <TabsTrigger value="compliance" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <CheckCircle className="w-4 h-4" />
                  Technical Compliance
                </TabsTrigger>
                <TabsTrigger value="farmers" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-md">
                  <Users className="w-4 h-4" />
                  Farmer Oversight
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Operations Overview */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">Active Inspectors</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {mockOperationsData.activeInspectors}
                  </div>
                  <p className="text-sm text-slate-600">Land & Port Inspectors</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">Pending Reports</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <FileCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {mockOperationsData.pendingReports}
                  </div>
                  <p className="text-sm text-slate-600">Awaiting review</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">Compliance Rate</CardTitle>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900 mb-2">
                    {mockOperationsData.complianceRate}%
                  </div>
                  <p className="text-sm text-slate-600">Technical compliance</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={handleInspectorManagement} className="bg-emerald-600 hover:bg-emerald-700 text-white h-20 text-lg">
                <UserCheck className="w-6 h-6 mr-2" />
                Manage Inspectors
              </Button>
              <Button onClick={handleBuyerManagement} className="bg-blue-600 hover:bg-blue-700 text-white h-20 text-lg">
                <Users className="w-6 h-6 mr-2" />
                Manage Buyers
              </Button>
              <Button onClick={handleExporterManagement} className="bg-purple-600 hover:bg-purple-700 text-white h-20 text-lg">
                <Ship className="w-6 h-6 mr-2" />
                Manage Exporters
              </Button>
            </div>
          </TabsContent>

          {/* Inspector Management */}
          <TabsContent value="inspectors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Inspector Assignment & Management</h2>
              <Button onClick={handleInspectorManagement} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <UserCheck className="w-4 h-4 mr-2" />
                Full Inspector Management
              </Button>
            </div>

            <div className="grid gap-4">
              {mockInspectorAssignments.map((inspector) => (
                <Card key={inspector.id} className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{inspector.inspectorName}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {inspector.type === 'Land Inspector' ? (
                            <MapPin className="w-4 h-4" />
                          ) : (
                            <Ship className="w-4 h-4" />
                          )}
                          {inspector.type} - {inspector.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={inspector.status === 'Active' ? 'default' : 'secondary'}>
                          {inspector.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Current Assignments: {inspector.currentAssignments}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Assign Task
                        </Button>
                        <Button size="sm" variant="outline">
                          View Reports
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inspection Reports */}
          <TabsContent value="reports" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Pending Inspection Reports Review</h2>
            
            <div className="grid gap-4">
              {mockPendingReports.map((report) => (
                <Card key={report.id} className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription>
                          Inspector: {report.inspector} | Due: {report.dueDate}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={report.priority === 'Critical' ? 'destructive' : 
                                       report.priority === 'High' ? 'default' : 'secondary'}>
                          {report.priority}
                        </Badge>
                        <Badge variant="outline">{report.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Type: {report.type}</span>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Technical Compliance */}
          <TabsContent value="compliance" className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Technical Compliance Issues</h2>
            
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                DDGOTS can temporarily suspend farmers/buyers/exporters for technical issues. Final approvals require DG authorization.
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-4">
              {mockComplianceIssues.map((issue) => (
                <Card key={issue.id} className="bg-white shadow-lg border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{issue.entity}</CardTitle>
                        <CardDescription className="text-red-600">
                          {issue.issue}
                        </CardDescription>
                      </div>
                      <Badge variant={issue.severity === 'Critical' ? 'destructive' : 
                                     issue.severity === 'High' ? 'default' : 'secondary'}>
                        {issue.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">{issue.action}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                          <Pause className="w-4 h-4 mr-1" />
                          Suspend
                        </Button>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Farmer Oversight */}
          <TabsContent value="farmers" className="space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Farmer Oversight & Compliance Management</h2>
                  <p className="text-slate-600">All farmer information onboarded by Land Inspectors with land mapping, harvest schedules, and compliance reports</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Data
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-900">Total Farmers</CardTitle>
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Sprout className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {farmersData?.length || 0}
                    </div>
                    <p className="text-sm text-slate-600">Onboarded by Land Inspectors</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-900">Land Mapped</CardTitle>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Map className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {landMappingData?.length || 0}
                    </div>
                    <p className="text-sm text-slate-600">GPS Coordinates Recorded</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-900">EUDR Ready</CardTitle>
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <Shield className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {eudrFarmers?.length || 0}
                    </div>
                    <p className="text-sm text-slate-600">Compliance Pack Ready</p>
                  </CardContent>
                </Card>

                <Card className="bg-white shadow-lg border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-900">Deforestation Alerts</CardTitle>
                      <div className="p-2 bg-red-100 rounded-lg">
                        <TreePine className="w-5 h-5 text-red-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {deforestationAlerts?.length || 0}
                    </div>
                    <p className="text-sm text-slate-600">Monitoring Active</p>
                  </CardContent>
                </Card>
              </div>

              {/* Farmer Information Table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-900">Farmer Registry & Land Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Map
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>

                {farmersLoading || eudrLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {(eudrFarmers || []).map((farmer: any, index: number) => (
                      <Card key={farmer.id || index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <h4 className="font-semibold text-slate-900">{farmer.name}</h4>
                                <p className="text-sm text-slate-600">ID: {farmer.farmerId}</p>
                                <p className="text-sm text-slate-500">{farmer.county}, {farmer.district}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-slate-700">Land Information</p>
                                <p className="text-sm text-slate-600">GPS: {farmer.gpsCoordinates}</p>
                                <p className="text-sm text-slate-600">Farms: {farmer.farmsCount}</p>
                                <p className="text-sm text-slate-600">Commodities: {farmer.commoditiesCount}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium text-slate-700">Last Activities</p>
                                <p className="text-sm text-slate-600">
                                  Inspection: {farmer.lastInspection ? 
                                    new Date(farmer.lastInspection).toLocaleDateString() : 'Not Available'}
                                </p>
                                <p className="text-sm text-slate-600">
                                  Status: 
                                  <Badge className={`ml-2 ${farmer.complianceStatus === 'compliant' ? 'bg-green-100 text-green-800' :
                                    farmer.complianceStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}`}>
                                    {farmer.complianceStatus}
                                  </Badge>
                                </p>
                              </div>
                              
                              <div className="flex flex-col gap-2">
                                <Button size="sm" variant="outline" className="w-full">
                                  <Map className="w-4 h-4 mr-2" />
                                  View Land Map
                                </Button>
                                <Button size="sm" variant="outline" className="w-full">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Harvest Schedule
                                </Button>
                                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                                  <FileText className="w-4 h-4 mr-2" />
                                  EUDR Report
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* EUDR Compliance Packs Pending Review */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-900">EUDR Compliance Packs - Pending Review</h3>
                  <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50">
                    {eudrPendingPacks?.length || 0} Pending Approval
                  </Badge>
                </div>

                {eudrPendingLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {(eudrPendingPacks || []).map((pack: any, index: number) => (
                      <Card key={pack.packId || index} className="bg-white shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-slate-900">{pack.farmerName}</h4>
                              <p className="text-sm text-slate-600">Exporter: {pack.exporterName}</p>
                              <p className="text-sm text-slate-600">Commodity: {pack.commodity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-700">Compliance Score: {pack.complianceScore}%</p>
                              <Badge className={`${pack.riskClassification === 'low' ? 'bg-green-100 text-green-800' :
                                pack.riskClassification === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}`}>
                                {pack.riskClassification?.toUpperCase()} Risk
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                Review
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Deforestation Monitoring */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-slate-900">Deforestation Monitoring & Alerts</h3>
                  <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
                    Real-time Satellite Monitoring Active
                  </Badge>
                </div>

                {deforestationLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {(deforestationAlerts?.slice(0, 5) || []).map((alert: any, index: number) => (
                      <Card key={alert.alertId || index} className="bg-white shadow-sm border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-slate-900 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                Deforestation Detected
                              </h4>
                              <p className="text-sm text-slate-600">Location: {alert.location || 'Protected Forest Area'}</p>
                              <p className="text-sm text-slate-600">Area: {alert.affectedAreaHectares || '2.3'} hectares</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">
                                Detected: {alert.detectionDate ? new Date(alert.detectionDate).toLocaleDateString() : 'Today'}
                              </p>
                              <Badge className="bg-red-100 text-red-800">
                                CRITICAL
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Satellite
                              </Button>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Investigate
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {(!deforestationAlerts || deforestationAlerts.length === 0) && (
                      <Card className="bg-white shadow-sm">
                        <CardContent className="p-6 text-center">
                          <TreePine className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <h4 className="font-medium text-slate-900">No Active Deforestation Alerts</h4>
                          <p className="text-sm text-slate-600">Forest areas are currently stable and protected</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}