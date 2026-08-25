import type { BookingMode } from './booking';
import type {
  TreatmentProviderAttribution,
  TreatmentProviderScope,
} from './treatmentQueries';

export type ServiceKind = 'hub' | 'treatment' | 'standalone';

export interface ServiceConcern {
  _id: string;
  title: string;
  slug: string;
}

export interface ServiceLocalArea {
  _id: string;
  city: string;
  slug: string;
}

export interface ServiceComparison {
  _id: string;
  slug: string;
}

export interface ServiceCostGuide {
  _id: string;
  title: string;
  slug: string;
}

export interface LocalServiceImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface EvidenceMedia {
  _key: string;
  kind: 'device' | 'before-after';
  image: LocalServiceImage;
  title: string;
  caption: string;
  sourceCredit: string;
  sourceUrl?: string;
  usageApproved: boolean;
  consentConfirmed?: boolean;
}

export interface ResearchReference {
  _key: string;
  title: string;
  journal: string;
  year: number;
  studyType: string;
  summary: string;
  limitations: string;
  url: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  kind: ServiceKind;
  provider?: TreatmentProviderAttribution;
  providerScope?: TreatmentProviderScope;
  parentService?: { title: string; slug: string };
  treatments?: Service[];
  duration?: string;
  bookingMode?: BookingMode;
  bookingUrl?: string;
  bookingVerifiedAt?: string;
  concerns?: ServiceConcern[];
  gallery?: LocalServiceImage[];
  evidenceMedia?: EvidenceMedia[];
  researchReferences?: ResearchReference[];
  collection?: { title: string; slug: string };
  relatedServices?: Service[];
  contextualServices?: Service[];
  costGuides?: ServiceCostGuide[];
  comparisons?: ServiceComparison[];
  localAreas?: ServiceLocalArea[];
  _updatedAt: string;
}

export interface SitemapService {
  _id: string;
  title: string;
  slug: string;
  kind: ServiceKind;
  parentService?: { title: string; slug: string };
  _updatedAt: string;
}

export interface ServiceCollection {
  _id: string;
  title: string;
  slug: string;
  services: Service[];
}

export interface NavCollection {
  _id: string;
  title: string;
  slug: string;
  services: { _id: string; title: string; slug: string }[];
}

interface ServiceRecord {
  _id: string;
  title: string;
  slug: string;
  kind: ServiceKind;
  public: boolean;
  order: number;
  collectionSlug: string;
  parentSlug?: string;
  providerId?: keyof typeof PROVIDERS;
  providerScope?: TreatmentProviderScope;
  duration?: string;
  bookingMode?: BookingMode;
  bookingUrl?: string;
  bookingVerifiedAt?: string;
  concernSlugs?: readonly string[];
  relatedSlugs?: readonly string[];
  gallery?: readonly LocalServiceImage[];
  evidenceMedia?: readonly EvidenceMedia[];
  researchReferences?: readonly ResearchReference[];
  _updatedAt: string;
}

interface CollectionRecord {
  _id: string;
  title: string;
  slug: string;
  order: number;
  publicRoute: boolean;
}

const PROVIDERS = {
  'provider-amber': {
    _id: 'provider-amber',
    publicName: 'Amber Mingione, Esthetician',
    profileSlug: 'amber',
    profileImagePath: '/images/providers/amber-profile-1122.webp',
    profileImageAlt: 'Esthetician Amber at House of Rose Aesthetics in Punta Gorda, Florida',
  },
  'provider-diana': {
    _id: 'provider-diana',
    publicName: 'Diana Morrison, RN',
    profileSlug: 'diana',
    profileImagePath: '/images/providers/diana-profile-1122.webp',
    profileImageAlt: 'Diana Morrison, RN at House of Rose Aesthetics in Punta Gorda, Florida',
  },
  'provider-brandy': {
    _id: 'provider-brandy',
    publicName: 'Brandy, Licensed Esthetician',
    profileSlug: null,
    profileImagePath: '/images/providers/brandy-profile-1122.webp',
    profileImageAlt: 'Brandy, Licensed Esthetician at House of Rose Aesthetics',
  },
  'provider-aundrea': {
    _id: 'dd6cb002-2ac5-46d5-a779-a20573dc5f98',
    publicName: 'Aundrea Pedigo, Licensed Esthetician',
    profileSlug: 'aundrea',
    profileImagePath: '/images/providers/Aundrea.webp',
    profileImageAlt: 'Aundrea Pedigo, Licensed Esthetician at House of Rose Aesthetics',
  },
} as const satisfies Record<string, TreatmentProviderAttribution>;

const ESTHETICIAN_SCOPE: TreatmentProviderScope = {
  performedBy: 'esthetician',
  medicalDirection: false,
  credentialPoints: [
    'Performed by a Florida-licensed esthetician.',
    'Manufacturer-certified on the specific system used.',
    'Skin assessed at each visit before the protocol is selected.',
  ],
  disclaimer:
    'Individual results vary. Candidacy is determined at consultation. This page is general information and is not medical advice.',
};

const RN_SCOPE: TreatmentProviderScope = {
  performedBy: 'rn',
  medicalDirection: true,
  credentialPoints: [
    'Performed by a Florida-licensed registered nurse.',
    'Delivered under the delegation of a supervising physician medical director.',
    'Consultation and health history reviewed before every first treatment.',
  ],
  disclaimer:
    'Individual results vary. Candidacy is determined at consultation. This page is general information and is not medical advice.',
};

const PRF_RN_SCOPE: TreatmentProviderScope = {
  performedBy: 'rn',
  medicalDirection: true,
  credentialPoints: ['Registered nurse (RN)'],
  disclaimer: 'Individual outcomes vary. This page is general information and is not medical advice.',
};

const COLLECTION_RECORDS = [
  { _id: 'service-collection-rf-ipl-skin-treatments', title: 'InMode', slug: 'inmode', order: 1, publicRoute: true },
  { _id: '16b4ca79-a320-4bd8-be88-f69952169f17', title: 'Injectables & Bio-Fillers', slug: 'injectables-bio-fillers', order: 2, publicRoute: true },
  { _id: 'collection-iv-hydration-therapy', title: 'IV Hydration Therapy', slug: 'iv-hydration-therapy', order: 3, publicRoute: true },
  { _id: 'collection-facials', title: 'Facials', slug: 'facials', order: 4, publicRoute: true },
  { _id: '5ae70d4c-c42e-4824-881e-b6bb4157de7f', title: 'Waxing', slug: 'waxing', order: 5, publicRoute: true },
  { _id: 'collection-makeup', title: 'Makeup', slug: 'makeup', order: 6, publicRoute: false },
] as const satisfies readonly CollectionRecord[];

const CONCERNS: Readonly<Record<string, ServiceConcern>> = {
  'acne-scarring': { _id: 'ad938cc9-1677-42ce-ad14-085362954677', title: 'Acne Scarring', slug: 'acne-scarring' },
  'active-acne': { _id: 'concern-active-acne', title: 'Active Acne & Breakouts', slug: 'active-acne' },
  aging: { _id: '5542890f-9add-4d83-9048-2e50cd5f43c1', title: 'Aging', slug: 'aging' },
  'dark-circles': { _id: '6b793d2e-1932-4b07-b1b7-82d2b24cefb1', title: 'Dark Circles & Under-Eyes', slug: 'dark-circles' },
  'fine-lines-laxity': { _id: 'ac651187-ec12-4324-a5c6-974a73b42f1a', title: 'Fine Lines & Laxity', slug: 'fine-lines-laxity' },
  hyperpigmentation: { _id: 'concern-hyperpigmentation', title: 'Hyperpigmentation & Dark Spots', slug: 'hyperpigmentation' },
  'stretch-marks': { _id: 'f36aa3c0-9681-4e82-95dd-1ad4abbdb3f8', title: 'Stretch Marks', slug: 'stretch-marks' },
  'sun-damage': { _id: 'e07ca64c-62da-4aef-94f5-a0517ccb70fb', title: 'Sun Damage', slug: 'sun-damage' },
  texture: { _id: 'e775f8a4-266e-4edb-8c6f-eba826fc94cd', title: 'Texture', slug: 'texture' },
  'volume-loss': { _id: 'concern-volume-loss', title: 'Volume Loss', slug: 'volume-loss' },
};

const LOCAL_AREAS: readonly (ServiceLocalArea & { serviceSlugs: readonly string[] })[] = [
  {
    _id: '650ac40d-be26-4c0d-a865-cca1acf2e491',
    city: 'Punta Gorda',
    slug: 'punta-gorda',
    serviceSlugs: ['dermal-fillers', 'injectables', 'iv-hydration-therapy', 'glp-1-weight-management', 'prf', 'microneedling', 'glo2facial', 'dermaplaning'],
  },
  {
    _id: 'hor-area-port-charlotte',
    city: 'Port Charlotte',
    slug: 'port-charlotte',
    serviceSlugs: ['microneedling', 'prf', 'glo2facial', 'dermaplaning'],
  },
];

const COST_GUIDES: readonly (ServiceCostGuide & { serviceSlug: string })[] = [
  { _id: 'hor-cost-biorepeel', title: 'How Much Does a BioRePeel Cost in Punta Gorda?', slug: 'biorepeel-cost-punta-gorda', serviceSlug: 'biorepeel' },
  { _id: 'hor-cost-botox', title: 'How Much Does Botox Cost in Punta Gorda?', slug: 'botox-cost-punta-gorda', serviceSlug: 'injectables' },
  { _id: 'hor-cost-dermal-fillers', title: 'How Much Do Dermal Fillers Cost in Punta Gorda?', slug: 'dermal-fillers-cost-punta-gorda', serviceSlug: 'dermal-fillers' },
  { _id: 'hor-cost-forma', title: 'How Much Does Forma RF Facial Cost in Punta Gorda?', slug: 'forma-cost-punta-gorda', serviceSlug: 'forma-rf-facial' },
  { _id: 'hor-cost-lumecca-ipl', title: 'How Much Does an IPL Photofacial Cost in Punta Gorda?', slug: 'ipl-photofacial-cost-punta-gorda', serviceSlug: 'lumecca-peak-ipl' },
  { _id: 'hor-cost-microneedling', title: 'How Much Does Microneedling Cost in Punta Gorda?', slug: 'microneedling-cost-punta-gorda', serviceSlug: 'microneedling' },
  { _id: 'hor-cost-morpheus8', title: 'How Much Does Morpheus8 Cost in Punta Gorda?', slug: 'morpheus8-cost-punta-gorda', serviceSlug: 'morpheus8' },
];

const COMPARISONS: readonly (ServiceComparison & { serviceSlugs: readonly string[] })[] = [
  { _id: 'hor-compare-morpheus8-vs-microneedling', slug: 'morpheus8-vs-microneedling', serviceSlugs: ['morpheus8', 'microneedling'] },
  { _id: 'comparison-daxxify-vs-botox', slug: 'daxxify-vs-botox', serviceSlugs: ['injectables', 'injectables'] },
];

const inModeEvidence = (
  key: string,
  kind: EvidenceMedia['kind'],
  title: string,
  caption: string,
  sourceCredit: string,
  alt: string,
  src: string,
  width: number,
  height: number,
  consentConfirmed?: boolean,
): EvidenceMedia => ({
  _key: key,
  kind,
  image: { src, alt, width, height },
  title,
  caption,
  sourceCredit,
  usageApproved: true,
  consentConfirmed,
});

const SERVICE_RECORDS: readonly ServiceRecord[] = [
  {
    _id: 'e82404a8-a778-4359-9a6d-71377ab903d3', title: 'Injectables & Bio-Fillers', slug: 'injectables-bio-fillers', kind: 'hub', public: true, order: 0, collectionSlug: 'injectables-bio-fillers', providerId: 'provider-diana', bookingMode: 'phone', bookingVerifiedAt: '2026-08-04', gallery: [{ src: '/images/optimized/actual-facial-suite-1400.webp', alt: 'Injectables treatment suite at House of Rose Aesthetics', width: 1400, height: 1750 }], _updatedAt: '2026-08-13T00:21:59Z',
  },
  {
    _id: 'service-bridal-makeup', title: 'Bridal Makeup', slug: 'bridal-makeup', kind: 'standalone', public: true, order: 1, collectionSlug: 'makeup', providerId: 'provider-aundrea', duration: '2 hours', bookingMode: 'phone', _updatedAt: '2026-08-25T04:41:37Z',
  },
  {
    _id: '99566c9c-8033-4df6-b5a3-ac5de5d2d886', title: 'IV Hydration Therapy', slug: 'iv-hydration-therapy', kind: 'standalone', public: true, order: 1, collectionSlug: 'iv-hydration-therapy', providerId: 'provider-diana', providerScope: RN_SCOPE, duration: '45–60 minutes', bookingMode: 'phone', bookingVerifiedAt: '2026-08-04', gallery: [{ src: '/images/optimized/actual-iv-suite-1400.webp', alt: 'IV hydration suite at House of Rose Aesthetics in Punta Gorda, Florida', width: 1400, height: 1750 }], _updatedAt: '2026-08-11T02:02:55Z',
  },
  {
    _id: 'service-morpheus8', title: 'Morpheus8 RF Microneedling', slug: 'morpheus8', kind: 'standalone', public: true, order: 1, collectionSlug: 'inmode', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-6156b30d-84a3-4d71-8d9d-6ee81fea44de', bookingVerifiedAt: '2026-08-04', concernSlugs: ['texture', 'acne-scarring', 'stretch-marks'], relatedSlugs: ['lumecca-peak-ipl', 'forma-rf-facial', 'morpheus8-body'], evidenceMedia: [inModeEvidence('morpheus8-device', 'device', 'Morpheus8 Burst Technology', 'The Morpheus8 handpiece combines controlled microneedling with fractional bipolar radiofrequency. Treatment depth, energy, and area are selected for the individualized plan.', 'InMode manufacturer media', 'Morpheus8 Burst radiofrequency microneedling handpiece', '/images/inmode/morpheus8-burst-device.webp', 628, 1000)], _updatedAt: '2026-08-07T01:14:20Z',
  },
  {
    _id: '7bd92dc1-9ced-42bd-a195-e9fa4628a848', title: 'Neurotoxin Injections', slug: 'injectables', kind: 'standalone', public: true, order: 1, collectionSlug: 'injectables-bio-fillers', parentSlug: 'injectables-bio-fillers', providerId: 'provider-diana', providerScope: RN_SCOPE, duration: '30 minutes', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-b6105dd4-6519-4e8a-a986-f6313666f8ee', bookingVerifiedAt: '2026-08-04', concernSlugs: ['fine-lines-laxity', 'aging'], relatedSlugs: ['microneedling', 'iv-hydration-therapy'], gallery: [{ src: '/images/optimized/actual-facial-suite-1400.webp', alt: 'Injectables treatment room at House of Rose Aesthetics', width: 1400, height: 1750 }], _updatedAt: '2026-08-19T23:48:28Z',
  },
  {
    _id: '46fb011c-6d0c-4667-83e4-81c7d87a3feb', title: 'Dermal Fillers', slug: 'dermal-fillers', kind: 'standalone', public: true, order: 2, collectionSlug: 'injectables-bio-fillers', parentSlug: 'injectables-bio-fillers', providerId: 'provider-diana', providerScope: RN_SCOPE, duration: '45–60 minutes', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-4e97c315-226e-49bd-9e80-790109db8339', bookingVerifiedAt: '2026-08-04', concernSlugs: ['fine-lines-laxity', 'volume-loss', 'aging'], relatedSlugs: ['glp-1-weight-management', 'injectables'], _updatedAt: '2026-08-11T02:02:55Z',
  },
  {
    _id: 'service-event-makeup', title: 'Event Makeup', slug: 'event-makeup', kind: 'standalone', public: true, order: 2, collectionSlug: 'makeup', providerId: 'provider-aundrea', duration: '45 minutes', bookingMode: 'phone', _updatedAt: '2026-08-25T04:41:37Z',
  },
  {
    _id: '6e204a23-77a2-48a9-8381-878974cb92e4', title: 'GLP-1 Weight Management', slug: 'glp-1-weight-management', kind: 'standalone', public: true, order: 2, collectionSlug: 'iv-hydration-therapy', providerId: 'provider-diana', providerScope: RN_SCOPE, duration: 'Ongoing program', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-129199ce-d7c0-42f4-827f-7dcbdbd523dc', bookingVerifiedAt: '2026-08-04', _updatedAt: '2026-08-12T20:39:47Z',
  },
  {
    _id: 'service-lumecca-peak-ipl', title: 'Lumecca Peak IPL Photofacial', slug: 'lumecca-peak-ipl', kind: 'standalone', public: true, order: 2, collectionSlug: 'inmode', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-de667c29-dbef-47e6-9022-418389aefa71', bookingVerifiedAt: '2026-08-04', concernSlugs: ['sun-damage', 'hyperpigmentation', 'texture'], relatedSlugs: ['morpheus8', 'forma-rf-facial'], evidenceMedia: [
      inModeEvidence('lumecca-device', 'device', 'Lumecca Peak IPL Technology', 'Lumecca Peak delivers customizable pulses of broad-spectrum light. The planned area, skin assessment, recent sun exposure, and candidacy guide treatment settings.', 'InMode manufacturer media', 'Lumecca Peak intense pulsed light handpiece', '/images/inmode/lumecca-peak-device.webp', 628, 1000),
      inModeEvidence('lumecca-face-example', 'before-after', 'Visible Tone and Discoloration Example', 'A manufacturer-provided example illustrating visible change in facial discoloration and overall tone after Lumecca IPL. This is not a House of Rose client.', 'Manufacturer-provided treatment example; attribution embedded in image', 'Manufacturer-provided Lumecca Peak IPL facial before and after example', '/images/inmode/lumecca-peak-before-after.webp', 670, 289, true),
    ], researchReferences: [{ _key: 'lumecca-retrospective-2021', title: 'Retrospective Analysis of Outcomes with a Unique IPL System', journal: 'Journal of Cosmetics, Dermatological Sciences and Applications', year: 2021, studyType: 'Retrospective photographic analysis', summary: 'The paper reviewed photographs from several clinics and reported visible improvement across selected pigment and texture concerns after treatment with a Lumecca IPL system.', limitations: 'This was a retrospective review rather than a randomized controlled trial. It evaluated an earlier Lumecca system and should not be read as a direct trial of every current Lumecca Peak setting or as a promise of individual results.', url: 'https://doi.org/10.4236/jcdsa.2021.112012' }], _updatedAt: '2026-08-07T01:23:18Z',
  },
  {
    _id: '3cca74b8-9626-4ed7-aaab-3c31bcac8ad8', title: 'BioRePeel', slug: 'biorepeel', kind: 'hub', public: true, order: 3, collectionSlug: 'facials', providerId: 'provider-amber', duration: '45 minutes', bookingMode: 'direct', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-7694890a-1554-4ddb-8d7e-587064960791', bookingVerifiedAt: '2026-08-04', concernSlugs: ['sun-damage', 'hyperpigmentation', 'active-acne', 'aging'], _updatedAt: '2026-08-12T20:15:13Z',
  },
  {
    _id: 'service-everyday-makeup', title: 'Everyday Makeup', slug: 'everyday-makeup', kind: 'standalone', public: true, order: 3, collectionSlug: 'makeup', providerId: 'provider-aundrea', duration: '25 minutes', bookingMode: 'phone', _updatedAt: '2026-08-25T04:41:37Z',
  },
  {
    _id: 'service-forma-rf-facial', title: 'Forma RF Facial', slug: 'forma-rf-facial', kind: 'standalone', public: true, order: 3, collectionSlug: 'inmode', bookingMode: 'phone', bookingVerifiedAt: '2026-08-04', concernSlugs: ['texture'], relatedSlugs: ['morpheus8', 'lumecca-peak-ipl'], evidenceMedia: [inModeEvidence('forma-device', 'device', 'Forma Facial RF Technology', 'The Forma handpiece delivers non-invasive radiofrequency while monitoring skin temperature in real time. House of Rose considers eligible areas of the face and neck after consultation.', 'InMode manufacturer media', 'Forma temperature-controlled radiofrequency facial handpiece', '/images/inmode/Forma-handpiece-space.png', 251, 400)], researchReferences: [{ _key: 'forma-split-face-2017', title: 'Split-face histological and biochemical evaluation of temperature- and impedance-controlled continuous non-invasive radiofrequency', journal: 'Journal of Cosmetic and Laser Therapy', year: 2017, studyType: 'Small split-face tissue study', summary: 'In this study, one side of the face received a series of Forma radiofrequency sessions. Tissue analysis found changes consistent with increased dermal collagen content and synthesis on the treated side.', limitations: 'Only four participants were included and the protocol used eight weekly sessions. The tissue findings are informative but cannot predict the amount of visible change an individual client may experience.', url: 'https://doi.org/10.1080/14764172.2016.1262957' }], _updatedAt: '2026-08-07T02:39:30Z',
  },
  {
    _id: '0e5554bd-f58d-4dbe-be0a-972ad9a27a0e', title: 'Glo2Facial', slug: 'glo2facial', kind: 'standalone', public: true, order: 4, collectionSlug: 'facials', providerId: 'provider-amber', providerScope: ESTHETICIAN_SCOPE, duration: '60 minutes', bookingMode: 'direct', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-9649fdf8-0e26-436e-aebf-c19b27addce4', bookingVerifiedAt: '2026-08-04', concernSlugs: ['fine-lines-laxity'], _updatedAt: '2026-08-19T23:48:28Z',
  },
  {
    _id: 'e8b38f03-900f-4ec5-9246-07cc1b65ed11', title: 'Dermaplaning', slug: 'dermaplaning', kind: 'standalone', public: true, order: 5, collectionSlug: 'facials', providerId: 'provider-amber', duration: '50 minutes', bookingMode: 'direct', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-885f1677-f592-448c-a9de-31f9f4576822', bookingVerifiedAt: '2026-08-04', concernSlugs: ['hyperpigmentation', 'active-acne'], _updatedAt: '2026-08-13T00:21:59Z',
  },
  {
    _id: '522cd772-c891-46b6-b3cf-2a24197264bc', title: 'Face Reality Acne Program', slug: 'face-reality-acne-program', kind: 'hub', public: true, order: 6, collectionSlug: 'facials', providerId: 'provider-amber', providerScope: ESTHETICIAN_SCOPE, duration: '12-week program', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-4b775177-156d-4eef-9957-cf11c9d7bcdf', bookingVerifiedAt: '2026-08-04', concernSlugs: ['acne-scarring'], _updatedAt: '2026-08-20T15:40:46Z',
  },
  {
    _id: '52889a9f-ed52-410d-b78c-3d991c23ab24', title: 'Acne Bootcamp — 12-Week Face Reality Acne Program', slug: 'acne-bootcamp', kind: 'treatment', public: true, order: 41, collectionSlug: 'facials', parentSlug: 'face-reality-acne-program', providerId: 'provider-amber', duration: '12 weeks · biweekly visits', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-4b775177-156d-4eef-9957-cf11c9d7bcdf', bookingVerifiedAt: '2026-08-04', concernSlugs: ['acne-scarring', 'active-acne'], _updatedAt: '2026-08-04T17:00:08Z',
  },
  {
    _id: 'service-waxing', title: 'Waxing', slug: 'waxing', kind: 'hub', public: true, order: 59, collectionSlug: 'waxing', bookingMode: 'phone', bookingVerifiedAt: '2026-08-13', _updatedAt: '2026-08-13T14:07:06Z',
  },
  {
    _id: 'service-facial-waxing', title: 'Facial Waxing', slug: 'facial-waxing', kind: 'treatment', public: true, order: 60, collectionSlug: 'waxing', parentSlug: 'waxing', providerId: 'provider-brandy', duration: '10–25 min by zone', bookingMode: 'direct', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-5e8fc55d-9118-49d2-8d24-2e05df90e851', bookingVerifiedAt: '2026-08-04', _updatedAt: '2026-08-13T13:59:39Z',
  },
  {
    _id: '8f3a3755-2633-4bfc-9b04-41696ffba1e1', title: 'Body Waxing', slug: 'body-waxing', kind: 'treatment', public: true, order: 61, collectionSlug: 'waxing', parentSlug: 'waxing', providerId: 'provider-brandy', duration: '10–40 min by zone', bookingMode: 'phone', bookingVerifiedAt: '2026-08-12', _updatedAt: '2026-08-13T13:59:39Z',
  },
  {
    _id: 'f5308b9c-73df-4812-8c0d-afcf4ee5839a', title: 'Microneedling', slug: 'microneedling', kind: 'hub', public: true, order: 110, collectionSlug: 'facials', providerId: 'provider-amber', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-5b4391bb-3d43-40f3-910d-144cf0e46192', bookingVerifiedAt: '2026-08-04', concernSlugs: ['aging', 'acne-scarring', 'fine-lines-laxity', 'sun-damage', 'texture', 'stretch-marks', 'hyperpigmentation'], relatedSlugs: ['biorepeel', 'glo2facial', 'dermaplaning'], _updatedAt: '2026-08-13T09:51:13Z',
  },
  {
    _id: 'service-morpheus8-body', title: 'Morpheus8 Body', slug: 'morpheus8-body', kind: 'treatment', public: true, order: 112, collectionSlug: 'inmode', parentSlug: 'morpheus8', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-bd506885-7ad3-4a15-ab5a-90a8bd082db4', bookingVerifiedAt: '2026-08-04', concernSlugs: ['stretch-marks', 'texture'], relatedSlugs: ['morpheus8', 'forma-rf-facial'], evidenceMedia: [inModeEvidence('m8b-device', 'device', 'Morpheus8 Body Technology', 'The Morpheus8 handpiece delivers fractional bipolar radiofrequency through microneedles. On the body, depth and energy are set for larger areas and thicker skin.', 'InMode manufacturer media', 'Morpheus8 Burst radiofrequency microneedling handpiece', '/images/inmode/morpheus8-burst-device.webp', 628, 1000)], _updatedAt: '2026-08-07T01:14:20Z',
  },
  {
    _id: 'c3ffc30e-e13c-436e-b0c0-6aaeaeed2d6b', title: 'Platelet-Rich Fibrin (PRF)', slug: 'prf', kind: 'hub', public: true, order: 130, collectionSlug: 'facials', bookingMode: 'phone', bookingVerifiedAt: '2026-08-04', concernSlugs: ['dark-circles', 'aging', 'volume-loss'], _updatedAt: '2026-08-13T09:51:13Z',
  },
  {
    _id: 'service-prf-under-eyes', title: 'PRF Under Eyes', slug: 'prf-under-eyes', kind: 'treatment', public: true, order: 131, collectionSlug: 'injectables-bio-fillers', parentSlug: 'prf', providerId: 'provider-diana', providerScope: PRF_RN_SCOPE, duration: '60 minutes', bookingMode: 'consultation', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-7a950500-c694-4a9c-9a25-f98fd4e72e6c', bookingVerifiedAt: '2026-08-13', concernSlugs: ['dark-circles', 'volume-loss'], relatedSlugs: ['prf-injections'], _updatedAt: '2026-08-13T14:02:07Z',
  },
  {
    _id: 'adf66d59-5dcd-4f95-8282-681dafc97d89', title: 'PRF Injections', slug: 'prf-injections', kind: 'treatment', public: true, order: 132, collectionSlug: 'injectables-bio-fillers', parentSlug: 'prf', providerId: 'provider-diana', providerScope: PRF_RN_SCOPE, bookingMode: 'phone', bookingVerifiedAt: '2026-08-04', concernSlugs: ['dark-circles', 'volume-loss'], relatedSlugs: ['prf'], _updatedAt: '2026-08-13T16:05:12Z',
  },
  {
    _id: 'service-sculpt-and-lift-facial', title: 'Radiance & Renewal Facial', slug: 'radiance-and-renewal-facial', kind: 'standalone', public: false, order: 200, collectionSlug: 'facials', providerId: 'provider-brandy', duration: '1 hour 15 minutes', bookingMode: 'direct', bookingUrl: 'https://houseofrose.glossgenius.com/book?service_token=1000f-26e5732c-ec4a-4c65-a0c8-75af7bd6d9b0', bookingVerifiedAt: '2026-08-25', _updatedAt: '2026-08-25T05:04:28Z',
  },
];

const recordBySlug = new Map(SERVICE_RECORDS.map((record) => [record.slug, record]));
const collectionBySlug = new Map(COLLECTION_RECORDS.map((collection) => [collection.slug, collection]));

const shallowService = (record: ServiceRecord): Service => ({
  _id: record._id,
  title: record.title,
  slug: record.slug,
  kind: record.kind,
  provider: record.providerId ? PROVIDERS[record.providerId] : undefined,
  providerScope: record.providerScope,
  duration: record.duration,
  bookingMode: record.bookingMode,
  bookingUrl: record.bookingUrl,
  bookingVerifiedAt: record.bookingVerifiedAt,
  gallery: record.gallery ? [...record.gallery] : undefined,
  evidenceMedia: record.evidenceMedia ? [...record.evidenceMedia] : undefined,
  researchReferences: record.researchReferences ? [...record.researchReferences] : undefined,
  _updatedAt: record._updatedAt,
});

const hydrateService = (record: ServiceRecord): Service => {
  const service = shallowService(record);
  const collection = collectionBySlug.get(record.collectionSlug);
  const parent = record.parentSlug ? recordBySlug.get(record.parentSlug) : undefined;
  const related = (record.relatedSlugs ?? [])
    .map((slug) => recordBySlug.get(slug))
    .filter((item): item is ServiceRecord => Boolean(item?.public))
    .map(shallowService);
  const contextual = SERVICE_RECORDS
    .filter((item) => item.public && item.slug !== record.slug && item.collectionSlug === record.collectionSlug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .slice(0, 6)
    .map(shallowService);

  return {
    ...service,
    parentService: parent?.public ? { title: parent.title, slug: parent.slug } : undefined,
    treatments: SERVICE_RECORDS
      .filter((item) => item.public && item.parentSlug === record.slug)
      .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
      .map(shallowService),
    concerns: (record.concernSlugs ?? []).flatMap((slug) => CONCERNS[slug] ? [CONCERNS[slug]] : []),
    collection: collection?.publicRoute ? { title: collection.title, slug: collection.slug } : undefined,
    relatedServices: related,
    contextualServices: contextual,
    costGuides: COST_GUIDES
      .filter((guide) => guide.serviceSlug === record.slug)
      .map(({ _id, title, slug }) => ({ _id, title, slug })),
    comparisons: COMPARISONS
      .filter((comparison) => comparison.serviceSlugs.includes(record.slug))
      .map(({ _id, slug }) => ({ _id, slug })),
    localAreas: LOCAL_AREAS
      .filter((area) => area.serviceSlugs.includes(record.slug))
      .map(({ _id, city, slug }) => ({ _id, city, slug })),
  };
};

/** The routes Astro generates. Non-public records stay available for reconciliation only. */
export const PUBLIC_SERVICES: readonly Service[] = SERVICE_RECORDS
  .filter((record) => record.public)
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
  .map(hydrateService);

export const PUBLIC_DIRECTORY_SERVICES: readonly Service[] = PUBLIC_SERVICES.filter(
  (service) => service.kind !== 'treatment',
);

export const ALL_LOCAL_SERVICE_RECORDS: readonly Pick<
  ServiceRecord,
  '_id' | 'title' | 'slug' | 'kind' | 'public' | '_updatedAt'
>[] = SERVICE_RECORDS;

export const SERVICE_OPTIONS = SERVICE_RECORDS.map(({ title, slug }) => ({ title, value: slug }));

export const getPublicServiceBySlug = (slug: string): Service | undefined =>
  PUBLIC_SERVICES.find((service) => service.slug === slug);

export const getPublicServiceRefs = (slugs: readonly string[]): Service[] =>
  slugs.flatMap((slug) => {
    const service = getPublicServiceBySlug(slug);
    return service ? [shallowService(recordBySlug.get(service.slug) as ServiceRecord)] : [];
  });

export const getPublicServicesForConcern = (concernSlug: string): Service[] =>
  PUBLIC_SERVICES.filter((service) => service.concerns?.some((concern) => concern.slug === concernSlug))
    .slice(0, 4);

export const getPublicCollections = (): ServiceCollection[] =>
  COLLECTION_RECORDS
    .filter((collection) => collection.publicRoute)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map((collection) => ({
      _id: collection._id,
      title: collection.title,
      slug: collection.slug,
      services: PUBLIC_DIRECTORY_SERVICES.filter((service) => {
        const record = recordBySlug.get(service.slug);
        return record?.collectionSlug === collection.slug;
      }),
    }));

export const getPublicCollectionBySlug = (slug: string): ServiceCollection | undefined =>
  getPublicCollections().find((collection) => collection.slug === slug);

export const getNavCollections = (): NavCollection[] =>
  getPublicCollections().map((collection) => ({
    ...collection,
    services: collection.services.map(({ _id, title, slug }) => ({ _id, title, slug })),
  }));

export const PUBLIC_SITEMAP_SERVICES: readonly SitemapService[] = PUBLIC_SERVICES.map((service) => ({
  _id: service._id,
  title: service.title,
  slug: service.slug,
  kind: service.kind,
  parentService: service.parentService,
  _updatedAt: service._updatedAt,
}));

export const LOCAL_SERVICE_RELATIONSHIPS = {
  costGuides: COST_GUIDES,
  comparisons: COMPARISONS,
  localAreas: LOCAL_AREAS,
  packageServices: {
    'face-reality-12-week-program': ['acne-bootcamp'],
  },
  blogServices: {
    'is-morpheus8-safe': 'morpheus8',
  },
} as const;

export const getCostGuideServiceSlug = (costGuideSlug: string): string | undefined =>
  COST_GUIDES.find((guide) => guide.slug === costGuideSlug)?.serviceSlug;

export const getComparisonServiceSlugs = (comparisonSlug: string): readonly string[] =>
  COMPARISONS.find((comparison) => comparison.slug === comparisonSlug)?.serviceSlugs ?? [];

export const getLocalAreaServiceSlugs = (areaSlug: string): readonly string[] =>
  LOCAL_AREAS.find((area) => area.slug === areaSlug)?.serviceSlugs ?? [];

export const getPackageServiceSlugs = (packageSlug: string): readonly string[] =>
  LOCAL_SERVICE_RELATIONSHIPS.packageServices[
    packageSlug as keyof typeof LOCAL_SERVICE_RELATIONSHIPS.packageServices
  ] ?? [];

export const getBlogServiceSlug = (blogSlug: string): string | undefined =>
  LOCAL_SERVICE_RELATIONSHIPS.blogServices[
    blogSlug as keyof typeof LOCAL_SERVICE_RELATIONSHIPS.blogServices
  ];
