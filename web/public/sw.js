// NorthFlow Service Worker
// Uses network-first for pages, cache-first for static assets

const CACHE_NAME = 'northflow-v2';
const STATIC_CACHE = 'northflow-static-v2';

// Only pre-cache the landing page and PWA assets — NEVER dynamic routes
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  return (
    path.startsWith('/_next/') ||
    path.startsWith('/icons/') ||
    path.startsWith('/images/') ||
    path.endsWith('.js') ||
    path.endsWith('.css') ||
    path.endsWith('.woff2') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.svg') ||
    path === '/manifest.json'
  );
}

function isApiRequest(request) {
  return request.url.includes('supabase');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests: network-only with fallback
  if (isApiRequest(request)) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // HTML navigation requests (pages): NETWORK FIRST
  // This ensures auth redirects and dynamic content always work
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful page loads for offline fallback
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // Only serve from cache when offline
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // If no cache and offline, show landing page as fallback
            return caches.match('/');
          });
        })
    );
    return;
  }

  // Static assets: stale-while-revalidate
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
          // Return cached immediately, update in background
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Everything else: network first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
