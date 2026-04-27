import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // House of Rose brand palette — matches mockup design
        gold: {
          DEFAULT: '#C9A96E',
          50: '#FAF8F4',
          100: '#F0EAE0',
          200: '#E1D5BE',
          300: '#D2C09C',
          400: '#C9A96E',
          500: '#B8954F',
          600: '#997A3F',
          700: '#735C30',
          800: '#4D3E20',
          900: '#261F10',
        },
        charcoal: {
          DEFAULT: '#0a0806',
          light: '#070605',
          lighter: '#1a1816',
        },
        cream: {
          DEFAULT: '#FFFFFF',
          100: '#FFFFFF',
          200: 'rgba(255,255,255,0.72)',
          300: 'rgba(255,255,255,0.35)',
        },
      },
      fontFamily: {
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
