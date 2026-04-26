import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: import.meta.env.PUBLIC_SITE_URL ?? 'https://houseofrose.com',
});
