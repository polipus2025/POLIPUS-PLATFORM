import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  Shield, 
  Award,
  TrendingUp,
  FileText,
  Link as LinkIcon,
  Plus,
  Eye,
  Download,
  Filter
} from "lucide-react";
import type { 
  InternationalStandard, 
  CommodityStandardsCompliance, 
  StandardsApiIntegration,
  StandardsSyncLog,
  Commodity 
} from "@shared/schema";

interface StandardsOverview {
  totalStandards: number;
  activeStandards: number;
  commoditiesCompliant: number;
  pendingCompliance: number;
  totalCertificates: number;
  expiringCertificates: number;
}

export default function InternationalStandards() {
  const [selectedStandard, setSelectedStandard] = useState<string>("");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const [complianceFilter, setComplianceFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check user role for access control
  const checkUserRole = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const userRole = checkUserRole();

  // Redirect unauthorized users
  useEffect(() => {
    if (!userRole || (userRole !== 'regulatory_admin' && userRole !== 'regulatory_staff')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page. This section is restricted to LACRA administrators and staff only.",
        variant: "destructive",
      });
      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
      return;
    }
  }, [userRole, toast]);

  // Don't render the page content for unauthorized users
  if (!userRole || (userRole !== 'regulatory_admin' && userRole !== 'regulatory_staff')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Access Restricted</CardTitle>
            <CardDescription>
              This page is only accessible to LACRA administrators and regulatory staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You will be redirected to the dashboard shortly.
            </p>
            <Button 
              onClick={() => window.location.href = "/"}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch overview metrics
  const { data: overview } = useQuery<StandardsOverview>({
    queryKey: ["/api/international-standards/overview"],
  });

  // Fetch international standards
  const { data: standards = [] } = useQuery<InternationalStandard[]>({
    queryKey: ["/api/international-standards"],
  });

  // Fetch compliance records
  const { data: compliance = [] } = useQuery<CommodityStandardsCompliance[]>({
    queryKey: ["/api/standards-compliance"],
  });

  // Fetch API integrations
  const { data: apiIntegrations = [] } = useQuery<StandardsApiIntegration[]>({
    queryKey: ["/api/standards-api-integrations"],
  });

  // Fetch sync logs
  const { data: syncLogs = [] } = useQuery<StandardsSyncLog[]>({
    queryKey: ["/api/standards-sync-logs"],
  });

  // Fetch commodities for dropdown
  const { data: commodities = [] } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  // Sync with standards database
  const syncWithStandards = useMutation({
    mutationFn: async (standardId: number) => {
      return await apiRequest(`/api/international-standards/${standardId}/sync`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Standards database sync completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/standards-compliance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/standards-sync-logs"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Check compliance status
  const checkCompliance = useMutation({
    mutationFn: async (commodityId: number) => {
      return await apiRequest(`/api/commodities/${commodityId}/check-standards-compliance`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "Compliance Check Complete",
        description: "Commodity compliance status has been updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/standards-compliance"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Compliance Check Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Compliant</Badge>;
      case 'non_compliant':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Non-Compliant</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'under_review':
        return <Badge variant="outline"><Eye className="h-3 w-3 mr-1" />Under Review</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSyncStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Partial</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const filteredCompliance = compliance.filter(c => {
    if (complianceFilter === "all") return true;
    return c.complianceStatus === complianceFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-8 w-8 text-blue-600" />
            International Agricultural Standards
          </h1>
          <p className="text-muted-foreground">
            Integration with global certification bodies and compliance monitoring
          </p>
        </div>
        <Button onClick={() => window.location.reload()}>
          <Database className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Standards</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {overview?.activeStandards || 0}/{overview?.totalStandards || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Integration with {standards.length} standard bodies
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Commodities</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overview?.commoditiesCompliant || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.pendingCompliance || 0} pending compliance review
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certificates</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {overview?.totalCertificates || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {overview?.expiringCertificates || 0} expiring within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="standards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="standards">Standards Database</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
          <TabsTrigger value="integrations">API Integrations</TabsTrigger>
          <TabsTrigger value="sync-logs">Sync Logs</TabsTrigger>
        </TabsList>

        {/* Standards Database Tab */}
        <TabsContent value="standards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                International Standards Database
              </CardTitle>
              <CardDescription>
                Connected agricultural certification standards and requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Standard</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Commodities</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standards.map((standard) => (
                    <TableRow key={standard.id}>
                      <TableCell className="font-medium">{standard.standardName}</TableCell>
                      <TableCell>{standard.organizationName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{standard.standardType}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {standard.commodityTypes?.slice(0, 3).map((type, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {(standard.commodityTypes?.length || 0) > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(standard.commodityTypes?.length || 0) - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{standard.standardVersion}</TableCell>
                      <TableCell>
                        {standard.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => syncWithStandards.mutate(standard.id)}
                            disabled={syncWithStandards.isPending}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync
                          </Button>
                          {standard.websiteUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={standard.websiteUrl} target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="h-3 w-3 mr-1" />
                                View
                              </a>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Status Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="compliance-filter">Filter by Status:</Label>
                <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="compliant">Compliant</SelectItem>
                    <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Commodity Standards Compliance
              </CardTitle>
              <CardDescription>
                Real-time compliance status with international agricultural standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Commodity</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Certificate #</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompliance.map((comp) => {
                    const commodity = commodities.find(c => c.id === comp.commodityId);
                    const standard = standards.find(s => s.id === comp.standardId);
                    return (
                      <TableRow key={comp.id}>
                        <TableCell className="font-medium">
                          {commodity?.batchNumber} - {commodity?.type}
                        </TableCell>
                        <TableCell>{standard?.standardName}</TableCell>
                        <TableCell>{comp.certificateNumber || 'N/A'}</TableCell>
                        <TableCell>
                          {comp.complianceScore ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    parseFloat(comp.complianceScore) >= 80 ? 'bg-green-500' :
                                    parseFloat(comp.complianceScore) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${comp.complianceScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{comp.complianceScore}%</span>
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>{getComplianceStatusBadge(comp.complianceStatus)}</TableCell>
                        <TableCell>
                          {comp.expiryDate ? new Date(comp.expiryDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => checkCompliance.mutate(comp.commodityId)}
                              disabled={checkCompliance.isPending}
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Check
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Compliance Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed compliance information for {commodity?.batchNumber}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Compliance ID</Label>
                                      <div className="font-medium">{comp.complianceId}</div>
                                    </div>
                                    <div>
                                      <Label>Audit Date</Label>
                                      <div>{comp.auditDate ? new Date(comp.auditDate).toLocaleDateString() : 'N/A'}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Auditor Organization</Label>
                                    <div>{comp.auditorOrganization || 'N/A'}</div>
                                  </div>
                                  <div>
                                    <Label>Notes</Label>
                                    <div className="text-sm text-muted-foreground">
                                      {comp.notes || 'No additional notes available'}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Standards API Integrations
              </CardTitle>
              <CardDescription>
                Connected APIs for real-time standards and compliance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>API Name</TableHead>
                    <TableHead>Standard</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sync Frequency</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Error Count</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiIntegrations.map((integration) => {
                    const standard = standards.find(s => s.id === integration.standardId);
                    return (
                      <TableRow key={integration.id}>
                        <TableCell className="font-medium">{integration.apiName}</TableCell>
                        <TableCell>{standard?.standardName}</TableCell>
                        <TableCell>
                          {integration.isActive ? (
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{integration.syncFrequency}</Badge>
                        </TableCell>
                        <TableCell>
                          {integration.lastSyncDate ? 
                            new Date(integration.lastSyncDate).toLocaleString() : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          {(integration.errorCount || 0) > 0 ? (
                            <Badge variant="destructive">{integration.errorCount || 0}</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">0</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Test
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-3 w-3 mr-1" />
                              Config
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Logs Tab */}
        <TabsContent value="sync-logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Standards Synchronization Logs
              </CardTitle>
              <CardDescription>
                History of data synchronization with international standards databases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sync Date</TableHead>
                    <TableHead>API</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Synced By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.slice(0, 10).map((log) => {
                    const integration = apiIntegrations.find(a => a.id === log.apiIntegrationId);
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          {log.syncDate ? new Date(log.syncDate).toLocaleString() : 'N/A'}
                        </TableCell>
                        <TableCell>{integration?.apiName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.syncType}</Badge>
                        </TableCell>
                        <TableCell>{getSyncStatusBadge(log.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Processed: {log.recordsProcessed}</div>
                            <div className="text-muted-foreground">
                              Updated: {log.recordsUpdated}, Added: {log.recordsAdded}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{log.syncDuration}ms</TableCell>
                        <TableCell>{log.syncedBy}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}