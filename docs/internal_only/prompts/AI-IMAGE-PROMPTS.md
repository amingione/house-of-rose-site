# AI Image Prompts — House of Rose Aesthetics

Reference-grounded DALL·E / GPT Image prompts for generating supplemental photography that matches the real Punta Gorda studio (see `docs/marketing/PHOTOGRAPHY.md` for the source library and grade this extends) and the actual service menu in `CLAUDE.md`. Use these where real photography doesn't exist yet — treatment-in-progress shots, the storefront exterior replacement, and service-specific hero art — never to fabricate a "different" studio.

## Brand photography DNA (bake into every prompt)

- **Palette**: warm ivory `#F4ECDC` highlights, antique gold `#C9A24B` accents (signage, hardware, candlesticks), espresso/walnut cabinetry (near-black `#2B211B`), cream/bone upholstery, dusty-rose and blush florals as the only saturated color pop, warm greige walls, travertine-tone tile floors.
- **Style**: photorealistic editorial interior/beauty photography — NOT 3D render, NOT illustration, NOT CGI-glossy. Shot on a full-frame DSLR with a 35mm or 50mm lens, shallow depth of field (f/2–f/2.8), true-to-life skin texture and fabric weave. Think boutique med-spa photography for a magazine feature, not stock photography.
- **Lighting**: soft diffused daylight from sheer-curtained windows mixed with warm practical lighting (recessed ceiling cans, brass sconces); highlight rolloff so nothing clips to flat white; gentle shadow lift so the room reads open and airy, never moody or clinical.
- **Mood**: quiet luxury, calm, unhurried, boutique — not day-spa casual, not clinical/sterile medical. Warmth over sparkle.
- **Never**: neon signage, purple/teal spa clichés, bamboo/zen-stone clichés, overtly medical/sterile framing (no exam-room fluorescents, no visible needles in graphic close-up), no logos other than the real House of Rose gold wordmark, no recognizable real people/faces (use hands, silhouettes, or generic non-identifiable models to stay compliant with `docs/SEO-AEO-PLAYBOOK.md`'s no-overclaiming rule).

Dimensions follow the site's existing ratio system so exports drop straight into `packages/web/public/images/space/`:

| Ratio key | Pixels | Use |
|---|---|---|
| `hero` | 2400×1350 (16:9) | Hero.astro full-bleed backgrounds |
| `wide` | 2100×900 (21:9) | Collection hero banners |
| `tile` | 1400×875 (16:10) | Homepage service-group tiles |
| `card` | 1200×900 (4:3) | Collection/package cards |
| `square` | 1200×1200 (1:1) | Service/product cards |
| `port` | 1000×1400 (5:7) | Editorial vertical |

---

## 1. Storefront exterior (replaces `hor-exterior.jpg` — no real exterior hero exists yet)

**Prompt:**
"Photorealistic exterior photograph of a small, upscale medical spa storefront in a Florida strip plaza, gray stucco facade with a triangular pediment above the entrance, a polished brass plaque reading 'HOUSE OF ROSE AESTHETICS' centered on the pediment, black-framed glass double doors with gold vinyl lettering, a single tall potted palm beside the entrance, clear blue late-morning sky with soft clouds, empty freshly-striped parking lot in the foreground. Shot on a full-frame DSLR, 24mm lens, eye-level, straight-on architectural composition with corrected vertical lines (no barrel distortion). Bright natural daylight, soft shadows, high clarity. Warm ivory and gold accents against neutral gray stucco and blue sky. Mood: polished, inviting, boutique — not a chain storefront."

- **Composition**: eye-level, centered, straight-on architectural elevation, palm tree as foreground anchor right-of-frame
- **Palette**: gray stucco, gold `#C9A24B` signage, black door frames, sky blue, deep green palm
- **Style**: photorealistic architectural photography, lens-corrected, no distortion
- **Dimensions**: `hero` 2400×1350
- **Lighting**: bright midday sun, soft natural shadow, no harsh flare
- **Mood**: polished, welcoming, boutique storefront

## 2. Reception / lobby (companion to real `hor-lobby.webp`)
**DONE**

**Prompt:**
"Photorealistic interior photograph of a luxury med-spa reception lobby: a dark walnut credenza against a textured bronze feature wall with gold 'HOUSE OF ROSE' lettering, a shelf of minimalist skincare bottles, a low vase of blush pink roses, cream boucle armchairs with brass frames on a faded vintage-style area rug over warm travertine tile, a small marble side table with a lit taper candle, soft sheer curtains filtering daylight from a side window. Shot on a full-frame DSLR, 35mm lens, three-quarter angle from the seating area toward the reception wall, shallow depth of field with the rose bouquet in soft focus foreground. Warm, airy, evenly lit. Photorealistic editorial interior photography, not a render."

- **Composition**: three-quarter angle, seating in foreground, gold wall as focal background
- **Palette**: ivory walls, bronze/gold wall, walnut cabinetry, cream upholstery, blush roses
- **Style**: photorealistic editorial interior photography
- **Dimensions**: `hero` 2400×1350 or `wide` 2100×900
- **Lighting**: soft window daylight + warm recessed cans, no flash
- **Mood**: calm, quietly opulent, unhurried

## 3. Advanced Facials — skin studio treatment in progress (Amber's lane: microchanneling, microneedling, Procell, dermaplaning)
**DONE**

**Prompt:**
"Photorealistic close-up photograph inside a serene medical spa treatment room: a woman's shoulders-and-jaw only (face turned away or softly out of focus, no identifiable features) reclined on a cream leather treatment bed with a white linen drape, a gloved esthetician's hands holding a small microneedling/microchanneling device just above the cheek, a gold articulating light arm angled overhead, a black rolling cart with neatly arranged skincare ampoules and cotton rounds in the soft-focus background, a sage green folded throw at the foot of the bed. Shot on a full-frame DSLR, 50mm macro lens, shallow depth of field (f/2.2), tight three-quarter composition centered on the hands and device. Soft diffused daylight from a side window, warm color temperature, no clinical fluorescent look. Photorealistic beauty/medical-spa editorial photography."

- **Composition**: tight three-quarter shot, hands + device in sharp focus, face anonymized/out of focus
- **Palette**: cream bed leather, sage green throw, warm skin tones, gold light-arm accent
- **Style**: photorealistic macro beauty photography
- **Dimensions**: `square` 1200×1200 or `tile` 1400×875
- **Lighting**: soft window daylight, warm, shallow shadow
- **Mood**: precise, gentle, clinically credible but not sterile

## 4. Advanced Facials — BioRePeel / PRF topical prep flatlay

**Prompt:**
"Photorealistic overhead flatlay photograph on a dark walnut treatment cart: a small glass dish holding a golden-tinted BioRePeel-style peel solution with a fan brush resting beside it, two small amber glass serum vials, a folded white esthetician towel, a few loose dried rose petals, soft brass tray edge visible at the frame border. Shot on a full-frame DSLR, 50mm lens, direct overhead flatlay angle, shallow depth of field with the fan brush and glass dish in crisp focus. Warm, soft window light from one side creating gentle gradient shadow across the dark walnut surface. Photorealistic product/spa still-life photography, not illustration."

- **Composition**: direct overhead flatlay, off-center rule-of-thirds product placement
- **Palette**: walnut dark surface, amber/gold liquids, white linen, blush rose petal accent
- **Style**: photorealistic still-life/product photography
- **Dimensions**: `square` 1200×1200
- **Lighting**: single-side soft window light, gentle gradient shadow
- **Mood**: precise, clean, apothecary-like

## 5. Injectables suite (Diana's lane: tox/filler/PRF injections)

**Prompt:**
"Photorealistic photograph inside a modern medical spa injectables suite: a cream leather treatment chair reclined and empty, matte black cabinetry along the wall, a gold articulating tray table beside the chair holding a covered sterile tray (no visible needles or syringes), a lit round LED magnifying mirror on a gold stand, sheer curtains softly diffusing daylight from a full window, a folded brown velvet throw draped over the chair arm. Shot on a full-frame DSLR, 24-35mm lens, wide three-quarter interior composition emphasizing the empty chair as the subject — implying readiness rather than depicting a procedure. Bright, clean, warm-toned lighting. Photorealistic interior/medical-spa editorial photography."

- **Composition**: wide three-quarter interior, empty chair as hero subject (implies service without depicting a procedure)
- **Palette**: cream chair, matte black cabinetry, gold accents, warm neutral walls
- **Style**: photorealistic interior editorial photography
- **Dimensions**: `hero` 2400×1350 or `card` 1200×900
- **Lighting**: bright diffused window daylight, warm color temperature
- **Mood**: clean, precise, quietly premium — reassuring rather than clinical

## 6. IV Hydration + GLP-1 program (Diana's lane)

**Prompt:**
"Photorealistic photograph of a cozy IV hydration suite: a cream tufted recliner chair angled toward a large window with sheer white curtains, a slim gold IV pole with a clear hydration bag hanging beside the chair, a small round gold side table holding a folded cream blanket and a glass of infused water with citrus slices, warm afternoon light streaming through the sheers casting soft shadow lines across the tile floor. Shot on a full-frame DSLR, 35mm lens, eye-level three-quarter angle from the doorway looking into the sunlit chair. Warm, bright, restful lighting. Photorealistic wellness-interior editorial photography, no visible medical branding."

- **Composition**: eye-level three-quarter, chair centered toward window light
- **Palette**: cream upholstery, gold pole/table, sheer white curtain, warm wood-tone floor
- **Style**: photorealistic wellness/interior editorial photography
- **Dimensions**: `hero` 2400×1350 or `wide` 2100×900
- **Lighting**: strong warm window backlight with soft sheer diffusion
- **Mood**: restful, restorative, bright

## 7. Basic Facials / Waxing room (Brandy & Aundrea's lane)

**Prompt:**
"Photorealistic photograph of a soft, botanical-accented treatment room: a crisp white-linened treatment bed with a folded sage green throw, faux eucalyptus garlands framing a small chalkboard sign and a mirror on the wall, a black rolling cart with neatly organized cotton pads, small ceramic bowls, and skincare bottles, warm ceiling sconce light, travertine-look tile floor with a woven gray runner rug. Shot on a full-frame DSLR, 35mm lens, three-quarter angle from the foot of the bed. Soft warm ambient light, gentle shadow falloff, no harsh highlights. Photorealistic spa-interior editorial photography."

- **Composition**: three-quarter angle from foot of the treatment bed
- **Palette**: white linens, sage green accent, black cart, muted eucalyptus green, warm neutral walls
- **Style**: photorealistic interior editorial photography
- **Dimensions**: `tile` 1400×875 or `card` 1200×900
- **Lighting**: warm ambient ceiling sconce, soft and even
- **Mood**: gentle, tidy, approachable — the "everyday maintenance" room, softer than the advanced suite

## 8. Professional Makeup / Jane Iredale (Aundrea's lane)

**Prompt:**
"Photorealistic overhead flatlay photograph of a professional makeup artist's kit laid out on a marble vanity surface: an open mineral makeup palette in soft neutral tones, two makeup brushes fanned beside it, a small gold hand mirror, a single blush pink rose stem laid diagonally across the frame, soft natural light from the upper left casting gentle brush-bristle shadows. Shot on a full-frame DSLR, 50mm lens, direct overhead flatlay, shallow depth of field with brush tips crisply in focus. Warm neutral palette with a single blush color pop. Photorealistic beauty/product still-life photography."

- **Composition**: overhead flatlay, diagonal rose stem for visual movement
- **Palette**: marble white/gray surface, warm neutral makeup tones, gold mirror, blush rose accent
- **Style**: photorealistic beauty/product still-life photography
- **Dimensions**: `square` 1200×1200
- **Lighting**: soft directional natural light, upper-left key
- **Mood**: polished, artful, editorial-beauty

## 9. Retail wall / shop hero (companion to real `retail-wall-card.webp` — the strongest existing frame)

**Prompt:**
"Photorealistic photograph of a boutique retail display wall inside a medical spa: a floating dark walnut shelf mounted on a textured bronze wall with gold 'HOUSE OF ROSE AESTHETICS' lettering, a curated row of minimalist skincare bottles and boxed product sets, a low brass vase with a loose blush-and-white floral arrangement, two brass candlesticks, a dark walnut cabinet base with polished brass hardware below the shelf. Shot on a full-frame DSLR, 35mm lens, straight-on symmetrical composition centered on the gold lettering, corrected verticals. Warm, even gallery-style lighting with soft highlight rolloff on the bronze wall texture. Photorealistic retail-interior editorial photography."

- **Composition**: straight-on, symmetrical, centered on gold wordmark
- **Palette**: bronze/gold wall, walnut cabinetry, cream product packaging, blush floral accent
- **Style**: photorealistic retail-interior editorial photography, lens-corrected
- **Dimensions**: `wide` 2100×900 or `hero` 2400×1350
- **Lighting**: even warm gallery lighting, soft highlight rolloff
- **Mood**: curated, boutique-retail, quietly premium

## 10. Shop product flatlay (for `/shop` category cards — skincare + gift sets)

**Prompt:**
"Photorealistic overhead flatlay photograph of luxury skincare products arranged on a warm ivory marble surface: three minimalist glass serum bottles with gold caps, a folded cream ribbon, a small kraft gift box tied with twine, a scattering of dried blush rose petals, soft natural shadow beneath each object. Shot on a full-frame DSLR, 50mm macro lens, direct overhead angle, even soft lighting with subtle directional shadow for depth. Warm ivory and gold palette with a single blush accent. Photorealistic product photography, clean and minimal, no illustration or 3D render artifacts."

- **Composition**: overhead flatlay, rule-of-thirds product grouping with negative space for text overlay
- **Palette**: ivory marble, gold caps, cream ribbon, blush petal accent
- **Style**: photorealistic e-commerce product photography
- **Dimensions**: `square` 1200×1200
- **Lighting**: soft even overhead light with gentle directional shadow
- **Mood**: clean, premium, minimal — built to support text/price overlays

---

## Usage notes

- Paste the **Prompt** paragraph as-is into GPT Image / DALL·E 3. The spec table beneath each is for your own QC pass (cropping, placement, file naming) — it isn't part of the prompt itself.
- Generate at the largest supported size, then crop down to the exact pixel dimensions above during export — matches the existing pre-crop discipline described in `docs/marketing/PHOTOGRAPHY.md`.
- Run every output through the same grading pass (`hor_grade.py`) if you want it to sit invisibly next to the real photography — the split-tone (ivory `#F4ECDC` highlight / cool neutral shadow) is what makes graded and generated images match.
- Avoid generating identifiable faces for any treatment-in-progress shot — stay on hands, tools, and environment, consistent with the no-overclaiming rule in `docs/SEO-AEO-PLAYBOOK.md` and general medical-spa compliance practice.
