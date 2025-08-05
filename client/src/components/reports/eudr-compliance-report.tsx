import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Calendar, Shield } from "lucide-react";

interface EUDRComplianceReport {
  riskLevel: 'low' | 'standard' | 'high';
  complianceScore: number;
  deforestationRisk: number;
  lastForestDate: string;
  coordinates: string;
  documentationRequired: string[];
  recommendations: string[];
}

interface EUDRReportProps {
  report: EUDRComplianceReport;
  farmArea: number;
  farmerId: string;
  farmerName: string;
  onDownload: () => void;
}

export default function EUDRComplianceReportComponent({ 
  report, 
  farmArea, 
  farmerId, 
  farmerName, 
  onDownload 
}: EUDRReportProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'standard': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceIcon = () => {
    if (report.complianceScore >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (report.complianceScore >= 70) return <Clock className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const formatDate = () => new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">EU Deforestation Regulation</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Due Diligence Compliance Report</h2>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Report ID: EUDR-{farmerId}-{Date.now().toString().slice(-6)}</span>
          <span>Generated: {formatDate()}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {getComplianceIcon()}
              </div>
              <div className="text-3xl font-bold text-gray-900">{report.complianceScore}%</div>
              <div className="text-sm text-gray-600">Overall Compliance</div>
              <Progress value={report.complianceScore} className="mt-2" />
            </div>
            <div className="text-center">
              <Badge className={`${getRiskColor(report.riskLevel)} mb-2`}>
                {report.riskLevel.toUpperCase()} RISK
              </Badge>
              <div className="text-lg font-semibold text-gray-700">Risk Classification</div>
              <div className="text-sm text-gray-600 mt-1">
                {report.riskLevel === 'low' ? 'Standard Due Diligence' : 
                 report.riskLevel === 'standard' ? 'Enhanced Monitoring' : 
                 'Enhanced Due Diligence Required'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{report.deforestationRisk}%</div>
              <div className="text-sm text-gray-600">Deforestation Risk</div>
              <Progress value={report.deforestationRisk} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Farm Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Farmer Name:</span>
              <span className="font-medium">{farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Farmer ID:</span>
              <span className="font-medium">{farmerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Farm Area:</span>
              <span className="font-medium">{farmArea.toFixed(2)} hectares</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">Liberia</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Compliance Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">EUDR Cutoff Date:</span>
              <span className="font-medium">2020-12-31</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Forest Date:</span>
              <span className="font-medium">{report.lastForestDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Assessment Date:</span>
              <span className="font-medium">{formatDate()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valid Until:</span>
              <span className="font-medium">{new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GPS Coordinates */}
      <Card>
        <CardHeader>
          <CardTitle>Geolocation Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Farm Boundary Coordinates (WGS84):</div>
            <div className="font-mono text-sm">{report.coordinates}</div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documentation Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.documentationRequired.map((doc, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-500 rounded"></div>
                <span className="text-sm">{doc}</span>
              </div>
            ))}
          </div>
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              All documentation must be submitted within 30 days of this assessment to maintain compliance status.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Risk Assessment & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.recommendations.map((rec, index) => (
            <Alert key={index} className={index === 0 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{rec}</AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>

      {/* Legal Disclaimer */}
      <Card className="border-gray-300">
        <CardContent className="pt-6">
          <div className="text-xs text-gray-500 space-y-2">
            <h4 className="font-semibold text-gray-700">Legal Disclaimer & Compliance Statement</h4>
            <p>This report is generated in accordance with EU Regulation 2023/1115 on deforestation-free products. The assessment is based on available satellite data, government databases, and declared information.</p>
            <p>This compliance report is valid for 12 months from the date of generation. Operators must ensure continuous monitoring and update assessments when material changes occur.</p>
            <p>For questions regarding this assessment, contact the Liberia Agriculture Commodity Regulatory Authority (LACRA).</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button onClick={onDownload} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Download PDF Report
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <FileText className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </div>
    </div>
  );
}