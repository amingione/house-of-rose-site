import { defineField, defineType } from 'sanity';

/**
 * A retail order placed through /checkout.
 *
 * Written by `netlify/functions/create-payment-intent.ts` as `pending` BEFORE the
 * customer pays, then promoted to `paid` (and given a shipping label) by
 * `netlify/functions/stripe-webhook.ts` once Stripe confirms the charge.
 *
 * Why the order is created before payment: the Stripe PaymentIntent can only carry
 * ~500 chars per metadata value, which is nowhere near enough for a line-item cart.
 * So we persist the real order here and hand Stripe only the Sanity `_id`. The
 * webhook then has a durable record to attach the payment and label to, and an
 * abandoned checkout simply leaves a `pending` order behind (useful data in itself).
 *
 * TWO editable controls, and both spend or promise something, so both are deliberate:
 *
 *   `buyLabel` — tick it to actually PURCHASE the shipping label (real postage, real
 *                money). Nothing buys a label automatically. Payment succeeding does not
 *                buy postage: a card can be fraudulent, stock can be wrong, an address
 *                can be typo'd, and a weight can be under-entered — all of which are
 *                cheaper to catch before you've paid USPS.
 *
 *   `status`   — flip to `shipped` once the parcel is really gone. THAT sends the
 *                customer their tracking email (netlify/functions/order-shipped.ts).
 *
 * Everything else is machine-written and locked: editing a price or a Stripe id here
 * would silently desync us from Stripe/Shippo.
 */
export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      description: 'Human-facing reference, e.g. HOR-1042. What a client quotes on the phone.',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description:
        'Set this to "Shipped" once the parcel is actually handed to the carrier — that is ' +
        'what emails the customer their tracking number. Do not mark it shipped just because ' +
        'the label printed.',
      options: {
        list: [
          { title: 'Pending payment', value: 'pending' },
          { title: 'Paid — needs a label', value: 'paid' },
          { title: 'Label purchased — ready to ship', value: 'readyToShip' },
          { title: 'Shipped (emails the customer tracking)', value: 'shipped' },
          { title: 'Payment failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({ readOnly: true, name: 'placedAt', title: 'Placed At', type: 'datetime' }),

    // ── Customer ──
    defineField({ readOnly: true, name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ readOnly: true, name: 'phone', title: 'Phone', type: 'string' }),

    // ── Line items (denormalised on purpose) ──
    // Snapshot of title/price AT TIME OF PURCHASE. If a product is later renamed or
    // repriced in Sanity, the order must still show what the client actually bought.
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'orderItem',
          fields: [
            { name: 'product', title: 'Product', type: 'reference', to: [{ type: 'product' }] },
            { name: 'title', title: 'Title (at purchase)', type: 'string' },
            { name: 'quantity', title: 'Quantity', type: 'number' },
            { name: 'unitPrice', title: 'Unit Price (cents, at purchase)', type: 'number' },
          ],
          preview: {
            select: { title: 'title', quantity: 'quantity', unitPrice: 'unitPrice' },
            prepare: ({ title, quantity, unitPrice }) => ({
              title: `${quantity ?? 1} × ${title ?? 'Item'}`,
              subtitle: unitPrice ? `$${((unitPrice * (quantity ?? 1)) / 100).toFixed(2)}` : undefined,
            }),
          },
        },
      ],
    }),

    // ── Money (all in cents, matching Stripe) ──
    defineField({ readOnly: true, name: 'subtotal', title: 'Subtotal (cents)', type: 'number' }),
    defineField({ readOnly: true, name: 'shippingCost', title: 'Shipping (cents)', type: 'number' }),
    defineField({ readOnly: true, name: 'tax', title: 'Tax (cents)', type: 'number' }),
    defineField({ readOnly: true, name: 'total', title: 'Total (cents)', type: 'number' }),

    // ── Shipping ──
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'name', type: 'string', title: 'Name' },
        { name: 'line1', type: 'string', title: 'Address Line 1' },
        { name: 'line2', type: 'string', title: 'Address Line 2' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'state', type: 'string', title: 'State' },
        { name: 'postalCode', type: 'string', title: 'ZIP' },
        { name: 'country', type: 'string', title: 'Country' },
      ],
    }),
    defineField({
      name: 'shippingMethod',
      title: 'Shipping Method',
      type: 'string',
      description: 'Carrier + service the client chose, e.g. "USPS Priority Mail".',
    }),
    defineField({ readOnly: true, name: 'trackingNumber', title: 'Tracking Number', type: 'string' }),
    defineField({ name: 'trackingUrl', title: 'Tracking URL', type: 'url' }),
    defineField({
      name: 'buyLabel',
      title: '⚠️ Purchase shipping label',
      type: 'boolean',
      description:
        'Tick this and publish to BUY THE LABEL — this spends real postage money. Labels are ' +
        'never bought automatically. Check the address, confirm the item is actually on the ' +
        'shelf, and make sure the weight is right first. If the original rate has expired ' +
        '(Shippo rates last about a week) we re-quote the same service automatically.',
      initialValue: false,
      hidden: ({ parent }) => parent?.status === 'pending' || Boolean(parent?.shippoTransactionId),
    }),
    defineField({
      readOnly: true,
      name: 'labelCost',
      title: 'Label Cost (cents)',
      type: 'number',
      description:
        'What the postage actually cost us. Compare to "Shipping (cents)" — what the client ' +
        'paid. A gap means the weight was wrong or the rate moved.',
    }),
    defineField({
      name: 'labelUrl',
      title: 'Shipping Label (PDF)',
      type: 'url',
      description: 'Shippo label — open and print to ship the order.',
    }),

    // ── External references ──
    defineField({ readOnly: true, name: 'stripePaymentIntentId', title: 'Stripe PaymentIntent', type: 'string' }),
    defineField({ readOnly: true, name: 'shippoRateId', title: 'Shippo Rate ID', type: 'string' }),
    defineField({ readOnly: true, name: 'shippoTransactionId', title: 'Shippo Transaction ID', type: 'string' }),
    defineField({
      readOnly: true,
      name: 'shippedEmailSentAt',
      title: 'Shipping Email Sent At',
      type: 'datetime',
      description:
        'Set automatically once the tracking email goes out. Its presence is what stops a ' +
        'Sanity webhook retry from emailing the customer "it shipped!" three times.',
    }),
    defineField({
      name: 'fulfillmentError',
      title: 'Fulfillment Error',
      type: 'text',
      description:
        'Set when the payment succeeded but buying the label failed. The money is captured — ' +
        'this order needs a label bought by hand. Check these first.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'placedAtDesc',
      by: [{ field: 'placedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { orderNumber: 'orderNumber', status: 'status', total: 'total', name: 'name' },
    prepare: ({ orderNumber, status, total, name }) => ({
      title: `${orderNumber ?? 'Order'} — ${name ?? 'Unknown'}`,
      subtitle: `${status ?? 'pending'} · $${((total ?? 0) / 100).toFixed(2)}`,
    }),
  },
});
