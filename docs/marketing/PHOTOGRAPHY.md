# Photography — the House of Rose image library

Graded photography of the actual Punta Gorda studio.

**One library, one home: `packages/web/public/images/house-of-rose/`.**
Do not create a second one. (A duplicate `images/space/` briefly existed and was
removed — if you find yourself about to add a parallel directory of the same
rooms, stop and extend this one instead.)

## Layout

```
images/house-of-rose/
  card/  hero/  og/  port/  space/  square/  tile/  wide/
images/providers/        Amber, Diana, Brandy
images/before-after/     treatment proof
```

`space/` is the flat mirror — every subject at every ratio, `<subject>-<ratio>.webp`.
It's what `index.astro` and `packages/index.astro` reference, so prefer it for new
work. The per-ratio directories hold the same assets grouped by shape.

| Ratio key | Pixels    | Used by |
|-----------|-----------|---------|
| `hero`    | 2400×1350 | `Hero.astro` full-bleed backgrounds (16:9) |
| `tile`    | 1400×875  | Homepage service-group tiles (`aspect-[16/10]`) |
| `wide`    | 2100×900  | Collection hero banners (`aspect-[21/9]`) |
| `card`    | 1200×900  | Collection / package / blog cards (4:3) |
| `square`  | 1200×1200 | Service + product cards (`aspect-square`) |
| `og`      | 1200×630  | Social share |
| `port`    | 1000×1400 | Editorial vertical (5:7) |

Not every subject exists at every ratio — only where the crop actually works.
Check the directory before referencing; a missing image fails silently in the
browser, which is exactly how the bugs below went unnoticed.

## Background-only assets

`bg-texture-serum`, `bg-texture-Procell`, `bg-texture-glass` come from soft-focus
source frames. They are deliberately defocused and darkened.

**Use them behind text only. Never as product cards.** The source is out of focus
and no amount of sharpening fixes that. Real product cards use brand-supplied
imagery.

## The grade

Warm-ivory editorial, matched to the Tailwind palette (ivory `#F4ECDC`, gold
`#C9A24B`, walnut `#3E2C20`). Order matters:

1. **White balance** — illuminant estimated from the brightest 10% of pixels (the
   walls and ceiling, which we know are meant to be white) and neutralised at 85%
   strength. This is what kills the fluorescent yellow-green cast. Partial, not
   full, because we *want* residual warmth.
2. **Highlight rolloff** — Reinhard shoulder so blown ceilings and lamp hotspots
   regain texture instead of clipping to flat white.
3. **Filmic S-curve** — shadows lifted (a spa reads open and airy, never crushed).
4. **CLAHE** on the L channel only — shape and depth without touching colour.
5. **Chroma denoise** — YCrCb split, Cr/Cb smoothed hard, **Y left alone**. iPhone
   indoor noise is almost entirely chroma speckle; this kills it at no cost to
   real detail.
6. **Warm-ivory split-tone** — highlights toward ivory/gold, shadows toward a
   faintly cool neutral. Warm gold light, cool walnut shadow. The highlight/shadow
   *separation* is what makes an image read *graded* rather than *filtered*.
7. **Lens undistort + vignette + output sharpen** — removes the iPhone ultra-wide
   barrel bulge that bows straight walls.

Heroes sit under a near-black scrim (`rgba(10,8,6,0.62–0.88)`), so the grade is
biased bright — the photos are built to survive that overlay.

## Cropping policy

Grading fixes colour. It does **not** fix content. Every export is pre-cropped to
remove the amateur tells: plastic-wrapped treatment beds, wall outlets, light
switches, dangling cords, ceiling tiles, exit signs. Some source frames get cut
entirely for this reason. If you add a photo, crop it to the same standard.

## Fixed in this pass

- **`/logos/hr-monogram-2026/` did not exist.** `BaseLayout.astro` and
  `structuredData.ts` both referenced it, so **every page's favicon and OG image
  was 404-ing** — silently, because browsers don't complain. Now generated from
  the gold monogram: `favicon.ico`, `favicon-{16,32,48,192}.png`,
  `apple-touch-icon.png`, `monogram-gold-512.png`, `og.png`.

- **JSON-LD `logo` pointed at a 1200×630 photo.** Google wants an actual logo
  there. Repointed to the square `monogram-gold-512.png`; `og.png` remains the
  social share card.

- **7 dead image references.** A jpg→webp conversion renamed the files without
  updating the source. `hor-lounge/-skin-studio/-exterior/-lobby.jpg` → `.webp`;
  `new-injectables/-wellness/-microchanneling.webp` were deleted outright and now
  point at their equivalents in `house-of-rose/space/`; `PORTAIT-BANNER` was a
  typo for `PORTRAIT-BANNER`.

**Guard against regressions** — this one-liner catches every dead image path:

```zsh
cd packages/web && grep -rhoE '/(images|logos)/[A-Za-z0-9._/-]+\.(png|jpg|jpeg|webp|svg|ico)' src/ \
  | sort -u | while read p; do [ -f "public$p" ] || echo "BROKEN -> $p"; done
```

Worth wiring into CI. It would have caught all seven.

## Open item — hor-exterior has no real photo

`hor-exterior.webp` (used on `/contact` and `/experience`) still isn't a photo of
the actual storefront — no exterior shot exists yet. Worth shooting, especially
for GBP consistency and the locally-grounded requirement in
`docs/SEO-AEO-PLAYBOOK.md`.
