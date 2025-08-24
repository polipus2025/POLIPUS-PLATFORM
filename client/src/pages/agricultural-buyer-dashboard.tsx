import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LogOut
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

  // Get buyer info from localStorage
  const buyerId = localStorage.getItem("buyerId") || localStorage.getItem("userId") || "";
  const buyerName = localStorage.getItem("buyerName") || localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
  const company = localStorage.getItem("company") || "Agricultural Trading Company";

  // Fetch product offer notifications for this buyer
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/buyer/notifications', buyerId],
    queryFn: () => apiRequest(`/api/buyer-notifications/${buyerId}`),
    enabled: !!buyerId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch farmer harvests ready for purchase
  const { data: availableHarvests, isLoading: harvestsLoading } = useQuery({
    queryKey: ['/api/buyer/available-harvests'],
    queryFn: () => apiRequest('/api/buyer/available-harvests'),
  });

  // Fetch buyer's active transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/buyer/transactions'],
    queryFn: () => apiRequest('/api/buyer/transactions'),
  });

  // Fetch marketplace data
  const { data: marketplace, isLoading: marketplaceLoading } = useQuery({
    queryKey: ['/api/buyer/marketplace'],
    queryFn: () => apiRequest('/api/buyer/marketplace'),
  });

  // Fetch buyer business metrics
  const { data: businessMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/buyer/business-metrics'],
    queryFn: () => apiRequest('/api/buyer/business-metrics'),
  });

  // Fetch confirmed transactions archive
  const { data: confirmedTransactions, isLoading: confirmedLoading } = useQuery({
    queryKey: ['/api/buyer/confirmed-transactions', buyerId],
    queryFn: () => apiRequest(`/api/buyer/confirmed-transactions/${buyerId}`),
    enabled: !!buyerId,
  });

  // Fetch verification codes archive
  const { data: verificationCodes, isLoading: codesLoading } = useQuery({
    queryKey: ['/api/buyer/verification-codes', buyerId], 
    queryFn: () => apiRequest(`/api/buyer/verification-codes/${buyerId}`),
    enabled: !!buyerId,
  });

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
    console.log('Connecting with farmer:', farmerId);
  };

  // Handle accepting a product offer
  const handleAcceptOffer = async (notificationId: string) => {
    try {
      const response = await apiRequest(`/api/buyer/accept-offer`, {
        method: 'POST',
        body: JSON.stringify({
          notificationId,
          buyerId: buyerId ? parseInt(buyerId) : 0,
          buyerName: buyerName,
          company: company
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
            <p className="text-gray-600">{company}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-gray-900">{buyerName}</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex w-full h-auto p-1">
            <TabsTrigger value="overview" className="flex-1 text-xs px-2 py-2 min-w-0">Business Overview</TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 text-xs px-2 py-2 min-w-0">Product Offers</TabsTrigger>
            <TabsTrigger value="farmers" className="flex-1 text-xs px-2 py-2 min-w-0">Farmer Connections</TabsTrigger>
            <TabsTrigger value="confirmed" className="flex-1 text-xs px-2 py-2 min-w-0">Confirmed Transactions</TabsTrigger>
            <TabsTrigger value="codes" className="flex-1 text-xs px-2 py-2 min-w-0">Verification Codes</TabsTrigger>
            <TabsTrigger value="transactions" className="flex-1 text-xs px-2 py-2 min-w-0">Transaction Dashboard</TabsTrigger>
          </TabsList>

          {/* Business Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
          </TabsContent>

          {/* Product Offers Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
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
                ) : notifications?.notifications && notifications.notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.notifications.map((notification: any) => (
                      <Card key={notification.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-lg">{notification.commodityType}</h4>
                              <p className="text-sm text-gray-600">From: {notification.farmerName}</p>
                              <p className="text-sm text-gray-500">{notification.farmLocation}</p>
                            </div>
                            <Badge className={notification.status === 'pending' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {notification.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Quantity Available</p>
                              <p className="font-medium">{notification.quantityAvailable} {notification.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Price per Unit</p>
                              <p className="font-medium">${notification.pricePerUnit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Value</p>
                              <p className="font-medium text-green-600">${notification.totalValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Quality Grade</p>
                              <p className="font-medium">{notification.qualityGrade}</p>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Payment Terms</p>
                            <p className="text-sm">{notification.paymentTerms}</p>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-gray-600">Delivery Terms</p>
                            <p className="text-sm">{notification.deliveryTerms}</p>
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
                            {notification.status === 'pending' ? (
                              <Button 
                                onClick={() => handleAcceptOffer(notification.notificationId)}
                                className="bg-green-600 hover:bg-green-700"
                                data-testid={`button-accept-${notification.id}`}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Offer
                              </Button>
                            ) : (
                              <Badge variant="outline" className="text-gray-500">
                                {notification.status === 'accepted' ? 'Already Accepted' : 'No Longer Available'}
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
          </TabsContent>

          {/* Farmer Connections Tab */}
          <TabsContent value="farmers" className="space-y-6">
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
          </TabsContent>

          {/* Confirmed Transactions Archive Tab */}
          <TabsContent value="confirmed" className="space-y-6">
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
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              ID: {transaction.notificationId}
                            </Badge>
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
          </TabsContent>

          {/* Verification Codes Archive Tab */}
          <TabsContent value="codes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Verification Codes Archive
                </CardTitle>
                <CardDescription>
                  All verification codes generated for transaction traceability
                </CardDescription>
              </CardHeader>
              <CardContent>
                {codesLoading ? (
                  <div className="text-center py-8 text-gray-500">Caricamento codici...</div>
                ) : verificationCodes && verificationCodes.length > 0 ? (
                  <div className="space-y-3">
                    {verificationCodes.map((code: any) => (
                      <div key={code.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-mono font-bold text-blue-600 text-lg">{code.verificationCode}</p>
                              <p className="text-sm text-gray-600">{code.commodityType} - {code.farmerName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Valore: <span className="font-medium">${code.totalValue}</span></p>
                              <p className="text-sm text-gray-600">Quantità: <span className="font-medium">{code.quantityAvailable} {code.unit}</span></p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-600 text-white mb-1">Attivo</Badge>
                          <p className="text-xs text-gray-500">{new Date(code.generatedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No verification codes generated</p>
                    <p className="text-sm mt-2">I codici appariranno quando accetti le offerte</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction Dashboard Tab */}
          <TabsContent value="transactions" className="space-y-6">
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
                      <div className="text-2xl font-bold">$124,500</div>
                      <p className="text-xs text-gray-600">This month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$145,200</div>
                      <p className="text-xs text-gray-600">This month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$20,700</div>
                      <p className="text-xs text-gray-600">16.6% margin</p>
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
                      <div className="flex items-center justify-between py-2 border-b">
                        <div>
                          <p className="font-medium">Purchase from Mary Johnson</p>
                          <p className="text-sm text-gray-600">750kg Cocoa Beans - FRM-2024-045</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">-$1,875</p>
                          <p className="text-sm text-gray-600">Jan 15, 2024</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b">
                        <div>
                          <p className="font-medium">Sale to Global Trading Ltd</p>
                          <p className="text-sm text-gray-600">500kg Cocoa Beans</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+$1,750</p>
                          <p className="text-sm text-gray-600">Jan 14, 2024</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b">
                        <div>
                          <p className="font-medium">Purchase from David Wilson</p>
                          <p className="text-sm text-gray-600">450kg Coffee Beans - FRM-2024-067</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">-$1,440</p>
                          <p className="text-sm text-gray-600">Jan 12, 2024</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium">Sale to International Export Co.</p>
                          <p className="text-sm text-gray-600">300kg Coffee Beans</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+$1,260</p>
                          <p className="text-sm text-gray-600">Jan 10, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}