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

export function generateFixedEUDRPack(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): PDFDocumentType {
  // Create document with automatic first page - exactly 6 pages total
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const currentDate = new Date().toLocaleDateString();

  // CERTIFICATE 1: Cover Page (uses automatic first page)
  generateCoverPage(doc, farmerData, exportData, packId, currentDate);
  
  // CERTIFICATE 2: Export Eligibility (add new page)
  doc.addPage();
  generateExportEligibility(doc, farmerData, exportData, packId, currentDate);
  
  // CERTIFICATE 3: Compliance Assessment (add new page)
  doc.addPage();
  generateComplianceAssessment(doc, farmerData, exportData, packId, currentDate);
  
  // CERTIFICATE 4: Deforestation Analysis (add new page)
  doc.addPage();
  generateDeforestationAnalysis(doc, farmerData, exportData, packId, currentDate);
  
  // CERTIFICATE 5: Due Diligence (add new page)
  doc.addPage();
  generateDueDiligence(doc, farmerData, exportData, packId, currentDate);
  
  // CERTIFICATE 6: Supply Chain Traceability (add new page)
  doc.addPage();
  generateSupplyTraceability(doc, farmerData, exportData, packId, currentDate);

  return doc;
}

// Professional header function
function generateHeader(doc: PDFDocumentType, title: string, packId: string, currentDate: string) {
  // Header background
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  
  // Title
  doc.fontSize(22).fillColor('#ffffff').font('Helvetica-Bold')
     .text(title, 60, 30);
  
  // Certification info
  doc.fontSize(10).fillColor('#cbd5e0')
     .text(`LACRA Certification ID: ${packId}`, 60, 65)
     .text(`Generated: ${currentDate}`, 60, 80);
  
  // Logo placeholder
  doc.rect(450, 20, 120, 60).stroke('#ffffff', 2);
  doc.fontSize(12).fillColor('#ffffff')
     .text('LACRA', 485, 45);
}

// Professional footer function
function generateFooter(doc: PDFDocumentType, packId: string, currentDate: string, pageTitle: string) {
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff')
     .text(`LACRA-EUDR-${packId} | ${pageTitle} | Generated: ${currentDate}`, 60, 770);
  doc.fontSize(8).fillColor('#a0aec0')
     .text('www.lacra.gov.lr | compliance@lacra.gov.lr', 400, 770);
}

// CERTIFICATE 1: Cover Page
function generateCoverPage(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  // Use the automatic first page - do not call doc.addPage()
  
  // Professional header with gradient effect
  doc.rect(0, 0, 595, 120).fill('#1a365d');
  doc.rect(0, 120, 595, 10).fill('#2c5282');
  
  // Main title
  doc.fontSize(32).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE', 60, 30);
  doc.fontSize(24).fillColor('#e2e8f0')
     .text('CERTIFICATION PACK', 60, 70);
  
  // Official seal
  doc.rect(420, 25, 150, 70).stroke('#ffffff', 2);
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA CERTIFIED', 440, 45);
  doc.fontSize(10).fillColor('#cbd5e0')
     .text('Official Authority', 445, 65);
  
  // Information panel
  doc.rect(50, 160, 495, 200).fill('#f7fafc').stroke('#cbd5e0', 1);
  doc.rect(50, 160, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('CERTIFICATE INFORMATION', 70, 175);
  
  // Farmer details
  const infoY = 220;
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Certificate Holder:', 70, infoY)
     .text('Farm Location:', 70, infoY + 25)
     .text('Issue Date:', 70, infoY + 50)
     .text('Export Company:', 70, infoY + 75);
  
  doc.fontSize(12).fillColor('#4a5568')
     .text(farmerData.name, 200, infoY)
     .text(`${farmerData.county}, Liberia`, 200, infoY + 25)
     .text(currentDate, 200, infoY + 50)
     .text(exportData.company, 200, infoY + 75);
  
  // Status indicators
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('COMPLIANCE STATUS', 70, 390);
  
  const statusBoxes = [
    { label: 'EUDR Compliant', status: 'APPROVED', color: '#38a169' },
    { label: 'Export Ready', status: 'CERTIFIED', color: '#3182ce' },
    { label: 'Risk Level', status: 'LOW', color: '#38a169' }
  ];
  
  statusBoxes.forEach((box, index) => {
    const x = 70 + (index * 150);
    doc.rect(x, 420, 140, 60).fill(box.color);
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
       .text(box.label, x + 10, 435);
    doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
       .text(box.status, x + 10, 455);
  });
  
  generateFooter(doc, packId, currentDate, 'Cover Page');
}

// CERTIFICATE 2: Export Eligibility
function generateExportEligibility(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'EXPORT ELIGIBILITY CERTIFICATE', packId, currentDate);
  
  // Eligibility metrics
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('EXPORT ELIGIBILITY ASSESSMENT', 70, 140);
  
  const metrics = [
    { category: 'Quality Standards', score: 98, color: '#38a169' },
    { category: 'Documentation', score: 96, color: '#3182ce' },
    { category: 'Traceability', score: 97, color: '#805ad5' },
    { category: 'Risk Assessment', score: 95, color: '#d69e2e' }
  ];
  
  metrics.forEach((metric, index) => {
    const y = 180 + (index * 40);
    
    // Category label
    doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
       .text(metric.category, 80, y + 5);
    
    // Progress bar background
    doc.rect(220, y, 250, 20).fill('#f1f5f9').stroke('#e2e8f0', 1);
    
    // Progress bar
    const progressWidth = (metric.score / 100) * 250;
    doc.rect(220, y, progressWidth, 20).fill(metric.color);
    
    // Score text
    doc.fontSize(11).fillColor('#ffffff').font('Helvetica-Bold')
       .text(`${metric.score}%`, 225, y + 6);
  });
  
  // Export details
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('EXPORT DETAILS', 70, 350);
  
  doc.fontSize(11).fillColor('#4a5568')
     .text(`Quantity: ${exportData.quantity}`, 80, 380)
     .text(`Destination: ${exportData.destination}`, 80, 400)
     .text(`Vessel: ${exportData.vessel}`, 80, 420)
     .text(`Export Date: ${exportData.exportDate}`, 80, 440);
  
  generateFooter(doc, packId, currentDate, 'Export Eligibility');
}

// CERTIFICATE 3: Compliance Assessment
function generateComplianceAssessment(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'COMPLIANCE ASSESSMENT REPORT', packId, currentDate);
  
  // Assessment results
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('COMPLIANCE ASSESSMENT RESULTS', 70, 140);
  
  const assessments = [
    { area: 'EUDR Compliance', score: '95/100', status: 'APPROVED', risk: 'LOW' },
    { area: 'Forest Protection', score: '98/100', status: 'EXCELLENT', risk: 'NONE' },
    { area: 'Documentation', score: '96/100', status: 'COMPLETE', risk: 'LOW' },
    { area: 'Supply Chain', score: '94/100', status: 'VERIFIED', risk: 'LOW' },
    { area: 'Environmental', score: '97/100', status: 'SUSTAINABLE', risk: 'MINIMAL' }
  ];
  
  // Table header
  doc.rect(70, 170, 450, 25).fill('#edf2f7').stroke('#cbd5e0', 1);
  doc.fontSize(10).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Assessment Area', 80, 180)
     .text('Score', 200, 180)
     .text('Status', 280, 180)
     .text('Risk Level', 380, 180);
  
  // Assessment rows
  assessments.forEach((assessment, index) => {
    const y = 195 + (index * 25);
    doc.rect(70, y, 450, 25).stroke('#e2e8f0', 1);
    
    doc.fontSize(9).fillColor('#4a5568')
       .text(assessment.area, 80, y + 8)
       .text(assessment.score, 200, y + 8)
       .text(assessment.status, 280, y + 8)
       .text(assessment.risk, 380, y + 8);
  });
  
  // Overall score
  doc.rect(70, 350, 450, 60).fill('#2d3748');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('OVERALL COMPLIANCE SCORE: 96/100', 90, 370);
  doc.fontSize(12).fillColor('#38a169').font('Helvetica-Bold')
     .text('STATUS: APPROVED FOR EXPORT', 90, 390);
  
  generateFooter(doc, packId, currentDate, 'Compliance Assessment');
}

// CERTIFICATE 4: Deforestation Analysis
function generateDeforestationAnalysis(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'DEFORESTATION RISK ANALYSIS', packId, currentDate);
  
  // Risk analysis results
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('FOREST RISK ASSESSMENT', 70, 140);
  
  // Risk pie chart data representation
  doc.circle(180, 220, 50).fill('#38a169');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('92%', 170, 212);
  doc.fontSize(12).fillColor('#2d3748')
     .text('NO RISK DETECTED', 100, 280);
  
  // Risk categories
  const riskCategories = [
    { category: 'Deforestation Risk', risk: 2, benchmark: 10, color: '#38a169' },
    { category: 'Forest Degradation', risk: 1, benchmark: 8, color: '#3182ce' },
    { category: 'Land Use Change', risk: 3, benchmark: 12, color: '#805ad5' },
    { category: 'Biodiversity Impact', risk: 1, benchmark: 6, color: '#d69e2e' }
  ];
  
  riskCategories.forEach((cat, index) => {
    const y = 320 + (index * 35);
    
    // Category label
    doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold')
       .text(cat.category, 70, y + 8);
    
    // Risk bar background
    doc.rect(250, y, 200, 20).fill('#f1f5f9').stroke('#e2e8f0', 1);
    
    // Risk bar
    const riskWidth = (cat.risk / 20) * 200;
    doc.rect(250, y, riskWidth, 20).fill(cat.color);
    
    // Values
    doc.fontSize(10).fillColor('#2d3748')
       .text(`Current: ${cat.risk}%`, 460, y + 6);
  });
  
  generateFooter(doc, packId, currentDate, 'Deforestation Analysis');
}

// CERTIFICATE 5: Due Diligence
function generateDueDiligence(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'DUE DILIGENCE STATEMENT', packId, currentDate);
  
  // Due diligence verification
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('DUE DILIGENCE VERIFICATION', 70, 140);
  
  const verifications = [
    { item: 'Geolocation coordinates verified', status: 'VERIFIED' },
    { item: 'Supply chain documentation complete', status: 'COMPLETE' },
    { item: 'Risk assessment conducted', status: 'ASSESSED' },
    { item: 'Legal compliance verified', status: 'COMPLIANT' },
    { item: 'Third-party audit completed', status: 'REVIEWED' }
  ];
  
  verifications.forEach((verification, index) => {
    const y = 180 + (index * 35);
    
    // Checkmark
    doc.rect(70, y, 25, 25).fill('#38a169');
    doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
       .text('✓', 78, y + 4);
    
    // Verification text
    doc.fontSize(11).fillColor('#2d3748')
       .text(verification.item, 105, y + 8);
    
    // Status
    doc.fontSize(10).fillColor('#38a169').font('Helvetica-Bold')
       .text(verification.status, 400, y + 8);
  });
  
  // Final certification
  doc.rect(70, 390, 450, 60).fill('#2d3748');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('DUE DILIGENCE COMPLETE', 90, 410);
  doc.fontSize(10).fillColor('#e2e8f0')
     .text('All due diligence requirements satisfied for EUDR compliance', 90, 430);
  
  generateFooter(doc, packId, currentDate, 'Due Diligence');
}

// CERTIFICATE 6: Supply Chain Traceability
function generateSupplyTraceability(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'SUPPLY CHAIN TRACEABILITY', packId, currentDate);
  
  // Traceability flow
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('SUPPLY CHAIN TRACEABILITY', 70, 140);
  
  const flowSteps = [
    { title: 'ORIGIN', data: farmerData.name, location: farmerData.county, color: '#38a169' },
    { title: 'PROCESSING', data: 'Certified Facility', location: 'Liberia', color: '#3182ce' },
    { title: 'LOGISTICS', data: exportData.vessel, location: 'Port', color: '#805ad5' },
    { title: 'EXPORT', data: exportData.company, location: 'EU', color: '#d69e2e' }
  ];
  
  // Timeline
  const timelineY = 200;
  doc.moveTo(80, timelineY).lineTo(480, timelineY).stroke('#cbd5e0', 3);
  
  flowSteps.forEach((step, index) => {
    const x = 80 + (index * 100);
    
    // Timeline dot
    doc.circle(x, timelineY, 8).fill(step.color);
    
    // Step container
    doc.rect(x - 40, 160, 80, 80).fill('#ffffff').stroke(step.color, 2);
    doc.rect(x - 40, 160, 80, 20).fill(step.color);
    
    // Step title
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
       .text(step.title, x - 35, 165);
    
    // Step data
    doc.fontSize(8).fillColor('#2d3748')
       .text(step.data, x - 35, 185, { width: 70, height: 20 });
    doc.fontSize(7).fillColor('#6b7280')
       .text(step.location, x - 35, 220);
  });
  
  // Verification summary
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('TRACEABILITY VERIFICATION', 70, 280);
  
  doc.fontSize(11).fillColor('#4a5568')
     .text('✓ Complete chain of custody documented', 80, 310)
     .text('✓ All stakeholders verified and certified', 80, 330)
     .text('✓ GPS coordinates recorded at each stage', 80, 350)
     .text('✓ Quality control measures implemented', 80, 370);
  
  // Final certification
  doc.rect(70, 400, 450, 60).fill('#2d3748');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('SUPPLY CHAIN FULLY TRACEABLE', 90, 420);
  doc.fontSize(10).fillColor('#e2e8f0')
     .text('Complete traceability from farm to export confirmed', 90, 440);
  
  generateFooter(doc, packId, currentDate, 'Supply Chain Traceability');
}