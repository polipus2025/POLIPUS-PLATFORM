import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, MapPin, Satellite, TreePine, AlertTriangle, CheckCircle, Eye, Edit, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
  { id: 1, name: 'John Doe', county: 'Montserrado County' },
  { id: 2, name: 'Mary Johnson', county: 'Bong County' },
  { id: 3, name: 'Samuel Williams', county: 'Nimba County' },
];

const mockFarmPlots = [
  { id: 1, plotName: 'Coffee Plot A', farmerId: 1, cropType: 'Coffee' },
  { id: 2, plotName: 'Cocoa Plot B', farmerId: 2, cropType: 'Cocoa' },
  { id: 3, plotName: 'Palm Plot C', farmerId: 3, cropType: 'Oil Palm' },
];

export default function GpsMapping() {
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const createMappingMutation = useMutation({
    mutationFn: async (data: GpsFormData) => {
      const payload = {
        ...data,
        farmerId: parseInt(data.farmerId),
        farmPlotId: data.farmPlotId ? parseInt(data.farmPlotId) : null,
        centerLatitude: data.centerLatitude,
        centerLongitude: data.centerLongitude,
        totalAreaHectares: data.totalAreaHectares,
        elevationMeters: data.elevationMeters || null,
        slope: data.slope || null,
        soilType: data.soilType || null,
        drainageStatus: data.drainageStatus || null,
      };
      return apiRequest('/api/farm-gps-mappings', 'POST', payload);
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
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create GPS mapping',
        variant: 'destructive',
      });
    },
  });

  const validateCoordinatesMutation = useMutation({
    mutationFn: async (coordinates: string) => {
      return apiRequest('/api/gps/validate-coordinates', 'POST', { coordinates });
    },
    onSuccess: (data: any) => {
      if (data.valid) {
        toast({
          title: 'Valid Coordinates',
          description: `Area: ${data.area.toFixed(2)} hectares`,
        });
      } else {
        toast({
          title: 'Invalid Coordinates',
          description: data.issues.join(', '),
          variant: 'destructive',
        });
      }
    },
  });

  const handleValidateCoordinates = () => {
    const coordinates = form.getValues('coordinates');
    if (coordinates) {
      validateCoordinatesMutation.mutate(coordinates);
    }
  };

  const getComplianceStatus = (mappingId: number) => {
    const compliance = eudrCompliances.find((c: any) => c.farmGpsMappingId === mappingId);
    const deforestation = deforestationData.find((d: any) => d.farmGpsMappingId === mappingId);
    
    if (deforestation?.deforestationDetected) {
      return { status: 'critical', label: 'Deforestation Detected', color: 'bg-red-500' };
    }
    if (compliance?.complianceStatus === 'compliant') {
      return { status: 'compliant', label: 'EUDR Compliant', color: 'bg-green-500' };
    }
    if (compliance?.complianceStatus === 'non_compliant') {
      return { status: 'non-compliant', label: 'Non-Compliant', color: 'bg-red-500' };
    }
    return { status: 'pending', label: 'Pending Review', color: 'bg-yellow-500' };
  };

  const onSubmit = (data: GpsFormData) => {
    createMappingMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading GPS mappings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">GPS Farm Mapping</h1>
          <p className="text-muted-foreground">
            Manage farm GPS coordinates and monitor EUDR compliance through precise geolocation tracking
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

                <FormField
                  control={form.control}
                  name="farmPlotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farm Plot (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select farm plot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockFarmPlots.map((plot) => (
                            <SelectItem key={plot.id} value={plot.id.toString()}>
                              {plot.plotName} - {plot.cropType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coordinates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GPS Coordinates (JSON Format)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Textarea 
                            placeholder='[[-10.7969, 6.3133], [-10.7969, 6.3233], [-10.7869, 6.3233], [-10.7869, 6.3133]]'
                            rows={4}
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleValidateCoordinates}
                            disabled={!field.value || validateCoordinatesMutation.isPending}
                          >
                            <Navigation className="mr-2 h-4 w-4" />
                            Validate Coordinates
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="centerLatitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Center Latitude</FormLabel>
                        <FormControl>
                          <Input placeholder="6.3183" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="centerLongitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Center Longitude</FormLabel>
                        <FormControl>
                          <Input placeholder="-10.7919" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalAreaHectares"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Area (Hectares)</FormLabel>
                        <FormControl>
                          <Input placeholder="5.25" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="boundaryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Boundary Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="polygon">Polygon</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mappingMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mapping Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="gps_survey">GPS Survey</SelectItem>
                            <SelectItem value="satellite_imagery">Satellite Imagery</SelectItem>
                            <SelectItem value="drone_mapping">Drone Mapping</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accuracyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accuracy Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="elevationMeters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Elevation (meters)</FormLabel>
                        <FormControl>
                          <Input placeholder="250" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slope"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slope (%)</FormLabel>
                        <FormControl>
                          <Input placeholder="15" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="soilType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Soil Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Loamy soil" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="drainageStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drainage Status</FormLabel>
                        <FormControl>
                          <Input placeholder="Well-drained" {...field} />
                        </FormControl>
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
                    <span className="text-sm font-medium">Accuracy:</span>
                    <span className="text-sm capitalize">{mapping.accuracyLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge variant={mapping.verificationStatus === 'verified' ? 'default' : 'secondary'}>
                      {mapping.verificationStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedMapping(mapping)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {gpsMappings.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No GPS Mappings Found</h3>
            <p className="text-muted-foreground mb-4">
              Start mapping farm coordinates for EUDR compliance tracking
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Mapping
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mapping Details Dialog */}
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
                  <span className="text-muted-foreground">Slope:</span>
                  <span>{selectedMapping.slope || 'N/A'}%</span>
                  <span className="text-muted-foreground">Soil Type:</span>
                  <span>{selectedMapping.soilType || 'N/A'}</span>
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
                  <span className="text-muted-foreground">Verification Status:</span>
                  <span className="capitalize">{selectedMapping.verificationStatus}</span>
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(selectedMapping.createdAt).toLocaleDateString()}</span>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span>{new Date(selectedMapping.updatedAt).toLocaleDateString()}</span>
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