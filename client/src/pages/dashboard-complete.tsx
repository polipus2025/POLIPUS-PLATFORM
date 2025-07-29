import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ModernBackground from "@/components/ui/modern-background";
import MetricsCards from "@/components/dashboard/metrics-cards";
import ComplianceChart from "@/components/dashboard/compliance-chart";
import RegionalMap from "@/components/dashboard/regional-map";
import InspectionsTable from "@/components/dashboard/inspections-table";
import QuickActions from "@/components/dashboard/quick-actions";
import SystemAlerts from "@/components/dashboard/system-alerts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Download, Shield, TreePine, FileCheck, AlertTriangle, Building2, CheckCircle, Clock, XCircle, Plus, Upload, MessageSquare, Bell, Eye, X, Activity, TrendingUp, Package, MapPin, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  // Authentication check
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  
  if (!authToken) {
    window.location.href = "/regulatory-login";
    return null;
  }

  // State for all dashboard functionality
  const [isEudrDialogOpen, setIsEudrDialogOpen] = useState(false);
  const [selectedExporter, setSelectedExporter] = useState<string>("all");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [isMessagesDialogOpen, setIsMessagesDialogOpen] = useState(false);
  
  // EUDR Compliance Action states
  const [isEudrReportGenerating, setIsEudrReportGenerating] = useState(false);
  const [isExportingCertificates, setIsExportingCertificates] = useState(false);
  const [isSatelliteDataOpen, setIsSatelliteDataOpen] = useState(false);
  const [isRiskAssessmentOpen, setIsRiskAssessmentOpen] = useState(false);
  
  // Real-time testing state
  const [isTestingActive, setIsTestingActive] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testProgress, setTestProgress] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch alerts and messages
  const { data: alerts = [] } = useQuery({
    queryKey: ['/api/alerts'],
    queryFn: () => apiRequest('/api/alerts'),
  });

  const { data: unreadAlerts = [] } = useQuery({
    queryKey: ['/api/alerts', 'unread'],
    queryFn: () => apiRequest('/api/alerts?unreadOnly=true'),
  });

  // Mark alert as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return apiRequest(`/api/alerts/${alertId}/mark-read`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      toast({
        title: 'Message marked as read',
        description: 'The message has been marked as read successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to mark message as read. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Layout with sidebar
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Helmet>
        <title>AgriTrace360™ LACRA Dashboard | Agricultural Compliance Management</title>
        <meta name="description" content="Comprehensive agricultural commodity compliance dashboard for LACRA - Liberia Agriculture Commodity Regulatory Authority. Real-time monitoring, EUDR compliance, and satellite tracking." />
      </Helmet>

      <ModernBackground />
      
      {/* Layout with Sidebar */}
      <div className="flex min-h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6">
            {/* Welcome Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-200/50">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Agricultural Compliance Dashboard</h1>
                  <p className="text-slate-600">Real-time monitoring and compliance management system</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      System Operational
                    </Badge>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {userType === 'regulatory' ? 'LACRA Administrator' : 'User'}: admin001
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Cards */}
            <MetricsCards />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Chart */}
              <div className="lg:col-span-1">
                <ComplianceChart />
              </div>
              
              {/* Regional Map */}
              <div className="lg:col-span-1">
                <RegionalMap />
              </div>
            </div>

            {/* EUDR Compliance Section - Full Width */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                    <TreePine className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">EUDR Compliance Dashboard</h3>
                    <p className="text-slate-600">EU Deforestation Regulation Monitoring & Risk Assessment</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Compliance Overview */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Compliance Overview</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Overall Compliance</span>
                        <span className="text-2xl font-bold text-green-600">87.3%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full" style={{width: '87.3%'}}></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-xl font-bold text-green-600">1,247</p>
                          <p className="text-xs text-slate-600">Compliant</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-xl font-bold text-orange-600">186</p>
                          <p className="text-xs text-slate-600">Pending</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Satellite Monitoring */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Satellite Monitoring</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700">Coverage Rate</span>
                        <span className="text-2xl font-bold text-blue-600">98.5%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full" style={{width: '98.5%'}}></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-xl font-bold text-blue-600">127</p>
                          <p className="text-xs text-slate-600">Satellites</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-xl font-bold text-red-600">3</p>
                          <p className="text-xs text-slate-600">New Alerts</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EUDR Actions */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-slate-800 mb-3">EUDR Actions</h4>
                    <Button 
                      onClick={() => {
                        setIsEudrReportGenerating(true);
                        toast({ title: "Generating EUDR Report", description: "Compliance report is being generated..." });
                        setTimeout(() => setIsEudrReportGenerating(false), 3000);
                      }}
                      disabled={isEudrReportGenerating}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {isEudrReportGenerating ? 'Generating...' : 'Generate EUDR Report'}
                    </Button>
                    <Button 
                      onClick={() => {
                        setIsExportingCertificates(true);
                        toast({ title: "Exporting Certificates", description: "Deforestation certificates are being exported..." });
                        setTimeout(() => setIsExportingCertificates(false), 2500);
                      }}
                      disabled={isExportingCertificates}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {isExportingCertificates ? 'Exporting...' : 'Export Certificates'}
                    </Button>
                    <Button 
                      onClick={() => setIsSatelliteDataOpen(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Satellite Data
                    </Button>
                    <Button 
                      onClick={() => setIsRiskAssessmentOpen(true)}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Schedule Risk Assessment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government Integration Status */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Government Integration Status</h3>
                    <p className="text-slate-600">Real-time synchronization with government agencies</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* LRA Integration */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">Liberia Revenue Authority</h4>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Tax Assessments</span>
                        <Badge className="bg-green-100 text-green-800">Synced</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Update</span>
                        <span className="font-medium">2 mins ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Records</span>
                        <span className="font-medium">2,847</span>
                      </div>
                    </div>
                  </div>

                  {/* MOA Integration */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">Ministry of Agriculture</h4>
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Registrations</span>
                        <Badge className="bg-green-100 text-green-800">Synced</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Update</span>
                        <span className="font-medium">5 mins ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Farmers</span>
                        <span className="font-medium">1,924</span>
                      </div>
                    </div>
                  </div>

                  {/* Customs Integration */}
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800">Customs Authority</h4>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Declarations</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Last Update</span>
                        <span className="font-medium">12 mins ago</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Exports</span>
                        <span className="font-medium">143</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Grid - Inspections, Quick Actions, System Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <InspectionsTable />
              </div>
              <div className="space-y-6">
                <QuickActions />
                <SystemAlerts />
              </div>
            </div>

            {/* Transportation Tracking - Full Width */}
            <Card className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Transportation & Logistics Tracking</h3>
                    <p className="text-slate-600">Real-time vehicle monitoring and cargo tracking</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">24</p>
                    <p className="text-sm text-slate-600">Active Vehicles</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">127</p>
                    <p className="text-sm text-slate-600">QR Scans Today</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">95.2%</p>
                    <p className="text-sm text-slate-600">GPS Accuracy</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">8</p>
                    <p className="text-sm text-slate-600">Pending Deliveries</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <p className="text-2xl font-bold text-indigo-600">347</p>
                    <p className="text-sm text-slate-600">Route Completed</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">$2.4M</p>
                    <p className="text-sm text-slate-600">Cargo Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      {/* Satellite Data Dialog */}
      <Dialog open={isSatelliteDataOpen} onOpenChange={setIsSatelliteDataOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Satellite Monitoring Data - EUDR Compliance</DialogTitle>
            <DialogDescription>
              Real-time satellite monitoring for deforestation tracking and compliance verification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Satellite Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">127</p>
                <p className="text-sm text-slate-600">Active Satellites</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">98.5%</p>
                <p className="text-sm text-slate-600">Coverage Rate</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-sm text-slate-600">New Alerts</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">45</p>
                <p className="text-sm text-slate-600">Resolved This Month</p>
              </div>
            </div>
            
            {/* Recent Alerts */}
            <div>
              <h4 className="font-semibold mb-3">Recent Deforestation Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-slate-800">Forest Loss Detected</p>
                      <p className="text-sm text-slate-600">Lofa County - Grid 23A (GPS: 8.19°N, 9.72°W)</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800">High Risk</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-slate-800">Monitoring Required</p>
                      <p className="text-sm text-slate-600">Nimba County - Grid 45C (GPS: 7.50°N, 8.70°W)</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-slate-800">Area Cleared</p>
                      <p className="text-sm text-slate-600">Grand Bassa County - Grid 12B (GPS: 6.23°N, 9.81°W)</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Risk Assessment Dialog */}
      <Dialog open={isRiskAssessmentOpen} onOpenChange={setIsRiskAssessmentOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Risk Assessment</DialogTitle>
            <DialogDescription>
              Schedule a comprehensive risk assessment for EUDR compliance monitoring
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Assessment Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Compliance Audit</SelectItem>
                    <SelectItem value="targeted">Targeted Assessment</SelectItem>
                    <SelectItem value="followup">Follow-up Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Priority Level</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Target County</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Counties</SelectItem>
                  <SelectItem value="montserrado">Montserrado</SelectItem>
                  <SelectItem value="lofa">Lofa</SelectItem>
                  <SelectItem value="nimba">Nimba</SelectItem>
                  <SelectItem value="bong">Bong</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRiskAssessmentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({ title: "Assessment Scheduled", description: "Risk assessment has been scheduled successfully." });
                setIsRiskAssessmentOpen(false);
              }}>
                Schedule Assessment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}