#!/usr/bin/env node
/**
 * Wires the treatment-page blocks into packages/web/src/pages/services/[slug].astro.
 *
 *   node scripts/patch-service-page.mjs --dry     # print the diff, write nothing
 *   node scripts/patch-service-page.mjs           # apply
 *
 * Anchor-based and idempotent: every edit is skipped if its marker is already
 * present, and the script exits non-zero if an anchor is missing rather than
 * writing a half-patched file.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DRY = process.argv.includes('--dry');
const TARGET = resolve('packages/web/src/pages/services/[slug].astro');

const EDITS = [
  {
    name: 'imports',
    marker: "from '@/lib/treatmentQueries'",
    anchor: "import { service as serviceJsonLd, breadcrumbList, faqPage } from '@/lib/structuredData';",
    insert: `
import DowntimeBlock from '@/components/treatment/DowntimeBlock.astro';
import AftercareBlock from '@/components/treatment/AftercareBlock.astro';
import ProviderScopeBlock from '@/components/treatment/ProviderScopeBlock.astro';
import PriceRangeBlock from '@/components/treatment/PriceRangeBlock.astro';
import WhyHouseOfRose from '@/components/treatment/WhyHouseOfRose.astro';
import { medicalProcedure, treatmentOffer } from '@/lib/structuredData.treatment';`,
  },
  {
    name: 'json-ld builders',
    marker: 'const procedureSchema',
    anchor: 'const faqSchema = faqPage(service.faqs ?? []);',
    insert: `
// Treatment-specific structured data. Emitted alongside the generic Service node —
// MedicalProcedure is what local health-intent surfaces actually read.

const procedureSchema = service.providerScope
  ? medicalProcedure(
      {
        name: service.title,
        description: service.description ?? service.tagline ?? undefined,
        url: canonicalURL.toString(),
        image: socialImage,
        procedureType: service.providerScope.medicalDirection
          ? 'PercutaneousProcedure'
          : 'NoninvasiveProcedure',
        bodyLocation: service.treatmentAreas?.map((a) => a.area),
        downtime: service.downtime,
        aftercare: service.aftercare,
        providerScope: service.providerScope,
        priceRange: service.priceRange,
        bookingUrl: service.bookingUrl,
      },
      site,
    )
  : null;

const offerSchema = service.priceRange
  ? treatmentOffer({
      url: canonicalURL.toString(),
      name: service.title,
      priceRange: service.priceRange,
      bookingUrl: service.bookingUrl,
    })
  : null;
`,
  },
  {
    name: 'schema emission',
    marker: 'procedureSchema && <SchemaMarkup',
    anchor: '  {faqSchema && <SchemaMarkup item={faqSchema} slot="head" />}',
    insert: `
  {procedureSchema && <SchemaMarkup item={procedureSchema} slot="head" />}
  {offerSchema && <SchemaMarkup item={offerSchema} slot="head" />}
`,
  },
  {
    name: 'downtime + price section',
    marker: '<!-- Downtime and investment -->',
    anchor:
      '  <!-- Gallery: real, service-specific photos (moved here now that the hero uses the shared banner) -->',
    before: true,
    insert: `  <!-- Downtime and investment -->
  {(service.downtime || service.priceRange) && (
    <section class="bg-charcoal py-[clamp(48px,7vw,80px)] px-6 border-t border-gold-metal/10">
      <div class="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20">
        {service.downtime && (
          <DowntimeBlock downtime={service.downtime} treatmentName={service.title} />
        )}
        {service.priceRange && (
          <PriceRangeBlock priceRange={service.priceRange} bookingUrl={service.bookingUrl} />
        )}
      </div>
    </section>
  )}
`,
  },
  {
    name: 'why house of rose section',
    marker: '<WhyHouseOfRose',
    anchor: '  <!-- FAQs -->',
    before: true,
    insert: `  {service.whyQualified && service.whyQualified.length > 0 && (
    <WhyHouseOfRose
      whyQualified={service.whyQualified}
      treatmentName={service.title}
    />
  )}

`,
  },
  {
    name: 'aftercare + provider scope section',
    marker: '<!-- Aftercare and provider qualifications -->',
    anchor: '  <!-- Related Services -->',
    before: true,
    insert: `  <!-- Aftercare and provider qualifications -->
  {(service.aftercare || service.providerScope) && (
    <section class="bg-charcoal py-[clamp(48px,7vw,80px)] px-6 border-t border-gold-metal/10">
      <div class="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">
        {service.aftercare && (
          <AftercareBlock aftercare={service.aftercare} treatmentName={service.title} />
        )}
        {service.providerScope && (
          <ProviderScopeBlock providerScope={service.providerScope} treatmentName={service.title} />
        )}
      </div>
    </section>
  )}

`,
  },
];

let source = readFileSync(TARGET, 'utf8');
const applied = [];
const skipped = [];

for (const edit of EDITS) {
  if (source.includes(edit.marker)) {
    skipped.push(edit.name);
    continue;
  }

  if (edit.find) {
    if (!source.includes(edit.find)) {
      console.error(`\n  Anchor not found for "${edit.name}".\n  Expected: ${edit.find}\n`);
      process.exit(1);
    }
    source = source.replace(edit.find, edit.replace);
    applied.push(edit.name);
    continue;
  }

  const idx = source.indexOf(edit.anchor);
  if (idx === -1) {
    console.error(`\n  Anchor not found for "${edit.name}".\n  Expected: ${edit.anchor}\n`);
    process.exit(1);
  }

  source = edit.before
    ? source.slice(0, idx) + edit.insert + source.slice(idx)
    : source.slice(0, idx + edit.anchor.length) + edit.insert + source.slice(idx + edit.anchor.length);

  applied.push(edit.name);
}

const green = '\u001b[32m';
const dim = '\u001b[2m';
const reset = '\u001b[0m';

console.log(`\n  ${TARGET}\n`);
applied.forEach((n) => console.log(`${green}  + ${n}${reset}`));
skipped.forEach((n) => console.log(`${dim}  · ${n} (already applied)${reset}`));

if (DRY) {
  console.log(`${dim}\n  Dry run — nothing written.${reset}\n`);
} else {
  writeFileSync(TARGET, source, 'utf8');
  console.log(`\n  Written. Run \`npm run lint\` and \`npm run build:web\` to verify.\n`);
}
