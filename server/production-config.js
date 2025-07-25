// Production configuration for AgriTrace360 LACRA deployment
// This file helps ensure proper deployment on custom domains

module.exports = {
  // Server configuration
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'production'
  },
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  
  // Security configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'agritrace360-production-secret',
    corsOrigins: [
      process.env.CUSTOM_DOMAIN,
      process.env.REPLIT_DEV_DOMAIN,
      'localhost:5000'
    ].filter(Boolean),
    enableHTTPS: process.env.NODE_ENV === 'production'
  },
  
  // Application features
  features: {
    enableWebSocket: true,
    enableFileUploads: true,
    enableGPSMapping: true,
    enableSatelliteIntegration: true
  }
};