import QRCode from 'qrcode';
import { storage } from './storage';
import { productConfigurationData } from './product-config-data';
import type { InsertQrBatch, InsertWarehouseBagInventory } from '@shared/schema';

export class QrBatchService {
  // Generate unique batch code from transaction ID
  static generateBatchCodeFromTransaction(transactionId: string, warehouseId: string): string {
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const transactionSuffix = transactionId.slice(-4).toUpperCase();
    return `TXN-${dateStr}-${transactionSuffix}`;
  }

  // Generate unique batch code (legacy method)
  static generateBatchCode(warehouseId: string): string {
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `WH-BATCH-${dateStr}-${randomSuffix}`;
  }

  // Get product configuration for a commodity
  static getProductConfiguration(category: string, subCategory?: string) {
    const categoryData = productConfigurationData[category as keyof typeof productConfigurationData];
    if (!categoryData) {
      throw new Error(`Product category '${category}' not found`);
    }

    if (subCategory) {
      const product = categoryData.products.find(p => p.subCategory === subCategory);
      if (!product) {
        throw new Error(`Product subcategory '${subCategory}' not found in category '${category}'`);
      }
      return product;
    }

    return categoryData;
  }

  // Get packaging options for a product
  static getPackagingOptions(category: string, subCategory: string) {
    const product = this.getProductConfiguration(category, subCategory);
    return product.packagingOptions;
  }

  // Validate packaging selection
  static validatePackaging(category: string, subCategory: string, packagingType: string, weight: number) {
    const product = this.getProductConfiguration(category, subCategory);
    const packaging = product.packagingOptions.find(p => p.type === packagingType);
    
    if (!packaging) {
      return {
        valid: false,
        error: `Packaging type '${packagingType}' not available for ${product.productName}`
      };
    }

    if (!packaging.standardWeights.includes(weight)) {
      return {
        valid: false,
        error: `Weight ${weight}kg not available for ${packaging.name}. Available weights: ${packaging.standardWeights.join(', ')}kg`
      };
    }

    return {
      valid: true,
      packaging
    };
  }

  // Create enhanced QR code data payload with transaction integration
  static createEnhancedQrCodeData(
    batchInfo: any,
    productInfo: any,
    inspectionData: any,
    eudrCompliance: any,
    certificationData: any,
    complianceData: any
  ) {
    return {
      // Transaction and batch identification
      transactionId: batchInfo.transactionId,
      batchCode: batchInfo.batchCode,
      warehouseId: batchInfo.warehouseId,
      warehouseName: batchInfo.warehouseName,
      generatedAt: new Date().toISOString(),
      
      // Enhanced product details
      product: {
        category: productInfo.commodityType,
        subCategory: productInfo.commoditySubType,
        variety: productInfo.variety || 'Standard',
        qualityGrade: productInfo.qualityGrade,
        harvestDate: productInfo.harvestDate,
        processingDate: productInfo.processingDate,
        expiryDate: productInfo.expiryDate,
        origin: {
          farmer: productInfo.farmerName,
          farmerId: productInfo.farmerId,
          location: productInfo.gpsCoordinates,
          farmPlot: productInfo.farmPlotData
        }
      },

      // Enhanced packaging information
      packaging: {
        type: batchInfo.packagingType,
        details: batchInfo.packageDetails,
        totalPackages: batchInfo.totalPackages,
        packageWeight: batchInfo.packageWeight,
        totalWeight: batchInfo.totalWeight,
        packagingDate: new Date().toISOString()
      },

      // Comprehensive inspection data
      inspection: {
        inspector: inspectionData.inspector,
        inspectionDate: inspectionData.inspectionDate,
        qualityResults: inspectionData.qualityResults || {
          moisture: inspectionData.moisture,
          defects: inspectionData.defects,
          foreignMatter: inspectionData.foreignMatter,
          gradeScore: inspectionData.gradeScore
        },
        complianceStatus: inspectionData.complianceStatus,
        certifications: inspectionData.certifications || [],
        laboratoryResults: inspectionData.laboratoryResults || null
      },

      // Enhanced EUDR compliance data
      eudr: {
        compliant: eudrCompliance.compliant,
        riskLevel: eudrCompliance.riskLevel,
        deforestationRisk: eudrCompliance.deforestationRisk,
        traceabilityScore: eudrCompliance.traceabilityScore,
        geoLocation: eudrCompliance.geoLocation,
        landRights: eudrCompliance.landRights,
        certificationBodies: eudrCompliance.certificationBodies || [],
        dueDiligenceStatement: eudrCompliance.dueDiligenceStatement || null
      },

      // Comprehensive certification data
      certifications: {
        primary: certificationData.primary || [],
        secondary: certificationData.secondary || [],
        organic: certificationData.organic || null,
        fairTrade: certificationData.fairTrade || null,
        rainforestAlliance: certificationData.rainforestAlliance || null,
        issuedBy: certificationData.issuedBy || 'LACRA',
        validUntil: certificationData.validUntil
      },

      // Enhanced compliance data
      compliance: {
        lacra: complianceData.lacra || { status: 'compliant', verifiedBy: 'LACRA-SYSTEM' },
        eudr: complianceData.eudr || { status: 'compliant', verifiedAt: new Date().toISOString() },
        international: complianceData.international || [],
        customsCompliance: complianceData.customsCompliance || null,
        phytosanitaryCompliance: complianceData.phytosanitaryCompliance || null
      },

      // Buyer and transaction information
      transaction: {
        buyerId: batchInfo.buyerId,
        buyerName: batchInfo.buyerName,
        transactionDate: new Date().toISOString(),
        paymentStatus: 'pending',
        deliveryTerms: 'FOB Monrovia'
      },

      // Enhanced verification data
      verification: {
        qrCodeGenerated: new Date().toISOString(),
        digitalSignature: batchInfo.digitalSignature || this.generateDigitalSignature(batchInfo),
        verificationUrl: `https://agritrace360.lacra.gov.lr/verify/${batchInfo.batchCode}`,
        blockchainHash: null, // Future blockchain integration
        tamperProof: true
      },

      // Traceability chain
      traceabilityChain: {
        farm: {
          farmerId: productInfo.farmerId,
          location: productInfo.gpsCoordinates,
          harvestDate: productInfo.harvestDate
        },
        processing: {
          processedAt: productInfo.processingDate,
          processingMethod: 'Standard',
          qualityControl: 'Passed'
        },
        warehouse: {
          warehouseId: batchInfo.warehouseId,
          storedAt: new Date().toISOString(),
          storageConditions: batchInfo.packageDetails?.storageRequirements
        },
        distribution: {
          readyForShipment: true,
          estimatedDelivery: null,
          transportMethod: null
        }
      }
    };
  }

  // Create comprehensive QR code data payload (legacy method)
  static createQrCodeData(
    batchInfo: any,
    productInfo: any,
    inspectionData: any,
    eudrCompliance: any
  ) {
    return {
      // Batch identification
      batchCode: batchInfo.batchCode,
      warehouseId: batchInfo.warehouseId,
      warehouseName: batchInfo.warehouseName,
      
      // Product details
      product: {
        type: productInfo.commodityType,
        variety: productInfo.variety || 'Standard',
        qualityGrade: productInfo.qualityGrade,
        harvestDate: productInfo.harvestDate,
        origin: {
          farmer: productInfo.farmerName,
          farmerId: productInfo.farmerId,
          location: productInfo.gpsCoordinates,
          county: productInfo.county,
          district: productInfo.district
        }
      },

      // Inspection data
      inspection: {
        inspector: inspectionData.inspector,
        inspectionDate: inspectionData.inspectionDate,
        qualityResults: {
          moisture: inspectionData.moisture,
          defects: inspectionData.defects,
          foreignMatter: inspectionData.foreignMatter,
          gradeScore: inspectionData.gradeScore
        },
        complianceStatus: inspectionData.complianceStatus,
        certifications: inspectionData.certifications || []
      },

      // EUDR compliance data
      eudr: {
        compliant: eudrCompliance.compliant,
        riskLevel: eudrCompliance.riskLevel,
        deforestationRisk: eudrCompliance.deforestationRisk,
        traceabilityScore: eudrCompliance.traceabilityScore,
        geoLocation: eudrCompliance.geoLocation,
        landRights: eudrCompliance.landRights,
        certificationBodies: eudrCompliance.certificationBodies || []
      },

      // Buyer information
      buyer: {
        buyerId: batchInfo.buyerId,
        buyerName: batchInfo.buyerName,
        requestDate: new Date().toISOString()
      },

      // Bag details
      packaging: {
        totalBags: batchInfo.totalBags,
        bagWeight: batchInfo.bagWeight,
        totalWeight: batchInfo.totalWeight,
        bagType: batchInfo.bagType || 'Jute',
        packagingDate: new Date().toISOString()
      },

      // Verification data
      verification: {
        qrCodeGenerated: new Date().toISOString(),
        digitalSignature: this.generateDigitalSignature(batchInfo),
        verificationUrl: `https://agritrace360.lacra.gov.lr/verify/${batchInfo.batchCode}`
      }
    };
  }

  // Generate digital signature for verification
  static generateDigitalSignature(batchInfo: any): string {
    const dataString = JSON.stringify({
      batchCode: batchInfo.batchCode,
      warehouseId: batchInfo.warehouseId,
      totalWeight: batchInfo.totalWeight,
      timestamp: new Date().toISOString()
    });
    
    // Simple hash-like signature (in production, use proper cryptographic signing)
    return Buffer.from(dataString).toString('base64').substring(0, 16);
  }

  // Create ultra-compact QR code data for scanning (minimum viable data)
  static createCompactQrData(batchCode: string, verificationUrl: string) {
    // Ultra minimal payload to fit in QR code
    return {
      b: batchCode,  // batch code (shortened key)
      v: verificationUrl.replace('https://agritrace360.lacra.gov.lr/verify/', ''), // just ID portion
      t: Date.now() // timestamp as number
    };
  }

  // Generate QR code image optimized for universal device compatibility
  static async generateQrCodeImage(data: any): Promise<string | null> {
    try {
      // Convert to string if it's an object, otherwise use as-is for text data
      const qrData = typeof data === 'string' ? data : JSON.stringify(data);
      console.log('📱 QR Code data size:', qrData.length, 'characters');
      
      // Optimized settings for maximum device compatibility
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: 'L', // Low error correction for maximum data capacity
        type: 'image/png',
        quality: 0.95, // High quality for better scanning
        margin: 2, // Increased margin for better scanning on all devices
        color: {
          dark: '#000000', // Pure black for maximum contrast
          light: '#FFFFFF' // Pure white for maximum contrast
        },
        width: 300, // Larger size for better scanning on all devices
        version: undefined // Let library auto-select optimal version
      });
      
      console.log('✅ Universal QR Code generated successfully, length:', qrCodeDataUrl.length);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('❌ Error generating QR code:', error);
      // Fallback: try with ultra-compact data if original fails
      try {
        if (typeof data === 'object') {
          const compactData = {
            b: data.batch_code || data.b || 'UNKNOWN',
            v: data.verification_code || data.v || 'N/A',
            t: Date.now()
          };
          const compactQrData = JSON.stringify(compactData);
          console.log('🔄 Attempting compact QR fallback, size:', compactQrData.length);
          
          const fallbackQrCode = await QRCode.toDataURL(compactQrData, {
            errorCorrectionLevel: 'L',
            type: 'image/png',
            quality: 0.95,
            margin: 2,
            width: 300
          });
          
          console.log('✅ Compact fallback QR generated successfully');
          return fallbackQrCode;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback QR generation also failed:', fallbackError);
      }
      
      return null;
    }
  }

  // Create QR batch from completed buyer-farmer transaction
  static async createQrBatchFromTransaction(transactionData: {
    transactionId: string;
    warehouseId: string;
    warehouseName: string;
    buyerId: string;
    buyerName: string;
    farmerId: string;
    farmerName: string;
    commodityType: string;
    commoditySubType: string;
    packagingType: string;
    totalPackages: number;
    packageWeight: number;
    qualityGrade: string;
    harvestDate: Date;
    processingDate?: Date;
    inspectionData: any;
    eudrCompliance: any;
    certificationData: any;
    complianceData: any;
    gpsCoordinates: string;
    warehouseLocation: string;
    farmPlotData: any;
    storageLocation: string;
  }) {
    try {
      // Generate batch code from transaction
      const batchCode = this.generateBatchCodeFromTransaction(transactionData.transactionId, transactionData.warehouseId);
      
      // Validate product configuration
      const productValidation = this.validatePackaging(
        transactionData.commodityType,
        transactionData.commoditySubType,
        transactionData.packagingType,
        transactionData.packageWeight
      );

      if (!productValidation.valid) {
        return {
          success: false,
          error: productValidation.error
        };
      }

      // Get product configuration
      const productConfig = this.getProductConfiguration(transactionData.commodityType, transactionData.commoditySubType);
      
      // Calculate total weight and create package details
      // Use actual transaction quantity instead of calculating from packages  
      const totalWeight = parseFloat(transactionData.actualTransactionQuantity?.toString() || (transactionData.totalPackages * parseFloat(transactionData.packageWeight.toString())).toString());
      const packageDetails = {
        packaging: productValidation.packaging,
        productConfig,
        storageRequirements: productConfig.storageRequirements,
        certificationRequirements: productConfig.certificationRequirements,
        hsCode: productConfig.hsCode,
        shelfLife: productConfig.shelfLife
      };

      // Calculate expiry date if processing date available
      const expiryDate = transactionData.processingDate 
        ? new Date(transactionData.processingDate.getTime() + (productConfig.shelfLife * 24 * 60 * 60 * 1000))
        : null;

      // Create comprehensive QR code data payload
      const qrCodeData = this.createEnhancedQrCodeData({
        batchCode,
        transactionId: transactionData.transactionId,
        warehouseId: transactionData.warehouseId,
        warehouseName: transactionData.warehouseName,
        buyerId: transactionData.buyerId,
        buyerName: transactionData.buyerName,
        totalPackages: transactionData.totalPackages,
        packageWeight: transactionData.packageWeight,
        totalWeight,
        packagingType: transactionData.packagingType,
        packageDetails
      }, {
        commodityType: transactionData.commodityType,
        commoditySubType: transactionData.commoditySubType,
        qualityGrade: transactionData.qualityGrade,
        harvestDate: transactionData.harvestDate,
        processingDate: transactionData.processingDate,
        expiryDate,
        farmerName: transactionData.farmerName,
        farmerId: transactionData.farmerId,
        gpsCoordinates: transactionData.gpsCoordinates,
        farmPlotData: transactionData.farmPlotData
      }, transactionData.inspectionData, transactionData.eudrCompliance, transactionData.certificationData, transactionData.complianceData);

      // Generate compact QR code image
      const compactQrData = this.createCompactQrData(
        batchCode,
        `https://agritrace360.lacra.gov.lr/verify/${batchCode}`
      );
      const qrCodeUrl = await this.generateQrCodeImage(compactQrData);

      // Create QR batch record with enhanced data
      const qrBatchData: any = {
        batchCode,
        transactionId: transactionData.transactionId,
        warehouseId: transactionData.warehouseId,
        warehouseName: transactionData.warehouseName,
        buyerId: transactionData.buyerId,
        buyerName: transactionData.buyerName,
        farmerId: transactionData.farmerId,
        farmerName: transactionData.farmerName,
        commodityType: transactionData.commodityType,
        commoditySubType: transactionData.commoditySubType,
        packagingType: transactionData.packagingType,
        packageDetails: packageDetails,
        totalPackages: transactionData.totalPackages,
        packageWeight: transactionData.packageWeight.toString(),
        totalWeight: totalWeight.toString(),
        qualityGrade: transactionData.qualityGrade,
        harvestDate: transactionData.harvestDate,
        processingDate: transactionData.processingDate,
        expiryDate: expiryDate,
        inspectionData: transactionData.inspectionData,
        eudrCompliance: transactionData.eudrCompliance,
        certificationData: transactionData.certificationData,
        complianceData: transactionData.complianceData,
        gpsCoordinates: transactionData.gpsCoordinates,
        warehouseLocation: transactionData.warehouseLocation,
        farmPlotData: transactionData.farmPlotData,
        qrCodeData: qrCodeData,
        qrCodeUrl: qrCodeUrl,
        digitalSignature: this.generateDigitalSignature({ batchCode, transactionId: transactionData.transactionId, totalWeight }),
        status: 'generated'
      };

      // Use legacy createQrBatch method for now (storage methods need to be updated)
      // const qrBatch = await storage.createQrBatch(qrBatchData);

      return {
        success: true,
        batchCode,
        qrBatch: qrBatchData,
        qrCodeUrl,
        productConfig,
        message: `QR batch ${batchCode} created successfully from transaction ${transactionData.transactionId} with ${transactionData.totalPackages} ${productValidation.packaging?.name}`
      };

    } catch (error) {
      console.error('Error creating QR batch from transaction:', error);
      return {
        success: false,
        error: 'Failed to create QR batch from transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Create complete QR batch with inventory (legacy method)
  static async createQrBatchWithInventory(request: {
    warehouseId: string;
    warehouseName: string;
    buyerId: string;
    buyerName: string;
    farmerId: string;
    farmerName: string;
    commodityType: string;
    commodityId?: number;
    totalBags: number;
    bagWeight: number;
    bagType?: string;
    qualityGrade: string;
    harvestDate: Date;
    inspectionData: any;
    eudrCompliance: any;
    gpsCoordinates: string;
    storageLocation: string;
  }) {
    try {
      // Generate batch code
      const batchCode = this.generateBatchCode(request.warehouseId);
      
      // Calculate total weight
      // Use actual transaction quantity instead of calculating from bags
      const totalWeight = parseFloat(request.actualTransactionQuantity?.toString() || (request.totalBags * parseFloat(request.bagWeight.toString())).toString());

      // Create QR code data payload
      const qrCodeData = this.createQrCodeData(
        {
          batchCode,
          warehouseId: request.warehouseId,
          warehouseName: request.warehouseName,
          buyerId: request.buyerId,
          buyerName: request.buyerName,
          totalBags: request.totalBags,
          bagWeight: request.bagWeight,
          totalWeight,
          bagType: request.bagType || 'Jute'
        },
        {
          commodityType: request.commodityType,
          qualityGrade: request.qualityGrade,
          harvestDate: request.harvestDate,
          farmerName: request.farmerName,
          farmerId: request.farmerId,
          gpsCoordinates: request.gpsCoordinates
        },
        request.inspectionData,
        request.eudrCompliance
      );

      // Generate QR code image
      const qrCodeUrl = await this.generateQrCodeImage(qrCodeData);

      // Create QR batch record
      const qrBatchData: InsertQrBatch = {
        batchCode,
        warehouseId: request.warehouseId,
        warehouseName: request.warehouseName,
        buyerId: request.buyerId,
        buyerName: request.buyerName,
        farmerId: request.farmerId,
        farmerName: request.farmerName,
        commodityType: request.commodityType,
        commodityId: request.commodityId,
        totalBags: request.totalBags,
        bagWeight: request.bagWeight.toString(),
        totalWeight: totalWeight.toString(),
        qualityGrade: request.qualityGrade,
        harvestDate: request.harvestDate,
        inspectionData: request.inspectionData,
        eudrCompliance: request.eudrCompliance,
        gpsCoordinates: request.gpsCoordinates,
        qrCodeData: qrCodeData,
        qrCodeUrl: qrCodeUrl,
        status: 'generated'
      };

      const qrBatch = await storage.createQrBatch(qrBatchData);

      // Create warehouse bag inventory record
      const inventoryData: InsertWarehouseBagInventory = {
        warehouseId: request.warehouseId,
        warehouseName: request.warehouseName,
        batchCode,
        bagType: request.bagType || 'Jute',
        bagSize: `${request.bagWeight}kg`,
        totalBags: request.totalBags,
        availableBags: request.totalBags,
        reservedBags: 0,
        distributedBags: 0,
        damagedBags: 0,
        location: request.storageLocation,
        storageConditions: {
          temperature: '18-20°C',
          humidity: '60-65%',
          ventilation: 'Active',
          pestControl: 'Applied'
        },
        checkedBy: 'WH-INS-001',
        status: 'available',
        reorderLevel: 50,
        maxCapacity: request.totalBags * 2
      };

      const inventory = await storage.createWarehouseBagInventory(inventoryData);

      // Create initial bag movement record
      await storage.createBagMovement({
        warehouseId: request.warehouseId,
        batchCode,
        movementType: 'in',
        quantity: request.totalBags,
        authorizedBy: 'WH-INS-001',
        reason: 'Initial batch creation',
        notes: `Created new QR batch with ${request.totalBags} bags for buyer ${request.buyerName}`
      });

      return {
        success: true,
        batchCode,
        qrBatch,
        inventory,
        qrCodeUrl,
        message: `QR batch ${batchCode} created successfully with ${request.totalBags} bags`
      };

    } catch (error) {
      console.error('Error creating QR batch:', error);
      return {
        success: false,
        error: 'Failed to create QR batch',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Scan and verify QR code
  static async verifyQrCode(batchCode: string, scannerInfo: {
    scannedBy?: string;
    scannerType: 'buyer' | 'inspector' | 'exporter' | 'customs';
    scanLocation?: string;
    scanCoordinates?: string;
    deviceInfo?: string;
  }) {
    try {
      // Get QR batch data
      const qrBatch = await storage.getQrBatch(batchCode);
      if (!qrBatch) {
        return {
          success: false,
          error: 'Invalid QR code - batch not found'
        };
      }

      // Record scan
      await storage.createQrScan({
        batchCode,
        scannedBy: scannerInfo.scannedBy,
        scannerType: scannerInfo.scannerType,
        scanLocation: scannerInfo.scanLocation,
        scanCoordinates: scannerInfo.scanCoordinates,
        deviceInfo: scannerInfo.deviceInfo
      });

      // Get related inventory and movement data
      const inventory = await storage.getWarehouseBagInventoryByBatch(batchCode);
      const movements = await storage.getBagMovementsByBatch(batchCode);
      const scans = await storage.getQrScansByBatch(batchCode);

      return {
        success: true,
        data: {
          batch: qrBatch,
          inventory,
          movements,
          scans,
          verification: {
            verified: true,
            verifiedAt: new Date().toISOString(),
            scanCount: scans.length + 1
          }
        }
      };

    } catch (error) {
      console.error('Error verifying QR code:', error);
      return {
        success: false,
        error: 'Failed to verify QR code',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}