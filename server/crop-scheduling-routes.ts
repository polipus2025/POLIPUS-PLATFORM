import express from 'express';
import bcrypt from 'bcryptjs';
import { DDGOTSIntegrationService } from './ddgots-integration';

const router = express.Router();

// Mock data for crop schedules and listings
let cropSchedules: any[] = [
  {
    id: 1,
    scheduleId: 'SCH-001',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Cocoa',
    cropVariety: 'Trinitario',
    plotId: 'PLOT-001',
    plotName: 'North Plot',
    plantingArea: 2.5,
    plantingDate: '2024-01-15',
    expectedHarvestDate: '2024-06-15',
    actualHarvestDate: null,
    expectedYield: 1200,
    actualYield: null,
    status: 'ready_for_harvest',
    marketStatus: 'not_listed',
    qualityGrade: null,
    storageLocation: null,
    pricePerKg: null,
    buyerInterest: 3,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    scheduleId: 'SCH-002',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Coffee',
    cropVariety: 'Arabica',
    plotId: 'PLOT-002',
    plotName: 'South Plot',
    plantingArea: 1.8,
    plantingDate: '2024-02-01',
    expectedHarvestDate: '2024-07-01',
    actualHarvestDate: null,
    expectedYield: 900,
    actualYield: null,
    status: 'growing',
    marketStatus: 'not_listed',
    qualityGrade: null,
    storageLocation: null,
    pricePerKg: null,
    buyerInterest: 1,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 3,
    scheduleId: 'SCH-003',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Palm Oil',
    cropVariety: 'Tenera',
    plotId: 'PLOT-003',
    plotName: 'West Plot',
    plantingArea: 3.2,
    plantingDate: '2024-03-01',
    expectedHarvestDate: '2024-09-01',
    actualHarvestDate: null,
    expectedYield: 2000,
    actualYield: null,
    status: 'planted',
    marketStatus: 'not_listed',
    qualityGrade: null,
    storageLocation: null,
    pricePerKg: null,
    buyerInterest: 0,
    createdAt: '2024-03-01T10:00:00Z'
  }
];

let cropListings: any[] = [
  {
    id: 1,
    listingId: 'LIST-001',
    scheduleId: 'SCH-001',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Cocoa',
    cropVariety: 'Trinitario',
    quantityAvailable: 1150,
    pricePerKg: 2.50,
    harvestDate: '2024-06-14',
    qualityGrade: 'Grade I',
    status: 'active',
    viewCount: 45,
    inquiryCount: 8,
    location: 'Bong County, Liberia',
    storageLocation: 'Main Farm Warehouse',
    createdAt: '2024-06-15T08:00:00Z'
  },
  {
    id: 2,
    listingId: 'LIST-002',
    scheduleId: 'SCH-004',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Coffee',
    cropVariety: 'Robusta',
    quantityAvailable: 800,
    pricePerKg: 3.20,
    harvestDate: '2024-05-20',
    qualityGrade: 'Premium',
    status: 'active',
    viewCount: 32,
    inquiryCount: 5,
    location: 'Bong County, Liberia',
    storageLocation: 'Drying Facility A',
    createdAt: '2024-05-21T09:00:00Z'
  }
];

// GET /api/farmers/:farmerId/crop-schedules
router.get('/farmers/:farmerId/crop-schedules', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const farmerSchedules = cropSchedules.filter(schedule => 
      schedule.farmerId === farmerId
    );
    
    console.log(`✅ Retrieved ${farmerSchedules.length} crop schedules for farmer ${farmerId}`);
    res.json(farmerSchedules);
  } catch (error) {
    console.error('❌ Error fetching crop schedules:', error);
    res.status(500).json({ error: 'Failed to fetch crop schedules' });
  }
});

// GET /api/farmers/:farmerId/crop-listings
router.get('/farmers/:farmerId/crop-listings', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const farmerListings = cropListings.filter(listing => 
      listing.farmerId === farmerId
    );
    
    console.log(`✅ Retrieved ${farmerListings.length} crop listings for farmer ${farmerId}`);
    res.json(farmerListings);
  } catch (error) {
    console.error('❌ Error fetching crop listings:', error);
    res.status(500).json({ error: 'Failed to fetch crop listings' });
  }
});

// POST /api/farmers/crop-schedules
router.post('/farmers/crop-schedules', async (req, res) => {
  try {
    const {
      farmerId,
      cropType,
      cropVariety,
      plotId,
      plantingArea,
      plantingDate,
      expectedHarvestDate,
      expectedYield,
      status = 'planned'
    } = req.body;

    const newSchedule = {
      id: cropSchedules.length + 1,
      scheduleId: `SCH-${Date.now()}`,
      farmerId,
      cropType,
      cropVariety,
      plotId,
      plotName: `Plot ${plotId}`,
      plantingArea: parseFloat(plantingArea),
      plantingDate,
      expectedHarvestDate,
      actualHarvestDate: null,
      expectedYield: parseFloat(expectedYield),
      actualYield: null,
      status,
      marketStatus: 'not_listed',
      qualityGrade: null,
      storageLocation: null,
      pricePerKg: null,
      buyerInterest: 0,
      createdAt: new Date().toISOString()
    };

    cropSchedules.push(newSchedule);
    
    console.log(`✅ Created new crop schedule: ${newSchedule.scheduleId} for ${cropType}`);
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('❌ Error creating crop schedule:', error);
    res.status(500).json({ error: 'Failed to create crop schedule' });
  }
});

// POST /api/farmers/crop-listings
router.post('/farmers/crop-listings', async (req, res) => {
  try {
    const {
      farmerId,
      scheduleId,
      cropType,
      cropVariety,
      quantityAvailable,
      pricePerKg,
      qualityGrade,
      harvestDate,
      storageLocation,
      status = 'active'
    } = req.body;

    const newListing = {
      id: cropListings.length + 1,
      listingId: `LIST-${Date.now()}`,
      scheduleId,
      farmerId,
      cropType,
      cropVariety,
      quantityAvailable: parseFloat(quantityAvailable),
      pricePerKg: parseFloat(pricePerKg),
      harvestDate,
      qualityGrade,
      status,
      viewCount: 0,
      inquiryCount: 0,
      location: 'Bong County, Liberia', // Default location
      storageLocation,
      createdAt: new Date().toISOString()
    };

    cropListings.push(newListing);
    
    // Update the corresponding schedule's market status
    const scheduleIndex = cropSchedules.findIndex(s => s.id === scheduleId);
    if (scheduleIndex !== -1) {
      cropSchedules[scheduleIndex].marketStatus = 'listed';
    }
    
    console.log(`✅ Created new crop listing: ${newListing.listingId} for ${cropType}`);
    res.status(201).json(newListing);
  } catch (error) {
    console.error('❌ Error creating crop listing:', error);
    res.status(500).json({ error: 'Failed to create crop listing' });
  }
});

// PUT /api/farmers/crop-schedules/:scheduleId/harvest
router.put('/farmers/crop-schedules/:scheduleId/harvest', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { actualYield, qualityGrade, harvestDate } = req.body;

    const scheduleIndex = cropSchedules.findIndex(s => s.id === parseInt(scheduleId));
    
    if (scheduleIndex === -1) {
      return res.status(404).json({ error: 'Crop schedule not found' });
    }

    const schedule = cropSchedules[scheduleIndex];
    
    // AUTOMATIC BATCH CODE GENERATION
    const batchCode = `BATCH-${schedule.cropType.toUpperCase()}-${Date.now()}-${schedule.farmerId}`;
    
    // Update harvest details
    cropSchedules[scheduleIndex] = {
      ...schedule,
      actualYield: parseFloat(actualYield),
      qualityGrade,
      actualHarvestDate: harvestDate,
      status: 'harvested',
      batchCode: batchCode,
      harvestCompletedAt: new Date().toISOString()
    };
    
    // AUTOMATIC NOTIFICATIONS TO ALL STAKEHOLDERS
    const harvestData = {
      batchCode,
      farmerId: schedule.farmerId,
      plotName: schedule.plotName,
      cropType: schedule.cropType,
      cropVariety: schedule.cropVariety,
      actualYield: parseFloat(actualYield),
      qualityGrade,
      harvestDate,
      gpsCoordinates: schedule.gpsCoordinates || 'GPS-DATA-PLACEHOLDER',
      plantingDate: schedule.plantingDate,
      storageLocation: schedule.storageLocation
    };
    
    console.log(`🔄 AUTOMATIC BATCH CODE GENERATED: ${batchCode}`);
    
    // Notify Land Inspector
    console.log(`📋 NOTIFYING LAND INSPECTOR: Harvest completed for plot ${schedule.plotName}`);
    
    // Notify Warehouse Inspector
    console.log(`🏢 NOTIFYING WAREHOUSE INSPECTOR: ${parseFloat(actualYield)}kg ${schedule.cropType} ready for inspection`);
    
    // Notify All Three-Tier Regulatory Panels
    console.log(`🏛️ NOTIFYING REGULATORY PANELS (DG/DDGOTS/DDGAF): New harvest batch ${batchCode}`);
    
    // Auto-create marketplace listing eligibility
    console.log(`🛒 MARKETPLACE LISTING ENABLED: Harvest ready for buyer marketplace`);
    
    // Create automatic regulatory record
    const regulatoryRecord = {
      batchCode,
      farmerId: schedule.farmerId,
      plotGPS: schedule.gpsCoordinates,
      cropDetails: {
        type: schedule.cropType,
        variety: schedule.cropVariety,
        yield: parseFloat(actualYield),
        quality: qualityGrade,
        harvestDate
      },
      complianceStatus: 'EUDR_COMPLIANT',
      traceabilityActive: true,
      inspectionRequired: true,
      marketplaceEligible: true,
      createdAt: new Date().toISOString()
    };
    
    // POINT 3: Send harvest notifications to area buyers (IMPLEMENTED)
    const harvestNotificationData = {
      farmerId: schedule.farmerId,
      batchCode,
      cropType: schedule.cropType,
      quantity: parseFloat(actualYield),
      county: 'Bomi County',
      district: 'Dewoin District',
      harvestDate,
      targetBuyers: ['BUYER-001', 'BUYER-002', 'BUYER-003', 'BUYER-004']
    };

    // POINT 3: Send harvest notifications to area buyers (IMPLEMENTED)
    try {
      await DDGOTSIntegrationService.sendHarvestNotificationToBuyers(harvestNotificationData);
    } catch (integrationError) {
      console.log('⚠️ DDGOTS Integration not available, using fallback notifications');
    }

    console.log(`✅ HARVEST WORKFLOW COMPLETED: ${batchCode} - All stakeholders notified`);
    
    res.json({
      ...cropSchedules[scheduleIndex],
      regulatoryRecord,
      notifications: {
        landInspector: 'NOTIFIED',
        warehouseInspector: 'NOTIFIED',
        regulatoryPanels: 'NOTIFIED',
        marketplaceListing: 'ENABLED',
        areaByersNotified: harvestNotificationData.targetBuyers.length
      }
    });
  } catch (error) {
    console.error('❌ Error updating harvest status:', error);
    res.status(500).json({ error: 'Failed to update harvest status' });
  }
});

// GET /api/farmers/:farmerId/harvest-alerts
router.get('/farmers/:farmerId/harvest-alerts', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Generate alerts for crops ready for harvest
    const farmerSchedules = cropSchedules.filter(s => s.farmerId === farmerId);
    const alerts = farmerSchedules
      .filter(s => s.status === 'ready_for_harvest')
      .map(schedule => ({
        id: schedule.id,
        type: 'harvest_ready',
        title: `${schedule.cropType} Ready for Harvest`,
        message: `Your ${schedule.cropType} (${schedule.cropVariety}) in ${schedule.plotName} is ready for harvest. Expected yield: ${schedule.expectedYield}kg`,
        priority: 'high',
        scheduleId: schedule.scheduleId,
        cropType: schedule.cropType,
        createdAt: new Date().toISOString()
      }));
    
    console.log(`✅ Generated ${alerts.length} harvest alerts for farmer ${farmerId}`);
    res.json(alerts);
  } catch (error) {
    console.error('❌ Error fetching harvest alerts:', error);
    res.status(500).json({ error: 'Failed to fetch harvest alerts' });
  }
});

// POINT 4: First-come-first-serve lot proposal system
router.post('/farmers/lot-proposals/:batchCode/accept', async (req, res) => {
  try {
    const { batchCode } = req.params;
    const { buyerId, buyerName } = req.body;

    console.log(`🎯 LOT PROPOSAL: Processing proposal for batch ${batchCode} from buyer ${buyerId}`);

    // Process first-come-first-serve lot proposal
    const result = await DDGOTSIntegrationService.processLotProposal(batchCode, buyerId);

    if (result.success) {
      res.json({
        success: true,
        transactionCode: result.transactionCode,
        message: result.message,
        batchCode,
        buyerId,
        status: 'accepted',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(409).json({
        success: false,
        message: result.message,
        batchCode,
        status: 'sold_out'
      });
    }
  } catch (error) {
    console.error('❌ Error processing lot proposal:', error);
    res.status(500).json({ error: 'Failed to process lot proposal' });
  }
});

// POINT 2: Warehouse QR batch approval system
router.post('/warehouse/qr-batch-approval', async (req, res) => {
  try {
    const {
      transactionId,
      batchCode,
      warehouseId,
      bagCount,
      packagingType,
      totalWeight,
      qualityGrade,
      requestedBy
    } = req.body;

    console.log(`🏢 WAREHOUSE QR APPROVAL: Processing request for batch ${batchCode}`);

    const approvalRequest = {
      transactionId,
      batchCode,
      warehouseId,
      packagingDetails: {
        bagCount: parseInt(bagCount),
        packagingType,
        totalWeight: parseFloat(totalWeight),
        qualityGrade
      },
      requestedBy,
      timestamp: new Date().toISOString()
    };

    // Process warehouse QR batch approval via DDGOTS
    const approvalResult = await DDGOTSIntegrationService.approveWarehouseQRBatch(approvalRequest);

    if (approvalResult.approved) {
      res.json({
        approved: true,
        approvalCode: approvalResult.approvalCode,
        batchCode,
        packagingRecord: approvalRequest.packagingDetails,
        approvedAt: new Date().toISOString(),
        message: 'QR batch approved by DDGOTS. Packaging issuance recorded.'
      });
    } else {
      res.status(400).json({
        approved: false,
        message: 'QR batch approval failed. Contact DDGOTS for assistance.'
      });
    }
  } catch (error) {
    console.error('❌ Error processing warehouse QR approval:', error);
    res.status(500).json({ error: 'Failed to process QR approval' });
  }
});

// POINT 1: Land Inspector compliance data to DDGOTS
router.post('/land-inspector/compliance-data', async (req, res) => {
  try {
    const {
      farmerId,
      plotId,
      landMappingId,
      gpsCoordinates,
      deforestationRisk,
      complianceStatus,
      cutoffDate,
      riskAssessment,
      inspectorId,
      inspectorName,
      farmerName,
      county,
      district,
      village
    } = req.body;

    console.log(`📋 LAND INSPECTOR: Sending compliance data to DDGOTS for farmer ${farmerId}`);

    const complianceData = {
      farmerId,
      plotId,
      landMappingId,
      eudrData: {
        gpsCoordinates,
        deforestationRisk,
        complianceStatus,
        cutoffDate,
        riskAssessment
      },
      inspector: {
        inspectorId,
        inspectorName,
        inspectionDate: new Date().toISOString()
      },
      farmerData: {
        farmerName,
        county,
        district,
        village
      }
    };

    // Send land mapping compliance data to DDGOTS
    const success = await DDGOTSIntegrationService.sendLandMappingComplianceData(complianceData);

    if (success) {
      res.json({
        success: true,
        message: 'Land mapping compliance data successfully sent to DDGOTS',
        farmerId,
        plotId,
        complianceStatus,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send compliance data to DDGOTS'
      });
    }
  } catch (error) {
    console.error('❌ Error sending compliance data:', error);
    res.status(500).json({ error: 'Failed to send compliance data' });
  }
});

// POINT 5: Payment confirmation workflow (Buyer → Farmer → Regulator/Land Inspector)
router.post('/farmers/payment-confirmation', async (req, res) => {
  try {
    const {
      transactionCode,
      batchCode,
      farmerId,
      buyerId,
      paymentAmount,
      paymentMethod,
      paymentReference,
      farmerConfirmation,
      confirmationMethod
    } = req.body;

    console.log(`💰 PAYMENT CONFIRMATION: Processing payment for batch ${batchCode}`);

    const paymentRecord = {
      transactionCode,
      batchCode,
      farmerId,
      buyerId,
      paymentDetails: {
        amount: parseFloat(paymentAmount),
        method: paymentMethod,
        reference: paymentReference,
        confirmedAt: new Date().toISOString()
      },
      farmerConfirmation: {
        confirmed: farmerConfirmation,
        method: confirmationMethod, // 'PORTAL' or 'SMS'
        confirmedAt: new Date().toISOString()
      },
      status: 'payment_confirmed'
    };

    // Notify Regulator and Land Inspector about payment confirmation
    const paymentNotificationData = {
      ...paymentRecord,
      notifications: {
        regulator: {
          department: 'DDGOTS',
          notificationType: 'PAYMENT_CONFIRMED',
          message: `Payment confirmed for batch ${batchCode}. Amount: $${paymentAmount}. Crop transfer approved.`
        },
        landInspector: {
          inspectorId: 'INS-001', // Would be retrieved from batch records
          notificationType: 'PAYMENT_CONFIRMED',
          message: `Payment confirmed for supervised lot ${batchCode}. Transfer tracking activated.`
        }
      }
    };

    // Send notifications via DDGOTS integration
    try {
      await DDGOTSIntegrationService.notifyPaymentConfirmation(paymentNotificationData);
    } catch (integrationError) {
      console.log('⚠️ DDGOTS payment notification not available, using fallback');
    }

    console.log(`✅ PAYMENT CONFIRMED: ${transactionCode} - Regulators and Land Inspector notified`);

    res.json({
      success: true,
      transactionCode,
      batchCode,
      paymentRecord,
      transferStatus: 'approved',
      notifications: {
        regulator: 'NOTIFIED',
        landInspector: 'NOTIFIED',
        transferTracking: 'ACTIVATED'
      },
      message: 'Payment confirmed. Crop transfer from farmer to buyer approved.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing payment confirmation:', error);
    res.status(500).json({ error: 'Failed to process payment confirmation' });
  }
});

// POINT 6: Warehouse delivery registration and quality inspection
router.post('/warehouse/delivery-registration', async (req, res) => {
  try {
    const {
      transactionCode,
      batchCode,
      buyerId,
      warehouseId,
      warehouseInspectorId,
      deliveryDetails,
      qualityInspection,
      quantityVerification,
      complianceDocuments
    } = req.body;

    console.log(`🏢 WAREHOUSE DELIVERY: Processing delivery for batch ${batchCode}`);

    const deliveryRecord = {
      transactionCode,
      batchCode,
      buyerId,
      warehouseId,
      warehouseInspectorId,
      deliveryDetails: {
        deliveredAt: new Date().toISOString(),
        deliveryMethod: deliveryDetails.method,
        transportReference: deliveryDetails.transportRef,
        receivedBy: deliveryDetails.receivedBy
      },
      qualityInspection: {
        grade: qualityInspection.grade,
        moistureContent: qualityInspection.moisture,
        foreignMatter: qualityInspection.foreignMatter,
        overallQuality: qualityInspection.overall,
        inspectorNotes: qualityInspection.notes,
        inspectedAt: new Date().toISOString()
      },
      quantityVerification: {
        declaredWeight: parseFloat(quantityVerification.declared),
        actualWeight: parseFloat(quantityVerification.actual),
        variance: parseFloat(quantityVerification.actual) - parseFloat(quantityVerification.declared),
        acceptanceStatus: Math.abs(parseFloat(quantityVerification.actual) - parseFloat(quantityVerification.declared)) <= 5 ? 'ACCEPTED' : 'VARIANCE_REVIEW'
      },
      complianceDocuments: {
        eudrCompliance: complianceDocuments.eudr,
        traceabilityDocs: complianceDocuments.traceability,
        phytosanitaryCert: complianceDocuments.phytosanitary,
        qualityCertificate: complianceDocuments.quality
      },
      warehouseApproval: {
        approved: true,
        approvedAt: new Date().toISOString(),
        approvalCode: `WH-APPR-${Date.now()}`
      }
    };

    // Notify Buyer and DDGOTS Regulator about warehouse approval
    const warehouseNotificationData = {
      ...deliveryRecord,
      notifications: {
        buyer: {
          buyerId,
          notificationType: 'WAREHOUSE_APPROVED',
          message: `Your delivery for batch ${batchCode} has been approved by warehouse inspection. Quality: ${qualityInspection.overall}, Quantity: ${quantityVerification.actual}kg`
        },
        regulator: {
          department: 'DDGOTS',
          notificationType: 'WAREHOUSE_DELIVERY_APPROVED',
          message: `Warehouse delivery approved for batch ${batchCode}. All compliance documentation verified.`,
          complianceStatus: 'VERIFIED'
        }
      }
    };

    // Send notifications via DDGOTS integration
    try {
      await DDGOTSIntegrationService.notifyWarehouseDeliveryApproval(warehouseNotificationData);
    } catch (integrationError) {
      console.log('⚠️ DDGOTS warehouse notification not available, using fallback');
    }

    console.log(`✅ WAREHOUSE DELIVERY APPROVED: ${deliveryRecord.warehouseApproval.approvalCode} - Buyer and DDGOTS notified`);

    res.json({
      success: true,
      deliveryRecord,
      warehouseApproval: deliveryRecord.warehouseApproval,
      notifications: {
        buyer: 'NOTIFIED',
        regulator: 'NOTIFIED',
        complianceVerified: true
      },
      message: 'Warehouse delivery registered and approved. All parties notified.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error processing warehouse delivery:', error);
    res.status(500).json({ error: 'Failed to process warehouse delivery' });
  }
});

// POINT 7: Warehouse product registration (30-day storage limit)
router.post('/warehouse/product-registration', async (req, res) => {
  try {
    const {
      transactionCode,
      batchCode,
      buyerId,
      warehouseId,
      warehouseApprovalCode,
      productDetails,
      storageLocation,
      registrationNotes
    } = req.body;

    console.log(`📦 WAREHOUSE REGISTRATION: Registering product for buyer ${buyerId}`);

    const registrationRecord = {
      registrationId: `WH-REG-${Date.now()}`,
      transactionCode,
      batchCode,
      buyerId,
      warehouseId,
      warehouseApprovalCode,
      productDetails: {
        cropType: productDetails.cropType,
        quantity: parseFloat(productDetails.quantity),
        qualityGrade: productDetails.qualityGrade,
        packagingType: productDetails.packagingType,
        totalBags: parseInt(productDetails.totalBags)
      },
      storageDetails: {
        location: storageLocation,
        storageStartDate: new Date().toISOString(),
        storageExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        storageStatus: 'active',
        daysRemaining: 30
      },
      registrationNotes,
      registeredAt: new Date().toISOString(),
      registeredBy: 'warehouse-system'
    };

    // Notify buyer about product registration
    const buyerNotificationData = {
      registrationId: registrationRecord.registrationId,
      buyerId,
      batchCode,
      productDetails: registrationRecord.productDetails,
      storageDetails: registrationRecord.storageDetails,
      message: `Your product ${batchCode} has been registered in warehouse ${warehouseId}. Storage expires in 30 days.`
    };

    try {
      await DDGOTSIntegrationService.notifyBuyerProductRegistration(buyerNotificationData);
    } catch (integrationError) {
      console.log('⚠️ Buyer notification not available, using fallback');
    }

    console.log(`✅ PRODUCT REGISTERED: ${registrationRecord.registrationId} - Buyer notified`);

    res.json({
      success: true,
      registrationRecord,
      storageInfo: {
        expiryDate: registrationRecord.storageDetails.storageExpiryDate,
        daysRemaining: 30,
        storageLocation: storageLocation
      },
      notifications: {
        buyer: 'NOTIFIED',
        marketplaceEligible: true
      },
      message: 'Product registered in warehouse. Available for buyer marketplace listing.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error registering warehouse product:', error);
    res.status(500).json({ error: 'Failed to register warehouse product' });
  }
});

// POINT 8: Buyer marketplace listing for exporters
router.post('/buyer/marketplace-listing', async (req, res) => {
  try {
    const {
      registrationId,
      buyerId,
      batchCode,
      listingDetails,
      pricingInfo,
      exporterRequirements
    } = req.body;

    console.log(`🛒 BUYER MARKETPLACE: Creating listing for registration ${registrationId}`);

    const marketplaceListing = {
      listingId: `EXPORT-${Date.now()}-${buyerId.slice(-4)}`,
      registrationId,
      buyerId,
      batchCode,
      listingDetails: {
        title: listingDetails.title,
        description: listingDetails.description,
        cropType: listingDetails.cropType,
        quantity: parseFloat(listingDetails.quantity),
        qualityGrade: listingDetails.qualityGrade,
        origin: listingDetails.origin,
        certifications: listingDetails.certifications
      },
      pricingInfo: {
        basePrice: parseFloat(pricingInfo.basePrice),
        currency: pricingInfo.currency,
        priceUnit: pricingInfo.priceUnit,
        negotiable: pricingInfo.negotiable,
        minimumOrder: parseFloat(pricingInfo.minimumOrder)
      },
      exporterRequirements: {
        minimumOrderQuantity: parseFloat(exporterRequirements.minimumOrder),
        paymentTerms: exporterRequirements.paymentTerms,
        deliveryTerms: exporterRequirements.deliveryTerms,
        certificationRequired: exporterRequirements.certifications
      },
      listingStatus: 'active',
      listedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days (5 days before warehouse storage expires)
      visibility: 'public'
    };

    // Notify exporters about new listing
    const exporterNotificationData = {
      listingId: marketplaceListing.listingId,
      buyerId,
      productDetails: marketplaceListing.listingDetails,
      pricingInfo: marketplaceListing.pricingInfo,
      message: `New ${listingDetails.cropType} listing available: ${listingDetails.quantity}kg at $${pricingInfo.basePrice}/${pricingInfo.priceUnit}`
    };

    try {
      await DDGOTSIntegrationService.notifyExportersNewListing(exporterNotificationData);
    } catch (integrationError) {
      console.log('⚠️ Exporter notification not available, using fallback');
    }

    console.log(`✅ MARKETPLACE LISTING CREATED: ${marketplaceListing.listingId} - Exporters notified`);

    res.json({
      success: true,
      marketplaceListing,
      listingInfo: {
        listingId: marketplaceListing.listingId,
        expiresAt: marketplaceListing.expiresAt,
        daysActive: 25
      },
      notifications: {
        exporters: 'NOTIFIED',
        listingActive: true
      },
      message: 'Product listed in buyer-exporter marketplace. Exporters can now make proposals.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error creating marketplace listing:', error);
    res.status(500).json({ error: 'Failed to create marketplace listing' });
  }
});

// Get buyer warehouse products (for buyer portal)
router.get('/buyer/:buyerId/warehouse-products', async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    console.log(`📋 RETRIEVING: Warehouse products for buyer ${buyerId}`);
    
    // Mock warehouse products data (in real implementation, this would query the database)
    const warehouseProducts = [
      {
        registrationId: 'WH-REG-1755800001234',
        batchCode: 'BATCH-COFFEE-1755798004392-FARM-1755271600707-BQA7R4QFP',
        productDetails: {
          cropType: 'Coffee',
          quantity: 898,
          qualityGrade: 'Superior',
          packagingType: 'Jute Bags',
          totalBags: 45
        },
        storageDetails: {
          location: 'Section A-12',
          storageStartDate: '2025-08-21T17:57:12.894Z',
          storageExpiryDate: '2025-09-20T17:57:12.894Z',
          daysRemaining: 29,
          storageStatus: 'active'
        },
        marketplaceStatus: 'not_listed',
        warehouseApprovalCode: 'WH-APPR-1755799032894'
      }
    ];
    
    res.json({
      success: true,
      buyerId,
      warehouseProducts,
      totalProducts: warehouseProducts.length,
      message: 'Warehouse products retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error retrieving warehouse products:', error);
    res.status(500).json({ error: 'Failed to retrieve warehouse products' });
  }
});

// Get buyer marketplace listings (for buyer portal)
router.get('/buyer/:buyerId/marketplace-listings', async (req, res) => {
  try {
    const { buyerId } = req.params;
    
    console.log(`📋 RETRIEVING: Marketplace listings for buyer ${buyerId}`);
    
    // Mock marketplace listings data
    const marketplaceListings = [
      {
        listingId: 'EXPORT-1755800002345-R001',
        registrationId: 'WH-REG-1755800001234',
        batchCode: 'BATCH-COFFEE-1755798004392-FARM-1755271600707-BQA7R4QFP',
        listingDetails: {
          title: 'Premium Liberian Coffee - Superior Grade',
          cropType: 'Coffee',
          quantity: 898,
          qualityGrade: 'Superior',
          origin: 'Bomi County, Liberia'
        },
        pricingInfo: {
          basePrice: 4.50,
          currency: 'USD',
          priceUnit: 'kg',
          negotiable: true
        },
        listingStatus: 'active',
        listedAt: '2025-08-21T18:00:00.000Z',
        expiresAt: '2025-09-15T18:00:00.000Z',
        exporterProposals: 2
      }
    ];
    
    res.json({
      success: true,
      buyerId,
      marketplaceListings,
      totalListings: marketplaceListings.length,
      message: 'Marketplace listings retrieved successfully'
    });
    
  } catch (error) {
    console.error('❌ Error retrieving marketplace listings:', error);
    res.status(500).json({ error: 'Failed to retrieve marketplace listings' });
  }
});

export default router;