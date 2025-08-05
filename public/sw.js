// Service Worker for Polipus Environmental Intelligence Platform PWA
const CACHE_NAME = 'polipus-platform-v2.0.0';
const API_CACHE_NAME = 'polipus-api-v2.0.0';

// Static assets to cache
const STATIC_CACHE_URLS = [
  '/',
  '/landing',
  '/front-page',
  '/manifest.json',
  '/pwa-icons/icon-192x192.png',
  '/pwa-icons/icon-512x512.png',
  '/mobile-app-download',
  '/install-app',
  '/portals'
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/dashboard/metrics',
  '/api/commodities',
  '/api/alerts',
  '/api/messages'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('AgriTrace360 PWA: Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('AgriTrace360 PWA: Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS.map(url => new Request(url, { cache: 'no-cache' })));
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('AgriTrace360 PWA: Preparing API cache');
        return Promise.resolve();
      })
    ]).then(() => {
      console.log('AgriTrace360 PWA: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('AgriTrace360 PWA: Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('AgriTrace360 PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('AgriTrace360 PWA: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // API requests - Network First strategy with fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      networkFirstWithFallback(request)
    );
    return;
  }

  // Static assets - Cache First strategy
  if (isStaticAsset(url.pathname)) {
    event.respondWith(
      cacheFirstWithFallback(request)
    );
    return;
  }

  // HTML pages - Network First with cache fallback
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      networkFirstWithFallback(request)
    );
    return;
  }

  // Default - Network First
  event.respondWith(
    networkFirstWithFallback(request)
  );
});

// Network First strategy for API and HTML
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cacheName = request.url.includes('/api/') ? API_CACHE_NAME : CACHE_NAME;
      const cache = await caches.open(cacheName);
      
      // Clone response for caching
      const responseClone = response.clone();
      cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.log('AgriTrace360 PWA: Network failed, trying cache for:', request.url);
    
    // Try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/pwa');
    }
    
    // Return offline response for API requests
    if (request.url.includes('/api/')) {
      return new Response(
        JSON.stringify({
          error: 'Offline',
          message: 'No network connection available',
          timestamp: new Date().toISOString(),
          cached: false
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    throw error;
  }
}

// Cache First strategy for static assets
async function cacheFirstWithFallback(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network and cache
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('AgriTrace360 PWA: Failed to fetch asset:', request.url);
    throw error;
  }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext)) || pathname.includes('/assets/');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('AgriTrace360 PWA: Background sync triggered:', event.tag);
  
  if (event.tag === 'agritrace-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Sync offline data when network is available
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB or localStorage
    const offlineData = await getOfflineData();
    
    if (offlineData && offlineData.length > 0) {
      console.log('AgriTrace360 PWA: Syncing offline data:', offlineData.length, 'items');
      
      for (const item of offlineData) {
        try {
          await fetch(item.url, {
            method: item.method,
            headers: item.headers,
            body: item.body
          });
          
          // Remove from offline storage after successful sync
          await removeOfflineData(item.id);
        } catch (error) {
          console.log('AgriTrace360 PWA: Failed to sync item:', item.id, error);
        }
      }
    }
  } catch (error) {
    console.log('AgriTrace360 PWA: Background sync failed:', error);
  }
}

// Get offline data (implement based on your storage strategy)
async function getOfflineData() {
  // This would integrate with your offline storage system
  return [];
}

// Remove offline data after sync
async function removeOfflineData(id) {
  // This would remove the item from your offline storage
  console.log('AgriTrace360 PWA: Removing synced offline data:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('AgriTrace360 PWA: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New AgriTrace360 notification',
    icon: '/pwa-icons/icon-192x192.png',
    badge: '/pwa-icons/icon-96x96.png',
    tag: 'agritrace-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/pwa-icons/icon-96x96.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('AgriTrace360 LACRA', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('AgriTrace360 PWA: Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/pwa')
    );
  }
});

console.log('AgriTrace360 PWA: Service Worker loaded successfully');