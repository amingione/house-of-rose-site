import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const architecturePath = new URL(
  '../docs/HRAaudits/letaido-findings/Service-Page-Architecture-2026-08-11.md',
  import.meta.url,
);
const competitorPath = new URL(
  "../docs/HRAaudits/letaido-findings/Second-Pass-—-Amber's-Named-Competitors-2026-08-11.md",
  import.meta.url,
);
const demandPath = new URL(
  '../docs/HRAaudits/letaido-findings/houseofrose-local-demand-2026-08-10.csv',
  import.meta.url,
);
const prfArchitecturePath = new URL(
  '../docs/HRAaudits/letaido-findings/PRF-Content-Briefs-—-4-Pages-2026-08-11.md',
  import.meta.url,
);
const siteAuditPath = new URL(
  '../docs/HRAaudits/letaido-findings/Site-Audit-—-houseofrosefl.com-(Aug-2026)-2026-08-11.md',
  import.meta.url,
);
const trendingKeywordPath = new URL(
  '../docs/HRAaudits/letaido-findings/Trending-Keyword-Research-—-Med-Spa-2026-08-11.md',
  import.meta.url,
);

const architecture = readFileSync(architecturePath, 'utf8');
const competitorStudy = readFileSync(competitorPath, 'utf8');
const demand = readFileSync(demandPath, 'utf8');
const prfArchitecture = readFileSync(prfArchitecturePath, 'utf8');
const siteAudit = readFileSync(siteAuditPath, 'utf8');
const trendingKeywords = readFileSync(trendingKeywordPath, 'utf8');
const strategySources = `${architecture}\n${competitorStudy}\n${demand}\n${prfArchitecture}\n${siteAudit}\n${trendingKeywords}`;

test('SEO strategy sources cannot reintroduce permanently retired programs', () => {
  assert.doesNotMatch(
    strategySources,
    /\b(?:wax pass|waxing membership|laser hair removal membership)\b|\/memberships\//i,
  );
});

test('service architecture cannot create unsupported routes or branded equivalence', () => {
  assert.doesNotMatch(architecture, /\/services\/brazilian-wax\//i);
  assert.doesNotMatch(architecture, /glo2facial[^\n]{0,180}hydrafacial|hydrafacial[^\n]{0,180}glo2facial/i);
});

test('service architecture keeps geographic intent out of service title templates', () => {
  assert.doesNotMatch(architecture, /\*\*H1:\*\*[^\n]*(?:near me|punta gorda)/i);
  assert.doesNotMatch(architecture, /\*\*Title tag:\*\*[^\n]*(?:near me|punta gorda|port charlotte)/i);
  assert.match(architecture, /geographic intent handled by the `localArea` page type/i);
});

test('PRF strategy reflects current reviewed routes instead of retired briefs', () => {
  for (const route of [
    '/services/prf/',
    '/services/prf-injections/',
    '/services/microneedling/',
    '/services/prf-under-eyes/',
  ]) {
    assert.match(prfArchitecture, new RegExp(route.replaceAll('/', '\\/')));
  }

  assert.doesNotMatch(
    prfArchitecture,
    /\/services\/prf-microneedling\/|\/compare\/prf-vs-prp\/|\/packages\/prf-under-eye-series-of-3\//i,
  );
  assert.doesNotMatch(
    prfArchitecture,
    /\bprf is preferred\b|\bno migration risk\b|\bseries of 3 recommended\b|\bresults build over\b/i,
  );
  assert.match(prfArchitecture, /keyword\s+volume is not clinical evidence/i);
});

test('site-audit strategy follows the active storefront gate instead of old crawl counts', () => {
  assert.match(siteAudit, /PUBLIC_SHOP_ENABLED=true/i);
  assert.match(siteAudit, /forces\s+`\/shop\/\*`,\s+`\/cart\/\*`,\s+and\s+`\/checkout\/\*`\s+to\s+404/i);
  assert.doesNotMatch(siteAudit, /\b(?:121|124|142|165)\b[^\n]{0,100}\b(?:pages?|shop|sitemap|schema|links?)\b/i);
  assert.doesNotMatch(siteAudit, /\b(?:add|include|submit)\b[^\n]{0,80}`?\/shop\/`?[^\n]{0,80}sitemap/i);
  assert.doesNotMatch(siteAudit, /compress\s+(?:the\s+)?9\s+oversized images/i);
  assert.match(siteAudit, /run a new launch audit against that exact\s+build/i);
});

test('keyword research cannot authorize duplicate or unsupported service work', () => {
  assert.match(trendingKeywords, /search demand; it does not authorize a service, route, claim, provider scope, image, or price/i);
  assert.match(trendingKeywords, /\/services\/iv-hydration-therapy\//i);
  assert.match(trendingKeywords, /do not create `\/services\/iv-drip\/`/i);
  assert.match(trendingKeywords, /Clear \+ Brilliant is a different branded device/i);
  assert.match(trendingKeywords, /does not have a verified peptide-therapy service/i);
  assert.match(trendingKeywords, /recorded written website-publication consent/i);
  assert.doesNotMatch(trendingKeywords, /dedicated service pages with the menu and pricing[^\n]*peptide therapy/i);
  assert.doesNotMatch(trendingKeywords, /one strong service page plus a results\/gallery page/i);
});
