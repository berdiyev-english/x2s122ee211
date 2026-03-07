const CACHE_NAME = 'befilm-cache-v1';

// Указываем, какие ваши файлы нужно сохранить в кэш телефона
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если файл есть в кэше — отдаем его (работает мгновенно)
        if (response) {
          return response;
        }
        // Иначе запрашиваем из интернета
        return fetch(event.request);
      })
  );
});
