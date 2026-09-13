const CACHE = "santino-os-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./via.html",
  "./style.css",
  "./script.js",
  "./via.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Instalação: guarda os arquivos do app no cache
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

// Ativação: apaga caches de versões antigas
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(
        chaves.filter((c) => c !== CACHE).map((c) => caches.delete(c))
      )
    )
  );
  self.clients.claim();
});

// Requisições: responde do cache, com a rede como reserva
self.addEventListener("fetch", (evento) => {
  const url = evento.request.url;

  // APIs externas nunca entram no cache: precisam de dado atual
  if (url.includes("viacep.com.br") || url.includes("api.qrserver.com")) {
    return;
  }

  evento.respondWith(
    caches.match(evento.request).then((resposta) => {
      return resposta || fetch(evento.request);
    })
  );
});