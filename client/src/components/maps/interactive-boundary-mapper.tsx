import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Save, 
  RotateCcw, 
  Play, 
  Square, 
  Trash2,
  Eye,
  Navigation,
  Target,
  CheckCircle,
  FileText,
  Download,
  TreePine,
  Satellite,
  AlertTriangle,
  Shield
} from 'lucide-react';
import EUDRComplianceReportComponent from "@/components/reports/eudr-compliance-report";
import DeforestationReportComponent from "@/components/reports/deforestation-report";
import { generateEUDRCompliancePDF, generateDeforestationPDF } from "@/lib/enhanced-pdf-generator";
import { createComplianceReports, ComplianceReportData } from "@/components/reports/report-storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface BoundaryPoint {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  order: number;
}

interface BoundaryMapping {
  id: string;
  name: string;
  points: BoundaryPoint[];
  area: number;
  perimeter: number;
  status: 'draft' | 'recording' | 'completed';
  accuracyLevel: 'excellent' | 'good' | 'fair' | 'poor';
  createdAt: Date;
  completedAt?: Date;
  complianceReports?: {
    eudrCompliance: any;
    deforestationReport: any;
  };
}

interface InteractiveBoundaryMapperProps {
  existingBoundary?: BoundaryMapping;
  onBoundaryUpdate?: (boundary: BoundaryMapping) => void;
  onBoundaryComplete?: (boundary: BoundaryMapping & { complianceReports: any }) => void;
  minPoints?: number;
}

// Leaflet Map Component
const LeafletMap = ({ 
  points, 
  onMapClick, 
  currentPosition, 
  mapCenter 
}: {
  points: BoundaryPoint[];
  onMapClick: (lat: number, lng: number) => void;
  currentPosition: GeolocationPosition | null;
  mapCenter: [number, number];
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polygonRef = useRef<any>(null);
  const currentPositionMarkerRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Leaflet map only on client side
    const initMap = async () => {
      if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

      try {
        // Dynamic import for Leaflet to avoid SSR issues
        const L = (await import('leaflet')).default;
        
        // Import Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          
          // Wait for CSS to load
          await new Promise(resolve => {
            link.onload = resolve;
            setTimeout(resolve, 1000); // Fallback timeout
          });
        }

        // Fix Leaflet default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create map instance with proper options
        console.log('Creating map with center:', mapCenter);
        mapInstanceRef.current = L.map(mapRef.current, {
          center: mapCenter,
          zoom: 16,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: false,
          touchZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          closePopupOnClick: true,
          preferCanvas: false
        });
        
        console.log('Map instance created:', mapInstanceRef.current);
        
        // Add multiple tile layer options for better reliability
        const tileUrls = [
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        ];
        
        // Add primary tile layer
        const primaryTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 20,
          minZoom: 1,
          detectRetina: true
        });
        
        primaryTileLayer.addTo(mapInstanceRef.current);
        console.log('Tile layer added to map');
        
        // Add success handler for tile loading
        primaryTileLayer.on('tileload', () => {
          console.log('Tiles are loading successfully');
        });
        
        // Add error handling for tile loading
        primaryTileLayer.on('tileerror', (e: any) => {
          console.warn('Tile loading error:', e);
          // Try alternative tile source on error
          setTimeout(() => {
            if (mapInstanceRef.current) {
              console.log('Trying fallback tile layer');
              const fallbackLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
              });
              fallbackLayer.addTo(mapInstanceRef.current);
            }
          }, 1000);
        });

        // Handle map clicks
        mapInstanceRef.current.on('click', (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });

        // Force map resize with multiple attempts
        const resizeMap = () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
            // Set view again to ensure proper rendering
            mapInstanceRef.current.setView(mapCenter, 16);
          }
        };
        
        // Multiple resize attempts for better reliability
        setTimeout(resizeMap, 100);
        setTimeout(resizeMap, 500);
        setTimeout(resizeMap, 1000);
        
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    return () => {
      // Cleanup map instance on unmount
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.warn('Error cleaning up map:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [mapCenter]);

  useEffect(() => {
    const updateMap = async () => {
      if (!mapInstanceRef.current || typeof window === 'undefined') return;

      const L = (await import('leaflet')).default;

      // Clear existing markers
      markersRef.current.forEach(marker => mapInstanceRef.current?.removeLayer(marker));
      markersRef.current = [];

      // Clear existing polygon
      if (polygonRef.current) {
        mapInstanceRef.current.removeLayer(polygonRef.current);
        polygonRef.current = null;
      }

      // Add boundary point markers with better visibility
      points.forEach((point, index) => {
        const isFirst = index === 0;
        const isLast = index === points.length - 1;
        
        // Create custom marker icons for better visibility
        const markerIcon = L.divIcon({
          html: `<div style="
            background-color: ${isFirst ? '#22c55e' : isLast ? '#ef4444' : '#3b82f6'};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
          ">${point.order}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          className: 'boundary-point-marker'
        }) as any;

        const marker = L.marker([point.latitude, point.longitude], { icon: markerIcon })
          .bindPopup(`
            <div style="font-size: 12px;">
              <strong>Point ${point.order}</strong><br/>
              Lat: ${point.latitude.toFixed(6)}<br/>
              Lng: ${point.longitude.toFixed(6)}<br/>
              Accuracy: ${point.accuracy.toFixed(1)}m<br/>
              Time: ${point.timestamp.toLocaleTimeString()}
            </div>
          `)
          .addTo(mapInstanceRef.current);
        
        markersRef.current.push(marker);
      });

      // Draw polygon if we have 3 or more points
      if (points.length >= 3) {
        const latlngs = points.map(p => [p.latitude, p.longitude] as [number, number]);
        polygonRef.current = L.polygon(latlngs, {
          color: '#3b82f6',
          fillColor: '#dbeafe',
          fillOpacity: 0.3,
          weight: 2
        }).addTo(mapInstanceRef.current);

        // Fit map bounds to show all points
        const group = new L.featureGroup([...markersRef.current, polygonRef.current]);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      } else if (points.length > 0) {
        // Fit bounds to markers only
        const group = new L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
      }
    };

    updateMap();
  }, [points]);

  useEffect(() => {
    const updateCurrentPosition = async () => {
      if (!mapInstanceRef.current || !currentPosition || typeof window === 'undefined') return;

      const L = (await import('leaflet')).default;

      // Remove existing current position marker
      if (currentPositionMarkerRef.current) {
        mapInstanceRef.current.removeLayer(currentPositionMarkerRef.current);
      }

      // Add current position marker with pulsing animation
      const currentIcon = L.divIcon({
        html: `
          <div style="position: relative;">
            <div style="
              background-color: #3b82f6;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              position: relative;
              z-index: 2;
            "></div>
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background-color: rgba(59, 130, 246, 0.3);
              animation: pulse 2s infinite;
              z-index: 1;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
              100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
            }
          </style>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        className: 'current-position-marker'
      }) as any;

      currentPositionMarkerRef.current = L.marker([
        currentPosition.coords.latitude, 
        currentPosition.coords.longitude
      ], { icon: currentIcon })
        .bindPopup(`
          <div style="font-size: 12px;">
            <strong>📍 Your Location</strong><br/>
            Lat: ${currentPosition.coords.latitude.toFixed(6)}<br/>
            Lng: ${currentPosition.coords.longitude.toFixed(6)}<br/>
            Accuracy: ${currentPosition.coords.accuracy.toFixed(1)}m<br/>
            <small>Tap "Add GPS Position" to use this location</small>
          </div>
        `)
        .addTo(mapInstanceRef.current);
    };

    updateCurrentPosition();
  }, [currentPosition]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-lg border border-gray-200 bg-gray-100 touch-manipulation"
        style={{ 
          minHeight: '300px',
          height: '400px',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}
      />
      <div className="absolute top-2 right-2 bg-white rounded-md shadow-sm p-1 sm:p-2 text-xs text-gray-600 max-w-[140px] sm:max-w-none">
        <span className="hidden sm:inline">Click on map to add boundary points</span>
        <span className="sm:hidden">Tap to add points</span>
      </div>
      
      {/* GPS Status Indicator */}
      {currentPosition && (
        <div className="absolute top-2 left-2 bg-green-100 border border-green-200 rounded-md shadow-sm p-1 sm:p-2 text-xs text-green-700">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="hidden sm:inline">GPS: {currentPosition.coords.accuracy.toFixed(0)}m</span>
            <span className="sm:hidden">GPS ✓</span>
          </div>
        </div>
      )}
      
      {!currentPosition && (
        <div className="absolute top-2 left-2 bg-orange-100 border border-orange-200 rounded-md shadow-sm p-1 sm:p-2 text-xs text-orange-700">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-spin"></div>
            <span className="hidden sm:inline">Getting GPS...</span>
            <span className="sm:hidden">GPS...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function InteractiveBoundaryMapper({
  existingBoundary,
  onBoundaryUpdate,
  onBoundaryComplete,
  minPoints = 3
}: InteractiveBoundaryMapperProps) {
  const [currentBoundary, setCurrentBoundary] = useState<BoundaryMapping | null>(
    existingBoundary || null
  );
  const [boundaryName, setBoundaryName] = useState('');
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([6.4281, -9.4295]); // Default to Monrovia, Liberia
  const { toast } = useToast();

  useEffect(() => {
    // Get current GPS position with enhanced mobile support
    if (navigator.geolocation) {
      // Watch position for real-time updates
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition(position);
          // Only center map on first GPS fix to avoid disrupting user interaction
          if (!currentPosition) {
            setMapCenter([position.coords.latitude, position.coords.longitude]);
          }
        },
        (error) => {
          console.warn('GPS not available:', error);
          toast({
            title: "GPS Location",
            description: "Please enable location services for better accuracy",
            variant: "destructive"
          });
          // Keep default center (Monrovia)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000 // Cache position for 1 minute
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  const createNewBoundary = () => {
    const newBoundary: BoundaryMapping = {
      id: `boundary-${Date.now()}`,
      name: boundaryName || `Farm Boundary ${new Date().toLocaleDateString()}`,
      points: [],
      area: 0,
      perimeter: 0,
      status: 'draft',
      accuracyLevel: 'good',
      createdAt: new Date()
    };
    setCurrentBoundary(newBoundary);
    return newBoundary;
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (!currentBoundary) {
      createNewBoundary();
    }

    const boundary = currentBoundary || createNewBoundary();

    // Create new boundary point
    const newPoint: BoundaryPoint = {
      id: `point-${Date.now()}`,
      latitude: lat,
      longitude: lng,
      accuracy: currentPosition?.coords.accuracy || 5.0,
      timestamp: new Date(),
      order: boundary.points.length + 1
    };

    const updatedBoundary = {
      ...boundary,
      points: [...boundary.points, newPoint],
      status: 'recording' as const
    };

    // Recalculate metrics
    const { area, perimeter, accuracyLevel } = calculateBoundaryMetrics(updatedBoundary.points);
    updatedBoundary.area = area;
    updatedBoundary.perimeter = perimeter;
    updatedBoundary.accuracyLevel = accuracyLevel;

    setCurrentBoundary(updatedBoundary);
    onBoundaryUpdate?.(updatedBoundary);

    toast({
      title: "Point Added",
      description: `Boundary point ${newPoint.order} added at ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    });
  };

  const addCurrentGPSPosition = () => {
    if (!currentPosition) {
      toast({
        title: "GPS Not Available",
        description: "Please enable location services to use GPS positioning",
        variant: "destructive"
      });
      return;
    }

    handleMapClick(currentPosition.coords.latitude, currentPosition.coords.longitude);
  };

  const removeLastPoint = () => {
    if (!currentBoundary || currentBoundary.points.length === 0) return;

    const updatedPoints = currentBoundary.points.slice(0, -1);
    const { area, perimeter, accuracyLevel } = calculateBoundaryMetrics(updatedPoints);

    const updatedBoundary = {
      ...currentBoundary,
      points: updatedPoints,
      area,
      perimeter,
      accuracyLevel
    };

    setCurrentBoundary(updatedBoundary);
    onBoundaryUpdate?.(updatedBoundary);

    toast({
      title: "Point Removed",
      description: "Last boundary point removed",
    });
  };

  const completeBoundary = async () => {
    if (!currentBoundary || currentBoundary.points.length < minPoints) {
      toast({
        title: "Insufficient Points",
        description: `Please add at least ${minPoints} points to complete the boundary`,
        variant: "destructive"
      });
      return;
    }

    const completedBoundary = {
      ...currentBoundary,
      status: 'completed' as const,
      completedAt: new Date()
    };

    // Generate compliance reports automatically
    const farmerId = localStorage.getItem("farmerId") || `FRM-${Date.now()}`;
    const farmerName = localStorage.getItem("farmerFirstName") || "Farm Owner";
    const coordinates = currentBoundary.points.length > 0 
      ? `${currentBoundary.points[0].latitude.toFixed(6)}, ${currentBoundary.points[0].longitude.toFixed(6)}`
      : "N/A";

    try {
      // Create comprehensive compliance reports
      const reportData: ComplianceReportData = {
        farmerId,
        farmerName,
        coordinates,
        boundaryData: {
          name: completedBoundary.name,
          area: completedBoundary.area,
          perimeter: completedBoundary.perimeter,
          points: completedBoundary.points.length,
          accuracy: completedBoundary.accuracyLevel
        }
      };

      const complianceReports = await createComplianceReports(reportData);
      
      // Add reports to boundary data
      const boundaryWithReports = {
        ...completedBoundary,
        complianceReports
      };

      setCurrentBoundary(boundaryWithReports);
      onBoundaryComplete?.(boundaryWithReports);

      // Save to localStorage for demonstration
      const savedBoundaries = JSON.parse(localStorage.getItem('farmBoundaries') || '[]');
      savedBoundaries.push(boundaryWithReports);
      localStorage.setItem('farmBoundaries', JSON.stringify(savedBoundaries));

      toast({
        title: "✅ Boundary Completed with LACRA Reports",
        description: `Farm boundary "${completedBoundary.name}" saved with EUDR and deforestation analysis reports`,
      });
    } catch (error) {
      console.error('Error generating compliance reports:', error);
      
      setCurrentBoundary(completedBoundary);
      onBoundaryComplete?.(completedBoundary);

      // Save to localStorage for demonstration
      const savedBoundaries = JSON.parse(localStorage.getItem('farmBoundaries') || '[]');
      savedBoundaries.push(completedBoundary);
      localStorage.setItem('farmBoundaries', JSON.stringify(savedBoundaries));

      toast({
        title: "✅ Boundary Completed",
        description: `Farm boundary "${completedBoundary.name}" has been saved with ${completedBoundary.points.length} points and ${completedBoundary.area.toFixed(2)} hectares`,
      });
    }
  };

  const resetBoundary = () => {
    setCurrentBoundary(null);
    setBoundaryName('');
    toast({
      title: "Boundary Reset",
      description: "Boundary mapping has been reset",
    });
  };

  const calculateBoundaryMetrics = (points: BoundaryPoint[]) => {
    if (points.length < 3) {
      return { area: 0, perimeter: 0, accuracyLevel: 'poor' as const };
    }

    // Calculate area using shoelace formula
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].longitude * points[j].latitude;
      area -= points[j].longitude * points[i].latitude;
    }
    area = Math.abs(area) / 2;
    
    // Convert to hectares (approximate for Liberia's latitude ~7°N)
    area = area * 111319.9 * 111319.9 * Math.cos(7 * Math.PI / 180) / 10000;

    // Calculate perimeter
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      perimeter += calculateDistance(points[i], points[j]);
    }

    // Determine accuracy level
    const avgAccuracy = points.reduce((sum, point) => sum + point.accuracy, 0) / points.length;
    let accuracyLevel: 'excellent' | 'good' | 'fair' | 'poor';
    
    if (avgAccuracy <= 2) accuracyLevel = 'excellent';
    else if (avgAccuracy <= 5) accuracyLevel = 'good';
    else if (avgAccuracy <= 10) accuracyLevel = 'fair';
    else accuracyLevel = 'poor';

    return { area, perimeter, accuracyLevel };
  };

  const calculateDistance = (point1: BoundaryPoint, point2: BoundaryPoint): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="space-y-6">
      {/* Boundary Name Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Boundary Name</label>
        <Input
          placeholder="Enter farm boundary name..."
          value={boundaryName}
          onChange={(e) => setBoundaryName(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Interactive Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Interactive Boundary Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeafletMap
            points={currentBoundary?.points || []}
            onMapClick={handleMapClick}
            currentPosition={currentPosition}
            mapCenter={mapCenter}
          />
        </CardContent>
      </Card>

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
        <Button 
          onClick={addCurrentGPSPosition} 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
          disabled={!currentPosition}
        >
          <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="text-xs sm:text-sm">
            {currentPosition ? 'Add GPS Position' : 'Getting GPS...'}
          </span>
        </Button>
        <Button onClick={removeLastPoint} variant="outline" size="sm" disabled={!currentBoundary?.points.length} className="w-full sm:w-auto">
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="text-xs sm:text-sm">Remove Last Point</span>
        </Button>
        <Button 
          onClick={completeBoundary} 
          disabled={!currentBoundary || currentBoundary.points.length < minPoints}
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          size="sm"
        >
          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="text-xs sm:text-sm">Complete Boundary</span>
        </Button>
        <Button onClick={resetBoundary} variant="destructive" size="sm" className="w-full sm:w-auto">
          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="text-xs sm:text-sm">Reset</span>
        </Button>
      </div>

      {/* Boundary Information */}
      {currentBoundary && (
        <Card className={currentBoundary.status === 'completed' ? 'border-green-200 bg-green-50' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentBoundary.status === 'completed' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Completed Boundary
                </>
              ) : (
                <>
                  <Target className="h-5 w-5 text-blue-600" />
                  Boundary Information
                </>
              )}
            </CardTitle>
            {currentBoundary.status === 'completed' && (
              <p className="text-sm text-green-700">
                ✅ Boundary saved successfully on {currentBoundary.completedAt?.toLocaleString()}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Points</p>
                <p className="text-lg sm:text-2xl font-bold">{currentBoundary.points.length}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Area</p>
                <p className="text-lg sm:text-2xl font-bold">{currentBoundary.area.toFixed(3)}</p>
                <p className="text-xs text-gray-500">hectares</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Perimeter</p>
                <p className="text-lg sm:text-2xl font-bold">{currentBoundary.perimeter.toFixed(1)}</p>
                <p className="text-xs text-gray-500">meters</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Accuracy</p>
                <Badge variant={
                  currentBoundary.accuracyLevel === 'excellent' ? 'default' :
                  currentBoundary.accuracyLevel === 'good' ? 'secondary' :
                  currentBoundary.accuracyLevel === 'fair' ? 'outline' : 'destructive'
                } className="text-xs">
                  {currentBoundary.accuracyLevel}
                </Badge>
              </div>
            </div>

            {currentBoundary.status === 'completed' && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-green-100 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 text-sm mb-2">📍 Saved Boundary Details</h4>
                  <div className="text-xs text-green-700 space-y-1">
                    <div><strong>Name:</strong> {currentBoundary.name}</div>
                    <div><strong>GPS Points:</strong> {currentBoundary.points.length} recorded</div>
                    <div><strong>Total Area:</strong> {currentBoundary.area.toFixed(3)} hectares</div>
                    <div><strong>Boundary Length:</strong> {currentBoundary.perimeter.toFixed(1)} meters</div>
                    <div><strong>Status:</strong> Completed and saved to system</div>
                  </div>
                </div>

                {/* EUDR Compliance and Deforestation Reports */}
                {currentBoundary.complianceReports && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 text-sm mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      LACRA Compliance Reports Generated
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* EUDR Compliance Report */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 w-full"
                          >
                            <FileText className="h-3 w-3 mr-2" />
                            <span className="text-xs">View EUDR Report</span>
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
                            report={currentBoundary.complianceReports.eudrCompliance}
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
                            <Satellite className="h-3 w-3 mr-2" />
                            <span className="text-xs">View Deforestation Report</span>
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
                            report={currentBoundary.complianceReports.deforestationReport}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* PDF Download Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <Button 
                        onClick={() => generateEUDRCompliancePDF(currentBoundary.complianceReports.eudrCompliance)}
                        variant="outline" 
                        size="sm" 
                        className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100 w-full"
                      >
                        <Download className="h-3 w-3 mr-2" />
                        <span className="text-xs">Download EUDR PDF</span>
                      </Button>

                      <Button 
                        onClick={() => generateDeforestationPDF(currentBoundary.complianceReports.deforestationReport)}
                        variant="outline" 
                        size="sm" 
                        className="bg-orange-50 border-orange-300 text-orange-700 hover:bg-orange-100 w-full"
                      >
                        <Download className="h-3 w-3 mr-2" />
                        <span className="text-xs">Download Deforestation PDF</span>
                      </Button>
                    </div>

                    <div className="text-xs text-blue-600 mt-2">
                      📋 Reports include LACRA letterhead and official compliance documentation
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">How to Create Farm Boundaries:</h3>
            <ol className="text-xs sm:text-sm text-blue-700 space-y-1">
              <li>1. <strong className="hidden sm:inline">Click on the map</strong><strong className="sm:hidden">Tap the map</strong> to add boundary points where you want them</li>
              <li>2. <strong>Use "Add GPS Position"</strong> to add your current location as a point</li>
              <li>3. <strong>Walk around your farm</strong> and add points along the perimeter</li>
              <li>4. <strong>Complete the boundary</strong> when you have at least {minPoints} points</li>
              <li>5. The system will automatically calculate area and perimeter</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}