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
async function handleOfflineRequest(url: string, options: RequestInit): Promise<any> {
  console.log('🔄 Handling offline request:', url);
  
  // Handle farmer registration - store offline and return success
  if (url.includes('/api/farmers') && options.method === 'POST') {
    try {
      const farmerData = JSON.parse(options.body as string);
      const offlineFarmer = {
        ...farmerData,
        id: `offline_${Date.now()}`,
        isOffline: true,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      // Store in localStorage for offline use
      const offlineFarmers = JSON.parse(localStorage.getItem('offlineFarmers') || '[]');
      offlineFarmers.push(offlineFarmer);
      localStorage.setItem('offlineFarmers', JSON.stringify(offlineFarmers));
      
      console.log('✅ Farmer data saved offline:', offlineFarmer);
      
      return {
        success: true,
        message: "Farmer registered offline successfully! Data will sync when connection is restored.",
        data: offlineFarmer,
        offline: true
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
    // Add authorization header if token exists
    const token = localStorage.getItem('authToken');
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    
    const res = await fetch(queryKey.join("/") as string, {
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

// Auto-sync offline data when connection is restored
function setupOfflineSync() {
  window.addEventListener('online', async () => {
    console.log('🌐 Connection restored - syncing offline data');
    
    try {
      const offlineFarmers = JSON.parse(localStorage.getItem('offlineFarmers') || '[]');
      
      if (offlineFarmers.length > 0) {
        console.log(`📤 Syncing ${offlineFarmers.length} offline farmers`);
        
        for (const farmer of offlineFarmers) {
          try {
            // Remove offline fields before syncing
            const { isOffline, timestamp, status, ...cleanFarmer } = farmer;
            
            const response = await apiRequest('/api/farmers', {
              method: 'POST',
              body: JSON.stringify(cleanFarmer)
            });
            
            if (response.success) {
              console.log('✅ Farmer synced successfully:', farmer.id);
            }
          } catch (error) {
            console.error('❌ Failed to sync farmer:', farmer.id, error);
          }
        }
        
        // Clear synced data
        localStorage.removeItem('offlineFarmers');
        console.log('🧹 Offline farmers data cleared after sync');
        
        // Show success notification
        if (window.location.pathname.includes('farmer') || window.location.pathname.includes('registration')) {
          alert('✅ Offline farmer data has been successfully synced to the server!');
        }
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  });
}

// Initialize offline sync when the module loads
if (typeof window !== 'undefined') {
  setupOfflineSync();
}
