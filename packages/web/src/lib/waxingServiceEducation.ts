export type WaxingServiceEducationSlug = 'waxing' | 'facial-waxing' | 'body-waxing';

export interface WaxingMenuItem {
  readonly name: string;
  readonly priceUsd: number;
  readonly durationMinutes: number;
  readonly category: 'Facial waxing' | 'Body waxing';
}

export interface WaxingServiceEducation {
  readonly slug: WaxingServiceEducationSlug;
  readonly title: string;
  readonly whatItIs: string;
  readonly whereItFits: string;
  readonly distinctions: readonly {
    readonly label: string;
    readonly text: string;
  }[];
  readonly faqs?: readonly {
    readonly question: string;
    readonly answer: string;
  }[];
  readonly menu?: {
    readonly heading: string;
    readonly items: readonly WaxingMenuItem[];
  };
  readonly provider?: {
    readonly publicName: string;
    readonly profilePath: string;
  };
  readonly links?: readonly {
    readonly href: string;
    readonly label: string;
  }[];
}

const FACIAL_WAXING_ITEMS = [
  { name: 'Chin', priceUsd: 10, durationMinutes: 30, category: 'Facial waxing' },
  { name: 'Upper Lip', priceUsd: 10, durationMinutes: 10, category: 'Facial waxing' },
  { name: 'Eyebrows', priceUsd: 15, durationMinutes: 10, category: 'Facial waxing' },
  { name: 'Eyebrow Shape, Trim & Wax', priceUsd: 25, durationMinutes: 25, category: 'Facial waxing' },
] as const satisfies readonly WaxingMenuItem[];

const BODY_WAXING_ITEMS = [
  { name: 'Underarms', priceUsd: 20, durationMinutes: 30, category: 'Body waxing' },
  { name: 'Bikini Line', priceUsd: 30, durationMinutes: 10, category: 'Body waxing' },
  { name: 'Chest', priceUsd: 40, durationMinutes: 40, category: 'Body waxing' },
  { name: 'Back', priceUsd: 50, durationMinutes: 40, category: 'Body waxing' },
  { name: 'Full Leg', priceUsd: 65, durationMinutes: 10, category: 'Body waxing' },
  { name: 'Partial Leg', priceUsd: 45, durationMinutes: 30, category: 'Body waxing' },
  { name: 'Full Arm', priceUsd: 45, durationMinutes: 30, category: 'Body waxing' },
] as const satisfies readonly WaxingMenuItem[];

/**
 * Waxing inventory copied from the GlossGenius-backed menu reconciliation dated
 * 2026-08-06. Keep the hub explanatory; the child pages own their area menus.
 * Brazilian waxing is deliberately absent because it is not in the verified
 * current inventory.
 */
export const WAXING_SERVICE_EDUCATION = {
  waxing: {
    slug: 'waxing',
    title: 'Waxing',
    whatItIs:
      'House of Rose books 11 waxing appointments by area: four for the face and seven for the body.',
    whereItFits:
      'Facial Waxing has a direct online booking path. Body Waxing is arranged by phone, beginning with the body area you want waxed.',
    distinctions: [
      {
        label: 'Four facial appointments',
        text: 'Brandy, Licensed Esthetician provides waxing for the chin, upper lip, and brows, including a longer brow appointment with shaping and trimming.',
      },
      {
        label: 'Seven body appointments',
        text: 'Brandy, Licensed Esthetician provides body waxing for the underarms, bikini line, chest, back, full leg, partial leg, and full arm. Each area has its own price and appointment length.',
      },
    ],
    faqs: [
      {
        question: 'Can facial and body waxing both be booked online?',
        answer: 'Facial Waxing has a direct booking link. For Body Waxing, call House of Rose and name the area you want waxed.',
      },
    ],
    menu: {
      heading: 'The complete waxing menu',
      items: [...FACIAL_WAXING_ITEMS, ...BODY_WAXING_ITEMS],
    },
    links: [
      {
        href: '/about/providers/brandy/',
        label: 'Meet Brandy, Licensed Esthetician',
      },
    ],
  },
  'facial-waxing': {
    slug: 'facial-waxing',
    title: 'Facial Waxing',
    whatItIs:
      'House of Rose books facial waxing for the chin, upper lip, and eyebrows. Brow appointments are offered in two forms: Eyebrows, and Eyebrow Shape, Trim & Wax.',
    whereItFits:
      'Use Eyebrows for the 10-minute brow-wax appointment. Eyebrow Shape, Trim & Wax is the 25-minute option that includes shaping and trimming; Upper Lip and Chin remain individual appointments.',
    distinctions: [
      {
        label: 'Brow wax',
        text: 'Eyebrows is the 10-minute, $15 appointment.',
      },
      {
        label: 'Shape, trim, and wax',
        text: 'Eyebrow Shape, Trim & Wax is the 25-minute, $25 appointment.',
      },
      {
        label: 'Upper lip and chin',
        text: 'Upper Lip is $10 for 10 minutes. Chin is $10 for 30 minutes.',
      },
    ],
    menu: {
      heading: 'Facial waxing by area',
      items: FACIAL_WAXING_ITEMS,
    },
    provider: {
      publicName: 'Brandy, Licensed Esthetician',
      profilePath: '/about/providers/brandy/',
    },
  },
  'body-waxing': {
    slug: 'body-waxing',
    title: 'Body Waxing',
    whatItIs:
      'House of Rose books seven body-waxing appointments: underarms, bikini line, chest, back, full leg, partial leg, and full arm.',
    whereItFits:
      'Brandy, Licensed Esthetician provides Body Waxing, which is arranged by phone. Name the area you want waxed; for legs, specify Full Leg or Partial Leg because they are separate appointments.',
    distinctions: [
      {
        label: 'Upper-body areas',
        text: 'Underarms, chest, back, and full arm each have their own price and appointment length.',
      },
      {
        label: 'Full or partial leg',
        text: 'Full Leg is $65 for 10 minutes; Partial Leg is $45 for 30 minutes. Name the one you want when you call.',
      },
      {
        label: 'Bikini line',
        text: 'The available bikini-area appointment is Bikini Line at $30 for 10 minutes.',
      },
    ],
    faqs: [
      {
        question: 'How do I book body waxing?',
        answer: 'Call House of Rose and name one of the seven available areas: underarms, bikini line, chest, back, full leg, partial leg, or full arm.',
      },
      {
        question: 'Which bikini-area waxing appointment is available?',
        answer: 'The available bikini-area appointment is Bikini Line at $30 for 10 minutes.',
      },
    ],
    menu: {
      heading: 'Body waxing by area',
      items: BODY_WAXING_ITEMS,
    },
    links: [
      {
        href: '/about/providers/brandy/',
        label: 'Meet Brandy, Licensed Esthetician',
      },
    ],
  },
} as const satisfies Readonly<
  Record<WaxingServiceEducationSlug, WaxingServiceEducation>
>;

export const isWaxingServiceEducationSlug = (
  slug: string,
): slug is WaxingServiceEducationSlug =>
  Object.prototype.hasOwnProperty.call(WAXING_SERVICE_EDUCATION, slug);

export const getWaxingServiceEducation = (
  slug: string,
): WaxingServiceEducation | undefined =>
  isWaxingServiceEducationSlug(slug)
    ? WAXING_SERVICE_EDUCATION[slug]
    : undefined;
