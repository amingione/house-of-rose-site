import { defineCliConfig } from 'sanity/cli';

// Public, stable constants for this Studio (see sanity.config.ts). Hardcoded
// fallback keeps CLI commands working without requiring env vars to be set.
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7';
const dataset =
  process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
