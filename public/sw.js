// DISABLED SERVICE WORKER - NO CACHING FOR DEBUGGING
console.log('🚨 Service Worker: ALL CACHING DISABLED');

const CACHE_BUSTER = 'disabled-' + Date.now();

self.addEventListener('install', (event) => {
  console.log('🚨 Service Worker installing with NO CACHE');
  
  event.waitUntil(
    // Clear ALL existing caches
    caches.keys().then((cacheNames) => {
      console.log('🗑️ Deleting ALL caches:', cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('✅ All caches deleted');
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('🚨 Service Worker activated - NO CACHING');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  console.log('🚨 Request intercepted:', event.request.url);
  
  // COMPLETELY SKIP API REQUESTS - Let them go through normally
  if (event.request.url.includes('/api/')) {
    console.log('🚨 SKIPPING service worker for API request:', event.request.url);
    return; // Don't use event.respondWith() - let browser handle normally
  }
  
  // NO CACHING - Always fetch from network for non-API requests
  event.respondWith(
    fetch(event.request, { 
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache', 
        'Expires': '0'
      }
    }).catch((error) => {
      console.error('Network request failed:', error);
      
      // For HTML requests, show debug info
      if (event.request.headers.get('accept')?.includes('text/html')) {
        return new Response(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>🚨 DEBUG MODE</title>
              <style>
                body { 
                  font-family: Arial; 
                  margin: 50px; 
                  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                  color: white;
                  text-align: center;
                }
                .debug { 
                  background: rgba(0,0,0,0.7); 
                  padding: 20px; 
                  border-radius: 10px;
                  margin: 20px 0;
                }
              </style>
            </head>
            <body>
              <h1>🚨 SERVICE WORKER DEBUG MODE</h1>
              <div class="debug">
                <p><strong>Caching:</strong> DISABLED</p>
                <p><strong>Request:</strong> ${event.request.url}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Cache Buster:</strong> ${CACHE_BUSTER}</p>
              </div>
              <button onclick="window.location.reload(true)" style="padding: 10px 20px; font-size: 16px;">
                🔄 Force Refresh
              </button>
              <br><br>
              <a href="/test-field-agent-login" style="color: yellow; font-size: 18px;">
                🧪 Go to Test Login
              </a>
            </body>
          </html>
        `, {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      // For other requests, return error
      return new Response('Network Error - Cache Disabled', { 
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

console.log('🚨 Service Worker loaded - ALL CACHING DISABLED');