import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Target, Globe, TreePine } from "lucide-react";
import { Link } from "wouter";
import RealMapBoundaryMapper from '@/components/maps/real-map-boundary-mapper';

const LIBERIAN_COUNTIES = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh",
  "Grand Kru", "Lofa", "Margibi", "Maryland", "Montserrado", "Nimba",
  "River Cess", "River Gee", "Sinoe"
];

export default function OnboardFarmer() {
  const { toast } = useToast();
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  
  const [farmerData, setFarmerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    county: "",
    district: "",
    community: "",
    idNumber: "",
    gpsCoordinates: "",
    farmSize: "",
    primaryCrop: "",
    secondaryCrops: "",
    farmingExperience: "",
    certifications: "",
    cooperativeMembership: "",
    landOwnership: "",
    irrigationAccess: "",
    boundaryData: null as any
  });

  const inspectorId = localStorage.getItem("inspectorId") || "land_inspector";
  const inspectorName = localStorage.getItem("inspectorName") || "Land Inspector";

  // GPS Detection
  const getCurrentLocation = (isForFarmer = false) => {
    setIsDetectingGPS(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Available",
        description: "Geolocation is not supported by this device/browser",
        variant: "destructive",
      });
      setIsDetectingGPS(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        
        setFarmerData(prev => ({
          ...prev,
          gpsCoordinates: coordinates
        }));

        toast({
          title: "GPS Location Detected",
          description: `Coordinates: ${coordinates} (±${accuracy?.toFixed(0)}m)`,
        });
        setIsDetectingGPS(false);
      },
      (error) => {
        console.error("GPS Error:", error);
        toast({
          title: "GPS Detection Failed",
          description: "Unable to detect GPS coordinates. Please enter manually or try again.",
          variant: "destructive",
        });
        setIsDetectingGPS(false);
      },
      options
    );
  };

  // Create farmer mutation
  const createFarmer = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/farmers", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          farmSize: data.boundaryData?.area || (data.farmSize ? parseFloat(data.farmSize) : null),
          farmingExperience: data.farmingExperience ? parseInt(data.farmingExperience) : null,
          boundaryData: data.boundaryData ? JSON.stringify(data.boundaryData) : null,
          isActive: true,
          onboardedBy: inspectorName,
          onboardedAt: new Date(),
          approvalStatus: "approved" // Inspector can directly approve
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "Farmer Onboarded Successfully",
        description: "Farmer has been registered and approved by inspector",
      });
      
      // Reset form
      setFarmerData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        county: "",
        district: "",
        community: "",
        idNumber: "",
        gpsCoordinates: "",
        farmSize: "",
        primaryCrop: "",
        secondaryCrops: "",
        farmingExperience: "",
        certifications: "",
        cooperativeMembership: "",
        landOwnership: "",
        irrigationAccess: "",
        boundaryData: null
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register farmer",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!farmerData.firstName || !farmerData.lastName || !farmerData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createFarmer.mutate(farmerData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Link href="/unified-land-inspector-dashboard">
            <Button variant="outline" size="sm" className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Onboard New Farmer</h1>
            <p className="text-gray-600">Register a new farmer with GPS mapping and EUDR compliance</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex space-x-4 mb-6">
          <Badge className="bg-blue-100 text-blue-800">
            <MapPin className="w-3 h-3 mr-1" />
            Step 1: Farmer Details
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Globe className="w-3 h-3 mr-1" />
            Step 2: GPS Mapping
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <TreePine className="w-3 h-3 mr-1" />
            Step 3: EUDR Compliance
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Farmer Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Farmer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={farmerData.firstName}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={farmerData.lastName}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={farmerData.phone}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+231 XXX XXX XXX"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={farmerData.email}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="farmer@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="idNumber">National ID Number</Label>
                    <Input
                      id="idNumber"
                      value={farmerData.idNumber}
                      onChange={(e) => setFarmerData(prev => ({ ...prev, idNumber: e.target.value }))}
                      placeholder="Enter ID number"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="county">County *</Label>
                    <Select value={farmerData.county} onValueChange={(value) => setFarmerData(prev => ({ ...prev, county: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {LIBERIAN_COUNTIES.map((county) => (
                          <SelectItem key={county} value={county}>
                            {county}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={farmerData.district}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, district: e.target.value }))}
                        placeholder="Enter district"
                      />
                    </div>
                    <div>
                      <Label htmlFor="community">Community</Label>
                      <Input
                        id="community"
                        value={farmerData.community}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, community: e.target.value }))}
                        placeholder="Enter community"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="gpsCoordinates"
                        value={farmerData.gpsCoordinates}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, gpsCoordinates: e.target.value }))}
                        placeholder="e.g., 6.3406, -10.7572"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => getCurrentLocation(true)}
                        disabled={isDetectingGPS}
                      >
                        {isDetectingGPS ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                          <Target className="w-4 h-4" />
                        )}
                        {isDetectingGPS ? "Detecting..." : "Get Location"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Farm Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmSize">Farm Size (hectares)</Label>
                      <Input
                        id="farmSize"
                        type="number"
                        step="0.01"
                        value={farmerData.farmSize}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, farmSize: e.target.value }))}
                        placeholder="e.g., 2.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmingExperience">Years of Experience</Label>
                      <Input
                        id="farmingExperience"
                        type="number"
                        value={farmerData.farmingExperience}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, farmingExperience: e.target.value }))}
                        placeholder="e.g., 10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="primaryCrop">Primary Crop</Label>
                    <Select value={farmerData.primaryCrop} onValueChange={(value) => setFarmerData(prev => ({ ...prev, primaryCrop: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cocoa">Cocoa</SelectItem>
                        <SelectItem value="coffee">Coffee</SelectItem>
                        <SelectItem value="palm_oil">Palm Oil</SelectItem>
                        <SelectItem value="rubber">Rubber</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="cassava">Cassava</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="secondaryCrops">Secondary Crops</Label>
                    <Textarea
                      id="secondaryCrops"
                      value={farmerData.secondaryCrops}
                      onChange={(e) => setFarmerData(prev => ({ ...prev, secondaryCrops: e.target.value }))}
                      placeholder="List any secondary crops..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - GPS Mapping */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                    Interactive GPS Boundary Mapping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        Real Satellite
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        Point-wise Mapping
                      </Badge>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">How to Map Farm Boundaries:</h4>
                      <ol className="text-sm text-green-700 space-y-1">
                        <li>1. Walk around the perimeter of the farm with the farmer</li>
                        <li>2. Click on the map to add GPS points at boundary corners</li>
                        <li>3. Add multiple points to trace the exact farm boundary</li>
                        <li>4. Complete the boundary by connecting back to the starting point</li>
                        <li>5. Farm area will be calculated automatically from GPS points</li>
                      </ol>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TreePine className="h-4 w-4 text-blue-600 mr-2" />
                        <h4 className="font-medium text-blue-800">EUDR Compliance Features:</h4>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Automated deforestation risk assessment</li>
                        <li>• Forest loss detection using satellite data</li>
                        <li>• Compliance scoring and risk categorization</li>
                        <li>• PDF report generation for documentation</li>
                      </ul>
                    </div>

                    <RealMapBoundaryMapper
                      onBoundaryComplete={(boundary) => {
                        setFarmerData(prev => ({
                          ...prev,
                          boundaryData: boundary,
                          farmSize: boundary.area ? boundary.area.toFixed(2) : prev.farmSize,
                          gpsCoordinates: boundary.points.length > 0 ? 
                            `${boundary.points[0].latitude.toFixed(6)}, ${boundary.points[0].longitude.toFixed(6)}` : 
                            prev.gpsCoordinates
                        }));
                        toast({
                          title: "Farm Boundary Mapped Successfully",
                          description: `Farm mapped with ${boundary.points.length} GPS points (${boundary.area?.toFixed(2)} hectares)`,
                        });
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button 
              type="submit" 
              size="lg" 
              disabled={createFarmer.isPending}
              className="min-w-48"
            >
              {createFarmer.isPending ? "Onboarding Farmer..." : "Complete Farmer Onboarding"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}