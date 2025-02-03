const CACHE_NAME = 'cre-cache-v1';
const urlsToCache = ['/', '/index.html', '/src/styles.css', '/src/main.js', '/manifest.json'];

self.addEventListener('install', event =>
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)))
);

self.addEventListener('fetch', event =>
    event.respondWith(caches.match(event.request).then(response => response ?? fetch(event.request)))
);

self.addEventListener('activate', event =>
    event.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.map(key => ![CACHE_NAME].includes(key) && caches.delete(key)))
    ))
);
        