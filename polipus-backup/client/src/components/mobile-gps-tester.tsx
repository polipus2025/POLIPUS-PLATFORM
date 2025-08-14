import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Smartphone, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function MobileGPSTester() {
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'enabled' | 'disabled' | 'error'>('checking');
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const testGPSPermission = async () => {
    setIsTesting(true);
    setGpsStatus('checking');

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setGpsStatus('error');
        toast({
          title: "GPS Not Supported",
          description: "Your device does not support GPS location services",
          variant: "destructive",
        });
        return;
      }

      // Request current position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setAccuracy(position.coords.accuracy);
          setGpsStatus('enabled');
          toast({
            title: "GPS Test Successful",
            description: `Location detected with ${Math.round(position.coords.accuracy)}m accuracy`,
          });
        },
        (error) => {
          console.error('GPS error:', error);
          setGpsStatus('disabled');
          
          let errorMessage = "GPS access failed";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "GPS permission denied. Please enable location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "GPS position unavailable. Check your device's location settings.";
              break;
            case error.TIMEOUT:
              errorMessage = "GPS request timed out. Please try again.";
              break;
          }
          
          toast({
            title: "GPS Test Failed",
            description: errorMessage,
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      console.error('GPS test error:', error);
      setGpsStatus('error');
      toast({
        title: "GPS Test Error",
        description: "An unexpected error occurred during GPS testing",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (gpsStatus) {
      case 'enabled':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'disabled':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'checking':
        return <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />;
      default:
        return <MapPin className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (gpsStatus) {
      case 'enabled':
        return 'border-green-200 bg-green-50';
      case 'disabled':
        return 'border-red-200 bg-red-50';
      case 'checking':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Mobile GPS Testing Center
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <Alert className={getStatusColor()}>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div className="flex-1">
              <AlertDescription className="font-medium">
                GPS Status: {gpsStatus === 'checking' ? 'Testing...' : 
                           gpsStatus === 'enabled' ? 'Active' :
                           gpsStatus === 'disabled' ? 'Disabled' : 'Error'}
              </AlertDescription>
              {coordinates && (
                <p className="text-sm text-gray-600 mt-1">
                  Location: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                  {accuracy && ` (±${Math.round(accuracy)}m)`}
                </p>
              )}
            </div>
          </div>
        </Alert>

        {/* Test Button */}
        <Button 
          onClick={testGPSPermission}
          disabled={isTesting}
          className="w-full"
          data-testid="button-test-gps"
        >
          {isTesting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testing GPS...
            </>
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Test GPS Permission
            </>
          )}
        </Button>

        {/* Device Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <Badge variant="outline" className="w-full justify-center">
              {navigator.onLine ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div>
            <Badge variant="outline" className="w-full justify-center">
              {'geolocation' in navigator ? 'GPS Supported' : 'No GPS'}
            </Badge>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Testing Instructions:</strong></p>
          <p>1. Click "Test GPS Permission" button</p>
          <p>2. Allow location access when prompted</p>
          <p>3. Wait for location detection</p>
          <p>4. Check accuracy and coordinates</p>
        </div>
      </CardContent>
    </Card>
  );
}