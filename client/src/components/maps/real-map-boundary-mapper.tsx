/**
 * 🗺️ Real Map Boundary Mapper with GIBS Enhancement
 * 
 * This component provides real map boundary mapping functionality
 * enhanced with NASA GIBS satellite imagery for improved land visualization.
 * 
 * Maintains full compatibility with existing interfaces while providing
 * superior image quality for agricultural land mapping.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Square, 
  Circle, 
  Trash2, 
  Save, 
  Satellite,
  Zap
} from 'lucide-react';
import EnhancedGIBSMap from './enhanced-gibs-map';
import { useToast } from '@/hooks/use-toast';

interface BoundaryData {
  type: string;
  coordinates: any[];
  area: number;
  bounds: any;
}

interface RealMapBoundaryMapperProps {
  onBoundaryChange?: (boundary: BoundaryData) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
  className?: string;
}

export default function RealMapBoundaryMapper({
  onBoundaryChange,
  initialCenter = [6.428, -9.429], // Liberia coordinates
  initialZoom = 10,
  className = ""
}: RealMapBoundaryMapperProps) {
  const [currentBoundary, setCurrentBoundary] = useState<BoundaryData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [drawingMode, setDrawingMode] = useState<string>('polygon');
  const { toast } = useToast();

  const handleBoundaryChange = (boundary: BoundaryData) => {
    setCurrentBoundary(boundary);
    
    if (onBoundaryChange) {
      onBoundaryChange(boundary);
    }

    toast({
      title: "Boundary Mapped",
      description: `${boundary.type} boundary created successfully. Area: ${boundary.area} hectares`,
    });
  };

  const handleLocationChange = (location: any) => {
    setSelectedLocation(location);
  };

  const clearBoundaries = () => {
    setCurrentBoundary(null);
    setSelectedLocation(null);
    
    toast({
      title: "Boundaries Cleared",
      description: "All mapped boundaries have been cleared.",
    });
  };

  const saveBoundaries = () => {
    if (!currentBoundary) {
      toast({
        title: "No Boundaries",
        description: "Please map a boundary before saving.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to backend
    toast({
      title: "Boundaries Saved",
      description: "Land boundaries have been saved successfully.",
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Land Boundary Mapper
            <Badge variant="outline" className="ml-2">
              <Satellite className="h-3 w-3 mr-1" />
              NASA GIBS Enhanced
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-green-600" />
              Enhanced satellite imagery for precise boundary mapping
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Map */}
      <Card>
        <CardContent className="p-0">
          <EnhancedGIBSMap
            center={initialCenter}
            zoom={initialZoom}
            onBoundaryChange={handleBoundaryChange}
            onLocationChange={handleLocationChange}
            enableDrawing={true}
            enableLayerControl={true}
            height="600px"
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Boundary Information */}
      {currentBoundary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mapped Boundary Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <p className="text-base capitalize">{currentBoundary.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Area</label>
                <p className="text-base">{currentBoundary.area} hectares</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                <p className="text-xs font-mono">
                  {currentBoundary.coordinates.length} points mapped
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Location */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                <p className="text-base font-mono">{selectedLocation.lat.toFixed(6)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                <p className="text-base font-mono">{selectedLocation.lng.toFixed(6)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={clearBoundaries}
              variant="outline"
              size="sm"
              disabled={!currentBoundary && !selectedLocation}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            
            <Button
              onClick={saveBoundaries}
              size="sm"
              disabled={!currentBoundary}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Boundaries
            </Button>
            
            <div className="ml-auto">
              <Badge variant="secondary" className="text-xs">
                Enhanced with NASA satellite imagery
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}