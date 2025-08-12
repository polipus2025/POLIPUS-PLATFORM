// Offline Authentication Service for AgriTrace360
// Handles authentication with offline capabilities

import { offlineStorage, type AuthToken } from './offline-storage';

interface LoginCredentials {
  username: string;
  password: string;
  userType: 'regulatory' | 'farmer' | 'field_agent' | 'exporter';
}

interface LoginResult {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    userType: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  message?: string;
  isOffline?: boolean;
}

class OfflineAuthService {
  private currentUser: any = null;
  private authListeners: Array<(user: any) => void> = [];

  constructor() {
    this.loadStoredAuth();
  }

  private async loadStoredAuth(): Promise<void> {
    // Try to load from localStorage first
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');

    if (storedToken && storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.notifyAuthListeners();
        return;
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
      }
    }

    // Try to load from offline storage
    const authTokens = await offlineStorage.getAllAuthTokensOffline();
    if (authTokens.length > 0) {
      const token = authTokens[0];
      this.currentUser = {
        username: token.username,
        userType: token.userType,
        role: token.role,
        isOffline: true
      };
      this.notifyAuthListeners();
    }
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const { username, password, userType } = credentials;

    // Try online login first
    if (navigator.onLine) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, userType }),
        });

        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Store authentication data
            localStorage.setItem('authToken', result.token);
            localStorage.setItem('currentUser', JSON.stringify(result.user));
            
            // Store in offline storage for future offline access
            await offlineStorage.saveAuthTokenOffline(
              username,
              result.token,
              userType,
              result.user.role,
              24 * 60 * 60 // 24 hours
            );

            this.currentUser = result.user;
            this.notifyAuthListeners();

            return {
              success: true,
              token: result.token,
              user: result.user,
              isOffline: false
            };
          }
        }

        const errorResult = await response.json();
        
        // If online login fails, try offline login
        return this.tryOfflineLogin(credentials, errorResult.message);
        
      } catch (error) {
        console.error('Online login failed:', error);
        // Network error, try offline login
        return this.tryOfflineLogin(credentials, 'Network error');
      }
    } else {
      // Device is offline, use offline login
      return this.tryOfflineLogin(credentials, 'Device is offline');
    }
  }

  private async tryOfflineLogin(credentials: LoginCredentials, onlineError: string): Promise<LoginResult> {
    const { username, userType } = credentials;

    // Check if user has been authenticated before
    const storedToken = await offlineStorage.getAuthTokenOffline(username);
    
    if (storedToken && storedToken.userType === userType) {
      // Use predefined offline credentials for demo
      const offlineCredentials = this.getOfflineCredentials();
      const userKey = `${userType}.${username}`;
      
      if (offlineCredentials[userKey]) {
        const offlineUser = {
          id: 999, // Offline user ID
          username,
          userType,
          role: storedToken.role,
          firstName: offlineCredentials[userKey].firstName,
          lastName: offlineCredentials[userKey].lastName,
          isOffline: true
        };

        localStorage.setItem('currentUser', JSON.stringify(offlineUser));
        this.currentUser = offlineUser;
        this.notifyAuthListeners();

        return {
          success: true,
          token: storedToken.token,
          user: offlineUser,
          message: 'Authenticated offline',
          isOffline: true
        };
      }
    }

    // Try with demo offline credentials
    const offlineCredentials = this.getOfflineCredentials();
    const userKey = `${userType}.${username}`;
    
    if (offlineCredentials[userKey] && credentials.password === offlineCredentials[userKey].password) {
      const offlineUser = {
        id: 999,
        username,
        userType,
        role: userType === 'regulatory' ? 'regulatory_admin' : userType,
        firstName: offlineCredentials[userKey].firstName,
        lastName: offlineCredentials[userKey].lastName,
        isOffline: true
      };

      // Generate offline token
      const offlineToken = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store offline authentication
      await offlineStorage.saveAuthTokenOffline(
        username,
        offlineToken,
        userType,
        offlineUser.role,
        24 * 60 * 60 // 24 hours
      );

      localStorage.setItem('currentUser', JSON.stringify(offlineUser));
      this.currentUser = offlineUser;
      this.notifyAuthListeners();

      return {
        success: true,
        token: offlineToken,
        user: offlineUser,
        message: 'Authenticated offline',
        isOffline: true
      };
    }

    return {
      success: false,
      message: `Authentication failed. ${onlineError}. No offline credentials available for this user.`
    };
  }

  private getOfflineCredentials(): Record<string, { password: string; firstName: string; lastName: string }> {
    return {
      // Regulatory users
      'regulatory.admin': { password: 'admin123', firstName: 'Admin', lastName: 'User' },
      'regulatory.inspector': { password: 'inspect123', firstName: 'John', lastName: 'Inspector' },
      
      // Farmer users
      'farmer.farmer001': { password: 'farmer123', firstName: 'John', lastName: 'Farmer' },
      'farmer.farmer002': { password: 'farm456', firstName: 'Mary', lastName: 'Johnson' },
      'farmer.demo': { password: 'demo123', firstName: 'Demo', lastName: 'Farmer' },
      
      // Field agent users
      'field_agent.agent001': { password: 'agent123', firstName: 'Jane', lastName: 'Agent' },
      'field_agent.field001': { password: 'field123', firstName: 'Tom', lastName: 'Field' },
      
      // Exporter users
      'exporter.export001': { password: 'export123', firstName: 'Bob', lastName: 'Exporter' },
      'exporter.trade001': { password: 'trade123', firstName: 'Alice', lastName: 'Trader' }
    };
  }

  async logout(): Promise<void> {
    // Clear stored authentication
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    // Clear offline auth if it exists
    if (this.currentUser?.username) {
      await offlineStorage.removeAuthTokenOffline(this.currentUser.username);
    }

    this.currentUser = null;
    this.notifyAuthListeners();
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  isOfflineUser(): boolean {
    return this.currentUser?.isOffline === true;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  onAuthChange(callback: (user: any) => void): void {
    this.authListeners.push(callback);
  }

  private notifyAuthListeners(): void {
    this.authListeners.forEach(callback => callback(this.currentUser));
  }

  async refreshToken(): Promise<boolean> {
    if (!this.currentUser || this.isOfflineUser()) {
      return false;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('authToken', result.token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  async validateToken(): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    if (this.isOfflineUser()) {
      // For offline users, check if token exists in offline storage
      const storedToken = await offlineStorage.getAuthTokenOffline(this.currentUser.username);
      return storedToken !== null;
    }

    try {
      const response = await fetch('/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const offlineAuth = new OfflineAuthService();

export type { LoginCredentials, LoginResult };