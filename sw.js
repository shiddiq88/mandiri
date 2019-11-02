let CACHE_NAME = 'my-site-cache-v1';

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // console.log('Opened cache');
        return cache.addAll([
    			'/404.html',
    			'/favicon.ico',
    			'/index.html',
    			'/css/materialize.min.css',
    			'/css/style.css',
    			'/js/currency.js',
    		  '/js/materialize.min.js',
    		  '/js/init.js',
    		  '/js/sweetalert2.min.js',
    			'/assets/alexey-lin-j-0pjgxE1kc-unsplash.png',
          '/assets/alexey-lin-j-0pjgxE1kc-unsplash-panjang.png',
    			'/assets/re32.png',
    			'/assets/empty-chart.png',
    			'/assets/mandiri.svg',
    			'/assets/icons/bengkel-mandiri-72.png',
    			'/assets/icons/bengkel-mandiri-96.png',
    			'/assets/icons/bengkel-mandiri-128.png',
    			'/assets/icons/bengkel-mandiri-144.png',
    			'/assets/icons/bengkel-mandiri-152.png',
    			'/assets/icons/bengkel-mandiri-192.png',
    			'/assets/icons/bengkel-mandiri-384.png',
  			'/assets/icons/bengkel-mandiri-512.png'
    		]);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(async function() {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.filter((cacheName) => {
          return CACHE_NAME !== cacheName
        // Return true if you want to remove this cache,
        // but remember that caches are shared across
        // the whole origin
      }).map(cacheName => caches.delete(cacheName))
    );
  }());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(async function() {
    const cache = await caches.open('mysite-dynamic');
    const cachedResponse = await cache.match(event.request);
    const networkResponsePromise = fetch(event.request);

    event.waitUntil(async function() {
      const networkResponse = await networkResponsePromise;
      await cache.put(event.request, networkResponse.clone());
    }());

    // Returned the cached response if we have one, otherwise return the network response.
    return cachedResponse || networkResponsePromise;
  }());
});