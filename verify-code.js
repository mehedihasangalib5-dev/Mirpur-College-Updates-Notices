// POST /api/verify-code  { code: "123456" }   Header: Authorization: Bearer <Firebase ID token>
// Code thik hole Firebase user-er emailVerified = true kore (Firestore rules-o ei flag dekhe).
const { init, sameOrigin, body, bearerUser, hashCode, safeEq } = require("./_lib");

const MAX_TRIES = 5;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  const code = String(body(req).code || "").trim();
  if (!/^\d{6}$/.test(code)) return res.status(400).json({ ok: false, error: "format" });

  try {
    const adm = init();
    const tok = await bearerUser(adm, req);
    if (!tok) return res.status(401).json({ ok: false, error: "login" });

    const uid = tok.uid;
    const rec = await adm.auth().getUser(uid);
    if (rec.emailVerified) return res.status(200).json({ ok: true, already: true });

    const db = adm.firestore(), ref = db.doc("emailCodes/" + uid), now = Date.now();
    const r = await db.runTransaction(async (tx) => {
      const s = await tx.get(ref);
      const d = s.exists ? s.data() : {};
      if (!d.hash || !(d.exp > now)) return { err: "expired" };
      const tries = d.tries || 0;
      if (tries >= MAX_TRIES) return { err: "locked" };
      if (!safeEq(d.hash, hashCode(uid, code))) {
        tx.update(ref, { tries: tries + 1 });
        const left = MAX_TRIES - tries - 1;
        return { err: left <= 0 ? "locked" : "wrong", left: Math.max(0, left) };
      }
      return { ok: true };
    });

    if (r.err) return res.status(r.err === "wrong" ? 400 : r.err === "expired" ? 410 : 429).json({ ok: false, error: r.err, left: r.left });

    await adm.auth().updateUser(uid, { emailVerified: true });
    try { await ref.delete(); } catch (e) {}
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("verify-code error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
