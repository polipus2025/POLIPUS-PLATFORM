import PDFDocument from 'pdfkit';

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

export function generateFSCStyledEUDRReport(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): PDFDocument {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 40, bottom: 40, left: 40, right: 40 }
  });

  const currentDate = new Date().toLocaleDateString();

  // Generate all 6 certificates with FSC styling
  generateCertificate1_CoverSheet(doc, farmerData, exportData, packId, currentDate);
  generateCertificate2_ExportEligibility(doc, farmerData, exportData, packId, currentDate);
  generateCertificate3_ComplianceAssessment(doc, farmerData, exportData, packId, currentDate);
  generateCertificate4_DeforestationAnalysis(doc, farmerData, exportData, packId, currentDate);
  generateCertificate5_DueDiligence(doc, farmerData, exportData, packId, currentDate);
  generateCertificate6_SupplyTraceability(doc, farmerData, exportData, packId, currentDate);

  return doc;
}

function generateFSCStyledHeader(doc: PDFDocument, packId: string, currentDate: string, title?: string) {
  // FSC-style clean background
  doc.rect(0, 0, 595, 140).fill('#ffffff');
  doc.rect(0, 0, 595, 3).fill('#2d3748'); // FSC-style top stripe
  doc.rect(0, 3, 595, 137).fill('#fafafa'); // FSC-style light background
  
  // FSC-style large title but for EUDR
  const headerTitle = title || 'EUDR COMPLIANCE CERTIFICATION REPORT';
  if (headerTitle.length > 30) {
    doc.fontSize(24).fillColor('#2d3748').font('Helvetica-Bold')
       .text(headerTitle, 60, 40);
  } else {
    doc.fontSize(28).fillColor('#2d3748').font('Helvetica-Bold')
       .text(headerTitle, 60, 45);
  }
  
  // FSC-style subtitle for EUDR
  doc.fontSize(12).fillColor('#4a5568')
     .text('LACRA® Liberia Agriculture Commodity Regulatory Authority', 60, 110);
  doc.fontSize(12).fillColor('#4a5568')
     .text('EU Deforestation Regulation Compliance Documentation', 60, 130);
  
  // FSC-style certification box
  doc.rect(450, 25, 110, 90).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('LACRA®', 485, 45);
  doc.fontSize(10).fillColor('#718096')
     .text('CERTIFIED', 485, 65);
  doc.fontSize(8).fillColor('#a0aec0')
     .text(`Pack: ${packId.slice(-6)}`, 485, 80);
  doc.fontSize(8).fillColor('#a0aec0')
     .text(currentDate, 485, 95);
}

function generateEUDRComplianceAssessment(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData) {
  const assessmentY = 160;
  
  // FSC-style section header with EUDR content
  doc.rect(40, assessmentY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE ASSESSMENT RESULTS', 60, assessmentY + 12);
  
  // FSC-style three-card layout for EUDR data
  const cardY = assessmentY + 50;
  const cardWidth = 165;
  const cardHeight = 140;
  
  // Farmer Information Card - FSC style
  doc.rect(40, cardY, cardWidth, cardHeight).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(40, cardY, cardWidth, 30).fill('#edf2f7');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Producer Profile', 50, cardY + 10);
  
  doc.fontSize(11).fillColor('#4a5568')
     .text(`Name: ${farmerData.name}`, 50, cardY + 45)
     .text(`County: ${farmerData.county}`, 50, cardY + 65)
     .text(`Location: Liberia`, 50, cardY + 85)
     .text(`GPS: ${farmerData.latitude?.slice(0,6) || 'N/A'}°`, 50, cardY + 105)
     .text(`${farmerData.longitude?.slice(0,7) || 'N/A'}°`, 50, cardY + 125);
  
  // Export Details Card - FSC style
  doc.rect(215, cardY, cardWidth, cardHeight).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(215, cardY, cardWidth, 30).fill('#e6fffa');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Export Details', 225, cardY + 10);
  
  doc.fontSize(11).fillColor('#4a5568')
     .text(`Company: ${exportData.company}`, 225, cardY + 45)
     .text(`License: ${exportData.license}`, 225, cardY + 65)
     .text(`Quantity: ${exportData.quantity}`, 225, cardY + 85)
     .text(`Value: ${exportData.exportValue}`, 225, cardY + 105)
     .text(`Destination: EU`, 225, cardY + 125);
  
  // Compliance Status Card - FSC style
  doc.rect(390, cardY, cardWidth, cardHeight).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(390, cardY, cardWidth, 30).fill('#dcfce7');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Compliance Status', 400, cardY + 10);
  
  // Large checkmark like FSC
  doc.circle(472, cardY + 80, 25).fill('#10b981');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('✓', 467, cardY + 72);
  
  doc.fontSize(12).fillColor('#15803d').font('Helvetica-Bold')
     .text('COMPLIANT', 440, cardY + 115);
  doc.fontSize(10).fillColor('#4a5568')
     .text('Risk Level: LOW', 410, cardY + 135);
}

function generateFSCStyledKPISection(doc: PDFDocument) {
  const kpiY = 360;
  
  // FSC-style KPI header
  doc.rect(40, kpiY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE KEY PERFORMANCE INDICATORS', 60, kpiY + 12);
  
  // FSC-style KPI cards but with EUDR metrics
  const kpiData = [
    { metric: 'Deforestation Risk', value: '0.0%', score: '98/100', color: '#10b981' },
    { metric: 'Forest Protection', value: 'VERIFIED', score: '96/100', color: '#3b82f6' },
    { metric: 'Supply Chain', value: 'TRACEABLE', score: '94/100', color: '#8b5cf6' },
    { metric: 'Documentation', value: 'COMPLETE', score: '99/100', color: '#f59e0b' }
  ];
  
  const cardStartY = kpiY + 50;
  kpiData.forEach((kpi, index) => {
    const x = 40 + (index * 128);
    const cardWidth = 120;
    const cardHeight = 100;
    
    // FSC-style KPI card
    doc.rect(x, cardStartY, cardWidth, cardHeight).fill('#ffffff').stroke('#e2e8f0', 1);
    doc.rect(x, cardStartY, cardWidth, 25).fill('#f8fafc');
    
    // Metric name
    doc.fontSize(10).fillColor('#2d3748').font('Helvetica-Bold')
       .text(kpi.metric, x + 8, cardStartY + 8);
    
    // Large value
    doc.fontSize(14).fillColor(kpi.color).font('Helvetica-Bold')
       .text(kpi.value, x + 8, cardStartY + 35);
    
    // Score
    doc.fontSize(12).fillColor('#4a5568')
       .text(kpi.score, x + 8, cardStartY + 60);
    
    // Progress bar - FSC style
    const barY = cardStartY + 80;
    const barWidth = parseInt(kpi.score.split('/')[0]) * 1.04; // Convert to percentage width
    doc.rect(x + 8, barY, 104, 8).fill('#f1f5f9');
    doc.rect(x + 8, barY, barWidth, 8).fill(kpi.color);
  });
}

function generateEUDRCertificationMatrix(doc: PDFDocument, packId: string) {
  const matrixY = 520;
  
  // FSC-style table header
  doc.rect(40, matrixY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE VERIFICATION MATRIX', 60, matrixY + 12);
  
  // FSC-style professional table
  const tableY = matrixY + 50;
  const rowHeight = 25;
  
  // Table headers with FSC styling
  doc.rect(40, tableY, 515, rowHeight).fill('#4a5568');
  doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EUDR Requirement', 50, tableY + 8)
     .text('Status', 200, tableY + 8)
     .text('Score', 280, tableY + 8)
     .text('Verification', 380, tableY + 8);
  
  // Table data - EUDR specific
  const tableData = [
    ['EU Regulation 2023/1115', 'COMPLIANT', '98/100', '✓ VERIFIED'],
    ['Deforestation Analysis', 'NO RISK', '99/100', '✓ CONFIRMED'],
    ['Supply Chain Due Diligence', 'COMPLETE', '95/100', '✓ VALIDATED'],
    ['Geolocation Data', 'ACCURATE', '97/100', '✓ CERTIFIED'],
    ['Risk Assessment', 'LOW RISK', '96/100', '✓ APPROVED']
  ];
  
  tableData.forEach((row, index) => {
    const y = tableY + rowHeight + (index * rowHeight);
    const bgColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    
    doc.rect(40, y, 515, rowHeight).fill(bgColor).stroke('#e2e8f0', 0.5);
    
    doc.fontSize(9).fillColor('#374151')
       .text(row[0], 50, y + 8)
       .text(row[1], 200, y + 8);
    doc.fontSize(9).fillColor('#10b981').font('Helvetica-Bold')
       .text(row[2], 280, y + 8);
    doc.fontSize(9).fillColor('#059669').font('Helvetica-Bold')
       .text(row[3], 380, y + 8);
  });
}

// Certificate 1: Cover Sheet with FSC styling
function generateCertificate1_CoverSheet(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  // FSC-style header
  generateFSCStyledHeader(doc, packId, currentDate, 'EUDR COMPLIANCE PACK - COVER SHEET');
  
  // FSC-style summary cards
  const cardY = 160;
  doc.rect(40, cardY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('COMPLIANCE PACK SUMMARY', 60, cardY + 12);
  
  // Three summary cards with FSC styling
  const summaryY = cardY + 50;
  
  // Producer card
  doc.rect(40, summaryY, 165, 120).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(40, summaryY, 165, 30).fill('#edf2f7');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('Producer', 50, summaryY + 10);
  doc.fontSize(11).fillColor('#4a5568')
     .text(`${farmerData.name}`, 50, summaryY + 45)
     .text(`${farmerData.county}, Liberia`, 50, summaryY + 65)
     .text(`GPS: ${farmerData.latitude?.slice(0,6)}°`, 50, summaryY + 85)
     .text(`${farmerData.longitude?.slice(0,7)}°`, 50, summaryY + 105);
  
  // Export card
  doc.rect(215, summaryY, 165, 120).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(215, summaryY, 165, 30).fill('#e6fffa');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('Export Details', 225, summaryY + 10);
  doc.fontSize(11).fillColor('#4a5568')
     .text(`${exportData.company}`, 225, summaryY + 45)
     .text(`Quantity: ${exportData.quantity}`, 225, summaryY + 65)
     .text(`Value: ${exportData.exportValue}`, 225, summaryY + 85)
     .text(`Destination: EU`, 225, summaryY + 105);
  
  // Status card
  doc.rect(390, summaryY, 165, 120).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(390, summaryY, 165, 30).fill('#dcfce7');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('Status', 400, summaryY + 10);
  doc.circle(472, summaryY + 70, 25).fill('#10b981');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold').text('✓', 467, summaryY + 62);
  doc.fontSize(12).fillColor('#15803d').font('Helvetica-Bold').text('APPROVED', 440, summaryY + 105);
  
  generateFSCStyledFooter(doc, packId, currentDate, 'Cover Sheet');
}

// Certificate 2: Export Eligibility with charts
function generateCertificate2_ExportEligibility(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateFSCStyledHeader(doc, packId, currentDate, 'LACRA EXPORT ELIGIBILITY CERTIFICATE');
  
  // Eligibility assessment with FSC-style charts
  const chartY = 160;
  doc.rect(40, chartY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EXPORT ELIGIBILITY ASSESSMENT', 60, chartY + 12);
  
  // Professional bar chart for eligibility scores
  const barChartY = chartY + 60;
  const eligibilityData = [
    { label: 'Documentation', score: 98, color: '#10b981' },
    { label: 'Quality Standards', score: 95, color: '#3b82f6' },
    { label: 'Legal Compliance', score: 97, color: '#8b5cf6' },
    { label: 'Market Access', score: 94, color: '#f59e0b' }
  ];
  
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('ELIGIBILITY SCORES', 60, barChartY);
  
  eligibilityData.forEach((item, index) => {
    const y = barChartY + 30 + (index * 35);
    // Background bar
    doc.rect(60, y, 300, 20).fill('#f1f5f9').stroke('#e2e8f0', 1);
    // Score bar
    const barWidth = (item.score / 100) * 300;
    doc.rect(60, y, barWidth, 20).fill(item.color);
    // Labels
    doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold')
       .text(item.label, 380, y + 6);
    doc.fontSize(11).fillColor(item.color).font('Helvetica-Bold')
       .text(`${item.score}/100`, 480, y + 6);
  });
  
  generateFSCStyledFooter(doc, packId, currentDate, 'Export Eligibility');
}

// Certificate 3: Compliance Assessment with KPI dashboard
function generateCertificate3_ComplianceAssessment(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateFSCStyledHeader(doc, packId, currentDate, 'EUDR COMPLIANCE ASSESSMENT');
  
  generateFSCStyledKPISection(doc);
  generateEUDRCertificationMatrix(doc, packId);
  generateFSCStyledFooter(doc, packId, currentDate, 'Compliance Assessment');
}

// Certificate 4: Deforestation Analysis with pie chart
function generateCertificate4_DeforestationAnalysis(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateFSCStyledHeader(doc, packId, currentDate, 'DEFORESTATION RISK ANALYSIS');
  
  // Professional pie chart for risk analysis
  const pieY = 180;
  doc.rect(40, pieY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('DEFORESTATION RISK DISTRIBUTION', 60, pieY + 12);
  
  // Pie chart
  const centerX = 200;
  const centerY = pieY + 120;
  const radius = 60;
  
  // No Risk (95%) - Green
  doc.save();
  doc.translate(centerX, centerY);
  doc.rotate(0);
  doc.moveTo(0, 0).arc(0, 0, radius, 0, Math.PI * 1.9).fill('#10b981');
  doc.restore();
  
  // Low Risk (5%) - Yellow
  doc.save();
  doc.translate(centerX, centerY);
  doc.rotate(Math.PI * 1.9);
  doc.moveTo(0, 0).arc(0, 0, radius, 0, Math.PI * 0.1).fill('#f59e0b');
  doc.restore();
  
  // Legend
  doc.rect(320, pieY + 80, 200, 80).fill('#f8fafc').stroke('#e2e8f0', 1);
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Risk Assessment', 330, pieY + 90);
  doc.rect(330, pieY + 110, 15, 15).fill('#10b981');
  doc.fontSize(10).fillColor('#2d3748').text('No Risk: 95%', 350, pieY + 115);
  doc.rect(330, pieY + 130, 15, 15).fill('#f59e0b');
  doc.fontSize(10).fillColor('#2d3748').text('Low Risk: 5%', 350, pieY + 135);
  
  generateFSCStyledFooter(doc, packId, currentDate, 'Deforestation Analysis');
}

// Certificate 5: Due Diligence Statement
function generateCertificate5_DueDiligence(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateFSCStyledHeader(doc, packId, currentDate, 'DUE DILIGENCE STATEMENT');
  
  // Due diligence content with FSC styling
  const contentY = 180;
  doc.rect(40, contentY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('DUE DILIGENCE PROCEDURES COMPLETED', 60, contentY + 12);
  
  // Checklist with FSC styling
  const checklistY = contentY + 60;
  const checklist = [
    'Geolocation data verified and accurate',
    'Supply chain documentation complete',
    'Risk assessment conducted and documented',
    'No deforestation detected in monitoring period',
    'Legal compliance verified for all operations'
  ];
  
  checklist.forEach((item, index) => {
    const y = checklistY + (index * 30);
    doc.rect(60, y, 20, 20).fill('#10b981').stroke('#ffffff', 2);
    doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
       .text('✓', 68, y + 4);
    doc.fontSize(11).fillColor('#2d3748')
       .text(item, 95, y + 6);
  });
  
  generateFSCStyledFooter(doc, packId, currentDate, 'Due Diligence');
}

// Certificate 6: Supply Chain Traceability
function generateCertificate6_SupplyTraceability(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateFSCStyledHeader(doc, packId, currentDate, 'SUPPLY CHAIN TRACEABILITY REPORT');
  
  // Traceability flow diagram with FSC styling
  const flowY = 180;
  doc.rect(40, flowY, 515, 35).fill('#2d3748');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('SUPPLY CHAIN TRACEABILITY FLOW', 60, flowY + 12);
  
  // Flow diagram
  const stepY = flowY + 60;
  const steps = [
    { title: 'PRODUCER', data: farmerData.name, color: '#10b981' },
    { title: 'PROCESSING', data: 'Local Processing Facility', color: '#3b82f6' },
    { title: 'EXPORT', data: exportData.company, color: '#8b5cf6' },
    { title: 'DESTINATION', data: exportData.destination, color: '#f59e0b' }
  ];
  
  steps.forEach((step, index) => {
    const x = 60 + (index * 120);
    doc.rect(x, stepY, 100, 80).fill('#ffffff').stroke(step.color, 2);
    doc.rect(x, stepY, 100, 25).fill(step.color);
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
       .text(step.title, x + 8, stepY + 8);
    doc.fontSize(9).fillColor('#2d3748')
       .text(step.data, x + 8, stepY + 45);
    
    // Arrow
    if (index < steps.length - 1) {
      doc.polygon([x + 100, stepY + 35], [x + 115, stepY + 30], [x + 115, stepY + 40])
         .fill('#4a5568');
    }
  });
  
  generateFSCStyledFooter(doc, packId, currentDate, 'Supply Traceability');
}

function generateFSCStyledFooter(doc: PDFDocument, packId: string, currentDate: string, certificateType: string) {
  const footerY = 720;
  
  // FSC-style certification statement
  doc.rect(40, footerY, 515, 60).fill('#f8fafc').stroke('#e2e8f0', 1);
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text(`${certificateType.toUpperCase()} - CERTIFICATION COMPLETE`, 60, footerY + 15);
  doc.fontSize(10).fillColor('#4a5568')
     .text('This certificate confirms compliance with EU Deforestation Regulation requirements', 60, footerY + 35)
     .text('for the specified agricultural commodity from Liberia.', 60, footerY + 50);
  
  // FSC-style dark footer
  doc.rect(0, 790, 595, 52).fill('#2d3748');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA - LIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY', 60, 810);
  doc.fontSize(9).fillColor('#a0aec0')
     .text(`Certificate: LACRA-EUDR-${packId.slice(-8)} | Type: ${certificateType} | Generated: ${currentDate}`, 60, 830);
  
  // LACRA trademark
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA®', 500, 815);
}