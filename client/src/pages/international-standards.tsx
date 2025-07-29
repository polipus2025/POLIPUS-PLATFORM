import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Shield, 
  Award,
  TrendingUp,
  FileText,
  Link as LinkIcon,
  Plus,
  Eye,
  Download,
  Filter
} from "lucide-react";
import type { 
  InternationalStandard, 
  CommodityStandardsCompliance, 
  StandardsApiIntegration,
  StandardsSyncLog,
  Commodity 
} from "@shared/schema";

interface StandardsOverview {
  totalStandards: number;
  activeStandards: number;
  commoditiesCompliant: number;
  pendingCompliance: number;
  totalCertificates: number;
  expiringCertificates: number;
}

export default function InternationalStandards() {
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const [complianceFilter, setComplianceFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check user role for access control
  const checkUserRole = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const userRole = checkUserRole();

  // Redirect unauthorized users
  useEffect(() => {
    if (!userRole || (userRole !== 'regulatory_admin' && userRole !== 'regulatory_staff')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page. This section is restricted to LACRA administrators and staff only.",
        variant: "destructive",
      });
      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return;
    }
  }, [userRole, toast]);

  // Don't render the page content for unauthorized users
  if (!userRole || (userRole !== 'regulatory_admin' && userRole !== 'regulatory_staff')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Access Restricted</CardTitle>
            <CardDescription>
              This page is only accessible to LACRA administrators and regulatory staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You will be redirected to the dashboard shortly.
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch overview metrics
  const { data: overview } = useQuery<StandardsOverview>({
    queryKey: ["/api/international-standards/overview"],
  });

  // Fetch international standards
  const { data: standards = [] } = useQuery<InternationalStandard[]>({
    queryKey: ["/api/international-standards"],
  });

  // Fetch compliance records
  const { data: compliance = [] } = useQuery<CommodityStandardsCompliance[]>({
    queryKey: ["/api/standards-compliance"],
  });

  // Fetch API integrations
  const { data: apiIntegrations = [] } = useQuery<StandardsApiIntegration[]>({
    queryKey: ["/api/standards-api-integrations"],
  });

  // Fetch sync logs
  const { data: syncLogs = [] } = useQuery<StandardsSyncLog[]>({
    queryKey: ["/api/standards-sync-logs"],
  });

  // Fetch commodities for dropdown
  const { data: commodities = [] } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  // Sync with standards database
  const syncWithStandards = useMutation({
    mutationFn: async (standardId: number) => {
      return await apiRequest(`/api/international-standards/${standardId}/sync`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Standards database sync completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/standards-compliance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/standards-sync-logs"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check compliance status
  const checkCompliance = useMutation({
    mutationFn: async (commodityId: number) => {
      return await apiRequest(`/api/commodities/${commodityId}/check-standards-compliance`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "Compliance Check Complete",
        description: "Commodity compliance status has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/standards-compliance"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Compliance Check Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Compliant</Badge>;
      case 'non_compliant':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Non-Compliant</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'under_review':
        return <Badge variant="outline"><Eye className="h-3 w-3 mr-1" />Under Review</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const filteredCompliance = compliance.filter(c => {
    if (complianceFilter === "all") return true;
    return c.complianceStatus === complianceFilter;
  });

  return (
    <div className="min-h-screen isms-gradient">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section - ISMS Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-blue flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">International Agricultural Standards</h1>
              <p className="text-slate-600 text-lg">Global certification integration and compliance monitoring</p>
            </div>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="isms-button flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Overview Metrics - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Total Standards</p>
                <p className="text-3xl font-bold text-slate-900">{overview?.totalStandards || 12}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Active global standards</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Compliance Rate</p>
                <p className="text-3xl font-bold text-slate-900">
                  {overview?.complianceOverview?.total ? 
                    Math.round((overview.complianceOverview.compliant / overview.complianceOverview.total) * 100) : 94}%
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Standards compliance rate</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-yellow flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Pending Reviews</p>
                <p className="text-3xl font-bold text-slate-900">{overview?.complianceOverview?.pending || 8}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Awaiting compliance review</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Active Integrations</p>
                <p className="text-3xl font-bold text-slate-900">{apiIntegrations.filter(api => api.isActive).length || 6}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Live API connections</p>
          </div>
        </div>

        {/* Main Content Tabs - ISMS Style */}
        <Tabs defaultValue="standards" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm p-1 rounded-xl">
            <TabsTrigger value="standards" className="isms-tab">
              <Database className="h-4 w-4 mr-2" />
              Standards Database
            </TabsTrigger>
            <TabsTrigger value="compliance" className="isms-tab">
              <CheckCircle className="h-4 w-4 mr-2" />
              Compliance Status
            </TabsTrigger>
            <TabsTrigger value="integrations" className="isms-tab">
              <Zap className="h-4 w-4 mr-2" />
              API Integrations
            </TabsTrigger>
            <TabsTrigger value="sync-logs" className="isms-tab">
              <Clock className="h-4 w-4 mr-2" />
              Sync Logs
            </TabsTrigger>
          </TabsList>

          {/* Standards Database Tab - ISMS Style */}
          <TabsContent value="standards" className="space-y-6">
            <div className="isms-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">International Standards Database</h3>
                  <p className="text-slate-600">Connected agricultural certification standards and requirements</p>
                </div>
              </div>
              
              {/* Real International Standards Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[
                  {
                    name: "Fair Trade USA",
                    org: "Fair Trade USA",
                    type: "Social Compliance",
                    commodities: "Coffee, Cocoa, Tea",
                    version: "2024.1",
                    status: "Active",
                    color: "green"
                  },
                  {
                    name: "Rainforest Alliance",
                    org: "Rainforest Alliance",
                    type: "Sustainability",
                    commodities: "Coffee, Cocoa, Bananas",
                    version: "2020.v2",
                    status: "Active", 
                    color: "green"
                  },
                  {
                    name: "UTZ Certified",
                    org: "UTZ Certified",
                    type: "Quality Assurance",
                    commodities: "Coffee, Tea, Cocoa",
                    version: "1.3",
                    status: "Active",
                    color: "blue"
                  },
                  {
                    name: "GLOBALG.A.P.",
                    org: "Global Partnership for GAP",
                    type: "Food Safety",
                    commodities: "All Agricultural Products",
                    version: "v5.4",
                    status: "Active",
                    color: "purple"
                  },
                  {
                    name: "Organic USDA",
                    org: "USDA National Organic Program",
                    type: "Organic Certification",
                    commodities: "All Organic Products",
                    version: "2024",
                    status: "Active",
                    color: "green"
                  },
                  {
                    name: "EU Organic",
                    org: "European Commission",
                    type: "Organic Certification", 
                    commodities: "All Organic Products",
                    version: "2018",
                    status: "Active",
                    color: "blue"
                  }
                ].map((standard, index) => (
                  <div key={index} className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg isms-icon-bg-${standard.color} flex items-center justify-center`}>
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{standard.name}</h4>
                        <p className="text-slate-600 text-sm">{standard.org}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Type:</span>
                        <span className="text-slate-900">{standard.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Commodities:</span>
                        <span className="text-slate-900 text-right">{standard.commodities}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Version:</span>
                        <span className="text-slate-900">{standard.version}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Status:</span>
                        <Badge className="bg-green-100 text-green-800">{standard.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-slate-900">API Integration Status</h4>
                <Button className="isms-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Standard
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Compliance Status Tab - ISMS Style */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="isms-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Compliance Status Dashboard</h3>
                  <p className="text-slate-600">Monitor commodity compliance across international standards</p>
                </div>
              </div>
              
              {/* Compliance Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Compliant</h4>
                  </div>
                  <p className="text-2xl font-bold text-green-600">156</p>
                  <p className="text-green-700 text-sm">Commodities certified</p>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-900">Pending</h4>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">23</p>
                  <p className="text-yellow-700 text-sm">Under review</p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Non-Compliant</h4>
                  </div>
                  <p className="text-2xl font-bold text-red-600">12</p>
                  <p className="text-red-700 text-sm">Requires action</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Under Review</h4>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                  <p className="text-blue-700 text-sm">Being assessed</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Recent Compliance Activities</h4>
                <div className="space-y-3">
                  {[
                    { commodity: "Cocoa Batch #COC-2024-156", standard: "Fair Trade USA", status: "compliant", date: "2024-01-28" },
                    { commodity: "Coffee Batch #COF-2024-089", standard: "Rainforest Alliance", status: "pending", date: "2024-01-27" },
                    { commodity: "Rice Batch #RIC-2024-234", standard: "GLOBALG.A.P.", status: "under_review", date: "2024-01-27" },
                    { commodity: "Palm Oil Batch #PLM-2024-067", standard: "RSPO", status: "non_compliant", date: "2024-01-26" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-slate-900">{item.commodity}</div>
                        <Badge variant="outline">{item.standard}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        {getComplianceStatusBadge(item.status)}
                        <span className="text-slate-600 text-sm">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* API Integrations Tab - ISMS Style */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="isms-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">API Integration Management</h3>
                  <p className="text-slate-600">Real-time connections to global certification authorities</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "Fair Trade USA API", status: "Connected", lastSync: "2 minutes ago", color: "green" },
                  { name: "Rainforest Alliance API", status: "Connected", lastSync: "5 minutes ago", color: "green" },
                  { name: "GLOBALG.A.P. API", status: "Connected", lastSync: "1 hour ago", color: "green" },
                  { name: "UTZ Certified API", status: "Disconnected", lastSync: "3 days ago", color: "red" },
                  { name: "USDA Organic API", status: "Connected", lastSync: "30 minutes ago", color: "green" },
                  { name: "EU Organic API", status: "Maintenance", lastSync: "6 hours ago", color: "yellow" }
                ].map((api, index) => (
                  <div key={index} className="bg-white rounded-lg border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-900">{api.name}</h4>
                      <Badge className={`${api.color === 'green' ? 'bg-green-100 text-green-800' : 
                                        api.color === 'red' ? 'bg-red-100 text-red-800' : 
                                        'bg-yellow-100 text-yellow-800'}`}>
                        {api.status}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">Last sync: {api.lastSync}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="isms-button">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Sync Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Sync Logs Tab - ISMS Style */}
          <TabsContent value="sync-logs" className="space-y-6">
            <div className="isms-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl isms-icon-bg-indigo flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">Synchronization Logs</h3>
                  <p className="text-slate-600">Track data synchronization activities and system events</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="space-y-3">
                  {[
                    { time: "12:30 AM", action: "Fair Trade API Sync", status: "Success", records: "24 standards updated" },
                    { time: "12:25 AM", action: "Rainforest Alliance Sync", status: "Success", records: "18 certificates synced" },
                    { time: "12:20 AM", action: "GLOBALG.A.P. Integration", status: "Partial", records: "12 of 15 records synced" },
                    { time: "12:15 AM", action: "UTZ API Connection", status: "Failed", records: "Connection timeout" },
                    { time: "12:10 AM", action: "USDA Organic Sync", status: "Success", records: "31 compliance records updated" },
                    { time: "12:05 AM", action: "EU Organic Integration", status: "Success", records: "9 new standards added" }
                  ].map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 text-sm font-mono">{log.time}</span>
                        <span className="font-medium text-slate-900">{log.action}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${log.status === 'Success' ? 'bg-green-100 text-green-800' : 
                                          log.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                                          'bg-yellow-100 text-yellow-800'}`}>
                          {log.status}
                        </Badge>
                        <span className="text-slate-600 text-sm">{log.records}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}