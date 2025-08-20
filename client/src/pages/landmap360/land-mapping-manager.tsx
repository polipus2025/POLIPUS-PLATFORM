import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, MapPin, Edit, Eye, Trash2, Save, Map, Satellite, Calendar, User, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LandMapHeader from "@/components/landmap360/landmap-header";
import LandMapSidebar from "@/components/landmap360/landmap-sidebar";
import RealMapBoundaryMapper from "@/components/maps/real-map-boundary-mapper";
import EUDRComplianceMapper from "@/components/maps/eudr-compliance-mapper";

// Land Mapping Form Schema
const landMappingSchema = z.object({
  farmerId: z.number(),
  landMappingName: z.string().min(2, "Land mapping name is required"),
  totalArea: z.number().min(0.01, "Total area must be greater than 0"),
  cultivatedArea: z.number().min(0, "Cultivated area cannot be negative"),
  soilType: z.string().min(1, "Soil type is required"),
  waterSources: z.array(z.string()),
  accessRoads: z.boolean().default(false),
  elevationData: z.object({
    min: z.number(),
    max: z.number(),
    average: z.number()
  }),
  landUseType: z.string().min(1, "Land use type is required"),
  cropTypes: z.array(z.string()),
  boundaryCoordinates: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    point: z.number()
  })),
  notes: z.string().optional(),
});

type LandMappingFormData = z.infer<typeof landMappingSchema>;

// Inspection Form Schema
const inspectionSchema = z.object({
  landMappingId: z.number(),
  purpose: z.string().min(1, "Inspection purpose is required"),
  findings: z.string().min(10, "Findings must be at least 10 characters"),
  recommendations: z.string().optional(),
  complianceStatus: z.string().min(1, "Compliance status is required"),
  farmerPresent: z.boolean().default(true),
  farmerFeedback: z.string().optional(),
});

type InspectionFormData = z.infer<typeof inspectionSchema>;

export default function LandMappingManager() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState<number | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInspectionDialogOpen, setIsInspectionDialogOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<any>(null);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isInteractiveMappingOpen, setIsInteractiveMappingOpen] = useState(false);
  const [farmBoundaries, setFarmBoundaries] = useState<Array<{lat: number, lng: number, point: number}>>([]);
  const [landMapData, setLandMapData] = useState<any>({
    totalArea: 0,
    cultivatedArea: 0,
    soilType: '',
    waterSources: [] as string[],
    accessRoads: false,
    elevationData: { min: 0, max: 0, average: 0 }
  });
  
  const inspectorName = localStorage.getItem("userName") || "Land Inspector";

  // Forms
  const landMappingForm = useForm<LandMappingFormData>({
    resolver: zodResolver(landMappingSchema),
    defaultValues: {
      waterSources: [],
      accessRoads: false,
      cropTypes: [],
      boundaryCoordinates: [],
      elevationData: { min: 0, max: 0, average: 0 },
    },
  });

  // Update form when boundaries change
  useEffect(() => {
    if (farmBoundaries.length > 0) {
      landMappingForm.setValue("boundaryCoordinates", farmBoundaries);
      landMappingForm.setValue("totalArea", landMapData.totalArea);
      landMappingForm.setValue("cultivatedArea", landMapData.cultivatedArea);
      landMappingForm.setValue("soilType", landMapData.soilType);
    }
  }, [farmBoundaries, landMapData]);

  const inspectionForm = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      farmerPresent: true,
    },
  });

  // Fetch farmers
  const { data: farmers = [] } = useQuery({
    queryKey: ["/api/farmers"],
    queryFn: () => apiRequest("/api/farmers").then(res => res.json()),
  });

  // Fetch land mappings for selected farmer
  const { data: landMappings = [], refetch: refetchMappings } = useQuery({
    queryKey: ["/api/land-mappings", selectedFarmerId],
    queryFn: () => 
      selectedFarmerId 
        ? apiRequest(`/api/farmers/${selectedFarmerId}/land-mappings`).then(res => res.json())
        : Promise.resolve([]),
    enabled: !!selectedFarmerId,
  });

  // Fetch inspections for selected mapping
  const { data: inspections = [] } = useQuery({
    queryKey: ["/api/land-mapping-inspections", selectedMapping?.id],
    queryFn: () => 
      selectedMapping?.id 
        ? apiRequest(`/api/land-mappings/${selectedMapping.id}/inspections`).then(res => res.json())
        : Promise.resolve([]),
    enabled: !!selectedMapping?.id,
  });

  // Create land mapping mutation
  const createMappingMutation = useMutation({
    mutationFn: async (data: LandMappingFormData) => {
      const response = await apiRequest("/api/land-mappings", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          createdBy: inspectorName,
          status: "draft",
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Land Mapping Created",
        description: "New land mapping has been created successfully",
      });
      setIsCreateDialogOpen(false);
      landMappingForm.reset();
      refetchMappings();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create land mapping",
        variant: "destructive",
      });
    },
  });

  // Create inspection mutation
  const createInspectionMutation = useMutation({
    mutationFn: async (data: InspectionFormData) => {
      const response = await apiRequest("/api/land-mapping-inspections", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          inspectorId: inspectorName,
          inspectorName,
          inspectionDate: new Date().toISOString(),
          farmerId: selectedMapping?.farmerId,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Inspection Recorded",
        description: "Land mapping inspection has been recorded successfully",
      });
      setIsInspectionDialogOpen(false);
      inspectionForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/land-mapping-inspections"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record inspection",
        variant: "destructive",
      });
    },
  });

  const selectedFarmer = farmers.find((f: any) => f.id === selectedFarmerId);
  const filteredMappings = landMappings.filter((mapping: any) => 
    mapping.landMappingName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.soilType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceColor = (status: string) => {
    switch(status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'non_compliant': return 'bg-red-100 text-red-800';
      case 'review_required': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Land Mapping Manager - LandMap360</title>
        <meta name="description" content="Manage multiple land mappings for farmers with comprehensive inspection capabilities" />
      </Helmet>

      <LandMapHeader />

      <div className="flex">
        <LandMapSidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64" style={{ paddingTop: '0px' }}>
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Land Mapping Manager
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Map className="h-4 w-4" />
                Create and manage multiple land mappings for each farmer
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Farmer Selection Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Select Farmer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedFarmerId?.toString() || ""} onValueChange={(value) => setSelectedFarmerId(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a farmer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {farmers.map((farmer: any) => (
                        <SelectItem key={farmer.id} value={farmer.id.toString()}>
                          {farmer.firstName} {farmer.lastName} ({farmer.farmerId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedFarmer && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-2">Farmer Details</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p><span className="font-medium">Name:</span> {selectedFarmer.firstName} {selectedFarmer.lastName}</p>
                        <p><span className="font-medium">ID:</span> {selectedFarmer.farmerId}</p>
                        <p><span className="font-medium">County:</span> {selectedFarmer.county}</p>
                        <p><span className="font-medium">Phone:</span> {selectedFarmer.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Land Mappings Panel */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Land Mappings
                      {selectedFarmerId && (
                        <Badge variant="secondary" className="ml-2">
                          {filteredMappings.length} mappings
                        </Badge>
                      )}
                    </CardTitle>
                    {selectedFarmerId && (
                      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Create Mapping
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Create New Land Mapping</DialogTitle>
                          </DialogHeader>
                          
                          <Form {...landMappingForm}>
                            <form onSubmit={landMappingForm.handleSubmit((data) => {
                              createMappingMutation.mutate({
                                ...data,
                                farmerId: selectedFarmerId!,
                              });
                            })} className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={landMappingForm.control}
                                  name="landMappingName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Mapping Name</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="e.g., North Field, Main Plot" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={landMappingForm.control}
                                  name="landUseType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Land Use Type</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select land use" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="agricultural">Agricultural</SelectItem>
                                          <SelectItem value="mixed_farming">Mixed Farming</SelectItem>
                                          <SelectItem value="livestock">Livestock</SelectItem>
                                          <SelectItem value="agroforestry">Agroforestry</SelectItem>
                                          <SelectItem value="fallow">Fallow</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <FormField
                                  control={landMappingForm.control}
                                  name="totalArea"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Total Area (hectares)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          type="number" 
                                          step="0.01"
                                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={landMappingForm.control}
                                  name="cultivatedArea"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Cultivated Area (hectares)</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          type="number" 
                                          step="0.01"
                                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={landMappingForm.control}
                                  name="soilType"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Soil Type</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Select soil type" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="clay">Clay</SelectItem>
                                          <SelectItem value="loam">Loam</SelectItem>
                                          <SelectItem value="sandy">Sandy</SelectItem>
                                          <SelectItem value="silt">Silt</SelectItem>
                                          <SelectItem value="rocky">Rocky</SelectItem>
                                          <SelectItem value="mixed">Mixed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* GPS Mapping Section */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                  <h4 className="font-medium text-slate-900">GPS Boundary Mapping</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {farmBoundaries.length} points mapped
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsInteractiveMappingOpen(true)}
                                    className="w-full"
                                  >
                                    <Satellite className="h-4 w-4 mr-2" />
                                    Interactive Mapping
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsMapDialogOpen(true)}
                                    className="w-full"
                                    disabled={farmBoundaries.length === 0}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview Map
                                  </Button>
                                </div>
                                
                                {farmBoundaries.length > 0 && (
                                  <div className="bg-slate-50 p-3 rounded-lg">
                                    <div className="text-sm text-slate-600 mb-2">
                                      <strong>Mapped Area:</strong> {landMapData.totalArea.toFixed(2)} hectares
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                                      <div>Boundary Points: {farmBoundaries.length}</div>
                                      <div>Soil Type: {landMapData.soilType}</div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <FormField
                                control={landMappingForm.control}
                                name="notes"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Notes & Observations</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        {...field} 
                                        placeholder="Additional notes about this land mapping..."
                                        className="min-h-[100px]"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={createMappingMutation.isPending}>
                                  {createMappingMutation.isPending ? "Creating..." : "Create Mapping"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {!selectedFarmerId ? (
                    <div className="text-center py-12 text-slate-500">
                      <Map className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Please select a farmer to view their land mappings</p>
                    </div>
                  ) : filteredMappings.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No land mappings found for this farmer</p>
                      <p className="text-sm">Create the first mapping to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        placeholder="Search land mappings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-4"
                      />

                      {filteredMappings.map((mapping: any) => (
                        <div key={mapping.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-slate-900">{mapping.landMappingName}</h3>
                                <Badge className={getStatusColor(mapping.status)}>
                                  {mapping.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                                <div>
                                  <span className="text-slate-500">Total Area:</span>
                                  <p className="font-medium">{mapping.totalArea} ha</p>
                                </div>
                                <div>
                                  <span className="text-slate-500">Cultivated:</span>
                                  <p className="font-medium">{mapping.cultivatedArea} ha</p>
                                </div>
                                <div>
                                  <span className="text-slate-500">Soil Type:</span>
                                  <p className="font-medium capitalize">{mapping.soilType}</p>
                                </div>
                                <div>
                                  <span className="text-slate-500">Land Use:</span>
                                  <p className="font-medium capitalize">{mapping.landUseType}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedMapping(mapping);
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                setSelectedMapping(mapping);
                                setIsInspectionDialogOpen(true);
                              }}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              New Inspection
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Inspection Dialog */}
            <Dialog open={isInspectionDialogOpen} onOpenChange={setIsInspectionDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Land Mapping Inspection</DialogTitle>
                </DialogHeader>

                <Form {...inspectionForm}>
                  <form onSubmit={inspectionForm.handleSubmit((data) => {
                    createInspectionMutation.mutate({
                      ...data,
                      landMappingId: selectedMapping?.id,
                    });
                  })} className="space-y-4">
                    <FormField
                      control={inspectionForm.control}
                      name="purpose"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inspection Purpose</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select inspection purpose" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="survey">Land Survey</SelectItem>
                              <SelectItem value="boundary_check">Boundary Verification</SelectItem>
                              <SelectItem value="crop_assessment">Crop Assessment</SelectItem>
                              <SelectItem value="compliance_check">Compliance Check</SelectItem>
                              <SelectItem value="farmer_support">Farmer Support</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inspectionForm.control}
                      name="findings"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inspection Findings</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Detailed findings from the inspection..."
                              className="min-h-[120px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inspectionForm.control}
                      name="complianceStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Compliance Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select compliance status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="compliant">Compliant</SelectItem>
                              <SelectItem value="review_required">Review Required</SelectItem>
                              <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={inspectionForm.control}
                      name="recommendations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommendations</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Recommendations for improvements or next steps..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsInspectionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createInspectionMutation.isPending}>
                        {createInspectionMutation.isPending ? "Recording..." : "Record Inspection"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            {/* Interactive Farm Mapping Dialog */}
            <Dialog open={isInteractiveMappingOpen} onOpenChange={setIsInteractiveMappingOpen}>
              <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
                <DialogHeader className="pb-3">
                  <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span className="hidden sm:inline">Interactive Land Boundary Mapping</span>
                    <span className="sm:hidden">Land Mapping</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    <span className="hidden sm:inline">Create precise land boundaries by clicking on the map or using GPS positioning.</span>
                    <span className="sm:hidden">Tap map to create boundaries</span>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-6">
                  <RealMapBoundaryMapper
                    onBoundaryComplete={(boundary) => {
                      const points = boundary.points;
                      const area = boundary.area;
                      
                      // Convert points data to match our land mapping format
                      const newBoundaries = points.map((point, index) => ({
                        lat: point.latitude,
                        lng: point.longitude,
                        point: index + 1
                      }));
                      
                      setFarmBoundaries(newBoundaries);
                      
                      // Update land map data with boundary information
                      setLandMapData({
                        totalArea: area,
                        cultivatedArea: area * 0.8, // Assume 80% cultivated initially
                        soilType: 'Fertile Loam',
                        waterSources: ['River', 'Well'],
                        accessRoads: true,
                        elevationData: {
                          min: 50,
                          max: 120,
                          average: 85
                        }
                      });
                      
                      toast({
                        title: "Land Boundary Mapping Complete",
                        description: `Land boundary created with ${points.length} GPS points. Area: ${area.toFixed(2)} hectares.`,
                      });
                      
                      setIsInteractiveMappingOpen(false);
                    }}
                  />
                </div>
              </DialogContent>
            </Dialog>

            {/* Map Preview Dialog */}
            <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-emerald-600" />
                    Land Mapping Preview
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Land Analysis Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h4 className="font-medium text-emerald-900 mb-2">Total Area</h4>
                      <p className="text-2xl font-bold text-emerald-700">{landMapData.totalArea.toFixed(2)} ha</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Cultivated Area</h4>
                      <p className="text-2xl font-bold text-blue-700">{landMapData.cultivatedArea.toFixed(2)} ha</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Soil Type</h4>
                      <p className="text-lg font-semibold text-orange-700 capitalize">{landMapData.soilType}</p>
                    </div>
                  </div>
                  
                  {/* Additional Land Data */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="bg-cyan-50 p-3 rounded-lg">
                        <div className="font-medium text-cyan-900">Water Resources</div>
                        {landMapData.waterSources.length > 0 ? (
                          <div className="space-y-1">
                            {landMapData.waterSources.map((source: any, index: number) => (
                              <div key={index} className="text-cyan-700 text-sm">• {source}</div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-cyan-700">No documented water sources</div>
                        )}
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="font-medium text-orange-900">Elevation Profile</div>
                        <div className="text-orange-700 text-sm space-y-1">
                          <div>Minimum: {landMapData.elevationData.min}m above sea level</div>
                          <div>Average: {landMapData.elevationData.average}m above sea level</div>
                          <div>Maximum: {landMapData.elevationData.max}m above sea level</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Boundary Points Table */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-900 mb-3">GPS Boundary Coordinates</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-64 overflow-y-auto">
                        {farmBoundaries.map((point, index) => (
                          <div key={index} className="bg-white p-2 rounded border">
                            <div className="font-medium">Point {point.point}</div>
                            <div className="text-gray-600">
                              Lat: {point.lat.toFixed(6)}
                            </div>
                            <div className="text-gray-600">
                              Lng: {point.lng.toFixed(6)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setIsMapDialogOpen(false)}>
                    Close Preview
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}