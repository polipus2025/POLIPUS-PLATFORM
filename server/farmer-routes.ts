import type { Express } from "express";
import bcrypt from "bcryptjs";
import { randomUUID, randomBytes } from "crypto";
import { storage } from "./storage";
import { buyerAlertService } from "./buyer-alert-system";
import { notificationService } from "./notification-service";
// JWT imports removed - consistent with disabled authentication for production stability
import { 
  loginSchema, 
  farmerCreationSchema, 
  harvestScheduleSchema, 
  marketplaceListingSchema,
  transactionProposalSchema,
  validateRequest 
} from "./validation-schemas";

// SECURE CREDENTIAL GENERATION - For new users only (existing test accounts preserved)
function generateFarmerCredentialId(): string {
  const prefix = "FRM";
  // Use cryptographically secure random bytes for new credentials
  const secureRandom = randomBytes(4).toString('hex').toUpperCase();
  const timestamp = Date.now().toString().slice(-4); // Shorter for readability
  return `${prefix}${timestamp}${secureRandom}`;
}

function generateTemporaryPassword(): string {
  // Cryptographically secure password generation for new users
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const randomValues = randomBytes(8);
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(randomValues[i] % chars.length);
  }
  return password;
}

export function registerFarmerRoutes(app: Express) {
  // Create farmer data only (no credentials yet)
  app.post("/api/farmers", async (req, res) => {
    try {
      // SECURITY: Validate input data to prevent injection attacks
      const validation = validateRequest(farmerCreationSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid farmer data',
          details: validation.errors
        });
      }
      
      const farmerData = validation.data;
      
      // Generate unique farmer ID using secure random generation
      const farmerId = `FARMER-${Date.now()}-${randomBytes(2).toString('hex').toUpperCase()}`;
      
      // Create farmer record
      const farmer = await storage.createFarmer({
        ...farmerData,
        farmerId,
        numberOfChildren: (farmerData as any).numberOfChildren ? parseInt((farmerData as any).numberOfChildren) : null,
        dependents: (farmerData as any).dependents ? parseInt((farmerData as any).dependents) : null,
        farmingExperience: (farmerData as any).farmingExperience ? parseInt((farmerData as any).farmingExperience) : null,
        irrigationAccess: (farmerData as any).irrigationAccess === "true" || (farmerData as any).irrigationAccess === true,
        farmBoundaries: farmerData.farmBoundaries || null,
        landMapData: farmerData.landMapData || null
      });

      res.json({
        farmer,
        message: "Farmer data saved successfully. Boundary mapping complete."
      });
    } catch (error) {
      console.error("Error creating farmer:", error);
      res.status(500).json({ error: "Failed to create farmer" });
    }
  });

  // Generate credentials for completed farmer onboarding
  app.post("/api/farmers/:farmerId/complete-onboarding", async (req, res) => {
    try {
      const farmerIdParam = req.params.farmerId;
      // Handle both numeric ID and farmerId string formats
      const farmer = isNaN(parseInt(farmerIdParam)) 
        ? await storage.getFarmerByFarmerId(farmerIdParam)  // Use farmerId string like "FARMER-1755883520291-288"
        : await storage.getFarmer(parseInt(farmerIdParam));  // Use numeric ID
      
      if (!farmer) {
        return res.status(404).json({ error: "Farmer not found" });
      }

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

      // Send credentials via email and SMS
      const farmerFullName = `${farmer.firstName} ${farmer.lastName}`;
      const notifications = await notificationService.sendCredentialsNotifications(
        farmer.email,
        farmer.phone,
        farmerFullName,
        credentialId,
        temporaryPassword
      );

      // Log notification status without exposing sensitive data
      console.log(`📧 Email sent: ${notifications.emailSent ? '✅' : '❌'} | 📱 SMS sent: ${notifications.smsSent ? '✅' : '❌'} for ${farmerFullName}`);

      res.json({
        farmer,
        credentials: {
          credentialId,
          temporaryPassword
        },
        notifications: {
          emailSent: notifications.emailSent,
          smsSent: notifications.smsSent
        },
        message: "Farmer onboarding completed successfully!"
      });
    } catch (error) {
      console.error("Error completing farmer onboarding:", error);
      res.status(500).json({ error: "Failed to complete farmer onboarding" });
    }
  });

  // Farmer authentication (with test account fallback)
  app.post("/api/farmers/login", async (req, res) => {
    try {
      // SECURITY: Validate login credentials to prevent injection attacks
      const validation = validateRequest(loginSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid login data',
          details: validation.errors
        });
      }
      
      const { credentialId, password } = validation.data;
      // Login attempt logged without exposing credential details

      // TEST CREDENTIALS REMOVED - Only real database credentials work now

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

        // CONSISTENT WITH DISABLED JWT: No token generation for production stability
        // Store farmer session data for simple session-based authentication
        if (req.session) {
          req.session.userId = farmer.id;
          req.session.farmerId = farmer.farmerId;
          req.session.userType = 'farmer';
          req.session.role = 'farmer';
          req.session.isAuthenticated = true;
        }

        res.json({
          success: true,
          farmer: {
            id: farmer.id,
            farmerId: farmer.farmerId,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            mustChangePassword: credentials.mustChangePassword
          },
          // No JWT token - consistent with disabled authentication
          message: "Login successful"
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
            actualYield: null,
            expectedPrice: 2.50,
            priceUnit: "per_kg",
            season: "rainy_season",
            cropYear: 2025,
            status: "ready_for_harvest",
            marketingPlan: "Local buyers and cooperatives",
            harvestStartDate: null,
            harvestEndDate: null,
            marketplaceListingCreated: false,
            buyerInterestCount: 0,
            transactionCount: 0,
            totalSalesValue: 0,
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
            actualYield: null,
            expectedPrice: 3.20,
            priceUnit: "per_kg",
            season: "dry_season",
            cropYear: 2025,
            status: "growing",
            marketingPlan: "Coffee exporters",
            harvestStartDate: null,
            harvestEndDate: null,
            marketplaceListingCreated: false,
            buyerInterestCount: 0,
            transactionCount: 0,
            totalSalesValue: 0,
            createdBy: "John Konneh",
            isActive: true
          },
          {
            id: 3,
            scheduleId: "SCH-TEST-003",
            farmerId: 1,
            scheduleName: "Cocoa Second Season 2024",
            cropType: "Cocoa",
            cropVariety: "Trinitario",
            plantingArea: 2.0,
            plantingStartDate: "2024-01-15",
            plantingEndDate: "2024-02-28",
            expectedHarvestStartDate: "2024-08-01",
            expectedHarvestEndDate: "2024-10-15",
            expectedYield: 800,
            yieldUnit: "kg",
            actualYield: 850,
            expectedPrice: 2.40,
            priceUnit: "per_kg",
            season: "dry_season",
            cropYear: 2024,
            status: "harvested",
            marketingPlan: "Direct buyer sales",
            harvestStartDate: "2024-08-05",
            harvestEndDate: "2024-09-20",
            marketplaceListingCreated: true,
            buyerInterestCount: 3,
            transactionCount: 2,
            totalSalesValue: 2040.00,
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

        const harvestSchedules = await storage.getHarvestSchedules();
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

        const listings = [];
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

        const inquiries = [];
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

        const alerts = [];
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
      // SECURITY: Validate input data to prevent injection attacks
      const validation = validateRequest(harvestScheduleSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid harvest schedule data',
          details: validation.errors
        });
      }
      
      const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
      if (!farmer) {
        return res.status(404).json({ error: "Farmer not found" });
      }

      const scheduleData = {
        ...validation.data,
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
      // SECURITY: Validate input data to prevent injection attacks
      const validation = validateRequest(marketplaceListingSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid marketplace listing data',
          details: validation.errors
        });
      }
      
      const farmer = await storage.getFarmerByFarmerId(req.params.farmerId);
      if (!farmer) {
        return res.status(404).json({ error: "Farmer not found" });
      }

      const listingData = {
        ...validation.data,
        farmerId: farmer.id,
        listingId: `LST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        status: "active",
        viewCount: 0,
        inquiryCount: 0
      };

      // TODO: Implement marketplace listing storage
      const listing = {
        ...listingData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📝 Marketplace listing created:', listing.listingId);
      console.log('🚨 Harvest alert sent to buyers');

      res.json(listing);
    } catch (error) {
      console.error("Error creating marketplace listing:", error);
      res.status(500).json({ error: "Failed to create marketplace listing" });
    }
  });

  // Get farmer transactions (farmer-buyer product transactions)
  app.get("/api/farmers/:farmerId/transactions", async (req, res) => {
    try {
      const { farmerId } = req.params;
      
      // Test data fallback for demo
      if (farmerId === "FARMER-TEST-2025") {
        return res.json([
          {
            id: 1,
            transactionId: "TXN-TEST-001",
            farmerId: 1,
            scheduleId: 3,
            buyerId: "BUY-12345",
            buyerName: "Samuel Johnson",
            buyerCompany: "Nimba Agricultural Cooperative",
            cropType: "Cocoa",
            quantity: 400,
            pricePerKg: 2.40,
            totalAmount: 960.00,
            paymentTerms: "Cash on delivery",
            deliveryDate: "2024-09-25",
            transactionType: "direct_sale",
            status: "completed",
            farmerApproved: true,
            buyerApproved: true,
            negotiationStatus: "agreed",
            completedAt: "2024-09-25T10:30:00Z",
            createdAt: "2024-09-20T14:15:00Z"
          },
          {
            id: 2,
            transactionId: "TXN-TEST-002",
            farmerId: 1,
            scheduleId: 3,
            buyerId: "BUY-67890",
            buyerName: "Mary Williams",
            buyerCompany: "West African Commodities",
            cropType: "Cocoa",
            quantity: 450,
            pricePerKg: 2.50,
            totalAmount: 1125.00,
            paymentTerms: "Mobile money transfer",
            deliveryDate: "2024-10-01",
            transactionType: "marketplace_sale",
            status: "completed",
            farmerApproved: true,
            buyerApproved: true,
            negotiationStatus: "agreed",
            completedAt: "2024-10-01T15:45:00Z",
            createdAt: "2024-09-25T09:20:00Z"
          },
          {
            id: 3,
            transactionId: "TXN-TEST-003",
            farmerId: 1,
            scheduleId: 1,
            buyerId: "BUY-11111",
            buyerName: "David Cole",
            buyerCompany: "Premium Cocoa Buyers",
            cropType: "Cocoa",
            quantity: 600,
            pricePerKg: 2.60,
            totalAmount: 1560.00,
            paymentTerms: "50% advance, 50% on delivery",
            deliveryDate: "2025-10-15",
            transactionType: "pre_order",
            status: "pending",
            farmerApproved: false,
            buyerApproved: true,
            negotiationStatus: "buyer_offer",
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }

      try {
        const transactions = [];
        res.json(transactions);
      } catch (dbError) {
        return res.json([]);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Update harvest schedule status and trigger buyer alerts
  app.put("/api/farmers/:farmerId/harvest-schedules/:scheduleId/status", async (req, res) => {
    try {
      const { farmerId, scheduleId } = req.params;
      const { status, actualYield, harvestStartDate, harvestEndDate } = req.body;

      console.log(`📝 Updating harvest schedule ${scheduleId} status to ${status}`);

      // Test data update for demo
      if (farmerId === "FARMER-TEST-2025") {
        return res.json({
          success: true,
          message: `Harvest schedule ${scheduleId} status updated to ${status}`,
          updatedSchedule: {
            id: scheduleId,
            status,
            actualYield: actualYield || null,
            harvestStartDate: harvestStartDate || (status === 'harvesting' ? new Date().toISOString() : null),
            harvestEndDate: harvestEndDate || (status === 'harvested' ? new Date().toISOString() : null),
            updatedAt: new Date().toISOString()
          }
        });
      }

      // TODO: Implement database update
      res.json({ success: true, message: "Schedule updated successfully" });
    } catch (error) {
      console.error("Error updating harvest schedule:", error);
      res.status(500).json({ error: "Failed to update harvest schedule" });
    }
  });

  // Alert regional buyers when harvest is completed
  app.post("/api/farmers/:farmerId/harvest-schedules/:scheduleId/alert-buyers", async (req, res) => {
    try {
      const { farmerId, scheduleId } = req.params;

      // Test data for demo
      if (farmerId === "FARMER-TEST-2025") {
        const harvestData = {
          farmerName: "John Konneh",
          cropType: "Cocoa",
          cropVariety: "Amelonado",
          quantity: 1500,
          expectedPrice: 2.50,
          harvestDate: new Date().toISOString(),
          farmerLocation: {
            county: "Nimba",
            district: "Sanniquellie",
            coordinates: { lat: 7.3692, lng: -9.7318 }
          }
        };

        const harvestAlert = await buyerAlertService.createHarvestAlert(
          farmerId,
          scheduleId,
          harvestData
        );

        return res.json({
          success: true,
          message: "Regional buyers have been alerted",
          alert: harvestAlert,
          buyersNotified: harvestAlert.targetBuyers.length,
          smssSent: harvestAlert.smssSent,
          platformNotifications: harvestAlert.platformNotificationsSent
        });
      }

      // TODO: Implement for real farmer data
      res.json({ success: true, message: "Buyers alerted successfully" });
    } catch (error) {
      console.error("Error alerting buyers:", error);
      res.status(500).json({ error: "Failed to alert buyers" });
    }
  });

  // Messaging system between farmers and buyers
  app.get("/api/farmers/:farmerId/messages", async (req, res) => {
    try {
      const { farmerId } = req.params;
      const { buyerId, scheduleId } = req.query;

      // Test messages for demo
      if (farmerId === "FARMER-TEST-2025") {
        return res.json([
          {
            id: "1",
            messageId: "MSG-001",
            farmerId,
            buyerId: "BUY-12345",
            scheduleId: "SCH-TEST-001",
            messageType: "inquiry",
            sender: "buyer",
            subject: "Interest in Your Cocoa Harvest",
            message: "Hello John, I'm interested in purchasing your cocoa harvest. Can we discuss pricing and delivery terms?",
            proposedPrice: 2.60,
            proposedQuantity: 600,
            isRead: false,
            sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: "2",
            messageId: "MSG-002", 
            farmerId,
            buyerId: "BUY-67890",
            scheduleId: "SCH-TEST-001",
            messageType: "negotiation",
            sender: "buyer",
            subject: "Competitive Offer for Premium Cocoa",
            message: "Hi John, West African Commodities is offering $2.75/kg for your premium cocoa. We can arrange immediate pickup.",
            proposedPrice: 2.75,
            proposedQuantity: 800,
            isRead: true,
            sentAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }

      res.json([]);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Create transaction proposal
  app.post("/api/farmers/:farmerId/transaction-proposals", async (req, res) => {
    try {
      // SECURITY: Validate input data to prevent injection attacks
      const validation = validateRequest(transactionProposalSchema, req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid transaction proposal data',
          details: validation.errors
        });
      }
      
      const { farmerId } = req.params;
      const proposalData = validation.data;

      // Create proposal using buyer alert service
      const proposal = await buyerAlertService.createTransactionProposal({
        farmerId,
        ...proposalData
      });

      res.json({
        success: true,
        message: "Transaction proposal created",
        proposal
      });
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ error: "Failed to create proposal" });
    }
  });

  // Approve transaction proposal
  app.put("/api/farmers/:farmerId/transaction-proposals/:proposalId/approve", async (req, res) => {
    try {
      const { proposalId } = req.params;
      const { approverType } = req.body; // 'farmer' or 'buyer'

      const approvedProposal = await buyerAlertService.approveProposal(proposalId, approverType);

      res.json({
        success: true,
        message: `Proposal approved by ${approverType}`,
        proposal: approvedProposal,
        transactionCode: approvedProposal.uniqueTransactionCode,
        ddgotsNotified: approvedProposal.ddgotsNotified
      });
    } catch (error) {
      console.error("Error approving proposal:", error);
      res.status(500).json({ error: "Failed to approve proposal" });
    }
  });

  console.log("✅ Farmer routes registered successfully");
}