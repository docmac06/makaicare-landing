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

The hero and the blue "join" section each have the same waitlist sign-up ("Join the waitlist"): just a phone number
(country code defaults to +1). Submitting posts to `/api/join`, which validates the number and saves it in two places:

1. **The Google Sheet "MAKAI waitlist (Responses)"** in manav@makaicare.com's Drive. This is the list to read: one row per
   sign-up with Timestamp, Phone, Source (hero or join) and Country (from Vercel's IP geolocation). The Channels column
   is left over from an earlier version with WhatsApp/iMessage checkboxes and stays empty now. The function
   fills the unlisted Google Form "MAKAI waitlist", which is linked to that Sheet. The form's id lives in the Vercel env
   var `WAITLIST_FORM_ID`, not in this public repo. The question ids are in `api/join.js` (`FIELD`); if you edit the
   form's questions, update them there.
2. **A backup** in the private Vercel Blob store `makai-waitlist`, as `waitlist/<number>.json` (one file per number, so a
   repeat sign-up overwrites rather than duplicates). Browse it in Vercel → Storage → makai-waitlist.

A sign-up counts as saved if either write succeeds; failures are logged in the Vercel function logs.

## Notes

- **Example content**: Dr. Patel, Margaret's family, the copay amounts and the appointment times are illustrative.
