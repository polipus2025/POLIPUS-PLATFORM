import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, FileText, Search, Plus, Download, Eye, Calendar, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function AuditSystem() {
  const [isCreateAuditOpen, setIsCreateAuditOpen] = useState(false);
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [selectedAuditType, setSelectedAuditType] = useState("");
  const [auditFilters, setAuditFilters] = useState({
    status: "",
    auditType: "",
    dateRange: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch audit data
  const { data: auditLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["/api/audit/logs"],
  });

  const { data: systemAudits, isLoading: auditsLoading } = useQuery({
    queryKey: ["/api/audit/system-audits"],
  });

  const { data: auditReports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/audit/reports"],
  });

  // Create system audit mutation
  const createAuditMutation = useMutation({
    mutationFn: async (auditData: any) => {
      return await apiRequest("/api/audit/system-audits", "POST", {
        ...auditData,
        auditId: `AUD-${Date.now()}`,
        auditorId: "admin-001",
        auditorName: "AgriTrace360™ System Administrator",
        scheduledDate: new Date(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "System audit created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audit/system-audits"] });
      setIsCreateAuditOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create system audit",
        variant: "destructive",
      });
    },
  });

  // Create audit report mutation
  const createReportMutation = useMutation({
    mutationFn: async (reportData: any) => {
      return await apiRequest("/api/audit/reports", "POST", {
        ...reportData,
        reportId: `REP-${Date.now()}`,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Audit report created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/audit/reports"] });
      setIsCreateReportOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create audit report",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      completed: "default",
      in_progress: "secondary",
      failed: "destructive",
      scheduled: "outline"
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {getStatusIcon(status)}
        <span className="ml-1">{status.replace('_', ' ').toUpperCase()}</span>
      </Badge>
    );
  };

  const handleCreateAudit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const auditData = {
      auditType: formData.get("auditType"),
      auditScope: formData.get("auditScope"),
      riskAssessment: formData.get("riskAssessment"),
    };

    createAuditMutation.mutate(auditData);
  };

  const handleCreateReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const reportData = {
      reportType: formData.get("reportType"),
      reportTitle: formData.get("reportTitle"),
      executiveSummary: formData.get("executiveSummary"),
      confidentialityLevel: formData.get("confidentialityLevel"),
    };

    createReportMutation.mutate(reportData);
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Independent Audit System - AgriTrace360™ Admin</title>
        <meta name="description" content="Independent audit and compliance monitoring system - AgriTrace360™ Administrator Access Only" />
      </Helmet>

      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Independent Audit System</h2>
            <p className="text-gray-600">Comprehensive audit trail and compliance monitoring</p>
            <Badge variant="destructive" className="mt-2">AgriTrace360™ Admin Only</Badge>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isCreateAuditOpen} onOpenChange={setIsCreateAuditOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Audit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create System Audit</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateAudit} className="space-y-4">
                  <div>
                    <Label htmlFor="auditType">Audit Type</Label>
                    <Select name="auditType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compliance_audit">Compliance Audit</SelectItem>
                        <SelectItem value="data_integrity">Data Integrity</SelectItem>
                        <SelectItem value="security_review">Security Review</SelectItem>
                        <SelectItem value="performance_audit">Performance Audit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="auditScope">Audit Scope</Label>
                    <Select name="auditScope" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scope" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_system">Full System</SelectItem>
                        <SelectItem value="county_specific">County Specific</SelectItem>
                        <SelectItem value="commodity_specific">Commodity Specific</SelectItem>
                        <SelectItem value="user_access">User Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="riskAssessment">Risk Assessment</Label>
                    <Textarea 
                      name="riskAssessment"
                      placeholder="Initial risk assessment..."
                      className="min-h-20"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateAuditOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createAuditMutation.isPending}>
                      Create Audit
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  New Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Audit Report</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateReport} className="space-y-4">
                  <div>
                    <Label htmlFor="reportType">Report Type</Label>
                    <Select name="reportType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="executive_summary">Executive Summary</SelectItem>
                        <SelectItem value="detailed_findings">Detailed Findings</SelectItem>
                        <SelectItem value="compliance_report">Compliance Report</SelectItem>
                        <SelectItem value="security_assessment">Security Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="reportTitle">Report Title</Label>
                    <Input 
                      name="reportTitle"
                      placeholder="Enter report title..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="executiveSummary">Executive Summary</Label>
                    <Textarea 
                      name="executiveSummary"
                      placeholder="Executive summary..."
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confidentialityLevel">Confidentiality Level</Label>
                    <Select name="confidentialityLevel" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="confidential">Confidential</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateReportOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createReportMutation.isPending}>
                      Create Report
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="audits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="audits">System Audits</TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="audits" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Filter System Audits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select value={auditFilters.status} onValueChange={(value) => setAuditFilters({...auditFilters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Audit Type</Label>
                  <Select value={auditFilters.auditType} onValueChange={(value) => setAuditFilters({...auditFilters, auditType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="compliance_audit">Compliance Audit</SelectItem>
                      <SelectItem value="data_integrity">Data Integrity</SelectItem>
                      <SelectItem value="security_review">Security Review</SelectItem>
                      <SelectItem value="performance_audit">Performance Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date Range</Label>
                  <Select value={auditFilters.dateRange} onValueChange={(value) => setAuditFilters({...auditFilters, dateRange: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Dates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Audits Table */}
          <Card>
            <CardHeader>
              <CardTitle>System Audits</CardTitle>
            </CardHeader>
            <CardContent>
              {auditsLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Audit ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scope</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Auditor</TableHead>
                      <TableHead>Scheduled Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(systemAudits) && systemAudits.length > 0 && systemAudits.map((audit: any) => (
                      <TableRow key={audit.id}>
                        <TableCell className="font-mono text-sm">{audit.auditId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {audit.auditType?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{audit.auditScope?.replace('_', ' ')}</TableCell>
                        <TableCell>{getStatusBadge(audit.auditStatus)}</TableCell>
                        <TableCell>{audit.auditorName}</TableCell>
                        <TableCell>
                          {audit.scheduledDate ? format(new Date(audit.scheduledDate), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!systemAudits || systemAudits.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No system audits found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Organization</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(auditLogs) && auditLogs.length > 0 ? auditLogs.slice(0, 10).map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {log.auditTimestamp ? format(new Date(log.auditTimestamp), 'MMM dd, HH:mm') : 'N/A'}
                        </TableCell>
                        <TableCell>{log.userId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>{log.entityType}</TableCell>
                        <TableCell>
                          <Badge variant={log.riskLevel === 'high' ? 'destructive' : log.riskLevel === 'medium' ? 'secondary' : 'outline'}>
                            {log.riskLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.organizationType}</TableCell>
                      </TableRow>
                    )) : null}
                    {(!auditLogs || !Array.isArray(auditLogs) || auditLogs.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No audit logs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Confidentiality</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.isArray(auditReports) && auditReports.length > 0 ? auditReports.map((report: any) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-mono text-sm">{report.reportId}</TableCell>
                        <TableCell>{report.reportTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {report.reportType?.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.reportStatus)}</TableCell>
                        <TableCell>
                          <Badge variant={report.confidentialityLevel === 'restricted' ? 'destructive' : 'secondary'}>
                            {report.confidentialityLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.generatedAt ? format(new Date(report.generatedAt), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : null}
                    {(!auditReports || !Array.isArray(auditReports) || auditReports.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No audit reports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">98.5%</div>
                <p className="text-sm text-gray-600 mt-1">Overall system compliance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                  Open Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">3</div>
                <p className="text-sm text-gray-600 mt-1">Require attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Resolved Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">47</div>
                <p className="text-sm text-gray-600 mt-1">This month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}