import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  decimal,
  timestamp,
  text,
  boolean,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Payment Services Table
export const paymentServices = pgTable("payment_services", {
  id: serial("id").primaryKey(),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(), // export_permit, license, certification, monitoring
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  lacraShare: decimal("lacra_share_percentage", { precision: 5, scale: 2 }).notNull(), // e.g., 80.00 for 80%
  poliposShare: decimal("polipus_share_percentage", { precision: 5, scale: 2 }).notNull(), // e.g., 20.00 for 20%
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment Transactions Table
export const paymentTransactions = pgTable("payment_transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 255 }).unique().notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  serviceId: integer("service_id").references(() => paymentServices.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  lacraAmount: decimal("lacra_amount", { precision: 10, scale: 2 }).notNull(),
  poliposAmount: decimal("polipus_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  paymentMethod: varchar("payment_method", { length: 100 }), // card, bank_transfer, mobile_money, etc.
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"), // pending, completed, failed, refunded
  customerEmail: varchar("customer_email", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }),
  paymentMetadata: jsonb("payment_metadata"), // Additional payment details
  stripeMetadata: jsonb("stripe_metadata"), // Stripe-specific data
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Revenue Splits Table (for tracking actual splits)
export const revenueSplits = pgTable("revenue_splits", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 255 }).references(() => paymentTransactions.transactionId),
  recipientType: varchar("recipient_type", { length: 50 }).notNull(), // lacra, polipus
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  stripeTransferId: varchar("stripe_transfer_id", { length: 255 }),
  transferStatus: varchar("transfer_status", { length: 50 }).default("pending"), // pending, completed, failed
  transferredAt: timestamp("transferred_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const paymentServicesRelations = relations(paymentServices, ({ many }) => ({
  transactions: many(paymentTransactions),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one, many }) => ({
  service: one(paymentServices, {
    fields: [paymentTransactions.serviceId],
    references: [paymentServices.id],
  }),
  splits: many(revenueSplits),
}));

export const revenueSplitsRelations = relations(revenueSplits, ({ one }) => ({
  transaction: one(paymentTransactions, {
    fields: [revenueSplits.transactionId],
    references: [paymentTransactions.transactionId],
  }),
}));

// Zod schemas
export const insertPaymentServiceSchema = createInsertSchema(paymentServices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertRevenueSplitSchema = createInsertSchema(revenueSplits).omit({
  id: true,
  createdAt: true,
  transferredAt: true,
});

// Types
export type PaymentService = typeof paymentServices.$inferSelect;
export type InsertPaymentService = z.infer<typeof insertPaymentServiceSchema>;

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;

export type RevenueSplit = typeof revenueSplits.$inferSelect;
export type InsertRevenueSplit = z.infer<typeof insertRevenueSplitSchema>;