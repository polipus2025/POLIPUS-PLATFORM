import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  FileText, 
  ChevronDown, 
  Download,
  Leaf,
  MapPin,
  Award,
  Shield,
  Satellite,
  TreePine,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface CertificateDropdownProps {
  userType: "port-inspector" | "director";
}

interface CertificateFormData {
  [key: string]: any;
}

export default function CertificateDropdown({ userType }: CertificateDropdownProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFarmerSelectOpen, setIsFarmerSelectOpen] = useState(false);
  const [formData, setFormData] = useState<CertificateFormData>({});
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Fetch farmers for GPS-based certificates
  const { data: farmers } = useQuery({
    queryKey: ['/api/farmers'],
    enabled: isFarmerSelectOpen
  });

  // Certificate options based on user type
  const certificateOptions = userType === "port-inspector" 
    ? [
        { id: "phytosanitary", name: "Phytosanitary Certificate", icon: Leaf, type: "form" },
        { id: "origin", name: "Certificate of Origin", icon: MapPin, type: "form" },
        { id: "quality", name: "Quality Control Certificate", icon: Award, type: "form" },
        { id: "eudr", name: "EUDR Compliance Certificate", icon: Satellite, type: "auto" },
        { id: "deforestation", name: "Deforestation Analysis Certificate", icon: TreePine, type: "auto" }
      ]
    : [
        { id: "compliance", name: "Compliance Declaration Certificate", icon: Shield, type: "form" }
      ];

  const handleCertificateSelect = (certificateId: string) => {
    const certificate = certificateOptions.find(cert => cert.id === certificateId);
    setSelectedCertificate(certificateId);
    setFormData({});
    
    if (certificate?.type === "auto") {
      // GPS-based certificates need farmer selection
      setIsFarmerSelectOpen(true);
    } else {
      // Form-based certificates
      setIsFormOpen(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      let response;
      let fileName;
      
      const certificate = certificateOptions.find(cert => cert.id === selectedCertificate);
      
      if (certificate?.type === "auto") {
        // GPS-based certificates use farmer ID
        response = await fetch(`/api/certificates/generate/${selectedCertificate}/${selectedFarmerId}`);
        fileName = `${selectedCertificate}_certificate_${selectedFarmerId}.pdf`;
      } else {
        // Form-based certificates use form data
        response = await fetch(`/api/certificates/generate/${selectedCertificate}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        fileName = `${selectedCertificate}_certificate.pdf`;
      }

      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      // Download the generated certificate
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Certificate Generated",
        description: "Certificate has been generated and downloaded successfully."
      });

      setIsFormOpen(false);
      setIsFarmerSelectOpen(false);
      setSelectedCertificate("");
      setSelectedFarmerId("");
      setFormData({});
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderForm = () => {
    const certificateData = certificateOptions.find(cert => cert.id === selectedCertificate);
    if (!certificateData) return null;

    switch (selectedCertificate) {
      case "phytosanitary":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exporterName">Exporter Name</Label>
                <Input
                  id="exporterName"
                  value={formData.exporterName || ""}
                  onChange={(e) => updateFormData("exporterName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="exporterAddress">Exporter Address</Label>
                <Input
                  id="exporterAddress"
                  value={formData.exporterAddress || ""}
                  onChange={(e) => updateFormData("exporterAddress", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="commodity">Commodity</Label>
                <Select onValueChange={(value) => updateFormData("commodity", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select commodity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cocoa">Cocoa Beans</SelectItem>
                    <SelectItem value="coffee">Coffee Beans</SelectItem>
                    <SelectItem value="rubber">Rubber</SelectItem>
                    <SelectItem value="palm-oil">Palm Oil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  value={formData.quantity || ""}
                  onChange={(e) => updateFormData("quantity", e.target.value)}
                  placeholder="e.g., 1000 kg"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="originCountry">Country of Origin</Label>
                <Input
                  id="originCountry"
                  value={formData.originCountry || "Liberia"}
                  onChange={(e) => updateFormData("originCountry", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="destinationCountry">Destination Country</Label>
                <Input
                  id="destinationCountry"
                  value={formData.destinationCountry || ""}
                  onChange={(e) => updateFormData("destinationCountry", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="treatmentDetails">Treatment Details</Label>
              <Textarea
                id="treatmentDetails"
                value={formData.treatmentDetails || ""}
                onChange={(e) => updateFormData("treatmentDetails", e.target.value)}
                placeholder="Describe any phytosanitary treatments applied..."
              />
            </div>
          </div>
        );

      case "origin":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exporterName">Exporter Name</Label>
                <Input
                  id="exporterName"
                  value={formData.exporterName || ""}
                  onChange={(e) => updateFormData("exporterName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="importerName">Importer Name</Label>
                <Input
                  id="importerName"
                  value={formData.importerName || ""}
                  onChange={(e) => updateFormData("importerName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="productDescription">Product Description</Label>
                <Input
                  id="productDescription"
                  value={formData.productDescription || ""}
                  onChange={(e) => updateFormData("productDescription", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hsCode">HS Code</Label>
                <Input
                  id="hsCode"
                  value={formData.hsCode || ""}
                  onChange={(e) => updateFormData("hsCode", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                <Input
                  id="countryOfOrigin"
                  value={formData.countryOfOrigin || "Liberia"}
                  onChange={(e) => updateFormData("countryOfOrigin", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="totalValue">Total Value (USD)</Label>
                <Input
                  id="totalValue"
                  type="number"
                  value={formData.totalValue || ""}
                  onChange={(e) => updateFormData("totalValue", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case "quality":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={formData.batchNumber || ""}
                  onChange={(e) => updateFormData("batchNumber", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="qualityGrade">Quality Grade</Label>
                <Select onValueChange={(value) => updateFormData("qualityGrade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium Grade</SelectItem>
                    <SelectItem value="standard">Standard Grade</SelectItem>
                    <SelectItem value="fair">Fair Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="moistureContent">Moisture Content (%)</Label>
                <Input
                  id="moistureContent"
                  type="number"
                  step="0.1"
                  value={formData.moistureContent || ""}
                  onChange={(e) => updateFormData("moistureContent", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="foreignMatter">Foreign Matter (%)</Label>
                <Input
                  id="foreignMatter"
                  type="number"
                  step="0.1"
                  value={formData.foreignMatter || ""}
                  onChange={(e) => updateFormData("foreignMatter", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="inspectionNotes">Inspection Notes</Label>
              <Textarea
                id="inspectionNotes"
                value={formData.inspectionNotes || ""}
                onChange={(e) => updateFormData("inspectionNotes", e.target.value)}
                placeholder="Additional quality inspection observations..."
              />
            </div>
          </div>
        );

      case "compliance":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName || ""}
                  onChange={(e) => updateFormData("organizationName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="regulatoryFramework">Regulatory Framework</Label>
                <Select onValueChange={(value) => updateFormData("regulatoryFramework", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eudr">EU Deforestation Regulation</SelectItem>
                    <SelectItem value="lacra">LACRA Standards</SelectItem>
                    <SelectItem value="international">International Standards</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="complianceScope">Compliance Scope</Label>
                <Input
                  id="complianceScope"
                  value={formData.complianceScope || ""}
                  onChange={(e) => updateFormData("complianceScope", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="assessmentPeriod">Assessment Period</Label>
                <Input
                  id="assessmentPeriod"
                  value={formData.assessmentPeriod || ""}
                  onChange={(e) => updateFormData("assessmentPeriod", e.target.value)}
                  placeholder="e.g., 2024-2025"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="complianceStatement">Compliance Statement</Label>
              <Textarea
                id="complianceStatement"
                value={formData.complianceStatement || ""}
                onChange={(e) => updateFormData("complianceStatement", e.target.value)}
                placeholder="Detailed compliance declaration statement..."
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleFarmerSelect = async (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setIsGenerating(true);

    try {
      // Auto-generate certificate with farmer GPS data
      const response = await fetch(`/api/certificates/generate/${selectedCertificate}/${farmerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate certificate');
      }

      // Download the generated certificate
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${selectedCertificate}_certificate_${farmerId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Certificate Generated",
        description: "Certificate has been auto-generated from GPS data and downloaded successfully."
      });

      setIsFarmerSelectOpen(false);
      setSelectedCertificate("");
      setSelectedFarmerId("");
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="w-4 h-4 mr-2" />
            Generate Certificates
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {certificateOptions.map((cert) => {
            const IconComponent = cert.icon;
            return (
              <DropdownMenuItem
                key={cert.id}
                onClick={() => handleCertificateSelect(cert.id)}
                className="cursor-pointer"
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {cert.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Generate {certificateOptions.find(cert => cert.id === selectedCertificate)?.name}
            </DialogTitle>
            <DialogDescription>
              Fill in the required information to generate the certificate.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {renderForm()}
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Certificate
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Farmer Selection Dialog for GPS-based Certificates */}
      <Dialog open={isFarmerSelectOpen} onOpenChange={setIsFarmerSelectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Select Farmer for {certificateOptions.find(cert => cert.id === selectedCertificate)?.name}
            </DialogTitle>
            <DialogDescription>
              Choose a farmer to auto-generate certificate from GPS and farm data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="max-h-60 overflow-y-auto space-y-2">
              {farmers && farmers.length > 0 ? (
                farmers.map((farmer: any) => (
                  <div
                    key={farmer.id}
                    onClick={() => handleFarmerSelect(farmer.id)}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{farmer.fullName || farmer.name}</p>
                        <p className="text-sm text-slate-600">
                          {farmer.county} • {farmer.city} • {farmer.cropType}
                        </p>
                        <p className="text-xs text-slate-500">
                          GPS: {farmer.gpsCoordinates} • {farmer.farmSize} hectares
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          ID: {farmer.id}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-4">Loading farmers...</p>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFarmerSelectOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}