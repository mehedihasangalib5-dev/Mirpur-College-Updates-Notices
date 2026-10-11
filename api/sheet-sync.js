// POST /api/sheet-sync  {}            -> login kora (verified) user-er nijer row Google Sheet-e add/update
// POST /api/sheet-sync  { all:true }  -> shudhu Owner/Admin: sob registered student ekshathe Sheet-e (backfill)
// Data Firestore (users/{uid}) + Firebase Auth theke server nijei pore -- client-er pathano data bishshash kora hoy na.
const { init, sameOrigin, body, bearerUser, isAdminUser, callSheet } = require("./_lib");

function toRow(uid, p, rec) {
  const google = (rec.providerData || []).some((x) => x.providerId === "google.com");
  return {
    uid,
    name: p.name || rec.displayName || "",
    email: rec.email || p.email || "",
    year: p.year || "",
    dept: p.dept || "",
    method: google ? "Google" : "Email",
    verified: !!rec.emailVerified,
    regAt: Date.parse(rec.metadata.creationTime) || Date.now(),
    lastLogin: Date.parse(rec.metadata.lastSignInTime) || 0,
  };
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  try {
    const adm = init();
    const tok = await bearerUser(adm, req);
    if (!tok) return res.status(401).json({ ok: false, error: "login" });
    const db = adm.firestore();

    if (body(req).all === true) {
      if (!(await isAdminUser(adm, tok))) return res.status(403).json({ ok: false, error: "admin na" });
      const snap = await db.collection("users").get();
      const profiles = {}; snap.forEach((d) => { profiles[d.id] = d.data(); });
      const uids = Object.keys(profiles);
      const users = [];
      for (let i = 0; i < uids.length; i += 100) {
        const got = await adm.auth().getUsers(uids.slice(i, i + 100).map((uid) => ({ uid })));
        got.users.forEach((rec) => users.push(toRow(rec.uid, profiles[rec.uid] || {}, rec)));
      }
      users.sort((a, b) => a.regAt - b.regAt);
      for (let i = 0; i < users.length; i += 150) {
        const r = await callSheet({ action: "bulk", users: users.slice(i, i + 150) }, 55000);
        if (!r || !r.ok) return res.status(502).json({ ok: false, error: (r && r.error) || "sheet" });
      }
      return res.status(200).json({ ok: true, count: users.length });
    }

    const rec = await adm.auth().getUser(tok.uid);
    if (!rec.emailVerified) return res.status(403).json({ ok: false, error: "verify koro" });
    const s = await db.doc("users/" + tok.uid).get();
    if (!s.exists) return res.status(404).json({ ok: false, error: "profile nai" });
    const r = await callSheet({ action: "upsert", user: toRow(tok.uid, s.data(), rec) });
    return res.status(r && r.ok ? 200 : 502).json({ ok: !!(r && r.ok) });
  } catch (e) {
    console.error("sheet-sync error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
