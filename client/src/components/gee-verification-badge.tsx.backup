import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Satellite, Shield, CheckCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface GeeVerificationBadgeProps {
  coordinates?: string;
  plotId?: string;
  commodityType?: string;
  className?: string;
  showDetails?: boolean;
}

/**
 * 🛰️ GOOGLE EARTH ENGINE VERIFICATION BADGE
 * Additive component for enhanced EUDR compliance verification
 * Does not interfere with existing land mapping functionality
 */
export function GeeVerificationBadge({
  coordinates,
  plotId,
  commodityType = "mixed",
  className = "",
  showDetails = true
}: GeeVerificationBadgeProps) {
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);

  // Parse coordinates from string format
  const parsedCoordinates = coordinates ? 
    JSON.parse(coordinates).map((coord: any) => [coord.lng || coord.lon, coord.lat]) : 
    null;

  // Fetch GEE analysis when coordinates are available
  const { data: geeAnalysis, isLoading: isAnalyzing } = useQuery({
    queryKey: [`/api/gee/analyze-deforestation`, plotId],
    queryFn: () => {
      if (!parsedCoordinates) return Promise.resolve(null);
      
      return apiRequest("/api/gee/analyze-deforestation", {
        method: "POST",
        body: JSON.stringify({
          coordinates: parsedCoordinates,
          plotId,
          commodityType
        })
      });
    },
    enabled: !!parsedCoordinates && showDetails,
    retry: false,
    staleTime: 300000, // 5 minutes cache
  });

  // Don't render if no coordinates
  if (!coordinates || !parsedCoordinates) {
    return null;
  }

  // Determine verification status
  const getVerificationStatus = () => {
    if (isAnalyzing) {
      return {
        status: 'analyzing',
        color: 'bg-blue-100 text-blue-800',
        icon: Loader2,
        text: 'Analyzing...'
      };
    }

    if (!geeAnalysis?.data) {
      return {
        status: 'unknown',
        color: 'bg-gray-100 text-gray-800',
        icon: Satellite,
        text: 'No Analysis'
      };
    }

    const analysis = geeAnalysis.data;

    if (analysis.eudrCompliant) {
      return {
        status: 'verified',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        text: 'GEE Verified'
      };
    } else if (analysis.riskScore > 50) {
      return {
        status: 'high-risk',
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        text: 'Risk Detected'
      };
    } else {
      return {
        status: 'medium-risk',
        color: 'bg-yellow-100 text-yellow-800',
        icon: AlertTriangle,
        text: 'Requires Review'
      };
    }
  };

  const verification = getVerificationStatus();
  const IconComponent = verification.icon;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Badge className={`${verification.color} flex items-center gap-1`}>
        <IconComponent className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
        {verification.text}
      </Badge>

      {showDetails && geeAnalysis?.data && (
        <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
              <Info className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5 text-blue-600" />
                Google Earth Engine Analysis
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Compliance Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">EUDR Compliance</label>
                  <div className="flex items-center gap-2">
                    {geeAnalysis.data.eudrCompliant ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={geeAnalysis.data.eudrCompliant ? 'text-green-600' : 'text-red-600'}>
                      {geeAnalysis.data.eudrCompliant ? 'Compliant' : 'Non-Compliant'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Score</label>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          geeAnalysis.data.riskScore < 25 ? 'bg-green-500' :
                          geeAnalysis.data.riskScore < 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${geeAnalysis.data.riskScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{geeAnalysis.data.riskScore}%</span>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deforestation Area</label>
                  <p className="text-sm">{geeAnalysis.data.deforestationArea.toFixed(3)} hectares</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Confidence Score</label>
                  <p className="text-sm">{geeAnalysis.data.confidence.toFixed(1)}%</p>
                </div>
              </div>

              {/* Verification Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium">GEE Verification Code</label>
                <code className="block bg-gray-100 p-2 rounded text-sm font-mono">
                  {geeAnalysis.data.geeVerificationCode}
                </code>
              </div>

              {/* Last Deforestation */}
              {geeAnalysis.data.lastDeforestationDate && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Deforestation Detected</label>
                  <p className="text-sm text-red-600">
                    {new Date(geeAnalysis.data.lastDeforestationDate).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Analysis Timestamp */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Analysis Date</label>
                <p className="text-xs text-gray-500">
                  {new Date(geeAnalysis.data.analysisTimestamp).toLocaleString()}
                </p>
              </div>

              {/* Data Source */}
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Data Source:</strong> {geeAnalysis.source} - {geeAnalysis.analysisType}
                  <br />
                  <strong>Methodology:</strong> Hansen Global Forest Change + Sentinel-2 NDVI Analysis
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

/**
 * 🌍 COUNTY-LEVEL GEE MONITORING SUMMARY
 * For regional oversight dashboards
 */
export function GeeCountyMonitoringBadge({ county }: { county: string }) {
  const [showCountyDialog, setShowCountyDialog] = useState(false);

  const { data: countyStats, isLoading } = useQuery({
    queryKey: [`/api/gee/county-stats/${county}`],
    retry: false,
    staleTime: 600000, // 10 minutes cache
  });

  return (
    <Dialog open={showCountyDialog} onOpenChange={setShowCountyDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Satellite className="h-4 w-4" />
          GEE Regional Monitor
          {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-blue-600" />
            {county} County - GEE Monitoring
          </DialogTitle>
        </DialogHeader>
        
        {countyStats && (countyStats as any).data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Total Area</label>
                <p className="text-lg font-bold">{Math.round((countyStats as any).data.totalArea).toLocaleString()} ha</p>
              </div>
              <div>
                <label className="text-sm font-medium">Deforestation</label>
                <p className="text-lg font-bold text-red-600">{Math.round((countyStats as any).data.deforestationArea)} ha</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trend Analysis</label>
              <Badge className={
                (countyStats as any).data.trendAnalysis.trend === 'increasing' ? 'bg-red-100 text-red-800' :
                (countyStats as any).data.trendAnalysis.trend === 'decreasing' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }>
                {(countyStats as any).data.trendAnalysis.trend.toUpperCase()} 
                ({(countyStats as any).data.trendAnalysis.changeRate > 0 ? '+' : ''}
                {(countyStats as any).data.trendAnalysis.changeRate.toFixed(1)}%)
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Deforestation Hotspots</label>
              <p className="text-sm">{(countyStats as any).data.hotspots.length} areas detected</p>
              <div className="flex gap-1">
                {(countyStats as any).data.hotspots.map((hotspot: any, index: number) => (
                  <Badge 
                    key={index}
                    className={
                      hotspot.severity === 'high' ? 'bg-red-100 text-red-800' :
                      hotspot.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {hotspot.severity}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}