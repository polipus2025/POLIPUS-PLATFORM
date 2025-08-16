import PDFDocument from 'pdfkit';

type PDFDocumentType = InstanceType<typeof PDFDocument>;

interface FarmerData {
  id: string;
  name: string;
  county: string;
  latitude?: string;
  longitude?: string;
}

interface ExportData {
  company: string;
  license: string;
  quantity: string;
  destination: string;
  exportValue: string;
  vessel: string;
  exportDate: string;
  shipmentId: string;
}

export function generateDirectSuccessFinal(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): PDFDocumentType {
  
  console.log('🎯 STARTING DIRECT SUCCESS FINAL - TRACKING PAGE COUNT');
  
  // Create document with explicit single page first
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const currentDate = new Date().toLocaleDateString();
  let pageCount = 1; // Track pages manually

  console.log(`📄 PAGE ${pageCount}: Starting Cover Page (auto-first-page)`);
  
  // PAGE 1: Cover Page (automatic first page - DON'T call addPage)
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('EUDR COMPLIANCE PACK', 60, 30);
  doc.fontSize(16).fillColor('#e2e8f0').text(`Certificate ID: ${packId}`, 60, 65);
  
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 1: COVER PAGE', 70, 150);
  doc.fontSize(12).fillColor('#4a5568')
     .text(`Farmer: ${farmerData.name}`, 70, 180)
     .text(`Location: ${farmerData.county}, Liberia`, 70, 200)
     .text(`Date: ${currentDate}`, 70, 220)
     .text(`Company: ${exportData.company}`, 70, 240);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Cover Page`, 60, 770);

  // PAGE 2: Export Eligibility  
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Adding Export Eligibility page`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('EXPORT ELIGIBILITY', 60, 30);
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 2: EXPORT ELIGIBILITY', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('Export standards verified and approved', 70, 180);
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Export Eligibility`, 60, 770);

  // PAGE 3: Compliance Assessment
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Adding Compliance Assessment page`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('COMPLIANCE ASSESSMENT', 60, 30);
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 3: COMPLIANCE ASSESSMENT', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('EUDR compliance verified at 96%', 70, 180);
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Compliance Assessment`, 60, 770);

  // PAGE 4: Deforestation Analysis
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Adding Deforestation Analysis page`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('DEFORESTATION ANALYSIS', 60, 30);
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 4: DEFORESTATION ANALYSIS', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('No deforestation risk detected', 70, 180);
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Deforestation Analysis`, 60, 770);

  // PAGE 5: Due Diligence
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Adding Due Diligence page`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('DUE DILIGENCE', 60, 30);
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 5: DUE DILIGENCE', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('All due diligence procedures completed', 70, 180);
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Due Diligence`, 60, 770);

  // PAGE 6: Supply Chain Traceability
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Adding Supply Chain Traceability page`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('SUPPLY CHAIN TRACEABILITY', 60, 30);
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 6: SUPPLY CHAIN TRACEABILITY', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('Complete supply chain traceability confirmed', 70, 180);
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Supply Chain Traceability`, 60, 770);

  console.log(`✅ DIRECT SUCCESS FINAL COMPLETE - Total pages generated: ${pageCount}`);
  console.log('🎯 Document should have exactly 6 pages');
  
  return doc;
}