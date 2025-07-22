import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Shield, CheckCircle, XCircle, AlertTriangle, Download, FileText, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Certification, Commodity, Report } from "@shared/schema";

export default function Verification() {
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const { data: certifications = [] } = useQuery<Certification[]>({
    queryKey: ["/api/certifications"],
  });

  const { data: commodities = [] } = useQuery<Commodity[]>({
    queryKey: ["/api/commodities"],
  });

  const { data: reports = [] } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const handleVerification = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a certificate number, batch code, or reference number.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setHasSearched(true);
    
    // Simulate API delay for real-time verification
    await new Promise(resolve => setTimeout(resolve, 1500));

    const query = searchQuery.trim().toUpperCase();
    
    // Search in certifications
    const foundCertification = certifications.find(cert => 
      cert.certificateNumber?.toUpperCase() === query ||
      cert.exporterName?.toUpperCase() === query
    );

    // Search in commodities by batch number
    const foundCommodity = commodities.find(commodity => 
      commodity.batchNumber?.toUpperCase() === query
    );

    // Search in reports
    const foundReport = reports.find(report => 
      report.reportId?.toUpperCase() === query
    );

    let result = null;

    if (foundCertification) {
      const relatedCommodity = commodities.find(c => c.id === foundCertification.commodityId);
      result = {
        type: 'certificate',
        status: 'valid',
        data: {
          ...foundCertification,
          commodity: relatedCommodity
        },
        verifiedAt: new Date(),
        documentType: foundCertification.certificateType === 'export' ? 'Export Certificate' : 'Quality Certificate'
      };
    } else if (foundCommodity) {
      result = {
        type: 'commodity',
        status: 'valid',
        data: foundCommodity,
        verifiedAt: new Date(),
        documentType: 'Commodity Registration'
      };
    } else if (foundReport) {
      result = {
        type: 'report',
        status: 'valid',
        data: foundReport,
        verifiedAt: new Date(),
        documentType: 'Official Report'
      };
    } else {
      result = {
        type: 'not_found',
        status: 'invalid',
        data: null,
        verifiedAt: new Date(),
        documentType: 'Unknown'
      };
    }

    setVerificationResult(result);
    setIsVerifying(false);

    if (result.status === 'valid') {
      toast({
        title: "Document Verified",
        description: `${result.documentType} has been successfully verified.`,
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "No document found with the provided reference number.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'invalid':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'expired':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      default:
        return <Shield className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'text-green-700 bg-green-100',
      expired: 'text-yellow-700 bg-yellow-100',
      revoked: 'text-red-700 bg-red-100',
      pending: 'text-blue-700 bg-blue-100'
    };
    
    return (
      <Badge className={`${colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100'} text-xs font-medium rounded-full`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const downloadVerificationReport = () => {
    if (!verificationResult || verificationResult.status !== 'valid') return;

    const content = generateVerificationReport(verificationResult);
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-report-${searchQuery}-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Verification Report Downloaded",
      description: "Official verification report has been downloaded.",
    });
  };

  const generateVerificationReport = (result: any) => {
    const { data, verifiedAt, documentType } = result;
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Verification Report - LACRA</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 40px; background: #f9fafb; }
          .report { background: white; border: 3px solid #16a34a; max-width: 800px; margin: 0 auto; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #16a34a; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .title { color: #374151; font-size: 24px; margin: 15px 0; }
          .verified-badge { background: #16a34a; color: white; padding: 8px 16px; border-radius: 6px; font-weight: bold; display: inline-block; margin: 15px 0; }
          .content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #374151; font-size: 14px; }
          .value { color: #6b7280; margin-top: 4px; }
          .full-width { grid-column: 1 / -1; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .status { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
          .status.verified { background: #dcfce7; color: #166534; }
          .verification-details { background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9; }
        </style>
      </head>
      <body>
        <div class="report">
          <div class="header">
            <div class="logo">LIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY</div>
            <div class="title">DOCUMENT VERIFICATION REPORT</div>
            <div class="verified-badge">✓ VERIFIED AUTHENTIC</div>
          </div>
          
          <div class="verification-details">
            <h3 style="margin-top: 0; color: #0ea5e9;">Verification Details</h3>
            <p><strong>Search Query:</strong> ${searchQuery}</p>
            <p><strong>Document Type:</strong> ${documentType}</p>
            <p><strong>Verification Date:</strong> ${verifiedAt.toLocaleString()}</p>
            <p><strong>Status:</strong> <span class="status verified">VERIFIED AUTHENTIC</span></p>
          </div>
          
          <div class="content">
            ${result.type === 'certificate' ? `
              <div class="field">
                <div class="label">Certificate Number</div>
                <div class="value">${data.certificateNumber}</div>
              </div>
              <div class="field">
                <div class="label">Certificate Type</div>
                <div class="value">${data.certificateType.charAt(0).toUpperCase() + data.certificateType.slice(1)}</div>
              </div>
              <div class="field">
                <div class="label">Exporter Name</div>
                <div class="value">${data.exporterName}</div>
              </div>
              <div class="field">
                <div class="label">Commodity</div>
                <div class="value">${data.commodity?.name || 'N/A'}</div>
              </div>
              <div class="field">
                <div class="label">Issue Date</div>
                <div class="value">${new Date(data.issuedDate).toLocaleDateString()}</div>
              </div>
              <div class="field">
                <div class="label">Expiry Date</div>
                <div class="value">${new Date(data.expiryDate).toLocaleDateString()}</div>
              </div>
              <div class="field">
                <div class="label">Status</div>
                <div class="value">${data.status}</div>
              </div>
              <div class="field">
                <div class="label">Certification Body</div>
                <div class="value">${data.certificationBody}</div>
              </div>
            ` : result.type === 'commodity' ? `
              <div class="field">
                <div class="label">Batch Number</div>
                <div class="value">${data.batchNumber}</div>
              </div>
              <div class="field">
                <div class="label">Commodity Name</div>
                <div class="value">${data.name}</div>
              </div>
              <div class="field">
                <div class="label">Type</div>
                <div class="value">${data.type}</div>
              </div>
              <div class="field">
                <div class="label">Quality Grade</div>
                <div class="value">${data.qualityGrade}</div>
              </div>
              <div class="field">
                <div class="label">County</div>
                <div class="value">${data.county}</div>
              </div>
              <div class="field">
                <div class="label">Quantity</div>
                <div class="value">${data.quantity} ${data.unit}</div>
              </div>
              <div class="field">
                <div class="label">Status</div>
                <div class="value">${data.status}</div>
              </div>
              <div class="field">
                <div class="label">Registration Date</div>
                <div class="value">${new Date(data.createdAt).toLocaleDateString()}</div>
              </div>
            ` : `
              <div class="field">
                <div class="label">Report ID</div>
                <div class="value">${data.reportId}</div>
              </div>
              <div class="field">
                <div class="label">Title</div>
                <div class="value">${data.title}</div>
              </div>
              <div class="field">
                <div class="label">Department</div>
                <div class="value">${data.department}</div>
              </div>
              <div class="field">
                <div class="label">Date Range</div>
                <div class="value">${data.dateRange}</div>
              </div>
            `}
          </div>
          
          <div class="footer">
            <p><strong>This verification report is issued by the Liberia Agriculture Commodity Regulatory Authority (LACRA)</strong></p>
            <p>Report generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>For additional verification, contact LACRA at +231-XXX-XXXX or email verify@lacra.gov.lr</p>
            <p><em>This document serves as official proof of verification for the referenced document.</em></p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <div className="p-6">
      <Helmet>
        <title>Document Verification - AgriTrace360™ LACRA</title>
        <meta name="description" content="Real-time verification system for agricultural certificates, commodities, and official documents" />
      </Helmet>

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-lacra-green" />
          <h2 className="text-2xl font-bold text-neutral">Document Verification System</h2>
        </div>
        <p className="text-gray-600">Verify the authenticity of certificates, commodities, and official documents in real-time</p>
      </div>

      {/* Verification Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral flex items-center gap-2">
            <Search className="h-5 w-5" />
            Enter Document Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Certificate Number, Batch Code, or Reference Number
              </label>
              <Input
                type="text"
                placeholder="e.g., EXP-CERT-2024-001, COF-2024-001, RPT-2024-001"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter any certificate number, commodity batch code, or document reference number to verify its authenticity
              </p>
            </div>
            
            <Button 
              onClick={handleVerification} 
              disabled={isVerifying || !searchQuery.trim()}
              className="bg-lacra-green hover:bg-green-700 text-white"
            >
              {isVerifying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results */}
      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-neutral flex items-center gap-2">
              {getStatusIcon(verificationResult?.status || 'unknown')}
              Verification Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isVerifying ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : verificationResult ? (
              <div className="space-y-6">
                {verificationResult.status === 'valid' ? (
                  <>
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>Document Verified Successfully</strong> - This {verificationResult.documentType.toLowerCase()} is authentic and issued by LACRA.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Document Type</label>
                          <div className="mt-1 text-gray-900">{verificationResult.documentType}</div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Verification Status</label>
                          <div className="mt-1">
                            <Badge className="bg-green-100 text-green-800 text-sm">✓ VERIFIED AUTHENTIC</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Verified On</label>
                          <div className="mt-1 text-gray-900">{verificationResult.verifiedAt.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {verificationResult.type === 'certificate' && (
                          <>
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Certificate Number</label>
                              <div className="mt-1 text-gray-900 font-mono">{verificationResult.data.certificateNumber}</div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Exporter</label>
                              <div className="mt-1 text-gray-900">{verificationResult.data.exporterName}</div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Status</label>
                              <div className="mt-1">{getStatusBadge(verificationResult.data.status)}</div>
                            </div>
                          </>
                        )}

                        {verificationResult.type === 'commodity' && (
                          <>
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Batch Number</label>
                              <div className="mt-1 text-gray-900 font-mono">{verificationResult.data.batchNumber}</div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Commodity</label>
                              <div className="mt-1 text-gray-900">{verificationResult.data.name}</div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Quality Grade</label>
                              <div className="mt-1 text-gray-900">{verificationResult.data.qualityGrade}</div>
                            </div>
                          </>
                        )}

                        {verificationResult.type === 'report' && (
                          <>
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Report ID</label>
                              <div className="mt-1 text-gray-900 font-mono">{verificationResult.data.reportId}</div>
                            </div>
                            
                            <div>
                              <label className="text-sm font-semibold text-gray-700">Department</label>
                              <div className="mt-1 text-gray-900">{verificationResult.data.department}</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button 
                        onClick={downloadVerificationReport}
                        className="bg-lacra-blue hover:bg-blue-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Verification Report
                      </Button>
                      
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setVerificationResult(null);
                          setHasSearched(false);
                        }}
                        className="text-gray-600 border-gray-300"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Verify Another Document
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert className="border-red-200 bg-red-50">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        <strong>Document Not Found</strong> - No valid document found with reference number "{searchQuery}". Please check the number and try again.
                      </AlertDescription>
                    </Alert>

                    <div className="text-center py-6">
                      <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Document Not Verified</h3>
                      <p className="text-gray-600 mb-4">
                        The reference number you entered does not match any document in our system.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setVerificationResult(null);
                          setHasSearched(false);
                        }}
                        className="text-lacra-blue border-lacra-blue"
                      >
                        Try Different Reference Number
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Enter a reference number above and click "Verify Document" to check its authenticity.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Panel */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-neutral">How to Use the Verification System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-lacra-blue bg-opacity-10 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <FileText className="h-6 w-6 text-lacra-blue" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enter Reference</h3>
              <p className="text-sm text-gray-600">
                Enter any certificate number, batch code, or document reference number
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-lacra-green bg-opacity-10 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Shield className="h-6 w-6 text-lacra-green" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real-time Verification</h3>
              <p className="text-sm text-gray-600">
                System checks authenticity against official LACRA database
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-lacra-orange bg-opacity-10 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Download className="h-6 w-6 text-lacra-orange" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Official Report</h3>
              <p className="text-sm text-gray-600">
                Download official verification report for your records
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}