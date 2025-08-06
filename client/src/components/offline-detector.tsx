import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OfflineDetectorProps {
  showAlert?: boolean;
  className?: string;
}

export function OfflineDetector({ showAlert = true, className = "" }: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      setShowOfflineAlert(false);
    }

    function handleOffline() {
      setIsOnline(false);
      setShowOfflineAlert(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const tryReconnect = () => {
    // Force a connection test
    fetch('/', { 
      method: 'HEAD',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000)
    })
    .then(() => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    })
    .catch(() => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    });
  };

  if (!showAlert || (!showOfflineAlert && isOnline)) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 ${className}`}>
      <Alert variant={isOnline ? "default" : "destructive"} className="bg-white shadow-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <AlertDescription className="font-medium">
              {isOnline ? (
                "Connection restored"
              ) : (
                "You're offline. Some features may not work."
              )}
            </AlertDescription>
          </div>
          {!isOnline && (
            <Button
              variant="outline"
              size="sm"
              onClick={tryReconnect}
              className="ml-4"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
}

// Hook version for components that need offline state
export function useOfflineDetector() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
}