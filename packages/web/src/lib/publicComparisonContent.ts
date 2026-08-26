export interface PublicComparisonRow {
  attribute: string;
  valueA: string;
  valueB: string;
}

export interface PublicComparisonContent {
  title: string;
  metaDescription: string;
  lead: string;
  optionALabel: string;
  optionBLabel: string;
  optionAOverview?: string;
  optionBOverview?: string;
  distinctionHeading: string;
  distinction: string;
  sharedHeading: string;
  shared: string;
  rows: readonly PublicComparisonRow[];
  sources?: readonly {
    title: string;
    url: string;
    note: string;
  }[];
  faqs?: readonly {
    question: string;
    answer: string;
  }[];
}

export const REVIEWED_PUBLIC_COMPARISON_SLUGS = [
  'morpheus8-vs-microneedling',
  'daxxify-vs-botox',
] as const;

const PUBLIC_COMPARISON_CONTENT: Readonly<
  Record<(typeof REVIEWED_PUBLIC_COMPARISON_SLUGS)[number], PublicComparisonContent>
> = {
  'morpheus8-vs-microneedling': {
    title: 'Morpheus8 vs. Microneedling',
    metaDescription:
      'Compare Morpheus8 fractional RF microneedling with non-RF Procell Microneedling at House of Rose, including technology, treatment areas, and recovery limits.',
    lead:
      'Both services use microneedling. Morpheus8 adds fractional bipolar radiofrequency; Procell microneedling does not. That is the central difference between them.',
    optionALabel: 'Morpheus8',
    optionBLabel: 'Microneedling',
    distinctionHeading: 'Radiofrequency is the dividing line.',
    distinction:
      'Morpheus8 pairs microneedles with fractional bipolar radiofrequency. Procell Pro, Procell MD, and Microneedling with topical PRF are the non-radiofrequency options. Morpheus8 is available for tone, texture, eligible scars, and stretch marks.',
    sharedHeading: 'Both still use microneedling.',
    shared:
      'Treatment area and device settings shape the appointment and recovery. The treatment name alone cannot tell you exactly what the next few days will look like.',
    rows: [
      {
        attribute: 'Technology',
        valueA: 'Microneedling with fractional bipolar radiofrequency',
        valueB: 'Microneedling without radiofrequency',
      },
      {
        attribute: 'Current House of Rose role',
        valueA: 'Tone, texture, eligible scars, and stretch marks',
        valueB: 'Tone, texture, and eligible facial scars',
      },
      {
        attribute: 'Treatment areas',
        valueA: 'Face and selected body areas',
        valueB: 'Face; available options vary by service',
      },
      {
        attribute: 'Recovery',
        valueA: 'Varies by treated area and settings',
        valueB: 'Varies by treated area and settings',
      },
    ],
    faqs: [
      {
        question: 'What is the main difference between Morpheus8 and microneedling?',
        answer:
          'Both use microneedling. Morpheus8 also delivers fractional bipolar radiofrequency, while the current Procell microneedling options do not use radiofrequency.',
      },
      {
        question: 'Are Morpheus8 and microneedling the same treatment?',
        answer:
          'No. They share microneedling, but the added radiofrequency in Morpheus8 changes the technology and the current House of Rose service role.',
      },
      {
        question: 'Is recovery the same for both services?',
        answer:
          'Recovery varies with the treatment area and settings. The treatment name alone is not enough to establish an exact recovery period.',
      },
    ],
  },
  'daxxify-vs-botox': {
    title: 'Daxxify vs. Botox',
    metaDescription:
      'Compare Daxxify and Botox at House of Rose: both are priced per product-specific unit, with 60- and 30-minute appointments and non-interchangeable units.',
    lead:
      'House of Rose offers Daxxify and Botox for movement-related lines. Both are priced per product-specific unit; the Daxxify appointment is listed at 60 minutes and the Botox appointment at 30 minutes. A unit of one product is not equivalent to a unit of the other, so a matching per-unit rate does not predict the same dose or total price.',
    optionALabel: 'Daxxify',
    optionBLabel: 'Botox',
    optionAOverview:
      'Daxxify is daxibotulinumtoxinA-lanm. House of Rose lists a 60-minute appointment, priced per Daxxify unit.',
    optionBOverview:
      'Botox is onabotulinumtoxinA. House of Rose lists a 30-minute appointment, priced per Botox unit.',
    distinctionHeading: 'The matching unit price does not make the products equivalent.',
    distinction:
      'Botox contains onabotulinumtoxinA in a formulation with human albumin. Daxxify contains daxibotulinumtoxinA-lanm with the 35-amino-acid peptide excipient RTP004. Each label defines potency in units specific to that product, so a unit count cannot be converted from one to the other.',
    sharedHeading: 'Duration numbers only make sense with their study endpoints.',
    shared:
      'For moderate-to-severe glabellar lines, the Daxxify SAKURA trials reported about 24 weeks to their measured endpoint. A pooled Botox analysis reported 120 days among people who had responded by day 30. Those figures come from separate studies with different definitions rather than one head-to-head test.',
    rows: [
      {
        attribute: 'Active product',
        valueA: 'Daxxify · daxibotulinumtoxinA-lanm',
        valueB: 'Botox · onabotulinumtoxinA',
      },
      {
        attribute: 'Formulation distinction',
        valueA: 'Includes the 35-amino-acid RTP004 peptide excipient',
        valueB: 'Includes human albumin and sodium chloride',
      },
      {
        attribute: 'Current House of Rose pricing structure',
        valueA: 'Priced per Daxxify unit; units are not convertible to Botox units',
        valueB: 'Priced per Botox unit',
      },
      {
        attribute: 'Current appointment length',
        valueA: '60 minutes',
        valueB: '30 minutes',
      },
      {
        attribute: 'Onset evidence',
        valueA: 'Median 3 days to subject-rated improvement of at least 1 point in each SAKURA phase 3 trial',
        valueB: 'Label: chemical denervation typically begins 1–2 days after injection and increases during the first week',
      },
      {
        attribute: 'Glabellar-line duration evidence',
        valueA: 'Median 24.0 and 23.9 weeks maintaining none-or-mild severity at maximum frown in two phase 3 trials',
        valueB: 'Median 120 days among day-30 responders at maximum contraction in a pooled analysis',
      },
      {
        attribute: 'Downtime evidence',
        valueA: 'The label describes possible adverse reactions and injection-related effects rather than one universal downtime period',
        valueB: 'The label describes possible adverse reactions and injection-related effects rather than one universal downtime period',
      },
    ],
    sources: [
      {
        title: 'Daxxify prescribing information',
        url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3aaa6e14-a3f7-4fb2-b9f9-d3a9c3ae1f74',
        note: 'Product formulation, indication, warnings, reported adverse reactions, and unit non-interchangeability.',
      },
      {
        title: 'Botox Cosmetic prescribing information',
        url: 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=485d9b71-6881-42c5-a620-a4360c7192ab',
        note: 'Product formulation, labeled onset and duration language, warnings, reported adverse reactions, and unit non-interchangeability.',
      },
      {
        title: 'Daxxify SAKURA 1 and 2 phase 3 studies',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31609882/',
        note: 'Median subject-rated onset and response duration for moderate-to-severe glabellar lines.',
      },
      {
        title: 'Botox glabellar-line duration meta-analysis',
        url: 'https://pubmed.ncbi.nlm.nih.gov/23106853/',
        note: 'Pooled median duration among day-30 responders.',
      },
    ],
    faqs: [
      {
        question: 'Does a matching per-unit rate mean the total price will be the same?',
        answer:
          'No. A matching per-unit rate does not establish the same total. Daxxify and Botox units are product-specific and cannot be converted. An individual unit count is determined separately.',
      },
      {
        question: 'What do the duration figures actually compare?',
        answer:
          'They report product-specific glabellar-line study results: about 24 weeks to the measured Daxxify endpoint in SAKURA and 120 days among day-30 Botox responders in a pooled analysis. The studies used different endpoints and were not a head-to-head trial. Individual duration varies.',
      },
      {
        question: 'What do the sources say about onset and downtime?',
        answer:
          'The Daxxify SAKURA trials reported a median 3 days to subject-rated improvement of at least 1 point. The Botox Cosmetic label says chemical denervation typically begins 1 to 2 days after injection and increases during the first week. These are different measures. Both labels describe possible adverse reactions, but neither supplies a universal downtime period.',
      },
    ],
  },
};

export function isReviewedPublicComparisonSlug(
  slug: string,
): slug is (typeof REVIEWED_PUBLIC_COMPARISON_SLUGS)[number] {
  return Object.prototype.hasOwnProperty.call(PUBLIC_COMPARISON_CONTENT, slug);
}

export function filterReviewedPublicComparisons<T extends { slug: string }>(
  comparisons: readonly T[],
): T[] {
  return comparisons.filter(({ slug }) => isReviewedPublicComparisonSlug(slug));
}

export function getPublicComparisonContent(slug: string): PublicComparisonContent | null {
  return isReviewedPublicComparisonSlug(slug)
    ? PUBLIC_COMPARISON_CONTENT[slug]
    : null;
}
