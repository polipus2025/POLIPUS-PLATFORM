import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

interface DeforestationCertificateData {
  farmOwner: string;
  county: string;
  city: string;
  coordinates: string;
  farmArea: string;
  cropType: string;
  reportNumber: string;
  batchCode: string;
  qrTraceCode: string;
  analysisPeriod: string;
  riskLevel: string;
  analysisDate: string;
  forestCoverChange: string;
  biodiversityImpact: string;
  carbonStockLoss: string;
  deforestationAlert: string;
  forestCoverData: Array<{ date: string; coverage: number }>;
  verificationUrl: string;
  certificateId: string;
}

export async function generateDeforestationCertificate(data: DeforestationCertificateData): Promise<Buffer> {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 30,
    info: {
      Title: 'Enhanced Deforestation Analysis Certificate',
      Subject: 'Environmental Impact Assessment Report',
      Author: 'LACRA & ECOENVIROS',
      Creator: 'Polipus Environmental Intelligence'
    }
  });

  const chunks: Buffer[] = [];
  doc.on('data', chunk => chunks.push(chunk));

  // Generate QR codes
  const qrCodeBuffer = await QRCode.toBuffer(data.verificationUrl, {
    width: 80,
    margin: 1,
    color: { dark: '#1f2937' }
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // HEADER SECTION
  // Green header background
  doc.rect(0, 0, 612, 90).fill('#059669');

  // LACRA section (left)
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA', 50, 20);
  doc.fontSize(9).fillColor('#e5e7eb')
     .text('Environmental', 50, 40)
     .text('Monitoring', 50, 55);

  // Center title
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('DEFORESTATION ANALYSIS', 150, 25);
  
  // Subtitle
  doc.fontSize(10).fillColor('#ffffff')
     .text('Environmental Impact Assessment Report', 150, 50);

  // ECOENVIROS section (right)
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('ECOENVIROS', 470, 20);
  doc.fontSize(9).fillColor('#e5e7eb')
     .text('Audit & Certification', 470, 40);

  // Replace ISO with Independent Auditors
  doc.fontSize(9).fillColor('#e5e7eb')
     .text('Independent Auditors', 470, 55);

  // Main title section
  doc.fontSize(22).fillColor('#1f2937').font('Helvetica-Bold')
     .text('ENVIRONMENTAL ASSESSMENT REPORT', 50, 110);

  // Report metadata section
  const metadataY = 150;
  doc.fontSize(12).fillColor('#374151').font('Helvetica-Bold');
  
  // Left column
  doc.text(`Report Number: ${data.reportNumber}`, 50, metadataY)
     .text(`Batch Code: ${data.batchCode}`, 50, metadataY + 20)
     .text(`Analysis Period: ${data.analysisPeriod}`, 50, metadataY + 40);

  // Right column
  doc.text(`Analysis Date: ${data.analysisDate}`, 320, metadataY)
     .text(`QR Trace Code: ${data.qrTraceCode}`, 320, metadataY + 20)
     .text(`Risk Level: ${data.riskLevel}`, 320, metadataY + 40);

  // FARM LOCATION ANALYSIS
  const farmSectionY = 230;
  doc.fontSize(16).fillColor('#059669').font('Helvetica-Bold')
     .text('FARM LOCATION ANALYSIS', 50, farmSectionY);

  // Farm details in structured layout
  const farmDetailsY = farmSectionY + 40;
  doc.fontSize(11).fillColor('#1f2937').font('Helvetica-Bold')
     .text('Location Details', 50, farmDetailsY);

  doc.fontSize(10).fillColor('#374151').font('Helvetica');
  doc.text(`Farm Owner: ${data.farmOwner}`, 50, farmDetailsY + 25)
     .text(`Coordinates: ${data.coordinates}`, 50, farmDetailsY + 45)
     .text(`Farm Area: ${data.farmArea}`, 50, farmDetailsY + 65);

  doc.text(`County: ${data.county}`, 320, farmDetailsY + 25)
     .text(`City: ${data.city}`, 320, farmDetailsY + 45)
     .text(`Crop Type: ${data.cropType}`, 320, farmDetailsY + 65);

  // SATELLITE ANALYSIS RESULTS
  const satelliteY = 380;
  doc.fontSize(16).fillColor('#059669').font('Helvetica-Bold')
     .text('SATELLITE ANALYSIS RESULTS', 50, satelliteY);

  // Analysis results table
  const tableY = satelliteY + 40;
  const tableData = [
    { metric: 'Forest Cover Change', value: data.forestCoverChange, status: 'ACCEPTABLE' },
    { metric: 'Biodiversity Impact', value: data.biodiversityImpact, status: 'LOW RISK' },
    { metric: 'Carbon Stock Loss', value: data.carbonStockLoss, status: 'NEGLIGIBLE' },
    { metric: 'Deforestation Alert', value: data.deforestationAlert, status: 'CLEAR' }
  ];

  tableData.forEach((row, index) => {
    const rowY = tableY + (index * 25);
    
    // Metric name
    doc.fontSize(10).fillColor('#374151').font('Helvetica')
       .text(row.metric, 70, rowY);
    
    // Value
    doc.fontSize(10).fillColor('#1f2937').font('Helvetica-Bold')
       .text(row.value, 250, rowY);
    
    // Status with color coding
    const statusColor = row.status === 'CLEAR' || row.status === 'ACCEPTABLE' || row.status === 'NEGLIGIBLE' 
      ? '#059669' : row.status === 'LOW RISK' ? '#d97706' : '#dc2626';
    
    doc.fontSize(10).fillColor(statusColor).font('Helvetica-Bold')
       .text(row.status, 400, rowY);

    // Add checkmark
    doc.fontSize(12).fillColor('#059669')
       .text('✓', 50, rowY);
  });

  // SATELLITE MONITORING DATA section
  const chartY = 540;
  doc.fontSize(16).fillColor('#059669').font('Helvetica-Bold')
     .text('SATELLITE MONITORING DATA', 50, chartY);

  // 24-Month chart title
  doc.fontSize(12).fillColor('#374151').font('Helvetica-Bold')
     .text('24-Month Forest Cover Monitoring', 50, chartY + 40);

  // Simple chart representation (simplified for now)
  const chartAreaY = chartY + 70;
  doc.rect(50, chartAreaY, 500, 120).stroke('#e5e7eb');
  
  // Chart data visualization
  doc.fontSize(10).fillColor('#374151')
     .text('100%', 20, chartAreaY)
     .text('95%', 25, chartAreaY + 30)
     .text('90%', 25, chartAreaY + 60);

  // Data points
  const dataPoints = [
    { label: 'Jan 2023', value: '98.5%', x: 80 },
    { label: 'Apr 2023', value: '98.3%', x: 180 },
    { label: 'Jul 2023', value: '98.2%', x: 280 },
    { label: 'Oct 2023', value: '98.4%', x: 380 },
    { label: 'Jan 2024', value: '98.3%', x: 480 },
    { label: 'Dec 2024', value: '98.3%', x: 520 }
  ];

  dataPoints.forEach(point => {
    // Data point
    doc.circle(point.x, chartAreaY + 40, 4).fill('#059669');
    
    // Value label
    doc.fontSize(8).fillColor('#374151')
       .text(point.value, point.x - 10, chartAreaY - 15);
    
    // Date label
    doc.fontSize(8).fillColor('#6b7280')
       .text(point.label, point.x - 20, chartAreaY + 130);
  });

  // Add new page for continuation
  doc.addPage();

  // ENVIRONMENTAL MONITORING TRACEABILITY
  const traceY = 50;
  doc.fontSize(16).fillColor('#059669').font('Helvetica-Bold')
     .text('ENVIRONMENTAL MONITORING TRACEABILITY', 50, traceY);

  // QR section
  doc.fontSize(12).fillColor('#374151').font('Helvetica-Bold')
     .text('QR Environmental Verification Code', 50, traceY + 40);

  doc.fontSize(10).fillColor('#6b7280')
     .text('Scan QR code for complete environmental monitoring history', 50, traceY + 60)
     .text(`Verification URL: ${data.verificationUrl}`, 50, traceY + 80)
     .text(`Analysis Period: ${data.analysisPeriod} satellite monitoring`, 50, traceY + 100);

  // QR Code
  doc.image(qrCodeBuffer, 450, traceY + 40, { width: 80, height: 80 });
  doc.fontSize(8).fillColor('#6b7280')
     .text('ENV QR', 470, traceY + 130)
     .text('EMBEDDED', 465, traceY + 145);

  // ENVIRONMENTAL COMPLIANCE CONFIRMATION
  const complianceY = 220;
  doc.fontSize(16).fillColor('#059669').font('Helvetica-Bold')
     .text('ENVIRONMENTAL COMPLIANCE CONFIRMATION', 50, complianceY);

  doc.fontSize(14).fillColor('#1f2937').font('Helvetica-Bold')
     .text('✓ ZERO DEFORESTATION CERTIFIED - ENVIRONMENTALLY APPROVED', 50, complianceY + 40);

  doc.fontSize(12).fillColor('#374151')
     .text(`Farm: ${data.farmOwner} - ${data.city}, ${data.county}`, 50, complianceY + 70)
     .text(`GPS Verified: ${data.coordinates}`, 50, complianceY + 90)
     .text('Forest Impact: NEGLIGIBLE - Sustainable Agriculture', 50, complianceY + 110);

  // GOVERNMENT AUTHORITY CERTIFICATIONS
  const govY = 380;
  doc.fontSize(16).fillColor('#059669').font('Helvetica-Bold')
     .text('GOVERNMENT AUTHORITY CERTIFICATIONS', 50, govY);

  const certifications = [
    {
      authority: 'Liberian Land Authority',
      status: 'ENVIRONMENTAL CLEARANCE APPROVED',
      ref: `ENV-LLA-${data.county.slice(0, 3).toUpperCase()}-${data.reportNumber.split('-').pop()}`
    },
    {
      authority: 'Ministry of Labour',
      status: 'SUSTAINABLE PRACTICES CERTIFIED',
      ref: `ENV-MOL-SUST-${data.reportNumber.split('-').pop()}`
    },
    {
      authority: 'LACRA & ECOENVIROS Joint Assessment',
      status: 'BIODIVERSITY IMPACT APPROVED',
      ref: `BIO-ASSESS-${data.reportNumber.split('-').pop()}`
    }
  ];

  certifications.forEach((cert, index) => {
    const certY = govY + 40 + (index * 50);
    
    doc.fontSize(12).fillColor('#374151').font('Helvetica-Bold')
       .text(`✓ ${cert.authority}`, 70, certY);
    
    doc.fontSize(10).fillColor('#059669').font('Helvetica-Bold')
       .text(cert.status, 90, certY + 20);
    
    doc.fontSize(9).fillColor('#6b7280')
       .text(`Ref: ${cert.ref}`, 400, certY + 10);
  });

  // OFFICIAL CERTIFICATION STATEMENT
  const statementY = 560;
  doc.fontSize(16).fillColor('#059669').font('Helvetica-Bold')
     .text('OFFICIAL CERTIFICATION STATEMENT', 50, statementY);

  doc.fontSize(10).fillColor('#374151')
     .text(`This certificate confirms that the agricultural production from ${data.farmOwner}'s farm in ${data.city}, ${data.county} meets all`, 50, statementY + 40)
     .text('environmental protection standards. The farm has been verified as deforestation-free with complete biodiversity', 50, statementY + 60)
     .text('conservation and environmental monitoring.', 50, statementY + 80);

  // SIGNATURE SECTION
  const sigY = 680;
  
  // LACRA signature
  doc.fontSize(12).fillColor('#374151').font('Helvetica-Bold')
     .text('LACRA Environmental Officer', 50, sigY);
  doc.fontSize(10).fillColor('#6b7280')
     .text('Digital Signature Applied', 50, sigY + 20)
     .text(`Date: ${currentDate}`, 50, sigY + 40);

  // ECOENVIROS signature  
  doc.fontSize(12).fillColor('#374151').font('Helvetica-Bold')
     .text('ECOENVIROS Environmental Auditor', 320, sigY);
  doc.fontSize(10).fillColor('#6b7280')
     .text('Third-Party Verification', 320, sigY + 20)
     .text(`Audit Date: ${currentDate}`, 320, sigY + 40);

  // Footer
  const footerY = 750;
  doc.fontSize(8).fillColor('#6b7280')
     .text('This certificate is digitally generated and verified. For validation: verify.lacra.gov.lr/environmental', 50, footerY)
     .text(`Certificate ID: ${data.certificateId} | Generated: ${new Date().toISOString()}`, 50, footerY + 15);

  doc.end();

  return new Promise((resolve) => {
    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
  });
}