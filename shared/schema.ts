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

// Insert schemas
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
