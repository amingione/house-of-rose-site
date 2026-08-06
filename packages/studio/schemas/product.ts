import { defineField, defineType } from 'sanity';

const GTIN_LENGTHS = new Set([8, 12, 13, 14]);

/** GS1 check-digit validation for GTIN-8/12/13/14. */
const isValidGtin = (value: string): boolean => {
  if (!/^\d+$/.test(value) || !GTIN_LENGTHS.has(value.length)) return false;
  const digits = [...value].map(Number);
  const checkDigit = digits.pop();
  if (checkDigit === undefined) return false;
  const sum = digits
    .reverse()
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === checkDigit;
};

/**
 * Retail product (skincare, candles, gift cards, etc.)
 * Sanity is the single source of truth — no Medusa, no external commerce.
 * For booking/purchasing, link out to a booking URL or email.
 */
export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'brand',
      title: 'Brand (Legacy)',
      type: 'string',
      options: {
        list: [
          { title: 'Procell Therapies', value: 'procell' },
          { title: 'GlyMed+', value: 'glymed' },
          { title: 'Skin Script', value: 'skin-script' },
          { title: 'Face Reality', value: 'face-reality' },
          { title: 'House of Rose', value: 'house-of-rose' },
        ],
      },
      description: 'Legacy key retained during migration. New integrations use Brand Reference.',
      readOnly: true,
    }),
    defineField({
      name: 'brandRef',
      title: 'Brand Reference',
      type: 'reference',
      to: [{ type: 'shopBrand' }],
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as {
            merchantStatus?: string;
            brand?: string;
          } | undefined;
          return document?.merchantStatus === 'eligible' && !value && !document.brand
            ? 'Merchant-eligible products require a canonical brand reference or verified legacy brand.'
            : true;
        }),
    }),
    defineField({
      name: 'sku',
      title: 'Immutable SKU',
      type: 'string',
      description: 'Stable key used as Sanity SKU, Merchant id, GA4 item_id, and order-line SKU.',
      readOnly: ({ document }) => Boolean(document?._createdAt && document?.sku),
      validation: (R) =>
        R.regex(/^[A-Z0-9][A-Z0-9._-]{2,49}$/, {
          name: 'SKU',
          invert: false,
        }).custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && !value
            ? 'Merchant-eligible products require an SKU.'
            : true;
        }),
    }),
    defineField({
      name: 'gtin',
      title: 'GTIN / UPC',
      type: 'string',
      description: 'Verified manufacturer identifier only. Never invent.',
      validation: (R) =>
        R.custom((value, context) => {
          if (!value) return true;
          const document = context.document as { merchantStatus?: string } | undefined;
          const message = 'GTIN must be a valid 8, 12, 13, or 14 digit GS1 number with a correct check digit.';
          return isValidGtin(value) || document?.merchantStatus !== 'eligible' ? true : message;
        }),
    }),
    defineField({
      name: 'mpn',
      title: 'Manufacturer Part Number',
      type: 'string',
      description: 'Verified manufacturer part number only.',
    }),
    defineField({
      name: 'identifierExists',
      title: 'Manufacturer Identifier Exists',
      type: 'boolean',
      description: 'Turn off only after confirming the manufacturer supplies neither a GTIN nor an MPN.',
      initialValue: true,
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as {
            merchantStatus?: string;
            gtin?: string;
            mpn?: string;
          } | undefined;
          if (document?.merchantStatus !== 'eligible') return true;
          if (typeof value !== 'boolean') {
            return 'Merchant-eligible products require an explicit identifier decision.';
          }
          if (value && !document.gtin && !document.mpn) {
            return 'Provide a verified GTIN or MPN, or confirm no manufacturer identifier exists.';
          }
          if (value === false && (document.gtin || document.mpn)) {
            return 'Remove GTIN/MPN before declaring that no manufacturer identifier exists.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'size',
      title: 'Size (Legacy Display)',
      type: 'string',
      description: 'e.g. "30ml", "6.75 oz", "Set of 5 pairs"',
    }),
    defineField({
      name: 'netContent',
      title: 'Net Content',
      type: 'object',
      fields: [
        defineField({ name: 'value', title: 'Value', type: 'number', validation: (R) => R.positive() }),
        defineField({
          name: 'unit',
          title: 'Unit',
          type: 'string',
          options: {
            list: [
              { title: 'Fluid ounces', value: 'fl-oz' },
              { title: 'Ounces', value: 'oz' },
              { title: 'Milliliters', value: 'ml' },
              { title: 'Grams', value: 'g' },
              { title: 'Count', value: 'ct' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'price',
      title: 'Price (cents)',
      type: 'number',
      description: 'Store in cents, e.g. 4500 = $45.00',
      validation: (R) =>
        R.min(0).custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && (typeof value !== 'number' || value <= 0)
            ? 'Merchant-eligible products require a positive live price.'
            : true;
        }),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && !value
            ? 'Merchant-eligible products require a primary image.'
            : true;
        }),
    }),
    defineField({
      name: 'additionalImages',
      title: 'Additional Merchant Images',
      type: 'array',
      validation: (R) => R.max(10),
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', title: 'Alt Text', type: 'string' })],
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Skincare', value: 'skincare' },
          { title: 'Candles & Aromatherapy', value: 'candles' },
          { title: 'Gift Cards', value: 'gift-cards' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock (Legacy)',
      type: 'boolean',
      initialValue: true,
      readOnly: true,
    }),
    defineField({
      name: 'inventoryQuantity',
      title: 'Inventory Quantity',
      type: 'number',
      description: 'Authoritative sellable quantity. Checkout verifies this before payment.',
      validation: (R) =>
        R.integer().min(0).custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && typeof value !== 'number'
            ? 'Add inventory quantity so checkout stock can be reconciled; Google only requires availability.'
            : true;
        }).warning(),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'string',
      options: {
        list: [
          { title: 'In stock', value: 'in_stock' },
          { title: 'Out of stock', value: 'out_of_stock' },
          { title: 'Preorder', value: 'preorder' },
          { title: 'Backorder', value: 'backorder' },
        ],
      },
      initialValue: 'out_of_stock',
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && !value
            ? 'Merchant-eligible products require availability.'
            : true;
        }),
    }),
    defineField({
      name: 'availabilityDate',
      title: 'Availability Date',
      type: 'datetime',
      hidden: ({ parent }) => !['preorder', 'backorder'].includes(parent?.availability),
    }),
    defineField({
      name: 'purchaseUrl',
      title: 'Purchase / Booking URL',
      type: 'url',
      description: 'External link (booking system, Square, etc.) if not selling directly through the site',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Shop Button Text',
      type: 'string',
      description:
        'Custom copy for this product\'s shop button, e.g. "Shop the Set", "Add to Routine", "Restock Now". ' +
        'Never reference the checkout platform by name — clients don\'t need to know. Leave blank to use a ' +
        'category-appropriate default.',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional ribbon/tag on the product card — free text, e.g. "Bestseller", "New", "Back in Stock", "Limited". Leave blank for none.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured (Top Sellers)',
      type: 'boolean',
      description: 'Show this product in the Top Sellers rail on the shop page.',
      initialValue: false,
    }),

    // ── Checkout & fulfillment (see docs/CHECKOUT.md) ──────────────────────
    // `price` above is the source of truth for what a client is charged. The
    // checkout functions re-read it from Sanity server-side on every request —
    // a browser can never dictate an amount. There is deliberately no Stripe
    // Product/Price mirror to drift out of sync.
    defineField({
      name: 'shippable',
      title: 'Can Be Shipped',
      type: 'boolean',
      description:
        'Off for in-studio-only items (gift cards redeemed in person, treatment add-ons). ' +
        'Un-shippable items can still be bought — the cart just skips shipping for them.',
      initialValue: true,
    }),
    defineField({
      name: 'weightLb',
      title: 'Retail Item Shipping Weight (lb)',
      type: 'number',
      description:
        'Verified retail-item weight in POUNDS, including its bottle/tube and retail packaging. ' +
        'Checkout adds the outbound box and packing material separately. Use a physical measurement ' +
        'or an exact manufacturer shipping-weight record; never convert net contents into a guess.',
      validation: (R) =>
        R.min(0.01).max(70).custom((value, context) => {
          const document = context.document as {
            merchantStatus?: string;
            shippable?: boolean;
          } | undefined;
          return (
            document?.merchantStatus === 'eligible' &&
            document.shippable !== false &&
            typeof value !== 'number'
          )
            ? 'Shippable Merchant products require a shipping weight.'
            : true;
        }),
      hidden: ({ parent }) => parent?.shippable === false,
    }),
    defineField({
      name: 'shippingWeightEvidence',
      title: 'Shipping Weight Evidence',
      type: 'object',
      description:
        'Audit trail for the retail-item shipping weight. Manufacturer commerce data and a physical ' +
        'measurement are acceptable; net-content math is not.',
      hidden: ({ parent }) => parent?.shippable === false || typeof parent?.weightLb !== 'number',
      fields: [
        defineField({
          name: 'sourceType',
          title: 'Source Type',
          type: 'string',
          options: {
            list: [
              { title: 'Physically measured retail item', value: 'measured-retail-item' },
              {
                title: 'Official manufacturer commerce data',
                value: 'official-manufacturer-commerce-data',
              },
              {
                title: 'Verified distributor specification',
                value: 'verified-distributor-specification',
              },
            ],
          },
          validation: (R) => R.required(),
        }),
        defineField({
          name: 'sourceUrl',
          title: 'Human-Readable Source URL',
          type: 'url',
          validation: (R) => R.required(),
        }),
        defineField({
          name: 'sourceDataUrl',
          title: 'Source Data URL',
          type: 'url',
          description: 'API/feed URL used to verify the value, when different from the product page.',
        }),
        defineField({
          name: 'manufacturerSku',
          title: 'Matched Manufacturer SKU',
          type: 'string',
          description: 'Exact manufacturer-assigned SKU used to match this product and size.',
        }),
        defineField({
          name: 'sourceValue',
          title: 'Source Weight Value',
          type: 'number',
          validation: (R) => R.required().positive(),
        }),
        defineField({
          name: 'sourceUnit',
          title: 'Source Weight Unit',
          type: 'string',
          options: {
            list: [
              { title: 'Pounds', value: 'lb' },
              { title: 'Grams', value: 'g' },
              { title: 'Ounces', value: 'oz' },
            ],
          },
          validation: (R) => R.required(),
        }),
        defineField({
          name: 'verifiedAt',
          title: 'Verified At',
          type: 'datetime',
          validation: (R) => R.required(),
        }),
        defineField({
          name: 'matchBasis',
          title: 'Match Basis',
          type: 'string',
        }),
        defineField({
          name: 'note',
          title: 'Evidence Note',
          type: 'text',
          rows: 2,
        }),
      ],
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as {
            merchantStatus?: string;
            shippable?: boolean;
            weightLb?: number;
          } | undefined;
          return (
            document?.merchantStatus === 'eligible' &&
            document.shippable !== false &&
            typeof document.weightLb === 'number' &&
            !value
          )
            ? 'Merchant-eligible products require shipping-weight evidence.'
            : true;
        }),
    }),
    defineField({
      name: 'stripeTaxCode',
      title: 'Stripe Tax Code',
      type: 'string',
      description: 'Optional product-specific Stripe Tax code. Account default is used when blank.',
    }),
    defineField({
      name: 'condition',
      title: 'Condition',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Refurbished', value: 'refurbished' },
          { title: 'Used', value: 'used' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'variantGroupId',
      title: 'Variant Group ID',
      type: 'string',
      description: 'Shared immutable key for true variants only.',
    }),
    defineField({
      name: 'variantAttributes',
      title: 'Variant Attributes',
      type: 'object',
      fields: [
        defineField({ name: 'color', title: 'Color', type: 'string' }),
        defineField({ name: 'size', title: 'Structured Size', type: 'string' }),
        defineField({ name: 'scent', title: 'Scent', type: 'string' }),
        defineField({ name: 'material', title: 'Material', type: 'string' }),
      ],
    }),
    defineField({
      name: 'merchantStatus',
      title: 'Google Merchant Status',
      type: 'string',
      options: {
        list: [
          { title: 'Eligible', value: 'eligible' },
          { title: 'Incomplete Data', value: 'incomplete' },
          { title: 'Excluded', value: 'excluded' },
        ],
      },
      initialValue: 'incomplete',
    }),
    defineField({
      name: 'exclusionReason',
      title: 'Merchant Exclusion / Missing-Data Reason',
      type: 'string',
      hidden: ({ parent }) => parent?.merchantStatus === 'eligible',
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus !== 'eligible' && !value
            ? 'Record the missing product data or the reason this product is excluded.'
            : true;
        }),
    }),
    defineField({
      name: 'policyClass',
      title: 'Google Product Classification',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Retail', value: 'standard-retail' },
          { title: 'OTC / Acne Product', value: 'otc-product' },
          { title: 'SPF Product', value: 'spf-product' },
          { title: 'CBD — Prohibited', value: 'cbd-prohibited' },
          { title: 'Gift Card / Service-like', value: 'service-like' },
          { title: 'Other', value: 'other' },
        ],
      },
      initialValue: 'other',
    }),
    defineField({
      name: 'merchantDestinations',
      title: 'Merchant Destinations',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Free Listings', value: 'free-listings' },
          { title: 'Shopping Ads', value: 'shopping-ads' },
        ],
      },
      initialValue: ['free-listings', 'shopping-ads'],
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && (!Array.isArray(value) || value.length === 0)
            ? 'Choose at least one Merchant destination.'
            : true;
        }),
    }),
    defineField({
      name: 'productTypePath',
      title: 'Google Product Type Path',
      type: 'string',
      description: 'House of Rose hierarchy, e.g. Beauty & Personal Care > Skincare > Cleansers.',
      validation: (R) =>
        R.custom((value, context) => {
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && !value
            ? 'Recommended: add a product-type hierarchy for campaign reporting.'
            : true;
        }).warning(),
    }),
    defineField({
      name: 'googleProductCategoryId',
      title: 'Google Product Category ID',
      type: 'string',
      description: 'Reviewed numeric Google taxonomy ID.',
      validation: (R) =>
        R.custom((value, context) => {
          if (value && !/^\d+$/.test(value)) return 'Use the numeric Google taxonomy ID only.';
          const document = context.document as { merchantStatus?: string } | undefined;
          return document?.merchantStatus === 'eligible' && !value
            ? 'Recommended: add a reviewed Google product category ID.'
            : true;
        }).warning(),
    }),
    defineField({
      name: 'campaignTier',
      title: 'Campaign Tier (custom_label_0)',
      type: 'string',
      options: {
        list: [
          { title: 'Hero', value: 'hero' },
          { title: 'Core', value: 'core' },
          { title: 'Long Tail', value: 'long-tail' },
        ],
      },
    }),
    defineField({
      name: 'retailCategory',
      title: 'Retail Category (custom_label_2)',
      type: 'string',
    }),
    defineField({
      name: 'priceBand',
      title: 'Price Band (custom_label_3)',
      type: 'string',
      options: {
        list: [
          { title: 'Under $25', value: 'under-25' },
          { title: '$25–$49', value: '25-49' },
          { title: '$50–$99', value: '50-99' },
          { title: '$100+', value: '100-plus' },
        ],
      },
    }),
    defineField({
      name: 'replenishmentClass',
      title: 'Replenishment Class (custom_label_4)',
      type: 'string',
      options: {
        list: [
          { title: 'Replenishment', value: 'replenishment' },
          { title: 'Occasional', value: 'occasional' },
          { title: 'Gift / Seasonal', value: 'gift-seasonal' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'image' },
  },
});
