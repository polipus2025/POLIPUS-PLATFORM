import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, FileText, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Commodity {
  id: number;
  batchId: string;
  type: string;
  quantity: string;
  qualityGrade: string;
  origin: string;
  county: string;
  status: string;
}

interface LraIntegration {
  id: number;
  commodityId: number;
  taxId: string;
  taxpayerTin: string;
  taxableAmount: string;
  taxRate: string;
  taxAmount: string;
  paymentStatus: string;
  assessmentDate: string;
  dueDate: string;
  paymentDate?: string;
  lraOfficer: string;
  syncStatus: string;
  lastSyncDate?: string;
}

interface MoaIntegration {
  id: number;
  commodityId: number;
  registrationNumber: string;
  cropType: string;
  productionSeason: string;
  actualYield?: string;
  qualityCertification?: string;
  sustainabilityRating?: string;
  moaOfficer: string;
  inspectionStatus: string;
  approvalDate?: string;
  syncStatus: string;
  lastSyncDate?: string;
}

interface CustomsIntegration {
  id: number;
  commodityId: number;
  declarationNumber: string;
  hsCode: string;
  exportValue: string;
  dutyAmount?: string;
  portOfExit: string;
  destinationCountry: string;
  exporterTin: string;
  customsOfficer: string;
  clearanceStatus: string;
  clearanceDate?: string;
  syncStatus: string;
  documentStatus: string;
}

interface GovernmentSyncLog {
  id: number;
  syncType: string;
  entityId: number;
  syncDirection: string;
  status: string;
  syncDuration?: number;
  syncedBy: string;
  syncDate: string;
  errorMessage?: string;
}

export default function GovernmentIntegration() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch commodities
  const { data: commodities = [] } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  // Fetch LRA integrations
  const { data: lraIntegrations = [] } = useQuery<LraIntegration[]>({
    queryKey: ["/api/lra-integrations"],
  });

  // Fetch MOA integrations
  const { data: moaIntegrations = [] } = useQuery<MoaIntegration[]>({
    queryKey: ["/api/moa-integrations"],
  });

  // Fetch Customs integrations
  const { data: customsIntegrations = [] } = useQuery<CustomsIntegration[]>({
    queryKey: ["/api/customs-integrations"],
  });

  // Fetch sync logs
  const { data: syncLogs = [] } = useQuery<GovernmentSyncLog[]>({
    queryKey: ["/api/government-sync-logs"],
  });

  // Sync mutations
  const syncWithLRA = useMutation({
    mutationFn: async (commodityId: number) => {
      const response = await fetch(`/api/sync/lra/${commodityId}`, {
        method: 'POST',
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "LRA Sync Successful",
          description: data.message,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/lra-integrations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/government-sync-logs"] });
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
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "MOA Sync Successful",
          description: data.message,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/moa-integrations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/government-sync-logs"] });
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
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Customs Sync Successful",
          description: data.message,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/customs-integrations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/government-sync-logs"] });
      } else {
        toast({
          title: "Customs Sync Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'synced':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Synced</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getClearanceStatusBadge = (status: string) => {
    switch (status) {
      case 'cleared':
        return <Badge variant="default" className="bg-green-100 text-green-800">Cleared</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'held':
        return <Badge variant="destructive">Held</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleSyncAll = async (commodityId: number) => {
    if (!commodityId) return;
    
    await Promise.all([
      syncWithLRA.mutateAsync(commodityId),
      syncWithMOA.mutateAsync(commodityId),
      syncWithCustoms.mutateAsync(commodityId)
    ]);
  };

  // Calculate summary metrics
  const totalSynced = lraIntegrations.filter(i => i.syncStatus === 'synced').length +
                     moaIntegrations.filter(i => i.syncStatus === 'synced').length +
                     customsIntegrations.filter(i => i.syncStatus === 'synced').length;

  const totalPending = lraIntegrations.filter(i => i.syncStatus === 'pending').length +
                      moaIntegrations.filter(i => i.syncStatus === 'pending').length +
                      customsIntegrations.filter(i => i.syncStatus === 'pending').length;

  const totalFailed = syncLogs.filter(log => log.status === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Government Integration</h1>
          <p className="text-muted-foreground">
            Synchronize compliance data with LRA, Ministry of Agriculture, and Customs
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Synced</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalSynced}</div>
            <p className="text-xs text-muted-foreground">Across all agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Sync</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{totalPending}</div>
            <p className="text-xs text-muted-foreground">Awaiting synchronization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Syncs</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalFailed}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commodities</CardTitle>
            <Building2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{commodities.length}</div>
            <p className="text-xs text-muted-foreground">Registered commodities</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Sync Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Quick Synchronization
          </CardTitle>
          <CardDescription>
            Select a commodity to sync with all government agencies
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select commodity to sync" />
            </SelectTrigger>
            <SelectContent>
              {commodities.map((commodity) => (
                <SelectItem key={commodity.id} value={commodity.id.toString()}>
                  {commodity.batchId} - {commodity.type} ({commodity.county})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={() => selectedCommodity && handleSyncAll(parseInt(selectedCommodity))}
            disabled={!selectedCommodity || syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending}
          >
            {syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync All Agencies
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Integration Tabs */}
      <Tabs defaultValue="lra" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lra">Liberia Revenue Authority</TabsTrigger>
          <TabsTrigger value="moa">Ministry of Agriculture</TabsTrigger>
          <TabsTrigger value="customs">Customs</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="lra" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>LRA Tax Integration</CardTitle>
              <CardDescription>
                Tax assessments and payment status for commodity exports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tax ID</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Taxable Amount</TableHead>
                    <TableHead>Tax Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Sync Status</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lraIntegrations.map((integration) => {
                    const commodity = commodities.find(c => c.id === integration.commodityId);
                    return (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">{integration.taxId}</TableCell>
                        <TableCell>{commodity?.batchId} - {commodity?.type}</TableCell>
                        <TableCell>${integration.taxableAmount}</TableCell>
                        <TableCell>${integration.taxAmount}</TableCell>
                        <TableCell>{getPaymentStatusBadge(integration.paymentStatus)}</TableCell>
                        <TableCell>{getStatusBadge(integration.syncStatus)}</TableCell>
                        <TableCell>{new Date(integration.dueDate).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>MOA Registration & Certification</CardTitle>
              <CardDescription>
                Agricultural production records and quality certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Registration #</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Crop Type</TableHead>
                    <TableHead>Yield</TableHead>
                    <TableHead>Quality Cert</TableHead>
                    <TableHead>Inspection Status</TableHead>
                    <TableHead>Sync Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moaIntegrations.map((integration) => {
                    const commodity = commodities.find(c => c.id === integration.commodityId);
                    return (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">{integration.registrationNumber}</TableCell>
                        <TableCell>{commodity?.batchId} - {commodity?.type}</TableCell>
                        <TableCell>{integration.cropType}</TableCell>
                        <TableCell>{integration.actualYield}</TableCell>
                        <TableCell>{integration.qualityCertification || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={integration.inspectionStatus === 'approved' ? 'default' : 'secondary'}>
                            {integration.inspectionStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(integration.syncStatus)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customs Declaration & Clearance</CardTitle>
              <CardDescription>
                Export declarations and customs clearance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Declaration #</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>HS Code</TableHead>
                    <TableHead>Export Value</TableHead>
                    <TableHead>Duty Amount</TableHead>
                    <TableHead>Clearance Status</TableHead>
                    <TableHead>Sync Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customsIntegrations.map((integration) => {
                    const commodity = commodities.find(c => c.id === integration.commodityId);
                    return (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">{integration.declarationNumber}</TableCell>
                        <TableCell>{commodity?.batchId} - {commodity?.type}</TableCell>
                        <TableCell>{integration.hsCode}</TableCell>
                        <TableCell>${integration.exportValue}</TableCell>
                        <TableCell>${integration.dutyAmount || '0.00'}</TableCell>
                        <TableCell>{getClearanceStatusBadge(integration.clearanceStatus)}</TableCell>
                        <TableCell>{getStatusBadge(integration.syncStatus)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Logs</CardTitle>
              <CardDescription>
                Detailed logs of all government system synchronizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Agency</TableHead>
                    <TableHead>Entity ID</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Synced By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.slice(0, 20).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.syncDate).toLocaleString()}</TableCell>
                      <TableCell className="uppercase font-medium">{log.syncType}</TableCell>
                      <TableCell>{log.entityId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.syncDirection}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.syncDuration}ms</TableCell>
                      <TableCell>{log.syncedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}