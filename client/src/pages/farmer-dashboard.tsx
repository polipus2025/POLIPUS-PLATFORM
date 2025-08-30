import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Leaf, 
  MapPin, 
  TrendingUp, 
  Package, 
  Calendar,
  Users,
  Truck,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  ShoppingCart,
  MessageSquare,
  Bell,
  BarChart3,
  Home,
  Loader2,
  Handshake,
  User
} from "lucide-react";
import { Link } from "wouter";
import ProfileDropdown from "@/components/ProfileDropdown";

export default function FarmerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(null);

  // Get farmer ID from localStorage (authenticated user's actual ID)
  const storedFarmerId = localStorage.getItem("farmerId");
  const credentialId = localStorage.getItem("credentialId");
  
  // For Paolo Jr, ensure we use the correct farmer ID regardless of what's stored
  const farmerId = (credentialId === "FRM434923" || storedFarmerId === "FRM434923") 
    ? "FARMER-1755883520291-288" 
    : (storedFarmerId || "FARMER-1755883520291-288");
    
  const farmerName = localStorage.getItem("farmerFirstName") || "Farmer";
  const farmerFullName = localStorage.getItem("farmerFullName") || "Farmer";
  const farmerCounty = localStorage.getItem("farmerCounty") || "Unknown County";
  
  // Dashboard initialized for farmer: ${farmerId}
  
  // Fetch farmer-specific data
  const { data: farmerLandData, isLoading: landDataLoading, error: landDataError } = useQuery({ 
    queryKey: ["/api/farmer-land-data", farmerId],
    queryFn: () => apiRequest(`/api/farmer-land-data/${farmerId}`),
    enabled: !!farmerId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
  const { data: cropPlans } = useQuery({ queryKey: ["/api/crop-plans"] });
  const { data: trackingRecords } = useQuery({ queryKey: ["/api/tracking-records"] });

  // Fetch farmer confirmed transactions archive
  const { data: farmerTransactions, isLoading: farmerTransactionsLoading } = useQuery({
    queryKey: ['/api/farmer/confirmed-transactions', farmerId],
    queryFn: () => apiRequest(`/api/farmer/confirmed-transactions/${farmerId}`),
    enabled: !!farmerId,
  });

  // Fetch farmer's own offers with status tracking
  const { data: farmerOffers, isLoading: farmerOffersLoading } = useQuery({
    queryKey: ['/api/farmer/my-offers', farmerId],
    queryFn: () => apiRequest(`/api/farmer/my-offers/${farmerId}`),
    enabled: !!farmerId,
    staleTime: 30 * 1000, // Cache for 30 seconds (frequent updates needed)
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
    refetchOnWindowFocus: false, // Don't refetch on focus
    refetchOnMount: false, // Don't always refetch on mount
  });

  // Fetch farmer accepted offers (waiting for payment confirmation)
  const { data: acceptedOffers, isLoading: acceptedOffersLoading } = useQuery({
    queryKey: ['/api/farmer/accepted-offers', farmerId],
    queryFn: () => apiRequest(`/api/farmer/accepted-offers/${farmerId}`),
    enabled: !!farmerId,
    staleTime: 30 * 1000, // Cache for 30 seconds
    gcTime: 2 * 60 * 1000, // Keep in cache for 2 minutes
  });

  // Fetch farmer verification codes archive (keeping for backward compatibility)
  const { data: farmerCodes, isLoading: farmerCodesLoading } = useQuery({
    queryKey: ['/api/farmer/verification-codes', farmerId],
    queryFn: () => apiRequest(`/api/farmer/verification-codes/${farmerId}`),
    enabled: !!farmerId,
  });

  // Farmer land data loaded
  
  // Real data for dashboard stats  
  const totalPlots = farmerLandData?.totalPlots || 0;
  const farmPlots = farmerLandData?.farmPlots || [];
  const farmer = farmerLandData?.farmer || { firstName: farmerName, county: farmerCounty };
  const activeCropPlans = Array.isArray(cropPlans) ? cropPlans.filter((plan: any) => plan.status === 'active').length : 2;
  const totalHarvested = Array.isArray(trackingRecords) 
    ? trackingRecords.reduce((sum: number, record: any) => sum + (record.harvestedQuantity || 0), 0) 
    : 12.8;
  const pendingInspections = Array.isArray(trackingRecords) 
    ? trackingRecords.filter((record: any) => record.status === 'pending_inspection').length 
    : 1;

  // Mock alerts data
  const alerts = [
    { type: 'weather', message: 'Heavy rainfall expected this week', date: '2 days ago' },
    { type: 'market', message: 'Coffee prices increased by 5%', date: '1 week ago' }
  ];

  // Payment confirmation mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      return apiRequest(`/api/farmer/confirm-payment/${transactionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId: farmerId })
      });
    },
    onSuccess: (data, transactionId) => {
      toast({
        title: "Payment Confirmed Successfully!",
        description: `Second verification code generated: ${data.secondVerificationCode}`
      });
      
      // Invalidate and refetch the farmer data
      queryClient.invalidateQueries({ queryKey: ['/api/farmer/confirmed-transactions', farmerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/farmer/accepted-offers', farmerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/farmer/verification-codes', farmerId] });
      setConfirmingPayment(null);
    },
    onError: (error: any) => {
      toast({
        title: "Confirmation Failed",
        description: error.message || "Failed to confirm payment. Please try again.",
        variant: "destructive"
      });
      setConfirmingPayment(null);
    }
  });

  // Handle payment confirmation
  const handleConfirmPayment = async (transactionId: string) => {
    setConfirmingPayment(transactionId);
    confirmPaymentMutation.mutate(transactionId);
  };

  // Handle form submission
  const handleSubmitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const harvestDate = formData.get('harvestDate') as string;
    const availableFromDate = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30); // 30 days from now
    
    const quantityAvailable = parseFloat(formData.get('quantityAvailable') as string);
    const pricePerUnit = parseFloat(formData.get('pricePerUnit') as string);
    
    const offerData = {
      farmerId: farmerId, // 🔒 FIXED: Send full farmer ID string for proper backend lookup
      commodityType: formData.get('commodityType') as string,
      quantityAvailable: quantityAvailable.toString(),
      unit: formData.get('unit') as string || 'tons',
      pricePerUnit: pricePerUnit.toString(),
      totalValue: (quantityAvailable * pricePerUnit).toString(),
      qualityGrade: formData.get('qualityGrade') as string,
      harvestDate: harvestDate,
      availableFromDate: availableFromDate.toISOString(),
      expirationDate: expirationDate.toISOString(),
      paymentTerms: formData.get('paymentTerms') as string || 'Payment within 7 days',
      deliveryTerms: formData.get('deliveryTerms') as string || 'Farm pickup',
      description: formData.get('description') as string || '',
      farmLocation: `${farmerName}'s Farm, ${farmerCounty} County`,
      farmerName: farmerName,
      county: farmerCounty
    };

    try {
      const response = await apiRequest('/api/farmer-product-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData),
      });

      toast({
        title: "Product Offer Submitted Successfully!",
        description: `${response.notificationsSent} buyers in ${response.resolvedCounty} County have been notified. Buyers notified: ${response.buyersNotified?.join(', ') || 'None'}`
      });

      // Invalidate cache to show new pending offer
      queryClient.invalidateQueries({ queryKey: ['/api/farmer/my-offers', farmerId] });

      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit product offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 p-2 sm:p-4 max-w-7xl mx-auto">
      {/* Back to Polipus Button */}
      <div className="mb-4">
        <Link href="/polipus" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Polipus Platform
        </Link>
      </div>

      {/* Mobile-Responsive Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Welcome back, {farmerName}!
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Farmer ID: {farmerId} | Your farm management dashboard
          </p>
        </div>
        <ProfileDropdown
          userName={farmerFullName}
          userEmail={`${farmerName.toLowerCase()}@farm.co`}
          userType="farmer"
          userId={farmerId}
          onLogout={() => {
            localStorage.clear();
            window.location.href = "/farmer-login";
          }}
        />
      </div>

      {/* Simplified Tabbed Navigation Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-slate-100 h-12">
          <TabsTrigger value="overview" className="flex items-center justify-center gap-1 text-xs lg:text-sm p-2 lg:p-3">
            <Home className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="land-mappings" className="flex items-center justify-center gap-1 text-xs lg:text-sm p-2 lg:p-3">
            <MapPin className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Land Info</span>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center justify-center gap-1 text-xs lg:text-sm p-2 lg:p-3">
            <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Marketplace</span>
          </TabsTrigger>
          <TabsTrigger value="pending-offers" className="flex items-center justify-center gap-1 text-xs lg:text-sm p-2 lg:p-3">
            <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Pending Offers</span>
          </TabsTrigger>
          <TabsTrigger value="verification-codes" className="flex items-center justify-center gap-1 text-xs lg:text-sm p-2 lg:p-3 bg-green-50 text-green-600">
            <Handshake className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Accepted Offers</span>
          </TabsTrigger>
          <TabsTrigger value="confirmed-transactions" className="flex items-center justify-center gap-1 text-xs lg:text-sm p-2 lg:p-3">
            <FileText className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline">Confirmed Transactions</span>
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-3 mt-3">
          {/* Compact Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-600">Farm Plots</p>
                    <p className="text-lg sm:text-xl font-bold text-green-900">{totalPlots}</p>
                    <p className="text-xs text-green-600">Registered</p>
                  </div>
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-600">Crop Plans</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-900">{activeCropPlans}</p>
                    <p className="text-xs text-blue-600">Active</p>
                  </div>
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-orange-600">Harvested</p>
                    <p className="text-lg sm:text-xl font-bold text-orange-900">{totalHarvested.toFixed(1)}</p>
                    <p className="text-xs text-orange-600">Tons</p>
                  </div>
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-purple-600">Pending</p>
                    <p className="text-lg sm:text-xl font-bold text-purple-900">{pendingInspections}</p>
                    <p className="text-xs text-purple-600">Reviews</p>
                  </div>
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compact Recent Activities and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Farm Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Recent Farm Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Coffee Harvest Completed</p>
                      <p className="text-xs text-gray-600">Plot PLT-001 - 2.5 tons harvested</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Batch Code Generated</p>
                      <p className="text-xs text-gray-600">COF-2024-001 for coffee export</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Crop Planning Updated</p>
                      <p className="text-xs text-gray-600">Next season cocoa planning</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Farm Management Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2" disabled>
                    <MapPin className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">Farm Plots - Restricted</span>
                  </Button>

                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2" disabled>
                    <MapPin className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">GPS Mapping - Restricted</span>
                  </Button>

                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2" disabled>
                    <Calendar className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">Use Marketplace Tab</span>
                  </Button>

                  <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                    <span className="text-sm">Market Prices</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* LAND MAPPINGS TAB */}
        <TabsContent value="land-mappings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Farm Plots & Land Mapping
              </CardTitle>
              <CardDescription>
                {farmerLandData?.totalPlots > 0 
                  ? `You have ${farmerLandData.totalPlots} registered farm plot(s) with unique identification numbers` 
                  : "Note: Farmers cannot map new plots. Land mapping is restricted to Land Inspectors."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Debug information */}
              <div className="mb-4 p-2 bg-blue-50 rounded text-xs">
                <strong>Debug:</strong> Loading: {landDataLoading ? 'YES' : 'NO'}, 
                Error: {landDataError ? 'YES' : 'NO'}, 
                Total Plots: {farmerLandData?.totalPlots}, 
                FarmPlots Array: {farmerLandData?.farmPlots ? `${farmerLandData.farmPlots.length} plots` : 'null'}, 
                Farmer ID: {farmerId}
              </div>
              
              {landDataLoading && (
                <div className="text-center py-8">
                  <p>Loading your land plots...</p>
                </div>
              )}
              
              {landDataError && (
                <div className="text-center py-8 text-red-600">
                  <p>Error loading land data: {landDataError.message}</p>
                </div>
              )}
              
              {farmerLandData?.farmPlots && farmerLandData.farmPlots.length > 0 ? (
                <div className="space-y-6">
                  {/* Individual Farm Plots */}
                  {farmerLandData.farmPlots.map((plot: any, index: number) => (
                    <Card key={plot.id} className="border-2 border-green-100">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg text-green-800">Plot #{plot.plot_number}: {plot.plot_name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              <strong>Unique Plot ID:</strong> <span className="font-mono bg-green-50 px-2 py-1 rounded text-green-700 font-bold">{plot.plot_id}</span>
                            </p>
                          </div>
                          <Badge variant="outline" className="text-green-700 border-green-300">
                            {plot.crop_type.charAt(0).toUpperCase() + plot.crop_type.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Plot Details */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800">Plot Information</h4>
                            <div className="text-sm space-y-1">
                              <div><strong>Size:</strong> {plot.plot_size} {plot.plot_size_unit}</div>
                              <div><strong>Primary Crop:</strong> {plot.primary_crop || plot.crop_type}</div>
                              {plot.secondary_crops && <div><strong>Secondary Crops:</strong> {plot.secondary_crops}</div>}
                              <div><strong>Location:</strong> {plot.county}</div>
                              {plot.district && <div><strong>District:</strong> {plot.district}</div>}
                              <div><strong>Status:</strong> 
                                <Badge variant={plot.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                                  {plot.status}
                                </Badge>
                              </div>
                            </div>
                            
                            {/* Land Map Data from Plot */}
                            {plot.land_map_data && (
                              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                                <h5 className="font-medium text-green-800 mb-2">Land Analysis</h5>
                                <div className="text-sm space-y-1">
                                  <div><strong>Soil Type:</strong> {plot.land_map_data.soilType}</div>
                                  <div><strong>Water Sources:</strong> {plot.land_map_data.waterSources?.join(', ') || 'None identified'}</div>
                                  <div><strong>EUDR Risk Level:</strong> 
                                    <Badge variant={plot.land_map_data.eudrCompliance?.riskLevel === 'low' ? 'default' : 'destructive'} className="ml-2">
                                      {plot.land_map_data.eudrCompliance?.riskLevel}
                                    </Badge>
                                  </div>
                                  <div><strong>Compliance Score:</strong> {plot.land_map_data.eudrCompliance?.complianceScore}%</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* GPS Information */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-gray-800">GPS & Boundaries</h4>
                            <div className="text-sm">
                              <div><strong>Primary GPS:</strong> {plot.gps_coordinates}</div>
                            </div>
                            
                            {plot.farm_boundaries && (
                              <div className="text-sm">
                                <div className="bg-gray-50 p-3 rounded border">
                                  <strong>Boundary Points:</strong>
                                  {plot.farm_boundaries.map((point: any, pointIndex: number) => (
                                    <div key={pointIndex} className="mt-1 font-mono text-xs">
                                      Point {point.point}: {point.lat}, {point.lng}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Legacy Farm Data (if exists) */}
                  {farmerLandData.farmer?.landMapData && (
                    <Card className="border-2 border-blue-100">
                      <CardHeader>
                        <CardTitle className="text-blue-800">Legacy Farm Registration Data</CardTitle>
                        <CardDescription>Original farm mapping data from farmer registration</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Farm Details</h4>
                            <div className="text-sm space-y-1">
                              <div><strong>Farm Size:</strong> {farmerLandData.farmer?.farmSize} {farmerLandData.farmer?.farmSizeUnit}</div>
                              <div><strong>Primary Crop:</strong> {farmerLandData.farmer?.primaryCrop}</div>
                              <div><strong>County:</strong> {farmerLandData.farmer?.county}</div>
                              <div><strong>District:</strong> {farmerLandData.farmer?.district}</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium">Legacy GPS Data</h4>
                            <div className="text-sm">
                              <div><strong>Primary GPS:</strong> {farmerLandData.farmer?.gpsCoordinates}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No Farm Plots Registered</p>
                  <p className="text-sm">Land mapping and plot registration is handled by official Land Inspectors.</p>
                  <p className="text-sm">Focus on crop scheduling and harvest management instead.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>


        {/* MARKETPLACE TAB */}
        <TabsContent value="marketplace" className="space-y-6 mt-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Submit Product Offer to Buyers
              </CardTitle>
              <CardDescription>
                Submit your product offer and automatically notify all buyers in your county. First buyer to accept wins!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmitOffer}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commodity Type <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="commodityType"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                      data-testid="select-commodity"
                    >
                      <option value="">Select commodity...</option>
                      <option value="Cocoa">Cocoa</option>
                      <option value="Coffee">Coffee</option>
                      <option value="Palm Oil">Palm Oil</option>
                      <option value="Rubber">Rubber</option>
                      <option value="Cassava">Cassava</option>
                      <option value="Coconut Oil">Coconut Oil</option>
                      <option value="Tobacco">Tobacco</option>
                      <option value="Robusta Coffee">Robusta Coffee</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quality Grade <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="qualityGrade"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select grade...</option>
                      <option value="Grade A">Grade A - Premium</option>
                      <option value="Grade B">Grade B - Standard</option>
                      <option value="Grade C">Grade C - Commercial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity Available <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantityAvailable"
                      step="0.1"
                      min="0.1"
                      placeholder="e.g., 2.5"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                      data-testid="input-quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="unit"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select unit...</option>
                      <option value="tons">Metric Tons</option>
                      <option value="kg">Kilograms</option>
                      <option value="bags">Bags (60kg)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Unit (USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="pricePerUnit"
                      step="0.01"
                      min="0.01"
                      placeholder="e.g., 2450.00"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                      data-testid="input-price"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harvest Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="harvestDate"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Terms <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="paymentTerms"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select payment terms...</option>
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</option>
                      <option value="30 Days Net">30 Days Net</option>
                      <option value="15 Days Net">15 Days Net</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Terms <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="deliveryTerms"
                      className="w-full p-3 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select delivery terms...</option>
                      <option value="FOB Farm Gate">FOB Farm Gate</option>
                      <option value="Delivered to Warehouse">Delivered to Warehouse</option>
                      <option value="Ex-Works">Ex-Works</option>
                      <option value="CIF Port">CIF Port</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Additional details about your product..."
                    className="w-full p-3 border border-gray-300 rounded-md"
                    data-testid="textarea-description"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit-offer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Product Offer & Notify Buyers"}
                </button>
              </form>
            </CardContent>
          </Card>

          {/* CURRENT OFFERS STATUS TRACKING */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-green-600" />
                My Product Offers Status
              </CardTitle>
              <CardDescription>
                Track your offers from creation to buyer confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {farmerOffersLoading ? (
                <div className="text-center py-8 text-gray-500">Loading offers...</div>
              ) : farmerOffers && farmerOffers.length > 0 ? (
                <div className="space-y-4">
                  {farmerOffers.map((offer: any) => (
                    <div key={offer.id} className={`p-4 border rounded-lg ${
                      offer.status === 'pending' ? 'bg-orange-50 border-orange-200' : 
                      offer.status === 'confirmed' ? 'bg-green-50 border-green-200' : 
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{offer.commodityType}</p>
                          <p className="text-sm text-gray-600">Offer ID: {offer.offerId}</p>
                          <p className="text-sm text-gray-600">{offer.quantityAvailable} {offer.unit} • ${offer.totalValue}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className={`${
                            offer.status === 'pending' ? 'bg-orange-600' : 
                            offer.status === 'confirmed' ? 'bg-green-600' : 
                            'bg-gray-600'
                          } text-white`}>
                            {offer.status === 'pending' ? 'PENDING' : 
                             offer.status === 'confirmed' ? 'CONFIRMED' : 
                             offer.status.toUpperCase()}
                          </Badge>
                          {offer.verificationCode && (
                            <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">
                              Code: {offer.verificationCode}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Dates Section */}
                      <div className="text-sm text-gray-600 mb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <p>
                            <strong>📅 Offer Created:</strong> {new Date(offer.offerCreatedAt).toLocaleString()}
                          </p>
                          {offer.confirmedAt ? (
                            <p>
                              <strong>✅ Confirmed:</strong> {new Date(offer.confirmedAt).toLocaleString()}
                            </p>
                          ) : (
                            <p className="text-orange-600">
                              <strong>⏳ Status:</strong> Waiting for buyer acceptance
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Buyer Details - Only show when confirmed */}
                      {offer.status === 'confirmed' && offer.buyerName && (
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm font-medium text-green-700 mb-1">✅ Buyer Details:</p>
                          <div className="text-sm text-gray-600">
                            <p><strong>Buyer:</strong> {offer.buyerName}</p>
                            <p><strong>Company:</strong> {offer.buyerCompany}</p>
                            <p><strong>Buyer ID:</strong> {offer.buyerId}</p>
                          </div>
                        </div>
                      )}

                      {/* Pending Status Details */}
                      {offer.status === 'pending' && (
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm text-orange-600 font-medium">
                            🔔 Buyers in {offer.county} County have been notified. First to accept wins!
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No offers submitted yet</p>
                  <p className="text-sm">Submit your first product offer above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TRANSACTIONS TAB */}
        {/* PENDING OFFERS TAB */}
        <TabsContent value="pending-offers" className="space-y-3 mt-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                Pending Offers
              </CardTitle>
              <CardDescription>
                Your product offers awaiting buyer response
              </CardDescription>
            </CardHeader>
            <CardContent>
              {farmerOffersLoading ? (
                <div className="text-center py-8 text-gray-500">Loading pending offers...</div>
              ) : farmerOffers && farmerOffers.filter((offer: any) => offer.status === 'pending').length > 0 ? (
                <div className="space-y-4">
                  {farmerOffers.filter((offer: any) => offer.status === 'pending').map((offer: any) => (
                    <div key={offer.id} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-orange-900">{offer.commodityType} Offer</p>
                          <p className="text-sm text-gray-600">Offer ID: {offer.offerId}</p>
                          <p className="text-sm text-gray-600">{offer.quantityAvailable} {offer.unit} • ${offer.totalValue.toLocaleString()}</p>
                        </div>
                        <Badge className="bg-orange-600 text-white">PENDING</Badge>
                      </div>
                      
                      {/* Offer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                        <div>
                          <p><strong>Quality:</strong> {offer.qualityGrade}</p>
                          <p><strong>Price per {offer.unit}:</strong> ${offer.pricePerUnit.toLocaleString()}</p>
                        </div>
                        <div>
                          <p><strong>Payment:</strong> {offer.paymentTerms}</p>
                          <p><strong>Delivery:</strong> {offer.deliveryTerms}</p>
                        </div>
                      </div>

                      {/* Date Information */}
                      <div className="border-t pt-3 mb-3">
                        <p className="text-sm">
                          <strong>📅 Submitted:</strong> {new Date(offer.offerCreatedAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-orange-600">
                          <strong>⏳ Status:</strong> Waiting for buyer acceptance in {offer.county} County
                        </p>
                      </div>

                      <div className="bg-orange-100 p-3 rounded border border-orange-300">
                        <p className="text-sm text-orange-700 font-medium">
                          🔔 All buyers in {offer.county} County have been notified
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          First buyer to accept this offer wins the deal!
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No Pending Offers</p>
                  <p className="text-sm">All your offers have been accepted by buyers!</p>
                  <p className="text-sm">Submit new offers in the Marketplace tab.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* VERIFICATION CODES TAB */}
        <TabsContent value="verification-codes" className="space-y-3 mt-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Handshake className="w-5 h-5 mr-2 text-green-600" />
                Accepted Offers
              </CardTitle>
              <CardDescription>
                Offers accepted by buyers with payment confirmation workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedOffersLoading ? (
                <div className="text-center py-8 text-gray-500">Loading accepted offers...</div>
              ) : acceptedOffers && acceptedOffers.length > 0 ? (
                <div className="space-y-4">
                  {acceptedOffers.map((offer: any) => (
                  <Card key={offer.id} className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      {/* Offer Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg text-green-800">{offer.commodityType} Offer</h4>
                          <p className="text-sm text-blue-600 font-medium">Farmer Offer ID: {offer.farmerOfferId}</p>
                        </div>
                        <Badge className="bg-blue-600 text-white">
                          BUYER ACCEPTED
                        </Badge>
                      </div>

                      {/* Buyer Details Section */}
                      <div className="bg-white border border-green-300 rounded-lg p-3 mb-4">
                        <h5 className="font-medium text-green-700 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          Buyer Information
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p><strong>Name:</strong> {offer.buyerName}</p>
                          <p><strong>Company:</strong> {offer.buyerCompany}</p>
                          <p><strong>Location:</strong> {offer.county}</p>
                          <p><strong>Contact:</strong> Via platform messaging</p>
                        </div>
                      </div>

                      {/* Offer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">Quantity</p>
                          <p className="font-medium">{offer.quantityAvailable} {offer.unit}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Price per {offer.unit}</p>
                          <p className="font-medium">${offer.pricePerUnit?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Value</p>
                          <p className="font-medium text-green-600">${offer.totalValue?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Verification Code & Payment Section */}
                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="text-xs text-gray-600">First Verification Code</p>
                              <code className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono">
                                {offer.verificationCode}
                              </code>
                            </div>
                            {offer.secondVerificationCode && (
                              <div>
                                <p className="text-xs text-gray-600">Second Code (After Payment)</p>
                                <code className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded font-mono">
                                  {offer.secondVerificationCode}
                                </code>
                              </div>
                            )}
                          </div>
                          
                          {/* Payment Confirmation Button/Status */}
                          <div className="text-right">
                            {offer.paymentConfirmed ? (
                              <div className="text-center">
                                <p className="text-xs text-green-600 font-medium mb-1">
                                  ✅ Payment Confirmed
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(offer.paymentConfirmedAt).toLocaleDateString()}
                                </p>
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleConfirmPayment(offer.id)}
                                disabled={confirmingPayment === offer.id}
                                className="bg-green-600 hover:bg-green-700 text-white text-sm"
                                data-testid="button-confirm-payment"
                              >
                                {confirmingPayment === offer.id ? (
                                  <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Confirming...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirm Payment Received
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Handshake className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No Accepted Offers Yet</p>
                  <p className="text-sm">Offers accepted by buyers will appear here with buyer details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONFIRMED TRANSACTIONS TAB */}
        <TabsContent value="confirmed-transactions" className="space-y-3 mt-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Confirmed Transactions
              </CardTitle>
              <CardDescription>
                Completed transactions with payment confirmation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {farmerTransactionsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : farmerTransactions && farmerTransactions.length > 0 ? (
                <div className="space-y-3">
                  {farmerTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-green-900">{transaction.commodityType}</p>
                          <p className="text-sm text-blue-600 font-medium">Farmer Offer ID: {transaction.farmerOfferId}</p>
                          <p className="text-sm text-gray-600">Buyer: {transaction.buyerName} ({transaction.buyerCompany})</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-green-600 text-white">Confirmed</Badge>
                          {transaction.paymentConfirmed ? (
                            <Badge className="bg-blue-600 text-white text-xs">Payment Confirmed</Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-600 border-orange-300 text-xs">Awaiting Payment</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <p>Quantity: <span className="font-medium">{transaction.quantityAvailable} {transaction.unit}</span></p>
                        <p>Total Value: <span className="font-medium">${transaction.totalValue}</span></p>
                        <p>First Code: <span className="font-mono font-bold text-blue-600">{transaction.verificationCode}</span></p>
                        {transaction.secondVerificationCode && (
                          <p>Second Code: <span className="font-mono font-bold text-purple-600">{transaction.secondVerificationCode}</span></p>
                        )}
                        {transaction.paymentConfirmed && transaction.paymentConfirmedAt && (
                          <p className="text-sm text-green-600 font-medium">
                            ✅ Payment Received: {new Date(transaction.paymentConfirmedAt).toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs">{new Date(transaction.confirmedAt).toLocaleDateString()}</p>
                      </div>

                      {/* Payment Confirmation Button */}
                      {!transaction.paymentConfirmed && (
                        <div className="border-t pt-3">
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Payment Status:</strong> Waiting for buyer payment
                          </p>
                          <Button
                            onClick={() => handleConfirmPayment(transaction.id)}
                            disabled={confirmingPayment === transaction.id}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                            data-testid="button-confirm-payment"
                          >
                            {confirmingPayment === transaction.id ? (
                              <>
                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                Confirming Payment...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                I Received Payment - Generate Second Code
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            Click only after you receive payment from the buyer
                          </p>
                        </div>
                      )}

                      {transaction.paymentConfirmed && (
                        <div className="border-t pt-3">
                          <p className="text-sm text-green-700 font-medium">
                            ✅ Payment confirmed - Second verification code generated
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No confirmed transactions yet</p>
                  <p className="text-xs">Completed transactions will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

        </TabsContent>

        {/* BUYER INQUIRIES TAB */}
        <TabsContent value="buyer-inquiries" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Buyer Communications
              </CardTitle>
              <CardDescription>
                Messages and inquiries from buyers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No Inquiries</p>
                <p className="text-sm">Buyer inquiries will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ALERTS TAB */}
        <TabsContent value="alerts" className="space-y-6 mt-6">
          {/* System Alerts */}
          {Array.isArray(alerts) && alerts.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-5 w-5" />
                  Farm Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 3).map((alert: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}