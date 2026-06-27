/**
 * apply-patches.mjs
 * -----------------
 * Reapplies repo patches in `patches/` after `npm install` (currently the
 * Sanity-6 compatibility patch for `@stackbit/cms-sanity` — see
 * scripts/visual-editing/extract-sanity-schema.mjs and docs/VISUAL-EDITING.md).
 *
 * Runs from the `prepare` lifecycle script. It is deliberately NON-FATAL: if
 * `patch-package` (a devDependency) isn't installed — e.g. a production /
 * `--omit=dev` install, or an environment with NODE_ENV=production that makes
 * npm skip devDependencies — we warn and exit 0 so the install still succeeds.
 * The patch only matters for the dev-only Visual Editor anyway.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);

// If there are no patches, there's nothing to do.
if (!existsSync(path.join(ROOT, 'patches'))) {
  process.exit(0);
}

// Resolve patch-package without throwing if it's absent (omit=dev / prod install).
let patchPackageBin;
try {
  patchPackageBin = require.resolve('patch-package/index.js');
} catch {
  console.warn(
    '[apply-patches] patch-package not installed (dev dependency skipped) — ' +
      'leaving node_modules unpatched. Visual Editor (npm run dev:visual) needs ' +
      'this; run `npm install --include=dev` if you use it.',
  );
  process.exit(0);
}

const result = spawnSync(process.execPath, [patchPackageBin], {
  cwd: ROOT,
  stdio: 'inherit',
});

// Surface a real patch *failure* (e.g. version drift) but never block install.
if (result.status !== 0) {
  console.warn('[apply-patches] patch-package reported a problem (see above).');
}
process.exit(0);
