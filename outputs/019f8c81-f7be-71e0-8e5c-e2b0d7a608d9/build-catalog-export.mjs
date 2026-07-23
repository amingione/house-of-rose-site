import fs from 'node:fs/promises';
import path from 'node:path';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const sourcePath = '/tmp/house_of_rose_sanity_catalog.json';
const outputDir = process.cwd();
const csvPath = path.join(outputDir, 'house-of-rose-products-and-services.csv');
const qaWorkbookPath = path.join(outputDir, 'house-of-rose-products-and-services-qa.xlsx');
const previewPath = path.join(outputDir, 'house-of-rose-products-and-services-preview.png');

const payload = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
if (!Array.isArray(payload.result)) {
  throw new Error('Sanity export did not contain a result array.');
}

const headers = [
  'record_type',
  'sanity_id',
  'title',
  'slug',
  'status',
  'kind',
  'collection',
  'collection_slug',
  'parent_service',
  'parent_service_slug',
  'provider',
  'provider_role',
  'service_category',
  'pricing_model',
  'pricing_model_note',
  'service_price',
  'rack_price',
  'product_price_cents',
  'product_price_usd',
  'duration',
  'brand',
  'product_category',
  'size',
  'in_stock',
  'shippable',
  'weight_lb',
  'featured',
  'badge',
  'tagline',
  'description',
  'who_its_for',
  'process',
  'pricing_notes',
  'competitor_pricing',
  'booking_url',
  'purchase_url',
  'cta_label',
  'concerns',
  'related_services',
  'faqs',
  'image_url',
  'image_alt',
  'gallery',
  'seo_meta_title',
  'seo_meta_description',
  'order_rank',
  'created_at',
  'updated_at',
  'revision',
  'source_dataset',
  'source_transaction_id',
];

const compact = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    const normalized = value.replace(/\r\n?/g, '\n').trim();
    return /^[=+\-@]/.test(normalized) ? `'${normalized}` : normalized;
  }
  return value;
};

const joinText = (values) => Array.isArray(values)
  ? values.map(compact).filter((value) => value !== '').join(' | ')
  : '';

const faqText = (faqs) => Array.isArray(faqs)
  ? faqs
      .map((faq) => {
        const question = compact(faq?.question);
        const answer = compact(faq?.answer);
        return question || answer ? `Q: ${question}\nA: ${answer}` : '';
      })
      .filter(Boolean)
      .join('\n\n')
  : '';

const galleryText = (items) => Array.isArray(items)
  ? items
      .map((item) => [compact(item?.url), compact(item?.alt)].filter(Boolean).join(' — '))
      .filter(Boolean)
      .join(' | ')
  : '';

const rows = payload.result
  .map((doc) => {
    const isProduct = doc._type === 'product';
    const productPriceCents = isProduct && typeof doc.price === 'number' ? doc.price : '';
    const productPriceUsd = productPriceCents === '' ? '' : productPriceCents / 100;
    return [
      isProduct ? 'Product' : 'Service',
      compact(doc._id),
      compact(doc.title),
      compact(doc.slug),
      compact(doc.status),
      compact(doc.kind),
      compact(doc.collectionTitle),
      compact(doc.collectionSlug),
      compact(doc.parentServiceTitle),
      compact(doc.parentServiceSlug),
      compact(doc.providerName),
      compact(doc.providerRole),
      isProduct ? '' : compact(doc.category),
      compact(doc.pricingModel),
      compact(doc.pricingModel_note),
      isProduct ? '' : compact(doc.price),
      compact(doc.rackPrice),
      productPriceCents,
      productPriceUsd,
      compact(doc.duration),
      compact(doc.brand),
      isProduct ? compact(doc.category) : '',
      compact(doc.size),
      typeof doc.inStock === 'boolean' ? doc.inStock : '',
      typeof doc.shippable === 'boolean' ? doc.shippable : '',
      typeof doc.weightLb === 'number' ? doc.weightLb : '',
      typeof doc.isFeatured === 'boolean' ? doc.isFeatured : '',
      compact(doc.badge),
      compact(doc.tagline),
      compact(doc.description),
      compact(doc.whoItsFor),
      joinText(doc.process),
      compact(doc.pricingNotes),
      compact(doc.competitorPricing),
      compact(doc.bookingUrl),
      compact(doc.purchaseUrl),
      compact(doc.ctaLabel),
      joinText(doc.concernTitles),
      joinText(doc.relatedServiceTitles),
      faqText(doc.faqs),
      compact(doc.imageUrl),
      compact(doc.imageAlt),
      galleryText(doc.galleryItems),
      compact(doc.seoMetaTitle),
      compact(doc.seoMetaDescription),
      typeof doc.orderRank === 'number' ? doc.orderRank : '',
      compact(doc._createdAt),
      compact(doc._updatedAt),
      compact(doc._rev),
      'production',
      compact(payload.transactionId),
    ];
  })
  .sort((a, b) => a[0].localeCompare(b[0]) || String(a[2]).localeCompare(String(b[2])));

const csvEscape = (value) => {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
};

const csvText = [headers, ...rows]
  .map((row) => row.map(csvEscape).join(','))
  .join('\r\n') + '\r\n';

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(csvPath, `\uFEFF${csvText}`, 'utf8');

// Validate the exact CSV content through the spreadsheet artifact runtime.
const workbook = await Workbook.fromCSV(csvText, { sheetName: 'Catalog Export' });
const sheet = workbook.worksheets.getItem('Catalog Export');
sheet.freezePanes.freezeRows(1);
sheet.showGridLines = false;
const used = sheet.getUsedRange();
used.format.font = { name: 'Aptos', size: 10, color: '#2B2522' };
sheet.getRange(`A1:${columnName(headers.length)}1`).format = {
  fill: '#6A1830',
  font: { name: 'Aptos', size: 10, bold: true, color: '#FFFFFF' },
  wrapText: true,
  rowHeight: 32,
  borders: { preset: 'inside', style: 'thin', color: '#D9C6CC' },
};
sheet.getRange(`A2:${columnName(headers.length)}${rows.length + 1}`).format.borders = {
  insideHorizontal: { style: 'thin', color: '#E8E1DD' },
};
sheet.getRange('A:A').format.columnWidth = 13;
sheet.getRange('B:B').format.columnWidth = 35;
sheet.getRange('C:C').format.columnWidth = 34;
sheet.getRange('D:F').format.columnWidth = 19;
sheet.getRange('G:O').format.columnWidth = 22;
sheet.getRange('P:S').format.columnWidth = 18;
sheet.getRange('T:AC').format.columnWidth = 19;
sheet.getRange('AD:AO').format.columnWidth = 32;
sheet.getRange('AP:AY').format.columnWidth = 24;
sheet.getRange('AQ:AS').format.columnWidth = 42;
sheet.getRange('R:S').format.numberFormat = '0.00';

const inspection = await workbook.inspect({
  kind: 'table',
  range: `Catalog Export!A1:L12`,
  include: 'values,formulas',
  tableMaxRows: 12,
  tableMaxCols: 12,
  maxChars: 8000,
});

const errors = await workbook.inspect({
  kind: 'match',
  searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A',
  options: { useRegex: true, maxResults: 100 },
  summary: 'final formula error scan',
});

const preview = await workbook.render({
  sheetName: 'Catalog Export',
  range: 'A1:L18',
  scale: 1,
  format: 'png',
});
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const xlsx = await SpreadsheetFile.exportXlsx(workbook);
await xlsx.save(qaWorkbookPath);

const counts = rows.reduce((acc, row) => {
  acc[row[0]] = (acc[row[0]] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({
  csvPath,
  rowCount: rows.length,
  columnCount: headers.length,
  counts,
  inspection: inspection.ndjson,
  errors: errors.ndjson,
  previewPath,
  qaWorkbookPath,
}, null, 2));

function columnName(number) {
  let value = number;
  let name = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}
