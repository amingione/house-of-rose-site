export interface PublicComparisonRow {
  attribute: string;
  valueA: string;
  valueB: string;
}

export interface PublicComparisonContent {
  title: string;
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
    lead:
      'Both services use microneedling. Morpheus8 adds fractional bipolar radiofrequency; Procell microneedling does not. That is the central difference between them.',
    optionALabel: 'Morpheus8',
    optionBLabel: 'Microneedling',
    distinctionHeading: 'Where they separate',
    distinction:
      'House of Rose lists Morpheus8 for tone, texture, eligible scars, and stretch marks. Microneedling remains the non-radiofrequency option, with Procell Pro, Procell MD, and topical PRF listed separately on the current menu.',
    sharedHeading: 'What they have in common',
    shared:
      'Neither name answers every question on its own. Treatment area, settings, and the exact microneedling option still matter, and recovery varies with those details.',
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
    lead:
      'Daxxify and Botox are two botulinum toxin type A products on the House of Rose Neurotoxin Injections menu. Each is listed at $14 per unit, but the units are product-specific and cannot be compared or converted between products.',
    optionALabel: 'Daxxify',
    optionBLabel: 'Botox',
    optionAOverview:
      'Daxxify is daxibotulinumtoxinA-lanm. The current House of Rose menu lists a 60-minute appointment and a price of $14 per Daxxify unit.',
    optionBOverview:
      'Botox is onabotulinumtoxinA. The current House of Rose menu lists a 30-minute appointment and a price of $14 per Botox unit.',
    distinctionHeading: 'The products are not interchangeable',
    distinction:
      'Botox uses onabotulinumtoxinA in a formulation that includes human albumin. Daxxify uses daxibotulinumtoxinA-lanm with a 35-amino-acid peptide excipient called RTP004. Product choice involves more than matching the number of units.',
    sharedHeading: 'What the evidence can—and cannot—say',
    shared:
      'Separate studies of moderate-to-severe glabellar lines reported different duration endpoints: about 24 weeks for Daxxify in the SAKURA trials and 120 days among day-30 Botox responders in a pooled analysis. Onset was also measured differently. These are not direct head-to-head results, and neither product label establishes one universal downtime period.',
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
        attribute: 'Current House of Rose price',
        valueA: '$14 per Daxxify unit; units are not convertible to Botox units',
        valueB: '$14 per Botox unit',
      },
      {
        attribute: 'Current appointment length',
        valueA: '60 minutes',
        valueB: '30 minutes',
      },
      {
        attribute: 'Published onset evidence',
        valueA: 'Median 3 days to subject-rated improvement of at least 1 point in each SAKURA phase 3 trial',
        valueB: 'Label: chemical denervation typically begins 1–2 days after injection and increases during the first week',
      },
      {
        attribute: 'Published glabellar-line duration evidence',
        valueA: 'Median 24.0 and 23.9 weeks maintaining none-or-mild severity at maximum frown in two phase 3 trials',
        valueB: 'Median 120 days among day-30 responders at maximum contraction in a pooled analysis',
      },
      {
        attribute: 'Downtime evidence',
        valueA: 'The prescribing information reports adverse reactions, but does not establish one universal downtime period',
        valueB: 'The prescribing information reports adverse reactions, but does not establish one universal downtime period',
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
        question: 'Are Daxxify and Botox units interchangeable?',
        answer:
          'No. The prescribing information for both products states that their potency units are product-specific and cannot be compared or converted between botulinum toxin products.',
      },
      {
        question: 'Does the same $14-per-unit price mean the total price is the same?',
        answer:
          'No. House of Rose lists both products at $14 per unit, but the units are not equivalent. The per-unit prices do not create a dose-conversion table or establish the same total treatment price.',
      },
      {
        question: 'Does Daxxify last longer than Botox?',
        answer:
          'Separate glabellar-line studies reported different duration endpoints for the two products, but they were not a direct head-to-head trial. The published figures should be read as product-specific study results, and individual duration varies.',
      },
      {
        question: 'How soon do Daxxify and Botox start working?',
        answer:
          'In the SAKURA phase 3 trials, the median time to a subject-rated improvement of at least 1 point was 3 days for Daxxify. The Botox Cosmetic label says chemical denervation typically begins 1 to 2 days after injection and increases during the first week. Those are different endpoints, not a direct onset comparison.',
      },
      {
        question: 'Is there a verified downtime difference between Daxxify and Botox?',
        answer:
          'No comparable universal downtime period is established by the product labels. Both labels report possible adverse reactions and injection-related effects, so an individual recovery experience should not be inferred from a blanket downtime claim.',
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
