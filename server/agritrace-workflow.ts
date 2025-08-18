import { db } from './db';
import { 
  agriTraceWorkflows, 
  agriTraceStages, 
  agriTraceEvents,
  agriTraceDocuments,
  agriTraceQualityMetrics,
  agriTraceCompliance,
  commodities,
  farmers,
  inspections,
  certifications,
  alerts
} from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';

// AgriTrace LACRA EUDR Workflow Implementation
export class AgriTraceWorkflowService {
  
  // Step 0: National Mapping Plan
  async initializeNationalMappingPlan(lacraAdminId: string) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: "National Mapping Plan",
      workflowType: "national_mapping",
      status: "active",
      priority: 1,
      farmerId: lacraAdminId,
      currentStage: "planning",
      totalStages: 14,
      workflowConfiguration: {
        type: "national_plan",
        counties: 15,
        description: "LACRA prepares national plan to map all farms"
      }
    }).returning();

    return workflow[0];
  }

  // Step 1: Inspector Registration
  async registerInspector(inspectorData: {
    inspectorId: string;
    name: string;
    county: string;
    area: string;
    contact: string;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Inspector Registration - ${inspectorData.name}`,
      workflowType: "inspector_registration",
      status: "active",
      priority: 2,
      farmerId: inspectorData.inspectorId,
      currentStage: "registration",
      totalStages: 14,
      workflowConfiguration: {
        inspector: inspectorData,
        registrationDate: new Date().toISOString(),
        authorizedCounty: inspectorData.county
      }
    }).returning();

    return workflow[0];
  }

  // Step 2: Farmer Onboarding & Mapping
  async onboardFarmer(farmerData: {
    farmerId: string;
    inspectorId: string;
    farmPlots: any[];
    estimatedOutput: number;
    eudrStatus: 'compliant' | 'non_compliant';
    deforestationStatus: 'positive' | 'negative';
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Farmer Onboarding - ${farmerData.farmerId}`,
      workflowType: "farmer_onboarding",
      status: "active",
      priority: 2,
      farmerId: farmerData.farmerId,
      currentStage: "mapping",
      totalStages: 14,
      assignedInspector: farmerData.inspectorId,
      complianceScore: farmerData.eudrStatus === 'compliant' ? 100 : 0,
      workflowConfiguration: {
        farmPlots: farmerData.farmPlots,
        estimatedOutput: farmerData.estimatedOutput,
        eudrStatus: farmerData.eudrStatus,
        deforestationStatus: farmerData.deforestationStatus,
        mappingComplete: true,
        canSellCrops: farmerData.eudrStatus === 'compliant'
      }
    }).returning();

    // Create compliance record
    await db.insert(agriTraceCompliance).values({
      workflowId: workflow[0].id,
      complianceType: "eudr",
      requirement: "EU Deforestation Regulation Compliance",
      status: farmerData.eudrStatus,
      assessedBy: farmerData.inspectorId,
      evidence: {
        deforestationStatus: farmerData.deforestationStatus,
        satelliteData: true,
        farmMapping: true
      }
    });

    return workflow[0];
  }

  // Step 3: Farmer to Licensed Agents/Buyers Communication
  async notifyHarvestReady(farmerId: string, cropData: {
    cropType: string;
    quantity: number;
    contactNumber: string;
    county: string;
    communicationMethod: 'online' | 'sms';
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Harvest Ready - ${farmerId}`,
      workflowType: "harvest_notification",
      status: "active",
      priority: 3,
      farmerId: farmerId,
      currentStage: "harvest_ready",
      totalStages: 14,
      workflowConfiguration: {
        cropType: cropData.cropType,
        quantity: cropData.quantity,
        contactNumber: cropData.contactNumber,
        county: cropData.county,
        communicationMethod: cropData.communicationMethod,
        smsGateway: cropData.communicationMethod === 'sms' ? '1111' : null,
        broadcastToAgents: true,
        salesBasis: "first_come_first_served"
      }
    }).returning();

    // Generate SMS notification if offline
    if (cropData.communicationMethod === 'sms') {
      await this.sendSMSNotification(farmerId, cropData);
    }

    return workflow[0];
  }

  // SMS Gateway System for Step 3
  private async sendSMSNotification(farmerId: string, cropData: any) {
    const smsFormat = `${farmerId}, ${cropData.cropType}, ${cropData.quantity}, ${cropData.contactNumber}`;
    
    await db.insert(agriTraceEvents).values({
      workflowId: 0, // Will be updated with actual workflow ID
      eventType: "sms_notification",
      eventName: "Harvest Ready SMS Broadcast",
      eventData: {
        message: smsFormat,
        gateway: "1111",
        county: cropData.county,
        broadcastToLicensedAgents: true
      },
      triggeredBy: farmerId,
      triggerType: "manual",
      severity: "info"
    });
  }

  // Generate Unique Reference Code for Farmer-Agent Agreement
  async generateReferenceCode(farmerId: string, agentId: string, cropDetails: {
    volume: number;
    cropType: string;
    location: string;
    agentContact: string;
  }) {
    const referenceCode = `AGT-${Date.now()}-${farmerId.slice(-4)}-${agentId.slice(-4)}`;
    
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Agreement - ${referenceCode}`,
      workflowType: "farmer_agent_agreement",
      status: "active",
      priority: 3,
      farmerId: farmerId,
      currentStage: "agreement_confirmed",
      totalStages: 14,
      workflowConfiguration: {
        referenceCode: referenceCode,
        agentId: agentId,
        volume: cropDetails.volume,
        cropType: cropDetails.cropType,
        location: cropDetails.location,
        agentContact: cropDetails.agentContact,
        agreementDate: new Date().toISOString()
      }
    }).returning();

    return { workflow: workflow[0], referenceCode };
  }

  // Step 4: Traceable Bag Collection
  async collectTraceableBags(agentId: string, referenceCode: string, cropVolume: number) {
    const bagsNeeded = Math.ceil(cropVolume / 0.077); // Assuming ~77kg per bag (5 tons = 65 bags)
    
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Bag Collection - ${referenceCode}`,
      workflowType: "bag_collection",
      status: "active",
      priority: 3,
      farmerId: agentId,
      currentStage: "bag_collection",
      totalStages: 14,
      workflowConfiguration: {
        referenceCode: referenceCode,
        bagsRequested: bagsNeeded,
        bagsIssued: bagsNeeded,
        issuedBy: "LACRA & Eco Enviros",
        paymentRequired: true,
        warehouseLocation: "Government Warehouse"
      }
    }).returning();

    return workflow[0];
  }

  // Step 5: Collection of Crops from Farmer
  async collectCropsFromFarmer(farmerId: string, agentId: string, transactionDetails: {
    cropType: string;
    quantity: number;
    paymentMade: boolean;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Crop Collection - ${farmerId}`,
      workflowType: "crop_collection",
      status: transactionDetails.paymentMade ? "active" : "pending_payment",
      priority: 3,
      farmerId: farmerId,
      currentStage: "crop_collection",
      totalStages: 14,
      workflowConfiguration: {
        agentId: agentId,
        cropType: transactionDetails.cropType,
        quantity: transactionDetails.quantity,
        paymentMade: transactionDetails.paymentMade,
        confirmationGateway: "2222",
        transportMethod: "traceable_bags"
      }
    }).returning();

    if (transactionDetails.paymentMade) {
      await this.confirmPayment(farmerId, agentId, transactionDetails);
    }

    return workflow[0];
  }

  // Payment Confirmation System for Step 5
  private async confirmPayment(farmerId: string, agentId: string, details: any) {
    await db.insert(agriTraceEvents).values({
      workflowId: 0, // Will be updated
      eventType: "payment_confirmation",
      eventName: "Lot Sale and Paid Confirmation",
      eventData: {
        farmerId: farmerId,
        agentId: agentId,
        cropType: details.cropType,
        quantity: details.quantity,
        gateway: "2222",
        transactionComplete: true
      },
      triggeredBy: farmerId,
      triggerType: "manual",
      severity: "info"
    });
  }

  // Step 6: Government Warehouse / Supply Chain Traceability
  async processWarehouseDelivery(batchCode: string, deliveryDetails: {
    agentId: string;
    cropType: string;
    quantity: number;
    qualityGrade: string;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Warehouse Processing - ${batchCode}`,
      workflowType: "warehouse_processing",
      status: "active",
      priority: 3,
      farmerId: deliveryDetails.agentId,
      currentStage: "warehouse_processing",
      totalStages: 14,
      workflowConfiguration: {
        batchCode: batchCode,
        deliveryConfirmed: true,
        quantityCheck: deliveryDetails.quantity,
        qualityCheck: deliveryDetails.qualityGrade,
        inspectedBy: "LACRA & EcoEnviros",
        warehouseStorage: true,
        readyForExport: true
      }
    }).returning();

    return workflow[0];
  }

  // Step 7: Licensed Agents/Buyers to Exporter Communication
  async proposeExporterSale(agentId: string, exporterId: string, saleDetails: {
    cropType: string;
    quantity: number;
    pricePerUnit: number;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Exporter Sale Proposal - ${exporterId}`,
      workflowType: "exporter_communication",
      status: "pending",
      priority: 3,
      farmerId: agentId,
      currentStage: "proposal_sent",
      totalStages: 14,
      workflowConfiguration: {
        agentId: agentId,
        exporterId: exporterId,
        saleDetails: saleDetails,
        proposalDate: new Date().toISOString(),
        status: "pending_response"
      }
    }).returning();

    return workflow[0];
  }

  // Exporter Response to Proposal
  async respondToProposal(workflowId: number, exporterId: string, response: 'accept' | 'decline') {
    const newReferenceNumber = response === 'accept' ? `EXP-${Date.now()}-${exporterId.slice(-4)}` : null;
    
    await db.update(agriTraceWorkflows)
      .set({
        status: response === 'accept' ? 'active' : 'declined',
        currentStage: response === 'accept' ? 'proposal_accepted' : 'proposal_declined',
        workflowConfiguration: {
          response: response,
          newReferenceNumber: newReferenceNumber,
          responseDate: new Date().toISOString()
        }
      })
      .where(eq(agriTraceWorkflows.id, workflowId));

    return { response, referenceNumber: newReferenceNumber };
  }

  // Step 8: Warehouse Transfer
  async authorizeWarehouseTransfer(referenceNumber: string, transferDetails: {
    fromWarehouse: string;
    toWarehouse: string;
    exporterId: string;
    quantity: number;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Warehouse Transfer - ${referenceNumber}`,
      workflowType: "warehouse_transfer",
      status: "active",
      priority: 3,
      farmerId: transferDetails.exporterId,
      currentStage: "warehouse_transfer",
      totalStages: 14,
      workflowConfiguration: {
        referenceNumber: referenceNumber,
        fromWarehouse: transferDetails.fromWarehouse,
        toWarehouse: transferDetails.toWarehouse,
        transferAuthorized: true,
        transferDate: new Date().toISOString()
      }
    }).returning();

    return workflow[0];
  }

  // Step 9: Exporter Warehouse Confirmation
  async confirmExporterWarehouseArrival(batchCode: string, inspectionDetails: {
    exporterId: string;
    quantity: number;
    qualityGrade: string;
    inspectorId: string;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Exporter Warehouse Confirmation - ${batchCode}`,
      workflowType: "exporter_warehouse_confirmation",
      status: "active",
      priority: 3,
      farmerId: inspectionDetails.exporterId,
      currentStage: "warehouse_confirmation",
      totalStages: 14,
      assignedInspector: inspectionDetails.inspectorId,
      workflowConfiguration: {
        batchCode: batchCode,
        arrivalConfirmed: true,
        inspectionRequested: true,
        quantity: inspectionDetails.quantity,
        qualityGrade: inspectionDetails.qualityGrade,
        inspectedBy: "LACRA & Eco Enviros",
        syncedToExporterPortal: true
      }
    }).returning();

    return workflow[0];
  }

  // Step 10: Payment to Licensed Agents/Buyers
  async processAgentPayment(agentId: string, exporterId: string, paymentDetails: {
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
  }) {
    const daysLate = this.calculatePaymentDelay(paymentDetails.paymentDate);
    const penalties = this.calculateLatePenalties(daysLate, paymentDetails.amount);

    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Agent Payment - ${agentId}`,
      workflowType: "agent_payment",
      status: daysLate > 30 ? "suspended" : "active",
      priority: daysLate > 15 ? 1 : 3,
      farmerId: agentId,
      currentStage: "payment_processing",
      totalStages: 14,
      workflowConfiguration: {
        exporterId: exporterId,
        paymentAmount: paymentDetails.amount,
        paymentDate: paymentDetails.paymentDate.toISOString(),
        daysLate: daysLate,
        penalties: penalties,
        paymentConditions: {
          mandatory7Days: true,
          interestRate: daysLate > 7 ? "daily_interest" : null,
          licenseStatus: daysLate > 30 ? "suspended" : "active"
        }
      }
    }).returning();

    return workflow[0];
  }

  private calculatePaymentDelay(paymentDate: Date): number {
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - paymentDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private calculateLatePenalties(daysLate: number, amount: number): number {
    if (daysLate <= 7) return 0;
    if (daysLate <= 15) return amount * 0.01 * daysLate; // Daily interest
    if (daysLate <= 30) return amount * 0.02 * daysLate; // Double interest
    return amount * 0.05; // Maximum penalty
  }

  // Step 11: Export Preparation
  async initiateExportPreparation(exporterId: string, processingDetails: {
    cropType: string;
    quantity: number;
    processingSteps: string[];
    qualityCheckRequested: boolean;
    exportPermitRequested: boolean;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Export Preparation - ${exporterId}`,
      workflowType: "export_preparation",
      status: "active",
      priority: 2,
      farmerId: exporterId,
      currentStage: "processing",
      totalStages: 14,
      workflowConfiguration: {
        processingSteps: processingDetails.processingSteps,
        qualityCheckRequested: processingDetails.qualityCheckRequested,
        exportPermitRequested: processingDetails.exportPermitRequested,
        inspectionScheduled: true,
        inspectedBy: "LACRA & Eco Enviros"
      }
    }).returning();

    return workflow[0];
  }

  // Step 12: Quality & Compliance Check
  async conductFinalInspection(exporterId: string, inspectionDetails: {
    qualityGrade: string;
    quantity: number;
    fumigationStatus: boolean;
    internationalStandards: boolean;
  }) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Final Inspection - ${exporterId}`,
      workflowType: "final_inspection",
      status: "active",
      priority: 1,
      farmerId: exporterId,
      currentStage: "quality_check",
      totalStages: 14,
      complianceScore: inspectionDetails.internationalStandards ? 100 : 0,
      workflowConfiguration: {
        qualityGrade: inspectionDetails.qualityGrade,
        quantity: inspectionDetails.quantity,
        fumigationCompleted: inspectionDetails.fumigationStatus,
        internationalStandards: inspectionDetails.internationalStandards,
        reportsGenerated: [
          "EUDR Compliance Fee",
          "Quality Control Fee", 
          "Satellite Monitoring Fees",
          "Deforestation Certificate Fee",
          "Certificate of Origin Fee",
          "Fumigation & Phytosanitary Fees",
          "Good Practice Certificate Fee"
        ],
        regulatorOnlyAccess: true
      }
    }).returning();

    return workflow[0];
  }

  // Step 13: Payment of Reports & Fees
  async processFeesPayment(exporterId: string, fees: {
    eudrComplianceFee: number;
    qualityControlFee: number;
    satelliteMonitoringFee: number;
    deforestationCertificateFee: number;
    certificateOfOriginFee: number;
    fumigationPhytosanitaryFee: number;
    goodPracticeCertificateFee: number;
    exportPermitFee: number;
    lacraRoyaltyFee: number;
  }) {
    const totalFees = Object.values(fees).reduce((sum, fee) => sum + fee, 0);

    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Fees Payment - ${exporterId}`,
      workflowType: "fees_payment",
      status: "pending_payment",
      priority: 1,
      farmerId: exporterId,
      currentStage: "payment_processing",
      totalStages: 14,
      workflowConfiguration: {
        fees: fees,
        totalAmount: totalFees,
        paymentMethod: "AgriTrace Platform",
        exportPermitSeparate: true,
        lacraRoyaltySeparate: true,
        paymentStatus: "pending"
      }
    }).returning();

    return workflow[0];
  }

  // Step 14: Report Release
  async releaseExportReports(exporterId: string, paymentConfirmed: boolean) {
    const workflow = await db.insert(agriTraceWorkflows).values({
      workflowName: `Report Release - ${exporterId}`,
      workflowType: "report_release",
      status: paymentConfirmed ? "completed" : "pending_payment",
      priority: 1,
      farmerId: exporterId,
      currentStage: "report_release",
      totalStages: 14,
      completedStages: 14,
      actualCompletion: paymentConfirmed ? new Date() : undefined,
      workflowConfiguration: {
        paymentConfirmed: paymentConfirmed,
        reportsAvailable: paymentConfirmed,
        readyForShipment: paymentConfirmed,
        internationalShipmentAuthorized: paymentConfirmed
      }
    }).returning();

    return workflow[0];
  }

  // Utility method to get workflow status
  async getWorkflowStatus(workflowId: number) {
    const workflow = await db.select()
      .from(agriTraceWorkflows)
      .where(eq(agriTraceWorkflows.id, workflowId));

    const stages = await db.select()
      .from(agriTraceStages)
      .where(eq(agriTraceStages.workflowId, workflowId));

    const events = await db.select()
      .from(agriTraceEvents)
      .where(eq(agriTraceEvents.workflowId, workflowId))
      .orderBy(desc(agriTraceEvents.eventTimestamp));

    return {
      workflow: workflow[0],
      stages,
      events
    };
  }
}

export const agriTraceService = new AgriTraceWorkflowService();