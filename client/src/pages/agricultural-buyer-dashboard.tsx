import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Removed Tabs components - using conditional rendering instead
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Package2, 
  TrendingUp, 
  MapPin, 
  Clock, 
  DollarSign,
  Handshake,
  Truck,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  PhoneCall,
  MessageCircle,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function AgriculturalBuyerDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requestingBags, setRequestingBags] = useState<string | null>(null);
  const [farmersMenuOpen, setFarmersMenuOpen] = useState(false);

  // UNIVERSAL BUYER DETECTION - Same pattern as standalone transaction dashboard
  const [buyerId, setBuyerId] = useState<string>("");
  
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData?.user?.buyerId) {
          setBuyerId(parsedData.user.buyerId);
        }
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    }
    
    // Fallback to old method for backward compatibility
    if (!buyerId) {
      const fallbackBuyerId = localStorage.getItem("buyerId") || localStorage.getItem("userId") || "";
      setBuyerId(fallbackBuyerId);
    }
  }, []);
  
  // Fetch authentic DDGOTS-created buyer profile data
  const { data: buyerProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/buyer/profile', buyerId],
    queryFn: () => apiRequest(`/api/buyer/profile/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Use DDGOTS-created data instead of localStorage
  const buyerName = buyerProfile?.contactPersonFirstName && buyerProfile?.contactPersonLastName 
    ? `${buyerProfile.contactPersonFirstName} ${buyerProfile.contactPersonLastName}`
    : "Agricultural Buyer";
  const company = buyerProfile?.businessName || "Agricultural Trading Company";

  // Fetch product offer notifications for this buyer - REAL-TIME for offer competition
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/buyer/notifications', buyerId],
    queryFn: () => apiRequest(`/api/buyer/notifications/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 0, // No cache - always fetch fresh for real-time offer status
    gcTime: 0, // Don't keep in cache
    refetchInterval: 5000, // Refresh every 5 seconds for real-time competition
  });

  // Fetch farmer harvests ready for purchase
  const { data: availableHarvests, isLoading: harvestsLoading } = useQuery({
    queryKey: ['/api/buyer/available-harvests'],
    queryFn: () => apiRequest('/api/buyer/available-harvests'),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Fetch buyer's active transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/buyer/transactions'],
    queryFn: () => apiRequest('/api/buyer/transactions'),
    staleTime: 90 * 1000, // Cache for 90 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Fetch marketplace data
  const { data: marketplace, isLoading: marketplaceLoading } = useQuery({
    queryKey: ['/api/buyer/marketplace'],
    queryFn: () => apiRequest('/api/buyer/marketplace'),
    staleTime: 3 * 60 * 1000, // Cache for 3 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });

  // Fetch buyer business metrics
  const { data: businessMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/buyer/business-metrics'],
    queryFn: () => apiRequest('/api/buyer/business-metrics'),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (metrics change slowly)
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Fetch confirmed transactions archive
  const { data: confirmedTransactions, isLoading: confirmedLoading } = useQuery({
    queryKey: ['/api/buyer/confirmed-transactions', buyerId],
    queryFn: () => apiRequest(`/api/buyer/confirmed-transactions/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Fetch verification codes archive
  const { data: verificationCodesResponse, isLoading: codesLoading } = useQuery({
    queryKey: ['/api/buyer/verification-codes', buyerId], 
    queryFn: () => apiRequest(`/api/buyer/verification-codes/${buyerId}`),
    enabled: !!buyerId,
    staleTime: 0, // No cache - always fetch fresh data
    gcTime: 0, // Don't keep in cache
  });
  
  // Extract data from response structure
  const verificationCodes = verificationCodesResponse?.data || [];


  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('buyerId');
    localStorage.removeItem('buyerName');
    localStorage.removeItem('userType');
    localStorage.removeItem('company');
    navigate('/auth/farmer-login');
  };

  const connectWithFarmer = (farmerId: string) => {
    // API call to initiate connection with farmer
    // Connecting with farmer
  };

  // Handle accepting a product offer
  const handleAcceptOffer = async (notificationId: string) => {
    try {
      const response = await apiRequest(`/api/buyer/accept-offer`, {
        method: 'POST',
        body: JSON.stringify({
          notificationId,
          buyerId: buyerId,
          buyerName: buyerName || "Michael Johnson",
          company: company || "Michael Johnson Trading"
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      // Show detailed success message with verification code
      toast({
        title: "🎉 Offerta Accettata con Successo!",
        description: `Transaction confirmed. Verification code: ${response.verificationCode}. Check transaction archive for complete details.`,
      });

      // Refresh all data
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/notifications', buyerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/confirmed-transactions', buyerId] });
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/verification-codes', buyerId] });
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Impossibile accettare l'offerta. Potrebbe essere stata presa da un altro buyer.",
        variant: "destructive",
      });
    }
  };

  // Handle requesting bags from warehouse
  const handleRequestBags = async (verificationCode: string, acceptanceData: any) => {
    if (requestingBags) return;
    
    setRequestingBags(verificationCode);
    try {
      const response = await apiRequest('/api/buyer/request-bags', {
        method: 'POST',
        body: JSON.stringify({
          verificationCode,
          buyerId,
          buyerName,
          company,
          farmerName: acceptanceData.farmerName,
          commodityType: acceptanceData.commodityType,
          quantity: acceptanceData.quantity,
          totalValue: acceptanceData.totalValue,
          county: acceptanceData.county,
          farmLocation: acceptanceData.farmLocation
        })
      });
      
      toast({
        title: "✅ Bags Requested Successfully!",
        description: `Your request has been sent to ${acceptanceData.county} warehouse. Transaction: ${response.transactionId}`,
      });
      
      // Refresh verification codes to update status
      queryClient.invalidateQueries({ queryKey: ['/api/buyer/verification-codes', buyerId] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request bags from warehouse",
        variant: "destructive",
      });
    } finally {
      setRequestingBags(null);
    }
  };

  // SECURITY: Payment confirmation removed - only farmers can confirm payments to prevent fraud

  const accessMarketplace = () => {
    // Navigate to buyer marketplace
    navigate('/buyer-marketplace');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agricultural Buyer Portal</h1>
            {profileLoading ? (
              <p className="text-gray-600">Loading company details...</p>
            ) : (
              <p className="text-gray-600">{company}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              {profileLoading ? (
                <p className="font-medium text-gray-900">Loading...</p>
              ) : (
                <>
                  <p className="font-medium text-gray-900">{buyerName}</p>
                  {buyerProfile && (
                    <p className="text-xs text-gray-500">{buyerProfile.primaryEmail} • {buyerProfile.contactPersonTitle}</p>
                  )}
                </>
              )}
              <p className="text-sm text-gray-500">Buyer ID: {buyerId}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Enhanced Navigation with Farmers Dropdown - Prominent Styling */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            {/* Business Overview */}
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              size="lg"
              onClick={() => setActiveTab('overview')}
              className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              Business Overview
            </Button>
            
            {/* Product Offers */}
            <Button 
              variant={activeTab === 'notifications' ? 'default' : 'ghost'} 
              size="lg"
              onClick={() => setActiveTab('notifications')}
              className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              Product Offers
            </Button>

            {/* Farmers Dropdown Menu */}
            <div className="relative">
              <Button 
                variant={['farmers', 'confirmed', 'orders'].includes(activeTab) ? 'default' : 'ghost'} 
                size="lg"
                onClick={() => setFarmersMenuOpen(!farmersMenuOpen)}
                className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                Farmers
                {farmersMenuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
              
              {/* Enhanced Dropdown Menu */}
              {farmersMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl z-20 min-w-[220px]">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setActiveTab('farmers');
                        setFarmersMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-medium text-sm hover:bg-slate-50 transition-all ${
                        activeTab === 'farmers' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' : 'text-slate-700'
                      }`}
                    >
                      Farmer Connections
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('confirmed');
                        setFarmersMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-medium text-sm hover:bg-slate-50 transition-all ${
                        activeTab === 'confirmed' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' : 'text-slate-700'
                      }`}
                    >
                      Confirmed Transactions
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('orders');
                        setFarmersMenuOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 font-medium text-sm hover:bg-slate-50 transition-all ${
                        activeTab === 'orders' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500' : 'text-slate-700'
                      }`}
                    >
                      My Orders
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Transaction Dashboard */}
            <Button 
              variant={activeTab === 'transactions' ? 'default' : 'ghost'} 
              size="lg"
              onClick={() => setActiveTab('transactions')}
              className="font-semibold text-sm px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              Transaction Dashboard
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div>
          {/* Business Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-gray-600">Farmers Only</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Harvests</CardTitle>
                  <Package2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15</div>
                  <p className="text-xs text-gray-600">Ready for purchase</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Volume</CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.5T</div>
                  <p className="text-xs text-gray-600">Commodities traded</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,200</div>
                  <p className="text-xs text-gray-600">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest connections and transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">New harvest notification from John Doe</p>
                      <p className="text-sm text-gray-600">500kg cocoa beans ready - Bong County</p>
                    </div>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Exporter connection request accepted</p>
                      <p className="text-sm text-gray-600">Global Trading Ltd now available for sales</p>
                    </div>
                    <Badge variant="outline">5 hours ago</Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Transaction completed</p>
                      <p className="text-sm text-gray-600">Coffee beans sold to International Export Co.</p>
                    </div>
                    <Badge variant="outline">1 day ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Product Offers Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package2 className="w-5 h-5 mr-2" />
                  Product Offers from Farmers
                </CardTitle>
                <CardDescription>
                  Real-time notifications when farmers in your county submit product offers. First to accept wins!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading notifications...</div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification: any) => (
                      <Card key={notification.notificationId} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{notification.commodityType}</h4>
                              <p className="text-sm text-gray-600">From: {notification.farmerName}</p>
                              <p className="text-sm text-gray-500">{notification.county}</p>
                            </div>
                            <Badge className={!notification.response ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {!notification.response ? 'Available' : 'Taken'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity Available</p>
                              <p className="font-medium">{notification.quantityAvailable} tons</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Price per Unit</p>
                              <p className="font-medium">${notification.pricePerUnit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${(parseFloat(notification.quantityAvailable) * parseFloat(notification.pricePerUnit)).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Quality Grade</p>
                              <p className="font-medium">Grade A</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Payment Terms</p>
                            <p className="text-sm">Cash on Delivery</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Delivery Terms</p>
                            <p className="text-sm">FOB Farm Gate</p>
                          </div>

                          {notification.description && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">Additional Details</p>
                              <p className="text-sm">{notification.description}</p>
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-xs text-gray-500">
                              Posted: {new Date(notification.createdAt).toLocaleString()}
                            </div>
                            {!notification.response ? (
                              <Button 
                                onClick={() => handleAcceptOffer(notification.notificationId)}
                                className="bg-green-600 hover:bg-green-700"
                                data-testid={`button-accept-${notification.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Offer
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                {notification.response === 'confirmed' ? '✅ You Accepted This' : '❌ Taken by Another Buyer'}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No product offers at this time.</p>
                    <p className="text-sm">Notifications will appear here when farmers in your county submit offers.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* My Orders Tab - Buyer Acceptances with Request Bags */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  My Orders - Request Bags to Warehouse
                </CardTitle>
                <CardDescription>
                  Accepted offers ready for bag requests. Click "Request Bags" to send acceptance details to your county warehouse.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {codesLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading your orders...</div>
                ) : verificationCodes && verificationCodes.length > 0 ? (
                  <div className="space-y-4">
                    {verificationCodes.map((acceptance: any) => (
                      <Card key={acceptance.verificationCode} className="border border-blue-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{acceptance.commodityType}</h4>
                              <p className="text-sm text-gray-600">From: {acceptance.farmerName}</p>
                              <p className="text-sm text-gray-500">{acceptance.farmLocation}</p>
                            </div>
                            <Badge className={
                              acceptance.status === 'bags_requested' ? "bg-purple-100 text-purple-800" :
                              acceptance.status === 'payment_confirmed' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }>
                              {acceptance.status === 'bags_requested' ? 'Bag Request Complete' :
                               acceptance.status === 'payment_confirmed' ? 'Payment Confirmed' : 'Ready for Bags'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity</p>
                              <p className="font-medium">{acceptance.quantity} {acceptance.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${acceptance.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">County</p>
                              <p className="font-medium">{acceptance.county}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Verification Code</p>
                              <p className="font-mono text-sm bg-gray-100 p-1 rounded">{acceptance.verificationCode}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Payment Terms</p>
                            <p className="text-sm">{acceptance.paymentTerms}</p>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-xs text-gray-500">
                              Accepted: {new Date(acceptance.confirmedAt).toLocaleString()}
                            </div>
                            {acceptance.status === 'bags_requested' ? (
                              <Button 
                                disabled
                                className="bg-gray-400 cursor-not-allowed"
                                data-testid={`button-bags-requested-${acceptance.verificationCode}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Requested
                              </Button>
                            ) : (
                              <Button 
                                onClick={() => handleRequestBags(acceptance.verificationCode, acceptance)}
                                disabled={requestingBags === acceptance.verificationCode}
                                className="bg-blue-600 hover:bg-blue-700"
                                data-testid={`button-request-bags-${acceptance.verificationCode}`}
                              >
                                {requestingBags === acceptance.verificationCode ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                    Requesting...
                                  </>
                                ) : (
                                  <>
                                    <Truck className="w-4 h-4 mr-2" />
                                    Request Bags to Warehouse
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No confirmed orders ready for bag requests.</p>
                    <p className="text-sm">Complete payment confirmation on accepted offers to request bags from warehouse.</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* Farmer Connections Tab */}
          {activeTab === 'farmers' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Harvests from Farmers</CardTitle>
                <CardDescription>Farmers who have confirmed their harvesting and ready for purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {harvestsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading available harvests...</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableHarvests && Array.isArray(availableHarvests) && availableHarvests.length > 0 ? (
                          availableHarvests.map((harvest: any, index: number) => (
                            <Card key={harvest.id || index} className={`border-2 ${harvest.farmerName === 'Paolo' ? 'border-blue-200 bg-blue-50' : 'border-green-200'}`}>
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-lg">{harvest.farmerName}</CardTitle>
                                    <p className="text-sm text-gray-600">Farmer ID: {harvest.farmerId}</p>
                                    {harvest.farmerName === 'Paolo' && (
                                      <Badge className="bg-blue-100 text-blue-800 mt-1">🎯 Margibi County</Badge>
                                    )}
                                  </div>
                                  <Badge className={`${harvest.status === 'Ready' || harvest.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {harvest.status || 'Ready'}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm">
                                    <Package2 className="h-4 w-4 mr-2 text-green-600" />
                                    <span className="font-medium">
                                      {harvest.commodity || harvest.commodityType} - {harvest.quantity || harvest.quantityAvailable}{harvest.unit ? ` ${harvest.unit}` : ''}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                    <span>{harvest.county}{harvest.farmLocation ? `, ${harvest.farmLocation}` : ''}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                    <span>Harvested: {harvest.harvestDate ? new Date(harvest.harvestDate).toLocaleDateString() : 'Recently'}</span>
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                    <span className="font-medium">
                                      ${harvest.pricePerUnit || harvest.pricePerKg}/{harvest.unit || 'kg'}
                                      {harvest.totalValue && (
                                        <span className="text-blue-600 ml-2">(Total: ${harvest.totalValue})</span>
                                      )}
                                    </span>
                                  </div>
                                  {harvest.qualityGrade && (
                                    <div className="flex items-center text-sm">
                                      <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
                                      <span className="font-medium text-purple-700">Quality: {harvest.qualityGrade}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex space-x-2 mt-4">
                                  <Button 
                                    size="sm" 
                                    className={`flex-1 ${harvest.farmerName === 'Paolo' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                    onClick={() => connectWithFarmer(harvest.farmerId)}
                                  >
                                    <Handshake className="h-4 w-4 mr-1" />
                                    {harvest.farmerName === 'Paolo' ? 'Connect with Paolo Jr!' : 'Connect'}
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <PhoneCall className="h-4 w-4 mr-1" />
                                    Call
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No harvests available at the moment</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            </div>
          )}

          {/* Confirmed Transactions Archive Tab */}
          {activeTab === 'confirmed' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Confirmed Transactions Archive
                </CardTitle>
                <CardDescription>
                  Complete history of accepted offers with payment and delivery details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {confirmedLoading ? (
                  <div className="text-center py-8 text-gray-500">Loading transactions...</div>
                ) : confirmedTransactions && confirmedTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {confirmedTransactions.map((transaction: any) => (
                      <Card key={transaction.id} className="border border-green-200 bg-green-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg text-green-800">{transaction.commodityType}</h4>
                              <p className="text-sm text-gray-600">Farmer: {transaction.farmerName}</p>
                              <p className="text-sm text-gray-500">{transaction.farmLocation}</p>
                            </div>
                            <Badge className="bg-green-600 text-white">Confirmed</Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity</p>
                              <p className="font-medium">{transaction.quantityAvailable} {transaction.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${transaction.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Verification Code</p>
                              <p className="font-mono font-bold text-blue-600">{transaction.verificationCode}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Payment Terms</p>
                              <p className="text-sm">{transaction.paymentTerms}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Delivery Terms</p>
                              <p className="text-sm">{transaction.deliveryTerms}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-green-200">
                            <div className="text-xs text-gray-500">
                              Confirmed: {new Date(transaction.confirmedAt).toLocaleString()}
                            </div>
                            <div className="flex items-center space-x-2">
                              {transaction.paymentConfirmed ? (
                                <Badge className="bg-green-600 text-white">
                                  ✓ Payment Confirmed by Farmer
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Awaiting Farmer Payment Confirmation
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                ID: {transaction.notificationId}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No confirmed transactions at this time</p>
                    <p className="text-sm mt-2">Accepted offers will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
            </div>
          )}

          {/* Transaction Dashboard Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Dashboard</CardTitle>
                <CardDescription>Overview of all your buying and selling activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
                      <Package2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${confirmedTransactions?.reduce((sum: number, t: any) => sum + parseFloat(t.totalValue || 0), 0).toLocaleString() || '0'}
                      </div>
                      <p className="text-xs text-gray-600">From confirmed orders</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{confirmedTransactions?.length || 0}</div>
                      <p className="text-xs text-gray-600">Confirmed transactions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {confirmedTransactions?.filter((t: any) => !t.paymentConfirmed).length || 0}
                      </div>
                      <p className="text-xs text-gray-600">Awaiting payment</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Transactions Table */}
                <div className="border rounded-lg">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium">Recent Transactions</h4>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {confirmedTransactions && confirmedTransactions.length > 0 ? (
                        confirmedTransactions.slice(0, 4).map((transaction: any, index: number) => (
                          <div key={transaction.id} className="flex items-center justify-between py-2 border-b">
                            <div>
                              <p className="font-medium">Purchase from {transaction.farmerName}</p>
                              <p className="text-sm text-gray-600">{transaction.quantityAvailable} {transaction.unit} {transaction.commodityType}</p>
                              <p className="text-xs text-blue-600 font-mono">Code: {transaction.verificationCode}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-red-600">${transaction.totalValue}</p>
                              <p className="text-sm text-gray-600">{new Date(transaction.confirmedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-between py-2 border-b">
                          <div>
                            <p className="font-medium">No real transactions yet</p>
                            <p className="text-sm text-gray-600">Accept offers to see your purchases here</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-500">$0</p>
                            <p className="text-sm text-gray-600">Pending</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}