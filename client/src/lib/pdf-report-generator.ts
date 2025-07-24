import jsPDF from 'jspdf';

interface ReportData {
  coordinates: { lat: number; lng: number };
  timestamp: string;
  gfwData: {
    gladAlerts: any;
    gfwIntegratedAlerts: any;
    treeCoverAnalysis: any;
    fireAlerts: any;
    biodiversityData: any;
  };
  nasaData: any;
  eudrCompliance: {
    riskLevel: string;
    complianceStatus: string;
    deforestationRisk: string;
  };
}

export class PDFReportGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 280;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF();
  }

  private addAgriTraceLogo() {
    // Add AgriTrace360 header
    this.doc.setFontSize(24);
    this.doc.setTextColor(0, 128, 0); // Green color
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('AgriTrace360™', this.margin, this.currentY);
    
    this.doc.setFontSize(12);
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('FARM DIGITALIZATION', this.margin, this.currentY + 8);
    
    // Add separator line
    this.doc.setDrawColor(0, 128, 0);
    this.doc.setLineWidth(2);
    this.doc.line(this.margin, this.currentY + 15, 190, this.currentY + 15);
    
    this.currentY += 25;
  }

  private addReportHeader(coordinates: { lat: number; lng: number }, timestamp: string) {
    this.doc.setFontSize(18);
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EUDR Compliance & Deforestation Monitoring Report', this.margin, this.currentY);
    
    this.currentY += 15;
    
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Report Generated: ${new Date(timestamp).toLocaleString()}`, this.margin, this.currentY);
    this.doc.text(`Location: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`, this.margin, this.currentY + 7);
    this.doc.text('Region: Republic of Liberia', this.margin, this.currentY + 14);
    
    this.currentY += 25;
  }

  private addSection(title: string, content: string[]) {
    if (this.currentY > this.pageHeight - 40) {
      this.doc.addPage();
      this.currentY = 20;
    }

    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 100, 0);
    this.doc.text(title, this.margin, this.currentY);
    
    this.currentY += 10;
    
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(0, 0, 0);
    
    content.forEach(line => {
      if (this.currentY > this.pageHeight - 10) {
        this.doc.addPage();
        this.currentY = 20;
      }
      this.doc.text(line, this.margin + 5, this.currentY);
      this.currentY += 5;
    });
    
    this.currentY += 5;
  }

  private addEUDRComplianceSection(eudrData: any) {
    const content = [
      `EUDR Risk Level: ${eudrData.riskLevel || 'Medium Risk'}`,
      `Compliance Status: ${eudrData.complianceStatus || 'Compliant'}`,
      `Deforestation Risk Assessment: ${eudrData.deforestationRisk || 'Medium'}`,
      '',
      'EU Deforestation Regulation (EUDR) Requirements:',
      '• Products must be deforestation-free after December 31, 2020',
      '• Requires due diligence and risk assessment',
      '• Mandatory geolocation data for all agricultural commodities',
      '• Regular monitoring and reporting obligations',
      '• Non-compliance penalties up to 4% of annual turnover'
    ];
    
    this.addSection('1. EUDR COMPLIANCE ASSESSMENT', content);
  }

  private addDeforestationAlertsSection(gfwData: any) {
    const gladAlerts = gfwData.gladAlerts?.alerts || [];
    const integratedAlerts = gfwData.gfwIntegratedAlerts?.alert_summary || {};
    
    const content = [
      `Total Deforestation Alerts (30 days): ${integratedAlerts.total_alerts_30days || 0}`,
      `High Confidence Alerts: ${integratedAlerts.high_confidence_alerts || 0}`,
      `Total Affected Area: ${integratedAlerts.total_area_ha?.toFixed(2) || 0} hectares`,
      `Average Detection Latency: ${integratedAlerts.avg_detection_latency_days || 0} days`,
      '',
      'Recent GLAD Deforestation Alerts:',
      ...gladAlerts.slice(0, 5).map((alert: any, index: number) => 
        `${index + 1}. Date: ${alert.alert_date} | Area: ${alert.area_ha?.toFixed(2)}ha | Confidence: ${alert.confidence} | Forest Type: ${alert.forest_type}`
      ),
      '',
      'Alert Sources: GLAD-L, GLAD-S2, RADD Systems',
      'Monitoring Frequency: Weekly updates from Global Forest Watch'
    ];
    
    this.addSection('2. DEFORESTATION ALERTS & MONITORING', content);
  }

  private addTreeCoverAnalysisSection(treeCoverData: any) {
    const stats = treeCoverData?.tree_cover_stats || {};
    const analysis = treeCoverData?.forest_change_analysis || {};
    const carbon = treeCoverData?.carbon_implications || {};
    
    const content = [
      `Current Tree Cover: ${stats.current_tree_cover_percent?.toFixed(1) || 0}%`,
      `Tree Cover in 2000: ${stats.tree_cover_2000_percent?.toFixed(1) || 0}%`,
      `Tree Cover Loss (2001-2023): ${stats.tree_cover_loss_2001_2023?.toFixed(1) || 0}%`,
      `Tree Cover Gain (2000-2012): ${stats.tree_cover_gain_2000_2012?.toFixed(1) || 0}%`,
      '',
      `Annual Loss Rate: ${analysis.annual_loss_rate?.toFixed(2) || 0}% per year`,
      `Peak Loss Year: ${analysis.peak_loss_year || 'N/A'}`,
      `Primary Forest Extent: ${analysis.primary_forest_extent_ha?.toFixed(1) || 0} hectares`,
      `Secondary Forest Extent: ${analysis.secondary_forest_extent_ha?.toFixed(1) || 0} hectares`,
      `Plantation Extent: ${analysis.plantation_extent_ha?.toFixed(1) || 0} hectares`,
      '',
      'Carbon Impact Assessment:',
      `Estimated Carbon Loss: ${carbon.estimated_carbon_loss_tons?.toFixed(0) || 0} tons`,
      `CO2 Emissions: ${carbon.co2_emissions_tons?.toFixed(0) || 0} tons CO2`,
      `Carbon Density: ${carbon.carbon_density_tons_per_ha?.toFixed(1) || 0} tons/hectare`
    ];
    
    this.addSection('3. FOREST COVER ANALYSIS', content);
  }

  private addFireAlertsSection(fireData: any) {
    const alerts = fireData?.fire_alerts || [];
    
    const content = [
      `Total Fire Alerts: ${fireData?.total_fire_alerts || 0}`,
      `High Confidence Fires: ${fireData?.high_confidence_fires || 0}`,
      '',
      'Recent Fire Alerts:',
      ...alerts.slice(0, 5).map((alert: any, index: number) => 
        `${index + 1}. Date: ${alert.detection_date} | Type: ${alert.fire_type} | Confidence: ${alert.confidence} | Source: ${alert.satellite_source}`
      ),
      '',
      'Fire Types Detected:',
      '• Agricultural burns (controlled burning)',
      '• Forest fires (uncontrolled burning)',
      '• Savanna fires (grassland burning)',
      '',
      'Satellite Sources: MODIS, VIIRS Fire Detection Systems'
    ];
    
    this.addSection('4. FIRE ALERTS & ACTIVITY', content);
  }

  private addBiodiversitySection(biodiversityData: any) {
    const indicators = biodiversityData?.biodiversity_indicators || {};
    const protection = biodiversityData?.protected_areas || {};
    const conservation = biodiversityData?.conservation_status || {};
    
    const content = [
      `Species Richness Index: ${indicators.species_richness_index?.toFixed(1) || 0}`,
      `Endemic Species Count: ${indicators.endemic_species_count || 0}`,
      `Threatened Species Count: ${indicators.threatened_species_count || 0}`,
      `Habitat Integrity Score: ${indicators.habitat_integrity_score?.toFixed(1) || 0}%`,
      '',
      'Protected Area Status:',
      `Within Protected Area: ${protection.within_protected_area ? 'Yes' : 'No'}`,
      `Nearest Protected Area: ${protection.nearest_protected_area_km?.toFixed(1) || 0} km`,
      `Protection Level: ${protection.protection_level || 'N/A'}`,
      `Area Designation: ${protection.area_designation || 'N/A'}`,
      '',
      'Conservation Priority:',
      `Priority Level: ${conservation.priority_level || 'Medium'}`,
      `Funding Requirements: $${conservation.funding_requirements_usd?.toLocaleString() || 0}`,
      '',
      'Recommended Conservation Actions:',
      ...(conservation.conservation_actions_needed || []).map((action: string) => `• ${action}`)
    ];
    
    this.addSection('5. BIODIVERSITY & CONSERVATION', content);
  }

  private addRecommendationsSection(gfwData: any) {
    const recommendations = gfwData?.gfwIntegratedAlerts?.recommendations || [];
    
    const content = [
      'Based on satellite monitoring and EUDR compliance requirements:',
      '',
      'Immediate Actions:',
      ...recommendations.map((rec: string) => `• ${rec}`),
      '',
      'EUDR Compliance Measures:',
      '• Implement continuous forest monitoring system',
      '• Establish deforestation-free supply chain protocols',
      '• Document all commodity sourcing with GPS coordinates',
      '• Conduct regular risk assessments and due diligence',
      '• Maintain comprehensive audit trail for all transactions',
      '',
      'Long-term Sustainability:',
      '• Develop forest restoration programs',
      '• Engage local communities in conservation efforts', 
      '• Implement sustainable agricultural practices',
      '• Establish buffer zones around critical habitats',
      '• Monitor and report on conservation outcomes'
    ];
    
    this.addSection('6. RECOMMENDATIONS & ACTION PLAN', content);
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Footer line
      this.doc.setDrawColor(0, 128, 0);
      this.doc.setLineWidth(1);
      this.doc.line(this.margin, 285, 190, 285);
      
      // Footer text
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text('AgriTrace360™ - Agricultural Commodity Compliance Management System', this.margin, 290);
      this.doc.text(`Generated by LACRA (Liberia Agriculture Commodity Regulatory Authority) | Page ${i} of ${pageCount}`, this.margin, 295);
      this.doc.text(`Report Date: ${new Date().toLocaleDateString()} | Confidential Document`, 120, 295);
    }
  }

  public generateReport(data: ReportData): Uint8Array {
    // Reset document
    this.doc = new jsPDF();
    this.currentY = 20;
    
    // Add content sections
    this.addAgriTraceLogo();
    this.addReportHeader(data.coordinates, data.timestamp);
    this.addEUDRComplianceSection(data.eudrCompliance);
    this.addDeforestationAlertsSection(data.gfwData);
    this.addTreeCoverAnalysisSection(data.gfwData.treeCoverAnalysis);
    this.addFireAlertsSection(data.gfwData.fireAlerts);
    this.addBiodiversitySection(data.gfwData.biodiversityData);
    this.addRecommendationsSection(data.gfwData);
    this.addFooter();
    
    // Return PDF as Uint8Array
    return this.doc.output('arraybuffer') as Uint8Array;
  }

  public downloadReport(data: ReportData, filename?: string): void {
    const pdfData = this.generateReport(data);
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `AgriTrace360_EUDR_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
}