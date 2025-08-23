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
  Home
} from "lucide-react";
import { Link } from "wouter";

export default function FarmerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState<string | null>(null);

  // Get farmer ID from localStorage (authenticated user's actual ID)
  const farmerId = localStorage.getItem("farmerId") || localStorage.getItem("credentialId") || "FRM-2024-001";
  const farmerName = localStorage.getItem("farmerFirstName") || "Moses";
  const farmerCounty = localStorage.getItem("farmerCounty") || "Monrovia";
  
  // Fetch farmer-specific data
  const { data: farmerLandData } = useQuery({ 
    queryKey: ["/api/farmer-land-data", farmerId],
    queryFn: () => apiRequest(`/api/farmer-land-data/${farmerId}`),
    enabled: !!farmerId,
  });
  const { data: cropPlans } = useQuery({ queryKey: ["/api/crop-plans"] });
  const { data: trackingRecords } = useQuery({ queryKey: ["/api/tracking-records"] });

  // Fetch farmer confirmed transactions archive
  const { data: farmerTransactions, isLoading: farmerTransactionsLoading } = useQuery({
    queryKey: ['/api/farmer/confirmed-transactions', farmerId],
    queryFn: () => apiRequest(`/api/farmer/confirmed-transactions/${farmerId}`),
    enabled: !!farmerId,
  });

  // Fetch farmer verification codes archive
  const { data: farmerCodes, isLoading: farmerCodesLoading } = useQuery({
    queryKey: ['/api/farmer/verification-codes', farmerId],
    queryFn: () => apiRequest(`/api/farmer/verification-codes/${farmerId}`),
    enabled: !!farmerId,
  });

  // Mock data for dashboard stats  
  const totalPlots = farmerLandData?.landMappingAvailable ? 1 : 0;
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
      farmerId: parseInt(farmerId.split('-')[2]) || 1,
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
        description: `${response.notificationsSent} buyers in ${farmerCounty} County have been notified. Buyers notified: ${response.buyersNotified.join(', ')}`
      });

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
      </div>

      {/* Simplified Tabbed Navigation Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 h-12">
          <TabsTrigger value="overview" className="flex items-center justify-center gap-2 text-sm p-3">
            <Home className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="land-mappings" className="flex items-center justify-center gap-2 text-sm p-3">
            <MapPin className="h-4 w-4" />
            <span>Land Info</span>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center justify-center gap-2 text-sm p-3">
            <ShoppingCart className="h-4 w-4" />
            <span>Marketplace</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center justify-center gap-2 text-sm p-3">
            <FileText className="h-4 w-4" />
            <span>Transactions</span>
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
                Land Mapping Information
              </CardTitle>
              <CardDescription>
                {farmerLandData?.landMappingAvailable 
                  ? "Your land mapping data from registration" 
                  : "Note: Farmers cannot map new plots. Land mapping is restricted to Land Inspectors."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {farmerLandData?.landMappingAvailable ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Farm Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Farm Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><strong>Farm Size:</strong> {farmerLandData.farmer?.farmSize} {farmerLandData.farmer?.farmSizeUnit}</div>
                      <div><strong>Primary Crop:</strong> {farmerLandData.farmer?.primaryCrop}</div>
                      <div><strong>County:</strong> {farmerLandData.farmer?.county}</div>
                      <div><strong>District:</strong> {farmerLandData.farmer?.district}</div>
                      {farmerLandData.farmer?.village && <div><strong>Village:</strong> {farmerLandData.farmer?.village}</div>}
                    </div>
                    
                    {/* Land Map Data */}
                    {farmerLandData.farmer?.landMapData && (
                      <div className="mt-4">
                        <h4 className="font-medium">Land Analysis</h4>
                        <div className="text-sm space-y-1">
                          <div><strong>Soil Type:</strong> {JSON.parse(farmerLandData.farmer.landMapData).soilType}</div>
                          <div><strong>Water Sources:</strong> {JSON.parse(farmerLandData.farmer.landMapData).waterSources?.join(', ')}</div>
                          <div><strong>EUDR Risk Level:</strong> 
                            <Badge variant={JSON.parse(farmerLandData.farmer.landMapData).eudrCompliance?.riskLevel === 'low' ? 'default' : 'destructive'} className="ml-2">
                              {JSON.parse(farmerLandData.farmer.landMapData).eudrCompliance?.riskLevel}
                            </Badge>
                          </div>
                          <div><strong>Compliance Score:</strong> {JSON.parse(farmerLandData.farmer.landMapData).eudrCompliance?.complianceScore}%</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* GPS Boundaries */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">GPS Boundaries</h3>
                    {farmerLandData.farmer?.farmBoundaries && (
                      <div className="text-sm">
                        <div className="bg-gray-50 p-3 rounded border">
                          <strong>Boundary Points:</strong>
                          {JSON.parse(farmerLandData.farmer.farmBoundaries).map((point: any, index: number) => (
                            <div key={index} className="mt-1">
                              Point {point.point}: {point.lat}, {point.lng}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {farmerLandData.farmer?.gpsCoordinates && (
                      <div className="text-sm">
                        <strong>Primary GPS:</strong> {farmerLandData.farmer.gpsCoordinates}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Land Mapping Restricted</p>
                  <p className="text-sm">All land mapping activities are handled by official Land Inspectors.</p>
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
        </TabsContent>

        {/* TRANSACTIONS TAB */}
        <TabsContent value="transactions" className="space-y-3 mt-6">
          {/* Pending Offers Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-orange-600" />
                Pending Product Offers
              </CardTitle>
              <CardDescription>
                Your submitted offers waiting for buyer acceptance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-orange-900">Recently Submitted Offer</p>
                    <p className="text-sm text-gray-600">3 buyers in Monrovia County notified</p>
                  </div>
                  <Badge className="bg-orange-600 text-white">Pending</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Status: <span className="font-medium text-orange-600">Waiting for buyer acceptance</span></p>
                  <p className="text-xs mt-1">First buyer to accept wins the offer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Confirmed Transactions Archive */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Confirmed Transactions
              </CardTitle>
              <CardDescription>
                Your accepted offers history
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
                  <p className="text-sm">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Codes Archive */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Verification Codes
              </CardTitle>
              <CardDescription>
                Your verification codes for transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {farmerCodesLoading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : farmerCodes && farmerCodes.length > 0 ? (
                <div className="space-y-3">
                  {farmerCodes.map((code: any) => (
                    <div key={code.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono font-bold text-blue-600">{code.verificationCode}</p>
                          <p className="text-sm text-gray-600">{code.commodityType} - {code.buyerName}</p>
                        </div>
                        <Badge className="bg-blue-600 text-white text-xs">Active</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Value: <span className="font-medium">${code.totalValue}</span></p>
                        <p className="text-xs">{new Date(code.generatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No codes generated</p>
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