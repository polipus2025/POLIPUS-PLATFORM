import { db } from "./db";
import { softCommodities } from "../shared/schema";

export async function seedSoftCommodities() {
  try {
    console.log("🌾 Seeding LACRA Soft Commodity Pricing System...");

    const sampleCommodities = [
      // Cocoa - Quality Grades
      {
        commodityType: "Cocoa",
        grade: "Premium",
        pricePerTon: "3850.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Premium grade cocoa beans with superior quality standards"
      },
      {
        commodityType: "Cocoa",
        grade: "Grade 1",
        pricePerTon: "3650.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 1 cocoa beans meeting international standards"
      },
      {
        commodityType: "Cocoa",
        grade: "Grade 2",
        pricePerTon: "3400.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 2 cocoa beans with minor quality variations"
      },
      {
        commodityType: "Cocoa",
        grade: "Subgrade",
        pricePerTon: "3150.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Subgrade cocoa beans for domestic processing"
      },
      
      // Coffee - Quality Grades
      {
        commodityType: "Coffee",
        grade: "Premium",
        pricePerTon: "4200.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Premium Arabica coffee with exceptional quality"
      },
      {
        commodityType: "Coffee",
        grade: "Grade 1",
        pricePerTon: "3900.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 1 coffee beans meeting export standards"
      },
      {
        commodityType: "Coffee",
        grade: "Grade 2",
        pricePerTon: "3600.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 2 coffee suitable for commercial markets"
      },
      
      // Palm Oil - Quality Grades
      {
        commodityType: "Palm Oil",
        grade: "Premium",
        pricePerTon: "1450.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Premium refined palm oil with low FFA content"
      },
      {
        commodityType: "Palm Oil",
        grade: "Grade 1",
        pricePerTon: "1350.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 1 palm oil for food industry applications"
      },
      {
        commodityType: "Palm Oil",
        grade: "Grade 2",
        pricePerTon: "1250.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 2 palm oil for industrial applications"
      },
      
      // Rubber - Quality Grades
      {
        commodityType: "Rubber",
        grade: "Premium",
        pricePerTon: "2150.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Premium natural rubber with superior elasticity"
      },
      {
        commodityType: "Rubber",
        grade: "Grade 1",
        pricePerTon: "1950.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 1 natural rubber for tire manufacturing"
      },
      
      // Cashew - Quality Grades
      {
        commodityType: "Cashew",
        grade: "Premium",
        pricePerTon: "5200.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Premium raw cashew nuts with large kernel size"
      },
      {
        commodityType: "Cashew",
        grade: "Grade 1",
        pricePerTon: "4800.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 1 cashew nuts meeting export specifications"
      },
      
      // Rice - Quality Grades
      {
        commodityType: "Rice",
        grade: "Premium",
        pricePerTon: "850.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Premium long-grain rice with low moisture content"
      },
      {
        commodityType: "Rice",
        grade: "Grade 1",
        pricePerTon: "750.00",
        currency: "USD",
        effectiveDate: new Date("2025-01-20"),
        updatedBy: "DDGOTS",
        isActive: true,
        notes: "Grade 1 rice suitable for domestic consumption"
      }
    ];

    // Insert all sample commodities
    await db.insert(softCommodities).values(sampleCommodities);

    console.log("✅ LACRA Soft Commodity Pricing System seeded successfully!");
    console.log(`📊 Added ${sampleCommodities.length} commodity price entries across 6 different commodities`);
    console.log("🔧 System configured with quality grades: Premium > Grade 1 > Grade 2 > Subgrade");
    console.log("👤 DDGOTS has exclusive update permissions, all other users have view-only access");

  } catch (error) {
    console.error("❌ Error seeding soft commodities:", error);
  }
}

// Auto-run seeding if this file is executed directly
seedSoftCommodities();