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
        ivory: '#FAF7F2', // light text/border for the rare remaining dark surface
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
          DEFAULT: '#F1EDE5',
          100: '#F1EDE5',
          200: 'rgba(241,237,229,0.72)',
          300: 'rgba(241,237,229,0.30)',
        },
      },
      fontFamily: {
        // Amber: Cochin + Arial only, everywhere — headings and body.
        // Cochin is a macOS system serif with no web-safe match, so
        // non-Mac visitors fall back straight to Arial.
        display: ['Cochin', 'Arial', 'sans-serif'],
        serif: ['Cochin', 'Arial', 'sans-serif'],
        sans: ['Cochin', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
      },
      boxShadow: {
        border: '0 0 0 1px rgb(22 20 18 / 0.08), 0 1px 2px -1px rgb(22 20 18 / 0.06)',
        'border-hover': '0 0 0 1px rgb(22 20 18 / 0.14), 0 8px 24px -12px rgb(22 20 18 / 0.18)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        quick: '150ms',
        fast: '250ms',
        slow: '400ms',
      },
    },
  },
  plugins: [typography],
} satisfies Config;
