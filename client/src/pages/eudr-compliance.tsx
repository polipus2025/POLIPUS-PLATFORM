import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Download, Package, AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Form schema for generating EUDR compliance pack
const eudrPackSchema = z.object({
  shipmentId: z.string().min(1, "Shipment ID is required"),
  farmerId: z.string().min(1, "Farmer ID is required"),
  farmerName: z.string().min(1, "Farmer name is required"),
  exporterId: z.string().min(1, "Exporter ID is required"),
  exporterName: z.string().min(1, "Exporter name is required"),
  exporterRegistration: z.string().min(1, "Exporter registration is required"),
  commodity: z.string().min(1, "Commodity is required"),
  hsCode: z.string().min(1, "HS Code is required"),
  totalWeight: z.string().min(1, "Total weight is required"),
  harvestPeriod: z.string().min(1, "Harvest period is required"),
  destination: z.string().min(1, "Destination is required"),
  farmIds: z.string().min(1, "Farm IDs are required"),
  gpsCoordinates: z.string().min(1, "GPS coordinates are required"),
  complianceStatus: z.enum(["compliant", "non_compliant", "pending"]),
  riskClassification: z.enum(["low", "medium", "high"]),
  deforestationRisk: z.enum(["none", "low", "medium", "high"]),
  complianceScore: z.number().min(0).max(100),
  forestProtectionScore: z.number().min(0).max(100),
  documentationScore: z.number().min(0).max(100),
  overallRiskScore: z.number().min(0).max(100),
  forestCoverChange: z.number().optional(),
  carbonStockImpact: z.number().optional(),
  biodiversityImpactLevel: z.enum(["low", "medium", "high"]).optional(),
  satelliteDataSource: z.string().min(1, "Satellite data source is required"),
});

type EudrPackForm = z.infer<typeof eudrPackSchema>;

export default function EudrCompliancePage() {
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EudrPackForm>({
    resolver: zodResolver(eudrPackSchema),
    defaultValues: {
      complianceStatus: "compliant",
      riskClassification: "low",
      deforestationRisk: "none",
      complianceScore: 95,
      forestProtectionScore: 90,
      documentationScore: 98,
      overallRiskScore: 15,
      satelliteDataSource: "Sentinel-2/Landsat-8 Constellation"
    }
  });

  // Fetch all compliance packs
  const { data: packs, isLoading } = useQuery({
    queryKey: ["/api/eudr/packs"],
    queryFn: () => fetch("/api/eudr/packs").then(res => res.json())
  });

  // Generate compliance pack mutation
  const generatePackMutation = useMutation({
    mutationFn: async (data: EudrPackForm) => {
      const formattedData = {
        ...data,
        farmIds: data.farmIds.split(',').map(id => id.trim())
      };
      
      const response = await fetch("/api/eudr/generate-pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });
      
      if (!response.ok) throw new Error("Failed to generate compliance pack");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "EUDR Compliance Pack Generated Successfully",
        description: `Pack ${data.packId} with ${data.documentsGenerated} documents is ready for export`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/eudr/packs"] });
      form.reset();
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  });

  // Delete pack mutation
  const deletePackMutation = useMutation({
    mutationFn: async (packId: string) => {
      const response = await fetch(`/api/eudr/pack/${packId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete compliance pack");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Compliance Pack Deleted",
        description: "The compliance pack has been permanently removed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/eudr/packs"] });
    }
  });

  const onSubmit = (data: EudrPackForm) => {
    setIsGenerating(true);
    generatePackMutation.mutate(data);
  };

  const downloadDocument = async (documentId: number, title: string) => {
    try {
      const response = await fetch(`/api/eudr/document/${documentId}/pdf`);
      if (!response.ok) throw new Error("Failed to download document");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Document Downloaded",
        description: `${title} has been downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the document",
        variant: "destructive"
      });
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low': case 'none': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'non_compliant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">EUDR Compliance Pack System</h1>
        <p className="text-gray-600">Generate and manage EU Deforestation Regulation compliance documentation packages</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Admin Access Only</span>
          </div>
          <p className="text-blue-700 text-sm">
            This system generates professional compliance packs with 6 documents: Cover Sheet, Export Certificate, 
            Compliance Assessment, Deforestation Report, Due Diligence Statement, and Traceability Report. 
            All documents include comprehensive reference tracking and are stored for 5-year audit retention.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generate New Pack Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Generate Compliance Pack
              </CardTitle>
              <CardDescription>
                Create a new EUDR compliance pack with all required documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipmentId">Shipment ID</Label>
                  <Input 
                    id="shipmentId" 
                    {...form.register("shipmentId")}
                    placeholder="SHIP-2024-001"
                  />
                  {form.formState.errors.shipmentId && (
                    <p className="text-sm text-red-600">{form.formState.errors.shipmentId.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="farmerId">Farmer ID</Label>
                    <Input 
                      id="farmerId" 
                      {...form.register("farmerId")}
                      placeholder="FARM-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmerName">Farmer Name</Label>
                    <Input 
                      id="farmerName" 
                      {...form.register("farmerName")}
                      placeholder="John Farmer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="exporterId">Exporter ID</Label>
                    <Input 
                      id="exporterId" 
                      {...form.register("exporterId")}
                      placeholder="EXP-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exporterName">Exporter Name</Label>
                    <Input 
                      id="exporterName" 
                      {...form.register("exporterName")}
                      placeholder="Export Company Ltd"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exporterRegistration">Exporter Registration</Label>
                  <Input 
                    id="exporterRegistration" 
                    {...form.register("exporterRegistration")}
                    placeholder="REG-2024-001"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="commodity">Commodity</Label>
                    <Input 
                      id="commodity" 
                      {...form.register("commodity")}
                      placeholder="Coffee Beans"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hsCode">HS Code</Label>
                    <Input 
                      id="hsCode" 
                      {...form.register("hsCode")}
                      placeholder="0901.11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="totalWeight">Total Weight</Label>
                    <Input 
                      id="totalWeight" 
                      {...form.register("totalWeight")}
                      placeholder="1000 kg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input 
                      id="destination" 
                      {...form.register("destination")}
                      placeholder="European Union"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmIds">Farm IDs (comma-separated)</Label>
                  <Input 
                    id="farmIds" 
                    {...form.register("farmIds")}
                    placeholder="FARM-001, FARM-002, FARM-003"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gpsCoordinates">GPS Coordinates</Label>
                  <Input 
                    id="gpsCoordinates" 
                    {...form.register("gpsCoordinates")}
                    placeholder="6.3106°N, 10.8047°W"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestPeriod">Harvest Period</Label>
                  <Input 
                    id="harvestPeriod" 
                    {...form.register("harvestPeriod")}
                    placeholder="January 2024 - March 2024"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="complianceScore">Compliance Score (0-100)</Label>
                    <Input 
                      id="complianceScore" 
                      type="number"
                      min="0"
                      max="100"
                      {...form.register("complianceScore", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overallRiskScore">Risk Score (0-100)</Label>
                    <Input 
                      id="overallRiskScore" 
                      type="number"
                      min="0"
                      max="100"
                      {...form.register("overallRiskScore", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isGenerating}
                  data-testid="button-generate-pack"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating Pack...
                    </>
                  ) : (
                    <>
                      <Package className="h-4 w-4 mr-2" />
                      Generate Compliance Pack
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Existing Packs List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Compliance Packs
              </CardTitle>
              <CardDescription>
                View and download existing EUDR compliance documentation packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Loading compliance packs...</p>
                </div>
              ) : !packs || packs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No compliance packs generated yet</p>
                  <p className="text-sm">Use the form to create your first EUDR compliance pack</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {packs.map((pack: any) => (
                    <div key={pack.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{pack.packId}</h3>
                          <p className="text-sm text-gray-600">
                            Shipment: {pack.shipmentId} | {pack.commodity} → {pack.destination}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadgeColor(pack.complianceStatus)}>
                            {pack.complianceStatus}
                          </Badge>
                          <Badge className={getRiskBadgeColor(pack.riskClassification)}>
                            {pack.riskClassification} risk
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Farmer:</span>
                          <p className="font-medium">{pack.farmerName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Exporter:</span>
                          <p className="font-medium">{pack.exporterName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Compliance Score:</span>
                          <p className="font-medium">{pack.complianceScore}/100</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Generated:</span>
                          <p className="font-medium">{new Date(pack.packGeneratedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedPack(pack)}
                              data-testid={`button-view-documents-${pack.packId}`}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Documents (6)
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>EUDR Compliance Pack: {selectedPack?.packId}</DialogTitle>
                              <DialogDescription>
                                Generated on {selectedPack ? new Date(selectedPack.packGeneratedAt).toLocaleDateString() : ''} | 
                                Valid until {selectedPack ? new Date(selectedPack.storageExpiryDate).toLocaleDateString() : ''}
                              </DialogDescription>
                            </DialogHeader>
                            <PackDocumentsView pack={selectedPack} onDownload={downloadDocument} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePackMutation.mutate(pack.packId)}
                          data-testid={`button-delete-pack-${pack.packId}`}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Component to display pack documents
function PackDocumentsView({ pack, onDownload }: { pack: any, onDownload: (id: number, title: string) => void }) {
  const { data: packDetails } = useQuery({
    queryKey: ["/api/eudr/pack", pack?.packId],
    queryFn: () => fetch(`/api/eudr/pack/${pack.packId}`).then(res => res.json()),
    enabled: !!pack?.packId
  });

  if (!packDetails) {
    return <div className="text-center py-4">Loading documents...</div>;
  }

  const documentTypes = [
    { type: 'cover_sheet', title: 'Cover Sheet', icon: FileText, description: 'Document index and shipment overview' },
    { type: 'export_certificate', title: 'Export Certificate', icon: CheckCircle, description: 'LACRA export eligibility certificate' },
    { type: 'compliance_assessment', title: 'Compliance Assessment', icon: AlertCircle, description: 'EUDR compliance evaluation' },
    { type: 'deforestation_report', title: 'Deforestation Report', icon: FileText, description: 'Environmental impact analysis' },
    { type: 'dds', title: 'Due Diligence Statement', icon: FileText, description: 'EU regulation compliance statement' },
    { type: 'traceability_report', title: 'Traceability Report', icon: FileText, description: 'Complete supply chain documentation' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentTypes.map((docType) => {
          const document = packDetails.documents.find((d: any) => d.documentType === docType.type);
          const Icon = docType.icon;
          
          return (
            <div key={docType.type} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">{docType.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{docType.description}</p>
                    {document && (
                      <p className="text-xs text-gray-500">
                        Ref: {document.referenceNumber}
                      </p>
                    )}
                  </div>
                </div>
                {document && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDownload(document.id, docType.title)}
                    data-testid={`button-download-${docType.type}`}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Cross-Reference Network</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Pack ID:</strong> {pack.packId}</p>
          <p><strong>Farm Chain:</strong> {pack.farmIds.join(' → ')}</p>
          <p><strong>GPS Verification:</strong> {pack.gpsCoordinates}</p>
          <p><strong>Satellite Data:</strong> {pack.satelliteDataSource}</p>
          <p><strong>Audit Ready:</strong> {pack.auditReadyStatus ? 'Yes' : 'No'} | 5-year retention period</p>
        </div>
      </div>
    </div>
  );
}