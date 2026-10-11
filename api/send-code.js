// POST /api/send-code  { resend?: boolean }   Header: Authorization: Bearer <Firebase ID token>
// Login kora (kintu email verify na hoya) user-er email-e 6 digit code pathay.
// - Code shudhu user-er nijer account-email-e jay (client email dite pare na -> email-bombing hobe na)
// - 60 sec cooldown, ghonta-y max 6 ta, code 10 minute-e expire
const crypto = require("crypto");
const { init, sameOrigin, body, bearerUser, hashCode, callSheet } = require("./_lib");

const TTL = 10 * 60e3, COOLDOWN = 60e3, HOUR = 3600e3, MAX_PER_HOUR = 6;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  try {
    const adm = init();
    const tok = await bearerUser(adm, req);
    if (!tok) return res.status(401).json({ ok: false, error: "login" });

    const uid = tok.uid;
    const rec = await adm.auth().getUser(uid);
    if (rec.emailVerified) return res.status(200).json({ ok: true, verified: true });
    if (!rec.email) return res.status(400).json({ ok: false, error: "no email" });

    const db = adm.firestore(), ref = db.doc("emailCodes/" + uid);
    const resend = body(req).resend === true;
    const now = Date.now();
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, "0");

    const r = await db.runTransaction(async (tx) => {
      const s = await tx.get(ref);
      const d = s.exists ? s.data() : {};
      const since = now - (d.sentAt || 0);
      const active = !!d.hash && d.exp > now;
      if (active && !resend)                       // refresh korle notun code pathabe na
        return { reuse: true, wait: Math.max(0, Math.ceil((COOLDOWN - since) / 1000)), expires: Math.ceil((d.exp - now) / 1000) };
      if (since < COOLDOWN) return { err: "wait", wait: Math.ceil((COOLDOWN - since) / 1000) };
      const hs = d.hourStart && now - d.hourStart < HOUR ? d.hourStart : now;
      const cnt = hs === d.hourStart ? (d.cnt || 0) : 0;
      if (cnt >= MAX_PER_HOUR) return { err: "limit", wait: Math.ceil((hs + HOUR - now) / 1000) };
      tx.set(ref, { hash: hashCode(uid, code), exp: now + TTL, sentAt: now, tries: 0, hourStart: hs, cnt: cnt + 1, email: rec.email });
      return { send: true };
    });

    if (r.err) return res.status(429).json({ ok: false, error: r.err, wait: r.wait });
    if (r.reuse) return res.status(200).json({ ok: true, reused: true, wait: r.wait, expires: r.expires });

    let m;
    try { m = await callSheet({ action: "mail", to: rec.email, code, name: rec.displayName || "", ttl: TTL / 60e3 }); }
    catch (e) { m = { ok: false, error: String(e && e.message) }; }
    if (!m || !m.ok) {
      console.error("send-code mail failed:", m && m.error);
      await ref.set({ hash: null, exp: 0, sentAt: 0 }, { merge: true });      // fail hole abar try korte dao
      return res.status(502).json({ ok: false, error: m && m.error === "quota" ? "quota" : "mail" });
    }
    return res.status(200).json({ ok: true, wait: COOLDOWN / 1000, expires: TTL / 1000 });
  } catch (e) {
    console.error("send-code error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
