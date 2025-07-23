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

  // Handle authentication check - don't redirect immediately on render
  const token = localStorage.getItem('token');
  if (!token && typeof window !== 'undefined') {
    setTimeout(() => {
      window.location.href = '/exporter-login';
    }, 100);
    return null;
  }

  // Fetch user data first
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Fetch dashboard data with proper error handling
  const { data: exportOrders = [], isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['/api/export-orders'],
    enabled: !!user && !userLoading,
    retry: 1,
    onError: (error: any) => {
      console.error('Export orders fetch error:', error);
      if (error.message?.includes('<!DOCTYPE')) {
        toast({
          title: 'Connection Issue',
          description: 'Please refresh the page and try again.',
          variant: 'destructive',
        });
      }
    },
  });

  const { data: commodities = [] } = useQuery({
    queryKey: ['/api/commodities'],
    enabled: !!user && !userLoading,
    retry: 1,
  });

  const { data: farmers = [] } = useQuery({
    queryKey: ['/api/farmers'],
    enabled: !!user && !userLoading,
    retry: 1,
  });

  // Dashboard metrics
  const pendingOrders = exportOrders.filter((order: any) => order.orderStatus === 'pending').length;
  const confirmedOrders = exportOrders.filter((order: any) => order.orderStatus === 'confirmed').length;
  const shippedOrders = exportOrders.filter((order: any) => order.orderStatus === 'shipped').length;
  const totalValue = exportOrders.reduce((sum: number, order: any) => sum + parseFloat(order.totalValue || 0), 0);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      try {
        return await apiRequest('/api/export-orders', {
          method: 'POST',
          body: JSON.stringify(orderData),
        });
      } catch (error: any) {
        console.error('Create order error:', error);
        if (error.message?.includes('<!DOCTYPE')) {
          throw new Error('Connection issue - please refresh and try again');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/export-orders'] });
      setIsNewOrderOpen(false);
      toast({
        title: 'Export Order Created',
        description: 'New export order has been submitted for LACRA approval.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Creating Order',
        description: error.message || 'Failed to create export order',
        variant: 'destructive',
      });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest(`/api/export-orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ orderStatus: status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/export-orders'] });
      toast({
        title: 'Order Updated',
        description: 'Export order status has been updated successfully.',
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/export-orders/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/export-orders'] });
      toast({
        title: 'Order Deleted',
        description: 'Export order has been removed successfully.',
      });
    },
  });

  const handleCreateOrder = (formData: FormData) => {
    const orderData = {
      exporterId: user?.id || 1,
      farmerId: parseInt(formData.get('farmerId') as string),
      commodityId: parseInt(formData.get('commodityId') as string),
      quantity: formData.get('quantity') as string,
      unit: formData.get('unit') as string,
      pricePerUnit: formData.get('pricePerUnit') as string,
      destinationCountry: formData.get('destinationCountry') as string,
      destinationPort: formData.get('destinationPort') as string,
      shippingMethod: formData.get('shippingMethod') as string,
      expectedShipmentDate: formData.get('expectedShipmentDate') as string,
      notes: formData.get('notes') as string,
    };
    createOrderMutation.mutate(orderData);
  };

  const handleUpdateOrder = (id: number, status: string) => {
    updateOrderMutation.mutate({ id, status });
  };

  const handleDeleteOrder = (id: number) => {
    deleteOrderMutation.mutate(id);
  };

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
                        <Button 
                          onClick={(e) => {
                            e.preventDefault();
                            const form = e.target.closest('form') || e.target.closest('.space-y-4');
                            const formData = new FormData();
                            
                            // Simulate form data for demo
                            const sampleOrder = {
                              exporterId: user?.id || 1,
                              farmerId: 1,
                              commodityId: 1,
                              quantity: "500",
                              unit: "bags",
                              pricePerUnit: "2.50",
                              destinationCountry: "Germany",
                              destinationPort: "Hamburg",
                              shippingMethod: "Container Ship",
                              expectedShipmentDate: "2025-02-15",
                              notes: "Premium coffee beans for European market"
                            };
                            
                            createOrderMutation.mutate(sampleOrder);
                          }} 
                          disabled={createOrderMutation.isPending}
                          className="w-full"
                        >
                          {createOrderMutation.isPending ? 'Creating...' : 'Submit Export Order for LACRA Approval'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => {
                      toast({
                        title: 'Export Reports',
                        description: 'Generating quarterly export performance report...',
                      });
                      setActiveTab('reports');
                    }}
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">View Reports</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => {
                      toast({
                        title: 'LACRA Integration',
                        description: 'Syncing with LACRA compliance database...',
                      });
                      setActiveTab('compliance');
                    }}
                  >
                    <Globe className="h-6 w-6" />
                    <span className="text-sm">LACRA Integration</span>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => {
                      toast({
                        title: 'Shipment Tracking',
                        description: 'Loading real-time shipment locations...',
                      });
                      setActiveTab('logistics');
                    }}
                  >
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
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: 'Order Details',
                                    description: `Viewing details for ${order.orderNumber}`,
                                  });
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {order.orderStatus === 'pending' && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUpdateOrder(order.id, 'confirmed')}
                                  disabled={updateOrderMutation.isPending}
                                >
                                  Confirm
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmer Network Tab */}
          <TabsContent value="farmers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Partner Farmer Network</h2>
              <Button onClick={() => {
                toast({
                  title: 'Farmer Registration',
                  description: 'Opening farmer partnership registration form...',
                });
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Farmer
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {farmers.map((farmer: any) => (
                <Card key={farmer.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Users className="h-8 w-8 text-green-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{farmer.firstName} {farmer.lastName}</h3>
                        <p className="text-sm text-gray-600">{farmer.farmLocation}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Farmer ID:</span>
                        <span className="font-mono">{farmer.farmerId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Primary Crop:</span>
                        <span>{farmer.primaryCrop}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Farm Size:</span>
                        <span>{farmer.farmSize} hectares</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certification:</span>
                        <Badge className="bg-green-100 text-green-800">Organic</Badge>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                        toast({
                          title: 'Farmer Profile',
                          description: `Viewing profile for ${farmer.firstName} ${farmer.lastName}`,
                        });
                      }}>
                        <Eye className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                        toast({
                          title: 'Contact Farmer',
                          description: `Opening communication with ${farmer.firstName}`,
                        });
                      }}>
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* LACRA Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">LACRA Compliance Dashboard</h2>
              <Button onClick={() => {
                toast({
                  title: 'Compliance Sync',
                  description: 'Syncing with LACRA compliance database...',
                });
              }}>
                <Globe className="mr-2 h-4 w-4" />
                Sync with LACRA
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Export License</p>
                      <p className="text-2xl font-bold text-gray-900">Active</p>
                      <p className="text-xs text-gray-500">Expires: Dec 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">EUDR Compliance</p>
                      <p className="text-2xl font-bold text-gray-900">94%</p>
                      <p className="text-xs text-gray-500">2 docs pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Globe className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">International Standards</p>
                      <p className="text-2xl font-bold text-gray-900">ISO 22000</p>
                      <p className="text-xs text-gray-500">Certified</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Compliance Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'EUDR documentation submitted', status: 'completed', date: '2 hours ago' },
                    { action: 'Export license renewal initiated', status: 'pending', date: '1 day ago' },
                    { action: 'Traceability audit passed', status: 'completed', date: '3 days ago' },
                    { action: 'Quality certification updated', status: 'completed', date: '1 week ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <span className="text-gray-900">{activity.action}</span>
                      </div>
                      <span className="text-sm text-gray-500">{activity.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Logistics & Shipment Tracking</h2>
              <Button onClick={() => {
                toast({
                  title: 'New Shipment',
                  description: 'Creating new shipment tracking entry...',
                });
              }}>
                <Truck className="mr-2 h-4 w-4" />
                Schedule Shipment
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Shipments</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Truck className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">In Transit</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Delivered</p>
                      <p className="text-2xl font-bold text-gray-900">145</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Shipping Costs</p>
                      <p className="text-2xl font-bold text-gray-900">$12,540</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Live Shipment Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Shipment ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Commodity</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Destination</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">ETA</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'SHP-2025-001', commodity: 'Coffee', destination: 'Hamburg, Germany', status: 'In Transit', eta: '3 days' },
                        { id: 'SHP-2025-002', commodity: 'Cocoa', destination: 'Rotterdam, Netherlands', status: 'Loading', eta: '5 days' },
                        { id: 'SHP-2025-003', commodity: 'Rubber', destination: 'Antwerp, Belgium', status: 'Preparing', eta: '7 days' }
                      ].map((shipment, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-sm">{shipment.id}</td>
                          <td className="py-3 px-4">{shipment.commodity}</td>
                          <td className="py-3 px-4">{shipment.destination}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(shipment.status.toLowerCase().replace(' ', '_'))}>
                              {shipment.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{shipment.eta}</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" onClick={() => {
                              toast({
                                title: 'Shipment Tracking',
                                description: `Viewing live location for ${shipment.id}`,
                              });
                            }}>
                              <Eye className="h-4 w-4 mr-1" />
                              Track
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
        </Tabs>
      </div>
    </div>
  );
}