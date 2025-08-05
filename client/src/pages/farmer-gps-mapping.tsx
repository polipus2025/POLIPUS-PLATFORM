import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import { 
  MapPin, 
  Satellite, 
  CheckCircle, 
  ArrowLeft,
  Target,
  Navigation,
  Layers,
  Activity,
  Zap,
  Globe,
  TreePine
} from 'lucide-react';
import GPSDiagnosticSystem from '@/components/gps/gps-diagnostic-system';
import InteractiveBoundaryMapper from '@/components/maps/interactive-boundary-mapper';

export default function FarmerGPSMapping() {
  const [activeTab, setActiveTab] = useState('diagnostic');
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const { toast } = useToast();

  // Get farmer info from localStorage
  const farmerId = localStorage.getItem("farmerId") || "FRM-2024-001";
  const farmerName = localStorage.getItem("farmerFirstName") || "Farmer";

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "GPS Not Supported",
        description: "Your browser doesn't support GPS location services",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position);
        toast({
          title: "Location Found",
          description: `GPS accuracy: ${position.coords.accuracy.toFixed(1)} meters`,
        });
      },
      (error) => {
        let message = "Could not get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "GPS permission denied. Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "GPS position unavailable. Make sure GPS is enabled on your device.";
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
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="min-h-screen isms-gradient">
      <Helmet>
        <title>GPS Farm Mapping - AgriTrace360 LACRA</title>
        <meta name="description" content="Farmer GPS mapping and boundary management tools" />
      </Helmet>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="w-16 h-16 rounded-2xl isms-icon-bg-green flex items-center justify-center">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Farm GPS Mapping</h1>
              <p className="text-slate-600 text-base sm:text-lg">
                Map your farm boundaries and manage GPS locations - {farmerName} ({farmerId})
              </p>
            </div>
          </div>
          <Button
            onClick={getCurrentLocation}
            className="isms-button"
          >
            <Target className="h-4 w-4 mr-2" />
            Get Location
          </Button>
        </div>

        {/* Current Location Display */}
        {currentPosition && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Current GPS Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Latitude</p>
                  <p className="font-mono text-sm">{currentPosition.coords.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Longitude</p>
                  <p className="font-mono text-sm">{currentPosition.coords.longitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Accuracy</p>
                  <p className="text-sm">{currentPosition.coords.accuracy.toFixed(1)} meters</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Timestamp</p>
                  <p className="text-sm">{new Date(currentPosition.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-xl">
            <TabsTrigger value="diagnostic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Activity className="h-4 w-4 mr-2" />
              GPS Status
            </TabsTrigger>
            <TabsTrigger value="mapping" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Layers className="h-4 w-4 mr-2" />
              Boundary Mapping
            </TabsTrigger>
            <TabsTrigger value="tools" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4 mr-2" />
              Farm Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="diagnostic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>GPS System Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <GPSDiagnosticSystem />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Farm Boundary Mapping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">How to Map Your Farm Boundaries:</h3>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Walk around the perimeter of your farm plot</li>
                    <li>2. Use the boundary mapper below to record GPS points</li>
                    <li>3. Complete the boundary by connecting back to your starting point</li>
                    <li>4. Save your boundary map for compliance documentation</li>
                  </ol>
                </div>
                <InteractiveBoundaryMapper 
                  onBoundaryComplete={(boundary) => {
                    toast({
                      title: "Farm Boundary Saved",
                      description: `${boundary.name} mapped with ${boundary.points.length} GPS points`,
                    });
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-5 w-5" />
                    Farm Management Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/farm-plots">
                    <Button className="w-full justify-start" variant="outline">
                      <Layers className="h-4 w-4 mr-2" />
                      View All Farm Plots
                    </Button>
                  </Link>
                  <Link href="/batch-code-generator">
                    <Button className="w-full justify-start" variant="outline">
                      <Target className="h-4 w-4 mr-2" />
                      Generate Batch Code
                    </Button>
                  </Link>
                  <Button className="w-full justify-start" variant="outline" disabled>
                    <Satellite className="h-4 w-4 mr-2" />
                    Satellite Monitoring (Coming Soon)
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GPS Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">GPS Support</span>
                      <Badge variant={navigator.geolocation ? "default" : "destructive"}>
                        {navigator.geolocation ? "Available" : "Not Available"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">High Accuracy</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Farmer ID</span>
                      <Badge variant="outline">{farmerId}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}