import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Map, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize,
  Settings,
  Eye,
  EyeOff,
  FileText,
  TreePine,
  Satellite,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import EUDRComplianceReportComponent from "@/components/reports/eudr-compliance-report";
import DeforestationReportComponent from "@/components/reports/deforestation-report";
import { generateEUDRCompliancePDF, generateDeforestationPDF } from "@/lib/enhanced-pdf-generator";
import { createComplianceReports, ComplianceReportData } from "@/components/reports/report-storage";
import { useToast } from "@/hooks/use-toast";

interface MapLayer {
  id: string;
  name: string;
  type: 'satellite' | 'terrain' | 'roads' | 'boundaries' | 'plots';
  visible: boolean;
  opacity: number;
  color?: string;
}

interface GPSPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
  label?: string;
  type: 'waypoint' | 'boundary' | 'center' | 'corner';
}

interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface GPSMapViewerProps {
  gpsPoints?: GPSPoint[];
  boundaries?: GPSPoint[][];
  center?: { lat: number; lng: number };
  zoom?: number;
  onPointClick?: (point: GPSPoint) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  showComplianceReports?: boolean;
}

export default function GPSMapViewer({
  gpsPoints = [],
  boundaries = [],
  center = { lat: 6.3133, lng: -10.7969 }, // Monrovia, Liberia
  zoom = 15,
  onPointClick,
  onBoundsChange,
  showComplianceReports = true
}: GPSMapViewerProps) {
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'satellite', name: 'Satellite View', type: 'satellite', visible: true, opacity: 100 },
    { id: 'terrain', name: 'Terrain', type: 'terrain', visible: false, opacity: 80 },
    { id: 'roads', name: 'Roads', type: 'roads', visible: true, opacity: 70 },
    { id: 'boundaries', name: 'Plot Boundaries', type: 'boundaries', visible: true, opacity: 90, color: '#ef4444' },
    { id: 'plots', name: 'Farm Plots', type: 'plots', visible: true, opacity: 80, color: '#10b981' }
  ]);

  const [mapStyle, setMapStyle] = useState<'satellite' | 'terrain' | 'roads'>('satellite');
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [mapCenter, setMapCenter] = useState(center);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<GPSPoint | null>(null);
  const [complianceReports, setComplianceReports] = useState<any>(null);
  const [isGeneratingReports, setIsGeneratingReports] = useState(false);
  const { toast } = useToast();

  // Toggle layer visibility
  const toggleLayer = (layerId: string) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  // Update layer opacity
  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setMapLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  };

  // Calculate map bounds from GPS points
  const calculateBounds = (): MapBounds | null => {
    if (gpsPoints.length === 0) return null;

    const lats = gpsPoints.map(p => p.latitude);
    const lngs = gpsPoints.map(p => p.longitude);

    return {
      north: Math.max(...lats),
      south: Math.min(...lats),
      east: Math.max(...lngs),
      west: Math.min(...lngs)
    };
  };

  // Fit map to GPS points
  const fitToPoints = () => {
    const bounds = calculateBounds();
    if (bounds) {
      const centerLat = (bounds.north + bounds.south) / 2;
      const centerLng = (bounds.east + bounds.west) / 2;
      setMapCenter({ lat: centerLat, lng: centerLng });
      
      // Calculate appropriate zoom level
      const latDiff = bounds.north - bounds.south;
      const lngDiff = bounds.east - bounds.west;
      const maxDiff = Math.max(latDiff, lngDiff);
      const newZoom = Math.max(10, Math.min(18, 15 - Math.log2(maxDiff * 100)));
      setCurrentZoom(newZoom);

      onBoundsChange?.(bounds);
    }
  };

  // Calculate distance between two GPS points
  const calculateDistance = (point1: GPSPoint, point2: GPSPoint): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Calculate total area of boundary
  const calculateBoundaryArea = (boundary: GPSPoint[]): number => {
    if (boundary.length < 3) return 0;

    let area = 0;
    for (let i = 0; i < boundary.length; i++) {
      const j = (i + 1) % boundary.length;
      area += boundary[i].longitude * boundary[j].latitude;
      area -= boundary[j].longitude * boundary[i].latitude;
    }
    area = Math.abs(area) / 2;
    
    // Convert to hectares (approximate)
    return area * 111319.9 * 111319.9 / 10000;
  };

  // Calculate total area of all boundaries
  const calculateTotalArea = (): number => {
    if (boundaries.length === 0) return 0;
    
    return boundaries.reduce((total, boundary) => {
      return total + calculateBoundaryArea(boundary);
    }, 0);
  };

  // Calculate total distance of GPS points
  const calculateTotalDistance = (): number => {
    if (gpsPoints.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < gpsPoints.length - 1; i++) {
      totalDistance += calculateDistance(gpsPoints[i], gpsPoints[i + 1]);
    }
    return totalDistance;
  };

  // Generate compliance reports for current GPS data
  const generateComplianceReports = async () => {
    setIsGeneratingReports(true);
    
    try {
      const farmerId = localStorage.getItem("farmerId") || `FRM-${Date.now()}`;
      const farmerName = localStorage.getItem("farmerFirstName") || "Farm Owner";
      const coordinates = gpsPoints.length > 0 
        ? `${gpsPoints[0].latitude.toFixed(6)}, ${gpsPoints[0].longitude.toFixed(6)}`
        : "N/A";

      const reportData: ComplianceReportData = {
        farmerId,
        farmerName,
        coordinates,
        boundaryData: {
          name: `GPS Map Analysis ${new Date().toLocaleDateString()}`,
          area: calculateTotalArea(),
          perimeter: calculateTotalDistance(),
          points: gpsPoints.length,
          accuracy: 'good'
        }
      };

      const reports = await createComplianceReports(reportData);
      setComplianceReports(reports);

      toast({
        title: "✅ LACRA Compliance Reports Generated",
        description: "EUDR compliance and deforestation analysis reports are ready for viewing and download",
      });
    } catch (error) {
      toast({
        title: "Error Generating Reports",
        description: "Failed to create compliance reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReports(false);
    }
  };

  // Export map data
  const exportMapData = () => {
    const mapData = {
      center: mapCenter,
      zoom: currentZoom,
      style: mapStyle,
      layers: mapLayers.filter(layer => layer.visible),
      gpsPoints: gpsPoints.map(point => ({
        id: point.id,
        coordinates: [point.longitude, point.latitude],
        accuracy: point.accuracy,
        type: point.type,
        label: point.label,
        timestamp: point.timestamp.toISOString()
      })),
      boundaries: boundaries.map((boundary, index) => ({
        id: `boundary-${index}`,
        coordinates: boundary.map(point => [point.longitude, point.latitude]),
        area: calculateBoundaryArea(boundary)
      })),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(mapData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gps-map-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get point type color
  const getPointColor = (type: string) => {
    switch (type) {
      case 'waypoint': return '#3b82f6';
      case 'boundary': return '#ef4444';
      case 'center': return '#10b981';
      case 'corner': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Fit to points when GPS points change
  useEffect(() => {
    if (gpsPoints.length > 0) {
      fitToPoints();
    }
  }, [gpsPoints]);

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              GPS Map Viewer
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={fitToPoints}>
                <Maximize className="h-4 w-4 mr-1" />
                Fit to Data
              </Button>
              <Button variant="outline" size="sm" onClick={exportMapData}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              {showComplianceReports && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={generateComplianceReports}
                  disabled={isGeneratingReports || gpsPoints.length === 0}
                  className="bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  {isGeneratingReports ? 'Generating...' : 'LACRA Reports'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Map Style */}
            <div>
              <label className="text-sm font-medium mb-2 block">Map Style</label>
              <Select value={mapStyle} onValueChange={(value: any) => setMapStyle(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="roads">Roads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zoom Controls */}
            <div>
              <label className="text-sm font-medium mb-2 block">Zoom Level</label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentZoom(Math.max(1, currentZoom - 1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[3rem] text-center">
                  {currentZoom.toFixed(1)}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentZoom(Math.min(20, currentZoom + 1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Measurements Toggle */}
            <div>
              <label className="text-sm font-medium mb-2 block">Options</label>
              <Button
                variant={showMeasurements ? "default" : "outline"}
                size="sm"
                onClick={() => setShowMeasurements(!showMeasurements)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-1" />
                Measurements
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Display Area */}
      <Card>
        <CardContent className="p-0">
          <div 
            className="w-full h-96 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ 
              backgroundImage: mapStyle === 'satellite' 
                ? 'radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2))' 
                : 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(168, 85, 247, 0.1))'
            }}
          >
            {/* Interactive Map Simulation */}
            <div className="relative w-full h-full">
              {/* Map Grid Background */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
              
              {/* Location Markers */}
              <div className="absolute inset-0">
                {/* Sample Farm Locations */}
                <div 
                  className="absolute bg-green-500 rounded-full w-4 h-4 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: '30%', top: '40%' }}
                  title="Coffee Farm - GPS: 6.314°N, 10.797°W"
                />
                <div 
                  className="absolute bg-red-500 rounded-full w-4 h-4 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: '60%', top: '35%' }}
                  title="Boundary Point - GPS: 6.316°N, 10.795°W"
                />
                <div 
                  className="absolute bg-blue-500 rounded-full w-4 h-4 border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
                  style={{ left: '45%', top: '60%' }}
                  title="Processing Center - GPS: 6.312°N, 10.799°W"
                />
                
                {/* Farm Boundary Visualization */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <polygon
                    points="30,40 60,35 70,70 25,65"
                    fill="rgba(34, 197, 94, 0.2)"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    transform="scale(5,5)"
                  />
                </svg>
              </div>

              {/* Map Info Overlay */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-sm space-y-1">
                  <div className="font-semibold text-gray-800">Live GPS Data</div>
                  <div className="text-gray-600">Center: {mapCenter.lat.toFixed(6)}, {mapCenter.lng.toFixed(6)}</div>
                  <div className="text-gray-600">Zoom: {currentZoom.toFixed(1)} | Style: {mapStyle}</div>
                  <div className="text-gray-600">Points: {gpsPoints.length} | Boundaries: {boundaries.length}</div>
                </div>
              </div>

              {/* Scale Bar */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-gray-800"></div>
                  <span className="text-xs text-gray-600">100m</span>
                </div>
              </div>
            </div>

            {/* GPS Points Overlay */}
            {gpsPoints.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                {gpsPoints.map((point, index) => (
                  <div
                    key={point.id}
                    className="absolute w-3 h-3 rounded-full pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      backgroundColor: getPointColor(point.type),
                      left: `${20 + (index % 5) * 15}%`,
                      top: `${30 + (index % 3) * 20}%`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    onClick={() => {
                      setSelectedPoint(point);
                      onPointClick?.(point);
                    }}
                    title={`${point.type}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`}
                  />
                ))}
              </div>
            )}

            {/* Layer Status Indicators */}
            <div className="absolute top-4 right-4 space-y-1">
              {mapLayers.filter(layer => layer.visible).map(layer => (
                <Badge key={layer.id} variant="secondary" className="text-xs">
                  {layer.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layer Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Map Layers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mapLayers.map(layer => (
              <div key={layer.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleLayer(layer.id)}
                    className="p-1"
                  >
                    {layer.visible ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                  <div className="flex items-center gap-2">
                    {layer.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                    )}
                    <span className="font-medium">{layer.name}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {layer.opacity}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={layer.opacity}
                    onChange={(e) => updateLayerOpacity(layer.id, parseInt(e.target.value))}
                    className="w-20"
                    disabled={!layer.visible}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GPS Statistics */}
      {(gpsPoints.length > 0 || boundaries.length > 0) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>GPS Data Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-xl font-bold">{gpsPoints.length}</p>
              </div>
              
              {boundaries.length > 0 && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Boundaries</p>
                    <p className="text-xl font-bold">{boundaries.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Area</p>
                    <p className="text-xl font-bold">
                      {boundaries.reduce((total, boundary) => total + calculateBoundaryArea(boundary), 0).toFixed(2)} ha
                    </p>
                  </div>
                </>
              )}
              
              {gpsPoints.length > 1 && (
                <div>
                  <p className="text-sm text-gray-600">Avg. Accuracy</p>
                  <p className="text-xl font-bold">
                    ±{(gpsPoints.reduce((sum, point) => sum + (point.accuracy || 0), 0) / gpsPoints.length).toFixed(1)}m
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Point Details */}
      {selectedPoint && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Selected Point Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Coordinates</p>
                <p className="font-mono">{selectedPoint.latitude.toFixed(6)}, {selectedPoint.longitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <Badge variant="outline">{selectedPoint.type}</Badge>
              </div>
              {selectedPoint.accuracy && (
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p>±{selectedPoint.accuracy.toFixed(1)}m</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Timestamp</p>
                <p className="text-sm">{selectedPoint.timestamp.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LACRA Compliance Reports */}
      {complianceReports && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              <span className="hidden sm:inline">LACRA Compliance Reports</span>
              <span className="sm:hidden">Compliance Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-xs sm:text-sm text-emerald-800 mb-3">
                  📋 Official LACRA compliance reports generated for GPS mapping data with colorful letterhead and comprehensive analysis.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* EUDR Compliance Report */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 w-full"
                      >
                        <TreePine className="h-3 w-3 mr-1 sm:mr-2" />
                        <span className="text-xs">
                          <span className="hidden sm:inline">View EUDR Report</span>
                          <span className="sm:hidden">EUDR</span>
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <TreePine className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                          <span className="hidden sm:inline">EUDR Compliance Assessment</span>
                          <span className="sm:hidden">EUDR Report</span>
                        </DialogTitle>
                      </DialogHeader>
                      <EUDRComplianceReportComponent 
                        report={complianceReports.eudrCompliance}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* Deforestation Analysis Report */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100 w-full"
                      >
                        <Satellite className="h-3 w-3 mr-1 sm:mr-2" />
                        <span className="text-xs">
                          <span className="hidden sm:inline">View Deforestation Report</span>
                          <span className="sm:hidden">Deforestation</span>
                        </span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-y-auto p-3 sm:p-6">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                          <span className="hidden sm:inline">Deforestation Analysis</span>
                          <span className="sm:hidden">Deforestation Report</span>
                        </DialogTitle>
                      </DialogHeader>
                      <DeforestationReportComponent 
                        report={complianceReports.deforestationReport}
                      />
                    </DialogContent>
                  </Dialog>

                  {/* PDF Download - EUDR */}
                  <Button 
                    onClick={() => generateEUDRCompliancePDF(complianceReports.eudrCompliance)}
                    variant="outline" 
                    size="sm" 
                    className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 w-full"
                  >
                    <Download className="h-3 w-3 mr-1 sm:mr-2" />
                    <span className="text-xs">
                      <span className="hidden sm:inline">Download EUDR PDF</span>
                      <span className="sm:hidden">EUDR PDF</span>
                    </span>
                  </Button>

                  {/* PDF Download - Deforestation */}
                  <Button 
                    onClick={() => generateDeforestationPDF(complianceReports.deforestationReport)}
                    variant="outline" 
                    size="sm" 
                    className="bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 w-full"
                  >
                    <Download className="h-3 w-3 mr-1 sm:mr-2" />
                    <span className="text-xs">
                      <span className="hidden sm:inline">Download Deforestation PDF</span>
                      <span className="sm:hidden">Defor. PDF</span>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}