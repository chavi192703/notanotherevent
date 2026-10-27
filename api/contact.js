// Vercel serverless function: receives the contact form, emails the team,
// and sends the visitor a confirmation. Uses Resend (https://resend.com).
//
// Environment variables (Vercel > Project > Settings > Environment Variables):
//   RESEND_API_KEY   required
//   CONTACT_TO_EMAIL required  - where leads are delivered (your inbox)
//   FROM_EMAIL       optional  - e.g. "Not Another Event <hello@notanotherevent.com>"
//                                (needs the domain verified in Resend; defaults to Resend's test sender)

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clip = (s, n) => String(s == null ? "" : s).slice(0, n);

async function send(key, body) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("Resend " + r.status + ": " + (await r.text()));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return res.status(405).json({ error: "Method not allowed" }); }

  const b = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  // honeypot: bots fill this in. Pretend success.
  if (b.website) return res.status(200).json({ ok: true });

  const name = clip(b.name, 100).trim();
  const email = clip(b.email, 160).trim();
  const message = clip(b.message, 3000).trim();
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
    return res.status(400).json({ error: "Please provide a name, valid email and message." });
  }

  const company = clip(b.company, 120).trim();
  const phone = clip(b.phone, 40).trim();
  const needs = Array.isArray(b.needs) ? b.needs.slice(0, 10).map((n) => clip(n, 40)).join(", ") : "";
  const budget = clip(b.budget, 60);
  const timeline = clip(b.timeline, 40);

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.FROM_EMAIL || "Not Another Event <onboarding@resend.dev>";
  if (!key || !to) {
    console.error("Missing RESEND_API_KEY or CONTACT_TO_EMAIL");
    return res.status(500).json({ error: "Email is not configured." });
  }

  const row = (k, v) => v ? `<tr><td style="padding:6px 14px 6px 0;color:#6b6070"><b>${k}</b></td><td style="padding:6px 0">${esc(v)}</td></tr>` : "";

  try {
    // 1) Lead notification to the team
    await send(key, {
      from, to: to.split(",").map((s) => s.trim()), reply_to: email,
      subject: `New enquiry from ${name}${budget ? " (" + budget + ")" : ""}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:560px">
        <h2 style="margin:0 0 12px">New website enquiry</h2>
        <table>${row("Name", name)}${row("Email", email)}${row("Phone", phone)}${row("Company/event", company)}${row("Needs", needs)}${row("Budget", budget)}${row("Timeline", timeline)}</table>
        <p style="white-space:pre-wrap;background:#f6f1ff;padding:14px;border-radius:10px">${esc(message)}</p>
        <p style="color:#6b6070;font-size:13px">Hit reply to respond directly to ${esc(name)}.</p></div>`,
    });

    // 2) Auto-reply to the visitor (failure here should not fail the request)
    try {
      await send(key, {
        from, to: [email],
        subject: "Thanks for reaching out to Not Another Event",
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#171018">
          <h2 style="color:#6F32C5">Hi ${esc(name.split(" ")[0])}, we got your message!</h2>
          <p>Thanks for telling us about your event. A member of the team will read it and reply within one business day with next steps${budget ? ", keeping your budget (" + esc(budget) + ") in mind" : ""}.</p>
          <p>If you need to add anything, just reply to this email.</p>
          <p>Making events simpler and a lot more fun,<br><b>The Not Another Event team</b></p></div>`,
      });
    } catch (e) { console.error("Auto-reply failed", e.message); }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e.message);
    return res.status(502).json({ error: "Could not send." });
  }
};
