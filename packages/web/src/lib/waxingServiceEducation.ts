export type WaxingServiceEducationSlug = 'waxing' | 'facial-waxing' | 'body-waxing';

export interface WaxingMenuItem {
  readonly name: string;
  readonly priceUsd: number;
  readonly durationMinutes: number;
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
  readonly menu?: {
    readonly heading: string;
    readonly items: readonly WaxingMenuItem[];
  };
}

const FACIAL_WAXING_ITEMS = [
  { name: 'Chin', priceUsd: 10, durationMinutes: 30 },
  { name: 'Upper Lip', priceUsd: 10, durationMinutes: 10 },
  { name: 'Eyebrows', priceUsd: 15, durationMinutes: 10 },
  { name: 'Eyebrow Shape, Trim & Wax', priceUsd: 25, durationMinutes: 25 },
] as const satisfies readonly WaxingMenuItem[];

const BODY_WAXING_ITEMS = [
  { name: 'Underarms', priceUsd: 20, durationMinutes: 30 },
  { name: 'Bikini Line', priceUsd: 30, durationMinutes: 10 },
  { name: 'Chest', priceUsd: 40, durationMinutes: 40 },
  { name: 'Back', priceUsd: 50, durationMinutes: 40 },
  { name: 'Full Leg', priceUsd: 65, durationMinutes: 10 },
  { name: 'Partial Leg', priceUsd: 45, durationMinutes: 30 },
  { name: 'Full Arm', priceUsd: 45, durationMinutes: 30 },
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
      'House of Rose currently books facial waxing for the eyebrows, upper lip, and chin, and body waxing for the underarms, bikini line, arms, legs, back, and chest.',
    whereItFits:
      'This hub opens the two area menus. Each page shows the exact appointment name, current price, and listed length for that part of the waxing menu.',
    distinctions: [
      {
        label: 'Four facial appointments',
        text: 'The facial menu contains chin, upper lip, eyebrows, and eyebrow shape, trim, and wax.',
      },
      {
        label: 'Seven body appointments',
        text: 'The body menu contains underarms, bikini line, chest, back, full leg, partial leg, and full arm.',
      },
    ],
  },
  'facial-waxing': {
    slug: 'facial-waxing',
    title: 'Facial Waxing',
    whatItIs:
      'The current facial-waxing menu contains four appointments: chin, upper lip, eyebrows, and eyebrow shape, trim, and wax.',
    whereItFits:
      'Each row below carries its current price and listed appointment length. The brow menu includes a standard eyebrow wax and an appointment that also includes shaping and trimming.',
    distinctions: [
      {
        label: 'Two eyebrow appointments',
        text: 'Eyebrows and Eyebrow Shape, Trim & Wax each have their own menu row.',
      },
      {
        label: 'Upper lip and chin',
        text: 'Upper Lip and Chin are listed individually with their current price and appointment length.',
      },
    ],
    menu: {
      heading: 'Facial waxing by area',
      items: FACIAL_WAXING_ITEMS,
    },
  },
  'body-waxing': {
    slug: 'body-waxing',
    title: 'Body Waxing',
    whatItIs:
      'The current body-waxing menu contains seven appointments: underarms, bikini line, chest, back, full leg, partial leg, and full arm.',
    whereItFits:
      'Each row below carries its current price and listed appointment length. No unlisted body-waxing area is implied.',
    distinctions: [
      {
        label: 'Upper body and bikini line',
        text: 'Underarms, bikini line, chest, back, and full arm each have an individual menu row.',
      },
      {
        label: 'Leg appointments',
        text: 'Full Leg and Partial Leg are the two current leg-waxing entries.',
      },
    ],
    menu: {
      heading: 'Body waxing by area',
      items: BODY_WAXING_ITEMS,
    },
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
