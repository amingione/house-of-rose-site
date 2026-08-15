import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const governanceRoot = fileURLToPath(new URL('../docs/GOVERNANCE/internal_only/', import.meta.url));
const repositoryRoot = resolve(governanceRoot, '../../..');
const governanceInstructions = readFileSync(
  join(repositoryRoot, 'docs/GOVERNANCE/AGENTS.md'),
  'utf8',
);
const brandMemory = readFileSync(
  join(repositoryRoot, 'docs/GOVERNANCE/BRAND_MEMORY.md'),
  'utf8',
);
const startHere = readFileSync(
  join(repositoryRoot, 'docs/GOVERNANCE/internal_only/START-HERE.md'),
  'utf8',
);

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && entry.name.endsWith('.md') ? [path] : [];
  });
}

test('active governance documents reference the current governance tree', () => {
  const files = markdownFiles(governanceRoot);
  const staleReferences = files.flatMap((path) => {
    const lines = readFileSync(path, 'utf8').split('\n');
    return lines.flatMap((line, index) =>
      line.includes('docs/internal_only/') ? [`${path}:${index + 1}`] : [],
    );
  });

  assert.deepEqual(
    staleReferences,
    [],
    `Governance documents still reference the retired docs/internal_only tree:\n${staleReferences.join('\n')}`,
  );

  const missingReferences = files.flatMap((path) => {
    const source = readFileSync(path, 'utf8');
    return [...source.matchAll(/`(docs\/GOVERNANCE\/internal_only\/[^`]+)`/g)].flatMap(
      ([, reference]) => {
        if (/[*{}]/.test(reference) || existsSync(join(repositoryRoot, reference))) return [];
        return [`${path}: ${reference}`];
      },
    );
  });

  assert.deepEqual(
    missingReferences,
    [],
    `Governance documents contain missing current-tree references:\n${missingReferences.join('\n')}`,
  );
});

test('the SEO playbook uses a current package instead of inventing a service combination', () => {
  const playbook = readFileSync(join(repositoryRoot, 'docs/SEO-AEO-PLAYBOOK.md'), 'utf8');

  assert.match(
    playbook,
    /Face Reality 12-Week Program\s+→ treatmentPackage → \/packages\/face-reality-12-week-program\//,
  );
  assert.doesNotMatch(playbook, /Dermaplaning \+ Glo2Facial Package/);
});

test('governance preflight does not reinstate the archival brand system', () => {
  assert.match(governanceInstructions, /Use[\s\S]*BRAND_MEMORY\.md[\s\S]*selectively/);
  assert.match(governanceInstructions, /not a creative brief/);
  assert.match(governanceInstructions, /Start with the user's latest direction/);
  assert.match(governanceInstructions, /current owner documents/);
  assert.match(governanceInstructions, /blank audience, offer, funnel, or voice framework/);

  assert.doesNotMatch(
    governanceInstructions,
    /read[\s\S]{0,120}BRAND_MEMORY\.md[\s\S]{0,120}in full/i,
  );
  assert.doesNotMatch(
    governanceInstructions,
    /Every customer-facing deliverable must be traceable to the memory's audience/,
  );

  assert.match(brandMemory, /must not be read wholesale as a creative brief/);
  assert.match(startHere, /BRAND_MEMORY\.md` are archival voice references during the reset/);
});

test('the reset-era asset inventory does not mandate personas from rejected audience segments', () => {
  const assetAudit = readFileSync(
    join(repositoryRoot, 'docs/GOVERNANCE/BRAND-ASSET-AUDIT.md'),
    'utf8',
  );

  assert.match(assetAudit, /collecting real client language and behavior before deciding whether personas are useful/i);
  assert.match(assetAudit, /do not preselect their number or structure/i);
  assert.match(assetAudit, /do not assume a fixed segment count/i);
  assert.doesNotMatch(assetAudit, /turning the five audience segments into research-backed personas/i);
  assert.doesNotMatch(assetAudit, /Target audience personas, 3–5/i);
});
