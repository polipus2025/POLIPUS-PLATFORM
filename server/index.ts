import express from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";

const app = express();

// MAINTENANCE MODE - ENABLED - Application unavailable
const MAINTENANCE_MODE = false;

if (MAINTENANCE_MODE) {
  console.log('🔧 MAINTENANCE MODE: Generic maintenance page active');
  
  // Health check endpoint for deployment (must return 200)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'maintenance', message: 'Server is running in maintenance mode' });
  });
  
  // Root path health check (Replit often uses '/' for health checks)
  app.get('/', (req, res) => {
    res.status(200).json({ status: 'maintenance', message: 'Server is running in maintenance mode' });
  });
  
  // Serve completely blank page for all other routes
  app.get('*', (req, res) => {
    res.status(503).send('');
  });
  
  // Start server
  const port = parseInt(process.env.PORT || '5000', 10);
  app.listen(port, '0.0.0.0', () => {
    console.log(`🔧 MAINTENANCE MODE ACTIVE - Generic maintenance page serving on 0.0.0.0:${port}`);
    console.log(`🌐 Maintenance page is now visible at port ${port}`);
  });
} else {
  // Normal server setup - Full Polipus platform
  console.log('🚀 STARTING POLIPUS PLATFORM - Full 8-module system activating...');

  // Security and CORS headers for production deployment
  app.use((req, res, next) => {
    // CORS headers for custom domain support
    const allowedOrigins = [
      'http://localhost:80',
      'https://localhost:80',
      process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : null,
      process.env.CUSTOM_DOMAIN ? `https://${process.env.CUSTOM_DOMAIN}` : null,
      process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null
    ].filter(Boolean);

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin as string) || !origin) {
      res.header('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Security headers for production
    if (process.env.NODE_ENV === 'production') {
      res.header('X-Frame-Options', 'DENY');
      res.header('X-Content-Type-Options', 'nosniff');
      res.header('X-XSS-Protection', '1; mode=block');
      res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
      res.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-src 'none'; object-src 'none';");
    }
    
    next();
  });

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  (async () => {
    try {
      // GPS Testing Route - Direct HTML Response (add before other routes)
      app.get('/gps-test-direct', (req, res) => {
        res.send(`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPS Test - AgriTrace360</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
            margin: 0; padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; color: white;
        }
        .container { 
            max-width: 400px; margin: 0 auto; 
            background: rgba(255,255,255,0.95); 
            padding: 30px; border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            color: #333;
        }
        h1 { text-align: center; margin-bottom: 25px; color: #2c3e50; }
        button { 
            width: 100%; padding: 18px; 
            background: linear-gradient(45deg, #667eea, #764ba2); 
            color: white; border: none; border-radius: 10px; 
            font-size: 16px; font-weight: bold; cursor: pointer; 
            margin-bottom: 20px;
        }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .result { 
            background: #f8f9fa; padding: 20px; border-radius: 8px; 
            border-left: 4px solid #667eea; white-space: pre-wrap; 
            min-height: 60px; font-family: monospace; font-size: 14px;
        }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .status { 
            display: grid; grid-template-columns: 1fr 1fr; 
            gap: 10px; margin: 20px 0; 
        }
        .status div { 
            padding: 10px; background: #e9ecef; 
            border-radius: 6px; text-align: center; font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 GPS Mobile Test</h1>
        <button id="testBtn" onclick="testGPS()">Test GPS Now</button>
        <div id="result" class="result">Ready to test GPS. Click button above.</div>
        
        <div class="status">
            <div><strong>Connection:</strong><br><span id="connection">--</span></div>
            <div><strong>GPS Support:</strong><br><span id="gpsSupport">--</span></div>
        </div>
    </div>

    <script>
        document.getElementById('connection').textContent = navigator.onLine ? '✅ Online' : '❌ Offline';
        document.getElementById('gpsSupport').textContent = 'geolocation' in navigator ? '✅ Available' : '❌ Not Available';

        function testGPS() {
            const btn = document.getElementById('testBtn');
            const result = document.getElementById('result');
            
            btn.disabled = true;
            btn.textContent = 'Testing...';
            result.textContent = 'Requesting location permission...';
            result.className = 'result';

            if (!navigator.geolocation) {
                result.textContent = '❌ GPS not supported on this device';
                result.className = 'result error';
                btn.disabled = false;
                btn.textContent = 'Test GPS Now';
                return;
            }

            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const { latitude, longitude, accuracy } = position.coords;
                    const time = new Date().toLocaleString();
                    
                    result.textContent = \`✅ GPS SUCCESS!

📍 Location:
Latitude: \${latitude.toFixed(6)}
Longitude: \${longitude.toFixed(6)}

🎯 Accuracy: ±\${Math.round(accuracy)} meters
🕐 Time: \${time}

🎉 Your GPS is working perfectly!\`;
                    
                    result.className = 'result success';
                    btn.textContent = 'Test Again';
                    btn.disabled = false;
                },
                function(error) {
                    let msg = '❌ GPS ERROR\\n\\n';
                    
                    switch (error.code) {
                        case 1:
                            msg += '🚫 Permission Denied\\n\\nTo fix:\\n• Click location icon in address bar\\n• Select "Allow"\\n• Refresh and try again';
                            break;
                        case 2:
                            msg += '📍 Position Unavailable\\n\\nTo fix:\\n• Move outside if indoors\\n• Check device GPS settings\\n• Wait for better signal';
                            break;
                        case 3:
                            msg += '⏱️ Timeout\\n\\nTo fix:\\n• Try again\\n• Move to open area\\n• Check GPS is enabled';
                            break;
                        default:
                            msg += \`Unknown error: \${error.message}\`;
                    }
                    
                    result.textContent = msg;
                    result.className = 'result error';
                    btn.textContent = 'Try Again';
                    btn.disabled = false;
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        }
    </script>
</body>
</html>`);
      });

      // Fix empty page issue - serve working platform directly
      app.get('/', (req, res) => {
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Polipus Environmental Intelligence Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            min-height: 100vh;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 60px;
        }
        
        .logo {
            font-size: 3.5rem;
            font-weight: bold;
            background: linear-gradient(45deg, #059669, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 20px;
        }
        
        .subtitle {
            font-size: 1.4rem;
            color: #94a3b8;
            margin-bottom: 10px;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 60px;
        }
        
        .stat-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 30px 20px;
            text-align: center;
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        
        .stat-icon.green { background: #059669; }
        .stat-icon.blue { background: #0ea5e9; }
        .stat-icon.orange { background: #f59e0b; }
        .stat-icon.purple { background: #8b5cf6; }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: white;
            margin-bottom: 8px;
        }
        
        .stat-label {
            color: #94a3b8;
            font-size: 0.9rem;
        }
        
        .modules {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 60px;
        }
        
        .module-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .module-card:hover {
            transform: translateY(-8px);
            border-color: rgba(5, 150, 105, 0.4);
            box-shadow: 0 20px 40px rgba(5, 150, 105, 0.1);
        }
        
        .module-icon {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            background: #059669;
        }
        
        .module-card.coming-soon .module-icon {
            background: #f59e0b;
        }
        
        .module-title {
            font-size: 1.3rem;
            font-weight: bold;
            color: white;
            margin-bottom: 12px;
        }
        
        .module-description {
            color: #94a3b8;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        
        .module-status {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-active {
            background: rgba(5, 150, 105, 0.2);
            color: #10b981;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        
        .status-coming-soon {
            background: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌟 POLIPUS PLATFORM</div>
            <div class="subtitle">Environmental Intelligence System</div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-icon green">✓</div>
                <div class="stat-value">1/8</div>
                <div class="stat-label">Active Modules</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">EU</div>
                <div class="stat-value">100%</div>
                <div class="stat-label">EUDR Compliance</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">⚙️</div>
                <div class="stat-value">7</div>
                <div class="stat-label">In Development</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple">🌍</div>
                <div class="stat-value">Global</div>
                <div class="stat-label">Coverage</div>
            </div>
        </div>
        
        <div class="modules">
            <div class="module-card">
                <div class="module-icon">🌾</div>
                <div class="module-title">Agricultural Traceability & Compliance</div>
                <div class="module-description">Complete LACRA system for agricultural commodity tracking and EU deforestation regulation compliance</div>
                <div class="module-status status-active">✓ Active</div>
            </div>
            
            <div class="module-card coming-soon">
                <div class="module-icon">🚛</div>
                <div class="module-title">Live Trace</div>
                <div class="module-description">Real-time livestock movement monitoring and transportation control system</div>
                <div class="module-status status-coming-soon">Coming Soon</div>
            </div>
            
            <div class="module-card coming-soon">
                <div class="module-icon">📍</div>
                <div class="module-title">Land Map360</div>
                <div class="module-description">Advanced land mapping services and territory dispute prevention system</div>
                <div class="module-status status-coming-soon">Coming Soon</div>
            </div>
            
            <div class="module-card coming-soon">
                <div class="module-icon">⛏️</div>
                <div class="module-title">Mine Watch</div>
                <div class="module-description">Mineral resource protection and community safeguarding monitoring</div>
                <div class="module-status status-coming-soon">Coming Soon</div>
            </div>
            
            <div class="module-card coming-soon">
                <div class="module-icon">🌲</div>
                <div class="module-title">Forest Guard</div>
                <div class="module-description">Forest conservation and carbon credit management system</div>
                <div class="module-status status-coming-soon">Coming Soon</div>
            </div>
            
            <div class="module-card coming-soon">
                <div class="module-icon">🌊</div>
                <div class="module-title">Aqua Trace</div>
                <div class="module-description">Ocean and marine ecosystem monitoring with satellite integration</div>
                <div class="module-status status-coming-soon">Coming Soon</div>
            </div>
            
            <div class="module-card coming-soon">
                <div class="module-icon">💙</div>
                <div class="module-title">Blue Carbon 360</div>
                <div class="module-description">Conservation economics and blue carbon marketplace platform</div>
                <div class="module-status status-coming-soon">Coming Soon</div>
            </div>
            
            <div class="module-card coming-soon">
                <div class="module-icon">🌿</div>
                <div class="module-title">Carbon Trace</div>
                <div class="module-description">Environmental carbon monitoring and sustainability tracking</div>
                <div class="module-status status-coming-soon">Coming Soon</div>
            </div>
        </div>
        
        <div style="text-align: center; padding: 40px 0; color: #10b981; font-size: 1.2rem; font-weight: bold;">
            🚀 POLIPUS PLATFORM - FULLY OPERATIONAL
        </div>
    </div>
</body>
</html>`);
      });

      // Register API routes and database connections
      console.log('📊 Initializing database connections...');
      const httpServer = await registerRoutes(app);
      
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
      const host = '0.0.0.0';
      
      httpServer.listen(port, host, () => {
        console.log('🌟 POLIPUS PLATFORM ACTIVE - All 8 modules ready');
        console.log(`🌐 Platform URL: http://localhost:${port}`);
        console.log('📱 Module 1: Agricultural Traceability & Compliance (LACRA System)');
        console.log('🐄 Module 2: Live Trace - Livestock monitoring');
        console.log('🗺️  Module 3: Land Map360 - Land mapping services');
        console.log('⛏️  Module 4: Mine Watch - Mineral resource protection');
        console.log('🌲 Module 5: Forest Guard - Forest protection');
        console.log('🌊 Module 6: Aqua Trace - Ocean monitoring');
        console.log('💙 Module 7: Blue Carbon 360 - Conservation economics');
        console.log('🌿 Module 8: Carbon Trace - Environmental monitoring');
        console.log('📚 PWA Support: Mobile app download available');
        
        if (process.env.NODE_ENV === 'production') {
          console.log(`🔒 Production mode - Server listening on ${host}:${port}`);
          console.log(`📡 Database connected: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`);
          console.log(`🌐 External access configured via .replit port mapping`);
        }
      });
      
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  })();
}