import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Satellite, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Settings,
  Shield,
  Navigation,
  Clock,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GPSStatus {
  supported: boolean;
  permission: PermissionState | 'unknown';
  accuracy: number | null;
  satellites: number;
  signal: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  lastUpdate: Date | null;
  error: string | null;
}

interface GPSPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed: number | null;
  heading: number | null;
}

export default function GPSDiagnosticSystem() {
  const [gpsStatus, setGpsStatus] = React.useState<GPSStatus>({
    supported: false,
    permission: 'unknown',
    accuracy: null,
    satellites: 0,
    signal: 'none',
    lastUpdate: null,
    error: null
  });
  
  const [currentPosition, setCurrentPosition] = React.useState<GPSPosition | null>(null);
  const [isTracking, setIsTracking] = React.useState(false);
  const [watchId, setWatchId] = React.useState<number | null>(null);
  const { toast } = useToast();

  // Initialize GPS diagnostic
  React.useEffect(() => {
    initializeGPSDiagnostic();
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const initializeGPSDiagnostic = async () => {
    try {
      // Check if geolocation is supported
      const supported = 'geolocation' in navigator;
      
      let permission: PermissionState | 'unknown' = 'unknown';
      
      // Check permissions if supported
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
          permission = permissionStatus.state;
          
          // Listen for permission changes
          permissionStatus.onchange = () => {
            setGpsStatus(prev => ({ ...prev, permission: permissionStatus.state }));
          };
        } catch (err) {
        }
      }

      setGpsStatus(prev => ({
        ...prev,
        supported,
        permission,
        error: null
      }));

      // If we have permission, try to get position
      if (permission === 'granted' || permission === 'unknown') {
        await getCurrentPosition();
      }
    } catch (error) {
      setGpsStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'GPS initialization failed'
      }));
    }
  };

  const getCurrentPosition = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpsPos: GPSPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed,
            heading: position.coords.heading
          };

          setCurrentPosition(gpsPos);
          
          // Calculate signal quality based on accuracy
          let signal: 'excellent' | 'good' | 'fair' | 'poor' | 'none' = 'none';
          if (position.coords.accuracy <= 5) signal = 'excellent';
          else if (position.coords.accuracy <= 10) signal = 'good';
          else if (position.coords.accuracy <= 20) signal = 'fair';
          else signal = 'poor';

          // Simulate satellite count (in real implementation, this would come from GPS receiver)
          const satellites = Math.max(4, Math.min(12, Math.floor(20 - position.coords.accuracy / 2)));

          setGpsStatus(prev => ({
            ...prev,
            accuracy: position.coords.accuracy,
            satellites,
            signal,
            lastUpdate: new Date(),
            error: null,
            permission: 'granted'
          }));

          toast({
            title: "GPS Position Updated",
            description: `Location acquired with ${position.coords.accuracy.toFixed(1)}m accuracy`,
          });

          resolve();
        },
        (error) => {
          let errorMessage = 'GPS error occurred';
          let permission: PermissionState | 'unknown' = 'unknown';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'GPS permission denied by user';
              permission = 'denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'GPS position unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'GPS timeout - position request timed out';
              break;
            default:
              errorMessage = `GPS error: ${error.message}`;
          }

          setGpsStatus(prev => ({
            ...prev,
            error: errorMessage,
            permission,
            signal: 'none'
          }));

          toast({
            title: "GPS Error",
            description: errorMessage,
            variant: "destructive"
          });

          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    });
  };

  const requestGPSPermission = async () => {
    try {
      await getCurrentPosition();
    } catch (error) {
    }
  };

  const startContinuousTracking = () => {
    if (!navigator.geolocation) return;

    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const gpsPos: GPSPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed,
          heading: position.coords.heading
        };

        setCurrentPosition(gpsPos);
        
        let signal: 'excellent' | 'good' | 'fair' | 'poor' | 'none' = 'none';
        if (position.coords.accuracy <= 5) signal = 'excellent';
        else if (position.coords.accuracy <= 10) signal = 'good';
        else if (position.coords.accuracy <= 20) signal = 'fair';
        else signal = 'poor';

        const satellites = Math.max(4, Math.min(12, Math.floor(20 - position.coords.accuracy / 2)));

        setGpsStatus(prev => ({
          ...prev,
          accuracy: position.coords.accuracy,
          satellites,
          signal,
          lastUpdate: new Date(),
          error: null
        }));
      },
      (error) => {
        setGpsStatus(prev => ({
          ...prev,
          error: `Tracking error: ${error.message}`,
          signal: 'none'
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );

    setWatchId(id);
    setIsTracking(true);
  };

  const stopContinuousTracking = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getStatusIcon = () => {
    if (gpsStatus.error) return <XCircle className="h-5 w-5 text-red-500" />;
    if (gpsStatus.signal === 'excellent' || gpsStatus.signal === 'good') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (gpsStatus.signal === 'fair') return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            GPS System Diagnostic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                {getStatusIcon()}
              </div>
              <p className="text-sm font-medium">System Status</p>
              <p className="text-xs text-gray-600 mt-1">
                {gpsStatus.supported ? 'Supported' : 'Not Supported'}
              </p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium">Permission</p>
              <Badge className={
                gpsStatus.permission === 'granted' ? 'bg-green-100 text-green-800' :
                gpsStatus.permission === 'denied' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }>
                {gpsStatus.permission || 'Unknown'}
              </Badge>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Navigation className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-sm font-medium">Satellites</p>
              <p className="text-lg font-bold text-purple-600">{gpsStatus.satellites}</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-sm font-medium">Signal Quality</p>
              <Badge className={getSignalColor(gpsStatus.signal)}>
                {gpsStatus.signal}
              </Badge>
            </div>
          </div>

          {gpsStatus.error && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{gpsStatus.error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              onClick={requestGPSPermission} 
              disabled={gpsStatus.permission === 'granted'}
              variant={gpsStatus.permission === 'granted' ? 'outline' : 'default'}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {gpsStatus.permission === 'granted' ? 'Permission Granted' : 'Request GPS Permission'}
            </Button>

            <Button 
              onClick={getCurrentPosition}
              disabled={!gpsStatus.supported || gpsStatus.permission === 'denied'}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Get Current Position
            </Button>

            <Button 
              onClick={isTracking ? stopContinuousTracking : startContinuousTracking}
              disabled={!gpsStatus.supported || gpsStatus.permission === 'denied'}
              variant={isTracking ? 'destructive' : 'secondary'}
            >
              {isTracking ? (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Stop Tracking
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Continuous Tracking
                </>
              )}
            </Button>
          </div>

          {currentPosition && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Current Position</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Coordinates</p>
                    <p className="font-mono text-sm">
                      {currentPosition.latitude.toFixed(6)}, {currentPosition.longitude.toFixed(6)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Accuracy</p>
                    <p className="text-sm">{currentPosition.accuracy.toFixed(1)} meters</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Speed</p>
                    <p className="text-sm">{currentPosition.speed ? `${currentPosition.speed.toFixed(1)} m/s` : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Update</p>
                    <p className="text-sm">{new Date(currentPosition.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                {gpsStatus.lastUpdate && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        Last GPS update: {gpsStatus.lastUpdate.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}