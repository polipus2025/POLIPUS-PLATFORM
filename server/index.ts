import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed-database";
import path from "path";
import fs from "fs";

const app = express();

// MAINTENANCE MODE - ENABLED - Red maintenance page active
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

// CLEAN MAINTENANCE ROUTE - Serve red maintenance page
app.get('/', (req, res) => {
  console.log('[MAINTENANCE] Loading red maintenance page');
  res.sendFile('maintenance.html', { root: '.' });
});

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

  // Clean setup - no Vite in maintenance mode
  if (!MAINTENANCE_MODE && app.get("env") === "development") {
    await setupVite(app, server);
  } else {
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
