import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, TreePine, AlertTriangle, TrendingDown, TrendingUp, Leaf, Zap, Globe } from "lucide-react";
import { generateDeforestationPDF } from "@/lib/enhanced-pdf-generator";

interface DeforestationReport {
  forestLossDetected: boolean;
  forestLossDate: string | null;
  forestCoverChange: number;
  biodiversityImpact: 'minimal' | 'moderate' | 'significant';
  carbonStockLoss: number;
  mitigationRequired: boolean;
  recommendations: string[];
}

interface DeforestationReportProps {
  report: DeforestationReport;
  farmArea: number;
  farmerId: string;
  farmerName: string;
  onDownload?: () => void;
}

export default function DeforestationReportComponent({ 
  report, 
  farmArea, 
  farmerId, 
  farmerName, 
  onDownload 
}: DeforestationReportProps) {
  const getImpactColor = (level: string) => {
    switch (level) {
      case 'minimal': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'significant': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = () => new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const getChangeIcon = () => {
    return report.forestCoverChange < 0 ? 
      <TrendingDown className="h-6 w-6 text-red-600" /> : 
      <TrendingUp className="h-6 w-6 text-green-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 bg-white">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TreePine className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Deforestation Analysis Report</h1>
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Environmental Impact Assessment</h2>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Report ID: DFR-{farmerId}-{Date.now().toString().slice(-6)}</span>
          <span>Generated: {formatDate()}</span>
        </div>
      </div>

      {/* Alert Banner */}
      {report.forestLossDetected && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            ⚠️ FOREST LOSS DETECTED - Immediate action required for EUDR compliance
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              {getChangeIcon()}
            </div>
            <div className={`text-3xl font-bold ${report.forestCoverChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {report.forestCoverChange > 0 ? '+' : ''}{report.forestCoverChange}%
            </div>
            <div className="text-sm text-gray-600">Forest Cover Change</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-600">{report.carbonStockLoss}</div>
            <div className="text-sm text-gray-600">Carbon Loss (tCO₂)</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <Leaf className="h-6 w-6 text-blue-600" />
            </div>
            <Badge className={`${getImpactColor(report.biodiversityImpact)} mb-2`}>
              {report.biodiversityImpact.toUpperCase()}
            </Badge>
            <div className="text-sm text-gray-600">Biodiversity Impact</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-2">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600">
              {report.forestLossDetected ? 'NON-COMPLIANT' : 'COMPLIANT'}
            </div>
            <div className="text-sm text-gray-600">EUDR Status</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreePine className="h-5 w-5" />
              Forest Change Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Forest Loss Detected:</span>
                <Badge variant={report.forestLossDetected ? 'destructive' : 'secondary'}>
                  {report.forestLossDetected ? 'YES' : 'NO'}
                </Badge>
              </div>
              
              {report.forestLossDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Loss Detection Date:</span>
                  <span className="font-medium text-red-600">{report.forestLossDate}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Forest Cover Change:</span>
                <span className={`font-medium ${report.forestCoverChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {report.forestCoverChange > 0 ? '+' : ''}{report.forestCoverChange}%
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Analysis Period:</span>
                <span className="font-medium">2020-2024</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-2">Satellite Data Sources:</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• Global Forest Watch (Hansen et al.)</div>
                <div>• Landsat 8 & Sentinel-2 imagery</div>
                <div>• NASA Earth Observation System</div>
                <div>• European Space Agency Copernicus</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Biodiversity Impact:</span>
                <Badge className={getImpactColor(report.biodiversityImpact)}>
                  {report.biodiversityImpact.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Carbon Stock Loss:</span>
                <span className="font-medium text-orange-600">{report.carbonStockLoss} tCO₂</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Affected Area:</span>
                <span className="font-medium">{(farmArea * Math.abs(report.forestCoverChange) / 100).toFixed(2)} ha</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Mitigation Required:</span>
                <Badge variant={report.mitigationRequired ? 'destructive' : 'secondary'}>
                  {report.mitigationRequired ? 'YES' : 'NO'}
                </Badge>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium mb-2">Impact Assessment Scale:</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• <span className="text-green-600">Minimal:</span> &lt;5% forest change</div>
                <div>• <span className="text-yellow-600">Moderate:</span> 5-15% forest change</div>
                <div>• <span className="text-red-600">Significant:</span> &gt;15% forest change</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Deforestation Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="text-sm font-medium">2020</div>
                <div className="text-xs text-gray-600">EUDR Cutoff</div>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              {report.forestLossDate && (
                <>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium">2021</div>
                    <div className="text-xs text-gray-600">Loss Detected</div>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                </>
              )}
              <div className="text-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <div className="text-sm font-medium">2024</div>
                <div className="text-xs text-gray-600">Assessment</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mitigation Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Mitigation & Restoration Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{rec}</div>
                </div>
              </div>
            ))}
          </div>
          
          {report.mitigationRequired && (
            <Alert className="mt-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-orange-800">
                <strong>Action Required:</strong> Implementation of mitigation measures must begin within 60 days to maintain market access under EUDR.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Compliance Statement */}
      <Card className="border-gray-300">
        <CardContent className="pt-6">
          <div className="text-xs text-gray-500 space-y-2">
            <h4 className="font-semibold text-gray-700">Methodology & Data Sources</h4>
            <p>This deforestation analysis uses globally recognized datasets including Hansen Global Forest Change, NASA MODIS, and ESA Copernicus Land Monitoring Service.</p>
            <p>Analysis period covers 2020-2024 with 30-meter spatial resolution. Change detection algorithms identify forest loss events with 95% confidence interval.</p>
            <p>Assessment conducted in compliance with EUDR technical standards and scientific methodologies approved by the European Commission.</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-6">
        <Button 
          onClick={async () => {
            if (onDownload) {
              onDownload();
            } else {
              await generateDeforestationPDF(report, farmArea, farmerId, farmerName);
            }
          }} 
          className="bg-green-600 hover:bg-green-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download PDF Report
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <TreePine className="h-4 w-4 mr-2" />
          Print Report
        </Button>
      </div>
    </div>
  );
}