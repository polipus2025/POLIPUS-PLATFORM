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

export async function generateTestCoverFinal(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): Promise<PDFDocumentType> {
  // Create document with A4 size
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const currentDate = new Date().toLocaleDateString();

  // PAGE 1: Cover Page (automatic first page)
  await generatePage1(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 2: Export Eligibility
  doc.addPage();
  await generatePage2(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 3: Compliance Assessment
  doc.addPage();
  await generatePage3(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 4: Deforestation Analysis
  doc.addPage();
  await generatePage4(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 5: Due Diligence
  doc.addPage();
  await generatePage5(doc, farmerData, exportData, packId, currentDate);
  
  // PAGE 6: Supply Chain Traceability
  doc.addPage();
  await generatePage6(doc, farmerData, exportData, packId, currentDate);

  // End document - should be exactly 6 pages
  return doc;
}

async function generateQRFooter(doc: PDFDocumentType, packId: string, currentDate: string, pageTitle: string, farmerName: string, exportCompany: string) {
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff')
     .text(`LACRA-EUDR-${packId} | ${pageTitle} | Generated: ${currentDate}`, 60, 770);
  doc.fontSize(8).fillColor('#a0aec0')
     .text('www.lacra.gov.lr | compliance@lacra.gov.lr', 300, 770);

  const qrData = JSON.stringify({
    packId: packId,
    certificate: pageTitle,
    date: currentDate,
    farmer: farmerName,
    company: exportCompany,
    verification: `LACRA-EUDR-${packId}-${pageTitle.replace(/\s+/g, '')}`
  });

  try {
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 40,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });
    
    const qrBuffer = Buffer.from(qrCodeDataURL.split(',')[1], 'base64');
    doc.image(qrBuffer, 520, 755, { width: 35, height: 35 });
    doc.fontSize(6).fillColor('#a0aec0').text('Scan to verify', 520, 792);
  } catch (error) {
    doc.fontSize(6).fillColor('#a0aec0').text(`Verify: ${packId.slice(-6)}`, 520, 775);
  }
}

async function generatePage1(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  // Header
  doc.rect(0, 0, 595, 120).fill('#1a365d');
  doc.fontSize(32).fillColor('#ffffff').font('Helvetica-Bold').text('EUDR COMPLIANCE', 60, 30);
  doc.fontSize(24).fillColor('#e2e8f0').text('CERTIFICATION PACK', 60, 70);
  
  // Info
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE INFORMATION', 70, 180);
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Certificate Holder:', 70, 220)
     .text('Farm Location:', 70, 245)
     .text('Issue Date:', 70, 270)
     .text('Export Company:', 70, 295);
  
  doc.fontSize(12).fillColor('#4a5568')
     .text(farmerData.name, 200, 220)
     .text(`${farmerData.county}, Liberia`, 200, 245)
     .text(currentDate, 200, 270)
     .text(exportData.company, 200, 295);
     
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS CERTIFICATION PACK', 70, 350);
  doc.fontSize(10).fillColor('#4a5568')
     .text('This comprehensive EUDR Compliance Certification Pack contains six specialized reports that demonstrate', 70, 375)
     .text('full compliance with the European Union Deforestation Regulation (EUDR).', 70, 390);
  
  await generateQRFooter(doc, packId, currentDate, 'Cover Page', farmerData.name, exportData.company);
}

async function generatePage2(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(22).fillColor('#ffffff').font('Helvetica-Bold').text('EXPORT ELIGIBILITY CERTIFICATE', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('EXPORT ELIGIBILITY ASSESSMENT', 70, 140);
  doc.fontSize(12).fillColor('#4a5568').text('Quality Standards: 98%', 80, 180);
  doc.fontSize(12).fillColor('#4a5568').text('Documentation: 96%', 80, 200);
  
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS EXPORT ELIGIBILITY CERTIFICATE', 70, 350);
  doc.fontSize(9).fillColor('#4a5568')
     .text('This certificate verifies that the agricultural commodity meets all regulatory standards required', 70, 370)
     .text('for international export under EUDR guidelines.', 70, 385);
  
  await generateQRFooter(doc, packId, currentDate, 'Export Eligibility', farmerData.name, exportData.company);
}

async function generatePage3(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(22).fillColor('#ffffff').font('Helvetica-Bold').text('COMPLIANCE ASSESSMENT REPORT', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('COMPLIANCE ASSESSMENT RESULTS', 70, 140);
  doc.fontSize(12).fillColor('#4a5568').text('EUDR Compliance: 95/100', 80, 180);
  doc.fontSize(12).fillColor('#4a5568').text('Forest Protection: 98/100', 80, 200);
  
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS COMPLIANCE ASSESSMENT REPORT', 70, 350);
  doc.fontSize(9).fillColor('#4a5568')
     .text('This comprehensive assessment evaluates compliance across all key EUDR requirements including forest', 70, 370)
     .text('protection measures and environmental sustainability.', 70, 385);
  
  await generateQRFooter(doc, packId, currentDate, 'Compliance Assessment', farmerData.name, exportData.company);
}

async function generatePage4(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(22).fillColor('#ffffff').font('Helvetica-Bold').text('DEFORESTATION RISK ANALYSIS', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('FOREST RISK ASSESSMENT', 70, 140);
  doc.fontSize(12).fillColor('#4a5568').text('Deforestation Risk: 2%', 80, 180);
  doc.fontSize(12).fillColor('#4a5568').text('Forest Degradation: 1%', 80, 200);
  
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS DEFORESTATION ANALYSIS', 70, 350);
  doc.fontSize(9).fillColor('#4a5568')
     .text('This analysis utilizes satellite monitoring and geospatial data to assess deforestation risks associated', 70, 370)
     .text('with the commodity production area.', 70, 385);
  
  await generateQRFooter(doc, packId, currentDate, 'Deforestation Analysis', farmerData.name, exportData.company);
}

async function generatePage5(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(22).fillColor('#ffffff').font('Helvetica-Bold').text('DUE DILIGENCE STATEMENT', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('DUE DILIGENCE VERIFICATION', 70, 140);
  doc.fontSize(12).fillColor('#4a5568').text('✓ Geolocation coordinates verified', 80, 180);
  doc.fontSize(12).fillColor('#4a5568').text('✓ Supply chain documentation reviewed', 80, 200);
  
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS DUE DILIGENCE STATEMENT', 70, 350);
  doc.fontSize(9).fillColor('#4a5568')
     .text('This statement confirms completion of all due diligence procedures required under EUDR Article 8.', 70, 370)
     .text('It includes verification of geolocation data and supply chain documentation.', 70, 385);
  
  await generateQRFooter(doc, packId, currentDate, 'Due Diligence', farmerData.name, exportData.company);
}

async function generatePage6(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(22).fillColor('#ffffff').font('Helvetica-Bold').text('SUPPLY CHAIN TRACEABILITY', 60, 30);
  
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('SUPPLY CHAIN TRACEABILITY', 70, 140);
  doc.fontSize(12).fillColor('#4a5568').text('✓ Complete chain of custody documented', 80, 180);
  doc.fontSize(12).fillColor('#4a5568').text('✓ All stakeholders verified and certified', 80, 200);
  
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS SUPPLY CHAIN TRACEABILITY REPORT', 70, 350);
  doc.fontSize(9).fillColor('#4a5568')
     .text('This report provides complete supply chain traceability from origin to export destination, documenting', 70, 370)
     .text('each step in the commodity journey.', 70, 385);
  
  await generateQRFooter(doc, packId, currentDate, 'Supply Chain Traceability', farmerData.name, exportData.company);
}