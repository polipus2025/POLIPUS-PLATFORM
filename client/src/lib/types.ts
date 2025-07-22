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
  "Bomi County",
  "Bong County",
  "Gbarpolu County", 
  "Grand Bassa County",
  "Grand Cape Mount County",
  "Grand Gedeh County",
  "Grand Kru County",
  "Lofa County",
  "Margibi County",
  "Maryland County",
  "Montserrado County",
  "Nimba County",
  "River Cess County",
  "River Gee County",
  "Sinoe County"
] as const;

export const COMMODITY_TYPES = [
  "cocoa",
  "coffee",
  "palm_oil", 
  "rubber",
  "rice",
  "cassava",
  "plantain",
  "banana",
  "coconut",
  "sugarcane",
  "sweet_potato",
  "yam",
  "pepper",
  "ginger",
  "kola_nut",
  "citrus",
  "pineapple",
  "mango",
  "avocado",
  "cashew"
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
  rice: ["Grade 1", "Grade 2", "Grade 3", "Grade 4"],
  cassava: ["Fresh Grade A", "Fresh Grade B", "Dried Grade A", "Dried Grade B"],
  plantain: ["Green Premium", "Green Standard", "Ripe Premium", "Ripe Standard"],
  banana: ["Export Grade", "Domestic Premium", "Domestic Standard"],
  coconut: ["Fresh A", "Fresh B", "Dried A", "Dried B"],
  sugarcane: ["High Brix", "Medium Brix", "Standard"],
  sweet_potato: ["Grade A", "Grade B", "Grade C"],
  yam: ["Premium", "Standard", "Commercial"],
  pepper: ["Hot Premium", "Hot Standard", "Mild Premium", "Mild Standard"],
  ginger: ["Fresh A", "Fresh B", "Dried A", "Dried B"],
  kola_nut: ["Red Premium", "White Premium", "Red Standard", "White Standard"],
  citrus: ["Export Grade", "Premium", "Standard"],
  pineapple: ["Sweet Gold", "MD2", "Smooth Cayenne"],
  mango: ["Export A", "Export B", "Domestic A", "Domestic B"],
  avocado: ["Hass Premium", "Fuerte Premium", "Local Premium", "Standard"],
  cashew: ["Grade W180", "Grade W210", "Grade W240", "Grade W320"]
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
      return 'tree-palm';
    case 'rubber':
      return 'circle-dot';
    case 'rice':
      return 'wheat';
    case 'cassava':
      return 'carrot';
    case 'plantain':
    case 'banana':
      return 'banana';
    case 'coconut':
      return 'circle';
    case 'sugarcane':
      return 'wheat-awn';
    case 'sweet_potato':
    case 'yam':
      return 'potato';
    case 'pepper':
      return 'flame';
    case 'ginger':
      return 'leaf';
    case 'kola_nut':
    case 'cashew':
      return 'nut';
    case 'citrus':
      return 'orange';
    case 'pineapple':
      return 'cherry';
    case 'mango':
    case 'avocado':
      return 'apple';
    default:
      return 'leaf';
  }
}
