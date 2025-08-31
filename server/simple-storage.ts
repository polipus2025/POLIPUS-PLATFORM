import { db } from "./db";
import { farmers, commodities, type Farmer, type Commodity, type InsertFarmer, type InsertCommodity } from "../shared/simple-schema";
import { eq, desc } from "drizzle-orm";

export class SimpleStorage {
  // Farmer methods
  async getFarmers(): Promise<Farmer[]> {
    return await db.select().from(farmers).orderBy(desc(farmers.createdAt));
  }

  async getFarmer(id: number): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.id, id));
    return farmer || undefined;
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const [newFarmer] = await db.insert(farmers).values(farmer).returning();
    return newFarmer;
  }

  // Commodity methods
  async getCommodities(): Promise<Commodity[]> {
    return await db.select().from(commodities).orderBy(desc(commodities.createdAt));
  }

  async getCommodity(id: number): Promise<Commodity | undefined> {
    const [commodity] = await db.select().from(commodities).where(eq(commodities.id, id));
    return commodity || undefined;
  }

  async createCommodity(commodity: InsertCommodity): Promise<Commodity> {
    const [newCommodity] = await db.insert(commodities).values(commodity).returning();
    return newCommodity;
  }
}

export const storage = new SimpleStorage();