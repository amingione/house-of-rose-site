import { defineField, defineType } from 'sanity';

/**
 * Object types backing the four treatment-page blocks that had no home in
 * `service`: downtime, aftercare, provider scope, and price range.
 *
 * Compliance constraints encoded here on purpose:
 *  - A named practitioner must include the license type. This object records
 *    scope; the service's provider reference supplies the verified public name.
 *  - Every page that shows an outcome must carry a service-specific results-
 *    variance line (FL Board of Medicine Rule 64B8-11.001). Pages without an
 *    outcome claim do not need generic disclaimer copy.
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
          { title: 'None — exact procedure must be reviewed', value: 'none' },
          { title: 'Minimal — use the approved service-specific summary', value: 'minimal' },
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
      title: 'Recovery by Time Window',
      type: 'array',
      description: 'Approved time-window facts for this exact service. Do not fill every window or turn recovery into a required narrative.',
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
              title: 'Observable Guidance',
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
  description: 'Reviewed instructions for this exact service. Leave the object absent when no approved client guidance exists.',
  fields: [
    defineField({
      name: 'intro',
      title: 'Aftercare Intro',
      type: 'text',
      rows: 2,
      description: 'One or two factual sentences explaining why the instructions matter for this service.',
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
    'Who performs this treatment and under what authority. Record licensure here; use the service provider reference for a verified public name and license type.',
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
        'Required true for injectables, IV therapy, weight management, microneedling, microchanneling, and other services delivered under the practice’s written physician protocol.',
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
      title: 'Consultation Required (legacy — not published)',
      type: 'boolean',
      readOnly: true,
      description:
        'Stored for compatibility only. This field does not control the website or booking flow. Use the service booking mode and verified booking URL for the actual next step.',
    }),
    defineField({
      name: 'disclaimer',
      title: 'Service-Specific Variance Note',
      type: 'text',
      rows: 2,
      description:
        'Use only when this service publishes an outcome claim. State that individual outcomes vary without adding generic consultation, candidacy, or medical-advice boilerplate.',
      validation: (R) =>
        R.custom((value) => {
          if (!value) return true;
          if (/\bcandidacy is determined at consultation\b/i.test(value)) {
            return 'Remove the retired candidacy/consultation boilerplate and keep only a service-specific variance note.';
          }
          if (/\bthis page is general information and is not medical advice\b/i.test(value)) {
            return 'Remove the generic medical-advice boilerplate and keep only a service-specific variance note.';
          }
          return /\bindividual (?:outcomes?|results?) var(?:y|ies)\b/i.test(value)
            ? true
            : 'A published variance note must state that individual outcomes or results vary.';
        }),
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
