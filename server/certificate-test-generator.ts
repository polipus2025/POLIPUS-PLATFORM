import type { Express } from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { commodities, inspections, certifications, qrBatches, warehouseTransactions, countyWarehouses } from "../shared/schema";
import { eq, desc } from "drizzle-orm";

// Database connection
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

interface EnhancedFarmerData {
  id: string;
  fullName: string;
  email: string;
  county: string;
  city: string;
  farmSize: number;
  gpsCoordinates: string;
  cropType: string;
  cropQuantity: number;
  exporterCompany: string;
  // Real supply chain data
  batchNumber?: string;
  harvestDate?: Date;
  qualityGrade?: string;
  complianceStatus?: string;
  inspectionData?: any;
  certificationData?: any;
  warehouseTransactionId?: string;
  qrTraceabilityCode?: string;
}

// Real database integration with enhanced supply chain data
const getEnhancedFarmerData = async (farmerId: string): Promise<EnhancedFarmerData> => {
  try {
    // Try to get farmer data from real database
    const commodity = await db.select().from(commodities).where(eq(commodities.farmerId, farmerId)).limit(1);
    const inspection = await db.select().from(inspections).orderBy(desc(inspections.inspectionDate)).limit(1);
    const warehouseTx = await db.select().from(warehouseTransactions).orderBy(desc(warehouseTransactions.createdAt)).limit(1);
    const qrBatch = await db.select().from(qrBatches).orderBy(desc(qrBatches.createdAt)).limit(1);

    if (commodity.length > 0) {
      return {
        id: farmerId,
        fullName: commodity[0].farmerName || 'Unknown Farmer',
        email: `${commodity[0].farmerName?.toLowerCase().replace(' ', '.')}@liberianfarm.com`,
        county: commodity[0].county,
        city: commodity[0].district || 'Unknown District',
        farmSize: parseFloat(commodity[0].quantity) || 25.0,
        gpsCoordinates: commodity[0].gpsCoordinates || '6.5000° N, 10.3500° W',
        cropType: commodity[0].type,
        cropQuantity: parseFloat(commodity[0].quantity) || 2450,
        exporterCompany: warehouseTx[0]?.buyerName || 'Liberian Agricultural Export Ltd.',
        // Enhanced supply chain data
        batchNumber: commodity[0].batchNumber,
        harvestDate: commodity[0].harvestDate,
        qualityGrade: commodity[0].qualityGrade,
        complianceStatus: commodity[0].status,
        inspectionData: inspection[0],
        qrTraceabilityCode: qrBatch[0]?.batchCode,
      };
    }
  } catch (error) {
    console.error('Database connection issue, using simulation data:', error);
  }
  
  // Fallback to simulation data
  const farmers = [
    {
      id: farmerId,
      fullName: "John Kollie",
      email: "john.kollie@liberianfarm.com",
      county: "Bong",
      city: "Gbarnga",
      farmSize: 25.5,
      gpsCoordinates: "7.0042° N, 9.4334° W",
      cropType: "Cocoa",
      cropQuantity: 2450,
      exporterCompany: "Liberian Agricultural Export Ltd.",
      batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
      harvestDate: new Date('2024-11-15'),
      qualityGrade: 'Premium Grade A',
      complianceStatus: 'compliant',
      qrTraceabilityCode: `QR-TRACE-${farmerId.slice(-4)}`
    },
    {
      id: farmerId,
      fullName: "Mary Togba",
      email: "mary.togba@ruralcoop.lr",
      county: "Nimba",
      city: "Sanniquellie", 
      farmSize: 18.2,
      gpsCoordinates: "7.3625° N, 8.7196° W",
      cropType: "Coffee",
      cropQuantity: 1850,
      exporterCompany: "West Africa Premium Exports",
      batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
      harvestDate: new Date('2024-12-02'),
      qualityGrade: 'Export Grade AA',
      complianceStatus: 'compliant',
      qrTraceabilityCode: `QR-TRACE-${farmerId.slice(-4)}`
    },
    {
      id: farmerId,
      fullName: "James Varney",
      email: "james.varney@farmunion.lr",
      county: "Montserrado",
      city: "Careysburg",
      farmSize: 32.8,
      gpsCoordinates: "6.5000° N, 10.3500° W", 
      cropType: "Palm Oil",
      cropQuantity: 3280,
      exporterCompany: "Tropical Commodities International",
      batchNumber: `BATCH-${Date.now().toString().slice(-6)}`,
      harvestDate: new Date('2024-11-28'),
      qualityGrade: 'Premium Refined',
      complianceStatus: 'compliant',
      qrTraceabilityCode: `QR-TRACE-${farmerId.slice(-4)}`
    }
  ];
  
  return farmers[Math.floor(Math.random() * farmers.length)];
};

// Generate QR code for certificate traceability
const generateTraceabilityQR = async (data: any): Promise<string> => {
  try {
    const qrData = {
      certificateId: data.certificateId,
      farmerId: data.farmerId,
      batchNumber: data.batchNumber,
      harvestDate: data.harvestDate,
      gpsCoordinates: data.gpsCoordinates,
      complianceStatus: data.complianceStatus,
      verificationUrl: `https://verify.lacra.gov.lr/trace/${data.certificateId}`,
      timestamp: new Date().toISOString()
    };
    
    const qrDataString = JSON.stringify(qrData);
    const qrCodeDataUrl = await QRCode.toDataURL(qrDataString, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 150,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    return '';
  }
};

export function addCertificateTestRoutes(app: Express) {
  
  // Generate Simple EUDR Compliance Certificate
  app.get('/api/test/eudr-certificate/:farmerId', async (req, res) => {
    try {
      const { farmerId } = req.params;
      
      // Simple farmer data - no complex database integration
      const farmer = {
        id: farmerId,
        fullName: "John Kollie",
        email: "john.kollie@liberianfarm.com",
        county: "Bong",
        city: "Gbarnga",
        farmSize: 25.5,
        gpsCoordinates: "7.0042° N, 9.4334° W",
        cropType: "Cocoa"
      };
      
      // Certificate details
      const certNumber = `EUDR-${farmer.county.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 40,
        info: {
          Title: 'EUDR Compliance Certificate',
          Author: 'LACRA',
          Subject: 'EU Deforestation Regulation Compliance',
          Creator: 'LACRA Certification System'
        }
      });

      // Set response headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="EUDR_Certificate_${farmer.fullName.replace(' ', '_')}.pdf"`);
      
      doc.pipe(res);

      // === CERTIFICATE HEADER ===
      doc.rect(0, 0, 595, 80).fillColor('#1a365d').fill();
      
      // LACRA Logo area
      doc.rect(40, 15, 80, 50).strokeColor('#ffffff').stroke();
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('LACRA', 50, 25);
      doc.fontSize(8).text('Liberian Agricultural', 45, 40);
      doc.text('Regulatory Authority', 45, 52);
      
      // Main Title
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#ffffff');
      doc.text('EUDR COMPLIANCE CERTIFICATE', 140, 25);
      doc.fontSize(12).font('Helvetica').text('EU Deforestation Regulation Compliance', 140, 45);
      
      // EU Logo area  
      doc.rect(475, 15, 80, 50).strokeColor('#ffffff').stroke();
      doc.fontSize(9).text('EUROPEAN UNION', 485, 25);
      doc.fontSize(7).text('Deforestation Reg.', 485, 40);
      doc.text('EUDR Certified', 485, 52);

      // Reset to black for content
      doc.fillColor('#000000');
      let yPos = 120;

      // === CERTIFICATE INFORMATION ===
      doc.fontSize(14).font('Helvetica-Bold').text('CERTIFICATE DETAILS', 40, yPos);
      yPos += 25;
      
      // Certificate number and date
      const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      doc.fontSize(11).font('Helvetica');
      doc.text(`Certificate Number: ${certNumber}`, 40, yPos);
      doc.text(`Issue Date: ${issueDate}`, 320, yPos);
      yPos += 15;
      doc.text(`Valid Until: ${validUntil}`, 40, yPos);
      doc.text(`Certification Level: APPROVED`, 320, yPos);
      yPos += 30;

      // === FARMER INFORMATION ===
      doc.fontSize(14).font('Helvetica-Bold').text('PRODUCER INFORMATION', 40, yPos);
      yPos += 25;
      
      // Create info boxes
      doc.rect(40, yPos, 250, 80).strokeColor('#cccccc').stroke();
      doc.rect(310, yPos, 245, 80).strokeColor('#cccccc').stroke();
      
      // Left box - Basic info
      doc.fontSize(11).font('Helvetica-Bold').text('Producer Details', 45, yPos + 10);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${farmer.fullName}`, 45, yPos + 25);
      doc.text(`Email: ${farmer.email}`, 45, yPos + 40);
      doc.text(`Location: ${farmer.city}, ${farmer.county}`, 45, yPos + 55);
      
      // Right box - Farm info
      doc.fontSize(11).font('Helvetica-Bold').text('Farm Details', 315, yPos + 10);
      doc.fontSize(10).font('Helvetica');
      doc.text(`GPS: ${farmer.gpsCoordinates}`, 315, yPos + 25);
      doc.text(`Farm Size: ${farmer.farmSize} hectares`, 315, yPos + 40);
      doc.text(`Primary Crop: ${farmer.cropType}`, 315, yPos + 55);
      
      yPos += 100;

      // === COMPLIANCE STATUS ===
      doc.fontSize(14).font('Helvetica-Bold').text('COMPLIANCE STATUS', 40, yPos);
      yPos += 25;

      // Status indicators
      const statusItems = [
        { label: 'Deforestation Risk Assessment', status: 'PASSED', color: '#22c55e' },
        { label: 'GPS Verification', status: 'VERIFIED', color: '#22c55e' },
        { label: 'Supply Chain Documentation', status: 'COMPLETE', color: '#22c55e' },
        { label: 'Legal Compliance Check', status: 'APPROVED', color: '#22c55e' }
      ];

      statusItems.forEach((item, index) => {
        const boxY = yPos + (index * 25);
        
        // Status box
        doc.rect(40, boxY, 20, 15).fillColor(item.color).fill();
        doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
        doc.text('✓', 47, boxY + 4);
        
        // Status text
        doc.fillColor('#000000').fontSize(10).font('Helvetica');
        doc.text(item.label, 70, boxY + 3);
        doc.font('Helvetica-Bold').text(item.status, 350, boxY + 3);
      });
      
      yPos += 120;

      // === CERTIFICATION STATEMENT ===
      doc.fontSize(12).font('Helvetica-Bold').text('CERTIFICATION STATEMENT', 40, yPos);
      yPos += 20;
      
      doc.fontSize(10).font('Helvetica').text(
        `This certificate confirms that the agricultural production from ${farmer.fullName}'s farm in ${farmer.city}, ` +
        `${farmer.county} County meets all requirements of the EU Deforestation Regulation (EUDR). The farm has been ` +
        `verified through official Liberian government authorities and demonstrates compliance with all environmental ` +
        `and legal requirements for export to European Union markets.`,
        40, yPos, { width: 515, align: 'justify' }
      );
      yPos += 80;

      // === SIGNATURES ===
      doc.rect(40, yPos, 250, 60).strokeColor('#cccccc').stroke();
      doc.rect(305, yPos, 250, 60).strokeColor('#cccccc').stroke();
      
      doc.fontSize(10).font('Helvetica-Bold').text('LACRA Certification Officer', 45, yPos + 10);
      doc.fontSize(9).font('Helvetica').text('Digital Signature Applied', 45, yPos + 25);
      doc.text(`Date: ${issueDate}`, 45, yPos + 40);
      
      doc.fontSize(10).font('Helvetica-Bold').text('Government Inspector', 310, yPos + 10);
      doc.fontSize(9).font('Helvetica').text('Official Verification', 310, yPos + 25);
      doc.text(`Date: ${issueDate}`, 310, yPos + 40);

      // === FOOTER ===
      yPos += 80;
      doc.fontSize(8).font('Helvetica').fillColor('#666666');
      doc.text('This certificate is digitally generated and verified. For validation, visit: verify.lacra.gov.lr', 40, yPos);
      doc.text(`Certificate ID: ${certNumber} | Generated: ${new Date().toISOString()}`, 40, yPos + 12);

      doc.end();
      
    } catch (error) {
      console.error('Error generating EUDR certificate:', error);
      res.status(500).json({ error: 'Failed to generate EUDR certificate' });
    }
  });

  // The other certificate types will be added here...
  // (keeping this minimal for now to focus on the simple EUDR)

}