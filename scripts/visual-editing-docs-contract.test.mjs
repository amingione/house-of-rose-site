import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const workingMemory = readFileSync(new URL('CLAUDE.md', root), 'utf8');
const runbook = readFileSync(new URL('docs/VISUAL-EDITING.md', root), 'utf8');
const config = readFileSync(new URL('stackbit.config.ts', root), 'utf8');

const singletonMap = config.match(
  /const SINGLETON_PAGE_ROUTES[\s\S]*?= \{([\s\S]*?)\n\};/,
)?.[1] ?? '';

test('visual-editing governance distinguishes active singleton pages from retained records', () => {
  for (const activeType of ['aboutPage', 'privacyPolicy', 'termsOfService', 'rentARoom']) {
    assert.match(singletonMap, new RegExp(`\\b${activeType}\\b`), `${activeType} must remain an active page model.`);
    assert.match(runbook, new RegExp(`\\|[^\\n]*\\b${activeType}\\b[^\\n]*\\|[^\\n]*\\| Yes \\|`));
  }

  for (const disconnectedType of ['homepage', 'contactPage', 'supportPage', 'skinAnalysis', 'thankYou']) {
    assert.doesNotMatch(singletonMap, new RegExp(`\\b${disconnectedType}\\b`));
    assert.match(runbook, new RegExp(`\\|[^\\n]*\\b${disconnectedType}\\b[^\\n]*\\|[^\\n]*\\| No \\|`));
    assert.match(workingMemory, new RegExp(`\\b${disconnectedType}\\b`));
  }

  assert.doesNotMatch(runbook, /All formerly-hardcoded pages are now Sanity-backed singletons/);
  assert.doesNotMatch(workingMemory, /each\s+edited under Studio/i);
});

test('the local visual-editor runbook names the orchestrator ports accurately', () => {
  assert.match(runbook, /Astro on `http:\/\/localhost:3000`/);
  assert.match(runbook, /Stackbit editor\/proxy on `http:\/\/localhost:8090`/);
  assert.match(runbook, /`http:\/\/localhost:8090\/_stackbit`/);
  assert.doesNotMatch(runbook, /Stackbit dev server on `http:\/\/localhost:3000`/);
  assert.match(workingMemory, /Astro preview on `:3000`/);
  assert.match(workingMemory, /Stackbit[\s\S]{0,60}on `:8090`/);
  assert.doesNotMatch(workingMemory, /editor on `:3000`/);
});
