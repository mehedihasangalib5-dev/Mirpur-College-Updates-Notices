// Shared helper (underscore = Vercel eta route hishebe dekhabe na)
const admin = require("firebase-admin");

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

module.exports = { init, TOPIC, sameOrigin, body };
