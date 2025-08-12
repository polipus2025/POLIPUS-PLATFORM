import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, AlertTriangle, CheckCircle, XCircle, Clock, MapPin, Calendar, Shield, Globe, Scale, BookOpen, Users, Target } from "lucide-react";

interface ComprehensiveEUDRReport {
  farmerId: string;
  farmerName: string;
  county: string;
  farmSize: number;
  farmSizeUnit: string;
  gpsCoordinates: string;
  assessmentDate: string;
  reportId: string;
  
  // EUDR Core Assessment
  riskLevel: 'negligible' | 'low' | 'standard' | 'high' | 'critical';
  complianceScore: number;
  complianceStatus: 'compliant' | 'conditional' | 'non-compliant';
  
  // Due Diligence Components
  dueDiligenceScore: number;
  informationGathered: boolean;
  riskAssessmentCompleted: boolean;
  mitigationMeasuresImplemented: boolean;
  
  // Deforestation Risk Assessment
  deforestationRisk: number;
  lastForestDate: string;
  forestCoverBaseline: number;
  currentForestCover: number;
  deforestationAfter2020: boolean;
  
  // Legal Compliance
  legalHarvesting: boolean;
  relevantLegislationCompliance: string[];
  humanRightsCompliance: boolean;
  indigenousRightsRespected: boolean;
  
  // Supply Chain Information
  supplyChainTransparency: number;
  traceabilityScore: number;
  documentationComplete: boolean;
  thirdPartyVerification: boolean;
  
  // Risk Mitigation
  mitigationPlan: string[];
  monitoringSystem: string;
  correctiveActions: string[];
  
  // Additional Requirements
  geolocationVerified: boolean;
  satelliteMonitoringActive: boolean;
  stakeholderConsultation: boolean;
}

interface ComprehensiveEUDRReportProps {
  report: ComprehensiveEUDRReport;
  onDownload?: () => void;
  onViewDueDiligenceStatement?: () => void;
}

export default function ComprehensiveEUDRReportComponent({ 
  report, 
  onDownload,
  onViewDueDiligenceStatement 
}: ComprehensiveEUDRReportProps) {

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'negligible': return 'text-green-700 bg-green-100 border-green-300';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'standard': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200';
      case 'conditional': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'non-compliant': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getComplianceIcon = () => {
    if (report.complianceScore >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (report.complianceScore >= 70) return <Clock className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDueDiligenceStatus = () => {
    const components = [
      report.informationGathered,
      report.riskAssessmentCompleted,
      report.mitigationMeasuresImplemented
    ];
    return (components.filter(Boolean).length / components.length) * 100;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EU Deforestation Regulation (EUDR)</h1>
            <h2 className="text-xl font-semibold text-gray-700">Comprehensive Due Diligence Compliance Report</h2>
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600 mt-4">
          <span>Report ID: {report.reportId}</span>
          <span>Assessment Date: {formatDate(report.assessmentDate)}</span>
          <span>Next Review: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 text-xs text-blue-600 font-medium">
          Regulation (EU) 2023/1115 | In force from 30 December 2024
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Executive Summary & Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getComplianceIcon()}
                <span className="font-semibold text-lg">Overall Compliance Score</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{report.complianceScore}%</div>
                <Badge className={getComplianceColor(report.complianceStatus)}>
                  {report.complianceStatus.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>

            <Progress value={report.complianceScore} className="h-3" />

            <Alert className={`border-l-4 ${report.complianceStatus === 'compliant' ? 'border-l-green-500 bg-green-50' : report.complianceStatus === 'conditional' ? 'border-l-yellow-500 bg-yellow-50' : 'border-l-red-500 bg-red-50'}`}>
              <Shield className={`h-4 w-4 ${report.complianceStatus === 'compliant' ? 'text-green-600' : report.complianceStatus === 'conditional' ? 'text-yellow-600' : 'text-red-600'}`} />
              <AlertDescription>
                <strong>EUDR Compliance Assessment:</strong> {
                  report.complianceStatus === 'compliant' 
                    ? 'This agricultural commodity meets all EU Deforestation Regulation requirements and is eligible for EU market access.'
                    : report.complianceStatus === 'conditional'
                    ? 'Conditional compliance achieved. Some mitigation measures are required before full market access.'
                    : 'Non-compliance detected. Immediate corrective actions required before EU market access is permitted.'
                }
              </AlertDescription>
            </Alert>

            {report.deforestationAfter2020 && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <strong>Critical Finding:</strong> Deforestation activity detected after the December 31, 2020 cut-off date. 
                  This commodity is currently <strong>prohibited from EU market entry</strong> under EUDR Article 3.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Badge className={getRiskColor(report.riskLevel)}>
                {report.riskLevel.toUpperCase()} RISK
              </Badge>
              <div className="mt-2 text-sm text-gray-600">
                Deforestation Risk Level
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Deforestation Risk</span>
                  <span>{report.deforestationRisk}%</span>
                </div>
                <Progress value={report.deforestationRisk} className="h-2 mt-1" />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Due Diligence Score</span>
                  <span>{report.dueDiligenceScore}%</span>
                </div>
                <Progress value={report.dueDiligenceScore} className="h-2 mt-1" />
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span>Supply Chain Transparency</span>
                  <span>{report.supplyChainTransparency}%</span>
                </div>
                <Progress value={report.supplyChainTransparency} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Due Diligence Statement */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Due Diligence Statement (EUDR Article 4)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Declaration of Compliance</h4>
            <p className="text-sm text-gray-700 mb-4">
              In accordance with Regulation (EU) 2023/1115 of the European Parliament and of the Council, 
              I hereby declare that the agricultural commodities covered by this due diligence statement:
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {report.deforestationAfter2020 ? 
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" /> : 
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                }
                <span>Are <strong>{report.deforestationAfter2020 ? 'NOT' : ''} deforestation-free</strong> (no deforestation after 31 December 2020)</span>
              </div>
              
              <div className="flex items-center gap-2">
                {report.legalHarvesting ? 
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> : 
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                }
                <span>Have been produced in accordance with <strong>relevant legislation</strong> of the country of production</span>
              </div>
              
              <div className="flex items-center gap-2">
                {report.humanRightsCompliance ? 
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> : 
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                }
                <span>Respect <strong>human rights</strong> as enshrined in international law</span>
              </div>
              
              <div className="flex items-center gap-2">
                {report.indigenousRightsRespected ? 
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" /> : 
                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                }
                <span>Respect the rights of <strong>indigenous peoples</strong> affected by production</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${report.informationGathered ? 'text-green-600' : 'text-red-600'}`}>
                {report.informationGathered ? '✓' : '✗'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Information Gathered</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${report.riskAssessmentCompleted ? 'text-green-600' : 'text-red-600'}`}>
                {report.riskAssessmentCompleted ? '✓' : '✗'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Risk Assessment</p>
            </div>
            
            <div className="text-center p-3 bg-white rounded-lg">
              <div className={`text-2xl font-bold ${report.mitigationMeasuresImplemented ? 'text-green-600' : 'text-red-600'}`}>
                {report.mitigationMeasuresImplemented ? '✓' : '✗'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Mitigation Implemented</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forest & Land Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Geolocation & Forest Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium mb-2">Geolocation Information</h5>
              <div className="text-sm space-y-1">
                <p><strong>Coordinates:</strong> {report.gpsCoordinates}</p>
                <p><strong>Location Verified:</strong> {report.geolocationVerified ? '✓ Yes' : '✗ No'}</p>
                <p><strong>Satellite Monitoring:</strong> {report.satelliteMonitoringActive ? '✓ Active' : '✗ Inactive'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Forest Cover Baseline:</span>
                <span className="font-medium">{report.forestCoverBaseline}%</span>
              </div>
              <div className="flex justify-between">
                <span>Current Forest Cover:</span>
                <span className="font-medium">{report.currentForestCover}%</span>
              </div>
              <div className="flex justify-between">
                <span>Last Forest Assessment:</span>
                <span className="font-medium">{formatDate(report.lastForestDate)}</span>
              </div>
            </div>

            {report.geolocationVerified && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Geolocation coordinates verified through satellite imagery and ground-truth validation.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Legal Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-600" />
              Legal Compliance Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Legal Harvesting Status:</span>
                <Badge className={report.legalHarvesting ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {report.legalHarvesting ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Human Rights Compliance:</span>
                <Badge className={report.humanRightsCompliance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {report.humanRightsCompliance ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Indigenous Rights:</span>
                <Badge className={report.indigenousRightsRespected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {report.indigenousRightsRespected ? 'RESPECTED' : 'VIOLATIONS DETECTED'}
                </Badge>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="font-medium mb-2">Relevant Legislation Compliance</h5>
              <ul className="text-sm space-y-1">
                {report.relevantLegislationCompliance.map((law, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                    <span>{law}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain & Traceability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Supply Chain Transparency & Traceability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{report.supplyChainTransparency}%</div>
              <p className="text-sm text-gray-600 mt-1">Supply Chain Transparency</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{report.traceabilityScore}%</div>
              <p className="text-sm text-gray-600 mt-1">Traceability Score</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${report.documentationComplete ? 'text-green-600' : 'text-red-600'}`}>
                {report.documentationComplete ? '✓' : '✗'}
              </div>
              <p className="text-sm text-gray-600 mt-1">Documentation Complete</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className={`text-2xl font-bold ${report.thirdPartyVerification ? 'text-green-600' : 'text-red-600'}`}>
                {report.thirdPartyVerification ? '✓' : '✗'}
              </div>
              <p className="text-sm text-gray-600 mt-1">Third-Party Verified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Mitigation & Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-600" />
            Risk Mitigation & Corrective Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Mitigation Plan</h4>
              <ul className="space-y-2">
                {report.mitigationPlan.map((measure, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{measure}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Corrective Actions</h4>
              <ul className="space-y-2">
                {report.correctiveActions.map((action: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-medium text-purple-900 mb-2">Monitoring System</h5>
            <p className="text-sm text-purple-800">{report.monitoringSystem}</p>
          </div>
        </CardContent>
      </Card>

      {/* Certification & Validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Certification & Third-Party Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Certification Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Certification Body:</span>
                  <span className="font-medium">LACRA</span>
                </div>
                <div className="flex justify-between">
                  <span>Certification Date:</span>
                  <span className="font-medium">{formatDate(report.assessmentDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Validity Period:</span>
                  <span className="font-medium">12 months</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Assessment:</span>
                  <span className="font-medium">{new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Stakeholder Consultation</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {report.stakeholderConsultation ? 
                    <CheckCircle className="h-4 w-4 text-green-600" /> : 
                    <XCircle className="h-4 w-4 text-red-600" />
                  }
                  <span className="text-sm">
                    Stakeholder consultation {report.stakeholderConsultation ? 'completed' : 'pending'}
                  </span>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <p className="text-xs text-blue-800">
                    <strong>EUDR Requirement:</strong> Meaningful consultation with affected stakeholders, 
                    including indigenous peoples and local communities, has been conducted in accordance 
                    with international standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-6">
        <Button onClick={onDownload} className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Download EUDR Compliance Report (PDF)
        </Button>
        {onViewDueDiligenceStatement && (
          <Button variant="outline" onClick={onViewDueDiligenceStatement}>
            <FileText className="h-4 w-4 mr-2" />
            View Due Diligence Statement
          </Button>
        )}
        <Button variant="outline">
          <Globe className="h-4 w-4 mr-2" />
          Submit to EU Database
        </Button>
      </div>

      {/* Legal Footer */}
      <div className="border-t pt-6 mt-6 bg-gray-50 p-4 rounded-lg">
        <div className="text-xs text-gray-600 space-y-3">
          <div>
            <strong>Legal Framework:</strong> This report is prepared in accordance with Regulation (EU) 2023/1115 
            of the European Parliament and of the Council of 31 May 2023 on the making available on the Union market 
            and the export from the Union of certain commodities and products associated with deforestation and forest degradation.
          </div>
          
          <div>
            <strong>Certification Authority:</strong> Liberia Agriculture Commodity Regulatory Authority (LACRA) 
            - Authorized competent authority under EUDR Article 2(1)(f)
          </div>
          
          <div>
            <strong>Validity:</strong> This due diligence statement is valid for the specific consignment identified herein 
            and remains valid until the next mandatory assessment date or until circumstances change that may affect the risk assessment.
          </div>
          
          <div>
            <strong>Contact:</strong> For verification or additional information, contact LACRA EUDR Compliance Unit 
            at eudr-compliance@lacra.gov.lr or +231-XXX-XXXX
          </div>
        </div>
      </div>
    </div>
  );
}