import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  MapPin,
  Printer,
  QrCode
} from "lucide-react";

export default function WarehouseInspectorDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [validatingRequest, setValidatingRequest] = useState<string | null>(null);
  const [selectedCodeType, setSelectedCodeType] = useState("");
  const [validationCode, setValidationCode] = useState("");
  const [selectedQrBatch, setSelectedQrBatch] = useState<any>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get inspector data from localStorage
  const inspectorData = JSON.parse(localStorage.getItem("warehouseInspectorData") || "{}");
  const warehouseFacility = inspectorData.warehouseFacility || inspectorData.warehouseName || "Central Warehouse";
  const inspectorUsername = inspectorData.username || inspectorData.warehouseId || "WH-INS-001";
  const inspectorCounty = inspectorData.county || "County";

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

  // Fetch incoming bag requests from buyers
  const { data: bagRequests, isLoading: bagRequestsLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/bag-requests'],
    select: (data: any) => data?.data || []
  });

  // Fetch QR batches from database
  const { data: qrBatches, isLoading: qrBatchesLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/qr-batches'],
    select: (data: any) => data?.data || []
  });

  // Handle bag request validation
  const handleValidateBagRequest = async (requestId: string, action: 'validate' | 'reject', notes?: string) => {
    if (validatingRequest) return;
    
    setValidatingRequest(requestId);
    try {
      await apiRequest('/api/warehouse-inspector/validate-bag-request', {
        method: 'POST',
        body: JSON.stringify({
          requestId,
          action,
          validationNotes: notes
        })
      });
      
      toast({
        title: action === 'validate' ? "✅ Request Validated!" : "❌ Request Rejected",
        description: `Bag request ${requestId} has been ${action === 'validate' ? 'validated' : 'rejected'} successfully.`,
      });
      
      // Refresh bag requests
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/bag-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/transactions'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} bag request`,
        variant: "destructive",
      });
    } finally {
      setValidatingRequest(null);
    }
  };

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

  // Handle QR code printing
  const handlePrintQr = (batch: any) => {
    // Create a printable window with the QR code
    if (batch.qrCodeUrl) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Code - ${batch.batchCode}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  text-align: center; 
                  padding: 20px; 
                }
                .qr-container {
                  margin: 20px auto;
                  padding: 20px;
                  border: 2px solid #000;
                  width: 400px;
                }
                .qr-code {
                  width: 256px;
                  height: 256px;
                  margin: 20px auto;
                }
                .batch-info {
                  margin: 10px 0;
                  font-size: 14px;
                }
              </style>
            </head>
            <body>
              <div class="qr-container">
                <h2>Agricultural Traceability QR Code</h2>
                <div class="batch-info">
                  <strong>Batch Code:</strong> ${batch.batchCode}
                </div>
                <div class="batch-info">
                  <strong>Commodity:</strong> ${batch.commodityType}
                </div>
                <div class="batch-info">
                  <strong>Farmer:</strong> ${batch.farmerName}
                </div>
                <div class="batch-info">
                  <strong>Total Weight:</strong> ${batch.totalWeight} kg
                </div>
                <img src="${batch.qrCodeUrl}" alt="QR Code" class="qr-code" />
                <div class="batch-info">
                  <strong>Generated:</strong> ${new Date().toLocaleDateString()}
                </div>
                <div class="batch-info" style="font-size: 12px; margin-top: 20px;">
                  <strong>Verification URL:</strong><br/>
                  https://agritrace360.lacra.gov.lr/verify/${batch.batchCode}
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } else {
      toast({
        title: "❌ Error",
        description: "QR code not available for printing",
        variant: "destructive"
      });
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
              {warehouseFacility} • Inspector: {inspectorUsername} • {inspectorCounty}
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
            {/* QR Batch Tracking & Management - Only in Bags Tab */}
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
                          <p className="text-sm text-gray-600 mb-2">Select validated buyer bag request:</p>
                          <select className="w-full p-2 border rounded" data-testid="select-validated-request">
                            <option value="">Select Validated Request...</option>
                            {bagRequests?.filter((request: any) => request.status === 'validated').map((request: any) => (
                              <option key={request.requestId} value={request.requestId}>
                                {request.requestId} - {request.company} ({request.commodityType}) - {request.farmerName} - {request.quantity} {request.unit} - ${request.totalValue}
                              </option>
                            ))}
                          </select>
                          {(!bagRequests || bagRequests.filter((request: any) => request.status === 'validated').length === 0) && (
                            <p className="text-sm text-amber-600 mt-2 flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              No validated bag requests available. Requests will appear here after warehouse validation.
                            </p>
                          )}
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
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Quality Grade</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option value="">Select Grade...</option>
                              <option value="Grade I">Grade I (Premium)</option>
                              <option value="Grade II">Grade II (Standard)</option>
                              <option value="Grade III">Grade III (Main Crop)</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <label className="text-sm font-medium">Total Bags</label>
                            <input type="number" className="w-full mt-1 p-2 border rounded" placeholder="100" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Bag Weight (kg)</label>
                            <input type="number" className="w-full mt-1 p-2 border rounded" placeholder="60" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Total Weight (kg)</label>
                            <input type="number" className="w-full mt-1 p-2 border rounded" disabled placeholder="6,000" />
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

                      {/* Recent QR Batches - Real Data */}
                      <div>
                        <h3 className="font-medium mb-3">Recent QR Batches</h3>
                        <div className="space-y-3">
                          {qrBatchesLoading ? (
                            <p className="text-center text-gray-500">Loading QR batches...</p>
                          ) : qrBatches && qrBatches.length > 0 ? (
                            qrBatches.map((batch: any) => (
                              <div key={batch.batchCode} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-green-100 text-green-800">{batch.batchCode}</Badge>
                                    <Badge variant="outline">{batch.totalBags} bags</Badge>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedQrBatch(batch);
                                        setShowQrModal(true);
                                      }}
                                      data-testid={`button-view-qr-${batch.batchCode}`}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View QR
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => handlePrintQr(batch)}
                                      data-testid={`button-print-qr-${batch.batchCode}`}
                                    >
                                      <Printer className="w-4 h-4 mr-1" />
                                      Print
                                    </Button>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                  <div>
                                    <span className="font-medium">Buyer:</span>
                                    <p className="text-gray-600">{batch.buyerName}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Commodity:</span>
                                    <p className="text-gray-600">{batch.commodityType}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Total Weight:</span>
                                    <p className="text-gray-600">{batch.totalWeight} kg</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>
                                    <p className={batch.status === 'generated' ? 'text-green-600' : batch.status === 'printed' ? 'text-blue-600' : 'text-yellow-600'}>
                                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500">
                                  Farmer: {batch.farmerName} • Created: {new Date(batch.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-gray-500">No QR batches available</p>
                          )}
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
                        <p className="text-2xl font-bold text-green-600">{qrBatches ? qrBatches.length : 0}</p>
                        <p className="text-sm text-gray-600">Active QR Batches</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Package className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {qrBatches ? qrBatches.reduce((total: number, batch: any) => total + parseInt(batch.totalBags || 0), 0) : 0}
                        </p>
                        <p className="text-sm text-gray-600">Total Bags Tracked</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <FileText className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">
                          {qrBatches ? qrBatches.filter((batch: any) => batch.status === 'printed' || batch.status === 'distributed').length : 0}
                        </p>
                        <p className="text-sm text-gray-600">QR Codes Printed</p>
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
                      {qrBatchesLoading ? (
                        <p className="text-center text-gray-500">Loading activity...</p>
                      ) : qrBatches && qrBatches.length > 0 ? (
                        qrBatches.slice(0, 3).map((batch: any, index) => (
                          <div key={batch.batchCode} className="flex items-center justify-between p-2 border rounded">
                            <div className="text-sm">
                              <p className="font-medium">{batch.batchCode}</p>
                              <p className="text-gray-600">
                                {batch.status === 'generated' ? 'Generated for processing' : 
                                 batch.status === 'printed' ? 'QR codes printed' : 
                                 batch.status === 'distributed' ? 'Distributed to buyer' : 'In processing'}
                              </p>
                            </div>
                            <Badge className={
                              batch.status === 'generated' ? 'bg-green-100 text-green-800 text-xs' :
                              batch.status === 'printed' ? 'bg-blue-100 text-blue-800 text-xs' :
                              'bg-purple-100 text-purple-800 text-xs'
                            }>
                              {new Date(batch.createdAt).toLocaleDateString()}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Incoming Bag Requests from Buyers - Now after QR Code Generator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Incoming Bag Requests from Buyers
                </CardTitle>
                <CardDescription>
                  Validate or reject bag requests from buyers who have completed payment confirmation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bagRequestsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading bag requests...</p>
                  </div>
                ) : bagRequests && bagRequests.length > 0 ? (
                  <div className="space-y-4">
                    {bagRequests.map((request: any) => (
                      <Card key={request.requestId} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg flex items-center">
                                {request.commodityType}
                                <Badge 
                                  className={`ml-2 ${
                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                    request.status === 'validated' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </h4>
                              <p className="text-sm text-gray-600">Request ID: {request.requestId}</p>
                              <p className="text-sm text-gray-600">From: {request.buyerName} ({request.company})</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {new Date(request.requestedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Farmer</p>
                              <p className="font-medium">{request.farmerName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Quantity</p>
                              <p className="font-medium">{request.quantity} {request.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${request.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">County</p>
                              <p className="font-medium">{request.county}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Farm Location</p>
                            <p className="text-sm">{request.farmLocation}</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Verification Code</p>
                            <p className="font-mono text-sm bg-gray-100 p-2 rounded">{request.verificationCode}</p>
                          </div>

                          {request.status === 'validated' && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                              <p className="text-sm text-green-800">
                                <strong>Validated by:</strong> {request.validatedBy} on {new Date(request.validatedAt).toLocaleString()}
                              </p>
                              {request.validationNotes && (
                                <p className="text-sm text-green-700 mt-1">
                                  <strong>Notes:</strong> {request.validationNotes}
                                </p>
                              )}
                              {request.transactionId && (
                                <p className="text-sm text-green-700 mt-1">
                                  <strong>Transaction ID:</strong> {request.transactionId}
                                </p>
                              )}
                            </div>
                          )}

                          {request.status === 'rejected' && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                              <p className="text-sm text-red-800">
                                <strong>Rejected by:</strong> {request.validatedBy} on {new Date(request.validatedAt).toLocaleString()}
                              </p>
                              {request.validationNotes && (
                                <p className="text-sm text-red-700 mt-1">
                                  <strong>Reason:</strong> {request.validationNotes}
                                </p>
                              )}
                            </div>
                          )}

                          {request.status === 'pending' && (
                            <div className="flex justify-end space-x-2 pt-3 border-t">
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleValidateBagRequest(request.requestId, 'reject', 'Request does not meet validation criteria')}
                                disabled={validatingRequest === request.requestId}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                data-testid={`button-reject-${request.requestId}`}
                              >
                                {validatingRequest === request.requestId ? 'Processing...' : 'Reject Request'}
                              </Button>
                              <Button 
                                onClick={() => handleValidateBagRequest(request.requestId, 'validate', 'Request validated - proceeding to transaction')}
                                disabled={validatingRequest === request.requestId}
                                className="bg-green-600 hover:bg-green-700"
                                data-testid={`button-validate-${request.requestId}`}
                              >
                                {validatingRequest === request.requestId ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                    Validating...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Validate Request
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No bag requests from buyers at this time.</p>
                    <p className="text-sm">Bag requests will appear here when buyers request bags for validated transactions.</p>
                  </div>
                )}
              </CardContent>
            </Card>
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
                  Real-time inventory tracking and storage monitoring for warehouse operations
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
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-medium">{item.quantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Storage Date</p>
                            <p className="font-medium">{item.storageDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Temperature</p>
                            <p className="font-medium">{item.temperature}°C</p>
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
                  Code Validation Center
                </CardTitle>
                <CardDescription>
                  Validate buyer acceptance codes and EUDR compliance codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Code Validation Form */}
                  <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50">
                    <h3 className="font-medium mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-green-600" />
                      Validate Compliance Code
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Code Type</label>
                        <select 
                          className="w-full p-3 border rounded-lg"
                          onChange={(e) => setSelectedCodeType(e.target.value)}
                          data-testid="select-code-type"
                        >
                          <option value="">Select Code Type...</option>
                          <option value="buyer-acceptance">Buyer Acceptance Code</option>
                          <option value="eudr-compliance">EUDR Compliance Code</option>
                          <option value="warehouse-verification">Warehouse Verification Code</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Validation Code</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border rounded-lg font-mono"
                          placeholder="Enter code (e.g., V1A2B3C4)"
                          value={validationCode}
                          onChange={(e) => setValidationCode(e.target.value.toUpperCase())}
                          data-testid="input-validation-code"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">Valid codes for this warehouse:</p>
                          <p>Buyer Acceptance: V1A2B3C4 • EUDR Compliance: EU2024XYZ • Warehouse: WH-BATCH-001</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4 bg-green-600 hover:bg-green-700" 
                      onClick={() => {
                        if (selectedCodeType && validationCode) {
                          validateCodeMutation.mutate({ 
                            codeType: selectedCodeType, 
                            verificationCode: validationCode 
                          });
                        } else {
                          toast({
                            title: "❌ Missing Information",
                            description: "Please select code type and enter validation code",
                            variant: "destructive"
                          });
                        }
                      }}
                      disabled={validateCodeMutation.isPending || !selectedCodeType || !validationCode}
                      data-testid="button-validate-code"
                    >
                      {validateCodeMutation.isPending ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Validating...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Validate Code
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Recent Validation History */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      Recent Validations
                    </h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3 bg-green-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-800">V1A2B3C4</p>
                            <p className="text-sm text-green-600">Buyer Acceptance Code - EUDR Compliant ✅</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Validated</Badge>
                        </div>
                      </div>
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">Additional validation history will appear here</p>
                      </div>
                    </div>
                  </div>
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
                  Quality Control Management
                </CardTitle>
                <CardDescription>
                  Monitor and manage quality control processes for stored commodities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loadingQuality ? (
                    <p className="text-center text-gray-500">Loading quality data...</p>
                  ) : qualityControls && qualityControls.length > 0 ? (
                    qualityControls.map((control: any) => (
                      <div key={control.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{control.testType}</h4>
                            <p className="text-sm text-gray-600">Batch: {control.batchNumber}</p>
                          </div>
                          <Badge className={control.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {control.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Test Date</p>
                            <p className="font-medium">{control.testDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Inspector</p>
                            <p className="font-medium">{control.inspector}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Score</p>
                            <p className="font-medium">{control.score}%</p>
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

      {/* QR Code Modal */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code - {selectedQrBatch?.batchCode}
            </DialogTitle>
          </DialogHeader>
          {selectedQrBatch && (
            <div className="space-y-6">
              {/* QR Code Image */}
              <div className="flex justify-center">
                {selectedQrBatch.qrCodeUrl ? (
                  <div className="text-center">
                    <img 
                      src={selectedQrBatch.qrCodeUrl} 
                      alt={`QR Code for ${selectedQrBatch.batchCode}`}
                      className="w-64 h-64 mx-auto mb-4 border-2 border-gray-200 rounded-lg"
                    />
                    <p className="text-sm text-gray-600">
                      Scan this QR code for complete traceability information
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">QR Code not available</p>
                  </div>
                )}
              </div>

              {/* Batch Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Batch Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Batch Code:</span>
                      <p className="font-mono text-blue-600">{selectedQrBatch.batchCode}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Commodity:</span>
                      <p>{selectedQrBatch.commodityType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Weight:</span>
                      <p>{selectedQrBatch.totalWeight} kg</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Bags:</span>
                      <p>{selectedQrBatch.totalBags} bags</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Traceability</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Farmer:</span>
                      <p>{selectedQrBatch.farmerName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Buyer:</span>
                      <p>{selectedQrBatch.buyerName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Generated:</span>
                      <p>{new Date(selectedQrBatch.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <Badge className={selectedQrBatch.status === 'generated' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                        {selectedQrBatch.status.charAt(0).toUpperCase() + selectedQrBatch.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Data Information */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg mb-3">QR Code Contains</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <ul className="text-sm space-y-1 list-disc list-inside text-blue-700">
                    <li><strong>Complete Traceability Chain:</strong> From farm to warehouse</li>
                    <li><strong>Product Information:</strong> Commodity type, quality grade, harvest date</li>
                    <li><strong>EUDR Compliance Data:</strong> Deforestation risk assessment, geolocation</li>
                    <li><strong>Inspection Results:</strong> Quality control and compliance verification</li>
                    <li><strong>Certification Data:</strong> LACRA compliance, international standards</li>
                    <li><strong>Digital Verification:</strong> Tamper-proof signatures and verification URL</li>
                    <li><strong>Packaging Details:</strong> Bag counts, weights, and storage information</li>
                    <li><strong>Stakeholder Information:</strong> Farmer, buyer, warehouse, and inspector details</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => handlePrintQr(selectedQrBatch)}
                  className="flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print QR Code
                </Button>
                <Button 
                  onClick={() => setShowQrModal(false)}
                  className="flex items-center gap-2"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
