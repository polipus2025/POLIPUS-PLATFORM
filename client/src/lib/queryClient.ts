import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  url: string,
  options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
  }
): Promise<any> {
  const { method = 'GET', body, headers = {} } = options || {};
  
  // Check if offline before making request
  // Handle offline requests - prioritize offline storage for forms
  if (!navigator.onLine) {
    console.log('📱 Offline detected, handling request locally');
    try {
      const offlineResult = await handleOfflineRequest(url, options || {});
      if (offlineResult.success) {
        return offlineResult;
      }
    } catch (error) {
      console.error('Offline handler error:', error);
    }
  }
  
  // Add authorization header if token exists
  const token = localStorage.getItem('authToken');
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...headers,
      },
      body,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    
    // Check if response is HTML instead of JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Received HTML response instead of JSON - possible authentication issue');
    }
    
    return await res.json();
  } catch (error: any) {
    // Handle network errors more gracefully
    if (error.message === 'Failed to fetch') {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Handle offline requests with local storage
async function handleOfflineRequest(url: string, options: { method?: string; body?: string; headers?: Record<string, string> }): Promise<any> {
  console.log('🔄 Handling offline request:', url, options.method);
  
  // Handle farmer registration - store offline and return success
  if (url.includes('/api/farmers') && options.method === 'POST') {
    try {
      const farmerData = JSON.parse(options.body as string);
      
      // Generate unique farmer ID
      const farmerId = 'FARM-' + Date.now().toString().slice(-6);
      const offlineFarmer = {
        ...farmerData,
        farmerId,
        id: Date.now(),
        registrationDate: new Date().toISOString(),
        status: 'pending',
        isOffline: true,
        timestamp: Date.now(),
        syncStatus: 'pending'
      };
      
      // Store in localStorage for offline use
      const offlineFarmers = JSON.parse(localStorage.getItem('offlineFarmers') || '[]');
      offlineFarmers.push(offlineFarmer);
      localStorage.setItem('offlineFarmers', JSON.stringify(offlineFarmers));
      
      console.log('✅ Farmer data saved offline successfully:', farmerId, offlineFarmer);
      
      // Attempt sync in the background
      setTimeout(() => {
        if ((window as any).syncOfflineFarmers) {
          (window as any).syncOfflineFarmers();
        }
      }, 1000);
      
      return {
        success: true,
        message: "Farmer registered offline successfully! Data will sync when connection is restored.",
        data: offlineFarmer,
        offline: true,
        ...offlineFarmer
      };
    } catch (error) {
      console.error('Failed to save farmer offline:', error);
      return {
        success: false,
        message: "Failed to save farmer data offline",
        offline: true
      };
    }
  }
  
  // Mock authentication responses
  if (url.includes('/api/auth/field-agent-login')) {
    return {
      success: true,
      message: "Offline authentication successful",
      user: {
        id: "offline-user",
        type: "field_agent",
        agentId: "agent001"
      }
    };
  }
  
  // Mock dashboard data
  if (url.includes('/api/dashboard/metrics')) {
    return {
      success: true,
      data: {
        totalFarms: 150,
        activeFarmers: 120,
        pendingInspections: 25,
        completedInspections: 95,
        offlineMode: true
      }
    };
  }
  
  // Default offline response for unsupported endpoints
  return {
    success: false,
    message: "This feature is not available offline. Data will be saved when connection returns.",
    offlineMode: true
  };
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    // Handle offline farmers query - merge online and offline data
    if (url === '/api/farmers') {
      try {
        // Add authorization header if token exists
        const token = localStorage.getItem('authToken');
        const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
        
        const res = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          credentials: "include",
        });

        let onlineFarmers: any[] = [];
        
        if (res.ok) {
          const responseData = await res.json();
          onlineFarmers = Array.isArray(responseData) ? responseData : responseData.data || [];
        }
        
        // Get offline farmers from localStorage
        const offlineFarmers = JSON.parse(localStorage.getItem('offlineFarmers') || '[]');
        
        // Combine online and offline farmers
        const allFarmers = [...onlineFarmers, ...offlineFarmers];
        
        console.log(`📊 Farmers loaded: ${onlineFarmers.length} online, ${offlineFarmers.length} offline`);
        
        return allFarmers;
        
      } catch (error) {
        console.log('📱 Loading offline farmers only');
        // If online fetch fails, return offline farmers only
        const offlineFarmers = JSON.parse(localStorage.getItem('offlineFarmers') || '[]');
        return offlineFarmers;
      }
    }
    
    // Regular fetch for other endpoints
    const token = localStorage.getItem('authToken');
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    
    // Check if response is HTML instead of JSON
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Received HTML response instead of JSON - possible authentication issue');
    }
    
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Enhanced auto-sync offline data when connection is restored
let syncInProgress = false;

async function syncOfflineFarmers() {
  if (syncInProgress) return;
  syncInProgress = true;
  
  try {
    const offlineFarmers = JSON.parse(localStorage.getItem('offlineFarmers') || '[]');
    const pendingFarmers = offlineFarmers.filter((f: any) => f.status !== 'synced');
    
    if (pendingFarmers.length === 0) {
      console.log('📝 No pending farmers to sync');
      return;
    }
    
    console.log(`🔄 Syncing ${pendingFarmers.length} offline farmers...`);
    let successCount = 0;
    let failCount = 0;
    
    for (const farmer of pendingFarmers) {
      try {
        // Remove offline-specific fields before syncing
        const { id, isOffline, timestamp, status, ...cleanFarmer } = farmer;
        
        const response = await apiRequest('/api/farmers', {
          method: 'POST',
          body: JSON.stringify(cleanFarmer)
        });
        
        if (response.success || response.data) {
          // Mark as synced
          farmer.status = 'synced';
          farmer.syncedAt = Date.now();
          farmer.serverId = response.data?.id || response.id;
          successCount++;
          console.log(`✅ Synced: ${farmer.firstName} ${farmer.lastName}`);
        } else {
          farmer.status = 'failed';
          failCount++;
          console.log(`❌ Failed: ${farmer.firstName} ${farmer.lastName}`);
        }
      } catch (error: any) {
        farmer.status = 'failed';
        farmer.syncError = error?.message || 'Unknown error';
        failCount++;
        console.error(`❌ Error syncing ${farmer.firstName} ${farmer.lastName}:`, error);
      }
    }
    
    // Update localStorage with sync results
    localStorage.setItem('offlineFarmers', JSON.stringify(offlineFarmers));
    
    // Refresh farmers list
    queryClient.invalidateQueries({ queryKey: ['/api/farmers'] });
    
    // Show notification
    if (successCount > 0) {
      const message = `✅ Successfully synced ${successCount} farmer${successCount > 1 ? 's' : ''} to the server!${failCount > 0 ? ` (${failCount} failed)` : ''}`;
      console.log(message);
      
      // Dispatch custom event for UI components to handle
      window.dispatchEvent(new CustomEvent('farmer-sync-complete', {
        detail: { success: successCount, failed: failCount, message }
      }));
    }
    
    // Clean up successfully synced farmers after some time
    setTimeout(() => {
      const current = JSON.parse(localStorage.getItem('offlineFarmers') || '[]');
      const remaining = current.filter((f: any) => f.status !== 'synced');
      localStorage.setItem('offlineFarmers', JSON.stringify(remaining));
      console.log('🧹 Cleaned up synced farmers from offline storage');
    }, 5000);
    
  } catch (error) {
    console.error('❌ Sync operation failed:', error);
  } finally {
    syncInProgress = false;
  }
}

function setupOfflineSync() {
  // Sync when coming back online
  window.addEventListener('online', async () => {
    console.log('🌐 Connection restored - starting sync...');
    setTimeout(syncOfflineFarmers, 1000); // Small delay for connection stability
  });
  
  // Also sync on page load if online (handles browser refresh case)
  if (navigator.onLine) {
    setTimeout(syncOfflineFarmers, 3000); // Wait for app initialization
  }
}

// Initialize offline sync when the module loads
if (typeof window !== 'undefined') {
  setupOfflineSync();
  // Make sync function available globally for manual triggering
  (window as any).syncOfflineFarmers = syncOfflineFarmers;
}
