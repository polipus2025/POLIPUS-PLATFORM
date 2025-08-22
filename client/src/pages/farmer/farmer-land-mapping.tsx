import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin, TreePine, CheckCircle, AlertCircle, Clock, Plus, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

interface FarmerLandMapping {
  id: number;
  mappingId: string;
  farmerId: number;
  farmerName: string;
  landName: string;
  landType: string;
  coordinates: string;
  totalAreaHectares: number;
  soilType: string;
  waterSource: string;
  accessRoad: string;
  nearbyLandmarks: string;
  elevationMeters?: number;
  slope: string;
  drainageStatus: string;
  previousCropHistory: string;
  soilHealthStatus: string;
  irrigationSystem?: string;
  environmentalRisks?: string;
  complianceStatus: string;
  inspectionStatus: string;
  approvedBy?: string;
  approvedAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface HarvestSchedule {
  id: number;
  scheduleId: string;
  landMappingId: number;
  farmerId: number;
  cropType: string;
  variety?: string;
  plantingStartDate: Date;
  plantingEndDate: Date;
  expectedHarvestStartDate: Date;
  expectedHarvestEndDate: Date;
  estimatedYieldKg: number;
  harvestMethod: string;
  qualityTargetGrade: string;
  laborRequirements: number;
  equipmentNeeded?: string;
  certificationRequired: string;
  marketDestination?: string;
  buyerInformation?: string;
  pricePerKg?: number;
  totalEstimatedValue?: number;
  weatherDependencies?: string;
  riskFactors?: string;
  contingencyPlans?: string;
  inspectedBy?: string;
  approvedBy?: string;
  approvedAt?: Date;
  status: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function FarmerLandMapping() {
  const [activeTab, setActiveTab] = useState("my-lands");
  const [showNewMappingDialog, setShowNewMappingDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [editingMapping, setEditingMapping] = useState<FarmerLandMapping | null>(null);
  const [selectedMappingForSchedule, setSelectedMappingForSchedule] = useState<number | null>(null);
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get farmer info from localStorage
  const farmerId = parseInt(localStorage.getItem("farmerId") || "1");
  const farmerName = localStorage.getItem("farmerFirstName") || "Farmer";

  // Form states for new land mapping
  const [newMapping, setNewMapping] = useState({
    landName: "",
    landType: "",
    coordinates: "",
    totalAreaHectares: "",
    soilType: "",
    waterSource: "",
    accessRoad: "",
    nearbyLandmarks: "",
    elevationMeters: "",
    slope: "",
    drainageStatus: "",
    previousCropHistory: "",
    soilHealthStatus: "",
    irrigationSystem: "",
    environmentalRisks: ""
  });

  // Form states for harvest schedule
  const [newSchedule, setNewSchedule] = useState({
    cropType: "",
    variety: "",
    plantingStartDate: new Date(),
    plantingEndDate: new Date(),
    expectedHarvestStartDate: new Date(),
    expectedHarvestEndDate: new Date(),
    estimatedYieldKg: "",
    harvestMethod: "",
    qualityTargetGrade: "",
    laborRequirements: "",
    equipmentNeeded: "",
    certificationRequired: "",
    marketDestination: "",
    buyerInformation: "",
    pricePerKg: "",
    weatherDependencies: "",
    riskFactors: "",
    contingencyPlans: ""
  });

  // Fetch farmer's land mappings - removed auto-refresh for better performance
  const { data: landMappings = [], isLoading: loadingMappings, refetch: refetchMappings } = useQuery<FarmerLandMapping[]>({
    queryKey: ["/api/farmer-land-mappings", farmerId],
    enabled: !!farmerId && activeTab === "my-lands",
  });

  // Fetch harvest schedules only when needed
  const { data: harvestSchedules = [], isLoading: loadingSchedules } = useQuery<HarvestSchedule[]>({
    queryKey: ["/api/harvest-schedules", farmerId],
    enabled: !!farmerId && activeTab === "schedules",
  });

  // Auto-detect GPS coordinates
  const detectGPS = () => {
    setIsDetectingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setGpsCoordinates({ lat, lng });
          setNewMapping(prev => ({
            ...prev,
            coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
          }));
          setIsDetectingGPS(false);
          toast({
            title: "GPS Detected",
            description: `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          });
        },
        (error) => {
          setIsDetectingGPS(false);
          toast({
            title: "GPS Detection Failed",
            description: "Please enter coordinates manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsDetectingGPS(false);
      toast({
        title: "GPS Not Supported",
        description: "Please enter coordinates manually.",
        variant: "destructive",
      });
    }
  };

  // Create new land mapping
  const createMapping = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/farmer-land-mappings", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          farmerId,
          farmerName,
          totalAreaHectares: parseFloat(data.totalAreaHectares),
          elevationMeters: data.elevationMeters ? parseFloat(data.elevationMeters) : null,
          complianceStatus: "pending",
          inspectionStatus: "pending",
          isActive: true
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-land-mappings"] });
      toast({
        title: "Land Mapping Created",
        description: "Your land mapping has been submitted for inspection.",
      });
      setShowNewMappingDialog(false);
      setNewMapping({
        landName: "",
        landType: "",
        coordinates: "",
        totalAreaHectares: "",
        soilType: "",
        waterSource: "",
        accessRoad: "",
        nearbyLandmarks: "",
        elevationMeters: "",
        slope: "",
        drainageStatus: "",
        previousCropHistory: "",
        soilHealthStatus: "",
        irrigationSystem: "",
        environmentalRisks: ""
      });
      refetchMappings();
    },
    onError: () => {
      toast({
        title: "Failed to Create Mapping",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  // Create harvest schedule
  const createSchedule = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/harvest-schedules", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          farmerId,
          landMappingId: selectedMappingForSchedule,
          estimatedYieldKg: parseFloat(data.estimatedYieldKg),
          laborRequirements: parseInt(data.laborRequirements),
          pricePerKg: data.pricePerKg ? parseFloat(data.pricePerKg) : null,
          totalEstimatedValue: data.pricePerKg && data.estimatedYieldKg ? 
            parseFloat(data.pricePerKg) * parseFloat(data.estimatedYieldKg) : null,
          status: "pending",
          isActive: true
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/harvest-schedules"] });
      toast({
        title: "Harvest Schedule Created",
        description: "Your harvest schedule has been submitted for approval.",
      });
      setShowScheduleDialog(false);
      setSelectedMappingForSchedule(null);
      setNewSchedule({
        cropType: "",
        variety: "",
        plantingStartDate: new Date(),
        plantingEndDate: new Date(),
        expectedHarvestStartDate: new Date(),
        expectedHarvestEndDate: new Date(),
        estimatedYieldKg: "",
        harvestMethod: "",
        qualityTargetGrade: "",
        laborRequirements: "",
        equipmentNeeded: "",
        certificationRequired: "",
        marketDestination: "",
        buyerInformation: "",
        pricePerKg: "",
        weatherDependencies: "",
        riskFactors: "",
        contingencyPlans: ""
      });
    },
    onError: () => {
      toast({
        title: "Failed to Create Schedule",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "rejected": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/farmer-dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Land Mappings</h1>
            <p className="text-gray-600">Manage your farm plots and harvest schedules</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowNewMappingDialog(true)}
          className="bg-green-600 hover:bg-green-700"
          data-testid="button-add-land-mapping"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Land Mapping
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Land Plots</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{landMappings.length}</div>
            <p className="text-xs text-muted-foreground">
              Registered plots
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
            <TreePine className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {landMappings.reduce((sum, mapping) => sum + mapping.totalAreaHectares, 0).toFixed(1)} ha
            </div>
            <p className="text-xs text-muted-foreground">
              Hectares mapped
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Plots</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {landMappings.filter(m => m.complianceStatus === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready for planting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {harvestSchedules.filter(s => s.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Planned harvests
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-lands">My Land Plots</TabsTrigger>
          <TabsTrigger value="harvest-schedules">Harvest Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="my-lands" className="space-y-4">
          {loadingMappings ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : landMappings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Land Mappings Yet</h3>
                <p className="text-gray-600 mb-4">Start by adding your first land plot mapping.</p>
                <Button 
                  onClick={() => setShowNewMappingDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Land Mapping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {landMappings.map((mapping) => (
                <Card key={mapping.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{mapping.landName}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(mapping.complianceStatus)}>
                          {getStatusIcon(mapping.complianceStatus)}
                          <span className="ml-1 capitalize">{mapping.complianceStatus}</span>
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>
                      {mapping.landType} • {mapping.totalAreaHectares} hectares
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Soil Type:</span>
                          <p className="text-gray-600">{mapping.soilType}</p>
                        </div>
                        <div>
                          <span className="font-medium">Water Source:</span>
                          <p className="text-gray-600">{mapping.waterSource}</p>
                        </div>
                        <div>
                          <span className="font-medium">Coordinates:</span>
                          <p className="text-gray-600 text-xs">{mapping.coordinates}</p>
                        </div>
                        <div>
                          <span className="font-medium">Slope:</span>
                          <p className="text-gray-600">{mapping.slope}</p>
                        </div>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            Created: {format(new Date(mapping.createdAt), "MMM dd, yyyy")}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedMappingForSchedule(mapping.id);
                                setShowScheduleDialog(true);
                              }}
                              disabled={mapping.complianceStatus !== "approved"}
                              data-testid={`button-add-schedule-${mapping.id}`}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Schedule
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="harvest-schedules" className="space-y-4">
          {loadingSchedules ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : harvestSchedules.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <TreePine className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Harvest Schedules</h3>
                <p className="text-gray-600">Create harvest schedules for your approved land plots.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {harvestSchedules.map((schedule) => {
                const landMapping = landMappings.find(m => m.id === schedule.landMappingId);
                return (
                  <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{schedule.cropType}</CardTitle>
                        <Badge className={getStatusColor(schedule.status)}>
                          {getStatusIcon(schedule.status)}
                          <span className="ml-1 capitalize">{schedule.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        {landMapping?.landName} • {schedule.variety || "Standard variety"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Planting Start:</span>
                            <p className="text-gray-600">{format(new Date(schedule.plantingStartDate), "MMM dd, yyyy")}</p>
                          </div>
                          <div>
                            <span className="font-medium">Expected Harvest:</span>
                            <p className="text-gray-600">{format(new Date(schedule.expectedHarvestStartDate), "MMM dd, yyyy")}</p>
                          </div>
                          <div>
                            <span className="font-medium">Expected Yield:</span>
                            <p className="text-gray-600">{schedule.estimatedYieldKg} kg</p>
                          </div>
                          <div>
                            <span className="font-medium">Quality Grade:</span>
                            <p className="text-gray-600">{schedule.qualityTargetGrade}</p>
                          </div>
                        </div>
                        
                        {schedule.totalEstimatedValue && (
                          <div className="pt-2 border-t">
                            <span className="font-medium text-green-600">
                              Estimated Value: ${schedule.totalEstimatedValue.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* New Land Mapping Dialog */}
      <Dialog open={showNewMappingDialog} onOpenChange={setShowNewMappingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Land Mapping</DialogTitle>
            <DialogDescription>
              Create a new land plot mapping for your farm. This will be reviewed by Land Inspectors.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="landName">Land Name *</Label>
                <Input
                  id="landName"
                  value={newMapping.landName}
                  onChange={(e) => setNewMapping(prev => ({ ...prev, landName: e.target.value }))}
                  placeholder="e.g., North Field, Main Plot"
                  data-testid="input-land-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landType">Land Type *</Label>
                <Select value={newMapping.landType} onValueChange={(value) => setNewMapping(prev => ({ ...prev, landType: value }))}>
                  <SelectTrigger data-testid="select-land-type">
                    <SelectValue placeholder="Select land type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agricultural">Agricultural</SelectItem>
                    <SelectItem value="forest">Forest</SelectItem>
                    <SelectItem value="plantation">Plantation</SelectItem>
                    <SelectItem value="mixed">Mixed Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coordinates">GPS Coordinates *</Label>
              <div className="flex gap-2">
                <Input
                  id="coordinates"
                  value={newMapping.coordinates}
                  onChange={(e) => setNewMapping(prev => ({ ...prev, coordinates: e.target.value }))}
                  placeholder="e.g., 6.3406, -10.7572"
                  data-testid="input-coordinates"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={detectGPS}
                  disabled={isDetectingGPS}
                  data-testid="button-detect-gps"
                >
                  {isDetectingGPS ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <MapPin className="w-4 h-4" />
                  )}
                  {isDetectingGPS ? "Detecting..." : "GPS"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalArea">Total Area (hectares) *</Label>
                <Input
                  id="totalArea"
                  type="number"
                  step="0.1"
                  value={newMapping.totalAreaHectares}
                  onChange={(e) => setNewMapping(prev => ({ ...prev, totalAreaHectares: e.target.value }))}
                  placeholder="e.g., 2.5"
                  data-testid="input-total-area"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="elevation">Elevation (meters)</Label>
                <Input
                  id="elevation"
                  type="number"
                  value={newMapping.elevationMeters}
                  onChange={(e) => setNewMapping(prev => ({ ...prev, elevationMeters: e.target.value }))}
                  placeholder="e.g., 150"
                  data-testid="input-elevation"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slope">Slope *</Label>
                <Select value={newMapping.slope} onValueChange={(value) => setNewMapping(prev => ({ ...prev, slope: value }))}>
                  <SelectTrigger data-testid="select-slope">
                    <SelectValue placeholder="Select slope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat (0-3%)</SelectItem>
                    <SelectItem value="gentle">Gentle (3-8%)</SelectItem>
                    <SelectItem value="moderate">Moderate (8-15%)</SelectItem>
                    <SelectItem value="steep">Steep (15-25%)</SelectItem>
                    <SelectItem value="very_steep">Very Steep (&gt;25%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type *</Label>
                <Select value={newMapping.soilType} onValueChange={(value) => setNewMapping(prev => ({ ...prev, soilType: value }))}>
                  <SelectTrigger data-testid="select-soil-type">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="loam">Loam</SelectItem>
                    <SelectItem value="sandy">Sandy</SelectItem>
                    <SelectItem value="silt">Silt</SelectItem>
                    <SelectItem value="rocky">Rocky</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterSource">Water Source *</Label>
                <Select value={newMapping.waterSource} onValueChange={(value) => setNewMapping(prev => ({ ...prev, waterSource: value }))}>
                  <SelectTrigger data-testid="select-water-source">
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="river">River</SelectItem>
                    <SelectItem value="well">Well</SelectItem>
                    <SelectItem value="rain">Rainfall</SelectItem>
                    <SelectItem value="irrigation">Irrigation System</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drainageStatus">Drainage Status *</Label>
                <Select value={newMapping.drainageStatus} onValueChange={(value) => setNewMapping(prev => ({ ...prev, drainageStatus: value }))}>
                  <SelectTrigger data-testid="select-drainage">
                    <SelectValue placeholder="Select drainage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="waterlogged">Waterlogged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soilHealth">Soil Health Status *</Label>
                <Select value={newMapping.soilHealthStatus} onValueChange={(value) => setNewMapping(prev => ({ ...prev, soilHealthStatus: value }))}>
                  <SelectTrigger data-testid="select-soil-health">
                    <SelectValue placeholder="Select soil health" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="degraded">Degraded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accessRoad">Access Road *</Label>
              <Input
                id="accessRoad"
                value={newMapping.accessRoad}
                onChange={(e) => setNewMapping(prev => ({ ...prev, accessRoad: e.target.value }))}
                placeholder="Describe road access to the land"
                data-testid="input-access-road"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nearbyLandmarks">Nearby Landmarks *</Label>
              <Textarea
                id="nearbyLandmarks"
                value={newMapping.nearbyLandmarks}
                onChange={(e) => setNewMapping(prev => ({ ...prev, nearbyLandmarks: e.target.value }))}
                placeholder="Describe nearby landmarks, buildings, or notable features"
                rows={2}
                data-testid="input-landmarks"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousCrop">Previous Crop History *</Label>
              <Textarea
                id="previousCrop"
                value={newMapping.previousCropHistory}
                onChange={(e) => setNewMapping(prev => ({ ...prev, previousCropHistory: e.target.value }))}
                placeholder="What crops were grown here before?"
                rows={2}
                data-testid="input-crop-history"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="irrigation">Irrigation System</Label>
              <Input
                id="irrigation"
                value={newMapping.irrigationSystem}
                onChange={(e) => setNewMapping(prev => ({ ...prev, irrigationSystem: e.target.value }))}
                placeholder="Describe any irrigation systems"
                data-testid="input-irrigation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="risks">Environmental Risks</Label>
              <Textarea
                id="risks"
                value={newMapping.environmentalRisks}
                onChange={(e) => setNewMapping(prev => ({ ...prev, environmentalRisks: e.target.value }))}
                placeholder="Describe any environmental risks (flooding, pests, etc.)"
                rows={2}
                data-testid="input-risks"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowNewMappingDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMapping.mutate(newMapping)}
              disabled={!newMapping.landName || !newMapping.landType || !newMapping.coordinates || !newMapping.totalAreaHectares || createMapping.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-save-mapping"
            >
              {createMapping.isPending ? "Saving..." : "Save Land Mapping"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Harvest Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Harvest Schedule</DialogTitle>
            <DialogDescription>
              Plan your planting and harvest schedule for this land plot.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type *</Label>
                <Select value={newSchedule.cropType} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, cropType: value }))}>
                  <SelectTrigger data-testid="select-crop-type">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="cocoa">Cocoa</SelectItem>
                    <SelectItem value="coffee">Coffee</SelectItem>
                    <SelectItem value="cassava">Cassava</SelectItem>
                    <SelectItem value="plantain">Plantain</SelectItem>
                    <SelectItem value="palm_oil">Palm Oil</SelectItem>
                    <SelectItem value="rubber">Rubber</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="variety">Variety</Label>
                <Input
                  id="variety"
                  value={newSchedule.variety}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, variety: e.target.value }))}
                  placeholder="e.g., NERICA-4, Trinitario"
                  data-testid="input-variety"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Planting Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newSchedule.plantingStartDate && "text-muted-foreground"
                      )}
                      data-testid="button-planting-start-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSchedule.plantingStartDate ? format(newSchedule.plantingStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSchedule.plantingStartDate}
                      onSelect={(date) => date && setNewSchedule(prev => ({ ...prev, plantingStartDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Planting End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newSchedule.plantingEndDate && "text-muted-foreground"
                      )}
                      data-testid="button-planting-end-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSchedule.plantingEndDate ? format(newSchedule.plantingEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSchedule.plantingEndDate}
                      onSelect={(date) => date && setNewSchedule(prev => ({ ...prev, plantingEndDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expected Harvest Start *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newSchedule.expectedHarvestStartDate && "text-muted-foreground"
                      )}
                      data-testid="button-harvest-start-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSchedule.expectedHarvestStartDate ? format(newSchedule.expectedHarvestStartDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSchedule.expectedHarvestStartDate}
                      onSelect={(date) => date && setNewSchedule(prev => ({ ...prev, expectedHarvestStartDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Expected Harvest End *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newSchedule.expectedHarvestEndDate && "text-muted-foreground"
                      )}
                      data-testid="button-harvest-end-date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newSchedule.expectedHarvestEndDate ? format(newSchedule.expectedHarvestEndDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newSchedule.expectedHarvestEndDate}
                      onSelect={(date) => date && setNewSchedule(prev => ({ ...prev, expectedHarvestEndDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedYield">Expected Yield (kg) *</Label>
                <Input
                  id="estimatedYield"
                  type="number"
                  value={newSchedule.estimatedYieldKg}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, estimatedYieldKg: e.target.value }))}
                  placeholder="e.g., 2500"
                  data-testid="input-estimated-yield"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="laborRequirements">Labor Requirements *</Label>
                <Input
                  id="laborRequirements"
                  type="number"
                  value={newSchedule.laborRequirements}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, laborRequirements: e.target.value }))}
                  placeholder="Number of workers"
                  data-testid="input-labor-requirements"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricePerKg">Price per kg ($)</Label>
                <Input
                  id="pricePerKg"
                  type="number"
                  step="0.01"
                  value={newSchedule.pricePerKg}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, pricePerKg: e.target.value }))}
                  placeholder="e.g., 2.50"
                  data-testid="input-price-per-kg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="harvestMethod">Harvest Method *</Label>
                <Select value={newSchedule.harvestMethod} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, harvestMethod: value }))}>
                  <SelectTrigger data-testid="select-harvest-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="mechanical">Mechanical</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualityGrade">Quality Target Grade *</Label>
                <Select value={newSchedule.qualityTargetGrade} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, qualityTargetGrade: value }))}>
                  <SelectTrigger data-testid="select-quality-grade">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="grade_a">Grade A</SelectItem>
                    <SelectItem value="grade_b">Grade B</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certification">Certification Required *</Label>
              <Select value={newSchedule.certificationRequired} onValueChange={(value) => setNewSchedule(prev => ({ ...prev, certificationRequired: value }))}>
                <SelectTrigger data-testid="select-certification">
                  <SelectValue placeholder="Select certification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organic">Organic</SelectItem>
                  <SelectItem value="fairtrade">Fair Trade</SelectItem>
                  <SelectItem value="rainforest">Rainforest Alliance</SelectItem>
                  <SelectItem value="eudr">EUDR Compliant</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marketDestination">Market Destination</Label>
                <Input
                  id="marketDestination"
                  value={newSchedule.marketDestination}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, marketDestination: e.target.value }))}
                  placeholder="e.g., Local market, Export"
                  data-testid="input-market-destination"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerInfo">Buyer Information</Label>
                <Input
                  id="buyerInfo"
                  value={newSchedule.buyerInformation}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, buyerInformation: e.target.value }))}
                  placeholder="Buyer name or company"
                  data-testid="input-buyer-info"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment Needed</Label>
              <Textarea
                id="equipment"
                value={newSchedule.equipmentNeeded}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, equipmentNeeded: e.target.value }))}
                placeholder="List any special equipment needed"
                rows={2}
                data-testid="input-equipment"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weatherDeps">Weather Dependencies</Label>
              <Textarea
                id="weatherDeps"
                value={newSchedule.weatherDependencies}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, weatherDependencies: e.target.value }))}
                placeholder="How weather might affect this schedule"
                rows={2}
                data-testid="input-weather-deps"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskFactors">Risk Factors</Label>
              <Textarea
                id="riskFactors"
                value={newSchedule.riskFactors}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, riskFactors: e.target.value }))}
                placeholder="Potential risks and challenges"
                rows={2}
                data-testid="input-risk-factors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contingency">Contingency Plans</Label>
              <Textarea
                id="contingency"
                value={newSchedule.contingencyPlans}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, contingencyPlans: e.target.value }))}
                placeholder="Backup plans if issues arise"
                rows={2}
                data-testid="input-contingency"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createSchedule.mutate(newSchedule)}
              disabled={!newSchedule.cropType || !newSchedule.estimatedYieldKg || !newSchedule.laborRequirements || !newSchedule.harvestMethod || !newSchedule.qualityTargetGrade || !newSchedule.certificationRequired || createSchedule.isPending}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-save-schedule"
            >
              {createSchedule.isPending ? "Saving..." : "Save Harvest Schedule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}