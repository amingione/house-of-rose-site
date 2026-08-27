import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { loadEnv, type Plugin } from 'vite';

const fallbackSiteUrl = 'https://houseofrosefl.com';
const publicSiteUrl = process.env.PUBLIC_SITE_URL?.trim();

// Load all env vars (.env files locally, process.env on Netlify) so server-only build
// secrets (SANITY_API_READ_TOKEN) reliably reach import.meta.env in the static build.
const buildEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

const DEFAULT_CHUNK_BUDGET_KB = 500;
const MAPBOX_CHUNK_BUDGET_KB = 1900;

/**
 * Mapbox GL is a route-scoped dynamic import on /contact/, but the library is
 * intentionally monolithic and exceeds Vite's generic 500 kB warning limit.
 * Keep Vite quiet for that known lazy chunk without weakening the budget for
 * every other client chunk.
 */
function enforceClientChunkBudgets(): Plugin {
  return {
    name: 'house-of-rose-client-chunk-budgets',
    apply: 'build',
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;

        const isMapboxChunk = Object.keys(output.modules)
          .some((moduleId) => moduleId.includes('/node_modules/mapbox-gl/'));
        const budgetKb = isMapboxChunk ? MAPBOX_CHUNK_BUDGET_KB : DEFAULT_CHUNK_BUDGET_KB;
        const sizeKb = Buffer.byteLength(output.code, 'utf8') / 1000;

        if (sizeKb > budgetKb) {
          this.error(`${output.fileName} is ${sizeKb.toFixed(1)} kB; budget is ${budgetKb} kB.`);
        }
      }
    },
  };
}

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
  // global.css owns Tailwind's base/components/utilities. Disable the integration's
  // automatic base.css injection so every route does not download Tailwind twice.
  integrations: [tailwind({ applyBaseStyles: false })],
  output: 'static',
  site: getSiteUrl(),
  // Netlify Visual Editor proxies Vite's HMR websocket through this dedicated
  // path in the cloud preview. Keep this aligned with stackbit.config.ts.
  vite: {
    // The custom plugin retains Vite's 500 kB budget for normal chunks while
    // allowing only the verified, lazy Mapbox vendor chunk up to 1.9 MB.
    build: {
      chunkSizeWarningLimit: MAPBOX_CHUNK_BUDGET_KB,
    },
    define: {
      'import.meta.env.SANITY_API_READ_TOKEN': JSON.stringify(process.env.SANITY_API_READ_TOKEN || buildEnv.SANITY_API_READ_TOKEN || ''),
      'import.meta.env.SANITY_USE_CDN': JSON.stringify(process.env.SANITY_USE_CDN || buildEnv.SANITY_USE_CDN || ''),
    },
    server: {
      hmr: { path: '/vite-hmr/' },
    },
    plugins: [enforceClientChunkBudgets()],
  },
});
