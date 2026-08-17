import assert from 'node:assert/strict';
import test from 'node:test';

import { BANNED_PUBLIC_COPY_RULES } from './verify-visibility-plan.mjs';

const rejects = (value) =>
  BANNED_PUBLIC_COPY_RULES.some(([, pattern]) => pattern.test(value));

test('generated-output rules reject binding prohibited and retired public language', () => {
  for (const value of [
    'Ask our skin doctor.',
    'See a dermatologist.',
    'Meet our dermatology specialists.',
    'Ask about exosomes.',
    'This cures acne.',
    'Known for attention to detail.',
    'Known for a steady hand.',
    'Take time to pamper yourself.',
    'Indulge in a treatment.',
    'Treat yourself today.',
  ]) {
    assert.equal(rejects(value), true, `expected generated output to reject: ${value}`);
  }
});

test('generated-output rules preserve factual and operational copy', () => {
  for (const value of [
    'Diana Morrison, RN provides injectable services under written physician protocol.',
    'Medical Director: Joshua Shaw, MD · FL Lic. ME136232',
    'Beauty Glow IV is listed at $170 for 45 minutes.',
    'Call (844) 941-7673 with an after-visit question.',
    'These products are not intended to diagnose, treat, cure, or prevent any disease.',
  ]) {
    assert.equal(rejects(value), false, `expected generated output to preserve: ${value}`);
  }
});
