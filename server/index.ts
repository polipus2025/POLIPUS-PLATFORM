import express from "express";
import { registerRoutes } from "./routes";
import { log } from "./vite";

const app = express();

// MAINTENANCE MODE - ENABLED - Red maintenance page active
const MAINTENANCE_MODE = true;

if (MAINTENANCE_MODE) {
  console.log('🔧 MAINTENANCE MODE: Generic maintenance page active');
  
  // Serve maintenance page for all routes
  app.use('*', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Maintenance</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          h1 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
            line-height: 1.6;
          }
          .progress-container {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            padding: 8px;
            margin: 30px 0;
          }
          .progress-bar {
            height: 8px;
            background: linear-gradient(90deg, #ffffff 0%, #f1f5f9 100%);
            border-radius: 8px;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scaleX(0.8); }
            50% { opacity: 1; transform: scaleX(1); }
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
          }
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          .footer {
            margin-top: 40px;
            font-size: 0.9rem;
            opacity: 0.7;
          }
        </style>
        <script>
          // Auto-refresh every 30 seconds
          setTimeout(() => window.location.reload(), 30000);
        </script>
      </head>
      <body>
        <div class="container">
          <div class="icon">🔧</div>
          <h1>Website Maintenance</h1>
          <p>We're currently performing scheduled maintenance to improve your experience. The site will be back online shortly.</p>
          <div class="progress-container">
            <div class="progress-bar"></div>
          </div>
          <p>Thank you for your patience.</p>
          <div class="footer">
            <p>Page will automatically refresh in 30 seconds</p>
          </div>
        </div>
      </body>
      </html>
    `);
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