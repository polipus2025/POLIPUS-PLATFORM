import QRCode from 'qrcode';
import { storage } from './storage';
import type { InsertQrBatch, InsertWarehouseBagInventory } from '@shared/schema';

export class QrBatchService {
  // Generate unique batch code
  static generateBatchCode(warehouseId: string): string {
    const date = new Date();
    const dateStr = date.getFullYear().toString() + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `WH-BATCH-${dateStr}-${randomSuffix}`;
  }

  // Create comprehensive QR code data payload
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

  // Generate QR code image
  static async generateQrCodeImage(data: any): Promise<string> {
    try {
      const jsonData = JSON.stringify(data);
      const qrCodeDataUrl = await QRCode.toDataURL(jsonData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  // Create complete QR batch with inventory
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
      const totalWeight = request.totalBags * parseFloat(request.bagWeight.toString());

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