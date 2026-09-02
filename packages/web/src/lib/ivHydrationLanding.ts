import { IV_DRIPS, ivDripPath } from '@/lib/ivDripContent';

export interface ServiceQuickFact {
  readonly label: string;
  readonly value: string;
}

export interface EditorialPoint {
  readonly title: string;
  readonly text: string;
}

export interface TreatmentOption {
  readonly name: string;
  readonly duration: string;
  /** One line: what is in the bag. */
  readonly summary: string;
  /** Per-drip page. */
  readonly href: string;
}

export interface TreatmentStep {
  readonly title: string;
  readonly text: string;
}

export interface ServiceFaq {
  readonly question: string;
  readonly answer: string;
}

export interface ServiceTestimonial {
  readonly quote: string;
  readonly attribution: string;
}

export const IV_LANDING_HERO_IMAGE = '/images/optimized/actual-iv-suite-1400.webp';
export const IV_LANDING_HERO_IMAGE_ALT =
  'The IV hydration suite inside House of Rose Aesthetics';

export const IV_LANDING_META_DESCRIPTION =
  'House of Rose Aesthetics offers six IV hydration options in Punta Gorda, Florida, with individual review by Diana Morrison, RN.';

export const IV_LANDING_QUICK_FACTS = [
  { label: 'Treatment', value: 'IV Hydration' },
  { label: 'Location', value: 'Punta Gorda, Florida' },
  { label: 'Provider', value: 'Diana Morrison, RN' },
  { label: 'Visit length', value: '30 or 45 minutes' },
] as const satisfies readonly ServiceQuickFact[];

export const IV_LANDING_POINTS = [
  {
    title: 'A direct route',
    text: 'IV means intravenous: fluid is administered through a vein rather than taken by mouth.',
  },
  {
    title: 'A defined appointment',
    text: 'Hydration IV is the 30-minute option. The other five current appointments are 45 minutes.',
  },
  {
    title: 'Every bag, explained',
    text: 'Each of the six IVs has its own page: what is in it, what it helps with, what the visit is like, and who should talk with the nurse first.',
  },
  {
    title: 'RN-led review',
    text: 'Diana Morrison, RN reviews relevant health information, the current option, and candidacy before treatment.',
  },
  {
    title: 'Six IV options',
    text: 'House of Rose currently offers six base IV visits. Call the practice for current pricing.',
  },
] as const satisfies readonly EditorialPoint[];

export const IV_LANDING_OPTIONS = IV_DRIPS.map((drip) => ({
  name: drip.name,
  duration: `${drip.durationMinutes} minutes`,
  summary: drip.tagline,
  href: ivDripPath(drip.slug),
})) satisfies readonly TreatmentOption[];

export const IV_LANDING_STEPS = [
  {
    title: 'Start with context',
    text: 'Share what you want to discuss and the relevant health information Diana Morrison, RN needs to review.',
  },
  {
    title: 'Review the current option',
    text: 'Diana reviews the current formulation and candidacy under written physician protocol and medical direction.',
  },
  {
    title: 'Placement and infusion',
    text: 'A small catheter is placed into a vein, and the infusion is monitored during the appointment.',
  },
  {
    title: 'Complete the visit',
    text: 'The catheter is removed and the site is dressed before you leave House of Rose.',
  },
] as const satisfies readonly TreatmentStep[];

export const IV_LANDING_FAQS = [
  {
    question: 'What is IV hydration therapy?',
    answer:
      'IV hydration therapy administers fluid intravenously, which means through a vein. House of Rose offers six named base IV appointments in Punta Gorda.',
  },
  {
    question: 'How does IV hydration work?',
    answer:
      'A small catheter is placed into a vein so the selected fluid can be administered intravenously. The infusion is monitored, then the catheter is removed and the site is dressed.',
  },
  {
    question: 'How long does an IV hydration appointment take?',
    answer:
      'Hydration IV is a 30-minute appointment. The other five current House of Rose IV options are 45-minute appointments.',
  },
  {
    question: 'What is in an IV hydration treatment?',
    answer:
      'It depends on the bag. Hydration IV is fluid and electrolytes; Myers’ Cocktail adds vitamin C, B-complex, B12, magnesium, and calcium; Immunity adds vitamin C, zinc, B-complex, and magnesium; Recovery adds amino acids, magnesium, B-complex, and vitamin C; Beauty Glow adds glutathione, vitamin C, and biotin; Reboot pairs fluid and B vitamins with prescription anti-nausea and anti-inflammatory medication under physician protocol. Each drip page lists its ingredients in full, and add-ons can be discussed when you call.',
  },
  {
    question: 'How do I know which IV is right for me?',
    answer:
      'Start with the reason for your visit. Fluid fast: Hydration IV. Generally run-down: Myers’ Cocktail. Seasonal support: Immunity IV. Training or heat: Recovery IV. Skin, hair, and nails: Beauty Glow IV. Hangover: Reboot IV. If you are unsure, Diana Morrison, RN will walk through it with you before anything is booked.',
  },
  {
    question: 'How often can you receive IV hydration?',
    answer:
      'Frequency is individualized. Diana Morrison, RN reviews the selected formulation, relevant health information, and the reason for the visit before discussing timing.',
  },
  {
    question: 'Who may not be a candidate for IV therapy?',
    answer:
      'Not every client is a candidate. Diana Morrison, RN reviews relevant health information and candidacy under written physician protocol.',
  },
  {
    question: 'Is there anything I should do before my appointment?',
    answer:
      'Follow any visit-specific instructions House of Rose provides when your appointment is arranged. Contact the practice before your visit if you have a question about how to prepare.',
  },
  {
    question: 'Can I receive IV hydration if I take medications?',
    answer:
      'Contact House of Rose before the visit so your medication question can be reviewed in context. Do not stop or change a medication without guidance from the clinician who manages it.',
  },
  {
    question: 'Where can I get IV hydration in Punta Gorda?',
    answer:
      'House of Rose Aesthetics offers IV Hydration Therapy at 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950. Call (941) 400-0165 to discuss an appointment.',
  },
] as const satisfies readonly ServiceFaq[];

// No verified review source is wired into the site. The reusable component
// remains available, but an empty set intentionally renders no social proof.
export const IV_LANDING_TESTIMONIALS = [] as const satisfies readonly ServiceTestimonial[];
