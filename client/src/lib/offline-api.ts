import { offlineSyncManager } from './offline-sync';
import { apiRequest } from './queryClient';

/**
 * Wrapper around API requests that automatically handles offline queueing
 */
export class OfflineAwareAPI {
  private getUserId(): string {
    return localStorage.getItem('userId') || 'unknown';
  }

  async create<T>(endpoint: string, data: any): Promise<T> {
    if (navigator.onLine) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json() as T;
      } catch (error) {
        // If request fails, queue it for offline sync
        await offlineSyncManager.queueOperation('CREATE', endpoint, data, this.getUserId());
        throw error;
      }
    } else {
      // Offline - queue the operation
      await offlineSyncManager.queueOperation('CREATE', endpoint, data, this.getUserId());
      
      // Return optimistic response
      return {
        ...data,
        id: `temp-${Date.now()}`,
        _isOptimistic: true
      } as T;
    }
  }

  async update<T>(endpoint: string, data: any): Promise<T> {
    if (navigator.onLine) {
      try {
        const response = await fetch(endpoint, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json() as T;
      } catch (error) {
        await offlineSyncManager.queueOperation('UPDATE', endpoint, data, this.getUserId());
        throw error;
      }
    } else {
      await offlineSyncManager.queueOperation('UPDATE', endpoint, data, this.getUserId());
      
      return {
        ...data,
        updatedAt: new Date().toISOString(),
        _isOptimistic: true
      } as T;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    if (navigator.onLine) {
      try {
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json() as T;
      } catch (error) {
        await offlineSyncManager.queueOperation('DELETE', endpoint, {}, this.getUserId());
        throw error;
      }
    } else {
      await offlineSyncManager.queueOperation('DELETE', endpoint, {}, this.getUserId());
      
      return {
        success: true,
        _isOptimistic: true
      } as T;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    // For GET requests, we try cache first when offline
    if (!navigator.onLine) {
      const cached = this.getCachedData<T>(endpoint);
      if (cached) {
        return cached;
      }
      throw new Error('No cached data available offline');
    }

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json() as T;
      this.setCachedData(endpoint, result);
      return result;
    } catch (error) {
      // Fallback to cache if available
      const cached = this.getCachedData<T>(endpoint);
      if (cached) {
        return cached;
      }
      throw error;
    }
  }

  private getCachedData<T>(endpoint: string): T | null {
    try {
      const cached = localStorage.getItem(`cache:${endpoint}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (Date.now() - timestamp < maxAge) {
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading cached data:', error);
    }
    return null;
  }

  private setCachedData(endpoint: string, data: any): void {
    try {
      localStorage.setItem(`cache:${endpoint}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  clearCache(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache:')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

export const offlineAPI = new OfflineAwareAPI();