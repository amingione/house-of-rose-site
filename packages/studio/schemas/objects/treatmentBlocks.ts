import { defineField, defineType } from 'sanity';

/**
 * Object types backing the four treatment-page blocks that had no home in
 * `service`: downtime, aftercare, provider scope, and price range.
 *
 * Compliance constraints encoded here on purpose:
 *  - No House of Rose staff or owner names anywhere client-facing. Scope is
 *    described by licensure and delegation, never by person.
 *  - Every page that shows an outcome must carry a results-variance line
 *    (FL Board of Medicine Rule 64B8-11.001). `treatmentProviderScope.disclaimer`
 *    is required for that reason.
 *  - Price is display-only. GlossGenius remains commerce truth; this mirrors it.
 */

// ─── Downtime ─────────────────────────────────────────────────────────────────

export const treatmentDowntime = defineType({
  name: 'treatmentDowntime',
  title: 'Downtime',
  type: 'object',
  fields: [
    defineField({
      name: 'level',
      title: 'Downtime Level',
      type: 'string',
      description: 'Drives the badge on the page and the recovery signal in search results.',
      options: {
        list: [
          { title: 'None — return to normal activity immediately', value: 'none' },
          { title: 'Minimal — makeup-ready same or next day', value: 'minimal' },
          { title: 'Moderate — visible redness or texture for several days', value: 'moderate' },
          { title: 'Significant — plan around social and work commitments', value: 'significant' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Downtime Summary',
      type: 'text',
      rows: 3,
      description:
        'One paragraph a client can act on. State what is visible, for how long, and when makeup is appropriate. No guarantees.',
      validation: (R) => R.required().max(400),
    }),
    defineField({
      name: 'returnToMakeup',
      title: 'Return to Makeup',
      type: 'string',
      description: 'e.g. "24 hours" or "Same day". Leave empty when not applicable.',
    }),
    defineField({
      name: 'returnToExercise',
      title: 'Return to Exercise / Heat',
      type: 'string',
      description: 'e.g. "48 hours — no sauna, steam, or hot yoga."',
    }),
    defineField({
      name: 'timeline',
      title: 'Recovery Timeline',
      type: 'array',
      description: 'Sequential milestones. Keep to what is typical, not best case.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'window',
              title: 'Time Window',
              type: 'string',
              description: 'e.g. "First 24 hours", "Days 2–3", "Week 2".',
              validation: (R) => R.required(),
            }),
            defineField({
              name: 'expectation',
              title: 'What to Expect',
              type: 'text',
              rows: 2,
              validation: (R) => R.required(),
            }),
          ],
          preview: { select: { title: 'window', subtitle: 'expectation' } },
        },
      ],
      validation: (R) => R.max(6),
    }),
  ],
  preview: {
    select: { level: 'level', summary: 'summary' },
    prepare: ({ level, summary }: { level?: string; summary?: string }) => ({
      title: `Downtime — ${level ?? 'unset'}`,
      subtitle: summary,
    }),
  },
});

// ─── Aftercare ────────────────────────────────────────────────────────────────

export const treatmentAftercare = defineType({
  name: 'treatmentAftercare',
  title: 'Aftercare',
  type: 'object',
  description: 'Client-facing aftercare. Mirrors the clinical protocol but written for a client, not a provider.',
  fields: [
    defineField({
      name: 'intro',
      title: 'Aftercare Intro',
      type: 'text',
      rows: 2,
      description: 'One or two sentences framing why aftercare determines the result.',
      validation: (R) => R.max(300),
    }),
    defineField({
      name: 'firstDay',
      title: 'First 24 Hours',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.max(8),
    }),
    defineField({
      name: 'firstWeek',
      title: 'First Week',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (R) => R.max(8),
    }),
    defineField({
      name: 'avoid',
      title: 'Avoid',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Hard stops. Retinoids, acids, heat, sun, active exfoliation, and similar.',
      validation: (R) => R.max(8),
    }),
    defineField({
      name: 'ongoing',
      title: 'Ongoing Maintenance',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Cadence and home-care support. Never phrase as a membership or plan.',
      validation: (R) => R.max(6),
    }),
    defineField({
      name: 'protocolRef',
      title: 'Internal Protocol Reference',
      type: 'string',
      description:
        'Operational cross-reference only — never rendered. e.g. "HOR-P004 (PRF & Procell Aftercare)".',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Aftercare' }),
  },
});

// ─── Provider scope ───────────────────────────────────────────────────────────

export const treatmentProviderScope = defineType({
  name: 'treatmentProviderScope',
  title: 'Provider Qualifications',
  type: 'object',
  description:
    'Who performs this treatment and under what authority. Describe licensure only — never a staff or owner name.',
  fields: [
    defineField({
      name: 'performedBy',
      title: 'Performed By',
      type: 'string',
      options: {
        list: [
          { title: 'Registered Nurse (RN) — medical scope', value: 'rn' },
          { title: 'Licensed Esthetician — esthetics scope', value: 'esthetician' },
          { title: 'RN or Licensed Esthetician, by protocol', value: 'either' },
        ],
        layout: 'radio',
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'medicalDirection',
      title: 'Under Physician Medical Direction',
      type: 'boolean',
      initialValue: false,
      description:
        'Required true for injectables, IV therapy, weight management, and any device that breaches the epidermis (FL Rule 61G5-18.00015 excludes microneedling from esthetician scope regardless of naming).',
    }),
    defineField({
      name: 'credentialPoints',
      title: 'Credential Points',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Licensure, certification, and training statements. Must be true and verifiable. e.g. "Florida-licensed registered nurse", "Manufacturer-certified on the device used".',
      validation: (R) => R.required().min(1).max(6),
    }),
    defineField({
      name: 'consultRequired',
      title: 'Consultation Required Before Treatment',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'disclaimer',
      title: 'Results Disclaimer',
      type: 'text',
      rows: 2,
      initialValue:
        'Individual results vary. Candidacy is determined at consultation. This page is general information and is not medical advice.',
      description:
        'Required on every treatment page (FL Board of Medicine Rule 64B8-11.001). Do not remove.',
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { performedBy: 'performedBy', medicalDirection: 'medicalDirection' },
    prepare: ({ performedBy, medicalDirection }: { performedBy?: string; medicalDirection?: boolean }) => ({
      title: `Performed by: ${performedBy ?? 'unset'}`,
      subtitle: medicalDirection ? 'Under physician medical direction' : 'Esthetics scope',
    }),
  },
});

// ─── Price range ──────────────────────────────────────────────────────────────

export const treatmentPriceRange = defineType({
  name: 'treatmentPriceRange',
  title: 'Price Range',
  type: 'object',
  description:
    'Display mirror of GlossGenius. GlossGenius remains commerce truth — if these disagree, GlossGenius wins and this is corrected.',
  fields: [
    defineField({
      name: 'minPrice',
      title: 'Minimum Price (USD)',
      type: 'number',
      validation: (R) => R.required().min(0),
    }),
    defineField({
      name: 'maxPrice',
      title: 'Maximum Price (USD)',
      type: 'number',
      description: 'Leave empty for a single starting-at price.',
      validation: (R) =>
        R.min(0).custom((value, context) => {
          const min = (context.parent as { minPrice?: number } | undefined)?.minPrice;
          if (value == null || min == null) return true;
          return value >= min || 'Maximum price must be greater than or equal to minimum price.';
        }),
    }),
    defineField({
      name: 'unit',
      title: 'Priced By',
      type: 'string',
      options: {
        list: [
          { title: 'Per session', value: 'session' },
          { title: 'Per unit', value: 'unit' },
          { title: 'Per syringe', value: 'syringe' },
          { title: 'Per area', value: 'area' },
          { title: 'Per month', value: 'month' },
          { title: 'Program', value: 'program' },
        ],
      },
      initialValue: 'session',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'note',
      title: 'Pricing Note',
      type: 'text',
      rows: 2,
      description:
        'What moves the number — units, areas, session count. No discount or promotional framing.',
      validation: (R) => R.max(280),
    }),
    defineField({
      name: 'verifiedAgainstGlossGenius',
      title: 'Verified Against GlossGenius',
      type: 'date',
      description: 'Set on every reconciliation pass. Stale dates are flagged by the drift guard.',
      validation: (R) => R.required(),
    }),
  ],
  preview: {
    select: { min: 'minPrice', max: 'maxPrice', unit: 'unit' },
    prepare: ({ min, max, unit }: { min?: number; max?: number; unit?: string }) => ({
      title: max && max !== min ? `$${min}–$${max}` : `From $${min}`,
      subtitle: `per ${unit ?? 'session'}`,
    }),
  },
});

export const treatmentObjectTypes = [
  treatmentDowntime,
  treatmentAftercare,
  treatmentProviderScope,
  treatmentPriceRange,
];
