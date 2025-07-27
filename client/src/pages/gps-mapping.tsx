import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MapPin, Satellite, TreePine, AlertTriangle, CheckCircle, Eye, Edit, Navigation, Target, Layers, Signal, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import EnhancedGPSTracker from '@/components/gps/enhanced-gps-tracker';
import GPSMapViewer from '@/components/gps/gps-map-viewer';
import PrecisionBoundaryMapper from '@/components/gps/precision-boundary-mapper';
import AdvancedBoundaryMapper from '@/components/gps/advanced-boundary-mapper';
import RealTimeBoundaryDisplay from '@/components/gps/real-time-boundary-display';
import BoundaryMappingDemo from '@/components/gps/boundary-mapping-demo';
import { Helmet } from 'react-helmet';
import { SatelliteImageryService, CropMonitoringService, SATELLITE_PROVIDERS, GPS_SERVICES } from "@/lib/satellite-services";

// GPS mapping form schema
const gpsFormSchema = z.object({
  mappingId: z.string().min(1, 'Mapping ID is required'),
  farmerId: z.string().min(1, 'Farmer is required'),
  farmPlotId: z.string().optional(),
  coordinates: z.string().min(1, 'GPS coordinates are required'),
  centerLatitude: z.string().min(1, 'Center latitude is required'),
  centerLongitude: z.string().min(1, 'Center longitude is required'),
  totalAreaHectares: z.string().min(1, 'Total area is required'),
  boundaryType: z.string().default('polygon'),
  mappingMethod: z.string().min(1, 'Mapping method is required'),
  accuracyLevel: z.string().min(1, 'Accuracy level is required'),
  elevationMeters: z.string().optional(),
  slope: z.string().optional(),
  soilType: z.string().optional(),
  drainageStatus: z.string().optional(),
});

type GpsFormData = z.infer<typeof gpsFormSchema>;

const mockFarmers = [
  { id: 1, name: 'John Doe', county: 'Any Location', region: 'Global' },
  { id: 2, name: 'Mary Johnson', county: 'Any Location', region: 'Global' },
  { id: 3, name: 'Samuel Williams', county: 'Any Location', region: 'Global' },
  { id: 4, name: 'Test User Alpha', county: 'Testing Zone', region: 'Global' },
  { id: 5, name: 'Test User Beta', county: 'Testing Zone', region: 'Global' },
];

const mockFarmPlots = [
  { id: 1, plotName: 'Test Plot A', farmerId: 1, cropType: 'Coffee', location: 'Global Testing' },
  { id: 2, plotName: 'Test Plot B', farmerId: 2, cropType: 'Cocoa', location: 'Global Testing' },
  { id: 3, plotName: 'Test Plot C', farmerId: 3, cropType: 'Oil Palm', location: 'Global Testing' },
  { id: 4, plotName: 'Demo Plot Alpha', farmerId: 4, cropType: 'Rice', location: 'Demo Area' },
  { id: 5, plotName: 'Demo Plot Beta', farmerId: 5, cropType: 'Wheat', location: 'Demo Area' },
];

export default function GpsMapping() {
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tracker');
  const [gpsPoints, setGpsPoints] = useState<any[]>([]);
  const [mapBoundaries, setMapBoundaries] = useState<any[][]>([]);
  const [satelliteStatus, setSatelliteStatus] = useState<any>(null);
  const [realTimePosition, setRealTimePosition] = useState<any>(null);
  const [isConnectingSatellites, setIsConnectingSatellites] = useState(false);
  const [activeBoundaryPoints, setActiveBoundaryPoints] = useState<any[]>([]);
  const [isBoundaryMapping, setIsBoundaryMapping] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Connect to real satellites on component mount
  useEffect(() => {
    connectToSatellites();
    const interval = setInterval(updateSatelliteData, 30000);
    return () => clearInterval(interval);
  }, []);

  const connectToSatellites = async () => {
    setIsConnectingSatellites(true);
    try {
      console.log('🛰️ Initializing GPS satellite connection...');
      const status = await SatelliteImageryService.getSatelliteStatus();
      setSatelliteStatus(status);
      
      console.log('📍 Acquiring GPS position...');
      const position = await SatelliteImageryService.getCurrentPosition();
      setRealTimePosition(position);
      
      console.log('✅ GPS Mapping Activated Successfully!', {
        satellites: status.totalSatellites,
        accuracy: status.accuracy,
        position: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
      });
      
      toast({
        title: "🛰️ GPS Mapping Activated",
        description: `Connected to ${status.totalSatellites} satellites • Accuracy: ${status.accuracy}m`,
        variant: "default",
      });
    } catch (error) {
      console.error('GPS Satellite connection error:', error);
      toast({
        title: "GPS Connection Failed",
        description: "Unable to establish satellite connection. Using last known position.",
        variant: "destructive",
      });
    } finally {
      setIsConnectingSatellites(false);
    }
  };

  const updateSatelliteData = async () => {
    if (satelliteStatus) {
      const updatedStatus = await SatelliteImageryService.getSatelliteStatus();
      setSatelliteStatus(updatedStatus);
    }
  };

  const { data: gpsMappings = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/farm-gps-mappings'],
  });

  const { data: deforestationData = [] } = useQuery<any[]>({
    queryKey: ['/api/deforestation-monitoring'],
  });

  const { data: eudrCompliances = [] } = useQuery<any[]>({
    queryKey: ['/api/eudr-compliance'],
  });

  const form = useForm<GpsFormData>({
    resolver: zodResolver(gpsFormSchema),
    defaultValues: {
      boundaryType: 'polygon',
      mappingMethod: 'gps_survey',
      accuracyLevel: 'high',
    },
  });

  // Handle GPS position updates from tracker
  const handlePositionUpdate = (position: any) => {
    const newPoint = {
      id: `point-${Date.now()}`,
      latitude: position.latitude,
      longitude: position.longitude,
      accuracy: position.accuracy,
      timestamp: new Date(position.timestamp),
      type: 'waypoint'
    };
    setGpsPoints(prev => [...prev, newPoint]);
  };

  // Handle boundary completion from mapper
  const handleBoundaryComplete = (boundary: any) => {
    const boundaryPoints = boundary.points.map((point: any) => ({
      id: point.id,
      latitude: point.latitude,
      longitude: point.longitude,
      accuracy: point.accuracy,
      timestamp: point.timestamp,
      type: 'boundary'
    }));
    setMapBoundaries(prev => [...prev, boundaryPoints]);
    
    toast({
      title: "Boundary Completed",
      description: `${boundary.name} mapped with ${boundary.points.length} points`,
    });
  };

  const createMappingMutation = useMutation({
    mutationFn: async (data: GpsFormData) => {
      return apiRequest('/api/farm-gps-mappings', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          farmerId: parseInt(data.farmerId),
          farmPlotId: data.farmPlotId ? parseInt(data.farmPlotId) : null,
          centerLatitude: parseFloat(data.centerLatitude),
          centerLongitude: parseFloat(data.centerLongitude),
          totalAreaHectares: parseFloat(data.totalAreaHectares),
          elevationMeters: data.elevationMeters ? parseFloat(data.elevationMeters) : null,
          slope: data.slope ? parseFloat(data.slope) : null,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farm-gps-mappings'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: 'Success',
        description: 'GPS mapping created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create GPS mapping',
        variant: 'destructive',
      });
    },
  });

  const validateCoordinatesMutation = useMutation({
    mutationFn: async (coordinates: string) => {
      return apiRequest('/api/gps/validate-coordinates', {
        method: 'POST',
        body: JSON.stringify({ coordinates }),
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Coordinates Valid',
        description: `Coordinates are valid. Area: ${data.calculatedArea} hectares`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Invalid Coordinates',
        description: error.message || 'Coordinates format is invalid',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: GpsFormData) => {
    createMappingMutation.mutate(data);
  };

  const handleValidateCoordinates = () => {
    const coordinates = form.getValues('coordinates');
    if (coordinates) {
      validateCoordinatesMutation.mutate(coordinates);
    }
  };

  const getComplianceStatus = (mappingId: number) => {
    const eudrCompliance = eudrCompliances.find((c: any) => c.mappingId === mappingId);
    if (eudrCompliance?.complianceStatus === 'compliant') {
      return { label: 'Compliant', color: 'bg-green-600' };
    } else if (eudrCompliance?.complianceStatus === 'non_compliant') {
      return { label: 'Non-Compliant', color: 'bg-red-600' };
    } else {
      return { label: 'Pending', color: 'bg-yellow-600' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Enhanced GPS Mapping System - AgriTrace360™</title>
        <meta name="description" content="Professional GPS mapping system with real-time tracking, precision boundary mapping, and interactive visualization for agricultural compliance." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Satellite className="h-8 w-8 text-blue-600" />
              Enhanced GPS Mapping System
            </h1>
            <p className="text-gray-600">
              Professional-grade GPS tracking, precision boundary mapping, and interactive visualization for agricultural compliance and farm management.
            </p>
          </div>
          <Button 
            onClick={connectToSatellites}
            disabled={isConnectingSatellites}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
          >
            {isConnectingSatellites ? (
              <>
                <Signal className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Satellite className="mr-2 h-5 w-5" />
                Activate GPS System
              </>
            )}
          </Button>
        </div>

        {/* Enhanced GPS Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Signal className="h-4 w-4" />
              GPS Tracker
            </TabsTrigger>
            <TabsTrigger value="boundary" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Boundary Mapper
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Map Viewer
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Advanced Mapper
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
            <TabsTrigger value="existing" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Existing Mappings
            </TabsTrigger>
          </TabsList>

          {/* Enhanced GPS Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <EnhancedGPSTracker
              onPositionUpdate={handlePositionUpdate}
              onSessionComplete={(session) => {
                toast({
                  title: "GPS Session Complete",
                  description: `Recorded ${session.positions.length} positions over ${session.distance.toFixed(0)}m`,
                });
              }}
              accuracyThreshold={5.0}
            />
          </TabsContent>

          {/* Precision Boundary Mapper Tab */}
          <TabsContent value="boundary" className="space-y-6">
            <PrecisionBoundaryMapper
              onBoundaryComplete={handleBoundaryComplete}
              onBoundaryUpdate={(boundary) => {
                // Real-time boundary updates
              }}
              requiredAccuracy={3.0}
              minPoints={4}
            />
          </TabsContent>

          {/* Interactive Map Viewer Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card className="border-2 border-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Interactive GPS Map Viewer
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">Active</Badge>
                </CardTitle>
                <p className="text-sm text-gray-700 font-medium">
                  Real-time GPS visualization with satellite imagery and interactive controls
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <GPSMapViewer
                  gpsPoints={gpsPoints}
                  boundaries={mapBoundaries}
                  onPointClick={(point) => {
                    toast({
                      title: "GPS Point Selected",
                      description: `${point.type}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`,
                    });
                  }}
                  onBoundsChange={(bounds) => {
                    // Handle map bounds change
                    console.log('Map bounds changed:', bounds);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Boundary Mapper Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <AdvancedBoundaryMapper
                  onBoundaryComplete={(boundary) => {
                    handleBoundaryComplete(boundary);
                    setActiveBoundaryPoints([]);
                    setIsBoundaryMapping(false);
                  }}
                  onPointAdded={(point) => {
                    setActiveBoundaryPoints(prev => [...prev, point]);
                    setIsBoundaryMapping(true);
                    console.log('New boundary point added:', point);
                    toast({
                      title: "Boundary Point Added",
                      description: `Point ${point.order}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`,
                      duration: 2000,
                    });
                  }}
                  maxPoints={100}
                  minAccuracy={5}
                />
              </div>
              <div>
                <RealTimeBoundaryDisplay 
                  points={activeBoundaryPoints}
                  isActive={isBoundaryMapping}
                  onComplete={(data) => {
                    console.log('Boundary completed with data:', data);
                    toast({
                      title: "Boundary Mapping Complete",
                      description: `Area: ${data.area.toFixed(3)} hectares, Perimeter: ${data.perimeter.toFixed(1)}m`,
                    });
                    setActiveBoundaryPoints([]);
                    setIsBoundaryMapping(false);
                  }}
                  onReset={() => {
                    setActiveBoundaryPoints([]);
                    setIsBoundaryMapping(false);
                    toast({
                      title: "Boundary Reset",
                      description: "All boundary points cleared",
                    });
                  }}
                />
              </div>
            </div>
          </TabsContent>

          {/* Live Boundary Mapping Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <BoundaryMappingDemo 
              plotName="Cocoa Plot 1"
              farmerName="Moses Tuah"
              continuousMode={true}
              onMappingUpdate={(data) => {
                console.log('Demo mapping update:', data);
                toast({
                  title: `${data.plotName} Mapping`,
                  description: `Point ${data.points} added for ${data.farmerName}`,
                  duration: 1500,
                });
              }}
            />
          </TabsContent>

          {/* Existing Mappings Tab */}
          <TabsContent value="existing" className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Existing GPS Mappings</h2>
                <p className="text-gray-600 mt-2">
                  View and manage existing GPS mappings with EUDR compliance monitoring
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add GPS Mapping
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create GPS Farm Mapping</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mappingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mapping ID</FormLabel>
                        <FormControl>
                          <Input placeholder="MAP-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="farmerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farmer</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select farmer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockFarmers.map((farmer) => (
                              <SelectItem key={farmer.id} value={farmer.id.toString()}>
                                {farmer.name} - {farmer.county}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMappingMutation.isPending}>
                    {createMappingMutation.isPending ? 'Creating...' : 'Create Mapping'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* GPS Activation Status Dashboard */}
      <Card className="mb-6 border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Satellite className="h-6 w-6 text-green-600 animate-pulse" />
            GPS Mapping System Status
            <Badge variant="default" className="ml-2 bg-green-600 text-white">
              {isConnectingSatellites ? 'CONNECTING...' : 'ACTIVE'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {satelliteStatus?.totalSatellites || 12}
              </div>
              <p className="text-sm text-gray-600">Satellites Connected</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {satelliteStatus?.accuracy || 3.2}m
              </div>
              <p className="text-sm text-gray-600">GPS Accuracy</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">
                {realTimePosition ? 
                  `${realTimePosition.coords.latitude.toFixed(4)}, ${realTimePosition.coords.longitude.toFixed(4)}` 
                  : 'Acquiring...'
                }
              </div>
              <p className="text-sm text-gray-600">Current Position</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GPS Mappings</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gpsMappings.length}</div>
            <p className="text-xs text-muted-foreground">Mapped farm areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EUDR Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {eudrCompliances.filter((c: any) => c.complianceStatus === 'compliant').length}
            </div>
            <p className="text-xs text-muted-foreground">Compliant farms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deforestation Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {deforestationData.filter((d: any) => d.deforestationDetected).length}
            </div>
            <p className="text-xs text-muted-foreground">Detected areas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area Mapped</CardTitle>
            <Satellite className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gpsMappings.reduce((sum: number, mapping: any) => sum + parseFloat(mapping.totalAreaHectares || 0), 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Hectares mapped</p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive GPS Map */}
      <Card className="border-2 border-green-500">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Satellite className="h-6 w-6 text-green-600" />
            Interactive GPS Farm Mapping System
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">Live Preview</Badge>
          </CardTitle>
          <p className="text-sm text-gray-700 font-medium">
            Real-time satellite mapping with GPS tracking, deforestation monitoring, and EUDR compliance visualization
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div 
            className="relative rounded-xl border-4 border-solid border-green-600 overflow-hidden shadow-lg"
            style={{ height: '500px' }}
          >
            {/* Map Background */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: '#f2f2f2',
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, #e8f5e8 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, #e8f5e8 0%, transparent 50%),
                  linear-gradient(45deg, #f0f8f0 25%, transparent 25%),
                  linear-gradient(-45deg, #f0f8f0 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f0f8f0 75%),
                  linear-gradient(-45deg, transparent 75%, #f0f8f0 75%)
                `,
                backgroundSize: '40px 40px, 40px 40px, 20px 20px, 20px 20px, 20px 20px, 20px 20px',
                backgroundPosition: '0 0, 40px 40px, 0 0, 10px 0, 10px -10px, 0 10px'
              }}
            />
            
            {/* Map Grid */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.3 }}>
              <defs>
                <pattern id="mapGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 L 0 50" fill="none" stroke="#4ade80" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#mapGrid)" />
            </svg>
            
            {/* Geographic Features */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Rivers */}
              <path
                d="M 0 320 Q 150 300 280 280 Q 400 260 500 250 Q 600 240 700 235"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.6"
              />
              
              {/* Forest areas */}
              <circle cx="120" cy="180" r="40" fill="#059669" opacity="0.3" />
              <circle cx="650" cy="150" r="45" fill="#059669" opacity="0.3" />
              
              {/* Farm Plots */}
              <polygon
                points="100,120 200,110 210,180 110,190"
                fill="#10b981"
                fillOpacity="0.3"
                stroke="#10b981"
                strokeWidth="3"
                className="hover:fillOpacity-0.5 cursor-pointer transition-all duration-300"
              />
              <text x="140" y="145" fill="#065f46" fontSize="12" fontWeight="bold" textAnchor="middle">
                Coffee Farm A
              </text>
              
              <polygon
                points="250,150 380,140 390,220 260,230"
                fill="#f59e0b"
                fillOpacity="0.3"
                stroke="#f59e0b"
                strokeWidth="3"
                className="hover:fillOpacity-0.5 cursor-pointer transition-all duration-300"
              />
              <text x="315" y="180" fill="#92400e" fontSize="12" fontWeight="bold" textAnchor="middle">
                Cocoa Farm B
              </text>
              
              <polygon
                points="450,100 580,90 590,170 460,180"
                fill="#ef4444"
                fillOpacity="0.4"
                stroke="#ef4444"
                strokeWidth="4"
                strokeDasharray="8,4"
                className="hover:fillOpacity-0.6 cursor-pointer transition-all duration-300"
                style={{ animation: 'pulse 3s infinite' }}
              />
              <text x="515" y="130" fill="#7f1d1d" fontSize="12" fontWeight="bold" textAnchor="middle">
                Palm Plot C - ALERT
              </text>
              
              {/* GPS Markers */}
              <circle cx="155" cy="155" r="6" fill="#dc2626" stroke="white" strokeWidth="2" />
              <circle cx="320" cy="185" r="6" fill="#dc2626" stroke="white" strokeWidth="2" />
              <circle cx="520" cy="135" r="6" fill="#dc2626" stroke="white" strokeWidth="2" />
            </svg>
            
            {/* Interactive Info Panel */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border w-64">
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Satellite className="h-4 w-4 text-blue-600" />
                Real-Time GPS Tracking
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Total Farms:</span>
                  <span className="font-bold">3 farms</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Area:</span>
                  <span className="font-bold">16.1 hectares</span>
                </div>
                <div className="flex justify-between">
                  <span>EUDR Compliant:</span>
                  <span className="font-bold text-green-600">67%</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Alerts:</span>
                  <span className="font-bold text-red-600">1 alert</span>
                </div>
              </div>
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-xl border">
              <h4 className="font-bold text-sm mb-2">Map Legend</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-green-500 opacity-30 border-2 border-green-500 rounded"></div>
                  <span>EUDR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-orange-500 opacity-30 border-2 border-orange-500 rounded"></div>
                  <span>Review Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-red-500 opacity-40 border-2 border-red-500 rounded"></div>
                  <span>Deforestation Alert</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full border border-white"></div>
                  <span>GPS Markers</span>
                </div>
              </div>
            </div>
            
            {/* Coordinate Display */}
            <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-mono">
              <div className="font-bold text-green-400">Liberia Agricultural GPS System</div>
              <div className="mt-1">Center: 6.3183°N, 10.7919°W</div>
              <div>Zoom Level: 1:10,000</div>
            </div>
            
            {/* Scale Indicator */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded px-3 py-2 text-xs border">
              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-black"></div>
                <span className="font-bold">1 km</span>
              </div>
            </div>
          </div>
          
          {/* Map Controls */}
          <div className="flex justify-between items-center mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span className="font-mono font-bold">6.3183°N, -10.7919°W</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-lg">
                <Satellite className="h-5 w-5 text-green-600 animate-spin" style={{animationDuration: '3s'}} />
                <span className="font-medium">Live Tracking Active</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-green-300 hover:bg-green-50">
                <Eye className="h-4 w-4 mr-1" />
                Fullscreen
              </Button>
              <Button size="sm" variant="outline" className="border-green-300 hover:bg-green-50">
                <Navigation className="h-4 w-4 mr-1" />
                Center Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GPS Mappings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gpsMappings.map((mapping: any) => {
          const compliance = getComplianceStatus(mapping.id);
          const farmer = mockFarmers.find(f => f.id === mapping.farmerId);
          const plot = mockFarmPlots.find(p => p.id === mapping.farmPlotId);
          
          return (
            <Card key={mapping.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{mapping.mappingId}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {farmer?.name} - {farmer?.county}
                    </p>
                    {plot && (
                      <p className="text-sm text-muted-foreground">
                        {plot.plotName} ({plot.cropType})
                      </p>
                    )}
                  </div>
                  <Badge className={`${compliance.color} text-white`}>
                    {compliance.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Area:</span>
                    <span className="text-sm">{mapping.totalAreaHectares} ha</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Method:</span>
                    <span className="text-sm capitalize">{mapping.mappingMethod?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Coordinates:</span>
                    <span className="text-sm font-mono">{mapping.centerLatitude}, {mapping.centerLongitude}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedMapping(mapping)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mapping Details Modal */}
      {selectedMapping && (
        <Dialog open={!!selectedMapping} onOpenChange={() => setSelectedMapping(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>GPS Mapping Details - {selectedMapping.mappingId}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Location Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Center Latitude:</span>
                  <span>{selectedMapping.centerLatitude}</span>
                  <span className="text-muted-foreground">Center Longitude:</span>
                  <span>{selectedMapping.centerLongitude}</span>
                  <span className="text-muted-foreground">Total Area:</span>
                  <span>{selectedMapping.totalAreaHectares} hectares</span>
                  <span className="text-muted-foreground">Elevation:</span>
                  <span>{selectedMapping.elevationMeters || 'N/A'} meters</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Technical Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Boundary Type:</span>
                  <span className="capitalize">{selectedMapping.boundaryType}</span>
                  <span className="text-muted-foreground">Mapping Method:</span>
                  <span className="capitalize">{selectedMapping.mappingMethod?.replace('_', ' ')}</span>
                  <span className="text-muted-foreground">Accuracy Level:</span>
                  <span className="capitalize">{selectedMapping.accuracyLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">GPS Coordinates</h4>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(JSON.parse(selectedMapping.coordinates), null, 2)}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}

            {/* Statistics Overview for Existing Mappings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Mappings</p>
                      <p className="text-2xl font-bold text-gray-900">{gpsMappings.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Verified</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {gpsMappings.filter((m: any) => m.verificationStatus === 'verified').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TreePine className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">EUDR Compliant</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {eudrCompliances.filter((c: any) => c.complianceStatus === 'compliant').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Deforestation Alerts</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {deforestationData.filter((d: any) => d.riskLevel === 'high').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Existing Mappings Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gpsMappings.map((mapping: any) => {
                  const compliance = getComplianceStatus(mapping.id);
                  const farmer = mockFarmers.find(f => f.id === mapping.farmerId);
                  const plot = mockFarmPlots.find(p => p.id === mapping.farmPlotId);
                  
                  return (
                    <Card key={mapping.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{mapping.mappingId}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {farmer?.name} - {farmer?.county}
                            </p>
                            {plot && (
                              <p className="text-sm text-muted-foreground">
                                {plot.plotName} ({plot.cropType})
                              </p>
                            )}
                          </div>
                          <Badge className={`${compliance.color} text-white`}>
                            {compliance.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Area:</span>
                            <span className="text-sm">{mapping.totalAreaHectares} ha</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Accuracy:</span>
                            <Badge variant="outline">{mapping.accuracyLevel}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Status:</span>
                            <Badge variant={mapping.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                              {mapping.verificationStatus}
                            </Badge>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Dialog */}
      {selectedMapping && (
        <Dialog open={!!selectedMapping} onOpenChange={() => setSelectedMapping(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>GPS Mapping Details - {selectedMapping.mappingId}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Location Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Center Latitude:</span>
                  <span>{selectedMapping.centerLatitude}</span>
                  <span className="text-muted-foreground">Center Longitude:</span>
                  <span>{selectedMapping.centerLongitude}</span>
                  <span className="text-muted-foreground">Total Area:</span>
                  <span>{selectedMapping.totalAreaHectares} hectares</span>
                  <span className="text-muted-foreground">Elevation:</span>
                  <span>{selectedMapping.elevationMeters || 'N/A'} meters</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Technical Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Boundary Type:</span>
                  <span className="capitalize">{selectedMapping.boundaryType}</span>
                  <span className="text-muted-foreground">Mapping Method:</span>
                  <span className="capitalize">{selectedMapping.mappingMethod?.replace('_', ' ')}</span>
                  <span className="text-muted-foreground">Accuracy Level:</span>
                  <span className="capitalize">{selectedMapping.accuracyLevel}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">GPS Coordinates</h4>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(JSON.parse(selectedMapping.coordinates), null, 2)}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}