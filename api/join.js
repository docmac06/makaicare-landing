// POST /api/join  { phone: "+14155550123", channels: ["whatsapp", "imessage"], source: "hero" | "join" }
// Saves a waitlist signup to the private "makai-waitlist" Blob store as waitlist/<digits>.json.
// One file per number, so signing up twice just refreshes the same entry. Browse them in
// Vercel → Storage → makai-waitlist.
import { put } from '@vercel/blob';

const E164 = /^\+[1-9]\d{7,14}$/;
const CHANNELS = ['whatsapp', 'imessage'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  // bots fill the hidden "company" field; pretend it worked and keep nothing
  if (body.company) return res.status(200).json({ ok: true });

  const phone = String(body.phone || '').replace(/[\s().-]/g, '');
  if (!E164.test(phone)) return res.status(400).json({ ok: false, error: 'invalid_phone' });
  const channels = CHANNELS.filter(c => Array.isArray(body.channels) && body.channels.includes(c));
  if (!channels.length) return res.status(400).json({ ok: false, error: 'no_channel' });

  const entry = {
    phone,
    channels,
    source: ['hero', 'join'].includes(body.source) ? body.source : 'site',
    joinedAt: new Date().toISOString(),
    country: req.headers['x-vercel-ip-country'] || null,
  };
  try {
    await put(`waitlist/${phone.slice(1)}.json`, JSON.stringify(entry, null, 2), {
      access: 'private',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch (err) {
    console.error('waitlist write failed', err);
    return res.status(500).json({ ok: false, error: 'storage_failed' });
  }
  return res.status(200).json({ ok: true });
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
