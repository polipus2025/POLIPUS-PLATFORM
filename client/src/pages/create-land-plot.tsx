import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, MapPin, Globe, TreePine, Target, Users, Crosshair, Satellite, Zap, RefreshCw } from "lucide-react";
import { Link, useLocation } from "wouter";
import RealMapBoundaryMapper from '@/components/maps/real-map-boundary-mapper';

export default function CreateLandPlot() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
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

  const [satelliteAnalysis, setSatelliteAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  const inspectorId = localStorage.getItem("inspectorId") || "land_inspector";
  const inspectorName = localStorage.getItem("inspectorName") || "Land Inspector";

  // Get list of farmers
  const { data: farmers } = useQuery({
    queryKey: ["/api/farmers"],
    retry: false
  });

  const farmersList = (farmers as any[]) || [];
  const selectedFarmer = farmersList.find((f: any) => f.id.toString() === selectedFarmerId);

  // Generate EUDR Report mutation
  const generateEudrReport = useMutation({
    mutationFn: async (plotData: any) => {
      console.log("🛰️ Generating EUDR compliance report for plot:", plotData.plotId);
      
      const eudrPayload = {
        farmerId: plotData.farmerId,
        farmerName: plotData.farmerName,
        plotId: plotData.plotId,
        plotName: plotData.plotName,
        coordinates: plotData.gpsCoordinates,
        farmBoundaries: plotData.farmBoundaries,
        plotSize: plotData.plotSize,
        county: plotData.county,
        landMapData: plotData.landMapData,
        satelliteAnalysis: plotData.landMapData?.satelliteAnalysis
      };
      
      return await apiRequest("/api/eudr-compliance", {
        method: "POST",
        body: JSON.stringify(eudrPayload)
      });
    },
    onSuccess: (eudrResult: any) => {
      console.log("✅ EUDR report generated successfully!", eudrResult);
      
      toast({
        title: "🛰️ EUDR Compliance Report Generated",
        description: "EU Deforestation Regulation compliance report has been automatically created and saved.",
      });
    },
    onError: (error: any) => {
      console.error("❌ EUDR report generation failed:", error);
      
      toast({
        title: "EUDR Report Generation Failed",
        description: "Land plot was created but EUDR compliance report could not be generated. Please contact administrator.",
        variant: "destructive",
      });
    }
  });

  // Create land plot mutation
  const createLandPlot = useMutation({
    mutationFn: async (data: any) => {
      console.log("🔄 Creating land plot for farmer:", selectedFarmerId);
      console.log("📋 Plot data:", data);
      
      const plotPayload = {
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
          approvedAt: new Date(),
          satelliteAnalysis: satelliteAnalysis // Include satellite data
        },
        soilType: data.soilType,
        
        // Status
        isActive: true,
        status: "active",
        landOwnership: "owned",
        irrigationAccess: data.irrigationType !== "none"
      };
      
      console.log("📤 Sending plot payload:", plotPayload);
      
      const result = await apiRequest("/api/farm-plots", {
        method: "POST",
        body: JSON.stringify(plotPayload)
      });
      
      console.log("✅ Plot creation result:", result);
      return { result, plotPayload };
    },
    onSuccess: ({ result, plotPayload }) => {
      console.log("🎉 Plot created successfully!", result);
      
      toast({
        title: "✅ Land Plot Created Successfully",
        description: `Plot "${landPlotData.plotName}" has been mapped and approved by inspector. Generating EUDR compliance report...`,
      });

      // Automatically generate EUDR report after successful land plot creation
      generateEudrReport.mutate(plotPayload);
      
      // Reset form and satellite analysis
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
      setSatelliteAnalysis(null);

      // Force refresh of all related data after EUDR generation
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Wait 2 seconds for EUDR generation to complete
    },
    onError: (error: any) => {
      toast({
        title: "Land Plot Creation Failed",
        description: error.message || "Failed to create land plot",
        variant: "destructive",
      });
    }
  });

  // Satellite analysis mutation
  const analyzeSatelliteData = useMutation({
    mutationFn: async (boundaries: any[]) => {
      return await apiRequest("/api/satellite/analyze-plot", {
        method: "POST",
        body: JSON.stringify({ boundaries })
      });
    },
    onSuccess: (data: any) => {
      const analysis = data.analysis;
      setSatelliteAnalysis(analysis);
      
      // Auto-populate form with satellite data
      setLandPlotData(prev => ({
        ...prev,
        soilType: analysis.soilType,
        elevation: analysis.averageElevation.toString(),
        slope: analysis.averageSlope.toString(),
        totalAreaHectares: analysis.totalArea.toFixed(4)
      }));
      
      toast({
        title: "🛰️ Satellite Analysis Complete",
        description: `Detected: ${analysis.soilType} soil, ${analysis.averageElevation}m elevation, ${analysis.averageSlope}° slope`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Satellite Analysis Failed",
        description: error.message || "Could not analyze satellite data",
        variant: "destructive",
      });
    }
  });

  const performSatelliteAnalysis = () => {
    if (!landPlotData.boundaryData || !landPlotData.boundaryData.points) {
      toast({
        title: "No Boundary Data",
        description: "Please map the plot boundaries first to enable satellite analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Convert boundary points to expected format
    const boundaries = landPlotData.boundaryData.points.map((point: any) => ({
      latitude: point.lat || point.latitude,
      longitude: point.lng || point.longitude
    }));

    analyzeSatelliteData.mutate(boundaries);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

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

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        
        setCurrentLocation(location);
        setLandPlotData(prev => ({
          ...prev,
          coordinates: `${latitude}, ${longitude}`
        }));
        
        toast({
          title: "Location Acquired",
          description: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
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

                  {/* Satellite Analysis Section */}
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-blue-800">
                        <Satellite className="w-5 h-5 mr-2" />
                        🛰️ Automatic Satellite Detection
                      </CardTitle>
                      <CardDescription>
                        Use satellite data to automatically detect soil type, elevation, slope, and area. No manual input required!
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {!satelliteAnalysis ? (
                          <div className="text-center">
                            <Button 
                              onClick={performSatelliteAnalysis} 
                              disabled={isAnalyzing || !landPlotData.boundaryData}
                              className="bg-blue-600 hover:bg-blue-700"
                              size="lg"
                            >
                              {isAnalyzing ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Analyzing Satellite Data...
                                </>
                              ) : (
                                <>
                                  <Zap className="w-4 h-4 mr-2" />
                                  🛰️ Auto-Detect Land Characteristics
                                </>
                              )}
                            </Button>
                            {!landPlotData.boundaryData && (
                              <p className="text-sm text-gray-600 mt-2">
                                ⚠️ Map plot boundaries first to enable automatic detection
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded border">
                              <div className="text-sm font-medium text-gray-600">🌱 Soil Type</div>
                              <div className="text-lg font-bold text-green-700">{satelliteAnalysis.soilType}</div>
                              <div className="text-xs text-gray-500">Confidence: {satelliteAnalysis.confidence}%</div>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="text-sm font-medium text-gray-600">📏 Total Area</div>
                              <div className="text-lg font-bold text-blue-700">{satelliteAnalysis.totalArea.toFixed(4)} ha</div>
                              <div className="text-xs text-gray-500">Satellite calculated</div>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="text-sm font-medium text-gray-600">⛰️ Elevation</div>
                              <div className="text-lg font-bold text-purple-700">{satelliteAnalysis.averageElevation}m</div>
                              <div className="text-xs text-gray-500">Above sea level</div>
                            </div>
                            <div className="bg-white p-3 rounded border">
                              <div className="text-sm font-medium text-gray-600">📐 Slope</div>
                              <div className="text-lg font-bold text-orange-700">{satelliteAnalysis.averageSlope}°</div>
                              <div className="text-xs text-gray-500">Average gradient</div>
                            </div>
                            <div className="col-span-2 bg-green-50 border border-green-200 p-3 rounded">
                              <div className="text-sm font-medium text-green-800">✅ Data Source</div>
                              <div className="text-xs text-green-600">{satelliteAnalysis.dataSource}</div>
                              <div className="text-xs text-green-500 mt-1">Analysis completed: {new Date(satelliteAnalysis.analysisDate).toLocaleString()}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="soilType">
                        Soil Type 
                        {satelliteAnalysis && <span className="text-green-600 text-xs ml-2">✅ Auto-detected</span>}
                      </Label>
                      <Select value={landPlotData.soilType} onValueChange={(value) => setLandPlotData(prev => ({ ...prev, soilType: value }))}>
                        <SelectTrigger className={satelliteAnalysis ? "border-green-300 bg-green-50" : ""}>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ferralsols">Ferralsols (Red clay)</SelectItem>
                          <SelectItem value="Acrisols">Acrisols (Acid soils)</SelectItem>
                          <SelectItem value="Fluvisols">Fluvisols (River deposited)</SelectItem>
                          <SelectItem value="Gleysols">Gleysols (Waterlogged)</SelectItem>
                          <SelectItem value="Lixisols">Lixisols (Clay-enriched)</SelectItem>
                          <SelectItem value="Arenosols">Arenosols (Sandy)</SelectItem>
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
                      <Label htmlFor="totalArea">
                        Total Area (hectares)
                        {satelliteAnalysis && <span className="text-green-600 text-xs ml-2">✅ Auto-calculated</span>}
                      </Label>
                      <Input
                        id="totalArea"
                        type="number"
                        step="0.01"
                        value={landPlotData.totalAreaHectares}
                        onChange={(e) => setLandPlotData(prev => ({ ...prev, totalAreaHectares: e.target.value }))}
                        placeholder="e.g., 1.5"
                        className={satelliteAnalysis ? "border-green-300 bg-green-50" : ""}
                        readOnly={!!satelliteAnalysis}
                      />
                    </div>
                    <div>
                      <Label htmlFor="elevation">
                        Elevation (meters)
                        {satelliteAnalysis && <span className="text-green-600 text-xs ml-2">✅ Auto-detected</span>}
                      </Label>
                      <Input
                        id="elevation"
                        type="number"
                        value={landPlotData.elevation}
                        onChange={(e) => setLandPlotData(prev => ({ ...prev, elevation: e.target.value }))}
                        placeholder="e.g., 150"
                        className={satelliteAnalysis ? "border-green-300 bg-green-50" : ""}
                        readOnly={!!satelliteAnalysis}
                      />
                    </div>
                    <div>
                      <Label htmlFor="slope">
                        Slope (degrees)
                        {satelliteAnalysis && <span className="text-green-600 text-xs ml-2">✅ Auto-detected</span>}
                      </Label>
                      <Input
                        id="slope"
                        type="number"
                        step="0.1"
                        value={landPlotData.slope}
                        onChange={(e) => setLandPlotData(prev => ({ ...prev, slope: e.target.value }))}
                        placeholder="e.g., 5.2"
                        className={satelliteAnalysis ? "border-green-300 bg-green-50" : ""}
                        readOnly={!!satelliteAnalysis}
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

                    {/* Get Current Location Button */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Crosshair className="h-4 w-4 text-yellow-600 mr-2" />
                          <h4 className="font-medium text-yellow-800">Current Location</h4>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          data-testid="button-get-location"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                        >
                          {isGettingLocation ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-1"></div>
                              Getting Location...
                            </>
                          ) : (
                            <>
                              <Crosshair className="h-3 w-3 mr-1" />
                              Get My Location
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="text-sm text-yellow-700">
                        {currentLocation ? (
                          <div className="space-y-1">
                            <p className="font-medium">📍 Current GPS Coordinates:</p>
                            <p className="font-mono bg-white px-2 py-1 rounded text-xs">
                              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                            </p>
                            <p className="text-xs">Use this as a reference point before mapping the plot boundaries</p>
                          </div>
                        ) : (
                          <p>Click "Get My Location" to acquire your current GPS coordinates as a reference point for mapping.</p>
                        )}
                      </div>
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
          <div className="mt-8 space-y-4">
            <Button 
              type="submit" 
              size="lg" 
              disabled={createLandPlot.isPending || generateEudrReport.isPending || !selectedFarmerId}
              className="min-w-48 w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {createLandPlot.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Creating Land Plot...
                </>
              ) : generateEudrReport.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating EUDR Report...
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  🗺️ Create Land Plot & Generate EUDR Report
                </>
              )}
            </Button>

            {/* EUDR Generation Status */}
            {generateEudrReport.isPending && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  <div>
                    <div className="text-sm font-medium text-blue-800">🛰️ Generating EUDR Compliance Report</div>
                    <div className="text-xs text-blue-600">Processing boundary data and satellite analysis for EU Deforestation Regulation compliance...</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}