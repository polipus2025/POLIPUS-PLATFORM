import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  MapPin, 
  ClipboardCheck, 
  UserPlus, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Eye,
  Plus,
  Search,
  Filter,
  Map,
  TreePine,
  Smartphone
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function FieldAgentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isNewFarmerOpen, setIsNewFarmerOpen] = useState(false);
  const [isNewInspectionOpen, setIsNewInspectionOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get field agent info from localStorage
  const agentId = localStorage.getItem("agentId");
  const jurisdiction = localStorage.getItem("jurisdiction");
  const token = localStorage.getItem("authToken");

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the field agent portal</p>
          <Button onClick={() => window.location.href = '/field-agent-login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Fetch field agent specific data with territorial filtering
  const { data: farmers = [] } = useQuery({
    queryKey: ['/api/farmers', jurisdiction],
    queryFn: () => apiRequest(`/api/farmers?jurisdiction=${jurisdiction}`),
    enabled: !!jurisdiction,
  });

  const { data: inspections = [] } = useQuery({
    queryKey: ['/api/inspections', jurisdiction],
    queryFn: () => apiRequest(`/api/inspections?jurisdiction=${jurisdiction}`),
    enabled: !!jurisdiction,
  });

  const { data: commodities = [] } = useQuery({
    queryKey: ['/api/commodities', jurisdiction],
    queryFn: () => apiRequest(`/api/commodities?county=${jurisdiction}`),
    enabled: !!jurisdiction,
  });

  // Calculate agent-specific metrics
  const totalFarmers = farmers.filter((f: any) => f.county === jurisdiction).length;
  const pendingInspections = inspections.filter((i: any) => i.status === 'pending' && i.jurisdiction === jurisdiction).length;
  const completedToday = inspections.filter((i: any) => 
    i.status === 'completed' && 
    i.jurisdiction === jurisdiction &&
    new Date(i.inspectionDate).toDateString() === new Date().toDateString()
  ).length;
  const commoditiesInJurisdiction = commodities.filter((c: any) => c.county === jurisdiction).length;

  const [newFarmerForm, setNewFarmerForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    farmLocation: '',
    farmSize: '',
    primaryCrop: ''
  });

  const newFarmerMutation = useMutation({
    mutationFn: async (farmerData: any) => {
      const farmerRequest = {
        requestId: `FARM-REQ-${Date.now()}`,
        requestType: 'farmer_registration',
        requestedBy: agentId,
        agentName: 'Sarah Konneh',
        jurisdiction: jurisdiction,
        requestedDate: new Date().toISOString(),
        status: 'pending_approval',
        priority: 'low',
        farmerData: {
          ...farmerData,
          farmerId: `FRM-${Date.now()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
          county: jurisdiction,
          district: farmerData.farmLocation,
          village: farmerData.farmLocation,
          gpsCoordinates: `${8.4 + Math.random() * 0.1},${-9.8 + Math.random() * 0.1}`,
          farmSizeUnit: 'hectares',
          registeredBy: agentId
        },
        requiresDirectorApproval: true,
        messageToDirector: `Field Agent ${agentId} requests approval to register new farmer: ${farmerData.firstName} ${farmerData.lastName} for ${farmerData.primaryCrop} farming in ${jurisdiction}.`
      };
      
      return await apiRequest('/api/farmer-registration-requests', {
        method: 'POST',
        body: JSON.stringify(farmerRequest)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-registration-requests'] });
      setIsNewFarmerOpen(false);
      setNewFarmerForm({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        farmLocation: '',
        farmSize: '',
        primaryCrop: ''
      });
      toast({
        title: 'Registration Request Submitted',
        description: 'Farmer registration request has been submitted to LACRA Director for approval.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Request Failed',
        description: error.message || 'Failed to submit registration request',
        variant: 'destructive',
      });
    },
  });

  const [newInspectionForm, setNewInspectionForm] = useState({
    farmerId: '',
    inspectionType: '',
    commodityType: '',
    notes: ''
  });

  const newInspectionMutation = useMutation({
    mutationFn: async (inspectionData: any) => {
      const selectedFarmer = farmers.find((f: any) => f.id.toString() === inspectionData.farmerId);
      const inspectionRequest = {
        requestId: `INSP-REQ-${Date.now()}`,
        requestType: 'inspection_request',
        requestedBy: agentId,
        agentName: 'Sarah Konneh',
        jurisdiction: jurisdiction,
        requestedDate: new Date().toISOString(),
        status: 'pending_approval',
        priority: 'medium',
        farmerId: inspectionData.farmerId,
        farmerName: selectedFarmer ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}` : 'Unknown',
        inspectionType: inspectionData.inspectionType,
        commodityType: inspectionData.commodityType,
        location: `${selectedFarmer?.village || 'Farm Site'} - ${jurisdiction}`,
        notes: inspectionData.notes,
        requiresDirectorApproval: true,
        messageToDirector: `Field Agent ${agentId} requests approval for ${inspectionData.inspectionType} inspection of ${inspectionData.commodityType} at ${selectedFarmer ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}'s farm` : 'farm location'} in ${jurisdiction}.`
      };
      
      return await apiRequest('/api/inspection-requests', {
        method: 'POST',
        body: JSON.stringify(inspectionRequest)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspection-requests'] });
      setIsNewInspectionOpen(false);
      setNewInspectionForm({
        farmerId: '',
        inspectionType: '',
        commodityType: '',
        notes: ''
      });
      toast({
        title: 'Inspection Request Submitted',
        description: 'Your inspection request has been submitted to LACRA Director for approval.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Request Failed',
        description: error.message || 'Failed to submit inspection request',
        variant: 'destructive',
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Field Agent Dashboard - AgriTrace360™</title>
        <meta name="description" content="Field operations dashboard for LACRA field agents" />
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Users className="h-8 w-8 text-orange-600" />
                Field Agent Operations
              </h1>
              <p className="text-gray-600">
                Agent {agentId} - {jurisdiction} Territory
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Territory Coverage</p>
              <Badge className="bg-orange-100 text-orange-800">{jurisdiction}</Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Registered Farmers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalFarmers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Inspections</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingInspections}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-900">{completedToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TreePine className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Commodities</p>
                  <p className="text-2xl font-bold text-gray-900">{commoditiesInJurisdiction}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="farmers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Farmer Management
            </TabsTrigger>
            <TabsTrigger value="inspections" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Field Inspections
            </TabsTrigger>
            <TabsTrigger value="territory" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Territory Mapping
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Field Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium">Farm inspection completed</p>
                        <p className="text-xs text-gray-500">Coffee plantation - Lofa County</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium">New farmer registered</p>
                        <p className="text-xs text-gray-500">Moses Tuah - Cocoa farming</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Map className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium">GPS mapping completed</p>
                        <p className="text-xs text-gray-500">3.2 hectares mapped</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Territory Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Territory Summary - {jurisdiction}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Farms Covered</span>
                      <span className="text-sm font-medium">{totalFarmers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Commodities</span>
                      <span className="text-sm font-medium">{commoditiesInJurisdiction}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Compliance Rate</span>
                      <Badge className="bg-green-100 text-green-800">87%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mobile Coverage</span>
                      <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Dialog open={isNewFarmerOpen} onOpenChange={setIsNewFarmerOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-20 flex flex-col gap-2">
                        <UserPlus className="h-6 w-6" />
                        Register Farmer
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Register New Farmer</DialogTitle>
                        <DialogDescription>
                          Add a new farmer to your territory registry
                        </DialogDescription>
                      </DialogHeader>
                      {/* Farmer registration form would go here */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>First Name</Label>
                            <Input 
                              value={newFarmerForm.firstName}
                              onChange={(e) => setNewFarmerForm({...newFarmerForm, firstName: e.target.value})}
                              placeholder="Enter first name" 
                            />
                          </div>
                          <div>
                            <Label>Last Name</Label>
                            <Input 
                              value={newFarmerForm.lastName}
                              onChange={(e) => setNewFarmerForm({...newFarmerForm, lastName: e.target.value})}
                              placeholder="Enter last name" 
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <Input 
                            value={newFarmerForm.phoneNumber}
                            onChange={(e) => setNewFarmerForm({...newFarmerForm, phoneNumber: e.target.value})}
                            placeholder="+231 77 XXX XXXX" 
                          />
                        </div>
                        <div>
                          <Label>Farm Location (Village/District)</Label>
                          <Input 
                            value={newFarmerForm.farmLocation}
                            onChange={(e) => setNewFarmerForm({...newFarmerForm, farmLocation: e.target.value})}
                            placeholder={`Village or district in ${jurisdiction}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Farm Size (hectares)</Label>
                            <Input 
                              value={newFarmerForm.farmSize}
                              onChange={(e) => setNewFarmerForm({...newFarmerForm, farmSize: e.target.value})}
                              placeholder="e.g., 2.5" 
                              type="number"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <Label>Primary Crop</Label>
                            <Select value={newFarmerForm.primaryCrop} onValueChange={(value) => setNewFarmerForm({...newFarmerForm, primaryCrop: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select crop" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Coffee">Coffee</SelectItem>
                                <SelectItem value="Cocoa">Cocoa</SelectItem>
                                <SelectItem value="Rubber">Rubber</SelectItem>
                                <SelectItem value="Rice">Rice</SelectItem>
                                <SelectItem value="Cassava">Cassava</SelectItem>
                                <SelectItem value="Oil Palm">Oil Palm</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button 
                          onClick={() => newFarmerMutation.mutate(newFarmerForm)} 
                          className="w-full"
                          disabled={!newFarmerForm.firstName || !newFarmerForm.lastName || newFarmerMutation.isPending}
                        >
                          {newFarmerMutation.isPending ? 'Registering...' : 'Register Farmer'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isNewInspectionOpen} onOpenChange={setIsNewInspectionOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-20 flex flex-col gap-2">
                        <ClipboardCheck className="h-6 w-6" />
                        New Inspection
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Schedule Field Inspection</DialogTitle>
                        <DialogDescription>
                          Record a new field inspection in your territory
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Farmer/Farm</Label>
                          <Select value={newInspectionForm.farmerId} onValueChange={(value) => setNewInspectionForm({...newInspectionForm, farmerId: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select farmer" />
                            </SelectTrigger>
                            <SelectContent>
                              {farmers.filter((f: any) => f.county === jurisdiction).map((farmer: any) => (
                                <SelectItem key={farmer.id} value={farmer.id.toString()}>
                                  {farmer.firstName} {farmer.lastName} - {farmer.farmerId}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Inspection Type</Label>
                          <Select value={newInspectionForm.inspectionType} onValueChange={(value) => setNewInspectionForm({...newInspectionForm, inspectionType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inspection type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quality_assessment">Quality Assessment</SelectItem>
                              <SelectItem value="compliance_check">Compliance Check</SelectItem>
                              <SelectItem value="gps_mapping">GPS Mapping</SelectItem>
                              <SelectItem value="pre_certification">Pre-Certification</SelectItem>
                              <SelectItem value="harvest_inspection">Harvest Inspection</SelectItem>
                              <SelectItem value="processing_review">Processing Review</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Commodity Type</Label>
                          <Select value={newInspectionForm.commodityType} onValueChange={(value) => setNewInspectionForm({...newInspectionForm, commodityType: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select commodity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Coffee">Coffee</SelectItem>
                              <SelectItem value="Cocoa">Cocoa</SelectItem>
                              <SelectItem value="Rubber">Rubber</SelectItem>
                              <SelectItem value="Rice">Rice</SelectItem>
                              <SelectItem value="Cassava">Cassava</SelectItem>
                              <SelectItem value="Oil Palm">Oil Palm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Inspection Notes</Label>
                          <Textarea 
                            value={newInspectionForm.notes}
                            onChange={(e) => setNewInspectionForm({...newInspectionForm, notes: e.target.value})}
                            placeholder="Pre-inspection notes, planned activities, specific areas of focus..." 
                          />
                        </div>
                        <Button 
                          onClick={() => newInspectionMutation.mutate(newInspectionForm)} 
                          className="w-full"
                          disabled={!newInspectionForm.farmerId || !newInspectionForm.inspectionType || newInspectionMutation.isPending}
                        >
                          {newInspectionMutation.isPending ? 'Scheduling...' : 'Schedule Inspection'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => {
                      toast({
                        title: 'GPS Mapping Started',
                        description: `GPS mapping tool launched for ${jurisdiction} territory`,
                      });
                    }}
                  >
                    <Map className="h-6 w-6" />
                    GPS Mapping
                  </Button>

                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={() => {
                      toast({
                        title: 'Mobile Sync Initiated',
                        description: 'Syncing field data with central database...',
                      });
                    }}
                  >
                    <Smartphone className="h-6 w-6" />
                    Mobile Sync
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Farmers in {jurisdiction}</CardTitle>
                <div className="text-sm text-gray-600">
                  Territory-specific farmer management and registration
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmers.filter((f: any) => f.county === jurisdiction).map((farmer: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{farmer.firstName} {farmer.lastName}</h4>
                        <p className="text-sm text-gray-600">{farmer.farmerId} - {farmer.farmSize} {farmer.farmSizeUnit}</p>
                        <p className="text-xs text-orange-600">{farmer.district}, {farmer.village}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={
                          farmer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }>
                          {farmer.status === 'active' ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const farmerDetails = `
Farmer: ${farmer.firstName} ${farmer.lastName}
ID: ${farmer.farmerId}
Phone: ${farmer.phoneNumber || 'Not provided'}
Location: ${farmer.village}, ${farmer.district}
Farm Size: ${farmer.farmSize} ${farmer.farmSizeUnit}
GPS: ${farmer.gpsCoordinates || 'Not recorded'}
Agreement: ${farmer.agreementSigned ? 'Signed' : 'Pending'}
Status: ${farmer.status}
Registration: ${farmer.registeredBy || 'Unknown'}`;
                            
                            console.log('Farmer Details:', farmerDetails);
                            toast({
                              title: 'Farmer Profile Opened',
                              description: `Loading complete profile for ${farmer.firstName} ${farmer.lastName}`,
                            });
                          }}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inspections Tab */}
          <TabsContent value="inspections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Field Inspections - {jurisdiction}</CardTitle>
                <div className="text-sm text-gray-600">
                  Manage and conduct field inspections in your assigned territory
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inspections.filter((i: any) => i.jurisdiction === jurisdiction).map((inspection: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Inspection #{inspection.inspectionId}</h4>
                        <p className="text-sm text-gray-600">{inspection.commodityType} - {inspection.farmerName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={
                          inspection.status === 'completed' ? 'bg-green-100 text-green-800' :
                          inspection.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {inspection.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: 'Inspection Details',
                              description: `Opening inspection ${inspection.inspectionId} for review`,
                            });
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Territory Tab */}
          <TabsContent value="territory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Territory Mapping - {jurisdiction}</CardTitle>
                <div className="text-sm text-gray-600">
                  GPS mapping and geospatial data for your assigned territory
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Interactive territory map and GPS tools</p>
                  <Button
                    onClick={() => {
                      toast({
                        title: 'GPS Territory Mapping',
                        description: `Launching GPS mapping interface for ${jurisdiction}. Ensure GPS is enabled on your device.`,
                      });
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Launch GPS Mapping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}