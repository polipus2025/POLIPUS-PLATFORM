import bcrypt from "bcryptjs";
import { storage } from "./storage";

// Test farmer credential generation
function generateFarmerCredentialId(): string {
  const prefix = "FRM";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}${timestamp}${random}`;
}

export async function createTestFarmerWithMapping() {
  try {
    console.log("🌱 Creating test farmer account with land mapping...");

    // Create test farmer
    const testFarmerData = {
      farmerId: `FARMER-TEST-${Date.now()}`,
      firstName: "John",
      lastName: "Konneh",
      email: "john.konneh@email.com",
      phoneNumber: "+231777123456",
      county: "Nimba",
      district: "Saclepea",
      village: "Karnplay",
      community: "New Karnplay",
      gpsCoordinates: "7.7491, -8.6716",
      farmSize: 5.2,
      farmSizeUnit: "hectares",
      primaryCrop: "Cocoa",
      secondaryCrops: "Coffee, Plantain",
      farmingExperience: 15,
      certifications: "Organic Certification Pending",
      cooperativeMembership: "Nimba Farmers Cooperative",
      landOwnership: "Family Land",
      irrigationAccess: false,
      spouseName: "Mary Konneh",
      numberOfChildren: 3,
      dependents: 5,
      emergencyContact: "Samuel Konneh",
      emergencyPhone: "+231888654321",
      familyMembers: "Mary Konneh (spouse, 32), James Konneh (son, 12), Grace Konneh (daughter, 9), Ruth Konneh (daughter, 6)",
      status: "active",
      agreementSigned: true,
      agreementDate: new Date(),
      // Test land mapping data with realistic GPS boundaries
      farmBoundaries: [
        { latitude: 7.7491, longitude: -8.6716, altitude: 245 },
        { latitude: 7.7485, longitude: -8.6710, altitude: 248 },
        { latitude: 7.7480, longitude: -8.6720, altitude: 250 },
        { latitude: 7.7475, longitude: -8.6730, altitude: 252 },
        { latitude: 7.7470, longitude: -8.6725, altitude: 249 },
        { latitude: 7.7475, longitude: -8.6715, altitude: 247 },
        { latitude: 7.7485, longitude: -8.6718, altitude: 246 }
      ],
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
    };

    const farmer = await storage.createFarmer(testFarmerData);

    // Generate login credentials
    const credentialId = "FRM434923"; // Fixed test credential for easy access
    const temporaryPassword = "Test2025!";
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    const credentials = await storage.createFarmerCredentials({
      farmerId: farmer.id,
      credentialId,
      username: credentialId,
      passwordHash,
      temporaryPassword,
      generatedBy: "System Test Setup",
      mustChangePassword: false, // For demo purposes
      isActive: true
    });

    // Create land mapping record
    const landMapping = await storage.createFarmerLandMapping({
      mappingId: `MAP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      farmerId: farmer.id,
      landMappingName: "Main Cocoa Farm",
      totalArea: 5.2,
      areaUnit: "hectares",
      gpsCoordinates: testFarmerData.farmBoundaries,
      centerLatitude: 7.7481,
      centerLongitude: -8.6720,
      landType: "agricultural",
      soilType: "clay-loam",
      soilQuality: "good",
      waterSource: "seasonal_stream",
      accessibility: "accessible",
      elevationRange: "medium",
      slopeGradient: "gentle",
      vegetationCover: "moderate",
      currentUse: "active_farming",
      landTenure: "family_land",
      registrationStatus: "registered",
      acquisitionDate: new Date("2010-01-15"),
      lastSurveyDate: new Date(),
      surveyedBy: "Land Inspector Demo",
      mappingAccuracy: "high",
      notes: "Primary cocoa farming area with good drainage and fertile soil",
      isActive: true,
      createdBy: "Land Inspector Demo",
      approvedBy: "Land Inspector Demo",
      approvedAt: new Date()
    });

    // Create harvest schedules
    const harvestSchedule1 = await storage.createHarvestSchedule({
      scheduleId: `SCH-${Date.now()}-001`,
      landMappingId: landMapping.id,
      farmerId: farmer.id,
      scheduleName: "Cocoa Main Season 2025",
      cropType: "Cocoa",
      cropVariety: "Amelonado",
      plantingArea: 3.5,
      plantingStartDate: new Date("2024-05-15"),
      plantingEndDate: new Date("2024-06-30"),
      expectedHarvestStartDate: new Date("2025-10-01"),
      expectedHarvestEndDate: new Date("2025-12-15"),
      expectedYield: 1500,
      yieldUnit: "kg",
      plantingMethod: "direct_seeding",
      expectedPrice: 2.50,
      priceUnit: "per_kg",
      season: "rainy_season",
      cropYear: 2025,
      status: "ready_for_harvest",
      marketingPlan: "Local buyers and cooperatives",
      createdBy: "John Konneh",
      isActive: true
    });

    // Create second harvest schedule  
    const harvestSchedule2 = await storage.createHarvestSchedule({
      scheduleId: `SCH-${Date.now()}-002`,
      landMappingId: landMapping.id,
      farmerId: farmer.id,
      scheduleName: "Coffee Secondary Crop 2025",
      cropType: "Coffee",
      cropVariety: "Robusta",
      plantingArea: 1.7,
      plantingStartDate: new Date("2024-03-01"),
      plantingEndDate: new Date("2024-04-15"),
      expectedHarvestStartDate: new Date("2025-11-15"),
      expectedHarvestEndDate: new Date("2026-01-30"),
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
    });

    // Create marketplace listing for ready cocoa
    const marketplaceListing = await storage.createMarketplaceListing({
      listingId: `LST-${Date.now()}-001`,
      farmerId: farmer.id,
      scheduleId: harvestSchedule1.id,
      cropType: "Cocoa",
      cropVariety: "Amelonado",
      quantityAvailable: 1200,
      unit: "kg",
      qualityGrade: "Grade 1",
      pricePerUnit: 2.50,
      totalValue: 3000,
      harvestDate: new Date("2025-10-15"),
      availabilityStartDate: new Date(),
      availabilityEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      location: "Nimba County, Saclepea District, Karnplay Village",
      gpsCoordinates: "7.7481, -8.6720",
      storageConditions: "Dry warehouse storage",
      paymentTerms: "Cash on delivery or mobile money",
      minimumOrderQuantity: 50,
      maximumOrderQuantity: 1200,
      description: "High-quality Grade 1 cocoa beans from organic farming practices. Well-dried and properly fermented.",
      negotiable: true,
      contactPreference: "phone",
      status: "active",
      urgencyLevel: "normal",
      keywords: "cocoa, organic, grade1, nimba, ready",
      viewCount: 0,
      inquiryCount: 0
    });

    // Create harvest alerts
    await storage.createHarvestAlert({
      alertId: `ALT-${Date.now()}-001`,
      scheduleId: harvestSchedule1.id,
      farmerId: farmer.id,
      alertType: "harvest_ready",
      title: "Cocoa Ready for Harvest",
      message: "Your main season cocoa crop is ready for harvest. Consider listing in marketplace.",
      priority: "high",
      targetAudience: "farmer",
      sentToMarketplace: false
    });

    await storage.createHarvestAlert({
      alertId: `ALT-${Date.now()}-002`,
      scheduleId: harvestSchedule1.id,
      farmerId: farmer.id,
      alertType: "harvest_available",
      title: "Fresh Cocoa Available",
      message: "John Konneh has 1200kg of Grade 1 cocoa available in Nimba County",
      priority: "medium",
      targetAudience: "buyers",
      sentToMarketplace: true,
      marketplaceListingId: marketplaceListing.listingId,
      geofenceRadius: 50,
      targetCounties: ["Nimba", "Grand Bassa", "Bong"]
    });

    console.log("✅ Test farmer account created successfully!");
    console.log("\n🔑 FARMER LOGIN CREDENTIALS:");
    console.log("===============================");
    console.log(`Login ID: ${credentialId}`);
    console.log(`Password: ${temporaryPassword}`);
    console.log("===============================\n");
    
    console.log("📋 FARMER DETAILS:");
    console.log(`Name: ${farmer.firstName} ${farmer.lastName}`);
    console.log(`Location: ${farmer.county}, ${farmer.district}, ${farmer.village}`);
    console.log(`Farm Size: ${farmer.farmSize} hectares`);
    console.log(`Primary Crop: ${farmer.primaryCrop}`);
    console.log(`Land Mappings: 1 (Main Cocoa Farm)`);
    console.log(`Harvest Schedules: 2 (Cocoa ready, Coffee growing)`);
    console.log(`Marketplace Listings: 1 (1200kg Cocoa available)`);
    console.log(`Alerts: 2 (1 for farmer, 1 for buyers)\n`);

    return {
      farmer,
      credentials: { credentialId, temporaryPassword },
      landMapping,
      harvestSchedules: [harvestSchedule1, harvestSchedule2],
      marketplaceListing,
      success: true
    };

  } catch (error) {
    console.error("❌ Error creating test farmer:", error);
    throw error;
  }
}