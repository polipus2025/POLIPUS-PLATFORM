import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCommoditySchema, 
  insertInspectionSchema, 
  insertCertificationSchema,
  insertAlertSchema,
  insertReportSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard routes
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  app.get("/api/dashboard/compliance-by-county", async (req, res) => {
    try {
      const data = await storage.getComplianceDataByCounty();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch compliance data by county" });
    }
  });

  // Commodity routes
  app.get("/api/commodities", async (req, res) => {
    try {
      const { county, type } = req.query;
      let commodities;
      
      if (county) {
        commodities = await storage.getCommoditiesByCounty(county as string);
      } else if (type) {
        commodities = await storage.getCommoditiesByType(type as string);
      } else {
        commodities = await storage.getCommodities();
      }
      
      res.json(commodities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commodities" });
    }
  });

  app.get("/api/commodities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const commodity = await storage.getCommodity(id);
      
      if (!commodity) {
        return res.status(404).json({ message: "Commodity not found" });
      }
      
      res.json(commodity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commodity" });
    }
  });

  app.post("/api/commodities", async (req, res) => {
    try {
      const validatedData = insertCommoditySchema.parse(req.body);
      const commodity = await storage.createCommodity(validatedData);
      res.status(201).json(commodity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create commodity" });
    }
  });

  app.put("/api/commodities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const commodity = await storage.updateCommodity(id, updates);
      
      if (!commodity) {
        return res.status(404).json({ message: "Commodity not found" });
      }
      
      res.json(commodity);
    } catch (error) {
      res.status(500).json({ message: "Failed to update commodity" });
    }
  });

  app.delete("/api/commodities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCommodity(id);
      
      if (!success) {
        return res.status(404).json({ message: "Commodity not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete commodity" });
    }
  });

  // Inspection routes
  app.get("/api/inspections", async (req, res) => {
    try {
      const { commodityId, inspectorId } = req.query;
      let inspections;
      
      if (commodityId) {
        inspections = await storage.getInspectionsByCommodity(parseInt(commodityId as string));
      } else if (inspectorId) {
        inspections = await storage.getInspectionsByInspector(inspectorId as string);
      } else {
        inspections = await storage.getInspections();
      }
      
      res.json(inspections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inspections" });
    }
  });

  app.get("/api/inspections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const inspection = await storage.getInspection(id);
      
      if (!inspection) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      
      res.json(inspection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inspection" });
    }
  });

  app.post("/api/inspections", async (req, res) => {
    try {
      const validatedData = insertInspectionSchema.parse(req.body);
      const inspection = await storage.createInspection(validatedData);
      res.status(201).json(inspection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inspection" });
    }
  });

  app.put("/api/inspections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const inspection = await storage.updateInspection(id, updates);
      
      if (!inspection) {
        return res.status(404).json({ message: "Inspection not found" });
      }
      
      res.json(inspection);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inspection" });
    }
  });

  // Certification routes
  app.get("/api/certifications", async (req, res) => {
    try {
      const { commodityId } = req.query;
      let certifications;
      
      if (commodityId) {
        certifications = await storage.getCertificationsByCommodity(parseInt(commodityId as string));
      } else {
        certifications = await storage.getCertifications();
      }
      
      res.json(certifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.get("/api/certifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const certification = await storage.getCertification(id);
      
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      
      res.json(certification);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certification" });
    }
  });

  app.post("/api/certifications", async (req, res) => {
    try {
      const validatedData = insertCertificationSchema.parse(req.body);
      const certification = await storage.createCertification(validatedData);
      res.status(201).json(certification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create certification" });
    }
  });

  app.put("/api/certifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const certification = await storage.updateCertification(id, updates);
      
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      
      res.json(certification);
    } catch (error) {
      res.status(500).json({ message: "Failed to update certification" });
    }
  });

  // Alert routes
  app.get("/api/alerts", async (req, res) => {
    try {
      const { unreadOnly } = req.query;
      let alerts;
      
      if (unreadOnly === 'true') {
        alerts = await storage.getUnreadAlerts();
      } else {
        alerts = await storage.getAlerts();
      }
      
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", async (req, res) => {
    try {
      const validatedData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  app.put("/api/alerts/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markAlertAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Report routes
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
