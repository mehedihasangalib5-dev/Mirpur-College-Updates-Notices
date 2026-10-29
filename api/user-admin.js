// POST /api/user-admin   Header: Authorization: Bearer <Firebase ID token>   (Admin / Owner)
//   { action: "block" | "unblock" | "remove", uid }
//        Owner        -> sathe sathe kaj hoy
//        Admin        -> kaj hoy NA; "studentRequests"-e ekta request jomay, Owner review kore approve korle tobei hoy
//   { action: "approve" | "reject" | "cancel", requestId, reason? }   approve/reject = shudhu Owner; cancel = request-kari ba Owner
//   { action: "requests" }  -> Owner: sob pending + recent; Admin: nijer request-gulo
// Scope-wala Admin shudhu nijer Year/Dept-er student-er jonno request korte pare. Admin/Editor account-e kono action cholbe na.
const { init, TOPIC, sameOrigin, body, bearerUser, staffInfo, inScope, callSheet, toRow } = require("./_lib");

const LABEL = { block: "Block", unblock: "Unblock", remove: "Remove" };

// target student valid kina (admin account noy, scope-er moddhe)
async function checkTarget(adm, db, st, uid) {
  const cfg = await db.doc("config/admins").get();
  const c = cfg.exists ? cfg.data() : {};
  const protectedEmails = [...(c.emails || []), ...(c.editors || [])].map((e) => String(e).toLowerCase());
  let rec = null;
  try { rec = await adm.auth().getUser(uid); } catch (e) { if (e.code !== "auth/user-not-found") throw e; }
  if ((c.ids || []).includes(uid) || (rec && rec.email && protectedEmails.includes(rec.email.toLowerCase())))
    return { error: "admin account-e eta kora jay na", status: 403 };
  const ps = await db.doc("users/" + uid).get();
  const prof = ps.exists ? ps.data() : null;
  if (st.scope.length && !(prof && inScope(st.scope, prof)))
    return { error: "Ei student apnar Year/Department scope-er baire", status: 403 };
  return { rec, prof };
}

// asol kaj (shudhu Owner-er hate, ba Owner approve korle)
async function execute(adm, db, action, uid, ctx, actor) {
  const auth = adm.auth(), FV = adm.firestore.FieldValue, ref = db.doc("users/" + uid);
  let sheet = true;
  const toSheet = async (payload) => { try { const r = await callSheet(payload); if (!r || !r.ok) sheet = false; } catch (e) { sheet = false; } };
  const unsubDevices = async () => {
    try {
      const s = await db.doc("pushTokens/" + uid).get();
      const t = s.exists ? (s.data().tokens || []) : [];
      if (t.length) await adm.messaging().unsubscribeFromTopic(t, TOPIC);
    } catch (e) {}
  };
  const { rec } = ctx;
  if (action === "block") {
    if (!rec) return { error: "user nai", status: 404 };
    await auth.updateUser(uid, { disabled: true });
    await auth.revokeRefreshTokens(uid);
    await unsubDevices();
    const s = await ref.get();
    if (s.exists) await ref.update({ blocked: true, blockedAt: Date.now(), blockedBy: String(actor || "").slice(0, 120) });
    await toSheet({ action: "upsert", user: { ...toRow(uid, s.exists ? s.data() : {}, { ...rec.toJSON(), disabled: true, metadata: rec.metadata }), blocked: true } });
  } else if (action === "unblock") {
    if (!rec) return { error: "user nai", status: 404 };
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
  return { ok: true, sheet };
}

// Owner-ke (best effort) phone-e jananor jonno
async function pingOwner(adm, db, text) {
  try {
    const c = (await db.doc("config/admins").get()).data() || {};
    const em = (c.emails || [])[0];
    let ouid = (c.ids || [])[0];
    if (em) { try { ouid = (await adm.auth().getUserByEmail(String(em).toLowerCase())).uid; } catch (e) {} }
    if (!ouid) return;
    const t = (await db.doc("pushTokens/" + ouid).get());
    const tokens = t.exists ? (t.data().tokens || []) : [];
    if (tokens.length) await adm.messaging().sendEachForMulticast({ tokens, data: { title: "Student request (review lagbe)", body: text, url: "/admin", tag: "stu-req" }, webpush: { headers: { Urgency: "high", TTL: "86400" } } });
  } catch (e) {}
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });

  try {
    const adm = init();
    const tok = await bearerUser(adm, req);
    if (!tok) return res.status(401).json({ ok: false, error: "login" });
    const st = await staffInfo(adm, tok);
    if (!st.admin) return res.status(403).json({ ok: false, error: "admin na" });

    const db = adm.firestore();
    const b = body(req), action = b.action;
    const col = db.collection("studentRequests");

    // ---------- request list ----------
    if (action === "requests") {
      const [pend, recent] = await Promise.all([col.where("status", "==", "pending").limit(100).get(), col.orderBy("ts", "desc").limit(40).get()]);
      const seen = new Map();
      [...pend.docs, ...recent.docs].forEach((d) => seen.set(d.id, { id: d.id, ...d.data() }));
      let items = [...seen.values()].sort((a, c) => (c.ts || 0) - (a.ts || 0));
      if (!st.owner) items = items.filter((x) => x.by === tok.uid);
      return res.status(200).json({ ok: true, items });
    }

    // ---------- review: approve / reject / cancel ----------
    if (["approve", "reject", "cancel"].includes(action)) {
      const rid = String(b.requestId || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);
      if (!rid) return res.status(400).json({ ok: false, error: "bad request" });
      const rref = col.doc(rid), rs = await rref.get();
      if (!rs.exists) return res.status(404).json({ ok: false, error: "request nai" });
      const r = rs.data();
      if (r.status !== "pending") return res.status(409).json({ ok: false, error: "Ei request age-i " + r.status });
      const now = Date.now(), who = String(tok.email || "").slice(0, 120);
      if (action === "cancel") {
        if (!st.owner && r.by !== tok.uid) return res.status(403).json({ ok: false, error: "shudhu request-kari ba Owner" });
        await rref.update({ status: "cancelled", reviewedBy: tok.uid, reviewedEmail: who, reviewedAt: now });
        return res.status(200).json({ ok: true });
      }
      if (!st.owner) return res.status(403).json({ ok: false, error: "shudhu Owner approve/reject korte pare" });
      if (action === "reject") {
        await rref.update({ status: "rejected", reason: String(b.reason || "").slice(0, 200), reviewedBy: tok.uid, reviewedEmail: who, reviewedAt: now });
        return res.status(200).json({ ok: true });
      }
      // approve -> asol kaj
      const ctx = await checkTarget(adm, db, st, r.uid);
      if (ctx.error) return res.status(ctx.status).json({ ok: false, error: ctx.error });
      let out = { ok: true, sheet: true };
      if (!(r.action === "remove" && !ctx.rec && !ctx.prof)) out = await execute(adm, db, r.action, r.uid, ctx, who);   // age-i muche gele aar kichu lagbe na
      if (out.error) return res.status(out.status || 500).json({ ok: false, error: out.error });
      await rref.update({ status: "approved", reviewedBy: tok.uid, reviewedEmail: who, reviewedAt: now });
      return res.status(200).json({ ok: true, sheet: out.sheet, action: r.action, uid: r.uid });
    }

    // ---------- direct action ----------
    const uid = b.uid;
    if (!["block", "unblock", "remove"].includes(action) || typeof uid !== "string" || !uid || uid.length > 128)
      return res.status(400).json({ ok: false, error: "bad request" });
    if (uid === tok.uid) return res.status(400).json({ ok: false, error: "nijeke korte parben na" });

    const ctx = await checkTarget(adm, db, st, uid);
    if (ctx.error) return res.status(ctx.status).json({ ok: false, error: ctx.error });

    if (st.owner) {                                   // Owner: sathe sathe
      const out = await execute(adm, db, action, uid, ctx, tok.email);
      if (out.error) return res.status(out.status || 500).json({ ok: false, error: out.error });
      return res.status(200).json({ ok: true, sheet: out.sheet });
    }

    // Admin: request jomao, Owner review korbe
    if (!ctx.rec && !ctx.prof) return res.status(404).json({ ok: false, error: "user nai" });
    const dup = await col.where("uid", "==", uid).where("status", "==", "pending").get();
    const same = dup.docs.find((d) => d.data().action === action);
    if (same) return res.status(200).json({ ok: true, pending: true, requestId: same.id, existing: true });
    const p = ctx.prof || {};
    const rref = col.doc();
    await rref.set({
      action, uid, name: String(p.name || (ctx.rec && ctx.rec.displayName) || "").slice(0, 80), email: String((ctx.rec && ctx.rec.email) || p.email || "").slice(0, 120),
      year: p.year || "", dept: p.dept || "", by: tok.uid, byEmail: String(tok.email || "").slice(0, 120), ts: Date.now(), status: "pending",
    });
    await pingOwner(adm, db, (tok.email || "Admin") + " -> " + LABEL[action] + ": " + (p.name || p.email || uid));
    return res.status(200).json({ ok: true, pending: true, requestId: rref.id });
  } catch (e) {
    console.error("user-admin error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
