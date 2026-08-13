export interface WeightManagementConsultation {
  readonly name: 'GLP-1 Consultation';
  readonly durationMinutes: 40;
  readonly priceUsd: 25;
  readonly verifiedAt: '2026-08-06';
}

export interface WeightManagementFaq {
  readonly question: string;
  readonly answer: string;
}

export interface WeightManagementEducation {
  readonly title: 'GLP-1 Weight Management';
  readonly whatItIs: string;
  readonly provider: string;
  readonly medicationBoundary: string;
  readonly pricing: string;
  readonly consultation: WeightManagementConsultation;
  readonly faqs: readonly WeightManagementFaq[];
}

/**
 * Narrow public facts for the current medical weight-management service.
 * The separate consultation is fully reconciled against the 2026-08-06
 * GlossGenius mirror. Medication prices remain omitted because that source does
 * not establish whether $299/$399 are first-visit or ongoing charges. No dose,
 * outcome, medication-selection, or prescriber assumption belongs here.
 */
export const WEIGHT_MANAGEMENT_EDUCATION = {
  title: 'GLP-1 Weight Management',
  whatItIs:
    'The current House of Rose menu includes a medical consultation, semaglutide, and tirzepatide. This page publishes only the reconciled consultation details.',
  provider:
    'Diana Morrison, RN provides the House of Rose service under written physician protocol and medical direction. The medical director’s role is oversight and protocol supervision, not providing the appointment.',
  medicationBoundary:
    'Semaglutide and tirzepatide are both named on the current menu. That identifies the medications offered within the program; it is not prescribing guidance or a determination that either medication is appropriate for an individual.',
  pricing:
    'Medication pricing is not published on this page because the current source does not establish whether its figures describe a first visit or ongoing charges. Confirm current medication pricing directly with House of Rose.',
  consultation: {
    name: 'GLP-1 Consultation',
    durationMinutes: 40,
    priceUsd: 25,
    verifiedAt: '2026-08-06',
  },
  faqs: [
    {
      question: 'What does House of Rose currently offer for GLP-1 weight management?',
      answer:
        'The current menu separately lists a GLP-1 Consultation, semaglutide, and tirzepatide. Diana Morrison, RN provides the House of Rose service under written physician protocol and medical direction. The medical director’s role is oversight and protocol supervision, not providing the appointment.',
    },
    {
      question: 'Can I choose semaglutide or tirzepatide from this page?',
      answer:
        'No. The menu names both medications, but it is not prescribing guidance and does not establish whether either medication is appropriate for an individual.',
    },
    {
      question: 'What does the GLP-1 consultation cost?',
      answer:
        'The current House of Rose menu lists the GLP-1 Consultation at $25 for 40 minutes. Medication pricing is not published on this page.',
    },
  ],
} as const satisfies WeightManagementEducation;
