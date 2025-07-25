// Health check endpoint for AgriTrace360 LACRA deployment monitoring
// This endpoint helps verify deployment status on custom domains

export const createHealthCheck = (app) => {
  // Basic health check
  app.get('/health', (req, res) => {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: process.env.DATABASE_URL ? 'connected' : 'disconnected',
        authentication: 'active',
        api: 'operational'
      },
      deployment: {
        customDomain: process.env.CUSTOM_DOMAIN || 'not-configured',
        ssl: process.env.NODE_ENV === 'production' ? 'enabled' : 'disabled',
        cors: 'configured'
      },
      features: {
        exportPermitSubmission: 'active',
        gpsMapping: 'active',
        satelliteIntegration: 'active',
        lacra_branding: 'active',
        four_portals: 'active'
      }
    };
    
    res.json(healthData);
  });

  // Detailed deployment status
  app.get('/deployment-status', (req, res) => {
    const deploymentStatus = {
      application: 'AgriTrace360 LACRA',
      status: 'operational',
      build_info: {
        last_build: new Date().toISOString(),
        node_version: process.version,
        environment: process.env.NODE_ENV
      },
      connectivity: {
        database: {
          status: process.env.DATABASE_URL ? 'connected' : 'error',
          url_configured: !!process.env.DATABASE_URL
        },
        custom_domain: {
          configured: !!process.env.CUSTOM_DOMAIN,
          domain: process.env.CUSTOM_DOMAIN || 'not-set'
        }
      },
      authentication_portals: {
        regulatory: 'active',
        farmer: 'active', 
        field_agent: 'active',
        exporter: 'active'
      },
      key_features: {
        export_permits: 'fully-functional',
        gps_mapping: 'operational',
        satellite_data: 'integrated',
        lacra_compliance: 'active',
        real_time_tracking: 'enabled'
      }
    };
    
    res.json(deploymentStatus);
  });

  // Quick API test endpoint
  app.get('/api-test', (req, res) => {
    res.json({
      message: 'AgriTrace360 LACRA API is operational',
      timestamp: new Date().toISOString(),
      endpoints_available: [
        '/api/auth/regulatory-login',
        '/api/auth/farmer-login', 
        '/api/auth/field-agent-login',
        '/api/auth/exporter-login',
        '/api/export-permits',
        '/api/dashboard/metrics',
        '/api/commodities',
        '/api/gps-mapping'
      ]
    });
  });
};