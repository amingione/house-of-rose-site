import { getDeviceServiceEducation } from '@/lib/deviceServiceEducation';
import { getInjectableServiceEducation } from '@/lib/injectableServiceEducation';
import { getSkinRenewalServiceEducation } from '@/lib/skinRenewalServiceEducation';
import { DERMAPLANING_EDUCATION } from '@/lib/dermaplaningEducation';
import { WEIGHT_MANAGEMENT_EDUCATION } from '@/lib/weightManagementEducation';
import { MORPHEUS8_PRICING } from '@/lib/morpheus8Pricing';
import {
  getServiceEducationDetails,
  type ServiceEducationPairing,
  type ServiceEducationStep,
} from '@/lib/serviceEducationDetails';

export interface ServiceEducationItem {
  name: string;
  /**
   * Optional structural note (e.g. "Priced per unit", "Single session or
   * series of 3"). Never a dollar amount — House of Rose pricing is never
   * public. See CLAUDE.md "Public website pricing is NEVER permitted."
   */
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
  benefits?: readonly string[];
  treatmentSteps?: readonly ServiceEducationStep[];
  sessionGuidance?: string;
  pairings?: readonly ServiceEducationPairing[];
}

const formatMinutes = (durationMinutes: number): string =>
  `${durationMinutes} minutes`;

const getRawServiceEducation = (slug: string): ServiceEducationContent | undefined => {
  if (slug === 'inmode') {
    return {
      kicker: 'InMode OptimasMAX',
      heading: 'Three treatment paths for different components of skin change.',
      metaDescription: 'Compare Morpheus8, Lumecca Peak IPL, and Forma treatments at House of Rose Aesthetics in Punta Gorda, Florida.',
      paragraphs: [
        'House of Rose uses the InMode OptimasMAX platform for three face-focused treatment paths: Morpheus8 RF Microneedling, Lumecca Peak IPL, and Forma / Forma Plus radiofrequency.',
        'Morpheus8 is the fractional remodeling path, Lumecca Peak addresses visible pigment and redness, and Forma is the non-invasive radiofrequency path for mild firmness concerns and maintenance.',
      ],
      distinctions: [
        { label: 'Structure and texture', text: 'Morpheus8 combines microneedles with fractional bipolar radiofrequency at selected depths.' },
        { label: 'Visible color', text: 'Lumecca Peak uses intense pulsed light for eligible brown pigment, sun-related discoloration, and redness.' },
        { label: 'Firmness and maintenance', text: 'Forma delivers temperature-monitored bipolar radiofrequency through smooth surface electrodes without needles.' },
      ],
      links: [
        { href: '/services/morpheus8/', label: 'Explore Morpheus8' },
        { href: '/services/lumecca-peak-ipl/', label: 'Explore Lumecca Peak' },
        { href: '/services/forma-rf-facial/', label: 'Explore Forma' },
      ],
    };
  }

  if (slug === 'prf-under-eyes') {
    return {
      kicker: 'PRF Under Eyes',
      heading: 'Injectable platelet-rich fibrin for the under-eye area.',
      metaDescription: 'Learn how injectable PRF differs from dermal filler and topical PRF when hollowing or shadowing contributes to an under-eye concern.',
      paragraphs: [
        'PRF Under Eyes uses platelet-rich fibrin prepared from a small sample of the client’s own blood. Diana Morrison, RN injects the prepared PRF according to an individualized under-eye plan under written physician protocol and medical direction.',
        'This is not hyaluronic-acid dermal filler, and it is not the topical PRF used during Microneedling. The material, route, and treatment planning are different.',
      ],
      distinctions: [
        { label: 'Prepared from your blood', text: 'A small blood sample is centrifuged to separate the platelet-rich fibrin used for the service.' },
        { label: 'Injected, not topical', text: 'For PRF Under Eyes, Diana Morrison, RN injects the PRF. Topical PRF Microneedling is a separate service.' },
      ],
      links: [
        { href: '/services/prf/', label: 'Understand topical and injectable PRF' },
        { href: '/services/dermal-fillers/', label: 'Compare with hyaluronic-acid filler' },
      ],
    };
  }

  if (slug === 'prf-injections') {
    return {
      kicker: 'PRF Injections',
      heading: 'Injectable platelet-rich fibrin, prepared from your own blood.',
      metaDescription: 'Learn what injectable platelet-rich fibrin is, how it is prepared, and how it differs from topical PRF Microneedling at House of Rose.',
      paragraphs: [
        'PRF Injections use platelet-rich fibrin prepared by centrifuging a small sample of the client’s own blood. Diana Morrison, RN injects the prepared PRF according to the area and individual plan under written physician protocol and medical direction.',
        'Injectable PRF is a different route from topical PRF Microneedling, where PRF is applied to the skin surface during a Procell treatment.',
      ],
      distinctions: [
        { label: 'Blood draw and processing', text: 'A small blood sample is collected and centrifuged to prepare the platelet-rich fibrin.' },
        { label: 'The route matters', text: 'This service injects PRF. Topical PRF Microneedling applies PRF at the surface and belongs to a separate treatment path.' },
      ],
      links: [
        { href: '/services/prf/', label: 'See the complete PRF overview' },
        { href: '/services/microneedling/', label: 'Understand topical PRF Microneedling' },
      ],
    };
  }

  if (slug === 'injectables-bio-fillers') {
    return {
      kicker: 'Injectables & Bio-Fillers',
      heading: 'Movement, volume, and PRF are different treatment questions.',
      metaDescription: 'Understand neurotoxins, hyaluronic-acid dermal fillers, and injectable PRF at House of Rose Aesthetics in Punta Gorda.',
      paragraphs: [
        'Injectables and bio-fillers are not one interchangeable category. Botox and Daxxify address lines related to facial movement, hyaluronic-acid fillers address selected areas of lost volume, and platelet-rich fibrin begins with a small sample of the client’s own blood.',
        'Diana Morrison, RN reviews the area, anatomy, health history, and goal before determining whether any injectable service is appropriate under written physician protocol and medical direction.',
      ],
      distinctions: [
        { label: 'Movement-related lines', text: 'Botox and Daxxify are neurotoxins used for lines that appear or deepen with facial movement.' },
        { label: 'Selected volume changes', text: 'Hyaluronic-acid fillers are planned for selected areas such as the lips, cheeks, or folds.' },
        { label: 'Platelet-rich fibrin', text: 'Injectable PRF is prepared from a small sample of the client’s own blood and is distinct from topical PRF Microneedling.' },
      ],
      links: [
        { href: '/services/injectables/', label: 'For movement-related lines' },
        { href: '/services/dermal-fillers/', label: 'For selected facial volume' },
        { href: '/services/prf-injections/', label: 'For platelet-rich fibrin' },
      ],
    };
  }
  if (slug === 'face-reality-acne-program' || slug === 'acne-bootcamp') {
    const isProgramOverview = slug === 'face-reality-acne-program';
    return {
      kicker: isProgramOverview ? 'Face Reality Acne Program' : 'Acne Bootcamp',
      heading: 'A twelve-week program connecting in-studio care with daily home care.',
      metaDescription: 'Learn how the Face Reality Acne Program connects in-studio care every two weeks with daily home care across twelve weeks.',
      paragraphs: [
        'Acne Bootcamp is a twelve-week esthetics program for the appearance of recurring breakouts. In-studio care takes place every two weeks, with daily home care between visits.',
        'Amber Mingione, Licensed Esthetician and Face Reality Certified Acne Specialist, provides the program at House of Rose.',
      ],
      distinctions: [
        {
          label: 'In-studio care',
          text: 'Professional exfoliation and extractions are selected for the skin at that point in the program.',
        },
        {
          label: 'Between visits',
          text: 'A daily home-care plan continues between visits and is reviewed as the skin responds.',
        },
        {
          label: 'When medical evaluation comes first',
          text: 'Deep, painful, widespread, or actively scarring breakouts need medical evaluation before an esthetics program is considered.',
        },
      ],
      links: isProgramOverview
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
              label: 'See the complete program overview',
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
      metaDescription: 'House of Rose offers a GLP-1 consultation with Diana Morrison, RN in Punta Gorda. Compare semaglutide and tirzepatide, and ask about current pricing.',
      paragraphs: [
        'GLP-1 weight management is an ongoing medically supervised program that may use semaglutide or tirzepatide for eligible adults. The medications act on appetite-regulating pathways but do not use identical receptors.',
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
          label: 'What the consultation covers',
          text: WEIGHT_MANAGEMENT_EDUCATION.consultationRole,
        },
        {
          label: 'Medication and ongoing costs',
          text: WEIGHT_MANAGEMENT_EDUCATION.pricing,
        },
      ],
      menu: {
        heading: WEIGHT_MANAGEMENT_EDUCATION.consultation.name,
        intro: 'The 40-minute consultation with Diana Morrison, RN has its own listing. Call House of Rose for medication and ongoing program pricing.',
        verifiedAt: new Date(`${WEIGHT_MANAGEMENT_EDUCATION.consultation.verifiedAt}T00:00:00Z`).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: 'UTC',
        }),
        items: [
          {
            name: WEIGHT_MANAGEMENT_EDUCATION.consultation.name,
            duration: formatMinutes(WEIGHT_MANAGEMENT_EDUCATION.consultation.durationMinutes),
          },
        ],
      },
      faqs: WEIGHT_MANAGEMENT_EDUCATION.faqs,
      faqHeading: 'The two medications, the consultation, and who you meet.',
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
      metaDescription: 'Dermaplaning at House of Rose removes fine facial hair and surface buildup. Compare the standalone service and add-on. Ask about current pricing.',
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
        intro: 'The standalone facial is 50 minutes; the add-on is 25 minutes. Ask about current pricing when you book.',
        verifiedAt: 'August 6, 2026',
        items: DERMAPLANING_EDUCATION.menu.map((item) => ({
          name: item.name,
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
      heading: 'IV means intravenous.',
      metaDescription: 'Learn what IV hydration means and who provides it at House of Rose Aesthetics in Punta Gorda.',
      paragraphs: [
        'IV hydration delivers fluid through a vein. The treatment name alone does not identify a complete formulation, so ingredients and available add-ons should be confirmed directly with the practice.',
        'Diana Morrison, RN provides IV hydration under written physician protocol and medical direction.',
      ],
      distinctions: [
        {
          label: 'How it is delivered',
          text: 'IV describes the route: fluid is administered intravenously rather than taken by mouth.',
        },
        {
          label: 'The selected formula',
          text: 'Ask the practice about the current formulation and whether an ingredient is appropriate for the question you have.',
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

  if (slug === 'waxing' || slug === 'facial-waxing' || slug === 'body-waxing') {
    const isFacialWaxing = slug === 'facial-waxing';
    const isBodyWaxing = slug === 'body-waxing';
    return {
      kicker: isFacialWaxing ? 'Facial Waxing' : isBodyWaxing ? 'Body Waxing' : 'Waxing',
      heading: isFacialWaxing
        ? 'Brows, upper lip, and chin.'
        : isBodyWaxing
          ? 'Waxing for selected body areas.'
          : 'Facial and body waxing, organized by area.',
      metaDescription: isFacialWaxing
        ? 'Facial waxing for the brows, upper lip, and chin at House of Rose Aesthetics in Punta Gorda.'
        : isBodyWaxing
          ? 'Body waxing for selected areas at House of Rose Aesthetics in Punta Gorda.'
          : 'Explore facial and body waxing areas available at House of Rose Aesthetics in Punta Gorda.',
      paragraphs: [
        isFacialWaxing
          ? 'Facial waxing is available for the eyebrows, upper lip, and chin. Brow shaping and trimming are also available.'
          : isBodyWaxing
            ? 'Body waxing is available for the underarms, bikini line, chest, back, full or partial leg, and full arm.'
            : 'House of Rose offers facial waxing for the brows, upper lip, and chin, plus body waxing for selected areas of the arms, legs, torso, underarms, and bikini line.',
        ...(isBodyWaxing ? [] : ['Brandy, Licensed Esthetician provides facial waxing at House of Rose.']),
      ],
      links: [
        ...(!isFacialWaxing ? [{ href: '/services/facial-waxing/', label: 'Explore Facial Waxing' }] : []),
        ...(!isBodyWaxing ? [{ href: '/services/body-waxing/', label: 'Explore Body Waxing' }] : []),
        ...(!isBodyWaxing ? [{ href: '/about/providers/brandy/', label: 'Meet Brandy, Licensed Esthetician' }] : []),
      ],
    };
  }

  if (slug === 'bridal-makeup' || slug === 'event-makeup' || slug === 'everyday-makeup') {
    const isBridal = slug === 'bridal-makeup';
    const isEvent = slug === 'event-makeup';
    const title = isBridal ? 'Bridal Makeup' : isEvent ? 'Event Makeup' : 'Everyday Makeup';
    return {
      kicker: title,
      heading: isBridal
        ? 'Makeup planned around the wedding day.'
        : isEvent
          ? 'Makeup for celebrations, events, and photographs.'
          : 'A finished makeup look for everyday wear.',
      metaDescription: `${title} with Aundrea Pedigo, Licensed Esthetician and Makeup Artist, at House of Rose in Punta Gorda.`,
      paragraphs: [
        isBridal
          ? 'Bridal makeup is shaped around the date, the schedule of the day, and the finish you want in person and in photographs.'
          : isEvent
            ? 'Event makeup can be planned for a celebration, photo shoot, or another occasion where the setting and desired finish matter.'
            : 'Everyday makeup can range from a soft daytime look to a more defined finish without being tied to a formal event.',
        'Aundrea Pedigo, Licensed Esthetician and Makeup Artist, provides makeup artistry at House of Rose. Makeup artistry is a non-medical service.',
      ],
      links: [
        { href: '/about/providers/aundrea/', label: 'Meet Aundrea Pedigo, Licensed Esthetician' },
        { href: '/contact/', label: 'Ask about makeup' },
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
        ? 'Botox and Daxxify at House of Rose are priced per product-specific unit, with a separate 20-minute Neuromodulator Consultation. Ask about current pricing.'
        : 'Compare five hyaluronic-acid fillers at House of Rose, plus the Dermal Filler Consultation. Ask about current pricing when you book.',
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
                    text: `The ${injectable.consultation.name} is ${formatMinutes(injectable.consultation.durationMinutes)} and has its own listing. Treatment is priced separately by the number of product-specific units administered.`,
                  },
                ]
              : []),
            {
              label: 'Expression is the clue',
              text: 'A movement-related line becomes visible or deepens when you frown, raise your brows, or squint.',
            },
            {
              label: 'Per-unit pricing',
              text: 'Botox and Daxxify are each priced per unit, not as one flat appointment price. The appointment total depends on the number of units administered, and the two products’ units cannot be compared or converted.',
            },
          ]
        : [
            {
              label: 'What the products share',
              text: 'Juvéderm Ultra XC, Juvéderm Voluma XC, RHA 1, RHA 2, and RHA 3 are all hyaluronic-acid fillers.',
            },
            {
              label: 'Selected facial areas',
              text: 'The 60-minute consultation covers changes in volume at the lips, cheeks, or folds. The five HA products have appointment lengths from 30 to 45 minutes, each priced separately.',
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
          ? `The ${injectable.consultation.name} is ${formatMinutes(injectable.consultation.durationMinutes)}. ${injectable.pricingSummary} The ${injectable.followUp.name} takes ${formatMinutes(injectable.followUp.durationMinutes)}; it is a post-appointment follow-up. Ask about current pricing when you book.`
          : injectable.consultation
            ? `The ${injectable.consultation.name} is ${formatMinutes(injectable.consultation.durationMinutes)}. ${injectable.pricingSummary} Ask about current pricing when you book.`
          : `${injectable.pricingSummary} Ask about current pricing when you book.`,
        verifiedAt: 'August 6, 2026',
        items: [
          ...(injectable.consultation
            ? [
                {
                  name: injectable.consultation.name,
                  duration: formatMinutes(injectable.consultation.durationMinutes),
                },
              ]
            : []),
          ...injectable.products.map((product) => ({
            name: product.name,
            duration: formatMinutes(product.durationMinutes),
            note: product.price.qualifier === 'per unit' ? 'Priced per unit' : undefined,
          })),
          ...(isNeurotoxin && injectable.followUp
            ? [
                {
                  name: injectable.followUp.name,
                  duration: formatMinutes(injectable.followUp.durationMinutes),
                  note: injectable.followUp.note,
                },
              ]
            : []),
        ],
      },
      faqs: injectable.faqs,
      faqHeading: isNeurotoxin
        ? 'Product units and the detail that helps when you ask.'
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
        ? 'Compare five current BioRePeel appointments at House of Rose, including direct face options and provider-arranged body variants. Ask about current pricing.'
        : skinRenewal.slug === 'microneedling'
          ? 'Procell Microneedling at House of Rose includes Pro, MD, and topical PRF appointments. Ask about current pricing when you book.'
          : skinRenewal.slug === 'prf-injections'
            ? 'PRF Under-Eye and PRF Bio-Filler are injectable consultations provided by Diana Morrison, RN at House of Rose. Ask about current pricing when you book.'
            : 'Compare topical PRF with Microneedling and injectable PRF appointments at House of Rose in Punta Gorda. Ask about current pricing.',
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
          ? 'The standalone face treatment and Series of 3 are directly bookable. Call House of Rose to discuss Gold Body, Advanced Acne Scarring, or the Duo Gold Spot Upgrade. Ask about current pricing when you book.'
          : skinRenewal.slug === 'prf' || skinRenewal.slug === 'prf-injections'
            ? skinRenewal.slug === 'prf'
              ? 'PRF Microneedling is a 60-minute listing; PRF Under-Eye has timing confirmed by phone; PRF Bio-Filler is 45 minutes. Ask about current pricing when you book.'
              : 'PRF Under-Eye has timing confirmed by phone; PRF Bio-Filler is 45 minutes. Ask about current pricing when you book.'
            : undefined,
        verifiedAt: 'August 6, 2026',
        items: skinRenewal.menu.items.map((item) => ({
          name: item.name,
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
      metaDescription: 'Glo2Facial at House of Rose combines an OxyPod surface pass, topical infusion, and facial massage in a 60-minute appointment. Ask about pricing.',
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
        intro: 'The 60-minute Glo2Facial is directly bookable. Ask about current pricing when you book.',
        verifiedAt: 'August 14, 2026',
        items: [
          {
            name: 'Glo2Facial',
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
    const singleAndSeriesPrices = device.menu.singleAndSeriesPrices ?? [];

    return {
      kicker: device.title,
      heading: 'Filtered light for visible pigment and uneven tone.',
      metaDescription: 'Lumecca Peak IPL at House of Rose uses filtered optical energy. Compare the consultation and single- or three-session options. Ask about pricing.',
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
        ...(consultation
          ? [
              {
                label: 'How treatment pricing is organized',
                text: `Pricing varies by area and by whether you choose a single session or a series of three. The consultation is its own separate appointment.`,
              },
            ]
          : []),
      ],
      menu: consultation && singleAndSeriesPrices.length > 0
        ? {
            heading: 'Consultation and Lumecca Peak options by area',
            intro: `The consultation is its own listing. For each of the eight treatment areas, compare one session with a series of three. Ask about current pricing when you book.`,
            verifiedAt: 'August 6, 2026',
            items: [
              {
                name: consultation.name,
                note: 'Consultation appointment',
              },
              ...singleAndSeriesPrices.map((item) => ({
                name: item.name,
                note: 'Single session or series of 3',
              })),
            ],
          }
        : consultation
          ? {
              heading: 'Lumecca Peak consultation',
              intro: `The consultation is the starting appointment. Treatment pricing is separate and depends on the area being discussed. Ask about current pricing when you book.`,
              verifiedAt: 'August 6, 2026',
              items: [
                {
                  name: consultation.name,
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
        ...(consultation
          ? [
              {
                question: `Why does Lumecca Peak pricing vary?`,
                answer: `Pricing depends on the treatment area and whether you choose a single session or a series of three. The consultation is a separate appointment. Ask about current pricing when you book.`,
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
      metaDescription: 'Compare six Forma facial areas, five Forma Plus body areas, and the Forma + Lumecca bundle at House of Rose. Ask about current pricing when you book.',
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
                text: `Forma prices by facial area. Forma Plus prices by body area. The Forma + Lumecca Bundle is its own separate listing.`,
              },
            ]
          : []),
      ],
      menu: areaPrices.length > 0
        ? {
            heading: 'Forma and Forma Plus areas',
            intro: bundle
              ? `Forma has six facial areas. Forma Plus has five body areas. ${bundle.name} is a separate bundle listing. Ask about current pricing when you book.`
              : 'The price follows the facial or body area being treated. Ask about current pricing when you book.',
            verifiedAt: 'August 6, 2026',
            items: [
              ...areaPrices.map((item) => ({
                name: item.name,
              })),
              ...formaPlusAreaPrices.map((item) => ({
                name: `Forma Plus — ${item.name}`,
              })),
              ...(bundle
                ? [
                    {
                      name: bundle.name,
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
                question: 'Why does Forma pricing vary by area?',
                answer: 'Forma facial areas are face, neck, face and neck, eyes, jawline, and nasolabial folds. Forma Plus body areas are abdomen, arms, inner-outer thighs, lower back, and knees. Each area is priced separately.',
              },
              {
                question: `Is the Forma + Lumecca Bundle part of the area pricing?`,
                answer: `No. Area pricing belongs to the Forma and Forma Plus listings. ${bundle.name} has its own separate listing.`,
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
        note: item.note,
      }))
    : [
        ...MORPHEUS8_PRICING.burst.map((item) => ({
          name: item.name,
          note: 'Single treatment or series of 3',
        })),
        ...MORPHEUS8_PRICING.resurfacing.map((item) => ({
          name: item.name,
          note: 'Single treatment or series of 3',
        })),
        ...MORPHEUS8_PRICING.prime.map((item) => ({
          name: item.name,
          note: 'Single treatment or series of 3',
        })),
        ...MORPHEUS8_PRICING.burstPackageRanges.map((item) => ({
          name: item.name,
          note: `Package of ${item.treatmentCount}`,
        })),
        {
          name: MORPHEUS8_PRICING.bundle.name,
          note: `${MORPHEUS8_PRICING.bundle.treatmentCount} total treatments`,
        },
      ];

  return {
    kicker: device.title,
    heading: isBodyMorpheus
      ? 'RF microneedling for selected body areas.'
      : 'Microneedling and fractional radiofrequency, together.',
    metaDescription: isBodyMorpheus
      ? 'Morpheus8 Body at House of Rose combines microneedling with fractional radiofrequency for selected body areas. Ask about current pricing.'
      : 'Morpheus8 at House of Rose combines microneedling with fractional radiofrequency. Compare Burst, Resurfacing, and Prime options. Ask about pricing.',
    paragraphs: [
      device.whatItIs,
      device.whereItFits,
      isBodyMorpheus
        ? 'Morpheus8 Burst Deep body pricing is organized by area size: 4 × 10 inches or 8 × 11 inches. Both are priced as a series of three; call House of Rose to confirm the appointment length.'
        : 'Current options are listed below by option and area. Call House of Rose to confirm the appointment length and current pricing.',
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
          ? 'The Small Area package covers 4 × 10 inches; the Large Area package covers 8 × 11 inches. Each is priced as a series of three.'
          : device.comparisonToProcell ?? 'Morpheus8 combines microneedling with fractional bipolar radiofrequency in one InMode device.',
      },
    ],
    menu: {
      heading: isBodyMorpheus
        ? 'Morpheus8 Burst Deep area packages'
        : 'Morpheus8 options by option and area',
      intro: isBodyMorpheus
        ? 'Small Area is 4 × 10 inches; Large Area is 8 × 11 inches. Both are priced as a series of three. Ask about current pricing when you book.'
        : 'Burst, Resurfacing, and Prime are each organized by area for one treatment or a series of three. Hyperhidrosis is a package of three; the Morpheus8 + Lumecca option is a two-treatment bundle. Ask about current pricing when you book.',
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
            answer: 'The Morpheus8 Burst Deep small-area and large-area packages are each priced as a series of three. Call House of Rose to confirm the appointment length and current pricing.',
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
            answer: 'Burst, Resurfacing, and Prime list one-treatment and three-treatment options by area. Hyperhidrosis is a package of three, and the Morpheus8 + Lumecca Bundle covers two total treatments. Ask about current pricing when you book.',
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
            label: 'See Morpheus8 Body area options',
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

// GlossGenius remains the commerce source of truth, but its menu structure is
// not client-facing website copy. Keep operational facts available to internal
// tooling while preventing appointment inventory, booking modes, pricing
// language, and staff shorthand from leaking into public service pages or feeds.
const INTERNAL_MENU_LANGUAGE = /\b(?:appointment|appointments|book|booked|bookable|booking|consultation|duration|listing|menu|minute|minutes|price|priced|prices|pricing|standalone)\b/i;

const includesInternalMenuLanguage = (...values: Array<string | undefined>): boolean =>
  values.some((value) => Boolean(value && INTERNAL_MENU_LANGUAGE.test(value)));

const preparePublicServiceEducation = (
  content: ServiceEducationContent,
): ServiceEducationContent => {
  const paragraphs = content.paragraphs.filter(
    (paragraph) => !includesInternalMenuLanguage(paragraph),
  );
  const distinctions = content.distinctions?.filter(
    ({ label, text }) => !includesInternalMenuLanguage(label, text),
  );
  const faqs = content.faqs?.filter(
    ({ question, answer }) => !includesInternalMenuLanguage(question, answer),
  );
  const links = content.links?.filter(
    ({ label }) => !includesInternalMenuLanguage(label),
  );

  return {
    ...content,
    heading: includesInternalMenuLanguage(content.heading)
      ? `${content.kicker}, explained.`
      : content.heading,
    metaDescription: includesInternalMenuLanguage(content.metaDescription)
      ? `${content.kicker} at House of Rose Aesthetics in Punta Gorda. Learn how it works and the visible concerns it may address.`
      : content.metaDescription,
    paragraphs,
    distinctions: distinctions?.length ? distinctions : undefined,
    menu: undefined,
    faqs: faqs?.length ? faqs : undefined,
    links: links?.length ? links : undefined,
    faqHeading: faqs?.length && !includesInternalMenuLanguage(content.faqHeading)
      ? content.faqHeading
      : undefined,
  };
};

export const getServiceEducation = (slug: string): ServiceEducationContent | undefined => {
  const content = getRawServiceEducation(slug);
  if (!content) return undefined;

  const publicContent = preparePublicServiceEducation(content);
  const details = getServiceEducationDetails(slug);

  return details ? { ...publicContent, ...details } : publicContent;
};
