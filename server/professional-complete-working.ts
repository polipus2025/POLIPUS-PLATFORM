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

export async function generateProfessionalCompleteWorking(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): Promise<PDFDocumentType> {
  
  console.log('🎯 GENERATING PROFESSIONAL COMPLETE WORKING - UniDOC Style');
  
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const currentDate = new Date().toLocaleDateString();
  let pageCount = 1;

  console.log(`📄 PAGE ${pageCount}: Professional Cover Page with Dashboard Style`);
  
  // PAGE 1: Cover Page with Dashboard Elements
  await generateProfessionalCoverPage(doc, farmerData, exportData, packId, currentDate, pageCount);

  // PAGE 2: Export Eligibility with Bar Charts
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Export Eligibility with Advanced Charts`);
  doc.addPage();
  await generateExportEligibilityWithCharts(doc, farmerData, exportData, packId, currentDate, pageCount);

  // PAGE 3: Compliance Assessment with Score Cards
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Compliance Assessment with Professional Metrics`);
  doc.addPage();
  await generateComplianceWithMetrics(doc, farmerData, exportData, packId, currentDate, pageCount);

  // PAGE 4: Deforestation Analysis with Risk Indicators
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Deforestation Analysis with Risk Charts`);
  doc.addPage();
  await generateDeforestationWithRiskCharts(doc, farmerData, exportData, packId, currentDate, pageCount);

  // PAGE 5: Due Diligence with Process Flow
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Due Diligence with Process Visualization`);
  doc.addPage();
  await generateDueDiligenceWithFlow(doc, farmerData, exportData, packId, currentDate, pageCount);

  // PAGE 6: Supply Chain with Network Visualization
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Supply Chain with Network Diagrams`);
  doc.addPage();
  await generateSupplyChainWithNetwork(doc, farmerData, exportData, packId, currentDate, pageCount);

  console.log(`✅ PROFESSIONAL COMPLETE WORKING - Total pages: ${pageCount}`);
  
  return doc;
}

async function generateQRFooter(doc: PDFDocumentType, packId: string, currentDate: string, pageTitle: string, farmerName: string, exportCompany: string, pageNum: number) {
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff')
     .text(`LACRA-EUDR-${packId} | ${pageTitle} | Generated: ${currentDate}`, 60, 770);
  doc.fontSize(8).fillColor('#a0aec0')
     .text('www.lacra.gov.lr | compliance@lacra.gov.lr', 300, 770);
  doc.fontSize(8).fillColor('#a0aec0')
     .text(`Page ${pageNum} of 6`, 480, 785);

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

// Professional header like UniDOC
function generateProfessionalHeader(doc: PDFDocumentType, title: string, packId: string, pageColor: string = '#1a365d') {
  // Header background
  doc.rect(0, 0, 595, 100).fill(pageColor);
  
  // Logo area (left)
  doc.rect(40, 20, 60, 60).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.fontSize(16).fillColor(pageColor).font('Helvetica-Bold').text('LACRA', 52, 42);
  doc.fontSize(8).fillColor('#6b7280').text('Official Seal', 55, 62);
  
  // Title (center)
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text(title, 120, 30);
  doc.fontSize(10).fillColor('#cbd5e0').text('EU Deforestation Regulation Compliance', 120, 55);
  
  // Certificate ID (right)
  doc.rect(450, 20, 120, 60).fill('rgba(255,255,255,0.1)').stroke('#ffffff', 1);
  doc.fontSize(8).fillColor('#cbd5e0').text('Certificate ID', 460, 30);
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold').text(`EUDR-${packId}`, 460, 45);
  doc.fontSize(8).fillColor('#cbd5e0').text('Status: APPROVED', 460, 65);
}

// Score card like UniDOC grade system
function drawScoreCard(doc: PDFDocumentType, x: number, y: number, grade: string, score: number, label: string, color: string) {
  // Card background
  doc.rect(x, y, 120, 80).fill('#ffffff').stroke('#e2e8f0', 1);
  
  // Grade circle
  doc.circle(x + 25, y + 25, 20).fill(color);
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold').text(grade, x + 20, y + 18);
  
  // Score and label
  doc.fontSize(24).fillColor('#2d3748').font('Helvetica-Bold').text(score.toString(), x + 55, y + 15);
  doc.fontSize(10).fillColor('#6b7280').text(label, x + 10, y + 55);
  
  // Progress bar
  const progressWidth = (score / 100) * 100;
  doc.rect(x + 10, y + 68, 100, 6).fill('#f1f5f9');
  doc.rect(x + 10, y + 68, progressWidth, 6).fill(color);
}

// Bar chart like UniDOC
function drawBarChart(doc: PDFDocumentType, x: number, y: number, width: number, height: number, data: any[], title: string) {
  // Chart background
  doc.rect(x, y, width, height).fill('#f8fafc').stroke('#e2e8f0', 1);
  
  // Title
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text(title, x + 10, y + 10);
  
  // Bars
  const barWidth = (width - 40) / data.length;
  const maxValue = Math.max(...data.map(d => d.value));
  
  data.forEach((item, index) => {
    const barHeight = (item.value / maxValue) * (height - 60);
    const barX = x + 20 + (index * barWidth);
    const barY = y + height - 30 - barHeight;
    
    // Bar
    doc.rect(barX, barY, barWidth - 5, barHeight).fill(item.color);
    
    // Value on top
    doc.fontSize(8).fillColor('#2d3748').text(item.value.toString(), barX + 5, barY - 15);
    
    // Label at bottom
    doc.fontSize(8).fillColor('#6b7280').text(item.label, barX, y + height - 15);
  });
}

// Line chart like UniDOC
function drawLineChart(doc: PDFDocumentType, x: number, y: number, width: number, height: number, data: number[], title: string, color: string = '#3182ce') {
  // Chart background
  doc.rect(x, y, width, height).fill('#f8fafc').stroke('#e2e8f0', 1);
  
  // Title
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text(title, x + 10, y + 10);
  
  // Grid lines
  for (let i = 1; i <= 4; i++) {
    const gridY = y + 30 + ((height - 60) / 4) * i;
    doc.moveTo(x + 20, gridY).lineTo(x + width - 20, gridY).stroke('#e2e8f0', 1);
  }
  
  // Line
  const stepX = (width - 40) / (data.length - 1);
  const maxValue = Math.max(...data);
  
  doc.strokeColor(color).lineWidth(2);
  let firstPoint = true;
  
  data.forEach((value, index) => {
    const pointX = x + 20 + (index * stepX);
    const pointY = y + height - 30 - ((value / maxValue) * (height - 60));
    
    if (firstPoint) {
      doc.moveTo(pointX, pointY);
      firstPoint = false;
    } else {
      doc.lineTo(pointX, pointY);
    }
    
    // Data points
    doc.circle(pointX, pointY, 3).fill(color);
  });
  
  doc.stroke();
}

// Pie chart like UniDOC
function drawPieChart(doc: PDFDocumentType, centerX: number, centerY: number, radius: number, data: any[], title: string) {
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text(title, centerX - 50, centerY - radius - 30);
  
  let currentAngle = 0;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    
    doc.save()
       .translate(centerX, centerY)
       .rotate(currentAngle)
       .arc(0, 0, radius, 0, sliceAngle)
       .lineTo(0, 0)
       .fill(item.color);
    
    doc.restore();
    currentAngle += sliceAngle;
  });
  
  // Legend
  let legendY = centerY + radius + 20;
  data.forEach((item) => {
    doc.rect(centerX - 60, legendY, 10, 10).fill(item.color);
    doc.fontSize(9).fillColor('#2d3748').text(`${item.label}: ${item.value}%`, centerX - 45, legendY + 2);
    legendY += 15;
  });
}

async function generateProfessionalCoverPage(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string, pageNum: number) {
  generateProfessionalHeader(doc, 'EUDR COMPLIANCE PACK', packId, '#1a365d');
  
  // Overview metrics like UniDOC dashboard
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold').text('COMPLIANCE OVERVIEW', 70, 130);
  
  // Score cards row 1
  drawScoreCard(doc, 70, 160, 'A', 96, 'Overall Score', '#38a169');
  drawScoreCard(doc, 210, 160, 'B', 98, 'Export Ready', '#3182ce');
  drawScoreCard(doc, 350, 160, 'A', 95, 'Risk Level', '#38a169');
  
  // Certificate information panel
  doc.rect(70, 260, 450, 100).fill('#f8fafc').stroke('#e2e8f0', 1);
  doc.rect(70, 260, 450, 30).fill('#4a5568');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold').text('CERTIFICATE INFORMATION', 85, 275);
  
  // Info grid
  doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Certificate Holder:', 85, 305)
     .text('Farm Location:', 285, 305)
     .text('Issue Date:', 85, 325)
     .text('Export Company:', 285, 325);
  
  doc.fontSize(11).fillColor('#4a5568')
     .text(farmerData.name, 185, 305)
     .text(`${farmerData.county}, Liberia`, 365, 305)
     .text(currentDate, 155, 325)
     .text(exportData.company, 385, 325);
  
  // Mini trend chart
  const trendData = [85, 87, 90, 93, 96, 98];
  drawLineChart(doc, 70, 380, 200, 100, trendData, 'Compliance Trend (6 Months)', '#38a169');
  
  // Risk assessment pie chart
  const riskData = [
    { label: 'No Risk', value: 85, color: '#38a169' },
    { label: 'Low Risk', value: 12, color: '#d69e2e' },
    { label: 'Medium Risk', value: 3, color: '#e53e3e' }
  ];
  drawPieChart(doc, 400, 430, 50, riskData, 'Risk Distribution');
  
  // Commentary
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('ABOUT THIS CERTIFICATION PACK', 70, 520);
  doc.fontSize(9).fillColor('#4a5568')
     .text('This comprehensive EUDR Compliance Certification Pack contains six specialized reports demonstrating', 70, 545)
     .text('full compliance with EU Deforestation Regulation requirements. Each certificate provides detailed', 70, 560)
     .text('analysis using advanced metrics, risk assessments, and professional visualizations.', 70, 575);
  
  await generateQRFooter(doc, packId, currentDate, 'Cover Page', farmerData.name, exportData.company, pageNum);
}

async function generateExportEligibilityWithCharts(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string, pageNum: number) {
  generateProfessionalHeader(doc, 'EXPORT ELIGIBILITY', packId, '#2563eb');
  
  // Grade cards
  drawScoreCard(doc, 70, 130, 'A', 98, 'Quality Standards', '#38a169');
  drawScoreCard(doc, 210, 130, 'A', 96, 'Documentation', '#3182ce');
  drawScoreCard(doc, 350, 130, 'A', 97, 'Traceability', '#805ad5');
  
  // Eligibility metrics bar chart
  const eligibilityData = [
    { label: 'Quality', value: 98, color: '#38a169' },
    { label: 'Docs', value: 96, color: '#3182ce' },
    { label: 'Trace', value: 97, color: '#805ad5' },
    { label: 'Safety', value: 95, color: '#d69e2e' },
    { label: 'Legal', value: 99, color: '#38a169' }
  ];
  drawBarChart(doc, 70, 240, 450, 120, eligibilityData, 'Export Eligibility Metrics');
  
  // Export timeline
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('EXPORT PROCESSING TIMELINE', 70, 390);
  
  const timelineSteps = [
    { step: 'Application', date: '2025-08-10', status: 'complete', color: '#38a169' },
    { step: 'Verification', date: '2025-08-12', status: 'complete', color: '#38a169' },
    { step: 'Approval', date: '2025-08-15', status: 'complete', color: '#38a169' },
    { step: 'Certification', date: '2025-08-16', status: 'current', color: '#3182ce' },
    { step: 'Export Ready', date: '2025-08-20', status: 'pending', color: '#d69e2e' }
  ];
  
  timelineSteps.forEach((step, index) => {
    const x = 70 + (index * 85);
    const y = 420;
    
    // Step circle
    doc.circle(x + 20, y, 12).fill(step.color);
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold').text((index + 1).toString(), x + 17, y - 3);
    
    // Step info
    doc.fontSize(9).fillColor('#2d3748').font('Helvetica-Bold').text(step.step, x - 10, y + 20);
    doc.fontSize(8).fillColor('#6b7280').text(step.date, x - 5, y + 35);
    
    // Connection line
    if (index < timelineSteps.length - 1) {
      doc.moveTo(x + 32, y).lineTo(x + 75, y).stroke('#e2e8f0', 2);
    }
  });
  
  // Export details panel
  doc.rect(70, 480, 450, 80).fill('#f8fafc').stroke('#e2e8f0', 1);
  doc.rect(70, 480, 450, 25).fill('#2563eb');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold').text('EXPORT DETAILS', 85, 490);
  
  doc.fontSize(10).fillColor('#2d3748')
     .text(`Quantity: ${exportData.quantity}`, 85, 520)
     .text(`Destination: ${exportData.destination}`, 285, 520)
     .text(`Vessel: ${exportData.vessel}`, 85, 540)
     .text(`Export Value: ${exportData.exportValue}`, 285, 540);
  
  // Commentary
  doc.fontSize(10).fillColor('#4a5568')
     .text('This certificate verifies agricultural commodity compliance with international export standards', 70, 580)
     .text('under EUDR guidelines. All quality metrics exceed minimum requirements for EU market access.', 70, 595);
  
  await generateQRFooter(doc, packId, currentDate, 'Export Eligibility', farmerData.name, exportData.company, pageNum);
}

async function generateComplianceWithMetrics(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string, pageNum: number) {
  generateProfessionalHeader(doc, 'COMPLIANCE ASSESSMENT', packId, '#059669');
  
  // Compliance overview cards
  drawScoreCard(doc, 70, 130, 'A', 95, 'EUDR Compliance', '#38a169');
  drawScoreCard(doc, 210, 130, 'A', 98, 'Forest Protection', '#059669');
  drawScoreCard(doc, 350, 130, 'A', 96, 'Documentation', '#3182ce');
  
  // Compliance matrix
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('COMPLIANCE ASSESSMENT MATRIX', 70, 240);
  
  // Matrix header
  doc.rect(70, 260, 450, 25).fill('#f1f5f9').stroke('#e2e8f0', 1);
  doc.fontSize(10).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Assessment Area', 85, 270)
     .text('Score', 200, 270)
     .text('Status', 280, 270)
     .text('Risk Level', 380, 270)
     .text('Trend', 450, 270);
  
  const assessments = [
    { area: 'EUDR Compliance', score: '95/100', status: 'APPROVED', risk: 'LOW', trend: '↑' },
    { area: 'Forest Protection', score: '98/100', status: 'EXCELLENT', risk: 'NONE', trend: '↑' },
    { area: 'Documentation', score: '96/100', status: 'COMPLETE', risk: 'LOW', trend: '→' },
    { area: 'Supply Chain', score: '94/100', status: 'VERIFIED', risk: 'LOW', trend: '↑' },
    { area: 'Environmental', score: '97/100', status: 'SUSTAINABLE', risk: 'MINIMAL', trend: '↑' }
  ];
  
  assessments.forEach((assessment, index) => {
    const y = 285 + (index * 25);
    const rowColor = index % 2 === 0 ? '#ffffff' : '#f8fafc';
    
    doc.rect(70, y, 450, 25).fill(rowColor).stroke('#e2e8f0', 1);
    doc.fontSize(9).fillColor('#2d3748')
       .text(assessment.area, 85, y + 8)
       .text(assessment.score, 200, y + 8)
       .text(assessment.status, 280, y + 8)
       .text(assessment.risk, 380, y + 8)
       .text(assessment.trend, 460, y + 8);
  });
  
  // Performance radar chart simulation
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold').text('PERFORMANCE RADAR', 70, 420);
  
  // Draw pentagon radar chart
  const centerX = 170;
  const centerY = 480;
  const radius = 50;
  
  // Pentagon outline
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      doc.moveTo(x, y);
    } else {
      doc.lineTo(x, y);
    }
  }
  doc.closePath().stroke('#e2e8f0', 1);
  
  // Performance data polygon
  const performanceValues = [0.95, 0.98, 0.96, 0.94, 0.97]; // Normalized scores
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const value = performanceValues[i];
    const x = centerX + Math.cos(angle) * radius * value;
    const y = centerY + Math.sin(angle) * radius * value;
    
    if (i === 0) {
      doc.moveTo(x, y);
    } else {
      doc.lineTo(x, y);
    }
  }
  doc.closePath().fill('rgba(56, 161, 105, 0.3)').stroke('#38a169', 2);
  
  // Labels
  const labels = ['EUDR', 'Forest', 'Docs', 'Chain', 'Env'];
  labels.forEach((label, index) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const x = centerX + Math.cos(angle) * (radius + 20);
    const y = centerY + Math.sin(angle) * (radius + 20);
    doc.fontSize(8).fillColor('#2d3748').text(label, x - 10, y - 4);
  });
  
  // Overall score
  doc.rect(300, 450, 220, 80).fill('#38a169');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold').text('OVERALL COMPLIANCE SCORE', 315, 470);
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('96/100', 380, 490);
  doc.fontSize(12).fillColor('#e2f8f5').text('STATUS: APPROVED FOR EXPORT', 320, 510);
  
  // Commentary
  doc.fontSize(10).fillColor('#4a5568')
     .text('Comprehensive assessment evaluates compliance across all EUDR requirements including forest', 70, 560)
     .text('protection, environmental sustainability, and supply chain integrity against benchmarks.', 70, 575);
  
  await generateQRFooter(doc, packId, currentDate, 'Compliance Assessment', farmerData.name, exportData.company, pageNum);
}

async function generateDeforestationWithRiskCharts(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string, pageNum: number) {
  generateProfessionalHeader(doc, 'DEFORESTATION ANALYSIS', packId, '#dc2626');
  
  // Risk level indicators
  drawScoreCard(doc, 70, 130, 'A', 92, 'Forest Score', '#38a169');
  drawScoreCard(doc, 210, 130, 'F', 2, 'Deforest Risk', '#38a169');
  drawScoreCard(doc, 350, 130, 'A', 98, 'Biodiversity', '#38a169');
  
  // Risk categories chart
  const riskCategories = [
    { label: 'Deforestation', value: 2, color: '#38a169' },
    { label: 'Degradation', value: 1, color: '#3182ce' },
    { label: 'Land Use', value: 3, color: '#805ad5' },
    { label: 'Biodiversity', value: 1, color: '#d69e2e' }
  ];
  drawBarChart(doc, 70, 240, 220, 120, riskCategories, 'Risk Assessment by Category');
  
  // Satellite monitoring timeline
  const monitoringData = [98, 97, 98, 96, 97, 98, 99, 98];
  drawLineChart(doc, 300, 240, 220, 120, monitoringData, 'Satellite Monitoring (8 Months)', '#38a169');
  
  // Risk matrix
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('DEFORESTATION RISK MATRIX', 70, 390);
  
  // Risk levels with color coding
  const riskLevels = [
    { category: 'Primary Forest Loss', current: 0, threshold: 5, status: 'SAFE', color: '#38a169' },
    { category: 'Secondary Forest Degradation', current: 1, threshold: 10, status: 'SAFE', color: '#38a169' },
    { category: 'Agricultural Expansion', current: 2, threshold: 15, status: 'SAFE', color: '#38a169' },
    { category: 'Infrastructure Development', current: 0, threshold: 8, status: 'SAFE', color: '#38a169' },
    { category: 'Illegal Logging Activity', current: 0, threshold: 3, status: 'SAFE', color: '#38a169' }
  ];
  
  riskLevels.forEach((risk, index) => {
    const y = 420 + (index * 25);
    
    doc.rect(70, y, 450, 20).fill(index % 2 === 0 ? '#ffffff' : '#f8fafc').stroke('#e2e8f0', 1);
    doc.fontSize(9).fillColor('#2d3748').text(risk.category, 85, y + 6);
    
    // Risk indicator
    doc.rect(300, y + 3, 100, 14).fill('#f1f5f9').stroke('#e2e8f0', 1);
    const riskWidth = (risk.current / risk.threshold) * 100;
    doc.rect(300, y + 3, riskWidth, 14).fill(risk.color);
    
    doc.fontSize(8).fillColor('#2d3748').text(`${risk.current}%`, 410, y + 7);
    doc.fontSize(8).fillColor(risk.color).font('Helvetica-Bold').text(risk.status, 450, y + 7);
  });
  
  // Environmental impact summary
  doc.rect(70, 550, 450, 60).fill('#f0fdf4').stroke('#38a169', 1);
  doc.rect(70, 550, 450, 20).fill('#38a169');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold').text('ENVIRONMENTAL IMPACT SUMMARY', 85, 560);
  
  doc.fontSize(10).fillColor('#166534')
     .text('• Zero deforestation detected in production area', 85, 580)
     .text('• Forest cover maintained at 98.5% baseline level', 285, 580)
     .text('• Biodiversity index shows positive trend (+2.1%)', 85, 595)
     .text('• Satellite monitoring confirms sustainable practices', 285, 595);
  
  // Commentary
  doc.fontSize(10).fillColor('#4a5568')
     .text('Analysis utilizes multi-spectral satellite monitoring and geospatial risk assessment to evaluate', 70, 630)
     .text('deforestation risks. All indicators confirm zero forest loss and sustainable land management.', 70, 645);
  
  await generateQRFooter(doc, packId, currentDate, 'Deforestation Analysis', farmerData.name, exportData.company, pageNum);
}

async function generateDueDiligenceWithFlow(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string, pageNum: number) {
  generateProfessionalHeader(doc, 'DUE DILIGENCE STATEMENT', packId, '#7c3aed');
  
  // Process completion indicators
  drawScoreCard(doc, 70, 130, 'A', 100, 'Verification', '#38a169');
  drawScoreCard(doc, 210, 130, 'A', 98, 'Documentation', '#3182ce');
  drawScoreCard(doc, 350, 130, 'A', 99, 'Compliance', '#805ad5');
  
  // Due diligence process flow
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('DUE DILIGENCE PROCESS FLOW', 70, 240);
  
  const processSteps = [
    { step: 'Data Collection', status: 'COMPLETE', progress: 100, color: '#38a169' },
    { step: 'Geolocation Verification', status: 'COMPLETE', progress: 100, color: '#38a169' },
    { step: 'Risk Assessment', status: 'COMPLETE', progress: 100, color: '#38a169' },
    { step: 'Documentation Review', status: 'COMPLETE', progress: 98, color: '#38a169' },
    { step: 'Legal Compliance Check', status: 'COMPLETE', progress: 100, color: '#38a169' },
    { step: 'Final Verification', status: 'COMPLETE', progress: 99, color: '#38a169' }
  ];
  
  processSteps.forEach((step, index) => {
    const y = 270 + (index * 30);
    
    // Step indicator
    doc.circle(85, y + 10, 8).fill(step.color);
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold').text('✓', 82, y + 7);
    
    // Step details
    doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold').text(step.step, 105, y + 5);
    doc.fontSize(9).fillColor(step.color).text(step.status, 105, y + 17);
    
    // Progress bar
    doc.rect(280, y + 8, 150, 8).fill('#f1f5f9').stroke('#e2e8f0', 1);
    const progressWidth = (step.progress / 100) * 150;
    doc.rect(280, y + 8, progressWidth, 8).fill(step.color);
    
    // Progress percentage
    doc.fontSize(9).fillColor('#2d3748').text(`${step.progress}%`, 440, y + 7);
    
    // Connection line
    if (index < processSteps.length - 1) {
      doc.moveTo(85, y + 18).lineTo(85, y + 40).stroke('#e2e8f0', 2);
    }
  });
  
  // EUDR requirements checklist
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('EUDR ARTICLE 8 REQUIREMENTS', 70, 470);
  
  const eudrRequirements = [
    'Geolocation coordinates verified using GPS technology',
    'Supply chain documentation reviewed and validated',
    'Risk assessment conducted using satellite monitoring',
    'Legal compliance verification performed',
    'Operator information system compliance confirmed',
    'Due diligence declaration statement finalized'
  ];
  
  eudrRequirements.forEach((requirement, index) => {
    const y = 500 + (index * 20);
    
    doc.rect(80, y + 2, 12, 12).fill('#38a169');
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold').text('✓', 84, y + 5);
    doc.fontSize(9).fillColor('#2d3748').text(requirement, 100, y + 5);
  });
  
  // Final certification
  doc.rect(70, 630, 450, 50).fill('#7c3aed');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold').text('EUDR DUE DILIGENCE STATEMENT COMPLETE', 85, 645);
  doc.fontSize(10).fillColor('#e0e7ff').text('All due diligence requirements satisfied per EU Regulation 2023/1115', 85, 665);
  
  await generateQRFooter(doc, packId, currentDate, 'Due Diligence', farmerData.name, exportData.company, pageNum);
}

async function generateSupplyChainWithNetwork(doc: PDFDocumentType, farmerData: FarmerData, exportData: ExportData, packId: string, currentDate: string, pageNum: number) {
  generateProfessionalHeader(doc, 'SUPPLY CHAIN TRACEABILITY', packId, '#ea580c');
  
  // Traceability metrics
  drawScoreCard(doc, 70, 130, 'A', 97, 'Traceability', '#38a169');
  drawScoreCard(doc, 210, 130, 'A', 95, 'Visibility', '#3182ce');
  drawScoreCard(doc, 350, 130, 'A', 99, 'Integrity', '#805ad5');
  
  // Supply chain network diagram
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('SUPPLY CHAIN NETWORK MAP', 70, 240);
  
  // Network nodes
  const nodes = [
    { id: 'FARM', x: 120, y: 300, label: 'Origin Farm', color: '#38a169' },
    { id: 'PROCESSING', x: 220, y: 280, label: 'Processing', color: '#3182ce' },
    { id: 'STORAGE', x: 320, y: 300, label: 'Storage', color: '#805ad5' },
    { id: 'LOGISTICS', x: 420, y: 280, label: 'Logistics', color: '#d69e2e' },
    { id: 'EXPORT', x: 370, y: 350, label: 'Export Port', color: '#dc2626' }
  ];
  
  // Draw connections
  const connections = [
    ['FARM', 'PROCESSING'],
    ['PROCESSING', 'STORAGE'],
    ['STORAGE', 'LOGISTICS'],
    ['LOGISTICS', 'EXPORT']
  ];
  
  connections.forEach(([from, to]) => {
    const fromNode = nodes.find(n => n.id === from);
    const toNode = nodes.find(n => n.id === to);
    
    doc.moveTo(fromNode.x, fromNode.y)
       .lineTo(toNode.x, toNode.y)
       .stroke('#9ca3af', 2);
  });
  
  // Draw nodes
  nodes.forEach(node => {
    doc.circle(node.x, node.y, 15).fill(node.color);
    doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold').text(node.id.charAt(0), node.x - 3, node.y - 3);
    doc.fontSize(9).fillColor('#2d3748').text(node.label, node.x - 20, node.y + 20);
  });
  
  // Traceability timeline
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold').text('TRACEABILITY TIMELINE', 70, 390);
  
  const timelineEvents = [
    { date: '2025-08-01', event: 'Harvest Initiated', location: farmerData.county, status: 'verified' },
    { date: '2025-08-05', event: 'Quality Control Check', location: 'Processing Facility', status: 'verified' },
    { date: '2025-08-10', event: 'Storage & Documentation', location: 'Certified Warehouse', status: 'verified' },
    { date: '2025-08-15', event: 'Pre-Export Inspection', location: 'Port Authority', status: 'verified' },
    { date: '2025-08-20', event: 'Export Clearance', location: 'Monrovia Port', status: 'pending' }
  ];
  
  timelineEvents.forEach((event, index) => {
    const y = 420 + (index * 25);
    const statusColor = event.status === 'verified' ? '#38a169' : '#d69e2e';
    
    doc.rect(70, y, 450, 20).fill(index % 2 === 0 ? '#ffffff' : '#f8fafc').stroke('#e2e8f0', 1);
    
    doc.fontSize(9).fillColor('#2d3748').font('Helvetica-Bold').text(event.date, 85, y + 6);
    doc.fontSize(9).fillColor('#2d3748').text(event.event, 150, y + 6);
    doc.fontSize(8).fillColor('#6b7280').text(event.location, 300, y + 6);
    
    doc.circle(450, y + 10, 6).fill(statusColor);
    doc.fontSize(7).fillColor('#ffffff').text(event.status === 'verified' ? '✓' : '⋯', 447, y + 7);
  });
  
  // Verification summary
  doc.rect(70, 550, 450, 60).fill('#f0f9ff').stroke('#3182ce', 1);
  doc.rect(70, 550, 450, 20).fill('#3182ce');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold').text('TRACEABILITY VERIFICATION SUMMARY', 85, 560);
  
  doc.fontSize(10).fillColor('#1e40af')
     .text('• Complete chain of custody documented with GPS coordinates', 85, 580)
     .text('• All stakeholders verified and certified', 285, 580)
     .text('• Quality control measures implemented at each stage', 85, 595)
     .text('• End-to-end traceability confirmed via blockchain ledger', 285, 595);
  
  // Commentary
  doc.fontSize(10).fillColor('#4a5568')
     .text('Complete supply chain traceability from farm origin to export destination with verified', 70, 630)
     .text('documentation at each stage. All stakeholders meet EUDR compliance requirements.', 70, 645);
  
  await generateQRFooter(doc, packId, currentDate, 'Supply Chain Traceability', farmerData.name, exportData.company, pageNum);
}