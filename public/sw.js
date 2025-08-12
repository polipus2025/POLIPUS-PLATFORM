// Enhanced Service Worker for AgriTrace360 PWA
// Comprehensive offline functionality for the agricultural compliance platform

const CACHE_NAME = 'agritrace360-offline-v3';
const OFFLINE_URL = '/';

// Essential URLs to cache for offline functionality
const urlsToCache = [
  '/',
  '/field-agent-login', 
  '/farmers',
  '/field-agent-dashboard',
  '/gis-mapping',
  '/farmer-registration',
  '/dashboard',
  '/manifest.json'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching offline resources');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('⚠️ Some resources failed to cache:', err);
          // Cache essential routes individually
          return Promise.allSettled(
            urlsToCache.map(url => 
              fetch(url).then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
              }).catch(() => console.log(`Failed to cache: ${url}`))
            )
          );
        });
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        self.skipWaiting();
      })
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Enhanced fetch handler with comprehensive offline support
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle navigation requests (pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If online, cache the response and return it
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If offline, serve from cache or return offline page
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('📱 Serving cached page:', request.url);
                return cachedResponse;
              }
              
              // For any navigation request, serve the main app
              return caches.match('/').then(mainPage => {
                if (mainPage) {
                  console.log('📱 Serving main app for:', request.url);
                  return mainPage;
                }
                
                // Last resort - create a minimal offline page
                return new Response(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AgriTrace360 - Offline</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
    .offline-container { max-width: 400px; margin: 50px auto; }
    .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 20px; }
    .message { color: #64748b; margin-bottom: 30px; }
    .btn { background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 6px; text-decoration: none; display: inline-block; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="offline-container">
    <div class="logo">🌾 AgriTrace360</div>
    <h2>Offline Mode Active</h2>
    <p class="message">You're currently offline. The app is working in offline mode with cached data.</p>
    <a href="/" class="btn" onclick="window.location.reload()">Try Again</a>
    <script>
      // Auto-redirect to cached main page if available
      if (navigator.onLine) {
        window.location.href = '/';
      }
      
      // Listen for online event
      window.addEventListener('online', () => {
        window.location.reload();
      });
    </script>
  </div>
</body>
</html>`, {
                  headers: { 'Content-Type': 'text/html' }
                });
              });
            });
        })
    );
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return offline response for API calls
          console.log('📱 Offline API request:', url.pathname);
          return new Response(JSON.stringify({
            offline: true,
            message: 'This request is being handled offline',
            timestamp: Date.now()
          }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  // Handle static resources (JS, CSS, images)
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(request)
          .then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            console.log('📱 Resource not available offline:', request.url);
            // Return empty response for missing resources
            return new Response('', { status: 404 });
          });
      })
  );
});

// Handle background sync for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'farmer-sync') {
    console.log('🔄 Background sync triggered for farmers');
    event.waitUntil(
      // Trigger farmer sync function
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'SYNC_FARMERS' });
        });
      })
    );
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

console.log('🌾 AgriTrace360 Service Worker loaded - Offline functionality active');