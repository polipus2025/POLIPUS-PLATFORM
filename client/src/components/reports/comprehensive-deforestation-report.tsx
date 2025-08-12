import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, TreePine, AlertTriangle, TrendingDown, TrendingUp, Leaf, Zap, Globe, Map, Calendar, ShieldCheck, FileText, BarChart3, Target } from "lucide-react";

interface ComprehensiveDeforestationReport {
  farmerId: string;
  farmerName: string;
  county: string;
  farmSize: number;
  farmSizeUnit: string;
  gpsCoordinates: string;
  analysisDate: string;
  reportId: string;
  
  // Deforestation Analysis
  forestLossDetected: boolean;
  forestLossDate: string | null;
  forestCoverChange: number;
  baselineForestCover: number;
  currentForestCover: number;
  deforestationRate: number;
  
  // Biodiversity Assessment
  biodiversityImpact: 'minimal' | 'moderate' | 'significant' | 'severe';
  speciesAtRisk: string[];
  habitatFragmentation: number;
  
  // Carbon Stock Analysis
  carbonStockLoss: number;
  carbonEmissions: number;
  carbonSequestrationPotential: number;
  
  // Environmental Impact
  soilErosionRisk: 'low' | 'medium' | 'high' | 'critical';
  waterResourceImpact: 'none' | 'minimal' | 'moderate' | 'significant';
  climateChangeContribution: number;
  
  // Legal Compliance
  legalComplianceStatus: 'compliant' | 'non-compliant' | 'under-review';
  permitsRequired: string[];
  violationsDetected: string[];
  
  // Mitigation Measures
  mitigationRequired: boolean;
  recommendedActions: string[];
  reforestationPlan: string;
  timelineForCompliance: string;
  
  // Monitoring Data
  satelliteImageryDate: string;
  monitoringFrequency: string;
  nextAssessmentDate: string;
}

interface ComprehensiveDeforestationReportProps {
  report: ComprehensiveDeforestationReport;
  onDownload?: () => void;
  onViewFullReport?: () => void;
}

export default function ComprehensiveDeforestationReportComponent({ 
  report, 
  onDownload,
  onViewFullReport 
}: ComprehensiveDeforestationReportProps) {
  
  const getImpactColor = (level: string) => {
    switch (level) {
      case 'minimal': case 'none': case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'significant': case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'severe': case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'under-review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'non-compliant': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getChangeIcon = () => {
    return report.forestCoverChange < 0 ? 
      <TrendingDown className="h-6 w-6 text-red-600" /> : 
      <TrendingUp className="h-6 w-6 text-green-600" />;
  };

  const getRiskLevel = () => {
    if (report.forestLossDetected && report.deforestationRate > 0.5) return 'high';
    if (report.forestLossDetected && report.deforestationRate > 0.1) return 'medium';
    return 'low';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TreePine className="h-10 w-10 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Comprehensive Deforestation Analysis Report</h1>
            <h2 className="text-xl font-semibold text-gray-700">Environmental Impact & Compliance Assessment</h2>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>Report ID: {report.reportId}</span>
          <span>Analysis Date: {formatDate(report.analysisDate)}</span>
          <span>Next Assessment: {formatDate(report.nextAssessmentDate)}</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Forest Cover Change:</span>
                  <div className="flex items-center gap-2">
                    {getChangeIcon()}
                    <span className={report.forestCoverChange < 0 ? 'text-red-600' : 'text-green-600'}>
                      {report.forestCoverChange > 0 ? '+' : ''}{report.forestCoverChange.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={Math.abs(report.forestCoverChange)} 
                  className={`h-2 ${report.forestCoverChange < 0 ? 'bg-red-100' : 'bg-green-100'}`} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Deforestation Rate:</span>
                  <span className={report.deforestationRate > 0.5 ? 'text-red-600' : report.deforestationRate > 0.1 ? 'text-orange-600' : 'text-green-600'}>
                    {report.deforestationRate.toFixed(3)}% annually
                  </span>
                </div>
                <Progress value={Math.min(report.deforestationRate * 100, 100)} className="h-2" />
              </div>
            </div>

            <Alert className={`border-l-4 ${report.forestLossDetected ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'}`}>
              <AlertTriangle className={`h-4 w-4 ${report.forestLossDetected ? 'text-red-600' : 'text-green-600'}`} />
              <AlertDescription>
                <strong>Forest Loss Status:</strong> {report.forestLossDetected 
                  ? `Deforestation detected on ${formatDate(report.forestLossDate!)}. Immediate action required.`
                  : 'No significant forest loss detected. Farm maintains compliance standards.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-gray-900">{report.currentForestCover.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Current Forest Cover</p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk Level</span>
                <Badge className={getImpactColor(getRiskLevel())}>
                  {getRiskLevel().toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Compliance</span>
                <Badge className={getComplianceColor(report.legalComplianceStatus)}>
                  {report.legalComplianceStatus.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Biodiversity Impact</span>
                <Badge className={getImpactColor(report.biodiversityImpact)}>
                  {report.biodiversityImpact.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forest Cover Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5 text-green-600" />
              Forest Cover Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Baseline Forest Cover:</span>
                <span className="font-medium">{report.baselineForestCover.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Forest Cover:</span>
                <span className="font-medium">{report.currentForestCover.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Net Change:</span>
                <span className={`font-medium ${report.forestCoverChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {report.forestCoverChange > 0 ? '+' : ''}{report.forestCoverChange.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Annual Rate:</span>
                <span className="font-medium">{report.deforestationRate.toFixed(3)}%/year</span>
              </div>
            </div>

            {report.forestLossDetected && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Forest Loss Detected:</strong> {formatDate(report.forestLossDate!)}
                  <br />
                  Loss: {(report.baselineForestCover - report.currentForestCover).toFixed(2)} percentage points
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Carbon Impact Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Carbon Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Carbon Stock Loss:</span>
                <span className="font-medium text-red-600">{report.carbonStockLoss.toFixed(1)} tCO₂</span>
              </div>
              <div className="flex justify-between">
                <span>CO₂ Emissions:</span>
                <span className="font-medium text-red-600">{report.carbonEmissions.toFixed(1)} tCO₂</span>
              </div>
              <div className="flex justify-between">
                <span>Sequestration Potential:</span>
                <span className="font-medium text-green-600">{report.carbonSequestrationPotential.toFixed(1)} tCO₂/year</span>
              </div>
              <div className="flex justify-between">
                <span>Climate Impact Score:</span>
                <span className="font-medium">{report.climateChangeContribution.toFixed(1)}/10</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Carbon Recovery:</strong> With proper reforestation, this farm could sequester 
                {report.carbonSequestrationPotential.toFixed(1)} tCO₂ annually, offsetting current emissions within{' '}
                {Math.ceil(report.carbonEmissions / report.carbonSequestrationPotential)} years.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biodiversity & Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Biodiversity & Environmental Impact Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Biodiversity Impact</h4>
              <Badge className={getImpactColor(report.biodiversityImpact)}>
                {report.biodiversityImpact.toUpperCase()} IMPACT
              </Badge>
              <div className="text-sm text-gray-600">
                <p>Habitat Fragmentation: {report.habitatFragmentation.toFixed(1)}%</p>
                <p>Species at Risk: {report.speciesAtRisk.length} identified</p>
                {report.speciesAtRisk.length > 0 && (
                  <div className="mt-2">
                    <strong>At-Risk Species:</strong>
                    <ul className="mt-1 ml-4 list-disc">
                      {report.speciesAtRisk.map((species, index) => (
                        <li key={index}>{species}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Soil & Water Impact</h4>
              <Badge className={getImpactColor(report.soilErosionRisk)}>
                {report.soilErosionRisk.toUpperCase()} EROSION RISK
              </Badge>
              <Badge className={getImpactColor(report.waterResourceImpact)}>
                {report.waterResourceImpact.toUpperCase()} WATER IMPACT
              </Badge>
              <div className="text-sm text-gray-600">
                <p>Erosion mitigation measures {report.soilErosionRisk === 'critical' || report.soilErosionRisk === 'high' ? 'urgently required' : 'recommended'}</p>
                <p>Water resource protection {report.waterResourceImpact === 'significant' ? 'critical' : 'standard'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Legal Compliance</h4>
              <Badge className={getComplianceColor(report.legalComplianceStatus)}>
                {report.legalComplianceStatus.replace('-', ' ').toUpperCase()}
              </Badge>
              <div className="text-sm text-gray-600">
                <p>Permits Required: {report.permitsRequired.length}</p>
                <p>Violations: {report.violationsDetected.length}</p>
                {report.violationsDetected.length > 0 && (
                  <div className="mt-2">
                    <strong>Violations Detected:</strong>
                    <ul className="mt-1 ml-4 list-disc">
                      {report.violationsDetected.map((violation, index) => (
                        <li key={index} className="text-red-600">{violation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mitigation & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            Mitigation Measures & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {report.mitigationRequired && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <strong>Mitigation Required:</strong> Implementation timeline: {report.timelineForCompliance}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
              <ul className="space-y-2">
                {report.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Reforestation Plan</h4>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">{report.reforestationPlan}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoring & Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-purple-600" />
            Monitoring & Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Satellite Monitoring</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Latest Imagery: {formatDate(report.satelliteImageryDate)}</p>
                <p>Monitoring Frequency: {report.monitoringFrequency}</p>
                <p>Next Assessment: {formatDate(report.nextAssessmentDate)}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Farm Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Farmer: {report.farmerName}</p>
                <p>County: {report.county}</p>
                <p>Farm Size: {report.farmSize} {report.farmSizeUnit}</p>
                <p>Coordinates: {report.gpsCoordinates}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Report Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Report ID: {report.reportId}</p>
                <p>Generated: {formatDate(report.analysisDate)}</p>
                <p>Valid Until: {formatDate(report.nextAssessmentDate)}</p>
                <p>Version: 2.1 (Enhanced)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button onClick={onDownload} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Download Complete Report (PDF)
        </Button>
        {onViewFullReport && (
          <Button variant="outline" onClick={onViewFullReport}>
            <FileText className="h-4 w-4 mr-2" />
            View Interactive Report
          </Button>
        )}
      </div>

      {/* Legal Disclaimer */}
      <div className="border-t pt-6 mt-6">
        <div className="text-xs text-gray-500 space-y-2">
          <p><strong>Legal Disclaimer:</strong> This report is generated by AgriTrace360™ environmental monitoring system and is valid for regulatory compliance purposes. Data accuracy is verified through satellite imagery and ground-truth validation.</p>
          <p><strong>Certification Authority:</strong> Liberia Agriculture Commodity Regulatory Authority (LACRA)</p>
          <p><strong>International Standards:</strong> EU Deforestation Regulation (EUDR), OECD Guidelines for Multinational Enterprises, UN Global Compact</p>
        </div>
      </div>
    </div>
  );
}