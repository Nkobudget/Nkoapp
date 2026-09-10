// Replace YOUR_DOMAIN below with your actual production domain(s) — e.g. 'https://nko-nko.vercel.app'.
// If you use a custom domain too, add it to ALLOWED_ORIGINS as a second entry.
const ALLOWED_ORIGINS = ['https://YOUR_DOMAIN.vercel.app'];

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Requests from origins not in ALLOWED_ORIGINS never get an Allow-Origin header above,
  // so browsers block the response client-side — this stops casual/browser-based abuse.
  // It does NOT stop a direct server-to-server request (curl, another backend), since CORS
  // is a browser-enforced mechanism, not a server-side one. Closing that fully requires
  // verifying the caller is a real logged-in NKÒ user (a Supabase auth token check) — flagged
  // separately below, not implemented here since it needs a client-side change too.

  try {
    const { system, messages, max_tokens = 8000 } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens,
        system,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
