import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { 
  Calendar, Clock, Sprout, Package, DollarSign, Users, 
  Plus, Edit, Eye, CheckCircle, AlertCircle, TrendingUp,
  MapPin, Leaf, Bell, ArrowRight
} from "lucide-react";

// Types for crop scheduling
interface CropSchedule {
  id: number;
  scheduleId: string;
  cropType: string;
  cropVariety: string;
  plotId: string;
  plotName: string;
  plantingArea: number;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  expectedYield: number;
  actualYield?: number;
  status: 'planned' | 'planted' | 'growing' | 'ready_for_harvest' | 'harvested' | 'completed';
  marketStatus: 'not_listed' | 'listed' | 'sold' | 'available';
  qualityGrade?: string;
  storageLocation?: string;
  pricePerKg?: number;
  buyerInterest: number;
  createdAt: string;
}

interface CropListing {
  id: number;
  listingId: string;
  scheduleId: string;
  cropType: string;
  cropVariety: string;
  quantityAvailable: number;
  pricePerKg: number;
  harvestDate: string;
  qualityGrade: string;
  status: 'active' | 'sold' | 'expired';
  viewCount: number;
  inquiryCount: number;
  location: string;
}

const CROP_TYPES = [
  { value: 'cocoa', label: 'Cocoa', varieties: ['Trinitario', 'Forestero', 'Criollo', 'Hybrid'] },
  { value: 'coffee', label: 'Coffee', varieties: ['Arabica', 'Robusta', 'Liberica'] },
  { value: 'palm_oil', label: 'Palm Oil', varieties: ['Tenera', 'Dura', 'Pisifera'] },
  { value: 'rubber', label: 'Rubber', varieties: ['RRIM 600', 'GT 1', 'PB 217'] },
  { value: 'rice', label: 'Rice', varieties: ['NERICA', 'Jasmine', 'Basmati'] },
  { value: 'cassava', label: 'Cassava', varieties: ['TMS 30572', 'TME 419', 'Local variety'] }
];

const QUALITY_GRADES = ['Grade I', 'Grade II', 'Premium', 'Standard', 'Export Quality'];

export default function CropScheduling() {
  const { toast } = useToast();
  const [farmerId] = useState(() => localStorage.getItem("farmerId") || "");
  const [activeTab, setActiveTab] = useState("schedules");
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<CropSchedule | null>(null);

  // Fetch crop schedules
  const { data: cropSchedules, isLoading: loadingSchedules } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/crop-schedules`],
    enabled: !!farmerId
  });

  // Fetch crop listings
  const { data: cropListings, isLoading: loadingListings } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/crop-listings`],
    enabled: !!farmerId
  });

  // Fetch land plots for dropdown
  const { data: landPlots } = useQuery({
    queryKey: [`/api/farmers/${farmerId}/land-mappings`],
    enabled: !!farmerId
  });

  // Mutations
  const createScheduleMutation = useMutation({
    mutationFn: (scheduleData: any) => apiRequest('/api/farmers/crop-schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/farmers/${farmerId}/crop-schedules`] });
      setIsCreateScheduleOpen(false);
      toast({
        title: "Crop Schedule Created",
        description: "Your crop planting schedule has been created successfully."
      });
    }
  });

  const createListingMutation = useMutation({
    mutationFn: (listingData: any) => apiRequest('/api/farmers/crop-listings', {
      method: 'POST',
      body: JSON.stringify(listingData)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/farmers/${farmerId}/crop-listings`] });
      setIsCreateListingOpen(false);
      toast({
        title: "Crop Listed for Sale",
        description: "Your crop is now available for buyers to view and purchase."
      });
    }
  });

  const markHarvestedMutation = useMutation({
    mutationFn: ({ scheduleId, actualYield, qualityGrade }: any) => 
      apiRequest(`/api/farmers/crop-schedules/${scheduleId}/harvest`, {
        method: 'PUT',
        body: JSON.stringify({ actualYield, qualityGrade, harvestDate: new Date().toISOString() })
      }),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: [`/api/farmers/${farmerId}/crop-schedules`] });
      
      // Show automatic batch code generation success
      toast({
        title: "🎉 Harvest Completed - Batch Code Generated!",
        description: `Batch Code: ${response.batchCode || 'BATCH-GENERATED'}. All stakeholders automatically notified.`
      });
      
      // Show automatic notifications after 2 seconds
      setTimeout(() => {
        toast({
          title: "📋 Automatic Stakeholder Notifications",
          description: "Land Inspector, Warehouse Inspector, and all regulatory panels (DG/DDGOTS/DDGAF) have been notified."
        });
      }, 2000);
      
      // Show marketplace eligibility after 4 seconds
      setTimeout(() => {
        toast({
          title: "🛒 Marketplace Ready",
          description: "Your harvest is now eligible for marketplace listing and visible to buyers."
        });
      }, 4000);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'planted': return 'bg-blue-100 text-blue-800';
      case 'growing': return 'bg-yellow-100 text-yellow-800';
      case 'ready_for_harvest': return 'bg-green-100 text-green-800';
      case 'harvested': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketStatusColor = (status: string) => {
    switch (status) {
      case 'not_listed': return 'bg-gray-100 text-gray-800';
      case 'listed': return 'bg-blue-100 text-blue-800';
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateSchedule = (formData: FormData) => {
    const scheduleData = {
      farmerId,
      cropType: formData.get('cropType'),
      cropVariety: formData.get('cropVariety'),
      plotId: formData.get('plotId'),
      plantingArea: parseFloat(formData.get('plantingArea') as string),
      plantingDate: formData.get('plantingDate'),
      expectedHarvestDate: formData.get('expectedHarvestDate'),
      expectedYield: parseFloat(formData.get('expectedYield') as string),
      status: 'planned'
    };
    
    createScheduleMutation.mutate(scheduleData);
  };

  const handleCreateListing = (formData: FormData) => {
    const listingData = {
      farmerId,
      scheduleId: selectedSchedule?.id,
      cropType: formData.get('cropType'),
      cropVariety: formData.get('cropVariety'),
      quantityAvailable: parseFloat(formData.get('quantityAvailable') as string),
      pricePerKg: parseFloat(formData.get('pricePerKg') as string),
      qualityGrade: formData.get('qualityGrade'),
      harvestDate: formData.get('harvestDate'),
      storageLocation: formData.get('storageLocation'),
      status: 'active'
    };
    
    createListingMutation.mutate(listingData);
  };

  const handleMarkHarvested = (schedule: CropSchedule) => {
    const actualYield = prompt(`Enter actual yield for ${schedule.cropType} (kg):`, schedule.expectedYield.toString());
    const qualityGrade = prompt('Enter quality grade (Grade I, Grade II, Premium, Standard):', 'Grade I');
    
    if (actualYield && qualityGrade) {
      markHarvestedMutation.mutate({
        scheduleId: schedule.id,
        actualYield: parseFloat(actualYield),
        qualityGrade
      });
    }
  };

  const handleCreateListingFromSchedule = (schedule: CropSchedule) => {
    setSelectedSchedule(schedule);
    setIsCreateListingOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop Scheduling & Harvest Management</h1>
          <p className="text-gray-600">Plan your crops, schedule harvests, and connect with buyers</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Crops</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(cropSchedules) ? cropSchedules.filter((s: any) => s.status !== 'completed').length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ready to Harvest</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(cropSchedules) ? cropSchedules.filter((s: any) => s.status === 'ready_for_harvest').length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Listed for Sale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(cropListings) ? cropListings.filter((l: any) => l.status === 'active').length : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Buyer Interest</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Array.isArray(cropListings) ? cropListings.reduce((sum: any, l: any) => sum + (l.inquiryCount || 0), 0) : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedules" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Crop Schedules
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Marketplace Listings
            </TabsTrigger>
            <TabsTrigger value="buyer-connections" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Buyer Connections
            </TabsTrigger>
          </TabsList>

          {/* Crop Schedules Tab */}
          <TabsContent value="schedules" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Crop Planting & Harvest Schedules</h2>
              <Dialog open={isCreateScheduleOpen} onOpenChange={setIsCreateScheduleOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule New Crop
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Schedule New Crop Planting</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateSchedule(new FormData(e.currentTarget));
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cropType">Crop Type</Label>
                        <Select name="cropType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop type" />
                          </SelectTrigger>
                          <SelectContent>
                            {CROP_TYPES.map((crop) => (
                              <SelectItem key={crop.value} value={crop.value}>{crop.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="cropVariety">Crop Variety</Label>
                        <Select name="cropVariety" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select variety" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trinitario">Trinitario</SelectItem>
                            <SelectItem value="forestero">Forestero</SelectItem>
                            <SelectItem value="arabica">Arabica</SelectItem>
                            <SelectItem value="robusta">Robusta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plotId">Farm Plot</Label>
                        <Select name="plotId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select plot" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.isArray(landPlots) && landPlots.map((plot: any) => (
                              <SelectItem key={plot.id} value={plot.id}>
                                {plot.plotName} ({plot.plotSize} ha)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="plantingArea">Planting Area (hectares)</Label>
                        <Input name="plantingArea" type="number" step="0.1" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="plantingDate">Planting Date</Label>
                        <Input name="plantingDate" type="date" required />
                      </div>
                      <div>
                        <Label htmlFor="expectedHarvestDate">Expected Harvest Date</Label>
                        <Input name="expectedHarvestDate" type="date" required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="expectedYield">Expected Yield (kg)</Label>
                      <Input name="expectedYield" type="number" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={createScheduleMutation.isPending}>
                      {createScheduleMutation.isPending ? 'Creating...' : 'Create Schedule'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {loadingSchedules ? (
                <div className="text-center py-8">Loading crop schedules...</div>
              ) : Array.isArray(cropSchedules) && cropSchedules.length > 0 ? (
                cropSchedules.map((schedule: CropSchedule) => (
                  <Card key={schedule.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {schedule.cropType} - {schedule.cropVariety}
                            </h3>
                            <Badge className={getStatusColor(schedule.status)}>
                              {schedule.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge className={getMarketStatusColor(schedule.marketStatus)}>
                              {schedule.marketStatus.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Plot:</span> {schedule.plotName}
                            </div>
                            <div>
                              <span className="font-medium">Area:</span> {schedule.plantingArea} ha
                            </div>
                            <div>
                              <span className="font-medium">Planted:</span> {new Date(schedule.plantingDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Expected Harvest:</span> {new Date(schedule.expectedHarvestDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Expected Yield:</span> {schedule.expectedYield} kg
                            </div>
                            {schedule.actualYield && (
                              <div>
                                <span className="font-medium">Actual Yield:</span> {schedule.actualYield} kg
                              </div>
                            )}
                            {schedule.buyerInterest > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span>{schedule.buyerInterest} buyer inquiries</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {schedule.status === 'ready_for_harvest' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleMarkHarvested(schedule)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Mark Harvested
                            </Button>
                          )}
                          {schedule.status === 'harvested' && schedule.marketStatus === 'not_listed' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleCreateListingFromSchedule(schedule)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Package className="w-4 h-4 mr-1" />
                              List for Sale
                            </Button>
                          )}
                          {schedule.marketStatus === 'listed' && (
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View Listing
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Crop Schedules</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first crop planting schedule</p>
                    <Button onClick={() => setIsCreateScheduleOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule New Crop
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Marketplace Listings Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Marketplace Listings</h2>
              <Dialog open={isCreateListingOpen} onOpenChange={setIsCreateListingOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Marketplace Listing</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateListing(new FormData(e.currentTarget));
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cropType">Crop Type</Label>
                        <Input 
                          name="cropType" 
                          defaultValue={selectedSchedule?.cropType}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="cropVariety">Crop Variety</Label>
                        <Input 
                          name="cropVariety" 
                          defaultValue={selectedSchedule?.cropVariety}
                          required 
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="quantityAvailable">Quantity Available (kg)</Label>
                        <Input 
                          name="quantityAvailable" 
                          type="number" 
                          defaultValue={selectedSchedule?.actualYield}
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricePerKg">Price per kg (USD)</Label>
                        <Input name="pricePerKg" type="number" step="0.01" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="qualityGrade">Quality Grade</Label>
                        <Select name="qualityGrade" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {QUALITY_GRADES.map((grade) => (
                              <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="harvestDate">Harvest Date</Label>
                        <Input 
                          name="harvestDate" 
                          type="date" 
                          defaultValue={selectedSchedule?.actualHarvestDate?.split('T')[0]}
                          required 
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="storageLocation">Storage Location</Label>
                      <Input name="storageLocation" placeholder="e.g., Farm Warehouse A" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={createListingMutation.isPending}>
                      {createListingMutation.isPending ? 'Creating...' : 'Create Listing'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6">
              {loadingListings ? (
                <div className="text-center py-8">Loading marketplace listings...</div>
              ) : Array.isArray(cropListings) && cropListings.length > 0 ? (
                cropListings.map((listing: CropListing) => (
                  <Card key={listing.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {listing.cropType} - {listing.cropVariety}
                            </h3>
                            <Badge className={listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {listing.status.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="font-medium">Quantity:</span> {listing.quantityAvailable} kg
                            </div>
                            <div>
                              <span className="font-medium">Price:</span> ${listing.pricePerKg}/kg
                            </div>
                            <div>
                              <span className="font-medium">Quality:</span> {listing.qualityGrade}
                            </div>
                            <div>
                              <span className="font-medium">Harvested:</span> {new Date(listing.harvestDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4 text-gray-500" />
                              <span>{listing.viewCount} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-blue-500" />
                              <span>{listing.inquiryCount} inquiries</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-gray-500" />
                              <span>{listing.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Marketplace Listings</h3>
                    <p className="text-gray-600 mb-4">Create listings to connect with buyers</p>
                    <Button onClick={() => setIsCreateListingOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Listing
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Buyer Connections Tab */}
          <TabsContent value="buyer-connections" className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Buyer Connections & Transactions</h2>
            
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Buyer Interest Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {Array.isArray(cropListings) ? cropListings.reduce((sum: any, l: any) => sum + (l.viewCount || 0), 0) : 0}
                      </p>
                      <p className="text-sm text-gray-600">Total Profile Views</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {Array.isArray(cropListings) ? cropListings.reduce((sum: any, l: any) => sum + (l.inquiryCount || 0), 0) : 0}
                      </p>
                      <p className="text-sm text-gray-600">Buyer Inquiries</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {Array.isArray(cropListings) ? cropListings.filter((l: any) => l.status === 'sold').length : 0}
                      </p>
                      <p className="text-sm text-gray-600">Successful Sales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-orange-600" />
                    Recent Buyer Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">New inquiry for Cocoa - Trinitario</p>
                        <p className="text-sm text-gray-600">Monrovia Trading Company is interested in 500kg</p>
                      </div>
                      <Button size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Price negotiation ongoing</p>
                        <p className="text-sm text-gray-600">Atlantic Coffee Ltd - Coffee Arabica listing</p>
                      </div>
                      <Button size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Sale completed</p>
                        <p className="text-sm text-gray-600">West Africa Exports - 1200kg Palm Oil sold</p>
                      </div>
                      <Button size="sm">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}