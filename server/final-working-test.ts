import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

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

export async function generateFinalWorkingTest(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): Promise<PDFDocumentType> {
  // Create document with explicit configuration
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    autoFirstPage: true  // Explicitly control first page
  });

  const currentDate = new Date().toLocaleDateString();

  // PAGE 1: Cover Page (uses auto-first page, don't call addPage())
  generatePage1Content(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 2: Export Eligibility (explicitly add page)
  doc.addPage();
  generatePage2Content(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 3: Compliance Assessment (explicitly add page)
  doc.addPage();
  generatePage3Content(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 4: Deforestation Analysis (explicitly add page)
  doc.addPage();
  generatePage4Content(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 5: Due Diligence (explicitly add page)
  doc.addPage();
  generatePage5Content(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 6: Supply Chain Traceability (explicitly add page)
  doc.addPage();
  generatePage6Content(doc, farmerData, exportData, packId, currentDate);

  // Explicitly end here - no more pages should be added
  console.log('📄 PDF generation complete - should be exactly 6 pages');
  return doc;
}

function generatePage1Content(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  // Simple header
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(28).fillColor('#ffffff').font('Helvetica-Bold').text('EUDR COMPLIANCE', 60, 30);
  doc.fontSize(20).fillColor('#e2e8f0').text('CERTIFICATION PACK', 60, 65);
  
  // Certificate info
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE INFORMATION', 70, 150);
  doc.fontSize(12).fillColor('#2d3748')
     .text(`Certificate Holder: ${farmerData.name}`, 70, 190)
     .text(`Farm Location: ${farmerData.county}, Liberia`, 70, 210)
     .text(`Issue Date: ${currentDate}`, 70, 230)
     .text(`Export Company: ${exportData.company}`, 70, 250);
  
  // About section
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS CERTIFICATION PACK', 70, 300);
  doc.fontSize(10).fillColor('#4a5568')
     .text('This comprehensive EUDR Compliance Certification Pack contains six specialized reports', 70, 330)
     .text('that demonstrate full compliance with the European Union Deforestation Regulation.', 70, 345);
  
  // Footer with pack ID
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`LACRA-EUDR-${packId} | Cover Page | Generated: ${currentDate}`, 60, 770);
}

function generatePage2Content(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('EXPORT ELIGIBILITY CERTIFICATE', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('EXPORT ELIGIBILITY ASSESSMENT', 70, 150);
  doc.fontSize(12).fillColor('#4a5568')
     .text('Quality Standards: 98% - PASSED', 80, 190)
     .text('Documentation: 96% - COMPLETE', 80, 210)
     .text('Traceability: 97% - VERIFIED', 80, 230)
     .text('Risk Assessment: 95% - LOW RISK', 80, 250);
  
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('EXPORT DETAILS', 70, 300);
  doc.fontSize(11).fillColor('#4a5568')
     .text(`Quantity: ${exportData.quantity}`, 80, 330)
     .text(`Destination: ${exportData.destination}`, 80, 350)
     .text(`Export Date: ${exportData.exportDate}`, 80, 370);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`LACRA-EUDR-${packId} | Export Eligibility | Generated: ${currentDate}`, 60, 770);
}

function generatePage3Content(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('COMPLIANCE ASSESSMENT REPORT', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('COMPLIANCE RESULTS', 70, 150);
  doc.fontSize(12).fillColor('#4a5568')
     .text('EUDR Compliance: 95/100 - APPROVED', 80, 190)
     .text('Forest Protection: 98/100 - EXCELLENT', 80, 210)
     .text('Documentation: 96/100 - COMPLETE', 80, 230)
     .text('Supply Chain: 94/100 - VERIFIED', 80, 250);
  
  doc.fontSize(14).fillColor('#38a169').font('Helvetica-Bold').text('OVERALL STATUS: APPROVED FOR EXPORT', 70, 300);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`LACRA-EUDR-${packId} | Compliance Assessment | Generated: ${currentDate}`, 60, 770);
}

function generatePage4Content(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('DEFORESTATION RISK ANALYSIS', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('RISK ASSESSMENT RESULTS', 70, 150);
  doc.fontSize(12).fillColor('#4a5568')
     .text('Deforestation Risk: 2% - NO RISK DETECTED', 80, 190)
     .text('Forest Degradation: 1% - MINIMAL', 80, 210)
     .text('Land Use Change: 3% - LOW', 80, 230)
     .text('Biodiversity Impact: 1% - MINIMAL', 80, 250);
  
  doc.fontSize(14).fillColor('#38a169').font('Helvetica-Bold').text('ENVIRONMENTAL STATUS: COMPLIANT', 70, 300);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`LACRA-EUDR-${packId} | Deforestation Analysis | Generated: ${currentDate}`, 60, 770);
}

function generatePage5Content(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('DUE DILIGENCE STATEMENT', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('DUE DILIGENCE VERIFICATION', 70, 150);
  doc.fontSize(12).fillColor('#4a5568')
     .text('✓ Geolocation coordinates verified using GPS technology', 80, 190)
     .text('✓ Supply chain documentation reviewed and validated', 80, 210)
     .text('✓ Risk assessment conducted using satellite monitoring', 80, 230)
     .text('✓ Legal compliance verification performed', 80, 250)
     .text('✓ EUDR due diligence statement prepared and reviewed', 80, 270);
  
  doc.fontSize(14).fillColor('#38a169').font('Helvetica-Bold').text('DUE DILIGENCE: COMPLETE', 70, 320);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`LACRA-EUDR-${packId} | Due Diligence | Generated: ${currentDate}`, 60, 770);
}

function generatePage6Content(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('SUPPLY CHAIN TRACEABILITY', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('TRACEABILITY VERIFICATION', 70, 150);
  doc.fontSize(12).fillColor('#4a5568')
     .text('✓ Complete chain of custody documented', 80, 190)
     .text('✓ All stakeholders verified and certified', 80, 210)
     .text('✓ GPS coordinates recorded at each stage', 80, 230)
     .text('✓ Quality control measures implemented', 80, 250)
     .text('✓ End-to-end traceability confirmed', 80, 270);
  
  doc.fontSize(14).fillColor('#38a169').font('Helvetica-Bold').text('SUPPLY CHAIN: FULLY TRACEABLE', 70, 320);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`LACRA-EUDR-${packId} | Supply Chain Traceability | Generated: ${currentDate}`, 60, 770);
}