import { 
  commodities, 
  inspections, 
  certifications, 
  alerts, 
  reports,
  users,
  farmers,
  farmPlots,
  cropPlanning,
  harvestRecords,
  inputDistribution,
  procurement,
  type Commodity,
  type Inspection,
  type Certification,
  type Alert,
  type Report,
  type User,
  type Farmer,
  type FarmPlot,
  type CropPlan,
  type HarvestRecord,
  type InputDistribution,
  type Procurement,
  type InsertCommodity,
  type InsertInspection,
  type InsertCertification,
  type InsertAlert,
  type InsertReport,
  type InsertUser,
  type InsertFarmer,
  type InsertFarmPlot,
  type InsertCropPlan,
  type InsertHarvestRecord,
  type InsertInputDistribution,
  type InsertProcurement
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

  // Farm Management Platform methods
  // Farmer methods
  getFarmers(): Promise<Farmer[]>;
  getFarmer(id: number): Promise<Farmer | undefined>;
  getFarmerByFarmerId(farmerId: string): Promise<Farmer | undefined>;
  getFarmersByCounty(county: string): Promise<Farmer[]>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  updateFarmer(id: number, farmer: Partial<Farmer>): Promise<Farmer | undefined>;
  
  // Farm Plot methods
  getFarmPlots(): Promise<FarmPlot[]>;
  getFarmPlot(id: number): Promise<FarmPlot | undefined>;
  getFarmPlotsByFarmer(farmerId: number): Promise<FarmPlot[]>;
  createFarmPlot(plot: InsertFarmPlot): Promise<FarmPlot>;
  updateFarmPlot(id: number, plot: Partial<FarmPlot>): Promise<FarmPlot | undefined>;
  
  // Crop Planning methods
  getCropPlans(): Promise<CropPlan[]>;
  getCropPlan(id: number): Promise<CropPlan | undefined>;
  getCropPlansByFarmer(farmerId: number): Promise<CropPlan[]>;
  getCropPlansBySeason(year: number, season: string): Promise<CropPlan[]>;
  createCropPlan(plan: InsertCropPlan): Promise<CropPlan>;
  updateCropPlan(id: number, plan: Partial<CropPlan>): Promise<CropPlan | undefined>;
  
  // Harvest Records methods
  getHarvestRecords(): Promise<HarvestRecord[]>;
  getHarvestRecord(id: number): Promise<HarvestRecord | undefined>;
  getHarvestRecordsByFarmer(farmerId: number): Promise<HarvestRecord[]>;
  getHarvestRecordsByDateRange(startDate: Date, endDate: Date): Promise<HarvestRecord[]>;
  createHarvestRecord(record: InsertHarvestRecord): Promise<HarvestRecord>;
  updateHarvestRecord(id: number, record: Partial<HarvestRecord>): Promise<HarvestRecord | undefined>;
  
  // Input Distribution methods
  getInputDistributions(): Promise<InputDistribution[]>;
  getInputDistribution(id: number): Promise<InputDistribution | undefined>;
  getInputDistributionsByFarmer(farmerId: number): Promise<InputDistribution[]>;
  getInputDistributionsByType(inputType: string): Promise<InputDistribution[]>;
  createInputDistribution(distribution: InsertInputDistribution): Promise<InputDistribution>;
  updateInputDistribution(id: number, distribution: Partial<InputDistribution>): Promise<InputDistribution | undefined>;
  
  // Procurement methods
  getProcurements(): Promise<Procurement[]>;
  getProcurement(id: number): Promise<Procurement | undefined>;
  getProcurementsByFarmer(farmerId: number): Promise<Procurement[]>;
  getProcurementsByStatus(status: string): Promise<Procurement[]>;
  createProcurement(procurement: InsertProcurement): Promise<Procurement>;
  updateProcurement(id: number, procurement: Partial<Procurement>): Promise<Procurement | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private commodities: Map<number, Commodity>;
  private inspections: Map<number, Inspection>;
  private certifications: Map<number, Certification>;
  private alerts: Map<number, Alert>;
  private reports: Map<number, Report>;
  private farmers: Map<number, Farmer>;
  private farmPlots: Map<number, FarmPlot>;
  private cropPlans: Map<number, CropPlan>;
  private harvestRecords: Map<number, HarvestRecord>;
  private inputDistributions: Map<number, InputDistribution>;
  private procurements: Map<number, Procurement>;
  private currentUserId: number;
  private currentCommodityId: number;
  private currentInspectionId: number;
  private currentCertificationId: number;
  private currentAlertId: number;
  private currentReportId: number;
  private currentFarmerId: number;
  private currentFarmPlotId: number;
  private currentCropPlanId: number;
  private currentHarvestRecordId: number;
  private currentInputDistributionId: number;
  private currentProcurementId: number;

  constructor() {
    this.users = new Map();
    this.commodities = new Map();
    this.inspections = new Map();
    this.certifications = new Map();
    this.alerts = new Map();
    this.reports = new Map();
    this.farmers = new Map();
    this.farmPlots = new Map();
    this.cropPlans = new Map();
    this.harvestRecords = new Map();
    this.inputDistributions = new Map();
    this.procurements = new Map();
    this.currentUserId = 1;
    this.currentCommodityId = 1;
    this.currentInspectionId = 1;
    this.currentCertificationId = 1;
    this.currentAlertId = 1;
    this.currentReportId = 1;
    this.currentFarmerId = 1;
    this.currentFarmPlotId = 1;
    this.currentCropPlanId = 1;
    this.currentHarvestRecordId = 1;
    this.currentInputDistributionId = 1;
    this.currentProcurementId = 1;

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

    // Initialize all 15 counties of Liberia
    const defaultCounties = [
      'Bomi County', 'Bong County', 'Gbarpolu County', 'Grand Bassa County', 
      'Grand Cape Mount County', 'Grand Gedeh County', 'Grand Kru County', 
      'Lofa County', 'Margibi County', 'Maryland County', 'Montserrado County', 
      'Nimba County', 'River Cess County', 'River Gee County', 'Sinoe County'
    ];
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

  // Farm Management Platform Implementation Methods

  // Farmer methods
  async getFarmers(): Promise<Farmer[]> {
    return Array.from(this.farmers.values());
  }

  async getFarmer(id: number): Promise<Farmer | undefined> {
    return this.farmers.get(id);
  }

  async getFarmerByFarmerId(farmerId: string): Promise<Farmer | undefined> {
    return Array.from(this.farmers.values()).find(f => f.farmerId === farmerId);
  }

  async getFarmersByCounty(county: string): Promise<Farmer[]> {
    return Array.from(this.farmers.values()).filter(f => f.county === county);
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const newFarmer: Farmer = {
      id: this.currentFarmerId++,
      ...farmer,
      agreementSigned: farmer.agreementSigned ?? false,
      status: farmer.status || 'active'
    };
    this.farmers.set(newFarmer.id, newFarmer);
    return newFarmer;
  }

  async updateFarmer(id: number, farmer: Partial<Farmer>): Promise<Farmer | undefined> {
    const existing = this.farmers.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...farmer };
    this.farmers.set(id, updated);
    return updated;
  }

  // Farm Plot methods
  async getFarmPlots(): Promise<FarmPlot[]> {
    return Array.from(this.farmPlots.values());
  }

  async getFarmPlot(id: number): Promise<FarmPlot | undefined> {
    return this.farmPlots.get(id);
  }

  async getFarmPlotsByFarmer(farmerId: number): Promise<FarmPlot[]> {
    return Array.from(this.farmPlots.values()).filter(p => p.farmerId === farmerId);
  }

  async createFarmPlot(plot: InsertFarmPlot): Promise<FarmPlot> {
    const newPlot: FarmPlot = {
      id: this.currentFarmPlotId++,
      plotId: `PLT-${Date.now()}-${this.currentFarmPlotId.toString().padStart(3, '0')}`,
      ...plot,
      status: plot.status || 'active'
    };
    this.farmPlots.set(newPlot.id, newPlot);
    return newPlot;
  }

  async updateFarmPlot(id: number, plot: Partial<FarmPlot>): Promise<FarmPlot | undefined> {
    const existing = this.farmPlots.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...plot };
    this.farmPlots.set(id, updated);
    return updated;
  }

  // Crop Planning methods
  async getCropPlans(): Promise<CropPlan[]> {
    return Array.from(this.cropPlans.values());
  }

  async getCropPlan(id: number): Promise<CropPlan | undefined> {
    return this.cropPlans.get(id);
  }

  async getCropPlansByFarmer(farmerId: number): Promise<CropPlan[]> {
    return Array.from(this.cropPlans.values()).filter(p => p.farmerId === farmerId);
  }

  async getCropPlansBySeason(year: number, season: string): Promise<CropPlan[]> {
    return Array.from(this.cropPlans.values()).filter(p => p.year === year && p.season === season);
  }

  async createCropPlan(plan: InsertCropPlan): Promise<CropPlan> {
    const newPlan: CropPlan = {
      id: this.currentCropPlanId++,
      ...plan,
      status: plan.status || 'planned'
    };
    this.cropPlans.set(newPlan.id, newPlan);
    return newPlan;
  }

  async updateCropPlan(id: number, plan: Partial<CropPlan>): Promise<CropPlan | undefined> {
    const existing = this.cropPlans.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...plan };
    this.cropPlans.set(id, updated);
    return updated;
  }

  // Harvest Records methods
  async getHarvestRecords(): Promise<HarvestRecord[]> {
    return Array.from(this.harvestRecords.values());
  }

  async getHarvestRecord(id: number): Promise<HarvestRecord | undefined> {
    return this.harvestRecords.get(id);
  }

  async getHarvestRecordsByFarmer(farmerId: number): Promise<HarvestRecord[]> {
    return Array.from(this.harvestRecords.values()).filter(r => r.farmerId === farmerId);
  }

  async getHarvestRecordsByDateRange(startDate: Date, endDate: Date): Promise<HarvestRecord[]> {
    return Array.from(this.harvestRecords.values()).filter(r => {
      const harvestDate = new Date(r.harvestDate);
      return harvestDate >= startDate && harvestDate <= endDate;
    });
  }

  async createHarvestRecord(record: InsertHarvestRecord): Promise<HarvestRecord> {
    const newRecord: HarvestRecord = {
      id: this.currentHarvestRecordId++,
      ...record
    };
    this.harvestRecords.set(newRecord.id, newRecord);
    return newRecord;
  }

  async updateHarvestRecord(id: number, record: Partial<HarvestRecord>): Promise<HarvestRecord | undefined> {
    const existing = this.harvestRecords.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...record };
    this.harvestRecords.set(id, updated);
    return updated;
  }

  // Input Distribution methods
  async getInputDistributions(): Promise<InputDistribution[]> {
    return Array.from(this.inputDistributions.values());
  }

  async getInputDistribution(id: number): Promise<InputDistribution | undefined> {
    return this.inputDistributions.get(id);
  }

  async getInputDistributionsByFarmer(farmerId: number): Promise<InputDistribution[]> {
    return Array.from(this.inputDistributions.values()).filter(d => d.farmerId === farmerId);
  }

  async getInputDistributionsByType(inputType: string): Promise<InputDistribution[]> {
    return Array.from(this.inputDistributions.values()).filter(d => d.inputType === inputType);
  }

  async createInputDistribution(distribution: InsertInputDistribution): Promise<InputDistribution> {
    const newDistribution: InputDistribution = {
      id: this.currentInputDistributionId++,
      ...distribution,
      repaymentStatus: distribution.repaymentStatus || 'pending'
    };
    this.inputDistributions.set(newDistribution.id, newDistribution);
    return newDistribution;
  }

  async updateInputDistribution(id: number, distribution: Partial<InputDistribution>): Promise<InputDistribution | undefined> {
    const existing = this.inputDistributions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...distribution };
    this.inputDistributions.set(id, updated);
    return updated;
  }

  // Procurement methods
  async getProcurements(): Promise<Procurement[]> {
    return Array.from(this.procurements.values());
  }

  async getProcurement(id: number): Promise<Procurement | undefined> {
    return this.procurements.get(id);
  }

  async getProcurementsByFarmer(farmerId: number): Promise<Procurement[]> {
    return Array.from(this.procurements.values()).filter(p => p.farmerId === farmerId);
  }

  async getProcurementsByStatus(status: string): Promise<Procurement[]> {
    return Array.from(this.procurements.values()).filter(p => p.status === status);
  }

  async createProcurement(procurement: InsertProcurement): Promise<Procurement> {
    const newProcurement: Procurement = {
      id: this.currentProcurementId++,
      procurementId: `PROC-${Date.now()}-${this.currentProcurementId.toString().padStart(3, '0')}`,
      ...procurement,
      status: procurement.status || 'pending',
      paymentStatus: procurement.paymentStatus || 'pending'
    };
    this.procurements.set(newProcurement.id, newProcurement);
    return newProcurement;
  }

  async updateProcurement(id: number, procurement: Partial<Procurement>): Promise<Procurement | undefined> {
    const existing = this.procurements.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...procurement };
    this.procurements.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
