import express from "express";
import { registerRoutes } from "./routes";
import { registerEudrRoutes } from "./eudr-compliance";
import { log } from "./vite";

const app = express();

// MAINTENANCE MODE - DISABLED - Full platform accessible
const MAINTENANCE_MODE = false;

if (MAINTENANCE_MODE) {
  console.log('🔧 MAINTENANCE MODE: Generic maintenance page active');
  
  // Serve completely empty page for all routes
  app.use('*', (req, res) => {
    res.send('');
  });
  
  // Start server
  const port = parseInt(process.env.PORT || '5000', 10);
  app.listen(port, '0.0.0.0', () => {
    console.log(`🔧 MAINTENANCE MODE ACTIVE - Generic maintenance page serving on 0.0.0.0:${port}`);
    console.log(`🌐 Maintenance page is now visible at port ${port}`);
  });
} else {
  // Optimized server setup
  console.log('🚀 STARTING POLIPUS PLATFORM - Optimized for performance...');


  // Minimal CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

  // Optimized body parsing middleware
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: false, limit: '5mb' }));

  (async () => {
    try {
      // Minimal GPS test route for performance
      app.get('/gps-test-direct', (req, res) => {
        res.send(`<!DOCTYPE html><html><head><title>GPS Test</title></head><body><h1>GPS Test</h1><button onclick="navigator.geolocation?.getCurrentPosition(p=>alert('GPS: '+p.coords.latitude+','+p.coords.longitude))">Test GPS</button></body></html>`);
      });

      // Initialize core system quickly
      const httpServer = await registerRoutes(app);
      
      // 🔒 PERMANENT FIX: Emergency payment confirmation routes (LOCKED - NO CHANGES)
      const { registerPaymentConfirmationFix } = await import('./payment-confirmation-fix');
      registerPaymentConfirmationFix(app);
      console.log('🔒 PAYMENT CONFIRMATION WORKFLOW LOCKED - All counties supported');
      
      registerEudrRoutes(app);
      const { registerSimpleEudrRoutes } = await import('./eudr-simple-routes');
      registerSimpleEudrRoutes(app);
      
      // Setup Vite for development or serve static files for production
      if (process.env.NODE_ENV === 'production') {
        console.log('🏭 Production mode - serving static files...');
        const express = await import('express');
        const path = await import('path');
        const fs = await import('fs');
        
        const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
        
        if (fs.existsSync(distPath)) {
          app.use(express.default.static(distPath));
          app.use("*", (_req, res) => {
            res.sendFile(path.resolve(distPath, "index.html"));
          });
        } else {
          console.log('⚠️ Build files not found, falling back to development mode');
          const { setupVite } = await import('./vite');
          await setupVite(app, httpServer);
        }
      } else {
        console.log('⚡ Development mode - setting up Vite server...');
        const { setupVite } = await import('./vite');
        await setupVite(app, httpServer);
      }
      
      // Start the server
      const port = parseInt(process.env.PORT || '5000', 10);
      const host = process.env.HOST || '0.0.0.0';
      
      httpServer.listen(port, host, () => {
        console.log(`🚀 POLIPUS READY: http://localhost:${port}`);
        console.log(`🌐 PLATFORM ACCESS URLs:`);
        console.log(`👨‍🌾 Farmer Portal: http://localhost:${port}/farmer-login`);
        console.log(`🛒 Buyer Portal: http://localhost:${port}/agricultural-buyer-dashboard`);
        console.log(`🚢 Exporter Portal: http://localhost:${port}/exporter-login`);
        console.log(`🔍 Inspector Portal: http://localhost:${port}/inspector-login`);
        console.log(`🏢 Office & Administration Portal: http://localhost:${port}/regulatory-login`);
        console.log(`🏭 Warehouse Inspector: http://localhost:${port}/warehouse-inspector-login`);
        console.log(`⚓ Port Inspector: http://localhost:${port}/port-inspector-login`);
        console.log(`🗺️ Land Inspector: http://localhost:${port}/land-inspector-login`);
        console.log(`👑 DG Authority: http://localhost:${port}/dg-login`);
        console.log(`🌍 ALL PORTALS READY - Your platform is fully operational!`);
      });
      
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  })();
}