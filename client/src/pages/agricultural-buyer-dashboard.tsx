import { useState, useEffect } from "react";
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

export default function AgriculturalBuyerDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize with URL parameter if available
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    return (tab && ['overview', 'farmers', 'exporters'].includes(tab)) ? tab : 'overview';
  });
  
  // Handle URL params for tab switching from sidebar
  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      console.log('URL tab parameter:', tab); // Debug log
      if (tab && ['overview', 'farmers', 'exporters'].includes(tab)) {
        console.log('Setting active tab to:', tab); // Debug log
        setActiveTab(tab);
      }
    };
    
    // Check on mount
    checkUrlParams();
    
    // Listen for URL changes
    const handleUrlChange = () => {
      checkUrlParams();
    };
    
    window.addEventListener('popstate', handleUrlChange);
    
    // Also listen for custom events from sidebar navigation
    const handleSidebarNavigation = () => {
      setTimeout(checkUrlParams, 100); // Small delay to ensure URL is updated
    };
    
    window.addEventListener('sidebarNavigation', handleSidebarNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('sidebarNavigation', handleSidebarNavigation);
    };
  }, []);

  // Get buyer info from localStorage
  const buyerId = localStorage.getItem("buyerId") || localStorage.getItem("userId");
  const buyerName = localStorage.getItem("buyerName") || localStorage.getItem("firstName") + " " + localStorage.getItem("lastName");
  const company = localStorage.getItem("company") || "Agricultural Trading Company";

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

  // Fetch connected exporters for selling
  const { data: exporters, isLoading: exportersLoading } = useQuery({
    queryKey: ['/api/buyer/connected-exporters'],
    queryFn: () => apiRequest('/api/buyer/connected-exporters'),
  });

  // Fetch buyer business metrics
  const { data: businessMetrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/buyer/business-metrics'],
    queryFn: () => apiRequest('/api/buyer/business-metrics'),
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('buyerId');
    localStorage.removeItem('buyerName');
    localStorage.removeItem('userType');
    localStorage.removeItem('company');
    navigate('/exporter-login');
  };

  const connectWithFarmer = (farmerId: string) => {
    // API call to initiate connection with farmer
    console.log('Connecting with farmer:', farmerId);
  };

  const contactExporter = (exporterId: string) => {
    // API call to contact exporter for selling
    console.log('Contacting exporter:', exporterId);
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
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          // Update URL without page reload
          const newUrl = value === 'overview' ? '/agricultural-buyer-dashboard' : `/agricultural-buyer-dashboard?tab=${value}`;
          window.history.pushState({}, '', newUrl);
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Business Overview</TabsTrigger>
            <TabsTrigger value="farmers">Farmer Connections</TabsTrigger>
            <TabsTrigger value="exporters">Exporter Network</TabsTrigger>
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
                  <p className="text-xs text-gray-600">Farmers & Exporters</p>
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
                        <Card className="border-2 border-green-200">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">Mary Johnson</CardTitle>
                                <p className="text-sm text-gray-600">Farmer ID: FRM-2024-045</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Ready</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Package2 className="h-4 w-4 mr-2 text-green-600" />
                                <span className="font-medium">Cocoa Beans - 750kg</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Nimba County, Ganta District</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Harvested: Jan 15, 2024</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                <span className="font-medium">$2.50/kg</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-4">
                              <Button size="sm" className="flex-1" onClick={() => connectWithFarmer('FRM-2024-045')}>
                                <Handshake className="h-4 w-4 mr-1" />
                                Connect
                              </Button>
                              <Button size="sm" variant="outline">
                                <PhoneCall className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-green-200">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">David Wilson</CardTitle>
                                <p className="text-sm text-gray-600">Farmer ID: FRM-2024-067</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Ready</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Package2 className="h-4 w-4 mr-2 text-green-600" />
                                <span className="font-medium">Coffee Beans - 450kg</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Bong County, Gbarnga District</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Harvested: Jan 12, 2024</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                <span className="font-medium">$3.20/kg</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-4">
                              <Button size="sm" className="flex-1" onClick={() => connectWithFarmer('FRM-2024-067')}>
                                <Handshake className="h-4 w-4 mr-1" />
                                Connect
                              </Button>
                              <Button size="sm" variant="outline">
                                <PhoneCall className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-2 border-yellow-200">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">Sarah Brown</CardTitle>
                                <p className="text-sm text-gray-600">Farmer ID: FRM-2024-089</p>
                              </div>
                              <Badge className="bg-yellow-100 text-yellow-800">Processing</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Package2 className="h-4 w-4 mr-2 text-green-600" />
                                <span className="font-medium">Palm Oil - 200L</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                                <span>Grand Bassa County</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                <span>Expected: Jan 20, 2024</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                <span className="font-medium">$1.80/L</span>
                              </div>
                            </div>
                            <div className="flex space-x-2 mt-4">
                              <Button size="sm" className="flex-1" variant="outline" disabled>
                                <Clock className="h-4 w-4 mr-1" />
                                Pending
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Message
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exporter Network Tab */}
          <TabsContent value="exporters" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Connected Exporters</CardTitle>
                <CardDescription>Network of exporters available for selling your purchased commodities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Global Trading Ltd</CardTitle>
                          <p className="text-sm text-gray-600">EST-2024-012</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Package2 className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Specializes in: Cocoa, Coffee</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                          <span>Price Range: $2.80 - $3.50/kg</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Truck className="h-4 w-4 mr-2 text-orange-600" />
                          <span>Ships to: EU, USA, Asia</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="flex-1" onClick={() => contactExporter('EST-2024-012')}>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">International Export Co.</CardTitle>
                          <p className="text-sm text-gray-600">EST-2024-008</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Premium</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Package2 className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Specializes in: All commodities</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                          <span>Price Range: $3.00 - $4.20/kg</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Truck className="h-4 w-4 mr-2 text-orange-600" />
                          <span>Ships to: Global markets</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" className="flex-1" onClick={() => contactExporter('EST-2024-008')}>
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}