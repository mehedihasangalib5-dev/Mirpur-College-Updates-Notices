// GET /p/:id  -> HTML with Open Graph tags (WhatsApp/Facebook preview), then redirects to /#/p/:id
const KEY = "AIzaSyAgZV0TeVSXYYnQiKqGKq7N2hAWk4FU4fo";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

module.exports = async (req, res) => {
  const id = String((req.query && req.query.id) || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 60);
  let host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  if (!/^[a-z0-9.-]+(:\d+)?$/i.test(host)) host = "localhost";
  const origin = (host.startsWith("localhost") ? "http://" : "https://") + host;

  let title = "Mirpur College Updates & Notices";
  let desc = "কলেজের সর্বশেষ নোটিশ, সিলেবাস, রুটিন ও আপডেট এক জায়গায়।";
  if (id) {
    try {
      const u = new URL(`https://firestore.googleapis.com/v1/projects/muc-network-50a06/databases/(default)/documents/posts/${id}`);
      u.searchParams.set("key", KEY);
      u.searchParams.append("mask.fieldPaths", "title");
      u.searchParams.append("mask.fieldPaths", "body");
      u.searchParams.append("mask.fieldPaths", "draft");
      u.searchParams.append("mask.fieldPaths", "at");
      const r = await fetch(u);
      if (r.ok) {
        const j0 = await r.clone().json(); const f0 = j0.fields || {};
        if ((f0.draft && f0.draft.booleanValue) || (f0.at && Number(f0.at.integerValue) > Date.now())) throw new Error("hidden");
        const f = (await r.json()).fields || {};
        if (f.title && f.title.stringValue) title = f.title.stringValue;
        if (f.body && f.body.stringValue) desc = f.body.stringValue.replace(/\s+/g, " ").slice(0, 160);
      }
    } catch (e) { /* keep defaults */ }
  }
  const url = `${origin}/#/p/${id}`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  res.status(200).send(`<!DOCTYPE html><html lang="bn"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Mirpur College Updates &amp; Notices">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(origin + "/p/" + id)}"><meta property="og:image" content="${esc(origin)}/og.png">
<meta name="twitter:card" content="summary">
<meta http-equiv="refresh" content="0;url=${esc(url)}">
</head><body><script>location.replace(${JSON.stringify(url).replace(/</g, "\\u003c")})</script>
<a href="${esc(url)}">${esc(title)}</a></body></html>`);
};