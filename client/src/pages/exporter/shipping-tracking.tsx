import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Ship, 
  Search, 
  MapPin, 
  Clock, 
  Package,
  Anchor,
  Globe,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Activity
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface ShipmentStatus {
  carrier: string;
  trackingNumber: string;
  status: string;
  location?: string;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  vesselInfo?: VesselInfo;
}

interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  eventType: string;
}

interface VesselInfo {
  name: string;
  imo: string;
  voyage: string;
  eta?: string;
}

export default function ShippingTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [trackingResults, setTrackingResults] = useState<ShipmentStatus[]>([]);

  // Get supported carriers
  const { data: carriersData } = useQuery({
    queryKey: ['/api/shipping/carriers'],
    retry: false,
  });

  // Track shipment mutation
  const trackShipmentMutation = useMutation({
    mutationFn: async (data: { carrier: string; trackingNumber: string }) => {
      return await apiRequest('/api/shipping/track', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setTrackingResults([data.data]);
      }
    },
  });

  // Multi-carrier tracking mutation
  const multiTrackMutation = useMutation({
    mutationFn: async (trackingNumber: string) => {
      return await apiRequest('/api/shipping/track-multi', {
        method: 'POST',
        body: JSON.stringify({ trackingNumber }),
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setTrackingResults(data.data.results);
      }
    },
  });

  // API health check
  const { data: healthData } = useQuery({
    queryKey: ['/api/shipping/health'],
    retry: false,
    refetchInterval: 60000, // Check every minute
  });

  const handleSingleCarrierTrack = () => {
    if (!trackingNumber || !selectedCarrier) return;
    
    trackShipmentMutation.mutate({
      carrier: selectedCarrier,
      trackingNumber
    });
  };

  const handleMultiCarrierTrack = () => {
    if (!trackingNumber) return;
    
    multiTrackMutation.mutate(trackingNumber);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered') || statusLower.includes('completed')) {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('transit') || statusLower.includes('shipping')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (statusLower.includes('pending') || statusLower.includes('processing')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (statusLower.includes('delayed') || statusLower.includes('error')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const carriers = carriersData?.data?.carriers || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping Tracking</h1>
            <p className="text-gray-600">Track shipments across major shipping lines</p>
          </div>
          
          {/* API Health Status */}
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              API Status: {healthData?.data?.summary || 'Checking...'}
            </span>
            {healthData?.data?.overall === 'healthy' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            )}
          </div>
        </div>

        {/* Supported Carriers Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="h-5 w-5 text-blue-600" />
              Integrated Shipping Lines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {carriers.map((carrier: any) => (
                <div key={carrier.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{carrier.name}</h3>
                    <Badge className={carrier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {carrier.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{carrier.description}</p>
                  <div className="text-xs text-gray-500">
                    Services: {carrier.services.slice(0, 2).join(', ')}
                    {carrier.services.length > 2 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tracking Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Track Shipment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Tracking Number
                </label>
                <Input
                  placeholder="Enter container/booking number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Shipping Line (Optional)
                </label>
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier: any) => (
                      <SelectItem key={carrier.id} value={carrier.id}>
                        {carrier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col justify-end space-y-2">
                <Button 
                  onClick={handleSingleCarrierTrack}
                  disabled={!trackingNumber || !selectedCarrier || trackShipmentMutation.isPending}
                  className="w-full"
                >
                  {trackShipmentMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Track Single Carrier
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleMultiCarrierTrack}
                  disabled={!trackingNumber || multiTrackMutation.isPending}
                  className="w-full"
                >
                  {multiTrackMutation.isPending ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Globe className="h-4 w-4 mr-2" />
                  )}
                  Search All Carriers
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {trackingResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tracking Results</h2>
            
            {trackingResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5 text-blue-600" />
                      {result.carrier} - {result.trackingNumber}
                    </CardTitle>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Current Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Current Location</p>
                        <p className="font-medium">{result.location || 'Unknown'}</p>
                      </div>
                    </div>
                    
                    {result.estimatedDelivery && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Estimated Delivery</p>
                          <p className="font-medium">{formatDate(result.estimatedDelivery)}</p>
                        </div>
                      </div>
                    )}
                    
                    {result.vesselInfo && (
                      <div className="flex items-center gap-3">
                        <Anchor className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Vessel</p>
                          <p className="font-medium">{result.vesselInfo.name}</p>
                          <p className="text-xs text-gray-500">Voyage: {result.vesselInfo.voyage}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tracking Events */}
                  {result.events && result.events.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                      <div className="space-y-3">
                        {result.events.map((event, eventIndex) => (
                          <div key={eventIndex} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">{event.description}</p>
                                <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
                              </div>
                              <p className="text-sm text-gray-600">{event.location}</p>
                              <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {event.eventType}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error Messages */}
        {(trackShipmentMutation.isError || multiTrackMutation.isError) && (
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>
                  {trackShipmentMutation.error?.message || multiTrackMutation.error?.message || 'Tracking failed'}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Help */}
        <Card>
          <CardHeader>
            <CardTitle>Tracking Help</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Supported Tracking Numbers</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Container Numbers (11 characters)</li>
                  <li>• Bill of Lading Numbers</li>
                  <li>• Booking References</li>
                  <li>• Shipment References</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Tracking Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Real-time container tracking</li>
                  <li>• Vessel information and schedules</li>
                  <li>• Event history and milestones</li>
                  <li>• ETA predictions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}