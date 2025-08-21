// Enhanced Product Configuration Data for QR Batch System
export const productConfigurationData = {
  cocoa: {
    category: "cocoa",
    products: [
      {
        subCategory: "premium_cocoa",
        productName: "Premium Trinitario Cocoa Beans",
        description: "High-quality trinitario cocoa beans from Nimba County",
        packagingOptions: [
          {
            type: "jute_bags",
            name: "Jute Bags",
            standardWeights: [50, 60, 80],
            description: "Traditional jute sacks for cocoa storage"
          },
          {
            type: "polypropylene_bags", 
            name: "Polypropylene Bags",
            standardWeights: [50, 60, 100],
            description: "Moisture-resistant polypropylene sacks"
          },
          {
            type: "wooden_pallets",
            name: "Wooden Pallets", 
            standardWeights: [500, 1000, 1500],
            description: "Wooden pallets with multiple bag layers"
          },
          {
            type: "export_containers",
            name: "Export Containers",
            standardWeights: [18000, 20000, 22000],
            description: "20ft containers for international shipping"
          }
        ],
        qualityGrades: ["Grade I", "Grade II", "Fine Flavor", "Bulk"],
        certificationRequirements: ["LACRA-CERT", "EUDR-COMPLIANT", "Fair-Trade", "Organic"],
        storageRequirements: {
          temperature: "18-20°C",
          humidity: "60-65%",
          ventilation: "Active",
          pestControl: "Required"
        },
        shelfLife: 365,
        hsCode: "1801.00"
      },
      {
        subCategory: "standard_cocoa",
        productName: "Standard Forastero Cocoa Beans",
        description: "Standard grade forastero cocoa beans for bulk export",
        packagingOptions: [
          {
            type: "jute_bags",
            name: "Jute Bags",
            standardWeights: [60, 80],
            description: "Standard jute sacks"
          },
          {
            type: "polypropylene_bags",
            name: "Polypropylene Bags", 
            standardWeights: [60, 80, 100],
            description: "Bulk storage bags"
          }
        ],
        qualityGrades: ["Grade II", "Bulk", "Standard"],
        certificationRequirements: ["LACRA-CERT", "EUDR-COMPLIANT"],
        storageRequirements: {
          temperature: "18-22°C",
          humidity: "65-70%",
          ventilation: "Natural",
          pestControl: "Applied"
        },
        shelfLife: 300,
        hsCode: "1801.00"
      }
    ]
  },
  
  coffee: {
    category: "coffee",
    products: [
      {
        subCategory: "arabica_coffee",
        productName: "Liberian Arabica Coffee Beans",
        description: "High-altitude arabica coffee from Lofa County",
        packagingOptions: [
          {
            type: "sisal_bags",
            name: "Sisal Bags",
            standardWeights: [60, 69],
            description: "Traditional sisal coffee bags"
          },
          {
            type: "jute_bags",
            name: "Jute Bags",
            standardWeights: [60, 69, 70],
            description: "Premium jute coffee sacks"
          },
          {
            type: "grainpro_bags",
            name: "GrainPro Bags",
            standardWeights: [60, 69],
            description: "Hermetic storage bags for quality preservation"
          },
          {
            type: "wooden_pallets",
            name: "Wooden Pallets",
            standardWeights: [840, 1260, 1400],
            description: "Palletized coffee for warehouse storage"
          }
        ],
        qualityGrades: ["Specialty", "Premium", "Commercial", "Standard"],
        certificationRequirements: ["LACRA-CERT", "EUDR-COMPLIANT", "Rainforest Alliance", "UTZ"],
        storageRequirements: {
          temperature: "15-20°C",
          humidity: "55-65%",
          ventilation: "Active",
          pestControl: "Organic methods"
        },
        shelfLife: 180,
        hsCode: "0901.11"
      },
      {
        subCategory: "robusta_coffee",
        productName: "Robusta Coffee Beans",
        description: "Strong robusta coffee beans from Bong County",
        packagingOptions: [
          {
            type: "jute_bags",
            name: "Jute Bags",
            standardWeights: [60, 70, 80],
            description: "Standard jute coffee bags"
          },
          {
            type: "polypropylene_bags",
            name: "Polypropylene Bags",
            standardWeights: [50, 60, 70],
            description: "Weather-resistant storage"
          }
        ],
        qualityGrades: ["Grade 1", "Grade 2", "Screen 18", "Screen 16"],
        certificationRequirements: ["LACRA-CERT", "EUDR-COMPLIANT"],
        storageRequirements: {
          temperature: "18-22°C",
          humidity: "60-65%",
          ventilation: "Natural",
          pestControl: "Applied"
        },
        shelfLife: 150,
        hsCode: "0901.21"
      }
    ]
  },

  palm_oil: {
    category: "palm_oil",
    products: [
      {
        subCategory: "crude_palm_oil",
        productName: "Crude Palm Oil (CPO)",
        description: "Fresh crude palm oil from processing mills",
        packagingOptions: [
          {
            type: "plastic_drums",
            name: "Plastic Drums",
            standardWeights: [200, 220, 250],
            description: "Food-grade plastic drums"
          },
          {
            type: "steel_drums",
            name: "Steel Drums",
            standardWeights: [200, 220],
            description: "Industrial steel drums"
          },
          {
            type: "flexi_tanks",
            name: "Flexi Tanks",
            standardWeights: [20000, 22000, 24000],
            description: "Flexible tank containers for bulk transport"
          },
          {
            type: "iso_tanks",
            name: "ISO Tank Containers",
            standardWeights: [18000, 20000, 22000],
            description: "Heated ISO tank containers"
          }
        ],
        qualityGrades: ["Grade A", "Grade B", "Technical Grade"],
        certificationRequirements: ["LACRA-CERT", "EUDR-COMPLIANT", "RSPO", "HACCP"],
        storageRequirements: {
          temperature: "45-50°C",
          humidity: "Controlled",
          ventilation: "Heated storage",
          pestControl: "Clean environment"
        },
        shelfLife: 90,
        hsCode: "1511.10"
      }
    ]
  },

  rubber: {
    category: "rubber",
    products: [
      {
        subCategory: "natural_latex",
        productName: "Natural Rubber Latex",
        description: "High-quality natural rubber latex",
        packagingOptions: [
          {
            type: "latex_drums",
            name: "Latex Drums",
            standardWeights: [200, 250],
            description: "Specialized latex storage drums"
          },
          {
            type: "rubber_bales",
            name: "Rubber Bales",
            standardWeights: [33.33, 35],
            description: "Compressed rubber bales"
          },
          {
            type: "wooden_crates",
            name: "Wooden Crates", 
            standardWeights: [500, 700, 1000],
            description: "Export wooden crates"
          }
        ],
        qualityGrades: ["RSS1", "RSS2", "RSS3", "SMR20"],
        certificationRequirements: ["LACRA-CERT", "EUDR-COMPLIANT", "FSC"],
        storageRequirements: {
          temperature: "25-30°C",
          humidity: "60-70%",
          ventilation: "Active",
          pestControl: "Fumigation"
        },
        shelfLife: 120,
        hsCode: "4001.10"
      }
    ]
  },

  rice: {
    category: "rice",
    products: [
      {
        subCategory: "parboiled_rice",
        productName: "Parboiled Rice",
        description: "Quality parboiled rice from Bong County",
        packagingOptions: [
          {
            type: "polypropylene_bags",
            name: "PP Bags",
            standardWeights: [25, 50, 100],
            description: "Woven polypropylene bags"
          },
          {
            type: "jute_bags",
            name: "Jute Bags",
            standardWeights: [50, 100],
            description: "Natural jute sacks"
          },
          {
            type: "bulk_containers",
            name: "Bulk Containers",
            standardWeights: [1000, 1500, 2000],
            description: "Large bulk storage containers"
          }
        ],
        qualityGrades: ["Premium", "Grade A", "Grade B", "Standard"],
        certificationRequirements: ["LACRA-CERT", "HACCP", "ISO 22000"],
        storageRequirements: {
          temperature: "20-25°C",
          humidity: "55-60%",
          ventilation: "Active",
          pestControl: "Integrated pest management"
        },
        shelfLife: 365,
        hsCode: "1006.30"
      }
    ]
  },

  cassava: {
    category: "cassava",
    products: [
      {
        subCategory: "cassava_chips",
        productName: "Dried Cassava Chips",
        description: "Dried and processed cassava chips for export",
        packagingOptions: [
          {
            type: "polypropylene_bags",
            name: "PP Bags",
            standardWeights: [50, 100],
            description: "Moisture-resistant bags"
          },
          {
            type: "jute_bags",
            name: "Jute Bags", 
            standardWeights: [50, 100],
            description: "Breathable jute bags"
          },
          {
            type: "bulk_bags",
            name: "Bulk Bags (FIBC)",
            standardWeights: [500, 1000, 1200],
            description: "Flexible intermediate bulk containers"
          }
        ],
        qualityGrades: ["Premium", "Standard", "Feed Grade"],
        certificationRequirements: ["LACRA-CERT", "HACCP"],
        storageRequirements: {
          temperature: "20-25°C",
          humidity: "50-60%",
          ventilation: "Active",
          pestControl: "Regular monitoring"
        },
        shelfLife: 180,
        hsCode: "0714.10"
      }
    ]
  }
};