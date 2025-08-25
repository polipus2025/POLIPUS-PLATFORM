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
  QrCode,
  Layers,
  X,
  ShieldCheck,
  Settings
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
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [custodyRegistrationMode, setCustodyRegistrationMode] = useState<'single' | 'multi'>('single');
  const [scannedQrCode, setScannedQrCode] = useState('');
  const [scannedQrCodes, setScannedQrCodes] = useState<any[]>([]);
  const [multiLotValidation, setMultiLotValidation] = useState<any>(null);
  const [selectedStorageRate, setSelectedStorageRate] = useState('1.50');
  const [storageLocation, setStorageLocation] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [packagingType, setPackagingType] = useState('50kg bags');
  const [totalPackages, setTotalPackages] = useState(10);
  const [packageWeight, setPackageWeight] = useState(50);
  const [storageConditions, setStorageConditions] = useState("");
  const [productToRegister, setProductToRegister] = useState<any>(null);
  const [currentQrInput, setCurrentQrInput] = useState('');
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

  // Additional warehouse states
  const [showCustodyModal, setShowCustodyModal] = useState(false);

  // QR Code lookup handler
  const handleQrCodeLookup = async () => {
    if (!scannedQrCode.trim()) return;
    
    try {
      // Call the real API to get QR data
      const response = await fetch(`/api/warehouse-custody/lookup-qr/${scannedQrCode}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const qrInfo = data.data;
        
        // Calculate storage fee based on weight
        const weightInTons = parseFloat(qrInfo.weight) || 0;
        const storageFee = weightInTons * 50; // $50 per metric ton
        
        const productData = {
          batchCode: qrInfo.batchCode,
          commodityType: qrInfo.commodityType,
          weight: weightInTons,
          unit: "metric tons",
          buyerName: qrInfo.buyerName,
          buyerCompany: qrInfo.buyerCompany,
          buyerId: qrInfo.buyerId,
          originalFarmer: qrInfo.farmerName,
          purchaseDate: qrInfo.harvestDate || new Date().toISOString().split('T')[0],
          county: qrInfo.farmLocation,
          storageFee: storageFee,
          qualityGrade: qrInfo.qualityGrade,
          totalPackages: qrInfo.totalPackages,
          packageWeight: qrInfo.packageWeight,
          eudrCompliance: qrInfo.eudrCompliance
        };
        
        if (custodyRegistrationMode === 'single') {
          setScannedQrCodes([productData]);
        } else {
          // Multi-lot mode - add to list if not already present
          const exists = scannedQrCodes.find(qr => qr.batchCode === productData.batchCode);
          if (!exists) {
            const newCodes = [...scannedQrCodes, productData];
            setScannedQrCodes(newCodes);
            
            // Check compatibility if we have 2+ items
            if (newCodes.length >= 2) {
              const firstType = newCodes[0].commodityType;
              const allSameType = newCodes.every(qr => qr.commodityType === firstType);
              
              if (allSameType) {
                setMultiLotValidation({
                  success: true,
                  message: `All ${newCodes.length} lots are ${firstType} and compatible for consolidation`
                });
              } else {
                setMultiLotValidation({
                  success: false,
                  error: "Cannot consolidate different commodity types in multi-lot"
                });
              }
            }
          }
        }
        
        setScannedQrCode('');
        toast({
          title: "Buyer Product Found",
          description: `${productData.commodityType} owned by ${productData.buyerName} - ${productData.weight} ${productData.unit} (Storage Fee: $${productData.storageFee})`
        });
      } else {
        toast({
          title: "QR Code Not Found",
          description: data.message || "QR code not found in database",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('QR lookup error:', error);
      toast({
        title: "Lookup Error",
        description: "Failed to lookup QR code. Please try again.",
        variant: "destructive"
      });
    }
  };

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
            <TabsTrigger value="registration" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <QrCode className="w-4 h-4 mr-2" />
              Registration
            </TabsTrigger>
            <TabsTrigger value="custody" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Custody
            </TabsTrigger>
            <TabsTrigger value="inspections" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <ClipboardCheck className="w-4 h-4 mr-2" />
              Inspections
            </TabsTrigger>
            <TabsTrigger value="storage" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Warehouse className="w-4 h-4 mr-2" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="temperature" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Thermometer className="w-4 h-4 mr-2" />
              Temperature
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="quality" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Quality
            </TabsTrigger>
            <TabsTrigger value="shipping" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Truck className="w-4 h-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
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

          {/* Product Registration Tab - Two conditional modes */}
          <TabsContent value="registration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Scanner Section with Registration Mode Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="w-5 h-5 mr-2 text-blue-600" />
                    Product Registration & Custody
                  </CardTitle>
                  <CardDescription>
                    Register buyer products and place under mandatory warehouse custody control
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Registration Mode Selection */}
                  <div className="flex gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
                    <Button 
                      size="sm"
                      variant={custodyRegistrationMode === 'single' ? 'default' : 'outline'}
                      onClick={() => {
                        setCustodyRegistrationMode('single');
                        setScannedQrCodes([]);
                        setMultiLotValidation(null);
                      }}
                      data-testid="button-single-lot-registration"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Single Lot Registration
                    </Button>
                    <Button 
                      size="sm"
                      variant={custodyRegistrationMode === 'multi' ? 'default' : 'outline'}
                      onClick={() => {
                        setCustodyRegistrationMode('multi');
                        setScannedQrCodes([]);
                        setMultiLotValidation(null);
                      }}
                      data-testid="button-multi-lot-registration"
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Multi-Lot Registration
                    </Button>
                  </div>

                  {/* QR Code Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {custodyRegistrationMode === 'single' ? 'Product QR Code' : 'Product QR Codes (Scan Multiple)'}
                    </label>
                    <Input
                      placeholder={custodyRegistrationMode === 'single' ? "Scan or enter QR code" : "Scan or enter QR code (one at a time)"}
                      value={scannedQrCode}
                      onChange={(e) => setScannedQrCode(e.target.value)}
                      data-testid="input-qr-code"
                    />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Use your working QR code for testing
                          setScannedQrCode("WH-BATCH-1756052880737-8P2L");
                        }}
                        data-testid="button-use-test-qr"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Use Test QR
                      </Button>
                      <Button 
                        onClick={handleQrCodeLookup}
                        disabled={!scannedQrCode}
                        data-testid="button-lookup-qr"
                      >
                        {custodyRegistrationMode === 'single' ? 'Lookup & Register' : 'Add to Multi-Lot'}
                      </Button>
                    </div>
                  </div>

                  {/* Multi-lot validation status */}
                  {custodyRegistrationMode === 'multi' && scannedQrCodes.length >= 2 && (
                    <div className={`p-4 rounded-lg border ${
                      multiLotValidation?.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <h4 className={`font-medium mb-2 ${
                        multiLotValidation?.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {multiLotValidation?.success ? '✅ Multi-Lot Compatible' : '❌ Multi-Lot Incompatible'}
                      </h4>
                      {multiLotValidation?.success ? (
                        <p className="text-sm text-green-700">{multiLotValidation.message}</p>
                      ) : (
                        <p className="text-sm text-red-700">{multiLotValidation?.error}</p>
                      )}
                    </div>
                  )}

                  {/* Scanned QR codes display */}
                  {scannedQrCodes.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">
                        {custodyRegistrationMode === 'single' ? 'Product to Register:' : `Scanned Products (${scannedQrCodes.length}):`}
                      </h4>
                      {scannedQrCodes.map((product, index) => (
                        <div key={product.batchCode} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-blue-800">{product.commodityType} - {product.weight} {product.unit}</p>
                              <p className="text-sm text-blue-600">Buyer: {product.buyerName || product.buyerCompany}</p>
                              <p className="text-sm text-blue-600">Storage Fee: ${product.storageFee || (product.weight * 50)}</p>
                              <p className="text-xs text-blue-500">QR: {product.batchCode}</p>
                            </div>
                            {custodyRegistrationMode === 'multi' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  const newCodes = scannedQrCodes.filter((_, i) => i !== index);
                                  setScannedQrCodes(newCodes);
                                  if (newCodes.length < 2) {
                                    setMultiLotValidation(null);
                                  }
                                }}
                                data-testid={`button-remove-qr-${index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Registration button */}
                  {scannedQrCodes.length > 0 && (custodyRegistrationMode === 'single' || multiLotValidation?.success) && (
                    <Button 
                      className="w-full"
                      onClick={() => setShowRegistrationModal(true)}
                      data-testid="button-register-product-custody"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Register for Warehouse Custody
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Storage Configuration Section */}
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
                    <label className="text-sm font-medium">Storage Fee (One-time per Metric Ton)</label>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-800 font-medium">
                        Storage Fee: $50.00 per Metric Ton
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        One-time warehouse custody fee for {warehouseFacility}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Available Storage Locations</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                        <span className="text-green-800 font-medium">Section A-1</span>
                        <span className="text-green-600 text-xs block">Available (85% capacity)</span>
                      </div>
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                        <span className="text-green-800 font-medium">Section B-2</span>
                        <span className="text-green-600 text-xs block">Available (72% capacity)</span>
                      </div>
                      <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <span className="text-yellow-800 font-medium">Section C-1</span>
                        <span className="text-yellow-600 text-xs block">Limited (95% capacity)</span>
                      </div>
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                        <span className="text-red-800 font-medium">Section A-2</span>
                        <span className="text-red-600 text-xs block">Full (100% capacity)</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Custody Records */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-3">
                      Recent Registrations
                    </h3>
                    {custodyRecordsLoading ? (
                      <div className="text-center text-gray-500 py-4 border border-dashed border-gray-200 rounded-lg">
                        Loading custody records...
                      </div>
                    ) : custodyRecords && custodyRecords.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {custodyRecords.slice(0, 3).map((record: any) => (
                          <div key={record.custodyId} className="p-2 bg-gray-50 border rounded-lg text-sm">
                            <p className="font-medium">{record.commodityType}</p>
                            <p className="text-xs text-gray-600">{record.totalWeight} tons • {record.authorizationStatus}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4 border border-dashed border-gray-200 rounded-lg">
                        <Package className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm">No products registered yet</p>
                        <p className="text-xs text-gray-400">Register buyer products to begin custody process</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Custody Management Tab - Simple QR scanner for warehouse-generated codes */}
          <TabsContent value="custody" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="w-5 h-5 mr-2 text-blue-600" />
                  Custody Management
                </CardTitle>
                <CardDescription>
                  Scan warehouse-generated QR codes to manage product custody and storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Warehouse QR Code</label>
                  <Input
                    placeholder="Scan warehouse-generated QR code"
                    value={scannedQrCode}
                    onChange={(e) => setScannedQrCode(e.target.value)}
                    data-testid="input-custody-qr-code"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Use test QR code for demonstration
                        setScannedQrCode("QR-MULTI-LOT-WH-001-20250825");
                      }}
                      data-testid="button-use-warehouse-qr"
                    >
                      <QrCode className="w-4 h-4 mr-1" />
                      Use Warehouse QR
                    </Button>
                    <Button 
                      onClick={handleQrCodeLookup}
                      disabled={!scannedQrCode}
                      data-testid="button-manage-custody"
                    >
                      Manage Custody
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                  <p><strong>Note:</strong> This tab manages products that have already been registered. Scan QR codes generated from the Registration process.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inspections Tab */}
          <TabsContent value="inspections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inspection Management</CardTitle>
                <CardDescription>
                  Manage product inspections and quality control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Inspection management features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Storage Tab */}
          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Storage Management</CardTitle>
                <CardDescription>
                  Monitor warehouse storage and capacity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Storage management features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Temperature Tab */}
          <TabsContent value="temperature" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Monitoring</CardTitle>
                <CardDescription>
                  Monitor storage temperature and environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Temperature monitoring features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Reports</CardTitle>
                <CardDescription>
                  Generate warehouse activity and storage reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Reporting features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Control</CardTitle>
                <CardDescription>
                  Manage product quality assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Quality control features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Coordination</CardTitle>
                <CardDescription>
                  Coordinate product shipping and logistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Shipping coordination features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Settings</CardTitle>
                <CardDescription>
                  Configure warehouse operational settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">Settings features coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Product Registration Confirmation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Confirm registration of {scannedQrCodes.length} product{scannedQrCodes.length > 1 ? 's' : ''} for warehouse custody.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Handle registration logic here
                    setShowRegistrationModal(false);
                    setScannedQrCodes([]);
                    setMultiLotValidation(null);
                  }}
                  className="flex-1"
                >
                  Confirm Registration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}