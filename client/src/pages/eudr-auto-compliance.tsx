import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Package, CheckCircle, Clock, XCircle, FileText, Download, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EudrAutoCompliancePage() {
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Clear any potential navigation issues
  console.log("✅ EUDR AUTO COMPLIANCE SYSTEM LOADED - Automated Pack Generation Active");

  // Fetch farmers ready for EUDR compliance
  const { data: readyFarmers, isLoading: loadingFarmers, error: farmersError } = useQuery({
    queryKey: ["/api/eudr/farmers-ready"],
    queryFn: async () => {
      const response = await fetch("/api/eudr/farmers-ready");
      if (!response.ok) throw new Error("Failed to fetch farmers");
      return response.json();
    },
    retry: 2,
    refetchOnWindowFocus: false
  });

  // Fetch packs pending approval
  const { data: pendingPacks, isLoading: loadingPending, error: pendingError } = useQuery({
    queryKey: ["/api/eudr/pending-approval"],
    queryFn: async () => {
      const response = await fetch("/api/eudr/pending-approval");
      if (!response.ok) throw new Error("Failed to fetch pending packs");
      return response.json();
    },
    retry: 2,
    refetchOnWindowFocus: false
  });

  // Fetch approved packs
  const { data: approvedPacks, isLoading: loadingApproved, error: approvedError } = useQuery({
    queryKey: ["/api/eudr/approved-packs"],
    queryFn: async () => {
      const response = await fetch("/api/eudr/approved-packs");
      if (!response.ok) throw new Error("Failed to fetch approved packs");
      return response.json();
    },
    retry: 2,
    refetchOnWindowFocus: false
  });

  // Auto-generate pack mutation
  const autoGenerateMutation = useMutation({
    mutationFn: async ({ farmerId, exporterData }: { farmerId: string, exporterData: any }) => {
      const response = await fetch(`/api/eudr/auto-generate/${farmerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exporterData })
      });
      if (!response.ok) throw new Error("Failed to auto-generate pack");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "EUDR Pack Auto-Generated",
        description: `Pack for ${data.farmerName} is ready for admin approval`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/eudr/pending-approval"] });
      setSelectedFarmer(null);
    }
  });

  // Admin decision mutation
  const adminDecisionMutation = useMutation({
    mutationFn: async ({ packId, action, adminName, notes }: { packId: string, action: string, adminName: string, notes: string }) => {
      const response = await fetch(`/api/eudr/admin-decision/${packId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, adminName, notes })
      });
      if (!response.ok) throw new Error("Failed to process decision");
      return response.json();
    },
    onSuccess: (data, variables) => {
      toast({
        title: variables.action === 'approve' ? "Pack Approved" : "Pack Rejected",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/eudr/pending-approval"] });
      queryClient.invalidateQueries({ queryKey: ["/api/eudr/approved-packs"] });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved': return <Badge className="bg-blue-100 text-blue-800">Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // Show error state if all queries fail
  if (farmersError && pendingError && approvedError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">System Error</h2>
          <p className="text-gray-600">Unable to connect to EUDR system. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-green-800">
          ✅ EUDR Compliance Pack System
        </h1>
        <p className="text-gray-600">Automated generation from existing farmer data with admin approval workflow</p>
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Automated Data Flow</span>
          </div>
          <p className="text-blue-700 text-sm">
            System automatically fetches farmer data from onboarding → GPS mapping → assessments → generates compliance pack → admin approval → available to exporters
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Step 1: Farmers Ready for EUDR */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Ready Farmers ({readyFarmers?.length || 0})
              </CardTitle>
              <CardDescription>
                Farmers with complete onboarding and assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingFarmers ? (
                <div className="text-center py-4">
                  <Clock className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-blue-600">Loading farmers...</p>
                </div>
              ) : farmersError ? (
                <div className="text-center py-8 text-red-500">
                  <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Error loading farmers</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : !readyFarmers || readyFarmers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No farmers ready for EUDR compliance</p>
                  <p className="text-xs">Complete farmer onboarding first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {readyFarmers.map((farmer: any) => (
                    <div key={farmer.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{farmer.name}</h4>
                        {getStatusBadge(farmer.complianceStatus)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Location: {farmer.county}, {farmer.district}</p>
                        <p>Farms: {farmer.farmsCount} | Commodities: {farmer.commoditiesCount}</p>
                        <p>Last Inspection: {farmer.lastInspection ? new Date(farmer.lastInspection).toLocaleDateString() : 'None'}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setSelectedFarmer(farmer)}
                            data-testid={`button-generate-${farmer.id}`}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Generate EUDR Pack
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Generate EUDR Pack for {farmer.name}</DialogTitle>
                            <DialogDescription>
                              Auto-fetching data from existing records. Only exporter details needed.
                            </DialogDescription>
                          </DialogHeader>
                          <ExporterDataForm farmer={farmer} onGenerate={autoGenerateMutation.mutate} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Step 2: Pending Admin Approval */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Approval ({pendingPacks?.length || 0})
              </CardTitle>
              <CardDescription>
                Auto-generated packs awaiting admin review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPending ? (
                <div className="text-center py-4">
                  <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Loading pending packs...</p>
                </div>
              ) : !pendingPacks || pendingPacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No packs pending approval</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPacks.map((pack: any) => (
                    <div key={pack.packId} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{pack.packId}</h4>
                        <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Farmer: {pack.farmerName}</p>
                        <p>Exporter: {pack.exporterName}</p>
                        <p>Commodity: {pack.commodity}</p>
                        <p>Score: {pack.complianceScore}/100</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={() => setSelectedPack(pack)}
                            data-testid={`button-review-${pack.packId}`}
                          >
                            Review & Decide
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Admin Review: {pack.packId}</DialogTitle>
                            <DialogDescription>
                              Review auto-generated compliance data and approve/reject
                            </DialogDescription>
                          </DialogHeader>
                          <AdminReviewForm pack={pack} onDecision={adminDecisionMutation.mutate} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Step 3: Approved & Available */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Approved Packs ({approvedPacks?.length || 0})
              </CardTitle>
              <CardDescription>
                Ready for exporter access and download
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingApproved ? (
                <div className="text-center py-4">
                  <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Loading approved packs...</p>
                </div>
              ) : !approvedPacks || approvedPacks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No approved packs available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {approvedPacks.map((pack: any) => (
                    <div key={pack.packId} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{pack.packId}</h4>
                        <Badge className="bg-green-100 text-green-800">Approved</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Farmer: {pack.farmerName}</p>
                        <p>Exporter: {pack.exporterName}</p>
                        <p>Approved: {new Date(pack.adminApprovedAt).toLocaleDateString()}</p>
                        <p>By: {pack.adminApprovedBy}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full mt-2"
                        data-testid={`button-download-${pack.packId}`}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Documents (6)
                      </Button>
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

// Exporter data input form
function ExporterDataForm({ farmer, onGenerate }: { farmer: any, onGenerate: Function }) {
  const [exporterData, setExporterData] = useState({
    exporterId: "",
    exporterName: "",
    exporterRegistration: "",
    shipmentId: "",
    hsCode: "",
    destination: "European Union"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      farmerId: farmer.id,
      exporterData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="exporterId">Exporter ID</Label>
          <Input 
            id="exporterId"
            value={exporterData.exporterId}
            onChange={(e) => setExporterData({...exporterData, exporterId: e.target.value})}
            placeholder="EXP-001"
            required
          />
        </div>
        <div>
          <Label htmlFor="exporterName">Exporter Name</Label>
          <Input 
            id="exporterName"
            value={exporterData.exporterName}
            onChange={(e) => setExporterData({...exporterData, exporterName: e.target.value})}
            placeholder="Export Company Ltd"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="exporterRegistration">Registration Number</Label>
        <Input 
          id="exporterRegistration"
          value={exporterData.exporterRegistration}
          onChange={(e) => setExporterData({...exporterData, exporterRegistration: e.target.value})}
          placeholder="REG-2024-001"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shipmentId">Shipment ID</Label>
          <Input 
            id="shipmentId"
            value={exporterData.shipmentId}
            onChange={(e) => setExporterData({...exporterData, shipmentId: e.target.value})}
            placeholder="SHIP-2024-001"
            required
          />
        </div>
        <div>
          <Label htmlFor="hsCode">HS Code</Label>
          <Input 
            id="hsCode"
            value={exporterData.hsCode}
            onChange={(e) => setExporterData({...exporterData, hsCode: e.target.value})}
            placeholder="0901.11"
            required
          />
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg text-sm">
        <p className="font-medium text-blue-800">Auto-fetched from {farmer.name}:</p>
        <ul className="text-blue-700 mt-1 space-y-1">
          <li>• Farmer details and GPS coordinates</li>
          <li>• Farm mapping and commodity data</li>
          <li>• Assessment scores and compliance status</li>
          <li>• Deforestation analysis from monitoring</li>
        </ul>
      </div>
      
      <Button type="submit" className="w-full">
        <Package className="h-4 w-4 mr-2" />
        Auto-Generate EUDR Pack
      </Button>
    </form>
  );
}

// Admin review and decision form
function AdminReviewForm({ pack, onDecision }: { pack: any, onDecision: Function }) {
  const [notes, setNotes] = useState("");
  const adminName = "Admin User"; // Would come from auth context

  const handleDecision = (action: string) => {
    onDecision({
      packId: pack.packId,
      action,
      adminName,
      notes
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Farmer:</span>
          <p className="font-medium">{pack.farmerName}</p>
        </div>
        <div>
          <span className="text-gray-500">Compliance Score:</span>
          <p className="font-medium">{pack.complianceScore}/100</p>
        </div>
        <div>
          <span className="text-gray-500">Commodity:</span>
          <p className="font-medium">{pack.commodity}</p>
        </div>
        <div>
          <span className="text-gray-500">Risk Level:</span>
          <p className="font-medium">{pack.riskClassification}</p>
        </div>
      </div>

      <div>
        <Label htmlFor="adminNotes">Admin Notes</Label>
        <Textarea
          id="adminNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add review notes or requirements..."
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={() => handleDecision('approve')}
          className="flex-1 bg-green-600 hover:bg-green-700"
          data-testid={`button-approve-${pack.packId}`}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve & Generate Documents
        </Button>
        <Button 
          onClick={() => handleDecision('reject')}
          variant="destructive"
          className="flex-1"
          data-testid={`button-reject-${pack.packId}`}
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject
        </Button>
      </div>
    </div>
  );
}