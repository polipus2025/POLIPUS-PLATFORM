import { Express } from 'express';
import { generateProfessionalEUDRCertificate } from './professional-eudr-generator';

export function addProfessionalEudrRoutes(app: Express) {
  console.log('📄 Adding Professional EUDR certificate routes...');

  // Professional EUDR Certificate endpoint
  app.post('/api/professional-eudr-certificate', async (req, res) => {
    try {
      console.log('🎖️ Generating Professional EUDR Certificate...');
      
      const { farmerData, mappingData, packId } = req.body;
      
      if (!farmerData || !mappingData || !packId) {
        return res.status(400).json({ error: 'Missing required data' });
      }
      
      // Generate the professional certificate (now async)
      const doc = await generateProfessionalEUDRCertificate(farmerData, mappingData, packId);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Professional_EUDR_Certificate_${packId}.pdf"`);
      
      doc.pipe(res);
      doc.end();
      
      console.log('✅ Professional EUDR Certificate generated successfully');
      
    } catch (error) {
      console.error('❌ Professional EUDR certificate generation failed:', error);
      res.status(500).json({ error: 'Certificate generation failed' });
    }
  });
}