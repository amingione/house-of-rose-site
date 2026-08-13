export type DeviceServiceEducationSlug = 'forma-rf-facial' | 'glo2facial' | 'lumecca-peak-ipl' | 'morpheus8' | 'morpheus8-body';

export type DeviceServiceBookingMode = 'call' | 'consultation' | 'direct';

export interface DeviceServiceMenuFacts {
  readonly bookingMode: DeviceServiceBookingMode;
  readonly duration?: string;
}

export interface DeviceServiceEducation {
  readonly slug: DeviceServiceEducationSlug;
  readonly title: string;
  readonly whatItIs: string;
  readonly whereItFits: string;
  readonly oxygenation?: string;
  readonly currentAreas?: readonly string[];
  readonly menu: DeviceServiceMenuFacts;
}

/**
 * Factual overview copy for the named-device services.
 *
 * Prices and option names are deliberately absent. The current GlossGenius
 * menu does not agree with the repository pricing ledger, so neither source is
 * treated as reconciled public price truth here.
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
      'Forma is an InMode non-invasive radiofrequency handpiece. Radiofrequency travels through electrodes to provide controlled dermal and subdermal heating; the handpiece does not use needles.',
    whereItFits:
      'House of Rose lists Forma as a facial RF service, separate from Morpheus8 RF Microneedling and Lumecca Peak IPL.',
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
      'House of Rose lists it as a standalone facial combining surface exfoliation, topical infusion, and oxygenation.',
    oxygenation:
      'Geneo describes the oxygenation step as a reaction between its OxyPod and Primer Gel. The reaction creates a carbon-dioxide-rich bubbly environment on the skin’s surface that triggers the oxygenation step; oxygen is not blown onto the face from an external source.',
    menu: {
      bookingMode: 'direct',
      duration: '60 minutes',
    },
  },
  'lumecca-peak-ipl': {
    slug: 'lumecca-peak-ipl',
    title: 'Lumecca Peak IPL Photofacial',
    whatItIs:
      'Lumecca Peak is an InMode intense pulsed light (IPL) handpiece. Its xenon flash lamp delivers filtered optical energy.',
    whereItFits:
      'House of Rose lists Lumecca Peak for visible pigment, uneven tone, and selected texture concerns.',
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
    },
  },
  morpheus8: {
    slug: 'morpheus8',
    title: 'Morpheus8 RF Microneedling',
    whatItIs:
      'Morpheus8 is an InMode device that combines microneedling with fractional bipolar radiofrequency.',
    whereItFits:
      'House of Rose lists it for visible tone and texture, eligible scars, and stretch marks across the face, neck and chest, and selected body areas.',
    menu: {
      bookingMode: 'consultation',
    },
  },
  'morpheus8-body': {
    slug: 'morpheus8-body',
    title: 'Morpheus8 RF Body',
    whatItIs:
      'Morpheus8 Body uses the same InMode platform, combining microneedling with fractional bipolar radiofrequency for selected body areas.',
    whereItFits:
      'The body listing focuses that platform on selected body areas for body-skin tone, texture, eligible scars, and stretch marks.',
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
