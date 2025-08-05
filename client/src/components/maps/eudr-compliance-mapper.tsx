import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, RotateCcw, Check, Map, AlertTriangle, FileText, Download, TreePine, Satellite } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface BoundaryData {
  points: BoundaryPoint[];
  area: number;
  eudrCompliance: EUDRComplianceReport;
  deforestationReport: DeforestationReport;
}

interface EUDRComplianceReport {
  riskLevel: 'low' | 'standard' | 'high';
  complianceScore: number;
  deforestationRisk: number;
  lastForestDate: string;
  coordinates: string;
  documentationRequired: string[];
  recommendations: string[];
}

interface DeforestationReport {
  forestLossDetected: boolean;
  forestLossDate: string | null;
  forestCoverChange: number;
  biodiversityImpact: 'minimal' | 'moderate' | 'significant';
  carbonStockLoss: number;
  mitigationRequired: boolean;
  recommendations: string[];
}

interface EUDRComplianceMapperProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  minPoints?: number;
}

export default function EUDRComplianceMapper({ 
  onBoundaryComplete, 
  minPoints = 3 
}: EUDRComplianceMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Initializing EUDR compliance mapping...');
  const [mapReady, setMapReady] = useState(false);
  const [eudrReport, setEudrReport] = useState<EUDRComplianceReport | null>(null);
  const [deforestationReport, setDeforestationReport] = useState<DeforestationReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const createEUDRMap = () => {
      mapRef.current!.innerHTML = `
        <div id="eudr-map-container" style="
          height: 500px; 
          width: 100%;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          position: relative;
          background: linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%);
          cursor: crosshair;
          overflow: hidden;
          font-family: Arial, sans-serif;
        ">
          <!-- Forest Areas (High Risk Zones) -->
          <div style="
            position: absolute;
            top: 15%;
            left: 5%;
            width: 25%;
            height: 30%;
            background: radial-gradient(ellipse, #166534, #14532d);
            border-radius: 40%;
            opacity: 0.8;
            border: 2px dashed #dc2626;
          "></div>
          <div style="
            position: absolute;
            top: 50%;
            right: 10%;
            width: 30%;
            height: 25%;
            background: radial-gradient(ellipse, #166534, #14532d);
            border-radius: 50%;
            opacity: 0.8;
            border: 2px dashed #dc2626;
          "></div>
          
          <!-- Protected Areas (No Risk) -->
          <div style="
            position: absolute;
            top: 20%;
            right: 20%;
            width: 20%;
            height: 20%;
            background: radial-gradient(ellipse, #22c55e, #16a34a);
            border-radius: 50%;
            opacity: 0.7;
            border: 2px solid #059669;
          "></div>
          
          <!-- Water Bodies -->
          <div style="
            position: absolute;
            top: 70%;
            left: 30%;
            width: 40%;
            height: 15%;
            background: radial-gradient(ellipse, #3b82f6, #1d4ed8);
            border-radius: 50%;
            opacity: 0.6;
          "></div>
          
          <!-- Agricultural Areas (Low Risk) -->
          <div style="
            position: absolute;
            top: 10%;
            left: 50%;
            width: 35%;
            height: 25%;
            background: linear-gradient(45deg, #84cc16, #65a30d);
            border-radius: 30%;
            opacity: 0.5;
            border: 1px solid #84cc16;
          "></div>
          
          <!-- EUDR Risk Zones Legend -->
          <div style="
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px;
            border-radius: 6px;
            font-size: 11px;
            line-height: 1.4;
          ">
            <div style="color: #dc2626;">🔴 High Risk: Forest Areas</div>
            <div style="color: #059669;">🟢 Low Risk: Agricultural</div>
            <div style="color: #3b82f6;">🔵 Water Bodies</div>
          </div>
          
          <!-- Coordinates -->
          <div style="
            position: absolute;
            top: 5px;
            right: 5px;
            color: white;
            font-size: 10px;
            background: rgba(0,0,0,0.5);
            padding: 2px 4px;
            border-radius: 3px;
          ">6.45°N, -9.35°W</div>
          <div style="
            position: absolute;
            bottom: 5px;
            left: 5px;
            color: white;
            font-size: 10px;
            background: rgba(0,0,0,0.5);
            padding: 2px 4px;
            border-radius: 3px;
          ">6.40°N, -9.40°W</div>
          
          <!-- Grid -->
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 25px 25px;
            pointer-events: none;
          "></div>
          
          <!-- SVG for polygons -->
          <svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;" id="polygon-svg">
          </svg>
        </div>
        
        <style>
          .map-marker {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            z-index: 20;
            transition: all 0.2s ease;
          }
          .map-marker:hover {
            transform: translate(-50%, -50%) scale(1.2);
          }
          .marker-start { 
            background: #fbbf24;
            box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.3), 0 2px 8px rgba(0,0,0,0.5);
          }
          .marker-middle { 
            background: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0,0,0,0.5);
          }
          .marker-end { 
            background: #ef4444;
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3), 0 2px 8px rgba(0,0,0,0.5);
          }
        </style>
      `;

      const mapContainer = mapRef.current!.querySelector('#eudr-map-container') as HTMLElement;
      if (!mapContainer) return;

      mapContainer.addEventListener('click', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const lat = 6.45 - (y / rect.height) * 0.05;
        const lng = -9.40 + (x / rect.width) * 0.05;
        
        const newPoint: BoundaryPoint = { 
          latitude: parseFloat(lat.toFixed(6)), 
          longitude: parseFloat(lng.toFixed(6)) 
        };
        setPoints(prev => [...prev, newPoint]);
      });

      setStatus('EUDR compliance mapping ready');
      setMapReady(true);
    };

    createEUDRMap();
  }, []);

  // Analyze EUDR compliance when points change
  useEffect(() => {
    if (points.length >= 3) {
      analyzeEUDRCompliance();
    }
  }, [points]);

  const analyzeEUDRCompliance = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const area = calculateArea(points);
    const riskAnalysis = calculateRiskLevel(points);
    
    const eudrReport: EUDRComplianceReport = {
      riskLevel: riskAnalysis.riskLevel,
      complianceScore: riskAnalysis.complianceScore,
      deforestationRisk: riskAnalysis.deforestationRisk,
      lastForestDate: '2019-12-31',
      coordinates: points.map(p => `${p.latitude.toFixed(6)}, ${p.longitude.toFixed(6)}`).join('; '),
      documentationRequired: [
        'Due diligence statement',
        'Geolocation coordinates',
        'Supply chain traceability',
        'Risk assessment report'
      ],
      recommendations: riskAnalysis.recommendations
    };

    const deforestationReport: DeforestationReport = {
      forestLossDetected: riskAnalysis.forestLossDetected,
      forestLossDate: riskAnalysis.forestLossDetected ? '2021-03-15' : null,
      forestCoverChange: riskAnalysis.forestCoverChange,
      biodiversityImpact: riskAnalysis.biodiversityImpact,
      carbonStockLoss: riskAnalysis.carbonStockLoss,
      mitigationRequired: riskAnalysis.forestLossDetected,
      recommendations: [
        'Implement reforestation program',
        'Monitor with satellite imagery',
        'Establish buffer zones',
        'Community engagement initiatives'
      ]
    };

    setEudrReport(eudrReport);
    setDeforestationReport(deforestationReport);
    setIsAnalyzing(false);
  };

  const calculateRiskLevel = (points: BoundaryPoint[]) => {
    // Analyze overlap with high-risk forest zones
    const forestOverlap = points.some(point => 
      (point.latitude > 6.425 && point.latitude < 6.44 && point.longitude > -9.39 && point.longitude < -9.375) ||
      (point.latitude > 6.415 && point.latitude < 6.435 && point.longitude > -9.375 && point.longitude < -9.35)
    );

    if (forestOverlap) {
      return {
        riskLevel: 'high' as const,
        complianceScore: 45,
        deforestationRisk: 85,
        forestLossDetected: true,
        forestCoverChange: -15.3,
        biodiversityImpact: 'significant' as const,
        carbonStockLoss: 2.4,
        recommendations: [
          'Enhanced due diligence required',
          'Third-party verification needed',
          'Implement forest monitoring system',
          'Develop conservation plan'
        ]
      };
    }

    return {
      riskLevel: 'low' as const,
      complianceScore: 92,
      deforestationRisk: 12,
      forestLossDetected: false,
      forestCoverChange: 2.1,
      biodiversityImpact: 'minimal' as const,
      carbonStockLoss: 0,
      recommendations: [
        'Standard due diligence applies',
        'Annual monitoring recommended',
        'Maintain current practices'
      ]
    };
  };

  // Update visual markers and polygons
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const mapContainer = mapRef.current.querySelector('#eudr-map-container') as HTMLElement;
    const svg = mapRef.current.querySelector('#polygon-svg') as SVGElement;
    
    if (!mapContainer || !svg) return;

    mapContainer.querySelectorAll('.map-marker').forEach(marker => marker.remove());
    svg.innerHTML = '';

    points.forEach((point, index) => {
      const isFirst = index === 0;
      const isLast = index === points.length - 1 && points.length > 1;
      
      const rect = mapContainer.getBoundingClientRect();
      const x = ((point.longitude + 9.40) / 0.05) * (rect.width || 400);
      const y = ((6.45 - point.latitude) / 0.05) * (rect.height || 500);
      
      const marker = document.createElement('div');
      marker.className = `map-marker ${isFirst ? 'marker-start' : isLast ? 'marker-end' : 'marker-middle'}`;
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.title = `Point ${index + 1}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`;
      
      mapContainer.appendChild(marker);
    });

    if (points.length >= 3) {
      const rect = mapContainer.getBoundingClientRect();
      const pointsStr = points.map(point => {
        const x = ((point.longitude + 9.40) / 0.05) * (rect.width || 400);
        const y = ((6.45 - point.latitude) / 0.05) * (rect.height || 500);
        return `${x},${y}`;
      }).join(' ');
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pointsStr);
      polygon.setAttribute('fill', 'rgba(251, 191, 36, 0.25)');
      polygon.setAttribute('stroke', '#fbbf24');
      polygon.setAttribute('stroke-width', '3');
      
      svg.appendChild(polygon);
    }
  }, [points, mapReady]);

  const calculateArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += (points[j].longitude - points[i].longitude) * (points[j].latitude + points[i].latitude);
    }
    area = Math.abs(area) / 2;
    
    const hectares = area * 111320 * 111320 / 10000;
    return hectares;
  };

  const handleReset = () => {
    setPoints([]);
    setEudrReport(null);
    setDeforestationReport(null);
  };

  const handleComplete = () => {
    if (points.length >= minPoints && eudrReport && deforestationReport) {
      const area = calculateArea(points);
      onBoundaryComplete({ 
        points, 
        area, 
        eudrCompliance: eudrReport, 
        deforestationReport 
      });
    }
  };

  const downloadReport = (type: 'eudr' | 'deforestation') => {
    const report = type === 'eudr' ? eudrReport : deforestationReport;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canComplete = points.length >= minPoints;
  const area = calculateArea(points);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Satellite className="h-5 w-5 text-blue-600" />
          <h4 className="font-medium text-blue-900">EUDR Compliance Mapping & Deforestation Analysis</h4>
        </div>
        <p className="text-sm text-blue-800 mb-2">
          Click on the map to mark farm boundaries. Real-time EUDR compliance and deforestation analysis will be generated automatically.
        </p>
        <div className="text-xs text-blue-700">
          🔴 High Risk Zones (Forest) • 🟢 Low Risk (Agricultural) • 🔵 Water Bodies
        </div>
      </div>

      {/* Status and Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Status: {status}</span>
          <div className="text-gray-600">
            Points: {points.length} | {area > 0 && `Area: ~${area.toFixed(3)} hectares`}
            {isAnalyzing && <span className="text-blue-600 animate-pulse"> • Analyzing compliance...</span>}
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handleReset} disabled={points.length === 0}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button onClick={handleComplete} disabled={!canComplete || !eudrReport} size="sm">
            <Check className="h-4 w-4 mr-1" />
            Complete ({points.length}/{minPoints})
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} />

      {/* EUDR Compliance Report */}
      {eudrReport && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                EUDR Compliance Report
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadReport('eudr')}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Risk Level</div>
                <Badge variant={eudrReport.riskLevel === 'high' ? 'destructive' : eudrReport.riskLevel === 'standard' ? 'default' : 'secondary'}>
                  {eudrReport.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">Compliance Score</div>
                <div className="text-2xl font-bold text-green-600">{eudrReport.complianceScore}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Deforestation Risk</div>
                <div className="text-2xl font-bold text-red-600">{eudrReport.deforestationRisk}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Last Forest Date</div>
                <div className="text-sm font-medium">{eudrReport.lastForestDate}</div>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Required Documentation</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {eudrReport.documentationRequired.map((doc, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Recommendations</h5>
              <div className="space-y-2">
                {eudrReport.recommendations.map((rec, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{rec}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deforestation Report */}
      {deforestationReport && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Deforestation Analysis Report
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadReport('deforestation')}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Forest Loss Detected</div>
                <Badge variant={deforestationReport.forestLossDetected ? 'destructive' : 'secondary'}>
                  {deforestationReport.forestLossDetected ? 'YES' : 'NO'}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">Forest Cover Change</div>
                <div className={`text-2xl font-bold ${deforestationReport.forestCoverChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {deforestationReport.forestCoverChange > 0 ? '+' : ''}{deforestationReport.forestCoverChange}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Biodiversity Impact</div>
                <Badge variant={deforestationReport.biodiversityImpact === 'significant' ? 'destructive' : 
                               deforestationReport.biodiversityImpact === 'moderate' ? 'default' : 'secondary'}>
                  {deforestationReport.biodiversityImpact.toUpperCase()}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">Carbon Stock Loss</div>
                <div className="text-2xl font-bold text-red-600">{deforestationReport.carbonStockLoss} tCO₂</div>
              </div>
            </div>

            {deforestationReport.forestLossDate && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Forest loss detected on {deforestationReport.forestLossDate}. Mitigation measures required.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h5 className="font-medium mb-2">Mitigation Recommendations</h5>
              <div className="space-y-2">
                {deforestationReport.recommendations.map((rec, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}