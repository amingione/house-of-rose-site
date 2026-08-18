# Amber — Digital Business Card (`/amber/`)

Tap-to-share contact page for Amber Mingione, styled to match the black-and-gold
House of Rose Canva business card. Built for NFC taps, QR scans, and link shares.

## Files
| File | Purpose |
|------|---------|
| `packages/web/src/pages/amber.astro` | The page. **Self-contained** — renders its own `<html>` doc, intentionally **without** the site `Header`/`Footer` so it reads as a clean contact card. Includes canonical + OG tags, favicon, and `Person` JSON-LD. |
| `packages/web/public/amber.vcf` | The downloadable vCard 3.0. The **"Save My Contact"** button links to `/amber.vcf` with a `download` attribute. |

## Why static (not Sanity-backed)
It's a one-off card with fixed contact data — no CMS value. Because it never
imports `lib/queries`, `sanityFetch`, or a `*_QUERY`, the visual-editing coverage
gate (`scripts/visual-editing/check-coverage.mjs`) skips it automatically. No
allow-list entry or `data-sb-*` annotations required.

## Editing the contact details
Start NAP changes in Sanity `siteSettings` and the canonical facts in `CLAUDE.md`. Then mirror the
approved values in both static card files and keep them identical:
1. The `const` block at the top of `amber.astro` (`PHONE_E164`, `EMAIL`, address, etc.).
2. `public/amber.vcf` (the actual contact file phones import).

## NAP — canonical (source of truth = Sanity `siteSettings`)
- Phone: **(941) 400-0165** → E.164 `+19414000165`
- Email: **info@houseofrosefl.com**
- Address: **525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950** — note **"Unit 9"**,
  never "Suite/F" (the Canva card prints "Suite 9"; the site follows the
  canonical `Unit 9` for local-SEO consistency).

## Make it a real tap-to-share
1. Deploy — the page is live at `https://houseofrosefl.com/amber/` after the next build.
2. **QR:** point Amber's QR code at `https://houseofrosefl.com/amber/`.
3. **NFC:** write that same URL to an NTAG215 card/tag with the free "NFC Tools" app
   (Write → Add a record → URL). Tap a phone to the card → the page opens →
   "Save My Contact" adds her to contacts.

## URL note
Astro `build.format` is `directory`, so `amber.astro` serves at the trailing-slash
URL `/amber/`. Always link to it **with** the trailing slash.
