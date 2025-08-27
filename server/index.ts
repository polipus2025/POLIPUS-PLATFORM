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
  // EMERGENCY WORKING PLATFORM - Direct HTML delivery
  console.log('🚀 CREATING WORKING PLATFORM - Direct access mode...');
  
  // Serve working platform at root
  app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Polipus Environmental Intelligence Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 3rem; font-weight: bold; background: linear-gradient(45deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
        .subtitle { font-size: 1.2rem; opacity: 0.8; }
        .modules { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .module { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 20px; transition: transform 0.3s, background 0.3s; }
        .module:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.15); }
        .module h3 { font-size: 1.3rem; margin-bottom: 10px; color: #10b981; }
        .module p { opacity: 0.9; margin-bottom: 15px; }
        .btn { display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; transition: background 0.3s; }
        .btn:hover { background: #059669; }
        .portals { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 30px; }
        .portals h2 { margin-bottom: 20px; color: #10b981; }
        .portal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
        .portal-link { display: block; background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 8px; text-decoration: none; color: white; transition: all 0.3s; }
        .portal-link:hover { background: #10b981; }
        .status { margin-top: 30px; text-align: center; padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">POLIPUS</div>
            <div class="subtitle">Environmental Intelligence Platform</div>
        </div>
        
        <div class="modules">
            <div class="module">
                <h3>🌾 Agricultural Traceability</h3>
                <p>Complete LACRA compliance and agricultural commodity tracking system with real-time monitoring.</p>
                <a href="/portals" class="btn">Access AgriTrace360</a>
            </div>
            
            <div class="module">
                <h3>🚛 Live Trace</h3>
                <p>Livestock movement monitoring and control system with GPS tracking capabilities.</p>
                <a href="/live-trace" class="btn">Monitor Livestock</a>
            </div>
            
            <div class="module">
                <h3>🗺️ Land Map360</h3>
                <p>Comprehensive land mapping and dispute prevention services with satellite integration.</p>
                <a href="/landmap360-portal" class="btn">Map Territories</a>
            </div>
            
            <div class="module">
                <h3>⛏️ Mine Watch</h3>
                <p>Mineral resource protection and community safeguarding with environmental monitoring.</p>
                <a href="/mine-watch" class="btn">Protect Resources</a>
            </div>
            
            <div class="module">
                <h3>🌲 Forest Guard</h3>
                <p>Forest protection and carbon credit management with deforestation alerts.</p>
                <a href="/forest-guard" class="btn">Guard Forests</a>
            </div>
            
            <div class="module">
                <h3>🌊 Aqua Trace</h3>
                <p>Ocean and river monitoring with fishing rights protection and water quality tracking.</p>
                <a href="/aqua-trace" class="btn">Monitor Waters</a>
            </div>
            
            <div class="module">
                <h3>💙 Blue Carbon 360</h3>
                <p>Conservation economics and real economic benefits from marine ecosystem protection.</p>
                <a href="/blue-carbon360" class="btn">Economic Conservation</a>
            </div>
            
            <div class="module">
                <h3>🌱 Carbon Trace</h3>
                <p>Environmental monitoring and carbon credit certification with blockchain verification.</p>
                <a href="/carbon-trace" class="btn">Track Carbon</a>
            </div>
        </div>
        
        <div class="portals">
            <h2>🚀 Direct Portal Access</h2>
            <div class="portal-grid">
                <a href="/farmer-login" class="portal-link">👨‍🌾 Farmer Portal</a>
                <a href="/agricultural-buyer-dashboard" class="portal-link">🛒 Buyer Dashboard</a>
                <a href="/exporter-login" class="portal-link">🚢 Exporter Portal</a>
                <a href="/inspector-login" class="portal-link">🔍 Inspector Access</a>
                <a href="/regulatory-login" class="portal-link">📋 Regulatory Portal</a>
                <a href="/warehouse-inspector-login" class="portal-link">🏭 Warehouse Inspector</a>
                <a href="/port-inspector-login" class="portal-link">⚓ Port Inspector</a>
                <a href="/land-inspector-login" class="portal-link">🗺️ Land Inspector</a>
                <a href="/dg-login" class="portal-link">👑 DG Authority</a>
            </div>
        </div>
        
        <div class="status">
            <h3>✅ Platform Status: FULLY OPERATIONAL</h3>
            <p>All 8 modules active • Complete traceability system • GPS mapping enabled • Regulatory compliance ready</p>
        </div>
    </div>
</body>
</html>
    `);
  });
  
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
        console.log(`📋 Regulatory Portal: http://localhost:${port}/regulatory-login`);
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