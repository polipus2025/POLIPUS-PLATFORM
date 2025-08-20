import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package,
  Search,
  Filter,
  Eye,
  Navigation,
  Anchor,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Route
} from 'lucide-react';
import ExporterNavbar from '@/components/layout/exporter-navbar';

export default function ExporterShipments() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
  });

  // Mock shipments data
  const shipments = [
    {
      id: 'SHIP-2025-001',
      orderId: 'ORD-2025-001',
      commodity: 'Coffee',
      quantity: '500 MT',
      destination: 'Hamburg, Germany',
      departure: 'Port of Monrovia',
      status: 'in_transit',
      departureDate: '2025-01-20',
      estimatedArrival: '2025-02-15',
      vessel: 'MV Atlantic Trader',
      vesselIMO: 'IMO-9876543',
      trackingNumber: 'TRK-2025-001',
      portInspector: 'Michael Togba',
      containerNumbers: ['CONT-001-2025', 'CONT-002-2025'],
      currentLocation: '15°N, 20°W - Atlantic Ocean',
      progressPercentage: 45
    },
    {
      id: 'SHIP-2025-002',
      orderId: 'ORD-2025-002',
      commodity: 'Cocoa',
      quantity: '300 MT',
      destination: 'New York, USA',
      departure: 'Port of Monrovia',
      status: 'preparing',
      departureDate: '2025-01-25',
      estimatedArrival: '2025-02-18',
      vessel: 'MV Caribbean Express',
      vesselIMO: 'IMO-1234567',
      trackingNumber: 'TRK-2025-002',
      portInspector: 'Grace Kumah',
      containerNumbers: ['CONT-003-2025'],
      currentLocation: 'Port of Monrovia - Dock 3',
      progressPercentage: 10
    },
    {
      id: 'SHIP-2025-003',
      orderId: 'ORD-2025-003',
      commodity: 'Rubber',
      quantity: '800 MT',
      destination: 'Singapore',
      departure: 'Port of Buchanan',
      status: 'delivered',
      departureDate: '2025-01-05',
      estimatedArrival: '2025-01-28',
      actualArrival: '2025-01-27',
      vessel: 'MV Asia Bridge',
      vesselIMO: 'IMO-5678901',
      trackingNumber: 'TRK-2025-003',
      portInspector: 'Emmanuel Clarke',
      containerNumbers: ['CONT-004-2025', 'CONT-005-2025', 'CONT-006-2025'],
      currentLocation: 'Singapore Port - Delivered',
      progressPercentage: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      case 'in_transit':
        return <Navigation className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'delayed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Shipments - Exporter Portal</title>
        <meta name="description" content="Track your export shipments and delivery status" />
      </Helmet>

      <ExporterNavbar user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Truck className="h-6 w-6 text-blue-600" />
            Shipment Tracking
          </h1>
          <p className="text-gray-600 mt-2">
            Track your export shipments with real-time location updates and delivery status
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Transit</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {shipments.filter(s => s.status === 'in_transit').length}
                  </p>
                </div>
                <Navigation className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {shipments.filter(s => s.status === 'preparing').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {shipments.filter(s => s.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Shipments</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {shipments.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>

        {/* Shipments Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredShipments.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {shipment.id} - {shipment.commodity}
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {shipment.quantity}
                      </span>
                      <span className="flex items-center gap-1">
                        <Route className="h-4 w-4" />
                        {shipment.departure} → {shipment.destination}
                      </span>
                      <span className="flex items-center gap-1">
                        <Anchor className="h-4 w-4" />
                        {shipment.vessel}
                      </span>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(shipment.status)} flex items-center gap-1`}>
                    {getStatusIcon(shipment.status)}
                    {shipment.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Shipment Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Shipment Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Order ID:</span> {shipment.orderId}</p>
                      <p><span className="text-gray-600">Tracking:</span> {shipment.trackingNumber}</p>
                      <p><span className="text-gray-600">Vessel IMO:</span> {shipment.vesselIMO}</p>
                      <p><span className="text-gray-600">Inspector:</span> {shipment.portInspector}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-600">Departure:</span> {shipment.departureDate}</p>
                      <p><span className="text-gray-600">Est. Arrival:</span> {shipment.estimatedArrival}</p>
                      {shipment.actualArrival && (
                        <p><span className="text-gray-600">Actual Arrival:</span> {shipment.actualArrival}</p>
                      )}
                    </div>
                  </div>

                  {/* Current Status */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Current Location</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>{shipment.currentLocation}</span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${shipment.progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">{shipment.progressPercentage}% Complete</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                    <div className="space-y-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Navigation className="h-4 w-4 mr-2" />
                        Track Live
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        View Timeline
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Container Information */}
                {shipment.containerNumbers && shipment.containerNumbers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Container Numbers</h4>
                    <div className="flex flex-wrap gap-2">
                      {shipment.containerNumbers.map((container, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {container}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredShipments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Shipments Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'You don\'t have any shipments yet. Shipments will appear here after orders are processed and shipped.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}