import type { Express } from "express";
import { db } from "./db";
import { 
  // Live Trace - Livestock Monitoring
  livestock,
  livestockMovements,
  livestockAlerts,
  // Land Map360 - Land Mapping & Dispute Prevention
  landParcels,
  landDisputes,
  surveyRecords,
  // Mine Watch - Mineral Resource Protection
  miningOperations,
  communityImpacts,
  miningInspections,
  // Forest Guard - Forest Protection & Carbon Credits
  forestAreas,
  deforestationAlerts,
  carbonCredits,
  // Aqua Trace - Ocean & River Monitoring
  waterBodies,
  waterQualityMonitoring,
  fishingPermits,
  pollutionReports,
  // Blue Carbon 360 - Conservation Economics
  conservationProjects,
  carbonMarketplace,
  economicImpactTracking,
  // Carbon Trace - Environmental Monitoring
  emissionSources,
  emissionMeasurements,
  carbonOffset,
  environmentalAlerts
} from "@shared/schema";
import { eq, desc, and, or, like, count, sql } from "drizzle-orm";
import { z } from "zod";

// ========================================
// POLIPUS MODULES API ROUTES
// ========================================

export function registerPolipusRoutes(app: Express) {

  // ========================================
  // MODULE 2: LIVE TRACE - Livestock Monitoring
  // ========================================

  // Get all livestock
  app.get("/api/livestock", async (req, res) => {
    try {
      const animals = await db.select().from(livestock).orderBy(desc(livestock.createdAt));
      res.json(animals);
    } catch (error) {
      console.error("Error fetching livestock:", error);
      res.status(500).json({ message: "Failed to fetch livestock data" });
    }
  });

  // Get livestock by county
  app.get("/api/livestock/county/:county", async (req, res) => {
    try {
      const { county } = req.params;
      const animals = await db.select().from(livestock)
        .where(eq(livestock.county, county))
        .orderBy(desc(livestock.createdAt));
      res.json(animals);
    } catch (error) {
      console.error("Error fetching livestock by county:", error);
      res.status(500).json({ message: "Failed to fetch livestock data" });
    }
  });

  // Add new livestock
  app.post("/api/livestock", async (req, res) => {
    try {
      const animalData = {
        ...req.body,
        animalId: `LT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [newAnimal] = await db.insert(livestock).values(animalData).returning();
      res.status(201).json(newAnimal);
    } catch (error) {
      console.error("Error creating livestock:", error);
      res.status(500).json({ message: "Failed to create livestock record" });
    }
  });

  // Get livestock movements
  app.get("/api/livestock/movements/:animalId", async (req, res) => {
    try {
      const { animalId } = req.params;
      const movements = await db.select().from(livestockMovements)
        .where(eq(livestockMovements.animalId, animalId))
        .orderBy(desc(livestockMovements.movementDate));
      res.json(movements);
    } catch (error) {
      console.error("Error fetching livestock movements:", error);
      res.status(500).json({ message: "Failed to fetch movement data" });
    }
  });

  // Record livestock movement
  app.post("/api/livestock/movements", async (req, res) => {
    try {
      const movementData = {
        ...req.body,
        createdAt: new Date()
      };
      
      const [newMovement] = await db.insert(livestockMovements).values(movementData).returning();
      res.status(201).json(newMovement);
    } catch (error) {
      console.error("Error recording livestock movement:", error);
      res.status(500).json({ message: "Failed to record movement" });
    }
  });

  // Get livestock alerts
  app.get("/api/livestock/alerts", async (req, res) => {
    try {
      const alerts = await db.select().from(livestockAlerts)
        .orderBy(desc(livestockAlerts.createdAt));
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching livestock alerts:", error);
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });

  // Create livestock alert
  app.post("/api/livestock/alerts", async (req, res) => {
    try {
      const alertData = {
        ...req.body,
        createdAt: new Date()
      };
      
      const [newAlert] = await db.insert(livestockAlerts).values(alertData).returning();
      res.status(201).json(newAlert);
    } catch (error) {
      console.error("Error creating livestock alert:", error);
      res.status(500).json({ message: "Failed to create alert" });
    }
  });

  // ========================================
  // MODULE 3: LAND MAP360 - Land Mapping & Dispute Prevention
  // ========================================

  // Get all land parcels
  app.get("/api/land-parcels", async (req, res) => {
    try {
      const parcels = await db.select().from(landParcels).orderBy(desc(landParcels.createdAt));
      res.json(parcels);
    } catch (error) {
      console.error("Error fetching land parcels:", error);
      res.status(500).json({ message: "Failed to fetch land parcels" });
    }
  });

  // Get land parcels by county
  app.get("/api/land-parcels/county/:county", async (req, res) => {
    try {
      const { county } = req.params;
      const parcels = await db.select().from(landParcels)
        .where(eq(landParcels.county, county))
        .orderBy(desc(landParcels.createdAt));
      res.json(parcels);
    } catch (error) {
      console.error("Error fetching land parcels by county:", error);
      res.status(500).json({ message: "Failed to fetch land parcels" });
    }
  });

  // Register new land parcel
  app.post("/api/land-parcels", async (req, res) => {
    try {
      const parcelData = {
        ...req.body,
        parcelId: `LP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [newParcel] = await db.insert(landParcels).values(parcelData).returning();
      res.status(201).json(newParcel);
    } catch (error) {
      console.error("Error registering land parcel:", error);
      res.status(500).json({ message: "Failed to register land parcel" });
    }
  });

  // Get land disputes
  app.get("/api/land-disputes", async (req, res) => {
    try {
      const disputes = await db.select().from(landDisputes).orderBy(desc(landDisputes.submittedDate));
      res.json(disputes);
    } catch (error) {
      console.error("Error fetching land disputes:", error);
      res.status(500).json({ message: "Failed to fetch land disputes" });
    }
  });

  // Submit land dispute
  app.post("/api/land-disputes", async (req, res) => {
    try {
      const disputeData = {
        ...req.body,
        disputeId: `LD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        submittedDate: new Date(),
        createdAt: new Date()
      };
      
      const [newDispute] = await db.insert(landDisputes).values(disputeData).returning();
      res.status(201).json(newDispute);
    } catch (error) {
      console.error("Error submitting land dispute:", error);
      res.status(500).json({ message: "Failed to submit dispute" });
    }
  });

  // Get survey records
  app.get("/api/survey-records", async (req, res) => {
    try {
      const surveys = await db.select().from(surveyRecords).orderBy(desc(surveyRecords.surveyDate));
      res.json(surveys);
    } catch (error) {
      console.error("Error fetching survey records:", error);
      res.status(500).json({ message: "Failed to fetch survey records" });
    }
  });

  // Create survey record
  app.post("/api/survey-records", async (req, res) => {
    try {
      const surveyData = {
        ...req.body,
        surveyId: `SR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newSurvey] = await db.insert(surveyRecords).values(surveyData).returning();
      res.status(201).json(newSurvey);
    } catch (error) {
      console.error("Error creating survey record:", error);
      res.status(500).json({ message: "Failed to create survey record" });
    }
  });

  // ========================================
  // MODULE 4: MINE WATCH - Mineral Resource Protection
  // ========================================

  // Get all mining operations
  app.get("/api/mining-operations", async (req, res) => {
    try {
      const operations = await db.select().from(miningOperations).orderBy(desc(miningOperations.createdAt));
      res.json(operations);
    } catch (error) {
      console.error("Error fetching mining operations:", error);
      res.status(500).json({ message: "Failed to fetch mining operations" });
    }
  });

  // Register mining operation
  app.post("/api/mining-operations", async (req, res) => {
    try {
      const operationData = {
        ...req.body,
        operationId: `MO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [newOperation] = await db.insert(miningOperations).values(operationData).returning();
      res.status(201).json(newOperation);
    } catch (error) {
      console.error("Error registering mining operation:", error);
      res.status(500).json({ message: "Failed to register mining operation" });
    }
  });

  // Get community impacts
  app.get("/api/community-impacts", async (req, res) => {
    try {
      const impacts = await db.select().from(communityImpacts).orderBy(desc(communityImpacts.reportedDate));
      res.json(impacts);
    } catch (error) {
      console.error("Error fetching community impacts:", error);
      res.status(500).json({ message: "Failed to fetch community impacts" });
    }
  });

  // Report community impact
  app.post("/api/community-impacts", async (req, res) => {
    try {
      const impactData = {
        ...req.body,
        impactId: `CI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        reportedDate: new Date(),
        createdAt: new Date()
      };
      
      const [newImpact] = await db.insert(communityImpacts).values(impactData).returning();
      res.status(201).json(newImpact);
    } catch (error) {
      console.error("Error reporting community impact:", error);
      res.status(500).json({ message: "Failed to report community impact" });
    }
  });

  // Get mining inspections
  app.get("/api/mining-inspections", async (req, res) => {
    try {
      const inspections = await db.select().from(miningInspections).orderBy(desc(miningInspections.inspectionDate));
      res.json(inspections);
    } catch (error) {
      console.error("Error fetching mining inspections:", error);
      res.status(500).json({ message: "Failed to fetch mining inspections" });
    }
  });

  // Create mining inspection
  app.post("/api/mining-inspections", async (req, res) => {
    try {
      const inspectionData = {
        ...req.body,
        inspectionId: `MI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newInspection] = await db.insert(miningInspections).values(inspectionData).returning();
      res.status(201).json(newInspection);
    } catch (error) {
      console.error("Error creating mining inspection:", error);
      res.status(500).json({ message: "Failed to create mining inspection" });
    }
  });

  // ========================================
  // MODULE 5: FOREST GUARD - Forest Protection & Carbon Credits
  // ========================================

  // Get all forest areas
  app.get("/api/forest-areas", async (req, res) => {
    try {
      const forests = await db.select().from(forestAreas).orderBy(desc(forestAreas.createdAt));
      res.json(forests);
    } catch (error) {
      console.error("Error fetching forest areas:", error);
      res.status(500).json({ message: "Failed to fetch forest areas" });
    }
  });

  // Register forest area
  app.post("/api/forest-areas", async (req, res) => {
    try {
      const forestData = {
        ...req.body,
        forestId: `FA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [newForest] = await db.insert(forestAreas).values(forestData).returning();
      res.status(201).json(newForest);
    } catch (error) {
      console.error("Error registering forest area:", error);
      res.status(500).json({ message: "Failed to register forest area" });
    }
  });

  // Get deforestation alerts
  app.get("/api/deforestation-alerts", async (req, res) => {
    try {
      const alerts = await db.select().from(deforestationAlerts).orderBy(desc(deforestationAlerts.detectionDate));
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching deforestation alerts:", error);
      res.status(500).json({ message: "Failed to fetch deforestation alerts" });
    }
  });

  // Create deforestation alert
  app.post("/api/deforestation-alerts", async (req, res) => {
    try {
      const alertData = {
        ...req.body,
        alertId: `DA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        detectionDate: new Date(),
        createdAt: new Date()
      };
      
      const [newAlert] = await db.insert(deforestationAlerts).values(alertData).returning();
      res.status(201).json(newAlert);
    } catch (error) {
      console.error("Error creating deforestation alert:", error);
      res.status(500).json({ message: "Failed to create deforestation alert" });
    }
  });

  // Get carbon credits
  app.get("/api/carbon-credits", async (req, res) => {
    try {
      const credits = await db.select().from(carbonCredits).orderBy(desc(carbonCredits.issuanceDate));
      res.json(credits);
    } catch (error) {
      console.error("Error fetching carbon credits:", error);
      res.status(500).json({ message: "Failed to fetch carbon credits" });
    }
  });

  // Issue carbon credits
  app.post("/api/carbon-credits", async (req, res) => {
    try {
      const creditData = {
        ...req.body,
        creditId: `CC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newCredit] = await db.insert(carbonCredits).values(creditData).returning();
      res.status(201).json(newCredit);
    } catch (error) {
      console.error("Error issuing carbon credits:", error);
      res.status(500).json({ message: "Failed to issue carbon credits" });
    }
  });

  // ========================================
  // MODULE 6: AQUA TRACE - Ocean & River Monitoring
  // ========================================

  // Get all water bodies
  app.get("/api/water-bodies", async (req, res) => {
    try {
      const waters = await db.select().from(waterBodies).orderBy(desc(waterBodies.createdAt));
      res.json(waters);
    } catch (error) {
      console.error("Error fetching water bodies:", error);
      res.status(500).json({ message: "Failed to fetch water bodies" });
    }
  });

  // Register water body
  app.post("/api/water-bodies", async (req, res) => {
    try {
      const waterData = {
        ...req.body,
        waterId: `WB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [newWater] = await db.insert(waterBodies).values(waterData).returning();
      res.status(201).json(newWater);
    } catch (error) {
      console.error("Error registering water body:", error);
      res.status(500).json({ message: "Failed to register water body" });
    }
  });

  // Get water quality monitoring data
  app.get("/api/water-quality", async (req, res) => {
    try {
      const monitoring = await db.select().from(waterQualityMonitoring).orderBy(desc(waterQualityMonitoring.measurementDate));
      res.json(monitoring);
    } catch (error) {
      console.error("Error fetching water quality data:", error);
      res.status(500).json({ message: "Failed to fetch water quality data" });
    }
  });

  // Record water quality measurement
  app.post("/api/water-quality", async (req, res) => {
    try {
      const qualityData = {
        ...req.body,
        monitoringId: `WQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newMonitoring] = await db.insert(waterQualityMonitoring).values(qualityData).returning();
      res.status(201).json(newMonitoring);
    } catch (error) {
      console.error("Error recording water quality measurement:", error);
      res.status(500).json({ message: "Failed to record water quality measurement" });
    }
  });

  // Get fishing permits
  app.get("/api/fishing-permits", async (req, res) => {
    try {
      const permits = await db.select().from(fishingPermits).orderBy(desc(fishingPermits.issueDate));
      res.json(permits);
    } catch (error) {
      console.error("Error fetching fishing permits:", error);
      res.status(500).json({ message: "Failed to fetch fishing permits" });
    }
  });

  // Issue fishing permit
  app.post("/api/fishing-permits", async (req, res) => {
    try {
      const permitData = {
        ...req.body,
        permitId: `FP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newPermit] = await db.insert(fishingPermits).values(permitData).returning();
      res.status(201).json(newPermit);
    } catch (error) {
      console.error("Error issuing fishing permit:", error);
      res.status(500).json({ message: "Failed to issue fishing permit" });
    }
  });

  // Get pollution reports
  app.get("/api/pollution-reports", async (req, res) => {
    try {
      const reports = await db.select().from(pollutionReports).orderBy(desc(pollutionReports.reportDate));
      res.json(reports);
    } catch (error) {
      console.error("Error fetching pollution reports:", error);
      res.status(500).json({ message: "Failed to fetch pollution reports" });
    }
  });

  // Submit pollution report
  app.post("/api/pollution-reports", async (req, res) => {
    try {
      const reportData = {
        ...req.body,
        reportId: `PR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        reportDate: new Date(),
        createdAt: new Date()
      };
      
      const [newReport] = await db.insert(pollutionReports).values(reportData).returning();
      res.status(201).json(newReport);
    } catch (error) {
      console.error("Error submitting pollution report:", error);
      res.status(500).json({ message: "Failed to submit pollution report" });
    }
  });

  // ========================================
  // MODULE 7: BLUE CARBON 360 - Conservation Economics
  // ========================================

  // Get all conservation projects
  app.get("/api/conservation-projects", async (req, res) => {
    try {
      const projects = await db.select().from(conservationProjects).orderBy(desc(conservationProjects.createdAt));
      res.json(projects);
    } catch (error) {
      console.error("Error fetching conservation projects:", error);
      res.status(500).json({ message: "Failed to fetch conservation projects" });
    }
  });

  // Create conservation project
  app.post("/api/conservation-projects", async (req, res) => {
    try {
      const projectData = {
        ...req.body,
        projectId: `CP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [newProject] = await db.insert(conservationProjects).values(projectData).returning();
      res.status(201).json(newProject);
    } catch (error) {
      console.error("Error creating conservation project:", error);
      res.status(500).json({ message: "Failed to create conservation project" });
    }
  });

  // Get carbon marketplace listings
  app.get("/api/carbon-marketplace", async (req, res) => {
    try {
      const listings = await db.select().from(carbonMarketplace).orderBy(desc(carbonMarketplace.listingDate));
      res.json(listings);
    } catch (error) {
      console.error("Error fetching carbon marketplace:", error);
      res.status(500).json({ message: "Failed to fetch carbon marketplace" });
    }
  });

  // Create marketplace listing
  app.post("/api/carbon-marketplace", async (req, res) => {
    try {
      const listingData = {
        ...req.body,
        listingId: `CM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        listingDate: new Date(),
        createdAt: new Date()
      };
      
      const [newListing] = await db.insert(carbonMarketplace).values(listingData).returning();
      res.status(201).json(newListing);
    } catch (error) {
      console.error("Error creating marketplace listing:", error);
      res.status(500).json({ message: "Failed to create marketplace listing" });
    }
  });

  // Get economic impact tracking
  app.get("/api/economic-impact", async (req, res) => {
    try {
      const impacts = await db.select().from(economicImpactTracking).orderBy(desc(economicImpactTracking.measurementDate));
      res.json(impacts);
    } catch (error) {
      console.error("Error fetching economic impact data:", error);
      res.status(500).json({ message: "Failed to fetch economic impact data" });
    }
  });

  // Record economic impact
  app.post("/api/economic-impact", async (req, res) => {
    try {
      const impactData = {
        ...req.body,
        trackingId: `EI-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newImpact] = await db.insert(economicImpactTracking).values(impactData).returning();
      res.status(201).json(newImpact);
    } catch (error) {
      console.error("Error recording economic impact:", error);
      res.status(500).json({ message: "Failed to record economic impact" });
    }
  });

  // ========================================
  // MODULE 8: CARBON TRACE - Environmental Monitoring
  // ========================================

  // Get all emission sources
  app.get("/api/emission-sources", async (req, res) => {
    try {
      const sources = await db.select().from(emissionSources).orderBy(desc(emissionSources.createdAt));
      res.json(sources);
    } catch (error) {
      console.error("Error fetching emission sources:", error);
      res.status(500).json({ message: "Failed to fetch emission sources" });
    }
  });

  // Register emission source
  app.post("/api/emission-sources", async (req, res) => {
    try {
      const sourceData = {
        ...req.body,
        sourceId: `ES-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const [newSource] = await db.insert(emissionSources).values(sourceData).returning();
      res.status(201).json(newSource);
    } catch (error) {
      console.error("Error registering emission source:", error);
      res.status(500).json({ message: "Failed to register emission source" });
    }
  });

  // Get emission measurements
  app.get("/api/emission-measurements", async (req, res) => {
    try {
      const measurements = await db.select().from(emissionMeasurements).orderBy(desc(emissionMeasurements.measurementDate));
      res.json(measurements);
    } catch (error) {
      console.error("Error fetching emission measurements:", error);
      res.status(500).json({ message: "Failed to fetch emission measurements" });
    }
  });

  // Record emission measurement
  app.post("/api/emission-measurements", async (req, res) => {
    try {
      const measurementData = {
        ...req.body,
        measurementId: `EM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newMeasurement] = await db.insert(emissionMeasurements).values(measurementData).returning();
      res.status(201).json(newMeasurement);
    } catch (error) {
      console.error("Error recording emission measurement:", error);
      res.status(500).json({ message: "Failed to record emission measurement" });
    }
  });

  // Get carbon offsets
  app.get("/api/carbon-offsets", async (req, res) => {
    try {
      const offsets = await db.select().from(carbonOffset).orderBy(desc(carbonOffset.purchaseDate));
      res.json(offsets);
    } catch (error) {
      console.error("Error fetching carbon offsets:", error);
      res.status(500).json({ message: "Failed to fetch carbon offsets" });
    }
  });

  // Purchase carbon offset
  app.post("/api/carbon-offsets", async (req, res) => {
    try {
      const offsetData = {
        ...req.body,
        offsetId: `CO-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        createdAt: new Date()
      };
      
      const [newOffset] = await db.insert(carbonOffset).values(offsetData).returning();
      res.status(201).json(newOffset);
    } catch (error) {
      console.error("Error purchasing carbon offset:", error);
      res.status(500).json({ message: "Failed to purchase carbon offset" });
    }
  });

  // Get environmental alerts
  app.get("/api/environmental-alerts", async (req, res) => {
    try {
      const alerts = await db.select().from(environmentalAlerts).orderBy(desc(environmentalAlerts.detectedAt));
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching environmental alerts:", error);
      res.status(500).json({ message: "Failed to fetch environmental alerts" });
    }
  });

  // Create environmental alert
  app.post("/api/environmental-alerts", async (req, res) => {
    try {
      const alertData = {
        ...req.body,
        alertId: `EA-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        detectedAt: new Date(),
        createdAt: new Date()
      };
      
      const [newAlert] = await db.insert(environmentalAlerts).values(alertData).returning();
      res.status(201).json(newAlert);
    } catch (error) {
      console.error("Error creating environmental alert:", error);
      res.status(500).json({ message: "Failed to create environmental alert" });
    }
  });

  // ========================================
  // DASHBOARD STATISTICS FOR ALL MODULES
  // ========================================

  // Get Live Trace dashboard stats
  app.get("/api/live-trace/stats", async (req, res) => {
    try {
      const [totalAnimals] = await db.select({ count: sql<number>`count(*)` }).from(livestock);
      const [healthyAnimals] = await db.select({ count: sql<number>`count(*)` }).from(livestock).where(eq(livestock.healthStatus, 'healthy'));
      const [quarantinedAnimals] = await db.select({ count: sql<number>`count(*)` }).from(livestock).where(eq(livestock.quarantineStatus, true));
      const [activeAlerts] = await db.select({ count: sql<number>`count(*)` }).from(livestockAlerts).where(eq(livestockAlerts.isResolved, false));

      res.json({
        totalAnimals: totalAnimals.count || 0,
        healthyAnimals: healthyAnimals.count || 0,
        quarantinedAnimals: quarantinedAnimals.count || 0,
        activeAlerts: activeAlerts.count || 0
      });
    } catch (error) {
      console.error("Error fetching Live Trace stats:", error);
      res.status(500).json({ message: "Failed to fetch Live Trace statistics" });
    }
  });

  // Get Land Map360 dashboard stats
  app.get("/api/land-map360/stats", async (req, res) => {
    try {
      const [totalParcels] = await db.select({ count: sql<number>`count(*)` }).from(landParcels);
      const [registeredParcels] = await db.select({ count: sql<number>`count(*)` }).from(landParcels).where(eq(landParcels.registrationStatus, 'registered'));
      const [activeDisputes] = await db.select({ count: sql<number>`count(*)` }).from(landDisputes).where(or(eq(landDisputes.status, 'submitted'), eq(landDisputes.status, 'under_review')));
      const [completedSurveys] = await db.select({ count: sql<number>`count(*)` }).from(surveyRecords).where(eq(surveyRecords.status, 'completed'));

      res.json({
        totalParcels: totalParcels.count || 0,
        registeredParcels: registeredParcels.count || 0,
        activeDisputes: activeDisputes.count || 0,
        completedSurveys: completedSurveys.count || 0
      });
    } catch (error) {
      console.error("Error fetching Land Map360 stats:", error);
      res.status(500).json({ message: "Failed to fetch Land Map360 statistics" });
    }
  });

  // Get Mine Watch dashboard stats
  app.get("/api/mine-watch/stats", async (req, res) => {
    try {
      const [totalOperations] = await db.select({ count: sql<number>`count(*)` }).from(miningOperations);
      const [activeOperations] = await db.select({ count: sql<number>`count(*)` }).from(miningOperations).where(eq(miningOperations.status, 'active'));
      const [communityImpactsCount] = await db.select({ count: sql<number>`count(*)` }).from(communityImpacts);
      const [recentInspections] = await db.select({ count: sql<number>`count(*)` }).from(miningInspections).where(sql`${miningInspections.inspectionDate} >= NOW() - INTERVAL '30 days'`);

      res.json({
        totalOperations: totalOperations.count || 0,
        activeOperations: activeOperations.count || 0,
        communityImpacts: communityImpactsCount.count || 0,
        recentInspections: recentInspections.count || 0
      });
    } catch (error) {
      console.error("Error fetching Mine Watch stats:", error);
      res.status(500).json({ message: "Failed to fetch Mine Watch statistics" });
    }
  });

  // Get Forest Guard dashboard stats
  app.get("/api/forest-guard/stats", async (req, res) => {
    try {
      const [totalForests] = await db.select({ count: sql<number>`count(*)` }).from(forestAreas);
      const [protectedForests] = await db.select({ count: sql<number>`count(*)` }).from(forestAreas).where(eq(forestAreas.conservationStatus, 'protected'));
      const [activeAlerts] = await db.select({ count: sql<number>`count(*)` }).from(deforestationAlerts).where(eq(deforestationAlerts.status, 'pending'));
      const [carbonCreditsIssued] = await db.select({ count: sql<number>`count(*)` }).from(carbonCredits);

      res.json({
        totalForests: totalForests.count || 0,
        protectedForests: protectedForests.count || 0,
        activeAlerts: activeAlerts.count || 0,
        carbonCreditsIssued: carbonCreditsIssued.count || 0
      });
    } catch (error) {
      console.error("Error fetching Forest Guard stats:", error);
      res.status(500).json({ message: "Failed to fetch Forest Guard statistics" });
    }
  });

  // Get Aqua Trace dashboard stats
  app.get("/api/aqua-trace/stats", async (req, res) => {
    try {
      const [totalWaterBodies] = await db.select({ count: sql<number>`count(*)` }).from(waterBodies);
      const [protectedWaters] = await db.select({ count: sql<number>`count(*)` }).from(waterBodies).where(eq(waterBodies.protectionStatus, 'protected'));
      const [activeFishingPermits] = await db.select({ count: sql<number>`count(*)` }).from(fishingPermits).where(eq(fishingPermits.status, 'active'));
      const [pollutionReportsCount] = await db.select({ count: sql<number>`count(*)` }).from(pollutionReports).where(eq(pollutionReports.status, 'open'));

      res.json({
        totalWaterBodies: totalWaterBodies.count || 0,
        protectedWaters: protectedWaters.count || 0,
        activeFishingPermits: activeFishingPermits.count || 0,
        activePollutionReports: pollutionReportsCount.count || 0
      });
    } catch (error) {
      console.error("Error fetching Aqua Trace stats:", error);
      res.status(500).json({ message: "Failed to fetch Aqua Trace statistics" });
    }
  });

  // Get Blue Carbon 360 dashboard stats
  app.get("/api/blue-carbon360/stats", async (req, res) => {
    try {
      const [totalProjects] = await db.select({ count: sql<number>`count(*)` }).from(conservationProjects);
      const [activeProjects] = await db.select({ count: sql<number>`count(*)` }).from(conservationProjects).where(eq(conservationProjects.status, 'active'));
      const [marketplaceListings] = await db.select({ count: sql<number>`count(*)` }).from(carbonMarketplace).where(eq(carbonMarketplace.status, 'available'));
      const [economicImpactCount] = await db.select({ count: sql<number>`count(*)` }).from(economicImpactTracking);

      res.json({
        totalProjects: totalProjects.count || 0,
        activeProjects: activeProjects.count || 0,
        marketplaceListings: marketplaceListings.count || 0,
        economicImpactRecords: economicImpactCount.count || 0
      });
    } catch (error) {
      console.error("Error fetching Blue Carbon 360 stats:", error);
      res.status(500).json({ message: "Failed to fetch Blue Carbon 360 statistics" });
    }
  });

  // Get Carbon Trace dashboard stats
  app.get("/api/carbon-trace/stats", async (req, res) => {
    try {
      const [totalSources] = await db.select({ count: sql<number>`count(*)` }).from(emissionSources);
      const [activeSources] = await db.select({ count: sql<number>`count(*)` }).from(emissionSources).where(eq(emissionSources.status, 'active'));
      const [recentMeasurements] = await db.select({ count: sql<number>`count(*)` }).from(emissionMeasurements).where(sql`${emissionMeasurements.measurementDate} >= NOW() - INTERVAL '7 days'`);
      const [activeEnvironmentalAlerts] = await db.select({ count: sql<number>`count(*)` }).from(environmentalAlerts).where(eq(environmentalAlerts.status, 'open'));

      res.json({
        totalSources: totalSources.count || 0,
        activeSources: activeSources.count || 0,
        recentMeasurements: recentMeasurements.count || 0,
        activeAlerts: activeEnvironmentalAlerts.count || 0
      });
    } catch (error) {
      console.error("Error fetching Carbon Trace stats:", error);
      res.status(500).json({ message: "Failed to fetch Carbon Trace statistics" });
    }
  });

  console.log("✅ POLIPUS MODULE ROUTES REGISTERED - All 7 modules with full API functionality");
}