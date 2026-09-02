import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── House of Rose Creative System v3.0 (2026-08-28) — Amber's exact
        // token spec, adopted verbatim and mapped onto the existing semantic
        // names below so every file that already uses `bg-bone`, `text-ink`,
        // `text-gold`, `border-walnut/XX` etc. inherits it automatically.
        //   Background family: paper (lightest) > ivory/bone > cream/breath
        //     > stone/limestone (deepest, placeholder-only).
        //   Text: ink (near-black) > muted > subtle.
        //   Accent: ONE rose value — #8B5A54 — no more multi-step ramp.
        //   Borders: line / line-strong, both applied as low-opacity ink
        //     (matches Amber's own `--shadow-border` pattern of ink at 8–14%).
        gold: {
          DEFAULT: 'rgb(var(--hr-gold) / <alpha-value>)',
          metal: '#8B5A54', // = rose, decorative fills/hairline rules
          50: '#FBF4F2',
          100: '#F1DFDB',
          200: '#DDBAB2',
          300: '#C79A91',
          400: '#A8746A',
          500: '#8B5A54', // rose — THE accent, buttons/links/kickers
          600: '#6F4843', // hover — rose deepened ~20%
          700: '#573834',
          800: '#3F2825',
          900: '#241A1C',
        },
        // Context-aware SECONDARY text: light surfaces → #6F6760 (muted),
        // `.on-dark` → #BE9E8E (unchanged, already a dusty-rose tone).
        muted: {
          DEFAULT: 'rgb(var(--hr-muted) / <alpha-value>)',
          strong: 'rgb(var(--hr-muted-strong) / <alpha-value>)', // body copy weight
        },
        // `charcoal.*` — the LIGHT default canvas.
        charcoal: {
          DEFAULT: '#F4EFE8',
          light: '#FAF7F2',
          lighter: '#FCFAF7',
        },
        // Semantic brand tokens — Amber's exact hex values.
        bone: '#F4EFE8', // = ivory — primary background
        paper: '#FAF7F2', // lightest surface (cards, form fields)
        stone: '#D4CBC0', // deepest neutral — placeholder/media backdrop only
        subtle: '#8A827A', // tertiary text (placeholders, fine print)
        rose: '#8B5A54', // THE accent — same value as gold.500/gold.metal
        limestone: '#D4CBC0', // = stone
        olive: '#464021', // legacy — no longer used as an accent/button fill
        bronze: '#8B5A54', // = rose
        'soft-black': '#161412', // near-black, reserved for the cookie banner only
        ink: '#161412', // Main Text Color — near-black (was warm brown)
        ivory: '#F4EFE8', // primary warm ivory
        breath: '#E8DFD3', // = cream — light card surface, one step deeper than bone
        greige: '#D4CBC0',
        green: { DEFAULT: '#464021', deep: '#302B13', sage: '#302B13', soft: '#DCD6C8' },
        // Warm neutral accents
        taupe: { DEFAULT: '#6F6760', soft: '#EFE8DC' },
        walnut: { DEFAULT: '#161412', deep: '#161412' }, // = ink; kept for legacy class names only, no longer used for hairlines (see `line` below)
        // Amber's exact border tokens — were missing; hairlines were
        // approximated as ink-at-low-opacity instead of these two hex values.
        line: '#D9D0C6',
        'line-strong': '#C4B9AC',
        // `cream.*` — light text/border tints, used on `.on-dark` surfaces.
        cream: {
          DEFAULT: '#E8DFD3',
          100: '#F4EFE8',
          200: 'rgba(241,237,229,0.72)',
          300: 'rgba(241,237,229,0.30)',
        },
      },
      fontFamily: {
        display: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
        sans: ['"Outfit Variable"', 'Outfit', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(3.25rem, 9vw, 7.25rem)', { lineHeight: '1.05', letterSpacing: '0.08em' }],
        'display-sm': ['clamp(2.25rem, 5.5vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '0.08em' }],
        kicker: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.28em' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
        lede: ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.5' }],
      },
      letterSpacing: {
        display: '0.08em',
        label: '0.28em',
        wide: '0.18em',
      },
      lineHeight: {
        display: '1.05',
        body: '1.65',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
      },
      boxShadow: {
        border: 'var(--shadow-border)',
        'border-hover': 'var(--shadow-border-hover)',
      },
      transitionTimingFunction: {
        'out-soft': 'var(--ease-out-soft)',
      },
      transitionDuration: {
        quick: 'var(--duration-quick)',
        fast: 'var(--duration-fast)',
        slow: 'var(--duration-slow)',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
