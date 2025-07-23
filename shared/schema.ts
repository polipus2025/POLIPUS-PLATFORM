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
  type: text("type").notNull(), // compliance, inspection, export, county, eudr_compliance, government_sync, export_analysis, gps_mapping, standards_compliance
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

// Authentication and User Management System
export const authUsers = pgTable("auth_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(), // regulatory_admin, regulatory_staff, field_agent, farmer, exporter
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  department: text("department"), // for regulatory staff
  jurisdiction: text("jurisdiction"), // county/district for field agents
  farmerId: integer("farmer_id").references(() => farmers.id), // linked farmer account
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => authUsers.id).notNull(),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => authUsers.id).notNull(),
  permission: text("permission").notNull(), // read_commodities, write_commodities, manage_farmers, etc.
  grantedBy: integer("granted_by").references(() => authUsers.id),
  grantedAt: timestamp("granted_at").defaultNow(),
});

// User schema (keeping existing for backward compatibility)
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

// Exporters table for independent exporter operations
export const exporters = pgTable("exporters", {
  id: serial("id").primaryKey(),
  exporterId: varchar("exporter_id", { length: 50 }).unique().notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  businessLicense: varchar("business_license", { length: 100 }).unique().notNull(),
  taxIdNumber: varchar("tax_id_number", { length: 50 }).unique(),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  address: text("address").notNull(),
  county: varchar("county", { length: 100 }).notNull(),
  district: varchar("district", { length: 100 }),
  exportLicense: varchar("export_license", { length: 100 }).unique().notNull(),
  licenseExpiryDate: timestamp("license_expiry_date").notNull(),
  commodityTypes: text("commodity_types").array().notNull(), // Array of commodity types they can export
  bankName: varchar("bank_name", { length: 255 }),
  accountNumber: varchar("account_number", { length: 50 }),
  swiftCode: varchar("swift_code", { length: 20 }),
  isActive: boolean("is_active").default(true).notNull(),
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
  lastModified: timestamp("last_modified").defaultNow().notNull(),
  notes: text("notes"),
});

export type Exporter = typeof exporters.$inferSelect;
export type InsertExporter = typeof exporters.$inferInsert;

// Export Orders table for tracking export transactions
export const exportOrders = pgTable("export_orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).unique().notNull(),
  exporterId: integer("exporter_id").references(() => exporters.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  qualityGrade: varchar("quality_grade", { length: 50 }).notNull(),
  destinationCountry: varchar("destination_country", { length: 100 }).notNull(),
  destinationPort: varchar("destination_port", { length: 255 }).notNull(),
  shippingMethod: varchar("shipping_method", { length: 100 }).notNull(),
  expectedShipmentDate: timestamp("expected_shipment_date").notNull(),
  actualShipmentDate: timestamp("actual_shipment_date"),
  orderStatus: varchar("order_status", { length: 50 }).default("pending").notNull(), // pending, confirmed, shipped, delivered, cancelled
  lacraApprovalStatus: varchar("lacra_approval_status", { length: 50 }).default("pending").notNull(), // pending, approved, rejected
  lacraApprovalDate: timestamp("lacra_approval_date"),
  lacraOfficerId: integer("lacra_officer_id"),
  exportCertificateId: integer("export_certificate_id").references(() => certifications.id),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  notes: text("notes"),
});

export type ExportOrder = typeof exportOrders.$inferSelect;
export type InsertExportOrder = typeof exportOrders.$inferInsert;

// Schema validation for exporters and orders
export const insertExporterSchema = createInsertSchema(exporters).omit({
  id: true,
  registrationDate: true,
  lastModified: true,
});

export const insertExportOrderSchema = createInsertSchema(exportOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Farm Management Platform types
export type Farmer = typeof farmers.$inferSelect;
export type FarmPlot = typeof farmPlots.$inferSelect;
export type CropPlan = typeof cropPlanning.$inferSelect;
export type HarvestRecord = typeof harvestRecords.$inferSelect;



// Farm Management Platform insert types
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type InsertFarmPlot = z.infer<typeof insertFarmPlotSchema>;
export type InsertCropPlan = z.infer<typeof insertCropPlanSchema>;
export type InsertHarvestRecord = z.infer<typeof insertHarvestRecordSchema>;


// Authentication insert schemas
export const insertAuthUserSchema = createInsertSchema(authUsers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export const insertUserPermissionSchema = createInsertSchema(userPermissions).omit({
  id: true,
  grantedAt: true,
});

// Authentication types
export type AuthUser = typeof authUsers.$inferSelect;
export type UserSession = typeof userSessions.$inferSelect;
export type UserPermission = typeof userPermissions.$inferSelect;

export type InsertAuthUser = z.infer<typeof insertAuthUserSchema>;
export type InsertUserSession = z.infer<typeof insertUserSessionSchema>;
export type InsertUserPermission = z.infer<typeof insertUserPermissionSchema>;


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

// International Agricultural Standards Database Integration
export const internationalStandards = pgTable("international_standards", {
  id: serial("id").primaryKey(),
  standardId: text("standard_id").notNull().unique(),
  standardName: text("standard_name").notNull(),
  organizationName: text("organization_name").notNull(), // Fair Trade, Rainforest Alliance, UTZ, GlobalGAP, ISO, etc.
  standardType: text("standard_type").notNull(), // certification, sustainability, quality, organic, trade
  commodityTypes: text("commodity_types").array(), // cocoa, coffee, palm_oil, etc.
  requirementCategories: jsonb("requirement_categories"), // Environmental, Social, Economic, Quality
  complianceCriteria: jsonb("compliance_criteria"), // Detailed criteria structure
  auditFrequency: text("audit_frequency"), // annual, biannual, triennial
  validityPeriod: integer("validity_period"), // months
  standardVersion: text("standard_version").notNull(),
  effectiveDate: timestamp("effective_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  contactInfo: jsonb("contact_info"), // Organization contact details
  websiteUrl: text("website_url"),
  apiEndpoint: text("api_endpoint"), // For direct integration
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const commodityStandardsCompliance = pgTable("commodity_standards_compliance", {
  id: serial("id").primaryKey(),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  standardId: integer("standard_id").references(() => internationalStandards.id).notNull(),
  complianceId: text("compliance_id").notNull().unique(),
  complianceStatus: text("compliance_status").notNull(), // compliant, non_compliant, pending, under_review, suspended
  certificateNumber: text("certificate_number"),
  certificationDate: timestamp("certification_date"),
  expiryDate: timestamp("expiry_date"),
  auditDate: timestamp("audit_date"),
  auditorName: text("auditor_name"),
  auditorOrganization: text("auditor_organization"),
  complianceScore: decimal("compliance_score", { precision: 5, scale: 2 }), // 0-100
  requirementsMet: jsonb("requirements_met"), // Which requirements are satisfied
  nonComplianceIssues: jsonb("non_compliance_issues"), // Issues preventing compliance
  correctiveActions: jsonb("corrective_actions"), // Actions to achieve compliance
  nextAuditDate: timestamp("next_audit_date"),
  syncStatus: text("sync_status").default("pending"), // pending, synced, failed
  lastSyncDate: timestamp("last_sync_date"),
  documents: jsonb("documents"), // Supporting compliance documents
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const standardsApiIntegration = pgTable("standards_api_integration", {
  id: serial("id").primaryKey(),
  standardId: integer("standard_id").references(() => internationalStandards.id).notNull(),
  apiName: text("api_name").notNull(),
  apiUrl: text("api_url").notNull(),
  authMethod: text("auth_method"), // api_key, oauth2, basic_auth, certificate
  authConfig: jsonb("auth_config"), // Authentication configuration
  isActive: boolean("is_active").default(true),
  lastSyncDate: timestamp("last_sync_date"),
  syncFrequency: text("sync_frequency"), // daily, weekly, monthly, real_time
  errorCount: integer("error_count").default(0),
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const standardsSyncLog = pgTable("standards_sync_log", {
  id: serial("id").primaryKey(),
  apiIntegrationId: integer("api_integration_id").references(() => standardsApiIntegration.id).notNull(),
  syncType: text("sync_type").notNull(), // standards_update, compliance_check, certificate_validation
  entityId: integer("entity_id"), // commodity or farmer ID
  status: text("status").notNull(), // success, failed, partial
  recordsProcessed: integer("records_processed").default(0),
  recordsUpdated: integer("records_updated").default(0),
  recordsAdded: integer("records_added").default(0),
  requestPayload: text("request_payload"),
  responsePayload: text("response_payload"),
  errorMessage: text("error_message"),
  syncDuration: integer("sync_duration"), // milliseconds
  syncedBy: text("synced_by").notNull(),
  syncDate: timestamp("sync_date").defaultNow(),
});

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

// International Standards insert schemas
export const insertInternationalStandardSchema = createInsertSchema(internationalStandards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommodityStandardsComplianceSchema = createInsertSchema(commodityStandardsCompliance).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStandardsApiIntegrationSchema = createInsertSchema(standardsApiIntegration).omit({
  id: true,
  createdAt: true,
});

export const insertStandardsSyncLogSchema = createInsertSchema(standardsSyncLog).omit({
  id: true,
  syncDate: true,
});

// International Standards types
export type InternationalStandard = typeof internationalStandards.$inferSelect;
export type CommodityStandardsCompliance = typeof commodityStandardsCompliance.$inferSelect;
export type StandardsApiIntegration = typeof standardsApiIntegration.$inferSelect;
export type StandardsSyncLog = typeof standardsSyncLog.$inferSelect;

export type InsertInternationalStandard = z.infer<typeof insertInternationalStandardSchema>;
export type InsertCommodityStandardsCompliance = z.infer<typeof insertCommodityStandardsComplianceSchema>;
export type InsertStandardsApiIntegration = z.infer<typeof insertStandardsApiIntegrationSchema>;
export type InsertStandardsSyncLog = z.infer<typeof insertStandardsSyncLogSchema>;

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

// =============================================
// VERIFIABLE TRACKING SYSTEM TABLES
// =============================================

export const trackingRecords = pgTable("tracking_records", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  certificateId: integer("certificate_id").references(() => certifications.id).notNull(),
  commodityId: integer("commodity_id").references(() => commodities.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id),
  currentStatus: text("current_status").notNull().default("active"), // active, completed, suspended, cancelled
  
  // EUDR Compliance Information
  eudrCompliant: boolean("eudr_compliant").default(false),
  deforestationRisk: text("deforestation_risk"), // low, medium, high, critical
  sustainabilityScore: decimal("sustainability_score", { precision: 5, scale: 2 }),
  
  // Supply Chain Information
  supplyChainSteps: jsonb("supply_chain_steps"), // Array of supply chain checkpoints
  originCoordinates: text("origin_coordinates"), // GPS coordinates of origin
  currentLocation: text("current_location"),
  destinationCountry: text("destination_country"),
  
  // Verification Information
  qrCodeData: text("qr_code_data"),
  blockchainHash: text("blockchain_hash"), // Future blockchain integration
  digitalSignature: text("digital_signature"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trackingTimeline = pgTable("tracking_timeline", {
  id: serial("id").primaryKey(),
  trackingRecordId: integer("tracking_record_id").references(() => trackingRecords.id).notNull(),
  
  // Event Information
  eventType: text("event_type").notNull(), // created, inspected, certified, shipped, received, verified
  eventDescription: text("event_description").notNull(),
  eventLocation: text("event_location"),
  eventCoordinates: text("event_coordinates"),
  
  // Personnel Information
  performedBy: text("performed_by").notNull(),
  officerName: text("officer_name"),
  officerRole: text("officer_role"),
  department: text("department"),
  
  // Documentation
  documentReferences: jsonb("document_references"), // Related documents/certificates
  photoUrls: jsonb("photo_urls"), // Evidence photos
  notes: text("notes"),
  
  // Compliance Status
  complianceChecked: boolean("compliance_checked").default(false),
  complianceStatus: text("compliance_status"), // compliant, non_compliant, pending
  eudrVerified: boolean("eudr_verified").default(false),
  
  timestamp: timestamp("timestamp").defaultNow(),
});

export const trackingVerifications = pgTable("tracking_verifications", {
  id: serial("id").primaryKey(),
  trackingRecordId: integer("tracking_record_id").references(() => trackingRecords.id).notNull(),
  
  // Verification Details
  verificationType: text("verification_type").notNull(), // document, physical, gps, lab_test, third_party
  verificationMethod: text("verification_method").notNull(),
  verifiedBy: text("verified_by").notNull(),
  verificationDate: timestamp("verification_date").notNull(),
  
  // Results
  verificationResult: text("verification_result").notNull(), // passed, failed, inconclusive
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // Confidence percentage
  
  // EUDR Specific Verifications
  deforestationCheck: boolean("deforestation_check").default(false),
  legalityVerified: boolean("legality_verified").default(false),
  sustainabilityVerified: boolean("sustainability_verified").default(false),
  traceabilityVerified: boolean("traceability_verified").default(false),
  
  // Documentation
  verificationDocuments: jsonb("verification_documents"),
  evidenceUrls: jsonb("evidence_urls"),
  notes: text("notes"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const trackingAlerts = pgTable("tracking_alerts", {
  id: serial("id").primaryKey(),
  trackingRecordId: integer("tracking_record_id").references(() => trackingRecords.id).notNull(),
  
  // Alert Information
  alertType: text("alert_type").notNull(), // compliance, verification, timeline, location, document
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  message: text("message").notNull(),
  
  // Status
  status: text("status").notNull().default("active"), // active, acknowledged, resolved, dismissed
  acknowledgedBy: text("acknowledged_by"),
  acknowledgedDate: timestamp("acknowledged_date"),
  resolvedBy: text("resolved_by"),
  resolvedDate: timestamp("resolved_date"),
  
  // Action Required
  actionRequired: boolean("action_required").default(true),
  actionDeadline: timestamp("action_deadline"),
  actionTaken: text("action_taken"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const trackingReports = pgTable("tracking_reports", {
  id: serial("id").primaryKey(),
  trackingRecordId: integer("tracking_record_id").references(() => trackingRecords.id).notNull(),
  
  // Report Information
  reportType: text("report_type").notNull(), // compliance, verification, timeline, export, audit
  reportTitle: text("report_title").notNull(),
  reportPeriod: text("report_period"),
  
  // Generated Information
  generatedBy: text("generated_by").notNull(),
  generatedDate: timestamp("generated_date").defaultNow(),
  department: text("department"),
  
  // Content
  reportData: jsonb("report_data"),
  summary: text("summary"),
  recommendations: text("recommendations"),
  
  // Export Information
  fileUrl: text("file_url"),
  fileFormat: text("file_format"), // pdf, excel, json
  downloadCount: integer("download_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// =============================================
// INSERT SCHEMAS FOR TRACKING SYSTEM
// =============================================

export const insertTrackingRecordSchema = createInsertSchema(trackingRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrackingTimelineSchema = createInsertSchema(trackingTimeline).omit({
  id: true,
  timestamp: true,
});

export const insertTrackingVerificationSchema = createInsertSchema(trackingVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertTrackingAlertSchema = createInsertSchema(trackingAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertTrackingReportSchema = createInsertSchema(trackingReports).omit({
  id: true,
  createdAt: true,
});

// =============================================
// TRACKING SYSTEM TYPES
// =============================================

export type TrackingRecord = typeof trackingRecords.$inferSelect;
export type TrackingTimeline = typeof trackingTimeline.$inferSelect;
export type TrackingVerification = typeof trackingVerifications.$inferSelect;
export type TrackingAlert = typeof trackingAlerts.$inferSelect;
export type TrackingReport = typeof trackingReports.$inferSelect;

export type InsertTrackingRecord = z.infer<typeof insertTrackingRecordSchema>;
export type InsertTrackingTimeline = z.infer<typeof insertTrackingTimelineSchema>;
export type InsertTrackingVerification = z.infer<typeof insertTrackingVerificationSchema>;
export type InsertTrackingAlert = z.infer<typeof insertTrackingAlertSchema>;
export type InsertTrackingReport = z.infer<typeof insertTrackingReportSchema>;
