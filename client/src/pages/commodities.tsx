import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Filter, RefreshCw, Building2, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCommodityIcon, getStatusColor, COUNTIES, COMMODITY_TYPES } from "@/lib/types";
import CommodityForm from "@/components/forms/commodity-form";
import type { Commodity } from "@shared/schema";

interface GovernmentComplianceStatus {
  lra: { status: string; lastSync: Date | null };
  moa: { status: string; lastSync: Date | null };
  customs: { status: string; lastSync: Date | null };
}

export default function Commodities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: commodities = [], isLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

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

  const filteredCommodities = commodities.filter(commodity => {
    const matchesSearch = commodity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commodity.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         commodity.farmerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = selectedCounty === "all" || commodity.county === selectedCounty;
    const matchesType = selectedType === "all" || commodity.type === selectedType;
    
    return matchesSearch && matchesCounty && matchesType;
  });

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
    <div className="p-6">
      <Helmet>
        <title>Commodities - AgriTrace360™ LACRA</title>
        <meta name="description" content="Agricultural commodity tracking and management system for LACRA regulatory compliance" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Agricultural Commodities</h2>
            <p className="text-gray-600">Track and manage agricultural commodities across Liberian counties</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>County</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Quality Grade</TableHead>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Harvest Date</TableHead>
                  <TableHead>Government Sync</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommodities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      {commodities.length === 0 
                        ? "No commodities registered yet. Add your first commodity to get started."
                        : "No commodities match your current filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCommodities.map((commodity) => (
                    <TableRow key={commodity.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center">
                          <i className={`fas fa-${getCommodityIcon(commodity.type)} text-amber-600 mr-3`}></i>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{commodity.name}</div>
                            <div className="text-sm text-gray-500 capitalize">
                              {commodity.type.replace('_', ' ')}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{commodity.batchNumber}</TableCell>
                      <TableCell className="text-sm">{commodity.county}</TableCell>
                      <TableCell className="text-sm">
                        {commodity.quantity} {commodity.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {commodity.qualityGrade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {commodity.farmerName || 'Not specified'}
                      </TableCell>
                      <TableCell>{getStatusBadge(commodity.status)}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {commodity.harvestDate 
                          ? new Date(commodity.harvestDate).toLocaleDateString()
                          : 'Not specified'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1" title="LRA | MOA | Customs">
                            {getSyncStatusIcon('not_synced')}
                            {getSyncStatusIcon('not_synced')}
                            {getSyncStatusIcon('not_synced')}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSyncAll(commodity.id)}
                            disabled={syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending}
                            className="text-xs"
                          >
                            {syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending ? (
                              <Clock className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3 mr-1" />
                            )}
                            Sync All
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-lacra-blue hover:text-blue-700">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
                            Edit
                          </Button>
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
    </div>
  );
}
