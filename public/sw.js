// PourCraft OS - Commercial Barista PWA Service Worker (v1.2)
const CACHE_NAME = 'pourcraft-core-v1.2'
const DYNAMIC_IMAGE_CACHE = 'pourcraft-beverages-v1.0'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/beverages/caramel-macchiato.jpg',
  '/beverages/ube-taro-milk-tea.jpg',
  '/beverages/einspanner-viennese-latte.jpg',
  '/beverages/smoked-oak-old-fashioned.jpg',
  '/beverages/vanilla-cream-cold-brew.jpg'
]

// 1. Install: Precache core shell & initial beverage assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[PourCraft SW] Precaching app shell & core assets')
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[PourCraft SW] Pre-cache partial fail (non-critical):', err)
      })
    }).then(() => self.skipWaiting())
  )
})

// 2. Activate: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_IMAGE_CACHE) {
            console.log('[PourCraft SW] Removing obsolete cache:', cache)
            return caches.delete(cache)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// 3. Fetch: Intelligent caching strategy for cafe bar reliability
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Skip non-GET requests or Firebase auth/backend calls
  if (event.request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return
  }

  // A. Beverage Photos & Static Images: Cache First, then Network
  if (url.pathname.startsWith('/beverages/') || event.request.destination === 'image') {
    event.respondWith(
      caches.open(DYNAMIC_IMAGE_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Background update (stale-while-revalidate)
            fetch(event.request).then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(event.request, networkResponse.clone())
              }
            }).catch(() => {})
            return cachedResponse
          }

          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone())
            }
            return networkResponse
          }).catch(() => {
            // Fallback for missing beverage images
            return cache.match('/beverages/caramel-macchiato.jpg')
          })
        })
      })
    )
    return
  }

  // B. Google Fonts: Cache First with fallback
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((res) => {
          if (res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
          }
          return res
        })
      })
    )
    return
  }

  // C. App Navigation & Script Bundles: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return networkResponse
      }).catch((err) => {
        // If offline and requesting navigation, return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/')
        }
        throw err
      })

      return cachedResponse || fetchPromise
    })
  )
})
