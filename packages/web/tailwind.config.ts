import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // ── House of Rose brand palette — v1.0 "warm" (Where beauty blooms within) ──
        // Antique gold accent (the HR monogram).
        gold: {
          DEFAULT: '#C9A24B',
          50: '#FAF6EC',
          100: '#F3E9CF',
          200: '#E7D6A8',
          300: '#D9BD79',
          400: '#C9A24B',
          500: '#B0883C',
          600: '#8E6C30',
          700: '#6B5126',
          800: '#48361A',
          900: '#2A1F0F',
        },
        // `charcoal.*` kept as token NAMES for compatibility, but remapped to WARM
        // LIGHT surfaces so existing `bg-charcoal*` classes render ivory/greige.
        charcoal: {
          DEFAULT: '#F4ECDC', // ivory — primary page surface
          light: '#EFE5D4',   // soft taupe — accent bands / header-footer warmth
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
