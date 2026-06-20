// Runs the Notion → Sanity sync during a Netlify build ONLY when the build was
// triggered by the content build hook. Normal git deploys skip it, so drafting in
// Notion never touches the live site until you press the button.
//
// Netlify sets INCOMING_HOOK_TITLE to the build hook's name for hook-triggered builds.
// Name your hook so the title contains "Notion" or "Publish content" (see docs/publish-button.md).
import { spawnSync } from 'node:child_process';

const title = process.env.INCOMING_HOOK_TITLE || '';
const isContentPublish = /notion|publish content/i.test(title);

if (!isContentPublish) {
  console.log(`[content-sync] Skipped — INCOMING_HOOK_TITLE="${title}" (not a content publish).`);
  process.exit(0);
}

console.log(`[content-sync] Triggered by "${title}" — running Notion → Sanity sync...`);
const result = spawnSync(process.execPath, ['packages/studio/scripts/sync-from-notion.mjs'], {
  stdio: 'inherit',
  env: process.env,
});

if (result.status !== 0) {
  console.error('[content-sync] Sync failed — failing the build so the issue is visible.');
  process.exit(result.status ?? 1);
}
console.log('[content-sync] Sync complete. Continuing to site build.');
