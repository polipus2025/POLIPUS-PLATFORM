import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
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
  title: text("title").notNull(),
  type: text("type").notNull(), // compliance, inspection, export, county
  parameters: text("parameters"), // JSON string of report parameters
  generatedBy: text("generated_by").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
  filePath: text("file_path"),
  status: text("status").notNull().default("pending"), // pending, completed, failed
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

export const procurement = pgTable("procurement", {
  id: serial("id").primaryKey(),
  procurementId: text("procurement_id").notNull().unique(),
  farmerId: integer("farmer_id").references(() => farmers.id).notNull(),
  cropType: text("crop_type").notNull(),
  quantityProcured: decimal("quantity_procured", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  qualityGrade: text("quality_grade").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  procurementDate: timestamp("procurement_date").notNull(),
  buyer: text("buyer").notNull(),
  paymentTerms: text("payment_terms"), // immediate, 30_days, 60_days
  paymentStatus: text("payment_status").default("pending"), // pending, partial, paid
  deliveryLocation: text("delivery_location"),
  transportationCost: decimal("transportation_cost", { precision: 10, scale: 2 }),
  qualityDeductions: decimal("quality_deductions", { precision: 10, scale: 2 }),
  finalSettlement: decimal("final_settlement", { precision: 12, scale: 2 }),
  settlementDate: timestamp("settlement_date"),
  status: text("status").notNull().default("pending"), // pending, completed, cancelled
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

export const insertProcurementSchema = createInsertSchema(procurement).omit({
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
export type Procurement = typeof procurement.$inferSelect;

// Farm Management Platform insert types
export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
export type InsertFarmPlot = z.infer<typeof insertFarmPlotSchema>;
export type InsertCropPlan = z.infer<typeof insertCropPlanSchema>;
export type InsertHarvestRecord = z.infer<typeof insertHarvestRecordSchema>;
export type InsertInputDistribution = z.infer<typeof insertInputDistributionSchema>;
export type InsertProcurement = z.infer<typeof insertProcurementSchema>;
