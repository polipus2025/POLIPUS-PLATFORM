import { db } from "./db";
import { paymentServices, paymentTransactions, revenueSplits } from "@shared/payment-schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export class PaymentService {
  // Initialize default payment services for AgriTrace360
  async initializePaymentServices() {
    const services = [
      {
        serviceName: "Export Permit",
        serviceType: "export_permit",
        basePrice: "150.00",
        lacraShare: "80.00",
        poliposShare: "20.00",
        description: "Official export permit for agricultural commodities"
      },
      {
        serviceName: "EUDR Compliance Certificate",
        serviceType: "certification",
        basePrice: "250.00",
        lacraShare: "60.00",
        poliposShare: "40.00",
        description: "EU Deforestation Regulation compliance certification"
      },
      {
        serviceName: "Farm License Renewal",
        serviceType: "license",
        basePrice: "100.00",
        lacraShare: "75.00",
        poliposShare: "25.00",
        description: "Annual farm operation license renewal"
      },
      {
        serviceName: "Inspection & Monitoring Service",
        serviceType: "monitoring",
        basePrice: "200.00",
        lacraShare: "50.00",
        poliposShare: "50.00",
        description: "Professional farm inspection and compliance monitoring"
      },
      {
        serviceName: "Commodity Traceability Certificate",
        serviceType: "certification",
        basePrice: "180.00",
        lacraShare: "65.00",
        poliposShare: "35.00",
        description: "Complete supply chain traceability certification"
      },
      {
        serviceName: "Organic Certification",
        serviceType: "certification",
        basePrice: "300.00",
        lacraShare: "55.00",
        poliposShare: "45.00",
        description: "Organic farming practices certification"
      },
      {
        serviceName: "Quality Assurance Certificate",
        serviceType: "certification",
        basePrice: "120.00",
        lacraShare: "70.00",
        poliposShare: "30.00",
        description: "Product quality and safety certification"
      },
      {
        serviceName: "Bulk Export License",
        serviceType: "export_permit",
        basePrice: "500.00",
        lacraShare: "85.00",
        poliposShare: "15.00",
        description: "Large-scale export operations license"
      }
    ];

    // Check if services already exist
    const existingServices = await db.select().from(paymentServices);
    if (existingServices.length === 0) {
      await db.insert(paymentServices).values(services);
      console.log("✅ Payment services initialized");
    }
  }

  // Get all available services
  async getPaymentServices() {
    return await db
      .select()
      .from(paymentServices)
      .where(eq(paymentServices.isActive, true))
      .orderBy(paymentServices.serviceName);
  }

  // Get service by ID
  async getPaymentService(id: number) {
    const [service] = await db
      .select()
      .from(paymentServices)
      .where(eq(paymentServices.id, id));
    return service;
  }

  // Create payment transaction
  async createPaymentTransaction(data: {
    userId: string;
    serviceId: number;
    customerEmail: string;
    customerName: string;
    paymentMetadata?: any;
  }) {
    const service = await this.getPaymentService(data.serviceId);
    if (!service) {
      throw new Error("Payment service not found");
    }

    const totalAmount = parseFloat(service.basePrice);
    const lacraAmount = (totalAmount * parseFloat(service.lacraShare)) / 100;
    const poliposAmount = (totalAmount * parseFloat(service.poliposShare)) / 100;

    const transactionId = `agri_${nanoid(12)}`;

    const [transaction] = await db
      .insert(paymentTransactions)
      .values({
        transactionId,
        userId: data.userId,
        serviceId: data.serviceId,
        totalAmount: totalAmount.toFixed(2),
        lacraAmount: lacraAmount.toFixed(2),
        poliposAmount: poliposAmount.toFixed(2),
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        paymentMetadata: data.paymentMetadata,
      })
      .returning();

    return transaction;
  }

  // Update transaction with Stripe data
  async updateTransactionWithStripe(
    transactionId: string,
    stripePaymentIntentId: string,
    paymentMethod: string,
    stripeMetadata?: any
  ) {
    const [transaction] = await db
      .update(paymentTransactions)
      .set({
        stripePaymentIntentId,
        paymentMethod,
        stripeMetadata,
        updatedAt: new Date(),
      })
      .where(eq(paymentTransactions.transactionId, transactionId))
      .returning();

    return transaction;
  }

  // Complete payment transaction
  async completePaymentTransaction(
    transactionId: string,
    stripeTransferIds?: { lacra: string; polipus: string }
  ) {
    const [transaction] = await db
      .update(paymentTransactions)
      .set({
        paymentStatus: "completed",
        completedAt: new Date(),
      })
      .where(eq(paymentTransactions.transactionId, transactionId))
      .returning();

    if (transaction && stripeTransferIds) {
      // Record revenue splits
      await db.insert(revenueSplits).values([
        {
          transactionId,
          recipientType: "lacra",
          amount: transaction.lacraAmount,
          stripeTransferId: stripeTransferIds.lacra,
          transferStatus: "completed",
          transferredAt: new Date(),
        },
        {
          transactionId,
          recipientType: "polipus",
          amount: transaction.poliposAmount,
          stripeTransferId: stripeTransferIds.polipus,
          transferStatus: "completed",
          transferredAt: new Date(),
        },
      ]);
    }

    return transaction;
  }

  // Get user's payment history
  async getUserPaymentHistory(userId: string) {
    return await db
      .select({
        transaction: paymentTransactions,
        service: paymentServices,
      })
      .from(paymentTransactions)
      .leftJoin(paymentServices, eq(paymentTransactions.serviceId, paymentServices.id))
      .where(eq(paymentTransactions.userId, userId))
      .orderBy(desc(paymentTransactions.createdAt));
  }

  // Get revenue analytics
  async getRevenueAnalytics(startDate?: Date, endDate?: Date) {
    let query = db
      .select({
        totalRevenue: paymentTransactions.totalAmount,
        lacraRevenue: paymentTransactions.lacraAmount,
        poliposRevenue: paymentTransactions.poliposAmount,
        serviceType: paymentServices.serviceType,
        paymentStatus: paymentTransactions.paymentStatus,
        createdAt: paymentTransactions.createdAt,
      })
      .from(paymentTransactions)
      .leftJoin(paymentServices, eq(paymentTransactions.serviceId, paymentServices.id));

    if (startDate) {
      query = query.where(and(
        eq(paymentTransactions.paymentStatus, "completed"),
        // Add date filtering here if needed
      ));
    }

    return await query.orderBy(desc(paymentTransactions.createdAt));
  }

  // Process Stripe payment for warehouse storage fees
  async processStripePayment(paymentIntentId: string, expectedAmount: number) {
    try {
      // For now, we'll simulate Stripe payment processing
      // In a real implementation, you would integrate with Stripe API
      console.log(`Processing Stripe payment: ${paymentIntentId} for $${expectedAmount}`);
      
      // Simulate successful payment (replace with actual Stripe integration)
      return {
        success: true,
        paymentIntentId,
        amount: expectedAmount,
        status: 'succeeded'
      };
    } catch (error) {
      console.error('Stripe payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown payment error'
      };
    }
  }
}

export const paymentService = new PaymentService();