import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const playbook = readFileSync(
  new URL('../docs/SEO-AEO-PLAYBOOK.md', import.meta.url),
  'utf8',
);
const contentModelMap = readFileSync(
  new URL('../docs/CONTENT-MODEL-MAP.md', import.meta.url),
  'utf8',
);

test('the binding SEO/AEO pricing rule follows commerce truth without inventing visit requirements', () => {
  const honestPricingRule = playbook.match(
    /5\. \*\*Honest pricing\.\*\*([\s\S]*?)\n6\. \*\*Headings/,
  )?.[1];

  assert.ok(honestPricingRule, 'The playbook must retain an inspectable Honest Pricing rule.');
  assert.match(honestPricingRule, /current GlossGenius menu/i);
  assert.match(honestPricingRule, /ALL-SERVICES-PRICING\.MD/);
  assert.match(honestPricingRule, /Sanity display fields are not\s+commerce authority/i);
  assert.match(honestPricingRule, /never infer that a consultation is required/i);
  assert.doesNotMatch(honestPricingRule, /pull from the service['’]s pricing fields/i);
});

test('obsolete provider pricing imports cannot compete with the canonical commerce mirror', () => {
  for (const relativePath of [
    '../docs/GOVERNANCE/internal_only/services/Diana/Diana_services/Diana_Pricing_Menu_Consolidated.md',
    '../docs/GOVERNANCE/internal_only/services/Diana/Diana_services/Diana_Pricing_GlossGenius_Import.csv',
  ]) {
    assert.equal(
      existsSync(new URL(relativePath, import.meta.url)),
      false,
      `${relativePath} must stay removed; ALL-SERVICES-PRICING.MD is the sole local pricing authority.`,
    );
  }
});

test('the pricing page contract accepts verified fixed amounts without inventing generic factors', () => {
  const pricingPageRule = playbook.match(
    /2\. \*\*Pricing page\*\*([\s\S]*?)\n3\. \*\*FAQ page/,
  )?.[1];
  const costGuideContract = contentModelMap.match(
    /### 2\. Pricing page([\s\S]*?)\n### 3\. FAQ page/,
  )?.[1];

  assert.ok(pricingPageRule, 'The playbook must retain an inspectable pricing page rule.');
  assert.match(pricingPageRule, /verified current amount or range/i);
  assert.match(pricingPageRule, /only when reconciled menu facts support it/i);
  assert.doesNotMatch(pricingPageRule, /cost ranges and the factors that move them/i);

  assert.ok(costGuideContract, 'The content model map must retain an inspectable costGuide contract.');
  assert.match(costGuideContract, /reviewed cost-facts overlay/i);
  assert.match(costGuideContract, /verified current amount or range/i);
  assert.match(costGuideContract, /Legacy source fields/i);
  assert.match(costGuideContract, /read-only in Studio and are not public copy authority/i);
});
