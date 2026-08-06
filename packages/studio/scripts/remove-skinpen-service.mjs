/**
 * Backward-compatible entry point.
 *
 * The original SkinPen cleanup evolved when the owner clarified that
 * microneedling and microchanneling are one service category. Keep the old
 * command safe by routing it through the current canonical migration.
 */

console.warn(
  'remove-skinpen-service.mjs is superseded; running merge-microneedling-service.mjs.',
);

await import('./merge-microneedling-service.mjs');
