import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OfflineManagerProps {
  children: React.ReactNode;
}

interface OfflineData {
  farmers: any[];
  farmPlots: any[];
  trackingRecords: any[];
  cropPlans: any[];
  lastSync: string;
}

export const OfflineManager: React.FC<OfflineManagerProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const [pendingActions, setPendingActions] = useState<any[]>([]);

  useEffect(() => {
    // Network status listeners
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA installation prompt
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install prompt after 3 seconds if not already installed
      setTimeout(() => {
        if (!window.matchMedia('(display-mode: standalone)').matches) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Load offline data from localStorage
    const storedOfflineData = localStorage.getItem('polipus-offline-data');
    const storedPendingActions = localStorage.getItem('polipus-pending-actions');
    
    if (storedOfflineData) {
      setOfflineData(JSON.parse(storedOfflineData));
    }
    
    if (storedPendingActions) {
      setPendingActions(JSON.parse(storedPendingActions));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    try {
      for (const action of pendingActions) {
        const response = await fetch(action.endpoint, {
          method: action.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(action.data),
        });

        if (!response.ok) {
          throw new Error(`Failed to sync action: ${action.type}`);
        }
      }

      // Clear pending actions after successful sync
      setPendingActions([]);
      localStorage.removeItem('polipus-pending-actions');
      
      // Show success message
      showNotification('Offline data synced successfully!', 'success');
      
    } catch (error) {
      console.error('Error syncing offline data:', error);
      showNotification('Failed to sync some offline data. Will retry later.', 'error');
    }
  };

  const cacheDataForOffline = async () => {
    try {
      const endpoints = ['/api/farmers', '/api/farm-plots', '/api/tracking-records', '/api/crop-plans'];
      const data: any = { lastSync: new Date().toISOString() };

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint);
        if (response.ok) {
          const endpointData = await response.json();
          const key = endpoint.split('/').pop()?.replace('-', '') || 'unknown';
          data[key] = endpointData;
        }
      }

      setOfflineData(data);
      localStorage.setItem('polipus-offline-data', JSON.stringify(data));
      showNotification('Data cached for offline use!', 'success');
      
    } catch (error) {
      console.error('Error caching data:', error);
      showNotification('Failed to cache data for offline use.', 'error');
    }
  };

  const addPendingAction = (type: string, endpoint: string, method: string, data: any) => {
    const action = {
      id: Date.now().toString(),
      type,
      endpoint,
      method,
      data,
      timestamp: new Date().toISOString(),
    };

    const newPendingActions = [...pendingActions, action];
    setPendingActions(newPendingActions);
    localStorage.setItem('polipus-pending-actions', JSON.stringify(newPendingActions));
  };

  const installPWA = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
      }
      
      (window as any).deferredPrompt = null;
    } else {
      // Manual installation instructions
      showNotification('Add this app to your home screen from your browser menu!', 'info');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-transform transform translate-x-full ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Network Status Indicator */}
      <div className={`offline-indicator ${!isOnline ? 'show' : ''}`}>
        <div className="flex items-center justify-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>You're offline - Some features may be limited</span>
          {pendingActions.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pendingActions.length} pending changes
            </Badge>
          )}
        </div>
      </div>

      {/* Online Indicator (brief) */}
      <div className={`offline-indicator online-indicator ${isOnline && pendingActions.length > 0 ? 'show' : ''}`}>
        <div className="flex items-center justify-center gap-2">
          <Wifi className="h-4 w-4" />
          <span>Back online - Syncing data...</span>
        </div>
      </div>

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="pwa-install-prompt show">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Install Polipus App</h4>
                <p className="text-sm text-gray-300 mt-1">
                  Install this app for better offline access and faster performance.
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowInstallPrompt(false)}
                className="text-white border-white hover:bg-white hover:text-black"
              >
                Later
              </Button>
              <Button 
                size="sm"
                onClick={installPWA}
                className="bg-white text-black hover:bg-gray-200"
              >
                Install
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Status Card */}
      {!isOnline && (
        <Card className="mx-4 mb-4 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-medium text-yellow-800">Offline Mode</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  You can continue working offline. Changes will sync when you're back online.
                </p>
                {offlineData && (
                  <p className="text-xs text-yellow-600 mt-2">
                    Last sync: {new Date(offlineData.lastSync).toLocaleDateString()}
                  </p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={cacheDataForOffline}
                    disabled={!isOnline}
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    Cache Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main App Content */}
      {children}
      
      {/* Offline Data Context */}
      <div style={{ display: 'none' }}>
        {JSON.stringify({ isOnline, offlineData, addPendingAction })}
      </div>
    </div>
  );
};

export default OfflineManager;