import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Main platform API URL - Update this to match your online platform
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle authentication errors
      AsyncStorage.multiRemove(['authToken', 'userType', 'user']);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (username: string, password: string, role: string) => {
    const response = await apiClient.post(`/auth/${role}-login`, {
      username,
      password,
      role
    });
    return response.data;
  },
  
  logout: async () => {
    await AsyncStorage.multiRemove(['authToken', 'userType', 'user']);
  }
};

// GPS/Mapping API
export const gpsAPI = {
  saveBoundary: async (boundaryData: any) => {
    const response = await apiClient.post('/gps/boundaries', boundaryData);
    return response.data;
  },
  
  getBoundaries: async () => {
    const response = await apiClient.get('/gps/boundaries');
    return response.data;
  },
  
  saveGPSPoint: async (pointData: any) => {
    const response = await apiClient.post('/gps/points', pointData);
    return response.data;
  }
};

// Commodity/QR API
export const commodityAPI = {
  scanQRCode: async (qrData: string) => {
    const response = await apiClient.post('/commodities/scan', { qrCode: qrData });
    return response.data;
  },
  
  getCommodities: async () => {
    const response = await apiClient.get('/commodities');
    return response.data;
  },
  
  updateCommodity: async (id: string, data: any) => {
    const response = await apiClient.patch(`/commodities/${id}`, data);
    return response.data;
  }
};

// Sync API
export const syncAPI = {
  uploadOfflineData: async (offlineData: any) => {
    const response = await apiClient.post('/sync/upload', offlineData);
    return response.data;
  },
  
  downloadUpdates: async (lastSyncTime: string) => {
    const response = await apiClient.get(`/sync/download?since=${lastSyncTime}`);
    return response.data;
  },
  
  checkConnectivity: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
  
  getRecentActivity: async () => {
    const response = await apiClient.get('/dashboard/recent-activity');
    return response.data;
  }
};

export default apiClient;