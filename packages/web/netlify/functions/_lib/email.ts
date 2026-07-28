/**
 * Transactional email via Resend.
 *
 * Same REST-over-fetch approach as `privacy-contact.ts` (no SDK). Two customer emails:
 *
 *   1. orderConfirmation — sent the moment payment succeeds.
 *   2. orderShipped      — sent when Amber marks the order shipped in the Studio.
 *
 * Why (2) is NOT sent when the label is bought: the webhook buys the Shippo label
 * seconds after payment, while the box is still on the counter. Emailing "your order
 * shipped" with a tracking number that won't scan for a day or two trains customers to
 * distrust our email. The label being ready and the parcel being gone are different
 * facts, so they get different triggers.
 *
 * Email must never break checkout. Every send is best-effort: it logs and returns false
 * rather than throwing, because a failed receipt must not un-capture a payment.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const FROM = process.env.ORDER_EMAIL_FROM ?? 'House of Rose <orders@updates.houseofrosefl.com>';
const REPLY_TO = process.env.ORDER_EMAIL_REPLY_TO ?? 'info@houseofrosefl.com';
const SITE = 'https://houseofrosefl.com';
const PHONE = '(844) 941-7673';

export interface EmailOrderItem {
  title: string;
  quantity: number;
  unitPrice: number; // cents
}

export interface EmailOrder {
  orderNumber: string;
  email: string;
  name?: string;
  items: EmailOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax?: number;
  total: number;
  shippingMethod?: string;
  shippingAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  trackingNumber?: string;
  trackingUrl?: string;
}

export interface LeadEmail {
  name: string;
  email: string;
  phone?: string;
  submissionType: 'contact' | 'consultation' | 'suiteRental' | 'skinAnalysis';
  serviceInterest?: string;
  message?: string;
  page?: string;
  landingPage?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  smsConsent?: string;
}

const esc = (v: string): string =>
  v
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const money = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

const firstName = (name?: string): string => (name?.trim().split(/\s+/)[0] ?? 'there');

/** Brand shell. Table-based + inline styles — email clients don't do modern CSS. */
function shell(heading: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en"><body style="margin:0;padding:0;background:#F4ECDC;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4ECDC;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#F8F4EC;border:1px solid rgba(201,162,75,.35);">
        <tr><td style="padding:32px 32px 8px;text-align:center;">
          <div style="font:400 11px/1 Arial,sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#7A5C2A;">House of Rose Aesthetics</div>
        </td></tr>
        <tr><td style="padding:16px 32px 0;">
          <h1 style="margin:0 0 16px;font:400 26px/1.3 Georgia,serif;color:#14110F;">${esc(heading)}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding:24px 32px 32px;border-top:1px solid rgba(201,162,75,.35);">
          <p style="margin:16px 0 0;font:400 12px/1.7 Arial,sans-serif;color:#5E5548;">
            Questions? Reply to this email or call us at ${PHONE}.<br />
            House of Rose Aesthetics · 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function itemsTable(order: EmailOrder): string {
  const rows = order.items
    .map(
      (i) => `<tr>
        <td style="padding:10px 0;font:400 14px/1.5 Arial,sans-serif;color:#14110F;border-bottom:1px solid rgba(201,162,75,.25);">
          ${esc(i.title)}<span style="color:#5E5548;"> × ${i.quantity}</span>
        </td>
        <td align="right" style="padding:10px 0;font:400 14px/1.5 Arial,sans-serif;color:#14110F;border-bottom:1px solid rgba(201,162,75,.25);">
          ${money(i.unitPrice * i.quantity)}
        </td>
      </tr>`,
    )
    .join('');

  const line = (label: string, value: string, bold = false): string =>
    `<tr>
      <td style="padding:6px 0;font:${bold ? '700' : '400'} 14px/1.5 Arial,sans-serif;color:${bold ? '#14110F' : '#5E5548'};">${esc(label)}</td>
      <td align="right" style="padding:6px 0;font:${bold ? '700' : '400'} 14px/1.5 Arial,sans-serif;color:#14110F;">${esc(value)}</td>
    </tr>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
    ${rows}
    ${line('Subtotal', money(order.subtotal))}
    ${line(order.shippingMethod ? `Shipping — ${order.shippingMethod}` : 'Shipping', order.shippingCost > 0 ? money(order.shippingCost) : 'Free')}
    ${line('Tax', money(order.tax ?? 0))}
    ${line('Total', money(order.total), true)}
  </table>`;
}

function addressBlock(order: EmailOrder): string {
  const a = order.shippingAddress;
  if (!a?.line1) return '';
  const lines = [
    order.name,
    a.line1,
    a.line2,
    [a.city, a.state, a.postalCode].filter(Boolean).join(', '),
  ].filter((l): l is string => Boolean(l));
  return `<p style="margin:0 0 24px;font:400 14px/1.7 Arial,sans-serif;color:#5E5548;">
    <span style="color:#14110F;font-weight:700;">Shipping to</span><br />${lines.map(esc).join('<br />')}
  </p>`;
}

async function send(to: string, subject: string, html: string, text: string, tag: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[email] RESEND_API_KEY is not set — skipping send.');
    return false;
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [to],
        reply_to: REPLY_TO,
        subject,
        html,
        text,
        tags: [{ name: 'type', value: tag }],
      }),
    });
    if (!res.ok) {
      console.error(`[email] Resend ${res.status}: ${await res.text().catch(() => '(unreadable)')}`);
      return false;
    }
    return true;
  } catch (error) {
    // Best-effort by design — a failed email must never fail a captured payment.
    console.error('[email] send failed', error);
    return false;
  }
}

/** Sent immediately on payment success. */
export async function sendOrderConfirmation(order: EmailOrder): Promise<boolean> {
  const html = shell(
    'Thank you for your order.',
    `<p style="margin:0 0 20px;font:400 15px/1.8 Arial,sans-serif;color:#5E5548;">
      ${esc(firstName(order.name))}, we've received your order and payment. Here's what's on the way.
    </p>
    <p style="margin:0 0 20px;font:400 13px/1.6 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7A5C2A;">
      Order ${esc(order.orderNumber)}
    </p>
    ${itemsTable(order)}
    ${addressBlock(order)}
    <p style="margin:0;font:400 15px/1.8 Arial,sans-serif;color:#5E5548;">
      We'll email you again with tracking as soon as your order ships.
    </p>`,
  );

  const text = [
    `Thank you for your order, ${firstName(order.name)}.`,
    ``,
    `Order ${order.orderNumber}`,
    ...order.items.map((i) => `  ${i.quantity} × ${i.title} — ${money(i.unitPrice * i.quantity)}`),
    ``,
    `Subtotal: ${money(order.subtotal)}`,
    `Shipping: ${order.shippingCost > 0 ? money(order.shippingCost) : 'Free'}`,
    `Tax: ${money(order.tax ?? 0)}`,
    `Total: ${money(order.total)}`,
    ``,
    `We'll email you again with tracking as soon as your order ships.`,
    ``,
    `Questions? Reply to this email or call ${PHONE}.`,
    SITE,
  ].join('\n');

  return send(order.email, `Your House of Rose order ${order.orderNumber}`, html, text, 'order-confirmation');
}

/** Sent when the order is actually marked shipped — not when the label is printed. */
export async function sendOrderShipped(order: EmailOrder): Promise<boolean> {
  const tracking = order.trackingNumber
    ? `<p style="margin:0 0 24px;font:400 15px/1.8 Arial,sans-serif;color:#5E5548;">
        <span style="color:#14110F;font-weight:700;">Tracking</span><br />
        ${
          order.trackingUrl
            ? `<a href="${esc(order.trackingUrl)}" style="color:#7A5C2A;">${esc(order.trackingNumber)}</a>`
            : esc(order.trackingNumber)
        }
        <br /><span style="font-size:13px;">It can take a day for the carrier's first scan to appear.</span>
      </p>`
    : '';

  const html = shell(
    'Your order is on its way.',
    `<p style="margin:0 0 20px;font:400 15px/1.8 Arial,sans-serif;color:#5E5548;">
      ${esc(firstName(order.name))}, your order has shipped${order.shippingMethod ? ` via ${esc(order.shippingMethod)}` : ''}.
    </p>
    <p style="margin:0 0 20px;font:400 13px/1.6 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7A5C2A;">
      Order ${esc(order.orderNumber)}
    </p>
    ${tracking}
    ${itemsTable(order)}
    ${addressBlock(order)}`,
  );

  const text = [
    `Your House of Rose order is on its way.`,
    ``,
    `Order ${order.orderNumber}`,
    order.shippingMethod ? `Shipped via ${order.shippingMethod}` : '',
    order.trackingNumber ? `Tracking: ${order.trackingNumber}` : '',
    order.trackingUrl ?? '',
    ``,
    ...order.items.map((i) => `  ${i.quantity} × ${i.title}`),
    ``,
    `Questions? Reply to this email or call ${PHONE}.`,
  ]
    .filter(Boolean)
    .join('\n');

  return send(order.email, `Your House of Rose order ${order.orderNumber} has shipped`, html, text, 'order-shipped');
}

const leadLabel = (type: LeadEmail['submissionType']): string => {
  if (type === 'consultation') return 'consultation request';
  if (type === 'skinAnalysis') return 'skin consultation request';
  if (type === 'suiteRental') return 'suite rental application';
  return 'message';
};

const leadHeading = (type: LeadEmail['submissionType']): string => {
  if (type === 'consultation') return 'Your consultation request is in.';
  if (type === 'skinAnalysis') return 'Your skin consultation request is in.';
  return 'Thank you for reaching out.';
};

/** Best-effort acknowledgment after the lead has been saved successfully. */
export async function sendLeadAcknowledgement(lead: LeadEmail): Promise<boolean> {
  const label = leadLabel(lead.submissionType);
  const heading = leadHeading(lead.submissionType);
  const responseWindow = lead.submissionType === 'suiteRental'
    ? 'Our team will review your application and follow up within two business days.'
    : 'Our team will review your request and follow up during business hours.';

  const html = shell(
    heading,
    `<p style="margin:0 0 20px;font:400 15px/1.8 Arial,sans-serif;color:#5E5548;">
      ${esc(firstName(lead.name))}, we received your ${esc(label)}. ${esc(responseWindow)}
    </p>
    ${lead.serviceInterest ? `<p style="margin:0 0 20px;font:400 14px/1.7 Arial,sans-serif;color:#5E5548;"><span style="color:#14110F;font-weight:700;">Interest</span><br />${esc(lead.serviceInterest)}</p>` : ''}
    <p style="margin:0;font:400 14px/1.7 Arial,sans-serif;color:#5E5548;">
      If your plans change, reply to this email or call or text ${PHONE}.
    </p>`,
  );

  const text = [
    `${firstName(lead.name)}, we received your ${label}.`,
    responseWindow,
    lead.serviceInterest ? `Interest: ${lead.serviceInterest}` : '',
    `Questions or changes? Reply to this email or call or text ${PHONE}.`,
    SITE,
  ].filter(Boolean).join('\n\n');

  return send(lead.email, 'We received your House of Rose request', html, text, 'lead-acknowledgement');
}

/** Best-effort internal notification. It is never sent to analytics. */
export async function sendLeadNotification(lead: LeadEmail): Promise<boolean> {
  const recipient = process.env.LEAD_NOTIFICATION_EMAIL ?? 'info@houseofrosefl.com';
  const rows = [
    ['Type', leadLabel(lead.submissionType)],
    ['Name', lead.name],
    ['Email', lead.email],
    ['Phone', lead.phone],
    ['Interest', lead.serviceInterest],
    ['Form page', lead.page],
    ['Landing page', lead.landingPage],
    ['UTM source', lead.utmSource],
    ['UTM medium', lead.utmMedium],
    ['UTM campaign', lead.utmCampaign],
    ['SMS consent', lead.smsConsent],
    ['Message', lead.message],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  const body = rows
    .map(([label, value]) => `<p style="margin:0 0 12px;font:400 14px/1.6 Arial,sans-serif;color:#5E5548;"><span style="color:#14110F;font-weight:700;">${esc(label)}</span><br />${esc(value)}</p>`)
    .join('');
  const html = shell(`New ${leadLabel(lead.submissionType)}`, body);
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n\n');

  return send(recipient, `New House of Rose ${leadLabel(lead.submissionType)}`, html, text, 'lead-notification');
}
