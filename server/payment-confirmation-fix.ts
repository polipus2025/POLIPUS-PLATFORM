import type { Express } from "express";
import { db } from "./db";
import { eq, and, isNotNull } from "drizzle-orm";
import { buyerVerificationCodes } from "@shared/schema";

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

      res.json({
        success: true,
        message: "Payment confirmed successfully!",
        secondVerificationCode: secondVerificationCode,
        paymentConfirmed: true,
        paymentConfirmedAt: confirmationDate.toISOString(),
        status: "payment_confirmed"
      });

    } catch (error: any) {
      console.error("🚨 EMERGENCY PAYMENT CONFIRMATION ERROR:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to confirm payment" 
      });
    }
  });
}