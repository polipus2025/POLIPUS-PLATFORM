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
  type: text("type").notNull(), // warning, error, success, info, mobile_request
  title: text("title").notNull(),
  message: text("message").notNull(),
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  isRead: boolean("is_read").default(false),
  relatedEntity: text("related_entity"),
  relatedEntityId: integer("related_entity_id"),
  source: text("source").default("system"), // system, mobile_app, field_agent, web
  requestData: text("request_data"), // JSON string for mobile app requests
  submittedBy: text("submitted_by"), // who submitted the request
  verifiedBy: text("verified_by"), // compliance officer who verified
  verifiedAt: timestamp("verified_at"),
  status: text("status").default("pending"), // pending, verified, rejected, processed
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Super Backend Administrative Control System
export const systemConfigurations = pgTable("system_configurations", {
  id: serial("id").primaryKey(),
  configKey: text("config_key").notNull().unique(),
  configValue: text("config_value").notNull(),
  configType: text("config_type").notNull(), // string, number, boolean, json, array
  category: text("category").notNull(), // security, features, integrations, monitoring, ui
  description: text("description"),
  isActive: boolean("is_active").default(true),
  modifiedBy: text("modified_by").notNull(),
  modifiedAt: timestamp("modified_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const realTimeControls = pgTable("real_time_controls", {
  id: serial("id").primaryKey(),
  controlType: text("control_type").notNull(), // feature_toggle, access_control, maintenance, rate_limit
  targetEntity: text("target_entity").notNull(), // user, role, ip, api_endpoint, feature
  targetValue: text("target_value").notNull(),
  action: text("action").notNull(), // enable, disable, block, allow, throttle
  parameters: jsonb("parameters"), // JSON configuration for the control
  isActive: boolean("is_active").default(true),
  priority: integer("priority").default(1), // execution order
  appliedBy: text("applied_by").notNull(),
  appliedAt: timestamp("applied_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const backendMonitoring = pgTable("backend_monitoring", {
  id: serial("id").primaryKey(),
  serviceType: text("service_type").notNull(), // api, database, authentication, file_system, external_api
  serviceName: text("service_name").notNull(),
  status: text("status").notNull(), // healthy, warning, error, critical
  responseTime: decimal("response_time", { precision: 10, scale: 2 }), // milliseconds
  errorCount: integer("error_count").default(0),
  successCount: integer("success_count").default(0),
  cpuUsage: decimal("cpu_usage", { precision: 5, scale: 2 }), // percentage
  memoryUsage: decimal("memory_usage", { precision: 10, scale: 2 }), // MB
  diskUsage: decimal("disk_usage", { precision: 10, scale: 2 }), // MB
  activeConnections: integer("active_connections").default(0),
  lastHealthCheck: timestamp("last_health_check").defaultNow(),
  errorDetails: text("error_details"),
  performanceMetrics: jsonb("performance_metrics"),
  checkedAt: timestamp("checked_at").defaultNow(),
});

export const systemOperations = pgTable("system_operations", {
  id: serial("id").primaryKey(),
  operationType: text("operation_type").notNull(), // deploy, backup, restore, update, restart, maintenance
  operationName: text("operation_name").notNull(),
  status: text("status").notNull(), // pending, running, completed, failed, cancelled
  progress: integer("progress").default(0), // percentage
  initiatedBy: text("initiated_by").notNull(),
  targetEnvironment: text("target_environment").notNull(), // development, staging, production
  parameters: jsonb("parameters"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  duration: integer("duration"), // seconds
  logs: text("logs"),
  errorMessage: text("error_message"),
  rollbackRequired: boolean("rollback_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  flagName: text("flag_name").notNull().unique(),
  description: text("description"),
  isEnabled: boolean("is_enabled").default(false),
  rolloutPercentage: integer("rollout_percentage").default(0), // 0-100
  targetRoles: text("target_roles"), // comma separated roles
  targetUsers: text("target_users"), // comma separated user ids
  conditions: jsonb("conditions"), // complex conditions for flag activation
  category: text("category").notNull(), // ui, api, security, integration
  modifiedBy: text("modified_by").notNull(),
  modifiedAt: timestamp("modified_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accessControlMatrix = pgTable("access_control_matrix", {
  id: serial("id").primaryKey(),
  resourceType: text("resource_type").notNull(), // api_endpoint, page, feature, data_table
  resourcePath: text("resource_path").notNull(),
  roleRequired: text("role_required").notNull(),
  permissionLevel: text("permission_level").notNull(), // read, write, delete, admin
  ipRestrictions: text("ip_restrictions"), // comma separated IPs or CIDR blocks
  timeRestrictions: text("time_restrictions"), // business hours, specific times
  geographicRestrictions: text("geographic_restrictions"), // country codes
  isActive: boolean("is_active").default(true),
  appliedBy: text("applied_by").notNull(),
  appliedAt: timestamp("applied_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyControls = pgTable("emergency_controls", {
  id: serial("id").primaryKey(),
  controlName: text("control_name").notNull(),
  triggerCondition: text("trigger_condition").notNull(), // high_error_rate, security_breach, system_overload
  autoTrigger: boolean("auto_trigger").default(false),
  actions: jsonb("actions"), // array of actions to take
  isActive: boolean("is_active").default(true),
  lastTriggered: timestamp("last_triggered"),
  triggerCount: integer("trigger_count").default(0),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const performanceMetrics = pgTable("performance_metrics", {
  id: serial("id").primaryKey(),
  metricType: text("metric_type").notNull(), // response_time, error_rate, throughput, user_activity
  metricName: text("metric_name").notNull(),
  value: decimal("value", { precision: 15, scale: 4 }).notNull(),
  unit: text("unit").notNull(), // ms, percentage, requests_per_second, count
  tags: jsonb("tags"), // additional metadata
  timestamp: timestamp("timestamp").defaultNow(),
  aggregationPeriod: text("aggregation_period").notNull(), // minute, hour, day
});

// Inspector Mobile Device Tracking System
export const inspectorDevices = pgTable("inspector_devices", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull().unique(),
  inspectorId: text("inspector_id").notNull(),
  inspectorName: text("inspector_name").notNull(),
  deviceModel: text("device_model"),
  deviceBrand: text("device_brand"),
  osVersion: text("os_version"),
  appVersion: text("app_version"),
  phoneNumber: text("phone_number"),
  imei: text("imei"),
  isActive: boolean("is_active").default(true),
  lastSeen: timestamp("last_seen").defaultNow(),
  registeredAt: timestamp("registered_at").defaultNow(),
  batteryLevel: integer("battery_level"), // 0-100 percentage
  networkStatus: text("network_status").default("unknown"), // online, offline, poor, good, excellent
  gpsEnabled: boolean("gps_enabled").default(false),
  locationPermission: boolean("location_permission").default(false),
  notificationsEnabled: boolean("notifications_enabled").default(true),
});

export const inspectorLocationHistory = pgTable("inspector_location_history", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").references(() => inspectorDevices.deviceId).notNull(),
  inspectorId: text("inspector_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accuracy: decimal("accuracy", { precision: 8, scale: 2 }), // GPS accuracy in meters
  altitude: decimal("altitude", { precision: 8, scale: 2 }),
  speed: decimal("speed", { precision: 6, scale: 2 }), // km/h
  heading: decimal("heading", { precision: 6, scale: 2 }), // degrees
  timestamp: timestamp("timestamp").defaultNow(),
  activity: text("activity"), // inspection, travel, break, offline
  batteryLevel: integer("battery_level"),
  signalStrength: integer("signal_strength"), // 0-5 bars
  inspectionId: integer("inspection_id"), // linked to specific inspection if applicable
});

export const inspectorDeviceAlerts = pgTable("inspector_device_alerts", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").references(() => inspectorDevices.deviceId).notNull(),
  inspectorId: text("inspector_id").notNull(),
  alertType: text("alert_type").notNull(), // low_battery, offline, location_disabled, emergency, sos
  severity: text("severity").notNull().default("medium"), // low, medium, high, critical
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  triggeredAt: timestamp("triggered_at").defaultNow(),
  metadata: jsonb("metadata"), // additional alert data
});

export const inspectorCheckIns = pgTable("inspector_check_ins", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").references(() => inspectorDevices.deviceId).notNull(),
  inspectorId: text("inspector_id").notNull(),
  checkInType: text("check_in_type").notNull(), // start_shift, end_shift, inspection_start, inspection_complete, break, emergency
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  accuracy: decimal("accuracy", { precision: 8, scale: 2 }),
  notes: text("notes"),
  inspectionId: integer("inspection_id"),
  commodityId: integer("commodity_id"),
  timestamp: timestamp("timestamp").defaultNow(),
  batteryLevel: integer("battery_level"),
  photoEvidence: text("photo_evidence"), // base64 or URL
  isVerified: boolean("is_verified").default(false),
  verifiedBy: text("verified_by"),
});

export const backendLogs = pgTable("backend_logs", {
  id: serial("id").primaryKey(),
  logLevel: text("log_level").notNull(), // debug, info, warn, error, critical
  service: text("service").notNull(),
  message: text("message").notNull(),
  metadata: jsonb("metadata"),
  userId: text("user_id"),
  sessionId: text("session_id"),
  requestId: text("request_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  stackTrace: text("stack_trace"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Regulatory Authority Department Schema - Three-Tier System
export const regulatoryDepartments = pgTable("regulatory_departments", {
  id: serial("id").primaryKey(),
  regulatorId: text("regulator_id").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  departmentLevel: text("department_level").notNull(), // dg, ddgots, ddgaf
  departmentName: text("department_name").notNull(),
  accessLevel: text("access_level").notNull(), // executive, operations, finance
  position: text("position").notNull(),
  permissions: jsonb("permissions").default("{}"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  mustChangePassword: boolean("must_change_password").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Super Backend Schema Types
export type SystemConfiguration = typeof systemConfigurations.$inferSelect;
export type InsertSystemConfiguration = typeof systemConfigurations.$inferInsert;

export type RealTimeControl = typeof realTimeControls.$inferSelect;
export type InsertRealTimeControl = typeof realTimeControls.$inferInsert;

export type BackendMonitoring = typeof backendMonitoring.$inferSelect;
export type InsertBackendMonitoring = typeof backendMonitoring.$inferInsert;

export type SystemOperation = typeof systemOperations.$inferSelect;
export type InsertSystemOperation = typeof systemOperations.$inferInsert;

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type InsertFeatureFlag = typeof featureFlags.$inferInsert;

export type AccessControlMatrix = typeof accessControlMatrix.$inferSelect;
export type InsertAccessControlMatrix = typeof accessControlMatrix.$inferInsert;

export type EmergencyControl = typeof emergencyControls.$inferSelect;
export type InsertEmergencyControl = typeof emergencyControls.$inferInsert;

export type PerformanceMetric = typeof performanceMetrics.$inferSelect;
export type InsertPerformanceMetric = typeof performanceMetrics.$inferInsert;

export type BackendLog = typeof backendLogs.$inferSelect;
export type InsertBackendLog = typeof backendLogs.$inferInsert;

// Regulatory Department Types
export type RegulatoryDepartment = typeof regulatoryDepartments.$inferSelect;
export type InsertRegulatoryDepartment = typeof regulatoryDepartments.$inferInsert;

// Inspector Mobile Device Tracking Types
export type InspectorDevice = typeof inspectorDevices.$inferSelect;
export type InsertInspectorDevice = typeof inspectorDevices.$inferInsert;

export type InspectorLocationHistory = typeof inspectorLocationHistory.$inferSelect;
export type InsertInspectorLocationHistory = typeof inspectorLocationHistory.$inferInsert;

export type InspectorDeviceAlert = typeof inspectorDeviceAlerts.$inferSelect;
export type InsertInspectorDeviceAlert = typeof inspectorDeviceAlerts.$inferInsert;

export type InspectorCheckIn = typeof inspectorCheckIns.$inferSelect;
export type InsertInspectorCheckIn = typeof inspectorCheckIns.$inferInsert;

// Inspector Mobile Device Schemas
export const insertInspectorDeviceSchema = createInsertSchema(inspectorDevices).omit({
  id: true,
  lastSeen: true,
  registeredAt: true,
});

export const insertInspectorLocationHistorySchema = createInsertSchema(inspectorLocationHistory).omit({
  id: true,
  timestamp: true,
});

export const insertInspectorDeviceAlertSchema = createInsertSchema(inspectorDeviceAlerts).omit({
  id: true,
  triggeredAt: true,
});

export const insertInspectorCheckInSchema = createInsertSchema(inspectorCheckIns).omit({
  id: true,
  timestamp: true,
});

// ========================================
// POLIPUS 7 MODULES DATABASE SCHEMAS
// ========================================

// MODULE 2: LIVE TRACE - Livestock Movement Monitoring
export const livestock = pgTable("livestock", {
  id: serial("id").primaryKey(),
  animalId: text("animal_id").notNull().unique(),
  species: text("species").notNull(), // cattle, goat, sheep, pig, chicken
  breed: text("breed"),
  ownerId: text("owner_id").notNull(),
  ownerName: text("owner_name").notNull(),
  county: text("county").notNull(),
  district: text("district"),
  village: text("village"),
  currentLocation: text("current_location"), // GPS coordinates
  movementStatus: text("movement_status").default("stationary"), // stationary, moving, quarantined, restricted
  healthStatus: text("health_status").default("healthy"), // healthy, sick, vaccinated, under_treatment
  lastVaccination: timestamp("last_vaccination"),
  nextVaccination: timestamp("next_vaccination"),
  quarantineStatus: boolean("quarantine_status").default(false),
  quarantineReason: text("quarantine_reason"),
  quarantineEndDate: timestamp("quarantine_end_date"),
  gpsTrackingEnabled: boolean("gps_tracking_enabled").default(true),
  alertsEnabled: boolean("alerts_enabled").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const livestockMovements = pgTable("livestock_movements", {
  id: serial("id").primaryKey(),
  animalId: text("animal_id").references(() => livestock.animalId).notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  movementDate: timestamp("movement_date").notNull(),
  movementReason: text("movement_reason").notNull(), // grazing, sale, veterinary, breeding
  permitRequired: boolean("permit_required").default(false),
  permitNumber: text("permit_number"),
  transporterId: text("transporter_id"),
  transporterName: text("transporter_name"),
  distance: decimal("distance", { precision: 10, scale: 2 }), // kilometers
  duration: integer("duration"), // minutes
  status: text("status").default("pending"), // pending, approved, in_transit, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const livestockAlerts = pgTable("livestock_alerts", {
  id: serial("id").primaryKey(),
  animalId: text("animal_id").references(() => livestock.animalId).notNull(),
  alertType: text("alert_type").notNull(), // health, movement, quarantine, vaccination_due, unusual_activity
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  isRead: boolean("is_read").default(false),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
});

// MODULE 3: LAND MAP360 - Land Mapping & Dispute Prevention
export const landParcels = pgTable("land_parcels", {
  id: serial("id").primaryKey(),
  parcelId: text("parcel_id").notNull().unique(),
  title: text("title").notNull(),
  ownerId: text("owner_id").notNull(),
  ownerName: text("owner_name").notNull(),
  ownerType: text("owner_type").notNull(), // individual, family, community, government, organization
  county: text("county").notNull(),
  district: text("district"),
  village: text("village"),
  landUse: text("land_use").notNull(), // residential, agricultural, commercial, forest, mining, water
  area: decimal("area", { precision: 12, scale: 4 }).notNull(), // hectares
  boundaries: jsonb("boundaries").notNull(), // GPS boundary coordinates
  registrationStatus: text("registration_status").default("pending"), // pending, registered, disputed, suspended
  registrationDate: timestamp("registration_date"),
  lastSurveyDate: timestamp("last_survey_date"),
  surveyorId: text("surveyor_id"),
  disputes: jsonb("disputes"), // array of dispute records
  encroachments: jsonb("encroachments"), // detected encroachments
  legalDocuments: jsonb("legal_documents"), // array of legal document references
  taxStatus: text("tax_status").default("current"), // current, overdue, exempt
  marketValue: decimal("market_value", { precision: 15, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const landDisputes = pgTable("land_disputes", {
  id: serial("id").primaryKey(),
  disputeId: text("dispute_id").notNull().unique(),
  parcelId: text("parcel_id").references(() => landParcels.parcelId).notNull(),
  disputeType: text("dispute_type").notNull(), // boundary, ownership, inheritance, encroachment, usage_rights
  claimantId: text("claimant_id").notNull(),
  claimantName: text("claimant_name").notNull(),
  defendantId: text("defendant_id").notNull(),
  defendantName: text("defendant_name").notNull(),
  description: text("description").notNull(),
  evidence: jsonb("evidence"), // photos, documents, witness statements
  mediatorId: text("mediator_id"),
  mediatorName: text("mediator_name"),
  status: text("status").default("submitted"), // submitted, under_review, mediation, resolved, court_referral
  priority: text("priority").default("medium"), // low, medium, high, urgent
  submittedDate: timestamp("submitted_date").defaultNow(),
  resolutionDate: timestamp("resolution_date"),
  resolution: text("resolution"),
  appealDeadline: timestamp("appeal_deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const surveyRecords = pgTable("survey_records", {
  id: serial("id").primaryKey(),
  surveyId: text("survey_id").notNull().unique(),
  parcelId: text("parcel_id").references(() => landParcels.parcelId).notNull(),
  surveyorId: text("surveyor_id").notNull(),
  surveyorName: text("surveyor_name").notNull(),
  surveyDate: timestamp("survey_date").notNull(),
  surveyType: text("survey_type").notNull(), // initial, re_survey, dispute_resolution, boundary_clarification
  equipment: text("equipment"), // GPS, drone, traditional_survey
  accuracy: text("accuracy"), // high, medium, low
  boundaryPoints: jsonb("boundary_points").notNull(),
  areaCalculated: decimal("area_calculated", { precision: 12, scale: 4 }),
  discrepancies: text("discrepancies"),
  recommendations: text("recommendations"),
  photos: jsonb("photos"), // survey photos
  status: text("status").default("completed"), // pending, completed, verified, rejected
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// MODULE 4: MINE WATCH - Mineral Resource Protection
export const miningOperations = pgTable("mining_operations", {
  id: serial("id").primaryKey(),
  operationId: text("operation_id").notNull().unique(),
  operatorName: text("operator_name").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  mineralType: text("mineral_type").notNull(), // gold, diamond, iron_ore, bauxite, rutile
  county: text("county").notNull(),
  district: text("district"),
  operationArea: jsonb("operation_area").notNull(), // GPS boundaries
  areaSize: decimal("area_size", { precision: 10, scale: 2 }), // hectares
  licenseType: text("license_type").notNull(), // exploration, mining, small_scale, large_scale
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  status: text("status").default("active"), // active, suspended, expired, revoked, pending_renewal
  employeeCount: integer("employee_count"),
  communityAgreement: boolean("community_agreement").default(false),
  environmentalImpact: text("environmental_impact"), // low, medium, high, severe
  rehabilitationPlan: text("rehabilitation_plan"),
  safetyRecord: jsonb("safety_record"),
  productionData: jsonb("production_data"),
  compliance: jsonb("compliance"), // regulatory compliance tracking
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communityImpacts = pgTable("community_impacts", {
  id: serial("id").primaryKey(),
  impactId: text("impact_id").notNull().unique(),
  operationId: text("operation_id").references(() => miningOperations.operationId).notNull(),
  communityName: text("community_name").notNull(),
  impactType: text("impact_type").notNull(), // displacement, water_contamination, noise, dust, traffic, employment
  severity: text("severity").notNull(), // minimal, moderate, significant, severe
  affectedPopulation: integer("affected_population"),
  description: text("description").notNull(),
  mitigationMeasures: text("mitigation_measures"),
  compensationProvided: boolean("compensation_provided").default(false),
  compensationAmount: decimal("compensation_amount", { precision: 12, scale: 2 }),
  status: text("status").default("identified"), // identified, assessed, mitigated, resolved, ongoing
  reportedBy: text("reported_by"),
  reportedDate: timestamp("reported_date").defaultNow(),
  resolutionDate: timestamp("resolution_date"),
  followUpRequired: boolean("follow_up_required").default(false),
  nextReviewDate: timestamp("next_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const miningInspections = pgTable("mining_inspections", {
  id: serial("id").primaryKey(),
  inspectionId: text("inspection_id").notNull().unique(),
  operationId: text("operation_id").references(() => miningOperations.operationId).notNull(),
  inspectorId: text("inspector_id").notNull(),
  inspectorName: text("inspector_name").notNull(),
  inspectionDate: timestamp("inspection_date").notNull(),
  inspectionType: text("inspection_type").notNull(), // routine, complaint_based, compliance, safety, environmental
  findings: text("findings").notNull(),
  violations: jsonb("violations"), // array of violations found
  recommendations: text("recommendations"),
  correctionDeadline: timestamp("correction_deadline"),
  followUpRequired: boolean("follow_up_required").default(false),
  nextInspectionDate: timestamp("next_inspection_date"),
  complianceScore: integer("compliance_score"), // 0-100
  photos: jsonb("photos"),
  status: text("status").default("completed"), // scheduled, in_progress, completed, follow_up_required
  createdAt: timestamp("created_at").defaultNow(),
});

// MODULE 5: FOREST GUARD - Forest Protection & Carbon Credits
export const forestAreas = pgTable("forest_areas", {
  id: serial("id").primaryKey(),
  forestId: text("forest_id").notNull().unique(),
  name: text("name").notNull(),
  forestType: text("forest_type").notNull(), // primary, secondary, plantation, mangrove, gallery
  county: text("county").notNull(),
  district: text("district"),
  boundaries: jsonb("boundaries").notNull(), // GPS coordinates
  totalArea: decimal("total_area", { precision: 10, scale: 2 }).notNull(), // hectares
  protectedArea: decimal("protected_area", { precision: 10, scale: 2 }), // hectares
  conservationStatus: text("conservation_status").notNull(), // protected, managed, unrestricted, degraded
  biodiversityIndex: decimal("biodiversity_index", { precision: 5, scale: 2 }),
  carbonStock: decimal("carbon_stock", { precision: 12, scale: 2 }), // tonnes
  lastSurveyDate: timestamp("last_survey_date"),
  deforestationRisk: text("deforestation_risk").default("low"), // low, medium, high, critical
  managementPlan: text("management_plan"),
  communityInvolvement: boolean("community_involvement").default(false),
  touristActivities: boolean("tourist_activities").default(false),
  research: boolean("research_activities").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const deforestationAlerts = pgTable("deforestation_alerts", {
  id: serial("id").primaryKey(),
  alertId: text("alert_id").notNull().unique(),
  forestId: text("forest_id").references(() => forestAreas.forestId).notNull(),
  detectionDate: timestamp("detection_date").defaultNow(),
  location: text("location").notNull(), // GPS coordinates
  areaAffected: decimal("area_affected", { precision: 8, scale: 4 }), // hectares
  severity: text("severity").notNull(), // low, medium, high, critical
  cause: text("cause"), // logging, agriculture, mining, infrastructure, fire, natural
  alertSource: text("alert_source").notNull(), // satellite, field_patrol, community_report, drone_survey
  isVerified: boolean("is_verified").default(false),
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  actionTaken: text("action_taken"),
  status: text("status").default("pending"), // pending, verified, false_positive, action_taken, resolved
  photos: jsonb("photos"),
  priority: text("priority").default("medium"), // low, medium, high, urgent
  estimatedLoss: decimal("estimated_loss", { precision: 10, scale: 2 }), // USD value
  createdAt: timestamp("created_at").defaultNow(),
});

export const carbonCredits = pgTable("carbon_credits", {
  id: serial("id").primaryKey(),
  creditId: text("credit_id").notNull().unique(),
  forestId: text("forest_id").references(() => forestAreas.forestId).notNull(),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(), // conservation, reforestation, sustainable_management, agroforestry
  creditsGenerated: decimal("credits_generated", { precision: 10, scale: 2 }), // tonnes CO2
  verificationStandard: text("verification_standard"), // VCS, Gold_Standard, CDM, Plan_Vivo
  issuanceDate: timestamp("issuance_date").notNull(),
  expiryDate: timestamp("expiry_date"),
  pricePerCredit: decimal("price_per_credit", { precision: 8, scale: 2 }), // USD
  status: text("status").default("issued"), // issued, sold, retired, expired, pending_verification
  buyerId: text("buyer_id"),
  buyerName: text("buyer_name"),
  saleDate: timestamp("sale_date"),
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }), // USD
  verification: jsonb("verification"), // verification documents and details
  biodiversityBenefits: text("biodiversity_benefits"),
  communityBenefits: text("community_benefits"),
  createdAt: timestamp("created_at").defaultNow(),
});

// MODULE 6: AQUA TRACE - Ocean & River Monitoring
export const waterBodies = pgTable("water_bodies", {
  id: serial("id").primaryKey(),
  waterId: text("water_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // ocean, river, lake, stream, wetland, coastal
  county: text("county").notNull(),
  district: text("district"),
  coordinates: jsonb("coordinates").notNull(), // GPS boundary/area
  size: decimal("size", { precision: 12, scale: 4 }), // square kilometers
  depth: decimal("average_depth", { precision: 8, scale: 2 }), // meters
  salinity: text("salinity"), // fresh, brackish, salt
  protectionStatus: text("protection_status").default("unprotected"), // protected, managed, unprotected, restricted
  fishingRights: jsonb("fishing_rights"), // permitted fishing activities
  qualityStatus: text("quality_status").default("good"), // excellent, good, fair, poor, polluted
  lastQualityAssessment: timestamp("last_quality_assessment"),
  biodiversityIndex: decimal("biodiversity_index", { precision: 5, scale: 2 }),
  touristActivities: boolean("tourist_activities").default(false),
  commercialUse: boolean("commercial_use").default(false),
  communityAccess: boolean("community_access").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const waterQualityMonitoring = pgTable("water_quality_monitoring", {
  id: serial("id").primaryKey(),
  monitoringId: text("monitoring_id").notNull().unique(),
  waterId: text("water_id").references(() => waterBodies.waterId).notNull(),
  measurementDate: timestamp("measurement_date").notNull(),
  location: text("location").notNull(), // specific GPS point
  pH: decimal("ph", { precision: 4, scale: 2 }),
  dissolvedOxygen: decimal("dissolved_oxygen", { precision: 6, scale: 2 }), // mg/L
  temperature: decimal("temperature", { precision: 5, scale: 2 }), // Celsius
  turbidity: decimal("turbidity", { precision: 8, scale: 2 }), // NTU
  salinity: decimal("salinity", { precision: 6, scale: 2 }), // ppt
  nitrates: decimal("nitrates", { precision: 8, scale: 4 }), // mg/L
  phosphates: decimal("phosphates", { precision: 8, scale: 4 }), // mg/L
  bacteria: decimal("bacteria", { precision: 10, scale: 2 }), // CFU/100ml
  heavyMetals: jsonb("heavy_metals"), // various metal concentrations
  pollutants: jsonb("pollutants"), // detected pollutants
  overallQuality: text("overall_quality").notNull(), // excellent, good, fair, poor, dangerous
  monitoredBy: text("monitored_by").notNull(),
  equipment: text("equipment"),
  weather: text("weather_conditions"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fishingPermits = pgTable("fishing_permits", {
  id: serial("id").primaryKey(),
  permitId: text("permit_id").notNull().unique(),
  waterId: text("water_id").references(() => waterBodies.waterId).notNull(),
  fisherName: text("fisher_name").notNull(),
  fisherId: text("fisher_id").notNull(),
  permitType: text("permit_type").notNull(), // subsistence, commercial, tourist, research
  fishingMethod: text("fishing_method").notNull(), // net, line, trap, trawl
  speciesPermitted: jsonb("species_permitted"), // allowed fish species
  quotaLimits: jsonb("quota_limits"), // catch limits per species
  seasonRestrictions: text("season_restrictions"),
  areaRestrictions: jsonb("area_restrictions"), // specific zones
  issueDate: timestamp("issue_date").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  fee: decimal("fee", { precision: 8, scale: 2 }),
  status: text("status").default("active"), // active, suspended, expired, revoked, pending_renewal
  violations: jsonb("violations"), // recorded violations
  renewalEligible: boolean("renewal_eligible").default(true),
  conditions: text("conditions"), // special conditions
  createdAt: timestamp("created_at").defaultNow(),
});

export const pollutionReports = pgTable("pollution_reports", {
  id: serial("id").primaryKey(),
  reportId: text("report_id").notNull().unique(),
  waterId: text("water_id").references(() => waterBodies.waterId).notNull(),
  reportType: text("report_type").notNull(), // spill, discharge, contamination, fish_kill, algae_bloom
  location: text("location").notNull(), // GPS coordinates
  reportedBy: text("reported_by").notNull(),
  reportDate: timestamp("report_date").defaultNow(),
  pollutionSource: text("pollution_source"), // industrial, agricultural, domestic, mining, ship, unknown
  severity: text("severity").notNull(), // minor, moderate, major, catastrophic
  description: text("description").notNull(),
  estimatedArea: decimal("estimated_area", { precision: 10, scale: 4 }), // square kilometers
  species_affected: jsonb("species_affected"),
  photos: jsonb("photos"),
  samples: jsonb("samples"), // water/tissue samples taken
  immediateAction: text("immediate_action"),
  investigationStatus: text("investigation_status").default("pending"), // pending, investigating, completed, closed
  remediation: text("remediation"),
  responsible_party: text("responsible_party"),
  penalties: decimal("penalties", { precision: 12, scale: 2 }), // USD
  status: text("status").default("open"), // open, investigating, resolved, closed
  createdAt: timestamp("created_at").defaultNow(),
});

// MODULE 7: BLUE CARBON 360 - Conservation Economics
export const conservationProjects = pgTable("conservation_projects", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  name: text("name").notNull(),
  projectType: text("project_type").notNull(), // marine_protected_area, wetland_restoration, mangrove_conservation, sustainable_fishing
  location: text("location").notNull(),
  county: text("county").notNull(),
  coordinates: jsonb("coordinates").notNull(),
  area: decimal("area", { precision: 10, scale: 2 }), // hectares
  ecosystem: text("ecosystem").notNull(), // mangrove, coral_reef, seagrass, salt_marsh, wetland
  startDate: timestamp("start_date").notNull(),
  plannedDuration: integer("planned_duration"), // months
  currentPhase: text("current_phase").default("planning"), // planning, implementation, monitoring, completed
  leadOrganization: text("lead_organization").notNull(),
  partners: jsonb("partners"), // array of partner organizations
  totalBudget: decimal("total_budget", { precision: 15, scale: 2 }), // USD
  fundingSources: jsonb("funding_sources"),
  carbonSequestration: decimal("carbon_sequestration", { precision: 12, scale: 2 }), // tonnes CO2/year
  biodiversityImpact: text("biodiversity_impact"),
  communityBenefits: jsonb("community_benefits"),
  economicImpact: decimal("economic_impact", { precision: 12, scale: 2 }), // USD annual value
  jobsCreated: integer("jobs_created"),
  status: text("status").default("active"), // active, completed, suspended, cancelled
  monitoring: jsonb("monitoring"), // monitoring protocols and schedules
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const carbonMarketplace = pgTable("carbon_marketplace", {
  id: serial("id").primaryKey(),
  listingId: text("listing_id").notNull().unique(),
  projectId: text("project_id").references(() => conservationProjects.projectId).notNull(),
  creditType: text("credit_type").notNull(), // blue_carbon, reforestation, renewable_energy, conservation
  quantity: decimal("quantity", { precision: 10, scale: 2 }), // tonnes CO2
  pricePerCredit: decimal("price_per_credit", { precision: 8, scale: 2 }), // USD
  totalValue: decimal("total_value", { precision: 12, scale: 2 }), // USD
  listingDate: timestamp("listing_date").defaultNow(),
  sellerId: text("seller_id").notNull(),
  sellerName: text("seller_name").notNull(),
  buyerId: text("buyer_id"),
  buyerName: text("buyer_name"),
  transactionDate: timestamp("transaction_date"),
  verificationStandard: text("verification_standard"), // VCS, Gold_Standard, Plan_Vivo
  vintage: integer("vintage"), // year credits were generated
  additionalBenefits: jsonb("additional_benefits"), // biodiversity, community, sdg
  status: text("status").default("available"), // available, pending, sold, retired, cancelled
  commission: decimal("commission", { precision: 8, scale: 2 }), // marketplace commission percentage
  fees: decimal("fees", { precision: 8, scale: 2 }), // USD
  certificates: jsonb("certificates"), // verification certificates
  createdAt: timestamp("created_at").defaultNow(),
});

export const economicImpactTracking = pgTable("economic_impact_tracking", {
  id: serial("id").primaryKey(),
  trackingId: text("tracking_id").notNull().unique(),
  projectId: text("project_id").references(() => conservationProjects.projectId).notNull(),
  measurementDate: timestamp("measurement_date").notNull(),
  metricType: text("metric_type").notNull(), // revenue, employment, tourism, fisheries, carbon_sales
  value: decimal("value", { precision: 15, scale: 2 }), // USD or numerical value
  unit: text("unit").notNull(), // USD, jobs, visitors, tonnes, percentage
  beneficiaryType: text("beneficiary_type").notNull(), // local_community, government, private_sector, environment
  directImpact: decimal("direct_impact", { precision: 12, scale: 2 }), // USD
  indirectImpact: decimal("indirect_impact", { precision: 12, scale: 2 }), // USD
  multiplierEffect: decimal("multiplier_effect", { precision: 5, scale: 2 }), // economic multiplier
  sustainabilityScore: integer("sustainability_score"), // 0-100
  roi: decimal("roi", { precision: 8, scale: 4 }), // return on investment percentage
  breakEvenDate: timestamp("break_even_date"),
  measuredBy: text("measured_by").notNull(),
  methodology: text("methodology"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// MODULE 8: CARBON TRACE - Environmental Monitoring
export const emissionSources = pgTable("emission_sources", {
  id: serial("id").primaryKey(),
  sourceId: text("source_id").notNull().unique(),
  name: text("name").notNull(),
  sourceType: text("source_type").notNull(), // industrial, transportation, agriculture, energy, waste, deforestation
  sector: text("sector").notNull(), // manufacturing, transport, power, mining, agriculture, forestry
  location: text("location").notNull(), // GPS coordinates
  county: text("county").notNull(),
  district: text("district"),
  operatorName: text("operator_name").notNull(),
  licenseNumber: text("license_number"),
  capacity: decimal("capacity", { precision: 12, scale: 2 }), // operational capacity
  capacityUnit: text("capacity_unit"), // MW, tonnes/day, vehicles/day
  emissionTypes: jsonb("emission_types"), // CO2, CH4, N2O, other GHGs
  baselineEmissions: decimal("baseline_emissions", { precision: 12, scale: 2 }), // tonnes CO2eq/year
  currentEmissions: decimal("current_emissions", { precision: 12, scale: 2 }), // tonnes CO2eq/year
  reductionTarget: decimal("reduction_target", { precision: 8, scale: 2 }), // percentage
  targetDate: timestamp("target_date"),
  mitigationMeasures: jsonb("mitigation_measures"),
  monitoring: jsonb("monitoring"), // monitoring equipment and protocols
  reportingFrequency: text("reporting_frequency"), // daily, weekly, monthly, quarterly, annually
  lastReported: timestamp("last_reported"),
  status: text("status").default("active"), // active, inactive, under_construction, decommissioned
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const emissionMeasurements = pgTable("emission_measurements", {
  id: serial("id").primaryKey(),
  measurementId: text("measurement_id").notNull().unique(),
  sourceId: text("source_id").references(() => emissionSources.sourceId).notNull(),
  measurementDate: timestamp("measurement_date").notNull(),
  co2: decimal("co2", { precision: 12, scale: 4 }), // tonnes
  methane: decimal("methane", { precision: 12, scale: 4 }), // tonnes
  nitrousOxide: decimal("nitrous_oxide", { precision: 12, scale: 4 }), // tonnes
  otherGHGs: jsonb("other_ghgs"), // other greenhouse gases
  totalCO2Equivalent: decimal("total_co2_equivalent", { precision: 12, scale: 4 }), // tonnes CO2eq
  measurementMethod: text("measurement_method").notNull(), // direct_measurement, calculation, estimation, remote_sensing
  equipment: text("equipment"),
  accuracy: text("accuracy"), // high, medium, low
  weather: text("weather_conditions"),
  operationalData: jsonb("operational_data"), // production levels, fuel consumption, etc.
  qualityAssurance: boolean("quality_assurance").default(false),
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carbonOffset = pgTable("carbon_offset", {
  id: serial("id").primaryKey(),
  offsetId: text("offset_id").notNull().unique(),
  sourceId: text("source_id").references(() => emissionSources.sourceId),
  offsetType: text("offset_type").notNull(), // renewable_energy, energy_efficiency, reforestation, carbon_capture
  projectName: text("project_name").notNull(),
  location: text("location").notNull(),
  offsetQuantity: decimal("offset_quantity", { precision: 12, scale: 2 }), // tonnes CO2eq
  verificationStandard: text("verification_standard"), // VCS, CDM, Gold_Standard, CAR
  vintage: integer("vintage"), // year offset was generated
  price: decimal("price", { precision: 8, scale: 2 }), // USD per tonne
  purchaseDate: timestamp("purchase_date"),
  retirementDate: timestamp("retirement_date"),
  certificate: text("certificate"), // certificate number or document
  permanence: text("permanence"), // permanent, temporary, buffer
  additionality: boolean("additionality").default(true),
  cobenefits: jsonb("cobenefits"), // biodiversity, social, economic benefits
  status: text("status").default("purchased"), // purchased, verified, retired, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const environmentalAlerts = pgTable("environmental_alerts", {
  id: serial("id").primaryKey(),
  alertId: text("alert_id").notNull().unique(),
  alertType: text("alert_type").notNull(), // emission_spike, target_breach, equipment_failure, compliance_issue
  sourceId: text("source_id").references(() => emissionSources.sourceId),
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  description: text("description").notNull(),
  detectedAt: timestamp("detected_at").defaultNow(),
  thresholdExceeded: decimal("threshold_exceeded", { precision: 12, scale: 4 }),
  actualValue: decimal("actual_value", { precision: 12, scale: 4 }),
  automaticAlert: boolean("automatic_alert").default(true),
  actionRequired: text("action_required"),
  responsibleParty: text("responsible_party"),
  acknowledgedBy: text("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  resolution: text("resolution"),
  status: text("status").default("open"), // open, acknowledged, resolved, false_alarm
  createdAt: timestamp("created_at").defaultNow(),
});

// ========================================
// POLIPUS SCHEMA EXPORT TYPES
// ========================================

// Live Trace Types
export type Livestock = typeof livestock.$inferSelect;
export type InsertLivestock = typeof livestock.$inferInsert;
export type LivestockMovement = typeof livestockMovements.$inferSelect;
export type InsertLivestockMovement = typeof livestockMovements.$inferInsert;
export type LivestockAlert = typeof livestockAlerts.$inferSelect;
export type InsertLivestockAlert = typeof livestockAlerts.$inferInsert;

// Land Map360 Types
export type LandParcel = typeof landParcels.$inferSelect;
export type InsertLandParcel = typeof landParcels.$inferInsert;
export type LandDispute = typeof landDisputes.$inferSelect;
export type InsertLandDispute = typeof landDisputes.$inferInsert;
export type SurveyRecord = typeof surveyRecords.$inferSelect;
export type InsertSurveyRecord = typeof surveyRecords.$inferInsert;

// Mine Watch Types
export type MiningOperation = typeof miningOperations.$inferSelect;
export type InsertMiningOperation = typeof miningOperations.$inferInsert;
export type CommunityImpact = typeof communityImpacts.$inferSelect;
export type InsertCommunityImpact = typeof communityImpacts.$inferInsert;
export type MiningInspection = typeof miningInspections.$inferSelect;
export type InsertMiningInspection = typeof miningInspections.$inferInsert;

// Forest Guard Types
export type ForestArea = typeof forestAreas.$inferSelect;
export type InsertForestArea = typeof forestAreas.$inferInsert;
export type DeforestationAlert = typeof deforestationAlerts.$inferSelect;
export type InsertDeforestationAlert = typeof deforestationAlerts.$inferInsert;
export type CarbonCredit = typeof carbonCredits.$inferSelect;
export type InsertCarbonCredit = typeof carbonCredits.$inferInsert;

// Aqua Trace Types
export type WaterBody = typeof waterBodies.$inferSelect;
export type InsertWaterBody = typeof waterBodies.$inferInsert;
export type WaterQualityMonitoring = typeof waterQualityMonitoring.$inferSelect;
export type InsertWaterQualityMonitoring = typeof waterQualityMonitoring.$inferInsert;
export type FishingPermit = typeof fishingPermits.$inferSelect;
export type InsertFishingPermit = typeof fishingPermits.$inferInsert;
export type PollutionReport = typeof pollutionReports.$inferSelect;
export type InsertPollutionReport = typeof pollutionReports.$inferInsert;

// === BLUE CARBON 360 - Ocean Conservation Economics ===

export const blueCarbon360Projects = pgTable("blue_carbon360_projects", {
  id: serial("id").primaryKey(),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(), // mangrove_restoration, seagrass_conservation, salt_marsh_protection, coral_reef_restoration
  status: text("status").notNull().default("planning"), // planning, active, monitoring, completed, suspended
  location: text("location").notNull(), // County/District location
  coordinates: text("coordinates"), // GPS coordinates
  totalArea: decimal("total_area", { precision: 10, scale: 2 }), // hectares
  ecosystemType: text("ecosystem_type").notNull(), // mangrove, seagrass, salt_marsh, coral_reef
  carbonSequestrationRate: decimal("carbon_sequestration_rate", { precision: 8, scale: 2 }), // tonnes CO2 per hectare per year
  estimatedCarbonCredits: decimal("estimated_carbon_credits", { precision: 10, scale: 2 }), // total credits expected
  actualCarbonCredits: decimal("actual_carbon_credits", { precision: 10, scale: 2 }).default("0"), // credits earned
  projectManager: text("project_manager"),
  leadOrganization: text("lead_organization"),
  partnerOrganizations: text("partner_organizations"), // JSON array of partners
  fundingSource: text("funding_source"),
  totalBudget: decimal("total_budget", { precision: 12, scale: 2 }),
  spentBudget: decimal("spent_budget", { precision: 12, scale: 2 }).default("0"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  monitoringFrequency: text("monitoring_frequency").default("monthly"), // weekly, monthly, quarterly, annually
  lastMonitored: timestamp("last_monitored"),
  biodiversityImpact: text("biodiversity_impact"), // JSON data about species protected
  communityBenefits: text("community_benefits"), // JSON data about local community impact
  riskAssessment: text("risk_assessment"), // JSON data about risks and mitigation
  certificationStandard: text("certification_standard"), // Verra, Gold Standard, CAR, etc.
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  verifiedBy: text("verified_by"),
  verificationDate: timestamp("verification_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const carbonMarketplaceListings = pgTable("carbon_marketplace_listings", {
  id: serial("id").primaryKey(),
  listingTitle: text("listing_title").notNull(),
  projectId: integer("project_id").references(() => blueCarbon360Projects.id),
  creditType: text("credit_type").notNull(), // blue_carbon, verified_carbon_standard, gold_standard
  creditsAvailable: decimal("credits_available", { precision: 10, scale: 2 }).notNull(),
  pricePerCredit: decimal("price_per_credit", { precision: 8, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull(),
  vintage: integer("vintage"), // year credits were generated
  listingStatus: text("listing_status").notNull().default("active"), // active, sold, expired, suspended
  sellerOrganization: text("seller_organization").notNull(),
  sellerContact: text("seller_contact"),
  ecosystemType: text("ecosystem_type").notNull(),
  location: text("location").notNull(),
  verificationStandard: text("verification_standard"),
  additionalityProof: text("additionality_proof"), // proof that credits are additional
  permanenceGuarantee: text("permanence_guarantee"), // guarantee period
  cobenefits: text("cobenefits"), // JSON array of additional benefits
  listingDate: timestamp("listing_date").defaultNow(),
  expirationDate: timestamp("expiration_date"),
  soldCredits: decimal("sold_credits", { precision: 10, scale: 2 }).default("0"),
  remainingCredits: decimal("remaining_credits", { precision: 10, scale: 2 }),
  marketplaceRating: decimal("marketplace_rating", { precision: 2, scale: 1 }).default("0"), // 0-5 stars
  createdAt: timestamp("created_at").defaultNow(),
});

export const economicImpactRecords = pgTable("economic_impact_records", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => blueCarbon360Projects.id),
  recordType: text("record_type").notNull(), // ecosystem_valuation, job_creation, tourism_impact, fisheries_impact
  impactCategory: text("impact_category").notNull(), // direct, indirect, induced
  economicValue: decimal("economic_value", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  valuationMethod: text("valuation_method"), // market_pricing, cost_benefit, replacement_cost, travel_cost
  beneficiaryGroup: text("beneficiary_group"), // local_community, government, private_sector, international
  temporalScope: text("temporal_scope"), // one_time, annual, project_lifetime
  jobsCreated: integer("jobs_created").default(0),
  jobsSupported: integer("jobs_supported").default(0),
  householdsBenefited: integer("households_benefited").default(0),
  tourismRevenue: decimal("tourism_revenue", { precision: 10, scale: 2 }).default("0"),
  fishingRevenue: decimal("fishing_revenue", { precision: 10, scale: 2 }).default("0"),
  propertyValueIncrease: decimal("property_value_increase", { precision: 10, scale: 2 }).default("0"),
  dataSource: text("data_source"),
  verificationStatus: text("verification_status").default("draft"), // draft, verified, published
  verifiedBy: text("verified_by"),
  recordDate: timestamp("record_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conservationMonitoring = pgTable("conservation_monitoring", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => blueCarbon360Projects.id).notNull(),
  monitoringDate: timestamp("monitoring_date").notNull(),
  monitoringType: text("monitoring_type").notNull(), // field_survey, satellite_monitoring, drone_survey, water_quality
  monitoredBy: text("monitored_by").notNull(),
  ecosystemHealth: text("ecosystem_health").notNull(), // excellent, good, fair, poor, critical
  vegetationCover: decimal("vegetation_cover", { precision: 5, scale: 2 }), // percentage
  speciesDiversity: integer("species_diversity"), // number of species observed
  carbonStock: decimal("carbon_stock", { precision: 10, scale: 2 }), // tonnes CO2
  waterQuality: text("water_quality"), // JSON data about water parameters
  threatLevel: text("threat_level").default("low"), // low, moderate, high, severe
  threatsIdentified: text("threats_identified"), // JSON array of threats
  mitigationActions: text("mitigation_actions"), // JSON array of actions taken
  recommendedActions: text("recommended_actions"), // JSON array of recommendations
  photosUrls: text("photos_urls"), // JSON array of photo URLs
  gpsCoordinates: text("gps_coordinates"),
  weatherConditions: text("weather_conditions"), // JSON data about weather
  monitoringNotes: text("monitoring_notes"),
  nextMonitoringDate: timestamp("next_monitoring_date"),
  alertGenerated: boolean("alert_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const carbonTransactions = pgTable("carbon_transactions", {
  id: serial("id").primaryKey(),
  marketplaceListingId: integer("marketplace_listing_id").references(() => carbonMarketplaceListings.id).notNull(),
  transactionType: text("transaction_type").notNull(), // purchase, sale, transfer, retirement
  buyerOrganization: text("buyer_organization"),
  buyerContact: text("buyer_contact"),
  sellerOrganization: text("seller_organization"),
  creditsPurchased: decimal("credits_purchased", { precision: 10, scale: 2 }).notNull(),
  pricePerCredit: decimal("price_per_credit", { precision: 8, scale: 2 }).notNull(),
  totalTransactionValue: decimal("total_transaction_value", { precision: 12, scale: 2 }).notNull(),
  transactionFees: decimal("transaction_fees", { precision: 8, scale: 2 }).default("0"),
  netAmount: decimal("net_amount", { precision: 12, scale: 2 }),
  transactionStatus: text("transaction_status").notNull().default("pending"), // pending, completed, cancelled, disputed
  paymentMethod: text("payment_method"), // bank_transfer, cryptocurrency, escrow
  paymentStatus: text("payment_status").default("pending"), // pending, paid, failed, refunded
  retirementCertificate: text("retirement_certificate"), // certificate number if retired
  retiredFor: text("retired_for"), // organization/purpose for retirement
  transactionHash: text("transaction_hash"), // blockchain hash if applicable
  verificationDocuments: text("verification_documents"), // JSON array of document URLs
  transactionDate: timestamp("transaction_date").defaultNow(),
  completionDate: timestamp("completion_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blueCarbon360Users = pgTable("blue_carbon360_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(), // regulatory, conservation_economist, marine_conservationist, policy_advisor
  firstName: text("first_name"),
  lastName: text("last_name"),
  organization: text("organization"),
  position: text("position"),
  department: text("department"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  county: text("county"),
  district: text("district"),
  specialization: text("specialization"), // mangroves, coral_reefs, seagrass, economic_valuation, carbon_markets
  certifications: text("certifications"), // JSON array of certifications
  experienceLevel: text("experience_level").default("intermediate"), // beginner, intermediate, expert
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  permissions: text("permissions"), // JSON array of permissions
  projectsAssigned: text("projects_assigned"), // JSON array of project IDs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blue Carbon 360 Insert Schemas
export const insertBlueCarbon360ProjectSchema = createInsertSchema(blueCarbon360Projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertCarbonMarketplaceListingSchema = createInsertSchema(carbonMarketplaceListings).omit({
  id: true,
  createdAt: true,
});
export const insertEconomicImpactRecordSchema = createInsertSchema(economicImpactRecords).omit({
  id: true,
  createdAt: true,
});
export const insertConservationMonitoringSchema = createInsertSchema(conservationMonitoring).omit({
  id: true,
  createdAt: true,
});
export const insertCarbonTransactionSchema = createInsertSchema(carbonTransactions).omit({
  id: true,
  createdAt: true,
});
export const insertBlueCarbon360UserSchema = createInsertSchema(blueCarbon360Users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Blue Carbon 360 Types
export type InsertBlueCarbon360Project = z.infer<typeof insertBlueCarbon360ProjectSchema>;
export type SelectBlueCarbon360Project = typeof blueCarbon360Projects.$inferSelect;
export type InsertCarbonMarketplaceListing = z.infer<typeof insertCarbonMarketplaceListingSchema>;
export type SelectCarbonMarketplaceListing = typeof carbonMarketplaceListings.$inferSelect;
export type InsertEconomicImpactRecord = z.infer<typeof insertEconomicImpactRecordSchema>;
export type SelectEconomicImpactRecord = typeof economicImpactRecords.$inferSelect;
export type InsertConservationMonitoring = z.infer<typeof insertConservationMonitoringSchema>;
export type SelectConservationMonitoring = typeof conservationMonitoring.$inferSelect;
export type InsertCarbonTransaction = z.infer<typeof insertCarbonTransactionSchema>;
export type SelectCarbonTransaction = typeof carbonTransactions.$inferSelect;
export type InsertBlueCarbon360User = z.infer<typeof insertBlueCarbon360UserSchema>;
export type SelectBlueCarbon360User = typeof blueCarbon360Users.$inferSelect;

// Blue Carbon 360 Types (Legacy support)
export type ConservationProject = typeof blueCarbon360Projects.$inferSelect;
export type InsertConservationProject = typeof blueCarbon360Projects.$inferInsert;
export type CarbonMarketplace = typeof carbonMarketplaceListings.$inferSelect;
export type InsertCarbonMarketplace = typeof carbonMarketplaceListings.$inferInsert;
export type EconomicImpactTracking = typeof economicImpactRecords.$inferSelect;
export type InsertEconomicImpactTracking = typeof economicImpactRecords.$inferInsert;

// Carbon Trace Types
export type EmissionSource = typeof emissionSources.$inferSelect;
export type InsertEmissionSource = typeof emissionSources.$inferInsert;
export type EmissionMeasurement = typeof emissionMeasurements.$inferSelect;
export type InsertEmissionMeasurement = typeof emissionMeasurements.$inferInsert;
export type CarbonOffset = typeof carbonOffset.$inferSelect;
export type InsertCarbonOffset = typeof carbonOffset.$inferInsert;
export type EnvironmentalAlert = typeof environmentalAlerts.$inferSelect;
export type InsertEnvironmentalAlert = typeof environmentalAlerts.$inferInsert;

// Mobile Alert Requests table for comprehensive mobile app integration
export const mobileAlertRequests = pgTable("mobile_alert_requests", {
  id: serial("id").primaryKey(),
  alertId: integer("alert_id").references(() => alerts.id),
  requestType: text("request_type").notNull(), // farmer_registration, inspection_report, compliance_issue, quality_concern, urgent_notification
  farmerId: text("farmer_id"), // if related to a specific farmer
  agentId: text("agent_id"), // field agent who submitted
  location: text("location"), // GPS coordinates or location description
  description: text("description").notNull(),
  attachments: text("attachments"), // JSON array of file URLs/paths
  urgencyLevel: text("urgency_level").default("normal"), // low, normal, high, emergency
  status: text("status").default("pending"), // pending, verified, rejected, processed
  verificationNotes: text("verification_notes"),
  complianceOfficerNotes: text("compliance_officer_notes"),
  directorNotes: text("director_notes"),
  processedAt: timestamp("processed_at"),
  requiresDirectorApproval: boolean("requires_director_approval").default(false),
  directorApproved: boolean("director_approved"),
  directorApprovedAt: timestamp("director_approved_at"),
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
  profilePicture: text("profile_picture"), // base64 encoded image or URL
  farmBoundaries: jsonb("farm_boundaries"), // array of GPS boundary points
  landMapData: jsonb("land_map_data"), // comprehensive land analysis data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFarmerSchema = createInsertSchema(farmers).omit({
  id: true,
  onboardingDate: true,
  createdAt: true,
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

// Economic Activity Reporting System
export const economicActivities = pgTable("economic_activities", {
  id: serial("id").primaryKey(),
  activityType: text("activity_type").notNull(), // production, processing, trading, export, import, market_sale
  commodityType: text("commodity_type").notNull(),
  county: text("county").notNull(),
  district: text("district"),
  actorType: text("actor_type").notNull(), // farmer, processor, trader, exporter, cooperative
  actorId: text("actor_id").notNull(),
  actorName: text("actor_name").notNull(),
  quantity: decimal("quantity", { precision: 12, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  transactionDate: timestamp("transaction_date").notNull(),
  destination: text("destination"), // for exports/trades
  marketLocation: text("market_location"),
  paymentMethod: text("payment_method"), // cash, mobile_money, bank_transfer, credit
  taxesPaid: decimal("taxes_paid", { precision: 10, scale: 2 }),
  licenseNumber: text("license_number"),
  complianceStatus: text("compliance_status").default("pending"), // compliant, non_compliant, under_review
  gpsCoordinates: text("gps_coordinates"),
  verificationStatus: text("verification_status").default("unverified"), // verified, unverified, disputed
  verifiedBy: text("verified_by"),
  verificationDate: timestamp("verification_date"),
  notes: text("notes"),
  attachments: text("attachments").array(), // Document URLs/paths
  seasonYear: text("season_year").notNull(), // "2024/2025"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// County Economic Summary (aggregated data)
export const countyEconomicSummary = pgTable("county_economic_summary", {
  id: serial("id").primaryKey(),
  county: text("county").notNull(),
  reportPeriod: text("report_period").notNull(), // "2025-01", "2025-Q1", "2025"
  totalProduction: decimal("total_production", { precision: 15, scale: 2 }).default("0"),
  totalTrading: decimal("total_trading", { precision: 15, scale: 2 }).default("0"),
  totalExports: decimal("total_exports", { precision: 15, scale: 2 }).default("0"),
  totalTaxRevenue: decimal("total_tax_revenue", { precision: 12, scale: 2 }).default("0"),
  activeBusinesses: integer("active_businesses").default(0),
  registeredFarmers: integer("registered_farmers").default(0),
  employmentCreated: integer("employment_created").default(0),
  averageProductionPrice: decimal("average_production_price", { precision: 10, scale: 2 }),
  topCommodities: text("top_commodities").array(), // ["cocoa", "coffee", "rice"]
  complianceRate: decimal("compliance_rate", { precision: 5, scale: 2 }).default("0"), // percentage
  growthRate: decimal("growth_rate", { precision: 5, scale: 2 }), // month-over-month percentage
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Economic Indicators Dashboard
export const economicIndicators = pgTable("economic_indicators", {
  id: serial("id").primaryKey(),
  indicatorType: text("indicator_type").notNull(), // gdp_contribution, export_value, employment, price_index
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  unit: text("unit").notNull(), // USD, percentage, jobs, index
  period: text("period").notNull(), // "2025-01", "2025-Q1"
  county: text("county"), // null for national indicators
  commodityType: text("commodity_type"), // null for general indicators
  previousValue: decimal("previous_value", { precision: 15, scale: 2 }),
  changePercentage: decimal("change_percentage", { precision: 5, scale: 2 }),
  trendDirection: text("trend_direction"), // up, down, stable
  dataSource: text("data_source").notNull(),
  calculationMethod: text("calculation_method"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
// Remove the old insertFarmerSchema since we defined it above with the table

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

// ========================================
// MULTIPLE LAND MAPPING & HARVEST SCHEDULE SYSTEM
// ========================================

// Farmer Land Mappings - Multiple mappings per farmer
export const farmerLandMappings = pgTable("farmer_land_mappings", {
  id: serial("id").primaryKey(),
  mappingId: text("mapping_id").notNull().unique(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  landMappingName: text("land_mapping_name").notNull(),
  totalArea: decimal("total_area", { precision: 12, scale: 4 }).notNull(), // hectares
  areaUnit: text("area_unit").default("hectares"),
  gpsCoordinates: jsonb("gps_coordinates").notNull(), // array of GPS boundary points
  centerLatitude: decimal("center_latitude", { precision: 10, scale: 8 }),
  centerLongitude: decimal("center_longitude", { precision: 11, scale: 8 }),
  landType: text("land_type").notNull(), // agricultural, forest, residential, mixed_use, fallow
  soilType: text("soil_type"), // clay, sandy, loamy, rocky, mixed
  soilQuality: text("soil_quality"), // poor, fair, good, excellent
  waterSource: text("water_source"), // river, well, rain_fed, irrigation, none
  accessibility: text("accessibility").default("accessible"), // accessible, difficult, remote
  elevationRange: text("elevation_range"), // low, medium, high, varied
  slopeGradient: text("slope_gradient"), // flat, gentle, moderate, steep
  vegetationCover: text("vegetation_cover"), // bare, sparse, moderate, dense, forest
  currentUse: text("current_use").notNull(), // active_farming, fallow, grazing, forest, unused
  landTenure: text("land_tenure").default("owned"), // owned, leased, family_land, community_land
  registrationStatus: text("registration_status").default("registered"), // registered, pending, unregistered
  legalDocuments: jsonb("legal_documents"), // array of document references
  acquisitionDate: timestamp("acquisition_date"),
  lastSurveyDate: timestamp("last_survey_date"),
  surveyedBy: text("surveyed_by"), // inspector who conducted the survey
  mappingAccuracy: text("mapping_accuracy").default("medium"), // high, medium, low
  notes: text("notes"),
  photos: jsonb("photos"), // array of photo URLs
  isActive: boolean("is_active").default(true),
  createdBy: text("created_by").notNull(), // inspector or farmer who created this
  approvedBy: text("approved_by"), // land inspector who approved the mapping
  approvedAt: timestamp("approved_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Harvest Schedules - Multiple schedules per land mapping
export const harvestSchedules = pgTable("harvest_schedules", {
  id: serial("id").primaryKey(),
  scheduleId: text("schedule_id").notNull().unique(),
  landMappingId: integer("land_mapping_id").references(() => farmerLandMappings.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  scheduleName: text("schedule_name").notNull(),
  cropType: text("crop_type").notNull(), // cocoa, coffee, palm_oil, rubber, rice, cassava, plantain
  cropVariety: text("crop_variety"),
  plantingArea: decimal("planting_area", { precision: 10, scale: 2 }).notNull(), // hectares
  plantingStartDate: timestamp("planting_start_date").notNull(),
  plantingEndDate: timestamp("planting_end_date"),
  expectedGerminationDate: timestamp("expected_germination_date"),
  expectedMaturityDate: timestamp("expected_maturity_date"),
  expectedHarvestStartDate: timestamp("expected_harvest_start_date").notNull(),
  expectedHarvestEndDate: timestamp("expected_harvest_end_date"),
  actualPlantingDate: timestamp("actual_planting_date"),
  actualHarvestStartDate: timestamp("actual_harvest_start_date"),
  actualHarvestEndDate: timestamp("actual_harvest_end_date"),
  expectedYield: decimal("expected_yield", { precision: 10, scale: 2 }),
  actualYield: decimal("actual_yield", { precision: 10, scale: 2 }),
  yieldUnit: text("yield_unit").default("kg"),
  plantingMethod: text("planting_method"), // direct_seeding, transplanting, broadcasting
  seedingRate: decimal("seeding_rate", { precision: 8, scale: 2 }), // kg per hectare
  fertilizerPlan: jsonb("fertilizer_plan"), // fertilizer application schedule
  pestControlPlan: jsonb("pest_control_plan"), // pest and disease management plan
  irrigationSchedule: jsonb("irrigation_schedule"), // irrigation timing and amounts
  harvestingMethod: text("harvesting_method"), // manual, mechanical, mixed
  postHarvestTreatment: text("post_harvest_treatment"), // drying, processing, storage
  marketingPlan: text("marketing_plan"), // intended buyer or market
  expectedPrice: decimal("expected_price", { precision: 8, scale: 2 }),
  actualPrice: decimal("actual_price", { precision: 8, scale: 2 }),
  priceUnit: text("price_unit").default("per_kg"),
  season: text("season").notNull(), // dry_season, rainy_season, year_round
  cropYear: integer("crop_year").notNull(),
  status: text("status").notNull().default("planned"), // planned, planted, growing, ready_for_harvest, harvested, completed
  riskFactors: jsonb("risk_factors"), // weather, pests, market, financial risks
  insuranceCoverage: boolean("insurance_coverage").default(false),
  certificationTarget: text("certification_target"), // organic, fair_trade, rainforest_alliance
  qualityGrade: text("quality_grade"), // actual quality after harvest
  yieldPerformance: text("yield_performance"), // below_expected, as_expected, above_expected
  profitability: decimal("profitability", { precision: 12, scale: 2 }), // calculated profit/loss
  lessons: text("lessons_learned"), // what was learned from this cycle
  nextCyclePlans: text("next_cycle_plans"), // plans for the next planting cycle
  inspectedBy: text("inspected_by"), // land inspector who monitors this schedule
  lastInspectionDate: timestamp("last_inspection_date"),
  nextInspectionDate: timestamp("next_inspection_date"),
  inspectionNotes: text("inspection_notes"),
  complianceStatus: text("compliance_status").default("compliant"), // compliant, non_compliant, pending_review
  alerts: jsonb("alerts"), // active alerts for this schedule
  weatherData: jsonb("weather_data"), // relevant weather information
  createdBy: text("created_by").notNull(),
  approvedBy: text("approved_by"), // land inspector who approved the schedule
  approvedAt: timestamp("approved_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Land Mapping Inspections by Land Inspectors
export const landMappingInspections = pgTable("land_mapping_inspections", {
  id: serial("id").primaryKey(),
  inspectionId: text("inspection_id").notNull().unique(),
  landMappingId: integer("land_mapping_id").references(() => farmerLandMappings.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  inspectorId: text("inspector_id").notNull(),
  inspectorName: text("inspector_name").notNull(),
  inspectorType: text("inspector_type").default("land_inspector"), // should be land_inspector for this module
  inspectionDate: timestamp("inspection_date").notNull(),
  inspectionType: text("inspection_type").notNull(), // initial_mapping, routine, compliance, dispute_resolution, boundary_verification
  purpose: text("purpose").notNull(), // survey, boundary_check, crop_assessment, compliance_check, farmer_support
  areaInspected: decimal("area_inspected", { precision: 10, scale: 2 }),
  boundaryAccuracy: text("boundary_accuracy"), // accurate, minor_discrepancy, major_discrepancy, disputed
  boundaryChanges: jsonb("boundary_changes"), // any changes made to boundaries
  soilAssessment: text("soil_assessment"),
  waterSourceVerification: text("water_source_verification"),
  cropConditionAssessment: text("crop_condition_assessment"),
  landUseCompliance: text("land_use_compliance"), // compliant, non_compliant, needs_improvement
  environmentalConcerns: text("environmental_concerns"),
  findingsAndRecommendations: text("findings_and_recommendations").notNull(),
  correctiveActions: text("corrective_actions"),
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  complianceScore: integer("compliance_score"), // 0-100
  riskAssessment: text("risk_assessment"), // low, medium, high, critical
  photosEvidence: jsonb("photos_evidence"), // inspection photos
  gpsReadings: jsonb("gps_readings"), // GPS measurements taken during inspection
  farmerPresent: boolean("farmer_present").default(true),
  farmerFeedback: text("farmer_feedback"),
  inspectorNotes: text("inspector_notes"),
  weatherConditions: text("weather_conditions"),
  equipmentUsed: text("equipment_used"), // GPS, drone, measuring_tape, soil_tester
  nextInspectionRecommended: timestamp("next_inspection_recommended"),
  status: text("status").default("completed"), // scheduled, in_progress, completed, follow_up_pending
  verifiedBy: text("verified_by"), // senior inspector who verified the report
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Harvest Schedule Monitoring by Land Inspectors
export const harvestScheduleMonitoring = pgTable("harvest_schedule_monitoring", {
  id: serial("id").primaryKey(),
  monitoringId: text("monitoring_id").notNull().unique(),
  scheduleId: integer("schedule_id").references(() => harvestSchedules.id).notNull(),
  landMappingId: integer("land_mapping_id").references(() => farmerLandMappings.id).notNull(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  inspectorId: text("inspector_id").notNull(),
  inspectorName: text("inspector_name").notNull(),
  monitoringDate: timestamp("monitoring_date").notNull(),
  growthStage: text("growth_stage").notNull(), // seedling, vegetative, flowering, fruiting, mature, harvesting
  monitoringType: text("monitoring_type").notNull(), // routine, problem_investigation, harvest_readiness, quality_check
  cropHealthAssessment: text("crop_health_assessment").notNull(), // excellent, good, fair, poor, critical
  pestDiseaseStatus: text("pest_disease_status"), // none, minor, moderate, severe, critical
  pestDiseaseDetails: text("pest_disease_details"),
  treatmentRecommendations: text("treatment_recommendations"),
  waterStressLevel: text("water_stress_level"), // none, mild, moderate, severe
  nutritionalStatus: text("nutritional_status"), // excellent, adequate, deficient, severely_deficient
  weedInfestation: text("weed_infestation"), // none, light, moderate, heavy
  yieldEstimate: decimal("yield_estimate", { precision: 10, scale: 2 }),
  harvestReadiness: text("harvest_readiness"), // not_ready, nearly_ready, ready, overdue
  qualityProjection: text("quality_projection"), // premium, grade_a, grade_b, grade_c, poor
  scheduledHarvestDate: timestamp("scheduled_harvest_date"),
  actualHarvestDate: timestamp("actual_harvest_date"),
  harvestDelayReason: text("harvest_delay_reason"),
  weatherImpact: text("weather_impact"), // positive, neutral, negative, severe
  marketConditions: text("market_conditions"), // favorable, average, poor, unknown
  priceProjection: decimal("price_projection", { precision: 8, scale: 2 }),
  recommendations: text("recommendations").notNull(),
  correctiveActions: text("corrective_actions"),
  farmerGuidance: text("farmer_guidance"), // advice provided to the farmer
  trainingNeeded: boolean("training_needed").default(false),
  trainingTopics: text("training_topics"), // areas where farmer needs training
  supportRequired: text("support_required"), // inputs, technical, financial
  riskFactors: jsonb("risk_factors"), // identified risks
  mitigationStrategies: text("mitigation_strategies"),
  photos: jsonb("photos"), // monitoring photos
  measurements: jsonb("measurements"), // plant height, fruit count, etc.
  soilMoisture: text("soil_moisture"), // dry, adequate, wet, waterlogged
  fertilizerApplication: text("fertilizer_application"), // as_scheduled, delayed, excessive, insufficient
  nextMonitoringDate: timestamp("next_monitoring_date"),
  followUpActions: text("follow_up_actions"),
  farmerFeedback: text("farmer_feedback"),
  monitoringNotes: text("monitoring_notes"),
  complianceIssues: text("compliance_issues"),
  status: text("status").default("completed"), // scheduled, in_progress, completed, follow_up_required
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert Schemas
export const insertFarmerLandMappingSchema = createInsertSchema(farmerLandMappings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHarvestScheduleSchema = createInsertSchema(harvestSchedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLandMappingInspectionSchema = createInsertSchema(landMappingInspections).omit({
  id: true,
  createdAt: true,
});

export const insertHarvestScheduleMonitoringSchema = createInsertSchema(harvestScheduleMonitoring).omit({
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

export const insertMobileAlertRequestSchema = createInsertSchema(mobileAlertRequests).omit({
  id: true,
  createdAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
});

export const insertEconomicActivitySchema = createInsertSchema(economicActivities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCountyEconomicSummarySchema = createInsertSchema(countyEconomicSummary).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertEconomicIndicatorSchema = createInsertSchema(economicIndicators).omit({
  id: true,
  createdAt: true,
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

export type MobileAlertRequest = typeof mobileAlertRequests.$inferSelect;
export type InsertMobileAlertRequest = z.infer<typeof insertMobileAlertRequestSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type EconomicActivity = typeof economicActivities.$inferSelect;
export type InsertEconomicActivity = z.infer<typeof insertEconomicActivitySchema>;

export type CountyEconomicSummary = typeof countyEconomicSummary.$inferSelect;
export type InsertCountyEconomicSummary = z.infer<typeof insertCountyEconomicSummarySchema>;

export type EconomicIndicator = typeof economicIndicators.$inferSelect;
export type InsertEconomicIndicator = z.infer<typeof insertEconomicIndicatorSchema>;

// Multiple Land Mapping & Harvest Schedule Types
export type FarmerLandMapping = typeof farmerLandMappings.$inferSelect;
export type InsertFarmerLandMapping = z.infer<typeof insertFarmerLandMappingSchema>;

export type HarvestSchedule = typeof harvestSchedules.$inferSelect;
export type InsertHarvestSchedule = z.infer<typeof insertHarvestScheduleSchema>;

export type LandMappingInspection = typeof landMappingInspections.$inferSelect;
export type InsertLandMappingInspection = z.infer<typeof insertLandMappingInspectionSchema>;

export type HarvestScheduleMonitoring = typeof harvestScheduleMonitoring.$inferSelect;
export type InsertHarvestScheduleMonitoring = z.infer<typeof insertHarvestScheduleMonitoringSchema>;

// Farmer types (legacy support - already defined above)

// Authentication and User Management System
export const authUsers = pgTable("auth_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(), // regulatory_admin, regulatory_staff, field_agent, farmer, exporter, buyer
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  department: text("department"), // for regulatory staff
  jurisdiction: text("jurisdiction"), // county/district for field agents
  farmerId: integer("farmer_id").references(() => farmers.id), // linked farmer account
  buyerId: text("buyer_id"), // linked buyer account
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Buyer Management System
export const buyers = pgTable("buyers", {
  id: serial("id").primaryKey(),
  buyerId: text("buyer_id").notNull().unique(), // BUY-YYYYMMDD-XXX format
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(), // wholesaler, exporter, processor, retailer, distributor
  registrationNumber: text("registration_number").unique(),
  taxId: text("tax_id"),
  contactPersonFirstName: text("contact_person_first_name").notNull(),
  contactPersonLastName: text("contact_person_last_name").notNull(),
  contactPersonTitle: text("contact_person_title"), // CEO, Manager, Director, etc.
  primaryEmail: text("primary_email").notNull().unique(),
  secondaryEmail: text("secondary_email"),
  primaryPhone: text("primary_phone").notNull(),
  secondaryPhone: text("secondary_phone"),
  businessAddress: text("business_address").notNull(),
  city: text("city").notNull(),
  county: text("county").notNull(),
  postalCode: text("postal_code"),
  country: text("country").notNull().default("Liberia"),
  
  // Business Details
  yearEstablished: integer("year_established"),
  numberOfEmployees: integer("number_of_employees"),
  annualTurnover: decimal("annual_turnover", { precision: 15, scale: 2 }),
  bankName: text("bank_name"),
  bankAccountNumber: text("bank_account_number"),
  bankBranch: text("bank_branch"),
  
  // Commodities and Trade Info
  interestedCommodities: text("interested_commodities"), // JSON array: cocoa, coffee, palm_oil, rubber, rice, etc.
  tradingRegions: text("trading_regions"), // JSON array of counties/countries
  purchaseVolume: text("purchase_volume"), // expected monthly/annual volume
  paymentTerms: text("payment_terms"), // cash, credit, installment
  creditLimit: decimal("credit_limit", { precision: 12, scale: 2 }),
  
  // Compliance and Verification
  licenseNumber: text("license_number"),
  licenseType: text("license_type"), // trading_license, export_license, processing_license
  licenseIssuedBy: text("license_issued_by"),
  licenseIssueDate: timestamp("license_issue_date"),
  licenseExpiryDate: timestamp("license_expiry_date"),
  complianceStatus: text("compliance_status").notNull().default("pending"), // pending, approved, suspended, rejected
  verificationStatus: text("verification_status").notNull().default("unverified"), // unverified, in_progress, verified, rejected
  kycStatus: text("kyc_status").notNull().default("pending"), // pending, completed, failed
  
  // Platform Access
  portalAccess: boolean("portal_access").default(false),
  accessLevel: text("access_level").default("basic"), // basic, premium, enterprise
  loginCredentialsGenerated: boolean("login_credentials_generated").default(false),
  passwordHash: text("password_hash"),
  
  // Onboarding Process
  onboardingStep: integer("onboarding_step").default(1), // 1-5 steps
  onboardingCompleted: boolean("onboarding_completed").default(false),
  documentsSubmitted: text("documents_submitted"), // JSON array of document types
  documentsVerified: text("documents_verified"), // JSON array of verified document types
  
  // Profile and Document Uploads
  profilePhotoUrl: text("profile_photo_url"), // Profile photo URL
  businessCardFrontUrl: text("business_card_front_url"), // OPTIONAL - business card front
  businessCardBackUrl: text("business_card_back_url"), // OPTIONAL - business card back
  
  // Regulatory Management
  assignedOfficer: integer("assigned_officer").references(() => authUsers.id),
  approvedBy: integer("approved_by").references(() => authUsers.id),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
  riskRating: text("risk_rating").default("medium"), // low, medium, high
  
  // Status Management
  isActive: boolean("is_active").default(true),
  suspensionReason: text("suspension_reason"),
  suspendedBy: integer("suspended_by").references(() => authUsers.id),
  suspendedAt: timestamp("suspended_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Exporter Management System
export const exporters = pgTable("exporters", {
  id: serial("id").primaryKey(),
  exporterId: text("exporter_id").notNull().unique(), // EXP-YYYYMMDD-XXX format
  companyName: text("company_name").notNull(),
  businessType: text("business_type").notNull(), // agricultural_exporter, commodity_trader, processing_company, cooperative
  registrationNumber: text("registration_number").unique(),
  taxId: text("tax_id"),
  vatNumber: text("vat_number"),
  contactPersonFirstName: text("contact_person_first_name").notNull(),
  contactPersonLastName: text("contact_person_last_name").notNull(),
  contactPersonTitle: text("contact_person_title"), // CEO, Export Manager, Director, etc.
  primaryEmail: text("primary_email").notNull().unique(),
  secondaryEmail: text("secondary_email"),
  primaryPhone: text("primary_phone").notNull(),
  secondaryPhone: text("secondary_phone"),
  faxNumber: text("fax_number"),
  businessAddress: text("business_address").notNull(),
  city: text("city").notNull(),
  county: text("county").notNull(),
  postalCode: text("postal_code"),
  country: text("country").notNull().default("Liberia"),
  
  // Business Details
  yearEstablished: integer("year_established"),
  numberOfEmployees: integer("number_of_employees"),
  annualTurnover: decimal("annual_turnover", { precision: 15, scale: 2 }),
  exportExperience: integer("export_experience"), // years of export experience
  bankName: text("bank_name"),
  bankAccountNumber: text("bank_account_number"),
  bankBranch: text("bank_branch"),
  swiftCode: text("swift_code"),
  
  // Export Specialization
  exportCommodities: text("export_commodities"), // JSON array: cocoa, coffee, palm_oil, rubber, rice, etc.
  exportDestinations: text("export_destinations"), // JSON array of countries
  exportVolume: text("export_volume"), // expected monthly/annual export volume
  exportCapacity: decimal("export_capacity", { precision: 12, scale: 2 }), // MT per year
  storageCapacity: decimal("storage_capacity", { precision: 10, scale: 2 }), // MT
  processingCapacity: decimal("processing_capacity", { precision: 10, scale: 2 }), // MT per month
  qualityCertifications: text("quality_certifications"), // JSON array: ISO, HACCP, Organic, Fair Trade, etc.
  
  // Compliance and Licenses
  exportLicenseNumber: text("export_license_number"),
  exportLicenseType: text("export_license_type"), // general_export, specific_commodity, temporary
  exportLicenseIssuedBy: text("export_license_issued_by"),
  exportLicenseIssueDate: timestamp("export_license_issue_date"),
  exportLicenseExpiryDate: timestamp("export_license_expiry_date"),
  businessLicenseNumber: text("business_license_number"),
  businessLicenseExpiryDate: timestamp("business_license_expiry_date"),
  customsRegistrationNumber: text("customs_registration_number"),
  eudrComplianceStatus: text("eudr_compliance_status").default("pending"), // pending, compliant, non_compliant, under_review
  complianceStatus: text("compliance_status").notNull().default("pending"), // pending, approved, suspended, rejected
  verificationStatus: text("verification_status").notNull().default("unverified"), // unverified, in_progress, verified, rejected
  kycStatus: text("kyc_status").notNull().default("pending"), // pending, completed, failed
  
  // Platform Access
  portalAccess: boolean("portal_access").default(false),
  accessLevel: text("access_level").default("basic"), // basic, premium, enterprise
  loginCredentialsGenerated: boolean("login_credentials_generated").default(false),
  passwordHash: text("password_hash"),
  
  // Onboarding Process
  onboardingStep: integer("onboarding_step").default(1), // 1-5 steps
  onboardingCompleted: boolean("onboarding_completed").default(false),
  documentsSubmitted: text("documents_submitted"), // JSON array of document types
  documentsVerified: text("documents_verified"), // JSON array of verified document types
  
  // Profile and Document Uploads
  profilePhotoUrl: text("profile_photo_url").notNull(), // MANDATORY - company logo/representative photo URL
  businessLicenseUrl: text("business_license_url"), // OPTIONAL - business license document
  exportLicenseUrl: text("export_license_url"), // OPTIONAL - export license document
  
  // Regulatory Management
  assignedOfficer: integer("assigned_officer").references(() => authUsers.id),
  approvedBy: integer("approved_by").references(() => authUsers.id),
  approvedAt: timestamp("approved_at"),
  notes: text("notes"),
  riskRating: text("risk_rating").default("medium"), // low, medium, high
  
  // Status Management
  isActive: boolean("is_active").default(true),
  suspensionReason: text("suspension_reason"),
  suspendedBy: integer("suspended_by").references(() => authUsers.id),
  suspendedAt: timestamp("suspended_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const exporterCredentials = pgTable("exporter_credentials", {
  id: serial("id").primaryKey(),
  exporterId: integer("exporter_id").references(() => exporters.id).notNull(),
  username: text("username").notNull().unique(), // same as exporter_id
  passwordHash: text("password_hash").notNull(),
  temporaryPassword: text("temporary_password"), // for first login
  passwordChangeRequired: boolean("password_change_required").default(true),
  lastPasswordChange: timestamp("last_password_change"),
  loginAttempts: integer("login_attempts").default(0),
  isLocked: boolean("is_locked").default(false),
  lockedUntil: timestamp("locked_until"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  createdBy: integer("created_by").references(() => authUsers.id), // Made nullable
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const exporterDocuments = pgTable("exporter_documents", {
  id: serial("id").primaryKey(),
  exporterId: integer("exporter_id").references(() => exporters.id).notNull(),
  documentType: text("document_type").notNull(), // business_registration, export_license, tax_certificate, customs_registration, quality_certificates
  documentName: text("document_name").notNull(),
  documentPath: text("document_path"), // file path or URL
  documentNumber: text("document_number"),
  issuedBy: text("issued_by"),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  verifiedBy: integer("verified_by").references(() => authUsers.id),
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const exporterTransactions = pgTable("exporter_transactions", {
  id: serial("id").primaryKey(),
  exporterId: integer("exporter_id").references(() => exporters.id).notNull(),
  commodityId: integer("commodity_id").references(() => commodities.id),
  transactionType: text("transaction_type").notNull(), // export_contract, shipment, payment, inquiry
  transactionAmount: decimal("transaction_amount", { precision: 12, scale: 2 }),
  currency: text("currency").default("USD"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  unit: text("unit"),
  pricePerUnit: decimal("price_per_unit", { precision: 8, scale: 2 }),
  destinationCountry: text("destination_country"),
  exportStatus: text("export_status").default("pending"), // pending, shipped, delivered, completed, cancelled
  paymentStatus: text("payment_status").default("pending"), // pending, paid, overdue, cancelled
  paymentMethod: text("payment_method"), // letter_of_credit, bank_transfer, advance_payment
  transactionDate: timestamp("transaction_date").notNull(),
  shipmentDate: timestamp("shipment_date"),
  deliveryDate: timestamp("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const buyerCredentials = pgTable("buyer_credentials", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").references(() => buyers.id).notNull(),
  username: text("username").notNull().unique(), // same as buyer_id
  passwordHash: text("password_hash").notNull(),
  temporaryPassword: text("temporary_password"), // for first login
  passwordChangeRequired: boolean("password_change_required").default(true),
  lastPasswordChange: timestamp("last_password_change"),
  loginAttempts: integer("login_attempts").default(0),
  isLocked: boolean("is_locked").default(false),
  lockedUntil: timestamp("locked_until"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  createdBy: integer("created_by").references(() => authUsers.id), // Made nullable
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const buyerDocuments = pgTable("buyer_documents", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").references(() => buyers.id).notNull(),
  documentType: text("document_type").notNull(), // business_registration, tax_certificate, trading_license, bank_statement, id_card
  documentName: text("document_name").notNull(),
  documentPath: text("document_path"), // file path or URL
  documentNumber: text("document_number"),
  issuedBy: text("issued_by"),
  issueDate: timestamp("issue_date"),
  expiryDate: timestamp("expiry_date"),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, rejected
  verifiedBy: integer("verified_by").references(() => authUsers.id),
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const buyerTransactions = pgTable("buyer_transactions", {
  id: serial("id").primaryKey(),
  buyerId: integer("buyer_id").references(() => buyers.id).notNull(),
  commodityId: integer("commodity_id").references(() => commodities.id),
  transactionType: text("transaction_type").notNull(), // purchase, inquiry, contract, payment
  transactionAmount: decimal("transaction_amount", { precision: 12, scale: 2 }),
  currency: text("currency").default("USD"),
  quantity: decimal("quantity", { precision: 10, scale: 2 }),
  unit: text("unit"),
  pricePerUnit: decimal("price_per_unit", { precision: 8, scale: 2 }),
  paymentStatus: text("payment_status").default("pending"), // pending, paid, overdue, cancelled
  paymentMethod: text("payment_method"), // cash, bank_transfer, mobile_money, credit
  transactionDate: timestamp("transaction_date").notNull(),
  deliveryDate: timestamp("delivery_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Buyer schema types and validation
export const insertBuyerSchema = createInsertSchema(buyers).omit({
  id: true,
  buyerId: true,
  loginCredentialsGenerated: true,
  passwordHash: true,
  onboardingStep: true,
  onboardingCompleted: true,
  complianceStatus: true,
  verificationStatus: true,
  kycStatus: true,
  portalAccess: true,
  accessLevel: true,
  assignedOfficer: true,
  approvedBy: true,
  approvedAt: true,
  riskRating: true,
  isActive: true,
  suspensionReason: true,
  suspendedBy: true,
  suspendedAt: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  profilePhotoUrl: true,
  businessCardFrontUrl: true,
  businessCardBackUrl: true,
});

export type Buyer = typeof buyers.$inferSelect;
export type InsertBuyer = z.infer<typeof insertBuyerSchema>;

// Exporter schema types and validation
export const insertExporterSchema = createInsertSchema(exporters).omit({
  id: true,
  exporterId: true,
  loginCredentialsGenerated: true,
  passwordHash: true,
  onboardingStep: true,
  onboardingCompleted: true,
  complianceStatus: true,
  verificationStatus: true,
  kycStatus: true,
  eudrComplianceStatus: true,
  portalAccess: true,
  accessLevel: true,
  assignedOfficer: true,
  approvedBy: true,
  approvedAt: true,
  riskRating: true,
  isActive: true,
  suspensionReason: true,
  suspendedBy: true,
  suspendedAt: true,
  createdAt: true,
  updatedAt: true,
});

export type ExporterCredential = typeof exporterCredentials.$inferSelect;
export type InsertExporterCredential = typeof exporterCredentials.$inferInsert;

export type ExporterDocument = typeof exporterDocuments.$inferSelect;
export type InsertExporterDocument = typeof exporterDocuments.$inferInsert;

export type ExporterTransaction = typeof exporterTransactions.$inferSelect;
export type InsertExporterTransaction = typeof exporterTransactions.$inferInsert;

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

// Certificate verification system
export const certificateVerifications = pgTable("certificate_verifications", {
  id: serial("id").primaryKey(),
  certificateId: integer("certificate_id").references(() => certifications.id),
  verificationCode: text("verification_code").notNull().unique(),
  verifiedBy: integer("verified_by").references(() => authUsers.id),
  verificationStatus: text("verification_status").notNull(), // pending, verified, rejected, expired
  verificationDate: timestamp("verification_date").defaultNow(),
  verificationNotes: text("verification_notes"),
  digitalSignature: text("digital_signature"),
  blockchainHash: text("blockchain_hash"),
  qrCodeData: text("qr_code_data"),
  expiryDate: timestamp("expiry_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User verification system for operators, officers, and registered users
export const userVerifications = pgTable("user_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => authUsers.id),
  verificationType: text("verification_type").notNull(), // identity, certification, license, background_check
  verificationStatus: text("verification_status").notNull(), // pending, verified, rejected, expired
  verifiedBy: integer("verified_by").references(() => authUsers.id),
  verificationDate: timestamp("verification_date").defaultNow(),
  documentType: text("document_type"), // passport, id_card, license, certificate
  documentNumber: text("document_number"),
  issuingAuthority: text("issuing_authority"),
  expiryDate: timestamp("expiry_date"),
  verificationNotes: text("verification_notes"),
  digitalSignature: text("digital_signature"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tracking system for real-time monitoring
export const trackingEvents = pgTable("tracking_events", {
  id: serial("id").primaryKey(),
  trackingId: text("tracking_id").notNull(),
  eventType: text("event_type").notNull(), // pickup, transit, delivery, inspection, verification
  eventStatus: text("event_status").notNull(), // pending, in_progress, completed, failed
  location: text("location"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  timestamp: timestamp("timestamp").defaultNow(),
  userId: integer("user_id").references(() => authUsers.id),
  commodityId: integer("commodity_id").references(() => commodities.id),
  vehicleId: text("vehicle_id"),
  notes: text("notes"),
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Real-time verification logs
export const verificationLogs = pgTable("verification_logs", {
  id: serial("id").primaryKey(),
  verificationId: integer("verification_id"),
  verificationType: text("verification_type").notNull(), // certificate, user, tracking
  action: text("action").notNull(), // created, updated, verified, rejected
  performedBy: integer("performed_by").references(() => authUsers.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
  details: text("details"),
  previousState: text("previous_state"),
  newState: text("new_state"),
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

// === AGRITRACE WORKFLOW SYSTEM ===

export const agriTraceWorkflows = pgTable("agri_trace_workflows", {
  id: serial("id").primaryKey(),
  workflowName: text("workflow_name").notNull(),
  workflowType: text("workflow_type").notNull(), // seed_to_export, compliance_verification, quality_assurance, traceability_chain
  status: text("status").notNull().default("active"), // active, paused, completed, failed
  priority: integer("priority").default(3), // 1=critical, 2=high, 3=medium, 4=low, 5=minimal
  farmerId: text("farmer_id").notNull(),
  commodityId: integer("commodity_id").references(() => commodities.id),
  currentStage: text("current_stage").notNull(), // seeding, growing, harvesting, processing, inspection, certification, export
  stageProgress: integer("stage_progress").default(0), // 0-100 percentage
  totalStages: integer("total_stages").default(7),
  completedStages: integer("completed_stages").default(0),
  estimatedCompletion: timestamp("estimated_completion"),
  actualCompletion: timestamp("actual_completion"),
  assignedInspector: text("assigned_inspector"),
  complianceScore: decimal("compliance_score", { precision: 5, scale: 2 }), // 0-100
  qualityMetrics: jsonb("quality_metrics"), // JSON with quality measurements
  traceabilityData: jsonb("traceability_data"), // Complete supply chain trace
  gpsTracking: jsonb("gps_tracking"), // Array of GPS coordinates through workflow
  automatedAlerts: boolean("automated_alerts").default(true),
  workflowConfiguration: jsonb("workflow_configuration"), // Custom workflow settings
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agriTraceStages = pgTable("agri_trace_stages", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => agriTraceWorkflows.id).notNull(),
  stageName: text("stage_name").notNull(),
  stageOrder: integer("stage_order").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, failed, skipped
  startDate: timestamp("start_date"),
  completionDate: timestamp("completion_date"),
  duration: integer("duration"), // hours
  assignedTo: text("assigned_to"),
  requirements: jsonb("requirements"), // Required actions/documents
  completionData: jsonb("completion_data"), // Data collected during stage
  verificationStatus: text("verification_status").default("unverified"), // unverified, verified, rejected
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  gpsLocation: text("gps_location"),
  photosUploaded: integer("photos_uploaded").default(0),
  documentsUploaded: integer("documents_uploaded").default(0),
  qualityChecks: jsonb("quality_checks"),
  compliance: jsonb("compliance"), // Compliance checks for this stage
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agriTraceEvents = pgTable("agri_trace_events", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => agriTraceWorkflows.id).notNull(),
  stageId: integer("stage_id").references(() => agriTraceStages.id),
  eventType: text("event_type").notNull(), // stage_start, stage_complete, quality_check, compliance_check, alert, manual_entry
  eventName: text("event_name").notNull(),
  eventData: jsonb("event_data"), // Event-specific data
  triggeredBy: text("triggered_by").notNull(), // user_id or system
  triggerType: text("trigger_type").notNull(), // manual, automatic, scheduled, sensor
  gpsCoordinates: text("gps_coordinates"),
  deviceId: text("device_id"), // Mobile device or sensor ID
  severity: text("severity").default("info"), // info, warning, error, critical
  isAutomated: boolean("is_automated").default(false),
  requiresAction: boolean("requires_action").default(false),
  actionTaken: text("action_taken"),
  eventTimestamp: timestamp("event_timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agriTraceDocuments = pgTable("agri_trace_documents", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => agriTraceWorkflows.id).notNull(),
  stageId: integer("stage_id").references(() => agriTraceStages.id),
  documentType: text("document_type").notNull(), // photo, certificate, inspection_report, compliance_doc, quality_test
  documentName: text("document_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"), // bytes
  mimeType: text("mime_type"),
  uploadedBy: text("uploaded_by").notNull(),
  description: text("description"),
  tags: text("tags"), // comma-separated tags
  isRequired: boolean("is_required").default(false),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  gpsLocation: text("gps_location"), // Where photo/document was taken
  metadata: jsonb("metadata"), // EXIF data, timestamps, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const agriTraceQualityMetrics = pgTable("agri_trace_quality_metrics", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => agriTraceWorkflows.id).notNull(),
  stageId: integer("stage_id").references(() => agriTraceStages.id),
  metricType: text("metric_type").notNull(), // moisture_content, bean_size, color_grade, purity, density, acidity
  metricName: text("metric_name").notNull(),
  value: decimal("value", { precision: 10, scale: 3 }).notNull(),
  unit: text("unit").notNull(),
  standardValue: decimal("standard_value", { precision: 10, scale: 3 }), // Expected/standard value
  tolerance: decimal("tolerance", { precision: 5, scale: 2 }), // Acceptable variance
  status: text("status").notNull(), // pass, fail, warning, not_tested
  testMethod: text("test_method"),
  testEquipment: text("test_equipment"),
  testedBy: text("tested_by").notNull(),
  testDate: timestamp("test_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const agriTraceCompliance = pgTable("agri_trace_compliance", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => agriTraceWorkflows.id).notNull(),
  complianceType: text("compliance_type").notNull(), // eudr, organic, fair_trade, local_regulations, export_standards
  requirement: text("requirement").notNull(),
  status: text("status").notNull(), // compliant, non_compliant, pending, not_applicable
  evidence: jsonb("evidence"), // Supporting documents/data
  assessedBy: text("assessed_by").notNull(),
  assessmentDate: timestamp("assessment_date").defaultNow(),
  expiryDate: timestamp("expiry_date"),
  remedialActions: text("remedial_actions"),
  completionDeadline: timestamp("completion_deadline"),
  priority: integer("priority").default(3), // 1=critical, 5=minimal
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AgriTrace Schema Exports
export const insertAgriTraceWorkflowSchema = createInsertSchema(agriTraceWorkflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgriTraceStageSchema = createInsertSchema(agriTraceStages).omit({
  id: true,
  createdAt: true,
});

export const insertAgriTraceEventSchema = createInsertSchema(agriTraceEvents).omit({
  id: true,
  createdAt: true,
  eventTimestamp: true,
});

export const insertAgriTraceDocumentSchema = createInsertSchema(agriTraceDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertAgriTraceQualityMetricSchema = createInsertSchema(agriTraceQualityMetrics).omit({
  id: true,
  createdAt: true,
  testDate: true,
});

export const insertAgriTraceComplianceSchema = createInsertSchema(agriTraceCompliance).omit({
  id: true,
  createdAt: true,
  assessmentDate: true,
});

// AgriTrace Types
export type AgriTraceWorkflow = typeof agriTraceWorkflows.$inferSelect;
export type InsertAgriTraceWorkflow = z.infer<typeof insertAgriTraceWorkflowSchema>;
export type AgriTraceStage = typeof agriTraceStages.$inferSelect;
export type InsertAgriTraceStage = z.infer<typeof insertAgriTraceStageSchema>;
export type AgriTraceEvent = typeof agriTraceEvents.$inferSelect;
export type InsertAgriTraceEvent = z.infer<typeof insertAgriTraceEventSchema>;
export type AgriTraceDocument = typeof agriTraceDocuments.$inferSelect;
export type InsertAgriTraceDocument = z.infer<typeof insertAgriTraceDocumentSchema>;
export type AgriTraceQualityMetric = typeof agriTraceQualityMetrics.$inferSelect;
export type InsertAgriTraceQualityMetric = z.infer<typeof insertAgriTraceQualityMetricSchema>;
export type AgriTraceCompliance = typeof agriTraceCompliance.$inferSelect;
export type InsertAgriTraceCompliance = z.infer<typeof insertAgriTraceComplianceSchema>;

// Import payment schemas
export * from './payment-schema';

// Exporter types from the comprehensive management system above
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

export const insertExportOrderSchema = createInsertSchema(exportOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Farm Management Platform types (legacy support - already defined in Multiple Land Mapping section above)


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

// Verification system insert schemas
export const insertCertificateVerificationSchema = createInsertSchema(certificateVerifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserVerificationSchema = createInsertSchema(userVerifications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrackingEventSchema = createInsertSchema(trackingEvents).omit({
  id: true,
  createdAt: true,
});

export const insertVerificationLogSchema = createInsertSchema(verificationLogs).omit({
  id: true,
});

// Verification system types
export type CertificateVerification = typeof certificateVerifications.$inferSelect;
export type UserVerification = typeof userVerifications.$inferSelect;
export type TrackingEvent = typeof trackingEvents.$inferSelect;
export type VerificationLog = typeof verificationLogs.$inferSelect;

export type InsertCertificateVerification = z.infer<typeof insertCertificateVerificationSchema>;
export type InsertUserVerification = z.infer<typeof insertUserVerificationSchema>;
export type InsertTrackingEvent = z.infer<typeof insertTrackingEventSchema>;
export type InsertVerificationLog = z.infer<typeof insertVerificationLogSchema>;

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

// =============================================
// INTERNAL MESSAGING SYSTEM TABLES
// =============================================

// Internal Messaging System
export const internalMessages = pgTable("internal_messages", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").notNull().unique(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  priority: text("priority").notNull().default("normal"), // low, normal, high, urgent
  messageType: text("message_type").notNull().default("general"), // general, request, alert, announcement, support
  
  // Sender information
  senderId: text("sender_id").notNull(),
  senderName: text("sender_name").notNull(),
  senderType: text("sender_type").notNull(), // farmer, field_agent, exporter, regulatory_admin, director
  senderPortal: text("sender_portal").notNull(), // farmer_portal, field_agent_portal, exporter_portal, regulatory_portal
  
  // Recipient information
  recipientId: text("recipient_id"),
  recipientName: text("recipient_name"),
  recipientType: text("recipient_type"), // farmer, field_agent, exporter, regulatory_admin, director, all_users
  recipientPortal: text("recipient_portal"), // farmer_portal, field_agent_portal, exporter_portal, regulatory_portal, all_portals
  
  // Message status
  status: text("status").notNull().default("sent"), // sent, delivered, read, replied, archived
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  
  // Threading and replies
  threadId: text("thread_id"), // for grouping related messages
  parentMessageId: text("parent_message_id"), // for replies
  hasReplies: boolean("has_replies").default(false),
  
  // Attachments and metadata
  attachments: jsonb("attachments"), // file attachments info
  metadata: jsonb("metadata"), // additional data like location, commodity reference, etc.
  
  // Scheduling and expiry
  scheduledFor: timestamp("scheduled_for"), // for scheduled messages
  expiresAt: timestamp("expires_at"), // for temporary messages
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Message Recipients table for group messages
export const messageRecipients = pgTable("message_recipients", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").notNull().references(() => internalMessages.messageId),
  recipientId: text("recipient_id").notNull(),
  recipientName: text("recipient_name").notNull(),
  recipientType: text("recipient_type").notNull(),
  recipientPortal: text("recipient_portal").notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  deliveredAt: timestamp("delivered_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Message Templates for common message types
export const messageTemplates = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  templateId: text("template_id").notNull().unique(),
  templateName: text("template_name").notNull(),
  templateType: text("template_type").notNull(), // inspection_reminder, compliance_alert, harvest_notification, etc.
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  variables: jsonb("variables"), // placeholders that can be replaced
  applicableRoles: jsonb("applicable_roles"), // which user types can use this template
  isActive: boolean("is_active").default(true),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Internal messaging insert schemas
export const insertInternalMessageSchema = createInsertSchema(internalMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageRecipientSchema = createInsertSchema(messageRecipients).omit({
  id: true,
  deliveredAt: true,
  createdAt: true,
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Internal messaging types
export type InternalMessage = typeof internalMessages.$inferSelect;
export type MessageRecipient = typeof messageRecipients.$inferSelect;
export type MessageTemplate = typeof messageTemplates.$inferSelect;

export type InsertInternalMessage = z.infer<typeof insertInternalMessageSchema>;
export type InsertMessageRecipient = z.infer<typeof insertMessageRecipientSchema>;
export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;

// ========================================
// EUDR COMPLIANCE PACK SYSTEM
// ========================================

export const eudrCompliancePacks = pgTable("eudr_compliance_packs", {
  id: serial("id").primaryKey(),
  packId: text("pack_id").notNull().unique(),
  shipmentId: text("shipment_id").notNull(),
  farmerId: text("farmer_id").notNull(),
  farmerName: text("farmer_name").notNull(),
  exporterId: text("exporter_id").notNull(),
  exporterName: text("exporter_name").notNull(),
  exporterRegistration: text("exporter_registration").notNull(),
  commodity: text("commodity").notNull(),
  hsCode: text("hs_code").notNull(),
  totalWeight: decimal("total_weight", { precision: 10, scale: 2 }).notNull(),
  harvestPeriod: text("harvest_period").notNull(),
  destination: text("destination").notNull(),
  farmIds: jsonb("farm_ids").notNull(), // array of farm IDs
  gpsCoordinates: text("gps_coordinates").notNull(),
  complianceStatus: text("compliance_status").notNull(), // compliant, non_compliant, pending
  riskClassification: text("risk_classification").notNull(), // low, medium, high
  deforestationRisk: text("deforestation_risk").notNull(), // none, low, medium, high
  complianceScore: integer("compliance_score").notNull(), // 0-100
  forestProtectionScore: integer("forest_protection_score").notNull(), // 0-100
  documentationScore: integer("documentation_score").notNull(), // 0-100
  overallRiskScore: integer("overall_risk_score").notNull(), // 0-100
  forestCoverChange: decimal("forest_cover_change", { precision: 5, scale: 2 }), // percentage
  carbonStockImpact: decimal("carbon_stock_impact", { precision: 5, scale: 2 }), // percentage
  biodiversityImpactLevel: text("biodiversity_impact_level"), // low, medium, high
  satelliteDataSource: text("satellite_data_source").notNull(),
  packGeneratedAt: timestamp("pack_generated_at").defaultNow(),
  issuedBy: text("issued_by").notNull().default("LACRA"),
  certifiedBy: text("certified_by").notNull().default("ECOENVIROS"),
  storageExpiryDate: timestamp("storage_expiry_date").notNull(), // 5 years from generation
  auditReadyStatus: boolean("audit_ready_status").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eudrComplianceDocuments = pgTable("eudr_compliance_documents", {
  id: serial("id").primaryKey(),
  packId: text("pack_id").references(() => eudrCompliancePacks.packId).notNull(),
  documentType: text("document_type").notNull(), // cover_sheet, export_certificate, compliance_assessment, deforestation_report, dds, traceability_report
  documentNumber: text("document_number").notNull(),
  title: text("title").notNull(),
  referenceNumber: text("reference_number").notNull(),
  issuedBy: text("issued_by").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  pdfContent: text("pdf_content"), // base64 encoded PDF or file path
  documentStatus: text("document_status").default("active"), // active, archived, superseded
  createdAt: timestamp("created_at").defaultNow(),
});

// EUDR Compliance Pack schemas
export const insertEudrCompliancePackSchema = createInsertSchema(eudrCompliancePacks).omit({
  id: true,
  packGeneratedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEudrComplianceDocumentSchema = createInsertSchema(eudrComplianceDocuments).omit({
  id: true,
  generatedAt: true,
  createdAt: true,
});

// EUDR Compliance Pack types
export type EudrCompliancePack = typeof eudrCompliancePacks.$inferSelect;
export type EudrComplianceDocument = typeof eudrComplianceDocuments.$inferSelect;
export type InsertEudrCompliancePack = z.infer<typeof insertEudrCompliancePackSchema>;
export type InsertEudrComplianceDocument = z.infer<typeof insertEudrComplianceDocumentSchema>;

// ========================================
// CERTIFICATE APPROVAL SYSTEM
// ========================================

export const certificateApprovals = pgTable("certificate_approvals", {
  id: serial("id").primaryKey(),
  certificateType: varchar("certificate_type", { length: 100 }).notNull(),
  certificateNumber: varchar("certificate_number", { length: 100 }).notNull().unique(),
  requestedBy: varchar("requested_by", { length: 100 }).notNull(), // farmer_id, exporter_id etc
  requestedByType: varchar("requested_by_type", { length: 50 }).notNull(), // "farmer", "exporter", "agent"
  inspectorReport: jsonb("inspector_report"), // Inspector findings and recommendation
  inspectorId: varchar("inspector_id", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("pending"), // "pending", "approved", "rejected", "sent"
  directorId: varchar("director_id", { length: 100 }), // Who approved/rejected
  approvalDate: timestamp("approval_date"),
  rejectionReason: text("rejection_reason"),
  certificateData: jsonb("certificate_data").notNull(), // Complete certificate data
  priority: integer("priority").default(2), // 1=urgent, 2=normal, 3=low
  workflowId: integer("workflow_id").references(() => agriTraceWorkflows.id),
  sentDate: timestamp("sent_date"),
  recipientEmail: varchar("recipient_email", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const certificateTypes = pgTable("certificate_types", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(), // "eudr_pack", "individual", "export", "compliance"
  description: text("description"),
  requiresInspectorApproval: boolean("requires_inspector_approval").default(true),
  requiresDirectorApproval: boolean("requires_director_approval").default(true),
  averageProcessingDays: integer("average_processing_days").default(3),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Inspector Management System Tables
export const inspectors = pgTable("inspectors", {
  id: serial("id").primaryKey(),
  inspectorId: text("inspector_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").unique(),
  phoneNumber: text("phone_number").notNull(),
  nationalId: text("national_id").notNull().unique(),
  address: text("address").notNull(),
  profilePicture: text("profile_picture"), // Object storage path
  inspectorType: text("inspector_type").notNull().default("land"), // land, port
  inspectionAreaCounty: text("inspection_area_county").notNull(),
  inspectionAreaDistrict: text("inspection_area_district"),
  inspectionAreaDescription: text("inspection_area_description"),
  portFacility: text("port_facility"), // for port inspectors - which port/facility
  specializations: text("specializations"), // comma separated: cocoa,coffee,palm_oil,etc
  certificationLevel: text("certification_level").notNull().default("junior"), // junior, senior, lead, expert
  isActive: boolean("is_active").default(true),
  canLogin: boolean("can_login").default(true),
  loginCredentials: jsonb("login_credentials"), // encrypted login info
  assignedBy: text("assigned_by").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inspectorAreaAssignments = pgTable("inspector_area_assignments", {
  id: serial("id").primaryKey(),
  inspectorId: text("inspector_id").references(() => inspectors.inspectorId).notNull(),
  county: text("county").notNull(),
  district: text("district"),
  areaDescription: text("area_description"),
  areaType: text("area_type").notNull(), // primary, secondary, temporary
  isPrimary: boolean("is_primary").default(false),
  effectiveFrom: timestamp("effective_from").notNull(),
  effectiveUntil: timestamp("effective_until"),
  assignedBy: text("assigned_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inspectorCredentials = pgTable("inspector_credentials", {
  id: serial("id").primaryKey(),
  inspectorId: text("inspector_id").references(() => inspectors.inspectorId).notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  inspectorType: text("inspector_type").notNull().default("land"), // land, port
  resetToken: text("reset_token"),
  resetTokenExpires: timestamp("reset_token_expires"),
  mustChangePassword: boolean("must_change_password").default(true),
  lastPasswordChange: timestamp("last_password_change"),
  failedLoginAttempts: integer("failed_login_attempts").default(0),
  lockedUntil: timestamp("locked_until"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const inspectorActivities = pgTable("inspector_activities", {
  id: serial("id").primaryKey(),
  inspectorId: text("inspector_id").references(() => inspectors.inspectorId).notNull(),
  activityType: text("activity_type").notNull(), // login, logout, inspection, report_submission, profile_update
  description: text("description").notNull(),
  location: text("location"), // GPS coordinates
  county: text("county"),
  district: text("district"),
  metadata: jsonb("metadata"), // additional activity data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Inspector Management System insert schemas
export const insertInspectorSchema = createInsertSchema(inspectors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInspectorAreaAssignmentSchema = createInsertSchema(inspectorAreaAssignments).omit({
  id: true,
  createdAt: true,
});

export const insertInspectorCredentialsSchema = createInsertSchema(inspectorCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInspectorActivitySchema = createInsertSchema(inspectorActivities).omit({
  id: true,
  timestamp: true,
});

// Inspector Management System types
export type Inspector = typeof inspectors.$inferSelect;
export type InsertInspector = z.infer<typeof insertInspectorSchema>;
export type InspectorAreaAssignment = typeof inspectorAreaAssignments.$inferSelect;
export type InsertInspectorAreaAssignment = z.infer<typeof insertInspectorAreaAssignmentSchema>;
export type InspectorCredentials = typeof inspectorCredentials.$inferSelect;
export type InsertInspectorCredentials = z.infer<typeof insertInspectorCredentialsSchema>;
export type InspectorActivity = typeof inspectorActivities.$inferSelect;
export type InsertInspectorActivity = z.infer<typeof insertInspectorActivitySchema>;

export type CertificateApproval = typeof certificateApprovals.$inferSelect;
export type InsertCertificateApproval = typeof certificateApprovals.$inferInsert;
export type CertificateType = typeof certificateTypes.$inferSelect;
export type InsertCertificateType = typeof certificateTypes.$inferInsert;

// Additional buyer and exporter schema types already defined above


