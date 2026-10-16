// GET  /api/subscribe                         -> { vapid }  (public Web Push key; Vercel env VAPID_PUBLIC_KEY)
// POST /api/subscribe { token, action: "sub" | "unsub" }   Header: Authorization: Bearer <Firebase ID token>
// Login kora (verified, blocked noy) student-er phone/browser token-ke "notices" topic-e subscribe/unsubscribe kore.
// Token pushTokens/{uid}-e rakhe, jate Admin block/remove korle oi student-er device-e ar notification na jay.
const { init, TOPIC, sameOrigin, body, bearerUser } = require("./_lib");

const MAX_DEVICES = 10;

module.exports = async (req, res) => {
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).json({ ok: true, vapid: process.env.VAPID_PUBLIC_KEY || "" });
  }
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false });

  const b = body(req);
  const token = String(b.token || "");
  if (!/^[A-Za-z0-9_:\-]{100,4096}$/.test(token)) return res.status(400).json({ ok: false, error: "invalid token" });

  try {
    const adm = init();
    const tok = await bearerUser(adm, req, true);                 // revoke (block) kora token cholbe na
    if (!tok) return res.status(401).json({ ok: false, error: "login" });
    const rec = await adm.auth().getUser(tok.uid);
    if (rec.disabled) return res.status(403).json({ ok: false, error: "blocked" });
    if (!rec.emailVerified) return res.status(403).json({ ok: false, error: "verify" });

    const m = adm.messaging(), ref = adm.firestore().doc("pushTokens/" + tok.uid);
    const snap = await ref.get();
    let list = snap.exists ? (snap.data().tokens || []) : [];

    if (b.action === "unsub") {
      await m.unsubscribeFromTopic([token], TOPIC);
      list = list.filter((t) => t !== token);
    } else {
      const r = await m.subscribeToTopic([token], TOPIC);
      if (r.failureCount > 0) return res.status(400).json({ ok: false, error: "invalid token" });
      list = list.filter((t) => t !== token).concat(token);
      if (list.length > MAX_DEVICES) {                             // sobcheye purono device-gulo bad
        const drop = list.slice(0, list.length - MAX_DEVICES);
        list = list.slice(-MAX_DEVICES);
        try { await m.unsubscribeFromTopic(drop, TOPIC); } catch (e) {}
      }
    }
    await ref.set({ tokens: list, updated: Date.now() });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("subscribe error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
