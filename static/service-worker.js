const CACHE_NAME = "coreon-v2";

const URLS = [
  "/",                       // home
  "/treino",                 // tela de treino
  "/static/manifest.json",
  "/static/js/treino.js",
  "/static/imagens/visual/logo.png",
  "/static/imagens/visual/icone-trans.png",
  "/static/imagens/silhuetas/superior.png",
  "/static/imagens/silhuetas/inferior.png"
];

// INSTALA
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
  );
  self.skipWaiting();
});

// ATIVA
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
