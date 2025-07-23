import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Shield, MapPin, Clock, CheckCircle, XCircle, AlertTriangle, FileText, Download, QrCode, Leaf, Eye, Star } from "lucide-react";
import QRCodeLib from "qrcode";

interface TrackingRecord {
  id: number;
  trackingNumber: string;
  certificateId: number;
  commodityId: number;
  farmerId?: number;
  currentStatus: string;
  eudrCompliant: boolean;
  deforestationRisk?: string;
  sustainabilityScore?: number;
  supplyChainSteps?: any[];
  originCoordinates?: string;
  currentLocation?: string;
  destinationCountry?: string;
  qrCodeData?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TrackingTimeline {
  id: number;
  trackingRecordId: number;
  eventType: string;
  eventDescription: string;
  eventLocation?: string;
  eventCoordinates?: string;
  performedBy: string;
  officerName?: string;
  officerRole?: string;
  department?: string;
  complianceChecked: boolean;
  complianceStatus?: string;
  eudrVerified: boolean;
  timestamp: Date;
}

interface TrackingVerification {
  id: number;
  trackingRecordId: number;
  verificationType: string;
  verificationMethod: string;
  verifiedBy: string;
  verificationDate: Date;
  verificationResult: string;
  confidence?: number;
  deforestationCheck: boolean;
  legalityVerified: boolean;
  sustainabilityVerified: boolean;
  traceabilityVerified: boolean;
  notes?: string;
}

interface TrackingAlert {
  id: number;
  trackingRecordId: number;
  alertType: string;
  severity: string;
  title: string;
  message: string;
  status: string;
  actionRequired: boolean;
  actionDeadline?: Date;
  createdAt: Date;
}

interface VerificationResult {
  valid: boolean;
  record: TrackingRecord | null;
  timeline: TrackingTimeline[];
  verifications: TrackingVerification[];
  alerts: TrackingAlert[];
  eudrCompliant: boolean;
  sustainabilityScore?: number;
}

export default function Verification() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const qrCodeRef = useRef<HTMLCanvasElement>(null);

  // Get all tracking records for admin view
  const { data: trackingRecords = [], isLoading: loadingRecords } = useQuery<TrackingRecord[]>({
    queryKey: ["/api/tracking-records"],
    enabled: true,
  });

  const verifyMutation = useMutation({
    mutationFn: async (trackingNum: string) => {
      const response = await fetch(`/api/tracking/verify/${encodeURIComponent(trackingNum)}`);
      if (!response.ok) {
        throw new Error('Failed to verify tracking number');
      }
      return await response.json();
    },
    onSuccess: (data: VerificationResult) => {
      setVerificationResult(data);
      if (data.valid) {
        toast({
          title: "Verification Successful",
          description: `Certificate ${data.record?.trackingNumber} verified successfully.`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "The tracking number is invalid or not found.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Verification Error",
        description: "Unable to verify tracking number. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleVerification = () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Tracking Number Required",
        description: "Please enter a tracking number to verify.",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate(trackingNumber.trim());
  };

  const handleDownloadReport = () => {
    if (!verificationResult?.record) return;
    
    // Generate and download verification report
    const reportData = {
      trackingNumber: verificationResult.record.trackingNumber,
      verificationDate: new Date().toISOString(),
      eudrCompliant: verificationResult.eudrCompliant,
      sustainabilityScore: verificationResult.sustainabilityScore,
      deforestationRisk: verificationResult.record.deforestationRisk,
      timeline: verificationResult.timeline,
      verifications: verificationResult.verifications,
      alerts: verificationResult.alerts
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verification-report-${verificationResult.record.trackingNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Verification report has been downloaded successfully.",
    });
  };

  const generateQRCodeData = (trackingNumber: string) => {
    return `https://lacra.gov.lr/verify/${trackingNumber}`;
  };

  // Generate QR code when showing QR dialog
  useEffect(() => {
    if (showQRCode && verificationResult?.record) {
      const generateQRCode = async () => {
        try {
          const qrData = generateQRCodeData(verificationResult.record.trackingNumber);
          const dataURL = await QRCodeLib.toDataURL(qrData, {
            errorCorrectionLevel: 'M',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            },
            width: 256
          });
          setQRCodeDataURL(dataURL);
        } catch (error) {
          console.error('Error generating QR code:', error);
          toast({
            title: "QR Code Error",
            description: "Failed to generate QR code",
            variant: "destructive",
          });
        }
      };
      generateQRCode();
    }
  }, [showQRCode, verificationResult]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "suspended": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "low": return <Shield className="h-4 w-4 text-green-600" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "high": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "critical": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Shield className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatSustainabilityScore = (score: number) => {
    if (score >= 90) return { color: "text-green-600", label: "Excellent" };
    if (score >= 75) return { color: "text-blue-600", label: "Good" };
    if (score >= 60) return { color: "text-yellow-600", label: "Fair" };
    return { color: "text-red-600", label: "Poor" };
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificate Verification</h1>
          <p className="text-gray-600 mt-2">
            Verify agricultural commodity certificates and track their complete supply chain journey
          </p>
        </div>
      </div>

      <Tabs defaultValue="verify" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verify">Verify Certificate</TabsTrigger>
          <TabsTrigger value="records">All Tracking Records</TabsTrigger>
        </TabsList>

        {/* Verification Tab */}
        <TabsContent value="verify" className="space-y-6">
          {/* Verification Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Enter Tracking Number
              </CardTitle>
              <CardDescription>
                Enter the tracking number from your certificate to verify its authenticity and view complete traceability information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="tracking-number">Tracking Number</Label>
                  <Input
                    id="tracking-number"
                    placeholder="e.g., TRK-2024-001-LR"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleVerification} 
                    disabled={verifyMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {verifyMutation.isPending ? "Verifying..." : "Verify Certificate"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Results */}
          {verificationResult && (
            <div className="space-y-6">
              {verificationResult.valid && verificationResult.record ? (
                <>
                  {/* Certificate Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Certificate Verified
                      </CardTitle>
                      <CardDescription>
                        This certificate is authentic and issued by LACRA
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">CERTIFICATE DETAILS</h4>
                          <div className="space-y-2">
                            <p><strong>Tracking Number:</strong> {verificationResult.record.trackingNumber}</p>
                            <p><strong>Status:</strong> 
                              <Badge className={`ml-2 ${getStatusColor(verificationResult.record.currentStatus)}`}>
                                {verificationResult.record.currentStatus}
                              </Badge>
                            </p>
                            <p><strong>Destination:</strong> {verificationResult.record.destinationCountry || "Not specified"}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">EUDR COMPLIANCE</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <strong>Compliant:</strong>
                              {verificationResult.record.eudrCompliant ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Yes
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">
                                  <XCircle className="h-3 w-3 mr-1" /> No
                                </Badge>
                              )}
                            </div>
                            <p><strong>Deforestation Risk:</strong>
                              <Badge className={`ml-2 ${getRiskColor(verificationResult.record.deforestationRisk || "unknown")}`}>
                                {verificationResult.record.deforestationRisk || "Unknown"}
                              </Badge>
                            </p>
                            {verificationResult.sustainabilityScore && (
                              <div className="flex items-center gap-2">
                                <strong>Sustainability Score:</strong>
                                <div className={`flex items-center gap-1 ${formatSustainabilityScore(verificationResult.sustainabilityScore).color}`}>
                                  <Star className="h-4 w-4" />
                                  {verificationResult.sustainabilityScore}% 
                                  ({formatSustainabilityScore(verificationResult.sustainabilityScore).label})
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm text-gray-600 mb-2">LOCATION</h4>
                          <div className="space-y-2">
                            {verificationResult.record.originCoordinates && (
                              <p><strong>Origin:</strong> {verificationResult.record.originCoordinates}</p>
                            )}
                            {verificationResult.record.currentLocation && (
                              <p><strong>Current Location:</strong> {verificationResult.record.currentLocation}</p>
                            )}
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" onClick={() => setShowQRCode(true)}>
                                <QrCode className="h-4 w-4 mr-1" />
                                QR Code
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleDownloadReport}>
                                <Download className="h-4 w-4 mr-1" />
                                Download Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Alerts */}
                  {verificationResult.alerts.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600">
                          <AlertTriangle className="h-5 w-5" />
                          Active Alerts ({verificationResult.alerts.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {verificationResult.alerts.map((alert) => (
                            <Alert key={alert.id} className="border-orange-200">
                              <div className="flex items-start gap-3">
                                {getSeverityIcon(alert.severity)}
                                <div className="flex-1">
                                  <AlertTitle className="text-sm">{alert.title}</AlertTitle>
                                  <AlertDescription className="text-sm">
                                    {alert.message}
                                    {alert.actionRequired && (
                                      <Badge className="ml-2 bg-red-100 text-red-800">Action Required</Badge>
                                    )}
                                  </AlertDescription>
                                </div>
                                <Badge className={`${getRiskColor(alert.severity)}`}>
                                  {alert.severity}
                                </Badge>
                              </div>
                            </Alert>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Supply Chain Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Supply Chain Timeline
                      </CardTitle>
                      <CardDescription>
                        Complete traceability from farm to export
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {verificationResult.timeline.length > 0 ? (
                        <div className="space-y-4">
                          {verificationResult.timeline.map((event, index) => (
                            <div key={event.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full ${
                                  event.complianceStatus === "compliant" ? "bg-green-500" :
                                  event.complianceStatus === "non_compliant" ? "bg-red-500" :
                                  "bg-yellow-500"
                                }`} />
                                {index < verificationResult.timeline.length - 1 && (
                                  <div className="w-px h-12 bg-gray-300 mt-2" />
                                )}
                              </div>
                              <div className="flex-1 pb-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{event.eventDescription}</h4>
                                  <Badge variant="outline">{event.eventType}</Badge>
                                  {event.eudrVerified && (
                                    <Badge className="bg-green-100 text-green-800">
                                      <Leaf className="h-3 w-3 mr-1" /> EUDR Verified
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {event.eventLocation && `📍 ${event.eventLocation} • `}
                                  {event.officerName && `👤 ${event.officerName} • `}
                                  📅 {new Date(event.timestamp).toLocaleString()}
                                </p>
                                {event.complianceChecked && (
                                  <Badge className={`mt-2 ${getStatusColor(event.complianceStatus || "pending")}`}>
                                    Compliance: {event.complianceStatus || "pending"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-8">No timeline events recorded</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Verification Details */}
                  {verificationResult.verifications.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Verification Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Type</TableHead>
                              <TableHead>Method</TableHead>
                              <TableHead>Result</TableHead>
                              <TableHead>EUDR Checks</TableHead>
                              <TableHead>Verified By</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {verificationResult.verifications.map((verification) => (
                              <TableRow key={verification.id}>
                                <TableCell>{verification.verificationType}</TableCell>
                                <TableCell>{verification.verificationMethod}</TableCell>
                                <TableCell>
                                  <Badge className={
                                    verification.verificationResult === "passed" ? "bg-green-100 text-green-800" :
                                    verification.verificationResult === "failed" ? "bg-red-100 text-red-800" :
                                    "bg-yellow-100 text-yellow-800"
                                  }>
                                    {verification.verificationResult}
                                    {verification.confidence && ` (${verification.confidence}%)`}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    {verification.deforestationCheck && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">Deforestation</Badge>
                                    )}
                                    {verification.legalityVerified && (
                                      <Badge className="bg-blue-100 text-blue-800 text-xs">Legal</Badge>
                                    )}
                                    {verification.sustainabilityVerified && (
                                      <Badge className="bg-purple-100 text-purple-800 text-xs">Sustainable</Badge>
                                    )}
                                    {verification.traceabilityVerified && (
                                      <Badge className="bg-orange-100 text-orange-800 text-xs">Traceable</Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>{verification.verifiedBy}</TableCell>
                                <TableCell>{new Date(verification.verificationDate).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-600 mb-2">Certificate Not Found</h3>
                    <p className="text-gray-600">
                      The tracking number "{trackingNumber}" is not valid or the certificate does not exist in our system.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* All Records Tab */}
        <TabsContent value="records" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Tracking Records</CardTitle>
              <CardDescription>
                Complete list of all certificate tracking records in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingRecords ? (
                <div className="text-center py-8">Loading tracking records...</div>
              ) : trackingRecords.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>EUDR Compliant</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Sustainability Score</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trackingRecords.map((record: TrackingRecord) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">{record.trackingNumber}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(record.currentStatus)}>
                            {record.currentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.eudrCompliant ? (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" /> Yes
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <XCircle className="h-3 w-3 mr-1" /> No
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskColor(record.deforestationRisk || "unknown")}>
                            {record.deforestationRisk || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.sustainabilityScore ? (
                            <div className={`flex items-center gap-1 ${formatSustainabilityScore(record.sustainabilityScore).color}`}>
                              <Star className="h-4 w-4" />
                              {record.sustainabilityScore}%
                            </div>
                          ) : (
                            "Not scored"
                          )}
                        </TableCell>
                        <TableCell>{record.destinationCountry || "Not specified"}</TableCell>
                        <TableCell>{new Date(record.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setTrackingNumber(record.trackingNumber);
                              verifyMutation.mutate(record.trackingNumber);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tracking records found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Certificate QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to verify the certificate on mobile devices
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
              {qrCodeDataURL ? (
                <img 
                  src={qrCodeDataURL} 
                  alt="QR Code for verification" 
                  className="w-48 h-48 rounded"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center rounded">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Generating QR Code...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center space-y-2">
              <p className="font-medium text-sm">
                Tracking: {verificationResult?.record?.trackingNumber}
              </p>
              <p className="text-xs text-gray-600 break-all px-4">
                URL: {verificationResult?.record ? generateQRCodeData(verificationResult.record.trackingNumber) : ''}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  if (verificationResult?.record) {
                    navigator.clipboard.writeText(generateQRCodeData(verificationResult.record.trackingNumber));
                    toast({
                      title: "URL Copied",
                      description: "Verification URL copied to clipboard",
                    });
                  }
                }}
              >
                Copy URL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}