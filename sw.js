const CACHE_NAME = 'mon-programme-v2.2';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './js/utils.js',
    './js/storage.js',
    './js/state.js',
    './js/ui.js',
    './js/editor.js',
    './js/workout.js',
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
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                // Mettre à jour le cache de façon transparente
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // Si hors-ligne, on ne fait rien de plus (on a déjà le cache ou l'erreur réseau habituelle)
            });

            // On retourne le cache TOUT DE SUITE s'il existe (ultra-rapide), 
            // SINON on attend la réponse réseau (1ère visite)
            return cachedResponse || fetchPromise;
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
