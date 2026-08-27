import { getHeroBanner } from './heroBanners';

export type InModeLandingSlug =
  | 'inmode'
  | 'morpheus8'
  | 'lumecca-peak-ipl'
  | 'forma-rf-facial';

export type InModeTheme = 'platform' | 'remodel' | 'complexion' | 'maintain';

export interface InModeImage {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly credit?: string;
  readonly context?: string;
}

export interface InModeLink {
  readonly href: string;
  readonly label: string;
}

export interface InModeFaq {
  readonly question: string;
  readonly answer: string;
}

export interface InModePathway {
  readonly title: string;
  readonly role: string;
  readonly summary: string;
  readonly concerns: readonly string[];
  readonly href: string;
  readonly cta: string;
  readonly image: InModeImage;
  readonly featured?: boolean;
}

export interface InModeDecision {
  readonly concern: string;
  readonly treatment: string;
  readonly href: string;
  readonly note: string;
}

export interface InModeCombination {
  readonly title: string;
  readonly shorthand: string;
  readonly text: string;
  readonly links: readonly InModeLink[];
}

export interface InModeComparisonColumn {
  readonly title: string;
  readonly subtitle: string;
  readonly points: readonly string[];
  readonly href?: string;
}

export interface InModePageContent {
  readonly slug: InModeLandingSlug;
  readonly theme: InModeTheme;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly dek: string;
  readonly heroImage: InModeImage;
  readonly heroNote?: string;
  readonly primaryCta: InModeLink;
  readonly secondaryCta?: InModeLink;
  readonly quickFacts?: readonly { readonly label: string; readonly value: string }[];
  readonly pathways?: readonly InModePathway[];
  readonly decisions?: readonly InModeDecision[];
  readonly opening?: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly points?: readonly { readonly title: string; readonly text: string }[];
    readonly deviceImage?: InModeImage;
  };
  readonly concerns?: readonly string[];
  readonly comparison?: {
    readonly eyebrow: string;
    readonly title: string;
    readonly intro: string;
    readonly columns: readonly InModeComparisonColumn[];
  };
  readonly results?: {
    readonly eyebrow: string;
    readonly title: string;
    readonly intro: string;
    readonly images: readonly InModeImage[];
    readonly disclaimer: string;
  };
  readonly timeline?: {
    readonly eyebrow: string;
    readonly title: string;
    readonly intro: string;
    readonly steps: readonly { readonly label: string; readonly title: string; readonly text: string }[];
  };
  readonly experience?: {
    readonly eyebrow: string;
    readonly title: string;
    readonly intro: string;
    readonly items: readonly { readonly question: string; readonly answer: string }[];
  };
  readonly approach?: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly points: readonly string[];
  };
  readonly formaPlus?: {
    readonly title: string;
    readonly forma: string;
    readonly plus: string;
  };
  readonly combinations: readonly InModeCombination[];
  readonly faqs: readonly InModeFaq[];
  readonly sourceLinks: readonly InModeLink[];
}

const consultation: InModeLink = {
  href: '/consultation/',
  label: 'Book a consultation',
};

// TODO(Amber/clinical): add numeric House of Rose appointment lengths, the
// exact Morpheus8 anesthetic protocol, and modality-specific product-return
// timing only after the current clinical protocol is owner-verified. Until
// then, the public experience copy deliberately avoids practice-specific
// numbers that are not established in the repository.

const morpheusResult: InModeImage = {
  src: '/images/optimized/morpheus8-before-after.webp',
  alt: 'Manufacturer-provided Morpheus8 facial before and after showing the lower face after four treatments',
  width: 1600,
  height: 691,
  credit: 'Morpheus8 example courtesy of esmé, the medspa; attribution embedded in image',
  context: 'Four-treatment manufacturer example. Not a House of Rose client.',
};

const lumeccaResult: InModeImage = {
  src: '/images/inmode/lumecca-peak-before-after.webp',
  alt: 'Manufacturer-provided Lumecca Peak facial before and after showing visible brown pigmentation',
  width: 670,
  height: 289,
  credit: 'Lumecca example courtesy of K. Spector, LME; attribution embedded in image',
  context: 'Manufacturer example. Not a House of Rose client.',
};

const formaProfileResult: InModeImage = {
  src: '/images/inmode/HO1_Forma_Website.jpg',
  alt: 'Manufacturer-provided Forma facial before and after shown from the side',
  width: 2560,
  height: 1105,
  credit: 'Forma example courtesy of Dr. H. Ohanian; attribution embedded in image',
  context: 'Manufacturer example. Not a House of Rose client.',
};

const formaFrontResult: InModeImage = {
  src: '/images/inmode/HO2_Forma_Website.jpg',
  alt: 'Manufacturer-provided Forma facial before and after shown from the front',
  width: 2560,
  height: 1105,
  credit: 'Forma example courtesy of Dr. H. Ohanian; attribution embedded in image',
  context: 'Manufacturer example. Not a House of Rose client.',
};

const platformPathways: readonly InModePathway[] = [
  {
    title: 'Morpheus8',
    role: 'Structure + texture',
    summary: 'Fractional RF microneedling for a more intensive remodeling plan when texture, eligible acne scarring, crepey skin, or lower-face laxity is the priority.',
    concerns: ['Fine lines', 'Texture', 'Eligible acne scars', 'Lower face + neck'],
    href: '/services/morpheus8/',
    cta: 'Explore Morpheus8',
    image: morpheusResult,
    featured: true,
  },
  {
    title: 'Lumecca Peak IPL',
    role: 'Complexion',
    summary: 'Intense pulsed light for visible brown spots, sun-related discoloration, redness, and superficial vascular concerns.',
    concerns: ['Brown spots', 'Sun damage', 'Redness', 'Uneven tone'],
    href: '/services/lumecca-peak-ipl/',
    cta: 'Explore Lumecca Peak',
    image: lumeccaResult,
  },
  {
    title: 'Forma / Forma Plus',
    role: 'Firmness + maintenance',
    summary: 'Non-invasive, temperature-controlled bipolar radiofrequency for smoother-looking skin, mild laxity, and an ongoing facial maintenance plan.',
    concerns: ['Mild laxity', 'Firmness', 'Smoothness', 'Non-invasive treatment'],
    href: '/services/forma-rf-facial/',
    cta: 'Explore Forma',
    image: formaProfileResult,
  },
];

const platformCombinations: readonly InModeCombination[] = [
  {
    title: 'Morpheus8 + Lumecca Peak',
    shorthand: 'Structure + complexion',
    text: 'Morpheus8 addresses fractional remodeling and texture. Lumecca Peak addresses visible pigment, photodamage, and vascular discoloration. The value is in assigning each concern to the technology built for it.',
    links: [
      { href: '/services/morpheus8/', label: 'Morpheus8' },
      { href: '/services/lumecca-peak-ipl/', label: 'Lumecca Peak' },
    ],
  },
  {
    title: 'Morpheus8 + Forma',
    shorthand: 'Remodel + maintain',
    text: 'A more intensive fractional RF plan can be followed, when appropriate, by non-invasive Forma sessions focused on ongoing skin quality and firmness.',
    links: [
      { href: '/services/morpheus8/', label: 'Morpheus8' },
      { href: '/services/forma-rf-facial/', label: 'Forma' },
    ],
  },
  {
    title: 'Lumecca Peak + Forma',
    shorthand: 'Tone + firmness',
    text: 'This pairing separates visible discoloration from early firmness concerns: IPL handles light-responsive color while Forma supplies surface-delivered RF without needles.',
    links: [
      { href: '/services/lumecca-peak-ipl/', label: 'Lumecca Peak' },
      { href: '/services/forma-rf-facial/', label: 'Forma' },
    ],
  },
  {
    title: 'Full InMode skin plan',
    shorthand: 'Sequence, do not stack indiscriminately',
    text: 'When texture, pigment, redness, collagen loss, and laxity overlap, consultation is used to prioritize and sequence treatment. More technology in one appointment is not automatically a better plan.',
    links: [consultation],
  },
];

export const INMODE_LANDING_CONTENT = {
  inmode: {
    slug: 'inmode',
    theme: 'platform',
    metaTitle: 'InMode OptimasMAX Treatments | House of Rose Aesthetics',
    metaDescription: 'Compare Morpheus8, Lumecca Peak IPL, and Forma treatments at House of Rose Aesthetics in Punta Gorda, Florida.',
    eyebrow: 'Advanced InMode treatments · Punta Gorda',
    title: 'One platform. Three different jobs for your skin.',
    dek: 'House of Rose uses the InMode OptimasMAX platform for three distinct facial treatment paths: Morpheus8 for fractional remodeling, Lumecca Peak IPL for visible color, and Forma for non-invasive radiofrequency.',
    heroImage: getHeroBanner('/services/inmode/'),
    heroNote: 'Face, lower face, jawline, and neck are the focus of this treatment collection.',
    primaryCta: consultation,
    secondaryCta: { href: '#compare', label: 'Compare the three' },
    quickFacts: [
      { label: 'Morpheus8', value: 'Fractional RF microneedling' },
      { label: 'Lumecca Peak', value: 'Intense pulsed light' },
      { label: 'Forma', value: 'Non-invasive bipolar RF' },
    ],
    pathways: platformPathways,
    decisions: [
      { concern: 'Brown spots, sun damage, or visible redness', treatment: 'Lumecca Peak IPL', href: '/services/lumecca-peak-ipl/', note: 'A light-based complexion path.' },
      { concern: 'Fine lines, rough texture, or eligible acne scars', treatment: 'Morpheus8', href: '/services/morpheus8/', note: 'A fractional RF microneedling path.' },
      { concern: 'Mild laxity, maintenance, or no recovery window', treatment: 'Forma', href: '/services/forma-rf-facial/', note: 'A non-invasive RF path.' },
      { concern: 'Several concerns at once', treatment: 'Combination plan', href: '#combinations', note: 'Sequence the right modalities after consultation.' },
    ],
    combinations: platformCombinations,
    faqs: [
      { question: 'What InMode treatments does House of Rose offer?', answer: 'House of Rose offers Morpheus8 RF Microneedling, Lumecca Peak IPL, and Forma / Forma Plus through the InMode OptimasMAX platform.' },
      { question: 'Which InMode treatment is best for brown spots or redness?', answer: 'Lumecca Peak IPL is the light-based option used when visible pigmentation, sun-related discoloration, redness, or superficial vascular concerns are the priority. A consultation is still needed because IPL is not appropriate for every skin condition or recent sun-exposure history.' },
      { question: 'Which InMode treatment is best for texture or acne scarring?', answer: 'Morpheus8 is the more intensive fractional RF microneedling option for texture, eligible acne scarring, fine lines, and selected laxity concerns. Suitability, depth, and settings are determined after an in-person assessment.' },
      { question: 'What should I expect after an InMode treatment?', answer: 'Post-treatment expectations depend on the modality. Forma is non-invasive; Lumecca Peak can cause temporary warmth, redness, or darkening of pigment; and Morpheus8 requires a planned recovery window. Individual responses vary, and the team reviews current aftercare guidance before treatment.' },
      { question: 'Can Morpheus8, Lumecca Peak, and Forma be combined?', answer: 'They can be sequenced in a combination plan when each modality answers a separate concern. Consultation determines order and spacing; the three treatments should not be assumed to belong in one appointment.' },
    ],
    sourceLinks: [
      { href: 'https://www.inmodemd.com/workstation/optimas-max/', label: 'InMode OptimasMAX technology overview' },
    ],
  },
  morpheus8: {
    slug: 'morpheus8',
    theme: 'remodel',
    metaTitle: 'Morpheus8 RF Microneedling | House of Rose Aesthetics',
    metaDescription: 'Morpheus8 RF microneedling in Punta Gorda for texture, fine lines, eligible acne scars, lower-face laxity, and neck skin quality.',
    eyebrow: 'Morpheus8 RF Microneedling · Punta Gorda',
    title: 'Remodel texture. Rebuild the plan beneath it.',
    dek: 'Morpheus8 combines controlled microneedling with fractional bipolar radiofrequency at selected depths. It is the most intensive of the three House of Rose InMode skin treatments.',
    heroImage: {
      src: '/images/optimized/actual-morpheus8-room-1400-light.webp',
      alt: 'The Morpheus8 treatment room inside House of Rose Aesthetics in Punta Gorda',
      width: 1400,
      height: 1050,
    },
    heroNote: 'Consultation-led · Face, lower face, jawline, and neck focus',
    primaryCta: { href: '/consultation/', label: 'Book a Morpheus8 consultation' },
    secondaryCta: { href: '#results', label: 'See results' },
    quickFacts: [
      { label: 'Technology', value: 'Fractional bipolar RF + microneedles' },
      { label: 'Best fit', value: 'Texture + more intensive remodeling' },
      { label: 'Recovery', value: 'Plan for visible redness and swelling' },
    ],
    opening: {
      eyebrow: 'What Morpheus8 actually does',
      title: 'Mechanical depth and controlled heat, delivered together.',
      paragraphs: [
        'The Morpheus8 handpiece places an array of microneedles into the planned area. Bipolar radiofrequency is then delivered through those electrodes at selected depths, creating small zones of controlled thermal treatment below the surface.',
        'That combination matters. The microneedles establish where treatment occurs; radiofrequency adds a thermal remodeling component. Depth, energy, passes, and treatment area are not interchangeable settings, which is why anatomy and skin assessment shape the plan.',
        'The response is progressive. Early swelling can temporarily change how the skin looks, but remodeling develops over the weeks and months that follow rather than appearing as one immediate final result.',
      ],
      points: [
        { title: 'Fractional', text: 'Treatment is delivered in controlled zones with untreated tissue between them.' },
        { title: 'Selectable depth', text: 'The treatment plan can account for thinner, bony, and softer facial areas instead of using one depth everywhere.' },
        { title: 'Bipolar RF', text: 'Radiofrequency energy produces a controlled thermal effect at the selected treatment depth.' },
      ],
      deviceImage: {
        src: '/images/inmode/morpheus8-burst-device.webp',
        alt: 'Morpheus8 Burst fractional radiofrequency microneedling handpiece',
        width: 628,
        height: 1000,
        credit: 'Image courtesy of InMode',
      },
    },
    concerns: ['Fine lines and wrinkles', 'Rough or uneven texture', 'Eligible acne scarring', 'Enlarged-looking pores', 'Crepey skin', 'Lower-face laxity', 'Jawline skin quality', 'Neck aging', 'Progressive collagen loss'],
    comparison: {
      eyebrow: 'Morpheus8 vs. traditional microneedling',
      title: 'The needles are only half of the distinction.',
      intro: 'Both create controlled micro-injury. Morpheus8 adds depth-selectable radiofrequency, so it belongs in a different treatment conversation than a more superficial microneedling plan.',
      columns: [
        { title: 'Traditional microneedling', subtitle: 'Mechanical micro-injury', points: ['Primarily mechanical collagen induction', 'Typically a more superficial treatment strategy', 'No radiofrequency energy delivered through the needles'], href: '/services/microneedling/' },
        { title: 'Morpheus8', subtitle: 'Fractional RF microneedling', points: ['Microneedles plus bipolar radiofrequency', 'Selectable treatment depths', 'Thermal remodeling component', 'Settings tailored to anatomy and concern'] },
      ],
    },
    results: {
      eyebrow: 'Facial result example',
      title: 'Look closely at the lower face, not just the lighting.',
      intro: 'This manufacturer-provided four-treatment example shows the lower face and jawline. Individual results vary.',
      images: [morpheusResult],
      disclaimer: 'Individual results vary. Treatment count, settings, skin response, lighting, angle, and timing affect visible change.',
    },
    timeline: {
      eyebrow: 'Results and recovery timeline',
      title: 'A treatment day, a recovery window, then gradual change.',
      intro: 'Published RF microneedling literature reports that pain, redness, bruising, and swelling commonly settle over roughly two to five days, but depth and energy change the experience. Your House of Rose instructions take priority for your treatment.',
      steps: [
        { label: 'Treatment day', title: 'Controlled treatment + immediate response', text: 'Redness, warmth, pinpoint bleeding, tenderness, and swelling can occur. The treated area may look more affected before it looks improved.' },
        { label: 'Days 1–5', title: 'Visible recovery', text: 'Redness and swelling typically recede during this period. Makeup and active skincare timing depend on closure of the microchannels and the instructions provided after treatment.' },
        { label: 'Following weeks', title: 'Early texture changes', text: 'As the immediate response settles, early changes can become easier to assess. This is not the final remodeling point.' },
        { label: 'Following months', title: 'Progressive remodeling', text: 'Collagen-related change develops gradually. Follow-up is used to compare the response with baseline and decide whether another session belongs in the plan.' },
        { label: 'Maintenance', title: 'Only when the result and goal support it', text: 'Maintenance is not one universal calendar. Timing depends on the original concern, treatment response, and the pace of future change.' },
      ],
    },
    experience: {
      eyebrow: 'The treatment experience',
      title: 'The questions worth answering before treatment day.',
      intro: 'Appointment length, anesthetic approach, and recovery instructions depend on the area and treatment settings. House of Rose confirms those details as part of the plan rather than posting one protocol for every face.',
      items: [
        { question: 'How long does it take?', answer: 'The treatment area, planned settings, and time allowed for comfort measures determine appointment length. Your consultation confirms the time reserved for your plan.' },
        { question: 'What does it feel like?', answer: 'RF microneedling can feel sharp, hot, and pressure-like. The sensation varies by anatomy, depth, energy, and individual tolerance.' },
        { question: 'Is numbing used?', answer: 'Topical anesthetic is commonly used in RF microneedling. The exact comfort plan is confirmed for the selected settings and your health history.' },
        { question: 'What will I look like afterward?', answer: 'Expect visible redness and some swelling. Pinpoint marks, dryness, roughness, or light crusting can occur as the microchannels close.' },
        { question: 'When can I wear makeup or restart skincare?', answer: 'Published guidance ties makeup and topical-product return to closure of the microchannels, often within one to three days. Follow the specific instructions House of Rose gives you; do not restart active products on your own timeline.' },
        { question: 'How many sessions might I need?', answer: 'House of Rose has single-session and series options, but the recommendation depends on the concern, area, settings, and response. A series is not automatic for every client.' },
      ],
    },
    approach: {
      eyebrow: 'Why Morpheus8 at House of Rose',
      title: 'The device is standardized. The plan should not be.',
      paragraphs: [
        'Morpheus8 is an operator-dependent medical procedure. The useful distinction is not simply owning the platform; it is assessing anatomy, choosing an appropriate depth and energy strategy, documenting baseline skin, and planning recovery before the first pulse.',
        'House of Rose uses consultation to decide whether Morpheus8 is appropriate, whether a less intensive option makes more sense, and whether pigment or redness calls for a different modality. The goal is measured, natural-looking improvement without treating every concern as a reason to increase intensity.',
      ],
      points: ['Anatomy-led treatment mapping', 'Skin and health-history review', 'Depth and settings selected for the area', 'Combination modalities only when they answer a separate concern'],
    },
    combinations: [
      platformCombinations[0],
      platformCombinations[1],
    ],
    faqs: [
      { question: 'What is Morpheus8?', answer: 'Morpheus8 is an InMode fractional radiofrequency device. An array of microneedles enters the planned area and delivers bipolar RF energy at selected depths.' },
      { question: 'Is Morpheus8 RF microneedling?', answer: 'Yes. Morpheus8 combines microneedling with fractional bipolar radiofrequency in the same handpiece.' },
      { question: 'What does Morpheus8 address?', answer: 'House of Rose considers Morpheus8 for the appearance of fine lines, wrinkles, rough texture, enlarged-looking pores, eligible acne scars, crepey skin, and selected lower-face, jawline, and neck laxity concerns.' },
      { question: 'Does Morpheus8 tighten skin?', answer: 'Morpheus8 is used for fractional RF treatment where soft-tissue contraction and remodeling may improve the appearance of selected laxity concerns. The degree of visible change varies, and it does not replace surgery for every client.' },
      { question: 'Is Morpheus8 better than microneedling?', answer: 'Neither is universally better. Traditional microneedling uses mechanical micro-injury without RF. Morpheus8 adds radiofrequency and selectable treatment depths, making it a more intensive option for a different set of goals.' },
      { question: 'How painful is Morpheus8?', answer: 'Sensation varies. Clients may feel sharp pressure and heat, and comfort depends on the area, depth, energy, numbing approach, and individual tolerance.' },
      { question: 'How much downtime does Morpheus8 have?', answer: 'Published RF microneedling literature describes a typical visible recovery period of roughly two to five days, while also noting that recovery varies with treatment area, energy, and depth. House of Rose provides treatment-specific instructions.' },
      { question: 'How many Morpheus8 treatments do I need?', answer: 'There is no single number for every face. House of Rose reviews the area, concern, response, and whether a single session or series belongs in the plan.' },
      { question: 'When will I see Morpheus8 results?', answer: 'Early change may become visible after the initial response settles, while collagen-related remodeling develops over the weeks and months that follow. Individual results and timing vary.' },
      { question: 'Can Morpheus8 help acne scars?', answer: 'Morpheus8 may improve the appearance of eligible facial acne scars by combining controlled microneedling with fractional RF. Scar type, skin type, history, and expectations need to be assessed first.' },
      { question: 'Can Morpheus8 be combined with IPL?', answer: 'Morpheus8 and Lumecca Peak can be sequenced when both texture or laxity and visible pigment or redness belong in the plan. They address different concerns and are not automatically performed together.' },
      { question: 'Can Morpheus8 be combined with Forma?', answer: 'Yes, when appropriate. Morpheus8 provides the more intensive fractional RF step; Forma can play a non-invasive maintenance role after recovery and reassessment.' },
      { question: 'Who should not receive Morpheus8?', answer: 'Not everyone is a candidate. Active infection, impaired healing, pregnancy, certain implanted devices, medication history, bleeding risk, and other skin or health factors may change or rule out treatment. A licensed professional must review candidacy and alternatives in person.' },
    ],
    sourceLinks: [
      { href: 'https://www.inmodemd.com/workstation/optimas-max/', label: 'InMode OptimasMAX and Morpheus8 Burst overview' },
      { href: 'https://www.fda.gov/medical-devices/safety-communications/potential-risks-certain-uses-radiofrequency-rf-microneedling-fda-safety-communication', label: 'FDA RF microneedling safety communication' },
      { href: '/blog/is-morpheus8-safe/', label: 'House of Rose Morpheus8 safety guide' },
    ],
  },
  'lumecca-peak-ipl': {
    slug: 'lumecca-peak-ipl',
    theme: 'complexion',
    metaTitle: 'Lumecca Peak IPL Photofacial | House of Rose Aesthetics',
    metaDescription: 'Lumecca Peak IPL in Punta Gorda for visible sun damage, brown spots, redness, superficial vessels, and uneven facial tone.',
    eyebrow: 'Lumecca Peak IPL · Punta Gorda',
    title: 'Treat the color that changes the whole complexion.',
    dek: 'Lumecca Peak uses intense pulsed light to address visible brown pigment, photodamage, redness, and superficial vascular discoloration. No needles, and a completely different job from Morpheus8 or Forma.',
    heroImage: getHeroBanner('/services/lumecca-peak-ipl/'),
    heroNote: 'Complexion-focused · Face and neck treatment planning',
    primaryCta: { href: '/consultation/', label: 'Book an IPL consultation' },
    secondaryCta: { href: '#results', label: 'See complexion results' },
    quickFacts: [
      { label: 'Technology', value: 'Intense pulsed light' },
      { label: 'Best fit', value: 'Pigment + visible redness' },
      { label: 'Plan around', value: 'Sun exposure + skin assessment' },
    ],
    opening: {
      eyebrow: 'What IPL is doing',
      title: 'Light is absorbed by visible pigment and vascular targets.',
      paragraphs: [
        'IPL is not a laser. It sends filtered, broad-spectrum pulses of light into the skin. Selected wavelengths are absorbed by visible pigment and blood-vessel targets, converting light to heat within those targets.',
        'Lumecca Peak is InMode’s higher-output IPL handpiece on OptimasMAX, with a custom xenon flash lamp and sapphire cooling tip. Its value is not simply “more power”; it is the ability to select settings after reviewing skin tone, the type of discoloration, the treatment area, and recent sun exposure.',
        'Brown pigment can temporarily darken after treatment before it flakes or fades. Vascular redness can blanch or change color before settling. Those visible transitions are part of why timing, sun protection, and aftercare matter.',
      ],
      points: [
        { title: 'Brown pigment', text: 'Sun-related spots and uneven pigmentation absorb selected light energy.' },
        { title: 'Visible redness', text: 'Superficial vascular targets respond through a different light-absorption pathway.' },
        { title: 'Cooling + control', text: 'The sapphire tip and selected pulse settings support a controlled light treatment.' },
      ],
      deviceImage: {
        src: '/images/inmode/lumecca-peak-device.webp',
        alt: 'Lumecca Peak intense pulsed light handpiece with sapphire cooling tip',
        width: 628,
        height: 1000,
        credit: 'Image courtesy of InMode',
      },
    },
    concerns: ['Sun-related brown spots', 'Visible photodamage', 'Uneven pigmentation', 'Blotchy tone', 'Facial redness', 'Superficial vascular discoloration', 'Freckles when appropriate', 'Overall complexion clarity'],
    results: {
      eyebrow: 'Complexion result example',
      title: 'Pigment is easier to evaluate at full scale.',
      intro: 'This manufacturer example shows visible facial discoloration before and after Lumecca. It is not a House of Rose client or a guarantee of the response your skin will have.',
      images: [lumeccaResult],
      disclaimer: 'Individual results vary. Pigment type, vascular pattern, skin tone, sun history, settings, and treatment count affect visible change.',
    },
    timeline: {
      eyebrow: 'What happens after IPL',
      title: 'Pigment may look darker before it looks clearer.',
      intro: 'The sequence below reflects InMode patient guidance for Lumecca IPL. Your response can differ, and the instructions given after your House of Rose visit take priority.',
      steps: [
        { label: 'Immediately', title: 'Warmth and temporary redness', text: 'A warm feeling and redness can occur after the light pulses. The sapphire tip is part of the treatment’s cooling system.' },
        { label: '24–48 hours', title: 'Brown spots may darken', text: 'Targeted pigment can become more visible before it begins to shed. Do not scrub or pick at it.' },
        { label: 'Following week', title: 'Pigment begins to flake or fade', text: 'Darkened spots can move toward the surface and shed as the complexion starts to look more even.' },
        { label: 'Around 1–2 weeks', title: 'The visible result is easier to assess', text: 'Manufacturer guidance describes the most visible complexion change in this window after a session, while treatment response and the need for another visit vary.' },
      ],
    },
    experience: {
      eyebrow: 'The treatment experience',
      title: 'Fast pulses, bright flashes, and a sun-aware plan.',
      intro: 'IPL planning begins before treatment day. Recent tanning or heavy sun exposure can change candidacy and raise the risk of an unwanted pigment response.',
      items: [
        { question: 'What does Lumecca Peak feel like?', answer: 'Each pulse creates a bright flash and a brief snapping or warm sensation. Sensation varies by area and settings.' },
        { question: 'What will I look like afterward?', answer: 'Temporary redness and warmth can occur. Brown spots may darken over the next one to two days before they begin to flake or fade.' },
        { question: 'Is there downtime?', answer: 'Many people return to ordinary activities, but visible redness or darkened pigment may be noticeable. Recovery appearance depends on the targets treated and your response.' },
        { question: 'Why does sun exposure matter?', answer: 'IPL energy is absorbed by pigment. Recent tanning or excessive sun exposure changes the amount and distribution of pigment in the skin, which can change treatment safety and settings.' },
        { question: 'How many sessions are needed?', answer: 'House of Rose has single-session and series options. Pigment type, vascular pattern, skin response, and the area determine whether more than one treatment makes sense.' },
        { question: 'Can I wear makeup afterward?', answer: 'Makeup timing depends on the skin response and instructions provided after treatment. Apply nothing over irritated or disrupted skin unless House of Rose has cleared it.' },
      ],
    },
    approach: {
      eyebrow: 'Why consultation matters',
      title: 'Not every brown spot is the same target.',
      paragraphs: [
        'Visible pigment can come from different sources, depths, and histories. Redness can also have more than one cause. IPL should begin with a skin and sun-exposure review, not a promise that every mark will respond the same way.',
        'House of Rose uses the consultation to decide whether the concern is appropriate for Lumecca Peak, how to plan around sun exposure, and whether a texture or firmness concern belongs with Morpheus8 or Forma instead.',
      ],
      points: ['Pigment and vascular pattern reviewed separately', 'Recent sun and tanning history considered', 'Settings selected for skin and target', 'Combination modalities sequenced when appropriate'],
    },
    combinations: [
      platformCombinations[0],
      platformCombinations[2],
    ],
    faqs: [
      { question: 'What is Lumecca Peak IPL?', answer: 'Lumecca Peak is an InMode intense pulsed light handpiece on the OptimasMAX platform. It delivers filtered broad-spectrum light for selected visible pigment, photodamage, redness, and superficial vascular concerns.' },
      { question: 'Is Lumecca Peak a laser?', answer: 'No. IPL uses a range of filtered light wavelengths, while a laser uses a more specific wavelength. Both are energy-based treatments, but they are not the same technology.' },
      { question: 'How is Lumecca Peak different from basic IPL?', answer: 'InMode describes Lumecca Peak as using a shorter pulse duration, higher optical output than its earlier platform configuration, a custom xenon flash lamp, and a large sapphire cooling tip. Settings and candidacy still matter more than a headline specification.' },
      { question: 'What does Lumecca Peak address?', answer: 'House of Rose considers Lumecca Peak for the appearance of sun-related brown spots, photodamage, uneven pigmentation, blotchy tone, redness, and selected superficial vascular discoloration.' },
      { question: 'What happens to brown spots after IPL?', answer: 'Targeted pigment may darken during the first 24 to 48 hours, then begin to flake or fade over the following week. Do not pick or scrub the darkened areas.' },
      { question: 'How much downtime does Lumecca Peak have?', answer: 'Temporary redness, warmth, and visibly darkened pigment can occur. Many people return to ordinary activities, but the treated area may look more noticeable before it looks clearer.' },
      { question: 'When will I see results from Lumecca Peak?', answer: 'InMode patient guidance describes complexion changes beginning within days and becoming more visible around one to two weeks after a session. Individual results and the number of sessions vary.' },
      { question: 'Can Lumecca Peak be used after a tan?', answer: 'Recent tanning or excessive sun exposure can change candidacy and increase risk. Share your sun and tanning history before treatment and follow the sun-avoidance instructions you are given.' },
      { question: 'Can Lumecca Peak be combined with Morpheus8?', answer: 'Yes, when appropriate. Lumecca Peak addresses visible color while Morpheus8 addresses fractional remodeling and texture. Consultation determines sequence and spacing.' },
      { question: 'Can Lumecca Peak be combined with Forma?', answer: 'Yes, when appropriate. Lumecca Peak focuses on pigment and redness; Forma adds non-invasive RF for skin quality and mild firmness concerns.' },
      { question: 'Who is not a candidate for IPL?', answer: 'Candidacy can change with recent sun exposure or tanning, pregnancy, photosensitizing medicines, active skin problems, certain medical histories, and the type of pigment or redness present. These factors require an in-person review.' },
    ],
    sourceLinks: [
      { href: 'https://www.inmodemd.com/workstation/optimas-max/', label: 'InMode OptimasMAX and Lumecca Peak overview' },
      { href: 'https://www.inmodemd.com/archive/lumecca-brochure.pdf', label: 'InMode Lumecca patient guidance' },
    ],
  },
  'forma-rf-facial': {
    slug: 'forma-rf-facial',
    theme: 'maintain',
    metaTitle: 'Forma RF Facial | House of Rose Aesthetics',
    metaDescription: 'Forma radiofrequency facial in Punta Gorda for smoother-looking skin, mild laxity, facial firmness, and non-invasive maintenance.',
    eyebrow: 'Forma / Forma Plus RF · Punta Gorda',
    title: 'Radiofrequency skin maintenance without needles.',
    dek: 'Forma moves across the skin’s surface while bipolar radiofrequency warms selected dermal and subdermal zones. There are no needles, and built-in temperature monitoring guides energy delivery throughout treatment.',
    heroImage: formaProfileResult,
    heroNote: 'Non-invasive · Temperature monitored · Surface RF',
    primaryCta: { href: '/consultation/', label: 'Book a Forma consultation' },
    secondaryCta: { href: '#compare', label: 'Compare Forma and Morpheus8' },
    quickFacts: [
      { label: 'Technology', value: 'Temperature-controlled bipolar RF' },
      { label: 'Best fit', value: 'Mild laxity + ongoing maintenance' },
      { label: 'After treatment', value: 'Individual response varies' },
    ],
    opening: {
      eyebrow: 'How Forma works',
      title: 'The handpiece keeps moving. The temperature does not go unchecked.',
      paragraphs: [
        'Forma’s smooth electrodes deliver bipolar radiofrequency through the skin surface as the handpiece moves across the planned area. The treatment is non-invasive and does not create microneedle channels.',
        'Temperature is the point of control. Built-in thermistors continuously read the skin and automatically adjust RF delivery as the selected endpoint is approached. That feedback loop supports sustained, controlled heating instead of relying on a fixed burst without surface monitoring.',
        'The result is a non-invasive treatment designed for skin quality, smoothness, and mild firmness concerns. It is a distinct strategy, not a weaker version of Morpheus8.',
      ],
      points: [
        { title: 'No needles', text: 'RF travels between electrodes at the skin surface.' },
        { title: 'Continuous feedback', text: 'Built-in temperature monitoring guides energy delivery while the handpiece moves.' },
        { title: 'Ongoing maintenance', text: 'The non-invasive format can fit an ongoing skin-quality plan when appropriate.' },
      ],
      deviceImage: {
        src: '/images/optimized/forma-and-plus.webp',
        alt: 'Forma and Forma Plus bipolar radiofrequency handpieces',
        width: 628,
        height: 1000,
        credit: 'Image courtesy of InMode',
      },
    },
    concerns: ['Mild facial laxity', 'Loss of firmness', 'Early visible aging', 'Smoother-looking skin', 'Facial contour appearance', 'Collagen support', 'Ongoing skin maintenance', 'A non-invasive treatment preference'],
    comparison: {
      eyebrow: 'Forma vs. Morpheus8',
      title: 'Same energy family. Different intensity and delivery.',
      intro: 'Both use radiofrequency, but the resemblance ends there. Forma stays on the surface with smooth electrodes; Morpheus8 delivers fractional RF through microneedles at selected depths.',
      columns: [
        { title: 'Forma', subtitle: 'Non-invasive RF', points: ['No needles', 'Continuous surface-temperature monitoring', 'Surface-delivered RF', 'Maintenance and mild-to-moderate concern strategy'] },
        { title: 'Morpheus8', subtitle: 'Fractional RF microneedling', points: ['Microneedles at selected depths', 'More intensive thermal remodeling', 'Planned recovery window', 'More significant texture or remodeling concerns'], href: '/services/morpheus8/' },
      ],
    },
    results: {
      eyebrow: 'Facial result examples',
      title: 'Subtle change deserves a full-size comparison.',
      intro: 'These manufacturer examples show the lower face and neck. They are not House of Rose client results, and individual results vary.',
      images: [formaFrontResult],
      disclaimer: 'Individual results vary. Treatment plan, skin response, lighting, angle, and timing affect visible change.',
    },
    timeline: {
      eyebrow: 'How Forma fits over time',
      title: 'Immediate warmth. Progressive skin-quality work.',
      intro: 'Forma is non-invasive, but visible change can still be gradual. The number and spacing of sessions should come from the plan, not from a universal package formula.',
      steps: [
        { label: 'During treatment', title: 'Controlled, monitored warmth', text: 'The handpiece moves continuously while the system monitors surface temperature and adjusts RF delivery.' },
        { label: 'Immediately after', title: 'Return to the day', text: 'Temporary warmth or mild pinkness may occur, but Forma does not require a recovery period.' },
        { label: 'Over a planned series', title: 'Assess smoothness and firmness', text: 'Progress is evaluated across consistent photography and the concern that led to treatment.' },
        { label: 'Maintenance', title: 'Continue only when it still serves the goal', text: 'Ongoing timing depends on response, preferences, and whether a more intensive modality would be more appropriate.' },
      ],
    },
    experience: {
      eyebrow: 'The treatment experience',
      title: 'A warm facial treatment, without needles.',
      intro: 'Forma’s appeal is not just convenience. It offers a controlled RF option for someone whose concern and tolerance do not call for fractional microneedling.',
      items: [
        { question: 'What does Forma feel like?', answer: 'Forma feels progressively warm as the handpiece moves across the skin. Temperature feedback helps keep the treatment within the selected range.' },
        { question: 'Does Forma hurt?', answer: 'Forma is non-invasive and does not use needles. Heat tolerance varies, so tell the practitioner if an area feels too hot or uncomfortable.' },
        { question: 'Is there downtime?', answer: 'No. Temporary warmth or mild pinkness can occur, but there is no recovery period required.' },
        { question: 'How long does Forma take?', answer: 'Treatment time depends on the area selected and the plan. House of Rose confirms the appointment length when the facial or neck areas are chosen.' },
        { question: 'How many sessions will I need?', answer: 'There is no one number for everyone. The starting concern, degree of laxity, response, and maintenance goal shape the recommendation.' },
        { question: 'When will I see results?', answer: 'Some people notice a temporary smoother or firmer look after treatment, while collagen-related change is gradual. Individual response and timing vary.' },
      ],
    },
    approach: {
      eyebrow: 'Why Forma at House of Rose',
      title: 'Convenience is useful only when the treatment matches the concern.',
      paragraphs: [
        'A non-invasive option is not the answer to every degree of laxity. House of Rose begins with the amount and location of change you are noticing, then distinguishes a Forma maintenance plan from the more intensive fractional work Morpheus8 can provide.',
        'The same consultation can identify when visible pigment or redness belongs with Lumecca Peak instead. The three technologies are complementary because they do different jobs—not because every client needs all three.',
      ],
      points: ['Concern matched to treatment intensity', 'Face and neck areas planned deliberately', 'Temperature-controlled delivery', 'Clear escalation path to Morpheus8 when appropriate'],
    },
    formaPlus: {
      title: 'Forma and Forma Plus, without the confusion.',
      forma: 'Forma is the smaller applicator used for facial and other compact treatment areas. Here, the treatment areas are the face, jawline, and neck.',
      plus: 'Forma Plus is the larger applicator available on the OptimasMAX platform. Its size changes the surface area it can cover; the treatment information here covers the face, jawline, and neck.',
    },
    combinations: [
      platformCombinations[1],
      platformCombinations[2],
    ],
    faqs: [
      { question: 'What is Forma?', answer: 'Forma is an InMode non-invasive bipolar radiofrequency treatment. Smooth electrodes move across the skin while built-in controls monitor temperature and guide RF delivery.' },
      { question: 'Does Forma use needles?', answer: 'No. Forma delivers RF through electrodes at the skin surface. Morpheus8 is the House of Rose InMode option that delivers fractional RF through microneedles.' },
      { question: 'What does Forma address?', answer: 'House of Rose considers Forma for mild facial laxity, loss of firmness, smoother-looking skin, early visible aging, and ongoing skin-quality maintenance.' },
      { question: 'Does Forma tighten skin?', answer: 'Forma uses controlled dermal and subdermal heating and may improve the appearance of mild skin laxity and firmness. The degree of visible change varies, and Forma does not replace a more intensive procedure for every client.' },
      { question: 'How does Forma temperature control work?', answer: 'Built-in thermistors repeatedly read skin temperature while the handpiece moves. The system adjusts RF delivery as the selected treatment temperature is approached.' },
      { question: 'Does Forma have downtime?', answer: 'No. Temporary warmth or mild pinkness can occur, but Forma does not require a recovery period.' },
      { question: 'What is the difference between Forma and Forma Plus?', answer: 'Forma is the smaller handpiece for compact areas such as the face. Forma Plus has a larger treatment surface. This treatment information covers the face, jawline, and neck.' },
      { question: 'Is Forma the same as Morpheus8?', answer: 'No. Forma is non-invasive RF without needles. Morpheus8 is fractional RF microneedling at selected depths and requires a recovery window.' },
      { question: 'Is Forma weaker than Morpheus8?', answer: 'They solve different levels of concern. Forma is suited to mild laxity, skin quality, and maintenance. Morpheus8 is the more intensive option for fractional remodeling and texture concerns.' },
      { question: 'Can Forma be combined with Lumecca Peak?', answer: 'Yes, when appropriate. Forma addresses skin quality and firmness while Lumecca Peak addresses visible pigment and redness. Consultation determines sequence.' },
      { question: 'Who should not receive Forma?', answer: 'Pregnancy, certain implanted electrical or metal devices, active skin problems, and other health factors may change candidacy. A licensed professional must review history and the planned area.' },
    ],
    sourceLinks: [
      { href: 'https://www.inmodemd.com/workstation/optimas-max/', label: 'InMode OptimasMAX Forma / Plus overview' },
      { href: 'https://doi.org/10.1080/14764172.2016.1262957', label: 'Forma temperature-controlled RF study' },
    ],
  },
} as const satisfies Readonly<Record<InModeLandingSlug, InModePageContent>>;

export const getInModeLandingContent = (slug: string): InModePageContent | undefined =>
  Object.prototype.hasOwnProperty.call(INMODE_LANDING_CONTENT, slug)
    ? INMODE_LANDING_CONTENT[slug as InModeLandingSlug]
    : undefined;
