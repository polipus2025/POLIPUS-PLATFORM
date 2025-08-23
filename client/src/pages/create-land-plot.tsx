import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Globe, TreePine, Target, Users } from "lucide-react";
import { Link } from "wouter";
import RealMapBoundaryMapper from '@/components/maps/real-map-boundary-mapper';

export default function CreateLandPlot() {
  const { toast } = useToast();
  const [selectedFarmerId, setSelectedFarmerId] = useState("");
  
  const [landPlotData, setLandPlotData] = useState({
    plotName: "",
    plotType: "",
    soilType: "",
    irrigationType: "",
    elevation: "",
    slope: "",
    landUse: "",
    plotDescription: "",
    boundaryData: null as any,
    totalAreaHectares: "",
    coordinates: ""
  });

  const inspectorId = localStorage.getItem("inspectorId") || "land_inspector";
  const inspectorName = localStorage.getItem("inspectorName") || "Land Inspector";

  // Get list of farmers
  const { data: farmers } = useQuery({
    queryKey: ["/api/farmers"],
    retry: false
  });

  const farmersList = (farmers as any[]) || [];
  const selectedFarmer = farmersList.find((f: any) => f.id.toString() === selectedFarmerId);

  // Create land plot mutation
  const createLandPlot = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("/api/farm-plots", {
        method: "POST",
        body: JSON.stringify({
          // Required fields matching farmPlots schema
          plotId: `PLOT-${selectedFarmerId}-${Date.now()}`, // Generate unique plot ID
          farmerId: selectedFarmerId,
          farmerName: selectedFarmer ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}` : "",
          plotNumber: 1, // TODO: Get actual next plot number for this farmer
          plotName: data.plotName,
          
          // Agricultural data
          cropType: data.plotType || "cocoa", // Map plotType to cropType
          primaryCrop: data.plotType,
          plotSize: data.boundaryData?.area || parseFloat(data.totalAreaHectares || "0"),
          plotSizeUnit: "hectares",
          
          // Location data  
          county: selectedFarmer?.county || "Monrovia",
          district: selectedFarmer?.district || "",
          gpsCoordinates: data.boundaryData ? 
            `${data.boundaryData.points[0]?.lat},${data.boundaryData.points[0]?.lng}` : 
            data.coordinates,
          farmBoundaries: data.boundaryData,
          landMapData: {
            soilType: data.soilType,
            elevation: data.elevation,
            slope: data.slope,
            landUse: data.landUse,
            irrigationType: data.irrigationType,
            description: data.plotDescription,
            approvedBy: inspectorName,
            approvedAt: new Date()
          },
          soilType: data.soilType,
          
          // Status
          isActive: true,
          status: "active",
          landOwnership: "owned",
          irrigationAccess: data.irrigationType !== "none"
        })
      });
    },
    onSuccess: () => {
      toast({
        title: "Land Plot Created Successfully",
        description: "Land plot has been mapped and approved by inspector",
      });
      
      // Reset form
      setLandPlotData({
        plotName: "",
        plotType: "",
        soilType: "",
        irrigationType: "",
        elevation: "",
        slope: "",
        landUse: "",
        plotDescription: "",
        boundaryData: null,
        totalAreaHectares: "",
        coordinates: ""
      });
      setSelectedFarmerId("");
    },
    onError: (error: any) => {
      toast({
        title: "Land Plot Creation Failed",
        description: error.message || "Failed to create land plot",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFarmerId) {
      toast({
        title: "Select Farmer",
        description: "Please select a farmer for this land plot",
        variant: "destructive",
      });
      return;
    }

    if (!landPlotData.plotName) {
      toast({
        title: "Missing Information",
        description: "Please provide a plot name",
        variant: "destructive",
      });
      return;
    }

    createLandPlot.mutate(landPlotData);
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
            <h1 className="text-3xl font-bold text-gray-900">Create Land Plot</h1>
            <p className="text-gray-600">Map a new land plot for an existing farmer using GPS mapping</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex space-x-4 mb-6">
          <Badge className="bg-blue-100 text-blue-800">
            <Users className="w-3 h-3 mr-1" />
            Step 1: Select Farmer
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            <Globe className="w-3 h-3 mr-1" />
            Step 2: GPS Mapping
          </Badge>
          <Badge className="bg-purple-100 text-purple-800">
            <TreePine className="w-3 h-3 mr-1" />
            Step 3: Land Details
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Farmer Selection & Land Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Select Farmer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="farmerId">Farmer *</Label>
                    <Select value={selectedFarmerId} onValueChange={setSelectedFarmerId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a farmer for this land plot" />
                      </SelectTrigger>
                      <SelectContent>
                        {farmersList.map((farmer: any) => (
                          <SelectItem key={farmer.id} value={farmer.id.toString()}>
                            {farmer.firstName} {farmer.lastName} - {farmer.county} ({farmer.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedFarmer && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Selected Farmer Details:</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p><strong>Name:</strong> {selectedFarmer.firstName} {selectedFarmer.lastName}</p>
                        <p><strong>Location:</strong> {selectedFarmer.county}, {selectedFarmer.district}</p>
                        <p><strong>Primary Crop:</strong> {selectedFarmer.primaryCrop}</p>
                        <p><strong>Current Farm Size:</strong> {selectedFarmer.farmSize} hectares</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Land Plot Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="plotName">Plot Name *</Label>
                    <Input
                      id="plotName"
                      value={landPlotData.plotName}
                      onChange={(e) => setLandPlotData(prev => ({ ...prev, plotName: e.target.value }))}
                      placeholder="e.g., North Field, Cocoa Plot A"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plotType">Plot Type</Label>
                      <Select value={landPlotData.plotType} onValueChange={(value) => setLandPlotData(prev => ({ ...prev, plotType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plot type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agricultural">Agricultural</SelectItem>
                          <SelectItem value="forest">Forest</SelectItem>
                          <SelectItem value="pasture">Pasture</SelectItem>
                          <SelectItem value="wetland">Wetland</SelectItem>
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="mixed">Mixed Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="landUse">Current Land Use</Label>
                      <Select value={landPlotData.landUse} onValueChange={(value) => setLandPlotData(prev => ({ ...prev, landUse: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select land use" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cocoa">Cocoa Farming</SelectItem>
                          <SelectItem value="coffee">Coffee Farming</SelectItem>
                          <SelectItem value="palm_oil">Palm Oil</SelectItem>
                          <SelectItem value="rubber">Rubber</SelectItem>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="mixed_crops">Mixed Crops</SelectItem>
                          <SelectItem value="fallow">Fallow Land</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select value={landPlotData.soilType} onValueChange={(value) => setLandPlotData(prev => ({ ...prev, soilType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clay">Clay</SelectItem>
                          <SelectItem value="loam">Loam</SelectItem>
                          <SelectItem value="sandy">Sandy</SelectItem>
                          <SelectItem value="silt">Silt</SelectItem>
                          <SelectItem value="rocky">Rocky</SelectItem>
                          <SelectItem value="organic">Organic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="irrigationType">Irrigation</Label>
                      <Select value={landPlotData.irrigationType} onValueChange={(value) => setLandPlotData(prev => ({ ...prev, irrigationType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Irrigation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="rainfed">Rain-fed</SelectItem>
                          <SelectItem value="drip">Drip Irrigation</SelectItem>
                          <SelectItem value="sprinkler">Sprinkler</SelectItem>
                          <SelectItem value="flood">Flood Irrigation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="totalArea">Total Area (hectares)</Label>
                      <Input
                        id="totalArea"
                        type="number"
                        step="0.01"
                        value={landPlotData.totalAreaHectares}
                        onChange={(e) => setLandPlotData(prev => ({ ...prev, totalAreaHectares: e.target.value }))}
                        placeholder="e.g., 1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="elevation">Elevation (meters)</Label>
                      <Input
                        id="elevation"
                        type="number"
                        value={landPlotData.elevation}
                        onChange={(e) => setLandPlotData(prev => ({ ...prev, elevation: e.target.value }))}
                        placeholder="e.g., 150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="slope">Slope (%)</Label>
                      <Input
                        id="slope"
                        type="number"
                        step="0.1"
                        value={landPlotData.slope}
                        onChange={(e) => setLandPlotData(prev => ({ ...prev, slope: e.target.value }))}
                        placeholder="e.g., 5.2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="plotDescription">Plot Description</Label>
                    <Textarea
                      id="plotDescription"
                      value={landPlotData.plotDescription}
                      onChange={(e) => setLandPlotData(prev => ({ ...prev, plotDescription: e.target.value }))}
                      placeholder="Describe the land plot characteristics, features, etc..."
                      rows={3}
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
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">How to Map Land Boundaries with EUDR Compliance:</h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. Walk around the perimeter of the land plot with the farmer</li>
                        <li>2. Use the boundary mapper below to record GPS points</li>
                        <li>3. Complete the boundary by connecting back to the starting point</li>
                        <li>4. Area will be calculated automatically from boundary points</li>
                        <li>5. EUDR compliance assessment will be generated automatically</li>
                        <li>6. Deforestation report will be created based on satellite data</li>
                      </ol>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center mb-2">
                        <TreePine className="h-4 w-4 text-green-600 mr-2" />
                        <h4 className="font-medium text-green-800">EUDR Compliance Features:</h4>
                      </div>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Automated deforestation risk assessment</li>
                        <li>• Forest loss detection using satellite data</li>
                        <li>• Compliance scoring and risk categorization</li>
                        <li>• PDF report generation for EU documentation</li>
                        <li>• Real-time compliance status monitoring</li>
                      </ul>
                    </div>

                    <RealMapBoundaryMapper 
                      onBoundaryComplete={(boundary) => {
                        setLandPlotData(prev => ({
                          ...prev,
                          boundaryData: boundary,
                          totalAreaHectares: boundary.area ? boundary.area.toFixed(2) : prev.totalAreaHectares,
                          coordinates: boundary.points.length > 0 ? 
                            `${boundary.points[0].latitude.toFixed(6)}, ${boundary.points[0].longitude.toFixed(6)}` : 
                            prev.coordinates
                        }));
                        toast({
                          title: "Land Boundary Mapped Successfully",
                          description: `Land plot mapped with ${boundary.points.length} GPS points (${boundary.area?.toFixed(2)} hectares)`,
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
              disabled={createLandPlot.isPending || !selectedFarmerId}
              className="min-w-48"
            >
              {createLandPlot.isPending ? "Creating Land Plot..." : "Create Land Plot"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}