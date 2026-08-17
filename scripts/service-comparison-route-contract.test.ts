import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ALL_COMPARISON_SLUGS_QUERY,
  COMPARISON_BY_SLUG_QUERY,
  CONCERN_BY_SLUG_QUERY,
  COST_GUIDE_BY_SLUG_QUERY,
  SERVICE_BY_SLUG_QUERY,
} from '../packages/web/src/lib/queries.ts';

function assertRouteableComparisonOptions(query: string, label: string): void {
  for (const option of ['optionA', 'optionB'] as const) {
    assert.match(
      query,
      new RegExp(`${option}\\.service->status in \\["live", "actual-menu"\\]`),
      `${label} must require ${option}'s service to have a public status.`,
    );
    assert.match(
      query,
      new RegExp(`defined\\(${option}\\.service->slug\\.current\\)`),
      `${label} must require ${option}'s service to have a route slug.`,
    );
    assert.match(
      query,
      new RegExp(`!\\(${option}\\.service->slug\\.current in \\[`),
      `${label} must reject ${option}'s service when its route is unavailable.`,
    );
  }
}

test('comparison backlinks use the same routeability contract as comparison routes', () => {
  for (const [query, label] of [
    [SERVICE_BY_SLUG_QUERY, 'The service comparison projection'],
    [CONCERN_BY_SLUG_QUERY, 'The concern comparison projection'],
    [COST_GUIDE_BY_SLUG_QUERY, 'The cost-guide comparison projection'],
  ] as const) {
    assertRouteableComparisonOptions(query, label);
  }

  assertRouteableComparisonOptions(COMPARISON_BY_SLUG_QUERY, 'The comparison detail query');
  assertRouteableComparisonOptions(ALL_COMPARISON_SLUGS_QUERY, 'The comparison static-path query');

  assert.match(
    SERVICE_BY_SLUG_QUERY,
    /optionA\.service\._ref == \^\._id \|\| optionB\.service\._ref == \^\._id/,
    'The service page must still limit comparison links to comparisons involving that service.',
  );
  assert.match(
    CONCERN_BY_SLUG_QUERY,
    /\^\._id in optionA\.service->concerns\[\]._ref[\s\S]*\^\._id in optionB\.service->concerns\[\]._ref/,
    'The concern page must still limit comparison links to services associated with that concern.',
  );
  assert.match(
    COST_GUIDE_BY_SLUG_QUERY,
    /optionA\.service\._ref == \^\.treatment\._ref \|\| optionB\.service\._ref == \^\.treatment\._ref/,
    'The cost guide must still limit comparison links to comparisons involving its treatment.',
  );
});
