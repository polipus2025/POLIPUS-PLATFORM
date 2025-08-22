import { memo, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Ship, MapPin, Clock, Package, Truck, Search } from 'lucide-react';
import { Link } from 'wouter';

const ExporterShipments = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');

  const shipments = useMemo(() => [
    {
      id: 'SHIP-2025-001',
      trackingNumber: 'MAEU123456789',
      commodity: 'Cocoa Beans',
      quantity: '50 MT',
      buyer: 'European Chocolate Ltd.',
      origin: 'Port of Monrovia',
      destination: 'Port of Antwerp',
      status: 'In Transit',
      departureDate: '2025-08-18',
      estimatedArrival: '2025-09-02',
      carrier: 'Maersk Line',
      vessel: 'Maersk Shanghai',
      container: 'MSKU7654321'
    },
    {
      id: 'SHIP-2025-002',
      trackingNumber: 'MSCU987654321',
      commodity: 'Coffee Beans',
      quantity: '25 MT',
      buyer: 'Global Coffee Corp',
      origin: 'Port of Monrovia',
      destination: 'Port of Long Beach',
      status: 'Loading',
      departureDate: '2025-08-25',
      estimatedArrival: '2025-09-10',
      carrier: 'MSC',
      vessel: 'MSC Lucinda',
      container: 'MSCU1234567'
    },
    {
      id: 'SHIP-2025-003',
      trackingNumber: 'CMAU456789123',
      commodity: 'Palm Oil',
      quantity: '100 MT',
      buyer: 'Asia Food Industries',
      origin: 'Port of Monrovia',
      destination: 'Port of Singapore',
      status: 'Delivered',
      departureDate: '2025-07-15',
      estimatedArrival: '2025-08-01',
      carrier: 'CMA CGM',
      vessel: 'CMA CGM Marco Polo',
      container: 'CMAU9876543'
    }
  ], []);

  const filteredShipments = useMemo(() =>
    shipments.filter(shipment =>
      shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.buyer.toLowerCase().includes(searchTerm.toLowerCase())
    ), [shipments, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Loading': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return Package;
      case 'In Transit': return Ship;
      case 'Loading': return Truck;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Helmet>
        <title>Shipment Tracking - Exporter Portal</title>
        <meta name="description" content="Track your export shipments in real-time" />
      </Helmet>

      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/exporter-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Ship className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Shipment Tracking</h1>
                <p className="text-sm text-slate-600">Monitor your exports in real-time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Statistics */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Active Shipments</p>
                    <p className="text-3xl font-bold text-blue-900">2</p>
                  </div>
                  <Ship className="h-12 w-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Delivered</p>
                    <p className="text-3xl font-bold text-green-900">1</p>
                  </div>
                  <Package className="h-12 w-12 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Volume</p>
                    <p className="text-3xl font-bold text-purple-900">175 MT</p>
                  </div>
                  <Truck className="h-12 w-12 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">On-Time Rate</p>
                    <p className="text-3xl font-bold text-orange-900">98%</p>
                  </div>
                  <Clock className="h-12 w-12 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Shipments List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-blue-600" />
              Shipment Tracking ({filteredShipments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredShipments.map((shipment) => {
                const StatusIcon = getStatusIcon(shipment.status);
                return (
                  <div key={shipment.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{shipment.id}</h3>
                        <p className="text-gray-600">{shipment.commodity} - {shipment.quantity}</p>
                        <p className="text-sm text-gray-500">Tracking: {shipment.trackingNumber}</p>
                      </div>
                      <Badge className={getStatusColor(shipment.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {shipment.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Route Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>From: {shipment.origin}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>To: {shipment.destination}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span>Buyer: {shipment.buyer}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Details</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Carrier:</span> {shipment.carrier}</p>
                          <p><span className="text-gray-500">Vessel:</span> {shipment.vessel}</p>
                          <p><span className="text-gray-500">Container:</span> {shipment.container}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Departed:</span> {shipment.departureDate}</p>
                          <p><span className="text-gray-500">Est. Arrival:</span> {shipment.estimatedArrival}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Track Live</Button>
                      <Button size="sm" variant="outline">View Documents</Button>
                      <Button size="sm" variant="outline">Contact Carrier</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

ExporterShipments.displayName = 'ExporterShipments';
export default ExporterShipments;