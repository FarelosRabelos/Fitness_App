const CACHE_NAME = "coreon-v4";

const STATIC_ASSETS = [
  "/",
  "/static/manifest.json",

  /* CSS */
  "/static/css/execucao.css",

  /* JS */
  "/static/js/execucao.js",

  /* IMAGENS */
  "/static/imagens/visual/logo.png",
  "/static/imagens/visual/icone-trans.png",
  "/static/imagens/silhuetas/superior.png",
  "/static/imagens/silhuetas/inferior.png"
];

/* INSTALL */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ACTIVATE */
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

/* FETCH */
self.addEventListener("fetch", event => {
  const { request } = event;

  // ⚠️ Não intercepta requisições não-GET
  if (request.method !== "GET") return;

  // HTML → sempre rede primeiro
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request).catch(() => caches.match("/"))
    );
    return;
  }

  // Assets estáticos → cache first
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
