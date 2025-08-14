import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Settings, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GPSPermissionHandlerProps {
  onPermissionGranted?: (position: GeolocationPosition) => void;
  onPermissionDenied?: () => void;
  showCard?: boolean;
  autoRequest?: boolean;
}

export function GPSPermissionHandler({ 
  onPermissionGranted, 
  onPermissionDenied,
  showCard = true,
  autoRequest = true 
}: GPSPermissionHandlerProps) {
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied' | 'unavailable' | 'prompt'>('checking');
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  // Check if geolocation is supported
  const isGeolocationSupported = 'geolocation' in navigator;

  const checkPermissionStatus = async () => {
    if (!isGeolocationSupported) {
      setPermissionStatus('unavailable');
      return;
    }

    try {
      // Check permission status if supported
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'granted') {
          getCurrentPosition();
        } else if (permission.state === 'denied') {
          setPermissionStatus('denied');
          onPermissionDenied?.();
        } else {
          setPermissionStatus('prompt');
          if (autoRequest) {
            requestGPSPermission();
          }
        }
      } else {
        // Fallback for browsers without permission API
        setPermissionStatus('prompt');
        if (autoRequest) {
          requestGPSPermission();
        }
      }
    } catch (error) {
      console.error('Error checking GPS permission:', error);
      setPermissionStatus('prompt');
    }
  };

  const getCurrentPosition = () => {
    if (!isGeolocationSupported) {
      setPermissionStatus('unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position);
        setPermissionStatus('granted');
        onPermissionGranted?.(position);
        toast({
          title: "GPS Enabled",
          description: "Location services are now active",
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setPermissionStatus('denied');
            onPermissionDenied?.();
            break;
          case error.POSITION_UNAVAILABLE:
            setPermissionStatus('unavailable');
            break;
          case error.TIMEOUT:
            toast({
              title: "GPS Timeout",
              description: "Unable to get location. Please try again.",
              variant: "destructive",
            });
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const requestGPSPermission = async () => {
    setIsRequesting(true);
    
    try {
      getCurrentPosition();
    } catch (error) {
      console.error('Error requesting GPS permission:', error);
      setPermissionStatus('denied');
    } finally {
      setIsRequesting(false);
    }
  };

  const openLocationSettings = () => {
    toast({
      title: "Enable Location Services",
      description: "Please enable GPS in your device settings and refresh this page",
    });

    // Try to open device settings (works on some mobile browsers)
    if ('standalone' in window.navigator && (window.navigator as any).standalone) {
      // PWA on iOS
      alert("Please go to Settings > Privacy & Security > Location Services and enable location for this app");
    } else {
      // Regular browser
      alert("Please enable location services in your browser settings and refresh this page");
    }
  };

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  if (!showCard && permissionStatus === 'granted') {
    return null;
  }

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'denied':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'checking':
        return <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />;
      default:
        return <MapPin className="h-6 w-6 text-orange-600" />;
    }
  };

  const getStatusMessage = () => {
    switch (permissionStatus) {
      case 'checking':
        return 'Checking GPS permissions...';
      case 'granted':
        return currentPosition 
          ? `GPS enabled - Location: ${currentPosition.coords.latitude.toFixed(6)}, ${currentPosition.coords.longitude.toFixed(6)}`
          : 'GPS permission granted';
      case 'denied':
        return 'GPS access denied. Location features will not work properly.';
      case 'unavailable':
        return 'GPS is not available on this device.';
      case 'prompt':
        return 'GPS permission required for location-based features.';
      default:
        return 'Unknown GPS status';
    }
  };

  if (!showCard) {
    return (
      <Alert className={`mb-4 ${permissionStatus === 'granted' ? 'border-green-200 bg-green-50' : 
                                permissionStatus === 'denied' ? 'border-red-200 bg-red-50' : 
                                'border-orange-200 bg-orange-50'}`}>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <AlertDescription>{getStatusMessage()}</AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <Card className="mb-6 border-2 border-dashed border-orange-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          GPS Location Services
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert className={permissionStatus === 'granted' ? 'border-green-200 bg-green-50' : 
                            permissionStatus === 'denied' ? 'border-red-200 bg-red-50' : 
                            'border-orange-200 bg-orange-50'}>
            <AlertDescription>{getStatusMessage()}</AlertDescription>
          </Alert>

          {permissionStatus === 'prompt' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                This app requires GPS access for location-based features like farm mapping, livestock tracking, and field inspections.
              </p>
              <Button 
                onClick={requestGPSPermission}
                disabled={isRequesting}
                className="w-full bg-orange-600 hover:bg-orange-700"
                data-testid="button-request-gps"
              >
                {isRequesting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Requesting Permission...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Enable GPS Access
                  </>
                )}
              </Button>
            </div>
          )}

          {permissionStatus === 'denied' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                GPS access was denied. To use location features, please:
              </p>
              <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
                <li>Click the location icon in your browser's address bar</li>
                <li>Select "Allow" for location access</li>
                <li>Refresh this page</li>
              </ol>
              <div className="flex gap-2">
                <Button 
                  onClick={openLocationSettings}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-open-settings"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Open Settings
                </Button>
                <Button 
                  onClick={checkPermissionStatus}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  data-testid="button-retry-gps"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry
                </Button>
              </div>
            </div>
          )}

          {permissionStatus === 'unavailable' && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                GPS is not supported on this device. Location-based features will not be available.
              </AlertDescription>
            </Alert>
          )}

          {permissionStatus === 'granted' && currentPosition && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800 font-medium">Location Services Active</p>
              <p className="text-xs text-green-600 mt-1">
                Accuracy: ±{Math.round(currentPosition.coords.accuracy)}m
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for using GPS permission in components
export function useGPSPermission() {
  const [permissionStatus, setPermissionStatus] = useState<'checking' | 'granted' | 'denied' | 'unavailable' | 'prompt'>('checking');
  const [currentPosition, setCurrentPosition] = useState<GeolocationPosition | null>(null);

  const requestPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition(position);
          setPermissionStatus('granted');
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setPermissionStatus('denied');
              break;
            case error.POSITION_UNAVAILABLE:
              setPermissionStatus('unavailable');
              break;
          }
        }
      );
    } else {
      setPermissionStatus('unavailable');
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return {
    permissionStatus,
    currentPosition,
    requestPermission,
    isGranted: permissionStatus === 'granted',
    isDenied: permissionStatus === 'denied',
    isUnavailable: permissionStatus === 'unavailable'
  };
}