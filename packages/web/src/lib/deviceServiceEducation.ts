export type DeviceServiceEducationSlug = 'forma-rf-facial' | 'glo2facial' | 'lumecca-peak-ipl' | 'morpheus8' | 'morpheus8-body';

export type DeviceServiceBookingMode = 'call' | 'consultation' | 'direct';

export interface DeviceServiceMenuFacts {
  readonly bookingMode: DeviceServiceBookingMode;
  readonly duration?: string;
  readonly priceUsd?: number;
  readonly consultation?: {
    readonly name: string;
    readonly priceUsd: number;
  };
  readonly treatmentPriceRange?: {
    readonly minimumUsd: number;
    readonly maximumUsd: number;
    readonly basis: string;
  };
}

export interface DeviceServiceEducation {
  readonly slug: DeviceServiceEducationSlug;
  readonly title: string;
  readonly whatItIs: string;
  readonly whereItFits: string;
  readonly exfoliation?: string;
  readonly infusionAndFinish?: string;
  readonly oxygenation?: string;
  readonly recovery?: string;
  readonly comparisonToProcell?: string;
  readonly comparisonToDermaplaning?: string;
  readonly comparisonToForma?: string;
  readonly needleDistinction?: string;
  readonly currentAreas?: readonly string[];
  readonly menu: DeviceServiceMenuFacts;
}

/**
 * Factual overview copy for the named-device services.
 *
 * Treatment prices and option names remain absent unless the exact appointment
 * has been reconciled between GlossGenius and the repository pricing ledger.
 * The same standard applies to a consultation used as the starting appointment.
 *
 * Forma and Lumecca Peak identities are cross-checked against InMode product
 * descriptions and FDA documentation. The FDA separates Forma's non-invasive
 * RF applicators, Morpheus8's fractional RF applicators, and Lumecca's IPL
 * applicators on the InMode platform.
 * https://inmodemd.co.uk/technologie/forma/
 * https://www.accessdata.fda.gov/cdrh_docs/pdf22/K221571.pdf
 * https://inmodemd.co.uk/technologie/lumecca-peak/
 * https://www.accessdata.fda.gov/cdrh_docs/pdf25/K251632.pdf
 *
 * Glo2Facial oxygenation mechanism is cross-checked against Geneo's OxyGeneo
 * technical white paper. Promotional outcomes and protocol claims are omitted.
 * https://information.geneo-us.com/hubfs/Gated%20Content%20Whitepapers/OxyGeneo%20White%20Paper.pdf
 */
export const DEVICE_SERVICE_EDUCATION = {
  'forma-rf-facial': {
    slug: 'forma-rf-facial',
    title: 'Forma RF Facial',
    whatItIs:
      'Forma is an InMode non-invasive radiofrequency handpiece for the face. Surface electrodes deliver radiofrequency for controlled dermal and subdermal heating.',
    whereItFits:
      'Within the House of Rose InMode services, Forma provides facial radiofrequency through surface electrodes; Morpheus8 pairs microneedling with fractional radiofrequency, while Lumecca Peak uses IPL for visible pigment and uneven tone.',
    needleDistinction:
      'Forma delivers radiofrequency through electrodes at the skin surface and does not use microneedles. Morpheus8 is the InMode service that combines microneedling with fractional radiofrequency.',
    menu: {
      bookingMode: 'call',
    },
  },
  glo2facial: {
    slug: 'glo2facial',
    title: 'Glo2Facial',
    whatItIs:
      'Glo2Facial is a Geneo facial that combines surface exfoliation, topical infusion, and an oxygenation step.',
    whereItFits:
      'At House of Rose, Glo2Facial is a directly bookable, 60-minute standalone facial.',
    exfoliation:
      'During the surface pass, a single-use OxyPod moves across the skin with its paired Primer Gel. Their reaction creates carbon-dioxide bubbles while the OxyPod exfoliates at the skin’s surface.',
    infusionAndFinish:
      'After the surface pass, the appointment continues with topical infusion and finishes with facial massage.',
    oxygenation:
      'Geneo describes the oxygenation step as a reaction between its OxyPod and Primer Gel. The reaction creates a carbon-dioxide-rich bubbly environment on the skin’s surface that triggers the oxygenation step; oxygen is not blown onto the face from an external source.',
    recovery:
      // drift-guard-ok: procedure-specific recovery fact verified by the owner on 2026-08-06
      'House of Rose confirms that Glo2Facial has no downtime. You can return to your usual day after the appointment, and your provider will review any recommended aftercare.',
    comparisonToDermaplaning:
      'Both appointments include surface exfoliation, but they use different tools. Dermaplaning uses a specialized blade across the face to remove fine vellus hair and accumulated dead skin cells. Glo2Facial uses a single-use OxyPod with Primer Gel for its surface pass, then continues with topical infusion and facial massage.',
    menu: {
      bookingMode: 'direct',
      duration: '60 minutes',
      priceUsd: 225,
    },
  },
  'lumecca-peak-ipl': {
    slug: 'lumecca-peak-ipl',
    title: 'Lumecca Peak IPL Photofacial',
    whatItIs:
      'Lumecca Peak is an InMode intense pulsed light (IPL) handpiece. Its xenon flash lamp delivers filtered optical energy.',
    whereItFits:
      'House of Rose lists Lumecca Peak for visible pigment, uneven tone, and selected texture concerns.',
    comparisonToForma:
      'Lumecca Peak delivers filtered optical energy as IPL. Forma uses radiofrequency delivered through electrodes at the skin surface. They are two different InMode technologies, even though both appear in the same House of Rose device collection.',
    currentAreas: [
      'legs',
      'full face',
      'chest',
      'neck',
      'face and neck',
      'face, neck, and chest',
      'spot treatment',
      'hands',
    ],
    menu: {
      bookingMode: 'consultation',
      consultation: {
        name: 'Lumecca Peak IPL Consultation',
        priceUsd: 50,
      },
      treatmentPriceRange: {
        minimumUsd: 250,
        maximumUsd: 2600,
        basis: 'treatment area and single- or three-session selection',
      },
    },
  },
  morpheus8: {
    slug: 'morpheus8',
    title: 'Morpheus8 RF Microneedling',
    whatItIs:
      'Morpheus8 is an InMode device that combines microneedling with fractional bipolar radiofrequency.',
    whereItFits:
      'House of Rose offers Morpheus8 for visible tone and texture, eligible scars, and stretch marks across the face, neck and chest and selected body areas.',
    comparisonToProcell:
      'House of Rose’s Procell Microneedling service uses the Procell device to create controlled microchannels. Morpheus8 combines microneedling with fractional bipolar radiofrequency in the same InMode device.',
    menu: {
      bookingMode: 'consultation',
    },
  },
  'morpheus8-body': {
    slug: 'morpheus8-body',
    title: 'Morpheus8 RF Body',
    whatItIs:
      'Morpheus8 Body uses the same InMode platform to combine microneedling with fractional bipolar radiofrequency across selected body areas.',
    whereItFits:
      'House of Rose lists it for body-skin tone, texture, eligible scars, and stretch marks. The main Morpheus8 page also covers the face, neck and chest, and selected body areas.',
    menu: {
      bookingMode: 'consultation',
    },
  },
} as const satisfies Readonly<
  Record<DeviceServiceEducationSlug, DeviceServiceEducation>
>;

export const isDeviceServiceEducationSlug = (
  slug: string,
): slug is DeviceServiceEducationSlug =>
  Object.prototype.hasOwnProperty.call(DEVICE_SERVICE_EDUCATION, slug);

export const getDeviceServiceEducation = (
  slug: string,
): DeviceServiceEducation | undefined =>
  isDeviceServiceEducationSlug(slug)
    ? DEVICE_SERVICE_EDUCATION[slug]
    : undefined;
