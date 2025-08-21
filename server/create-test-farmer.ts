import { storage } from "./storage";
import bcrypt from "bcryptjs";

// Create a stable test farmer with proper credentials
export async function createTestFarmer() {
  try {
    console.log("🌱 Creating stable test farmer...");
    
    // Generate farmer ID
    const farmerId = "FRM-434923";
    
    // Create farmer record
    const farmer = await storage.createFarmer({
      farmerId,
      firstName: "John",
      lastName: "Konneh",
      phoneNumber: "+231777123456",
      email: "john.konneh@agritrace.lr",
      dateOfBirth: new Date("1985-03-15"),
      gender: "male",
      address: "Kakata District, Margibi County",
      county: "Margibi",
      district: "Kakata", 
      city: "Kakata",
      farmSize: 2.5,
      primaryCrops: ["cocoa", "coffee"],
      farmingExperience: 15,
      educationLevel: "primary",
      maritalStatus: "married",
      numberOfChildren: 3,
      dependents: 5,
      irrigationAccess: false,
      onboardedBy: "Land Inspector",
      farmBoundaries: {
        coordinates: [[6.515, -9.772], [6.516, -9.772], [6.516, -9.773], [6.515, -9.773]]
      },
      landMapData: {
        coordinates: [[6.515, -9.772], [6.516, -9.772], [6.516, -9.773], [6.515, -9.773]]
      }
    });

    console.log("✅ Farmer created:", farmer.farmerId);

    // Create stable credentials
    const credentialId = "john.konneh";
    const password = "farmer123";
    const passwordHash = await bcrypt.hash(password, 10);

    const credentials = await storage.createFarmerCredentials({
      farmerId: farmer.id,
      credentialId,
      username: credentialId,
      passwordHash,
      temporaryPassword: password,
      generatedBy: "System Setup",
      mustChangePassword: false,
      isActive: true
    });

    console.log("✅ Farmer credentials created:");
    console.log("   Username:", credentialId);
    console.log("   Password:", password);
    console.log("   Farmer ID:", farmer.farmerId);

    return {
      farmer,
      credentials: {
        username: credentialId,
        password: password,
        farmerId: farmer.farmerId
      }
    };

  } catch (error) {
    console.error("❌ Error creating test farmer:", error);
    throw error;
  }
}