import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Mock data for crop schedules and listings
let cropSchedules: any[] = [
  {
    id: 1,
    scheduleId: 'SCH-001',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Cocoa',
    cropVariety: 'Trinitario',
    plotId: 'PLOT-001',
    plotName: 'North Plot',
    plantingArea: 2.5,
    plantingDate: '2024-01-15',
    expectedHarvestDate: '2024-06-15',
    actualHarvestDate: null,
    expectedYield: 1200,
    actualYield: null,
    status: 'ready_for_harvest',
    marketStatus: 'not_listed',
    qualityGrade: null,
    storageLocation: null,
    pricePerKg: null,
    buyerInterest: 3,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    scheduleId: 'SCH-002',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Coffee',
    cropVariety: 'Arabica',
    plotId: 'PLOT-002',
    plotName: 'South Plot',
    plantingArea: 1.8,
    plantingDate: '2024-02-01',
    expectedHarvestDate: '2024-07-01',
    actualHarvestDate: null,
    expectedYield: 900,
    actualYield: null,
    status: 'growing',
    marketStatus: 'not_listed',
    qualityGrade: null,
    storageLocation: null,
    pricePerKg: null,
    buyerInterest: 1,
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 3,
    scheduleId: 'SCH-003',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Palm Oil',
    cropVariety: 'Tenera',
    plotId: 'PLOT-003',
    plotName: 'West Plot',
    plantingArea: 3.2,
    plantingDate: '2024-03-01',
    expectedHarvestDate: '2024-09-01',
    actualHarvestDate: null,
    expectedYield: 2000,
    actualYield: null,
    status: 'planted',
    marketStatus: 'not_listed',
    qualityGrade: null,
    storageLocation: null,
    pricePerKg: null,
    buyerInterest: 0,
    createdAt: '2024-03-01T10:00:00Z'
  }
];

let cropListings: any[] = [
  {
    id: 1,
    listingId: 'LIST-001',
    scheduleId: 'SCH-001',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Cocoa',
    cropVariety: 'Trinitario',
    quantityAvailable: 1150,
    pricePerKg: 2.50,
    harvestDate: '2024-06-14',
    qualityGrade: 'Grade I',
    status: 'active',
    viewCount: 45,
    inquiryCount: 8,
    location: 'Bong County, Liberia',
    storageLocation: 'Main Farm Warehouse',
    createdAt: '2024-06-15T08:00:00Z'
  },
  {
    id: 2,
    listingId: 'LIST-002',
    scheduleId: 'SCH-004',
    farmerId: 'FARM-1755271600707-BQA7R4QFP',
    cropType: 'Coffee',
    cropVariety: 'Robusta',
    quantityAvailable: 800,
    pricePerKg: 3.20,
    harvestDate: '2024-05-20',
    qualityGrade: 'Premium',
    status: 'active',
    viewCount: 32,
    inquiryCount: 5,
    location: 'Bong County, Liberia',
    storageLocation: 'Drying Facility A',
    createdAt: '2024-05-21T09:00:00Z'
  }
];

// GET /api/farmers/:farmerId/crop-schedules
router.get('/farmers/:farmerId/crop-schedules', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const farmerSchedules = cropSchedules.filter(schedule => 
      schedule.farmerId === farmerId
    );
    
    console.log(`✅ Retrieved ${farmerSchedules.length} crop schedules for farmer ${farmerId}`);
    res.json(farmerSchedules);
  } catch (error) {
    console.error('❌ Error fetching crop schedules:', error);
    res.status(500).json({ error: 'Failed to fetch crop schedules' });
  }
});

// GET /api/farmers/:farmerId/crop-listings
router.get('/farmers/:farmerId/crop-listings', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    const farmerListings = cropListings.filter(listing => 
      listing.farmerId === farmerId
    );
    
    console.log(`✅ Retrieved ${farmerListings.length} crop listings for farmer ${farmerId}`);
    res.json(farmerListings);
  } catch (error) {
    console.error('❌ Error fetching crop listings:', error);
    res.status(500).json({ error: 'Failed to fetch crop listings' });
  }
});

// POST /api/farmers/crop-schedules
router.post('/farmers/crop-schedules', async (req, res) => {
  try {
    const {
      farmerId,
      cropType,
      cropVariety,
      plotId,
      plantingArea,
      plantingDate,
      expectedHarvestDate,
      expectedYield,
      status = 'planned'
    } = req.body;

    const newSchedule = {
      id: cropSchedules.length + 1,
      scheduleId: `SCH-${Date.now()}`,
      farmerId,
      cropType,
      cropVariety,
      plotId,
      plotName: `Plot ${plotId}`,
      plantingArea: parseFloat(plantingArea),
      plantingDate,
      expectedHarvestDate,
      actualHarvestDate: null,
      expectedYield: parseFloat(expectedYield),
      actualYield: null,
      status,
      marketStatus: 'not_listed',
      qualityGrade: null,
      storageLocation: null,
      pricePerKg: null,
      buyerInterest: 0,
      createdAt: new Date().toISOString()
    };

    cropSchedules.push(newSchedule);
    
    console.log(`✅ Created new crop schedule: ${newSchedule.scheduleId} for ${cropType}`);
    res.status(201).json(newSchedule);
  } catch (error) {
    console.error('❌ Error creating crop schedule:', error);
    res.status(500).json({ error: 'Failed to create crop schedule' });
  }
});

// POST /api/farmers/crop-listings
router.post('/farmers/crop-listings', async (req, res) => {
  try {
    const {
      farmerId,
      scheduleId,
      cropType,
      cropVariety,
      quantityAvailable,
      pricePerKg,
      qualityGrade,
      harvestDate,
      storageLocation,
      status = 'active'
    } = req.body;

    const newListing = {
      id: cropListings.length + 1,
      listingId: `LIST-${Date.now()}`,
      scheduleId,
      farmerId,
      cropType,
      cropVariety,
      quantityAvailable: parseFloat(quantityAvailable),
      pricePerKg: parseFloat(pricePerKg),
      harvestDate,
      qualityGrade,
      status,
      viewCount: 0,
      inquiryCount: 0,
      location: 'Bong County, Liberia', // Default location
      storageLocation,
      createdAt: new Date().toISOString()
    };

    cropListings.push(newListing);
    
    // Update the corresponding schedule's market status
    const scheduleIndex = cropSchedules.findIndex(s => s.id === scheduleId);
    if (scheduleIndex !== -1) {
      cropSchedules[scheduleIndex].marketStatus = 'listed';
    }
    
    console.log(`✅ Created new crop listing: ${newListing.listingId} for ${cropType}`);
    res.status(201).json(newListing);
  } catch (error) {
    console.error('❌ Error creating crop listing:', error);
    res.status(500).json({ error: 'Failed to create crop listing' });
  }
});

// PUT /api/farmers/crop-schedules/:scheduleId/harvest
router.put('/farmers/crop-schedules/:scheduleId/harvest', async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { actualYield, qualityGrade, harvestDate } = req.body;

    const scheduleIndex = cropSchedules.findIndex(s => s.id === parseInt(scheduleId));
    
    if (scheduleIndex === -1) {
      return res.status(404).json({ error: 'Crop schedule not found' });
    }

    cropSchedules[scheduleIndex] = {
      ...cropSchedules[scheduleIndex],
      actualYield: parseFloat(actualYield),
      qualityGrade,
      actualHarvestDate: harvestDate,
      status: 'harvested'
    };
    
    console.log(`✅ Marked crop schedule ${scheduleId} as harvested with ${actualYield}kg yield`);
    res.json(cropSchedules[scheduleIndex]);
  } catch (error) {
    console.error('❌ Error updating harvest status:', error);
    res.status(500).json({ error: 'Failed to update harvest status' });
  }
});

// GET /api/farmers/:farmerId/harvest-alerts
router.get('/farmers/:farmerId/harvest-alerts', async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Generate alerts for crops ready for harvest
    const farmerSchedules = cropSchedules.filter(s => s.farmerId === farmerId);
    const alerts = farmerSchedules
      .filter(s => s.status === 'ready_for_harvest')
      .map(schedule => ({
        id: schedule.id,
        type: 'harvest_ready',
        title: `${schedule.cropType} Ready for Harvest`,
        message: `Your ${schedule.cropType} (${schedule.cropVariety}) in ${schedule.plotName} is ready for harvest. Expected yield: ${schedule.expectedYield}kg`,
        priority: 'high',
        scheduleId: schedule.scheduleId,
        cropType: schedule.cropType,
        createdAt: new Date().toISOString()
      }));
    
    console.log(`✅ Generated ${alerts.length} harvest alerts for farmer ${farmerId}`);
    res.json(alerts);
  } catch (error) {
    console.error('❌ Error fetching harvest alerts:', error);
    res.status(500).json({ error: 'Failed to fetch harvest alerts' });
  }
});

export default router;