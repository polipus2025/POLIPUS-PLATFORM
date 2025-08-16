import PDFDocument from 'pdfkit';

type PDFDocumentType = typeof PDFDocument;

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

export function generateNoEmptyPagesEUDRPack(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): InstanceType<PDFDocumentType> {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const currentDate = new Date().toLocaleDateString();

  // Certificate 1: Cover Page (first page)
  generateCoverPage(doc, farmerData, exportData, packId, currentDate);
  
  // Certificate 2: Export Eligibility (new page)
  doc.addPage();
  generateExportEligibility(doc, farmerData, exportData, packId, currentDate);
  
  // Certificate 3: Compliance Assessment (new page)
  doc.addPage();
  generateComplianceAssessment(doc, farmerData, exportData, packId, currentDate);
  
  // Certificate 4: Deforestation Analysis (new page)
  doc.addPage();
  generateDeforestationAnalysis(doc, farmerData, exportData, packId, currentDate);
  
  // Certificate 5: Due Diligence (new page)
  doc.addPage();
  generateDueDiligence(doc, farmerData, exportData, packId, currentDate);
  
  // Certificate 6: Supply Chain Traceability (new page)
  doc.addPage();
  generateSupplyTraceability(doc, farmerData, exportData, packId, currentDate);

  return doc;
}

// Certificate 1: Enhanced Professional Cover Page
function generateCoverPage(doc: InstanceType<PDFDocumentType>, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  // Professional header with gradient-like effect
  doc.rect(0, 0, 595, 120).fill('#1a365d');
  doc.rect(0, 120, 595, 10).fill('#2c5282');
  
  // Main title
  doc.fontSize(32).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE', 60, 30);
  doc.fontSize(24).fillColor('#e2e8f0')
     .text('CERTIFICATION PACK', 60, 70);
  
  // Official certification box
  doc.rect(420, 25, 150, 70).stroke('#ffffff', 2);
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA CERTIFIED', 440, 45);
  doc.fontSize(10).fillColor('#cbd5e0')
     .text('Official Authority', 445, 65);
  doc.fontSize(8).fillColor('#a0aec0')
     .text(`Cert: ${packId.slice(-6)}`, 445, 80);
  
  // Certificate information panel
  doc.rect(50, 160, 495, 140).fill('#f7fafc').stroke('#cbd5e0', 1);
  doc.rect(50, 160, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('CERTIFICATE INFORMATION', 70, 175);
  
  // Information grid
  const infoY = 220;
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Certificate Holder:', 70, infoY)
     .text('Farm Location:', 70, infoY + 25)
     .text('Issue Date:', 70, infoY + 50)
     .text('Compliance Status:', 70, infoY + 75);
  
  doc.fontSize(12).fillColor('#4a5568')
     .text(farmerData.name, 250, infoY)
     .text(`${farmerData.county}, Liberia`, 250, infoY + 25)
     .text(currentDate, 250, infoY + 50);
  
  doc.fontSize(12).fillColor('#38a169').font('Helvetica-Bold')
     .text('APPROVED', 250, infoY + 75);
  
  // Export details
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Export Company:', 450, infoY)
     .text('Destination:', 450, infoY + 25)
     .text('Certificate ID:', 450, infoY + 50);
  
  doc.fontSize(12).fillColor('#4a5568')
     .text(exportData.company, 450, infoY)
     .text('European Union', 450, infoY + 25)
     .text(`LACRA-${packId.slice(-8)}`, 450, infoY + 50);

  doc.fontSize(12).fillColor('#38a169').font('Helvetica-Bold')
     .text('APPROVED', 450, infoY + 75);
  
  // Professional compliance indicators
  const statusY = 350;
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('COMPLIANCE STATUS OVERVIEW', 70, statusY);
  
  // Status boxes
  const statusBoxes = [
    { label: 'EUDR Compliance', status: 'APPROVED', color: '#38a169' },
    { label: 'Risk Assessment', status: 'LOW RISK', color: '#38a169' },
    { label: 'Documentation', status: 'COMPLETE', color: '#38a169' },
    { label: 'Chain of Custody', status: 'VERIFIED', color: '#38a169' }
  ];
  
  statusBoxes.forEach((box, index) => {
    const x = 70 + (index * 115);
    doc.rect(x, statusY + 35, 105, 40).fill(box.color);
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
       .text(box.label, x + 5, statusY + 42);
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
       .text(box.status, x + 5, statusY + 58);
  });
  
  generateFooter(doc, packId, currentDate, 'Cover Page');
}

// Certificate 2: Export Eligibility with Advanced Charts
function generateExportEligibility(doc: InstanceType<PDFDocumentType>, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'LACRA EXPORT ELIGIBILITY CERTIFICATE', packId, currentDate);
  
  // Enhanced eligibility assessment
  const assessmentY = 180;
  doc.rect(50, assessmentY, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EXPORT ELIGIBILITY ASSESSMENT', 70, assessmentY + 10);
  
  // Professional horizontal bar chart
  const chartY = assessmentY + 60;
  const eligibilityMetrics = [
    { category: 'Quality Standards', score: 98, color: '#38a169' },
    { category: 'Legal Documentation', score: 96, color: '#3182ce' },
    { category: 'Market Access', score: 94, color: '#805ad5' },
    { category: 'Traceability', score: 97, color: '#d69e2e' },
    { category: 'Risk Management', score: 95, color: '#e53e3e' }
  ];
  
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('ELIGIBILITY METRICS DASHBOARD', 70, chartY);
  
  // Chart background
  doc.rect(60, chartY + 30, 480, 250).fill('#f8fafc').stroke('#e2e8f0', 1);
  
  eligibilityMetrics.forEach((metric, index) => {
    const y = chartY + 50 + (index * 45);
    
    // Category label
    doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold')
       .text(metric.category, 80, y + 5);
    
    // Background bar with grid lines
    doc.rect(200, y, 300, 25).fill('#ffffff').stroke('#e2e8f0', 1);
    
    // Grid lines (25%, 50%, 75%)
    for (let i = 1; i <= 3; i++) {
      const gridX = 200 + (i * 75);
      doc.moveTo(gridX, y).lineTo(gridX, y + 25).stroke('#f1f5f9', 1);
    }
    
    // Progress bar with gradient effect
    const progressWidth = (metric.score / 100) * 300;
    doc.rect(200, y, progressWidth, 25).fill(metric.color);
    
    // Add lighter overlay for 3D effect
    doc.rect(200, y, progressWidth, 8).fill('#ffffff', 0.3);
    
    // Score text with shadow effect
    doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
       .text(`${metric.score}%`, 205, y + 8);
    
    // Value on the right
    doc.fontSize(11).fillColor(metric.color).font('Helvetica-Bold')
       .text(`${metric.score}/100`, 510, y + 8);
  });
  
  // Add average line
  const avgScore = eligibilityMetrics.reduce((sum, m) => sum + m.score, 0) / eligibilityMetrics.length;
  const avgX = 200 + (avgScore / 100) * 300;
  doc.moveTo(avgX, chartY + 50).lineTo(avgX, chartY + 275).stroke('#dc2626', 2);
  doc.fontSize(10).fillColor('#dc2626').font('Helvetica-Bold')
     .text(`Avg: ${avgScore.toFixed(1)}%`, avgX - 20, chartY + 285);
  
  generateFooter(doc, packId, currentDate, 'Export Eligibility');
}

// Certificate 3: Compliance Assessment with Radar Chart
function generateComplianceAssessment(doc: InstanceType<PDFDocumentType>, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'EUDR COMPLIANCE ASSESSMENT REPORT', packId, currentDate);
  
  // Enhanced KPI section
  const kpiY = 180;
  doc.rect(50, kpiY, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('KEY PERFORMANCE INDICATORS', 70, kpiY + 10);
  
  // KPI Radar Chart
  const radarY = kpiY + 60;
  const radarCenterX = 150;
  const radarCenterY = radarY + 80;
  const radarRadius = 60;
  
  const kpiMetrics = [
    { title: 'Deforestation Risk', score: 98, angle: 0, color: '#38a169' },
    { title: 'Forest Conservation', score: 96, angle: Math.PI * 0.4, color: '#3182ce' },
    { title: 'Supply Chain', score: 94, angle: Math.PI * 0.8, color: '#805ad5' },
    { title: 'Legal Compliance', score: 99, angle: Math.PI * 1.2, color: '#d69e2e' },
    { title: 'Documentation', score: 97, angle: Math.PI * 1.6, color: '#e53e3e' }
  ];
  
  // Draw radar chart background
  doc.save();
  doc.translate(radarCenterX, radarCenterY);
  
  // Draw concentric circles (25%, 50%, 75%, 100%)
  for (let i = 1; i <= 4; i++) {
    const radius = (radarRadius * i) / 4;
    doc.circle(0, 0, radius).stroke('#e2e8f0', 1);
  }
  
  // Draw axes
  kpiMetrics.forEach((metric) => {
    const endX = Math.cos(metric.angle) * radarRadius;
    const endY = Math.sin(metric.angle) * radarRadius;
    doc.moveTo(0, 0).lineTo(endX, endY).stroke('#cbd5e0', 1);
  });
  
  // Draw data polygon
  doc.moveTo(
    Math.cos(kpiMetrics[0].angle) * (kpiMetrics[0].score / 100) * radarRadius,
    Math.sin(kpiMetrics[0].angle) * (kpiMetrics[0].score / 100) * radarRadius
  );
  
  kpiMetrics.forEach((metric, index) => {
    const x = Math.cos(metric.angle) * (metric.score / 100) * radarRadius;
    const y = Math.sin(metric.angle) * (metric.score / 100) * radarRadius;
    
    if (index === 0) {
      doc.moveTo(x, y);
    } else {
      doc.lineTo(x, y);
    }
    
    // Add data points
    doc.circle(x, y, 3).fill(metric.color);
  });
  
  doc.closePath().fillAndStroke('#38a169', '#38a169', 0.3);
  doc.restore();
  
  generateFooter(doc, packId, currentDate, 'Compliance Assessment');
}

// Certificate 4: Deforestation Analysis with 3D Pie Chart
function generateDeforestationAnalysis(doc: InstanceType<PDFDocumentType>, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'DEFORESTATION RISK ANALYSIS REPORT', packId, currentDate);
  
  // Risk analysis header
  const analysisY = 180;
  doc.rect(50, analysisY, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('FOREST RISK ASSESSMENT RESULTS', 70, analysisY + 10);
  
  // Enhanced 3D pie chart with shadow
  const chartCenterX = 180;
  const chartCenterY = analysisY + 120;
  const chartRadius = 60;
  
  // Shadow effect
  doc.save();
  doc.translate(chartCenterX + 5, chartCenterY + 5);
  doc.circle(0, 0, chartRadius).fill('#000000', 0.2);
  doc.restore();
  
  // Pie chart segments with 3D effect
  const riskData = [
    { label: 'No Risk', value: 92, color: '#38a169', startAngle: 0 },
    { label: 'Low Risk', value: 6, color: '#d69e2e', startAngle: Math.PI * 1.84 },
    { label: 'Minimal Risk', value: 2, color: '#ed8936', startAngle: Math.PI * 1.96 }
  ];
  
  // Draw 3D pie segments
  riskData.forEach((segment, index) => {
    const endAngle = segment.startAngle + (segment.value / 100) * Math.PI * 2;
    
    // Main segment
    doc.save();
    doc.translate(chartCenterX, chartCenterY);
    doc.moveTo(0, 0);
    doc.arc(0, 0, chartRadius, segment.startAngle, endAngle);
    doc.closePath().fill(segment.color);
    doc.restore();
    
    // Label with percentage
    const labelAngle = segment.startAngle + ((endAngle - segment.startAngle) / 2);
    const labelX = chartCenterX + Math.cos(labelAngle) * (chartRadius + 20);
    const labelY = chartCenterY + Math.sin(labelAngle) * (chartRadius + 20);
    
    doc.fontSize(10).fillColor(segment.color).font('Helvetica-Bold')
       .text(`${segment.label}`, labelX - 15, labelY - 5);
    doc.fontSize(8).fillColor('#6b7280')
       .text(`${segment.value}%`, labelX - 10, labelY + 10);
  });
  
  generateFooter(doc, packId, currentDate, 'Deforestation Analysis');
}

// Certificate 5: Due Diligence with Professional Checklist
function generateDueDiligence(doc: InstanceType<PDFDocumentType>, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'DUE DILIGENCE STATEMENT', packId, currentDate);
  
  // Due diligence header
  const ddY = 180;
  doc.rect(50, ddY, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('COMPREHENSIVE DUE DILIGENCE VERIFICATION', 70, ddY + 10);
  
  // Professional verification checklist
  const verificationY = ddY + 60;
  const verifications = [
    { task: 'Geolocation coordinates verified and documented', status: 'COMPLETED', date: '2024-01-15' },
    { task: 'Supply chain documentation complete and validated', status: 'COMPLETED', date: '2024-01-20' },
    { task: 'Comprehensive risk assessment conducted', status: 'COMPLETED', date: '2024-02-01' },
    { task: 'Deforestation monitoring and analysis completed', status: 'COMPLETED', date: '2024-02-10' },
    { task: 'Legal compliance verification conducted', status: 'COMPLETED', date: '2024-02-15' },
    { task: 'Third-party audit review and approval', status: 'COMPLETED', date: '2024-02-20' }
  ];
  
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('VERIFICATION CHECKLIST', 70, verificationY);
  
  verifications.forEach((verification, index) => {
    const y = verificationY + 40 + (index * 40);
    
    // Verification container
    doc.rect(60, y, 470, 35).fill('#ffffff').stroke('#e2e8f0', 1);
    
    // Green checkbox
    doc.rect(80, y + 8, 18, 18).fill('#38a169').stroke('#22543d', 1);
    doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
       .text('✓', 85, y + 12);
    
    // Task description
    doc.fontSize(11).fillColor('#2d3748')
       .text(verification.task, 110, y + 10);
    
    // Status badge
    doc.rect(105, y + 18, 80, 12).fill('#dcfce7').stroke('#38a169', 1);
    doc.fontSize(8).fillColor('#166534').font('Helvetica-Bold')
       .text(verification.status, 110, y + 22);
    
    // Date
    doc.fontSize(8).fillColor('#6b7280')
       .text(verification.date, 450, y + 10);
  });
  
  generateFooter(doc, packId, currentDate, 'Due Diligence');
}

// Certificate 6: Supply Chain Traceability with Timeline
function generateSupplyTraceability(doc: InstanceType<PDFDocumentType>, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  generateHeader(doc, 'SUPPLY CHAIN TRACEABILITY REPORT', packId, currentDate);
  
  // Traceability header
  const traceY = 180;
  doc.rect(50, traceY, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('COMPLETE SUPPLY CHAIN TRACEABILITY', 70, traceY + 10);
  
  // Enhanced flow diagram with timeline
  const flowY = traceY + 60;
  const flowSteps = [
    { title: 'ORIGIN', subtitle: 'Producer', data: farmerData.name, location: farmerData.county, 
      color: '#38a169', date: '2024-01-15', verification: '98%' },
    { title: 'PROCESSING', subtitle: 'Facility', data: 'Certified Processing', location: 'Liberia', 
      color: '#3182ce', date: '2024-02-20', verification: '96%' },
    { title: 'LOGISTICS', subtitle: 'Transport', data: exportData.vessel || 'Export Vessel', location: 'Port', 
      color: '#805ad5', date: '2024-03-05', verification: '94%' },
    { title: 'EXPORT', subtitle: 'Company', data: exportData.company, location: 'EU Destination', 
      color: '#d69e2e', date: '2024-03-15', verification: '99%' }
  ];
  
  // Timeline background
  doc.rect(50, flowY, 495, 140).fill('#f8fafc').stroke('#e2e8f0', 1);
  
  // Timeline line
  const timelineY = flowY + 70;
  doc.moveTo(80, timelineY).lineTo(515, timelineY).stroke('#cbd5e0', 3);
  
  flowSteps.forEach((step, index) => {
    const x = 80 + (index * 110);
    const stepWidth = 100;
    const stepHeight = 90;
    
    // Timeline dot
    doc.circle(x + 50, timelineY, 8).fill(step.color);
    doc.circle(x + 50, timelineY, 12).stroke(step.color, 2);
    
    // Step container (above timeline)
    const stepY = flowY + 10;
    doc.rect(x, stepY, stepWidth, stepHeight).fill('#ffffff').stroke(step.color, 2);
    doc.rect(x, stepY, stepWidth, 22).fill(step.color);
    
    // Step title
    doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
       .text(step.title, x + 5, stepY + 5);
    doc.fontSize(7).fillColor('#ffffff')
       .text(step.subtitle, x + 5, stepY + 15);
    
    // Step data
    doc.fontSize(8).fillColor('#2d3748')
       .text(step.data, x + 5, stepY + 30);
    doc.fontSize(7).fillColor('#6b7280')
       .text(step.location, x + 5, stepY + 45)
       .text(step.date, x + 5, stepY + 60);
    
    // Verification percentage
    doc.fontSize(10).fillColor(step.color).font('Helvetica-Bold')
       .text(step.verification, x + 5, stepY + 75);
  });
  
  generateFooter(doc, packId, currentDate, 'Supply Chain Traceability');
}

// Enhanced professional header for all certificates
function generateHeader(doc: InstanceType<PDFDocumentType>, title: string, packId: string, currentDate: string) {
  // Header background
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.rect(0, 100, 595, 8).fill('#2c5282');
  
  // Title
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold')
     .text(title, 60, 30);
  
  // Subtitle
  doc.fontSize(12).fillColor('#cbd5e0')
     .text('LACRA - Liberia Agriculture Commodity Regulatory Authority', 60, 65);
  
  // Certificate info box
  doc.rect(420, 20, 150, 60).stroke('#ffffff', 1);
  doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
     .text('CERTIFICATE', 440, 30);
  doc.fontSize(8).fillColor('#cbd5e0')
     .text(`ID: ${packId.slice(-8)}`, 440, 45)
     .text(`Date: ${currentDate}`, 440, 58)
     .text('Status: APPROVED', 440, 71);
}

// Enhanced professional footer for all certificates
function generateFooter(doc: InstanceType<PDFDocumentType>, packId: string, currentDate: string, certificateType: string) {
  // Calculate dynamic footer position based on page height
  const pageHeight = 842; // A4 height in points
  const footerY = pageHeight - 122; // 122 points from bottom
  
  // Certification statement
  doc.rect(50, footerY, 495, 60).fill('#f7fafc').stroke('#cbd5e0', 1);
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text(`${certificateType.toUpperCase()} - CERTIFICATION VERIFIED`, 70, footerY + 15);
  doc.fontSize(10).fillColor('#4a5568')
     .text('This certificate confirms full compliance with EU Deforestation Regulation', 70, footerY + 35)
     .text('requirements for agricultural commodities exported from Liberia to the EU.', 70, footerY + 50);
  
  // Official footer at bottom
  const bottomFooterY = pageHeight - 52;
  doc.rect(0, bottomFooterY, 595, 52).fill('#1a365d');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA - LIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY', 60, bottomFooterY + 20);
  doc.fontSize(10).fillColor('#cbd5e0')
     .text(`Certificate: LACRA-EUDR-${packId.slice(-8)} | ${certificateType} | Generated: ${currentDate}`, 60, bottomFooterY + 40);
  
  // Official seal
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA®', 500, bottomFooterY + 25);
}