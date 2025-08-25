// ====================================
// WAREHOUSE CUSTODY & AUTHORIZATION SYSTEM
// ====================================
import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const warehouseCustody = pgTable("warehouse_custody", {
  id: serial("id").primaryKey(),
  custodyId: varchar("custody_id").notNull().unique(), // CUSTODY-WH-MARGIBI-YYYYMMDD-XXX
  buyerId: varchar("buyer_id").notNull(),
  buyerName: varchar("buyer_name").notNull(),
  buyerCompany: varchar("buyer_company"),
  productQrCode: varchar("product_qr_code").notNull(), // QR code from bags
  verificationCode: varchar("verification_code").notNull(), // Original transaction verification code
  warehouseId: varchar("warehouse_id").notNull(), // WH-MARGIBI-001, etc.
  warehouseName: varchar("warehouse_name").notNull(),
  county: varchar("county").notNull(),
  
  // Product Details
  commodityType: varchar("commodity_type").notNull(),
  farmerName: varchar("farmer_name").notNull(),
  farmLocation: varchar("farm_location"),
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit").notNull().default("tons"),
  qualityGrade: varchar("quality_grade"),
  
  // Storage Details
  storageLocation: varchar("storage_location"), // Section A-1, Block B-2, etc.
  storageConditions: varchar("storage_conditions"), // temperature, humidity requirements
  dailyStorageRate: decimal("daily_storage_rate", { precision: 8, scale: 2 }).notNull(), // USD per ton per day
  
  // Status & Dates
  registrationDate: timestamp("registration_date").defaultNow(),
  custodyStatus: varchar("custody_status").notNull().default("stored"), // stored, authorized, released
  authorizationStatus: varchar("authorization_status").notNull().default("pending"), // pending, authorized, rejected
  maxStorageDays: integer("max_storage_days").notNull().default(30),
  actualStorageDays: integer("actual_storage_days").default(0),
  
  // Authorization Details
  authorizationRequestDate: timestamp("authorization_request_date"),
  authorizedDate: timestamp("authorized_date"),
  authorizedBy: varchar("authorized_by"), // warehouse inspector who authorized
  authorizationNotes: text("authorization_notes"),
  
  releaseDate: timestamp("release_date"),
  releasedTo: varchar("released_to"), // exporter name or buyer action
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storageFees = pgTable("storage_fees", {
  id: serial("id").primaryKey(),
  custodyId: varchar("custody_id").references(() => warehouseCustody.custodyId).notNull(),
  
  // Fee Calculation
  dailyRate: decimal("daily_rate", { precision: 8, scale: 2 }).notNull(), // USD per ton per day
  daysStored: integer("days_stored").notNull(),
  totalWeight: decimal("total_weight", { precision: 10, scale: 2 }).notNull(),
  calculatedAmount: decimal("calculated_amount", { precision: 10, scale: 2 }).notNull(), // daily_rate * days * weight
  
  // Payment Status
  amountDue: decimal("amount_due", { precision: 10, scale: 2 }).notNull(),
  amountPaid: decimal("amount_paid", { precision: 10, scale: 2 }).default("0"),
  paymentStatus: varchar("payment_status").notNull().default("pending"), // pending, partial, paid
  
  // Payment Details
  paymentMethod: varchar("payment_method"), // cash, bank_transfer, mobile_money
  paymentReference: varchar("payment_reference"), // transaction ID
  paidDate: timestamp("paid_date"),
  paidBy: varchar("paid_by"), // buyer who made payment
  
  // Fee Period
  feeStartDate: timestamp("fee_start_date").notNull(),
  feeEndDate: timestamp("fee_end_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const authorizationRequests = pgTable("authorization_requests", {
  id: serial("id").primaryKey(),
  requestId: varchar("request_id").notNull().unique(), // AUTH-REQ-YYYYMMDD-XXX
  custodyId: varchar("custody_id").references(() => warehouseCustody.custodyId).notNull(),
  buyerId: varchar("buyer_id").notNull(),
  
  // Request Details
  requestType: varchar("request_type").notNull().default("general"), // general authorization to sell
  requestReason: text("request_reason"),
  urgentRequest: boolean("urgent_request").default(false),
  
  // Status
  status: varchar("status").notNull().default("pending"), // pending, approved, rejected
  requestedDate: timestamp("requested_date").defaultNow(),
  
  // Warehouse Response
  reviewedBy: varchar("reviewed_by"), // warehouse inspector
  reviewedDate: timestamp("reviewed_date"),
  approvalNotes: text("approval_notes"),
  rejectionReason: text("rejection_reason"),
  
  // Prerequisites Check
  feesVerified: boolean("fees_verified").default(false),
  storageConditionOk: boolean("storage_condition_ok").default(false),
  documentationComplete: boolean("documentation_complete").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema for inserts
export const insertWarehouseCustodySchema = createInsertSchema(warehouseCustody).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStorageFeesSchema = createInsertSchema(storageFees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuthorizationRequestSchema = createInsertSchema(authorizationRequests).omit({
  id: true,
  createdAt: true,
});

// Warehouse Custody System Types
export type WarehouseCustody = typeof warehouseCustody.$inferSelect;
export type NewWarehouseCustody = z.infer<typeof insertWarehouseCustodySchema>;
export type StorageFees = typeof storageFees.$inferSelect;
export type NewStorageFees = z.infer<typeof insertStorageFeesSchema>;
export type AuthorizationRequest = typeof authorizationRequests.$inferSelect;
export type NewAuthorizationRequest = z.infer<typeof insertAuthorizationRequestSchema>;