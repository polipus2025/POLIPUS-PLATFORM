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

// Generate EUDR compliance PDF with LACRA & ECOENVIRO letterhead
export const generateEUDRCompliancePDF = async (data: EUDRComplianceData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Generate QR code URL for mobile access
  const reportUrl = `${window.location.origin}/reports/eudr/${data.reportId}`;
  
  // LACRA & ECOENVIRO Letterhead - Original green header
  pdf.setFillColor(34, 197, 94); // Original green
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // LACRA Logo area - Enhanced circular design with clear details
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
  
  // Agricultural commodities representation - enhanced
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
  pdf.text('EUDR COMPLIANCE ASSESSMENT', pageWidth / 2, 18, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('European Union Deforestation Regulation Report', pageWidth / 2, 25, { align: 'center' });
  
  // Contact information footer
  pdf.setFontSize(6);
  pdf.text('Ministry of Agriculture, Capitol Hill, Monrovia, Liberia | Tel: +231-XXX-XXXX', 10, 44);
  pdf.text('Certified by ECOENVIRO | compliance@lacra.gov.lr | cert@ecoenviro.com', 10, 47);
  
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
  const maxWidth = pageWidth - 30; // Keep within margins
  const line1 = 'This assessment follows EU Regulation 2023/1115 compliance standards with satellite monitoring and field verification.';
  const line2 = 'Certified jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority) and ECOENVIRO Audit & Certification.';
  
  pdf.text(line1, 15, yPos + 10, { maxWidth: maxWidth });
  pdf.text(line2, 15, yPos + 14, { maxWidth: maxWidth });
  
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
  
  // Recommendations with proper text wrapping to prevent cutoff
  yPos += (coordLines.length * 5) + 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Assessment Findings & Recommendations:', 15, yPos);
  
  yPos += 15;
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  
  // Use proper text wrapping for recommendations
  let recCurrentY = yPos;
  data.recommendations.forEach((rec, index) => {
    const bulletText = `• ${rec}`;
    recCurrentY = addWrappedText(pdf, bulletText, 15, recCurrentY, pageWidth - 30, 7);
    recCurrentY += 5; // Add spacing between recommendations
  });
  
  // Footer with dual certification
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  const footerMaxWidth = pageWidth - 30;
  pdf.text('This report is generated by LACRA & ECOENVIRO - Dual Certification System', 15, 275, { maxWidth: footerMaxWidth });
  pdf.text('LACRA: Liberia Agriculture Commodity Regulatory Authority | ECOENVIRO: Audit & Certification', 15, 280, { maxWidth: footerMaxWidth });
  pdf.text('For verification: compliance@lacra.gov.lr | cert@ecoenviro.com', 15, 285, { maxWidth: footerMaxWidth });
  
  // Download
  pdf.save(`LACRA_ECOENVIRO_EUDR_Compliance_${data.farmerName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

// Generate deforestation analysis PDF with LACRA & ECOENVIRO letterhead  
export const generateDeforestationPDF = async (data: DeforestationData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  
  // Generate QR code URL for mobile access
  const deforestationReportUrl = `${window.location.origin}/reports/deforestation/${data.reportId}`;
  
  // LACRA & ECOENVIRO Letterhead - Original red header for deforestation
  pdf.setFillColor(220, 38, 38); // Original red
  pdf.rect(0, 0, pageWidth, 50, 'F');
  
  // LACRA Logo area - Enhanced circular design with clear details
  pdf.setFillColor(255, 255, 255);
  pdf.rect(10, 8, 40, 30, 'F');
  pdf.setDrawColor(139, 69, 19);
  pdf.setLineWidth(1.5);
  pdf.rect(10, 8, 40, 30, 'S');
  
  // LACRA logo elements - larger and clearer circular design
  const centerX2 = 30;
  const centerY2 = 23;
  
  // Outer brown circle - larger and more defined
  pdf.setDrawColor(139, 69, 19);
  pdf.setLineWidth(2);
  pdf.circle(centerX2, centerY2, 12, 'S');
  
  // Agricultural commodities representation - enhanced
  // Palm fruit cluster (left side) - larger and more detailed
  pdf.setFillColor(255, 140, 0); // Orange for palm fruit
  pdf.circle(centerX2 - 6, centerY2 - 3, 3, 'F');
  pdf.setFillColor(255, 69, 0); // Red-orange palm fruit
  pdf.circle(centerX2 - 6, centerY2 - 3, 2, 'F');
  pdf.circle(centerX2 - 7, centerY2 - 1, 1.5, 'F');
  pdf.circle(centerX2 - 5, centerY2 - 1, 1.5, 'F');
  
  // Green leaf - larger and more prominent
  pdf.setFillColor(34, 197, 94); // Bright green
  pdf.ellipse(centerX2 - 3, centerY2 - 7, 4, 2, 'F');
  pdf.ellipse(centerX2 + 1, centerY2 - 6, 3, 1.5, 'F');
  
  // Cocoa beans cluster (right side) - enhanced
  pdf.setFillColor(139, 69, 19); // Rich brown
  pdf.circle(centerX2 + 4, centerY2 + 1, 2.5, 'F');
  pdf.circle(centerX2 + 6, centerY2 + 3, 2, 'F');
  pdf.circle(centerX2 + 3, centerY2 + 4, 1.8, 'F');
  
  // Golden commodity/grain (bottom)
  pdf.setFillColor(255, 215, 0); // Golden yellow
  pdf.circle(centerX2 - 2, centerY2 + 5, 2, 'F');
  pdf.circle(centerX2 + 1, centerY2 + 6, 1.5, 'F');
  
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
  const deforestationQRData = await QRCode.toDataURL(deforestationReportUrl, {
    width: 60,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  
  pdf.addImage(deforestationQRData, 'PNG', pageWidth - 35, 8, 25, 25);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(6);
  pdf.text('Scan to Download', pageWidth - 32, 36, { align: 'center' });
  pdf.text('Mobile Report', pageWidth - 32, 39, { align: 'center' });
  
  // Main title - properly centered
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DEFORESTATION ANALYSIS', pageWidth / 2, 18, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Environmental Impact Assessment Report', pageWidth / 2, 25, { align: 'center' });
  
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
  const maxWidth2 = pageWidth - 30; // Keep within margins
  const envLine1 = 'This environmental assessment follows strict due diligence protocols using satellite imagery and field verification.';
  const envLine2 = 'Certified jointly by LACRA (Liberia Agriculture Commodity Regulatory Authority) and ECOENVIRO Audit & Certification.';
  
  pdf.text(envLine1, 15, yPos + 10, { maxWidth: maxWidth2 });
  pdf.text(envLine2, 15, yPos + 14, { maxWidth: maxWidth2 });
  
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
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  const footerMaxWidth2 = pageWidth - 30;
  pdf.text('This report is generated by LACRA & ECOENVIRO - Environmental Monitoring & Certification', 15, 275, { maxWidth: footerMaxWidth2 });
  pdf.text('LACRA: Liberia Agriculture Commodity Regulatory Authority | ECOENVIRO: Audit & Certification', 15, 280, { maxWidth: footerMaxWidth2 });
  pdf.text('For verification: environmental@lacra.gov.lr | cert@ecoenviro.com', 15, 285, { maxWidth: footerMaxWidth2 });
  
  // Download
  pdf.save(`LACRA_ECOENVIRO_Deforestation_Analysis_${data.farmerName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};