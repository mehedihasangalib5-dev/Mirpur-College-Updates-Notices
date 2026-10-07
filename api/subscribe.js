// POST /api/subscribe  { token, action: "sub" | "unsub" }
// Visitor-er phone/browser token-ke "notices" topic-e subscribe/unsubscribe kore.
const { init, TOPIC, sameOrigin, body } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false });

  const b = body(req);
  const token = String(b.token || "");
  if (!/^[A-Za-z0-9_:\-]{100,4096}$/.test(token)) return res.status(400).json({ ok: false, error: "invalid token" });

  try {
    const m = init().messaging();
    if (b.action === "unsub") await m.unsubscribeFromTopic([token], TOPIC);
    else await m.subscribeToTopic([token], TOPIC);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("subscribe error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
