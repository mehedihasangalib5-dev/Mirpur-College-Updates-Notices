// Vercel Serverless Function: POST /api/contact  ->  Telegram
const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const cut = (v, n) => String(v ?? "").trim().slice(0, n);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  // same-origin only (blocks other websites from using your endpoint)
  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) return res.status(403).json({ ok: false });

  let b = req.body;
  try { if (typeof b === "string") b = JSON.parse(b || "{}"); } catch (e) { b = {}; }
  b = b || {};
  const name = cut(b.name, 80), email = cut(b.email, 120), phone = cut(b.phone, 30),
        subject = cut(b.subject, 150), message = cut(b.message, 2000);
  if (!name || !subject || message.length < 5 || !/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ ok: false, error: "invalid" });

  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return res.status(500).json({ ok: false, error: "not configured" });

  const text = [
    "📨 <b>New Contact Message</b>", "🏫 Mirpur College Updates &amp; Notices", "",
    `👤 <b>${esc(name)}</b>`, `✉️ ${esc(email)}`, phone ? `📞 ${esc(phone)}` : "",
    `📝 <b>${esc(subject)}</b>`, "", esc(message),
  ].filter((x) => x !== "").join("\n");

  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
};
