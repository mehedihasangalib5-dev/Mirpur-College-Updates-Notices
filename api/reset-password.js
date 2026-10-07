// POST /api/reset-password  { email, password }
// Email + new password dilei password bodle dey (email verify lage na).
// FIREBASE_SERVICE_ACCOUNT lagbe (Vercel env) -- push notification-er moto-i.
// SOTORKO: je email jane se-i oi account-er password bodlate pare. Tai Admin account block kora ache.
const { init, sameOrigin, body } = require("./_lib");

const hits = new Map(); // best-effort rate limit (serverless instance-er memory-te)
function limited(key, max, ms) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter((t) => now - t < ms);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}
const fail = (res, code, error) => res.status(code).json({ ok: false, error });

module.exports = async (req, res) => {
  if (req.method !== "POST") return fail(res, 405, "Method not allowed");
  if (!sameOrigin(req)) return fail(res, 403, "Not allowed");

  const b = body(req);
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, "Email ta thik noy");
  if (password.length < 6 || password.length > 64) return fail(res, 400, "Password 6 theke 64 character-er moddhe hote hobe");

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "ip";
  if (limited("ip:" + ip, 10, 3600e3) || limited("em:" + email, 5, 3600e3))
    return fail(res, 429, "Onek bar try hoyeche, kichukkhon pore abar chesta korun");

  try {
    const admin = init();
    const auth = admin.auth();

    let user;
    try { user = await auth.getUserByEmail(email); }
    catch (e) {
      if (e && e.code === "auth/user-not-found") return fail(res, 404, "Ei Email-e kono Account nei");
      throw e;
    }

    // Google diye khola account-e password jog kora jabe na
    if (!user.providerData.some((p) => p.providerId === "password"))
      return fail(res, 400, "Ei Account Google diye khola — Google diye Login korun");

    // Admin account ekhan theke reset kora jabe na (error hole-o block: fail closed)
    const snap = await admin.firestore().doc("config/admins").get();
    const a = snap.exists ? snap.data() : {};
    const emails = (a.emails || []).map((x) => String(x).toLowerCase());
    const ids = a.ids || [];
    if (emails.includes(email) || ids.includes(user.uid))
      return fail(res, 403, "Admin Account-er Password ekhan theke reset kora jay na");

    await auth.updateUser(user.uid, { password });
    await auth.revokeRefreshTokens(user.uid); // purono login session bondho
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("reset-password error", e && e.message);
    return fail(res, 500, "Server-e problem hoyeche, pore abar chesta korun");
  }
};