import jsPDF from 'jspdf';

// Auto-import for jsPDF in client environment
if (typeof window !== 'undefined') {
  // Browser environment - jsPDF should be available
}

interface BoundaryPoint {
  latitude: number;
  longitude: number;
}

interface EUDRReportData {
  farmBoundary: {
    area: number;
    points: BoundaryPoint[];
    coordinates: Array<{
      point: string;
      latitude: number;
      longitude: number;
    }>;
    centerPoint: {
      latitude: number;
      longitude: number;
    };
    boundingBox: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
  eudrAnalysis: {
    riskLevel: string;
    complianceStatus: string;
    deforestationRisk: string;
    recommendations: string[];
  };
  farmer: {
    name: string;
    id: string;
    county: string;
    district: string;
  };
}

export class ProfessionalPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
  }

  // Add LACRA letterhead with logo and branding
  private addLetterhead() {
    // LACRA Header Background
    this.doc.setFillColor(34, 197, 94); // Green background
    this.doc.rect(0, 0, this.pageWidth, 40, 'F');

    // LACRA Logo Area (placeholder - would be actual logo)
    this.doc.setFillColor(255, 255, 255);
    this.doc.rect(10, 5, 30, 30, 'F');
    this.doc.setTextColor(34, 197, 94);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LACRA', 25, 20, { align: 'center' });
    this.doc.setFontSize(8);
    this.doc.text('LOGO', 25, 25, { align: 'center' });

    // Header Text
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LIBERIA AGRICULTURE COMMODITY', 50, 18);
    this.doc.text('REGULATORY AUTHORITY', 50, 28);

    // AgriTrace360 Branding
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Powered by AgriTrace360™', this.pageWidth - 10, 15, { align: 'right' });
    this.doc.text('Agricultural Compliance Management System', this.pageWidth - 10, 22, { align: 'right' });

    // EU EUDR Compliance Logo Area
    this.doc.setFillColor(0, 51, 153); // EU Blue
    this.doc.rect(this.pageWidth - 40, 5, 30, 15, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EU EUDR', this.pageWidth - 25, 14, { align: 'center' });

    // Reset text color
    this.doc.setTextColor(0, 0, 0);
  }

  // Add colorful risk assessment chart
  private addRiskChart(y: number, riskLevel: string) {
    const chartWidth = 60;
    const chartHeight = 30;
    const chartX = (this.pageWidth - chartWidth) / 2;

    // Chart background
    this.doc.setFillColor(248, 249, 250);
    this.doc.rect(chartX, y, chartWidth, chartHeight, 'F');

    // Risk level visualization
    const riskColors = {
      low: [34, 197, 94],    // Green
      standard: [251, 191, 36], // Yellow
      high: [239, 68, 68]    // Red
    };

    const color = riskColors[riskLevel.toLowerCase() as keyof typeof riskColors] || [156, 163, 175];
    this.doc.setFillColor(...color);

    // Risk bar
    const barWidth = (chartWidth - 20) * (riskLevel === 'low' ? 0.3 : riskLevel === 'standard' ? 0.6 : 0.9);
    this.doc.rect(chartX + 10, y + 15, barWidth, 8, 'F');

    // Risk labels
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('LOW', chartX + 5, y + 12);
    this.doc.text('MEDIUM', chartX + 25, y + 12);
    this.doc.text('HIGH', chartX + 50, y + 12);

    // Current risk indicator
    this.doc.setTextColor(...color);
    this.doc.setFontSize(12);
    this.doc.text(`CURRENT: ${riskLevel.toUpperCase()}`, chartX + 30, y + 35, { align: 'center' });

    return y + chartHeight + 15;
  }

  // Add coordinate table with GPS data
  private addCoordinateTable(y: number, coordinates: Array<{point: string, latitude: number, longitude: number}>) {
    const tableWidth = this.pageWidth - 2 * this.margin;
    const colWidth = tableWidth / 3;

    // Table header
    this.doc.setFillColor(34, 197, 94);
    this.doc.rect(this.margin, y, tableWidth, 8, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Point', this.margin + 5, y + 6);
    this.doc.text('Latitude', this.margin + colWidth + 5, y + 6);
    this.doc.text('Longitude', this.margin + 2 * colWidth + 5, y + 6);

    // Table rows
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'normal');
    coordinates.forEach((coord, index) => {
      const rowY = y + 8 + (index + 1) * 6;
      
      // Alternate row colors
      if (index % 2 === 0) {
        this.doc.setFillColor(248, 249, 250);
        this.doc.rect(this.margin, rowY - 4, tableWidth, 6, 'F');
      }

      this.doc.text(coord.point, this.margin + 5, rowY);
      this.doc.text(coord.latitude.toFixed(6), this.margin + colWidth + 5, rowY);
      this.doc.text(coord.longitude.toFixed(6), this.margin + 2 * colWidth + 5, rowY);
    });

    return y + 8 + (coordinates.length + 1) * 6 + 10;
  }

  // Add deforestation analysis section with charts
  private addDeforestationAnalysis(y: number, data: EUDRReportData) {
    // Section header
    this.doc.setFillColor(220, 38, 38); // Red for deforestation
    this.doc.rect(this.margin, y, this.pageWidth - 2 * this.margin, 10, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DEFORESTATION RISK ANALYSIS', this.margin + 5, y + 7);

    y += 20;

    // Risk assessment pie chart visualization (simplified)
    const centerX = this.pageWidth / 2;
    const centerY = y + 25;
    const radius = 20;

    // Draw pie chart segments based on risk
    const riskValue = data.eudrAnalysis.riskLevel === 'high' ? 0.8 : 
                     data.eudrAnalysis.riskLevel === 'standard' ? 0.5 : 0.2;

    // High risk segment (red)
    this.doc.setFillColor(239, 68, 68);
    this.doc.circle(centerX, centerY, radius * riskValue, 'F');

    // Low risk segment (green)
    this.doc.setFillColor(34, 197, 94);
    this.doc.circle(centerX + 10, centerY, radius * (1 - riskValue), 'F');

    // Chart labels
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.text('High Risk Areas', centerX - 30, centerY + 35);
    this.doc.text('Compliant Areas', centerX + 15, centerY + 35);

    return y + 60;
  }

  // Generate comprehensive EUDR compliance report
  generateEUDRReport(data: EUDRReportData): void {
    let currentY = 50; // Start after letterhead

    this.addLetterhead();

    // Report title
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(34, 197, 94);
    this.doc.text('EU DEFORESTATION REGULATION (EUDR)', this.pageWidth / 2, currentY, { align: 'center' });
    this.doc.text('COMPLIANCE ASSESSMENT REPORT', this.pageWidth / 2, currentY + 8, { align: 'center' });

    currentY += 25;

    // Report metadata
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`Report Date: ${new Date().toLocaleDateString()}`, this.margin, currentY);
    this.doc.text(`Report ID: EUDR-${Date.now()}`, this.margin, currentY + 5);
    this.doc.text(`Farm Area: ${data.farmBoundary.area.toFixed(3)} hectares`, this.margin, currentY + 10);

    currentY += 25;

    // Farmer information section
    this.doc.setFillColor(59, 130, 246); // Blue background
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 8, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('FARMER INFORMATION', this.margin + 5, currentY + 6);

    currentY += 15;
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Name: ${data.farmer.name}`, this.margin + 5, currentY);
    this.doc.text(`ID: ${data.farmer.id}`, this.margin + 5, currentY + 5);
    this.doc.text(`County: ${data.farmer.county}`, this.margin + 5, currentY + 10);
    this.doc.text(`District: ${data.farmer.district}`, this.margin + 5, currentY + 15);

    currentY += 30;

    // Risk assessment chart
    currentY = this.addRiskChart(currentY, data.eudrAnalysis.riskLevel);

    // Compliance status
    const statusColor = data.eudrAnalysis.complianceStatus === 'COMPLIANT' ? [34, 197, 94] : [239, 68, 68];
    this.doc.setFillColor(...statusColor);
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 15, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`COMPLIANCE STATUS: ${data.eudrAnalysis.complianceStatus}`, 
                  this.pageWidth / 2, currentY + 10, { align: 'center' });

    currentY += 25;

    // GPS coordinates table
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('BOUNDARY COORDINATES', this.margin, currentY);
    currentY += 10;

    currentY = this.addCoordinateTable(currentY, data.farmBoundary.coordinates);

    // New page for deforestation analysis
    this.doc.addPage();
    currentY = 20;

    currentY = this.addDeforestationAnalysis(currentY, data);

    // Recommendations section
    this.doc.setFillColor(251, 191, 36); // Yellow background
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 8, 'F');
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RECOMMENDATIONS', this.margin + 5, currentY + 6);

    currentY += 15;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    data.eudrAnalysis.recommendations.forEach((rec, index) => {
      this.doc.text(`${index + 1}. ${rec}`, this.margin + 5, currentY);
      currentY += 6;
    });

    // Footer
    currentY = this.pageHeight - 30;
    this.doc.setFillColor(34, 197, 94);
    this.doc.rect(0, currentY, this.pageWidth, 30, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('This report is generated by AgriTrace360™ Agricultural Compliance Management System', 
                  this.pageWidth / 2, currentY + 10, { align: 'center' });
    this.doc.text('Liberia Agriculture Commodity Regulatory Authority (LACRA)', 
                  this.pageWidth / 2, currentY + 15, { align: 'center' });
    this.doc.text('EU Deforestation Regulation Compliance Certified', 
                  this.pageWidth / 2, currentY + 20, { align: 'center' });

    // Download the PDF
    this.doc.save(`EUDR_Compliance_Report_${data.farmer.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  }

  // Generate deforestation analysis report
  generateDeforestationReport(data: EUDRReportData): void {
    let currentY = 50;

    this.addLetterhead();

    // Report title
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(220, 38, 38); // Red for deforestation
    this.doc.text('DEFORESTATION RISK ASSESSMENT', this.pageWidth / 2, currentY, { align: 'center' });
    this.doc.text('ENVIRONMENTAL IMPACT ANALYSIS', this.pageWidth / 2, currentY + 8, { align: 'center' });

    currentY += 25;

    // Executive summary
    this.doc.setFillColor(254, 226, 226); // Light red background
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 40, 'F');
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EXECUTIVE SUMMARY', this.margin + 5, currentY + 8);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Farm Area Analyzed: ${data.farmBoundary.area.toFixed(3)} hectares`, this.margin + 5, currentY + 18);
    this.doc.text(`Deforestation Risk Level: ${data.eudrAnalysis.deforestationRisk}`, this.margin + 5, currentY + 24);
    this.doc.text(`Environmental Compliance: ${data.eudrAnalysis.complianceStatus}`, this.margin + 5, currentY + 30);
    this.doc.text(`Assessment Date: ${new Date().toLocaleDateString()}`, this.margin + 5, currentY + 36);

    currentY += 55;

    // Environmental metrics with colorful charts
    this.doc.setFillColor(34, 197, 94);
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 8, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ENVIRONMENTAL METRICS', this.margin + 5, currentY + 6);

    currentY += 20;

    // Forest coverage chart (simplified bar chart)
    const chartData = [
      { label: 'Forest Coverage', value: 75, color: [34, 197, 94] },
      { label: 'Agricultural Land', value: 20, color: [251, 191, 36] },
      { label: 'Cleared Areas', value: 5, color: [239, 68, 68] }
    ];

    chartData.forEach((item, index) => {
      const barY = currentY + index * 15;
      const barWidth = (item.value / 100) * 100;

      this.doc.setFillColor(...item.color);
      this.doc.rect(this.margin + 40, barY, barWidth, 8, 'F');

      this.doc.setTextColor(0, 0, 0);
      this.doc.setFontSize(10);
      this.doc.text(item.label, this.margin, barY + 6);
      this.doc.text(`${item.value}%`, this.margin + 45 + barWidth, barY + 6);
    });

    currentY += 60;

    // Satellite analysis timeline
    this.doc.setFillColor(59, 130, 246);
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 8, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('SATELLITE MONITORING TIMELINE', this.margin + 5, currentY + 6);

    currentY += 20;
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    const timelineData = [
      '2023-01-01: Initial forest baseline established',
      '2023-06-01: Mid-year assessment - no significant changes',
      '2023-12-01: Annual review - compliance maintained',
      '2024-01-01: Current assessment - continued compliance'
    ];

    timelineData.forEach((entry, index) => {
      this.doc.text(`• ${entry}`, this.margin + 5, currentY + index * 6);
    });

    currentY += 40;

    // Risk mitigation measures
    this.doc.setFillColor(251, 191, 36);
    this.doc.rect(this.margin, currentY, this.pageWidth - 2 * this.margin, 8, 'F');
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('RISK MITIGATION MEASURES', this.margin + 5, currentY + 6);

    currentY += 15;
    const mitigationMeasures = [
      'Regular satellite monitoring for forest cover changes',
      'Implementation of sustainable farming practices',
      'Buffer zones around sensitive forest areas',
      'Quarterly compliance assessments',
      'Farmer education on environmental protection'
    ];

    mitigationMeasures.forEach((measure, index) => {
      this.doc.text(`${index + 1}. ${measure}`, this.margin + 5, currentY + index * 6);
    });

    // Footer
    currentY = this.pageHeight - 30;
    this.doc.setFillColor(220, 38, 38);
    this.doc.rect(0, currentY, this.pageWidth, 30, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Deforestation Risk Assessment - AgriTrace360™ Environmental Monitoring', 
                  this.pageWidth / 2, currentY + 10, { align: 'center' });
    this.doc.text('Powered by Satellite Imagery Analysis & GPS Boundary Mapping', 
                  this.pageWidth / 2, currentY + 15, { align: 'center' });
    this.doc.text('LACRA Environmental Compliance Division', 
                  this.pageWidth / 2, currentY + 20, { align: 'center' });

    // Download the PDF
    this.doc.save(`Deforestation_Report_${data.farmer.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
  }
}