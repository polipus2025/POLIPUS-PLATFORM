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
  Pause
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function DDGOTSDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('operations');

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

  const handleLogout = () => {
    localStorage.removeItem('ddgotsToken');
    localStorage.removeItem('ddgotsUser');
    navigate('/auth/regulatory-login');
  };

  const handleInspectorManagement = () => {
    navigate('/regulatory/inspector-management');
  };

  const handleBuyerManagement = () => {
    navigate('/regulatory/buyer-management');
  };

  const handleExporterManagement = () => {
    navigate('/regulatory/exporter-management');
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Cog className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">DDGOTS Dashboard</h1>
                <p className="text-slate-600">Operations & Technical Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
                <Settings className="w-4 h-4 mr-1" />
                Operations Access
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Operations Overview
            </TabsTrigger>
            <TabsTrigger value="inspectors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Inspector Management
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileCheck className="w-4 h-4" />
              Inspection Reports
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Technical Compliance
            </TabsTrigger>
          </TabsList>

          {/* Operations Overview */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">Active Inspectors</CardTitle>
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Users className="w-5 h-5 text-emerald-600" />
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

              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">Pending Reports</CardTitle>
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FileCheck className="w-5 h-5 text-amber-600" />
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

              <Card className="bg-white shadow-lg border-0">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-900">Compliance Rate</CardTitle>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
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
        </Tabs>
      </div>
    </div>
  );
}