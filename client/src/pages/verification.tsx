import React, { useState, useEffect, useRef } from "react";
import { Helmet } from 'react-helmet';
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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Shield, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Download, 
  QrCode, 
  Leaf, 
  Eye, 
  Star,
  Award,
  Truck,
  Globe,
  Zap,
  BarChart3 as BarChart,
  Users,
  Calendar,
  Map,
  Database,
  Loader2,
  Activity
} from "lucide-react";
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
  const [realTimeSimulation, setRealTimeSimulation] = useState(false);
  const [simulationData, setSimulationData] = useState({
    verificationsProcessed: 0,
    eudrComplianceRate: 0,
    activeCertificates: 0,
    pendingVerifications: 0,
    failedVerifications: 0,
    averageProcessingTime: 0,
    deforestationAlerts: 0,
    sustainabilityScores: [] as number[]
  });
  const [simulationLogs, setSimulationLogs] = useState<Array<{
    timestamp: string;
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
    certificateId?: string;
  }>>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const qrCodeRef = useRef<HTMLCanvasElement>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Real-time simulation system
  const startRealTimeSimulation = () => {
    setRealTimeSimulation(true);
    setSimulationLogs([{
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Real-time verification simulation started'
    }]);
    
    simulationIntervalRef.current = setInterval(() => {
      setSimulationData(prev => {
        const newData = {
          verificationsProcessed: prev.verificationsProcessed + Math.floor(Math.random() * 3) + 1,
          eudrComplianceRate: Math.round((85 + Math.random() * 13) * 10) / 10,
          activeCertificates: prev.activeCertificates + Math.floor(Math.random() * 2),
          pendingVerifications: Math.max(0, prev.pendingVerifications + Math.floor(Math.random() * 3) - 1),
          failedVerifications: prev.failedVerifications + (Math.random() > 0.85 ? 1 : 0),
          averageProcessingTime: Math.round((2.1 + Math.random() * 1.8) * 10) / 10,
          deforestationAlerts: prev.deforestationAlerts + (Math.random() > 0.92 ? 1 : 0),
          sustainabilityScores: [...prev.sustainabilityScores.slice(-9), Math.round((75 + Math.random() * 20) * 10) / 10]
        };
        
        // Add simulation log entry
        const logTypes = ['success', 'warning', 'info'] as const;
        const messages = [
          'Certificate COF-2025-0' + (Math.floor(Math.random() * 999) + 100) + ' verified successfully',
          'EUDR compliance check completed for Cocoa shipment',
          'GPS tracking verification: Origin coordinates confirmed',
          'Sustainability score calculated: ' + (75 + Math.random() * 20).toFixed(1) + '%',
          'Deforestation risk assessment: Low risk confirmed',
          'Supply chain transparency validated',
          'Quality certification verified for EU export',
          'Traceability timeline completed: Farm to port tracked'
        ];
        
        const newLog = {
          timestamp: new Date().toLocaleTimeString(),
          type: logTypes[Math.floor(Math.random() * logTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          certificateId: 'CERT-' + Math.floor(Math.random() * 10000)
        };
        
        setSimulationLogs(prev => [...prev.slice(-19), newLog]);
        
        return newData;
      });
    }, 2000);
  };
  
  const stopRealTimeSimulation = () => {
    setRealTimeSimulation(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
    setSimulationLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'Real-time verification simulation stopped'
    }]);
  };

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  // Generate QR code when showing QR dialog
  useEffect(() => {
    if (showQRCode && verificationResult?.record) {
      const generateQRCode = async () => {
        try {
          if (verificationResult.record) {
            const qrData = generateQRCodeData(verificationResult.record.trackingNumber);
            const dataURL = await QRCodeLib.toDataURL(qrData, {
              errorCorrectionLevel: 'M',
              margin: 1,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              },
              width: 256
            });
            setQRCodeDataURL(dataURL);
          }
        } catch (error) {

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
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>Certificate Verification System - AgriTrace360 LACRA</title>
        <meta name="description" content="Advanced certificate verification and agricultural compliance tracking system" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header Section - ISMS Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-blue flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Certificate Verification System</h1>
              <p className="text-slate-600 text-lg">Advanced agricultural compliance and supply chain verification</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Database className="h-4 w-4 mr-2" />
              Real-Time Verification
            </Badge>
          </div>
        </div>

        {/* Main Verification Dashboard - ISMS Style */}
        <div className="isms-card mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl isms-icon-bg-green flex items-center justify-center">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Certificate Verification Portal</h2>
              <p className="text-slate-600">Enter tracking numbers to verify certificates and access supply chain data</p>
            </div>
          </div>

          <Tabs defaultValue="verify" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-xl">
              <TabsTrigger value="verify" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Shield className="h-4 w-4 mr-2" />
                Verify Certificate
              </TabsTrigger>
              <TabsTrigger value="records" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <FileText className="h-4 w-4 mr-2" />
                Tracking Records
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <BarChart className="h-4 w-4 mr-2" />
                Real-Time Simulation
              </TabsTrigger>
            </TabsList>

            {/* Verification Tab - ISMS Style */}
            <TabsContent value="verify" className="space-y-6">
              {/* Verification Input - ISMS Style */}
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                    <Search className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Certificate Tracking Verification</h3>
                    <p className="text-slate-600">Enter tracking number to verify authenticity and access traceability data</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="tracking-number" className="text-slate-700 font-medium">Tracking Number</Label>
                    <Input
                      id="tracking-number"
                      placeholder="e.g., TRK-2024-001-LR"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleVerification()}
                      className="h-12 mt-2"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleVerification} 
                      disabled={verifyMutation.isPending}
                      className="isms-button h-12 px-6"
                    >
                      {verifyMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Verify Certificate
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Verification Results - ISMS Style */}
              {verificationResult && (
                <div className="space-y-6">
                  {verificationResult.valid && verificationResult.record ? (
                    <>
                      {/* Certificate Overview - ISMS Style */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-green-600 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-green-800">Certificate Verified Successfully</h3>
                            <p className="text-green-700">Tracking Number: {verificationResult.record.trackingNumber}</p>
                          </div>
                        </div>
                        
                        {/* Verification Metrics - ISMS Style */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg isms-icon-bg-green flex items-center justify-center">
                                <Award className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-slate-600 text-sm">Compliance Status</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                              {verificationResult.record.eudrCompliant ? '✓ Compliant' : '⚠ Pending'}
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg isms-icon-bg-blue flex items-center justify-center">
                                <Leaf className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-slate-600 text-sm">Sustainability Score</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">
                              {verificationResult.record.sustainabilityScore || 85}%
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg isms-icon-bg-purple flex items-center justify-center">
                                <MapPin className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-slate-600 text-sm">Current Status</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {verificationResult.record.currentStatus}
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg isms-icon-bg-yellow flex items-center justify-center">
                                <Globe className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-slate-600 text-sm">Destination</span>
                            </div>
                            <p className="text-lg font-bold text-slate-900">
                              {verificationResult.record.destinationCountry || 'In Transit'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Certificate Information - ISMS Style */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-50 rounded-xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg isms-icon-bg-blue flex items-center justify-center">
                              <FileText className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="font-bold text-slate-900">Certificate Details</h4>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="text-slate-600 text-sm">Tracking Number</span>
                              <p className="font-medium text-slate-900">{verificationResult.record.trackingNumber}</p>
                            </div>
                            <div>
                              <span className="text-slate-600 text-sm">Status</span>
                              <div className="mt-1">
                                <Badge className={getStatusColor(verificationResult.record.currentStatus)}>
                                  {verificationResult.record.currentStatus}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-600 text-sm">Destination</span>
                              <p className="font-medium text-slate-900">{verificationResult.record.destinationCountry || "Not specified"}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg isms-icon-bg-green flex items-center justify-center">
                              <Leaf className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="font-bold text-slate-900">EUDR Compliance</h4>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <span className="text-slate-600 text-sm">Compliant Status</span>
                              <div className="mt-1">
                                {verificationResult.record.eudrCompliant ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" /> Compliant
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-800">
                                    <XCircle className="h-3 w-3 mr-1" /> Non-Compliant
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-600 text-sm">Deforestation Risk</span>
                              <div className="mt-1">
                                <Badge className={getRiskColor(verificationResult.record.deforestationRisk || "unknown")}>
                                  {verificationResult.record.deforestationRisk || "Unknown"}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-600 text-sm">Sustainability Score</span>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`flex items-center gap-1 ${formatSustainabilityScore(verificationResult.record.sustainabilityScore || 85).color}`}>
                                  <Star className="h-4 w-4" />
                                  <span className="font-medium">{verificationResult.record.sustainabilityScore || 85}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg isms-icon-bg-purple flex items-center justify-center">
                              <MapPin className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="font-bold text-slate-900">Location & Actions</h4>
                          </div>
                          <div className="space-y-3">
                            {verificationResult.record.originCoordinates && (
                              <div>
                                <span className="text-slate-600 text-sm">Origin Coordinates</span>
                                <p className="font-medium text-slate-900">{verificationResult.record.originCoordinates}</p>
                              </div>
                            )}
                            {verificationResult.record.currentLocation && (
                              <div>
                                <span className="text-slate-600 text-sm">Current Location</span>
                                <p className="font-medium text-slate-900">{verificationResult.record.currentLocation}</p>
                              </div>
                            )}
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" onClick={() => setShowQRCode(true)} className="flex-1">
                                <QrCode className="h-4 w-4 mr-1" />
                                QR Code
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleDownloadReport} className="flex-1">
                                <Download className="h-4 w-4 mr-1" />
                                Report
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Active Alerts - ISMS Style */}
                      {verificationResult.alerts && verificationResult.alerts.length > 0 && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
                              <AlertTriangle className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-orange-800">Active Alerts ({verificationResult.alerts.length})</h3>
                              <p className="text-orange-700">Critical compliance and supply chain alerts</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {verificationResult.alerts.map((alert) => (
                              <div key={alert.id} className="bg-white rounded-lg p-4 border border-orange-200">
                                <div className="flex items-start gap-3">
                                  {getSeverityIcon(alert.severity)}
                                  <div className="flex-1">
                                    <h4 className="font-medium text-slate-900">{alert.title}</h4>
                                    <p className="text-slate-600 text-sm mt-1">
                                      {alert.message}
                                      {alert.actionRequired && (
                                        <Badge className="ml-2 bg-red-100 text-red-800">Action Required</Badge>
                                      )}
                                    </p>
                                  </div>
                                  <Badge className={getRiskColor(alert.severity)}>
                                    {alert.severity}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Supply Chain Timeline - ISMS Style */}
                      <div className="bg-slate-50 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl isms-icon-bg-blue flex items-center justify-center">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Supply Chain Timeline</h3>
                            <p className="text-slate-600">Complete traceability from farm to export destination</p>
                          </div>
                        </div>
                        
                        {/* Timeline Events */}
                        {verificationResult.timeline && verificationResult.timeline.length > 0 ? (
                          <ScrollArea className="h-64">
                            <div className="space-y-4">
                              {verificationResult.timeline.map((event, index) => (
                                <div key={event.id} className="flex gap-4">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full ${
                                      event.complianceStatus === "compliant" ? "bg-green-500" :
                                      event.complianceStatus === "non_compliant" ? "bg-red-500" :
                                      "bg-yellow-500"
                                    }`} />
                                    {index < verificationResult.timeline.length - 1 && (
                                      <div className="w-px h-8 bg-slate-300 mt-2" />
                                    )}
                                  </div>
                                  <div className="flex-1 pb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-medium text-slate-900">{event.eventDescription}</h4>
                                      <Badge variant="outline" className="text-xs">{event.eventType}</Badge>
                                      {event.eudrVerified && (
                                        <Badge className="bg-green-100 text-green-800 text-xs">
                                          <Leaf className="h-3 w-3 mr-1" /> EUDR Verified
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-slate-600 space-y-1">
                                      {event.eventLocation && (
                                        <p><MapPin className="h-3 w-3 inline mr-1" />{event.eventLocation}</p>
                                      )}
                                      {event.officerName && (
                                        <p><Users className="h-3 w-3 inline mr-1" />{event.officerName}</p>
                                      )}
                                      <p><Calendar className="h-3 w-3 inline mr-1" />{new Date(event.timestamp).toLocaleString()}</p>
                                    </div>
                                    {event.complianceChecked && (
                                      <Badge className={`mt-2 ${getStatusColor(event.complianceStatus || "pending")}`}>
                                        Compliance: {event.complianceStatus || "pending"}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                            <p className="text-slate-500">No timeline events recorded</p>
                          </div>
                        )}
                      </div>

                      {/* Verification Details - ISMS Style */}
                      {verificationResult.verifications && verificationResult.verifications.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                              <Shield className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">Verification Details</h3>
                              <p className="text-slate-600">Comprehensive verification methods and results</p>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50">
                                  <TableHead className="font-medium">Type</TableHead>
                                  <TableHead className="font-medium">Method</TableHead>
                                  <TableHead className="font-medium">Result</TableHead>
                                  <TableHead className="font-medium">EUDR Checks</TableHead>
                                  <TableHead className="font-medium">Verified By</TableHead>
                                  <TableHead className="font-medium">Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {verificationResult.verifications.map((verification) => (
                                  <TableRow key={verification.id} className="hover:bg-slate-50">
                                    <TableCell className="font-medium">{verification.verificationType}</TableCell>
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
                                      <div className="flex gap-1 flex-wrap">
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
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 text-center border border-red-200">
                      <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mx-auto mb-4">
                        <XCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-red-800 mb-2">Certificate Not Found</h3>
                      <p className="text-red-700 mb-4">
                        The tracking number "{trackingNumber}" is not valid or the certificate does not exist in our system.
                      </p>
                      <Button 
                        onClick={() => setTrackingNumber("")} 
                        variant="outline" 
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        Try Another Number
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* All Records Tab - ISMS Style */}
            <TabsContent value="records" className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl isms-icon-bg-green flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">All Tracking Records</h3>
                    <p className="text-slate-600">Complete list of all certificate tracking records in the system</p>
                  </div>
                </div>
                {loadingRecords ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-500">Loading tracking records...</p>
                  </div>
                ) : trackingRecords.length > 0 ? (
                  <div className="bg-white rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-medium">Tracking Number</TableHead>
                            <TableHead className="font-medium">Status</TableHead>
                            <TableHead className="font-medium">EUDR Compliant</TableHead>
                            <TableHead className="font-medium">Risk Level</TableHead>
                            <TableHead className="font-medium">Sustainability Score</TableHead>
                            <TableHead className="font-medium">Destination</TableHead>
                            <TableHead className="font-medium">Created</TableHead>
                            <TableHead className="font-medium">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trackingRecords.map((record: TrackingRecord) => (
                            <TableRow key={record.id} className="hover:bg-slate-50">
                              <TableCell className="font-mono font-medium">{record.trackingNumber}</TableCell>
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
                                  <span className="text-slate-500">Not scored</span>
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
                                  className="hover:bg-slate-50"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500">No tracking records found</p>
                    </div>
                  )}
                </div>
              </TabsContent>

            {/* Real-Time Simulation Tab - ISMS Style */}
            <TabsContent value="analytics" className="space-y-6">
              {/* Simulation Control Panel */}
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl isms-icon-bg-purple flex items-center justify-center">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Real-Time Verification Simulation</h3>
                      <p className="text-slate-600">Monitor live certificate verification processing and system performance</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {realTimeSimulation ? (
                      <Button 
                        onClick={stopRealTimeSimulation}
                        variant="outline" 
                        className="border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Stop Simulation
                      </Button>
                    ) : (
                      <Button 
                        onClick={startRealTimeSimulation}
                        className="isms-button"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Start Live Simulation
                      </Button>
                    )}
                    {realTimeSimulation && (
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse mr-2"></div>
                        Live Testing Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Real-Time Metrics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg isms-icon-bg-blue flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-600 text-sm">Verifications Processed</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900 mb-1">
                    {simulationData.verificationsProcessed.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600">Total certificates verified</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg isms-icon-bg-green flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-600 text-sm">EUDR Compliance Rate</span>
                  </div>
                  <p className="text-3xl font-bold text-green-900 mb-1">
                    {simulationData.eudrComplianceRate}%
                  </p>
                  <p className="text-xs text-green-600">EU deforestation compliant</p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg isms-icon-bg-orange flex items-center justify-center">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-600 text-sm">Avg Processing Time</span>
                  </div>
                  <p className="text-3xl font-bold text-orange-900 mb-1">
                    {simulationData.averageProcessingTime}s
                  </p>
                  <p className="text-xs text-orange-600">Per certificate verification</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg isms-icon-bg-purple flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-600 text-sm">Deforestation Alerts</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-900 mb-1">
                    {simulationData.deforestationAlerts}
                  </p>
                  <p className="text-xs text-purple-600">High-risk detections</p>
                </div>
              </div>

              {/* Live Activity Monitor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Verification Status Overview */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg isms-icon-bg-blue flex items-center justify-center">
                      <BarChart className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900">Live Verification Status</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Active Certificates</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-slate-900">{simulationData.activeCertificates}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Pending Verifications</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium text-slate-900">{simulationData.pendingVerifications}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Failed Verifications</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-slate-900">{simulationData.failedVerifications}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Activity Log */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg isms-icon-bg-green flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900">Live Verification Activity</h4>
                  </div>
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {simulationLogs.map((log, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            log.type === 'success' ? 'bg-green-500' :
                            log.type === 'warning' ? 'bg-yellow-500' :
                            log.type === 'error' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-slate-500">{log.timestamp}</span>
                              {log.certificateId && (
                                <Badge variant="outline" className="text-xs">
                                  {log.certificateId}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed">{log.message}</p>
                          </div>
                        </div>
                      ))}
                      {simulationLogs.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          <Activity className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                          <p>No activity logs yet. Start simulation to see live verification activity.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Sustainability Score Trends */}
              {simulationData.sustainabilityScores.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg isms-icon-bg-purple flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-bold text-slate-900">Sustainability Score Trends</h4>
                  </div>
                  <div className="grid grid-cols-10 gap-2 h-32">
                    {simulationData.sustainabilityScores.map((score, index) => (
                      <div key={index} className="flex flex-col justify-end">
                        <div 
                          className={`w-full rounded-t ${
                            score >= 90 ? 'bg-green-500' :
                            score >= 75 ? 'bg-blue-500' :
                            score >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ height: `${(score / 100) * 100}%` }}
                        ></div>
                        <span className="text-xs text-slate-600 text-center mt-1">{score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

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