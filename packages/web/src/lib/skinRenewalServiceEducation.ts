export type SkinRenewalServiceEducationSlug =
  | 'biorepeel'
  | 'microneedling'
  | 'prf'
  | 'prf-injections';

export type SkinRenewalBookingMode = 'call' | 'consultation' | 'direct';

export interface SkinRenewalMenuFact {
  readonly name: string;
  readonly durationMinutes?: number;
  readonly priceUsd: number;
  readonly bookingMode: SkinRenewalBookingMode;
  readonly note: string;
}

export interface SkinRenewalDistinction {
  readonly label: string;
  readonly text: string;
}

export interface SkinRenewalServiceEducation {
  readonly slug: SkinRenewalServiceEducationSlug;
  readonly title: string;
  readonly whatItIs: string;
  readonly whereItFits: string;
  readonly providerStatement?: string;
  readonly distinctions: readonly SkinRenewalDistinction[];
  readonly faqs?: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
  readonly links?: readonly {
    readonly href: string;
    readonly label: string;
  }[];
  readonly menu: {
    readonly verifiedAt: '2026-08-06';
    readonly items: readonly SkinRenewalMenuFact[];
  };
}

/**
 * Fact-only education for the canonical BioRePeel, Microneedling, and PRF hubs.
 *
 * Prices, appointment lengths, names, and booking modes mirror the August 6,
 * 2026 GlossGenius reconciliation in ALL-SERVICES-PRICING.MD. The topical PRF
 * attribution was clarified by the owner on August 9, 2026. The summaries also
 * preserve the binding Microneedling/Procell taxonomy and the topical-versus-
 * injectable PRF boundary from the current reviewed research.
 *
 * Unsupported neck services, Glo2 combinations, exosomes, recovery, candidacy,
 * protocols, and outcome claims are deliberately absent. The PRF
 * Bio-Filler entry is not described as EZ Gel because that identity remains
 * unresolved in the canonical commerce ledger.
 */
export const SKIN_RENEWAL_SERVICE_EDUCATION = {
  biorepeel: {
    slug: 'biorepeel',
    title: 'BioRePeel',
    whatItIs:
      'BioRePeel is a topical TCA-based chemical peel used for visible surface texture and uneven tone.',
    whereItFits:
      'At House of Rose, BioRePeel Cl3 Rejuvenation is a directly bookable, 45-minute standalone face treatment at $250. Its Series of 3 is also directly bookable; Gold Body, Advanced Acne Scarring, and the Duo Gold Spot Upgrade are provider-arranged appointments.',
    providerStatement:
      'Brandy, Licensed Esthetician, provides the standalone BioRePeel face appointment. She also provides the Series of 3. Amber Mingione, Licensed Esthetician, provides the Gold Body, Advanced Acne Scarring, and Duo Gold Spot Upgrade appointments and uses BioRePeel as an add-on to eligible advanced skin services.',
    distinctions: [
      {
        label: 'What TCA means',
        text: 'TCA stands for trichloroacetic acid, the chemical-peel ingredient named in the BioRePeelCl3 face formulation. The product is applied to the skin rather than injected.',
      },
      {
        label: 'Directly bookable face appointments',
        text: 'BioRePeel Cl3 Rejuvenation is $250 for 45 minutes. Its Series of 3 is $699 with a 50-minute appointment listing.',
      },
      {
        label: 'Provider-arranged variants',
        text: 'Gold Body is $325 for 45 minutes, Advanced Acne Scarring is $450 for 75 minutes, and the Duo Gold Spot Upgrade is $395 for 60 minutes. Call House of Rose to discuss these three appointments.',
      },
      {
        label: 'BioRePeel or Microneedling?',
        text: 'The standalone BioRePeel appointment is a topical peel. Microneedling is a different House of Rose service that uses the Procell device to create controlled microchannels.',
      },
    ],
    menu: {
      verifiedAt: '2026-08-06',
      items: [
        {
          name: 'BioRePeel Cl3 Rejuvenation',
          durationMinutes: 45,
          priceUsd: 250,
          bookingMode: 'direct',
          note: 'Directly bookable standalone face treatment.',
        },
        {
          name: 'BioRePeel Cl3 Rejuvenation — Series of 3',
          durationMinutes: 50,
          priceUsd: 699,
          bookingMode: 'direct',
          note: 'Directly bookable series of three.',
        },
        {
          name: 'BioRePeel Gold — Body',
          durationMinutes: 45,
          priceUsd: 325,
          bookingMode: 'call',
          note: 'Call House of Rose to discuss this body appointment.',
        },
        {
          name: 'BioRePeel Advanced — Acne Scarring',
          durationMinutes: 75,
          priceUsd: 450,
          bookingMode: 'call',
          note: 'Call House of Rose to discuss this advanced appointment.',
        },
        {
          name: 'BioRePeel Duo — Gold Spot Upgrade',
          durationMinutes: 60,
          priceUsd: 395,
          bookingMode: 'call',
          note: 'Call House of Rose to discuss this gold spot upgrade.',
        },
      ],
    },
  },
  microneedling: {
    slug: 'microneedling',
    title: 'Microneedling',
    whatItIs:
      'House of Rose performs Microneedling with the Procell Therapies device to create controlled microchannels.',
    whereItFits:
      'Procell Microchanneling is the device-specific name used for this Microneedling service.',
    providerStatement:
      'Amber Mingione, Licensed Esthetician, provides these Microneedling appointments. When PRF is part of an eligible appointment, her role is topical only.',
    distinctions: [
      {
        label: 'Procell Pro',
        text: 'Procell Pro and Procell MD use the same Procell Therapies device. Pro refers to the Pro Microchannel Serum used with the service.',
      },
      {
        label: 'Procell MD',
        text: 'The MD Microchannel Serum shares the Pro serum’s core formulation and contains twice the concentration of growth factors. The difference is the topical serum, not a different needling device.',
      },
      {
        label: 'Topical PRF',
        text: 'During eligible Microneedling, PRF is applied to the skin surface. Injectable PRF is a different appointment provided by Diana Morrison, RN.',
      },
    ],
    faqs: [
      {
        question: 'What does Procell Microchanneling mean at House of Rose?',
        answer:
          'Microneedling is the service name. When the Procell device or Pro and MD materials are being discussed, House of Rose calls it Procell Microchanneling. It is the same service, not a second treatment.',
      },
      {
        question: 'What is the difference between Procell Pro and Procell MD?',
        answer:
          'Both options use the same Procell Therapies device. Pro uses the Pro Microchannel Serum. The MD serum shares its core formulation and contains twice the concentration of growth factors; the serum is what changes between the two appointments.',
      },
      {
        question: 'How is PRF used during PRF Microneedling?',
        answer:
          'With Amber Mingione, Licensed Esthetician, PRF is applied topically to the skin surface during an eligible Microneedling appointment. Injectable PRF is provided by Diana Morrison, RN as a different appointment.',
      },
    ],
    links: [
      {
        href: '/services/prf/',
        label: 'Topical and injectable PRF',
      },
      {
        href: '/about/providers/amber/',
        label: 'Meet Amber Mingione, Licensed Esthetician',
      },
    ],
    menu: {
      verifiedAt: '2026-08-06',
      items: [
        {
          name: 'Procell Therapies — Consultation',
          durationMinutes: 60,
          priceUsd: 50,
          bookingMode: 'consultation',
          note: 'The 60-minute starting appointment for Microneedling.',
        },
        {
          name: 'Procell Therapies — Pro',
          durationMinutes: 55,
          priceUsd: 300,
          bookingMode: 'direct',
          note: 'Microneedling with the Pro Microchannel Serum.',
        },
        {
          name: 'Procell Therapies — MD',
          durationMinutes: 55,
          priceUsd: 400,
          bookingMode: 'direct',
          note: 'Microneedling with the higher-concentration MD Microchannel Serum.',
        },
        {
          name: 'PRF Microneedling — Consultation',
          durationMinutes: 60,
          priceUsd: 595,
          bookingMode: 'consultation',
          note: 'Microneedling with PRF applied topically.',
        },
      ],
    },
  },
  prf: {
    slug: 'prf',
    title: 'Platelet-Rich Fibrin (PRF)',
    whatItIs:
      'Platelet-rich fibrin (PRF) is prepared from a small sample of your own blood. At House of Rose, it can be applied at the skin surface during Microneedling or used in the injectable PRF Under-Eye and PRF Bio-Filler appointments.',
    whereItFits:
      'Topical PRF stays on the skin surface during Microneedling. PRF Under-Eye and PRF Bio-Filler are injectable consultations provided by Diana Morrison, RN under medical direction.',
    distinctions: [
      {
        label: 'Topical PRF Microneedling',
        text: 'PRF is applied to the skin surface during Microneedling.',
      },
      {
        label: 'PRF Under-Eye',
        text: 'PRF Under-Eye is an injectable service provided by Diana Morrison, RN under medical direction.',
      },
      {
        label: 'PRF Bio-Filler',
        text: 'PRF Bio-Filler is a 45-minute injectable consultation at $899, provided by Diana Morrison, RN under medical direction.',
      },
    ],
    faqs: [
      {
        question: 'What is platelet-rich fibrin (PRF)?',
        answer:
          'PRF is prepared from a small sample of your own blood. House of Rose applies it topically during PRF Microneedling and uses it injectably for PRF Under-Eye and PRF Bio-Filler.',
      },
      {
        question: 'What is the difference between topical and injectable PRF at House of Rose?',
        answer:
          'Topical PRF is applied to the skin surface during Microneedling. Diana Morrison, RN provides the injectable PRF consultations—PRF Under-Eye and PRF Bio-Filler—under medical direction.',
      },
      {
        question: 'Is PRF Bio-Filler the same service as PRF Under-Eye?',
        answer:
          'No. PRF Under-Eye is a $495 injectable consultation with timing confirmed by phone. PRF Bio-Filler is an injectable consultation at $899 for 45 minutes.',
      },
    ],
    links: [
      {
        href: '/services/microneedling/',
        label: 'Topical PRF with Microneedling',
      },
      {
        href: '/services/prf-injections/',
        label: 'Injectable PRF consultations',
      },
      {
        href: '/services/prf-under-eyes/',
        label: 'PRF Under Eyes details',
      },
      {
        href: '/about/providers/amber/',
        label: 'Meet Amber Mingione, Licensed Esthetician',
      },
      {
        href: '/about/providers/diana/',
        label: 'Meet Diana Morrison, RN',
      },
    ],
    menu: {
      verifiedAt: '2026-08-06',
      items: [
        {
          name: 'PRF Microneedling — Consultation',
          durationMinutes: 60,
          priceUsd: 595,
          bookingMode: 'consultation',
          note: 'Microneedling with PRF applied topically.',
        },
        {
          name: 'PRF Under-Eye — Consultation',
          priceUsd: 495,
          bookingMode: 'consultation',
          note: 'Injectable under-eye PRF with Diana Morrison, RN. Call to confirm the appointment length.',
        },
        {
          name: 'PRF Bio-Filler — Consultation',
          durationMinutes: 45,
          priceUsd: 899,
          bookingMode: 'consultation',
          note: 'Injectable PRF consultation with Diana Morrison, RN.',
        },
      ],
    },
  },
  'prf-injections': {
    slug: 'prf-injections',
    title: 'PRF Injections',
    whatItIs:
      'Injectable PRF at House of Rose begins with a small sample of your own blood. The two appointments are PRF Under-Eye and PRF Bio-Filler.',
    whereItFits:
      'Diana Morrison, RN provides both injectable appointments under medical direction. When PRF is part of an eligible Microneedling appointment, it is applied topically at the skin surface instead.',
    distinctions: [
      {
        label: 'PRF Under Eyes',
        text: 'The PRF Under-Eye consultation is $495. Call House of Rose to confirm how much time to allow for the appointment.',
      },
      {
        label: 'PRF Bio-Filler',
        text: 'The PRF Bio-Filler consultation is 45 minutes and priced at $899.',
      },
      {
        label: 'When PRF is topical',
        text: 'During an eligible Microneedling appointment, PRF is applied at the skin surface rather than injected.',
      },
    ],
    faqs: [
      {
        question: 'How much time and cost should I allow for each consultation?',
        answer: 'PRF Under-Eye is a $495 consultation; call House of Rose to confirm the appointment length. PRF Bio-Filler is an $899 consultation scheduled for 45 minutes.',
      },
      {
        question: 'Where does PRF come from?',
        answer: 'PRF is prepared from a small sample of your own blood.',
      },
      {
        question: 'Who provides injectable PRF at House of Rose?',
        answer: 'Diana Morrison, RN provides PRF Under-Eye and PRF Bio-Filler under written physician protocol and medical direction.',
      },
      {
        question: 'Is PRF always injected at House of Rose?',
        answer: 'PRF is also used topically during an eligible Microneedling appointment, where it is applied at the skin surface rather than injected.',
      },
    ],
    links: [
      {
        href: '/services/prf-under-eyes/',
        label: 'PRF Under Eyes details',
      },
      {
        href: '/services/microneedling/',
        label: 'Microneedling with topical PRF',
      },
      {
        href: '/about/providers/diana/',
        label: 'Meet Diana Morrison, RN',
      },
    ],
    menu: {
      verifiedAt: '2026-08-06',
      items: [
        {
          name: 'PRF Under-Eye — Consultation',
          priceUsd: 495,
          bookingMode: 'consultation',
          note: 'Injectable under-eye PRF with Diana Morrison, RN. Call to confirm the appointment length.',
        },
        {
          name: 'PRF Bio-Filler — Consultation',
          durationMinutes: 45,
          priceUsd: 899,
          bookingMode: 'consultation',
          note: 'Injectable PRF consultation with Diana Morrison, RN.',
        },
      ],
    },
  },
} as const satisfies Readonly<
  Record<SkinRenewalServiceEducationSlug, SkinRenewalServiceEducation>
>;

export const isSkinRenewalServiceEducationSlug = (
  slug: string,
): slug is SkinRenewalServiceEducationSlug =>
  Object.prototype.hasOwnProperty.call(SKIN_RENEWAL_SERVICE_EDUCATION, slug);

export const getSkinRenewalServiceEducation = (
  slug: string,
): SkinRenewalServiceEducation | undefined =>
  isSkinRenewalServiceEducationSlug(slug)
    ? SKIN_RENEWAL_SERVICE_EDUCATION[slug]
    : undefined;
