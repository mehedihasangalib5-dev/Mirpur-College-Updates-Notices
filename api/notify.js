// POST /api/notify  { id }   Header: Authorization: Bearer <Firebase ID token>
// Shudhu Admin/Editor (config/admins-er emails, editors ba UID) call korte pare. Post-er title/body server nijei Firestore theke pore,
// tarpor sob subscriber-ke push pathay.
const { init, TOPIC, sameOrigin, body } = require("./_lib");

const ICON = { notice: "📢", syllabus: "📚", suggestion: "💡", routine: "🗓", result: "🏆", event: "🎉" };

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  if (!m) return res.status(401).json({ ok: false, error: "login lagbe" });

  const id = String(body(req).id || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 60);
  if (!id) return res.status(400).json({ ok: false, error: "id nai" });

  try {
    const admin = init();
    const user = await admin.auth().verifyIdToken(m[1]);

    const cfg = await admin.firestore().doc("config/admins").get();
    const c = cfg.exists ? cfg.data() : {};
    const ids = c.ids || [];
    const emails = (c.emails || []).map((e) => String(e).toLowerCase());
    const editors = (c.editors || []).map((e) => String(e).toLowerCase());
    const em = user.email_verified === true && user.email ? String(user.email).toLowerCase() : "";
    const allowed = ids.includes(user.uid) || (em && (emails.includes(em) || editors.includes(em)));
    if (!allowed) return res.status(403).json({ ok: false, error: "admin na" });

    const snap = await admin.firestore().doc("posts/" + id).get();
    if (!snap.exists) return res.status(404).json({ ok: false, error: "post nai" });
    const p = snap.data();

    const title = ((ICON[p.cat] || "📢") + " " + String(p.title || "New update")).slice(0, 120);
    const text = String(p.body || "").replace(/\s+/g, " ").trim().slice(0, 140);

    await admin.messaging().send({
      topic: TOPIC,
      data: { title, body: text, url: "/#/p/" + id, tag: "post-" + id },
      webpush: { headers: { Urgency: "high", TTL: "86400" } },
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("notify error", e && e.message);
    const code = e && e.code === "auth/argument-error" ? 401 : 500;
    return res.status(code).json({ ok: false, error: code === 401 ? "login expired" : "server" });
  }
};
