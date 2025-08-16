import PDFDocument from 'pdfkit';
import type { Express } from 'express';

export function addSimplePdfRoutes(app: Express) {
  // Simple PDF document download
  app.get('/api/eudr/simple-pdf/:packId/:documentType', async (req, res) => {
    try {
      const { packId, documentType } = req.params;
      
      // Create PDF document
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="EUDR_${documentType}_${packId}.pdf"`);
        res.send(pdfBuffer);
      });

      // Document header
      doc.fontSize(16).text('LACRA', 50, 50);
      doc.fontSize(10).text('Liberia Agriculture Commodity Regulatory Authority', 50, 70);
      doc.fontSize(8).text('In partnership with ECOENVIRO Audit & Certification', 50, 85);
      
      // Document title
      const titles: Record<string, string> = {
        'cover': 'EUDR COMPLIANCE PACK - COVER SHEET',
        'certificate': 'LACRA EXPORT ELIGIBILITY CERTIFICATE',
        'assessment': 'EUDR COMPLIANCE ASSESSMENT',
        'deforestation': 'DEFORESTATION ANALYSIS REPORT',
        'diligence': 'DUE DILIGENCE STATEMENT',
        'traceability': 'SUPPLY CHAIN TRACEABILITY REPORT'
      };
      
      doc.fontSize(14).text(titles[documentType] || 'EUDR DOCUMENT', 50, 120);
      
      // Content
      const currentDate = new Date().toLocaleDateString();
      let yPos = 160;
      
      doc.fontSize(10)
         .text(`Pack ID: ${packId}`, 50, yPos)
         .text(`Date: ${currentDate}`, 300, yPos);
      yPos += 25;
      
      doc.text('Farmer: Demo Farmer Name', 50, yPos);
      doc.text('Exporter: Demo Exporter Ltd.', 300, yPos);
      yPos += 20;
      
      doc.text('Commodity: Cocoa Beans', 50, yPos);
      doc.text('HS Code: 1801.00.00', 300, yPos);
      yPos += 25;
      
      // Document-specific content
      switch (documentType) {
        case 'cover':
          doc.text('STATUS: APPROVED', 50, yPos);
          doc.text('Compliance Score: 95/100', 50, yPos + 20);
          doc.text('This pack contains all required EUDR compliance documentation.', 50, yPos + 45);
          break;
        case 'certificate':
          doc.text('CERTIFICATION STATUS: ELIGIBLE FOR EXPORT', 50, yPos);
          doc.text('This commodity meets all LACRA export requirements.', 50, yPos + 20);
          break;
        case 'assessment':
          doc.text('Compliance Score: 95/100', 50, yPos);
          doc.text('Risk Classification: Low', 50, yPos + 20);
          doc.text('Deforestation Risk: None', 50, yPos + 40);
          doc.text('ASSESSMENT RESULT: COMPLIANT', 50, yPos + 60);
          break;
        case 'deforestation':
          doc.text('DEFORESTATION ANALYSIS RESULTS', 50, yPos);
          doc.text('Satellite monitoring shows no deforestation activity.', 50, yPos + 20);
          doc.text('Forest cover remains stable and protected.', 50, yPos + 40);
          break;
        case 'diligence':
          doc.text('DUE DILIGENCE CONFIRMATION', 50, yPos);
          doc.text('All due diligence procedures completed successfully.', 50, yPos + 20);
          doc.text('Documentation reviewed and verified by LACRA.', 50, yPos + 40);
          break;
        case 'traceability':
          doc.text('SUPPLY CHAIN TRACEABILITY CONFIRMED', 50, yPos);
          doc.text('Origin: Farmer Farm, Liberia', 50, yPos + 20);
          doc.text('Destination: European Union', 50, yPos + 40);
          break;
      }
      
      // Footer
      doc.fontSize(8)
         .text(`Generated: ${currentDate}`, 50, 750)
         .text(`Pack: ${packId}`, 200, 750)
         .text('compliance@lacra.gov.lr', 400, 750);
      
      doc.end();
      
    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
}