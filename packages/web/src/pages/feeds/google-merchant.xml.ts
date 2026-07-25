import type { APIRoute } from 'astro';
import { sanityFetch } from '@/lib/sanity';
import { MERCHANT_PRODUCTS_QUERY, type Product } from '@/lib/queries';
import { toGoogleProduct } from '@/lib/googleProduct';

const escapeXml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const element = (name: string, value: string | undefined): string =>
  value ? `<g:${name}>${escapeXml(value)}</g:${name}>` : '';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() ?? 'https://houseofrosefl.com/';
  // MERCHANT_PRODUCTS_QUERY enforces merchantStatus == "eligible"; services have no path here.
  const products = await sanityFetch<Product[]>(MERCHANT_PRODUCTS_QUERY);
  const items = products.map((product) => toGoogleProduct(product, baseUrl));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>House of Rose Retail Products</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>Eligible physical retail products from House of Rose Aesthetics.</description>
    ${items.map((item) => `<item>
      ${element('id', item.id)}
      ${element('title', item.title)}
      ${element('description', item.description)}
      ${element('link', item.link)}
      ${element('image_link', item.imageLink)}
      ${item.additionalImageLinks.map((image) => element('additional_image_link', image)).join('\n')}
      ${element('availability', item.availability)}
      ${element('availability_date', item.availabilityDate)}
      ${element('price', item.price)}
      ${element('brand', item.brand)}
      ${element('gtin', item.gtin)}
      ${element('mpn', item.mpn)}
      ${element('identifier_exists', item.identifierExists ? 'yes' : 'no')}
      ${element('condition', item.condition)}
      ${element('product_type', item.productType)}
      ${element('google_product_category', item.googleProductCategory)}
      ${element('item_group_id', item.itemGroupId)}
      ${element('color', item.color)}
      ${element('size', item.size)}
      ${element('material', item.material)}
      ${element('shipping_weight', item.shippingWeight)}
      ${element('custom_label_0', item.customLabel0)}
      ${element('custom_label_1', item.customLabel1)}
      ${element('custom_label_2', item.customLabel2)}
      ${element('custom_label_3', item.customLabel3)}
      ${element('custom_label_4', item.customLabel4)}
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
};
