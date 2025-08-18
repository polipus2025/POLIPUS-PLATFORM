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
import { CalendarIcon, MapPin, TreePine, CheckCircle, AlertCircle, Clock, Users, Leaf, Sprout, Target, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  notes?: string;
  nextInspectionDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface LandMappingInspection {
  id: number;
  inspectionId: string;
  landMappingId: number;
  farmerId: number;
  inspectorId: string;
  inspectionDate: Date;
  inspectionType: string;
  soilConditionScore: number;
  cropHealthScore: number;
  environmentalComplianceScore: number;
  overallScore: number;
  recommendations: string;
  actionItems: string;
  followUpRequired: boolean;
  nextInspectionDate?: Date;
  certificationEligible: boolean;
  nonComplianceIssues?: string;
  correctiveActionsRequired?: string;
  photosUploaded: boolean;
  gpsVerified: boolean;
  farmerSignature: boolean;
  inspectorNotes?: string;
  weatherConditions?: string;
  status: string;
}

export default function LandMappingDashboard() {
  const [selectedTab, setSelectedTab] = useState("mappings");
  const [selectedMapping, setSelectedMapping] = useState<FarmerLandMapping | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<HarvestSchedule | null>(null);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showInspectionDialog, setShowInspectionDialog] = useState(false);
  const [filters, setFilters] = useState({
    complianceStatus: '',
    cropType: '',
    inspectionStatus: '',
    status: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch land mappings
  const { data: landMappings = [], isLoading: loadingMappings } = useQuery<FarmerLandMapping[]>({
    queryKey: ["/api/farmer-land-mappings"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch harvest schedules
  const { data: harvestSchedules = [], isLoading: loadingSchedules } = useQuery<HarvestSchedule[]>({
    queryKey: ["/api/harvest-schedules"],
    refetchInterval: 30000,
  });

  // Fetch upcoming harvests
  const { data: upcomingHarvests = [] } = useQuery<HarvestSchedule[]>({
    queryKey: ["/api/harvest-schedules", { upcoming: true }],
    refetchInterval: 30000,
  });

  // Fetch land mapping inspections
  const { data: inspections = [], isLoading: loadingInspections } = useQuery<any[]>({
    queryKey: ["/api/land-mapping-inspections"],
    refetchInterval: 30000,
  });

  // Approve land mapping mutation
  const approveMapping = useMutation({
    mutationFn: async (data: { id: number; inspectorId: string }) => {
      return await apiRequest("PATCH", `/api/farmer-land-mappings/${data.id}/approve`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-land-mappings"] });
      toast({
        title: "Mapping Approved",
        description: "Land mapping has been approved successfully.",
      });
      setSelectedMapping(null);
    },
    onError: () => {
      toast({
        title: "Approval Failed",
        description: "Failed to approve land mapping.",
        variant: "destructive",
      });
    }
  });

  // Approve harvest schedule mutation
  const approveSchedule = useMutation({
    mutationFn: async (data: { id: number; inspectorId: string }) => {
      return await apiRequest("PATCH", `/api/harvest-schedules/${data.id}/approve`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/harvest-schedules"] });
      toast({
        title: "Schedule Approved",
        description: "Harvest schedule has been approved successfully.",
      });
      setSelectedSchedule(null);
    },
    onError: () => {
      toast({
        title: "Approval Failed",
        description: "Failed to approve harvest schedule.",
        variant: "destructive",
      });
    }
  });

  // Create inspection mutation
  const createInspection = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/land-mapping-inspections", {}, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/land-mapping-inspections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-land-mappings"] });
      toast({
        title: "Inspection Created",
        description: "Land mapping inspection has been created successfully.",
      });
      setShowInspectionDialog(false);
      setSelectedMapping(null);
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create land mapping inspection.",
        variant: "destructive",
      });
    }
  });

  // Filter functions
  const filteredMappings = landMappings.filter((mapping: FarmerLandMapping) => {
    return (
      (!filters.complianceStatus || mapping.complianceStatus === filters.complianceStatus) &&
      (!filters.inspectionStatus || mapping.inspectionStatus === filters.inspectionStatus)
    );
  });

  const filteredSchedules = harvestSchedules.filter((schedule: HarvestSchedule) => {
    return (
      (!filters.cropType || schedule.cropType === filters.cropType) &&
      (!filters.status || schedule.status === filters.status)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'compliant':
      case 'certified':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'review_required':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'non_compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Statistics
  const stats = {
    totalMappings: landMappings.length,
    approvedMappings: landMappings.filter((m: FarmerLandMapping) => m.complianceStatus === 'approved').length,
    pendingMappings: landMappings.filter((m: FarmerLandMapping) => m.complianceStatus === 'pending').length,
    totalSchedules: harvestSchedules.length,
    upcomingCount: upcomingHarvests.length,
    totalInspections: inspections.length,
    totalArea: landMappings.reduce((sum: number, m: FarmerLandMapping) => sum + m.totalAreaHectares, 0),
    avgYield: harvestSchedules.length > 0 
      ? Math.round(harvestSchedules.reduce((sum: number, s: HarvestSchedule) => sum + s.estimatedYieldKg, 0) / harvestSchedules.length) 
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Land Mapping & Harvest Management
              </h1>
              <p className="text-slate-600 mt-2">Comprehensive agricultural land management system</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                <MapPin className="h-4 w-4 mr-2" />
                Land Inspector Portal
              </Badge>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Land Mappings</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{stats.totalMappings}</div>
              <p className="text-xs text-green-600">
                {stats.approvedMappings} approved, {stats.pendingMappings} pending
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Area</CardTitle>
              <TreePine className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">{stats.totalArea.toFixed(1)} Ha</div>
              <p className="text-xs text-blue-600">Under management</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Harvest Schedules</CardTitle>
              <Sprout className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800">{stats.totalSchedules}</div>
              <p className="text-xs text-orange-600">{stats.upcomingCount} upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Avg. Yield</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{stats.avgYield} kg</div>
              <p className="text-xs text-purple-600">Per harvest schedule</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="mappings" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <MapPin className="h-4 w-4 mr-2" />
              Land Mappings
            </TabsTrigger>
            <TabsTrigger value="schedules" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Sprout className="h-4 w-4 mr-2" />
              Harvest Schedules
            </TabsTrigger>
            <TabsTrigger value="inspections" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Eye className="h-4 w-4 mr-2" />
              Inspections
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Clock className="h-4 w-4 mr-2" />
              Upcoming Harvests
            </TabsTrigger>
          </TabsList>

          {/* Land Mappings Tab */}
          <TabsContent value="mappings" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Land Mappings Management</span>
                  <div className="flex space-x-2">
                    <Select value={filters.complianceStatus} onValueChange={(value) => setFilters(prev => ({...prev, complianceStatus: value}))}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {loadingMappings ? (
                    <div className="text-center py-8">Loading land mappings...</div>
                  ) : filteredMappings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No land mappings found</div>
                  ) : (
                    filteredMappings.map((mapping: FarmerLandMapping) => (
                      <Card key={mapping.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{mapping.landName}</h3>
                                <Badge className={getStatusColor(mapping.complianceStatus)}>
                                  {mapping.complianceStatus}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Farmer:</span>
                                  <p className="font-medium">{mapping.farmerName}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Area:</span>
                                  <p className="font-medium">{mapping.totalAreaHectares} Ha</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Land Type:</span>
                                  <p className="font-medium">{mapping.landType}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Soil Type:</span>
                                  <p className="font-medium">{mapping.soilType}</p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Coordinates:</span> {mapping.coordinates}
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedMapping(mapping)}
                                data-testid={`button-view-mapping-${mapping.id}`}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              {mapping.complianceStatus === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => approveMapping.mutate({ id: mapping.id, inspectorId: 'current-inspector' })}
                                    disabled={approveMapping.isPending}
                                    className="bg-green-600 hover:bg-green-700"
                                    data-testid={`button-approve-mapping-${mapping.id}`}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setSelectedMapping(mapping);
                                      setShowInspectionDialog(true);
                                    }}
                                    data-testid={`button-inspect-mapping-${mapping.id}`}
                                  >
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Schedule Inspection
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Harvest Schedules Tab */}
          <TabsContent value="schedules" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Harvest Schedules Management</span>
                  <div className="flex space-x-2">
                    <Select value={filters.cropType} onValueChange={(value) => setFilters(prev => ({...prev, cropType: value}))}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Crops</SelectItem>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="cocoa">Cocoa</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="cassava">Cassava</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({...prev, status: value}))}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="planted">Planted</SelectItem>
                        <SelectItem value="growing">Growing</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {loadingSchedules ? (
                    <div className="text-center py-8">Loading harvest schedules...</div>
                  ) : filteredSchedules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No harvest schedules found</div>
                  ) : (
                    filteredSchedules.map((schedule: HarvestSchedule) => (
                      <Card key={schedule.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{schedule.cropType}</h3>
                                {schedule.variety && (
                                  <Badge variant="secondary">{schedule.variety}</Badge>
                                )}
                                <Badge className={getStatusColor(schedule.status)}>
                                  {schedule.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Expected Yield:</span>
                                  <p className="font-medium">{schedule.estimatedYieldKg} kg</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Harvest Start:</span>
                                  <p className="font-medium">{format(new Date(schedule.expectedHarvestStartDate), 'PP')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Quality Target:</span>
                                  <p className="font-medium">{schedule.qualityTargetGrade}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Value:</span>
                                  <p className="font-medium">${schedule.totalEstimatedValue?.toLocaleString() || 'N/A'}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSchedule(schedule)}
                                data-testid={`button-view-schedule-${schedule.id}`}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              {schedule.status === 'planned' && !schedule.approvedBy && (
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => approveSchedule.mutate({ id: schedule.id, inspectorId: 'current-inspector' })}
                                  disabled={approveSchedule.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                  data-testid={`button-approve-schedule-${schedule.id}`}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inspections Tab */}
          <TabsContent value="inspections" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle>Land Mapping Inspections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {loadingInspections ? (
                    <div className="text-center py-8">Loading inspections...</div>
                  ) : inspections.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No inspections found</div>
                  ) : (
                    inspections.map((inspection: LandMappingInspection) => (
                      <Card key={inspection.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">Inspection #{inspection.inspectionId}</h3>
                                <Badge className={getStatusColor(inspection.status)}>
                                  {inspection.status}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Date:</span>
                                  <p className="font-medium">{format(new Date(inspection.inspectionDate), 'PP')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Type:</span>
                                  <p className="font-medium">{inspection.inspectionType}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Overall Score:</span>
                                  <p className="font-medium">{inspection.overallScore}/100</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Certification Eligible:</span>
                                  <p className="font-medium">{inspection.certificationEligible ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upcoming Harvests Tab */}
          <TabsContent value="upcoming" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle>Upcoming Harvests (Next 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {upcomingHarvests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No upcoming harvests in the next 30 days</div>
                  ) : (
                    upcomingHarvests.map((schedule: HarvestSchedule) => (
                      <Card key={schedule.id} className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg text-purple-800">{schedule.cropType}</h3>
                                {schedule.variety && (
                                  <Badge variant="secondary">{schedule.variety}</Badge>
                                )}
                                <Badge className="bg-purple-100 text-purple-800">
                                  {Math.ceil((new Date(schedule.expectedHarvestStartDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Expected Yield:</span>
                                  <p className="font-medium">{schedule.estimatedYieldKg} kg</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Start Date:</span>
                                  <p className="font-medium">{format(new Date(schedule.expectedHarvestStartDate), 'PP')}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">End Date:</span>
                                  <p className="font-medium">{format(new Date(schedule.expectedHarvestEndDate), 'PP')}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Land Mapping Details Dialog */}
        {selectedMapping && (
          <Dialog open={!!selectedMapping} onOpenChange={() => setSelectedMapping(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Land Mapping Details - {selectedMapping.landName}</DialogTitle>
                <DialogDescription>
                  Comprehensive information about this land mapping
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Basic Information</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Mapping ID:</strong> {selectedMapping.mappingId}</div>
                      <div><strong>Farmer Name:</strong> {selectedMapping.farmerName}</div>
                      <div><strong>Land Type:</strong> {selectedMapping.landType}</div>
                      <div><strong>Total Area:</strong> {selectedMapping.totalAreaHectares} hectares</div>
                      <div><strong>Coordinates:</strong> {selectedMapping.coordinates}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Soil & Environment</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Soil Type:</strong> {selectedMapping.soilType}</div>
                      <div><strong>Water Source:</strong> {selectedMapping.waterSource}</div>
                      <div><strong>Slope:</strong> {selectedMapping.slope}</div>
                      <div><strong>Drainage:</strong> {selectedMapping.drainageStatus}</div>
                      {selectedMapping.elevationMeters && (
                        <div><strong>Elevation:</strong> {selectedMapping.elevationMeters}m</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Infrastructure & Access</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Access Road:</strong> {selectedMapping.accessRoad}</div>
                      <div><strong>Nearby Landmarks:</strong> {selectedMapping.nearbyLandmarks}</div>
                      {selectedMapping.irrigationSystem && (
                        <div><strong>Irrigation:</strong> {selectedMapping.irrigationSystem}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status & Compliance</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Compliance Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedMapping.complianceStatus)}`}>
                          {selectedMapping.complianceStatus}
                        </Badge>
                      </div>
                      <div><strong>Inspection Status:</strong> {selectedMapping.inspectionStatus}</div>
                      <div><strong>Soil Health:</strong> {selectedMapping.soilHealthStatus}</div>
                      {selectedMapping.approvedBy && (
                        <div><strong>Approved By:</strong> {selectedMapping.approvedBy}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {selectedMapping.previousCropHistory && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Previous Crop History</Label>
                  <p className="mt-2 text-sm text-gray-600">{selectedMapping.previousCropHistory}</p>
                </div>
              )}
              {selectedMapping.environmentalRisks && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Environmental Risks</Label>
                  <p className="mt-2 text-sm text-red-600">{selectedMapping.environmentalRisks}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Harvest Schedule Details Dialog */}
        {selectedSchedule && (
          <Dialog open={!!selectedSchedule} onOpenChange={() => setSelectedSchedule(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Harvest Schedule Details - {selectedSchedule.cropType}</DialogTitle>
                <DialogDescription>
                  Comprehensive harvest planning information
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Schedule Information</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Schedule ID:</strong> {selectedSchedule.scheduleId}</div>
                      <div><strong>Crop Type:</strong> {selectedSchedule.cropType}</div>
                      {selectedSchedule.variety && <div><strong>Variety:</strong> {selectedSchedule.variety}</div>}
                      <div><strong>Status:</strong> 
                        <Badge className={`ml-2 ${getStatusColor(selectedSchedule.status)}`}>
                          {selectedSchedule.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Planting Schedule</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Planting Start:</strong> {format(new Date(selectedSchedule.plantingStartDate), 'PP')}</div>
                      <div><strong>Planting End:</strong> {format(new Date(selectedSchedule.plantingEndDate), 'PP')}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Harvest Schedule</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Expected Start:</strong> {format(new Date(selectedSchedule.expectedHarvestStartDate), 'PP')}</div>
                      <div><strong>Expected End:</strong> {format(new Date(selectedSchedule.expectedHarvestEndDate), 'PP')}</div>
                      <div><strong>Method:</strong> {selectedSchedule.harvestMethod}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Production Details</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Estimated Yield:</strong> {selectedSchedule.estimatedYieldKg} kg</div>
                      <div><strong>Quality Target:</strong> {selectedSchedule.qualityTargetGrade}</div>
                      <div><strong>Labor Requirements:</strong> {selectedSchedule.laborRequirements} workers</div>
                      {selectedSchedule.equipmentNeeded && (
                        <div><strong>Equipment Needed:</strong> {selectedSchedule.equipmentNeeded}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Market Information</Label>
                    <div className="mt-2 space-y-2 text-sm">
                      <div><strong>Certification Required:</strong> {selectedSchedule.certificationRequired}</div>
                      {selectedSchedule.marketDestination && (
                        <div><strong>Market Destination:</strong> {selectedSchedule.marketDestination}</div>
                      )}
                      {selectedSchedule.pricePerKg && (
                        <div><strong>Price per kg:</strong> ${selectedSchedule.pricePerKg}</div>
                      )}
                      {selectedSchedule.totalEstimatedValue && (
                        <div><strong>Total Estimated Value:</strong> ${selectedSchedule.totalEstimatedValue.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {selectedSchedule.riskFactors && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Risk Factors</Label>
                  <p className="mt-2 text-sm text-orange-600">{selectedSchedule.riskFactors}</p>
                </div>
              )}
              {selectedSchedule.contingencyPlans && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Contingency Plans</Label>
                  <p className="mt-2 text-sm text-blue-600">{selectedSchedule.contingencyPlans}</p>
                </div>
              )}
              {selectedSchedule.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Notes</Label>
                  <p className="mt-2 text-sm text-gray-600">{selectedSchedule.notes}</p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}

        {/* Schedule Inspection Dialog */}
        {showInspectionDialog && selectedMapping && (
          <Dialog open={showInspectionDialog} onOpenChange={setShowInspectionDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Land Mapping Inspection</DialogTitle>
                <DialogDescription>
                  Schedule a comprehensive inspection for {selectedMapping.landName}
                </DialogDescription>
              </DialogHeader>
              <InspectionForm 
                landMapping={selectedMapping} 
                onSubmit={(data) => createInspection.mutate(data)}
                onCancel={() => setShowInspectionDialog(false)}
                isLoading={createInspection.isPending}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

// Inspection Form Component
function InspectionForm({ 
  landMapping, 
  onSubmit, 
  onCancel, 
  isLoading 
}: { 
  landMapping: FarmerLandMapping; 
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    inspectionDate: new Date(),
    inspectionType: 'routine',
    recommendations: '',
    actionItems: '',
    followUpRequired: false,
    nextInspectionDate: null as Date | null,
    inspectorNotes: '',
    weatherConditions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      landMappingId: landMapping.id,
      farmerId: landMapping.farmerId,
      inspectorId: 'current-inspector',
      inspectionDate: formData.inspectionDate,
      inspectionType: formData.inspectionType,
      soilConditionScore: 85, // Default scores for demo
      cropHealthScore: 80,
      environmentalComplianceScore: 90,
      overallScore: 85,
      recommendations: formData.recommendations,
      actionItems: formData.actionItems,
      followUpRequired: formData.followUpRequired,
      nextInspectionDate: formData.nextInspectionDate,
      certificationEligible: true,
      photosUploaded: false,
      gpsVerified: true,
      farmerSignature: false,
      inspectorNotes: formData.inspectorNotes,
      weatherConditions: formData.weatherConditions,
      status: 'scheduled'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="inspectionDate">Inspection Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.inspectionDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.inspectionDate ? format(formData.inspectionDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.inspectionDate}
                onSelect={(date) => setFormData(prev => ({ ...prev, inspectionDate: date || new Date() }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="inspectionType">Inspection Type</Label>
          <Select value={formData.inspectionType} onValueChange={(value) => setFormData(prev => ({...prev, inspectionType: value}))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="routine">Routine Inspection</SelectItem>
              <SelectItem value="compliance">Compliance Check</SelectItem>
              <SelectItem value="certification">Certification Assessment</SelectItem>
              <SelectItem value="follow_up">Follow-up Inspection</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="recommendations">Recommendations</Label>
        <Textarea
          id="recommendations"
          value={formData.recommendations}
          onChange={(e) => setFormData(prev => ({...prev, recommendations: e.target.value}))}
          placeholder="Enter inspection recommendations..."
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="actionItems">Action Items</Label>
        <Textarea
          id="actionItems"
          value={formData.actionItems}
          onChange={(e) => setFormData(prev => ({...prev, actionItems: e.target.value}))}
          placeholder="List specific action items for the farmer..."
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="inspectorNotes">Inspector Notes</Label>
        <Textarea
          id="inspectorNotes"
          value={formData.inspectorNotes}
          onChange={(e) => setFormData(prev => ({...prev, inspectorNotes: e.target.value}))}
          placeholder="Additional notes and observations..."
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="weatherConditions">Weather Conditions</Label>
        <Input
          id="weatherConditions"
          value={formData.weatherConditions}
          onChange={(e) => setFormData(prev => ({...prev, weatherConditions: e.target.value}))}
          placeholder="e.g., Sunny, 28°C, Light breeze"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="followUpRequired"
          checked={formData.followUpRequired}
          onChange={(e) => setFormData(prev => ({...prev, followUpRequired: e.target.checked}))}
          className="rounded"
        />
        <Label htmlFor="followUpRequired">Follow-up inspection required</Label>
      </div>
      {formData.followUpRequired && (
        <div>
          <Label htmlFor="nextInspectionDate">Next Inspection Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !formData.nextInspectionDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.nextInspectionDate ? format(formData.nextInspectionDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.nextInspectionDate || undefined}
                onSelect={(date) => setFormData(prev => ({ ...prev, nextInspectionDate: date || null }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} data-testid="button-schedule-inspection">
          {isLoading ? 'Scheduling...' : 'Schedule Inspection'}
        </Button>
      </div>
    </form>
  );
}