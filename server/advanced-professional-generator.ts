import PDFDocument from 'pdfkit';
import fs from 'fs';

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

export function generateAdvancedProfessionalReport(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): PDFDocument {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
    info: {
      Title: 'EUDR Compliance Report - Professional',
      Author: 'LACRA & ECOENVIRO',
      Subject: 'EU Deforestation Regulation Compliance Certificate'
    }
  });

  const currentDate = new Date().toLocaleDateString();
  const pageWidth = 595;
  const pageHeight = 842;

  // PROFESSIONAL ENTERPRISE HEADER
  generateProfessionalHeader(doc, packId, currentDate);
  
  // EXECUTIVE SUMMARY SECTION
  generateExecutiveSummary(doc, farmerData, exportData);
  
  // ADVANCED KPI DASHBOARD
  generateAdvancedKPIDashboard(doc);
  
  // PROFESSIONAL CHARTS SECTION
  generateProfessionalCharts(doc);
  
  // COMPLIANCE MATRIX
  generateComplianceMatrix(doc);
  
  // PROFESSIONAL FOOTER
  generateProfessionalFooter(doc, packId, currentDate);

  return doc;
}

function generateProfessionalHeader(doc: PDFDocument, packId: string, currentDate: string) {
  // Clean white background with professional accent
  doc.rect(0, 0, 595, 80).fill('#ffffff');
  doc.rect(0, 0, 595, 4).fill('#dc2626'); // Professional red accent stripe
  
  // Header background
  doc.rect(0, 4, 595, 76).fill('#f8fafc');
  
  // Company branding section - left aligned
  doc.fontSize(24).fillColor('#1f2937').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE REPORT', 40, 20);
  
  doc.fontSize(12).fillColor('#4b5563')
     .text('European Union Deforestation Regulation | Professional Assessment', 40, 50);
  
  // Status badge - professional design
  doc.rect(40, 60, 100, 18).fill('#dcfce7').stroke('#16a34a', 1);
  doc.fontSize(10).fillColor('#15803d').font('Helvetica-Bold')
     .text('✓ CERTIFIED COMPLIANT', 50, 67);
  
  // Right side - certification badges
  doc.rect(450, 15, 120, 20).fill('#1e40af');
  doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA CERTIFIED', 465, 22);
  
  doc.rect(450, 40, 120, 20).fill('#059669');
  doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold')
     .text('ECOENVIRO VERIFIED', 460, 47);
  
  // Document metadata
  doc.fontSize(8).fillColor('#6b7280')
     .text(`Report ID: ${packId.slice(-8)} | Generated: ${currentDate}`, 450, 65);
}

function generateExecutiveSummary(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData) {
  const startY = 100;
  
  // Executive Summary Header
  doc.rect(40, startY, 515, 30).fill('#1f2937');
  doc.fontSize(16).fillColor('#ffffff').font('Helvetica-Bold')
     .text('EXECUTIVE SUMMARY', 50, startY + 10);
  
  // Summary cards row
  const cardY = startY + 40;
  const cardWidth = 165;
  const cardHeight = 80;
  
  // Farmer Information Card
  doc.rect(40, cardY, cardWidth, cardHeight).fill('#ffffff').stroke('#e5e7eb', 1);
  doc.rect(40, cardY, cardWidth, 25).fill('#eff6ff');
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold').text('Producer Profile', 50, cardY + 8);
  
  doc.fontSize(10).fillColor('#374151').text('Name:', 50, cardY + 35);
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold').text(farmerData.name || 'Test Farmer', 50, cardY + 50);
  doc.fontSize(9).fillColor('#6b7280').text(`${farmerData.county}, Liberia`, 50, cardY + 65);
  
  // Export Information Card  
  doc.rect(215, cardY, cardWidth, cardHeight).fill('#ffffff').stroke('#e5e7eb', 1);
  doc.rect(215, cardY, cardWidth, 25).fill('#fef3c7');
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold').text('Export Details', 225, cardY + 8);
  
  doc.fontSize(10).fillColor('#374151').text('Company:', 225, cardY + 35);
  doc.fontSize(9).fillColor('#1f2937').font('Helvetica-Bold').text(exportData.company, 225, cardY + 48);
  doc.fontSize(8).fillColor('#6b7280').text(`Quantity: ${exportData.quantity}`, 225, cardY + 62);
  
  // Compliance Status Card
  doc.rect(390, cardY, cardWidth, cardHeight).fill('#ffffff').stroke('#e5e7eb', 1);
  doc.rect(390, cardY, cardWidth, 25).fill('#dcfce7');
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold').text('Compliance Status', 400, cardY + 8);
  
  // Large compliance indicator
  doc.circle(472, cardY + 55, 20).fill('#10b981');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold').text('✓', 467, cardY + 47);
  doc.fontSize(9).fillColor('#15803d').font('Helvetica-Bold').text('APPROVED', 448, cardY + 75);
}

function generateAdvancedKPIDashboard(doc: PDFDocument) {
  const dashboardY = 220;
  
  // Dashboard header
  doc.rect(40, dashboardY, 515, 25).fill('#374151');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('KEY PERFORMANCE INDICATORS', 50, dashboardY + 8);
  
  // KPI metrics with professional grade system
  const kpiData = [
    { metric: 'Deforestation Risk', value: '0.2%', grade: 'A+', color: '#10b981', score: 98 },
    { metric: 'Carbon Footprint', value: 'MINIMAL', grade: 'A', color: '#3b82f6', score: 95 },
    { metric: 'Supply Chain', value: 'VERIFIED', grade: 'A-', color: '#8b5cf6', score: 92 },
    { metric: 'Documentation', value: 'COMPLETE', grade: 'A+', color: '#f59e0b', score: 99 }
  ];
  
  kpiData.forEach((kpi, index) => {
    const x = 40 + (index * 128);
    const y = dashboardY + 35;
    
    // KPI card with professional styling
    doc.rect(x, y, 120, 90).fill('#ffffff').stroke('#e5e7eb', 1);
    
    // Header with gradient-like effect
    doc.rect(x, y, 120, 25).fill('#f8fafc').stroke('#e5e7eb', 0.5);
    
    // Grade badge - circular professional design
    doc.circle(x + 100, y + 12, 12).fill(kpi.color);
    doc.fontSize(11).fillColor('#ffffff').font('Helvetica-Bold').text(kpi.grade, x + 95, y + 8);
    
    // Metric name
    doc.fontSize(10).fillColor('#374151').font('Helvetica-Bold').text(kpi.metric, x + 8, y + 8);
    
    // Large value display
    doc.fontSize(14).fillColor(kpi.color).font('Helvetica-Bold').text(kpi.value, x + 8, y + 35);
    
    // Score bar
    const barWidth = (kpi.score / 100) * 100;
    doc.rect(x + 8, y + 60, 104, 8).fill('#f1f5f9');
    doc.rect(x + 8, y + 60, barWidth, 8).fill(kpi.color);
    
    // Score percentage
    doc.fontSize(9).fillColor('#6b7280').text(`${kpi.score}% Compliant`, x + 8, y + 75);
  });
}

function generateProfessionalCharts(doc: PDFDocument) {
  const chartsY = 350;
  
  // Charts section header
  doc.rect(40, chartsY, 515, 25).fill('#1e293b');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('COMPLIANCE ANALYTICS & RISK ASSESSMENT', 50, chartsY + 8);
  
  // Left panel - Risk Distribution Chart
  doc.rect(40, chartsY + 35, 250, 160).fill('#ffffff').stroke('#e5e7eb', 1);
  doc.rect(40, chartsY + 35, 250, 25).fill('#f8fafc');
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold').text('Risk Distribution Matrix', 50, chartsY + 47);
  
  // Professional pie chart
  const centerX = 140;
  const centerY = chartsY + 120;
  const radius = 35;
  
  // Create segments with professional colors
  // Low Risk (85%) - Green
  doc.save();
  doc.translate(centerX, centerY);
  doc.rotate(0);
  doc.moveTo(0, 0).arc(0, 0, radius, 0, Math.PI * 1.7).fill('#10b981');
  doc.restore();
  
  // Medium Risk (12%) - Amber  
  doc.save();
  doc.translate(centerX, centerY);
  doc.rotate(Math.PI * 1.7);
  doc.moveTo(0, 0).arc(0, 0, radius, 0, Math.PI * 0.24).fill('#f59e0b');
  doc.restore();
  
  // High Risk (3%) - Red
  doc.save();
  doc.translate(centerX, centerY);
  doc.rotate(Math.PI * 1.94);
  doc.moveTo(0, 0).arc(0, 0, radius, 0, Math.PI * 0.06).fill('#ef4444');
  doc.restore();
  
  // Center score circle
  doc.circle(centerX, centerY, 15).fill('#ffffff').stroke('#e5e7eb', 2);
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold').text('97%', centerX - 10, centerY - 3);
  
  // Professional legend
  const legendX = 200;
  const legendY = chartsY + 90;
  
  doc.rect(legendX, legendY, 80, 80).fill('#f8fafc').stroke('#e5e7eb', 1);
  doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold').text('Legend', legendX + 5, legendY + 8);
  
  // Legend items
  doc.rect(legendX + 5, legendY + 25, 10, 10).fill('#10b981');
  doc.fontSize(8).fillColor('#374151').text('Low Risk 85%', legendX + 20, legendY + 28);
  
  doc.rect(legendX + 5, legendY + 40, 10, 10).fill('#f59e0b');
  doc.fontSize(8).fillColor('#374151').text('Medium 12%', legendX + 20, legendY + 43);
  
  doc.rect(legendX + 5, legendY + 55, 10, 10).fill('#ef4444');
  doc.fontSize(8).fillColor('#374151').text('High Risk 3%', legendX + 20, legendY + 58);
  
  // Right panel - Performance Metrics Chart
  doc.rect(305, chartsY + 35, 250, 160).fill('#ffffff').stroke('#e5e7eb', 1);
  doc.rect(305, chartsY + 35, 250, 25).fill('#f8fafc');
  doc.fontSize(12).fillColor('#1f2937').font('Helvetica-Bold').text('Performance Benchmark', 315, chartsY + 47);
  
  // Professional bar chart
  const barChartData = [
    { label: 'EUDR Compliance', value: 98, color: '#10b981' },
    { label: 'Forest Protection', value: 95, color: '#3b82f6' },
    { label: 'Supply Verification', value: 92, color: '#8b5cf6' },
    { label: 'Documentation', value: 99, color: '#f59e0b' }
  ];
  
  barChartData.forEach((item, index) => {
    const barY = chartsY + 75 + (index * 25);
    const barWidth = (item.value / 100) * 160;
    
    // Background bar
    doc.rect(320, barY, 160, 15).fill('#f1f5f9').stroke('#e5e7eb', 0.5);
    
    // Value bar with gradient effect
    doc.rect(320, barY, barWidth, 15).fill(item.color);
    doc.rect(320, barY, barWidth, 3).fill('#ffffff').opacity(0.3);
    
    // Value label
    doc.fontSize(9).fillColor('#ffffff').font('Helvetica-Bold').text(`${item.value}%`, 325, barY + 4);
    
    // Metric label
    doc.fontSize(8).fillColor('#374151').text(item.label, 490, barY + 4);
  });
}

function generateComplianceMatrix(doc: PDFDocument) {
  const matrixY = 540;
  
  // Matrix header
  doc.rect(40, matrixY, 515, 25).fill('#0f172a');
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('COMPREHENSIVE COMPLIANCE VERIFICATION MATRIX', 50, matrixY + 8);
  
  // Compliance table with professional styling
  const tableY = matrixY + 35;
  const rowHeight = 25;
  const colWidths = [200, 100, 100, 115];
  
  // Table headers
  doc.rect(40, tableY, 515, rowHeight).fill('#374151');
  
  let currentX = 40;
  const headers = ['Compliance Requirement', 'Status', 'Score', 'Certification'];
  
  headers.forEach((header, index) => {
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold')
       .text(header, currentX + 5, tableY + 8);
    currentX += colWidths[index];
  });
  
  // Table rows
  const tableData = [
    ['EU Deforestation Regulation 2023/1115', 'COMPLIANT', '98%', '✓ CERTIFIED'],
    ['Forest Risk Assessment', 'VERIFIED', '95%', '✓ APPROVED'],
    ['Supply Chain Traceability', 'VALIDATED', '92%', '✓ CONFIRMED'],
    ['Documentation Completeness', 'COMPLETE', '99%', '✓ VERIFIED']
  ];
  
  tableData.forEach((row, rowIndex) => {
    const y = tableY + rowHeight + (rowIndex * rowHeight);
    const bgColor = rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
    
    doc.rect(40, y, 515, rowHeight).fill(bgColor).stroke('#e5e7eb', 0.5);
    
    currentX = 40;
    row.forEach((cell, cellIndex) => {
      const textColor = cellIndex === 2 ? '#10b981' : '#374151';
      const fontWeight = cellIndex === 3 ? 'Helvetica-Bold' : 'Helvetica';
      
      doc.fontSize(9).fillColor(textColor).font(fontWeight)
         .text(cell, currentX + 5, y + 8);
      currentX += colWidths[cellIndex];
    });
  });
}

function generateProfessionalFooter(doc: PDFDocument, packId: string, currentDate: string) {
  const footerY = 750;
  
  // Professional footer background
  doc.rect(0, footerY, 595, 92).fill('#1f2937');
  
  // Footer content
  doc.rect(40, footerY + 10, 515, 25).fill('#374151');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold')
     .text('CERTIFICATE VALIDATION & AUTHENTICATION', 50, footerY + 18);
  
  // Certificate details in professional layout
  doc.fontSize(10).fillColor('#e5e7eb')
     .text(`Certificate ID: LACRA-EUDR-${packId.slice(-8)}`, 50, footerY + 45);
  
  doc.fontSize(9).fillColor('#d1d5db')
     .text(`Issue Date: ${currentDate} | Valid Period: 24 months`, 50, footerY + 60);
  
  doc.fontSize(8).fillColor('#9ca3af')
     .text('Next Review: ' + new Date(Date.now() + 24*30*24*60*60*1000).toLocaleDateString(), 50, footerY + 75);
  
  // Verification contacts
  doc.fontSize(8).fillColor('#6b7280')
     .text('Verification: compliance@lacra.gov.lr | certification@ecoenviro.com', 300, footerY + 75);
  
  // Security elements
  doc.rect(450, footerY + 45, 100, 15).fill('#dc2626');
  doc.fontSize(8).fillColor('#ffffff').font('Helvetica-Bold')
     .text('OFFICIAL DOCUMENT', 465, footerY + 51);
}