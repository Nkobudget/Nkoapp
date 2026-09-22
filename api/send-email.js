// Same CORS pattern as api/claude.js — replace YOUR_DOMAIN below with your actual
// production domain(s), matching whatever you already set in claude.js.
const ALLOWED_ORIGINS = ['https://nko-three.vercel.app'];

// The sender must be a verified sender in Brevo — same address you verified
// when setting up SMTP for password reset emails (SMTP & API → Senders).
const SENDER_EMAIL = 'zestproductionco@gmail.com';
const SENDER_NAME = 'NKÒ';

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, subject, html, text } = req.body;
    if (!to || !subject || (!html && !text)) {
      return res.status(400).json({ error: 'Missing to, subject, or html/text' });
    }

    // This is Brevo's API key, NOT the SMTP key used for Supabase Auth — a separate
    // credential from Brevo's SMTP & API → API Keys tab (different tab than SMTP).
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: `Brevo error: ${errText}` });
    }

    const data = await response.json();
    return res.status(200).json({ ok: true, messageId: data.messageId });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
