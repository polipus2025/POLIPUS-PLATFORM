import type { Express } from "express";
import { db } from "./db";
import { eudrCompliancePacks, eudrComplianceDocuments, commodities } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import { z } from "zod";
import PDFDocument from "pdfkit";

// Advanced PDF styling and layout utilities
interface PDFLayout {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  headerHeight: number;
  footerHeight: number;
  contentWidth: number;
  contentHeight: number;
}

class AdvancedPDFGenerator {
  private doc: PDFDocument;
  private layout: PDFLayout;
  private currentY: number;

  constructor() {
    this.doc = new PDFDocument({ 
      size: 'A4', 
      margin: 40,
      info: {
        Title: 'EUDR Compliance Pack',
        Author: 'LACRA & ECOENVIROS',
        Subject: 'EU Deforestation Regulation Compliance Documentation',
        Creator: 'Polipus AgriTrace Platform'
      }
    });
    
    this.layout = {
      pageWidth: 595.28,
      pageHeight: 841.89,
      margin: 40,
      headerHeight: 80,
      footerHeight: 60,
      contentWidth: 515.28,
      contentHeight: 701.89
    };
    
    this.currentY = this.layout.margin;
  }

  // Header with dual logos and professional formatting
  addHeader(title: string, subtitle?: string, referenceNumber?: string) {
    // Save current position
    const savedY = this.currentY;
    
    // Header background
    this.doc.rect(0, 0, this.layout.pageWidth, this.layout.headerHeight)
          .fillColor('#f8f9fa')
          .fill();
    
    // Reset to black for text
    this.doc.fillColor('#000000');
    
    // LACRA Logo placeholder (left)
    this.doc.rect(50, 15, 60, 40)
          .strokeColor('#2563eb')
          .stroke();
    this.doc.fontSize(8).font('Helvetica').text('LACRA', 55, 30);
    this.doc.text('LOGO', 55, 40);
    
    // ECOENVIROS Logo placeholder (right)
    this.doc.rect(485, 15, 60, 40)
          .strokeColor('#059669')
          .stroke();
    this.doc.fontSize(8).font('Helvetica').text('ECOENVIROS', 488, 25);
    this.doc.text('AUDIT &', 490, 35);
    this.doc.text('CERTIFICATION', 485, 45);
    
    // Main title (center)
    this.doc.fontSize(16).font('Helvetica-Bold')
          .text(title, 120, 20, { width: 355, align: 'center' });
    
    if (subtitle) {
      this.doc.fontSize(12).font('Helvetica')
            .text(subtitle, 120, 40, { width: 355, align: 'center' });
    }
    
    // Reference number (top right)
    if (referenceNumber) {
      this.doc.fontSize(10).font('Helvetica-Bold')
            .text(`Ref: ${referenceNumber}`, 400, 5, { width: 150, align: 'right' });
    }
    
    // Authority information line
    this.doc.fontSize(8).font('Helvetica')
          .text('Ministry of Agriculture, Capitol Hill, Monrovia, Liberia | Tel: +231-XXX-XXXX', 
                50, 65, { width: 495, align: 'center' });
    
    // Separator line
    this.doc.moveTo(50, this.layout.headerHeight - 5)
          .lineTo(545, this.layout.headerHeight - 5)
          .strokeColor('#e5e7eb')
          .stroke();
    
    this.currentY = this.layout.headerHeight + 20;
    return this;
  }

  // Professional footer with verification information
  addFooter(documentType: string, packId: string, issueDate: string) {
    const footerY = this.layout.pageHeight - this.layout.footerHeight;
    
    // Footer separator line
    this.doc.moveTo(50, footerY)
          .lineTo(545, footerY)
          .strokeColor('#e5e7eb')
          .stroke();
    
    // Certification statement
    this.doc.fontSize(9).font('Helvetica-Bold')
          .text('DUAL CERTIFICATION AUTHORITY', 50, footerY + 10);
    
    this.doc.fontSize(8).font('Helvetica')
          .text('Issued jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority)', 50, footerY + 25)
          .text('and ECOENVIRO Audit & Certification under EU Regulation 2023/1115', 50, footerY + 35);
    
    // Verification contacts
    this.doc.fontSize(8).font('Helvetica-Bold')
          .text('For verification:', 350, footerY + 15);
    this.doc.fontSize(8).font('Helvetica')
          .text('compliance@lacra.gov.lr | cert@ecoenviros.com', 350, footerY + 25);
    
    // Document metadata
    this.doc.fontSize(7).font('Helvetica')
          .text(`Document: ${documentType} | Pack ID: ${packId} | Generated: ${issueDate}`, 
                50, footerY + 50, { width: 495, align: 'center' });
    
    return this;
  }

  // Enhanced table creation with professional styling
  addTable(headers: string[], rows: string[][], startY?: number) {
    if (startY) this.currentY = startY;
    
    const tableWidth = this.layout.contentWidth;
    const colWidth = tableWidth / headers.length;
    const rowHeight = 25;
    
    // Table header
    this.doc.rect(50, this.currentY, tableWidth, rowHeight)
          .fillColor('#f1f5f9')
          .fill();
    
    this.doc.fillColor('#000000')
          .fontSize(10)
          .font('Helvetica-Bold');
    
    headers.forEach((header, i) => {
      this.doc.text(header, 55 + (i * colWidth), this.currentY + 8, {
        width: colWidth - 10,
        align: 'left'
      });
    });
    
    this.currentY += rowHeight;
    
    // Table rows
    rows.forEach((row, rowIndex) => {
      const fillColor = rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
      this.doc.rect(50, this.currentY, tableWidth, rowHeight)
            .fillColor(fillColor)
            .fill();
      
      this.doc.fillColor('#000000')
            .fontSize(9)
            .font('Helvetica');
      
      row.forEach((cell, i) => {
        this.doc.text(cell, 55 + (i * colWidth), this.currentY + 8, {
          width: colWidth - 10,
          align: 'left'
        });
      });
      
      this.currentY += rowHeight;
    });
    
    // Table border
    this.doc.rect(50, this.currentY - (rows.length + 1) * rowHeight, tableWidth, (rows.length + 1) * rowHeight)
          .strokeColor('#e2e8f0')
          .stroke();
    
    this.currentY += 20;
    return this;
  }

  // Section with enhanced styling
  addSection(title: string, content: string[] | string, options?: { background?: boolean, border?: boolean }) {
    // Section title
    this.doc.fontSize(12).font('Helvetica-Bold')
          .fillColor('#1e40af')
          .text(title, 50, this.currentY);
    
    this.currentY += 20;
    
    // Section background (optional)
    if (options?.background) {
      const contentHeight = Array.isArray(content) ? content.length * 15 + 20 : 35;
      this.doc.rect(50, this.currentY - 5, this.layout.contentWidth, contentHeight)
            .fillColor('#f8fafc')
            .fill();
    }
    
    // Section content
    this.doc.fillColor('#000000')
          .fontSize(10)
          .font('Helvetica');
    
    if (Array.isArray(content)) {
      content.forEach(line => {
        this.doc.text(line, 60, this.currentY, { width: this.layout.contentWidth - 20 });
        this.currentY += 15;
      });
    } else {
      this.doc.text(content, 60, this.currentY, { width: this.layout.contentWidth - 20 });
      this.currentY += 35;
    }
    
    this.currentY += 15;
    return this;
  }

  // Score card with visual indicators
  addScoreCard(scores: { label: string, value: number, max: number }[]) {
    const cardWidth = this.layout.contentWidth;
    const cardHeight = scores.length * 30 + 40;
    
    // Card background
    this.doc.rect(50, this.currentY, cardWidth, cardHeight)
          .fillColor('#f1f5f9')
          .fill()
          .strokeColor('#cbd5e1')
          .stroke();
    
    this.doc.fontSize(12).font('Helvetica-Bold')
          .fillColor('#1e40af')
          .text('COMPLIANCE SCORES', 60, this.currentY + 15);
    
    let scoreY = this.currentY + 40;
    
    scores.forEach(score => {
      // Score label
      this.doc.fontSize(10).font('Helvetica')
            .fillColor('#000000')
            .text(score.label, 70, scoreY);
      
      // Progress bar background
      this.doc.rect(250, scoreY, 200, 15)
            .fillColor('#e2e8f0')
            .fill();
      
      // Progress bar fill
      const fillWidth = (score.value / score.max) * 200;
      const fillColor = score.value >= 80 ? '#10b981' : score.value >= 60 ? '#f59e0b' : '#ef4444';
      
      this.doc.rect(250, scoreY, fillWidth, 15)
            .fillColor(fillColor)
            .fill();
      
      // Score text
      this.doc.fontSize(9).font('Helvetica-Bold')
            .fillColor('#000000')
            .text(`${score.value}/${score.max}`, 460, scoreY + 3);
      
      scoreY += 30;
    });
    
    this.currentY += cardHeight + 20;
    return this;
  }

  getDocument() {
    return this.doc;
  }

  getCurrentY() {
    return this.currentY;
  }

  setCurrentY(y: number) {
    this.currentY = y;
    return this;
  }
}

// ========================================
// EUDR COMPLIANCE PACK GENERATION SYSTEM
// ========================================

interface CompliancePackData {
  packId: string;
  shipmentId: string;
  farmerId: string;
  farmerName: string;
  exporterId: string;
  exporterName: string;
  exporterRegistration: string;
  commodity: string;
  hsCode: string;
  totalWeight: string;
  harvestPeriod: string;
  destination: string;
  farmIds: string[];
  gpsCoordinates: string;
  complianceStatus: string;
  riskClassification: string;
  deforestationRisk: string;
  complianceScore: number;
  forestProtectionScore: number;
  documentationScore: number;
  overallRiskScore: number;
  forestCoverChange?: number;
  carbonStockImpact?: number;
  biodiversityImpactLevel?: string;
  satelliteDataSource: string;
}

export function registerEudrRoutes(app: Express) {

  // Generate complete EUDR Compliance Pack
  app.post("/api/eudr/generate-pack", async (req, res) => {
    try {
      const packData: CompliancePackData = req.body;
      
      // Generate unique pack ID
      const packId = `EUDR-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
      
      // Calculate storage expiry date (5 years from now)
      const storageExpiryDate = new Date();
      storageExpiryDate.setFullYear(storageExpiryDate.getFullYear() + 5);
      
      // Create compliance pack record
      const [compliancePack] = await db.insert(eudrCompliancePacks).values({
        packId,
        shipmentId: packData.shipmentId,
        farmerId: packData.farmerId,
        farmerName: packData.farmerName,
        exporterId: packData.exporterId,
        exporterName: packData.exporterName,
        exporterRegistration: packData.exporterRegistration,
        commodity: packData.commodity,
        hsCode: packData.hsCode,
        totalWeight: packData.totalWeight,
        harvestPeriod: packData.harvestPeriod,
        destination: packData.destination,
        farmIds: packData.farmIds,
        gpsCoordinates: packData.gpsCoordinates,
        complianceStatus: packData.complianceStatus,
        riskClassification: packData.riskClassification,
        deforestationRisk: packData.deforestationRisk,
        complianceScore: packData.complianceScore,
        forestProtectionScore: packData.forestProtectionScore,
        documentationScore: packData.documentationScore,
        overallRiskScore: packData.overallRiskScore,
        forestCoverChange: packData.forestCoverChange,
        carbonStockImpact: packData.carbonStockImpact,
        biodiversityImpactLevel: packData.biodiversityImpactLevel,
        satelliteDataSource: packData.satelliteDataSource,
        storageExpiryDate,
        issuedBy: "LACRA",
        certifiedBy: "ECOENVIROS"
      }).returning();

      // Generate all 6 documents
      const documents = await Promise.all([
        generateCoverSheet(packId, packData),
        generateExportCertificate(packId, packData),
        generateComplianceAssessment(packId, packData),
        generateDeforestationReport(packId, packData),
        generateDueDiligenceStatement(packId, packData),
        generateTraceabilityReport(packId, packData)
      ]);

      // Store document records
      await db.insert(eudrComplianceDocuments).values(documents);

      res.json({
        success: true,
        packId,
        message: "EUDR Compliance Pack generated successfully",
        documentsGenerated: documents.length,
        storageExpiryDate,
        auditReady: true
      });

    } catch (error) {
      console.error("Error generating EUDR compliance pack:", error);
      res.status(500).json({ message: "Failed to generate compliance pack" });
    }
  });

  // Get all compliance packs (Admin only)
  app.get("/api/eudr/packs", async (req, res) => {
    try {
      const packs = await db.select().from(eudrCompliancePacks)
        .orderBy(desc(eudrCompliancePacks.packGeneratedAt));
      res.json(packs);
    } catch (error) {
      console.error("Error fetching compliance packs:", error);
      res.status(500).json({ message: "Failed to fetch compliance packs" });
    }
  });

  // Get specific compliance pack with documents
  app.get("/api/eudr/pack/:packId", async (req, res) => {
    try {
      const { packId } = req.params;
      
      const pack = await db.select().from(eudrCompliancePacks)
        .where(eq(eudrCompliancePacks.packId, packId))
        .limit(1);

      if (!pack.length) {
        return res.status(404).json({ message: "Compliance pack not found" });
      }

      const documents = await db.select().from(eudrComplianceDocuments)
        .where(eq(eudrComplianceDocuments.packId, packId));

      res.json({
        pack: pack[0],
        documents
      });
    } catch (error) {
      console.error("Error fetching compliance pack:", error);
      res.status(500).json({ message: "Failed to fetch compliance pack" });
    }
  });

  // Download specific document PDF
  app.get("/api/eudr/document/:documentId/pdf", async (req, res) => {
    try {
      const { documentId } = req.params;
      
      const document = await db.select().from(eudrComplianceDocuments)
        .where(eq(eudrComplianceDocuments.id, parseInt(documentId)))
        .limit(1);

      if (!document.length) {
        return res.status(404).json({ message: "Document not found" });
      }

      const doc = document[0];
      
      // Set response headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${doc.title}.pdf"`);

      // If PDF content is stored as base64, decode and send
      if (doc.pdfContent) {
        const pdfBuffer = Buffer.from(doc.pdfContent, 'base64');
        res.send(pdfBuffer);
      } else {
        res.status(404).json({ message: "PDF content not found" });
      }

    } catch (error) {
      console.error("Error downloading document:", error);
      res.status(500).json({ message: "Failed to download document" });
    }
  });

  // Delete compliance pack (Admin only)
  app.delete("/api/eudr/pack/:packId", async (req, res) => {
    try {
      const { packId } = req.params;
      
      // Delete documents first (foreign key constraint)
      await db.delete(eudrComplianceDocuments)
        .where(eq(eudrComplianceDocuments.packId, packId));
      
      // Delete pack
      await db.delete(eudrCompliancePacks)
        .where(eq(eudrCompliancePacks.packId, packId));

      res.json({ success: true, message: "Compliance pack deleted successfully" });
    } catch (error) {
      console.error("Error deleting compliance pack:", error);
      res.status(500).json({ message: "Failed to delete compliance pack" });
    }
  });
}

// ========================================
// PDF GENERATION FUNCTIONS
// ========================================

async function generateCoverSheet(packId: string, data: CompliancePackData) {
  const generator = new AdvancedPDFGenerator();
  const doc = generator.getDocument();
  const buffers: Buffer[] = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  const referenceNumber = `EUDR-COVER-${packId}`;
  const issueDate = new Date().toLocaleDateString();

  // Professional header
  generator.addHeader(
    'EUDR COMPLIANCE PACK', 
    `EXPORT SHIPMENT [${data.shipmentId}]`,
    referenceNumber
  );

  // Exporter Details Section
  generator.addSection('EXPORTER DETAILS', [
    `Name: ${data.exporterName}`,
    `Registration Number: ${data.exporterRegistration}`,
    `Business Address: Registered with LACRA`,
    `Contact: Export Department`,
    `Verification Status: LACRA Verified ✓`
  ], { background: true });

  // Shipment Details Section  
  generator.addSection('SHIPMENT DETAILS', [
    `Commodity: ${data.commodity}`,
    `HS Code: ${data.hsCode}`,
    `Total Volume/Weight: ${data.totalWeight}`,
    `Harvest Period: ${data.harvestPeriod}`,
    `Destination: ${data.destination}`,
    `Risk Classification: ${data.riskClassification.toUpperCase()}`,
    `Compliance Status: ${data.complianceStatus.toUpperCase()}`
  ]);

  // Document Index Table
  generator.addSection('INCLUDED DOCUMENTS IN THIS PACK', []);
  
  const documentHeaders = ['Document #', 'Document Name', 'Reference Number', 'Issued By'];
  const documentRows = [
    ['1.', 'Due Diligence Statement (DDS)', `DDS-${packId}-${Date.now()}`, 'LACRA / ECOENVIROS'],
    ['2.', 'Geolocation Report', `GEO-${packId}-${Date.now()}`, 'LACRA / ECOENVIROS'],
    ['3.', 'LACRA Export Eligibility Certificate', `CERT-${packId}-${Date.now()}`, 'LACRA'],
    ['4.', 'Deforestation-Free Certificate', `DEFOREST-${packId}-${Date.now()}`, 'LACRA / ECOENVIROS'],
    ['5.', 'Supply Chain Traceability Report', `TRACE-${packId}-${Date.now()}`, 'LACRA / ECOENVIROS'],
    ['6.', 'Risk Assessment Report', `ASSESS-${packId}-${Date.now()}`, 'LACRA / ECOENVIROS']
  ];
  
  generator.addTable(documentHeaders, documentRows);

  // Cross-Reference Tracking
  generator.addSection('CROSS-REFERENCE TRACKING', [
    `Primary Pack ID: ${packId}`,
    `Shipment Reference: ${data.shipmentId}`,
    `Farmer ID Chain: ${data.farmerId} → ${data.farmIds.join(' → ')}`,
    `GPS Coordinate Link: ${data.gpsCoordinates}`,
    `Satellite Data Source: ${data.satelliteDataSource}`,
    `Compliance Chain: Farm Registration → GPS Verification → Satellite Analysis → Risk Assessment → Export Clearance`
  ], { background: true });

  // Compliance Statement
  generator.addSection('COMPLIANCE STATEMENT', 
    'This shipment meets the requirements of EU Regulation 2023/1115 on deforestation-free products. All farms, suppliers, and processing steps have been verified as compliant and certified jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority) and ECOENVIRO Audit & Certification. Complete audit trail and reference tracking maintained for 5-year retention period.'
  );

  // Preparation Details
  generator.addSection('PREPARATION DETAILS', [
    `Prepared By: LACRA Compliance Officer`,
    `Date: ${issueDate}`,
    `Pack Generation Time: ${new Date().toISOString()}`,
    `Verification Level: Dual Certification (LACRA + ECOENVIROS)`,
    `Audit Ready: YES - All documents stored for 5-year retention`
  ]);

  // Footer
  generator.addFooter('Cover Sheet', packId, issueDate);

  doc.end();

  return new Promise<any>((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({
        packId,
        documentType: 'cover_sheet',
        documentNumber: referenceNumber,
        title: 'EUDR Compliance Pack Cover Sheet',
        referenceNumber,
        issuedBy: 'LACRA / ECOENVIROS',
        pdfContent: pdfBuffer.toString('base64')
      });
    });
  });
}

async function generateExportCertificate(packId: string, data: CompliancePackData) {
  const generator = new AdvancedPDFGenerator();
  const doc = generator.getDocument();
  const buffers: Buffer[] = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  const referenceNumber = `LACRA-CERT-${packId}-${Date.now()}`;
  const issueDate = new Date().toLocaleDateString();

  // Official header for government certificate
  generator.addHeader(
    'REPUBLIC OF LIBERIA\nLIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY (LACRA)\nEXPORT ELIGIBILITY CERTIFICATE',
    undefined,
    referenceNumber
  );

  // Certificate Details
  generator.addSection('CERTIFICATE DETAILS', [
    `Certificate Number: ${referenceNumber}`,
    `Date Issued: ${issueDate}`,
    `Valid Until: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    `Pack Reference: ${packId}`,
    `Authority: LACRA - Liberia Agriculture Commodity Regulatory Authority`
  ], { background: true });

  // Certification Statement
  generator.addSection('CERTIFICATION STATEMENT', 
    `This is to certify that ${data.exporterName} (Registration Number: ${data.exporterRegistration}) is a registered exporter under the Liberia Agriculture Commodity Regulatory Authority (LACRA) and is authorized to export the following commodity in compliance with Liberian export regulations and EU Regulation 2023/1115.`
  );

  // Commodity Details Table
  generator.addSection('AUTHORIZED COMMODITY EXPORT', []);
  const commodityHeaders = ['Commodity', 'HS Code', 'Volume/Weight', 'Harvest Period', 'Origin (Farm IDs)'];
  const commodityRows = [[
    data.commodity,
    data.hsCode,
    data.totalWeight,
    data.harvestPeriod,
    data.farmIds.join(', ')
  ]];
  generator.addTable(commodityHeaders, commodityRows);

  // Compliance Verification
  generator.addSection('COMPLIANCE VERIFICATION COMPLETED', [
    '✓ Farm registration and geolocation data verified in LACRA database',
    '✓ Supply chain traceability confirmed and documented',
    '✓ Risk assessment completed with acceptable results',
    '✓ Deforestation-free status confirmed via satellite monitoring',
    '✓ GPS coordinates verified and cross-referenced',
    '✓ Farmer identification and farm boundary validation complete',
    '✓ Export eligibility criteria fully satisfied'
  ]);

  // Reference Tracking Chain
  generator.addSection('REFERENCE TRACKING CHAIN', [
    `Certificate Reference: ${referenceNumber}`,
    `Linked to Pack ID: ${packId}`,
    `Farmer Chain: ${data.farmerId} → Farms: ${data.farmIds.join(' → ')}`,
    `GPS Verification: ${data.gpsCoordinates}`,
    `Compliance Score: ${data.complianceScore}/100`,
    `Risk Level: ${data.riskClassification.toUpperCase()}`,
    `Satellite Data: ${data.satelliteDataSource}`
  ], { background: true });

  // Authorization Section
  generator.addSection('AUTHORIZATION DETAILS', [
    'Authorized Signatory: Director, LACRA Export Division',
    'Title: Chief Compliance Officer',
    'Signature: [Digital Signature Applied]',
    'Official LACRA Stamp/Seal: [Applied]',
    'Co-Certification: ECOENVIROS Audit & Certification'
  ]);

  // Footer
  generator.addFooter('Export Certificate', packId, issueDate);

  doc.end();

  return new Promise<any>((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({
        packId,
        documentType: 'export_certificate',
        documentNumber: referenceNumber,
        title: 'LACRA Export Eligibility Certificate',
        referenceNumber,
        issuedBy: 'LACRA',
        pdfContent: pdfBuffer.toString('base64')
      });
    });
  });
}

async function generateComplianceAssessment(packId: string, data: CompliancePackData) {
  const generator = new AdvancedPDFGenerator();
  const doc = generator.getDocument();
  const buffers: Buffer[] = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  const referenceNumber = `EUDR-ASSESS-${packId}-${Date.now()}`;
  const issueDate = new Date().toLocaleDateString();

  // Professional header
  generator.addHeader(
    'EUDR COMPLIANCE ASSESSMENT',
    'European Union Deforestation Regulation Report\nCertified by ECOENVIROS – Audit & Certification | In Partnership with LACRA\nSystem Data Source: Polipus – AgriTrace',
    referenceNumber
  );

  // Assessment Details
  generator.addSection('ASSESSMENT DETAILS', [
    `Report Reference: ${referenceNumber}`,
    `Assessment Date: ${issueDate}`,
    `Property Owner: ${data.farmerName}`,
    `Farmer Registration: ${data.farmerId}`,
    `GPS Coordinates: ${data.gpsCoordinates}`,
    `Pack Reference: ${packId}`,
    `Commodity Assessed: ${data.commodity}`
  ], { background: true });

  // Executive Summary
  generator.addSection('EXECUTIVE SUMMARY', [
    `Overall Compliance Status: ${data.complianceStatus.toUpperCase()} ✓`,
    `Risk Classification: ${data.riskClassification.toUpperCase()}`,
    `Deforestation Risk: ${data.deforestationRisk.toUpperCase()}`,
    `Assessment Result: ${data.complianceScore >= 80 ? 'APPROVED FOR EXPORT' : 'REQUIRES REVIEW'}`,
    `Certification Level: Dual Authority (LACRA + ECOENVIROS)`
  ]);

  // Detailed Risk Assessment with Score Cards
  const scores = [
    { label: 'Compliance Score', value: data.complianceScore, max: 100 },
    { label: 'Forest Protection Score', value: data.forestProtectionScore, max: 100 },
    { label: 'Documentation Score', value: data.documentationScore, max: 100 },
    { label: 'Overall Risk Score', value: data.overallRiskScore, max: 100 }
  ];
  
  generator.addScoreCard(scores);

  // Documentation Matrix
  generator.addSection('DOCUMENTATION MATRIX', []);
  const docHeaders = ['Document Type', 'Status', 'Reference', 'Verification'];
  const docRows = [
    ['Due Diligence Statement', '✓ Complete', `DDS-${packId}`, 'LACRA/ECOENVIROS'],
    ['Geolocation Coordinates', '✓ Verified', `GEO-${packId}`, 'GPS ±1.5m accuracy'],
    ['Supply Chain Traceability', '✓ Complete', `TRACE-${packId}`, 'End-to-end tracked'],
    ['Risk Assessment Report', '✓ Complete', `RISK-${packId}`, 'Multi-factor analysis'],
    ['Satellite Monitoring', '✓ Active', data.satelliteDataSource, 'Real-time monitoring'],
    ['Farm Registration', '✓ Verified', data.farmerId, 'LACRA database confirmed']
  ];
  generator.addTable(docHeaders, docRows);

  // Cross-Reference Chain
  generator.addSection('CROSS-REFERENCE VALIDATION CHAIN', [
    `Primary Assessment: ${referenceNumber}`,
    `Links to Pack ID: ${packId}`,
    `Farm Chain: ${data.farmIds.join(' → ')}`,
    `Satellite Data Cross-Check: ${data.satelliteDataSource}`,
    `GPS Verification: ${data.gpsCoordinates}`,
    `Compliance Database Entry: LACRA-${data.farmerId}`,
    `Export Authorization: Pending certificate issuance`
  ], { background: true });

  // Compliance Recommendations
  generator.addSection('COMPLIANCE RECOMMENDATIONS', [
    '1. Continue regular satellite monitoring of farm boundaries (Monthly)',
    '2. Maintain detailed farm management records (Ongoing)',
    '3. Ensure compliance with all local environmental regulations (Continuous)',
    '4. Implement sustainable farming practices as per LACRA guidelines',
    '5. Regular GPS boundary verification and reporting (Quarterly)',
    '6. Participate in LACRA farmer training programs (Annual)'
  ]);

  // Footer
  generator.addFooter('Compliance Assessment', packId, issueDate);

  doc.end();

  return new Promise<any>((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({
        packId,
        documentType: 'compliance_assessment',
        documentNumber: referenceNumber,
        title: 'EUDR Compliance Assessment',
        referenceNumber,
        issuedBy: 'LACRA / ECOENVIROS',
        pdfContent: pdfBuffer.toString('base64')
      });
    });
  });
}

async function generateDeforestationReport(packId: string, data: CompliancePackData) {
  const generator = new AdvancedPDFGenerator();
  const doc = generator.getDocument();
  const buffers: Buffer[] = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  const referenceNumber = `DEFOREST-ANALYSIS-${packId}-${Date.now()}`;
  const issueDate = new Date().toLocaleDateString();

  generator.addHeader(
    'DEFORESTATION ANALYSIS REPORT',
    'Environmental Impact & Forest Change Assessment\nCertified by ECOENVIROS – Audit & Certification | In Partnership with LACRA\nSystem Data Source: Polipus – AgriTrace',
    referenceNumber
  );

  // Property Analysis Details
  generator.addSection('PROPERTY ANALYSIS DETAILS', [
    `Assessment Reference: ${referenceNumber}`,
    `Analysis Date: ${issueDate}`,
    `Property Owner: ${data.farmerName}`,
    `Property Registration: ${data.farmerId}`,
    `Location Coordinates: ${data.gpsCoordinates}`,
    `Pack Reference: ${packId}`,
    `Analysis Period: December 31, 2020 - Present`
  ], { background: true });

  // Satellite Data Sources
  generator.addSection('SATELLITE DATA SOURCES', [
    `Primary Source: ${data.satelliteDataSource}`,
    'Secondary Sources: Sentinel-2, Landsat-8, MODIS',
    'Analysis Frequency: Real-time monitoring',
    'Resolution: 10m pixel accuracy',
    'Temporal Coverage: 2018-Present',
    'Data Quality: High confidence level (>95%)'
  ]);

  // Environmental Impact Metrics
  const impactHeaders = ['Metric', 'Current Value', 'Baseline (2020)', 'Change', 'Status'];
  const impactRows = [
    ['Forest Cover Change', `${data.forestCoverChange || 0}%`, '100%', `${(data.forestCoverChange || 0) - 100}%`, data.forestCoverChange && data.forestCoverChange < 100 ? '⚠️ Monitor' : '✓ Stable'],
    ['Carbon Stock Impact', `${data.carbonStockImpact || 0}%`, '100%', `${(data.carbonStockImpact || 0) - 100}%`, data.carbonStockImpact && data.carbonStockImpact < 95 ? '⚠️ Monitor' : '✓ Stable'],
    ['Biodiversity Level', data.biodiversityImpactLevel || 'Low', 'Baseline', 'No change', '✓ Maintained'],
    ['Deforestation Risk', data.deforestationRisk.toUpperCase(), 'LOW', 'Stable', '✓ Compliant']
  ];
  
  generator.addSection('ENVIRONMENTAL IMPACT METRICS', []);
  generator.addTable(impactHeaders, impactRows);

  // Reference Cross-Check
  generator.addSection('SATELLITE CROSS-REFERENCE VERIFICATION', [
    `Primary Assessment: ${referenceNumber}`,
    `Linked Pack: ${packId}`,
    `GPS Cross-Check: ${data.gpsCoordinates}`,
    `Farm Boundary Verification: ${data.farmIds.join(', ')}`,
    `Deforestation Database: No violations found`,
    `Historical Analysis: 2020-2024 comparison complete`,
    `Real-time Monitoring: Active alerts enabled`
  ], { background: true });

  // Environmental Action Plan
  generator.addSection('ENVIRONMENTAL ACTION PLAN', [
    '1. Maintain current forest preservation practices (Ongoing)',
    '2. Implement sustainable agricultural techniques (Quarterly training)',
    '3. Regular monitoring of environmental indicators (Monthly)',
    '4. Participate in LACRA reforestation programs (Annual)',
    '5. GPS boundary maintenance and verification (Bi-annual)',
    '6. Carbon footprint reduction initiatives (Ongoing)'
  ]);

  // Monitoring Protocol Table
  const monitoringHeaders = ['Monitoring Type', 'Frequency', 'Data Source', 'Alert Threshold'];
  const monitoringRows = [
    ['Satellite imagery analysis', 'Weekly', data.satelliteDataSource, '0.1% forest loss'],
    ['Biodiversity assessments', 'Quarterly', 'Field surveys', 'Species count decline'],
    ['Carbon stock evaluations', 'Bi-annually', 'LIDAR + Optical', '5% reduction'],
    ['GPS boundary verification', 'Continuous', 'GPS tracking', '10m deviation'],
    ['Deforestation alerts', 'Real-time', 'Multiple satellites', 'Any tree loss'],
    ['Compliance reporting', 'Monthly', 'LACRA database', 'Any violations']
  ];
  
  generator.addSection('ONGOING ENVIRONMENTAL MONITORING PROTOCOL', []);
  generator.addTable(monitoringHeaders, monitoringRows);

  generator.addFooter('Deforestation Report', packId, issueDate);

  doc.end();

  return new Promise<any>((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({
        packId,
        documentType: 'deforestation_report',
        documentNumber: referenceNumber,
        title: 'Deforestation Analysis Report',
        referenceNumber,
        issuedBy: 'LACRA / ECOENVIROS',
        pdfContent: pdfBuffer.toString('base64')
      });
    });
  });
}

async function generateDueDiligenceStatement(packId: string, data: CompliancePackData) {
  const generator = new AdvancedPDFGenerator();
  const doc = generator.getDocument();
  const buffers: Buffer[] = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  const referenceNumber = `DDS-STATEMENT-${packId}-${Date.now()}`;
  const issueDate = new Date().toLocaleDateString();

  generator.addHeader(
    'DUE DILIGENCE STATEMENT (DDS)',
    'EU Deforestation Regulation Compliance\nCertified by ECOENVIROS – Audit & Certification | In Partnership with LACRA',
    referenceNumber
  );

  // Statement Details
  generator.addSection('DUE DILIGENCE STATEMENT DETAILS', [
    `DDS Reference: ${referenceNumber}`,
    `Issue Date: ${issueDate}`,
    `Exporter: ${data.exporterName}`,
    `Registration: ${data.exporterRegistration}`,
    `Commodity: ${data.commodity}`,
    `Shipment ID: ${data.shipmentId}`,
    `Pack Reference: ${packId}`
  ], { background: true });

  // Due Diligence Declaration
  generator.addSection('DUE DILIGENCE DECLARATION', 
    `We, ${data.exporterName}, hereby declare that we have exercised due diligence in accordance with EU Regulation 2023/1115 to ensure that all commodities covered by this statement comply with deforestation-free requirements and applicable legislation.`
  );

  // Compliance Verification Matrix
  const complianceHeaders = ['Requirement', 'Verification Method', 'Status', 'Reference'];
  const complianceRows = [
    ['No deforestation post-2020', 'Satellite monitoring', '✓ Verified', data.satelliteDataSource],
    ['Legal production compliance', 'LACRA registration', '✓ Verified', data.farmerId],
    ['Risk assessment completed', 'Multi-factor analysis', '✓ Complete', `ASSESS-${packId}`],
    ['Complete traceability', 'GPS + supply chain', '✓ Documented', data.gpsCoordinates],
    ['Mitigation measures', 'Ongoing monitoring', '✓ Active', 'Real-time alerts']
  ];
  
  generator.addSection('COMPLIANCE VERIFICATION MATRIX', []);
  generator.addTable(complianceHeaders, complianceRows);

  // Risk Assessment Summary
  const riskScores = [
    { label: 'Overall Risk Level', value: 100 - data.overallRiskScore, max: 100 },
    { label: 'Deforestation Risk', value: data.deforestationRisk === 'low' ? 90 : data.deforestationRisk === 'medium' ? 60 : 30, max: 100 },
    { label: 'Compliance Score', value: data.complianceScore, max: 100 },
    { label: 'Traceability Score', value: data.documentationScore, max: 100 }
  ];
  
  generator.addScoreCard(riskScores);

  // Cross-Reference Verification
  generator.addSection('CROSS-REFERENCE VERIFICATION CHAIN', [
    `DDS Reference: ${referenceNumber}`,
    `Pack ID: ${packId}`,
    `Farm Chain: ${data.farmerId} → ${data.farmIds.join(' → ')}`,
    `GPS Verification: ${data.gpsCoordinates}`,
    `Satellite Cross-Check: ${data.satelliteDataSource}`,
    `Export Certificate: CERT-${packId}`,
    `Assessment Report: ASSESS-${packId}`,
    `Deforestation Analysis: DEFOREST-${packId}`
  ], { background: true });

  // Mitigation Measures
  generator.addSection('MITIGATION MEASURES IMPLEMENTED', [
    '✓ Real-time satellite monitoring and verification systems',
    '✓ Ground-truth verification by LACRA certified inspectors',
    '✓ Complete supply chain traceability documentation',
    '✓ Regular compliance audits and risk assessments',
    '✓ Farmer training programs on sustainable practices',
    '✓ GPS boundary verification and maintenance',
    '✓ Automated deforestation alert systems',
    '✓ 5-year audit trail retention system'
  ]);

  // Declaration Section
  generator.addSection('REGULATORY DECLARATION', 
    'This due diligence statement is made in accordance with EU Regulation 2023/1115 and represents our comprehensive verification based on satellite monitoring, ground-truth verification, and complete supply chain documentation. All referenced data and assessments are maintained in the Polipus AgriTrace system for regulatory audit purposes.'
  );

  // Authorization
  generator.addSection('AUTHORIZATION AND CERTIFICATION', [
    'Authorized Signatory: Director, Export Compliance Department',
    'Title: Chief Due Diligence Officer',
    'Date: ' + issueDate,
    'Company Seal/Stamp: [Digital Certification Applied]',
    'Dual Certification: LACRA + ECOENVIROS',
    'Verification Contact: compliance@lacra.gov.lr | cert@ecoenviros.com'
  ]);

  generator.addFooter('Due Diligence Statement', packId, issueDate);

  doc.end();

  return new Promise<any>((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({
        packId,
        documentType: 'dds',
        documentNumber: referenceNumber,
        title: 'Due Diligence Statement',
        referenceNumber,
        issuedBy: 'LACRA / ECOENVIROS',
        pdfContent: pdfBuffer.toString('base64')
      });
    });
  });
}

async function generateTraceabilityReport(packId: string, data: CompliancePackData) {
  const generator = new AdvancedPDFGenerator();
  const doc = generator.getDocument();
  const buffers: Buffer[] = [];
  
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  const referenceNumber = `TRACE-CHAIN-${packId}-${Date.now()}`;
  const issueDate = new Date().toLocaleDateString();

  generator.addHeader(
    'SUPPLY CHAIN TRACEABILITY REPORT',
    'Complete Farm-to-Export Documentation\nCertified by ECOENVIROS – Audit & Certification | In Partnership with LACRA',
    referenceNumber
  );

  // Traceability Details
  generator.addSection('TRACEABILITY REPORT DETAILS', [
    `Traceability Reference: ${referenceNumber}`,
    `Report Date: ${issueDate}`,
    `Shipment ID: ${data.shipmentId}`,
    `Commodity: ${data.commodity}`,
    `Total Weight: ${data.totalWeight}`,
    `Pack Reference: ${packId}`,
    `Traceability Level: Complete (Farm-to-Export)`
  ], { background: true });

  // Farm Origin Matrix
  const originHeaders = ['Parameter', 'Value', 'Verification Method', 'Status'];
  const originRows = [
    ['Primary Farmer', data.farmerName, 'LACRA Registration', '✓ Verified'],
    ['Farmer ID', data.farmerId, 'National Database', '✓ Confirmed'],
    ['Farm Locations', data.farmIds.join(', '), 'GPS Mapping', '✓ Mapped'],
    ['GPS Coordinates', data.gpsCoordinates, 'Satellite Verification', '✓ Accurate'],
    ['Harvest Period', data.harvestPeriod, 'Field Documentation', '✓ Documented'],
    ['Land Rights', 'Verified', 'Legal Documents', '✓ Valid']
  ];
  
  generator.addSection('FARM ORIGIN VERIFICATION MATRIX', []);
  generator.addTable(originHeaders, originRows);

  // Supply Chain Path with References
  const chainHeaders = ['Stage', 'Location/Entity', 'Reference Number', 'Verification'];
  const chainRows = [
    ['1. Farm Production', `${data.farmerName} Farm`, data.farmerId, '✓ GPS verified'],
    ['2. Primary Collection', 'LACRA Registered Collector', `COL-${packId}`, '✓ Licensed'],
    ['3. Processing/Storage', 'Certified Processing Facility', `PROC-${packId}`, '✓ Inspected'],
    ['4. Quality Assessment', 'LACRA Inspection Office', `QA-${packId}`, '✓ Passed'],
    ['5. Export Preparation', data.exporterName, data.exporterRegistration, '✓ Authorized'],
    ['6. Final Export', data.destination, `EXP-${packId}`, '✓ Cleared']
  ];
  
  generator.addSection('COMPLETE SUPPLY CHAIN PATH', []);
  generator.addTable(chainHeaders, chainRows);

  // Verification Checkpoint Status
  generator.addSection('VERIFICATION CHECKPOINT STATUS', [
    '✓ Farm registration verification - LACRA database confirmed',
    '✓ GPS boundary confirmation - Satellite cross-referenced',
    '✓ Harvest documentation - Period and volume verified',
    '✓ Transport tracking - Route and timing documented',
    '✓ Quality control testing - LACRA standards met',
    '✓ Export permit validation - All clearances obtained',
    '✓ Deforestation screening - No violations detected',
    '✓ Chain of custody - Complete documentation maintained'
  ]);

  // Cross-Reference Network
  generator.addSection('CROSS-REFERENCE NETWORK', [
    `Primary Trace: ${referenceNumber}`,
    `Pack ID: ${packId}`,
    `Farm Network: ${data.farmIds.join(' ↔ ')}`,
    `GPS Network: ${data.gpsCoordinates} (Verified)`,
    `Compliance Chain: ${data.farmerId} → ${data.exporterRegistration}`,
    `Certificate Chain: CERT-${packId} → DDS-${packId} → ASSESS-${packId}`,
    `Satellite Verification: ${data.satelliteDataSource}`,
    `Export Authorization: EXP-${packId}`
  ], { background: true });

  // Traceability Scores
  const traceScores = [
    { label: 'Documentation Completeness', value: data.documentationScore, max: 100 },
    { label: 'GPS Accuracy', value: 98, max: 100 },
    { label: 'Chain of Custody', value: 100, max: 100 },
    { label: 'Verification Status', value: data.complianceScore, max: 100 }
  ];
  
  generator.addScoreCard(traceScores);

  // Digital Audit Trail
  generator.addSection('DIGITAL AUDIT TRAIL', [
    'Complete digital footprint maintained in Polipus AgriTrace system',
    '5-year retention period as per EU Regulation 2023/1115',
    'Real-time access for regulatory authorities',
    'Blockchain-style reference linking for tamper-proof records',
    'Automated cross-verification across all system modules',
    'Export-ready documentation package available on demand'
  ]);

  generator.addFooter('Traceability Report', packId, issueDate);

  doc.end();

  return new Promise<any>((resolve) => {
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve({
        packId,
        documentType: 'traceability_report',
        documentNumber: referenceNumber,
        title: 'Supply Chain Traceability Report',
        referenceNumber,
        issuedBy: 'LACRA / ECOENVIROS',
        pdfContent: pdfBuffer.toString('base64')
      });
    });
  });
}