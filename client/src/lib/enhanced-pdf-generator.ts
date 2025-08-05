import jsPDF from 'jspdf';

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

// Helper function to add LACRA letterhead
const addLACRALetterhead = (pdf: jsPDF, title: string, subtitle: string, headerColor: number[]) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header background with gradient effect
  pdf.setFillColor(...headerColor);
  pdf.rect(0, 0, pageWidth, 40, 'F');
  pdf.setFillColor(headerColor[0] - 20, headerColor[1] - 20, headerColor[2] - 20);
  pdf.rect(0, 30, pageWidth, 10, 'F');
  
  // LACRA Logo area (left)
  pdf.setFillColor(255, 255, 255);
  pdf.rect(10, 5, 35, 25, 'F');
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(10, 5, 35, 25, 'S');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LACRA', 20, 15);
  pdf.setFontSize(6);
  pdf.text('Liberia Agriculture', 12, 20);
  pdf.text('Commodity Regulatory', 12, 23);
  pdf.text('Authority', 12, 26);
  
  // EU/International Standards Logo (right)
  pdf.setFillColor(255, 255, 255);
  pdf.rect(pageWidth - 45, 5, 35, 25, 'F');
  pdf.rect(pageWidth - 45, 5, 35, 25, 'S');
  
  pdf.setFontSize(8);
  pdf.text('EU DEFORESTATION', pageWidth - 42, 15);
  pdf.text('REGULATION', pageWidth - 38, 19);
  pdf.text('COMPLIANT', pageWidth - 37, 23);
  pdf.text('★ ★ ★', pageWidth - 32, 27);
  
  // Main title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, 55, 18);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(subtitle, 55, 28);
  
  // LACRA address and contact info
  pdf.setFontSize(7);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Ministry of Agriculture, Capitol Hill, Monrovia, Liberia | Tel: +231-XXX-XXXX | www.lacra.gov.lr', 10, 37);
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
    pdf.setFillColor(...colors[0]);
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
    pdf.setFillColor(...colors[index % colors.length]);
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
  
  // Page 1: Executive Summary with LACRA Letterhead
  addLACRALetterhead(pdf, 'EUDR COMPLIANCE ASSESSMENT', 'European Union Deforestation Regulation Report', colors.primary);
  
  // Report metadata with official styling
  let yPos = 50;
  pdf.setFillColor(...colors.background);
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(10, yPos, pageWidth - 20, 35, 'FD');
  
  // Report header
  pdf.setFillColor(...colors.info);
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
  
  findings.forEach((finding, index) => {
    pdf.text(finding, 15, yPos + (index * 6));
  });
  
  // Add Page 2: Detailed Analysis
  pdf.addPage();
  addLACRALetterhead(pdf, 'DETAILED COMPLIANCE ANALYSIS', 'Technical Assessment & Documentation Review', colors.secondary);
  
  yPos = 50;
  
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
  
  data.documentationRequired.forEach((doc, index) => {
    pdf.setFillColor(...colors.warning);
    pdf.rect(15, yPos + (index * 10) + 2, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('!', 16.5, yPos + (index * 10) + 5);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(doc, 25, yPos + (index * 10) + 5);
  });
  
  // Compliance recommendations
  yPos += (data.documentationRequired.length * 10) + 20;
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
  
  data.recommendations.forEach((rec, index) => {
    pdf.setFillColor(...colors.success);
    pdf.rect(15, yPos + (index * 8) + 1, 4, 4, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('✓', 16.5, yPos + (index * 8) + 4);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(rec, 25, yPos + (index * 8) + 4);
  });
  
  // Official footer
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text('OFFICIAL LACRA EUDR COMPLIANCE ASSESSMENT', 10, pageHeight - 18);
  pdf.text('This document is issued under the authority of the Liberia Agriculture Commodity Regulatory Authority', 10, pageHeight - 12);
  pdf.text(`Report Reference: ${data.reportId} | Generated: ${new Date().toLocaleDateString()} | Valid for: 12 months`, 10, pageHeight - 6);
  pdf.text('For verification, contact: compliance@lacra.gov.lr', pageWidth - 60, pageHeight - 6);
  
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
  
  // Page 1: Environmental Impact Assessment
  addLACRALetterhead(pdf, 'DEFORESTATION ANALYSIS REPORT', 'Environmental Impact & Forest Change Assessment', colors.primary);
  
  // Report metadata
  let yPos = 50;
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
  
  // Official LACRA footer
  pdf.setFillColor(...colors.primary);
  pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text('OFFICIAL LACRA ENVIRONMENTAL ASSESSMENT', 10, pageHeight - 18);
  pdf.text('Environmental Protection Division | Satellite Monitoring & Forest Conservation Unit', 10, pageHeight - 12);
  pdf.text(`Assessment Reference: ${data.reportId} | Analysis Date: ${new Date().toLocaleDateString()} | Next Review: ${new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString()}`, 10, pageHeight - 6);
  pdf.text('For environmental queries: environment@lacra.gov.lr', pageWidth - 70, pageHeight - 6);
  
  pdf.save(`LACRA_Deforestation_Analysis_${data.farmerId}_${data.reportId}.pdf`);
};