// POST /api/grade   Header: Authorization: Bearer <Firebase ID token>
//  { action:"start", quizId, min }                      -> server-e Exam-er shuru-r somoy (examStarts) likhe, baki somoy (rem ms) ferot dey
//  { quizId, neg, items:[{q:"prosno text", c:chosenIndex|-1}] } -> grade; shuru-r somoy + min + GRACE-er por hole 0 nombor (late)
// Secured Exam (quizzes/{id}.sec == 1): answer key shudhu quizKeys/{id}-e. Attempt ekbar-i (quizAttempts/{uid_quizId}).
const { init, sameOrigin, body, bearerUser } = require("./_lib");

const GRACE_MS = 45 * 1000;   // network + auto-submit-er jonno
const MAX_MIN = (z) => Math.max(60, Math.ceil((z.q || []).length * 0.75));   // client-er option-er sathe mil (5..60 ba N*0.75)

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });
  if (!sameOrigin(req)) return res.status(403).json({ ok: false, error: "origin" });
  const b = body(req), quizId = String(b.quizId || "");
  if (!/^[A-Za-z0-9]{10,40}$/.test(quizId)) return res.status(400).json({ ok: false, error: "format" });
  try {
    const adm = init(), tok = await bearerUser(adm, req, true);
    if (!tok || tok.email_verified !== true) return res.status(401).json({ ok: false, error: "login" });
    const db = adm.firestore(), uid = tok.uid, now = Date.now();

    const [us, qs, ks] = await Promise.all([db.doc("users/" + uid).get(), db.doc("quizzes/" + quizId).get(), db.doc("quizKeys/" + quizId).get()]);
    const u = us.exists ? us.data() : null, z = qs.exists ? qs.data() : null;
    if (!u || u.blocked) return res.status(403).json({ ok: false, error: "user" });
    if (!z || z.mode !== "Exam" || !z.sec || z.draft || (z.at && z.at > now) || !ks.exists)
      return res.status(404).json({ ok: false, error: "quiz" });
    if (!(z.pages || []).includes(u.year + " · " + u.dept)) return res.status(403).json({ ok: false, error: "page" });

    const aRef = db.doc("quizAttempts/" + uid + "_" + quizId), sRef = db.doc("examStarts/" + uid + "_" + quizId);
    const zero = (st) => aRef.create({ uid, quizId, score: 0, correct: 0, wrong: 0, total: 0, used: st.min * 60, late: true, ts: now });

    // ---------- START ----------
    if (b.action === "start") {
      if ((await aRef.get()).exists) return res.status(409).json({ ok: false, error: "done" });
      if (z.dl && now > z.dl) return res.status(410).json({ ok: false, error: "closed" });
      const min = Math.min(MAX_MIN(z), Math.max(1, Math.round(Number(b.min) || 0) || 1));
      const st = await db.runTransaction(async (tx) => {
        const s = await tx.get(sRef);
        if (s.exists) return s.data();           // refresh / tab bondho kore abar shuru korleo somoy reset hoy na
        const d = { uid, quizId, ts: now, min };
        tx.create(sRef, d);
        return d;
      });
      const rem = st.ts + st.min * 60000 - now;
      if (rem + GRACE_MS <= 0) {                   // somoy age-i shesh -> 0 nombor, attempt lock
        try { await zero(st); } catch (e) {}
        return res.status(410).json({ ok: false, error: "expired" });
      }
      return res.status(200).json({ ok: true, rem: Math.max(0, rem), min: st.min });
    }

    // ---------- GRADE ----------
    const items = Array.isArray(b.items) ? b.items : null;
    if (!items || !items.length || items.length > 300 || items.length > (z.q || []).length)
      return res.status(400).json({ ok: false, error: "format" });
    const ss = await sRef.get();
    if (!ss.exists) return res.status(403).json({ ok: false, error: "nostart" });
    const st = ss.data(), late = now > st.ts + st.min * 60000 + GRACE_MS;

    const keys = ks.data().k || [], taken = new Set(), out = [];
    let c = 0, w = 0;
    for (const it of items) {
      const txt = String((it && it.q) || "").trim(), ch = Number(it && it.c);
      const i = keys.findIndex((k, n) => !taken.has(n) && String(k.q || "").trim() === txt);
      if (i < 0) return res.status(400).json({ ok: false, error: "question" });
      taken.add(i);
      out.push({ a: keys[i].a, e: keys[i].e || "" });
      if (!late && Number.isInteger(ch) && ch >= 0) { if (ch === keys[i].a) c++; else w++; }
    }
    const neg = Math.min(1, Math.max(0, Number(b.neg) || 0));
    const sc = Math.max(0, c - w * neg);
    const used = Math.min(Math.round((now - st.ts) / 1000), st.min * 60);

    const done = await db.runTransaction(async (tx) => {
      if ((await tx.get(aRef)).exists) return true;
      const d = { uid, quizId, score: sc, correct: c, wrong: w, total: items.length, used, ts: now };
      if (late) d.late = true;
      tx.create(aRef, d);
      tx.create(db.collection("users/" + uid + "/history").doc(), { ...d, mode: "Exam" });   // alada attempt history
      return false;
    });
    if (done) return res.status(409).json({ ok: false, error: "done" });
    return res.status(200).json({ ok: true, c, w, sc, late, k: out });
  } catch (e) {
    console.error("grade error", e && e.message);
    return res.status(500).json({ ok: false, error: "server" });
  }
};
