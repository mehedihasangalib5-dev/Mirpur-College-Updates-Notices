// GET /api/env-check  -- TEMPORARY diagnostic. Value kokhono dekhay na, shudhu ache/nei + lomba.
// Kaj shesh hole ei file DELETE kore dao.
module.exports = (req, res) => {
  const want = ["FIREBASE_SERVICE_ACCOUNT", "SHEET_WEBAPP_URL", "SHEET_SECRET"];
  const out = {};
  want.forEach((k) => { const v = process.env[k]; out[k] = v ? { set: true, length: v.length, startsWith: v.trim()[0] } : { set: false }; });
  // nam-e bhul thakle dhorar jonno: FIREBASE/SHEET/SERVICE likha onno variable-er nam
  out.similarNames = Object.keys(process.env).filter((k) => /FIREBASE|SHEET|SERVICE|ACCOUNT/i.test(k) && !want.includes(k));
  out.vercelEnv = process.env.VERCEL_ENV || null;     // production / preview
  res.status(200).json(out);
};
