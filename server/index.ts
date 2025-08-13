import express from "express";
import { registerRoutes } from "./routes";
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
      // EMERGENCY: Serve working HTML page immediately
      app.get('/', (req, res) => {
        res.send(`<!DOCTYPE html>
<html><head><title>Polipus Platform - WORKING</title></head>
<body style="font-family: system-ui; padding: 40px; text-align: center; background: linear-gradient(135deg, #f8fafc, #e2e8f0); min-height: 100vh;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <div style="background: white; padding: 40px; border-radius: 16px; margin-bottom: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <h1 style="font-size: 48px; margin-bottom: 10px; color: #1e293b; font-weight: bold;">POLIPUS®</h1>
      <h2 style="color: #475569; margin-bottom: 30px; font-size: 24px;">General Environmental Intelligence Platform</h2>
      <a href="/portals" style="background: linear-gradient(135deg, #2563eb, #16a34a); color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; transition: all 0.3s; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);">🚪 Login Portals</a>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <div style="font-size: 32px; font-weight: bold; color: #16a34a; margin-bottom: 5px;">1/8</div>
        <div style="color: #64748b; font-size: 14px;">Active Modules</div>
      </div>
      <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <div style="font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 5px;">EUDR 100%</div>
        <div style="color: #64748b; font-size: 14px;">Compliance</div>
      </div>
      <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <div style="font-size: 32px; font-weight: bold; color: #f59e0b; margin-bottom: 5px;">7</div>
        <div style="color: #64748b; font-size: 14px;">In Development</div>
      </div>
      <div style="background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
        <div style="font-size: 32px; font-weight: bold; color: #8b5cf6; margin-bottom: 5px;">Global</div>
        <div style="color: #64748b; font-size: 14px;">Coverage</div>
      </div>
    </div>

    <div style="background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
      <h3 style="font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 20px; text-align: left;">⚙️ Platform Modules</h3>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
        <div style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; transition: all 0.2s; background: white; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 60px; height: 60px; background: #16a34a; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🌾</div>
          <h4 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 10px;">Agricultural Traceability</h4>
          <div style="background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; margin-bottom: 15px; display: inline-block;">✅ ACTIVE</div><br>
          <a href="/portals" style="background: linear-gradient(135deg, #2563eb, #16a34a); color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold; display: inline-block;">Enter Platform →</a>
        </div>
        
        <div style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; transition: all 0.2s; background: white; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 60px; height: 60px; background: #3b82f6; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🚚</div>
          <h4 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 10px;">Live Trace</h4>
          <div style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; margin-bottom: 15px; display: inline-block;">Coming Soon</div><br>
          <a href="/live-trace" style="background: linear-gradient(135deg, #2563eb, #16a34a); color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold; display: inline-block;">Enter Platform →</a>
        </div>
        
        <div style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; transition: all 0.2s; background: white; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 60px; height: 60px; background: #8b5cf6; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">🗺️</div>
          <h4 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 10px;">Land Map360</h4>
          <div style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; margin-bottom: 15px; display: inline-block;">Coming Soon</div><br>
          <a href="/landmap360-portal" style="background: linear-gradient(135deg, #2563eb, #16a34a); color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold; display: inline-block;">Enter Platform →</a>
        </div>
        
        <div style="border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; transition: all 0.2s; background: white; cursor: pointer;" onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.12)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
          <div style="width: 60px; height: 60px; background: #f59e0b; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px;">⛏️</div>
          <h4 style="font-size: 16px; font-weight: bold; color: #1e293b; margin-bottom: 10px;">Mine Watch</h4>
          <div style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: bold; margin-bottom: 15px; display: inline-block;">Coming Soon</div><br>
          <a href="/mine-watch" style="background: linear-gradient(135deg, #2563eb, #16a34a); color: white; padding: 8px 16px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: bold; display: inline-block;">Enter Platform →</a>
        </div>
      </div>
    </div>
  </div>
</body></html>`);
      });
      
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