import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import swup from '@swup/astro';
import { loadEnv } from 'vite';

const fallbackSiteUrl = 'https://houseofrosefl.com';
const publicSiteUrl = process.env.PUBLIC_SITE_URL?.trim();

// Load all env vars (.env files locally, process.env on Netlify) so server-only build
// secrets (SANITY_API_READ_TOKEN) reliably reach import.meta.env in the static build.
const buildEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

function getSiteUrl() {
  if (!publicSiteUrl) {
    return fallbackSiteUrl;
  }

  try {
    return new URL(publicSiteUrl).toString();
  } catch {
    return fallbackSiteUrl;
  }
}

export default defineConfig({
  integrations: [
    tailwind(),
    swup({
      // Custom fade/lift transition defined in global.css (.transition-fade) —
      // matches the site's charcoal/gold aesthetic better than swup's built-in themes.
      theme: false,
      animationClass: 'transition-',
      containers: ['main'],
      preload: { hover: true, visible: true },
      accessibility: true,
      smoothScrolling: true,
    }),
  ],
  output: 'static',
  site: getSiteUrl(),
  // Netlify Visual Editor proxies Vite's HMR websocket through this dedicated
  // path in the cloud preview. Keep this aligned with stackbit.config.ts.
  vite: {
    define: {
      'import.meta.env.SANITY_API_READ_TOKEN': JSON.stringify(buildEnv.SANITY_API_READ_TOKEN ?? ''),
      'import.meta.env.SANITY_USE_CDN': JSON.stringify(buildEnv.SANITY_USE_CDN ?? ''),
    },
    server: {
      hmr: { path: '/vite-hmr/' },
    },
  },
});
