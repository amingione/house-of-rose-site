/**
 * Adds approved InMode evidence media and cosmetic-use research summaries to
 * the three published RF/IPL services. Assets are uploaded once by SHA-1 and
 * reused on later runs.
 *
 * Usage from the repository root:
 *   node packages/studio/scripts/add-inmode-evidence.mjs --validate
 *   node scripts/run-with-env.mjs node packages/studio/scripts/add-inmode-evidence.mjs --apply
 */

import { createHash } from 'node:crypto';
import { createReadStream, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const APPLY = process.argv.includes('--apply');
const VALIDATE = process.argv.includes('--validate') || !APPLY;
const IMAGE_DIRECTORY = fileURLToPath(new URL('../../web/public/images/inmode/', import.meta.url));

const imagePath = (filename) => join(IMAGE_DIRECTORY, filename);
const media = ({
  key,
  kind,
  filename,
  alt,
  title,
  caption,
  sourceCredit,
  consentConfirmed,
}) => ({
  _key: key,
  _type: 'object',
  kind,
  filename,
  alt,
  title,
  caption,
  sourceCredit,
  usageApproved: true,
  ...(typeof consentConfirmed === 'boolean' ? { consentConfirmed } : {}),
});

const research = ({
  key,
  title,
  journal,
  year,
  studyType,
  summary,
  limitations,
  url,
}) => ({
  _key: key,
  _type: 'object',
  title,
  journal,
  year,
  studyType,
  summary,
  limitations,
  url,
});

const services = [
  {
    documentId: 'service-morpheus8',
    slug: 'morpheus8',
    title: 'Morpheus8 RF Microneedling',
    evidenceMedia: [
      media({
        key: 'morpheus8-device',
        kind: 'device',
        filename: 'Morpheus8-Burst.png',
        alt: 'Morpheus8 Burst radiofrequency microneedling handpiece',
        title: 'Morpheus8 Burst Technology',
        caption:
          'The Morpheus8 handpiece combines microneedling with fractional bipolar radiofrequency.',
        sourceCredit: 'InMode manufacturer media',
      }),
    ],
    researchReferences: [],
  },
  {
    documentId: 'service-lumecca-peak-ipl',
    slug: 'lumecca-peak-ipl',
    title: 'Lumecca Peak IPL Photofacial',
    evidenceMedia: [
      media({
        key: 'lumecca-device',
        kind: 'device',
        filename: 'Lumecca-Peak.png',
        alt: 'Lumecca Peak intense pulsed light handpiece',
        title: 'Lumecca Peak IPL Technology',
        caption:
          'Lumecca Peak is an intense pulsed light device used for selected pigment and tone concerns.',
        sourceCredit: 'InMode manufacturer media',
      }),
    ],
    researchReferences: [
      research({
        key: 'lumecca-retrospective-2021',
        title: 'Retrospective Analysis of Outcomes with a Unique IPL System',
        journal: 'Journal of Cosmetics, Dermatological Sciences and Applications',
        year: 2021,
        studyType: 'Retrospective photographic analysis',
        summary:
          'The paper reviewed photographs from several clinics and reported visible improvement across selected pigment and texture concerns after treatment with a Lumecca IPL system.',
        limitations:
          'This was a retrospective review rather than a randomized controlled trial. It evaluated an earlier Lumecca system and should not be read as a direct trial of every current Lumecca Peak setting or as a promise of individual results.',
        url: 'https://doi.org/10.4236/jcdsa.2021.112012',
      }),
    ],
  },
  {
    documentId: 'service-forma-rf-facial',
    slug: 'forma-rf-facial',
    title: 'Forma RF Facial',
    fieldUpdates: {
      'faqs[_key=="areas"].answer':
        'Forma may be used on the face, cheeks, lower face, and neck. Available treatment areas are listed in the current services menu.',
    },
    evidenceMedia: [
      media({
        key: 'forma-device',
        kind: 'device',
        filename: 'Forma-handpiece-space.png',
        alt: 'Forma temperature-controlled radiofrequency facial handpiece',
        title: 'Forma Facial RF Technology',
        caption:
          'The Forma handpiece delivers radiofrequency while monitoring skin temperature in real time.',
        sourceCredit: 'InMode manufacturer media',
      }),
    ],
    researchReferences: [
      research({
        key: 'forma-split-face-2017',
        title:
          'Split-face histological and biochemical evaluation of temperature- and impedance-controlled continuous non-invasive radiofrequency',
        journal: 'Journal of Cosmetic and Laser Therapy',
        year: 2017,
        studyType: 'Small split-face tissue study',
        summary:
          'In this study, one side of the face received a series of Forma radiofrequency sessions. Tissue analysis found changes consistent with increased dermal collagen content and synthesis on the treated side.',
        limitations:
          'Only four participants were included and the protocol used eight weekly sessions. The tissue findings are informative but cannot predict the amount of visible change an individual client may experience.',
        url: 'https://doi.org/10.1080/14764172.2016.1262957',
      }),
    ],
  },
];

const excludedPublicFiles = [
  'Lumecca-Peak-Before-and-After.png',
  'Forma-and-Plus.png',
  'Forma-Before-and-After.png',
  'KhloeKardashian.png',
  'KimM8_ElleArticle2022.png',
  'EsmeMedspa_Morpheus8_BeforeAfter_4Treatments_Front-TM.jpg',
  'HO1_Forma_Website.jpg',
  'HO2_Forma_Website.jpg',
  'Morpheus8-Burst-Deep-Before-and-After-Buttocks.png',
  'NB_M8B_BeforeAfter_24Weeks_Abd_Zoomed-TM.jpg',
  'VogueMorpheus8.jpg',
  'Screenshot-2026-03-24-at-12.17.19-PM.png',
  'Screenshot-2026-03-24-at-12.24.04-PM.png',
];

const forbiddenCopy = [
  /\bclinically proven\b/i,
  /\breverse aging\b/i,
  /\bpain[- ]free\b/i,
  /\bguaranteed\b/i,
  /\bFDA[- ]approved\b/i,
  /\bForma Plus\b/i,
  /\bprovider name\b/i,
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validate() {
  const files = services.flatMap((service) => service.evidenceMedia.map((item) => item.filename));
  assert(new Set(files).size === files.length, 'Each source image must be assigned once.');

  for (const filename of files) {
    assert(!excludedPublicFiles.includes(filename), `${filename} is intentionally excluded from public use.`);
    assert(statSync(imagePath(filename)).isFile(), `Missing source image: ${filename}`);
  }

  for (const service of services) {
    assert(service.documentId.startsWith('service-'), `${service.title} needs a stable published service ID.`);
    assert(service.evidenceMedia.some((item) => item.kind === 'device'), `${service.title} needs an approved device image.`);

    for (const item of service.evidenceMedia) {
      assert(item.usageApproved === true, `${item.title} is missing public usage approval.`);
      assert(item.alt && item.caption && item.sourceCredit, `${item.title} is missing accessible source context.`);
      if (item.kind === 'before-after') {
        assert(item.consentConfirmed === true, `${item.title} is missing publication-consent confirmation.`);
        assert(/not a House of Rose client/i.test(item.caption), `${item.title} must identify external examples.`);
      }
    }

    for (const study of service.researchReferences) {
      assert(/^https:\/\/doi\.org\//.test(study.url), `${study.title} must link to its DOI.`);
      assert(study.studyType && study.limitations, `${study.title} needs study design and limitations.`);
    }
  }

  const publicCopy = JSON.stringify(services);
  for (const phrase of forbiddenCopy) {
    assert(!phrase.test(publicCopy), `Public-copy validation failed for ${phrase}.`);
  }

  assert(
    services.find((service) => service.documentId === 'service-morpheus8')?.researchReferences.length === 0,
    'The supplied hidradenitis study must not support the public cosmetic Morpheus8 page.',
  );

  const restrictedEvidence = JSON.stringify(
    services.filter((service) =>
      ['service-morpheus8', 'service-lumecca-peak-ipl', 'service-forma-rf-facial'].includes(
        service.documentId,
      ),
    ),
  );
  assert(
    !/\b(?:tighten(?:ing|s|ed)?|lift(?:ing|s|ed)?|laxity|firm(?:er|ing|ness)?|sagging|jowls?|contour(?:ing|s|ed)?|sculpt(?:ing|s|ed)?|facelift)\b/i.test(
      restrictedEvidence,
    ),
    'InMode evidence must not position Morpheus8, Lumecca, or Forma for restricted reshaping outcomes.',
  );
  assert(
    !/\b(?:vascular|vessels?|capillaries?|rosacea)\b/i.test(
      JSON.stringify(
        services.find((service) => service.documentId === 'service-lumecca-peak-ipl'),
      ),
    ),
    'Lumecca evidence must remain within the approved pigment, tone, and selected-texture lane.',
  );

  console.log(`Validated ${files.length} approved images and ${services.reduce((sum, service) => sum + service.researchReferences.length, 0)} cosmetic-use research references.`);
  console.log('Excluded combination-treatment, Forma Plus, disease-treatment, celebrity, and editorial assets.');
}

function resolveToken() {
  const envToken =
    process.env.SANITY_ACCESS_TOKEN ??
    process.env.SANITY_API_WRITE_TOKEN ??
    process.env.SANITY_AUTH_TOKEN ??
    process.env.SANITY_TOKEN;
  if (envToken) return envToken;

  for (const envPath of [join(process.cwd(), '.env.local'), join(process.cwd(), 'packages/web/.env.local')]) {
    try {
      const localEnv = readFileSync(envPath, 'utf8');
      for (const line of localEnv.split(/\r?\n/)) {
        const match = line.match(/^\s*(SANITY_ACCESS_TOKEN|SANITY_API_WRITE_TOKEN|SANITY_AUTH_TOKEN|SANITY_TOKEN)\s*=\s*(.*?)\s*$/);
        if (!match?.[2]) continue;
        const value = match[2].replace(/^(?:['"])(.*)(?:['"])$/, '$1');
        if (value) return value;
      }
    } catch {
      // Each repository-local environment file is optional.
    }
  }

  try {
    return JSON.parse(readFileSync(join(homedir(), '.config/sanity/config.json'), 'utf8')).authToken;
  } catch {
    return undefined;
  }
}

function sha1(filename) {
  return createHash('sha1').update(readFileSync(imagePath(filename))).digest('hex');
}

async function findOrUploadAsset(client, filename) {
  const hash = sha1(filename);
  const existingId = await client.fetch(
    '*[_type == "sanity.imageAsset" && sha1hash == $hash][0]._id',
    { hash },
  );
  if (existingId) {
    console.log(`Reusing ${filename}.`);
    return existingId;
  }

  const asset = await client.assets.upload('image', createReadStream(imagePath(filename)), {
    filename: basename(filename),
    title: `InMode service media — ${basename(filename)}`,
  });
  console.log(`Uploaded ${filename}.`);
  return asset._id;
}

async function apply() {
  const token = resolveToken();
  assert(token, 'No Sanity write token found. Set SANITY_ACCESS_TOKEN, SANITY_API_WRITE_TOKEN, SANITY_AUTH_TOKEN, or SANITY_TOKEN, or run `sanity login`.');

  const sanityClientModule = await import('@sanity/client');
  const createClient =
    sanityClientModule.createClient ??
    sanityClientModule.default?.createClient ??
    sanityClientModule.default;
  const client = createClient({
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? process.env.PUBLIC_SANITY_PROJECT_ID ?? '4e7axyi7',
    dataset: process.env.SANITY_STUDIO_DATASET ?? process.env.PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: process.env.SANITY_API_VERSION ?? process.env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
    token,
    useCdn: false,
  });

  const managedIds = services.flatMap((service) => [
    service.documentId,
    `drafts.${service.documentId}`,
  ]);
  const existingDocuments = await client.fetch(
    '*[_id in $ids]{_id, _type, title, "slug":slug.current, status}',
    { ids: managedIds },
  );
  const existingById = new Map(existingDocuments.map((document) => [document._id, document]));

  for (const service of services) {
    const published = existingById.get(service.documentId);
    assert(published?._type === 'service', `Published service is missing: ${service.documentId}`);
    assert(
      ['live', 'actual-menu'].includes(published.status),
      `${service.title} is not currently public.`,
    );
    assert(
      published.slug === service.slug,
      `${service.documentId} resolves to ${published.slug ?? 'no slug'}, not ${service.slug}.`,
    );
  }

  const assetIds = new Map();
  for (const service of services) {
    for (const item of service.evidenceMedia) {
      if (!assetIds.has(item.filename)) {
        assetIds.set(item.filename, await findOrUploadAsset(client, item.filename));
      }
    }
  }

  const transaction = client.transaction();
  for (const service of services) {
    const evidenceMedia = service.evidenceMedia.map(({ filename, alt, ...item }) => ({
      ...item,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetIds.get(filename),
        },
        alt,
      },
    }));
    const fields = {
      evidenceMedia,
      researchReferences: service.researchReferences,
      ...(service.fieldUpdates ?? {}),
    };

    transaction.patch(service.documentId, (patch) => patch.set(fields));
    const draftId = `drafts.${service.documentId}`;
    if (existingById.has(draftId)) {
      transaction.patch(draftId, (patch) => patch.set(fields));
    }
  }
  await transaction.commit();
  console.log('Updated the three published service documents and any matching drafts.');
}

try {
  validate();
  if (APPLY) await apply();
  if (VALIDATE && !APPLY) {
    console.log('Static validation complete. Run with --apply to upload and attach the approved media.');
  }
} catch (error) {
  console.error(`InMode evidence update failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
