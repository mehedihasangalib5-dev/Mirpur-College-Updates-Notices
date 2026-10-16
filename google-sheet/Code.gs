/**
 * ============================================================
 *  MCUN — Registered Students (Google Sheet) + Verification Mailer
 * ============================================================
 *  Ei ekta script-i duto kaj kore:
 *   1) Website-e keu register/login korle tar row auto Sheet-e add/update hoy  (action: upsert / bulk)
 *      Admin panel theke Block korle Status = Blocked, Remove korle row muche jay (action: remove)
 *   2) Email Verification Code (OTP) email-e pathay                             (action: mail)
 *
 *  SETUP (ekbar-i):
 *   1. Notun Google Sheet kholo  ->  Extensions > Apps Script  ->  ei pura code paste koro.
 *   2. Niche SECRET-er "CHANGE_ME..." bodle ekta lomba random password dao (Vercel-e-o EKI ta dibe: SHEET_SECRET).
 *   3. Upor theke function "setup" select kore  ▶ Run  -> Permission Allow koro. (Sheet sundor format hoye jabe)
 *   4. Deploy > New deployment > type: Web app
 *        Execute as: Me      |   Who has access: Anyone
 *      -> Deploy -> "Web app URL" copy koro -> Vercel-e SHEET_WEBAPP_URL hishebe dao.
 *   5. Code bodlale: Deploy > Manage deployments > Edit(pencil) > Version: New version > Deploy.
 * ============================================================
 */

const SECRET = "CHANGE_ME_TO_A_LONG_RANDOM_SECRET";   // <-- eta bodlao (Vercel SHEET_SECRET-er sathe mil thakte hobe)
const SITE_NAME = "Mirpur College Updates & Notices";
const TZ = "Asia/Dhaka";

const SHEET_NAME = "Students";
const DASH_NAME = "Dashboard";
const HEADER_ROW = 4, FIRST = 5, MAX_ROWS = 2000;
const HEADERS = ["No.", "Registered At", "Name", "Email", "Year", "Department", "Sign-in", "Status", "Last Login", "UID"];
const C = { NO: 1, REG: 2, NAME: 3, EMAIL: 4, YEAR: 5, DEPT: 6, METHOD: 7, STATUS: 8, LAST: 9, UID: 10 };
const YEARS = ["HSC 1st Year", "HSC 2nd Year"];
const DEPTS = ["Science", "Arts", "Commerce"];

/* ------------------------------------------------------------------ */
/*  Web endpoint                                                       */
/* ------------------------------------------------------------------ */
function doGet() {
  return json_({ ok: true, service: "MCUN sheet api" });
}

function doPost(e) {
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (SECRET.indexOf("CHANGE_ME") === 0 || d.secret !== SECRET) return json_({ ok: false, error: "unauthorized" });
    switch (d.action) {
      case "mail":   return json_(sendCode_(d));
      case "upsert": return json_(upsert_([d.user]));
      case "bulk":   return json_(upsert_(d.users || []));
      case "remove": return json_(remove_(d.uid));
      case "ping":   return json_({ ok: true });
      default:       return json_({ ok: false, error: "unknown action" });
    }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ */
/*  Email: verification code                                           */
/* ------------------------------------------------------------------ */
function sendCode_(d) {
  const to = String(d.to || "").trim();
  const code = String(d.code || "");
  if (!/^\S+@\S+\.\S+$/.test(to)) return { ok: false, error: "bad email" };
  if (!/^\d{6}$/.test(code)) return { ok: false, error: "bad code" };
  if (MailApp.getRemainingDailyQuota() < 1) return { ok: false, error: "quota" };

  const ttl = Number(d.ttl) || 10;
  const name = String(d.name || "").slice(0, 80);
  const hi = name ? "Hi " + name + "," : "Hi,";

  const text = [
    SITE_NAME, "",
    hi, "",
    "Your verification code is: " + code, "",
    "This code expires in " + ttl + " minutes. Do not share it with anyone.",
    "If you didn't create an account, you can safely ignore this email.", "",
    "আপনার Verification Code: " + code + " (" + ttl + " মিনিট পর্যন্ত কার্যকর)"
  ].join("\n");

  MailApp.sendEmail({
    to: to,
    subject: code + " is your verification code — " + SITE_NAME,
    body: text,
    htmlBody: mailHtml_(esc_(name), code, ttl),
    name: SITE_NAME
  });
  return { ok: true };
}

function mailHtml_(name, code, ttl) {
  const digits = code.split("").map(function (c) {
    return '<td style="padding:0 4px"><div style="width:42px;height:54px;line-height:54px;text-align:center;font-size:28px;font-weight:800;color:#1e3a8a;background:#eef2ff;border:1px solid #c7d2fe;border-radius:10px;font-family:Arial,sans-serif">' + c + '</div></td>';
  }).join("");
  return '' +
  '<div style="background:#f4f6fb;padding:28px 12px;font-family:Segoe UI,Arial,sans-serif;color:#0f172a">' +
    '<table role="presentation" align="center" width="100%" style="max-width:480px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e4e8f1">' +
      '<tr><td style="background:linear-gradient(135deg,#2850e8,#7c5cff);padding:22px 26px;color:#fff">' +
        '<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.85">Email Verification</div>' +
        '<div style="font-size:20px;font-weight:800;margin-top:4px">' + esc_(SITE_NAME) + '</div>' +
      '</td></tr>' +
      '<tr><td style="padding:26px">' +
        '<p style="margin:0 0 6px;font-size:16px;font-weight:700">' + (name ? "Hi " + name + "," : "Hi,") + '</p>' +
        '<p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#475569">আপনার account verify করতে নিচের ৬ সংখ্যার code-টি website-এ বসান।<br>Use this code to verify your email address.</p>' +
        '<table role="presentation" align="center" style="margin:0 auto 20px"><tr>' + digits + '</tr></table>' +
        '<p style="margin:0 0 6px;font-size:13px;color:#475569;text-align:center">⏱ Code <b>' + ttl + ' মিনিট</b> পর্যন্ত কার্যকর (expires in ' + ttl + ' min)</p>' +
        '<p style="margin:0;font-size:12px;color:#94a3b8;text-align:center">কাউকে এই code দেবেন না। আপনি account না খুলে থাকলে এই email উপেক্ষা করুন।</p>' +
      '</td></tr>' +
      '<tr><td style="padding:14px 26px;background:#f8fafc;border-top:1px solid #e4e8f1;font-size:11.5px;color:#94a3b8;text-align:center">© ' + new Date().getFullYear() + ' ' + esc_(SITE_NAME) + '</td></tr>' +
    '</table>' +
  '</div>';
}

function esc_(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
  });
}

/* ------------------------------------------------------------------ */
/*  Students sheet: add / update rows                                  */
/* ------------------------------------------------------------------ */
function upsert_(list) {
  list = (list || []).filter(function (u) { return u && u.uid; });
  if (!list.length) return { ok: true, added: 0, updated: 0 };

  const lock = LockService.getScriptLock();
  lock.waitLock(25000);                       // ekshathe onek jon register korleo row mix hobe na
  try {
    const sh = studentsSheet_();
    const last = Math.max(sh.getLastRow(), HEADER_ROW);
    const n = last - HEADER_ROW;
    const rows = n > 0 ? sh.getRange(FIRST, 2, n, 9).getValues() : [];     // columns B..J
    const byUid = {}, byEmail = {};
    rows.forEach(function (r, i) {
      if (r[C.UID - 2]) byUid[String(r[C.UID - 2])] = i;
      if (r[C.EMAIL - 2]) byEmail[String(r[C.EMAIL - 2]).toLowerCase()] = i;
    });

    const touched = {}; let added = 0, updated = 0; const firstNew = rows.length;
    list.forEach(function (u) {
      const email = String(u.email || "").toLowerCase();
      let i = byUid[u.uid];
      if (i === undefined && email) i = byEmail[email];
      let r;
      if (i === undefined) {
        r = ["", "", "", "", "", "", "", "", ""];
        rows.push(r); i = rows.length - 1; added++;
        r[C.REG - 2] = new Date(u.regAt || Date.now());
        r[C.STATUS - 2] = "Pending";
      } else { r = rows[i]; updated++; if (!r[C.REG - 2] && u.regAt) r[C.REG - 2] = new Date(u.regAt); }

      if (u.name)  r[C.NAME - 2] = String(u.name).slice(0, 80);
      if (email)   r[C.EMAIL - 2] = email;
      if (u.year)  r[C.YEAR - 2] = u.year;
      if (u.dept)  r[C.DEPT - 2] = u.dept;
      if (u.method) r[C.METHOD - 2] = u.method;
      if (u.blocked === true) r[C.STATUS - 2] = "Blocked";      // Admin block korle
      else if (u.verified) r[C.STATUS - 2] = "Verified";        // Verified kokhono Pending hoy na
      else if (u.blocked === false && r[C.STATUS - 2] === "Blocked") r[C.STATUS - 2] = "Pending";
      if (u.lastLogin) r[C.LAST - 2] = new Date(u.lastLogin);
      r[C.UID - 2] = u.uid;
      byUid[u.uid] = i; if (email) byEmail[email] = i;
      touched[i] = true;
    });

    const need = FIRST + rows.length;
    if (sh.getMaxRows() < need) sh.insertRowsAfter(sh.getMaxRows(), need - sh.getMaxRows() + 200);

    const idx = Object.keys(touched).map(Number).sort(function (a, b) { return a - b; });
    if (idx.length > 30) {
      sh.getRange(FIRST, 2, rows.length, 9).setValues(rows);
    } else {
      idx.forEach(function (i) { sh.getRange(FIRST + i, 2, 1, 9).setValues([rows[i]]); });
    }
    if (rows.length > firstNew) {                              // notun row-e serial number formula
      const f = []; for (let k = firstNew; k < rows.length; k++) f.push(["=ROW()-" + (HEADER_ROW)]);
      sh.getRange(FIRST + firstNew, 1, f.length, 1).setFormulas(f);
    }
    return { ok: true, added: added, updated: updated };
  } finally {
    lock.releaseLock();
  }
}

// Students sheet-er ekta column-er bounded range, jemon rng_("D") -> Students!$D$5:$D$2000
function rng_(col) { return SHEET_NAME + "!$" + col + "$" + FIRST + ":$" + col + "$" + MAX_ROWS; }

// Admin panel theke student remove korle tar row muche dey
function remove_(uid) {
  if (!uid) return { ok: false, error: "no uid" };
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    const sh = studentsSheet_();
    const n = Math.max(sh.getLastRow(), HEADER_ROW) - HEADER_ROW;
    if (n < 1) return { ok: true, removed: 0 };
    const ids = sh.getRange(FIRST, C.UID, n, 1).getValues();
    let removed = 0;
    for (let i = ids.length - 1; i >= 0; i--) {            // niche theke upore, jate row index na bhange
      if (String(ids[i][0]) === String(uid)) { sh.deleteRow(FIRST + i); removed++; }
    }
    return { ok: true, removed: removed };
  } finally {
    lock.releaseLock();
  }
}

function studentsSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || setup();
}

/* ------------------------------------------------------------------ */
/*  One-time setup: professional formatting + dashboard                */
/* ------------------------------------------------------------------ */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TZ);

  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME, 0);
  const ncol = HEADERS.length;

  if (sh.getMaxColumns() > ncol) sh.deleteColumns(ncol + 1, sh.getMaxColumns() - ncol);
  if (sh.getMaxRows() < MAX_ROWS) sh.insertRowsAfter(sh.getMaxRows(), MAX_ROWS - sh.getMaxRows());
  sh.setHiddenGridlines(true);
  sh.setTabColor("#2850e8");
  sh.setFrozenRows(HEADER_ROW);

  // --- banner (row 1-2)
  sh.getRange(1, 1, 1, ncol).merge().setValue("🎓  " + SITE_NAME + " — Registered Students")
    .setBackground("#1e3a8a").setFontColor("#ffffff").setFontSize(18).setFontWeight("bold")
    .setVerticalAlignment("middle").setHorizontalAlignment("left");
  sh.setRowHeight(1, 50);
  sh.getRange(2, 1, 1, ncol).merge()
    .setBackground("#eff6ff").setFontColor("#1e3a8a").setFontWeight("bold").setFontSize(10)
    .setVerticalAlignment("middle").setHorizontalAlignment("left");
  sh.getRange(2, 1).setFormula('="Total: "&IFERROR(COUNTA(' + rng_("D") + '),0)&"   •   Verified: "&IFERROR(COUNTIF(' + rng_("H") + ',"Verified"),0)&"   •   Pending: "&IFERROR(COUNTIF(' + rng_("H") + ',"Pending"),0)&"   •   Blocked: "&IFERROR(COUNTIF(' + rng_("H") + ',"Blocked"),0)&"   •   Website theke auto-update hoy"');
  sh.setRowHeight(2, 28);
  sh.getRange(3, 1, 1, ncol).setBackground("#ffffff"); sh.setRowHeight(3, 8);

  // --- header (row 4)
  sh.getRange(HEADER_ROW, 1, 1, ncol).setValues([HEADERS])
    .setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold").setFontSize(10)
    .setHorizontalAlignment("center").setVerticalAlignment("middle");
  sh.setRowHeight(HEADER_ROW, 36);
  sh.getRange(HEADER_ROW, C.NAME, 1, 2).setHorizontalAlignment("left");

  // --- body
  const body = sh.getRange(FIRST, 1, MAX_ROWS - HEADER_ROW, ncol);
  body.setFontFamily("Arial").setFontSize(10).setVerticalAlignment("middle").setFontColor("#0f172a");
  sh.getRange(FIRST, C.NO, MAX_ROWS - HEADER_ROW, 1).setHorizontalAlignment("center").setFontColor("#64748b");
  sh.getRange(FIRST, C.REG, MAX_ROWS - HEADER_ROW, 1).setNumberFormat("dd mmm yyyy, hh:mm AM/PM").setHorizontalAlignment("center");
  sh.getRange(FIRST, C.LAST, MAX_ROWS - HEADER_ROW, 1).setNumberFormat("dd mmm yyyy, hh:mm AM/PM").setHorizontalAlignment("center");
  sh.getRange(FIRST, C.NAME, MAX_ROWS - HEADER_ROW, 2).setHorizontalAlignment("left");
  sh.getRange(FIRST, C.YEAR, MAX_ROWS - HEADER_ROW, 4).setHorizontalAlignment("center");
  sh.getRange(FIRST, C.UID, MAX_ROWS - HEADER_ROW, 1).setFontColor("#94a3b8").setFontSize(8).setHorizontalAlignment("left");

  const widths = [52, 175, 190, 250, 120, 120, 90, 95, 175, 230];
  widths.forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });

  // --- conditional formatting (colour chips + zebra rows)
  const rule = function (col, text, bg, fg) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(text).setBackground(bg).setFontColor(fg).setBold(true)
      .setRanges([sh.getRange(FIRST, col, MAX_ROWS - HEADER_ROW, 1)]).build();
  };
  const rules = [
    rule(C.STATUS, "Verified", "#dcfce7", "#166534"),
    rule(C.STATUS, "Pending", "#fef3c7", "#92400e"),
    rule(C.STATUS, "Blocked", "#fee2e2", "#991b1b"),
    rule(C.DEPT, "Science", "#dbeafe", "#1e40af"),
    rule(C.DEPT, "Arts", "#fce7f3", "#9d174d"),
    rule(C.DEPT, "Commerce", "#ede9fe", "#5b21b6"),
    rule(C.METHOD, "Google", "#fee2e2", "#991b1b"),
    rule(C.METHOD, "Email", "#e0f2fe", "#075985"),
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND($D5<>"",ISEVEN(ROW()))').setBackground("#f8fafc")
      .setRanges([sh.getRange(FIRST, 1, MAX_ROWS - HEADER_ROW, ncol)]).build()
  ];
  sh.setConditionalFormatRules(rules);

  // --- filter + header protection
  if (sh.getFilter()) sh.getFilter().remove();
  sh.getRange(HEADER_ROW, 1, MAX_ROWS - HEADER_ROW + 1, ncol).createFilter();
  sh.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function (p) {
    if (p.getDescription() === "MCUN header") p.remove();
  });
  sh.getRange(1, 1, HEADER_ROW, ncol).protect().setDescription("MCUN header").setWarningOnly(true);

  // default "Sheet1" khali thakle muche dao
  const s1 = ss.getSheetByName("Sheet1");
  if (s1 && s1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s1);

  buildDashboard_(ss);
  ss.setActiveSheet(sh);
  return sh;
}

function buildDashboard_(ss) {
  let d = ss.getSheetByName(DASH_NAME);
  if (!d) d = ss.insertSheet(DASH_NAME, 1);
  d.getCharts().forEach(function (c) { d.removeChart(c); });
  d.getRange(1, 1, d.getMaxRows(), d.getMaxColumns()).breakApart();
  d.clear();
  SpreadsheetApp.flush();
  d.setHiddenGridlines(true); d.setTabColor("#7c5cff");
  d.setColumnWidth(1, 20); for (let i = 2; i <= 9; i++) d.setColumnWidth(i, 112); d.setColumnWidth(10, 20);

  const BORDER = "#e2e8f0", SOLID = SpreadsheetApp.BorderStyle.SOLID;
  const head = function (range) {
    range.setBackground("#0f172a").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center");
  };

  d.getRange("B1:I1").merge();
  d.getRange("B1").setValue("📊  Registration Dashboard");
  d.getRange("B1:I1").setBackground("#1e3a8a").setFontColor("#ffffff").setFontSize(18).setFontWeight("bold").setVerticalAlignment("middle");
  d.setRowHeight(1, 50); d.setRowHeight(2, 10); d.setRowHeight(3, 24); d.setRowHeight(4, 52);

  // ---- KPI cards (formula shudhu prothom cell-e)
  const cards = [
    ["B", "C", "TOTAL STUDENTS", "=IFERROR(COUNTA(" + rng_("D") + "),0)", "#2850e8"],
    ["D", "E", "VERIFIED", '=IFERROR(COUNTIF(' + rng_("H") + ',"Verified"),0)', "#16a34a"],
    ["F", "G", "JOINED TODAY", '=IFERROR(COUNTIFS(' + rng_("B") + ',">="&TODAY()),0)', "#d97706"],
    ["H", "I", "LAST 7 DAYS", '=IFERROR(COUNTIFS(' + rng_("B") + ',">="&(TODAY()-6)),0)', "#7c5cff"]
  ];
  cards.forEach(function (c) {
    d.getRange(c[0] + "3:" + c[1] + "3").merge();
    d.getRange(c[0] + "4:" + c[1] + "4").merge();
    d.getRange(c[0] + "3").setValue(c[2]);
    d.getRange(c[0] + "4").setFormula(c[3]);
    d.getRange(c[0] + "3:" + c[1] + "3").setFontSize(9).setFontWeight("bold").setFontColor("#64748b").setHorizontalAlignment("center").setBackground("#f8fafc");
    d.getRange(c[0] + "4:" + c[1] + "4").setFontSize(28).setFontWeight("bold").setFontColor(c[4]).setHorizontalAlignment("center").setVerticalAlignment("middle").setBackground("#f8fafc");
    d.getRange(c[0] + "3:" + c[1] + "4").setBorder(true, true, true, true, null, null, BORDER, SOLID);
  });

  // ---- Year x Department (value formula-r bhitore literal text, header cell-er upor nirbhor kore na)
  d.getRange("B6").setValue("Year × Department").setFontWeight("bold").setFontSize(12).setFontColor("#0f172a");
  d.getRange("B7:F7").setValues([["Year"].concat(DEPTS).concat(["Total"])]);
  head(d.getRange("B7:F7"));
  YEARS.forEach(function (y, i) {
    const r = 8 + i, row = [y];
    DEPTS.forEach(function (dep) {
      row.push('=IFERROR(COUNTIFS(' + rng_("E") + ',"' + y + '",' + rng_("F") + ',"' + dep + '"),0)');
    });
    row.push("=SUM(C" + r + ":E" + r + ")");
    d.getRange(r, 2, 1, 5).setFormulas([row]);
  });
  d.getRange("B10:F10").setFormulas([["Total", "=SUM(C8:C9)", "=SUM(D8:D9)", "=SUM(E8:E9)", "=SUM(F8:F9)"]])
    .setFontWeight("bold").setBackground("#eff6ff");
  d.getRange("B8:F10").setHorizontalAlignment("center").setBorder(true, true, true, true, true, true, BORDER, SOLID);
  d.getRange("B8:B10").setHorizontalAlignment("left");

  // ---- Status
  d.getRange("H6").setValue("Status").setFontWeight("bold").setFontSize(12);
  d.getRange("H7:I7").setValues([["Type", "Count"]]); head(d.getRange("H7:I7"));
  d.getRange("H8:I11").setFormulas([
    ["Verified", '=IFERROR(COUNTIF(' + rng_("H") + ',"Verified"),0)'],
    ["Pending", '=IFERROR(COUNTIF(' + rng_("H") + ',"Pending"),0)'],
    ["Blocked", '=IFERROR(COUNTIF(' + rng_("H") + ',"Blocked"),0)'],
    ["Google sign-in", '=IFERROR(COUNTIF(' + rng_("G") + ',"Google"),0)']
  ]);
  d.getRange("H10:I10").setFontColor("#991b1b").setFontWeight("bold");
  d.getRange("H8:I11").setHorizontalAlignment("center").setBorder(true, true, true, true, true, true, BORDER, SOLID);

  // ---- Last 14 days
  d.getRange("B29").setValue("Last 14 days").setFontWeight("bold").setFontSize(12);
  d.getRange("B30:C30").setValues([["Date", "New students"]]); head(d.getRange("B30:C30"));
  const tr = [];
  for (let k = 0; k < 14; k++) {
    const r = 31 + k;
    tr.push(["=TODAY()-" + (13 - k), '=IFERROR(COUNTIFS(' + rng_("B") + ',">="&B' + r + ',' + rng_("B") + ',"<"&(B' + r + '+1)),0)']);
  }
  d.getRange("B31:C44").setFormulas(tr);
  d.getRange("B31:B44").setNumberFormat("dd mmm").setHorizontalAlignment("center");
  d.getRange("C31:C44").setNumberFormat("0").setHorizontalAlignment("center");
  d.getRange("B31:C44").setBorder(true, true, true, true, true, true, BORDER, SOLID);

  // ---- Charts
  const c1 = d.newChart().setChartType(Charts.ChartType.COLUMN).addRange(d.getRange("B7:E9"))
    .setPosition(12, 2, 0, 0)
    .setOption("title", "Students by Year & Department").setOption("width", 440).setOption("height", 300)
    .setOption("legend", { position: "bottom" }).setOption("colors", ["#2563eb", "#db2777", "#7c3aed"]).build();
  const c2 = d.newChart().setChartType(Charts.ChartType.AREA).addRange(d.getRange("B30:C44"))
    .setPosition(12, 6, 0, 0)
    .setOption("title", "New registrations — last 14 days").setOption("width", 440).setOption("height", 300)
    .setOption("legend", { position: "none" }).setOption("colors", ["#2850e8"]).build();
  d.insertChart(c1); d.insertChart(c2);
}

/* ------------------------------------------------------------------ */
/*  Menu + tests                                                       */
/* ------------------------------------------------------------------ */
function onOpen() {
  SpreadsheetApp.getUi().createMenu("MCUN")
    .addItem("Setup / Rebuild formatting", "setup")
    .addItem("Send test email to me", "testMail")
    .addToUi();
}

function testMail() {
  const me = Session.getEffectiveUser().getEmail();
  const r = sendCode_({ to: me, code: "123456", name: "Test", ttl: 10 });
  SpreadsheetApp.getActiveSpreadsheet().toast(r.ok ? "Test email pathano hoyeche: " + me : "Error: " + r.error, "MCUN", 6);
}
