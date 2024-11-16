const CACHE_NAME = 'fisio-portal-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/sinais-vitais.html',
    '/style.css',
    '/sinais-vitais.css',
    '/script.js',
    '/sinais-vitais.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Ativação do Service Worker
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
        })
    );
});

// Interceptação das requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o recurso do cache se existir
                if (response) {
                    return response;
                }

                // Clone a requisição
                const fetchRequest = event.request.clone();

                // Faz a requisição e armazena no cache
                return fetch(fetchRequest).then(
                    response => {
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

// Sincronização em background
self.addEventListener('sync', event => {
    if (event.tag === 'syncData') {
        event.waitUntil(
            // Aqui você pode adicionar lógica para sincronização de dados
            console.log('Sincronizando dados...')
        );
    }
});

// Notificações push
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-192x192.png'
    };

    event.waitUntil(
        self.registration.showNotification('Portal da Fisioterapia', options)
    );
});