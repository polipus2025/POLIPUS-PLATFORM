import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed-database";
import path from "path";
import fs from "fs";

const app = express();

// MAINTENANCE MODE - ENABLED - Generic maintenance page active
const MAINTENANCE_MODE = true;

// IMMEDIATE MAINTENANCE CHECK - Block normal execution if in maintenance mode
if (MAINTENANCE_MODE) {
  console.log('🔧 MAINTENANCE MODE: Generic maintenance page active');
  
  // Maintenance page for ALL routes
  app.use('*', (req, res) => {
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
  
  // Start server in maintenance mode immediately
  const port = parseInt(process.env.PORT || '5000', 10);
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🔧 MAINTENANCE MODE ACTIVE - Generic maintenance page serving on 0.0.0.0:${port}`);
    console.log(`🌐 Visit: http://localhost:${port}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔧 Maintenance mode server shutting down...');
    server.close();
  });
  
  // Exit early - don't run normal server setup
  process.exit(0);
}

// Normal server setup continues below (only runs when MAINTENANCE_MODE = false)

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

(async () => {
  // Seed the database with initial data
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
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
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