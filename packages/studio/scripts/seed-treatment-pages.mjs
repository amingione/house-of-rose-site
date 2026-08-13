#!/usr/bin/env node
/**
 * Seed the treatment-page blocks onto existing `service` documents.
 *
 *   node packages/studio/scripts/seed-treatment-pages.mjs                     # validate (default)
 *   node scripts/run-with-env.mjs node packages/studio/scripts/seed-treatment-pages.mjs --apply
 *   node scripts/run-with-env.mjs node packages/studio/scripts/seed-treatment-pages.mjs --apply --only=iv-hydration
 *
 * Follows the same shape as seed-rf-ipl-services.mjs: validate is the default,
 * writing requires an explicit flag, and the write token is read from
 * SANITY_API_WRITE_TOKEN / SANITY_AUTH_TOKEN / SANITY_TOKEN (loaded by
 * scripts/run-with-env.mjs) so this matches every other seed script in the repo.
 *
 * Design decisions worth knowing:
 *
 *  1. This script PATCHES existing services. It never creates a `service`
 *     document. Creating one would produce a second page competing with the
 *     existing /services/<slug>/ route for the same query — the exact
 *     cannibalisation this whole build is meant to avoid.
 *
 *  2. Slug matching falls back through `aliases` because live slugs were not
 *     verifiable from outside the dataset. Unmatched entries are reported,
 *     not guessed at.
 *
 *  3. Existing `faqs` are never overwritten — authored FAQs are merged in only
 *     where the question does not already exist.
 */

import { createClient } from '@sanity/client';
import { TREATMENT_CONTENT, SCOPE_PRESETS, BLOCKED_TREATMENTS } from './treatment-page-content.mjs';

throw new Error(
  'Archived by the 2026-08-13 voice reset. Rewrite and review the treatment-page copy and facts before use.',
);

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1];

const WRITE_TOKEN =
  process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_TOKEN;

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7',
  dataset: process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
  token: WRITE_TOKEN,
  useCdn: false,
});

const c = {
  reset: '\u001b[0m',
  dim: '\u001b[2m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  cyan: '\u001b[36m',
};

function log(colour, ...parts) {
  console.log(`${colour}${parts.join(' ')}${c.reset}`);
}

async function resolveService(entry) {
  const candidates = [entry.slug, ...(entry.aliases ?? [])];
  const docs = await client.fetch(
    `*[_type == "service" && slug.current in $slugs]{ _id, title, "slug": slug.current, status, providerScope, downtime, faqs }`,
    { slugs: candidates },
  );
  if (docs.length === 0) return { entry, match: null, candidates };
  // Prefer an exact slug hit over an alias hit.
  const exact = docs.find((d) => d.slug === entry.slug);
  return { entry, match: exact ?? docs[0], candidates, extras: docs.length > 1 ? docs : undefined };
}

function buildPatch(entry) {
  const set = {
    downtime: entry.downtime,
    aftercare: entry.aftercare,
    priceRange: entry.priceRange,
    whyQualified: entry.whyQualified,
  };

  const preset = SCOPE_PRESETS[entry.scopeDecision];
  if (preset) {
    set.providerScope = preset;
  }

  return set;
}

function mergeFaqs(existing, authored) {
  // Sanity returns literal `null` for an unset array, not `undefined` — JS default
  // parameters only substitute on `undefined`, so this has to be an explicit guard.
  const existingList = existing ?? [];
  const authoredList = authored ?? [];
  const seen = new Set(existingList.map((f) => f.question?.trim().toLowerCase()));
  const additions = authoredList
    .filter((f) => !seen.has(f.question.trim().toLowerCase()))
    .map((f, i) => ({ _key: `tp-${Date.now().toString(36)}-${i}`, ...f }));
  return { additions, total: existingList.length + additions.length };
}

async function main() {
  log(c.cyan, `\n  House of Rose — treatment page seed  [${APPLY ? 'APPLY' : 'VALIDATE'}]\n`);

  if (APPLY && !WRITE_TOKEN) {
    log(
      c.red,
      '  No Sanity write token found. Set SANITY_API_WRITE_TOKEN, SANITY_AUTH_TOKEN, or SANITY_TOKEN, or run through scripts/run-with-env.mjs.',
    );
    process.exit(1);
  }

  const entries = ONLY ? TREATMENT_CONTENT.filter((e) => e.slug === ONLY) : TREATMENT_CONTENT;
  if (entries.length === 0) {
    log(c.red, `  No content entry matches --only=${ONLY}`);
    process.exit(1);
  }

  const resolved = await Promise.all(entries.map(resolveService));

  const matched = resolved.filter((r) => r.match);
  const missing = resolved.filter((r) => !r.match);

  for (const { entry, match, extras } of matched) {
    const set = buildPatch(entry);
    const faq = mergeFaqs(match.faqs, entry.faqs);
    const blocks = Object.keys(set).join(', ');

    log(c.green, `  ✓ ${entry.displayName}`);
    log(c.dim, `      → /services/${match.slug}/  (${match.status})`);
    log(c.dim, `      blocks: ${blocks}`);
    log(c.dim, `      faqs: +${faq.additions.length} new (${faq.total} total)`);
    if (extras) {
      log(c.yellow, `      note: ${extras.length} services matched; patched "${match.slug}"`);
    }

    if (APPLY) {
      let tx = client.patch(match._id).set(set);
      if (faq.additions.length > 0) {
        tx = tx.setIfMissing({ faqs: [] }).append('faqs', faq.additions);
      }
      await tx.commit();
    }
  }

  if (missing.length > 0) {
    log(c.red, `\n  ${missing.length} entr${missing.length === 1 ? 'y' : 'ies'} did not match a service:\n`);
    for (const { entry, candidates } of missing) {
      log(c.red, `  ✗ ${entry.displayName}`);
      log(c.dim, `      tried: ${candidates.join(', ')}`);
    }
    log(c.dim, '\n      Fix the slug in treatment-page-content.mjs, or add the alias.');
  }

  if (BLOCKED_TREATMENTS.length > 0) {
    log(c.yellow, '\n  Deliberately not authored:\n');
    for (const b of BLOCKED_TREATMENTS) {
      log(c.yellow, `  ⊘ ${b.name}`);
      log(c.dim, `      ${b.reason}`);
    }
  }

  log(
    c.cyan,
    `\n  ${matched.length} patched${APPLY ? '' : ' (dry run)'} · ${missing.length} unmatched\n`,
  );

  if (!APPLY) {
    log(c.dim, '  Re-run through scripts/run-with-env.mjs with --apply to write.\n');
  }
}

main().catch((err) => {
  log(c.red, `\n  Failed: ${err.message}\n`);
  process.exit(1);
});
