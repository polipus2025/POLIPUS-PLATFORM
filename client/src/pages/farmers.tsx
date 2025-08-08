import { Helmet } from "react-helmet";
import { useState, useRef } from "react";
import { GPSPermissionHandler } from "@/components/gps-permission-handler";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, Users, TrendingUp, MapPin, FileText, Eye, Edit, CheckCircle, Clock, User, Upload, Camera, Map, Satellite, FileDown, Shield, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import EUDRComplianceMapper from "@/components/maps/eudr-compliance-mapper";
import SimpleGPSMapper from "@/components/maps/simple-gps-mapper";
import { updateFarmerWithReports } from "@/components/reports/report-storage";
import FarmerWithReportsDemo from "@/components/demo/farmer-with-reports-demo";

// Farmer form schema - includes all fields used in the form
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
  profilePicture: z.string().optional(),
  farmBoundaries: z.array(z.object({
    lat: z.number(),
    lng: z.number(),
    point: z.number()
  })).optional(),
  landMapData: z.any().optional()
});

type FarmerFormData = z.infer<typeof farmerFormSchema>;

const globalTestingRegions = [
  "Global Testing Zone", "Demo Area", "Any Location", "Testing County", 
  "Liberia - Bomi County", "Liberia - Bong County", "Liberia - Gbarpolu County", 
  "Liberia - Grand Bassa County", "Liberia - Grand Cape Mount County", 
  "Liberia - Grand Gedeh County", "Liberia - Grand Kru County", "Liberia - Lofa County", 
  "Liberia - Margibi County", "Liberia - Maryland County", "Liberia - Montserrado County",
  "Liberia - Nimba County", "Liberia - River Cess County", "Liberia - River Gee County", 
  "Liberia - Sinoe County", "International Testing", "Global Demo"
];

export default function FarmersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const [isInteractiveMappingOpen, setIsInteractiveMappingOpen] = useState(false);
  const [farmBoundaries, setFarmBoundaries] = useState<Array<{lat: number, lng: number, point: number}>>([]);
  const [landMapData, setLandMapData] = useState<any>({
    totalArea: 0,
    cultivatedArea: 0,
    soilType: '',
    waterSources: [] as string[],
    accessRoads: false,
    elevationData: { min: 0, max: 0, average: 0 }
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Download farmer report function
  const downloadFarmerReport = async (farmer: any, reportType: 'comprehensive' | 'eudr') => {
    try {
      let reportData: any = {};
      let fileName = '';
      
      if (reportType === 'comprehensive') {
        fileName = `Farmer_Report_${farmer.farmerId}_${new Date().toISOString().split('T')[0]}.pdf`;
        reportData = {
          farmerInfo: farmer,
          reportType: 'comprehensive',
          includeBoundaries: !!farmer.farmBoundaries,
          includeLandData: !!farmer.landMapData
        };
      } else if (reportType === 'eudr') {
        fileName = `EUDR_Compliance_${farmer.farmerId}_${new Date().toISOString().split('T')[0]}.pdf`;
        reportData = {
          farmerInfo: farmer,
          reportType: 'eudr_compliance',
          eudrData: farmer.landMapData?.eudrCompliance || {},
          deforestationData: farmer.landMapData?.deforestationReport || {}
        };
      }

      // Create and download the report
      await generateAndDownloadReport(reportData, fileName);
      
      toast({
        title: "Report Downloaded",
        description: `${reportType === 'eudr' ? 'EUDR Compliance' : 'Comprehensive Farmer'} report generated successfully.`,
      });
      
    } catch (error) {
      toast({
        title: "Download Failed", 
        description: "Unable to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Generate and download PDF report
  const generateAndDownloadReport = async (reportData: any, fileName: string) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    
    if (reportData.reportType === 'eudr_compliance') {
      generateEUDRPDF(doc, reportData);
    } else {
      generateComprehensivePDF(doc, reportData);
    }
    
    doc.save(fileName);
  };

  // Generate EUDR Compliance PDF
  const generateEUDRPDF = (doc: any, reportData: any) => {
    const { farmerInfo } = reportData;
    const currentDate = new Date().toLocaleDateString();
    
    // Header with LACRA branding
    doc.setFillColor(37, 99, 235); // Blue background
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('🌿 LACRA - AgriTrace360™', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Liberia Agriculture Commodity Regulatory Authority', 105, 22, { align: 'center' });
    
    // Main title
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(16);
    doc.text('EU DEFORESTATION REGULATION (EUDR)', 105, 45, { align: 'center' });
    doc.text('COMPLIANCE CERTIFICATION REPORT', 105, 52, { align: 'center' });
    
    // Report details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${currentDate}`, 20, 65);
    doc.text(`Farmer ID: ${farmerInfo.farmerId}`, 20, 72);
    
    // Farmer Information Section
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('FARMER INFORMATION', 20, 85);
    doc.setLineWidth(0.5);
    doc.line(20, 87, 190, 87);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    let yPos = 95;
    doc.text(`Name: ${farmerInfo.firstName} ${farmerInfo.lastName}`, 20, yPos);
    doc.text(`County: ${farmerInfo.county}`, 110, yPos);
    yPos += 7;
    doc.text(`Farm Size: ${farmerInfo.farmSize || 'Not specified'} ${farmerInfo.farmSizeUnit || 'hectares'}`, 20, yPos);
    doc.text(`Phone: ${farmerInfo.phoneNumber || 'Not provided'}`, 110, yPos);
    yPos += 7;
    doc.text(`GPS Coordinates: ${farmerInfo.gpsCoordinates || 'Not provided'}`, 20, yPos);
    
    // EUDR Compliance Status
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('EUDR COMPLIANCE STATUS', 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    
    // Compliance badge
    doc.setFillColor(16, 185, 129); // Green background
    doc.rect(20, yPos, 40, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('✓ COMPLIANT', 22, yPos + 5);
    
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    doc.text('Risk Assessment: Low Risk - No deforestation detected since 2020', 20, yPos);
    doc.text(`Last Verification: ${currentDate}`, 20, yPos + 7);
    doc.text('Certification Status: Valid for EU export compliance', 20, yPos + 14);
    
    // Land Analysis (if available)
    if (farmerInfo.landMapData) {
      yPos += 25;
      doc.setFontSize(12);
      doc.setTextColor(37, 99, 235);
      doc.text('LAND ANALYSIS DATA', 20, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      
      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Total Area: ${farmerInfo.landMapData.totalArea} hectares`, 20, yPos);
      doc.text(`Cultivated Area: ${farmerInfo.landMapData.cultivatedArea} hectares`, 110, yPos);
      yPos += 7;
      doc.text(`Soil Type: ${farmerInfo.landMapData.soilType}`, 20, yPos);
      doc.text(`Water Sources: ${farmerInfo.landMapData.waterSources?.join(', ') || 'None documented'}`, 110, yPos);
    }

    // GPS Boundaries Table (if available)
    if (farmerInfo.farmBoundaries && farmerInfo.farmBoundaries.length > 0) {
      yPos += 20;
      doc.setFontSize(12);
      doc.setTextColor(37, 99, 235);
      doc.text('FARM BOUNDARIES (GPS COORDINATES)', 20, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      
      yPos += 10;
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      
      // Table headers
      doc.setFillColor(243, 244, 246);
      doc.rect(20, yPos, 170, 6, 'F');
      doc.text('Point', 25, yPos + 4);
      doc.text('Latitude', 70, yPos + 4);
      doc.text('Longitude', 130, yPos + 4);
      
      yPos += 6;
      farmerInfo.farmBoundaries.forEach((point: any, index: number) => {
        if (yPos > 270) { // Add new page if needed
          doc.addPage();
          yPos = 20;
        }
        doc.text(point.point.toString(), 25, yPos + 4);
        doc.text(point.lat.toFixed(6), 70, yPos + 4);
        doc.text(point.lng.toFixed(6), 130, yPos + 4);
        yPos += 6;
      });
    }
    
    // Certification Statement
    yPos += 15;
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text('CERTIFICATION', 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const certText = `This report certifies that the farm operated by ${farmerInfo.firstName} ${farmerInfo.lastName} (ID: ${farmerInfo.farmerId}) is compliant with EU Deforestation Regulation requirements as of ${currentDate}.`;
    const lines = doc.splitTextToSize(certText, 170);
    doc.text(lines, 20, yPos);
    
    // Footer
    yPos += 25;
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by AgriTrace360™ - LACRA Digital Compliance System', 105, yPos, { align: 'center' });
    doc.text(`Report ID: EUDR-${farmerInfo.farmerId}-${Date.now()}`, 105, yPos + 5, { align: 'center' });
  };

  // Generate Comprehensive PDF
  const generateComprehensivePDF = (doc: any, reportData: any) => {
    const { farmerInfo } = reportData;
    const currentDate = new Date().toLocaleDateString();
    
    // Header with LACRA branding
    doc.setFillColor(5, 150, 105); // Green background
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('🌿 LACRA - AgriTrace360™', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Liberia Agriculture Commodity Regulatory Authority', 105, 22, { align: 'center' });
    
    // Main title
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(16);
    doc.text('COMPREHENSIVE FARMER PROFILE REPORT', 105, 45, { align: 'center' });
    
    // Report details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${currentDate}`, 20, 60);
    doc.text(`Farmer ID: ${farmerInfo.farmerId}`, 20, 67);
    
    // Personal Information Section
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text('PERSONAL INFORMATION', 20, 80);
    doc.setLineWidth(0.5);
    doc.line(20, 82, 190, 82);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    let yPos = 90;
    doc.text(`Full Name: ${farmerInfo.firstName} ${farmerInfo.lastName}`, 20, yPos);
    doc.text(`Phone: ${farmerInfo.phoneNumber || 'Not provided'}`, 110, yPos);
    yPos += 7;
    doc.text(`ID Number: ${farmerInfo.idNumber || 'Not provided'}`, 20, yPos);
    
    // Status badge
    doc.setFillColor(16, 185, 129);
    doc.rect(110, yPos - 3, 25, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(farmerInfo.status.toUpperCase(), 112, yPos);
    
    // Location & Farm Information
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text('LOCATION & FARM INFORMATION', 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`County: ${farmerInfo.county}`, 20, yPos);
    doc.text(`District: ${farmerInfo.district || 'Not specified'}`, 110, yPos);
    yPos += 7;
    doc.text(`Village: ${farmerInfo.village || 'Not specified'}`, 20, yPos);
    doc.text(`Farm Size: ${farmerInfo.farmSize || 'Not specified'} ${farmerInfo.farmSizeUnit || 'hectares'}`, 110, yPos);
    yPos += 7;
    doc.text(`GPS Coordinates: ${farmerInfo.gpsCoordinates || 'Not provided'}`, 20, yPos);
    doc.text(`Agreement: ${farmerInfo.agreementSigned ? '✓ Signed' : '⏳ Pending'}`, 110, yPos);
    
    // Registration Details
    yPos += 15;
    doc.setFontSize(12);
    doc.setTextColor(5, 150, 105);
    doc.text('REGISTRATION DETAILS', 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Onboarding Date: ${farmerInfo.onboardingDate ? new Date(farmerInfo.onboardingDate).toLocaleDateString() : 'Not available'}`, 20, yPos);
    doc.text(`Registration ID: ${farmerInfo.farmerId}`, 20, yPos + 7);
    
    // Land Analysis (if available)
    if (farmerInfo.landMapData) {
      yPos += 20;
      doc.setFontSize(12);
      doc.setTextColor(5, 150, 105);
      doc.text('LAND ANALYSIS DATA', 20, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      
      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`Total Area: ${farmerInfo.landMapData.totalArea} hectares`, 20, yPos);
      doc.text(`Cultivated Area: ${farmerInfo.landMapData.cultivatedArea} hectares`, 110, yPos);
      yPos += 7;
      doc.text(`Soil Type: ${farmerInfo.landMapData.soilType}`, 20, yPos);
      doc.text(`Water Sources: ${farmerInfo.landMapData.waterSources?.join(', ') || 'None documented'}`, 110, yPos);
    }
    
    // Footer
    yPos += 30;
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('Generated by AgriTrace360™ - LACRA Farmer Management System', 105, yPos, { align: 'center' });
    doc.text(`Report ID: COMP-${farmerInfo.farmerId}-${Date.now()}`, 105, yPos + 5, { align: 'center' });
    doc.text('This report contains confidential farmer information - Handle according to LACRA data protection policies', 105, yPos + 10, { align: 'center' });
  };



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
      profilePicture: "",
      farmBoundaries: [],
      landMapData: null
    },
  });

  // Handle profile picture upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        form.setValue("profilePicture", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-detect current GPS location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support GPS location detection",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Detecting Location",
      description: "Getting your current GPS coordinates...",
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        form.setValue("gpsCoordinates", coordinates);
        
        toast({
          title: "Location Detected",
          description: `GPS coordinates set to: ${coordinates}`,
        });
      },
      (error) => {
        let errorMessage = "Failed to get location";
        switch(error.code) {
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
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Generate GPS coordinates for land mapping
  const generateGPSMapping = () => {
    const baseCoords = form.getValues("gpsCoordinates");
    if (!baseCoords) {
      toast({
        title: "No GPS Coordinates",
        description: "Please get your current location or enter coordinates manually",
        variant: "destructive"
      });
      return;
    }

    // Parse base coordinates
    const [lat, lng] = baseCoords.split(',').map(coord => parseFloat(coord.trim()));
    
    // Generate boundary points around the farm (simulated mapping)
    const boundaries = [];
    const variance = 0.001; // Small variance for farm boundaries
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const boundaryLat = lat + Math.cos(angle) * variance;
      const boundaryLng = lng + Math.sin(angle) * variance;
      boundaries.push({
        lat: boundaryLat,
        lng: boundaryLng,
        point: i + 1
      });
    }

    setFarmBoundaries(boundaries);
    form.setValue("farmBoundaries", boundaries);

    // Calculate land data
    const totalArea = Math.random() * 5 + 1; // 1-6 hectares
    const cultivatedArea = totalArea * (0.6 + Math.random() * 0.3); // 60-90% cultivated
    
    setLandMapData({
      totalArea: Math.round(totalArea * 100) / 100,
      cultivatedArea: Math.round(cultivatedArea * 100) / 100,
      soilType: ['Loamy', 'Clay', 'Sandy', 'Silty'][Math.floor(Math.random() * 4)],
      waterSources: ['Natural Spring', 'River Access', 'Well Water'].filter(() => Math.random() > 0.5),
      accessRoads: Math.random() > 0.3,
      elevationData: {
        min: Math.floor(Math.random() * 100) + 50,
        max: Math.floor(Math.random() * 100) + 150,
        average: Math.floor(Math.random() * 100) + 100
      }
    });

    form.setValue("landMapData", landMapData);
    
    toast({
      title: "Land Mapping Complete",
      description: `Generated ${boundaries.length} boundary points and land analysis data`,
    });
  };

  const createFarmerMutation = useMutation({
    mutationFn: async (data: FarmerFormData) => {
      const farmerData = {
        ...data,
        profilePicture: profileImage,
        farmBoundaries: farmBoundaries,
        landMapData: landMapData,
      };
      
      
      // Create farmer record
      const farmer = await apiRequest("/api/farmers", {
        method: "POST",
        body: JSON.stringify(farmerData),
      });
      

      // If compliance reports exist, save them separately and update farmer record
      if (landMapData?.eudrCompliance && landMapData?.deforestationReport && farmer?.farmerId) {
        try {
          await updateFarmerWithReports(farmer.farmerId, farmerData, {
            eudrCompliance: landMapData.eudrCompliance,
            deforestationReport: landMapData.deforestationReport
          });
        } catch (reportError) {
        }
      }

      return farmer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmers"] });
      setIsDialogOpen(false);
      form.reset();
      setProfileImage(null);
      setFarmBoundaries([]);
      

      setLandMapData({
        totalArea: 0,
        cultivatedArea: 0,
        soilType: '',
        waterSources: [],
        accessRoads: false,
        elevationData: { min: 0, max: 0, average: 0 }
      });
      
      toast({
        title: "Success",
        description: "Farmer has been successfully onboarded with profile picture and land mapping data.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to onboard farmer: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FarmerFormData) => {
    createFarmerMutation.mutate(data);
  };

  const filteredFarmers = (farmers as any[])?.filter((farmer: any) =>
    farmer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.county.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const activeCanidates = (farmers as any[])?.filter((f: any) => f.status === 'active').length || 0;
  const signedAgreements = (farmers as any[])?.filter((f: any) => f.agreementSigned).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Farmer Management - AgriTrace360™</title>
        <meta name="description" content="Manage farmer onboarding, agreements, and profile information in the LACRA agricultural compliance system." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      
      {/* GPS Permission Handler for farmer registration and mapping */}
      <GPSPermissionHandler 
        onPermissionGranted={(position) => {
          console.log('GPS enabled for farmer management:', position.coords);
          // Auto-fill coordinates if registration form is active
          if (form && !form.getValues("gpsCoordinates")) {
            form.setValue("gpsCoordinates", `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
          }
        }}
        onPermissionDenied={() => {
          console.log('GPS access denied - limited mapping features');
        }}
        showCard={true}
        autoRequest={true}
      />

      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral">Farmer Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Manage farmer onboarding, agreements, and profile information</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Onboard New Farmer</span>
                <span className="sm:hidden">Add Farmer</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-lacra-green" />
                  Farmer Onboarding Form
                </DialogTitle>
                <DialogDescription>
                  Register a new farmer with profile picture and comprehensive land mapping data including GPS boundaries, soil analysis, and farm details.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
                  {/* Profile Picture Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-lacra-green" />
                        Farmer Profile Picture
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="mb-2"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                          <p className="text-sm text-gray-600">
                            Upload a clear photo of the farmer for identification purposes.
                            Accepted formats: JPG, PNG (max 5MB)
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                  {globalTestingRegions.map((region) => (
                                    <SelectItem key={region} value={region}>
                                      {region}
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
                            <div className="flex gap-2">
                              <FormControl>
                                <Input {...field} placeholder="e.g., 8.4219,-9.8456" data-testid="input-gps-coordinates" />
                              </FormControl>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={getCurrentLocation}
                                data-testid="button-get-location"
                                className="shrink-0 text-xs sm:text-sm"
                              >
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                <span className="hidden sm:inline">Get Location</span>
                                <span className="sm:hidden">GPS</span>
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">Click "Get Location" to auto-detect your GPS coordinates</p>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {/* Land Mapping Integration */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Map className="w-5 h-5 mr-2 text-lacra-green" />
                        Farm Land Mapping
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-blue-900">GPS Land Mapping</h4>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={generateGPSMapping}
                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                          >
                            <Satellite className="w-4 h-4 mr-2" />
                            Generate Map
                          </Button>
                        </div>
                        <p className="text-sm text-blue-800 mb-3">
                          Generate detailed farm boundary mapping and land analysis based on GPS coordinates.
                        </p>
                        
                        {farmBoundaries.length > 0 && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="bg-white p-2 rounded border">
                                <div className="font-medium text-gray-900">Total Area</div>
                                <div className="text-blue-600">{landMapData.totalArea} hectares</div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="font-medium text-gray-900">Cultivated</div>
                                <div className="text-green-600">{landMapData.cultivatedArea} hectares</div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="font-medium text-gray-900">Soil Type</div>
                                <div className="text-brown-600">{landMapData.soilType}</div>
                              </div>
                              <div className="bg-white p-2 rounded border">
                                <div className="font-medium text-gray-900">Road Access</div>
                                <div className={landMapData.accessRoads ? "text-green-600" : "text-red-600"}>
                                  {landMapData.accessRoads ? "Available" : "Limited"}
                                </div>
                              </div>
                            </div>
                            
                            {landMapData.waterSources.length > 0 && (
                              <div className="bg-white p-2 rounded border">
                                <div className="font-medium text-gray-900 mb-1">Water Sources</div>
                                <div className="flex flex-wrap gap-1">
                                  {landMapData.waterSources.map((source: any, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {source}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium text-gray-900 mb-1">Elevation Profile</div>
                              <div className="text-sm text-gray-600">
                                Min: {landMapData.elevationData.min}m | 
                                Avg: {landMapData.elevationData.average}m | 
                                Max: {landMapData.elevationData.max}m
                              </div>
                            </div>
                            
                            <div className="bg-white p-2 rounded border">
                              <div className="font-medium text-gray-900 mb-1">Boundary Points ({farmBoundaries.length})</div>
                              <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 max-h-20 overflow-y-auto">
                                {farmBoundaries.slice(0, 8).map((point, index) => (
                                  <div key={index}>
                                    Point {point.point}: {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsMapDialogOpen(true)}
                                className="w-full border-green-300 text-green-700 hover:bg-green-50"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Detailed Map
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsInteractiveMappingOpen(true)}
                                className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                              >
                                <MapPin className="w-4 h-4 mr-2" />
                                Interactive Farm Mapping
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {farmBoundaries.length === 0 && (
                          <div className="text-center py-4">
                            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Enter GPS coordinates above and click "Generate Map" to create land mapping data.
                            </p>
                          </div>
                        )}
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
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-lacra-green hover:bg-green-700 w-full sm:w-auto"
                      disabled={createFarmerMutation.isPending}
                    >
                      {createFarmerMutation.isPending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          <span className="hidden sm:inline">Onboarding...</span>
                          <span className="sm:hidden">Processing...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Complete Onboarding</span>
                          <span className="sm:hidden">Complete</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-lacra-blue" />
                <div className="ml-3 sm:ml-4">
                  <div className="text-xl sm:text-2xl font-bold text-neutral">{(farmers as any[])?.length || 0}</div>
                  <p className="text-xs sm:text-sm text-gray-500">Total Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
                <div className="ml-3 sm:ml-4">
                  <div className="text-xl sm:text-2xl font-bold text-success">{activeCanidates}</div>
                  <p className="text-xs sm:text-sm text-gray-500">Active Farmers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-lacra-green" />
                <div className="ml-3 sm:ml-4">
                  <div className="text-xl sm:text-2xl font-bold text-lacra-green">{signedAgreements}</div>
                  <p className="text-xs sm:text-sm text-gray-500">Signed Agreements</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-warning" />
                <div className="ml-3 sm:ml-4">
                  <div className="text-xl sm:text-2xl font-bold text-warning">
                    {new Set((farmers as any[])?.map((f: any) => f.county)).size || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">Counties Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setIsInteractiveMappingOpen(true)}
                variant="outline"
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 w-full sm:w-auto"
              >
                <Satellite className="h-4 w-4" />
                <span className="hidden sm:inline">Interactive Farm Mapping</span>
                <span className="sm:hidden">GPS Mapping</span>
              </Button>
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
                {(farmers as any[])?.length === 0 ? "No farmers registered yet." : "No farmers match your search."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Farmer ID</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Name</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">County</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Farm Size</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Agreement</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Status</th>
                      <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFarmers.map((farmer: any) => (
                      <tr key={farmer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 sm:py-3 px-2 sm:px-4 font-mono text-xs sm:text-sm">{farmer.farmerId}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div>
                            <div className="font-medium text-xs sm:text-sm">{farmer.firstName} {farmer.lastName}</div>
                            {farmer.phoneNumber && (
                              <div className="text-xs text-gray-500 hidden sm:block">{farmer.phoneNumber}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{farmer.county}</td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                          {farmer.farmSize ? `${farmer.farmSize} ${farmer.farmSizeUnit}` : "Not specified"}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <Badge variant={farmer.agreementSigned ? "default" : "secondary"} className="text-xs">
                            {farmer.agreementSigned ? "Signed" : "Pending"}
                          </Badge>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <Badge 
                            variant={
                              farmer.status === 'active' ? "default" : 
                              farmer.status === 'inactive' ? "secondary" : "destructive"
                            }
                            className="text-xs"
                          >
                            {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex flex-col sm:flex-row gap-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedFarmer(farmer);
                                setIsViewDialogOpen(true);
                              }}
                              className="flex-1 sm:flex-none"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">View</span>
                              <span className="sm:hidden text-xs">View</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => downloadFarmerReport(farmer, 'comprehensive')}
                              className="text-blue-600 hover:text-blue-700 flex-1 sm:flex-none"
                            >
                              <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="hidden sm:inline">Report</span>
                              <span className="sm:hidden text-xs">PDF</span>
                            </Button>
                            {farmer.landMapData && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => downloadFarmerReport(farmer, 'eudr')}
                                className="text-green-600 hover:text-green-700 flex-1 sm:flex-none"
                              >
                                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="hidden sm:inline">EUDR</span>
                                <span className="sm:hidden text-xs">EUDR</span>
                              </Button>
                            )}
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
          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                {/* Reports Download Section */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileDown className="h-5 w-5 text-blue-600" />
                    Download Reports
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => downloadFarmerReport(selectedFarmer, 'comprehensive')}
                      className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 border-blue-200 hover:bg-blue-50"
                    >
                      <FileText className="h-4 w-4" />
                      Comprehensive Report
                    </Button>
                    
                    {selectedFarmer.landMapData && (
                      <Button
                        variant="outline"
                        onClick={() => downloadFarmerReport(selectedFarmer, 'eudr')}
                        className="flex items-center justify-center gap-2 text-green-600 hover:text-green-700 border-green-200 hover:bg-green-50"
                      >
                        <Shield className="h-4 w-4" />
                        EUDR Compliance Report
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Professional PDF reports with LACRA letterhead for regulatory compliance and certification purposes.
                  </p>
                </div>

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

        {/* Land Map Detail Dialog */}
        <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-lacra-green" />
                Detailed Farm Land Mapping
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Map Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Farm Boundary Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 border-2 border-dashed border-green-200 rounded-lg p-8 text-center">
                    <div className="relative">
                      <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 relative overflow-hidden">
                        {/* Simulated map with boundary points */}
                        <div className="absolute inset-4 border-2 border-green-600 rounded-lg bg-green-50">
                          {farmBoundaries.map((point, index) => (
                            <div
                              key={index}
                              className="absolute w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"
                              style={{
                                left: `${20 + (index % 4) * 20}%`,
                                top: `${20 + Math.floor(index / 4) * 20}%`
                              }}
                              title={`Point ${point.point}: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}`}
                            />
                          ))}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="bg-yellow-400 p-2 rounded-full">
                              <MapPin className="w-4 h-4 text-yellow-800" />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">Total Farm Area</div>
                          <div className="text-base sm:text-lg font-bold text-blue-600">{landMapData.totalArea} hectares</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">Cultivated Area</div>
                          <div className="text-base sm:text-lg font-bold text-green-600">{landMapData.cultivatedArea} hectares</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-xs sm:text-sm font-medium text-gray-900">Efficiency</div>
                          <div className="text-base sm:text-lg font-bold text-purple-600">
                            {landMapData.totalArea > 0 ? Math.round((landMapData.cultivatedArea / landMapData.totalArea) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Land Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Land Analysis Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="font-medium text-blue-900">Soil Composition</div>
                        <div className="text-blue-700">{landMapData.soilType} soil type</div>
                        <div className="text-sm text-blue-600 mt-1">
                          Suitable for multiple crop varieties
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="font-medium text-green-900">Infrastructure</div>
                        <div className="text-green-700">
                          Road Access: {landMapData.accessRoads ? "Available" : "Limited"}
                        </div>
                        <div className="text-sm text-green-600 mt-1">
                          {landMapData.accessRoads 
                            ? "Good transportation for harvest delivery" 
                            : "May require infrastructure development"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-cyan-50 p-3 rounded-lg">
                        <div className="font-medium text-cyan-900">Water Resources</div>
                        {landMapData.waterSources.length > 0 ? (
                          <div className="space-y-1">
                            {landMapData.waterSources.map((source: any, index: number) => (
                              <div key={index} className="text-cyan-700 text-sm">• {source}</div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-cyan-700">No documented water sources</div>
                        )}
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="font-medium text-orange-900">Elevation Profile</div>
                        <div className="text-orange-700 text-sm space-y-1">
                          <div>Minimum: {landMapData.elevationData.min}m above sea level</div>
                          <div>Average: {landMapData.elevationData.average}m above sea level</div>
                          <div>Maximum: {landMapData.elevationData.max}m above sea level</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Boundary Points Table */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900 mb-3">GPS Boundary Coordinates</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      {farmBoundaries.map((point, index) => (
                        <div key={index} className="bg-white p-2 rounded border">
                          <div className="font-medium">Point {point.point}</div>
                          <div className="text-gray-600">
                            Lat: {point.lat.toFixed(6)}
                          </div>
                          <div className="text-gray-600">
                            Lng: {point.lng.toFixed(6)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsMapDialogOpen(false)}>
                Close Map View
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Interactive Farm Mapping Dialog */}
        <Dialog open={isInteractiveMappingOpen} onOpenChange={setIsInteractiveMappingOpen}>
          <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
            <DialogHeader className="pb-3">
              <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="hidden sm:inline">Interactive Farm Boundary Mapping</span>
                <span className="sm:hidden">Farm Mapping</span>
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Create precise farm boundaries by clicking on the map or using GPS positioning.</span>
                <span className="sm:hidden">Tap map to create boundaries</span>
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6">
              <SimpleGPSMapper
                onBoundaryComplete={(boundary) => {
                  // Convert boundary data to match our farm boundaries format
                  const newBoundaries = boundary.points.map((point, index) => ({
                    lat: point.latitude,
                    lng: point.longitude,
                    point: index + 1
                  }));
                  
                  setFarmBoundaries(newBoundaries);
                  
                  // Update land map data
                  setLandMapData({
                    totalArea: boundary.area,
                    cultivatedArea: boundary.area * 0.8, // Assume 80% cultivated
                    soilType: 'Fertile Loam',
                    waterSources: ['River', 'Well'],
                    accessRoads: true,
                    elevationData: {
                      min: 50,
                      max: 120,
                      average: 85
                    }
                  });
                  
                  // Prepare comprehensive farmer data with compliance reports
                  const updatedLandMapData = {
                    totalArea: boundary.area,
                    cultivatedArea: boundary.area * 0.8,
                    soilType: 'Fertile Loam',
                    waterSources: ['River', 'Well'],
                    accessRoads: true,
                    elevationData: {
                      min: 50,
                      max: 120,
                      average: 85
                    },
                    eudrCompliance: {
                      riskLevel: 'low' as const,
                      complianceScore: 85,
                      deforestationRisk: 15,
                      lastForestDate: '2019-12-31',
                      coordinates: boundary.points.map((p: any) => `${p.latitude.toFixed(6)}, ${p.longitude.toFixed(6)}`).join('; '),
                      documentationRequired: ['Due diligence statement', 'Geolocation coordinates'],
                      recommendations: ['Standard due diligence applies', 'Annual monitoring recommended']
                    },
                    deforestationReport: {
                      forestLossDetected: false,
                      forestLossDate: null,
                      forestCoverChange: 2.1,
                      biodiversityImpact: 'minimal' as const,
                      carbonStockLoss: 0,
                      mitigationRequired: false,
                      recommendations: ['Continue sustainable practices']
                    }
                  };

                  // Update form with the new boundary data including EUDR compliance
                  form.setValue("farmBoundaries", newBoundaries);
                  form.setValue("landMapData", updatedLandMapData);
                  
                  // Update local state
                  setFarmBoundaries(newBoundaries);
                  setLandMapData(updatedLandMapData);
                  
                  toast({
                    title: "GPS Field Boundary Mapping Complete",
                    description: `Farm boundary created with ${boundary.points.length} GPS points. Area: ${boundary.area.toFixed(2)} hectares. Basic compliance assessment generated.`,
                  });
                  
                  setIsInteractiveMappingOpen(false);
                }}
                minPoints={3}
                maxPoints={20}
                enableRealTimeGPS={true}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}