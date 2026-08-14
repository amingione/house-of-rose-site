#!/usr/bin/env node
/**
 * Checks live treatment pages for factual, credential, claims, and pricing risk.
 *
 *   node packages/studio/scripts/verify-treatment-pages.mjs
 *   node packages/studio/scripts/verify-treatment-pages.mjs --warn   # report, exit 0
 *
 * Optional public blocks remain optional until reviewed, service-specific facts
 * exist. This verifier must not pressure editors to fill gaps with generic copy.
 *
 * Checks, in order of severity:
 *   BLOCKING  — live service with no providerScope, or an invalid supplied variance note
 *   BLOCKING  — a staff or owner name found in client-facing copy
 *   BLOCKING  — banned voice or compliance language
 *   WARNING   — priceRange verified against GlossGenius more than 90 days ago
 */

import { createClient } from '@sanity/client';

const WARN_ONLY = process.argv.includes('--warn');

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7',
  dataset: process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
  useCdn: false,
});

/**
 * Practitioner names are ALLOWED and often required. § 456.072(1)(t) requires the
 * LICENCE TYPE wherever a practitioner is named. So the check is not "is a name
 * present" — it is "is a name present without a credential".
 */
const PRACTITIONERS = [
  { name: 'diana', credential: 'RN' },
  { name: 'morrison', credential: 'RN' },
  { name: 'joshua shaw', credential: 'MD' },
  { name: 'shaw', credential: 'MD' },
];

/** Job titles that satisfy nothing under § 456.072(1)(t). */
const NON_CREDENTIALS = ['aesthetic injector', 'injector', 'skin specialist', 'provider,'];

/** Rejected on brand review or on compliance grounds. */
const BANNED_PHRASES = [
  { term: 'pamper', why: 'voice' },
  { term: 'indulge', why: 'voice' },
  { term: 'amazing', why: 'voice' },
  { term: 'attention to detail', why: 'voice — generic' },
  { term: 'steady hand', why: 'voice — generic' },
  { term: 'exosome', why: 'compliance — FDA enforcement' },
  { term: 'stem cell', why: 'compliance — FDA enforcement' },
  { term: 'rose circle', why: 'membership — permanently deleted' },
  { term: 'rose method', why: 'membership — permanently deleted' },
  { term: 'membership', why: 'membership — permanently deleted' },
  { term: 'guaranteed', why: 'compliance — results claim' },
  { term: 'cure', why: 'compliance — disease claim' },
  // R. 64B8-11.001(2)(k) — violated by implication alone. The medical director's
  // NPI taxonomy is Surgery.
  { term: 'dermatologist', why: 'compliance — implies unheld specialty' },
  { term: 'skin doctor', why: 'compliance — implies unheld specialty' },
  { term: 'dermatology specialist', why: 'compliance — implies unheld specialty' },
  { term: 'reverse-aging', why: 'compliance — prohibited claim' },
  { term: 'groupon', why: 'compliance — discount framing' },
];

const STALE_PRICE_DAYS = 90;

const QUERY = /* groq */ `
*[_type == "service" && status in ["live", "actual-menu"]]{
  _id, title, "slug": slug.current,
  description, whoItsFor, benefits, whyQualified,
  downtime, aftercare, priceRange, providerScope,
  "faqText": faqs[].answer
}`;

function collectText(doc) {
  return [
    doc.description,
    doc.whoItsFor,
    ...(doc.benefits ?? []),
    ...(doc.whyQualified ?? []),
    ...(doc.faqText ?? []),
    doc.downtime?.summary,
    doc.aftercare?.intro,
    ...(doc.providerScope?.credentialPoints ?? []),
  ]
    .filter(Boolean)
    .join(' \n ')
    .toLowerCase();
}

function daysSince(dateString) {
  if (!dateString) return Infinity;
  const then = new Date(dateString).getTime();
  if (Number.isNaN(then)) return Infinity;
  return Math.floor((Date.now() - then) / 86_400_000);
}

async function main() {
  const services = await client.fetch(QUERY);
  const blocking = [];
  const warnings = [];

  for (const doc of services) {
    const label = `${doc.title} (/services/${doc.slug}/)`;
    const text = collectText(doc);

    if (!doc.providerScope) {
      blocking.push(`${label} — no providerScope. Every live treatment must state who performs it.`);
    }

    const varianceNote = doc.providerScope?.disclaimer?.trim();
    if (/\bcandidacy is determined at consultation\b/i.test(varianceNote ?? '') ||
        /\bthis page is general information and is not medical advice\b/i.test(varianceNote ?? '')) {
      blocking.push(`${label} — providerScope contains retired generic disclaimer boilerplate.`);
    }
    if (varianceNote && !/\bindividual (?:outcomes?|results?) var(?:y|ies)\b/i.test(varianceNote)) {
      blocking.push(`${label} — providerScope variance note does not state that individual outcomes vary.`);
    }

    // A named practitioner without a licence type is the violation, not the name.
    for (const { name, credential } of PRACTITIONERS) {
      if (new RegExp(`\\b${name}\\b`).test(text) && !text.includes(credential.toLowerCase())) {
        blocking.push(
          `${label} — "${name}" named without licence type. § 456.072(1)(t) requires "${credential}".`,
        );
      }
    }

    for (const title of NON_CREDENTIALS) {
      if (text.includes(title)) {
        blocking.push(`${label} — "${title}" is a job title, not a licence type (§ 456.072(1)(t)).`);
      }
    }

    // Medically directed treatments must carry the canonical attribution line.
    if (doc.providerScope?.medicalDirection && !text.includes('me136232')) {
      warnings.push(`${label} — medically directed but no medical director attribution rendered.`);
    }

    for (const { term, why } of BANNED_PHRASES) {
      if (text.includes(term)) {
        blocking.push(`${label} — banned phrase "${term}" (${why}).`);
      }
    }

    const age = daysSince(doc.priceRange?.verifiedAgainstGlossGenius);
    if (doc.priceRange && age > STALE_PRICE_DAYS) {
      warnings.push(
        `${label} — priceRange last verified against GlossGenius ${age === Infinity ? 'never' : `${age} days ago`}.`,
      );
    }
  }

  const red = '\u001b[31m';
  const yellow = '\u001b[33m';
  const green = '\u001b[32m';
  const dim = '\u001b[2m';
  const reset = '\u001b[0m';

  console.log(`\n  Treatment page verification — ${services.length} live services\n`);

  if (blocking.length > 0) {
    console.log(`${red}  ${blocking.length} blocking issue(s):${reset}\n`);
    blocking.forEach((m) => console.log(`${red}  ✗ ${m}${reset}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.log(`${yellow}  ${warnings.length} warning(s):${reset}\n`);
    warnings.forEach((m) => console.log(`${yellow}  ! ${m}${reset}`));
    console.log('');
  }

  if (blocking.length === 0 && warnings.length === 0) {
    console.log(`${green}  All live treatment pages complete.${reset}\n`);
  }

  if (blocking.length > 0 && !WARN_ONLY) {
    console.log(`${dim}  Re-run with --warn to report without failing.${reset}\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\n  Verification failed: ${err.message}\n`);
  process.exit(1);
});
