import PDFDocument from 'pdfkit';

type PDFDocumentType = InstanceType<typeof PDFDocument>;

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

export function generateTestCleanFinal(
  farmerData: FarmerData,
  exportData: ExportData,
  packId: string
): PDFDocumentType {
  
  console.log('🎯 STARTING TEST CLEAN FINAL - Ultra Simple Approach');
  
  const doc = new PDFDocument({ 
    size: 'A4', 
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const currentDate = new Date().toLocaleDateString();
  let pageCount = 1;

  console.log(`📄 PAGE ${pageCount}: Cover Page - Simple Design`);
  
  // PAGE 1: Cover Page - Ultra Simple (auto-first-page)
  doc.rect(0, 0, 595, 100).fill('#1a365d');
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('EUDR COMPLIANCE PACK', 60, 30);
  doc.fontSize(16).fillColor('#e2e8f0').text(`Certificate ID: ${packId}`, 60, 65);
  
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 1: COVER PAGE', 70, 150);
  doc.fontSize(12).fillColor('#4a5568')
     .text(`Farmer: ${farmerData.name}`, 70, 190)
     .text(`Location: ${farmerData.county}, Liberia`, 70, 210)
     .text(`Date: ${currentDate}`, 70, 230)
     .text(`Company: ${exportData.company}`, 70, 250);
  
  // Simple score cards
  doc.rect(70, 300, 100, 60).fill('#38a169');
  doc.fontSize(14).fillColor('#ffffff').text('OVERALL SCORE', 80, 320);
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('96/100', 90, 340);
  
  doc.rect(200, 300, 100, 60).fill('#3182ce');
  doc.fontSize(14).fillColor('#ffffff').text('EXPORT READY', 210, 320);
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('YES', 225, 340);
  
  doc.rect(330, 300, 100, 60).fill('#059669');
  doc.fontSize(14).fillColor('#ffffff').text('RISK LEVEL', 340, 320);
  doc.fontSize(20).fillColor('#ffffff').font('Helvetica-Bold').text('LOW', 355, 340);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Cover Page`, 60, 770);

  // PAGE 2: Export Eligibility  
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Export Eligibility - Simple Design`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#2563eb');
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('EXPORT ELIGIBILITY', 60, 30);
  
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 2: EXPORT ELIGIBILITY', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('Export standards verified and approved for EU market', 70, 180);
  
  // Simple bar chart simulation
  doc.fontSize(14).fillColor('#2d3748').text('Quality Metrics:', 70, 220);
  
  const metrics = [
    { name: 'Quality Standards', score: 98, color: '#38a169' },
    { name: 'Documentation', score: 96, color: '#3182ce' },
    { name: 'Traceability', score: 97, color: '#805ad5' },
    { name: 'Safety Compliance', score: 95, color: '#d69e2e' }
  ];
  
  metrics.forEach((metric, index) => {
    const y = 250 + (index * 40);
    const barWidth = (metric.score / 100) * 300;
    
    doc.fontSize(11).fillColor('#2d3748').text(metric.name, 70, y);
    doc.rect(70, y + 15, 300, 20).fill('#f1f5f9');
    doc.rect(70, y + 15, barWidth, 20).fill(metric.color);
    doc.fontSize(10).fillColor('#2d3748').text(`${metric.score}%`, 380, y + 20);
  });
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Export Eligibility`, 60, 770);

  // PAGE 3: Compliance Assessment
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Compliance Assessment - Simple Design`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#059669');
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('COMPLIANCE ASSESSMENT', 60, 30);
  
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 3: COMPLIANCE ASSESSMENT', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('EUDR compliance verified at 96% - Approved for export', 70, 180);
  
  // Assessment table
  doc.fontSize(14).fillColor('#2d3748').text('Assessment Results:', 70, 220);
  
  const assessments = [
    { area: 'EUDR Compliance', score: '95/100', status: 'APPROVED' },
    { area: 'Forest Protection', score: '98/100', status: 'EXCELLENT' },
    { area: 'Documentation', score: '96/100', status: 'COMPLETE' },
    { area: 'Supply Chain', score: '94/100', status: 'VERIFIED' },
    { area: 'Environmental', score: '97/100', status: 'SUSTAINABLE' }
  ];
  
  assessments.forEach((assessment, index) => {
    const y = 250 + (index * 30);
    
    doc.rect(70, y, 400, 25).fill(index % 2 === 0 ? '#f8fafc' : '#ffffff');
    doc.fontSize(10).fillColor('#2d3748')
       .text(assessment.area, 80, y + 8)
       .text(assessment.score, 200, y + 8)
       .text(assessment.status, 280, y + 8);
  });
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Compliance Assessment`, 60, 770);

  // PAGE 4: Deforestation Analysis
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Deforestation Analysis - Simple Design`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#dc2626');
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('DEFORESTATION ANALYSIS', 60, 30);
  
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 4: DEFORESTATION ANALYSIS', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('No deforestation risk detected - Satellite monitoring confirmed', 70, 180);
  
  // Risk indicators
  doc.fontSize(14).fillColor('#2d3748').text('Risk Assessment:', 70, 220);
  
  const risks = [
    { category: 'Primary Forest Loss', level: 0, threshold: 5 },
    { category: 'Secondary Forest Degradation', level: 1, threshold: 10 },
    { category: 'Agricultural Expansion', level: 2, threshold: 15 },
    { category: 'Infrastructure Development', level: 0, threshold: 8 }
  ];
  
  risks.forEach((risk, index) => {
    const y = 250 + (index * 40);
    const riskWidth = (risk.level / risk.threshold) * 300;
    
    doc.fontSize(11).fillColor('#2d3748').text(risk.category, 70, y);
    doc.rect(70, y + 15, 300, 20).fill('#f0fdf4');
    doc.rect(70, y + 15, riskWidth, 20).fill(risk.level === 0 ? '#38a169' : '#d69e2e');
    doc.fontSize(10).fillColor('#2d3748').text(`${risk.level}% (Threshold: ${risk.threshold}%)`, 380, y + 20);
  });
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Deforestation Analysis`, 60, 770);

  // PAGE 5: Due Diligence
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Due Diligence - Simple Design`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#7c3aed');
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('DUE DILIGENCE', 60, 30);
  
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 5: DUE DILIGENCE', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('All due diligence procedures completed per EUDR Article 8', 70, 180);
  
  // Process checklist
  doc.fontSize(14).fillColor('#2d3748').text('EUDR Requirements Completed:', 70, 220);
  
  const requirements = [
    'Geolocation coordinates verified using GPS technology',
    'Supply chain documentation reviewed and validated',
    'Risk assessment conducted using satellite monitoring',
    'Legal compliance verification performed',
    'Operator information system compliance confirmed',
    'Due diligence declaration statement finalized'
  ];
  
  requirements.forEach((requirement, index) => {
    const y = 250 + (index * 25);
    
    doc.rect(80, y + 2, 12, 12).fill('#38a169');
    doc.fontSize(10).fillColor('#ffffff').font('Helvetica-Bold').text('✓', 84, y + 5);
    doc.fontSize(10).fillColor('#2d3748').text(requirement, 100, y + 5);
  });
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Due Diligence`, 60, 770);

  // PAGE 6: Supply Chain Traceability
  pageCount++;
  console.log(`📄 PAGE ${pageCount}: Supply Chain Traceability - Simple Design`);
  doc.addPage();
  
  doc.rect(0, 0, 595, 100).fill('#ea580c');
  doc.fontSize(24).fillColor('#ffffff').font('Helvetica-Bold').text('SUPPLY CHAIN TRACEABILITY', 60, 30);
  
  doc.fontSize(18).fillColor('#2d3748').font('Helvetica-Bold').text('CERTIFICATE 6: SUPPLY CHAIN TRACEABILITY', 70, 150);
  doc.fontSize(12).fillColor('#4a5568').text('Complete supply chain traceability from farm to export', 70, 180);
  
  // Supply chain steps
  doc.fontSize(14).fillColor('#2d3748').text('Traceability Timeline:', 70, 220);
  
  const timeline = [
    { step: 'Harvest Initiated', date: '2025-08-01', location: farmerData.county },
    { step: 'Quality Control Check', date: '2025-08-05', location: 'Processing Facility' },
    { step: 'Storage & Documentation', date: '2025-08-10', location: 'Certified Warehouse' },
    { step: 'Pre-Export Inspection', date: '2025-08-15', location: 'Port Authority' },
    { step: 'Export Clearance', date: '2025-08-20', location: 'Monrovia Port' }
  ];
  
  timeline.forEach((event, index) => {
    const y = 250 + (index * 30);
    
    doc.circle(85, y + 10, 6).fill('#38a169');
    doc.fontSize(8).fillColor('#ffffff').text('✓', 82, y + 7);
    
    doc.fontSize(11).fillColor('#2d3748').font('Helvetica-Bold').text(event.step, 105, y + 5);
    doc.fontSize(9).fillColor('#6b7280').text(`${event.date} - ${event.location}`, 105, y + 17);
  });
  
  // Final verification
  doc.rect(70, 420, 450, 60).fill('#f0f9ff');
  doc.rect(70, 420, 450, 20).fill('#3182ce');
  doc.fontSize(12).fillColor('#ffffff').font('Helvetica-Bold').text('TRACEABILITY VERIFICATION COMPLETE', 85, 430);
  
  doc.fontSize(10).fillColor('#1e40af')
     .text('✓ Complete chain of custody documented', 85, 450)
     .text('✓ All stakeholders verified and certified', 85, 465)
     .text('✓ End-to-end traceability confirmed', 285, 450)
     .text('✓ Quality control at each stage verified', 285, 465);
  
  doc.rect(0, 750, 595, 50).fill('#2d3748');
  doc.fontSize(8).fillColor('#ffffff').text(`Page ${pageCount} of 6 | Supply Chain Traceability`, 60, 770);

  console.log(`✅ TEST CLEAN FINAL COMPLETE - Total pages generated: ${pageCount}`);
  console.log('🎯 Document should have exactly 6 pages with NO BLANK PAGES');
  
  return doc;
}