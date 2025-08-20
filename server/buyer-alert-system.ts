import type { Express } from "express";

// Regional Buyer Alert System for Farmer Harvest Notifications
export interface RegionalBuyer {
  id: string;
  buyerId: string;
  buyerName: string;
  company: string;
  phoneNumber: string;
  email: string;
  county: string;
  district: string;
  specializations: string[]; // Crops they deal with
  radius: number; // Operating radius in km
  isActive: boolean;
  preferredContactMethod: 'sms' | 'email' | 'platform';
  registrationDate: string;
}

export interface HarvestAlert {
  id: string;
  alertId: string;
  farmerId: string;
  farmerName: string;
  scheduleId: string;
  cropType: string;
  cropVariety: string;
  quantity: number;
  expectedPrice: number;
  harvestDate: string;
  farmerLocation: {
    county: string;
    district: string;
    coordinates: { lat: number; lng: number };
  };
  targetBuyers: string[]; // Buyer IDs to notify
  alertStatus: 'pending' | 'sent' | 'responded';
  smssSent: number;
  emailsSent: number;
  platformNotificationsSent: number;
  buyerResponses: number;
  createdAt: string;
  expiresAt: string;
}

export interface FarmerBuyerMessage {
  id: string;
  messageId: string;
  farmerId: string;
  buyerId: string;
  scheduleId: string;
  transactionId?: string;
  messageType: 'inquiry' | 'negotiation' | 'agreement' | 'system';
  sender: 'farmer' | 'buyer' | 'system';
  subject: string;
  message: string;
  attachments?: string[];
  proposedPrice?: number;
  proposedQuantity?: number;
  proposedTerms?: string;
  isRead: boolean;
  sentAt: string;
  readAt?: string;
}

export interface TransactionProposal {
  id: string;
  proposalId: string;
  farmerId: string;
  buyerId: string;
  scheduleId: string;
  cropType: string;
  proposedQuantity: number;
  proposedPrice: number;
  proposedTotalAmount: number;
  paymentTerms: string;
  deliveryTerms: string;
  proposedDeliveryDate: string;
  farmerApproval: 'pending' | 'approved' | 'rejected' | 'counter_proposed';
  buyerApproval: 'pending' | 'approved' | 'rejected' | 'counter_proposed';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'transaction_created';
  uniqueTransactionCode?: string;
  ddgotsNotified: boolean;
  createdAt: string;
  approvedAt?: string;
}

export class BuyerAlertService {
  
  // Find regional buyers based on farmer location and crop type
  async findRegionalBuyers(farmerLocation: any, cropType: string, radius: number = 50): Promise<RegionalBuyer[]> {
    // Test regional buyers for demo
    return [
      {
        id: "1",
        buyerId: "BUY-12345",
        buyerName: "Samuel Johnson",
        company: "Nimba Agricultural Cooperative",
        phoneNumber: "+231-777-123-456",
        email: "samuel.johnson@nimbacoop.lr",
        county: "Nimba",
        district: "Sanniquellie",
        specializations: ["Cocoa", "Coffee", "Rice"],
        radius: 75,
        isActive: true,
        preferredContactMethod: "sms",
        registrationDate: "2024-01-15T00:00:00Z"
      },
      {
        id: "2",
        buyerId: "BUY-67890",
        buyerName: "Mary Williams",
        company: "West African Commodities",
        phoneNumber: "+231-888-987-654",
        email: "mary.williams@wacomm.lr",
        county: "Bong",
        district: "Gbarnga",
        specializations: ["Cocoa", "Palm Oil"],
        radius: 100,
        isActive: true,
        preferredContactMethod: "platform",
        registrationDate: "2024-02-20T00:00:00Z"
      },
      {
        id: "3",
        buyerId: "BUY-11111",
        buyerName: "David Cole",
        company: "Premium Cocoa Buyers",
        phoneNumber: "+231-555-111-222",
        email: "david.cole@premiumcocoa.lr",
        county: "Lofa",
        district: "Voinjama",
        specializations: ["Cocoa"],
        radius: 60,
        isActive: true,
        preferredContactMethod: "email",
        registrationDate: "2024-03-10T00:00:00Z"
      }
    ];
  }

  // Send SMS alert to buyers
  async sendSMSAlert(buyer: RegionalBuyer, harvestAlert: HarvestAlert): Promise<boolean> {
    const message = `🌾 AGRITRACE ALERT: Farmer ${harvestAlert.farmerName} has ${harvestAlert.quantity}kg ${harvestAlert.cropType} ready for harvest in ${harvestAlert.farmerLocation.county}. Expected price: $${harvestAlert.expectedPrice}/kg. Login to AgriTrace to view details and negotiate. Alert ID: ${harvestAlert.alertId}`;
    
    console.log(`📱 SMS sent to ${buyer.buyerName} (${buyer.phoneNumber}): ${message}`);
    
    // TODO: Integrate with SMS service (Twilio, etc.)
    return true;
  }

  // Create harvest alert for regional buyers
  async createHarvestAlert(farmerId: string, scheduleId: string, harvestData: any): Promise<HarvestAlert> {
    const alertId = `ALT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const harvestAlert: HarvestAlert = {
      id: alertId,
      alertId,
      farmerId,
      farmerName: harvestData.farmerName,
      scheduleId,
      cropType: harvestData.cropType,
      cropVariety: harvestData.cropVariety,
      quantity: harvestData.quantity,
      expectedPrice: harvestData.expectedPrice,
      harvestDate: harvestData.harvestDate,
      farmerLocation: harvestData.farmerLocation,
      targetBuyers: [],
      alertStatus: 'pending',
      smssSent: 0,
      emailsSent: 0,
      platformNotificationsSent: 0,
      buyerResponses: 0,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };

    // Find regional buyers
    const regionalBuyers = await this.findRegionalBuyers(
      harvestData.farmerLocation, 
      harvestData.cropType
    );

    // Filter buyers who deal with this crop type
    const targetBuyers = regionalBuyers.filter(buyer => 
      buyer.specializations.includes(harvestData.cropType) && buyer.isActive
    );

    harvestAlert.targetBuyers = targetBuyers.map(buyer => buyer.buyerId);

    // Send notifications based on buyer preferences
    for (const buyer of targetBuyers) {
      if (buyer.preferredContactMethod === 'sms') {
        await this.sendSMSAlert(buyer, harvestAlert);
        harvestAlert.smssSent++;
      } else if (buyer.preferredContactMethod === 'email') {
        // TODO: Send email alert
        harvestAlert.emailsSent++;
      }
      
      // Always send platform notification
      harvestAlert.platformNotificationsSent++;
    }

    harvestAlert.alertStatus = 'sent';
    
    console.log(`🚨 Harvest Alert Created: ${alertId} - Notified ${targetBuyers.length} buyers`);
    
    return harvestAlert;
  }

  // Generate unique transaction code
  generateTransactionCode(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN-${timestamp}-${random}`;
  }

  // Create transaction proposal
  async createTransactionProposal(proposalData: any): Promise<TransactionProposal> {
    const proposalId = `PROP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const proposal: TransactionProposal = {
      id: proposalId,
      proposalId,
      farmerId: proposalData.farmerId,
      buyerId: proposalData.buyerId,
      scheduleId: proposalData.scheduleId,
      cropType: proposalData.cropType,
      proposedQuantity: proposalData.quantity,
      proposedPrice: proposalData.pricePerKg,
      proposedTotalAmount: proposalData.quantity * proposalData.pricePerKg,
      paymentTerms: proposalData.paymentTerms,
      deliveryTerms: proposalData.deliveryTerms,
      proposedDeliveryDate: proposalData.deliveryDate,
      farmerApproval: 'pending',
      buyerApproval: 'pending',
      status: 'pending',
      ddgotsNotified: false,
      createdAt: new Date().toISOString()
    };

    return proposal;
  }

  // Approve proposal and create transaction
  async approveProposal(proposalId: string, approverType: 'farmer' | 'buyer'): Promise<TransactionProposal> {
    // TODO: Fetch proposal from database
    console.log(`✅ Proposal ${proposalId} approved by ${approverType}`);
    
    const proposal: TransactionProposal = {
      id: proposalId,
      proposalId,
      farmerId: "FARMER-TEST-2025",
      buyerId: "BUY-12345",
      scheduleId: "SCH-TEST-001",
      cropType: "Cocoa",
      proposedQuantity: 600,
      proposedPrice: 2.60,
      proposedTotalAmount: 1560,
      paymentTerms: "50% advance, 50% on delivery",
      deliveryTerms: "Farm pickup",
      proposedDeliveryDate: "2025-10-15",
      farmerApproval: approverType === 'farmer' ? 'approved' : 'pending',
      buyerApproval: approverType === 'buyer' ? 'approved' : 'pending',
      status: 'pending',
      ddgotsNotified: false,
      createdAt: new Date().toISOString()
    };

    // Check if both parties approved
    if (proposal.farmerApproval === 'approved' && proposal.buyerApproval === 'approved') {
      // Generate unique transaction code
      proposal.uniqueTransactionCode = this.generateTransactionCode();
      proposal.status = 'approved';
      proposal.approvedAt = new Date().toISOString();
      
      // Notify DDGOTS
      await this.notifyDDGOTS(proposal);
      proposal.ddgotsNotified = true;
      
      console.log(`🎉 Transaction Approved! Code: ${proposal.uniqueTransactionCode}`);
    }

    return proposal;
  }

  // Notify DDGOTS about approved transaction
  async notifyDDGOTS(proposal: TransactionProposal): Promise<void> {
    const notification = {
      type: 'transaction_approved',
      transactionCode: proposal.uniqueTransactionCode,
      farmerId: proposal.farmerId,
      buyerId: proposal.buyerId,
      cropType: proposal.cropType,
      quantity: proposal.proposedQuantity,
      totalAmount: proposal.proposedTotalAmount,
      approvedAt: proposal.approvedAt,
      requiresOversight: proposal.proposedTotalAmount > 5000 // High-value transactions
    };

    console.log(`📋 DDGOTS Notification Sent:`, notification);
    
    // TODO: Send to DDGOTS dashboard/notification system
    // This could be an email, internal notification, or database entry
  }
}

export const buyerAlertService = new BuyerAlertService();