const CACHE_NAME = 'befilm-cache-v3';

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

// Домены которые SW не должен трогать вообще
const BYPASS_DOMAINS = [
  'playerjs.io',
  'moviesapi.club',
  'vidsrc.pro',
  'vidsrc.cc',
  'vidsrc.to',
  'vidsrc.xyz',
  'vidsrc.me',
  'autoembed.co',
  'embed.su',
  'vidlink.pro',
  'multiembed.mov',
  'smashystream.com',
  'lookmovie2.to',
  'doodstream.com',
  'streambucket.net',
  '2embed.skin',
  'nontongo.win',
  'corsproxy.io',
  'allorigins.win',
  'moviesapi.to',
  'api.tvmaze.com',
  'images.metahub.space',
];

self.addEventListener('install', event => {
  // Активируем SW сразу без ожидания
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Новый SW берёт контроль сразу
self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 1. Пропускаем все внешние домены напрямую
  const isBypass = BYPASS_DOMAINS.some(d => url.hostname.includes(d));
  if (isBypass) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. Пропускаем не GET запросы
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. Пропускаем chrome-extension и другие не http
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 4. Только свои файлы кэшируем
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(() => {
        // Если совсем ничего — возвращаем главную страницу
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});
