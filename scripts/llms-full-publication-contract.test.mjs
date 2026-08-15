import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(
  new URL('../packages/web/src/pages/llms-full.txt.ts', import.meta.url),
  'utf8',
);
const compactSource = readFileSync(
  new URL('../packages/web/src/pages/llms.txt.ts', import.meta.url),
  'utf8',
);

test('the full AI feed emits links only for generated public service routes', () => {
  const query = source.match(
    /const SERVICES_FULL_QUERY = \/\* groq \*\/ `([\s\S]*?)`;/,
  )?.[1];

  assert.ok(query, 'The full AI feed service query must remain inspectable.');
  assert.match(query, /status in \["live", "actual-menu"\]/);
  assert.match(query, /defined\(slug\.current\)/);
  assert.match(query, /!\(slug\.current in \$\{UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ\}\)/);
  assert.match(
    source,
    /import \{ UNAVAILABLE_PUBLIC_SERVICE_SLUGS \} from '@\/lib\/publicServiceContent'/,
  );
  assert.match(
    source,
    /const UNAVAILABLE_PUBLIC_SERVICE_SLUGS_GROQ = JSON\.stringify\(UNAVAILABLE_PUBLIC_SERVICE_SLUGS\)/,
  );
  assert.doesNotMatch(source, /const NON_PUBLIC_SERVICE_SLUGS\b/);
  assert.doesNotMatch(source, /services\.filter\(\(service\) => !NON_PUBLIC_SERVICE_SLUGS\.has/);
  assert.match(
    source,
    /URL: \$\{base\}\/services\/\$\{s\.slug\}\//,
    'The route guard is required because the feed publishes each service slug as a URL.',
  );
});

test('the compact AI feed shares the generated-route service authority', () => {
  assert.match(
    compactSource,
    /import \{ UNAVAILABLE_PUBLIC_SERVICE_SLUGS \} from '@\/lib\/publicServiceContent'/,
  );
  assert.match(
    compactSource,
    /const UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET = new Set<string>\(UNAVAILABLE_PUBLIC_SERVICE_SLUGS\)/,
  );
  assert.match(
    compactSource,
    /sanityFetch<Service\[\]>\(ALL_SERVICES_QUERY\)/,
    'The compact feed must retain the public service query predicate.',
  );
  assert.match(
    compactSource,
    /sanityFetch<Service\[\]>\(LLMS_FEATURED_TREATMENTS_QUERY\)/,
    'The compact feed must retain the featured-treatment query predicate.',
  );
  assert.match(
    compactSource,
    /\.filter\(\(service\) => !UNAVAILABLE_PUBLIC_SERVICE_SLUG_SET\.has\(service\.slug\)\)/,
  );
  assert.doesNotMatch(compactSource, /const NON_PUBLIC_SERVICE_SLUGS\b/);
});

test('both AI feeds expose operational and local-authority core routes', () => {
  for (const route of ['/faq/', '/support/', '/terms-of-service/', '/areas/']) {
    const sourceToken = `\${base}${route}`;
    assert.ok(compactSource.includes(sourceToken), `llms.txt is missing ${route}`);
    assert.ok(source.includes(sourceToken), `llms-full.txt is missing ${route}`);
  }
});

test('the full AI feed includes each reviewed AEO route inventory', () => {
  const requiredInventories = [
    ['ALL_CONCERNS_QUERY', '/concerns/${concern.slug}/'],
    ['ALL_COST_GUIDES_QUERY', '/cost/${guide.slug}/'],
    ['ALL_COMPARISONS_QUERY', '/compare/${comparison.slug}/'],
    ['ALL_LOCAL_AREAS_QUERY', '/areas/${area.slug}/'],
    ['ALL_TREATMENT_PACKAGES_QUERY', '/packages/${treatmentPackage.slug}/'],
  ];

  for (const [queryName, routeTemplate] of requiredInventories) {
    assert.ok(source.includes(queryName), `llms-full.txt is missing ${queryName}`);
    assert.ok(source.includes(routeTemplate), `llms-full.txt is missing ${routeTemplate}`);
  }

  assert.match(source, /filterReviewedPublicComparisons\(comparisons\)/);
  assert.match(source, /getVerifiedCostFact\(guide\.slug\)/);
});

test('the compact AI feed includes the generated concern-guide inventory', () => {
  assert.ok(compactSource.includes('ALL_CONCERNS_QUERY'));
  assert.ok(compactSource.includes('${base}/concerns/'));
  assert.ok(compactSource.includes('${base}/concerns/${concern.slug}/'));
});

test('both AI feeds include each generated case-study route', () => {
  for (const feedSource of [compactSource, source]) {
    assert.ok(feedSource.includes('ALL_CASE_STUDIES_QUERY'));
    assert.match(feedSource, /sanityFetch<CaseStudy\[\]>\(ALL_CASE_STUDIES_QUERY\)/);
    assert.ok(feedSource.includes('${base}/results/${study.slug}/'));
  }

  assert.match(
    compactSource,
    /\.\.\.\(caseStudies\.length > 0[\s\S]*?\$\{base\}\/results\//,
    'The compact Results hub must remain conditional on a public case-study inventory.',
  );
});
