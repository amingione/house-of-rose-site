import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

const fallbackSiteUrl = 'https://houseofrosefl.com';
const publicSiteUrl = process.env.PUBLIC_SITE_URL?.trim();

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
});
