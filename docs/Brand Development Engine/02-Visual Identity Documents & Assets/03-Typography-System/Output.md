# Typography System — House of Rose Aesthetics
*Generated via 02-Visual/03 · 2026-06-21 · derived from the monogram serif + the tagline's tracked sans. Aligned to Phase 01.*

Two voices, echoing the logo: a **classical high-contrast serif** (the monogram's Roman-capital
elegance) and a **wide-tracked light sans** (the "WHERE BEAUTY BLOOMS WITHIN" lockup). Editorial,
confident, generous with space.

## Type families (all free / web-safe, license-clean for the Astro stack)

| Role | Typeface | Notes |
|------|----------|-------|
| **Display / Headings** | **Cormorant Garamond** | High-contrast serif; carries the monogram's fashion-house elegance. Use light/medium weights, large. |
| **Eyebrow / Tagline / Labels** | **Montserrat** (Light, all-caps, tracked) | Matches the lockup's spaced sans. Use 300–400 weight, letter-spacing 0.28–0.36em, uppercase. |
| **Body / UI** | **EB Garamond** (or Montserrat Regular for dense UI) | Readable, warm, editorial. Serif body for marketing; sans body acceptable for app/dashboard UI. |

> Note: the **monogram** itself is a fixed logo asset (Trajan-like Roman caps) — don't re-typeset it.
> Cormorant is the *living* heading face that harmonizes with it.

## Hierarchy (web — rem @ 16px base)

| Style | Family / weight | Size / line-height | Tracking | Case |
|-------|-----------------|--------------------|----------|------|
| H1 | Cormorant Garamond 500 | 3.5rem / 1.05 | 0 | Sentence |
| H2 | Cormorant Garamond 500 | 2.5rem / 1.1 | 0 | Sentence |
| H3 | Cormorant Garamond 600 | 1.75rem / 1.2 | 0 | Sentence |
| Eyebrow | Montserrat 300 | 0.8rem / 1.4 | 0.32em | UPPER |
| Body L | EB Garamond 400 | 1.25rem / 1.6 | 0 | Sentence |
| Body | EB Garamond 400 | 1.0625rem / 1.65 | 0 | Sentence |
| Caption | Montserrat 400 | 0.8125rem / 1.5 | 0.02em | Sentence |
| Button | Montserrat 500 | 0.875rem / 1 | 0.12em | UPPER |
| Price ("From $X") | Cormorant Garamond 600 | inherit | 0 | — |

## Rules
- **Sentence case** in body and headings; uppercase reserved for eyebrows, buttons, the tagline.
- Headings set **large and airy**; let whitespace do the luxury work.
- Never bold-stack or ALL-CAPS body copy. Italic Cormorant for grace notes (pull-quotes, the tagline
  in text).
- Pair ratio: one display serif + one tracked sans per layout — don't introduce a third family.

## Tailwind tokens
```js
fontFamily: {
  display: ['"Cormorant Garamond"','serif'],
  body: ['"EB Garamond"','serif'],
  ui: ['Montserrat','sans-serif'],
},
letterSpacing: { eyebrow: '0.32em', button: '0.12em' }
```

## Licensing
Cormorant Garamond, EB Garamond, Montserrat — all **SIL Open Font License**, free for web + print +
embedding. Self-host via the repo or Google Fonts.

*Tagline anchor: "Where beauty blooms within."*
