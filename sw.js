// sw.js — offline app shell for Recourse
const CACHE = "recourse-shell-v1";
const ASSETS = [
  "./", "./index.html", "./css/styles.css", "./manifest.webmanifest",
  "./js/app.js", "./js/ui.js", "./js/store.js", "./js/templates.js", "./js/providers.js",
  "./js/agent.js", "./js/pile.js", "./js/fight.js", "./js/wins.js", "./js/vault.js",
  "./js/settings.js", "./js/onboarding.js",
  "./assets/favicon.svg", "./assets/icon-192.png", "./assets/icon-512.png",
];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // let AI API calls pass through
  e.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => {
    const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); return res;
  }).catch(() => cached)));
});
