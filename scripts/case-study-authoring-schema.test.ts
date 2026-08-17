import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { caseStudy } from '../packages/studio/schemas/caseStudy.ts';
import { RETIRED_PUBLIC_CONCERN_SLUGS } from '../packages/web/src/lib/publicConcernContent.ts';
import { UNAVAILABLE_PUBLIC_SERVICE_SLUGS } from '../packages/web/src/lib/publicServiceContent.ts';
import {
  ALL_CASE_STUDIES_QUERY,
  ALL_CASE_STUDY_SLUGS_QUERY,
  CASE_STUDY_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

test('directly published case-study copy uses the shared public-copy guard', () => {
  for (const fieldName of ['title', 'clientProfile', 'protocol', 'timeframe', 'outcome']) {
    const field = caseStudy.fields.find(({ name }) => name === fieldName);
    assert.equal(typeof field?.validation, 'function', `${fieldName} must validate public copy.`);
    assert.match(String(field?.validation), /validatePublicCopy/);
  }
});

test('case-study prompts require useful evidence without a promotional or process template', () => {
  const title = caseStudy.fields.find(({ name }) => name === 'title');
  const protocol = caseStudy.fields.find(({ name }) => name === 'protocol');
  const outcome = caseStudy.fields.find(({ name }) => name === 'outcome');

  assert.match(String(title?.description), /documented subject/i);
  assert.match(String(protocol?.description), /enough context/i);
  assert.match(String(protocol?.description), /do not narrate a generic treatment process/i);
  assert.match(String(outcome?.description), /observable documented change/i);
  assert.match(String(outcome?.description), /generic benefit line/i);
});

test('consented results-image alt text uses the shared public-copy guard', () => {
  for (const fieldName of ['beforeImage', 'afterImage']) {
    const image = caseStudy.fields.find(({ name }) => name === fieldName);
    assert.ok(image && 'fields' in image && Array.isArray(image.fields));
    const alt = image.fields.find(({ name }) => name === 'alt');

    assert.equal(typeof alt?.validation, 'function', `${fieldName}.alt must validate public copy.`);
    assert.match(String(alt.validation), /validatePublicCopy/);

    const rule = {
      custom(fn: (value: string | undefined) => true | string) {
        return { validate: fn };
      },
    };
    const { validate } = alt.validation(rule);
    assert.equal(validate('Documented treatment area before the recorded service.'), true);
    assert.match(String(validate('Flawless transformation after treatment.')), /retired or prohibited/i);
  }
});

test('case-study treatment links can resolve only to generated public service routes', () => {
  const treatment = caseStudy.fields.find(({ name }) => name === 'treatment');
  assert.equal(treatment?.type, 'reference');
  const authoringFilter = String(treatment?.options?.filter);

  assert.match(authoringFilter, /status in \["live", "actual-menu"\]/);
  assert.match(authoringFilter, /defined\(slug\.current\)/);
  assert.match(authoringFilter, /!\(slug\.current in \$unavailableSlugs\)/);
  assert.deepEqual(
    treatment?.options?.filterParams,
    { unavailableSlugs: UNAVAILABLE_PUBLIC_SERVICE_SLUGS },
  );

  for (const query of [
    ALL_CASE_STUDIES_QUERY,
    CASE_STUDY_BY_SLUG_QUERY,
    ALL_CASE_STUDY_SLUGS_QUERY,
  ]) {
    assert.match(query, /treatment->status in \["live", "actual-menu"\]/);
    assert.match(query, /defined\(treatment->slug\.current\)/);
    assert.match(query, /!\(treatment->slug\.current in \[/);
  }
});

test('optional case-study concern links resolve only to generated public concern routes', () => {
  const concern = caseStudy.fields.find(({ name }) => name === 'concern');
  assert.equal(concern?.type, 'reference');
  assert.equal(concern?.validation, undefined, 'A case study may omit its concern relationship.');

  const authoringFilter = String(concern?.options?.filter);
  assert.match(authoringFilter, /status == "live"/);
  assert.match(authoringFilter, /defined\(slug\.current\)/);
  assert.match(authoringFilter, /!\(slug\.current in \$retiredSlugs\)/);
  assert.deepEqual(
    concern?.options?.filterParams,
    { retiredSlugs: RETIRED_PUBLIC_CONCERN_SLUGS },
  );

  assert.match(CASE_STUDY_BY_SLUG_QUERY, /"concern": select\(/);
  assert.match(CASE_STUDY_BY_SLUG_QUERY, /concern->status == "live"/);
  assert.match(CASE_STUDY_BY_SLUG_QUERY, /defined\(concern->slug\.current\)/);
  assert.match(CASE_STUDY_BY_SLUG_QUERY, /!\(concern->slug\.current in \[/);

  const route = readFileSync('packages/web/src/pages/results/[slug].astro', 'utf8');
  assert.match(route, /cs\.concern && <a href=\{`\/concerns\/\$\{cs\.concern\.slug\}\/`\}/);
  assert.match(route, /\{cs\.concern\.title\}<\/a>/);
});

test('public results require consent, a generated route, and the documented image pair', () => {
  const slug = caseStudy.fields.find(({ name }) => name === 'slug');
  const consent = caseStudy.fields.find(({ name }) => name === 'consentGiven');
  const beforeImage = caseStudy.fields.find(({ name }) => name === 'beforeImage');
  const afterImage = caseStudy.fields.find(({ name }) => name === 'afterImage');
  assert.match(String(slug?.validation), /required/);
  assert.match(String(consent?.validation), /required/);
  assert.match(String(beforeImage?.validation), /required/);
  assert.match(String(afterImage?.validation), /required/);

  for (const query of [ALL_CASE_STUDIES_QUERY, CASE_STUDY_BY_SLUG_QUERY, ALL_CASE_STUDY_SLUGS_QUERY]) {
    assert.match(query, /consentGiven == true/);
    assert.match(query, /defined\(beforeImage\.asset\)/);
    assert.match(query, /defined\(afterImage\.asset\)/);
  }

  for (const query of [ALL_CASE_STUDIES_QUERY, ALL_CASE_STUDY_SLUGS_QUERY]) {
    assert.match(query, /defined\(slug\.current\)/);
  }
});
