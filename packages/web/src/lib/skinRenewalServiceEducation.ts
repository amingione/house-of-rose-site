export type SkinRenewalServiceEducationSlug =
  | 'biorepeel'
  | 'microneedling'
  | 'prf'
  | 'prf-injections';

export type SkinRenewalBookingMode = 'consultation' | 'direct';

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
  readonly distinctions: readonly SkinRenewalDistinction[];
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
 * Unsupported body and neck services, Glo2 combinations, exosomes, recovery,
 * candidacy, protocols, and outcome claims are deliberately absent. The PRF
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
      'At House of Rose, BioRePeel Cl3 Rejuvenation is a directly bookable, 45-minute standalone face treatment at $250.',
    distinctions: [
      {
        label: 'What TCA means',
        text: 'TCA stands for trichloroacetic acid, the chemical-peel ingredient named in the BioRePeelCl3 face formulation. The product is applied to the skin rather than injected.',
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
    distinctions: [
      {
        label: 'Procell Pro',
        text: 'Procell Pro is a current menu option within the Microneedling service.',
      },
      {
        label: 'Procell MD',
        text: 'Procell MD is a current menu option within the Microneedling service.',
      },
      {
        label: 'Topical PRF',
        text: 'During eligible Microneedling, PRF is applied to the skin surface. This listing does not involve a PRF injection.',
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
          note: 'Entry point for the canonical Microneedling service.',
        },
        {
          name: 'Procell Therapies — Pro',
          durationMinutes: 55,
          priceUsd: 300,
          bookingMode: 'direct',
          note: 'Current Procell option within Microneedling.',
        },
        {
          name: 'Procell Therapies — MD',
          durationMinutes: 55,
          priceUsd: 400,
          bookingMode: 'direct',
          note: 'Current Procell option within Microneedling.',
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
      'House of Rose currently lists PRF in three forms: topical PRF with Microneedling, injectable PRF Under-Eye, and injectable PRF Bio-Filler.',
    whereItFits:
      'The Microneedling listing uses PRF at the skin surface. Under-Eye and Bio-Filler have their own injectable consultation listings.',
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
        text: 'PRF Bio-Filler has its own consultation listing at $899.',
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
          note: 'Injectable under-eye PRF with Diana Morrison, RN. Duration is withheld while current sources are reconciled.',
        },
        {
          name: 'PRF Bio-Filler — Consultation',
          durationMinutes: 45,
          priceUsd: 899,
          bookingMode: 'consultation',
          note: 'Current injectable PRF listing.',
        },
      ],
    },
  },
  'prf-injections': {
    slug: 'prf-injections',
    title: 'PRF Injections',
    whatItIs:
      'PRF Injections is the House of Rose category for injectable PRF services provided by Diana Morrison, RN under medical direction.',
    whereItFits:
      'The injectable menu contains PRF Under-Eye and PRF Bio-Filler. Topical PRF appears on the Microneedling page, where it is applied to the skin surface.',
    distinctions: [
      {
        label: 'PRF Under-Eye',
        text: 'PRF Under-Eye is an injectable service with a current listed price of $495.',
      },
      {
        label: 'PRF Bio-Filler',
        text: 'The PRF Bio-Filler consultation is currently listed at $899.',
      },
      {
        label: 'Topical PRF Microneedling',
        text: 'The Microneedling service uses topical PRF at the skin surface.',
      },
    ],
    menu: {
      verifiedAt: '2026-08-06',
      items: [
        {
          name: 'PRF Under-Eye — Consultation',
          priceUsd: 495,
          bookingMode: 'consultation',
          note: 'Injectable under-eye PRF with Diana Morrison, RN. Duration is withheld while current sources are reconciled.',
        },
        {
          name: 'PRF Bio-Filler — Consultation',
          durationMinutes: 45,
          priceUsd: 899,
          bookingMode: 'consultation',
          note: 'Current injectable PRF listing.',
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
