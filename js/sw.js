self.addEventListener('install', function(event) {
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
	'/404.html',
	'/favicon.ico',
	'/index.html',
	'/css/materialize.min.css',
	'/css/style.css',
	'/js/currency.js',
  	'/js/materialize.min.js',
  	'/js/init.js',
  	'/js/sweetalert2.min.js',
	'/assets/alexey-lin-j-0pjgxE1kc-unsplash.jpg',
	'/assets/re32.png',
	'/assets/empty-chart.png',
	'/assets/mandiri.svg',
	'/assets/icons/'
];

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});