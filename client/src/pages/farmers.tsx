import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Users, TrendingUp, MapPin, FileText, Eye, Edit, CheckCircle, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

// Farmer form schema
const farmerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be valid"),
  idNumber: z.string().optional(),
  county: z.string().min(1, "County is required"),
  district: z.string().optional(),
  village: z.string().optional(),
  gpsCoordinates: z.string().optional(),
  farmSize: z.string().optional(),
  farmSizeUnit: z.string().default("hectares"),
  agreementSigned: z.boolean().default(false),
});

type FarmerFormData = z.infer<typeof farmerFormSchema>;

const liberianCounties = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County", 
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

export default function FarmersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const { toast } = useToast();

  const { data: farmers = [], isLoading } = useQuery({
    queryKey: ["/api/farmers"],
  });

  const form = useForm<FarmerFormData>({
    resolver: zodResolver(farmerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      idNumber: "",
      county: "",
      district: "",
      village: "",
      gpsCoordinates: "",
      farmSize: "",
      farmSizeUnit: "hectares",
      agreementSigned: false,
    },
  });

  const createFarmerMutation = useMutation({
    mutationFn: async (data: FarmerFormData) => {
      const farmerData = {
        ...data,
        farmerId: `FRM-${Date.now()}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        status: "active",
        onboardingDate: new Date().toISOString(),
      };
      return apiRequest("/api/farmers", {
        method: "POST",
        body: JSON.stringify(farmerData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Farmer has been successfully onboarded.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to onboard farmer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FarmerFormData) => {
    createFarmerMutation.mutate(data);
  };

  const filteredFarmers = farmers.filter((farmer: any) =>
    farmer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.county.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCanidates = farmers.filter((f: any) => f.status === 'active').length;
  const signedAgreements = farmers.filter((f: any) => f.agreementSigned).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Farmer Management - AgriTrace360™</title>
        <meta name="description" content="Manage farmer onboarding, agreements, and profile information in the LACRA agricultural compliance system." />
      </Helmet>

      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-neutral">Farmer Management</h1>
            <p className="text-gray-600 mt-2">Manage farmer onboarding, agreements, and profile information</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Onboard New Farmer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-lacra-green" />
                  Farmer Onboarding Form
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter first name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter last name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+231 XX XXX XXXX" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>National ID Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter ID number" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Location Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="county"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>County *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select county" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {liberianCounties.map((county) => (
                                    <SelectItem key={county} value={county}>
                                      {county}
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
                          name="district"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>District</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter district" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="village"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Village/Town</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Enter village or town" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="gpsCoordinates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GPS Coordinates</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 8.4219,-9.8456" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Farm Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Farm Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="farmSize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Farm Size</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.1" placeholder="e.g., 5.2" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="farmSizeUnit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="hectares">Hectares</SelectItem>
                                  <SelectItem value="acres">Acres</SelectItem>
                                  <SelectItem value="square_meters">Square Meters</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Agreement and Compliance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Agreement & Compliance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="agreementSigned"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I agree to the LACRA Farmer Participation Agreement
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                By checking this box, the farmer agrees to comply with LACRA regulations,
                                EUDR requirements, and sustainable farming practices.
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Onboarding Process</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Farmer information will be verified within 2 business days</li>
                          <li>• GPS mapping team will schedule a farm visit if coordinates are provided</li>
                          <li>• Training materials will be provided for sustainable farming practices</li>
                          <li>• Farmer will receive a unique ID for commodity tracking</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-lacra-green hover:bg-green-700"
                      disabled={createFarmerMutation.isPending}
                    >
                      {createFarmerMutation.isPending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Onboarding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Complete Onboarding
                        </>
                      )}
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
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-lacra-blue" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-neutral">{farmers.length}</div>
                  <p className="text-sm text-gray-500">Total Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-success" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-success">{activeCanidates}</div>
                  <p className="text-sm text-gray-500">Active Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-lacra-green" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-lacra-green">{signedAgreements}</div>
                  <p className="text-sm text-gray-500">Signed Agreements</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-warning" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-warning">
                    {new Set(farmers.map((f: any) => f.county)).size}
                  </div>
                  <p className="text-sm text-gray-500">Counties Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search farmers by name, ID, or county..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Farmers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading farmers...</div>
            ) : filteredFarmers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {farmers.length === 0 ? "No farmers registered yet." : "No farmers match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farmer ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">County</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Farm Size</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Agreement</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFarmers.map((farmer: any) => (
                      <tr key={farmer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{farmer.farmerId}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{farmer.firstName} {farmer.lastName}</div>
                            {farmer.phoneNumber && (
                              <div className="text-sm text-gray-500">{farmer.phoneNumber}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{farmer.county}</td>
                        <td className="py-3 px-4">
                          {farmer.farmSize ? `${farmer.farmSize} ${farmer.farmSizeUnit}` : "Not specified"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={farmer.agreementSigned ? "default" : "secondary"}>
                            {farmer.agreementSigned ? "Signed" : "Pending"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={
                              farmer.status === 'active' ? "default" : 
                              farmer.status === 'inactive' ? "secondary" : "destructive"
                            }
                          >
                            {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedFarmer(farmer);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Farmer Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Farmer Details</DialogTitle>
            </DialogHeader>
            {selectedFarmer && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-lacra-blue" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Farmer ID</label>
                      <p className="text-gray-900 font-mono">{selectedFarmer.farmerId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-gray-900">{selectedFarmer.firstName} {selectedFarmer.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <p className="text-gray-900">{selectedFarmer.phoneNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">ID Number</label>
                      <p className="text-gray-900">{selectedFarmer.idNumber || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Badge variant={selectedFarmer.status === 'active' ? "default" : "secondary"}>
                        {selectedFarmer.status.charAt(0).toUpperCase() + selectedFarmer.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Registration Date</label>
                      <p className="text-gray-900">
                        {selectedFarmer.registrationDate ? 
                          new Date(selectedFarmer.registrationDate).toLocaleDateString() : 
                          "Not available"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-lacra-green" />
                    Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">County</label>
                      <p className="text-gray-900">{selectedFarmer.county}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">District</label>
                      <p className="text-gray-900">{selectedFarmer.district || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Village</label>
                      <p className="text-gray-900">{selectedFarmer.village || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">GPS Coordinates</label>
                      <p className="text-gray-900 font-mono">{selectedFarmer.gpsCoordinates || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Farm Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-lacra-orange" />
                    Farm Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Farm Size</label>
                      <p className="text-gray-900">
                        {selectedFarmer.farmSize ? 
                          `${selectedFarmer.farmSize} ${selectedFarmer.farmSizeUnit}` : 
                          "Not specified"
                        }
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Agreement Status</label>
                      <Badge variant={selectedFarmer.agreementSigned ? "default" : "secondary"}>
                        {selectedFarmer.agreementSigned ? "Signed" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Additional Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded border">
                    {selectedFarmer.notes ? (
                      <p className="text-gray-900">{selectedFarmer.notes}</p>
                    ) : (
                      <p className="text-gray-500 italic">No additional notes available</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      // Navigate to farm plots for this farmer
                      setIsViewDialogOpen(false);
                      window.location.href = '/farm-plots';
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    View Farm Plots
                  </Button>
                  <Button>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Details
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}