// AgriTrace360 Minimal Service Worker
// No interference with normal browsing - offline fallback only

const CACHE_NAME = 'agritrace360-minimal-v1';

// Minimal install
self.addEventListener('install', (event) => {
  console.log('AgriTrace360 Service Worker installing - minimal version');
  self.skipWaiting();
});

// Minimal activate  
self.addEventListener('activate', (event) => {
  console.log('AgriTrace360 Service Worker activated - minimal mode');
  event.waitUntil(self.clients.claim());
});

// Only handle navigation requests that fail
self.addEventListener('fetch', (event) => {
  // Only intercept document navigation requests
  if (event.request.mode === 'navigate' && event.request.destination === 'document') {
    event.respondWith(handleNavigation(event.request));
  }
  // Let all other requests pass through normally
});

async function handleNavigation(request) {
  try {
    // Always try network first
    const response = await fetch(request);
    return response;
  } catch (error) {
    // Only return offline page if network completely fails
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
            <p>You're currently offline. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
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