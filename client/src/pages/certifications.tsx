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
import { Search, Plus, Award, Download, Eye, FileText, PrinterIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Certification, Commodity } from "@shared/schema";

export default function Certifications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const { data: certifications = [], isLoading: certificationsLoading } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  const { data: commodities = [], isLoading: commoditiesLoading } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const isLoading = certificationsLoading || commoditiesLoading;

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
    <div className="p-6">
      <Helmet>
        <title>Export Certifications - AgriTrace360™ LACRA</title>
        <meta name="description" content="Export certification tracking and management system for agricultural commodity compliance" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-neutral mb-2">Export Certifications</h2>
            <p className="text-gray-600">Manage export certificates and track compliance documentation</p>
          </div>
          <Button className="bg-lacra-green hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Issue Certificate
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-neutral">{certifications.length}</div>
                <p className="text-sm text-gray-500">Total Certificates</p>
              </div>
              <Award className="h-8 w-8 text-lacra-blue" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-success">
              {certifications.filter(c => c.status === 'active').length}
            </div>
            <p className="text-sm text-gray-500">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-warning">
              {certifications.filter(c => isExpiringSoon(c.expiryDate)).length}
            </div>
            <p className="text-sm text-gray-500">Expiring Soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-error">
              {certifications.filter(c => c.status === 'expired' || c.status === 'revoked').length}
            </div>
            <p className="text-sm text-gray-500">Expired/Revoked</p>
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
        </CardContent>
      </Card>

      {/* Certifications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">
            Certificates ({filteredCertifications.length} of {certifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-blue hover:text-blue-700"
                            onClick={() => {
                              setSelectedCertificate(certification);
                              setIsPreviewOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-green hover:text-green-700"
                            onClick={() => handleExportCertificatePdf(certification)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-lacra-orange hover:text-orange-700"
                            onClick={() => handleExportCsv(certification)}
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
                    <label className="text-sm font-semibold text-gray-700">Exporter License</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.exporterLicense}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Commodity</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.commodity?.name || 'N/A'}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Commodity Type</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.commodity?.type || 'N/A'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Quantity</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.quantity} {selectedCertificate.unit}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Quality Grade</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.commodity?.qualityGrade || 'N/A'}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Destination Country</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.destinationCountry}</div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Destination Port</label>
                    <div className="mt-1 text-gray-900">{selectedCertificate.destinationPort}</div>
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
                  <label className="text-sm font-semibold text-gray-700">Inspection Date</label>
                  <div className="mt-1 text-gray-900">{new Date(selectedCertificate.inspectionDate).toLocaleDateString()}</div>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700">Certification Body</label>
                  <div className="mt-1 text-gray-900">{selectedCertificate.certificationBody}</div>
                </div>
                
                {selectedCertificate.notes && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-900">{selectedCertificate.notes}</div>
                  </div>
                )}
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
    </div>
  );
}
