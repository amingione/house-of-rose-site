import { getDeviceServiceEducation } from '@/lib/deviceServiceEducation';
import { getInjectableServiceEducation } from '@/lib/injectableServiceEducation';
import { getSkinRenewalServiceEducation } from '@/lib/skinRenewalServiceEducation';
import { getWaxingServiceEducation } from '@/lib/waxingServiceEducation';
import { PERMANENT_JEWELRY_EDUCATION } from '@/lib/permanentJewelryEducation';
import { IV_HYDRATION_EDUCATION } from '@/lib/ivHydrationFacts';
import { DERMAPLANING_EDUCATION } from '@/lib/dermaplaningEducation';
import { WEIGHT_MANAGEMENT_EDUCATION } from '@/lib/weightManagementEducation';
import {
  formatMorpheus8Price,
  MORPHEUS8_PRICING,
} from '@/lib/morpheus8Pricing';
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
  `$${amountUsd.toLocaleString('en-US')}${qualifier ? ` ${qualifier}` : ''}`;

const formatMinutes = (durationMinutes: number): string =>
  `${durationMinutes} minutes`;

export const getServiceEducation = (slug: string): ServiceEducationContent | undefined => {
  const faceReality = getFaceRealityServiceEducation(slug);

  if (faceReality) {
    return {
      kicker: faceReality.title,
      heading: faceReality.heading,
      metaDescription: faceReality.slug === 'acne-bootcamp'
        ? 'Acne Bootcamp at House of Rose: a $99 consultation or the $899 Face Reality 12-week program with in-studio visits and home care.'
        : 'Face Reality options at House of Rose include a $99 consultation and the $899 12-week program with in-studio visits and home care.',
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
              label: 'Consultation and program overview',
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
      heading: 'Semaglutide, tirzepatide, and the consultation that begins the conversation.',
      metaDescription: 'Understand the GLP-1 and GIP receptor distinction, the $25 consultation, and who provides weight-management appointments at House of Rose Aesthetics in Punta Gorda.',
      paragraphs: [
        WEIGHT_MANAGEMENT_EDUCATION.whatItIs,
        WEIGHT_MANAGEMENT_EDUCATION.provider,
      ],
      distinctions: [
        {
          label: 'What GLP-1 means',
          text: WEIGHT_MANAGEMENT_EDUCATION.plainLanguageDefinition,
        },
        {
          label: 'How the two medications differ',
          text: WEIGHT_MANAGEMENT_EDUCATION.medicationDifference,
        },
        {
          label: 'What the $25 covers',
          text: WEIGHT_MANAGEMENT_EDUCATION.consultationRole,
        },
        {
          label: 'Medication and ongoing costs',
          text: WEIGHT_MANAGEMENT_EDUCATION.pricing,
        },
      ],
      menu: {
        heading: WEIGHT_MANAGEMENT_EDUCATION.consultation.name,
        intro: 'The 40-minute consultation with Diana Morrison, RN is $25. Call House of Rose for medication and ongoing program pricing.',
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
      faqHeading: 'The two medications, the $25 consultation, and who you meet.',
      links: [
        {
          href: '/about/providers/diana/',
          label: 'Meet Diana Morrison, RN',
        },
      ],
    };
  }

  if (slug === 'dermaplaning') {
    return {
      kicker: DERMAPLANING_EDUCATION.title,
      heading: 'Surface exfoliation and peach-fuzz removal in one service.',
      metaDescription: 'Dermaplaning at House of Rose removes fine facial hair and surface buildup. Compare the $135 standalone service and $45 add-on.',
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
        intro: 'The standalone facial is $135 for 50 minutes; the add-on is $45 for 25 minutes.',
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
          label: 'Facial Waxing by area',
        },
      ],
    };
  }

  if (slug === 'iv-hydration-therapy') {
    return {
      kicker: 'IV Hydration Therapy',
      heading: IV_HYDRATION_EDUCATION.heading,
      metaDescription: 'Compare six IV hydration options by appointment length and price, and meet the RN who provides them at House of Rose Aesthetics in Punta Gorda.',
      paragraphs: [
        IV_HYDRATION_EDUCATION.introduction,
        IV_HYDRATION_EDUCATION.provider,
      ],
      distinctions: [
        {
          label: 'The 30-minute option',
          text: IV_HYDRATION_EDUCATION.shorterOption,
        },
        {
          label: 'The five 45-minute options',
          text: IV_HYDRATION_EDUCATION.longerOptions,
        },
        {
          label: 'Formulations and add-ons',
          text: IV_HYDRATION_EDUCATION.formulation,
        },
      ],
      links: [
        {
          href: '/about/providers/diana/',
          label: 'Meet Diana Morrison, RN',
        },
      ],
    };
  }

  if (slug === 'permanent-jewelry') {
    return {
      kicker: PERMANENT_JEWELRY_EDUCATION.title,
      heading: 'A fitted chain without a traditional clasp.',
      metaDescription: 'Permanent jewelry at House of Rose is a fitted, clasp-free chain appointment in Punta Gorda. The 20-minute fitting is $65.',
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
        heading: 'The fitting appointment',
        intro: 'The fitting is $65 and takes 20 minutes. If the chain material or charm matters to you, call before booking to ask what is available.',
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
        ? 'Eleven area-specific waxing appointments, with two ways to book.'
        : waxing.slug === 'facial-waxing'
          ? 'Chin, upper lip, and two brow appointments.'
          : 'Seven body areas, each with its own appointment.',
      metaDescription: waxing.slug === 'waxing'
        ? 'Compare 11 facial and body waxing appointments at House of Rose in Punta Gorda, including current areas, prices, timing, and booking paths.'
        : waxing.slug === 'facial-waxing'
          ? 'Facial waxing at House of Rose includes chin, upper lip, and two brow appointments, with prices from $10 to $25.'
          : 'Body waxing at House of Rose includes seven area-specific appointments, with current prices from $20 to $65.',
      paragraphs: [
        waxing.whatItIs,
        waxing.whereItFits,
        ...(waxing.provider
          ? [`${waxing.provider.publicName} provides facial waxing at House of Rose.`]
          : []),
      ],
      distinctions: waxing.distinctions,
      menu: waxing.menu
        ? {
            heading: waxing.menu.heading,
            intro: waxing.slug === 'waxing'
              ? 'Facial prices range from $10–$25; body prices range from $20–$65. Each row includes the appointment length.'
              : waxing.slug === 'facial-waxing'
                ? 'Each appointment is booked by facial area or brow service.'
                : 'Prices range from $20–$65. Appointment lengths range from 10–40 minutes by area.',
            verifiedAt: 'August 6, 2026',
            items: waxing.menu.items.map((item) => ({
              name: item.name,
              price: formatUsd(item.priceUsd),
              duration: formatMinutes(item.durationMinutes),
              note: waxing.slug === 'waxing' ? item.category : undefined,
            })),
          }
        : undefined,
      faqs: waxing.faqs,
      faqHeading: waxing.slug === 'waxing'
        ? 'Online booking for facial waxing; a phone call for body waxing.'
        : waxing.faqs
          ? 'Area names, leg appointments, and bikini line.'
          : undefined,
      links: [
        ...(waxing.links ?? []),
        ...(waxing.provider
          ? [{ href: waxing.provider.profilePath, label: `Meet ${waxing.provider.publicName}` }]
          : []),
      ],
    };
  }

  const injectable = getInjectableServiceEducation(slug);

  if (injectable) {
    const isNeurotoxin = injectable.slug === 'injectables';

    return {
      kicker: injectable.title,
      heading: isNeurotoxin
        ? 'Botox and Daxxify for movement-related lines.'
        : 'Five hyaluronic-acid fillers for lips, cheeks, and folds.',
      metaDescription: isNeurotoxin
        ? 'Botox and Daxxify at House of Rose are $14 per product-specific unit. A 20-minute Neuromodulator Consultation is $50.'
        : 'Compare five hyaluronic-acid fillers from $650 to $850 at House of Rose, plus the $300 Dermal Filler Consultation.',
      paragraphs: [
        injectable.whatItIs,
        injectable.whereItFits,
        isNeurotoxin
          ? 'Dermal fillers address a different question: selected areas of lost volume in the lips, cheeks, and folds.'
          : 'Botox and Daxxify address a different question: lines related to facial movement.',
        injectable.provider.statement,
      ],
      distinctions: isNeurotoxin
        ? [
            ...(injectable.consultation
              ? [
                  {
                    label: 'Where to begin',
                    text: `The ${injectable.consultation.name} is ${formatMinutes(injectable.consultation.durationMinutes)} and ${formatUsd(injectable.consultation.priceUsd)}. Treatment is priced separately by the number of product-specific units administered.`,
                  },
                ]
              : []),
            {
              label: 'Expression is the clue',
              text: 'A movement-related line becomes visible or deepens when you frown, raise your brows, or squint.',
            },
            {
              label: 'Per-unit pricing',
              text: 'Botox and Daxxify are each $14 per unit, not one flat appointment price. The appointment total depends on the number of units administered, and the two products’ units cannot be compared or converted.',
            },
          ]
        : [
            {
              label: 'What the products share',
              text: 'Juvéderm Ultra XC, Juvéderm Voluma XC, RHA 1, RHA 2, and RHA 3 are all hyaluronic-acid fillers.',
            },
            {
              label: 'Selected facial areas',
              text: 'House of Rose names lips, cheeks, and folds on this service. Each of the five HA products has its own price and appointment length below.',
            },
            ...(injectable.bookingGuidance
              ? [
                  {
                    label: 'How to begin',
                    text: injectable.bookingGuidance,
                  },
                ]
              : []),
          ],
      menu: {
        heading: isNeurotoxin
          ? 'Consultation, Botox, Daxxify, and follow-up'
          : injectable.consultation
            ? 'Consultation and dermal filler products'
            : 'Dermal filler products',
        intro: isNeurotoxin && injectable.consultation && injectable.followUp
          ? `Begin with the ${formatMinutes(injectable.consultation.durationMinutes)}, ${formatUsd(injectable.consultation.priceUsd)} ${injectable.consultation.name}. ${injectable.pricingSummary} The ${injectable.followUp.name} takes ${formatMinutes(injectable.followUp.durationMinutes)} and is ${formatUsd(injectable.followUp.priceUsd)}; it is a post-appointment follow-up.`
          : injectable.consultation
            ? `Begin with the ${formatMinutes(injectable.consultation.durationMinutes)}, ${formatUsd(injectable.consultation.priceUsd)} ${injectable.consultation.name}. ${injectable.pricingSummary}`
          : injectable.pricingSummary,
        verifiedAt: 'August 6, 2026',
        items: [
          ...(injectable.consultation
            ? [
                {
                  name: injectable.consultation.name,
                  price: formatUsd(injectable.consultation.priceUsd),
                  duration: formatMinutes(injectable.consultation.durationMinutes),
                },
              ]
            : []),
          ...injectable.products.map((product) => ({
            name: product.name,
            price: formatUsd(product.price.amountUsd, product.price.qualifier),
            duration: formatMinutes(product.durationMinutes),
          })),
          ...(isNeurotoxin && injectable.followUp
            ? [
                {
                  name: injectable.followUp.name,
                  price: formatUsd(injectable.followUp.priceUsd),
                  duration: formatMinutes(injectable.followUp.durationMinutes),
                  note: injectable.followUp.note,
                },
              ]
            : []),
        ],
      },
      faqs: injectable.faqs,
      faqHeading: isNeurotoxin
        ? 'Price, product units, and the detail that helps when you ask.'
        : 'What the products share, what filler addresses, and how to begin.',
      links: injectable.links,
    };
  }

  const device = getDeviceServiceEducation(slug);

  const skinRenewal = getSkinRenewalServiceEducation(slug);

  if (skinRenewal) {
    const heading = skinRenewal.slug === 'biorepeel'
      ? 'A topical chemical peel for visible texture and uneven tone.'
      : skinRenewal.slug === 'microneedling'
        ? 'One Procell device, with Pro, MD, and topical PRF options.'
        : skinRenewal.slug === 'prf-injections'
          ? 'Two injectable PRF appointments, provided by Diana Morrison, RN.'
          : 'PRF begins with a small sample of your own blood.';

    return {
      kicker: skinRenewal.title,
      heading,
      metaDescription: skinRenewal.slug === 'biorepeel'
        ? 'BioRePeel at House of Rose: book the $250 standalone peel or the $699 Series of 3 in Punta Gorda.'
        : skinRenewal.slug === 'microneedling'
          ? 'Procell Microneedling at House of Rose includes Pro, MD, and topical PRF appointments, with current prices and timing.'
          : skinRenewal.slug === 'prf-injections'
            ? 'PRF Under-Eye and PRF Bio-Filler are injectable consultations provided by Diana Morrison, RN at House of Rose.'
            : 'Compare topical PRF with Microneedling and injectable PRF appointments at House of Rose in Punta Gorda.',
      paragraphs: [
        skinRenewal.whatItIs,
        skinRenewal.whereItFits,
        ...(skinRenewal.providerStatement ? [skinRenewal.providerStatement] : []),
      ],
      distinctions: skinRenewal.distinctions,
      menu: {
        heading: skinRenewal.slug === 'biorepeel'
          ? 'BioRePeel appointments'
          : skinRenewal.slug === 'microneedling'
            ? 'Microneedling options'
            : skinRenewal.slug === 'prf-injections'
              ? 'PRF Under-Eye and PRF Bio-Filler'
              : 'PRF appointments',
        intro: skinRenewal.slug === 'biorepeel'
          ? 'Book the standalone 45-minute appointment for $250 or the 50-minute Series of 3 for $699.'
          : skinRenewal.slug === 'prf' || skinRenewal.slug === 'prf-injections'
            ? skinRenewal.slug === 'prf'
              ? 'PRF Microneedling is $595 for 60 minutes; PRF Under-Eye is $495 with timing confirmed by phone; PRF Bio-Filler is $899 for 45 minutes.'
              : 'PRF Under-Eye is $495 with timing confirmed by phone; PRF Bio-Filler is $899 for 45 minutes.'
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
              answer: 'No. Brandy, Licensed Esthetician provides standalone BioRePeel as a topical face peel. Microneedling is booked with Amber Mingione, Licensed Esthetician and uses the Procell device.',
            },
            {
              question: 'Who provides standalone BioRePeel at House of Rose?',
              answer: 'Brandy, Licensed Esthetician, provides standalone BioRePeel. Amber Mingione, Licensed Esthetician, uses BioRePeel only as an add-on to an eligible advanced skin service.',
            },
          ]
        : skinRenewal.faqs,
      faqHeading: skinRenewal.slug === 'biorepeel'
        ? 'The peel and its booking options.'
        : skinRenewal.slug === 'microneedling'
          ? 'Procell Pro, Procell MD, and topical PRF.'
          : skinRenewal.slug === 'prf'
            ? 'What PRF is, and how House of Rose uses it.'
            : skinRenewal.slug === 'prf-injections'
              ? 'The two appointments and where topical PRF fits.'
            : undefined,
      links: skinRenewal.slug === 'biorepeel'
        ? [
            {
              href: '/about/providers/brandy/',
              label: 'Meet Brandy',
            },
            {
              href: '/services/microneedling/',
              label: 'Compare the Microneedling service',
            },
          ]
        : skinRenewal.links,
    };
  }

  if (!device) return undefined;

  if (device.slug === 'glo2facial') {
    return {
      kicker: device.title,
      heading: 'What happens during the three-step facial.',
      metaDescription: 'Glo2Facial at House of Rose combines an OxyPod surface pass, topical infusion, and facial massage in a 60-minute, $225 appointment.',
      paragraphs: [device.whatItIs, device.whereItFits],
      distinctions: [
        {
          label: 'Surface exfoliation',
          text: device.exfoliation ?? 'The exfoliation step works at the surface of the skin.',
        },
        {
          label: 'Topical infusion and massage',
          text: device.infusionAndFinish ?? 'The appointment includes topical infusion and facial massage.',
        },
        {
          label: 'Oxygenation at the surface',
          text: device.oxygenation ?? 'The oxygenation step takes place at the skin’s surface.',
        },
      ],
      menu: {
        heading: 'Standalone Glo2Facial',
        intro: 'The 60-minute Glo2Facial is directly bookable at $225.',
        verifiedAt: 'August 14, 2026',
        items: [
          {
            name: 'Glo2Facial',
            price: device.menu.priceUsd ? formatUsd(device.menu.priceUsd) : undefined,
            duration: device.menu.duration,
          },
        ],
      },
      faqs: [
        {
          question: 'How is Glo2Facial different from Dermaplaning?',
          answer: device.comparisonToDermaplaning ?? 'Glo2Facial uses an OxyPod and Primer Gel for its surface pass; Dermaplaning uses a specialized blade to remove fine vellus hair and accumulated dead skin cells.',
        },
        {
          question: 'Is oxygen blown onto the skin during Glo2Facial?',
          answer: 'No. Geneo describes the OxyPod and Primer Gel reacting on the skin’s surface to create a carbon-dioxide-rich bubbly environment that triggers the oxygenation step. The oxygenation does not come from an external stream of oxygen.',
        },
        {
          question: 'Does Glo2Facial have downtime?',
          answer: device.recovery ?? 'Ask House of Rose what to expect after the appointment.',
        },
      ],
      faqHeading: 'The three steps and what follows.',
    };
  }

  if (device.slug === 'lumecca-peak-ipl') {
    const areaList = device.currentAreas?.join(', ') ?? '';
    const consultation = device.menu.consultation;
    const treatmentPriceRange = device.menu.treatmentPriceRange;
    const singleAndSeriesPrices = device.menu.singleAndSeriesPrices ?? [];

    return {
      kicker: device.title,
      heading: 'Filtered light for visible pigment and uneven tone.',
      metaDescription: 'Lumecca Peak IPL at House of Rose uses filtered optical energy. Compare the $50 consultation and exact single- or three-session prices across eight areas.',
      paragraphs: [
        device.whatItIs,
        `${device.whereItFits} House of Rose books it for ${areaList}.`,
      ],
      distinctions: [
        {
          label: 'How the light is delivered',
          text: 'Lumecca Peak delivers filtered optical energy from a xenon flash lamp. InMode and the FDA identify the applicator as IPL.',
        },
        {
          label: 'Where House of Rose offers it',
          text: `Appointments are organized by treatment area: ${areaList}.`,
        },
        ...(treatmentPriceRange && consultation
          ? [
              {
                label: 'How treatment pricing is organized',
                text: `Separate treatment listings range from $${treatmentPriceRange.minimumUsd.toLocaleString('en-US')} to $${treatmentPriceRange.maximumUsd.toLocaleString('en-US')}, based on ${treatmentPriceRange.basis}. The ${formatUsd(consultation.priceUsd)} consultation is priced separately.`,
              },
            ]
          : []),
      ],
      menu: consultation && singleAndSeriesPrices.length > 0
        ? {
            heading: 'Consultation and Lumecca Peak pricing by area',
            intro: `The ${formatUsd(consultation.priceUsd)} consultation is priced separately. Each of the eight treatment areas has a single-session price and a three-session price.`,
            verifiedAt: 'August 6, 2026',
            items: [
              {
                name: consultation.name,
                price: formatUsd(consultation.priceUsd),
                note: 'Starting consultation',
              },
              ...singleAndSeriesPrices.map((item) => ({
                name: item.name,
                price: `${formatUsd(item.singlePriceUsd)} single · ${formatUsd(item.seriesOfThreePriceUsd)} series of 3`,
              })),
            ],
          }
        : consultation
          ? {
              heading: 'Lumecca Peak consultation',
              intro: treatmentPriceRange
                ? `The ${formatUsd(consultation.priceUsd)} consultation is the starting appointment. Separate treatment listings range from $${treatmentPriceRange.minimumUsd.toLocaleString('en-US')} to $${treatmentPriceRange.maximumUsd.toLocaleString('en-US')}, based on ${treatmentPriceRange.basis}.`
                : `The ${formatUsd(consultation.priceUsd)} consultation is the starting appointment. Treatment pricing is separate and depends on the area being discussed.`,
              verifiedAt: 'August 6, 2026',
              items: [
                {
                  name: consultation.name,
                  price: formatUsd(consultation.priceUsd),
                },
              ],
            }
        : undefined,
      faqs: [
        {
          question: 'Is Lumecca Peak a laser?',
          answer: 'Lumecca Peak is an IPL handpiece. A xenon flash lamp delivers filtered optical energy, and InMode and the FDA classify the applicator separately from laser applicators.',
        },
        {
          question: 'Which areas can I ask about for Lumecca Peak at House of Rose?',
          answer: `House of Rose offers Lumecca Peak for ${areaList}. The service is booked by treatment area.`,
        },
        ...(treatmentPriceRange && consultation
          ? [
              {
                question: `What does the $${treatmentPriceRange.minimumUsd.toLocaleString('en-US')}–$${treatmentPriceRange.maximumUsd.toLocaleString('en-US')} Lumecca Peak range mean?`,
                answer: `The range covers eight separate treatment areas, each with a single-session price and a three-session price. The ${formatUsd(consultation.priceUsd)} consultation is priced separately.`,
              },
            ]
          : []),
        {
          question: 'How is Lumecca Peak different from Forma?',
          answer: device.comparisonToForma ?? 'Lumecca Peak delivers filtered optical energy as IPL, while Forma delivers radiofrequency through electrodes at the skin surface.',
        },
      ],
      faqHeading: 'Technology, treatment areas, and the Forma distinction.',
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
    const areaPrices = device.menu.areaPrices ?? [];
    const bundle = device.menu.bundle;

    return {
      kicker: device.title,
      heading: 'Facial radiofrequency through surface electrodes.',
      metaDescription: 'Forma at House of Rose delivers facial radiofrequency through surface electrodes. Compare six area prices from $600 to $3,000 and the separate $2,599 Forma + Lumecca bundle.',
      paragraphs: [device.whatItIs, device.whereItFits],
      distinctions: [
        {
          label: 'At the facial surface',
          text: 'The Forma handpiece delivers radiofrequency through surface electrodes for controlled dermal and subdermal heating.',
        },
        {
          label: 'When microneedling is part of the comparison',
          text: 'Morpheus8 combines microneedling with fractional radiofrequency in one InMode device.',
        },
        {
          label: 'When visible pigment is the question',
          text: 'Lumecca Peak is the InMode IPL handpiece House of Rose lists for visible pigment, uneven tone, and selected texture concerns.',
        },
        ...(bundle
          ? [
              {
                label: 'How Forma pricing is organized',
                text: `Face, neck, face and neck, eyes, jawline, and nasolabial folds each have a separate listed price. The ${formatUsd(bundle.priceUsd)} Forma + Lumecca option is a separate bundle listing.`,
              },
            ]
          : []),
      ],
      menu: areaPrices.length > 0
        ? {
            heading: 'Forma pricing by area',
            intro: bundle
              ? `Six area listings range from $600 to $3,000. ${bundle.name} is listed separately at ${formatUsd(bundle.priceUsd)}.`
              : 'Each Forma treatment area has its own listed price.',
            verifiedAt: 'August 6, 2026',
            items: [
              ...areaPrices.map((item) => ({
                name: item.name,
                price: formatUsd(item.priceUsd),
              })),
              ...(bundle
                ? [
                    {
                      name: bundle.name,
                      price: formatUsd(bundle.priceUsd),
                      note: 'Separate bundle listing',
                    },
                  ]
                : []),
            ],
          }
        : undefined,
      faqs: [
        {
          question: 'Does Forma use needles?',
          answer: device.needleDistinction ?? 'Forma delivers radiofrequency through electrodes at the skin surface and does not use microneedles.',
        },
        {
          question: 'How do Forma, Morpheus8, and Lumecca Peak differ?',
          answer: 'Forma delivers radiofrequency through surface electrodes. Morpheus8 combines microneedling with fractional radiofrequency. Lumecca Peak delivers filtered optical energy as IPL.',
        },
        ...(bundle
          ? [
              {
                question: 'Why do Forma prices range from $600 to $3,000?',
                answer: 'The range covers six separately priced areas: face, neck, face and neck, eyes, jawline, and nasolabial folds. It is not one variable price for the same appointment.',
              },
              {
                question: `Is the ${formatUsd(bundle.priceUsd)} Forma + Lumecca Bundle part of the area-price range?`,
                answer: `No. ${bundle.name} is a separate bundle listing priced at ${formatUsd(bundle.priceUsd)}.`,
              },
            ]
          : []),
      ],
      faqHeading: 'Technology, treatment areas, and the separate bundle.',
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
  const morpheusMenuItems = isBodyMorpheus
    ? MORPHEUS8_PRICING.burstDeep.map((item) => ({
        name: item.name,
        price: formatMorpheus8Price(item.seriesOfThreePriceUsd),
        note: item.note,
      }))
    : [
        ...MORPHEUS8_PRICING.burst.map((item) => ({
          name: item.name,
          price: `${formatMorpheus8Price(item.singlePriceUsd)} single · ${formatMorpheus8Price(item.seriesOfThreePriceUsd)} series of 3`,
        })),
        ...MORPHEUS8_PRICING.resurfacing.map((item) => ({
          name: item.name,
          price: `${formatMorpheus8Price(item.singlePriceUsd)} single · ${formatMorpheus8Price(item.seriesOfThreePriceUsd)} series of 3`,
        })),
        ...MORPHEUS8_PRICING.prime.map((item) => ({
          name: item.name,
          price: `${formatMorpheus8Price(item.singlePriceUsd)} single · ${formatMorpheus8Price(item.seriesOfThreePriceUsd)} series of 3`,
        })),
        ...MORPHEUS8_PRICING.burstPackageRanges.map((item) => ({
          name: item.name,
          price: `${formatMorpheus8Price(item.minimumPriceUsd)}–${formatMorpheus8Price(item.maximumPriceUsd)}`,
          note: `Package of ${item.treatmentCount}`,
        })),
        {
          name: MORPHEUS8_PRICING.bundle.name,
          price: formatMorpheus8Price(MORPHEUS8_PRICING.bundle.priceUsd),
          note: `${MORPHEUS8_PRICING.bundle.treatmentCount} total treatments`,
        },
      ];

  return {
    kicker: device.title,
    heading: isBodyMorpheus
      ? 'RF microneedling for selected body areas.'
      : 'Microneedling and fractional radiofrequency, together.',
    metaDescription: isBodyMorpheus
      ? 'Morpheus8 Body at House of Rose combines microneedling with fractional radiofrequency for selected body areas, priced as series of three.'
      : 'Morpheus8 at House of Rose combines microneedling with fractional radiofrequency. Compare Burst, Resurfacing, and Prime single or series pricing.',
    paragraphs: [
      device.whatItIs,
      device.whereItFits,
      isBodyMorpheus
        ? 'Morpheus8 Burst Deep body pricing is organized by area size: 4 × 10 inches or 8 × 11 inches. Both are priced as a series of three; call House of Rose to confirm the appointment length.'
        : 'House of Rose publishes single-treatment and series-of-three prices for five Burst areas, two Resurfacing areas, and three Prime eye-and-mouth areas. Hyperhidrosis is listed separately at $2,200–$2,400 for a package of three. The Morpheus8 + Lumecca Bundle is $1,799 for two total treatments. Call the practice to confirm the appointment length.',
    ],
    distinctions: [
      {
        label: isBodyMorpheus ? 'The technology' : 'What RF Microneedling means here',
        text: isBodyMorpheus
          ? 'Morpheus8 Body is the body-focused use of the same InMode RF microneedling platform described on the main Morpheus8 page.'
          : 'The Morpheus8 handpiece pairs microneedling with fractional bipolar radiofrequency in the same device.',
      },
      {
        label: 'How the area is priced',
        text: isBodyMorpheus
          ? 'The Small Area package covers 4 × 10 inches; the Large Area package covers 8 × 11 inches. Each price is for a series of three.'
          : 'Burst lists Full Face, Face & Neck, Scars, Chest, and Stretch Marks. Resurfacing lists Full Face and Face & Neck. Prime lists Eyes & Mouth, Around the Eyes, and Around the Mouth. Each has a single-treatment price and a series-of-three price; Hyperhidrosis has a separate package-of-three price range.',
      },
      ...(!isBodyMorpheus
        ? [
            {
              label: 'The separate Lumecca bundle',
              text: 'The $1,799 Morpheus8 + Lumecca Bundle covers two total treatments. It is listed separately from the standalone Morpheus8 area prices.',
            },
          ]
        : []),
    ],
    menu: {
      heading: isBodyMorpheus
        ? 'Morpheus8 Burst Deep area packages'
        : 'Morpheus8 pricing by option and area',
      intro: isBodyMorpheus
        ? 'Small Area is 4 × 10 inches; Large Area is 8 × 11 inches. Both prices cover a series of three.'
        : 'Burst has five area listings, Resurfacing has two, and Prime has three. Each has a single-treatment and series-of-three price. Hyperhidrosis and the Morpheus8 + Lumecca Bundle are separate package listings.',
      verifiedAt: MORPHEUS8_PRICING.verifiedAt,
      items: morpheusMenuItems,
    },
    faqs: isBodyMorpheus
      ? [
          {
            question: 'What does Morpheus8 Body share with Morpheus8?',
            answer: 'Both use the InMode platform that combines microneedling with fractional bipolar radiofrequency. Morpheus8 Body focuses on selected body areas.',
          },
          {
            question: 'How are Morpheus8 Body areas priced?',
            answer: 'The Morpheus8 Burst Deep small-area package is $3,500 for three treatments, and the large-area package is $4,500 for three treatments. Call House of Rose to confirm the appointment length.',
          },
        ]
      : [
          {
            question: 'What distinguishes Morpheus8 from Procell Microneedling?',
            answer: device.comparisonToProcell ?? 'Morpheus8 combines microneedling with fractional bipolar radiofrequency in one InMode device.',
          },
          {
            question: 'How does Morpheus8 Body relate to Morpheus8?',
            answer: 'Morpheus8 Body uses the same InMode platform and focuses on selected body areas. Morpheus8 also covers the face, neck, and chest.',
          },
          {
            question: 'What are the Morpheus8 Burst single-treatment prices?',
            answer: 'The current Morpheus8 Burst single-treatment prices are $1,200 for Full Face, $1,250 for Face & Neck, $500 for Scars, $500 for Chest, and $700 for Stretch Marks.',
          },
          {
            question: 'How is Morpheus8 Resurfacing priced?',
            answer: 'Morpheus8 Resurfacing is $750 for one Full Face treatment or $2,000 for three; Face & Neck is $950 for one or $2,700 for three.',
          },
          {
            question: 'How is Morpheus8 Prime priced?',
            answer: 'Morpheus8 Prime Eyes & Mouth is $1,000 for one treatment or $2,200 for three. Around the Eyes and Around the Mouth are each $450 for one treatment or $1,200 for three.',
          },
          {
            question: 'How is the Morpheus8 Burst Hyperhidrosis package priced?',
            answer: 'The current Hyperhidrosis listing is $2,200–$2,400 for a package of three. Call House of Rose to confirm the appointment length.',
          },
          {
            question: 'What does the $1,799 Morpheus8 + Lumecca Bundle include?',
            answer: 'The current bundle listing covers two total treatments. It is separate from the standalone Morpheus8 area prices.',
          },
        ],
    faqHeading: isBodyMorpheus
      ? 'How the platform and body-area pricing relate.'
      : 'How the technology, treatment areas, and pricing fit together.',
    links: isBodyMorpheus
      ? [
          {
            href: '/services/morpheus8/',
            label: 'See Morpheus8 for face, neck, and chest',
          },
          {
            href: '/compare/morpheus8-vs-microneedling/',
            label: 'Compare Morpheus8 and microneedling',
          },
        ]
      : [
          {
            href: '/services/morpheus8-body/',
            label: 'See Morpheus8 Body area pricing',
          },
          {
            href: '/compare/morpheus8-vs-microneedling/',
            label: 'Compare Morpheus8 and Procell Microneedling',
          },
        ],
  };
};
