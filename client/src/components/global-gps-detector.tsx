import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Satellite, MapPin, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GPSStatus {
  hasPermission: boolean;
  coordinates: GeolocationCoordinates | null;
  error: string | null;
  isDetecting: boolean;
  lastUpdated: Date | null;
}

export default function GlobalGPSDetector() {
  const [gpsStatus, setGpsStatus] = useState<GPSStatus>({
    hasPermission: false,
    coordinates: null,
    error: null,
    isDetecting: false,
    lastUpdated: null
  });
  
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Check if GPS was already detected from localStorage
  useEffect(() => {
    const savedGPS = localStorage.getItem('polipus_gps_status');
    if (savedGPS) {
      try {
        const parsed = JSON.parse(savedGPS);
        if (parsed.coordinates && parsed.hasPermission) {
          setGpsStatus({
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated)
          });
        }
      } catch (error) {
      }
    }
  }, []);

  const detectGPS = async () => {
    if (!navigator.geolocation) {
      const error = 'GPS not supported by this browser';
      setGpsStatus(prev => ({ ...prev, error, isDetecting: false }));
      toast({
        title: "GPS Not Supported",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setGpsStatus(prev => ({ ...prev, isDetecting: true, error: null }));

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newStatus: GPSStatus = {
          hasPermission: true,
          coordinates: position.coords,
          error: null,
          isDetecting: false,
          lastUpdated: new Date()
        };
        
        setGpsStatus(newStatus);
        
        // Save to localStorage for global access
        localStorage.setItem('polipus_gps_status', JSON.stringify({
          ...newStatus,
          lastUpdated: newStatus.lastUpdated?.toISOString()
        }));

        toast({
          title: "GPS Location Detected",
          description: `Location: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        });
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'GPS permission denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'GPS position unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'GPS request timeout';
            break;
          default:
            errorMessage = 'Unknown GPS error occurred';
            break;
        }

        setGpsStatus(prev => ({ 
          ...prev, 
          error: errorMessage, 
          isDetecting: false,
          hasPermission: false
        }));
        
        toast({
          title: "GPS Detection Failed",
          description: errorMessage,
          variant: "destructive",
        });
      },
      options
    );
  };

  const clearGPSData = () => {
    setGpsStatus({
      hasPermission: false,
      coordinates: null,
      error: null,
      isDetecting: false,
      lastUpdated: null
    });
    localStorage.removeItem('polipus_gps_status');
    toast({
      title: "GPS Data Cleared",
      description: "GPS detection data has been reset",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={gpsStatus.hasPermission ? "default" : "outline"}
          className={`
            ${gpsStatus.hasPermission 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "border-blue-200 text-blue-600 hover:bg-blue-50"
            }
            shadow-lg transition-all duration-300
          `}
        >
          {gpsStatus.hasPermission ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              GPS Active
            </>
          ) : (
            <>
              <Satellite className="h-4 w-4 mr-2" />
              Detect GPS Location
            </>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Global GPS Detection Center
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {gpsStatus.hasPermission ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    GPS Detected & Active
                  </>
                ) : gpsStatus.error ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    GPS Detection Failed
                  </>
                ) : (
                  <>
                    <Satellite className="h-4 w-4 text-blue-600" />
                    GPS Ready to Detect
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gpsStatus.coordinates && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800 text-sm">Location Data:</h4>
                  <p className="text-sm text-green-700">
                    <strong>Latitude:</strong> {gpsStatus.coordinates.latitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Longitude:</strong> {gpsStatus.coordinates.longitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-green-700">
                    <strong>Accuracy:</strong> ±{Math.round(gpsStatus.coordinates.accuracy)}m
                  </p>
                  {gpsStatus.lastUpdated && (
                    <p className="text-xs text-green-600 mt-2">
                      <strong>Detected:</strong> {gpsStatus.lastUpdated.toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {gpsStatus.error && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-red-800 text-sm">Error:</h4>
                  <p className="text-sm text-red-700">{gpsStatus.error}</p>
                </div>
              )}

              {!gpsStatus.hasPermission && !gpsStatus.error && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 text-sm">Detection Info:</h4>
                  <p className="text-sm text-blue-700">
                    Click "Detect GPS Location" to enable location services for all Polipus modules.
                    This needs to be done only once.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={detectGPS}
              disabled={gpsStatus.isDetecting}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              {gpsStatus.isDetecting ? (
                <>
                  <Satellite className="h-4 w-4 mr-2 animate-spin" />
                  Detecting Location...
                </>
              ) : (
                <>
                  <Satellite className="h-4 w-4 mr-2" />
                  {gpsStatus.hasPermission ? 'Refresh GPS Location' : 'Detect GPS Location'}
                </>
              )}
            </Button>

            {gpsStatus.hasPermission && (
              <Button
                onClick={clearGPSData}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
              >
                Clear GPS Data
              </Button>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">How it Works:</h4>
            <ol className="text-xs text-gray-700 space-y-1">
              <li>1. Click "Detect GPS Location" button</li>
              <li>2. Allow location access when prompted</li>
              <li>3. GPS will be available across all Polipus modules</li>
              <li>4. Location data is stored locally for quick access</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}