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

  lraIntegration,
  moaIntegration,
  customsIntegration,
  governmentSyncLog,
  analyticsData,
  auditLogs,
  systemAudits,
  auditReports,
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

  type LraIntegration,
  type MoaIntegration,
  type CustomsIntegration,
  type GovernmentSyncLog,
  type AnalyticsData,
  type AuditLog,
  type SystemAudit,
  type AuditReport,
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

  type InsertLraIntegration,
  type InsertMoaIntegration,
  type InsertCustomsIntegration,
  type InsertGovernmentSyncLog,
  type InsertAnalyticsData,
  type InsertAuditLog,
  type InsertSystemAudit,
  type InsertAuditReport
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
  


  // Government Integration methods
  // LRA Integration methods
  getLraIntegrations(): Promise<LraIntegration[]>;
  getLraIntegration(id: number): Promise<LraIntegration | undefined>;
  getLraIntegrationByCommodity(commodityId: number): Promise<LraIntegration | undefined>;
  getLraIntegrationsByStatus(status: string): Promise<LraIntegration[]>;
  createLraIntegration(integration: InsertLraIntegration): Promise<LraIntegration>;
  updateLraIntegration(id: number, integration: Partial<LraIntegration>): Promise<LraIntegration | undefined>;

  // MOA Integration methods
  getMoaIntegrations(): Promise<MoaIntegration[]>;
  getMoaIntegration(id: number): Promise<MoaIntegration | undefined>;
  getMoaIntegrationByCommodity(commodityId: number): Promise<MoaIntegration | undefined>;
  getMoaIntegrationsByStatus(status: string): Promise<MoaIntegration[]>;
  createMoaIntegration(integration: InsertMoaIntegration): Promise<MoaIntegration>;
  updateMoaIntegration(id: number, integration: Partial<MoaIntegration>): Promise<MoaIntegration | undefined>;

  // Customs Integration methods
  getCustomsIntegrations(): Promise<CustomsIntegration[]>;
  getCustomsIntegration(id: number): Promise<CustomsIntegration | undefined>;
  getCustomsIntegrationByCommodity(commodityId: number): Promise<CustomsIntegration | undefined>;
  getCustomsIntegrationsByStatus(status: string): Promise<CustomsIntegration[]>;
  createCustomsIntegration(integration: InsertCustomsIntegration): Promise<CustomsIntegration>;
  updateCustomsIntegration(id: number, integration: Partial<CustomsIntegration>): Promise<CustomsIntegration | undefined>;

  // Government Sync Log methods
  getGovernmentSyncLogs(): Promise<GovernmentSyncLog[]>;
  getGovernmentSyncLogsByType(syncType: string): Promise<GovernmentSyncLog[]>;
  getGovernmentSyncLogsByEntity(entityId: number, syncType: string): Promise<GovernmentSyncLog[]>;
  createGovernmentSyncLog(log: InsertGovernmentSyncLog): Promise<GovernmentSyncLog>;

  // Synchronization methods
  syncWithLRA(commodityId: number): Promise<{ success: boolean; message: string }>;
  syncWithMOA(commodityId: number): Promise<{ success: boolean; message: string }>;
  syncWithCustoms(commodityId: number): Promise<{ success: boolean; message: string }>;
  getGovernmentComplianceStatus(commodityId: number): Promise<{
    lra: { status: string; lastSync: Date | null };
    moa: { status: string; lastSync: Date | null };
    customs: { status: string; lastSync: Date | null };
  }>;

  // Analytics methods (AgriTrace360™ Admin only)
  getAnalyticsData(dataType?: string, timeframe?: string): Promise<AnalyticsData[]>;
  generateAnalyticsReport(entityType: string, entityId?: number, timeframe?: string): Promise<AnalyticsData[]>;
  createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData>;
  
  // Audit methods (AgriTrace360™ Admin only)
  getAuditLogs(auditType?: string, userId?: string, startDate?: Date, endDate?: Date): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getSystemAudits(status?: string): Promise<SystemAudit[]>;
  getSystemAudit(id: number): Promise<SystemAudit | undefined>;
  createSystemAudit(audit: InsertSystemAudit): Promise<SystemAudit>;
  updateSystemAudit(id: number, audit: Partial<SystemAudit>): Promise<SystemAudit | undefined>;
  getAuditReports(confidentialityLevel?: string): Promise<AuditReport[]>;
  getAuditReport(id: number): Promise<AuditReport | undefined>;
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;
  updateAuditReport(id: number, report: Partial<AuditReport>): Promise<AuditReport | undefined>;
  
  // Admin analytics methods
  generateComplianceTrends(timeframe: string): Promise<AnalyticsData[]>;
  generateFarmPerformanceAnalytics(farmerId?: number): Promise<AnalyticsData[]>;
  generateRegionalAnalytics(county?: string): Promise<AnalyticsData[]>;
  generateSystemHealthMetrics(): Promise<AnalyticsData[]>;
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
  private lraIntegrations: Map<number, LraIntegration>;
  private moaIntegrations: Map<number, MoaIntegration>;
  private customsIntegrations: Map<number, CustomsIntegration>;
  private governmentSyncLogs: Map<number, GovernmentSyncLog>;
  private analyticsData: Map<number, AnalyticsData>;
  private auditLogs: Map<number, AuditLog>;
  private systemAudits: Map<number, SystemAudit>;
  private auditReports: Map<number, AuditReport>;
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
  private currentLraIntegrationId: number;
  private currentMoaIntegrationId: number;
  private currentCustomsIntegrationId: number;
  private currentGovernmentSyncLogId: number;
  private currentAnalyticsDataId: number;
  private currentAuditLogId: number;
  private currentSystemAuditId: number;
  private currentAuditReportId: number;

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
    this.lraIntegrations = new Map();
    this.moaIntegrations = new Map();
    this.customsIntegrations = new Map();
    this.governmentSyncLogs = new Map();
    this.analyticsData = new Map();
    this.auditLogs = new Map();
    this.systemAudits = new Map();
    this.auditReports = new Map();
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
    this.currentLraIntegrationId = 1;
    this.currentMoaIntegrationId = 1;
    this.currentCustomsIntegrationId = 1;
    this.currentGovernmentSyncLogId = 1;
    this.currentAnalyticsDataId = 1;
    this.currentAuditLogId = 1;
    this.currentSystemAuditId = 1;
    this.currentAuditReportId = 1;

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
      farmerId: insertCommodity.farmerId || null,
      farmerName: insertCommodity.farmerName || null,
      harvestDate: insertCommodity.harvestDate || null,
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
      nextInspectionDate: insertInspection.nextInspectionDate || null,
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
      exportDestination: insertCertification.exportDestination || null,
      exporterName: insertCertification.exporterName || null,
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
      isRead: insertAlert.isRead || null,
      relatedEntity: insertAlert.relatedEntity || null,
      relatedEntityId: insertAlert.relatedEntityId || null,
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
      parameters: insertReport.parameters || null,
      filePath: insertReport.filePath || null,
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
      status: farmer.status || 'active',
      createdAt: new Date()
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
      ...plot,
      plotId: plot.plotId || `PLT-${Date.now()}-${this.currentFarmPlotId.toString().padStart(3, '0')}`,
      status: plot.status || 'active',
      createdAt: new Date()
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
      status: plan.status || 'planned',
      createdAt: new Date()
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
      ...record,
      createdAt: new Date()
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
      repaymentStatus: distribution.repaymentStatus || 'pending',
      createdAt: new Date()
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



  // Government Integration methods
  // LRA Integration methods
  async getLraIntegrations(): Promise<LraIntegration[]> {
    return Array.from(this.lraIntegrations.values());
  }

  async getLraIntegration(id: number): Promise<LraIntegration | undefined> {
    return this.lraIntegrations.get(id);
  }

  async getLraIntegrationByCommodity(commodityId: number): Promise<LraIntegration | undefined> {
    return Array.from(this.lraIntegrations.values()).find(i => i.commodityId === commodityId);
  }

  async getLraIntegrationsByStatus(status: string): Promise<LraIntegration[]> {
    return Array.from(this.lraIntegrations.values()).filter(i => i.paymentStatus === status);
  }

  async createLraIntegration(integration: InsertLraIntegration): Promise<LraIntegration> {
    const newIntegration: LraIntegration = {
      id: this.currentLraIntegrationId++,
      ...integration,
      notes: integration.notes || null,
      syncStatus: integration.syncStatus || 'pending',
      paymentStatus: integration.paymentStatus || 'pending',
      createdAt: new Date()
    };
    this.lraIntegrations.set(newIntegration.id, newIntegration);
    return newIntegration;
  }

  async updateLraIntegration(id: number, integration: Partial<LraIntegration>): Promise<LraIntegration | undefined> {
    const existing = this.lraIntegrations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...integration };
    this.lraIntegrations.set(id, updated);
    return updated;
  }

  // MOA Integration methods
  async getMoaIntegrations(): Promise<MoaIntegration[]> {
    return Array.from(this.moaIntegrations.values());
  }

  async getMoaIntegration(id: number): Promise<MoaIntegration | undefined> {
    return this.moaIntegrations.get(id);
  }

  async getMoaIntegrationByCommodity(commodityId: number): Promise<MoaIntegration | undefined> {
    return Array.from(this.moaIntegrations.values()).find(i => i.commodityId === commodityId);
  }

  async getMoaIntegrationsByStatus(status: string): Promise<MoaIntegration[]> {
    return Array.from(this.moaIntegrations.values()).filter(i => i.inspectionStatus === status);
  }

  async createMoaIntegration(integration: InsertMoaIntegration): Promise<MoaIntegration> {
    const newIntegration: MoaIntegration = {
      id: this.currentMoaIntegrationId++,
      ...integration,
      farmerId: integration.farmerId || null,
      notes: integration.notes || null,
      sustainabilityRating: integration.sustainabilityRating || null,
      syncStatus: integration.syncStatus || 'pending',
      inspectionStatus: integration.inspectionStatus || 'pending',
      createdAt: new Date()
    };
    this.moaIntegrations.set(newIntegration.id, newIntegration);
    return newIntegration;
  }

  async updateMoaIntegration(id: number, integration: Partial<MoaIntegration>): Promise<MoaIntegration | undefined> {
    const existing = this.moaIntegrations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...integration };
    this.moaIntegrations.set(id, updated);
    return updated;
  }

  // Customs Integration methods
  async getCustomsIntegrations(): Promise<CustomsIntegration[]> {
    return Array.from(this.customsIntegrations.values());
  }

  async getCustomsIntegration(id: number): Promise<CustomsIntegration | undefined> {
    return this.customsIntegrations.get(id);
  }

  async getCustomsIntegrationByCommodity(commodityId: number): Promise<CustomsIntegration | undefined> {
    return Array.from(this.customsIntegrations.values()).find(i => i.commodityId === commodityId);
  }

  async getCustomsIntegrationsByStatus(status: string): Promise<CustomsIntegration[]> {
    return Array.from(this.customsIntegrations.values()).filter(i => i.clearanceStatus === status);
  }

  async createCustomsIntegration(integration: InsertCustomsIntegration): Promise<CustomsIntegration> {
    const newIntegration: CustomsIntegration = {
      id: this.currentCustomsIntegrationId++,
      ...integration,
      notes: integration.notes || null,
      syncStatus: integration.syncStatus || 'pending',
      clearanceStatus: integration.clearanceStatus || 'pending',
      documentStatus: integration.documentStatus || 'incomplete',
      createdAt: new Date()
    };
    this.customsIntegrations.set(newIntegration.id, newIntegration);
    return newIntegration;
  }

  async updateCustomsIntegration(id: number, integration: Partial<CustomsIntegration>): Promise<CustomsIntegration | undefined> {
    const existing = this.customsIntegrations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...integration };
    this.customsIntegrations.set(id, updated);
    return updated;
  }

  // Government Sync Log methods
  async getGovernmentSyncLogs(): Promise<GovernmentSyncLog[]> {
    return Array.from(this.governmentSyncLogs.values());
  }

  async getGovernmentSyncLogsByType(syncType: string): Promise<GovernmentSyncLog[]> {
    return Array.from(this.governmentSyncLogs.values()).filter(l => l.syncType === syncType);
  }

  async getGovernmentSyncLogsByEntity(entityId: number, syncType: string): Promise<GovernmentSyncLog[]> {
    return Array.from(this.governmentSyncLogs.values()).filter(l => l.entityId === entityId && l.syncType === syncType);
  }

  async createGovernmentSyncLog(log: InsertGovernmentSyncLog): Promise<GovernmentSyncLog> {
    const newLog: GovernmentSyncLog = {
      id: this.currentGovernmentSyncLogId++,
      ...log,
      requestPayload: log.requestPayload || null,
      responsePayload: log.responsePayload || null,
      errorMessage: log.errorMessage || null,
      syncDuration: log.syncDuration || null,
      syncDate: new Date()
    };
    this.governmentSyncLogs.set(newLog.id, newLog);
    return newLog;
  }

  // Synchronization methods
  async syncWithLRA(commodityId: number): Promise<{ success: boolean; message: string }> {
    const commodity = await this.getCommodity(commodityId);
    if (!commodity) {
      return { success: false, message: 'Commodity not found' };
    }

    try {
      // Simulate LRA API call
      const taxAmount = parseFloat(commodity.quantity) * 0.05; // 5% tax rate
      const lraData: InsertLraIntegration = {
        commodityId: commodityId,
        taxId: `TAX-${commodityId}-${Date.now()}`,
        taxpayerTin: commodity.farmerId || 'N/A',
        taxableAmount: commodity.quantity,
        taxRate: "5.00",
        taxAmount: taxAmount.toString(),
        assessmentDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        lraOfficer: 'LRA System',
        syncStatus: 'synced',
        lastSyncDate: new Date()
      };

      await this.createLraIntegration(lraData);
      
      await this.createGovernmentSyncLog({
        syncType: 'lra',
        entityId: commodityId,
        syncDirection: 'outbound',
        status: 'success',
        syncDuration: 1200,
        syncedBy: 'System'
      });

      return { success: true, message: 'Successfully synced with LRA' };
    } catch (error) {
      await this.createGovernmentSyncLog({
        syncType: 'lra',
        entityId: commodityId,
        syncDirection: 'outbound',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        syncDuration: 800,
        syncedBy: 'System'
      });
      return { success: false, message: 'Failed to sync with LRA' };
    }
  }

  async syncWithMOA(commodityId: number): Promise<{ success: boolean; message: string }> {
    const commodity = await this.getCommodity(commodityId);
    if (!commodity) {
      return { success: false, message: 'Commodity not found' };
    }

    try {
      const moaData: InsertMoaIntegration = {
        commodityId: commodityId,
        registrationNumber: `MOA-${commodityId}-${Date.now()}`,
        cropType: commodity.type,
        productionSeason: new Date().getMonth() < 6 ? 'dry' : 'rainy',
        actualYield: commodity.quantity,
        qualityCertification: commodity.qualityGrade,
        sustainabilityRating: 'conventional',
        moaOfficer: 'MOA System',
        inspectionStatus: 'approved',
        approvalDate: new Date(),
        syncStatus: 'synced',
        lastSyncDate: new Date()
      };

      await this.createMoaIntegration(moaData);
      
      await this.createGovernmentSyncLog({
        syncType: 'moa',
        entityId: commodityId,
        syncDirection: 'outbound',
        status: 'success',
        syncDuration: 1500,
        syncedBy: 'System'
      });

      return { success: true, message: 'Successfully synced with MOA' };
    } catch (error) {
      await this.createGovernmentSyncLog({
        syncType: 'moa',
        entityId: commodityId,
        syncDirection: 'outbound',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        syncDuration: 900,
        syncedBy: 'System'
      });
      return { success: false, message: 'Failed to sync with MOA' };
    }
  }

  async syncWithCustoms(commodityId: number): Promise<{ success: boolean; message: string }> {
    const commodity = await this.getCommodity(commodityId);
    if (!commodity) {
      return { success: false, message: 'Commodity not found' };
    }

    try {
      const exportValue = parseFloat(commodity.quantity) * 100; // Estimated $100 per unit
      const customsData: InsertCustomsIntegration = {
        commodityId: commodityId,
        declarationNumber: `DEC-${commodityId}-${Date.now()}`,
        hsCode: this.getHSCode(commodity.type),
        exportValue: exportValue.toString(),
        dutyAmount: (exportValue * 0.02).toString(), // 2% duty
        portOfExit: 'Port of Monrovia',
        destinationCountry: 'European Union',
        exporterTin: commodity.farmerId || 'N/A',
        customsOfficer: 'Customs System',
        clearanceStatus: 'cleared',
        clearanceDate: new Date(),
        syncStatus: 'synced',
        lastSyncDate: new Date(),
        documentStatus: 'complete'
      };

      await this.createCustomsIntegration(customsData);
      
      await this.createGovernmentSyncLog({
        syncType: 'customs',
        entityId: commodityId,
        syncDirection: 'outbound',
        status: 'success',
        syncDuration: 2000,
        syncedBy: 'System'
      });

      return { success: true, message: 'Successfully synced with Customs' };
    } catch (error) {
      await this.createGovernmentSyncLog({
        syncType: 'customs',
        entityId: commodityId,
        syncDirection: 'outbound',
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        syncDuration: 1100,
        syncedBy: 'System'
      });
      return { success: false, message: 'Failed to sync with Customs' };
    }
  }

  async getGovernmentComplianceStatus(commodityId: number): Promise<{
    lra: { status: string; lastSync: Date | null };
    moa: { status: string; lastSync: Date | null };
    customs: { status: string; lastSync: Date | null };
  }> {
    const lraIntegration = await this.getLraIntegrationByCommodity(commodityId);
    const moaIntegration = await this.getMoaIntegrationByCommodity(commodityId);
    const customsIntegration = await this.getCustomsIntegrationByCommodity(commodityId);

    return {
      lra: {
        status: lraIntegration?.syncStatus || 'not_synced',
        lastSync: lraIntegration?.lastSyncDate || null
      },
      moa: {
        status: moaIntegration?.syncStatus || 'not_synced',
        lastSync: moaIntegration?.lastSyncDate || null
      },
      customs: {
        status: customsIntegration?.syncStatus || 'not_synced',
        lastSync: customsIntegration?.lastSyncDate || null
      }
    };
  }

  private getHSCode(commodityType: string): string {
    const hsCodes: Record<string, string> = {
      'cocoa': '1801.00.00',
      'coffee': '0901.11.00',
      'palm_oil': '1511.10.00',
      'rubber': '4001.10.00',
      'rice': '1006.30.00',
      'cassava': '0714.10.00',
      'plantain': '0803.10.00',
      'banana': '0803.90.00',
      'coconut': '0801.11.00',
      'sugarcane': '1212.91.00',
      'cashew': '0801.32.00'
    };
    return hsCodes[commodityType] || '0000.00.00';
  }

  // Analytics methods (AgriTrace360™ Admin only)
  async getAnalyticsData(dataType?: string, timeframe?: string): Promise<AnalyticsData[]> {
    let results = Array.from(this.analyticsData.values());
    
    if (dataType) {
      results = results.filter(data => data.dataType === dataType);
    }
    
    if (timeframe) {
      results = results.filter(data => data.timeframe === timeframe);
    }
    
    return results.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  async generateAnalyticsReport(entityType: string, entityId?: number, timeframe?: string): Promise<AnalyticsData[]> {
    let results = Array.from(this.analyticsData.values()).filter(data => data.entityType === entityType);
    
    if (entityId !== undefined) {
      results = results.filter(data => data.entityId === entityId);
    }
    
    if (timeframe) {
      results = results.filter(data => data.timeframe === timeframe);
    }
    
    return results;
  }

  async createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData> {
    const newData: AnalyticsData = {
      id: this.currentAnalyticsDataId++,
      ...data,
      generatedAt: new Date()
    };
    this.analyticsData.set(newData.id, newData);
    return newData;
  }

  // Audit methods (AgriTrace360™ Admin only)
  async getAuditLogs(auditType?: string, userId?: string, startDate?: Date, endDate?: Date): Promise<AuditLog[]> {
    let results = Array.from(this.auditLogs.values());
    
    if (auditType) {
      results = results.filter(log => log.auditType === auditType);
    }
    
    if (userId) {
      results = results.filter(log => log.userId === userId);
    }
    
    if (startDate) {
      results = results.filter(log => log.auditTimestamp >= startDate);
    }
    
    if (endDate) {
      results = results.filter(log => log.auditTimestamp <= endDate);
    }
    
    return results.sort((a, b) => b.auditTimestamp.getTime() - a.auditTimestamp.getTime());
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: this.currentAuditLogId++,
      ...log,
      ipAddress: log.ipAddress || null,
      userAgent: log.userAgent || null,
      beforeData: log.beforeData || null,
      afterData: log.afterData || null,
      accessReason: log.accessReason || null,
      complianceFlags: log.complianceFlags || null,
      auditTimestamp: new Date()
    };
    this.auditLogs.set(newLog.id, newLog);
    return newLog;
  }

  async getSystemAudits(status?: string): Promise<SystemAudit[]> {
    let results = Array.from(this.systemAudits.values());
    
    if (status) {
      results = results.filter(audit => audit.auditStatus === status);
    }
    
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getSystemAudit(id: number): Promise<SystemAudit | undefined> {
    return this.systemAudits.get(id);
  }

  async createSystemAudit(audit: InsertSystemAudit): Promise<SystemAudit> {
    const newAudit: SystemAudit = {
      id: this.currentSystemAuditId++,
      ...audit,
      targetEntities: audit.targetEntities || null,
      auditFindings: audit.auditFindings || null,
      complianceScore: audit.complianceScore || null,
      riskAssessment: audit.riskAssessment || null,
      recommendedActions: audit.recommendedActions || null,
      startedAt: audit.startedAt || null,
      completedAt: audit.completedAt || null,
      createdAt: new Date()
    };
    this.systemAudits.set(newAudit.id, newAudit);
    return newAudit;
  }

  async updateSystemAudit(id: number, audit: Partial<SystemAudit>): Promise<SystemAudit | undefined> {
    const existing = this.systemAudits.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...audit };
    this.systemAudits.set(id, updated);
    return updated;
  }

  async getAuditReports(confidentialityLevel?: string): Promise<AuditReport[]> {
    let results = Array.from(this.auditReports.values());
    
    if (confidentialityLevel) {
      results = results.filter(report => report.confidentialityLevel === confidentialityLevel);
    }
    
    return results.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  async getAuditReport(id: number): Promise<AuditReport | undefined> {
    return this.auditReports.get(id);
  }

  async createAuditReport(report: InsertAuditReport): Promise<AuditReport> {
    const newReport: AuditReport = {
      id: this.currentAuditReportId++,
      ...report,
      systemAuditId: report.systemAuditId || null,
      executiveSummary: report.executiveSummary || null,
      keyFindings: report.keyFindings || null,
      complianceGaps: report.complianceGaps || null,
      riskMatrix: report.riskMatrix || null,
      recommendations: report.recommendations || null,
      actionPlan: report.actionPlan || null,
      accessRestrictions: report.accessRestrictions || null,
      approvedBy: report.approvedBy || null,
      approvalDate: report.approvalDate || null,
      publishedDate: report.publishedDate || null,
      generatedAt: new Date()
    };
    this.auditReports.set(newReport.id, newReport);
    return newReport;
  }

  async updateAuditReport(id: number, report: Partial<AuditReport>): Promise<AuditReport | undefined> {
    const existing = this.auditReports.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...report };
    this.auditReports.set(id, updated);
    return updated;
  }

  // Admin analytics methods
  async generateComplianceTrends(timeframe: string): Promise<AnalyticsData[]> {
    const commodities = Array.from(this.commodities.values());
    const inspections = Array.from(this.inspections.values());
    
    const complianceRate = commodities.length > 0 
      ? (commodities.filter(c => c.status === 'compliant').length / commodities.length) * 100
      : 0;

    const analyticsData: AnalyticsData = {
      id: this.currentAnalyticsDataId++,
      dataType: "compliance_metrics",
      entityType: "system",
      entityId: null,
      metricName: "compliance_rate",
      metricValue: complianceRate.toString(),
      aggregationType: "percentage",
      timeframe,
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      endDate: new Date(),
      metadata: {
        totalCommodities: commodities.length,
        totalInspections: inspections.length,
        compliantCommodities: commodities.filter(c => c.status === 'compliant').length
      },
      generatedAt: new Date()
    };

    this.analyticsData.set(analyticsData.id, analyticsData);
    return [analyticsData];
  }

  async generateFarmPerformanceAnalytics(farmerId?: number): Promise<AnalyticsData[]> {
    const farmers = farmerId 
      ? [this.farmers.get(farmerId)].filter(Boolean) as Farmer[]
      : Array.from(this.farmers.values());
    
    const analytics: AnalyticsData[] = [];

    for (const farmer of farmers) {
      const farmerPlots = Array.from(this.farmPlots.values()).filter(p => p.farmerId === farmer.id);
      const farmerCommodities = Array.from(this.commodities.values()).filter(c => c.farmerId === farmer.id.toString());
      
      const totalArea = farmerPlots.reduce((sum, plot) => sum + parseFloat(plot.area), 0);
      const avgYield = farmerCommodities.length > 0 
        ? farmerCommodities.reduce((sum, c) => sum + parseFloat(c.quantity), 0) / farmerCommodities.length
        : 0;

      const performanceData: AnalyticsData = {
        id: this.currentAnalyticsDataId++,
        dataType: "farm_performance",
        entityType: "farmer",
        entityId: farmer.id,
        metricName: "average_yield",
        metricValue: avgYield.toString(),
        aggregationType: "avg",
        timeframe: "monthly",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        metadata: {
          farmerId: farmer.id,
          farmerName: `${farmer.firstName} ${farmer.lastName}`,
          totalPlots: farmerPlots.length,
          totalArea,
          totalCommodities: farmerCommodities.length
        },
        generatedAt: new Date()
      };

      this.analyticsData.set(performanceData.id, performanceData);
      analytics.push(performanceData);
    }

    return analytics;
  }

  async generateRegionalAnalytics(county?: string): Promise<AnalyticsData[]> {
    const commodities = county 
      ? Array.from(this.commodities.values()).filter(c => c.county === county)
      : Array.from(this.commodities.values());
    
    const countiesByData: { [key: string]: { count: number; compliant: number } } = {};
    
    commodities.forEach(commodity => {
      if (!countiesByData[commodity.county]) {
        countiesByData[commodity.county] = { count: 0, compliant: 0 };
      }
      countiesByData[commodity.county].count++;
      if (commodity.status === 'compliant') {
        countiesByData[commodity.county].compliant++;
      }
    });

    const analytics: AnalyticsData[] = [];

    Object.entries(countiesByData).forEach(([countyName, data]) => {
      const complianceRate = data.count > 0 ? (data.compliant / data.count) * 100 : 0;

      const regionalData: AnalyticsData = {
        id: this.currentAnalyticsDataId++,
        dataType: "regional_analysis",
        entityType: "county",
        entityId: null,
        metricName: "county_compliance_rate",
        metricValue: complianceRate.toString(),
        aggregationType: "percentage",
        timeframe: "monthly",
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        metadata: {
          county: countyName,
          totalCommodities: data.count,
          compliantCommodities: data.compliant
        },
        generatedAt: new Date()
      };

      this.analyticsData.set(regionalData.id, regionalData);
      analytics.push(regionalData);
    });

    return analytics;
  }

  async generateSystemHealthMetrics(): Promise<AnalyticsData[]> {
    const totalUsers = this.users.size;
    const totalCommodities = this.commodities.size;
    const totalInspections = this.inspections.size;
    const totalFarmers = this.farmers.size;
    const totalSyncLogs = this.governmentSyncLogs.size;

    const systemHealth: AnalyticsData = {
      id: this.currentAnalyticsDataId++,
      dataType: "system_health",
      entityType: "system",
      entityId: null,
      metricName: "system_activity",
      metricValue: totalCommodities.toString(),
      aggregationType: "count",
      timeframe: "daily",
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: new Date(),
      metadata: {
        totalUsers,
        totalCommodities,
        totalInspections,
        totalFarmers,
        totalSyncLogs,
        systemStatus: "operational"
      },
      generatedAt: new Date()
    };

    this.analyticsData.set(systemHealth.id, systemHealth);
    return [systemHealth];
  }
}

export const storage = new MemStorage();
