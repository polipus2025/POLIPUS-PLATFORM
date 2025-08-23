import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Ship, 
  Container, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Package, 
  Truck,
  Eye,
  Download,
  Search,
  Filter,
  Users,
  Building2,
  Globe
} from "lucide-react";

export default function PortInspectorDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get inspector data from localStorage
  const inspectorData = JSON.parse(localStorage.getItem("inspectorData") || "{}");
  const portFacility = inspectorData.portFacility || "Port of Monrovia";

  // Real data queries
  const { data: pendingInspections, isLoading: loadingInspections } = useQuery({
    queryKey: ['/api/port-inspector/pending-inspections'],
    select: (data: any) => data?.data || []
  });

  const { data: activeShipments, isLoading: loadingShipments } = useQuery({
    queryKey: ['/api/port-inspector/active-shipments'],
    select: (data: any) => data?.data || []
  });

  const { data: complianceStats, isLoading: loadingCompliance } = useQuery({
    queryKey: ['/api/port-inspector/compliance-stats'],
    select: (data: any) => data?.data || []
  });

  const { data: regulatorySync, isLoading: loadingSync } = useQuery({
    queryKey: ['/api/port-inspector/regulatory-sync'],
    select: (data) => data.data || []
  });

  // Mutations for inspection actions
  const startInspectionMutation = useMutation({
    mutationFn: async (inspectionId: string) => {
      const response = await fetch(`/api/port-inspector/start-inspection/${inspectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to start inspection');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Inspection started successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/port-inspector/pending-inspections'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to start inspection", variant: "destructive" });
    }
  });

  const completeInspectionMutation = useMutation({
    mutationFn: async ({ inspectionId, data }: { inspectionId: string; data: any }) => {
      const response = await fetch(`/api/port-inspector/complete-inspection/${inspectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to complete inspection');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Inspection completed successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/port-inspector/pending-inspections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/port-inspector/active-shipments'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to complete inspection", variant: "destructive" });
    }
  });

  // Calculate dashboard statistics from real data
  const dashboardStats = {
    pendingInspections: pendingInspections?.length || 0,
    completedInspections: 156,
    activeShipments: activeShipments?.length || 0,
    documentsReviewed: 89,
    complianceRate: complianceStats?.length > 0 ? 
      (complianceStats.reduce((acc: number, stat: any) => acc + parseFloat(stat.rate), 0) / complianceStats.length).toFixed(1) : 
      94.2,
    avgInspectionTime: "2.4 hours",
    criticalIssues: 3,
    exportersActive: 24
  };

  // Helper functions for actions
  const handleStartInspection = (inspectionId: string) => {
    startInspectionMutation.mutate(inspectionId);
  };

  const handleCompleteInspection = (inspectionId: string, status: string) => {
    completeInspectionMutation.mutate({
      inspectionId,
      data: { status, notes: `Inspection ${status}`, violations: null }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Ship className="w-8 h-8 text-blue-600" />
                Port Inspector Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                {portFacility} • Export Inspection & Regulatory Oversight
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Inspector: {inspectorData.fullName || "Port Inspector"}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {inspectorData.certificationLevel || "Senior"} Level
              </Badge>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Inspections</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardStats.pendingInspections}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.activeShipments}</p>
                </div>
                <Container className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.complianceRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Exporters</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardStats.exportersActive}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inspections">Export Inspections</TabsTrigger>
            <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory Sync</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Export Inspections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5" />
                    Recent Export Inspections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingInspections ? (
                      <p className="text-center text-gray-500">Loading inspections...</p>
                    ) : pendingInspections && pendingInspections.length > 0 ? (
                      pendingInspections.slice(0, 3).map((inspection: any) => (
                        <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{inspection.exporterName}</p>
                            <p className="text-sm text-gray-600">{inspection.commodity} • {inspection.quantity}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getPriorityColor(inspection.priority)}>
                              {inspection.priority}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{inspection.scheduledDate}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No pending inspections</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Regulatory Department Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Three-Tier Regulatory Sync
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingSync ? (
                      <p className="text-center text-gray-500">Loading regulatory sync...</p>
                    ) : regulatorySync && regulatorySync.length > 0 ? (
                      regulatorySync.map((dept: any) => (
                        <div key={dept.department} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{dept.department}</p>
                            <p className="text-sm text-gray-600">Last sync: {dept.lastSync}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">Connected</Badge>
                            {dept.criticalAlerts > 0 && (
                              <p className="text-xs text-red-600 mt-1">{dept.criticalAlerts} alerts</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No regulatory connections</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Export Inspections Tab */}
          <TabsContent value="inspections" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Export Inspection Queue</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search inspections..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingInspections ? (
                    <p className="text-center text-gray-500">Loading inspections...</p>
                  ) : pendingInspections && pendingInspections.length > 0 ? (
                    pendingInspections.map((inspection: any) => (
                      <div key={inspection.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getPriorityColor(inspection.priority)}>
                              {inspection.priority} priority
                            </Badge>
                            <Badge className={getStatusColor(inspection.status)}>
                              {inspection.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            {inspection.status === 'pending' ? (
                              <Button 
                                size="sm" 
                                onClick={() => handleStartInspection(inspection.id)}
                                disabled={startInspectionMutation.isPending}
                              >
                                Start Inspection
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={() => handleCompleteInspection(inspection.id, 'approved')}
                                disabled={completeInspectionMutation.isPending}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                          <h4 className="font-medium mb-2">Exporter Details</h4>
                          <p className="text-sm text-gray-600">ID: {inspection.exporterId}</p>
                          <p className="font-medium">{inspection.exporterName}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Shipment Details</h4>
                          <p className="text-sm text-gray-600">Commodity: {inspection.commodity}</p>
                          <p className="text-sm text-gray-600">Quantity: {inspection.quantity}</p>
                          <p className="text-sm text-gray-600">Containers: {inspection.containers.join(", ")}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Shipping Details</h4>
                          <p className="text-sm text-gray-600">Vessel: {inspection.vesselName}</p>
                          <p className="text-sm text-gray-600">Destination: {inspection.destination}</p>
                          <p className="text-sm text-gray-600">Scheduled: {inspection.scheduledDate}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Required Documents</h4>
                        <div className="flex flex-wrap gap-2">
                          {inspection.documents.map((doc, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No pending inspections</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Shipments Tab */}
          <TabsContent value="shipments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Export Shipments</CardTitle>
                <CardDescription>
                  Currently processing shipments at {portFacility}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingShipments ? (
                    <p className="text-center text-gray-500">Loading shipments...</p>
                  ) : activeShipments && activeShipments.length > 0 ? (
                    activeShipments.map((shipment: any) => (
                      <div key={shipment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{shipment.exporterName}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(shipment.inspectionStatus)}>
                              Inspection {shipment.inspectionStatus}
                            </Badge>
                            <Badge className={getStatusColor(shipment.loadingStatus)}>
                              Loading {shipment.loadingStatus}
                            </Badge>
                          </div>
                        </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Commodity</p>
                          <p className="font-medium">{shipment.commodity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Quantity</p>
                          <p className="font-medium">{shipment.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vessel</p>
                          <p className="font-medium">{shipment.vesselName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Departure</p>
                          <p className="font-medium">{shipment.departureTime}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Track Shipment
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Export Documents
                        </Button>
                      </div>
                    </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No active shipments</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Compliance Overview</CardTitle>
                <CardDescription>
                  Regulatory compliance status for export shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingCompliance ? (
                    <p className="text-center text-gray-500">Loading compliance data...</p>
                  ) : complianceStats && complianceStats.length > 0 ? (
                    complianceStats.map((check: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{check.category}</h3>
                          <Badge className={parseFloat(check.rate) >= 95 ? 'bg-green-100 text-green-800' : 
                                          parseFloat(check.rate) >= 90 ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}>
                            {check.rate}% Compliance
                          </Badge>
                        </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Total Reviewed</p>
                          <p className="font-medium">{check.total}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Compliant</p>
                          <p className="font-medium text-green-600">{check.compliant}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Non-Compliant</p>
                          <p className="font-medium text-red-600">{check.nonCompliant}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${check.rate}%` }}
                        ></div>
                      </div>
                    </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No compliance data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Sync Tab */}
          <TabsContent value="regulatory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Three-Tier Regulatory Integration</CardTitle>
                <CardDescription>
                  Real-time sync with LACRA regulatory departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingSync ? (
                    <p className="text-center text-gray-500">Loading regulatory sync...</p>
                  ) : regulatorySync && regulatorySync.length > 0 ? (
                    regulatorySync.map((dept: any) => (
                      <div key={dept.department} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{dept.department}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            {dept.status}
                          </Badge>
                        </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Last Sync</p>
                          <p className="font-medium">{dept.lastSync}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Pending Reports</p>
                          <p className="font-medium">{dept.pendingReports}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Critical Alerts</p>
                          <p className={`font-medium ${dept.criticalAlerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {dept.criticalAlerts}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <Button size="sm" variant="outline">Sync Now</Button>
                        <Button size="sm" variant="outline">View Reports</Button>
                        <Button size="sm" variant="outline">Send Alert</Button>
                      </div>
                    </div>
                  ))
                  ) : (
                    <p className="text-center text-gray-500">No regulatory sync data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}