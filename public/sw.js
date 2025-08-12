// AgriTrace360 Login-Friendly Service Worker
// Allows login pages to work offline while providing fallback for main app

const CACHE_NAME = 'agritrace360-login-friendly-v1';

// Simple install
self.addEventListener('install', (event) => {
  console.log('AgriTrace360 Service Worker installing - login-friendly version');
  self.skipWaiting();
});

// Simple activate  
self.addEventListener('activate', (event) => {
  console.log('AgriTrace360 Service Worker activated - login-friendly mode');
  event.waitUntil(self.clients.claim());
});

// Very selective fetch handling - avoid login interference
self.addEventListener('fetch', (event) => {
  // Only handle main app navigation, never login pages
  if (event.request.mode === 'navigate' && event.request.destination === 'document') {
    const url = new URL(event.request.url);
    
    // Never intercept any auth/login related URLs
    if (url.pathname.includes('login') || 
        url.pathname.includes('auth') || 
        url.pathname.includes('field-agent') ||
        url.pathname.includes('farmer') ||
        url.pathname.includes('regulatory') ||
        url.pathname.includes('exporter')) {
      // Let these pages load normally - no interference
      return;
    }
    
    // Only show offline page for root navigation failures
    if (url.pathname === '/' || url.pathname === '') {
      event.respondWith(handleMainNavigation(event.request));
    }
  }
  // Let all other requests pass through completely untouched
});

async function handleMainNavigation(request) {
  try {
    // Always try network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Simple offline page only for main app
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AgriTrace360 - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 40px;
              background: linear-gradient(135deg, #10b981, #059669);
              color: white;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0;
            }
            .container { 
              background: rgba(255,255,255,0.1); 
              padding: 40px; 
              border-radius: 20px;
              max-width: 400px;
            }
            h1 { font-size: 28px; margin-bottom: 20px; }
            p { font-size: 16px; line-height: 1.5; margin-bottom: 30px; }
            .links { margin: 20px 0; }
            .links a {
              display: block;
              color: white;
              text-decoration: none;
              padding: 10px;
              margin: 10px 0;
              background: rgba(255,255,255,0.2);
              border-radius: 8px;
            }
            button { 
              background: white; 
              color: #10b981; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              font-size: 16px; 
              cursor: pointer;
              margin: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🌱 AgriTrace360</h1>
            <p>You're currently offline, but you can still access login pages:</p>
            
            <div class="links">
              <a href="/field-agent-login">Field Agent Login (Offline Ready)</a>
              <a href="/farmer-login">Farmer Login (Offline Ready)</a>
              <a href="/regulatory-login">Regulatory Login (Offline Ready)</a>
            </div>
            
            <button onclick="window.location.reload()">Retry Connection</button>
          </div>
          <script>
            // Auto-reload when back online
            window.addEventListener('online', () => {
              window.location.reload();
            });
          </script>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}