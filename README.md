# MAKAI landing page

The landing page for MAKAI, an AI care companion for older adults. It books appointments, orders refills, calls the pharmacy and the doctor's office, checks insurance coverage and keeps the family updated, all over iMessage or WhatsApp.

## What's here

| File | What it is |
| --- | --- |
| `index.html` | The whole page: markup, styles and scroll animations in one file, no build step |
| `api/join.js` | Vercel function behind the waitlist sign-up: saves each phone number to private Vercel Blob storage |
| `film.mp4` | The 77-second brand film (1080p30, web encode, about 14 MB) |
| `poster.jpg` | Poster frame shown before the film plays |

Fonts load from Google Fonts. The only dependency is `@vercel/blob`, used by the sign-up function.

## Run it locally

With the Vercel CLI linked to the project, this runs the page and the sign-up function together:

```bash
npx vercel dev
```

Opening `index.html` directly works for the page itself, but sign-ups need the function.

## Deploy

The site is hosted on Vercel (project `makaicare-landing`, served at makaicare.com). Deploy with:

```bash
npx vercel deploy --prod
```

The page is static, but the sign-up form needs `api/join.js` to run as a Vercel function.

## Waitlist signups

The hero and the blue "join" section each have the same waitlist sign-up ("Join the waitlist"): a phone number (country code defaults to +1) and two
checkboxes, WhatsApp and iMessage, at least one required. Submitting posts to `/api/join`, which validates the number
and saves it to the **private** Vercel Blob store `makai-waitlist` as `waitlist/<number>.json`:

```json
{ "phone": "+14155550123", "channels": ["whatsapp", "imessage"], "source": "hero", "joinedAt": "…", "country": "US" }
```

To see sign-ups, open Vercel → Storage → **makai-waitlist**. Each file is named by its phone number, and signing up
again with the same number updates that file instead of adding a duplicate. `country` comes from Vercel's IP geolocation.

## Notes

- **Example content**: Dr. Patel, Margaret's family, the copay amounts and the appointment times are illustrative.
