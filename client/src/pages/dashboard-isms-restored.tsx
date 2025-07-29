import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Globe,
  Satellite,
  Shield,
  MapPin,
  Truck,
  Package,
  FileText,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function DashboardISMSRestored() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSatelliteDataOpen, setIsSatelliteDataOpen] = useState(false);
  const [isRiskAssessmentOpen, setIsRiskAssessmentOpen] = useState(false);
  const [isComplianceReportOpen, setIsComplianceReportOpen] = useState(false);
  const [isCertificatesOpen, setIsCertificatesOpen] = useState(false);

  // Get user info
  const userType = localStorage.getItem('userType') || 'regulatory';
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // EUDR Action Handlers
  const handleGenerateReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      compliance_rate: 96.4,
      deforestation_alerts: 3,
      certificates_issued: 127,
      farms_monitored: 1847
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eudr-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    toast({
      title: "EUDR Compliance Report Generated",
      description: "Report has been downloaded successfully.",
    });
  };

  const handleExportCertificates = () => {
    setIsCertificatesOpen(true);
  };

  const handleViewSatelliteData = () => {
    setIsSatelliteDataOpen(true);
  };

  const handleScheduleAssessment = () => {
    setIsRiskAssessmentOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>AgriTrace360™ LACRA Dashboard | Agricultural Compliance Management</title>
        <meta name="description" content="Comprehensive agricultural commodity compliance dashboard for LACRA - Liberia Agriculture Commodity Regulatory Authority. Real-time monitoring, EUDR compliance, and satellite tracking." />
      </Helmet>

      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 max-w-7xl mx-auto">
          <div className="space-y-8">
            
            {/* ISMS Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <BarChart3 className="h-10 w-10 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Agricultural Compliance Dashboard
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">
                    Real-time monitoring and compliance management system
                  </p>
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

            {/* Main Metrics Cards - ISMS Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="isms-card h-60 p-10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-600 text-sm font-medium">Total Commodities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold isms-gradient-text mb-2">1,247</div>
                  <p className="text-slate-500 text-sm">+12% this month</p>
                </CardContent>
              </Card>

              <Card className="isms-card h-60 p-10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-600 text-sm font-medium">Compliance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold isms-gradient-text mb-2">96.4%</div>
                  <p className="text-slate-500 text-sm">+2.1% vs last month</p>
                </CardContent>
              </Card>

              <Card className="isms-card h-60 p-10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-600 text-sm font-medium">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold isms-gradient-text mb-2">{unreadAlerts.length}</div>
                  <p className="text-slate-500 text-sm">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="isms-card h-60 p-10">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-600 text-sm font-medium">Certificates Issued</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold isms-gradient-text mb-2">342</div>
                  <p className="text-slate-500 text-sm">This quarter</p>
                </CardContent>
              </Card>
            </div>

            {/* EUDR Compliance Section */}
            <Card className="isms-card p-8">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="isms-gradient-text">EUDR Compliance Dashboard</CardTitle>
                    <p className="text-slate-600">EU Deforestation Regulation monitoring and compliance</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Button 
                    onClick={handleGenerateReport}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                    variant="outline"
                  >
                    <Download className="h-6 w-6" />
                    <span className="text-sm font-medium">Generate EUDR Report</span>
                  </Button>
                  
                  <Button 
                    onClick={handleExportCertificates}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                    variant="outline"
                  >
                    <Shield className="h-6 w-6" />
                    <span className="text-sm font-medium">Export Certificates</span>
                  </Button>
                  
                  <Button 
                    onClick={handleViewSatelliteData}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                    variant="outline"
                  >
                    <Satellite className="h-6 w-6" />
                    <span className="text-sm font-medium">Satellite Monitoring</span>
                  </Button>
                  
                  <Button 
                    onClick={handleScheduleAssessment}
                    className="h-auto p-4 flex flex-col items-center space-y-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200"
                    variant="outline"
                  >
                    <AlertTriangle className="h-6 w-6" />
                    <span className="text-sm font-medium">Risk Assessment</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Government Integration Status */}
            <Card className="isms-card p-8">
              <CardHeader>
                <CardTitle className="isms-gradient-text flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Government Integration Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">LRA Integration</h3>
                    <p className="text-sm text-green-600 font-medium">Connected</p>
                    <p className="text-xs text-slate-500 mt-1">Tax compliance synced</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">MOA Integration</h3>
                    <p className="text-sm text-green-600 font-medium">Connected</p>
                    <p className="text-xs text-slate-500 mt-1">Farm registrations synced</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800 mb-1">Customs Integration</h3>
                    <p className="text-sm text-green-600 font-medium">Connected</p>
                    <p className="text-xs text-slate-500 mt-1">Export declarations synced</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transportation Tracking */}
            <Card className="isms-card p-8">
              <CardHeader>
                <CardTitle className="isms-gradient-text flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Transportation Tracking
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
                    <p className="text-sm text-slate-600">Routes Completed</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">$2.4M</p>
                    <p className="text-sm text-slate-600">Cargo Value</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
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
            
            <div>
              <h4 className="font-semibold mb-3">Recent Deforestation Alerts</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">High Risk Alert - Nimba County</p>
                    <p className="text-sm text-red-600">Detected forest loss in monitored area</p>
                  </div>
                  <Badge variant="destructive">High</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">Medium Risk Alert - Lofa County</p>
                    <p className="text-sm text-yellow-600">Vegetation changes detected</p>
                  </div>
                  <Badge variant="secondary">Medium</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsSatelliteDataOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({ title: "Data Exported", description: "Satellite monitoring data has been exported successfully." });
                setIsSatelliteDataOpen(false);
              }}>
                Export Data
              </Button>
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
            <div>
              <label className="text-sm font-medium text-slate-700">Assessment Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deforestation">Deforestation Risk</SelectItem>
                  <SelectItem value="compliance">Compliance Assessment</SelectItem>
                  <SelectItem value="supply_chain">Supply Chain Risk</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Assessment</SelectItem>
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
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
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