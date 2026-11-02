// POST /api/notify  { id }   Header: Authorization: Bearer <Firebase ID token>
// Shudhu Admin/Editor. Notification SHUDHU oi post-er jonno select kora Year + Department-er student-der kache jay
// (post-er grp khali = sob student). Ek-i sathe bell-er list (in-app) ar phone push -- block kora student-ke jay na.
// Scope-wala Admin/Editor shudhu nijer scope-er moddhe-r post-er notification pathate pare.
const { init, sameOrigin, body, staffInfo, pageKey, pagesOf, PAGES } = require("./_lib");

const ICON = { notice: "", syllabus: "", suggestion: "", routine: "", result: "", event: "" };
const chunks = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  if (!m) return res.status(401).json({ ok: false, error: "login lagbe" });

  const id = String(body(req).id || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 60);
  if (!id) return res.status(400).json({ ok: false, error: "id nai" });

  try {
    const admin = init();
    const user = await admin.auth().verifyIdToken(m[1], true);
    const st = await staffInfo(admin, user);
    if (!st.admin && !st.editor) return res.status(403).json({ ok: false, error: "admin na" });

    const db = admin.firestore();
    const snap = await db.doc("posts/" + id).get();
    if (!snap.exists) return res.status(404).json({ ok: false, error: "post nai" });
    const p = snap.data();
    if (p.draft || (p.at && p.at > Date.now())) return res.status(400).json({ ok: false, error: "Draft/Scheduled post-er notification pathano jay na" });

    // scope-wala shudhu nijer Page-er post-er notification pathate pare
    if (st.scope.length) {
      const g = Array.isArray(p.grp) ? p.grp : [];
      if (!g.length || !g.every((k) => st.scope.includes(k)))
        return res.status(403).json({ ok: false, error: "Ei post apnar Year/Department scope-er baire" });
    }

    const pages = new Set(pagesOf(p.grp));
    const everyone = pages.size >= PAGES.length;
    const snapU = await db.collection("users").get();
    const uids = [];
    snapU.forEach((d) => {
      const u = d.data();
      if (u.blocked) return;
      if (pages.has(pageKey(u))) uids.push(d.id);
    });

    const title = ((ICON[p.cat] || "") + " " + String(p.title || "New update")).trim().slice(0, 120);
    const text = String(p.body || "").replace(/\s+/g, " ").trim().slice(0, 140);
    const now = Date.now(), nid = "p" + now.toString(36) + id.slice(0, 8);
    const doc = { ts: now, title, body: text, url: "/#/p/" + id, urgent: false, kind: "post" };

    // 1) bell-er list (in-app): sobar jonno -> notifAll; select kora Page hole -> shudhu oi student-der inbox
    try {
      if (everyone) await db.doc("notifAll/" + nid).set(doc);
      else for (const part of chunks(uids, 450)) {
        const batch = db.batch();
        part.forEach((u) => batch.set(db.doc("users/" + u + "/inbox/" + nid), doc));
        await batch.commit();
      }
    } catch (e) { console.error("in-app write failed", e && e.message); }

    // 2) phone push: shudhu oi student-der device-e
    const owners = [];
    for (const part of chunks(uids, 300)) {
      const docs = await db.getAll(...part.map((u) => db.doc("pushTokens/" + u)));
      docs.forEach((d, i) => { if (d.exists) (d.data().tokens || []).forEach((t) => owners.push({ t, uid: part[i] })); });
    }
    let sent = 0, failed = 0; const bad = [];
    for (const part of chunks(owners, 500)) {
      const r = await admin.messaging().sendEachForMulticast({
        tokens: part.map((x) => x.t),
        data: { title, body: text, url: "/#/p/" + id, tag: "post-" + id },
        webpush: { headers: { Urgency: "high", TTL: "86400" } },
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
    const FV = admin.firestore.FieldValue, byUid = {};
    bad.forEach((x) => { (byUid[x.uid] = byUid[x.uid] || []).push(x.t); });
    await Promise.all(Object.keys(byUid).map((u) => db.doc("pushTokens/" + u).update({ tokens: FV.arrayRemove(...byUid[u]) }).catch(() => {})));

    return res.status(200).json({ ok: true, students: uids.length, devices: owners.length, sent, failed, everyone });
  } catch (e) {
    console.error("notify error", e && e.message);
    const code = e && (e.code === "auth/argument-error" || e.code === "auth/id-token-revoked") ? 401 : 500;
    return res.status(code).json({ ok: false, error: code === 401 ? "login expired" : "server" });
  }
};
