# MAKAI landing page

The landing page for MAKAI, an AI care companion for older adults. It books appointments, orders refills, calls the pharmacy and the doctor's office, checks insurance coverage and keeps the family updated, all over iMessage or WhatsApp.

## What's here

| File | What it is |
| --- | --- |
| `index.html` | The whole page: markup, styles and scroll animations in one file, no build step |
| `film.mp4` | The 77-second brand film (1080p30, web encode, about 14 MB) |
| `poster.jpg` | Poster frame shown before the film plays |

Fonts load from Google Fonts. There are no other dependencies.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

It's a static site, so any static host works. Upload the folder as-is to GitHub Pages, Netlify, Vercel or Cloudflare Pages.

## Before launch

- **Early-access form**: it isn't connected to anything yet. On submit it tells the visitor signups aren't connected. Wire the `submit` handler at the bottom of `index.html` (search for `joinForm`) to your signup tool.
- **Example content**: Dr. Patel, Margaret's family, the copay amounts and the appointment times are illustrative.
