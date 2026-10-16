// Service worker: app-er moto install + offline shell. Admin ar API kokhono cache hoy na.
// Notun release dile ei V ta bodlan: tahole user-der app-e "Update" notice jabe.
const V = "mcn-v16";
const SHELL = ["/", "/logo.png", "/icon-192.png", "/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(V)
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {}))))
      .catch(() => {})
  );
});
// Notun version "waiting" e thake; user "Update" chaple tabei active hoy (page theke message ashe).
self.addEventListener("message", (e) => { if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;
  if (u.pathname.startsWith("/api/") || u.pathname.startsWith("/admin") || u.pathname === "/sw.js") return;
  if (r.mode === "navigate") {
    e.respondWith(
      fetch(r).then((res) => {
        if (u.pathname === "/" && res.ok) { const copy = res.clone(); caches.open(V).then((c) => c.put("/", copy)); }
        return res;
      }).catch(() => caches.match("/").then((m) => m || new Response("Offline", { status: 503 })))
    );
    return;
  }
  e.respondWith(
    caches.match(r).then((hit) => {
      const net = fetch(r).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(V).then((c) => c.put(r, copy)); } return res; }).catch(() => hit || Response.error());
      return hit || net;
    })
  );
});

// ---- Push notification (FCM data message) ----
self.addEventListener("push", (e) => {
  let d = {};
  try { const j = e.data ? e.data.json() : {}; d = j.data || j.notification || j; }
  catch (_) { try { d = { body: e.data.text() }; } catch (__) {} }
  const title = d.title || "Mirpur College Updates";
  const urgent = d.urgent === "1";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || "mcn",
    requireInteraction: urgent,
    vibrate: urgent ? [200, 100, 200, 100, 200] : undefined,
    data: { url: d.url || "/" },
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/";
  let abs; try { abs = new URL(url, self.location.origin); } catch (_) { abs = new URL("/", self.location.origin); }
  if (abs.origin !== self.location.origin) { e.waitUntil(self.clients.openWindow(abs.href)); return; }
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((cs) => {
      for (const c of cs) {
        if ("focus" in c) { if (c.navigate) c.navigate(url).catch(() => {}); return c.focus(); }
      }
      return self.clients.openWindow(url);
    })
  );
});
