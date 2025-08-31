import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const farmers = pgTable("farmers", {
  id: serial("id").primaryKey(),
  farmerId: text("farmer_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  county: text("county").notNull(),
  district: text("district"),
  village: text("village"),
  phoneNumber: text("phone_number"),
  email: text("email"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const commodities = pgTable("commodities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Farmer = typeof farmers.$inferSelect;
export type Commodity = typeof commodities.$inferSelect;
export type InsertFarmer = typeof farmers.$inferInsert;
export type InsertCommodity = typeof commodities.$inferInsert;

export const insertFarmerSchema = createInsertSchema(farmers);
export const insertCommoditySchema = createInsertSchema(commodities);