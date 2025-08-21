import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Generate comprehensive process flow PDF
router.get('/generate-complete-process-flow-pdf', async (req, res) => {
  try {
    console.log('📄 GENERATING COMPLETE PROCESS FLOW PDF...');
    
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="AgriTrace360_Complete_Process_Flow.pdf"');

    // Pipe the PDF to response
    doc.pipe(res);

    // Title Page
    doc.fontSize(24).fillColor('#2563eb').text('AgriTrace360™ LACRA', { align: 'center' });
    doc.fontSize(20).fillColor('#1e40af').text('Complete Process Flow Documentation', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('#374151').text('End-to-End Agricultural Traceability System', { align: 'center' });
    doc.fontSize(14).fillColor('#6b7280').text('From Farm Registration to Export Documentation', { align: 'center' });
    doc.moveDown(1);
    
    // LACRA Logo placeholder
    doc.fontSize(12).fillColor('#059669').text('🌿 LIBERIA AGRICULTURE COMMODITY REGULATORY AUTHORITY', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#6b7280').text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, { align: 'center' });
    
    doc.addPage();

    // Table of Contents
    doc.fontSize(20).fillColor('#1f2937').text('TABLE OF CONTENTS');
    doc.moveDown(0.5);
    
    const tocItems = [
      '1. System Overview & Architecture',
      '2. User Registration & Portal Access',
      '3. Detailed User Responsibilities by Portal',
      '4. Land Mapping & EUDR Compliance',
      '5. Crop Scheduling & Harvest Management',
      '6. Warehouse Operations & QR System',
      '7. Buyer Marketplace & Transactions',
      '8. Exporter Integration & Negotiations',
      '9. Export Payment & Port Inspection',
      '10. Document Release & Certification',
      '11. Portal Responsibilities Matrix',
      '12. Complete 18-Point Integration Flow'
    ];

    tocItems.forEach((item, index) => {
      doc.fontSize(12).fillColor('#374151').text(item);
      doc.moveDown(0.3);
    });

    doc.addPage();

    // 1. System Overview
    doc.fontSize(18).fillColor('#1f2937').text('1. SYSTEM OVERVIEW & ARCHITECTURE');
    doc.moveDown(0.5);
    
    doc.fontSize(12).fillColor('#374151');
    doc.text('AgriTrace360™ is a comprehensive environmental intelligence ecosystem integrating 8 specialized portals for precise monitoring across agricultural sectors. The system leverages real-time satellite monitoring, GPS technology, blockchain traceability, and AI-powered analytics.');
    doc.moveDown(0.5);
    
    doc.fontSize(14).fillColor('#059669').text('Core System Components:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Multi-tier role-based authentication system');
    doc.text('• Real-time EUDR compliance monitoring');
    doc.text('• GPS-enhanced farmer registration');
    doc.text('• QR-based product traceability');
    doc.text('• Integrated payment processing');
    doc.text('• Automated stakeholder notifications');
    doc.text('• Export documentation workflow');
    doc.moveDown(0.8);

    // 2. User Registration & Portal Access
    doc.fontSize(18).fillColor('#1f2937').text('2. USER REGISTRATION & PORTAL ACCESS');
    doc.moveDown(0.5);

    const portals = [
      {
        name: 'FARMER PORTAL',
        color: '#059669',
        registration: 'GPS-enhanced registration with land verification',
        access: 'Crop scheduling, harvest management, marketplace access',
        restrictions: 'Cannot map new land plots (restricted to Land Inspectors)'
      },
      {
        name: 'LAND INSPECTOR PORTAL',
        color: '#dc2626',
        registration: 'Official LACRA inspector credentials required',
        access: 'Land mapping, EUDR compliance verification, export authorization',
        restrictions: 'Full access to mapping and compliance systems'
      },
      {
        name: 'WAREHOUSE INSPECTOR PORTAL',
        color: '#7c2d12',
        registration: 'Warehouse facility certification required',
        access: 'QR scanning, quality inspection, product registration',
        restrictions: '30-day storage limit monitoring'
      },
      {
        name: 'BUYER PORTAL',
        color: '#1d4ed8',
        registration: 'Commercial buyer verification and approval',
        access: 'Marketplace browsing, lot proposals, payment processing',
        restrictions: 'First-come-first-serve proposal system'
      },
      {
        name: 'EXPORTER PORTAL',
        color: '#7c3aed',
        registration: 'Export license and DDGOTS approval required',
        access: 'Marketplace connectivity, export documentation, payment processing',
        restrictions: '7-day payment window to buyers'
      },
      {
        name: 'DDGOTS REGULATORY PORTAL',
        color: '#be185d',
        registration: 'Government regulatory department access',
        access: 'Port inspector assignment, fee calculation, document approval',
        restrictions: 'Full regulatory oversight authority'
      },
      {
        name: 'DDG-AF AUDIT PORTAL',
        color: '#0891b2',
        registration: 'Audit department government access',
        access: 'Payment verification, audit trail monitoring',
        restrictions: 'Financial oversight and compliance tracking'
      },
      {
        name: 'PORT INSPECTOR PORTAL',
        color: '#ea580c',
        registration: 'Port authority certification required',
        access: 'Final quality checks, fumigation validation, export compliance',
        restrictions: 'Final export approval authority'
      }
    ];

    portals.forEach((portal, index) => {
      if (index > 0 && index % 2 === 0) doc.addPage();
      
      doc.fontSize(14).fillColor(portal.color).text(portal.name);
      doc.fontSize(11).fillColor('#374151');
      doc.text(`Registration: ${portal.registration}`);
      doc.text(`Access Level: ${portal.access}`);
      doc.text(`Restrictions: ${portal.restrictions}`);
      doc.moveDown(0.8);
    });

    doc.addPage();

    // 3. Detailed User Responsibilities by Portal
    doc.fontSize(18).fillColor('#1f2937').text('3. DETAILED USER RESPONSIBILITIES BY PORTAL');
    doc.moveDown(0.5);

    // Farmer Portal Responsibilities
    doc.fontSize(16).fillColor('#059669').text('FARMER PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);
    
    doc.fontSize(12).fillColor('#374151').text('Registration Requirements:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Valid government-issued ID');
    doc.text('• Land ownership or lease documentation');
    doc.text('• GPS coordinates of farming location');
    doc.text('• Contact information and banking details');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Daily Responsibilities:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Create and maintain crop planting schedules');
    doc.text('• Update crop growth progress regularly');
    doc.text('• Monitor weather and environmental conditions');
    doc.text('• Record farming activities and inputs used');
    doc.text('• Mark harvest completion when crops are ready');
    doc.text('• Respond to buyer inquiries and proposals');
    doc.text('• Maintain accurate farming records');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('System Interactions:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Access crop scheduling dashboard');
    doc.text('• View harvest schedules and marketplace');
    doc.text('• Receive notifications from inspectors and buyers');
    doc.text('• Cannot create new land mappings (restricted)');
    doc.text('• Must await automatic batch code generation');
    doc.moveDown(0.8);

    // Land Inspector Portal Responsibilities
    doc.fontSize(16).fillColor('#dc2626').text('LAND INSPECTOR PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);

    doc.fontSize(12).fillColor('#374151').text('Certification Requirements:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Official LACRA inspector certification');
    doc.text('• GPS and satellite monitoring training');
    doc.text('• EUDR compliance expertise');
    doc.text('• Environmental assessment qualifications');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Core Responsibilities:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Verify and map all farmer land boundaries');
    doc.text('• Conduct EUDR compliance assessments');
    doc.text('• Monitor satellite imagery for deforestation');
    doc.text('• Validate GPS coordinates and land use');
    doc.text('• Authorize export product transfers');
    doc.text('• Generate compliance certificates');
    doc.text('• Submit regulatory data to DDGOTS');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Authority Level:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Full land mapping system access');
    doc.text('• Export transfer authorization power');
    doc.text('• EUDR compliance certification authority');
    doc.text('• Direct DDGOTS regulatory submission');
    doc.moveDown(0.8);

    doc.addPage();

    // Warehouse Inspector Portal Responsibilities
    doc.fontSize(16).fillColor('#7c2d12').text('WAREHOUSE INSPECTOR PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);

    doc.fontSize(12).fillColor('#374151').text('Certification Requirements:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Warehouse facility inspection certification');
    doc.text('• Food safety and quality assessment training');
    doc.text('• QR code scanning system proficiency');
    doc.text('• Product grading and classification expertise');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Daily Operations:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Scan and verify QR codes on incoming products');
    doc.text('• Conduct comprehensive quality inspections');
    doc.text('• Verify quantity and weight measurements');
    doc.text('• Register products under batch codes');
    doc.text('• Monitor 30-day storage limit compliance');
    doc.text('• Generate buyer notifications for available lots');
    doc.text('• Maintain warehouse inventory records');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Quality Control Standards:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Grade products according to export standards');
    doc.text('• Assess moisture content and foreign matter');
    doc.text('• Verify traceability documentation completeness');
    doc.text('• Ensure proper storage conditions');
    doc.text('• Document any quality issues or discrepancies');
    doc.moveDown(0.8);

    // Buyer Portal Responsibilities
    doc.fontSize(16).fillColor('#1d4ed8').text('BUYER PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);

    doc.fontSize(12).fillColor('#374151').text('Registration Requirements:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Valid commercial business registration');
    doc.text('• Financial capability verification');
    doc.text('• Trade license and permits');
    doc.text('• Banking and payment processing setup');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Trading Responsibilities:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Browse available product lots in warehouse');
    doc.text('• Submit competitive purchase proposals');
    doc.text('• Negotiate terms with farmers and warehouses');
    doc.text('• Process payments within agreed timeframes');
    doc.text('• Create marketplace listings for exporters');
    doc.text('• Maintain product quality during ownership');
    doc.text('• Coordinate delivery and logistics');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Market Regulations:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Follow first-come-first-serve proposal system');
    doc.text('• Respect 30-day warehouse storage limits');
    doc.text('• Maintain transparent pricing practices');
    doc.text('• Comply with payment confirmation requirements');
    doc.moveDown(0.8);

    doc.addPage();

    // Exporter Portal Responsibilities
    doc.fontSize(16).fillColor('#7c3aed').text('EXPORTER PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);

    doc.fontSize(12).fillColor('#374151').text('License Requirements:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Valid export license from DDGOTS');
    doc.text('• International trade certification');
    doc.text('• Foreign exchange dealing authorization');
    doc.text('• Shipping and logistics partnerships');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Export Operations:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Review marketplace listings from buyers');
    doc.text('• Negotiate export terms and conditions');
    doc.text('• Accept or reject purchase proposals');
    doc.text('• Process payments to buyers within 7-day window');
    doc.text('• Coordinate product transfer to export warehouses');
    doc.text('• Pay processing fees to regulatory authorities');
    doc.text('• Download and manage export documentation');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Compliance Obligations:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Maintain EUDR compliance throughout export process');
    doc.text('• Ensure product traceability documentation');
    doc.text('• Coordinate with port inspection schedules');
    doc.text('• Pay all regulatory fees within deadlines');
    doc.text('• Maintain 30-day document download access');
    doc.moveDown(0.8);

    // DDGOTS Regulatory Portal Responsibilities
    doc.fontSize(16).fillColor('#be185d').text('DDGOTS REGULATORY PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);

    doc.fontSize(12).fillColor('#374151').text('Government Authority:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Official government regulatory department access');
    doc.text('• Export permit issuance authority');
    doc.text('• Port inspection oversight responsibility');
    doc.text('• Fee calculation and collection authority');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Regulatory Duties:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Assign certified Port Inspectors for final inspections');
    doc.text('• Review and verify inspection reports');
    doc.text('• Calculate applicable processing and export fees');
    doc.text('• Issue fee intimations to exporters');
    doc.text('• Approve final document release after payment');
    doc.text('• Maintain regulatory compliance database');
    doc.text('• Coordinate with international trade authorities');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Oversight Responsibilities:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Monitor entire export pipeline compliance');
    doc.text('• Ensure EUDR regulation adherence');
    doc.text('• Validate quality and safety standards');
    doc.text('• Coordinate with DDG-AF for financial oversight');
    doc.moveDown(0.8);

    doc.addPage();

    // DDG-AF Audit Portal Responsibilities
    doc.fontSize(16).fillColor('#0891b2').text('DDG-AF AUDIT PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);

    doc.fontSize(12).fillColor('#374151').text('Audit Authority:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Government audit department access');
    doc.text('• Financial transaction oversight authority');
    doc.text('• Payment verification responsibility');
    doc.text('• Audit trail maintenance duty');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Financial Oversight:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Monitor all exporter-to-buyer payments');
    doc.text('• Verify processing fee payments from exporters');
    doc.text('• Validate payment receipts and documentation');
    doc.text('• Maintain comprehensive audit trail records');
    doc.text('• Confirm payment authenticity before document release');
    doc.text('• Coordinate with DDGOTS for approval processes');
    doc.text('• Generate financial compliance reports');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Audit Procedures:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Review all payment confirmations within 24 hours');
    doc.text('• Cross-verify payment amounts with system records');
    doc.text('• Investigate any payment discrepancies');
    doc.text('• Provide payment confirmation to DDGOTS for approval');
    doc.moveDown(0.8);

    // Port Inspector Portal Responsibilities
    doc.fontSize(16).fillColor('#ea580c').text('PORT INSPECTOR PORTAL RESPONSIBILITIES');
    doc.moveDown(0.3);

    doc.fontSize(12).fillColor('#374151').text('Certification Requirements:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Port Authority inspection certification');
    doc.text('• International export standards training');
    doc.text('• Fumigation and pest control expertise');
    doc.text('• Quality assessment and grading proficiency');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Inspection Duties:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Conduct final quality checks at port facilities');
    doc.text('• Validate fumigation certificates and treatments');
    doc.text('• Verify export standard compliance');
    doc.text('• Assess product condition for international shipping');
    doc.text('• Generate comprehensive inspection reports');
    doc.text('• Submit findings to DDGOTS for verification');
    doc.text('• Approve or reject products for export');
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('#374151').text('Final Authority:');
    doc.fontSize(10).fillColor('#4b5563');
    doc.text('• Final quality approval for export shipments');
    doc.text('• Authority to reject non-compliant products');
    doc.text('• Responsibility for international quality standards');
    doc.text('• Direct communication with shipping authorities');
    doc.moveDown(0.8);

    doc.addPage();

    // 4. Land Mapping & EUDR Compliance
    doc.fontSize(18).fillColor('#1f2937').text('4. LAND MAPPING & EUDR COMPLIANCE');
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#dc2626').text('Land Inspector Responsibilities:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• GPS coordinate verification and mapping');
    doc.text('• Satellite deforestation monitoring');
    doc.text('• EUDR compliance documentation');
    doc.text('• Land use authorization and verification');
    doc.text('• Environmental impact assessment');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#059669').text('EUDR Compliance Process:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('1. Satellite imagery analysis for deforestation');
    doc.text('2. GPS boundary verification');
    doc.text('3. Environmental compliance certification');
    doc.text('4. Traceability data integration');
    doc.text('5. DDGOTS regulatory submission');
    doc.moveDown(0.8);

    // 5. Crop Scheduling & Harvest Management
    doc.fontSize(18).fillColor('#1f2937').text('5. CROP SCHEDULING & HARVEST MANAGEMENT');
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#059669').text('Farmer Portal Workflow:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Crop planting schedule creation');
    doc.text('• Growth monitoring and updates');
    doc.text('• Harvest completion marking');
    doc.text('• Automatic batch code generation');
    doc.text('• Stakeholder notification system');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#7c2d12').text('Automatic Batch Code Generation:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('When farmers mark crops as harvested:');
    doc.text('→ System automatically generates batch codes');
    doc.text('→ Notifies Land Inspector, Warehouse Inspector');
    doc.text('→ Alerts three-tier regulatory panels');
    doc.text('→ No manual farmer intervention required');
    doc.moveDown(0.8);

    doc.addPage();

    // 6. Warehouse Operations & QR System
    doc.fontSize(18).fillColor('#1f2937').text('6. WAREHOUSE OPERATIONS & QR SYSTEM');
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#7c2d12').text('Warehouse Inspector Process:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• QR code scanning and verification');
    doc.text('• Quality inspection and grading');
    doc.text('• Quantity verification and recording');
    doc.text('• Product registration under batch codes');
    doc.text('• 30-day storage limit monitoring');
    doc.text('• Buyer notification system');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#1d4ed8').text('Buyer Notification System:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Automatic alerts when products arrive');
    doc.text('• Quality and quantity details provided');
    doc.text('• First-come-first-serve lot proposal system');
    doc.text('• Real-time availability updates');
    doc.moveDown(0.8);

    // 7. Buyer Marketplace & Transactions
    doc.fontSize(18).fillColor('#1f2937').text('7. BUYER MARKETPLACE & TRANSACTIONS');
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#1d4ed8').text('Buyer Portal Functionality:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Browse available product lots');
    doc.text('• Submit purchase proposals');
    doc.text('• Negotiate terms and conditions');
    doc.text('• Process payments and confirmations');
    doc.text('• Create marketplace listings for exporters');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#7c3aed').text('Marketplace Listing Creation:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Product details and specifications');
    doc.text('• Pricing and payment terms');
    doc.text('• Export readiness status');
    doc.text('• Exporter connectivity features');
    doc.moveDown(0.8);

    doc.addPage();

    // 8. Exporter Integration & Negotiations
    doc.fontSize(18).fillColor('#1f2937').text('8. EXPORTER INTEGRATION & NEGOTIATIONS');
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#7c3aed').text('Exporter-Buyer Communication:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Call, SMS, or internal messaging system');
    doc.text('• Product discussion and review');
    doc.text('• Price and terms negotiation');
    doc.text('• Proposal acceptance or rejection');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#059669').text('Transaction Code Generation:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('Upon exporter proposal acceptance:');
    doc.text('→ Unique transaction code generated');
    doc.text('→ Details sent to Buyer Warehouse');
    doc.text('→ Regulatory DDGOTS notification');
    doc.text('→ Land Inspector authorization required');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#dc2626').text('Land Inspector Authorization:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Product transfer authorization');
    doc.text('• EUDR compliance verification');
    doc.text('• Export permit validation');
    doc.text('• Delivery code generation approval');
    doc.moveDown(0.8);

    // 9. Export Payment & Port Inspection
    doc.fontSize(18).fillColor('#1f2937').text('9. EXPORT PAYMENT & PORT INSPECTION');
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#7c3aed').text('7-Day Payment Window:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Exporter must pay buyer within 7 days');
    doc.text('• Both parties confirm payment');
    doc.text('• DDG-AF records for audit purposes');
    doc.text('• DDGOTS notified for port inspection');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#ea580c').text('Port Inspector Assignment:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• DDGOTS assigns certified Port Inspector');
    doc.text('• Inspection scheduling at port facilities');
    doc.text('• Permit request tracking system');
    doc.text('• Export compliance requirements');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#be185d').text('Final Quality Checks:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Comprehensive product quality assessment');
    doc.text('• Fumigation validation and certification');
    doc.text('• Export standard compliance verification');
    doc.text('• Inspection report generation');
    doc.moveDown(0.8);

    doc.addPage();

    // 10. Document Release & Certification
    doc.fontSize(18).fillColor('#1f2937').text('10. DOCUMENT RELEASE & CERTIFICATION');
    doc.moveDown(0.5);

    doc.fontSize(14).fillColor('#be185d').text('DDGOTS Verification & Fee Calculation:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Inspection report validation');
    doc.text('• Export compliance verification');
    doc.text('• Processing fee calculation');
    doc.text('• Fee intimation to exporter');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#0891b2').text('DDG-AF Payment Verification:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Processing fee payment confirmation');
    doc.text('• Receipt verification and validation');
    doc.text('• Audit trail documentation');
    doc.text('• Document release authorization');
    doc.moveDown(0.8);

    doc.fontSize(14).fillColor('#059669').text('Complete Export Document Package (7 Documents):');
    doc.fontSize(11).fillColor('#374151');
    doc.text('📄 1. Export Permit - Official government authorization');
    doc.text('🏆 2. Quality Certificate - Product quality verification');
    doc.text('🔬 3. Fumigation Certificate - Pest treatment validation');
    doc.text('🌍 4. EUDR Compliance Certificate - EU regulation compliance');
    doc.text('📍 5. Product Origin Certificate - Official origin verification');
    doc.text('📋 6. Traceability Documents - Complete farm-to-export tracking');
    doc.text('🔍 7. Inspection Report - Detailed port inspection findings');
    doc.moveDown(0.8);

    doc.fontSize(12).fillColor('#7c3aed').text('Dashboard Access: 30-day download window with full document access');

    doc.addPage();

    // 11. Portal Responsibilities Matrix
    doc.fontSize(18).fillColor('#1f2937').text('11. PORTAL RESPONSIBILITIES MATRIX');
    doc.moveDown(0.5);

    const responsibilities = [
      { portal: 'Farmer Portal', primary: 'Crop management', secondary: 'Harvest completion', restrictions: 'No land mapping' },
      { portal: 'Land Inspector', primary: 'Land mapping', secondary: 'EUDR compliance', restrictions: 'Export authorization' },
      { portal: 'Warehouse Inspector', primary: 'QR scanning', secondary: 'Quality inspection', restrictions: '30-day storage' },
      { portal: 'Buyer Portal', primary: 'Lot proposals', secondary: 'Payment processing', restrictions: 'First-come basis' },
      { portal: 'Exporter Portal', primary: 'Export negotiations', secondary: 'Document access', restrictions: '7-day payment' },
      { portal: 'DDGOTS Regulatory', primary: 'Port inspection', secondary: 'Fee calculation', restrictions: 'Full oversight' },
      { portal: 'DDG-AF Audit', primary: 'Payment verification', secondary: 'Audit tracking', restrictions: 'Financial oversight' },
      { portal: 'Port Inspector', primary: 'Final inspection', secondary: 'Export compliance', restrictions: 'Final approval' }
    ];

    responsibilities.forEach((resp, index) => {
      doc.fontSize(12).fillColor('#1f2937').text(`${resp.portal}:`);
      doc.fontSize(10).fillColor('#374151');
      doc.text(`  Primary: ${resp.primary}`);
      doc.text(`  Secondary: ${resp.secondary}`);
      doc.text(`  Key Role: ${resp.restrictions}`);
      doc.moveDown(0.5);
    });

    doc.addPage();

    // 12. Complete 18-Point Integration Flow
    doc.fontSize(18).fillColor('#1f2937').text('12. COMPLETE 18-POINT INTEGRATION FLOW');
    doc.moveDown(0.5);

    const integrationPoints = [
      '1. Land Inspector EUDR compliance data → DDGOTS',
      '2. Warehouse QR batch approval system',
      '3. Automatic harvest → buyer notifications',
      '4. First-come-first-serve lot proposal system',
      '5. Payment confirmation → DDG-AF audit routing',
      '6. Warehouse delivery registration with quality inspection',
      '7. Warehouse product registration (30-day storage limits)',
      '8. Buyer marketplace listing → exporter connectivity',
      '9. Exporter proposal response (accept/reject functionality)',
      '10. Land Inspector authorization → export transfers',
      '11. Buyer warehouse delivery code generation',
      '12. Exporter warehouse product receipt with QR verification',
      '13. Exporter payment to buyer (7-day window) → DDG-AF/DDGOTS',
      '14. Port Inspector assignment → quality checks/export compliance',
      '15. Port inspection → fumigation validation/export standards',
      '16. DDGOTS inspection verification → processing fee calculation',
      '17. Exporter processing fee payment → DDG-AF receipt verification',
      '18. DDG-AF payment confirmation → DDGOTS document release approval'
    ];

    integrationPoints.forEach((point, index) => {
      doc.fontSize(11).fillColor('#374151').text(point);
      doc.moveDown(0.3);
      
      if (index === 8 || index === 17) {
        doc.addPage();
      }
    });

    doc.moveDown(1);
    doc.fontSize(14).fillColor('#059669').text('System Benefits:');
    doc.fontSize(11).fillColor('#374151');
    doc.text('• Complete farm-to-export traceability');
    doc.text('• Automated stakeholder notifications');
    doc.text('• Real-time compliance monitoring');
    doc.text('• Integrated payment processing');
    doc.text('• Comprehensive audit trail');
    doc.text('• Multi-tier regulatory oversight');
    doc.text('• Export documentation automation');

    doc.addPage();

    // Footer with system information
    doc.fontSize(12).fillColor('#6b7280').text('System Technical Specifications:', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#9ca3af');
    doc.text('• Frontend: React (TypeScript) with Wouter routing', { align: 'center' });
    doc.text('• Backend: Node.js (Express.js) with TypeScript', { align: 'center' });
    doc.text('• Database: PostgreSQL with Drizzle ORM', { align: 'center' });
    doc.text('• Authentication: Multi-tier role-based system', { align: 'center' });
    doc.text('• Integration: Real-time satellite monitoring & GPS technology', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(8).fillColor('#6b7280').text('© 2025 LACRA - Liberia Agriculture Commodity Regulatory Authority', { align: 'center' });
    doc.text('AgriTrace360™ Environmental Intelligence Ecosystem', { align: 'center' });

    // Finalize the PDF
    doc.end();

    console.log('✅ COMPLETE PROCESS FLOW PDF GENERATED SUCCESSFULLY');

  } catch (error) {
    console.error('❌ Error generating process flow PDF:', error);
    res.status(500).json({ error: 'Failed to generate process flow PDF' });
  }
});

export default router;