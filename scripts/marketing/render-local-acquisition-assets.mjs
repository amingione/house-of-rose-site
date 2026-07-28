#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';

const outputFlag = process.argv.indexOf('--output');
if (outputFlag === -1 || !process.argv[outputFlag + 1]) {
  console.error('Usage: render-local-acquisition-assets.mjs --output /absolute/output/path');
  process.exit(2);
}

const outputRoot = path.resolve(process.argv[outputFlag + 1]);
const repositoryRoot = process.cwd();
const publicImages = path.join(repositoryRoot, 'packages/web/public/images');
const monogramPath = path.join(repositoryRoot, 'packages/web/public/logos/house-of-rose-monogram/hr-monogram-gold.png');
const tempRoot = mkdtempSync(path.join(tmpdir(), 'hor-q3-ad-render-'));

const concepts = [
  {
    number: 1,
    id: 'local-proof',
    title: 'Local Proof',
    kicker: 'HOUSE OF ROSE · PUNTA GORDA',
    headline: ['YOU’VE PASSED IT.', 'NOW COME INSIDE.'],
    subline: 'A private aesthetics and wellness studio. Walk-ins welcome.',
    cta: 'BEGIN WITH A SKIN CONSULTATION',
    source: 'hofr-med-spa2026-07-20 10:55:39 +0000_1.webp',
    destination: '/skin-analysis/',
    campaign: 'hor_skin_consult_q3',
    alignment: 'xMidYMid',
  },
  {
    number: 2,
    id: 'consultation',
    title: 'See Your Skin First',
    kicker: 'COMPLIMENTARY SKIN CONSULTATION',
    headline: ['SEE YOUR', 'SKIN FIRST.'],
    subline: 'A clearer starting point before choosing a treatment.',
    cta: 'BEGIN WITH CONTEXT',
    source: 'welcome-house-of-rose.webp',
    destination: '/skin-analysis/',
    campaign: 'hor_skin_consult_q3',
    alignment: 'xMidYMid',
  },
  {
    number: 3,
    id: 'studio-experience',
    title: 'Private Appointment',
    kicker: 'HOUSE OF ROSE AESTHETICS',
    headline: ['A PRIVATE APPOINTMENT.', 'A CLEAR PLAN.'],
    subline: 'Thoughtful care in an unhurried Punta Gorda studio.',
    cta: 'REQUEST A CONSULTATION',
    source: 'hofr-med-spa2026-07-20 10:55:39 +0000_4.webp',
    destination: '/skin-analysis/',
    campaign: 'hor_skin_consult_q3',
    alignment: 'xMidYMid',
  },
  {
    number: 4,
    id: 'advanced-skin',
    title: 'Skin Quality, Planned',
    kicker: 'Procell MICROCHANNELING · PUNTA GORDA',
    headline: ['SKIN QUALITY,', 'PLANNED.'],
    subline: 'Provider-selected advanced skin care, considered in context.',
    cta: 'EXPLORE MICROCHANNELING',
    source: 'Procell/ProcellTherapies-at-house-of-rose.webp',
    destination: '/services/microchanneling/',
    campaign: 'hor_advanced_skin_q3',
    alignment: 'xMidYMid',
  },
  {
    number: 5,
    id: 'injectables',
    title: 'Injectables, With Restraint',
    kicker: 'PROVIDER-LED INJECTABLES',
    headline: ['INJECTABLES,', 'WITH RESTRAINT.'],
    subline: 'Anatomy, candidacy and preferences guide the conversation.',
    cta: 'REQUEST A CONSULTATION',
    source: 'fillers-botox/botox-house-of-rose-aesthetics.webp',
    destination: '/services/injectables/',
    campaign: 'hor_injectables_q3',
    alignment: 'xMaxYMid',
  },
  {
    number: 6,
    id: 'provider-voice',
    title: 'Meet Diana, RN',
    kicker: 'DIANA, RN · HOUSE OF ROSE',
    headline: ['MEET THE PERSON', 'BEHIND THE PLAN.'],
    subline: 'A measured, consultation-first approach to injectables.',
    cta: 'MEET DIANA',
    source: 'providers/Diana.webp',
    destination: '/services/injectables/',
    campaign: 'hor_injectables_q3',
    alignment: 'xMidYMid',
  },
];

const metaFormats = [
  { name: 'feed', width: 1080, height: 1350 },
  { name: 'story', width: 1080, height: 1920 },
  { name: 'square', width: 1080, height: 1080 },
];

const googleFormats = [
  { name: 'landscape', width: 1200, height: 628 },
  { name: 'square', width: 1200, height: 1200 },
  { name: 'vertical', width: 900, height: 1600 },
];

const googleConcepts = new Set(['local-proof', 'consultation', 'advanced-skin', 'injectables']);

function ensureDirectory(directory) {
  mkdirSync(directory, { recursive: true });
}

function xml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function mimeFor(filename) {
  const extension = path.extname(filename).toLowerCase();
  if (extension === '.png') return 'image/png';
  if (extension === '.webp') return 'image/webp';
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  throw new Error(`Unsupported image type: ${filename}`);
}

function dataUri(filename) {
  return `data:${mimeFor(filename)};base64,${readFileSync(filename).toString('base64')}`;
}

const monogramData = dataUri(monogramPath);
const sourceCache = new Map();

function sourceData(concept) {
  const filename = path.join(publicImages, concept.source);
  if (!sourceCache.has(filename)) sourceCache.set(filename, dataUri(filename));
  return sourceCache.get(filename);
}

function squareDocument(width, height, inner) {
  const size = Math.max(width, height);
  const offsetX = (size - width) / 2;
  const offsetY = (size - height) / 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="transparent"/>
  <g transform="translate(${offsetX} ${offsetY})">
    <clipPath id="ad-crop"><rect width="${width}" height="${height}"/></clipPath>
    <g clip-path="url(#ad-crop)">${inner}</g>
  </g>
</svg>`;
}

function headlineMarkup(lines, x, startY, fontSize, lineHeight) {
  return lines
    .map((line, index) => `<text x="${x}" y="${startY + index * lineHeight}" fill="#F4ECDC" font-family="Cochin, Georgia, serif" font-size="${fontSize}" letter-spacing="0.5">${xml(line)}</text>`)
    .join('\n');
}

function metaSvg(concept, format) {
  const { width, height } = format;
  const story = height / width > 1.55;
  const square = width === height;
  const panelHeight = Math.round(height * (story ? 0.42 : square ? 0.48 : 0.43));
  const panelY = height - panelHeight;
  const margin = 72;
  const kickerY = panelY + 58;
  const baseHeadlineSize = story ? 78 : square ? 62 : 69;
  const longestHeadline = Math.max(...concept.headline.map((line) => line.length));
  const widthSafeHeadlineSize = Math.floor((width - margin * 2) / (longestHeadline * 0.62));
  const headlineSize = Math.min(baseHeadlineSize, widthSafeHeadlineSize);
  const lineHeight = Math.round(headlineSize * 0.88);
  const headlineY = kickerY + 94;
  const sublineY = headlineY + lineHeight * concept.headline.length + 34;
  const buttonHeight = 50;
  const buttonY = height - 96;
  const approximateButtonWidth = Math.min(width - margin * 2, 70 + concept.cta.length * 10.2);
  const image = sourceData(concept);
  const content = `
    <rect width="${width}" height="${height}" fill="#14110F"/>
    <image x="0" y="0" width="${width}" height="${height}" preserveAspectRatio="${concept.alignment} slice" href="${image}" xlink:href="${image}"/>
    <rect x="0" y="${panelY}" width="${width}" height="${panelHeight}" fill="#050403" fill-opacity="${story ? 0.75 : 0.71}"/>
    <rect x="0" y="${panelY}" width="${width}" height="3" fill="#C9A24B"/>
    <image x="${margin}" y="${margin}" width="64" height="64" preserveAspectRatio="xMidYMid meet" href="${monogramData}" xlink:href="${monogramData}"/>
    <text x="${margin}" y="${kickerY}" fill="#C9A24B" font-family="Avenir Next, Helvetica, sans-serif" font-size="16" font-weight="600" letter-spacing="3">${xml(concept.kicker)}</text>
    ${headlineMarkup(concept.headline, margin, headlineY, headlineSize, lineHeight)}
    <text x="${margin}" y="${sublineY}" fill="#D8CFC0" font-family="Avenir Next, Helvetica, sans-serif" font-size="22">${xml(concept.subline)}</text>
    <rect x="${margin}" y="${buttonY}" width="${approximateButtonWidth}" height="${buttonHeight}" rx="2" fill="#C9A24B"/>
    <text x="${margin + 22}" y="${buttonY + 32}" fill="#14110F" font-family="Avenir Next, Helvetica, sans-serif" font-size="15" font-weight="700" letter-spacing="2">${xml(concept.cta)}</text>
  `;
  return squareDocument(width, height, content);
}

function googleSvg(concept, format) {
  const image = sourceData(concept);
  const content = `
    <rect width="${format.width}" height="${format.height}" fill="#14110F"/>
    <image x="0" y="0" width="${format.width}" height="${format.height}" preserveAspectRatio="${concept.alignment} slice" href="${image}" xlink:href="${image}"/>
  `;
  return squareDocument(format.width, format.height, content);
}

function render(svg, finalPath, width, height, outputKind) {
  const base = path.basename(finalPath).replace(/\.(png|jpg)$/i, '');
  const svgPath = path.join(tempRoot, `${base}.svg`);
  writeFileSync(svgPath, svg, 'utf8');
  const size = Math.max(width, height);
  execFileSync('/usr/bin/qlmanage', ['-t', '-s', String(size), '-o', tempRoot, svgPath], { stdio: 'ignore' });
  const thumbnail = `${svgPath}.png`;
  const cropped = path.join(tempRoot, `${base}-crop.png`);
  execFileSync('/usr/bin/sips', ['-c', String(height), String(width), thumbnail, '--out', cropped], { stdio: 'ignore' });
  if (outputKind === 'jpeg') {
    execFileSync('/usr/bin/sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '92', cropped, '--out', finalPath], { stdio: 'ignore' });
  } else {
    execFileSync('/usr/bin/sips', ['-s', 'format', 'png', cropped, '--out', finalPath], { stdio: 'ignore' });
  }
}

function csv(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

ensureDirectory(outputRoot);
const metaDirectory = path.join(outputRoot, 'meta');
const googleDirectory = path.join(outputRoot, 'google');
const reviewDirectory = path.join(outputRoot, 'review');
ensureDirectory(metaDirectory);
ensureDirectory(googleDirectory);
ensureDirectory(reviewDirectory);

const manifest = [];
const reviewItems = [];

try {
  for (const concept of concepts) {
    const prefix = String(concept.number).padStart(2, '0');
    for (const format of metaFormats) {
      const filename = `${prefix}-${concept.id}-${format.name}-${format.width}x${format.height}.png`;
      render(metaSvg(concept, format), path.join(metaDirectory, filename), format.width, format.height, 'png');
      const contentId = `${prefix}_${concept.id}_${format.name}`;
      manifest.push({
        filename: `meta/${filename}`,
        platform: 'meta',
        conceptId: concept.id,
        format: format.name,
        width: format.width,
        height: format.height,
        source: concept.source,
        overlayCopy: `${concept.kicker} | ${concept.headline.join(' ')} | ${concept.subline} | ${concept.cta}`,
        destination: concept.destination,
        campaign: concept.campaign,
        contentId,
      });
      if (format.name === 'feed') {
        reviewItems.push({
          id: concept.id,
          index: concept.number,
          title: concept.title,
          label: concept.title,
          src: `../meta/${filename}`,
          href: `../meta/${filename}`,
          routeName: concept.id,
          prompt: 'Real-photo, source-preserved House of Rose ad route. No synthetic people, results, or invented claims.',
        });
      }
    }

    if (googleConcepts.has(concept.id)) {
      for (const format of googleFormats) {
        const filename = `${prefix}-${concept.id}-${format.name}-${format.width}x${format.height}.jpg`;
        render(googleSvg(concept, format), path.join(googleDirectory, filename), format.width, format.height, 'jpeg');
        manifest.push({
          filename: `google/${filename}`,
          platform: 'google',
          conceptId: concept.id,
          format: format.name,
          width: format.width,
          height: format.height,
          source: concept.source,
          overlayCopy: '',
          destination: concept.destination,
          campaign: concept.campaign,
          contentId: `${prefix}_${concept.id}_${format.name}`,
        });
      }
    }
  }

  const headers = ['filename', 'platform', 'concept_id', 'format', 'width', 'height', 'source', 'overlay_copy', 'destination', 'utm_campaign', 'utm_content'];
  const rows = manifest.map((item) => [
    item.filename,
    item.platform,
    item.conceptId,
    item.format,
    item.width,
    item.height,
    item.source,
    item.overlayCopy,
    item.destination,
    item.campaign,
    item.contentId,
  ].map(csv).join(','));
  writeFileSync(path.join(outputRoot, 'platform-manifest.csv'), `${headers.join(',')}\n${rows.join('\n')}\n`, 'utf8');

  const provenance = {
    campaign: 'House of Rose Q3 Local Client Acquisition',
    createdAt: new Date().toISOString(),
    brand: {
      name: 'House of Rose Aesthetics',
      address: '525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950',
      phone: '(844) 941-7673',
    },
    productionMethod: 'Deterministic SVG composition rendered by macOS Quick Look. No generative image model was used.',
    sourcePreservation: 'Studio architecture, provider identity, product packaging, labels, and visible brand details were not synthesized or replaced.',
    beforeAfterPolicy: 'The supplied Glo2Facial before/after image is excluded from paid exports pending written consent and placement review.',
    items: concepts.map((concept) => ({
      id: concept.id,
      source: path.join(publicImages, concept.source),
      destination: concept.destination,
      campaign: concept.campaign,
    })),
  };
  writeFileSync(path.join(outputRoot, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');
  writeFileSync(path.join(reviewDirectory, 'review-manifest.json'), `${JSON.stringify(reviewItems, null, 2)}\n`, 'utf8');
  console.log(`Rendered ${manifest.length} static assets to ${outputRoot}`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
