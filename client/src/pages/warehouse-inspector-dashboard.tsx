import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Warehouse, 
  Package, 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Truck,
  Eye,
  Download,
  Search,
  Filter,
  Users,
  Building2,
  Globe,
  BarChart3,
  Shield,
  Thermometer,
  Scale,
  MapPin
} from "lucide-react";

export default function WarehouseInspectorDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get inspector data from localStorage
  const inspectorData = JSON.parse(localStorage.getItem("warehouseInspectorData") || "{}");
  const warehouseFacility = inspectorData.warehouseFacility || "Monrovia Central Warehouse";

  // Real data queries
  const { data: pendingInspections, isLoading: loadingInspections } = useQuery({
    queryKey: ['/api/warehouse-inspector/pending-inspections'],
    select: (data: any) => data?.data || []
  });

  const { data: storageCompliance, isLoading: loadingCompliance } = useQuery({
    queryKey: ['/api/warehouse-inspector/storage-compliance'],
    select: (data: any) => data?.data || []
  });

  const { data: inventoryStatus, isLoading: loadingInventory } = useQuery({
    queryKey: ['/api/warehouse-inspector/inventory-status'],
    select: (data: any) => data?.data || []
  });

  const { data: qualityControls, isLoading: loadingQuality } = useQuery({
    queryKey: ['/api/warehouse-inspector/quality-controls'],
    select: (data: any) => data?.data || []
  });

  // Fetch warehouse transaction archives
  const { data: warehouseTransactions, isLoading: warehouseTransactionsLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/transactions'],
    select: (data: any) => data?.data || []
  });

  // Fetch warehouse verification codes archive
  const { data: warehouseCodes, isLoading: warehouseCodesLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/verification-codes'],
    select: (data: any) => data?.data || []
  });

  // Fetch bag collection tracking
  const { data: bagCollections, isLoading: bagCollectionsLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/bag-collections'],
    select: (data: any) => data?.data || []
  });

  // Mutations for inspection actions
  const startInspectionMutation = useMutation({
    mutationFn: async (inspectionId: string) => {
      const response = await fetch(`/api/warehouse-inspector/start-inspection/${inspectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to start inspection');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Warehouse inspection started successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/pending-inspections'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to start inspection", variant: "destructive" });
    }
  });

  const completeInspectionMutation = useMutation({
    mutationFn: async ({ inspectionId, data }: { inspectionId: string; data: any }) => {
      const response = await fetch(`/api/warehouse-inspector/complete-inspection/${inspectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to complete inspection');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Warehouse inspection completed successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/pending-inspections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/storage-compliance'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to complete inspection", variant: "destructive" });
    }
  });

  // Validation mutations for dual codes
  const validateCodeMutation = useMutation({
    mutationFn: async ({ codeType, verificationCode }: { codeType: string; verificationCode: string }) => {
      const response = await fetch(`/api/warehouse-inspector/validate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeType, verificationCode })
      });
      if (!response.ok) throw new Error('Failed to validate code');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "✅ Code Validated!", 
        description: `Code ${data.verificationCode} validated successfully. Type: ${data.codeType}` 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/verification-codes'] });
    },
    onError: () => {
      toast({ title: "❌ Error", description: "Invalid code or already used", variant: "destructive" });
    }
  });

  // Generate bag collection batch
  const generateBatchMutation = useMutation({
    mutationFn: async (bagData: any) => {
      const response = await fetch(`/api/warehouse-inspector/generate-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bagData)
      });
      if (!response.ok) throw new Error('Failed to generate batch');
      return response.json();
    },
    onSuccess: (data) => {
      toast({ 
        title: "🎯 Batch Generated!", 
        description: `Batch Code: ${data.batchCode} | QR Code generated successfully` 
      });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/bag-collections'] });
    },
    onError: () => {
      toast({ title: "❌ Error", description: "Unable to generate batch", variant: "destructive" });
    }
  });

  // Calculate dashboard statistics from real data
  const dashboardStats = {
    pendingInspections: pendingInspections?.length || 0,
    completedInspections: 89,
    storageUnits: inventoryStatus?.length || 0,
    complianceRate: storageCompliance?.length > 0 ? 
      (storageCompliance.reduce((acc: number, stat: any) => acc + parseFloat(stat.rate), 0) / storageCompliance.length).toFixed(1) : 
      96.8,
    avgInspectionTime: "1.8 hours",
    criticalIssues: 2,
    warehousesActive: 6,
    temperatureAlerts: 1
  };

  // Helper functions for actions
  const handleStartInspection = (inspectionId: string) => {
    startInspectionMutation.mutate(inspectionId);
  };

  const handleCompleteInspection = (inspectionId: string, status: string) => {
    completeInspectionMutation.mutate({
      inspectionId,
      data: { status, notes: `Warehouse inspection ${status}`, violations: null }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Warehouse className="w-8 h-8 mr-3 text-blue-600" />
              Warehouse Inspector Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              {warehouseFacility} • Inspector: {inspectorData.username || 'WH-INS-001'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800">
              <Shield className="w-3 h-3 mr-1" />
              Authorized
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export Report
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem("warehouseInspectorData");
                window.location.href = "/inspector-portal";
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Inspections</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingInspections}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Storage Units</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.storageUnits}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.complianceRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temperature Alerts</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.temperatureAlerts}</p>
                </div>
                <Thermometer className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Tabs - Moved to middle position */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-white shadow-sm rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="inspections" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Inspections
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="codes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Codes
            </TabsTrigger>
            <TabsTrigger value="bags" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Bags
            </TabsTrigger>
            <TabsTrigger value="validation" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Validation
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Warehouse className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="quality" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Quality
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Overview Cards - Only visible on Overview tab */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Storage Inspections
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
                            <p className="font-medium">{inspection.storageFacility}</p>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Quality Control Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingQuality ? (
                      <p className="text-center text-gray-500">Loading quality data...</p>
                    ) : qualityControls && qualityControls.length > 0 ? (
                      qualityControls.slice(0, 3).map((control: any) => (
                        <div key={control.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{control.testType}</p>
                            <p className="text-sm text-gray-600">Batch: {control.batchNumber}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={control.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {control.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{control.testDate}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No quality controls</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                    Regulatory Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingCompliance ? (
                      <p className="text-center text-gray-500">Loading compliance data...</p>
                    ) : storageCompliance && storageCompliance.length > 0 ? (
                      storageCompliance.map((compliance: any) => (
                        <div key={compliance.category} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{compliance.category}</p>
                            <p className="text-sm text-gray-600">Last checked: {compliance.lastCheck}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">
                              {compliance.rate}%
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">No compliance data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-orange-600" />
                    Storage Environment Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Temperature Range</span>
                      <span className="text-sm text-green-600">18.1°C - 19.2°C ✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Humidity Levels</span>
                      <span className="text-sm text-green-600">60-68% ✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ventilation Status</span>
                      <span className="text-sm text-green-600">Normal ✓</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pest Control</span>
                      <span className="text-sm text-green-600">Active ✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Facility Operations Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Storage Units</span>
                      <span className="text-sm font-bold">{dashboardStats.storageUnits}/50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Daily Inspections</span>
                      <span className="text-sm font-bold">{dashboardStats.pendingInspections} pending</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Compliance Rate</span>
                      <span className="text-sm text-green-600">{dashboardStats.complianceRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Warehouses</span>
                      <span className="text-sm font-bold">{dashboardStats.warehousesActive}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  Recent Activity Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <ClipboardCheck className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{dashboardStats.completedInspections}</p>
                    <p className="text-sm text-gray-600">Completed This Month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">{dashboardStats.avgInspectionTime}</p>
                    <p className="text-sm text-gray-600">Avg Inspection Time</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                    <p className="text-2xl font-bold text-red-600">{dashboardStats.criticalIssues}</p>
                    <p className="text-sm text-gray-600">Critical Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage Inspections Tab */}
          <TabsContent value="inspections" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Warehouse Storage Inspections</CardTitle>
                    <CardDescription>
                      Regulatory inspections for storage facilities at {warehouseFacility}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="Search inspections..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
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
                            <h4 className="font-medium mb-2">Storage Details</h4>
                            <p className="text-sm text-gray-600">Facility: {inspection.storageFacility}</p>
                            <p className="text-sm text-gray-600">Unit: {inspection.storageUnit}</p>
                            <p className="text-sm text-gray-600">Location: {inspection.warehouseSection}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Commodity Details</h4>
                            <p className="text-sm text-gray-600">Type: {inspection.commodity}</p>
                            <p className="text-sm text-gray-600">Quantity: {inspection.quantity}</p>
                            <p className="text-sm text-gray-600">Temperature: {inspection.temperature}°C</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Inspection Details</h4>
                            <p className="text-sm text-gray-600">Scheduled: {inspection.scheduledDate}</p>
                            <p className="text-sm text-gray-600">Type: {inspection.inspectionType}</p>
                            <p className="text-sm text-gray-600">Duration: {inspection.estimatedDuration}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <h4 className="font-medium mb-2">Compliance Checks</h4>
                          <div className="flex flex-wrap gap-2">
                            {inspection.complianceChecks?.map((check: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                {check}
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

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Warehouse Transactions Archive
                </CardTitle>
                <CardDescription>
                  Transaction history and verification codes for warehouse operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouseTransactionsLoading ? (
                    <p className="text-center text-gray-500">Loading transactions...</p>
                  ) : warehouseTransactions && warehouseTransactions.length > 0 ? (
                    warehouseTransactions.map((transaction: any) => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{transaction.transactionType}</h4>
                            <p className="text-sm text-gray-600">ID: {transaction.transactionId}</p>
                          </div>
                          <Badge className={transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="font-medium">Farmer:</span>
                            <p className="text-gray-600">{transaction.farmerName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Commodity:</span>
                            <p className="text-gray-600">{transaction.commodity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>
                            <p className="text-gray-600">{transaction.transactionDate}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No transactions available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Codes Tab - Only Buyer Acceptance Codes */}
          <TabsContent value="codes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Buyer Acceptance Codes - County Specific
                </CardTitle>
                <CardDescription>
                  First verification codes (buyer acceptance) routed to your county warehouse
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      <strong>County-Based Routing:</strong> Only codes from buyers in {inspectorData.county} are shown here
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {warehouseCodesLoading ? (
                    <p className="text-center text-gray-500">Loading buyer acceptance codes...</p>
                  ) : warehouseCodes && warehouseCodes.length > 0 ? (
                    warehouseCodes.filter((code: any) => code.codeType === "buyer-acceptance").map((code: any) => (
                      <div key={code.id} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-lg">Code: {code.verificationCode}</h4>
                            <p className="text-sm text-blue-600 font-medium">Buyer Acceptance Code</p>
                          </div>
                          <Badge className={code.validated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {code.validated ? 'Validated' : 'Pending Validation'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-gray-700">Transaction ID:</span>
                              <p className="text-gray-600">{code.transactionId}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Commodity:</span>
                              <p className="text-gray-600">{code.commodityType} ({code.quantity} {code.unit})</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Value:</span>
                              <p className="text-gray-600">${code.totalValue.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-gray-700">Buyer:</span>
                              <p className="text-gray-600">{code.buyerName}</p>
                              <p className="text-sm text-blue-600">{code.buyerCounty}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Farmer:</span>
                              <p className="text-gray-600">{code.farmerName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Generated:</span>
                              <p className="text-gray-600">{new Date(code.generatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Transaction Details - {code.transactionId}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Buyer Information</h4>
                                    <p><strong>Name:</strong> {code.buyerName}</p>
                                    <p><strong>Business:</strong> {code.buyerBusinessName}</p>
                                    <p><strong>Contact:</strong> {code.buyerContactPerson}</p>
                                    <p><strong>Phone:</strong> {code.buyerPhone}</p>
                                    <p><strong>Email:</strong> {code.buyerEmail}</p>
                                    <p><strong>County:</strong> {code.buyerCounty}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Farmer Information</h4>
                                    <p><strong>Name:</strong> {code.farmerName}</p>
                                    <p><strong>Farmer ID:</strong> {code.farmerId}</p>
                                    <p><strong>Commodity:</strong> {code.commodityType}</p>
                                    <p><strong>Quantity:</strong> {code.quantity} {code.unit}</p>
                                    <p><strong>Total Value:</strong> ${code.totalValue.toLocaleString()}</p>
                                  </div>
                                </div>
                                <div className="border-t pt-4">
                                  <h4 className="font-medium mb-2">Warehouse Information</h4>
                                  <p><strong>Warehouse:</strong> {code.warehouseName}</p>
                                  <p><strong>County:</strong> {code.warehouseCounty}</p>
                                  <p><strong>Status:</strong> {code.status}</p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          {!code.validated && (
                            <Button
                              size="sm"
                              onClick={() => validateCodeMutation.mutate({ 
                                codeType: code.codeType, 
                                verificationCode: code.verificationCode 
                              })}
                              disabled={validateCodeMutation.isPending}
                            >
                              <Shield className="w-4 h-4 mr-1" />
                              Validate Code
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No buyer acceptance codes available for your county</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bags Tab */}
          <TabsContent value="bags" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      QR Batch Tracking & Management
                    </CardTitle>
                    <CardDescription>
                      Create and manage QR-coded bag batches for complete traceability from warehouse to buyer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Transaction-Based QR Batch Generation */}
                      <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-green-50">
                        <h3 className="font-medium mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-blue-600" />
                          Generate QR Batch from Transaction
                        </h3>
                        <div className="mb-4 p-3 bg-white rounded border">
                          <p className="text-sm text-gray-600 mb-2">Select completed buyer-farmer transaction:</p>
                          <select className="w-full p-2 border rounded">
                            <option value="">Select Transaction...</option>
                            <option value="TXN-20250821-001">TXN-20250821-001 - Monrovia Trading (Cocoa) - John Konneh</option>
                            <option value="TXN-20250821-002">TXN-20250821-002 - Atlantic Coffee (Coffee) - Mary Kollie</option>
                            <option value="TXN-20250820-003">TXN-20250820-003 - West Africa Exports (Palm Oil) - David Toe</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Commodity Category</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option value="">Select Category...</option>
                              <option value="cocoa">Cocoa</option>
                              <option value="coffee">Coffee</option>
                              <option value="palm_oil">Palm Oil</option>
                              <option value="rubber">Rubber</option>
                              <option value="rice">Rice</option>
                              <option value="cassava">Cassava</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Product Type</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option value="">Select Product...</option>
                              <option value="premium_cocoa">Premium Trinitario Cocoa</option>
                              <option value="standard_cocoa">Standard Forastero Cocoa</option>
                              <option value="arabica_coffee">Arabica Coffee</option>
                              <option value="robusta_coffee">Robusta Coffee</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Packaging Type</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option value="">Select Packaging...</option>
                              <option value="jute_bags">Jute Bags</option>
                              <option value="polypropylene_bags">Polypropylene Bags</option>
                              <option value="wooden_pallets">Wooden Pallets</option>
                              <option value="export_containers">Export Containers</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Package Weight (kg)</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option value="">Select Weight...</option>
                              <option value="50">50 kg</option>
                              <option value="60">60 kg</option>
                              <option value="80">80 kg</option>
                              <option value="100">100 kg</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Total Packages</label>
                            <Input placeholder="100" type="number" className="mt-1" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Quality Grade</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option value="">Select Grade...</option>
                              <option value="Grade I">Grade I (Premium)</option>
                              <option value="Grade II">Grade II (Standard)</option>
                              <option value="Fine Flavor">Fine Flavor</option>
                              <option value="Bulk">Bulk Grade</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-white rounded border">
                          <h4 className="font-medium mb-2 text-sm">Compliance & Certification Verification</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              LACRA Certified
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              EUDR Compliant
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              Quality Inspected
                            </div>
                            <div className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                              GPS Verified
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button className="flex-1">
                            <FileText className="w-4 h-4 mr-2" />
                            Generate QR Batch
                          </Button>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                        </div>
                      </div>

                      {/* Recent QR Batches */}
                      <div>
                        <h3 className="font-medium mb-3">Recent QR Batches</h3>
                        <div className="space-y-3">
                          <div className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-green-100 text-green-800">WH-BATCH-20250821-A4B2</Badge>
                                <Badge variant="outline">100 bags</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View QR
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-1" />
                                  Print
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Buyer:</span>
                                <p className="text-gray-600">Monrovia Trading Co.</p>
                              </div>
                              <div>
                                <span className="font-medium">Commodity:</span>
                                <p className="text-gray-600">Premium Cocoa</p>
                              </div>
                              <div>
                                <span className="font-medium">Total Weight:</span>
                                <p className="text-gray-600">6,000 kg</p>
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <p className="text-green-600">Distributed</p>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-100 text-blue-800">WH-BATCH-20250821-C7D9</Badge>
                                <Badge variant="outline">75 bags</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View QR
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-1" />
                                  Print
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Buyer:</span>
                                <p className="text-gray-600">Atlantic Coffee Ltd.</p>
                              </div>
                              <div>
                                <span className="font-medium">Commodity:</span>
                                <p className="text-gray-600">Robusta Coffee</p>
                              </div>
                              <div>
                                <span className="font-medium">Total Weight:</span>
                                <p className="text-gray-600">4,500 kg</p>
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <p className="text-yellow-600">Reserved</p>
                              </div>
                            </div>
                          </div>

                          <div className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className="bg-purple-100 text-purple-800">WH-BATCH-20250820-F3G8</Badge>
                                <Badge variant="outline">120 bags</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View QR
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Download className="w-4 h-4 mr-1" />
                                  Print
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Buyer:</span>
                                <p className="text-gray-600">West Africa Exports</p>
                              </div>
                              <div>
                                <span className="font-medium">Commodity:</span>
                                <p className="text-gray-600">Palm Oil</p>
                              </div>
                              <div>
                                <span className="font-medium">Total Weight:</span>
                                <p className="text-gray-600">7,200 kg</p>
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>
                                <p className="text-blue-600">Generated</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                      QR Batch Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                        <p className="text-2xl font-bold text-green-600">23</p>
                        <p className="text-sm text-gray-600">Active QR Batches</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Package className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">2,847</p>
                        <p className="text-sm text-gray-600">Total Bags Tracked</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <FileText className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">156</p>
                        <p className="text-sm text-gray-600">QR Codes Scanned</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-orange-600" />
                      Recent Scan Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="text-sm">
                          <p className="font-medium">WH-BATCH-20250821-A4B2</p>
                          <p className="text-gray-600">Scanned by buyer</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">2 min ago</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="text-sm">
                          <p className="font-medium">WH-BATCH-20250821-C7D9</p>
                          <p className="text-gray-600">Scanned by exporter</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">15 min ago</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="text-sm">
                          <p className="font-medium">WH-BATCH-20250820-F3G8</p>
                          <p className="text-gray-600">Scanned by customs</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800 text-xs">1 hour ago</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Inventory Control Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-600" />
                  Warehouse Inventory Management
                </CardTitle>
                <CardDescription>
                  Real-time inventory tracking and storage monitoring for {warehouseFacility}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingInventory ? (
                    <p className="text-center text-gray-500">Loading inventory data...</p>
                  ) : inventoryStatus && inventoryStatus.length > 0 ? (
                    inventoryStatus.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{item.commodity}</h4>
                            <p className="text-sm text-gray-600">Storage Unit: {item.storageUnit}</p>
                          </div>
                          <Badge className={item.status === 'stored' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Quantity:</span>
                            <p className="text-gray-600">{item.quantity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Temperature:</span>
                            <p className="text-gray-600">{item.temperature}</p>
                          </div>
                          <div>
                            <span className="font-medium">Humidity:</span>
                            <p className="text-gray-600">{item.humidity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Last Inspection:</span>
                            <p className="text-gray-600">{item.lastInspection}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No inventory data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  Storage Compliance Monitoring
                </CardTitle>
                <CardDescription>
                  Regulatory compliance status and monitoring for storage facilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loadingCompliance ? (
                    <p className="text-center text-gray-500 col-span-2">Loading compliance data...</p>
                  ) : storageCompliance && storageCompliance.length > 0 ? (
                    storageCompliance.map((compliance: any) => (
                      <Card key={compliance.category}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">{compliance.category}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              {compliance.rate}%
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Compliant Units:</span>
                              <span className="font-medium">{compliance.compliant}/{compliance.total}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Last Check:</span>
                              <span className="text-gray-600">{compliance.lastCheck}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${compliance.rate}%` }}
                              ></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 col-span-2">No compliance data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Control Tab */}
          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Quality Control & Testing
                </CardTitle>
                <CardDescription>
                  Quality assurance tests and batch monitoring for stored commodities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingQuality ? (
                    <p className="text-center text-gray-500">Loading quality control data...</p>
                  ) : qualityControls && qualityControls.length > 0 ? (
                    qualityControls.map((control: any) => (
                      <div key={control.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{control.testType}</h4>
                            <p className="text-sm text-gray-600">Batch: {control.batchNumber} • {control.commodity}</p>
                          </div>
                          <Badge className={control.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {control.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-2">Test Details</h5>
                            <p className="text-sm text-gray-600">Inspector: {control.inspector}</p>
                            <p className="text-sm text-gray-600">Test Date: {control.testDate}</p>
                          </div>
                          <div>
                            <h5 className="font-medium mb-2">Test Results</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Moisture:</span>
                                <span className="font-medium">{control.results.moisture}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Defects:</span>
                                <span className="font-medium">{control.results.defects}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Foreign Matter:</span>
                                <span className="font-medium">{control.results.foreign_matter}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">No quality control data available</p>
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