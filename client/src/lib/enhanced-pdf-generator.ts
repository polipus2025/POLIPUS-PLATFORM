import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export interface EUDRComplianceData {
  farmerId: string;
  farmerName: string;
  coordinates: string;
  riskLevel: 'low' | 'standard' | 'high';
  complianceScore: number;
  deforestationRisk: number;
  lastForestDate: string;
  documentationRequired: string[];
  recommendations: string[];
  reportId: string;
  generatedAt: string;
}

export interface DeforestationData {
  farmerId: string;
  farmerName: string;
  coordinates: string;
  forestLossDetected: boolean;
  forestLossDate: string | null;
  forestCoverChange: number;
  biodiversityImpact: 'minimal' | 'moderate' | 'significant';
  carbonStockLoss: number;
  mitigationRequired: boolean;
  recommendations: string[];
  reportId: string;
  generatedAt: string;
}

// Helper function to add LACRA & ECOENVIRO letterhead with QR code
const addLACRALetterhead = async (pdf: jsPDF, title: string, subtitle: string, reportUrl: string) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Use original green color scheme
  pdf.setFillColor(34, 197, 94); // Green background
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // LACRA Logo area (left) - Enhanced circular design with clear details
  pdf.setFillColor(255, 255, 255);
  pdf.rect(10, 8, 40, 30, 'F');
  pdf.setDrawColor(139, 69, 19);
  pdf.setLineWidth(1.5);
  pdf.rect(10, 8, 40, 30, 'S');
  
  // LACRA logo elements - larger and clearer circular design
  const centerX = 30;
  const centerY = 23;
  
  // Outer brown circle - larger and more defined
  pdf.setDrawColor(139, 69, 19);
  pdf.setLineWidth(2);
  pdf.circle(centerX, centerY, 12, 'S');
  
  // Inner agricultural commodities representation - enhanced
  // Palm fruit cluster (left side) - larger and more detailed
  pdf.setFillColor(255, 140, 0); // Orange for palm fruit
  pdf.circle(centerX - 6, centerY - 3, 3, 'F');
  pdf.setFillColor(255, 69, 0); // Red-orange palm fruit
  pdf.circle(centerX - 6, centerY - 3, 2, 'F');
  pdf.circle(centerX - 7, centerY - 1, 1.5, 'F');
  pdf.circle(centerX - 5, centerY - 1, 1.5, 'F');
  
  // Green leaf - larger and more prominent
  pdf.setFillColor(34, 197, 94); // Bright green
  pdf.ellipse(centerX - 3, centerY - 7, 4, 2, 'F');
  pdf.ellipse(centerX + 1, centerY - 6, 3, 1.5, 'F');
  
  // Cocoa beans cluster (right side) - enhanced
  pdf.setFillColor(139, 69, 19); // Rich brown
  pdf.circle(centerX + 4, centerY + 1, 2.5, 'F');
  pdf.circle(centerX + 6, centerY + 3, 2, 'F');
  pdf.circle(centerX + 3, centerY + 4, 1.8, 'F');
  
  // Golden commodity/grain (bottom)
  pdf.setFillColor(255, 215, 0); // Golden yellow
  pdf.circle(centerX - 2, centerY + 5, 2, 'F');
  pdf.circle(centerX + 1, centerY + 6, 1.5, 'F');
  
  // LACRA text - larger and clearer
  pdf.setTextColor(139, 69, 19);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LACRA', 22, 34);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Liberia Agriculture Commodity', 12, 36);
  pdf.text('Regulatory Authority', 20, 38);
  pdf.setFontSize(5);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Excellence in Agriculture', 22, 40);
  
  // ECOENVIRO Certification Logo (center)
  pdf.setFillColor(255, 255, 255);
  pdf.rect(55, 8, 50, 30, 'F');
  pdf.setDrawColor(59, 130, 246);
  pdf.setLineWidth(1.5);
  pdf.rect(55, 8, 50, 30, 'S');
  
  // ECOENVIRO logo design - enhanced certification symbol
  pdf.setFillColor(59, 130, 246); // Blue
  pdf.circle(80, 20, 8, 'S');
  pdf.setLineWidth(1);
  
  // Certification checkmark
  pdf.setDrawColor(34, 197, 94); // Green
  pdf.setLineWidth(2);
  // Drawing checkmark path
  pdf.line(75, 20, 78, 23);
  pdf.line(78, 23, 85, 16);
  
  // Environmental symbols
  pdf.setFillColor(34, 197, 94); // Green
  pdf.circle(75, 25, 1.5, 'F'); // Leaf symbol
  pdf.circle(85, 25, 1.5, 'F'); // Leaf symbol
  
  pdf.setTextColor(59, 130, 246);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ECOENVIRO', 62, 32);
  pdf.setFontSize(6);
  pdf.setTextColor(255, 165, 0);
  pdf.text('AUDIT & CERTIFICATION', 58, 35);
  
  // QR Code area (right side)
  const qrCodeData = await QRCode.toDataURL(reportUrl, {
    width: 60,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  pdf.addImage(qrCodeData, 'PNG', pageWidth - 35, 8, 25, 25);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.text('Scan to Download', pageWidth - 32, 36, { align: 'center' });
  pdf.text('Mobile Report', pageWidth - 32, 39, { align: 'center' });
  
  // Main title - properly centered
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, pageWidth / 2, 18, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(subtitle, pageWidth / 2, 25, { align: 'center' });
  
  // Contact information footer
  pdf.setFontSize(6);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Ministry of Agriculture, Capitol Hill, Monrovia, Liberia | Tel: +231-XXX-XXXX', 10, 44);
  pdf.text('Certified by ECOENVIRO | compliance@lacra.gov.lr | cert@ecoenviro.com', 10, 47);
};

// Helper function to wrap text properly to prevent cutoff
const addWrappedText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = pdf.getStringUnitWidth(testLine) * pdf.getFontSize() / pdf.internal.scaleFactor;
    
    if (metrics > maxWidth && n > 0) {
      pdf.text(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  pdf.text(line.trim(), x, currentY);
  return currentY + lineHeight;
};

// Helper function to draw pie charts
const drawPieChart = (pdf: jsPDF, centerX: number, centerY: number, radius: number, percentage: number, colors: number[][]) => {
  // Background circle
  pdf.setFillColor(240, 240, 240);
  pdf.circle(centerX, centerY, radius, 'F');
  
  // Outer ring
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(1);
  pdf.circle(centerX, centerY, radius, 'S');
  
  // Progress sector (approximated)
  if (percentage > 0) {
    pdf.setFillColor(colors[0][0], colors[0][1], colors[0][2]);
    const progressRadius = radius * 0.8;
    pdf.circle(centerX, centerY, progressRadius * (percentage / 100), 'F');
  }
  
  // Center circle with percentage
  pdf.setFillColor(255, 255, 255);
  pdf.circle(centerX, centerY, radius * 0.4, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  const textWidth = pdf.getTextWidth(`${percentage}%`);
  pdf.text(`${percentage}%`, centerX - textWidth/2, centerY + 2);
};

// Helper function to draw bar charts
const drawBarChart = (pdf: jsPDF, x: number, y: number, width: number, height: number, values: number[], labels: string[], colors: number[][]) => {
  const barWidth = width / values.length - 2;
  const maxValue = Math.max(...values, 100);
  
  // Draw background
  pdf.setFillColor(250, 250, 250);
  pdf.rect(x, y, width, height, 'F');
  pdf.setDrawColor(220, 220, 220);
  pdf.rect(x, y, width, height, 'S');
  
  // Draw grid lines
  pdf.setDrawColor(240, 240, 240);
  for (let i = 1; i <= 4; i++) {
    const gridY = y + (height * i / 5);
    pdf.line(x, gridY, x + width, gridY);
  }
  
  values.forEach((value, index) => {
    const barHeight = Math.max((value / maxValue) * height * 0.8, 2);
    const barX = x + (index * (barWidth + 2)) + 1;
    const barY = y + height - barHeight - 5;
    
    // Draw bar with gradient effect
    const color = colors[index % colors.length];
    pdf.setFillColor(color[0], color[1], color[2]);
    pdf.rect(barX, barY, barWidth, barHeight, 'F');
    
    // Lighter top section
    pdf.setFillColor(
      Math.min(colors[index % colors.length][0] + 30, 255),
      Math.min(colors[index % colors.length][1] + 30, 255),
      Math.min(colors[index % colors.length][2] + 30, 255)
    );
    pdf.rect(barX, barY, barWidth, Math.min(barHeight * 0.3, 3), 'F');
    
    // Value on top
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(7);
    pdf.text(value.toString(), barX + barWidth/2 - 3, barY - 2);
    
    // Label at bottom
    pdf.setFontSize(6);
    const labelWidth = pdf.getTextWidth(labels[index]);
    pdf.text(labels[index], barX + (barWidth - labelWidth)/2, y + height + 5);
  });
};

// Generate comprehensive EUDR compliance PDF with LACRA letterhead
export const generateEUDRCompliancePDF = async (data: EUDRComplianceData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  const colors = {
    primary: [22, 163, 74],     // LACRA Green
    secondary: [15, 118, 110],  // Teal
    success: [34, 197, 94],     // Bright green
    warning: [251, 191, 36],    // Yellow
    danger: [220, 38, 38],      // Red
    info: [59, 130, 246],       // Blue
    background: [249, 250, 251], // Light gray
  };
  
  // Generate QR code URL for mobile access
  const reportUrl = `${window.location.origin}/reports/eudr/${data.reportId}`;
  
  // Page 1: Executive Summary with LACRA & ECOENVIRO Letterhead
  await addLACRALetterhead(pdf, 'EUDR COMPLIANCE ASSESSMENT', 'European Union Deforestation Regulation Report', reportUrl);
  
  // Due Diligence Statement
  let yPos = 55;
  pdf.setFillColor(250, 245, 255);
  pdf.setDrawColor(147, 51, 234);
  pdf.rect(10, yPos, pageWidth - 20, 25, 'FD');
  
  pdf.setFillColor(147, 51, 234);
  pdf.rect(10, yPos, pageWidth - 20, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DUE DILIGENCE STATEMENT', 15, yPos + 4);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const maxWidth = pageWidth - 30;
  const line1 = 'This assessment has been conducted in accordance with EU Regulation 2023/1115 on deforestation-free products.';
  const line2 = 'The evaluation includes satellite monitoring, on-ground verification, and compliance with international standards.';
  const line3 = 'Certified jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority) and ECOENVIRO Audit & Certification.';
  
  pdf.text(line1, 15, yPos + 12, { maxWidth: maxWidth });
  pdf.text(line2, 15, yPos + 16, { maxWidth: maxWidth });
  pdf.text(line3, 15, yPos + 20, { maxWidth: maxWidth });
  
  // Report metadata with official styling
  yPos += 35;
  pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(10, yPos, pageWidth - 20, 35, 'FD');
  
  // Report header
  pdf.setFillColor(colors.info[0], colors.info[1], colors.info[2]);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICIAL COMPLIANCE ASSESSMENT DOCUMENT', 15, yPos + 5);
  
  // Report details
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Report Reference: ${data.reportId}`, 15, yPos + 15);
  pdf.text(`Assessment Date: ${new Date(data.generatedAt).toLocaleDateString()}`, 15, yPos + 22);
  pdf.text(`Property Owner: ${data.farmerName}`, 15, yPos + 29);
  
  pdf.text(`Farmer Registration: ${data.farmerId}`, 105, yPos + 15);
  pdf.text(`GPS Coordinates: ${data.coordinates}`, 105, yPos + 22);
  pdf.text(`Regulation: EU 2023/1115`, 105, yPos + 29);
  
  // Executive Summary Section
  yPos += 45;
  pdf.setFillColor(...colors.primary);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXECUTIVE SUMMARY', 15, yPos + 5);
  
  // Compliance score dashboard
  yPos += 20;
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(...colors.primary);
  pdf.rect(10, yPos, pageWidth - 20, 50, 'FD');
  
  // Large compliance score circle
  const scoreColor = data.complianceScore >= 80 ? [colors.success] : 
                    data.complianceScore >= 60 ? [colors.warning] : [colors.danger];
  
  drawPieChart(pdf, 40, yPos + 25, 18, data.complianceScore, scoreColor);
  
  // Compliance details
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OVERALL COMPLIANCE STATUS', 70, yPos + 15);
  
  pdf.setFontSize(12);
  const statusText = data.complianceScore >= 80 ? 'FULLY COMPLIANT' : 
                    data.complianceScore >= 60 ? 'MONITORING REQUIRED' : 'NON-COMPLIANT';
  const statusColor = data.complianceScore >= 80 ? colors.success : 
                     data.complianceScore >= 60 ? colors.warning : colors.danger;
  
  pdf.setFillColor(...statusColor);
  pdf.rect(70, yPos + 20, 50, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text(statusText, 75, yPos + 26);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Risk Classification: ${data.riskLevel.toUpperCase()}`, 70, yPos + 35);
  pdf.text(`Deforestation Risk: ${data.deforestationRisk}%`, 70, yPos + 42);
  
  // Risk assessment bar chart
  yPos += 60;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.primary);
  pdf.text('DETAILED RISK ASSESSMENT', 15, yPos);
  
  yPos += 10;
  const riskValues = [
    data.complianceScore,
    100 - data.deforestationRisk,
    data.documentationRequired.length === 0 ? 100 : 70,
    data.riskLevel === 'low' ? 95 : data.riskLevel === 'standard' ? 75 : 45
  ];
  const riskLabels = ['Compliance', 'Forest Protection', 'Documentation', 'Overall Risk'];
  const riskColors = [colors.success, colors.info, colors.warning, colors.primary];
  
  drawBarChart(pdf, 15, yPos, 165, 35, riskValues, riskLabels, riskColors);
  
  // Key findings section
  yPos += 50;
  pdf.setFillColor(...colors.info);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('KEY ASSESSMENT FINDINGS', 15, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  const findings = [
    `✓ Compliance Score: ${data.complianceScore}% (${data.complianceScore >= 80 ? 'Meets EUDR standards' : 'Requires improvement'})`,
    `✓ Deforestation Risk Assessment: ${data.deforestationRisk}% risk level`,
    `✓ Forest Baseline Date: ${data.lastForestDate} (Reference point for compliance)`,
    `✓ Required Documentation: ${data.documentationRequired.length} items outstanding`,
    `✓ Regulatory Status: ${data.riskLevel === 'low' ? 'Low risk - standard monitoring' : 'Enhanced monitoring required'}`
  ];
  
  // Use proper text wrapping for findings to prevent cutoff
  let currentY = yPos;
  findings.forEach((finding, index) => {
    const lineHeight = 7;
    currentY = addWrappedText(pdf, finding, 15, currentY, pageWidth - 30, lineHeight);
    currentY += 3; // Add spacing between findings
  });
  
  // Add Page 2: Detailed Analysis
  pdf.addPage();
  await addLACRALetterhead(pdf, 'DETAILED COMPLIANCE ANALYSIS', 'Technical Assessment & Documentation Review', reportUrl);
  
  yPos = 55;
  
  // Deforestation risk section
  pdf.setFillColor(...colors.danger);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DEFORESTATION RISK ANALYSIS', 15, yPos + 5);
  
  yPos += 20;
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(...colors.danger);
  pdf.rect(10, yPos, pageWidth - 20, 40, 'FD');
  
  // Risk level indicator with visual
  const riskLevelColor = data.riskLevel === 'low' ? colors.success :
                        data.riskLevel === 'standard' ? colors.warning : colors.danger;
  
  pdf.setFillColor(...riskLevelColor);
  pdf.rect(15, yPos + 10, 60, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.riskLevel.toUpperCase()} RISK`, 20, yPos + 20);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Deforestation Risk Percentage: ${data.deforestationRisk}%`, 85, yPos + 12);
  pdf.text(`Forest Baseline Reference: ${data.lastForestDate}`, 85, yPos + 20);
  pdf.text(`Monitoring Protocol: Satellite surveillance active`, 85, yPos + 28);
  pdf.text(`Compliance Period: Current assessment valid for 12 months`, 85, yPos + 36);
  
  // Documentation requirements
  yPos += 50;
  pdf.setFillColor(...colors.warning);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`DOCUMENTATION REQUIREMENTS (${data.documentationRequired.length} ITEMS)`, 15, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  // Use proper text wrapping for documentation requirements
  let docCurrentY = yPos;
  data.documentationRequired.forEach((doc, index) => {
    pdf.setFillColor(...colors.warning);
    pdf.rect(15, docCurrentY + 2, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('!', 16.5, docCurrentY + 5);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    docCurrentY = addWrappedText(pdf, doc, 25, docCurrentY + 5, pageWidth - 50, 6);
    docCurrentY += 8; // Add spacing between items
  });
  
  // Compliance recommendations
  yPos = docCurrentY + 20;
  pdf.setFillColor(...colors.success);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`COMPLIANCE RECOMMENDATIONS (${data.recommendations.length} ACTIONS)`, 15, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  // Use proper text wrapping for recommendations
  let recCurrentY = yPos;
  data.recommendations.forEach((rec, index) => {
    pdf.setFillColor(...colors.success);
    pdf.rect(15, recCurrentY + 1, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('✓', 16.5, recCurrentY + 4);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    recCurrentY = addWrappedText(pdf, rec, 25, recCurrentY + 4, pageWidth - 50, 6);
    recCurrentY += 8; // Add spacing between items
  });
  
  // Official footer with dual certification
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  const footerWidth = pageWidth - 20;
  pdf.text('OFFICIAL LACRA & ECOENVIRO EUDR COMPLIANCE ASSESSMENT', 10, pageHeight - 24, { maxWidth: footerWidth });
  pdf.setFont('helvetica', 'normal');
  pdf.text('This document is issued jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority)', 10, pageHeight - 18, { maxWidth: footerWidth });
  pdf.text('and ECOENVIRO Audit & Certification - Lab/Testing Services under EU Regulation 2023/1115', 10, pageHeight - 14, { maxWidth: footerWidth });
  pdf.text(`Report Reference: ${data.reportId} | Generated: ${new Date().toLocaleDateString()} | Valid for: 12 months`, 10, pageHeight - 8, { maxWidth: footerWidth });
  pdf.text('For verification: compliance@lacra.gov.lr | cert@ecoenviro.com', 10, pageHeight - 4, { maxWidth: footerWidth });
  
  pdf.save(`LACRA_EUDR_Compliance_${data.farmerId}_${data.reportId}.pdf`);
};

// Generate comprehensive deforestation analysis PDF with LACRA letterhead
export const generateDeforestationPDF = async (data: DeforestationData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  const colors = {
    primary: [22, 101, 52],     // Forest green
    secondary: [194, 65, 12],   // Forest orange
    danger: [220, 38, 38],      // Red
    success: [34, 197, 94],     // Green
    warning: [251, 191, 36],    // Yellow
    info: [59, 130, 246],       // Blue
    background: [254, 242, 242], // Light red tint
  };
  
  // Generate QR code URL for mobile access
  const deforestationReportUrl = `${window.location.origin}/reports/deforestation/${data.reportId}`;
  
  // Page 1: Environmental Impact Assessment
  await addLACRALetterhead(pdf, 'DEFORESTATION ANALYSIS REPORT', 'Environmental Impact & Forest Change Assessment', deforestationReportUrl);
  
  // Due Diligence Statement for Deforestation Report
  let yPos = 55;
  pdf.setFillColor(254, 242, 242);
  pdf.setDrawColor(220, 38, 38);
  pdf.rect(10, yPos, pageWidth - 20, 25, 'FD');
  
  pdf.setFillColor(220, 38, 38);
  pdf.rect(10, yPos, pageWidth - 20, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DUE DILIGENCE STATEMENT - ENVIRONMENTAL ASSESSMENT', 15, yPos + 4);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  const maxWidthEnv = pageWidth - 30;
  const envLine1 = 'This environmental assessment follows strict due diligence protocols using satellite imagery and field verification.';
  const envLine2 = 'Analysis conducted in compliance with international deforestation monitoring standards and best practices.';
  const envLine3 = 'Certified jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority) and ECOENVIRO Audit & Certification.';
  
  pdf.text(envLine1, 15, yPos + 12, { maxWidth: maxWidthEnv });
  pdf.text(envLine2, 15, yPos + 16, { maxWidth: maxWidthEnv });
  pdf.text(envLine3, 15, yPos + 20, { maxWidth: maxWidthEnv });
  
  // Report metadata
  yPos += 35;
  pdf.setFillColor(...colors.background);
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(10, yPos, pageWidth - 20, 35, 'FD');
  
  pdf.setFillColor(...colors.primary);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OFFICIAL ENVIRONMENTAL ASSESSMENT DOCUMENT', 15, yPos + 5);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.text(`Assessment Reference: ${data.reportId}`, 15, yPos + 15);
  pdf.text(`Analysis Date: ${new Date(data.generatedAt).toLocaleDateString()}`, 15, yPos + 22);
  pdf.text(`Property Owner: ${data.farmerName}`, 15, yPos + 29);
  
  pdf.text(`Property Registration: ${data.farmerId}`, 105, yPos + 15);
  pdf.text(`Location Coordinates: ${data.coordinates}`, 105, yPos + 22);
  pdf.text(`Satellite Data Source: Landsat-8, Sentinel-2`, 105, yPos + 29);
  
  // Forest Loss Detection Alert
  yPos += 45;
  const alertColor = data.forestLossDetected ? colors.danger : colors.success;
  pdf.setFillColor(...alertColor);
  pdf.rect(10, yPos, pageWidth - 20, 20, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  const alertText = data.forestLossDetected ? '⚠ FOREST LOSS DETECTED' : '✓ NO FOREST LOSS DETECTED';
  pdf.text(alertText, 15, yPos + 10);
  
  if (data.forestLossDate) {
    pdf.setFontSize(10);
    pdf.text(`Detection Date: ${data.forestLossDate}`, 15, yPos + 16);
  }
  
  // Environmental metrics dashboard
  yPos += 30;
  pdf.setFillColor(...colors.info);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ENVIRONMENTAL IMPACT METRICS', 15, yPos + 5);
  
  yPos += 20;
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(...colors.primary);
  pdf.rect(10, yPos, pageWidth - 20, 60, 'FD');
  
  // Forest cover change visualization
  const coverChangeColor = data.forestCoverChange >= 0 ? [colors.success] : [colors.danger];
  drawPieChart(pdf, 35, yPos + 30, 15, Math.abs(data.forestCoverChange), coverChangeColor);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Forest Cover Change', 15, yPos + 10);
  pdf.setFontSize(10);
  pdf.text(`${data.forestCoverChange >= 0 ? '+' : ''}${data.forestCoverChange}%`, 60, yPos + 30);
  
  // Carbon impact
  pdf.setFont('helvetica', 'bold');
  pdf.text('Carbon Stock Impact', 110, yPos + 10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${data.carbonStockLoss} tCO₂ equivalent`, 110, yPos + 18);
  pdf.text('Total carbon loss from assessment area', 110, yPos + 25);
  
  // Biodiversity impact gauge
  pdf.setFont('helvetica', 'bold');
  pdf.text('Biodiversity Impact Level', 15, yPos + 45);
  
  const impactColors = {
    'minimal': colors.success,
    'moderate': colors.warning,
    'significant': colors.danger
  };
  
  pdf.setFillColor(...impactColors[data.biodiversityImpact]);
  pdf.rect(15, yPos + 50, 80, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.biodiversityImpact.toUpperCase()} BIODIVERSITY IMPACT`, 20, yPos + 54);
  
  // Environmental metrics comparison chart
  yPos += 70;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...colors.primary);
  pdf.text('COMPARATIVE ENVIRONMENTAL ANALYSIS', 15, yPos);
  
  yPos += 15;
  const envMetrics = [
    Math.abs(data.forestCoverChange),
    data.carbonStockLoss,
    data.biodiversityImpact === 'minimal' ? 15 : data.biodiversityImpact === 'moderate' ? 50 : 85,
    data.mitigationRequired ? 75 : 25
  ];
  const envLabels = ['Forest Change %', 'Carbon Loss tCO₂', 'Biodiversity Risk', 'Action Required'];
  const envColors = [colors.danger, colors.secondary, colors.warning, colors.info];
  
  drawBarChart(pdf, 15, yPos, 165, 35, envMetrics, envLabels, envColors);
  
  // Add Page 2: Mitigation and Action Plan
  pdf.addPage();
  addLACRALetterhead(pdf, 'ENVIRONMENTAL ACTION PLAN', 'Mitigation Strategies & Monitoring Protocol', colors.success);
  
  yPos = 50;
  
  // Mitigation requirement alert
  const mitigationColor = data.mitigationRequired ? colors.warning : colors.success;
  pdf.setFillColor(...mitigationColor);
  pdf.rect(10, yPos, pageWidth - 20, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  const mitigationText = data.mitigationRequired ? '⚠ IMMEDIATE MITIGATION REQUIRED' : '✓ NO IMMEDIATE ACTION REQUIRED';
  pdf.text(mitigationText, 15, yPos + 9);
  
  // Environmental action plan
  yPos += 25;
  pdf.setFillColor(...colors.success);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`ENVIRONMENTAL ACTION PLAN (${data.recommendations.length} ACTIONS)`, 15, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  data.recommendations.forEach((rec, index) => {
    pdf.setFillColor(...colors.success);
    pdf.rect(15, yPos + (index * 12) + 2, 6, 6, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.text((index + 1).toString(), 17, yPos + (index * 12) + 6);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(rec, 25, yPos + (index * 12) + 6);
  });
  
  // Monitoring protocol
  yPos += (data.recommendations.length * 12) + 20;
  pdf.setFillColor(...colors.info);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ONGOING ENVIRONMENTAL MONITORING PROTOCOL', 15, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  
  const monitoringProtocol = [
    '• Satellite imagery analysis: Monthly Landsat-8 and Sentinel-2 monitoring',
    '• Biodiversity assessments: Quarterly field surveys and species monitoring',
    '• Carbon stock evaluations: Annual biomass and soil carbon measurements',
    '• GPS boundary verification: Continuous perimeter monitoring system',
    '• Deforestation alerts: Real-time change detection and automatic notifications',
    '• Compliance reporting: Bi-annual environmental impact assessments'
  ];
  
  monitoringProtocol.forEach((item, index) => {
    pdf.text(item, 15, yPos + (index * 7));
  });
  
  // Official LACRA & ECOENVIRO footer
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  const footerWidthEnv = pageWidth - 20;
  pdf.text('OFFICIAL LACRA & ECOENVIRO DEFORESTATION ANALYSIS REPORT', 10, pageHeight - 24, { maxWidth: footerWidthEnv });
  pdf.setFont('helvetica', 'normal');
  pdf.text('This document is issued jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority)', 10, pageHeight - 18, { maxWidth: footerWidthEnv });
  pdf.text('and ECOENVIRO Audit & Certification - Lab/Testing Services for Environmental Assessment', 10, pageHeight - 14, { maxWidth: footerWidthEnv });
  pdf.text(`Report Reference: ${data.reportId} | Generated: ${new Date().toLocaleDateString()} | Environmental Due Diligence`, 10, pageHeight - 8, { maxWidth: footerWidthEnv });
  pdf.text('For verification: environmental@lacra.gov.lr | cert@ecoenviro.com', 10, pageHeight - 4, { maxWidth: footerWidthEnv });
  
  pdf.save(`LACRA_Deforestation_Analysis_${data.farmerId}_${data.reportId}.pdf`);
};