// POST /api/user-admin  { action: "block" | "unblock" | "remove", uid }
// Shudhu Owner/Admin. Student-ke block (login bondho) / unblock / pura remove kore.
//  block   -> Firebase Auth user disabled + session revoke + users/{uid}.blocked = true
//  unblock -> abar chalu
//  remove  -> Auth account + profile + Sheet row sob muche jay
const { init, TOPIC, sameOrigin, body, bearerUser, staffInfo, inScope, callSheet, toRow } = require("./_lib");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  try {
    const adm = init();
    const tok = await bearerUser(adm, req);
    if (!tok) return res.status(401).json({ ok: false, error: "login" });
    const st = await staffInfo(adm, tok);
    if (!st.admin) return res.status(403).json({ ok: false, error: "admin na" });

    const { action, uid } = body(req);
    if (!["block", "unblock", "remove"].includes(action) || typeof uid !== "string" || !uid || uid.length > 128)
      return res.status(400).json({ ok: false, error: "bad request" });
    if (uid === tok.uid) return res.status(400).json({ ok: false, error: "nijeke korte parben na" });

    const db = adm.firestore(), auth = adm.auth(), FV = adm.firestore.FieldValue;

    // Admin / Editor account-e kono action cholbe na
    const cfg = await db.doc("config/admins").get();
    const c = cfg.exists ? cfg.data() : {};
    const protectedEmails = [...(c.emails || []), ...(c.editors || [])].map((e) => String(e).toLowerCase());
    let rec = null;
    try { rec = await auth.getUser(uid); } catch (e) { if (e.code !== "auth/user-not-found") throw e; }
    if ((c.ids || []).includes(uid) || (rec && rec.email && protectedEmails.includes(rec.email.toLowerCase())))
      return res.status(403).json({ ok: false, error: "admin account-e eta kora jay na" });

    const ref = db.doc("users/" + uid);
    // scope-wala Admin shudhu nijer Year/Dept-er student-er upor kaj korte pare
    if (st.scope.length) {
      const ps = await ref.get();
      if (!ps.exists || !inScope(st.scope, ps.data()))
        return res.status(403).json({ ok: false, error: "Ei student apnar Year/Department scope-er baire" });
    }
    let sheet = true;
    const toSheet = async (payload) => {
      try { const r = await callSheet(payload); if (!r || !r.ok) sheet = false; } catch (e) { sheet = false; }
    };

    // block / remove korle oi student-er sob device notification topic theke bad
    const unsubDevices = async () => {
      try {
        const s = await db.doc("pushTokens/" + uid).get();
        const t = s.exists ? (s.data().tokens || []) : [];
        if (t.length) await adm.messaging().unsubscribeFromTopic(t, TOPIC);
      } catch (e) {}
    };

    if (action === "block") {
      if (!rec) return res.status(404).json({ ok: false, error: "user nai" });
      await auth.updateUser(uid, { disabled: true });
      await auth.revokeRefreshTokens(uid);                               // cholte thaka session-o bondho hobe
      await unsubDevices();
      const s = await ref.get();
      if (s.exists) await ref.update({ blocked: true, blockedAt: Date.now(), blockedBy: String(tok.email || "").slice(0, 120) });
      await toSheet({ action: "upsert", user: { ...toRow(uid, s.exists ? s.data() : {}, { ...rec.toJSON(), disabled: true, metadata: rec.metadata }), blocked: true } });
    } else if (action === "unblock") {
      if (!rec) return res.status(404).json({ ok: false, error: "user nai" });
      await auth.updateUser(uid, { disabled: false });
      const s = await ref.get();
      if (s.exists) await ref.update({ blocked: FV.delete(), blockedAt: FV.delete(), blockedBy: FV.delete() });
      const p = s.exists ? s.data() : {};
      delete p.blocked;
      await toSheet({ action: "upsert", user: { ...toRow(uid, p, { ...rec.toJSON(), disabled: false, metadata: rec.metadata }), blocked: false } });
    } else {
      await unsubDevices();
      await db.doc("pushTokens/" + uid).delete().catch(() => {});
      try { await db.recursiveDelete(db.collection("users/" + uid + "/inbox")); } catch (e) {}
      if (rec) await auth.deleteUser(uid);
      await ref.delete().catch(() => {});
      await db.doc("emailCodes/" + uid).delete().catch(() => {});
      await toSheet({ action: "remove", uid });
    }
    return res.status(200).json({ ok: true, sheet });
  } catch (e) {
    console.error("user-admin error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
