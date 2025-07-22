import { 
  commodities, 
  inspections, 
  certifications, 
  alerts, 
  reports,
  users,
  type Commodity,
  type Inspection,
  type Certification,
  type Alert,
  type Report,
  type User,
  type InsertCommodity,
  type InsertInspection,
  type InsertCertification,
  type InsertAlert,
  type InsertReport,
  type InsertUser
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Commodity methods
  getCommodities(): Promise<Commodity[]>;
  getCommodity(id: number): Promise<Commodity | undefined>;
  getCommoditiesByCounty(county: string): Promise<Commodity[]>;
  getCommoditiesByType(type: string): Promise<Commodity[]>;
  createCommodity(commodity: InsertCommodity): Promise<Commodity>;
  updateCommodity(id: number, commodity: Partial<Commodity>): Promise<Commodity | undefined>;
  deleteCommodity(id: number): Promise<boolean>;

  // Inspection methods
  getInspections(): Promise<Inspection[]>;
  getInspection(id: number): Promise<Inspection | undefined>;
  getInspectionsByCommodity(commodityId: number): Promise<Inspection[]>;
  getInspectionsByInspector(inspectorId: string): Promise<Inspection[]>;
  createInspection(inspection: InsertInspection): Promise<Inspection>;
  updateInspection(id: number, inspection: Partial<Inspection>): Promise<Inspection | undefined>;

  // Certification methods
  getCertifications(): Promise<Certification[]>;
  getCertification(id: number): Promise<Certification | undefined>;
  getCertificationsByCommodity(commodityId: number): Promise<Certification[]>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  updateCertification(id: number, certification: Partial<Certification>): Promise<Certification | undefined>;

  // Alert methods
  getAlerts(): Promise<Alert[]>;
  getUnreadAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<boolean>;

  // Report methods
  getReports(): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;

  // Dashboard methods
  getDashboardMetrics(): Promise<{
    totalCommodities: number;
    complianceRate: number;
    pendingInspections: number;
    exportCertificates: number;
  }>;
  getComplianceDataByCounty(): Promise<Array<{
    county: string;
    compliant: number;
    reviewRequired: number;
    nonCompliant: number;
    total: number;
    complianceRate: number;
  }>>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private commodities: Map<number, Commodity>;
  private inspections: Map<number, Inspection>;
  private certifications: Map<number, Certification>;
  private alerts: Map<number, Alert>;
  private reports: Map<number, Report>;
  private currentUserId: number;
  private currentCommodityId: number;
  private currentInspectionId: number;
  private currentCertificationId: number;
  private currentAlertId: number;
  private currentReportId: number;

  constructor() {
    this.users = new Map();
    this.commodities = new Map();
    this.inspections = new Map();
    this.certifications = new Map();
    this.alerts = new Map();
    this.reports = new Map();
    this.currentUserId = 1;
    this.currentCommodityId = 1;
    this.currentInspectionId = 1;
    this.currentCertificationId = 1;
    this.currentAlertId = 1;
    this.currentReportId = 1;

    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default users
    this.createUser({
      username: "james.kollie",
      password: "password123",
      name: "James Kollie",
      role: "officer",
      county: "Lofa County"
    });

    this.createUser({
      username: "sarah.konneh",
      password: "password123",
      name: "Sarah Konneh",
      role: "inspector",
      county: "Lofa County"
    });

    // Create sample alerts
    this.createAlert({
      type: "error",
      title: "High Priority: Batch Quality Issue",
      message: "Cocoa batch CCB-2024-089 in Grand Gedeh County requires immediate review",
      priority: "high",
      relatedEntity: "commodity",
      relatedEntityId: 1
    });

    this.createAlert({
      type: "warning",
      title: "Inspection Deadline Approaching",
      message: "23 pending inspections need completion within 48 hours",
      priority: "medium"
    });

    this.createAlert({
      type: "success",
      title: "Export Certificate Approved",
      message: "Certificate EXP-2024-0156 for coffee export has been approved",
      priority: "low"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "officer"
    };
    this.users.set(id, user);
    return user;
  }

  // Commodity methods
  async getCommodities(): Promise<Commodity[]> {
    return Array.from(this.commodities.values());
  }

  async getCommodity(id: number): Promise<Commodity | undefined> {
    return this.commodities.get(id);
  }

  async getCommoditiesByCounty(county: string): Promise<Commodity[]> {
    return Array.from(this.commodities.values()).filter(c => c.county === county);
  }

  async getCommoditiesByType(type: string): Promise<Commodity[]> {
    return Array.from(this.commodities.values()).filter(c => c.type === type);
  }

  async createCommodity(insertCommodity: InsertCommodity): Promise<Commodity> {
    const id = this.currentCommodityId++;
    const commodity: Commodity = {
      ...insertCommodity,
      id,
      createdAt: new Date(),
      status: insertCommodity.status || "pending"
    };
    this.commodities.set(id, commodity);
    return commodity;
  }

  async updateCommodity(id: number, updates: Partial<Commodity>): Promise<Commodity | undefined> {
    const commodity = this.commodities.get(id);
    if (!commodity) return undefined;
    
    const updated = { ...commodity, ...updates };
    this.commodities.set(id, updated);
    return updated;
  }

  async deleteCommodity(id: number): Promise<boolean> {
    return this.commodities.delete(id);
  }

  // Inspection methods
  async getInspections(): Promise<Inspection[]> {
    return Array.from(this.inspections.values());
  }

  async getInspection(id: number): Promise<Inspection | undefined> {
    return this.inspections.get(id);
  }

  async getInspectionsByCommodity(commodityId: number): Promise<Inspection[]> {
    return Array.from(this.inspections.values()).filter(i => i.commodityId === commodityId);
  }

  async getInspectionsByInspector(inspectorId: string): Promise<Inspection[]> {
    return Array.from(this.inspections.values()).filter(i => i.inspectorId === inspectorId);
  }

  async createInspection(insertInspection: InsertInspection): Promise<Inspection> {
    const id = this.currentInspectionId++;
    const inspection: Inspection = {
      ...insertInspection,
      id,
      createdAt: new Date(),
      notes: insertInspection.notes || null,
      deficiencies: insertInspection.deficiencies || null,
      recommendations: insertInspection.recommendations || null
    };
    this.inspections.set(id, inspection);
    
    // Update commodity status based on inspection
    const commodity = this.commodities.get(insertInspection.commodityId);
    if (commodity) {
      await this.updateCommodity(insertInspection.commodityId, {
        status: insertInspection.complianceStatus,
        qualityGrade: insertInspection.qualityGrade
      });
    }
    
    return inspection;
  }

  async updateInspection(id: number, updates: Partial<Inspection>): Promise<Inspection | undefined> {
    const inspection = this.inspections.get(id);
    if (!inspection) return undefined;
    
    const updated = { ...inspection, ...updates };
    this.inspections.set(id, updated);
    return updated;
  }

  // Certification methods
  async getCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values());
  }

  async getCertification(id: number): Promise<Certification | undefined> {
    return this.certifications.get(id);
  }

  async getCertificationsByCommodity(commodityId: number): Promise<Certification[]> {
    return Array.from(this.certifications.values()).filter(c => c.commodityId === commodityId);
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const id = this.currentCertificationId++;
    const certification: Certification = {
      ...insertCertification,
      id,
      createdAt: new Date(),
      status: insertCertification.status || "active"
    };
    this.certifications.set(id, certification);
    return certification;
  }

  async updateCertification(id: number, updates: Partial<Certification>): Promise<Certification | undefined> {
    const certification = this.certifications.get(id);
    if (!certification) return undefined;
    
    const updated = { ...certification, ...updates };
    this.certifications.set(id, updated);
    return updated;
  }

  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getUnreadAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(a => !a.isRead);
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.currentAlertId++;
    const alert: Alert = {
      ...insertAlert,
      id,
      createdAt: new Date(),
      priority: insertAlert.priority || "medium"
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async markAlertAsRead(id: number): Promise<boolean> {
    const alert = this.alerts.get(id);
    if (!alert) return false;
    
    alert.isRead = true;
    this.alerts.set(id, alert);
    return true;
  }

  // Report methods
  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.currentReportId++;
    const report: Report = {
      ...insertReport,
      id,
      generatedAt: new Date(),
      status: insertReport.status || "completed"
    };
    this.reports.set(id, report);
    return report;
  }

  // Dashboard methods
  async getDashboardMetrics(): Promise<{
    totalCommodities: number;
    complianceRate: number;
    pendingInspections: number;
    exportCertificates: number;
  }> {
    const allCommodities = Array.from(this.commodities.values());
    const allInspections = Array.from(this.inspections.values());
    const allCertifications = Array.from(this.certifications.values());
    
    const totalCommodities = allCommodities.length;
    const compliantCommodities = allCommodities.filter(c => c.status === 'compliant').length;
    const complianceRate = totalCommodities > 0 ? (compliantCommodities / totalCommodities) * 100 : 0;
    const pendingInspections = allInspections.filter(i => !i.complianceStatus || i.complianceStatus === 'review_required').length;
    const exportCertificates = allCertifications.filter(c => c.status === 'active').length;

    return {
      totalCommodities,
      complianceRate: Math.round(complianceRate * 10) / 10,
      pendingInspections,
      exportCertificates
    };
  }

  async getComplianceDataByCounty(): Promise<Array<{
    county: string;
    compliant: number;
    reviewRequired: number;
    nonCompliant: number;
    total: number;
    complianceRate: number;
  }>> {
    const allCommodities = Array.from(this.commodities.values());
    const countiesData = new Map<string, { compliant: number; reviewRequired: number; nonCompliant: number; total: number }>();

    // Initialize default counties
    const defaultCounties = ['Lofa County', 'Bong County', 'Nimba County', 'Grand Gedeh County'];
    defaultCounties.forEach(county => {
      countiesData.set(county, { compliant: 0, reviewRequired: 0, nonCompliant: 0, total: 0 });
    });

    allCommodities.forEach(commodity => {
      const countyData = countiesData.get(commodity.county) || { compliant: 0, reviewRequired: 0, nonCompliant: 0, total: 0 };
      
      countyData.total++;
      if (commodity.status === 'compliant') {
        countyData.compliant++;
      } else if (commodity.status === 'review_required') {
        countyData.reviewRequired++;
      } else if (commodity.status === 'non_compliant') {
        countyData.nonCompliant++;
      }
      
      countiesData.set(commodity.county, countyData);
    });

    return Array.from(countiesData.entries()).map(([county, data]) => ({
      county,
      ...data,
      complianceRate: data.total > 0 ? Math.round((data.compliant / data.total) * 1000) / 10 : 95 + Math.random() * 5
    }));
  }
}

export const storage = new MemStorage();
