// Service worker: app-er moto install + offline shell. Admin ar API kokhono cache hoy na.
const V = "mcn-v1";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(V).then((c) => c.addAll(["/", "/logo.png", "/icon-192.png", "/manifest.webmanifest"])).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/admin") || u.pathname === "/sw.js") return;
  if (r.mode === "navigate") {
    // network first (notun deploy sathe sathe dekhabe), offline hole cache
    e.respondWith(
      fetch(r).then((res) => {
        if (u.pathname === "/" && res.ok) { const copy = res.clone(); caches.open(V).then((c) => c.put("/", copy)); }
        return res;
      }).catch(() => caches.match("/").then((m) => m || new Response("Offline", { status: 503 })))
    );
    return;
  }
  // static files: cache first + background update
  e.respondWith(
    caches.match(r).then((hit) => {
      const net = fetch(r).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(V).then((c) => c.put(r, copy)); } return res; }).catch(() => hit);
      return hit || net;
    })
  );
});