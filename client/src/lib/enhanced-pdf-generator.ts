import { jsPDF } from 'jspdf';

// Enhanced PDF Generator for Comprehensive Reports
export interface ComprehensiveDeforestationData {
  farmerId: string;
  farmerName: string;
  county: string;
  farmSize: number;
  farmSizeUnit: string;
  gpsCoordinates: string;
  analysisDate: string;
  reportId: string;
  forestLossDetected: boolean;
  forestLossDate: string | null;
  forestCoverChange: number;
  baselineForestCover: number;
  currentForestCover: number;
  deforestationRate: number;
  biodiversityImpact: string;
  carbonStockLoss: number;
  carbonEmissions: number;
  mitigationRequired: boolean;
  recommendedActions: string[];
  reforestationPlan: string;
}

export interface ComprehensiveEUDRData {
  farmerId: string;
  farmerName: string;
  county: string;
  farmSize: number;
  farmSizeUnit: string;
  gpsCoordinates: string;
  assessmentDate: string;
  reportId: string;
  riskLevel: string;
  complianceScore: number;
  complianceStatus: string;
  dueDiligenceScore: number;
  deforestationRisk: number;
  legalHarvesting: boolean;
  humanRightsCompliance: boolean;
  mitigationPlan: string[];
  correctiveActions: string[];
}

export interface ComprehensiveFarmerData {
  farmerId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  county: string;
  farmSize: number;
  farmSizeUnit: string;
  gpsCoordinates: string;
  registrationDate: string;
  complianceScore: number;
  environmentalScore: number;
  primaryCrops: string[];
  sustainablePractices: string[];
}

// LACRA Letterhead Generator
const addLACRALetterhead = (pdf: jsPDF, title: string, subtitle: string, primaryColor: [number, number, number]) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Header background
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  pdf.rect(0, 0, pageWidth, 35, 'F');
  
  // LACRA Logo placeholder and text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🌿 LACRA', 15, 15);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Liberia Agriculture Commodity Regulatory Authority', 15, 22);
  pdf.text('Ministry of Agriculture, Republic of Liberia', 15, 28);
  
  // Title section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, pageWidth/2, 45, { align: 'center' });
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(subtitle, pageWidth/2, 52, { align: 'center' });
};

// Generate Comprehensive Deforestation Analysis PDF
export const generateComprehensiveDeforestationPDF = async (data: ComprehensiveDeforestationData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  const colors = {
    primary: [22, 163, 74] as [number, number, number],     // Green
    secondary: [15, 118, 110] as [number, number, number],  // Teal
    success: [34, 197, 94] as [number, number, number],     // Bright green
    warning: [251, 191, 36] as [number, number, number],    // Yellow
    danger: [220, 38, 38] as [number, number, number],      // Red
    info: [59, 130, 246] as [number, number, number],       // Blue
    background: [249, 250, 251] as [number, number, number], // Light gray
  };

  // Page 1: Executive Summary
  addLACRALetterhead(pdf, 'COMPREHENSIVE DEFORESTATION ANALYSIS', 'Environmental Impact & Compliance Assessment', colors.primary);
  
  let yPos = 65;
  
  // Report metadata
  pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  pdf.rect(10, yPos, pageWidth - 20, 25, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.text(`Report ID: ${data.reportId}`, 15, yPos + 8);
  pdf.text(`Farmer: ${data.farmerName} (${data.farmerId})`, 15, yPos + 15);
  pdf.text(`Analysis Date: ${new Date(data.analysisDate).toLocaleDateString()}`, 15, yPos + 22);
  
  pdf.text(`County: ${data.county}`, 110, yPos + 8);
  pdf.text(`Farm Size: ${data.farmSize} ${data.farmSizeUnit}`, 110, yPos + 15);
  pdf.text(`Coordinates: ${data.gpsCoordinates}`, 110, yPos + 22);
  
  // Executive Summary
  yPos += 35;
  pdf.setFillColor(...colors.primary);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EXECUTIVE SUMMARY', 15, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  // Forest Loss Status
  const statusColor = data.forestLossDetected ? colors.danger : colors.success;
  pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  pdf.rect(15, yPos, 8, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.text(data.forestLossDetected ? '!' : '✓', 18, yPos + 5);
  
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Forest Loss Status: ${data.forestLossDetected ? 'DETECTED' : 'NO LOSS DETECTED'}`, 30, yPos + 5);
  
  if (data.forestLossDetected && data.forestLossDate) {
    yPos += 10;
    pdf.text(`Forest Loss Date: ${new Date(data.forestLossDate).toLocaleDateString()}`, 30, yPos);
    pdf.setTextColor(...colors.danger);
    pdf.text('⚠ Immediate mitigation required', 30, yPos + 7);
    pdf.setTextColor(0, 0, 0);
  }
  
  // Forest Cover Analysis
  yPos += 20;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FOREST COVER ANALYSIS', 15, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  // Forest cover metrics in a table format
  const metrics = [
    ['Baseline Forest Cover', `${data.baselineForestCover.toFixed(1)}%`],
    ['Current Forest Cover', `${data.currentForestCover.toFixed(1)}%`],
    ['Net Change', `${data.forestCoverChange > 0 ? '+' : ''}${data.forestCoverChange.toFixed(2)}%`],
    ['Deforestation Rate', `${data.deforestationRate.toFixed(3)}%/year`]
  ];
  
  metrics.forEach((metric, index) => {
    const bgColor = index % 2 === 0 ? colors.background : [255, 255, 255];
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.rect(15, yPos + (index * 8), pageWidth - 30, 8, 'F');
    
    pdf.text(metric[0], 20, yPos + (index * 8) + 5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(metric[1], pageWidth - 50, yPos + (index * 8) + 5);
    pdf.setFont('helvetica', 'normal');
  });
  
  // Biodiversity Impact
  yPos += 45;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ENVIRONMENTAL IMPACT ASSESSMENT', 15, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const impactColor = data.biodiversityImpact === 'minimal' ? colors.success : 
                     data.biodiversityImpact === 'moderate' ? colors.warning : colors.danger;
  
  pdf.setFillColor(impactColor[0], impactColor[1], impactColor[2]);
  pdf.rect(15, yPos, 40, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.biodiversityImpact.toUpperCase()}`, 17, yPos + 4);
  pdf.text('BIODIVERSITY IMPACT', 17, yPos + 9);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Carbon Stock Loss: ${data.carbonStockLoss.toFixed(1)} tCO₂`, 65, yPos + 4);
  pdf.text(`CO₂ Emissions: ${data.carbonEmissions.toFixed(1)} tCO₂`, 65, yPos + 9);
  
  // Mitigation Requirements
  if (data.mitigationRequired) {
    yPos += 25;
    pdf.setFillColor(...colors.warning);
    pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text('⚠ MITIGATION MEASURES REQUIRED', 20, yPos + 5);
    
    yPos += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Recommended Actions:', 20, yPos);
    
    data.recommendedActions.forEach((action, index) => {
      yPos += 7;
      pdf.text(`• ${action}`, 25, yPos);
    });
    
    if (data.reforestationPlan) {
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reforestation Plan:', 20, yPos);
      yPos += 7;
      pdf.setFont('helvetica', 'normal');
      const planLines = pdf.splitTextToSize(data.reforestationPlan, pageWidth - 50);
      pdf.text(planLines, 25, yPos);
    }
  }
  
  // Add new page for detailed analysis if needed
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Certification Statement
  yPos += 20;
  pdf.setFillColor(...colors.info);
  pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CERTIFICATION STATEMENT', 20, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  const certStatement = `This comprehensive deforestation analysis certifies the environmental status of the farm operated by ${data.farmerName} (${data.farmerId}) as of ${new Date(data.analysisDate).toLocaleDateString()}. The analysis is conducted in accordance with international environmental monitoring standards and EU Deforestation Regulation requirements.`;
  const certLines = pdf.splitTextToSize(certStatement, pageWidth - 40);
  pdf.text(certLines, 20, yPos);
  
  // Footer
  yPos += 30;
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Generated by AgriTrace360™ - LACRA Environmental Monitoring System', pageWidth/2, yPos, { align: 'center' });
  pdf.text(`Report Reference: DFR-${data.reportId}-${Date.now()}`, pageWidth/2, yPos + 5, { align: 'center' });
  
  // Save the PDF
  pdf.save(`Comprehensive_Deforestation_Analysis_${data.farmerId}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Generate Comprehensive EUDR Compliance PDF
export const generateComprehensiveEUDRPDF = async (data: ComprehensiveEUDRData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  const colors = {
    primary: [37, 99, 235],     // EU Blue
    secondary: [15, 118, 110],  // Teal
    success: [34, 197, 94],     // Green
    warning: [251, 191, 36],    // Yellow
    danger: [220, 38, 38],      // Red
    info: [59, 130, 246],       // Blue
    background: [249, 250, 251], // Light gray
  };

  // Page 1: Due Diligence Statement
  addLACRALetterhead(pdf, 'EU DEFORESTATION REGULATION (EUDR)', 'Comprehensive Due Diligence Compliance Report', colors.primary);
  
  let yPos = 65;
  
  // EU Regulation Reference
  pdf.setFillColor(...colors.info);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REGULATION (EU) 2023/1115 | IN FORCE FROM 30 DECEMBER 2024', pageWidth/2, yPos + 5, { align: 'center' });
  
  // Report metadata
  yPos += 15;
  pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  pdf.rect(10, yPos, pageWidth - 20, 25, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Report ID: ${data.reportId}`, 15, yPos + 8);
  pdf.text(`Farmer: ${data.farmerName} (${data.farmerId})`, 15, yPos + 15);
  pdf.text(`Assessment Date: ${new Date(data.assessmentDate).toLocaleDateString()}`, 15, yPos + 22);
  
  pdf.text(`County: ${data.county}`, 110, yPos + 8);
  pdf.text(`Farm Size: ${data.farmSize} ${data.farmSizeUnit}`, 110, yPos + 15);
  pdf.text(`Coordinates: ${data.gpsCoordinates}`, 110, yPos + 22);
  
  // Due Diligence Statement
  yPos += 35;
  pdf.setFillColor(...colors.primary);
  pdf.rect(10, yPos, pageWidth - 20, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DUE DILIGENCE STATEMENT (ARTICLE 4)', 15, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const declarationText = `In accordance with Regulation (EU) 2023/1115 of the European Parliament and of the Council, I hereby declare that the agricultural commodities covered by this due diligence statement:`;
  const declarationLines = pdf.splitTextToSize(declarationText, pageWidth - 40);
  pdf.text(declarationLines, 20, yPos);
  
  yPos += 15;
  
  // Compliance checklist
  const complianceItems = [
    { text: 'Are deforestation-free (no deforestation after 31 December 2020)', compliant: data.deforestationRisk < 5 },
    { text: 'Have been produced in accordance with relevant legislation', compliant: data.legalHarvesting },
    { text: 'Respect human rights as enshrined in international law', compliant: data.humanRightsCompliance },
    { text: 'Respect the rights of indigenous peoples affected by production', compliant: data.humanRightsCompliance }
  ];
  
  complianceItems.forEach((item, index) => {
    const iconColor = item.compliant ? colors.success : colors.danger;
    pdf.setFillColor(iconColor[0], iconColor[1], iconColor[2]);
    pdf.circle(22, yPos + 3, 2, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(item.compliant ? '✓' : '✗', 21, yPos + 4);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    const itemLines = pdf.splitTextToSize(item.text, pageWidth - 60);
    pdf.text(itemLines, 30, yPos + 3);
    yPos += 12;
  });
  
  // Compliance Score
  yPos += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('OVERALL COMPLIANCE ASSESSMENT', 15, yPos);
  
  yPos += 10;
  const scoreColor = data.complianceScore >= 90 ? colors.success :
                    data.complianceScore >= 70 ? colors.warning : colors.danger;
  
  pdf.setFillColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  pdf.rect(15, yPos, 60, 20, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text(`${data.complianceScore}%`, 45, yPos + 8, { align: 'center' });
  pdf.setFontSize(10);
  pdf.text('COMPLIANCE SCORE', 45, yPos + 15, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text(`Status: ${data.complianceStatus.toUpperCase()}`, 85, yPos + 8);
  pdf.text(`Risk Level: ${data.riskLevel.toUpperCase()}`, 85, yPos + 15);
  
  // Risk Assessment Details
  yPos += 35;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RISK ASSESSMENT DETAILS', 15, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  const riskMetrics = [
    ['Deforestation Risk', `${data.deforestationRisk}%`],
    ['Due Diligence Score', `${data.dueDiligenceScore}%`],
    ['Legal Compliance', data.legalHarvesting ? 'COMPLIANT' : 'NON-COMPLIANT'],
    ['Human Rights Status', data.humanRightsCompliance ? 'COMPLIANT' : 'VIOLATIONS DETECTED']
  ];
  
  riskMetrics.forEach((metric, index) => {
    const bgColor = index % 2 === 0 ? colors.background : [255, 255, 255];
    pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    pdf.rect(15, yPos + (index * 8), pageWidth - 30, 8, 'F');
    
    pdf.text(metric[0], 20, yPos + (index * 8) + 5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(metric[1], pageWidth - 50, yPos + (index * 8) + 5);
    pdf.setFont('helvetica', 'normal');
  });
  
  // Mitigation Measures
  if (data.mitigationPlan.length > 0) {
    yPos += 45;
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MITIGATION MEASURES', 15, yPos);
    
    yPos += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    
    data.mitigationPlan.forEach((measure, index) => {
      pdf.text(`• ${measure}`, 20, yPos);
      yPos += 7;
    });
  }
  
  // Add new page if needed
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }
  
  // Certification Statement
  yPos += 15;
  pdf.setFillColor(...colors.success);
  pdf.rect(15, yPos, pageWidth - 30, 8, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.text('LACRA CERTIFICATION', 20, yPos + 5);
  
  yPos += 15;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  const eudrCertStatement = `This EUDR compliance report certifies that the agricultural commodity from ${data.farmerName} (${data.farmerId}) ${data.complianceStatus === 'compliant' ? 'meets all requirements for EU market access' : 'requires additional measures before EU market access'} under Regulation (EU) 2023/1115. Assessment conducted by the Liberia Agriculture Commodity Regulatory Authority (LACRA) as authorized competent authority.`;
  const eudrCertLines = pdf.splitTextToSize(eudrCertStatement, pageWidth - 40);
  pdf.text(eudrCertLines, 20, yPos);
  
  // Footer
  yPos += 25;
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Generated by AgriTrace360™ - LACRA EUDR Compliance System', pageWidth/2, yPos, { align: 'center' });
  pdf.text(`Due Diligence Reference: EUDR-${data.reportId}-${Date.now()}`, pageWidth/2, yPos + 5, { align: 'center' });
  pdf.text('For verification: eudr-compliance@lacra.gov.lr | +231-XXX-XXXX', pageWidth/2, yPos + 10, { align: 'center' });
  
  // Save the PDF
  pdf.save(`Comprehensive_EUDR_Compliance_${data.farmerId}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Generate Comprehensive Farmer Profile PDF
export const generateComprehensiveFarmerProfilePDF = async (data: ComprehensiveFarmerData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  const colors = {
    primary: [22, 163, 74],     // LACRA Green
    secondary: [15, 118, 110],  // Teal
    success: [34, 197, 94],     // Bright green
    info: [59, 130, 246],       // Blue
    background: [249, 250, 251], // Light gray
  };

  // Header
  addLACRALetterhead(pdf, 'COMPREHENSIVE FARMER PROFILE', 'Complete Agricultural and Compliance Information', colors.primary);
  
  let yPos = 65;
  
  // Farmer basic information
  pdf.setFillColor(colors.background[0], colors.background[1], colors.background[2]);
  pdf.rect(10, yPos, pageWidth - 20, 35, 'F');
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.firstName} ${data.lastName}`, 15, yPos + 10);
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Farmer ID: ${data.farmerId}`, 15, yPos + 18);
  pdf.text(`Registration: ${new Date(data.registrationDate).toLocaleDateString()}`, 15, yPos + 25);
  pdf.text(`Phone: ${data.phoneNumber}`, 15, yPos + 32);
  
  pdf.text(`County: ${data.county}`, 110, yPos + 18);
  pdf.text(`Farm Size: ${data.farmSize} ${data.farmSizeUnit}`, 110, yPos + 25);
  pdf.text(`Coordinates: ${data.gpsCoordinates}`, 110, yPos + 32);
  
  // Performance Scores
  yPos += 45;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PERFORMANCE ASSESSMENT', 15, yPos);
  
  yPos += 10;
  const scores = [
    { label: 'Compliance Score', value: data.complianceScore, color: data.complianceScore >= 80 ? colors.success : colors.secondary },
    { label: 'Environmental Score', value: data.environmentalScore, color: data.environmentalScore >= 80 ? colors.success : colors.secondary }
  ];
  
  scores.forEach((score, index) => {
    const xPos = 15 + (index * 90);
    pdf.setFillColor(score.color[0], score.color[1], score.color[2]);
    pdf.rect(xPos, yPos, 80, 15, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${score.value}%`, xPos + 40, yPos + 6, { align: 'center' });
    pdf.setFontSize(8);
    pdf.text(score.label, xPos + 40, yPos + 12, { align: 'center' });
    pdf.setFontSize(10);
  });
  
  // Primary Crops
  yPos += 25;
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRIMARY CROPS', 15, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  data.primaryCrops.forEach((crop, index) => {
    pdf.text(`• ${crop}`, 20, yPos + (index * 7));
  });
  
  // Sustainable Practices
  yPos += (data.primaryCrops.length * 7) + 15;
  pdf.setFont('helvetica', 'bold');
  pdf.text('SUSTAINABLE PRACTICES', 15, yPos);
  
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  data.sustainablePractices.forEach((practice, index) => {
    pdf.text(`• ${practice}`, 20, yPos + (index * 7));
  });
  
  // Footer
  yPos += (data.sustainablePractices.length * 7) + 20;
  pdf.setFontSize(8);
  pdf.setTextColor(107, 114, 128);
  pdf.text('Generated by AgriTrace360™ - LACRA Farmer Management System', pageWidth/2, yPos, { align: 'center' });
  pdf.text(`Profile Reference: FPR-${data.farmerId}-${Date.now()}`, pageWidth/2, yPos + 5, { align: 'center' });
  
  // Save the PDF
  pdf.save(`Comprehensive_Farmer_Profile_${data.farmerId}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// Export aliases for backward compatibility
export const generateEUDRCompliancePDF = generateComprehensiveEUDRPDF;
export const generateDeforestationPDF = generateComprehensiveDeforestationPDF;
export const generateFarmerProfilePDF = generateComprehensiveFarmerProfilePDF;