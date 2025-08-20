import type { Express } from "express";
import bcrypt from "bcryptjs";
import { storage } from "./storage";

// Farmer credential generation utility
function generateFarmerCredentialId(): string {
  const prefix = "FRM";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}${timestamp}${random}`;
}

function generateTemporaryPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export function registerFarmerRoutes(app: Express) {
  // Create farmer with automatic credential generation
  app.post("/api/farmers", async (req, res) => {
    try {
      const farmerData = req.body;
      
      // Generate unique farmer ID
      const farmerId = `FARMER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create farmer record
      const farmer = await storage.createFarmer({
        ...farmerData,
        farmerId,
        numberOfChildren: farmerData.numberOfChildren ? parseInt(farmerData.numberOfChildren) : null,
        dependents: farmerData.dependents ? parseInt(farmerData.dependents) : null,
        farmingExperience: farmerData.farmingExperience ? parseInt(farmerData.farmingExperience) : null,
        irrigationAccess: farmerData.irrigationAccess === "true" || farmerData.irrigationAccess === true,
        farmBoundaries: farmerData.boundaryData ? JSON.parse(farmerData.boundaryData) : null,
        landMapData: farmerData.boundaryData ? JSON.parse(farmerData.boundaryData) : null
      });

      // Generate login credentials
      const credentialId = generateFarmerCredentialId();
      const temporaryPassword = generateTemporaryPassword();
      const passwordHash = await bcrypt.hash(temporaryPassword, 10);

      const credentials = await storage.createFarmerCredentials({
        farmerId: farmer.id,
        credentialId,
        username: credentialId,
        passwordHash,
        temporaryPassword,
        generatedBy: req.body.onboardedBy || "Land Inspector",
        mustChangePassword: true,
        isActive: true
      });

      res.json({
        farmer,
        credentials: {
          credentialId,
          temporaryPassword
        }
      });
    } catch (error) {
      console.error("Error creating farmer:", error);
      res.status(500).json({ error: "Failed to create farmer" });
    }
  });

  // Farmer authentication (with test account fallback)
  app.post("/api/farmers/login", async (req, res) => {
    try {
      const { credentialId, password } = req.body;

      // Test account fallback
      if (credentialId === "FRM434923" && password === "Test2025!") {
        console.log("✅ Test farmer login successful");
        return res.json({
          success: true,
          farmer: {
            id: 1,
            farmerId: "FARMER-TEST-2025",
            firstName: "John",
            lastName: "Konneh",
            mustChangePassword: false
          },
          token: `farmer_test_${Date.now()}`
        });
      }

      try {
        const credentials = await storage.getFarmerCredentialsByUsername(credentialId);
        if (!credentials || !credentials.isActive) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await bcrypt.compare(password, credentials.passwordHash);
        if (!isValid) {
          await storage.incrementFailedLoginAttempts(credentials.id);
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // Get farmer data
        const farmer = await storage.getFarmer(credentials.farmerId);
        if (!farmer) {
          return res.status(401).json({ error: "Farmer not found" });
        }

        // Update last login
        await storage.updateFarmerLastLogin(credentials.id);

        res.json({
          success: true,
          farmer: {
            id: farmer.id,
            farmerId: farmer.farmerId,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            mustChangePassword: credentials.mustChangePassword
          },
          token: `farmer_${credentials.credentialId}_${Date.now()}`
        });
      } catch (dbError) {
        console.log("Database not ready, using test account fallback");
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error during farmer login:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get farmer profile (with test data fallback)
  app.get("/api/farmers/:farmerId", async (req, res) => {
    try {
      // Test data fallback for demo
      if (req.params.farmerId === "FARMER-TEST-2025") {
        return res.json({
          id: 1,
          farmerId: "FARMER-TEST-2025",
          firstName: "John",
          lastName: "Konneh",
          email: "john.konneh@test.com",
          phoneNumber: "+231777123456",
          county: "Nimba",
          district: "Saclepea",
          village: "Karnplay",
          farmSize: 5.2,
          primaryCrop: "Cocoa",
          secondaryCrops: "Coffee, Plantain",
          gpsCoordinates: "7.7491, -8.6716",
          landMapData: {
            totalArea: 5.2,
            mappingAccuracy: "high",
            soilType: "clay-loam",
            waterSource: "seasonal_stream",
            slopeGradient: "gentle",
            mappedBy: "Land Inspector Demo",
            mappingDate: new Date().toISOString(),
            eudrCompliance: true,
            deforestationRisk: "low"
          }
        });
      }

      try {
        const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
        if (!farmer) {
          return res.status(404).json({ error: "Farmer not found" });
        }
        res.json(farmer);
      } catch (dbError) {
        return res.status(404).json({ error: "Farmer not found" });
      }
    } catch (error) {
      console.error("Error fetching farmer:", error);
      res.status(500).json({ error: "Failed to fetch farmer" });
    }
  });

  // Get farmer land mappings (with test data fallback)
  app.get("/api/farmers/:farmerId/land-mappings", async (req, res) => {
    try {
      // Test data fallback for demo
      if (req.params.farmerId === "FARMER-TEST-2025") {
        return res.json([
          {
            id: 1,
            mappingId: "MAP-TEST-001",
            farmerId: 1,
            landMappingName: "Main Cocoa Farm",
            totalArea: 5.2,
            areaUnit: "hectares",
            gpsCoordinates: [
              { latitude: 7.7491, longitude: -8.6716, altitude: 245 },
              { latitude: 7.7485, longitude: -8.6710, altitude: 248 },
              { latitude: 7.7480, longitude: -8.6720, altitude: 250 },
              { latitude: 7.7475, longitude: -8.6730, altitude: 252 },
              { latitude: 7.7470, longitude: -8.6725, altitude: 249 },
              { latitude: 7.7475, longitude: -8.6715, altitude: 247 },
              { latitude: 7.7485, longitude: -8.6718, altitude: 246 }
            ],
            centerLatitude: 7.7481,
            centerLongitude: -8.6720,
            landType: "agricultural",
            soilType: "clay-loam",
            soilQuality: "good",
            waterSource: "seasonal_stream",
            accessibility: "accessible",
            currentUse: "active_farming",
            landTenure: "family_land",
            registrationStatus: "registered",
            mappingAccuracy: "high",
            isActive: true,
            createdBy: "Land Inspector Demo",
            approvedBy: "Land Inspector Demo",
            notes: "Primary cocoa farming area with good drainage and fertile soil"
          }
        ]);
      }

      try {
        const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
        if (!farmer) {
          return res.status(404).json({ error: "Farmer not found" });
        }

        const landMappings = await storage.getFarmerLandMappings(farmer.id);
        res.json(landMappings);
      } catch (dbError) {
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching land mappings:", error);
      res.status(500).json({ error: "Failed to fetch land mappings" });
    }
  });

  // Get farmer harvest schedules (with test data fallback)
  app.get("/api/farmers/:farmerId/harvest-schedules", async (req, res) => {
    try {
      // Test data fallback for demo
      if (req.params.farmerId === "FARMER-TEST-2025") {
        return res.json([
          {
            id: 1,
            scheduleId: "SCH-TEST-001",
            farmerId: 1,
            scheduleName: "Cocoa Main Season 2025",
            cropType: "Cocoa",
            cropVariety: "Amelonado",
            plantingArea: 3.5,
            plantingStartDate: "2024-05-15",
            plantingEndDate: "2024-06-30",
            expectedHarvestStartDate: "2025-10-01",
            expectedHarvestEndDate: "2025-12-15",
            expectedYield: 1500,
            yieldUnit: "kg",
            expectedPrice: 2.50,
            priceUnit: "per_kg",
            season: "rainy_season",
            cropYear: 2025,
            status: "ready_for_harvest",
            marketingPlan: "Local buyers and cooperatives",
            createdBy: "John Konneh",
            isActive: true
          },
          {
            id: 2,
            scheduleId: "SCH-TEST-002",
            farmerId: 1,
            scheduleName: "Coffee Secondary Crop 2025",
            cropType: "Coffee",
            cropVariety: "Robusta",
            plantingArea: 1.7,
            plantingStartDate: "2024-03-01",
            plantingEndDate: "2024-04-15",
            expectedHarvestStartDate: "2025-11-15",
            expectedHarvestEndDate: "2026-01-30",
            expectedYield: 800,
            yieldUnit: "kg",
            expectedPrice: 3.20,
            priceUnit: "per_kg",
            season: "dry_season",
            cropYear: 2025,
            status: "growing",
            marketingPlan: "Coffee exporters",
            createdBy: "John Konneh",
            isActive: true
          }
        ]);
      }

      try {
        const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
        if (!farmer) {
          return res.status(404).json({ error: "Farmer not found" });
        }

        const harvestSchedules = await storage.getFarmerHarvestSchedules(farmer.id);
        res.json(harvestSchedules);
      } catch (dbError) {
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching harvest schedules:", error);
      res.status(500).json({ error: "Failed to fetch harvest schedules" });
    }
  });

  // Get farmer marketplace listings (with test data fallback)
  app.get("/api/farmers/:farmerId/marketplace-listings", async (req, res) => {
    try {
      // Test data fallback for demo
      if (req.params.farmerId === "FARMER-TEST-2025") {
        return res.json([
          {
            id: 1,
            listingId: "LST-TEST-001",
            farmerId: 1,
            scheduleId: 1,
            cropType: "Cocoa",
            cropVariety: "Amelonado",
            quantityAvailable: 1200,
            unit: "kg",
            qualityGrade: "Grade 1",
            pricePerUnit: 2.50,
            totalValue: 3000,
            harvestDate: "2025-10-15",
            availabilityStartDate: new Date().toISOString(),
            availabilityEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            location: "Nimba County, Saclepea District, Karnplay Village",
            gpsCoordinates: "7.7481, -8.6720",
            storageConditions: "Dry warehouse storage",
            paymentTerms: "Cash on delivery or mobile money",
            description: "High-quality Grade 1 cocoa beans from organic farming practices. Well-dried and properly fermented.",
            negotiable: true,
            status: "active",
            urgencyLevel: "normal",
            viewCount: 23,
            inquiryCount: 5
          }
        ]);
      }

      try {
        const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
        if (!farmer) {
          return res.status(404).json({ error: "Farmer not found" });
        }

        const listings = await storage.getFarmerMarketplaceListings(farmer.id);
        res.json(listings);
      } catch (dbError) {
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching marketplace listings:", error);
      res.status(500).json({ error: "Failed to fetch marketplace listings" });
    }
  });

  // Get farmer buyer inquiries (with test data fallback)
  app.get("/api/farmers/:farmerId/buyer-inquiries", async (req, res) => {
    try {
      // Test data fallback for demo
      if (req.params.farmerId === "FARMER-TEST-2025") {
        return res.json([
          {
            id: 1,
            inquiryId: "INQ-TEST-001",
            buyerId: "BUY-12345",
            farmerId: 1,
            marketplaceListingId: "LST-TEST-001",
            inquiryType: "price_negotiation",
            message: "Hello John, I'm interested in your Grade 1 cocoa. Can we discuss bulk pricing for 800kg? I represent a local cooperative.",
            proposedPrice: 2.30,
            proposedQuantity: 800,
            proposedPaymentTerms: "50% advance, 50% on delivery",
            proposedDeliveryDate: "2025-11-01",
            status: "pending",
            priority: "medium",
            contactInformation: "Samuel Johnson, +231888123456",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            responseDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            inquiryId: "INQ-TEST-002",
            buyerId: "BUY-67890",
            farmerId: 1,
            marketplaceListingId: "LST-TEST-001",
            inquiryType: "quality_verification",
            message: "Hi, I need to verify the quality standards for your cocoa. Do you have organic certification documentation?",
            proposedPrice: 2.50,
            proposedQuantity: 200,
            status: "pending",
            priority: "low",
            contactInformation: "Mary Williams, +231777987654",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }

      try {
        const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
        if (!farmer) {
          return res.status(404).json({ error: "Farmer not found" });
        }

        const inquiries = await storage.getFarmerBuyerInquiries(farmer.id);
        res.json(inquiries);
      } catch (dbError) {
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching buyer inquiries:", error);
      res.status(500).json({ error: "Failed to fetch buyer inquiries" });
    }
  });

  // Get farmer harvest alerts (with test data fallback)
  app.get("/api/farmers/:farmerId/harvest-alerts", async (req, res) => {
    try {
      // Test data fallback for demo
      if (req.params.farmerId === "FARMER-TEST-2025") {
        return res.json([
          {
            id: 1,
            alertId: "ALT-TEST-001",
            scheduleId: 1,
            farmerId: 1,
            alertType: "harvest_ready",
            title: "Cocoa Ready for Harvest",
            message: "Your main season cocoa crop is ready for harvest. Consider listing in marketplace for better prices.",
            priority: "high",
            targetAudience: "farmer",
            sentToMarketplace: false,
            isRead: false,
            actionRequired: true,
            actionType: "create_listing",
            createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            alertId: "ALT-TEST-002",
            scheduleId: 1,
            farmerId: 1,
            alertType: "market_opportunity",
            title: "High Demand for Cocoa",
            message: "Local buyers are offering premium prices for Grade 1 cocoa. Current market rate: $2.80/kg",
            priority: "medium",
            targetAudience: "farmer",
            sentToMarketplace: false,
            isRead: false,
            actionRequired: false,
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            alertId: "ALT-TEST-003",
            scheduleId: 2,
            farmerId: 1,
            alertType: "weather_advisory",
            title: "Weather Update - Coffee Crops",
            message: "Upcoming dry season may affect coffee yield. Consider irrigation planning.",
            priority: "low",
            targetAudience: "farmer",
            sentToMarketplace: false,
            isRead: true,
            actionRequired: true,
            actionType: "irrigation_planning",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }

      try {
        const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
        if (!farmer) {
          return res.status(404).json({ error: "Farmer not found" });
        }

        const alerts = await storage.getFarmerHarvestAlerts(farmer.id);
        res.json(alerts);
      } catch (dbError) {
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching harvest alerts:", error);
      res.status(500).json({ error: "Failed to fetch harvest alerts" });
    }
  });

  // Create harvest schedule
  app.post("/api/farmers/:farmerId/harvest-schedules", async (req, res) => {
    try {
      const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
      if (!farmer) {
        return res.status(404).json({ error: "Farmer not found" });
      }

      const scheduleData = {
        ...req.body,
        farmerId: farmer.id,
        scheduleId: `SCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        createdBy: `Farmer ${farmer.firstName} ${farmer.lastName}`,
        status: "planned"
      };

      const schedule = await storage.createHarvestSchedule(scheduleData);
      res.json(schedule);
    } catch (error) {
      console.error("Error creating harvest schedule:", error);
      res.status(500).json({ error: "Failed to create harvest schedule" });
    }
  });

  // Create marketplace listing
  app.post("/api/farmers/:farmerId/marketplace-listings", async (req, res) => {
    try {
      const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
      if (!farmer) {
        return res.status(404).json({ error: "Farmer not found" });
      }

      const listingData = {
        ...req.body,
        farmerId: farmer.id,
        listingId: `LST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: "active",
        viewCount: 0,
        inquiryCount: 0
      };

      const listing = await storage.createMarketplaceListing(listingData);

      // Create harvest alert for buyers
      await storage.createHarvestAlert({
        alertId: `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        scheduleId: listing.scheduleId,
        farmerId: farmer.id,
        alertType: "harvest_available",
        title: `New ${listing.cropType} Available`,
        message: `${farmer.firstName} ${farmer.lastName} has ${listing.quantityAvailable}kg of ${listing.cropType} available for purchase`,
        priority: "medium",
        targetAudience: "buyers",
        sentToMarketplace: true,
        marketplaceListingId: listing.listingId
      });

      res.json(listing);
    } catch (error) {
      console.error("Error creating marketplace listing:", error);
      res.status(500).json({ error: "Failed to create marketplace listing" });
    }
  });
}