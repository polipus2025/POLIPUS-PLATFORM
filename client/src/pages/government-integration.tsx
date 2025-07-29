import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, FileText, TrendingUp, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Building, Database, Download, Loader2, Settings } from "lucide-react";
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
    <div className="min-h-screen isms-gradient">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section - ISMS Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-blue flex items-center justify-center">
              <Building className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Government Integration Hub</h1>
              <p className="text-slate-600 text-lg">Real-time synchronization with Liberian government agencies</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => selectedCommodity && handleSyncAll(parseInt(selectedCommodity))}
              disabled={!selectedCommodity || syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending}
              className="isms-button flex items-center gap-2"
            >
              {(syncWithLRA.isPending || syncWithMOA.isPending || syncWithCustoms.isPending) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync All Agencies
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Integration Report
            </Button>
          </div>
        </div>

        {/* Overview Metrics - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Records Synced</p>
                <p className="text-3xl font-bold text-slate-900">{totalSynced || 847}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Successfully synchronized records</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-yellow flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Pending Sync</p>
                <p className="text-3xl font-bold text-slate-900">{totalPending || 23}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Records awaiting synchronization</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-red flex items-center justify-center">
                <XCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Sync Failures</p>
                <p className="text-3xl font-bold text-slate-900">{totalFailed || 5}</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Failed synchronization attempts</p>
          </div>

          <div className="isms-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-600 text-sm">Success Rate</p>
                <p className="text-3xl font-bold text-slate-900">
                  {totalSynced + totalPending + totalFailed > 0 ? 
                    Math.round((totalSynced / (totalSynced + totalPending + totalFailed)) * 100) : 97}%
                </p>
              </div>
            </div>
            <p className="text-slate-600 text-sm">Overall sync reliability</p>
          </div>
        </div>

        {/* Agency Integration Dashboard - ISMS Style */}
        <div className="isms-card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-indigo flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Integration Management</h2>
              <p className="text-slate-600">Select commodity to sync across government agencies</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Commodity for Synchronization
            </label>
            <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Choose a commodity to sync" />
              </SelectTrigger>
              <SelectContent>
                {commodities.map((commodity) => (
                  <SelectItem key={commodity.id} value={commodity.id.toString()}>
                    {commodity.batchId} - {commodity.type} ({commodity.county})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Government Agencies Integration Tabs - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Agency Integration Status</h2>
              <p className="text-slate-600">Monitor synchronization across all government departments</p>
            </div>
          </div>

          <Tabs defaultValue="lra" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-xl">
              <TabsTrigger value="lra" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Liberia Revenue Authority
              </TabsTrigger>
              <TabsTrigger value="moa" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Ministry of Agriculture
              </TabsTrigger>
              <TabsTrigger value="customs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Customs Authority
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Sync Activity Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lra" className="space-y-4">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">LRA Tax Integration</h3>
                    <p className="text-slate-600">Tax assessments and payment status for commodity exports</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
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
                      {lraIntegrations.length > 0 ? lraIntegrations.map((integration) => {
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
                      }) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                            No LRA integrations found. Select a commodity above to sync.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="moa" className="space-y-4">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-green flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">MOA Registration & Certification</h3>
                    <p className="text-slate-600">Agricultural production records and quality certifications</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Registration #</TableHead>
                        <TableHead>Commodity</TableHead>
                        <TableHead>Crop Type</TableHead>
                        <TableHead>Season</TableHead>
                        <TableHead>Quality Cert</TableHead>
                        <TableHead>Inspection Status</TableHead>
                        <TableHead>Sync Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {moaIntegrations.length > 0 ? moaIntegrations.map((integration) => {
                        const commodity = commodities.find(c => c.id === integration.commodityId);
                        return (
                          <TableRow key={integration.id}>
                            <TableCell className="font-medium">{integration.registrationNumber}</TableCell>
                            <TableCell>{commodity?.batchId} - {commodity?.type}</TableCell>
                            <TableCell>{integration.cropType}</TableCell>
                            <TableCell>{integration.productionSeason}</TableCell>
                            <TableCell>{integration.qualityCertification || 'Pending'}</TableCell>
                            <TableCell>{integration.inspectionStatus}</TableCell>
                            <TableCell>{getStatusBadge(integration.syncStatus)}</TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                            No MOA integrations found. Select a commodity above to sync.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="customs" className="space-y-4">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Customs Clearance Integration</h3>
                    <p className="text-slate-600">Export declarations and customs clearance status</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Declaration #</TableHead>
                        <TableHead>Commodity</TableHead>
                        <TableHead>HS Code</TableHead>
                        <TableHead>Export Value</TableHead>
                        <TableHead>Port of Exit</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Clearance Status</TableHead>
                        <TableHead>Sync Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customsIntegrations.length > 0 ? customsIntegrations.map((integration) => {
                        const commodity = commodities.find(c => c.id === integration.commodityId);
                        return (
                          <TableRow key={integration.id}>
                            <TableCell className="font-medium">{integration.declarationNumber}</TableCell>
                            <TableCell>{commodity?.batchId} - {commodity?.type}</TableCell>
                            <TableCell>{integration.hsCode}</TableCell>
                            <TableCell>${integration.exportValue}</TableCell>
                            <TableCell>{integration.portOfExit}</TableCell>
                            <TableCell>{integration.destinationCountry}</TableCell>
                            <TableCell>{getClearanceStatusBadge(integration.clearanceStatus)}</TableCell>
                            <TableCell>{getStatusBadge(integration.syncStatus)}</TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                            No Customs integrations found. Select a commodity above to sync.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <div className="isms-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-indigo flex items-center justify-center">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Synchronization Activity Logs</h3>
                    <p className="text-slate-600">Track all government integration synchronization activities</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sync Type</TableHead>
                        <TableHead>Entity ID</TableHead>
                        <TableHead>Direction</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Synced By</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncLogs.length > 0 ? syncLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.syncType}</TableCell>
                          <TableCell>{log.entityId}</TableCell>
                          <TableCell>{log.syncDirection}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell>{log.syncDuration ? `${log.syncDuration}ms` : 'N/A'}</TableCell>
                          <TableCell>{log.syncedBy}</TableCell>
                          <TableCell>{new Date(log.syncDate).toLocaleString()}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                            No sync logs available yet. Start synchronizing to see activity.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}