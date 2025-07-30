// AgriTrace360™ LACRA Mobile API Service
// Note: AsyncStorage will be available when React Native environment is properly set up
import { APIResponse, LoginCredentials, User } from '../types';

// Mock AsyncStorage for development environment
const AsyncStorage = {
  setItem: async (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  removeItem: async (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

const API_BASE_URL = 'http://localhost:5000/api'; // Update for production

class ApiService {
  private token: string | null = null;

  async setToken(token: string) {
    this.token = token;
    await AsyncStorage.setItem('authToken', token);
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('authToken');
    }
    return this.token;
  }

  async clearToken() {
    this.token = null;
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const token = await this.getToken();
      const url = `${API_BASE_URL}${endpoint}`;
      
      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<APIResponse<{ token: string; user: User }>> {
    const endpoint = `/auth/${credentials.userType}-login`;
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<APIResponse<null>> {
    const result = await this.makeRequest<null>('/auth/logout', { method: 'POST' });
    await this.clearToken();
    return result;
  }

  // Commodities
  async getCommodities(): Promise<APIResponse<any[]>> {
    return this.makeRequest('/commodities');
  }

  async createCommodity(commodity: any): Promise<APIResponse<any>> {
    return this.makeRequest('/commodities', {
      method: 'POST',
      body: JSON.stringify(commodity),
    });
  }

  async updateCommodity(id: number, commodity: any): Promise<APIResponse<any>> {
    return this.makeRequest(`/commodities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(commodity),
    });
  }

  // Farm Plots
  async getFarmPlots(): Promise<APIResponse<any[]>> {
    return this.makeRequest('/farm-plots');
  }

  async createFarmPlot(plot: any): Promise<APIResponse<any>> {
    return this.makeRequest('/farm-plots', {
      method: 'POST',
      body: JSON.stringify(plot),
    });
  }

  // Inspections
  async getInspections(): Promise<APIResponse<any[]>> {
    return this.makeRequest('/inspections');
  }

  async createInspection(inspection: any): Promise<APIResponse<any>> {
    return this.makeRequest('/inspections', {
      method: 'POST',
      body: JSON.stringify(inspection),
    });
  }

  // Alerts
  async getAlerts(): Promise<APIResponse<any[]>> {
    return this.makeRequest('/alerts');
  }

  async createAlert(alert: any): Promise<APIResponse<any>> {
    return this.makeRequest('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    });
  }

  // GPS Tracking
  async submitGPSData(gpsData: any): Promise<APIResponse<any>> {
    return this.makeRequest('/gps-tracking', {
      method: 'POST',
      body: JSON.stringify(gpsData),
    });
  }

  // QR Code Scanning
  async submitQRScan(qrData: any): Promise<APIResponse<any>> {
    return this.makeRequest('/qr-scans', {
      method: 'POST',
      body: JSON.stringify(qrData),
    });
  }

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<APIResponse<any>> {
    return this.makeRequest('/dashboard/metrics');
  }

  // Messages
  async getMessages(userId: string): Promise<APIResponse<any[]>> {
    return this.makeRequest(`/messages/${userId}`);
  }

  async sendMessage(message: any): Promise<APIResponse<any>> {
    return this.makeRequest('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }
}

export const apiService = new ApiService();
export default apiService;