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
  const token = localStorage.getItem("token");

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

  const newFarmerMutation = useMutation({
    mutationFn: async (farmerData: any) => {
      return await apiRequest('/api/farmers', {
        method: 'POST',
        body: JSON.stringify({
          ...farmerData,
          county: jurisdiction,
          registeredBy: agentId,
          status: 'active'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/farmers'] });
      setIsNewFarmerOpen(false);
      toast({
        title: 'Farmer Registered',
        description: 'New farmer has been successfully registered in your jurisdiction.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to register farmer',
        variant: 'destructive',
      });
    },
  });

  const newInspectionMutation = useMutation({
    mutationFn: async (inspectionData: any) => {
      return await apiRequest('/api/inspections', {
        method: 'POST',
        body: JSON.stringify({
          ...inspectionData,
          jurisdiction,
          agentId,
          inspectionDate: new Date().toISOString(),
          status: 'pending'
        })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspections'] });
      setIsNewInspectionOpen(false);
      toast({
        title: 'Inspection Scheduled',
        description: 'New inspection has been scheduled and recorded.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Inspection Failed',
        description: error.message || 'Failed to schedule inspection',
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
                        <div>
                          <Label>Farmer Name</Label>
                          <Input placeholder="Enter farmer's full name" />
                        </div>
                        <div>
                          <Label>Phone Number</Label>
                          <Input placeholder="+231 77 XXX XXXX" />
                        </div>
                        <div>
                          <Label>Farm Location</Label>
                          <Input placeholder="GPS coordinates or landmark" />
                        </div>
                        <Button onClick={() => setIsNewFarmerOpen(false)} className="w-full">
                          Register Farmer
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
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select farmer" />
                            </SelectTrigger>
                            <SelectContent>
                              {farmers.map((farmer: any) => (
                                <SelectItem key={farmer.id} value={farmer.id.toString()}>
                                  {farmer.firstName} {farmer.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Inspection Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inspection type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="quality">Quality Assessment</SelectItem>
                              <SelectItem value="compliance">Compliance Check</SelectItem>
                              <SelectItem value="gps">GPS Mapping</SelectItem>
                              <SelectItem value="certification">Pre-Certification</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Notes</Label>
                          <Textarea placeholder="Inspection notes and observations" />
                        </div>
                        <Button onClick={() => setIsNewInspectionOpen(false)} className="w-full">
                          Schedule Inspection
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Map className="h-6 w-6" />
                    GPS Mapping
                  </Button>

                  <Button variant="outline" className="h-20 flex flex-col gap-2">
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
                        <p className="text-sm text-gray-600">{farmer.primaryCrop} - {farmer.farmSize} hectares</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                        <Button size="sm" variant="outline">View Details</Button>
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
                        <Button size="sm" variant="outline">View</Button>
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
                  <Button>
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