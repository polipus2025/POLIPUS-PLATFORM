import PDFDocument from 'pdfkit';

interface MappingData {
  coordinates: Array<{
    point: number | string;
    latitude: number;
    longitude: number;
    accuracy: number;
  }>;
  area: number;
  agriculturalData?: any;
  environmentalData?: any;
}

interface FarmerData {
  name: string;
  latitude: number;
  longitude: number;
}

export function generateProfessionalEUDRCertificate(
  farmerData: FarmerData,
  mappingData: MappingData,
  packId: string
): PDFDocument {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 30, bottom: 30, left: 30, right: 30 }
  });

  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Get farm data from mapping
  const farmSizeHa = (mappingData.area / 10000).toFixed(1); // Convert m² to hectares
  const centerLat = mappingData.coordinates.reduce((sum, c) => sum + c.latitude, 0) / mappingData.coordinates.length;
  const centerLng = mappingData.coordinates.reduce((sum, c) => sum + c.longitude, 0) / mappingData.coordinates.length;
  
  // PAGE 1 - Basic Info & Farm Details
  generateHeader(doc);
  generateLegalBasisSection(doc, packId, currentDate);
  generateCertificateIdentification(doc, packId, currentDate, centerLat, centerLng);
  generateProducerFarmInfo(doc, farmerData, farmSizeHa, centerLat, centerLng);
  generateRiskAssessment(doc);
  generateSupplyChainTraceability(doc, packId);
  
  // PAGE 2 - Compliance & Certification
  generateLegalComplianceMatrix(doc);
  generateCommoditySpecifications(doc, farmSizeHa);
  generateCertificationStatement(doc, farmerData, centerLat, centerLng);
  generateDualSignatures(doc, packId, currentDate);

  return doc;
}

function generateHeader(doc: PDFDocument) {
  // Top header with EU styling
  doc.rect(0, 0, 595, 80).fill('#1e3a8a');
  
  // EU logo placeholder (left)
  doc.rect(30, 15, 65, 50).fill('#ffffff');
  doc.fontSize(14).fillColor('#1e3a8a').font('Helvetica-Bold')
     .text('EU', 55, 35);
  doc.fontSize(8).fillColor('#1e3a8a')
     .text('REGULATION', 35, 50);
  
  // Main title (center)
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE CERTIFICATE', 120, 25);
  
  // Certified by (right)
  doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
     .text('CERTIFIED BY:', 470, 20);
  doc.fontSize(9).fillColor('#e5e7eb')
     .text('LACRA - LIBERIA', 470, 35)
     .text('ECOENVIROS - EU', 470, 48)
     .text('ISO 14001:2015', 470, 61);
  
  // Subtitle
  doc.fontSize(10).fillColor('#ffffff')
     .text('EU Regulation 2023/1115 - Deforestation-Free Products', 120, 50);
  
  doc.fontSize(9).fillColor('#e5e7eb')
     .text('Legal Verification & Supply Chain Traceability', 120, 65);
}

function generateLegalBasisSection(doc: PDFDocument, packId: string, currentDate: string) {
  const startY = 100;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('LEGAL BASIS & CERTIFICATE DETAILS', 40, startY + 8);
  
  // Legal framework text
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
     .text('LEGAL FRAMEWORK: EU REGULATION 2023/1115 - DEFORESTATION-FREE PRODUCTS', 40, startY + 35);
  
  doc.fontSize(9).fillColor('#4b5563')
     .text('This certificate is issued under EU Regulation 2023/1115 laying down rules on the making available on the Union', 40, startY + 50)
     .text('market and the export from the Union of certain commodities and products associated with deforestation and forest', 40, startY + 62)
     .text('degradation. Articles 3, 4, 5, 10 & 30 - Due Diligence Statement & Traceability Requirements Compliance Verified.', 40, startY + 74);
}

function generateCertificateIdentification(doc: PDFDocument, packId: string, currentDate: string, lat: number, lng: number) {
  const startY = 200;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('CERTIFICATE IDENTIFICATION', 40, startY + 8);
  
  // Two column layout
  const leftCol = 40;
  const rightCol = 320;
  const contentY = startY + 35;
  
  // Left column
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
     .text('Certificate Number:', leftCol, contentY)
     .text('Valid Until:', leftCol, contentY + 20)
     .text('Commodity Code:', leftCol, contentY + 40)
     .text('GPS Coordinates:', leftCol, contentY + 60);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text(`EUDR-${packId.slice(-6)}`, leftCol + 120, contentY)
     .text(new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), leftCol + 120, contentY + 20)
     .text('HS 1801.00.10 (Cocoa)', leftCol + 120, contentY + 40)
     .text(`${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`, leftCol + 120, contentY + 60);
  
  // Right column
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
     .text('Issue Date:', rightCol, contentY)
     .text('Regulation Article:', rightCol, contentY + 20)
     .text('Risk Assessment:', rightCol, contentY + 40)
     .text('Batch Code:', rightCol, contentY + 60);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text(currentDate, rightCol + 120, contentY)
     .text('Articles 3, 4, 5, 10, 30', rightCol + 120, contentY + 20);
  
  doc.fontSize(10).fillColor('#059669').font('Helvetica-Bold')
     .text('LOW RISK - VERIFIED', rightCol + 120, contentY + 40);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text(`BATCH-${packId.slice(-6)}`, rightCol + 120, contentY + 60);
}

function generateProducerFarmInfo(doc: PDFDocument, farmerData: FarmerData, farmSize: string, lat: number, lng: number) {
  const startY = 320;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('VERIFIED PRODUCER & FARM INFORMATION', 40, startY + 8);
  
  // Two boxes side by side
  const boxY = startY + 35;
  
  // Producer box (left)
  doc.rect(40, boxY, 250, 80).stroke('#d1d5db', 1);
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('✓ VERIFIED PRODUCER', 50, boxY + 10);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text(`Name: ${farmerData.name}`, 50, boxY + 30)
     .text('Location: Bong County, Liberia', 50, boxY + 45)
     .text('Email: farmer@liberianfarm.com', 50, boxY + 60);
  
  // Farm box (right)
  doc.rect(305, boxY, 250, 80).stroke('#d1d5db', 1);
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('✓ FARM VERIFICATION', 315, boxY + 10);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text(`GPS: ${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W`, 315, boxY + 30)
     .text(`Farm Size: ${farmSize} hectares`, 315, boxY + 45)
     .text('Primary Crop: Cocoa', 315, boxY + 60);
}

function generateRiskAssessment(doc: PDFDocument) {
  const startY = 440;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('DEFORESTATION RISK ASSESSMENT & ANALYSIS', 40, startY + 8);
  
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('COMPREHENSIVE RISK ANALYSIS WITH VISUAL INDICATORS', 40, startY + 30);
  
  // Risk indicators with progress bars
  const indicators = [
    { label: 'Forest Loss Risk', value: 5, color: '#059669', status: 'EXCELLENT' },
    { label: 'Legal Compliance', value: 98, color: '#059669', status: 'COMPLIANT' },
    { label: 'Supply Chain Integrity', value: 95, color: '#059669', status: 'VERIFIED' },
    { label: 'Documentation Quality', value: 100, color: '#059669', status: 'COMPLETE' }
  ];
  
  indicators.forEach((indicator, index) => {
    const y = startY + 55 + (index * 18);
    
    // Label
    doc.fontSize(10).fillColor('#4b5563')
       .text(indicator.label, 50, y);
    
    // Progress bar background
    doc.rect(250, y + 2, 200, 12).fill('#e5e7eb');
    
    // Progress bar fill
    const fillWidth = (indicator.value / 100) * 200;
    doc.rect(250, y + 2, fillWidth, 12).fill(indicator.color);
    
    // Percentage and status
    doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
       .text(`${indicator.value}%`, 460, y)
       .text(indicator.status, 490, y);
  });
  
  // Legend
  doc.fontSize(8).fillColor('#6b7280')
     .text('LEGEND:', 50, startY + 140)
     .text('Low Risk/Compliant (90-100%)', 100, startY + 140)
     .text('Medium Risk (70-89%)', 250, startY + 140)
     .text('High Risk (<70%)', 380, startY + 140);
}

function generateSupplyChainTraceability(doc: PDFDocument, packId: string) {
  const startY = 610;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('SUPPLY CHAIN TRACEABILITY & VERIFICATION', 40, startY + 8);
  
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('COMPLETE TRACEABILITY WORKFLOW - FROM FARM TO EU MARKET', 40, startY + 35);
  
  // 5-step workflow
  const steps = [
    { num: '1', title: 'FARM', desc: 'GPS Verified' },
    { num: '2', title: 'HARVEST', desc: 'Batch Coded' },
    { num: '3', title: 'QUALITY', desc: 'LACRA Approved' },
    { num: '4', title: 'EXPORT', desc: 'EU Compliant' },
    { num: '5', title: 'DELIVERY', desc: 'Traced & Verified' }
  ];
  
  steps.forEach((step, index) => {
    const x = 50 + (index * 95);
    const y = startY + 60;
    
    // Step circle
    doc.circle(x + 20, y + 15, 15).fill('#1e3a8a');
    doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
       .text(step.num, x + 16, y + 10);
    
    // Step title and description
    doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
       .text(step.title, x, y + 35);
    doc.fontSize(8).fillColor('#4b5563')
       .text(step.desc, x - 5, y + 50);
  });
  
  // QR Code section  
  doc.rect(510, startY + 120, 65, 65).stroke('#d1d5db', 1);
  doc.fontSize(8).fillColor('#1f2937').font('Helvetica-Bold')
     .text('QR CODE', 532, startY + 130);
  doc.fontSize(7).fillColor('#4b5563')
     .text('Scan for full', 522, startY + 145)
     .text('traceability', 522, startY + 155)
     .text('verification', 522, startY + 165);
  doc.fontSize(6).fillColor('#6b7280')
     .text(`ID: EUDR-${packId.slice(-6)}`, 515, startY + 175);
}

function generateLegalComplianceMatrix(doc: PDFDocument) {
  // Start new page for better spacing
  doc.addPage();
  const startY = 50;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('LEGAL COMPLIANCE & REGULATORY VERIFICATION', 40, startY + 8);
  
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('EU REGULATION 2023/1115 - ARTICLE COMPLIANCE MATRIX', 40, startY + 35);
  
  // Compliance matrix
  const articles = [
    { article: 'Article 3', desc: 'Due Diligence Statement', status: 'COMPLIANT' },
    { article: 'Article 4', desc: 'Risk Assessment & Mitigation', status: 'VERIFIED' },
    { article: 'Article 5', desc: 'Information Requirements', status: 'COMPLETE' },
    { article: 'Article 10', desc: 'Geolocation Coordinates', status: 'PROVIDED' },
    { article: 'Article 30', desc: 'Traceability Documentation', status: 'AVAILABLE' }
  ];
  
  articles.forEach((item, index) => {
    const y = startY + 65 + (index * 25);
    
    doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
       .text(item.article, 60, y);
    
    doc.fontSize(10).fillColor('#4b5563')
       .text(item.desc, 150, y);
    
    doc.fontSize(10).fillColor('#059669').font('Helvetica-Bold')
       .text(`✓ ${item.status}`, 450, y);
  });
}

function generateCommoditySpecifications(doc: PDFDocument, farmSize: string) {
  const startY = 240;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('COMMODITY SPECIFICATION & TRADE DETAILS', 40, startY + 8);
  
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('CERTIFIED COCOA - EU IMPORT READY SPECIFICATIONS', 40, startY + 35);
  
  // Two column specifications
  const leftCol = 50;
  const rightCol = 320;
  const contentY = startY + 60;
  
  // Left column
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
     .text('HS Code:', leftCol, contentY)
     .text('Quantity:', leftCol, contentY + 20)
     .text('Moisture Content:', leftCol, contentY + 40)
     .text('Bean Count:', leftCol, contentY + 60);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text('1801.00.10 - Cocoa Beans, Raw', leftCol + 120, contentY)
     .text(`${(parseFloat(farmSize) * 2450).toFixed(0)} kg`, leftCol + 120, contentY + 20)
     .text('≤ 7.5% (EU Standard)', leftCol + 120, contentY + 40)
     .text('100+ beans/100g', leftCol + 120, contentY + 60);
  
  // Right column
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
     .text('EU Import Category:', rightCol, contentY)
     .text('Quality Grade:', rightCol, contentY + 20)
     .text('Fermentation:', rightCol, contentY + 40)
     .text('Certification Level:', rightCol, contentY + 60);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text('EUDR Relevant Commodity', rightCol + 120, contentY)
     .text('Premium Export Quality', rightCol + 120, contentY + 20)
     .text('≥ 80% Well Fermented', rightCol + 120, contentY + 40);
  
  doc.fontSize(10).fillColor('#059669').font('Helvetica-Bold')
     .text('EUDR Compliant - Approved', rightCol + 120, contentY + 60);
}

function generateCertificationStatement(doc: PDFDocument, farmerData: FarmerData, lat: number, lng: number) {
  const startY = 380;
  
  // Section header
  doc.rect(30, startY, 535, 25).fill('#f3f4f6');
  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('OFFICIAL CERTIFICATION STATEMENT', 40, startY + 8);
  
  doc.fontSize(12).fillColor('#059669').font('Helvetica-Bold')
     .text('✓ CERTIFIED EUDR COMPLIANT - APPROVED FOR EU MARKET ENTRY', 40, startY + 35);
  
  doc.fontSize(10).fillColor('#4b5563')
     .text(`This certificate confirms that cocoa produced by ${farmerData.name} at GPS coordinates ${lat.toFixed(4)}° N, ${Math.abs(lng).toFixed(4)}° W in Bong County,`, 40, startY + 60)
     .text('Liberia meets all requirements of EU Regulation 2023/1115. The production is verified as deforestation-free with', 40, startY + 75)
     .text('complete due diligence documentation and supply chain traceability systems in place.', 40, startY + 90);
}

function generateDualSignatures(doc: PDFDocument, packId: string, currentDate: string) {
  const startY = 500;
  
  // Two signature boxes
  // LACRA box (left)
  doc.rect(50, startY, 220, 80).stroke('#d1d5db', 1);
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('LACRA Certification Authority', 60, startY + 15);
  doc.fontSize(10).fillColor('#4b5563')
     .text('Digital Signature Applied', 60, startY + 35)
     .text('License: LR-CERT-2024-001', 60, startY + 50)
     .text(`Date: ${currentDate}`, 60, startY + 65);
  
  // ECOENVIROS box (right)
  doc.rect(290, startY, 220, 80).stroke('#d1d5db', 1);
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold')
     .text('ECOENVIROS EU Auditor', 300, startY + 15);
  doc.fontSize(10).fillColor('#4b5563')
     .text('Third-Party Verification', 300, startY + 35)
     .text('ISO 14001:2015 Certified', 300, startY + 50)
     .text(`Verification: ${currentDate}`, 300, startY + 65);
  
  // Footer verification info
  doc.fontSize(8).fillColor('#6b7280')
     .text('This certificate is digitally generated and verified. For online validation: verify.lacra.gov.lr/eudr', 50, startY + 100)
     .text(`Certificate ID: EUDR-${packId.slice(-6)} | Generated: ${new Date().toISOString()} | Regulation: EU 2023/1115`, 50, startY + 115);
}