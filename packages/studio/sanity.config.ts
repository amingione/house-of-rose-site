import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { structure } from './structure';

// projectId/dataset are public, stable constants for this Studio. Only env vars
// prefixed SANITY_STUDIO_ are inlined into the browser bundle by `sanity build`
// (PUBLIC_* is Astro's convention and is NOT exposed here), so a hardcoded
// fallback guarantees the values resolve at runtime in the browser.
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7';
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
  name: 'house-of-rose',
  title: 'House of Rose',

  projectId,
  dataset,

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
