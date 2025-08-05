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
  CheckCircle
} from 'lucide-react';

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
}

interface InteractiveBoundaryMapperProps {
  existingBoundary?: BoundaryMapping;
  onBoundaryUpdate?: (boundary: BoundaryMapping) => void;
  onBoundaryComplete?: (boundary: BoundaryMapping) => void;
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
      if (typeof window === 'undefined' || !mapRef.current) return;

      // Dynamic import for Leaflet to avoid SSR issues
      const L = (await import('leaflet')).default;
      
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Fix Leaflet default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(mapCenter, 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        // Handle map clicks
        mapInstanceRef.current.on('click', (e: any) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }
    };

    initMap();

    return () => {
      // Cleanup map instance on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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

      // Add boundary point markers
      points.forEach((point, index) => {
        const marker = L.marker([point.latitude, point.longitude])
          .bindPopup(`Point ${point.order}<br/>Accuracy: ${point.accuracy.toFixed(1)}m<br/>Time: ${point.timestamp.toLocaleTimeString()}`)
          .addTo(mapInstanceRef.current);
        
        markersRef.current.push(marker);
      });

      // Draw polygon if we have 3 or more points
      if (points.length >= 3) {
        const latlngs = points.map(p => [p.latitude, p.longitude]);
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

      // Add current position marker
      const currentIcon = L.divIcon({
        html: '<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        className: 'current-position-marker'
      });

      currentPositionMarkerRef.current = L.marker([
        currentPosition.coords.latitude, 
        currentPosition.coords.longitude
      ], { icon: currentIcon })
        .bindPopup(`Current Position<br/>Accuracy: ${currentPosition.coords.accuracy.toFixed(1)}m`)
        .addTo(mapInstanceRef.current);
    };

    updateCurrentPosition();
  }, [currentPosition]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-lg border border-gray-200 bg-gray-100 touch-manipulation"
        style={{ minHeight: '300px' }}
      />
      <div className="absolute top-2 right-2 bg-white rounded-md shadow-sm p-1 sm:p-2 text-xs text-gray-600 max-w-[140px] sm:max-w-none">
        <span className="hidden sm:inline">Click on map to add boundary points</span>
        <span className="sm:hidden">Tap to add points</span>
      </div>
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
    // Get current GPS position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition(position);
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('GPS not available:', error);
          // Keep default center (Monrovia)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
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

  const completeBoundary = () => {
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

    setCurrentBoundary(completedBoundary);
    onBoundaryComplete?.(completedBoundary);

    toast({
      title: "Boundary Completed",
      description: `Farm boundary "${completedBoundary.name}" has been saved successfully`,
    });
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
        <Button onClick={addCurrentGPSPosition} variant="outline" size="sm" className="w-full sm:w-auto">
          <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          <span className="text-xs sm:text-sm">Add GPS Position</span>
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
        <Card>
          <CardHeader>
            <CardTitle>Boundary Information</CardTitle>
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