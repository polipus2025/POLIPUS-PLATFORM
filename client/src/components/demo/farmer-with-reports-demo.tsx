import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MapPin, AlertTriangle, CheckCircle, Download, TreePine } from "lucide-react";

interface FarmerWithReportsProps {
  farmer: any;
  onViewReports?: () => void;
}

export default function FarmerWithReportsDemo({ farmer, onViewReports }: FarmerWithReportsProps) {
  const hasEudrReport = farmer.landMapData?.eudrCompliance;
  const hasDeforestationReport = farmer.landMapData?.deforestationReport;
  
  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'standard': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-l-4 border-l-lacra-green">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-lacra-green" />
            {farmer.firstName} {farmer.lastName}
          </CardTitle>
          <Badge className="bg-lacra-green text-white">
            ID: {farmer.farmerId}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Farmer Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">County:</span>
            <span className="ml-2">{farmer.county}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Village:</span>
            <span className="ml-2">{farmer.village || 'Not specified'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Farm Size:</span>
            <span className="ml-2">{farmer.farmSize || 'N/A'} {farmer.farmSizeUnit || 'hectares'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Status:</span>
            <Badge className={farmer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              {farmer.status}
            </Badge>
          </div>
        </div>

        {/* Land Mapping Data */}
        {farmer.landMapData && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <TreePine className="h-4 w-4" />
              Land Analysis Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Total Area: {farmer.landMapData.totalArea} ha</div>
              <div>Cultivated: {farmer.landMapData.cultivatedArea} ha</div>
              <div>Soil Type: {farmer.landMapData.soilType}</div>
              <div>Water Sources: {farmer.landMapData.waterSources?.length || 0}</div>
            </div>
          </div>
        )}

        {/* EUDR Compliance Report */}
        {hasEudrReport && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              EUDR Compliance Report
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Risk Level:</span>
                <Badge className={getRiskBadgeColor(farmer.landMapData.eudrCompliance.riskLevel)}>
                  {farmer.landMapData.eudrCompliance.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Compliance Score:</span>
                <span className="font-medium">{farmer.landMapData.eudrCompliance.complianceScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Report ID:</span>
                <span className="font-mono text-xs">{farmer.landMapData.eudrCompliance.reportId}</span>
              </div>
              <div className="text-xs text-green-700">
                Generated: {new Date(farmer.landMapData.eudrCompliance.generatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Deforestation Report */}
        {hasDeforestationReport && (
          <div className="mt-4 p-3 bg-amber-50 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Deforestation Analysis
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Forest Loss Detected:</span>
                <Badge className={farmer.landMapData.deforestationReport.forestLossDetected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {farmer.landMapData.deforestationReport.forestLossDetected ? 'YES' : 'NO'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Biodiversity Impact:</span>
                <span className="font-medium capitalize">{farmer.landMapData.deforestationReport.biodiversityImpact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Carbon Loss:</span>
                <span className="font-medium">{farmer.landMapData.deforestationReport.carbonStockLoss} tCO₂</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Report ID:</span>
                <span className="font-mono text-xs">{farmer.landMapData.deforestationReport.reportId}</span>
              </div>
              <div className="text-xs text-amber-700">
                Generated: {new Date(farmer.landMapData.deforestationReport.generatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        {/* Reports Available */}
        {(hasEudrReport || hasDeforestationReport) && (
          <div className="mt-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {hasEudrReport && hasDeforestationReport ? '2 Reports Available' : '1 Report Available'}
              </span>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onViewReports}
              className="text-lacra-green border-lacra-green hover:bg-lacra-green hover:text-white"
            >
              <Download className="h-3 w-3 mr-1" />
              View Reports
            </Button>
          </div>
        )}

        {/* No Reports Message */}
        {!hasEudrReport && !hasDeforestationReport && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              No compliance reports generated yet. Complete land mapping to generate EUDR and deforestation analysis reports.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}