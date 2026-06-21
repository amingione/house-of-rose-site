# Color Palette — House of Rose Aesthetics
*Generated via 02-Visual/02 · 2026-06-21 · sampled from the real logo + tagline lockup. Aligned to Phase 01.*

The palette is drawn directly from the brand assets: the burgundy rose, the antique-gold monogram,
the ivory baby's breath, and the warm greige backdrop. Romantic and editorial — **never clinical,
never a coffin.** Lead with warm light (ivory/greige); use ink and burgundy as grounding depth, gold
as the precious accent.

## Primary

| Name | Hex | RGB | CMYK (approx) | Use |
|------|-----|-----|---------------|-----|
| **House Burgundy** (the rose) | `#5C1F2E` | 92,31,46 | 30 / 90 / 60 / 40 | Primary brand depth — reversed lockups, rich blocks, accents |
| **Antique Gold** (the monogram) | `#C9A24B` | 201,162,75 | 22 / 35 / 80 / 5 | Precious accent — the monogram, rules, fine detail. Used sparingly |
| **Ivory** | `#F4ECDC` | 244,236,220 | 4 / 6 / 14 / 0 | Primary light ground — pages, space, breathing room |
| **Ink** | `#14110F` | 20,17,15 | 65 / 62 / 65 / 75 | Primary text + deep grounding (never a flat black) |

## Secondary / supporting

| Name | Hex | Use |
|------|-----|-----|
| **Warm Greige** | `#C7BBA9` | Soft backgrounds, the lockup backdrop, muted UI surfaces |
| **Champagne Gold (soft)** | `#D9BD79` | Gold-on-dark text, hover states, lighter gilding |
| **Mauve Rose** | `#8E5A66` | Mid-tone tint of the burgundy for charts/illustration/states |
| **Baby's-Breath White** | `#F8F4EC` | Near-white for cards/insets above ivory |
| **Muted Sage Stem** | `#8A8B6F` | Botanical accent only — never a primary; nods to the bouquet |

## Accent for CTAs & highlights
- **Primary CTA:** House Burgundy `#5C1F2E` fill, Ivory text. **Hover:** deepen to `#4A1825`.
- **Secondary CTA:** Ivory fill, Ink text, Antique-Gold 1px border.
- Gold is for *detail and delight*, not large fills (large gold reads cheap; keep it precious).

## Usage rules (proportion is the brand)
- **60 / 30 / 10:** ~60% Ivory/Greige light ground · ~30% Ink/Burgundy depth · ~10% Gold + botanicals.
- Never put gradient gold on busy imagery; reverse to ivory/mono.
- Maintain WCAG AA: Ink on Ivory ✓; Ivory on Burgundy ✓; Gold on Ink ✓ (gold on ivory fails for
  text — use gold only for large/decorative, not body copy).

## Tailwind tokens (for the Astro stack)
```js
// tailwind.config — theme.extend.colors
hor: {
  burgundy: '#5C1F2E', burgundyDeep: '#4A1825',
  gold: '#C9A24B', goldSoft: '#D9BD79',
  ivory: '#F4ECDC', breath: '#F8F4EC',
  ink: '#14110F', greige: '#C7BBA9',
  mauve: '#8E5A66', sage: '#8A8B6F',
}
```

*Tagline anchor: "Where beauty blooms within."*
