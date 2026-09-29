const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");

const TOKEN = defineSecret("8809269882:AAGKZ1EZmnFOJaVQHJiiHkOCb4JWOmC_4v8");
const CHAT = defineSecret("7653803109");
const esc = (s) => String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Runs on every new document in "messages" (created by the website contact form)
exports.notifyTelegram = onDocumentCreated(
  { document: "messages/{id}", secrets: [TOKEN, CHAT] },
  async (event) => {
    const m = event.data && event.data.data();
    if (!m) return;
    const text = [
      "📨 <b>New Contact Message</b>",
      "🏫 Mirpur College Updates &amp; Notices",
      "",
      `👤 <b>${esc(m.name)}</b>`,
      `✉️ ${esc(m.email)}`,
      m.phone ? `📞 ${esc(m.phone)}` : "",
      `📝 <b>${esc(m.subject)}</b>`,
      "",
      esc(m.message),
    ].filter((x) => x !== "").join("\n").slice(0, 4000);

    const res = await fetch(`https://api.telegram.org/bot${TOKEN.value()}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT.value(), text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    if (!res.ok) console.error("Telegram error", res.status, await res.text());
  }
);
