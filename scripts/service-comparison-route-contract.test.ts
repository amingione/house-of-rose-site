import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ALL_COMPARISON_SLUGS_QUERY,
  COMPARISON_BY_SLUG_QUERY,
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

test('service comparison backlinks use the same routeability contract as comparison routes', () => {
  assertRouteableComparisonOptions(SERVICE_BY_SLUG_QUERY, 'The service comparison projection');
  assertRouteableComparisonOptions(COMPARISON_BY_SLUG_QUERY, 'The comparison detail query');
  assertRouteableComparisonOptions(ALL_COMPARISON_SLUGS_QUERY, 'The comparison static-path query');

  assert.match(
    SERVICE_BY_SLUG_QUERY,
    /optionA\.service\._ref == \^\._id \|\| optionB\.service\._ref == \^\._id/,
    'The service page must still limit comparison links to comparisons involving that service.',
  );
});
