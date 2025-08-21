import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, Shield, TreePine, FileCheck, AlertTriangle, Building2, 
  CheckCircle, Clock, XCircle, Plus, Upload, MessageSquare, Bell, 
  Eye, X, Activity, TrendingUp, Package, MapPin, Users, BarChart3,
  ArrowLeft, Settings, Database, Server
} from "lucide-react";
import { Link } from "wouter";

export default function RegulatoryPortalClassic() {
  const [selectedExporter, setSelectedExporter] = useState<string>("all");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [isEudrDialogOpen, setIsEudrDialogOpen] = useState(false);
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [isMessagesDialogOpen, setIsMessagesDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check user authentication
  const userType = localStorage.getItem("userType");
  const userRole = localStorage.getItem("userRole");
  const username = localStorage.getItem("username") || "Administrator";

  // Fetch dashboard data
  const { data: alerts = [] } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: () => apiRequest('/api/alerts'),
  });

  const { data: exporters = [] } = useQuery({
    queryKey: ['/api/exporters'],
    queryFn: () => apiRequest('/api/exporters'),
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ['/api/farmers'],
    queryFn: () => apiRequest('/api/farmers'),
  });

  const { data: inspections = [] } = useQuery({
    queryKey: ['/api/inspections'],
    queryFn: () => apiRequest('/api/inspections'),
  });

  // Mock dashboard statistics
  const dashboardStats = {
    totalExporters: 45,
    activeExporters: 38,
    totalFarmers: 1247,
    activeFarmers: 982,
    pendingInspections: 23,
    completedInspections: 156,
    complianceRate: 94.2,
    eudrCompliant: 87.5,
    systemUptime: 99.8,
    activeAlerts: 7
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Regulatory Portal (Classic) - LACRA AgriTrace360™</title>
        <meta name="description" content="Classic regulatory control center for Liberia Agriculture Commodity Regulatory Authority" />
      </Helmet>

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Platform
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">LACRA Regulatory Portal</h1>
              <p className="text-slate-600">Classic unified regulatory control center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              System Operational
            </Badge>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Exporters</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalExporters}</p>
                  <p className="text-xs text-green-600">{dashboardStats.activeExporters} active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Registered Farmers</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalFarmers.toLocaleString()}</p>
                  <p className="text-xs text-green-600">{dashboardStats.activeFarmers} active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">EUDR Compliance</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.eudrCompliant}%</p>
                  <p className="text-xs text-green-600">Industry leading</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inspections</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.completedInspections}</p>
                  <p className="text-xs text-yellow-600">{dashboardStats.pendingInspections} pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-100 rounded-lg p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="exporters">Exporters</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="compliance">EUDR Compliance</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" onClick={() => setIsEudrDialogOpen(true)}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Generate EUDR Compliance Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Inspectors
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="w-4 h-4 mr-2" />
                    Review Exporter Applications
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    View System Alerts
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">New exporter approved</p>
                        <p className="text-xs text-gray-500">Golden Harvest Ltd. - 2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <FileCheck className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">EUDR certificate issued</p>
                        <p className="text-xs text-gray-500">Farmer ID: FRM-2024-156 - 4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium">Inspection required</p>
                        <p className="text-xs text-gray-500">Montserrado County - 6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Exporters Tab */}
          <TabsContent value="exporters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Exporter Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4">
                  <Select value={selectedExporter} onValueChange={setSelectedExporter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select exporter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Exporters</SelectItem>
                      <SelectItem value="active">Active Only</SelectItem>
                      <SelectItem value="pending">Pending Approval</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Exporter
                  </Button>
                </div>
                <div className="text-center py-8 text-gray-500">
                  Exporter management interface will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>System Uptime</span>
                      <Badge className="bg-green-100 text-green-800">{dashboardStats.systemUptime}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Database Status</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>API Response Time</span>
                      <Badge className="bg-green-100 text-green-800">245ms</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Users</span>
                      <Badge className="bg-blue-100 text-blue-800">127</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Database className="w-4 h-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    System Health Check
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    User Management
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    System Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* EUDR Dialog */}
      <Dialog open={isEudrDialogOpen} onOpenChange={setIsEudrDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate EUDR Compliance Report</DialogTitle>
            <DialogDescription>
              Generate a comprehensive EUDR compliance report for all registered exporters and farmers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button className="w-full" onClick={() => {
              toast({
                title: "Report Generated",
                description: "EUDR compliance report has been generated successfully.",
              });
              setIsEudrDialogOpen(false);
            }}>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}