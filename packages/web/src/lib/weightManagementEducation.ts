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
  readonly plainLanguageDefinition: string;
  readonly medicationDifference: string;
  readonly provider: string;
  readonly consultationRole: string;
  readonly pricing: string;
  readonly consultation: WeightManagementConsultation;
  readonly faqs: readonly WeightManagementFaq[];
}

/**
 * Narrow public facts for the current medical weight-management service.
 * The separate consultation is fully reconciled against the 2026-08-06
 * GlossGenius mirror. Per the 2026-08-20 binding rule in CLAUDE.md, House of
 * Rose pricing is never public — `priceUsd` below is retained for
 * internal/GlossGenius paste-ready use only and must never be read by a
 * public renderer. No dose, outcome, medication-selection, or prescriber
 * assumption belongs here. The receptor distinction follows the current FDA
 * prescribing information and the reviewed internal GLP-1 research brief.
 */
export const WEIGHT_MANAGEMENT_EDUCATION = {
  title: 'GLP-1 Weight Management',
  whatItIs:
    'House of Rose offers medical weight management with semaglutide and tirzepatide. The 40-minute GLP-1 Consultation has its own listing; call House of Rose for medication and ongoing program pricing.',
  plainLanguageDefinition:
    'GLP-1 is short for glucagon-like peptide-1, a hormone involved in appetite regulation. Both medications named by House of Rose act at the GLP-1 receptor.',
  medicationDifference:
    'Semaglutide is a GLP-1 receptor agonist. Tirzepatide acts at both the GIP and GLP-1 receptors. That is the factual mechanism difference between the two medication names; it is not a recommendation for either one.',
  provider:
    'Your appointment is with Diana Morrison, RN. She provides the House of Rose service under written physician protocol and medical direction; Joshua Shaw, MD oversees the protocol rather than seeing clients for these appointments.',
  consultationRole:
    'The 40-minute consultation with Diana Morrison, RN has its own listing. It does not include medication or ongoing program charges.',
  pricing:
    'The 40-minute consultation is its own listing. Call House of Rose for medication and ongoing program pricing.',
  consultation: {
    name: 'GLP-1 Consultation',
    durationMinutes: 40,
    priceUsd: 25,
    verifiedAt: '2026-08-06',
  },
  faqs: [
    {
      question: 'What does GLP-1 mean?',
      answer:
        'GLP-1 stands for glucagon-like peptide-1, a hormone involved in appetite regulation. Semaglutide acts at the GLP-1 receptor, while tirzepatide acts at both the GIP and GLP-1 receptors.',
    },
    {
      question: 'Are semaglutide and tirzepatide the same medication?',
      answer:
        'No. Semaglutide is a GLP-1 receptor agonist. Tirzepatide is a dual GIP and GLP-1 receptor agonist.',
    },
    {
      question: 'What does the GLP-1 consultation price cover?',
      answer:
        'It covers the 40-minute consultation with Diana Morrison, RN. Medication and ongoing program charges are separate. Ask about current pricing when you book.',
    },
    {
      question: 'Who provides GLP-1 weight management at House of Rose?',
      answer:
        'Your appointment is with Diana Morrison, RN. She provides the service under written physician protocol and medical direction; Joshua Shaw, MD oversees the protocol rather than seeing clients for these appointments.',
    },
    {
      question: 'How do I confirm medication and ongoing program costs?',
      answer:
        'Call House of Rose for those prices. Medication and ongoing program charges are separate from the consultation.',
    },
  ],
} as const satisfies WeightManagementEducation;
