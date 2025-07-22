import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const commodities = pgTable("commodities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // cocoa, coffee, palm_oil, rubber, rice
  batchNumber: text("batch_number").notNull().unique(),
  county: text("county").notNull(),
  qualityGrade: text("quality_grade").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  status: text("status").notNull().default("pending"), // pending, compliant, review_required, non_compliant
  farmerId: text("farmer_id"),
  farmerName: text("farmer_name"),
  harvestDate: timestamp("harvest_date"),
  gpsCoordinates: text("gps_coordinates"), // "lat,lng,alt" format
  gpsAccuracy: text("gps_accuracy"), // high, medium, low
  plotId: text("plot_id"), // linked farm plot
  district: text("district"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inspections = pgTable("inspections", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  inspectorId: text("inspector_id").notNull(),
  inspectorName: text("inspector_name").notNull(),
  inspectionDate: timestamp("inspection_date").notNull(),
  qualityGrade: text("quality_grade").notNull(),
  complianceStatus: text("compliance_status").notNull(), // compliant, review_required, non_compliant
  notes: text("notes"),
  deficiencies: text("deficiencies"),
  recommendations: text("recommendations"),
  nextInspectionDate: timestamp("next_inspection_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  certificateNumber: text("certificate_number").notNull().unique(),
  certificateType: text("certificate_type").notNull(), // export, quality, organic
  issuedBy: text("issued_by").notNull(),
  issuedDate: timestamp("issued_date").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  status: text("status").notNull().default("active"), // active, expired, revoked
  exportDestination: text("export_destination"),
  exporterName: text("exporter_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // warning, error, success, info
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  isRead: boolean("is_read").default(false),
  relatedEntity: text("related_entity"),
  relatedEntityId: integer("related_entity_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  reportId: text("report_id").notNull().unique(),
  title: text("title").notNull(),
  type: text("type").notNull(), // compliance, inspection, export, county, eudr_compliance, government_sync, export_analysis, gps_mapping
  dateRange: text("date_range"),
  generatedBy: text("generated_by").notNull(),
  department: text("department"),
  summary: text("summary"),
  data: text("data"), // JSON string of report data
  parameters: text("parameters"), // JSON string of report parameters
  generatedAt: timestamp("generated_at").defaultNow(),
  filePath: text("file_path"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, draft, published
});

// Farm Management Platform Tables
export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  farmerId: text("farmer_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  idNumber: text("id_number"),
  county: text("county").notNull(),
  district: text("district"),
  village: text("village"),
  gpsCoordinates: text("gps_coordinates"),
  farmSize: decimal("farm_size", { precision: 10, scale: 2 }),
  farmSizeUnit: text("farm_size_unit").default("hectares"),
  onboardingDate: timestamp("onboarding_date").defaultNow(),
  status: text("status").notNull().default("active"), // active, inactive, suspended
  agreementSigned: boolean("agreement_signed").default(false),
  agreementDate: timestamp("agreement_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const farmPlots = pgTable("farm_plots", {
  id: serial("id").primaryKey(),
  plotId: text("plot_id").notNull().unique(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  plotName: text("plot_name").notNull(),
  cropType: text("crop_type").notNull(), // cocoa, coffee, palm_oil, rubber, rice
  plotSize: decimal("plot_size", { precision: 10, scale: 2 }).notNull(),
  plotSizeUnit: text("plot_size_unit").default("hectares"),
  gpsCoordinates: text("gps_coordinates"), // JSON array of lat/lng points
  soilType: text("soil_type"),
  plantingDate: timestamp("planting_date"),
  expectedHarvestDate: timestamp("expected_harvest_date"),
  status: text("status").notNull().default("active"), // active, fallow, retired
  createdAt: timestamp("created_at").defaultNow(),
});

export const cropPlanning = pgTable("crop_planning", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  plotId: integer("plot_id").references(() => farmPlots.id).notNull(),
  season: text("season").notNull(), // rainy, dry
  year: integer("year").notNull(),
  cropType: text("crop_type").notNull(),
  varietyPlanned: text("variety_planned"),
  plannedArea: decimal("planned_area", { precision: 10, scale: 2 }),
  plantingStartDate: timestamp("planting_start_date"),
  plantingEndDate: timestamp("planting_end_date"),
  expectedHarvestDate: timestamp("expected_harvest_date"),
  targetYield: decimal("target_yield", { precision: 10, scale: 2 }),
  yieldUnit: text("yield_unit").default("kg"),
  status: text("status").notNull().default("planned"), // planned, planted, harvested
  createdAt: timestamp("created_at").defaultNow(),
});

export const harvestRecords = pgTable("harvest_records", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  plotId: integer("plot_id").references(() => farmPlots.id).notNull(),
  cropPlanId: integer("crop_plan_id").references(() => cropPlanning.id),
  harvestDate: timestamp("harvest_date").notNull(),
  cropType: text("crop_type").notNull(),
  quantityHarvested: decimal("quantity_harvested", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  qualityGrade: text("quality_grade"),
  moistureContent: decimal("moisture_content", { precision: 5, scale: 2 }),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }),
  buyerName: text("buyer_name"),
  paymentStatus: text("payment_status").default("pending"), // pending, partial, paid
  createdAt: timestamp("created_at").defaultNow(),
});

export const inputDistribution = pgTable("input_distribution", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  inputType: text("input_type").notNull(), // fertilizer, pesticide, seeds, tools
  inputName: text("input_name").notNull(),
  quantityDistributed: decimal("quantity_distributed", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }),
  distributionDate: timestamp("distribution_date").notNull(),
  supplier: text("supplier"),
  paymentMethod: text("payment_method"), // cash, credit, loan
  repaymentDue: timestamp("repayment_due"),
  repaymentStatus: text("repayment_status").default("pending"), // pending, partial, paid
  sustainabilityRating: text("sustainability_rating"), // organic, low_impact, conventional
  createdAt: timestamp("created_at").defaultNow(),
});



// Insert schemas
export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  createdAt: true,
});

export const insertFarmPlotSchema = createInsertSchema(farmPlots).omit({
  id: true,
  createdAt: true,
});

export const insertCropPlanSchema = createInsertSchema(cropPlanning).omit({
  id: true,
  createdAt: true,
});

export const insertHarvestRecordSchema = createInsertSchema(harvestRecords).omit({
  id: true,
  createdAt: true,
});

export const insertInputDistributionSchema = createInsertSchema(inputDistribution).omit({
  id: true,
  createdAt: true,
});



export const insertCommoditySchema = createInsertSchema(commodities).omit({
  id: true,
  createdAt: true,
});

export const insertInspectionSchema = createInsertSchema(inspections).omit({
  id: true,
  createdAt: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
});

// Types
export type Commodity = typeof commodities.$inferSelect;
export type InsertCommodity = z.infer<typeof insertCommoditySchema>;

export type Inspection = typeof inspections.$inferSelect;
export type InsertInspection = z.infer<typeof insertInspectionSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

// User schema (keeping existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("officer"), // officer, inspector, admin
  county: text("county"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Farm Management Platform types
export type Farmer = typeof farmers.$inferSelect;
export type FarmPlot = typeof farmPlots.$inferSelect;
export type CropPlan = typeof cropPlanning.$inferSelect;
export type HarvestRecord = typeof harvestRecords.$inferSelect;
export type InputDistribution = typeof inputDistribution.$inferSelect;


// Farm Management Platform insert types
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type InsertFarmPlot = z.infer<typeof insertFarmPlotSchema>;
export type InsertCropPlan = z.infer<typeof insertCropPlanSchema>;
export type InsertHarvestRecord = z.infer<typeof insertHarvestRecordSchema>;
export type InsertInputDistribution = z.infer<typeof insertInputDistributionSchema>;


// Analytics and Audit System Tables
export const analyticsData = pgTable("analytics_data", {
  id: serial("id").primaryKey(),
  dataType: text("data_type").notNull(), // commodity_trends, compliance_metrics, regional_analysis, farm_performance
  entityType: text("entity_type").notNull(), // commodity, farmer, county, system
  entityId: integer("entity_id"),
  metricName: text("metric_name").notNull(),
  metricValue: decimal("metric_value", { precision: 15, scale: 4 }).notNull(),
  aggregationType: text("aggregation_type").notNull(), // sum, avg, count, percentage
  timeframe: text("timeframe").notNull(), // daily, weekly, monthly, quarterly, yearly
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  metadata: jsonb("metadata"), // Additional context data
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  auditType: text("audit_type").notNull(), // data_access, system_change, compliance_review, security_event
  entityType: text("entity_type").notNull(), // user, commodity, farmer, system_config
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(), // create, update, delete, view, export, sync
  userId: text("user_id").notNull(),
  userRole: text("user_role").notNull(),
  organizationType: text("organization_type").notNull(), // agritrace_admin, lacra_officer, external_auditor
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  beforeData: jsonb("before_data"),
  afterData: jsonb("after_data"),
  accessReason: text("access_reason"),
  complianceFlags: text("compliance_flags").array(),
  riskLevel: text("risk_level").notNull().default("low"), // low, medium, high, critical
  auditTimestamp: timestamp("audit_timestamp").defaultNow(),
});

export const systemAudits = pgTable("system_audits", {
  id: serial("id").primaryKey(),
  auditId: text("audit_id").notNull().unique(),
  auditType: text("audit_type").notNull(), // compliance_audit, data_integrity, security_review, performance_audit
  auditScope: text("audit_scope").notNull(), // full_system, county_specific, commodity_specific, user_access
  auditStatus: text("audit_status").notNull().default("scheduled"), // scheduled, in_progress, completed, failed
  auditorId: text("auditor_id").notNull(),
  auditorName: text("auditor_name").notNull(),
  organizationType: text("organization_type").notNull().default("agritrace_admin"),
  targetEntities: jsonb("target_entities"), // Entities being audited
  auditFindings: jsonb("audit_findings"), // Detailed findings
  complianceScore: decimal("compliance_score", { precision: 5, scale: 2 }),
  riskAssessment: text("risk_assessment"),
  recommendedActions: jsonb("recommended_actions"),
  scheduledDate: timestamp("scheduled_date").notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditReports = pgTable("audit_reports", {
  id: serial("id").primaryKey(),
  reportId: text("report_id").notNull().unique(),
  systemAuditId: integer("system_audit_id").references(() => systemAudits.id),
  reportType: text("report_type").notNull(), // executive_summary, detailed_findings, compliance_report, security_assessment
  reportTitle: text("report_title").notNull(),
  reportStatus: text("report_status").notNull().default("draft"), // draft, under_review, approved, published
  executiveSummary: text("executive_summary"),
  keyFindings: jsonb("key_findings"),
  complianceGaps: jsonb("compliance_gaps"),
  riskMatrix: jsonb("risk_matrix"),
  recommendations: jsonb("recommendations"),
  actionPlan: jsonb("action_plan"),
  confidentialityLevel: text("confidentiality_level").notNull().default("internal"), // public, internal, confidential, restricted
  accessRestrictions: text("access_restrictions").array(),
  approvedBy: text("approved_by"),
  approvalDate: timestamp("approval_date"),
  publishedDate: timestamp("published_date"),
  generatedAt: timestamp("generated_at").defaultNow(),
});

// Government Integration Tables
export const lraIntegration = pgTable("lra_integration", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  taxId: text("tax_id").notNull().unique(),
  taxpayerTin: text("taxpayer_tin").notNull(),
  taxableAmount: decimal("taxable_amount", { precision: 12, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).notNull(),
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid, overdue
  assessmentDate: timestamp("assessment_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paymentDate: timestamp("payment_date"),
  lraOfficer: text("lra_officer").notNull(),
  syncStatus: text("sync_status").notNull().default("pending"), // pending, synced, failed
  lastSyncDate: timestamp("last_sync_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moaIntegration = pgTable("moa_integration", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  registrationNumber: text("registration_number").notNull().unique(),
  cropType: text("crop_type").notNull(),
  productionSeason: text("production_season").notNull(),
  estimatedYield: decimal("estimated_yield", { precision: 10, scale: 2 }),
  actualYield: decimal("actual_yield", { precision: 10, scale: 2 }),
  qualityCertification: text("quality_certification"),
  sustainabilityRating: text("sustainability_rating"), // organic, conventional, transitional
  moaOfficer: text("moa_officer").notNull(),
  inspectionStatus: text("inspection_status").notNull().default("pending"), // pending, approved, rejected
  approvalDate: timestamp("approval_date"),
  syncStatus: text("sync_status").notNull().default("pending"), // pending, synced, failed
  lastSyncDate: timestamp("last_sync_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customsIntegration = pgTable("customs_integration", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  certificationId: integer("certification_id").references(() => certifications.id),
  declarationNumber: text("declaration_number").notNull().unique(),
  hsCode: text("hs_code").notNull(), // Harmonized System Code
  exportValue: decimal("export_value", { precision: 12, scale: 2 }).notNull(),
  dutyAmount: decimal("duty_amount", { precision: 12, scale: 2 }),
  portOfExit: text("port_of_exit").notNull(),
  destinationCountry: text("destination_country").notNull(),
  exporterTin: text("exporter_tin").notNull(),
  customsOfficer: text("customs_officer").notNull(),
  clearanceStatus: text("clearance_status").notNull().default("pending"), // pending, cleared, held, rejected
  clearanceDate: timestamp("clearance_date"),
  syncStatus: text("sync_status").notNull().default("pending"), // pending, synced, failed
  lastSyncDate: timestamp("last_sync_date"),
  documentStatus: text("document_status").notNull().default("incomplete"), // incomplete, complete, verified
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const governmentSyncLog = pgTable("government_sync_log", {
  id: serial("id").primaryKey(),
  syncType: text("sync_type").notNull(), // lra, moa, customs
  entityId: integer("entity_id").notNull(),
  syncDirection: text("sync_direction").notNull(), // outbound, inbound, bidirectional
  status: text("status").notNull(), // success, failed, partial
  requestPayload: text("request_payload"), // JSON string
  responsePayload: text("response_payload"), // JSON string
  errorMessage: text("error_message"),
  syncDuration: integer("sync_duration"), // milliseconds
  syncedBy: text("synced_by").notNull(),
  syncDate: timestamp("sync_date").defaultNow(),
});

// Government Integration insert schemas
export const insertLraIntegrationSchema = createInsertSchema(lraIntegration).omit({
  id: true,
  createdAt: true,
});

export const insertMoaIntegrationSchema = createInsertSchema(moaIntegration).omit({
  id: true,
  createdAt: true,
});

export const insertCustomsIntegrationSchema = createInsertSchema(customsIntegration).omit({
  id: true,
  createdAt: true,
});

export const insertGovernmentSyncLogSchema = createInsertSchema(governmentSyncLog).omit({
  id: true,
  syncDate: true,
});

// Government Integration types
export type LraIntegration = typeof lraIntegration.$inferSelect;
export type MoaIntegration = typeof moaIntegration.$inferSelect;
export type CustomsIntegration = typeof customsIntegration.$inferSelect;
export type GovernmentSyncLog = typeof governmentSyncLog.$inferSelect;

export type InsertLraIntegration = z.infer<typeof insertLraIntegrationSchema>;
export type InsertMoaIntegration = z.infer<typeof insertMoaIntegrationSchema>;
export type InsertCustomsIntegration = z.infer<typeof insertCustomsIntegrationSchema>;
export type InsertGovernmentSyncLog = z.infer<typeof insertGovernmentSyncLogSchema>;

// Analytics and Audit insert schemas
export const insertAnalyticsDataSchema = createInsertSchema(analyticsData).omit({
  id: true,
  generatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  auditTimestamp: true,
});

export const insertSystemAuditSchema = createInsertSchema(systemAudits).omit({
  id: true,
  createdAt: true,
});

export const insertAuditReportSchema = createInsertSchema(auditReports).omit({
  id: true,
  generatedAt: true,
});

// Analytics and Audit types
export type AnalyticsData = typeof analyticsData.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type SystemAudit = typeof systemAudits.$inferSelect;
export type AuditReport = typeof auditReports.$inferSelect;

export type InsertAnalyticsData = z.infer<typeof insertAnalyticsDataSchema>;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type InsertSystemAudit = z.infer<typeof insertSystemAuditSchema>;
export type InsertAuditReport = z.infer<typeof insertAuditReportSchema>;

// GPS Farm Mapping for EUDR Compliance
export const farmGpsMapping = pgTable("farm_gps_mapping", {
  id: serial("id").primaryKey(),
  farmPlotId: integer("farm_plot_id").references(() => farmPlots.id),
  mappingId: varchar("mapping_id").notNull().unique(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  coordinates: text("coordinates").notNull(), // JSON array of GPS coordinates for polygon
  centerLatitude: decimal("center_latitude", { precision: 10, scale: 8 }).notNull(),
  centerLongitude: decimal("center_longitude", { precision: 11, scale: 8 }).notNull(),
  totalAreaHectares: decimal("total_area_hectares", { precision: 10, scale: 4 }).notNull(),
  boundaryType: varchar("boundary_type").notNull().default("polygon"), // polygon, circle, custom
  mappingMethod: varchar("mapping_method").notNull(), // gps_survey, satellite_imagery, drone_mapping
  accuracyLevel: varchar("accuracy_level").notNull(), // high, medium, low
  elevationMeters: decimal("elevation_meters", { precision: 8, scale: 2 }),
  slope: decimal("slope", { precision: 5, scale: 2 }), // percentage
  soilType: varchar("soil_type"),
  drainageStatus: varchar("drainage_status"),
  accessRoads: text("access_roads"), // JSON array of road access points
  nearbyWaterSources: text("nearby_water_sources"), // JSON array of water sources
  eudrCompliantDate: timestamp("eudr_compliant_date"),
  lastVerificationDate: timestamp("last_verification_date"),
  verificationStatus: varchar("verification_status").notNull().default("pending"), // verified, pending, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: text("metadata"), // JSON string for additional mapping data
});

// Deforestation Monitoring for EUDR
export const deforestationMonitoring = pgTable("deforestation_monitoring", {
  id: serial("id").primaryKey(),
  monitoringId: varchar("monitoring_id").notNull().unique(),
  farmGpsMappingId: integer("farm_gps_mapping_id").references(() => farmGpsMapping.id),
  monitoringDate: timestamp("monitoring_date").notNull(),
  satelliteImageryDate: timestamp("satellite_imagery_date"),
  forestCoveragePercentage: decimal("forest_coverage_percentage", { precision: 5, scale: 2 }),
  deforestationDetected: boolean("deforestation_detected").notNull().default(false),
  deforestationArea: decimal("deforestation_area", { precision: 10, scale: 4 }), // hectares
  riskLevel: varchar("risk_level").notNull().default("low"), // low, medium, high, critical
  complianceStatus: varchar("compliance_status").notNull().default("compliant"), // compliant, non_compliant, under_review
  satelliteSource: varchar("satellite_source"), // sentinel, landsat, planet, etc.
  imageResolution: varchar("image_resolution"), // meters per pixel
  detectionMethod: varchar("detection_method").notNull(), // automated, manual, hybrid
  alertGenerated: boolean("alert_generated").notNull().default(false),
  followUpRequired: boolean("follow_up_required").notNull().default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: text("metadata"), // JSON string for satellite data and analysis
});

// EUDR Compliance Tracking
export const eudrCompliance = pgTable("eudr_compliance", {
  id: serial("id").primaryKey(),
  complianceId: varchar("compliance_id").notNull().unique(),
  farmGpsMappingId: integer("farm_gps_mapping_id").references(() => farmGpsMapping.id),
  commodityId: integer("commodity_id").references(() => commodities.id),
  dueDiligenceStatement: text("due_diligence_statement").notNull(),
  riskAssessment: varchar("risk_assessment").notNull(), // negligible, low, standard, enhanced
  supplierDeclaration: text("supplier_declaration"),
  geoLocationData: text("geo_location_data").notNull(), // JSON with precise coordinates
  productionDate: timestamp("production_date"),
  harvestDate: timestamp("harvest_date"),
  eudrDeadlineCompliance: boolean("eudr_deadline_compliance").notNull().default(false),
  traceabilityScore: decimal("traceability_score", { precision: 5, scale: 2 }), // 0-100
  documentationComplete: boolean("documentation_complete").notNull().default(false),
  thirdPartyVerification: boolean("third_party_verification").notNull().default(false),
  verificationDate: timestamp("verification_date"),
  verificationBody: varchar("verification_body"),
  certificateNumber: varchar("certificate_number"),
  validityPeriod: timestamp("validity_period"),
  complianceStatus: varchar("compliance_status").notNull().default("pending"), // compliant, non_compliant, pending
  lastReviewDate: timestamp("last_review_date"),
  nextReviewDate: timestamp("next_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: text("metadata"), // JSON string for additional compliance data
});

// Geofencing and Monitoring Zones
export const geofencingZones = pgTable("geofencing_zones", {
  id: serial("id").primaryKey(),
  zoneId: varchar("zone_id").notNull().unique(),
  zoneName: varchar("zone_name").notNull(),
  zoneType: varchar("zone_type").notNull(), // protected_area, restricted_zone, monitoring_area, buffer_zone
  coordinates: text("coordinates").notNull(), // JSON array of GPS coordinates for zone boundary
  centerLatitude: decimal("center_latitude", { precision: 10, scale: 8 }).notNull(),
  centerLongitude: decimal("center_longitude", { precision: 11, scale: 8 }).notNull(),
  radiusMeters: decimal("radius_meters", { precision: 10, scale: 2 }),
  protectionLevel: varchar("protection_level").notNull(), // strict, moderate, advisory
  monitoringFrequency: varchar("monitoring_frequency").notNull().default("daily"), // hourly, daily, weekly, monthly
  alertThreshold: decimal("alert_threshold", { precision: 5, scale: 2 }), // percentage change trigger
  legalStatus: varchar("legal_status"), // national_park, forest_reserve, private_conservation
  managingAuthority: varchar("managing_authority"),
  establishedDate: timestamp("established_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: text("metadata"), // JSON string for zone-specific data
});

// GPS Mapping insert schemas
export const insertFarmGpsMappingSchema = createInsertSchema(farmGpsMapping).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeforestationMonitoringSchema = createInsertSchema(deforestationMonitoring).omit({
  id: true,
  createdAt: true,
});

export const insertEudrComplianceSchema = createInsertSchema(eudrCompliance).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGeofencingZoneSchema = createInsertSchema(geofencingZones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// GPS Mapping types
export type FarmGpsMapping = typeof farmGpsMapping.$inferSelect;
export type DeforestationMonitoring = typeof deforestationMonitoring.$inferSelect;
export type EudrCompliance = typeof eudrCompliance.$inferSelect;
export type GeofencingZone = typeof geofencingZones.$inferSelect;

export type InsertFarmGpsMapping = z.infer<typeof insertFarmGpsMappingSchema>;
export type InsertDeforestationMonitoring = z.infer<typeof insertDeforestationMonitoringSchema>;
export type InsertEudrCompliance = z.infer<typeof insertEudrComplianceSchema>;
export type InsertGeofencingZone = z.infer<typeof insertGeofencingZoneSchema>;
