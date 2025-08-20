import express from 'express';
import { shippingService } from './shipping-integrations';

const router = express.Router();

// Track shipment endpoint
router.post('/api/shipping/track', async (req, res) => {
  try {
    const { carrier, trackingNumber, type } = req.body;

    if (!carrier || !trackingNumber) {
      return res.status(400).json({
        error: 'Missing required fields: carrier and trackingNumber'
      });
    }

    const shipmentStatus = await shippingService.trackShipment({
      carrier,
      trackingNumber,
      type: type || 'container'
    });

    if (!shipmentStatus) {
      return res.status(404).json({
        error: 'Shipment not found or tracking failed'
      });
    }

    res.json({
      success: true,
      data: shipmentStatus
    });

  } catch (error: any) {
    console.error('Tracking error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Multi-carrier tracking endpoint
router.post('/api/shipping/track-multi', async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        error: 'Missing required field: trackingNumber'
      });
    }

    const results = await shippingService.trackMultiCarrier(trackingNumber);

    res.json({
      success: true,
      data: {
        trackingNumber,
        carriers: results.length,
        results
      }
    });

  } catch (error: any) {
    console.error('Multi-carrier tracking error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get schedules endpoint
router.post('/api/shipping/schedules', async (req, res) => {
  try {
    const { origin, destination, departureDate } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        error: 'Missing required fields: origin and destination'
      });
    }

    const schedules = await shippingService.getSchedules({
      origin,
      destination,
      departureDate
    });

    res.json({
      success: true,
      data: {
        route: `${origin} → ${destination}`,
        schedules: schedules.length,
        results: schedules
      }
    });

  } catch (error: any) {
    console.error('Schedule fetch error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
router.get('/api/shipping/health', async (req, res) => {
  try {
    const health = await shippingService.healthCheck();
    
    const totalAPIs = Object.keys(health).length;
    const healthyAPIs = Object.values(health).filter(Boolean).length;
    
    res.json({
      success: true,
      overall: healthyAPIs === totalAPIs ? 'healthy' : 'partial',
      apis: health,
      summary: `${healthyAPIs}/${totalAPIs} APIs operational`
    });

  } catch (error: any) {
    console.error('Health check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get supported carriers
router.get('/api/shipping/carriers', (req, res) => {
  const carriers = [
    {
      id: 'maersk',
      name: 'A.P. Moller-Maersk',
      description: 'World largest container shipping company',
      services: ['Container Tracking', 'Booking Management', 'Schedules', 'Invoicing'],
      api_portal: 'https://developer.maersk.com/',
      status: 'active'
    },
    {
      id: 'msc',
      name: 'Mediterranean Shipping Company',
      description: 'Second largest container shipping line',
      services: ['Track & Trace', 'Commercial Schedules', 'Point-to-Point Routing'],
      api_portal: 'https://developerportal.msc.com/',
      status: 'active'
    },
    {
      id: 'cma-cgm',
      name: 'CMA CGM Group',
      description: 'French container transportation and shipping company',
      services: ['Container Tracking', 'Booking Management', 'Documentation', 'Rate Management'],
      api_portal: 'https://api-portal.cma-cgm.com/',
      status: 'active'
    },
    {
      id: 'hapag-lloyd',
      name: 'Hapag-Lloyd AG',
      description: 'German transportation company',
      services: ['Live Position Tracking', 'Standard Tracking', 'Route & Schedule APIs'],
      api_portal: 'https://api-portal.hlag.com/',
      status: 'active'
    }
  ];

  res.json({
    success: true,
    data: {
      total: carriers.length,
      carriers
    }
  });
});

// API status and configuration info
router.get('/api/shipping/config', (req, res) => {
  const config = {
    endpoints: {
      track_single: 'POST /api/shipping/track',
      track_multi: 'POST /api/shipping/track-multi',
      schedules: 'POST /api/shipping/schedules',
      health: 'GET /api/shipping/health',
      carriers: 'GET /api/shipping/carriers'
    },
    supported_carriers: ['maersk', 'msc', 'cma-cgm', 'hapag-lloyd'],
    tracking_types: ['container', 'booking', 'bill-of-lading'],
    features: [
      'Real-time container tracking',
      'Multi-carrier comparison',
      'Vessel information',
      'Route schedules',
      'ETA predictions',
      'Event history'
    ],
    requirements: {
      api_keys: 'Required for each carrier',
      authentication: 'Bearer token for each API',
      rate_limits: 'Varies by carrier and subscription'
    }
  };

  res.json({
    success: true,
    data: config
  });
});

export default router;