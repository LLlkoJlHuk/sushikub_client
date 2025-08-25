// Service Worker для кэширования
const CACHE_NAME = 'sushikub-v1';
const STATIC_CACHE = 'sushikub-static-v1';
const DYNAMIC_CACHE = 'sushikub-dynamic-v1';

// Ресурсы для кэширования
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/src/assets/css/index.scss',
  '/src/assets/images/desktop_banner--plug.webp',
  '/src/assets/images/mobile_banner--plug.webp',
  '/src/assets/images/roll-plug.webp'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Кэширование статических ресурсов');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Удаление старого кэша:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Стратегия кэширования для статических ресурсов
  if (request.method === 'GET' && isStaticResource(request)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            });
        })
    );
  }
  
  // Стратегия кэширования для изображений
  else if (request.method === 'GET' && isImageRequest(request)) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return fetchResponse;
            });
        })
    );
  }
  
  // Стратегия кэширования для API запросов
  else if (request.method === 'GET' && isApiRequest(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
});

// Проверка статических ресурсов
function isStaticResource(request) {
  return request.url.includes('/src/assets/') || 
         request.url.includes('/static/') ||
         request.url.endsWith('.css') ||
         request.url.endsWith('.js');
}

// Проверка изображений
function isImageRequest(request) {
  return request.destination === 'image';
}

// Проверка API запросов
function isApiRequest(request) {
  return request.url.includes('/api/') || 
         request.url.includes('localhost:5000');
}

// Очистка кэша
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              return caches.delete(cacheName);
            })
          );
        })
        .then(() => {
          console.log('Кэш очищен');
        })
    );
  }
});
