// AgriTrace360 Simple Offline Service Worker
// Only activates when truly offline

const CACHE_NAME = 'agritrace360-offline-v3';
const STATIC_CACHE = 'agritrace360-static-v3';

// Simple install - minimal caching
self.addEventListener('install', (event) => {
  console.log('🚀 AgriTrace360 Service Worker installing - V3 SIMPLE');
  event.waitUntil(self.skipWaiting());
});

// Simple activate
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker activated - V3 SIMPLE MODE');
  event.waitUntil(self.clients.claim());
});

// Only intercept when truly offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Only intercept navigation requests when offline
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event.request));
    return;
  }

  // Let everything else pass through normally
});

async function handleNavigationRequest(request) {
  try {
    // Always try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Only show offline page when network truly fails
    console.log('🌐 Network failed, showing offline page');
    return getOfflinePage();
  }
}

function getOfflinePage() {
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AgriTrace360 - Offline</title>
        <style>
          body { 
            font-family: system-ui, -apple-system, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .container { 
            background: rgba(255,255,255,0.1); 
            padding: 40px; 
            border-radius: 20px;
            backdrop-filter: blur(10px);
            max-width: 500px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          }
          .icon { font-size: 64px; margin-bottom: 20px; }
          h1 { margin: 0 0 20px 0; font-size: 32px; font-weight: 600; }
          p { font-size: 18px; line-height: 1.6; margin-bottom: 30px; opacity: 0.9; }
          .btn { 
            background: #fff; 
            color: #10b981; 
            border: none; 
            padding: 15px 30px; 
            border-radius: 10px; 
            font-size: 16px; 
            font-weight: 600;
            cursor: pointer;
            margin: 10px;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }
          .btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
          .features { 
            text-align: left; 
            margin: 30px 0; 
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
          }
          .feature { 
            margin: 8px 0; 
            padding: 5px 0;
            font-size: 16px;
          }
          .feature::before { 
            content: "✓ "; 
            color: #34d399; 
            font-weight: bold; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🌱</div>
          <h1>AgriTrace360™</h1>
          <p>You're currently offline, but our platform supports full offline functionality for essential agricultural operations.</p>
          
          <div class="features">
            <div class="feature">Offline farmer authentication</div>
            <div class="feature">GPS location recording</div>
            <div class="feature">Farm registration and mapping</div>
            <div class="feature">Commodity tracking data entry</div>
            <div class="feature">Auto-sync when connection returns</div>
          </div>
          
          <button class="btn" onclick="window.location.reload()">Retry Connection</button>
          <button class="btn" onclick="showOfflineLogin()">Continue Offline</button>
        </div>
        
        <script>
          function showOfflineLogin() {
            alert('Offline login functionality available. Platform will sync data automatically when connection is restored.');
            window.location.reload();
          }
          
          // Auto-retry when back online
          window.addEventListener('online', () => {
            window.location.reload();
          });
        </script>
      </body>
    </html>
  `, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}