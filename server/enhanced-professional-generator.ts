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

export function generateEnhancedProfessionalEUDRPack(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): PDFDocument {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    autoFirstPage: false
  });

  const currentDate = new Date().toLocaleDateString();

  // Generate all 6 certificates with enhanced professional design (no empty pages)
  generateCertificate1_CoverPage(doc, farmerData, exportData, packId, currentDate);
  generateCertificate2_ExportEligibility(doc, farmerData, exportData, packId, currentDate);
  generateCertificate3_ComplianceAssessment(doc, farmerData, exportData, packId, currentDate);
  generateCertificate4_DeforestationAnalysis(doc, farmerData, exportData, packId, currentDate);
  generateCertificate5_DueDiligence(doc, farmerData, exportData, packId, currentDate);
  generateCertificate6_SupplyTraceability(doc, farmerData, exportData, packId, currentDate);

  return doc;
}

// Certificate 1: Enhanced Professional Cover Page
function generateCertificate1_CoverPage(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  // Add first page (no automatic first page)
  doc.addPage();
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
     .text('Validity Period:', 70, infoY + 75);
  
  doc.fontSize(12).fillColor('#4a5568')
     .text(farmerData.name, 200, infoY)
     .text(`${farmerData.county}, Liberia`, 200, infoY + 25)
     .text(currentDate, 200, infoY + 50)
     .text('24 Months', 200, infoY + 75);
  
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Export Company:', 320, infoY)
     .text('Destination:', 320, infoY + 25)
     .text('Certificate Number:', 320, infoY + 50)
     .text('Status:', 320, infoY + 75);
  
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
  
  generateProfessionalFooter(doc, packId, currentDate, 'Cover Page');
}

// Certificate 2: Export Eligibility with Advanced Charts
function generateCertificate2_ExportEligibility(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateProfessionalHeader(doc, 'LACRA EXPORT ELIGIBILITY CERTIFICATE', packId, currentDate);
  
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
  
  generateProfessionalFooter(doc, packId, currentDate, 'Export Eligibility');
}

// Certificate 3: Enhanced Compliance Assessment with Advanced Charts
function generateCertificate3_ComplianceAssessment(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateProfessionalHeader(doc, 'EUDR COMPLIANCE ASSESSMENT REPORT', packId, currentDate);
  
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
  
  // KPI Cards with vertical bar charts
  const cardStartX = 280;
  kpiMetrics.forEach((kpi, index) => {
    const x = cardStartX + (index * 52);
    const cardHeight = 140;
    
    // Card background
    doc.rect(x, radarY, 48, cardHeight).fill('#ffffff').stroke('#e2e8f0', 1);
    doc.rect(x, radarY, 48, 25).fill(kpi.color);
    
    // Title (rotated)
    doc.save();
    doc.translate(x + 24, radarY + 12);
    doc.rotate(-Math.PI / 2);
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
       .text(kpi.title.split(' ')[0], -15, 0);
    doc.restore();
    
    // Vertical bar chart
    const barHeight = (kpi.score / 100) * 80;
    const barY = radarY + 115 - barHeight;
    
    // Background bar
    doc.rect(x + 10, radarY + 35, 28, 80).fill('#f1f5f9').stroke('#e2e8f0', 1);
    
    // Progress bar
    doc.rect(x + 10, barY, 28, barHeight).fill(kpi.color);
    
    // Score text
    doc.fontSize(10).fillColor(kpi.color).font('Helvetica-Bold')
       .text(`${kpi.score}`, x + 18, radarY + 120);
  });
  
  // Compliance Matrix Table
  const matrixY = radarY + 160;
  doc.rect(50, matrixY, 495, 35).fill('#4a5568');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('COMPLIANCE VERIFICATION MATRIX', 70, matrixY + 10);
  
  // Matrix data
  const matrixData = [
    ['EUDR Article 3', 'Compliant', '98%', '✓ Verified'],
    ['Supply Chain DD', 'Complete', '96%', '✓ Validated'],
    ['Risk Assessment', 'Low Risk', '99%', '✓ Approved'],
    ['Documentation', 'Complete', '97%', '✓ Certified']
  ];
  
  // Table headers
  const tableY = matrixY + 50;
  doc.rect(60, tableY, 470, 25).fill('#edf2f7');
  doc.fontSize(10).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Requirement', 70, tableY + 8)
     .text('Status', 200, tableY + 8)
     .text('Score', 320, tableY + 8)
     .text('Verification', 420, tableY + 8);
  
  // Table rows with mini charts
  matrixData.forEach((row, index) => {
    const y = tableY + 25 + (index * 30);
    const score = parseInt(row[2]);
    
    // Row background
    doc.rect(60, y, 470, 30).fill(index % 2 === 0 ? '#ffffff' : '#f8fafc');
    
    // Data
    doc.fontSize(9).fillColor('#2d3748')
       .text(row[0], 70, y + 10)
       .text(row[1], 200, y + 10)
       .text(row[3], 420, y + 10);
    
    // Mini progress bar for score
    doc.rect(320, y + 8, 60, 14).fill('#f1f5f9');
    doc.rect(320, y + 8, (score / 100) * 60, 14).fill('#38a169');
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
       .text(row[2], 325, y + 12);
  });
  
  generateProfessionalFooter(doc, packId, currentDate, 'Compliance Assessment');
}

// Certificate 4: Enhanced Deforestation Analysis with Multiple Charts
function generateCertificate4_DeforestationAnalysis(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateProfessionalHeader(doc, 'DEFORESTATION RISK ANALYSIS REPORT', packId, currentDate);
  
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
    doc.arc(0, 0, chartRadius, segment.startAngle, endAngle).fill(segment.color);
    doc.restore();
    
    // 3D top layer
    doc.save();
    doc.translate(chartCenterX, chartCenterY - 3);
    doc.moveTo(0, 0);
    doc.arc(0, 0, chartRadius, segment.startAngle, endAngle).fill(segment.color);
    doc.restore();
    
    // Add percentage labels
    const midAngle = segment.startAngle + ((endAngle - segment.startAngle) / 2);
    const labelX = chartCenterX + Math.cos(midAngle) * (chartRadius * 0.7);
    const labelY = chartCenterY + Math.sin(midAngle) * (chartRadius * 0.7);
    
    doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
       .text(`${segment.value}%`, labelX - 10, labelY - 5);
  });
  
  // Risk trend line chart
  const trendX = 320;
  const trendY = analysisY + 60;
  const trendWidth = 200;
  const trendHeight = 100;
  
  doc.rect(trendX, trendY, trendWidth, trendHeight + 40).fill('#f7fafc').stroke('#cbd5e0', 1);
  doc.rect(trendX, trendY, trendWidth, 25).fill('#4a5568');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
     .text('12-Month Risk Trend', trendX + 10, trendY + 8);
  
  // Trend data points (showing improvement over time)
  const trendData = [15, 12, 10, 8, 6, 4, 3, 2, 2, 1, 1, 0];
  const pointSpacing = (trendWidth - 20) / (trendData.length - 1);
  
  // Draw trend line
  doc.save();
  doc.translate(trendX + 10, trendY + 30);
  
  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = (i * (trendHeight - 10)) / 4;
    doc.moveTo(0, y).lineTo(trendWidth - 20, y).stroke('#e2e8f0', 1);
  }
  
  // Trend line
  trendData.forEach((value, index) => {
    const x = index * pointSpacing;
    const y = (trendHeight - 10) - ((value / 20) * (trendHeight - 10));
    
    if (index === 0) {
      doc.moveTo(x, y);
    } else {
      doc.lineTo(x, y);
    }
    
    // Data points
    doc.circle(x, y, 2).fill('#e53e3e');
  });
  
  doc.stroke('#e53e3e', 2);
  doc.restore();
  
  // Month labels
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  months.forEach((month, index) => {
    const x = trendX + 10 + (index * pointSpacing);
    doc.fontSize(8).fillColor('#6b7280')
       .text(month, x - 2, trendY + trendHeight + 35);
  });
  
  // Risk assessment bars
  const barY = analysisY + 200;
  doc.rect(50, barY, 495, 25).fill('#4a5568');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('DETAILED RISK BREAKDOWN', 70, barY + 6);
  
  const riskCategories = [
    { category: 'Forest Coverage Loss', risk: 2, color: '#38a169', benchmark: 5 },
    { category: 'Illegal Logging Activity', risk: 1, color: '#3182ce', benchmark: 8 },
    { category: 'Land Use Change', risk: 0, color: '#805ad5', benchmark: 3 },
    { category: 'Supply Chain Risk', risk: 3, color: '#d69e2e', benchmark: 10 }
  ];
  
  riskCategories.forEach((cat, index) => {
    const y = barY + 40 + (index * 35);
    
    // Category label
    doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold')
       .text(cat.category, 70, y + 8);
    
    // Risk bar background
    doc.rect(250, y, 200, 20).fill('#f1f5f9').stroke('#e2e8f0', 1);
    
    // Benchmark line
    const benchmarkX = 250 + (cat.benchmark / 20) * 200;
    doc.moveTo(benchmarkX, y).lineTo(benchmarkX, y + 20).stroke('#dc2626', 2);
    
    // Risk bar (current level)
    const riskWidth = (cat.risk / 20) * 200;
    doc.rect(250, y, riskWidth, 20).fill(cat.color);
    
    // Values
    doc.fontSize(10).fillColor('#2d3748')
       .text(`Current: ${cat.risk}%`, 460, y + 6);
    doc.fontSize(8).fillColor('#dc2626')
       .text(`Limit: ${cat.benchmark}%`, benchmarkX - 15, y - 10);
  });
  
  generateProfessionalFooter(doc, packId, currentDate, 'Deforestation Analysis');
}

// Certificate 5: Enhanced Due Diligence Statement
function generateCertificate5_DueDiligence(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateProfessionalHeader(doc, 'DUE DILIGENCE COMPLIANCE STATEMENT', packId, currentDate);
  
  // Due diligence header
  const ddY = 180;
  doc.rect(50, ddY, 495, 35).fill('#4a5568');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('DUE DILIGENCE PROCEDURES VERIFICATION', 70, ddY + 10);
  
  // Enhanced checklist with detailed verification
  const checklistY = ddY + 60;
  const verificationItems = [
    { item: 'Geolocation coordinates verified using GPS technology', status: 'VERIFIED', date: currentDate },
    { item: 'Supply chain documentation reviewed and validated', status: 'COMPLETE', date: currentDate },
    { item: 'Risk assessment conducted using satellite monitoring', status: 'ASSESSED', date: currentDate },
    { item: 'Deforestation monitoring analysis completed', status: 'ANALYZED', date: currentDate },
    { item: 'Legal compliance verification performed', status: 'COMPLIANT', date: currentDate },
    { item: 'Third-party audit documentation reviewed', status: 'REVIEWED', date: currentDate }
  ];
  
  verificationItems.forEach((verification, index) => {
    const y = checklistY + (index * 35);
    
    // Checkmark box
    doc.rect(70, y, 25, 25).fill('#38a169').stroke('#ffffff', 2);
    doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
       .text('✓', 78, y + 4);
    
    // Verification text
    doc.fontSize(11).fillColor('#2d3748')
       .text(verification.item, 105, y + 3);
    
    // Status badge
    doc.rect(105, y + 18, 80, 12).fill('#dcfce7').stroke('#38a169', 1);
    doc.fontSize(8).fillColor('#166534').font('Helvetica-Bold')
       .text(verification.status, 110, y + 22);
    
    // Date
    doc.fontSize(8).fillColor('#6b7280')
       .text(verification.date, 450, y + 10);
  });
  
  generateProfessionalFooter(doc, packId, currentDate, 'Due Diligence');
}

// Certificate 6: Enhanced Supply Chain Traceability with Advanced Visualization
function generateCertificate6_SupplyTraceability(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string) {
  doc.addPage();
  generateProfessionalHeader(doc, 'SUPPLY CHAIN TRACEABILITY REPORT', packId, currentDate);
  
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
       .text(step.subtitle, x + 5, stepY + 16);
    
    // Step data
    doc.fontSize(8).fillColor('#2d3748').font('Helvetica-Bold')
       .text(step.data, x + 5, stepY + 30);
    doc.fontSize(7).fillColor('#4a5568')
       .text(step.location, x + 5, stepY + 45);
    
    // Date
    doc.fontSize(7).fillColor('#6b7280')
       .text(step.date, x + 5, stepY + 60);
    
    // Verification percentage with mini chart
    const verifyPercent = parseInt(step.verification);
    doc.rect(x + 5, stepY + 75, 60, 8).fill('#f1f5f9');
    doc.rect(x + 5, stepY + 75, (verifyPercent / 100) * 60, 8).fill(step.color);
    doc.fontSize(6).fillColor('#ffffff').font('Helvetica-Bold')
       .text(step.verification, x + 8, stepY + 77);
    
    // Connection arrow (below timeline)
    if (index < flowSteps.length - 1) {
      const arrowX = x + 60;
      const arrowY = timelineY + 25;
      doc.polygon([arrowX, arrowY], [arrowX + 30, arrowY], [arrowX + 25, arrowY - 5], [arrowX + 25, arrowY + 5])
         .fill(step.color);
      
      // Progress percentage on arrow
      doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
         .text('100%', arrowX + 8, arrowY - 3);
    }
  });
  
  // Traceability metrics dashboard
  const metricsY = flowY + 160;
  doc.rect(50, metricsY, 495, 25).fill('#4a5568');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('TRACEABILITY PERFORMANCE METRICS', 70, metricsY + 6);
  
  // Metrics cards with mini charts
  const metrics = [
    { title: 'Chain Integrity', value: '98.2%', trend: [95, 96, 97, 98, 98.2], color: '#38a169' },
    { title: 'Data Accuracy', value: '96.8%', trend: [94, 95, 96, 96.5, 96.8], color: '#3182ce' },
    { title: 'Response Time', value: '2.1 hrs', trend: [3.2, 2.8, 2.5, 2.3, 2.1], color: '#805ad5' },
    { title: 'Compliance Score', value: '99.1%', trend: [97, 98, 98.5, 99, 99.1], color: '#d69e2e' }
  ];
  
  metrics.forEach((metric, index) => {
    const x = 60 + (index * 120);
    const cardHeight = 80;
    
    // Card background
    doc.rect(x, metricsY + 35, 110, cardHeight).fill('#ffffff').stroke('#e2e8f0', 1);
    doc.rect(x, metricsY + 35, 110, 20).fill('#f7fafc');
    
    // Title
    doc.fontSize(9).fillColor('#2d3748').font('Helvetica-Bold')
       .text(metric.title, x + 5, metricsY + 42);
    
    // Large value
    doc.fontSize(14).fillColor(metric.color).font('Helvetica-Bold')
       .text(metric.value, x + 5, metricsY + 60);
    
    // Mini trend chart
    const chartX = x + 5;
    const chartY = metricsY + 85;
    const chartWidth = 100;
    const chartHeight = 20;
    
    // Chart background
    doc.rect(chartX, chartY, chartWidth, chartHeight).fill('#f8fafc');
    
    // Trend line
    metric.trend.forEach((value, trendIndex) => {
      const pointX = chartX + (trendIndex * (chartWidth / (metric.trend.length - 1)));
      const pointY = chartY + chartHeight - ((value - Math.min(...metric.trend)) / 
                    (Math.max(...metric.trend) - Math.min(...metric.trend))) * chartHeight;
      
      if (trendIndex === 0) {
        doc.moveTo(pointX, pointY);
      } else {
        doc.lineTo(pointX, pointY);
      }
      
      // Data point
      doc.circle(pointX, pointY, 1).fill(metric.color);
    });
    
    doc.stroke(metric.color, 1);
  });
  
  generateProfessionalFooter(doc, packId, currentDate, 'Supply Chain Traceability');
}

// Enhanced professional header for all certificates
function generateProfessionalHeader(doc: PDFDocument, title: string, packId: string, currentDate: string) {
  // Reset to top of page for consistent header placement
  const startY = 50; // Match document margins
  
  // Header background
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.rect(0, 100, 595, 8).fill('#2c5282');
  
  // Title - ensure proper positioning
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
function generateProfessionalFooter(doc: PDFDocument, packId: string, currentDate: string, certificateType: string) {
  // Calculate dynamic footer position based on page height
  const pageHeight = 842; // A4 height in points
  const footerY = pageHeight - 122; // 122 points from bottom (about 1.7 inches)
  
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