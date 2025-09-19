// Service Worker básico: cache leve para app shell e imagens críticas
const CACHE = 'eg-cache-v1';
const ASSETS = [
  '/', '/index.html', '/styles.css', '/app.js',
  '/img/logo.svg', '/img/hero-800.jpg', '/img/hero-1600.jpg', '/img/og-image.jpg',
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE && caches.delete(k))))
  );
});

self.addEventListener('fetch', (e)=>{
  const url = new URL(e.request.url);
  if(url.origin === location.origin){
    e.respondWith(
      caches.match(e.request).then(res=> res || fetch(e.request))
    );
  }
});
