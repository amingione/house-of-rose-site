#!/usr/bin/env node
/**
 * Installs a git pre-commit hook that enforces click-to-edit coverage.
 * Idempotent; runs automatically via the root `prepare` npm script after install.
 * Skips silently when there's no .git dir (e.g. CI shallow checkouts).
 */
import { writeFileSync, existsSync, mkdirSync, chmodSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const gitDir = path.join(ROOT, '.git');
if (!existsSync(gitDir)) {
  console.log('[ve] no .git dir — skipping pre-commit hook install.');
  process.exit(0);
}

const hooksDir = path.join(gitDir, 'hooks');
mkdirSync(hooksDir, { recursive: true });
const hookPath = path.join(hooksDir, 'pre-commit');

const hook = `#!/bin/sh
# Auto-installed by scripts/visual-editing/install-git-hook.mjs
# Enforces inline click-to-edit coverage + PAGE_ROUTES sync before commit.
echo "[ve] checking click-to-edit coverage…"
node scripts/visual-editing/sync-page-routes.mjs || {
  echo "[ve] PAGE_ROUTES out of sync — run: npm run ve:sync -- --fix"; exit 1;
}
node scripts/visual-editing/check-coverage.mjs || {
  echo "[ve] missing annotations — annotate or allow-list, or scaffold with: npm run ve:new"; exit 1;
}
`;

writeFileSync(hookPath, hook);
chmodSync(hookPath, 0o755);
console.log('[ve] installed .git/hooks/pre-commit (coverage + route sync).');
