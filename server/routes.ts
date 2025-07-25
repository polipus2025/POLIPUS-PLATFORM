import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { 
  insertCommoditySchema, 
  insertInspectionSchema, 
  insertCertificationSchema,
  insertAlertSchema,
  insertReportSchema,
  insertFarmerSchema,
  insertFarmPlotSchema,
  insertCropPlanSchema,
  insertHarvestRecordSchema,


  insertLraIntegrationSchema,
  insertMoaIntegrationSchema,
  insertCustomsIntegrationSchema,
  insertGovernmentSyncLogSchema,
  insertAnalyticsDataSchema,
  insertAuditLogSchema,
  insertSystemAuditSchema,
  insertAuditReportSchema,
  insertFarmGpsMappingSchema,
  insertDeforestationMonitoringSchema,
  insertEudrComplianceSchema,
  insertGeofencingZoneSchema,
  insertInternationalStandardSchema,
  insertCommodityStandardsComplianceSchema,
  insertStandardsApiIntegrationSchema,
  insertStandardsSyncLogSchema,
  insertTrackingRecordSchema,
  insertTrackingTimelineSchema,
  insertTrackingVerificationSchema,
  insertTrackingAlertSchema,
  insertTrackingReportSchema,
  insertAuthUserSchema,
  insertExporterSchema,
  insertExportOrderSchema
} from "@shared/schema";
import { z } from "zod";

// JWT Secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "agritrace360-dev-secret-key";

// Middleware to verify JWT tokens
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/regulatory-login", async (req, res) => {
    try {
      const { username, password, role, department, userType } = req.body;
      
      // Validate input
      if (!username || !password || !role) {
        return res.status(400).json({ 
          success: false, 
          message: "Username, password, and role are required" 
        });
      }

      // Check if user exists
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }

      // Debug logging
      console.log('Regulatory login attempt:', {
        username,
        requestedRole: role,
        userRole: user.role,
        isRegulatoryRole: ['regulatory_admin', 'regulatory_staff'].includes(role)
      });

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }

      // Verify role permissions - check if user role is valid for regulatory access
      if (!['regulatory_admin', 'regulatory_staff'].includes(user.role)) {
        console.log('Role verification failed:', {
          userRole: user.role,
          requestedRole: role,
          isValidRole: ['regulatory_admin', 'regulatory_staff'].includes(user.role)
        });
        return res.status(403).json({ 
          success: false, 
          message: "Access denied for this role" 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          role: user.role,
          userType: 'regulatory'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      await storage.updateUserLastLogin(user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department
        }
      });

    } catch (error) {
      console.error('Regulatory login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/auth/farmer-login", async (req, res) => {
    try {
      const { farmerId, password, county, phoneNumber, userType } = req.body;
      
      // Validate input
      if (!farmerId || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Farmer ID and password are required" 
        });
      }

      // Check if user exists - farmers use farmerId as username
      const user = await storage.getUserByUsername(farmerId);
      if (!user || user.role !== 'farmer') {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid farmer credentials" 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid farmer credentials" 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          farmerId: user.farmerId, 
          role: user.role,
          userType: 'farmer'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      await storage.updateUserLastLogin(user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          farmerId: user.farmerId,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          jurisdiction: user.jurisdiction
        }
      });

    } catch (error) {
      console.error('Farmer login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/auth/field-agent-login", async (req, res) => {
    try {
      const { agentId, password, jurisdiction, phoneNumber, userType } = req.body;
      
      // Validate input
      if (!agentId || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Agent ID and password are required" 
        });
      }

      // Check if user exists - field agents use agentId as username
      const user = await storage.getUserByUsername(agentId);
      if (!user || user.role !== 'field_agent') {
        console.log('Field agent login failed:', {
          agentId,
          userFound: !!user,
          userRole: user?.role
        });
        return res.status(401).json({ 
          success: false, 
          message: "Invalid field agent credentials" 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid field agent credentials" 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          agentId: agentId, 
          role: user.role,
          userType: 'field_agent',
          jurisdiction: user.jurisdiction
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      await storage.updateUserLastLogin(user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          jurisdiction: user.jurisdiction
        }
      });

    } catch (error) {
      console.error('Field agent login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/auth/exporter-login", async (req, res) => {
    try {
      const { username, password, userType } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Username and password are required" 
        });
      }

      // Check if user exists
      const user = await storage.getUserByUsername(username);
      if (!user || user.role !== 'exporter') {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid exporter credentials" 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid exporter credentials" 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          exporterId: username, 
          role: user.role,
          userType: 'exporter'
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Update last login
      await storage.updateUserLastLogin(user.id);

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          department: user.department,
          jurisdiction: user.jurisdiction
        }
      });

    } catch (error) {
      console.error('Exporter login error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req, res) => {
    try {
      // In a real implementation, you would invalidate the JWT token
      // For now, we'll just confirm the logout
      res.json({
        success: true,
        message: "Logged out successfully"
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  app.post("/api/auth/register", authenticateToken, async (req, res) => {
    try {
      // Only regulatory admins can register new users
      if (req.user.role !== 'regulatory_admin') {
        return res.status(403).json({ 
          success: false, 
          message: "Only administrators can register new users" 
        });
      }

      const validatedData = insertAuthUserSchema.parse(req.body);
      
      // Hash password
      const passwordHash = await bcrypt.hash(validatedData.passwordHash, 12);
      
      const userData = {
        ...validatedData,
        passwordHash
      };

      const user = await storage.createAuthUser(userData);
      res.status(201).json({ success: true, user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        console.error('User registration error:', error);
        res.status(500).json({ 
          success: false, 
          message: "Failed to register user" 
        });
      }
    }
  });

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

  // Advanced Statistics Endpoint - Senior Officials Only
  app.get("/api/dashboard/advanced-statistics", async (req, res) => {
    try {
      // In a real application, you would check user permissions here
      const statistics = {
        totalActivities: 2847,
        successRate: 94.2,
        activeUsers: 156,
        dailyAverage: 312,
        departmentBreakdown: {
          compliance: 1247,
          inspection: 892,
          export: 456,
          county: 252
        },
        performanceMetrics: {
          systemAvailability: 99.8,
          responseTime: 1.2,
          userSatisfaction: 4.7
        },
        trends: {
          weeklyGrowth: 8.5,
          monthlyGrowth: 23.2,
          quarterlyGrowth: 67.8
        }
      };
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch advanced statistics" });
    }
  });

  // System Audit Trail Endpoint - Administrators Only
  app.get("/api/audit/system-logs", async (req, res) => {
    try {
      // In a real application, you would check admin permissions here
      const auditData = {
        summary: {
          securityEvents: 47,
          failedLogins: 23,
          dataChanges: 1234,
          cleanSessions: 2789
        },
        recentEvents: [
          {
            timestamp: "2025-01-23T14:23:15Z",
            eventType: "login",
            user: "james.kollie@lacra.gov.lr",
            action: "User login successful",
            status: "success",
            ipAddress: "192.168.1.45"
          },
          {
            timestamp: "2025-01-23T14:18:42Z",
            eventType: "data_update",
            user: "mary.johnson@lacra.gov.lr",
            action: "Updated commodity record COF-2024-001",
            status: "success",
            ipAddress: "10.0.0.23"
          },
          {
            timestamp: "2025-01-23T14:15:07Z",
            eventType: "failed_login",
            user: "unknown.user@external.com",
            action: "Failed login attempt - invalid credentials",
            status: "failed",
            ipAddress: "203.45.67.89"
          },
          {
            timestamp: "2025-01-23T14:12:33Z",
            eventType: "report_generation",
            user: "samuel.harris@lacra.gov.lr",
            action: "Generated compliance report RPT-2024-078",
            status: "success",
            ipAddress: "192.168.1.67"
          },
          {
            timestamp: "2025-01-23T14:08:19Z",
            eventType: "export",
            user: "admin@lacra.gov.lr",
            action: "Exported farmer database to CSV",
            status: "success",
            ipAddress: "192.168.1.10"
          }
        ]
      };
      res.json(auditData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Transportation Tracking System Endpoints
  app.get("/api/transportation/active-shipments", async (req, res) => {
    try {
      const activeShipments = {
        totalActive: 23,
        inTransit: 18,
        atCheckpoints: 3,
        deliveredToday: 12,
        shipments: [
          {
            id: "TRK-LR-001",
            driverName: "John Kpelle",
            driverLicense: "DL-2024-001",
            cargoType: "Coffee",
            cargoWeight: "2.5 tons",
            batchNumber: "COF-2024-001",
            currentLocation: "Buchanan Port",
            destination: "Buchanan Port",
            status: "delivered",
            lastUpdate: "2 min ago",
            gpsCoordinates: { lat: 5.8817, lng: -10.0464 }
          },
          {
            id: "TRK-LR-002", 
            driverName: "Mary Kollie",
            driverLicense: "DL-2024-002",
            cargoType: "Cocoa",
            cargoWeight: "3.2 tons",
            batchNumber: "COC-2024-002",
            currentLocation: "Gbarnga Checkpoint",
            destination: "Voinjama",
            status: "at_checkpoint",
            lastUpdate: "15 min ago",
            gpsCoordinates: { lat: 7.0000, lng: -9.4833 }
          },
          {
            id: "TRK-LR-003",
            driverName: "Samuel Harris", 
            driverLicense: "DL-2024-003",
            cargoType: "Palm Oil",
            cargoWeight: "1.8 tons",
            batchNumber: "PLM-2024-001",
            currentLocation: "Farm PLT-2024-001",
            destination: "Monrovia",
            status: "loading",
            lastUpdate: "45 min ago",
            gpsCoordinates: { lat: 6.3133, lng: -10.8074 }
          }
        ]
      };
      res.json(activeShipments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active shipments" });
    }
  });

  app.get("/api/transportation/vehicle-tracking", async (req, res) => {
    try {
      const vehicleTracking = {
        liveUpdates: [
          {
            vehicleId: "TRK-LR-001",
            driverName: "John Kpelle",
            coordinates: [6.3077, -10.8077],
            status: "active",
            speed: 45,
            heading: 270,
            lastUpdate: "2 min ago",
            route: "Monrovia-Lofa",
            cargo: "Coffee - 2.5 tons",
            destination: "Buchanan Port",
            eta: "1 hr 15 min"
          },
          {
            vehicleId: "TRK-LR-002",
            driverName: "Mary Kollie",
            coordinates: [7.0000, -9.4833],
            status: "idle",
            speed: 0,
            heading: 180,
            lastUpdate: "15 min ago",
            route: "Port-Processing",
            cargo: "Cocoa - 3.2 tons",
            destination: "Voinjama",
            eta: "2 hr 30 min"
          },
          {
            vehicleId: "TRK-LR-003",
            driverName: "Samuel Harris",
            coordinates: [6.3133, -10.8074],
            status: "maintenance",
            speed: 0,
            heading: 90,
            lastUpdate: "45 min ago",
            route: "Farm-Market",
            cargo: "Palm Oil - 1.8 tons",
            destination: "Monrovia",
            eta: "3 hr 45 min"
          },
          {
            vehicleId: "TRK-LR-004",
            driverName: "James Dolo",
            coordinates: [5.8817, -10.0464],
            status: "active",
            speed: 38,
            heading: 45,
            lastUpdate: "5 min ago",
            route: "Export-Route",
            cargo: "Rubber - 4.1 tons",
            destination: "Port of Monrovia",
            eta: "45 min"
          }
        ]
      };
      res.json(vehicleTracking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vehicle tracking data" });
    }
  });

  // GIS Mapping endpoints
  app.get('/api/gis/locations', async (req, res) => {
    try {
      const county = req.query.county as string;
      const locations = [
        {
          id: "farm-001",
          name: "Kollie Family Farm",
          type: "farm",
          coordinates: [6.4281, -9.4295],
          properties: { cropType: "Coffee", area: "12.5 ha", owner: "John Kollie" }
        },
        {
          id: "processing-001",
          name: "Central Processing Center",
          type: "processing",
          coordinates: [6.3077, -10.8077],
          properties: { capacity: "500 tons/month", commodities: ["Coffee", "Cocoa"] }
        },
        {
          id: "export-001",
          name: "Port of Monrovia",
          type: "export",
          coordinates: [6.3009, -10.7969],
          properties: { type: "Seaport", capacity: "10000 TEU" }
        }
      ];
      
      const filteredLocations = county ? 
        locations.filter(loc => loc.properties.county === county) : 
        locations;
      
      res.json(filteredLocations);
    } catch (error) {
      console.error("Error fetching GIS locations:", error);
      res.status(500).json({ message: "Failed to fetch GIS locations" });
    }
  });

  // Farm plots endpoints
  app.get('/api/farm-plots', async (req, res) => {
    try {
      const farmerId = req.query.farmerId as string;
      const farmPlots = [
        {
          id: 1,
          farmerId: "FRM-2024-001",
          plotName: "Northern Coffee Plot",
          coordinates: [[6.4281, -9.4295], [6.4290, -9.4290], [6.4285, -9.4280], [6.4276, -9.4285]],
          area: 12.5,
          cropType: "Coffee",
          soilType: "Loamy",
          elevation: 245,
          slope: 15,
          waterSource: "Stream",
          accessRoad: true,
          notes: "High-quality arabica plantation with good drainage",
          plantingDate: new Date('2023-03-15'),
          harvestDate: new Date('2023-11-30')
        }
      ];
      
      const filteredPlots = farmerId ? 
        farmPlots.filter(plot => plot.farmerId === farmerId) : 
        farmPlots;
      
      res.json(filteredPlots);
    } catch (error) {
      console.error("Error fetching farm plots:", error);
      res.status(500).json({ message: "Failed to fetch farm plots" });
    }
  });

  app.post('/api/farm-plots', async (req, res) => {
    try {
      const plotData = req.body;
      const newPlot = {
        id: Date.now(),
        ...plotData,
        createdAt: new Date().toISOString()
      };
      res.status(201).json(newPlot);
    } catch (error) {
      console.error("Error creating farm plot:", error);
      res.status(500).json({ message: "Failed to create farm plot" });
    }
  });

  app.patch('/api/farm-plots/:id', async (req, res) => {
    try {
      const plotId = req.params.id;
      const updates = req.body;
      const updatedPlot = {
        id: parseInt(plotId),
        ...updates,
        updatedAt: new Date().toISOString()
      };
      res.json(updatedPlot);
    } catch (error) {
      console.error("Error updating farm plot:", error);
      res.status(500).json({ message: "Failed to update farm plot" });
    }
  });

  app.delete('/api/farm-plots/:id', async (req, res) => {
    try {
      const plotId = req.params.id;
      res.json({ success: true, message: `Farm plot ${plotId} deleted successfully` });
    } catch (error) {
      console.error("Error deleting farm plot:", error);
      res.status(500).json({ message: "Failed to delete farm plot" });
    }
  });

  app.get('/api/farm-plots/:farmerId?', async (req, res) => {
    try {
      const farmerId = req.params.farmerId;
      const plots = [
        {
          id: 1,
          farmerId: "FRM-001",
          plotName: "North Coffee Plot",
          coordinates: [[6.4281, -9.4295], [6.4285, -9.4290], [6.4280, -9.4285], [6.4276, -9.4290]],
          area: 12.5,
          cropType: "Coffee",
          soilType: "Loamy",
          elevation: 450,
          slope: 15,
          waterSource: "Stream",
          accessRoad: true,
          notes: "High quality arabica coffee plantation with good drainage"
        },
        {
          id: 2,
          farmerId: "FRM-001",
          plotName: "South Cocoa Plot",
          coordinates: [[6.4270, -9.4300], [6.4275, -9.4295], [6.4270, -9.4290], [6.4265, -9.4295]],
          area: 8.3,
          cropType: "Cocoa",
          soilType: "Clay",
          elevation: 380,
          slope: 8,
          waterSource: "Well",
          accessRoad: true,
          notes: "Premium cocoa with excellent fermentation facilities"
        }
      ];
      
      const filteredPlots = farmerId ? 
        plots.filter(plot => plot.farmerId === farmerId) : 
        plots;
      
      res.json(filteredPlots);
    } catch (error) {
      console.error("Error fetching farm plots:", error);
      res.status(500).json({ message: "Failed to fetch farm plots" });
    }
  });

  app.post('/api/farm-plots', async (req, res) => {
    try {
      // In a real implementation, this would save to database
      const plot = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date()
      };
      res.json(plot);
    } catch (error) {
      console.error("Error creating farm plot:", error);
      res.status(500).json({ message: "Failed to create farm plot" });
    }
  });

  app.patch('/api/farm-plots/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plot = {
        id,
        ...req.body,
        updatedAt: new Date()
      };
      res.json(plot);
    } catch (error) {
      console.error("Error updating farm plot:", error);
      res.status(500).json({ message: "Failed to update farm plot" });
    }
  });

  app.delete('/api/farm-plots/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // In a real implementation, this would delete from database
      res.json({ success: true, message: `Farm plot ${id} deleted` });
    } catch (error) {
      console.error("Error deleting farm plot:", error);
      res.status(500).json({ message: "Failed to delete farm plot" });
    }
  });

  app.get('/api/transportation/routes', async (req, res) => {
    try {
      const routes = [
        {
          id: "route-001",
          name: "Monrovia-Lofa Coffee Route",
          waypoints: [[6.3077, -10.8077], [6.8000, -9.5000], [7.0000, -9.4833]],
          totalDistance: 280,
          estimatedTime: 360,
          checkpoints: ["Monrovia Central", "Gbarnga Junction", "Voinjama Terminal"]
        },
        {
          id: "route-002",
          name: "Port Processing Route",
          waypoints: [[6.3009, -10.7969], [6.3077, -10.8077], [6.4281, -9.4295]],
          totalDistance: 120,
          estimatedTime: 180,
          checkpoints: ["Port of Monrovia", "Processing Center", "Farm Collection"]
        }
      ];
      res.json(routes);
    } catch (error) {
      console.error("Error fetching transportation routes:", error);
      res.status(500).json({ message: "Failed to fetch transportation routes" });
    }
  });

  // QR Code Scanning endpoint for transportation updates
  app.post("/api/transportation/qr-scan", async (req, res) => {
    try {
      const { vehicleId, checkpointId, scannerLocation, status } = req.body;
      
      // In a real application, this would update the vehicle's location and status
      const scanResult = {
        success: true,
        vehicleId,
        newStatus: status,
        location: scannerLocation,
        timestamp: new Date().toISOString(),
        message: `Vehicle ${vehicleId} status updated to ${status} at ${scannerLocation}`
      };
      
      res.json(scanResult);
    } catch (error) {
      res.status(500).json({ message: "Failed to process QR scan" });
    }
  });

  // Vehicle movement update endpoint 
  app.post("/api/transportation/movement-update", async (req, res) => {
    try {
      const { vehicleId, newLocation, gpsCoordinates, status, notes } = req.body;
      
      const movementUpdate = {
        success: true,
        vehicleId,
        updatedLocation: newLocation,
        coordinates: gpsCoordinates,
        newStatus: status,
        timestamp: new Date().toISOString(),
        notes: notes || ""
      };
      
      res.json(movementUpdate);
    } catch (error) {
      res.status(500).json({ message: "Failed to update vehicle movement" });
    }
  });

  // Route optimization endpoint
  app.get("/api/transportation/route-optimization", async (req, res) => {
    try {
      const routeData = {
        optimizedRoutes: [
          {
            route: "Monrovia → Buchanan",
            vehicleCount: 3,
            fuelSaved: "12%",
            timeSaved: "15 min",
            costReduction: "$45"
          },
          {
            route: "Gbarnga → Voinjama", 
            vehicleCount: 2,
            fuelSaved: "8%",
            timeSaved: "22 min",
            costReduction: "$32"
          },
          {
            route: "Farm clusters → Port",
            vehicleCount: 5,
            fuelSaved: "15%",
            timeSaved: "35 min", 
            costReduction: "$78"
          }
        ],
        suggestions: [
          "Combine TRK-LR-004 & TRK-LR-005 shipments",
          "Alternate route via Kakata for TRK-LR-002",
          "Schedule overnight stop at Gbarnga checkpoint"
        ]
      };
      res.json(routeData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch route optimization data" });
    }
  });

  // Real-time alerts endpoint
  app.get("/api/transportation/alerts", async (req, res) => {
    try {
      const alerts = {
        active: [
          {
            id: "ALERT-001",
            type: "route_deviation",
            vehicleId: "TRK-LR-002",
            severity: "high",
            message: "TRK-LR-002 off planned route by 5km",
            timestamp: new Date(Date.now() - 3 * 60000).toISOString()
          },
          {
            id: "ALERT-002", 
            type: "schedule_delay",
            vehicleId: "TRK-LR-003",
            severity: "medium",
            message: "TRK-LR-003 45 min behind schedule",
            timestamp: new Date(Date.now() - 8 * 60000).toISOString()
          },
          {
            id: "ALERT-003",
            type: "delivery_confirmed", 
            vehicleId: "TRK-LR-001",
            severity: "low",
            message: "TRK-LR-001 delivered successfully",
            timestamp: new Date(Date.now() - 12 * 60000).toISOString()
          }
        ]
      };
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transportation alerts" });
    }
  });

  // Document verification endpoint
  app.get("/api/transportation/document-verification/:vehicleId", async (req, res) => {
    try {
      const { vehicleId } = req.params;
      const verification = {
        vehicleId,
        documents: {
          exportPermit: { status: "valid", expiryDate: "2025-06-15" },
          driverLicense: { status: "valid", expiryDate: "2025-12-20" },
          vehicleRegistration: { status: "valid", expiryDate: "2025-08-30" },
          insurance: { status: "warning", expiryDate: "2025-01-28", daysLeft: 5 }
        },
        overallStatus: "valid_with_warnings",
        lastVerified: new Date().toISOString()
      };
      res.json(verification);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify documents" });
    }
  });

  // Fleet management endpoint
  app.get("/api/transportation/fleet-overview", async (req, res) => {
    try {
      const fleetData = {
        totalVehicles: 45,
        activeVehicles: 38,
        vehicleTypes: {
          largeTrucks: 23,
          mediumTrucks: 15,
          pickupTrucks: 7
        },
        maintenanceStatus: {
          readyForService: 38,
          maintenanceDue: 5,
          outOfService: 2
        },
        totalDrivers: 52,
        driversOnDuty: 23,
        performance: {
          onTimeDeliveries: 94.2,
          averageDelay: 12,
          completedToday: 23,
          fuelEfficiency: 8.2,
          routeOptimization: 87,
          distanceCovered: 2347,
          incidentFreeDays: 45,
          speedViolations: 3,
          safetyScore: 96.8,
          fuelCosts: 1245,
          maintenanceCosts: 456,
          totalSavings: 234
        }
      };
      res.json(fleetData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch fleet overview" });
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

  // Update commodity compliance status
  app.patch("/api/commodities/:id/compliance", async (req, res) => {
    try {
      const commodityId = parseInt(req.params.id);
      const { status, qualityGrade, notes, issues, recommendations } = req.body;

      // Validate input
      if (!status || !qualityGrade) {
        return res.status(400).json({ message: "Status and quality grade are required" });
      }

      // Validate status values
      const validStatuses = ['pending', 'compliant', 'review_required', 'non_compliant'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid compliance status" });
      }

      // Get the current commodity
      const commodity = await storage.getCommodity(commodityId);
      if (!commodity) {
        return res.status(404).json({ message: "Commodity not found" });
      }

      // Update the commodity
      const updatedCommodity = await storage.updateCommodity(commodityId, {
        status,
        qualityGrade
      });

      // Create an inspection record for this compliance update
      const inspectionData = {
        commodityId,
        inspectorId: "SYSTEM",
        inspectorName: "System Update",
        inspectionDate: new Date(),
        qualityGrade,
        complianceStatus: status,
        notes: notes || "Compliance status updated via system",
        deficiencies: issues || "",
        recommendations: recommendations || "",
        nextInspectionDate: new Date(Date.now() + 30 * 24 * 3600000) // 30 days from now
      };

      await storage.createInspection(inspectionData);

      // Create an alert for significant status changes
      if (status === 'non_compliant' || status === 'review_required') {
        const alertData = {
          type: status === 'non_compliant' ? 'error' : 'warning',
          title: `Compliance Issue: ${commodity.name}`,
          message: `Commodity ${commodity.batchNumber} requires attention - Status: ${status.replace('_', ' ')}`,
          priority: status === 'non_compliant' ? 'high' : 'medium',
          relatedEntity: 'commodity',
          relatedEntityId: commodityId,
          source: 'system'
        };
        await storage.createAlert(alertData);
      }

      res.json({
        success: true,
        message: "Compliance status updated successfully",
        commodity: updatedCommodity
      });

    } catch (error) {
      console.error("Error updating compliance status:", error);
      res.status(500).json({ message: "Failed to update compliance status" });
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

  // Inspection routes with jurisdiction filtering
  app.get("/api/inspections", async (req, res) => {
    try {
      const { commodityId, inspectorId, jurisdiction } = req.query;
      let inspections;
      
      if (commodityId) {
        inspections = await storage.getInspectionsByCommodity(parseInt(commodityId as string));
      } else if (inspectorId) {
        inspections = await storage.getInspectionsByInspector(inspectorId as string);
      } else {
        inspections = await storage.getInspections();
      }
      
      // Filter by jurisdiction for field agents
      if (jurisdiction) {
        inspections = inspections.filter(i => i.jurisdiction === jurisdiction);
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

  app.post("/api/alerts/:id/mark-read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markAlertAsRead(id);
      
      if (success) {
        res.json({ message: "Alert marked as read" });
      } else {
        res.status(404).json({ message: "Alert not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to mark alert as read" });
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

  // Enhanced export report generation with real data (GET endpoint for simple access)
  app.get("/api/reports/export-data", async (req, res) => {
    try {
      // Fetch real data from storage
      const allCommodities = await storage.getCommodities();
      const allInspections = await storage.getInspections();
      const allCertifications = await storage.getCertifications();
      
      // Calculate comprehensive export metrics
      const totalWeight = allCommodities.reduce((sum, c) => {
        const weight = parseFloat(c.quantity.replace(/[^\d.]/g, '') || '0');
        return sum + weight;
      }, 0);
      
      const totalValue = allCommodities.reduce((sum, c) => {
        // Estimate value based on commodity type and weight
        const weight = parseFloat(c.quantity.replace(/[^\d.]/g, '') || '0');
        const pricePerMT = c.type === 'Coffee' ? 2500 : c.type === 'Cocoa' ? 2200 : c.type === 'Palm Oil' ? 800 : 1000;
        return sum + (weight * pricePerMT);
      }, 0);
      
      const exportData = {
        totalCommodities: allCommodities.length,
        totalValue: `$${(totalValue).toLocaleString()}`,
        totalWeight: `${totalWeight.toFixed(1)} MT`,
        complianceRate: Math.round((allCommodities.filter(c => c.status === 'compliant').length / allCommodities.length) * 100),
        
        commodities: allCommodities.map(commodity => ({
          type: commodity.type,
          batchCode: commodity.batchNumber,
          originCounty: commodity.county,
          qualityGrade: commodity.qualityGrade,
          weight: commodity.quantity,
          value: parseFloat(commodity.quantity.replace(/[^\d.]/g, '') || '0') * (commodity.type === 'Coffee' ? 2500 : commodity.type === 'Cocoa' ? 2200 : commodity.type === 'Palm Oil' ? 800 : 1000),
          complianceStatus: commodity.status === 'compliant' ? 'Compliant' : 'Non-Compliant'
        })),
        
        inspections: allInspections.map(inspection => ({
          commodityType: allCommodities.find(c => c.id === inspection.commodityId)?.type || 'Unknown',
          inspector: inspection.inspector || 'Inspector Assignment Pending',
          location: inspection.location,
          result: inspection.complianceStatus === 'approved' ? 'Pass' : 'Fail',
          date: inspection.inspectionDate
        })),
        
        inspectionStats: {
          passed: allInspections.filter(i => i.complianceStatus === 'approved').length,
          failed: allInspections.filter(i => i.complianceStatus === 'failed').length,
          pending: allInspections.filter(i => i.complianceStatus === 'review_required').length
        },
        
        certifications: allCertifications.map(cert => ({
          type: cert.certificationType,
          status: cert.status === 'active' ? 'Valid' : 'Expired',
          expiryDate: cert.expiryDate
        })),
        
        destinations: [
          { country: 'United States', percentage: 35 },
          { country: 'Germany', percentage: 25 },
          { country: 'Netherlands', percentage: 20 },
          { country: 'France', percentage: 12 },
          { country: 'Others', percentage: 8 }
        ]
      };
      
      res.json(exportData);
    } catch (error) {
      console.error("Error generating export data:", error);
      res.status(500).json({ message: "Failed to generate export data" });
    }
  });

  // Enhanced export report generation with real data (POST for complex filtering)
  app.post("/api/reports/export-data", async (req, res) => {
    try {
      const { reportType, dateRange, counties, commodities } = req.body;
      
      // Fetch real data from storage
      const allCommodities = await storage.getCommodities();
      const allInspections = await storage.getInspections();
      const allCertifications = await storage.getCertifications();
      
      // Filter data based on parameters
      let filteredCommodities = allCommodities;
      if (counties && counties.length > 0) {
        filteredCommodities = allCommodities.filter(c => counties.includes(c.county));
      }
      if (commodities && commodities.length > 0) {
        filteredCommodities = filteredCommodities.filter(c => commodities.includes(c.type));
      }
      
      // Generate comprehensive export report data
      const exportData = {
        summary: {
          totalCommodities: filteredCommodities.length,
          totalQuantity: filteredCommodities.reduce((sum, c) => sum + parseFloat(c.quantity.replace(/[^\d.]/g, '') || '0'), 0),
          compliantCommodities: filteredCommodities.filter(c => c.status === 'compliant').length,
          complianceRate: Math.round((filteredCommodities.filter(c => c.status === 'compliant').length / filteredCommodities.length) * 100),
          exportReadyCommodities: filteredCommodities.filter(c => c.status === 'compliant' && c.certificationStatus === 'certified').length
        },
        commodityBreakdown: filteredCommodities.map(commodity => ({
          batchNumber: commodity.batchNumber,
          name: commodity.name,
          type: commodity.type,
          quantity: commodity.quantity,
          qualityGrade: commodity.qualityGrade,
          county: commodity.county,
          farmer: commodity.farmer,
          status: commodity.status,
          certificationStatus: commodity.certificationStatus,
          harvestDate: commodity.harvestDate,
          exportEligible: commodity.status === 'compliant' && commodity.certificationStatus === 'certified'
        })),
        qualityDistribution: {
          premium: filteredCommodities.filter(c => c.qualityGrade === 'Premium').length,
          grade_a: filteredCommodities.filter(c => c.qualityGrade === 'Grade A').length,
          grade_b: filteredCommodities.filter(c => c.qualityGrade === 'Grade B').length,
          standard: filteredCommodities.filter(c => c.qualityGrade === 'Standard').length
        },
        countyDistribution: filteredCommodities.reduce((acc, commodity) => {
          acc[commodity.county] = (acc[commodity.county] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        inspectionStatus: {
          total: allInspections.filter(i => filteredCommodities.some(c => c.id === i.commodityId)).length,
          passed: allInspections.filter(i => 
            filteredCommodities.some(c => c.id === i.commodityId) && 
            i.complianceStatus === 'approved'
          ).length,
          pending: allInspections.filter(i => 
            filteredCommodities.some(c => c.id === i.commodityId) && 
            i.complianceStatus === 'review_required'
          ).length
        },
        certificationStatus: {
          total: allCertifications.filter(cert => filteredCommodities.some(c => c.id === cert.commodityId)).length,
          active: allCertifications.filter(cert => 
            filteredCommodities.some(c => c.id === cert.commodityId) && 
            cert.status === 'active'
          ).length,
          expired: allCertifications.filter(cert => 
            filteredCommodities.some(c => c.id === cert.commodityId) && 
            cert.status === 'expired'
          ).length
        },
        exportValue: {
          estimatedValue: filteredCommodities.reduce((sum, c) => {
            const quantity = parseFloat(c.quantity.replace(/[^\d.]/g, '') || '0');
            const basePrice = c.type === 'coffee' ? 2500 : c.type === 'cocoa' ? 2000 : 1500; // USD per MT
            return sum + (quantity * basePrice);
          }, 0),
          currency: 'USD',
          exchangeRate: 'LRD 155.50 = USD 1.00'
        },
        generatedAt: new Date().toISOString(),
        reportParameters: {
          reportType,
          dateRange,
          counties: counties || 'All Counties',
          commodities: commodities || 'All Commodities'
        }
      };
      
      res.json(exportData);
    } catch (error) {
      console.error("Error generating export report data:", error);
      res.status(500).json({ message: "Failed to generate export report data" });
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

  // Farm Management Platform Routes
  
  // Farmer routes
  app.get("/api/farmers", async (req, res) => {
    try {
      const { county } = req.query;
      let farmers;
      
      if (county) {
        farmers = await storage.getFarmersByCounty(county as string);
      } else {
        farmers = await storage.getFarmers();
      }
      
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmers" });
    }
  });

  // Farmer routes with jurisdiction filtering
  app.get("/api/farmers", async (req, res) => {
    try {
      const { county, jurisdiction } = req.query;
      let farmers = await storage.getFarmers();
      
      // Filter by county/jurisdiction for field agents
      if (county) {
        farmers = farmers.filter(f => f.county === county);
      } else if (jurisdiction) {
        farmers = farmers.filter(f => f.county === jurisdiction);
      }
      
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmers" });
    }
  });

  app.get("/api/farmers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const farmer = await storage.getFarmer(id);
      
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      
      res.json(farmer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer" });
    }
  });

  app.post("/api/farmers", async (req, res) => {
    try {
      const validatedData = insertFarmerSchema.parse(req.body);
      const farmer = await storage.createFarmer(validatedData);
      res.status(201).json(farmer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create farmer" });
    }
  });

  // Farm Plot routes
  app.get("/api/farm-plots", async (req, res) => {
    try {
      const { farmerId } = req.query;
      let farmPlots;
      
      if (farmerId) {
        farmPlots = await storage.getFarmPlotsByFarmer(parseInt(farmerId as string));
      } else {
        farmPlots = await storage.getFarmPlots();
      }
      
      res.json(farmPlots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farm plots" });
    }
  });

  app.post("/api/farm-plots", async (req, res) => {
    try {
      const validatedData = insertFarmPlotSchema.parse(req.body);
      const farmPlot = await storage.createFarmPlot(validatedData);
      res.status(201).json(farmPlot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create farm plot" });
    }
  });

  // Crop Plan routes
  app.get("/api/crop-plans", async (req, res) => {
    try {
      const { farmerId, year, season } = req.query;
      let cropPlans;
      
      if (farmerId) {
        cropPlans = await storage.getCropPlansByFarmer(parseInt(farmerId as string));
      } else if (year && season) {
        cropPlans = await storage.getCropPlansBySeason(parseInt(year as string), season as string);
      } else {
        cropPlans = await storage.getCropPlans();
      }
      
      res.json(cropPlans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crop plans" });
    }
  });

  app.post("/api/crop-plans", async (req, res) => {
    try {
      const validatedData = insertCropPlanSchema.parse(req.body);
      const cropPlan = await storage.createCropPlan(validatedData);
      res.status(201).json(cropPlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create crop plan" });
    }
  });



  // Government Integration Routes
  
  // LRA Integration routes
  app.get("/api/lra-integrations", async (req, res) => {
    try {
      const { status } = req.query;
      let integrations;
      
      if (status) {
        integrations = await storage.getLraIntegrationsByStatus(status as string);
      } else {
        integrations = await storage.getLraIntegrations();
      }
      
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch LRA integrations" });
    }
  });

  app.post("/api/lra-integrations", async (req, res) => {
    try {
      const validatedData = insertLraIntegrationSchema.parse(req.body);
      const integration = await storage.createLraIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create LRA integration" });
    }
  });

  // MOA Integration routes
  app.get("/api/moa-integrations", async (req, res) => {
    try {
      const { status } = req.query;
      let integrations;
      
      if (status) {
        integrations = await storage.getMoaIntegrationsByStatus(status as string);
      } else {
        integrations = await storage.getMoaIntegrations();
      }
      
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch MOA integrations" });
    }
  });

  app.post("/api/moa-integrations", async (req, res) => {
    try {
      const validatedData = insertMoaIntegrationSchema.parse(req.body);
      const integration = await storage.createMoaIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create MOA integration" });
    }
  });

  // Customs Integration routes
  app.get("/api/customs-integrations", async (req, res) => {
    try {
      const { status } = req.query;
      let integrations;
      
      if (status) {
        integrations = await storage.getCustomsIntegrationsByStatus(status as string);
      } else {
        integrations = await storage.getCustomsIntegrations();
      }
      
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Customs integrations" });
    }
  });

  app.post("/api/customs-integrations", async (req, res) => {
    try {
      const validatedData = insertCustomsIntegrationSchema.parse(req.body);
      const integration = await storage.createCustomsIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create Customs integration" });
    }
  });

  // Government Sync Log routes
  app.get("/api/government-sync-logs", async (req, res) => {
    try {
      const { syncType, entityId } = req.query;
      let logs;
      
      if (syncType && entityId) {
        logs = await storage.getGovernmentSyncLogsByEntity(parseInt(entityId as string), syncType as string);
      } else if (syncType) {
        logs = await storage.getGovernmentSyncLogsByType(syncType as string);
      } else {
        logs = await storage.getGovernmentSyncLogs();
      }
      
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch government sync logs" });
    }
  });

  // Government Synchronization endpoints
  app.post("/api/sync/lra/:commodityId", async (req, res) => {
    try {
      const commodityId = parseInt(req.params.commodityId);
      const result = await storage.syncWithLRA(commodityId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to sync with LRA" });
    }
  });

  app.post("/api/sync/moa/:commodityId", async (req, res) => {
    try {
      const commodityId = parseInt(req.params.commodityId);
      const result = await storage.syncWithMOA(commodityId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to sync with MOA" });
    }
  });

  app.post("/api/sync/customs/:commodityId", async (req, res) => {
    try {
      const commodityId = parseInt(req.params.commodityId);
      const result = await storage.syncWithCustoms(commodityId);
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to sync with Customs" });
    }
  });

  // Government Compliance Status endpoint
  app.get("/api/government-compliance/:commodityId", async (req, res) => {
    try {
      const commodityId = parseInt(req.params.commodityId);
      const status = await storage.getGovernmentComplianceStatus(commodityId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch government compliance status" });
    }
  });

  // Analytics routes (AgriTrace360™ Admin only)
  app.get("/api/analytics", async (req, res) => {
    try {
      const { dataType, timeframe } = req.query;
      const data = await storage.getAnalyticsData(
        dataType as string,
        timeframe as string
      );
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  app.post("/api/analytics", async (req, res) => {
    try {
      const validatedData = insertAnalyticsDataSchema.parse(req.body);
      const analytics = await storage.createAnalyticsData(validatedData);
      res.status(201).json(analytics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid analytics data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create analytics data" });
    }
  });

  app.get("/api/analytics/compliance-trends", async (req, res) => {
    try {
      const { timeframe = "monthly" } = req.query;
      const trends = await storage.generateComplianceTrends(timeframe as string);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate compliance trends" });
    }
  });

  app.get("/api/analytics/farm-performance", async (req, res) => {
    try {
      const { farmerId } = req.query;
      const performance = await storage.generateFarmPerformanceAnalytics(
        farmerId ? parseInt(farmerId as string) : undefined
      );
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate farm performance analytics" });
    }
  });

  app.get("/api/analytics/regional", async (req, res) => {
    try {
      const { county } = req.query;
      const regional = await storage.generateRegionalAnalytics(county as string);
      res.json(regional);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate regional analytics" });
    }
  });

  app.get("/api/analytics/system-health", async (req, res) => {
    try {
      const health = await storage.generateSystemHealthMetrics();
      res.json(health);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate system health metrics" });
    }
  });

  // Audit routes (AgriTrace360™ Admin only)
  app.get("/api/audit/logs", async (req, res) => {
    try {
      const { auditType, userId, startDate, endDate } = req.query;
      const logs = await storage.getAuditLogs(
        auditType as string,
        userId as string,
        startDate ? new Date(startDate as string) : undefined,
        endDate ? new Date(endDate as string) : undefined
      );
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  app.post("/api/audit/logs", async (req, res) => {
    try {
      const validatedData = insertAuditLogSchema.parse(req.body);
      const log = await storage.createAuditLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid audit log data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create audit log" });
    }
  });

  app.get("/api/audit/system-audits", async (req, res) => {
    try {
      const { status } = req.query;
      const audits = await storage.getSystemAudits(status as string);
      res.json(audits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system audits" });
    }
  });

  app.get("/api/audit/system-audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.getSystemAudit(id);
      
      if (!audit) {
        return res.status(404).json({ message: "System audit not found" });
      }
      
      res.json(audit);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system audit" });
    }
  });

  app.post("/api/audit/system-audits", async (req, res) => {
    try {
      const validatedData = insertSystemAuditSchema.parse(req.body);
      const audit = await storage.createSystemAudit(validatedData);
      res.status(201).json(audit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid system audit data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create system audit" });
    }
  });

  app.patch("/api/audit/system-audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.updateSystemAudit(id, req.body);
      
      if (!audit) {
        return res.status(404).json({ message: "System audit not found" });
      }
      
      res.json(audit);
    } catch (error) {
      res.status(500).json({ message: "Failed to update system audit" });
    }
  });

  app.get("/api/audit/reports", async (req, res) => {
    try {
      const { confidentialityLevel } = req.query;
      const reports = await storage.getAuditReports(confidentialityLevel as string);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit reports" });
    }
  });

  app.get("/api/audit/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getAuditReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Audit report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audit report" });
    }
  });

  app.post("/api/audit/reports", async (req, res) => {
    try {
      const validatedData = insertAuditReportSchema.parse(req.body);
      const report = await storage.createAuditReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid audit report data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create audit report" });
    }
  });

  app.patch("/api/audit/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.updateAuditReport(id, req.body);
      
      if (!report) {
        return res.status(404).json({ message: "Audit report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to update audit report" });
    }
  });

  // GPS Farm Mapping routes
  app.get('/api/farm-gps-mappings', async (req, res) => {
    try {
      const { farmerId, farmPlotId } = req.query;
      let mappings;
      
      if (farmerId) {
        mappings = await storage.getFarmGpsMappingsByFarmer(parseInt(farmerId as string));
      } else {
        mappings = await storage.getFarmGpsMappings();
      }
      
      res.json(mappings);
    } catch (error) {
      console.error('Error fetching GPS mappings:', error);
      res.status(500).json({ message: 'Failed to fetch GPS mappings' });
    }
  });

  app.get('/api/farm-gps-mappings/:id', async (req, res) => {
    try {
      const mapping = await storage.getFarmGpsMapping(parseInt(req.params.id));
      if (!mapping) {
        return res.status(404).json({ message: 'GPS mapping not found' });
      }
      res.json(mapping);
    } catch (error) {
      console.error('Error fetching GPS mapping:', error);
      res.status(500).json({ message: 'Failed to fetch GPS mapping' });
    }
  });

  app.post('/api/farm-gps-mappings', async (req, res) => {
    try {
      const validatedData = insertFarmGpsMappingSchema.parse(req.body);
      const mapping = await storage.createFarmGpsMapping(validatedData);
      res.status(201).json(mapping);
    } catch (error) {
      console.error('Error creating GPS mapping:', error);
      res.status(500).json({ message: 'Failed to create GPS mapping' });
    }
  });

  app.put('/api/farm-gps-mappings/:id', async (req, res) => {
    try {
      const updatedMapping = await storage.updateFarmGpsMapping(parseInt(req.params.id), req.body);
      if (!updatedMapping) {
        return res.status(404).json({ message: 'GPS mapping not found' });
      }
      res.json(updatedMapping);
    } catch (error) {
      console.error('Error updating GPS mapping:', error);
      res.status(500).json({ message: 'Failed to update GPS mapping' });
    }
  });

  // Deforestation Monitoring routes
  app.get('/api/deforestation-monitoring', async (req, res) => {
    try {
      const { farmGpsMappingId, riskLevel } = req.query;
      let monitorings;
      
      if (farmGpsMappingId) {
        monitorings = await storage.getDeforestationMonitoringsByMapping(parseInt(farmGpsMappingId as string));
      } else if (riskLevel) {
        monitorings = await storage.getDeforestationMonitoringsByRiskLevel(riskLevel as string);
      } else {
        monitorings = await storage.getDeforestationMonitorings();
      }
      
      res.json(monitorings);
    } catch (error) {
      console.error('Error fetching deforestation monitoring:', error);
      res.status(500).json({ message: 'Failed to fetch deforestation monitoring' });
    }
  });

  app.get('/api/deforestation-monitoring/:id', async (req, res) => {
    try {
      const monitoring = await storage.getDeforestationMonitoring(parseInt(req.params.id));
      if (!monitoring) {
        return res.status(404).json({ message: 'Deforestation monitoring not found' });
      }
      res.json(monitoring);
    } catch (error) {
      console.error('Error fetching deforestation monitoring:', error);
      res.status(500).json({ message: 'Failed to fetch deforestation monitoring' });
    }
  });

  app.post('/api/deforestation-monitoring', async (req, res) => {
    try {
      const validatedData = insertDeforestationMonitoringSchema.parse(req.body);
      const monitoring = await storage.createDeforestationMonitoring(validatedData);
      res.status(201).json(monitoring);
    } catch (error) {
      console.error('Error creating deforestation monitoring:', error);
      res.status(500).json({ message: 'Failed to create deforestation monitoring' });
    }
  });

  // EUDR Compliance routes
  app.get('/api/eudr-compliance', async (req, res) => {
    try {
      const { commodityId, farmGpsMappingId } = req.query;
      let compliances;
      
      if (commodityId) {
        compliances = await storage.getEudrComplianceByCommodity(parseInt(commodityId as string));
      } else if (farmGpsMappingId) {
        const compliance = await storage.getEudrComplianceByMapping(parseInt(farmGpsMappingId as string));
        compliances = compliance ? [compliance] : [];
      } else {
        compliances = await storage.getEudrCompliances();
      }
      
      res.json(compliances);
    } catch (error) {
      console.error('Error fetching EUDR compliance:', error);
      res.status(500).json({ message: 'Failed to fetch EUDR compliance' });
    }
  });

  app.get('/api/eudr-compliance/:id', async (req, res) => {
    try {
      const compliance = await storage.getEudrCompliance(parseInt(req.params.id));
      if (!compliance) {
        return res.status(404).json({ message: 'EUDR compliance not found' });
      }
      res.json(compliance);
    } catch (error) {
      console.error('Error fetching EUDR compliance:', error);
      res.status(500).json({ message: 'Failed to fetch EUDR compliance' });
    }
  });

  app.post('/api/eudr-compliance', async (req, res) => {
    try {
      const validatedData = insertEudrComplianceSchema.parse(req.body);
      const compliance = await storage.createEudrCompliance(validatedData);
      res.status(201).json(compliance);
    } catch (error) {
      console.error('Error creating EUDR compliance:', error);
      res.status(500).json({ message: 'Failed to create EUDR compliance' });
    }
  });

  // Geofencing Zones routes
  app.get('/api/geofencing-zones', async (req, res) => {
    try {
      const { zoneType } = req.query;
      let zones;
      
      if (zoneType) {
        zones = await storage.getGeofencingZonesByType(zoneType as string);
      } else {
        zones = await storage.getGeofencingZones();
      }
      
      res.json(zones);
    } catch (error) {
      console.error('Error fetching geofencing zones:', error);
      res.status(500).json({ message: 'Failed to fetch geofencing zones' });
    }
  });

  app.get('/api/geofencing-zones/:id', async (req, res) => {
    try {
      const zone = await storage.getGeofencingZone(parseInt(req.params.id));
      if (!zone) {
        return res.status(404).json({ message: 'Geofencing zone not found' });
      }
      res.json(zone);
    } catch (error) {
      console.error('Error fetching geofencing zone:', error);
      res.status(500).json({ message: 'Failed to fetch geofencing zone' });
    }
  });

  app.post('/api/geofencing-zones', async (req, res) => {
    try {
      const validatedData = insertGeofencingZoneSchema.parse(req.body);
      const zone = await storage.createGeofencingZone(validatedData);
      res.status(201).json(zone);
    } catch (error) {
      console.error('Error creating geofencing zone:', error);
      res.status(500).json({ message: 'Failed to create geofencing zone' });
    }
  });

  // GPS Analysis and Validation routes
  app.post('/api/gps/validate-coordinates', async (req, res) => {
    try {
      const { coordinates } = req.body;
      if (!coordinates) {
        return res.status(400).json({ message: 'Coordinates required' });
      }
      
      const validation = await storage.validateGpsCoordinates(coordinates);
      res.json(validation);
    } catch (error) {
      console.error('Error validating GPS coordinates:', error);
      res.status(500).json({ message: 'Failed to validate GPS coordinates' });
    }
  });

  app.get('/api/gps/check-eudr-compliance/:farmGpsMappingId', async (req, res) => {
    try {
      const complianceCheck = await storage.checkEudrCompliance(parseInt(req.params.farmGpsMappingId));
      res.json(complianceCheck);
    } catch (error) {
      console.error('Error checking EUDR compliance:', error);
      res.status(500).json({ message: 'Failed to check EUDR compliance' });
    }
  });

  app.get('/api/gps/detect-deforestation/:farmGpsMappingId', async (req, res) => {
    try {
      const deforestationCheck = await storage.detectDeforestation(parseInt(req.params.farmGpsMappingId));
      res.json(deforestationCheck);
    } catch (error) {
      console.error('Error detecting deforestation:', error);
      res.status(500).json({ message: 'Failed to detect deforestation' });
    }
  });

  app.get('/api/gps/traceability-report/:commodityId', async (req, res) => {
    try {
      const report = await storage.generateTraceabilityReport(parseInt(req.params.commodityId));
      res.json(report);
    } catch (error) {
      console.error('Error generating traceability report:', error);
      res.status(500).json({ message: 'Failed to generate traceability report' });
    }
  });

  // Role validation middleware for international standards
  const checkAdminStaffRole = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const userRole = payload.role;
      
      if (userRole !== 'regulatory_admin' && userRole !== 'regulatory_staff') {
        return res.status(403).json({ 
          message: 'Access denied. This resource is restricted to LACRA administrators and staff only.' 
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };

  // International Standards routes (protected)
  app.get('/api/international-standards', checkAdminStaffRole, async (req, res) => {
    try {
      const { standardType, organizationName } = req.query;
      let standards;
      
      if (standardType) {
        standards = await storage.getInternationalStandardsByType(standardType as string);
      } else if (organizationName) {
        standards = await storage.getInternationalStandardsByOrganization(organizationName as string);
      } else {
        standards = await storage.getInternationalStandards();
      }
      
      res.json(standards);
    } catch (error) {
      console.error('Error fetching international standards:', error);
      res.status(500).json({ message: 'Failed to fetch international standards' });
    }
  });

  app.get('/api/international-standards/overview', checkAdminStaffRole, async (req, res) => {
    try {
      const standards = await storage.getInternationalStandards();
      const compliance = await storage.getStandardsCompliance();
      
      const overview = {
        totalStandards: standards.length,
        standardsByType: standards.reduce((acc: any, std) => {
          acc[std.standardType] = (acc[std.standardType] || 0) + 1;
          return acc;
        }, {}),
        complianceOverview: {
          total: compliance.length,
          compliant: compliance.filter(c => c.complianceStatus === 'compliant').length,
          nonCompliant: compliance.filter(c => c.complianceStatus === 'non_compliant').length,
          pending: compliance.filter(c => c.complianceStatus === 'pending').length,
          expired: compliance.filter(c => c.complianceStatus === 'expired').length
        }
      };
      
      res.json(overview);
    } catch (error) {
      console.error('Error generating international standards overview:', error);
      res.status(500).json({ message: 'Failed to generate overview' });
    }
  });

  app.get('/api/international-standards/:id', checkAdminStaffRole, async (req, res) => {
    try {
      const standard = await storage.getInternationalStandard(parseInt(req.params.id));
      if (!standard) {
        return res.status(404).json({ message: 'International standard not found' });
      }
      res.json(standard);
    } catch (error) {
      console.error('Error fetching international standard:', error);
      res.status(500).json({ message: 'Failed to fetch international standard' });
    }
  });

  app.post('/api/international-standards', checkAdminStaffRole, async (req, res) => {
    try {
      const validatedData = insertInternationalStandardSchema.parse(req.body);
      const standard = await storage.createInternationalStandard(validatedData);
      res.status(201).json(standard);
    } catch (error) {
      console.error('Error creating international standard:', error);
      res.status(500).json({ message: 'Failed to create international standard' });
    }
  });

  app.post('/api/international-standards/:id/sync', checkAdminStaffRole, async (req, res) => {
    try {
      const standardId = parseInt(req.params.id);
      
      // Simulate sync process
      const syncResult = {
        success: true,
        syncDate: new Date(),
        recordsUpdated: Math.floor(Math.random() * 100) + 1,
        message: 'Standards database synchronized successfully'
      };
      
      res.json(syncResult);
    } catch (error) {
      console.error('Error syncing with standards database:', error);
      res.status(500).json({ message: 'Failed to sync with standards database' });
    }
  });

  // Standards Compliance routes (protected)
  app.get('/api/standards-compliance', checkAdminStaffRole, async (req, res) => {
    try {
      const { commodityId, standardId, status } = req.query;
      let compliance;
      
      if (commodityId) {
        compliance = await storage.getStandardsComplianceByCommodity(parseInt(commodityId as string));
      } else if (standardId) {
        compliance = await storage.getStandardsComplianceByStandard(parseInt(standardId as string));
      } else if (status) {
        compliance = await storage.getStandardsComplianceByStatus(status as string);
      } else {
        compliance = await storage.getStandardsCompliance();
      }
      
      res.json(compliance);
    } catch (error) {
      console.error('Error fetching standards compliance:', error);
      res.status(500).json({ message: 'Failed to fetch standards compliance' });
    }
  });

  app.post('/api/standards-compliance', checkAdminStaffRole, async (req, res) => {
    try {
      const validatedData = insertCommodityStandardsComplianceSchema.parse(req.body);
      const compliance = await storage.createStandardsCompliance(validatedData);
      res.status(201).json(compliance);
    } catch (error) {
      console.error('Error creating standards compliance:', error);
      res.status(500).json({ message: 'Failed to create standards compliance' });
    }
  });

  app.post('/api/commodities/:id/check-standards-compliance', checkAdminStaffRole, async (req, res) => {
    try {
      const commodityId = parseInt(req.params.id);
      
      // Simulate compliance check process
      const complianceResult = {
        commodityId,
        overallScore: Math.floor(Math.random() * 100) + 1,
        complianceChecks: [
          { standard: 'Fair Trade', status: 'compliant', score: 95 },
          { standard: 'Rainforest Alliance', status: 'pending', score: 0 },
          { standard: 'UTZ', status: 'compliant', score: 88 },
          { standard: 'GlobalGAP', status: 'non_compliant', score: 45 }
        ],
        recommendations: [
          'Complete Rainforest Alliance documentation',
          'Improve GlobalGAP certification requirements'
        ],
        checkDate: new Date()
      };
      
      res.json(complianceResult);
    } catch (error) {
      console.error('Error checking standards compliance:', error);
      res.status(500).json({ message: 'Failed to check standards compliance' });
    }
  });

  // Standards API Integration routes (protected)
  app.get('/api/standards-api-integrations', checkAdminStaffRole, async (req, res) => {
    try {
      const { standardId } = req.query;
      let integrations;
      
      if (standardId) {
        integrations = await storage.getStandardsApiIntegrationByStandard(parseInt(standardId as string));
      } else {
        integrations = await storage.getStandardsApiIntegrations();
      }
      
      res.json(integrations);
    } catch (error) {
      console.error('Error fetching standards API integrations:', error);
      res.status(500).json({ message: 'Failed to fetch standards API integrations' });
    }
  });

  app.post('/api/standards-api-integrations', checkAdminStaffRole, async (req, res) => {
    try {
      const validatedData = insertStandardsApiIntegrationSchema.parse(req.body);
      const integration = await storage.createStandardsApiIntegration(validatedData);
      res.status(201).json(integration);
    } catch (error) {
      console.error('Error creating standards API integration:', error);
      res.status(500).json({ message: 'Failed to create standards API integration' });
    }
  });

  // Standards Sync Log routes (protected)
  app.get('/api/standards-sync-logs', checkAdminStaffRole, async (req, res) => {
    try {
      const { apiIntegrationId } = req.query;
      let logs;
      
      if (apiIntegrationId) {
        logs = await storage.getStandardsSyncLogsByIntegration(parseInt(apiIntegrationId as string));
      } else {
        logs = await storage.getStandardsSyncLogs();
      }
      
      res.json(logs);
    } catch (error) {
      console.error('Error fetching standards sync logs:', error);
      res.status(500).json({ message: 'Failed to fetch standards sync logs' });
    }
  });

  app.post('/api/standards-sync-logs', checkAdminStaffRole, async (req, res) => {
    try {
      const validatedData = insertStandardsSyncLogSchema.parse(req.body);
      const log = await storage.createStandardsSyncLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      console.error('Error creating standards sync log:', error);
      res.status(500).json({ message: 'Failed to create standards sync log' });
    }
  });

  // Tracking Records API
  app.get('/api/tracking-records', async (req, res) => {
    try {
      const { commodityId, farmerId } = req.query;
      let records;
      
      if (commodityId) {
        records = await storage.getTrackingRecordsByCommodity(parseInt(commodityId as string));
      } else if (farmerId) {
        records = await storage.getTrackingRecordsByFarmer(parseInt(farmerId as string));
      } else {
        records = await storage.getTrackingRecords();
      }
      
      res.json(records);
    } catch (error) {
      console.error('Error fetching tracking records:', error);
      res.status(500).json({ message: 'Failed to fetch tracking records' });
    }
  });

  app.get('/api/tracking-records/:id', authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const record = await storage.getTrackingRecord(id);
      
      if (!record) {
        return res.status(404).json({ message: 'Tracking record not found' });
      }
      
      res.json(record);
    } catch (error) {
      console.error('Error fetching tracking record:', error);
      res.status(500).json({ message: 'Failed to fetch tracking record' });
    }
  });

  app.post('/api/tracking-records', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTrackingRecordSchema.parse(req.body);
      const record = await storage.createTrackingRecord(validatedData);
      res.status(201).json(record);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating tracking record:', error);
      res.status(500).json({ message: 'Failed to create tracking record' });
    }
  });

  app.put('/api/tracking-records/:id', authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const record = await storage.updateTrackingRecord(id, updates);
      
      if (!record) {
        return res.status(404).json({ message: 'Tracking record not found' });
      }
      
      res.json(record);
    } catch (error) {
      console.error('Error updating tracking record:', error);
      res.status(500).json({ message: 'Failed to update tracking record' });
    }
  });

  // Tracking Verification API - Public endpoint for certificate verification
  app.get('/api/tracking/verify/:trackingNumber', async (req, res) => {
    try {
      const trackingNumber = req.params.trackingNumber;
      const result = await storage.verifyTrackingRecord(trackingNumber);
      res.json(result);
    } catch (error) {
      console.error('Error verifying tracking record:', error);
      res.status(500).json({ message: 'Failed to verify tracking record' });
    }
  });

  // Tracking Timeline API
  app.get('/api/tracking-timeline/:trackingRecordId', authenticateToken, async (req, res) => {
    try {
      const trackingRecordId = parseInt(req.params.trackingRecordId);
      const timeline = await storage.getTrackingTimeline(trackingRecordId);
      res.json(timeline);
    } catch (error) {
      console.error('Error fetching tracking timeline:', error);
      res.status(500).json({ message: 'Failed to fetch tracking timeline' });
    }
  });

  app.post('/api/tracking-timeline', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTrackingTimelineSchema.parse(req.body);
      const event = await storage.createTrackingTimelineEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating tracking timeline event:', error);
      res.status(500).json({ message: 'Failed to create tracking timeline event' });
    }
  });

  // Tracking Verifications API
  app.get('/api/tracking-verifications/:trackingRecordId', authenticateToken, async (req, res) => {
    try {
      const trackingRecordId = parseInt(req.params.trackingRecordId);
      const verifications = await storage.getTrackingVerifications(trackingRecordId);
      res.json(verifications);
    } catch (error) {
      console.error('Error fetching tracking verifications:', error);
      res.status(500).json({ message: 'Failed to fetch tracking verifications' });
    }
  });

  app.post('/api/tracking-verifications', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTrackingVerificationSchema.parse(req.body);
      const verification = await storage.createTrackingVerification(validatedData);
      res.status(201).json(verification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating tracking verification:', error);
      res.status(500).json({ message: 'Failed to create tracking verification' });
    }
  });

  // Tracking Alerts API
  app.get('/api/tracking-alerts', authenticateToken, async (req, res) => {
    try {
      const { trackingRecordId } = req.query;
      const alerts = await storage.getTrackingAlerts(
        trackingRecordId ? parseInt(trackingRecordId as string) : undefined
      );
      res.json(alerts);
    } catch (error) {
      console.error('Error fetching tracking alerts:', error);
      res.status(500).json({ message: 'Failed to fetch tracking alerts' });
    }
  });

  app.post('/api/tracking-alerts', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTrackingAlertSchema.parse(req.body);
      const alert = await storage.createTrackingAlert(validatedData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating tracking alert:', error);
      res.status(500).json({ message: 'Failed to create tracking alert' });
    }
  });

  // Tracking Reports API
  app.get('/api/tracking-reports', authenticateToken, async (req, res) => {
    try {
      const { trackingRecordId } = req.query;
      const reports = await storage.getTrackingReports(
        trackingRecordId ? parseInt(trackingRecordId as string) : undefined
      );
      res.json(reports);
    } catch (error) {
      console.error('Error fetching tracking reports:', error);
      res.status(500).json({ message: 'Failed to fetch tracking reports' });
    }
  });

  app.post('/api/tracking-reports', authenticateToken, async (req, res) => {
    try {
      const validatedData = insertTrackingReportSchema.parse(req.body);
      const report = await storage.createTrackingReport(validatedData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      console.error('Error creating tracking report:', error);
      res.status(500).json({ message: 'Failed to create tracking report' });
    }
  });

  // Exporter management routes
  app.get('/api/exporters', async (req, res) => {
    try {
      const exporters = await storage.getExporters();
      res.json(exporters);
    } catch (error) {
      console.error('Error fetching exporters:', error);
      res.status(500).json({ message: 'Failed to fetch exporters' });
    }
  });

  app.get('/api/exporters/:id', async (req, res) => {
    try {
      const exporter = await storage.getExporter(parseInt(req.params.id));
      if (!exporter) {
        return res.status(404).json({ message: 'Exporter not found' });
      }
      res.json(exporter);
    } catch (error) {
      console.error('Error fetching exporter:', error);
      res.status(500).json({ message: 'Failed to fetch exporter' });
    }
  });

  app.post('/api/exporters', async (req, res) => {
    try {
      const validatedData = insertExporterSchema.parse(req.body);
      const exporter = await storage.createExporter(validatedData);
      res.status(201).json(exporter);
    } catch (error) {
      console.error('Error creating exporter:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create exporter' });
    }
  });

  // Export Order management routes
  app.get('/api/export-orders', async (req, res) => {
    try {
      const { exporterId } = req.query;
      let orders;
      
      if (exporterId) {
        orders = await storage.getExportOrdersByExporter(parseInt(exporterId as string));
      } else {
        orders = await storage.getExportOrders();
      }
      
      res.json(orders);
    } catch (error) {
      console.error('Error fetching export orders:', error);
      res.status(500).json({ message: 'Failed to fetch export orders' });
    }
  });

  app.get('/api/export-orders/:id', async (req, res) => {
    try {
      const order = await storage.getExportOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: 'Export order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error('Error fetching export order:', error);
      res.status(500).json({ message: 'Failed to fetch export order' });
    }
  });

  app.post('/api/export-orders', async (req, res) => {
    try {
      const validatedData = insertExportOrderSchema.parse(req.body);
      const order = await storage.createExportOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating export order:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create export order' });
    }
  });

  app.put('/api/export-orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.updateExportOrder(id, req.body);
      if (!order) {
        return res.status(404).json({ message: 'Export order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error('Error updating export order:', error);
      res.status(500).json({ message: 'Failed to update export order' });
    }
  });

  app.patch('/api/export-orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.updateExportOrder(id, req.body);
      if (!order) {
        return res.status(404).json({ message: 'Export order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error('Error updating export order:', error);
      res.status(500).json({ message: 'Failed to update export order' });
    }
  });

  app.delete('/api/export-orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteExportOrder(id);
      if (!success) {
        return res.status(404).json({ message: 'Export order not found' });
      }
      res.json({ message: 'Export order deleted successfully' });
    } catch (error) {
      console.error('Error deleting export order:', error);
      res.status(500).json({ message: 'Failed to delete export order' });
    }
  });

  // Mobile Alert System Routes - Basic Implementation
  app.post('/api/mobile-alert-requests', async (req, res) => {
    try {
      const { requestType, farmerId, agentId, location, description, urgencyLevel } = req.body;
      
      // Create sample mobile alert request
      const mobileRequest = {
        id: Date.now(),
        requestType,
        farmerId,
        agentId,
        location,
        description,
        urgencyLevel: urgencyLevel || 'normal',
        status: 'pending',
        requiresDirectorApproval: urgencyLevel === 'emergency' || urgencyLevel === 'high',
        createdAt: new Date().toISOString()
      };

      // Create corresponding alert
      const alert = {
        id: Date.now() + 1,
        type: 'mobile_request',
        title: `Mobile Request: ${requestType}`,
        message: description,
        priority: urgencyLevel === 'emergency' ? 'critical' : urgencyLevel === 'high' ? 'high' : 'medium',
        source: 'mobile_app',
        submittedBy: agentId,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      res.status(201).json({ mobileRequest, alert });
    } catch (error) {
      console.error('Error creating mobile alert request:', error);
      res.status(500).json({ message: 'Failed to create mobile alert request' });
    }
  });

  app.get('/api/mobile-alert-requests', async (req, res) => {
    try {
      // Return sample mobile alert requests for demonstration
      const sampleRequests = [
        {
          id: 1,
          requestType: 'farmer_registration',
          farmerId: 'FRM-MOBILE-001',
          agentId: 'AGT-2024-001',
          location: 'Lofa County - Voinjama District',
          description: 'New farmer registration from mobile app - Moses Konneh, 5.2 hectares of coffee farm',
          urgencyLevel: 'high',
          status: 'pending',
          requiresDirectorApproval: true,
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          requestType: 'inspection_report',
          farmerId: 'FRM-2024-003',
          agentId: 'AGT-2024-001',
          location: 'Lofa County - Foya Village',
          description: 'Quality inspection completed - Coffee batch shows Grade A quality, ready for export certification',
          urgencyLevel: 'normal',
          status: 'pending',
          requiresDirectorApproval: false,
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: 3,
          requestType: 'urgent_notification',
          farmerId: null,
          agentId: 'AGT-2024-001',
          location: 'Lofa County - Multiple locations',
          description: 'EMERGENCY: Potential deforestation activity detected in protected area via GPS monitoring',
          urgencyLevel: 'emergency',
          status: 'pending',
          requiresDirectorApproval: true,
          createdAt: new Date(Date.now() - 1800000).toISOString()
        }
      ];
      
      res.json(sampleRequests);
    } catch (error) {
      console.error('Error fetching mobile alert requests:', error);
      res.status(500).json({ message: 'Failed to fetch mobile alert requests' });
    }
  });

  app.post('/api/mobile-alert-requests/:id/approve', async (req, res) => {
    try {
      const { id } = req.params;
      const { notes, approvedBy } = req.body;
      
      const updatedRequest = {
        id: parseInt(id),
        status: 'verified',
        verificationNotes: notes,
        verifiedBy: approvedBy,
        directorApproved: true,
        processedAt: new Date().toISOString()
      };

      res.json(updatedRequest);
    } catch (error) {
      console.error('Error approving mobile alert request:', error);
      res.status(500).json({ message: 'Failed to approve request' });
    }
  });

  app.post('/api/mobile-alert-requests/:id/reject', async (req, res) => {
    try {
      const { id } = req.params;
      const { notes, approvedBy } = req.body;
      
      const updatedRequest = {
        id: parseInt(id),
        status: 'rejected',
        verificationNotes: notes,
        verifiedBy: approvedBy,
        rejectionReason: notes,
        processedAt: new Date().toISOString()
      };

      res.json(updatedRequest);
    } catch (error) {
      console.error('Error rejecting mobile alert request:', error);
      res.status(500).json({ message: 'Failed to reject request' });
    }
  });

  app.get('/api/dashboard/director-metrics', async (req, res) => {
    try {
      // Sample director metrics for demonstration
      const metrics = {
        pendingRequests: 3,
        emergencyAlerts: 1,
        verifiedToday: 2,
        mobileSources: 1,
        responseTime: '< 2 hours',
        approvalRate: '94%',
        activeAgents: 12,
        countiesCovered: 15
      };
      
      res.json(metrics);
    } catch (error) {
      console.error('Error fetching director metrics:', error);
      res.status(500).json({ message: 'Failed to fetch director metrics' });
    }
  });

  // Field Agent Request Approval System
  // Inspection Request endpoints
  app.get("/api/inspection-requests", async (req, res) => {
    try {
      const requests = await storage.getInspectionRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inspection requests" });
    }
  });

  app.post("/api/inspection-requests", async (req, res) => {
    try {
      const request = await storage.createInspectionRequest(req.body);
      
      // Create alert for director
      await storage.createAlert({
        type: 'warning',
        title: 'New Inspection Request',
        message: req.body.messageToDirector,
        priority: req.body.priority || 'medium',
        relatedEntity: 'inspection_request',
        relatedEntityId: request.id
      });
      
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to create inspection request" });
    }
  });

  app.post("/api/inspection-requests/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes, approvedBy } = req.body;
      
      const request = await storage.approveInspectionRequest(id, {
        status: 'approved',
        reviewedBy: approvedBy,
        reviewNotes: notes,
        processedAt: new Date()
      });
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve inspection request" });
    }
  });

  app.post("/api/inspection-requests/:id/reject", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes, approvedBy } = req.body;
      
      const request = await storage.rejectInspectionRequest(id, {
        status: 'rejected',
        reviewedBy: approvedBy,
        reviewNotes: notes,
        processedAt: new Date()
      });
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject inspection request" });
    }
  });

  // Farmer Registration Request endpoints
  app.get("/api/farmer-registration-requests", async (req, res) => {
    try {
      const requests = await storage.getFarmerRegistrationRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer registration requests" });
    }
  });

  app.post("/api/farmer-registration-requests", async (req, res) => {
    try {
      const request = await storage.createFarmerRegistrationRequest(req.body);
      
      // Create alert for director
      await storage.createAlert({
        type: 'info',
        title: 'New Farmer Registration Request',
        message: req.body.messageToDirector,
        priority: req.body.priority || 'low',
        relatedEntity: 'farmer_registration_request',
        relatedEntityId: request.id
      });
      
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to create farmer registration request" });
    }
  });

  app.post("/api/farmer-registration-requests/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes, approvedBy } = req.body;
      
      const request = await storage.approveFarmerRegistrationRequest(id, {
        status: 'approved',
        reviewedBy: approvedBy,
        reviewNotes: notes,
        processedAt: new Date()
      });
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve farmer registration request" });
    }
  });

  app.post("/api/farmer-registration-requests/:id/reject", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes, approvedBy } = req.body;
      
      const request = await storage.rejectFarmerRegistrationRequest(id, {
        status: 'rejected',
        reviewedBy: approvedBy,
        reviewNotes: notes,
        processedAt: new Date()
      });
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject farmer registration request" });
    }
  });


  // =============================================
  // INTERNAL MESSAGING SYSTEM ROUTES
  // =============================================

  // Get messages for a user
  app.get("/api/messages/:recipientId", async (req, res) => {
    try {
      const { recipientId } = req.params;
      const messages = await storage.getMessages(recipientId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Get specific message
  app.get("/api/messages/single/:messageId", async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await storage.getMessage(messageId);
      
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json(message);
    } catch (error) {
      console.error("Error fetching message:", error);
      res.status(500).json({ message: "Failed to fetch message" });
    }
  });

  // Send new message
  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = {
        ...req.body,
        messageId: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        threadId: req.body.threadId || `THR-${Date.now()}`
      };

      const message = await storage.sendMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Reply to message
  app.post("/api/messages/:parentMessageId/reply", async (req, res) => {
    try {
      const { parentMessageId } = req.params;
      const replyData = {
        ...req.body,
        messageId: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      const reply = await storage.replyToMessage(parentMessageId, replyData);
      res.status(201).json(reply);
    } catch (error) {
      console.error("Error sending reply:", error);
      res.status(500).json({ message: "Failed to send reply" });
    }
  });

  // Mark message as read
  app.patch("/api/messages/:messageId/read", async (req, res) => {
    try {
      const { messageId } = req.params;
      const { recipientId } = req.body;
      
      await storage.markMessageAsRead(messageId, recipientId);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  // Get unread messages count
  app.get("/api/messages/:recipientId/unread-count", async (req, res) => {
    try {
      const { recipientId } = req.params;
      const count = await storage.getUnreadMessagesCount(recipientId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  // Delete message
  app.delete("/api/messages/:messageId", async (req, res) => {
    try {
      const { messageId } = req.params;
      const deleted = await storage.deleteMessage(messageId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Message not found" });
      }
      
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Get message templates
  app.get("/api/message-templates", async (req, res) => {
    try {
      const templates = await storage.getMessageTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching message templates:", error);
      res.status(500).json({ message: "Failed to fetch message templates" });
    }
  });

  // Create message template
  app.post("/api/message-templates", async (req, res) => {
    try {
      const templateData = {
        ...req.body,
        templateId: `TPL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };

      const template = await storage.createMessageTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating message template:", error);
      res.status(500).json({ message: "Failed to create message template" });
    }
  });

  // =============================================
  // EXPORT PERMIT SUBMISSION SYSTEM
  // =============================================

  // Export Permit Submission endpoint
  app.post("/api/export-permits", async (req, res) => {
    try {
      const permitData = req.body;
      
      // Generate permit application ID
      const permitId = `EXP-PERMIT-${Date.now()}`;
      
      // Mock permit submission process
      const submissionResult = {
        success: true,
        permitId,
        status: 'pending_review',
        submissionDate: new Date().toISOString(),
        estimatedProcessingTime: '5-7 business days',
        nextSteps: [
          'Document verification by LACRA Quality Assurance',
          'Physical inspection scheduling (if required)',
          'Certificate validation',
          'Final approval by Director of Exports'
        ],
        tracking: {
          lacraOfficer: 'Marcus Johnson',
          reviewDepartment: 'Export Licensing Division',
          contactEmail: 'exports@lacra.gov.lr',
          contactPhone: '+231-555-0123'
        },
        requiredDocuments: permitData.certificates || [],
        applicationData: {
          ...permitData,
          permitId,
          submissionTimestamp: new Date().toISOString()
        }
      };
      
      // Log submission for audit trail
      console.log(`Export permit submitted: ${permitId} by ${permitData.exporterName}`);
      
      res.json(submissionResult);
    } catch (error) {
      console.error("Error submitting export permit:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to submit export permit application",
        error: error.message 
      });
    }
  });

  // Get export permit status
  app.get("/api/export-permits/:permitId", async (req, res) => {
    try {
      const { permitId } = req.params;
      
      // Mock permit status data
      const permitStatus = {
        permitId,
        status: 'under_review',
        currentStage: 'document_verification',
        progress: 45,
        assignedOfficer: 'Marcus Johnson',
        lastUpdate: new Date().toISOString(),
        estimatedCompletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            stage: 'submitted',
            status: 'completed',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Application received and registered'
          },
          {
            stage: 'initial_review',
            status: 'completed', 
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Preliminary documents reviewed'
          },
          {
            stage: 'document_verification',
            status: 'in_progress',
            timestamp: new Date().toISOString(),
            notes: 'Verifying certificates and compliance documents'
          }
        ],
        documents: {
          verified: ['phytosanitary', 'quality_control'],
          pending: ['certificate_origin', 'eudr_certificate'],
          rejected: []
        }
      };
      
      res.json(permitStatus);
    } catch (error) {
      console.error("Error fetching permit status:", error);
      res.status(500).json({ message: "Failed to fetch permit status" });
    }
  });

  // List export permits for exporter
  app.get("/api/export-permits", async (req, res) => {
    try {
      const { exporterId, status } = req.query;
      
      // Mock permit list data
      const permits = [
        {
          permitId: 'EXP-PERMIT-1704067200001',
          exporterName: 'Liberia Agri Export Ltd.',
          commodity: 'Cocoa',
          quantity: '50 tonnes',
          destination: 'Netherlands',
          status: 'approved',
          submissionDate: '2025-01-20T10:30:00Z',
          approvalDate: '2025-01-23T14:45:00Z',
          expiryDate: '2025-07-20T10:30:00Z'
        },
        {
          permitId: 'EXP-PERMIT-1704153600002',
          exporterName: 'Liberia Agri Export Ltd.',
          commodity: 'Coffee',
          quantity: '25 tonnes',
          destination: 'Germany',
          status: 'under_review',
          submissionDate: '2025-01-22T08:15:00Z',
          estimatedCompletion: '2025-01-29T17:00:00Z'
        },
        {
          permitId: 'EXP-PERMIT-1704240000003',
          exporterName: 'Liberia Agri Export Ltd.',
          commodity: 'Rubber',
          quantity: '100 tonnes',
          destination: 'United States',
          status: 'pending_documents',
          submissionDate: '2025-01-24T12:00:00Z',
          notes: 'Additional EUDR documentation required'
        }
      ];
      
      let filteredPermits = permits;
      
      if (exporterId) {
        filteredPermits = filteredPermits.filter(permit => 
          permit.exporterName.toLowerCase().includes(exporterId.toLowerCase())
        );
      }
      
      if (status) {
        filteredPermits = filteredPermits.filter(permit => permit.status === status);
      }
      
      res.json(filteredPermits);
    } catch (error) {
      console.error("Error fetching export permits:", error);
      res.status(500).json({ message: "Failed to fetch export permits" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
