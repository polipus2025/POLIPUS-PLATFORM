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
  internalMessages,
  messageRecipients,
  messageTemplates,
  certificateVerifications,
  userVerifications,
  trackingEvents,
  verificationLogs,
  economicActivities,
  countyEconomicSummary,
  economicIndicators,
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
  type InsertTrackingReport,
  type InternalMessage,
  type MessageRecipient,
  type MessageTemplate,
  type InsertInternalMessage,
  type InsertMessageRecipient,
  type InsertMessageTemplate,
  type CertificateVerification,
  type UserVerification,
  type TrackingEvent,
  type VerificationLog,
  type InsertCertificateVerification,
  type InsertUserVerification,
  type InsertTrackingEvent,
  type InsertVerificationLog,
  type EconomicActivity,
  type CountyEconomicSummary,
  type EconomicIndicator,
  type InsertEconomicActivity,
  type InsertCountyEconomicSummary,
  type InsertEconomicIndicator
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // User methods (legacy)
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Authentication User methods
  getAuthUser(id: number): Promise<AuthUser | undefined>;
  getUserByUsername(username: string): Promise<AuthUser | undefined>;
  createAuthUser(user: InsertAuthUser): Promise<AuthUser>;

  // Alert methods
  getUnreadAlerts(): Promise<Alert[]>;
  markAlertAsRead(alertId: number): Promise<void>;

  // Farmer methods by county (field agent territorial restrictions)
  getFarmersByCounty(county: string): Promise<Farmer[]>;

  // Crop planning methods
  getCropPlansByFarmer(farmerId: string): Promise<CropPlan[]>;
  getCropPlansBySeason(season: string): Promise<CropPlan[]>;
  getCropPlans(): Promise<CropPlan[]>;
  createCropPlan(cropPlan: InsertCropPlan): Promise<CropPlan>;

  // Government integration methods
  getLraIntegrationsByStatus(status: string): Promise<LraIntegration[]>;
  getMoaIntegrationsByStatus(status: string): Promise<MoaIntegration[]>;
  getCustomsIntegrationsByStatus(status: string): Promise<CustomsIntegration[]>;
  createLraIntegration(integration: InsertLraIntegration): Promise<LraIntegration>;
  createMoaIntegration(integration: InsertMoaIntegration): Promise<MoaIntegration>;
  createCustomsIntegration(integration: InsertCustomsIntegration): Promise<CustomsIntegration>;

  // Sync operations
  getGovernmentSyncLogsByEntity(entity: string): Promise<GovernmentSyncLog[]>;
  getGovernmentSyncLogsByType(type: string): Promise<GovernmentSyncLog[]>;
  syncWithLRA(data: any): Promise<any>;
  syncWithMOA(data: any): Promise<any>;
  syncWithCustoms(data: any): Promise<any>;
  getGovernmentComplianceStatus(): Promise<any>;

  // Analytics methods
  getAnalyticsData(): Promise<AnalyticsData[]>;
  createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData>;
  generateComplianceTrends(): Promise<any>;
  generateFarmPerformanceAnalytics(): Promise<any>;
  generateRegionalAnalytics(): Promise<any>;
  generateSystemHealthMetrics(): Promise<any>;

  // Audit methods
  getAuditLogs(): Promise<AuditLog[]>;
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getSystemAudits(): Promise<SystemAudit[]>;
  getSystemAudit(id: number): Promise<SystemAudit | undefined>;
  createSystemAudit(audit: InsertSystemAudit): Promise<SystemAudit>;
  updateSystemAudit(id: number, audit: Partial<SystemAudit>): Promise<SystemAudit>;
  getAuditReports(): Promise<AuditReport[]>;
  getAuditReport(id: number): Promise<AuditReport | undefined>;
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;
  updateAuditReport(id: number, report: Partial<AuditReport>): Promise<AuditReport>;

  // EUDR and GPS methods
  getEudrComplianceByCommodity(commodityId: number): Promise<EudrCompliance[]>;
  getEudrComplianceByMapping(mappingId: number): Promise<EudrCompliance[]>;
  
  // Geofencing methods
  getGeofencingZonesByType(type: string): Promise<GeofencingZone[]>;
  getGeofencingZones(): Promise<GeofencingZone[]>;
  getGeofencingZone(id: number): Promise<GeofencingZone | undefined>;
  createGeofencingZone(zone: InsertGeofencingZone): Promise<GeofencingZone>;
  
  // GPS validation methods
  validateGpsCoordinates(coordinates: string): Promise<boolean>;
  checkEudrCompliance(commodityId: number): Promise<any>;
  detectDeforestation(coordinates: string): Promise<any>;
  generateTraceabilityReport(commodityId: number): Promise<any>;

  // International standards methods
  getInternationalStandardsByType(type: string): Promise<InternationalStandard[]>;
  getInternationalStandardsByOrganization(organization: string): Promise<InternationalStandard[]>;
  getInternationalStandard(id: number): Promise<InternationalStandard | undefined>;
  createInternationalStandard(standard: InsertInternationalStandard): Promise<InternationalStandard>;

  // Standards compliance methods
  getStandardsComplianceByCommodity(commodityId: number): Promise<CommodityStandardsCompliance[]>;
  getStandardsComplianceByStandard(standardId: number): Promise<CommodityStandardsCompliance[]>;
  getStandardsComplianceByStatus(status: string): Promise<CommodityStandardsCompliance[]>;
  createStandardsCompliance(compliance: InsertCommodityStandardsCompliance): Promise<CommodityStandardsCompliance>;

  // Standards API integration methods
  getStandardsApiIntegrationByStandard(standardId: number): Promise<StandardsApiIntegration[]>;
  createStandardsApiIntegration(integration: InsertStandardsApiIntegration): Promise<StandardsApiIntegration>;
  getStandardsSyncLogsByIntegration(integrationId: number): Promise<StandardsSyncLog[]>;
  createStandardsSyncLog(log: InsertStandardsSyncLog): Promise<StandardsSyncLog>;

  // Tracking methods
  getTrackingRecordsByCommodity(commodityId: number): Promise<TrackingRecord[]>;
  getTrackingRecordsByFarmer(farmerId: string): Promise<TrackingRecord[]>;
  getTrackingRecord(id: number): Promise<TrackingRecord | undefined>;
  updateTrackingRecord(id: number, record: Partial<TrackingRecord>): Promise<TrackingRecord>;
  verifyTrackingRecord(id: number): Promise<TrackingRecord>;
  getTrackingTimeline(recordId: number): Promise<TrackingTimeline[]>;
  createTrackingTimelineEvent(event: InsertTrackingTimeline): Promise<TrackingTimeline>;
  getTrackingVerifications(recordId: number): Promise<TrackingVerification[]>;
  createTrackingVerification(verification: InsertTrackingVerification): Promise<TrackingVerification>;
  getTrackingAlerts(): Promise<TrackingAlert[]>;
  createTrackingAlert(alert: InsertTrackingAlert): Promise<TrackingAlert>;
  getTrackingReports(): Promise<TrackingReport[]>;
  createTrackingReport(report: InsertTrackingReport): Promise<TrackingReport>;

  // Real-time verification methods
  getCertificateVerifications(): Promise<CertificateVerification[]>;
  getCertificateVerification(id: number): Promise<CertificateVerification | undefined>;
  getCertificateVerificationByCode(code: string): Promise<CertificateVerification | undefined>;
  createCertificateVerification(verification: InsertCertificateVerification): Promise<CertificateVerification>;
  updateCertificateVerification(id: number, verification: Partial<CertificateVerification>): Promise<CertificateVerification>;
  
  getUserVerifications(): Promise<UserVerification[]>;
  getUserVerification(id: number): Promise<UserVerification | undefined>;
  getUserVerificationsByUser(userId: number): Promise<UserVerification[]>;
  createUserVerification(verification: InsertUserVerification): Promise<UserVerification>;
  updateUserVerification(id: number, verification: Partial<UserVerification>): Promise<UserVerification>;
  
  getTrackingEvents(): Promise<TrackingEvent[]>;
  getTrackingEvent(id: number): Promise<TrackingEvent | undefined>;
  getTrackingEventsByTrackingId(trackingId: string): Promise<TrackingEvent[]>;
  createTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent>;
  updateTrackingEvent(id: number, event: Partial<TrackingEvent>): Promise<TrackingEvent>;
  
  getVerificationLogs(): Promise<VerificationLog[]>;
  getVerificationLogsByType(type: string): Promise<VerificationLog[]>;
  createVerificationLog(log: InsertVerificationLog): Promise<VerificationLog>;

  // Exporter methods
  getExporters(): Promise<any[]>;
  getExporter(id: number): Promise<any | undefined>;
  createExporter(exporter: any): Promise<any>;
  getExportOrdersByExporter(exporterId: number): Promise<any[]>;
  getExportOrders(): Promise<any[]>;
  getExportOrder(id: number): Promise<any | undefined>;
  createExportOrder(order: any): Promise<any>;
  updateExportOrder(id: number, order: any): Promise<any>;
  deleteExportOrder(id: number): Promise<void>;

  // Mobile app integration methods
  getInspectionRequests(): Promise<any[]>;
  createInspectionRequest(request: any): Promise<any>;
  approveInspectionRequest(id: number, data: any): Promise<any>;
  rejectInspectionRequest(id: number, reason: string): Promise<any>;
  getFarmerRegistrationRequests(): Promise<any[]>;
  createFarmerRegistrationRequest(request: any): Promise<any>;
  approveFarmerRegistrationRequest(id: number, data: any): Promise<any>;
  rejectFarmerRegistrationRequest(id: number, reason: string): Promise<any>;
  
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
  getFarmGpsMappings(): Promise<FarmGpsMapping[]>;
  getFarmGpsMappingsByFarmer(farmerId: number): Promise<FarmGpsMapping[]>;
  updateFarmGpsMapping(id: number, mapping: Partial<FarmGpsMapping>): Promise<FarmGpsMapping | undefined>;

  // EUDR compliance methods
  getEudrCompliance(): Promise<EudrCompliance[]>;
  createEudrCompliance(compliance: InsertEudrCompliance): Promise<EudrCompliance>;
  getEudrCompliances(): Promise<EudrCompliance[]>;
  
  // Deforestation monitoring methods
  getDeforestationMonitorings(): Promise<DeforestationMonitoring[]>;
  getDeforestationMonitoring(id: number): Promise<DeforestationMonitoring | undefined>;
  getDeforestationMonitoringsByMapping(mappingId: number): Promise<DeforestationMonitoring[]>;
  getDeforestationMonitoringsByRiskLevel(riskLevel: string): Promise<DeforestationMonitoring[]>;
  createDeforestationMonitoring(monitoring: InsertDeforestationMonitoring): Promise<DeforestationMonitoring>;

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

  // Internal messaging methods
  getMessages(recipientId: string): Promise<InternalMessage[]>;
  getMessage(messageId: string): Promise<InternalMessage | undefined>;
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
  getFarmGpsMappings(): Promise<FarmGpsMapping[]>;
  getFarmGpsMappingsByFarmer(farmerId: number): Promise<FarmGpsMapping[]>;
  updateFarmGpsMapping(id: number, mapping: Partial<FarmGpsMapping>): Promise<FarmGpsMapping | undefined>;

  // EUDR compliance methods
  getEudrCompliance(): Promise<EudrCompliance[]>;
  createEudrCompliance(compliance: InsertEudrCompliance): Promise<EudrCompliance>;
  getEudrCompliances(): Promise<EudrCompliance[]>;
  
  // Deforestation monitoring methods
  getDeforestationMonitorings(): Promise<DeforestationMonitoring[]>;
  getDeforestationMonitoring(id: number): Promise<DeforestationMonitoring | undefined>;
  getDeforestationMonitoringsByMapping(mappingId: number): Promise<DeforestationMonitoring[]>;
  getDeforestationMonitoringsByRiskLevel(riskLevel: string): Promise<DeforestationMonitoring[]>;
  createDeforestationMonitoring(monitoring: InsertDeforestationMonitoring): Promise<DeforestationMonitoring>;

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

  // Internal messaging methods
  getMessages(recipientId: string): Promise<InternalMessage[]>;
  getMessage(messageId: string): Promise<InternalMessage | undefined>;
  sendMessage(message: InsertInternalMessage): Promise<InternalMessage>;
  markMessageAsRead(messageId: string, recipientId: string): Promise<void>;
  getUnreadMessagesCount(recipientId: string): Promise<number>;
  getMessageTemplates(): Promise<MessageTemplate[]>;
  createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate>;
  deleteMessage(messageId: string): Promise<boolean>;
  replyToMessage(parentMessageId: string, reply: InsertInternalMessage): Promise<InternalMessage>;
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
    await db.update(authUsers).set({ lastLogin: new Date() }).where(eq(authUsers.id, id));
  }

  // Alert methods
  async getUnreadAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).where(eq(alerts.isRead, false)).orderBy(desc(alerts.createdAt));
  }

  async markAlertAsRead(alertId: number): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, alertId));
  }

  // Farmer methods by county (field agent territorial restrictions)
  async getFarmersByCounty(county: string): Promise<Farmer[]> {
    return await db.select().from(farmers).where(eq(farmers.county, county));
  }

  // Crop planning methods
  async getCropPlansByFarmer(farmerId: string): Promise<CropPlan[]> {
    return await db.select().from(cropPlanning).where(eq(cropPlanning.farmerId, parseInt(farmerId)));
  }

  async getCropPlansBySeason(season: string): Promise<CropPlan[]> {
    return await db.select().from(cropPlanning).where(eq(cropPlanning.season, season));
  }

  async getCropPlans(): Promise<CropPlan[]> {
    return await db.select().from(cropPlanning).orderBy(desc(cropPlanning.createdAt));
  }

  async createCropPlan(cropPlan: InsertCropPlan): Promise<CropPlan> {
    const [newPlan] = await db.insert(cropPlanning).values(cropPlan).returning();
    return newPlan;
  }

  // Government integration methods
  async getLraIntegrationsByStatus(status: string): Promise<LraIntegration[]> {
    return await db.select().from(lraIntegration).where(eq(lraIntegration.syncStatus, status));
  }

  async getMoaIntegrationsByStatus(status: string): Promise<MoaIntegration[]> {
    return await db.select().from(moaIntegration).where(eq(moaIntegration.syncStatus, status));
  }

  async getCustomsIntegrationsByStatus(status: string): Promise<CustomsIntegration[]> {
    return await db.select().from(customsIntegration).where(eq(customsIntegration.syncStatus, status));
  }

  async createLraIntegration(integration: InsertLraIntegration): Promise<LraIntegration> {
    const [newIntegration] = await db.insert(lraIntegration).values(integration).returning();
    return newIntegration;
  }

  async createMoaIntegration(integration: InsertMoaIntegration): Promise<MoaIntegration> {
    const [newIntegration] = await db.insert(moaIntegration).values(integration).returning();
    return newIntegration;
  }

  async createCustomsIntegration(integration: InsertCustomsIntegration): Promise<CustomsIntegration> {
    const [newIntegration] = await db.insert(customsIntegration).values(integration).returning();
    return newIntegration;
  }

  // Sync operations
  async getGovernmentSyncLogsByEntity(entity: string): Promise<GovernmentSyncLog[]> {
    return await db.select().from(governmentSyncLog).where(eq(governmentSyncLog.entityId, entity));
  }

  async getGovernmentSyncLogsByType(type: string): Promise<GovernmentSyncLog[]> {
    return await db.select().from(governmentSyncLog).where(eq(governmentSyncLog.syncType, type));
  }

  async syncWithLRA(data: any): Promise<any> {
    // Simulate LRA sync
    return { success: true, message: "Synced with LRA", timestamp: new Date() };
  }

  async syncWithMOA(data: any): Promise<any> {
    // Simulate MOA sync
    return { success: true, message: "Synced with MOA", timestamp: new Date() };
  }

  async syncWithCustoms(data: any): Promise<any> {
    // Simulate Customs sync
    return { success: true, message: "Synced with Customs", timestamp: new Date() };
  }

  async getGovernmentComplianceStatus(): Promise<any> {
    return {
      lra: { status: "active", lastSync: new Date(), compliance: 95 },
      moa: { status: "active", lastSync: new Date(), compliance: 92 },
      customs: { status: "active", lastSync: new Date(), compliance: 88 }
    };
  }

  // Analytics methods
  async getAnalyticsData(): Promise<AnalyticsData[]> {
    return await db.select().from(analyticsData).orderBy(desc(analyticsData.generatedAt));
  }

  async createAnalyticsData(data: InsertAnalyticsData): Promise<AnalyticsData> {
    const [newData] = await db.insert(analyticsData).values(data).returning();
    return newData;
  }

  async generateComplianceTrends(): Promise<any> {
    return {
      trends: [
        { month: "Jan", compliance: 85 },
        { month: "Feb", compliance: 87 },
        { month: "Mar", compliance: 89 },
        { month: "Apr", compliance: 91 }
      ]
    };
  }

  async generateFarmPerformanceAnalytics(): Promise<any> {
    return {
      totalFarms: 1250,
      averageYield: 2.3,
      topPerformers: ["Farm-001", "Farm-045", "Farm-123"]
    };
  }

  async generateRegionalAnalytics(): Promise<any> {
    return {
      regions: [
        { county: "Montserrado", farms: 234, compliance: 92 },
        { county: "Bong", farms: 189, compliance: 88 },
        { county: "Nimba", farms: 156, compliance: 85 }
      ]
    };
  }

  async generateSystemHealthMetrics(): Promise<any> {
    return {
      uptime: 99.8,
      responseTime: 120,
      activeUsers: 45,
      systemLoad: 23
    };
  }

  // Audit methods
  async getAuditLogs(): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).orderBy(desc(auditLogs.auditTimestamp));
  }

  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [newLog] = await db.insert(auditLogs).values(log).returning();
    return newLog;
  }

  async getSystemAudits(): Promise<SystemAudit[]> {
    return await db.select().from(systemAudits).orderBy(desc(systemAudits.createdAt));
  }

  async getSystemAudit(id: number): Promise<SystemAudit | undefined> {
    const [audit] = await db.select().from(systemAudits).where(eq(systemAudits.id, id));
    return audit || undefined;
  }

  async createSystemAudit(audit: InsertSystemAudit): Promise<SystemAudit> {
    const [newAudit] = await db.insert(systemAudits).values(audit).returning();
    return newAudit;
  }

  async updateSystemAudit(id: number, audit: Partial<SystemAudit>): Promise<SystemAudit> {
    const [updatedAudit] = await db.update(systemAudits).set(audit).where(eq(systemAudits.id, id)).returning();
    return updatedAudit;
  }

  async getAuditReports(): Promise<AuditReport[]> {
    return await db.select().from(auditReports).orderBy(desc(auditReports.generatedAt));
  }

  async getAuditReport(id: number): Promise<AuditReport | undefined> {
    const [report] = await db.select().from(auditReports).where(eq(auditReports.id, id));
    return report || undefined;
  }

  async createAuditReport(report: InsertAuditReport): Promise<AuditReport> {
    const [newReport] = await db.insert(auditReports).values(report).returning();
    return newReport;
  }

  async updateAuditReport(id: number, report: Partial<AuditReport>): Promise<AuditReport> {
    const [updatedReport] = await db.update(auditReports).set(report).where(eq(auditReports.id, id)).returning();
    return updatedReport;
  }

  // EUDR and GPS methods
  async getEudrComplianceByCommodity(commodityId: number): Promise<EudrCompliance[]> {
    return await db.select().from(eudrCompliance).where(eq(eudrCompliance.commodityId, commodityId));
  }

  async getEudrComplianceByMapping(mappingId: number): Promise<EudrCompliance[]> {
    return await db.select().from(eudrCompliance).where(eq(eudrCompliance.farmGpsMappingId, mappingId));
  }
  
  // Geofencing methods
  async getGeofencingZonesByType(type: string): Promise<GeofencingZone[]> {
    return await db.select().from(geofencingZones).where(eq(geofencingZones.zoneType, type));
  }

  async getGeofencingZones(): Promise<GeofencingZone[]> {
    return await db.select().from(geofencingZones);
  }

  async getGeofencingZone(id: number): Promise<GeofencingZone | undefined> {
    const [zone] = await db.select().from(geofencingZones).where(eq(geofencingZones.id, id));
    return zone || undefined;
  }

  async createGeofencingZone(zone: InsertGeofencingZone): Promise<GeofencingZone> {
    const [newZone] = await db.insert(geofencingZones).values(zone).returning();
    return newZone;
  }
  
  // GPS validation methods
  async validateGpsCoordinates(coordinates: string): Promise<boolean> {
    // Basic GPS coordinate validation
    const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*(,-?\d+\.?\d*)?$/;
    return coordPattern.test(coordinates);
  }

  async checkEudrCompliance(commodityId: number): Promise<any> {
    return {
      compliant: true,
      riskLevel: "low",
      deforestationFree: true,
      lastChecked: new Date()
    };
  }

  async detectDeforestation(coordinates: string): Promise<any> {
    return {
      detected: false,
      confidence: 0.85,
      alertDate: new Date(),
      riskLevel: "low"
    };
  }

  async generateTraceabilityReport(commodityId: number): Promise<any> {
    return {
      commodityId,
      traceabilityScore: 92,
      chain: ["Farm", "Processing", "Export"],
      verified: true
    };
  }

  // International standards methods
  async getInternationalStandardsByType(type: string): Promise<InternationalStandard[]> {
    return await db.select().from(internationalStandards).where(eq(internationalStandards.standardType, type));
  }

  async getInternationalStandardsByOrganization(organization: string): Promise<InternationalStandard[]> {
    return await db.select().from(internationalStandards).where(eq(internationalStandards.organizationName, organization));
  }

  async getInternationalStandard(id: number): Promise<InternationalStandard | undefined> {
    const [standard] = await db.select().from(internationalStandards).where(eq(internationalStandards.id, id));
    return standard || undefined;
  }

  async createInternationalStandard(standard: InsertInternationalStandard): Promise<InternationalStandard> {
    const [newStandard] = await db.insert(internationalStandards).values(standard).returning();
    return newStandard;
  }

  // Standards compliance methods
  async getStandardsComplianceByCommodity(commodityId: number): Promise<CommodityStandardsCompliance[]> {
    return await db.select().from(commodityStandardsCompliance).where(eq(commodityStandardsCompliance.commodityId, commodityId));
  }

  async getStandardsComplianceByStandard(standardId: number): Promise<CommodityStandardsCompliance[]> {
    return await db.select().from(commodityStandardsCompliance).where(eq(commodityStandardsCompliance.standardId, standardId));
  }

  async getStandardsComplianceByStatus(status: string): Promise<CommodityStandardsCompliance[]> {
    return await db.select().from(commodityStandardsCompliance).where(eq(commodityStandardsCompliance.complianceStatus, status));
  }

  async createStandardsCompliance(compliance: InsertCommodityStandardsCompliance): Promise<CommodityStandardsCompliance> {
    const [newCompliance] = await db.insert(commodityStandardsCompliance).values(compliance).returning();
    return newCompliance;
  }

  // Standards API integration methods
  async getStandardsApiIntegrationByStandard(standardId: number): Promise<StandardsApiIntegration[]> {
    return await db.select().from(standardsApiIntegration).where(eq(standardsApiIntegration.standardId, standardId));
  }

  async createStandardsApiIntegration(integration: InsertStandardsApiIntegration): Promise<StandardsApiIntegration> {
    const [newIntegration] = await db.insert(standardsApiIntegration).values(integration).returning();
    return newIntegration;
  }

  async getStandardsSyncLogsByIntegration(integrationId: number): Promise<StandardsSyncLog[]> {
    return await db.select().from(standardsSyncLog).where(eq(standardsSyncLog.apiIntegrationId, integrationId));
  }

  async createStandardsSyncLog(log: InsertStandardsSyncLog): Promise<StandardsSyncLog> {
    const [newLog] = await db.insert(standardsSyncLog).values(log).returning();
    return newLog;
  }

  // Tracking methods
  async getTrackingRecordsByCommodity(commodityId: number): Promise<TrackingRecord[]> {
    return await db.select().from(trackingRecords).where(eq(trackingRecords.commodityId, commodityId));
  }

  async getTrackingRecordsByFarmer(farmerId: string): Promise<TrackingRecord[]> {
    return await db.select().from(trackingRecords).where(eq(trackingRecords.farmerId, parseInt(farmerId)));
  }

  async getTrackingRecord(id: number): Promise<TrackingRecord | undefined> {
    const [record] = await db.select().from(trackingRecords).where(eq(trackingRecords.id, id));
    return record || undefined;
  }

  async updateTrackingRecord(id: number, record: Partial<TrackingRecord>): Promise<TrackingRecord> {
    const [updatedRecord] = await db.update(trackingRecords).set(record).where(eq(trackingRecords.id, id)).returning();
    return updatedRecord;
  }

  async verifyTrackingRecord(id: number): Promise<TrackingRecord> {
    const [verifiedRecord] = await db.update(trackingRecords)
      .set({ verificationStatus: 'verified', verifiedAt: new Date() })
      .where(eq(trackingRecords.id, id))
      .returning();
    return verifiedRecord;
  }

  async getTrackingTimeline(recordId: number): Promise<TrackingTimeline[]> {
    return await db.select().from(trackingTimeline).where(eq(trackingTimeline.trackingRecordId, recordId));
  }

  async createTrackingTimelineEvent(event: InsertTrackingTimeline): Promise<TrackingTimeline> {
    const [newEvent] = await db.insert(trackingTimeline).values(event).returning();
    return newEvent;
  }

  async getTrackingVerifications(recordId: number): Promise<TrackingVerification[]> {
    return await db.select().from(trackingVerifications).where(eq(trackingVerifications.trackingRecordId, recordId));
  }

  async createTrackingVerification(verification: InsertTrackingVerification): Promise<TrackingVerification> {
    const [newVerification] = await db.insert(trackingVerifications).values(verification).returning();
    return newVerification;
  }

  async getTrackingAlerts(): Promise<TrackingAlert[]> {
    return await db.select().from(trackingAlerts).orderBy(desc(trackingAlerts.createdAt));
  }

  async createTrackingAlert(alert: InsertTrackingAlert): Promise<TrackingAlert> {
    const [newAlert] = await db.insert(trackingAlerts).values(alert).returning();
    return newAlert;
  }

  async getTrackingReports(): Promise<TrackingReport[]> {
    return await db.select().from(trackingReports).orderBy(desc(trackingReports.createdAt));
  }

  async createTrackingReport(report: InsertTrackingReport): Promise<TrackingReport> {
    const [newReport] = await db.insert(trackingReports).values(report).returning();
    return newReport;
  }

  // Exporter methods - Mock implementations for now
  async getExporters(): Promise<any[]> {
    return [
      { id: 1, name: "Liberia Agri Export Ltd", status: "active", exports: 45 },
      { id: 2, name: "West Africa Commodities", status: "active", exports: 32 }
    ];
  }

  async getExporter(id: number): Promise<any | undefined> {
    const exporters = await this.getExporters();
    return exporters.find(e => e.id === id);
  }

  async createExporter(exporter: any): Promise<any> {
    return { id: Date.now(), ...exporter, createdAt: new Date() };
  }

  async getExportOrdersByExporter(exporterId: number): Promise<any[]> {
    return [
      { id: 1, exporterId, commodity: "cocoa", quantity: 1000, status: "pending" },
      { id: 2, exporterId, commodity: "coffee", quantity: 500, status: "shipped" }
    ];
  }

  async getExportOrders(): Promise<any[]> {
    return [
      { id: 1, exporterId: 1, commodity: "cocoa", quantity: 1000, status: "pending" },
      { id: 2, exporterId: 2, commodity: "coffee", quantity: 500, status: "shipped" }
    ];
  }

  async getExportOrder(id: number): Promise<any | undefined> {
    const orders = await this.getExportOrders();
    return orders.find(o => o.id === id);
  }

  async createExportOrder(order: any): Promise<any> {
    return { id: Date.now(), ...order, createdAt: new Date() };
  }

  async updateExportOrder(id: number, order: any): Promise<any> {
    return { id, ...order, updatedAt: new Date() };
  }

  async deleteExportOrder(id: number): Promise<void> {
    // Mock delete operation
  }

  // Mobile app integration methods - Mock implementations
  async getInspectionRequests(): Promise<any[]> {
    return [
      { id: 1, farmerId: "FRM-001", type: "quality_check", status: "pending", urgent: false },
      { id: 2, farmerId: "FRM-002", type: "compliance_audit", status: "approved", urgent: true }
    ];
  }

  async createInspectionRequest(request: any): Promise<any> {
    return { id: Date.now(), ...request, createdAt: new Date() };
  }

  async approveInspectionRequest(id: number, data: any): Promise<any> {
    return { id, status: "approved", approvedAt: new Date(), ...data };
  }

  async rejectInspectionRequest(id: number, reason: string): Promise<any> {
    return { id, status: "rejected", rejectedAt: new Date(), reason };
  }

  async getFarmerRegistrationRequests(): Promise<any[]> {
    return [
      { id: 1, name: "John Doe", county: "Bong", status: "pending" },
      { id: 2, name: "Mary Smith", county: "Nimba", status: "approved" }
    ];
  }

  async createFarmerRegistrationRequest(request: any): Promise<any> {
    return { id: Date.now(), ...request, createdAt: new Date() };
  }

  async approveFarmerRegistrationRequest(id: number, data: any): Promise<any> {
    return { id, status: "approved", approvedAt: new Date(), ...data };
  }

  async rejectFarmerRegistrationRequest(id: number, reason: string): Promise<any> {
    return { id, status: "rejected", rejectedAt: new Date(), reason };
  }

  // Complete all existing storage method implementations from the interface
  async getCommodities(): Promise<Commodity[]> {
    return await db.select().from(commodities).orderBy(desc(commodities.createdAt));
  }

  async getCommodity(id: number): Promise<Commodity | undefined> {
    const [commodity] = await db.select().from(commodities).where(eq(commodities.id, id));
    return commodity || undefined;
  }

  async getCommoditiesByCounty(county: string): Promise<Commodity[]> {
    return await db.select().from(commodities).where(eq(commodities.county, county));
  }

  async getCommoditiesByType(type: string): Promise<Commodity[]> {
    return await db.select().from(commodities).where(eq(commodities.type, type));
  }

  async createCommodity(commodity: InsertCommodity): Promise<Commodity> {
    const [newCommodity] = await db.insert(commodities).values(commodity).returning();
    return newCommodity;
  }

  async updateCommodity(id: number, commodity: Partial<Commodity>): Promise<Commodity | undefined> {
    const [updatedCommodity] = await db.update(commodities).set(commodity).where(eq(commodities.id, id)).returning();
    return updatedCommodity || undefined;
  }

  async deleteCommodity(id: number): Promise<boolean> {
    const result = await db.delete(commodities).where(eq(commodities.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Inspection methods
  async getInspections(): Promise<Inspection[]> {
    return await db.select().from(inspections).orderBy(desc(inspections.createdAt));
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
    const [updatedInspection] = await db.update(inspections).set(inspection).where(eq(inspections.id, id)).returning();
    return updatedInspection || undefined;
  }

  // Certification methods
  async getCertifications(): Promise<Certification[]> {
    return await db.select().from(certifications).orderBy(desc(certifications.createdAt));
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
    const [updatedCertification] = await db.update(certifications).set(certification).where(eq(certifications.id, id)).returning();
    return updatedCertification || undefined;
  }

  // Alert methods
  async getAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts).orderBy(desc(alerts.createdAt));
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
    const [updatedAlert] = await db.update(alerts).set(alert).where(eq(alerts.id, id)).returning();
    return updatedAlert || undefined;
  }

  async deleteAlert(id: number): Promise<boolean> {
    const result = await db.delete(alerts).where(eq(alerts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Report methods
  async getReports(): Promise<Report[]> {
    return await db.select().from(reports).orderBy(desc(reports.generatedAt));
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
    const [updatedReport] = await db.update(reports).set(report).where(eq(reports.id, id)).returning();
    return updatedReport || undefined;
  }

  // Farmer methods
  async getFarmers(): Promise<Farmer[]> {
    return await db.select().from(farmers).orderBy(desc(farmers.onboardingDate));
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
    const [updatedFarmer] = await db.update(farmers).set(farmer).where(eq(farmers.id, id)).returning();
    return updatedFarmer || undefined;
  }

  // Farm Plot methods
  async getFarmPlots(): Promise<FarmPlot[]> {
    return await db.select().from(farmPlots);
  }

  async getFarmPlot(id: number): Promise<FarmPlot | undefined> {
    const [plot] = await db.select().from(farmPlots).where(eq(farmPlots.id, id));
    return plot || undefined;
  }

  async getFarmPlotsByFarmer(farmerId: number): Promise<FarmPlot[]> {
    return await db.select().from(farmPlots).where(eq(farmPlots.farmerId, farmerId));
  }

  async createFarmPlot(farmPlot: InsertFarmPlot): Promise<FarmPlot> {
    const [newPlot] = await db.insert(farmPlots).values(farmPlot).returning();
    return newPlot;
  }

  async updateFarmPlot(id: number, farmPlot: Partial<FarmPlot>): Promise<FarmPlot | undefined> {
    const [updatedPlot] = await db.update(farmPlots).set(farmPlot).where(eq(farmPlots.id, id)).returning();
    return updatedPlot || undefined;
  }

  // Dashboard analytics methods with real-time simulation
  async getDashboardMetrics(): Promise<any> {
    // Add realistic real-time variation for demonstration
    const baseTotal = 1250;
    const timeVariation = Math.floor(Math.sin(Date.now() / 30000) * 25);
    const totalCommodities = baseTotal + timeVariation;

    const baseCompliance = 87;
    const complianceVariation = Math.floor(Math.sin(Date.now() / 20000) * 8);
    const complianceRate = Math.max(79, Math.min(95, baseCompliance + complianceVariation));

    const basePending = 45;
    const pendingVariation = Math.floor(Math.cos(Date.now() / 25000) * 15);
    const pendingInspections = Math.max(15, basePending + pendingVariation);

    const baseCerts = 287;
    const certVariation = Math.floor(Math.sin(Date.now() / 40000) * 20);
    const exportCertificates = Math.max(250, baseCerts + certVariation);

    return {
      totalCommodities,
      complianceRate,
      pendingInspections,
      exportCertificates,
      lastUpdated: new Date().toISOString(),
      realTimeActive: true
    };
  }

  async getComplianceDataByCounty(): Promise<any[]> {
    // Add time-based variation for real-time demonstration
    const baseData = [
      { county: "Montserrado County", compliance: 92, commodities: 234 },
      { county: "Bong County", compliance: 88, commodities: 189 },
      { county: "Nimba County", compliance: 85, commodities: 156 },
      { county: "Grand Bassa County", compliance: 79, commodities: 134 },
      { county: "Lofa County", compliance: 83, commodities: 127 },
      { county: "Grand Cape Mount County", compliance: 81, commodities: 98 },
      { county: "Margibi County", compliance: 90, commodities: 145 },
      { county: "Grand Gedeh County", compliance: 77, commodities: 87 },
      { county: "Sinoe County", compliance: 74, commodities: 76 },
      { county: "River Cess County", compliance: 71, commodities: 64 },
      { county: "Maryland County", compliance: 86, commodities: 112 },
      { county: "Grand Kru County", compliance: 69, commodities: 52 },
      { county: "Rivercess County", compliance: 72, commodities: 58 },
      { county: "Gbarpolu County", compliance: 78, commodities: 89 },
      { county: "Bomi County", compliance: 84, commodities: 103 }
    ];

    // Add slight variations for real-time effect
    return baseData.map(county => ({
      ...county,
      complianceRate: Math.max(65, Math.min(98, 
        county.compliance + Math.floor(Math.sin(Date.now() / 35000 + county.commodities) * 5)
      )),
      totalCommodities: Math.max(30, 
        county.commodities + Math.floor(Math.cos(Date.now() / 28000 + county.compliance) * 8)
      )
    }));
  }

  async getAdvancedStatistics(): Promise<any> {
    return {
      totalRevenue: 2450000,
      exportVolume: 15678,
      farmersOnboarded: 1250,
      complianceScore: 92.5,
      inspectionRate: 78.3
    };
  }

  async getSystemAuditData(): Promise<any> {
    return {
      totalAudits: 45,
      passedAudits: 41,
      failedAudits: 4,
      averageScore: 87.2,
      lastAudit: new Date()
    };
  }

  // Transportation tracking methods
  async getTrackingRecords(): Promise<TrackingRecord[]> {
    return await db.select().from(trackingRecords).orderBy(desc(trackingRecords.createdAt));
  }

  async createTrackingRecord(record: InsertTrackingRecord): Promise<TrackingRecord> {
    const [newRecord] = await db.insert(trackingRecords).values(record).returning();
    return newRecord;
  }

  async getVehicleTracking(): Promise<any> {
    return {
      activeVehicles: 12,
      totalDistance: 2340,
      averageSpeed: 45,
      deliveries: 89
    };
  }

  async getActiveShipments(): Promise<any> {
    return {
      inTransit: 23,
      delivered: 156,
      pending: 12,
      totalValue: 450000
    };
  }

  // GIS mapping methods
  async getGisLocations(): Promise<any[]> {
    return [
      { id: 1, name: "Farm Location 1", lat: 6.3106, lng: -10.8047, type: "farm" },
      { id: 2, name: "Processing Center", lat: 6.2908, lng: -10.7609, type: "processing" },
      { id: 3, name: "Export Terminal", lat: 6.3133, lng: -10.8059, type: "terminal" }
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

  async getFarmGpsMappings(): Promise<FarmGpsMapping[]> {
    return await db.select().from(farmGpsMapping);
  }

  async getFarmGpsMappingsByFarmer(farmerId: number): Promise<FarmGpsMapping[]> {
    return await db.select().from(farmGpsMapping).where(eq(farmGpsMapping.farmerId, farmerId));
  }

  async updateFarmGpsMapping(id: number, mapping: Partial<FarmGpsMapping>): Promise<FarmGpsMapping | undefined> {
    const [updatedMapping] = await db.update(farmGpsMapping).set(mapping).where(eq(farmGpsMapping.id, id)).returning();
    return updatedMapping || undefined;
  }

  // EUDR compliance methods
  async getEudrCompliance(): Promise<EudrCompliance[]> {
    return await db.select().from(eudrCompliance);
  }

  async createEudrCompliance(compliance: InsertEudrCompliance): Promise<EudrCompliance> {
    const [newCompliance] = await db.insert(eudrCompliance).values(compliance).returning();
    return newCompliance;
  }

  async getEudrCompliances(): Promise<EudrCompliance[]> {
    return await db.select().from(eudrCompliance);
  }
  
  // Deforestation monitoring methods
  async getDeforestationMonitorings(): Promise<DeforestationMonitoring[]> {
    return await db.select().from(deforestationMonitoring);
  }

  async getDeforestationMonitoring(id: number): Promise<DeforestationMonitoring | undefined> {
    const [monitoring] = await db.select().from(deforestationMonitoring).where(eq(deforestationMonitoring.id, id));
    return monitoring || undefined;
  }

  async getDeforestationMonitoringsByMapping(mappingId: number): Promise<DeforestationMonitoring[]> {
    return await db.select().from(deforestationMonitoring).where(eq(deforestationMonitoring.farmGpsMappingId, mappingId));
  }

  async getDeforestationMonitoringsByRiskLevel(riskLevel: string): Promise<DeforestationMonitoring[]> {
    return await db.select().from(deforestationMonitoring).where(eq(deforestationMonitoring.riskLevel, riskLevel));
  }

  async createDeforestationMonitoring(monitoring: InsertDeforestationMonitoring): Promise<DeforestationMonitoring> {
    const [newMonitoring] = await db.insert(deforestationMonitoring).values(monitoring).returning();
    return newMonitoring;
  }

  // International standards methods
  async getInternationalStandards(): Promise<InternationalStandard[]> {
    return await db.select().from(internationalStandards);
  }

  async getStandardsCompliance(): Promise<CommodityStandardsCompliance[]> {
    return await db.select().from(commodityStandardsCompliance);
  }

  async getStandardsApiIntegrations(): Promise<StandardsApiIntegration[]> {
    return await db.select().from(standardsApiIntegration);
  }

  async getStandardsSyncLogs(): Promise<StandardsSyncLog[]> {
    return await db.select().from(standardsSyncLog);
  }

  // Government integration methods
  async getLraIntegrations(): Promise<LraIntegration[]> {
    return await db.select().from(lraIntegration);
  }

  async getMoaIntegrations(): Promise<MoaIntegration[]> {
    return await db.select().from(moaIntegration);
  }

  async getCustomsIntegrations(): Promise<CustomsIntegration[]> {
    return await db.select().from(customsIntegration);
  }

  async getGovernmentSyncLogs(): Promise<GovernmentSyncLog[]> {
    return await db.select().from(governmentSyncLog);
  }

  // Internal messaging methods
  async getMessages(recipientId: string): Promise<InternalMessage[]> {
    // Get user type from the recipient ID
    let userType = 'regulatory_admin'; // default
    let altUserType = 'regulatory'; // alternative form
    if (recipientId.startsWith('FRM-')) {
      userType = 'farmer';
      altUserType = 'farmer';
    } else if (recipientId.startsWith('AGT-')) {
      userType = 'field_agent';
      altUserType = 'field_agent';
    } else if (recipientId.startsWith('EXP-')) {
      userType = 'exporter';
      altUserType = 'exporter';
    }

    return await db.select().from(internalMessages).where(
      or(
        eq(internalMessages.recipientId, recipientId), // Messages sent directly to user
        eq(internalMessages.recipientId, 'all_users'), // Messages sent to all users
        eq(internalMessages.recipientType, userType),  // Messages sent to user's type (old format)
        eq(internalMessages.recipientType, altUserType),  // Messages sent to user's type (new format)
        eq(internalMessages.recipientType, 'all_users') // Messages sent to all user types
      )
    );
  }

  async getMessage(messageId: string): Promise<InternalMessage | undefined> {
    const [message] = await db.select().from(internalMessages).where(eq(internalMessages.messageId, messageId));
    return message || undefined;
  }

  async sendMessage(message: InsertInternalMessage): Promise<InternalMessage> {
    const [newMessage] = await db.insert(internalMessages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(messageId: string, recipientId: string): Promise<void> {
    await db.update(internalMessages)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(internalMessages.messageId, messageId), eq(internalMessages.recipientId, recipientId)));
  }

  async getUnreadMessagesCount(recipientId: string): Promise<number> {
    // Get user type from the recipient ID
    let userType = 'regulatory_admin'; // default
    let altUserType = 'regulatory'; // alternative form
    if (recipientId.startsWith('FRM-')) {
      userType = 'farmer';
      altUserType = 'farmer';
    } else if (recipientId.startsWith('AGT-')) {
      userType = 'field_agent';
      altUserType = 'field_agent';
    } else if (recipientId.startsWith('EXP-')) {
      userType = 'exporter';
      altUserType = 'exporter';
    }

    const result = await db.select({ count: sql`count(*)` })
      .from(internalMessages)
      .where(and(
        or(
          eq(internalMessages.recipientId, recipientId), // Messages sent directly to user
          eq(internalMessages.recipientId, 'all_users'), // Messages sent to all users
          eq(internalMessages.recipientType, userType),  // Messages sent to user's type (old format)
          eq(internalMessages.recipientType, altUserType),  // Messages sent to user's type (new format)
          eq(internalMessages.recipientType, 'all_users') // Messages sent to all user types
        ),
        eq(internalMessages.isRead, false)
      ));
    return Number(result[0]?.count || 0);
  }

  async getMessageTemplates(): Promise<MessageTemplate[]> {
    return await db.select().from(messageTemplates);
  }

  async createMessageTemplate(template: InsertMessageTemplate): Promise<MessageTemplate> {
    const [newTemplate] = await db.insert(messageTemplates).values(template).returning();
    return newTemplate;
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    const result = await db.delete(internalMessages).where(eq(internalMessages.messageId, messageId));
    return (result.rowCount ?? 0) > 0;
  }

  async replyToMessage(parentMessageId: string, reply: InsertInternalMessage): Promise<InternalMessage> {
    const replyMessage = { ...reply, parentMessageId };
    const [newReply] = await db.insert(internalMessages).values(replyMessage).returning();
    return newReply;
  }

  // Real-time verification methods implementation
  async getCertificateVerifications(): Promise<CertificateVerification[]> {
    return await db.select().from(certificateVerifications).orderBy(desc(certificateVerifications.createdAt));
  }

  async getCertificateVerification(id: number): Promise<CertificateVerification | undefined> {
    const [verification] = await db.select().from(certificateVerifications).where(eq(certificateVerifications.id, id));
    return verification || undefined;
  }

  async getCertificateVerificationByCode(code: string): Promise<CertificateVerification | undefined> {
    const [verification] = await db.select().from(certificateVerifications).where(eq(certificateVerifications.verificationCode, code));
    return verification || undefined;
  }

  async createCertificateVerification(verification: InsertCertificateVerification): Promise<CertificateVerification> {
    const [newVerification] = await db.insert(certificateVerifications).values(verification).returning();
    
    // Create verification log
    await this.createVerificationLog({
      verificationId: newVerification.id,
      verificationType: 'certificate',
      action: 'created',
      performedBy: verification.verifiedBy,
      details: `Certificate verification created with code: ${verification.verificationCode}`,
      newState: verification.verificationStatus || 'pending'
    });
    
    return newVerification;
  }

  async updateCertificateVerification(id: number, verification: Partial<CertificateVerification>): Promise<CertificateVerification> {
    const [updated] = await db.update(certificateVerifications)
      .set({ ...verification, updatedAt: new Date() })
      .where(eq(certificateVerifications.id, id))
      .returning();
    
    // Create verification log
    await this.createVerificationLog({
      verificationId: id,
      verificationType: 'certificate',
      action: 'updated',
      performedBy: verification.verifiedBy,
      details: `Certificate verification updated`,
      newState: verification.verificationStatus || 'updated'
    });
    
    return updated;
  }

  async getUserVerifications(): Promise<UserVerification[]> {
    return await db.select().from(userVerifications).orderBy(desc(userVerifications.createdAt));
  }

  async getUserVerification(id: number): Promise<UserVerification | undefined> {
    const [verification] = await db.select().from(userVerifications).where(eq(userVerifications.id, id));
    return verification || undefined;
  }

  async getUserVerificationsByUser(userId: number): Promise<UserVerification[]> {
    return await db.select().from(userVerifications).where(eq(userVerifications.userId, userId));
  }

  async createUserVerification(verification: InsertUserVerification): Promise<UserVerification> {
    const [newVerification] = await db.insert(userVerifications).values(verification).returning();
    
    // Create verification log
    await this.createVerificationLog({
      verificationId: newVerification.id,
      verificationType: 'user',
      action: 'created',
      performedBy: verification.verifiedBy,
      details: `User verification created for type: ${verification.verificationType}`,
      newState: verification.verificationStatus
    });
    
    return newVerification;
  }

  async updateUserVerification(id: number, verification: Partial<UserVerification>): Promise<UserVerification> {
    const [updated] = await db.update(userVerifications)
      .set({ ...verification, updatedAt: new Date() })
      .where(eq(userVerifications.id, id))
      .returning();
    
    // Create verification log
    await this.createVerificationLog({
      verificationId: id,
      verificationType: 'user',
      action: 'updated',
      performedBy: verification.verifiedBy,
      details: `User verification updated`,
      newState: verification.verificationStatus || 'updated'
    });
    
    return updated;
  }

  async getTrackingEvents(): Promise<TrackingEvent[]> {
    return await db.select().from(trackingEvents).orderBy(desc(trackingEvents.timestamp));
  }

  async getTrackingEvent(id: number): Promise<TrackingEvent | undefined> {
    const [event] = await db.select().from(trackingEvents).where(eq(trackingEvents.id, id));
    return event || undefined;
  }

  async getTrackingEventsByTrackingId(trackingId: string): Promise<TrackingEvent[]> {
    return await db.select().from(trackingEvents).where(eq(trackingEvents.trackingId, trackingId));
  }

  async createTrackingEvent(event: InsertTrackingEvent): Promise<TrackingEvent> {
    const [newEvent] = await db.insert(trackingEvents).values(event).returning();
    
    // Create verification log
    await this.createVerificationLog({
      verificationId: newEvent.id,
      verificationType: 'tracking',
      action: 'created',
      performedBy: event.userId,
      details: `Tracking event created: ${event.eventType} - ${event.eventStatus}`,
      newState: event.eventStatus
    });
    
    return newEvent;
  }

  async updateTrackingEvent(id: number, event: Partial<TrackingEvent>): Promise<TrackingEvent> {
    const [updated] = await db.update(trackingEvents)
      .set(event)
      .where(eq(trackingEvents.id, id))
      .returning();
    
    // Create verification log
    await this.createVerificationLog({
      verificationId: id,
      verificationType: 'tracking',
      action: 'updated',
      performedBy: event.userId,
      details: `Tracking event updated`,
      newState: event.eventStatus || 'updated'
    });
    
    return updated;
  }

  async getVerificationLogs(): Promise<VerificationLog[]> {
    return await db.select().from(verificationLogs).orderBy(desc(verificationLogs.timestamp));
  }

  async getVerificationLogsByType(type: string): Promise<VerificationLog[]> {
    return await db.select().from(verificationLogs)
      .where(eq(verificationLogs.verificationType, type))
      .orderBy(desc(verificationLogs.timestamp));
  }

  async createVerificationLog(log: InsertVerificationLog): Promise<VerificationLog> {
    const [newLog] = await db.insert(verificationLogs).values(log).returning();
    return newLog;
  }
}

export const storage = new DatabaseStorage();
