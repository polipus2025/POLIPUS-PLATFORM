import express from "express";

const app = express();

// MAINTENANCE MODE - ENABLED - Generic maintenance page active
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
}