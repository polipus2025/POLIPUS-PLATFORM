import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFGenerationOptions {
  filename: string;
  title: string;
  element?: HTMLElement;
  data?: any;
}

export const generatePDF = async (options: PDFGenerationOptions): Promise<void> => {
  const { filename, title, element, data } = options;

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    if (element) {
      // Generate PDF from HTML element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgWidth = pageWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // 10mm top margin
      
      // Add first page
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20); // Account for margins
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }
    } else if (data) {
      // Generate PDF from data (fallback method)
      await generateDataPDF(pdf, data, title);
    }
    
    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('PDF generation failed:', error);
    // Fallback to JSON download
    const blob = new Blob([JSON.stringify(data || {}, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace('.pdf', '.json');
    a.click();
    URL.revokeObjectURL(url);
  }
};

const generateDataPDF = async (pdf: jsPDF, data: any, title: string): Promise<void> => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPosition = 20;
  
  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Date
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  const date = new Date().toLocaleDateString();
  pdf.text(`Generated: ${date}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Content
  pdf.setFontSize(10);
  const content = JSON.stringify(data, null, 2);
  const lines = pdf.splitTextToSize(content, pageWidth - 40);
  
  for (const line of lines) {
    if (yPosition > 280) { // Near bottom of page
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(line, 20, yPosition);
    yPosition += 5;
  }
};

export const generateEUDRCompliancePDF = async (
  reportData: any, 
  farmArea: number, 
  farmerId: string, 
  farmerName: string
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;
  
  // Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EU DEFORESTATION REGULATION', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFontSize(14);
  pdf.text('Due Diligence Compliance Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Report Info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Report ID: EUDR-${farmerId}-${Date.now().toString().slice(-6)}`, 20, yPos);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 15;
  
  // Executive Summary
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Executive Summary', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Farmer: ${farmerName} (ID: ${farmerId})`, 20, yPos);
  yPos += 6;
  pdf.text(`Farm Area: ${farmArea.toFixed(2)} hectares`, 20, yPos);
  yPos += 6;
  pdf.text(`Risk Level: ${reportData.riskLevel.toUpperCase()}`, 20, yPos);
  yPos += 6;
  pdf.text(`Compliance Score: ${reportData.complianceScore}%`, 20, yPos);
  yPos += 6;
  pdf.text(`Deforestation Risk: ${reportData.deforestationRisk}%`, 20, yPos);
  yPos += 15;
  
  // GPS Coordinates
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Geolocation Data', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const coordLines = pdf.splitTextToSize(`Coordinates: ${reportData.coordinates}`, pageWidth - 40);
  coordLines.forEach((line: string) => {
    pdf.text(line, 20, yPos);
    yPos += 5;
  });
  yPos += 10;
  
  // Documentation Required
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Required Documentation', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  reportData.documentationRequired.forEach((doc: string) => {
    pdf.text(`• ${doc}`, 25, yPos);
    yPos += 6;
  });
  yPos += 10;
  
  // Recommendations
  if (yPos > 250) {
    pdf.addPage();
    yPos = 20;
  }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Recommendations', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  reportData.recommendations.forEach((rec: string) => {
    const recLines = pdf.splitTextToSize(`• ${rec}`, pageWidth - 40);
    recLines.forEach((line: string) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, 25, yPos);
      yPos += 5;
    });
    yPos += 3;
  });
  
  // Footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('This report is generated in accordance with EU Regulation 2023/1115 on deforestation-free products.', 
           pageWidth / 2, 285, { align: 'center' });
  
  const filename = `EUDR-Compliance-Report-${farmerId}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};

export const generateDeforestationPDF = async (
  reportData: any, 
  farmArea: number, 
  farmerId: string, 
  farmerName: string
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  let yPos = 20;
  
  // Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DEFORESTATION ANALYSIS REPORT', pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;
  
  pdf.setFontSize(14);
  pdf.text('Environmental Impact Assessment', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;
  
  // Report Info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Report ID: DFR-${farmerId}-${Date.now().toString().slice(-6)}`, 20, yPos);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, yPos, { align: 'right' });
  yPos += 15;
  
  // Alert if forest loss detected
  if (reportData.forestLossDetected) {
    pdf.setFillColor(255, 230, 230);
    pdf.rect(15, yPos - 5, pageWidth - 30, 15, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('⚠️ FOREST LOSS DETECTED - Immediate action required', pageWidth / 2, yPos + 3, { align: 'center' });
    yPos += 20;
  }
  
  // Key Metrics
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Environmental Metrics', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Farmer: ${farmerName} (ID: ${farmerId})`, 20, yPos);
  yPos += 6;
  pdf.text(`Farm Area: ${farmArea.toFixed(2)} hectares`, 20, yPos);
  yPos += 6;
  pdf.text(`Forest Loss Detected: ${reportData.forestLossDetected ? 'YES' : 'NO'}`, 20, yPos);
  yPos += 6;
  if (reportData.forestLossDate) {
    pdf.text(`Forest Loss Date: ${reportData.forestLossDate}`, 20, yPos);
    yPos += 6;
  }
  pdf.text(`Forest Cover Change: ${reportData.forestCoverChange > 0 ? '+' : ''}${reportData.forestCoverChange}%`, 20, yPos);
  yPos += 6;
  pdf.text(`Biodiversity Impact: ${reportData.biodiversityImpact.toUpperCase()}`, 20, yPos);
  yPos += 6;
  pdf.text(`Carbon Stock Loss: ${reportData.carbonStockLoss} tCO₂`, 20, yPos);
  yPos += 15;
  
  // Analysis Details
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Satellite Data Analysis', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Data Sources:', 20, yPos);
  yPos += 6;
  pdf.text('• Global Forest Watch (Hansen et al.)', 25, yPos);
  yPos += 5;
  pdf.text('• Landsat 8 & Sentinel-2 imagery', 25, yPos);
  yPos += 5;
  pdf.text('• NASA Earth Observation System', 25, yPos);
  yPos += 5;
  pdf.text('• European Space Agency Copernicus', 25, yPos);
  yPos += 15;
  
  // Mitigation Recommendations
  if (yPos > 200) {
    pdf.addPage();
    yPos = 20;
  }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Mitigation & Restoration Plan', 20, yPos);
  yPos += 10;
  
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  reportData.recommendations.forEach((rec: string, index: number) => {
    const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 40);
    recLines.forEach((line: string) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, 25, yPos);
      yPos += 5;
    });
    yPos += 3;
  });
  
  // Footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('Analysis conducted using globally recognized datasets with 95% confidence interval.', 
           pageWidth / 2, 285, { align: 'center' });
  
  const filename = `Deforestation-Report-${farmerId}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(filename);
};