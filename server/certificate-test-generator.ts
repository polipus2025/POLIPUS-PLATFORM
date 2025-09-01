import type { Express } from "express";
import PDFDocument from "pdfkit";

interface FarmerData {
  id: string;
  fullName: string;
  email: string;
  county: string;
  city: string;
  farmSize: number;
  gpsCoordinates: string;
  cropType: string;
  exporterCompany: string;
}

// Realistic simulation data
const generateRealisticFarmerData = (farmerId: string): FarmerData => {
  const farmers = [
    {
      id: farmerId,
      fullName: "John Kollie",
      email: "john.kollie@liberianfarm.com",
      county: "Bong",
      city: "Gbarnga",
      farmSize: 25.5,
      gpsCoordinates: "7.0042° N, 9.4334° W",
      cropType: "Cocoa",
      exporterCompany: "Liberian Agricultural Export Ltd."
    },
    {
      id: farmerId,
      fullName: "Mary Togba",
      email: "mary.togba@ruralcoop.lr",
      county: "Nimba",
      city: "Sanniquellie", 
      farmSize: 18.2,
      gpsCoordinates: "7.3625° N, 8.7196° W",
      cropType: "Coffee",
      exporterCompany: "West Africa Premium Exports"
    },
    {
      id: farmerId,
      fullName: "James Varney",
      email: "james.varney@farmunion.lr",
      county: "Montserrado",
      city: "Careysburg",
      farmSize: 32.8,
      gpsCoordinates: "6.5000° N, 10.3500° W", 
      cropType: "Palm Oil",
      exporterCompany: "Tropical Commodities International"
    }
  ];
  
  return farmers[Math.floor(Math.random() * farmers.length)];
};

export function addCertificateTestRoutes(app: Express) {
  
  // Generate EUDR Compliance Certificate with real data simulation
  app.get('/api/test/eudr-certificate/:farmerId', async (req, res) => {
    try {
      const { farmerId } = req.params;
      const farmer = generateRealisticFarmerData(farmerId);
      
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 40,
        info: {
          Title: 'EUDR Compliance Certificate',
          Author: 'LACRA & ECOENVIROS',
          Subject: 'EU Deforestation Regulation Compliance',
          Creator: 'Polipus AgriTrace Platform'
        }
      });

      // Set response headers for PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="EUDR_Certificate_${farmer.fullName.replace(' ', '_')}.pdf"`);
      
      doc.pipe(res);

      // === CERTIFICATE HEADER ===
      doc.rect(0, 0, 595, 80).fillColor('#1a365d').fill();
      
      // LACRA Logo area
      doc.rect(40, 15, 80, 50).strokeColor('#ffffff').stroke();
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('LACRA', 50, 25);
      doc.fontSize(8).text('Liberian Agricultural', 45, 40);
      doc.text('Regulatory Authority', 45, 52);
      
      // Main Title
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#ffffff');
      doc.text('EUDR COMPLIANCE CERTIFICATE', 140, 25);
      doc.fontSize(12).font('Helvetica').text('EU Deforestation Regulation Compliance', 140, 45);
      
      // ECOENVIROS Logo area  
      doc.rect(475, 15, 80, 50).strokeColor('#ffffff').stroke();
      doc.fontSize(9).text('ECOENVIROS', 485, 25);
      doc.fontSize(7).text('Audit & Certification', 485, 40);
      doc.text('ISO 14001 Certified', 485, 52);

      // Reset to black for content
      doc.fillColor('#000000');
      let yPos = 120;

      // === CERTIFICATE INFORMATION ===
      doc.fontSize(14).font('Helvetica-Bold').text('CERTIFICATE DETAILS', 40, yPos);
      yPos += 25;
      
      // Certificate number and date
      const certNumber = `EUDR-${farmer.county.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const validUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      doc.fontSize(11).font('Helvetica');
      doc.text(`Certificate Number: ${certNumber}`, 40, yPos);
      doc.text(`Issue Date: ${issueDate}`, 320, yPos);
      yPos += 15;
      doc.text(`Valid Until: ${validUntil}`, 40, yPos);
      doc.text(`Certification Level: APPROVED`, 320, yPos);
      yPos += 30;

      // === FARMER INFORMATION ===
      doc.fontSize(14).font('Helvetica-Bold').text('PRODUCER INFORMATION', 40, yPos);
      yPos += 25;
      
      // Create info boxes
      doc.rect(40, yPos, 250, 80).strokeColor('#cccccc').stroke();
      doc.rect(310, yPos, 245, 80).strokeColor('#cccccc').stroke();
      
      // Left box - Basic info
      doc.fontSize(11).font('Helvetica-Bold').text('Producer Details', 45, yPos + 10);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Name: ${farmer.fullName}`, 45, yPos + 25);
      doc.text(`Email: ${farmer.email}`, 45, yPos + 40);
      doc.text(`Location: ${farmer.city}, ${farmer.county}`, 45, yPos + 55);
      
      // Right box - Farm info
      doc.fontSize(11).font('Helvetica-Bold').text('Farm Details', 315, yPos + 10);
      doc.fontSize(10).font('Helvetica');
      doc.text(`GPS: ${farmer.gpsCoordinates}`, 315, yPos + 25);
      doc.text(`Farm Size: ${farmer.farmSize} hectares`, 315, yPos + 40);
      doc.text(`Primary Crop: ${farmer.cropType}`, 315, yPos + 55);
      
      yPos += 100;

      // === COMPLIANCE STATUS ===
      doc.fontSize(14).font('Helvetica-Bold').text('COMPLIANCE STATUS', 40, yPos);
      yPos += 25;

      // Status indicators
      const statusItems = [
        { label: 'Deforestation Risk Assessment', status: 'PASSED', color: '#22c55e' },
        { label: 'GPS Verification', status: 'VERIFIED', color: '#22c55e' },
        { label: 'Supply Chain Documentation', status: 'COMPLETE', color: '#22c55e' },
        { label: 'Legal Compliance Check', status: 'APPROVED', color: '#22c55e' }
      ];

      statusItems.forEach((item, index) => {
        const boxY = yPos + (index * 25);
        
        // Status box
        doc.rect(40, boxY, 20, 15).fillColor(item.color).fill();
        doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
        doc.text('✓', 47, boxY + 4);
        
        // Status text
        doc.fillColor('#000000').fontSize(10).font('Helvetica');
        doc.text(item.label, 70, boxY + 3);
        doc.font('Helvetica-Bold').text(item.status, 350, boxY + 3);
      });
      
      yPos += 120;

      // === RISK ANALYSIS CHART ===
      doc.fontSize(14).font('Helvetica-Bold').text('DEFORESTATION RISK ANALYSIS', 40, yPos);
      yPos += 25;

      // Chart background
      doc.rect(40, yPos, 515, 120).strokeColor('#e5e7eb').stroke();
      
      // Chart title
      doc.fontSize(11).font('Helvetica-Bold').text('Risk Assessment Results', 45, yPos + 10);
      
      // Risk categories with bars
      const riskData = [
        { category: 'Forest Loss Risk', percentage: 8, color: '#22c55e' },
        { category: 'Legal Compliance', percentage: 95, color: '#22c55e' },
        { category: 'Supply Chain Integrity', percentage: 92, color: '#22c55e' },
        { category: 'Documentation Quality', percentage: 98, color: '#22c55e' }
      ];

      let chartY = yPos + 35;
      riskData.forEach((risk, index) => {
        const barY = chartY + (index * 20);
        
        // Category label
        doc.fontSize(9).font('Helvetica').text(risk.category, 45, barY);
        
        // Progress bar background
        doc.rect(200, barY, 200, 12).fillColor('#f3f4f6').fill();
        
        // Progress bar fill
        const barWidth = (risk.percentage / 100) * 200;
        doc.rect(200, barY, barWidth, 12).fillColor(risk.color).fill();
        
        // Percentage text
        doc.fillColor('#000000').text(`${risk.percentage}%`, 420, barY + 2);
      });
      
      yPos += 140;

      // === CERTIFICATION STATEMENT ===
      doc.fontSize(12).font('Helvetica-Bold').text('CERTIFICATION STATEMENT', 40, yPos);
      yPos += 20;
      
      doc.fontSize(10).font('Helvetica').text(
        `This certificate confirms that the agricultural production from ${farmer.fullName}'s farm in ${farmer.city}, ` +
        `${farmer.county} County meets all requirements of the EU Deforestation Regulation (EUDR). The farm has been ` +
        `verified to have no deforestation risk, proper GPS documentation, and complete supply chain traceability.`,
        40, yPos, { width: 515, align: 'justify' }
      );
      yPos += 60;

      // === SIGNATURES ===
      doc.rect(40, yPos, 250, 60).strokeColor('#cccccc').stroke();
      doc.rect(305, yPos, 250, 60).strokeColor('#cccccc').stroke();
      
      doc.fontSize(10).font('Helvetica-Bold').text('LACRA Certification Officer', 45, yPos + 10);
      doc.fontSize(9).font('Helvetica').text('Digital Signature Applied', 45, yPos + 25);
      doc.text(`Date: ${issueDate}`, 45, yPos + 40);
      
      doc.fontSize(10).font('Helvetica-Bold').text('ECOENVIROS Auditor', 310, yPos + 10);
      doc.fontSize(9).font('Helvetica').text('Third-Party Verification', 310, yPos + 25);
      doc.text(`Audit Date: ${issueDate}`, 310, yPos + 40);

      // === FOOTER ===
      yPos += 80;
      doc.fontSize(8).font('Helvetica').fillColor('#666666');
      doc.text('This certificate is digitally generated and verified. For validation, visit: verify.lacra.gov.lr', 40, yPos);
      doc.text(`Certificate ID: ${certNumber} | Generated: ${new Date().toISOString()}`, 40, yPos + 12);

      doc.end();
      
    } catch (error) {
      console.error('Error generating EUDR certificate:', error);
      res.status(500).json({ error: 'Failed to generate EUDR certificate' });
    }
  });

  // Generate Deforestation Analysis Certificate with real data simulation  
  app.get('/api/test/deforestation-certificate/:farmerId', async (req, res) => {
    try {
      const { farmerId } = req.params;
      const farmer = generateRealisticFarmerData(farmerId);
      
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 40,
        info: {
          Title: 'Deforestation Analysis Certificate',
          Author: 'LACRA Environmental Division',
          Subject: 'Forest Impact Assessment Report',
          Creator: 'Polipus Environmental Monitoring'
        }
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="Deforestation_Analysis_${farmer.fullName.replace(' ', '_')}.pdf"`);
      
      doc.pipe(res);

      // === HEADER ===
      doc.rect(0, 0, 595, 80).fillColor('#059669').fill();
      
      // Environmental logo area
      doc.rect(40, 15, 80, 50).strokeColor('#ffffff').stroke();
      doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text('LACRA', 50, 25);
      doc.fontSize(8).text('Environmental', 50, 40);
      doc.text('Monitoring', 55, 52);
      
      // Main Title
      doc.fontSize(18).font('Helvetica-Bold').fillColor('#ffffff');
      doc.text('DEFORESTATION ANALYSIS', 140, 20);
      doc.fontSize(12).font('Helvetica').text('Environmental Impact Assessment Report', 140, 45);
      
      // Satellite logo area
      doc.rect(475, 15, 80, 50).strokeColor('#ffffff').stroke();
      doc.fontSize(9).text('SATELLITE', 485, 25);
      doc.fontSize(7).text('MONITORING', 485, 38);
      doc.text('NASA • ESA • USGS', 485, 52);

      doc.fillColor('#000000');
      let yPos = 120;

      // === REPORT DETAILS ===
      doc.fontSize(14).font('Helvetica-Bold').text('ENVIRONMENTAL ASSESSMENT REPORT', 40, yPos);
      yPos += 25;
      
      const reportNumber = `DFR-${farmer.county.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      const analysisDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      doc.fontSize(11).font('Helvetica');
      doc.text(`Report Number: ${reportNumber}`, 40, yPos);
      doc.text(`Analysis Date: ${analysisDate}`, 320, yPos);
      yPos += 15;
      doc.text(`Analysis Period: 24 months`, 40, yPos);
      doc.text(`Risk Level: LOW RISK`, 320, yPos);
      yPos += 30;

      // === FARM INFORMATION ===
      doc.fontSize(14).font('Helvetica-Bold').text('FARM LOCATION ANALYSIS', 40, yPos);
      yPos += 25;
      
      doc.rect(40, yPos, 515, 80).strokeColor('#cccccc').stroke();
      
      doc.fontSize(11).font('Helvetica-Bold').text('Location Details', 45, yPos + 10);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Farm Owner: ${farmer.fullName}`, 45, yPos + 25);
      doc.text(`Coordinates: ${farmer.gpsCoordinates}`, 45, yPos + 40);
      doc.text(`Farm Area: ${farmer.farmSize} hectares`, 45, yPos + 55);
      
      doc.text(`County: ${farmer.county}`, 280, yPos + 25);
      doc.text(`City: ${farmer.city}`, 280, yPos + 40);
      doc.text(`Crop Type: ${farmer.cropType}`, 280, yPos + 55);
      
      yPos += 100;

      // === FOREST ANALYSIS RESULTS ===
      doc.fontSize(14).font('Helvetica-Bold').text('SATELLITE ANALYSIS RESULTS', 40, yPos);
      yPos += 25;

      // Analysis metrics
      const forestMetrics = [
        { metric: 'Forest Cover Change', value: '-0.2%', status: 'ACCEPTABLE', color: '#22c55e' },
        { metric: 'Biodiversity Impact', value: 'Minimal', status: 'LOW RISK', color: '#22c55e' },
        { metric: 'Carbon Stock Loss', value: '0.1 tCO2', status: 'NEGLIGIBLE', color: '#22c55e' },
        { metric: 'Deforestation Alert', value: 'None', status: 'CLEAR', color: '#22c55e' }
      ];

      forestMetrics.forEach((metric, index) => {
        const metricY = yPos + (index * 25);
        
        // Status indicator
        doc.rect(40, metricY, 20, 15).fillColor(metric.color).fill();
        doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
        doc.text('✓', 47, metricY + 4);
        
        // Metric details
        doc.fillColor('#000000').fontSize(10).font('Helvetica');
        doc.text(metric.metric, 70, metricY + 3);
        doc.text(metric.value, 250, metricY + 3);
        doc.font('Helvetica-Bold').text(metric.status, 350, metricY + 3);
      });
      
      yPos += 120;

      // === SATELLITE DATA VISUALIZATION ===
      doc.fontSize(14).font('Helvetica-Bold').text('SATELLITE MONITORING DATA', 40, yPos);
      yPos += 25;

      // Chart background
      doc.rect(40, yPos, 515, 140).strokeColor('#e5e7eb').stroke();
      
      // Chart title
      doc.fontSize(11).font('Helvetica-Bold').text('24-Month Forest Cover Monitoring', 45, yPos + 10);
      
      // Monitoring timeline
      const timelineData = [
        { month: 'Jan 2023', coverage: 98.5, alert: false },
        { month: 'Apr 2023', coverage: 98.3, alert: false },
        { month: 'Jul 2023', coverage: 98.2, alert: false },
        { month: 'Oct 2023', coverage: 98.4, alert: false },
        { month: 'Jan 2024', coverage: 98.3, alert: false },
        { month: 'Dec 2024', coverage: 98.3, alert: false }
      ];

      let chartX = 60;
      timelineData.forEach((data, index) => {
        const barHeight = (data.coverage / 100) * 80;
        const barY = yPos + 110 - barHeight;
        
        // Timeline bar
        doc.rect(chartX, barY, 15, barHeight).fillColor('#22c55e').fill();
        
        // Month label
        doc.fontSize(8).font('Helvetica').fillColor('#000000');
        doc.text(data.month, chartX - 10, yPos + 115);
        
        // Coverage percentage
        doc.text(`${data.coverage}%`, chartX - 5, barY - 15);
        
        chartX += 75;
      });
      
      // Y-axis labels
      doc.fontSize(9).text('100%', 25, yPos + 30);
      doc.text('95%', 28, yPos + 70);
      doc.text('90%', 28, yPos + 110);
      
      yPos += 160;

      // === ENVIRONMENTAL IMPACT ASSESSMENT ===
      doc.fontSize(12).font('Helvetica-Bold').text('ENVIRONMENTAL IMPACT STATEMENT', 40, yPos);
      yPos += 20;
      
      doc.fontSize(10).font('Helvetica').text(
        `Based on 24-month satellite monitoring analysis, the farm operated by ${farmer.fullName} in ${farmer.county} ` +
        `County shows no significant deforestation activity. Forest cover has remained stable at 98.3% with minimal ` +
        `natural variation. No deforestation alerts were triggered during the monitoring period. The agricultural ` +
        `activities comply with environmental protection standards and pose minimal risk to biodiversity.`,
        40, yPos, { width: 515, align: 'justify' }
      );
      yPos += 70;

      // === DATA SOURCES ===
      doc.fontSize(11).font('Helvetica-Bold').text('SATELLITE DATA SOURCES', 40, yPos);
      yPos += 20;
      
      const dataSources = [
        'NASA Landsat-8 Operational Land Imager',
        'ESA Sentinel-2 MultiSpectral Instrument', 
        'Global Forest Watch GLAD Alerts',
        'USGS Earth Resources Observation'
      ];
      
      dataSources.forEach((source, index) => {
        doc.fontSize(9).font('Helvetica').text(`• ${source}`, 50, yPos + (index * 12));
      });
      
      yPos += 70;

      // === CERTIFICATION ===
      doc.rect(40, yPos, 515, 60).strokeColor('#cccccc').stroke();
      
      doc.fontSize(10).font('Helvetica-Bold').text('ENVIRONMENTAL CERTIFICATION', 45, yPos + 10);
      doc.fontSize(9).font('Helvetica').text(
        'This analysis confirms zero deforestation risk and environmental compliance.',
        45, yPos + 25
      );
      doc.text(`Certified by: LACRA Environmental Division | Date: ${analysisDate}`, 45, yPos + 40);

      // === FOOTER ===
      yPos += 80;
      doc.fontSize(8).font('Helvetica').fillColor('#666666');
      doc.text('Generated using NASA Earth Observation data and EU Copernicus Sentinel satellite imagery.', 40, yPos);
      doc.text(`Report ID: ${reportNumber} | Analysis completed: ${new Date().toISOString()}`, 40, yPos + 12);

      doc.end();
      
    } catch (error) {
      console.error('Error generating deforestation certificate:', error);
      res.status(500).json({ error: 'Failed to generate deforestation certificate' });
    }
  });
}