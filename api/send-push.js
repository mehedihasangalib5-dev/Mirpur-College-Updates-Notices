// POST /api/send-push   Header: Authorization: Bearer <Firebase ID token>   (shudhu Owner/Admin)
//   { action: "count" | "test" | "send" | "history", audience, title, body, urgent, link, postId, url }
//   audience: { type: "all" } | { type: "filter", years:[], depts:[] } | { type: "users", uids:[] } | { type: "me" }
// Block kora student-ke kokhono pathay na. Invalid device token auto muche dey. Prottek send notifLogs-e jomaye.
const { init, sameOrigin, body, bearerUser, isAdminUser } = require("./_lib");

const MAX_PER_HOUR = 30, TTL = 86400;
const chunks = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };

function mkUrl(b) {
  if (b.link === "post") {
    const id = String(b.postId || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 60);
    return id ? "/#/p/" + id : "/";
  }
  if (b.link === "url") {
    const u = String(b.url || "").trim();
    return /^https:\/\/[^\s]{1,500}$/i.test(u) ? u : null;
  }
  return "/";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  try {
    const adm = init();
    const tok = await bearerUser(adm, req, true);
    if (!tok) return res.status(401).json({ ok: false, error: "login" });
    if (!(await isAdminUser(adm, tok))) return res.status(403).json({ ok: false, error: "admin na" });

    const db = adm.firestore(), FV = adm.firestore.FieldValue;
    const b = body(req), action = b.action;

    if (action === "history") {
      const s = await db.collection("notifLogs").orderBy("ts", "desc").limit(20).get();
      return res.status(200).json({ ok: true, items: s.docs.map((d) => d.data()) });
    }
    if (!["count", "test", "send"].includes(action)) return res.status(400).json({ ok: false, error: "bad request" });

    // ---- audience -> student uid list ----
    const a = action === "test" ? { type: "me" } : (b.audience || {});
    let uids = [], desc = "";
    if (a.type === "me") {
      uids = [tok.uid]; desc = "Test (nijer device)";
    } else {
      const snap = await db.collection("users").get();
      const years = Array.isArray(a.years) ? a.years.slice(0, 5).map(String) : [];
      const depts = Array.isArray(a.depts) ? a.depts.slice(0, 10).map(String) : [];
      const pick = new Set(Array.isArray(a.uids) ? a.uids.slice(0, 200).map(String) : []);
      snap.forEach((d) => {
        const p = d.data();
        if (p.blocked) return;
        if (a.type === "all") uids.push(d.id);
        else if (a.type === "filter") {
          if (!years.length && !depts.length) return;
          if ((!years.length || years.includes(p.year)) && (!depts.length || depts.includes(p.dept))) uids.push(d.id);
        } else if (a.type === "users") { if (pick.has(d.id)) uids.push(d.id); }
      });
      desc = a.type === "all" ? "All students"
        : a.type === "filter" ? [years.join("/"), depts.join("/")].filter(Boolean).join(" · ")
        : a.type === "users" ? uids.length + " selected student(s)" : "";
      if (!desc) return res.status(400).json({ ok: false, error: "audience" });
    }

    // ---- device tokens ----
    const owners = [];                         // { t, uid }
    let withDevices = 0;
    for (const part of chunks(uids, 300)) {
      const docs = await db.getAll(...part.map((u) => db.doc("pushTokens/" + u)));
      docs.forEach((d, i) => {
        const t = d.exists ? (d.data().tokens || []) : [];
        if (t.length) withDevices++;
        t.forEach((x) => owners.push({ t: x, uid: part[i] }));
      });
    }

    if (action === "count") return res.status(200).json({ ok: true, students: uids.length, withDevices, devices: owners.length });

    // ---- validate message ----
    const title = String(b.title || "").trim().slice(0, 80), text = String(b.body || "").trim().slice(0, 240);
    if (!title || !text) return res.status(400).json({ ok: false, error: "title/message dao" });
    const url = mkUrl(b);
    if (url === null) return res.status(400).json({ ok: false, error: "link https:// diye shuru hote hobe" });
    if (!owners.length) return res.status(400).json({ ok: false, error: action === "test" ? "Apnar nijer device-e notification ON nei (site-e bell chepe ON korun)" : "Kono device-e notification ON nei" });

    const now = Date.now();
    if (action === "send") {                   // rate limit
      const recent = await db.collection("notifLogs").orderBy("ts", "desc").limit(60).get();
      const n = recent.docs.filter((d) => d.data().by === tok.uid && now - d.data().ts < 3600e3).length;
      if (n >= MAX_PER_HOUR) return res.status(429).json({ ok: false, error: "ghonta-y onek bar pathiyechen, pore abar chesta korun" });
    }

    const urgent = b.urgent === true;
    const data = { title, body: text, url, tag: "adm-" + now, urgent: urgent ? "1" : "0" };
    let sent = 0, failed = 0; const bad = [];
    for (const part of chunks(owners, 500)) {
      const r = await adm.messaging().sendEachForMulticast({
        tokens: part.map((x) => x.t), data,
        webpush: { headers: { Urgency: urgent ? "high" : "normal", TTL: String(TTL) } },
      });
      r.responses.forEach((x, i) => {
        if (x.success) sent++;
        else {
          failed++;
          const c = x.error && x.error.code;
          if (c === "messaging/registration-token-not-registered" || c === "messaging/invalid-registration-token") bad.push(part[i]);
        }
      });
    }
    // mora token muche felo
    const byUid = {};
    bad.forEach((x) => { (byUid[x.uid] = byUid[x.uid] || []).push(x.t); });
    await Promise.all(Object.keys(byUid).map((u) => db.doc("pushTokens/" + u).update({ tokens: FV.arrayRemove(...byUid[u]) }).catch(() => {})));

    if (action === "send")
      await db.collection("notifLogs").add({ ts: now, by: tok.uid, email: String(tok.email || "").slice(0, 120), title, body: text, urgent, aud: desc, students: uids.length, sent, failed });

    return res.status(200).json({ ok: true, sent, failed, students: uids.length });
  } catch (e) {
    console.error("send-push error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
