// Shared helper (underscore = Vercel eta route hishebe dekhabe na)
const admin = require("firebase-admin");
const crypto = require("crypto");

const TOPIC = "notices";

function init() {
  if (!admin.apps.length) {
    let raw = process.env.FIREBASE_SERVICE_ACCOUNT || "";
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT not set");
    if (raw.trim()[0] !== "{") raw = Buffer.from(raw, "base64").toString("utf8"); // base64 dileo cholbe
    admin.initializeApp({ credential: admin.credential.cert(JSON.parse(raw)) });
  }
  return admin;
}

// same-origin only (onno website jate tomar endpoint use na kore)
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === (req.headers["x-forwarded-host"] || req.headers.host); }
  catch (e) { return false; }
}

function body(req) {
  let b = req.body;
  try { if (typeof b === "string") b = JSON.parse(b || "{}"); } catch (e) { b = {}; }
  return b || {};
}

// "Authorization: Bearer <Firebase ID token>" -> decoded token (ba null)
async function bearerUser(adm, req, checkRevoked) {
  const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  if (!m) return null;
  try { return await adm.auth().verifyIdToken(m[1], !!checkRevoked); } catch (e) { return null; }
}

// Owner / Admin (Editor noy) -- config/admins
async function isAdminUser(adm, user) {
  const cfg = await adm.firestore().doc("config/admins").get();
  const c = cfg.exists ? cfg.data() : {};
  const ids = c.ids || [];
  const emails = (c.emails || []).map((e) => String(e).toLowerCase());
  const em = user.email_verified === true && user.email ? String(user.email).toLowerCase() : "";
  return ids.includes(user.uid) || (!!em && emails.includes(em));
}

// ---- OTP hash (code kokhono plain-e Firestore-e thake na) ----
function otpKey() {
  const k = process.env.OTP_SECRET || process.env.SHEET_SECRET;
  if (!k) throw new Error("SHEET_SECRET not set");
  return k;
}
const hashCode = (uid, code) => crypto.createHmac("sha256", otpKey()).update(uid + ":" + code).digest("hex");
function safeEq(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

// ---- Google Apps Script (Sheet + Mail) ----
async function callSheet(payload, timeoutMs) {
  const url = process.env.SHEET_WEBAPP_URL, secret = process.env.SHEET_SECRET;
  if (!url || !secret) throw new Error("SHEET_WEBAPP_URL / SHEET_SECRET not set");
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs || 20000);
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },   // Apps Script-e preflight laga bondho
      body: JSON.stringify({ ...payload, secret }),
      redirect: "follow",
      signal: ctrl.signal,
    });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch (e) { return { ok: false, error: "bad response (Web app Anyone access + latest deployment check korun)" }; }
  } finally { clearTimeout(t); }
}

// Firestore profile + Firebase Auth record -> Sheet row
function toRow(uid, p, rec) {
  p = p || {};
  const google = (rec.providerData || []).some((x) => x.providerId === "google.com");
  return {
    uid,
    name: p.name || rec.displayName || "",
    email: rec.email || p.email || "",
    year: p.year || "",
    dept: p.dept || "",
    method: google ? "Google" : "Email",
    verified: !!rec.emailVerified,
    blocked: !!rec.disabled || !!p.blocked,
    regAt: Date.parse(rec.metadata.creationTime) || Date.now(),
    lastLogin: Date.parse(rec.metadata.lastSignInTime) || 0,
  };
}

module.exports = { toRow, init, TOPIC, sameOrigin, body, bearerUser, isAdminUser, hashCode, safeEq, callSheet };
