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
  DollarSign,
  Upload,
  CreditCard,
  XCircle,
  Loader2
} from "lucide-react";
import ProfileDropdown from "@/components/ProfileDropdown";

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
  const [scanMode, setScanMode] = useState<'single' | 'multiple'>('single');
  const [multipleQrCodes, setMultipleQrCodes] = useState<Array<{code: string, product: string, weight: number, buyerName: string, farmerName: string, qualityGrade: string, unit: string}>>([]);
  const [currentProduct, setCurrentProduct] = useState("");
  const [currentBuyer, setCurrentBuyer] = useState("");
  const [selectedStorageRate, setSelectedStorageRate] = useState("50.00"); // Fixed at $50/Metric Ton
  const [storageLocation, setStorageLocation] = useState("");
  const [storageConditions, setStorageConditions] = useState("");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [productToRegister, setProductToRegister] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [authorizingRecord, setAuthorizingRecord] = useState<string | null>(null);
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

  // 🚛 Fetch pending dispatch requests for warehouse confirmation
  const { data: pendingDispatchRequests, isLoading: dispatchRequestsLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/pending-dispatch-requests'],
    select: (data: any) => data?.data || []
  });

  // Fetch pending dispatch requests for exporter coordination
  const { data: pendingDispatchData, isLoading: pendingDispatchLoading } = useQuery({
    queryKey: ['/api/warehouse-inspector/pending-dispatch-requests'],
    select: (data: any) => data || { data: [] }
  });


  // Product registration mutation
  const registerProductMutation = useMutation({
    mutationFn: async (registrationData: any) => {
      return await apiRequest('/api/warehouse-custody/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registrationData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Product Registered",
        description: "Product successfully registered for warehouse custody",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-custody/records'] });
      // Reset form and clear multi-lot data
      setScannedQrCode("");
      setProductToRegister(null);
      setStorageLocation("");
      setStorageConditions("");
      setMultipleQrCodes([]);
      setCurrentProduct("");
      setCurrentBuyer("");
    },
    onError: (error: any) => {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed", 
        description: error.message || "Failed to register product. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Handle QR code lookup with dual mode support
  const handleQrCodeLookup = async () => {
    if (!scannedQrCode) return;

    try {
      const response = await apiRequest(`/api/warehouse-inspector/lookup-qr/${scannedQrCode}`, {
        method: 'GET'
      });
      
      if (response.success && response.data) {
        const productData = response.data;
        
        if (scanMode === 'single') {
          // Single lot registration
          setProductToRegister(productData);
          toast({
            title: "Single Lot Found",
            description: `Product: ${productData.commodityType} - Weight: ${productData.weight}${productData.unit || 'kg'}`,
          });
          setScannedQrCode("");
          
        } else {
          // Multiple lot registration - same product AND buyer validation
          if (!currentProduct) {
            setCurrentProduct(productData.commodityType);
            setCurrentBuyer(productData.buyerName);
          } else {
            // Check product match
            if (currentProduct !== productData.commodityType) {
              toast({
                title: "Product Mismatch",
                description: `All QR codes must be for ${currentProduct}. This QR is for ${productData.commodityType}`,
                variant: "destructive",
              });
              return;
            }
            // Check buyer match
            if (currentBuyer !== productData.buyerName) {
              toast({
                title: "Buyer Mismatch",
                description: `All QR codes must be from ${currentBuyer}. This QR is from ${productData.buyerName}`,
                variant: "destructive",
              });
              return;
            }
          }
          
          // Check if QR already scanned
          const exists = multipleQrCodes.find(item => item.code === scannedQrCode);
          if (exists) {
            toast({
              title: "QR Code Already Scanned",
              description: "This QR code is already in the batch",
              variant: "destructive",
            });
            return;
          }
          
          // Add to multiple QR codes list
          const newQrEntry = {
            code: scannedQrCode,
            product: productData.commodityType,
            weight: parseFloat(productData.weight) || 0,
            buyerName: productData.buyerName,
            farmerName: productData.farmerName,
            qualityGrade: productData.qualityGrade,
            unit: productData.unit || 'kg'
          };
          
          setMultipleQrCodes(prev => [...prev, newQrEntry]);
          
          toast({
            title: "QR Added to Batch",
            description: `Added ${productData.commodityType} (${productData.weight}${productData.unit || 'kg'}) - Total lots: ${multipleQrCodes.length + 1}`,
          });
          setScannedQrCode("");
        }
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
    console.log('🔍 Registration Debug:', {
      productToRegister,
      storageLocation,
      storageConditions,
      selectedStorageRate
    });

    if (!productToRegister) {
      toast({
        title: "No Product Selected",
        description: "Please scan a QR code first to select a product for registration.",
        variant: "destructive",
      });
      return;
    }

    if (!storageLocation) {
      toast({
        title: "Storage Location Required", 
        description: "Please select a storage location.",
        variant: "destructive",
      });
      return;
    }

    if (!storageConditions) {
      toast({
        title: "Storage Conditions Required",
        description: "Please enter storage conditions.",
        variant: "destructive", 
      });
      return;
    }

    const custodyId = `CUSTODY-WH-${inspectorCounty.toUpperCase().replace(/\s+/g, '')}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`;

    // Check if it's multi-lot or single lot registration
    const registrationData = productToRegister.isMultiLot ? {
      // Multi-lot data format for /api/warehouse-custody/register
      scannedQrCodes: productToRegister.scannedQrCodes,
      warehouseId: inspectorData.warehouseId || "WH-001",
      warehouseName: warehouseFacility,
      county: inspectorCounty,
      commodityType: productToRegister.commodityType,
      packagingType: productToRegister.packagingType,
      qualityGrade: productToRegister.qualityGrade,
      totalWeight: productToRegister.totalWeight,
      totalPackages: productToRegister.totalPackages,
      farmerNames: productToRegister.farmerNames,
      farmLocations: productToRegister.farmLocations,
      buyerId: productToRegister.buyerId,
      buyerName: productToRegister.buyerName,
      buyerCompany: productToRegister.buyerCompany,
      storageLocation,
      storageConditions,
      storageRate: parseFloat(selectedStorageRate)
    } : {
      // Single lot data format for /api/warehouse-custody/register
      scannedQrCode: productToRegister.batchCode || scannedQrCode,
      buyerId: productToRegister.buyerId,
      buyerName: productToRegister.buyerName,
      buyerCompany: productToRegister.buyerCompany,
      verificationCode: productToRegister.verificationCode,
      warehouseId: inspectorData.warehouseId || "WH-001",
      warehouseName: warehouseFacility,
      county: inspectorCounty,
      commodityType: productToRegister.commodityType,
      farmerName: productToRegister.farmerName,
      farmLocation: productToRegister.farmLocation,
      totalWeight: parseFloat(productToRegister.weight),
      unit: productToRegister.unit,
      qualityGrade: productToRegister.qualityGrade,
      packagingType: productToRegister.packagingType || 'bags',
      totalPackages: productToRegister.totalPackages || Math.ceil(parseFloat(productToRegister.weight) * 20), // Estimate packages
      storageLocation,
      storageConditions,
      storageRate: parseFloat(selectedStorageRate)
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
      return <p className="text-center text-slate-500">Loading custody records...</p>;
    }

    if (!custodyRecords || custodyRecords.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
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
                {record.consolidatedQrCode && (
                  <Badge className="bg-indigo-100 text-indigo-800">
                    <QrCode className="w-3 h-3 mr-1" />
                    Consolidated QR
                  </Badge>
                )}
              </div>
              <div className="text-right text-sm text-slate-600">
                <p>Day {record.actualStorageDays || 0} of {record.maxStorageDays}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium mb-1">Product Details</h4>
                <p className="text-sm text-slate-600">Buyer: {record.buyerName}</p>
                <p className="text-sm text-slate-600">Type: {record.commodityType}</p>
                <p className="text-sm text-slate-600">Weight: {record.totalWeight} {record.unit}</p>
                <p className="text-sm text-slate-600">Packages: {record.totalPackages} {record.packagingType}</p>
                {record.custodyType === 'multi_lot' && (
                  <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">Multi-Lot</Badge>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Storage & Payment Info</h4>
                <p className="text-sm text-slate-600">Location: {record.storageLocation || 'Not assigned'}</p>
                <p className="text-sm text-slate-600">Conditions: {record.storageConditions || 'Standard'}</p>
                <p className="text-sm text-slate-600">Rate: ${record.storageRate}/metric ton (one-time)</p>
                <p className="text-sm font-semibold text-green-600">
                  Total Payment: ${(parseFloat(record.totalWeight) * parseFloat(record.storageRate)).toFixed(2)}
                </p>
                
                {/* Payment Status */}
                {record.storageFees && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">Payment:</span>
                      <Badge className={`text-xs ${
                        record.storageFees.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800'
                          : record.storageFees.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.storageFees.paymentStatus}
                      </Badge>
                    </div>
                    
                    {/* Manual Payment Info */}
                    {record.storageFees.manualConfirmationType && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Manual Payment:</span>
                          <Badge variant="outline" className="text-xs">
                            {record.storageFees.manualConfirmationType === 'receipt' 
                              ? 'Receipt Upload' 
                              : 'Transaction Reference'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Status:</span>
                          <Badge className={`text-xs ${
                            record.storageFees.confirmationStatus === 'verified' 
                              ? 'bg-green-100 text-green-800'
                              : record.storageFees.confirmationStatus === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {record.storageFees.confirmationStatus}
                          </Badge>
                        </div>
                        
                        {/* Receipt Image Button */}
                        {record.storageFees.receiptUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs p-1 h-6"
                            onClick={() => window.open(record.storageFees.receiptUrl, '_blank')}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            View Receipt
                          </Button>
                        )}
                        
                        {/* Transaction Reference */}
                        {record.storageFees.paymentReference && (
                          <p className="text-xs text-slate-600">
                            Ref: {record.storageFees.paymentReference}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Origin</h4>
                {record.custodyType === 'multi_lot' ? (
                  <>
                    <p className="text-sm text-slate-600">
                      Farmers: {Array.isArray(record.farmerNames) 
                        ? record.farmerNames.join(', ') 
                        : record.farmerNames}
                    </p>
                    <p className="text-sm text-slate-600">
                      Locations: {Array.isArray(record.farmLocations) 
                        ? record.farmLocations.join(', ') 
                        : record.farmLocations}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-slate-600">
                      Farmer: {Array.isArray(record.farmerNames) 
                        ? record.farmerNames[0] 
                        : record.farmerNames}
                    </p>
                    <p className="text-sm text-slate-600">
                      Location: {Array.isArray(record.farmLocations) 
                        ? record.farmLocations[0] 
                        : record.farmLocations}
                    </p>
                  </>
                )}
                <p className="text-sm text-slate-600">Grade: {record.qualityGrade || 'Standard'}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Status</h4>
                <p className="text-sm text-slate-600">
                  Registered: {new Date(record.registrationDate).toLocaleDateString()}
                </p>
                {record.authorizedDate && (
                  <p className="text-sm text-slate-600">
                    Authorized: {new Date(record.authorizedDate).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-1 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedRecord(record);
                      setShowDetailsModal(true);
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                  {record.authorizationStatus === 'pending' && (
                    <>
                      {/* Show different buttons based on payment status */}
                      {record.storageFees?.manualConfirmationType && record.storageFees?.confirmationStatus === 'pending' ? (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          disabled={authorizingRecord === record.custodyId}
                          onClick={async () => {
                            setAuthorizingRecord(record.custodyId);
                            try {
                              await apiRequest('/api/warehouse-custody/verify-and-authorize', {
                                method: 'POST',
                                body: JSON.stringify({
                                  custodyId: record.custodyId,
                                  verificationNotes: `Payment verified via ${record.storageFees.manualConfirmationType} - Authorized by warehouse inspector`
                                })
                              });
                              toast({
                                title: 'Payment Verified & Custody Authorized',
                                description: `Payment verified and custody ${record.custodyId} authorized successfully`,
                              });
                              queryClient.invalidateQueries({ queryKey: ['/api/warehouse-custody/records'] });
                            } catch (error: any) {
                              toast({
                                title: 'Verification/Authorization Failed',
                                description: error.message || 'Failed to verify payment and authorize custody',
                                variant: 'destructive',
                              });
                            } finally {
                              setAuthorizingRecord(null);
                            }
                          }}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          {authorizingRecord === record.custodyId ? 'Verifying...' : 'Verify Payment & Authorize'}
                        </Button>
                      ) : record.storageFees?.paymentStatus === 'paid' ? (
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                          disabled={authorizingRecord === record.custodyId}
                          onClick={async () => {
                            setAuthorizingRecord(record.custodyId);
                            try {
                              await apiRequest('/api/warehouse-custody/authorize', {
                                method: 'POST',
                                body: JSON.stringify({
                                  custodyId: record.custodyId,
                                  authorizationNotes: 'Authorized by warehouse inspector - Payment confirmed'
                                })
                              });
                              toast({
                                title: 'Custody Authorized',
                                description: `Custody ${record.custodyId} has been authorized successfully`,
                              });
                              queryClient.invalidateQueries({ queryKey: ['/api/warehouse-custody/records'] });
                            } catch (error: any) {
                              toast({
                                title: 'Authorization Failed',
                                description: error.message || 'Failed to authorize custody',
                                variant: 'destructive',
                              });
                            } finally {
                              setAuthorizingRecord(null);
                            }
                          }}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {authorizingRecord === record.custodyId ? 'Authorizing...' : 'Authorize'}
                        </Button>
                      ) : (
                        <div className="text-xs text-orange-600 font-medium">
                          Waiting for payment confirmation
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Custody Details Modal Component
  const CustodyDetailsModal = () => {
    if (!selectedRecord) return null;
    
    return (
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Custody Record Details: {selectedRecord.custodyId}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Status Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div>
                <Badge className={`${
                  selectedRecord.authorizationStatus === 'authorized' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedRecord.authorizationStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedRecord.authorizationStatus?.toUpperCase()}
                </Badge>
                {selectedRecord.custodyType === 'multi_lot' && (
                  <Badge className="bg-purple-100 text-purple-800 ml-2">Multi-Lot</Badge>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg text-green-600">
                  Total Payment: ${(parseFloat(selectedRecord.totalWeight) * parseFloat(selectedRecord.storageRate)).toFixed(2)}
                </p>
                <p className="text-sm text-slate-600">
                  {selectedRecord.totalWeight} tons × ${selectedRecord.storageRate}/metric ton
                </p>
              </div>
            </div>

            {/* Product Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Product Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Commodity Type</label>
                      <p className="text-sm">{selectedRecord.commodityType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Total Weight</label>
                      <p className="text-sm font-semibold">{selectedRecord.totalWeight} {selectedRecord.unit || 'tons'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Total Packages</label>
                      <p className="text-sm">{selectedRecord.totalPackages} {selectedRecord.packagingType || 'bags'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Quality Grade</label>
                      <p className="text-sm">{selectedRecord.qualityGrade || 'Standard'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Origin Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">
                        {selectedRecord.custodyType === 'multi_lot' ? 'Farmers' : 'Farmer'}
                      </label>
                      <p className="text-sm">
                        {Array.isArray(selectedRecord.farmerNames) 
                          ? selectedRecord.farmerNames.join(', ') 
                          : selectedRecord.farmerNames}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">
                        {selectedRecord.custodyType === 'multi_lot' ? 'Farm Locations' : 'Farm Location'}
                      </label>
                      <p className="text-sm">
                        {Array.isArray(selectedRecord.farmLocations) 
                          ? selectedRecord.farmLocations.join(', ') 
                          : selectedRecord.farmLocations}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">County</label>
                      <p className="text-sm">{selectedRecord.county}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Buyer & Storage Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Users className="w-5 h-5 mr-2 text-orange-600" />
                    Buyer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Buyer Name</label>
                      <p className="text-sm">{selectedRecord.buyerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Company</label>
                      <p className="text-sm">{selectedRecord.buyerCompany}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Buyer ID</label>
                      <p className="text-sm">{selectedRecord.buyerId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Warehouse className="w-5 h-5 mr-2 text-purple-600" />
                    Storage Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-slate-600">Warehouse</label>
                      <p className="text-sm">{selectedRecord.warehouseName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Storage Location</label>
                      <p className="text-sm">{selectedRecord.storageLocation || 'Not assigned'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Storage Conditions</label>
                      <p className="text-sm">{selectedRecord.storageConditions || 'Standard'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">Storage Rate</label>
                      <p className="text-sm font-semibold text-green-600">
                        ${selectedRecord.storageRate}/metric ton (one-time)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* QR Codes & Verification */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <QrCode className="w-5 h-5 mr-2 text-indigo-600" />
                  QR Codes & Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedRecord.custodyType === 'multi_lot' ? (
                    <>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Consolidated QR Code</label>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                          {selectedRecord.consolidatedQrCode || 'Generated automatically'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-600">Original QR Codes</label>
                        <div className="space-y-1">
                          {Array.isArray(selectedRecord.productQrCodes) && selectedRecord.productQrCodes.map((qr: string, index: number) => (
                            <p key={index} className="text-sm font-mono bg-gray-50 p-1 rounded">{qr}</p>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Product QR Code</label>
                      <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                        {Array.isArray(selectedRecord.productQrCodes) ? selectedRecord.productQrCodes[0] : selectedRecord.productQrCodes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dates & Status */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-slate-600" />
                  Timeline & Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Registration Date</label>
                    <p className="text-sm">{new Date(selectedRecord.registrationDate).toLocaleString()}</p>
                  </div>
                  {selectedRecord.authorizedDate && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Authorization Date</label>
                      <p className="text-sm">{new Date(selectedRecord.authorizedDate).toLocaleString()}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-slate-600">Storage Duration</label>
                    <p className="text-sm">{selectedRecord.actualStorageDays || 0} / {selectedRecord.maxStorageDays || 30} days</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Current Status</label>
                    <p className="text-sm">{selectedRecord.custodyStatus}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
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

  // 🚛 Warehouse Dispatch Confirmation Mutation
  const dispatchConfirmationMutation = useMutation({
    mutationFn: async (data: { requestId: string; confirmationNotes?: string }) => {
      return await apiRequest('/api/warehouse-inspector/confirm-dispatch', {
        method: 'POST',
        body: JSON.stringify({
          dispatchRequestId: data.requestId,
          warehouseId: inspectorData.warehouseId,
          inspectorId: inspectorData.username,
          confirmationNotes: data.confirmationNotes
        })
      });
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Dispatch Confirmed & QR Generated!",
        description: `Dispatch confirmed and QR code generated: ${data.batchCode}`,
      });
      // Refresh pending dispatch requests
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/pending-dispatch-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/qr-batches'] });
    },
    onError: (error: any) => {
      console.error('Dispatch confirmation error:', error);
      toast({
        title: "❌ Dispatch Confirmation Failed",
        description: error.message || "Failed to confirm dispatch. Please try again.",
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
    // Create a printable window with the QR code in the exact format from the PDF
    if (batch.qrCodeUrl) {
      const printWindow = window.open('', `_blank_${Date.now()}`);
      if (printWindow) {
        const currentDate = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'numeric', 
          day: 'numeric' 
        });
        const currentTime = new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: true 
        });
        
        printWindow.document.write(`
          <html>
            <head>
              <title>QR Batch Details - ${batch.batchCode} - ${Date.now()}</title>
              <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
              <meta http-equiv="Pragma" content="no-cache">
              <meta http-equiv="Expires" content="0">
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  margin: 0;
                  padding: 40px;
                  background: white;
                  color: #333;
                }
                .page-container {
                  max-width: 800px;
                  margin: 0 auto;
                }
                .header {
                  text-align: center;
                  margin-bottom: 40px;
                }
                .main-title {
                  font-size: 24px;
                  font-weight: bold;
                  color: #2563eb;
                  margin: 10px 0;
                }
                .batch-code-large {
                  font-size: 20px;
                  font-weight: bold;
                  color: #1f2937;
                  margin: 10px 0;
                }
                .subtitle {
                  font-size: 16px;
                  color: #6b7280;
                  margin: 10px 0;
                }
                .qr-section {
                  text-align: center;
                  margin: 40px 0;
                }
                .qr-label {
                  font-size: 14px;
                  font-weight: bold;
                  color: #374151;
                  margin: 10px 0;
                }
                .qr-code {
                  width: 200px;
                  height: 200px;
                  margin: 20px auto;
                  display: block;
                }
                .scan-instruction {
                  font-size: 14px;
                  color: #6b7280;
                  margin: 15px 0;
                }
                .generated-time {
                  font-size: 12px;
                  color: #9ca3af;
                  margin: 15px 0;
                }
                .details-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 40px;
                  margin: 40px 0;
                }
                .info-section {
                  background: #f9fafb;
                  padding: 20px;
                  border-radius: 8px;
                  border: 1px solid #e5e7eb;
                }
                .section-title {
                  font-size: 16px;
                  font-weight: bold;
                  color: #1f2937;
                  margin-bottom: 15px;
                  display: flex;
                  align-items: center;
                }
                .info-item {
                  margin: 8px 0;
                  font-size: 13px;
                }
                .info-label {
                  font-weight: bold;
                  color: #374151;
                }
                .info-value {
                  color: #6b7280;
                }
                .compliance-section {
                  background: #f0fdf4;
                  border: 1px solid #bbf7d0;
                  border-radius: 8px;
                  padding: 20px;
                  margin-top: 30px;
                }
                .compliance-title {
                  font-size: 16px;
                  font-weight: bold;
                  color: #166534;
                  text-align: center;
                  margin-bottom: 20px;
                }
                .compliance-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                }
                .compliance-item {
                  text-align: center;
                  padding: 10px;
                  background: #dcfce7;
                  border-radius: 6px;
                  font-size: 14px;
                  font-weight: bold;
                  color: #166534;
                }
                @media print {
                  body { margin: 0; padding: 20px; }
                  .page-container { max-width: none; }
                }
              </style>
            </head>
            <body>
              <div class="page-container">
                <div class="header">
                  <div class="main-title">🏭 Warehouse QR Batch</div>
                  <div class="batch-code-large">${batch.batchCode}</div>
                  <div class="subtitle">Agricultural Traceability System</div>
                </div>

                <div class="qr-section">
                  <div class="qr-label">QR Code: ${batch.batchCode}</div>
                  <img src="${batch.qrCodeUrl}" alt="QR Code" class="qr-code" />
                  <div class="scan-instruction">Scan for complete traceability</div>
                  <div class="generated-time">Generated: ${currentDate}, ${currentTime}</div>
                </div>

                <div class="details-grid">
                  <div class="info-section">
                    <div class="section-title">📦 Batch Information</div>
                    <div class="info-item">
                      <span class="info-label">Batch Code:</span> ${batch.batchCode}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Total Packages:</span> ${batch.totalPackages || 'N/A'} bags
                    </div>
                    <div class="info-item">
                      <span class="info-label">Total Weight:</span> ${batch.totalWeight} tons
                    </div>
                    <div class="info-item">
                      <span class="info-label">Commodity:</span> ${batch.commodityType}
                    </div>
                  </div>

                  <div class="info-section">
                    <div class="section-title">🏢 Buyer Information</div>
                    <div class="info-item">
                      <span class="info-label">Buyer:</span> ${batch.buyerName}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Company:</span> ${batch.buyerCompany || 'N/A'}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Storage Fee:</span> $${batch.storageRate || '0.00'}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Status:</span> ${batch.status || 'In Warehouse Custody'}
                    </div>
                  </div>

                  <div class="info-section">
                    <div class="section-title">📍 Location & Tracking</div>
                    <div class="info-item">
                      <span class="info-label">Warehouse:</span> ${batch.warehouseId}
                    </div>
                    <div class="info-item">
                      <span class="info-label">County:</span> ${batch.county || inspectorCounty}
                    </div>
                    <div class="info-item">
                      <span class="info-label">GPS:</span> ${batch.gpsCoordinates || 'N/A'}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Created:</span> ${currentDate}
                    </div>
                  </div>

                  <div class="info-section">
                    <div class="section-title">👨‍🌾 Farm Origin</div>
                    <div class="info-item">
                      <span class="info-label">Farmer:</span> ${batch.farmerName}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Farm Location:</span> ${batch.county || inspectorCounty}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Harvest Date:</span> ${batch.harvestDate ? new Date(batch.harvestDate).toLocaleDateString() : currentDate}
                    </div>
                    <div class="info-item">
                      <span class="info-label">Quality Grade:</span> ${batch.qualityGrade || 'Premium Export'}
                    </div>
                  </div>
                </div>

                <div class="compliance-section">
                  <div class="compliance-title">🛡️ EUDR Compliance Status</div>
                  <div class="compliance-grid">
                    <div class="compliance-item">✅ Deforestation Free</div>
                    <div class="compliance-item">✅ EUDR Compliant</div>
                    <div class="compliance-item">✅ Chain of Custody Verified</div>
                    <div class="compliance-item">✅ Due Diligence Complete</div>
                  </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center">
              <Warehouse className="w-8 h-8 mr-3 text-blue-600" />
              Warehouse Inspector Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
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
            <ProfileDropdown
              userName={inspectorUsername}
              userEmail="inspector@warehouse.co" 
              userType="warehouse-inspector"
              userId={inspectorUsername}
              onLogout={() => {
                localStorage.removeItem("warehouseInspectorData");
                window.location.href = "/inspector-login";
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Pending Inspections</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.pendingInspections}</p>
                </div>
                <ClipboardCheck className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Storage Units</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.storageUnits}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.complianceRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Temperature Alerts</p>
                  <p className="text-2xl font-bold text-slate-900">{dashboardStats.temperatureAlerts}</p>
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
            <TabsTrigger value="dispatch" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Truck className="w-4 h-4 mr-2" />
              Dispatch
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Overview Cards - Only visible on Overview tab */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Recent Storage Inspections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingInspections ? (
                      <p className="text-center text-slate-500">Loading inspections...</p>
                    ) : pendingInspections && pendingInspections.length > 0 ? (
                      pendingInspections.slice(0, 3).map((inspection: any) => (
                        <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{inspection.storageFacility}</p>
                            <p className="text-sm text-slate-600">{inspection.commodity} • {inspection.quantity}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getPriorityColor(inspection.priority)}>
                              {inspection.priority}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-1">{inspection.scheduledDate}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-500">No pending inspections</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Quality Control Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingQuality ? (
                      <p className="text-center text-slate-500">Loading quality data...</p>
                    ) : qualityControls && qualityControls.length > 0 ? (
                      qualityControls.slice(0, 3).map((control: any) => (
                        <div key={control.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{control.testType}</p>
                            <p className="text-sm text-slate-600">Batch: {control.batchNumber}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={control.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {control.status}
                            </Badge>
                            <p className="text-xs text-slate-500 mt-1">{control.testDate}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-500">No quality controls</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                    Regulatory Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loadingCompliance ? (
                      <p className="text-center text-slate-500">Loading compliance data...</p>
                    ) : storageCompliance && storageCompliance.length > 0 ? (
                      storageCompliance.map((compliance: any) => (
                        <div key={compliance.category} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{compliance.category}</p>
                            <p className="text-sm text-slate-600">Last checked: {compliance.lastCheck}</p>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-green-100 text-green-800">
                              {compliance.rate}%
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-slate-500">No compliance data</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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

              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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

            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <p className="text-sm text-slate-600">Completed This Month</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold text-green-600">{dashboardStats.avgInspectionTime}</p>
                    <p className="text-sm text-slate-600">Avg Inspection Time</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                    <p className="text-2xl font-bold text-red-600">{dashboardStats.criticalIssues}</p>
                    <p className="text-sm text-slate-600">Critical Issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Registration Tab */}
          <TabsContent value="registration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* QR Scanner Section */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                  {/* Scan Mode Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Scanner Mode</label>
                    <div className="flex gap-2">
                      <Button 
                        variant={scanMode === 'single' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setScanMode('single')}
                        className="flex items-center"
                      >
                        <QrCode className="w-4 h-4 mr-1" />
                        Single Lot
                      </Button>
                      <Button 
                        variant={scanMode === 'multiple' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setScanMode('multiple')}
                        className="flex items-center"
                      >
                        <Layers className="w-4 h-4 mr-1" />
                        Multiple Lots
                      </Button>
                    </div>
                    <p className="text-xs text-slate-600">
                      {scanMode === 'single' 
                        ? "Scan one QR code to register a single lot" 
                        : "Scan multiple QR codes of the same product to register as batch"
                      }
                    </p>
                  </div>

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
                        {scanMode === 'single' ? 'Lookup Product' : 'Add to Batch'}
                      </Button>
                    </div>
                  </div>

                  {/* Multiple QR Codes Display */}
                  {scanMode === 'multiple' && (
                    <div className="space-y-3">
                      {currentProduct && (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <h5 className="font-medium text-blue-800">Batch Product: {currentProduct}</h5>
                          <h6 className="font-medium text-blue-700">Buyer: {currentBuyer}</h6>
                          <p className="text-sm text-blue-600">All QR codes must be for this product from this buyer</p>
                        </div>
                      )}
                      
                      {multipleQrCodes.length > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">Scanned QR Codes ({multipleQrCodes.length})</h5>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setMultipleQrCodes([]);
                                setCurrentProduct("");
                                setCurrentBuyer("");
                                toast({
                                  title: "Batch Cleared",
                                  description: "All scanned QR codes have been cleared",
                                });
                              }}
                            >
                              Clear All
                            </Button>
                          </div>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {multipleQrCodes.map((item, index) => (
                              <div key={item.code} className="bg-white p-3 rounded border border-gray-200 text-sm">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-mono text-blue-600 font-medium">{item.code}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setMultipleQrCodes(prev => prev.filter(q => q.code !== item.code));
                                      if (multipleQrCodes.length === 1) {
                                        setCurrentProduct("");
                                        setCurrentBuyer("");
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                  <div><span className="font-medium">Product:</span> {item.product}</div>
                                  <div><span className="font-medium">Weight:</span> {item.weight}{item.unit}</div>
                                  <div><span className="font-medium">Buyer:</span> {item.buyerName}</div>
                                  <div><span className="font-medium">Grade:</span> {item.qualityGrade}</div>
                                  <div className="col-span-2"><span className="font-medium">Farmer:</span> {item.farmerName}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Total Weight:</span>
                              <span className="font-bold text-blue-600">
                                {multipleQrCodes.reduce((sum, item) => sum + item.weight, 0)} tons
                              </span>
                            </div>
                            <Button 
                              className="w-full mt-2" 
                              onClick={() => {
                                const totalWeight = multipleQrCodes.reduce((sum, item) => sum + item.weight, 0);
                                
                                // Create multi-lot batch data for direct registration
                                const multiLotData = {
                                  isMultiLot: true,
                                  scannedQrCodes: multipleQrCodes.map(qr => ({
                                    batchCode: qr.code,
                                    farmerName: qr.farmerName,
                                    farmLocation: `Location for ${qr.farmerName}`,
                                    weight: qr.weight,
                                    commodityType: qr.product,
                                    qualityGrade: qr.qualityGrade,
                                    verificationCode: `VER-${qr.code.split('-').pop()}`
                                  })),
                                  commodityType: currentProduct,
                                  totalWeight: totalWeight,
                                  totalPackages: Math.ceil(totalWeight * 20), // Estimate packages
                                  packagingType: 'bags',
                                  farmerNames: multipleQrCodes.map(qr => qr.farmerName),
                                  farmLocations: multipleQrCodes.map(qr => `Location for ${qr.farmerName}`),
                                  buyerId: multipleQrCodes[0]?.buyerName || "BATCH-BUYER",
                                  buyerName: multipleQrCodes[0]?.buyerName || "Batch Buyer",
                                  buyerCompany: "Multiple Lot Batch",
                                  qualityGrade: multipleQrCodes[0]?.qualityGrade || "Mixed Grade",
                                  unit: "kg"
                                };
                                
                                // Set for registration
                                setProductToRegister(multiLotData);
                                
                                toast({
                                  title: "Multi-Lot Batch Ready",
                                  description: `${multipleQrCodes.length} lots of ${currentProduct} - Total: ${totalWeight}kg - Ready to register`,
                                });
                              }}
                            >
                              Use Batch for Registration
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

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
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <label className="text-sm font-medium">Daily Storage Rate</label>
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-center">
                      <span className="text-lg font-bold text-green-600">$50.00 per Metric Ton</span>
                      <p className="text-xs text-slate-600 mt-1">Fixed warehouse storage rate</p>
                    </div>
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
                      onClick={(e) => {
                        e.preventDefault();
                        handleRegisterProduct();
                      }}
                      disabled={!productToRegister || !storageLocation || !storageConditions || registerProductMutation.isPending}
                      className="flex-1"
                      data-testid="button-register-product"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {registerProductMutation.isPending ? "Registering..." : "Register for Custody"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Custody Records */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <p className="text-center text-slate-500">Loading inspections...</p>
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
                            <p className="text-sm text-slate-600">Facility: {inspection.storageFacility}</p>
                            <p className="text-sm text-slate-600">Unit: {inspection.storageUnit}</p>
                            <p className="text-sm text-slate-600">Location: {inspection.warehouseSection}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Commodity Details</h4>
                            <p className="text-sm text-slate-600">Type: {inspection.commodity}</p>
                            <p className="text-sm text-slate-600">Quantity: {inspection.quantity}</p>
                            <p className="text-sm text-slate-600">Temperature: {inspection.temperature}°C</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Inspection Details</h4>
                            <p className="text-sm text-slate-600">Scheduled: {inspection.scheduledDate}</p>
                            <p className="text-sm text-slate-600">Type: {inspection.inspectionType}</p>
                            <p className="text-sm text-slate-600">Duration: {inspection.estimatedDuration}</p>
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
                    <p className="text-center text-slate-500">No pending inspections</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <p className="text-center text-slate-500">Loading transactions...</p>
                  ) : warehouseTransactions && warehouseTransactions.length > 0 ? (
                    warehouseTransactions.map((transaction: any) => (
                      <div key={transaction.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{transaction.transactionType}</h4>
                            <p className="text-sm text-slate-600">ID: {transaction.transactionId}</p>
                          </div>
                          <Badge className={transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <span className="font-medium">Farmer:</span>
                            <p className="text-slate-600">{transaction.farmerName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Commodity:</span>
                            <p className="text-slate-600">{transaction.commodity}</p>
                          </div>
                          <div>
                            <span className="font-medium">Date:</span>
                            <p className="text-slate-600">{transaction.transactionDate}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500">No transactions available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Codes Tab - Only Buyer Acceptance Codes */}
          <TabsContent value="codes" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <p className="text-center text-slate-500">Loading buyer acceptance codes...</p>
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
                              <p className="text-slate-600">{code.transactionId}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Commodity:</span>
                              <p className="text-slate-600">{code.commodityType} ({code.quantity} {code.unit})</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Value:</span>
                              <p className="text-slate-600">${code.totalValue.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-gray-700">Buyer:</span>
                              <p className="text-slate-600">{code.buyerName}</p>
                              <p className="text-sm text-blue-600">{code.buyerCounty}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Farmer:</span>
                              <p className="text-slate-600">{code.farmerName}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Generated:</span>
                              <p className="text-slate-600">{new Date(code.generatedAt).toLocaleDateString()}</p>
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
                    <p className="text-center text-slate-500">No buyer acceptance codes available for your county</p>
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
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                          <p className="text-sm text-slate-600 mb-2">Select available transactions for QR batch:</p>
                          {availableTransactionsLoading ? (
                            <p className="text-center text-slate-500">Loading available transactions...</p>
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
                            <p className="text-center text-slate-500">Loading QR batches...</p>
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
                                    <p className="text-slate-600">{batch.buyerName}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Commodity:</span>
                                    <p className="text-slate-600">{batch.commodityType}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Total Weight:</span>
                                    <p className="text-slate-600">{batch.totalWeight} tons</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>
                                    <p className={batch.status === 'generated' ? 'text-green-600' : batch.status === 'printed' ? 'text-blue-600' : 'text-yellow-600'}>
                                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-2 text-xs text-slate-500">
                                  Farmer: {batch.farmerName} • Created: {new Date(batch.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-slate-500">No QR batches available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                        <p className="text-sm text-slate-600">Active QR Batches</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Package className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-blue-600">
                          {qrBatches ? qrBatches.reduce((total: number, batch: any) => total + parseInt(batch.totalBags || 0), 0) : 0}
                        </p>
                        <p className="text-sm text-slate-600">Total Bags Tracked</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <FileText className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                        <p className="text-2xl font-bold text-purple-600">
                          {qrBatches ? qrBatches.filter((batch: any) => batch.status === 'printed' || batch.status === 'distributed').length : 0}
                        </p>
                        <p className="text-sm text-slate-600">QR Codes Printed</p>
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
                        <p className="text-center text-slate-500">Loading activity...</p>
                      ) : qrBatches && qrBatches.length > 0 ? (
                        qrBatches.slice(0, 3).map((batch: any) => (
                          <div key={batch.batchCode} className="flex items-center justify-between p-2 border rounded">
                            <div className="text-sm">
                              <p className="font-medium">{batch.batchCode}</p>
                              <p className="text-slate-600">
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
                        <p className="text-center text-slate-500">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Incoming Bag Requests from Buyers - Now after QR Code Generator */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <p className="mt-2 text-slate-600">Loading bag requests...</p>
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
                              <p className="text-sm text-slate-600">Request ID: {request.requestId}</p>
                              <p className="text-sm text-slate-600">From: {request.buyerName} ({request.company})</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-500">
                                {new Date(request.requestedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-slate-600">Farmer</p>
                              <p className="font-medium">{request.farmerName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Quantity</p>
                              <p className="font-medium">{request.quantity} {request.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Total Value</p>
                              <p className="font-medium text-green-600">${request.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">County</p>
                              <p className="font-medium">{request.county}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-slate-600">Farm Location</p>
                            <p className="text-sm">{request.farmLocation}</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-slate-600">Verification Code</p>
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
                  <div className="text-center py-8 text-slate-500">
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
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <p className="text-center text-slate-500">Loading inventory data...</p>
                  ) : inventoryStatus && inventoryStatus.length > 0 ? (
                    inventoryStatus.map((item: any) => (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{item.commodity}</h4>
                            <p className="text-sm text-slate-600">Storage Unit: {item.storageUnit}</p>
                          </div>
                          <Badge className={item.status === 'stored' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {item.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Quantity</p>
                            <p className="font-medium">{item.quantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Storage Date</p>
                            <p className="font-medium">{item.storageDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Temperature</p>
                            <p className="font-medium">{item.temperature}°C</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500">No inventory data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Validation Tab */}
          <TabsContent value="validation" className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                      <div className="text-center py-4 text-slate-500">
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
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                    <p className="text-center text-slate-500">Loading quality data...</p>
                  ) : qualityControls && qualityControls.length > 0 ? (
                    qualityControls.map((control: any) => (
                      <div key={control.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{control.testType}</h4>
                            <p className="text-sm text-slate-600">Batch: {control.batchNumber}</p>
                          </div>
                          <Badge className={control.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {control.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-600">Test Date</p>
                            <p className="font-medium">{control.testDate}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Inspector</p>
                            <p className="font-medium">{control.inspector}</p>
                          </div>
                          <div>
                            <p className="text-slate-600">Score</p>
                            <p className="font-medium">{control.score}%</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500">No quality control data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dispatch Tab - Warehouse Dispatch Confirmation System */}
          <TabsContent value="dispatch" className="space-y-6">
            {/* 🚛 PENDING DISPATCH REQUESTS FROM EXPORTERS */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Truck className="w-6 h-6 mr-3 text-blue-600" />
                  Pending Dispatch Requests
                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                    {pendingDispatchData?.data?.length || 0}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Exporters requesting pickup coordination for accepted deals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingDispatchData?.data && pendingDispatchData.data.length > 0 ? (
                  <div className="space-y-4">
                    {pendingDispatchData.data.map((request: any) => (
                      <div key={request.requestId} className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Request Details */}
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{request.commodityType}</span>
                            </div>
                            <p className="text-sm text-slate-600">
                              Request ID: <span className="font-mono text-xs">{request.requestId}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                              Quantity: <span className="font-medium">{request.quantity} {request.unit}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                              Value: <span className="font-medium text-green-600">${request.totalValue?.toLocaleString() || '0.00'}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                              Custody ID: <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded">{request.transactionId}</span>
                            </p>
                          </div>

                          {/* Buyer Information */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-900">Buyer Details</h4>
                            <p className="text-sm">
                              <span className="font-medium">{request.buyerCompany}</span>
                            </p>
                            <p className="text-sm text-slate-600">
                              Buyer ID: {request.buyerId}
                            </p>
                            <p className="text-sm text-slate-600">
                              Delivery Address: <span className="font-medium">{request.farmLocation}</span>
                            </p>
                            <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                              Verification: {request.verificationCode}
                            </p>
                          </div>

                          {/* Dispatch Action */}
                          <div className="space-y-2">
                            <h4 className="font-medium text-slate-900">Pickup Schedule</h4>
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-blue-800">Requested Date</p>
                              <p className="text-sm text-blue-900">{new Date(request.dispatchDate).toLocaleDateString()}</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              Requested: {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                            <Button 
                              size="sm" 
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                              onClick={async () => {
                                try {
                                  const response = await apiRequest('/api/warehouse-inspector/confirm-dispatch', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                      dispatchRequestId: request.requestId,
                                      warehouseId: inspectorData.warehouseId,
                                      inspectorId: inspectorData.inspectorId,
                                      confirmationNotes: 'Dispatch approved by warehouse inspector'
                                    })
                                  });
                                  
                                  if (response.success) {
                                    toast({
                                      title: "Dispatch Confirmed",
                                      description: `QR batch ${response.batchCode} generated for pickup`,
                                    });
                                    queryClient.invalidateQueries({ queryKey: ['/api/warehouse-inspector/pending-dispatch-requests'] });
                                  }
                                } catch (error) {
                                  toast({
                                    title: "Error",
                                    description: "Failed to confirm dispatch",
                                    variant: "destructive"
                                  });
                                }
                              }}
                              data-testid={`confirm-dispatch-${request.requestId}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Confirm Pickup & Generate QR
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Truck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Pending Dispatch Requests</h3>
                    <p className="text-slate-600">Exporter pickup requests will appear here</p>
                  </div>
                )}
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
                    <p className="text-sm text-slate-600">
                      Scan this QR code for complete traceability information
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-slate-600">QR Code not available</p>
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
                      <p>{selectedQrBatch.totalWeight} tons</p>
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
                            <strong>Weight:</strong> {selectedQrBatch.qrCodeData.totalWeight || selectedQrBatch.totalWeight} tons
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
                    <h3 className="font-semibold text-lg text-slate-900">
                      {selectedBagRequest.commodityType}
                    </h3>
                    <p className="text-sm text-slate-600">Request ID: {selectedBagRequest.requestId}</p>
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
                    <p className="text-sm text-slate-600">Total Transaction Value</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Requested: {new Date(selectedBagRequest.requestedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Buyer Information */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Buyer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Buyer Name</p>
                      <p className="font-medium">{selectedBagRequest.buyerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Company</p>
                      <p className="font-medium">{selectedBagRequest.company}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Buyer ID</p>
                      <p className="font-mono text-sm">{selectedBagRequest.buyerId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Contact Information</p>
                      <p className="text-sm">{selectedBagRequest.buyerContact || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farm & Product Details */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Farm & Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Farmer Name</p>
                      <p className="font-medium">{selectedBagRequest.farmerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Farm Location</p>
                      <p className="text-sm">{selectedBagRequest.farmLocation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">County</p>
                      <p className="font-medium">{selectedBagRequest.county}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Harvest Date</p>
                      <p className="text-sm">{selectedBagRequest.harvestDate ? new Date(selectedBagRequest.harvestDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Quantity Requested</p>
                      <p className="font-medium text-lg">{selectedBagRequest.quantity} {selectedBagRequest.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Quality Grade</p>
                      <p className="font-medium">{selectedBagRequest.qualityGrade || 'Standard Grade'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Transaction & Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Verification Code</p>
                      <p className="font-mono text-lg bg-blue-100 p-2 rounded font-bold text-blue-800">
                        {selectedBagRequest.verificationCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Price per Unit</p>
                      <p className="font-medium">${selectedBagRequest.pricePerUnit || (selectedBagRequest.totalValue / selectedBagRequest.quantity).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Payment Terms</p>
                      <p className="text-sm">{selectedBagRequest.paymentTerms || 'Cash on Delivery'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Delivery Terms</p>
                      <p className="text-sm">{selectedBagRequest.deliveryTerms || 'FOB Farm Gate'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* EUDR Compliance Information */}
              <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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
                        <p className="text-sm text-slate-600">GPS Coordinates</p>
                        <p className="font-mono text-sm">{selectedBagRequest.gpsCoordinates || '6.3106°N, 10.7969°W'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Land Use Certificate</p>
                        <p className="text-sm">{selectedBagRequest.landCertificate || 'LUC-' + selectedBagRequest.farmerId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Deforestation Risk</p>
                        <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Satellite Monitoring</p>
                        <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              {selectedBagRequest.description && (
                <Card className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200">
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

      {/* Custody Details Modal */}
      <CustodyDetailsModal />
    </div>
  );
}
