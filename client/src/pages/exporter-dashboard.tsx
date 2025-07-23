import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Package, 
  Ship, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Plus,
  Eye,
  FileText,
  Globe,
  Truck,
  Users,
  DollarSign
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function ExporterDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const { data: exportOrders = [] } = useQuery({
    queryKey: ['/api/export-orders'],
  });

  const { data: commodities = [] } = useQuery({
    queryKey: ['/api/commodities'],
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ['/api/farmers'],
  });

  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
  });

  // Dashboard metrics
  const pendingOrders = exportOrders.filter((order: any) => order.orderStatus === 'pending').length;
  const confirmedOrders = exportOrders.filter((order: any) => order.orderStatus === 'confirmed').length;
  const shippedOrders = exportOrders.filter((order: any) => order.orderStatus === 'shipped').length;
  const totalValue = exportOrders.reduce((sum: number, order: any) => sum + parseFloat(order.totalValue || 0), 0);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return await apiRequest('/api/export-orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/export-orders'] });
      setIsNewOrderOpen(false);
      toast({
        title: 'Export Order Created',
        description: 'New export order has been submitted for LACRA approval.',
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLacraApprovalColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Exporter Dashboard - AgriTrace360™</title>
        <meta name="description" content="Export management dashboard for licensed agricultural commodity exporters" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Ship className="h-8 w-8 text-blue-600" />
                Export Management Portal
              </h1>
              <p className="text-gray-600">
                Welcome back, {user?.firstName} {user?.lastName} - Licensed Exporter Dashboard
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Export License Status</p>
              <Badge className="bg-green-100 text-green-800">Active & Compliant</Badge>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Export Orders
            </TabsTrigger>
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Farmer Network
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              LACRA Compliance
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Logistics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Confirmed Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{confirmedOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Ship className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Shipped Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{shippedOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-emerald-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-6 w-6" />
                        <span className="text-sm">New Export Order</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create New Export Order</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Order Number</Label>
                            <Input placeholder="EXP-2025-001" />
                          </div>
                          <div>
                            <Label>Commodity</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select commodity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="coffee">Coffee</SelectItem>
                                <SelectItem value="cocoa">Cocoa</SelectItem>
                                <SelectItem value="rubber">Rubber</SelectItem>
                                <SelectItem value="palm_oil">Palm Oil</SelectItem>
                                <SelectItem value="rice">Rice</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>Quantity</Label>
                            <Input type="number" placeholder="1000" />
                          </div>
                          <div>
                            <Label>Unit</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">Kilograms</SelectItem>
                                <SelectItem value="tons">Tons</SelectItem>
                                <SelectItem value="bags">Bags</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Price per Unit ($)</Label>
                            <Input type="number" step="0.01" placeholder="2.50" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Destination Country</Label>
                            <Input placeholder="Germany" />
                          </div>
                          <div>
                            <Label>Destination Port</Label>
                            <Input placeholder="Hamburg" />
                          </div>
                        </div>
                        <div>
                          <Label>Expected Shipment Date</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Additional Notes</Label>
                          <Textarea placeholder="Special requirements or notes..." />
                        </div>
                        <Button onClick={() => createOrderMutation.mutate({})} className="w-full">
                          Submit Export Order for LACRA Approval
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">View Reports</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Globe className="h-6 w-6" />
                    <span className="text-sm">LACRA Integration</span>
                  </Button>

                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Truck className="h-6 w-6" />
                    <span className="text-sm">Track Shipments</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Export Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Export Orders Management</h2>
              <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Export Order
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Export Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order Number</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Commodity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Destination</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Order Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">LACRA Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exportOrders.map((order: any) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{order.orderNumber}</td>
                          <td className="py-3 px-4">{order.commodityType}</td>
                          <td className="py-3 px-4">{order.quantity} {order.unit}</td>
                          <td className="py-3 px-4">{order.destinationCountry}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(order.orderStatus)}>
                              {order.orderStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getLacraApprovalColor(order.lacraApprovalStatus)}>
                              {order.lacraApprovalStatus}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content would continue similarly... */}
          <TabsContent value="farmers">
            <Card>
              <CardHeader>
                <CardTitle>Farmer Network & Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect with verified farmers across Liberia for sourcing agricultural commodities.
                </p>
                {/* Farmer network content */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle>LACRA Compliance Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Monitor compliance status and regulatory requirements for export operations.
                </p>
                {/* Compliance content */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logistics">
            <Card>
              <CardHeader>
                <CardTitle>Logistics & Shipping Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Track shipments and manage logistics for export operations.
                </p>
                {/* Logistics content */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}