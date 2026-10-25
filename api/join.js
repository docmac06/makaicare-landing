// POST /api/join  { phone: "+14155550123", source: "hero" | "join" }
// Saves a waitlist signup in two places:
//   1. the "MAKAI waitlist" Google Form, whose linked Sheet "MAKAI waitlist (Responses)" is the list to read
//      (form id in WAITLIST_FORM_ID, kept out of this public repo);
//   2. the private "makai-waitlist" Blob store as waitlist/<digits>.json, a backup (one file per number).
// The sign-up counts as saved if either write succeeds.
import { put } from '@vercel/blob';

const E164 = /^\+[1-9]\d{7,14}$/;
// question ids of the Google Form: Phone, Source, Country (its Channels question is no longer used)
const FIELD = { phone: 'entry.1928729108', source: 'entry.1976967182', country: 'entry.439988013' };

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

  const entry = {
    phone,
    source: ['hero', 'join'].includes(body.source) ? body.source : 'site',
    joinedAt: new Date().toISOString(),
    country: req.headers['x-vercel-ip-country'] || null,
  };
  const [sheet, blob] = await Promise.allSettled([toSheet(entry), toBlob(entry)]);
  if (sheet.status === 'rejected') console.error('waitlist sheet write failed', sheet.reason);
  if (blob.status === 'rejected') console.error('waitlist blob write failed', blob.reason);
  if (sheet.status === 'rejected' && blob.status === 'rejected') return res.status(500).json({ ok: false, error: 'storage_failed' });
  return res.status(200).json({ ok: true });
}

async function toSheet(entry) {
  const form = process.env.WAITLIST_FORM_ID;
  if (!form) throw new Error('WAITLIST_FORM_ID is not set');
  const fields = new URLSearchParams({
    [FIELD.phone]: entry.phone,
    [FIELD.source]: entry.source,
    [FIELD.country]: entry.country || '',
  });
  const r = await fetch(`https://docs.google.com/forms/d/e/${form}/formResponse`, {
    method: 'POST', body: fields, signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) throw new Error(`Google Form answered ${r.status}`);
}

function toBlob(entry) {
  return put(`waitlist/${entry.phone.slice(1)}.json`, JSON.stringify(entry, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

function safeJson(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
