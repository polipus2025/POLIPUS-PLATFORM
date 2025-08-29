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
  // Allow offline functionality - disable offline checks
  // Always try to handle requests locally if offline
  if (!navigator.onLine) {
    try {
      return handleOfflineRequest(url, options || {});
    } catch (error) {
      // If offline handler fails, continue with normal request
    }
  }
  
  // Add authorization header if token exists (but not for auth endpoints)
  const isAuthEndpoint = url.includes('/auth/');
  const token = localStorage.getItem('authToken');
  const authHeaders: Record<string, string> = (token && !isAuthEndpoint) ? { Authorization: `Bearer ${token}` } : {};
  
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

// Handle offline requests with mock data
async function handleOfflineRequest(url: string, options: RequestInit): Promise<any> {
  console.log('Handling offline request:', url);
  
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
  
  // Default offline response
  return {
    success: false,
    message: "Feature not available offline",
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
