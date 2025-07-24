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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search, Plus, Download, FileText, Calendar, BarChart3, Eye, TrendingUp, Shield, AlertTriangle, Activity, CheckCircle, Truck, MapPin, Navigation, Clock, PieChart, Package, Award } from "lucide-react";
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
  const [isTransportationDialogOpen, setIsTransportationDialogOpen] = useState(false);
  const [isExportReportDialogOpen, setIsExportReportDialogOpen] = useState(false);
  const [exportData, setExportData] = useState<any>(null);
  const [isGeneratingExportReport, setIsGeneratingExportReport] = useState(false);
  const [isLoadingExportData, setIsLoadingExportData] = useState(false);
  
  // Mock user role - In real app, this would come from authentication context
  const currentUserRole = "senior_official"; // Can be: "senior_official", "administrator", "regular_user"

  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    { value: "transportation", label: "Transportation Tracking", description: "Real-time vehicle tracking and produce movement monitoring" },
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

  // Transportation tracking data
  const { data: transportationData, isLoading: loadingTransportation } = useQuery({
    queryKey: ["/api/transportation/active-shipments"],
  });

  const { data: vehicleTracking } = useQuery({
    queryKey: ["/api/transportation/vehicle-tracking"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time tracking
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

  const generateExportReport = async () => {
    setIsGeneratingExportReport(true);
    setIsLoadingExportData(true);
    
    try {
      // Fetch real export data from the API
      const response = await apiRequest("GET", "/api/reports/export-data");
      setExportData(response);
      setIsExportReportDialogOpen(true);
      
      toast({
        title: "Export Report Generated",
        description: "Comprehensive export analysis with real AgriTrace360™ data is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate export report",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingExportReport(false);
      setIsLoadingExportData(false);
    }
  };

  // Test download function to verify basic download works
  const testDownload = () => {
    const testContent = "This is a test file from AgriTrace360™\nGenerated on: " + new Date().toISOString();
    const blob = new Blob([testContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agritrace360_test.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    toast({
      title: "Test Download",
      description: "Test file downloaded successfully.",
    });
  };

  const handleDownloadExportReport = (format: 'pdf' | 'csv' | 'detailed') => {
    if (!exportData) return;
    
    let content = "";
    let filename = "";
    let mimeType = "";
    
    if (format === 'pdf' || format === 'detailed') {
      // Generate HTML content for PDF-style download
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>AgriTrace360™ Export Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
            .summary { background: #fff7ed; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-box { text-align: center; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            .table th { background: #f9fafb; font-weight: bold; }
            .compliant { color: #16a34a; font-weight: bold; }
            .non-compliant { color: #dc2626; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AgriTrace360™ Export Analysis Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} | LACRA Regulatory Compliance</p>
          </div>
          
          <div class="summary">
            <h2>Executive Summary</h2>
            <div class="stats">
              <div class="stat-box">
                <h3>${exportData.totalCommodities}</h3>
                <p>Total Commodities</p>
              </div>
              <div class="stat-box">
                <h3>${exportData.totalValue}</h3>
                <p>Export Value (USD)</p>
              </div>
              <div class="stat-box">
                <h3>${exportData.totalWeight}</h3>
                <p>Total Weight (MT)</p>
              </div>
              <div class="stat-box">
                <h3>${exportData.complianceRate}%</h3>
                <p>Compliance Rate</p>
              </div>
            </div>
          </div>
          
          <h2>Commodity Details</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Commodity Type</th>
                <th>Batch Code</th>
                <th>Origin County</th>
                <th>Quality Grade</th>
                <th>Weight (MT)</th>
                <th>Value (USD)</th>
                <th>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              ${exportData.commodities.map((commodity: any) => `
                <tr>
                  <td>${commodity.type}</td>
                  <td>${commodity.batchCode}</td>
                  <td>${commodity.originCounty}</td>
                  <td>${commodity.qualityGrade}</td>
                  <td>${commodity.weight}</td>
                  <td>$${commodity.value.toLocaleString()}</td>
                  <td class="${commodity.complianceStatus === 'Compliant' ? 'compliant' : 'non-compliant'}">
                    ${commodity.complianceStatus}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>Quality Inspections</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Commodity Type</th>
                <th>Inspector</th>
                <th>Location</th>
                <th>Result</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${exportData.inspections.map((inspection: any) => `
                <tr>
                  <td>${inspection.commodityType}</td>
                  <td>${inspection.inspector}</td>
                  <td>${inspection.location}</td>
                  <td class="${inspection.result === 'Pass' ? 'compliant' : 'non-compliant'}">
                    ${inspection.result}
                  </td>
                  <td>${new Date(inspection.date).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>Export Certifications</h2>
          <table class="table">
            <thead>
              <tr>
                <th>Certification Type</th>
                <th>Status</th>
                <th>Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              ${exportData.certifications.map((cert: any) => `
                <tr>
                  <td>${cert.type}</td>
                  <td class="${cert.status === 'Valid' ? 'compliant' : 'non-compliant'}">
                    ${cert.status}
                  </td>
                  <td>${new Date(cert.expiryDate).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>This report was generated by AgriTrace360™ - Agricultural Commodity Compliance Management System</p>
            <p>Liberia Agriculture Commodity Regulatory Authority (LACRA)</p>
          </div>
        </body>
        </html>
      `;
      filename = `AgriTrace360_Export_Report_${new Date().toISOString().split('T')[0]}.html`;
      mimeType = 'text/html';
    } else if (format === 'csv') {
      // Generate CSV content
      content = `AgriTrace360™ Export Report - Generated ${new Date().toLocaleDateString()}\n\n`;
      content += `Summary Statistics:\n`;
      content += `Total Commodities,${exportData.totalCommodities}\n`;
      content += `Export Value,${exportData.totalValue}\n`;
      content += `Total Weight,${exportData.totalWeight}\n`;
      content += `Compliance Rate,${exportData.complianceRate}%\n\n`;
      
      content += `Commodity Details:\n`;
      content += `Type,Batch Code,Origin County,Quality Grade,Weight (MT),Value (USD),Compliance Status\n`;
      exportData.commodities.forEach((commodity: any) => {
        content += `${commodity.type},${commodity.batchCode},${commodity.originCounty},${commodity.qualityGrade},${commodity.weight},${commodity.value},${commodity.complianceStatus}\n`;
      });
      
      content += `\nInspection Results:\n`;
      content += `Commodity Type,Inspector,Location,Result,Date\n`;
      exportData.inspections.forEach((inspection: any) => {
        content += `${inspection.commodityType},${inspection.inspector},${inspection.location},${inspection.result},${new Date(inspection.date).toLocaleDateString()}\n`;
      });
      
      filename = `AgriTrace360_Export_Data_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }
    
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Add to body, click, and remove
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      toast({
        title: "Download Successful",
        description: `Export report "${filename}" has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to download the export report. Please try again.",
        variant: "destructive",
      });
    }
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
        {/* Compliance Report Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
                  form.setValue("type", "compliance");
                  form.setValue("title", `Compliance Report - ${new Date().toLocaleDateString()}`);
                  setIsDialogOpen(true);
                }}
              >
                Generate
              </Button>
            </div>
            <h3 className="font-semibold text-neutral mb-2">Compliance Report</h3>
            <p className="text-sm text-gray-500">Overall compliance status across all commodities</p>
          </CardContent>
        </Card>

        {/* Export Report with Real Data Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-lacra-orange">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-lacra-orange bg-opacity-10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-lacra-orange" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs text-lacra-orange border-lacra-orange">
                  Real Data
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-lacra-orange hover:text-orange-700"
                  onClick={generateExportReport}
                  disabled={isGeneratingExportReport}
                >
                  {isGeneratingExportReport ? "Generating..." : "Generate"}
                </Button>
              </div>
            </div>
            <h3 className="font-semibold text-neutral mb-2">Export Report</h3>
            <p className="text-sm text-gray-500">
              Comprehensive export analysis with real AgriTrace360™ commodity data
            </p>
          </CardContent>
        </Card>

        {/* Transportation Tracking Card */}
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-lacra-green bg-opacity-10 rounded-lg flex items-center justify-center">
                <Truck className="h-6 w-6 text-lacra-green" />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs text-lacra-green border-lacra-green">
                  Live Tracking
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-lacra-green hover:text-green-700"
                  onClick={() => setIsTransportationDialogOpen(true)}
                >
                  Track Now
                </Button>
              </div>
            </div>
            <h3 className="font-semibold text-neutral mb-2">Transportation Tracking</h3>
            <p className="text-sm text-gray-500">
              Real-time vehicle tracking and produce movement monitoring with GPS and QR scanning
            </p>
          </CardContent>
        </Card>
        
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

      {/* Transportation Tracking Dialog */}
      <Dialog open={isTransportationDialogOpen} onOpenChange={setIsTransportationDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-lacra-green" />
              Transportation Tracking System
              <Badge variant="outline" className="text-xs text-lacra-green border-lacra-green">
                Live GPS Tracking
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Active Shipments Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-green-50 to-green-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Active Shipments</p>
                      <p className="text-2xl font-bold text-green-900">23</p>
                    </div>
                    <Truck className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">In Transit</p>
                      <p className="text-2xl font-bold text-blue-900">18</p>
                    </div>
                    <Navigation className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">At Checkpoints</p>
                      <p className="text-2xl font-bold text-orange-900">3</p>
                    </div>
                    <MapPin className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Delivered Today</p>
                      <p className="text-2xl font-bold text-purple-900">12</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Vehicle Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Tracking Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-lacra-green" />
                    Live Vehicle Tracking
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Real-time
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-green-800">TRK-LR-001</span>
                          <Badge className="ml-2 bg-green-200 text-green-800 text-xs">Moving</Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          2 min ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        Current: Monrovia Highway → Destination: Buchanan Port
                      </p>
                      <div className="flex justify-between text-xs">
                        <span>Driver: John Kpelle</span>
                        <span>Cargo: Coffee - 2.5 tons</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Track Live
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          QR Details
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-blue-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-blue-800">TRK-LR-002</span>
                          <Badge className="ml-2 bg-blue-200 text-blue-800 text-xs">At Checkpoint</Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          15 min ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        Current: Gbarnga Checkpoint → Destination: Voinjama
                      </p>
                      <div className="flex justify-between text-xs">
                        <span>Driver: Mary Kollie</span>
                        <span>Cargo: Cocoa - 3.2 tons</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          View Location
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Scan QR
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-orange-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-orange-800">TRK-LR-003</span>
                          <Badge className="ml-2 bg-orange-200 text-orange-800 text-xs">Loading</Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          <Clock className="h-3 w-3 inline mr-1" />
                          45 min ago
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        Current: Farm PLT-2024-001 → Destination: Monrovia
                      </p>
                      <div className="flex justify-between text-xs">
                        <span>Driver: Samuel Harris</span>
                        <span>Cargo: Palm Oil - 1.8 tons</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Monitor Loading
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          Generate QR
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Scanning & Movement Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    QR Scanner & Movement Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* QR Scanner Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Activity className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Scan Vehicle QR Code</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Scan QR code to update vehicle location and movement status
                      </p>
                      <Button className="bg-lacra-blue hover:bg-blue-700">
                        <Activity className="h-4 w-4 mr-2" />
                        Start QR Scanner
                      </Button>
                    </div>

                    {/* Recent Movement Updates */}
                    <div>
                      <h4 className="font-semibold mb-3">Recent Movement Updates</h4>
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">TRK-LR-001 Status Update</p>
                            <p className="text-xs text-gray-600">Arrived at Buchanan Port - QR Scanned</p>
                            <p className="text-xs text-gray-500">2 minutes ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">TRK-LR-002 Checkpoint</p>
                            <p className="text-xs text-gray-600">Reached Gbarnga Checkpoint - Documents verified</p>
                            <p className="text-xs text-gray-500">15 minutes ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                          <Truck className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">TRK-LR-003 Loading Complete</p>
                            <p className="text-xs text-gray-600">Finished loading at Farm PLT-2024-001</p>
                            <p className="text-xs text-gray-500">45 minutes ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Route Optimization & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-indigo-600" />
                    Route Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-800 mb-2">Optimal Routes Today</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Monrovia → Buchanan: 3 vehicles</span>
                          <span className="text-green-600 font-medium">12% fuel saved</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Gbarnga → Voinjama: 2 vehicles</span>
                          <span className="text-green-600 font-medium">8% time saved</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Farm clusters → Port: 5 vehicles</span>
                          <span className="text-green-600 font-medium">15% cost reduced</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h5 className="font-medium mb-2">Route Suggestions</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• Combine TRK-LR-004 & TRK-LR-005 shipments</p>
                        <p>• Alternate route via Kakata for TRK-LR-002</p>
                        <p>• Schedule overnight stop at Gbarnga checkpoint</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Real-time Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-400 rounded">
                      <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">Route Deviation Alert</p>
                        <p className="text-xs text-red-600">TRK-LR-002 off planned route by 5km</p>
                        <p className="text-xs text-gray-500">3 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-800">Schedule Delay</p>
                        <p className="text-xs text-yellow-600">TRK-LR-003 45 min behind schedule</p>
                        <p className="text-xs text-gray-500">8 minutes ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-800">Delivery Confirmed</p>
                        <p className="text-xs text-green-600">TRK-LR-001 delivered successfully</p>
                        <p className="text-xs text-gray-500">12 minutes ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced QR Code & Document Verification */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Enhanced QR System & Document Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">QR Code Generator</h4>
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-white border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center mb-2">
                          <Activity className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-600">Vehicle QR Code</p>
                      </div>
                      <Button size="sm" className="w-full">Generate New QR</Button>
                      <Button size="sm" variant="outline" className="w-full">Print QR Labels</Button>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">Document Verification</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Export Permits: Valid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Driver License: Valid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Vehicle Registration: Valid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Insurance: Expires in 5 days</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">Blockchain Verification</h4>
                    <div className="space-y-2">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-2">
                          <Shield className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-xs font-medium text-purple-800">Tamper-Proof Records</p>
                        <p className="text-xs text-gray-600">All movements verified on blockchain</p>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">Verify Chain</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Movement History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Detailed Movement History & GPS Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle ID</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Cargo Details</TableHead>
                        <TableHead>Current Location</TableHead>
                        <TableHead>Last QR Scan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">TRK-LR-001</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">John Kpelle</p>
                            <p className="text-xs text-gray-500">License: DL-2024-001</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Coffee - 2.5 tons</p>
                            <p className="text-xs text-gray-500">Batch: COF-2024-001</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Buchanan Port</p>
                            <p className="text-xs text-gray-500">GPS: 5.8817°N, 10.0464°W</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">2 min ago</p>
                            <p className="text-xs text-gray-500">Checkpoint: BP-001</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Delivered</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 mr-1" />
                              GPS
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Activity className="h-3 w-3 mr-1" />
                              QR
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        <TableCell className="font-medium">TRK-LR-002</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Mary Kollie</p>
                            <p className="text-xs text-gray-500">License: DL-2024-002</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Cocoa - 3.2 tons</p>
                            <p className="text-xs text-gray-500">Batch: COC-2024-002</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Gbarnga Checkpoint</p>
                            <p className="text-xs text-gray-500">GPS: 7.0000°N, 9.4833°W</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">15 min ago</p>
                            <p className="text-xs text-gray-500">Checkpoint: GC-003</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-800">At Checkpoint</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 mr-1" />
                              GPS
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Activity className="h-3 w-3 mr-1" />
                              QR
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell className="font-medium">TRK-LR-003</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Samuel Harris</p>
                            <p className="text-xs text-gray-500">License: DL-2024-003</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Palm Oil - 1.8 tons</p>
                            <p className="text-xs text-gray-500">Batch: PLM-2024-001</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">Farm PLT-2024-001</p>
                            <p className="text-xs text-gray-500">GPS: 6.3133°N, 10.8074°W</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">45 min ago</p>
                            <p className="text-xs text-gray-500">Checkpoint: FM-001</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-orange-100 text-orange-800">Loading</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="text-xs">
                              <MapPin className="h-3 w-3 mr-1" />
                              GPS
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Activity className="h-3 w-3 mr-1" />
                              QR
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Fleet Management & Driver Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-gray-600" />
                    Fleet Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-gray-800">45</p>
                        <p className="text-sm text-gray-600">Total Vehicles</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-800">38</p>
                        <p className="text-sm text-green-600">Active</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Trucks (Large)</span>
                        <span className="font-medium">23 vehicles</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Trucks (Medium)</span>
                        <span className="font-medium">15 vehicles</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pickup Trucks</span>
                        <span className="font-medium">7 vehicles</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <h5 className="font-medium mb-2">Maintenance Status</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Ready for Service</span>
                          <span className="text-green-600">38</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Maintenance Due</span>
                          <span className="text-yellow-600">5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Out of Service</span>
                          <span className="text-red-600">2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-5 w-5 text-teal-600" />
                    Driver Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-teal-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-teal-800">52</p>
                        <p className="text-sm text-teal-600">Total Drivers</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-800">23</p>
                        <p className="text-sm text-blue-600">On Duty</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">John Kpelle</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Vehicle: TRK-LR-001 • Route: Monrovia-Buchanan</p>
                        <p className="text-xs text-gray-500">License expires: Dec 2025</p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">Mary Kollie</span>
                          <Badge className="bg-orange-100 text-orange-800 text-xs">At Checkpoint</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Vehicle: TRK-LR-002 • Route: Gbarnga-Voinjama</p>
                        <p className="text-xs text-gray-500">License expires: Nov 2025</p>
                      </div>

                      <div className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">Samuel Harris</span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Loading</Badge>
                        </div>
                        <p className="text-xs text-gray-600">Vehicle: TRK-LR-003 • Route: Farm-Monrovia</p>
                        <p className="text-xs text-gray-500">License expires: Aug 2025</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Transportation Performance Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Delivery Performance</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>On-time Deliveries</span>
                        <span className="font-medium text-green-600">94.2%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average Delay</span>
                        <span className="font-medium">12 min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed Today</span>
                        <span className="font-medium">23 shipments</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Route Efficiency</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Fuel Efficiency</span>
                        <span className="font-medium text-green-600">8.2 km/L</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Route Optimization</span>
                        <span className="font-medium text-blue-600">87%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Distance Covered</span>
                        <span className="font-medium">2,347 km</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Safety Metrics</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Incident-free Days</span>
                        <span className="font-medium text-green-600">45 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Speed Violations</span>
                        <span className="font-medium text-yellow-600">3 this week</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Safety Score</span>
                        <span className="font-medium text-green-600">96.8%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-700">Cost Analysis</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Fuel Costs</span>
                        <span className="font-medium">$1,245</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Maintenance</span>
                        <span className="font-medium">$456</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Savings</span>
                        <span className="font-medium text-green-600">$234</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Report with Real Data Dialog */}
      <Dialog open={isExportReportDialogOpen} onOpenChange={setIsExportReportDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-lacra-orange" />
              AgriTrace360™ Export Report - Real Data Analysis
              <Badge variant="outline" className="text-xs text-lacra-orange border-lacra-orange">
                Live System Data
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          {isLoadingExportData ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lacra-orange mx-auto mb-4"></div>
              <p className="text-gray-600">Generating comprehensive export report...</p>
            </div>
          ) : exportData ? (
            <div className="space-y-8">
              {/* Executive Summary */}
              <Card className="bg-gradient-to-r from-lacra-orange to-orange-600 text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Executive Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold">{exportData.totalCommodities}</p>
                      <p className="text-sm opacity-90">Total Commodities</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{exportData.totalValue}</p>
                      <p className="text-sm opacity-90">Export Value (USD)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{exportData.totalWeight}</p>
                      <p className="text-sm opacity-90">Total Weight (MT)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold">{exportData.complianceRate}%</p>
                      <p className="text-sm opacity-90">Compliance Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commodity Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-lacra-orange" />
                    Export Commodity Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Commodity Type</TableHead>
                          <TableHead>Batch Code</TableHead>
                          <TableHead>Origin County</TableHead>
                          <TableHead>Quality Grade</TableHead>
                          <TableHead>Weight (MT)</TableHead>
                          <TableHead>Value (USD)</TableHead>
                          <TableHead>Compliance Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exportData.commodities.map((commodity: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{commodity.type}</TableCell>
                            <TableCell className="font-mono text-sm">{commodity.batchCode}</TableCell>
                            <TableCell>{commodity.originCounty}</TableCell>
                            <TableCell>
                              <Badge variant={commodity.qualityGrade === 'Grade A' ? 'default' : 'secondary'}>
                                {commodity.qualityGrade}
                              </Badge>
                            </TableCell>
                            <TableCell>{commodity.weight}</TableCell>
                            <TableCell>${commodity.value.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  commodity.complianceStatus === 'Compliant' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {commodity.complianceStatus}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Inspection Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Quality Inspection Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Recent Inspections</h4>
                      <div className="space-y-3">
                        {exportData.inspections.map((inspection: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium">{inspection.commodityType}</span>
                              <Badge variant={inspection.result === 'Pass' ? 'default' : 'destructive'}>
                                {inspection.result}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              Inspector: {inspection.inspector}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              Location: {inspection.location}
                            </p>
                            <p className="text-xs text-gray-500">
                              Date: {new Date(inspection.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Inspection Statistics</h4>
                      <div className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">Passed Inspections</span>
                          </div>
                          <p className="text-2xl font-bold text-green-900">{exportData.inspectionStats.passed}</p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <XCircle className="h-5 w-5 text-red-600" />
                            <span className="font-medium text-red-800">Failed Inspections</span>
                          </div>
                          <p className="text-2xl font-bold text-red-900">{exportData.inspectionStats.failed}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <span className="font-medium text-blue-800">Pending Review</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">{exportData.inspectionStats.pending}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certifications & Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Export Certifications & International Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Active Certifications</h4>
                      <div className="space-y-2">
                        {exportData.certifications.map((cert: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{cert.type}</p>
                              <p className="text-xs text-gray-500">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                            </div>
                            <Badge 
                              variant={cert.status === 'Valid' ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {cert.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">International Standards</h4>
                      <div className="space-y-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">EUDR Compliance</span>
                          </div>
                          <p className="text-xs text-gray-600">Deforestation risk assessment complete</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Fair Trade Certified</span>
                          </div>
                          <p className="text-xs text-gray-600">Ethical sourcing verified</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium">Organic Certification</span>
                          </div>
                          <p className="text-xs text-gray-600">USDA Organic standards met</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Export Destinations</h4>
                      <div className="space-y-2">
                        {exportData.destinations.map((dest: any, index: number) => (
                          <div key={index} className="border rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{dest.country}</span>
                              <span className="text-xs text-gray-500">{dest.percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div 
                                className="bg-lacra-orange h-2 rounded-full" 
                                style={{ width: `${dest.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Download Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold mb-2">Export Report Actions</h3>
                      <p className="text-sm text-gray-600">Download comprehensive export analysis report</p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownloadExportReport('pdf')}
                        className="border-lacra-orange text-lacra-orange hover:bg-orange-50"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={testDownload}
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Test Download
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownloadExportReport('csv')}
                        className="border-lacra-orange text-lacra-orange hover:bg-orange-50"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button 
                        onClick={() => handleDownloadExportReport('detailed')}
                        className="bg-lacra-orange hover:bg-orange-700"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Full Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Unable to load export data. Please try again.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
