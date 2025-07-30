// AgriTrace360™ LACRA Mobile App Types
export interface User {
  id: string;
  username: string;
  userType: 'farmer' | 'field_agent' | 'regulatory' | 'exporter';
  token: string;
  farmerId?: string;
  agentId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  county?: string;
  jurisdiction?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  userType: 'farmer' | 'field_agent' | 'regulatory' | 'exporter';
  county?: string;
  jurisdiction?: string;
}

export interface Commodity {
  id: number;
  name: string;
  type: string;
  batchNumber: string;
  county: string;
  qualityGrade: string;
  quantity: number;
  unit: string;
  status: 'pending' | 'compliant' | 'review_required' | 'non_compliant';
  farmerId?: string;
  farmerName?: string;
  harvestDate?: string;
  gpsCoordinates?: string;
  gpsAccuracy?: 'high' | 'medium' | 'low';
  plotId?: string;
  district?: string;
  createdAt?: string;
}

export interface GPSLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface FarmPlot {
  id: number;
  farmerId: string;
  plotName: string;
  cropType: string;
  area: number;
  unit: string;
  gpsCoordinates: string;
  soilType?: string;
  lastSoilTest?: string;
  plantingDate?: string;
  expectedHarvest?: string;
  status: 'active' | 'fallow' | 'preparation';
  createdAt: string;
}

export interface Inspection {
  id: number;
  commodityId: number;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  qualityGrade: string;
  complianceStatus: 'compliant' | 'review_required' | 'non_compliant';
  notes?: string;
  deficiencies?: string;
  recommendations?: string;
  nextInspectionDate?: string;
  createdAt: string;
}

export interface MobileAlert {
  id: number;
  type: 'warning' | 'error' | 'success' | 'info' | 'mobile_request';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  source: 'system' | 'mobile_app' | 'field_agent' | 'web';
  submittedBy?: string;
  status: 'pending' | 'verified' | 'rejected' | 'processed';
  createdAt: string;
}

export interface NavigationRoute {
  name: string;
  component: any;
  title: string;
  icon: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}