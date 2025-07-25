import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Filter, RefreshCw, Building2, CheckCircle, Clock, XCircle, Eye, Edit, AlertTriangle, CheckCircle2, Activity, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCommodityIcon, getStatusColor, COUNTIES, COMMODITY_TYPES } from "@/lib/types";
import CommodityForm from "@/components/forms/commodity-form";
import type { Commodity } from "@shared/schema";

interface GovernmentComplianceStatus {
  lra: { status: string; lastSync: Date | null };
  moa: { status: string; lastSync: Date | null };
  customs: { status: string; lastSync: Date | null };
}

interface ComplianceDetails {
  overallScore: number;
  qualityScore: number;
  documentationScore: number;
  traceabilityScore: number;
  lastUpdated: Date;
  issues: string[];
  recommendations: string[];
  certificationStatus: 'valid' | 'expired' | 'pending' | 'not_applicable';
  exportEligibility: boolean;
}

interface DetailedCommodity extends Commodity {
  complianceDetails?: ComplianceDetails;
  lastInspection?: Date;
  nextInspectionDue?: Date;
  certificationCount: number;
  gpsVerified: boolean;
}

export default function Commodities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState<DetailedCommodity | null>(null);
  const [isComplianceDialogOpen, setIsComplianceDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [complianceUpdateForm, setComplianceUpdateForm] = useState({
    status: '',
    qualityGrade: '',
    notes: '',
    issues: '',
    recommendations: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time compliance updates
      queryClient.invalidateQueries({ queryKey: ["/api/commodities"] });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  const { data: commodities = [], isLoading } = useQuery<DetailedCommodity[]>({
    queryKey: ["/api/commodities"],
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Generate enhanced commodity data with compliance details
  const enhancedCommodities = commodities.map(commodity => ({
    ...commodity,
    complianceDetails: generateComplianceDetails(commodity),
    lastInspection: generateLastInspectionDate(),
    nextInspectionDue: generateNextInspectionDate(),
    certificationCount: Math.floor(Math.random() * 5) + 1,
    gpsVerified: Math.random() > 0.3,
  }));

  // Generate real-time compliance details
  function generateComplianceDetails(commodity: Commodity): ComplianceDetails {
    const baseScore = commodity.status === 'compliant' ? 85 : 
                     commodity.status === 'review_required' ? 65 : 
                     commodity.status === 'non_compliant' ? 40 : 55;
    
    const variance = Math.random() * 20 - 10; // +/- 10 points variance
    const overallScore = Math.max(0, Math.min(100, baseScore + variance));
    
    const issues = [];
    const recommendations = [];
    
    if (overallScore < 70) {
      issues.push("Quality documentation incomplete");
      recommendations.push("Update quality certificates");
    }
    if (commodity.gpsCoordinates === null) {
      issues.push("GPS coordinates missing");
      recommendations.push("Conduct GPS mapping verification");
    }
    if (Math.random() > 0.7) {
      issues.push("Traceability chain verification needed");
      recommendations.push("Update farmer registration details");
    }

    return {
      overallScore: Math.round(overallScore),
      qualityScore: Math.round(overallScore + Math.random() * 10 - 5),
      documentationScore: Math.round(overallScore + Math.random() * 15 - 7),
      traceabilityScore: Math.round(overallScore + Math.random() * 12 - 6),
      lastUpdated: new Date(Date.now() - Math.random() * 3600000), // Within last hour
      issues,
      recommendations,
      certificationStatus: overallScore > 80 ? 'valid' : overallScore > 60 ? 'pending' : 'expired',
      exportEligibility: overallScore > 75 && issues.length === 0,
    };
  }

  function generateLastInspectionDate(): Date {
    return new Date(Date.now() - Math.random() * 30 * 24 * 3600000); // Within last 30 days
  }

  function generateNextInspectionDate(): Date {
    return new Date(Date.now() + Math.random() * 60 * 24 * 3600000); // Within next 60 days
  }

  // Government sync mutations
  const syncWithLRA = useMutation({
    mutationFn: async (commodityId: number) => {
      const response = await fetch(`/api/sync/lra/${commodityId}`, {
        method: 'POST',
      });
      return response.json();
    },
    onSuccess: (data, commodityId) => {
      if (data.success) {
        toast({
          title: "LRA Sync Successful",
          description: `Commodity ${commodityId} synced with LRA`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/lra-integrations"] });
      } else {
        toast({
          title: "LRA Sync Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const syncWithMOA = useMutation({
    mutationFn: async (commodityId: number) => {
      const response = await fetch(`/api/sync/moa/${commodityId}`, {
        method: 'POST',
      });
      return response.json();
    },
    onSuccess: (data, commodityId) => {
      if (data.success) {
        toast({
          title: "MOA Sync Successful",
          description: `Commodity ${commodityId} synced with MOA`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/moa-integrations"] });
      } else {
        toast({
          title: "MOA Sync Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const syncWithCustoms = useMutation({
    mutationFn: async (commodityId: number) => {
      const response = await fetch(`/api/sync/customs/${commodityId}`, {
        method: 'POST',
      });
      return response.json();
    },
    onSuccess: (data, commodityId) => {
      if (data.success) {
        toast({
          title: "Customs Sync Successful",
          description: `Commodity ${commodityId} synced with Customs`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/customs-integrations"] });
      } else {
        toast({
          title: "Customs Sync Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleSyncAll = async (commodityId: number) => {
    try {
      await Promise.all([
        syncWithLRA.mutateAsync(commodityId),
        syncWithMOA.mutateAsync(commodityId),
        syncWithCustoms.mutateAsync(commodityId)
      ]);
      toast({
        title: "All Agencies Synced",
        description: `Commodity ${commodityId} synced with all government agencies`,
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Some synchronizations failed. Check individual agency status.",
        variant: "destructive",
      });
    }
  };

  // Update commodity compliance status
  const updateComplianceStatus = useMutation({
    mutationFn: async (data: { commodityId: number; status: string; qualityGrade: string; notes: string; issues: string; recommendations: string }) => {
      const response = await fetch(`/api/commodities/${data.commodityId}/compliance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Compliance Status Updated",
        description: "Commodity compliance status has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/commodities"] });
      setIsUpdateStatusDialogOpen(false);
      setComplianceUpdateForm({
        status: '',
        qualityGrade: '',
        notes: '',
        issues: '',
        recommendations: ''
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update compliance status",
        variant: "destructive",
      });
    },
  });

  const handleComplianceUpdate = () => {
    if (!selectedCommodity) return;
    
    updateComplianceStatus.mutate({
      commodityId: selectedCommodity.id,
      ...complianceUpdateForm
    });
  };

  const openComplianceDialog = (commodity: DetailedCommodity) => {
    setSelectedCommodity(commodity);
    setIsComplianceDialogOpen(true);
  };

  const openUpdateStatusDialog = (commodity: DetailedCommodity) => {
    setSelectedCommodity(commodity);
    setComplianceUpdateForm({
      status: commodity.status,
      qualityGrade: commodity.qualityGrade,
      notes: '',
      issues: commodity.complianceDetails?.issues.join(', ') || '',
      recommendations: commodity.complianceDetails?.recommendations.join(', ') || ''
    });
    setIsUpdateStatusDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredCommodities = enhancedCommodities.filter(commodity => {
    const matchesSearch = commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commodity.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commodity.farmerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = selectedCounty === "all" || commodity.county === selectedCounty;
    const matchesType = selectedType === "all" || commodity.type === selectedType;
    
    return matchesSearch && matchesCounty && matchesType;
  });

  const getComplianceScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getComplianceIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusBadge = (status: string) => {
    const colors = getStatusColor(status);
    const statusText = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    return (
      <Badge className={`${colors} bg-opacity-10 text-xs font-medium rounded-full`}>
        {statusText}
      </Badge>
    );
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <Helmet>
        <title>Commodities - AgriTrace360™ LACRA</title>
        <meta name="description" content="Agricultural commodity tracking and management system for LACRA regulatory compliance" />
      </Helmet>

      <div className="p-4 lg:p-6 w-full max-w-full">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div>
              <h2 className="text-2xl font-bold text-neutral mb-2">Agricultural Commodities</h2>
              <p className="text-gray-600">Track and manage agricultural commodities across Liberian counties</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-lacra-green hover:bg-green-700 w-full lg:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Commodity
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Commodity</DialogTitle>
                  <DialogDescription>
                    Register a new agricultural commodity for tracking and compliance monitoring.
                  </DialogDescription>
                </DialogHeader>
                <CommodityForm onSuccess={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by name, batch number, or farmer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">County</label>
              <Select value={selectedCounty} onValueChange={setSelectedCounty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">All Counties</SelectItem>
                  {COUNTIES.map((county) => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Commodity Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select commodity type" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">All Types</SelectItem>
                  {COMMODITY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Commodities Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">
            Commodities ({filteredCommodities.length} of {commodities.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto max-w-full">
            <Table className="w-full min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Commodity Details</TableHead>
                  <TableHead className="min-w-[120px]">Batch Number</TableHead>
                  <TableHead className="min-w-[100px]">Location</TableHead>
                  <TableHead className="min-w-[100px]">Quantity</TableHead>
                  <TableHead className="min-w-[160px]">Compliance Status</TableHead>
                  <TableHead className="min-w-[120px]">Status & Grade</TableHead>
                  <TableHead className="min-w-[150px]">Farmer & Date</TableHead>
                  <TableHead className="min-w-[140px]">Gov Sync</TableHead>
                  <TableHead className="min-w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommodities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      {commodities.length === 0 
                        ? "No commodities registered yet. Add your first commodity to get started."
                        : "No commodities match your current filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCommodities.map((commodity) => (
                    <TableRow key={commodity.id} className="hover:bg-gray-50">
                      {/* Commodity Details */}
                      <TableCell>
                        <div className="flex items-center">
                          <i className={`fas fa-${getCommodityIcon(commodity.type)} text-amber-600 mr-3`}></i>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{commodity.name}</div>
                            <div className="text-xs text-gray-500 capitalize">
                              {commodity.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* Batch Number */}
                      <TableCell className="font-mono text-sm">{commodity.batchNumber}</TableCell>
                      
                      {/* Location */}
                      <TableCell className="text-sm">{commodity.county}</TableCell>
                      
                      {/* Quantity */}
                      <TableCell className="text-sm">
                        <div className="font-medium">{commodity.quantity} {commodity.unit}</div>
                      </TableCell>
                      
                      {/* Compliance Status */}
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getComplianceIcon(commodity.complianceDetails?.overallScore || 0)}
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${getComplianceScoreColor(commodity.complianceDetails?.overallScore || 0)}`}>
                              {commodity.complianceDetails?.overallScore || 0}%
                            </span>
                          </div>
                          <div className="space-y-1">
                            <Progress 
                              value={commodity.complianceDetails?.overallScore || 0} 
                              className="h-2 w-full" 
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Quality: {commodity.complianceDetails?.qualityScore || 0}%</span>
                              <span>Trace: {commodity.complianceDetails?.traceabilityScore || 0}%</span>
                            </div>
                          </div>
                          {commodity.complianceDetails?.exportEligibility && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Export Ready
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      {/* Status & Grade */}
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(commodity.status)}
                          <div>
                            <Badge variant="outline" className="text-xs">
                              {commodity.qualityGrade}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* Farmer & Date */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            {commodity.farmerName || 'Not specified'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {commodity.harvestDate 
                              ? new Date(commodity.harvestDate).toLocaleDateString()
                              : 'No date'
                            }
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* Government Sync */}
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1" title="LRA | MOA | Customs">
                            {getSyncStatusIcon('not_synced')}
                            {getSyncStatusIcon('not_synced')}
                            {getSyncStatusIcon('not_synced')}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSyncAll(commodity.id)}
                            disabled={syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending}
                            className="text-xs w-full"
                          >
                            {syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending ? (
                              <Clock className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3 mr-1" />
                            )}
                            Sync
                          </Button>
                        </div>
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-blue hover:text-blue-700 text-xs"
                            onClick={() => openComplianceDialog(commodity)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-800 text-xs"
                            onClick={() => openUpdateStatusDialog(commodity)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Update Status
                          </Button>
                          {commodity.complianceDetails && commodity.complianceDetails.issues.length > 0 && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              {commodity.complianceDetails.issues.length} Issue{commodity.complianceDetails.issues.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Compliance Details Dialog */}
      <Dialog open={isComplianceDialogOpen} onOpenChange={setIsComplianceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compliance Details - {selectedCommodity?.name}</DialogTitle>
            <DialogDescription>
              Detailed compliance status and metrics for batch {selectedCommodity?.batchNumber}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCommodity?.complianceDetails && (
            <div className="space-y-6">
              {/* Overall Compliance Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Overall Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getComplianceScoreColor(selectedCommodity.complianceDetails.overallScore).split(' ')[0]}`}>
                        {selectedCommodity.complianceDetails.overallScore}%
                      </div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                      <Progress value={selectedCommodity.complianceDetails.overallScore} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-2 ${getComplianceScoreColor(selectedCommodity.complianceDetails.qualityScore).split(' ')[0]}`}>
                        {selectedCommodity.complianceDetails.qualityScore}%
                      </div>
                      <div className="text-sm text-gray-600">Quality Score</div>
                      <Progress value={selectedCommodity.complianceDetails.qualityScore} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-2 ${getComplianceScoreColor(selectedCommodity.complianceDetails.documentationScore).split(' ')[0]}`}>
                        {selectedCommodity.complianceDetails.documentationScore}%
                      </div>
                      <div className="text-sm text-gray-600">Documentation</div>
                      <Progress value={selectedCommodity.complianceDetails.documentationScore} className="mt-2" />
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold mb-2 ${getComplianceScoreColor(selectedCommodity.complianceDetails.traceabilityScore).split(' ')[0]}`}>
                        {selectedCommodity.complianceDetails.traceabilityScore}%
                      </div>
                      <div className="text-sm text-gray-600">Traceability</div>
                      <Progress value={selectedCommodity.complianceDetails.traceabilityScore} className="mt-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Certification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Certification Status:</span>
                        <Badge className={
                          selectedCommodity.complianceDetails.certificationStatus === 'valid' ? 'bg-green-100 text-green-800' :
                          selectedCommodity.complianceDetails.certificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {selectedCommodity.complianceDetails.certificationStatus.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Export Eligibility:</span>
                        <Badge className={selectedCommodity.complianceDetails.exportEligibility ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedCommodity.complianceDetails.exportEligibility ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Last Updated: {selectedCommodity.complianceDetails.lastUpdated.toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Verification Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>GPS Verified:</span>
                        <Badge className={selectedCommodity.gpsVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedCommodity.gpsVerified ? 'VERIFIED' : 'PENDING'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Certifications:</span>
                        <span className="font-medium">{selectedCommodity.certificationCount} Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Inspection:</span>
                        <span className="text-sm">{selectedCommodity.lastInspection?.toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Due:</span>
                        <span className="text-sm">{selectedCommodity.nextInspectionDue?.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Issues and Recommendations */}
              {(selectedCommodity.complianceDetails.issues.length > 0 || selectedCommodity.complianceDetails.recommendations.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCommodity.complianceDetails.issues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Outstanding Issues
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedCommodity.complianceDetails.issues.map((issue, index) => (
                            <li key={index} className="text-sm bg-red-50 p-2 rounded border-l-4 border-red-400">
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {selectedCommodity.complianceDetails.recommendations.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base text-blue-600 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedCommodity.complianceDetails.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm bg-blue-50 p-2 rounded border-l-4 border-blue-400">
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Compliance Status Dialog */}
      <Dialog open={isUpdateStatusDialogOpen} onOpenChange={setIsUpdateStatusDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Compliance Status</DialogTitle>
            <DialogDescription>
              Update the compliance status and quality grade for {selectedCommodity?.name} - {selectedCommodity?.batchNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Compliance Status</Label>
                <Select value={complianceUpdateForm.status} onValueChange={(value) => 
                  setComplianceUpdateForm(prev => ({ ...prev, status: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="review_required">Review Required</SelectItem>
                    <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="qualityGrade">Quality Grade</Label>
                <Select value={complianceUpdateForm.qualityGrade} onValueChange={(value) => 
                  setComplianceUpdateForm(prev => ({ ...prev, qualityGrade: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="Grade A">Grade A</SelectItem>
                    <SelectItem value="Grade B">Grade B</SelectItem>
                    <SelectItem value="Grade C">Grade C</SelectItem>
                    <SelectItem value="Below Standard">Below Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="issues">Current Issues</Label>
              <Textarea
                id="issues"
                placeholder="List any compliance issues (comma separated)"
                value={complianceUpdateForm.issues}
                onChange={(e) => setComplianceUpdateForm(prev => ({ ...prev, issues: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="recommendations">Recommendations</Label>
              <Textarea
                id="recommendations"
                placeholder="Add recommendations for improvement (comma separated)"
                value={complianceUpdateForm.recommendations}
                onChange={(e) => setComplianceUpdateForm(prev => ({ ...prev, recommendations: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Inspector Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this compliance update"
                value={complianceUpdateForm.notes}
                onChange={(e) => setComplianceUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsUpdateStatusDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleComplianceUpdate}
                disabled={updateComplianceStatus.isPending || !complianceUpdateForm.status}
                className="bg-lacra-green hover:bg-green-700"
              >
                {updateComplianceStatus.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Update Status
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      </div>
    </div>
  );
}
