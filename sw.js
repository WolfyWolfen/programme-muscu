const CACHE_NAME = 'mon-programme-v1.2';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './icon.svg',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    // Prendre le contrôle immédiatement sans attendre que l'app soit fermée
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retourner le cache si dispo, sinon aller chercher sur le réseau
                return response || fetch(event.request);
            })
    );
});

// Écouteur pour supprimer les anciens caches quand on met à jour la version
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Prendre le contrôle de toutes les pages ouvertes immédiatement
            return clients.claim();
        })
    );
});
