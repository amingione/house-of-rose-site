import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── House of Rose brand palette — v2.0 "warm, legible" ──
        //
        // CONTRAST LAW (WCAG 2.1 AA — 4.5:1 body, 3:1 large/UI):
        //   The palette was flipped dark → light, which left the metallic gold
        //   (#C9A24B) sitting at 2.04:1 on ivory — effectively invisible. Gold is
        //   therefore split into TWO roles:
        //
        //   1. `gold`        → CONTEXT-AWARE TEXT/OUTLINE accent, driven by the
        //                      `--hr-gold` CSS var (see global.css). Resolves to a
        //                      deep antique gold (#7A5C2A, 5.27:1) on light surfaces
        //                      and a soft champagne (#E7D6A8, 9.19:1) inside `.on-dark`.
        //                      Use for: text-gold, border-gold, outline-gold.
        //
        //   2. `gold.metal`  → FIXED metallic leaf (#C9A24B). Never used as text on a
        //                      surface; it IS the surface. Always paired with text-ink
        //                      (7.84:1). Use for: bg-gold-metal fills, hairline rules,
        //                      low-opacity decorative borders.
        //
        // Never write `text-gold-metal` — that reintroduces the 2:1 failure.
        gold: {
          DEFAULT: 'rgb(var(--hr-gold) / <alpha-value>)',
          metal: '#C9A24B', // decorative fills/rules only — pair with text-ink
          50: '#FAF6EC',
          100: '#F3E9CF',
          200: '#E7D6A8', // on-dark accent
          300: '#D9BD79',
          400: '#C9A24B',
          500: '#B0883C',
          600: '#8E6C30',
          700: '#6B5126',
          800: '#48361A',
          900: '#2A1F0F',
        },
        // Context-aware SECONDARY text. Replaces the hardcoded dark-theme greys
        // (#9a8c78 @ 2.80:1, #999 @ 2.43:1, #777 @ 3.81:1) that all failed on light.
        //   light surfaces → #5E5548 (6.23:1) · `.on-dark` → #D8CFC0 (8.58:1)
        muted: {
          DEFAULT: 'rgb(var(--hr-muted) / <alpha-value>)',
          strong: 'rgb(var(--hr-muted-strong) / <alpha-value>)', // body copy weight
        },
        // `charcoal.*` kept as token NAMES for compatibility, but remapped to WARM
        // LIGHT surfaces so existing `bg-charcoal*` classes render ivory/greige.
        charcoal: {
          DEFAULT: '#F4ECDC', // ivory — primary page surface
          light: '#EADBC2',   // taupe — accent bands (more pronounced)
          lighter: '#EADFCB', // warm greige — hover/raised surfaces
        },
        // Semantic brand tokens
        ink: '#14110F',       // primary text (never pure black)
        ivory: '#F4ECDC',
        breath: '#F8F4EC',
        greige: '#C7BBA9',
        // Botanical green (the eucalyptus/greenery in the studio) — secondary accent + primary CTA
        green: { DEFAULT: '#3F4D3A', deep: '#2F3A2B', sage: '#8C9A7D', soft: '#B9C2AB' },
        // Warm neutral accents from the actual space (mocha wall, walnut wood)
        taupe: { DEFAULT: '#8A7259', soft: '#EDE2D0' },
        walnut: { DEFAULT: '#3E2C20', deep: '#2C1F16' },
        // `cream.*` repurposed to INK tints so `text-cream*`/`border-cream*` read on light.
        cream: {
          DEFAULT: '#14110F',
          100: '#14110F',
          200: 'rgba(20,17,15,0.72)',
          300: 'rgba(20,17,15,0.30)',
        },
      },
      fontFamily: {
        // Cochin display face — used for the hero wordmark
        display: ['Cochin', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
