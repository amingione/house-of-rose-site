import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── House of Rose Creative System v1.0 ──
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
          metal: '#8A6A43', // Antique Bronze — decorative fills/rules only
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
        // `charcoal.*` remain the deepest neutral surfaces in the dark system.
        charcoal: {
          DEFAULT: '#0B0B0A',
          light: '#13110F',
          lighter: '#1B1815',
        },
        // Semantic brand tokens
        bone: '#0B0B0A',
        limestone: '#2A2521',
        olive: '#5F624D',
        bronze: '#8A6A43',
        'soft-black': '#070706',
        ink: '#F1EDE5',
        ivory: '#F1EDE5',
        breath: '#12100F',
        greige: '#2A2521',
        green: { DEFAULT: '#5F624D', deep: '#4F5241', sage: '#8D907C', soft: '#25271F' },
        // Warm neutral accents from the actual space (mocha wall, walnut wood)
        taupe: { DEFAULT: '#8A7259', soft: '#211B17' },
        walnut: { DEFAULT: '#241B17', deep: '#17110F' },
        // `cream.*` are light text/border tints on the dark canvas.
        cream: {
          DEFAULT: '#F1EDE5',
          100: '#F1EDE5',
          200: 'rgba(241,237,229,0.72)',
          300: 'rgba(241,237,229,0.30)',
        },
      },
      fontFamily: {
        display: ['Baskerville', '"Libre Baskerville"', 'Georgia', 'serif'],
        serif: ['Baskerville', '"Libre Baskerville"', 'Georgia', 'serif'],
        sans: [
          '"Avenir Next"',
          'Avenir',
          'Arial',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
