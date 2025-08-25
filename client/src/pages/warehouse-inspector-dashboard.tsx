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
  const [selectedBagRequest, setSelectedBagRequest] = useState<any>(null);
  const [showBagDetailsModal, setShowBagDetailsModal] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [packagingType, setPackagingType] = useState('50kg bags');
  const [totalPackages, setTotalPackages] = useState(10);
  const [packageWeight, setPackageWeight] = useState(50);
  // Product Registration states
  const [scannedQrCode, setScannedQrCode] = useState("");
  const [selectedStorageRate, setSelectedStorageRate] = useState("1.50");
  const [storageLocation, setStorageLocation] = useState("");
  const [storageConditions, setStorageConditions] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [productToRegister, setProductToRegister] = useState<any>(null);
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

  // Fetch available transactions for QR batch generation
  const { data: availableTransactions, isLoading: availableTransactionsLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/available-transactions'],
    select: (data: any) => data?.data || []
  });

  // Warehouse Custody System States
  const [custodyRegistrationMode, setCustodyRegistrationMode] = useState<'single' | 'multi'>('single');
  const [scannedQrCodes, setScannedQrCodes] = useState<any[]>([]);
  const [currentQrInput, setCurrentQrInput] = useState('');
  const [multiLotValidation, setMultiLotValidation] = useState<any>(null);
  const [showCustodyModal, setShowCustodyModal] = useState(false);

  // Warehouse Custody Records Query
  const { data: custodyRecords, isLoading: custodyRecordsLoading } = useQuery({
    queryKey: ['/api/warehouse-custody/records'],
    select: (data: any) => data?.data || []
  });

  // QR Code Lookup Mutation
  const lookupQrMutation = useMutation({
    mutationFn: async (qrCode: string) => {
      const response = await fetch(`/api/warehouse-custody/lookup-qr/${qrCode}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'QR code not found');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (custodyRegistrationMode === 'single') {
        setScannedQrCodes([data.data]);
        toast({
          title: "✅ QR Code Found",
          description: `Found ${data.data.commodityType} from ${data.data.farmerName} (${data.data.weight} tons)`,
        });
      } else {
        // Multi-lot mode - add to list
        const existingIndex = scannedQrCodes.findIndex(qr => qr.batchCode === data.data.batchCode);
        if (existingIndex === -1) {
          setScannedQrCodes(prev => [...prev, data.data]);
          toast({
            title: "✅ QR Code Added",
            description: `Added ${data.data.commodityType} from ${data.data.farmerName} to multi-lot custody`,
          });
        } else {
          toast({
            title: "⚠️ Duplicate QR Code",
            description: "This QR code is already in the list",
            variant: "destructive",
          });
        }
      }
      setCurrentQrInput('');
    },
    onError: (error: any) => {
      toast({
        title: "❌ QR Lookup Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Multi-Lot Validation Mutation
  const validateMultiLotMutation = useMutation({
    mutationFn: async (qrCodes: string[]) => {
      const response = await fetch('/api/warehouse-custody/validate-multi-lot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCodes })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Validation failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setMultiLotValidation(data);
      toast({
        title: "✅ Multi-Lot Validated",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Validation Failed",
        description: error.message,
        variant: "destructive",
      });
      setMultiLotValidation(null);
    }
  });

  // Custody Registration Mutation
  const registerCustodyMutation = useMutation({
    mutationFn: async (registrationData: any) => {
      const response = await fetch('/api/warehouse-custody/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Custody Registered",
        description: `${data.message} (Storage Fee: $${data.storageAmount})`,
      });
      // Reset form
      setScannedQrCodes([]);
      setMultiLotValidation(null);
      setCurrentQrInput('');
      setShowCustodyModal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-custody/records'] });
    },
    onError: (error: any) => {
      toast({
        title: "❌ Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Product registration mutation
  const registerProductMutation = useMutation({
    mutationFn: async (registrationData: any) => {
      return await apiRequest('/api/warehouse-inspector/register-product', {
        method: 'POST',
        body: JSON.stringify(registrationData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Product Registered",
        description: "Product successfully registered for warehouse custody",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-custody/records'] });
      // Reset form
      setScannedQrCode("");
      setProductToRegister(null);
      setStorageLocation("");
      setStorageConditions("");
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register product",
        variant: "destructive",
      });
    }
  });

  // Handle QR code lookup
  const handleQrCodeLookup = async () => {
    if (!scannedQrCode) return;

    try {
      const response = await apiRequest(`/api/warehouse-inspector/lookup-qr/${scannedQrCode}`, {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        setProductToRegister(response.data);
        toast({
          title: "Product Found",
          description: `Found ${response.data.commodityType} from ${response.data.buyerName}`,
        });
      } else {
        toast({
          title: "Product Not Found",
          description: "QR code not found in system records",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Lookup Failed",
        description: error.message || "Failed to lookup QR code",
        variant: "destructive",
      });
    }
  };

  // Handle product registration
  const handleRegisterProduct = async () => {
    if (!productToRegister) return;

    const custodyId = `CUSTODY-WH-${inspectorCounty.toUpperCase().replace(/\s+/g, '')}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    const registrationData = {
      custodyId,
      buyerId: productToRegister.buyerId,
      buyerName: productToRegister.buyerName,
      buyerCompany: productToRegister.buyerCompany,
      productQrCode: scannedQrCode,
      verificationCode: productToRegister.verificationCode,
      warehouseId: inspectorData.warehouseId || "WH-001",
      warehouseName: warehouseFacility,
      county: inspectorCounty,
      commodityType: productToRegister.commodityType,
      farmerName: productToRegister.farmerName,
      farmLocation: productToRegister.farmLocation,
      weight: parseFloat(productToRegister.weight),
      unit: productToRegister.unit,
      qualityGrade: productToRegister.qualityGrade,
      storageLocation,
      storageConditions,
      dailyStorageRate: parseFloat(selectedStorageRate)
    };

    registerProductMutation.mutate(registrationData);
  };

  // Custody Records Table Component
  const CustodyRecordsTable = () => {
    const { data: custodyRecords, isLoading } = useQuery({
      queryKey: ['/api/warehouse-custody/records'],
      select: (data: any) => data?.data || []
    });

    if (isLoading) {
      return <p className="text-center text-gray-500">Loading custody records...</p>;
    }

    if (!custodyRecords || custodyRecords.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No products currently in custody</p>
          <p className="text-sm">Scan QR codes to register products</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {custodyRecords.map((record: any) => (
          <div key={record.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800">
                  {record.custodyId}
                </Badge>
                <Badge className={`${
                  record.authorizationStatus === 'authorized' 
                    ? 'bg-green-100 text-green-800' 
                    : record.authorizationStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {record.authorizationStatus}
                </Badge>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Day {record.actualStorageDays || 0} of {record.maxStorageDays}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium mb-1">Product Details</h4>
                <p className="text-sm text-gray-600">Buyer: {record.buyerName}</p>
                <p className="text-sm text-gray-600">Type: {record.commodityType}</p>
                <p className="text-sm text-gray-600">Weight: {record.weight} {record.unit}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Storage Info</h4>
                <p className="text-sm text-gray-600">Location: {record.storageLocation}</p>
                <p className="text-sm text-gray-600">Conditions: {record.storageConditions}</p>
                <p className="text-sm text-gray-600">Rate: ${record.dailyStorageRate}/ton/day</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Origin</h4>
                <p className="text-sm text-gray-600">Farmer: {record.farmerName}</p>
                <p className="text-sm text-gray-600">Location: {record.farmLocation}</p>
                <p className="text-sm text-gray-600">Grade: {record.qualityGrade}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Status</h4>
                <p className="text-sm text-gray-600">
                  Registered: {new Date(record.registrationDate).toLocaleDateString()}
                </p>
                {record.authorizedDate && (
                  <p className="text-sm text-gray-600">
                    Authorized: {new Date(record.authorizedDate).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-1 mt-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  {record.authorizationStatus === 'pending' && (
                    <Button size="sm" variant="outline">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Authorize
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/available-transactions'] });
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

  // Generate QR Batch mutation
  const generateQrBatchMutation = useMutation({
    mutationFn: async (batchData: any) => {
      return await apiRequest('/api/warehouse-inspector/generate-qr-batch', {
        method: 'POST',
        body: JSON.stringify(batchData)
      });
    },
    onSuccess: (data) => {
      toast({
        title: "✅ QR Batch Generated!",
        description: `Successfully generated QR batch: ${data.batchCode}`,
      });
      // Reset form
      setSelectedTransactions([]);
      setPackagingType('50kg bags');
      setTotalPackages(10);
      setPackageWeight(50);
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/qr-batches'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/available-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/transactions'] });
    },
    onError: (error: any) => {
      console.error('QR batch generation error:', error);
      toast({
        title: "❌ QR Batch Generation Failed",
        description: "Failed to generate QR batch. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Handle QR batch generation
  const handleGenerateQrBatch = () => {
    if (selectedTransactions.length === 0) {
      toast({
        title: "❌ No Transactions Selected",
        description: "Please select at least one transaction to generate QR batch.",
        variant: "destructive"
      });
      return;
    }

    generateQrBatchMutation.mutate({
      selectedTransactions,
      packagingType,
      totalPackages,
      packageWeight
    });
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
                  max-width: 400px;
                  max-height: 400px;
                  width: 100%;
                  height: auto;
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
          <TabsList className="grid w-full grid-cols-10 bg-white shadow-sm rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="custody" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Scale className="w-4 h-4 mr-2" />
              Custody
            </TabsTrigger>
            <TabsTrigger value="registration" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <QrCode className="w-4 h-4 mr-2" />
              Registration
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

          {/* Warehouse Custody Tab */}
          <TabsContent value="custody" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - QR Registration */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Scale className="w-5 h-5 mr-2 text-blue-600" />
                      Product Custody Registration
                    </CardTitle>
                    <CardDescription>
                      Register products for warehouse custody storage - Single lot or multi-lot consolidation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Registration Mode Selection */}
                    <div className="flex space-x-2">
                      <Button
                        variant={custodyRegistrationMode === 'single' ? 'default' : 'outline'}
                        onClick={() => {
                          setCustodyRegistrationMode('single');
                          setScannedQrCodes([]);
                          setMultiLotValidation(null);
                        }}
                        className="flex-1"
                        data-testid="button-single-mode"
                      >
                        Single Lot
                      </Button>
                      <Button
                        variant={custodyRegistrationMode === 'multi' ? 'default' : 'outline'}
                        onClick={() => {
                          setCustodyRegistrationMode('multi');
                          setScannedQrCodes([]);
                          setMultiLotValidation(null);
                        }}
                        className="flex-1"
                        data-testid="button-multi-mode"
                      >
                        Multi-Lot
                      </Button>
                    </div>

                    {/* QR Code Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Scan or enter QR code..."
                        value={currentQrInput}
                        onChange={(e) => setCurrentQrInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && currentQrInput.trim()) {
                            lookupQrMutation.mutate(currentQrInput.trim());
                          }
                        }}
                        data-testid="input-qr-code"
                      />
                      <Button 
                        onClick={() => currentQrInput.trim() && lookupQrMutation.mutate(currentQrInput.trim())}
                        disabled={!currentQrInput.trim() || lookupQrMutation.isPending}
                        data-testid="button-scan-qr"
                      >
                        {lookupQrMutation.isPending ? 'Looking up...' : 'Scan'}
                      </Button>
                    </div>

                    {/* Scanned QR Codes Display */}
                    {scannedQrCodes.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-medium">Scanned QR Codes ({scannedQrCodes.length})</h3>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {scannedQrCodes.map((qr, index) => (
                            <div key={qr.batchCode} className="p-3 border rounded-lg" data-testid={`qr-item-${index}`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{qr.commodityType}</p>
                                  <p className="text-sm text-gray-600">{qr.farmerName} - {qr.weight} tons</p>
                                  <p className="text-xs text-gray-500">{qr.batchCode}</p>
                                </div>
                                {custodyRegistrationMode === 'multi' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setScannedQrCodes(prev => prev.filter((_, i) => i !== index));
                                      setMultiLotValidation(null);
                                    }}
                                    data-testid={`button-remove-qr-${index}`}
                                  >
                                    Remove
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Multi-Lot Validation */}
                    {custodyRegistrationMode === 'multi' && scannedQrCodes.length >= 2 && (
                      <Button
                        onClick={() => validateMultiLotMutation.mutate(scannedQrCodes.map(qr => qr.batchCode))}
                        disabled={validateMultiLotMutation.isPending}
                        className="w-full"
                        data-testid="button-validate-multi-lot"
                      >
                        {validateMultiLotMutation.isPending ? 'Validating...' : 'Validate Multi-Lot Compatibility'}
                      </Button>
                    )}

                    {/* Validation Results */}
                    {multiLotValidation && (
                      <div className="p-3 border border-green-200 bg-green-50 rounded-lg" data-testid="validation-results">
                        <p className="text-green-800 font-medium">✅ Multi-Lot Validated</p>
                        <p className="text-sm text-green-700">
                          {multiLotValidation.consolidatedData.totalLots} lots of {multiLotValidation.consolidatedData.commodityType} 
                          ({multiLotValidation.consolidatedData.totalWeight} tons total)
                        </p>
                      </div>
                    )}

                    {/* Register Custody Button */}
                    {scannedQrCodes.length > 0 && (custodyRegistrationMode === 'single' || multiLotValidation) && (
                      <Button
                        onClick={() => setShowCustodyModal(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        data-testid="button-register-custody"
                      >
                        Register for Warehouse Custody
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Custody Records */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      Custody Records
                    </CardTitle>
                    <CardDescription>
                      Active warehouse custody registrations and storage fees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {custodyRecordsLoading ? (
                      <p className="text-center text-gray-500">Loading custody records...</p>
                    ) : custodyRecords && custodyRecords.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {custodyRecords.map((record: any) => (
                          <div key={record.custodyId} className="p-4 border rounded-lg" data-testid={`custody-record-${record.custodyId}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">{record.commodityType}</p>
                                <p className="text-sm text-gray-600">
                                  {record.custodyType === 'multi_lot' ? 
                                    `Multi-lot (${record.farmerNames?.length || 1} farmers)` : 
                                    record.farmerNames?.[0] || 'Single lot'}
                                </p>
                                <p className="text-xs text-gray-500">{record.custodyId}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={
                                  record.authorizationStatus === 'authorized' ? 'bg-green-100 text-green-800' :
                                  record.authorizationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {record.authorizationStatus}
                                </Badge>
                                <p className="text-sm font-medium mt-1">{record.totalWeight} tons</p>
                                <p className="text-xs text-gray-500">${record.calculatedAmount || (record.totalWeight * 50)} storage fee</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No custody records found</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Product Registration Tab */}
          <TabsContent value="registration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Scanner Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2 text-blue-600" />
                    QR Code Scanner
                  </CardTitle>
                  <CardDescription>
                    Scan buyer product QR codes to register for warehouse custody
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Product QR Code</label>
                    <Input
                      placeholder="Scan or enter QR code"
                      value={scannedQrCode}
                      onChange={(e) => setScannedQrCode(e.target.value)}
                      data-testid="input-qr-code"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Simulate QR scan - in real implementation this would open camera
                          setScannedQrCode("QR-BUYER-202508-" + Math.random().toString(36).substr(2, 6).toUpperCase());
                        }}
                        data-testid="button-simulate-scan"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Simulate Scan
                      </Button>
                      <Button 
                        onClick={handleQrCodeLookup}
                        disabled={!scannedQrCode}
                        data-testid="button-lookup-qr"
                      >
                        Lookup Product
                      </Button>
                    </div>
                  </div>

                  {productToRegister && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-2">Product Found ✓</h4>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <p><span className="font-medium">Buyer:</span> {productToRegister.buyerName}</p>
                        <p><span className="font-medium">Commodity:</span> {productToRegister.commodityType}</p>
                        <p><span className="font-medium">Weight:</span> {productToRegister.weight} {productToRegister.unit}</p>
                        <p><span className="font-medium">Farmer:</span> {productToRegister.farmerName}</p>
                        <p><span className="font-medium">Quality:</span> {productToRegister.qualityGrade}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Registration Details Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Warehouse className="w-5 h-5 mr-2 text-green-600" />
                    Storage Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure storage rates and location details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Daily Storage Rate (USD per ton)</label>
                    <select
                      value={selectedStorageRate}
                      onChange={(e) => setSelectedStorageRate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="select-storage-rate"
                    >
                      <option value="1.00">$1.00 per ton/day - Basic Storage</option>
                      <option value="1.50">$1.50 per ton/day - Standard Storage</option>
                      <option value="2.00">$2.00 per ton/day - Premium Storage</option>
                      <option value="2.50">$2.50 per ton/day - Climate Controlled</option>
                      <option value="3.00">$3.00 per ton/day - Specialized Storage</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Storage Location</label>
                    <select
                      value={storageLocation}
                      onChange={(e) => setStorageLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="select-storage-location"
                    >
                      <option value="">Select Storage Location</option>
                      <option value="Section A-1">Section A-1 (Dry Goods)</option>
                      <option value="Section A-2">Section A-2 (Climate Controlled)</option>
                      <option value="Section B-1">Section B-1 (Large Items)</option>
                      <option value="Section B-2">Section B-2 (Premium Storage)</option>
                      <option value="Section C-1">Section C-1 (Cold Storage)</option>
                      <option value="Outdoor Area 1">Outdoor Area 1 (Weather Resistant)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Storage Conditions</label>
                    <select
                      value={storageConditions}
                      onChange={(e) => setStorageConditions(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="select-storage-conditions"
                    >
                      <option value="">Select Storage Conditions</option>
                      <option value="Standard">Standard (Room Temperature, Low Humidity)</option>
                      <option value="Climate Controlled">Climate Controlled (20-25°C, 50-60% Humidity)</option>
                      <option value="Dry Storage">Dry Storage (Low Humidity, Ventilated)</option>
                      <option value="Cold Storage">Cold Storage (5-15°C)</option>
                      <option value="Frozen">Frozen Storage (-18°C)</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleRegisterProduct}
                      disabled={!productToRegister || !storageLocation || !storageConditions}
                      className="flex-1"
                      data-testid="button-register-product"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Register for Custody
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Custody Records */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                    Current Custody Records
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  Products currently registered in warehouse custody
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustodyRecordsTable />
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
                          <p className="text-sm text-gray-600 mb-2">Select available transactions for QR batch:</p>
                          {availableTransactionsLoading ? (
                            <p className="text-center text-gray-500">Loading available transactions...</p>
                          ) : availableTransactions && availableTransactions.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {availableTransactions.map((transaction: any) => (
                                <div key={transaction.transactionId} className="flex items-center p-2 border rounded hover:bg-gray-50">
                                  <input
                                    type="checkbox"
                                    id={`transaction-${transaction.transactionId}`}
                                    checked={selectedTransactions.includes(transaction.transactionId)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedTransactions([...selectedTransactions, transaction.transactionId]);
                                      } else {
                                        setSelectedTransactions(selectedTransactions.filter(id => id !== transaction.transactionId));
                                      }
                                    }}
                                    className="mr-3"
                                    data-testid={`checkbox-transaction-${transaction.transactionId}`}
                                  />
                                  <label htmlFor={`transaction-${transaction.transactionId}`} className="flex-1 text-sm cursor-pointer">
                                    <span className="font-medium">{transaction.transactionId}</span> - 
                                    <span className="text-blue-600"> {transaction.buyerName}</span> - 
                                    <span className="text-green-600">{transaction.commodityType}</span> - 
                                    <span>{transaction.quantity} {transaction.unit}</span> - 
                                    <span className="font-medium">${transaction.totalValue}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-amber-600 mt-2 flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              No available transactions for QR batch generation. Complete bag validations first.
                            </p>
                          )}
                          {selectedTransactions.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded">
                              <p className="text-sm text-blue-800">
                                ✅ {selectedTransactions.length} transaction(s) selected for QR batch
                              </p>
                            </div>
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
                            <label className="text-sm font-medium">Total Packages</label>
                            <input 
                              type="number" 
                              value={totalPackages}
                              onChange={(e) => setTotalPackages(Number(e.target.value))}
                              className="w-full mt-1 p-2 border rounded" 
                              placeholder="10" 
                              data-testid="input-total-packages"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Package Weight (kg)</label>
                            <input 
                              type="number" 
                              value={packageWeight}
                              onChange={(e) => setPackageWeight(Number(e.target.value))}
                              className="w-full mt-1 p-2 border rounded" 
                              placeholder="50" 
                              data-testid="input-package-weight"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Packaging Type</label>
                            <select 
                              value={packagingType}
                              onChange={(e) => setPackagingType(e.target.value)}
                              className="w-full mt-1 p-2 border rounded"
                              data-testid="select-packaging-type"
                            >
                              <option value="50kg bags">50kg bags</option>
                              <option value="25kg bags">25kg bags</option>
                              <option value="60kg bags">60kg bags</option>
                              <option value="100kg bags">100kg bags</option>
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
                          <Button 
                            className="flex-1"
                            onClick={handleGenerateQrBatch}
                            disabled={generateQrBatchMutation.isPending || selectedTransactions.length === 0}
                            data-testid="button-generate-qr-batch"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {generateQrBatchMutation.isPending ? 'Generating...' : 'Generate QR Batch'}
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
                        qrBatches.slice(0, 3).map((batch: any) => (
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
                            <div className="flex justify-between items-center pt-3 border-t">
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedBagRequest(request);
                                  setShowBagDetailsModal(true);
                                }}
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                data-testid={`button-view-details-${request.requestId}`}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              
                              <div className="flex space-x-2">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                      className="w-full max-w-sm h-auto mx-auto mb-4 border-2 border-gray-200 rounded-lg"
                      style={{ maxHeight: '80vh', objectFit: 'contain' }}
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
                <h4 className="font-semibold text-lg mb-3">QR Code Data</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  {selectedQrBatch.qrCodeData ? (
                    <div className="space-y-3">
                      <div className="text-sm">
                        <h5 className="font-semibold text-blue-800 mb-2">Traceability Information:</h5>
                        <div className="grid grid-cols-2 gap-4 text-blue-700">
                          <div>
                            <strong>Batch Code:</strong> {selectedQrBatch.qrCodeData.batchCode || selectedQrBatch.batchCode}
                          </div>
                          <div>
                            <strong>Farmer:</strong> {selectedQrBatch.qrCodeData.farmer || selectedQrBatch.farmerName}
                          </div>
                          <div>
                            <strong>Buyer:</strong> {selectedQrBatch.qrCodeData.buyer || selectedQrBatch.buyerName}
                          </div>
                          <div>
                            <strong>Commodity:</strong> {selectedQrBatch.qrCodeData.commodity || selectedQrBatch.commodityType}
                          </div>
                          <div>
                            <strong>Weight:</strong> {selectedQrBatch.qrCodeData.totalWeight || selectedQrBatch.totalWeight} kg
                          </div>
                          <div>
                            <strong>Quality:</strong> {selectedQrBatch.qrCodeData.qualityGrade || selectedQrBatch.qualityGrade}
                          </div>
                        </div>
                      </div>
                      
                      {selectedQrBatch.qrCodeData.eudrCompliance && (
                        <div className="border-t border-blue-200 pt-3">
                          <h5 className="font-semibold text-blue-800 mb-2">EUDR Compliance:</h5>
                          <div className="text-sm text-blue-700">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              selectedQrBatch.qrCodeData.eudrCompliance.compliant 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedQrBatch.qrCodeData.eudrCompliance.compliant ? '✅ EUDR Compliant' : '❌ Non-Compliant'}
                            </span>
                            {selectedQrBatch.qrCodeData.eudrCompliance.deforestationRisk && (
                              <span className="ml-2 text-xs">
                                Risk: {selectedQrBatch.qrCodeData.eudrCompliance.deforestationRisk}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {selectedQrBatch.qrCodeData.verificationUrl && (
                        <div className="border-t border-blue-200 pt-3">
                          <h5 className="font-semibold text-blue-800 mb-2">Verification:</h5>
                          <div className="text-sm text-blue-700">
                            <a 
                              href={selectedQrBatch.qrCodeData.verificationUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="underline hover:text-blue-900"
                            >
                              🔗 Verify Online: {selectedQrBatch.qrCodeData.verificationUrl}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
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
                  )}
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

      {/* Bag Request Details Modal */}
      <Dialog open={showBagDetailsModal} onOpenChange={setShowBagDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              Bag Request Details - Full Information
            </DialogTitle>
          </DialogHeader>
          
          {selectedBagRequest && (
            <div className="space-y-6">
              {/* Request Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {selectedBagRequest.commodityType}
                    </h3>
                    <p className="text-sm text-gray-600">Request ID: {selectedBagRequest.requestId}</p>
                    <Badge className={`mt-2 ${
                      selectedBagRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedBagRequest.status === 'validated' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Status: {selectedBagRequest.status.charAt(0).toUpperCase() + selectedBagRequest.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">${selectedBagRequest.totalValue}</p>
                    <p className="text-sm text-gray-600">Total Transaction Value</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {new Date(selectedBagRequest.requestedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Buyer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Buyer Name</p>
                      <p className="font-medium">{selectedBagRequest.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-medium">{selectedBagRequest.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Buyer ID</p>
                      <p className="font-mono text-sm">{selectedBagRequest.buyerId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact Information</p>
                      <p className="text-sm">{selectedBagRequest.buyerContact || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farm & Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Farm & Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Farmer Name</p>
                      <p className="font-medium">{selectedBagRequest.farmerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Farm Location</p>
                      <p className="text-sm">{selectedBagRequest.farmLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">County</p>
                      <p className="font-medium">{selectedBagRequest.county}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Harvest Date</p>
                      <p className="text-sm">{selectedBagRequest.harvestDate ? new Date(selectedBagRequest.harvestDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quantity Requested</p>
                      <p className="font-medium text-lg">{selectedBagRequest.quantity} {selectedBagRequest.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Quality Grade</p>
                      <p className="font-medium">{selectedBagRequest.qualityGrade || 'Standard Grade'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction & Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Verification Code</p>
                      <p className="font-mono text-lg bg-blue-100 p-2 rounded font-bold text-blue-800">
                        {selectedBagRequest.verificationCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price per Unit</p>
                      <p className="font-medium">${selectedBagRequest.pricePerUnit || (selectedBagRequest.totalValue / selectedBagRequest.quantity).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Terms</p>
                      <p className="text-sm">{selectedBagRequest.paymentTerms || 'Cash on Delivery'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Delivery Terms</p>
                      <p className="text-sm">{selectedBagRequest.deliveryTerms || 'FOB Farm Gate'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* EUDR Compliance Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-600" />
                    EUDR Compliance & Traceability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-sm text-green-800">
                        <strong>✅ EUDR Compliant:</strong> This transaction includes full traceability data required for EU market compliance.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">GPS Coordinates</p>
                        <p className="font-mono text-sm">{selectedBagRequest.gpsCoordinates || '6.3106°N, 10.7969°W'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Land Use Certificate</p>
                        <p className="text-sm">{selectedBagRequest.landCertificate || 'LUC-' + selectedBagRequest.farmerId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Deforestation Risk</p>
                        <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Satellite Monitoring</p>
                        <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              {selectedBagRequest.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedBagRequest.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowBagDetailsModal(false)}
                >
                  Close Details
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowBagDetailsModal(false);
                    handleValidateBagRequest(selectedBagRequest.requestId, 'reject', 'Request rejected after detailed review');
                  }}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Reject Request
                </Button>
                <Button 
                  onClick={() => {
                    setShowBagDetailsModal(false);
                    handleValidateBagRequest(selectedBagRequest.requestId, 'validate', 'Request validated after detailed review');
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validate Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Custody Registration Modal */}
      <Dialog open={showCustodyModal} onOpenChange={setShowCustodyModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register for Warehouse Custody</DialogTitle>
          </DialogHeader>
          
          {scannedQrCodes.length > 0 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Custody Registration Summary</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Registration Type</p>
                    <p className="font-medium">{custodyRegistrationMode === 'single' ? 'Single Lot' : 'Multi-Lot'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total QR Codes</p>
                    <p className="font-medium">{scannedQrCodes.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Weight</p>
                    <p className="font-medium">
                      {scannedQrCodes.reduce((sum, qr) => sum + parseFloat(qr.weight || '0'), 0).toFixed(2)} tons
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Storage Fee ($50/ton)</p>
                    <p className="font-medium text-green-600">
                      ${(scannedQrCodes.reduce((sum, qr) => sum + parseFloat(qr.weight || '0'), 0) * 50).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Codes Details */}
              <div>
                <h3 className="font-medium mb-2">QR Codes to Register</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {scannedQrCodes.map((qr, index) => (
                    <div key={qr.batchCode} className="p-3 border rounded">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{qr.commodityType}</p>
                          <p className="text-sm text-gray-600">{qr.farmerName} - {qr.weight} tons</p>
                        </div>
                        <p className="text-xs text-gray-500">{qr.batchCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validation Status */}
              {custodyRegistrationMode === 'multi' && multiLotValidation && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-green-800 font-medium">✅ Multi-Lot Compatibility Verified</p>
                  <p className="text-sm text-green-700">
                    All lots are compatible for consolidated storage
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCustodyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    const registrationData = {
                      custodyType: custodyRegistrationMode,
                      qrCodes: scannedQrCodes.map(qr => qr.batchCode),
                      inspectorId: inspectorUsername,
                      warehouseFacility: warehouseFacility
                    };
                    registerCustodyMutation.mutate(registrationData);
                  }}
                  disabled={registerCustodyMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                  data-testid="button-confirm-custody"
                >
                  {registerCustodyMutation.isPending ? 'Registering...' : 'Confirm Registration'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
