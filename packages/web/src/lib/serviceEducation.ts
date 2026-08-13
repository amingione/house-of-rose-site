import { getDeviceServiceEducation } from '@/lib/deviceServiceEducation';
import { getInjectableServiceEducation } from '@/lib/injectableServiceEducation';
import { getSkinRenewalServiceEducation } from '@/lib/skinRenewalServiceEducation';
import { getWaxingServiceEducation } from '@/lib/waxingServiceEducation';
import { PERMANENT_JEWELRY_EDUCATION } from '@/lib/permanentJewelryEducation';
import { VERIFIED_IV_MENU } from '@/lib/ivHydrationFacts';
import { DERMAPLANING_EDUCATION } from '@/lib/dermaplaningEducation';
import { WEIGHT_MANAGEMENT_EDUCATION } from '@/lib/weightManagementEducation';
import {
  FACE_REALITY_PROGRAM,
  getFaceRealityServiceEducation,
} from '@/lib/faceRealityEducation';

export interface ServiceEducationItem {
  name: string;
  price?: string;
  duration?: string;
  note?: string;
}

export interface ServiceEducationContent {
  kicker: string;
  heading: string;
  metaDescription: string;
  paragraphs: readonly string[];
  distinctions?: readonly {
    label: string;
    text: string;
  }[];
  menu?: {
    heading: string;
    intro?: string;
    verifiedAt: string;
    items: readonly ServiceEducationItem[];
  };
  faqs?: readonly {
    question: string;
    answer: string;
  }[];
  faqHeading?: string;
  links?: readonly {
    href: string;
    label: string;
  }[];
}

const formatUsd = (amountUsd: number, qualifier?: 'per unit'): string =>
  `$${amountUsd}${qualifier ? ` ${qualifier}` : ''}`;

const formatMinutes = (durationMinutes: number): string =>
  `${durationMinutes} minutes`;

export const getServiceEducation = (slug: string): ServiceEducationContent | undefined => {
  const faceReality = getFaceRealityServiceEducation(slug);

  if (faceReality) {
    return {
      kicker: faceReality.title,
      heading: faceReality.heading,
      metaDescription: `${faceReality.whatItIs} Available at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [faceReality.whatItIs, faceReality.whyTheStructureMatters],
      distinctions: faceReality.distinctions,
      menu: {
        heading: faceReality.menuHeading,
        intro: faceReality.menuIntro,
        verifiedAt: FACE_REALITY_PROGRAM.menuVerifiedAt,
        items: faceReality.menuOrder.map((index) => {
          const item = FACE_REALITY_PROGRAM.menu[index];
          if (!item) throw new Error(`Invalid Face Reality menu index: ${index}`);
          return {
            name: item.name,
            price: formatUsd(item.priceUsd),
            duration: item.duration,
            note: item.note,
          };
        }),
      },
      faqs: faceReality.faqs,
      links: faceReality.slug === 'face-reality-acne-program'
        ? [
            {
              href: '/packages/face-reality-12-week-program/',
              label: 'View the complete 12-week program',
            },
            {
              href: '/concerns/active-acne/',
              label: 'Read the active breakouts guide',
            },
          ]
        : [
            {
              href: '/services/face-reality-acne-program/',
              label: 'Review the Face Reality overview',
            },
            {
              href: '/concerns/active-acne/',
              label: 'Read the active breakouts guide',
            },
          ],
    };
  }

  if (slug === 'glp-1-weight-management') {
    return {
      kicker: WEIGHT_MANAGEMENT_EDUCATION.title,
      heading: 'The current menu lists a consultation, semaglutide, and tirzepatide.',
      metaDescription: 'Review the current GLP-1 weight-management consultation, medication names, and RN provider information at House of Rose Aesthetics in Punta Gorda.',
      paragraphs: [
        WEIGHT_MANAGEMENT_EDUCATION.whatItIs,
        WEIGHT_MANAGEMENT_EDUCATION.provider,
      ],
      distinctions: [
        {
          label: 'Medication names, not prescribing guidance',
          text: WEIGHT_MANAGEMENT_EDUCATION.medicationBoundary,
        },
        {
          label: 'What this page can verify',
          text: WEIGHT_MANAGEMENT_EDUCATION.pricing,
        },
      ],
      menu: {
        heading: WEIGHT_MANAGEMENT_EDUCATION.consultation.name,
        intro: 'The consultation is the only current listing whose price and appointment length are reconciled for public use.',
        verifiedAt: new Date(`${WEIGHT_MANAGEMENT_EDUCATION.consultation.verifiedAt}T00:00:00Z`).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        }),
        items: [
          {
            name: WEIGHT_MANAGEMENT_EDUCATION.consultation.name,
            price: formatUsd(WEIGHT_MANAGEMENT_EDUCATION.consultation.priceUsd),
            duration: formatMinutes(WEIGHT_MANAGEMENT_EDUCATION.consultation.durationMinutes),
          },
        ],
      },
      faqs: WEIGHT_MANAGEMENT_EDUCATION.faqs,
      faqHeading: 'The current offering, provider, and consultation.',
    };
  }

  if (slug === 'dermaplaning') {
    return {
      kicker: DERMAPLANING_EDUCATION.title,
      heading: 'Surface exfoliation and peach-fuzz removal in one service.',
      metaDescription: `${DERMAPLANING_EDUCATION.whatItIs} Review the current standalone and add-on options at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [DERMAPLANING_EDUCATION.whatItIs, DERMAPLANING_EDUCATION.whereItFits],
      distinctions: [
        {
          label: 'What happens together',
          text: 'The specialized blade lifts accumulated dead skin cells and fine vellus hair from the facial surface in the same appointment.',
        },
        {
          label: 'Dermaplaning or facial waxing?',
          text: 'Dermaplaning works across the facial surface for fine vellus hair and surface buildup. House of Rose books facial waxing by area for the brows, upper lip, and chin.',
        },
      ],
      menu: {
        heading: 'Standalone or add-on',
        intro: 'The current menu offers dermaplaning as a standalone facial or a shorter add-on.',
        verifiedAt: 'August 6, 2026',
        items: DERMAPLANING_EDUCATION.menu.map((item) => ({
          name: item.name,
          price: formatUsd(item.priceUsd),
          duration: formatMinutes(item.durationMinutes),
        })),
      },
      faqs: DERMAPLANING_EDUCATION.faqs,
      faqHeading: 'Peach fuzz, regrowth, and facial waxing.',
      links: [
        {
          href: '/services/facial-waxing/',
          label: 'Review facial waxing by area',
        },
      ],
    };
  }

  if (slug === 'iv-hydration-therapy') {
    const prices = VERIFIED_IV_MENU.map(({ price }) => price);
    const durations = [...new Set(VERIFIED_IV_MENU.map(({ durationMinutes }) => durationMinutes))];

    return {
      kicker: 'IV Hydration Therapy',
      heading: 'Six current IV options, listed plainly.',
      metaDescription: 'Review the six current IV hydration options, appointment lengths, prices, and RN provider information at House of Rose Aesthetics in Punta Gorda.',
      paragraphs: [
        `The current House of Rose menu contains six base IV options. Appointment lengths are ${durations.join(' or ')} minutes, with published prices from $${Math.min(...prices)} to $${Math.max(...prices)}.`,
        'Diana Morrison, RN provides IV hydration under written physician protocol and medical direction. Formulations and add-ons are not listed on this page because the current booking export does not verify them.',
      ],
      distinctions: [
        {
          label: 'Current menu facts',
          text: 'Each base option below is shown with its exact current menu name, appointment length, and price.',
        },
        {
          label: 'No inferred ingredients',
          text: 'A service name is not treated as an ingredient list. House of Rose will not publish a formulation that has not been verified against the current menu.',
        },
      ],
    };
  }

  if (slug === 'permanent-jewelry') {
    return {
      kicker: PERMANENT_JEWELRY_EDUCATION.title,
      heading: 'A fitted chain without a traditional clasp.',
      metaDescription: `${PERMANENT_JEWELRY_EDUCATION.whatItIs} Available at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [
        PERMANENT_JEWELRY_EDUCATION.whatItIs,
        PERMANENT_JEWELRY_EDUCATION.appointment,
        `${PERMANENT_JEWELRY_EDUCATION.provider.publicName} provides the fitting as the practice’s ${PERMANENT_JEWELRY_EDUCATION.provider.role}.`,
      ],
      distinctions: [
        {
          label: 'How the chain closes',
          text: PERMANENT_JEWELRY_EDUCATION.fitAndClosure,
        },
        {
          label: 'What “permanent” means',
          text: PERMANENT_JEWELRY_EDUCATION.permanenceAndRemoval,
        },
      ],
      menu: {
        heading: 'Current appointment',
        intro: 'The current menu verifies one appointment at $65 for 20 minutes. It does not list chain materials, charms, or separate add-on prices.',
        verifiedAt: new Date(`${PERMANENT_JEWELRY_EDUCATION.menu.verifiedAt}T00:00:00Z`).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        }),
        items: [
          {
            name: PERMANENT_JEWELRY_EDUCATION.menu.name,
            price: formatUsd(PERMANENT_JEWELRY_EDUCATION.menu.priceUsd),
            duration: formatMinutes(PERMANENT_JEWELRY_EDUCATION.menu.durationMinutes),
          },
        ],
      },
      faqs: PERMANENT_JEWELRY_EDUCATION.faqs,
      faqHeading: 'The clasp-free closure, explained.',
      links: [
        {
          href: PERMANENT_JEWELRY_EDUCATION.provider.profilePath,
          label: `Meet ${PERMANENT_JEWELRY_EDUCATION.provider.publicName}`,
        },
      ],
    };
  }

  const waxing = getWaxingServiceEducation(slug);

  if (waxing) {
    return {
      kicker: waxing.title,
      heading: waxing.slug === 'waxing'
        ? 'Facial and body waxing, organized by area.'
        : waxing.slug === 'facial-waxing'
          ? 'Four facial-waxing appointments, listed by area.'
          : 'Seven body-waxing appointments, listed by area.',
      metaDescription: `${waxing.whatItIs} Available at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [waxing.whatItIs, waxing.whereItFits],
      distinctions: waxing.distinctions,
      menu: waxing.menu
        ? {
            heading: waxing.menu.heading,
            intro: 'Prices and appointment lengths are shown by area.',
            verifiedAt: 'August 6, 2026',
            items: waxing.menu.items.map((item) => ({
              name: item.name,
              price: formatUsd(item.priceUsd),
              duration: formatMinutes(item.durationMinutes),
            })),
          }
        : undefined,
    };
  }

  const injectable = getInjectableServiceEducation(slug);

  if (injectable) {
    const isNeurotoxin = injectable.slug === 'injectables';

    return {
      kicker: injectable.title,
      heading: isNeurotoxin
        ? 'Botox and Daxxify for movement-related lines.'
        : 'Five current fillers for lips, cheeks, and folds.',
      metaDescription: `${injectable.whatItIs} ${injectable.whereItFits} Available at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [
        injectable.whatItIs,
        injectable.whereItFits,
        isNeurotoxin
          ? 'Lost facial volume in selected lip, cheek, and fold areas is covered on the dermal filler page.'
          : 'Botox and Daxxify appear on the neurotoxin page for movement-related lines.',
        injectable.provider.statement,
      ],
      distinctions: isNeurotoxin
        ? [
            {
              label: 'Expression is the clue',
              text: 'A movement-related line becomes visible or deepens when you frown, raise your brows, or squint.',
            },
            {
              label: 'Per-unit pricing',
              text: 'Botox and Daxxify are each listed at $14 per unit. Their product-specific units cannot be compared or converted.',
            },
          ]
        : [
            {
              label: 'What the products share',
              text: 'Juvéderm Ultra XC, Juvéderm Voluma XC, RHA 1, RHA 2, and RHA 3 are all hyaluronic-acid fillers.',
            },
            {
              label: 'Selected facial areas',
              text: 'The current listing names lips, cheeks, and folds. Each of the five HA products has its own price and appointment length below.',
            },
          ],
      menu: {
        heading: isNeurotoxin ? 'Botox and Daxxify' : 'Dermal filler products',
        intro: injectable.pricingSummary,
        verifiedAt: 'August 6, 2026',
        items: injectable.products.map((product) => ({
          name: product.name,
          price: formatUsd(product.price.amountUsd, product.price.qualifier),
          duration: formatMinutes(product.durationMinutes),
        })),
      },
      faqs: injectable.faqs,
      faqHeading: isNeurotoxin
        ? 'Movement-related lines and the two current products.'
        : 'Hyaluronic-acid fillers and movement-related lines.',
      links: injectable.links,
    };
  }

  const device = getDeviceServiceEducation(slug);

  const skinRenewal = getSkinRenewalServiceEducation(slug);

  if (skinRenewal) {
    const heading = skinRenewal.slug === 'biorepeel'
      ? 'A topical chemical peel for visible texture and uneven tone.'
      : skinRenewal.slug === 'microneedling'
        ? 'Procell is the device behind the Microneedling menu.'
        : skinRenewal.slug === 'prf-injections'
          ? 'Two injectable PRF consultations are currently listed.'
          : 'Three current ways PRF appears on the menu.';

    return {
      kicker: skinRenewal.title,
      heading,
      metaDescription: `${skinRenewal.whatItIs} ${skinRenewal.whereItFits} Available at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [skinRenewal.whatItIs, skinRenewal.whereItFits],
      distinctions: skinRenewal.distinctions,
      menu: {
        heading: skinRenewal.slug === 'biorepeel'
          ? 'Standalone BioRePeel'
          : skinRenewal.slug === 'microneedling'
            ? 'Microneedling options'
            : skinRenewal.slug === 'prf-injections'
              ? 'Current injectable PRF listings'
              : 'Current PRF listings',
        intro: skinRenewal.slug === 'biorepeel'
          ? 'The current menu has one standalone BioRePeel face treatment, with its price and appointment length shown below.'
          : skinRenewal.slug === 'prf' || skinRenewal.slug === 'prf-injections'
            ? skinRenewal.slug === 'prf'
              ? 'The current menu shows where PRF is used and how each listing is booked.'
              : 'Under-Eye and Bio-Filler are the two current injectable PRF consultations.'
            : undefined,
        verifiedAt: 'August 6, 2026',
        items: skinRenewal.menu.items.map((item) => ({
          name: item.name,
          price: `$${item.priceUsd}`,
          duration: item.durationMinutes ? `${item.durationMinutes} minutes` : undefined,
          note: item.note,
        })),
      },
      faqs: skinRenewal.slug === 'biorepeel'
        ? [
            {
              question: 'Is BioRePeel a chemical peel?',
              answer: 'Yes. BioRePeelCl3 is a TCA-based chemical peel applied topically to the skin. TCA stands for trichloroacetic acid.',
            },
            {
              question: 'Does the standalone BioRePeel appointment include microneedling?',
              answer: 'No. The current standalone BioRePeel listing is a topical face peel. Microneedling is listed separately and uses the Procell device to create controlled microchannels.',
            },
          ]
        : undefined,
      faqHeading: skinRenewal.slug === 'biorepeel'
        ? 'The peel and the current appointment.'
        : undefined,
      links: skinRenewal.slug === 'biorepeel'
        ? [
            {
              href: '/services/microneedling/',
              label: 'Compare the Microneedling service',
            },
          ]
        : undefined,
    };
  }

  if (!device) return undefined;

  if (device.slug === 'glo2facial') {
    return {
      kicker: device.title,
      heading: 'A facial with three distinct steps.',
      metaDescription: `${device.whatItIs} Available at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [device.whatItIs, device.whereItFits],
      distinctions: [
        {
          label: 'Surface exfoliation',
          text: 'The exfoliation step works at the surface of the skin.',
        },
        {
          label: 'Topical infusion and oxygenation',
          text: `The Geneo service pairs its topical infusion step with an oxygenation step in the same appointment. ${device.oxygenation}`,
        },
      ],
      menu: {
        heading: 'Standalone Glo2Facial',
        intro: 'Glo2Facial is currently listed as a directly bookable, standalone facial.',
        verifiedAt: 'August 13, 2026',
        items: [
          {
            name: 'Glo2Facial',
            duration: device.menu.duration,
          },
        ],
      },
      faqs: [
        {
          question: 'Is oxygen blown onto the skin during Glo2Facial?',
          answer: 'No. Geneo describes the OxyPod and Primer Gel reacting on the skin’s surface to create a carbon-dioxide-rich bubbly environment that triggers the oxygenation step. The oxygenation does not come from an external stream of oxygen.',
        },
      ],
      faqHeading: 'The oxygenation question.',
    };
  }

  if (device.slug === 'lumecca-peak-ipl') {
    const areaList = device.currentAreas?.join(', ') ?? '';

    return {
      kicker: device.title,
      heading: 'Filtered light for visible pigment and uneven tone.',
      metaDescription: `${device.whatItIs} Review the current Lumecca Peak treatment areas at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [
        device.whatItIs,
        `${device.whereItFits} The current area-based menu covers ${areaList}.`,
      ],
      distinctions: [
        {
          label: 'What the handpiece uses',
          text: 'Lumecca Peak delivers filtered optical energy from a xenon flash lamp. InMode and the FDA identify the applicator as IPL.',
        },
        {
          label: 'How House of Rose lists it',
          text: `The current menu is organized by treatment area: ${areaList}.`,
        },
      ],
      faqs: [
        {
          question: 'Is Lumecca Peak a laser?',
          answer: 'No. Lumecca Peak is an IPL handpiece. It uses a xenon flash lamp to deliver filtered optical energy; InMode and the FDA classify its applicators separately from laser applicators.',
        },
        {
          question: 'Which Lumecca Peak treatment areas are currently listed at House of Rose?',
          answer: `The current House of Rose menu lists ${areaList}. The service is booked by treatment area.`,
        },
      ],
      faqHeading: 'Technology and current treatment areas.',
      links: [
        {
          href: '/services/forma-rf-facial/',
          label: 'Review Forma radiofrequency',
        },
        {
          href: '/services/morpheus8/',
          label: 'Review Morpheus8 RF Microneedling',
        },
      ],
    };
  }

  if (device.slug === 'forma-rf-facial') {
    return {
      kicker: device.title,
      heading: 'Radiofrequency without needles.',
      metaDescription: `${device.whatItIs} Review how Forma differs from Morpheus8 and Lumecca Peak at House of Rose Aesthetics in Punta Gorda.`,
      paragraphs: [device.whatItIs, device.whereItFits],
      distinctions: [
        {
          label: 'Forma',
          text: 'Forma is a non-invasive RF applicator. Its electrodes deliver radiofrequency for controlled dermal and subdermal heating.',
        },
        {
          label: 'Morpheus8',
          text: 'Morpheus8 is a fractional RF applicator that combines microneedling with radiofrequency. Forma does not use microneedles.',
        },
        {
          label: 'Lumecca Peak',
          text: 'Lumecca Peak is an IPL handpiece that delivers filtered optical energy. It uses light rather than radiofrequency.',
        },
      ],
      faqs: [
        {
          question: 'How is Forma different from Morpheus8?',
          answer: 'Both use radiofrequency, but they deliver it differently. Forma uses surface electrodes and does not use needles. Morpheus8 combines microneedling with fractional radiofrequency.',
        },
        {
          question: 'How is Forma different from Lumecca Peak?',
          answer: 'Forma delivers radiofrequency energy through surface electrodes. Lumecca Peak is an IPL handpiece that delivers filtered optical energy from a xenon flash lamp.',
        },
      ],
      faqHeading: 'Three InMode tools. Three different technologies.',
      links: [
        {
          href: '/services/morpheus8/',
          label: 'Review Morpheus8',
        },
        {
          href: '/services/lumecca-peak-ipl/',
          label: 'Review Lumecca Peak',
        },
      ],
    };
  }

  const isBodyMorpheus = device.slug === 'morpheus8-body';

  return {
    kicker: device.title,
    heading: isBodyMorpheus
      ? 'The Morpheus8 platform, used for selected body concerns.'
      : 'Microneedling and radiofrequency in one device.',
    metaDescription: `${device.whatItIs} Available by consultation at House of Rose Aesthetics in Punta Gorda.`,
    paragraphs: [
      device.whatItIs,
      device.whereItFits,
      isBodyMorpheus
        ? 'It is a consultation-led service. House of Rose does not publish an unresolved treatment price, duration, or series for Morpheus8 Body.'
        : 'It is a consultation-led service. House of Rose does not publish an unresolved standalone treatment price or appointment length for Morpheus8 RF Microneedling.',
    ],
    distinctions: [
      {
        label: isBodyMorpheus ? 'One platform' : 'What works together',
        text: isBodyMorpheus
          ? 'Morpheus8 Body is the body-focused use of the same InMode RF microneedling platform described on the main Morpheus8 page.'
          : 'The Morpheus8 handpiece pairs microneedling with fractional bipolar radiofrequency in the same device.',
      },
      {
        label: isBodyMorpheus ? 'The body focus' : 'Face and body',
        text: isBodyMorpheus
          ? 'This page is for selected body areas. The main Morpheus8 page also accounts for the face, neck and chest.'
          : 'This page gives the full face-and-body overview. The Morpheus8 Body page narrows the same technology to selected body areas.',
      },
    ],
    faqs: isBodyMorpheus
      ? [
          {
            question: 'Do Morpheus8 and Morpheus8 Body use the same platform?',
            answer: 'Yes. Both House of Rose listings refer to the InMode platform that combines microneedling with fractional bipolar radiofrequency. The Body page focuses on selected body areas.',
          },
          {
            question: 'Is a standalone Morpheus8 Body price or appointment length published?',
            answer: 'No. The current listing is consultation-led, and House of Rose does not publish a reconciled standalone price, appointment length, or series for Morpheus8 Body.',
          },
        ]
      : [
          {
            question: 'What does Morpheus8 combine?',
            answer: 'Morpheus8 combines microneedling with fractional bipolar radiofrequency in one InMode device.',
          },
          {
            question: 'How do the Morpheus8 and Morpheus8 Body pages divide the offering?',
            answer: 'The main Morpheus8 page covers the face, neck and chest, and selected body areas. The Morpheus8 Body page focuses on selected body areas and the visible concerns listed for them.',
          },
        ],
    faqHeading: isBodyMorpheus
      ? 'The shared platform and the body listing.'
      : 'The technology and the two House of Rose listings.',
    links: isBodyMorpheus
      ? [
          {
            href: '/services/morpheus8/',
            label: 'Review the full Morpheus8 overview',
          },
          {
            href: '/compare/morpheus8-vs-microneedling/',
            label: 'Compare Morpheus8 and microneedling',
          },
        ]
      : [
          {
            href: '/services/morpheus8-body/',
            label: 'Review Morpheus8 Body',
          },
          {
            href: '/compare/morpheus8-vs-microneedling/',
            label: 'Compare Morpheus8 and microneedling',
          },
        ],
  };
};
