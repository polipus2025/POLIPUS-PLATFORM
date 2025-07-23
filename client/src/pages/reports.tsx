import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, Download, FileText, Calendar, BarChart3, Eye, TrendingUp, Shield, AlertTriangle, Activity, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertReportSchema, type Report, type InsertReport } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { COUNTIES, COMMODITY_TYPES } from "@/lib/types";

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [isStatisticsDialogOpen, setIsStatisticsDialogOpen] = useState(false);
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false);
  
  // Mock user role - In real app, this would come from authentication context
  const currentUserRole = "senior_official"; // Can be: "senior_official", "administrator", "regular_user"

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const form = useForm<InsertReport>({
    resolver: zodResolver(insertReportSchema),
    defaultValues: {
      title: "",
      type: "compliance",
      parameters: "",
      generatedBy: "James Kollie",
      status: "pending"
    },
  });

  const createReportMutation = useMutation({
    mutationFn: (data: InsertReport) =>
      apiRequest("POST", "/api/reports", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Success",
        description: "Report generation initiated successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create report",
        variant: "destructive",
      });
    },
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'text-warning bg-warning',
      completed: 'text-success bg-success',
      failed: 'text-error bg-error'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-400'} bg-opacity-10 text-xs font-medium rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      compliance: 'border-lacra-blue text-lacra-blue',
      inspection: 'border-lacra-green text-lacra-green',
      export: 'border-lacra-orange text-lacra-orange',
      county: 'border-purple-500 text-purple-500'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`${colors[type as keyof typeof colors] || 'border-gray-400 text-gray-600'} text-xs`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const onSubmit = (data: InsertReport) => {
    const reportData = {
      ...data,
      parameters: JSON.stringify({
        county: data.parameters?.includes('county') ? 'all' : undefined,
        dateRange: '30days',
        includeCharts: true
      })
    };
    createReportMutation.mutate(reportData);
  };

  const reportTypes = [
    { value: "compliance", label: "Compliance Report", description: "Overall compliance status across all commodities" },
    { value: "inspection", label: "Inspection Report", description: "Quality control inspection summaries" },
    { value: "export", label: "Export Report", description: "Export certification and trade statistics" },
    { value: "county", label: "County Report", description: "Regional compliance and production data" }
  ];

  // Function to check if user has senior access
  const hasSeniorAccess = () => {
    return currentUserRole === "senior_official" || currentUserRole === "administrator";
  };

  // Statistics data query for senior officials
  const { data: statisticsData, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/dashboard/advanced-statistics"],
    enabled: hasSeniorAccess(),
  });

  // Audit data query for senior officials
  const { data: auditData, isLoading: loadingAudit } = useQuery({
    queryKey: ["/api/audit/system-logs"],
    enabled: hasSeniorAccess(),
  });

  const generateStatisticsReport = () => {
    if (!hasSeniorAccess()) {
      toast({
        title: "Access Denied",
        description: "This feature is only available to senior officials and administrators.",
        variant: "destructive",
      });
      return;
    }
    setIsStatisticsDialogOpen(true);
  };

  const generateAuditReport = () => {
    if (!hasSeniorAccess()) {
      toast({
        title: "Access Denied", 
        description: "This feature is only available to senior officials and administrators.",
        variant: "destructive",
      });
      return;
    }
    setIsAuditDialogOpen(true);
  };

  const handleViewPdf = (report: Report) => {
    setSelectedReport(report);
    setIsPdfViewerOpen(true);
  };

  // Function to download report as PDF
  const handleDownloadPdf = (report: Report) => {
    const content = generatePdfContent(report);
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.reportId || `report-${report.id}`}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Report "${report.title}" has been downloaded as HTML file.`,
    });
  };

  // Function to export report as CSV
  const handleExportCsv = (report: Report) => {
    const data = report.data ? JSON.parse(report.data) : {};
    let csvContent = "Report Information\n";
    csvContent += `Report ID,${report.reportId || report.id}\n`;
    csvContent += `Title,${report.title}\n`;
    csvContent += `Type,${report.type}\n`;
    csvContent += `Generated By,${report.generatedBy}\n`;
    csvContent += `Department,${report.department || 'N/A'}\n`;
    csvContent += `Date Range,${report.dateRange || 'N/A'}\n`;
    csvContent += `Status,${report.status}\n`;
    csvContent += `Generated At,${new Date(report.generatedAt!).toLocaleString()}\n\n`;
    
    if (report.summary) {
      csvContent += `Summary,${report.summary}\n\n`;
    }
    
    // Add report-specific data
    if (data && Object.keys(data).length > 0) {
      csvContent += "Report Data\n";
      Object.entries(data).forEach(([key, value]) => {
        csvContent += `${key},${value}\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.reportId || `report-${report.id}`}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: `Report data exported as CSV file.`,
    });
  };

  const generatePdfContent = (report: Report) => {
    const data = report.data ? JSON.parse(report.data) : {};
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 3px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin: 0; font-size: 28px;">LIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY</h1>
          <h2 style="color: #374151; margin: 10px 0 0 0; font-size: 20px;">${report.title}</h2>
        </div>

        <!-- Report Information -->
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 30%;">Report ID:</td>
              <td style="padding: 8px 0;">${report.reportId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Report Type:</td>
              <td style="padding: 8px 0; text-transform: capitalize;">${report.type.replace('_', ' ')}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Date Range:</td>
              <td style="padding: 8px 0;">${report.dateRange}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Generated By:</td>
              <td style="padding: 8px 0;">${report.generatedBy}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Department:</td>
              <td style="padding: 8px 0;">${report.department}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Status:</td>
              <td style="padding: 8px 0;">
                <span style="background: ${report.status === 'published' ? '#dcfce7' : '#fef3c7'}; 
                           color: ${report.status === 'published' ? '#166534' : '#92400e'}; 
                           padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">
                  ${report.status}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Executive Summary -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Executive Summary</h3>
          <p style="line-height: 1.6; color: #4b5563;">${report.summary}</p>
        </div>

        <!-- Key Metrics -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Key Metrics</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            ${report.type === 'compliance' ? `
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #0369a1;">${data.complianceRate || '91.0%'}</div>
                <div style="color: #64748b; font-size: 14px;">Compliance Rate</div>
              </div>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${data.compliantCommodities || '142'}</div>
                <div style="color: #64748b; font-size: 14px;">Compliant Commodities</div>
              </div>
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${data.nonCompliantCommodities || '14'}</div>
                <div style="color: #64748b; font-size: 14px;">Non-Compliant</div>
              </div>
            ` : report.type === 'eudr_compliance' ? `
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #0369a1;">${data.totalFarms || '89'}</div>
                <div style="color: #64748b; font-size: 14px;">Total Farms</div>
              </div>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${data.compliantFarms || '76'}</div>
                <div style="color: #64748b; font-size: 14px;">EUDR Compliant</div>
              </div>
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${data.deforestationAlerts || '5'}</div>
                <div style="color: #64748b; font-size: 14px;">Deforestation Alerts</div>
              </div>
            ` : report.type === 'export_analysis' ? `
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #0369a1;">${data.totalExports || '125,000 MT'}</div>
                <div style="color: #64748b; font-size: 14px;">Total Exports</div>
              </div>
              <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${data.exportValue || '$45.2M'}</div>
                <div style="color: #64748b; font-size: 14px;">Export Value</div>
              </div>
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${data.growthRate || '+12.5%'}</div>
                <div style="color: #64748b; font-size: 14px;">Growth Rate</div>
              </div>
            ` : `
              <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #0369a1;">N/A</div>
                <div style="color: #64748b; font-size: 14px;">Data Available</div>
              </div>
            `}
          </div>
        </div>

        <!-- Detailed Analysis -->
        <div style="margin-bottom: 30px;">
          <h3 style="color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Detailed Analysis</h3>
          ${report.type === 'compliance' ? `
            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 10px;">Top Performing Counties</h4>
              <ul style="list-style: none; padding: 0;">
                ${(data.topCounties || ['Lofa County', 'Grand Gedeh County', 'Margibi County']).map((county: string) => 
                  `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">• ${county}</li>`
                ).join('')}
              </ul>
            </div>
            <div>
              <h4 style="color: #4b5563; margin-bottom: 10px;">Critical Issues Identified</h4>
              <ul style="list-style: none; padding: 0;">
                ${(data.criticalIssues || ['Missing documentation', 'Quality grade discrepancies']).map((issue: string) => 
                  `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #dc2626;">⚠ ${issue}</li>`
                ).join('')}
              </ul>
            </div>
          ` : report.type === 'eudr_compliance' ? `
            <div style="margin-bottom: 20px;">
              <h4 style="color: #4b5563; margin-bottom: 10px;">Risk Assessment</h4>
              <p style="color: #4b5563; line-height: 1.6;">
                Current risk level: <strong style="color: #f59e0b;">${data.riskLevel || 'Medium'}</strong><br>
                Deforestation monitoring indicates moderate compliance across surveyed areas.
              </p>
            </div>
            <div>
              <h4 style="color: #4b5563; margin-bottom: 10px;">Monitored Counties</h4>
              <ul style="list-style: none; padding: 0;">
                ${(data.counties || ['Lofa County', 'Bong County', 'Nimba County']).map((county: string) => 
                  `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">• ${county}</li>`
                ).join('')}
              </ul>
            </div>
          ` : `
            <p style="color: #6b7280; line-height: 1.6;">
              Detailed analysis data is available in the full report dataset. 
              Contact the reporting department for comprehensive analysis and recommendations.
            </p>
          `}
        </div>

        <!-- Footer -->
        <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2024 Liberia Agriculture Commodity Regulatory Authority (LACRA)</p>
          <p style="margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()} - Confidential</p>
        </div>
      </div>
    `;
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

  return (
    <div className="p-6">
      <Helmet>
        <title>Reports - AgriTrace360™ LACRA</title>
        <meta name="description" content="Generate and manage regulatory compliance reports for agricultural commodities" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Regulatory Reports</h2>
            <p className="text-gray-600">Generate and manage compliance reports for regulatory submissions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-lacra-green hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter report title..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {reportTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-gray-500">{type.description}</div>
                                </div>
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
                    name="parameters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Parameters (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any specific parameters or filters for this report..."
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-lacra-green hover:bg-green-700"
                      disabled={createReportMutation.isPending}
                    >
                      {createReportMutation.isPending ? "Generating..." : "Generate Report"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {reportTypes.slice(0, 2).map((type) => (
          <Card key={type.value} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-lacra-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-lacra-blue" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-lacra-blue hover:text-blue-700"
                  onClick={() => {
                    form.setValue("type", type.value);
                    form.setValue("title", `${type.label} - ${new Date().toLocaleDateString()}`);
                    setIsDialogOpen(true);
                  }}
                >
                  Generate
                </Button>
              </div>
              <h3 className="font-semibold text-neutral mb-2">{type.label}</h3>
              <p className="text-sm text-gray-500">{type.description}</p>
            </CardContent>
          </Card>
        ))}
        
        {/* Statistics Card - Senior Access Only */}
        <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${!hasSeniorAccess() ? 'opacity-50' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex items-center gap-2">
                {hasSeniorAccess() && (
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                    Senior Access
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-orange-600 hover:text-orange-700"
                  onClick={generateStatisticsReport}
                  disabled={!hasSeniorAccess()}
                >
                  View Stats
                </Button>
              </div>
            </div>
            <h3 className="font-semibold text-neutral mb-2">Advanced Statistics</h3>
            <p className="text-sm text-gray-500">
              Comprehensive analytics and performance metrics across all LACRA activities
              {!hasSeniorAccess() && <span className="block text-red-500 text-xs mt-1">Senior officials only</span>}
            </p>
          </CardContent>
        </Card>

        {/* Audit Trail Card - Senior Access Only */}
        <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${!hasSeniorAccess() ? 'opacity-50' : ''}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex items-center gap-2">
                {hasSeniorAccess() && (
                  <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                    Admin Only
                  </Badge>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                  onClick={generateAuditReport}
                  disabled={!hasSeniorAccess()}
                >
                  View Audit
                </Button>
              </div>
            </div>
            <h3 className="font-semibold text-neutral mb-2">System Audit Trail</h3>
            <p className="text-sm text-gray-500">
              Complete audit logs of all system activities, user actions, and security events
              {!hasSeniorAccess() && <span className="block text-red-500 text-xs mt-1">Senior officials only</span>}
            </p>
          </CardContent>
        </Card>
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
                  placeholder="Search by title or generated by..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-48">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="county">County</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">
            Generated Reports ({filteredReports.length} of {reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {reports.length === 0 
                        ? "No reports generated yet. Create your first regulatory report to get started."
                        : "No reports match your current filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{report.title}</div>
                        {report.parameters && (
                          <div className="text-sm text-gray-500">
                            Parameters: {report.parameters.length > 50 
                              ? report.parameters.substring(0, 50) + '...' 
                              : report.parameters
                            }
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getTypeBadge(report.type)}</TableCell>
                      <TableCell className="text-sm">{report.generatedBy}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(report.generatedAt!).toLocaleDateString()} at{' '}
                        {new Date(report.generatedAt!).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-blue hover:text-blue-700"
                            onClick={() => handleViewPdf(report)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-green hover:text-green-700"
                            onClick={() => handleDownloadPdf(report)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            HTML
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-orange hover:text-orange-700"
                            onClick={() => handleExportCsv(report)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            CSV
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

      {/* PDF Viewer Dialog */}
      <Dialog open={isPdfViewerOpen} onOpenChange={setIsPdfViewerOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-lacra-blue" />
              PDF Preview: {selectedReport?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {selectedReport && (
              <div className="h-[70vh] overflow-auto border rounded-lg m-6 bg-white">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: generatePdfContent(selectedReport) 
                  }}
                />
              </div>
            )}
          </div>
          <div className="p-6 pt-0 flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsPdfViewerOpen(false)}
            >
              Close
            </Button>
            <Button 
              className="bg-lacra-green hover:bg-green-700"
              onClick={() => selectedReport && handleDownloadPdf(selectedReport)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
            <Button 
              variant="outline"
              onClick={() => selectedReport && handleExportCsv(selectedReport)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statistics Dialog - Senior Access Only */}
      <Dialog open={isStatisticsDialogOpen} onOpenChange={setIsStatisticsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Advanced Statistics Dashboard
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                Senior Officials Only
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Statistics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total Activities</p>
                      <p className="text-2xl font-bold text-blue-900">2,847</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Success Rate</p>
                      <p className="text-2xl font-bold text-green-900">94.2%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Active Users</p>
                      <p className="text-2xl font-bold text-orange-900">156</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Daily Avg.</p>
                      <p className="text-2xl font-bold text-purple-900">312</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Breakdown by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Compliance Division</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-lacra-blue h-2 rounded-full" style={{width: '78%'}}></div>
                        </div>
                        <span className="text-sm font-medium">1,247</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inspection Services</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-lacra-green h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                        <span className="text-sm font-medium">892</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Export Certification</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-lacra-orange h-2 rounded-full" style={{width: '42%'}}></div>
                        </div>
                        <span className="text-sm font-medium">456</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">County Operations</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{width: '28%'}}></div>
                        </div>
                        <span className="text-sm font-medium">252</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">System Availability</span>
                        <span className="text-sm font-medium text-green-600">99.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '99.8%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium text-blue-600">1.2s avg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">User Satisfaction</span>
                        <span className="text-sm font-medium text-lacra-green">4.7/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-lacra-green h-2 rounded-full" style={{width: '94%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audit Trail Dialog - Senior Access Only */}
      <Dialog open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              System Audit Trail
              <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                Administrators Only
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Audit Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-red-50 to-red-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Security Events</p>
                      <p className="text-2xl font-bold text-red-900">47</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Failed Logins</p>
                      <p className="text-2xl font-bold text-yellow-900">23</p>
                    </div>
                    <Shield className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Data Changes</p>
                      <p className="text-2xl font-bold text-blue-900">1,234</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Clean Sessions</p>
                      <p className="text-2xl font-bold text-green-900">2,789</p>
                    </div>
                    <Eye className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Audit Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent System Events (Last 24 Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-sm">2025-01-23 14:23:15</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600 border-green-300">Login</Badge>
                        </TableCell>
                        <TableCell>james.kollie@lacra.gov.lr</TableCell>
                        <TableCell>User login successful</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">192.168.1.45</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">2025-01-23 14:18:42</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-blue-600 border-blue-300">Data Update</Badge>
                        </TableCell>
                        <TableCell>mary.johnson@lacra.gov.lr</TableCell>
                        <TableCell>Updated commodity record COF-2024-001</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">10.0.0.23</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">2025-01-23 14:15:07</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-red-600 border-red-300">Failed Login</Badge>
                        </TableCell>
                        <TableCell>unknown.user@external.com</TableCell>
                        <TableCell>Failed login attempt - invalid credentials</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">Failed</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">203.45.67.89</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">2025-01-23 14:12:33</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-purple-600 border-purple-300">Report Gen</Badge>
                        </TableCell>
                        <TableCell>samuel.harris@lacra.gov.lr</TableCell>
                        <TableCell>Generated compliance report RPT-2024-078</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">192.168.1.67</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="text-sm">2025-01-23 14:08:19</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-orange-600 border-orange-300">Export</Badge>
                        </TableCell>
                        <TableCell>admin@lacra.gov.lr</TableCell>
                        <TableCell>Exported farmer database to CSV</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Success</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">192.168.1.10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
