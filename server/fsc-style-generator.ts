import PDFDocument from 'pdfkit';

interface FarmerData {
  id: string;
  name: string;
  county: string;
  latitude?: string;
  longitude?: string;
}

interface ExportData {
  company: string;
  license: string;
  quantity: string;
  destination: string;
  exportValue: string;
  vessel: string;
  exportDate: string;
  shipmentId: string;
}

export function generateFSCStyleReport(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): PDFDocument {
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 40, bottom: 40, left: 40, right: 40 }
  });

  const currentDate = new Date().toLocaleDateString();

  // Page 1: Main FSC-Style Report
  generateFSCHeader(doc, packId, currentDate);
  generateFSCComplaiancePillars(doc, farmerData, exportData);
  generateFSCBenefitsSection(doc);
  generateFSCTimelineSection(doc);
  generateFSCFooter(doc, packId, currentDate);

  return doc;
}

function generateFSCHeader(doc: PDFDocument, packId: string, currentDate: string) {
  // Clean white background
  doc.rect(0, 0, 595, 140).fill('#ffffff');
  
  // Subtle top border
  doc.rect(0, 0, 595, 3).fill('#2d3748');
  
  // Main header area
  doc.rect(0, 3, 595, 137).fill('#fafafa');
  
  // FSC-style large title
  doc.fontSize(32).fillColor('#2d3748').font('Helvetica-Bold')
     .text('STREAMLINE YOUR', 60, 30);
  doc.fontSize(32).fillColor('#2d3748').font('Helvetica-Bold')
     .text('EUDR COMPLIANCE JOURNEY', 60, 70);
  
  // Professional subtitle
  doc.fontSize(14).fillColor('#4a5568')
     .text('LACRA® is taking the guesswork and complexity out of EUDR requirements,', 60, 110);
  doc.fontSize(14).fillColor('#4a5568')
     .text('helping certificate holders become compliant on time.', 60, 130);
  
  // Right side certification mark - clean box
  doc.rect(450, 25, 110, 90).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.fontSize(20).fillColor('#2d3748').font('Helvetica-Bold')
     .text('LACRA®', 485, 55);
  doc.fontSize(12).fillColor('#718096')
     .text('CERTIFIED', 485, 80);
  doc.fontSize(10).fillColor('#a0aec0')
     .text(`ID: ${packId.slice(-6)}`, 485, 95);
}

function generateFSCComplaiancePillars(doc: PDFDocument, farmerData: FarmerData, exportData: ExportData) {
  const pillarsY = 160;
  
  // Section header - dark professional
  doc.rect(40, pillarsY, 515, 40).fill('#2d3748');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('SUPPORTING COMPLIANCE – LACRA ALIGNED FOR EUDR', 60, pillarsY + 15);
  
  // Three pillars - FSC style layout
  const pillarStartY = pillarsY + 60;
  const pillarWidth = 165;
  const pillarHeight = 140;
  
  // Pillar 1: Risk Assessment Module
  doc.rect(40, pillarStartY, pillarWidth, pillarHeight).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(40, pillarStartY, pillarWidth, 35).fill('#edf2f7');
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Risk Assessment', 50, pillarStartY + 12);
  
  doc.fontSize(11).fillColor('#4a5568')
     .text('Add-on module that builds on', 50, pillarStartY + 55)
     .text('LACRA\'s rigorous responsible', 50, pillarStartY + 75)
     .text('forestry practices with specific', 50, pillarStartY + 95)
     .text('EUDR regulatory expectations', 50, pillarStartY + 115)
     .text('around risk & due diligence.', 50, pillarStartY + 135);
  
  // Central connecting text
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('LACRA certifications already meet EUDR', 60, pillarStartY + 170);
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('legal & social needs and, in many', 60, pillarStartY + 190);
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('instances, go beyond the law\'s requirements.', 60, pillarStartY + 210);
  doc.fontSize(12).fillColor('#4a5568')
     .text('This puts certificate holders in the best starting position', 60, pillarStartY + 235);
  doc.fontSize(12).fillColor('#4a5568')
     .text('for their EUDR compliance journey.', 60, pillarStartY + 250);
  
  // Pillar 2: Status Indicator (middle)
  doc.rect(215, pillarStartY, pillarWidth, pillarHeight).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(215, pillarStartY, pillarWidth, 35).fill('#e6fffa');
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Compliance Status', 225, pillarStartY + 12);
  
  // Large status checkmark
  doc.circle(297, pillarStartY + 85, 30).fill('#38b2ac');
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold')
     .text('✓', 292, pillarStartY + 77);
  
  doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold')
     .text(`Producer: ${farmerData.name}`, 225, pillarStartY + 125);
  doc.fontSize(10).fillColor('#4a5568')
     .text(`Location: ${farmerData.county}`, 225, pillarStartY + 145);
  
  // Pillar 3: LACRA Trace
  doc.rect(390, pillarStartY, pillarWidth, pillarHeight).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(390, pillarStartY, pillarWidth, 35).fill('#fef5e7');
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('LACRA Trace', 400, pillarStartY + 12);
  
  doc.fontSize(11).fillColor('#4a5568')
     .text('LACRA Licence Holders can', 400, pillarStartY + 55)
     .text('opt in to use LACRA Trace &', 400, pillarStartY + 75)
     .text('other technology tools to trace', 400, pillarStartY + 95)
     .text('products back to the originating', 400, pillarStartY + 115)
     .text('forests and connect with their', 400, pillarStartY + 135)
     .text('supply chains to share data', 400, pillarStartY + 155)
     .text('critical to demonstrating', 400, pillarStartY + 175)
     .text('EUDR compliance.', 400, pillarStartY + 195);
}

function generateFSCBenefitsSection(doc: PDFDocument) {
  const benefitsY = 480;
  
  // Benefits header - dark professional
  doc.rect(40, benefitsY, 515, 40).fill('#2d3748');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('THE BENEFITS OF LACRA ALIGNED FOR EUDR', 60, benefitsY + 15);
  
  // Two-column benefits layout - exact FSC style
  const leftX = 60;
  const rightX = 320;
  const contentY = benefitsY + 60;
  
  // Left column header
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Why choose LACRA Aligned', leftX, contentY);
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Certification for EUDR?', leftX, contentY + 20);
  
  // Left column benefits
  const leftBenefits = [
    '• PURPOSE-BUILT FOR ACCURACY:',
    '  Specifically aligned with EUDR requirements,',
    '  taking the guesswork out of compliance.',
    '',
    '• NATURAL PROGRESSION:',
    '  Your LACRA certification is already a strong',
    '  mitigation measure against deforestation.',
    '',
    '• CREDIBLE ASSURANCE:',
    '  By leveraging the power of independent',
    '  third party verification, you\'re given an',
    '  extra layer of credibility.',
    '',
    '• THOUGHTFUL RISK MITIGATION:',
    '  Every aspect of your supply chain is',
    '  considered to ensure you\'re aware of',
    '  potential risks & empowered to mitigate them.'
  ];
  
  leftBenefits.forEach((line, index) => {
    const isBold = line.startsWith('•');
    const fontSize = isBold ? 11 : 10;
    const color = isBold ? '#2d3748' : '#4a5568';
    const font = isBold ? 'Helvetica-Bold' : 'Helvetica';
    
    doc.fontSize(fontSize).fillColor(color).font(font)
       .text(line, leftX, contentY + 50 + (index * 14));
  });
  
  // Right column header
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Why use LACRA Aligned', rightX, contentY);
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Reporting for EUDR?', rightX, contentY + 20);
  
  // Right column benefits
  const rightBenefits = [
    '• TRACEABILITY:',
    '  LACRA Trace provides infrastructure that',
    '  allows critical data about the origin of',
    '  forest-based products to flow from forest',
    '  managers to downstream customers.',
    '',
    '• THOROUGH VETTING:',
    '  Integrates information from risk assessments',
    '  that are created under a tailored risk',
    '  framework & then verified by a certification body.',
    '',
    '• AUTOMATED ASSISTANCE:',
    '  Draft Due Diligence Statements & Reports',
    '  automatically generated on demand for',
    '  submission to competent authorities.',
    '',
    '• MAKES DATA MANAGEMENT SEAMLESS:',
    '  Data needed for due diligence is automatically',
    '  pulled & consistently structured for you.'
  ];
  
  rightBenefits.forEach((line, index) => {
    const isBold = line.startsWith('•');
    const fontSize = isBold ? 11 : 10;
    const color = isBold ? '#2d3748' : '#4a5568';
    const font = isBold ? 'Helvetica-Bold' : 'Helvetica';
    
    doc.fontSize(fontSize).fillColor(color).font(font)
       .text(line, rightX, contentY + 50 + (index * 14));
  });
  
  // Bottom note - exact FSC style
  doc.fontSize(10).fillColor('#4a5568').font('Helvetica-Oblique')
     .text('Today, these offerings only apply to LACRA-certified supply chains.', 60, contentY + 300);
}

function generateFSCTimelineSection(doc: PDFDocument) {
  const timelineY = 730;
  
  // New page for timeline
  doc.addPage();
  
  // Timeline header
  doc.rect(40, 40, 515, 40).fill('#2d3748');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('TIMELINE FOR LACRA CERTIFICATE HOLDERS', 60, 55);
  
  // Timeline description
  doc.fontSize(16).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Get ahead of the EUDR deadlines by taking LACRA\'s three-stage journey.', 60, 100);
  
  // EUDR Deadlines section - exact FSC style
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold')
     .text('THE EUDR DEADLINES', 60, 140);
  
  // Timeline circles with connecting line
  const circle1X = 180;
  const circle2X = 420;
  const circleY = 200;
  
  // December 2024 circle
  doc.circle(circle1X, circleY, 35).fill('#e53e3e');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('30', circle1X - 12, circleY - 10);
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('December', circle1X - 30, circleY + 5);
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('2024', circle1X - 18, circleY + 22);
  
  // Description for December
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Medium & large', circle1X - 40, circleY + 60);
  doc.fontSize(12).fillColor('#2d3748')
     .text('companies must comply', circle1X - 50, circleY + 80);
  
  // Connecting line
  doc.rect(circle1X + 35, circleY - 2, circle2X - circle1X - 70, 4).fill('#e2e8f0');
  
  // June 2025 circle
  doc.circle(circle2X, circleY, 35).fill('#d69e2e');
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('30', circle2X - 12, circleY - 10);
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('June', circle2X - 20, circleY + 5);
  doc.fontSize(14).fillColor('#ffffff').font('Helvetica-Bold')
     .text('2025', circle2X - 18, circleY + 22);
  
  // Description for June
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Micro & small', circle2X - 35, circleY + 60);
  doc.fontSize(12).fillColor('#2d3748')
     .text('enterprises must comply', circle2X - 50, circleY + 80);
  
  // Three-stage journey section
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold')
     .text('YOUR LACRA ALIGNED FOR EUDR DATES', 60, 320);
  
  // Three stages - exact FSC timeline layout
  const stageY = 360;
  const stageWidth = 160;
  
  // Stage 1: Start Today
  doc.rect(40, stageY, stageWidth, 180).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(40, stageY, stageWidth, 35).fill('#fef2f2');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('Start today', 50, stageY + 12);
  doc.fontSize(11).fillColor('#4a5568')
     .text('Steps and resources you', 50, stageY + 40)
     .text('need to get you started', 50, stageY + 55);
  
  // Stage 2: July 2024
  doc.rect(210, stageY, stageWidth, 180).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(210, stageY, stageWidth, 35).fill('#f0fff4');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('From July 2024', 220, stageY + 12);
  doc.fontSize(11).fillColor('#4a5568')
     .text('LACRA Aligned Certification', 220, stageY + 40)
     .text('for EUDR', 220, stageY + 55);
  
  // Stage 3: September 2024
  doc.rect(380, stageY, stageWidth, 180).fill('#ffffff').stroke('#e2e8f0', 1);
  doc.rect(380, stageY, stageWidth, 35).fill('#fffbeb');
  doc.fontSize(14).fillColor('#2d3748').font('Helvetica-Bold')
     .text('From September 2024', 390, stageY + 12);
  doc.fontSize(11).fillColor('#4a5568')
     .text('LACRA Aligned Reporting', 390, stageY + 40)
     .text('for EUDR', 390, stageY + 55);
  
  // Disclaimer box - FSC style
  doc.rect(60, 580, 475, 60).fill('#f8f9fa').stroke('#e2e8f0', 1);
  doc.fontSize(12).fillColor('#2d3748').font('Helvetica-Bold')
     .text('LACRA certification does not exempt companies from their EUDR obligations', 80, 600);
  doc.fontSize(10).fillColor('#4a5568')
     .text('Certification systems can help companies meet sustainability, legality, and due diligence', 80, 620)
     .text('requirements and provide tools to store and process data. However, being certified', 80, 635)
     .text('does not automatically exempt companies from EUDR obligations.', 80, 650);
}

function generateFSCFooter(doc: PDFDocument, packId: string, currentDate: string) {
  // Footer section - exact FSC style
  doc.rect(0, 760, 595, 82).fill('#2d3748');
  
  // Footer content
  doc.fontSize(18).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LET LACRA SUPPORT YOUR EUDR JOURNEY', 60, 780);
  
  doc.fontSize(12).fillColor('#a0aec0')
     .text('Reach out via www.lacra.org/EUDR or EUDR@lacra.org', 60, 810);
  
  // LACRA logo area
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold')
     .text('LACRA®', 480, 785);
  doc.fontSize(10).fillColor('#a0aec0')
     .text(`Certificate ${packId.slice(-8)}`, 480, 805);
}