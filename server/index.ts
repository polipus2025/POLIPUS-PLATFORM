import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed-database";
import path from "path";
import fs from "fs";

const app = express();

// MAINTENANCE MODE - ENABLED - Generic maintenance page active
const MAINTENANCE_MODE = true;

// Direct maintenance page route for testing  
app.get('/maintenance-test', (req, res) => {
  try {
    const htmlPath = path.join(process.cwd(), 'maintenance.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error serving test maintenance page:', error);
    res.status(503).send('<h1>Test Maintenance Page Error</h1>');
  }
});

// Simple test route
app.get('/test-red', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>Test Red Page</title></head>
    <body style="background: red; color: white; padding: 20px; font-family: Arial;">
      <h1>🔴 RED TEST PAGE</h1>
      <p>If you can see this, the server is working!</p>
      <p>Time: ${new Date().toISOString()}</p>
      <a href="/" style="color: yellow;">Back to Home</a>
    </body>
    </html>
  `);
});

// MAINTENANCE ROUTE DISABLED - Let React app handle root route
// (Maintenance mode can be restored by uncommenting this route and setting MAINTENANCE_MODE = true)

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
    res.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));



// Polipus maintenance page routes (direct HTML serving, bypassing Vite)
app.get('/polipus-maintenance', (req, res) => {
  try {
    const htmlContent = fs.readFileSync('./polipus-maintenance.html', 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error serving Polipus maintenance page:', error);
    res.status(404).send('Polipus maintenance page not found');
  }
});

app.get('/maintenance-polipus', (req, res) => {
  try {
    const htmlContent = fs.readFileSync('./polipus-maintenance.html', 'utf8');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.send(htmlContent);
  } catch (error) {
    console.error('Error serving Polipus maintenance page:', error);
    res.status(404).send('Polipus maintenance page not found');
  }
});



app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Serve mobile QR code page directly


// Add mobile app routes
app.get('/mobile-app-preview', (req, res) => {
  res.sendFile('mobile-app-preview.html', { root: '.' });
});

app.get('/mobile-app-preview-direct', (req, res) => {
  res.sendFile('mobile-app-preview.html', { root: '.' });
});



app.get('/mobile-qr-working', (req, res) => {
  res.sendFile('mobile-qr-working.html', { root: '.' });
});

app.get('/mobile-app-links', (req, res) => {
  res.sendFile('mobile-app-links.html', { root: '.' });
});

app.get('/soluzione-mobile', (req, res) => {
  res.sendFile('soluzione-mobile.html', { root: '.' });
});

app.get('/mobile-access', (req, res) => {
  res.sendFile('mobile-access.html', { root: '.' });
});





(async () => {
  if (MAINTENANCE_MODE) {
    // MAINTENANCE MODE - Serve generic maintenance page for all routes
    app.get('*', (req, res) => {
      const maintenanceHTML = `
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
      `;
      
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(maintenanceHTML);
    });
    
    // Start server in maintenance mode
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = '0.0.0.0';
    
    app.listen(port, host, () => {
      log(`🔧 MAINTENANCE MODE ACTIVE - Generic maintenance page serving on ${host}:${port}`);
    });
    
    return; // Exit early, don't continue with normal setup
  }

  // Normal mode - proceed with setup
  try {
    await seedDatabase();
  } catch (error) {
    log("Database seeding skipped (likely already seeded)");
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup serving based on environment
  if (!MAINTENANCE_MODE && process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else if (!MAINTENANCE_MODE) {
    // Production mode - serve built client files
    try {
      serveStatic(app);
    } catch (error: any) {
      log(`⚠️  Static serving failed, using fallback: ${error.message}`, "express");
      // Production fallback - serve from client directory
      const clientIndexPath = path.join(process.cwd(), 'client', 'index.html');
      app.use(express.static(path.join(process.cwd(), 'client')));
      app.use("*", (_req, res) => {
        if (fs.existsSync(clientIndexPath)) {
          res.sendFile(clientIndexPath);
        } else {
          // Ultimate fallback - inline HTML with React
          res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Polipus Environmental Platform</title>
              <link rel="stylesheet" href="/src/index.css">
            </head>
            <body>
              <div id="root">Loading Polipus Platform...</div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
            </html>
          `);
        }
      });
    }
  } else {
    // Maintenance mode - serve static files only
    app.use(express.static('.'));
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  
  // Production configuration for custom domains
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '0.0.0.0';
  
  server.listen({
    port,
    host,
    reusePort: true,
  }, () => {
    log(`🌱 AgriTrace360 LACRA serving on ${host}:${port}`);
    if (process.env.NODE_ENV === 'production') {
      log(`🔒 Production mode - Custom domain ready`);
      log(`📡 Database connected: ${process.env.DATABASE_URL ? 'YES' : 'NO'}`);
    }
  });
})();
