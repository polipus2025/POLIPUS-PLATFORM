import { useState, memo, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Calendar, DollarSign, Truck } from 'lucide-react';
import { Link } from 'wouter';
import CleanExporterLayout from '@/components/layout/clean-exporter-layout';
import { useQuery } from '@tanstack/react-query';

// ⚡ MEMOIZED ORDER COMPONENT FOR PERFORMANCE
const ExporterOrders = memo(() => {
  // ⚡ SUPER FAST USER DATA
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    staleTime: 300000, // 5 minutes for speed
    gcTime: 1800000, // 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  // ⚡ MEMOIZED ORDERS DATA - No recalculation
  const mockOrders = useMemo(() => [
    {
      id: 'ORD-2025-001',
      commodity: 'Cocoa Beans',
      quantity: '50 MT',
      buyer: 'European Chocolate Ltd.',
      status: 'Processing',
      orderDate: '2025-08-15',
      deliveryDate: '2025-09-01',
      value: '$192,500'
    },
    {
      id: 'ORD-2025-002',
      commodity: 'Coffee Beans',
      quantity: '25 MT',
      buyer: 'Global Coffee Corp',
      status: 'Shipped',
      orderDate: '2025-08-10',
      deliveryDate: '2025-08-25',
      value: '$97,500'
    },
    {
      id: 'ORD-2025-003',
      commodity: 'Palm Oil',
      quantity: '100 MT',
      buyer: 'Asia Food Industries',
      status: 'Pending',
      orderDate: '2025-08-18',
      deliveryDate: '2025-09-10',
      value: '$135,000'
    }
  ], []);

  // ⚡ MEMOIZED STATUS COLOR FUNCTION
  const getStatusColor = useMemo(() => {
    const statusColors = {
      'Shipped': 'bg-green-100 text-green-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return (status: string) => statusColors[status as keyof typeof statusColors] || statusColors.default;
  }, []);

  return (
    <CleanExporterLayout user={user}>
      <Helmet>
        <title>Export Orders - Exporter Portal</title>
        <meta name="description" content="Manage and track your export orders and shipments" />
      </Helmet>

      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Export Orders</h1>
                <p className="text-sm text-slate-600">Manage and track your export orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-900">3</p>
                </div>
                <Package className="h-12 w-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Shipped</p>
                  <p className="text-3xl font-bold text-green-900">1</p>
                </div>
                <Truck className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Processing</p>
                  <p className="text-3xl font-bold text-yellow-900">1</p>
                </div>
                <Calendar className="h-12 w-12 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-slate-200 hover:shadow-2xl transition-all group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Value</p>
                  <p className="text-3xl font-bold text-purple-900">$425K</p>
                </div>
                <DollarSign className="h-12 w-12 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="bg-white shadow-xl border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Recent Export Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <p className="text-gray-600">{order.commodity} - {order.quantity}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Buyer:</span>
                      <p className="font-medium">{order.buyer}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Order Date:</span>
                      <p className="font-medium">{order.orderDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Delivery:</span>
                      <p className="font-medium">{order.deliveryDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Value:</span>
                      <p className="font-medium text-green-600">{order.value}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Track Shipment</Button>
                    <Button size="sm" variant="outline">Download Invoice</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </CleanExporterLayout>
  );
});

ExporterOrders.displayName = 'ExporterOrders';
export default ExporterOrders;