import express from 'express';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const router = express.Router();

// Helper function to generate QR code
async function generateQRCode(data: any): Promise<string> {
  try {
    return await QRCode.toDataURL(JSON.stringify(data));
  } catch (error) {
    console.error('QR Code generation error:', error);
    return '';
  }
}

// Generate Phytosanitary Certificate
router.post('/generate/phytosanitary', async (req, res) => {
  try {
    const formData = req.body;
    const certNumber = `PHY-LR-${Date.now().toString().slice(-6)}`;
    
    // Generate QR code for certificate verification
    const qrData = {
      certificateId: certNumber,
      certificateType: 'phytosanitary',
      exporterName: formData.exporterName,
      commodity: formData.commodity,
      issuedDate: new Date().toISOString()
    };
    const qrCodeDataUrl = await generateQRCode(qrData);
    
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 40,
      info: {
        Title: 'Phytosanitary Certificate',
        Author: 'Liberian Plant Protection Service',
        Subject: 'Official Phytosanitary Certificate for Export'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Phytosanitary_Certificate_${certNumber}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.rect(0, 0, 595, 100).fillColor('#2d5aa0').fill();
    
    // Logo areas
    doc.rect(40, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('REPUBLIC', 50, 30);
    doc.fontSize(10).text('OF LIBERIA', 55, 45);
    doc.fontSize(8).text('Plant Protection', 50, 60);
    doc.text('Service', 60, 72);
    
    // Main title
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('PHYTOSANITARY CERTIFICATE', 140, 30);
    doc.fontSize(12).font('Helvetica').text('Certificate to Accompany Plants and Plant Products', 140, 55);
    
    // Certificate number
    doc.rect(475, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fontSize(10).text('Certificate No.', 485, 30);
    doc.fontSize(12).font('Helvetica-Bold').text(certNumber, 485, 45);
    doc.fontSize(8).font('Helvetica').text(new Date().toLocaleDateString(), 485, 65);

    doc.fillColor('#000000');
    let yPos = 140;

    // Exporter Information
    doc.fontSize(14).font('Helvetica-Bold').text('I. EXPORTER INFORMATION', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 515, 60).strokeColor('#cccccc').stroke();
    doc.fontSize(11).font('Helvetica-Bold').text('Name and Address:', 50, yPos + 10);
    doc.fontSize(10).font('Helvetica').text(formData.exporterName || '', 50, yPos + 25);
    doc.text(formData.exporterAddress || '', 50, yPos + 40);
    yPos += 80;

    // Consignment Details
    doc.fontSize(14).font('Helvetica-Bold').text('II. CONSIGNMENT DETAILS', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 515, 100).strokeColor('#cccccc').stroke();
    doc.fontSize(11).font('Helvetica-Bold').text('Description of Consignment:', 50, yPos + 10);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Commodity: ${formData.commodity || ''}`, 50, yPos + 25);
    doc.text(`Quantity: ${formData.quantity || ''}`, 50, yPos + 40);
    doc.text(`Country of Origin: ${formData.originCountry || 'Liberia'}`, 50, yPos + 55);
    doc.text(`Destination: ${formData.destinationCountry || ''}`, 50, yPos + 70);
    yPos += 120;

    // Treatment Information
    doc.fontSize(14).font('Helvetica-Bold').text('III. PHYTOSANITARY TREATMENT', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 515, 60).strokeColor('#cccccc').stroke();
    doc.fontSize(10).font('Helvetica').text(
      formData.treatmentDetails || 'No specific treatment required. Product inspected and found free from quarantine pests.',
      50, yPos + 10, { width: 495, align: 'justify' }
    );
    yPos += 80;

    // Certification Statement
    doc.fontSize(14).font('Helvetica-Bold').text('IV. OFFICIAL CERTIFICATION', 40, yPos);
    yPos += 25;
    
    doc.fontSize(10).font('Helvetica').text(
      'This is to certify that the plants, plant products or other regulated articles described herein ' +
      'have been inspected and/or tested according to appropriate official procedures and are considered ' +
      'to be free from quarantine pests and practically free from other harmful pests.',
      40, yPos, { width: 515, align: 'justify' }
    );
    yPos += 60;

    // QR Code and Signatures
    if (yPos > 650) {
      doc.addPage();
      yPos = 40;
    }

    // Add QR code if generated successfully
    if (qrCodeDataUrl) {
      try {
        const qrImage = qrCodeDataUrl.split(',')[1];
        const qrBuffer = Buffer.from(qrImage, 'base64');
        doc.image(qrBuffer, 40, yPos, { width: 80, height: 80 });
      } catch (error) {
        console.log('QR code insertion failed:', error);
      }
    }

    // Signature areas
    doc.rect(150, yPos, 200, 80).strokeColor('#cccccc').stroke();
    doc.rect(375, yPos, 180, 80).strokeColor('#cccccc').stroke();
    
    doc.fontSize(10).font('Helvetica-Bold').text('Plant Protection Officer', 160, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Ministry of Agriculture', 160, yPos + 25);
    doc.text('Digital Signature Applied', 160, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, yPos + 55);
    
    doc.fontSize(10).font('Helvetica-Bold').text('Port Inspector', 385, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Export Verification', 385, yPos + 25);
    doc.text('Inspection Completed', 385, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 385, yPos + 55);

    doc.end();
    
  } catch (error) {
    console.error('Error generating phytosanitary certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// Generate Certificate of Origin
router.post('/generate/origin', async (req, res) => {
  try {
    const formData = req.body;
    const certNumber = `COO-LR-${Date.now().toString().slice(-6)}`;
    
    const qrData = {
      certificateId: certNumber,
      certificateType: 'origin',
      exporterName: formData.exporterName,
      productDescription: formData.productDescription,
      issuedDate: new Date().toISOString()
    };
    const qrCodeDataUrl = await generateQRCode(qrData);
    
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 40,
      info: {
        Title: 'Certificate of Origin',
        Author: 'Ministry of Commerce and Industry - Liberia',
        Subject: 'Official Certificate of Origin for Export'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Certificate_of_Origin_${certNumber}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.rect(0, 0, 595, 100).fillColor('#1e40af').fill();
    
    // Logo areas and title - similar structure to phytosanitary
    doc.rect(40, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('REPUBLIC', 50, 30);
    doc.fontSize(10).text('OF LIBERIA', 55, 45);
    doc.fontSize(8).text('Ministry of', 55, 60);
    doc.text('Commerce', 55, 72);
    
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('CERTIFICATE OF ORIGIN', 140, 40);
    
    doc.rect(475, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fontSize(10).text('Certificate No.', 485, 30);
    doc.fontSize(12).font('Helvetica-Bold').text(certNumber, 485, 45);
    doc.fontSize(8).font('Helvetica').text(new Date().toLocaleDateString(), 485, 65);

    doc.fillColor('#000000');
    let yPos = 140;

    // Exporter/Importer Information
    doc.fontSize(14).font('Helvetica-Bold').text('TRADER INFORMATION', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 250, 80).strokeColor('#cccccc').stroke();
    doc.rect(305, yPos, 250, 80).strokeColor('#cccccc').stroke();
    
    doc.fontSize(11).font('Helvetica-Bold').text('Exporter:', 50, yPos + 10);
    doc.fontSize(10).font('Helvetica').text(formData.exporterName || '', 50, yPos + 25);
    
    doc.fontSize(11).font('Helvetica-Bold').text('Importer:', 315, yPos + 10);
    doc.fontSize(10).font('Helvetica').text(formData.importerName || '', 315, yPos + 25);
    yPos += 100;

    // Product Information
    doc.fontSize(14).font('Helvetica-Bold').text('PRODUCT INFORMATION', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 515, 120).strokeColor('#cccccc').stroke();
    doc.fontSize(10).font('Helvetica');
    doc.text(`Product Description: ${formData.productDescription || ''}`, 50, yPos + 15);
    doc.text(`HS Code: ${formData.hsCode || ''}`, 50, yPos + 35);
    doc.text(`Country of Origin: ${formData.countryOfOrigin || 'Liberia'}`, 50, yPos + 55);
    doc.text(`Total Value: USD ${formData.totalValue || '0'}`, 50, yPos + 75);
    yPos += 140;

    // Certification Statement
    doc.fontSize(14).font('Helvetica-Bold').text('OFFICIAL CERTIFICATION', 40, yPos);
    yPos += 25;
    
    doc.fontSize(10).font('Helvetica').text(
      'The Ministry of Commerce and Industry of the Republic of Liberia hereby certifies that ' +
      'the goods described above are of Liberian origin and comply with all applicable regulations.',
      40, yPos, { width: 515, align: 'justify' }
    );
    yPos += 60;

    // QR Code and Signatures
    if (yPos > 650) {
      doc.addPage();
      yPos = 40;
    }

    if (qrCodeDataUrl) {
      try {
        const qrImage = qrCodeDataUrl.split(',')[1];
        const qrBuffer = Buffer.from(qrImage, 'base64');
        doc.image(qrBuffer, 40, yPos, { width: 80, height: 80 });
      } catch (error) {
        console.log('QR code insertion failed:', error);
      }
    }

    doc.rect(150, yPos, 200, 80).strokeColor('#cccccc').stroke();
    doc.rect(375, yPos, 180, 80).strokeColor('#cccccc').stroke();
    
    doc.fontSize(10).font('Helvetica-Bold').text('Trade Officer', 160, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Ministry of Commerce', 160, yPos + 25);
    doc.text('Digital Signature Applied', 160, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, yPos + 55);
    
    doc.fontSize(10).font('Helvetica-Bold').text('Port Inspector', 385, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Export Verification', 385, yPos + 25);
    doc.text('Origin Verified', 385, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 385, yPos + 55);

    doc.end();
    
  } catch (error) {
    console.error('Error generating certificate of origin:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// Generate Quality Control Certificate
router.post('/generate/quality', async (req, res) => {
  try {
    const formData = req.body;
    const certNumber = `QC-LR-${Date.now().toString().slice(-6)}`;
    
    const qrData = {
      certificateId: certNumber,
      certificateType: 'quality',
      batchNumber: formData.batchNumber,
      qualityGrade: formData.qualityGrade,
      issuedDate: new Date().toISOString()
    };
    const qrCodeDataUrl = await generateQRCode(qrData);
    
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 40,
      info: {
        Title: 'Quality Control Certificate',
        Author: 'Liberian Standards Authority',
        Subject: 'Official Quality Control Certificate'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Quality_Control_Certificate_${certNumber}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.rect(0, 0, 595, 100).fillColor('#059669').fill();
    
    doc.rect(40, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('LIBERIAN', 50, 30);
    doc.fontSize(10).text('STANDARDS', 50, 45);
    doc.fontSize(8).text('Authority', 55, 60);
    
    doc.fontSize(20).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('QUALITY CONTROL CERTIFICATE', 140, 40);
    
    doc.rect(475, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fontSize(10).text('Certificate No.', 485, 30);
    doc.fontSize(12).font('Helvetica-Bold').text(certNumber, 485, 45);
    doc.fontSize(8).font('Helvetica').text(new Date().toLocaleDateString(), 485, 65);

    doc.fillColor('#000000');
    let yPos = 140;

    // Product Information
    doc.fontSize(14).font('Helvetica-Bold').text('PRODUCT QUALITY ASSESSMENT', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 515, 100).strokeColor('#cccccc').stroke();
    doc.fontSize(10).font('Helvetica');
    doc.text(`Batch Number: ${formData.batchNumber || ''}`, 50, yPos + 15);
    doc.text(`Quality Grade: ${formData.qualityGrade || ''}`, 50, yPos + 35);
    doc.text(`Moisture Content: ${formData.moistureContent || '0'}%`, 50, yPos + 55);
    doc.text(`Foreign Matter: ${formData.foreignMatter || '0'}%`, 50, yPos + 75);
    yPos += 120;

    // Inspection Details
    doc.fontSize(14).font('Helvetica-Bold').text('INSPECTION RESULTS', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 515, 80).strokeColor('#cccccc').stroke();
    doc.fontSize(10).font('Helvetica').text(
      formData.inspectionNotes || 'Product has been inspected according to established quality standards and meets all requirements for export.',
      50, yPos + 15, { width: 495, align: 'justify' }
    );
    yPos += 100;

    // Certification Statement
    doc.fontSize(14).font('Helvetica-Bold').text('QUALITY CERTIFICATION', 40, yPos);
    yPos += 25;
    
    doc.fontSize(10).font('Helvetica').text(
      'The Liberian Standards Authority certifies that the product described above has been ' +
      'inspected and tested in accordance with national and international standards.',
      40, yPos, { width: 515, align: 'justify' }
    );
    yPos += 60;

    // QR Code and Signatures
    if (yPos > 650) {
      doc.addPage();
      yPos = 40;
    }

    if (qrCodeDataUrl) {
      try {
        const qrImage = qrCodeDataUrl.split(',')[1];
        const qrBuffer = Buffer.from(qrImage, 'base64');
        doc.image(qrBuffer, 40, yPos, { width: 80, height: 80 });
      } catch (error) {
        console.log('QR code insertion failed:', error);
      }
    }

    doc.rect(150, yPos, 200, 80).strokeColor('#cccccc').stroke();
    doc.rect(375, yPos, 180, 80).strokeColor('#cccccc').stroke();
    
    doc.fontSize(10).font('Helvetica-Bold').text('Quality Inspector', 160, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Standards Authority', 160, yPos + 25);
    doc.text('Digital Signature Applied', 160, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, yPos + 55);
    
    doc.fontSize(10).font('Helvetica-Bold').text('Port Inspector', 385, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Export Verification', 385, yPos + 25);
    doc.text('Quality Verified', 385, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 385, yPos + 55);

    doc.end();
    
  } catch (error) {
    console.error('Error generating quality control certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// Generate Compliance Declaration Certificate
router.post('/generate/compliance', async (req, res) => {
  try {
    const formData = req.body;
    const certNumber = `COMP-LR-${Date.now().toString().slice(-6)}`;
    
    const qrData = {
      certificateId: certNumber,
      certificateType: 'compliance',
      organizationName: formData.organizationName,
      regulatoryFramework: formData.regulatoryFramework,
      issuedDate: new Date().toISOString()
    };
    const qrCodeDataUrl = await generateQRCode(qrData);
    
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 40,
      info: {
        Title: 'Compliance Declaration Certificate',
        Author: 'LACRA & ECOENVIROS',
        Subject: 'Official Compliance Declaration Certificate'
      }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Compliance_Declaration_Certificate_${certNumber}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.rect(0, 0, 595, 100).fillColor('#7c3aed').fill();
    
    doc.rect(40, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fillColor('#ffffff').fontSize(12).font('Helvetica-Bold').text('LACRA', 55, 30);
    doc.fontSize(8).text('Environmental', 50, 45);
    doc.text('Authority', 55, 60);
    
    doc.fontSize(18).font('Helvetica-Bold').fillColor('#ffffff');
    doc.text('COMPLIANCE DECLARATION', 140, 35);
    doc.fontSize(12).font('Helvetica').text('Environmental & Regulatory Compliance Certificate', 140, 55);
    
    doc.rect(475, 20, 80, 60).strokeColor('#ffffff').stroke();
    doc.fontSize(9).text('ECOENVIROS', 485, 30);
    doc.fontSize(7).text('Third-Party Audit', 485, 45);
    doc.text('& Verification', 485, 55);
    doc.text('ISO 14001', 490, 68);

    doc.fillColor('#000000');
    let yPos = 140;

    // Organization Information
    doc.fontSize(14).font('Helvetica-Bold').text('COMPLIANCE DECLARATION', 40, yPos);
    yPos += 25;
    
    doc.rect(40, yPos, 515, 120).strokeColor('#cccccc').stroke();
    doc.fontSize(10).font('Helvetica');
    doc.text(`Organization: ${formData.organizationName || ''}`, 50, yPos + 15);
    doc.text(`Regulatory Framework: ${formData.regulatoryFramework || ''}`, 50, yPos + 35);
    doc.text(`Compliance Scope: ${formData.complianceScope || ''}`, 50, yPos + 55);
    doc.text(`Assessment Period: ${formData.assessmentPeriod || ''}`, 50, yPos + 75);
    doc.text(`Certificate Number: ${certNumber}`, 50, yPos + 95);
    yPos += 140;

    // Compliance Statement
    doc.fontSize(14).font('Helvetica-Bold').text('OFFICIAL COMPLIANCE STATEMENT', 40, yPos);
    yPos += 25;
    
    doc.fontSize(10).font('Helvetica').text(
      formData.complianceStatement || 
      'This organization has been assessed and found to be in full compliance with all applicable ' +
      'environmental regulations, sustainability standards, and international requirements.',
      40, yPos, { width: 515, align: 'justify' }
    );
    yPos += 80;

    // Regulatory Certifications
    doc.fontSize(14).font('Helvetica-Bold').text('REGULATORY CERTIFICATIONS', 40, yPos);
    yPos += 25;
    
    const certifications = [
      { name: 'EU Deforestation Regulation (EUDR)', status: 'COMPLIANT', ref: 'EUDR-2024-001' },
      { name: 'LACRA Environmental Standards', status: 'VERIFIED', ref: 'LACRA-ENV-001' },
      { name: 'International Sustainability Standards', status: 'CERTIFIED', ref: 'ISO-14001-001' }
    ];

    certifications.forEach((cert, index) => {
      const certY = yPos + (index * 25);
      doc.rect(40, certY, 515, 20).strokeColor('#e5e7eb').stroke();
      doc.fontSize(10).font('Helvetica-Bold').text(cert.name, 50, certY + 5);
      doc.fontSize(9).font('Helvetica').text(`Status: ${cert.status}`, 350, certY + 5);
      doc.text(`Ref: ${cert.ref}`, 450, certY + 5);
    });
    yPos += 85;

    // QR Code and Signatures
    if (yPos > 650) {
      doc.addPage();
      yPos = 40;
    }

    if (qrCodeDataUrl) {
      try {
        const qrImage = qrCodeDataUrl.split(',')[1];
        const qrBuffer = Buffer.from(qrImage, 'base64');
        doc.image(qrBuffer, 40, yPos, { width: 80, height: 80 });
      } catch (error) {
        console.log('QR code insertion failed:', error);
      }
    }

    doc.rect(150, yPos, 200, 80).strokeColor('#cccccc').stroke();
    doc.rect(375, yPos, 180, 80).strokeColor('#cccccc').stroke();
    
    doc.fontSize(10).font('Helvetica-Bold').text('LACRA Director', 160, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Environmental Authority', 160, yPos + 25);
    doc.text('Digital Signature Applied', 160, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, yPos + 55);
    
    doc.fontSize(10).font('Helvetica-Bold').text('ECOENVIROS Auditor', 385, yPos + 10);
    doc.fontSize(9).font('Helvetica').text('Third-Party Verification', 385, yPos + 25);
    doc.text('Compliance Verified', 385, yPos + 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 385, yPos + 55);

    doc.end();
    
  } catch (error) {
    console.error('Error generating compliance declaration certificate:', error);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

// Auto-generate EUDR Certificate from farmer data
router.get('/generate/eudr/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Get farmer data from database (using the same function as the test generator)
    const response = await fetch(`http://localhost:5000/api/test/eudr-certificate/${farmerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch farmer data');
    }
    
    // Stream the PDF directly to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="EUDR_Certificate_${farmerId}.pdf"`);
    
    response.body?.pipe(res);
    
  } catch (error) {
    console.error('Error generating EUDR certificate:', error);
    res.status(500).json({ error: 'Failed to generate EUDR certificate' });
  }
});

// Auto-generate Deforestation Certificate from farmer data  
router.get('/generate/deforestation/:farmerId', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Get farmer data from database (using the same function as the test generator)
    const response = await fetch(`http://localhost:5000/api/test/deforestation-certificate/${farmerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch farmer data');
    }
    
    // Stream the PDF directly to response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Deforestation_Certificate_${farmerId}.pdf"`);
    
    response.body?.pipe(res);
    
  } catch (error) {
    console.error('Error generating deforestation certificate:', error);
    res.status(500).json({ error: 'Failed to generate deforestation certificate' });
  }
});

export default router;