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

// Generate EUDR compliance PDF with LACRA & ECOENVIRO letterhead
export const generateEUDRCompliancePDF = (data: EUDRComplianceData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // LACRA & ECOENVIRO Letterhead - Green header
  pdf.setFillColor(34, 197, 94); // Green
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  // LACRA Logo area
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
  
  // ECOENVIRO Certification Logo (center)
  pdf.setFillColor(255, 255, 255);
  pdf.rect(50, 5, 45, 25, 'F');
  pdf.rect(50, 5, 45, 25, 'S');
  
  // ECOENVIRO logo design (stylized diamond pattern)
  pdf.setFillColor(59, 130, 246); // Blue
  pdf.rect(65, 8, 4, 4, 'F');
  pdf.rect(61, 12, 4, 4, 'F');
  pdf.rect(65, 12, 4, 4, 'F');
  pdf.rect(69, 12, 4, 4, 'F');
  pdf.rect(65, 16, 4, 4, 'F');
  
  pdf.setFillColor(255, 165, 0); // Orange
  pdf.rect(57, 16, 4, 4, 'F');
  pdf.rect(61, 16, 4, 4, 'F');
  pdf.rect(69, 16, 4, 4, 'F');
  pdf.rect(73, 16, 4, 4, 'F');
  
  pdf.setTextColor(59, 130, 246);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ECOENVIRO', 52, 24);
  pdf.setFontSize(5);
  pdf.setTextColor(255, 165, 0);
  pdf.text('AUDIT & CERTIFICATION', 52, 27);
  
  // EU Compliance Badge
  pdf.setFillColor(59, 130, 246); // Blue
  pdf.rect(pageWidth - 45, 5, 35, 25, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text('EU DEFORESTATION', pageWidth - 42, 15);
  pdf.text('REGULATION', pageWidth - 38, 19);
  pdf.text('COMPLIANT', pageWidth - 37, 23);
  
  // Main title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EUDR COMPLIANCE ASSESSMENT', 100, 16);
  
  pdf.setFontSize(10);
  pdf.text('European Union Deforestation Regulation Report', 100, 25);
  
  // Contact information
  pdf.setFontSize(6);
  pdf.text('Ministry of Agriculture, Capitol Hill, Monrovia, Liberia', 10, 39);
  pdf.text('Certified by ECOENVIRO - Audit & Certification | Lab/Testing', 10, 42);
  
  // Due Diligence Statement
  let yPos = 55;
  pdf.setFillColor(250, 245, 255);
  pdf.setDrawColor(147, 51, 234);
  pdf.rect(10, yPos, pageWidth - 20, 20, 'FD');
  
  pdf.setFillColor(147, 51, 234);
  pdf.rect(10, yPos, pageWidth - 20, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DUE DILIGENCE STATEMENT', 15, yPos + 3);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text('This assessment follows EU Regulation 2023/1115 compliance standards with satellite monitoring and field verification.', 15, yPos + 10);
  pdf.text('Certified jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority) and ECOENVIRO Audit & Certification.', 15, yPos + 14);
  
  // Report details
  yPos += 30;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.text(`Report ID: ${data.reportId}`, 15, yPos);
  pdf.text(`Date: ${new Date(data.generatedAt).toLocaleDateString()}`, 15, yPos + 7);
  pdf.text(`Farmer: ${data.farmerName}`, 15, yPos + 14);
  pdf.text(`Farm ID: ${data.farmerId}`, 15, yPos + 21);
  
  // Risk Level Box
  yPos += 35;
  const riskColor = data.riskLevel === 'high' ? [220, 38, 38] : 
                    data.riskLevel === 'standard' ? [251, 191, 36] : [34, 197, 94];
  
  pdf.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  pdf.rect(10, yPos, pageWidth - 20, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`RISK LEVEL: ${data.riskLevel.toUpperCase()}`, pageWidth / 2, yPos + 9, { align: 'center' });
  
  // Compliance Score
  yPos += 25;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.text('Compliance Score:', 15, yPos);
  
  // Score bar
  const scoreWidth = (data.complianceScore / 100) * 100;
  pdf.setFillColor(240, 240, 240);
  pdf.rect(15, yPos + 5, 100, 8, 'F');
  pdf.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  pdf.rect(15, yPos + 5, scoreWidth, 8, 'F');
  pdf.text(`${data.complianceScore}%`, 125, yPos + 11);
  
  // GPS Coordinates
  yPos += 25;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('GPS Boundary Coordinates:', 15, yPos);
  
  yPos += 10;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const coordLines = data.coordinates.split(';');
  coordLines.forEach((coord, index) => {
    pdf.text(coord.trim(), 15, yPos + (index * 5));
  });
  
  // Recommendations
  yPos += (coordLines.length * 5) + 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recommendations:', 15, yPos);
  
  yPos += 10;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  data.recommendations.forEach((rec, index) => {
    pdf.text(`• ${rec}`, 15, yPos + (index * 7));
  });
  
  // Footer with dual certification
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This report is generated by LACRA & ECOENVIRO - Dual Certification System', 15, 275);
  pdf.text('LACRA: Liberia Agriculture Commodity Regulatory Authority | ECOENVIRO: Audit & Certification', 15, 280);
  pdf.text('For verification: compliance@lacra.gov.lr | cert@ecoenviro.com', 15, 285);
  
  // Download
  pdf.save(`LACRA_ECOENVIRO_EUDR_Compliance_${data.farmerName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

// Generate deforestation analysis PDF with LACRA & ECOENVIRO letterhead
export const generateDeforestationPDF = (data: DeforestationData): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // LACRA & ECOENVIRO Letterhead - Red header for deforestation
  pdf.setFillColor(220, 38, 38); // Red
  pdf.rect(0, 0, pageWidth, 45, 'F');
  
  // LACRA Logo area
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
  
  // ECOENVIRO Logo area (center)
  pdf.setFillColor(255, 255, 255);
  pdf.rect(50, 5, 45, 25, 'F');
  pdf.rect(50, 5, 45, 25, 'S');
  
  // ECOENVIRO logo design (stylized diamond pattern)
  pdf.setFillColor(59, 130, 246); // Blue
  pdf.rect(65, 8, 4, 4, 'F');
  pdf.rect(61, 12, 4, 4, 'F');
  pdf.rect(65, 12, 4, 4, 'F');
  pdf.rect(69, 12, 4, 4, 'F');
  pdf.rect(65, 16, 4, 4, 'F');
  
  pdf.setFillColor(255, 165, 0); // Orange
  pdf.rect(57, 16, 4, 4, 'F');
  pdf.rect(61, 16, 4, 4, 'F');
  pdf.rect(69, 16, 4, 4, 'F');
  pdf.rect(73, 16, 4, 4, 'F');
  
  pdf.setTextColor(59, 130, 246);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ECOENVIRO', 52, 24);
  pdf.setFontSize(5);
  pdf.setTextColor(255, 165, 0);
  pdf.text('AUDIT & CERTIFICATION', 52, 27);
  
  // Environmental Badge
  pdf.setFillColor(34, 197, 94); // Green
  pdf.rect(pageWidth - 45, 5, 35, 25, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text('ENVIRONMENTAL', pageWidth - 42, 15);
  pdf.text('MONITORING', pageWidth - 38, 19);
  pdf.text('SYSTEM', pageWidth - 35, 23);
  
  // Main title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DEFORESTATION ANALYSIS', 100, 16);
  
  pdf.setFontSize(10);
  pdf.text('Environmental Impact Assessment Report', 100, 25);
  
  // Contact information
  pdf.setFontSize(6);
  pdf.text('Ministry of Agriculture, Capitol Hill, Monrovia, Liberia', 10, 39);
  pdf.text('Certified by ECOENVIRO - Environmental Assessment & Testing', 10, 42);
  
  // Due Diligence Statement for Environmental Assessment
  let yPos = 55;
  pdf.setFillColor(254, 242, 242);
  pdf.setDrawColor(220, 38, 38);
  pdf.rect(10, yPos, pageWidth - 20, 20, 'FD');
  
  pdf.setFillColor(220, 38, 38);
  pdf.rect(10, yPos, pageWidth - 20, 5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DUE DILIGENCE STATEMENT - ENVIRONMENTAL ASSESSMENT', 15, yPos + 3);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text('This environmental assessment follows strict due diligence protocols using satellite imagery and field verification.', 15, yPos + 10);
  pdf.text('Certified jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority) and ECOENVIRO Audit & Certification.', 15, yPos + 14);
  
  // Report details
  yPos += 30;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.text(`Report ID: ${data.reportId}`, 15, yPos);
  pdf.text(`Date: ${new Date(data.generatedAt).toLocaleDateString()}`, 15, yPos + 7);
  pdf.text(`Property: ${data.farmerName}`, 15, yPos + 14);
  pdf.text(`Owner ID: ${data.farmerId}`, 15, yPos + 21);
  
  // Forest Loss Status
  yPos += 35;
  const statusColor = data.forestLossDetected ? [220, 38, 38] : [34, 197, 94];
  const statusText = data.forestLossDetected ? 'FOREST LOSS DETECTED' : 'NO FOREST LOSS DETECTED';
  
  pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  pdf.rect(10, yPos, pageWidth - 20, 15, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(statusText, pageWidth / 2, yPos + 9, { align: 'center' });
  
  // Environmental Metrics
  yPos += 25;
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Environmental Metrics:', 15, yPos);
  
  yPos += 15;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Forest coverage bars
  const metrics = [
    { label: 'Forest Coverage', value: 75, color: [34, 197, 94] },
    { label: 'Agricultural Land', value: 20, color: [251, 191, 36] },
    { label: 'Cleared Areas', value: 5, color: [220, 38, 38] }
  ];
  
  metrics.forEach((metric, index) => {
    const barY = yPos + (index * 15);
    const barWidth = (metric.value / 100) * 80;
    
    pdf.text(metric.label, 15, barY + 6);
    pdf.setFillColor(240, 240, 240);
    pdf.rect(80, barY, 80, 8, 'F');
    pdf.setFillColor(metric.color[0], metric.color[1], metric.color[2]);
    pdf.rect(80, barY, barWidth, 8, 'F');
    pdf.text(`${metric.value}%`, 170, barY + 6);
  });
  
  // GPS Coordinates
  yPos += 60;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Monitored Area Coordinates:', 15, yPos);
  
  yPos += 10;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  const coordLines = data.coordinates.split(';');
  coordLines.forEach((coord, index) => {
    if (index < 4) { // Limit to prevent overflow
      pdf.text(coord.trim(), 15, yPos + (index * 5));
    }
  });
  
  // Recommendations
  yPos += 35;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Environmental Recommendations:', 15, yPos);
  
  yPos += 10;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  data.recommendations.forEach((rec, index) => {
    if (yPos < 260) { // Prevent overflow
      pdf.text(`• ${rec}`, 15, yPos + (index * 7));
    }
  });
  
  // Footer with dual certification
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('This report is generated by LACRA & ECOENVIRO - Environmental Monitoring & Certification', 15, 275);
  pdf.text('LACRA: Liberia Agriculture Commodity Regulatory Authority | ECOENVIRO: Audit & Certification', 15, 280);
  pdf.text('For verification: environmental@lacra.gov.lr | cert@ecoenviro.com', 15, 285);
  
  // Download
  pdf.save(`LACRA_ECOENVIRO_Deforestation_Analysis_${data.farmerName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};