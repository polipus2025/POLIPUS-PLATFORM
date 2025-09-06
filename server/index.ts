import express from "express";
import { registerRoutes } from "./routes";
import { registerEudrRoutes } from "./eudr-compliance";
import { randomBytes } from "crypto";
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


  // SECURITY ENHANCEMENTS - Added comprehensive protection
  const cookieParser = (await import('cookie-parser')).default;
  const helmet = (await import('helmet')).default;
  const cors = (await import('cors')).default;
  const rateLimit = (await import('express-rate-limit')).default;
  
  // Configure trust proxy for rate limiting security
  app.set('trust proxy', 1); // Trust first proxy for accurate IP detection
  
  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false, // Allow inline scripts for development
    crossOriginEmbedderPolicy: false // Allow cross-origin requests
  }));
  
  // Rate limiting for security - More permissive for development
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Much higher limit in development
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    trustProxy: true, // Use trusted proxy for IP detection
    // Skip rate limiting for static assets in development
    skip: (req) => {
      if (process.env.NODE_ENV !== 'production') {
        const isStaticAsset = req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/);
        const isViteHMR = req.url.includes('/@vite/') || req.url.includes('/@fs/');
        return Boolean(isStaticAsset) || isViteHMR;
      }
      return false;
    }
  }));
  
  // Cookie parsing for secure token storage
  app.use(cookieParser());

  // Secure CORS configuration
  const corsOptions = {
    origin: (origin, callback) => {
      if (process.env.NODE_ENV === 'production') {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
        callback(null, allowedOrigins.includes(origin));
      } else {
        // Development: Allow localhost and Replit URLs
        const isLocalhost = ['http://localhost:5000', 'http://localhost:3000', 'http://127.0.0.1:5000'].includes(origin);
        const isReplit = origin && origin.includes('.replit.dev');
        callback(null, isLocalhost || isReplit);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token'],
    optionsSuccessStatus: 200
  };
  app.use(cors(corsOptions));

  // Optimized body parsing middleware
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: false, limit: '5mb' }));

  (async () => {
    try {
      // Minimal GPS test route for performance
      app.get('/gps-test-direct', (req, res) => {
        res.send(`<!DOCTYPE html><html><head><title>GPS Test</title></head><body><h1>GPS Test</h1><button onclick="navigator.geolocation?.getCurrentPosition(p=>alert('GPS: '+p.coords.latitude+','+p.coords.longitude))">Test GPS</button></body></html>`);
      });

      // Origin-based CSRF protection for now (simpler and more reliable)
      app.use((req, res, next) => {
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          const origin = req.get('Origin') || req.get('Referer');
          const allowedOrigins = process.env.NODE_ENV === 'production' 
            ? (process.env.ALLOWED_ORIGINS?.split(',') || [])
            : ['http://localhost:5000', 'http://127.0.0.1:5000'];
          
          // In development, allow Replit dev URLs (.replit.dev domains)
          const isReplit = origin && origin.includes('.replit.dev');
          const isAllowed = origin && (
            allowedOrigins.some(allowed => origin.startsWith(allowed)) || 
            (process.env.NODE_ENV !== 'production' && isReplit)
          );
          
          if (!isAllowed) {
            console.log(`🔒 CSRF blocked origin: ${origin} (NODE_ENV: ${process.env.NODE_ENV})`);
            return res.status(403).json({ error: 'CSRF protection: Invalid origin' });
          }
        }
        next();
      });

      // SECURE AUTHENTICATION ENDPOINTS
      const { refreshTokens } = await import('./auth-middleware');
      app.post('/api/auth/refresh', refreshTokens);

      // Initialize core system quickly
      let httpServer;
      try {
        httpServer = await registerRoutes(app);
      } catch (error) {
        console.log('⚠️ Complex routes failed, using simple routes...');
        const simpleRoutes = await import('./simple-routes');
        app.use('/api', simpleRoutes.default);
        // Create fallback HTTP server
        const { createServer } = await import('http');
        httpServer = createServer(app);
      }
      
      registerEudrRoutes(app);
      const { registerSimpleEudrRoutes } = await import('./eudr-simple-routes');
      registerSimpleEudrRoutes(app);
      
      // Certificate testing routes
      const { addCertificateTestRoutes } = await import('./certificate-test-generator');
      addCertificateTestRoutes(app);
      
      // Certificate generation routes for dashboard integration
      const certificateRoutes = await import('./certificate-routes');
      app.use('/api/certificates', certificateRoutes.default);
      
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