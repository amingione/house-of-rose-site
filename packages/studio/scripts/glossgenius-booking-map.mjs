export const BOOKING_VERIFIED_AT = '2026-08-04';
export const GLOSSGENIUS_BOOKING_BASE = 'https://houseofrose.glossgenius.com/book?service_token=';

const direct = (id, slug, externalName, token) => ({ id, slug, mode: 'direct', externalName, token });
const consultation = (id, slug, externalName, token) => ({ id, slug, mode: 'consultation', externalName, token });
const phone = (id, slug, note) => ({ id, slug, mode: 'phone', note });

/**
 * Conservative one-to-one reconciliation with the live GlossGenius catalog.
 * Missing and ambiguous listings intentionally resolve to phone rather than a
 * generic menu or merely similar service.
 */
export const GLOSSGENIUS_BOOKING_MAP = [
  consultation('52889a9f-ed52-410d-b78c-3d991c23ab24', 'acne-bootcamp', 'Acne Bootcamp Consultation', '1000f-4b775177-156d-4eef-9957-cf11c9d7bcdf'),
  direct('3cca74b8-9626-4ed7-aaab-3c31bcac8ad8', 'biorepeel', 'BioRePeel® Cl3 Rejuvenation', '1000f-7694890a-1554-4ddb-8d7e-587064960791'),
  phone('f651c9cc-5570-41cb-91fd-2f010ea18ce2', 'biorepeel-advanced-acne-scarring', 'No exact live listing.'),
  phone('ff20c655-afa0-4955-8548-d88552e960ea', 'biorepeel-body', 'No exact live listing.'),
  phone('52ac5d64-74cb-43fb-b67e-166fdb136a95', 'biorepeel-gold-spot-treatment', 'No exact live listing.'),
  consultation('46fb011c-6d0c-4667-83e4-81c7d87a3feb', 'dermal-fillers', 'Dermal Filler | Consultation', '1000f-4e97c315-226e-49bd-9e80-790109db8339'),
  direct('e8b38f03-900f-4ec5-9246-07cc1b65ed11', 'dermaplaning', 'Dermaplaning | Facial', '1000f-885f1677-f592-448c-a9de-31f9f4576822'),
  consultation('9d81bb43-e3ff-4244-a8be-58d3ffd9c475', 'ez-gel-bio-filler', 'PRF Bio-Filler | Consultation', '1000f-7844820f-4f7c-4986-b907-6f4600b43e92'),
  consultation('522cd772-c891-46b6-b3cf-2a24197264bc', 'face-reality-acne-program', 'Acne Bootcamp Consultation', '1000f-4b775177-156d-4eef-9957-cf11c9d7bcdf'),
  direct('service-facial-waxing', 'facial-waxing', 'Facial Waxing', '1000f-5e8fc55d-9118-49d2-8d24-2e05df90e851'),
  phone('service-forma-rf-facial', 'forma-rf-facial', 'Forma RF is not in the live GlossGenius catalog.'),
  consultation('6e204a23-77a2-48a9-8381-878974cb92e4', 'glp-1-weight-management', 'GLP-1 Consultation', '1000f-129199ce-d7c0-42f4-827f-7dcbdbd523dc'),
  direct('0e5554bd-f58d-4dbe-be0a-972ad9a27a0e', 'glo2facial', 'Glo2Facial | Oxygen Infusion', '1000f-9649fdf8-0e26-436e-aebf-c19b27addce4'),
  phone('service-glo2-prf', 'glo2facial-prf', 'No exact combination listing.'),
  phone('service-glo2-procell-md', 'glo2facial-procell-md', 'No exact combination listing.'),
  phone('service-glo2-procell-pro', 'glo2facial-procell-pro', 'No exact combination listing.'),
  phone('99566c9c-8033-4df6-b5a3-ac5de5d2d886', 'iv-hydration-therapy', 'The website page represents several distinct IV listings.'),
  phone('e82404a8-a778-4359-9a6d-71377ab903d3', 'injectables-bio-fillers', 'The website page represents several distinct consultation paths.'),
  consultation('service-lumecca-peak-ipl', 'lumecca-peak-ipl', 'Lumecca Peak IPL | Consultation', '1000f-de667c29-dbef-47e6-9022-418389aefa71'),
  consultation('f5308b9c-73df-4812-8c0d-afcf4ee5839a', 'microneedling', 'Procell Therapies | Consultation', '1000f-5b4391bb-3d43-40f3-910d-144cf0e46192'),
  consultation('service-morpheus8-body', 'morpheus8-body', 'Morpheous8 RF Body | Consultation', '1000f-bd506885-7ad3-4a15-ab5a-90a8bd082db4'),
  consultation('service-morpheus8', 'morpheus8', 'Morpheous8 RF | Consultation', '1000f-6156b30d-84a3-4d71-8d9d-6ee81fea44de'),
  phone('a4bc2059-2510-445b-ae7c-db9f4c3251e7', 'neck-decollete-extension', 'No exact live listing.'),
  consultation('7bd92dc1-9ced-42bd-a195-e9fa4628a848', 'injectables', 'Neuromodulator | Consultation', '1000f-b6105dd4-6519-4e8a-a986-f6313666f8ee'),
  consultation('e9842046-4d2c-448d-92fa-39cb4fff5b2d', 'prf-body-treatments', 'PRF Body Treatments | Consultation', '1000f-196da797-f093-4242-a5df-767d198f7a34'),
  phone('hor.service.prf-fibrin-veil', 'prf-fibrin-veil', 'No exact live listing.'),
  phone('adf66d59-5dcd-4f95-8282-681dafc97d89', 'prf-injections', 'The website page represents multiple distinct PRF injection consultations.'),
  phone('c3ffc30e-e13c-436e-b0c0-6aaeaeed2d6b', 'prf', 'The hub represents several distinct PRF services.'),
  consultation('302fe86d-4b15-4caa-93e5-b21d70da595e', 'microneedling-body', 'Procell Therapies | Consultation', '1000f-5b4391bb-3d43-40f3-910d-144cf0e46192'),
  consultation('818469ff-9dee-4939-ad55-54fb1ca4e184', 'prf-microneedling', 'PRF Microneedling | Consultation', '1000f-ad1f8f2c-7475-4776-b6d9-c8d5e9bff604'),
];

export const bookingUrlFor = (entry) =>
  entry.token ? `${GLOSSGENIUS_BOOKING_BASE}${entry.token}` : undefined;
