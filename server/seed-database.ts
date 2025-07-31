import { storage } from "./storage";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingUsers = await storage.getUserByUsername("admin001");
    if (existingUsers) {
      return;
    }
    
    // Create sample auth users (only runs on first setup)
    await storage.createAuthUser({
      username: "admin001",
      passwordHash: "$2b$10$ZBncNldlxxzyP0yIQ1SWr.FsDP1ie11vnwbCKQL4QEtK5lkdhnSB6",
      role: "regulatory_admin",
      firstName: "Admin",
      lastName: "User",
      email: "admin@lacra.gov.lr",
      isActive: true
    });

    await storage.createAuthUser({
      username: "AGT-2024-001",
      passwordHash: "$2b$10$E7X5pxmRqrL9HUj6xfZq1uVARFgN8hIm2ahWDqi5kEE1PjRDjn5V6",
      role: "field_agent",
      firstName: "Sarah",
      lastName: "Konneh",
      email: "sarah.konneh@lacra.gov.lr",
      jurisdiction: "Lofa County",
      isActive: true
    });

    await storage.createAuthUser({
      username: "FRM-2024-001",
      passwordHash: "$2b$10$ZBncNldlxxzyP0yIQ1SWr.FsDP1ie11vnwbCKQL4QEtK5lkdhnSB6",
      role: "farmer",
      firstName: "Moses",
      lastName: "Tuah",
      email: "moses.tuah@farmer.lr",
      jurisdiction: "Lofa County",
      isActive: true
    });

    await storage.createAuthUser({
      username: "EXP-2024-001",
      passwordHash: "$2b$12$E1wQNWg/B1lkKxljONG7AutdwOKKPEegD8AvhL8pV3FzYsnH1IYwq",
      role: "exporter",
      firstName: "Marcus",
      lastName: "Bawah",
      email: "marcus.bawah@liberiaagrieport.com",
      isActive: true
    });

    // Create sample farmers
    await storage.createFarmer({
      farmerId: "FRM-2024-001",
      firstName: "John",
      lastName: "Kollie",
      phoneNumber: "+231 77 123 4567",
      idNumber: "LIB123456789",
      county: "Lofa County",
      district: "Voinjama",
      village: "Zorzor Town",
      gpsCoordinates: "8.4219,-9.8456",
      farmSize: "5.2",
      farmSizeUnit: "hectares",
      status: "active",
      agreementSigned: true,
      agreementDate: new Date("2024-01-15")
    });

    // Create sample commodities
    await storage.createCommodity({
      batchNumber: "COF-2024-001",
      name: "Arabica Coffee",
      type: "coffee",
      variety: "Typica",
      county: "Lofa County",
      district: "Voinjama",
      farmerId: "FRM-2024-001",
      quantity: 1250.5,
      unit: "kg",
      harvestDate: new Date("2024-01-15"),
      qualityGrade: "Premium",
      moistureContent: 12.5,
      status: "compliant",
      gpsCoordinates: "8.4219,-9.8456",
      storageLocation: "Cooperative Warehouse A",
      certificationStatus: "certified",
      exportEligible: true
    });

    await storage.createCommodity({
      batchNumber: "COC-2024-001", 
      name: "Cocoa",
      type: "cocoa",
      variety: "Trinitario",
      county: "Grand Bassa County",
      district: "Buchanan",
      farmerId: "FRM-2024-002",
      quantity: 850.0,
      unit: "kg",
      harvestDate: new Date("2024-02-10"),
      qualityGrade: "Grade 1",
      moistureContent: 7.2,
      status: "review_required",
      gpsCoordinates: "6.0433,-9.4347",
      storageLocation: "Central Processing Facility",
      certificationStatus: "pending",
      exportEligible: false
    });

    // Create sample inspections
    await storage.createInspection({
      commodityId: 1,
      inspectorId: "AGT-2024-001",
      inspectorName: "Sarah Konneh",
      inspectionDate: new Date("2024-01-16"),
      qualityGrade: "Premium",
      complianceStatus: "compliant",
      recommendations: "Approved for export certification"
    });

    // Create sample certifications
    await storage.createCertification({
      certificateNumber: "EXP-CERT-2024-001",
      commodityId: 1,
      certificateType: "export_quality",
      issuedBy: "LACRA Quality Control Division",
      issuedDate: new Date("2024-01-17"),
      expiryDate: new Date("2024-07-17"),
      status: "valid"
    });

    // Create sample alerts
    await storage.createAlert({
      type: "error",
      title: "High Priority: Batch Quality Issue",
      message: "Batch COC-2024-001 requires immediate quality review due to moisture content exceeding standards.",
      priority: "high",
      isRead: false,
      relatedEntity: "commodity",
      entityId: "2"
    });

    // Create sample tracking records
    await storage.createTrackingRecord({
      trackingNumber: "TRK-2025-07-24-001",
      currentLocation: "Port of Monrovia",
      status: "in_transit",
      vehicleId: "VEH-001",
      driverName: "Samuel Johnson",
      gpsCoordinates: "6.3133,-10.8077",
      temperature: 24.5,
      humidity: 65.2,
      estimatedArrival: new Date("2024-01-20T14:30:00Z"),
      lastUpdated: new Date(),
      qrCodeScanned: true
    });

    // Insert sample messages for the internal messaging system
    await storage.sendMessage({
      messageId: "MSG-1737723200-001",
      subject: "Urgent: Coffee Quality Standards Update",
      content: "Dear farmers, please note that new quality standards for coffee exports have been implemented effective immediately. All coffee batches must now meet the enhanced grading criteria. Field agents will conduct training sessions next week. Please contact your local field agent for more information.",
      priority: "urgent",
      messageType: "announcement",
      senderId: "admin001",
      senderName: "LACRA Administration",
      senderType: "regulatory_admin",
      senderPortal: "regulatory_portal",
      recipientId: "all_users",
      recipientName: "All Users",
      recipientType: "all_users",
      recipientPortal: "all_portals",
      threadId: "THR-1737723200-001"
    });

    await storage.sendMessage({
      messageId: "MSG-1737723200-002",
      subject: "Harvest Season Inspection Schedule",
      content: "Field agents: The harvest season inspection schedule has been updated. Please check your assigned territories and ensure all inspections are completed by month end. Report any compliance issues immediately through the platform.",
      priority: "high",
      messageType: "alert",
      senderId: "admin001",
      senderName: "LACRA Administration",
      senderType: "regulatory_admin",
      senderPortal: "regulatory_portal",
      recipientType: "field_agent",
      recipientPortal: "field_agent_portal",
      threadId: "THR-1737723200-002"
    });

    await storage.sendMessage({
      messageId: "MSG-1737723200-003",
      subject: "Cocoa Price Update - Export Opportunity",
      content: "Exporters: Global cocoa prices have increased by 15% this month. This presents an excellent export opportunity. Ensure your compliance documentation is up to date and contact LACRA for expedited processing of export applications.",
      priority: "normal",
      messageType: "general",
      senderId: "admin001",
      senderName: "LACRA Administration",
      senderType: "regulatory_admin",
      senderPortal: "regulatory_portal",
      recipientType: "exporter",
      recipientPortal: "exporter_portal",
      threadId: "THR-1737723200-003"
    });

    await storage.sendMessage({
      messageId: "MSG-1737723200-004",
      subject: "GPS Farm Mapping Training Available",
      content: "New GPS farm mapping training sessions are now available for all farmers. This will help you comply with EUDR requirements and improve your farm management. Contact your local field agent to register for the next session in your area.",
      priority: "normal",
      messageType: "general",
      senderId: "AGT-2024-001",
      senderName: "Sarah Konneh",
      senderType: "field_agent",
      senderPortal: "field_agent_portal",
      recipientType: "farmer",
      recipientPortal: "farmer_portal",
      threadId: "THR-1737723200-004"
    });

    await storage.sendMessage({
      messageId: "MSG-1737723200-005",
      subject: "Support Request: System Access Issue",
      content: "Hello LACRA support team, I'm experiencing difficulties accessing the export application system. The page keeps timing out when I try to submit my application. Could you please assist? My company ID is EXP-2024-001.",
      priority: "normal",
      messageType: "support",
      senderId: "EXP-2024-001",
      senderName: "Marcus Bawah",
      senderType: "exporter",
      senderPortal: "exporter_portal",
      recipientType: "regulatory_admin",
      recipientPortal: "regulatory_portal",
      threadId: "THR-1737723200-005"
    });

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}