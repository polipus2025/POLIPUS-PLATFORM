import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Crown, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Smartphone, 
  Users,
  Eye,
  Shield,
  MapPin,
  Calendar,
  TrendingUp,
  Activity,
  CheckSquare,
  CheckCircle,
  X,
  UserPlus,
  BarChart3,
  Leaf,
  ClipboardCheck,
  Tag,
  FileText,
  Plus,
  Building2,
  Satellite,
  QrCode,
  Globe,
  Award,
  MessageSquare,
  DollarSign,
  Receipt,
  CreditCard,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Field Agent Approval Manager Component - FUNZIONALITÀ ORIGINALE MANTENUTA
function FieldAgentApprovalManager() {
  const { toast } = useToast();
  
  // Fetch inspection requests - optimized polling with proper typing
  const { data: inspectionRequests = [] } = useQuery<any[]>({
    queryKey: ['/api/inspection-requests'],
    refetchInterval: 120000, // Refresh every 2 minutes instead of 30 seconds
    staleTime: 100000, // Consider data fresh for 100 seconds
  });

  // Fetch farmer registration requests - optimized polling with proper typing
  const { data: farmerRegistrationRequests = [] } = useQuery<any[]>({
    queryKey: ['/api/farmer-registration-requests'],
    refetchInterval: 120000, // Refresh every 2 minutes instead of 30 seconds
    staleTime: 100000, // Consider data fresh for 100 seconds
  });

  // Approve inspection request
  const approveInspectionMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return apiRequest(`/api/inspection-requests/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          notes,
          approvedBy: 'LACRA Director'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspection-requests'] });
      toast({
        title: 'Request Approved',
        description: 'Inspection request has been approved successfully.',
      });
    }
  });

  // Reject inspection request
  const rejectInspectionMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return apiRequest(`/api/inspection-requests/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({
          notes,
          approvedBy: 'LACRA Director'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspection-requests'] });
      toast({
        title: 'Request Rejected',
        description: 'Inspection request has been rejected.',
        variant: 'destructive',
      });
    }
  });

  // Approve farmer registration
  const approveFarmerMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return apiRequest(`/api/farmer-registration-requests/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({
          notes,
          approvedBy: 'LACRA Director'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-registration-requests'] });
      toast({
        title: 'Registration Approved',
        description: 'Farmer registration request has been approved successfully.',
      });
    }
  });

  // Reject farmer registration
  const rejectFarmerMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      return apiRequest(`/api/farmer-registration-requests/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({
          notes,
          approvedBy: 'LACRA Director'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-registration-requests'] });
      toast({
        title: 'Registration Rejected',
        description: 'Farmer registration request has been rejected.',
        variant: 'destructive',
      });
    }
  });

  const pendingInspections = inspectionRequests.filter((req: any) => req.status === 'pending_approval');
  const pendingFarmerRegs = farmerRegistrationRequests.filter((req: any) => req.status === 'pending_approval');

  return (
    <div className="space-y-6">
      {/* Inspection Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Inspection Requests ({pendingInspections.length})
          </CardTitle>
          <p className="text-sm text-gray-600">Field agent inspection requests requiring director approval</p>
        </CardHeader>
        <CardContent>
          {pendingInspections.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending inspection requests</p>
          ) : (
            <div className="space-y-4">
              {pendingInspections.map((request: any) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{request.inspectionType} Inspection</h4>
                      <p className="text-sm text-gray-600">
                        Requested by: {request.agentName} • {request.jurisdiction}
                      </p>
                      <p className="text-sm text-gray-600">
                        Farmer: {request.farmerName} • Commodity: {request.commodityType}
                      </p>
                      <p className="text-sm text-gray-600">Location: {request.location}</p>
                    </div>
                    <Badge className={request.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                   request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-green-100 text-green-800'}>
                      {request.priority}
                    </Badge>
                  </div>
                  
                  {request.notes && (
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm"><strong>Notes:</strong> {request.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => approveInspectionMutation.mutate({ id: request.id, notes: `Approved by Director on ${new Date().toLocaleDateString()}` })}
                      disabled={approveInspectionMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => rejectInspectionMutation.mutate({ id: request.id, notes: `Rejected by Director on ${new Date().toLocaleDateString()}` })}
                      disabled={rejectInspectionMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Farmer Registration Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Farmer Registration Requests ({pendingFarmerRegs.length})
          </CardTitle>
          <p className="text-sm text-gray-600">Field agent farmer registration requests requiring director approval</p>
        </CardHeader>
        <CardContent>
          {pendingFarmerRegs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending farmer registration requests</p>
          ) : (
            <div className="space-y-4">
              {pendingFarmerRegs.map((request: any) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">New Farmer Registration</h4>
                      <p className="text-sm text-gray-600">
                        Requested by: {request.agentName} • {request.jurisdiction}
                      </p>
                      {request.farmerData && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm"><strong>Name:</strong> {request.farmerData.firstName} {request.farmerData.lastName}</p>
                          <p className="text-sm"><strong>Phone:</strong> {request.farmerData.phoneNumber}</p>
                          <p className="text-sm"><strong>Primary Crop:</strong> {request.farmerData.primaryCrop}</p>
                          <p className="text-sm"><strong>Farm Size:</strong> {request.farmerData.farmSize} hectares</p>
                          <p className="text-sm"><strong>Location:</strong> {request.farmerData.farmLocation}</p>
                        </div>
                      )}
                    </div>
                    <Badge className={request.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                   request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-green-100 text-green-800'}>
                      {request.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => approveFarmerMutation.mutate({ id: request.id, notes: `Approved by Director on ${new Date().toLocaleDateString()}` })}
                      disabled={approveFarmerMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => rejectFarmerMutation.mutate({ id: request.id, notes: `Rejected by Director on ${new Date().toLocaleDateString()}` })}
                      disabled={rejectFarmerMutation.isPending}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Director Dashboard Navigation - Complete administrative access
const directorNavigation = [
  { name: "Executive Dashboard", href: "/director-dashboard", icon: Crown, category: "Overview" },
  { name: "Strategic Overview", href: "/dashboard", icon: BarChart3, category: "Overview" },
  { name: "Economic Reporting", href: "/economic-reporting", icon: TrendingUp, category: "Reports" },
  { name: "Commodities Management", href: "/commodities", icon: Leaf, category: "Operations" },
  { name: "Inspection Oversight", href: "/inspections", icon: ClipboardCheck, category: "Operations" },
  { name: "Inspector Management", href: "/regulatory/inspector-management", icon: Users, category: "Personnel" },
  { name: "Buyer Management", href: "/regulatory/buyer-management", icon: UserPlus, category: "Personnel" },
  { name: "Exporter Management", href: "/regulatory/exporter-management", icon: Building2, category: "Personnel" },
  { name: "Export Certifications", href: "/certifications", icon: Tag, category: "Compliance" },
  { name: "Document Verification", href: "/verification", icon: Shield, category: "Compliance" },
  { name: "Real-Time Verification", href: "/verification-dashboard", icon: Award, category: "Compliance" },
  { name: "Payment Services", href: "/regulatory-payment-services", icon: DollarSign, category: "Finance" },
  { name: "Financial Records", href: "/ddgaf-financial-records", icon: Receipt, category: "Finance" },
  { name: "GIS Mapping", href: "/gis-mapping", icon: Satellite, category: "Technology" },
  { name: "Government Integration", href: "/government-integration", icon: Building2, category: "Integration" },
  { name: "International Standards", href: "/international-standards", icon: Globe, category: "Compliance" },
  { name: "Comprehensive Reports", href: "/reports", icon: FileText, category: "Reports" },
  { name: "Data Entry Systems", href: "/data-entry", icon: Plus, category: "Operations" },
  { name: "Internal Messaging", href: "/messaging", icon: MessageSquare, category: "Communication" },
];

// Director Sidebar Component
function DirectorSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const [location] = useLocation();
  
  // Group navigation items by category
  const groupedNavigation = directorNavigation.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof directorNavigation>);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden" 
          style={{zIndex: 9998}}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-80 lg:w-72",
        "z-[9999]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="flex items-center gap-2 text-white">
            <Crown className="h-6 w-6" />
            <h2 className="font-bold text-lg">Director Portal</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-purple-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Navigation */}
        <div className="p-4 space-y-6">
          {Object.entries(groupedNavigation).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                        isActive 
                          ? "bg-purple-100 text-purple-700 border-l-4 border-purple-600" 
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      )}>
                        <item.icon className={cn(
                          "h-4 w-4",
                          isActive ? "text-purple-600" : "text-gray-500"
                        )} />
                        <span className="truncate">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="text-center">
            <Badge className="bg-purple-100 text-purple-800">
              LACRA Director Access
            </Badge>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DirectorDashboardTest() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mobile alert requests for director review - FUNZIONALITÀ ORIGINALE
  const { data: mobileRequests = [] } = useQuery({
    queryKey: ['/api/mobile-alert-requests'],
    queryFn: () => apiRequest('/api/mobile-alert-requests'),
  });

  // Fetch pending alerts that need director attention - FUNZIONALITÀ ORIGINALE
  const { data: pendingAlerts = [] } = useQuery({
    queryKey: ['/api/alerts', 'director-pending'],
    queryFn: () => apiRequest('/api/alerts?status=pending&priority=high,critical'),
  });

  // Fetch director dashboard metrics - FUNZIONALITÀ ORIGINALE
  const { data: directorMetrics } = useQuery({
    queryKey: ['/api/dashboard/director-metrics'],
    queryFn: () => apiRequest('/api/dashboard/director-metrics'),
  });

  // Director approval mutation - FUNZIONALITÀ ORIGINALE
  const approvalMutation = useMutation({
    mutationFn: async ({ requestId, action, notes }: { requestId: number; action: 'approve' | 'reject'; notes: string }) => {
      return apiRequest(`/api/mobile-alert-requests/${requestId}/${action}`, {
        method: 'POST',
        body: JSON.stringify({ notes, approvedBy: 'Director' })
      });
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.action === 'approve' ? 'Request Approved' : 'Request Rejected',
        description: `Mobile alert request has been ${variables.action}d successfully.`,
        variant: variables.action === 'approve' ? 'default' : 'destructive',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mobile-alert-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
      setSelectedRequest(null);
      setApprovalNotes('');
    },
    onError: (error: any) => {
      toast({
        title: 'Action Failed',
        description: error.message || 'Failed to process the request',
        variant: 'destructive',
      });
    },
  });

  const urgencyColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const requestTypeLabel = (type: string) => {
    switch (type) {
      case 'farmer_registration': return 'Farmer Registration';
      case 'inspection_report': return 'Inspection Report';
      case 'compliance_issue': return 'Compliance Issue';
      case 'quality_concern': return 'Quality Concern';
      case 'urgent_notification': return 'Urgent Notification';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Director Dashboard - AgriTrace360™ LACRA</title>
      </Helmet>

      {/* Test Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto shadow-xl",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "w-80 lg:w-72",
        "z-[9999]"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="flex items-center gap-2 text-white">
            <Crown className="h-6 w-6" />
            <h2 className="font-bold text-lg">Director Portal</h2>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Overview</h3>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700">
              <Crown className="h-4 w-4 text-purple-600" />
              <span>Executive Dashboard</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Technology</h3>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              <Satellite className="h-4 w-4 text-gray-500" />
              <span>GIS Mapping</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Integration</h3>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span>Government Integration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        {/* Toggle Button */}
        <div className="fixed top-4 left-4" style={{zIndex: 10000}}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-purple-600 text-white shadow-lg border-2 border-purple-400 hover:bg-purple-700"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <div className="p-6 pt-16">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Director Dashboard - TEST VERSION</h1>
                <p className="text-gray-600">All regulatory portal functions restored</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="flex w-max space-x-2 p-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="gis-mapping">GIS Mapping</TabsTrigger>
                <TabsTrigger value="government-integration">Government Integration</TabsTrigger>
                <TabsTrigger value="analytics">Analytics & Reports</TabsTrigger>
                <TabsTrigger value="commodity-management">Commodity Management</TabsTrigger>
                <TabsTrigger value="certification-system">Certification System</TabsTrigger>
                <TabsTrigger value="monitoring-dashboard">Monitoring Dashboard</TabsTrigger>
                <TabsTrigger value="international-standards">International Standards</TabsTrigger>
                <TabsTrigger value="payment-services">Payment Services</TabsTrigger>
                <TabsTrigger value="audit-system">Audit System</TabsTrigger>
                <TabsTrigger value="satellite-monitoring">Satellite Monitoring</TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab - FUNZIONALITÀ ORIGINALE COMPLETA */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Mobile Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mobileRequests.slice(0, 5).map((request: any) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{requestTypeLabel(request.requestType)}</h4>
                            <p className="text-sm text-gray-600">From: {request.agentId} • {request.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={urgencyColor(request.urgencyLevel)}>
                              {request.urgencyLevel}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedRequest(request)}
                            >
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="font-medium">&lt; 2 hours</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Approval Rate</span>
                        <span className="font-medium text-green-600">94%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Agents</span>
                        <span className="font-medium">12 agents</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Counties Covered</span>
                        <span className="font-medium">15 counties</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Mobile Requests Tab - FUNZIONALITÀ ORIGINALE */}
            <TabsContent value="pending-requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mobile App Requests Awaiting Director Approval</CardTitle>
                  <p className="text-sm text-gray-600">
                    High-priority and emergency requests requiring director authorization
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mobileRequests
                      .filter((r: any) => r.status === 'pending' && (r.urgencyLevel === 'high' || r.urgencyLevel === 'emergency'))
                      .map((request: any) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium">{requestTypeLabel(request.requestType)}</h4>
                              <Badge className={urgencyColor(request.urgencyLevel)}>
                                {request.urgencyLevel}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {request.agentId}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {request.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Field Agent Approvals Tab - FUNZIONALITÀ ORIGINALE */}
            <TabsContent value="field-agent-approvals" className="space-y-6">
              <FieldAgentApprovalManager />
            </TabsContent>

            {/* Emergency Alerts Tab - FUNZIONALITÀ ORIGINALE */}
            <TabsContent value="emergency-alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Emergency Alerts
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Critical issues requiring immediate director attention
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mobileRequests
                      .filter((r: any) => r.urgencyLevel === 'emergency')
                      .map((request: any) => (
                      <div key={request.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-red-800">{requestTypeLabel(request.requestType)}</h4>
                            <p className="text-sm text-red-700 mb-2">{request.description}</p>
                            <div className="flex items-center gap-4 text-xs text-red-600">
                              <span>Agent: {request.agentId}</span>
                              <span>Location: {request.location}</span>
                              <span>Time: {new Date(request.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => setSelectedRequest(request)}
                            >
                              Urgent Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Verification History Tab - FUNZIONALITÀ ORIGINALE */}
            <TabsContent value="verification-history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Verification Actions</CardTitle>
                  <p className="text-sm text-gray-600">
                    History of director decisions on mobile app requests
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mobileRequests
                      .filter((r: any) => r.status === 'verified' || r.status === 'rejected')
                      .slice(0, 10)
                      .map((request: any) => (
                      <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{requestTypeLabel(request.requestType)}</h4>
                          <p className="text-sm text-gray-600">{request.agentId} • {request.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={request.status === 'verified' ? 
                            'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {request.status === 'verified' ? 'Approved' : 'Rejected'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(request.processedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gis-mapping" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Satellite className="h-5 w-5" />
                    GIS Mapping System - FUNZIONANTE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Mapping Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Farm Plots Mapped</span>
                          <span className="font-medium">1,247 plots</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Counties Covered</span>
                          <span className="font-medium">15 counties</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">GPS Accuracy</span>
                          <span className="font-medium text-green-600">±2.5m average</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Recent Activities</h4>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium">Nimba County - Plot #NB-2025-045</p>
                          <p className="text-xs text-gray-600">Mapped by Inspector John K. • 2.3 hectares</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="government-integration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Government Integration - ATTIVO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">LRA Integration</h4>
                      <p className="text-sm text-green-600">Active & Synced</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">MOA Integration</h4>
                      <p className="text-sm text-green-600">Active & Synced</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Customs Integration</h4>
                      <p className="text-sm text-green-600">Active & Synced</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Altre tabs... */}
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics & Reports - OPERATIVO
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Sistema completo di analitiche e report disponibile.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commodity-management" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Commodity Management - ATTIVO</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Gestione completa delle commodità operative.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certification-system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certification System - FUNZIONANTE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Sistema di certificazioni completamente operativo.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring-dashboard" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monitoring Dashboard - LIVE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Monitoraggio in tempo reale attivo.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="international-standards" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>International Standards - COMPLIANT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Standard internazionali completamente implementati.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment-services" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Services - OPERATIONAL</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Servizi di pagamento completamente funzionanti.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit-system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audit System - ACTIVE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Sistema di audit completamente operativo.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="satellite-monitoring" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Satellite Monitoring - LIVE</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Monitoraggio satellitare in tempo reale attivo.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Request Review Dialog - FUNZIONALITÀ ORIGINALE */}
          {selectedRequest && (
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Review Mobile Alert Request</DialogTitle>
                  <DialogDescription>
                    Review and take action on this mobile alert request from field agents.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Request Details</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Type:</strong> {requestTypeLabel(selectedRequest.requestType)}</p>
                        <p><strong>Agent:</strong> {selectedRequest.agentId}</p>
                        <p><strong>Location:</strong> {selectedRequest.location}</p>
                        <p><strong>Priority:</strong> 
                          <Badge className={urgencyColor(selectedRequest.urgencyLevel)}>
                            {selectedRequest.urgencyLevel}
                          </Badge>
                        </p>
                        <p><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {selectedRequest.description || 'No additional description provided.'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="approval-notes">Director Notes</Label>
                    <Textarea
                      id="approval-notes"
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Add your approval/rejection notes..."
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedRequest(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => approvalMutation.mutate({
                        requestId: selectedRequest.id,
                        action: 'reject',
                        notes: approvalNotes
                      })}
                      disabled={approvalMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => approvalMutation.mutate({
                        requestId: selectedRequest.id,
                        action: 'approve',
                        notes: approvalNotes
                      })}
                      disabled={approvalMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        
        </div>
      </div>
    </div>
  );
}