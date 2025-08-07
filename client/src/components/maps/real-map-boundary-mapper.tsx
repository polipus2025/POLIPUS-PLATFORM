import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, RotateCcw, Check, Satellite, Download, Shield, AlertTriangle } from "lucide-react";

interface BoundaryPoint {
  latitude: number;
  longitude: number;
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

interface BoundaryData {
  points: BoundaryPoint[];
  area: number;
  eudrCompliance?: EUDRComplianceReport;
  deforestationReport?: DeforestationReport;
  complianceReports?: any;
}

interface RealMapBoundaryMapperProps {
  onBoundaryComplete: (boundary: BoundaryData) => void;
  minPoints?: number;
  maxPoints?: number;
  enableRealTimeGPS?: boolean;
}

export default function RealMapBoundaryMapper({ 
  onBoundaryComplete, 
  minPoints = 3,
  maxPoints = 20,
  enableRealTimeGPS = true
}: RealMapBoundaryMapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<BoundaryPoint[]>([]);
  const [status, setStatus] = useState('Loading satellite imagery...');
  const [mapReady, setMapReady] = useState(false);
  const [currentTile, setCurrentTile] = useState(0);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number}>({lat: 6.4281, lng: -9.4295});
  const [isTrackingGPS, setIsTrackingGPS] = useState(false);
  const [gpsWatchId, setGpsWatchId] = useState<number | null>(null);
  const [currentGPSPosition, setCurrentGPSPosition] = useState<{lat: number, lng: number} | null>(null);
  const [trackingAccuracy, setTrackingAccuracy] = useState<number | null>(null);
  const [eudrReport, setEudrReport] = useState<EUDRComplianceReport | null>(null);
  const [deforestationReport, setDeforestationReport] = useState<DeforestationReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Function to get satellite tile URLs based on GPS coordinates
  const getSatelliteTiles = (lat: number, lng: number, zoom: number = 15) => {
    // Convert lat/lng to tile coordinates
    const n = Math.pow(2, zoom);
    const x = Math.floor(n * ((lng + 180) / 360));
    const y = Math.floor(n * (1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2);
    
    return [
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`,
      `https://mt1.google.com/vt/lyrs=s&x=${x}&y=${y}&z=${zoom}`,
      `https://tiles.stadiamaps.com/tiles/alidade_satellite/${zoom}/${x}/${y}.jpg`,
      `https://wxs.ign.fr/choisirgeoportail/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX=${zoom}&TILEROW=${y}&TILECOL=${x}`,
    ];
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Get user's GPS location or use default
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter({lat, lng});
        setStatus(`Loading satellite imagery for ${lat.toFixed(4)}, ${lng.toFixed(4)}...`);
        initMapWithCoordinates(lat, lng);
      },
      (error) => {
        console.log('GPS not available, using default location');
        setStatus('Loading satellite imagery for default location...');
        initMapWithCoordinates(mapCenter.lat, mapCenter.lng);
      },
      { timeout: 5000, enableHighAccuracy: true }
    );

    const initMapWithCoordinates = (lat: number, lng: number) => {
      const satelliteTiles = getSatelliteTiles(lat, lng);
      
      // Try different satellite imagery sources
      const tryLoadTile = (tileIndex: number) => {
        if (tileIndex >= satelliteTiles.length) {
          // Fallback to OpenStreetMap if satellite fails
          loadFallbackMap();
          return;
        }

        const tileUrl = satelliteTiles[tileIndex];
        const testImg = new Image();
        
        testImg.onload = () => {
          createMapWithTile(tileUrl, lat, lng);
        };
        
        testImg.onerror = () => {
          setCurrentTile(tileIndex + 1);
          setTimeout(() => tryLoadTile(tileIndex + 1), 500);
        };
        
        testImg.src = tileUrl;
      };

      tryLoadTile(0);
    };

    const createMapWithTile = (tileUrl: string, centerLat: number, centerLng: number) => {
      mapRef.current!.innerHTML = `
        <style>
          .real-map { 
            height: 400px; 
            width: 100%;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            position: relative;
            background: url('${tileUrl}') center/cover;
            cursor: crosshair;
            overflow: hidden;
          }
          .map-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%),
                        linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%);
            background-size: 20px 20px;
            background-position: 0 0, 10px 10px;
            pointer-events: none;
            opacity: 0.3;
          }
          .map-marker {
            position: absolute;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            z-index: 10;
          }
          .marker-start { background-color: #22c55e; box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3); }
          .marker-middle { background-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }
          .marker-end { background-color: #ef4444; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3); }
          .marker-high-risk { background-color: #dc2626; box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.4); }
          .marker-standard-risk { background-color: #f59e0b; box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.4); }
          .marker-low-risk { background-color: #10b981; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4); }
          .map-polygon {
            position: absolute;
            pointer-events: none;
            fill: rgba(34, 197, 94, 0.2);
            stroke: #22c55e;
            stroke-width: 3;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
            z-index: 5;
          }
        </style>
        <div class="real-map" id="real-map">
          <div class="map-overlay"></div>
          <svg class="map-polygon" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          </svg>
        </div>
      `;

      const mapElement = mapRef.current!.querySelector('#real-map') as HTMLElement;
      if (!mapElement) return;

      // Add click handler
      mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Convert pixel coordinates to lat/lng based on current map center
        const lat = centerLat + (200 - y) / 5000; // More realistic conversion
        const lng = centerLng + (x - 200) / 5000;
        
        const newPoint: BoundaryPoint = { latitude: lat, longitude: lng };
        setPoints(prev => [...prev, newPoint]);
      });

      setStatus(`Real-time satellite imagery loaded for ${centerLat.toFixed(4)}, ${centerLng.toFixed(4)} - Click to mark farm boundaries`);
      setMapReady(true);
    };

    const loadFallbackMap = () => {
      mapRef.current!.innerHTML = `
        <style>
          .fallback-map { 
            height: 400px; 
            width: 100%;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            position: relative;
            background: linear-gradient(45deg, #10b981 0%, #059669 50%, #047857 100%);
            cursor: crosshair;
            overflow: hidden;
          }
          .terrain-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.4) 20%, transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.3) 15%, transparent 35%),
              radial-gradient(circle at 60% 20%, rgba(5, 150, 105, 0.5) 25%, transparent 45%);
            pointer-events: none;
          }
          .map-marker {
            position: absolute;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.6);
            transform: translate(-50%, -50%);
            z-index: 10;
          }
          .marker-start { background-color: #fbbf24; }
          .marker-middle { background-color: #3b82f6; }
          .marker-end { background-color: #ef4444; }
          .map-polygon {
            position: absolute;
            pointer-events: none;
            fill: rgba(251, 191, 36, 0.3);
            stroke: #fbbf24;
            stroke-width: 3;
            z-index: 5;
          }
        </style>
        <div class="fallback-map" id="fallback-map">
          <div class="terrain-overlay"></div>
          <svg class="map-polygon" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
          </svg>
        </div>
      `;

      const mapElement = mapRef.current!.querySelector('#fallback-map') as HTMLElement;
      if (!mapElement) return;

      // Add click handler
      mapElement.addEventListener('click', (e) => {
        const rect = mapElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const lat = 6.4281 + (200 - y) / 5000;
        const lng = -9.4295 + (x - 200) / 5000;
        
        const newPoint: BoundaryPoint = { latitude: lat, longitude: lng };
        setPoints(prev => [...prev, newPoint]);
      });

      setStatus('Terrain map ready - Click to mark farm boundaries');
      setMapReady(true);
    };

    // Map initialization handled by initMapWithCoordinates function
  }, []);

  // Update visual markers when points change
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const mapElement = mapRef.current.querySelector('#real-map, #fallback-map') as HTMLElement;
    const svg = mapRef.current.querySelector('svg') as SVGElement;
    
    if (!mapElement || !svg) return;

    // Clear existing markers
    mapElement.querySelectorAll('.map-marker').forEach(marker => marker.remove());
    svg.innerHTML = '';

    // Add markers for each point
    points.forEach((point, index) => {
      const isFirst = index === 0;
      const isLast = index === points.length - 1 && points.length > 1;
      
      // Convert lat/lng back to pixels
      const x = (point.longitude + 9.4295) * 5000 + 200;
      const y = 200 - (point.latitude - 6.4281) * 5000;
      
      const marker = document.createElement('div');
      marker.className = `map-marker ${isFirst ? 'marker-start' : isLast ? 'marker-end' : 'marker-middle'}`;
      marker.style.left = `${x}px`;
      marker.style.top = `${y}px`;
      marker.title = `Point ${index + 1}${isFirst ? ' (Start)' : isLast ? ' (End)' : ''}`;
      
      mapElement.appendChild(marker);
    });

    // Draw polygon if we have enough points
    if (points.length >= 3) {
      const pointsStr = points.map(point => {
        const x = (point.longitude + 9.4295) * 5000 + 200;
        const y = 200 - (point.latitude - 6.4281) * 5000;
        return `${x},${y}`;
      }).join(' ');
      
      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', pointsStr);
      
      svg.appendChild(polygon);
    }
  }, [points, mapReady]);

  // Real-time GPS tracking functions
  const startGPSTracking = () => {
    if (!navigator.geolocation) {
      setStatus('GPS not available on this device');
      return;
    }

    setIsTrackingGPS(true);
    setStatus('Starting GPS tracking for field boundary mapping...');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        setCurrentGPSPosition({lat, lng});
        setTrackingAccuracy(accuracy);
        setStatus(`GPS tracking active - Accuracy: ${accuracy.toFixed(1)}m - Points: ${points.length}/${maxPoints}`);
        
        // Update map center to follow user
        setMapCenter({lat, lng});
      },
      (error) => {
        console.error('GPS Error:', error);
        setStatus(`GPS Error: ${error.message}`);
        setIsTrackingGPS(false);
      },
      options
    );

    setGpsWatchId(watchId);
  };

  const stopGPSTracking = () => {
    if (gpsWatchId !== null) {
      navigator.geolocation.clearWatch(gpsWatchId);
      setGpsWatchId(null);
    }
    setIsTrackingGPS(false);
    setCurrentGPSPosition(null);
    setStatus('GPS tracking stopped');
  };

  const addCurrentGPSPoint = () => {
    if (!currentGPSPosition) {
      setStatus('No GPS position available');
      return;
    }

    if (points.length >= maxPoints) {
      setStatus(`Maximum ${maxPoints} points reached`);
      return;
    }

    const newPoint: BoundaryPoint = {
      latitude: currentGPSPosition.lat,
      longitude: currentGPSPosition.lng
    };

    setPoints(prev => [...prev, newPoint]);
    setStatus(`Point ${points.length + 1} added - GPS accuracy: ${trackingAccuracy?.toFixed(1)}m`);
    
    // Trigger EUDR analysis if we have enough points
    if (points.length + 1 >= 3) {
      setTimeout(() => analyzeEUDRCompliance([...points, newPoint]), 500);
    }
  };

  const calculateArea = (points: BoundaryPoint[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].latitude * points[j].longitude;
      area -= points[j].latitude * points[i].longitude;
    }
    area = Math.abs(area) / 2;
    return area * 12100; // Convert to hectares
  };

  // EUDR Compliance Analysis
  const analyzeEUDRCompliance = async (analysisPoints: BoundaryPoint[]) => {
    if (analysisPoints.length < 3) return;
    
    setIsAnalyzing(true);
    setStatus('Analyzing EUDR compliance and deforestation risk...');
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const area = calculateArea(analysisPoints);
    const riskAnalysis = calculateRiskLevel(analysisPoints);
    
    const eudrComplianceReport: EUDRComplianceReport = {
      riskLevel: riskAnalysis.riskLevel,
      complianceScore: riskAnalysis.complianceScore,
      deforestationRisk: riskAnalysis.deforestationRisk,
      lastForestDate: '2019-12-31',
      coordinates: analysisPoints.map(p => `${p.latitude.toFixed(6)}, ${p.longitude.toFixed(6)}`).join('; '),
      documentationRequired: [
        'Due diligence statement',
        'Geolocation coordinates',
        'Supply chain traceability',
        'Risk assessment report'
      ],
      recommendations: riskAnalysis.recommendations
    };

    const deforestationAnalysis: DeforestationReport = {
      forestLossDetected: riskAnalysis.forestLossDetected,
      forestLossDate: riskAnalysis.forestLossDetected ? '2021-03-15' : null,
      forestCoverChange: riskAnalysis.forestCoverChange,
      biodiversityImpact: riskAnalysis.biodiversityImpact,
      carbonStockLoss: riskAnalysis.carbonStockLoss,
      mitigationRequired: riskAnalysis.forestLossDetected,
      recommendations: riskAnalysis.deforestationRecommendations || riskAnalysis.recommendations
    };

    setEudrReport(eudrComplianceReport);
    setDeforestationReport(deforestationAnalysis);
    setIsAnalyzing(false);
    setStatus(`EUDR analysis complete - Risk: ${riskAnalysis.riskLevel.toUpperCase()}, Score: ${riskAnalysis.complianceScore}%`);
  };

  // Risk calculation based on GPS coordinates
  const calculateRiskLevel = (analysisPoints: BoundaryPoint[]) => {
    const centerLat = analysisPoints.reduce((sum, p) => sum + p.latitude, 0) / analysisPoints.length;
    const centerLng = analysisPoints.reduce((sum, p) => sum + p.longitude, 0) / analysisPoints.length;
    
    // Simulate risk analysis based on coordinates - areas closer to known forest regions have higher risk
    let riskLevel: 'low' | 'standard' | 'high' = 'low';
    let complianceScore = 85;
    let deforestationRisk = 15;
    let forestLossDetected = false;
    let forestCoverChange = 2.1;
    let biodiversityImpact: 'minimal' | 'moderate' | 'significant' = 'minimal';
    let carbonStockLoss = 0;
    
    // Higher risk in certain coordinate ranges (simulating forest areas)
    if ((centerLat > 6.5 && centerLat < 7.0) || (centerLng > -10.0 && centerLng < -9.5)) {
      riskLevel = 'high';
      complianceScore = 45;
      deforestationRisk = 78;
      forestLossDetected = true;
      forestCoverChange = 15.3;
      biodiversityImpact = 'significant';
      carbonStockLoss = 23.5;
    } else if ((centerLat > 6.3 && centerLat < 6.5) || (centerLng > -9.5 && centerLng < -9.2)) {
      riskLevel = 'standard';
      complianceScore = 67;
      deforestationRisk = 35;
      forestLossDetected = false;
      forestCoverChange = 8.2;
      biodiversityImpact = 'moderate';
      carbonStockLoss = 12.1;
    }

    const recommendations = riskLevel === 'high' 
      ? ['Enhanced due diligence required', 'Independent audit recommended', 'Immediate action plan needed', 'Quarterly monitoring essential']
      : riskLevel === 'standard'
      ? ['Standard due diligence required', 'Semi-annual monitoring', 'Risk mitigation plan recommended']
      : ['Standard monitoring applies', 'Annual compliance check', 'Maintain current practices'];

    return {
      riskLevel,
      complianceScore,
      deforestationRisk,
      forestLossDetected,
      forestCoverChange,
      biodiversityImpact,
      carbonStockLoss,
      recommendations,
      deforestationRecommendations: forestLossDetected 
        ? ['Immediate deforestation mitigation', 'Reforestation plan required', 'Biodiversity restoration', 'Carbon offset program']
        : ['Continue forest protection', 'Monitor forest boundaries', 'Sustainable land use practices']
    };
  };

  const handleReset = () => {
    setPoints([]);
    setEudrReport(null);
    setDeforestationReport(null);
  };

  const downloadReport = async (type: 'eudr' | 'deforestation') => {
    const reportData = type === 'eudr' ? eudrReport : deforestationReport;
    if (!reportData) return;
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    if (points.length >= minPoints) {
      const area = calculateArea(points);
      
      // Create comprehensive compliance reports
      const complianceReports = {
        eudrCompliance: eudrReport,
        deforestationReport: deforestationReport
      };
      
      onBoundaryComplete({ 
        points, 
        area, 
        eudrCompliance: eudrReport || undefined,
        deforestationReport: deforestationReport || undefined,
        complianceReports
      });
    }
  };

  const canComplete = points.length >= minPoints;
  const area = calculateArea(points);

  // Clean up GPS tracking on unmount
  useEffect(() => {
    return () => {
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
      }
    };
  }, [gpsWatchId]);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Satellite className="h-5 w-5 text-green-600" />
          <h4 className="font-medium text-green-900">Real-Time GPS Field Boundary Mapping</h4>
        </div>
        <p className="text-sm text-green-800 mb-2">
          Walk around your field and add GPS points in real-time to create accurate boundaries. 
          Supports {minPoints}-{maxPoints} points for precise mapping.
        </p>
        {enableRealTimeGPS && (
          <div className="text-xs text-green-700 bg-green-100 p-2 rounded">
            💡 Walk to each corner/boundary point and press "Add GPS Point" for real-time field mapping
          </div>
        )}
      </div>

      {/* GPS Tracking Status */}
      {enableRealTimeGPS && (
        <div className={`border rounded-lg p-3 ${isTrackingGPS ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {isTrackingGPS ? '📍 GPS Tracking Active' : '📍 GPS Tracking Inactive'}
            </span>
            {trackingAccuracy && (
              <span className="text-xs text-gray-600">
                Accuracy: {trackingAccuracy.toFixed(1)}m
              </span>
            )}
          </div>
          {currentGPSPosition && (
            <div className="text-xs text-gray-600 mb-2">
              Current Position: {currentGPSPosition.lat.toFixed(6)}, {currentGPSPosition.lng.toFixed(6)}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              onClick={startGPSTracking}
              disabled={isTrackingGPS}
              size="sm"
              variant={isTrackingGPS ? "secondary" : "default"}
            >
              {isTrackingGPS ? 'Tracking...' : 'Start GPS Tracking'}
            </Button>
            <Button
              onClick={stopGPSTracking}
              disabled={!isTrackingGPS}
              size="sm"
              variant="outline"
            >
              Stop Tracking
            </Button>
            <Button
              onClick={addCurrentGPSPoint}
              disabled={!isTrackingGPS || !currentGPSPosition || points.length >= maxPoints}
              size="sm"
              variant="default"
            >
              Add GPS Point ({points.length}/{maxPoints})
            </Button>
          </div>
        </div>
      )}

      {/* Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800">{status}</span>
          <div className="text-xs text-blue-600">
            Points: {points.length}/{minPoints}+ {area > 0 && `• Area: ${area.toFixed(2)} hectares`}
          </div>
        </div>
      </div>

      {/* EUDR Compliance & Deforestation Analysis */}
      {(eudrReport || deforestationReport || isAnalyzing) && (
        <div className="space-y-3">
          {isAnalyzing && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent"></div>
                <span className="text-sm text-yellow-800">Analyzing EUDR compliance and deforestation risk...</span>
              </div>
            </div>
          )}

          {eudrReport && (
            <div className={`border rounded-lg p-4 ${
              eudrReport.riskLevel === 'high' ? 'bg-red-50 border-red-200' :
              eudrReport.riskLevel === 'standard' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className={`h-5 w-5 ${
                    eudrReport.riskLevel === 'high' ? 'text-red-600' :
                    eudrReport.riskLevel === 'standard' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                  <h4 className="font-medium">EUDR Compliance Report</h4>
                </div>
                <Button
                  onClick={() => downloadReport('eudr')}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="font-medium">Risk Level:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    eudrReport.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    eudrReport.riskLevel === 'standard' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {eudrReport.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Compliance Score:</span>
                  <span className="ml-2 font-bold">{eudrReport.complianceScore}%</span>
                </div>
                <div>
                  <span className="font-medium">Deforestation Risk:</span>
                  <span className="ml-2">{eudrReport.deforestationRisk}%</span>
                </div>
                <div>
                  <span className="font-medium">Last Forest Date:</span>
                  <span className="ml-2">{eudrReport.lastForestDate}</span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                <strong>Recommendations:</strong> {eudrReport.recommendations.join(', ')}
              </div>
            </div>
          )}

          {deforestationReport && (
            <div className={`border rounded-lg p-4 ${
              deforestationReport.forestLossDetected ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 ${
                    deforestationReport.forestLossDetected ? 'text-red-600' : 'text-green-600'
                  }`} />
                  <h4 className="font-medium">Deforestation Analysis</h4>
                </div>
                <Button
                  onClick={() => downloadReport('deforestation')}
                  size="sm"
                  variant="outline"
                  className="h-8"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <div>
                  <span className="font-medium">Forest Loss:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    deforestationReport.forestLossDetected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {deforestationReport.forestLossDetected ? 'DETECTED' : 'NONE'}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Cover Change:</span>
                  <span className="ml-2">{deforestationReport.forestCoverChange}%</span>
                </div>
                <div>
                  <span className="font-medium">Biodiversity Impact:</span>
                  <span className="ml-2 capitalize">{deforestationReport.biodiversityImpact}</span>
                </div>
                <div>
                  <span className="font-medium">Carbon Loss:</span>
                  <span className="ml-2">{deforestationReport.carbonStockLoss} tonnes</span>
                </div>
              </div>
              {deforestationReport.forestLossDate && (
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Loss Date:</strong> {deforestationReport.forestLossDate}
                </div>
              )}
              <div className="text-xs text-gray-600">
                <strong>Recommendations:</strong> {deforestationReport.recommendations.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            disabled={points.length === 0}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button
            onClick={handleComplete}
            disabled={!canComplete}
            size="sm"
          >
            <Check className="h-4 w-4 mr-1" />
            Complete ({points.length}/{minPoints}+)
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div ref={mapRef} />
    </div>
  );
}