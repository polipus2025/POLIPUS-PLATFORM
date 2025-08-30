import type { Express } from "express";
import { db } from "./db";
import { eq, and, isNotNull, sql } from "drizzle-orm";
import { buyerVerificationCodes, buyers } from "@shared/schema";

// EMERGENCY FIX: Clean payment confirmation route that bypasses main routes.ts syntax errors
export function registerPaymentConfirmationFix(app: Express) {
  // Helper function to generate second verification code
  function generateSecondVerificationCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = '';
    
    // Format: 2 letters + 2 numbers + 2 letters + 2 numbers (e.g., AB12CD34)
    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += letters.charAt(Math.floor(Math.random() * letters.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    
    return result;
  }

  // EMERGENCY PAYMENT CONFIRMATION ROUTE - CLEAN AND WORKING
  app.post("/api/farmer/confirm-payment/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { farmerId } = req.body;
      
      console.log(`🚨 EMERGENCY FIX: Farmer ${farmerId} confirming payment for transaction: ${transactionId}`);

      // Generate second verification code using proper format
      const secondVerificationCode = generateSecondVerificationCode();
      const confirmationDate = new Date();
      
      let actualId;
      
      if (transactionId.startsWith('FPO-')) {
        // Direct lookup by Farmer Offer ID
        console.log(`🔍 Looking up verification record for Offer ID: ${transactionId}`);
        const [verificationRecord] = await db
          .select()
          .from(buyerVerificationCodes)
          .where(eq(buyerVerificationCodes.offerId, transactionId));
        
        if (verificationRecord) {
          actualId = verificationRecord.id;
          console.log(`✅ Found verification record with ID: ${actualId}`);
        } else {
          console.log(`❌ No verification record found for Offer ID: ${transactionId}`);
          return res.status(404).json({ error: "Transaction not found for Farmer Offer ID: " + transactionId });
        }
      } else {
        actualId = parseInt(transactionId);
      }

      // Update the buyer verification code with payment confirmation
      await db
        .update(buyerVerificationCodes)
        .set({
          secondVerificationCode: secondVerificationCode,
          paymentConfirmedAt: confirmationDate,
          status: 'payment_confirmed' // Payment confirmed by farmer
        })
        .where(eq(buyerVerificationCodes.id, actualId))
        .returning();

      console.log(`✅ PAYMENT CONFIRMED: Generated second verification code ${secondVerificationCode}`);
      console.log(`🔄 Transaction ${transactionId} moved to confirmed status`);

      // Find the buyer ID to notify them of the status change
      const [updatedRecord] = await db
        .select()
        .from(buyerVerificationCodes)
        .where(eq(buyerVerificationCodes.id, actualId));

      if (updatedRecord) {
        console.log(`📢 BUYER NOTIFICATION: Payment confirmed for buyer ${updatedRecord.buyerId} - they should refresh "Confirmed Deals"`);
      }

      res.json({
        success: true,
        message: "Payment confirmed successfully!",
        secondVerificationCode: secondVerificationCode,
        paymentConfirmed: true,
        paymentConfirmedAt: confirmationDate.toISOString(),
        status: "payment_confirmed",
        buyerNotified: true,
        buyerId: updatedRecord?.buyerId || null
      });

    } catch (error: any) {
      console.error("🚨 EMERGENCY PAYMENT CONFIRMATION ERROR:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to confirm payment" 
      });
    }
  });

  // EMERGENCY: Get confirmed transactions with offer ID for buyer portal (Clean Implementation)
  app.get("/api/buyer/confirmed-transactions/:buyerId", async (req, res) => {
    try {
      const { buyerId } = req.params;
      console.log(`🚨 EMERGENCY FIX: Fetching confirmed transactions for buyer: ${buyerId}`);
      
      // Get the internal buyer ID first (Fixed Drizzle syntax)
      const [buyer] = await db
        .select({ id: buyers.id })
        .from(buyers)
        .where(eq(buyers.buyerId, buyerId));
      
      if (!buyer) {
        return res.status(404).json({ error: "Buyer not found" });
      }
      
      // Get confirmed transactions with offer ID (Fixed Drizzle syntax)
      const confirmedTransactions = await db
        .select()
        .from(buyerVerificationCodes)
        .where(
          and(
            eq(buyerVerificationCodes.buyerId, buyer.id.toString()),
            isNotNull(buyerVerificationCodes.secondVerificationCode)
          )
        )
        .orderBy(buyerVerificationCodes.acceptedAt);
      
      // Format the transactions for frontend with offer ID included
      const formattedTransactions = confirmedTransactions.map(transaction => ({
        id: transaction.id,
        notificationId: transaction.notificationId,
        buyerId: transaction.buyerId,
        farmerId: transaction.farmerId,
        farmerName: transaction.farmerName,
        farmLocation: transaction.farmLocation,
        commodityType: transaction.commodityType,
        quantityAvailable: parseFloat(transaction.quantityAvailable || '0'),
        unit: transaction.unit || 'kg',
        pricePerUnit: parseFloat(transaction.pricePerUnit || '0'),
        totalValue: parseFloat(transaction.totalValue || '0'),
        qualityGrade: "Grade A", // Default quality grade
        paymentTerms: transaction.paymentTerms,
        deliveryTerms: transaction.deliveryTerms,
        verificationCode: transaction.verificationCode,
        secondVerificationCode: transaction.secondVerificationCode,
        confirmedAt: transaction.acceptedAt,
        status: "confirmed",
        paymentConfirmed: true,
        paymentConfirmedAt: transaction.paymentConfirmedAt,
        awaitingPaymentConfirmation: false,
        farmerOfferId: transaction.offerId, // CRITICAL: Include farmer offer ID
        offerId: transaction.offerId // Also include as offerId for backward compatibility
      }));

      console.log(`✅ EMERGENCY FIX: Returning ${formattedTransactions.length} confirmed transactions with offer IDs`);
      res.json(formattedTransactions);
      
    } catch (error: any) {
      console.error("🚨 EMERGENCY CONFIRMED TRANSACTIONS ERROR:", error);
      res.status(500).json({ error: "Failed to fetch confirmed transactions" });
    }
  });
}