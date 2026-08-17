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
        : 'Face Reality at House of Rose includes a $99 consultation, the $899 12-week program, and four staff-arranged peels from $135 to $205.',
      paragraphs: [
        faceReality.whatItIs,
        faceReality.whyTheStructureMatters,
        FACE_REALITY_PROGRAM.provider,
      ],
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
            {
              href: '/about/providers/amber/',
              label: 'Meet Amber Mingione, Licensed Esthetician',
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
            {
              href: '/about/providers/amber/',
              label: 'Meet Amber Mingione, Licensed Esthetician',
            },
          ],
    };
  }

  if (slug === 'glp-1-weight-management') {
    return {
      kicker: WEIGHT_MANAGEMENT_EDUCATION.title,
      heading: 'Semaglutide and tirzepatide work through different receptors.',
      metaDescription: 'House of Rose offers a $25 GLP-1 weight-management consultation with Diana Morrison, RN in Punta Gorda. Compare semaglutide and tirzepatide.',
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
        {
          href: '/about/providers/amber/',
          label: 'Meet Amber Mingione, Licensed Esthetician',
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
          ? 'Dermal fillers address selected areas of lost volume in the lips, cheeks, and folds.'
          : 'Botox and Daxxify address lines related to facial movement.',
        injectable.provider.statement,
      ],
      distinctions: isNeurotoxin
        ? [
            ...(injectable.consultation
              ? [
                  {
                    label: 'The consultation',
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
              text: 'The 60-minute, $300 consultation covers changes in volume at the lips, cheeks, or folds. The five HA products range from $650 to $850, with appointment lengths from 30 to 45 minutes.',
            },
            ...(injectable.bookingGuidance
              ? [
                  {
                    label: 'The consultation',
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
          ? `The ${injectable.consultation.name} is ${formatMinutes(injectable.consultation.durationMinutes)} and ${formatUsd(injectable.consultation.priceUsd)}. ${injectable.pricingSummary} The ${injectable.followUp.name} takes ${formatMinutes(injectable.followUp.durationMinutes)} and is ${formatUsd(injectable.followUp.priceUsd)}; it is a post-appointment follow-up.`
          : injectable.consultation
            ? `The ${injectable.consultation.name} is ${formatMinutes(injectable.consultation.durationMinutes)} and ${formatUsd(injectable.consultation.priceUsd)}. ${injectable.pricingSummary}`
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
        : 'What the products share, what filler addresses, and the consultation.',
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
        ? 'Compare five current BioRePeel appointments at House of Rose, including direct face options and provider-arranged body, acne-scarring, and gold spot variants.'
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
          ? 'The $250 standalone face treatment and $699 Series of 3 are directly bookable. Call House of Rose to discuss Gold Body, Advanced Acne Scarring, or the Duo Gold Spot Upgrade.'
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
              answer: 'Brandy, Licensed Esthetician, provides the standalone BioRePeel face appointment and Series of 3. Amber Mingione, Licensed Esthetician, provides the Gold Body, Advanced Acne Scarring, and Duo Gold Spot Upgrade appointments and uses BioRePeel as an add-on to eligible advanced skin services.',
            },
            {
              question: 'Which BioRePeel appointments require a call?',
              answer: 'Call House of Rose to discuss BioRePeel Gold — Body, BioRePeel Advanced — Acne Scarring, or the BioRePeel Duo — Gold Spot Upgrade. The standalone face treatment and Series of 3 are directly bookable.',
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
              label: 'Meet Brandy, Licensed Esthetician',
            },
            {
              href: '/about/providers/amber/',
              label: 'Meet Amber Mingione, Licensed Esthetician',
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
      paragraphs: [
        device.whatItIs,
        device.whereItFits,
        ...(device.provider
          ? [`${device.provider.publicName} provides the standalone Glo2Facial at House of Rose.`]
          : []),
      ],
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
        ...(device.provider
          ? [
              {
                question: 'Who provides Glo2Facial at House of Rose?',
                answer: `${device.provider.publicName} provides the standalone 60-minute Glo2Facial.`,
              },
            ]
          : []),
      ],
      faqHeading: 'The three steps and what follows.',
      links: device.provider
        ? [
            {
              href: device.provider.profilePath,
              label: `Meet ${device.provider.publicName}`,
            },
          ]
        : undefined,
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
                text: `Single sessions range from $250 to $950 by area. A series of three ranges from $800 to $2,600 by area. The ${formatUsd(consultation.priceUsd)} consultation is its own appointment.`,
              },
            ]
          : []),
      ],
      menu: consultation && singleAndSeriesPrices.length > 0
        ? {
            heading: 'Consultation and Lumecca Peak pricing by area',
            intro: `The consultation is ${formatUsd(consultation.priceUsd)}. For each of the eight treatment areas, compare one session with a series of three.`,
            verifiedAt: 'August 6, 2026',
            items: [
              {
                name: consultation.name,
                price: formatUsd(consultation.priceUsd),
                note: 'Consultation appointment',
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
                answer: `The low end is one Spot Treatment at $250. The high end is a series of three for Face, Neck & Chest at $2,600. Single sessions across all eight areas range from $250 to $950; three-session prices range from $800 to $2,600. The consultation is ${formatUsd(consultation.priceUsd)}.`,
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
    const formaPlusAreaPrices = device.menu.formaPlusAreaPrices ?? [];
    const bundle = device.menu.bundle;

    return {
      kicker: device.title,
      heading: 'Facial radiofrequency through surface electrodes.',
      metaDescription: 'Compare six Forma facial-area prices from $600 to $3,000, five Forma Plus body-area prices from $1,500 to $2,000, and the $2,599 Forma + Lumecca bundle.',
      paragraphs: [
        device.whatItIs,
        device.whereItFits,
        'For body areas, House of Rose offers Forma Plus for the abdomen, arms, inner-outer thighs, lower back, and knees.',
      ],
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
                label: 'Face, body, or bundle',
                text: `Forma facial-area prices run from $600 to $3,000. Forma Plus body-area prices run from $1,500 to $2,000. The Forma + Lumecca Bundle is ${formatUsd(bundle.priceUsd)}.`,
              },
            ]
          : []),
      ],
      menu: areaPrices.length > 0
        ? {
            heading: 'Forma and Forma Plus pricing by area',
            intro: bundle
              ? `Forma has six facial-area prices from $600 to $3,000. Forma Plus has five body-area prices from $1,500 to $2,000. ${bundle.name} is ${formatUsd(bundle.priceUsd)}.`
              : 'The price follows the facial or body area being treated.',
            verifiedAt: 'August 6, 2026',
            items: [
              ...areaPrices.map((item) => ({
                name: item.name,
                price: formatUsd(item.priceUsd),
              })),
              ...formaPlusAreaPrices.map((item) => ({
                name: `Forma Plus — ${item.name}`,
                price: formatUsd(item.priceUsd),
              })),
              ...(bundle
                ? [
                    {
                      name: bundle.name,
                      price: formatUsd(bundle.priceUsd),
                      note: 'Bundle price',
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
                question: 'Why do Forma and Forma Plus prices range from $600 to $3,000?',
                answer: 'Forma facial areas are face, neck, face and neck, eyes, jawline, and nasolabial folds, with prices from $600 to $3,000. Forma Plus body areas are abdomen, arms, inner-outer thighs, lower back, and knees, with prices from $1,500 to $2,000.',
              },
              {
                question: `Is the ${formatUsd(bundle.priceUsd)} Forma + Lumecca Bundle part of the area-price range?`,
                answer: `No. The $600–$3,000 range belongs to the Forma and Forma Plus area prices. ${bundle.name} has its own ${formatUsd(bundle.priceUsd)} price.`,
              },
            ]
          : []),
      ],
      faqHeading: 'Technology, facial and body areas, and the bundle.',
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
        : 'Current prices are listed below by option and area. Call House of Rose to confirm the appointment length.',
    ],
    distinctions: [
      {
        label: isBodyMorpheus ? 'The technology' : 'What RF Microneedling means here',
        text: isBodyMorpheus
          ? 'Morpheus8 Body uses the same InMode platform as Morpheus8 RF Microneedling: microneedles and fractional bipolar radiofrequency are combined in one device. The distinction here is the body-area focus.'
          : 'The Morpheus8 handpiece pairs microneedling with fractional bipolar radiofrequency in the same device.',
      },
      {
        label: isBodyMorpheus ? 'How the area is priced' : 'Compared with Procell Microneedling',
        text: isBodyMorpheus
          ? 'The Small Area package covers 4 × 10 inches; the Large Area package covers 8 × 11 inches. Each price is for a series of three.'
          : device.comparisonToProcell ?? 'Morpheus8 combines microneedling with fractional bipolar radiofrequency in one InMode device.',
      },
    ],
    menu: {
      heading: isBodyMorpheus
        ? 'Morpheus8 Burst Deep area packages'
        : 'Morpheus8 pricing by option and area',
      intro: isBodyMorpheus
        ? 'Small Area is 4 × 10 inches; Large Area is 8 × 11 inches. Both prices cover a series of three.'
        : 'Burst, Resurfacing, and Prime are each priced by area for one treatment or a series of three. Hyperhidrosis is a package of three; the Morpheus8 + Lumecca option is a two-treatment bundle.',
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
            question: 'How is the Morpheus8 menu organized?',
            answer: 'Burst, Resurfacing, and Prime list one-treatment and three-treatment prices by area. Hyperhidrosis is a package of three, and the Morpheus8 + Lumecca Bundle covers two total treatments. The menu above lists each current price.',
          },
        ],
    faqHeading: isBodyMorpheus
      ? 'How the platform and body-area pricing relate.'
      : 'The technology, body-area relationship, and menu.',
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
          {
            href: '/blog/is-morpheus8-safe/',
            label: 'Morpheus8 safety questions and FDA sources',
          },
        ],
  };
};
