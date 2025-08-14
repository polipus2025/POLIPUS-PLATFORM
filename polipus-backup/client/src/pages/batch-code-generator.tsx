import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import QRCodeLib from "qrcode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  QrCode, 
  Package, 
  Search, 
  Download, 
  Copy, 
  CheckCircle, 
  Barcode,
  MapPin,
  Calendar,
  User,
  Leaf,
  Crosshair,
  Navigation,
  Satellite
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Farmer, Commodity } from "@shared/schema";

// Liberian counties for dropdown
const LIBERIAN_COUNTIES = [
  "Bomi County", "Bong County", "Gbarpolu County", "Grand Bassa County",
  "Grand Cape Mount County", "Grand Gedeh County", "Grand Kru County",
  "Lofa County", "Margibi County", "Maryland County", "Montserrado County",
  "Nimba County", "River Cess County", "River Gee County", "Sinoe County"
];

// Crop types available in Liberia
const CROP_TYPES = [
  { value: "coffee", label: "Coffee" },
  { value: "cocoa", label: "Cocoa" },
  { value: "rubber", label: "Rubber" },
  { value: "palm_oil", label: "Palm Oil" },
  { value: "rice", label: "Rice" },
  { value: "cassava", label: "Cassava" },
  { value: "plantain", label: "Plantain" },
  { value: "banana", label: "Banana" },
  { value: "sugarcane", label: "Sugarcane" },
  { value: "pepper", label: "Pepper" },
  { value: "ginger", label: "Ginger" },
  { value: "turmeric", label: "Turmeric" },
  { value: "kola_nut", label: "Kola Nut" },
  { value: "sesame", label: "Sesame" },
  { value: "peanut", label: "Peanut" }
];

// Quality grades
const QUALITY_GRADES = [
  { value: "grade_a", label: "Grade A (Premium)" },
  { value: "grade_b", label: "Grade B (Standard)" },
  { value: "grade_c", label: "Grade C (Commercial)" },
  { value: "grade_d", label: "Grade D (Fair)" }
];

interface BatchCodeForm {
  farmerId: string;
  cropType: string;
  county: string;
  district: string;
  quantity: string;
  unit: string;
  qualityGrade: string;
  harvestDate: string;
  latitude: string;
  longitude: string;
  altitude: string;
  gpsAccuracy: string;
  plotId: string;
  notes: string;
}

export default function BatchCodeGenerator() {
  const [formData, setFormData] = useState<BatchCodeForm>({
    farmerId: "",
    cropType: "",
    county: "",
    district: "",
    quantity: "",
    unit: "kg",
    qualityGrade: "",
    harvestDate: "",
    latitude: "",
    longitude: "",
    altitude: "",
    gpsAccuracy: "high",
    plotId: "",
    notes: ""
  });
  const [generatedBatchCode, setGeneratedBatchCode] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [gpsLoading, setGpsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: farmers = [], isLoading: farmersLoading } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers"],
  });

  const { data: commodities = [], isLoading: commoditiesLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const { data: farmPlots = [] } = useQuery<any[]>({
    queryKey: ["/api/farm-plots"],
  });

  const createCommodityMutation = useMutation({
    mutationFn: async (commodityData: any) => {
      const response = await apiRequest("/api/commodities", {
        method: "POST",
        body: JSON.stringify(commodityData)
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/commodities"] });
      toast({
        title: "Commodity Registered",
        description: "Batch code generated and commodity registered successfully.",
      });
      // Reset form
      setFormData({
        farmerId: "",
        cropType: "",
        county: "",
        district: "",
        quantity: "",
        unit: "kg",
        qualityGrade: "",
        harvestDate: "",
        latitude: "",
        longitude: "",
        altitude: "",
        gpsAccuracy: "high",
        plotId: "",
        notes: ""
      });
      setGeneratedBatchCode("");
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: "Failed to register commodity. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate unique batch code
  const generateBatchCode = () => {
    if (!formData.cropType || !formData.county || !formData.harvestDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in crop type, county, and harvest date to generate batch code.",
        variant: "destructive",
      });
      return;
    }

    const cropPrefix = formData.cropType.slice(0, 3).toUpperCase();
    const countyCode = formData.county.split(' ')[0].slice(0, 3).toUpperCase();
    const year = new Date(formData.harvestDate).getFullYear();
    const month = String(new Date(formData.harvestDate).getMonth() + 1).padStart(2, '0');
    const day = String(new Date(formData.harvestDate).getDate()).padStart(2, '0');
    
    // Generate sequence number (simplified - in production would check database)
    const sequenceNumber = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    
    const batchCode = `${cropPrefix}-${countyCode}-${year}${month}${day}-${sequenceNumber}`;
    setGeneratedBatchCode(batchCode);
    
    toast({
      title: "Batch Code Generated",
      description: `Batch code ${batchCode} has been generated.`,
    });
  };

  // Register commodity with batch code
  const registerCommodity = () => {
    if (!generatedBatchCode) {
      toast({
        title: "No Batch Code",
        description: "Please generate a batch code first.",
        variant: "destructive",
      });
      return;
    }

    const selectedFarmer = formData.farmerId && formData.farmerId !== "none" 
      ? farmers.find(f => f.id === parseInt(formData.farmerId))
      : null;
    
    const commodityData = {
      batchNumber: generatedBatchCode,
      name: CROP_TYPES.find(c => c.value === formData.cropType)?.label || formData.cropType,
      type: formData.cropType,
      quantity: formData.quantity,
      unit: formData.unit,
      qualityGrade: formData.qualityGrade,
      county: formData.county,
      district: formData.district,
      farmerId: formData.farmerId && formData.farmerId !== "none" ? parseInt(formData.farmerId) : null,
      farmerName: selectedFarmer ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}` : null,
      harvestDate: formData.harvestDate ? new Date(formData.harvestDate) : null,
      gpsCoordinates: formData.latitude && formData.longitude 
        ? `${formData.latitude},${formData.longitude}${formData.altitude ? `,${formData.altitude}` : ''}` 
        : null,
      gpsAccuracy: formData.gpsAccuracy || null,
      plotId: formData.plotId || null,
      status: "registered",
      notes: formData.notes || null
    };

    createCommodityMutation.mutate(commodityData);
  };

  // Copy batch code to clipboard
  const copyBatchCode = async (batchCode: string) => {
    try {
      await navigator.clipboard.writeText(batchCode);
      toast({
        title: "Copied",
        description: `Batch code ${batchCode} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy batch code to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Get current GPS location
  const getCurrentLocation = () => {
    setGpsLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, altitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          altitude: altitude ? altitude.toFixed(2) : "",
        }));
        
        toast({
          title: "GPS Location Detected",
          description: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });
        setGpsLoading(false);
      },
      (error) => {
        let errorMessage = "Failed to get GPS location.";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "GPS access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "GPS position unavailable. Please try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "GPS request timed out. Please try again.";
            break;
        }
        
        toast({
          title: "GPS Error",
          description: errorMessage,
          variant: "destructive",
        });
        setGpsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Load GPS from selected farm plot
  const loadPlotGPS = (plotId: string) => {
    const plot = farmPlots.find(p => p.id === parseInt(plotId));
    if (plot && plot.gpsCoordinates) {
      try {
        const coords = JSON.parse(plot.gpsCoordinates);
        if (coords && coords.length > 0) {
          const centerCoord = coords[0]; // Use first coordinate as center
          setFormData(prev => ({
            ...prev,
            latitude: centerCoord.lat?.toString() || "",
            longitude: centerCoord.lng?.toString() || "",
            plotId: plotId
          }));
          
          toast({
            title: "Plot GPS Loaded",
            description: `Coordinates loaded from ${plot.plotName}`,
          });
        }
      } catch (error) {
        toast({
          title: "GPS Load Error",
          description: "Failed to load GPS coordinates from plot.",
          variant: "destructive",
        });
      }
    }
  };

  // Download batch code label
  const downloadBatchLabel = (batchCode: string, commodityData?: any) => {
    const labelContent = generateBatchLabel(batchCode, commodityData);
    const blob = new Blob([labelContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `batch-label-${batchCode}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Label Downloaded",
      description: "Batch code label has been downloaded.",
    });
  };

  // Generate batch label content
  const generateBatchLabel = (batchCode: string, commodityData?: any) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Batch Code Label - ${batchCode}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; background: #f9fafb; }
          .label { background: white; border: 2px solid #16a34a; width: 400px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 1px solid #16a34a; padding-bottom: 10px; margin-bottom: 15px; }
          .logo { color: #16a34a; font-size: 18px; font-weight: bold; }
          .batch-code { font-size: 24px; font-weight: bold; text-align: center; background: #f0f9ff; padding: 10px; border-radius: 5px; margin: 15px 0; letter-spacing: 2px; }
          .details { font-size: 12px; }
          .detail-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .qr-placeholder { width: 80px; height: 80px; border: 2px dashed #ccc; margin: 10px auto; display: flex; align-items: center; justify-content: center; font-size: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="label">
          <div class="header">
            <div class="logo">LACRA - AgriTrace360™</div>
            <div style="font-size: 14px; font-weight: bold;">CROP BATCH LABEL</div>
          </div>
          
          <div class="batch-code">${batchCode}</div>
          
          <div class="details">
            ${commodityData ? `
              <div class="detail-row">
                <span><strong>Crop:</strong></span>
                <span>${commodityData.name}</span>
              </div>
              <div class="detail-row">
                <span><strong>County:</strong></span>
                <span>${commodityData.county}</span>
              </div>
              <div class="detail-row">
                <span><strong>Quantity:</strong></span>
                <span>${commodityData.quantity} ${commodityData.unit}</span>
              </div>
              <div class="detail-row">
                <span><strong>Quality:</strong></span>
                <span>${commodityData.qualityGrade}</span>
              </div>
              <div class="detail-row">
                <span><strong>Harvest:</strong></span>
                <span>${new Date(commodityData.harvestDate).toLocaleDateString()}</span>
              </div>
              ${commodityData.farmerName ? `
                <div class="detail-row">
                  <span><strong>Farmer:</strong></span>
                  <span>${commodityData.farmerName}</span>
                </div>
              ` : ''}
              ${commodityData.gpsCoordinates ? `
                <div class="detail-row">
                  <span><strong>GPS:</strong></span>
                  <span style="font-family: monospace; font-size: 10px;">${commodityData.gpsCoordinates}</span>
                </div>
              ` : ''}
              ${commodityData.gpsAccuracy ? `
                <div class="detail-row">
                  <span><strong>Accuracy:</strong></span>
                  <span>${commodityData.gpsAccuracy}</span>
                </div>
              ` : ''}
            ` : `
              <div class="detail-row">
                <span><strong>Crop:</strong></span>
                <span>${CROP_TYPES.find(c => c.value === formData.cropType)?.label || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span><strong>County:</strong></span>
                <span>${formData.county}</span>
              </div>
              <div class="detail-row">
                <span><strong>Generated:</strong></span>
                <span>${new Date().toLocaleDateString()}</span>
              </div>
              ${formData.latitude && formData.longitude ? `
                <div class="detail-row">
                  <span><strong>GPS:</strong></span>
                  <span style="font-family: monospace; font-size: 10px;">${formData.latitude}, ${formData.longitude}</span>
                </div>
              ` : ''}
            `}
          </div>
          
          <div class="qr-placeholder">
            QR Code
            Placeholder
          </div>
          
          <div style="text-align: center; font-size: 10px; margin-top: 10px; color: #666;">
            <p>Scan QR code to verify authenticity</p>
            <p>For verification visit: verify.lacra.gov.lr</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const filteredCommodities = commodities.filter(commodity =>
    commodity.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commodity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commodity.county?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      registered: 'text-green-700 bg-green-100',
      pending: 'text-yellow-700 bg-yellow-100',
      approved: 'text-blue-700 bg-blue-100',
      rejected: 'text-red-700 bg-red-100'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100'} text-xs font-medium rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Batch Code Generator - AgriTrace360™ LACRA</title>
        <meta name="description" content="Generate unique, traceable batch codes for agricultural commodities registered by farmers" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <QrCode className="h-8 w-8 text-lacra-green" />
          <h2 className="text-2xl font-bold text-neutral">Batch Code Generator</h2>
        </div>
        <p className="text-gray-600">Generate unique, traceable batch codes for farmer crop registrations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batch Code Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral flex items-center gap-2">
              <Package className="h-5 w-5" />
              Generate New Batch Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Farmer Selection */}
            <div>
              <Label htmlFor="farmer">Farmer (Optional)</Label>
              <Select value={formData.farmerId} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, farmerId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select farmer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No farmer selected</SelectItem>
                  {farmers.map(farmer => (
                    <SelectItem key={farmer.id} value={farmer.id.toString()}>
                      {farmer.firstName} {farmer.lastName} - {farmer.farmerId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Crop Type */}
            <div>
              <Label htmlFor="cropType">Crop Type *</Label>
              <Select value={formData.cropType} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, cropType: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {CROP_TYPES.map(crop => (
                    <SelectItem key={crop.value} value={crop.value}>
                      {crop.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="county">County *</Label>
                <Select value={formData.county} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, county: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIBERIAN_COUNTIES.map(county => (
                      <SelectItem key={county} value={county}>
                        {county}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="Enter district"
                />
              </div>
            </div>

            {/* Quantity and Quality */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, unit: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="tons">tons</SelectItem>
                    <SelectItem value="bags">bags</SelectItem>
                    <SelectItem value="liters">liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quality Grade */}
            <div>
              <Label htmlFor="qualityGrade">Quality Grade</Label>
              <Select value={formData.qualityGrade} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, qualityGrade: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality grade" />
                </SelectTrigger>
                <SelectContent>
                  {QUALITY_GRADES.map(grade => (
                    <SelectItem key={grade.value} value={grade.value}>
                      {grade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Harvest Date */}
            <div>
              <Label htmlFor="harvestDate">Harvest Date *</Label>
              <Input
                id="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
              />
            </div>

            {/* GPS Coordinates Section */}
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <Satellite className="h-4 w-4" />
                  GPS Coordinates & Location Data
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={getCurrentLocation}
                    disabled={gpsLoading}
                    className="text-blue-700 border-blue-300"
                  >
                    {gpsLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-700 mr-1"></div>
                        Getting GPS...
                      </>
                    ) : (
                      <>
                        <Crosshair className="h-3 w-3 mr-1" />
                        Get Current Location
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Farm Plot Selection */}
              <div>
                <Label htmlFor="plotId">Load from Farm Plot</Label>
                <Select 
                  value={formData.plotId} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, plotId: value }));
                    if (value && value !== "none") {
                      loadPlotGPS(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select farm plot (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No plot selected</SelectItem>
                    {farmPlots.map(plot => (
                      <SelectItem key={plot.id} value={plot.id.toString()}>
                        {plot.plotName} - {plot.cropType} ({plot.plotSize} {plot.plotSizeUnit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* GPS Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="e.g., 6.3133"
                  />
                </div>
                
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="e.g., -10.8074"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="altitude">Altitude (meters)</Label>
                  <Input
                    id="altitude"
                    type="number"
                    step="0.1"
                    value={formData.altitude}
                    onChange={(e) => setFormData(prev => ({ ...prev, altitude: e.target.value }))}
                    placeholder="e.g., 125.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="gpsAccuracy">GPS Accuracy</Label>
                  <Select value={formData.gpsAccuracy} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, gpsAccuracy: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (±1-3m)</SelectItem>
                      <SelectItem value="medium">Medium (±3-5m)</SelectItem>
                      <SelectItem value="low">Low (±5-10m)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* GPS Coordinates Display */}
              {(formData.latitude && formData.longitude) && (
                <div className="p-3 bg-white border border-blue-200 rounded">
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">GPS Location:</span>
                    <span className="font-mono text-blue-800">
                      {formData.latitude}, {formData.longitude}
                      {formData.altitude && ` (${formData.altitude}m)`}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Accuracy: {formData.gpsAccuracy} • Ready for batch code generation
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter any additional notes..."
                rows={3}
              />
            </div>

            {/* Generated Batch Code Display */}
            {generatedBatchCode && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <Label className="text-sm font-medium text-green-800">Generated Batch Code</Label>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-2xl font-mono font-bold text-green-900">{generatedBatchCode}</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyBatchCode(generatedBatchCode)}
                    className="text-green-700 border-green-300"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadBatchLabel(generatedBatchCode)}
                    className="text-green-700 border-green-300"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={generateBatchCode}
                className="bg-lacra-blue hover:bg-blue-700 text-white"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Generate Batch Code
              </Button>
              
              {generatedBatchCode && (
                <Button 
                  onClick={registerCommodity}
                  disabled={createCommodityMutation.isPending}
                  className="bg-lacra-green hover:bg-green-700 text-white"
                >
                  {createCommodityMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Register Commodity
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registered Commodities List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral flex items-center gap-2">
              <Barcode className="h-5 w-5" />
              Registered Batch Codes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by batch code, crop, or county..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Commodities List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {commoditiesLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredCommodities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No registered commodities found.</p>
                  <p className="text-sm">Generate and register your first batch code.</p>
                </div>
              ) : (
                filteredCommodities.map((commodity) => (
                  <div key={commodity.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-mono font-bold text-lacra-blue">{commodity.batchNumber}</div>
                        <div className="text-sm font-medium">{commodity.name}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyBatchCode(commodity.batchNumber)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => downloadBatchLabel(commodity.batchNumber, commodity)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {commodity.county}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {commodity.quantity} {commodity.unit}
                      </div>
                      {commodity.harvestDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(commodity.harvestDate).toLocaleDateString()}
                        </div>
                      )}
                      {commodity.farmerName && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {commodity.farmerName}
                        </div>
                      )}
                      {commodity.gpsCoordinates && (
                        <div className="flex items-center gap-1">
                          <Satellite className="h-3 w-3" />
                          <span className="font-mono text-xs">{commodity.gpsCoordinates}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1">
                        <Leaf className="h-3 w-3 text-green-600" />
                        <span className="text-xs text-gray-600">{commodity.qualityGrade}</span>
                      </div>
                      {getStatusBadge(commodity.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Panel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">Batch Code Format & Traceability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Batch Code Structure</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-mono">CRP-CTY-YYYYMMDD-SEQ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Example:</span>
                  <span className="font-mono text-lacra-blue">COF-BOM-20241222-001</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  <p>• CRP: Crop type (first 3 letters)</p>
                  <p>• CTY: County code (first 3 letters)</p>
                  <p>• YYYYMMDD: Harvest date</p>
                  <p>• SEQ: Sequential number (001-999)</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Traceability Features</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Unique identification for each crop batch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Real-time verification through system database</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>GPS mapping integration with precise coordinates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Automatic location detection and farm plot linking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Printable labels with QR codes for physical tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Integration with farmer profiles and plot mapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>EUDR compliance and export certificate compatibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>High-accuracy GPS coordinates for supply chain transparency</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}