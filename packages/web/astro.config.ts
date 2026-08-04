import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
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
  integrations: [tailwind()],
  output: 'static',
  site: getSiteUrl(),
  // Netlify Visual Editor proxies Vite's HMR websocket through this dedicated
  // path in the cloud preview. Keep this aligned with stackbit.config.ts.
  vite: {
    define: {
      'import.meta.env.SANITY_API_READ_TOKEN': JSON.stringify(process.env.SANITY_API_READ_TOKEN || buildEnv.SANITY_API_READ_TOKEN || ''),
      'import.meta.env.SANITY_USE_CDN': JSON.stringify(process.env.SANITY_USE_CDN || buildEnv.SANITY_USE_CDN || ''),
    },
    server: {
      hmr: { path: '/vite-hmr/' },
    },
  },
});
