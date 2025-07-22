export interface DashboardMetrics {
  totalCommodities: number;
  complianceRate: number;
  pendingInspections: number;
  exportCertificates: number;
}

export interface ComplianceByCounty {
  county: string;
  compliant: number;
  reviewRequired: number;
  nonCompliant: number;
  total: number;
  complianceRate: number;
}

export interface CommodityWithInspection {
  id: number;
  name: string;
  type: string;
  batchNumber: string;
  county: string;
  qualityGrade: string;
  status: string;
  inspectorName?: string;
  inspectionDate?: string;
}

export const COUNTIES = [
  "Lofa County",
  "Bong County", 
  "Nimba County",
  "Grand Gedeh County"
] as const;

export const COMMODITY_TYPES = [
  "cocoa",
  "coffee",
  "palm_oil", 
  "rubber",
  "rice"
] as const;

export const COMPLIANCE_STATUSES = [
  "compliant",
  "review_required",
  "non_compliant",
  "pending"
] as const;

export const QUALITY_GRADES = {
  cocoa: ["Grade 7.5", "Grade 7.0", "Grade 6.5", "Grade 6.0", "Below Grade 6.0"],
  coffee: ["Grade A", "Grade B", "Grade C", "Grade D"],
  palm_oil: ["Grade A", "Grade B", "Grade C"],
  rubber: ["Grade A", "Grade B", "Grade C"],
  rice: ["Grade 1", "Grade 2", "Grade 3", "Grade 4"]
} as const;

export function getStatusColor(status: string): string {
  switch (status) {
    case 'compliant':
      return 'text-success bg-success';
    case 'review_required':
      return 'text-warning bg-warning';
    case 'non_compliant':
      return 'text-error bg-error';
    default:
      return 'text-gray-600 bg-gray-400';
  }
}

export function getCommodityIcon(type: string): string {
  switch (type) {
    case 'cocoa':
      return 'seedling';
    case 'coffee':
      return 'coffee';
    case 'palm_oil':
      return 'tree';
    case 'rubber':
      return 'spa';
    case 'rice':
      return 'wheat-awn';
    default:
      return 'leaf';
  }
}
