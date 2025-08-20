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

// Field Agent Approval Manager Component
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

export default function DirectorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch mobile alert requests for director review
  const { data: mobileRequests = [] } = useQuery({
    queryKey: ['/api/mobile-alert-requests'],
    queryFn: () => apiRequest('/api/mobile-alert-requests'),
  });

  // Fetch pending alerts that need director attention
  const { data: pendingAlerts = [] } = useQuery({
    queryKey: ['/api/alerts', 'director-pending'],
    queryFn: () => apiRequest('/api/alerts?status=pending&priority=high,critical'),
  });

  // Fetch director dashboard metrics
  const { data: directorMetrics } = useQuery({
    queryKey: ['/api/dashboard/director-metrics'],
    queryFn: () => apiRequest('/api/dashboard/director-metrics'),
  });

  // Director approval mutation
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
        <meta name="description" content="Executive dashboard for LACRA Director - Mobile alert verification and compliance oversight" />
      </Helmet>

      {/* Director Sidebar */}
      <DirectorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-72" : "ml-0"
      )}>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4" style={{zIndex: 10000}}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-purple-600 text-white shadow-lg border-2 border-purple-400 hover:bg-purple-700"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Desktop Toggle Button */}
        <div className="hidden lg:block fixed top-4 left-4" style={{zIndex: 10000}}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-purple-600 text-white shadow-lg border-2 border-purple-400 hover:bg-purple-700"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>

        <div className="p-3 sm:p-6 pt-16 lg:pt-6">
        {/* Mobile-Responsive Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mt-1 sm:mt-0" />
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Director Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600">
                  Executive oversight of mobile alerts and compliance verification
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto">
              <p className="text-xs sm:text-sm text-gray-600">Role</p>
              <Badge className="bg-purple-100 text-purple-800 text-xs sm:text-sm">LACRA Director</Badge>
            </div>
          </div>
        </div>

        {/* Mobile-Responsive Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {mobileRequests.filter((r: any) => r.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emergency Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mobileRequests.filter((r: any) => r.urgencyLevel === 'emergency').length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mobileRequests.filter((r: any) => r.status === 'verified' && 
                      new Date(r.verifiedAt).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-between w-full">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mobile Sources</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {new Set(mobileRequests.filter((r: any) => r.source === 'mobile_app').map((r: any) => r.agentId)).size}
                  </p>
                </div>
                <Smartphone className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="flex w-max space-x-2 p-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pending-requests">Mobile Requests</TabsTrigger>
              <TabsTrigger value="field-agent-approvals">Field Agent Approvals</TabsTrigger>
              <TabsTrigger value="emergency-alerts">Emergency Alerts</TabsTrigger>
              <TabsTrigger value="verification-history">Verification History</TabsTrigger>
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

          {/* Overview Tab */}
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

          {/* Mobile Requests Tab */}
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

          {/* Field Agent Approvals Tab */}
          <TabsContent value="field-agent-approvals" className="space-y-6">
            <FieldAgentApprovalManager />
          </TabsContent>

          {/* Emergency Alerts Tab */}
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

          {/* Verification History Tab */}
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

          {/* GIS Mapping Tab */}
          <TabsContent value="gis-mapping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5" />
                  GIS Mapping System
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Geographic Information System for land mapping and farm plot visualization
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Mapping Statistics</h4>
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
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deforestation Risk Areas</span>
                        <span className="font-medium text-orange-600">23 flagged areas</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Recent Mapping Activities</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium">Nimba County - Plot #NB-2025-045</p>
                        <p className="text-xs text-gray-600">Mapped by Inspector John K. • 2.3 hectares</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium">Lofa County - Plot #LF-2025-032</p>
                        <p className="text-xs text-gray-600">Mapped by Inspector Mary T. • 4.7 hectares</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Government Integration Tab */}
          <TabsContent value="government-integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Government Integration
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Integration status with LRA, MOA, and Customs authorities
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-800">LRA Integration</h4>
                    <p className="text-sm text-green-600">Active & Synced</p>
                    <p className="text-xs text-gray-600 mt-2">Last sync: 2 hours ago</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-800">MOA Integration</h4>
                    <p className="text-sm text-green-600">Active & Synced</p>
                    <p className="text-xs text-gray-600 mt-2">Last sync: 45 minutes ago</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <h4 className="font-semibold text-orange-800">Customs Integration</h4>
                    <p className="text-sm text-orange-600">Pending Update</p>
                    <p className="text-xs text-gray-600 mt-2">Requires attention</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics & Reports Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Export Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Exports (2025)</span>
                      <span className="font-semibold">$24.8M USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cocoa Exports</span>
                      <span className="font-medium">67% ($16.6M)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Coffee Exports</span>
                      <span className="font-medium">23% ($5.7M)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Other Commodities</span>
                      <span className="font-medium">10% ($2.5M)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Compliance Rate</span>
                      <span className="font-semibold text-green-600">96.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Processing Time</span>
                      <span className="font-medium">2.3 days avg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Farmer Satisfaction</span>
                      <span className="font-medium text-green-600">94.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Export Efficiency</span>
                      <span className="font-medium text-blue-600">92.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Commodity Management Tab */}
          <TabsContent value="commodity-management" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  Commodity Management System
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Overview of all registered commodities and their status
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <h4 className="font-semibold text-green-800">Active Commodities</h4>
                    <p className="text-2xl font-bold text-green-600">143</p>
                    <p className="text-sm text-gray-600">Ready for export</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg text-center">
                    <h4 className="font-semibold text-orange-800">Pending Inspection</h4>
                    <p className="text-2xl font-bold text-orange-600">27</p>
                    <p className="text-sm text-gray-600">Awaiting quality check</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <h4 className="font-semibold text-blue-800">In Transit</h4>
                    <p className="text-2xl font-bold text-blue-600">89</p>
                    <p className="text-sm text-gray-600">En route to port</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certification System Tab */}
          <TabsContent value="certification-system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certificate Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-sm font-medium">EUDR Certificates</span>
                      <Badge className="bg-green-100 text-green-800">142 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Quality Certificates</span>
                      <Badge className="bg-blue-100 text-blue-800">89 Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                      <span className="text-sm font-medium">Export Certificates</span>
                      <Badge className="bg-orange-100 text-orange-800">34 Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Recent Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <p className="text-sm font-medium">EUDR-2025-0847</p>
                      <p className="text-xs text-gray-600">Cocoa • Nimba County • Issued today</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-sm font-medium">QC-2025-0234</p>
                      <p className="text-xs text-gray-600">Coffee • Lofa County • Issued yesterday</p>
                    </div>
                    <div className="p-3 border rounded">
                      <p className="text-sm font-medium">EXP-2025-0198</p>
                      <p className="text-xs text-gray-600">Mixed • Grand Gedeh • Pending approval</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Additional Tabs Continue... */}
          <TabsContent value="monitoring-dashboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Monitoring Dashboard
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Live system monitoring and alerts
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">System Status</p>
                    <p className="font-semibold text-green-600">Online</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="font-semibold text-blue-600">247</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <p className="text-sm text-gray-600">Processing Queue</p>
                    <p className="font-semibold text-orange-600">23</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">Data Sync</p>
                    <p className="font-semibold text-purple-600">Live</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with remaining tabs... */}
          <TabsContent value="international-standards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  International Standards Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">EU Deforestation Regulation (EUDR)</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Compliance Rate</span>
                      <Badge className="bg-green-100 text-green-800">97.8% Compliant</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Fair Trade Standards</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Certified Farmers</span>
                      <Badge className="bg-blue-100 text-blue-800">89% Certified</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Services & Financial Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Payment Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Processed (Today)</span>
                        <span className="font-medium">$127,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Pending Payments</span>
                        <span className="font-medium text-orange-600">$23,890</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Failed Transactions</span>
                        <span className="font-medium text-red-600">2 ($1,250)</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Revenue Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">LACRA Share (30%)</span>
                        <span className="font-medium">$38,235</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Polipus Share (70%)</span>
                        <span className="font-medium">$89,215</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Audit System & Compliance Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <h4 className="font-semibold text-green-800">Audit Score</h4>
                      <p className="text-2xl font-bold text-green-600">94.7%</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <h4 className="font-semibold text-blue-800">Audits This Month</h4>
                      <p className="text-2xl font-bold text-blue-600">23</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <h4 className="font-semibold text-orange-800">Pending Reviews</h4>
                      <p className="text-2xl font-bold text-orange-600">7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satellite-monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5" />
                  Satellite Monitoring & Environmental Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Satellite Data</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Satellites</span>
                        <span className="font-medium">200+ monitoring</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Coverage Area</span>
                        <span className="font-medium">100% of Liberia</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Update Frequency</span>
                        <span className="font-medium">Every 6 hours</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Environmental Alerts</h4>
                    <div className="space-y-2">
                      <div className="p-2 bg-yellow-50 rounded text-sm">
                        <span className="font-medium">Deforestation Alert</span>
                        <p className="text-gray-600">Nimba County - 0.3 hectares detected</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded text-sm">
                        <span className="font-medium">Normal Activity</span>
                        <p className="text-gray-600">All other regions stable</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Request Review Dialog */}
        {selectedRequest && (
          <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Director Review: {requestTypeLabel(selectedRequest.requestType)}
                </DialogTitle>
                <DialogDescription>
                  Review and approve/reject this mobile app request
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Request Type</Label>
                    <p className="text-sm text-gray-600">{requestTypeLabel(selectedRequest.requestType)}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Urgency Level</Label>
                    <Badge className={urgencyColor(selectedRequest.urgencyLevel)}>
                      {selectedRequest.urgencyLevel}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Submitted By</Label>
                    <p className="text-sm text-gray-600">{selectedRequest.agentId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-gray-600">{selectedRequest.location}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
                </div>

                {selectedRequest.attachments && (
                  <div>
                    <Label className="text-sm font-medium">Attachments</Label>
                    <p className="text-sm text-gray-600">
                      {JSON.parse(selectedRequest.attachments).length} file(s) attached
                    </p>
                  </div>
                )}

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