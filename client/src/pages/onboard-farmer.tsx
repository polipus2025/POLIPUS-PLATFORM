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
import { ArrowLeft, MapPin, Target, Globe, TreePine, Upload, User, Users, Key, Copy, Eye, EyeOff, FileText, CheckCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
// Lazy load the boundary mapper for better performance
import { lazy, Suspense } from 'react';
const RealMapBoundaryMapper = lazy(() => import('@/components/maps/real-map-boundary-mapper'));
const LandOwnershipDocumentation = lazy(() => import('@/components/LandOwnershipDocumentation'));

const LIBERIAN_COUNTIES = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh",
  "Grand Kru", "Lofa", "Margibi", "Maryland", "Montserrado", "Nimba",
  "River Cess", "River Gee", "Sinoe"
];

export default function OnboardFarmer() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
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
    boundaryData: null as any,
    farmerPhoto: null as File | null,
    spouseName: "",
    numberOfChildren: "",
    dependents: "",
    emergencyContact: "",
    emergencyPhone: "",
    familyMembers: ""
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

  const [showCredentialsModal, setShowCredentialsModal] = useState({
    show: false,
    farmerName: "",
    credentialId: "",
    temporaryPassword: ""
  });

  // States for the multi-step process
  const [savedFarmer, setSavedFarmer] = useState<any>(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [showLandOwnershipForm, setShowLandOwnershipForm] = useState(false);
  const [landOwnershipCompleted, setLandOwnershipCompleted] = useState(false);

  // Step 1: Save farmer data (called during boundary completion)
  const saveFarmerData = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/farmers", {
        method: "POST",
        body: JSON.stringify({
          ...data,
          farmSize: data.boundaryData?.area || (data.farmSize || null),
          farmingExperience: data.farmingExperience || null,
          farmBoundaries: data.boundaryData ? data.boundaryData : null,
          landMapData: data.boundaryData ? data.boundaryData : null,
          isActive: true,
          onboardedBy: inspectorName,
          onboardedAt: new Date(),
          approvalStatus: "approved"
        })
      });
    },
    onSuccess: (response: any) => {
      const { farmer } = response;
      setSavedFarmer(farmer);
      setIsFormComplete(true);
      
      toast({
        title: "Boundary Mapping Complete!",
        description: "Farm boundary saved successfully. Click 'Complete Farmer Onboarding' to generate credentials.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save farmer data",
        variant: "destructive",
      });
    }
  });

  // Step 2: Complete onboarding and generate credentials
  const completeOnboarding = useMutation({
    mutationFn: async () => {
      if (!savedFarmer?.id) throw new Error("No saved farmer found");
      
      return await apiRequest(`/api/farmers/${savedFarmer.id}/complete-onboarding`, {
        method: "POST",
        body: JSON.stringify({
          onboardedBy: inspectorName
        })
      });
    },
    onSuccess: (response: any) => {
      const { farmer, credentials, notifications } = response;
      
      // Show credentials modal
      setShowCredentialsModal({
        show: true,
        farmerName: `${farmer.firstName} ${farmer.lastName}`,
        credentialId: credentials.credentialId,
        temporaryPassword: credentials.temporaryPassword
      });
      
      // Show notification status in toast
      const notificationStatus = [];
      if (notifications?.emailSent) notificationStatus.push("📧 Email sent");
      if (notifications?.smsSent) notificationStatus.push("📱 SMS sent");
      
      toast({
        title: "Farmer Onboarded Successfully!",
        description: `Credentials generated: ${credentials.credentialId}${notificationStatus.length > 0 ? ' | ' + notificationStatus.join(' | ') : ''}`,
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
        boundaryData: null,
        farmerPhoto: null,
        spouseName: "",
        numberOfChildren: "",
        dependents: "",
        emergencyContact: "",
        emergencyPhone: "",
        familyMembers: ""
      });
      setSavedFarmer(null);
      setIsFormComplete(false);
    },
    onError: (error: any) => {
      toast({
        title: "Onboarding Failed",
        description: error.message || "Failed to complete farmer onboarding",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isFormComplete && savedFarmer) {
      // Step 2: Complete onboarding and generate credentials
      completeOnboarding.mutate();
    } else {
      // Step 1: Basic validation and save farmer data
      if (!farmerData.firstName || !farmerData.lastName || !farmerData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (!farmerData.boundaryData || !farmerData.boundaryData.points || farmerData.boundaryData.points.length < 6) {
        toast({
          title: "Incomplete Boundary Mapping", 
          description: "Please complete the farm boundary mapping with at least 6 GPS points",
          variant: "destructive",
        });
        return;
      }

      saveFarmerData.mutate(farmerData);
    }
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
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}>
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
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    Farmer Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="farmerPhoto">Upload Farmer Photo</Label>
                    <div className="flex items-center space-x-4">
                      <input
                        id="farmerPhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFarmerData(prev => ({ ...prev, farmerPhoto: file }));
                        }}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('farmerPhoto')?.click()}
                        className="flex items-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {farmerData.farmerPhoto ? 'Change Photo' : 'Upload Photo'}
                      </Button>
                      {farmerData.farmerPhoto && (
                        <span className="text-sm text-green-600">
                          ✓ {farmerData.farmerPhoto.name}
                        </span>
                      )}
                    </div>
                    {farmerData.farmerPhoto && (
                      <div className="mt-3">
                        <img
                          src={URL.createObjectURL(farmerData.farmerPhoto)}
                          alt="Farmer preview"
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Family Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="spouseName">Spouse Name</Label>
                      <Input
                        id="spouseName"
                        value={farmerData.spouseName}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, spouseName: e.target.value }))}
                        placeholder="Enter spouse name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="numberOfChildren">Number of Children</Label>
                      <Input
                        id="numberOfChildren"
                        type="number"
                        value={farmerData.numberOfChildren}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, numberOfChildren: e.target.value }))}
                        placeholder="e.g., 3"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dependents">Total Dependents</Label>
                    <Input
                      id="dependents"
                      type="number"
                      value={farmerData.dependents}
                      onChange={(e) => setFarmerData(prev => ({ ...prev, dependents: e.target.value }))}
                      placeholder="Total number of dependents"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        value={farmerData.emergencyContact}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        placeholder="Emergency contact person"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={farmerData.emergencyPhone}
                        onChange={(e) => setFarmerData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                        placeholder="+231 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="familyMembers">Family Members (Names & Ages)</Label>
                    <Textarea
                      id="familyMembers"
                      value={farmerData.familyMembers}
                      onChange={(e) => setFarmerData(prev => ({ ...prev, familyMembers: e.target.value }))}
                      placeholder="List family members with their ages..."
                      rows={3}
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

                    {/* STEP 3: Show map ONLY after GPS location is detected (Step 2 complete) */}
                    {farmerData.gpsCoordinates ? (
                      <RealMapBoundaryMapper
                        onBoundaryComplete={(boundary) => {
                          // Update farmer data with boundary information
                          setFarmerData(prev => ({
                            ...prev,
                            boundaryData: boundary,
                            farmSize: boundary.area ? (boundary.area / 10000).toFixed(4) : prev.farmSize, // Convert sq meters to hectares for storage
                            gpsCoordinates: boundary.points.length > 0 ? 
                              `${boundary.points[0].latitude.toFixed(6)}, ${boundary.points[0].longitude.toFixed(6)}` : 
                              prev.gpsCoordinates
                          }));
                          
                          // Show interactive boundary completed view - NO automatic saving here
                          toast({
                            title: "✅ Interactive Boundary View Complete!",
                            description: `All ${boundary.points.length} GPS points connected and mapped. You can see the interactive boundary view. Click 'Save Farm Data & Continue' when ready.`,
                            duration: 5000,
                          });
                        }}
                        minPoints={6}
                        maxPoints={20}
                        enableRealTimeGPS={true}
                      />
                    ) : (
                      <div className="p-4 sm:p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                        <MapPin className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">GPS Location Required</h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 px-2">Please click "Get Location" first to detect GPS coordinates before mapping farm boundaries.</p>
                        <p className="text-xs sm:text-sm text-blue-600 font-medium px-2">Step 2: Get Real GPS Coordinates → Step 3: Start GPS Tracking</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button - Mobile Optimized */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-0">
            {isFormComplete && savedFarmer ? (
              <div className="space-y-4">
                <div className="text-green-600 font-medium text-center text-sm sm:text-base">
                  ✓ Farm data saved successfully
                </div>
                
                {/* Land Ownership Documentation Option */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900 mb-2">Optional: Land Ownership Documentation</h4>
                        <p className="text-sm text-blue-800 mb-3">
                          Complete official land ownership confirmation document with photos, witness statements, and digital signatures. 
                          This provides legal documentation of land ownership and enhances farmer protection.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            onClick={() => setShowLandOwnershipForm(true)}
                            variant="outline"
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                            data-testid="button-add-land-ownership"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Add Land Ownership Documentation
                          </Button>
                          {landOwnershipCompleted && (
                            <Badge className="bg-green-100 text-green-800 self-start">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Documentation Complete
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex flex-col sm:flex-row sm:justify-end">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={completeOnboarding.isPending}
                    className="w-full sm:min-w-48 bg-green-600 hover:bg-green-700 py-3 text-sm sm:text-base"
                    data-testid="button-complete-onboarding"
                  >
                    {completeOnboarding.isPending ? "Generating Credentials..." : "Complete Farmer Onboarding"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                type="submit" 
                size="lg" 
                disabled={saveFarmerData.isPending || !farmerData.boundaryData}
                className="w-full sm:min-w-48 py-3 text-sm sm:text-base"
                data-testid="button-save-farm-data"
              >
                {saveFarmerData.isPending ? "Saving Farm Data..." : "Save Farm Data & Continue"}
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Farmer Credentials Modal */}
      {showCredentialsModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <Card className="w-full max-w-sm sm:max-w-md bg-green-50 border-green-200 mx-2 sm:mx-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Key className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-green-800">Farmer Credentials Generated!</CardTitle>
              <p className="text-green-600">
                Login credentials for: {showCredentialsModal.farmerName}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <Label className="text-sm font-medium text-gray-600">Login ID</Label>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-lg font-bold text-gray-900">
                    {showCredentialsModal.credentialId}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(showCredentialsModal.credentialId)}
                    data-testid="copy-credential-id"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <Label className="text-sm font-medium text-gray-600">Temporary Password</Label>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-lg font-bold text-gray-900">
                    {showCredentialsModal.temporaryPassword}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(showCredentialsModal.temporaryPassword)}
                    data-testid="copy-password"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> Please provide these credentials to the farmer. 
                  They will be required to change the password on first login.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">
                  <strong>Farmer Portal Access:</strong> Farmers can login at the "Farmer Login" 
                  page to access their land mapping data, harvesting schedules, and marketplace.
                </p>
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setShowCredentialsModal({ show: false, farmerName: "", credentialId: "", temporaryPassword: "" });
                  // Navigate to Farmer Management Dashboard
                  toast({
                    title: "Redirecting to Farmer Management Dashboard",
                    description: "Taking you to the farmer management dashboard...",
                  });
                  setTimeout(() => {
                    setLocation('/inspector-farmer-land-management');
                  }, 1000);
                }}
                data-testid="close-credentials-modal"
              >
                Close & Go to Farmer Management
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Land Ownership Documentation Modal */}
      {showLandOwnershipForm && savedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full h-full max-w-6xl">
            <Suspense fallback={
              <Card className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
                  <p>Loading Land Ownership Documentation...</p>
                </div>
              </Card>
            }>
              <LandOwnershipDocumentation
                farmerId={savedFarmer.farmerId}
                farmerName={`${savedFarmer.firstName} ${savedFarmer.lastName}`}
                onComplete={(documentData) => {
                  console.log('Land ownership documentation completed:', documentData);
                  setLandOwnershipCompleted(true);
                  setShowLandOwnershipForm(false);
                  toast({
                    title: "Land Ownership Documentation Complete!",
                    description: "Official land ownership confirmation has been successfully recorded.",
                    duration: 5000,
                  });
                }}
                onCancel={() => {
                  setShowLandOwnershipForm(false);
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}