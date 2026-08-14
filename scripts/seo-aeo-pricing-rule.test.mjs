import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const playbook = readFileSync(
  new URL('../docs/SEO-AEO-PLAYBOOK.md', import.meta.url),
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
