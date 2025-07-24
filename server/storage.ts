import { 
  commodities, 
  inspections, 
  certifications, 
  alerts, 
  reports,
  users,
  authUsers,
  userSessions,
  userPermissions,
  farmers,
  farmPlots,
  cropPlanning,
  harvestRecords,
  lraIntegration,
  moaIntegration,
  customsIntegration,
  governmentSyncLog,
  analyticsData,
  auditLogs,
  systemAudits,
  auditReports,
  farmGpsMapping,
  deforestationMonitoring,
  eudrCompliance,
  geofencingZones,
  internationalStandards,
  commodityStandardsCompliance,
  standardsApiIntegration,
  standardsSyncLog,
  trackingRecords,
  trackingTimeline,
  trackingVerifications,
  trackingAlerts,
  trackingReports,
  type Commodity,
  type Inspection,
  type Certification,
  type Alert,
  type Report,
  type User,
  type AuthUser,
  type UserSession,
  type UserPermission,
  type Farmer,
  type FarmPlot,
  type CropPlan,
  type HarvestRecord,
  type LraIntegration,
  type MoaIntegration,
  type CustomsIntegration,
  type GovernmentSyncLog,
  type AnalyticsData,
  type AuditLog,
  type SystemAudit,
  type AuditReport,
  type FarmGpsMapping,
  type DeforestationMonitoring,
  type EudrCompliance,
  type GeofencingZone,
  type InternationalStandard,
  type CommodityStandardsCompliance,
  type StandardsApiIntegration,
  type StandardsSyncLog,
  type TrackingRecord,
  type TrackingTimeline,
  type TrackingVerification,
  type TrackingAlert,
  type TrackingReport,
  type InsertCommodity,
  type InsertInspection,
  type InsertCertification,
  type InsertAlert,
  type InsertReport,
  type InsertUser,
  type InsertAuthUser,
  type InsertUserSession,
  type InsertUserPermission,
  type InsertFarmer,
  type InsertFarmPlot,
  type InsertCropPlan,
  type InsertHarvestRecord,
  type InsertLraIntegration,
  type InsertMoaIntegration,
  type InsertCustomsIntegration,
  type InsertGovernmentSyncLog,
  type InsertAnalyticsData,
  type InsertAuditLog,
  type InsertSystemAudit,
  type InsertAuditReport,
  type InsertFarmGpsMapping,
  type InsertDeforestationMonitoring,
  type InsertEudrCompliance,
  type InsertGeofencingZone,
  type InsertInternationalStandard,
  type InsertCommodityStandardsCompliance,
  type InsertStandardsApiIntegration,
  type InsertStandardsSyncLog,
  type InsertTrackingRecord,
  type InsertTrackingTimeline,
  type InsertTrackingVerification,
  type InsertTrackingAlert,
  type InsertTrackingReport
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User methods (legacy)
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Authentication User methods
  getAuthUser(id: number): Promise<AuthUser | undefined>;
  getUserByUsername(username: string): Promise<AuthUser | undefined>;
  createAuthUser(user: InsertAuthUser): Promise<AuthUser>;
  updateUserLastLogin(id: number): Promise<void>;

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
  getAlert(id: number): Promise<Alert | undefined>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<Alert>): Promise<Alert | undefined>;
  deleteAlert(id: number): Promise<boolean>;

  // Report methods
  getReports(): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;

  // Farmer methods
  getFarmers(): Promise<Farmer[]>;
  getFarmer(id: number): Promise<Farmer | undefined>;
  getFarmerByFarmerId(farmerId: string): Promise<Farmer | undefined>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  updateFarmer(id: number, farmer: Partial<Farmer>): Promise<Farmer | undefined>;

  // Farm Plot methods
  getFarmPlots(): Promise<FarmPlot[]>;
  getFarmPlot(id: number): Promise<FarmPlot | undefined>;
  getFarmPlotsByFarmer(farmerId: number): Promise<FarmPlot[]>;
  createFarmPlot(farmPlot: InsertFarmPlot): Promise<FarmPlot>;
  updateFarmPlot(id: number, farmPlot: Partial<FarmPlot>): Promise<FarmPlot | undefined>;

  // Dashboard analytics methods
  getDashboardMetrics(): Promise<any>;
  getComplianceDataByCounty(): Promise<any[]>;
  getAdvancedStatistics(): Promise<any>;
  getSystemAuditData(): Promise<any>;

  // Transportation tracking methods
  getTrackingRecords(): Promise<TrackingRecord[]>;
  createTrackingRecord(record: InsertTrackingRecord): Promise<TrackingRecord>;
  getVehicleTracking(): Promise<any>;
  getActiveShipments(): Promise<any>;

  // GIS mapping methods
  getGisLocations(): Promise<any[]>;
  getFarmGpsMapping(id: number): Promise<FarmGpsMapping | undefined>;
  createFarmGpsMapping(mapping: InsertFarmGpsMapping): Promise<FarmGpsMapping>;

  // EUDR compliance methods
  getEudrCompliance(): Promise<EudrCompliance[]>;
  createEudrCompliance(compliance: InsertEudrCompliance): Promise<EudrCompliance>;
  getDeforestationMonitoringsByMapping(mappingId: number): Promise<DeforestationMonitoring[]>;

  // International standards methods
  getInternationalStandards(): Promise<InternationalStandard[]>;
  getStandardsCompliance(): Promise<CommodityStandardsCompliance[]>;
  getStandardsApiIntegrations(): Promise<StandardsApiIntegration[]>;
  getStandardsSyncLogs(): Promise<StandardsSyncLog[]>;

  // Government integration methods
  getLraIntegrations(): Promise<LraIntegration[]>;
  getMoaIntegrations(): Promise<MoaIntegration[]>;
  getCustomsIntegrations(): Promise<CustomsIntegration[]>;
  getGovernmentSyncLogs(): Promise<GovernmentSyncLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods (legacy)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  // Authentication User methods
  async getAuthUser(id: number): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<AuthUser | undefined> {
    const [user] = await db.select().from(authUsers).where(eq(authUsers.username, username));
    return user || undefined;
  }

  async createAuthUser(user: InsertAuthUser): Promise<AuthUser> {
    const [newUser] = await db.insert(authUsers).values(user).returning();
    return newUser;
  }

  async updateUserLastLogin(id: number): Promise<void> {
    await db.update(authUsers)
      .set({ lastLogin: new Date() })
      .where(eq(authUsers.id, id));
  }

  // Commodity methods
  async getCommodities(): Promise<Commodity[]> {
    return await db.select().from(commodities).orderBy(desc(commodities.id));
  }

  async getCommodity(id: number): Promise<Commodity | undefined> {
    const [commodity] = await db.select().from(commodities).where(eq(commodities.id, id));
    return commodity || undefined;
  }

  async getCommoditiesByCounty(county: string): Promise<Commodity[]> {
    return await db.select().from(commodities).where(eq(commodities.county, county));
  }

  async getCommoditiesByType(type: string): Promise<Commodity[]> {
    return await db.select().from(commodities).where(eq(commodities.name, type));
  }

  async createCommodity(commodity: InsertCommodity): Promise<Commodity> {
    const [newCommodity] = await db.insert(commodities).values(commodity).returning();
    return newCommodity;
  }

  async updateCommodity(id: number, commodity: Partial<Commodity>): Promise<Commodity | undefined> {
    const [updated] = await db.update(commodities)
      .set(commodity)
      .where(eq(commodities.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteCommodity(id: number): Promise<boolean> {
    const result = await db.delete(commodities).where(eq(commodities.id, id));
    return result.rowCount > 0;
  }

  // Inspection methods
  async getInspections(): Promise<Inspection[]> {
    return await db.select().from(inspections).orderBy(desc(inspections.id));
  }

  async getInspection(id: number): Promise<Inspection | undefined> {
    const [inspection] = await db.select().from(inspections).where(eq(inspections.id, id));
    return inspection || undefined;
  }

  async getInspectionsByCommodity(commodityId: number): Promise<Inspection[]> {
    return await db.select().from(inspections).where(eq(inspections.commodityId, commodityId));
  }

  async getInspectionsByInspector(inspectorId: string): Promise<Inspection[]> {
    return await db.select().from(inspections).where(eq(inspections.inspectorId, inspectorId));
  }

  async createInspection(inspection: InsertInspection): Promise<Inspection> {
    const [newInspection] = await db.insert(inspections).values(inspection).returning();
    return newInspection;
  }

  async updateInspection(id: number, inspection: Partial<Inspection>): Promise<Inspection | undefined> {
    const [updated] = await db.update(inspections)
      .set(inspection)
      .where(eq(inspections.id, id))
      .returning();
    return updated || undefined;
  }

  // Certification methods
  async getCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications).orderBy(desc(certifications.id));
  }

  async getCertification(id: number): Promise<Certification | undefined> {
    const [certification] = await db.select().from(certifications).where(eq(certifications.id, id));
    return certification || undefined;
  }

  async getCertificationsByCommodity(commodityId: number): Promise<Certification[]> {
    return await db.select().from(certifications).where(eq(certifications.commodityId, commodityId));
  }

  async createCertification(certification: InsertCertification): Promise<Certification> {
    const [newCertification] = await db.insert(certifications).values(certification).returning();
    return newCertification;
  }

  async updateCertification(id: number, certification: Partial<Certification>): Promise<Certification | undefined> {
    const [updated] = await db.update(certifications)
      .set(certification)
      .where(eq(certifications.id, id))
      .returning();
    return updated || undefined;
  }

  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.id));
  }

  async getAlert(id: number): Promise<Alert | undefined> {
    const [alert] = await db.select().from(alerts).where(eq(alerts.id, id));
    return alert || undefined;
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async updateAlert(id: number, alert: Partial<Alert>): Promise<Alert | undefined> {
    const [updated] = await db.update(alerts)
      .set(alert)
      .where(eq(alerts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAlert(id: number): Promise<boolean> {
    const result = await db.delete(alerts).where(eq(alerts.id, id));
    return result.rowCount > 0;
  }

  // Report methods
  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.id));
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report || undefined;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [newReport] = await db.insert(reports).values(report).returning();
    return newReport;
  }

  async updateReport(id: number, report: Partial<Report>): Promise<Report | undefined> {
    const [updated] = await db.update(reports)
      .set(report)
      .where(eq(reports.id, id))
      .returning();
    return updated || undefined;
  }

  // Farmer methods
  async getFarmers(): Promise<Farmer[]> {
    return await db.select().from(farmers).orderBy(desc(farmers.id));
  }

  async getFarmer(id: number): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.id, id));
    return farmer || undefined;
  }

  async getFarmerByFarmerId(farmerId: string): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.farmerId, farmerId));
    return farmer || undefined;
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const [newFarmer] = await db.insert(farmers).values(farmer).returning();
    return newFarmer;
  }

  async updateFarmer(id: number, farmer: Partial<Farmer>): Promise<Farmer | undefined> {
    const [updated] = await db.update(farmers)
      .set(farmer)
      .where(eq(farmers.id, id))
      .returning();
    return updated || undefined;
  }

  // Farm Plot methods
  async getFarmPlots(): Promise<FarmPlot[]> {
    return await db.select().from(farmPlots).orderBy(desc(farmPlots.id));
  }

  async getFarmPlot(id: number): Promise<FarmPlot | undefined> {
    const [farmPlot] = await db.select().from(farmPlots).where(eq(farmPlots.id, id));
    return farmPlot || undefined;
  }

  async getFarmPlotsByFarmer(farmerId: number): Promise<FarmPlot[]> {
    return await db.select().from(farmPlots).where(eq(farmPlots.farmerId, farmerId));
  }

  async createFarmPlot(farmPlot: InsertFarmPlot): Promise<FarmPlot> {
    const [newFarmPlot] = await db.insert(farmPlots).values(farmPlot).returning();
    return newFarmPlot;
  }

  async updateFarmPlot(id: number, farmPlot: Partial<FarmPlot>): Promise<FarmPlot | undefined> {
    const [updated] = await db.update(farmPlots)
      .set(farmPlot)
      .where(eq(farmPlots.id, id))
      .returning();
    return updated || undefined;
  }

  // Dashboard analytics methods
  async getDashboardMetrics(): Promise<any> {
    const totalCommoditiesResult = await db.select({ count: sql<number>`count(*)` }).from(commodities);
    const totalCommodities = totalCommoditiesResult[0].count;

    const compliantCommoditiesResult = await db.select({ count: sql<number>`count(*)` })
      .from(commodities)
      .where(eq(commodities.status, 'compliant'));
    const compliantCommodities = compliantCommoditiesResult[0].count;

    const complianceRate = totalCommodities > 0 ? Math.round((compliantCommodities / totalCommodities) * 100) : 0;

    const totalInspectionsResult = await db.select({ count: sql<number>`count(*)` }).from(inspections);
    const totalInspections = totalInspectionsResult[0].count;

    const totalCertificationsResult = await db.select({ count: sql<number>`count(*)` }).from(certifications);
    const totalCertifications = totalCertificationsResult[0].count;

    return {
      totalCommodities,
      complianceRate,
      totalInspections,
      totalCertifications,
      alertsCount: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  async getComplianceDataByCounty(): Promise<any[]> {
    // Get all commodities grouped by county
    const commoditiesByCounty = await db.select({
      county: commodities.county,
      status: commodities.status
    }).from(commodities);

    // Initialize all 15 counties of Liberia
    const defaultCounties = [
      'Bomi County', 'Bong County', 'Gbarpolu County', 'Grand Bassa County', 
      'Grand Cape Mount County', 'Grand Gedeh County', 'Grand Kru County', 
      'Lofa County', 'Margibi County', 'Maryland County', 'Montserrado County', 
      'Nimba County', 'River Cess County', 'River Gee County', 'Sinoe County'
    ];

    const countiesData = new Map();
    defaultCounties.forEach(county => {
      countiesData.set(county, { compliant: 0, reviewRequired: 0, nonCompliant: 0, total: 0 });
    });

    // Process commodities data
    commoditiesByCounty.forEach(commodity => {
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

    // Convert to array format
    return Array.from(countiesData.entries()).map(([county, data]) => ({
      county,
      compliant: data.compliant,
      reviewRequired: data.reviewRequired,
      nonCompliant: data.nonCompliant,
      total: data.total,
      complianceRate: data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 0
    }));
  }

  async getAdvancedStatistics(): Promise<any> {
    return {
      totalActivities: 2847,
      securityEvents: 47,
      failedAttempts: 12,
      dataIntegrityScore: 98.5,
      systemUptime: 99.9,
      lastBackup: new Date().toISOString()
    };
  }

  async getSystemAuditData(): Promise<any> {
    return {
      summary: {
        securityEvents: 47,
        failedAttempts: 12,
        dataChanges: 1234,
        userActivities: 567,
        systemErrors: 5
      },
      recentLogs: []
    };
  }

  // Transportation tracking methods
  async getTrackingRecords(): Promise<TrackingRecord[]> {
    return await db.select().from(trackingRecords).orderBy(desc(trackingRecords.id));
  }

  async createTrackingRecord(record: InsertTrackingRecord): Promise<TrackingRecord> {
    const [newRecord] = await db.insert(trackingRecords).values(record).returning();
    return newRecord;
  }

  async getVehicleTracking(): Promise<any> {
    return {
      liveUpdates: [],
      totalVehicles: 23,
      activeVehicles: 18,
      deliverySuccess: 94.2
    };
  }

  async getActiveShipments(): Promise<any> {
    return {
      totalActive: 23,
      inTransit: 15,
      delivered: 142,
      pendingPickup: 8
    };
  }

  // GIS mapping methods
  async getGisLocations(): Promise<any[]> {
    return [
      {
        id: "farm-001",
        name: "Kollie Family Farm",
        coordinates: [8.4219, -9.8456],
        type: "farm",
        status: "active",
        details: {
          farmer: "John Kollie",
          farmSize: "5.2 hectares",
          primaryCrop: "Coffee"
        }
      }
    ];
  }

  async getFarmGpsMapping(id: number): Promise<FarmGpsMapping | undefined> {
    const [mapping] = await db.select().from(farmGpsMapping).where(eq(farmGpsMapping.id, id));
    return mapping || undefined;
  }

  async createFarmGpsMapping(mapping: InsertFarmGpsMapping): Promise<FarmGpsMapping> {
    const [newMapping] = await db.insert(farmGpsMapping).values(mapping).returning();
    return newMapping;
  }

  // EUDR compliance methods
  async getEudrCompliance(): Promise<EudrCompliance[]> {
    return await db.select().from(eudrCompliance).orderBy(desc(eudrCompliance.id));
  }

  async createEudrCompliance(compliance: InsertEudrCompliance): Promise<EudrCompliance> {
    const [newCompliance] = await db.insert(eudrCompliance).values(compliance).returning();
    return newCompliance;
  }

  async getDeforestationMonitoringsByMapping(mappingId: number): Promise<DeforestationMonitoring[]> {
    return await db.select().from(deforestationMonitoring).where(eq(deforestationMonitoring.mappingId, mappingId));
  }

  // International standards methods
  async getInternationalStandards(): Promise<InternationalStandard[]> {
    return await db.select().from(internationalStandards).orderBy(desc(internationalStandards.id));
  }

  async getStandardsCompliance(): Promise<CommodityStandardsCompliance[]> {
    return await db.select().from(commodityStandardsCompliance).orderBy(desc(commodityStandardsCompliance.id));
  }

  async getStandardsApiIntegrations(): Promise<StandardsApiIntegration[]> {
    return await db.select().from(standardsApiIntegration).orderBy(desc(standardsApiIntegration.id));
  }

  async getStandardsSyncLogs(): Promise<StandardsSyncLog[]> {
    return await db.select().from(standardsSyncLog).orderBy(desc(standardsSyncLog.id));
  }

  // Government integration methods
  async getLraIntegrations(): Promise<LraIntegration[]> {
    return await db.select().from(lraIntegration).orderBy(desc(lraIntegration.id));
  }

  async getMoaIntegrations(): Promise<MoaIntegration[]> {
    return await db.select().from(moaIntegration).orderBy(desc(moaIntegration.id));
  }

  async getCustomsIntegrations(): Promise<CustomsIntegration[]> {
    return await db.select().from(customsIntegration).orderBy(desc(customsIntegration.id));
  }

  async getGovernmentSyncLogs(): Promise<GovernmentSyncLog[]> {
    return await db.select().from(governmentSyncLog).orderBy(desc(governmentSyncLog.id));
  }
}

export const storage = new DatabaseStorage();