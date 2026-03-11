const CACHE_NAME = 'movvi-v4';
const ASSETS = [
    '/',
    '/index.html',
    '/client.html',
    '/driver.html',
    '/manifest_client.json',
    '/manifest_driver.json',
    '/assets/images/logo_movvi.png',
    '/assets/images/logo_movvi_icon.png',
    '/assets/images/movvi_icon_192.png',
    '/assets/images/movvi_icon_512.png',
    '/assets/images/hero_bg.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
