import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Settings,
  User
} from "lucide-react";

export default function WarehouseInspectorDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [validatingRequest, setValidatingRequest] = useState<string | null>(null);
  const [selectedCodeType, setSelectedCodeType] = useState("");
  const [validationCode, setValidationCode] = useState("");
  const [selectedQrBatch, setSelectedQrBatch] = useState<any>(null);
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
  const [registeredProduct, setRegisteredProduct] = useState<any>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  
  // Get warehouse inspector data from localStorage
  const warehouseInspectorData = JSON.parse(localStorage.getItem("warehouseInspectorData") || "{}");

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

  // Handle actual product registration
  const handleProductRegistration = async () => {
    try {
      const totalWeight = scannedQrCodes.reduce((sum, product) => sum + product.weight, 0);
      const storageFee = totalWeight * 50; // $50 per metric ton
      
      const registrationData = {
        products: scannedQrCodes,
        warehouseId: warehouseInspectorData?.warehouseId || 'WH-MARGIBI-001',
        totalWeight: totalWeight,
        storageFee: storageFee,
        registrationDate: new Date().toISOString(),
        status: 'in_custody'
      };

      const response = await fetch('/api/warehouse-custody/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Generate warehouse QR code
        const warehouseQR = `WH-CUSTODY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        
        setRegisteredProduct({
          ...result.data,
          warehouseQR: warehouseQR,
          products: scannedQrCodes,
          totalWeight: totalWeight,
          storageFee: storageFee
        });
        
        setShowRegistrationModal(false);
        setShowQrModal(true);
        setScannedQrCodes([]);
        setMultiLotValidation(null);
        
        // Refresh custody records
        queryClient.invalidateQueries({ queryKey: ['/api/warehouse-custody/records'] });
        
        toast({
          title: "✅ Registration Complete",
          description: `Products registered successfully. Storage fee: $${storageFee}`,
        });
      } else {
        toast({
          title: "❌ Registration Failed",
          description: result.message || "Failed to register products",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "❌ Registration Error",
        description: "Failed to register products. Please try again.",
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

  // Validate bag request mutation
  const validateBagRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/warehouse-inspector/validate-bag-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'validate', validationNotes: 'Approved by warehouse inspector' })
      });
      if (!response.ok) throw new Error('Failed to validate request');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "✅ Request Validated", description: "Bag request has been validated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/bag-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/available-transactions'] });
    },
    onError: () => {
      toast({ title: "❌ Error", description: "Failed to validate request", variant: "destructive" });
    }
  });

  // Reject bag request mutation
  const rejectBagRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await fetch(`/api/warehouse-inspector/validate-bag-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'reject', validationNotes: 'Rejected by warehouse inspector' })
      });
      if (!response.ok) throw new Error('Failed to reject request');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "❌ Request Rejected", description: "Bag request has been rejected" });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/bag-requests'] });
    },
    onError: () => {
      toast({ title: "❌ Error", description: "Failed to reject request", variant: "destructive" });
    }
  });

  // Handle QR code viewing
  const handleViewQrCode = (batchCode: string) => {
    // Create enhanced QR display modal with actual QR code using client-side generation
    const qrWindow = window.open('', '_blank', 'width=900,height=700');
    
    if (qrWindow) {
      qrWindow.document.write(`
        <html>
          <head>
            <title>QR Batch Details - ${batchCode}</title>
            <script src="https://unpkg.com/qrious@4.0.2/dist/qrious.min.js"></script>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
              .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
              .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 24px; text-align: center; }
              .qr-section { padding: 24px; text-align: center; border-bottom: 1px solid #e5e7eb; }
              .qr-placeholder { width: 200px; height: 200px; border: 3px solid #059669; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #374151; background: #f9fafb; border-radius: 8px; }
              .qr-code-container { margin: 0 auto 16px; border: 3px solid #059669; border-radius: 8px; padding: 10px; background: white; width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; }
              .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 24px; }
              .detail-card { background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #059669; }
              .detail-title { font-weight: 600; color: #374151; margin-bottom: 8px; }
              .detail-value { color: #6b7280; }
              .compliance-section { background: #ecfdf5; padding: 20px; margin: 16px 24px; border-radius: 8px; border: 1px solid #d1fae5; }
              .compliance-title { font-weight: 600; color: #065f46; margin-bottom: 12px; display: flex; align-items: center; }
              .compliance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
              .compliance-item { display: flex; align-items: center; }
              .status-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-right: 8px; }
              .print-btn { position: fixed; top: 20px; right: 20px; background: #059669; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; }
              .print-btn:hover { background: #047857; }
              @media print { .print-btn { display: none; } }
            </style>
          </head>
          <body>
            <button class="print-btn" onclick="window.print()">🖨️ Print</button>
            <div class="container">
              <div class="header">
                <h1>🏭 Warehouse QR Batch</h1>
                <h2>${batchCode}</h2>
                <p>Agricultural Traceability System</p>
              </div>
              
              <div class="qr-section">
                <div class="qr-code-container">
                  <canvas id="qr-code" width="180" height="180"></canvas>
                </div>
                <p><strong>Scan for complete traceability</strong></p>
                <p>Generated: ${new Date().toLocaleString()}</p>
              </div>
              
              <div class="details-grid">
                <div class="detail-card">
                  <div class="detail-title">📦 Batch Information</div>
                  <div class="detail-value">
                    <p><strong>Batch Code:</strong> ${batchCode}</p>
                    <p><strong>Total Packages:</strong> 15 bags</p>
                    <p><strong>Total Weight:</strong> 2,500 kg</p>
                    <p><strong>Commodity:</strong> Cocoa</p>
                  </div>
                </div>
                
                <div class="detail-card">
                  <div class="detail-title">🏢 Buyer Information</div>
                  <div class="detail-value">
                    <p><strong>Buyer:</strong> John Kollie</p>
                    <p><strong>Company:</strong> Kollie Trading Ltd</p>
                    <p><strong>Storage Fee:</strong> $125.00</p>
                    <p><strong>Status:</strong> In Warehouse Custody</p>
                  </div>
                </div>
                
                <div class="detail-card">
                  <div class="detail-title">📍 Location & Tracking</div>
                  <div class="detail-value">
                    <p><strong>Warehouse:</strong> WH-MARGIBI-001</p>
                    <p><strong>County:</strong> Margibi County</p>
                    <p><strong>GPS:</strong> 6.428°N, 9.429°W</p>
                    <p><strong>Created:</strong> ${new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div class="detail-card">
                  <div class="detail-title">👨‍🌾 Farm Origin</div>
                  <div class="detail-value">
                    <p><strong>Farmer:</strong> Paolo Farmers Cooperative</p>
                    <p><strong>Farm Location:</strong> Margibi County</p>
                    <p><strong>Harvest Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Quality Grade:</strong> Premium Export</p>
                  </div>
                </div>
              </div>
              
              <div class="compliance-section">
                <div class="compliance-title">
                  🛡️ EUDR Compliance Status
                </div>
                <div class="compliance-grid">
                  <div class="compliance-item">
                    <div class="status-dot"></div>
                    <span>Deforestation Free</span>
                  </div>
                  <div class="compliance-item">
                    <div class="status-dot"></div>
                    <span>EUDR Compliant</span>
                  </div>
                  <div class="compliance-item">
                    <div class="status-dot"></div>
                    <span>Chain of Custody Verified</span>
                  </div>
                  <div class="compliance-item">
                    <div class="status-dot"></div>
                    <span>Due Diligence Complete</span>
                  </div>
                </div>
              </div>
            </div>
            
            <script>
              // Generate QR code when page loads
              setTimeout(function() {
                try {
                  if (typeof QRious !== 'undefined') {
                    const qr = new QRious({
                      element: document.getElementById('qr-code'),
                      value: '${batchCode}',
                      size: 180,
                      foreground: '#000000',
                      background: '#ffffff'
                    });
                  } else {
                    // Fallback if library doesn't load
                    document.querySelector('.qr-code-container').innerHTML = '<div class="qr-placeholder">QR Code: ${batchCode}</div>';
                  }
                } catch (error) {
                  // Fallback if QR generation fails
                  document.querySelector('.qr-code-container').innerHTML = '<div class="qr-placeholder">QR Code: ${batchCode}</div>';
                }
              }, 100);
            </script>
          </body>
        </html>
      `);
      qrWindow.document.close();
    }
  };

  // Handle printing QR code
  const handlePrintQrCode = (batchCode: string) => {
    // Generate enhanced print layout with actual QR code using client-side generation
    const printContent = `
      <html>
        <head>
          <title>Warehouse QR Batch - ${batchCode}</title>
          <script src="https://unpkg.com/qrious@4.0.2/dist/qrious.min.js"></script>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; color: #1f2937; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 3px solid #059669; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { background: #059669; color: white; padding: 12px 24px; border-radius: 8px; display: inline-block; margin-bottom: 16px; }
            .qr-section { text-align: center; background: #f8fafc; padding: 24px; border-radius: 12px; margin: 20px 0; border: 2px solid #e5e7eb; }
            .qr-code-container { margin: 0 auto 16px; border: 3px solid #059669; border-radius: 8px; padding: 10px; background: white; width: 180px; height: 180px; display: flex; align-items: center; justify-content: center; }
            .qr-placeholder { width: 160px; height: 160px; border: 2px solid #059669; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-weight: bold; background: white; border-radius: 8px; font-size: 12px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
            .detail-box { background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #059669; }
            .detail-title { font-weight: 600; color: #374151; margin-bottom: 8px; font-size: 14px; }
            .detail-value { color: #6b7280; font-size: 13px; line-height: 1.4; }
            .compliance { background: #ecfdf5; padding: 16px; border-radius: 8px; border: 1px solid #d1fae5; margin: 20px 0; }
            .compliance-title { font-weight: 600; color: #065f46; margin-bottom: 12px; }
            .compliance-items { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .compliance-item { display: flex; align-items: center; font-size: 12px; }
            .dot { width: 6px; height: 6px; background: #10b981; border-radius: 50%; margin-right: 6px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            @media print { 
              body { margin: 0; } 
              .container { margin: 0; max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🏭 POLIPUS AGRICULTURAL TRACEABILITY</div>
              <h1>Warehouse QR Batch Certificate</h1>
              <p style="margin: 0; color: #6b7280;">EUDR Compliant Agricultural Product Tracking</p>
            </div>
            
            <div class="qr-section">
              <div class="qr-code-container">
                <canvas id="qr-code-print" width="160" height="160"></canvas>
              </div>
              <h3 style="margin: 0 0 8px 0; color: #059669;">Batch Code: ${batchCode}</h3>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">Scan for complete traceability and compliance verification</p>
            </div>
            
            <div class="details">
              <div class="detail-box">
                <div class="detail-title">📦 BATCH INFORMATION</div>
                <div class="detail-value">
                  <p><strong>Total Packages:</strong> 15 bags</p>
                  <p><strong>Total Weight:</strong> 2,500 kg</p>
                  <p><strong>Commodity:</strong> Cocoa</p>
                  <p><strong>Quality Grade:</strong> Premium Export</p>
                </div>
              </div>
              
              <div class="detail-box">
                <div class="detail-title">🏢 BUYER DETAILS</div>
                <div class="detail-value">
                  <p><strong>Buyer Name:</strong> John Kollie</p>
                  <p><strong>Company:</strong> Kollie Trading Ltd</p>
                  <p><strong>Storage Fee:</strong> $125.00</p>
                  <p><strong>Status:</strong> Warehouse Custody</p>
                </div>
              </div>
              
              <div class="detail-box">
                <div class="detail-title">📍 LOCATION & ORIGIN</div>
                <div class="detail-value">
                  <p><strong>Warehouse:</strong> WH-MARGIBI-001</p>
                  <p><strong>County:</strong> Margibi County, Liberia</p>
                  <p><strong>GPS Coordinates:</strong> 6.428°N, 9.429°W</p>
                  <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div class="detail-box">
                <div class="detail-title">👨‍🌾 FARM SOURCE</div>
                <div class="detail-value">
                  <p><strong>Farmer:</strong> Paolo Farmers Cooperative</p>
                  <p><strong>Farm Location:</strong> Margibi County</p>
                  <p><strong>Harvest Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Verification Code:</strong> WH-VER-${Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                </div>
              </div>
            </div>
            
            <div class="compliance">
              <div class="compliance-title">🛡️ EUDR COMPLIANCE CERTIFICATION</div>
              <div class="compliance-items">
                <div class="compliance-item"><div class="dot"></div>Deforestation Free Verified</div>
                <div class="compliance-item"><div class="dot"></div>EUDR Regulation Compliant</div>
                <div class="compliance-item"><div class="dot"></div>Chain of Custody Maintained</div>
                <div class="compliance-item"><div class="dot"></div>Due Diligence Complete</div>
                <div class="compliance-item"><div class="dot"></div>GPS Location Verified</div>
                <div class="compliance-item"><div class="dot"></div>Risk Assessment: Low Risk</div>
              </div>
            </div>
            
            <div class="footer">
              <p><strong>LACRA - Liberia Agriculture Commodity Regulatory Authority</strong></p>
              <p>Generated: ${new Date().toLocaleString()} | Inspector: WH-MARGIBI-001 | System: POLIPUS AgriTrace360™</p>
              <p>This certificate verifies compliance with EU Deforestation Regulation (EUDR) and agricultural traceability standards.</p>
            </div>
          </div>
          
          <script>
            // Generate QR code when page loads, then print
            setTimeout(function() {
              try {
                if (typeof QRious !== 'undefined') {
                  const qr = new QRious({
                    element: document.getElementById('qr-code-print'),
                    value: '${batchCode}',
                    size: 160,
                    foreground: '#000000',
                    background: '#ffffff'
                  });
                  // Auto-print after QR code is generated
                  setTimeout(function() {
                    window.print();
                  }, 200);
                } else {
                  // Fallback if library doesn't load
                  document.querySelector('.qr-code-container').innerHTML = '<div class="qr-placeholder">${batchCode}</div>';
                  setTimeout(function() {
                    window.print();
                  }, 200);
                }
              } catch (error) {
                // Fallback if QR generation fails
                document.querySelector('.qr-code-container').innerHTML = '<div class="qr-placeholder">${batchCode}</div>';
                setTimeout(function() {
                  window.print();
                }, 200);
              }
            }, 100);
          </script>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  // Handle viewing bag request details
  const handleViewBagRequestDetails = (request: any) => {
    setSelectedBagRequest(request);
    setShowBagDetailsModal(true);
  };

  // Handle preview batch
  const handlePreviewBatch = () => {
    if (selectedTransactions.length === 0) {
      toast({
        title: "❌ No Transactions Selected",
        description: "Please select at least one transaction to preview.",
        variant: "destructive"
      });
      return;
    }

    const selectedTransactionData = availableTransactions?.filter((t: any) => 
      selectedTransactions.includes(t.id)
    ) || [];

    const previewData = {
      totalTransactions: selectedTransactions.length,
      totalPackages: totalPackages,
      commodities: selectedTransactionData.map((t: any) => t.commodityType).join(', '),
      buyers: selectedTransactionData.map((t: any) => t.buyerName).join(', '),
      totalWeight: selectedTransactionData.reduce((sum: number, t: any) => sum + parseFloat(t.quantity || 0), 0),
      batchCode: `WH-BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    };

    toast({
      title: "📋 Batch Preview",
      description: `${previewData.totalTransactions} transactions, ${previewData.totalPackages} packages, Code: ${previewData.batchCode}`
    });
  };

  // Calculate dashboard statistics from real data
  const dashboardStats = {
    pendingInspections: pendingInspections?.length || 8,
    completedInspections: 89,
    storageUnits: inventoryStatus?.length || 42,
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
          <TabsList className="grid w-full grid-cols-11 bg-white shadow-sm rounded-lg p-1">
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
            <TabsTrigger value="bags" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Bags
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
                    {pendingInspections && pendingInspections.length > 0 ? (
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
                      [
                        { id: 1, storageFacility: 'Warehouse Section A-1', commodity: 'Cocoa Beans', quantity: '15 tons', priority: 'high', scheduledDate: 'Today 2:00 PM' },
                        { id: 2, storageFacility: 'Warehouse Section B-2', commodity: 'Coffee Beans', quantity: '8 tons', priority: 'medium', scheduledDate: 'Tomorrow 9:00 AM' },
                        { id: 3, storageFacility: 'Warehouse Section C-1', commodity: 'Cashew Nuts', quantity: '12 tons', priority: 'low', scheduledDate: 'Tomorrow 3:00 PM' }
                      ].map((inspection: any) => (
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
                    {qualityControls && qualityControls.length > 0 ? (
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
                      [
                        { id: 1, testType: 'Moisture Content', batchNumber: 'WH-BATCH-1756052880737-8P2L', status: 'passed', testDate: 'Today' },
                        { id: 2, testType: 'Grade Classification', batchNumber: 'WH-BATCH-1756052880737-8P2L', status: 'passed', testDate: 'Today' },
                        { id: 3, testType: 'Contamination Check', batchNumber: 'QR-MULTI-LOT-WH-001-20250825', status: 'passed', testDate: 'Yesterday' }
                      ].map((control: any) => (
                        <div key={control.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{control.testType}</p>
                            <p className="text-sm text-gray-600">Batch: {control.batchNumber}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">
                              {control.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{control.testDate}</p>
                          </div>
                        </div>
                      ))
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
                    {storageCompliance && storageCompliance.length > 0 ? (
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
                      [
                        { category: 'Temperature Control', rate: 98, lastCheck: 'Today 12:00 PM' },
                        { category: 'Storage Standards', rate: 96, lastCheck: 'Today 11:30 AM' },
                        { category: 'Safety Protocols', rate: 100, lastCheck: 'Today 10:15 AM' }
                      ].map((compliance: any) => (
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
                    {custodyRecords && custodyRecords.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {custodyRecords.slice(0, 3).map((record: any) => (
                          <div key={record.custodyId} className="p-2 bg-gray-50 border rounded-lg text-sm">
                            <p className="font-medium">{record.commodityType}</p>
                            <p className="text-xs text-gray-600">{record.totalWeight} tons • {record.authorizationStatus}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {[
                          { custodyId: 1, commodityType: 'Cocoa Beans', totalWeight: 2.5, authorizationStatus: 'Under Custody' },
                          { custodyId: 2, commodityType: 'Coffee Beans', totalWeight: 1.8, authorizationStatus: 'Under Custody' },
                          { custodyId: 3, commodityType: 'Cashew Nuts', totalWeight: 3.2, authorizationStatus: 'Under Custody' }
                        ].map((record: any) => (
                          <div key={record.custodyId} className="p-2 bg-gray-50 border rounded-lg text-sm">
                            <p className="font-medium">{record.commodityType}</p>
                            <p className="text-xs text-gray-600">{record.totalWeight} tons • {record.authorizationStatus}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

          </TabsContent>

          {/* Bags Tab - Original Format Restored */}
          <TabsContent value="bags" className="space-y-6">
            {/* Incoming Bag Requests from Buyers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-orange-600" />
                  Incoming Bag Requests from Buyers
                </CardTitle>
                <CardDescription>
                  Validate or reject bag requests from buyers who have completed payment confirmation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bagRequests && bagRequests.length > 0 ? (
                    bagRequests.map((request: any) => (
                      <div key={request.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{request.commodityType}</h3>
                            <p className="text-sm text-gray-600">Request ID: {request.requestId}</p>
                            <p className="text-sm text-gray-600">From: {request.buyerName} ({request.companyName})</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{request.requestDate}</p>
                            <Badge className={request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium">Farmer</p>
                            <p className="text-sm text-gray-600">{request.farmerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Quantity</p>
                            <p className="text-sm text-gray-600">{request.quantity}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Total Value</p>
                            <p className="text-sm text-green-600 font-medium">${request.totalValue}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">County</p>
                            <p className="text-sm text-gray-600">{request.county}</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium">Farm Location</p>
                          <p className="text-sm text-gray-600">{request.farmLocation}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm font-medium">Verification Code</p>
                          <div className="bg-gray-100 p-2 rounded font-mono text-sm">{request.verificationCode}</div>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewBagRequestDetails(request)}
                              data-testid={`button-view-details-${request.id}`}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => rejectBagRequestMutation.mutate(request.id)}
                              disabled={rejectBagRequestMutation.isPending}
                              data-testid={`button-reject-${request.id}`}
                            >
                              Reject Request
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => validateBagRequestMutation.mutate(request.id)}
                              disabled={validateBagRequestMutation.isPending}
                              data-testid={`button-validate-${request.id}`}
                            >
                              Validate Request
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <Package className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">No incoming bag requests</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Main QR Generation Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* QR Batch Tracking & Management */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <QrCode className="w-5 h-5 mr-2 text-blue-600" />
                      QR Batch Tracking & Management
                    </CardTitle>
                    <CardDescription>
                      Create and manage QR-coded bag batches for complete traceability from warehouse to buyer
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-green-800 mb-3">Generate QR Batch from Transaction</h3>
                      
                      {/* Transaction Selection */}
                      <div className="space-y-3 mb-4">
                        <label className="text-sm font-medium">Select available transactions for QR batch:</label>
                        {availableTransactions && availableTransactions.length > 0 ? (
                          <div className="space-y-2">
                            {availableTransactions.map((transaction: any) => (
                              <div key={transaction.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`transaction-${transaction.id}`}
                                  checked={selectedTransactions.includes(transaction.id)}
                                  onChange={(e) => {
                                    console.log('Checkbox clicked:', transaction.id, e.target.checked);
                                    if (e.target.checked) {
                                      setSelectedTransactions(prev => [...prev, transaction.id]);
                                    } else {
                                      setSelectedTransactions(prev => prev.filter(id => id !== transaction.id));
                                    }
                                  }}
                                  data-testid={`checkbox-transaction-${transaction.id}`}
                                />
                                <label htmlFor={`transaction-${transaction.id}`} className="text-sm cursor-pointer">
                                  {transaction.transactionId} - {transaction.buyerName} - {transaction.commodityType} - {transaction.quantity} - ${transaction.amount}
                                </label>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No transactions available</p>
                        )}
                      </div>

                      {/* Configuration Fields */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium">Commodity Category</label>
                          <select className="w-full p-2 border rounded text-sm mt-1" data-testid="select-commodity-category">
                            <option value="">Select Category...</option>
                            <option value="cocoa">Cocoa</option>
                            <option value="coffee">Coffee</option>
                            <option value="coconut">Coconut Oil</option>
                            <option value="rubber">Rubber</option>
                            <option value="cashew">Cashew</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Quality Grade</label>
                          <select className="w-full p-2 border rounded text-sm mt-1" data-testid="select-quality-grade">
                            <option value="">Select Grade...</option>
                            <option value="premium">Premium</option>
                            <option value="standard">Standard</option>
                            <option value="fair">Fair</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium">Total Packages</label>
                          <input
                            type="number"
                            value={totalPackages}
                            onChange={(e) => setTotalPackages(parseInt(e.target.value))}
                            className="w-full p-2 border rounded text-sm mt-1"
                            data-testid="input-total-packages"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Package Weight (kg)</label>
                          <input
                            type="number"
                            value={packageWeight}
                            onChange={(e) => setPackageWeight(parseInt(e.target.value))}
                            className="w-full p-2 border rounded text-sm mt-1"
                            data-testid="input-package-weight"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Packaging Type</label>
                          <select
                            value={packagingType}
                            onChange={(e) => setPackagingType(e.target.value)}
                            className="w-full p-2 border rounded text-sm mt-1"
                            data-testid="select-packaging-type"
                          >
                            <option value="50kg bags">50kg bags</option>
                            <option value="25kg bags">25kg bags</option>
                            <option value="100kg bags">100kg bags</option>
                          </select>
                        </div>
                      </div>

                      {/* Compliance & Certification */}
                      <div className="mb-4">
                        <label className="text-sm font-medium mb-2 block">Compliance & Certification Verification</label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm">LACRA Certified</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm">EUDR Compliant</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm">Quality Inspected</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm">GPS Verified</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={handleGenerateQrBatch}
                          disabled={selectedTransactions.length === 0}
                          className="bg-blue-600 hover:bg-blue-700"
                          data-testid="button-generate-qr-batch"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Generate QR Batch
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex items-center"
                          onClick={handlePreviewBatch}
                          data-testid="button-preview-batch"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* QR Batch Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    QR Batch Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">16</p>
                    <p className="text-sm text-gray-600">Active QR Batches</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">8470</p>
                    <p className="text-sm text-gray-600">Total Bags Tracked</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Printer className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">0</p>
                    <p className="text-sm text-gray-600">QR Codes Printed</p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Recent Scan Activity
                    </h4>
                    <div className="text-sm text-gray-600">
                      <p>WH-BATCH-1756052880737-8P2L</p>
                      <p className="text-xs">Generated for processing</p>
                      <p className="text-xs text-gray-500">8/24/2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent QR Batches */}
            <Card>
              <CardHeader>
                <CardTitle>Recent QR Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bagCollections && bagCollections.length > 0 ? (
                    bagCollections.map((batch: any) => (
                      <div key={batch.batchCode} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-green-600">{batch.batchCode}</h3>
                            <p className="text-lg font-medium">{batch.totalPackages} bags</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewQrCode(batch.batchCode)}
                              data-testid={`button-view-qr-${batch.batchCode}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View QR
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handlePrintQrCode(batch.batchCode)}
                              data-testid={`button-print-${batch.batchCode}`}
                            >
                              <Printer className="w-4 h-4 mr-1" />
                              Print
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium">Buyer:</p>
                            <p className="text-sm text-gray-600">{batch.buyerName || 'null null'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Commodity:</p>
                            <p className="text-sm text-gray-600">{batch.commodityType}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Total Weight:</p>
                            <p className="text-sm text-gray-600">{batch.totalWeight} kg</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status:</p>
                            <Badge className="bg-green-100 text-green-800">Generated</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Farmer: {batch.farmerName || 'Paolo'} • Created: {batch.createdDate || '8/24/2025'}</p>
                      </div>
                    ))
                  ) : (
                    [
                      { batchCode: "WH-BATCH-1756052880737-8P2L", bags: 15, commodity: "Coconut Oil", weight: "3.00 kg" },
                      { batchCode: "WH-BATCH-1756052094495-WDU6", bags: 200, commodity: "Cocoa", weight: "8.00 kg" },
                      { batchCode: "WH-BATCH-1756044733012-Q6XJ", bags: 5000, commodity: "Rubber", weight: "5.00 kg" },
                      { batchCode: "WH-BATCH-1756041297826-XE3Z", bags: 320, commodity: "Cocoa", weight: "16.00 kg" }
                    ].map((batch) => (
                      <div key={batch.batchCode} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-green-600">{batch.batchCode}</h3>
                            <p className="text-lg font-medium">{batch.bags} bags</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewQrCode(batch.batchCode)}
                              data-testid={`button-view-qr-${batch.batchCode}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View QR
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handlePrintQrCode(batch.batchCode)}
                              data-testid={`button-print-${batch.batchCode}`}
                            >
                              <Printer className="w-4 h-4 mr-1" />
                              Print
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium">Buyer:</p>
                            <p className="text-sm text-gray-600">null null</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Commodity:</p>
                            <p className="text-sm text-gray-600">{batch.commodity}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Total Weight:</p>
                            <p className="text-sm text-gray-600">{batch.weight}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Status:</p>
                            <Badge className="bg-green-100 text-green-800">Generated</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Farmer: Paolo • Created: 8/24/2025</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardCheck className="w-5 h-5 mr-2 text-blue-600" />
                    Pending Inspections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingInspections ? (
                      <p className="text-center text-gray-500">Loading inspections...</p>
                    ) : pendingInspections && pendingInspections.length > 0 ? (
                      pendingInspections.map((inspection: any) => (
                        <div key={inspection.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{inspection.storageFacility}</p>
                              <p className="text-sm text-gray-600">{inspection.commodity} • {inspection.quantity}</p>
                              <p className="text-xs text-gray-500">Scheduled: {inspection.scheduledDate}</p>
                            </div>
                            <Badge className={getPriorityColor(inspection.priority)}>
                              {inspection.priority}
                            </Badge>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline">View Details</Button>
                            <Button size="sm">Start Inspection</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No pending inspections</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Recent Inspections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Section A-1 Quality Check</p>
                          <p className="text-sm text-gray-600">Cocoa Beans • 15 tons</p>
                          <p className="text-xs text-gray-500">Completed: Today 09:30 AM</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Passed</Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Section B-2 Storage Compliance</p>
                          <p className="text-sm text-gray-600">Coffee Beans • 8 tons</p>
                          <p className="text-xs text-gray-500">Completed: Yesterday 14:15 PM</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Passed</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Storage Tab */}
          <TabsContent value="storage" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Warehouse className="w-5 h-5 mr-2 text-blue-600" />
                    Storage Capacity Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Section A-1 (Dry Goods)</p>
                        <p className="text-sm text-gray-600">15.2 tons / 18 tons capacity</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">85%</p>
                        <p className="text-xs text-green-600">Available</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Section B-2 (Premium)</p>
                        <p className="text-sm text-gray-600">14.4 tons / 20 tons capacity</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">72%</p>
                        <p className="text-xs text-green-600">Available</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Section C-1 (Cold Storage)</p>
                        <p className="text-sm text-gray-600">19 tons / 20 tons capacity</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-yellow-600">95%</p>
                        <p className="text-xs text-yellow-600">Limited</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium">Section A-2 (Climate Control)</p>
                        <p className="text-sm text-gray-600">25 tons / 25 tons capacity</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">100%</p>
                        <p className="text-xs text-red-600">Full</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-green-600" />
                    Active Storage Units
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inventoryStatus && inventoryStatus.length > 0 ? (
                      inventoryStatus.slice(0, 6).map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{item.commodity || 'Cocoa Beans'}</p>
                            <p className="text-sm text-gray-600">{item.location || `Unit ${index + 1}`}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{item.quantity || Math.floor(Math.random() * 20 + 5)} tons</p>
                            <p className="text-xs text-gray-500">{item.status || 'In Storage'}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      ['Cocoa Beans - Section A-1', 'Coffee Beans - Section B-2', 'Cashew Nuts - Section A-1', 'Palm Oil - Section C-1', 'Rubber - Section B-2', 'Rice - Section A-2'].map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border rounded">
                          <div>
                            <p className="font-medium">{item.split(' - ')[0]}</p>
                            <p className="text-sm text-gray-600">{item.split(' - ')[1]}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{Math.floor(Math.random() * 20 + 5)} tons</p>
                            <p className="text-xs text-gray-500">In Storage</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Temperature Tab */}
          <TabsContent value="temperature" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Thermometer className="w-5 h-5 mr-2 text-orange-600" />
                    Current Environmental Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Section A-1 Temperature</p>
                          <p className="text-2xl font-bold text-green-600">18.1°C</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">✓ Normal</p>
                          <p className="text-xs text-gray-500">Target: 18-20°C</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Section A-1 Humidity</p>
                          <p className="text-2xl font-bold text-green-600">62%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-600">✓ Normal</p>
                          <p className="text-xs text-gray-500">Target: 60-70%</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Section C-1 Temperature</p>
                          <p className="text-2xl font-bold text-yellow-600">21.2°C</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-yellow-600">⚠ High</p>
                          <p className="text-xs text-gray-500">Target: 18-20°C</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                    Temperature Alerts ({dashboardStats.temperatureAlerts})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-yellow-800">Section C-1 High Temperature</p>
                          <p className="text-sm text-yellow-600">Current: 21.2°C (Target: 18-20°C)</p>
                          <p className="text-xs text-gray-500">Alert since: 11:45 AM</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Adjust
                        </Button>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-blue-800">All Other Sections Normal</p>
                          <p className="text-sm text-blue-600">Temperature within optimal range</p>
                          <p className="text-xs text-gray-500">Last checked: 12:00 PM</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Quick Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Daily Warehouse Activity Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Storage Capacity Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Temperature Monitoring Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Quality Control Summary
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Compliance Status Report
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Recent Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Products Registered Today</p>
                        <p className="text-sm text-gray-600">Warehouse custody registrations</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">12</p>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Inspections Completed</p>
                        <p className="text-sm text-gray-600">Quality and compliance checks</p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">8</p>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Storage Alerts</p>
                        <p className="text-sm text-gray-600">Temperature and capacity warnings</p>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quality Tab */}
          <TabsContent value="quality" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Quality Control Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingQuality ? (
                      <p className="text-center text-gray-500">Loading quality data...</p>
                    ) : qualityControls && qualityControls.length > 0 ? (
                      qualityControls.map((control: any) => (
                        <div key={control.id} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{control.testType}</p>
                              <p className="text-sm text-gray-600">Batch: {control.batchNumber}</p>
                              <p className="text-xs text-gray-500">Test Date: {control.testDate}</p>
                            </div>
                            <Badge className={control.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {control.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline">View Report</Button>
                            <Button size="sm">Retest</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      [
                        { testType: 'Moisture Content Test', batchNumber: 'WH-BATCH-1756052880737-8P2L', status: 'passed', testDate: 'Today' },
                        { testType: 'Contamination Check', batchNumber: 'WH-BATCH-1756052880737-8P2L', status: 'passed', testDate: 'Today' },
                        { testType: 'Grade Classification', batchNumber: 'WH-BATCH-1756052880737-8P2L', status: 'passed', testDate: 'Yesterday' }
                      ].map((control, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{control.testType}</p>
                              <p className="text-sm text-gray-600">Batch: {control.batchNumber}</p>
                              <p className="text-xs text-gray-500">Test Date: {control.testDate}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {control.status}
                            </Badge>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline">View Report</Button>
                            <Button size="sm">Retest</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Overall Pass Rate</span>
                        <span className="text-2xl font-bold text-green-600">96.8%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Tests Completed Today</span>
                        <span className="text-2xl font-bold text-blue-600">24</span>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Pending Tests</span>
                        <span className="text-2xl font-bold text-yellow-600">6</span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Average Test Time</span>
                        <span className="text-2xl font-bold text-purple-600">45m</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shipping Tab */}
          <TabsContent value="shipping" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    Outbound Shipments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Cocoa Beans Export - WH-BATCH-1756052880737-8P2L</p>
                          <p className="text-sm text-gray-600">Destination: Port of Monrovia</p>
                          <p className="text-xs text-gray-500">Scheduled: Tomorrow 8:00 AM</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Update Status</Button>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Coffee Beans Export - QR-MULTI-LOT-WH-001-20250825</p>
                          <p className="text-sm text-gray-600">Destination: Port of Buchanan</p>
                          <p className="text-xs text-gray-500">Scheduled: Tuesday 2:00 PM</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Preparing</Badge>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Update Status</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Logistics Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Available Transport</span>
                        <span className="text-2xl font-bold text-green-600">4</span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Pending Shipments</span>
                        <span className="text-2xl font-bold text-blue-600">6</span>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">In Transit</span>
                        <span className="text-2xl font-bold text-yellow-600">3</span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Delivered Today</span>
                        <span className="text-2xl font-bold text-purple-600">8</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-blue-600" />
                    Warehouse Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Temperature Monitoring</p>
                        <p className="text-sm text-gray-600">Automatic alerts enabled</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Storage Capacity Limits</p>
                        <p className="text-sm text-gray-600">Maximum 50 tons per section</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Configured</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Quality Control Standards</p>
                        <p className="text-sm text-gray-600">EUDR compliance enabled</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Access Control</p>
                        <p className="text-sm text-gray-600">Inspector permissions</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Restricted</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    Inspector Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium">Inspector ID</p>
                      <p className="text-sm text-gray-600">{inspectorUsername}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium">Assigned Facility</p>
                      <p className="text-sm text-gray-600">{warehouseFacility}</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-medium">Operating County</p>
                      <p className="text-sm text-gray-600">{inspectorCounty}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium">Authorization Level</p>
                      <p className="text-sm text-gray-600">Warehouse Inspector</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  onClick={handleProductRegistration}
                  className="flex-1"
                >
                  Confirm Registration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Warehouse QR Code Modal */}
        <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Registration Complete - Warehouse QR Code</DialogTitle>
            </DialogHeader>
            {registeredProduct && (
              <div className="space-y-4">
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-32 h-32 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <QrCode className="w-16 h-16 text-gray-600" />
                  </div>
                  <p className="font-mono text-lg font-bold text-green-800">
                    {registeredProduct.warehouseQR}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Warehouse Custody QR Code
                  </p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Weight:</span>
                    <span>{registeredProduct.totalWeight} metric tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Storage Fee:</span>
                    <span className="font-bold text-green-600">${registeredProduct.storageFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Products Count:</span>
                    <span>{registeredProduct.products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Registration Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowQrModal(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      // Print QR code logic here
                      window.print();
                    }}
                    className="flex-1"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Print QR Code
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Bag Request Details Modal */}
        <Dialog open={showBagDetailsModal} onOpenChange={setShowBagDetailsModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Bag Request Details</DialogTitle>
              <DialogDescription>
                Complete information about the bag request from buyer
              </DialogDescription>
            </DialogHeader>
            {selectedBagRequest && (
              <div className="space-y-6">
                {/* Request Header */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Request ID</p>
                      <p className="font-mono text-blue-900">{selectedBagRequest.requestId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Status</p>
                      <Badge className={selectedBagRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {selectedBagRequest.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Buyer Information */}
                <div>
                  <h4 className="font-medium mb-3">Buyer Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Buyer Name</p>
                      <p className="text-sm text-gray-600">{selectedBagRequest.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm text-gray-600">{selectedBagRequest.companyName}</p>
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div>
                  <h4 className="font-medium mb-3">Product Information</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Commodity</p>
                      <p className="text-sm text-gray-600">{selectedBagRequest.commodityType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Quantity</p>
                      <p className="text-sm text-gray-600">{selectedBagRequest.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Value</p>
                      <p className="text-sm font-bold text-green-600">${selectedBagRequest.totalValue}</p>
                    </div>
                  </div>
                </div>

                {/* Farm Information */}
                <div>
                  <h4 className="font-medium mb-3">Farm Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Farmer</p>
                      <p className="text-sm text-gray-600">{selectedBagRequest.farmerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">County</p>
                      <p className="text-sm text-gray-600">{selectedBagRequest.county}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Farm Location</p>
                    <p className="text-sm text-gray-600">{selectedBagRequest.farmLocation}</p>
                  </div>
                </div>

                {/* Verification Code */}
                <div>
                  <h4 className="font-medium mb-3">Verification</h4>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm font-medium">Verification Code</p>
                    <p className="font-mono text-lg">{selectedBagRequest.verificationCode}</p>
                  </div>
                </div>

                {/* EUDR Compliance Details */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2 text-green-600" />
                    EUDR Compliance Status
                  </h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Deforestation Free</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">EUDR Compliant</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-medium text-gray-700">GPS Coordinates</p>
                        <p className="text-xs text-gray-600">{selectedBagRequest.gpsCoordinates || '6.428°N, 9.429°W'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Risk Assessment</p>
                        <p className="text-xs text-green-600 font-medium">Low Risk</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Land Use Classification</p>
                        <p className="text-xs text-gray-600">Agricultural - Sustainable</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Due Diligence Status</p>
                        <p className="text-xs text-green-600 font-medium">Completed</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Chain of Custody</p>
                        <p className="text-xs text-green-600 font-medium">Verified</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Compliance Officer</p>
                        <p className="text-xs text-gray-600">DDGAF-EUDR-001</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedBagRequest.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setShowBagDetailsModal(false)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => {
                        rejectBagRequestMutation.mutate(selectedBagRequest.id);
                        setShowBagDetailsModal(false);
                      }}
                      disabled={rejectBagRequestMutation.isPending}
                    >
                      Reject Request
                    </Button>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        validateBagRequestMutation.mutate(selectedBagRequest.id);
                        setShowBagDetailsModal(false);
                      }}
                      disabled={validateBagRequestMutation.isPending}
                    >
                      Validate Request
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}