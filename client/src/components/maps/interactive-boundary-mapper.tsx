/**
 * 🗺️ Interactive Boundary Mapper with GIBS Enhancement
 * 
 * This component provides interactive boundary mapping functionality
 * enhanced with NASA GIBS satellite imagery for precise agricultural mapping.
 * 
 * Designed for farmer GPS mapping and land management with enhanced visualization.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Navigation, 
  Target, 
  Satellite,
  Zap,
  Activity,
  Crosshair,
  Save,
  RefreshCw
} from 'lucide-react';
import EnhancedGIBSMap from './enhanced-gibs-map';
import { useToast } from '@/hooks/use-toast';

interface InteractiveBoundaryMapperProps {
  onBoundaryChange?: (boundary: any) => void;
  onLocationChange?: (location: any) => void;
  farmerId?: string;
  farmerName?: string;
  className?: string;
}

export default function InteractiveBoundaryMapper({
  onBoundaryChange,
  onLocationChange,
  farmerId = "FARMER-DEFAULT",
  farmerName = "Farmer",
  className = ""
}: InteractiveBoundaryMapperProps) {
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [mappedBoundaries, setMappedBoundaries] = useState<any[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [activeTab, setActiveTab] = useState('mapping');
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Supported",
        description: "Your browser doesn't support GPS location services",
        variant: "destructive"
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        
        setCurrentLocation(location);
        setIsGettingLocation(false);
        
        if (onLocationChange) {
          onLocationChange(location);
        }
        
        toast({
          title: "Location Found",
          description: `GPS accuracy: ${position.coords.accuracy.toFixed(1)} meters`,
        });
      },
      (error) => {
        let message = "Could not get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "GPS permission denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "GPS position unavailable. Make sure GPS is enabled.";
            break;
          case error.TIMEOUT:
            message = "GPS request timed out. Please try again.";
            break;
        }
        
        toast({
          title: "GPS Error",
          description: message,
          variant: "destructive"
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  const handleBoundaryChange = (boundary: any) => {
    const newBoundary = {
      ...boundary,
      id: `boundary-${Date.now()}`,
      farmerId: farmerId,
      timestamp: new Date().toISOString()
    };
    
    setMappedBoundaries(prev => [...prev, newBoundary]);
    
    if (onBoundaryChange) {
      onBoundaryChange(newBoundary);
    }

    toast({
      title: "Farm Boundary Mapped",
      description: `${boundary.type} boundary added successfully. Area: ${boundary.area} hectares`,
    });
  };

  const handleMapLocationChange = (location: any) => {
    if (onLocationChange) {
      onLocationChange(location);
    }
  };

  const saveBoundaries = () => {
    if (mappedBoundaries.length === 0) {
      toast({
        title: "No Boundaries",
        description: "Please map at least one boundary before saving.",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to backend
    toast({
      title: "Boundaries Saved",
      description: `${mappedBoundaries.length} farm boundaries saved successfully.`,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Interactive Farm Mapping - {farmerName}
            <Badge variant="outline" className="ml-2">
              <Satellite className="h-3 w-3 mr-1" />
              Enhanced GPS + Satellite
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              size="sm"
              className="flex items-center gap-2"
            >
              {isGettingLocation ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Target className="h-4 w-4" />
              )}
              Get GPS Location
            </Button>
            
            {currentLocation && (
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-green-600">
                  GPS: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  (±{currentLocation.accuracy.toFixed(1)}m)
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Mapping Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mapping">🗺️ Map Boundaries</TabsTrigger>
          <TabsTrigger value="gps">📍 GPS Points</TabsTrigger>
          <TabsTrigger value="summary">📊 Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="mapping" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <EnhancedGIBSMap
                center={currentLocation ? [currentLocation.lat, currentLocation.lng] : [6.428, -9.429]}
                zoom={currentLocation ? 15 : 10}
                onBoundaryChange={handleBoundaryChange}
                onLocationChange={handleMapLocationChange}
                enableDrawing={true}
                enableLayerControl={true}
                height="700px"
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GPS Location Management</CardTitle>
            </CardHeader>
            <CardContent>
              {currentLocation ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Latitude</label>
                    <p className="text-base font-mono">{currentLocation.lat.toFixed(6)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Longitude</label>
                    <p className="text-base font-mono">{currentLocation.lng.toFixed(6)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Accuracy</label>
                    <p className="text-base">±{currentLocation.accuracy.toFixed(1)} meters</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Captured</label>
                    <p className="text-sm">{new Date(currentLocation.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crosshair className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No GPS location captured yet</p>
                  <Button onClick={getCurrentLocation} className="mt-2" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Get Current Location
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mapping Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{mappedBoundaries.length}</div>
                  <div className="text-sm text-muted-foreground">Boundaries Mapped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {mappedBoundaries.reduce((total, b) => total + (b.area || 0), 0).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Hectares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    <Zap className="h-6 w-6 inline-block" />
                  </div>
                  <div className="text-sm text-muted-foreground">Enhanced Quality</div>
                </div>
              </div>

              {mappedBoundaries.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Mapped Boundaries:</h4>
                  {mappedBoundaries.map((boundary, index) => (
                    <div key={boundary.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">
                        {index + 1}. {boundary.type} - {boundary.area} hectares
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(boundary.timestamp).toLocaleTimeString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button onClick={saveBoundaries} disabled={mappedBoundaries.length === 0}>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Boundaries
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}