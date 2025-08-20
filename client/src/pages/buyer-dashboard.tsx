import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle,
  XCircle, 
  AlertTriangle, 
  BarChart3,
  Settings,
  LogOut,
  DollarSign,
  Truck,
  Clock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation, Link } from "wouter";
import { SoftCommodityPricing } from '@/components/SoftCommodityPricing';

export default function BuyerDashboard() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Get buyer info from localStorage
  const buyerId = localStorage.getItem("buyerId") || "BUY-2024-001";
  const buyerName = localStorage.getItem("buyerName") || "ABC Trading Company";

  // Fetch buyer-specific data
  const { data: purchaseOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/buyer/purchase-orders'],
    queryFn: () => apiRequest('/api/buyer/purchase-orders'),
  });

  const { data: commodityPrices, isLoading: pricesLoading } = useQuery({
    queryKey: ['/api/buyer/commodity-prices'],
    queryFn: () => apiRequest('/api/buyer/commodity-prices'),
  });

  const { data: farmerContracts, isLoading: contractsLoading } = useQuery({
    queryKey: ['/api/buyer/farmer-contracts'],
    queryFn: () => apiRequest('/api/buyer/farmer-contracts'),
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('buyerId');
    localStorage.removeItem('buyerName');
    localStorage.removeItem('userType');
    navigate('/farmer-login');
  };

  // Mock buyer data for demonstration
  const mockBuyerMetrics = {
    totalOrders: 156,
    pendingOrders: 23,
    completedOrders: 133,
    totalSpent: 2450000,
    activeContracts: 45,
    averageOrderValue: 15700
  };

  const mockOrders = [
    {
      id: "ORD-001",
      farmerId: "FRM-2024-001",
      commodity: "Cocoa Beans",
      quantity: "500 kg",
      price: "$2,500",
      status: "Pending Delivery",
      orderDate: "2025-08-15",
      deliveryDate: "2025-08-20"
    },
    {
      id: "ORD-002", 
      farmerId: "FRM-2024-002",
      commodity: "Coffee Beans",
      quantity: "300 kg",
      price: "$1,800",
      status: "In Transit",
      orderDate: "2025-08-12",
      deliveryDate: "2025-08-18"
    },
    {
      id: "ORD-003",
      farmerId: "FRM-2024-003", 
      commodity: "Palm Oil",
      quantity: "200L",
      price: "$800",
      status: "Delivered",
      orderDate: "2025-08-10",
      deliveryDate: "2025-08-16"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Buyer Portal</h1>
                <p className="text-sm text-slate-600">Welcome back, {buyerName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/polipus" className="text-slate-600 hover:text-slate-900">
                <Button variant="outline" size="sm">
                  Back to Polipus
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="contracts">Farmer Contracts</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="pricing">LACRA Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Orders</p>
                      <p className="text-3xl font-bold text-blue-900">{mockBuyerMetrics.totalOrders}</p>
                      <p className="text-xs text-blue-600 mt-1">All time orders</p>
                    </div>
                    <ShoppingCart className="h-12 w-12 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Pending Orders</p>
                      <p className="text-3xl font-bold text-green-900">{mockBuyerMetrics.pendingOrders}</p>
                      <p className="text-xs text-green-600 mt-1">Awaiting delivery</p>
                    </div>
                    <Clock className="h-12 w-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Total Spent</p>
                      <p className="text-3xl font-bold text-purple-900">${mockBuyerMetrics.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-purple-600 mt-1">This year</p>
                    </div>
                    <DollarSign className="h-12 w-12 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Recent Purchase Orders
                </CardTitle>
                <CardDescription>
                  Your latest commodity orders and delivery status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{order.commodity}</h4>
                          <p className="text-sm text-slate-600">Order {order.id} • {order.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{order.price}</p>
                        <Badge 
                          variant={order.status === "Delivered" ? "default" : 
                                  order.status === "In Transit" ? "secondary" : "outline"}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders Management</CardTitle>
                <CardDescription>Manage your commodity purchase orders and track deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{order.commodity}</h3>
                          <p className="text-slate-600">Order ID: {order.id}</p>
                        </div>
                        <Badge 
                          variant={order.status === "Delivered" ? "default" : 
                                  order.status === "In Transit" ? "secondary" : "outline"}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Farmer ID:</span>
                          <p className="text-slate-600">{order.farmerId}</p>
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span>
                          <p className="text-slate-600">{order.quantity}</p>
                        </div>
                        <div>
                          <span className="font-medium">Price:</span>
                          <p className="text-slate-600">{order.price}</p>
                        </div>
                        <div>
                          <span className="font-medium">Delivery:</span>
                          <p className="text-slate-600">{order.deliveryDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Contracts</CardTitle>
                <CardDescription>Manage contracts with registered farmers</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Contract management features are being developed. This will include seasonal contracts, 
                    pricing agreements, and quality specifications.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Track payment history and manage outstanding balances</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Payment processing features are being integrated. This will include payment history, 
                    outstanding balances, and automated payment scheduling.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  LACRA Official Commodity Pricing
                </CardTitle>
                <CardDescription>
                  Current official LACRA pricing with quality grades for purchase planning and negotiations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SoftCommodityPricing 
                  canEdit={false}
                  compact={false}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}