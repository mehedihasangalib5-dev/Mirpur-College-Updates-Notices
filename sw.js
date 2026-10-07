// Service worker: app-er moto install + offline shell + PUSH NOTIFICATION. Admin ar API kokhono cache hoy na.
const V = "mcn-v2";
const SHELL = ["/", "/logo.png", "/icon-192.png", "/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  // ekta file fail korleo install jate bondho na hoy (age addAll fail hole SW kokhono active hoto na -> notification chalu hoto na)
  e.waitUntil(
    caches.open(V)
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {}))))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// ---- Push notification ----
self.addEventListener("push", (e) => {
  let p = {};
  try { p = e.data ? e.data.json() : {}; }
  catch (_) { try { p = { body: e.data.text() }; } catch (__) {} }
  const d = p.data || p, n = p.notification || {};
  const title = d.title || n.title || "Mirpur College Updates";
  const opts = {
    body: d.body || n.body || "নতুন আপডেট এসেছে — দেখতে ট্যাপ করুন",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    lang: "bn",
    vibrate: [120, 60, 120],
    data: { url: d.url || "/" },
  };
  if (d.tag) { opts.tag = d.tag; opts.renotify = true; }
  // push ashle notification dekhano must (na dekhale browser permission tule nite pare)
  e.waitUntil(self.registration.showNotification(title, opts));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "/", self.location.origin).href;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if (new URL(c.url).origin === self.location.origin && "focus" in c) {
          return c.focus().then(() => ("navigate" in c ? c.navigate(url) : null)).catch(() => self.clients.openWindow(url));
        }
      }
      return self.clients.openWindow(url);
    })
  );
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
      const net = fetch(r).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(V).then((c) => c.put(r, copy)); } return res; }).catch(() => hit || Response.error());
      return hit || net;
    })
  );
});
