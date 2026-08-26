import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { join } from 'node:path';

import { PUBLIC_SERVICES } from '../packages/web/src/lib/serviceCatalog.ts';
import { getServiceEducation } from '../packages/web/src/lib/serviceEducation.ts';

const ROOT = join(import.meta.dirname, '..');
const DIST = join(ROOT, 'packages/web/dist');
const PRE_CARE = '/downloads/treatment-care/house-of-rose-pre-care-guide.pdf';
const AFTERCARE = '/downloads/treatment-care/house-of-rose-aftercare-guide.pdf';

test('every public service has complete consumer education', () => {
  for (const service of PUBLIC_SERVICES) {
    const content = getServiceEducation(service.slug);
    assert.ok(content, `${service.slug} has no public education record`);
    assert.ok(content.paragraphs[0]?.length > 40, `${service.slug} needs a plain-language definition`);
    assert.ok(content.benefits && content.benefits.length >= 2, `${service.slug} needs benefits`);
    assert.ok(content.treatmentSteps && content.treatmentSteps.length >= 3, `${service.slug} needs treatment steps`);
    assert.ok(content.sessionGuidance, `${service.slug} needs session guidance`);
    assert.ok(content.pairings && content.pairings.length >= 1, `${service.slug} needs pairing guidance`);
  }
});

test('every built service page exposes the education sections and both care downloads', () => {
  for (const service of PUBLIC_SERVICES) {
    const html = readFileSync(join(DIST, 'services', service.slug, 'index.html'), 'utf8');
    assert.match(html, /What the treatment consists of|What the program consists of/, `${service.slug} is missing its treatment explanation`);
    assert.ok(html.includes(PRE_CARE), `${service.slug} is missing the pre-care download`);
    assert.ok(html.includes(AFTERCARE), `${service.slug} is missing the aftercare download`);
  }
});

test('built service pages do not leak internal operating language', () => {
  const forbidden = [
    /verifiedAt/i,
    /provider lane/i,
    /booking mode/i,
    /appointment inventory/i,
    /current listing/i,
    /directly bookable/i,
    /commerce source of truth/i,
  ];

  for (const service of PUBLIC_SERVICES) {
    const html = readFileSync(join(DIST, 'services', service.slug, 'index.html'), 'utf8');
    for (const pattern of forbidden) {
      assert.doesNotMatch(html, pattern, `${service.slug} leaked ${pattern}`);
    }
  }
});
