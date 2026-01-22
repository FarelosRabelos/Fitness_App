const CACHE_NAME = "coreon-v5";

/*
  ⚠️ ATENÇÃO IMPORTANTE
  - NÃO cacheamos "/" no install para evitar falha silenciosa
  - Cacheamos manifest e ícones explicitamente
*/

const STATIC_ASSETS = [
  /* MANIFEST */
  "/manifest.json",

  /* CSS */
  "/static/css/execucao.css",

  /* JS */
  "/static/js/execucao.js",

  /* IMAGENS VISUAIS */
  "/static/imagens/icons/logo.png",
  "/static/imagens/icons/icone-trans.png",

  /* SILHUETAS */
  "/static/imagens/silhuetas/superior.png",
  "/static/imagens/silhuetas/inferior.png",

  /* ÍCONES PWA (OBRIGATÓRIO) */
  "/static/imagens/icons/icon-192.png",
  "/static/imagens/icons/icon-512.png"
];

/* =========================
   INSTALL
========================= */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

/* =========================
   ACTIVATE
========================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

/* =========================
   FETCH
========================= */
self.addEventListener("fetch", event => {
  const { request } = event;

  // Não intercepta métodos não-GET
  if (request.method !== "GET") return;

  // HTML → network first (app sempre atualizado)
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  // Assets → cache first
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
