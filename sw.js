/* MCUN service worker
 * Notun release deploy korle shudhu V bariye din (v1 -> v2 ...).
 * Update flow: install -> waiting -> user "Update" chape -> SKIP_WAITING -> activate -> page reload.
 */
const V = "mcn-v1";
const SHELL = ["/manifest.webmanifest", "/logo.png", "/icon-192.png"];

self.addEventListener("install", (e) => {
  // skipWaiting ekhane CHAI NA: user "Update" chaple tobei activate hobe
  e.waitUntil(caches.open(V).then((c) => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== V).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/sw.js") return;

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => { const copy = r.clone(); caches.open(V).then((c) => c.put(req, copy)).catch(() => {}); return r; })
        .catch(() => caches.match(req).then((m) => m || caches.match("/")))
    );
    return;
  }
  e.respondWith(
    fetch(req)
      .then((r) => { if (r && r.ok) { const copy = r.clone(); caches.open(V).then((c) => c.put(req, copy)).catch(() => {}); } return r; })
      .catch(() => caches.match(req))
  );
});

/* ---- Push (server data-only message pathay: title, body, url, tag, urgent) ---- */
self.addEventListener("push", (e) => {
  let d = {};
  try { const j = e.data ? e.data.json() : {}; d = j.data || j || {}; } catch (err) {}
  e.waitUntil(self.registration.showNotification(d.title || "Mirpur College", {
    body: d.body || "",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: d.tag || "mcn",
    data: { url: d.url || "/" },
    requireInteraction: d.urgent === "1",
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const target = new URL((e.notification.data && e.notification.data.url) || "/", self.location.origin).href;
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of list) {
      if (new URL(c.url).origin === self.location.origin && "focus" in c) {
        await c.focus();
        if ("navigate" in c) { try { await c.navigate(target); } catch (err) {} }
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
