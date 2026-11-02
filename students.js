// POST /api/students   Header: Authorization: Bearer <Firebase ID token>   (Admin / Owner)
// Admin-er scope (Year + Department) onujayi student list dey. Scope-wala Admin Firestore theke direct
// student list porte pare na (rules block kore) -- tai tara ei API use kore.
const { init, sameOrigin, bearerUser, staffInfo, inScope } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });
  try {
    const adm = init();
    const tok = await bearerUser(adm, req, true);
    if (!tok) return res.status(401).json({ ok: false, error: "login" });
    const st = await staffInfo(adm, tok);
    if (!st.admin) return res.status(403).json({ ok: false, error: "admin na" });
    const snap = await adm.firestore().collection("users").get();
    const users = [];
    snap.forEach((d) => {
      const p = d.data();
      if (!inScope(st.scope, p)) return;
      users.push({ id: d.id, name: p.name || "", email: p.email || "", year: p.year || "", dept: p.dept || "", blocked: !!p.blocked });
    });
    return res.status(200).json({ ok: true, users, scope: st.scope });
  } catch (e) {
    console.error("students error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
