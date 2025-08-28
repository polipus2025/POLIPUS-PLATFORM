// Ultra-aggressive service worker for instant loading
const CACHE_NAME = 'polipus-platform-v1.0';
const STATIC_CACHE = 'polipus-static-v1.0';
const DYNAMIC_CACHE = 'polipus-dynamic-v1.0';

// Files to cache immediately for instant loading
const CRITICAL_FILES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// API endpoints to cache aggressively
const API_CACHE_PATTERNS = [
  /\/api\/auth\//,
  /\/api\/farmer\//,
  /\/api\/buyer\//,
  /\/api\/dashboard\//
];

// Install event - cache critical files immediately
self.addEventListener('install', (event) => {
  console.log('⚡ Service Worker: Installing for ultra-fast performance');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('⚡ Service Worker: Caching critical files');
        return cache.addAll(CRITICAL_FILES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('⚡ Service Worker: Activating aggressive caching');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('⚡ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - aggressive caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different resource types with optimal strategies
  if (request.destination === 'document') {
    // HTML: Network-first with fast fallback
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
  } else if (request.destination === 'style' || request.destination === 'script') {
    // CSS/JS: Cache-first for instant loading
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (request.destination === 'image') {
    // Images: Cache-first with long expiry
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/api/')) {
    // API: Smart caching based on endpoint
    if (API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
      event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
    } else {
      event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
    }
  } else {
    // Everything else: Stale while revalidate
    event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE));
  }
});

// Cache-first strategy (instant loading)
async function cacheFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Return cached version immediately
    return cachedResponse;
  }
  
  // Fetch and cache if not found
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('⚡ Service Worker: Network failed, no cache available');
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy (fresh data priority)
async function networkFirstStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy (best of both worlds)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {});
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network
  return fetchPromise;
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_LOG') {
    console.log('⚡ Performance:', event.data.message);
  }
});