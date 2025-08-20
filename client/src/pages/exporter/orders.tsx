import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Truck,
  MapPin,
  Calendar,
  User,
  Search,
  Filter,
  Eye,
  Download,
  MessageSquare
} from 'lucide-react';
import ExporterNavbar from '@/components/layout/exporter-navbar';

export default function ExporterOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Mock orders data with buyer information
  const orders = [
    {
      id: 'ORD-2025-001',
      buyerId: 'BYR-20250819-050',
      buyerCompany: 'Liberian Agricultural Trading Co.',
      buyerContact: 'John Pewee',
      commodity: 'Coffee',
      quantity: '500 MT',
      pricePerMT: '$2,800',
      totalValue: '$1,400,000',
      status: 'pending_approval',
      orderDate: '2025-01-22',
      deliveryDate: '2025-02-15',
      location: 'Lofa County',
      ddgotsOfficer: 'Sarah Konneh',
      portInspector: 'Michael Togba',
      complianceStatus: 'documentation_review',
      paymentStatus: 'deposit_received',
      documents: ['Purchase Order', 'Quality Certificate', 'EUDR Declaration']
    },
    {
      id: 'ORD-2025-002',
      buyerId: 'BYR-20250820-051',
      buyerCompany: 'West African Commodities Ltd.',
      buyerContact: 'Maria Santos',
      commodity: 'Cocoa',
      quantity: '300 MT',
      pricePerMT: '$3,200',
      totalValue: '$960,000',
      status: 'approved',
      orderDate: '2025-01-20',
      deliveryDate: '2025-02-10',
      location: 'Margibi County',
      ddgotsOfficer: 'James Wilson',
      portInspector: 'Grace Kumah',
      complianceStatus: 'approved',
      paymentStatus: 'payment_completed',
      documents: ['Purchase Order', 'Quality Certificate', 'EUDR Declaration', 'Export Permit']
    },
    {
      id: 'ORD-2025-003',
      buyerId: 'BYR-20250821-052',
      buyerCompany: 'Global Rubber Trading',
      buyerContact: 'Ahmed Hassan',
      commodity: 'Rubber',
      quantity: '800 MT',
      pricePerMT: '$1,500',
      totalValue: '$1,200,000',
      status: 'inspection_required',
      orderDate: '2025-01-18',
      deliveryDate: '2025-02-05',
      location: 'Bong County',
      ddgotsOfficer: 'Patricia Johnson',
      portInspector: 'Emmanuel Clarke',
      complianceStatus: 'inspection_scheduled',
      paymentStatus: 'deposit_received',
      documents: ['Purchase Order', 'Quality Certificate']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'inspection_required':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'documentation_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'inspection_scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.buyerCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Orders - Exporter Portal</title>
        <meta name="description" content="Manage your export orders and buyer transactions" />
      </Helmet>

      <ExporterNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="h-6 w-6 text-blue-600" />
            Export Orders
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your export orders with integrated buyer connections and DDGOTS compliance oversight
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by order ID, buyer company, or commodity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending_approval">Pending Approval</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="inspection_required">Inspection Required</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {order.id}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.buyerCompany}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {order.orderDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {order.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getComplianceColor(order.complianceStatus)}>
                      {order.complianceStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Commodity Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Commodity Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Type:</span> {order.commodity}</p>
                      <p><span className="text-gray-600">Quantity:</span> {order.quantity}</p>
                      <p><span className="text-gray-600">Price/MT:</span> {order.pricePerMT}</p>
                      <p><span className="text-gray-600 font-semibold">Total:</span> {order.totalValue}</p>
                    </div>
                  </div>

                  {/* Buyer Information */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Buyer Information</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">ID:</span> {order.buyerId}</p>
                      <p><span className="text-gray-600">Contact:</span> {order.buyerContact}</p>
                      <p><span className="text-gray-600">Payment:</span> 
                        <Badge variant="outline" className="ml-1 text-xs">
                          {order.paymentStatus.replace('_', ' ')}
                        </Badge>
                      </p>
                    </div>
                  </div>

                  {/* DDGOTS Oversight */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">DDGOTS Oversight</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-600">Officer:</span> {order.ddgotsOfficer}</p>
                      <p><span className="text-gray-600">Port Inspector:</span> {order.portInspector}</p>
                      <p><span className="text-gray-600">Delivery:</span> {order.deliveryDate}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Buyer
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Documents
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                {order.documents && order.documents.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
                    <div className="flex flex-wrap gap-2">
                      {order.documents.map((doc, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You haven\'t received any export orders yet. Check the marketplace to connect with buyers.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}