import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Award, Download, Eye, FileText, PrinterIcon, TreePine, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Certification, Commodity } from "@shared/schema";
import ComprehensiveDeforestationReportComponent from "@/components/reports/comprehensive-deforestation-report";
import ComprehensiveEUDRReportComponent from "@/components/reports/comprehensive-eudr-report";
import ComprehensiveFarmerInfoPageComponent from "@/components/reports/comprehensive-farmer-info-page";
import { downloadComprehensiveDeforestationReport, downloadComprehensiveEUDRReport, downloadComprehensiveFarmerProfile } from "@/lib/simple-pdf-generator";

export default function Certifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [reportType, setReportType] = useState<'deforestation' | 'eudr' | 'farmer-info' | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for comprehensive reports
  const mockDeforestationData = {
    farmerId: "F001",
    farmerName: "Demo Farmer",
    county: "Montserrado",
    farmSize: 12.5,
    farmSizeUnit: "hectares",
    gpsCoordinates: "6.3156° N, 10.7074° W",
    analysisDate: "2025-08-12",
    reportId: "DFR-001-2025",
    forestLossDetected: false,
    forestLossDate: null,
    forestCoverChange: 2.3,
    baselineForestCover: 35.2,
    currentForestCover: 37.5,
    deforestationRate: 0.05,
    biodiversityImpact: 'minimal' as const,
    speciesAtRisk: [],
    habitatFragmentation: 5.2,
    carbonStockLoss: 0.8,
    carbonEmissions: 1.2,
    carbonSequestrationPotential: 15.6,
    soilErosionRisk: 'low' as const,
    waterResourceImpact: 'minimal' as const,
    climateChangeContribution: 2.1,
    legalComplianceStatus: 'compliant' as const,
    permitsRequired: ['Environmental Impact Assessment', 'Land Use Permit'],
    violationsDetected: [],
    mitigationRequired: false,
    recommendedActions: [
      'Continue sustainable farming practices',
      'Monitor forest boundaries quarterly',
      'Implement additional carbon sequestration methods'
    ],
    reforestationPlan: 'Maintain current forest cover and implement agroforestry practices in designated areas to enhance carbon sequestration and biodiversity conservation.',
    timelineForCompliance: 'N/A - Currently compliant',
    satelliteImageryDate: '2025-08-10',
    monitoringFrequency: 'Quarterly',
    nextAssessmentDate: '2025-11-12'
  };

  const mockEUDRData = {
    farmerId: "F001",
    farmerName: "Demo Farmer", 
    county: "Montserrado",
    farmSize: 12.5,
    farmSizeUnit: "hectares",
    gpsCoordinates: "6.3156° N, 10.7074° W",
    assessmentDate: "2025-08-12",
    reportId: "EUDR-001-2025",
    riskLevel: 'low' as const,
    complianceScore: 92,
    complianceStatus: 'compliant' as const,
    dueDiligenceScore: 95,
    informationGathered: true,
    riskAssessmentCompleted: true,
    mitigationMeasuresImplemented: true,
    deforestationRisk: 3,
    lastForestDate: "2025-08-10",
    forestCoverBaseline: 35.2,
    currentForestCover: 37.5,
    deforestationAfter2020: false,
    legalHarvesting: true,
    relevantLegislationCompliance: [
      'Liberian Forestry Development Authority Act',
      'Environmental Protection Agency Act', 
      'Community Rights Law'
    ],
    humanRightsCompliance: true,
    indigenousRightsRespected: true,
    supplyChainTransparency: 88,
    traceabilityScore: 91,
    documentationComplete: true,
    thirdPartyVerification: true,
    mitigationPlan: [
      'Continue quarterly forest monitoring',
      'Maintain documentation standards',
      'Regular stakeholder engagement'
    ],
    monitoringSystem: 'Satellite-based monitoring with quarterly ground-truth validation and continuous stakeholder engagement protocols',
    correctiveActions: [],
    geolocationVerified: true,
    satelliteMonitoringActive: true,
    stakeholderConsultation: true
  };

  const mockFarmerData = {
    farmerId: "F001",
    firstName: "Demo",
    lastName: "Farmer",
    phoneNumber: "+231-XXX-XXXX",
    email: "demo.farmer@example.com",
    idNumber: "LIB123456789",
    county: "Montserrado",
    district: "Greater Monrovia",
    village: "Paynesville",
    gpsCoordinates: "6.3156° N, 10.7074° W",
    farmSize: 12.5,
    farmSizeUnit: "hectares",
    totalPlots: 3,
    cultivatedArea: 9.2,
    fallowArea: 3.3,
    registrationDate: "2024-03-15",
    lastUpdated: "2025-08-12",
    agreementSigned: true,
    registrationStatus: 'active' as const,
    complianceScore: 92,
    certifications: ['EUDR Compliant', 'Sustainable Agriculture', 'Organic Transition'],
    inspectionHistory: [
      {
        date: "2025-07-15",
        type: "Environmental Compliance",
        result: 'passed' as const,
        notes: "Excellent forest conservation practices"
      },
      {
        date: "2025-06-10", 
        type: "Quality Assurance",
        result: 'passed' as const,
        notes: "High quality cocoa production standards maintained"
      }
    ],
    annualProduction: 850,
    productionUnit: "kg",
    yieldPerHectare: 92.4,
    qualityRating: 4.2,
    estimatedFarmValue: 45000,
    annualIncome: 12500,
    cooperativeMembership: "Montserrado Farmers Cooperative",
    environmentalScore: 88,
    sustainablePractices: [
      'Agroforestry implementation',
      'Water conservation techniques',
      'Organic pest management',
      'Soil erosion prevention',
      'Carbon sequestration practices'
    ],
    forestCoverPercent: 37.5,
    carbonFootprint: 1.2,
    waterUsage: 2400,
    primaryCrops: ['Cocoa', 'Coffee'],
    secondaryCrops: ['Plantain', 'Cassava'],
    farmingMethods: ['Sustainable Agriculture', 'Agroforestry', 'Organic Practices'],
    irrigationSystems: ['Drip Irrigation', 'Rainwater Harvesting'],
    soilType: 'Clay Loam',
    technologyAdoption: ['GPS Mapping', 'Soil Testing', 'Weather Monitoring'],
    equipmentOwned: ['Hand Tools', 'Solar Dryer', 'Processing Equipment'],
    internetAccess: true,
    smartphoneOwner: true,
    employeesHired: 3,
    communityInvolvement: ['Farmers Association', 'Youth Training Program'],
    trainingCompleted: ['Sustainable Agriculture', 'EUDR Compliance', 'Financial Literacy'],
    reportsGenerated: [
      {
        type: 'deforestation' as const,
        date: "2025-08-12",
        status: 'completed' as const,
        id: "DFR-001-2025"
      },
      {
        type: 'eudr' as const, 
        date: "2025-08-12",
        status: 'completed' as const,
        id: "EUDR-001-2025"
      }
    ]
  };

  const { data: certifications = [], isLoading: certificationsLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  const { data: commodities = [], isLoading: commoditiesLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const isLoading = certificationsLoading || commoditiesLoading;

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 mb-2" />
          <Skeleton className="h-3 sm:h-4 w-64 sm:w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 sm:h-6 w-32 sm:w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 sm:h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combine certification and commodity data
  const certificationsWithCommodities = certifications.map(certification => {
    const commodity = commodities.find(c => c.id === certification.commodityId);
    return {
      ...certification,
      commodity
    };
  });

  const filteredCertifications = certificationsWithCommodities.filter(certification => {
    const matchesSearch = certification.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certification.exporterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certification.commodity?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || certification.status === statusFilter;
    const matchesType = typeFilter === "all" || certification.certificateType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'text-success bg-success',
      expired: 'text-warning bg-warning',
      revoked: 'text-error bg-error'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-400'} bg-opacity-10 text-xs font-medium rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      export: 'border-lacra-blue text-lacra-blue',
      quality: 'border-lacra-green text-lacra-green',
      organic: 'border-lacra-orange text-lacra-orange'
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

  const isExpiringSoon = (expiryDate: Date) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  // Export certificate as PDF
  const handleExportCertificatePdf = (certification: any) => {
    const content = generateCertificateContent(certification);
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certification.certificateNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Certificate Downloaded",
      description: `Export certificate ${certification.certificateNumber} has been downloaded.`,
    });
  };

  // Export certificate data as CSV
  const handleExportCsv = (certification: any) => {
    let csvContent = "Export Certificate Information\n";
    csvContent += `Certificate Number,${certification.certificateNumber}\n`;
    csvContent += `Certificate Type,${certification.certificateType}\n`;
    csvContent += `Exporter Name,${certification.exporterName}\n`;
    csvContent += `Exporter License,${certification.exporterLicense}\n`;
    csvContent += `Commodity,${certification.commodity?.name || 'N/A'}\n`;
    csvContent += `Commodity Type,${certification.commodity?.type || 'N/A'}\n`;
    csvContent += `Quantity,${certification.quantity} ${certification.unit}\n`;
    csvContent += `Destination Country,${certification.destinationCountry}\n`;
    csvContent += `Destination Port,${certification.destinationPort}\n`;
    csvContent += `Issue Date,${new Date(certification.issuedDate).toLocaleDateString()}\n`;
    csvContent += `Expiry Date,${new Date(certification.expiryDate).toLocaleDateString()}\n`;
    csvContent += `Status,${certification.status}\n`;
    csvContent += `Certification Body,${certification.certificationBody}\n`;
    csvContent += `Inspection Date,${new Date(certification.inspectionDate).toLocaleDateString()}\n`;
    csvContent += `Notes,${certification.notes || 'N/A'}\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${certification.certificateNumber}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Certificate data exported as CSV file.",
    });
  };

  // Generate formatted certificate content
  const generateCertificateContent = (certification: any) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Export Certificate - ${certification.certificateNumber}</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 40px; background: #f9fafb; }
          .certificate { background: white; border: 3px solid #16a34a; max-width: 800px; margin: 0 auto; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #16a34a; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .title { color: #374151; font-size: 24px; margin: 15px 0; }
          .certificate-number { background: #16a34a; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; display: inline-block; margin: 15px 0; }
          .content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; font-size: 14px; }
          .value { color: #6b7280; margin-top: 4px; }
          .full-width { grid-column: 1 / -1; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .status { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .status.active { background: #dcfce7; color: #166534; }
          .status.expired { background: #fef3c7; color: #92400e; }
          .notes { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="header">
            <div class="logo">LIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY</div>
            <div class="title">EXPORT CERTIFICATE</div>
            <div class="certificate-number">${certification.certificateNumber}</div>
          </div>
          
          <div class="content">
            <div class="field">
              <div class="label">Certificate Type</div>
              <div class="value">${certification.certificateType.charAt(0).toUpperCase() + certification.certificateType.slice(1)} Certificate</div>
            </div>
            
            <div class="field">
              <div class="label">Status</div>
              <div class="value">
                <span class="status ${certification.status}">${certification.status.charAt(0).toUpperCase() + certification.status.slice(1)}</span>
              </div>
            </div>
            
            <div class="field">
              <div class="label">Exporter Name</div>
              <div class="value">${certification.exporterName}</div>
            </div>
            
            <div class="field">
              <div class="label">Exporter License</div>
              <div class="value">${certification.exporterLicense}</div>
            </div>
            
            <div class="field">
              <div class="label">Commodity</div>
              <div class="value">${certification.commodity?.name || 'N/A'}</div>
            </div>
            
            <div class="field">
              <div class="label">Commodity Type</div>
              <div class="value">${certification.commodity?.type || 'N/A'}</div>
            </div>
            
            <div class="field">
              <div class="label">Quantity</div>
              <div class="value">${certification.quantity} ${certification.unit}</div>
            </div>
            
            <div class="field">
              <div class="label">Quality Grade</div>
              <div class="value">${certification.commodity?.qualityGrade || 'N/A'}</div>
            </div>
            
            <div class="field">
              <div class="label">Destination Country</div>
              <div class="value">${certification.destinationCountry}</div>
            </div>
            
            <div class="field">
              <div class="label">Destination Port</div>
              <div class="value">${certification.destinationPort}</div>
            </div>
            
            <div class="field">
              <div class="label">Issue Date</div>
              <div class="value">${new Date(certification.issuedDate).toLocaleDateString()}</div>
            </div>
            
            <div class="field">
              <div class="label">Expiry Date</div>
              <div class="value">${new Date(certification.expiryDate).toLocaleDateString()}</div>
            </div>
            
            <div class="field">
              <div class="label">Inspection Date</div>
              <div class="value">${new Date(certification.inspectionDate).toLocaleDateString()}</div>
            </div>
            
            <div class="field">
              <div class="label">Certification Body</div>
              <div class="value">${certification.certificationBody}</div>
            </div>
          </div>
          
          ${certification.notes ? `
            <div class="notes full-width">
              <div class="label">Additional Notes</div>
              <div class="value">${certification.notes}</div>
            </div>
          ` : ''}
          
          <div class="footer">
            <p><strong>This certificate is issued by the Liberia Agriculture Commodity Regulatory Authority (LACRA)</strong></p>
            <p>Certificate generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>For verification, contact LACRA at +231-XXX-XXXX or email verify@lacra.gov.lr</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Helmet>
          <title>Export Certifications - AgriTrace360™ LACRA</title>
          <meta name="description" content="Export certification tracking and management system for agricultural commodity compliance" />
        </Helmet>

        {/* Modern ISMS Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Award className="h-10 w-10 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Export Certifications
              </h1>
              <p className="text-slate-600 text-lg mt-1">
                Manage export certificates and track compliance documentation
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div></div>
            <Button className="bg-lacra-green hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Issue Certificate
            </Button>
          </div>
        </div>

        {/* Summary Cards - ISMS Style */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{certifications.length}</div>
            <p className="text-slate-600 font-medium">Total Certificates</p>
          </div>
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {certifications.filter(c => c.status === 'active').length}
            </div>
            <p className="text-slate-600 font-medium">Active</p>
          </div>
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-orange flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {certifications.filter(c => isExpiringSoon(c.expiryDate)).length}
            </div>
            <p className="text-slate-600 font-medium">Expiring Soon</p>
          </div>
          <div className="isms-card text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl isms-icon-bg-red flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {certifications.filter(c => c.status === 'expired' || c.status === 'revoked').length}
            </div>
            <p className="text-slate-600 font-medium">Expired/Revoked</p>
          </div>
        </div>

        {/* Filters Section - ISMS Style */}
        <div className="isms-card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl isms-icon-bg-slate flex items-center justify-center">
              <Search className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Search & Filter</h3>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="text-sm font-medium text-slate-700 mb-2 block">Search Certificates</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by certificate number, exporter, or commodity..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
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
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Certifications Table - ISMS Style */}
        <div className="isms-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Export Certificates</h3>
              <p className="text-slate-600 text-sm">
                Showing {filteredCertifications.length} of {certifications.length} certificates
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Certificate Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Commodity</TableHead>
                  <TableHead>Exporter</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {certifications.length === 0 
                        ? "No certificates issued yet. Start by issuing your first export certificate."
                        : "No certificates match your current filters."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCertifications.map((certification) => (
                    <TableRow key={certification.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-mono text-sm font-medium">
                          {certification.certificateNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          Issued by {certification.issuedBy}
                        </div>
                      </TableCell>
                      <TableCell>{getTypeBadge(certification.certificateType)}</TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {certification.commodity?.name || 'Unknown Commodity'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certification.commodity?.batchNumber || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {certification.exporterName || 'Not specified'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {certification.exportDestination || 'Not specified'}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(certification.issuedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className={isExpiringSoon(certification.expiryDate) ? 'text-warning font-medium' : ''}>
                          {new Date(certification.expiryDate).toLocaleDateString()}
                        </div>
                        {isExpiringSoon(certification.expiryDate) && (
                          <div className="text-xs text-warning">Expires soon</div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(certification.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-blue hover:text-blue-700"
                            onClick={() => {
                              setSelectedCertificate(certification);
                              setIsPreviewOpen(true);
                            }}
                            data-testid={`button-preview-${certification.id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700"
                            onClick={() => {
                              setReportType('deforestation');
                              setIsReportOpen(true);
                            }}
                            data-testid={`button-deforestation-${certification.id}`}
                          >
                            <TreePine className="h-4 w-4 mr-1" />
                            Deforestation
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setReportType('eudr');
                              setIsReportOpen(true);
                            }}
                            data-testid={`button-eudr-${certification.id}`}
                          >
                            <Shield className="h-4 w-4 mr-1" />
                            EUDR
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-purple-600 hover:text-purple-700"
                            onClick={() => {
                              setReportType('farmer-info');
                              setIsReportOpen(true);
                            }}
                            data-testid={`button-farmer-${certification.id}`}
                          >
                            <User className="h-4 w-4 mr-1" />
                            Farmer
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-green hover:text-green-700"
                            onClick={() => handleExportCertificatePdf(certification)}
                            data-testid={`button-pdf-${certification.id}`}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

      {/* Certificate Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certificate Preview - {selectedCertificate?.certificateNumber}</DialogTitle>
          </DialogHeader>
          {selectedCertificate && (
            <div className="space-y-6">
              {/* Certificate Header */}
              <div className="text-center border-b border-lacra-green pb-6">
                <div className="text-2xl font-bold text-lacra-green mb-2">
                  LIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY
                </div>
                <div className="text-xl font-semibold text-neutral mb-3">EXPORT CERTIFICATE</div>
                <div className="inline-block bg-lacra-green text-white px-4 py-2 rounded-lg font-bold">
                  {selectedCertificate.certificateNumber}
                </div>
              </div>

              {/* Certificate Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Certificate Type</label>
                    <div className="mt-1 text-gray-900">
                      {selectedCertificate.certificateType.charAt(0).toUpperCase() + selectedCertificate.certificateType.slice(1)} Certificate
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedCertificate.status)}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Exporter Name</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.exporterName}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Issued By</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.issuedBy}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Certificate Type</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.certificateType}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Export Destination</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.exportDestination || 'N/A'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.status}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Exporter</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.exporterName || 'N/A'}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Created Date</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.createdAt ? new Date(selectedCertificate.createdAt).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Issue Date</label>
                    <div className="mt-1 text-gray-900">{new Date(selectedCertificate.issuedDate).toLocaleDateString()}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                    <div className="mt-1 text-gray-900">{new Date(selectedCertificate.expiryDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Certificate Number</label>
                  <div className="mt-1 text-gray-900">{selectedCertificate.certificateNumber}</div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => handleExportCsv(selectedCertificate)}
                  className="text-lacra-orange border-lacra-orange hover:bg-lacra-orange hover:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button 
                  onClick={() => handleExportCertificatePdf(selectedCertificate)}
                  className="bg-lacra-green hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                <p className="font-semibold">This certificate is issued by the Liberia Agriculture Commodity Regulatory Authority (LACRA)</p>
                <p>For verification, contact LACRA at +231-XXX-XXXX or email verify@lacra.gov.lr</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comprehensive Reports Dialog */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {reportType === 'deforestation' && (
                <>
                  <TreePine className="h-5 w-5 text-green-600" />
                  Comprehensive Deforestation Analysis Report
                </>
              )}
              {reportType === 'eudr' && (
                <>
                  <Shield className="h-5 w-5 text-blue-600" />
                  Comprehensive EUDR Compliance Report
                </>
              )}
              {reportType === 'farmer-info' && (
                <>
                  <User className="h-5 w-5 text-purple-600" />
                  Comprehensive Farmer Information Page
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {reportType === 'deforestation' && (
              <ComprehensiveDeforestationReportComponent data={mockDeforestationData} />
            )}
            {reportType === 'eudr' && (
              <ComprehensiveEUDRReportComponent data={mockEUDRData} />
            )}
            {reportType === 'farmer-info' && (
              <ComprehensiveFarmerInfoPageComponent data={mockFarmerData} />
            )}
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                if (reportType === 'deforestation') {
                  downloadComprehensiveDeforestationReport(mockDeforestationData.farmerId);
                } else if (reportType === 'eudr') {
                  downloadComprehensiveEUDRReport(mockEUDRData.farmerId);
                } else if (reportType === 'farmer-info') {
                  downloadComprehensiveFarmerProfile(mockFarmerData.farmerId);
                }
                toast({
                  title: "Report Downloaded",
                  description: `${reportType === 'deforestation' ? 'Deforestation Analysis' : reportType === 'eudr' ? 'EUDR Compliance' : 'Farmer Information'} report has been downloaded as PDF.`,
                });
              }}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              data-testid="button-download-report"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={() => setIsReportOpen(false)}
              className="bg-slate-600 hover:bg-slate-700"
              data-testid="button-close-report"
            >
              Close Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      </div>
    </div>
  );
}
