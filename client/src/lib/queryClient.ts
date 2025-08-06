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
  if (!navigator.onLine) {
    throw new Error('You are currently offline. Please check your internet connection and try again.');
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
