import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
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
  Activity
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Field Agent Approval Manager Component
function FieldAgentApprovalManager() {
  const { toast } = useToast();
  
  // Fetch inspection requests
  const { data: inspectionRequests = [] } = useQuery({
    queryKey: ['/api/inspection-requests'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch farmer registration requests
  const { data: farmerRegistrationRequests = [] } = useQuery({
    queryKey: ['/api/farmer-registration-requests'],
    refetchInterval: 30000,
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

export default function DirectorDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
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

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Crown className="h-8 w-8 text-purple-600" />
                Director Dashboard
              </h1>
              <p className="text-gray-600">
                Executive oversight of mobile alerts and compliance verification
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Role</p>
              <Badge className="bg-purple-100 text-purple-800">LACRA Director</Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending-requests">Mobile Requests</TabsTrigger>
            <TabsTrigger value="field-agent-approvals">Field Agent Approvals</TabsTrigger>
            <TabsTrigger value="emergency-alerts">Emergency Alerts</TabsTrigger>
            <TabsTrigger value="verification-history">Verification History</TabsTrigger>
          </TabsList>

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
  );
}